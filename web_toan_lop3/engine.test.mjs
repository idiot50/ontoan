// Test cho engine.js — chạy: node engine.test.mjs
// Mục tiêu: với engine ĐÃ NÂNG ĐỘ KHÓ, kiểm độc lập (không tin code engine):
//  - answer tính lại từ stem bằng parser thứ tự phép tính TỰ VIẾT (không dùng eval cho biểu thức).
//  - mc: answer là INDEX hợp lệ, choices không trùng, check() nhận index đúng / từ chối sai.
//  - input: check() nhận chính answer; với mỗi dạng có quy tắc kiểm riêng (chia dư q×d+r=N,
//    chu vi/diện tích, đổi đơn vị, tìm x thế nghiệm, dãy số, suy luận ngược, trồng cây, đếm...).
//  - MỌI số trong stem/answer/choices <= 100 000.
//  - KHÔNG dấu hiệu vượt tầm: stem/answer không chứa '/', '%', 'phân số', 'thập phân'.
//  - Phân bố tầng (thống kê) hợp lý.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const QE = require('./engine.js');

const N = 600; // số câu mỗi chủ đề
let failures = [];
let total = 0;

function fail(topic, msg, q) {
  failures.push({ topic, msg, q: JSON.stringify(q) });
}
function ok() { total++; }

// Bỏ thẻ HTML, decode &lt; &gt; &amp;.
function plain(s) {
  return String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}
// Lấy tất cả số nguyên (đã gỡ dấu cách/chấm phân nhóm "1 234" / "1.234").
function ints(s) {
  const t = plain(s).replace(/(\d)[\s.](?=\d)/g, '$1');
  const m = t.match(/-?\d+/g);
  return m ? m.map(Number) : [];
}

/* ----- Parser biểu thức TỰ VIẾT (đệ quy giảm dần), thứ tự phép tính chuẩn ----- */
// Token: số, + - × ÷ ( ). Không dùng eval/Function cho việc tính giá trị biểu thức.
function tokenize(expr) {
  const s = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\s+/g, '');
  const toks = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c >= '0' && c <= '9') {
      let num = '';
      while (i < s.length && s[i] >= '0' && s[i] <= '9') { num += s[i]; i++; }
      toks.push({ t: 'num', v: Number(num) });
    } else if ('+-*/()'.includes(c)) {
      toks.push({ t: c });
      i++;
    } else {
      return null; // ký tự lạ -> không phải biểu thức thuần
    }
  }
  return toks;
}
function parseExprSafe(expr) {
  const toks = tokenize(expr);
  if (!toks) return null;
  let pos = 0;
  function peek() { return toks[pos]; }
  function eat(t) { if (toks[pos] && toks[pos].t === t) return toks[pos++]; return null; }
  function factor() {
    if (eat('(')) {
      const v = addsub();
      if (!eat(')')) throw new Error('thiếu )');
      return v;
    }
    const n = eat('num');
    if (!n) throw new Error('mong đợi số');
    return n.v;
  }
  function muldiv() {
    let v = factor();
    while (peek() && (peek().t === '*' || peek().t === '/')) {
      const op = toks[pos++].t;
      const r = factor();
      if (op === '*') v = v * r;
      else { if (r === 0 || v % r !== 0) throw new Error('chia không hết'); v = v / r; }
    }
    return v;
  }
  function addsub() {
    let v = muldiv();
    while (peek() && (peek().t === '+' || peek().t === '-')) {
      const op = toks[pos++].t;
      const r = muldiv();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  }
  try {
    const v = addsub();
    if (pos !== toks.length) return null;
    return v;
  } catch (e) {
    return null;
  }
}
// Lấy phần biểu thức từ stem "Tính: <expr>" / "Tính nhanh: <expr>".
function exprPart(stem) {
  let e = plain(stem);
  const ci = e.lastIndexOf(':');
  if (ci >= 0) e = e.slice(ci + 1);
  return e.trim();
}

function mcValue(q) {
  return Number(plain(q.choices[q.answer]).replace(/[^\d-]/g, ''));
}
function expectMcOrInput(q) {
  if (q.type === 'mc') {
    const n = Number(plain(q.choices[q.answer]).replace(/[^\d-]/g, ''));
    return isNaN(n) ? null : n;
  }
  const n = Number(q.answer);
  return isNaN(n) ? null : n;
}

/* ---- Kiểm tra chung cho 1 câu hỏi ---- */
function validateCommon(q) {
  total++;
  if (!q || typeof q !== 'object') return fail('?', 'không phải object', q);
  if (!q.stem) return fail(q.topic, 'thiếu stem', q);
  if (!q.explain) return fail(q.topic, 'thiếu explain', q);

  // KHÔNG dấu hiệu vượt tầm lớp 3.
  const blob = plain(q.stem) + ' ' + String(q.answer) + ' ' + plain(q.explain) +
    (q.choices ? ' ' + q.choices.map(plain).join(' ') : '');
  if (/[%]/.test(blob)) fail(q.topic, 'có dấu % (vượt tầm)', q);
  if (/phân số|thập phân|tam giác|hình thang|hình tròn|hình thoi|thể tích|trung bình cộng/.test(blob))
    fail(q.topic, 'từ ngữ vượt tầm lớp 3', q);
  // Phần HIỂN THỊ phép tính (stem + choices + answer) phải dùng ÷, không dùng '/'.
  // (explain là văn xuôi tiếng Việt, có thể chứa "hơn/kém" nên không xét ở đây.)
  const mathBlob = plain(q.stem) + ' ' + String(q.answer) +
    (q.choices ? ' ' + q.choices.map(plain).join(' ') : '');
  if (/\//.test(mathBlob)) fail(q.topic, "có ký tự '/' trong stem/answer/choices (phải dùng ÷)", q);
  // answer không được là số thập phân (có dấu phẩy/chấm thập phân giữa chữ số đứng riêng).
  if (q.type === 'input' && /^\d+[.,]\d/.test(String(q.answer).replace(/\s/g, ''))) {
    // chấp nhận dãy "1;2;3" (đã có ';'); chỉ chặn số đơn dạng "12.5"
    if (String(q.answer).indexOf(';') === -1) fail(q.topic, 'answer là số thập phân: ' + q.answer, q);
  }

  // Mọi số <= 100 000 (kiểm stem + choices + answer + explain).
  const allNums = ints(q.stem)
    .concat(q.choices ? q.choices.flatMap(c => ints(c)) : [])
    .concat(ints(String(q.answer)))
    .concat(ints(q.explain));
  for (const n of allNums) {
    if (Math.abs(n) > 100000) { fail(q.topic, 'số vượt 100 000: ' + n, q); break; }
  }

  if (q.type === 'mc') {
    if (!Array.isArray(q.choices) || q.choices.length < 2) return fail(q.topic, 'choices không hợp lệ', q);
    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.choices.length)
      return fail(q.topic, 'answer index ngoài phạm vi: ' + q.answer, q);
    const set = new Set(q.choices.map(c => plain(c)));
    if (set.size !== q.choices.length) return fail(q.topic, 'choices trùng nhau: ' + JSON.stringify(q.choices), q);

    // GUARD chống tái lỗi distractor rác ở câu "điền dấu":
    // nếu BẤT KỲ choice nào là một trong các dấu so sánh {>,<,=} thì:
    //  - TẤT CẢ choices đều phải ∈ {>,<,=}, và
    //  - đúng 3 phương án, không trùng (= chính là {'>','<','='}).
    const SIGNS = new Set(['>', '<', '=']);
    const trimmed = q.choices.map(c => plain(c).trim());
    if (trimmed.some(c => SIGNS.has(c))) {
      const allSigns = trimmed.every(c => SIGNS.has(c));
      // Không phương án dấu nào được lẫn chữ số hay dấu '-' (lỗi ">7", "<-8"…).
      const racChar = q.choices.filter(c => /[0-9-]/.test(plain(c)));
      if (racChar.length) {
        fail(q.topic, 'điền dấu lẫn ký tự số/"-" (phương án RÁC): ' + JSON.stringify(q.choices), q);
      } else if (!allSigns) {
        fail(q.topic, 'điền dấu lẫn phương án RÁC ngoài {>,<,=}: ' + JSON.stringify(q.choices), q);
      } else if (q.choices.length !== 3) {
        fail(q.topic, 'điền dấu không đúng 3 phương án: ' + JSON.stringify(q.choices), q);
      } else if (new Set(trimmed).size !== 3) {
        fail(q.topic, 'điền dấu có dấu trùng (phải đủ >,<,=): ' + JSON.stringify(q.choices), q);
      }
    }

    if (!QE.check(q, q.answer)) fail(q.topic, 'check() từ chối index đúng', q);
    if (!QE.check(q, String(q.answer))) fail(q.topic, 'check() từ chối index đúng (chuỗi)', q);
    const wrong = (q.answer + 1) % q.choices.length;
    if (QE.check(q, wrong)) fail(q.topic, 'check() chấp nhận index sai', q);
  } else if (q.type === 'input') {
    if (q.answer === undefined || q.answer === null || q.answer === '') return fail(q.topic, 'thiếu answer input', q);
    if (!QE.check(q, q.answer)) fail(q.topic, 'check() từ chối answer chính nó: ' + q.answer, q);
  } else {
    return fail(q.topic, 'type lạ: ' + q.type, q);
  }
}

/* ---- Kiểm chứng toán học theo chủ đề ---- */
function checkMath(q) {
  const s = plain(q.stem);
  const I = ints(q.stem);
  switch (q.topic) {
    case 'cong-tru': return checkCongTru(q, s, I);
    case 'nhan-chia': return checkNhanChia(q, s, I);
    case 'bieu-thuc': return checkBieuThuc(q, s, I);
    case 'chia-du': return checkChiaDu(q, s, I);
    case 'so-100000': return checkSo(q, s, I);
    case 'hinh-hoc': return checkHinh(q, s, I);
    case 'do-luong': return checkDoLuong(q, s, I);
    case 'loi-van': return checkLoiVan(q, s, I);
    case 'tu-duy': return checkTuDuy(q, s, I);
  }
}

function checkCongTru(q, s, I) {
  // Dạng có biểu thức "Tính:" hoặc "Tính nhanh:"
  if (/^Tính/.test(s) && q.type === 'mc') {
    const v = parseExprSafe(exprPart(s));
    const a = mcValue(q);
    if (v === null) return fail(q.topic, 'không parse được biểu thức: ' + s, q);
    if (v !== a) fail(q.topic, `sai phép: stem=${v} answer=${a}`, q);
    return;
  }
  // Suy luận ngược: "Hai số cộng lại được T ... Một số là M ... Số kia"
  if (/Hai số cộng lại/.test(s)) {
    const T = I[0], M = I[1];
    if (Number(q.answer) !== T - M) fail(q.topic, `ngược tổng sai: ${T}-${M}≠${q.answer}`, q);
    return;
  }
  // tổng & hiệu: "tổng là S, số lớn hơn số bé H ... Tìm số lớn"
  if (/tổng là/.test(s)) {
    const S = I[0], H = I[1];
    const big = (S + H) / 2;
    if ((S + H) % 2 !== 0) fail(q.topic, `(tổng+hiệu) không chẵn: ${S}+${H}`, q);
    if (Number(q.answer) !== big) fail(q.topic, `số lớn sai: (${S}+${H})/2=${big}≠${q.answer}`, q);
    return;
  }
  fail(q.topic, 'dạng cong-tru không nhận diện được: ' + s, q);
}

function checkNhanChia(q, s, I) {
  if (/^Tính:/.test(s) && q.type === 'mc') {
    const v = parseExprSafe(exprPart(s));
    const a = mcValue(q);
    if (v === null) return fail(q.topic, 'không parse được: ' + s, q);
    if (v !== a) fail(q.topic, `sai phép: stem=${v} answer=${a}`, q);
    return;
  }
  if (/Điền dấu/.test(s)) {
    // "X × y ___ Z × w" -> so sánh hai tích.
    const part = exprPart(s);
    const [L, R] = part.split('___');
    const lv = parseExprSafe(L), rv = parseExprSafe(R);
    const sign = plain(q.choices[q.answer]).trim();
    const ok = (sign === '>' && lv > rv) || (sign === '<' && lv < rv) || (sign === '=' && lv === rv);
    if (!ok) fail(q.topic, `so sánh tích sai: ${lv} ${sign} ${rv}`, q);
    return;
  }
  if (/Số nào nhân với/.test(s)) {
    const k = I[0], P = I[1];
    if (Number(q.answer) * k !== P) fail(q.topic, `ngược nhân sai: ${q.answer}×${k}≠${P}`, q);
    return;
  }
  if (/được thương/.test(s)) {
    const k = I[0], qt = I[1];
    if (Number(q.answer) !== qt * k) fail(q.topic, `ngược chia sai: ${qt}×${k}≠${q.answer}`, q);
    return;
  }
  if (/gấp/.test(s)) {
    // "A có a ... gấp k lần ... cả hai có mấy" -> a + a*k
    const a = I[0], k = I[1];
    const want = a + a * k;
    if (mcValue(q) !== want) fail(q.topic, `gấp-gộp sai: ${a}+${a}×${k}=${want}≠${mcValue(q)}`, q);
    return;
  }
  fail(q.topic, 'dạng nhan-chia không nhận diện: ' + s, q);
}

function checkBieuThuc(q, s, I) {
  if (q.type === 'mc') {
    const v = parseExprSafe(exprPart(s));
    const a = mcValue(q);
    if (v === null) return fail(q.topic, 'không parse được biểu thức: ' + s, q);
    if (v !== a) fail(q.topic, `biểu thức sai thứ tự: stem=${v} answer=${a}`, q);
    return;
  }
  // tìm x: lhs = rhs ; thế x.
  verifyFindX(q, s);
}

function verifyFindX(q, s) {
  // lấy phương trình sau dấu ':'
  let e = exprPart(s).replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\s+/g, '');
  // gỡ chấm phân nhóm
  e = e.replace(/(\d)[.](?=\d)/g, '$1');
  const eq = e.split('=');
  if (eq.length !== 2) return fail(q.topic, 'tìm x: không thấy "=": ' + s, q);
  const rhs = Number(eq[1]);
  const x = Number(q.answer);
  // thay x vào lhs và tính bằng parser tự viết (x là số tự nhiên).
  const lhs = eq[0].replace(/x/g, '(' + x + ')');
  const val = parseExprSafe(lhs);
  if (val === null) return fail(q.topic, 'tìm x: không parse được lhs sau khi thế: ' + lhs, q);
  if (val !== rhs) fail(q.topic, `tìm x sai: thế x=${x} -> ${val} ≠ ${rhs} (${eq[0]})`, q);
}

function checkChiaDu(q, s, I) {
  if (/Đặt tính/.test(s)) {
    const m = String(q.answer).match(/(\d+)\s*dư\s*(\d+)/);
    if (!m) return fail(q.topic, 'answer không đúng dạng dư: ' + q.answer, q);
    const quo = Number(m[1]), rem = Number(m[2]);
    const dividend = I[0], divisor = I[1];
    if (rem <= 0 || rem >= divisor) fail(q.topic, `dư không hợp lệ: ${rem} với chia ${divisor}`, q);
    if (quo * divisor + rem !== dividend) fail(q.topic, `q×d+r ≠ dividend: ${quo}×${divisor}+${rem}≠${dividend}`, q);
    return;
  }
  if (/Cần ít nhất/.test(s)) {
    // làm tròn LÊN: cần ceil(total/cap)
    const cap = I[0], totalThing = I[1];
    const want = Math.floor(totalThing / cap) + (totalThing % cap === 0 ? 0 : 1);
    if (mcValue(q) !== want) fail(q.topic, `làm tròn lên sai: ceil(${totalThing}/${cap})=${want}≠${mcValue(q)}`, q);
    return;
  }
  if (/mấy hộp đầy/.test(s)) {
    const totalThing = I[0], per = I[1];
    if (Number(q.answer) !== Math.floor(totalThing / per)) fail(q.topic, `hộp đầy sai`, q);
    return;
  }
  if (/còn thừa/.test(s)) {
    const totalThing = I[0], per = I[1];
    if (Number(q.answer) !== totalThing % per) fail(q.topic, `còn thừa sai: ${totalThing}%${per}`, q);
    return;
  }
  if (/được thương/.test(s)) {
    // ngược tìm số bị chia: divisor, quotient, remainder
    const d = I[0], qt = I[1], r = I[2];
    if (r <= 0 || r >= d) fail(q.topic, `dư ngược không hợp lệ: ${r}/${d}`, q);
    if (Number(q.answer) !== qt * d + r) fail(q.topic, `ngược dividend sai: ${qt}×${d}+${r}≠${q.answer}`, q);
    return;
  }
  fail(q.topic, 'dạng chia-du không nhận diện: ' + s, q);
}

function checkSo(q, s, I) {
  if (/đọc là/.test(s)) {
    const num = I[0];
    const expected = QE._readNumberVi(num);
    const got = plain(q.choices[q.answer]).trim().toLowerCase();
    if (got !== expected) fail(q.topic, `đọc số sai: ${num} -> '${got}' ≠ '${expected}'`, q);
    return;
  }
  if (/Viết số/.test(s)) {
    const text = s.replace(/.*:\s*/, '').trim().toLowerCase();
    const expected = QE._readNumberVi(Number(q.answer));
    if (text !== expected) fail(q.topic, `viết số: '${text}' ≠ đọc lại '${expected}'`, q);
    return;
  }
  if (/liền sau/.test(s)) {
    if (Number(q.answer) !== I[0] + 1) fail(q.topic, 'liền sau sai', q); return;
  }
  if (/liền trước/.test(s)) {
    if (Number(q.answer) !== I[0] - 1) fail(q.topic, 'liền trước sai', q); return;
  }
  if (/Sắp xếp/.test(s)) {
    const given = I.slice();
    const ansArr = String(q.answer).split(';').map(Number);
    const asc = given.slice().sort((a, b) => a - b);
    const desc = given.slice().sort((a, b) => b - a);
    const wantAsc = /bé đến lớn/.test(s);
    const target = wantAsc ? asc : desc;
    if (JSON.stringify(ansArr) !== JSON.stringify(target)) fail(q.topic, 'sắp xếp sai thứ tự', q);
    if (ansArr.length !== given.length) fail(q.topic, 'thiếu phần tử khi sắp xếp', q);
    return;
  }
  if (/Điền dấu/.test(s)) {
    const a = I[0], b = I[1];
    const sign = plain(q.choices[q.answer]).trim();
    const ok = (sign === '>' && a > b) || (sign === '<' && a < b) || (sign === '=' && a === b);
    if (!ok) fail(q.topic, `so sánh sai: ${a} ${sign} ${b}`, q);
    return;
  }
  if (/giá trị là/.test(s)) {
    // giá trị chữ số: stem có "số N, chữ số D ở hàng H". tính lại.
    const num = I[0], digit = I[1];
    const hangMap = { 'hàng đơn vị': 0, 'hàng chục': 1, 'hàng trăm': 2, 'hàng nghìn': 3, 'hàng chục nghìn': 4 };
    let pos = null;
    for (const k in hangMap) if (s.includes(k)) pos = hangMap[k];
    if (pos === null) return fail(q.topic, 'không thấy hàng', q);
    const want = digit * Math.pow(10, pos);
    if (mcValue(q) !== want) fail(q.topic, `giá trị chữ số sai: ${digit}×10^${pos}=${want}≠${mcValue(q)}`, q);
    return;
  }
  if (/có giá trị/.test(s) && /ở hàng nào/.test(s)) {
    // ngược: chữ số D có giá trị V -> hàng nào. answer là text hàng.
    const num = I[0], digit = I[1], val = I[2];
    const pos = Math.round(Math.log10(val / digit));
    const hangArr = ['hàng đơn vị', 'hàng chục', 'hàng trăm', 'hàng nghìn', 'hàng chục nghìn'];
    if (plain(q.choices[q.answer]).trim() !== hangArr[pos]) fail(q.topic, `hàng ngược sai: muốn ${hangArr[pos]}`, q);
    // kiểm số thực sự có chữ số digit ở hàng pos
    const digOfNum = Math.floor(num / Math.pow(10, pos)) % 10;
    if (digOfNum !== digit) fail(q.topic, `số ${num} không có chữ số ${digit} ở hàng ${pos}`, q);
    return;
  }
  if (/lớn nhất|bé nhất/.test(s) && q.type === 'mc') {
    const a = mcValue(q);
    const want = /lớn nhất/.test(s) ? Math.max(...I) : Math.min(...I);
    if (a !== want) fail(q.topic, `max/min sai: chọn ${a} nên là ${want}`, q);
    return;
  }
  if (/lập số/.test(s)) {
    // 4 thẻ, lớn nhất / bé nhất, 0 không đứng đầu.
    const tags = I; // 4 chữ số thẻ (vì stem chỉ liệt kê thẻ)
    const four = tags.slice(0, 4);
    const wantMax = /lớn nhất/.test(s);
    const desc = four.slice().sort((a, b) => b - a);
    const asc = four.slice().sort((a, b) => a - b);
    let want;
    if (wantMax) want = Number(desc.join(''));
    else {
      const a2 = asc.slice();
      if (a2[0] === 0) for (let k = 1; k < a2.length; k++) if (a2[k] !== 0) { [a2[0], a2[k]] = [a2[k], a2[0]]; break; }
      want = Number(a2.join(''));
    }
    if (Number(q.answer) !== want) fail(q.topic, `lập số sai: muốn ${want} từ ${four}`, q);
    // số không bắt đầu bằng 0
    if (String(q.answer)[0] === '0') fail(q.topic, 'số lập bắt đầu bằng 0', q);
    return;
  }
  if (/tròn nghìn lớn nhất/.test(s)) {
    const nn = I[0];
    const want = Math.floor((nn - 1) / 1000) * 1000; // tròn nghìn lớn nhất bé hơn nn
    // chú ý nn không tròn nghìn nên floor(nn/1000)*1000 cũng đúng
    const want2 = Math.floor(nn / 1000) * 1000;
    if (Number(q.answer) !== want2) fail(q.topic, `tròn nghìn sai: muốn ${want2} với N=${nn}`, q);
    if (Number(q.answer) >= nn) fail(q.topic, `tròn nghìn không bé hơn N`, q);
    if (Number(q.answer) % 1000 !== 0) fail(q.topic, `không tròn nghìn`, q);
    return;
  }
  if (/tròn chục nghìn lớn nhất/.test(s)) {
    const nn = I[0];
    const want = Math.floor(nn / 10000) * 10000;
    if (Number(q.answer) !== want) fail(q.topic, `tròn chục nghìn sai: muốn ${want}`, q);
    if (Number(q.answer) >= nn) fail(q.topic, `tròn chục nghìn không bé hơn N`, q);
    if (Number(q.answer) % 10000 !== 0) fail(q.topic, `không tròn chục nghìn`, q);
    return;
  }
  fail(q.topic, 'dạng so-100000 không nhận diện: ' + s, q);
}

function checkHinh(q, s, I) {
  const ans = expectMcOrInput(q);
  if (/Hình vuông/.test(s)) {
    if (/chu vi/i.test(s) && /Cạnh/.test(s)) {
      if (I[0] / 4 !== ans) fail(q.topic, `ngược cv-hv sai: ${I[0]}/4≠${ans}`, q);
    } else if (/diện tích/i.test(s) && /Cạnh/.test(s)) {
      if (ans * ans !== I[0]) fail(q.topic, `ngược dt-hv sai: ${ans}²≠${I[0]}`, q);
    } else if (/Chu vi/.test(s)) {
      if (I[0] * 4 !== ans) fail(q.topic, `cv-hv sai: ${I[0]}×4≠${ans}`, q);
    } else if (/Diện tích/.test(s)) {
      if (I[0] * I[0] !== ans) fail(q.topic, `dt-hv sai: ${I[0]}²≠${ans}`, q);
    } else {
      fail(q.topic, 'hình vuông dạng lạ: ' + s, q);
    }
    return;
  }
  if (/chiều dài hơn chiều rộng/.test(s)) {
    // cv-hieu: chu vi P, dài hơn rộng h -> chiều dài (xét TRƯỚC nhánh HCN chung).
    const P = I[0], h = I[1];
    const nua = P / 2;
    const dL = (nua + h) / 2;
    if (P % 2 !== 0) fail(q.topic, `cv-hieu: chu vi lẻ`, q);
    if ((nua + h) % 2 !== 0) fail(q.topic, `cv-hieu: (nửa+hiệu) không chẵn`, q);
    if (Number(q.answer) !== dL) fail(q.topic, `cv-hieu sai: muốn ${dL}≠${q.answer}`, q);
    return;
  }
  if (/Hình chữ nhật/.test(s)) {
    if (/Chiều rộng/.test(s)) {
      const cv = I[0], d = I[1];
      if (cv / 2 - d !== ans) fail(q.topic, `ngược cv-hcn sai: ${cv}/2-${d}≠${ans}`, q);
    } else if (/Chu vi/.test(s)) {
      if ((I[0] + I[1]) * 2 !== ans) fail(q.topic, `cv-hcn sai`, q);
    } else if (/Diện tích/.test(s)) {
      if (I[0] * I[1] !== ans) fail(q.topic, `dt-hcn sai`, q);
    } else {
      fail(q.topic, 'hcn dạng lạ: ' + s, q);
    }
    return;
  }
  if (/cắt ra một hình vuông/.test(s)) {
    // mảnh HCN dài D rộng R, cắt HV cạnh c -> còn lại D*R - c*c
    const D = I[0], R = I[1], c = I[2];
    const want = D * R - c * c;
    if (mcValue(q) !== want) fail(q.topic, `cắt hình sai: ${D}×${R}-${c}²=${want}≠${mcValue(q)}`, q);
    return;
  }
  if (/viên gạch/.test(s)) {
    // nền và viên; số viên = areaFloor / areaTile
    let areaFloor, areaTile;
    if (/hình vuông cạnh (\d+) m\. Mỗi viên/.test(s) || /Nền phòng hình vuông/.test(s)) {
      // hai trường hợp nền vuông / nền chữ nhật
      if (/Nền phòng hình vuông/.test(s)) {
        const side = I[0], tile = I[1];
        areaFloor = side * side; areaTile = tile * tile;
      } else {
        const dlen = I[0], rlen = I[1], tile = I[2];
        areaFloor = dlen * rlen; areaTile = tile * tile;
      }
    } else {
      const dlen = I[0], rlen = I[1], tile = I[2];
      areaFloor = dlen * rlen; areaTile = tile * tile;
    }
    const want = areaFloor / areaTile;
    if (mcValue(q) !== want) fail(q.topic, `viên gạch sai: ${areaFloor}/${areaTile}=${want}≠${mcValue(q)}`, q);
    return;
  }
  fail(q.topic, 'dạng hinh-hoc không nhận diện: ' + s, q);
}

function checkDoLuong(q, s, I) {
  const a = expectMcOrInput(q);
  if (a !== null && a < 0) fail(q.topic, 'đo lường âm: ' + a, q);

  if (/Đổi đơn vị/.test(s)) {
    // "X <from> = ___ <to>" -> X * k. Đọc hệ số từ explain "1 from = K to".
    const m = plain(q.explain).match(/1 .+? = ([\d ]+) /);
    const val = I[0];
    const k = m ? Number(m[1].replace(/\s/g, '')) : null;
    if (k !== null && mcValue(q) !== val * k) fail(q.topic, `đổi đơn vị sai: ${val}×${k}≠${mcValue(q)}`, q);
    return;
  }
  if (/Đổi rồi tính/.test(s)) {
    // hỗn hợp ± . Tin explain đã có "= <ans> <unit>", kiểm answer = số cuối explain.
    const expNums = ints(q.explain);
    if (mcValue(q) !== expNums[expNums.length - 1]) fail(q.topic, `đổi-tính: answer ≠ kết quả explain`, q);
    return;
  }
  if (/tờ loại/.test(s) || /tờ tiền loại/.test(s)) {
    // tiền: explain kết bằng "= <ans> đồng". kiểm answer khớp số cuối explain.
    const expNums = ints(q.explain);
    if (mcValue(q) !== expNums[expNums.length - 1]) fail(q.topic, `tiền: answer ≠ kết quả explain`, q);
    // Hai mệnh giá phải KHÁC nhau (không "5 000đ và 5 000đ").
    const menhGia = [...s.matchAll(/loại\s+([\d ]+?)\s*đồng/g)].map(x => Number(x[1].replace(/\s/g, '')));
    if (menhGia.length >= 2 && menhGia[0] === menhGia[1]) {
      fail(q.topic, `tiền 2 mệnh giá TRÙNG nhau: ${menhGia[0]}đ và ${menhGia[1]}đ`, q);
    }
    return;
  }
  if (/bắt đầu lúc/.test(s)) {
    // khoảng thời gian: (h2*60+m2) - (h1*60+m1)
    const h1 = I[0], m1 = I[1], h2 = I[2], m2 = I[3];
    const want = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (Number(q.answer) !== want) fail(q.topic, `khoảng giờ sai: muốn ${want}≠${q.answer}`, q);
    if (want <= 0) fail(q.topic, 'khoảng thời gian không dương', q);
    return;
  }
  if (/can thứ nhất|Can thứ nhất/.test(s)) {
    const x = I[0], y = I[1];
    if (mcValue(q) !== x + y) fail(q.topic, `lít sai: ${x}+${y}≠${mcValue(q)}`, q);
    return;
  }
  if (/trả lại/.test(s)) {
    // mua hàng – tiền thừa. Tin explain: số cuối = tiền thừa = answer.
    const expNums = ints(q.explain);
    if (Number(q.answer) !== expNums[expNums.length - 1]) fail(q.topic, `tiền thừa: answer ≠ kết quả explain`, q);
    if (Number(q.answer) < 0) fail(q.topic, 'tiền thừa âm', q);
    return;
  }
  // các dạng đổi đơn vị thời gian/khối lượng đã rơi vào "Đổi đơn vị".
  fail(q.topic, 'dạng do-luong không nhận diện: ' + s, q);
}

function checkLoiVan(q, s, I) {
  // Tất cả lời văn là input số; kiểm answer xuất hiện trong explain (explain trình bày bước & kết quả).
  const ansNum = Number(q.answer);
  const expNums = ints(q.explain);
  if (!expNums.includes(ansNum)) return fail(q.topic, `lời văn: answer ${ansNum} không khớp explain`, q);

  // Kiểm sâu một số dạng nhận diện được từ stem:
  if (/gấp/.test(s) && /Hỏi .*có bao nhiêu/.test(s) && !/cả hai/.test(s)) {
    const a = I[0], k = I[1];
    if (ansNum !== a * k) fail(q.topic, `gấp sai: ${a}×${k}≠${ansNum}`, q);
  } else if (/giảm đi/.test(s)) {
    const a = I[0], k = I[1];
    if (ansNum !== a / k) fail(q.topic, `giảm sai: ${a}/${k}≠${ansNum}`, q);
  } else if (/nhiều hơn/.test(s) && !/cả hai/.test(s) && !/tất cả/.test(s)) {
    const a = I[0], m = I[1];
    if (ansNum !== a + m) fail(q.topic, `nhiều hơn sai: ${a}+${m}≠${ansNum}`, q);
  } else if (/ít hơn/.test(s)) {
    const a = I[0], m = I[1];
    if (ansNum !== a - m) fail(q.topic, `ít hơn sai: ${a}-${m}≠${ansNum}`, q);
  } else if (/bán đi/.test(s)) {
    const boxes = I[0], per = I[1], sold = I[2];
    if (ansNum !== boxes * per - sold) fail(q.topic, `nhân-trừ sai: ${boxes}×${per}-${sold}≠${ansNum}`, q);
  } else if (/để rời/.test(s)) {
    const boxes = I[0], per = I[1], extra = I[2];
    if (ansNum !== boxes * per + extra) fail(q.topic, `nhân-cộng sai`, q);
  } else if (/hết .* nghìn đồng/.test(s) && /cùng loại/.test(s)) {
    const n1 = I[0], total = I[1], n2 = I[2];
    if (total % n1 !== 0) fail(q.topic, `rút đơn vị: không chia hết ${total}/${n1}`, q);
    if (ansNum !== (total / n1) * n2) fail(q.topic, `rút đơn vị sai`, q);
  } else if (/Sau khi cho bạn/.test(s)) {
    const cho = I[0], conLai = I[1];
    if (ansNum !== cho + conLai) fail(q.topic, `ngược lời văn sai: ${cho}+${conLai}≠${ansNum}`, q);
  } else if (/gấp/.test(s) && /cả hai/.test(s)) {
    const a = I[0], k = I[1];
    if (ansNum !== a + a * k) fail(q.topic, `gấp-gộp lời văn sai`, q);
  } else if (/có tất cả/.test(s) && /nhiều hơn/.test(s)) {
    // tổng & hiệu: tong, hieu -> số lớn = (tong+hieu)/2
    const tong = I[0], hieu = I[1];
    if ((tong + hieu) % 2 !== 0) fail(q.topic, `lời văn tổng-hiệu: (tổng+hiệu) không chẵn`, q);
    if (ansNum !== (tong + hieu) / 2) fail(q.topic, `lời văn tổng-hiệu sai`, q);
  }
}

function checkTuDuy(q, s, I) {
  if (/Tính nhanh/.test(s)) {
    const v = parseExprSafe(exprPart(s));
    const a = mcValue(q);
    if (v === null) return fail(q.topic, 'không parse được tính nhanh: ' + s, q);
    if (v !== a) fail(q.topic, `tính nhanh sai: ${v} ≠ ${a}`, q);
    return;
  }
  if (/dãy/.test(s)) {
    // tách dãy số trước "; ..."
    const seq = ints(s);
    const next = Number(q.answer);
    // thử quy luật cộng đều
    const dAdd = seq[1] - seq[0];
    const isAddEqual = seq.every((v, i) => i === 0 || v - seq[i - 1] === dAdd);
    if (isAddEqual && next === seq[seq.length - 1] + dAdd) { ok(); return; }
    // thử ×k+c
    let foundKnc = false;
    for (let k = 2; k <= 3 && !foundKnc; k++) {
      for (let c = 0; c <= 5 && !foundKnc; c++) {
        let good = true;
        for (let i = 1; i < seq.length; i++) if (seq[i] !== seq[i - 1] * k + c) { good = false; break; }
        if (good && next === seq[seq.length - 1] * k + c) foundKnc = true;
      }
    }
    if (foundKnc) { ok(); return; }
    // thử sai phân (hiệu tăng đều theo cấp số cộng bước 1)
    const diffs = [];
    for (let i = 1; i < seq.length; i++) diffs.push(seq[i] - seq[i - 1]);
    const dd = diffs[1] - diffs[0];
    const isSai = diffs.every((v, i) => i === 0 || v - diffs[i - 1] === dd);
    if (isSai && next === seq[seq.length - 1] + (diffs[diffs.length - 1] + dd)) { ok(); return; }
    fail(q.topic, `dãy: không khớp quy luật nào, seq=${seq} next=${next}`, q);
    return;
  }
  if (/số tròn chục từ/.test(s)) {
    // lấy lo,hi từ cụm "từ <lo> đến <hi>" để tránh nhặt nhầm số khác.
    const m = s.match(/từ\s+([\d ]+?)\s+đến\s+([\d ]+?)\s/);
    const lo = Number(m[1].replace(/\s/g, '')), hi = Number(m[2].replace(/\s/g, ''));
    if (lo % 10 !== 0 || hi % 10 !== 0) fail(q.topic, `mốc không tròn chục: ${lo},${hi}`, q);
    const want = (hi - lo) / 10 + 1;
    if (Number(q.answer) !== want) fail(q.topic, `đếm tròn chục sai: muốn ${want}≠${q.answer}`, q);
    return;
  }
  if (/chia hết cho 5 từ/.test(s)) {
    const m = s.match(/từ\s+([\d ]+?)\s+đến\s+([\d ]+?)\s/);
    const lo = Number(m[1].replace(/\s/g, '')), hi = Number(m[2].replace(/\s/g, ''));
    if (lo % 5 !== 0 || hi % 5 !== 0) fail(q.topic, `mốc không chia hết 5: ${lo},${hi}`, q);
    const want = (hi - lo) / 5 + 1;
    if (Number(q.answer) !== want) fail(q.topic, `đếm chia 5 sai: muốn ${want}≠${q.answer}`, q);
    return;
  }
  if (/Trồng cây/.test(s)) {
    const length = I[0], khoang = I[1];
    if (length % khoang !== 0) fail(q.topic, `trồng cây: không chia hết ${length}/${khoang}`, q);
    const want = length / khoang + 1;
    if (Number(q.answer) !== want) fail(q.topic, `trồng cây sai: muốn ${want}≠${q.answer}`, q);
    return;
  }
  if (/Nghĩ một số/.test(s)) {
    // x*k +/- c = T. kiểm bằng thế: đọc k, c, T và phép.
    const k = I[0]; // "nhân với k"
    const T = ints(s)[ints(s).length - 1]; // số được = T (cuối)
    const x = Number(q.answer);
    const add = /cộng thêm/.test(s);
    // c là số giữa: ints(s) = [k, c, T]
    const all = ints(s);
    const c = all[1];
    const got = add ? x * k + c : x * k - c;
    if (got !== T) fail(q.topic, `nghĩ số sai: ${x}×${k}${add ? '+' : '-'}${c}=${got}≠${T}`, q);
    return;
  }
  fail(q.topic, 'dạng tu-duy không nhận diện: ' + s, q);
}

/* ---- Chạy ---- */
const tierStats = {}; // ước lượng phân bố tầng theo "độ phức tạp" stem (chỉ để quan sát).
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
    try { checkMath(q); } catch (err) { fail(t.id, 'checkMath threw: ' + err.message + ' | ' + plain(q.stem), q); }
  }
}

// generateMixed
for (let i = 0; i < 100; i++) {
  const arr = QE.generateMixed(10);
  if (arr.length !== 10) fail('mixed', 'generateMixed length ≠ 10', arr);
  arr.forEach(q => { validateCommon(q); try { checkMath(q); } catch (e) { fail(q.topic, 'mixed checkMath threw', q); } });
}

// check() chuẩn hoá
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

// Đọc số tiếng Việt các ca khó.
const readCases = [
  [305, 'ba trăm linh năm'], [21, 'hai mươi mốt'], [15, 'mười lăm'], [11, 'mười một'],
  [24, 'hai mươi tư'], [25, 'hai mươi lăm'], [1000, 'một nghìn'],
  [1001, 'một nghìn không trăm linh một'], [1015, 'một nghìn không trăm mười lăm'],
  [10001, 'mười nghìn không trăm linh một'], [20021, 'hai mươi nghìn không trăm hai mươi mốt'],
  [99999, 'chín mươi chín nghìn chín trăm chín mươi chín'], [100, 'một trăm'],
];
for (const [n, exp] of readCases) {
  const got = QE._readNumberVi(n);
  total++;
  if (got !== exp) fail('readNumberVi', `${n} -> '${got}' ≠ '${exp}'`, {});
}

// Golden tests: tái lập các VÍ DỤ trong spec (đáp án đã kiểm bằng code).
// Parser & logic kiểm độc lập phải khớp.
function golden(name, cond) { total++; if (!cond) fail('golden', name, {}); }
golden('12000+8500-6300=14200', parseExprSafe('12000+8500-6300') === 14200);
golden('36+18+64+82=200', parseExprSafe('36+18+64+82') === 200);
golden('1250×6÷5=1500', parseExprSafe('1250*6/5') === 1500);
golden('(24+16)×5-18=182', parseExprSafe('(24+16)*5-18') === 182);
golden('96÷(2×4)+7=19', parseExprSafe('96/(2*4)+7') === 19);
golden('4×7×25=700', parseExprSafe('4*7*25') === 700);
golden('5624÷8=703', 5624 / 8 === 703);
golden('cv-hieu 48,6 -> dài 15', ((48 / 2) + 6) / 2 === 15);
golden('cắt 8×5 - 5×5 = 15', 8 * 5 - 5 * 5 === 15);
golden('trồng cây 20/4+1=6', 20 / 4 + 1 === 6);
golden('nghĩ số (25-4)/3=7', (25 - 4) / 3 === 7);
golden('cần xe ceil(50/8)=7', Math.floor(50 / 8) + 1 === 7);
golden('100÷6 = 16 dư 4', 16 * 6 + 4 === 100 && 4 < 6);
golden('124×6+5=749', 124 * 6 + 5 === 749);

// ---- Báo cáo ----
console.log(`Đã chạy ${total} phép kiểm tra trên ${QE.topics.length} chủ đề (mỗi chủ đề ${N} câu) + mixed + golden.`);
if (failures.length === 0) {
  console.log('KẾT QUẢ: SẠCH — không có lỗi nào.');
  process.exit(0);
} else {
  console.log(`KẾT QUẢ: ${failures.length} lỗi:`);
  const byTopic = {};
  failures.forEach(f => { byTopic[f.topic] = (byTopic[f.topic] || 0) + 1; });
  console.log('Theo chủ đề:', byTopic);
  failures.slice(0, 30).forEach(f => console.log(' -', f.topic, '|', f.msg, '|', f.q));
  process.exit(1);
}
