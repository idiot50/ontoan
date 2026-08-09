/*
 * _harness.mjs — tiện ích test dùng chung cho engine "Thi Lớp 5".
 * Không phụ thuộc thư viện ngoài; chạy bằng node thuần.
 */
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

let _eng = require(path.join(__dirname, '..', 'engine.js'));
if (!_eng || typeof _eng.check !== 'function') {
  if (globalThis.QuestionEngine && typeof globalThis.QuestionEngine.check === 'function') {
    _eng = globalThis.QuestionEngine;
  }
}
export const QE = _eng;

/* ----------------------------- BỘ ĐẾM KIỂM ----------------------------- */
export function makeReporter(groupName) {
  const state = { group: groupName, checks: 0, fails: [], samples: [] };
  function ok(cond, msg, ctx) {
    state.checks++;
    if (!cond) state.fails.push({ msg, ctx: ctx === undefined ? null : ctx });
    return !!cond;
  }
  function eq(actual, expected, msg, ctx) {
    return ok(actual === expected, `${msg} (mong: ${expected}, nhận: ${actual})`, ctx);
  }
  function near(actual, expected, msg, ctx) {
    const good = Math.abs(actual - expected) <= 1e-6 * Math.max(1, Math.abs(expected));
    return ok(good, `${msg} (mong: ${expected}, nhận: ${actual})`, ctx);
  }
  function record(s) { if (state.samples.length < 8) state.samples.push(s); }
  return { state, ok, eq, near, record };
}

/* --------------------- TIỆN ÍCH XỬ LÝ CHUỖI ĐỀ BÀI --------------------- */
// Gỡ thẻ HTML và decode entity để re-parse stem.
export function plain(s) {
  return String(s)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');
}

/*
 * Đọc MỌI số trong một chuỗi tiếng Việt (đã gỡ HTML).
 * Nhận: "1 234 567" (phân nhóm nghìn bằng khoảng trắng), "12,34" (thập phân dấu phẩy).
 * KHÔNG gộp "3/4" — phân số phải dùng fracs().
 */
export function nums(s) {
  const t = plain(s);
  const re = /\d{1,3}(?: \d{3})+(?:,\d+)?|\d+(?:,\d+)?/g;
  const out = [];
  let m;
  while ((m = re.exec(t)) !== null) {
    out.push(Number(m[0].replace(/ /g, '').replace(',', '.')));
  }
  return out;
}

// Lấy các phân số "a/b" xuất hiện trong chuỗi.
export function fracs(s) {
  const t = plain(s);
  const re = /(\d+)\s*\/\s*(\d+)/g;
  const out = [];
  let m;
  while ((m = re.exec(t)) !== null) out.push({ n: Number(m[1]), d: Number(m[2]) });
  return out;
}

// Đọc đáp án kiểu Việt (số thập phân dấu phẩy, phân số a/b) -> số thực.
export function ansVal(a) {
  const s = String(a).trim();
  const f = s.match(/^(-?\d+)\/(\d+)$/);
  if (f) return Number(f[1]) / Number(f[2]);
  const v = Number(s.replace(/ /g, '').replace(',', '.'));
  return Number.isFinite(v) ? v : NaN;
}

export function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = a % b; a = b; b = t; }
  return a || 1;
}

// Gần bằng (dùng cho số thập phân).
export function nearly(a, b) { return Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(b)); }
