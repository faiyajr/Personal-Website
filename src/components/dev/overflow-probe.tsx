"use client";

import { useEffect, useState } from "react";

/**
 * Temporary diagnostic. Add `?debug=overflow` to any URL and it lists every
 * element sticking out past the viewport, innermost cause first.
 *
 * It exists because `body { overflow-x: hidden }` in globals.css suppresses the
 * horizontal scrollbar, so an element that is too wide gives no visible signal
 * beyond content being sliced at the right edge — which is impossible to trace
 * on a phone without a debugger attached.
 *
 * Delete this file and its mount in `layout.tsx` once the culprit is fixed.
 */

type Offender = { label: string; left: number; right: number; width: number };

function describe(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const cls = (el.getAttribute("class") ?? "").trim().split(/\s+/).slice(0, 6).join(" ");
  return cls ? `${tag}.${cls}` : tag;
}

export function OverflowProbe() {
  const [offenders, setOffenders] = useState<Offender[] | null>(null);
  const [viewport, setViewport] = useState(0);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("debug") !== "overflow") return;

    const scan = () => {
      const limit = document.documentElement.clientWidth;
      const found: Offender[] = [];

      for (const el of Array.from(document.body.querySelectorAll("*"))) {
        if (el.closest("[data-overflow-probe]")) continue;

        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        // 1px of slack absorbs sub-pixel rounding.
        if (r.right <= limit + 1 && r.left >= -1) continue;

        found.push({
          label: describe(el),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
        });
      }

      // Widest first: the outermost box is usually the real cause and the rest
      // are its children inheriting the bad width.
      found.sort((a, b) => b.width - a.width);
      setViewport(limit);
      setOffenders(found.slice(0, 12));
    };

    scan();
    // Fonts land after first paint and change text metrics, so measure again.
    document.fonts?.ready.then(scan).catch(() => {});
    window.addEventListener("resize", scan);
    return () => window.removeEventListener("resize", scan);
  }, []);

  if (!offenders) return null;

  return (
    <div
      data-overflow-probe
      style={{
        position: "fixed",
        insetInline: 0,
        bottom: 0,
        zIndex: 9999,
        maxHeight: "45vh",
        overflowY: "auto",
        background: "#111",
        color: "#eee",
        font: "11px/1.5 ui-monospace, monospace",
        padding: "10px 12px",
        borderTop: "2px solid #f5a",
      }}
    >
      <div style={{ color: "#f5a", marginBottom: 6 }}>
        viewport {viewport}px · {offenders.length} overflowing
      </div>
      {offenders.length === 0 && <div>nothing overflows at this width</div>}
      {offenders.map((o, i) => (
        <div key={i} style={{ marginBottom: 4, wordBreak: "break-all" }}>
          <span style={{ color: "#7ec" }}>
            {o.width}px [{o.left}→{o.right}]
          </span>{" "}
          {o.label}
        </div>
      ))}
    </div>
  );
}
