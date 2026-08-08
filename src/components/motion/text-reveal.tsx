"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Headline animation: each word clips up from behind a mask.
 *
 * The full string stays in the DOM as a visually-hidden node so screen
 * readers and crawlers read one sentence, not a pile of word fragments.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex flex-wrap">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="overflow-hidden py-[0.06em] pr-[0.26em]">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.85,
                delay: delay + i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

/** Same effect, but triggered when scrolled into view instead of on mount. */
export function TextRevealOnScroll({
  text,
  className,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "p";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) return <Tag className={cn(className)}>{text}</Tag>;

  return (
    <Tag className={cn(className)}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="inline-flex flex-wrap"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="overflow-hidden py-[0.06em] pr-[0.26em]">
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: "110%" },
                show: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
