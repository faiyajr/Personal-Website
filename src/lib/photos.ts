import "server-only";

import fs from "node:fs";
import path from "node:path";

/**
 * Photos for the About page.
 *
 * Reads whatever is in `public/images/me/` at build time — no config, no list
 * to keep in sync. Drop files in, they show up; remove them, they vanish.
 *
 * Alt text comes from the filename, so name files descriptively:
 *   `climbing-in-colorado.jpg`  →  "Climbing in colorado"
 * A file named `IMG_4821.jpg` still renders, it just gets a generic label.
 */

const PHOTOS_DIR = path.join(process.cwd(), "public", "images", "me");
const IMAGE_RE = /\.(png|jpe?g|webp|avif)$/i;

export type Photo = {
  src: string;
  alt: string;
};

function altFromFilename(filename: string): string {
  const base = filename.replace(IMAGE_RE, "");

  // Camera-roll names carry no meaning — don't pretend otherwise.
  if (/^(img|dsc|pxl|photo)[-_]?\d+$/i.test(base)) return "Photo of Faiyaj";

  const words = base.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function getPhotos(): Photo[] {
  if (!fs.existsSync(PHOTOS_DIR)) return [];

  return fs
    .readdirSync(PHOTOS_DIR)
    .filter((f) => IMAGE_RE.test(f))
    .sort()
    .map((filename) => ({
      // Encoded because filenames routinely contain spaces.
      src: `/images/me/${encodeURIComponent(filename)}`,
      alt: altFromFilename(filename),
    }));
}
