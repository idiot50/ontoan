/*
 * engine.js — Động cơ sinh câu hỏi Toán lớp 3
 * Classic script: chạy được qua <script src> (file://) lẫn node (require).
 * Mọi câu hỏi tuân theo "giao kèo dữ liệu":
 *   { type:'mc'|'input', topic, stem, choices?, answer, explain }
 * Số luôn trong tầm lớp 3 (<= 100 000). answer luôn tính bằng code.
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

  // Định dạng số có dấu chấm phân nhóm nghìn để bé dễ đọc: 12345 -> "12 345".
  // Dùng khoảng trắng (không phải dấu chấm) theo quy ước SGK lớp 3.
  function groupDigits(n) {
    var neg = n < 0;
    var s = String(Math.abs(n));
    var out = '';
    var c = 0;
    for (var i = s.length - 1; i >= 0; i--) {
      out = s[i] + out;
      c++;
      if (c % 3 === 0 && i > 0) out = ' ' + out;
    }
    return (neg ? '-' : '') + out;
  }

  /*
   * Tạo bộ trắc nghiệm: nhận đáp án đúng + danh sách distractor (giá trị),
   * loại trùng, đảm bảo đủ 4 phương án (bù distractor an toàn nếu thiếu),
   * trộn vị trí, trả về { choices, answerIndex }.
   * - format: hàm biến giá trị -> chuỗi hiển thị (mặc định String).
   */
  function makeMC(correct, distractors, format, padFn) {
    format = format || function (x) { return String(x); };
    var seen = {};
    var values = [];
    var correctKey = format(correct);
    seen[correctKey] = true;
    values.push(correct);

    for (var i = 0; i < distractors.length && values.length < 4; i++) {
      var d = distractors[i];
      var k = format(d);
      if (!seen[k]) {
        seen[k] = true;
        values.push(d);
      }
    }
    // Bù phương án nếu vẫn thiếu (dùng hàm pad sinh giá trị "gần" hợp lý).
    var guard = 0;
    while (values.length < 4 && guard < 200) {
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

  // padFn mặc định cho số: sinh số gần đáp án và khác các giá trị đã có.
  function numericPad(correct, existing) {
    var delta = randInt(1, 12);
    var sign = randInt(0, 1) ? 1 : -1;
    var v = correct + delta * sign;
    if (v < 0) v = correct + delta;
    return v;
  }

  /* ====================== ĐỌC SỐ TIẾNG VIỆT (0..99999) ====================== */
  // Xử lý đầy đủ các ca khó: linh/lẻ, mười/mươi, mốt, lăm, tư, "không trăm".

  var DV = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

  // Đọc 1 nhóm 3 chữ số. full=true => luôn đọc đủ "trăm/không trăm" (cho nhóm sau).
  function readBelowThousand(n, full) {
    var tram = Math.floor(n / 100);
    var chuc = Math.floor((n % 100) / 10);
    var dv = n % 10;
    var parts = [];

    if (tram > 0) {
      parts.push(DV[tram] + ' trăm');
    } else if (full) {
      parts.push('không trăm');
    }

    if (chuc === 0) {
      if (dv > 0 && (tram > 0 || full)) {
        parts.push('linh ' + DV[dv]); // 305 -> ba trăm linh năm
      } else if (dv > 0) {
        parts.push(DV[dv]);
      }
    } else if (chuc === 1) {
      parts.push('mười');
      if (dv === 1) parts.push('một');        // 11 -> mười một (không phải mốt)
      else if (dv === 5) parts.push('lăm');   // 15 -> mười lăm
      else if (dv > 0) parts.push(DV[dv]);
    } else {
      parts.push(DV[chuc] + ' mươi');
      if (dv === 1) parts.push('mốt');        // 21 -> hai mươi mốt
      else if (dv === 5) parts.push('lăm');   // 25 -> hai mươi lăm
      else if (dv === 4) parts.push('tư');    // 24 -> hai mươi tư (chuẩn phổ biến)
      else if (dv > 0) parts.push(DV[dv]);
    }

    return parts.join(' ');
  }

  // Đọc số nguyên 0..99999.
  function readNumberVi(n) {
    if (n === 0) return 'không';
    var nghin = Math.floor(n / 1000);
    var duoi = n % 1000;
    if (nghin === 0) {
      return readBelowThousand(duoi, false);
    }
    var head = readBelowThousand(nghin, false) + ' nghìn';
    if (duoi === 0) return head;
    // Nhóm sau cần đọc đầy đủ "không trăm"/"linh" để không mất hàng.
    return head + ' ' + readBelowThousand(duoi, true);
  }

  // Viết hoa chữ cái đầu.
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ============================ TÊN CHO LỜI VĂN ============================ */
  var NAMES = ['Lan', 'Minh', 'Hoa', 'Nam', 'Bình', 'An', 'Hùng', 'Mai', 'Tú', 'Linh', 'Khoa', 'Vy'];
  var OBJS = [
    { d: 'quyển vở', dv: 'quyển' },
    { d: 'cái bút', dv: 'cái' },
    { d: 'viên bi', dv: 'viên' },
    { d: 'quả táo', dv: 'quả' },
    { d: 'cái kẹo', dv: 'cái' },
    { d: 'bông hoa', dv: 'bông' },
    { d: 'con tem', dv: 'con' },
    { d: 'cái bánh', dv: 'cái' }
  ];

  /* ============================================================================
   *  CHỦ ĐỀ 1: SỐ ĐẾN 100 000
   * ========================================================================== */
  function genSo100000() {
    var kind = pick(['doc', 'viet', 'giatri', 'sosanh', 'lientruocl.sau', 'maxmin', 'sapxep']);
    var topic = 'so-100000';

    if (kind === 'doc') {
      // Cho số -> chọn cách đọc đúng (mc).
      var n = randInt(101, 99999);
      var correct = cap(readNumberVi(n));
      // Distractor: sai linh/lăm/mốt/tư bằng cách đọc số "gần".
      var d1 = cap(readNumberVi(n + (n % 10 === 0 ? 1 : -1)));
      var d2 = cap(readNumberVi(Math.max(101, n - 10)));
      var d3 = cap(readNumberVi(Math.min(99999, n + 100)));
      var mc = makeMC(correct, [d1, d2, d3], function (x) { return x; }, function () {
        return cap(readNumberVi(randInt(101, 99999)));
      });
      return {
        type: 'mc', topic: topic,
        stem: 'Số <b>' + groupDigits(n) + '</b> đọc là:',
        choices: mc.choices, answer: mc.answerIndex,
        explain: groupDigits(n) + ' đọc là "' + readNumberVi(n) + '".'
      };
    }

    if (kind === 'viet') {
      // Cho cách đọc -> nhập số (input).
      var n2 = randInt(101, 99999);
      return {
        type: 'input', topic: topic,
        stem: 'Viết số (chỉ gõ chữ số): <b>' + cap(readNumberVi(n2)) + '</b>',
        answer: String(n2),
        explain: '"' + readNumberVi(n2) + '" viết là ' + groupDigits(n2) + '.'
      };
    }

    if (kind === 'giatri') {
      // Giá trị của chữ số theo hàng.
      var n3 = randInt(10000, 99999);
      var s = String(n3);
      var hangs = ['hàng đơn vị', 'hàng chục', 'hàng trăm', 'hàng nghìn', 'hàng chục nghìn'];
      var pos = randInt(0, 4);              // 0 = hàng đơn vị
      var digit = Number(s[s.length - 1 - pos]);
      var value = digit * Math.pow(10, pos);
      // Distractor: lấy chính chữ số, lấy giá trị hàng kế (cao hơn & thấp hơn),
      // lấy sai bậc. Chỉ giữ số nguyên (không sinh số thập phân — vượt tầm lớp 3).
      var dd = [digit, value * 10, digit * Math.pow(10, (pos + 1) % 5),
        pos > 0 ? value / 10 : digit * 10]
        .filter(function (v) { return Number.isInteger(v) && v >= 0; });
      var mc2 = makeMC(value, dd, function (x) { return groupDigits(x); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Trong số <b>' + groupDigits(n3) + '</b>, chữ số <b>' + digit +
              '</b> ở ' + hangs[pos] + ' có giá trị là:',
        choices: mc2.choices, answer: mc2.answerIndex,
        explain: 'Chữ số ' + digit + ' đứng ở ' + hangs[pos] + ' nên có giá trị ' +
                 digit + ' × ' + groupDigits(Math.pow(10, pos)) + ' = ' + groupDigits(value) + '.'
      };
    }

    if (kind === 'sosanh') {
      var a = randInt(1000, 99999);
      var b;
      // 1/3 ca cho bằng nhau (đổi 1 chữ số), còn lại khác nhau.
      if (randInt(0, 2) === 0) b = a; else { do { b = a + randInt(-500, 500); } while (b < 1000 || b > 99999); }
      var correctSign = a > b ? '>' : (a < b ? '<' : '=');
      var mc3 = makeMC(correctSign, ['>', '<', '='], function (x) { return x; }, function () { return '='; });
      // makeMC sẽ dùng đúng 3 dấu; chỉ còn 3 phương án -> chấp nhận 3 lựa chọn.
      return {
        type: 'mc', topic: topic,
        stem: 'Điền dấu thích hợp: <b>' + groupDigits(a) + ' ___ ' + groupDigits(b) + '</b>',
        choices: mc3.choices, answer: mc3.answerIndex,
        explain: groupDigits(a) + ' ' + correctSign + ' ' + groupDigits(b) +
                 (correctSign === '=' ? ' (hai số bằng nhau).' : ' (so sánh từ hàng cao nhất).')
      };
    }

    if (kind === 'lientruocl.sau') {
      var n4 = randInt(1001, 99998);
      var which = randInt(0, 1); // 0 liền trước, 1 liền sau
      var ans = which ? n4 + 1 : n4 - 1;
      var label = which ? 'liền sau' : 'liền trước';
      return {
        type: 'input', topic: topic,
        stem: 'Số ' + label + ' của <b>' + groupDigits(n4) + '</b> là:',
        answer: String(ans),
        explain: 'Số ' + label + ' hơn/kém 1 đơn vị: ' + groupDigits(n4) +
                 (which ? ' + 1 = ' : ' − 1 = ') + groupDigits(ans) + '.'
      };
    }

    if (kind === 'maxmin') {
      // Số lớn nhất / nhỏ nhất trong 4 số.
      var nums = [];
      while (nums.length < 4) {
        var x = randInt(1000, 99999);
        if (nums.indexOf(x) === -1) nums.push(x);
      }
      var wantMax = randInt(0, 1) === 1;
      var target = wantMax ? Math.max.apply(null, nums) : Math.min.apply(null, nums);
      var mc4 = makeMC(target, nums, function (v) { return groupDigits(v); });
      return {
        type: 'mc', topic: topic,
        stem: 'Số ' + (wantMax ? 'lớn nhất' : 'bé nhất') + ' trong các số ' +
              nums.map(groupDigits).join('; ') + ' là:',
        choices: mc4.choices, answer: mc4.answerIndex,
        explain: 'So sánh các số, số ' + (wantMax ? 'lớn nhất' : 'bé nhất') + ' là ' + groupDigits(target) + '.'
      };
    }

    // sapxep: sắp xếp tăng/giảm -> nhập dãy.
    var arr = [];
    while (arr.length < 4) {
      var y = randInt(100, 9999);
      if (arr.indexOf(y) === -1) arr.push(y);
    }
    var asc = randInt(0, 1) === 1;
    var sorted = arr.slice().sort(function (p, q) { return asc ? p - q : q - p; });
    // Đáp án dạng chuỗi các số cách nhau bởi dấu ';' (chuẩn hoá khi check).
    var ansStr = sorted.join(';');
    return {
      type: 'input', topic: topic,
      stem: 'Sắp xếp các số theo thứ tự ' + (asc ? 'từ bé đến lớn' : 'từ lớn đến bé') +
            ' (ngăn cách bởi dấu ;): <b>' + arr.join('; ') + '</b>',
      answer: ansStr,
      explain: 'Thứ tự ' + (asc ? 'tăng dần' : 'giảm dần') + ': ' + sorted.join('; ') + '.'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 2: CỘNG – TRỪ TRONG 100 000
   * ========================================================================== */
  function genCongTru() {
    var topic = 'cong-tru';
    var isAdd = randInt(0, 1) === 1;
    var a, b, ans;
    if (isAdd) {
      a = randInt(100, 50000);
      b = randInt(100, 50000);
      ans = a + b;
    } else {
      a = randInt(1000, 99999);
      b = randInt(100, a);   // bảo đảm không âm
      ans = a - b;
    }
    var op = isAdd ? '+' : '−';
    // Distractor: lệch hàng (±10, ±100), quên nhớ (±9, ±1).
    var dd = [ans + 100, ans - 100, ans + 10, ans - 10, ans + 9, ans - 1, ans + 1, ans - 9]
      .filter(function (v) { return v >= 0; });
    var mc = makeMC(ans, shuffle(dd), function (v) { return groupDigits(v); }, numericPad);
    return {
      type: 'mc', topic: topic,
      stem: 'Tính: <b>' + groupDigits(a) + ' ' + op + ' ' + groupDigits(b) + '</b>',
      choices: mc.choices, answer: mc.answerIndex,
      explain: groupDigits(a) + ' ' + op + ' ' + groupDigits(b) + ' = ' + groupDigits(ans) +
               ' (đặt tính rồi tính, nhớ canh thẳng hàng).'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 3: NHÂN – CHIA
   * ========================================================================== */
  function genNhanChia() {
    var topic = 'nhan-chia';
    var kind = pick(['bang', 'bang', 'nhan-nhieu', 'chia-nhieu']);

    if (kind === 'bang') {
      // Bảng nhân hoặc chia 2..9.
      var b = randInt(2, 9);
      var c = randInt(2, 9);
      if (randInt(0, 1) === 1) {
        var prod = b * c;
        var dd = [prod + b, prod - b, prod + c, prod - c, prod + 1, prod - 1].filter(function (v) { return v > 0; });
        var mc = makeMC(prod, shuffle(dd), String, numericPad);
        return {
          type: 'mc', topic: topic,
          stem: 'Tính: <b>' + b + ' × ' + c + '</b>',
          choices: mc.choices, answer: mc.answerIndex,
          explain: b + ' × ' + c + ' = ' + prod + ' (bảng nhân ' + b + ').'
        };
      } else {
        var prod2 = b * c;               // số bị chia
        var dd2 = [c + 1, c - 1, c + 2, b, prod2].filter(function (v) { return v > 0 && v !== c; });
        var mc2 = makeMC(c, shuffle(dd2), String, numericPad);
        return {
          type: 'mc', topic: topic,
          stem: 'Tính: <b>' + prod2 + ' ÷ ' + b + '</b>',
          choices: mc2.choices, answer: mc2.answerIndex,
          explain: prod2 + ' ÷ ' + b + ' = ' + c + ' (vì ' + b + ' × ' + c + ' = ' + prod2 + ').'
        };
      }
    }

    if (kind === 'nhan-nhieu') {
      // Số nhiều chữ số × số một chữ số, giữ tích <= 100000.
      var mult = randInt(2, 9);
      var maxA = Math.floor(100000 / mult);
      var a = randInt(11, Math.min(maxA, 11111));
      var ans = a * mult;
      var dd = [ans + 10, ans - 10, ans + mult, ans - mult, ans + 100, ans - 100].filter(function (v) { return v > 0; });
      var mc3 = makeMC(ans, shuffle(dd), function (v) { return groupDigits(v); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Tính: <b>' + groupDigits(a) + ' × ' + mult + '</b>',
        choices: mc3.choices, answer: mc3.answerIndex,
        explain: groupDigits(a) + ' × ' + mult + ' = ' + groupDigits(ans) + '.'
      };
    }

    // chia-nhieu: dựng số bị chia = thương × số chia (chia hết).
    var divisor = randInt(2, 9);
    var quotient = randInt(11, Math.floor(99999 / divisor));
    var dividend = quotient * divisor;
    var dd4 = [quotient + 1, quotient - 1, quotient + 10, quotient - 10].filter(function (v) { return v > 0; });
    var mc4 = makeMC(quotient, shuffle(dd4), function (v) { return groupDigits(v); }, numericPad);
    return {
      type: 'mc', topic: topic,
      stem: 'Tính: <b>' + groupDigits(dividend) + ' ÷ ' + divisor + '</b>',
      choices: mc4.choices, answer: mc4.answerIndex,
      explain: groupDigits(dividend) + ' ÷ ' + divisor + ' = ' + groupDigits(quotient) +
               ' (vì ' + groupDigits(quotient) + ' × ' + divisor + ' = ' + groupDigits(dividend) + ').'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 4: BIỂU THỨC & TÌM X
   * ========================================================================== */
  function genBieuThuc() {
    var topic = 'bieu-thuc';
    var kind = pick(['expr', 'expr', 'timx']);

    if (kind === 'expr') {
      var form = pick(['a+b*c', 'a-b*c', 'a*b+c', 'a*b-c', '(a+b)*c', '(a-b)*c', 'a+b:c', 'a*b:c']);
      var a, b, c, ans, stem;
      // Dựng số đẹp theo từng dạng, tính bằng code, bảo đảm không âm & chia hết.
      switch (form) {
        case 'a+b*c':
          b = randInt(2, 9); c = randInt(2, 9); a = randInt(10, 500);
          ans = a + b * c; stem = a + ' + ' + b + ' × ' + c; break;
        case 'a-b*c':
          b = randInt(2, 9); c = randInt(2, 9); a = randInt(b * c, 900);
          ans = a - b * c; stem = a + ' − ' + b + ' × ' + c; break;
        case 'a*b+c':
          a = randInt(2, 9); b = randInt(2, 9); c = randInt(10, 500);
          ans = a * b + c; stem = a + ' × ' + b + ' + ' + c; break;
        case 'a*b-c':
          a = randInt(3, 9); b = randInt(3, 9); c = randInt(1, a * b);
          ans = a * b - c; stem = a + ' × ' + b + ' − ' + c; break;
        case '(a+b)*c':
          a = randInt(5, 90); b = randInt(5, 90); c = randInt(2, 6);
          ans = (a + b) * c; stem = '(' + a + ' + ' + b + ') × ' + c; break;
        case '(a-b)*c':
          b = randInt(2, 40); a = randInt(b + 1, 90); c = randInt(2, 6);
          ans = (a - b) * c; stem = '(' + a + ' − ' + b + ') × ' + c; break;
        case 'a+b:c':
          c = randInt(2, 9); var q = randInt(2, 9); b = q * c; a = randInt(10, 500);
          ans = a + b / c; stem = a + ' + ' + b + ' ÷ ' + c; break;
        default: // a*b:c  -> tính trái sang phải: (a*b):c, dựng chia hết
          a = randInt(2, 9); b = randInt(2, 9); c = pick(divisorsOf(a * b));
          ans = (a * b) / c; stem = a + ' × ' + b + ' ÷ ' + c; break;
      }
      var dd = wrongOrderDistractors(form, a, b, c, ans);
      var mc = makeMC(ans, dd, function (v) { return groupDigits(v); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Tính giá trị biểu thức: <b>' + stem + '</b>',
        choices: mc.choices, answer: mc.answerIndex,
        explain: explainOrder(form, a, b, c, ans)
      };
    }

    // timx: x+a, x-a, a-x, x*a, x:a  (kết quả là số tự nhiên).
    var t = pick(['x+a', 'x-a', 'a-x', 'x*a', 'x:a']);
    var a2, x, rhs, stem2, expl;
    switch (t) {
      case 'x+a':
        a2 = randInt(10, 5000); x = randInt(10, 5000); rhs = x + a2;
        stem2 = 'x + ' + groupDigits(a2) + ' = ' + groupDigits(rhs);
        expl = 'x = ' + groupDigits(rhs) + ' − ' + groupDigits(a2) + ' = ' + groupDigits(x); break;
      case 'x-a':
        a2 = randInt(10, 5000); x = randInt(a2 + 1, 9000); rhs = x - a2;
        stem2 = 'x − ' + groupDigits(a2) + ' = ' + groupDigits(rhs);
        expl = 'x = ' + groupDigits(rhs) + ' + ' + groupDigits(a2) + ' = ' + groupDigits(x); break;
      case 'a-x':
        x = randInt(10, 4000); a2 = randInt(x + 1, 9000); rhs = a2 - x;
        stem2 = groupDigits(a2) + ' − x = ' + groupDigits(rhs);
        expl = 'x = ' + groupDigits(a2) + ' − ' + groupDigits(rhs) + ' = ' + groupDigits(x); break;
      case 'x*a':
        a2 = randInt(2, 9); x = randInt(2, 9999); rhs = x * a2;
        stem2 = 'x × ' + a2 + ' = ' + groupDigits(rhs);
        expl = 'x = ' + groupDigits(rhs) + ' ÷ ' + a2 + ' = ' + groupDigits(x); break;
      default: // x:a
        a2 = randInt(2, 9); x = a2 * randInt(2, 9999); rhs = x / a2;
        stem2 = 'x ÷ ' + a2 + ' = ' + groupDigits(rhs);
        expl = 'x = ' + groupDigits(rhs) + ' × ' + a2 + ' = ' + groupDigits(x); break;
    }
    return {
      type: 'input', topic: topic,
      stem: 'Tìm x (chỉ gõ chữ số): <b>' + stem2 + '</b>',
      answer: String(x),
      explain: expl + '.'
    };
  }

  // Ước của n trong khoảng nhỏ (>=2, <=n), dùng cho a*b:c chia hết.
  function divisorsOf(n) {
    var out = [];
    for (var i = 2; i <= n; i++) if (n % i === 0) out.push(i);
    if (out.length === 0) out.push(n);
    return out;
  }

  // Distractor "sai thứ tự phép tính" + lệch nhỏ, theo từng dạng biểu thức.
  function wrongOrderDistractors(form, a, b, c, ans) {
    var list = [];
    switch (form) {
      case 'a+b*c': list.push((a + b) * c); break;       // cộng trước
      case 'a-b*c': list.push((a - b) * c); break;
      case 'a*b+c': list.push(a * (b + c)); break;        // cộng trước
      case 'a*b-c': list.push(a * (b - c)); break;
      case '(a+b)*c': list.push(a + b * c); break;        // quên ngoặc
      case '(a-b)*c': list.push(a - b * c); break;
      case 'a+b:c': list.push((a + b) / c); break;
      case 'a*b:c': list.push(a * b * c); break;
    }
    list.push(ans + 1, ans - 1, ans + 10, ans - 10);
    return shuffle(list.filter(function (v) { return v >= 0 && Number.isInteger(v); }));
  }

  function explainOrder(form, a, b, c, ans) {
    var msg = {
      'a+b*c': 'Nhân trước: ' + b + ' × ' + c + ' = ' + (b * c) + ', rồi cộng: ' + a + ' + ' + (b * c) + ' = ' + ans + '.',
      'a-b*c': 'Nhân trước: ' + b + ' × ' + c + ' = ' + (b * c) + ', rồi trừ: ' + a + ' − ' + (b * c) + ' = ' + ans + '.',
      'a*b+c': 'Nhân trước: ' + a + ' × ' + b + ' = ' + (a * b) + ', rồi cộng: ' + (a * b) + ' + ' + c + ' = ' + ans + '.',
      'a*b-c': 'Nhân trước: ' + a + ' × ' + b + ' = ' + (a * b) + ', rồi trừ: ' + (a * b) + ' − ' + c + ' = ' + ans + '.',
      '(a+b)*c': 'Trong ngoặc trước: ' + a + ' + ' + b + ' = ' + (a + b) + ', rồi nhân: ' + (a + b) + ' × ' + c + ' = ' + ans + '.',
      '(a-b)*c': 'Trong ngoặc trước: ' + a + ' − ' + b + ' = ' + (a - b) + ', rồi nhân: ' + (a - b) + ' × ' + c + ' = ' + ans + '.',
      'a+b:c': 'Chia trước: ' + b + ' ÷ ' + c + ' = ' + (b / c) + ', rồi cộng: ' + a + ' + ' + (b / c) + ' = ' + ans + '.',
      'a*b:c': 'Tính từ trái sang phải: ' + a + ' × ' + b + ' = ' + (a * b) + ', rồi ' + (a * b) + ' ÷ ' + c + ' = ' + ans + '.'
    };
    return msg[form];
  }

  /* ============================================================================
   *  CHỦ ĐỀ 5: CHIA CÓ DƯ
   * ========================================================================== */
  function genChiaDu() {
    var topic = 'chia-du';
    var divisor = randInt(2, 9);
    var quotient = randInt(2, 999);
    var rem = randInt(1, divisor - 1);          // 0 < dư < số chia
    var dividend = quotient * divisor + rem;
    // Đáp án dạng "thương dư số_dư"; check sẽ chuẩn hoá "dư/du/r".
    var ansCanon = quotient + ' dư ' + rem;
    return {
      type: 'input', topic: topic,
      stem: 'Đặt tính rồi tính (ghi dạng "thương dư số dư"): <b>' +
            groupDigits(dividend) + ' ÷ ' + divisor + '</b>',
      answer: ansCanon,
      explain: groupDigits(dividend) + ' ÷ ' + divisor + ' = ' + quotient + ' (dư ' + rem + '), vì ' +
               quotient + ' × ' + divisor + ' + ' + rem + ' = ' + groupDigits(dividend) +
               '; số dư ' + rem + ' < số chia ' + divisor + '.'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 6: ĐO LƯỜNG
   * ========================================================================== */
  function genDoLuong() {
    var topic = 'do-luong';
    var kind = pick(['dodai', 'dodai-hh', 'khoiluong', 'thoigian', 'tien', 'lit', 'xemgio']);

    if (kind === 'dodai') {
      // Đổi đơn vị độ dài liền kề (×10) hoặc km-m, m-cm.
      var pairs = [
        { from: 'km', to: 'm', k: 1000 },
        { from: 'm', to: 'cm', k: 100 },
        { from: 'm', to: 'dm', k: 10 },
        { from: 'dm', to: 'cm', k: 10 },
        { from: 'cm', to: 'mm', k: 10 },
        { from: 'm', to: 'mm', k: 1000 }
      ];
      var p = pick(pairs);
      var val = randInt(2, 9) * (p.k >= 1000 ? randInt(1, 9) : randInt(1, 12));
      if (val < 2) val = 2;
      var ans = val * p.k;
      var dd = [ans * 10, Math.round(ans / 10), val, ans + p.k, ans - p.k].filter(function (v) { return v > 0 && Number.isInteger(v); });
      var mc = makeMC(ans, dd, function (v) { return groupDigits(v); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Đổi đơn vị: <b>' + val + ' ' + p.from + ' = ___ ' + p.to + '</b>',
        choices: mc.choices, answer: mc.answerIndex,
        explain: '1 ' + p.from + ' = ' + groupDigits(p.k) + ' ' + p.to + ', nên ' + val + ' ' + p.from +
                 ' = ' + val + ' × ' + groupDigits(p.k) + ' = ' + groupDigits(ans) + ' ' + p.to + '.'
      };
    }

    if (kind === 'dodai-hh') {
      // Dạng hỗn hợp "5 m 7 cm = ... cm".
      var hh = pick([
        { big: 'm', small: 'cm', k: 100 },
        { big: 'm', small: 'dm', k: 10 },
        { big: 'dm', small: 'cm', k: 10 },
        { big: 'cm', small: 'mm', k: 10 },
        { big: 'km', small: 'm', k: 1000 }
      ]);
      var bigV = randInt(1, 9);
      var smallV = randInt(1, hh.k - 1);
      var ans2 = bigV * hh.k + smallV;
      var dd2 = [bigV * hh.k * 10 + smallV, bigV + smallV, bigV * hh.k + smallV * 10, bigV * hh.k].filter(function (v) { return v > 0; });
      var mc2 = makeMC(ans2, dd2, function (v) { return groupDigits(v); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Đổi ra ' + hh.small + ': <b>' + bigV + ' ' + hh.big + ' ' + smallV + ' ' + hh.small + ' = ___ ' + hh.small + '</b>',
        choices: mc2.choices, answer: mc2.answerIndex,
        explain: bigV + ' ' + hh.big + ' = ' + groupDigits(bigV * hh.k) + ' ' + hh.small + '; cộng thêm ' +
                 smallV + ' ' + hh.small + ' = ' + groupDigits(ans2) + ' ' + hh.small + '.'
      };
    }

    if (kind === 'khoiluong') {
      var kgV = randInt(2, 30);
      var ans3 = kgV * 1000;
      var dd3 = [kgV * 100, kgV * 10000, kgV, ans3 + 1000, ans3 - 1000].filter(function (v) { return v > 0; });
      var mc3 = makeMC(ans3, dd3, function (v) { return groupDigits(v); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Đổi đơn vị: <b>' + kgV + ' kg = ___ g</b>',
        choices: mc3.choices, answer: mc3.answerIndex,
        explain: '1 kg = 1 000 g, nên ' + kgV + ' kg = ' + kgV + ' × 1 000 = ' + groupDigits(ans3) + ' g.'
      };
    }

    if (kind === 'thoigian') {
      var tg = pick([
        { from: 'giờ', to: 'phút', k: 60 },
        { from: 'phút', to: 'giây', k: 60 },
        { from: 'tuần', to: 'ngày', k: 7 },
        { from: 'ngày', to: 'giờ', k: 24 }
      ]);
      var tv = randInt(2, 9);
      var ans4 = tv * tg.k;
      var dd4 = [tv * (tg.k + 10), tv, ans4 + tg.k, ans4 - tg.k, tv + tg.k].filter(function (v) { return v > 0; });
      var mc4 = makeMC(ans4, dd4, function (v) { return String(v); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Đổi đơn vị: <b>' + tv + ' ' + tg.from + ' = ___ ' + tg.to + '</b>',
        choices: mc4.choices, answer: mc4.answerIndex,
        explain: '1 ' + tg.from + ' = ' + tg.k + ' ' + tg.to + ', nên ' + tv + ' ' + tg.from +
                 ' = ' + tv + ' × ' + tg.k + ' = ' + ans4 + ' ' + tg.to + '.'
      };
    }

    if (kind === 'tien') {
      // Cộng/đổi tiền Việt với các mệnh giá quen thuộc (nghìn đồng).
      var menh = [1000, 2000, 5000, 10000, 20000];
      var soTo = randInt(2, 5);
      var loai = pick(menh);
      var ans5 = soTo * loai;
      var dd5 = [ans5 + loai, ans5 - loai, soTo * 10, ans5 * 10 / 10 + 1000].filter(function (v) { return v > 0 && v !== ans5; });
      var mc5 = makeMC(ans5, dd5, function (v) { return groupDigits(v); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Có ' + soTo + ' tờ tiền loại <b>' + groupDigits(loai) + ' đồng</b>. Hỏi tất cả bao nhiêu đồng?',
        choices: mc5.choices, answer: mc5.answerIndex,
        explain: soTo + ' × ' + groupDigits(loai) + ' = ' + groupDigits(ans5) + ' đồng.'
      };
    }

    if (kind === 'lit') {
      var canA = randInt(2, 40);
      var canB = randInt(2, 40);
      var ans6 = canA + canB;
      var dd6 = [canA * canB, Math.abs(canA - canB), ans6 + 1, ans6 - 1].filter(function (v) { return v > 0; });
      var mc6 = makeMC(ans6, dd6, function (v) { return String(v); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Can thứ nhất có ' + canA + ' l dầu, can thứ hai có ' + canB + ' l dầu. Cả hai can có ___ l?',
        choices: mc6.choices, answer: mc6.answerIndex,
        explain: canA + ' + ' + canB + ' = ' + ans6 + ' (lít).'
      };
    }

    // xemgio: mô tả bằng chữ, đổi cách đọc giờ.
    var hour = randInt(1, 12);
    var minuteKinds = [
      { m: 0, txt: 'đúng ' + hour + ' giờ' },
      { m: 30, txt: hour + ' giờ rưỡi' },
      { m: 15, txt: hour + ' giờ 15 phút' },
      { m: 45, txt: (hour === 12 ? 1 : hour + 1) + ' giờ kém 15 phút' }
    ];
    var mk = pick(minuteKinds);
    var canon = hour + ' giờ ' + mk.m + ' phút';
    var distract = [
      (hour === 12 ? 1 : hour + 1) + ' giờ ' + mk.m + ' phút',
      hour + ' giờ ' + ((mk.m + 15) % 60) + ' phút',
      hour + ' giờ ' + ((mk.m + 30) % 60) + ' phút'
    ];
    var mc7 = makeMC(canon, distract, function (x) { return x; }, function () {
      return randInt(1, 12) + ' giờ ' + (randInt(0, 11) * 5) + ' phút';
    });
    return {
      type: 'mc', topic: topic,
      stem: 'Đồng hồ chỉ <b>' + mk.txt + '</b>. Tức là mấy giờ mấy phút?',
      choices: mc7.choices, answer: mc7.answerIndex,
      explain: '"' + mk.txt + '" nghĩa là ' + canon + '.'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 7: HÌNH HỌC (chu vi & diện tích HCN, HV)
   * ========================================================================== */
  function genHinhHoc() {
    var topic = 'hinh-hoc';
    var kind = pick(['cv-hcn', 'dt-hcn', 'cv-hv', 'dt-hv', 'nguoc-cv-hv', 'nguoc-dt-hv', 'nguoc-cv-hcn']);
    var unit = pick(['cm', 'm']);
    var unit2 = unit + '²';

    if (kind === 'cv-hcn') {
      var d = randInt(5, 40), r = randInt(2, d - 1);
      var ans = (d + r) * 2;
      // Distractor: nhầm với diện tích, quên ×2, cộng thiếu.
      var dd = [d * r, d + r, (d + r), d * r * 2].filter(function (v) { return v !== ans; });
      dd.push(d + r);
      var mc = makeMC(ans, dd, function (v) { return groupDigits(v) + ' ' + unit; }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Hình chữ nhật có chiều dài ' + d + ' ' + unit + ', chiều rộng ' + r + ' ' + unit + '. <b>Chu vi</b> là:',
        choices: mc.choices, answer: mc.answerIndex,
        explain: 'Chu vi = (dài + rộng) × 2 = (' + d + ' + ' + r + ') × 2 = ' + ans + ' ' + unit + '.'
      };
    }

    if (kind === 'dt-hcn') {
      var d2 = randInt(3, 30), r2 = randInt(2, d2);
      var ans2 = d2 * r2;
      var dd2 = [(d2 + r2) * 2, d2 + r2, d2 * r2 * 2, (d2 + r2)].filter(function (v) { return v !== ans2; });
      var mc2 = makeMC(ans2, dd2, function (v) { return groupDigits(v) + ' ' + unit2; }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Hình chữ nhật có chiều dài ' + d2 + ' ' + unit + ', chiều rộng ' + r2 + ' ' + unit + '. <b>Diện tích</b> là:',
        choices: mc2.choices, answer: mc2.answerIndex,
        explain: 'Diện tích = dài × rộng = ' + d2 + ' × ' + r2 + ' = ' + ans2 + ' ' + unit2 + '.'
      };
    }

    if (kind === 'cv-hv') {
      var c = randInt(2, 40);
      var ans3 = c * 4;
      var dd3 = [c * c, c * 2, c + 4, c * 3].filter(function (v) { return v !== ans3; });
      var mc3 = makeMC(ans3, dd3, function (v) { return groupDigits(v) + ' ' + unit; }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Hình vuông có cạnh ' + c + ' ' + unit + '. <b>Chu vi</b> là:',
        choices: mc3.choices, answer: mc3.answerIndex,
        explain: 'Chu vi hình vuông = cạnh × 4 = ' + c + ' × 4 = ' + ans3 + ' ' + unit + '.'
      };
    }

    if (kind === 'dt-hv') {
      var c2 = randInt(2, 30);
      var ans4 = c2 * c2;
      var dd4 = [c2 * 4, c2 * 2, c2 + c2, c2 * 3].filter(function (v) { return v !== ans4; });
      var mc4 = makeMC(ans4, dd4, function (v) { return groupDigits(v) + ' ' + unit2; }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Hình vuông có cạnh ' + c2 + ' ' + unit + '. <b>Diện tích</b> là:',
        choices: mc4.choices, answer: mc4.answerIndex,
        explain: 'Diện tích hình vuông = cạnh × cạnh = ' + c2 + ' × ' + c2 + ' = ' + ans4 + ' ' + unit2 + '.'
      };
    }

    if (kind === 'nguoc-cv-hv') {
      var c3 = randInt(2, 40);
      var cv = c3 * 4;
      return {
        type: 'input', topic: topic,
        stem: 'Hình vuông có chu vi ' + cv + ' ' + unit + '. <b>Cạnh</b> hình vuông dài bao nhiêu ' + unit + '? (gõ số)',
        answer: String(c3),
        explain: 'Cạnh = chu vi ÷ 4 = ' + cv + ' ÷ 4 = ' + c3 + ' ' + unit + '.'
      };
    }

    if (kind === 'nguoc-dt-hv') {
      var c4 = randInt(2, 12);     // để diện tích là số chính phương đẹp
      var dt = c4 * c4;
      return {
        type: 'input', topic: topic,
        stem: 'Hình vuông có diện tích ' + dt + ' ' + unit2 + '. <b>Cạnh</b> hình vuông dài bao nhiêu ' + unit + '? (gõ số)',
        answer: String(c4),
        explain: 'Tìm cạnh sao cho cạnh × cạnh = ' + dt + ': đó là ' + c4 + ' (vì ' + c4 + ' × ' + c4 + ' = ' + dt + ').'
      };
    }

    // nguoc-cv-hcn: biết chu vi & 1 cạnh -> tìm cạnh kia.
    var d5 = randInt(5, 40), r5 = randInt(2, d5 - 1);
    var cv2 = (d5 + r5) * 2;
    return {
      type: 'input', topic: topic,
      stem: 'Hình chữ nhật có chu vi ' + cv2 + ' ' + unit + ', chiều dài ' + d5 + ' ' + unit +
            '. <b>Chiều rộng</b> bao nhiêu ' + unit + '? (gõ số)',
      answer: String(r5),
      explain: 'Nửa chu vi = ' + cv2 + ' ÷ 2 = ' + (cv2 / 2) + '. Chiều rộng = ' + (cv2 / 2) + ' − ' + d5 + ' = ' + r5 + ' ' + unit + '.'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 8: TOÁN CÓ LỜI VĂN
   * ========================================================================== */
  function genLoiVan() {
    var topic = 'loi-van';
    var kind = pick(['gap', 'giam', 'nhieuhon', 'ithon', 'haibuoc', 'rutvedonvi']);
    var name = pick(NAMES);
    var name2 = pick(NAMES.filter(function (x) { return x !== name; }));
    var obj = pick(OBJS);

    if (kind === 'gap') {
      var a = randInt(3, 50), k = randInt(2, 6);
      var ans = a * k;
      return {
        type: 'input', topic: topic,
        stem: name + ' có ' + a + ' ' + obj.d + '. ' + name2 + ' có số ' + obj.d + ' gấp ' + k +
              ' lần ' + name + '. Hỏi ' + name2 + ' có bao nhiêu ' + obj.d + '? (gõ số)',
        answer: String(ans),
        explain: 'Gấp ' + k + ' lần nghĩa là nhân ' + k + ': ' + a + ' × ' + k + ' = ' + ans + ' ' + obj.dv + '.'
      };
    }

    if (kind === 'giam') {
      var k2 = randInt(2, 6), q = randInt(3, 30);
      var a2 = q * k2;            // bảo đảm chia hết
      var ans2 = a2 / k2;
      return {
        type: 'input', topic: topic,
        stem: name + ' có ' + a2 + ' ' + obj.d + '. Số ' + obj.d + ' của ' + name2 + ' giảm đi ' + k2 +
              ' lần so với ' + name + '. Hỏi ' + name2 + ' có bao nhiêu ' + obj.d + '? (gõ số)',
        answer: String(ans2),
        explain: 'Giảm ' + k2 + ' lần nghĩa là chia ' + k2 + ': ' + a2 + ' ÷ ' + k2 + ' = ' + ans2 + ' ' + obj.dv + '.'
      };
    }

    if (kind === 'nhieuhon') {
      var a3 = randInt(10, 200), m = randInt(3, 50);
      var ans3 = a3 + m;
      return {
        type: 'input', topic: topic,
        stem: name + ' có ' + a3 + ' ' + obj.d + '. ' + name2 + ' có nhiều hơn ' + name + ' ' + m +
              ' ' + obj.d + '. Hỏi ' + name2 + ' có bao nhiêu ' + obj.d + '? (gõ số)',
        answer: String(ans3),
        explain: 'Nhiều hơn nghĩa là cộng thêm: ' + a3 + ' + ' + m + ' = ' + ans3 + ' ' + obj.dv + '.'
      };
    }

    if (kind === 'ithon') {
      var a4 = randInt(50, 300), m2 = randInt(3, 40);
      var ans4 = a4 - m2;
      return {
        type: 'input', topic: topic,
        stem: name + ' có ' + a4 + ' ' + obj.d + '. ' + name2 + ' có ít hơn ' + name + ' ' + m2 +
              ' ' + obj.d + '. Hỏi ' + name2 + ' có bao nhiêu ' + obj.d + '? (gõ số)',
        answer: String(ans4),
        explain: 'Ít hơn nghĩa là bớt đi: ' + a4 + ' − ' + m2 + ' = ' + ans4 + ' ' + obj.dv + '.'
      };
    }

    if (kind === 'haibuoc') {
      // Bài hai bước: có a, cho/bán đi b, rồi gấp k... chọn mẫu cộng-rồi-nhân.
      var perBox = randInt(2, 9), boxes = randInt(2, 9), extra = randInt(5, 50);
      var ans5 = perBox * boxes + extra;
      return {
        type: 'input', topic: topic,
        stem: 'Một cửa hàng có ' + boxes + ' hộp ' + obj.d + ', mỗi hộp ' + perBox + ' ' + obj.dv +
              '. Ngoài ra còn ' + extra + ' ' + obj.dv + ' để rời. Hỏi cửa hàng có tất cả bao nhiêu ' + obj.d + '? (gõ số)',
        answer: String(ans5),
        explain: 'Bước 1: ' + boxes + ' hộp × ' + perBox + ' = ' + (perBox * boxes) + '. Bước 2: ' +
                 (perBox * boxes) + ' + ' + extra + ' = ' + ans5 + ' ' + obj.dv + '.'
      };
    }

    // rutvedonvi: biết n vật giá/khối lượng tổng -> tìm cho m vật.
    var per = randInt(2, 9), n1 = randInt(2, 8);
    var total = per * n1;
    var n2num = randInt(2, 9);
    var ans6 = per * n2num;
    return {
      type: 'input', topic: topic,
      stem: name + ' mua ' + n1 + ' ' + obj.dv + ' ' + obj.d + ' hết ' + total + ' nghìn đồng. ' +
            'Hỏi mua ' + n2num + ' ' + obj.dv + ' (cùng loại) hết bao nhiêu nghìn đồng? (gõ số)',
      answer: String(ans6),
      explain: 'Rút về đơn vị: 1 ' + obj.dv + ' giá ' + total + ' ÷ ' + n1 + ' = ' + per + ' nghìn. ' +
               'Vậy ' + n2num + ' ' + obj.dv + ' hết ' + per + ' × ' + n2num + ' = ' + ans6 + ' nghìn đồng.'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 9: PHÁT TRIỂN TƯ DUY
   * ========================================================================== */
  function genTuDuy() {
    var topic = 'tu-duy';
    var kind = pick(['tinhnhanh', 'dayso', 'chan']);

    if (kind === 'tinhnhanh') {
      // a×c + b×c = (a+b)×c — tính nhanh nhân tử chung.
      var c = randInt(2, 9), a = randInt(2, 30), b = randInt(2, 30);
      var ans = (a + b) * c;
      var dd = [a * c + b, (a + b) + c, a * b * c, ans + c, ans - c].filter(function (v) { return v > 0 && v !== ans; });
      var mc = makeMC(ans, dd, function (v) { return groupDigits(v); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Tính nhanh: <b>' + a + ' × ' + c + ' + ' + b + ' × ' + c + '</b>',
        choices: mc.choices, answer: mc.answerIndex,
        explain: 'Đặt thừa số chung: ' + a + ' × ' + c + ' + ' + b + ' × ' + c + ' = (' + a + ' + ' + b +
                 ') × ' + c + ' = ' + (a + b) + ' × ' + c + ' = ' + ans + '.'
      };
    }

    if (kind === 'dayso') {
      // Dãy số có quy luật: cộng d, hoặc nhân r.
      var typ = pick(['add', 'mul']);
      if (typ === 'add') {
        var start = randInt(1, 20), d = randInt(2, 9);
        var seq = [start, start + d, start + 2 * d, start + 3 * d];
        var next = start + 4 * d;
        return {
          type: 'input', topic: topic,
          stem: 'Tìm số tiếp theo của dãy: <b>' + seq.join('; ') + '; ...</b> (gõ số)',
          answer: String(next),
          explain: 'Quy luật: mỗi số hơn số trước ' + d + ' đơn vị. Số tiếp theo = ' + seq[3] + ' + ' + d + ' = ' + next + '.'
        };
      } else {
        var start2 = randInt(1, 3), r = randInt(2, 3);
        var seq2 = [start2, start2 * r, start2 * r * r, start2 * r * r * r];
        var next2 = seq2[3] * r;
        return {
          type: 'input', topic: topic,
          stem: 'Tìm số tiếp theo của dãy: <b>' + seq2.join('; ') + '; ...</b> (gõ số)',
          answer: String(next2),
          explain: 'Quy luật: mỗi số gấp ' + r + ' lần số trước. Số tiếp theo = ' + seq2[3] + ' × ' + r + ' = ' + next2 + '.'
        };
      }
    }

    // chan: tìm số tự nhiên x thoả a < x < a+2 (đáp án duy nhất a+1).
    var a2 = randInt(1, 9998);
    var x = a2 + 1;
    return {
      type: 'input', topic: topic,
      stem: 'Tìm số tự nhiên x, biết: <b>' + a2 + ' &lt; x &lt; ' + (a2 + 2) + '</b> (gõ số)',
      answer: String(x),
      explain: 'Số tự nhiên lớn hơn ' + a2 + ' và bé hơn ' + (a2 + 2) + ' chỉ có thể là ' + x + '.'
    };
  }

  /* ============================================================================
   *  ĐĂNG KÝ CHỦ ĐỀ + API
   * ========================================================================== */
  var topics = [
    { id: 'so-100000', name: 'Số đến 100 000', emoji: '🔢', gen: genSo100000 },
    { id: 'cong-tru', name: 'Cộng – Trừ', emoji: '➕', gen: genCongTru },
    { id: 'nhan-chia', name: 'Nhân – Chia', emoji: '✖️', gen: genNhanChia },
    { id: 'bieu-thuc', name: 'Biểu thức & Tìm x', emoji: '🧮', gen: genBieuThuc },
    { id: 'chia-du', name: 'Chia có dư', emoji: '➗', gen: genChiaDu },
    { id: 'do-luong', name: 'Đo lường', emoji: '📏', gen: genDoLuong },
    { id: 'hinh-hoc', name: 'Hình học', emoji: '⬛', gen: genHinhHoc },
    { id: 'loi-van', name: 'Toán có lời văn', emoji: '📖', gen: genLoiVan },
    { id: 'tu-duy', name: 'Phát triển tư duy', emoji: '💡', gen: genTuDuy }
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
  // Chuẩn hoá đáp án người dùng: bỏ khoảng trắng/dấu phân nhóm, hạ chữ thường,
  // quy "du"/"r" về "dư", chuẩn hoá dấu phân cách dãy.
  function normalize(s) {
    if (s === null || s === undefined) return '';
    var str = String(s).trim().toLowerCase();
    // Chuẩn hoá biến thể của "dư" trong chia có dư: "du", "r".
    str = str.replace(/\bdu\b/g, 'dư').replace(/\br\b/g, 'dư').replace(/dư+/g, 'dư');
    // Bỏ dấu phân nhóm nghìn: dấu chấm/phẩy GIỮA các chữ số (không đụng khoảng trắng,
    // để còn phân biệt được các phần tử trong dãy "100 200 300").
    str = str.replace(/(\d)[.,](?=\d)/g, '$1');
    // Ngăn cách dãy số: dấu ; , hoặc khoảng trắng giữa các cụm -> ';'
    str = str.replace(/\s*[;,]\s*/g, ';').replace(/\s+/g, ';');
    // Bỏ dấu cách nghìn còn sót dạng "12;345" CHỈ khi không phải dãy nhiều cụm:
    // không xử lý ở đây để tránh nhầm; thay vào đó dùng nhánh số riêng khi so input.
    // Gọn khoảng trắng quanh "dư": "12 dư 3" -> "12dư3"
    str = str.replace(/;?dư;?/g, 'dư');
    return str;
  }

  // Chuẩn hoá riêng cho đáp án dạng MỘT số nguyên: bỏ mọi dấu phân nhóm
  // (khoảng trắng/chấm/phẩy) để "12 345" === "12345".
  function normalizeNumeric(s) {
    return String(s == null ? '' : s).trim().toLowerCase().replace(/[\s.,]/g, '');
  }

  // Chuẩn hoá riêng cho đáp án dạng DÃY SỐ (câu sắp xếp): tách phần tử theo bất kỳ
  // dấu ngăn cách nào trẻ hay dùng (";", ",", khoảng trắng), mỗi phần tử chỉ giữ chữ số
  // (bỏ dấu chấm phân nhóm còn sót). Nhờ vậy "12,34,56" = "12; 34; 56" = "12 34 56".
  function normalizeSeq(s) {
    return String(s == null ? '' : s).trim().toLowerCase()
      .split(/[;,\s]+/)
      .filter(function (x) { return x.length; })
      .map(function (x) { return x.replace(/\D/g, ''); })
      .filter(function (x) { return x.length; })
      .join(';');
  }

  // So sánh đáp án input: thử cả 2 cách (số nguyên thuần & dạng dãy/chữ).
  function matchInput(answer, userInput) {
    // Đáp án là DÃY (chứa ';'): so theo từng phần tử, chấp nhận mọi dấu ngăn cách.
    if (String(answer).indexOf(';') !== -1) {
      return normalizeSeq(userInput) === normalizeSeq(answer);
    }
    if (normalize(userInput) === normalize(answer)) return true;
    // Nếu cả hai là một số (có thể có dấu phân nhóm) thì so theo số thuần.
    if (normalizeNumeric(userInput) === normalizeNumeric(answer) &&
        /\d/.test(String(answer)) && !/[a-zưd ;]/i.test(normalize(answer).replace(/dư/, ''))) {
      return true;
    }
    return false;
  }

  function check(question, userInput) {
    if (!question) return false;
    if (question.type === 'mc') {
      // GIAO KÈO: với trắc nghiệm, frontend LUÔN gửi INDEX (số nguyên 0..len-1)
      // của phương án bé chọn. Không so theo nội dung text để tránh nhập nhằng
      // khi phương án bản thân là một con số (vd choices ["1","2","3","4"]).
      var idx = Number(userInput);
      return Number.isInteger(idx) && idx === question.answer;
    }
    // input: tự chuẩn hoá (bỏ dấu cách nghìn, hoa-thường, "dư/du/r", dãy số).
    return matchInput(question.answer, userInput);
  }

  var QuestionEngine = {
    topics: topics,
    generate: generate,
    generateMixed: generateMixed,
    check: check,
    // Hàm phụ trợ (tiện cho test & frontend nếu cần).
    _readNumberVi: readNumberVi,
    _groupDigits: groupDigits,
    _normalize: normalize
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = QuestionEngine;
  if (typeof window !== 'undefined') window.QuestionEngine = QuestionEngine;
  // Cũng gán ra global (node REPL / test).
  if (typeof globalThis !== 'undefined') globalThis.QuestionEngine = QuestionEngine;
})();
