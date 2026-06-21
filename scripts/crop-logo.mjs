import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = process.argv[2] || path.join(root, "public", "habibar-wordmark-src.png");
const out = process.argv[3] || path.join(root, "public", "habibar-wordmark.png");

// PNG decode via sharp if available, else skip
let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("sharp not installed, copying without crop");
  writeFileSync(out, readFileSync(src));
  process.exit(0);
}

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
let minX = width, minY = height, maxX = 0, maxY = 0;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = channels > 3 ? data[i + 3] : 255;
    if (a < 16) continue;
    if (r > 245 && g > 245 && b > 245) continue;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
}

const pad = 20;
const left = Math.max(0, minX - pad);
const top = Math.max(0, minY - pad);
const w = Math.min(width - left, maxX - minX + 1 + pad * 2);
const h = Math.min(height - top, maxY - minY + 1 + pad * 2);

await sharp(src).extract({ left, top, width: w, height: h }).png().toFile(out);
console.log(`Cropped ${width}x${height} -> ${w}x${h}`);
