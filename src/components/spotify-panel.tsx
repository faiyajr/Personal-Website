"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Music, Search } from "lucide-react";

import type { LikedTrack } from "@/lib/music";
import type { SpotifyPayload, Track } from "@/lib/spotify";

/**
 * "What I'm listening to".
 *
 * Live from the Spotify API when it is available, fetched client-side so the
 * data stays current without a redeploy. When the API is unavailable — no
 * credentials, or the app is blocked from the Web API for lack of Premium —
 * it falls back to the full liked-songs library parsed from the CSV export.
 */
export function SpotifyPanel({
  library = [],
  artists = [],
}: {
  library?: LikedTrack[];
  artists?: string[];
}) {
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

  // The library renders immediately, server-side included — no skeleton and
  // no flash. Live data, if it ever arrives, upgrades the panel in place.
  const live = !failed && data?.configured ? data : null;
  const hasLive = Boolean(live && (live.nowPlaying || live.topTracks.length > 0));

  if (!hasLive) return <LibraryPanel tracks={library} artists={artists} />;

  const { nowPlaying, topTracks } = live!;

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface/50 backdrop-blur-sm">
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

/**
 * The full liked-songs library: a searchable, scrollable list.
 *
 * 474 rows is too many to skim, so the filter is not a nicety — it is what
 * makes the list usable. Filtering happens on the already-loaded array, so
 * there is no request per keystroke.
 */
function LibraryPanel({
  tracks,
  artists,
}: {
  tracks: LikedTrack[];
  artists: string[];
}) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tracks;
    return tracks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q),
    );
  }, [tracks, query]);

  if (tracks.length === 0 && artists.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface/50 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border p-5 pb-4">
        <p className="eyebrow flex items-center gap-2">
          <Music className="size-3" />
          Liked songs
        </p>
        <span className="font-mono text-[0.6875rem] text-subtle">
          {query ? `${visible.length} / ${tracks.length}` : tracks.length}
        </span>
      </div>

      {tracks.length > 0 && (
        <>
          <div className="relative border-b border-border p-3">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-6 top-1/2 size-3.5 -translate-y-1/2 text-subtle"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search songs or artists"
              aria-label="Search liked songs"
              className="w-full rounded-lg border border-transparent bg-transparent py-1.5 pl-8 pr-2 text-sm text-foreground placeholder:text-subtle focus:border-border focus:outline-none focus:ring-2 focus:ring-accent/25"
            />
          </div>

          <ol className="scroll-region max-h-[22rem] overflow-y-auto p-2">
            {visible.map((track, i) => (
              <li key={`${track.id}-${i}`}>
                <a
                  href={
                    track.id
                      ? `https://open.spotify.com/track/${track.id}`
                      : undefined
                  }
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-baseline gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-raised"
                >
                  <span className="w-7 shrink-0 text-right font-mono text-[0.6875rem] text-subtle">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-foreground">
                      {track.title}
                    </span>
                    <span className="block truncate text-xs text-muted">{track.artist}</span>
                  </span>
                </a>
              </li>
            ))}

            {visible.length === 0 && (
              <li className="px-3 py-8 text-center text-sm text-muted">
                Nothing matches “{query}”.
              </li>
            )}
          </ol>
        </>
      )}

      {artists.length > 0 && (
        <div className="border-t border-border p-5">
          <p className="eyebrow mb-3">Most saved</p>
          <ul className="flex flex-wrap gap-1.5">
            {artists.map((artist) => (
              <li
                key={artist}
                className="rounded-full border border-border px-2.5 py-1 font-mono text-[0.6875rem] text-muted"
              >
                {artist}
              </li>
            ))}
          </ul>
        </div>
      )}
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

function AlbumArt({ src, alt, size }: { src: string | null; alt: string; size: number }) {
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
