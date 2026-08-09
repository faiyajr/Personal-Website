"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Music } from "lucide-react";

import type { ManualTrack } from "@/lib/about";
import type { SpotifyPayload, Track } from "@/lib/spotify";
import { cn } from "@/lib/utils";

/**
 * "What I'm listening to".
 *
 * Live from the Spotify API when it is available, fetched client-side so the
 * data stays current without a redeploy. When the API is unavailable — no
 * credentials, or the app is blocked from the Web API for lack of Premium —
 * it falls back to the hand-written `onRepeat` list instead of vanishing.
 */
export function SpotifyPanel({ fallback = [] }: { fallback?: ManualTrack[] }) {
  const [data, setData] = useState<SpotifyPayload | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/spotify")
      .then((r) => r.json() as Promise<SpotifyPayload>)
      .then((payload) => {
        if (!cancelled) setData(payload);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!data && !failed) return <SkeletonPanel />;

  // API unavailable — show the hand-written list if there is one.
  if (failed || !data?.configured) {
    return <FallbackPanel tracks={fallback} />;
  }

  const { nowPlaying, topTracks } = data;
  if (!nowPlaying && topTracks.length === 0) return <FallbackPanel tracks={fallback} />;

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface/40">
      {nowPlaying && (
        <div className="flex items-center gap-4 border-b border-border p-5">
          <AlbumArt src={nowPlaying.albumArt} alt={`${nowPlaying.album} album art`} size={56} />
          <div className="min-w-0 flex-1">
            <p className="mb-1 flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-widest text-subtle">
              {nowPlaying.isPlaying ? (
                <>
                  <EqualizerBars />
                  Now playing
                </>
              ) : (
                <>
                  <Music className="size-3" />
                  Last played
                </>
              )}
            </p>
            <a
              href={nowPlaying.url}
              target="_blank"
              rel="noreferrer noopener"
              className="block truncate font-medium text-foreground hover:text-accent"
            >
              {nowPlaying.title}
            </a>
            <p className="truncate text-sm text-muted">{nowPlaying.artist}</p>
          </div>
        </div>
      )}

      {topTracks.length > 0 && (
        <div className="p-5">
          <p className="eyebrow mb-4">On repeat this month</p>
          <ol className="space-y-3">
            {topTracks.map((track, i) => (
              <TrackRow key={track.url} track={track} rank={i + 1} />
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

/** Rendered when the live API is unavailable. */
function FallbackPanel({ tracks }: { tracks: ManualTrack[] }) {
  if (tracks.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface/50 p-5 backdrop-blur-sm">
      <p className="eyebrow mb-4 flex items-center gap-2">
        <Music className="size-3" />
        On repeat
      </p>
      <ol className="space-y-3">
        {tracks.map((track, i) => (
          <li key={`${track.title}-${track.artist}`} className="flex items-baseline gap-3">
            <span className="w-4 shrink-0 font-mono text-xs text-subtle">{i + 1}</span>
            <div className="min-w-0 flex-1">
              {track.url ? (
                <a
                  href={track.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block truncate text-sm text-foreground hover:text-accent"
                >
                  {track.title}
                </a>
              ) : (
                <p className="truncate text-sm text-foreground">{track.title}</p>
              )}
              <p className="truncate text-xs text-muted">{track.artist}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TrackRow({ track, rank }: { track: Track; rank: number }) {
  return (
    <li className="flex items-center gap-3">
      <span className="w-4 shrink-0 font-mono text-xs text-subtle">{rank}</span>
      <AlbumArt src={track.albumArt} alt={`${track.album} album art`} size={40} />
      <div className="min-w-0 flex-1">
        <a
          href={track.url}
          target="_blank"
          rel="noreferrer noopener"
          className="block truncate text-sm text-foreground hover:text-accent"
        >
          {track.title}
        </a>
        <p className="truncate text-xs text-muted">{track.artist}</p>
      </div>
    </li>
  );
}

function AlbumArt({
  src,
  alt,
  size,
}: {
  src: string | null;
  alt: string;
  size: number;
}) {
  if (!src) {
    return (
      <div
        className="grid shrink-0 place-items-center rounded-md bg-surface"
        style={{ width: size, height: size }}
      >
        <Music className="size-4 text-subtle" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      className="shrink-0 rounded-md"
    />
  );
}

/** Three bars bouncing at different rates — the universal "audio is playing". */
function EqualizerBars() {
  return (
    <span aria-hidden className="flex h-3 items-end gap-[2px]">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-[2px] origin-bottom animate-[equalizer_900ms_ease-in-out_infinite] bg-accent"
          style={{ animationDelay: `${delay}ms`, height: "100%" }}
        />
      ))}
    </span>
  );
}

function SkeletonPanel() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface/40 p-5">
      <div className="flex items-center gap-4">
        <div className="size-14 animate-pulse rounded-md bg-surface" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-surface" />
          <div className="h-4 w-40 animate-pulse rounded bg-surface" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="size-10 animate-pulse rounded-md bg-surface" />
            <div className={cn("h-3 animate-pulse rounded bg-surface", "w-2/3")} />
          </div>
        ))}
      </div>
    </div>
  );
}
