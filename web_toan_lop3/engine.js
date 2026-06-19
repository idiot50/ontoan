/*
 * engine.js — Động cơ sinh câu hỏi Toán lớp 3 (đã nâng độ khó theo NANG_DO_KHO_spec.md)
 * Classic script: chạy được qua <script src> (file://) lẫn node (require).
 * Mọi câu hỏi tuân theo "giao kèo dữ liệu":
 *   { type:'mc'|'input', topic, stem, choices?, answer, explain }
 * Số luôn trong tầm lớp 3 (<= 100 000). answer luôn tính bằng code.
 *
 * Mỗi chủ đề chia 3 TẦNG độ khó và random theo trọng số ~45/40/15
 * (Cơ bản / Nâng vừa / Thử thách) — luôn còn câu vừa sức xen kẽ để bé không nản.
 * Chỉ dùng +, −, ×, ÷ (gồm chia có dư). Không phân số/thập phân/%/diện tích
 * tam giác–tròn/thể tích/chuyển động; không nêu tên công thức lớp 4.
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

  // Chọn tầng độ khó theo trọng số. tiers = ['co-ban','nang-vua','thu-thach'].
  // Trọng số mặc định 45/40/15 theo spec lớp 3.
  function tier(w0, w1, w2) {
    if (w0 === undefined) { w0 = 45; w1 = 40; w2 = 15; }
    var r = randInt(1, w0 + w1 + w2);
    if (r <= w0) return 0;
    if (r <= w0 + w1) return 1;
    return 2;
  }

  // Định dạng số có dấu cách phân nhóm nghìn để bé dễ đọc: 12345 -> "12 345".
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
   * loại trùng, đảm bảo đủ `want` phương án (bù distractor an toàn nếu thiếu),
   * trộn vị trí, trả về { choices, answerIndex }.
   * - format: hàm biến giá trị -> chuỗi hiển thị (mặc định String).
   * - want: số phương án mong muốn (mặc định 4). Với câu "điền dấu" {>,<,=}
   *   truyền want=3 và KHÔNG truyền padFn để chỉ có đúng 3 dấu, không bù số rác.
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
      // Bỏ distractor là SỐ vượt tầm lớp 3 (> 100 000) để không lộ đáp án sai vô lý.
      if (typeof d === 'number' && Math.abs(d) > 100000) continue;
      var k = format(d);
      if (!seen[k]) {
        seen[k] = true;
        values.push(d);
      }
    }
    // Bù phương án nếu vẫn thiếu (dùng hàm pad sinh giá trị "gần" hợp lý).
    // CHỈ bù khi có padFn — câu so sánh dấu không truyền padFn nên giữ đúng số dấu.
    var guard = 0;
    while (values.length < want && padFn && guard < 200) {
      guard++;
      var extra = padFn(correct, values);
      if (typeof extra === 'number' && Math.abs(extra) > 100000) continue;
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
   *  Cơ bản: đọc/viết/liền trước–sau/so sánh 4 số.
   *  Nâng vừa: giá trị chữ số kết hợp, sắp xếp 5 số, max/min 5 số.
   *  Thử thách: lập số từ thẻ, "tròn nghìn lớn nhất bé hơn N".
   * ========================================================================== */
  function genSo100000() {
    var topic = 'so-100000';
    var t = tier();

    if (t === 0) {
      // ---- TẦNG CƠ BẢN ----
      var kind = pick(['doc', 'viet', 'lientruoc', 'liensau', 'sosanh']);

      if (kind === 'doc') {
        var n = randInt(101, 99999);
        var correct = cap(readNumberVi(n));
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
        var n2 = randInt(101, 99999);
        return {
          type: 'input', topic: topic,
          stem: 'Viết số (chỉ gõ chữ số): <b>' + cap(readNumberVi(n2)) + '</b>',
          answer: String(n2),
          explain: '"' + readNumberVi(n2) + '" viết là ' + groupDigits(n2) + '.'
        };
      }

      if (kind === 'lientruoc' || kind === 'liensau') {
        var n4 = randInt(1001, 99998);
        var which = kind === 'liensau' ? 1 : 0;
        var ans = which ? n4 + 1 : n4 - 1;
        var label = which ? 'liền sau' : 'liền trước';
        return {
          type: 'input', topic: topic,
          stem: 'Số ' + label + ' của <b>' + groupDigits(n4) + '</b> là:',
          answer: String(ans),
          explain: which
            ? 'Số liền sau hơn 1 đơn vị: ' + groupDigits(n4) + ' + 1 = ' + groupDigits(ans) + '.'
            : 'Số liền trước kém 1 đơn vị: ' + groupDigits(n4) + ' − 1 = ' + groupDigits(ans) + '.'
        };
      }

      // sosanh 2 số
      var a = randInt(1000, 99999);
      var b;
      if (randInt(0, 2) === 0) b = a; else { do { b = a + randInt(-500, 500); } while (b < 1000 || b > 99999); }
      var correctSign = a > b ? '>' : (a < b ? '<' : '=');
      // Câu điền dấu: CHỈ 3 phương án {>,<,=}, không bù phương án số rác.
      var mc3 = makeMC(correctSign, ['>', '<', '='], function (x) { return x; }, null, 3);
      return {
        type: 'mc', topic: topic,
        stem: 'Điền dấu thích hợp: <b>' + groupDigits(a) + ' ___ ' + groupDigits(b) + '</b>',
        choices: mc3.choices, answer: mc3.answerIndex,
        explain: groupDigits(a) + ' ' + correctSign + ' ' + groupDigits(b) +
                 (correctSign === '=' ? ' (hai số bằng nhau).' : ' (so sánh từ hàng cao nhất xuống).')
      };
    }

    if (t === 1) {
      // ---- TẦNG NÂNG VỪA ----
      var kind2 = pick(['giatri', 'giatri-nguoc', 'sapxep5', 'maxmin5']);

      if (kind2 === 'giatri') {
        // Giá trị của chữ số theo hàng.
        var g = randInt(10000, 99999);
        var s = String(g);
        var hangs = ['hàng đơn vị', 'hàng chục', 'hàng trăm', 'hàng nghìn', 'hàng chục nghìn'];
        var pos = randInt(0, 4);
        var digit = Number(s[s.length - 1 - pos]);
        var value = digit * Math.pow(10, pos);
        var dd = [digit, value * 10, digit * Math.pow(10, (pos + 1) % 5),
          pos > 0 ? value / 10 : digit * 10]
          .filter(function (v) { return Number.isInteger(v) && v >= 0; });
        var mcg = makeMC(value, dd, function (x) { return groupDigits(x); }, numericPad);
        return {
          type: 'mc', topic: topic,
          stem: 'Trong số <b>' + groupDigits(g) + '</b>, chữ số <b>' + digit +
                '</b> ở ' + hangs[pos] + ' có giá trị là:',
          choices: mcg.choices, answer: mcg.answerIndex,
          explain: 'Chữ số ' + digit + ' đứng ở ' + hangs[pos] + ' nên có giá trị ' +
                   digit + ' × ' + groupDigits(Math.pow(10, pos)) + ' = ' + groupDigits(value) + '.'
        };
      }

      if (kind2 === 'giatri-nguoc') {
        // Suy luận ngược: chữ số D có giá trị V thì nó ở hàng nào? (mc)
        var hangs2 = ['hàng đơn vị', 'hàng chục', 'hàng trăm', 'hàng nghìn', 'hàng chục nghìn'];
        var pos2 = randInt(1, 4);
        var digit2 = randInt(1, 9);
        var val2 = digit2 * Math.pow(10, pos2);
        // Dựng một số 5 chữ số có chữ số digit2 đúng ở hàng pos2.
        var arrd = [];
        for (var i = 0; i < 5; i++) arrd.push(randInt(0, 9));
        arrd[4] = randInt(1, 9);            // hàng chục nghìn khác 0
        arrd[4 - pos2] = digit2;            // đặt chữ số mục tiêu
        var num2 = Number(arrd.join(''));
        var correctH = hangs2[pos2];
        var distH = hangs2.filter(function (h) { return h !== correctH; });
        var mch = makeMC(correctH, shuffle(distH), function (x) { return x; });
        return {
          type: 'mc', topic: topic,
          stem: 'Trong số <b>' + groupDigits(num2) + '</b>, chữ số <b>' + digit2 +
                '</b> có giá trị <b>' + groupDigits(val2) + '</b>. Chữ số đó ở hàng nào?',
          choices: mch.choices, answer: mch.answerIndex,
          explain: 'Giá trị ' + groupDigits(val2) + ' = ' + digit2 + ' × ' + groupDigits(Math.pow(10, pos2)) +
                   ' nên chữ số ' + digit2 + ' đứng ở ' + correctH + '.'
        };
      }

      if (kind2 === 'maxmin5') {
        // Max/min trong 5 số gần nhau (cùng hàng chục nghìn để bắt so sánh từng hàng).
        var base = randInt(2, 8) * 10000;
        var nums = [];
        while (nums.length < 5) {
          var x = base + randInt(0, 9999);
          if (nums.indexOf(x) === -1) nums.push(x);
        }
        var wantMax = randInt(0, 1) === 1;
        var target = wantMax ? Math.max.apply(null, nums) : Math.min.apply(null, nums);
        var mcm = makeMC(target, nums, function (v) { return groupDigits(v); });
        return {
          type: 'mc', topic: topic,
          stem: 'Số ' + (wantMax ? 'lớn nhất' : 'bé nhất') + ' trong các số ' +
                nums.map(groupDigits).join('; ') + ' là:',
          choices: mcm.choices, answer: mcm.answerIndex,
          explain: 'So sánh lần lượt từ hàng cao xuống, số ' + (wantMax ? 'lớn nhất' : 'bé nhất') +
                   ' là ' + groupDigits(target) + '.'
        };
      }

      // sapxep5: sắp xếp 5 số gần nhau.
      var base2 = randInt(2, 9) * 10000;
      var arr = [];
      while (arr.length < 5) {
        var y = base2 + randInt(0, 999);
        if (arr.indexOf(y) === -1) arr.push(y);
      }
      var asc = randInt(0, 1) === 1;
      var sorted = arr.slice().sort(function (p, q) { return asc ? p - q : q - p; });
      return {
        type: 'input', topic: topic,
        stem: 'Sắp xếp các số theo thứ tự ' + (asc ? 'từ bé đến lớn' : 'từ lớn đến bé') +
              ' (ngăn cách bởi dấu ;): <b>' + arr.map(groupDigits).join('; ') + '</b>',
        answer: sorted.join(';'),
        explain: 'Thứ tự ' + (asc ? 'tăng dần' : 'giảm dần') + ': ' + sorted.map(groupDigits).join('; ') + '.'
      };
    }

    // ---- TẦNG THỬ THÁCH ----
    var kind3 = pick(['lapso', 'lapso', 'tronghin', 'tronghin']);

    if (kind3 === 'lapso') {
      // Lập số 4 chữ số lớn nhất / bé nhất từ 4 thẻ khác nhau (0 không đứng đầu).
      var digits = [];
      while (digits.length < 4) {
        var dgt = randInt(0, 9);
        if (digits.indexOf(dgt) === -1) digits.push(dgt);
      }
      var wantMax2 = randInt(0, 1) === 1;
      var sortDesc = digits.slice().sort(function (p, q) { return q - p; });
      var sortAsc = digits.slice().sort(function (p, q) { return p - q; });
      var ansNum;
      if (wantMax2) {
        ansNum = Number(sortDesc.join(''));
      } else {
        // Bé nhất: xếp tăng dần nhưng 0 không đứng đầu -> đổi chỗ 0 với chữ số khác 0 nhỏ nhất.
        var a2 = sortAsc.slice();
        if (a2[0] === 0) {
          for (var k = 1; k < a2.length; k++) {
            if (a2[k] !== 0) { var tmp = a2[0]; a2[0] = a2[k]; a2[k] = tmp; break; }
          }
        }
        ansNum = Number(a2.join(''));
      }
      return {
        type: 'input', topic: topic,
        stem: 'Từ bốn thẻ chữ số <b>' + digits.join(', ') + '</b> (mỗi thẻ dùng một lần), ' +
              'hãy lập số có bốn chữ số <b>' + (wantMax2 ? 'lớn nhất' : 'bé nhất') + '</b>. (gõ số)',
        answer: String(ansNum),
        explain: wantMax2
          ? 'Muốn số lớn nhất thì xếp các chữ số giảm dần: ' + sortDesc.join(', ') + ' → ' + groupDigits(ansNum) + '.'
          : 'Muốn số bé nhất thì xếp tăng dần, nhưng chữ số 0 không được đứng đầu nên đưa chữ số khác 0 nhỏ nhất lên đầu → ' + groupDigits(ansNum) + '.'
      };
    }

    // tronghin: số tròn nghìn lớn nhất / bé hơn N (hoặc tròn chục nghìn).
    var roundKind = pick(['nghin', 'nghin', 'chucnghin']);
    if (roundKind === 'nghin') {
      var nn = randInt(2050, 99950);
      // tránh N đúng là số tròn nghìn
      while (nn % 1000 === 0) nn = randInt(2050, 99950);
      var ansR = Math.floor(nn / 1000) * 1000;
      return {
        type: 'input', topic: topic,
        stem: 'Số tròn nghìn lớn nhất mà <b>bé hơn ' + groupDigits(nn) + '</b> là số nào? (gõ số)',
        answer: String(ansR),
        explain: groupDigits(nn) + ' nằm giữa ' + groupDigits(ansR) + ' và ' + groupDigits(ansR + 1000) +
                 '; số tròn nghìn lớn nhất mà còn bé hơn nó là ' + groupDigits(ansR) + '.'
      };
    }
    var nc = randInt(11000, 99000);
    while (nc % 10000 === 0) nc = randInt(11000, 99000);
    var ansC = Math.floor(nc / 10000) * 10000;
    return {
      type: 'input', topic: topic,
      stem: 'Số tròn chục nghìn lớn nhất mà <b>bé hơn ' + groupDigits(nc) + '</b> là số nào? (gõ số)',
      answer: String(ansC),
      explain: groupDigits(nc) + ' nằm giữa ' + groupDigits(ansC) + ' và ' + groupDigits(ansC + 10000) +
               '; số tròn chục nghìn lớn nhất mà còn bé hơn nó là ' + groupDigits(ansC) + '.'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 2: CỘNG – TRỪ TRONG 100 000
   *  Cơ bản: một phép a+b hoặc a−b.
   *  Nâng vừa: chuỗi 3 số a+b−c / a−b+c; tính khéo ghép tròn chục/trăm.
   *  Thử thách: suy luận ngược 2 dữ kiện; biết tổng & phần hơn kém.
   * ========================================================================== */
  function genCongTru() {
    var topic = 'cong-tru';
    var t = tier();

    if (t === 0) {
      // ---- CƠ BẢN: một phép ----
      var isAdd = randInt(0, 1) === 1;
      var a, b, ans;
      if (isAdd) {
        a = randInt(100, 50000);
        b = randInt(100, 50000);
        ans = a + b;
      } else {
        a = randInt(1000, 99999);
        b = randInt(100, a);
        ans = a - b;
      }
      var op = isAdd ? '+' : '−';
      var dd = [ans + 100, ans - 100, ans + 10, ans - 10, ans + 9, ans - 1, ans + 1, ans - 9]
        .filter(function (v) { return v >= 0; });
      var mc = makeMC(ans, shuffle(dd), function (v) { return groupDigits(v); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Tính: <b>' + groupDigits(a) + ' ' + op + ' ' + groupDigits(b) + '</b>',
        choices: mc.choices, answer: mc.answerIndex,
        explain: groupDigits(a) + ' ' + op + ' ' + groupDigits(b) + ' = ' + groupDigits(ans) +
                 ' (đặt tính rồi tính, canh thẳng hàng, nhớ sang hàng kế).'
      };
    }

    if (t === 1) {
      // ---- NÂNG VỪA ----
      var sub = pick(['chuoi3', 'chuoi3', 'tinhkheo']);

      if (sub === 'chuoi3') {
        // a + b − c  hoặc  a − b + c, mọi bước >= 0, <= 100000.
        var formAdd = randInt(0, 1) === 1; // true: a+b-c ; false: a-b+c
        var a3, b3, c3, ans3, stem3, step1, e1, e2;
        if (formAdd) {
          a3 = randInt(5000, 40000);
          b3 = randInt(1000, 40000);
          step1 = a3 + b3;                 // <= 80000
          c3 = randInt(500, step1);        // không âm
          ans3 = step1 - c3;
          stem3 = groupDigits(a3) + ' + ' + groupDigits(b3) + ' − ' + groupDigits(c3);
          e1 = groupDigits(a3) + ' + ' + groupDigits(b3) + ' = ' + groupDigits(step1);
          e2 = groupDigits(step1) + ' − ' + groupDigits(c3) + ' = ' + groupDigits(ans3);
        } else {
          a3 = randInt(20000, 90000);
          b3 = randInt(500, a3);
          step1 = a3 - b3;
          c3 = randInt(500, Math.min(40000, 100000 - step1));
          ans3 = step1 + c3;
          stem3 = groupDigits(a3) + ' − ' + groupDigits(b3) + ' + ' + groupDigits(c3);
          e1 = groupDigits(a3) + ' − ' + groupDigits(b3) + ' = ' + groupDigits(step1);
          e2 = groupDigits(step1) + ' + ' + groupDigits(c3) + ' = ' + groupDigits(ans3);
        }
        // Distractor bẫy lỗi: sai dấu bước 2; bỏ bước 2; lệch hàng.
        var wrongSign = formAdd ? (a3 + b3 + c3) : (a3 - b3 - c3);
        var dd3 = [wrongSign, step1, ans3 + 100, ans3 - 100, ans3 + 10]
          .filter(function (v) { return v >= 0 && v <= 100000 && v !== ans3; });
        var mc3 = makeMC(ans3, dd3, function (v) { return groupDigits(v); }, numericPad);
        return {
          type: 'mc', topic: topic,
          stem: 'Tính: <b>' + stem3 + '</b>',
          choices: mc3.choices, answer: mc3.answerIndex,
          explain: 'Tính từ trái sang phải: ' + e1 + '; ' + e2 + '.'
        };
      }

      // tinhkheo: ghép tròn chục/tròn trăm. (a+d)+(b+e) với cặp tròn 100/tròn 10.
      var kheoBig = randInt(0, 1) === 1; // true: tròn trăm, false: tròn chục
      var unit = kheoBig ? 100 : 10;
      // chọn 4 số sao cho ghép thành 2 cặp tròn unit.
      var p1 = randInt(kheoBig ? 11 : 1, unit - 1);
      var p2 = unit - p1;                       // p1 + p2 = unit
      var p3 = randInt(kheoBig ? 11 : 1, unit - 1);
      var p4 = unit - p3;                       // p3 + p4 = unit
      var four = shuffle([p1, p2, p3, p4]);
      var ansK = unit * 2;
      var ddK = [unit + (p1 + p3), ansK + unit, ansK - unit, ansK + 1, ansK - 1]
        .filter(function (v) { return v > 0 && v !== ansK; });
      var mcK = makeMC(ansK, ddK, function (v) { return groupDigits(v); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Tính nhanh: <b>' + four.join(' + ') + '</b>',
        choices: mcK.choices, answer: mcK.answerIndex,
        explain: 'Ghép các số thành cặp tròn ' + unit + ': (' + p1 + ' + ' + p2 + ') + (' + p3 + ' + ' + p4 +
                 ') = ' + unit + ' + ' + unit + ' = ' + ansK + '.'
      };
    }

    // ---- THỬ THÁCH: suy luận ngược ----
    var sub2 = pick(['nguoc', 'nguoc', 'tonghieu']);

    if (sub2 === 'nguoc') {
      // "Hai số cộng lại được T. Một số là M. Số kia?" -> T - M.
      var total = randInt(20000, 99999);
      var m = randInt(1000, total - 1000);
      var ansN = total - m;
      return {
        type: 'input', topic: topic,
        stem: 'Hai số cộng lại được <b>' + groupDigits(total) + '</b>. Một số là <b>' + groupDigits(m) +
              '</b>. Số kia là bao nhiêu? (gõ số)',
        answer: String(ansN),
        explain: 'Lấy tổng trừ số đã biết: ' + groupDigits(total) + ' − ' + groupDigits(m) + ' = ' +
                 groupDigits(ansN) + '. Thử lại: ' + groupDigits(m) + ' + ' + groupDigits(ansN) + ' = ' + groupDigits(total) + '.'
      };
    }

    // tonghieu: biết tổng & phần hơn kém (KHÔNG nêu tên công thức tổng–hiệu).
    // Dựng TỪ số bé & hiệu nguyên dương -> tổng & mọi số đều nguyên, không âm.
    var soBe = randInt(1000, 24000);
    var diff = randInt(2, 24000);
    var soLon = soBe + diff;
    var sum2 = soBe + soLon;            // tổng (luôn nguyên, <= ~72000)
    return {
      type: 'input', topic: topic,
      stem: 'Hai số có tổng là <b>' + groupDigits(sum2) + '</b>, số lớn hơn số bé <b>' + groupDigits(diff) +
            '</b> đơn vị. Tìm số lớn. (gõ số)',
      answer: String(soLon),
      explain: 'Bước 1: hai lần số lớn = tổng + phần hơn = ' + groupDigits(sum2) + ' + ' + groupDigits(diff) +
               ' = ' + groupDigits(sum2 + diff) + '. Bước 2: số lớn = ' + groupDigits(sum2 + diff) + ' ÷ 2 = ' +
               groupDigits(soLon) + ' (số bé = ' + groupDigits(soBe) + ').'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 3: NHÂN – CHIA
   *  Cơ bản: bảng nhân/chia; nhân/chia số nhiều chữ số với số 1 chữ số.
   *  Nâng vừa: 2 bước (a×b)÷c hoặc (a÷b)×c; so sánh hai tích/thương.
   *  Thử thách: suy luận ngược; gấp rồi gộp.
   * ========================================================================== */
  function genNhanChia() {
    var topic = 'nhan-chia';
    var t = tier();

    if (t === 0) {
      // ---- CƠ BẢN ----
      var kind = pick(['bang-nhan', 'bang-chia', 'nhan-nhieu', 'chia-nhieu']);

      if (kind === 'bang-nhan') {
        var b = randInt(2, 9), c = randInt(2, 9);
        var prod = b * c;
        var dd = [prod + b, prod - b, prod + c, prod - c, prod + 1, prod - 1].filter(function (v) { return v > 0; });
        var mc = makeMC(prod, shuffle(dd), String, numericPad);
        return {
          type: 'mc', topic: topic,
          stem: 'Tính: <b>' + b + ' × ' + c + '</b>',
          choices: mc.choices, answer: mc.answerIndex,
          explain: b + ' × ' + c + ' = ' + prod + ' (bảng nhân ' + b + ').'
        };
      }

      if (kind === 'bang-chia') {
        var b2 = randInt(2, 9), c2 = randInt(2, 9);
        var prod2 = b2 * c2;
        var dd2 = [c2 + 1, c2 - 1, c2 + 2, b2, prod2].filter(function (v) { return v > 0 && v !== c2; });
        var mc2 = makeMC(c2, shuffle(dd2), String, numericPad);
        return {
          type: 'mc', topic: topic,
          stem: 'Tính: <b>' + prod2 + ' ÷ ' + b2 + '</b>',
          choices: mc2.choices, answer: mc2.answerIndex,
          explain: prod2 + ' ÷ ' + b2 + ' = ' + c2 + ' (vì ' + b2 + ' × ' + c2 + ' = ' + prod2 + ').'
        };
      }

      if (kind === 'nhan-nhieu') {
        var mult = randInt(2, 9);
        var maxA = Math.floor(100000 / mult);
        var a = randInt(11, Math.min(maxA, 11111));
        var ans = a * mult;
        var dd3 = [ans + 10, ans - 10, ans + mult, ans - mult, ans + 100, ans - 100].filter(function (v) { return v > 0; });
        var mc3 = makeMC(ans, shuffle(dd3), function (v) { return groupDigits(v); }, numericPad);
        return {
          type: 'mc', topic: topic,
          stem: 'Tính: <b>' + groupDigits(a) + ' × ' + mult + '</b>',
          choices: mc3.choices, answer: mc3.answerIndex,
          explain: groupDigits(a) + ' × ' + mult + ' = ' + groupDigits(ans) + '.'
        };
      }

      // chia-nhieu (chia hết)
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

    if (t === 1) {
      // ---- NÂNG VỪA ----
      var sub = pick(['hai-buoc', 'hai-buoc', 'sosanh']);

      if (sub === 'hai-buoc') {
        var twoForm = randInt(0, 1) === 1; // true: (a×b)÷c ; false: (a÷b)×c
        var a4, b4, c4, ansH, stemH, e1, e2;
        if (twoForm) {
          // (a × b) ÷ c, chia hết, tích <= 100000.
          a4 = randInt(2, 9);
          b4 = randInt(2, 9);
          var prodH = a4 * b4;
          var divs = divisorsOf(prodH).filter(function (d) { return d <= prodH; });
          c4 = pick(divs);
          // nhân thêm hệ số để số đẹp hơn nhưng vẫn an toàn:
          var scale = pick([1, 10, 100]);
          a4 = a4 * scale;
          var prodH2 = a4 * b4;
          ansH = prodH2 / c4;
          stemH = groupDigits(a4) + ' × ' + b4 + ' ÷ ' + c4;
          e1 = groupDigits(a4) + ' × ' + b4 + ' = ' + groupDigits(prodH2);
          e2 = groupDigits(prodH2) + ' ÷ ' + c4 + ' = ' + groupDigits(ansH);
        } else {
          // (a ÷ b) × c, a chia hết cho b.
          b4 = randInt(2, 9);
          var quo = randInt(2, 9) * pick([1, 10, 100]);
          a4 = quo * b4;
          c4 = randInt(2, 9);
          ansH = quo * c4;
          stemH = groupDigits(a4) + ' ÷ ' + b4 + ' × ' + c4;
          e1 = groupDigits(a4) + ' ÷ ' + b4 + ' = ' + groupDigits(quo);
          e2 = groupDigits(quo) + ' × ' + c4 + ' = ' + groupDigits(ansH);
        }
        // Distractor: quên bước 2 (chỉ làm bước 1).
        var step1Val = twoForm ? (a4 * b4) : (a4 / b4);
        var ddH = [step1Val, ansH + c4, ansH - c4, ansH + 10, ansH - 10]
          .filter(function (v) { return v > 0 && Number.isInteger(v) && v !== ansH; });
        var mcH = makeMC(ansH, ddH, function (v) { return groupDigits(v); }, numericPad);
        return {
          type: 'mc', topic: topic,
          stem: 'Tính: <b>' + stemH + '</b>',
          choices: mcH.choices, answer: mcH.answerIndex,
          explain: 'Tính từ trái sang phải: ' + e1 + '; ' + e2 + '.'
        };
      }

      // sosanh hai tích/thương: điền dấu.
      var leftA = randInt(2, 9), leftB = randInt(2, 9);
      var rightA = randInt(2, 9), rightB = randInt(2, 9);
      // dùng nhân cả hai vế cho đơn giản & chắc đúng tầm.
      var scaleS = pick([1, 1, 10]);
      var L = leftA * scaleS * leftB;
      var R = rightA * scaleS * rightB;
      var signS = L > R ? '>' : (L < R ? '<' : '=');
      var leftStr = groupDigits(leftA * scaleS) + ' × ' + leftB;
      var rightStr = groupDigits(rightA * scaleS) + ' × ' + rightB;
      // Câu điền dấu: CHỈ 3 phương án {>,<,=}, không bù phương án số rác.
      var mcS = makeMC(signS, ['>', '<', '='], function (x) { return x; }, null, 3);
      return {
        type: 'mc', topic: topic,
        stem: 'Điền dấu thích hợp: <b>' + leftStr + ' ___ ' + rightStr + '</b>',
        choices: mcS.choices, answer: mcS.answerIndex,
        explain: 'Tính từng vế: ' + leftStr + ' = ' + groupDigits(L) + '; ' + rightStr + ' = ' + groupDigits(R) +
                 '. Vậy ' + groupDigits(L) + ' ' + signS + ' ' + groupDigits(R) + '.'
      };
    }

    // ---- THỬ THÁCH ----
    var sub2 = pick(['nguoc-nhan', 'nguoc-chia', 'gap-gop']);

    if (sub2 === 'nguoc-nhan') {
      // "Số nào nhân k được P?" -> P ÷ k.
      var k = randInt(2, 9);
      var x = randInt(101, Math.floor(99999 / k));
      var P = x * k;
      return {
        type: 'input', topic: topic,
        stem: 'Số nào nhân với <b>' + k + '</b> thì được <b>' + groupDigits(P) + '</b>? (gõ số)',
        answer: String(x),
        explain: 'Lấy tích chia cho thừa số đã biết: ' + groupDigits(P) + ' ÷ ' + k + ' = ' + groupDigits(x) +
                 '. Thử lại: ' + groupDigits(x) + ' × ' + k + ' = ' + groupDigits(P) + '.'
      };
    }

    if (sub2 === 'nguoc-chia') {
      // "Số bị chia là bao nhiêu nếu chia k được thương q (chia hết)?"
      var k2 = randInt(2, 9);
      var q2 = randInt(101, Math.floor(99999 / k2));
      var dividend2 = q2 * k2;
      return {
        type: 'input', topic: topic,
        stem: 'Một số chia cho <b>' + k2 + '</b> được thương <b>' + groupDigits(q2) +
              '</b> (chia hết). Số bị chia là bao nhiêu? (gõ số)',
        answer: String(dividend2),
        explain: 'Số bị chia = thương × số chia = ' + groupDigits(q2) + ' × ' + k2 + ' = ' + groupDigits(dividend2) +
                 '. Thử lại: ' + groupDigits(dividend2) + ' ÷ ' + k2 + ' = ' + groupDigits(q2) + '.'
      };
    }

    // gap-gop: "An có a, Bình gấp k lần An, cả hai có mấy?" -> a + a×k.
    var name = pick(NAMES);
    var name2 = pick(NAMES.filter(function (n) { return n !== name; }));
    var obj = pick(OBJS);
    var aG = randInt(4, 40), kG = randInt(2, 6);
    var binhG = aG * kG;
    var ansG = aG + binhG;
    // Distractor bẫy: dừng ở bước 1 (chỉ Bình); cộng nhầm a+a; quên nhân.
    var ddG = [binhG, aG + aG, aG + kG, ansG + aG]
      .filter(function (v) { return v > 0 && v !== ansG; });
    var mcG = makeMC(ansG, ddG, function (v) { return groupDigits(v); }, numericPad);
    return {
      type: 'mc', topic: topic,
      stem: name + ' có ' + aG + ' ' + obj.d + '. ' + name2 + ' có số ' + obj.d + ' gấp ' + kG +
            ' lần ' + name + '. Cả hai bạn có tất cả bao nhiêu ' + obj.d + '?',
      choices: mcG.choices, answer: mcG.answerIndex,
      explain: name2 + ' có ' + aG + ' × ' + kG + ' = ' + binhG + ' ' + obj.dv + '; cả hai có ' +
               aG + ' + ' + binhG + ' = ' + ansG + ' ' + obj.dv + '.'
    };
  }

  // Ước của n (>=2), dùng cho biểu thức/2 bước chia hết.
  function divisorsOf(n) {
    var out = [];
    for (var i = 2; i <= n; i++) if (n % i === 0) out.push(i);
    if (out.length === 0) out.push(n);
    return out;
  }

  /* ============================================================================
   *  CHỦ ĐỀ 4: BIỂU THỨC & TÌM X
   *  Cơ bản: biểu thức 2 phép; tìm x một bước.
   *  Nâng vừa: biểu thức 3 phép có ngoặc.
   *  Thử thách: tìm x 2 bước.
   * ========================================================================== */
  function genBieuThuc() {
    var topic = 'bieu-thuc';
    var t = tier();

    if (t === 0) {
      // ---- CƠ BẢN: biểu thức 2 phép, hoặc tìm x 1 bước ----
      if (randInt(0, 1) === 1) {
        var form = pick(['a+b*c', 'a-b*c', 'a*b+c', 'a*b-c', '(a+b)*c', '(a-b)*c', 'a+b:c', 'a*b:c']);
        var built = buildExpr2(form);
        var dd = wrongOrderDistractors(form, built.a, built.b, built.c, built.ans);
        var mc = makeMC(built.ans, dd, function (v) { return groupDigits(v); }, numericPad);
        return {
          type: 'mc', topic: topic,
          stem: 'Tính giá trị biểu thức: <b>' + built.stem + '</b>',
          choices: mc.choices, answer: mc.answerIndex,
          explain: explainOrder(form, built.a, built.b, built.c, built.ans)
        };
      }
      // tìm x 1 bước
      var oneStep = genFindX1();
      return oneStep;
    }

    if (t === 1) {
      // ---- NÂNG VỪA: biểu thức 3 phép có ngoặc ----
      var built3 = buildExpr3();
      var mc3 = makeMC(built3.ans, built3.distractors, function (v) { return groupDigits(v); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Tính giá trị biểu thức: <b>' + built3.stem + '</b>',
        choices: mc3.choices, answer: mc3.answerIndex,
        explain: built3.explain
      };
    }

    // ---- THỬ THÁCH: tìm x 2 bước ----
    return genFindX2();
  }

  // Dựng biểu thức 2 phép (số đẹp, không âm, chia hết khi cần).
  function buildExpr2(form) {
    var a, b, c, ans, stem;
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
      default: // a*b:c
        a = randInt(2, 9); b = randInt(2, 9); c = pick(divisorsOf(a * b));
        ans = (a * b) / c; stem = a + ' × ' + b + ' ÷ ' + c; break;
    }
    return { a: a, b: b, c: c, ans: ans, stem: stem };
  }

  // Dựng biểu thức 3 phép có ngoặc: (a+b)×c−d ; a×b+c×d ; m÷(p×q)+r.
  function buildExpr3() {
    var form = pick(['(a+b)*c-d', 'a*b+c*d', 'm:(p*q)+r', '(a-b)*c+d']);
    var stem, ans, explain, distractors;
    if (form === '(a+b)*c-d') {
      var a = randInt(5, 40), b = randInt(5, 40), c = randInt(2, 6);
      var prod = (a + b) * c;
      var d = randInt(1, prod);
      ans = prod - d;
      stem = '(' + a + ' + ' + b + ') × ' + c + ' − ' + d;
      explain = 'Trong ngoặc trước: ' + a + ' + ' + b + ' = ' + (a + b) + '; nhân: ' + (a + b) + ' × ' + c +
                ' = ' + prod + '; rồi trừ: ' + prod + ' − ' + d + ' = ' + ans + '.';
      // bẫy: quên trừ d; bỏ ngoặc (a + b×c − d).
      distractors = [prod, a + b * c - d, ans + 10, ans - 10, ans + 1];
    } else if (form === '(a-b)*c+d') {
      var b2 = randInt(2, 30), a2 = randInt(b2 + 1, 60), c2 = randInt(2, 6), d2 = randInt(5, 200);
      var prod2 = (a2 - b2) * c2;
      ans = prod2 + d2;
      stem = '(' + a2 + ' − ' + b2 + ') × ' + c2 + ' + ' + d2;
      explain = 'Trong ngoặc trước: ' + a2 + ' − ' + b2 + ' = ' + (a2 - b2) + '; nhân: ' + (a2 - b2) + ' × ' + c2 +
                ' = ' + prod2 + '; rồi cộng: ' + prod2 + ' + ' + d2 + ' = ' + ans + '.';
      distractors = [prod2, a2 - b2 * c2 + d2, ans + 10, ans - 10, ans + 1];
    } else if (form === 'a*b+c*d') {
      var a3 = randInt(2, 9), b3 = randInt(2, 9), c3 = randInt(2, 9), d3 = randInt(2, 9);
      var t1 = a3 * b3, t2 = c3 * d3;
      ans = t1 + t2;
      stem = a3 + ' × ' + b3 + ' + ' + c3 + ' × ' + d3;
      explain = 'Hai phép nhân trước: ' + a3 + ' × ' + b3 + ' = ' + t1 + '; ' + c3 + ' × ' + d3 + ' = ' + t2 +
                '; rồi cộng: ' + t1 + ' + ' + t2 + ' = ' + ans + '.';
      // bẫy: tính trái sang phải không ưu tiên nhân: ((a*b+c)*d)
      distractors = [(t1 + c3) * d3, a3 * (b3 + c3) * d3, ans + 10, ans - 10, ans + 1];
    } else { // m:(p*q)+r
      var p = randInt(2, 6), qd = randInt(2, 6);
      var pq = p * qd;
      var quo = randInt(2, 30);
      var m = pq * quo;          // m chia hết cho (p×q)
      var r = randInt(1, 200);
      ans = quo + r;
      stem = m + ' ÷ (' + p + ' × ' + qd + ') + ' + r;
      explain = 'Trong ngoặc trước: ' + p + ' × ' + qd + ' = ' + pq + '; chia: ' + m + ' ÷ ' + pq + ' = ' + quo +
                '; rồi cộng: ' + quo + ' + ' + r + ' = ' + ans + '.';
      // bẫy: chia rồi nhân (bỏ ngoặc): m ÷ p × q + r
      distractors = [m / p * qd + r, quo, ans + 10, ans - 10, ans + 1];
    }
    distractors = shuffle(distractors.filter(function (v) { return v >= 0 && Number.isInteger(v); }));
    return { stem: stem, ans: ans, explain: explain, distractors: distractors };
  }

  // Tìm x 1 bước: x+a, x-a, a-x, x*a, x:a.
  function genFindX1() {
    var topic = 'bieu-thuc';
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

  // Tìm x 2 bước: x×a+b=T ; x×a−b=T ; (x+a)×b=T ; (x−a)×b=T ; x÷a−b=T.
  function genFindX2() {
    var topic = 'bieu-thuc';
    var form = pick(['x*a+b', 'x*a-b', '(x+a)*b', '(x-a)*b', 'x:a+b']);
    var a, b, x, T, stem, e1, e2;
    switch (form) {
      case 'x*a+b':
        a = randInt(2, 9); x = randInt(2, 500); b = randInt(1, 500);
        T = x * a + b;
        stem = 'x × ' + a + ' + ' + groupDigits(b) + ' = ' + groupDigits(T);
        e1 = 'x × ' + a + ' = ' + groupDigits(T) + ' − ' + groupDigits(b) + ' = ' + groupDigits(T - b);
        e2 = 'x = ' + groupDigits(T - b) + ' ÷ ' + a + ' = ' + groupDigits(x);
        break;
      case 'x*a-b':
        a = randInt(2, 9); x = randInt(2, 500); b = randInt(1, x * a - 1);
        T = x * a - b;
        stem = 'x × ' + a + ' − ' + groupDigits(b) + ' = ' + groupDigits(T);
        e1 = 'x × ' + a + ' = ' + groupDigits(T) + ' + ' + groupDigits(b) + ' = ' + groupDigits(T + b);
        e2 = 'x = ' + groupDigits(T + b) + ' ÷ ' + a + ' = ' + groupDigits(x);
        break;
      case '(x+a)*b':
        a = randInt(1, 50); x = randInt(2, 200); b = randInt(2, 9);
        T = (x + a) * b;
        stem = '(x + ' + a + ') × ' + b + ' = ' + groupDigits(T);
        e1 = 'x + ' + a + ' = ' + groupDigits(T) + ' ÷ ' + b + ' = ' + groupDigits(T / b);
        e2 = 'x = ' + groupDigits(T / b) + ' − ' + a + ' = ' + groupDigits(x);
        break;
      case '(x-a)*b':
        a = randInt(1, 50); x = randInt(a + 1, 200); b = randInt(2, 9);
        T = (x - a) * b;
        stem = '(x − ' + a + ') × ' + b + ' = ' + groupDigits(T);
        e1 = 'x − ' + a + ' = ' + groupDigits(T) + ' ÷ ' + b + ' = ' + groupDigits(T / b);
        e2 = 'x = ' + groupDigits(T / b) + ' + ' + a + ' = ' + groupDigits(x);
        break;
      default: // x:a+b
        a = randInt(2, 9); var quo = randInt(2, 500); x = quo * a; b = randInt(1, 500);
        T = quo + b;
        stem = 'x ÷ ' + a + ' + ' + groupDigits(b) + ' = ' + groupDigits(T);
        e1 = 'x ÷ ' + a + ' = ' + groupDigits(T) + ' − ' + groupDigits(b) + ' = ' + groupDigits(quo);
        e2 = 'x = ' + groupDigits(quo) + ' × ' + a + ' = ' + groupDigits(x);
        break;
    }
    return {
      type: 'input', topic: topic,
      stem: 'Tìm x (chỉ gõ chữ số): <b>' + stem + '</b>',
      answer: String(x),
      explain: 'Bước 1: ' + e1 + '. Bước 2: ' + e2 + '.'
    };
  }

  // Distractor "sai thứ tự phép tính" + lệch nhỏ, theo từng dạng biểu thức 2 phép.
  function wrongOrderDistractors(form, a, b, c, ans) {
    var list = [];
    switch (form) {
      case 'a+b*c': list.push((a + b) * c); break;
      case 'a-b*c': list.push((a - b) * c); break;
      case 'a*b+c': list.push(a * (b + c)); break;
      case 'a*b-c': list.push(a * (b - c)); break;
      case '(a+b)*c': list.push(a + b * c); break;
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
   *  Cơ bản: một phép chia có dư "thương dư số_dư".
   *  Nâng vừa: bài "cần ít nhất mấy xe / mấy hộp đầy & thừa mấy".
   *  Thử thách: suy luận ngược tìm số bị chia.
   * ========================================================================== */
  function genChiaDu() {
    var topic = 'chia-du';
    var t = tier();

    if (t === 0) {
      // ---- CƠ BẢN ----
      var divisor = randInt(2, 9);
      var quotient = randInt(11, 9999);
      var rem = randInt(1, divisor - 1);
      var dividend = quotient * divisor + rem;
      return {
        type: 'input', topic: topic,
        stem: 'Đặt tính rồi tính (ghi dạng "thương dư số dư"): <b>' +
              groupDigits(dividend) + ' ÷ ' + divisor + '</b>',
        answer: quotient + ' dư ' + rem,
        explain: groupDigits(dividend) + ' ÷ ' + divisor + ' = ' + groupDigits(quotient) + ' (dư ' + rem + '), vì ' +
                 groupDigits(quotient) + ' × ' + divisor + ' + ' + rem + ' = ' + groupDigits(dividend) +
                 '; số dư ' + rem + ' < số chia ' + divisor + '.'
      };
    }

    if (t === 1) {
      // ---- NÂNG VỪA: dùng phần dư để quyết định ----
      var sub = pick(['can-xe', 'hop-day']);

      if (sub === 'can-xe') {
        // làm tròn LÊN: cần ít nhất mấy xe/thuyền/bàn...
        var cap = randInt(4, 12);
        var fullCars = randInt(3, 30);
        var extra = randInt(1, cap - 1);     // bảo đảm có dư -> cần thêm 1
        var total = fullCars * cap + extra;
        var ans = fullCars + 1;
        var ctx = pick([
          { thing: 'bạn', vehicle: 'xe', verb: 'chở' },
          { thing: 'bạn', vehicle: 'thuyền', verb: 'chở' },
          { thing: 'người', vehicle: 'xe', verb: 'chở' },
          { thing: 'học sinh', vehicle: 'bàn', verb: 'xếp' }
        ]);
        var dd = [fullCars, ans + 1, fullCars - 1, total]
          .filter(function (v) { return v > 0 && v !== ans; });
        var mc = makeMC(ans, dd, function (v) { return v + ' ' + ctx.vehicle; }, function (cor, ex) {
          return cor + ex.length;
        });
        return {
          type: 'mc', topic: topic,
          stem: 'Mỗi ' + ctx.vehicle + ' ' + ctx.verb + ' được <b>' + cap + ' ' + ctx.thing + '</b>. Có <b>' +
                total + ' ' + ctx.thing + '</b>. Cần ít nhất mấy ' + ctx.vehicle + ' để ' + ctx.verb + ' hết?',
          choices: mc.choices, answer: mc.answerIndex,
          explain: total + ' ÷ ' + cap + ' = ' + fullCars + ' (dư ' + extra + '). ' + fullCars + ' ' + ctx.vehicle +
                   ' ' + ctx.verb + ' được ' + (fullCars * cap) + ' ' + ctx.thing + ', còn ' + extra + ' ' + ctx.thing +
                   ' nên cần thêm 1 ' + ctx.vehicle + ' → ' + ans + ' ' + ctx.vehicle + '.'
        };
      }

      // hop-day: số hộp đầy & số còn thừa.
      var per = randInt(4, 12);
      var fullBoxes = randInt(3, 30);
      var leftover = randInt(1, per - 1);
      var totalCake = fullBoxes * per + leftover;
      var obj = pick(OBJS);
      // hỏi 1 trong 2: số hộp đầy hoặc số còn thừa (input số).
      var askFull = randInt(0, 1) === 1;
      if (askFull) {
        return {
          type: 'input', topic: topic,
          stem: 'Có <b>' + totalCake + ' ' + obj.d + '</b> xếp vào các hộp, mỗi hộp <b>' + per + ' ' + obj.dv +
                '</b>. Hỏi xếp được mấy hộp đầy? (gõ số)',
          answer: String(fullBoxes),
          explain: totalCake + ' ÷ ' + per + ' = ' + fullBoxes + ' (dư ' + leftover + '). Xếp được ' + fullBoxes +
                   ' hộp đầy (còn thừa ' + leftover + ' ' + obj.dv + ').'
        };
      }
      return {
        type: 'input', topic: topic,
        stem: 'Có <b>' + totalCake + ' ' + obj.d + '</b> xếp vào các hộp, mỗi hộp <b>' + per + ' ' + obj.dv +
              '</b>. Sau khi xếp đầy các hộp thì còn thừa mấy ' + obj.dv + '? (gõ số)',
        answer: String(leftover),
        explain: totalCake + ' ÷ ' + per + ' = ' + fullBoxes + ' (dư ' + leftover + '). Vậy còn thừa ' + leftover +
                 ' ' + obj.dv + '.'
      };
    }

    // ---- THỬ THÁCH: suy luận ngược tìm số bị chia ----
    var d3 = randInt(3, 9);
    var q3 = randInt(11, 999);
    var r3 = randInt(1, d3 - 1);
    var dividend3 = q3 * d3 + r3;
    return {
      type: 'input', topic: topic,
      stem: 'Một phép chia cho <b>' + d3 + '</b> được thương <b>' + q3 + '</b> và số dư <b>' + r3 +
            '</b>. Số bị chia là bao nhiêu? (gõ số)',
      answer: String(dividend3),
      explain: 'Số bị chia = thương × số chia + số dư = ' + q3 + ' × ' + d3 + ' + ' + r3 + ' = ' +
               (q3 * d3) + ' + ' + r3 + ' = ' + groupDigits(dividend3) + '.'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 6: ĐO LƯỜNG
   *  Cơ bản: một phép đổi / một phép cộng đơn vị.
   *  Nâng vừa: đổi rồi tính (số đo hỗn hợp); tiền 2 mệnh giá; khoảng thời gian.
   *  Thử thách: mua hàng – tiền thừa nhiều bước.
   * ========================================================================== */
  function genDoLuong() {
    var topic = 'do-luong';
    var t = tier();

    if (t === 0) {
      // ---- CƠ BẢN: một phép đổi / cộng ----
      var kind = pick(['dodai', 'khoiluong', 'thoigian', 'lit', 'tien1']);

      if (kind === 'dodai') {
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

      if (kind === 'lit') {
        var canA = randInt(2, 40), canB = randInt(2, 40);
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

      // tien1: 1 mệnh giá.
      var menh = [1000, 2000, 5000, 10000, 20000];
      var soTo = randInt(2, 5);
      var loai = pick(menh);
      var ans5 = soTo * loai;
      var dd5 = [ans5 + loai, ans5 - loai, soTo * 10, ans5 + 1000].filter(function (v) { return v > 0 && v !== ans5; });
      var mc5 = makeMC(ans5, dd5, function (v) { return groupDigits(v); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Có ' + soTo + ' tờ tiền loại <b>' + groupDigits(loai) + ' đồng</b>. Hỏi tất cả bao nhiêu đồng?',
        choices: mc5.choices, answer: mc5.answerIndex,
        explain: soTo + ' × ' + groupDigits(loai) + ' = ' + groupDigits(ans5) + ' đồng.'
      };
    }

    if (t === 1) {
      // ---- NÂNG VỪA ----
      var sub = pick(['doi-tinh', 'doi-tinh', 'tien2', 'khoang-gio']);

      if (sub === 'doi-tinh') {
        // Đổi 2 số đo hỗn hợp về cùng đơn vị nhỏ rồi cộng hoặc trừ.
        var hh = pick([
          { big: 'm', small: 'cm', k: 100 },
          { big: 'm', small: 'dm', k: 10 },
          { big: 'dm', small: 'cm', k: 10 },
          { big: 'cm', small: 'mm', k: 10 },
          { big: 'km', small: 'm', k: 1000 }
        ]);
        var isSub = randInt(0, 1) === 1;
        var bigA = randInt(2, 9), smallA = randInt(1, hh.k - 1);
        var bigB = randInt(1, 8), smallB = randInt(1, hh.k - 1);
        var A = bigA * hh.k + smallA;
        var B = bigB * hh.k + smallB;
        var ans, op, hi, lo;
        if (isSub) {
          // bảo đảm A >= B
          if (A < B) { var tA = A; A = B; B = tA; var tb = bigA; bigA = bigB; bigB = tb; var ts = smallA; smallA = smallB; smallB = ts; }
          ans = A - B; op = '−';
          hi = bigA + ' ' + hh.big + ' ' + smallA + ' ' + hh.small;
          lo = bigB + ' ' + hh.big + ' ' + smallB + ' ' + hh.small;
        } else {
          ans = A + B; op = '+';
          hi = bigA + ' ' + hh.big + ' ' + smallA + ' ' + hh.small;
          lo = bigB + ' ' + hh.big + ' ' + smallB + ' ' + hh.small;
        }
        // bẫy: quên đổi 1 số đo; đổi sai bậc.
        var ddD = [isSub ? (A - bigB) : (A + bigB), ans + hh.k, ans - hh.k, ans + 1, ans - 1]
          .filter(function (v) { return v > 0 && v !== ans; });
        var mcD = makeMC(ans, ddD, function (v) { return groupDigits(v) + ' ' + hh.small; }, numericPad);
        return {
          type: 'mc', topic: topic,
          stem: 'Đổi rồi tính: <b>' + hi + ' ' + op + ' ' + lo + ' = ___ ' + hh.small + '</b>',
          choices: mcD.choices, answer: mcD.answerIndex,
          explain: hi + ' = ' + groupDigits(A) + ' ' + hh.small + '; ' + lo + ' = ' + groupDigits(B) + ' ' + hh.small +
                   '; ' + groupDigits(A) + ' ' + op + ' ' + groupDigits(B) + ' = ' + groupDigits(ans) + ' ' + hh.small + '.'
        };
      }

      if (sub === 'tien2') {
        // 2 mệnh giá KHÁC NHAU (không để trùng "5 000đ và 5 000đ").
        var loaiA = pick([10000, 20000, 5000]);
        var loaiB = pick([1000, 2000, 5000].filter(function (v) { return v !== loaiA; }));
        var soA = randInt(2, 4), soB = randInt(2, 4);
        var partA = soA * loaiA, partB = soB * loaiB;
        var ansT = partA + partB;
        var ddT = [partA, partB, ansT + loaiA, ansT - loaiB, (soA + soB) * loaiA]
          .filter(function (v) { return v > 0 && v !== ansT; });
        var mcT = makeMC(ansT, ddT, function (v) { return groupDigits(v) + ' đồng'; }, numericPad);
        return {
          type: 'mc', topic: topic,
          stem: 'Mẹ có ' + soA + ' tờ loại <b>' + groupDigits(loaiA) + ' đồng</b> và ' + soB + ' tờ loại <b>' +
                groupDigits(loaiB) + ' đồng</b>. Mẹ có tất cả bao nhiêu đồng?',
          choices: mcT.choices, answer: mcT.answerIndex,
          explain: soA + ' × ' + groupDigits(loaiA) + ' = ' + groupDigits(partA) + '; ' + soB + ' × ' +
                   groupDigits(loaiB) + ' = ' + groupDigits(partB) + '; cộng lại ' + groupDigits(partA) + ' + ' +
                   groupDigits(partB) + ' = ' + groupDigits(ansT) + ' đồng.'
        };
      }

      // khoang-gio: khoảng thời gian giữa 2 mốc giờ–phút cùng buổi.
      var h1 = randInt(7, 9), m1 = randInt(0, 11) * 5;
      var durMin = randInt(40, 150);
      var startTotal = h1 * 60 + m1;
      var endTotal = startTotal + durMin;
      // giữ trong ngày (<= 12 giờ chẳng hạn cho gọn)
      var h2 = Math.floor(endTotal / 60), m2 = endTotal % 60;
      var ansMin = durMin;
      // bẫy: cộng nhầm chỉ phút, trừ nhầm.
      var dd = [Math.abs((h2 - h1) * 60 + (m2 - m1)) + 5, ansMin + 60, ansMin - 60, (h2 - h1) * 60, ansMin + 5]
        .filter(function (v) { return v > 0 && v !== ansMin; });
      return {
        type: 'input', topic: topic,
        stem: 'Bé bắt đầu lúc <b>' + h1 + ' giờ ' + m1 + ' phút</b>, kết thúc lúc <b>' + h2 + ' giờ ' + m2 +
              ' phút</b>. Bé làm trong bao nhiêu phút? (gõ số)',
        answer: String(ansMin),
        explain: 'Đổi 2 mốc ra phút: ' + h1 + ' giờ ' + m1 + ' phút = ' + startTotal + ' phút; ' + h2 + ' giờ ' + m2 +
                 ' phút = ' + endTotal + ' phút. Khoảng cách = ' + endTotal + ' − ' + startTotal + ' = ' + ansMin + ' phút.'
      };
    }

    // ---- THỬ THÁCH: mua hàng – tiền thừa nhiều bước ----
    var menh2 = pick([20000, 50000, 100000]);
    var giaA = randInt(2, 9) * 1000;
    var soLuong = randInt(2, 5);
    var giaB = randInt(2, 9) * 1000;
    var tongMua = giaA * soLuong + giaB;
    // bảo đảm đưa đủ tiền, tiền thừa dương, mọi số <= 100000.
    if (tongMua >= menh2) {
      // thu nhỏ
      soLuong = 2; giaA = randInt(1, 4) * 1000; giaB = randInt(1, 4) * 1000;
      tongMua = giaA * soLuong + giaB;
      if (tongMua >= menh2) { giaA = 1000; giaB = 1000; tongMua = giaA * soLuong + giaB; }
    }
    var thua = menh2 - tongMua;
    var obj2 = pick(OBJS);
    return {
      type: 'input', topic: topic,
      stem: 'Bạn mua ' + soLuong + ' ' + obj2.d + ' giá <b>' + groupDigits(giaA) + ' đồng</b> mỗi ' + obj2.dv +
            ' và một món khác giá <b>' + groupDigits(giaB) + ' đồng</b>. Bạn đưa tờ <b>' + groupDigits(menh2) +
            ' đồng</b>. Người bán trả lại bao nhiêu đồng? (gõ số)',
      answer: String(thua),
      explain: 'Tiền ' + obj2.d + ': ' + soLuong + ' × ' + groupDigits(giaA) + ' = ' + groupDigits(giaA * soLuong) +
               ' đồng. Tổng phải trả: ' + groupDigits(giaA * soLuong) + ' + ' + groupDigits(giaB) + ' = ' +
               groupDigits(tongMua) + ' đồng. Tiền thừa: ' + groupDigits(menh2) + ' − ' + groupDigits(tongMua) +
               ' = ' + groupDigits(thua) + ' đồng.'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 7: HÌNH HỌC (chu vi & diện tích HCN, HV)
   *  Cơ bản: một công thức chu vi/diện tích.
   *  Nâng vừa: biết chu vi & 1 cạnh tìm cạnh kia; đếm viên gạch; biết dt-hv tìm cạnh.
   *  Thử thách: cắt hình tính phần còn lại; ghép điều kiện chu vi + hiệu hai cạnh.
   * ========================================================================== */
  function genHinhHoc() {
    var topic = 'hinh-hoc';
    var t = tier();
    var unit = pick(['cm', 'm']);
    var unit2 = unit + '²';

    if (t === 0) {
      // ---- CƠ BẢN ----
      var kind = pick(['cv-hcn', 'dt-hcn', 'cv-hv', 'dt-hv']);

      if (kind === 'cv-hcn') {
        var d = randInt(5, 40), r = randInt(2, d - 1);
        var ans = (d + r) * 2;
        var dd = [d * r, d + r, d * r * 2, (d + r) + 2].filter(function (v) { return v !== ans && v > 0; });
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
        var dd2 = [(d2 + r2) * 2, d2 + r2, d2 * r2 * 2, (d2 + r2)].filter(function (v) { return v !== ans2 && v > 0; });
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
        var dd3 = [c * c, c * 2, c + 4, c * 3].filter(function (v) { return v !== ans3 && v > 0; });
        var mc3 = makeMC(ans3, dd3, function (v) { return groupDigits(v) + ' ' + unit; }, numericPad);
        return {
          type: 'mc', topic: topic,
          stem: 'Hình vuông có cạnh ' + c + ' ' + unit + '. <b>Chu vi</b> là:',
          choices: mc3.choices, answer: mc3.answerIndex,
          explain: 'Chu vi hình vuông = cạnh × 4 = ' + c + ' × 4 = ' + ans3 + ' ' + unit + '.'
        };
      }

      // dt-hv
      var c2 = randInt(2, 30);
      var ans4 = c2 * c2;
      var dd4 = [c2 * 4, c2 * 2, c2 + c2, c2 * 3].filter(function (v) { return v !== ans4 && v > 0; });
      var mc4 = makeMC(ans4, dd4, function (v) { return groupDigits(v) + ' ' + unit2; }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Hình vuông có cạnh ' + c2 + ' ' + unit + '. <b>Diện tích</b> là:',
        choices: mc4.choices, answer: mc4.answerIndex,
        explain: 'Diện tích hình vuông = cạnh × cạnh = ' + c2 + ' × ' + c2 + ' = ' + ans4 + ' ' + unit2 + '.'
      };
    }

    if (t === 1) {
      // ---- NÂNG VỪA ----
      var sub = pick(['nguoc-cv-hv', 'nguoc-dt-hv', 'nguoc-cv-hcn', 'vien-gach']);

      if (sub === 'nguoc-cv-hv') {
        var c3 = randInt(2, 40);
        var cv = c3 * 4;
        return {
          type: 'input', topic: topic,
          stem: 'Hình vuông có chu vi ' + cv + ' ' + unit + '. <b>Cạnh</b> hình vuông dài bao nhiêu ' + unit + '? (gõ số)',
          answer: String(c3),
          explain: 'Cạnh = chu vi ÷ 4 = ' + cv + ' ÷ 4 = ' + c3 + ' ' + unit + '.'
        };
      }

      if (sub === 'nguoc-dt-hv') {
        var c4 = randInt(2, 12);
        var dt = c4 * c4;
        return {
          type: 'input', topic: topic,
          stem: 'Hình vuông có diện tích ' + dt + ' ' + unit2 + '. <b>Cạnh</b> hình vuông dài bao nhiêu ' + unit + '? (gõ số)',
          answer: String(c4),
          explain: 'Tìm cạnh sao cho cạnh × cạnh = ' + dt + ': đó là ' + c4 + ' (vì ' + c4 + ' × ' + c4 + ' = ' + dt + ').'
        };
      }

      if (sub === 'nguoc-cv-hcn') {
        var d5 = randInt(5, 40), r5 = randInt(2, d5 - 1);
        var cv2 = (d5 + r5) * 2;
        return {
          type: 'input', topic: topic,
          stem: 'Hình chữ nhật có chu vi ' + cv2 + ' ' + unit + ', chiều dài ' + d5 + ' ' + unit +
                '. <b>Chiều rộng</b> bao nhiêu ' + unit + '? (gõ số)',
          answer: String(r5),
          explain: 'Nửa chu vi = ' + cv2 + ' ÷ 2 = ' + (cv2 / 2) + '. Chiều rộng = ' + (cv2 / 2) + ' − ' + d5 +
                   ' = ' + r5 + ' ' + unit + '.'
        };
      }

      // vien-gach: đếm số viên gạch lát kín nền.
      var floorIsSquare = randInt(0, 1) === 1;
      var tileSide = pick([1, 2]);
      if (floorIsSquare) {
        var side = tileSide * randInt(3, 8);
        var areaFloor = side * side;
        var areaTile = tileSide * tileSide;
        var nTiles = areaFloor / areaTile;
        var ddV = [areaFloor, side / tileSide, nTiles + 2, nTiles - 2].filter(function (v) { return v > 0 && Number.isInteger(v) && v !== nTiles; });
        var mcV = makeMC(nTiles, ddV, function (v) { return v + ' viên'; }, numericPad);
        return {
          type: 'mc', topic: topic,
          stem: 'Nền phòng hình vuông cạnh ' + side + ' m. Mỗi viên gạch hình vuông cạnh ' + tileSide +
                ' m. Cần bao nhiêu viên gạch để lát kín nền?',
          choices: mcV.choices, answer: mcV.answerIndex,
          explain: 'Diện tích nền = ' + side + ' × ' + side + ' = ' + areaFloor + ' m²; mỗi viên ' + tileSide +
                   ' × ' + tileSide + ' = ' + areaTile + ' m². Số viên = ' + areaFloor + ' ÷ ' + areaTile + ' = ' + nTiles + ' viên.'
        };
      }
      var dlen = tileSide * randInt(3, 8), rlen = tileSide * randInt(2, 6);
      var areaF = dlen * rlen, areaT = tileSide * tileSide;
      var nT = areaF / areaT;
      var ddV2 = [areaF, dlen / tileSide, nT + 2, nT - 2].filter(function (v) { return v > 0 && Number.isInteger(v) && v !== nT; });
      var mcV2 = makeMC(nT, ddV2, function (v) { return v + ' viên'; }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Nền phòng hình chữ nhật dài ' + dlen + ' m, rộng ' + rlen + ' m. Mỗi viên gạch hình vuông cạnh ' +
              tileSide + ' m. Cần bao nhiêu viên gạch để lát kín nền?',
        choices: mcV2.choices, answer: mcV2.answerIndex,
        explain: 'Diện tích nền = ' + dlen + ' × ' + rlen + ' = ' + areaF + ' m²; mỗi viên ' + areaT +
                 ' m². Số viên = ' + areaF + ' ÷ ' + areaT + ' = ' + nT + ' viên.'
      };
    }

    // ---- THỬ THÁCH ----
    var sub2 = pick(['cat-hinh', 'cat-hinh', 'cv-hieu']);

    if (sub2 === 'cat-hinh') {
      // Cắt một hình vuông ra khỏi HCN, tính diện tích còn lại.
      var dd = randInt(6, 30), rr = randInt(3, dd - 1);
      var sq = rr; // cạnh hình vuông cắt ra = chiều rộng (nằm gọn trong HCN)
      var areaRect = dd * rr;
      var areaSq = sq * sq;
      var rem = areaRect - areaSq;
      var ddC = [areaRect, areaSq, areaRect + areaSq, rem + 5]
        .filter(function (v) { return v > 0 && v !== rem; });
      var mcC = makeMC(rem, ddC, function (v) { return groupDigits(v) + ' ' + unit2; }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Một mảnh bìa hình chữ nhật dài ' + dd + ' ' + unit + ', rộng ' + rr + ' ' + unit +
              '. Người ta cắt ra một hình vuông cạnh ' + sq + ' ' + unit + '. Phần bìa còn lại có diện tích bao nhiêu?',
        choices: mcC.choices, answer: mcC.answerIndex,
        explain: 'Diện tích hình chữ nhật = ' + dd + ' × ' + rr + ' = ' + areaRect + ' ' + unit2 +
                 '; diện tích hình vuông cắt ra = ' + sq + ' × ' + sq + ' = ' + areaSq + ' ' + unit2 +
                 '; còn lại ' + areaRect + ' − ' + areaSq + ' = ' + rem + ' ' + unit2 + '.'
      };
    }

    // cv-hieu: HCN có chu vi P, dài hơn rộng h -> tìm chiều dài (giải theo bước).
    // Dựng sao cho nửa chu vi & hiệu cùng tính chẵn: dài,rộng nguyên dương.
    var rW = randInt(3, 25);
    var hDiff = randInt(2, 20);
    var dL = rW + hDiff;
    var P = (dL + rW) * 2;             // chu vi
    var nua = P / 2;                   // = dL + rW
    return {
      type: 'input', topic: topic,
      stem: 'Hình chữ nhật có chu vi <b>' + P + ' ' + unit + '</b>, chiều dài hơn chiều rộng <b>' + hDiff + ' ' +
            unit + '</b>. Chiều dài là bao nhiêu ' + unit + '? (gõ số)',
      answer: String(dL),
      explain: 'Nửa chu vi (dài + rộng) = ' + P + ' ÷ 2 = ' + nua + '. Hai lần chiều dài = ' + nua + ' + ' + hDiff +
               ' = ' + (nua + hDiff) + '; chiều dài = ' + (nua + hDiff) + ' ÷ 2 = ' + dL + ' ' + unit +
               ' (chiều rộng = ' + rW + ' ' + unit + ').'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 8: TOÁN CÓ LỜI VĂN
   *  Cơ bản: một bước (thêm/bớt/nhiều–ít hơn/gấp/giảm).
   *  Nâng vừa: 2 bước nhân–cộng/nhân–trừ; rút về đơn vị.
   *  Thử thách: trộn phép & suy luận ngược; biết tổng & hiệu (theo bước).
   * ========================================================================== */
  function genLoiVan() {
    var topic = 'loi-van';
    var t = tier();
    var name = pick(NAMES);
    var name2 = pick(NAMES.filter(function (x) { return x !== name; }));
    var obj = pick(OBJS);

    if (t === 0) {
      // ---- CƠ BẢN: một bước ----
      var kind = pick(['gap', 'giam', 'nhieuhon', 'ithon']);

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
        var a2 = q * k2;
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
      // ithon
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

    if (t === 1) {
      // ---- NÂNG VỪA: 2 bước thật sự ----
      var sub = pick(['nhan-tru', 'nhan-cong', 'rutdonvi']);

      if (sub === 'nhan-tru') {
        // "Có B hộp, mỗi hộp P cái; bán đi S cái; còn lại?"
        var perBox = randInt(6, 15), boxes = randInt(3, 9);
        var made = perBox * boxes;
        var sold = randInt(5, made - 1);
        var ans5 = made - sold;
        return {
          type: 'input', topic: topic,
          stem: 'Một cửa hàng có ' + boxes + ' hộp ' + obj.d + ', mỗi hộp ' + perBox + ' ' + obj.dv +
                '. Cửa hàng bán đi ' + sold + ' ' + obj.dv + '. Hỏi còn lại bao nhiêu ' + obj.dv + '? (gõ số)',
          answer: String(ans5),
          explain: 'Bước 1: ' + boxes + ' × ' + perBox + ' = ' + made + ' ' + obj.dv + '. Bước 2: ' + made + ' − ' +
                   sold + ' = ' + ans5 + ' ' + obj.dv + '.'
        };
      }

      if (sub === 'nhan-cong') {
        // "Có B hộp, mỗi hộp P; còn rời E; tất cả?"
        var perBox2 = randInt(6, 15), boxes2 = randInt(3, 9), extra = randInt(5, 50);
        var made2 = perBox2 * boxes2;
        var ans6 = made2 + extra;
        return {
          type: 'input', topic: topic,
          stem: 'Có ' + boxes2 + ' hộp ' + obj.d + ', mỗi hộp ' + perBox2 + ' ' + obj.dv + ', và còn ' + extra +
                ' ' + obj.dv + ' để rời. Hỏi có tất cả bao nhiêu ' + obj.dv + '? (gõ số)',
          answer: String(ans6),
          explain: 'Bước 1: ' + boxes2 + ' × ' + perBox2 + ' = ' + made2 + ' ' + obj.dv + '. Bước 2: ' + made2 +
                   ' + ' + extra + ' = ' + ans6 + ' ' + obj.dv + '.'
        };
      }

      // rutdonvi: 5 quyển 30 nghìn -> 8 quyển ?
      var per = randInt(2, 9), n1 = randInt(2, 8);
      var total = per * n1;
      var n2num = randInt(2, 9);
      var ansR = per * n2num;
      return {
        type: 'input', topic: topic,
        stem: name + ' mua ' + n1 + ' ' + obj.d + ' hết ' + total + ' nghìn đồng. ' +
              'Hỏi mua ' + n2num + ' ' + obj.d + ' (cùng loại) hết bao nhiêu nghìn đồng? (gõ số)',
        answer: String(ansR),
        explain: 'Rút về đơn vị: 1 ' + obj.dv + ' giá ' + total + ' ÷ ' + n1 + ' = ' + per + ' nghìn. ' +
                 'Vậy ' + n2num + ' ' + obj.dv + ' hết ' + per + ' × ' + n2num + ' = ' + ansR + ' nghìn đồng.'
      };
    }

    // ---- THỬ THÁCH ----
    var sub2 = pick(['nguoc', 'nguoc', 'gap-cong', 'tong-hieu']);

    if (sub2 === 'nguoc') {
      // "Sau khi cho đi C, An còn L. Lúc đầu?" -> L + C.
      var cho = randInt(5, 80), conLai = randInt(10, 200);
      var banDau = cho + conLai;
      return {
        type: 'input', topic: topic,
        stem: 'Sau khi cho bạn ' + cho + ' ' + obj.dv + ', ' + name + ' còn lại ' + conLai + ' ' + obj.dv +
              '. Hỏi lúc đầu ' + name + ' có bao nhiêu ' + obj.dv + '? (gõ số)',
        answer: String(banDau),
        explain: 'Lúc đầu = số còn lại + số đã cho = ' + conLai + ' + ' + cho + ' = ' + banDau + ' ' + obj.dv +
                 '. Thử lại: ' + banDau + ' − ' + cho + ' = ' + conLai + '.'
      };
    }

    if (sub2 === 'gap-cong') {
      // "A có a; B gấp k lần A; cả hai có mấy?"
      var aG = randInt(5, 40), kG = randInt(2, 6);
      var bG = aG * kG;
      var ansG = aG + bG;
      return {
        type: 'input', topic: topic,
        stem: name + ' có ' + aG + ' ' + obj.d + '. ' + name2 + ' có số ' + obj.d + ' gấp ' + kG + ' lần ' + name +
              '. Hỏi cả hai bạn có tất cả bao nhiêu ' + obj.dv + '? (gõ số)',
        answer: String(ansG),
        explain: 'Bước 1: ' + name2 + ' có ' + aG + ' × ' + kG + ' = ' + bG + ' ' + obj.dv + '. Bước 2: cả hai có ' +
                 aG + ' + ' + bG + ' = ' + ansG + ' ' + obj.dv + '.'
      };
    }

    // tong-hieu (theo bước, KHÔNG nêu tên công thức).
    // Dựng (tổng + hiệu) chia hết cho 2.
    var soBe = randInt(10, 150);
    var hieu = randInt(2, 80);
    var soLon = soBe + hieu;
    var tong = soBe + soLon;          // tổng
    // hỏi số lớn.
    return {
      type: 'input', topic: topic,
      stem: 'Hai bạn ' + name + ' và ' + name2 + ' có tất cả ' + tong + ' ' + obj.d + '. ' + name2 +
            ' có nhiều hơn ' + name + ' ' + hieu + ' ' + obj.dv + '. Hỏi ' + name2 + ' có bao nhiêu ' + obj.dv + '? (gõ số)',
      answer: String(soLon),
      explain: 'Bước 1: hai lần số của ' + name2 + ' = tổng + phần hơn = ' + tong + ' + ' + hieu + ' = ' +
               (tong + hieu) + '. Bước 2: ' + name2 + ' có ' + (tong + hieu) + ' ÷ 2 = ' + soLon + ' ' + obj.dv +
               ' (' + name + ' có ' + soBe + ' ' + obj.dv + ').'
    };
  }

  /* ============================================================================
   *  CHỦ ĐỀ 9: PHÁT TRIỂN TƯ DUY
   *  Cơ bản: tính nhanh phân phối quen; dãy cộng đều.
   *  Nâng vừa: dãy "×k+c"/sai phân; đếm có điều kiện.
   *  Thử thách: ghép thừa số khéo; trồng cây; nghĩ số nhiều bước.
   * ========================================================================== */
  function genTuDuy() {
    var topic = 'tu-duy';
    var t = tier();

    if (t === 0) {
      // ---- CƠ BẢN ----
      var kind = pick(['phanphoi', 'phanphoi', 'day-cong']);

      if (kind === 'phanphoi') {
        // a×c + b×c = (a+b)×c.
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

      // day-cong: dãy cộng đều.
      var start = randInt(1, 20), d = randInt(2, 9);
      var seq = [start, start + d, start + 2 * d, start + 3 * d];
      var next = start + 4 * d;
      return {
        type: 'input', topic: topic,
        stem: 'Tìm số tiếp theo của dãy: <b>' + seq.join('; ') + '; ...</b> (gõ số)',
        answer: String(next),
        explain: 'Quy luật: mỗi số hơn số trước ' + d + ' đơn vị. Số tiếp theo = ' + seq[3] + ' + ' + d + ' = ' + next + '.'
      };
    }

    if (t === 1) {
      // ---- NÂNG VỪA ----
      var sub = pick(['day-knc', 'day-saiphan', 'dem-dieukien']);

      if (sub === 'day-knc') {
        // dãy "×k + c": mỗi số = số trước × k + c.
        var k = randInt(2, 3), cAdd = randInt(1, 3), s0 = randInt(1, 4);
        var seq2 = [s0];
        for (var i = 1; i < 4; i++) seq2.push(seq2[i - 1] * k + cAdd);
        var next2 = seq2[3] * k + cAdd;
        return {
          type: 'input', topic: topic,
          stem: 'Tìm số tiếp theo của dãy: <b>' + seq2.join('; ') + '; ...</b> (gõ số)',
          answer: String(next2),
          explain: 'Quy luật: mỗi số = số trước × ' + k + ' + ' + cAdd + ' (ví dụ ' + seq2[0] + ' × ' + k + ' + ' +
                   cAdd + ' = ' + seq2[1] + '). Số tiếp theo = ' + seq2[3] + ' × ' + k + ' + ' + cAdd + ' = ' + next2 + '.'
        };
      }

      if (sub === 'day-saiphan') {
        // sai phân tăng dần: +1, +2, +3, ... (hoặc +2,+3,+4...)
        var s1 = randInt(1, 10), step0 = randInt(1, 3);
        var seq3 = [s1];
        var diffs = [];
        for (var j = 0; j < 3; j++) {
          var dj = step0 + j;
          diffs.push(dj);
          seq3.push(seq3[seq3.length - 1] + dj);
        }
        var nextDiff = step0 + 3;
        var next3 = seq3[seq3.length - 1] + nextDiff;
        return {
          type: 'input', topic: topic,
          stem: 'Tìm số tiếp theo của dãy: <b>' + seq3.join('; ') + '; ...</b> (gõ số)',
          answer: String(next3),
          explain: 'Khoảng cách tăng dần: lần lượt + ' + diffs.join(', + ') + '. Tiếp theo cộng ' + nextDiff +
                   ': ' + seq3[seq3.length - 1] + ' + ' + nextDiff + ' = ' + next3 + '.'
        };
      }

      // dem-dieukien: đếm số tròn chục / chia hết cho 5 trong khoảng.
      var byKind = pick(['tronchuc', 'chia5']);
      if (byKind === 'tronchuc') {
        var lo = randInt(1, 5) * 10;
        var hi = lo + randInt(3, 7) * 10;
        // số tròn chục từ lo đến hi (bao gồm 2 đầu).
        var count = (hi - lo) / 10 + 1;
        return {
          type: 'input', topic: topic,
          stem: 'Có bao nhiêu số tròn chục từ <b>' + lo + '</b> đến <b>' + hi + '</b> (tính cả ' + lo + ' và ' + hi + ')? (gõ số)',
          answer: String(count),
          explain: 'Các số tròn chục cách nhau 10. Số lượng = (' + hi + ' − ' + lo + ') ÷ 10 + 1 = ' +
                   ((hi - lo) / 10) + ' + 1 = ' + count + '.'
        };
      }
      var lo2 = randInt(1, 4) * 5;
      var hi2 = lo2 + randInt(4, 9) * 5;
      var count2 = (hi2 - lo2) / 5 + 1;
      return {
        type: 'input', topic: topic,
        stem: 'Có bao nhiêu số chia hết cho 5 từ <b>' + lo2 + '</b> đến <b>' + hi2 + '</b> (tính cả ' + lo2 + ' và ' + hi2 + ')? (gõ số)',
        answer: String(count2),
        explain: 'Các số chia hết cho 5 cách nhau 5. Số lượng = (' + hi2 + ' − ' + lo2 + ') ÷ 5 + 1 = ' +
                 ((hi2 - lo2) / 5) + ' + 1 = ' + count2 + '.'
      };
    }

    // ---- THỬ THÁCH ----
    var sub2 = pick(['ghep-thuaso', 'trong-cay', 'nghi-so']);

    if (sub2 === 'ghep-thuaso') {
      // ghép thừa số: 4 × q × 25 = q × 100 ; hoặc 2 × q × 5 = q × 10.
      var useBig = randInt(0, 1) === 1;
      var pairA = useBig ? 4 : 2, pairB = useBig ? 25 : 5;
      var q = randInt(2, 99);
      var order = shuffle([pairA, q, pairB]);
      var ans = q * (pairA * pairB);
      var dd = [pairA + q + pairB, q * (pairA + pairB), ans + (pairA * pairB), ans - (pairA * pairB)]
        .filter(function (v) { return v > 0 && v !== ans; });
      var mc = makeMC(ans, dd, function (v) { return groupDigits(v); }, numericPad);
      return {
        type: 'mc', topic: topic,
        stem: 'Tính nhanh: <b>' + order.join(' × ') + '</b>',
        choices: mc.choices, answer: mc.answerIndex,
        explain: 'Ghép ' + pairA + ' × ' + pairB + ' = ' + (pairA * pairB) + ' trước, rồi nhân với ' + q + ': ' +
                 q + ' × ' + (pairA * pairB) + ' = ' + groupDigits(ans) + '.'
      };
    }

    if (sub2 === 'trong-cay') {
      // trồng cây hai đầu: số cây = số khoảng + 1.
      var khoang = randInt(4, 12);
      var length = khoang * randInt(3, 8);
      var soKhoang = length / khoang;
      var ans = soKhoang + 1;
      return {
        type: 'input', topic: topic,
        stem: 'Trồng cây ở <b>cả hai đầu</b> một đoạn đường thẳng dài <b>' + length + ' m</b>, hai cây liền nhau ' +
              'cách nhau <b>' + khoang + ' m</b>. Cần trồng tất cả bao nhiêu cây? (gõ số)',
        answer: String(ans),
        explain: 'Số khoảng = ' + length + ' ÷ ' + khoang + ' = ' + soKhoang + '. Vì trồng cả hai đầu nên số cây = ' +
                 'số khoảng + 1 = ' + soKhoang + ' + 1 = ' + ans + '.'
      };
    }

    // nghi-so: nghĩ một số, ×k rồi +c (hoặc −c) được T. Tìm số.
    var k = randInt(2, 9);
    var x = randInt(2, 200);
    var addMode = randInt(0, 1) === 1;
    var c = randInt(1, 100);
    var T, opTxt, undo1;
    if (addMode) {
      T = x * k + c;
      opTxt = 'cộng thêm ' + c;
      undo1 = T + ' − ' + c + ' = ' + (T - c);
    } else {
      c = randInt(1, x * k - 1);   // bảo đảm T > 0
      T = x * k - c;
      opTxt = 'bớt đi ' + c;
      undo1 = T + ' + ' + c + ' = ' + (T + c);
    }
    var mid = addMode ? (T - c) : (T + c);
    return {
      type: 'input', topic: topic,
      stem: 'Nghĩ một số. Lấy số đó nhân với <b>' + k + '</b> rồi ' + opTxt + ' thì được <b>' + T +
            '</b>. Số đã nghĩ là bao nhiêu? (gõ số)',
      answer: String(x),
      explain: 'Làm ngược lại: ' + undo1 + '; rồi ' + mid + ' ÷ ' + k + ' = ' + x +
               '. Thử lại: ' + x + ' × ' + k + (addMode ? ' + ' + c : ' − ' + c) + ' = ' + T + '.'
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
    str = str.replace(/\bdu\b/g, 'dư').replace(/\br\b/g, 'dư').replace(/dư+/g, 'dư');
    str = str.replace(/(\d)[.,](?=\d)/g, '$1');
    str = str.replace(/\s*[;,]\s*/g, ';').replace(/\s+/g, ';');
    str = str.replace(/;?dư;?/g, 'dư');
    return str;
  }

  function normalizeNumeric(s) {
    return String(s == null ? '' : s).trim().toLowerCase().replace(/[\s.,]/g, '');
  }

  function normalizeSeq(s) {
    return String(s == null ? '' : s).trim().toLowerCase()
      .split(/[;,\s]+/)
      .filter(function (x) { return x.length; })
      .map(function (x) { return x.replace(/\D/g, ''); })
      .filter(function (x) { return x.length; })
      .join(';');
  }

  function matchInput(answer, userInput) {
    if (String(answer).indexOf(';') !== -1) {
      return normalizeSeq(userInput) === normalizeSeq(answer);
    }
    if (normalize(userInput) === normalize(answer)) return true;
    if (normalizeNumeric(userInput) === normalizeNumeric(answer) &&
        /\d/.test(String(answer)) && !/[a-zưd ;]/i.test(normalize(answer).replace(/dư/, ''))) {
      return true;
    }
    return false;
  }

  function check(question, userInput) {
    if (!question) return false;
    if (question.type === 'mc') {
      var idx = Number(userInput);
      return Number.isInteger(idx) && idx === question.answer;
    }
    return matchInput(question.answer, userInput);
  }

  var QuestionEngine = {
    topics: topics,
    generate: generate,
    generateMixed: generateMixed,
    check: check,
    _readNumberVi: readNumberVi,
    _groupDigits: groupDigits,
    _normalize: normalize
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = QuestionEngine;
  if (typeof window !== 'undefined') window.QuestionEngine = QuestionEngine;
  if (typeof globalThis !== 'undefined') globalThis.QuestionEngine = QuestionEngine;
})();
