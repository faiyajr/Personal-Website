"use client";

import { motion, type Variants } from "motion/react";

import { useMotionScale } from "@/components/motion/use-motion-scale";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait before starting. Use for hand-tuned sequences. */
  delay?: number;
  /** Direction the element travels in from. */
  from?: "bottom" | "left" | "right" | "none";
  as?: "div" | "section" | "li" | "span" | "article";
};

const OFFSET = 28;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Fade-and-rise on first scroll into view. Fires once.
 *
 * Reduced motion is handled by scaling the duration to zero rather than by
 * rendering different markup — see `useMotionScale`.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  from = "bottom",
  as = "div",
}: RevealProps) {
  const scale = useMotionScale();
  const Component = motion[as];

  const offset =
    from === "bottom"
      ? { y: OFFSET }
      : from === "left"
        ? { x: -OFFSET }
        : from === "right"
          ? { x: OFFSET }
          : {};

  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 * scale, delay: delay * scale, ease: EASE }}
    >
      {children}
    </Component>
  );
}

const staggerParent = (scale: number): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 * scale, delayChildren: 0.05 * scale },
  },
});

const staggerChild = (scale: number): Variants => ({
  hidden: { opacity: 0, y: OFFSET },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 * scale, ease: EASE } },
});

/** Wrap a list; each `<StaggerItem>` inside animates in sequence. */
export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "section";
}) {
  const scale = useMotionScale();
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={staggerParent(scale)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const scale = useMotionScale();
  const Component = motion[as];

  return (
    <Component className={cn(className)} variants={staggerChild(scale)}>
      {children}
    </Component>
  );
}
