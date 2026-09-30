import type { CSSProperties } from "react";

import { site, type StructField } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The "about me" block on the home page, rendered as a C++ struct.
 *
 * Tokens are coloured by hand rather than by a syntax highlighter — there are
 * six token kinds here, and pulling in Shiki to colour a fixed 12-line snippet
 * would ship a grammar and a theme to every visitor for no gain.
 */

const KEYWORD = "text-accent";
const TYPE = "text-accent-2";
const NAME = "text-foreground";
const STRING = "text-[#a86f44] dark:text-[#d9b08c]";
const PUNCT = "text-subtle";

function Value({ value }: { value: StructField["value"] }) {
  if (Array.isArray(value)) {
    return (
      <>
        <span className={PUNCT}>{"{"}</span>
        {value.map((item, i) => (
          <span key={item}>
            <span className={STRING}>&quot;{item}&quot;</span>
            {i < value.length - 1 && <span className={PUNCT}>, </span>}
          </span>
        ))}
        <span className={PUNCT}>{"}"}</span>
      </>
    );
  }
  return <span className={STRING}>&quot;{value}&quot;</span>;
}

/**
 * Glyphs that float either side of the card — C++ tokens rather than generic
 * code symbols, so the decoration matches the language in the window.
 *
 * Negative delays start each one mid-cycle; without them all six bob in
 * lockstep, which reads as a single moving block instead of ambient drift.
 */
const GLYPHS = [
  { symbol: "{ }", side: "left", at: "top-[7%]", tone: "text-accent/70", dur: "7s", delay: "0s", onPhone: true },
  { symbol: "::", side: "right", at: "top-[13%]", tone: "text-subtle", dur: "8.5s", delay: "-2.4s", onPhone: true },
  { symbol: "#", side: "left", at: "top-[45%]", tone: "text-subtle", dur: "9.5s", delay: "-4.1s", onPhone: false },
  { symbol: "&", side: "right", at: "top-[52%]", tone: "text-accent-2/70", dur: "7.5s", delay: "-1.2s", onPhone: false },
  { symbol: "01", side: "left", at: "bottom-[10%]", tone: "text-subtle", dur: "8s", delay: "-5.6s", onPhone: true },
  { symbol: "->", side: "right", at: "bottom-[5%]", tone: "text-accent/70", dur: "10s", delay: "-3.3s", onPhone: true },
] as const;

function Glyph({ symbol, side, at, tone, dur, delay, onPhone }: (typeof GLYPHS)[number]) {
  return (
    <span
      className={cn(
        "absolute items-center gap-1 md:gap-1.5",
        at,
        // The four corner glyphs survive down to the smallest screens; the two
        // mid-height ones drop out, because on a phone they land beside the
        // densest part of the snippet and read as clutter rather than accent.
        onPhone ? "flex" : "hidden md:flex",
        // `right-full` / `left-full` pins the marker flush outside the card
        // edge, so no offset needs recomputing if the card changes width.
        // The tighter phone margin keeps it inside a 1.5rem page gutter.
        side === "left" ? "right-full mr-1 md:mr-2" : "left-full ml-1 flex-row-reverse md:ml-2",
      )}
      // Inline because every glyph carries a different duration and phase.
      // The reduced-motion rule in globals.css still overrides this.
      style={{ animation: `glyph-float ${dur} ease-in-out ${delay} infinite` } as CSSProperties}
    >
      {/* nowrap because an absolutely positioned box with only one horizontal
          offset set sizes to min-content, which would break `{ }` at its
          space and stack it onto two lines. */}
      <span
        className={cn(
          "whitespace-nowrap font-mono text-[0.5rem] leading-none opacity-80 md:text-[0.625rem] md:opacity-100",
          tone,
        )}
      >
        {symbol}
      </span>

      {/* The leader is xl-only: from lg to xl the card has just 2.5rem of page
          gutter to its right, which fits the glyph but not the line. */}
      <span className="hidden h-px w-4 bg-border-strong/70 xl:block" />
      <span className="hidden size-1 rounded-full bg-accent xl:block" />
    </span>
  );
}

/** Minimize / maximize / close: 46px wide like the real Windows 11 buttons. */
const CAPTION_BUTTON =
  "grid w-[46px] place-items-center text-muted transition-colors duration-150 hover:bg-foreground/[0.06] hover:text-foreground";

/** The small document glyph Windows puts before a file's name in the title bar. */
function FileIcon() {
  return (
    <svg viewBox="0 0 12 14" className="h-3.5 w-3 text-accent">
      <path
        d="M1.5 0.5h6l3 3v9a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M7.5 0.5v3h3" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function StructCard({ className }: { className?: string }) {
  return (
    // The wrapper is the positioning context for the glyphs and must not clip,
    // so `overflow-hidden` stays on the card itself.
    <div className={cn("relative", className)}>
      {/* Hangs off whichever space the layout leaves beside the card: the grid
          gap in the two-column hero, the page gutter once it stacks. Each
          glyph decides for itself how far down it scales — see GLYPHS. */}
      <div aria-hidden className="pointer-events-none">
        {GLYPHS.map((glyph) => (
          <Glyph key={glyph.symbol} {...glyph} />
        ))}
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface/70 shadow-card backdrop-blur-sm">
        {/* Window chrome, Windows 11 style: title on the left, flat caption
            buttons on the right that fill the bar's height. Decorative only. */}
        <div aria-hidden className="flex h-9 items-stretch border-b border-border bg-surface">
          <div className="flex flex-1 items-center gap-2 pl-3">
            <FileIcon />
            <span className="font-mono text-xs text-subtle">faiyaj.hpp</span>
          </div>
          <span className={CAPTION_BUTTON}>
            <svg viewBox="0 0 10 10" className="size-2.5">
              <path d="M0 5h10" stroke="currentColor" strokeWidth="1" />
            </svg>
          </span>
          <span className={CAPTION_BUTTON}>
            <svg viewBox="0 0 10 10" className="size-2.5">
              <rect x="0.5" y="0.5" width="9" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </span>
          <span className={cn(CAPTION_BUTTON, "hover:bg-[#c42b1c] hover:text-white")}>
            <svg viewBox="0 0 10 10" className="size-2.5">
              <path d="M0.5 0.5l9 9M9.5 0.5l-9 9" stroke="currentColor" strokeWidth="1" />
            </svg>
          </span>
        </div>

        {/* The snippet is decorative for screen readers — the same facts are on
            the About page as real prose. */}
        <pre
          aria-hidden
          className="overflow-x-auto p-5 font-mono text-[0.8125rem] leading-relaxed md:p-6"
        >
          <code>
            <span className={KEYWORD}>struct</span> <span className={TYPE}>{site.structName}</span>{" "}
            <span className={PUNCT}>{"{"}</span>
            {"\n"}
            {site.structFields.map((field) => (
              <span key={field.name}>
                {"    "}
                <span className={TYPE}>{field.type}</span>{" "}
                <span className={NAME}>{field.name}</span>
                <span className={PUNCT}> = </span>
                <Value value={field.value} />
                <span className={PUNCT}>;</span>
                {"\n"}
              </span>
            ))}
            <span className={PUNCT}>{"};"}</span>
          </code>
        </pre>

        <p className="sr-only">
          {site.name} studies {site.structFields.find((f) => f.name === "major")?.value} at the
          University of Michigan, graduating May 2028. Based in {site.location}. Contact:{" "}
          {site.email}.
        </p>
      </div>
    </div>
  );
}
