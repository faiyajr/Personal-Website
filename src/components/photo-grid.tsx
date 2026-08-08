import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import type { Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * Editorial photo grid. Deliberately uneven — the first photo takes two
 * columns, the rest alternate portrait and landscape, so it reads as a
 * spread rather than a contact sheet.
 */
export function PhotoGrid({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <div className="rounded-card border border-dashed border-border-strong px-6 py-14 text-center">
        <p className="font-display text-xl text-foreground">No photos yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Drop images into{" "}
          <code className="font-mono text-xs">public/images/me/</code> — they appear here
          automatically. Name them descriptively; the filename becomes the alt text.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {photos.map((photo, i) => {
        // First photo spans two columns; then every fourth is a tall portrait.
        const wide = i === 0;
        const tall = i % 4 === 2;

        return (
          <Reveal
            key={photo.src}
            delay={Math.min(i, 6) * 0.05}
            className={cn(wide && "col-span-2")}
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-card border border-border bg-surface",
                wide ? "aspect-[16/10]" : tall ? "aspect-[3/4]" : "aspect-square",
              )}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] hover:scale-105"
              />
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
