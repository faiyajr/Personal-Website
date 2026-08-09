"use client";

import { motion } from "motion/react";

import { useMotionScale } from "@/components/motion/use-motion-scale";

/**
 * Page-title entrance: each word drops in from above while a heavy blur
 * resolves to sharp — like the headline focusing into place. Plays once.
 *
 * The full string stays in the DOM as a visually-hidden node so screen
 * readers and crawlers get one sentence, not a pile of word fragments.
 */
export function BlurReveal({
  text,
  className,
  delay = 0,
  as: Tag = "h1",
  /** Fire on scroll into view instead of on mount. */
  onScroll = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
  onScroll?: boolean;
}) {
  const scale = useMotionScale();
  const words = text.split(" ");

  const trigger = onScroll
    ? { whileInView: "show" as const, viewport: { once: true, margin: "-100px" } }
    : { animate: "show" as const };

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="inline-flex flex-wrap"
        initial="hidden"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.09 * scale, delayChildren: delay * scale },
          },
        }}
        {...trigger}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block pr-[0.26em] will-change-[transform,filter,opacity]"
            variants={{
              hidden: { opacity: 0, y: "-0.45em", filter: "blur(14px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.85 * scale, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
