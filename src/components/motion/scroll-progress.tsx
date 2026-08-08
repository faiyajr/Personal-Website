"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin accent bar pinned to the top of the viewport tracking page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[110] h-0.5 origin-left bg-accent"
    />
  );
}
