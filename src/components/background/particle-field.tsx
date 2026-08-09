"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas particle field with cursor repulsion.
 *
 * Each particle drifts on a constant base velocity. The cursor applies an
 * inverse-square push inside a radius, and a spring pulls the displacement
 * back to zero — so the field parts around the pointer and settles again
 * rather than permanently deforming.
 *
 * Costs nothing when it should not run: disabled entirely under
 * `prefers-reduced-motion`, paused when the tab is hidden, and the particle
 * count scales with viewport area.
 */

type Particle = {
  /** Base position, moved only by drift. */
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Offset from base caused by the cursor, spring-damped back to zero. */
  ox: number;
  oy: number;
  odx: number;
  ody: number;
  r: number;
};

const REPEL_RADIUS = 140;
const REPEL_STRENGTH = 1400;
const SPRING = 0.045;
const DAMPING = 0.86;
const LINK_DISTANCE = 130;

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // `.force-motion` is the development-only preview switch — see
    // `useMotionScale`. Absent in production, so a real reduced-motion
    // preference always wins there.
    const forced = document.documentElement.classList.contains("force-motion");
    if (!forced && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let running = true;

    const pointer = { x: -9999, y: -9999, active: false };

    /** Read the themed colour off the document so the canvas follows the theme. */
    function themeColours() {
      const styles = getComputedStyle(document.documentElement);
      return {
        dot: styles.getPropertyValue("--particle").trim() || "#116466",
        alpha: Number(styles.getPropertyValue("--particle-opacity").trim() || 0.4),
      };
    }

    let colours = themeColours();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // ~1 particle per 18k css pixels, clamped so phones and ultrawides both
      // get a sensible density.
      const target = Math.round(
        Math.min(90, Math.max(24, (width * height) / 18000)),
      );

      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        ox: 0,
        oy: 0,
        odx: 0,
        ody: 0,
        r: Math.random() * 1.6 + 0.9,
      }));
    }

    function step() {
      if (!running) return;
      frame = requestAnimationFrame(step);

      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        // Drift, wrapping at the edges.
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Cursor repulsion, inverse-square, capped at the radius.
        if (pointer.active) {
          const dx = p.x + p.ox - pointer.x;
          const dy = p.y + p.oy - pointer.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < REPEL_RADIUS * REPEL_RADIUS && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = REPEL_STRENGTH / distSq;
            p.odx += (dx / dist) * force;
            p.ody += (dy / dist) * force;
          }
        }

        // Spring back to the base position, damped.
        p.odx += -p.ox * SPRING;
        p.ody += -p.oy * SPRING;
        p.odx *= DAMPING;
        p.ody *= DAMPING;
        p.ox += p.odx;
        p.oy += p.ody;
      }

      // Links between near neighbours. O(n²) over ≤90 particles is a few
      // thousand comparisons — cheaper than the fill calls below.
      ctx!.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const ax = a.x + a.ox;
        const ay = a.y + a.oy;

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const bx = b.x + b.ox;
          const by = b.y + b.oy;
          const dx = ax - bx;
          const dy = ay - by;
          const distSq = dx * dx + dy * dy;

          if (distSq < LINK_DISTANCE * LINK_DISTANCE) {
            const t = 1 - Math.sqrt(distSq) / LINK_DISTANCE;
            ctx!.globalAlpha = t * colours.alpha * 0.45;
            ctx!.strokeStyle = colours.dot;
            ctx!.beginPath();
            ctx!.moveTo(ax, ay);
            ctx!.lineTo(bx, by);
            ctx!.stroke();
          }
        }
      }

      ctx!.globalAlpha = colours.alpha;
      ctx!.fillStyle = colours.dot;
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x + p.ox, p.y + p.oy, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function onPointerMove(event: PointerEvent) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    }

    function onPointerLeave() {
      pointer.active = false;
    }

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        // Colours may have changed while hidden (theme toggle).
        colours = themeColours();
        frame = requestAnimationFrame(step);
      }
    }

    // next-themes swaps a class on <html>; re-read the CSS variables when it does.
    const themeObserver = new MutationObserver(() => {
      colours = themeColours();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resize();
    frame = requestAnimationFrame(step);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
