"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type Phase = "typing" | "pausing" | "deleting";

const TYPE_MS = 55;
const DELETE_MS = 28;
const HOLD_MS = 1800;

/**
 * Types each phrase out, holds it, deletes it, moves to the next, loops.
 *
 * The longest phrase is rendered invisibly underneath so the element reserves
 * its final height up front — otherwise the paragraph below jumps every time
 * the line wraps or unwraps mid-type.
 */
export function TypingText({
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
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    if (reduce) return;

    const current = phrases[index] ?? "";

    // Each tick schedules exactly one timer; setState happens inside the
    // callback, never synchronously in the effect body.
    const timer = setTimeout(
      () => {
        if (phase === "typing") {
          if (text.length < current.length) {
            setText(current.slice(0, text.length + 1));
          } else {
            setPhase("pausing");
          }
        } else if (phase === "pausing") {
          setPhase("deleting");
        } else {
          if (text.length > 0) {
            setText(current.slice(0, text.length - 1));
          } else {
            setIndex((i) => (i + 1) % phrases.length);
            setPhase("typing");
          }
        }
      },
      phase === "pausing" ? HOLD_MS : phase === "typing" ? TYPE_MS : DELETE_MS,
    );

    return () => clearTimeout(timer);
  }, [text, phase, index, phrases, reduce]);

  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");

  if (reduce) {
    return <span className={className}>{phrases[0]}</span>;
  }

  return (
    <span className={cn("relative inline-block", className)}>
      {/* Height reservation — invisible, never announced. */}
      <span aria-hidden className="invisible block">
        {longest}
      </span>
      <span className="absolute inset-0 block">
        <span aria-live="polite" aria-atomic="true">
          {text}
        </span>
        <span
          aria-hidden
          className={cn(
            "ml-0.5 inline-block w-[0.08em] animate-pulse self-stretch bg-current align-middle",
            "h-[0.9em]",
            cursorClassName,
          )}
        />
      </span>
    </span>
  );
}
