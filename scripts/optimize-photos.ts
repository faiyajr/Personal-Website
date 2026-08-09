/**
 * Normalise everything in `public/images/me/` into web-ready JPEGs.
 *
 *   npm run photos:optimize
 *
 * Phone and camera exports routinely arrive as 60–80MB files, sometimes as
 * TIFFs with a `.png` extension — which no browser can decode, so they render
 * as an empty box. This converts whatever is there, honours EXIF rotation,
 * caps the long edge, and renames to kebab-case (filenames become alt text;
 * see `src/lib/photos.ts`).
 *
 * Safe to re-run: files already converted are skipped.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "images", "me");
const MAX_EDGE = 2400;
const QUALITY = 82;

/** Anything sharp can read. The extension is not trusted — the bytes are. */
const CANDIDATE = /\.(png|jpe?g|tiff?|webp|avif|heic|heif)$/i;

function kebab(name: string) {
  return name
    .replace(CANDIDATE, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  if (!fs.existsSync(DIR)) {
    console.error(`No such directory: ${DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DIR).filter((f) => CANDIDATE.test(f));
  if (files.length === 0) {
    console.log("Nothing to do — no images in public/images/me/");
    return;
  }

  let converted = 0;

  for (const file of files) {
    const from = path.join(DIR, file);
    const meta = await sharp(from).metadata();
    const bytes = fs.statSync(from).size;

    // Already a reasonable JPEG? Leave it alone.
    const smallEnough = Math.max(meta.width ?? 0, meta.height ?? 0) <= MAX_EDGE;
    if (meta.format === "jpeg" && smallEnough && bytes < 1_500_000) {
      console.log(`skip  ${file} (already optimised)`);
      continue;
    }

    const out = `${kebab(file)}.jpg`;
    const to = path.join(DIR, out);
    const tmp = path.join(DIR, `.tmp-${out}`);

    // Write to a temp path first: input and output can be the same filename
    // when a .jpg is being re-encoded in place.
    await sharp(from)
      .rotate() // apply EXIF orientation, then drop it
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(tmp);

    if (from !== to) fs.unlinkSync(from);
    fs.renameSync(tmp, to);

    const after = fs.statSync(to);
    const outMeta = await sharp(to).metadata();
    console.log(
      `ok    ${file}\n` +
        `        ${meta.format} ${meta.width}x${meta.height} ` +
        `${(bytes / 1048576).toFixed(1)}MB  ->  jpeg ${outMeta.width}x${outMeta.height} ` +
        `${(after.size / 1024).toFixed(0)}KB  (${out})`,
    );
    converted++;
  }

  console.log(`\n${converted} converted. Now in public/images/me/:`);
  for (const f of fs.readdirSync(DIR).filter((f) => CANDIDATE.test(f))) console.log(`  ${f}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
