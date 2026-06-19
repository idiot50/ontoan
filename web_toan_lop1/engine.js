/*
 * engine.js — Động cơ sinh câu hỏi Toán LỚP 1 (cho bé ~6 tuổi)
 * Classic script: chạy được qua <script src> (file://) lẫn node (require).
 *
 * Mọi câu hỏi tuân theo "giao kèo dữ liệu":
 *   {
 *     type:'mc'|'input',
 *     topic,
 *     stem,            // đề, có thể chứa <b>, ký hiệu
 *     choices?,        // chỉ khi mc
 *     answer,          // mc: INDEX (số nguyên); input: chuỗi đã chuẩn hoá
 *     explain,         // lời giải NGẮN, dễ hiểu cho bé 6 tuổi
 *     say              // BẮT BUỘC: bản CHỮ THƯỜNG để đọc to (không thẻ HTML),
 *                      // đã đọc số & dấu thành lời
 *   }
 *
 * Phạm vi lớp 1 (CT GDPT 2018): SỐ <= 100, KHÔNG nhân/chia.
 * answer LUÔN tính bằng code; ràng buộc kiểm tra TRƯỚC khi sinh.
 */
(function () {
  'use strict';

  /* ============================ TIỆN ÍCH CHUNG ============================ */

  // Số nguyên ngẫu nhiên trong [min, max] (bao gồm 2 đầu).
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Chọn ngẫu nhiên 1 phần tử trong mảng.
  function pick(arr) {
    return arr[randInt(0, arr.length - 1)];
  }

  // Xáo trộn mảng (Fisher–Yates), trả về mảng mới.
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = randInt(0, i);
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  /*
   * Tạo bộ trắc nghiệm: nhận đáp án đúng + danh sách distractor (giá trị),
   * loại trùng, đảm bảo đủ "want" phương án (bù distractor an toàn nếu thiếu),
   * trộn vị trí, trả về { choices, answerIndex }.
   * - format: hàm biến giá trị -> chuỗi hiển thị (mặc định String).
   * - padFn: sinh giá trị "gần" hợp lý khi còn thiếu phương án.
   * - want: số phương án mong muốn (mặc định 4; cho phép 3).
   */
  function makeMC(correct, distractors, format, padFn, want) {
    format = format || function (x) { return String(x); };
    want = want || 4;
    var seen = {};
    var values = [];
    var correctKey = format(correct);
    seen[correctKey] = true;
    values.push(correct);

    for (var i = 0; i < distractors.length && values.length < want; i++) {
      var d = distractors[i];
      var k = format(d);
      if (!seen[k]) {
        seen[k] = true;
        values.push(d);
      }
    }
    // Bù phương án nếu vẫn thiếu (dùng padFn sinh giá trị "gần" hợp lý).
    var guard = 0;
    while (values.length < want && guard < 300) {
      guard++;
      var extra = padFn ? padFn(correct, values) : (correct + randInt(1, 9) * (randInt(0, 1) ? 1 : -1));
      var ek = format(extra);
      if (!seen[ek]) {
        seen[ek] = true;
        values.push(extra);
      }
    }

    var order = shuffle(values);
    var answerIndex = -1;
    for (var j = 0; j < order.length; j++) {
      if (format(order[j]) === correctKey) { answerIndex = j; break; }
    }
    return { choices: order.map(format), answerIndex: answerIndex };
  }

  // padFn mặc định cho số: sinh số gần đáp án (>=0) và khác các giá trị đã có.
  function numericPad(correct, existing) {
    var delta = randInt(1, 12);
    var sign = randInt(0, 1) ? 1 : -1;
    var v = correct + delta * sign;
    if (v < 0) v = correct + delta;
    return v;
  }

  /* ====================== ĐỌC SỐ TIẾNG VIỆT (0..100) ====================== */
  // Lớp 1 chỉ tới 100. Xử lý: mười/mươi, mốt, lăm, tư, tròn chục, một trăm.

  var DV = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

  // Đọc số nguyên 0..100.
  function readNumberVi(n) {
    if (n === 0) return 'không';
    if (n === 100) return 'một trăm';
    if (n < 10) return DV[n];
    var chuc = Math.floor(n / 10);
    var dv = n % 10;
    var parts = [];
    if (chuc === 1) {
      parts.push('mười');
      if (dv === 5) parts.push('lăm');        // 15 -> mười lăm
      else if (dv > 0) parts.push(DV[dv]);    // 11 -> mười một (KHÔNG "mốt"), 14 -> mười bốn
    } else {
      parts.push(DV[chuc] + ' mươi');
      if (dv === 1) parts.push('mốt');        // 21 -> hai mươi mốt
      else if (dv === 4) parts.push('tư');    // 24 -> hai mươi tư
      else if (dv === 5) parts.push('lăm');   // 25 -> hai mươi lăm
      else if (dv > 0) parts.push(DV[dv]);
    }
    return parts.join(' ');
  }

  // Viết hoa chữ cái đầu.
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // Đọc tên dấu so sánh thành lời (dùng cho `say`).
  function saySign(sign) {
    if (sign === '>') return 'lớn hơn';
    if (sign === '<') return 'bé hơn';
    return 'bằng';
  }

  /* ============================ DỮ LIỆU CHO LỜI VĂN ============================ */
  var NAMES = ['Lan', 'Minh', 'Hoa', 'Nam', 'Bình', 'An', 'Mai', 'Tú', 'Bống', 'Cún', 'Na', 'Bi'];
  // Tên người "đầy đủ" (không biệt danh) — dùng cho lời văn để câu tự nhiên hơn.
  var PROPER_NAMES = ['Lan', 'Minh', 'Hoa', 'Nam', 'Bình', 'An', 'Mai', 'Tú', 'Hùng', 'Hà', 'Linh', 'Đức'];
  var OBJS = [
    { d: 'viên kẹo', dv: 'viên' },
    { d: 'quả bóng', dv: 'quả' },
    { d: 'cái bút', dv: 'cái' },
    { d: 'quyển vở', dv: 'quyển' },
    { d: 'con cá', dv: 'con' },
    { d: 'bông hoa', dv: 'bông' },
    { d: 'quả táo', dv: 'quả' },
    { d: 'cái bánh', dv: 'cái' },
    { d: 'con tem', dv: 'con' },
    { d: 'chiếc lá', dv: 'chiếc' }
  ];

  // Thứ trong tuần (xoay vòng). Chỉ số 0..6.
  var WEEKDAYS = ['thứ Hai', 'thứ Ba', 'thứ Tư', 'thứ Năm', 'thứ Sáu', 'thứ Bảy', 'Chủ nhật'];
  var WEEKDAYS_SAY = ['thứ hai', 'thứ ba', 'thứ tư', 'thứ năm', 'thứ sáu', 'thứ bảy', 'chủ nhật'];

  /* ============================================================================
   *  CHỦ ĐỀ 1: SỐ ĐẾN 100
   * ========================================================================== */
  function genSo100() {
    var topic = 'so-100';
    var kind = pick([
      'cautao', 'cautao-nguoc', 'sosanh', 'lientruoc', 'liensau',
      'tronchuc', 'maxmin', 'sapxep', 'haichuso',
      'lietke', 'lietke', 'demkhoang'   // ưu tiên dạng liệt kê; giữ 1 dạng đếm (count<=5)
    ]);

    // Cấu tạo: "65 gồm mấy chục mấy đơn vị?" -> nhập "6 3"? Ta cho 2 dạng.
    if (kind === 'cautao') {
      var n = randInt(11, 99);
      var chuc = Math.floor(n / 10), dv = n % 10;
      // mc: chọn cặp "chục - đơn vị" đúng.
      var correct = chuc + ' chục ' + dv + ' đơn vị';
      var dd = [
        dv + ' chục ' + chuc + ' đơn vị',          // đảo chục - đơn vị
        chuc + ' chục ' + (dv === 0 ? 1 : 0) + ' đơn vị',
        (chuc + 1) + ' chục ' + dv + ' đơn vị'
      ];
      var mc = makeMC(correct, dd, function (x) { return x; }, function () {
        return randInt(1, 9) + ' chục ' + randInt(0, 9) + ' đơn vị';
      });
      return {
        type: 'mc', topic: topic,
        stem: 'Số <b>' + n + '</b> gồm mấy chục mấy đơn vị?',
        choices: mc.choices, answer: mc.answerIndex,
        explain: n + ' gồm ' + chuc + ' chục và ' + dv + ' đơn vị.',
        say: 'số ' + readNumberVi(n) + ' gồm mấy chục mấy đơn vị?'
      };
    }

    // Cấu tạo ngược: "số gồm 7 chục 2 đơn vị là?" -> nhập số.
    if (kind === 'cautao-nguoc') {
      var chuc2 = randInt(1, 9), dv2 = randInt(0, 9);
      var ans2 = chuc2 * 10 + dv2;
      return {
        type: 'input', topic: topic,
        stem: 'Số gồm <b>' + chuc2 + ' chục ' + dv2 + ' đơn vị</b> là số nào? (gõ số)',
        answer: String(ans2),
        explain: chuc2 + ' chục là ' + (chuc2 * 10) + ', thêm ' + dv2 + ' đơn vị được ' + ans2 + '.',
        say: 'số gồm ' + readNumberVi(chuc2) + ' chục ' + readNumberVi(dv2) + ' đơn vị là số nào?'
      };
    }

    // So sánh: điền dấu > < =
    if (kind === 'sosanh') {
      var a = randInt(0, 100), b;
      if (randInt(0, 2) === 0) b = a; else { do { b = a + randInt(-20, 20); } while (b < 0 || b > 100); }
      var sign = a > b ? '>' : (a < b ? '<' : '=');
      var mc3 = makeMC(sign, ['>', '<', '='], function (x) { return x; }, function () { return '='; }, 3);
      return {
        type: 'mc', topic: topic,
        stem: 'Điền dấu thích hợp: <b>' + a + ' ___ ' + b + '</b>',
        choices: mc3.choices, answer: mc3.answerIndex,
        explain: a + ' ' + sign + ' ' + b + (sign === '=' ? ' (hai số bằng nhau).' : '.'),
        say: readNumberVi(a) + ' ' + saySign(sign) + ' ' + readNumberVi(b) + ', vậy điền dấu nào?'
      };
    }

    // Số liền trước
    if (kind === 'lientruoc') {
      var n4 = randInt(1, 100);
      var ans4 = n4 - 1;
      return {
        type: 'input', topic: topic,
        stem: 'Số liền trước của <b>' + n4 + '</b> là số nào? (gõ số)',
        answer: String(ans4),
        explain: 'Số liền trước kém 1 đơn vị: ' + n4 + ' − 1 = ' + ans4 + '.',
        say: 'số liền trước của ' + readNumberVi(n4) + ' là số nào?'
      };
    }

    // Số liền sau
    if (kind === 'liensau') {
      var n5 = randInt(0, 99);
      var ans5 = n5 + 1;
      return {
        type: 'input', topic: topic,
        stem: 'Số liền sau của <b>' + n5 + '</b> là số nào? (gõ số)',
        answer: String(ans5),
        explain: 'Số liền sau hơn 1 đơn vị: ' + n5 + ' + 1 = ' + ans5 + '.',
        say: 'số liền sau của ' + readNumberVi(n5) + ' là số nào?'
      };
    }

    // Tròn chục: số tròn chục lớn nhất bé hơn N.
    if (kind === 'tronchuc') {
      var n6 = randInt(12, 99);
      while (n6 % 10 === 0) n6 = randInt(12, 99);   // tránh chính nó tròn chục
      var ans6 = Math.floor(n6 / 10) * 10;
      var dd6 = [ans6 + 10, ans6 - 10, n6].filter(function (v) { return v >= 0 && v <= 100; });
      var mc6 = makeMC(ans6, dd6, String, function (c, ex) {
        var v = c + pick([-20, -10, 10, 20]);
        return v >= 0 && v <= 100 ? v : c + 10;
      });
      return {
        type: 'mc', topic: topic,
        stem: 'Số tròn chục lớn nhất mà bé hơn <b>' + n6 + '</b> là số nào?',
        choices: mc6.choices, answer: mc6.answerIndex,
        explain: 'Các số tròn chục là 10, 20, 30... Số tròn chục lớn nhất còn bé hơn ' + n6 + ' là ' + ans6 + '.',
        say: 'số tròn chục lớn nhất mà bé hơn ' + readNumberVi(n6) + ' là số nào?'
      };
    }

    // Lớn nhất / bé nhất trong nhóm 3-4 số.
    if (kind === 'maxmin') {
      var cnt = randInt(3, 4);
      var nums = [];
      while (nums.length < cnt) {
        var x = randInt(0, 100);
        if (nums.indexOf(x) === -1) nums.push(x);
      }
      var wantMax = randInt(0, 1) === 1;
      var target = wantMax ? Math.max.apply(null, nums) : Math.min.apply(null, nums);
      var mc7 = makeMC(target, nums.slice(), String, numericPad, cnt);
      return {
        type: 'mc', topic: topic,
        stem: 'Số ' + (wantMax ? 'lớn nhất' : 'bé nhất') + ' trong các số <b>' + nums.join('; ') + '</b> là số nào?',
        choices: mc7.choices, answer: mc7.answerIndex,
        explain: 'So sánh các số, số ' + (wantMax ? 'lớn nhất' : 'bé nhất') + ' là ' + target + '.',
        say: 'trong các số ' + nums.map(readNumberVi).join(', ') + ', số ' + (wantMax ? 'lớn nhất' : 'bé nhất') + ' là số nào?'
      };
    }

    // Sắp xếp 3-4 số tăng/giảm -> nhập dãy.
    if (kind === 'sapxep') {
      var cnt2 = randInt(3, 4);
      var arr = [];
      while (arr.length < cnt2) {
        var y = randInt(0, 100);
        if (arr.indexOf(y) === -1) arr.push(y);
      }
      var asc = randInt(0, 1) === 1;
      var sorted = arr.slice().sort(function (p, q) { return asc ? p - q : q - p; });
      return {
        type: 'input', topic: topic,
        stem: 'Sắp xếp các số theo thứ tự ' + (asc ? 'từ bé đến lớn' : 'từ lớn đến bé') +
              ' (cách nhau bởi dấu cách hoặc dấu chấm phẩy): <b>' + arr.join('; ') + '</b>',
        answer: sorted.join(';'),
        explain: 'Thứ tự ' + (asc ? 'từ bé đến lớn' : 'từ lớn đến bé') + ': ' + sorted.join('; ') + '.',
        say: 'sắp xếp các số ' + arr.map(readNumberVi).join(', ') + ' theo thứ tự ' +
             (asc ? 'từ bé đến lớn' : 'từ lớn đến bé') + '.'
      };
    }

    // Số bé nhất / lớn nhất có hai chữ số.
    if (kind === 'haichuso') {
      var wantBig = randInt(0, 1) === 1;
      var ans8 = wantBig ? 99 : 10;
      return {
        type: 'input', topic: topic,
        stem: 'Số ' + (wantBig ? 'lớn nhất' : 'bé nhất') + ' có hai chữ số là số nào? (gõ số)',
        answer: String(ans8),
        explain: 'Số có hai chữ số nhỏ nhất là 10, lớn nhất là 99. Vậy đáp án là ' + ans8 + '.',
        say: 'số ' + (wantBig ? 'lớn nhất' : 'bé nhất') + ' có hai chữ số là số nào?'
      };
    }

    // Dạng SÁCH: liệt kê các số lớn hơn A và bé hơn B (3..5 số) -> nhập dãy.
    if (kind === 'lietke') {
      // Chọn cận sao cho khoảng MỞ (a, b) có 3..5 số nguyên: b - a - 1 in [3,5].
      var k = randInt(3, 5);                 // số phần tử cần liệt kê
      var aa = randInt(0, 100 - (k + 1));     // cận dưới
      var bb = aa + k + 1;                    // cận trên, chừa đúng k số ở giữa
      var list = [];
      for (var v = aa + 1; v < bb; v++) list.push(v);  // các số trong khoảng mở
      return {
        type: 'input', topic: topic,
        stem: 'Viết các số lớn hơn <b>' + aa + '</b> và bé hơn <b>' + bb +
              '</b> (cách nhau bởi dấu cách hoặc dấu chấm phẩy).',
        answer: list.join(';'),
        explain: 'Các số lớn hơn ' + aa + ' và bé hơn ' + bb + ' là: ' + list.join('; ') + '.',
        say: 'viết các số lớn hơn ' + readNumberVi(aa) + ' và bé hơn ' + readNumberVi(bb) + '.'
      };
    }

    // Đếm trong khoảng (giữ 1 dạng, count <= 5, khoảng nhỏ, KHÔNG tính hai đầu):
    // "có mấy số lớn hơn A và bé hơn B?"
    var lo = randInt(0, 100 - 7);
    var span = randInt(2, 6);          // b - a in [2,6] -> số ở giữa = span-1 in [1,5]
    var hi = lo + span;
    var count = hi - lo - 1;           // số nguyên trong khoảng mở (lo, hi)
    return {
      type: 'input', topic: topic,
      stem: 'Có mấy số lớn hơn <b>' + lo + '</b> và bé hơn <b>' + hi + '</b>? (gõ số)',
      answer: String(count),
      explain: 'Các số lớn hơn ' + lo + ' và bé hơn ' + hi + ' là từ ' + (lo + 1) + ' đến ' + (hi - 1) +
               ', đếm được ' + count + ' số.',
      say: 'có mấy số lớn hơn ' + readNumberVi(lo) + ' và bé hơn ' + readNumberVi(hi) + '?'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 2: CỘNG (trong phạm vi 100, gồm không nhớ và có nhớ)
   * ========================================================================== */
  function genCong() {
    var topic = 'cong';
    // Trộn mức độ: ≤10, ≤20, ≤40, ≤100
    var level = pick(['le10', 'le20', 'le40', 'le100']);
    var a, b;
    if (level === 'le10') { a = randInt(1, 9); b = randInt(0, 10 - a); }
    else if (level === 'le20') { a = randInt(2, 18); b = randInt(1, 20 - a); }
    else if (level === 'le40') { a = randInt(2, 38); b = randInt(1, 40 - a); }
    else { a = randInt(10, 95); b = randInt(1, 100 - a); }
    var ans = a + b;

    // Đa số input; thỉnh thoảng mc với nhiễu "quên nhớ", "lệch chục", "lệch 1".
    if (randInt(0, 3) === 0) {
      var dd = [ans - 10, ans + 10, ans - 1, ans + 1, ans - 9, ans + 9]
        .filter(function (v) { return v >= 0 && v <= 100 && v !== ans; });
      var mc = makeMC(ans, shuffle(dd), String, function (c, ex) {
        var v = c + pick([-2, -1, 1, 2, -10, 10]);
        return v >= 0 && v <= 100 ? v : c + 1;
      });
      return {
        type: 'mc', topic: topic,
        stem: 'Tính: <b>' + a + ' + ' + b + '</b>',
        choices: mc.choices, answer: mc.answerIndex,
        explain: a + ' + ' + b + ' = ' + ans + '.',
        say: readNumberVi(a) + ' cộng ' + readNumberVi(b) + ' bằng mấy?'
      };
    }
    return {
      type: 'input', topic: topic,
      stem: 'Tính: <b>' + a + ' + ' + b + ' = ?</b>',
      answer: String(ans),
      explain: a + ' + ' + b + ' = ' + ans + '.',
      say: readNumberVi(a) + ' cộng ' + readNumberVi(b) + ' bằng mấy?'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 3: TRỪ (trong phạm vi 100, không nhớ & có nhớ, kết quả >= 0)
   * ========================================================================== */
  function genTru() {
    var topic = 'tru';
    var level = pick(['le10', 'le20', 'le40', 'le100']);
    var a, b;
    if (level === 'le10') { a = randInt(1, 10); b = randInt(0, a); }
    else if (level === 'le20') { a = randInt(2, 20); b = randInt(1, a); }
    else if (level === 'le40') { a = randInt(5, 40); b = randInt(1, a); }
    else { a = randInt(20, 100); b = randInt(1, a); }
    var ans = a - b;

    if (randInt(0, 3) === 0) {
      var dd = [ans + 10, ans - 10, ans + 1, ans - 1, a + b, ans + 9]
        .filter(function (v) { return v >= 0 && v <= 100 && v !== ans; });
      var mc = makeMC(ans, shuffle(dd), String, function (c, ex) {
        var v = c + pick([-2, -1, 1, 2, -10, 10]);
        return v >= 0 && v <= 100 ? v : c + 1;
      });
      return {
        type: 'mc', topic: topic,
        stem: 'Tính: <b>' + a + ' − ' + b + '</b>',
        choices: mc.choices, answer: mc.answerIndex,
        explain: a + ' − ' + b + ' = ' + ans + '.',
        say: readNumberVi(a) + ' trừ ' + readNumberVi(b) + ' bằng mấy?'
      };
    }
    return {
      type: 'input', topic: topic,
      stem: 'Tính: <b>' + a + ' − ' + b + ' = ?</b>',
      answer: String(ans),
      explain: a + ' − ' + b + ' = ' + ans + '.',
      say: readNumberVi(a) + ' trừ ' + readNumberVi(b) + ' bằng mấy?'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 4: TÍNH DÃY & ĐIỀN SỐ
   * ========================================================================== */
  function genTinhDay() {
    var topic = 'tinh-day';
    // 'sosanh-pheptinh' (so sánh hai vế đều là phép tính) là dạng KHÓ -> tỷ trọng thấp.
    var kind = pick(['day3', 'day3', 'day3', 'dien', 'dien', 'dien', 'sosanh-pheptinh']);

    // Dãy 3 số: a+b+c, a+b-c, a-b-c ; kết quả 0..100, các bước >= 0.
    if (kind === 'day3') {
      var form = pick(['abc+', 'ab+c-', 'ab-c-']);
      var a, b, c, ans, stem, says;
      if (form === 'abc+') {
        a = randInt(1, 40); b = randInt(1, 40);
        c = randInt(1, Math.max(1, 100 - a - b));
        ans = a + b + c;
        stem = a + ' + ' + b + ' + ' + c;
        says = readNumberVi(a) + ' cộng ' + readNumberVi(b) + ' cộng ' + readNumberVi(c);
      } else if (form === 'ab+c-') {
        a = randInt(1, 50); b = randInt(1, Math.max(1, 100 - a));
        c = randInt(0, a + b); // bảo đảm >= 0
        ans = a + b - c;
        stem = a + ' + ' + b + ' − ' + c;
        says = readNumberVi(a) + ' cộng ' + readNumberVi(b) + ' trừ ' + readNumberVi(c);
      } else { // ab-c-
        a = randInt(10, 100);
        b = randInt(0, a);
        c = randInt(0, a - b); // bảo đảm >= 0
        ans = a - b - c;
        stem = a + ' − ' + b + ' − ' + c;
        says = readNumberVi(a) + ' trừ ' + readNumberVi(b) + ' trừ ' + readNumberVi(c);
      }
      return {
        type: 'input', topic: topic,
        stem: 'Tính: <b>' + stem + ' = ?</b>',
        answer: String(ans),
        explain: stem + ' = ' + ans + ' (tính lần lượt từ trái sang phải).',
        say: says + ' bằng mấy?'
      };
    }

    // Điền số vào ô trống: "? + 3 = 10", "7 + 2 − ? = 5", "10 − ? = 4"
    if (kind === 'dien') {
      var t = pick(['?+a=s', 'a+?=s', '?-a=d', 'a-?=d', 'a+b-?=s']);
      var a, b, s, ans, stem, says;
      if (t === '?+a=s') {
        ans = randInt(0, 90); a = randInt(0, 100 - ans); s = ans + a;
        stem = '? + ' + a + ' = ' + s;
        says = 'mấy cộng ' + readNumberVi(a) + ' bằng ' + readNumberVi(s) + '?';
      } else if (t === 'a+?=s') {
        a = randInt(0, 90); ans = randInt(0, 100 - a); s = a + ans;
        stem = a + ' + ? = ' + s;
        says = readNumberVi(a) + ' cộng mấy bằng ' + readNumberVi(s) + '?';
      } else if (t === '?-a=d') {
        a = randInt(0, 50); var d = randInt(0, 100 - a); ans = a + d; s = d;
        stem = '? − ' + a + ' = ' + d;
        says = 'mấy trừ ' + readNumberVi(a) + ' bằng ' + readNumberVi(d) + '?';
      } else if (t === 'a-?=d') {
        a = randInt(1, 100); var d2 = randInt(0, a); ans = a - d2; s = d2;
        stem = a + ' − ? = ' + d2;
        says = readNumberVi(a) + ' trừ mấy bằng ' + readNumberVi(d2) + '?';
      } else { // a+b-?=s  -> tìm ?
        a = randInt(1, 50); b = randInt(1, Math.max(1, 60 - a));
        ans = randInt(0, a + b); s = a + b - ans;
        stem = a + ' + ' + b + ' − ? = ' + s;
        says = readNumberVi(a) + ' cộng ' + readNumberVi(b) + ' trừ mấy bằng ' + readNumberVi(s) + '?';
      }
      return {
        type: 'input', topic: topic,
        stem: 'Điền số thích hợp vào ô trống: <b>' + stem + '</b> (gõ số)',
        answer: String(ans),
        explain: 'Số cần điền là ' + ans + ' (thay vào: ' + stem.replace('?', ans) + ', đúng).',
        say: says
      };
    }

    // So sánh hai phép tính bằng > < = : "40 + 8 ___ 48"
    var ka = randInt(0, 60), kb = randInt(0, 100 - ka);
    var left = ka + kb;
    // Vế phải: ưu tiên là MỘT SỐ (so phép tính với số) cho dễ; hai phép tính (plus/minus)
    // hiếm hơn vì đó là dạng khó nhất.
    var rForm = pick(['num', 'num', 'num', 'plus', 'minus']);
    var rc, rd, right, rightStem, rightSay;
    if (rForm === 'plus') {
      rc = randInt(0, 60); rd = randInt(0, 100 - rc); right = rc + rd;
      rightStem = rc + ' + ' + rd; rightSay = readNumberVi(rc) + ' cộng ' + readNumberVi(rd);
    } else if (rForm === 'minus') {
      rc = randInt(0, 100); rd = randInt(0, rc); right = rc - rd;
      rightStem = rc + ' − ' + rd; rightSay = readNumberVi(rc) + ' trừ ' + readNumberVi(rd);
    } else {
      right = randInt(0, 100); rightStem = String(right); rightSay = readNumberVi(right);
    }
    var sign = left > right ? '>' : (left < right ? '<' : '=');
    var mc = makeMC(sign, ['>', '<', '='], function (x) { return x; }, function () { return '='; }, 3);
    return {
      type: 'mc', topic: topic,
      stem: 'Điền dấu thích hợp: <b>' + ka + ' + ' + kb + ' ___ ' + rightStem + '</b>',
      choices: mc.choices, answer: mc.answerIndex,
      explain: ka + ' + ' + kb + ' = ' + left + (rForm === 'num' ? '' : ', ' + rightStem + ' = ' + right) +
               '. Vì ' + left + ' ' + sign + ' ' + right + ' nên điền dấu "' + sign + '".',
      say: readNumberVi(ka) + ' cộng ' + readNumberVi(kb) + ' so với ' + rightSay + ', điền dấu nào?'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 5: ĐO ĐỘ DÀI (cm)
   * ========================================================================== */
  function genDoDai() {
    var topic = 'do-dai';
    var kind = pick(['sosanh', 'cong', 'tru', 'catday']);

    // So sánh hai đoạn thẳng: hơn/kém mấy cm.
    if (kind === 'sosanh') {
      var p = randInt(2, 40), q = randInt(2, 40);
      while (q === p) q = randInt(2, 40);
      var longer = Math.max(p, q), shorter = Math.min(p, q);
      var diff = longer - shorter;
      var dd = [p + q, diff + 1, diff - 1, longer].filter(function (v) { return v >= 0 && v !== diff; });
      var mc = makeMC(diff, dd, String, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Đoạn thẳng AB dài <b>' + p + ' cm</b>, đoạn thẳng CD dài <b>' + q +
              ' cm</b>. Hai đoạn thẳng hơn kém nhau mấy cm?',
        choices: mc.choices, answer: mc.answerIndex,
        explain: 'Lấy đoạn dài trừ đoạn ngắn: ' + longer + ' − ' + shorter + ' = ' + diff + ' cm.',
        say: 'đoạn a bê dài ' + readNumberVi(p) + ' xăng ti mét, đoạn xê đê dài ' + readNumberVi(q) +
             ' xăng ti mét, hai đoạn thẳng hơn kém nhau mấy xăng ti mét?'
      };
    }

    // Cộng độ dài: nối hai đoạn.
    if (kind === 'cong') {
      var a = randInt(2, 50), b = randInt(2, 100 - a);
      var ans = a + b;
      return {
        type: 'input', topic: topic,
        stem: 'Nối hai đoạn dây dài <b>' + a + ' cm</b> và <b>' + b +
              ' cm</b> lại với nhau. Sợi dây mới dài bao nhiêu cm? (gõ số)',
        answer: String(ans),
        explain: a + ' + ' + b + ' = ' + ans + ' (cm).',
        say: 'nối hai đoạn dây dài ' + readNumberVi(a) + ' xăng ti mét và ' + readNumberVi(b) +
             ' xăng ti mét, sợi dây mới dài bao nhiêu xăng ti mét?'
      };
    }

    // Trừ độ dài.
    if (kind === 'tru') {
      var a2 = randInt(10, 100), b2 = randInt(2, a2);
      var ans2 = a2 - b2;
      return {
        type: 'input', topic: topic,
        stem: 'Một đoạn thẳng dài <b>' + a2 + ' cm</b>, một đoạn khác dài <b>' + b2 +
              ' cm</b>. Đoạn thứ nhất dài hơn đoạn thứ hai bao nhiêu cm? (gõ số)',
        answer: String(ans2),
        explain: a2 + ' − ' + b2 + ' = ' + ans2 + ' (cm).',
        say: 'một đoạn dài ' + readNumberVi(a2) + ' xăng ti mét, một đoạn dài ' + readNumberVi(b2) +
             ' xăng ti mét, đoạn thứ nhất dài hơn đoạn thứ hai bao nhiêu xăng ti mét?'
      };
    }

    // Cắt dây: dây dài N cắt đoạn M, còn lại ?
    var len = randInt(10, 100), cut = randInt(2, len - 1);
    var ans3 = len - cut;
    return {
      type: 'input', topic: topic,
      stem: 'Sợi dây dài <b>' + len + ' cm</b>, cắt đi một đoạn dài <b>' + cut +
            ' cm</b>. Đoạn dây còn lại dài bao nhiêu cm? (gõ số)',
      answer: String(ans3),
      explain: len + ' − ' + cut + ' = ' + ans3 + ' (cm).',
      say: 'sợi dây dài ' + readNumberVi(len) + ' xăng ti mét, cắt đi ' + readNumberVi(cut) +
           ' xăng ti mét, đoạn còn lại dài bao nhiêu xăng ti mét?'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 6: GIỜ ĐÚNG & TUẦN LỄ
   * ========================================================================== */
  function genGioTuan() {
    var topic = 'gio-tuan';
    // Tỷ trọng: ưu tiên các dạng LÕI (đọc đồng hồ, thứ trong tuần).
    // Dạng đổi giờ 24h (buoi-doi) để THẤP và chỉ dùng mốc quen + có gợi ý.
    var kind = pick([
      'kim-ngan', 'kim-ngan', 'kim-ngan',          // đọc kim ngắn (lõi)
      'kim-dai', 'kim-dai', 'kim-dai',             // đọc kim dài (lõi)
      'thu-mai', 'thu-mai', 'thu-mai',             // thứ ngày mai (lõi)
      'nhan-buoi', 'nhan-buoi',                    // NHẬN BIẾT buổi từ giờ 24h
      'thu-sau',                                   // mấy ngày sau (1..3)
      'khoang-gio',                                // khoảng thời gian (dur<=4)
      'buoi-doi'                                   // đổi số 24h (chỉ mốc quen, có gợi ý)
    ]);

    // Đồng hồ chỉ N giờ đúng thì kim ngắn (kim giờ) chỉ số mấy?
    if (kind === 'kim-ngan') {
      var h = randInt(1, 12);
      var dd = [h === 12 ? 1 : h + 1, h === 1 ? 12 : h - 1, (h % 12) + 1].filter(function (v) { return v !== h; });
      var mc = makeMC(h, dd, String, function (c, ex) {
        var v = randInt(1, 12);
        return v;
      });
      return {
        type: 'mc', topic: topic,
        stem: 'Đồng hồ chỉ <b>' + h + ' giờ đúng</b> thì kim ngắn (kim giờ) chỉ vào số mấy?',
        choices: mc.choices, answer: mc.answerIndex,
        explain: 'Lúc ' + h + ' giờ đúng, kim ngắn chỉ vào số ' + h + '.',
        say: 'đồng hồ chỉ ' + readNumberVi(h) + ' giờ đúng thì kim ngắn chỉ vào số mấy?'
      };
    }

    // Lúc giờ đúng thì kim dài (kim phút) chỉ số mấy? -> luôn số 12.
    if (kind === 'kim-dai') {
      var h2 = randInt(1, 12);
      var dd2 = [h2, 6, 3, 1].filter(function (v) { return v !== 12; });
      var mc2 = makeMC(12, dd2, String, function () { return randInt(1, 11); });
      return {
        type: 'mc', topic: topic,
        stem: 'Khi đồng hồ chỉ <b>' + h2 + ' giờ đúng</b> thì kim dài (kim phút) chỉ vào số mấy?',
        choices: mc2.choices, answer: mc2.answerIndex,
        explain: 'Lúc giờ đúng, kim dài luôn chỉ vào số 12.',
        say: 'khi đồng hồ chỉ ' + readNumberVi(h2) + ' giờ đúng thì kim dài chỉ vào số mấy?'
      };
    }

    // NHẬN BIẾT BUỔI: cho giờ hệ 24h, hỏi đó là buổi nào (sáng/trưa/chiều/tối).
    // Không bắt trẻ tính toán, chỉ nhận biết theo nếp sinh hoạt quen thuộc.
    if (kind === 'nhan-buoi') {
      // Mỗi mốc gắn 1 buổi rõ ràng, dễ liên hệ với bé.
      var buois = [
        { h: 7, b: 'buổi sáng' }, { h: 8, b: 'buổi sáng' }, { h: 9, b: 'buổi sáng' },
        { h: 11, b: 'buổi trưa' }, { h: 12, b: 'buổi trưa' },
        { h: 14, b: 'buổi chiều' }, { h: 15, b: 'buổi chiều' }, { h: 16, b: 'buổi chiều' }, { h: 17, b: 'buổi chiều' },
        { h: 19, b: 'buổi tối' }, { h: 20, b: 'buổi tối' }, { h: 21, b: 'buổi tối' }
      ];
      var bt = pick(buois);
      var BUOI = ['buổi sáng', 'buổi trưa', 'buổi chiều', 'buổi tối'];
      var ddB = BUOI.filter(function (x) { return x !== bt.b; });
      var mcB = makeMC(bt.b, ddB, function (x) { return x; }, function () { return pick(BUOI); });
      return {
        type: 'mc', topic: topic,
        stem: '<b>' + bt.h + ' giờ</b> là buổi nào trong ngày?',
        choices: mcB.choices, answer: mcB.answerIndex,
        explain: bt.h + ' giờ là ' + bt.b + '.',
        say: readNumberVi(bt.h) + ' giờ là buổi nào trong ngày?'
      };
    }

    // ĐỔI SỐ 24h -> giờ chiều: CHỈ dùng mốc quen (13->1, 14->2, 18->6) và có gợi ý.
    // Tỷ trọng thấp; gợi ý "13 giờ = 12 giờ trưa và 1 giờ nữa" ngay trong đề.
    if (kind === 'buoi-doi') {
      var moc = pick([
        { h: 13, a: 1 }, { h: 14, a: 2 }, { h: 18, a: 6 }
      ]);
      var h3 = moc.h, ans3 = moc.a;
      var dd3 = [ans3 + 1, ans3 - 1, h3].filter(function (v) { return v > 0 && v <= 12 && v !== ans3; });
      var mc3 = makeMC(ans3, dd3, String, function () { return randInt(1, 12); });
      return {
        type: 'mc', topic: topic,
        stem: '<b>' + h3 + ' giờ</b> là mấy giờ chiều? <i>(' + h3 + ' giờ = 12 giờ trưa và ' + ans3 + ' giờ nữa)</i>',
        choices: mc3.choices, answer: mc3.answerIndex,
        explain: 'Sau 12 giờ trưa thêm ' + ans3 + ' giờ là ' + h3 + ' giờ. Vậy ' + h3 + ' giờ là ' + ans3 + ' giờ chiều.',
        say: readNumberVi(h3) + ' giờ là mấy giờ chiều?'
      };
    }

    // Thứ: hôm nay thứ X, ngày mai là thứ mấy?
    if (kind === 'thu-mai') {
      var idx = randInt(0, 6);
      var ansIdx = (idx + 1) % 7;
      var dd5 = [WEEKDAYS[(idx + 2) % 7], WEEKDAYS[(idx + 6) % 7], WEEKDAYS[idx]];
      var mc5 = makeMC(WEEKDAYS[ansIdx], dd5, function (x) { return x; }, function () {
        return WEEKDAYS[randInt(0, 6)];
      });
      return {
        type: 'mc', topic: topic,
        stem: 'Hôm nay là <b>' + WEEKDAYS[idx] + '</b>, vậy ngày mai là thứ mấy?',
        choices: mc5.choices, answer: mc5.answerIndex,
        explain: 'Sau ' + WEEKDAYS[idx] + ' một ngày là ' + WEEKDAYS[ansIdx] + '.',
        say: 'hôm nay là ' + WEEKDAYS_SAY[idx] + ', ngày mai là thứ mấy?'
      };
    }

    // Thứ: N ngày sau thứ X là thứ mấy? (N nhỏ 1..3 cho vừa sức bé)
    if (kind === 'thu-sau') {
      var idx2 = randInt(0, 6);
      var add = randInt(1, 3);
      var ansIdx2 = (idx2 + add) % 7;
      var dd6 = [WEEKDAYS[(ansIdx2 + 1) % 7], WEEKDAYS[(ansIdx2 + 6) % 7], WEEKDAYS[idx2]];
      var mc6 = makeMC(WEEKDAYS[ansIdx2], dd6, function (x) { return x; }, function () {
        return WEEKDAYS[randInt(0, 6)];
      });
      return {
        type: 'mc', topic: topic,
        stem: '<b>' + add + ' ngày sau</b> ' + WEEKDAYS[idx2] + ' là thứ mấy?',
        choices: mc6.choices, answer: mc6.answerIndex,
        explain: 'Đếm tiếp ' + add + ' ngày từ ' + WEEKDAYS[idx2] + ' được ' + WEEKDAYS[ansIdx2] + '.',
        say: readNumberVi(add) + ' ngày sau ' + WEEKDAYS_SAY[idx2] + ' là thứ mấy?'
      };
    }

    // Khoảng thời gian giờ đúng: bắt đầu A giờ, làm K giờ, xong lúc mấy giờ?
    // Giới hạn thời lượng <= 4 giờ cho tự nhiên, vừa sức bé.
    var start = randInt(1, 8);
    var maxDur = Math.min(4, 12 - start);
    if (maxDur < 1) maxDur = 1;
    var dur = randInt(1, maxDur);
    var end = start + dur;
    var dd7 = [end + 1, end - 1, dur].filter(function (v) { return v > 0 && v <= 24 && v !== end; });
    var mc7 = makeMC(end, dd7, String, numericPad);
    return {
      type: 'mc', topic: topic,
      stem: 'Bé bắt đầu học lúc <b>' + start + ' giờ</b>, học trong <b>' + dur +
            ' giờ</b>. Bé học xong lúc mấy giờ?',
      choices: mc7.choices, answer: mc7.answerIndex,
      explain: start + ' + ' + dur + ' = ' + end + '. Bé học xong lúc ' + end + ' giờ.',
      say: 'bé bắt đầu học lúc ' + readNumberVi(start) + ' giờ, học trong ' + readNumberVi(dur) +
           ' giờ, bé học xong lúc mấy giờ?'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 7: TOÁN CÓ LỜI VĂN (một bước)
   * ========================================================================== */
  function genLoiVan() {
    var topic = 'loi-van';
    var kind = pick(['them', 'bot', 'nhieuhon', 'ithon', 'gop', 'tach']);
    var name = pick(PROPER_NAMES);
    var name2 = pick(PROPER_NAMES.filter(function (x) { return x !== name; }));
    var obj = pick(OBJS);

    // Thêm: có a, được cho/mua thêm b.
    if (kind === 'them') {
      var a = randInt(2, 50), b = randInt(1, 100 - a);
      var ans = a + b;
      return {
        type: 'input', topic: topic,
        stem: name + ' có <b>' + a + ' ' + obj.d + '</b>, được tặng thêm <b>' + b + ' ' + obj.d +
              '</b>. Hỏi ' + name + ' có tất cả bao nhiêu ' + obj.d + '? (gõ số)',
        answer: String(ans),
        explain: 'Thêm vào thì lấy cộng: ' + a + ' + ' + b + ' = ' + ans + ' ' + obj.dv + '.',
        say: name + ' có ' + readNumberVi(a) + ' ' + obj.d + ', được tặng thêm ' + readNumberVi(b) +
             ' ' + obj.d + ', hỏi ' + name + ' có tất cả bao nhiêu ' + obj.d + '?'
      };
    }

    // Bớt: có a, cho/ăn bớt b.
    if (kind === 'bot') {
      var a2 = randInt(5, 100), b2 = randInt(1, a2);
      var ans2 = a2 - b2;
      return {
        type: 'input', topic: topic,
        stem: name + ' có <b>' + a2 + ' ' + obj.d + '</b>, cho bạn <b>' + b2 + ' ' + obj.d +
              '</b>. Hỏi ' + name + ' còn lại bao nhiêu ' + obj.d + '? (gõ số)',
        answer: String(ans2),
        explain: 'Cho bớt đi thì lấy trừ: ' + a2 + ' − ' + b2 + ' = ' + ans2 + ' ' + obj.dv + '.',
        say: name + ' có ' + readNumberVi(a2) + ' ' + obj.d + ', cho bạn ' + readNumberVi(b2) +
             ' ' + obj.d + ', hỏi ' + name + ' còn lại bao nhiêu ' + obj.d + '?'
      };
    }

    // Nhiều hơn: A có a, B nhiều hơn A là m.
    if (kind === 'nhieuhon') {
      var a3 = randInt(2, 70), m = randInt(1, 100 - a3);
      var ans3 = a3 + m;
      return {
        type: 'input', topic: topic,
        stem: name + ' có <b>' + a3 + ' ' + obj.d + '</b>. ' + name2 + ' có nhiều hơn ' + name + ' <b>' + m +
              ' ' + obj.d + '</b>. Hỏi ' + name2 + ' có bao nhiêu ' + obj.d + '? (gõ số)',
        answer: String(ans3),
        explain: 'Nhiều hơn thì lấy cộng: ' + a3 + ' + ' + m + ' = ' + ans3 + ' ' + obj.dv + '.',
        say: name + ' có ' + readNumberVi(a3) + ' ' + obj.d + ', ' + name2 + ' có nhiều hơn ' + name +
             ' ' + readNumberVi(m) + ' ' + obj.d + ', hỏi ' + name2 + ' có bao nhiêu ' + obj.d + '?'
      };
    }

    // Ít hơn: A có a, B ít hơn A là m.
    if (kind === 'ithon') {
      var a4 = randInt(10, 100), m2 = randInt(1, a4);
      var ans4 = a4 - m2;
      return {
        type: 'input', topic: topic,
        stem: name + ' có <b>' + a4 + ' ' + obj.d + '</b>. ' + name2 + ' có ít hơn ' + name + ' <b>' + m2 +
              ' ' + obj.d + '</b>. Hỏi ' + name2 + ' có bao nhiêu ' + obj.d + '? (gõ số)',
        answer: String(ans4),
        explain: 'Ít hơn thì lấy trừ: ' + a4 + ' − ' + m2 + ' = ' + ans4 + ' ' + obj.dv + '.',
        say: name + ' có ' + readNumberVi(a4) + ' ' + obj.d + ', ' + name2 + ' có ít hơn ' + name +
             ' ' + readNumberVi(m2) + ' ' + obj.d + ', hỏi ' + name2 + ' có bao nhiêu ' + obj.d + '?'
      };
    }

    // Gộp: hai nhóm gộp lại.
    if (kind === 'gop') {
      var a5 = randInt(2, 50), b5 = randInt(2, 100 - a5);
      var ans5 = a5 + b5;
      return {
        type: 'input', topic: topic,
        stem: name + ' có <b>' + a5 + ' ' + obj.d + '</b>, ' + name2 + ' có <b>' + b5 + ' ' + obj.d +
              '</b>. Hỏi cả hai bạn có tất cả bao nhiêu ' + obj.d + '? (gõ số)',
        answer: String(ans5),
        explain: 'Gộp lại thì lấy cộng: ' + a5 + ' + ' + b5 + ' = ' + ans5 + ' ' + obj.dv + '.',
        say: name + ' có ' + readNumberVi(a5) + ' ' + obj.d + ', ' + name2 + ' có ' + readNumberVi(b5) +
             ' ' + obj.d + ', hỏi cả hai bạn có tất cả bao nhiêu ' + obj.d + '?'
      };
    }

    // Tách: tổng a, một phần b, tìm phần còn lại.
    var total = randInt(6, 100), part = randInt(1, total - 1);
    var ans6 = total - part;
    return {
      type: 'input', topic: topic,
      stem: name + ' có <b>' + total + ' ' + obj.d + '</b>, trong đó có <b>' + part + ' ' + obj.d +
            '</b> màu đỏ, còn lại màu xanh. Hỏi có bao nhiêu ' + obj.d + ' màu xanh? (gõ số)',
      answer: String(ans6),
      explain: 'Lấy tổng trừ phần đã biết: ' + total + ' − ' + part + ' = ' + ans6 + ' ' + obj.dv + '.',
      say: name + ' có ' + readNumberVi(total) + ' ' + obj.d + ', trong đó ' + readNumberVi(part) +
           ' ' + obj.d + ' màu đỏ, còn lại màu xanh, hỏi có bao nhiêu ' + obj.d + ' màu xanh?'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 8: PHÁT TRIỂN TƯ DUY
   * ========================================================================== */
  function genTuDuy() {
    var topic = 'tu-duy';
    var kind = pick(['dayso-cong', 'dayso-tru', 'lapso-max', 'lapso-min', 'timso']);

    // Dãy số cộng đều.
    if (kind === 'dayso-cong') {
      var d = randInt(1, 9);
      var start = randInt(0, 20);
      var seq = [start, start + d, start + 2 * d, start + 3 * d];
      var next = start + 4 * d;
      while (next > 100) { // giữ <= 100
        d = randInt(1, 5); start = randInt(0, 10);
        seq = [start, start + d, start + 2 * d, start + 3 * d];
        next = start + 4 * d;
      }
      return {
        type: 'input', topic: topic,
        stem: 'Tìm số tiếp theo của dãy: <b>' + seq.join('; ') + '; ...</b> (gõ số)',
        answer: String(next),
        explain: 'Mỗi số hơn số trước ' + d + ' đơn vị. Số tiếp theo là ' + seq[3] + ' + ' + d + ' = ' + next + '.',
        say: 'tìm số tiếp theo của dãy ' + seq.map(readNumberVi).join(', ') + '.'
      };
    }

    // Dãy số trừ đều.
    if (kind === 'dayso-tru') {
      var d2 = randInt(1, 9);
      var start2 = randInt(3 * d2 + 1, 100); // bảo đảm số cuối > 0
      var seq2 = [start2, start2 - d2, start2 - 2 * d2, start2 - 3 * d2];
      var next2 = start2 - 4 * d2;
      var guard = 0;
      while (next2 < 0 && guard < 50) {
        guard++;
        d2 = randInt(1, 9); start2 = randInt(4 * d2, 100);
        seq2 = [start2, start2 - d2, start2 - 2 * d2, start2 - 3 * d2];
        next2 = start2 - 4 * d2;
      }
      return {
        type: 'input', topic: topic,
        stem: 'Tìm số tiếp theo của dãy: <b>' + seq2.join('; ') + '; ...</b> (gõ số)',
        answer: String(next2),
        explain: 'Mỗi số kém số trước ' + d2 + ' đơn vị. Số tiếp theo là ' + seq2[3] + ' − ' + d2 + ' = ' + next2 + '.',
        say: 'tìm số tiếp theo của dãy ' + seq2.map(readNumberVi).join(', ') + '.'
      };
    }

    // Lập số có hai chữ số lớn nhất / bé nhất từ các thẻ chữ số.
    if (kind === 'lapso-max' || kind === 'lapso-min') {
      var wantMax = (kind === 'lapso-max');
      // chọn 2 hoặc 3 thẻ chữ số khác nhau; có thể chứa 0 (0 không đứng đầu).
      var cnt = randInt(2, 3);
      var digits = [];
      while (digits.length < cnt) {
        var dg = randInt(0, 9);
        if (digits.indexOf(dg) === -1) digits.push(dg);
      }
      // Bảo đảm có ít nhất 1 chữ số khác 0 để lập được số hai chữ số.
      if (digits.every(function (x) { return x === 0; })) digits[0] = randInt(1, 9);
      // Với 'lapso-max': nếu bộ thẻ 2 số chứa 0 thì số lớn nhất = số bé nhất (vd 0,5 -> chỉ 50).
      // Khi đó dùng 3 thẻ để vẫn có lựa chọn thực sự (tránh đáp án trùng vô nghĩa).
      if (wantMax && digits.length === 2 && digits.indexOf(0) !== -1) {
        while (digits.length < 3) {
          var dg2 = randInt(1, 9);
          if (digits.indexOf(dg2) === -1) digits.push(dg2);
        }
      }
      var sortedDesc = digits.slice().sort(function (a, b) { return b - a; });
      var sortedAsc = digits.slice().sort(function (a, b) { return a - b; });
      var ans, expl;
      if (wantMax) {
        // số lớn nhất: chục là chữ số lớn nhất, đơn vị là chữ số lớn nhì.
        ans = sortedDesc[0] * 10 + sortedDesc[1];
        expl = 'Để số lớn nhất: chữ số lớn nhất (' + sortedDesc[0] + ') ở hàng chục, ' +
               'chữ số lớn nhì (' + sortedDesc[1] + ') ở hàng đơn vị, được ' + ans + '.';
      } else {
        // số bé nhất: chục là chữ số bé nhất KHÁC 0, đơn vị là chữ số bé nhất còn lại.
        var nonZero = sortedAsc.filter(function (x) { return x !== 0; });
        var tens = nonZero[0];
        var rest = digits.slice();
        rest.splice(rest.indexOf(tens), 1);
        var units = rest.sort(function (a, b) { return a - b; })[0];
        ans = tens * 10 + units;
        expl = 'Để số bé nhất, hàng chục không được là 0: chọn chữ số bé nhất khác 0 (' + tens +
               ') ở hàng chục, chữ số bé nhất còn lại (' + units + ') ở hàng đơn vị, được ' + ans + '.';
      }
      return {
        type: 'input', topic: topic,
        stem: 'Từ các thẻ chữ số <b>' + digits.join(', ') +
              '</b> (mỗi thẻ dùng một lần), hãy lập số có hai chữ số ' +
              (wantMax ? 'lớn nhất' : 'bé nhất') + '. (gõ số)',
        answer: String(ans),
        explain: expl,
        say: 'từ các chữ số ' + digits.map(readNumberVi).join(', ') + ', lập số có hai chữ số ' +
             (wantMax ? 'lớn nhất' : 'bé nhất') + '.'
      };
    }

    // Tìm số: "số nào cộng 20 được 50?" / "số nào trừ 10 được 8?"
    var t = pick(['cong', 'tru']);
    var x, a, res, stem, says;
    if (t === 'cong') {
      a = randInt(5, 60); x = randInt(0, 100 - a); res = x + a;
      stem = 'Số nào cộng với ' + a + ' thì được ' + res + '?';
      says = 'số nào cộng với ' + readNumberVi(a) + ' thì được ' + readNumberVi(res) + '?';
    } else {
      x = randInt(10, 100); a = randInt(1, x); res = x - a;
      stem = 'Số nào trừ đi ' + a + ' thì được ' + res + '?';
      says = 'số nào trừ đi ' + readNumberVi(a) + ' thì được ' + readNumberVi(res) + '?';
    }
    return {
      type: 'input', topic: topic,
      stem: '<b>' + stem + '</b> (gõ số)',
      answer: String(x),
      explain: t === 'cong'
        ? 'Lấy ' + res + ' − ' + a + ' = ' + x + '. Thử lại: ' + x + ' + ' + a + ' = ' + res + '.'
        : 'Lấy ' + res + ' + ' + a + ' = ' + x + '. Thử lại: ' + x + ' − ' + a + ' = ' + res + '.',
      say: says
    };
  }

  /* ============================================================================
   *  ĐĂNG KÝ CHỦ ĐỀ + API
   * ========================================================================== */
  var topics = [
    { id: 'so-100', name: 'Số đến 100', emoji: '🔢', gen: genSo100 },
    { id: 'cong', name: 'Phép cộng', emoji: '➕', gen: genCong },
    { id: 'tru', name: 'Phép trừ', emoji: '➖', gen: genTru },
    { id: 'tinh-day', name: 'Tính dãy & Điền số', emoji: '🧮', gen: genTinhDay },
    { id: 'do-dai', name: 'Đo độ dài', emoji: '📏', gen: genDoDai },
    { id: 'gio-tuan', name: 'Xem giờ & Tuần lễ', emoji: '🕐', gen: genGioTuan },
    { id: 'loi-van', name: 'Toán có lời văn', emoji: '📝', gen: genLoiVan },
    { id: 'tu-duy', name: 'Phát triển tư duy', emoji: '🧠', gen: genTuDuy }
  ];

  var topicMap = {};
  topics.forEach(function (t) { topicMap[t.id] = t; });

  function generate(topicId) {
    var t = topicMap[topicId];
    if (!t) throw new Error('Không tìm thấy chủ đề: ' + topicId);
    return t.gen();
  }

  function generateMixed(n) {
    n = n || 10;
    var out = [];
    for (var i = 0; i < n; i++) {
      out.push(generate(pick(topics).id));
    }
    return out;
  }

  /* ----------------------------- CHUẨN HOÁ & CHECK ----------------------------- */
  // Chuẩn hoá đáp án người dùng: bỏ khoảng trắng/dấu nghìn, hạ chữ thường,
  // chuẩn hoá dấu phân cách dãy.
  function normalize(s) {
    if (s === null || s === undefined) return '';
    var str = String(s).trim().toLowerCase();
    // Bỏ dấu phân nhóm nghìn (chấm/phẩy giữa các chữ số).
    str = str.replace(/(\d)[.,](?=\d)/g, '$1');
    // Ngăn cách dãy số: dấu ; , hoặc khoảng trắng giữa các cụm -> ';'
    str = str.replace(/\s*[;,]\s*/g, ';').replace(/\s+/g, ';');
    return str;
  }

  // Chuẩn hoá riêng cho đáp án dạng MỘT số nguyên: bỏ mọi dấu phân nhóm.
  function normalizeNumeric(s) {
    return String(s == null ? '' : s).trim().toLowerCase().replace(/[\s.,]/g, '');
  }

  // Chuẩn hoá riêng cho đáp án dạng DÃY SỐ: tách phần tử theo ; , hoặc khoảng trắng,
  // mỗi phần tử chỉ giữ chữ số.
  function normalizeSeq(s) {
    return String(s == null ? '' : s).trim().toLowerCase()
      .split(/[;,\s]+/)
      .filter(function (x) { return x.length; })
      .map(function (x) { return x.replace(/\D/g, ''); })
      .filter(function (x) { return x.length; })
      .join(';');
  }

  // So sánh đáp án input: thử cả số nguyên thuần & dạng dãy/chữ.
  function matchInput(answer, userInput) {
    // Đáp án là DÃY (chứa ';'): so theo từng phần tử.
    if (String(answer).indexOf(';') !== -1) {
      return normalizeSeq(userInput) === normalizeSeq(answer);
    }
    if (normalize(userInput) === normalize(answer)) return true;
    // Nếu cả hai là một số (có thể có dấu phân nhóm) thì so theo số thuần.
    if (normalizeNumeric(userInput) === normalizeNumeric(answer) &&
        /\d/.test(String(answer)) && !/[a-zư]/i.test(normalize(answer))) {
      return true;
    }
    return false;
  }

  function check(question, userInput) {
    if (!question) return false;
    if (question.type === 'mc') {
      // GIAO KÈO: với trắc nghiệm, frontend LUÔN gửi INDEX (số nguyên 0..len-1).
      var idx = Number(userInput);
      return Number.isInteger(idx) && idx === question.answer;
    }
    // input: tự chuẩn hoá (bỏ dấu cách, hoa-thường, dãy số).
    return matchInput(question.answer, userInput);
  }

  var QuestionEngine = {
    topics: topics,
    generate: generate,
    generateMixed: generateMixed,
    check: check,
    // Hàm phụ trợ (tiện cho test & frontend nếu cần).
    _readNumberVi: readNumberVi,
    _normalize: normalize
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = QuestionEngine;
  if (typeof window !== 'undefined') window.QuestionEngine = QuestionEngine;
  if (typeof globalThis !== 'undefined') globalThis.QuestionEngine = QuestionEngine;
})();
