/*
 * run.mjs — Bộ chạy test MỘT LỆNH cho QA.
 * Chạy:  node tests/run.mjs     (từ thư mục web_tienganh hoặc bất kỳ)
 * Trả exit code != 0 nếu có bộ test thất bại (dùng cho CI / hồi quy).
 */
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const suites = ['engine.test.mjs', 'content.schema.mjs'];

let failed = 0;
for (const s of suites) {
  console.log('\n######## ' + s + ' ########');
  const r = spawnSync(process.execPath, [path.join(__dirname, s)], { stdio: 'inherit' });
  if (r.status !== 0) failed++;
}

console.log('\n======== TỔNG KẾT: ' + (failed ? (failed + ' bộ THẤT BẠI') : 'TẤT CẢ PASS') + ' ========');
process.exit(failed ? 1 : 0);
