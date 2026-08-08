"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

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

/**
 * Fade-and-rise on first scroll into view. Fires once.
 *
 * Every motion component in this folder checks `useReducedMotion()` and
 * renders the final state immediately when the visitor has asked for reduced
 * motion — the content is never gated behind an animation that will not run.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  from = "bottom",
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  const offset =
    from === "bottom"
      ? { y: OFFSET }
      : from === "left"
        ? { x: -OFFSET }
        : from === "right"
          ? { x: OFFSET }
          : {};

  if (reduce) return <Component className={className}>{children}</Component>;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: OFFSET },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

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
  const reduce = useReducedMotion();
  const Component = motion[as];

  if (reduce) return <Component className={className}>{children}</Component>;

  return (
    <Component
      className={className}
      variants={staggerParent}
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
  const reduce = useReducedMotion();
  const Component = motion[as];

  if (reduce) return <Component className={cn(className)}>{children}</Component>;

  return (
    <Component className={cn(className)} variants={staggerChild}>
      {children}
    </Component>
  );
}
