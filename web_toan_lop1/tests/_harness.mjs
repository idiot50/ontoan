/*
 * _harness.mjs — tiện ích test dùng chung (assertion + nạp engine + parser).
 * Không phụ thuộc thư viện ngoài. Chạy bằng node thuần.
 *
 * Engine lớp 1 (engine.js) là CLASSIC SCRIPT: khi chạy node CommonJS,
 * nó gán module.exports = QuestionEngine; cũng gán globalThis.QuestionEngine.
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
    if (!cond) {
      state.fails.push({ msg, ctx: ctx === undefined ? null : ctx });
    }
    return !!cond;
  }
  function eq(actual, expected, msg, ctx) {
    return ok(actual === expected, msg + ` (mong: ${expected}, nhận: ${actual})`, ctx);
  }
  function record(s) { if (state.samples.length < 6) state.samples.push(s); }
  return { state, ok, eq, record };
}

/* --------------------- TIỆN ÍCH XỬ LÝ CHUỖI ĐỀ BÀI --------------------- */
// Gỡ thẻ HTML và decode entity, để re-parse stem.
export function plain(s) {
  return String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');
}

// Lấy tất cả số nguyên trong chuỗi (lớp 1 không có phân nhóm nghìn vì số <= 100).
export function ints(s) {
  const m = plain(s).match(/-?\d+/g);
  return m ? m.map(Number) : [];
}

/* ---------------- PARSER BIỂU THỨC THEO THỨ TỰ PHÉP TÍNH ---------------- */
// KHÔNG dùng eval / Function. Tokenize + shunting-yard cho + − và ngoặc.
// Lớp 1 chỉ có cộng/trừ (không nhân/chia) nhưng vẫn hỗ trợ × ÷ phòng hờ.
// Trả về số hoặc null nếu không parse được.
export function evalExpr(raw) {
  let e = plain(raw);
  const ci = e.indexOf(':');
  if (ci >= 0) e = e.slice(ci + 1);
  e = e.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/–/g, '-');
  e = e.replace(/\s+/g, '');
  if (!/^[-0-9+*/()]+$/.test(e) || e.length === 0) return null;

  const tokens = [];
  let i = 0;
  while (i < e.length) {
    const c = e[i];
    if (c >= '0' && c <= '9') {
      let num = '';
      while (i < e.length && e[i] >= '0' && e[i] <= '9') { num += e[i]; i++; }
      tokens.push({ t: 'num', v: Number(num) });
    } else if (c === '+' || c === '*' || c === '/') {
      tokens.push({ t: 'op', v: c }); i++;
    } else if (c === '-') {
      const prev = tokens[tokens.length - 1];
      if (prev && (prev.t === 'num' || (prev.t === 'paren' && prev.v === ')'))) {
        tokens.push({ t: 'op', v: '-' });
      } else {
        tokens.push({ t: 'neg' });
      }
      i++;
    } else if (c === '(' || c === ')') {
      tokens.push({ t: 'paren', v: c }); i++;
    } else { return null; }
  }

  const prec = { '+': 1, '-': 1, '*': 2, '/': 2 };
  const out = [];
  const ops = [];
  for (const tk of tokens) {
    if (tk.t === 'num') out.push(tk);
    else if (tk.t === 'neg') ops.push(tk);
    else if (tk.t === 'op') {
      while (ops.length) {
        const top = ops[ops.length - 1];
        if (top.t === 'neg') { out.push(ops.pop()); continue; }
        if (top.t === 'op' && prec[top.v] >= prec[tk.v]) { out.push(ops.pop()); }
        else break;
      }
      ops.push(tk);
    } else if (tk.v === '(') ops.push(tk);
    else {
      while (ops.length && !(ops[ops.length - 1].t === 'paren' && ops[ops.length - 1].v === '(')) {
        out.push(ops.pop());
      }
      if (!ops.length) return null;
      ops.pop();
      if (ops.length && ops[ops.length - 1].t === 'neg') out.push(ops.pop());
    }
  }
  while (ops.length) {
    const top = ops.pop();
    if (top.t === 'paren') return null;
    out.push(top);
  }

  const st = [];
  for (const tk of out) {
    if (tk.t === 'num') st.push(tk.v);
    else if (tk.t === 'neg') {
      if (!st.length) return null;
      st.push(-st.pop());
    } else {
      if (st.length < 2) return null;
      const b = st.pop(), a = st.pop();
      let r;
      switch (tk.v) {
        case '+': r = a + b; break;
        case '-': r = a - b; break;
        case '*': r = a * b; break;
        case '/': r = a / b; break;
        default: return null;
      }
      st.push(r);
    }
  }
  if (st.length !== 1) return null;
  return st[0];
}

/* --------------------- ĐỌC SỐ TIẾNG VIỆT (THAM CHIẾU) ------------------- */
// Bản tham chiếu ĐỘC LẬP với engine (chỉ tới 100), để đối chứng engine._readNumberVi.
// Quy tắc lớp 1: mười/mươi, mốt (đơn vị 1 ở số >=20), lăm (đơn vị 5), tư (đơn vị 4
// ở số >=20), tròn chục, một trăm. KHÔNG dùng "mốt"/"tư" cho 11/14.
const DV = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

export function refReadNumberVi(n) {
  if (n === 0) return 'không';
  if (n === 100) return 'một trăm';
  if (n < 10) return DV[n];
  const chuc = Math.floor(n / 10);
  const dv = n % 10;
  const parts = [];
  if (chuc === 1) {
    parts.push('mười');
    if (dv === 5) parts.push('lăm');
    else if (dv > 0) parts.push(DV[dv]);
  } else {
    parts.push(DV[chuc] + ' mươi');
    if (dv === 1) parts.push('mốt');
    else if (dv === 4) parts.push('tư');
    else if (dv === 5) parts.push('lăm');
    else if (dv > 0) parts.push(DV[dv]);
  }
  return parts.join(' ');
}
