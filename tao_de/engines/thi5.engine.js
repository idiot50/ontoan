/*
 * engine.js — Động cơ sinh câu hỏi "Thi Lớp 5" (ôn thi vào lớp 6)
 * Nguồn kiến thức: KIEN_THUC.md (tổng hợp từ 49 đề thi vào lớp 6 + đề cương lớp 4–5).
 *
 * Classic script: chạy được qua <script src> (file://) lẫn node (require).
 * Mọi câu hỏi tuân theo "giao kèo dữ liệu" (giống engine lớp 1 / lớp 3):
 *   { type:'mc'|'input', topic, stem, choices?, answer, explain, tier }
 *   - type 'mc'    : answer = CHỈ SỐ phương án đúng trong choices.
 *   - type 'input' : answer = chuỗi đáp án chuẩn (số, số thập phân dấu PHẨY, phân số a/b,
 *                    hoặc dãy số ngăn bằng dấu ;).
 * answer LUÔN được tính bằng code, không gõ tay.
 *
 * Mỗi chủ đề chia 3 TẦNG độ khó, random theo trọng số ~35/40/25
 * (Cơ bản / Nâng vừa / Thử thách) — đề thi vào lớp 6 nặng suy luận nên tầng 2 dày hơn lớp 3.
 *
 * Phạm vi kiến thức: số tự nhiên, phân số, số thập phân, đại lượng – đo lường,
 * tỉ số & tỉ số phần trăm, các dạng toán điển hình, hình phẳng, hình khối,
 * toán chuyển động, tư duy – suy luận. KHÔNG dùng đại số THCS (phương trình chữ,
 * số âm, luỹ thừa ký hiệu) — mọi lời giải trình bày theo cách tiểu học.
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
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Ước chung lớn nhất (dùng cho phân số).
  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = a % b; a = b; b = t; }
    return a || 1;
  }

  // Bội chung nhỏ nhất.
  function lcm(a, b) { return a / gcd(a, b) * b; }

  // Điều khiển tầng độ khó từ ngoài (cho trình tạo đề). null = ngẫu nhiên như cũ.
  var _forcedTier = null;   // 0/1/2 nếu generate(topicId,{tier}) ép
  var _lastTier = null;     // tầng thực tế của câu vừa sinh

  // Chọn tầng độ khó theo trọng số (mặc định 35/40/25 cho ôn thi vào lớp 6).
  function tier(w0, w1, w2) {
    if (_forcedTier !== null) { _lastTier = _forcedTier; return _forcedTier; }
    if (w0 === undefined) { w0 = 35; w1 = 40; w2 = 25; }
    var r = randInt(1, w0 + w1 + w2);
    _lastTier = (r <= w0) ? 0 : (r <= w0 + w1 ? 1 : 2);
    return _lastTier;
  }

  /* ------------------------- ĐỊNH DẠNG SỐ KIỂU VIỆT ------------------------- */

  // Số nguyên có dấu cách phân nhóm nghìn cho dễ đọc: 1234567 -> "1 234 567".
  function groupDigits(n) {
    var neg = n < 0;
    var s = String(Math.abs(n));
    var out = '', c = 0;
    for (var i = s.length - 1; i >= 0; i--) {
      out = s[i] + out; c++;
      if (c % 3 === 0 && i > 0) out = ' ' + out;
    }
    return (neg ? '-' : '') + out;
  }
  function fmtInt(n) { return groupDigits(n); }

  /*
   * Số thập phân kiểu Việt Nam (dấu PHẨY), bỏ chữ số 0 thừa ở cuối.
   * dec(48) -> "48" ; dec(3.5) -> "3,5" ; dec(0.1+0.2) -> "0,3".
   * Luôn làm tròn tới `dp` chữ số thập phân (mặc định 6) để triệt sai số dấu phẩy động.
   */
  function dec(x, dp) {
    if (dp === undefined) dp = 6;
    var p = Math.pow(10, dp);
    var s = (Math.round(x * p) / p).toFixed(dp);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s.replace('.', ',');
  }

  // Số thập phân CÓ phân nhóm nghìn (dùng cho tiền: 340 000).
  function decGroup(x, dp) {
    var s = dec(x, dp);
    var parts = s.split(',');
    return groupDigits(Number(parts[0])) + (parts[1] ? ',' + parts[1] : '');
  }

  // Phân số tối giản dạng chuỗi: fracStr(6,8) -> "3/4" ; fracStr(6,3) -> "2".
  function fracStr(n, d) {
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d);
    n = n / g; d = d / g;
    return d === 1 ? String(n) : (n + '/' + d);
  }

  // Phân số hiển thị trong đề (dạng a/b, giữ nguyên không rút gọn).
  function fracRaw(n, d) { return '<b>' + n + '/' + d + '</b>'; }

  // Tên hàng của chữ số, tính từ phải sang (0 = đơn vị).
  var HANG = ['đơn vị', 'chục', 'trăm', 'nghìn', 'chục nghìn', 'trăm nghìn',
              'triệu', 'chục triệu', 'trăm triệu'];

  /*
   * Tạo bộ trắc nghiệm: nhận đáp án đúng + danh sách distractor (giá trị),
   * loại trùng, bù cho đủ `want` phương án, trộn vị trí.
   * Trả về { choices, answerIndex }.
   *  - format : hàm biến giá trị -> chuỗi hiển thị (mặc định String).
   *  - padFn  : hàm sinh phương án bù khi thiếu; KHÔNG truyền => giữ đúng số phương án có sẵn
   *             (dùng cho câu điền dấu >,<,= chỉ có 3 lựa chọn).
   */
  function makeMC(correct, distractors, format, padFn, want) {
    format = format || function (x) { return String(x); };
    want = want || 4;
    var seen = {}, values = [];
    var correctKey = format(correct);
    seen[correctKey] = true;
    values.push(correct);

    for (var i = 0; i < distractors.length && values.length < want; i++) {
      var d = distractors[i];
      if (typeof d === 'number' && (!isFinite(d) || d < 0)) continue; // không đưa số âm cho tiểu học
      var k = format(d);
      if (!seen[k]) { seen[k] = true; values.push(d); }
    }
    var guard = 0;
    while (values.length < want && padFn && guard < 300) {
      guard++;
      var extra = padFn(correct, values);
      if (typeof extra === 'number' && (!isFinite(extra) || extra < 0)) continue;
      var ek = format(extra);
      if (!seen[ek]) { seen[ek] = true; values.push(extra); }
    }

    var order = shuffle(values);
    var answerIndex = -1;
    for (var j = 0; j < order.length; j++) {
      if (format(order[j]) === correctKey) { answerIndex = j; break; }
    }
    return { choices: order.map(format), answerIndex: answerIndex };
  }

  // padFn mặc định cho số nguyên: sinh số gần đáp án.
  function numericPad(correct) {
    var delta = randInt(1, 12);
    return correct + (randInt(0, 1) ? delta : -delta);
  }
  // padFn cho số thập phân: lệch 0,1 – 2,5.
  function decimalPad(correct) {
    var delta = randInt(1, 25) / 10;
    return Math.round((correct + (randInt(0, 1) ? delta : -delta)) * 1000) / 1000;
  }

  // Gói gọn: dựng câu trắc nghiệm từ giá trị đúng + distractor.
  function mcQ(topic, stem, correct, distractors, explain, format, padFn, want) {
    var mc = makeMC(correct, distractors, format, padFn, want);
    return {
      type: 'mc', topic: topic, stem: stem,
      choices: mc.choices, answer: mc.answerIndex, explain: explain
    };
  }

  // Gói gọn: câu tự luận (gõ đáp án).
  function inQ(topic, stem, answer, explain) {
    return { type: 'input', topic: topic, stem: stem, answer: String(answer), explain: explain };
  }

  /*
   * Câu so sánh điền dấu > < = (luôn đúng 3 phương án, không bù rác).
   * Dấu "bé hơn" phải viết là &lt; — mọi chuỗi ở đây đều được nhét vào trang bằng
   * innerHTML và còn đi qua bộ bóc thẻ HTML của trình tạo đề in giấy; một dấu "<"
   * trần đứng trước bất kỳ ">" nào sẽ bị hiểu nhầm là thẻ và NUỐT MẤT cả đoạn.
   */
  var LT = '&lt;';
  function dauSoSanh(a, b) { return a > b ? '>' : (a < b ? LT : '='); }
  function compareQ(topic, stem, a, b, explain) {
    return mcQ(topic, stem, dauSoSanh(a, b), ['>', LT, '='], explain, null, null, 3);
  }

  /* ============================================================================
   *  1. SỐ TỰ NHIÊN — cấu tạo số, tính nhanh, dấu hiệu chia hết, tìm x
   * ========================================================================== */
  function genSoTuNhien() {
    var topic = 'so-tu-nhien';
    var t = tier();

    if (t === 0) {
      var k = randInt(0, 2);

      if (k === 0) {
        // Giá trị của một chữ số theo hàng. Dùng các chữ số ĐÔI MỘT KHÁC NHAU
        // để câu "chữ số d" không mơ hồ.
        var L = randInt(6, 7);
        var pool = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, L);
        if (pool[0] === 0) {
          for (var i = 1; i < L; i++) {
            if (pool[i] !== 0) { pool[0] = pool[i]; pool[i] = 0; break; }
          }
        }
        var p = randInt(0, L - 1);
        var d = pool[p];
        if (d === 0) { p = (p + 1) % L; d = pool[p]; }   // tránh hỏi chữ số 0
        var N = Number(pool.join(''));
        var bac = L - 1 - p;
        var val = d * Math.pow(10, bac);
        return mcQ(topic,
          'Trong số <b>' + fmtInt(N) + '</b>, chữ số <b>' + d + '</b> có giá trị là bao nhiêu?',
          val,
          [d * Math.pow(10, bac + 1), bac > 0 ? d * Math.pow(10, bac - 1) : d * 100, d, Math.pow(10, bac)],
          'Chữ số ' + d + ' đứng ở hàng <b>' + HANG[bac] + '</b> nên có giá trị ' +
          d + ' × ' + fmtInt(Math.pow(10, bac)) + ' = <b>' + fmtInt(val) + '</b>.',
          fmtInt, numericPad);
      }

      if (k === 1) {
        // Viết số từ cấu tạo (chỉ đọc các hàng khác 0).
        var parts = [
          { v: randInt(1, 9), mu: 10000, ten: 'chục nghìn' },
          { v: randInt(0, 9), mu: 1000, ten: 'nghìn' },
          { v: randInt(0, 9), mu: 100, ten: 'trăm' },
          { v: randInt(0, 9), mu: 10, ten: 'chục' },
          { v: randInt(0, 9), mu: 1, ten: 'đơn vị' }
        ];
        var N2 = 0, mo = [];
        for (var j = 0; j < parts.length; j++) {
          N2 += parts[j].v * parts[j].mu;
          if (parts[j].v > 0) mo.push('<b>' + parts[j].v + '</b> ' + parts[j].ten);
        }
        var moTa = mo.length > 1
          ? mo.slice(0, mo.length - 1).join(', ') + ' và ' + mo[mo.length - 1]
          : mo[0];
        return inQ(topic,
          'Viết số gồm ' + moTa + '. (gõ số)',
          N2,
          'Ghép theo hàng: ' + mo.join(' + ').replace(/<\/?b>/g, '') + ' = <b>' + fmtInt(N2) + '</b>.');
      }

      // So sánh hai số tự nhiên gần nhau. Ca "=" chỉ chiếm ~1/8 — trước đây 1/4 là quá
      // dày, hai số giống hệt nhau nhìn lộ liễu và không rèn được kĩ năng so sánh.
      var A = randInt(10000, 999999);
      var B = randInt(0, 7) === 0 ? A : A + (randInt(0, 1) ? 1 : -1) * randInt(1, 900);
      return compareQ(topic,
        'Điền dấu thích hợp: <b>' + fmtInt(A) + '</b> … <b>' + fmtInt(B) + '</b>',
        A, B,
        'So sánh từng hàng từ trái sang phải: ' + fmtInt(A) + ' ' +
        dauSoSanh(A, B) + ' ' + fmtInt(B) + '.');
    }

    if (t === 1) {
      var k1 = randInt(0, 2);

      if (k1 === 0) {
        // Tính nhanh bằng tính chất phân phối: a×b + a×c = a×(b+c).
        var a = randInt(3, 29);
        var tong = pick([10, 20, 50, 100]);
        var b = randInt(2, tong - 2), c = tong - b;
        var truMode = randInt(0, 1) === 1;
        if (truMode) {
          // a×(b+c) − a×c = a×b : cho dạng trừ với hiệu tròn.
          var big = tong + randInt(1, 40);
          var small = big - tong;
          return inQ(topic,
            'Tính nhanh: <b>' + a + ' × ' + big + ' − ' + a + ' × ' + small + '</b> = ? (gõ số)',
            a * tong,
            'Đưa về nhân chung: ' + a + ' × ' + big + ' − ' + a + ' × ' + small + ' = ' +
            a + ' × (' + big + ' − ' + small + ') = ' + a + ' × ' + tong + ' = <b>' + fmtInt(a * tong) + '</b>.');
        }
        return inQ(topic,
          'Tính nhanh: <b>' + a + ' × ' + b + ' + ' + a + ' × ' + c + '</b> = ? (gõ số)',
          a * tong,
          'Đưa về nhân chung: ' + a + ' × ' + b + ' + ' + a + ' × ' + c + ' = ' +
          a + ' × (' + b + ' + ' + c + ') = ' + a + ' × ' + tong + ' = <b>' + fmtInt(a * tong) + '</b>.');
      }

      if (k1 === 1) {
        // Tìm x hai bước: x × a + b = c  (hoặc x × a − b = c).
        var a2 = randInt(3, 12), x = randInt(12, 250), b2 = randInt(15, 600);
        var cong = randInt(0, 1) === 1;
        var c2 = cong ? x * a2 + b2 : x * a2 - b2;
        if (!cong && c2 <= 0) { b2 = randInt(1, x * a2 - 1); c2 = x * a2 - b2; }
        var mid = cong ? c2 - b2 : c2 + b2;
        return inQ(topic,
          'Tìm x, biết: <b>x × ' + a2 + (cong ? ' + ' : ' − ') + b2 + ' = ' + c2 + '</b> (gõ số)',
          x,
          'x × ' + a2 + ' = ' + c2 + (cong ? ' − ' : ' + ') + b2 + ' = ' + mid + '<br>' +
          'x = ' + mid + ' : ' + a2 + ' = <b>' + x + '</b>.');
      }

      // Dấu hiệu chia hết cho 9 — điền chữ số vào dấu *.
      // Chọn sao cho nghiệm DUY NHẤT trong 0..9 (tránh trường hợp cả 0 và 9 cùng đúng).
      var digits, sum, r, tries = 0;
      do {
        digits = [randInt(1, 9), randInt(0, 9), randInt(0, 9)];
        sum = digits[0] + digits[1] + digits[2];
        r = (9 - sum % 9) % 9;
        tries++;
      } while (r === 0 && tries < 50);
      if (r === 0) r = 9;   // hiếm: chấp nhận đáp án 9
      var pos = randInt(0, 3);   // vị trí dấu * trong số 4 chữ số
      var strArr = digits.slice();
      strArr.splice(pos, 0, '*');
      // Nếu * ở đầu thì chữ số điền phải khác 0 -> đổi sang cuối cho an toàn.
      if (pos === 0 && r === 0) { strArr = digits.concat(['*']); }
      var soStr = strArr.join('');
      return inQ(topic,
        'Thay dấu <b>*</b> bằng một chữ số thích hợp để số <b>' + soStr + '</b> chia hết cho <b>9</b>. ' +
        'Chữ số đó là bao nhiêu? (gõ số)',
        r,
        'Số chia hết cho 9 khi TỔNG các chữ số chia hết cho 9.<br>' +
        'Tổng các chữ số đã biết: ' + digits.join(' + ') + ' = ' + sum + '.<br>' +
        'Cần thêm ' + r + ' nữa thì tổng là ' + (sum + r) + ' — chia hết cho 9. Vậy * = <b>' + r + '</b>.');
    }

    // ---- Tầng 2: thử thách ----
    var k2 = randInt(0, 2);

    if (k2 === 0) {
      // Đếm các số có 3 chữ số chia hết cho k.
      var kk = pick([3, 4, 6, 7, 8, 9, 11, 12]);
      var minN = Math.ceil(100 / kk) * kk;
      var maxN = Math.floor(999 / kk) * kk;
      var cnt = (maxN - minN) / kk + 1;
      return inQ(topic,
        'Có bao nhiêu số có <b>ba chữ số</b> chia hết cho <b>' + kk + '</b>? (gõ số)',
        cnt,
        'Số bé nhất có 3 chữ số chia hết cho ' + kk + ' là ' + minN + '; số lớn nhất là ' + maxN + '.<br>' +
        'Đây là dãy cách đều ' + kk + ' đơn vị nên số các số = (' + maxN + ' − ' + minN + ') : ' + kk +
        ' + 1 = <b>' + cnt + '</b>.');
    }

    if (k2 === 1) {
      // Số nhỏ nhất có 4 chữ số chia hết cho nhiều số cùng lúc.
      var bo = pick([[2, 5], [2, 9], [5, 9], [3, 5], [2, 5, 9], [4, 6], [3, 4]]);
      var L2 = bo.reduce(function (x, y) { return lcm(x, y); });
      var ans2 = Math.ceil(1000 / L2) * L2;
      return inQ(topic,
        'Tìm số tự nhiên <b>nhỏ nhất có bốn chữ số</b> chia hết cho cả <b>' + bo.join(', ') + '</b>. (gõ số)',
        ans2,
        'Số chia hết cho cả ' + bo.join(', ') + ' thì chia hết cho ' + L2 + '.<br>' +
        '1000 : ' + L2 + ' = ' + Math.floor(1000 / L2) + ' (dư ' + (1000 % L2) + ') nên bội nhỏ nhất của ' + L2 +
        ' mà ≥ 1000 là ' + L2 + ' × ' + (ans2 / L2) + ' = <b>' + fmtInt(ans2) + '</b>.');
    }

    // Tính nhanh nhờ ghép cặp tròn trăm/nghìn: 25 × m × 4.
    var pr = pick([[25, 4], [50, 2], [125, 8], [20, 5], [250, 4]]);
    var m = randInt(11, 99);
    var ans3 = pr[0] * pr[1] * m;
    var thuTu = randInt(0, 1) === 1
      ? pr[0] + ' × ' + m + ' × ' + pr[1]
      : pr[1] + ' × ' + m + ' × ' + pr[0];
    return inQ(topic,
      'Tính nhanh: <b>' + thuTu + '</b> = ? (gõ số)',
      ans3,
      'Đổi chỗ để ghép cặp tròn: ' + pr[0] + ' × ' + pr[1] + ' = ' + (pr[0] * pr[1]) + '.<br>' +
      'Vậy kết quả = ' + (pr[0] * pr[1]) + ' × ' + m + ' = <b>' + fmtInt(ans3) + '</b>.');
  }

  /* ============================================================================
   *  2. PHÂN SỐ
   * ========================================================================== */
  function genPhanSo() {
    var topic = 'phan-so';
    var t = tier();

    if (t === 0) {
      var k = randInt(0, 2);

      if (k === 0) {
        // Rút gọn phân số.
        var a, b;
        do { a = randInt(1, 11); b = randInt(2, 13); } while (a >= b || gcd(a, b) !== 1);
        var g = randInt(2, 9);
        return inQ(topic,
          'Rút gọn phân số ' + fracRaw(a * g, b * g) + ' về phân số tối giản. (gõ dạng a/b)',
          fracStr(a, b),
          'Chia cả tử và mẫu cho ' + g + ': ' + (a * g) + ' : ' + g + ' = ' + a + ' ; ' +
          (b * g) + ' : ' + g + ' = ' + b + '.<br>Vậy được <b>' + fracStr(a, b) + '</b>.');
      }

      if (k === 1) {
        // Cộng / trừ phân số cùng mẫu.
        var d = randInt(4, 15);
        var n1 = randInt(1, d - 1), n2 = randInt(1, d - 1);
        var cong = randInt(0, 1) === 1;
        if (!cong && n1 < n2) { var tmp = n1; n1 = n2; n2 = tmp; }
        var tu = cong ? n1 + n2 : n1 - n2;
        return inQ(topic,
          'Tính: ' + fracRaw(n1, d) + (cong ? ' + ' : ' − ') + fracRaw(n2, d) +
          ' = ? (gõ dạng a/b, đã rút gọn)',
          fracStr(tu, d),
          'Cùng mẫu số thì giữ nguyên mẫu, ' + (cong ? 'cộng' : 'trừ') + ' tử số: ' +
          n1 + (cong ? ' + ' : ' − ') + n2 + ' = ' + tu + '.<br>' +
          (fracStr(tu, d) === (tu + '/' + d)
            ? 'Kết quả: <b>' + fracStr(tu, d) + '</b>.'
            : 'Được ' + tu + '/' + d + ', rút gọn thành <b>' + fracStr(tu, d) + '</b>.'));
      }

      // So sánh hai phân số. Hai phân số phải KHÁC NHAU (không hỏi "3/6 … 3/6"),
      // và lời giải phải quy đồng về MẪU SỐ CHUNG NHỎ NHẤT như SGK dạy — không nhân
      // chéo b1×b2 cho ra những số to vô ích (7/8 và 3/2 thì mẫu chung là 8, không phải 16).
      var b1 = randInt(2, 9), b2 = randInt(2, 9);
      var a1 = randInt(1, b1 * 2), a2 = randInt(1, b2 * 2);
      var guardSS = 0;
      while (a1 * b2 === a2 * b1 && a1 === a2 && b1 === b2 && guardSS < 40) {
        guardSS++; a2 = randInt(1, b2 * 2);
      }
      var msc = lcm(b1, b2);
      var q1 = a1 * (msc / b1), q2 = a2 * (msc / b2);
      var dauSS = dauSoSanh(q1, q2);
      var giaiSS = (b1 === b2)
        ? 'Hai phân số đã <b>cùng mẫu số</b> nên chỉ cần so sánh tử số: ' +
          a1 + ' ' + dauSS + ' ' + a2 + '.'
        : 'Quy đồng về mẫu số chung nhỏ nhất là ' + msc + ': ' +
          a1 + '/' + b1 + ' = ' + q1 + '/' + msc + ' ; ' + a2 + '/' + b2 + ' = ' + q2 + '/' + msc +
          '.<br>So sánh tử số: ' + q1 + ' ' + dauSS + ' ' + q2 + '.';
      return compareQ(topic,
        'Điền dấu thích hợp: ' + fracRaw(a1, b1) + ' … ' + fracRaw(a2, b2),
        q1, q2, giaiSS);
    }

    if (t === 1) {
      var k1 = randInt(0, 3);

      if (k1 === 0) {
        // Cộng / trừ phân số KHÁC mẫu.
        var p1 = randInt(2, 9), p2 = randInt(2, 9);
        if (p1 === p2) p2 = p1 + 1;
        var t1 = randInt(1, p1 - 1), t2 = randInt(1, p2 - 1);
        var congA = randInt(0, 1) === 1;
        var mc = lcm(p1, p2);
        var u1 = t1 * (mc / p1), u2 = t2 * (mc / p2);
        if (!congA && u1 < u2) { var s = t1; t1 = t2; t2 = s; var sp = p1; p1 = p2; p2 = sp; u1 = t1 * (mc / p1); u2 = t2 * (mc / p2); }
        var tuA = congA ? u1 + u2 : u1 - u2;
        return inQ(topic,
          'Tính: ' + fracRaw(t1, p1) + (congA ? ' + ' : ' − ') + fracRaw(t2, p2) +
          ' = ? (gõ dạng a/b, đã rút gọn)',
          fracStr(tuA, mc),
          'Quy đồng mẫu số ' + mc + ': ' + t1 + '/' + p1 + ' = ' + u1 + '/' + mc + ' ; ' +
          t2 + '/' + p2 + ' = ' + u2 + '/' + mc + '.<br>' +
          u1 + '/' + mc + (congA ? ' + ' : ' − ') + u2 + '/' + mc + ' = ' + tuA + '/' + mc +
          ' = <b>' + fracStr(tuA, mc) + '</b>.');
      }

      if (k1 === 1) {
        // Nhân / chia hai phân số.
        var m1 = randInt(1, 9), n1b = randInt(2, 10);
        var m2 = randInt(1, 9), n2b = randInt(2, 10);
        var nhan = randInt(0, 1) === 1;
        var tuB = nhan ? m1 * m2 : m1 * n2b;
        var mauB = nhan ? n1b * n2b : n1b * m2;
        return inQ(topic,
          'Tính: ' + fracRaw(m1, n1b) + (nhan ? ' × ' : ' : ') + fracRaw(m2, n2b) +
          ' = ? (gõ dạng a/b, đã rút gọn)',
          fracStr(tuB, mauB),
          (nhan
            ? 'Nhân phân số: tử nhân tử, mẫu nhân mẫu — ' + m1 + ' × ' + m2 + ' = ' + (m1 * m2) +
              ' ; ' + n1b + ' × ' + n2b + ' = ' + (n1b * n2b) + '.'
            : 'Chia phân số: nhân với phân số đảo ngược — ' + m1 + '/' + n1b + ' × ' +
              (m2 === 1 ? String(n2b) : (n2b + '/' + m2)) + ' = ' + tuB + '/' + mauB + '.') +
          '<br>Kết quả rút gọn: <b>' + fracStr(tuB, mauB) + '</b>.');
      }

      if (k1 === 2) {
        // Tìm phân số của một số.
        var mauC = randInt(3, 9), tuC = randInt(1, mauC - 1);
        var soC = mauC * randInt(4, 30);
        var ansC = soC / mauC * tuC;
        var doVat = pick([
          { d: 'quyển vở', n: 'Hộp có' }, { d: 'viên bi', n: 'Túi có' },
          { d: 'quả táo', n: 'Rổ có' }, { d: 'cái bánh', n: 'Khay có' }
        ]);
        return inQ(topic,
          doVat.n + ' <b>' + soC + '</b> ' + doVat.d + '. Bạn Lan lấy ra ' + fracRaw(tuC, mauC) +
          ' số ' + doVat.d + ' đó. Bạn Lan lấy bao nhiêu ' + doVat.d + '? (gõ số)',
          ansC,
          'Tìm ' + tuC + '/' + mauC + ' của ' + soC + ': lấy ' + soC + ' : ' + mauC + ' = ' + (soC / mauC) +
          ' rồi nhân ' + tuC + ' → ' + (soC / mauC) + ' × ' + tuC + ' = <b>' + ansC + '</b> ' + doVat.d + '.');
      }

      // Hỗn số -> phân số. Phần phân số phải TỐI GIẢN, nếu không hỗn số "4 6/8"
      // trông sai quy tắc viết hỗn số ở tiểu học.
      var ngd = randInt(1, 6), mauD = randInt(2, 9), tuD = randInt(1, mauD - 1);
      var guardD = 0;
      while (gcd(tuD, mauD) !== 1 && guardD < 60) { guardD++; mauD = randInt(2, 9); tuD = randInt(1, mauD - 1); }
      var tuTong = ngd * mauD + tuD;
      return inQ(topic,
        'Viết hỗn số <b>' + ngd + ' ' + tuD + '/' + mauD + '</b> thành phân số. (gõ dạng a/b)',
        fracStr(tuTong, mauD),
        'Tử số mới = phần nguyên × mẫu + tử = ' + ngd + ' × ' + mauD + ' + ' + tuD + ' = ' + tuTong +
        '. Giữ nguyên mẫu ' + mauD + '.<br>Vậy được <b>' + tuTong + '/' + mauD + '</b>.');
    }

    // ---- Tầng 2: thử thách ----
    var k2 = randInt(0, 2);

    if (k2 === 0) {
      // Tìm một số khi biết phân số của nó.
      var mauE = randInt(3, 9), tuE = randInt(1, mauE - 1);
      var soE = mauE * randInt(5, 40);
      var giaTri = soE / mauE * tuE;
      return inQ(topic,
        fracRaw(tuE, mauE) + ' của một số là <b>' + giaTri + '</b>. Tìm số đó. (gõ số)',
        soE,
        (tuE === 1
          ? 'Chia số cần tìm thành ' + mauE + ' phần bằng nhau thì 1 phần là ' + giaTri + '.<br>'
          : 'Nếu ' + tuE + ' phần bằng ' + giaTri + ' thì 1 phần = ' + giaTri + ' : ' + tuE + ' = ' + (giaTri / tuE) + '.<br>') +
        'Cả số gồm ' + mauE + ' phần nên bằng ' + (giaTri / tuE) + ' × ' + mauE + ' = <b>' + soE + '</b>.');
    }

    if (k2 === 1) {
      // Tính nhanh dãy sai phân: 1/(1×2) + 1/(2×3) + ... + 1/(n×(n+1)) = n/(n+1).
      // n bắt đầu từ 6: liệt kê 3 số hạng đầu rồi mới "…" — bảo đảm dấu "…" LUÔN
      // thay cho ít nhất một số hạng bị bỏ, không nằm giữa hai số hạng liền nhau.
      var nSp = randInt(6, 9);
      var terms = [];
      for (var i = 1; i <= 3; i++) terms.push('1/(' + i + '×' + (i + 1) + ')');
      terms.push('…');
      terms.push('1/(' + nSp + '×' + (nSp + 1) + ')');
      return inQ(topic,
        'Tính nhanh: <b>' + terms.join(' + ') + '</b> = ? (gõ dạng a/b)',
        fracStr(nSp, nSp + 1),
        'Nhận xét: 1/(a×b) = 1/a − 1/b khi b = a + 1.<br>' +
        'Tổng = (1/1 − 1/2) + (1/2 − 1/3) + … + (1/' + nSp + ' − 1/' + (nSp + 1) + ').<br>' +
        'Các số ở giữa triệt tiêu hết, còn 1 − 1/' + (nSp + 1) + ' = <b>' + nSp + '/' + (nSp + 1) + '</b>.');
    }

    // Tính nhanh tích (1 + 1/2) × (1 + 1/3) × ... × (1 + 1/n) = (n+1)/2.
    // n2 từ 6 trở lên vì đề liệt kê tới (1 + 1/4) rồi mới "…": nếu n2 = 4 thì thừa số
    // (1 + 1/4) bị in HAI LẦN, đề đọc ra một tích khác hẳn và bé làm đúng vẫn bị chấm sai.
    var n2 = randInt(6, 9);
    var ts = [];
    for (var j = 2; j <= 4; j++) ts.push('(1 + 1/' + j + ')');
    ts.push('…');
    ts.push('(1 + 1/' + n2 + ')');
    return inQ(topic,
      'Tính nhanh: <b>' + ts.join(' × ') + '</b> = ? (gõ dạng a/b)',
      fracStr(n2 + 1, 2),
      'Viết mỗi thừa số thành phân số: 1 + 1/k = (k+1)/k.<br>' +
      'Tích = 3/2 × 4/3 × 5/4 × … × ' + (n2 + 1) + '/' + n2 + '.<br>' +
      'Tử của phân số trước rút gọn với mẫu của phân số sau, chỉ còn ' + (n2 + 1) + '/2 = <b>' +
      fracStr(n2 + 1, 2) + '</b>.');
  }

  /* ============================================================================
   *  3. SỐ THẬP PHÂN
   * ========================================================================== */
  function genSoThapPhan() {
    var topic = 'so-thap-phan';
    var t = tier();

    if (t === 0) {
      var k = randInt(0, 2);

      if (k === 0) {
        // Hỏi hàng của một chữ số trong phần thập phân.
        // Các chữ số trong CẢ SỐ phải đôi một khác nhau, nếu không câu "chữ số 3"
        // sẽ mơ hồ khi số 3 xuất hiện ở cả phần nguyên lẫn phần thập phân.
        var soCsNguyen = randInt(1, 2);
        var kho = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, soCsNguyen + 3);
        var ngd = Number(kho.slice(0, soCsNguyen).join(''));
        var dArr = kho.slice(soCsNguyen);
        var pos = randInt(0, 2);
        var tenHang = ['phần mười', 'phần trăm', 'phần nghìn'][pos];
        var soStr = ngd + ',' + dArr.join('');
        return mcQ(topic,
          'Trong số <b>' + soStr + '</b>, chữ số <b>' + dArr[pos] + '</b> thuộc hàng nào?',
          tenHang,
          ['phần mười', 'phần trăm', 'phần nghìn', 'đơn vị'],
          'Sau dấu phẩy, các hàng lần lượt là: phần mười, phần trăm, phần nghìn.<br>' +
          'Chữ số ' + dArr[pos] + ' đứng thứ ' + (pos + 1) + ' sau dấu phẩy nên thuộc hàng <b>' + tenHang + '</b>.',
          null, null, 4);
      }

      if (k === 1) {
        // So sánh hai số thập phân.
        var x1 = randInt(100, 9999), x2;
        if (randInt(0, 3) === 0) x2 = x1;
        else x2 = x1 + (randInt(0, 1) ? 1 : -1) * randInt(1, 60);
        if (x2 <= 0) x2 = x1 + randInt(1, 60);
        var s1 = dec(x1 / 100, 2), s2 = dec(x2 / 100, 2);
        return compareQ(topic,
          'Điền dấu thích hợp: <b>' + s1 + '</b> … <b>' + s2 + '</b>',
          x1, x2,
          'So sánh phần nguyên trước, rồi lần lượt tới hàng phần mười, phần trăm.<br>' +
          s1 + ' ' + dauSoSanh(x1, x2) + ' ' + s2 + '.');
      }

      // Viết số đo dưới dạng số thập phân (độ dài).
      var m0 = randInt(1, 20), cm0 = randInt(1, 99);
      return inQ(topic,
        'Viết số thập phân thích hợp: <b>' + m0 + ' m ' + cm0 + ' cm = … m</b> (gõ số, dùng dấu phẩy)',
        dec(m0 + cm0 / 100, 2),
        '1 m = 100 cm nên ' + cm0 + ' cm = ' + dec(cm0 / 100, 2) + ' m.<br>' +
        'Vậy ' + m0 + ' m ' + cm0 + ' cm = <b>' + dec(m0 + cm0 / 100, 2) + ' m</b>.');
    }

    if (t === 1) {
      var k1 = randInt(0, 3);

      if (k1 === 0) {
        // Cộng / trừ số thập phân (tính bằng số nguyên phần trăm cho chính xác tuyệt đối).
        var a = randInt(150, 9800), b = randInt(120, 9500);   // đơn vị: phần trăm
        var cong = randInt(0, 1) === 1;
        if (!cong && a < b) { var sw = a; a = b; b = sw; }
        var kq = cong ? a + b : a - b;
        return inQ(topic,
          'Tính: <b>' + dec(a / 100, 2) + (cong ? ' + ' : ' − ') + dec(b / 100, 2) + '</b> = ? (gõ số)',
          dec(kq / 100, 2),
          'Đặt tính thẳng cột dấu phẩy rồi ' + (cong ? 'cộng' : 'trừ') + ' như số tự nhiên, ' +
          'sau đó đặt dấu phẩy ở kết quả.<br>Kết quả: <b>' + dec(kq / 100, 2) + '</b>.');
      }

      if (k1 === 1) {
        // Nhân số thập phân với số tự nhiên.
        // v là số phần TRĂM; ép v không chia hết cho 10 để số hiển thị THẬT SỰ có
        // đúng 2 chữ số thập phân — nếu không, dec() cắt số 0 cuối (4310 -> "43,1")
        // trong khi lời giải vẫn dạy "tách 2 chữ số", tức là dạy SAI quy tắc.
        var v = randInt(105, 9950);   // phần trăm
        while (v % 10 === 0) v = randInt(105, 9950);
        var n = randInt(2, 25);
        var kq2 = v * n;              // vẫn là phần trăm
        return inQ(topic,
          'Tính: <b>' + dec(v / 100, 2) + ' × ' + n + '</b> = ? (gõ số)',
          dec(kq2 / 100, 2),
          'Nhân như số tự nhiên: ' + v + ' × ' + n + ' = ' + fmtInt(kq2) + '.<br>' +
          'Thừa số ' + dec(v / 100, 2) + ' có 2 chữ số ở phần thập phân nên tách 2 chữ số từ phải sang: <b>' +
          dec(kq2 / 100, 2) + '</b>.');
      }

      if (k1 === 2) {
        // Chia số thập phân cho số tự nhiên (chia hết).
        // Ép SỐ BỊ CHIA có phần thập phân (biChia % 100 !== 0), nếu không sẽ ra đề
        // kiểu "36 : 10" — đó là chia số TỰ NHIÊN, không đúng dạng đang dạy.
        var chia = randInt(2, 12);
        var thuong = randInt(105, 990);        // phần trăm
        var biChia = thuong * chia;            // phần trăm
        var guardC = 0;
        while (biChia % 100 === 0 && guardC < 60) {
          guardC++;
          thuong = randInt(105, 990); chia = randInt(2, 12); biChia = thuong * chia;
        }
        return inQ(topic,
          'Tính: <b>' + dec(biChia / 100, 2) + ' : ' + chia + '</b> = ? (gõ số)',
          dec(thuong / 100, 2),
          'Chia phần nguyên trước, viết dấu phẩy vào thương rồi chia tiếp phần thập phân.<br>' +
          'Thử lại: ' + dec(thuong / 100, 2) + ' × ' + chia + ' = ' + dec(biChia / 100, 2) +
          '. Vậy thương là <b>' + dec(thuong / 100, 2) + '</b>.');
      }

      // Nhân / chia nhẩm với 10, 100, 1000 (dời dấu phẩy).
      // Số chữ số thập phân của SỐ BAN ĐẦU được chọn theo phép tính để KẾT QUẢ không
      // vượt quá hàng phần nghìn — SGK Toán 5 chỉ dạy tới hàng phần nghìn, đáp án kiểu
      // 0,025596 là ngoài chương trình và bé cũng không gõ nổi.
      var mu = pick([10, 100, 1000]);
      var nhan = randInt(0, 1) === 1;
      var soChuSo = String(mu).length - 1;
      var dpGoc = nhan ? randInt(1, 3) : Math.max(0, 3 - soChuSo);
      var donVi = Math.pow(10, dpGoc);
      var raw = randInt(donVi + 1, donVi * 1000);
      while (dpGoc > 0 && raw % 10 === 0) raw = randInt(donVi + 1, donVi * 1000);
      var goc = raw / donVi;
      var kq3 = nhan ? goc * mu : goc / mu;
      return inQ(topic,
        'Tính nhẩm: <b>' + dec(goc, 3) + (nhan ? ' × ' : ' : ') + mu + '</b> = ? (gõ số)',
        dec(kq3, 3),
        (nhan
          ? 'Nhân với ' + mu + ' thì dời dấu phẩy sang PHẢI ' + soChuSo + ' chữ số.'
          : 'Chia cho ' + mu + ' thì dời dấu phẩy sang TRÁI ' + soChuSo + ' chữ số.') +
        '<br>Kết quả: <b>' + dec(kq3, 3) + '</b>.');
    }

    // ---- Tầng 2: thử thách ----
    var k2 = randInt(0, 2);

    if (k2 === 0) {
      // Tìm x với số thập phân.
      var heSo = pick([0.5, 0.25, 1.5, 2.5, 0.2, 0.4]);
      var x = randInt(4, 60);
      var tich = Math.round(heSo * x * 100) / 100;
      var them = randInt(1, 40) / 2;
      var tong = Math.round((tich + them) * 100) / 100;
      return inQ(topic,
        'Tìm x, biết: <b>x × ' + dec(heSo, 2) + ' + ' + dec(them, 2) + ' = ' + dec(tong, 2) + '</b> (gõ số)',
        dec(x, 6),
        'x × ' + dec(heSo, 2) + ' = ' + dec(tong, 2) + ' − ' + dec(them, 2) + ' = ' + dec(tich, 2) + '<br>' +
        'x = ' + dec(tich, 2) + ' : ' + dec(heSo, 2) + ' = <b>' + dec(x, 6) + '</b>.');
    }

    if (k2 === 1) {
      // Làm tròn số thập phân.
      // Số phải THẬT SỰ có chữ số ở hàng cần xét sau khi dec() cắt số 0 thừa, nếu không
      // sẽ ra đề vô nghĩa kiểu "Làm tròn số 590 đến hàng phần mười" (đáp án = chính nó)
      // hoặc "Làm tròn 279,5 đến hàng phần mười" (chữ số 5 hiện ra đánh lừa học sinh).
      var denHang = pick([0, 1]);             // 0 = hàng đơn vị, 1 = hàng phần mười
      var xTr = randInt(1000, 99999);         // giá trị tính theo phần TRĂM
      var guardLT = 0;
      while (guardLT < 80 && (denHang === 0 ? xTr % 100 === 0 : xTr % 10 === 0)) {
        guardLT++; xTr = randInt(1000, 99999);
      }
      var v3 = xTr / 100;
      var lam = denHang === 0 ? Math.round(v3) : Math.round(v3 * 10) / 10;
      var tenHang2 = denHang === 0 ? 'hàng đơn vị' : 'hàng phần mười';
      var chuSoXet = denHang === 0 ? Math.floor(xTr / 10) % 10 : xTr % 10;
      return inQ(topic,
        'Làm tròn số <b>' + dec(v3, 2) + '</b> đến <b>' + tenHang2 + '</b>. (gõ số)',
        dec(lam, 6),
        'Xét chữ số ở hàng ngay sau ' + tenHang2 + ': đó là ' + chuSoXet + '.<br>' +
        (chuSoXet >= 5 ? 'Vì ' + chuSoXet + ' ≥ 5 nên tăng chữ số đứng trước thêm 1.'
                       : 'Vì ' + chuSoXet + ' &lt; 5 nên giữ nguyên chữ số đứng trước.') +
        '<br>Kết quả: <b>' + dec(lam, 6) + '</b>.');
    }

    // Bài toán tổng/hiệu với số thập phân.
    var s1v = randInt(150, 4000) / 100;
    var s2v = randInt(150, 4000) / 100;
    var tongV = Math.round((s1v + s2v) * 100) / 100;
    return inQ(topic,
      'Tổng của hai số là <b>' + dec(tongV, 2) + '</b>. Số thứ nhất là <b>' + dec(s1v, 2) +
      '</b>. Tìm số thứ hai. (gõ số)',
      dec(s2v, 6),
      'Số thứ hai = Tổng − Số thứ nhất = ' + dec(tongV, 2) + ' − ' + dec(s1v, 2) +
      ' = <b>' + dec(s2v, 6) + '</b>.');
  }

  /* ============================================================================
   *  4. ĐẠI LƯỢNG & ĐO LƯỜNG
   * ========================================================================== */
  function genDoLuong() {
    var topic = 'do-luong';
    var t = tier();

    if (t === 0) {
      var bo = pick([
        { lon: 'km', be: 'm', ti: 1000, maxLon: 9, maxBe: 999 },
        { lon: 'm', be: 'cm', ti: 100, maxLon: 20, maxBe: 99 },
        { lon: 'm', be: 'dm', ti: 10, maxLon: 30, maxBe: 9 },
        { lon: 'tấn', be: 'kg', ti: 1000, maxLon: 8, maxBe: 999 },
        { lon: 'kg', be: 'g', ti: 1000, maxLon: 9, maxBe: 999 },
        { lon: 'tạ', be: 'kg', ti: 100, maxLon: 9, maxBe: 99 }
      ]);
      var a = randInt(1, bo.maxLon), b = randInt(1, bo.maxBe);
      var ans = a * bo.ti + b;
      return inQ(topic,
        'Đổi đơn vị: <b>' + a + ' ' + bo.lon + ' ' + b + ' ' + bo.be + ' = … ' + bo.be + '</b> (gõ số)',
        ans,
        '1 ' + bo.lon + ' = ' + fmtInt(bo.ti) + ' ' + bo.be + ' nên ' + a + ' ' + bo.lon + ' = ' +
        fmtInt(a * bo.ti) + ' ' + bo.be + '.<br>' +
        'Cộng thêm ' + b + ' ' + bo.be + ' được <b>' + fmtInt(ans) + ' ' + bo.be + '</b>.');
    }

    if (t === 1) {
      var k1 = randInt(0, 2);

      if (k1 === 0) {
        // Đơn vị diện tích.
        var bo2 = pick([
          { lon: 'm²', be: 'dm²', ti: 100, maxLon: 12, maxBe: 99, lienNhau: true },
          { lon: 'dm²', be: 'cm²', ti: 100, maxLon: 15, maxBe: 99, lienNhau: true },
          { lon: 'km²', be: 'ha', ti: 100, maxLon: 9, maxBe: 99, lienNhau: true },
          { lon: 'ha', be: 'm²', ti: 10000, maxLon: 7, maxBe: 9999, lienNhau: false }
        ]);
        var a2 = randInt(1, bo2.maxLon), b2 = randInt(1, bo2.maxBe);
        var ans2 = a2 * bo2.ti + b2;
        return inQ(topic,
          'Đổi đơn vị: <b>' + a2 + ' ' + bo2.lon + ' ' + fmtInt(b2) + ' ' + bo2.be + ' = … ' + bo2.be + '</b> (gõ số)',
          ans2,
          '1 ' + bo2.lon + ' = ' + fmtInt(bo2.ti) + ' ' + bo2.be +
          (bo2.lienNhau ? ' (hai đơn vị diện tích liền nhau hơn kém nhau 100 lần).' : '.') + '<br>' +
          a2 + ' ' + bo2.lon + ' = ' + fmtInt(a2 * bo2.ti) + ' ' + bo2.be + ', cộng ' + fmtInt(b2) +
          ' được <b>' + fmtInt(ans2) + ' ' + bo2.be + '</b>.');
      }

      if (k1 === 1) {
        // Viết số đo dưới dạng số thập phân.
        var bo3 = pick([
          { lon: 'tấn', be: 'kg', ti: 1000 },
          { lon: 'kg', be: 'g', ti: 1000 },
          { lon: 'm', be: 'cm', ti: 100 },
          { lon: 'km', be: 'm', ti: 1000 }
        ]);
        var a3 = randInt(1, 40), b3 = randInt(1, bo3.ti - 1);
        var val = a3 + b3 / bo3.ti;
        return inQ(topic,
          'Viết số đo dưới dạng số thập phân: <b>' + a3 + ' ' + bo3.lon + ' ' + fmtInt(b3) + ' ' + bo3.be +
          ' = … ' + bo3.lon + '</b> (gõ số, dùng dấu phẩy)',
          dec(val, 6),
          '1 ' + bo3.be + ' = 1/' + fmtInt(bo3.ti) + ' ' + bo3.lon + ' nên ' + fmtInt(b3) + ' ' + bo3.be + ' = ' +
          dec(b3 / bo3.ti, 6) + ' ' + bo3.lon + '.<br>' +
          'Vậy ' + a3 + ' ' + bo3.lon + ' ' + fmtInt(b3) + ' ' + bo3.be + ' = <b>' + dec(val, 6) + ' ' + bo3.lon + '</b>.');
      }

      // Thời gian: giờ – phút.
      var gio = randInt(1, 6), phut = randInt(1, 59);
      return inQ(topic,
        'Đổi đơn vị: <b>' + gio + ' giờ ' + phut + ' phút = … phút</b> (gõ số)',
        gio * 60 + phut,
        '1 giờ = 60 phút nên ' + gio + ' giờ = ' + (gio * 60) + ' phút.<br>' +
        'Cộng thêm ' + phut + ' phút được <b>' + (gio * 60 + phut) + ' phút</b>.');
    }

    // ---- Tầng 2: thử thách ----
    var k2 = randInt(0, 2);

    if (k2 === 0) {
      // Thời gian dạng thập phân / phân số.
      var dang = pick([
        { s: '1,5 giờ', v: 90 }, { s: '2,5 giờ', v: 150 }, { s: '0,25 giờ', v: 15 },
        { s: '3/4 giờ', v: 45 }, { s: '2/3 giờ', v: 40 }, { s: '1/5 giờ', v: 12 },
        { s: '1,2 giờ', v: 72 }, { s: '5/6 giờ', v: 50 }
      ]);
      return inQ(topic,
        'Đổi đơn vị: <b>' + dang.s + ' = … phút</b> (gõ số)',
        dang.v,
        '1 giờ = 60 phút. Lấy 60 nhân với ' + dang.s.replace(' giờ', '') + ' được <b>' + dang.v + ' phút</b>.');
    }

    if (k2 === 1) {
      // Đổi ngược từ đơn vị bé sang đơn vị lớn dạng thập phân.
      var bo4 = pick([
        { be: 'g', lon: 'kg', ti: 1000 }, { be: 'cm', lon: 'm', ti: 100 },
        { be: 'm', lon: 'km', ti: 1000 }, { be: 'kg', lon: 'tấn', ti: 1000 },
        { be: 'cm²', lon: 'dm²', ti: 100 }, { be: 'm²', lon: 'ha', ti: 10000 }
      ]);
      var v4 = randInt(bo4.ti / 10, bo4.ti * 8);
      return inQ(topic,
        'Viết số đo sau dưới dạng số thập phân: <b>' + fmtInt(v4) + ' ' + bo4.be + ' = … ' + bo4.lon +
        '</b> (gõ số, dùng dấu phẩy)',
        dec(v4 / bo4.ti, 6),
        '1 ' + bo4.lon + ' = ' + fmtInt(bo4.ti) + ' ' + bo4.be + ' nên lấy ' + fmtInt(v4) + ' : ' +
        fmtInt(bo4.ti) + ' = <b>' + dec(v4 / bo4.ti, 6) + ' ' + bo4.lon + '</b>.');
    }

    // Bài toán thực tế gắn đại lượng: quan hệ tỉ lệ thuận (rút về đơn vị).
    var soHop = randInt(3, 12);
    var moiHop = randInt(2, 8);
    var soHopMoi = randInt(3, 20);
    var tongCu = soHop * moiHop;
    return inQ(topic,
      '<b>' + soHop + '</b> hộp bánh giống nhau cân nặng <b>' + fmtInt(tongCu) + ' kg</b>. ' +
      'Hỏi <b>' + soHopMoi + '</b> hộp bánh như thế cân nặng bao nhiêu ki-lô-gam? (gõ số)',
      soHopMoi * moiHop,
      'Rút về đơn vị: 1 hộp nặng ' + fmtInt(tongCu) + ' : ' + soHop + ' = ' + moiHop + ' kg.<br>' +
      soHopMoi + ' hộp nặng ' + moiHop + ' × ' + soHopMoi + ' = <b>' + fmtInt(soHopMoi * moiHop) + ' kg</b>.');
  }

  /* ============================================================================
   *  5. TỈ SỐ & TỈ SỐ PHẦN TRĂM
   * ========================================================================== */

  // Sinh cặp (số, phần trăm) sao cho giá trị phần trăm là số nguyên.
  function capPhanTram(pcts, bases) {
    for (var guard = 0; guard < 200; guard++) {
      var p = pick(pcts), b = pick(bases);
      if ((b * p) % 100 === 0) return { p: p, b: b, v: b * p / 100 };
    }
    return { p: 25, b: 200, v: 50 };
  }

  function genTiSoPhanTram() {
    var topic = 'ti-so-phan-tram';
    var t = tier();
    var PCTS = [5, 10, 12, 15, 20, 25, 30, 40, 45, 50, 60, 70, 75, 80, 90];
    // Hai bộ số riêng: sĩ số MỘT LỚP phải thật (25–50), còn quy mô trường / khối /
    // diện tích / hàng hoá mới dùng số lớn. Trước đây dùng chung một bộ nên ra đề
    // "Lớp 5A có 800 học sinh".
    var BASES = [20, 40, 50, 60, 80, 100, 120, 150, 200, 240, 300, 400, 500, 600, 800];
    var BASES_LOP = [20, 25, 30, 32, 35, 36, 40, 44, 45, 48, 50];

    if (t === 0) {
      var k = randInt(0, 1);

      if (k === 0) {
        // Tìm tỉ số phần trăm của hai số. Đổi bối cảnh để một đề in ra không lặp
        // đúng một khuôn câu (trình tạo đề chỉ loại được câu TRÙNG NGUYÊN VĂN).
        var bc = pick([
          { lop: 'Lớp 5A', dt: 'học sinh', nhom: 'học sinh giỏi', nho: true },
          { lop: 'Lớp 5B', dt: 'học sinh', nhom: 'học sinh nữ', nho: true },
          { lop: 'Khối 5 của trường', dt: 'học sinh', nhom: 'học sinh tham gia câu lạc bộ Toán', nho: false },
          { lop: 'Thư viện trường', dt: 'quyển sách', nhom: 'quyển sách truyện thiếu nhi', nho: false }
        ]);
        var capA = capPhanTram(PCTS, bc.nho ? BASES_LOP : BASES);
        return inQ(topic,
          bc.lop + ' có <b>' + fmtInt(capA.b) + '</b> ' + bc.dt + ', trong đó có <b>' + fmtInt(capA.v) +
          '</b> ' + bc.nhom + '. Hỏi số ' + bc.nhom + ' chiếm bao nhiêu <b>phần trăm</b> tổng số ' +
          bc.dt + '? (gõ số, ví dụ 25 nghĩa là 25%)',
          capA.p,
          'Tỉ số phần trăm của hai số = số bé : số lớn × 100%.<br>' +
          fmtInt(capA.v) + ' : ' + fmtInt(capA.b) + ' = ' + dec(capA.v / capA.b, 6) + '<br>' +
          dec(capA.v / capA.b, 6) + ' × 100% = <b>' + capA.p + '%</b>.');
      }

      var cap = capPhanTram(PCTS, BASES);

      // Tìm giá trị phần trăm của một số.
      var bc2 = pick([
        { mo: 'Một mảnh vườn có <b>' + fmtInt(cap.b) + ' m²</b>. Người ta trồng rau trên <b>' + cap.p +
              '%</b> diện tích mảnh vườn. Hỏi diện tích trồng rau là bao nhiêu mét vuông?', dv: 'm²' },
        { mo: 'Một cửa hàng có <b>' + fmtInt(cap.b) + ' kg</b> gạo. Buổi sáng cửa hàng bán được <b>' + cap.p +
              '%</b> số gạo đó. Hỏi buổi sáng cửa hàng bán được bao nhiêu ki-lô-gam gạo?', dv: 'kg' },
        { mo: 'Một đội trồng cây trồng được <b>' + fmtInt(cap.b) + '</b> cây, trong đó cây bạch đàn chiếm <b>' +
              cap.p + '%</b>. Hỏi đội đó trồng được bao nhiêu cây bạch đàn?', dv: 'cây' }
      ]);
      return inQ(topic,
        bc2.mo + ' (gõ số)',
        cap.v,
        'Tìm ' + cap.p + '% của ' + fmtInt(cap.b) + ': lấy ' + fmtInt(cap.b) + ' : 100 × ' + cap.p + ' = ' +
        dec(cap.b / 100, 6) + ' × ' + cap.p + ' = <b>' + fmtInt(cap.v) + ' ' + bc2.dv + '</b>.');
    }

    if (t === 1) {
      var k1 = randInt(0, 2);

      if (k1 === 0) {
        // Tìm một số khi biết giá trị phần trăm của nó.
        // Chỉ dùng base ≥ 200 cho bối cảnh "toàn trường" (trường 20 học sinh là vô lý),
        // và trình bày GỘP một bước để lời giải không sinh ra "0,2 em".
        var BASES_TRUONG = [200, 240, 300, 400, 500, 600, 800];
        var cap2 = capPhanTram(PCTS, BASES_TRUONG);
        return inQ(topic,
          'Số học sinh nữ của một trường là <b>' + fmtInt(cap2.v) + '</b> em, chiếm <b>' + cap2.p +
          '%</b> số học sinh toàn trường. Hỏi trường đó có bao nhiêu học sinh? (gõ số)',
          cap2.b,
          'Đây là dạng: biết ' + cap2.p + '% của một số là ' + fmtInt(cap2.v) + ', tìm số đó.<br>' +
          'Số học sinh toàn trường = ' + fmtInt(cap2.v) + ' × 100 : ' + cap2.p + ' = ' +
          fmtInt(cap2.v * 100) + ' : ' + cap2.p + ' = <b>' + fmtInt(cap2.b) + ' học sinh</b>.');
      }

      if (k1 === 1) {
        // Giảm giá. Đổi cả mặt hàng lẫn con số để hai câu cùng dạng trong một đề
        // không đọc y hệt nhau.
        var mon = pick(['chiếc áo', 'chiếc cặp sách', 'đôi giày', 'chiếc xe đạp', 'chiếc quạt điện', 'bộ đồ chơi']);
        var giaGoc = pick([200000, 250000, 300000, 400000, 500000, 600000, 800000, 1200000]);
        var giam = pick([5, 10, 15, 20, 25, 30, 40]);
        var soTien = giaGoc * giam / 100;
        var giaMoi = giaGoc - soTien;
        return inQ(topic,
          'Một ' + mon + ' giá <b>' + fmtInt(giaGoc) + ' đồng</b>. Nhân dịp lễ, cửa hàng <b>giảm ' + giam +
          '%</b>. Hỏi giá ' + mon + ' đó sau khi giảm là bao nhiêu đồng? (gõ số)',
          giaMoi,
          'Số tiền được giảm: ' + fmtInt(giaGoc) + ' : 100 × ' + giam + ' = ' + fmtInt(soTien) + ' đồng.<br>' +
          'Giá sau khi giảm: ' + fmtInt(giaGoc) + ' − ' + fmtInt(soTien) + ' = <b>' + fmtInt(giaMoi) + ' đồng</b>.<br>' +
          'Cách khác: giá mới bằng ' + (100 - giam) + '% giá cũ.');
      }

      // Chia theo tỉ lệ.
      var tyLe = pick([[3, 4], [2, 3], [3, 5], [4, 5], [2, 7], [3, 4, 9], [1, 2, 3], [2, 3, 5]]);
      var donVi = randInt(4, 25);
      var tongPhan = tyLe.reduce(function (x, y) { return x + y; }, 0);
      var tong = tongPhan * donVi;
      var idx = randInt(0, tyLe.length - 1);
      var ten = ['cam', 'táo', 'dừa'];
      // Viết "kẹo cam 2 phần" chứ không "kẹo cam: 2" — trong cùng câu đã có dấu ":" làm
      // dấu tỉ lệ (2 : 3), thêm dấu ":" làm nhãn nữa thì đọc rối.
      var moTa = tyLe.map(function (v, i) { return 'kẹo ' + ten[i] + ' ' + v + ' phần'; }).join(', ');
      return inQ(topic,
        'Một túi có <b>' + fmtInt(tong) + '</b> chiếc kẹo gồm ' + tyLe.length +
        ' loại, số kẹo các loại tỉ lệ với <b>' + tyLe.join(' : ') + '</b> (' + moTa + '). ' +
        'Hỏi có bao nhiêu chiếc kẹo <b>' + ten[idx] + '</b>? (gõ số)',
        tyLe[idx] * donVi,
        'Tổng số phần bằng nhau: ' + tyLe.join(' + ') + ' = ' + tongPhan + ' phần.<br>' +
        'Giá trị 1 phần: ' + fmtInt(tong) + ' : ' + tongPhan + ' = ' + donVi + ' chiếc.<br>' +
        'Kẹo ' + ten[idx] + ' có ' + tyLe[idx] + ' phần nên bằng ' + donVi + ' × ' + tyLe[idx] +
        ' = <b>' + fmtInt(tyLe[idx] * donVi) + ' chiếc</b>.');
    }

    // ---- Tầng 2: thử thách ----
    var k2 = randInt(0, 2);

    if (k2 === 0) {
      // Lãi – lỗ.
      var von = pick([200000, 400000, 500000, 600000, 800000, 1000000, 1500000]);
      var lai = pick([10, 15, 20, 25, 30]);
      var giaBan = von + von * lai / 100;
      return inQ(topic,
        'Một cửa hàng mua một món hàng với giá <b>' + fmtInt(von) + ' đồng</b>. ' +
        'Cửa hàng muốn bán để <b>lãi ' + lai + '%</b> so với giá mua. ' +
        'Hỏi phải bán món hàng đó với giá bao nhiêu đồng? (gõ số)',
        giaBan,
        'Coi giá mua là 100%. Giá bán = 100% + ' + lai + '% = ' + (100 + lai) + '% giá mua.<br>' +
        'Giá bán = ' + fmtInt(von) + ' : 100 × ' + (100 + lai) + ' = <b>' + fmtInt(giaBan) + ' đồng</b>.');
    }

    if (k2 === 1) {
      // Bài toán "phần còn lại" — 2 tỉ số phần trăm + số cụ thể.
      // Sĩ số phải là sĩ số MỘT LỚP thật (25–50), và lời giải trình bày gộp một bước
      // để không sinh ra số học sinh lẻ kiểu "0,8 học sinh".
      var p1 = pick([20, 25, 30, 40]);
      var p2 = pick([15, 20, 25, 30, 35]);
      var conLaiPct = 100 - p1 - p2;
      var SI_SO = [20, 25, 30, 32, 35, 36, 40, 44, 45, 48, 50];
      var hopLe = SI_SO.filter(function (n) { return (n * conLaiPct) % 100 === 0; });
      var tongHS = hopLe.length ? pick(hopLe) : 40;
      var soConLai = tongHS * conLaiPct / 100;
      if (soConLai % 1 !== 0 || soConLai <= 0) { p1 = 25; p2 = 30; conLaiPct = 45; tongHS = 40; soConLai = 18; }
      return inQ(topic,
        'Một lớp học có số học sinh giỏi chiếm <b>' + p1 + '%</b>, học sinh khá chiếm <b>' + p2 +
        '%</b> số học sinh cả lớp, còn lại là <b>' + soConLai + '</b> học sinh trung bình. ' +
        'Hỏi lớp đó có bao nhiêu học sinh? (gõ số)',
        tongHS,
        'Học sinh trung bình chiếm: 100% − ' + p1 + '% − ' + p2 + '% = ' + conLaiPct + '% số học sinh cả lớp.<br>' +
        'Biết ' + conLaiPct + '% số học sinh cả lớp là ' + soConLai + ' em, tìm số học sinh cả lớp:<br>' +
        soConLai + ' × 100 : ' + conLaiPct + ' = ' + (soConLai * 100) + ' : ' + conLaiPct +
        ' = <b>' + tongHS + ' học sinh</b>.');
    }

    // Tỉ lệ nghịch: người – ngày (năng suất như nhau).
    var nguoi1 = pick([4, 5, 6, 8, 10, 12]);
    var ngay1 = pick([6, 9, 10, 12, 15, 20, 24]);
    var congViec = nguoi1 * ngay1;
    var uoc = [];
    for (var i = 2; i <= 30; i++) if (congViec % i === 0 && i !== nguoi1) uoc.push(i);
    var nguoi2 = uoc.length ? pick(uoc) : nguoi1 * 2;
    var ngay2 = congViec / nguoi2;
    return inQ(topic,
      '<b>' + nguoi1 + '</b> người đắp xong một đoạn đường trong <b>' + ngay1 + ' ngày</b>. ' +
      'Hỏi <b>' + nguoi2 + '</b> người (làm với sức như nhau) sẽ đắp xong đoạn đường đó trong bao nhiêu ngày? (gõ số)',
      dec(ngay2, 6),
      'Số ngày công để làm xong: ' + nguoi1 + ' × ' + ngay1 + ' = ' + congViec + ' (ngày công).<br>' +
      'Với ' + nguoi2 + ' người thì cần ' + congViec + ' : ' + nguoi2 + ' = <b>' + dec(ngay2, 6) + ' ngày</b>.<br>' +
      'Đây là hai đại lượng tỉ lệ nghịch: càng nhiều người thì càng ít ngày.');
  }

  /* ============================================================================
   *  6. CÁC DẠNG TOÁN ĐIỂN HÌNH
   * ========================================================================== */
  function genToanDienHinh() {
    var topic = 'toan-dien-hinh';
    var t = tier();

    if (t === 0) {
      var k = randInt(0, 1);

      if (k === 0) {
        // Tổng – Hiệu.
        var be = randInt(12, 400), hieu = randInt(4, 250);
        var lon = be + hieu, tong = be + lon;
        var hoiLon = randInt(0, 1) === 1;
        return inQ(topic,
          'Tổng của hai số là <b>' + fmtInt(tong) + '</b>, hiệu của chúng là <b>' + fmtInt(hieu) + '</b>. ' +
          'Tìm <b>số ' + (hoiLon ? 'lớn' : 'bé') + '</b>. (gõ số)',
          hoiLon ? lon : be,
          'Số bé = (Tổng − Hiệu) : 2 = (' + fmtInt(tong) + ' − ' + fmtInt(hieu) + ') : 2 = ' + fmtInt(be) + '.<br>' +
          'Số lớn = ' + fmtInt(be) + ' + ' + fmtInt(hieu) + ' = ' + fmtInt(lon) + '.<br>' +
          'Vậy số ' + (hoiLon ? 'lớn' : 'bé') + ' là <b>' + fmtInt(hoiLon ? lon : be) + '</b>.');
      }

      // Trung bình cộng — tìm số còn lại.
      var soLuong = randInt(3, 5);
      var tbc = randInt(15, 90);
      var cac = [];
      var tongCan = tbc * soLuong;
      var conLai = tongCan;
      for (var i = 0; i < soLuong - 1; i++) {
        var maxV = Math.max(1, conLai - (soLuong - 1 - i));
        var v = randInt(1, Math.min(maxV, tbc * 2));
        cac.push(v); conLai -= v;
      }
      // (vòng for ở trên đã bảo đảm conLai ≥ 1 nên không cần nhánh sửa chữa)
      return inQ(topic,
        'Trung bình cộng của <b>' + soLuong + '</b> số là <b>' + tbc + '</b>. ' +
        'Biết ' + (soLuong - 1) + ' số đầu lần lượt là <b>' + cac.join(', ') + '</b>. ' +
        'Tìm số còn lại. (gõ số)',
        conLai,
        'Tổng của ' + soLuong + ' số = ' + tbc + ' × ' + soLuong + ' = ' + tongCan + '.<br>' +
        'Tổng ' + (soLuong - 1) + ' số đã biết = ' + cac.join(' + ') + ' = ' + (tongCan - conLai) + '.<br>' +
        'Số còn lại = ' + tongCan + ' − ' + (tongCan - conLai) + ' = <b>' + conLai + '</b>.');
    }

    if (t === 1) {
      var k1 = randInt(0, 2);

      if (k1 === 0) {
        // Tổng – Tỉ. Tỉ số phải TỐI GIẢN: "tỉ số của số lớn và số bé là 4/2" là cách viết sai.
        var m = randInt(2, 7), n = randInt(1, m - 1);
        var guardTT = 0;
        while (gcd(m, n) !== 1 && guardTT < 40) { guardTT++; m = randInt(2, 7); n = randInt(1, m - 1); }
        var dv = randInt(5, 60);
        var tong2 = (m + n) * dv;
        var hoiLon2 = randInt(0, 1) === 1;
        return inQ(topic,
          'Tổng của hai số là <b>' + fmtInt(tong2) + '</b>. Tỉ số của số lớn và số bé là <b>' + m + '/' + n +
          '</b>. Tìm <b>số ' + (hoiLon2 ? 'lớn' : 'bé') + '</b>. (gõ số)',
          hoiLon2 ? m * dv : n * dv,
          'Vẽ sơ đồ: số lớn ' + m + ' phần, số bé ' + n + ' phần.<br>' +
          'Tổng số phần bằng nhau: ' + m + ' + ' + n + ' = ' + (m + n) + ' phần.<br>' +
          'Giá trị 1 phần: ' + fmtInt(tong2) + ' : ' + (m + n) + ' = ' + dv + '.<br>' +
          'Số ' + (hoiLon2 ? 'lớn' : 'bé') + ' = ' + dv + ' × ' + (hoiLon2 ? m : n) + ' = <b>' +
          fmtInt(hoiLon2 ? m * dv : n * dv) + '</b>.');
      }

      if (k1 === 1) {
        // Hiệu – Tỉ. Tỉ số phải TỐI GIẢN.
        var m2 = randInt(3, 8), n2 = randInt(1, m2 - 1);
        var guardHT = 0;
        while (gcd(m2, n2) !== 1 && guardHT < 40) { guardHT++; m2 = randInt(3, 8); n2 = randInt(1, m2 - 1); }
        var dv2 = randInt(5, 60);
        var hieu2 = (m2 - n2) * dv2;
        var hoiLon3 = randInt(0, 1) === 1;
        return inQ(topic,
          'Hiệu của hai số là <b>' + fmtInt(hieu2) + '</b>. Tỉ số của số lớn và số bé là <b>' + m2 + '/' + n2 +
          '</b>. Tìm <b>số ' + (hoiLon3 ? 'lớn' : 'bé') + '</b>. (gõ số)',
          hoiLon3 ? m2 * dv2 : n2 * dv2,
          'Vẽ sơ đồ: số lớn ' + m2 + ' phần, số bé ' + n2 + ' phần.<br>' +
          'Hiệu số phần bằng nhau: ' + m2 + ' − ' + n2 + ' = ' + (m2 - n2) + ' phần.<br>' +
          'Giá trị 1 phần: ' + fmtInt(hieu2) + ' : ' + (m2 - n2) + ' = ' + dv2 + '.<br>' +
          'Số ' + (hoiLon3 ? 'lớn' : 'bé') + ' = ' + dv2 + ' × ' + (hoiLon3 ? m2 : n2) + ' = <b>' +
          fmtInt(hoiLon3 ? m2 * dv2 : n2 * dv2) + '</b>.');
      }

      // Dãy số cách đều.
      var dau = randInt(1, 30), khoang = pick([2, 3, 4, 5, 6, 7, 10]);
      var soHang = randInt(12, 40);
      var cuoi = dau + (soHang - 1) * khoang;
      var hoiTong = randInt(0, 1) === 1;
      var tongDay = (dau + cuoi) * soHang / 2;
      return inQ(topic,
        'Cho dãy số: <b>' + dau + '; ' + (dau + khoang) + '; ' + (dau + 2 * khoang) + '; … ; ' + cuoi + '</b> ' +
        '(hai số liền nhau hơn kém nhau ' + khoang + ' đơn vị).<br>' +
        (hoiTong ? 'Tính <b>tổng</b> các số của dãy.' : 'Dãy trên có bao nhiêu <b>số hạng</b>?') + ' (gõ số)',
        hoiTong ? tongDay : soHang,
        'Số số hạng = (số cuối − số đầu) : khoảng cách + 1 = (' + cuoi + ' − ' + dau + ') : ' + khoang +
        ' + 1 = ' + soHang + '.<br>' +
        (hoiTong
          ? 'Tổng = (số đầu + số cuối) × số số hạng : 2 = (' + dau + ' + ' + cuoi + ') × ' + soHang +
            ' : 2 = <b>' + fmtInt(tongDay) + '</b>.'
          : 'Vậy dãy có <b>' + soHang + ' số hạng</b>.'));
    }

    // ---- Tầng 2: thử thách ----
    var k2 = randInt(0, 3);

    if (k2 === 0) {
      // Trồng cây.
      var khoang2 = pick([2, 3, 4, 5, 6, 8, 10]);
      var soKhoang = randInt(8, 40);
      var daiDuong = khoang2 * soKhoang;
      var kieu = randInt(0, 2);   // 0: cả hai đầu, 1: một đầu, 2: quanh hồ (khép kín)
      var ansCay = kieu === 0 ? soKhoang + 1 : soKhoang;
      // Mỗi kiểu một câu RIÊNG: ghép chung một khuôn câu làm vế "quanh hồ" vỡ nghĩa
      // ("có chu vi bằng đoạn đường đó dài 78 m" — chưa hề nhắc tới đoạn đường nào).
      var deCay = [
        'Người ta trồng cây ở <b>cả hai đầu</b> một đoạn đường dài <b>' + fmtInt(daiDuong) + ' m</b>, ',
        'Người ta trồng cây dọc một đoạn đường dài <b>' + fmtInt(daiDuong) + ' m</b>, ' +
          '<b>chỉ trồng ở một đầu</b> (đầu kia không trồng), ',
        'Người ta trồng cây <b>xung quanh một hồ nước</b> có chu vi <b>' + fmtInt(daiDuong) + ' m</b>, '
      ][kieu];
      return inQ(topic,
        deCay + 'hai cây liền nhau cách nhau <b>' +
        khoang2 + ' m</b>. Hỏi cần trồng tất cả bao nhiêu cây? (gõ số)',
        ansCay,
        'Số khoảng cách = ' + fmtInt(daiDuong) + ' : ' + khoang2 + ' = ' + soKhoang + '.<br>' +
        (kieu === 0 ? 'Trồng cả hai đầu nên số cây = số khoảng + 1 = ' + soKhoang + ' + 1 = <b>' + ansCay + '</b>.'
         : kieu === 1 ? 'Chỉ trồng một đầu nên số cây = số khoảng = <b>' + ansCay + '</b>.'
                      : 'Đường khép kín (vòng quanh hồ) nên số cây = số khoảng = <b>' + ansCay + '</b>.'));
    }

    if (k2 === 1) {
      // Công việc chung (hai vòi / hai người).
      var cap = pick([[3, 6], [4, 12], [6, 12], [5, 20], [10, 15], [6, 30], [8, 8], [9, 18], [12, 6], [20, 5], [12, 4]]);
      var a = cap[0], b = cap[1];
      var chung = a * b / (a + b);
      return inQ(topic,
        'Vòi thứ nhất chảy một mình thì <b>' + a + ' giờ</b> đầy bể. ' +
        'Vòi thứ hai chảy một mình thì <b>' + b + ' giờ</b> đầy bể. ' +
        'Hỏi nếu mở <b>cả hai vòi</b> cùng lúc thì sau bao nhiêu giờ bể đầy? (gõ số)',
        dec(chung, 6),
        'Coi cả bể là 1 đơn vị công việc.<br>' +
        'Mỗi giờ vòi 1 chảy được 1/' + a + ' bể, vòi 2 chảy được 1/' + b + ' bể.<br>' +
        'Cả hai vòi mỗi giờ chảy được 1/' + a + ' + 1/' + b + ' = ' + fracStr(a + b, a * b) + ' bể.<br>' +
        'Thời gian đầy bể = 1 : ' + fracStr(a + b, a * b) + ' = <b>' + dec(chung, 6) + ' giờ</b>.');
    }

    if (k2 === 2) {
      // Bài toán tuổi.
      var tiSo = randInt(2, 5);
      var conTuongLai, hieuTuoi, guard = 0;
      do {
        hieuTuoi = randInt(20, 34);
        conTuongLai = hieuTuoi / (tiSo - 1);
        guard++;
      } while (conTuongLai % 1 !== 0 && guard < 200);
      if (conTuongLai % 1 !== 0) { tiSo = 3; hieuTuoi = 26; conTuongLai = 13; }
      var namNua = randInt(2, 6);
      var conNay = conTuongLai - namNua;
      if (conNay < 3) { namNua = Math.max(1, conTuongLai - 5); conNay = conTuongLai - namNua; }
      var meNay = conNay + hieuTuoi;
      return inQ(topic,
        'Hiện nay mẹ hơn con <b>' + hieuTuoi + ' tuổi</b>. Sau <b>' + namNua + ' năm nữa</b>, ' +
        'tuổi mẹ gấp <b>' + tiSo + ' lần</b> tuổi con. Hỏi <b>hiện nay con bao nhiêu tuổi</b>? (gõ số)',
        conNay,
        'Hiệu số tuổi của hai mẹ con KHÔNG đổi theo thời gian, luôn là ' + hieuTuoi + ' tuổi.<br>' +
        'Sau ' + namNua + ' năm: tuổi con ' + 1 + ' phần, tuổi mẹ ' + tiSo + ' phần → hiệu là ' +
        (tiSo - 1) + ' phần = ' + hieuTuoi + ' tuổi.<br>' +
        'Tuổi con lúc đó = ' + hieuTuoi + ' : ' + (tiSo - 1) + ' = ' + conTuongLai + ' tuổi.<br>' +
        'Tuổi con hiện nay = ' + conTuongLai + ' − ' + namNua + ' = <b>' + conNay + ' tuổi</b> ' +
        '(khi đó mẹ ' + meNay + ' tuổi).');
    }

    // Giả thiết tạm (gà – chó).
    var soGa = randInt(6, 30), soCho = randInt(4, 25);
    var tongCon = soGa + soCho;
    var tongChan = soGa * 2 + soCho * 4;
    var hoiGa = randInt(0, 1) === 1;
    return inQ(topic,
      'Trong sân có vừa gà vừa chó, đếm được <b>' + tongCon + ' cái đầu</b> và <b>' + tongChan +
      ' cái chân</b>. Hỏi có bao nhiêu <b>con ' + (hoiGa ? 'gà' : 'chó') + '</b>? (gõ số)',
      hoiGa ? soGa : soCho,
      'Giả sử tất cả <b>' + tongCon + '</b> con đều là gà thì số chân là ' + tongCon + ' × 2 = ' +
      (tongCon * 2) + ' chân.<br>' +
      'Thiếu so với thực tế: ' + tongChan + ' − ' + (tongCon * 2) + ' = ' + (tongChan - tongCon * 2) + ' chân.<br>' +
      'Mỗi lần đổi 1 con gà thành 1 con chó thì thêm 4 − 2 = 2 chân.<br>' +
      'Số chó = ' + (tongChan - tongCon * 2) + ' : 2 = ' + soCho + ' (con); số gà = ' + tongCon + ' − ' +
      soCho + ' = ' + soGa + ' (con).<br>Vậy có <b>' + (hoiGa ? soGa + ' con gà' : soCho + ' con chó') + '</b>.');
  }

  /* ============================================================================
   *  7. HÌNH PHẲNG
   * ========================================================================== */
  function genHinhPhang() {
    var topic = 'hinh-phang';
    var t = tier();

    if (t === 0) {
      var k = randInt(0, 2);

      if (k === 0) {
        // Chu vi / diện tích hình chữ nhật.
        var d = randInt(8, 60), r = randInt(3, d - 1);
        var hoiS = randInt(0, 1) === 1;
        return inQ(topic,
          'Một hình chữ nhật có chiều dài <b>' + d + ' cm</b>, chiều rộng <b>' + r + ' cm</b>. ' +
          'Tính <b>' + (hoiS ? 'diện tích' : 'chu vi') + '</b> hình chữ nhật đó. (gõ số, đơn vị ' +
          (hoiS ? 'cm²' : 'cm') + ')',
          hoiS ? d * r : (d + r) * 2,
          hoiS
            ? 'Diện tích hình chữ nhật = dài × rộng = ' + d + ' × ' + r + ' = <b>' + fmtInt(d * r) + ' cm²</b>.'
            : 'Chu vi hình chữ nhật = (dài + rộng) × 2 = (' + d + ' + ' + r + ') × 2 = <b>' +
              fmtInt((d + r) * 2) + ' cm</b>.');
      }

      if (k === 1) {
        // Hình vuông.
        var c = randInt(5, 45);
        var hoiS2 = randInt(0, 1) === 1;
        return inQ(topic,
          'Một hình vuông có cạnh <b>' + c + ' cm</b>. Tính <b>' + (hoiS2 ? 'diện tích' : 'chu vi') +
          '</b> hình vuông đó. (gõ số, đơn vị ' + (hoiS2 ? 'cm²' : 'cm') + ')',
          hoiS2 ? c * c : c * 4,
          hoiS2
            ? 'Diện tích hình vuông = cạnh × cạnh = ' + c + ' × ' + c + ' = <b>' + fmtInt(c * c) + ' cm²</b>.'
            : 'Chu vi hình vuông = cạnh × 4 = ' + c + ' × 4 = <b>' + fmtInt(c * 4) + ' cm</b>.');
      }

      // Tìm chiều rộng khi biết diện tích và chiều dài.
      var d2 = randInt(10, 40), r2 = randInt(3, d2);   // chiều rộng ≤ chiều dài
      return inQ(topic,
        'Một mảnh đất hình chữ nhật có diện tích <b>' + fmtInt(d2 * r2) + ' m²</b> và chiều dài <b>' +
        d2 + ' m</b>. Tính <b>chiều rộng</b> mảnh đất. (gõ số, đơn vị m)',
        r2,
        'Từ công thức S = dài × rộng, suy ra rộng = S : dài.<br>' +
        'Chiều rộng = ' + fmtInt(d2 * r2) + ' : ' + d2 + ' = <b>' + r2 + ' m</b>.');
    }

    if (t === 1) {
      var k1 = randInt(0, 3);

      if (k1 === 0) {
        // Diện tích tam giác.
        var day = randInt(6, 50), cao = randInt(4, 40);
        if ((day * cao) % 2 !== 0) cao += 1;
        return inQ(topic,
          'Một hình tam giác có độ dài đáy <b>' + day + ' cm</b> và chiều cao <b>' + cao + ' cm</b>. ' +
          'Tính <b>diện tích</b> hình tam giác đó. (gõ số, đơn vị cm²)',
          day * cao / 2,
          'Diện tích tam giác = đáy × chiều cao : 2 = ' + day + ' × ' + cao + ' : 2 = <b>' +
          fmtInt(day * cao / 2) + ' cm²</b>.');
      }

      if (k1 === 1) {
        // Diện tích hình thang.
        var a = randInt(8, 40), b = randInt(4, a - 1), h = randInt(4, 30);
        if (((a + b) * h) % 2 !== 0) h += 1;
        return inQ(topic,
          'Một hình thang có đáy lớn <b>' + a + ' cm</b>, đáy bé <b>' + b + ' cm</b>, chiều cao <b>' +
          h + ' cm</b>. Tính <b>diện tích</b> hình thang. (gõ số, đơn vị cm²)',
          (a + b) * h / 2,
          'Diện tích hình thang = (đáy lớn + đáy bé) × chiều cao : 2<br>' +
          '= (' + a + ' + ' + b + ') × ' + h + ' : 2 = ' + (a + b) + ' × ' + h + ' : 2 = <b>' +
          fmtInt((a + b) * h / 2) + ' cm²</b>.');
      }

      if (k1 === 2) {
        // Diện tích hình thoi.
        var d1 = randInt(6, 40), dd2 = randInt(4, 36);
        if ((d1 * dd2) % 2 !== 0) dd2 += 1;
        if (d1 === dd2) dd2 = dd2 >= 10 ? dd2 - 2 : dd2 + 2;   // bằng nhau thì thành hình vuông
        return inQ(topic,
          'Một hình thoi có hai đường chéo dài <b>' + d1 + ' cm</b> và <b>' + dd2 + ' cm</b>. ' +
          'Tính <b>diện tích</b> hình thoi đó. (gõ số, đơn vị cm²)',
          d1 * dd2 / 2,
          'Diện tích hình thoi = (đường chéo 1 × đường chéo 2) : 2 = ' + d1 + ' × ' + dd2 + ' : 2 = <b>' +
          fmtInt(d1 * dd2 / 2) + ' cm²</b>.');
      }

      // Tìm chiều cao tam giác khi biết diện tích và đáy.
      var day2 = randInt(6, 40), cao2 = randInt(4, 30);
      var S = day2 * cao2 / 2;
      return inQ(topic,
        'Một hình tam giác có diện tích <b>' + dec(S, 2) + ' cm²</b> và độ dài đáy <b>' + day2 +
        ' cm</b>. Tính <b>chiều cao</b> của tam giác đó. (gõ số, đơn vị cm)',
        dec(cao2, 6),
        'Từ S = đáy × chiều cao : 2 suy ra chiều cao = S × 2 : đáy.<br>' +
        'Chiều cao = ' + dec(S, 2) + ' × 2 : ' + day2 + ' = ' + dec(S * 2, 2) + ' : ' + day2 +
        ' = <b>' + dec(cao2, 6) + ' cm</b>.');
    }

    // ---- Tầng 2: thử thách ----
    var k2 = randInt(0, 2);

    if (k2 === 0) {
      // Hình tròn: chu vi hoặc diện tích (bán kính nguyên -> kết quả đẹp).
      var r3 = randInt(2, 20);
      var hoiC = randInt(0, 1) === 1;
      var C = 2 * r3 * 3.14, Str = r3 * r3 * 3.14;
      return inQ(topic,
        'Một hình tròn có bán kính <b>' + r3 + ' cm</b>. Tính <b>' + (hoiC ? 'chu vi' : 'diện tích') +
        '</b> hình tròn đó. (gõ số, lấy số 3,14; đơn vị ' + (hoiC ? 'cm' : 'cm²') + ')',
        hoiC ? dec(C, 6) : dec(Str, 6),
        hoiC
          ? 'Chu vi hình tròn = r × 2 × 3,14 = ' + r3 + ' × 2 × 3,14 = <b>' + dec(C, 6) + ' cm</b>.'
          : 'Diện tích hình tròn = r × r × 3,14 = ' + r3 + ' × ' + r3 + ' × 3,14 = <b>' + dec(Str, 6) + ' cm²</b>.');
    }

    if (k2 === 1) {
      // Diện tích phần tô đậm: hình vuông trừ hình tròn nội tiếp.
      var canh = pick([4, 6, 8, 10, 12, 14, 16, 20]);
      var bk = canh / 2;
      var Svuong = canh * canh;
      var Stron = bk * bk * 3.14;
      var phan = Math.round((Svuong - Stron) * 1000) / 1000;
      return inQ(topic,
        'Một hình vuông có cạnh <b>' + canh + ' cm</b>. Bên trong hình vuông vẽ một hình tròn ' +
        '<b>lớn nhất có thể</b> (đường kính bằng cạnh hình vuông). ' +
        'Tính <b>diện tích phần hình vuông nằm ngoài hình tròn</b>. (gõ số, lấy số 3,14; đơn vị cm²)',
        dec(phan, 6),
        'Diện tích hình vuông = ' + canh + ' × ' + canh + ' = ' + fmtInt(Svuong) + ' cm².<br>' +
        'Hình tròn lớn nhất có đường kính ' + canh + ' cm nên bán kính r = ' + dec(bk, 2) + ' cm.<br>' +
        'Diện tích hình tròn = ' + dec(bk, 2) + ' × ' + dec(bk, 2) + ' × 3,14 = ' + dec(Stron, 6) + ' cm².<br>' +
        'Phần tô đậm = ' + fmtInt(Svuong) + ' − ' + dec(Stron, 6) + ' = <b>' + dec(phan, 6) + ' cm²</b>.');
    }

    // Tỉ số diện tích tam giác chung chiều cao.
    var Stong = pick([48, 60, 72, 84, 96, 120, 144, 180]);
    var mau = pick([2, 3, 4, 5, 6]);
    while (Stong % mau !== 0) mau = pick([2, 3, 4, 6]);
    var Sphan = Stong / mau;
    return inQ(topic,
      'Cho tam giác ABC có diện tích <b>' + Stong + ' cm²</b>. Trên cạnh BC lấy điểm M sao cho ' +
      '<b>BM = ' + fracStr(1, mau) + ' BC</b>. Tính <b>diện tích tam giác ABM</b>. (gõ số, đơn vị cm²)',
      Sphan,
      'Hai tam giác ABM và ABC có <b>chung chiều cao</b> hạ từ đỉnh A xuống đường thẳng BC.<br>' +
      'Vì vậy tỉ số diện tích của chúng bằng tỉ số hai đáy: S(ABM) : S(ABC) = BM : BC = 1 : ' + mau + '.<br>' +
      'S(ABM) = ' + Stong + ' : ' + mau + ' = <b>' + Sphan + ' cm²</b>.');
  }

  /* ============================================================================
   *  8. HÌNH KHỐI (hộp chữ nhật, lập phương)
   * ========================================================================== */
  function genHinhKhoi() {
    var topic = 'hinh-khoi';
    var t = tier();

    if (t === 0) {
      var a = randInt(5, 20), b = randInt(3, 18), c = randInt(2, 15);
      if (b > a) { var swA = a; a = b; b = swA; }   // chiều dài ≥ chiều rộng
      var hoiXq = randInt(0, 1) === 1;
      var Sxq = (a + b) * 2 * c;
      var Stp = Sxq + 2 * a * b;
      return inQ(topic,
        'Một hình hộp chữ nhật có chiều dài <b>' + a + ' cm</b>, chiều rộng <b>' + b + ' cm</b>, ' +
        'chiều cao <b>' + c + ' cm</b>. Tính <b>diện tích ' + (hoiXq ? 'xung quanh' : 'toàn phần') +
        '</b>. (gõ số, đơn vị cm²)',
        hoiXq ? Sxq : Stp,
        'Chu vi mặt đáy = (' + a + ' + ' + b + ') × 2 = ' + ((a + b) * 2) + ' cm.<br>' +
        'Diện tích xung quanh = chu vi đáy × chiều cao = ' + ((a + b) * 2) + ' × ' + c + ' = ' +
        fmtInt(Sxq) + ' cm².<br>' +
        (hoiXq ? 'Vậy diện tích xung quanh là <b>' + fmtInt(Sxq) + ' cm²</b>.'
               : 'Diện tích một mặt đáy = ' + a + ' × ' + b + ' = ' + fmtInt(a * b) + ' cm².<br>' +
                 'Diện tích toàn phần = ' + fmtInt(Sxq) + ' + ' + fmtInt(a * b) + ' × 2 = <b>' +
                 fmtInt(Stp) + ' cm²</b>.'));
    }

    if (t === 1) {
      var k1 = randInt(0, 2);

      if (k1 === 0) {
        // Thể tích hình hộp chữ nhật.
        var a2 = randInt(5, 25), b2 = randInt(3, 20), c2 = randInt(2, 18);
        if (b2 > a2) { var swB2 = a2; a2 = b2; b2 = swB2; }   // chiều dài ≥ chiều rộng
        return inQ(topic,
          'Tính <b>thể tích</b> hình hộp chữ nhật có chiều dài <b>' + a2 + ' cm</b>, chiều rộng <b>' +
          b2 + ' cm</b>, chiều cao <b>' + c2 + ' cm</b>. (gõ số, đơn vị cm³)',
          a2 * b2 * c2,
          'Thể tích hình hộp chữ nhật = dài × rộng × cao = ' + a2 + ' × ' + b2 + ' × ' + c2 +
          ' = <b>' + fmtInt(a2 * b2 * c2) + ' cm³</b>.');
      }

      if (k1 === 1) {
        // Hình lập phương.
        var canh = randInt(3, 18);
        var hoiV = randInt(0, 1) === 1;
        return inQ(topic,
          'Một hình lập phương có cạnh <b>' + canh + ' cm</b>. Tính <b>' +
          (hoiV ? 'thể tích' : 'diện tích toàn phần') + '</b> hình lập phương đó. (gõ số, đơn vị ' +
          (hoiV ? 'cm³' : 'cm²') + ')',
          hoiV ? canh * canh * canh : 6 * canh * canh,
          hoiV
            ? 'Thể tích hình lập phương = cạnh × cạnh × cạnh = ' + canh + ' × ' + canh + ' × ' + canh +
              ' = <b>' + fmtInt(canh * canh * canh) + ' cm³</b>.'
            : 'Diện tích một mặt = ' + canh + ' × ' + canh + ' = ' + fmtInt(canh * canh) + ' cm².<br>' +
              'Hình lập phương có 6 mặt bằng nhau nên diện tích toàn phần = ' + fmtInt(canh * canh) +
              ' × 6 = <b>' + fmtInt(6 * canh * canh) + ' cm²</b>.');
      }

      // Tìm chiều cao khi biết thể tích và đáy.
      var a3 = randInt(5, 15), b3 = randInt(3, 12), c3 = randInt(2, 14);
      if (b3 > a3) { var swB3 = a3; a3 = b3; b3 = swB3; }   // chiều dài ≥ chiều rộng
      var V = a3 * b3 * c3;
      return inQ(topic,
        'Một hình hộp chữ nhật có thể tích <b>' + fmtInt(V) + ' cm³</b>, chiều dài <b>' + a3 +
        ' cm</b>, chiều rộng <b>' + b3 + ' cm</b>. Tính <b>chiều cao</b> của hình hộp. (gõ số, đơn vị cm)',
        c3,
        'Diện tích mặt đáy = ' + a3 + ' × ' + b3 + ' = ' + fmtInt(a3 * b3) + ' cm².<br>' +
        'Từ V = diện tích đáy × chiều cao suy ra chiều cao = V : diện tích đáy.<br>' +
        'Chiều cao = ' + fmtInt(V) + ' : ' + fmtInt(a3 * b3) + ' = <b>' + c3 + ' cm</b>.');
    }

    // ---- Tầng 2: thử thách ----
    var k2 = randInt(0, 2);

    if (k2 === 0) {
      // Sơn khối lập phương rồi cắt nhỏ.
      var n = randInt(3, 6);
      var loai = randInt(0, 3);   // 0: 3 mặt, 1: 2 mặt, 2: 1 mặt, 3: không mặt nào
      var ans = [8, 12 * (n - 2), 6 * (n - 2) * (n - 2), (n - 2) * (n - 2) * (n - 2)][loai];
      var tenLoai = ['được sơn <b>3 mặt</b>', 'được sơn <b>đúng 2 mặt</b>',
                     'được sơn <b>đúng 1 mặt</b>', '<b>không được sơn mặt nào</b>'][loai];
      var giaiThich = [
        'Khối sơn 3 mặt nằm ở 8 ĐỈNH của khối lớn nên luôn có <b>8</b> khối.',
        'Khối sơn đúng 2 mặt nằm trên 12 CẠNH, mỗi cạnh có ' + (n - 2) + ' khối (bỏ 2 khối ở hai đỉnh): ' +
          '12 × ' + (n - 2) + ' = <b>' + (12 * (n - 2)) + '</b> khối.',
        'Khối sơn đúng 1 mặt nằm giữa 6 MẶT, mỗi mặt có (' + n + ' − 2) × (' + n + ' − 2) = ' +
          ((n - 2) * (n - 2)) + ' khối: 6 × ' + ((n - 2) * (n - 2)) + ' = <b>' + (6 * (n - 2) * (n - 2)) + '</b> khối.',
        'Khối không sơn mặt nào nằm hoàn toàn BÊN TRONG, tạo thành khối lập phương cạnh ' + n +
          ' − 2 = ' + (n - 2) + ': ' + (n - 2) + ' × ' + (n - 2) + ' × ' + (n - 2) + ' = <b>' +
          ((n - 2) * (n - 2) * (n - 2)) + '</b> khối.'
      ][loai];
      return inQ(topic,
        'Một hình lập phương cạnh <b>' + n + ' cm</b> được sơn đỏ toàn bộ mặt ngoài, sau đó cắt thành ' +
        'các hình lập phương nhỏ cạnh <b>1 cm</b>. Hỏi có bao nhiêu khối nhỏ ' + tenLoai + '? (gõ số)',
        ans,
        'Cắt được ' + n + ' × ' + n + ' × ' + n + ' = ' + (n * n * n) + ' khối nhỏ.<br>' + giaiThich);
    }

    if (k2 === 1) {
      // Bể nước: thể tích + đổi ra lít.
      var d = pick([10, 12, 15, 20, 25]);        // dm
      var r = pick([6, 8, 10, 12]);              // dm
      var h = pick([5, 6, 8, 10]);               // dm
      if (r > d) { var swB = d; d = r; r = swB; }   // chiều dài luôn ≥ chiều rộng
      var Vdm = d * r * h;                        // dm³ = lít
      // CHỈ chọn phân số chia hết: nếu không, lượng nước ra số thập phân vô hạn
      // (2/3 của 1600 = 1066,666…) — bé không gõ nổi và gõ 1066,67 sẽ bị chấm SAI.
      var ungVien = [[1, 2], [2, 3], [3, 4], [4, 5]].filter(function (pt) {
        return (Vdm * pt[0]) % pt[1] === 0;
      });
      var phanTu = ungVien.length ? pick(ungVien) : [1, 2];
      var nuoc = Vdm * phanTu[0] / phanTu[1];
      return inQ(topic,
        'Một bể nước dạng hình hộp chữ nhật có chiều dài <b>' + d + ' dm</b>, chiều rộng <b>' + r +
        ' dm</b>, chiều cao <b>' + h + ' dm</b>. Người ta đổ nước vào bể đến ' + fracRaw(phanTu[0], phanTu[1]) +
        ' bể. Hỏi trong bể có bao nhiêu <b>lít</b> nước? (biết 1 dm³ = 1 lít) (gõ số)',
        dec(nuoc, 6),
        'Thể tích cả bể = ' + d + ' × ' + r + ' × ' + h + ' = ' + fmtInt(Vdm) + ' dm³ = ' +
        fmtInt(Vdm) + ' lít.<br>' +
        'Lượng nước = ' + fmtInt(Vdm) + ' : ' + phanTu[1] + ' × ' + phanTu[0] + ' = <b>' +
        dec(nuoc, 6) + ' lít</b>.');
    }

    // So sánh: gấp cạnh lập phương lên k lần thì thể tích gấp mấy lần.
    var kLan = randInt(2, 4);
    return mcQ(topic,
      'Nếu <b>gấp cạnh</b> của một hình lập phương lên <b>' + kLan + ' lần</b> thì <b>thể tích</b> ' +
      'của hình lập phương đó gấp lên bao nhiêu lần?',
      kLan * kLan * kLan,
      [kLan, kLan * kLan, kLan * 3, kLan * kLan * kLan * kLan],
      'Thể tích = cạnh × cạnh × cạnh. Khi cạnh gấp ' + kLan + ' lần thì cả ba thừa số đều gấp ' +
      kLan + ' lần.<br>' +
      'Vậy thể tích gấp ' + kLan + ' × ' + kLan + ' × ' + kLan + ' = <b>' + (kLan * kLan * kLan) + ' lần</b>. ' +
      '(Còn diện tích toàn phần chỉ gấp ' + (kLan * kLan) + ' lần.)',
      function (x) { return x + ' lần'; }, numericPad);
  }

  /* ============================================================================
   *  9. TOÁN CHUYỂN ĐỘNG
   * ========================================================================== */

  // Đổi số giờ (thập phân) sang chuỗi "x giờ y phút" cho lời giải dễ hiểu.
  function gioPhut(h) {
    var tongPhut = Math.round(h * 60);
    var g = Math.floor(tongPhut / 60), p = tongPhut % 60;
    if (g === 0) return p + ' phút';
    return g + ' giờ' + (p ? ' ' + p + ' phút' : '');
  }

  function genChuyenDong() {
    var topic = 'chuyen-dong';
    var t = tier();

    if (t === 0) {
      // Vận tốc phải HỢP với phương tiện: trước đây mọi phương tiện bốc chung một
      // danh sách nên ra đề "ô tô đi 4 km/giờ" hoặc "xe đạp đi 60 km/giờ".
      var PT = [
        { ten: 'một người đi bộ', chu: 'người đó', v: [4, 5, 6] },
        { ten: 'một người đi xe đạp', chu: 'người đó', v: [10, 12, 15, 18, 20] },
        { ten: 'một chiếc xe máy', chu: 'xe máy', v: [30, 36, 40, 45] },
        { ten: 'một chiếc ô tô', chu: 'ô tô', v: [40, 45, 50, 60] },
        { ten: 'một chiếc ca nô', chu: 'ca nô', v: [15, 20, 24, 25, 30] }
      ];
      var pt = pick(PT);
      var v = pick(pt.v);
      var h = pick([1, 2, 3, 4, 5, 1.5, 2.5, 0.5]);
      var s = Math.round(v * h * 100) / 100;
      var hoi = randInt(0, 2);   // 0: tìm s, 1: tìm v, 2: tìm t
      if (hoi === 0) {
        return inQ(topic,
          'Có <b>' + pt.ten + '</b> đi với vận tốc <b>' + v + ' km/giờ</b> trong <b>' + dec(h, 2) + ' giờ</b>. ' +
          'Tính <b>quãng đường</b> ' + pt.chu + ' đi được. (gõ số, đơn vị km)',
          dec(s, 6),
          'Quãng đường = vận tốc × thời gian = ' + v + ' × ' + dec(h, 2) + ' = <b>' + dec(s, 6) + ' km</b>.');
      }
      if (hoi === 1) {
        return inQ(topic,
          'Có <b>' + pt.ten + '</b> đi được quãng đường <b>' + dec(s, 2) + ' km</b> trong <b>' + dec(h, 2) +
          ' giờ</b>. Tính <b>vận tốc</b> của ' + pt.chu + '. (gõ số, đơn vị km/giờ)',
          dec(v, 6),
          'Vận tốc = quãng đường : thời gian = ' + dec(s, 2) + ' : ' + dec(h, 2) + ' = <b>' + dec(v, 6) +
          ' km/giờ</b>.');
      }
      return inQ(topic,
        'Có <b>' + pt.ten + '</b> đi quãng đường <b>' + dec(s, 2) + ' km</b> với vận tốc <b>' + v +
        ' km/giờ</b>. Tính <b>thời gian</b> ' + pt.chu + ' đi hết quãng đường đó. (gõ số, đơn vị giờ)',
        dec(h, 6),
        'Thời gian = quãng đường : vận tốc = ' + dec(s, 2) + ' : ' + v + ' = <b>' + dec(h, 6) + ' giờ</b>' +
        (Math.round(h * 60) % 60 === 0 ? '.' : ' (tức ' + gioPhut(h) + ').'));
    }

    if (t === 1) {
      var k1 = randInt(0, 1);

      if (k1 === 0) {
        // Có nghỉ dọc đường.
        var gioDi = randInt(6, 9);
        var soGioChay = pick([2, 3, 4]);
        var nghi = pick([15, 20, 30, 45]);
        var tongPhut = soGioChay * 60 + nghi;
        var gioDen = gioDi + Math.floor(tongPhut / 60);
        var phutDen = tongPhut % 60;
        var vToc = pick([30, 36, 40, 45, 50, 60]);
        var quangDuong = vToc * soGioChay;
        return inQ(topic,
          'Một ô tô khởi hành từ A lúc <b>' + gioDi + ' giờ</b> và đến B lúc <b>' + gioDen + ' giờ' +
          (phutDen ? ' ' + phutDen + ' phút' : '') + '</b>. Dọc đường ô tô nghỉ <b>' + nghi + ' phút</b>. ' +
          'Biết quãng đường AB dài <b>' + fmtInt(quangDuong) + ' km</b>, tính <b>vận tốc</b> của ô tô. ' +
          '(gõ số, đơn vị km/giờ)',
          vToc,
          'Thời gian từ lúc đi đến lúc đến: ' + gioDen + ' giờ' + (phutDen ? ' ' + phutDen + ' phút' : '') +
          ' − ' + gioDi + ' giờ = ' + gioPhut(tongPhut / 60) + '.<br>' +
          'Trừ thời gian nghỉ ' + nghi + ' phút, thời gian ô tô THỰC SỰ chạy là ' + soGioChay + ' giờ.<br>' +
          'Vận tốc = ' + fmtInt(quangDuong) + ' : ' + soGioChay + ' = <b>' + vToc + ' km/giờ</b>.');
      }

      // Đi và về với hai vận tốc khác nhau -> vận tốc trung bình cả quãng đường.
      var cap = pick([[40, 60], [30, 60], [20, 30], [10, 15], [12, 24], [15, 30], [45, 90], [24, 8]]);
      var v1 = cap[0], v2 = cap[1];
      var vtb = 2 * v1 * v2 / (v1 + v2);
      var sGiaDinh = lcm(v1, v2);   // BCNN, không dùng tích: tránh "AB dài 4 050 km, đi 90 giờ"
      return inQ(topic,
        'Một người đi từ A đến B với vận tốc <b>' + v1 + ' km/giờ</b>, rồi từ B quay về A với vận tốc <b>' +
        v2 + ' km/giờ</b>. Tính <b>vận tốc trung bình</b> của người đó trên cả quãng đường đi và về. ' +
        '(gõ số, đơn vị km/giờ)',
        dec(vtb, 6),
        'Giả sử quãng đường AB dài ' + fmtInt(sGiaDinh) + ' km (chọn số chia hết cho cả hai vận tốc cho gọn).<br>' +
        'Thời gian đi = ' + fmtInt(sGiaDinh) + ' : ' + v1 + ' = ' + dec(sGiaDinh / v1, 6) + ' giờ; ' +
        'thời gian về = ' + fmtInt(sGiaDinh) + ' : ' + v2 + ' = ' + dec(sGiaDinh / v2, 6) + ' giờ.<br>' +
        'Cả đi và về: quãng đường ' + fmtInt(2 * sGiaDinh) + ' km, thời gian ' +
        dec(sGiaDinh / v1 + sGiaDinh / v2, 6) + ' giờ.<br>' +
        'Vận tốc trung bình = ' + fmtInt(2 * sGiaDinh) + ' : ' + dec(sGiaDinh / v1 + sGiaDinh / v2, 6) +
        ' = <b>' + dec(vtb, 6) + ' km/giờ</b>.<br>' +
        '⚠️ Lưu ý: KHÔNG lấy trung bình cộng hai vận tốc.');
    }

    // ---- Tầng 2: hai động tử ----
    var nguocChieu = randInt(0, 1) === 1;
    var va = pick([30, 36, 40, 45, 50]);
    var vb = pick([12, 15, 18, 20, 25, 30]);
    if (!nguocChieu && va === vb) vb = va - 10;

    if (nguocChieu) {
      var gioGap = pick([1, 2, 3, 1.5, 2.5]);
      var sAB = Math.round((va + vb) * gioGap * 100) / 100;
      return inQ(topic,
        'Hai thành phố A và B cách nhau <b>' + dec(sAB, 2) + ' km</b>. Cùng một lúc, một xe máy đi từ A ' +
        'với vận tốc <b>' + va + ' km/giờ</b> và một xe đạp đi từ B với vận tốc <b>' + vb +
        ' km/giờ</b>, hai xe đi <b>ngược chiều</b> để gặp nhau. ' +
        'Hỏi sau bao lâu hai xe gặp nhau? (gõ số, đơn vị giờ)',
        dec(gioGap, 6),
        'Hai xe đi ngược chiều nên mỗi giờ chúng lại gần nhau: ' + va + ' + ' + vb + ' = ' + (va + vb) + ' km.<br>' +
        'Thời gian gặp nhau = quãng đường : tổng vận tốc = ' + dec(sAB, 2) + ' : ' + (va + vb) +
        ' = <b>' + dec(gioGap, 6) + ' giờ</b>' +
        (Math.round(gioGap * 60) % 60 === 0 ? '.' : ' (tức ' + gioPhut(gioGap) + ').'));
    }

    var gioDuoi = pick([1, 2, 3, 4, 1.5]);
    var khoangCach = Math.round((va - vb) * gioDuoi * 100) / 100;
    return inQ(topic,
      'Một xe máy đi với vận tốc <b>' + va + ' km/giờ</b> đuổi theo một xe đạp đi với vận tốc <b>' + vb +
      ' km/giờ</b>. Lúc bắt đầu, xe máy cách xe đạp <b>' + dec(khoangCach, 2) + ' km</b> và hai xe đi ' +
      '<b>cùng chiều</b>. Hỏi sau bao lâu xe máy đuổi kịp xe đạp? (gõ số, đơn vị giờ)',
      dec(gioDuoi, 6),
      'Hai xe đi cùng chiều nên mỗi giờ xe máy đuổi kịp thêm: ' + va + ' − ' + vb + ' = ' + (va - vb) + ' km.<br>' +
      'Thời gian đuổi kịp = khoảng cách : hiệu vận tốc = ' + dec(khoangCach, 2) + ' : ' + (va - vb) +
      ' = <b>' + dec(gioDuoi, 6) + ' giờ</b>' +
      (Math.round(gioDuoi * 60) % 60 === 0 ? '.' : ' (tức ' + gioPhut(gioDuoi) + ').'));
  }

  /* ============================================================================
   *  10. TƯ DUY — SUY LUẬN — QUY LUẬT
   * ========================================================================== */

  // Đếm số chữ số cần dùng để viết các số tự nhiên từ 1 đến N.
  function demChuSo(N) {
    var tong = 0, low = 1, len = 1;
    while (low <= N) {
      var high = Math.min(N, low * 10 - 1);
      tong += (high - low + 1) * len;
      low *= 10; len++;
    }
    return tong;
  }

  function genTuDuy() {
    var topic = 'tu-duy';
    var t = tier();

    if (t === 0) {
      var kieu = randInt(0, 2);

      if (kieu === 0) {
        // Dãy cộng thêm hằng số.
        var dau = randInt(1, 20), b = randInt(2, 12);
        var day = [];
        for (var i = 0; i < 5; i++) day.push(dau + i * b);
        return inQ(topic,
          'Tìm số thích hợp để viết tiếp vào dãy số sau:<br><b>' + day.join('; ') + '; …</b> (gõ số)',
          dau + 5 * b,
          'Quy luật: mỗi số hơn số liền trước ' + b + ' đơn vị (' + day[1] + ' − ' + day[0] + ' = ' + b + ').<br>' +
          'Số tiếp theo = ' + day[4] + ' + ' + b + ' = <b>' + (dau + 5 * b) + '</b>.');
      }

      if (kieu === 1) {
        // Dãy nhân.
        var dau2 = randInt(1, 6), q = randInt(2, 4);
        var day2 = [];
        for (var j = 0; j < 5; j++) day2.push(dau2 * Math.pow(q, j));
        return inQ(topic,
          'Tìm số thích hợp để viết tiếp vào dãy số sau:<br><b>' + day2.join('; ') + '; …</b> (gõ số)',
          dau2 * Math.pow(q, 5),
          'Quy luật: mỗi số gấp ' + q + ' lần số liền trước (' + day2[1] + ' : ' + day2[0] + ' = ' + q + ').<br>' +
          'Số tiếp theo = ' + day2[4] + ' × ' + q + ' = <b>' + fmtInt(dau2 * Math.pow(q, 5)) + '</b>.');
      }

      // Dãy có khoảng cách tăng dần: +1, +2, +3, ...
      var dau3 = randInt(1, 10), buoc = randInt(1, 3);
      var day3 = [dau3], cur = dau3;
      for (var m = 1; m <= 4; m++) { cur += m * buoc; day3.push(cur); }
      var tiep = cur + 5 * buoc;
      return inQ(topic,
        'Tìm số thích hợp để viết tiếp vào dãy số sau:<br><b>' + day3.join('; ') + '; …</b> (gõ số)',
        tiep,
        'Khoảng cách giữa các số tăng dần: ' +
        [1, 2, 3, 4].map(function (x) { return x * buoc; }).join(', ') + ', …<br>' +
        'Khoảng cách tiếp theo là ' + (5 * buoc) + ' nên số cần tìm = ' + cur + ' + ' + (5 * buoc) +
        ' = <b>' + tiep + '</b>.');
    }

    if (t === 1) {
      var k1 = randInt(0, 2);

      if (k1 === 0) {
        // Số hạng thứ n của dãy cách đều.
        var dauA = randInt(1, 15), kc = pick([2, 3, 4, 5, 6, 7]);
        var n = randInt(15, 60);
        var ans = dauA + (n - 1) * kc;
        return inQ(topic,
          'Cho dãy số: <b>' + dauA + '; ' + (dauA + kc) + '; ' + (dauA + 2 * kc) + '; ' + (dauA + 3 * kc) +
          '; …</b><br>Hỏi <b>số hạng thứ ' + n + '</b> của dãy là số nào? (gõ số)',
          ans,
          'Dãy cách đều ' + kc + ' đơn vị.<br>' +
          'Số hạng thứ n = số hạng đầu + (n − 1) × khoảng cách = ' + dauA + ' + (' + n + ' − 1) × ' + kc +
          ' = ' + dauA + ' + ' + ((n - 1) * kc) + ' = <b>' + fmtInt(ans) + '</b>.');
      }

      if (k1 === 1) {
        // Đếm chữ số dùng để viết các số từ 1 đến N.
        var N = pick([50, 99, 100, 150, 200, 250, 300, 500]);
        var tong = demChuSo(N);
        var chiTiet = 'Từ 1 đến 9 có 9 số, mỗi số 1 chữ số: 9 chữ số.<br>';
        if (N >= 10) {
          var het2 = Math.min(N, 99);
          chiTiet += 'Từ 10 đến ' + het2 + ' có ' + (het2 - 9) + ' số, mỗi số 2 chữ số: ' +
                     ((het2 - 9) * 2) + ' chữ số.<br>';
        }
        if (N >= 100) {
          chiTiet += 'Từ 100 đến ' + N + ' có ' + (N - 99) + ' số, mỗi số 3 chữ số: ' +
                     ((N - 99) * 3) + ' chữ số.<br>';
        }
        return inQ(topic,
          'Để viết tất cả các số tự nhiên từ <b>1</b> đến <b>' + N + '</b> thì cần dùng bao nhiêu <b>chữ số</b>? (gõ số)',
          tong,
          chiTiet + 'Cộng lại: <b>' + fmtInt(tong) + ' chữ số</b>.');
      }

      // Đếm số đối xứng (palindrome).
      var soCS = pick([3, 4]);
      var ansPal = 90;   // cả dạng aba (3 chữ số) lẫn abba (4 chữ số) đều có 9 × 10 = 90 số
      return inQ(topic,
        'Có bao nhiêu số có <b>' + soCS + ' chữ số</b> mà khi đọc từ trái sang phải và từ phải sang trái ' +
        'đều được cùng một số (gọi là <b>số đối xứng</b>)? (gõ số)',
        ansPal,
        soCS === 3
          ? 'Số đối xứng có 3 chữ số dạng <b>aba</b>.<br>Chữ số a có 9 cách chọn (1…9, khác 0), ' +
            'chữ số b có 10 cách chọn (0…9).<br>Vậy có 9 × 10 = <b>90 số</b>.'
          : 'Số đối xứng có 4 chữ số dạng <b>abba</b>.<br>Chữ số a có 9 cách chọn (1…9, khác 0), ' +
            'chữ số b có 10 cách chọn (0…9).<br>Vậy có 9 × 10 = <b>90 số</b>.');
    }

    // ---- Tầng 2: thử thách ----
    var k2 = randInt(0, 3);

    if (k2 === 0) {
      // Chữ số tận cùng của một tích nhiều thừa số giống nhau.
      var co = pick([2, 3, 7, 8, 4, 9]);
      var mu = randInt(12, 60);
      var chuKy = [];
      var cur2 = 1;
      for (var i2 = 1; i2 <= 4; i2++) { cur2 = (cur2 * co) % 10; chuKy.push(cur2); }
      // Rút gọn chu kỳ (2,3,7,8 có chu kỳ 4; 4,9 có chu kỳ 2).
      var doDai = (co === 4 || co === 9) ? 2 : 4;
      chuKy = chuKy.slice(0, doDai);
      var ansTC = chuKy[(mu - 1) % doDai];
      return inQ(topic,
        'Tìm <b>chữ số tận cùng</b> của tích <b>' + co + ' × ' + co + ' × ' + co + ' × … × ' + co +
        '</b> (có <b>' + mu + '</b> thừa số ' + co + '). (gõ số)',
        ansTC,
        'Xét chữ số tận cùng khi nhân dần: ' +
        chuKy.map(function (x, i) { return (i + 1) + ' thừa số → ' + x; }).join(' ; ') + ' rồi LẶP LẠI.<br>' +
        'Chu kỳ lặp gồm ' + doDai + ' bước. Ta có ' + mu + ' : ' + doDai + ' = ' +
        Math.floor(mu / doDai) + ' (dư ' + (mu % doDai) + ').<br>' +
        'Vậy chữ số tận cùng giống bước thứ ' + ((mu - 1) % doDai + 1) + ' của chu kỳ, tức là <b>' + ansTC + '</b>.');
    }

    if (k2 === 1) {
      // Bất biến: xoá hai số, viết lại tổng.
      var N2 = pick([9, 10, 12, 15, 20]);
      var tongN = N2 * (N2 + 1) / 2;
      return inQ(topic,
        'Trên bảng viết các số <b>1; 2; 3; … ; ' + N2 + '</b>. Mỗi lần, bạn An <b>xoá đi hai số bất kì</b> ' +
        'rồi <b>viết lại tổng</b> của hai số đó. Bạn An làm như vậy cho đến khi trên bảng chỉ còn <b>một số</b>. ' +
        'Hỏi số cuối cùng còn lại là số nào? (gõ số)',
        tongN,
        'Mỗi lần xoá 2 số và viết lại TỔNG của chúng thì <b>tổng tất cả các số trên bảng không thay đổi</b> ' +
        '(đây gọi là đại lượng bất biến).<br>' +
        'Tổng ban đầu = 1 + 2 + … + ' + N2 + ' = (1 + ' + N2 + ') × ' + N2 + ' : 2 = ' + tongN + '.<br>' +
        'Vì mỗi lần bớt đi một số trên bảng nên cuối cùng còn đúng 1 số, và số đó phải bằng tổng ban đầu = <b>' +
        tongN + '</b>.');
    }

    if (k2 === 2) {
      // Đếm số cái bắt tay / số trận đấu.
      var nNguoi = randInt(6, 20);
      var batTay = nNguoi * (nNguoi - 1) / 2;
      var doiTuong = pick([
        { s: 'Trong một buổi gặp mặt có <b>' + nNguoi + ' bạn</b>. Mỗi bạn đều bắt tay với tất cả các bạn còn lại đúng một lần. Hỏi có tất cả bao nhiêu cái bắt tay?',
          d: 'cái bắt tay', nguoi: 'bạn', hanhDong: 'bắt tay với' },
        { s: 'Một giải cờ vua có <b>' + nNguoi + ' vận động viên</b>. Hai vận động viên bất kì đều đấu với nhau đúng một trận. Hỏi giải đấu có tất cả bao nhiêu trận?',
          d: 'trận', nguoi: 'vận động viên', hanhDong: 'đấu với' }
      ]);
      return inQ(topic, doiTuong.s + ' (gõ số)',
        batTay,
        'Mỗi ' + doiTuong.nguoi + ' ' + doiTuong.hanhDong + ' ' + (nNguoi - 1) + ' ' + doiTuong.nguoi +
        ' còn lại nên đếm được ' + nNguoi + ' × ' + (nNguoi - 1) + ' = ' + (nNguoi * (nNguoi - 1)) + ' lượt.<br>' +
        'Nhưng mỗi ' + doiTuong.d + ' đã bị đếm <b>2 lần</b> (một lần cho mỗi ' + doiTuong.nguoi + '), nên phải chia đôi:<br>' +
        (nNguoi * (nNguoi - 1)) + ' : 2 = <b>' + batTay + ' ' + doiTuong.d + '</b>.');
    }

    // Nguyên lý Đi-rích-lê (lấy bi chắc chắn cùng màu).
    var soMau = randInt(3, 4);
    var mMoi = randInt(2, 4);
    var tenMau = shuffle(['đỏ', 'xanh', 'vàng', 'trắng']).slice(0, soMau);
    var soLuong = tenMau.map(function () { return randInt(mMoi + 2, mMoi + 8); });
    var ansBi = (mMoi - 1) * soMau + 1;
    var moTaBi = tenMau.map(function (c, i) { return soLuong[i] + ' viên bi ' + c; }).join(', ');
    return inQ(topic,
      'Trong một chiếc hộp có ' + moTaBi + '. Không nhìn vào hộp, cần lấy ra <b>ít nhất</b> bao nhiêu viên bi ' +
      'để <b>chắc chắn</b> có <b>' + mMoi + ' viên bi cùng màu</b>? (gõ số)',
      ansBi,
      'Xét trường hợp "xui nhất": mỗi màu ta đều lấy được ' + (mMoi - 1) + ' viên mà vẫn chưa đủ ' + mMoi +
      ' viên cùng màu.<br>' +
      'Khi đó đã lấy ' + (mMoi - 1) + ' × ' + soMau + ' = ' + ((mMoi - 1) * soMau) + ' viên.<br>' +
      'Lấy thêm 1 viên nữa thì viên này chắc chắn trùng màu với một nhóm, tạo thành ' + mMoi +
      ' viên cùng màu.<br>' +
      'Vậy cần lấy ít nhất ' + ((mMoi - 1) * soMau) + ' + 1 = <b>' + ansBi + ' viên</b>.');
  }

  /* ============================================================================
   *  ĐĂNG KÝ CHỦ ĐỀ + API
   * ========================================================================== */
  var topics = [
    { id: 'so-tu-nhien', name: 'Số tự nhiên & tính nhanh', emoji: '🔢', gen: genSoTuNhien },
    { id: 'phan-so', name: 'Phân số', emoji: '🍰', gen: genPhanSo },
    { id: 'so-thap-phan', name: 'Số thập phân', emoji: '🔟', gen: genSoThapPhan },
    { id: 'do-luong', name: 'Đại lượng & đo lường', emoji: '📏', gen: genDoLuong },
    { id: 'ti-so-phan-tram', name: 'Tỉ số & phần trăm', emoji: '💯', gen: genTiSoPhanTram },
    { id: 'toan-dien-hinh', name: 'Toán điển hình', emoji: '🧩', gen: genToanDienHinh },
    { id: 'hinh-phang', name: 'Hình phẳng', emoji: '📐', gen: genHinhPhang },
    { id: 'hinh-khoi', name: 'Hình khối & thể tích', emoji: '🧊', gen: genHinhKhoi },
    { id: 'chuyen-dong', name: 'Toán chuyển động', emoji: '🚗', gen: genChuyenDong },
    { id: 'tu-duy', name: 'Tư duy & suy luận', emoji: '💡', gen: genTuDuy }
  ];

  var topicMap = {};
  topics.forEach(function (t) { topicMap[t.id] = t; });

  // generate(topicId, opts?) — opts.tier (0/1/2) ép tầng độ khó để lắp đề theo ma trận.
  function generate(topicId, opts) {
    var t = topicMap[topicId];
    if (!t) throw new Error('Không tìm thấy chủ đề: ' + topicId);
    opts = opts || {};
    _forcedTier = (opts.tier === 0 || opts.tier === 1 || opts.tier === 2) ? opts.tier : null;
    _lastTier = null;
    var q;
    try { q = t.gen(); } finally { _forcedTier = null; }
    if (q && q.tier === undefined) q.tier = _lastTier;
    return q;
  }

  // Bộ trộn: rải đều các chủ đề (xáo vòng) thay vì bốc ngẫu nhiên dễ trùng.
  function generateMixed(n) {
    n = n || 10;
    var out = [], bag = [];
    for (var i = 0; i < n; i++) {
      if (!bag.length) bag = shuffle(topics.map(function (t) { return t.id; }));
      out.push(generate(bag.pop()));
    }
    return out;
  }

  /* ----------------------------- CHUẨN HOÁ & CHECK -----------------------------
   * Đáp án lớp 5 có thể là: số tự nhiên, SỐ THẬP PHÂN (dấu phẩy), PHÂN SỐ a/b,
   * hoặc dãy số ngăn bằng dấu ;. Bé có thể gõ theo nhiều kiểu nên phải so sánh
   * theo GIÁ TRỊ chứ không so chuỗi thô:
   *   "3,5" = "3.5" = "3,50"      |  "3/4" = "0,75"  |  "1 234" = "1234"
   * -------------------------------------------------------------------------- */

  // Chuẩn hoá chữ: bỏ khoảng trắng thừa, hạ chữ thường, bỏ dấu chấm cuối câu.
  function normalizeText(s) {
    return String(s === null || s === undefined ? '' : s)
      .trim().toLowerCase().replace(/\s+/g, ' ').replace(/\.+$/, '');
  }

  /*
   * Đọc một số kiểu Việt Nam, trả về DANH SÁCH giá trị có thể hiểu được.
   * Vì sao là danh sách: chuỗi "18.438" vừa có thể là mười tám nghìn bốn trăm ba tám
   * (dấu chấm phân nhóm nghìn — cách viết Việt Nam), vừa có thể là 18,438 (bé gõ
   * bàn phím số nên ra dấu chấm thay dấu phẩy). Cả hai cách hiểu đều chính đáng,
   * nên ta trả về cả hai và chấm ĐÚNG nếu KHỚP MỘT trong số đó — bé không bị
   * mất điểm oan chỉ vì cách gõ dấu.
   * Quy tắc:
   *  - Bỏ mọi khoảng trắng (bé hay gõ "1 234").
   *  - Có ÍT NHẤT MỘT dấu phẩy -> dấu phẩy CUỐI là dấu thập phân, dấu chấm là phân nhóm.
   *  - Không có phẩy, có dấu chấm -> thử CẢ HAI: phân nhóm nghìn và dấu thập phân.
   * Trả về [] nếu không đọc được.
   */
  function parseNumList(s) {
    var t = String(s === null || s === undefined ? '' : s).trim().replace(/\s/g, '');
    if (!t) return [];

    function doc(str) {
      if (!/^-?(\d+\.?\d*|\.\d+)$/.test(str)) return null;
      var v = Number(str);
      return isFinite(v) ? v : null;
    }

    var out = [];
    function them(v) { if (v !== null && out.indexOf(v) < 0) out.push(v); }

    var soPhay = (t.match(/,/g) || []).length;
    if (soPhay === 1) {
      them(doc(t.replace(/\./g, '').replace(',', '.')));
    } else if (soPhay > 1) {
      // Nhiều dấu phẩy: chỉ coi là phân nhóm nghìn nếu ĐÚNG khuôn 1,234,567.
      if (/^-?\d{1,3}(,\d{3})+$/.test(t)) them(doc(t.replace(/,/g, '')));
      var cuoi = t.lastIndexOf(',');
      them(doc(t.slice(0, cuoi).replace(/[,.]/g, '') + '.' + t.slice(cuoi + 1)));
    } else if (t.indexOf('.') >= 0) {
      them(doc(t));                                   // hiểu dấu chấm là dấu thập phân
      // Chỉ thêm cách hiểu "phân nhóm nghìn" khi ĐÚNG khuôn 1.234 / 12.345.678 —
      // nếu không, "1.5" sẽ bị hiểu nhầm thành 15 và chấm đúng cho đáp án sai.
      if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) them(doc(t.replace(/\./g, '')));
    } else {
      them(doc(t));
    }
    return out;
  }

  // Giữ API một-giá-trị cho các chỗ chỉ cần con số đầu tiên.
  function parseNum(s) {
    var ds = parseNumList(s);
    return ds.length ? ds[0] : NaN;
  }

  // Đọc phân số "a/b" hoặc hỗn số "n a/b". Trả về {n, d} hoặc null.
  function parseFrac(s) {
    var raw = String(s === null || s === undefined ? '' : s).trim();
    var hon = raw.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (hon) {
      var ng = Number(hon[1]), tu = Number(hon[2]), mau = Number(hon[3]);
      if (!mau) return null;
      var dau = ng < 0 ? -1 : 1;
      return { n: dau * (Math.abs(ng) * mau + tu), d: mau };
    }
    var m = raw.replace(/\s/g, '').match(/^(-?\d+)\/(\d+)$/);
    if (!m) return null;
    var d = Number(m[2]);
    if (!d) return null;
    return { n: Number(m[1]), d: d };
  }

  // Chuẩn hoá dãy số ngăn bằng ; hoặc , hoặc khoảng trắng.
  function normalizeSeq(s) {
    return String(s === null || s === undefined ? '' : s).trim().toLowerCase()
      .split(/[;,\s]+/)
      .filter(function (x) { return x.length; })
      .map(function (x) { return x.replace(/[^\d]/g, ''); })
      .filter(function (x) { return x.length; })
      .join(';');
  }

  function ganBang(a, b) {
    return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  }

  function matchInput(answer, userInput) {
    var A = String(answer);
    var U = String(userInput === null || userInput === undefined ? '' : userInput);
    if (!U.trim()) return false;

    // Dãy số (đáp án có dấu ;)
    if (A.indexOf(';') >= 0) return normalizeSeq(U) === normalizeSeq(A);

    // Khớp chữ (dùng cho đáp án là chữ, ví dụ tên hàng).
    if (normalizeText(U) === normalizeText(A)) return true;

    var fa = parseFrac(A), fu = parseFrac(U);
    if (fa && fu) return fa.n * fu.d === fu.n * fa.d;

    // Đáp án chuẩn chỉ có MỘT cách hiểu (do engine sinh ra); câu trả lời của bé
    // có thể có nhiều cách hiểu -> khớp một trong số đó là đúng.
    var na = fa ? [fa.n / fa.d] : parseNumList(A);
    var nu = fu ? [fu.n / fu.d] : parseNumList(U);
    for (var i = 0; i < na.length; i++) {
      for (var j = 0; j < nu.length; j++) {
        if (ganBang(na[i], nu[j])) return true;
      }
    }
    return false;
  }

  function check(question, userInput) {
    if (!question) return false;
    if (question.type === 'mc') {
      // Phải LOẠI các giá trị "rỗng" trước khi ép kiểu số: Number('') , Number(null),
      // Number([]) và Number(false) đều bằng 0, nên nếu không chặn thì mọi câu có
      // đáp án đúng ở vị trí 0 sẽ được chấm ĐÚNG khi học sinh chưa chọn gì.
      if (userInput === null || userInput === undefined || typeof userInput === 'boolean') return false;
      if (typeof userInput === 'string' && userInput.trim() === '') return false;
      if (typeof userInput !== 'number' && typeof userInput !== 'string') return false;
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
    _dec: dec,
    _fracStr: fracStr,
    _groupDigits: groupDigits,
    _parseNum: parseNum,
    _matchInput: matchInput
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = QuestionEngine;
  if (typeof window !== 'undefined') window.QuestionEngine = QuestionEngine;
  if (typeof globalThis !== 'undefined') globalThis.QuestionEngine = QuestionEngine;
})();
