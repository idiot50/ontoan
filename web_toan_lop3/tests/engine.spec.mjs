/*
 * engine.spec.mjs — TEST ĐỘNG CƠ LỚP 3 (quan trọng nhất). ĐÃ CẬP NHẬT cho engine
 * NÂNG ĐỘ KHÓ (NANG_DO_KHO_spec.md): chuỗi 3 số, biểu thức 3 phép có ngoặc,
 * tìm x 2 bước, dãy ×k+c / sai phân, suy luận ngược, đếm điều kiện, trồng cây,
 * lập số nhiều thẻ, đo lường nhiều bước, hình học bài ngược/cắt hình…
 *
 * NGUYÊN TẮC: TỰ TÍNH LẠI ĐÁP ÁN ĐỘC LẬP từ STEM (parser/arithmetic riêng),
 * KHÔNG tin q.answer / q.explain để "rubber-stamp". Với dạng không tính lại được
 * từ stem (lời văn ngữ cảnh phức) thì kiểm CẤU TRÚC + RÀNG BUỘC TẦM LỚP và nêu rõ.
 *
 * Xuất hàm run() trả về reporter.state để run.mjs tổng hợp.
 */
import {
  QE, makeReporter, plain, unGroup, ints, evalExpr, refReadNumberVi
} from './_harness.mjs';

const PER_TOPIC = 400;
const MAX = 100000;

/* ----------------------------- HÀM PHỤ ----------------------------- */
function intsOf(s) { return ints(s); }
function normSpace(s) { return String(s).replace(/\s+/g, ' ').trim().toLowerCase(); }
function capFirst(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function stripDiacriticsKeep(s) { return s; }

// Số nguyên đầu tiên (đã gỡ phân nhóm) trong một đoạn chuỗi.
function firstInt(s) { const a = ints(s); return a.length ? a[0] : null; }

/* =====================================================================
 *  KIỂM RÀNG BUỘC SHAPE CHUNG (áp cho mọi câu)
 * =================================================================== */
function checkShape(R, q, topicId) {
  R.ok(q && typeof q === 'object', 'câu hỏi là object', q);
  if (!q) return false;
  R.eq(q.topic, topicId, 'topic khớp chủ đề', q);
  R.ok(q.type === 'mc' || q.type === 'input', 'type hợp lệ (mc/input)', q);
  R.ok(typeof q.stem === 'string' && q.stem.length > 0, 'stem là chuỗi không rỗng', q);
  R.ok(typeof q.explain === 'string' && q.explain.length > 0, 'explain không rỗng', q);

  if (q.type === 'mc') {
    R.ok(Array.isArray(q.choices) && q.choices.length >= 2, 'mc có >=2 choices', q);
    R.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length,
      'mc answer là index hợp lệ', q);
    const seen = new Set();
    let dup = false;
    q.choices.forEach(c => { if (seen.has(c)) dup = true; seen.add(c); });
    R.ok(!dup, 'choices không trùng', q);
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

// Với MC: kiểm giá trị tại answer index khớp tính lại độc lập.
function expectMcValue(R, q, expectedStr, label) {
  const ans = q.choices[q.answer];
  R.eq(normSpace(ans), normSpace(expectedStr),
    label + ': giá trị tại answer index khớp tính lại độc lập', q);
}

// Kiểm giá trị SỐ (đã gỡ đơn vị/phân nhóm) tại answer index của MC.
function expectMcNum(R, q, expectedNum, label) {
  const got = intsOf(q.choices[q.answer]).join('');
  R.eq(got, String(expectedNum), label + ': số tại answer index khớp tính lại', q);
}

// explain phải chứa kết quả cuối (so trên chuỗi đã gỡ phân nhóm).
function explainHasResult(R, q, resultNum, label) {
  const flat = unGroup(q.explain).replace(/\s+/g, '');
  R.ok(flat.indexOf(String(resultNum)) !== -1,
    label + ': explain chứa kết quả ' + resultNum, q);
}

// Mọi số trong stem & đáp án phải trong tầm lớp 3 (<= 100000, >= 0).
function checkRangeL3(R, q) {
  const stem = plain(q.stem);
  let nums = ints(stem);
  if (q.type === 'input') nums = nums.concat(ints(String(q.answer)));
  else nums = nums.concat(ints(plain(q.choices[q.answer])));
  nums.forEach(v => {
    R.ok(v >= 0, 'không số âm trong đề/đáp án (' + v + ')', q);
    R.ok(v <= MAX, 'số trong tầm lớp 3 (' + v + ' <= 100000)', q);
  });
  // Cấm dấu hiệu vượt tầm lớp 3.
  R.ok(!/[%]/.test(stem), 'không có ký hiệu phần trăm', q);
  R.ok(!/\bphân số\b/.test(stem), 'không nhắc "phân số"', q);
  // số thập phân: dấu phẩy/chấm GIỮA 2 chữ số mà KHÔNG phải phân nhóm nghìn.
  // (phân nhóm nghìn của engine dùng KHOẢNG TRẮNG, nên mọi "x,y"/"x.y" liền là thập phân)
  R.ok(!/\d[.,]\d/.test(stem), 'không có số thập phân (dấu , hoặc . giữa 2 chữ số)', q);
}

/* =====================================================================
 *  1) SỐ ĐẾN 100 000
 * =================================================================== */
function topicSo(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('so-100000');
    if (!checkShape(R, q, 'so-100000')) continue;
    R.record(q.stem + '  ::  ' + (q.type === 'mc' ? q.choices[q.answer] : q.answer));
    checkRangeL3(R, q);
    const stem = plain(q.stem);

    if (/đọc là/.test(stem)) {
      const num = intsOf(q.stem)[0];
      R.ok(num >= 0 && num <= MAX, 'số đọc <= 100000', q);
      const expected = refReadNumberVi(num);
      expectMcValue(R, q, capFirst(expected), 'doc');
      R.eq(normSpace(QE._readNumberVi(num)), normSpace(expected), 'reader engine khớp tham chiếu', q);
    } else if (/Viết số/i.test(stem)) {
      const a = Number(q.answer);
      R.ok(Number.isInteger(a) && a >= 0 && a <= MAX, 'viết số: đáp án trong tầm', q);
      const readPart = stem.replace(/.*:/, '').trim();
      R.eq(normSpace(stripDiacriticsKeep(readPart)), normSpace(capFirst(refReadNumberVi(a))),
        'viết số: cách đọc trong đề khớp đáp án', q);
    } else if (/có giá trị là/.test(stem)) {
      // Giá trị chữ số theo hàng (mc): "Trong số N, chữ số D ở hàng H có giá trị là:"
      const nums = intsOf(stem);
      const N = nums[0];
      const digit = nums[1];
      const hangMap = { 'hàng đơn vị': 0, 'hàng chục': 1, 'hàng trăm': 2, 'hàng nghìn': 3, 'hàng chục nghìn': 4 };
      let pos = null;
      // 'hàng chục nghìn' phải kiểm trước 'hàng chục'/'hàng nghìn'.
      if (stem.indexOf('hàng chục nghìn') !== -1) pos = 4;
      else if (stem.indexOf('hàng nghìn') !== -1) pos = 3;
      else if (stem.indexOf('hàng trăm') !== -1) pos = 2;
      else if (stem.indexOf('hàng chục') !== -1) pos = 1;
      else if (stem.indexOf('hàng đơn vị') !== -1) pos = 0;
      R.ok(pos !== null, 'giá trị: nhận diện được hàng', q);
      if (pos !== null) {
        const s = String(N);
        const realDigit = Number(s[s.length - 1 - pos]);
        R.eq(realDigit, digit, 'giá trị: chữ số nêu đúng vị trí trong số', q);
        const value = realDigit * Math.pow(10, pos);
        expectMcValue(R, q, QE._groupDigits(value), 'giá trị');
        explainHasResult(R, q, value, 'giá trị');
      }
    } else if (/có giá trị/.test(stem) && /ở hàng nào/.test(stem)) {
      // Suy luận ngược (mc): "Trong N, chữ số D có giá trị V. Chữ số đó ở hàng nào?"
      const nums = intsOf(stem);
      const N = nums[0], digit = nums[1], value = nums[2];
      // hàng đúng = log10(value/digit)
      const pos = Math.round(Math.log10(value / digit));
      const hangs = ['hàng đơn vị', 'hàng chục', 'hàng trăm', 'hàng nghìn', 'hàng chục nghìn'];
      R.ok(pos >= 0 && pos <= 4, 'giá trị-ngược: hàng hợp lệ', q);
      // Đáp án đúng phải là tên hàng đúng.
      expectMcValue(R, q, hangs[pos], 'giá trị-ngược');
      // và chữ số digit phải thật sự đứng ở hàng pos trong N.
      const s = String(N);
      R.eq(Number(s[s.length - 1 - pos]), digit, 'giá trị-ngược: chữ số đúng vị trí', q);
    } else if (/Điền dấu/i.test(stem)) {
      const m = stem.match(/([\d .]+)___([\d .]+)/);
      R.ok(!!m, 'so sánh: tách được 2 vế', q);
      if (m) {
        const a = Number(m[1].replace(/[ .]/g, ''));
        const b = Number(m[2].replace(/[ .]/g, ''));
        const expected = a > b ? '>' : (a < b ? '<' : '=');
        expectMcValue(R, q, expected, 'so sánh');
      }
    } else if (/liền (trước|sau)/.test(stem)) {
      const which = /liền sau/.test(stem) ? 1 : 0;
      const base = intsOf(stem)[0];
      const expected = which ? base + 1 : base - 1;
      R.eq(Number(q.answer), expected, 'liền trước/sau đúng', q);
      R.ok(expected >= 0 && expected <= MAX, 'liền trước/sau trong tầm', q);
    } else if (/lớn nhất|bé nhất/.test(stem) && /trong các số/.test(stem)) {
      const wantMax = /lớn nhất/.test(stem);
      const seg = stem.replace(/.*trong các số/, '').replace(/là:?.*/, '');
      const nums = intsOf(seg);
      R.ok(nums.length >= 3, 'maxmin: có danh sách số', q);
      const expected = wantMax ? Math.max(...nums) : Math.min(...nums);
      expectMcValue(R, q, QE._groupDigits(expected), 'maxmin');
    } else if (/Sắp xếp/i.test(stem)) {
      const asc = /từ bé đến lớn/.test(stem);
      const listSeg = stem.replace(/.*:\s*/, '');
      const nums = intsOf(listSeg);
      R.ok(nums.length >= 3, 'sắp xếp: có danh sách', q);
      const sorted = nums.slice().sort((p, qq) => asc ? p - qq : qq - p);
      R.eq(String(q.answer), sorted.join(';'), 'sắp xếp đúng thứ tự', q);
    } else if (/lập số/.test(stem)) {
      // Lập số từ các thẻ (input). Tách các thẻ chữ số sau "thẻ chữ số <b>...</b>".
      const m = stem.match(/thẻ chữ số\s*([\d, ]+?)\s*\(/);
      R.ok(!!m, 'lập số: tách được các thẻ', q);
      if (m) {
        const digits = m[1].split(/[,\s]+/).filter(x => x.length).map(Number);
        const wantMax = /lớn nhất/.test(stem);
        let want;
        if (wantMax) {
          want = Number(digits.slice().sort((a, b) => b - a).join(''));
        } else {
          const asc = digits.slice().sort((a, b) => a - b);
          if (asc[0] === 0) {
            for (let k = 1; k < asc.length; k++) {
              if (asc[k] !== 0) { const t = asc[0]; asc[0] = asc[k]; asc[k] = t; break; }
            }
          }
          want = Number(asc.join(''));
        }
        R.eq(Number(q.answer), want, 'lập số đúng', q);
        R.ok(String(want)[0] !== '0', 'lập số: 0 không đứng đầu', q);
      }
    } else if (/tròn nghìn lớn nhất/.test(stem)) {
      const N = firstInt(stem);
      const want = Math.floor(N / 1000) * 1000;
      R.eq(Number(q.answer), want, 'tròn nghìn lớn nhất bé hơn N', q);
      R.ok(want < N && want % 1000 === 0, 'tròn nghìn: < N và tròn nghìn', q);
    } else if (/tròn chục nghìn lớn nhất/.test(stem)) {
      const N = firstInt(stem);
      const want = Math.floor(N / 10000) * 10000;
      R.eq(Number(q.answer), want, 'tròn chục nghìn lớn nhất bé hơn N', q);
      R.ok(want < N && want % 10000 === 0, 'tròn chục nghìn: < N và tròn chục nghìn', q);
    } else {
      R.ok(false, 'so-100000: dạng câu không nhận diện: ' + stem, q);
    }
  }
}

/* =====================================================================
 *  2) CỘNG – TRỪ
 *  Cơ bản/Nâng vừa: biểu thức (parser tính lại). Thử thách: suy luận ngược +
 *  biết tổng & hiệu (giải lại theo bước từ số liệu trong stem).
 * =================================================================== */
function topicCongTru(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('cong-tru');
    if (!checkShape(R, q, 'cong-tru')) continue;
    R.record(q.stem + ' :: ' + (q.type === 'mc' ? q.choices[q.answer] : q.answer));
    checkRangeL3(R, q);
    const stem = plain(q.stem);

    if (q.type === 'mc') {
      // "Tính: <expr>" hoặc "Tính nhanh: <expr>" — parser tính lại theo thứ tự phép tính.
      const val = evalExpr(q.stem);
      R.ok(val !== null, 'cộng trừ: parse được biểu thức', q);
      if (val !== null) {
        R.ok(Number.isInteger(val) && val >= 0 && val <= MAX, 'cộng trừ: kết quả tự nhiên trong tầm', q);
        expectMcValue(R, q, QE._groupDigits(val), 'cộng-trừ');
        explainHasResult(R, q, val, 'cộng-trừ');
      }
    } else if (/Hai số cộng lại được/.test(stem)) {
      // Suy luận ngược: tổng T, một số M -> số kia = T - M.
      const nums = intsOf(stem);
      const T = nums[0], M = nums[1];
      R.eq(Number(q.answer), T - M, 'cộng-trừ ngược: T − M', q);
      R.ok(T - M >= 0, 'cộng-trừ ngược: không âm', q);
    } else if (/có tổng là/.test(stem) && /số lớn hơn số bé/.test(stem)) {
      // Biết tổng & phần hơn -> tìm số lớn: (tổng + hiệu) / 2.
      const nums = intsOf(stem);
      const tong = nums[0], hieu = nums[1];
      const soLon = (tong + hieu) / 2;
      R.ok(Number.isInteger(soLon), 'tổng-hiệu: (tổng+hiệu) chia hết 2', q);
      R.eq(Number(q.answer), soLon, 'tổng-hiệu: tìm số lớn', q);
      R.ok(soLon >= 0 && soLon <= tong, 'tổng-hiệu: số lớn hợp lý', q);
    } else {
      R.ok(false, 'cong-tru: dạng câu không nhận diện: ' + stem, q);
    }
  }
}

/* =====================================================================
 *  3) NHÂN – CHIA
 * =================================================================== */
function topicNhanChia(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('nhan-chia');
    if (!checkShape(R, q, 'nhan-chia')) continue;
    R.record(q.stem + ' :: ' + (q.type === 'mc' ? q.choices[q.answer] : q.answer));
    checkRangeL3(R, q);
    const stem = plain(q.stem);

    if (q.type === 'mc' && /Điền dấu/.test(stem)) {
      // So sánh hai tích: "L ___ R".
      const m = stem.match(/Điền dấu thích hợp:\s*(.+?)\s*___\s*(.+)$/);
      R.ok(!!m, 'so sánh tích: tách được 2 vế', q);
      if (m) {
        const L = evalExpr(m[1]);
        const Rr = evalExpr(m[2]);
        R.ok(L !== null && Rr !== null, 'so sánh tích: parse được 2 vế', q);
        const expected = L > Rr ? '>' : (L < Rr ? '<' : '=');
        expectMcValue(R, q, expected, 'so sánh tích');
      }
    } else if (q.type === 'mc' && /gấp (\d+) lần/.test(stem) && /Cả hai/.test(stem)) {
      // Gấp rồi gộp (word problem mc): "A có a, B gấp k lần A, cả hai có mấy?" -> a + a×k.
      const nums = intsOf(stem);
      const a = nums[0], k = Number(stem.match(/gấp (\d+) lần/)[1]);
      expectMcNum(R, q, a + a * k, 'gấp-gộp: a + a×k');
    } else if (q.type === 'mc') {
      // Biểu thức tính (bảng nhân/chia, nhân/chia nhiều chữ số, 2 bước).
      const val = evalExpr(q.stem);
      R.ok(val !== null, 'nhân chia: parse được', q);
      if (val !== null) {
        R.ok(Number.isInteger(val) && val >= 0 && val <= MAX, 'nhân chia: kết quả tự nhiên trong tầm', q);
        expectMcValue(R, q, QE._groupDigits(val), 'nhân-chia');
        explainHasResult(R, q, val, 'nhân-chia');
      }
    } else if (/nhân với/.test(stem)) {
      // Ngược nhân: "Số nào nhân với k thì được P?" -> P / k. Thế nghiệm.
      const nums = intsOf(stem);
      const k = nums[0], P = nums[1];
      const x = Number(q.answer);
      R.eq(x * k, P, 'ngược nhân: x × k = P', q);
      R.ok(Number.isInteger(P / k), 'ngược nhân: chia hết', q);
    } else if (/được thương/.test(stem)) {
      // Ngược chia: "Một số chia cho k được thương q (chia hết). Số bị chia?" -> q×k.
      const nums = intsOf(stem);
      const k = nums[0], qv = nums[1];
      R.eq(Number(q.answer), qv * k, 'ngược chia: q × k', q);
    } else {
      R.ok(false, 'nhan-chia: dạng câu không nhận diện: ' + stem, q);
    }
  }
}

/* =====================================================================
 *  4) BIỂU THỨC & TÌM X
 *  Biểu thức (mc) -> parser. Tìm x (input) -> thế nghiệm vào phương trình.
 * =================================================================== */
function topicBieuThuc(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('bieu-thuc');
    if (!checkShape(R, q, 'bieu-thuc')) continue;
    R.record((q.type === 'mc' ? '[expr] ' : '[timx] ') + plain(q.stem) +
      ' :: ' + (q.type === 'mc' ? q.choices[q.answer] : q.answer));
    checkRangeL3(R, q);
    const stem = plain(q.stem);

    if (/Tìm x/i.test(stem)) {
      // Lấy phương trình sau "Tìm x ...: ", thế x=answer rồi so 2 vế.
      const eqPart = stem.replace(/.*:\s*/, '');
      const x = Number(q.answer);
      R.ok(Number.isInteger(x) && x >= 0 && x <= MAX, 'tìm x: nghiệm tự nhiên trong tầm', q);
      const sides = eqPart.split('=');
      R.ok(sides.length === 2, 'tìm x: có dạng vế trái = vế phải', q);
      if (sides.length === 2) {
        const lhs = evalExpr(sides[0].replace(/x/g, '(' + x + ')'));
        const rhs = evalExpr(sides[1]);
        R.ok(lhs !== null && rhs !== null, 'tìm x: parse được 2 vế', q);
        R.eq(lhs, rhs, 'tìm x: thế nghiệm thoả phương trình', q);
      }
    } else {
      const val = evalExpr(q.stem);
      R.ok(val !== null, 'biểu thức: parse được', q);
      if (val !== null) {
        R.ok(Number.isInteger(val) && val >= 0 && val <= MAX, 'biểu thức: kết quả tự nhiên trong tầm', q);
        expectMcValue(R, q, QE._groupDigits(val), 'biểu thức');
        explainHasResult(R, q, val, 'biểu thức');
      }
    }
  }
}

/* =====================================================================
 *  5) CHIA CÓ DƯ
 *  Cơ bản: "thương dư số_dư". Nâng vừa: làm tròn lên (cần mấy xe) & số hộp đầy/
 *  còn thừa. Thử thách: suy luận ngược tìm số bị chia.
 * =================================================================== */
function topicChiaDu(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('chia-du');
    if (!checkShape(R, q, 'chia-du')) continue;
    R.record(q.stem + ' :: ' + (q.type === 'mc' ? q.choices[q.answer] : q.answer));
    checkRangeL3(R, q);
    const stem = plain(q.stem);

    if (/Đặt tính rồi tính/.test(stem)) {
      // "thương dư số dư"; stem chứa "DIVIDEND ÷ DIVISOR".
      const m = stem.match(/([\d ]+)÷\s*(\d+)/);
      R.ok(!!m, 'chia dư: tách được phép chia', q);
      const dividend = m ? Number(m[1].replace(/\s/g, '')) : null;
      const divisor = m ? Number(m[2]) : null;
      const am = String(q.answer).match(/(\d+)\s*dư\s*(\d+)/);
      R.ok(!!am, 'chia dư: answer đúng dạng "thương dư số dư"', q);
      if (am && divisor) {
        const Q = Number(am[1]), Rr = Number(am[2]);
        R.eq(Q * divisor + Rr, dividend, 'chia dư: thương×chia+dư = bị chia', q);
        R.ok(Rr > 0 && Rr < divisor, 'chia dư: 0 < dư < số chia', q);
        R.eq(Q, Math.floor(dividend / divisor), 'chia dư: thương đúng', q);
        R.eq(Rr, dividend % divisor, 'chia dư: số dư đúng', q);
      }
    } else if (/Cần ít nhất/.test(stem)) {
      // Làm tròn LÊN: "Mỗi V chở được CAP. Có TOTAL. Cần ít nhất mấy V?" -> ceil(TOTAL/CAP).
      const nums = intsOf(stem);
      const cap = nums[0], total = nums[1];
      const want = Math.ceil(total / cap);
      R.ok(total % cap !== 0, 'cần xe: có dư (để cần làm tròn lên)', q);
      expectMcNum(R, q, want, 'cần xe (làm tròn lên)');
    } else if (/mấy hộp đầy/.test(stem)) {
      // Số hộp đầy = floor(total / per).
      const nums = intsOf(stem);
      const total = nums[0], per = nums[1];
      R.eq(Number(q.answer), Math.floor(total / per), 'hộp đầy: floor(total/per)', q);
    } else if (/còn thừa/.test(stem)) {
      // Số còn thừa = total % per.
      const nums = intsOf(stem);
      const total = nums[0], per = nums[1];
      const want = total % per;
      R.eq(Number(q.answer), want, 'còn thừa: total % per', q);
      R.ok(want > 0 && want < per, 'còn thừa: 0 < dư < per', q);
    } else if (/được thương/.test(stem) && /số dư/.test(stem)) {
      // Ngược: chia cho d được thương q và dư r -> số bị chia = q×d + r.
      const nums = intsOf(stem);
      const d = nums[0], qv = nums[1], r = nums[2];
      R.eq(Number(q.answer), qv * d + r, 'chia dư ngược: q×d + r', q);
      R.ok(r > 0 && r < d, 'chia dư ngược: 0 < dư < số chia', q);
    } else {
      R.ok(false, 'chia-du: dạng câu không nhận diện: ' + stem, q);
    }
  }
}

/* =====================================================================
 *  6) ĐO LƯỜNG
 * =================================================================== */
const LEN = { km: 1000000, m: 1000, dm: 100, cm: 10, mm: 1 }; // theo mm
function topicDoLuong(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('do-luong');
    if (!checkShape(R, q, 'do-luong')) continue;
    const stem = plain(q.stem);
    R.record(stem + ' :: ' + (q.type === 'mc' ? q.choices[q.answer] : q.answer));
    checkRangeL3(R, q);

    // ---- Đổi rồi tính (số đo hỗn hợp): "A big a small OP B big b small = ___ small" ----
    let m = stem.match(/Đổi rồi tính:\s*(\d+)\s*(km|cm|dm|mm|m)\s+(\d+)\s*(km|cm|dm|mm|m)\s*([+−-])\s*(\d+)\s*(km|cm|dm|mm|m)\s+(\d+)\s*(km|cm|dm|mm|m)\s*=\s*___\s*(km|cm|dm|mm|m)/);
    if (m) {
      const A = Number(m[1]) * (LEN[m[2]] / LEN[m[10]]) + Number(m[3]) * (LEN[m[4]] / LEN[m[10]]);
      const op = m[5];
      const B = Number(m[6]) * (LEN[m[7]] / LEN[m[10]]) + Number(m[8]) * (LEN[m[9]] / LEN[m[10]]);
      const expected = (op === '+') ? A + B : A - B;
      R.ok(Number.isInteger(expected) && expected >= 0, 'đổi rồi tính: nguyên & không âm', q);
      expectMcNum(R, q, expected, 'đổi rồi tính (hỗn hợp)');
      continue;
    }
    // ---- Đổi đơn vị đơn: "X u1 = ___ u2" ----
    m = stem.match(/Đổi đơn vị:\s*(\d+)\s*(km|cm|dm|mm|m)\s*=\s*___\s*(km|cm|dm|mm|m)/);
    if (m) {
      const expected = Number(m[1]) * (LEN[m[2]] / LEN[m[3]]);
      R.ok(Number.isInteger(expected), 'độ dài: hệ số đổi nguyên', q);
      expectMcNum(R, q, expected, 'độ dài đơn');
      continue;
    }
    // ---- Khối lượng kg -> g ----
    m = stem.match(/(\d+)\s*kg\s*=\s*___\s*g/);
    if (m) {
      expectMcNum(R, q, Number(m[1]) * 1000, 'khối lượng');
      continue;
    }
    // ---- Thời gian đổi đơn vị ----
    m = stem.match(/Đổi đơn vị:\s*(\d+)\s*(giờ|phút|tuần|ngày)\s*=\s*___\s*(phút|giây|ngày|giờ)/);
    if (m) {
      const TIME = { 'giờ-phút': 60, 'phút-giây': 60, 'tuần-ngày': 7, 'ngày-giờ': 24 };
      const k = TIME[m[2] + '-' + m[3]];
      R.ok(!!k, 'thời gian: cặp đơn vị hợp lệ ' + m[2] + '-' + m[3], q);
      if (k) expectMcNum(R, q, Number(m[1]) * k, 'thời gian');
      continue;
    }
    // ---- Tiền 1 mệnh giá: "Có N tờ tiền loại M đồng" ----
    m = stem.match(/Có (\d+) tờ tiền loại\s*([\d .]+)\s*đồng/);
    if (m) {
      const expected = Number(m[1]) * Number(m[2].replace(/[ .]/g, ''));
      expectMcNum(R, q, expected, 'tiền 1 mệnh giá');
      continue;
    }
    // ---- Tiền 2 mệnh giá: "N tờ loại A đồng và M tờ loại B đồng" ----
    m = stem.match(/(\d+)\s*tờ loại\s*([\d .]+)\s*đồng\s*và\s*(\d+)\s*tờ loại\s*([\d .]+)\s*đồng/);
    if (m) {
      const expected = Number(m[1]) * Number(m[2].replace(/[ .]/g, '')) +
        Number(m[3]) * Number(m[4].replace(/[ .]/g, ''));
      expectMcNum(R, q, expected, 'tiền 2 mệnh giá');
      continue;
    }
    // ---- Lít: "Can thứ nhất A l ..., can thứ hai B l ..." ----
    if (/Can thứ nhất/.test(stem)) {
      const nums = intsOf(stem);
      expectMcNum(R, q, nums[0] + nums[1], 'lít');
      continue;
    }
    // ---- Khoảng thời gian (input): "bắt đầu H1 giờ M1 phút, kết thúc H2 giờ M2 phút" ----
    if (/bắt đầu lúc/.test(stem) && /kết thúc lúc/.test(stem)) {
      const m2 = stem.match(/bắt đầu lúc\s*(\d+)\s*giờ\s*(\d+)\s*phút.*kết thúc lúc\s*(\d+)\s*giờ\s*(\d+)\s*phút/);
      R.ok(!!m2, 'khoảng giờ: tách được 2 mốc', q);
      if (m2) {
        const start = Number(m2[1]) * 60 + Number(m2[2]);
        const end = Number(m2[3]) * 60 + Number(m2[4]);
        R.eq(Number(q.answer), end - start, 'khoảng giờ: end − start (phút)', q);
        R.ok(end - start > 0, 'khoảng giờ: dương', q);
      }
      continue;
    }
    // ---- Mua hàng - tiền thừa (input, THỬ THÁCH): "mua SL OBJ giá A đồng mỗi ... và một
    //      món khác giá B đồng. đưa tờ MENH đồng. trả lại bao nhiêu?" ----
    if (/trả lại bao nhiêu/.test(stem)) {
      const m3 = stem.match(/mua\s*(\d+)\s.*?giá\s*([\d .]+)\s*đồng\s*mỗi.*?giá\s*([\d .]+)\s*đồng.*?đưa tờ\s*([\d .]+)\s*đồng/);
      R.ok(!!m3, 'tiền thừa: tách được số liệu', q);
      if (m3) {
        const sl = Number(m3[1]);
        const giaA = Number(m3[2].replace(/[ .]/g, ''));
        const giaB = Number(m3[3].replace(/[ .]/g, ''));
        const menh = Number(m3[4].replace(/[ .]/g, ''));
        const tong = giaA * sl + giaB;
        const thua = menh - tong;
        R.ok(thua >= 0, 'tiền thừa: không âm', q);
        R.eq(Number(q.answer), thua, 'tiền thừa: menh − (giaA×sl + giaB)', q);
      }
      continue;
    }
    R.ok(false, 'đo lường: dạng không nhận diện: ' + stem, q);
  }
}

/* =====================================================================
 *  7) HÌNH HỌC
 * =================================================================== */
function topicHinhHoc(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('hinh-hoc');
    if (!checkShape(R, q, 'hinh-hoc')) continue;
    const stem = plain(q.stem);
    R.record(stem + ' :: ' + (q.type === 'mc' ? q.choices[q.answer] : q.answer));
    checkRangeL3(R, q);
    const nums = intsOf(stem);

    if (/cắt ra một hình vuông/.test(stem)) {
      // Cắt hình (mc): HCN dài d rộng r, cắt HV cạnh s -> còn lại = d×r − s×s.
      const d = nums[0], r = nums[1], s = nums[2];
      const want = d * r - s * s;
      expectMcNum(R, q, want, 'cắt hình: d×r − s×s');
      R.ok(want > 0, 'cắt hình: phần còn lại dương', q);
    } else if (/chu vi/.test(stem) && /chiều dài hơn chiều rộng/.test(stem)) {
      // Ghép điều kiện (input): chu vi P, dài hơn rộng h -> dài = (P/2 + h)/2.
      const P = nums[0], h = nums[1];
      const dai = (P / 2 + h) / 2;
      R.ok(Number.isInteger(dai), 'cv-hiệu: chiều dài nguyên', q);
      R.eq(Number(q.answer), dai, 'cv-hiệu: tìm chiều dài', q);
      const rong = dai - h;
      R.eq((dai + rong) * 2, P, 'cv-hiệu: thử lại chu vi', q);
    } else if (/lát kín nền/.test(stem)) {
      // Đếm viên gạch (mc): diện tích nền ÷ diện tích viên.
      let areaFloor, areaTile;
      if (/hình vuông cạnh/.test(stem) && /Nền phòng hình vuông/.test(stem)) {
        // nền vuông cạnh side; viên vuông cạnh tile
        const side = nums[0], tile = nums[1];
        areaFloor = side * side; areaTile = tile * tile;
      } else {
        // nền HCN dài d rộng r; viên vuông cạnh tile
        const d = nums[0], r = nums[1], tile = nums[2];
        areaFloor = d * r; areaTile = tile * tile;
      }
      const want = areaFloor / areaTile;
      R.ok(Number.isInteger(want), 'viên gạch: chia hết', q);
      expectMcNum(R, q, want, 'viên gạch');
    } else if (/Chu vi/.test(stem) && /chữ nhật/.test(stem)) {
      const d = nums[0], r = nums[1];
      expectMcNum(R, q, (d + r) * 2, 'cv hcn: (d+r)×2');
    } else if (/Diện tích/.test(stem) && /chữ nhật/.test(stem)) {
      const d = nums[0], r = nums[1];
      expectMcNum(R, q, d * r, 'dt hcn: d×r');
    } else if (/Chu vi/.test(stem) && /vuông/.test(stem)) {
      expectMcNum(R, q, nums[0] * 4, 'cv hv: c×4');
    } else if (/Diện tích/.test(stem) && /vuông/.test(stem)) {
      expectMcNum(R, q, nums[0] * nums[0], 'dt hv: c×c');
    } else if (/chu vi/.test(stem) && /Cạnh/.test(stem) && /vuông/.test(stem)) {
      const cv = nums[0];
      R.eq(Number(q.answer), cv / 4, 'ngược cv hv: cạnh = cv÷4', q);
      R.ok(Number.isInteger(cv / 4), 'ngược cv hv: chia hết', q);
    } else if (/diện tích/.test(stem) && /Cạnh/.test(stem) && /vuông/.test(stem)) {
      const dt = nums[0];
      const c = Number(q.answer);
      R.eq(c * c, dt, 'ngược dt hv: cạnh×cạnh = dt', q);
    } else if (/chu vi/.test(stem) && /Chiều rộng/.test(stem)) {
      const cv = nums[0], d = nums[1];
      const r = Number(q.answer);
      R.eq((d + r) * 2, cv, 'ngược cv hcn: (d+r)×2 = cv', q);
      R.ok(r > 0, 'ngược cv hcn: rộng dương', q);
    } else {
      R.ok(false, 'hình học: dạng không nhận diện: ' + stem, q);
    }
  }
}

/* =====================================================================
 *  8) TOÁN CÓ LỜI VĂN
 *  Tự giải lại theo bước từ số liệu trong stem cho từng dạng.
 * =================================================================== */
function topicLoiVan(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('loi-van');
    if (!checkShape(R, q, 'loi-van')) continue;
    R.eq(q.type, 'input', 'lời văn: dạng input', q);
    const stem = plain(q.stem);
    R.record(stem + ' :: ' + q.answer);
    checkRangeL3(R, q);
    const ans = Number(q.answer);
    R.ok(Number.isInteger(ans) && ans >= 0 && ans <= MAX, 'lời văn: đáp số tự nhiên trong tầm', q);
    const nums = intsOf(stem);

    if (/gấp (\d+) lần/.test(stem) && /Cả hai|cả hai/.test(stem)) {
      // Gấp rồi gộp: a + a×k.
      const a = nums[0], k = Number(stem.match(/gấp (\d+) lần/)[1]);
      R.eq(ans, a + a * k, 'gấp-gộp: a + a×k', q);
    } else if (/gấp (\d+) lần/.test(stem)) {
      const a = nums[0], k = Number(stem.match(/gấp (\d+) lần/)[1]);
      R.eq(ans, a * k, 'gấp: a×k', q);
    } else if (/giảm đi (\d+) lần/.test(stem)) {
      const a = nums[0], k = Number(stem.match(/giảm đi (\d+) lần/)[1]);
      R.eq(ans, a / k, 'giảm: a÷k', q);
      R.ok(Number.isInteger(a / k), 'giảm: chia hết', q);
    } else if (/nhiều hơn/.test(stem) && /có tất cả/.test(stem)) {
      // Biết tổng & hiệu (theo bước): "tất cả T ... nhiều hơn ... h ... <name2> có?"
      // -> số lớn = (T + h)/2.
      const T = nums[0], h = nums[1];
      const soLon = (T + h) / 2;
      R.ok(Number.isInteger(soLon), 'lv tổng-hiệu: (T+h) chia hết 2', q);
      R.eq(ans, soLon, 'lv tổng-hiệu: số lớn = (T+h)/2', q);
    } else if (/nhiều hơn/.test(stem)) {
      const a = nums[0], m = nums[1];
      R.eq(ans, a + m, 'nhiều hơn: a+m', q);
    } else if (/ít hơn/.test(stem)) {
      const a = nums[0], m = nums[1];
      R.eq(ans, a - m, 'ít hơn: a-m', q);
    } else if (/bán đi/.test(stem)) {
      // 2 bước: boxes × perBox − sold.
      const boxes = nums[0], perBox = nums[1], sold = nums[2];
      R.eq(ans, boxes * perBox - sold, '2 bước: boxes×perBox − sold', q);
    } else if (/để rời/.test(stem)) {
      // 2 bước: boxes × perBox + extra.
      const boxes = nums[0], perBox = nums[1], extra = nums[2];
      R.eq(ans, boxes * perBox + extra, '2 bước: boxes×perBox + extra', q);
    } else if (/cùng loại/.test(stem) && /nghìn/.test(stem)) {
      // Rút về đơn vị: n1 cái hết total nghìn -> n2 cái = (total/n1) × n2.
      const n1 = nums[0], total = nums[1], n2 = nums[2];
      R.ok(Number.isInteger(total / n1), 'rút đơn vị: giá đơn vị nguyên', q);
      R.eq(ans, (total / n1) * n2, 'rút đơn vị: per×n2', q);
    } else if (/Sau khi cho bạn/.test(stem) && /còn lại/.test(stem)) {
      // Suy luận ngược: cho đi C, còn L -> lúc đầu = L + C.
      const cho = nums[0], conLai = nums[1];
      R.eq(ans, cho + conLai, 'lv ngược: còn lại + đã cho', q);
    } else {
      R.ok(false, 'lời văn: dạng không nhận diện: ' + stem, q);
    }
  }
}

/* =====================================================================
 *  9) PHÁT TRIỂN TƯ DUY
 *  Tính nhanh/ghép thừa số (mc) -> parser. Dãy -> suy quy luật. Đếm/trồng cây/
 *  nghĩ số -> tính lại từ số liệu trong stem.
 * =================================================================== */
function topicTuDuy(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('tu-duy');
    if (!checkShape(R, q, 'tu-duy')) continue;
    const stem = plain(q.stem);
    R.record(stem + ' :: ' + (q.type === 'mc' ? q.choices[q.answer] : q.answer));
    checkRangeL3(R, q);

    if (/Tính nhanh/i.test(stem)) {
      // a×c+b×c, ghép thừa số (4×q×25), v.v. — parser tính lại theo thứ tự phép tính.
      const val = evalExpr(q.stem);
      R.ok(val !== null, 'tính nhanh: parse được', q);
      if (val !== null) {
        R.ok(Number.isInteger(val) && val >= 0 && val <= MAX, 'tính nhanh: trong tầm', q);
        expectMcValue(R, q, QE._groupDigits(val), 'tính nhanh');
      }
    } else if (/số tiếp theo/i.test(stem)) {
      // Dãy: suy quy luật từ các số hiện. Hỗ trợ: cộng đều / nhân đều / ×k+c / sai phân.
      const listSeg = stem.replace(/.*:\s*/, '');
      const seq = intsOf(listSeg);
      R.ok(seq.length >= 4, 'dãy: có >=4 số', q);
      if (seq.length >= 4) {
        const expected = predictNext(seq);
        R.ok(expected !== null, 'dãy: suy được quy luật', q);
        if (expected !== null) R.eq(Number(q.answer), expected, 'dãy: số tiếp theo đúng', q);
      }
    } else if (/bao nhiêu số tròn chục/.test(stem)) {
      // Đếm số tròn chục từ lo đến hi (tính cả 2 đầu). Lấy lo/hi từ cụm "từ A đến B".
      const m = stem.match(/từ\s*(\d+)\s*đến\s*(\d+)/);
      R.ok(!!m, 'đếm tròn chục: tách được lo/hi', q);
      if (m) {
        const lo = Number(m[1]), hi = Number(m[2]);
        let cnt = 0;
        for (let v = lo; v <= hi; v++) if (v % 10 === 0) cnt++;
        R.eq(Number(q.answer), cnt, 'đếm tròn chục', q);
      }
    } else if (/chia hết cho 5/.test(stem)) {
      // Đếm số chia hết cho 5 từ lo đến hi (tính cả 2 đầu). Lấy lo/hi từ cụm "từ A đến B".
      const m = stem.match(/từ\s*(\d+)\s*đến\s*(\d+)/);
      R.ok(!!m, 'đếm chia 5: tách được lo/hi', q);
      if (m) {
        const lo = Number(m[1]), hi = Number(m[2]);
        let cnt = 0;
        for (let v = lo; v <= hi; v++) if (v % 5 === 0) cnt++;
        R.eq(Number(q.answer), cnt, 'đếm chia hết cho 5', q);
      }
    } else if (/Trồng cây/.test(stem)) {
      // Trồng cây 2 đầu: số cây = length/khoang + 1.
      const nums = intsOf(stem);
      const length = nums[0], khoang = nums[1];
      R.ok(Number.isInteger(length / khoang), 'trồng cây: chia hết', q);
      R.eq(Number(q.answer), length / khoang + 1, 'trồng cây: khoảng + 1', q);
    } else if (/Nghĩ một số/.test(stem)) {
      // Nghĩ số: ×k rồi cộng/bớt c = T -> x. Thế nghiệm.
      const nums = intsOf(stem);
      const k = nums[0], c = nums[1], T = nums[2];
      const x = Number(q.answer);
      const isAdd = /cộng thêm/.test(stem);
      const recomputed = isAdd ? x * k + c : x * k - c;
      R.eq(recomputed, T, 'nghĩ số: thế nghiệm x×k ±c = T', q);
    } else {
      R.ok(false, 'tư duy: dạng không nhận diện: ' + stem, q);
    }
  }
}

// Suy số tiếp theo của dãy theo 4 quy luật lớp 3: cộng đều, nhân đều, ×k+c, sai phân.
function predictNext(seq) {
  const n = seq.length;
  // 1) cộng đều
  const d = seq[1] - seq[0];
  if (seq.every((v, i) => i === 0 || v - seq[i - 1] === d)) return seq[n - 1] + d;
  // 2) nhân đều (tỉ số nguyên & đều)
  if (seq[0] !== 0) {
    const r = seq[1] / seq[0];
    if (Number.isInteger(r) && seq.every((v, i) => i === 0 || v === seq[i - 1] * r)) {
      return seq[n - 1] * r;
    }
  }
  // 3) ×k + c (mỗi số = số trước × k + c). Suy k,c từ 3 phương trình đầu.
  //    seq[1] = seq[0]*k + c ; seq[2] = seq[1]*k + c -> k = (seq2-seq1)/(seq1-seq0)
  if (seq[1] - seq[0] !== 0) {
    const k = (seq[2] - seq[1]) / (seq[1] - seq[0]);
    if (Number.isInteger(k) && k >= 2) {
      const c = seq[1] - seq[0] * k;
      if (seq.every((v, i) => i === 0 || v === seq[i - 1] * k + c)) {
        return seq[n - 1] * k + c;
      }
    }
  }
  // 4) sai phân tăng dần đều (hiệu cấp 2 không đổi).
  const diffs = [];
  for (let i = 1; i < n; i++) diffs.push(seq[i] - seq[i - 1]);
  const dd = diffs[1] - diffs[0];
  if (diffs.every((v, i) => i === 0 || v - diffs[i - 1] === dd)) {
    const nextDiff = diffs[diffs.length - 1] + dd;
    return seq[n - 1] + nextDiff;
  }
  return null;
}

/* =====================================================================
 *  generateMixed
 * =================================================================== */
function topicMixed(R) {
  const arr = QE.generateMixed(10);
  R.eq(arr.length, 10, 'generateMixed(10) trả 10 câu', null);
  arr.forEach(q => {
    R.ok(q && (q.type === 'mc' || q.type === 'input'), 'mixed: mỗi câu hợp lệ type', q);
    R.ok(typeof q.topic === 'string', 'mixed: có topic', q);
  });
  R.eq(QE.generateMixed().length, 10, 'generateMixed() mặc định 10 câu', null);
  let threw = false;
  try { QE.generate('khong-ton-tai'); } catch (e) { threw = true; }
  R.ok(threw, 'generate(id sai) ném lỗi', null);
  R.eq(QE.topics.length, 9, 'engine có đúng 9 chủ đề', null);
}

/* ============================== RUN ============================== */
export function run() {
  const R = makeReporter('ENGINE');
  topicSo(R);
  topicCongTru(R);
  topicNhanChia(R);
  topicBieuThuc(R);
  topicChiaDu(R);
  topicDoLuong(R);
  topicHinhHoc(R);
  topicLoiVan(R);
  topicTuDuy(R);
  topicMixed(R);
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
