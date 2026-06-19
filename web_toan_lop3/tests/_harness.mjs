/*
 * _harness.mjs — tiện ích test dùng chung (assertion + nạp engine + parser).
 * Không phụ thuộc thư viện ngoài. Chạy bằng node thuần.
 */
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Nạp engine.js (classic script). Khi chạy node CommonJS, engine.js gán
// module.exports. Phòng trường hợp môi trường ESM khiến module.exports rỗng,
// engine cũng gán globalThis.QuestionEngine -> dùng làm dự phòng.
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

// Bỏ dấu phân nhóm nghìn ("12 345" / "12.345" -> 12345) rồi lấy các số nguyên.
// Lưu ý: groupDigits dùng KHOẢNG TRẮNG làm dấu phân nhóm.
export function unGroup(s) {
  return plain(s).replace(/(\d)[ .](?=\d\d\d(\D|$))/g, '$1');
}

// Lấy tất cả số nguyên (đã gỡ phân nhóm). Hữu ích để soi dữ kiện.
export function ints(s) {
  const t = unGroup(s);
  const m = t.match(/-?\d+/g);
  return m ? m.map(Number) : [];
}

/* ---------------- PARSER BIỂU THỨC THEO THỨ TỰ PHÉP TÍNH ---------------- */
// KHÔNG dùng eval / Function. Tokenize + shunting-yard cho + - × ÷ và ngoặc.
// Trả về số (hữu tỉ chính xác đủ cho phạm vi lớp 3) hoặc null nếu không parse được.
export function evalExpr(raw) {
  let e = plain(raw);
  // chỉ giữ phần sau dấu ':' đầu tiên nếu có (đề kiểu "Tính ...: 2 + 3")
  const ci = e.indexOf(':');
  if (ci >= 0) e = e.slice(ci + 1);
  // chuẩn hoá ký hiệu
  e = e.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/–/g, '-');
  // gỡ phân nhóm nghìn: khoảng trắng/chấm giữa các chữ số
  e = e.replace(/(\d)[ .](?=\d)/g, '$1');
  e = e.replace(/\s+/g, '');
  if (!/^[-0-9+*/()]+$/.test(e) || e.length === 0) return null;

  // Tokenize
  const tokens = [];
  let i = 0;
  while (i < e.length) {
    const c = e[i];
    if (c >= '0' && c <= '9') {
      let num = '';
      while (i < e.length && e[i] >= '0' && e[i] <= '9') { num += e[i]; i++; }
      tokens.push({ t: 'num', v: Number(num) });
    } else if (c === '+' || c === '*' || c === '/' ) {
      tokens.push({ t: 'op', v: c }); i++;
    } else if (c === '-') {
      // dấu trừ: nhị phân nếu trước đó là số/đóng ngoặc, ngược lại là đơn nguyên
      const prev = tokens[tokens.length - 1];
      if (prev && (prev.t === 'num' || (prev.t === 'paren' && prev.v === ')'))) {
        tokens.push({ t: 'op', v: '-' });
      } else {
        tokens.push({ t: 'neg' }); // âm đơn nguyên
      }
      i++;
    } else if (c === '(' || c === ')') {
      tokens.push({ t: 'paren', v: c }); i++;
    } else { return null; }
  }

  // Shunting-yard -> RPN
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
    else { // ')'
      while (ops.length && !(ops[ops.length - 1].t === 'paren' && ops[ops.length - 1].v === '(')) {
        out.push(ops.pop());
      }
      if (!ops.length) return null;
      ops.pop(); // bỏ '('
      // nếu trên đỉnh là neg áp cho cụm ngoặc thì lấy ra
      if (ops.length && ops[ops.length - 1].t === 'neg') out.push(ops.pop());
    }
  }
  while (ops.length) {
    const top = ops.pop();
    if (top.t === 'paren') return null;
    out.push(top);
  }

  // Đánh giá RPN
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
// Bản tham chiếu ĐỘC LẬP với engine, để đối chứng engine._readNumberVi.
const DV = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function refBelowThousand(n, full) {
  const tram = Math.floor(n / 100);
  const chuc = Math.floor((n % 100) / 10);
  const dv = n % 10;
  const parts = [];
  if (tram > 0) parts.push(DV[tram] + ' trăm');
  else if (full) parts.push('không trăm');

  if (chuc === 0) {
    if (dv > 0 && (tram > 0 || full)) parts.push('linh ' + DV[dv]);
    else if (dv > 0) parts.push(DV[dv]);
  } else if (chuc === 1) {
    parts.push('mười');
    if (dv === 1) parts.push('một');
    else if (dv === 5) parts.push('lăm');
    else if (dv > 0) parts.push(DV[dv]);
  } else {
    parts.push(DV[chuc] + ' mươi');
    if (dv === 1) parts.push('mốt');
    else if (dv === 5) parts.push('lăm');
    else if (dv === 4) parts.push('tư');
    else if (dv > 0) parts.push(DV[dv]);
  }
  return parts.join(' ');
}

export function refReadNumberVi(n) {
  if (n === 0) return 'không';
  const nghin = Math.floor(n / 1000);
  const duoi = n % 1000;
  if (nghin === 0) return refBelowThousand(duoi, false);
  const head = refBelowThousand(nghin, false) + ' nghìn';
  if (duoi === 0) return head;
  return head + ' ' + refBelowThousand(duoi, true);
}
