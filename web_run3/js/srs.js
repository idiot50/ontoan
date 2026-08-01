/* srs.js — "Hộp ôn của Pi": ôn tập giãn cách kiểu Leitner cho trẻ 7–10 tuổi.
   JS thuần, không phụ thuộc gì, chạy được cả file://. Phơi ra window.SRS.

   VÌ SAO THIẾT KẾ NHƯ VẬY (đừng đổi nếu chưa đọc):
   - 5 hộp, lịch NÉN: 1 → 3 → 7 → 16 → 35 ngày. KHÔNG dùng lịch kiểu Anki/SM-2:
     nghiên cứu trên học sinh tiểu học cho thấy giãn 2 tuần KHÔNG hơn giãn 1 tuần,
     nên trần ~16–35 ngày là đủ; lịch dài chỉ làm trẻ quên mất.
   - Sai thì LÙI 2 bậc, KHÔNG rơi thẳng về đáy — tránh vòng lặp phạt gây nản.
   - Mỗi phiên tối đa SESSION_CAP thẻ, phần dư TỰ DỜI sang hôm sau.
     TUYỆT ĐỐI không hiện "còn N thẻ quá hạn" (tạo cảm giác nợ nần, phản tác dụng).
   - Không streak, không phạt vì nghỉ ngày. Nghỉ 2 tuần quay lại vẫn được đón.

   Đơn vị lưu là ITEM (từng chỗ trống / từng câu hỏi), không phải cả bài —
   đó là điều kiện tiên quyết để biết trẻ yếu chỗ nào.
*/
(function (global) {
  'use strict';

  var KEY = 'nguphap3.srs.v1';
  var DELAYS = [1, 3, 7, 16, 35];   // số ngày chờ ứng với hộp 0..4
  var MAX_BOX = 4;
  var SESSION_CAP = 8;              // số thẻ tối đa mỗi phiên ôn

  function today() { return Math.floor(Date.now() / 864e5); }

  function load() {
    try {
      var raw = global.localStorage.getItem(KEY);
      var o = raw ? JSON.parse(raw) : null;
      if (o && o.cards && typeof o.cards === 'object') return o;
    } catch (e) {}
    return { v: 1, cards: {} };
  }

  var db = load();

  function save() {
    try { global.localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {}
  }

  /* card = { b:hộp 0..4, d:ngày đến hạn, s:số lần gặp, w:số lần sai, r:{u,f,k,i} } */
  function ensure(id, ref) {
    var c = db.cards[id];
    if (!c) {
      c = { b: 0, d: today(), s: 0, w: 0, r: ref || null };
      db.cards[id] = c;
    } else if (ref && !c.r) {
      c.r = ref;
    }
    return c;
  }

  function schedule(c) { c.d = today() + DELAYS[Math.min(c.b, MAX_BOX)]; }

  // Ghi nhận một lần trả lời. ok=true -> lên hộp; ok=false -> lùi 2 bậc.
  function grade(id, ok, ref) {
    var c = ensure(id, ref);
    c.s++;
    if (ok) {
      c.b = Math.min(MAX_BOX, c.b + 1);
    } else {
      c.w++;
      c.b = Math.max(0, c.b - 2);
    }
    schedule(c);
    save();
    return c;
  }

  // Đưa item vào hàng đợi lần đầu (khi trẻ vừa làm xong bài chính).
  function seed(id, ok, ref) {
    if (db.cards[id]) return grade(id, ok, ref);
    var c = ensure(id, ref);
    c.s = 1;
    if (ok) { c.b = 1; c.w = 0; } else { c.b = 0; c.w = 1; }
    schedule(c);
    save();
    return c;
  }

  function get(id) { return db.cards[id] || null; }

  function box(id) {
    var c = db.cards[id];
    return c ? c.b : 0;
  }

  // Danh sách thẻ đến hạn: hộp thấp trước (đang yếu), rồi đến hạn lâu nhất trước.
  function due(limit) {
    var t = today(), out = [], id;
    for (id in db.cards) {
      if (!Object.prototype.hasOwnProperty.call(db.cards, id)) continue;
      var c = db.cards[id];
      if (c.b >= MAX_BOX) continue;          // đã thuộc chắc -> nghỉ dài, không ép ôn
      if (c.d <= t) out.push({ id: id, card: c });
    }
    out.sort(function (a, b) {
      if (a.card.b !== b.card.b) return a.card.b - b.card.b;
      return a.card.d - b.card.d;
    });
    var n = (limit === undefined) ? SESSION_CAP : limit;
    return n > 0 ? out.slice(0, n) : out;
  }

  function countDue() { return due(0).length; }

  // Số thẻ hiện lên nút "Ôn hôm nay" — đã cắt theo trần phiên, không hiện nợ.
  function todayCount() { return Math.min(countDue(), SESSION_CAP); }

  function stats() {
    var s = { total: 0, mastered: 0, learning: 0, weak: 0 }, id;
    for (id in db.cards) {
      if (!Object.prototype.hasOwnProperty.call(db.cards, id)) continue;
      var c = db.cards[id];
      s.total++;
      if (c.b >= MAX_BOX) s.mastered++;
      else if (c.b <= 1) s.weak++;
      else s.learning++;
    }
    return s;
  }

  // Những item hay sai nhất — dùng cho trang phụ huynh / gợi ý ôn.
  function weakest(n) {
    var out = [], id;
    for (id in db.cards) {
      if (!Object.prototype.hasOwnProperty.call(db.cards, id)) continue;
      var c = db.cards[id];
      if (c.w > 0) out.push({ id: id, card: c });
    }
    out.sort(function (a, b) { return b.card.w - a.card.w; });
    return out.slice(0, n || 10);
  }

  function reset() { db = { v: 1, cards: {} }; save(); }

  // Đọc lại từ localStorage (khi dữ liệu bị đổi ở nơi khác: tab khác, nhập lại sao lưu).
  function reload() { db = load(); return db; }

  global.SRS = {
    DELAYS: DELAYS,
    MAX_BOX: MAX_BOX,
    SESSION_CAP: SESSION_CAP,
    today: today,
    seed: seed,
    grade: grade,
    get: get,
    box: box,
    due: due,
    countDue: countDue,
    todayCount: todayCount,
    stats: stats,
    weakest: weakest,
    reset: reset,
    reload: reload
  };
})(typeof window !== 'undefined' ? window : this);
