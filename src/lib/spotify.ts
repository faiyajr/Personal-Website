import "server-only";

/**
 * Spotify Web API client.
 *
 * Reading *your* listening history needs a user-authorised token, not a plain
 * app token — so this uses the refresh-token flow: one long-lived refresh
 * token in the environment, exchanged for a short-lived access token on
 * demand. Run `npm run spotify:auth` once to mint the refresh token.
 *
 * Required env: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
 */

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const TOP_TRACKS_ENDPOINT =
  "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

export type Track = {
  title: string;
  artist: string;
  album: string;
  url: string;
  albumArt: string | null;
};

export type NowPlaying = Track & { isPlaying: boolean };

export type SpotifyPayload = {
  configured: boolean;
  nowPlaying: NowPlaying | null;
  topTracks: Track[];
};

type SpotifyArtist = { name: string };
type SpotifyImage = { url: string };
type SpotifyTrack = {
  name: string;
  artists: SpotifyArtist[];
  album: { name: string; images: SpotifyImage[] };
  external_urls: { spotify: string };
};

export function isSpotifyConfigured(): boolean {
  return Boolean(
    process.env.SPOTIFY_CLIENT_ID &&
      process.env.SPOTIFY_CLIENT_SECRET &&
      process.env.SPOTIFY_REFRESH_TOKEN,
  );
}

async function getAccessToken(): Promise<string | null> {
  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("[spotify] token refresh failed:", response.status, await response.text());
    return null;
  }

  const data: { access_token?: string } = await response.json();
  return data.access_token ?? null;
}

function toTrack(track: SpotifyTrack): Track {
  return {
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    url: track.external_urls.spotify,
    albumArt: track.album.images[0]?.url ?? null,
  };
}

export async function getSpotifyData(): Promise<SpotifyPayload> {
  if (!isSpotifyConfigured()) {
    return { configured: false, nowPlaying: null, topTracks: [] };
  }

  const token = await getAccessToken();
  if (!token) return { configured: false, nowPlaying: null, topTracks: [] };

  const auth = { Authorization: `Bearer ${token}` };

  // Both calls are independent — fire them together.
  const [nowRes, topRes] = await Promise.all([
    fetch(NOW_PLAYING_ENDPOINT, { headers: auth, cache: "no-store" }),
    fetch(TOP_TRACKS_ENDPOINT, { headers: auth, cache: "no-store" }),
  ]);

  // 204 means nothing is playing — an expected state, not an error.
  let nowPlaying: NowPlaying | null = null;
  if (nowRes.ok && nowRes.status !== 204) {
    const data: { is_playing?: boolean; item?: SpotifyTrack } = await nowRes
      .json()
      .catch(() => ({}));
    if (data.item) {
      nowPlaying = { ...toTrack(data.item), isPlaying: Boolean(data.is_playing) };
    }
  }

  let topTracks: Track[] = [];
  if (topRes.ok) {
    const data: { items?: SpotifyTrack[] } = await topRes.json().catch(() => ({}));
    topTracks = (data.items ?? []).map(toTrack);
  } else {
    // 403 here almost always means the app is blocked from the Web API for
    // lack of a Premium subscription, not a bad token.
    console.error(
      "[spotify] top tracks failed:",
      topRes.status,
      topRes.status === 403
        ? "— app is likely blocked from the Web API (Premium required)"
        : "",
    );
  }

  // Nothing usable came back: report it as unconfigured so the UI falls back
  // to the hand-written list rather than rendering an empty panel.
  if (!nowPlaying && topTracks.length === 0) {
    return { configured: false, nowPlaying: null, topTracks: [] };
  }

  return { configured: true, nowPlaying, topTracks };
}
