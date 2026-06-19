// Render selected PDF pages at high resolution and split each into vertical
// tiles so small text stays legible when read (each tile keeps its own
// resolution budget instead of the whole page being downscaled).
// Usage: node tiles.mjs <pdfPath> <outPrefix> <scale> <tilesPerPage> <pageSpec> [overlapPx]
//   pageSpec: "47-61" or "5,9,12-14"; omit/"all" => every page
import { pdf } from "pdf-to-img";
import { createCanvas, loadImage } from "canvas";
import { writeFileSync, mkdirSync } from "node:fs";

const [, , pdfPath, outPrefix, scaleArg, tilesArg, pageSpec, overlapArg] = process.argv;
const scale = parseFloat(scaleArg || "2.6");
const tilesPerPage = parseInt(tilesArg || "2", 10);
const overlap = parseInt(overlapArg || "60", 10); // vertical overlap so nothing is cut mid-line

function parseSpec(spec) {
  if (!spec || spec === "all") return null;
  const out = new Set();
  for (const part of spec.split(",")) {
    const m = part.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;
    const a = +m[1], b = m[2] ? +m[2] : a;
    for (let i = a; i <= b; i++) out.add(i);
  }
  return out;
}

const wanted = parseSpec(pageSpec);
mkdirSync("tiles", { recursive: true });

const document = await pdf(pdfPath, { scale });
console.log("Total pages:", document.length, "| scale", scale, "| tiles/page", tilesPerPage);
let i = 0;
for await (const png of document) {
  i++;
  if (wanted && !wanted.has(i)) continue;
  const img = await loadImage(png);
  const W = img.width, H = img.height;
  const baseH = Math.ceil(H / tilesPerPage);
  for (let t = 0; t < tilesPerPage; t++) {
    const y0 = Math.max(0, t * baseH - (t > 0 ? overlap : 0));
    const y1 = Math.min(H, (t + 1) * baseH + (t < tilesPerPage - 1 ? overlap : 0));
    const h = y1 - y0;
    const canvas = createCanvas(W, h);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, y0, W, h, 0, 0, W, h);
    const name = `tiles/${outPrefix}_p${String(i).padStart(3, "0")}_t${t + 1}.png`;
    writeFileSync(name, canvas.toBuffer("image/png"));
    console.log("wrote", name, `${W}x${h}`);
  }
  if (wanted && i >= Math.max(...wanted)) break;
}
console.log("done");
