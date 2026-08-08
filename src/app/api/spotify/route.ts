import { NextResponse } from "next/server";

import { getSpotifyData } from "@/lib/spotify";

export const runtime = "nodejs";
/** Re-fetch at most once a minute; Spotify rate-limits and this barely moves. */
export const revalidate = 60;

export async function GET() {
  try {
    const data = await getSpotifyData();

    return NextResponse.json(data, {
      headers: {
        // Serve stale while revalidating so a slow Spotify call never blocks
        // the panel from rendering.
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[spotify] route error:", error);
    return NextResponse.json(
      { configured: false, nowPlaying: null, topTracks: [] },
      { status: 200 },
    );
  }
}
