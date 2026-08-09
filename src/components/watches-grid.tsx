"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import type { Watch } from "@/lib/about";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<Watch["kind"], string> = {
  film: "Film",
  series: "Series",
  anime: "Anime",
};

/**
 * Poster wall. Each card tilts slightly toward the cursor on hover — a small
 * 3D lift that makes a static grid of images feel like objects.
 */
export function WatchesGrid({ watches }: { watches: Watch[] }) {
  if (watches.length === 0) return null;

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {watches.map((watch, i) => (
        <PosterCard key={watch.title} watch={watch} index={i} />
      ))}
    </ul>
  );
}

function PosterCard({ watch, index }: { watch: Watch; index: number }) {
  const reduce = useReducedMotion();

  function handleMove(event: React.MouseEvent<HTMLLIElement>) {
    if (reduce) return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    // -0.5..0.5 from the centre, converted to a few degrees of tilt.
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--rx", `${-py * 9}deg`);
    el.style.setProperty("--ry", `${px * 9}deg`);
  }

  function handleLeave(event: React.MouseEvent<HTMLLIElement>) {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  }

  return (
    <motion.li
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: Math.min(index, 8) * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group [perspective:900px]"
    >
      <div
        className={cn(
          "relative aspect-[2/3] overflow-hidden rounded-xl border border-border bg-surface",
          "transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)]",
          "group-hover:shadow-lift",
          "[transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transform-style:preserve-3d]",
        )}
      >
        <Image
          src={`/images/watches/${watch.poster}`}
          alt={`${watch.title} poster`}
          fill
          sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
          className="object-cover"
        />

        {/* Gradient scrim so the label stays readable over any poster. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-sm font-medium leading-snug text-white">{watch.title}</p>
          <p className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-widest text-white/70">
            {KIND_LABEL[watch.kind]}
            {watch.year ? ` · ${watch.year}` : ""}
          </p>
        </div>
      </div>

      <p className="mt-2.5 truncate text-sm font-medium text-foreground">{watch.title}</p>
      <p className="font-mono text-[0.6875rem] text-subtle">
        {KIND_LABEL[watch.kind]}
        {watch.year ? ` · ${watch.year}` : ""}
      </p>
    </motion.li>
  );
}
