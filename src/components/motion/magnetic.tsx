"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

import { useMotionEnabled } from "@/components/motion/use-motion-scale";

/**
 * Pulls its child gently toward the cursor on hover. Pointer-device only —
 * `(hover: hover)` is checked so this is inert on touch screens, where the
 * effect would otherwise fire on tap and feel broken.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const animate = useMotionEnabled();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  function handleMove(event: React.MouseEvent<HTMLSpanElement>) {
    if (!animate || !ref.current) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
