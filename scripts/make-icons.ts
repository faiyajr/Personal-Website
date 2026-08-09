/**
 * Render app/icon.svg into the raster sizes browsers and iOS still want.
 *
 *   npm run icons:build
 *
 * Next serves app/icon.svg to modern browsers on its own; this fills the gaps:
 * apple-icon.png for iOS home-screen bookmarks, and a 32px PNG fallback.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.join(process.cwd(), "src", "app", "icon.svg");
const OUT = path.join(process.cwd(), "src", "app");

const targets = [
  { file: "apple-icon.png", size: 180 },
  { file: "icon.png", size: 32 },
];

const svg = fs.readFileSync(SRC);

for (const { file, size } of targets) {
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(path.join(OUT, file));
  console.log(`${file}  ${size}x${size}`);
}
