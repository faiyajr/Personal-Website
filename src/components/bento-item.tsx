"use client";

import { motion, useReducedMotion } from "motion/react";

import type { CardSize } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * A single cell of the bento grid: owns the column/row span and the
 * scroll-in animation, so `ProjectCard` stays layout-agnostic and can be
 * reused in any container.
 */
const spanClasses: Record<CardSize, string> = {
  sm: "md:col-span-2",
  md: "md:col-span-3",
  lg: "md:col-span-4",
  wide: "md:col-span-6",
  tall: "md:col-span-2 md:row-span-2",
};

export function BentoItem({
  size = "md",
  index = 0,
  className,
  children,
}: {
  size?: CardSize;
  index?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const classes = cn(spanClasses[size], className);

  if (reduce) return <div className={classes}>{children}</div>;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.75,
        // Cap the stagger so cards far down the page do not sit blank while
        // a long delay chain plays out.
        delay: Math.min(index, 5) * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
