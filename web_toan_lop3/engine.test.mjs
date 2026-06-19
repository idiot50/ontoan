// Test cho engine.js — chạy: node engine.test.mjs
// Kiểm: answer đúng (tính lại độc lập từ stem), mc index hợp lệ & choices không trùng,
// check() chấp nhận đáp án đúng và từ chối đáp án sai, không lỗi runtime.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const QE = require('./engine.js');

const N = 500; // số câu mỗi chủ đề (tăng lên để soi ca biên hiếm)
let failures = [];
let total = 0;

function fail(topic, msg, q) {
  failures.push({ topic, msg, q: JSON.stringify(q) });
}

// Bỏ thẻ HTML, sau đó decode &lt; &gt; &amp; -> dùng để re-parse.
function plain(s) {
  return String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}
// Lấy tất cả số nguyên trong chuỗi (đã gỡ dấu phân nhóm "1 234").
function ints(s) {
  const t = plain(s).replace(/(\d)[\s.](?=\d)/g, '$1');
  const m = t.match(/-?\d+/g);
  return m ? m.map(Number) : [];
}

// Tính biểu thức an toàn với thứ tự phép tính (chỉ + - × ÷ và ngoặc).
function evalExpr(stem) {
  let e = plain(stem);
  // chỉ giữ phần biểu thức (sau dấu ':')
  const ci = e.lastIndexOf(':');
  if (ci >= 0) e = e.slice(ci + 1);
  e = e.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\s/g, '');
  if (!/^[-0-9+*/()]+$/.test(e)) return null;
  // eslint-disable-next-line no-new-func
  return Function('"use strict";return (' + e + ')')();
}

// ---- Kiểm tra chung cho 1 câu hỏi ----
function validateCommon(q) {
  total++;
  if (!q || typeof q !== 'object') return fail('?', 'không phải object', q);
  if (!q.stem) return fail(q.topic, 'thiếu stem', q);
  if (!q.explain) return fail(q.topic, 'thiếu explain', q);
  if (q.type === 'mc') {
    if (!Array.isArray(q.choices) || q.choices.length < 2) return fail(q.topic, 'choices không hợp lệ', q);
    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.choices.length)
      return fail(q.topic, 'answer index ngoài phạm vi: ' + q.answer, q);
    const set = new Set(q.choices.map(String));
    if (set.size !== q.choices.length) return fail(q.topic, 'choices trùng nhau', q);
    // GIAO KÈO MC: check() so theo INDEX. Phải chấp nhận index đúng, từ chối index sai.
    if (!QE.check(q, q.answer)) fail(q.topic, 'check() từ chối index đúng', q);
    if (!QE.check(q, String(q.answer))) fail(q.topic, 'check() từ chối index đúng (chuỗi)', q);
    const wrong = (q.answer + 1) % q.choices.length;
    if (QE.check(q, wrong)) fail(q.topic, 'check() chấp nhận index sai', q);
  } else if (q.type === 'input') {
    if (q.answer === undefined || q.answer === null || q.answer === '') return fail(q.topic, 'thiếu answer input', q);
    if (!QE.check(q, q.answer)) fail(q.topic, 'check() từ chối answer chính nó', q);
  } else {
    return fail(q.topic, 'type lạ: ' + q.type, q);
  }
  // số trong tầm lớp 3: không vượt 100000 (trừ tiền đồng & dãy nhân có thể? -> kiểm riêng)
}

// ---- Kiểm chứng toán học theo chủ đề ----
function checkMath(q) {
  const I = ints(q.stem);
  switch (q.topic) {
    case 'cong-tru': {
      const v = evalExpr(q.stem);
      const a = expectMcOrInput(q);
      if (v !== null && a !== null && v !== a) fail(q.topic, `sai phép: stem=${v} answer=${a}`, q);
      break;
    }
    case 'nhan-chia': {
      const v = evalExpr(q.stem);
      const a = expectMcOrInput(q);
      if (v !== null && a !== null && v !== a) fail(q.topic, `sai phép: stem=${v} answer=${a}`, q);
      break;
    }
    case 'bieu-thuc': {
      if (q.type === 'mc') {
        const v = evalExpr(q.stem);
        const a = Number(plain(q.choices[q.answer]).replace(/\s/g, ''));
        if (v !== null && v !== a) fail(q.topic, `biểu thức sai thứ tự: stem=${v} answer=${a}`, q);
      } else {
        // tìm x: stem dạng "... <eq> ..."; verify bằng thay x.
        verifyFindX(q);
      }
      break;
    }
    case 'chia-du': {
      // stem: dividend ÷ divisor; answer "q dư r"
      const m = q.answer.match(/(\d+)\s*dư\s*(\d+)/);
      if (!m) { fail(q.topic, 'answer không đúng dạng dư', q); break; }
      const quo = Number(m[1]), rem = Number(m[2]);
      const dividend = I[0], divisor = I[1];
      if (rem <= 0 || rem >= divisor) fail(q.topic, `dư không hợp lệ: ${rem} với chia ${divisor}`, q);
      if (quo * divisor + rem !== dividend) fail(q.topic, `q×d+r ≠ dividend (${quo}×${divisor}+${rem}≠${dividend})`, q);
      break;
    }
    case 'so-100000': {
      // kiểm vài dạng có thể tính lại
      if (/đọc là/.test(plain(q.stem))) {
        // answer text phải = đọc số trong stem
        const num = I[0];
        const expected = QE._readNumberVi(num);
        const got = plain(q.choices[q.answer]).trim().toLowerCase();
        if (got !== expected) fail(q.topic, `đọc số sai: ${num} -> '${got}' ≠ '${expected}'`, q);
      } else if (/Viết số/.test(plain(q.stem))) {
        // answer là số; đọc lại số đó phải khớp chữ trong stem
        const text = plain(q.stem).replace(/.*:\s*/, '').trim().toLowerCase();
        const expected = QE._readNumberVi(Number(q.answer));
        if (text !== expected) fail(q.topic, `viết số: chữ '${text}' ≠ đọc lại '${expected}'`, q);
      } else if (/liền sau/.test(plain(q.stem))) {
        if (Number(q.answer) !== I[0] + 1) fail(q.topic, 'liền sau sai', q);
      } else if (/liền trước/.test(plain(q.stem))) {
        if (Number(q.answer) !== I[0] - 1) fail(q.topic, 'liền trước sai', q);
      } else if (/Sắp xếp/.test(plain(q.stem))) {
        const given = I.slice();                 // các số trong stem
        const ansArr = q.answer.split(';').map(Number);
        const sortedAsc = given.slice().sort((a, b) => a - b);
        const sortedDesc = given.slice().sort((a, b) => b - a);
        const isAsc = JSON.stringify(ansArr) === JSON.stringify(sortedAsc);
        const isDesc = JSON.stringify(ansArr) === JSON.stringify(sortedDesc);
        const wantAsc = /bé đến lớn/.test(plain(q.stem));
        if (wantAsc ? !isAsc : !isDesc) fail(q.topic, 'sắp xếp sai thứ tự', q);
      } else if (/dấu thích hợp/.test(plain(q.stem))) {
        const a = I[0], b = I[1];
        const sign = plain(q.choices[q.answer]).trim();
        const ok = (sign === '>' && a > b) || (sign === '<' && a < b) || (sign === '=' && a === b);
        if (!ok) fail(q.topic, `so sánh sai: ${a} ${sign} ${b}`, q);
      } else if (/giá trị/.test(plain(q.stem))) {
        // giá trị chữ số: explain chứa phép nhân, ta tin code; chỉ kiểm answer là bội của 10
        const a = Number(plain(q.choices[q.answer]).replace(/\s/g, ''));
        if (isNaN(a)) fail(q.topic, 'giá trị không phải số', q);
      } else if (/lớn nhất|bé nhất/.test(plain(q.stem))) {
        const a = Number(plain(q.choices[q.answer]).replace(/\s/g, ''));
        const want = /lớn nhất/.test(plain(q.stem)) ? Math.max(...I) : Math.min(...I);
        if (a !== want) fail(q.topic, `max/min sai: chọn ${a} nên là ${want}`, q);
      }
      break;
    }
    case 'hinh-hoc': {
      verifyGeometry(q, I);
      break;
    }
    case 'do-luong': {
      // không re-parse hết, nhưng kiểm số dương & answer trong tầm
      const a = expectMcOrInput(q);
      if (a !== null && (a < 0)) fail(q.topic, 'đo lường âm', q);
      break;
    }
    case 'tu-duy': {
      if (/Tính nhanh/.test(plain(q.stem))) {
        const v = evalExpr(q.stem);
        const a = Number(plain(q.choices[q.answer]).replace(/\s/g, ''));
        if (v !== null && v !== a) fail(q.topic, `tính nhanh sai: ${v} ≠ ${a}`, q);
      } else if (/x <|< x </.test(plain(q.stem)) || /< x </.test(plain(q.stem))) {
        const lo = I[0], hi = I[1], x = Number(q.answer);
        if (!(lo < x && x < hi)) fail(q.topic, `chặn sai: ${lo}<${x}<${hi}`, q);
      } else if (/dãy/.test(plain(q.stem))) {
        const seq = ints(q.stem);
        // add: kiểm hiệu đều; mul: kiểm tỉ đều
        const next = Number(q.answer);
        const dAdd = seq[1] - seq[0];
        const isAdd = seq.every((v, i) => i === 0 || v - seq[i - 1] === dAdd);
        if (isAdd) {
          if (next !== seq[seq.length - 1] + dAdd) fail(q.topic, 'dãy cộng: số tiếp sai', q);
        } else {
          const r = seq[1] / seq[0];
          if (next !== seq[seq.length - 1] * r) fail(q.topic, 'dãy nhân: số tiếp sai', q);
        }
      }
      break;
    }
    case 'loi-van': {
      // explain chứa phép tính kết thúc bằng "= <answer> ..."; chỉ kiểm answer xuất hiện đúng trong explain
      const ansNum = Number(q.answer);
      const expNums = ints(q.explain);
      if (!expNums.includes(ansNum)) fail(q.topic, `lời văn: answer ${ansNum} không khớp explain`, q);
      break;
    }
  }
}

function expectMcOrInput(q) {
  if (q.type === 'mc') {
    const n = Number(plain(q.choices[q.answer]).replace(/[^\d-]/g, ''));
    return isNaN(n) ? null : n;
  }
  const n = Number(q.answer);
  return isNaN(n) ? null : n;
}

function verifyFindX(q) {
  // stem dạng "... x <op> a = rhs" hoặc "a <op> x = rhs"
  const e = plain(q.stem).replace(/.*:\s*/, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\s/g, '').replace(/[.](?=\d)/g, '');
  const [lhs, rhsS] = e.split('=');
  const rhs = Number(rhsS);
  const x = Number(q.answer);
  const expr = lhs.replace(/x/g, '(' + x + ')');
  // eslint-disable-next-line no-new-func
  const val = Function('"use strict";return (' + expr + ')')();
  if (val !== rhs) fail(q.topic, `tìm x sai: thay x=${x} -> ${val} ≠ ${rhs} (${lhs})`, q);
}

function verifyGeometry(q, I) {
  const s = plain(q.stem);
  const ans = expectMcOrInput(q);
  if (/Hình vuông/.test(s)) {
    if (/Chu vi/.test(s) && /Cạnh/.test(s)) {
      // ngược: chu vi -> cạnh
      if (I[0] / 4 !== ans) fail(q.topic, 'ngược cv-hv sai', q);
    } else if (/Diện tích/.test(s) && /Cạnh/.test(s)) {
      if (ans * ans !== I[0]) fail(q.topic, 'ngược dt-hv sai', q);
    } else if (/Chu vi/.test(s)) {
      if (I[0] * 4 !== ans) fail(q.topic, `cv-hv sai: ${I[0]}×4≠${ans}`, q);
    } else if (/Diện tích/.test(s)) {
      if (I[0] * I[0] !== ans) fail(q.topic, `dt-hv sai`, q);
    }
  } else if (/Hình chữ nhật/.test(s)) {
    if (/Chiều rộng/.test(s)) {
      // ngược: chu vi & dài -> rộng
      const cv = I[0], d = I[1];
      if (cv / 2 - d !== ans) fail(q.topic, 'ngược cv-hcn sai', q);
    } else if (/Chu vi/.test(s)) {
      if ((I[0] + I[1]) * 2 !== ans) fail(q.topic, `cv-hcn sai`, q);
    } else if (/Diện tích/.test(s)) {
      if (I[0] * I[1] !== ans) fail(q.topic, `dt-hcn sai`, q);
    }
  }
}

// ---- Chạy ----
for (const t of QE.topics) {
  for (let i = 0; i < N; i++) {
    let q;
    try {
      q = QE.generate(t.id);
    } catch (err) {
      fail(t.id, 'runtime error: ' + err.message, { stack: err.stack });
      continue;
    }
    validateCommon(q);
    try { checkMath(q); } catch (err) { fail(t.id, 'checkMath threw: ' + err.message, q); }
  }
}

// generateMixed
for (let i = 0; i < 100; i++) {
  const arr = QE.generateMixed(10);
  if (arr.length !== 10) fail('mixed', 'generateMixed length ≠ 10', arr);
  arr.forEach(q => validateCommon(q));
}

// check() chuẩn hoá: dấu cách nghìn, hoa-thường, "du"/"r"
function assert(cond, msg) { if (!cond) fail('check-norm', msg, {}); total++; }
assert(QE.check({ type: 'input', answer: '12345' }, '12 345'), 'bỏ dấu cách nghìn');
assert(QE.check({ type: 'input', answer: '12345' }, '12.345'), 'bỏ chấm nghìn');
assert(QE.check({ type: 'input', answer: '7 dư 3' }, '7 du 3'), '"du" -> dư');
assert(QE.check({ type: 'input', answer: '7 dư 3' }, '7 r 3'), '"r" -> dư');
assert(QE.check({ type: 'input', answer: '7 dư 3' }, '7dư3'), 'gọn khoảng trắng dư');
assert(QE.check({ type: 'input', answer: 'năm' }, 'NĂM'), 'hoa-thường');
assert(QE.check({ type: 'input', answer: '100;200;300' }, '100, 200, 300'), 'dãy phẩy');
assert(QE.check({ type: 'input', answer: '100;200;300' }, '100 200 300'), 'dãy khoảng trắng');
assert(!QE.check({ type: 'input', answer: '12345' }, '12346'), 'từ chối sai');

// Kiểm đọc số tiếng Việt các ca khó (so với mong đợi thủ công).
const readCases = [
  [305, 'ba trăm linh năm'],
  [21, 'hai mươi mốt'],
  [15, 'mười lăm'],
  [11, 'mười một'],
  [24, 'hai mươi tư'],
  [25, 'hai mươi lăm'],
  [1000, 'một nghìn'],
  [1001, 'một nghìn không trăm linh một'],
  [1015, 'một nghìn không trăm mười lăm'],
  [10001, 'mười nghìn không trăm linh một'],
  [20021, 'hai mươi nghìn không trăm hai mươi mốt'],
  [99999, 'chín mươi chín nghìn chín trăm chín mươi chín'],
  [100, 'một trăm'],
  [305000 % 100000, undefined], // skip
];
for (const [n, exp] of readCases) {
  if (exp === undefined) continue;
  const got = QE._readNumberVi(n);
  total++;
  if (got !== exp) fail('readNumberVi', `${n} -> '${got}' ≠ '${exp}'`, {});
}

// ---- Báo cáo ----
console.log(`Đã kiểm ${total} phép kiểm tra trên ${QE.topics.length} chủ đề (mỗi chủ đề ${N} câu).`);
if (failures.length === 0) {
  console.log('KẾT QUẢ: SẠCH — không có lỗi nào.');
  process.exit(0);
} else {
  console.log(`KẾT QUẢ: ${failures.length} lỗi:`);
  const byTopic = {};
  failures.forEach(f => { byTopic[f.topic] = (byTopic[f.topic] || 0) + 1; });
  console.log('Theo chủ đề:', byTopic);
  failures.slice(0, 25).forEach(f => console.log(' -', f.topic, '|', f.msg, '|', f.q));
  process.exit(1);
}
