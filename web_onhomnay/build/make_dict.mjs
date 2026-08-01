/*
 * make_dict.mjs — Dựng từ điển tra nhanh cho "Ôn Hôm Nay".
 * Chạy: node build/make_dict.mjs
 *
 * Nguồn (đều là nội dung GỐC của dự án, không chép sách nào):
 *   1) web_tienganh/content/**.json  -> vocab[] {word, vi, example, icon}
 *   2) build/extra_words.json        -> danh sách từ thông dụng tự soạn
 *
 * Xuất data/dict.js: window.DICT = { "<từ>": [vi, ví dụ, icon], ... }
 * (mảng thay vì object cho gọn file — runtime tự đọc theo chỉ số.)
 *
 * KHÔNG gọi mạng ở runtime: từ điển phải nhúng sẵn thì app mới tra được khi offline
 * và khi mở bằng file://.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const REPO = path.resolve(ROOT, '..');
const CONTENT = path.join(REPO, 'web_tienganh', 'content');
const EXTRA = path.join(HERE, 'extra_words.json');
const OUT = path.join(ROOT, 'data', 'dict.js');

const dict = new Map();   // word(lowercase) -> [vi, ex, icon]

function put(word, vi, ex, ic, overwrite) {
  const k = String(word || '').trim().toLowerCase();
  if (!k || !vi) return false;
  if (!/^[a-z][a-z' -]*$/.test(k)) return false;       // chỉ nhận từ tiếng Anh sạch
  if (dict.has(k) && !overwrite) return false;
  dict.set(k, [String(vi).trim(), String(ex || '').trim(), String(ic || '').trim()]);
  return true;
}

/* --- 1) quét kho nội dung web_tienganh --- */
let fromContent = 0;
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) { walk(p); continue; }
    if (!f.endsWith('.json')) continue;
    let j;
    try { j = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { continue; }
    const units = Array.isArray(j) ? j : [j];
    for (const u of units) {
      if (!u || !Array.isArray(u.vocab)) continue;
      for (const v of u.vocab) {
        if (v && v.word && v.vi && put(v.word, v.vi, v.example, v.icon)) fromContent++;
      }
    }
  }
}
walk(CONTENT);

/* --- 2) danh sách bổ sung tự soạn --- */
let fromExtra = 0, skipped = 0;
const extra = JSON.parse(fs.readFileSync(EXTRA, 'utf8')).words;
for (const rawKey of Object.keys(extra)) {
  // khoá dạng "fish_food" / "clean_adj" chỉ để tránh trùng khoá JSON;
  // từ thật là phần trước dấu gạch dưới. Đã có trong kho nội dung thì bỏ qua.
  const word = rawKey.split('_')[0];
  const [vi, ex, ic] = extra[rawKey];
  if (put(word, vi, ex, ic)) fromExtra++; else skipped++;
}

/* --- 3) xuất --- */
const obj = {};
[...dict.keys()].sort().forEach((k) => { obj[k] = dict.get(k); });

const js = `/* TỰ ĐỘNG SINH bởi build/make_dict.mjs — KHÔNG sửa tay.
   Từ điển tra nhanh: ${Object.keys(obj).length} từ. Định dạng: "từ": [nghĩa, ví dụ, icon].
   Nguồn: kho nội dung gốc của dự án + danh sách thông dụng tự soạn (build/extra_words.json). */
window.DICT = ${JSON.stringify(obj)};
`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, js, 'utf8');

console.log(`Từ điển: ${Object.keys(obj).length} từ  (${fromContent} từ kho nội dung + ${fromExtra} từ soạn thêm, bỏ qua ${skipped} trùng)`);
console.log(`-> data/dict.js  ${(js.length / 1024).toFixed(1)} KB`);
