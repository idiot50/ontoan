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

  /*
   * Chọn TẦNG độ khó theo trọng số lớp 1: ~60% Cơ bản / 30% Nâng vừa / 10% Thử thách.
   * Trả về 'co-ban' | 'nang-vua' | 'thu-thach'.
   */
  function tier() {
    var r = randInt(1, 100);
    if (r <= 60) return 'co-ban';
    if (r <= 90) return 'nang-vua';
    return 'thu-thach';
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
    // 3 TẦNG:
    //   Cơ bản  : đọc cấu tạo, so sánh 2 số, liền trước/liền sau, max/min nhỏ.
    //   Nâng vừa: tròn chục, sắp xếp 4 số, liệt kê khoảng, số hai chữ số, cấu tạo ngược.
    //   Thử thách: sắp xếp 5 số, liệt kê 5 số, cấu tạo ngược suy luận, so sánh kép.
    var t = tier();
    var kind;
    if (t === 'co-ban') {
      kind = pick(['cautao', 'sosanh', 'lientruoc', 'liensau', 'maxmin']);
    } else if (t === 'nang-vua') {
      kind = pick(['tronchuc', 'sapxep4', 'lietke', 'haichuso', 'cautao-nguoc', 'demkhoang']);
    } else {
      kind = pick(['sapxep5', 'lietke5', 'cautao-suy', 'sosanh-kep']);
    }

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

    // Cấu tạo ngược SUY LUẬN (thử thách): "hàng chục là 7, hàng đơn vị bé hơn hàng
    // chục 2 đơn vị" -> 75. Chỉ 1 bước suy luận, vẫn cực ngắn.
    if (kind === 'cautao-suy') {
      var chucS = randInt(3, 9);              // hàng chục đủ lớn để đơn vị không âm
      var gap = randInt(1, Math.min(chucS, 8)); // đơn vị = chục - gap (>=0)
      var dvS = chucS - gap;
      var ansS = chucS * 10 + dvS;
      return {
        type: 'input', topic: topic,
        stem: 'Số có chữ số hàng chục là <b>' + chucS + '</b>, hàng đơn vị bé hơn hàng chục <b>' +
              gap + '</b> đơn vị. Đó là số nào? (gõ số)',
        answer: String(ansS),
        explain: 'Hàng đơn vị = ' + chucS + ' − ' + gap + ' = ' + dvS + '. Số đó là ' + chucS + ' chục ' +
                 dvS + ' đơn vị = ' + ansS + '.',
        say: 'số có chữ số hàng chục là ' + readNumberVi(chucS) + ', hàng đơn vị bé hơn hàng chục ' +
             readNumberVi(gap) + ' đơn vị, đó là số nào?'
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

    // So sánh KÉP (thử thách): "số vừa lớn hơn A vừa bé hơn B" với đúng 1 nghiệm.
    // Tối đa 2 ràng buộc, vẫn 1 đáp án rõ ràng, không gây rối.
    if (kind === 'sosanh-kep') {
      var lo2 = randInt(10, 90);
      var ansK = lo2 + 1;                 // số duy nhất ở giữa: lớn hơn lo2 và bé hơn lo2+2
      var hi2 = lo2 + 2;
      var ddK = [lo2, hi2, ansK + 1].filter(function (v) { return v >= 0 && v <= 100 && v !== ansK; });
      var mcK = makeMC(ansK, ddK, String, function (c) {
        var v = c + pick([-2, -1, 1, 2]);
        return v >= 0 && v <= 100 ? v : c + 3;
      });
      return {
        type: 'mc', topic: topic,
        stem: 'Số nào vừa <b>lớn hơn ' + lo2 + '</b> vừa <b>bé hơn ' + hi2 + '</b>?',
        choices: mcK.choices, answer: mcK.answerIndex,
        explain: 'Số lớn hơn ' + lo2 + ' và bé hơn ' + hi2 + ' chỉ có ' + ansK + '.',
        say: 'số nào vừa lớn hơn ' + readNumberVi(lo2) + ' vừa bé hơn ' + readNumberVi(hi2) + '?'
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

    // Lớn nhất / bé nhất trong nhóm 3 số (cơ bản).
    if (kind === 'maxmin') {
      var cnt = 3;
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

    // Sắp xếp số tăng/giảm -> nhập dãy. Nâng vừa: 4 số; Thử thách: 5 số.
    if (kind === 'sapxep4' || kind === 'sapxep5') {
      var cnt2 = (kind === 'sapxep5') ? 5 : 4;
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

    // Dạng SÁCH: liệt kê các số lớn hơn A và bé hơn B -> nhập dãy.
    // Nâng vừa: 3..4 số; Thử thách: 5 số.
    if (kind === 'lietke' || kind === 'lietke5') {
      var k = (kind === 'lietke5') ? 5 : randInt(3, 4); // số phần tử cần liệt kê
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
    // 3 TẦNG:
    //   Cơ bản  : a + b không nhớ, kết quả <= 20.
    //   Nâng vừa: a + b CÓ NHỚ (qua chục) <= 100, hoặc cộng số tròn chục.
    //   Thử thách: cộng 3 số <= 100, mọi bước >= 0.
    var t = tier();

    // THỬ THÁCH: cộng 3 số (a + b + c <= 100).
    if (t === 'thu-thach') {
      var a3 = randInt(11, 40), b3 = randInt(4, 30);
      var c3 = randInt(3, Math.max(3, 100 - a3 - b3));
      var ans3 = a3 + b3 + c3;
      return {
        type: 'input', topic: topic,
        stem: 'Tính: <b>' + a3 + ' + ' + b3 + ' + ' + c3 + ' = ?</b>',
        answer: String(ans3),
        explain: a3 + ' + ' + b3 + ' = ' + (a3 + b3) + '; ' + (a3 + b3) + ' + ' + c3 + ' = ' + ans3 + '.',
        say: readNumberVi(a3) + ' cộng ' + readNumberVi(b3) + ' cộng ' + readNumberVi(c3) + ' bằng mấy?'
      };
    }

    var a, b, hasCarry;
    if (t === 'co-ban') {
      // không nhớ, tổng <= 20: chọn đơn vị sao cho không qua chục.
      do {
        a = randInt(1, 18); b = randInt(1, 20 - a);
      } while ((a % 10) + (b % 10) >= 10);   // tránh nhớ
      hasCarry = false;
    } else {
      // NÂNG VỪA: ưu tiên có nhớ, hoặc cộng tròn chục để luyện nhẩm.
      if (randInt(0, 1) === 0) {
        // cộng số tròn chục: a + (chục tròn)
        var roundTen = randInt(2, 7) * 10;
        a = randInt(11, 100 - roundTen); b = roundTen;
      } else {
        // có nhớ: bảo đảm (a%10)+(b%10) >= 10
        var guard = 0;
        do {
          guard++;
          a = randInt(6, 89); b = randInt(6, 100 - a);
        } while ((a % 10) + (b % 10) < 10 && guard < 60);
      }
      hasCarry = ((a % 10) + (b % 10) >= 10);
    }
    var ans = a + b;

    // Đa số input; thỉnh thoảng mc với nhiễu "quên nhớ", "lệch chục", "lệch 1".
    if (randInt(0, 3) === 0) {
      // Bẫy lỗi điển hình: quên nhớ (lệch -10), lệch ±1, đảo chục-đơn vị kết quả.
      var dd = [ans - 10, ans + 10, ans - 1, ans + 1, ans - 9]
        .filter(function (v) { return v >= 0 && v <= 100 && v !== ans; });
      var mc = makeMC(ans, shuffle(dd), String, function (c, ex) {
        var v = c + pick([-2, -1, 1, 2, -10, 10]);
        return v >= 0 && v <= 100 ? v : c + 1;
      });
      return {
        type: 'mc', topic: topic,
        stem: 'Tính: <b>' + a + ' + ' + b + '</b>',
        choices: mc.choices, answer: mc.answerIndex,
        explain: a + ' + ' + b + ' = ' + ans + (hasCarry ? ' (nhớ 1 sang hàng chục).' : '.'),
        say: readNumberVi(a) + ' cộng ' + readNumberVi(b) + ' bằng mấy?'
      };
    }
    return {
      type: 'input', topic: topic,
      stem: 'Tính: <b>' + a + ' + ' + b + ' = ?</b>',
      answer: String(ans),
      explain: a + ' + ' + b + ' = ' + ans + (hasCarry ? ' (nhớ 1 sang hàng chục).' : '.'),
      say: readNumberVi(a) + ' cộng ' + readNumberVi(b) + ' bằng mấy?'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 3: TRỪ (trong phạm vi 100, không nhớ & có nhớ, kết quả >= 0)
   * ========================================================================== */
  function genTru() {
    var topic = 'tru';
    // 3 TẦNG:
    //   Cơ bản  : a − b không nhớ (không mượn), a <= 20.
    //   Nâng vừa: a − b CÓ NHỚ (mượn) <= 100, hoặc trừ số tròn chục.
    //   Thử thách: trừ liên tiếp 3 số, mọi bước >= 0.
    var t = tier();

    // THỬ THÁCH: trừ liên tiếp 3 số (a − b − c >= 0). Bảo đảm sau bước 1 còn >= 2.
    if (t === 'thu-thach') {
      var a3 = randInt(40, 100);
      var b3 = randInt(3, Math.min(40, a3 - 5));   // chừa lại >= 5 cho bước 2
      var rem3 = a3 - b3;                           // số còn sau bước 1 (>= 5)
      var c3 = randInt(2, rem3);                    // c3 <= rem3 -> kết quả >= 0
      var ans3 = a3 - b3 - c3;
      return {
        type: 'input', topic: topic,
        stem: 'Tính: <b>' + a3 + ' − ' + b3 + ' − ' + c3 + ' = ?</b>',
        answer: String(ans3),
        explain: a3 + ' − ' + b3 + ' = ' + (a3 - b3) + '; ' + (a3 - b3) + ' − ' + c3 + ' = ' + ans3 + '.',
        say: readNumberVi(a3) + ' trừ ' + readNumberVi(b3) + ' trừ ' + readNumberVi(c3) + ' bằng mấy?'
      };
    }

    var a, b, hasBorrow;
    if (t === 'co-ban') {
      // không mượn, a <= 20: chọn b sao cho đơn vị b <= đơn vị a.
      do {
        a = randInt(2, 20); b = randInt(1, a);
      } while ((b % 10) > (a % 10));   // tránh mượn
      hasBorrow = false;
    } else {
      // NÂNG VỪA: ưu tiên có mượn, hoặc trừ số tròn chục.
      if (randInt(0, 1) === 0) {
        // trừ số tròn chục
        a = randInt(31, 100);
        var roundTen = randInt(1, Math.floor(a / 10)) * 10;
        b = roundTen;
      } else {
        // có mượn: bảo đảm đơn vị b > đơn vị a
        var guard = 0;
        do {
          guard++;
          a = randInt(21, 100); b = randInt(2, a - 1);
        } while ((b % 10) <= (a % 10) && guard < 60);
      }
      hasBorrow = ((b % 10) > (a % 10));
    }
    var ans = a - b;

    if (randInt(0, 3) === 0) {
      // Bẫy lỗi: cộng thay trừ (a+b), quên mượn (lệch +10), lệch ±1.
      var dd = [ans + 10, ans - 10, ans + 1, ans - 1, a + b]
        .filter(function (v) { return v >= 0 && v <= 100 && v !== ans; });
      var mc = makeMC(ans, shuffle(dd), String, function (c, ex) {
        var v = c + pick([-2, -1, 1, 2, -10, 10]);
        return v >= 0 && v <= 100 ? v : c + 1;
      });
      return {
        type: 'mc', topic: topic,
        stem: 'Tính: <b>' + a + ' − ' + b + '</b>',
        choices: mc.choices, answer: mc.answerIndex,
        explain: a + ' − ' + b + ' = ' + ans + (hasBorrow ? ' (mượn 1 ở hàng chục).' : '.'),
        say: readNumberVi(a) + ' trừ ' + readNumberVi(b) + ' bằng mấy?'
      };
    }
    return {
      type: 'input', topic: topic,
      stem: 'Tính: <b>' + a + ' − ' + b + ' = ?</b>',
      answer: String(ans),
      explain: a + ' − ' + b + ' = ' + ans + (hasBorrow ? ' (mượn 1 ở hàng chục).' : '.'),
      say: readNumberVi(a) + ' trừ ' + readNumberVi(b) + ' bằng mấy?'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 4: TÍNH DÃY & ĐIỀN SỐ
   * ========================================================================== */
  function genTinhDay() {
    var topic = 'tinh-day';
    // 3 TẦNG:
    //   Cơ bản  : dãy 3 số tính lần lượt; điền ô 1 bước số nhỏ (<= 20).
    //   Nâng vừa: điền ô 1 bước số lớn (tới 100); so sánh hai vế đều là phép tính.
    //   Thử thách: điền số CÒN THIẾU giữa một dãy cách đều.
    var t = tier();
    var kind;
    if (t === 'co-ban') {
      kind = pick(['day3', 'dien-nho']);
    } else if (t === 'nang-vua') {
      kind = pick(['dien', 'dien', 'sosanh-pheptinh']);
    } else {
      kind = 'day-otrong';
    }

    // ĐIỀN SỐ GIỮA DÃY (thử thách): "5; 8; ?; 14; 17" (đều +k). Một ô trống ở giữa.
    if (kind === 'day-otrong') {
      var dStep = randInt(2, 6);
      var maxStart = 100 - 4 * dStep;
      var startD = randInt(0, Math.max(0, maxStart));
      var full = [startD, startD + dStep, startD + 2 * dStep, startD + 3 * dStep, startD + 4 * dStep];
      var pos = randInt(1, 3);             // ô trống ở vị trí 1..3 (giữa dãy)
      var ansD = full[pos];
      var shown = full.slice();
      shown[pos] = '?';
      return {
        type: 'input', topic: topic,
        stem: 'Điền số còn thiếu: <b>' + shown.join('; ') + '</b> (gõ số)',
        answer: String(ansD),
        explain: 'Dãy hơn nhau ' + dStep + ' đơn vị. Số còn thiếu là ' +
                 full[pos - 1] + ' + ' + dStep + ' = ' + ansD + '.',
        say: 'điền số còn thiếu trong dãy ' +
             shown.map(function (x) { return x === '?' ? 'mấy' : readNumberVi(x); }).join(', ') + '.'
      };
    }

    // ĐIỀN Ô 1 BƯỚC SỐ NHỎ (cơ bản): "? + 3 = 10" với số <= 20.
    if (kind === 'dien-nho') {
      var tn = pick(['?+a=s', 'a+?=s', 'a-?=d']);
      var an, sn, dn, ansN, stemN, saysN;
      if (tn === '?+a=s') {
        ansN = randInt(0, 18); an = randInt(0, 20 - ansN); sn = ansN + an;
        stemN = '? + ' + an + ' = ' + sn;
        saysN = 'mấy cộng ' + readNumberVi(an) + ' bằng ' + readNumberVi(sn) + '?';
      } else if (tn === 'a+?=s') {
        an = randInt(0, 18); ansN = randInt(0, 20 - an); sn = an + ansN;
        stemN = an + ' + ? = ' + sn;
        saysN = readNumberVi(an) + ' cộng mấy bằng ' + readNumberVi(sn) + '?';
      } else {
        an = randInt(2, 20); dn = randInt(0, an); ansN = an - dn;
        stemN = an + ' − ? = ' + dn;
        saysN = readNumberVi(an) + ' trừ mấy bằng ' + readNumberVi(dn) + '?';
      }
      return {
        type: 'input', topic: topic,
        stem: 'Điền số thích hợp vào ô trống: <b>' + stemN + '</b> (gõ số)',
        answer: String(ansN),
        explain: 'Số cần điền là ' + ansN + ' (thay vào: ' + stemN.replace('?', ansN) + ', đúng).',
        say: saysN
      };
    }

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
    // Vế phải: nâng vừa nên tăng tỉ trọng HAI VẾ ĐỀU LÀ PHÉP TÍNH (plus/minus);
    // vẫn giữ một ít dạng so với số cho đỡ nản.
    var rForm = pick(['num', 'plus', 'plus', 'minus', 'minus']);
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
    // 3 TẦNG:
    //   Cơ bản  : so sánh/cộng/trừ một phép.
    //   Nâng vừa: nối 3 đoạn; suy luận ngược 1 bước (biết tổng & 1 đoạn, tìm đoạn kia).
    //   Thử thách: cắt 2 lần (80 − 25 − 17).
    var t = tier();
    var kind;
    if (t === 'co-ban') {
      kind = pick(['sosanh', 'cong', 'tru', 'catday']);
    } else if (t === 'nang-vua') {
      kind = pick(['noi3', 'nguoc']);
    } else {
      kind = 'cat2';
    }

    // NỐI 3 ĐOẠN (nâng vừa): cộng 3 đoạn, tổng <= 100 cm.
    if (kind === 'noi3') {
      var p1 = randInt(5, 40), p2 = randInt(5, 40);
      var p3 = randInt(5, Math.max(5, 100 - p1 - p2));
      var ansN = p1 + p2 + p3;
      return {
        type: 'input', topic: topic,
        stem: 'Nối ba đoạn dây dài <b>' + p1 + ' cm</b>, <b>' + p2 + ' cm</b> và <b>' + p3 +
              ' cm</b>. Sợi dây mới dài bao nhiêu cm? (gõ số)',
        answer: String(ansN),
        explain: p1 + ' + ' + p2 + ' + ' + p3 + ' = ' + ansN + ' (cm).',
        say: 'nối ba đoạn dây dài ' + readNumberVi(p1) + ' xăng ti mét, ' + readNumberVi(p2) +
             ' xăng ti mét và ' + readNumberVi(p3) + ' xăng ti mét, sợi dây mới dài bao nhiêu xăng ti mét?'
      };
    }

    // SUY LUẬN NGƯỢC 1 BƯỚC (nâng vừa): AB + BC = tổng; biết AB, tìm BC.
    if (kind === 'nguoc') {
      var ab = randInt(10, 60);
      var bc = randInt(5, 100 - ab);
      var totalLen = ab + bc;
      return {
        type: 'input', topic: topic,
        stem: 'Đoạn AB dài <b>' + ab + ' cm</b>, nối thêm đoạn BC thì cả hai dài <b>' + totalLen +
              ' cm</b>. Đoạn BC dài bao nhiêu cm? (gõ số)',
        answer: String(bc),
        explain: 'Lấy cả hai trừ đoạn AB: ' + totalLen + ' − ' + ab + ' = ' + bc + ' (cm). ' +
                 'Thử lại: ' + ab + ' + ' + bc + ' = ' + totalLen + '.',
        say: 'đoạn a bê dài ' + readNumberVi(ab) + ' xăng ti mét, nối thêm đoạn bê xê thì cả hai dài ' +
             readNumberVi(totalLen) + ' xăng ti mét, đoạn bê xê dài bao nhiêu xăng ti mét?'
      };
    }

    // CẮT 2 LẦN (thử thách): dây N cắt M1 rồi cắt M2, còn lại?
    if (kind === 'cat2') {
      var len2 = randInt(50, 100);
      var cut1 = randInt(10, Math.min(40, len2 - 12));
      var cut2 = randInt(5, Math.max(5, len2 - cut1 - 2));
      var ansC = len2 - cut1 - cut2;
      return {
        type: 'input', topic: topic,
        stem: 'Sợi dây dài <b>' + len2 + ' cm</b>, cắt đi <b>' + cut1 + ' cm</b> rồi cắt tiếp <b>' +
              cut2 + ' cm</b>. Đoạn dây còn lại dài bao nhiêu cm? (gõ số)',
        answer: String(ansC),
        explain: len2 + ' − ' + cut1 + ' = ' + (len2 - cut1) + '; ' + (len2 - cut1) + ' − ' + cut2 +
                 ' = ' + ansC + ' (cm).',
        say: 'sợi dây dài ' + readNumberVi(len2) + ' xăng ti mét, cắt đi ' + readNumberVi(cut1) +
             ' xăng ti mét rồi cắt tiếp ' + readNumberVi(cut2) +
             ' xăng ti mét, đoạn dây còn lại dài bao nhiêu xăng ti mét?'
      };
    }

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
    // 3 TẦNG (giữ mọi mốc giờ KẾT THÚC <= 12, tránh nhập nhằng 24h cho bé):
    //   Cơ bản  : đọc kim ngắn / kim dài, thứ ngày mai, nhận biết buổi.
    //   Nâng vừa: khoảng thời gian (dur<=4), đếm ngày 1..3, ghép buổi+giờ, đổi mốc quen.
    //   Thử thách: đếm ngày 4..6.
    var t = tier();
    var kind;
    if (t === 'co-ban') {
      kind = pick(['kim-ngan', 'kim-dai', 'thu-mai', 'nhan-buoi']);
    } else if (t === 'nang-vua') {
      kind = pick(['khoang-gio', 'thu-sau', 'ghep-buoi', 'buoi-doi']);
    } else {
      kind = 'thu-sau-xa';
    }

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

    // Thứ: N ngày sau thứ X là thứ mấy?
    //   thu-sau (nâng vừa): N = 1..3.   thu-sau-xa (thử thách): N = 4..6.
    if (kind === 'thu-sau' || kind === 'thu-sau-xa') {
      var idx2 = randInt(0, 6);
      var add = (kind === 'thu-sau-xa') ? randInt(4, 6) : randInt(1, 3);
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

    // GHÉP BUỔI + GIỜ (nâng vừa): cộng giờ trong một buổi, kết thúc <= 12.
    // Ví dụ: "ngủ trưa lúc 12 giờ, dậy sau 2 giờ" hay "ngủ lúc 8 giờ tối, ngủ 3 giờ".
    if (kind === 'ghep-buoi') {
      // Chọn kịch bản giữ mốc kết thúc <= 12 và tránh nhập nhằng 24h.
      var scenes = [
        { s: 12, lo: 1, hi: 4, txt: 'Bé ngủ trưa lúc <b>12 giờ</b>, ngủ <b>{d} giờ</b> thì dậy. Lúc đó là mấy giờ?',
          say: 'bé ngủ trưa lúc mười hai giờ, ngủ {ds} giờ thì dậy, lúc đó là mấy giờ?',
          base: 12, wrap: true },
        { s: 8, lo: 1, hi: 4, txt: 'Bé đi ngủ lúc <b>8 giờ tối</b>, ngủ <b>{d} giờ</b> rồi tỉnh dậy. Lúc đó là mấy giờ?',
          say: 'bé đi ngủ lúc tám giờ tối, ngủ {ds} giờ rồi tỉnh dậy, lúc đó là mấy giờ?',
          base: 8, wrap: false },
        { s: 9, lo: 1, hi: 3, txt: 'Bé đi ngủ lúc <b>9 giờ tối</b>, ngủ <b>{d} giờ</b> rồi tỉnh dậy. Lúc đó là mấy giờ?',
          say: 'bé đi ngủ lúc chín giờ tối, ngủ {ds} giờ rồi tỉnh dậy, lúc đó là mấy giờ?',
          base: 9, wrap: false }
      ];
      var sc = pick(scenes);
      var durG = randInt(sc.lo, sc.hi);
      // Tính giờ kết thúc theo đồng hồ 12 (12 + 1 = 1 giờ); giữ <= 12.
      var raw = sc.base + durG;
      var endG = sc.wrap ? ((sc.base + durG - 1) % 12 + 1) : raw;  // 12+1->1, 12+2->2...
      if (!sc.wrap && endG > 12) endG = (raw - 1) % 12 + 1;
      var ddG = [endG + 1, endG - 1, durG].filter(function (v) { return v >= 1 && v <= 12 && v !== endG; });
      var mcG = makeMC(endG, ddG, String, function () { return randInt(1, 12); });
      var stemG = sc.txt.replace('{d}', durG);
      var sayG = sc.say.replace('{ds}', readNumberVi(durG));
      var explG = sc.wrap
        ? ('Sau 12 giờ trưa thêm ' + durG + ' giờ là ' + endG + ' giờ.')
        : (sc.base + ' + ' + durG + ' = ' + raw + (raw > 12 ? ' (tức ' + endG + ' giờ).' : '. Lúc đó là ' + endG + ' giờ.'));
      return {
        type: 'mc', topic: topic,
        stem: stemG,
        choices: mcG.choices, answer: mcG.answerIndex,
        explain: explG,
        say: sayG
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
    // 3 TẦNG:
    //   Cơ bản  : một bước (thêm/bớt/nhiều hơn/ít hơn/gộp/tách).
    //   Nâng vừa: suy luận ngược 1 bước; so sánh hai bạn rồi hỏi TỔNG.
    //   Thử thách: bài 2 bước (thêm rồi bớt / bớt rồi thêm).
    var t = tier();
    var kind;
    if (t === 'co-ban') {
      kind = pick(['them', 'bot', 'nhieuhon', 'ithon', 'gop', 'tach']);
    } else if (t === 'nang-vua') {
      kind = pick(['nguoc-them', 'nguoc-bot', 'sosanh-tong']);
    } else {
      kind = pick(['hai-buoc-tb', 'hai-buoc-bt']);
    }
    var name = pick(PROPER_NAMES);
    var name2 = pick(PROPER_NAMES.filter(function (x) { return x !== name; }));
    var obj = pick(OBJS);

    // SUY LUẬN NGƯỢC 1 BƯỚC — được thêm: "Sau khi được tặng b, còn T. Lúc đầu?"
    if (kind === 'nguoc-them') {
      var addN = randInt(2, 40), nowN = randInt(addN + 1, 100);
      var startN = nowN - addN;
      return {
        type: 'input', topic: topic,
        stem: 'Sau khi được tặng thêm <b>' + addN + ' ' + obj.d + '</b>, ' + name + ' có <b>' + nowN +
              ' ' + obj.d + '</b>. Hỏi lúc đầu ' + name + ' có bao nhiêu ' + obj.d + '? (gõ số)',
        answer: String(startN),
        explain: 'Bớt phần được tặng đi: ' + nowN + ' − ' + addN + ' = ' + startN + ' ' + obj.dv +
                 '. Thử lại: ' + startN + ' + ' + addN + ' = ' + nowN + '.',
        say: 'sau khi được tặng thêm ' + readNumberVi(addN) + ' ' + obj.d + ', ' + name + ' có ' +
             readNumberVi(nowN) + ' ' + obj.d + ', hỏi lúc đầu ' + name + ' có bao nhiêu ' + obj.d + '?'
      };
    }

    // SUY LUẬN NGƯỢC 1 BƯỚC — cho bớt: "Sau khi cho b, còn T. Lúc đầu?"
    if (kind === 'nguoc-bot') {
      var giveN = randInt(2, 40), leftN = randInt(2, 100 - giveN);
      var startB = leftN + giveN;
      return {
        type: 'input', topic: topic,
        stem: 'Sau khi cho bạn <b>' + giveN + ' ' + obj.d + '</b>, ' + name + ' còn lại <b>' + leftN +
              ' ' + obj.d + '</b>. Hỏi lúc đầu ' + name + ' có bao nhiêu ' + obj.d + '? (gõ số)',
        answer: String(startB),
        explain: 'Thêm phần đã cho lại: ' + leftN + ' + ' + giveN + ' = ' + startB + ' ' + obj.dv +
                 '. Thử lại: ' + startB + ' − ' + giveN + ' = ' + leftN + '.',
        say: 'sau khi cho bạn ' + readNumberVi(giveN) + ' ' + obj.d + ', ' + name + ' còn lại ' +
             readNumberVi(leftN) + ' ' + obj.d + ', hỏi lúc đầu ' + name + ' có bao nhiêu ' + obj.d + '?'
      };
    }

    // SO SÁNH RỒI HỎI TỔNG (2 bước cộng): "A có a, B nhiều hơn A là m, cả hai có mấy?"
    if (kind === 'sosanh-tong') {
      var aS = randInt(5, 40), mS = randInt(1, Math.min(20, 100 - aS - aS));
      var bS = aS + mS;             // số của bạn kia
      var tongS = aS + bS;          // tổng <= 100 nhờ ràng buộc mS
      return {
        type: 'input', topic: topic,
        stem: name + ' có <b>' + aS + ' ' + obj.d + '</b>. ' + name2 + ' có nhiều hơn ' + name + ' <b>' +
              mS + ' ' + obj.d + '</b>. Hỏi cả hai bạn có tất cả bao nhiêu ' + obj.d + '? (gõ số)',
        answer: String(tongS),
        explain: name2 + ' có ' + aS + ' + ' + mS + ' = ' + bS + ' ' + obj.dv + '; cả hai có ' +
                 aS + ' + ' + bS + ' = ' + tongS + ' ' + obj.dv + '.',
        say: name + ' có ' + readNumberVi(aS) + ' ' + obj.d + ', ' + name2 + ' có nhiều hơn ' + name +
             ' ' + readNumberVi(mS) + ' ' + obj.d + ', hỏi cả hai bạn có tất cả bao nhiêu ' + obj.d + '?'
      };
    }

    // HAI BƯỚC — thêm rồi bớt: "có a, được tặng b, rồi cho c, còn mấy?"
    if (kind === 'hai-buoc-tb') {
      var a0 = randInt(10, 50), add0 = randInt(2, 100 - a0);
      var mid0 = a0 + add0;
      var give0 = randInt(2, mid0);
      var ans0 = mid0 - give0;
      return {
        type: 'input', topic: topic,
        stem: name + ' có <b>' + a0 + ' ' + obj.d + '</b>, được tặng thêm <b>' + add0 + ' ' + obj.d +
              '</b>, rồi cho bạn <b>' + give0 + ' ' + obj.d + '</b>. Hỏi ' + name + ' còn lại bao nhiêu ' +
              obj.d + '? (gõ số)',
        answer: String(ans0),
        explain: a0 + ' + ' + add0 + ' = ' + mid0 + '; ' + mid0 + ' − ' + give0 + ' = ' + ans0 + ' ' + obj.dv + '.',
        say: name + ' có ' + readNumberVi(a0) + ' ' + obj.d + ', được tặng thêm ' + readNumberVi(add0) +
             ' ' + obj.d + ', rồi cho bạn ' + readNumberVi(give0) + ' ' + obj.d + ', hỏi ' + name +
             ' còn lại bao nhiêu ' + obj.d + '?'
      };
    }

    // HAI BƯỚC — bớt rồi thêm: "có a, cho b, rồi được tặng c, còn mấy?"
    if (kind === 'hai-buoc-bt') {
      var a1 = randInt(20, 60), give1 = randInt(2, a1 - 1);
      var mid1 = a1 - give1;
      var add1 = randInt(2, 100 - mid1);
      var ans1 = mid1 + add1;
      return {
        type: 'input', topic: topic,
        stem: name + ' có <b>' + a1 + ' ' + obj.d + '</b>, cho bạn <b>' + give1 + ' ' + obj.d +
              '</b>, rồi được tặng thêm <b>' + add1 + ' ' + obj.d + '</b>. Hỏi ' + name +
              ' còn lại bao nhiêu ' + obj.d + '? (gõ số)',
        answer: String(ans1),
        explain: a1 + ' − ' + give1 + ' = ' + mid1 + '; ' + mid1 + ' + ' + add1 + ' = ' + ans1 + ' ' + obj.dv + '.',
        say: name + ' có ' + readNumberVi(a1) + ' ' + obj.d + ', cho bạn ' + readNumberVi(give1) +
             ' ' + obj.d + ', rồi được tặng thêm ' + readNumberVi(add1) + ' ' + obj.d + ', hỏi ' + name +
             ' còn lại bao nhiêu ' + obj.d + '?'
      };
    }

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
    // 3 TẦNG:
    //   Cơ bản  : dãy cộng/trừ đều bước nhỏ; lập số từ 2 thẻ.
    //   Nâng vừa: tìm số suy luận ngược (số lớn); dãy có ô trống; lập số 3 thẻ.
    //   Thử thách: câu đố tuổi / logic cực ngắn (vẫn chỉ + −).
    var t = tier();
    var kind;
    if (t === 'co-ban') {
      kind = pick(['dayso-cong', 'dayso-tru', 'lapso2-max', 'lapso2-min']);
    } else if (t === 'nang-vua') {
      kind = pick(['timso', 'day-otrong', 'lapso3-max', 'lapso3-min']);
    } else {
      kind = 'do-tuoi';
    }

    // CÂU ĐỐ TUỔI / LOGIC (thử thách): chỉ một phép + −, đặt dạng "đố" để bé suy nghĩ.
    // Chênh lệch tuổi chọn HỢP LÝ theo quan hệ để câu tự nhiên với bé.
    if (kind === 'do-tuoi') {
      var name = pick(PROPER_NAMES);
      var rels = [
        { q: 'anh', lo: 2, hi: 8 }, { q: 'chị', lo: 2, hi: 8 },
        { q: 'bố', lo: 25, hi: 38 }, { q: 'mẹ', lo: 24, hi: 36 }
      ];
      var rel = pick(rels);
      var ageL = randInt(5, 10);
      var older = randInt(rel.lo, Math.min(rel.hi, 100 - ageL));
      var ansT = ageL + older;
      return {
        type: 'input', topic: topic,
        stem: name + ' <b>' + ageL + ' tuổi</b>. ' + cap(rel.q) + ' của ' + name + ' hơn ' + name +
              ' <b>' + older + ' tuổi</b>. Hỏi ' + rel.q + ' của ' + name + ' bao nhiêu tuổi? (gõ số)',
        answer: String(ansT),
        explain: 'Hơn tuổi thì lấy cộng: ' + ageL + ' + ' + older + ' = ' + ansT + ' tuổi.',
        say: name + ' ' + readNumberVi(ageL) + ' tuổi, ' + rel.q + ' của ' + name + ' hơn ' + name +
             ' ' + readNumberVi(older) + ' tuổi, hỏi ' + rel.q + ' của ' + name + ' bao nhiêu tuổi?'
      };
    }

    // DÃY CÓ Ô TRỐNG (nâng vừa): "2; 5; 8; 11; ?" cộng đều, ô trống ở CUỐI hoặc giữa.
    if (kind === 'day-otrong') {
      var step = randInt(2, 7);
      var maxS = 100 - 4 * step;
      var st = randInt(0, Math.max(0, maxS));
      var fullD = [st, st + step, st + 2 * step, st + 3 * step, st + 4 * step];
      var posD = randInt(1, 4);             // ô trống ở vị trí 1..4
      var ansD = fullD[posD];
      var shownD = fullD.slice();
      shownD[posD] = '?';
      return {
        type: 'input', topic: topic,
        stem: 'Tìm số còn thiếu trong dãy: <b>' + shownD.join('; ') + '</b> (gõ số)',
        answer: String(ansD),
        explain: 'Mỗi số hơn số trước ' + step + ' đơn vị. Số còn thiếu là ' +
                 fullD[posD - 1] + ' + ' + step + ' = ' + ansD + '.',
        say: 'tìm số còn thiếu trong dãy ' +
             shownD.map(function (x) { return x === '?' ? 'mấy' : readNumberVi(x); }).join(', ') + '.'
      };
    }

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
    // Cơ bản: 2 thẻ (lapso2-*); Nâng vừa: 3 thẻ (lapso3-*).
    if (kind === 'lapso2-max' || kind === 'lapso2-min' ||
        kind === 'lapso3-max' || kind === 'lapso3-min') {
      var wantMax = (kind === 'lapso2-max' || kind === 'lapso3-max');
      // số thẻ theo tầng (2 hoặc 3); thẻ chữ số khác nhau; có thể chứa 0 (0 không đứng đầu).
      var cnt = (kind === 'lapso3-max' || kind === 'lapso3-min') ? 3 : 2;
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

    // Tìm số suy luận ngược (nâng vừa, số lớn hơn): "số nào cộng 18 được 42?" / "số nào trừ 10 được 8?"
    var op = pick(['cong', 'tru']);
    var x, a, res, stem, says;
    if (op === 'cong') {
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
      explain: op === 'cong'
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
