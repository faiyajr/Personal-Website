"use client";

import { useReducedMotion } from "motion/react";

/**
 * True when animations should play even though the OS asks for reduced
 * motion. Development only — see `forceMotionEnabled` below.
 */
export const FORCE_MOTION =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_FORCE_MOTION === "1";

/**
 * Timing multiplier that is safe to read during render: 1 normally, 0 when
 * the visitor has asked for reduced motion.
 *
 * ── Why this exists ───────────────────────────────────────────────────────
 * `useReducedMotion()` cannot resolve on the server — there is no media query
 * to read — so it reports one thing during SSR and possibly another on the
 * client's first render. Branching on it to choose different MARKUP, or a
 * different `initial` style, therefore guarantees a hydration mismatch.
 *
 * `transition` values are safe: they are never serialised into the SSR HTML.
 * So the rule this hook exists to enforce is:
 *
 *   ✅  transition={{ duration: 0.7 * scale }}
 *   ❌  initial={reduce ? false : { opacity: 0 }}
 *   ❌  if (reduce) return <span>{text}</span>
 *
 * Multiplying every duration and delay by the scale collapses animations to
 * zero-length — the element still starts from `initial` and lands on its
 * final state, just instantly. Same markup, no mismatch, motion respected.
 *
 * ── Previewing animations with reduced motion switched on ─────────────────
 * Set NEXT_PUBLIC_FORCE_MOTION=1 in `.env.local` and restart the dev server.
 * The override is compiled out of production builds regardless of the env
 * var, so it can never override a real visitor's accessibility preference.
 */
export function useMotionScale(): number {
  const reduce = useReducedMotion();

  if (FORCE_MOTION) return 1;
  return reduce ? 0 : 1;
}

/**
 * Boolean form, for gating *behaviour* rather than timing: autoplaying a
 * slideshow, cycling a headline, running a canvas loop, tilting on hover.
 *
 * Safe in effects and event handlers. NOT safe for choosing markup — see the
 * rule above.
 */
export function useMotionEnabled(): boolean {
  return useMotionScale() === 1;
}
