"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useMotionEnabled, useMotionScale } from "@/components/motion/use-motion-scale";
import { cn } from "@/lib/utils";

/**
 * Looping headline: each phrase drops in word by word out of a heavy blur,
 * holds, then blurs away upward as the next one arrives. Runs forever.
 *
 * Markup never depends on reduced motion — only the durations do — so the
 * server and client render identically. See `useMotionScale`.
 *
 * Layout: the phrases are stacked in a single CSS grid cell rather than
 * absolutely positioned. A grid cell grows to fit its tallest child, so a
 * phrase that wraps to two lines pushes the block taller instead of spilling
 * over the paragraph underneath — which is what absolute positioning did.
 */

const ENTER = 0.8;
const EXIT = 0.4;
const STAGGER = 0.085;
const HOLD_MS = 2400;
const EASE = [0.16, 1, 0.3, 1] as const;

export function BlurCycle({
  phrases,
  className,
}: {
  phrases: readonly string[];
  className?: string;
}) {
  const scale = useMotionScale();
  const animate = useMotionEnabled();
  const [index, setIndex] = useState(0);

  const words = (phrases[index] ?? "").split(" ");

  useEffect(() => {
    // Cycling text is itself motion — hold on the first phrase when the
    // visitor has asked for less of it. This is behaviour, not markup, and
    // the first render is identical either way, so hydration is unaffected.
    if (!animate || phrases.length < 2) return;

    const enterMs = (ENTER + words.length * STAGGER) * 1000;
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % phrases.length),
      enterMs + HOLD_MS,
    );

    return () => clearTimeout(timer);
  }, [index, phrases, animate, words.length]);

  return (
    // `grid-cols-1` is load-bearing: it compiles to minmax(0, 1fr), which ties
    // the column to the container. Left implicit, the column is `auto` and
    // grows to the max-content of the longest phrase — every phrase on one
    // line — which this component then pushes up through its ancestors.
    <span className={cn("grid grid-cols-1 min-w-0 max-w-full", className)}>
      {/* Every phrase, invisible and stacked, so the cell is always as tall as
          the tallest one and the line below never jumps between phrases.

          These have to use the same word boxes as the animated copy below, not
          plain text. Flex-wrapped words need more width per line than inline
          text does — each word's `pr` counts toward the line and does not
          collapse at a break — so measuring plain text under-reserved the
          height, and on narrow screens the longest phrase wrapped to one more
          line than the cell had room for and spilled onto the paragraph. */}
      {phrases.map((phrase) => (
        <span
          key={phrase}
          aria-hidden
          className="invisible flex min-w-0 flex-wrap [grid-area:1/1]"
        >
          {phrase.split(" ").map((word, i) => (
            <span key={`${word}-${i}`} className="inline-block pr-[0.26em]">
              {word}
            </span>
          ))}
        </span>
      ))}

      <span className="min-w-0 [grid-area:1/1]">
        {/* Announce only the settled phrase, not each word as it lands. */}
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {phrases[index]}
        </span>

        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            aria-hidden
            // Block-level `flex`, matching the measurement spans above. As an
            // `inline-flex` this was shrink-to-fit and could wrap at a
            // different width than what was measured.
            className="flex flex-wrap"
            initial="hidden"
            animate="show"
            exit="out"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: STAGGER * scale } },
              out: { transition: { staggerChildren: 0.03 * scale, staggerDirection: -1 } },
            }}
          >
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                className="inline-block pr-[0.26em] will-change-[transform,filter,opacity]"
                variants={{
                  hidden: { opacity: 0, y: "-0.5em", filter: "blur(14px)" },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: ENTER * scale, ease: EASE },
                  },
                  out: {
                    opacity: 0,
                    y: "0.35em",
                    filter: "blur(10px)",
                    transition: { duration: EXIT * scale, ease: "easeIn" },
                  },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
