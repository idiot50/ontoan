/*
 * sync_engines.mjs — Sao chép engine Toán (nguồn sự thật ở web_toan_lop*) vào tao_de/engines/
 * để trình tạo đề nạp được bằng đường dẫn ổn định (chạy cả local file:// lẫn trên GitHub Pages,
 * nơi cấu trúc thư mục khác nhau). Bản copy BYTE-IDENTICAL với bản gốc; test sẽ kiểm chống lệch.
 *
 * Chạy:  node tao_de/sync_engines.mjs   (chạy lại mỗi khi sửa engine gốc)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'engines');

const MAP = [
  { src: path.join(ROOT, 'web_toan_lop1', 'engine.js'), dst: path.join(OUT, 'toan1.engine.js') },
  { src: path.join(ROOT, 'web_toan_lop3', 'engine.js'), dst: path.join(OUT, 'toan3.engine.js') },
  { src: path.join(ROOT, 'web_on_thi', 'engine.js'), dst: path.join(OUT, 'onthi.engine.js') },
];

fs.mkdirSync(OUT, { recursive: true });
for (const m of MAP) {
  const code = fs.readFileSync(m.src, 'utf8');
  fs.writeFileSync(m.dst, code, 'utf8');
  console.log('Đồng bộ', path.relative(ROOT, m.src), '->', path.relative(ROOT, m.dst), '(' + code.length + ' bytes)');
}
console.log('XONG.');
