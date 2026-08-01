/* vocab.js — Sổ từ vựng của em + lịch ôn giãn cách.  window.Vocab
   JS thuần, không phụ thuộc gì, chạy được cả file://. Dữ liệu nằm HOÀN TOÀN trên máy.

   THIẾT KẾ (giống engine đã dùng cho Ngữ Pháp Vui 3, đừng đổi nếu chưa đọc lý do):
   - Leitner 5 hộp, lịch NÉN cho trẻ: 1 → 3 → 7 → 16 → 35 ngày. KHÔNG dùng lịch kiểu
     Anki (hàng tháng): ở tiểu học, giãn dài không hơn giãn ngắn.
   - Sai thì lùi 2 bậc, KHÔNG rơi thẳng về đáy (tránh vòng lặp phạt gây nản).
   - Trần 10 thẻ/phiên; phần dư tự dời sang hôm sau, KHÔNG hiện "nợ thẻ".
   - Từ mới thêm vào là đến hạn NGAY để học luôn.
*/
(function (global) {
  'use strict';

  var KEY = 'onhomnay.words.v1';
  var DELAYS = [1, 3, 7, 16, 35];
  var MAX_BOX = 4;
  var SESSION_CAP = 10;

  function today() { return Math.floor(Date.now() / 864e5); }

  function normId(w) {
    return String(w == null ? '' : w).trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function load() {
    try {
      var raw = global.localStorage.getItem(KEY);
      var o = raw ? JSON.parse(raw) : null;
      if (o && o.words && typeof o.words === 'object') return o;
    } catch (e) {}
    return { v: 1, words: {} };
  }

  var db = load();

  function save() {
    try { global.localStorage.setItem(KEY, JSON.stringify(db)); return true; }
    catch (e) { return false; }
  }

  /* word = { w:từ tiếng Anh, vi:nghĩa, ex:ví dụ, b:hộp, d:ngày đến hạn, s:số lần gặp, wr:số lần sai, at:ngày thêm } */

  function add(w, vi, ex) {
    var word = String(w == null ? '' : w).trim();
    var mean = String(vi == null ? '' : vi).trim();
    if (!word || !mean) return { ok: false, reason: 'thiếu' };
    var id = normId(word);
    if (db.words[id]) return { ok: false, reason: 'trùng', id: id };
    db.words[id] = {
      w: word, vi: mean, ex: String(ex == null ? '' : ex).trim(),
      b: 0, d: today(), s: 0, wr: 0, at: today()
    };
    save();
    return { ok: true, id: id };
  }

  // Nhận nhiều dòng, mỗi dòng 1 từ. Chấp nhận: "=", "-", ":", "|" hoặc TAB làm dấu ngăn.
  // Có thể thêm ví dụ ở cột thứ 3.  vd:  apple = quả táo = I eat an apple.
  function addBulk(text) {
    var lines = String(text || '').split(/\r?\n/);
    var res = { added: 0, dup: 0, bad: 0, dupList: [], badList: [] };
    lines.forEach(function (ln) {
      var s = ln.trim();
      if (!s) return;
      var parts = s.split(/\t|\s+[=|:]\s+|\s+[-–—]\s+|=|\||:/).map(function (x) { return x.trim(); })
        .filter(function (x) { return x.length > 0; });
      if (parts.length < 2) { res.bad++; res.badList.push(s); return; }
      var r = add(parts[0], parts[1], parts[2] || '');
      if (r.ok) res.added++;
      else if (r.reason === 'trùng') { res.dup++; res.dupList.push(parts[0]); }
      else { res.bad++; res.badList.push(s); }
    });
    return res;
  }

  function remove(id) { if (db.words[id]) { delete db.words[id]; save(); return true; } return false; }

  function update(id, fields) {
    var it = db.words[id];
    if (!it) return false;
    if (fields.vi !== undefined) it.vi = String(fields.vi).trim();
    if (fields.ex !== undefined) it.ex = String(fields.ex).trim();
    if (fields.w !== undefined) {
      var nw = String(fields.w).trim();
      var nid = normId(nw);
      if (nw && nid !== id) {
        if (db.words[nid]) return false;         // trùng từ đã có
        it.w = nw;
        db.words[nid] = it;
        delete db.words[id];
        save();
        return nid;
      }
      it.w = nw || it.w;
    }
    save();
    return true;
  }

  function get(id) { return db.words[id] || null; }

  function all() {
    var out = [], id;
    for (id in db.words) {
      if (Object.prototype.hasOwnProperty.call(db.words, id)) out.push({ id: id, it: db.words[id] });
    }
    out.sort(function (a, b) { return (b.it.at || 0) - (a.it.at || 0); });
    return out;
  }

  function count() { return all().length; }

  // Thẻ đến hạn: hộp thấp trước (đang yếu), rồi đến hạn lâu nhất trước.
  function due(limit) {
    var t = today(), out = [], id;
    for (id in db.words) {
      if (!Object.prototype.hasOwnProperty.call(db.words, id)) continue;
      var it = db.words[id];
      if (it.b >= MAX_BOX) continue;             // đã thuộc chắc -> nghỉ dài
      if (it.d <= t) out.push({ id: id, it: it });
    }
    out.sort(function (a, b) {
      if (a.it.b !== b.it.b) return a.it.b - b.it.b;
      return a.it.d - b.it.d;
    });
    var n = (limit === undefined) ? SESSION_CAP : limit;
    return n > 0 ? out.slice(0, n) : out;
  }

  function countDue() { return due(0).length; }
  function todayCount() { return Math.min(countDue(), SESSION_CAP); }

  function grade(id, ok) {
    var it = db.words[id];
    if (!it) return null;
    it.s++;
    if (ok) it.b = Math.min(MAX_BOX, it.b + 1);
    else { it.wr++; it.b = Math.max(0, it.b - 2); }
    it.d = today() + DELAYS[Math.min(it.b, MAX_BOX)];
    save();
    return it;
  }

  function stats() {
    var s = { total: 0, mastered: 0, learning: 0, weak: 0, due: 0 }, id, t = today();
    for (id in db.words) {
      if (!Object.prototype.hasOwnProperty.call(db.words, id)) continue;
      var it = db.words[id];
      s.total++;
      if (it.b >= MAX_BOX) s.mastered++;
      else if (it.b <= 1) s.weak++;
      else s.learning++;
      if (it.b < MAX_BOX && it.d <= t) s.due++;
    }
    return s;
  }

  function exportJson() { return JSON.stringify(db, null, 2); }

  // Nhập từ file sao lưu. merge=true thì giữ từ đang có, chỉ thêm từ mới.
  function importJson(text, merge) {
    var o;
    try { o = JSON.parse(text); } catch (e) { return { ok: false, reason: 'file không đọc được' }; }
    if (!o || !o.words || typeof o.words !== 'object') return { ok: false, reason: 'không đúng định dạng sổ từ' };
    var n = 0, id;
    if (!merge) db = { v: 1, words: {} };
    for (id in o.words) {
      if (!Object.prototype.hasOwnProperty.call(o.words, id)) continue;
      var s = o.words[id];
      if (!s || !s.w || !s.vi) continue;
      if (merge && db.words[id]) continue;
      db.words[id] = {
        w: String(s.w), vi: String(s.vi), ex: String(s.ex || ''),
        b: Math.max(0, Math.min(MAX_BOX, parseInt(s.b, 10) || 0)),
        d: parseInt(s.d, 10) || today(),
        s: parseInt(s.s, 10) || 0,
        wr: parseInt(s.wr, 10) || 0,
        at: parseInt(s.at, 10) || today()
      };
      n++;
    }
    save();
    return { ok: true, n: n };
  }

  function reset() { db = { v: 1, words: {} }; save(); }
  function reload() { db = load(); return db; }

  global.Vocab = {
    DELAYS: DELAYS, MAX_BOX: MAX_BOX, SESSION_CAP: SESSION_CAP, KEY: KEY,
    today: today, normId: normId,
    add: add, addBulk: addBulk, remove: remove, update: update, get: get,
    all: all, count: count, due: due, countDue: countDue, todayCount: todayCount,
    grade: grade, stats: stats,
    exportJson: exportJson, importJson: importJson, reset: reset, reload: reload
  };
})(typeof window !== 'undefined' ? window : this);
