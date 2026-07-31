// embed.mjs — nhúng data/content.json thành data/content.js (window.GRAMMAR3)
// Lý do: mở index.html bằng file:// thì fetch() JSON bị CORS chặn, nên phải nhúng
// dữ liệu dưới dạng <script>.  Chạy: node build/embed.mjs
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'data', 'content.json');
const OUT = path.join(ROOT, 'data', 'content.js');

const raw = fs.readFileSync(SRC, 'utf8');
const data = JSON.parse(raw); // kiểm tra JSON hợp lệ trước khi nhúng

const nUnits = data.units.length;
const nEx = data.units.reduce((a, u) => a + u.exercises.length, 0);

// JSON.stringify an toàn cho <script>: chặn "</script>" và U+2028/2029 (line
// separator — hợp lệ trong JSON nhưng làm vỡ script literal ở JS cũ).
const json = JSON.stringify(data)
  .replace(/<\//g, '<\\/')
  .replace(new RegExp(String.fromCharCode(0x2028),'g'), '\u2028')
  .replace(new RegExp(String.fromCharCode(0x2029),'g'), '\u2029');

const js = `/* TỰ ĐỘNG SINH bởi build/embed.mjs — KHÔNG sửa tay.
   Nguồn: data/content.json (${nUnits} unit, ${nEx} bài tập).
   Nội dung luyện tập GỐC, tự biên soạn (Toán Vui) — dùng tự do cho học tập. */
window.GRAMMAR3 = ${json};
`;

fs.writeFileSync(OUT, js, 'utf8');
console.log(`OK  data/content.js  ${(js.length / 1024).toFixed(1)} KB  — ${nUnits} unit, ${nEx} bài tập`);
