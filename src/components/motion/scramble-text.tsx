"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Decode-in text effect: each character starts as random glyph noise and
 * resolves left to right, like a value settling in a debugger. Cycles through
 * the phrases and repeats.
 *
 * Chosen over a typewriter because it fills its final width immediately —
 * nothing below it shifts as the line resolves — and because the glyph churn
 * reads as motion even while the layout is completely still.
 */

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";
/** Frames each character spends scrambling before it locks. */
const SCRAMBLE_FRAMES = 12;
/** Frames between one character locking and the next starting. */
const STAGGER = 2;
const HOLD_MS = 2600;

export function ScrambleText({
  phrases,
  className,
  cursorClassName,
}: {
  phrases: readonly string[];
  className?: string;
  cursorClassName?: string;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState(phrases[0] ?? "");
  const frameRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (reduce) return;

    const target = phrases[index] ?? "";
    let frame = 0;
    let cancelled = false;

    function tick() {
      if (cancelled) return;

      let output = "";
      let done = true;

      for (let i = 0; i < target.length; i++) {
        const start = i * STAGGER;
        const char = target[i];

        // Spaces never scramble — otherwise word boundaries jitter and the
        // line looks like it is wrapping.
        if (char === " ") {
          output += " ";
          continue;
        }

        if (frame >= start + SCRAMBLE_FRAMES) {
          output += char;
        } else if (frame >= start) {
          output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          done = false;
        } else {
          output += " ";
          done = false;
        }
      }

      setDisplay(output);

      if (done) {
        // Hold the resolved phrase, then move to the next.
        timeoutRef.current = setTimeout(() => {
          if (!cancelled) setIndex((i) => (i + 1) % phrases.length);
        }, HOLD_MS);
        return;
      }

      frame += 1;
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [index, phrases, reduce]);

  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");

  if (reduce) {
    return <span className={className}>{phrases[0]}</span>;
  }

  return (
    <span className={cn("relative inline-block", className)}>
      {/* Reserve the final height so nothing below shifts between phrases. */}
      <span aria-hidden className="invisible block">
        {longest}
      </span>

      <span className="absolute inset-0 block">
        {/* Announce only the settled phrase — not every scrambled frame. */}
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {phrases[index]}
        </span>
        <span aria-hidden className="whitespace-pre-wrap">
          {display}
        </span>
        <span
          aria-hidden
          className={cn(
            "ml-1 inline-block h-[0.78em] w-[0.5ch] translate-y-[0.04em] animate-pulse bg-current align-baseline",
            cursorClassName,
          )}
        />
      </span>
    </span>
  );
}
