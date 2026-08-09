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
  { symbol: "{ }", side: "left", at: "top-[7%]", tone: "text-accent/70", dur: "7s", delay: "0s" },
  { symbol: "::", side: "right", at: "top-[13%]", tone: "text-subtle", dur: "8.5s", delay: "-2.4s" },
  { symbol: "#", side: "left", at: "top-[45%]", tone: "text-subtle", dur: "9.5s", delay: "-4.1s" },
  { symbol: "&", side: "right", at: "top-[52%]", tone: "text-accent-2/70", dur: "7.5s", delay: "-1.2s" },
  { symbol: "01", side: "left", at: "bottom-[10%]", tone: "text-subtle", dur: "8s", delay: "-5.6s" },
  { symbol: "->", side: "right", at: "bottom-[5%]", tone: "text-accent/70", dur: "10s", delay: "-3.3s" },
] as const;

function Glyph({ symbol, side, at, tone, dur, delay }: (typeof GLYPHS)[number]) {
  return (
    <span
      className={cn(
        "absolute flex items-center gap-1.5",
        at,
        // `right-full` / `left-full` pins the marker flush outside the card
        // edge, so no offset needs recomputing if the card changes width.
        side === "left" ? "right-full mr-2" : "ml-2 left-full flex-row-reverse",
      )}
      // Inline because every glyph carries a different duration and phase.
      // The reduced-motion rule in globals.css still overrides this.
      style={{ animation: `glyph-float ${dur} ease-in-out ${delay} infinite` } as CSSProperties}
    >
      {/* nowrap because an absolutely positioned box with only one horizontal
          offset set sizes to min-content, which would break `{ }` at its
          space and stack it onto two lines. */}
      <span className={cn("whitespace-nowrap font-mono text-[0.625rem] leading-none", tone)}>
        {symbol}
      </span>

      {/* The leader is xl-only: from lg to xl the card has just 2.5rem of page
          gutter to its right, which fits the glyph but not the line. */}
      <span className="hidden h-px w-4 bg-border-strong/70 xl:block" />
      <span className="hidden size-1 rounded-full bg-accent xl:block" />
    </span>
  );
}

export function StructCard({ className }: { className?: string }) {
  return (
    // The wrapper is the positioning context for the glyphs and must not clip,
    // so `overflow-hidden` stays on the card itself.
    <div className={cn("relative", className)}>
      {/* Works stacked as well as beside the intro: once the card goes full
          width the glyphs hang in the page gutter, which is 2.5rem from md up.
          Below md that gutter drops to 1.5rem and they'd touch the screen
          edge, so that is where they stop. */}
      <div aria-hidden className="pointer-events-none hidden md:block">
        {GLYPHS.map((glyph) => (
          <Glyph key={glyph.symbol} {...glyph} />
        ))}
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface/70 shadow-card backdrop-blur-sm">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-xs text-subtle">faiyaj.hpp</span>
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
