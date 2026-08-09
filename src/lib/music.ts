import "server-only";

import fs from "node:fs";
import path from "node:path";

/**
 * Liked songs, parsed from a Spotify export at build time.
 *
 * The live Web API needs a Premium subscription, so this is the real data
 * source for the music panel rather than a stopgap. To refresh it, re-export
 * your liked songs (Exportify or similar) and overwrite the CSV — no code
 * changes.
 *
 * Only three fields per track reach the browser. The export carries 24
 * columns including tempo, danceability and time signature; shipping those
 * for 490 rows would cost far more than the panel is worth.
 */

const CSV_PATH = path.join(process.cwd(), "content", "music", "liked-songs.csv");

export type LikedTrack = {
  /** Spotify track id, for building the open.spotify.com link. */
  id: string;
  title: string;
  artist: string;
};

export type MusicLibrary = {
  tracks: LikedTrack[];
  /** Distinct artists, most-saved first. */
  topArtists: string[];
  total: number;
};

/**
 * Minimal RFC 4180 parser: handles quoted fields containing commas, escaped
 * `""` quotes, and CRLF. Track and album names routinely contain commas, so
 * a naive `split(",")` silently corrupts the data.
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  // Trailing field/row when the file does not end in a newline.
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

let cache: MusicLibrary | null = null;

export function getMusicLibrary(): MusicLibrary {
  if (cache) return cache;

  if (!fs.existsSync(CSV_PATH)) {
    cache = { tracks: [], topArtists: [], total: 0 };
    return cache;
  }

  // Strip the UTF-8 BOM Excel and Spotify exporters both like to prepend.
  const text = fs.readFileSync(CSV_PATH, "utf8").replace(/^﻿/, "");
  const rows = parseCsv(text);
  if (rows.length < 2) {
    cache = { tracks: [], topArtists: [], total: 0 };
    return cache;
  }

  // Resolve columns by header name — exporters reorder them between versions.
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const uriCol = header.indexOf("track uri");
  const titleCol = header.indexOf("track name");
  const artistCol = header.indexOf("artist name(s)");
  const addedCol = header.indexOf("added at");

  if (titleCol === -1 || artistCol === -1) {
    throw new Error(
      `content/music/liked-songs.csv is missing expected columns. Found: ${header.join(", ")}`,
    );
  }

  const artistCounts = new Map<string, number>();
  const seen = new Set<string>();

  const parsed = rows
    .slice(1)
    .filter((r) => r.length > titleCol && r[titleCol]?.trim())
    .map((r) => ({
      id: (r[uriCol] ?? "").replace("spotify:track:", "").trim(),
      title: r[titleCol].trim(),
      // The export joins collaborators with semicolons.
      artist: (r[artistCol] ?? "")
        .split(";")
        .map((a) => a.trim())
        .filter(Boolean)
        .join(", "),
      addedAt: addedCol === -1 ? "" : (r[addedCol] ?? "").trim(),
      artists: (r[artistCol] ?? "").split(";").map((a) => a.trim()).filter(Boolean),
    }));

  // Newest saves first — that is the order the panel reads best in.
  parsed.sort((a, b) => b.addedAt.localeCompare(a.addedAt));

  const tracks: LikedTrack[] = [];
  for (const track of parsed) {
    for (const artist of track.artists) {
      artistCounts.set(artist, (artistCounts.get(artist) ?? 0) + 1);
    }

    // The same song can appear twice via different albums or re-releases.
    const key = `${track.title.toLowerCase()}|${track.artist.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);

    tracks.push({ id: track.id, title: track.title, artist: track.artist });
  }

  const topArtists = [...artistCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([artist]) => artist);

  cache = { tracks, topArtists, total: tracks.length };
  return cache;
}
