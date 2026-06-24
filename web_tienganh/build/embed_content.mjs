/*
 * embed_content.mjs — Sinh lại js/content-data.js từ các file content/level1/*.json.
 * Dùng để app CHẠY ĐƯỢC trên file:// (fetch JSON bị chặn cross-origin).
 *
 * Chạy:  node build/embed_content.mjs
 * (chạy từ thư mục web_tienganh/ hoặc bất kỳ — script tự tính đường dẫn tương đối.)
 *
 * Mỗi khi sửa nội dung trong content/, hãy chạy lại lệnh này để đồng bộ bản nhúng.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');           // web_tienganh/
const CONTENT = join(ROOT, 'content');
const OUT = join(ROOT, 'js', 'content-data.js');

// Đọc index của level1 để biết các file cần nhúng (+ index.json của mỗi level).
function read(p) { return readFileSync(p, 'utf8'); }

const entries = []; // { key: 'level1/unit01.json', raw: '...' }

// Level 1 (và có thể mở rộng các level khác sau này).
const levels = ['level1'];
for (const lvl of levels) {
  const idxPath = join(CONTENT, lvl, 'index.json');
  if (!existsSync(idxPath)) continue;
  const idxRaw = read(idxPath);
  entries.push({ key: `${lvl}/index.json`, raw: idxRaw });
  const idx = JSON.parse(idxRaw);
  for (const u of (idx.units || [])) {
    const fp = join(CONTENT, lvl, u.file);
    if (existsSync(fp)) entries.push({ key: `${lvl}/${u.file}`, raw: read(fp) });
  }
  // BÀI LỚN (lesson0N.json) — gộp từ unit nhỏ.
  for (const l of (idx.lessons || [])) {
    const fp = join(CONTENT, lvl, l.file);
    if (existsSync(fp)) entries.push({ key: `${lvl}/${l.file}`, raw: read(fp) });
  }
}

let out = `/*
 * content-data.js — Nhúng nội dung vào window.ContentData để app CHẠY ĐƯỢC trên file://
 * (fetch JSON bị chặn cross-origin trên file://). Bản sao 1:1 của content/**.json.
 * Khi phục vụ qua HTTP, app ưu tiên fetch JSON; file:// rơi về object nhúng này.
 * SINH TỰ ĐỘNG bằng build/embed_content.mjs — KHÔNG sửa tay.
 */
(function (g) {
  'use strict';
  var C = {};
`;
for (const e of entries) {
  out += `  C[${JSON.stringify(e.key)}] = ${e.raw.trim()};\n`;
}
out += `  g.ContentData = C;
  if (typeof module !== 'undefined' && module.exports) module.exports = C;
})(typeof window !== 'undefined' ? window : this);
`;

writeFileSync(OUT, out, 'utf8');
console.log(`Wrote ${OUT} with ${entries.length} entries:`);
for (const e of entries) console.log('  - ' + e.key);
