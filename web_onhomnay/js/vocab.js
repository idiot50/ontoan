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

  /* word = { w:từ, vi:nghĩa, ex:ví dụ, b:hộp, d:ngày đến hạn, s:số lần gặp, wr:số lần sai, at:ngày thêm
              + tuỳ chọn: ipa:phiên âm, pos:loại từ, col:cụm đi kèm, src:nguồn, fq:tần suất } */

  var EXTRA_KEYS = ['ipa', 'pos', 'col', 'src'];

  function add(w, vi, ex, extra) {
    var word = String(w == null ? '' : w).trim();
    var mean = String(vi == null ? '' : vi).trim();
    if (!word || !mean) return { ok: false, reason: 'thiếu' };
    var id = normId(word);
    if (db.words[id]) return { ok: false, reason: 'trùng', id: id };
    var rec = {
      w: word, vi: mean, ex: String(ex == null ? '' : ex).trim(),
      b: 0, d: today(), s: 0, wr: 0, at: today()
    };
    if (extra) {
      EXTRA_KEYS.forEach(function (k) {
        var v = String(extra[k] == null ? '' : extra[k]).trim();
        if (v) rec[k] = v;
      });
      var f = parseInt(extra.fq, 10);
      if (f > 0) rec.fq = f;
    }
    db.words[id] = rec;
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

  /* ---------- TRA TỪ ĐIỂN NHÚNG (window.DICT) ----------
     Không gọi mạng: từ điển đã nhúng sẵn nên tra được cả khi offline / file://.
     Có dò dạng biến đổi đơn giản để "apples", "running", "bigger" vẫn ra gốc. */
  function variants(w) {
    var s = w, out = [s], i;
    function add(x) { if (x && x.length > 1 && out.indexOf(x) < 0) out.push(x); }
    if (/ies$/.test(s)) add(s.slice(0, -3) + 'y');
    if (/ves$/.test(s)) { add(s.slice(0, -3) + 'f'); add(s.slice(0, -3) + 'fe'); }
    if (/(ch|sh|s|x|z|o)es$/.test(s)) add(s.slice(0, -2));
    if (/s$/.test(s)) add(s.slice(0, -1));
    if (/ing$/.test(s)) {
      add(s.slice(0, -3));
      add(s.slice(0, -3) + 'e');
      if (/(.)\1ing$/.test(s)) add(s.slice(0, -4));      // running -> run
    }
    if (/ed$/.test(s)) {
      add(s.slice(0, -2));
      add(s.slice(0, -1));
      if (/ied$/.test(s)) add(s.slice(0, -3) + 'y');
      if (/(.)\1ed$/.test(s)) add(s.slice(0, -3));       // stopped -> stop
    }
    if (/est$/.test(s)) { add(s.slice(0, -3)); add(s.slice(0, -2)); }
    if (/er$/.test(s)) { add(s.slice(0, -2)); add(s.slice(0, -1)); }
    return out;
  }

  // lookup('apples') -> { vi, ex, ic, base:'apple' }  hoặc null
  function lookup(word) {
    var D = global.DICT;
    if (!D) return null;
    var k = normId(word), i, v, e;
    var cands = variants(k);
    for (i = 0; i < cands.length; i++) {
      e = D[cands[i]];
      if (e) return { vi: e[0], ex: e[1] || '', ic: e[2] || '', base: cands[i] };
    }
    return null;
  }

  function dictSize() { return global.DICT ? Object.keys(global.DICT).length : 0; }

  /* ---------- PHÂN TÍCH DANH SÁCH DÁN VÀO ----------
     Chấp nhận cả hai kiểu:
       (a) chỉ danh sách TỪ  ->  tự tra nghĩa + ví dụ trong từ điển
       (b) "từ = nghĩa"      ->  dùng nghĩa người dùng cho
     Bỏ được số thứ tự "1." / "1)" / "- " ở đầu dòng. Một dòng nhiều từ ngăn bằng dấu phẩy. */
  var SEP = /\t|\s+[=|:]\s+|\s+[-–—]\s+|=|\||:/;

  function parseList(text) {
    var rows = [], seen = {};
    String(text || '').split(/\r?\n/).forEach(function (line) {
      var s = line.trim().replace(/^\s*[-*•]\s+/, '').replace(/^\s*\d+\s*[.)]\s*/, '');
      if (!s) return;
      var chunks;
      if (SEP.test(s)) chunks = [s];                    // có nghĩa kèm theo -> giữ nguyên dòng
      else chunks = s.split(/\s*[,;]\s*/);              // chỉ toàn từ -> tách theo dấu phẩy
      chunks.forEach(function (c) {
        var t = c.trim();
        if (!t) return;
        var word = t, vi = '', ex = '', given = false;
        if (SEP.test(t)) {
          var p = t.split(SEP).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
          if (p.length >= 2) { word = p[0]; vi = p[1]; ex = p[2] || ''; given = true; }
          else word = p[0] || t;
        }
        word = word.replace(/[.,;!?]+$/, '').trim();
        if (!word) return;
        var id = normId(word);
        if (seen[id]) return;
        seen[id] = 1;

        var row = { word: word, id: id, vi: vi, ex: ex, from: given ? 'nhập' : '' };
        if (db.words[id]) { row.status = 'dup'; row.vi = row.vi || db.words[id].vi; }
        else if (given) row.status = 'ok';
        else {
          var f = lookup(word);
          if (f) { row.vi = f.vi; row.ex = f.ex; row.ic = f.ic; row.base = f.base; row.status = 'ok'; row.from = 'từ điển'; }
          else { row.status = 'miss'; }
        }
        rows.push(row);
      });
    });
    return rows;
  }

  // Thêm hàng loạt từ danh sách đã phân tích (và người dùng có thể đã sửa nghĩa).
  function addRows(rows) {
    var n = 0, i;
    for (i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (!r || !r.word || !r.vi) continue;
      if (add(r.word, r.vi, r.ex, r).ok) n++;
    }
    return n;
  }

  /* ================= NHẬP FILE CSV / TSV =================
     Nhận file xuất từ Excel / Google Sheets. Nhận diện cột theo TÊN TIÊU ĐỀ nên
     thứ tự cột thế nào cũng được, thiếu cột cũng không sao. */

  // bỏ dấu tiếng Việt để so tên cột ("Nghĩa tiếng Việt" -> "nghiatiengviet")
  function slug(s) {
    var t = String(s == null ? '' : s).replace(/^﻿/, '');
    if (t.normalize) t = t.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return t.replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  var COLS = {
    word: ['tuvung', 'tu', 'word', 'words', 'vocabulary', 'vocab', 'english', 'tienganh', 'term'],
    vi: ['nghiatiengviet', 'nghia', 'nghiatv', 'meaning', 'vietnamese', 'tiengviet', 'dich', 'definition'],
    ex: ['vidu', 'cauvidu', 'example', 'examplesentence', 'sample', 'sentence'],
    ipa: ['phienam', 'ipa', 'pronunciation', 'phatam', 'phonetic'],
    pos: ['loaitu', 'tuloai', 'pos', 'wordclass', 'partofspeech', 'type'],
    col: ['cumdikem', 'collocation', 'collocations', 'cumtu', 'phrase'],
    fq: ['tansuat', 'frequency', 'freq', 'count', 'solan'],
    src: ['nguon', 'source', 'ref', 'reference', 'ghichu', 'note']
  };

  // Bộ đọc CSV đúng chuẩn: chịu được dấu ngăn trong ngoặc kép, "" thoát, xuống dòng trong ô.
  function parseDelimited(text, delim) {
    var rows = [], row = [], cell = '', i = 0, inQ = false, c, n;
    var s = String(text || '').replace(/^﻿/, '');
    while (i < s.length) {
      c = s.charAt(i);
      if (inQ) {
        if (c === '"') {
          n = s.charAt(i + 1);
          if (n === '"') { cell += '"'; i += 2; continue; }
          inQ = false; i++; continue;
        }
        cell += c; i++; continue;
      }
      if (c === '"') { inQ = true; i++; continue; }
      if (c === delim) { row.push(cell); cell = ''; i++; continue; }
      if (c === '\r') { i++; continue; }
      if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; i++; continue; }
      cell += c; i++;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (x) { return String(x).trim() !== ''; }); });
  }

  function guessDelim(text) {
    var head = String(text || '').split(/\r?\n/)[0] || '';
    var counts = { ',': 0, '\t': 0, ';': 0 }, i, ch, inQ = false;
    for (i = 0; i < head.length; i++) {
      ch = head.charAt(i);
      if (ch === '"') { inQ = !inQ; continue; }
      if (!inQ && counts[ch] !== undefined) counts[ch]++;
    }
    var best = ',', k;
    for (k in counts) if (counts[k] > counts[best]) best = k;
    return counts[best] > 0 ? best : ',';
  }

  // Có phải bảng CSV/TSV không (để textarea cũng nhận được nếu người dùng dán thẳng vào)
  function looksTabular(text) {
    var head = String(text || '').split(/\r?\n/)[0] || '';
    if (!head) return false;
    var d = guessDelim(text);
    var cells = parseDelimited(head, d)[0] || [];
    if (cells.length < 2) return false;
    var hit = 0;
    cells.forEach(function (c) {
      var sl = slug(c);
      for (var k in COLS) if (COLS[k].indexOf(sl) >= 0) hit++;
    });
    return hit >= 2;
  }

  /* parseTable(text) -> mảng row giống parseList, kèm ipa/pos/col/src nếu file có.
     Nhận diện cột theo tiêu đề; không có tiêu đề thì coi cột 1 = từ, cột 2 = nghĩa. */
  function parseTable(text) {
    var d = guessDelim(text);
    var grid = parseDelimited(text, d);
    if (!grid.length) return [];

    var head = grid[0].map(slug);
    var idx = {}, k, j;
    for (k in COLS) {
      idx[k] = -1;
      for (j = 0; j < head.length; j++) {
        if (COLS[k].indexOf(head[j]) >= 0) { idx[k] = j; break; }
      }
    }
    var hasHeader = idx.word >= 0 || idx.vi >= 0;
    if (!hasHeader) { idx.word = 0; idx.vi = 1; idx.ex = 2; }   // không có tiêu đề

    var body = hasHeader ? grid.slice(1) : grid;
    // Lưới an toàn: không khớp được tên cột (vd file lỗi phông) nhưng ô đầu tiên
    // rõ ràng không phải từ tiếng Anh -> vẫn coi dòng 1 là tiêu đề mà bỏ qua.
    if (!hasHeader && grid.length > 1 && /[^\x00-\x7F]/.test(String(grid[0][0] || ''))) {
      body = grid.slice(1);
    }
    var rows = [], seen = {};
    body.forEach(function (r) {
      function cell(key) {
        var i2 = idx[key];
        return (i2 >= 0 && r[i2] !== undefined) ? String(r[i2]).trim() : '';
      }
      var word = cell('word').replace(/[.,;!?]+$/, '').trim();
      if (!word) return;
      var id = normId(word);
      if (seen[id]) return;
      seen[id] = 1;

      var row = {
        word: word, id: id,
        vi: cell('vi'), ex: cell('ex'),
        ipa: cell('ipa'), pos: cell('pos'), col: cell('col'), src: cell('src'), fq: cell('fq'),
        from: 'tệp'
      };
      if (db.words[id]) { row.status = 'dup'; row.vi = row.vi || db.words[id].vi; }
      else if (row.vi) row.status = 'ok';
      else {
        var f = lookup(word);
        if (f) { row.vi = f.vi; row.ex = row.ex || f.ex; row.ic = f.ic; row.base = f.base; row.status = 'ok'; row.from = 'từ điển'; }
        else row.status = 'miss';
      }
      rows.push(row);
    });
    return rows;
  }

  /* Giải mã nội dung tệp: ưu tiên UTF-8; hỏng thì thử windows-1252;
     và sửa trường hợp file UTF-8 bị lưu nhầm thành latin1 ("Tá»« vá»±ng" -> "Từ vựng"). */
  function decodeBuffer(buf) {
    var txt;
    try {
      txt = new TextDecoder('utf-8', { fatal: true }).decode(buf);
    } catch (e) {
      try { txt = new TextDecoder('windows-1252').decode(buf); }
      catch (e2) { txt = ''; }
    }
    return repairMojibake(txt);
  }

  /* Bảng ngược CP1252 cho dải 0x80–0x9F. Windows/Excel đọc byte UTF-8 theo CP1252
     nên các byte này hoá thành ký tự > 255 (’ ™ – …). Thiếu bảng này thì không
     khôi phục được chữ có dấu như "đ" (C4 91 -> "Ä’"). */
  var CP1252 = {
    0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85,
    0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A,
    0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92,
    0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
    0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C,
    0x017E: 0x9E, 0x0178: 0x9F
  };

  function repairMojibake(t) {
    if (!t || !/Ã|Æ|á»|Ä|â€|Ạ|Æ°/.test(t)) return t;
    try {
      var bytes = new Uint8Array(t.length), i, n = 0, c;
      for (i = 0; i < t.length; i++) {
        c = t.charCodeAt(i);
        if (c <= 255) bytes[n++] = c;
        else if (CP1252[c] !== undefined) bytes[n++] = CP1252[c];
        else return t;                       // có ký tự lạ -> không phải lỗi phông
      }
      var fixed = new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(0, n));
      // chỉ nhận nếu kết quả THỰC SỰ sạch hơn (bớt ký tự lạ đi)
      return (/Ã|á»|Ä|â€/.test(fixed)) ? t : fixed;
    } catch (e) { return t; }
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
    lookup: lookup, dictSize: dictSize, parseList: parseList, addRows: addRows,
    all: all, count: count, due: due, countDue: countDue, todayCount: todayCount,
    grade: grade, stats: stats,
    exportJson: exportJson, importJson: importJson, reset: reset, reload: reload,
    parseTable: parseTable, looksTabular: looksTabular, decodeBuffer: decodeBuffer,
    parseDelimited: parseDelimited, slug: slug
  };
})(typeof window !== 'undefined' ? window : this);
