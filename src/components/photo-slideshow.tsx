"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { useMotionEnabled, useMotionScale } from "@/components/motion/use-motion-scale";
import type { Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 4500;

/**
 * Auto-advancing photo slideshow with manual controls.
 *
 * Advancing stops whenever the visitor takes over — hover, focus, an explicit
 * pause, or a drag — so it never fights someone who is trying to look at one
 * picture. Arrow keys and horizontal swipes both work.
 */
export function PhotoSlideshow({ photos }: { photos: Photo[] }) {
  // Gates auto-advance only — behaviour, never markup.
  const animate = useMotionEnabled();
  const scale = useMotionScale();
  const [index, setIndex] = useState(0);
  /** +1 moving forward, -1 back — decides which way slides enter and exit. */
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const liveRef = useRef<HTMLParagraphElement>(null);

  const count = photos.length;

  const go = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const advance = useCallback(() => go(index + 1, 1), [go, index]);
  const back = useCallback(() => go(index - 1, -1), [go, index]);

  // Auto-advance. Reduced motion disables it outright — an animation the
  // visitor did not ask for is exactly what that setting is about.
  useEffect(() => {
    if (!animate || paused || interacting || count <= 1) return;

    const timer = setTimeout(advance, INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [advance, animate, paused, interacting, count, index]);

  if (count === 0) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <div className="rounded-card border border-dashed border-border-strong px-6 py-14 text-center">
        <p className="font-display text-xl text-foreground">No photos yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Drop images into <code className="font-mono text-xs">public/images/me/</code> — they
          appear here automatically.
        </p>
      </div>
    );
  }

  const photo = photos[index];

  return (
    <div
      // Portrait frame, centred. The photos are 3:4, so the frame matches them
      // exactly and nothing is letterboxed; the cap keeps a tall image from
      // running the full width of the page.
      className="group relative mx-auto w-full max-w-md"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={() => setInteracting(false)}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Photos"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            advance();
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            back();
          }
        }}
        // 3:4 matches the photos, so they fill the frame edge to edge. A
        // landscape shot added later still works — `object-contain` below
        // letterboxes it against the blurred backdrop rather than cropping.
        className="relative aspect-[3/4] overflow-hidden rounded-card border border-border bg-surface"
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={photo.src}
            custom={direction}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragStart={() => setInteracting(true)}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) advance();
              else if (info.offset.x > 60) back();
              setInteracting(false);
            }}
            initial={{ opacity: 0, x: direction > 0 ? "12%" : "-12%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? "-8%" : "8%" }}
            transition={{ duration: 0.6 * scale, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {/* A blown-up, blurred copy fills the letterboxing left by
                `object-contain`, so portrait shots sit in a colour field drawn
                from the photo itself instead of a flat grey slab. */}
            <Image
              src={photo.src}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="pointer-events-none scale-110 select-none object-cover opacity-40 blur-2xl"
            />

            {/* The photo itself — `object-contain` so nothing is ever cropped. */}
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 768px) 28rem, 100vw"
              className="pointer-events-none select-none object-contain"
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <SlideButton
              side="left"
              label="Previous photo"
              onClick={back}
              icon={<ChevronLeft className="size-5" />}
            />
            <SlideButton
              side="right"
              label="Next photo"
              onClick={advance}
              icon={<ChevronRight className="size-5" />}
            />
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose photo">
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Photo ${i + 1} of ${count}`}
                onClick={() => go(i, i > index ? 1 : -1)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index
                    ? "w-8 bg-accent"
                    : "w-1.5 bg-border-strong hover:bg-muted",
                )}
              />
            ))}
          </div>

          {/* Always rendered — hiding it based on reduced motion would make
              the server and client markup disagree. */}
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
            className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-widest text-subtle transition-colors hover:text-foreground"
          >
            {paused ? <Play className="size-3" /> : <Pause className="size-3" />}
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      )}

      {/* No visible captions by choice — this keeps position announced for
          screen readers, which would otherwise get no feedback on advance. */}
      <p ref={liveRef} className="sr-only" aria-live="polite">
        Photo {index + 1} of {count}
      </p>
    </div>
  );
}

function SlideButton({
  side,
  label,
  onClick,
  icon,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full",
        "border border-white/20 bg-black/40 text-white backdrop-blur-sm",
        "opacity-0 transition-all duration-300 hover:bg-black/60",
        "group-hover:opacity-100 focus-visible:opacity-100",
        side === "left" ? "left-4" : "right-4",
      )}
    >
      {icon}
    </button>
  );
}
