/*
 * engine.spec.mjs — TEST ĐỘNG CƠ (quan trọng nhất).
 * Với mỗi chủ đề: sinh ~300 câu, TỰ TÍNH LẠI ĐỘC LẬP từ stem (không tin explain),
 * kiểm tính đúng toán học + các ràng buộc shape/giới hạn.
 *
 * Xuất hàm run() trả về reporter.state để run.mjs tổng hợp.
 */
import {
  QE, makeReporter, plain, unGroup, ints, evalExpr, refReadNumberVi
} from './_harness.mjs';

const PER_TOPIC = 300;
const MAX = 100000;

/* ----------------------------- HÀM PHỤ ----------------------------- */
// Lấy số nguyên (đã gỡ phân nhóm) từ một đoạn chuỗi.
function intsOf(s) { return ints(s); }

// Chuẩn hoá chuỗi đọc số: gọn khoảng trắng.
function normSpace(s) { return String(s).replace(/\s+/g, ' ').trim().toLowerCase(); }

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
    // choices không trùng nhau
    const seen = new Set();
    let dup = false;
    q.choices.forEach(c => { if (seen.has(c)) dup = true; seen.add(c); });
    R.ok(!dup, 'choices không trùng', q);
    // check() phải đồng ý với answer index, và bác mọi index khác
    R.ok(QE.check(q, q.answer) === true, 'check() chấp nhận đúng answer index', q);
    for (let i = 0; i < q.choices.length; i++) {
      if (i !== q.answer) R.ok(QE.check(q, i) === false, 'check() bác index sai ' + i, q);
    }
  } else {
    R.ok(q.answer !== undefined && q.answer !== null && String(q.answer).length > 0,
      'input có answer', q);
    // đáp án chuẩn của chính engine phải được check() chấp nhận
    R.ok(QE.check(q, q.answer) === true, 'check() chấp nhận answer chuẩn', q);
  }
  return true;
}

// Với MC: kiểm đáp án đúng (theo tính lại độc lập) có nằm trong choices và chỉ đúng index answer.
function expectMcValue(R, q, expectedStr, label) {
  const ans = q.choices[q.answer];
  R.eq(normSpace(ans), normSpace(expectedStr),
    label + ': giá trị tại answer index khớp tính lại độc lập', q);
}

// explain phải chứa kết quả cuối (so trên chuỗi đã gỡ phân nhóm).
function explainHasResult(R, q, resultNum, label) {
  const flat = unGroup(q.explain).replace(/\s+/g, '');
  R.ok(flat.indexOf(String(resultNum)) !== -1,
    label + ': explain chứa kết quả ' + resultNum, q);
}

/* =====================================================================
 *  1) SỐ ĐẾN 100 000
 * =================================================================== */
function topicSo(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('so-100000');
    if (!checkShape(R, q, 'so-100000')) continue;
    R.record(q.stem + '  ::  ' + (q.type === 'mc' ? q.choices[q.answer] : q.answer));

    const stem = plain(q.stem);

    if (/đọc là/.test(stem)) {
      // Cho số -> chọn cách đọc. Số nằm trong <b>...</b>.
      const num = intsOf(q.stem)[0];
      R.ok(num >= 0 && num <= MAX, 'số đọc <= 100000', q);
      const expected = refReadNumberVi(num);
      // đáp án đúng phải là cách đọc (có viết hoa chữ đầu)
      expectMcValue(R, q, capFirst(expected), 'doc');
      // engine reader cũng phải khớp tham chiếu
      R.eq(normSpace(QE._readNumberVi(num)), normSpace(expected), 'reader engine khớp tham chiếu', q);
    } else if (/Viết số/i.test(stem)) {
      // Cho cách đọc -> số. answer là chuỗi số.
      const a = Number(q.answer);
      R.ok(Number.isInteger(a) && a >= 0 && a <= MAX, 'viết số: đáp án trong tầm', q);
      // cách đọc trong stem phải khớp refRead(a)
      const readPart = stem.replace(/.*:/, '').trim();
      R.eq(normSpace(stripDiacriticsKeep(readPart)), normSpace(capFirst(refReadNumberVi(a))),
        'viết số: cách đọc trong đề khớp đáp án', q);
    } else if (/có giá trị là/.test(stem)) {
      // Giá trị chữ số theo hàng.
      const nums = intsOf(stem);
      const N = nums[0];              // số gốc
      const digit = nums[1];         // chữ số nêu trong đề
      const hangMap = { 'hàng đơn vị': 0, 'hàng chục': 1, 'hàng trăm': 2, 'hàng nghìn': 3, 'hàng chục nghìn': 4 };
      let pos = null;
      for (const k in hangMap) if (stem.indexOf(k) !== -1) pos = hangMap[k];
      R.ok(pos !== null, 'giá trị: nhận diện được hàng', q);
      if (pos !== null) {
        const s = String(N);
        const realDigit = Number(s[s.length - 1 - pos]);
        R.eq(realDigit, digit, 'giá trị: chữ số nêu đúng vị trí trong số', q);
        const value = realDigit * Math.pow(10, pos);
        expectMcValue(R, q, QE._groupDigits(value), 'giá trị');
        explainHasResult(R, q, value, 'giá trị');
      }
    } else if (/Điền dấu/i.test(stem)) {
      // So sánh. Lấy 2 số quanh "___".
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
    } else if (/lớn nhất|bé nhất/.test(stem)) {
      const wantMax = /lớn nhất/.test(stem);
      // các số liệt kê: lấy phần "trong các số ... là"
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
    } else {
      R.ok(false, 'so-100000: dạng câu không nhận diện được: ' + stem, q);
    }
  }
}

/* =====================================================================
 *  2) CỘNG – TRỪ
 * =================================================================== */
function topicCongTru(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('cong-tru');
    if (!checkShape(R, q, 'cong-tru')) continue;
    R.record(q.stem + ' :: ' + q.choices[q.answer]);
    const val = evalExpr(q.stem);
    R.ok(val !== null, 'cộng trừ: parse được biểu thức', q);
    if (val !== null) {
      R.ok(Number.isInteger(val) && val >= 0 && val <= MAX, 'cộng trừ: kết quả tự nhiên trong tầm', q);
      expectMcValue(R, q, QE._groupDigits(val), 'cộng-trừ');
      explainHasResult(R, q, val, 'cộng-trừ');
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
    R.record(q.stem + ' :: ' + q.choices[q.answer]);
    const val = evalExpr(q.stem);
    R.ok(val !== null, 'nhân chia: parse được', q);
    if (val !== null) {
      R.ok(Number.isInteger(val) && val >= 0 && val <= MAX, 'nhân chia: kết quả tự nhiên trong tầm', q);
      expectMcValue(R, q, QE._groupDigits(val), 'nhân-chia');
      explainHasResult(R, q, val, 'nhân-chia');
    }
  }
}

/* =====================================================================
 *  4) BIỂU THỨC & TÌM X
 * =================================================================== */
function topicBieuThuc(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('bieu-thuc');
    if (!checkShape(R, q, 'bieu-thuc')) continue;

    const stem = plain(q.stem);
    if (/Tìm x/i.test(stem)) {
      R.record('[timx] ' + stem + ' :: x=' + q.answer);
      // Lấy phương trình sau "Tìm x ...: "
      const eqPart = stem.replace(/.*:\s*/, '');
      const x = Number(q.answer);
      R.ok(Number.isInteger(x) && x >= 0 && x <= MAX, 'tìm x: nghiệm tự nhiên trong tầm', q);
      // Thế nghiệm: thay 'x' bằng giá trị rồi so 2 vế.
      const sides = eqPart.split('=');
      R.ok(sides.length === 2, 'tìm x: có dạng vế trái = vế phải', q);
      if (sides.length === 2) {
        const lhs = evalExpr(sides[0].replace(/x/g, '(' + x + ')'));
        const rhs = evalExpr(sides[1]);
        R.ok(lhs !== null && rhs !== null, 'tìm x: parse được 2 vế', q);
        R.eq(lhs, rhs, 'tìm x: thế nghiệm thoả phương trình', q);
      }
    } else {
      R.record('[expr] ' + stem + ' :: ' + q.choices[q.answer]);
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
 * =================================================================== */
function topicChiaDu(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('chia-du');
    if (!checkShape(R, q, 'chia-du')) continue;
    R.record(q.stem + ' :: ' + q.answer);
    // stem: "... <b>DIVIDEND ÷ DIVISOR</b>"
    const nums = intsOf(q.stem);
    const dividend = nums[0];
    const divisor = nums[1];
    // answer dạng "Q dư R"
    const m = String(q.answer).match(/(\d+)\s*dư\s*(\d+)/);
    R.ok(!!m, 'chia dư: answer đúng dạng "thương dư số dư"', q);
    if (m && divisor) {
      const Q = Number(m[1]);
      const Rr = Number(m[2]);
      R.eq(Q * divisor + Rr, dividend, 'chia dư: thương×chia+dư = bị chia', q);
      R.ok(Rr > 0 && Rr < divisor, 'chia dư: 0 < dư < số chia', q);
      // đối chiếu với phép chia thật
      R.eq(Q, Math.floor(dividend / divisor), 'chia dư: thương đúng', q);
      R.eq(Rr, dividend % divisor, 'chia dư: số dư đúng', q);
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

    // Dạng hỗn hợp (kiểm TRƯỚC dạng đơn vì có 2 cụm đơn vị):
    // "A big B small = ___ small". Đơn vị xếp dài-trước để 'm' không khớp prefix 'mm'.
    let m = stem.match(/(\d+)\s*(km|cm|dm|mm|m)\s+(\d+)\s*(km|cm|dm|mm|m)\s*=\s*___\s*(km|cm|dm|mm|m)/);
    if (m) {
      const bigV = Number(m[1]), bigU = m[2], smallV = Number(m[3]), smallU = m[4], outU = m[5];
      const expected = bigV * (LEN[bigU] / LEN[outU]) + smallV * (LEN[smallU] / LEN[outU]);
      R.ok(Number.isInteger(expected), 'độ dài hh: nguyên', q);
      const ansNum = intsOf(q.choices[q.answer]).join('');
      R.eq(ansNum, String(expected), 'độ dài hh: giá trị đúng', q);
      continue;
    }
    // Dạng đổi đơn vị độ dài đơn: "X u1 = ___ u2"  (chỉ 1 cụm đơn vị trước dấu =)
    m = stem.match(/(\d+)\s*(km|cm|dm|mm|m)\s*=\s*___\s*(km|cm|dm|mm|m)/);
    if (m) {
      const v = Number(m[1]), u1 = m[2], u2 = m[3];
      const expected = v * (LEN[u1] / LEN[u2]);
      R.ok(Number.isInteger(expected), 'độ dài: hệ số đổi nguyên', q);
      const ansNum = intsOf(q.choices[q.answer]).join('');
      R.eq(ansNum, String(expected), 'độ dài: giá trị đúng', q);
      continue;
    }
    // Khối lượng kg -> g
    m = stem.match(/(\d+)\s*kg\s*=\s*___\s*g/);
    if (m) {
      const expected = Number(m[1]) * 1000;
      R.eq(intsOf(q.choices[q.answer]).join(''), String(expected), 'khối lượng: giá trị đúng', q);
      continue;
    }
    // Thời gian
    m = stem.match(/(\d+)\s*(giờ|phút|tuần|ngày)\s*=\s*___\s*(phút|giây|ngày|giờ)/);
    if (m) {
      const TIME = { 'giờ-phút': 60, 'phút-giây': 60, 'tuần-ngày': 7, 'ngày-giờ': 24 };
      const key = m[2] + '-' + m[3];
      const k = TIME[key];
      R.ok(!!k, 'thời gian: cặp đơn vị hợp lệ ' + key, q);
      if (k) {
        const expected = Number(m[1]) * k;
        R.eq(intsOf(q.choices[q.answer]).join(''), String(expected), 'thời gian: giá trị đúng', q);
      }
      continue;
    }
    // Tiền: "Có N tờ loại M đồng"
    m = stem.match(/Có (\d+) tờ tiền loại ([\d .]+) đồng/);
    if (m) {
      const expected = Number(m[1]) * Number(m[2].replace(/[ .]/g, ''));
      R.eq(intsOf(q.choices[q.answer]).join(''), String(expected), 'tiền: giá trị đúng', q);
      continue;
    }
    // Lít: "Can thứ nhất A l ..., can thứ hai B l ..."
    if (/Can thứ nhất/.test(stem)) {
      const nums = intsOf(stem);
      const expected = nums[0] + nums[1];
      R.eq(intsOf(q.choices[q.answer]).join(''), String(expected), 'lít: giá trị đúng', q);
      continue;
    }
    // Xem giờ: "Đồng hồ chỉ X. Tức là mấy giờ mấy phút?"
    if (/Đồng hồ chỉ/.test(stem)) {
      // đáp án đúng phải có dạng "H giờ M phút"
      const ans = q.choices[q.answer];
      R.ok(/\d+\s*giờ\s*\d+\s*phút/.test(plain(ans)), 'xem giờ: đáp án đúng dạng "giờ phút"', q);
      // kiểm phút khớp mô tả
      const mk = stem.match(/giờ\s*(rưỡi|15 phút|kém 15 phút)|đúng/);
      const ansM = plain(ans).match(/giờ\s*(\d+)\s*phút/);
      if (ansM) {
        const phut = Number(ansM[1]);
        R.ok(phut >= 0 && phut < 60, 'xem giờ: phút hợp lệ', q);
        if (/rưỡi/.test(stem)) R.eq(phut, 30, 'xem giờ: rưỡi = 30 phút', q);
        else if (/15 phút/.test(stem) && !/kém/.test(stem)) R.eq(phut, 15, 'xem giờ: 15 phút', q);
        else if (/đúng/.test(stem)) R.eq(phut, 0, 'xem giờ: đúng giờ = 0 phút', q);
        else if (/kém 15/.test(stem)) R.eq(phut, 45, 'xem giờ: kém 15 = 45 phút', q);
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
    const nums = intsOf(stem);

    if (/Chu vi/.test(stem) && /chữ nhật/.test(stem)) {
      const d = nums[0], r = nums[1];
      const expected = (d + r) * 2;
      // giá trị đúng (bỏ đơn vị)
      const ansNum = intsOf(q.choices[q.answer])[0];
      R.eq(ansNum, expected, 'cv hcn: (d+r)×2', q);
    } else if (/Diện tích/.test(stem) && /chữ nhật/.test(stem)) {
      const d = nums[0], r = nums[1];
      const expected = d * r;
      const ansNum = intsOf(q.choices[q.answer])[0];
      R.eq(ansNum, expected, 'dt hcn: d×r', q);
    } else if (/Chu vi/.test(stem) && /vuông/.test(stem)) {
      const c = nums[0];
      const ansNum = intsOf(q.choices[q.answer])[0];
      R.eq(ansNum, c * 4, 'cv hv: c×4', q);
    } else if (/Diện tích/.test(stem) && /vuông/.test(stem)) {
      const c = nums[0];
      const ansNum = intsOf(q.choices[q.answer])[0];
      R.eq(ansNum, c * c, 'dt hv: c×c', q);
    } else if (/chu vi/.test(stem) && /Cạnh/.test(stem) && /vuông/.test(stem)) {
      // ngược: biết chu vi -> cạnh
      const cv = nums[0];
      R.eq(Number(q.answer), cv / 4, 'ngược cv hv: cạnh = cv÷4', q);
      R.ok(Number.isInteger(cv / 4), 'ngược cv hv: chia hết', q);
    } else if (/diện tích/.test(stem) && /Cạnh/.test(stem) && /vuông/.test(stem)) {
      const dt = nums[0];
      const c = Number(q.answer);
      R.eq(c * c, dt, 'ngược dt hv: cạnh×cạnh = dt', q);
    } else if (/chu vi/.test(stem) && /Chiều rộng/.test(stem)) {
      // ngược cv hcn: biết chu vi & dài -> rộng
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
 * =================================================================== */
function topicLoiVan(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('loi-van');
    if (!checkShape(R, q, 'loi-van')) continue;
    R.eq(q.type, 'input', 'lời văn: dạng input', q);
    const stem = plain(q.stem);
    R.record(stem + ' :: ' + q.answer);
    const ans = Number(q.answer);
    R.ok(Number.isInteger(ans) && ans >= 0 && ans <= MAX, 'lời văn: đáp số tự nhiên trong tầm', q);
    const nums = intsOf(stem);

    if (/gấp (\d+) lần/.test(stem)) {
      const a = nums[0], k = Number(stem.match(/gấp (\d+) lần/)[1]);
      R.eq(ans, a * k, 'gấp: a×k', q);
    } else if (/giảm đi (\d+) lần/.test(stem)) {
      const a = nums[0], k = Number(stem.match(/giảm đi (\d+) lần/)[1]);
      R.eq(ans, a / k, 'giảm: a÷k', q);
      R.ok(Number.isInteger(a / k), 'giảm: chia hết', q);
    } else if (/nhiều hơn/.test(stem)) {
      const a = nums[0], m = nums[1];
      R.eq(ans, a + m, 'nhiều hơn: a+m', q);
    } else if (/ít hơn/.test(stem)) {
      const a = nums[0], m = nums[1];
      R.eq(ans, a - m, 'ít hơn: a-m', q);
    } else if (/hộp/.test(stem) && /để rời/.test(stem)) {
      // hai bước: boxes hộp × perBox + extra
      const boxes = nums[0], perBox = nums[1], extra = nums[2];
      R.eq(ans, boxes * perBox + extra, 'hai bước: boxes×perBox+extra', q);
    } else if (/hết (\d+) nghìn/.test(stem)) {
      // rút về đơn vị
      const n1 = nums[0], total = nums[1], n2 = nums[2];
      R.ok(Number.isInteger(total / n1), 'rút đơn vị: giá đơn vị nguyên', q);
      R.eq(ans, (total / n1) * n2, 'rút đơn vị: per×n2', q);
    } else {
      R.ok(false, 'lời văn: dạng không nhận diện: ' + stem, q);
    }
  }
}

/* =====================================================================
 *  9) PHÁT TRIỂN TƯ DUY
 * =================================================================== */
function topicTuDuy(R) {
  for (let n = 0; n < PER_TOPIC; n++) {
    const q = QE.generate('tu-duy');
    if (!checkShape(R, q, 'tu-duy')) continue;
    const stem = plain(q.stem);
    R.record(stem + ' :: ' + (q.type === 'mc' ? q.choices[q.answer] : q.answer));

    if (/Tính nhanh/i.test(stem)) {
      const val = evalExpr(q.stem);
      R.ok(val !== null, 'tính nhanh: parse được', q);
      if (val !== null) {
        R.ok(Number.isInteger(val) && val >= 0 && val <= MAX, 'tính nhanh: trong tầm', q);
        expectMcValue(R, q, QE._groupDigits(val), 'tính nhanh');
      }
    } else if (/số tiếp theo/i.test(stem)) {
      // dãy số: lấy 4 số đầu, suy quy luật (cộng d hoặc nhân r)
      const listSeg = stem.replace(/.*:\s*/, '');
      const seq = intsOf(listSeg);
      R.ok(seq.length >= 4, 'dãy: có >=4 số', q);
      if (seq.length >= 4) {
        const dAdd = seq[1] - seq[0];
        const isAdd = seq[2] - seq[1] === dAdd && seq[3] - seq[2] === dAdd;
        let expected;
        if (isAdd) {
          expected = seq[3] + dAdd;
        } else {
          const r = seq[1] / seq[0];
          R.ok(seq[2] / seq[1] === r && seq[3] / seq[2] === r, 'dãy nhân: tỉ số đều', q);
          expected = seq[3] * r;
        }
        R.eq(Number(q.answer), expected, 'dãy: số tiếp theo đúng', q);
      }
    } else if (/x/.test(stem) && /</.test(stem)) {
      // chặn: a < x < a+2 -> x = a+1
      const m = stem.match(/(\d+)\s*<\s*x\s*<\s*(\d+)/);
      R.ok(!!m, 'chặn: tách được a < x < b', q);
      if (m) {
        const a = Number(m[1]), b = Number(m[2]);
        R.eq(b - a, 2, 'chặn: khoảng đúng bằng 2', q);
        R.eq(Number(q.answer), a + 1, 'chặn: x = a+1', q);
      }
    } else {
      R.ok(false, 'tư duy: dạng không nhận diện: ' + stem, q);
    }
  }
}

/* =====================================================================
 *  generateMixed: kiểm sinh đủ n câu, đa dạng chủ đề, mỗi câu hợp lệ shape.
 * =================================================================== */
function topicMixed(R) {
  const arr = QE.generateMixed(10);
  R.eq(arr.length, 10, 'generateMixed(10) trả 10 câu', null);
  arr.forEach(q => {
    R.ok(q && (q.type === 'mc' || q.type === 'input'), 'mixed: mỗi câu hợp lệ type', q);
    R.ok(typeof q.topic === 'string', 'mixed: có topic', q);
  });
  // default generateMixed() = 10
  R.eq(QE.generateMixed().length, 10, 'generateMixed() mặc định 10 câu', null);
  // generate id sai -> ném lỗi
  let threw = false;
  try { QE.generate('khong-ton-tai'); } catch (e) { threw = true; }
  R.ok(threw, 'generate(id sai) ném lỗi', null);
}

/* --------------------------- TIỆN ÍCH NHỎ --------------------------- */
function capFirst(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
// Vài stem dùng cap(read) — so sánh không phân biệt hoa thường nên giữ nguyên.
function stripDiacriticsKeep(s) { return s; }

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

// Cho phép chạy trực tiếp: node tests/engine.spec.mjs
import { fileURLToPath } from 'url';
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const s = run();
  console.log(`[${s.group}] checks=${s.checks} fails=${s.fails.length}`);
  s.fails.slice(0, 25).forEach(f => console.log('  FAIL:', f.msg, '\n    ctx:', f.ctx));
  process.exit(s.fails.length ? 1 : 0);
}
