// Render selected pages of a (scanned) PDF to PNG so they can be read.
// Usage: node render.mjs <pdfPath> <outPrefix> <scale> <pageSpec>
//   pageSpec: comma list and ranges, 1-based, e.g. "1-4,10,55-58"
import { pdf } from "pdf-to-img";
import { writeFileSync, mkdirSync } from "node:fs";

const [, , pdfPath, outPrefix, scaleArg, pageSpec] = process.argv;
const scale = parseFloat(scaleArg || "1.5");

function parseSpec(spec) {
  const out = new Set();
  for (const part of spec.split(",")) {
    const m = part.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;
    const a = +m[1], b = m[2] ? +m[2] : a;
    for (let i = a; i <= b; i++) out.add(i);
  }
  return out;
}

const wanted = pageSpec ? parseSpec(pageSpec) : null; // null => all
mkdirSync("pages", { recursive: true });

const document = await pdf(pdfPath, { scale });
console.log("Total pages:", document.length);
let i = 0;
for await (const image of document) {
  i++;
  if (wanted && !wanted.has(i)) continue;
  const name = `pages/${outPrefix}_p${String(i).padStart(3, "0")}.png`;
  writeFileSync(name, image);
  console.log("wrote", name, (image.length / 1024).toFixed(0) + "KB");
  if (wanted && i >= Math.max(...wanted)) break;
}
console.log("done");
