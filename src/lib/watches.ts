import "server-only";

import fs from "node:fs";
import path from "node:path";

import { watches, type Watch } from "./about";

const WATCHES_DIR = path.join(process.cwd(), "public", "images", "watches");

/**
 * The watch list, filtered to entries whose poster actually exists on disk.
 *
 * A missing poster is a broken image on a live page, which looks worse than
 * the entry simply not being there — so add the entry whenever, and it starts
 * rendering as soon as the file lands.
 */
export function getWatches(): Watch[] {
  const present = new Set(
    fs.existsSync(WATCHES_DIR) ? fs.readdirSync(WATCHES_DIR) : [],
  );

  const found = watches.filter((watch) => present.has(watch.poster));

  if (process.env.NODE_ENV === "development") {
    for (const watch of watches) {
      if (!present.has(watch.poster)) {
        console.warn(
          `[watches] "${watch.title}" hidden — no poster at public/images/watches/${watch.poster}`,
        );
      }
    }
  }

  return found;
}
