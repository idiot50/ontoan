/*
 * engine.spec.mjs — TEST ĐỘNG CƠ lớp 1 (quan trọng nhất).
 * Với mỗi chủ đề: sinh ~300 câu, TỰ TÍNH LẠI ĐỘC LẬP từ stem (không tin explain),
 * kiểm tính đúng toán học + ràng buộc shape/giới hạn + trường `say` bắt buộc.
 *
 * Phạm vi lớp 1: mọi số <= 100 (giờ hệ 24h cho phép tới 24). Không nhân/chia.
 * Xuất hàm run() trả về reporter.state để run.mjs tổng hợp.
 */
import { QE, makeReporter, plain, ints, evalExpr, refReadNumberVi } from './_harness.mjs';

const PER_TOPIC = 300;
const MAX = 100;

const WEEKDAYS = ['thứ Hai', 'thứ Ba', 'thứ Tư', 'thứ Năm', 'thứ Sáu', 'thứ Bảy', 'Chủ nhật'];

function normSpace(s) { return String(s).replace(/\s+/g, ' ').trim().toLowerCase(); }

/* =====================================================================
 *  RÀNG BUỘC SHAPE CHUNG (áp cho mọi câu, mọi chủ đề)
 * =================================================================== */
function checkShape(R, q, topicId) {
  R.ok(q && typeof q === 'object', 'câu hỏi là object', q);
  if (!q) return false;
  R.eq(q.topic, topicId, 'topic khớp chủ đề', q);
  R.ok(q.type === 'mc' || q.type === 'input', 'type hợp lệ (mc/input)', q);
  R.ok(typeof q.stem === 'string' && q.stem.length > 0, 'stem là chuỗi không rỗng', q);
  R.ok(typeof q.explain === 'string' && q.explain.length > 0, 'explain không rỗng', q);

  // SAY: BẮT BUỘC mọi câu — không rỗng & KHÔNG chứa thẻ HTML.
  R.ok(typeof q.say === 'string' && q.say.trim().length > 0, 'say là chuỗi không rỗng', q);
  R.ok(typeof q.say === 'string' && !/<[^>]+>/.test(q.say), 'say không chứa thẻ HTML', q);

  if (q.type === 'mc') {
    R.ok(Array.isArray(q.choices) && q.choices.length >= 2, 'mc có >=2 choices', q);
    R.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length,
      'mc answer là index hợp lệ', q);
    // choices không trùng nhau
    const seen = new Set();
    let dup = false;
    q.choices.forEach(c => { if (seen.has(String(c))) dup = true; seen.add(String(c)); });
    R.ok(!dup, 'choices không trùng', q);
    // check() phải đồng ý với answer index, và bác mọi index khác
    R.ok(QE.check(q, q.answer) === true, 'check() chấp nhận đúng answer index', q);
    for (let i = 0; i < q.choices.length; i++) {
      if (i !== q.answer) R.ok(QE.check(q, i) === false, 'check() bác index sai ' + i, q);
    }
  } else {
    R.ok(q.answer !== undefined && q.answer !== null && String(q.answer).length > 0,
      'input có answer', q);
    R.ok(QE.check(q, q.answer) === true, 'check() chấp nhận answer chuẩn', q);
  }
  return true;
}

// Kiểm mọi số trong stem & đáp án nằm trong tầm lớp 1.
function checkRange(R, q) {
  const stem = plain(q.stem);
  const nums = ints(stem).concat(q.type === 'input' ? ints(String(q.answer)) : ints(plain(q.choices[q.answer])));
  // Ngoại lệ: giờ hệ 24h có thể tới 24.
  const limit = /giờ/.test(stem) ? 24 : MAX;
  nums.forEach(v => {
    R.ok(v >= 0, 'không có số âm trong đề/đáp án (' + v + ')', q);
    R.ok(v <= limit, 'số trong tầm lớp 1 (' + v + ' <= ' + limit + ')', q);
  });
}

// MC: giá trị tại answer index khớp tính lại độc lập.
function expectMcValue(R, q, expectedStr, label) {
  const ans = plain(q.choices[q.answer]);
  R.eq(normSpace(ans), normSpace(expectedStr),
    label + ': giá trị tại answer index khớp tính lại độc lập', q);
}

// explain chứa kết quả cuối.
function explainHasResult(R, q, resultNum, label) {
  const flat = plain(q.explain).replace(/\s+/g, '');
  R.ok(flat.indexOf(String(resultNum)) !== -1, label + ': explain chứa kết quả ' + resultNum, q);
}

// Lấy số nguyên của đáp án (mc: choice tại index; input: answer).
function ansNum(q) {
  if (q.type === 'mc') {
    const n = Number(plain(q.choices[q.answer]).replace(/[^\d-]/g, ''));
    return Number.isNaN(n) ? null : n;
  }
  const n = Number(q.answer);
  return Number.isNaN(n) ? null : n;
}

/* =====================================================================
 *  1) SỐ ĐẾN 100
 * =================================================================== */
function topicSo(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('so-100');
    if (!checkShape(R, q, 'so-100')) continue;
    checkRange(R, q);
    R.record(plain(q.stem) + ' :: ' + (q.type === 'mc' ? plain(q.choices[q.answer]) : q.answer));
    const s = plain(q.stem);
    const I = ints(s);

    if (/gồm mấy chục/.test(s)) {
      const num = I[0];
      const want = Math.floor(num / 10) + ' chục ' + (num % 10) + ' đơn vị';
      expectMcValue(R, q, want, 'cấu tạo');
    } else if (/gồm/.test(s) && /chục/.test(s) && q.type === 'input') {
      const mm = s.match(/(\d+)\s*chục\s*(\d+)\s*đơn vị/);
      R.ok(!!mm, 'cấu tạo ngược: tách được chục/đơn vị', q);
      if (mm) {
        const want = (+mm[1]) * 10 + (+mm[2]);
        R.eq(Number(q.answer), want, 'cấu tạo ngược đúng', q);
      }
    } else if (/dấu thích hợp/.test(s)) {
      const a = I[0], b = I[1];
      const expected = a > b ? '>' : (a < b ? '<' : '=');
      expectMcValue(R, q, expected, 'so sánh');
    } else if (/liền trước/.test(s)) {
      R.eq(Number(q.answer), I[0] - 1, 'liền trước = N-1', q);
      R.ok(I[0] - 1 >= 0, 'liền trước không âm', q);
    } else if (/liền sau/.test(s)) {
      R.eq(Number(q.answer), I[0] + 1, 'liền sau = N+1', q);
      R.ok(I[0] + 1 <= MAX, 'liền sau <= 100', q);
    } else if (/tròn chục/.test(s)) {
      const num = I[0];
      const want = Math.floor(num / 10) * 10;
      const got = ansNum(q);
      R.eq(got, want, 'tròn chục lớn nhất bé hơn N', q);
      R.ok(got < num, 'tròn chục bé hơn N', q);
      R.ok(got % 10 === 0, 'là số tròn chục', q);
    } else if (/lớn nhất|bé nhất/.test(s) && /trong các số/.test(s)) {
      const wantMax = /lớn nhất/.test(s);
      const want = wantMax ? Math.max(...I) : Math.min(...I);
      expectMcValue(R, q, String(want), 'maxmin');
    } else if (/Sắp xếp/.test(s)) {
      const asc = /bé đến lớn/.test(s);
      const listSeg = s.replace(/.*:\s*/, '');
      const given = ints(listSeg);
      R.ok(given.length >= 3, 'sắp xếp: có danh sách', q);
      const sorted = given.slice().sort((p, qq) => asc ? p - qq : qq - p);
      R.eq(String(q.answer), sorted.join(';'), 'sắp xếp đúng thứ tự', q);
    } else if (/hai chữ số/.test(s)) {
      const want = /lớn nhất/.test(s) ? 99 : 10;
      R.eq(Number(q.answer), want, 'số hai chữ số lớn/bé nhất', q);
    } else if (/Viết các số lớn hơn/.test(s)) {
      const a = I[0], b = I[1];
      const want = [];
      for (let v = a + 1; v < b; v++) want.push(v);
      R.ok(want.length >= 1 && want.length <= 5, 'liệt kê: 1..5 số (count=' + want.length + ')', q);
      R.eq(String(q.answer), want.join(';'), 'liệt kê đúng dãy', q);
    } else if (/Có mấy số lớn hơn/.test(s)) {
      const lo = I[0], hi = I[1];
      const c = Math.max(0, hi - lo - 1);
      R.eq(Number(q.answer), c, 'đếm khoảng mở đúng', q);
      R.ok(c <= 5, 'đếm khoảng: count <= 5 (' + c + ')', q);
    } else {
      R.ok(false, 'so-100: dạng câu không nhận diện: ' + s, q);
    }
  }
}

/* =====================================================================
 *  2) CỘNG  /  3) TRỪ
 * =================================================================== */
function topicCong(R) { addSub(R, 'cong', '+'); }
function topicTru(R) { addSub(R, 'tru', '-'); }

function addSub(R, topicId, opSign) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate(topicId);
    if (!checkShape(R, q, topicId)) continue;
    checkRange(R, q);
    R.record(plain(q.stem) + ' :: ' + (q.type === 'mc' ? plain(q.choices[q.answer]) : q.answer));
    const s = plain(q.stem);
    const m = s.match(/(\d+)\s*([+−-])\s*(\d+)/);
    R.ok(!!m, topicId + ': parse được phép tính', q);
    if (!m) continue;
    const a = +m[1], op = m[2], b = +m[3];
    R.eq(op === '+' ? '+' : '-', opSign, topicId + ': đúng phép toán', q);
    const expected = op === '+' ? a + b : a - b;
    R.ok(expected >= 0, topicId + ': kết quả không âm (' + expected + ')', q);
    R.ok(expected <= MAX, topicId + ': kết quả <= 100 (' + expected + ')', q);
    const got = ansNum(q);
    R.eq(got, expected, topicId + ': kết quả đúng', q);
    explainHasResult(R, q, expected, topicId);
  }
}

/* =====================================================================
 *  4) TÍNH DÃY & ĐIỀN SỐ
 * =================================================================== */
function topicTinhDay(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('tinh-day');
    if (!checkShape(R, q, 'tinh-day')) continue;
    checkRange(R, q);
    R.record(plain(q.stem) + ' :: ' + (q.type === 'mc' ? plain(q.choices[q.answer]) : q.answer));
    const s = plain(q.stem);

    if (/Tính:/.test(s) && q.type === 'input') {
      // Dãy 3 số: lấy biểu thức giữa "Tính:" và "="
      const expr = s.replace(/.*Tính:\s*/, '').replace(/=.*/, '');
      const v = evalExpr(expr);
      R.ok(v !== null, 'dãy: parse được biểu thức', q);
      if (v !== null) {
        R.ok(v >= 0 && v <= MAX, 'dãy: kết quả trong [0,100] (' + v + ')', q);
        R.eq(Number(q.answer), v, 'dãy: kết quả đúng (tính trái sang phải)', q);
        explainHasResult(R, q, v, 'dãy');
      }
    } else if (/ô trống/.test(s)) {
      // Điền số: thay ? bằng answer rồi kiểm đẳng thức 2 vế.
      const eqRaw = s.replace(/.*ô trống:\s*/, '').replace(/\(gõ số\).*/, '').trim();
      const filled = eqRaw.replace('?', '(' + q.answer + ')');
      const parts = filled.split('=');
      R.ok(parts.length === 2, 'điền số: có dạng vế = vế', q);
      if (parts.length === 2) {
        const lv = evalExpr(parts[0]);
        const rv = evalExpr(parts[1]);
        R.ok(lv !== null && rv !== null, 'điền số: parse được 2 vế', q);
        if (lv !== null && rv !== null) R.eq(lv, rv, 'điền số: thay nghiệm thoả đẳng thức', q);
        R.ok(Number(q.answer) >= 0 && Number(q.answer) <= MAX, 'điền số: nghiệm trong [0,100]', q);
      }
    } else if (/dấu thích hợp/.test(s)) {
      // So sánh hai phép tính: left ___ right
      const body = s.replace(/.*dấu thích hợp:\s*/, '').trim();
      const seg = body.split('___');
      R.ok(seg.length === 2, 'so sánh phép tính: tách được 2 vế', q);
      if (seg.length === 2) {
        const lv = evalExpr(seg[0]);
        const rv = evalExpr(seg[1]);
        R.ok(lv !== null && rv !== null, 'so sánh phép tính: parse được 2 vế', q);
        if (lv !== null && rv !== null) {
          const expected = lv > rv ? '>' : (lv < rv ? '<' : '=');
          expectMcValue(R, q, expected, 'so sánh phép tính');
        }
      }
    } else {
      R.ok(false, 'tinh-day: dạng câu không nhận diện: ' + s, q);
    }
  }
}

/* =====================================================================
 *  5) ĐO ĐỘ DÀI (cm)
 * =================================================================== */
function topicDoDai(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('do-dai');
    if (!checkShape(R, q, 'do-dai')) continue;
    checkRange(R, q);
    R.record(plain(q.stem) + ' :: ' + (q.type === 'mc' ? plain(q.choices[q.answer]) : q.answer));
    const s = plain(q.stem);
    const I = ints(s);
    const got = ansNum(q);
    R.ok(got !== null, 'độ dài: lấy được số đáp án', q);
    if (got === null) continue;

    if (/hơn kém nhau mấy cm/.test(s)) {
      const want = Math.abs(I[0] - I[1]);
      R.eq(got, want, 'so sánh độ dài: |a-b|', q);
    } else if (/Nối hai đoạn/.test(s)) {
      R.eq(got, I[0] + I[1], 'nối dây: a+b', q);
    } else if (/dài hơn đoạn thứ hai/.test(s)) {
      R.eq(got, I[0] - I[1], 'trừ độ dài: a-b', q);
    } else if (/cắt đi/.test(s)) {
      R.eq(got, I[0] - I[1], 'cắt dây: a-b', q);
    } else {
      R.ok(false, 'do-dai: dạng câu không nhận diện: ' + s, q);
    }
    R.ok(got >= 0 && got <= MAX, 'độ dài: kết quả trong [0,100] (' + got + ')', q);
  }
}

/* =====================================================================
 *  6) XEM GIỜ & TUẦN LỄ
 * =================================================================== */
const BUOI_MAP = {
  7: 'buổi sáng', 8: 'buổi sáng', 9: 'buổi sáng',
  11: 'buổi trưa', 12: 'buổi trưa',
  14: 'buổi chiều', 15: 'buổi chiều', 16: 'buổi chiều', 17: 'buổi chiều',
  19: 'buổi tối', 20: 'buổi tối', 21: 'buổi tối'
};
const DOI_OK = { 13: 1, 14: 2, 18: 6 };

function topicGioTuan(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('gio-tuan');
    if (!checkShape(R, q, 'gio-tuan')) continue;
    checkRange(R, q);
    R.record(plain(q.stem) + ' :: ' + (q.type === 'mc' ? plain(q.choices[q.answer]) : q.answer));
    const s = plain(q.stem);
    const I = ints(s);
    const got = ansNum(q);

    if (/kim ngắn/.test(s)) {
      const h = I[0];
      R.ok(h >= 1 && h <= 12, 'kim ngắn: giờ 1..12', q);
      R.eq(got, h, 'kim ngắn chỉ vào số giờ', q);
    } else if (/kim dài/.test(s)) {
      R.eq(got, 12, 'kim dài lúc giờ đúng = 12', q);
    } else if (/buổi nào trong ngày/.test(s)) {
      const h = I[0];
      const want = BUOI_MAP[h];
      R.ok(!!want, 'nhận biết buổi: giờ ' + h + ' thuộc mốc quen', q);
      if (want) expectMcValue(R, q, want, 'nhận biết buổi');
    } else if (/là mấy giờ chiều/.test(s)) {
      const h = I[0];
      R.ok(h in DOI_OK, 'đổi giờ 24h: dùng mốc quen (' + h + ')', q);
      if (h in DOI_OK) R.eq(got, DOI_OK[h], 'đổi giờ 24h đúng', q);
      // bắt buộc có gợi ý "12 giờ trưa" trong đề
      R.ok(/12 giờ trưa/.test(s), 'đổi giờ 24h: có gợi ý "12 giờ trưa"', q);
      R.ok(got >= 1 && got <= 12, 'đổi giờ 24h: kết quả 1..12', q);
    } else if (/học xong lúc mấy giờ/.test(s)) {
      const start = I[0], dur = I[1];
      R.eq(got, start + dur, 'khoảng giờ: start+dur', q);
      R.ok(dur <= 4, 'khoảng giờ: thời lượng <= 4 (' + dur + ')', q);
      R.ok(start + dur <= 12, 'khoảng giờ: kết thúc <= 12 (' + (start + dur) + ')', q);
    } else if (/ngày mai là thứ mấy/.test(s)) {
      verifyWeekday(R, q, s, 1);
    } else if (/ngày sau/.test(s)) {
      R.ok(I[0] <= 3, 'thu-sau: số ngày <= 3 (' + I[0] + ')', q);
      verifyWeekday(R, q, s, I[0]);
    } else {
      R.ok(false, 'gio-tuan: dạng câu không nhận diện: ' + s, q);
    }
  }
}

function verifyWeekday(R, q, s, addDays) {
  let baseIdx = -1;
  for (let i = 0; i < WEEKDAYS.length; i++) {
    if (s.indexOf(WEEKDAYS[i]) !== -1) { baseIdx = i; break; }
  }
  R.ok(baseIdx !== -1, 'thứ: tìm được thứ gốc trong đề', q);
  if (baseIdx === -1) return;
  const wantIdx = (baseIdx + addDays) % 7;
  expectMcValue(R, q, WEEKDAYS[wantIdx], 'thứ trong tuần (xoay vòng)');
}

/* =====================================================================
 *  7) TOÁN CÓ LỜI VĂN (một bước)
 * =================================================================== */
function topicLoiVan(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('loi-van');
    if (!checkShape(R, q, 'loi-van')) continue;
    checkRange(R, q);
    R.eq(q.type, 'input', 'lời văn: dạng input', q);
    R.record(plain(q.stem) + ' :: ' + q.answer);
    const s = plain(q.stem);
    const I = ints(s);
    const got = Number(q.answer);
    R.ok(Number.isInteger(got) && got >= 0 && got <= MAX, 'lời văn: đáp số tự nhiên trong [0,100]', q);
    explainHasResult(R, q, got, 'lời văn');

    if (/tặng thêm/.test(s)) {
      R.eq(got, I[0] + I[1], 'thêm: a+b', q);
    } else if (/cho bạn/.test(s)) {
      R.eq(got, I[0] - I[1], 'bớt: a-b', q);
    } else if (/nhiều hơn/.test(s)) {
      R.eq(got, I[0] + I[1], 'nhiều hơn: a+m', q);
    } else if (/ít hơn/.test(s)) {
      R.eq(got, I[0] - I[1], 'ít hơn: a-m', q);
    } else if (/cả hai bạn có tất cả/.test(s)) {
      R.eq(got, I[0] + I[1], 'gộp: a+b', q);
    } else if (/màu xanh/.test(s)) {
      R.eq(got, I[0] - I[1], 'tách: tổng - phần', q);
    } else {
      R.ok(false, 'loi-van: dạng câu không nhận diện: ' + s, q);
    }
  }
}

/* =====================================================================
 *  8) PHÁT TRIỂN TƯ DUY
 * =================================================================== */
function topicTuDuy(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('tu-duy');
    if (!checkShape(R, q, 'tu-duy')) continue;
    checkRange(R, q);
    R.record(plain(q.stem) + ' :: ' + (q.type === 'mc' ? plain(q.choices[q.answer]) : q.answer));
    const s = plain(q.stem);
    const I = ints(s);

    if (/dãy/.test(s)) {
      const seq = ints(s.replace(/.*:\s*/, ''));
      R.ok(seq.length >= 4, 'dãy quy luật: có >=4 số', q);
      if (seq.length >= 4) {
        const d = seq[1] - seq[0];
        const isArith = seq.every((v, i) => i === 0 || v - seq[i - 1] === d);
        R.ok(isArith, 'dãy quy luật: cộng/trừ đều', q);
        const expected = seq[seq.length - 1] + d;
        R.eq(Number(q.answer), expected, 'dãy quy luật: số tiếp theo đúng', q);
        R.ok(expected >= 0 && expected <= MAX, 'dãy quy luật: số tiếp trong [0,100]', q);
      }
    } else if (/lập số có hai chữ số/.test(s)) {
      const cardLine = s.match(/thẻ chữ số ([\d, ]+)/);
      R.ok(!!cardLine, 'lập số: tách được các thẻ chữ số', q);
      if (cardLine) {
        const digits = cardLine[1].split(/[,\s]+/).filter(x => x.length).map(Number);
        const wantMax = /lớn nhất/.test(s);
        let want;
        if (wantMax) {
          const d = digits.slice().sort((a, b) => b - a);
          want = d[0] * 10 + d[1];
        } else {
          const asc = digits.slice().sort((a, b) => a - b);
          const tens = asc.find(x => x !== 0);
          const rest = digits.slice();
          rest.splice(rest.indexOf(tens), 1);
          const units = rest.sort((a, b) => a - b)[0];
          want = tens * 10 + units;
        }
        R.eq(Number(q.answer), want, 'lập số hai chữ số đúng', q);
        R.ok(String(want)[0] !== '0', 'lập số: 0 không đứng đầu', q);
        // lapso-max chứa 0: số lớn nhất phải KHÁC số bé nhất (đáp án có ý nghĩa).
        if (wantMax && digits.indexOf(0) !== -1) {
          const desc = digits.slice().sort((a, b) => b - a);
          const asc2 = digits.slice().sort((a, b) => a - b);
          const tens2 = asc2.find(x => x !== 0);
          const maxNum = desc[0] * 10 + desc[1];
          const rest2 = digits.slice();
          rest2.splice(rest2.indexOf(tens2), 1);
          const minNum = tens2 * 10 + rest2.sort((a, b) => a - b)[0];
          R.ok(maxNum !== minNum, 'lập số lớn nhất chứa 0: max ≠ min', q);
        }
      }
    } else if (/cộng với/.test(s)) {
      const a = I[0], res = I[1];
      R.eq(Number(q.answer) + a, res, 'tìm số: x+a=res', q);
    } else if (/trừ đi/.test(s)) {
      const a = I[0], res = I[1];
      R.eq(Number(q.answer) - a, res, 'tìm số: x-a=res', q);
    } else {
      R.ok(false, 'tu-duy: dạng câu không nhận diện: ' + s, q);
    }
  }
}

/* =====================================================================
 *  generateMixed + generate id sai + reader engine đối chứng
 * =================================================================== */
function topicMixed(R) {
  const arr = QE.generateMixed(10);
  R.eq(arr.length, 10, 'generateMixed(10) trả 10 câu', null);
  arr.forEach(q => {
    R.ok(q && (q.type === 'mc' || q.type === 'input'), 'mixed: mỗi câu hợp lệ type', q);
    R.ok(typeof q.topic === 'string', 'mixed: có topic', q);
    R.ok(typeof q.say === 'string' && q.say.trim().length > 0, 'mixed: mỗi câu có say', q);
  });
  R.eq(QE.generateMixed().length, 10, 'generateMixed() mặc định 10 câu', null);

  let threw = false;
  try { QE.generate('khong-ton-tai'); } catch (e) { threw = true; }
  R.ok(threw, 'generate(id sai) ném lỗi', null);

  R.eq(QE.topics.length, 8, 'engine có đúng 8 chủ đề', null);
}

function topicReader(R) {
  // Đối chứng engine._readNumberVi với bản tham chiếu độc lập, 0..100.
  if (typeof QE._readNumberVi !== 'function') {
    R.ok(false, 'engine có _readNumberVi để đối chứng', null);
    return;
  }
  for (let n = 0; n <= 100; n++) {
    R.eq(normSpace(QE._readNumberVi(n)), normSpace(refReadNumberVi(n)),
      'đọc số tiếng Việt n=' + n, null);
  }
  // các ca khó cụ thể (kiểm thêm tường minh)
  const hard = [
    [11, 'mười một'], [14, 'mười bốn'], [15, 'mười lăm'],
    [21, 'hai mươi mốt'], [24, 'hai mươi tư'], [25, 'hai mươi lăm'],
    [44, 'bốn mươi tư'], [55, 'năm mươi lăm'], [71, 'bảy mươi mốt'], [100, 'một trăm']
  ];
  hard.forEach(([num, exp]) => {
    R.eq(normSpace(QE._readNumberVi(num)), normSpace(exp), 'reader ca khó n=' + num, null);
  });
}

/* ============================== RUN ============================== */
export function run() {
  const R = makeReporter('ENGINE');
  topicSo(R);
  topicCong(R);
  topicTru(R);
  topicTinhDay(R);
  topicDoDai(R);
  topicGioTuan(R);
  topicLoiVan(R);
  topicTuDuy(R);
  topicMixed(R);
  topicReader(R);
  return R.state;
}

import { fileURLToPath } from 'url';
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const s = run();
  console.log(`[${s.group}] checks=${s.checks} fails=${s.fails.length}`);
  s.fails.slice(0, 25).forEach(f => console.log('  FAIL:', f.msg, '\n    ctx:', f.ctx));
  process.exit(s.fails.length ? 1 : 0);
}
