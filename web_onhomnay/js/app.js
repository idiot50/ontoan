/* app.js — "Ôn Hôm Nay": sổ từ vựng của em + ôn tập giãn cách.
   JS thuần, chạy được file://. Phụ thuộc js/vocab.js (window.Vocab).

   Ba màn: #on (Ôn hôm nay) · #them (Thêm từ) · #so (Sổ từ)

   NGUYÊN TẮC SƯ PHẠM đã cài (đừng gỡ nếu chưa đọc lý do):
   - Thang leo độ khó theo hộp: nhận diện -> ghép chữ -> gõ có gợi ý -> gõ tự do.
     Nhớ lại chủ động (tự bật ra từ) khắc sâu hơn hẳn chỉ nhận diện.
   - LUÔN có gợi ý (nghĩa/chữ đầu/chữ cái) — với trẻ, hỏi trống không thì không
     tạo được hiệu ứng ghi nhớ.
   - Phản hồi NGAY sau mỗi thẻ, kèm đáp án đúng và nút nghe.
   - Không streak, không đếm ngược, không phạt vì nghỉ ngày.
*/
(function () {
  'use strict';

  var V = window.Vocab;

  /* ---------- helpers ---------- */
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined && txt !== null) n.textContent = String(txt);
    return n;
  }
  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function norm(s) {
    return String(s == null ? '' : s).replace(/[‘’ʼ`´]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
  }
  function shuffled(a) {
    var x = a.slice(), i, j, t;
    for (i = x.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = x[i]; x[i] = x[j]; x[j] = t; }
    return x;
  }

  /* ---------- đọc tiếng Anh (giọng máy) ---------- */
  var synth = window.speechSynthesis || null;
  var enVoice = null;
  function pickVoice() {
    if (!synth) return null;
    var vs = [];
    try { vs = synth.getVoices() || []; } catch (e) { return null; }
    var i;
    for (i = 0; i < vs.length; i++) if (vs[i].lang && vs[i].lang.toLowerCase().indexOf('en-gb') === 0) return vs[i];
    for (i = 0; i < vs.length; i++) if (vs[i].lang && vs[i].lang.toLowerCase().indexOf('en') === 0) return vs[i];
    return null;
  }
  if (synth) {
    enVoice = pickVoice();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', function () { enVoice = pickVoice(); });
  }
  function canSpeak() { return !!(synth && enVoice); }
  function speak(text, slow) {
    if (!canSpeak()) return;
    try {
      synth.cancel();
      var u = new window.SpeechSynthesisUtterance(String(text));
      u.voice = enVoice; u.lang = enVoice.lang;
      u.rate = slow ? 0.6 : 0.85; u.pitch = 1.05;
      synth.speak(u);
    } catch (e) {}
  }
  function sayBtn(text, label) {
    if (!canSpeak()) return null;
    var b = el('button', 'say', '🔊');
    b.type = 'button';
    b.title = label || 'Nghe';
    b.setAttribute('aria-label', label || 'Nghe từ này');
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); speak(text); });
    return b;
  }

  /* ---------- điều hướng ---------- */
  var VIEWS = ['on', 'them', 'so'];
  function show(name) {
    VIEWS.forEach(function (v) {
      var sec = document.getElementById('view-' + v);
      if (sec) sec.hidden = (v !== name);
      var tab = document.querySelector('.tab[data-go="' + v + '"]');
      if (tab) tab.classList.toggle('on', v === name);
    });
    if (name === 'on') renderReview();
    if (name === 'so') renderList();
    if (name === 'them') { updateCounts(); var f = $('#f-word'); if (f) setTimeout(function () { try { f.focus(); } catch (e) {} }, 40); }
    updateCounts();
    window.scrollTo(0, 0);
  }
  function route() {
    var h = (window.location.hash || '').replace('#', '');
    show(VIEWS.indexOf(h) >= 0 ? h : 'on');
  }
  window.addEventListener('hashchange', route);
  $$('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      var g = t.dataset.go;
      // Bấm lại chính tab đang mở thì hash không đổi -> không có hashchange.
      // Phải render lại tay, nếu không màn hình đứng im (vd đang ở màn tổng kết).
      if ((window.location.hash || '').replace('#', '') === g) show(g);
      else window.location.hash = g;
    });
  });

  /* ---------- đếm & huy hiệu ---------- */
  function updateCounts() {
    var st = V.stats();
    var b = $('#badge-due');
    if (b) { b.textContent = st.due > 0 ? String(Math.min(st.due, V.SESSION_CAP)) : ''; b.hidden = st.due === 0; }
    var c = $('#badge-count');
    if (c) { c.textContent = st.total ? String(st.total) : ''; c.hidden = st.total === 0; }
    var s = $('#stat-line');
    if (s) {
      s.textContent = st.total
        ? 'Sổ có ' + st.total + ' từ · đã thuộc chắc ' + st.mastered + ' · đang nhớ dần ' + st.learning + ' · cần ôn thêm ' + st.weak
        : 'Sổ từ còn trống — em thêm vài từ để bắt đầu nhé!';
    }
  }

  /* ================= MÀN 1: ÔN HÔM NAY ================= */
  var queue = [], pos = 0, right = 0;

  function renderReview() {
    var host = $('#review');
    host.textContent = '';
    if (pos === 0 || pos >= queue.length) {
      queue = V.due(V.SESSION_CAP);
      pos = 0; right = 0;
    }
    if (!queue.length) {
      var st = V.stats();
      var box = el('div', 'card center');
      if (st.total === 0) {
        box.appendChild(el('div', 'big', '📖'));
        box.appendChild(el('h2', null, 'Sổ từ còn trống'));
        box.appendChild(el('p', 'muted', 'Em thêm vài từ tiếng Anh muốn nhớ, rồi Pi sẽ nhắc em ôn đúng lúc sắp quên.'));
        var b1 = el('button', 'btn', '➕ Thêm từ ngay');
        b1.type = 'button';
        b1.addEventListener('click', function () { window.location.hash = 'them'; });
        box.appendChild(b1);
      } else {
        box.appendChild(el('div', 'big', '✅'));
        box.appendChild(el('h2', null, 'Hôm nay không có từ nào cần ôn'));
        box.appendChild(el('p', 'muted', 'Em nghỉ ngơi hoặc thêm từ mới cũng được. Mai Pi nhắc tiếp!'));
        var nxt = nextDueInfo();
        if (nxt) box.appendChild(el('p', 'muted', nxt));
        var b2 = el('button', 'btn ghost', '📒 Xem sổ từ');
        b2.type = 'button';
        b2.addEventListener('click', function () { window.location.hash = 'so'; });
        box.appendChild(b2);
      }
      host.appendChild(box);
      return;
    }
    renderCard(host);
  }

  function nextDueInfo() {
    var a = V.all(), t = V.today(), min = null;
    a.forEach(function (r) { if (r.it.b < V.MAX_BOX && (min === null || r.it.d < min)) min = r.it.d; });
    if (min === null) return '';
    var d = min - t;
    if (d <= 0) return '';
    return d === 1 ? 'Ngày mai có từ cần ôn.' : 'Khoảng ' + d + ' ngày nữa có từ cần ôn.';
  }

  function tierOf(box, word) {
    var pool = V.count();
    var multi = word.indexOf(' ') >= 0 || word.length > 13;
    if (box <= 0) return (pool >= 4) ? 'choose' : (multi ? 'hint' : 'letters');
    if (box === 1) return multi ? 'hint' : 'letters';
    if (box === 2) return 'hint';
    return 'type';
  }

  function renderCard(host) {
    var cur = queue[pos];
    var it = cur.it;
    var tier = tierOf(it.b, it.w);

    var card = el('div', 'card');
    var top = el('div', 'rc-top');
    top.appendChild(el('span', 'rc-prog', 'Thẻ ' + (pos + 1) + '/' + queue.length));
    var boxTag = el('span', 'rc-box', 'Hộp ' + (it.b + 1) + '/5');
    top.appendChild(boxTag);
    card.appendChild(top);

    /* ---- Vùng câu hỏi: NGHE TRƯỚC, giấu cả từ lẫn nghĩa ----
       Trẻ nghe từ rồi xếp chữ / gõ lại; chỉ khi làm xong mới hiện đầy đủ từ + nghĩa.
       Nghe rồi tự viết ra buộc trẻ nối ÂM với MẶT CHỮ — khắc sâu hơn nhìn rồi chép.
       Máy không có giọng đọc thì rơi về hỏi bằng chữ, nếu không thẻ sẽ không giải được. */
    var listen = canSpeak();
    var qWrap = el('div', 'rc-q');

    if (listen) {
      var hear = el('button', 'hear', '🔊');
      hear.type = 'button';
      hear.setAttribute('aria-label', 'Nghe lại từ');
      hear.addEventListener('click', function () { speak(it.w); });
      qWrap.appendChild(hear);
      qWrap.appendChild(el('p', 'hear-lbl', 'Nghe rồi ' + (
        tier === 'choose' ? 'chọn nghĩa đúng' :
        tier === 'letters' ? 'xếp chữ thành từ' : 'gõ lại từ') + '.'));
      var slow = el('button', 'btn ghost tiny', '🐢 Nghe chậm');
      slow.type = 'button';
      slow.addEventListener('click', function () { speak(it.w, true); });
      qWrap.appendChild(slow);
      if (tier !== 'choose') {
        // Cứu cánh khi trẻ không nghe rõ: chỉ hé NGHĨA, KHÔNG lộ từ cần trả lời.
        var peek = el('button', 'btn ghost tiny', '💡 Gợi ý nghĩa');
        peek.type = 'button';
        peek.addEventListener('click', function () {
          peek.remove();
          qWrap.appendChild(el('div', 'peek', 'Nghĩa: ' + it.vi));
        });
        qWrap.appendChild(peek);
      }
      speak(it.w);                       // tự đọc một lần khi thẻ hiện ra
    } else if (tier === 'choose') {
      qWrap.appendChild(el('div', 'word-big', it.w));
      qWrap.appendChild(el('p', 'muted', 'Từ này nghĩa là gì?'));
    } else {
      qWrap.appendChild(el('div', 'mean-big', it.vi));
      qWrap.appendChild(el('p', 'muted', 'Tiếng Anh là gì?'));
    }
    card.appendChild(qWrap);

    var zone = el('div', 'rc-zone');
    card.appendChild(zone);
    var fb = el('div', 'rc-fb');
    fb.hidden = true;
    card.appendChild(fb);
    var act = el('div', 'rc-act');
    card.appendChild(act);
    host.appendChild(card);

    var answered = false;
    var getVal = null;

    function done(ok) {
      if (answered) return;
      answered = true;
      V.grade(cur.id, ok);
      if (ok) right++;
      fb.hidden = false;
      fb.className = 'rc-fb ' + (ok ? 'good' : 'bad');
      fb.textContent = '';
      var t = el('div', 'fb-t', ok ? '✓ Đúng rồi!' : 'Chưa đúng — đáp án là:');
      fb.appendChild(t);
      var ansLine = el('div', 'fb-ans');
      ansLine.appendChild(el('b', null, it.w));
      if (it.ipa) ansLine.appendChild(el('span', 'ipa', it.ipa));
      ansLine.appendChild(document.createTextNode(' — ' + it.vi));
      var s2 = sayBtn(it.w);
      if (s2) ansLine.appendChild(s2);
      fb.appendChild(ansLine);
      if (it.ex) fb.appendChild(el('div', 'fb-ex', '“' + it.ex + '”'));
      if (it.col) fb.appendChild(el('div', 'fb-ex', '🔗 Cụm hay đi kèm: ' + it.col));
      var nb = V.get(cur.id);
      if (ok && nb) {
        fb.appendChild(el('div', 'muted', 'Lên hộp ' + (nb.b + 1) + ' — gặp lại sau ' + V.DELAYS[Math.min(nb.b, V.MAX_BOX)] + ' ngày.'));
      } else if (!ok) {
        fb.appendChild(el('div', 'muted', 'Không sao, mai gặp lại từ này nhé.'));
      }
      speak(it.w);

      act.textContent = '';
      var next = el('button', 'btn', pos + 1 >= queue.length ? 'Xem kết quả →' : 'Thẻ tiếp theo →');
      next.type = 'button';
      next.addEventListener('click', function () {
        pos++;
        if (pos >= queue.length) finishSession();
        else { $('#review').textContent = ''; renderCard($('#review')); }
      });
      act.appendChild(next);
      next.focus();
      updateCounts();
    }

    function submit() {
      if (answered) return;
      var v = getVal ? getVal() : '';
      done(norm(v) === norm(it.w));
    }

    if (tier === 'choose') {
      var others = V.all().filter(function (r) { return r.id !== cur.id; });
      var opts = shuffled(others).slice(0, 3).map(function (r) { return r.it.vi; });
      opts.push(it.vi);
      var box = el('div', 'opts');
      shuffled(opts).forEach(function (txt) {
        var b = el('button', 'opt', txt);
        b.type = 'button';
        b.addEventListener('click', function () {
          if (answered) return;
          var ok = norm(txt) === norm(it.vi);
          b.classList.add(ok ? 'ok' : 'bad');
          done(ok);
        });
        box.appendChild(b);
      });
      zone.appendChild(box);
    } else if (tier === 'letters') {
      var picked = [];
      var built = el('div', 'built', '…');
      var pool = el('div', 'letters');
      function paint() { built.textContent = picked.length ? picked.join('') : '…'; }
      shuffled(it.w.split('')).forEach(function (ch) {
        var b = el('button', 'letter', ch === ' ' ? '␣' : ch);
        b.type = 'button';
        b.addEventListener('click', function () {
          if (answered || b.disabled) return;
          b.disabled = true; picked.push(ch); paint();
        });
        pool.appendChild(b);
      });
      var clr = el('button', 'btn ghost tiny', '↺ Xoá');
      clr.type = 'button';
      clr.addEventListener('click', function () {
        if (answered) return;
        picked = []; paint();
        Array.prototype.forEach.call(pool.querySelectorAll('button'), function (b) { b.disabled = false; });
      });
      zone.appendChild(el('p', 'muted', 'Bấm các chữ cái để xếp thành từ đúng:'));
      zone.appendChild(built);
      zone.appendChild(pool);
      zone.appendChild(clr);
      getVal = function () { return picked.join(''); };
    } else {
      if (tier === 'hint') {
        var h = it.w.replace(/\S/g, function (c, i) { return i === 0 ? c : '_'; });
        zone.appendChild(el('p', 'muted', 'Gợi ý: ' + h + '  (' + it.w.length + ' chữ cái)'));
      }
      var inp = el('input', 'inp');
      inp.type = 'text'; inp.autocomplete = 'off'; inp.spellcheck = false;
      inp.placeholder = 'Gõ từ tiếng Anh…';
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
      zone.appendChild(inp);
      zone.appendChild(el('p', 'tip', '💡 Nhớ tắt bộ gõ tiếng Việt (Telex/VNI) khi gõ tiếng Anh.'
        + (tier === 'type' ? ' Gõ xong đọc to một lần nhé — đọc to giúp nhớ lâu hơn.' : '')));
      getVal = function () { return inp.value; };
      setTimeout(function () { try { inp.focus(); } catch (e) {} }, 40);
    }

    if (tier !== 'choose') {
      var ck = el('button', 'btn', 'Kiểm tra');
      ck.type = 'button';
      ck.addEventListener('click', submit);
      act.appendChild(ck);
      var sk = el('button', 'btn ghost', 'Chưa nhớ, xem đáp án');
      sk.type = 'button';
      sk.addEventListener('click', function () { if (!answered) done(false); });
      act.appendChild(sk);
    }
  }

  function finishSession() {
    var host = $('#review');
    host.textContent = '';
    var n = queue.length;
    var box = el('div', 'card center');
    box.appendChild(el('div', 'big', '🎉'));
    box.appendChild(el('h2', null, 'Xong rồi!'));
    box.appendChild(el('p', null, 'Em vừa ôn ' + n + ' từ, nhớ đúng ' + right + ' từ.'));
    var st = V.stats();
    box.appendChild(el('p', 'muted', 'Đã thuộc chắc: ' + st.mastered + ' · Đang nhớ dần: ' + st.learning + ' · Cần ôn thêm: ' + st.weak));
    var more = V.todayCount();
    box.appendChild(el('p', 'muted', more > 0
      ? 'Còn ' + more + ' từ nữa nếu em muốn học tiếp — hoặc để mai cũng được.'
      : 'Hôm nay hết từ cần ôn rồi. Đi chơi thôi! 🌤️'));
    if (more > 0) {
      var b = el('button', 'btn', 'Ôn tiếp →');
      b.type = 'button';
      b.addEventListener('click', function () { queue = []; pos = 0; renderReview(); });
      box.appendChild(b);
    }
    var b2 = el('button', 'btn ghost', '📒 Xem sổ từ');
    b2.type = 'button';
    b2.addEventListener('click', function () { window.location.hash = 'so'; });
    box.appendChild(b2);
    host.appendChild(box);
    queue = []; pos = 0;
    updateCounts();
  }

  /* ================= MÀN 2: THÊM TỪ ================= */
  function flash(msg, kind) {
    var n = $('#flash');
    n.textContent = msg;
    n.className = 'flash ' + (kind || 'ok');
    n.hidden = false;
    clearTimeout(flash._t);
    flash._t = setTimeout(function () { n.hidden = true; }, 4000);
  }

  $('#form-add').addEventListener('submit', function (e) {
    e.preventDefault();
    var w = $('#f-word').value, vi = $('#f-mean').value, ex = $('#f-ex').value;
    var r = V.add(w, vi, ex);
    if (r.ok) {
      flash('✓ Đã thêm “' + w.trim() + '” vào sổ. Từ mới sẽ được ôn ngay hôm nay.', 'ok');
      $('#f-word').value = ''; $('#f-mean').value = ''; $('#f-ex').value = '';
      $('#f-word').focus();
      updateCounts();
    } else if (r.reason === 'trùng') {
      flash('Từ “' + w.trim() + '” đã có trong sổ rồi.', 'warn');
    } else {
      flash('Cần nhập cả từ tiếng Anh và nghĩa tiếng Việt.', 'warn');
    }
  });

  /* --- dán danh sách -> máy tra nghĩa -> cho xem lại rồi mới thêm --- */
  var scanned = [];

  function renderPreview() {
    var host = $('#preview-list');
    host.textContent = '';
    var nOk = 0, nMiss = 0, nDup = 0;

    scanned.forEach(function (r, i) {
      if (r.status === 'dup') nDup++;
      else if (r.vi) nOk++;
      else nMiss++;

      var row = el('div', 'prow' + (r.status === 'dup' ? ' is-dup' : ''));

      var wcell = el('div', 'pw');
      wcell.appendChild(el('span', 'w', r.word));
      if (r.ic) wcell.appendChild(el('span', 'ic', r.ic));
      if (r.ipa) wcell.appendChild(el('span', 'ipa', r.ipa));
      if (r.pos) wcell.appendChild(el('span', 'tag pos', r.pos));
      var sb = sayBtn(r.word);
      if (sb) wcell.appendChild(sb);
      // Nhãn xét theo CÓ NGHĨA HAY CHƯA, không xét theo nguồn — nếu không thì
      // từ lấy từ tệp CSV (đã có sẵn nghĩa) vẫn bị báo nhầm là "chưa có nghĩa".
      if (r.status === 'dup') {
        wcell.appendChild(el('span', 'tag dup', 'đã có trong sổ'));
      } else if (!r.vi) {
        wcell.appendChild(el('span', 'tag miss', 'chưa có nghĩa — em điền giúp'));
      } else {
        wcell.appendChild(el('span', 'tag ok',
          r.from === 'từ điển' ? 'tra được nghĩa'
            : r.from === 'tệp' ? 'lấy từ tệp'
              : 'em tự cho nghĩa'));
      }
      if (r.base && r.base !== r.id) wcell.appendChild(el('span', 'tag base', 'gốc: ' + r.base));
      row.appendChild(wcell);

      var inp = el('input', 'pvi');
      inp.type = 'text';
      inp.value = r.vi || '';
      inp.placeholder = 'Nghĩa tiếng Việt…';
      inp.disabled = (r.status === 'dup');
      inp.addEventListener('input', function () { scanned[i].vi = inp.value; });
      row.appendChild(inp);

      var ex = el('input', 'pex');
      ex.type = 'text';
      ex.value = r.ex || '';
      ex.placeholder = 'Câu ví dụ (không bắt buộc)';
      ex.spellcheck = false;
      ex.disabled = (r.status === 'dup');
      ex.addEventListener('input', function () { scanned[i].ex = ex.value; });
      row.appendChild(ex);

      var del = el('button', 'mini danger', '✕');
      del.type = 'button';
      del.title = 'Bỏ từ này';
      del.addEventListener('click', function () { scanned.splice(i, 1); renderPreview(); });
      row.appendChild(del);

      host.appendChild(row);
    });

    var parts = [];
    if (nOk) parts.push('✓ ' + nOk + ' từ đã có nghĩa');
    if (nMiss) parts.push('✎ ' + nMiss + ' từ cần em điền nghĩa');
    if (nDup) parts.push('• ' + nDup + ' từ đã có trong sổ (sẽ bỏ qua)');
    $('#preview-sum').textContent = parts.join(' · ') || 'Không có từ nào.';

    var addable = scanned.filter(function (r) { return r.status !== 'dup' && r.vi; }).length;
    var b = $('#btn-commit');
    b.textContent = addable ? '➕ Thêm ' + addable + ' từ vào sổ' : '➕ Thêm vào sổ';
    b.disabled = addable === 0;
    $('#preview').hidden = scanned.length === 0;
  }

  /* --- nhập từ FILE CSV / TSV --- */
  $('#f-csv').addEventListener('change', function (e) {
    var f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    $('#csv-name').textContent = 'Đang đọc “' + f.name + '”…';
    var rd = new FileReader();
    rd.onerror = function () { flash('Không đọc được file.', 'warn'); $('#csv-name').textContent = ''; };
    rd.onload = function () {
      var text = V.decodeBuffer(rd.result);       // tự dò UTF-8 / windows-1252, sửa cả lỗi phông
      if (!text || !text.trim()) { flash('File rỗng.', 'warn'); $('#csv-name').textContent = ''; return; }
      scanned = V.parseTable(text);
      if (!scanned.length) {
        flash('Không tìm thấy cột từ vựng trong file. Cần một cột tên "Từ vựng" (hoặc Word).', 'warn');
        $('#csv-name').textContent = '';
        return;
      }
      $('#csv-name').textContent = '📄 ' + f.name + ' — nhận ra ' + scanned.length + ' từ.';
      renderPreview();
      var nMiss = scanned.filter(function (r) { return r.status !== 'dup' && !r.vi; }).length;
      flash(nMiss
        ? 'Đã đọc xong file. Còn ' + nMiss + ' từ chưa có nghĩa — em xem lại rồi bấm Thêm.'
        : '✓ Đã đọc xong file: ' + scanned.length + ' từ. Em xem lại rồi bấm Thêm.', nMiss ? 'warn' : 'ok');
      $('#preview').scrollIntoView({ block: 'nearest' });
    };
    rd.readAsArrayBuffer(f);
  });

  $('#btn-scan').addEventListener('click', function () {
    var t = $('#f-bulk').value;
    if (!t.trim()) { flash('Em dán danh sách từ vào ô đã nhé.', 'warn'); return; }
    // dán thẳng cả bảng từ Excel (có dòng tiêu đề) thì cũng hiểu được
    scanned = V.looksTabular(t) ? V.parseTable(t) : V.parseList(t);
    if (!scanned.length) { flash('Chưa nhận ra từ nào trong danh sách.', 'warn'); return; }
    renderPreview();
    var nMiss = scanned.filter(function (r) { return r.status !== 'dup' && !r.vi; }).length;
    flash(nMiss
      ? 'Đã tra xong. Còn ' + nMiss + ' từ chưa có nghĩa — em điền vào rồi bấm Thêm nhé.'
      : '✓ Đã tra xong nghĩa cho tất cả các từ. Em xem lại rồi bấm Thêm.', nMiss ? 'warn' : 'ok');
    $('#preview').scrollIntoView({ block: 'nearest' });
  });

  $('#btn-commit').addEventListener('click', function () {
    var n = V.addRows(scanned);
    var skipped = scanned.filter(function (r) { return r.status !== 'dup' && !r.vi; }).length;
    scanned = [];
    $('#preview').hidden = true;
    $('#f-bulk').value = '';
    flash('✓ Đã thêm ' + n + ' từ vào sổ.' + (skipped ? ' Bỏ qua ' + skipped + ' từ chưa có nghĩa.' : '')
      + ' Các từ mới sẽ được ôn ngay hôm nay.', 'ok');
    updateCounts();
  });

  $('#btn-cancel').addEventListener('click', function () {
    scanned = [];
    $('#preview').hidden = true;
  });

  /* ================= MÀN 3: SỔ TỪ ================= */
  function renderList() {
    var host = $('#list');
    host.textContent = '';
    var q = norm($('#f-search').value || '');
    var rows = V.all().filter(function (r) {
      return !q || norm(r.it.w).indexOf(q) >= 0 || norm(r.it.vi).indexOf(q) >= 0;
    });

    if (!V.count()) {
      host.appendChild(el('p', 'muted', 'Sổ từ còn trống. Sang tab “Thêm từ” để bắt đầu nhé!'));
      return;
    }
    if (!rows.length) {
      host.appendChild(el('p', 'muted', 'Không tìm thấy từ nào khớp “' + $('#f-search').value + '”.'));
      return;
    }

    var t = V.today();
    rows.forEach(function (r) {
      var it = r.it;
      var row = el('div', 'wrow');

      var main = el('div', 'wmain');
      var w = el('span', 'w', it.w);
      main.appendChild(w);
      if (it.ipa) main.appendChild(el('span', 'ipa', it.ipa));
      var sb = sayBtn(it.w);
      if (sb) main.appendChild(sb);
      main.appendChild(el('span', 'vi', '— ' + it.vi));
      if (it.pos) main.appendChild(el('span', 'tag pos', it.pos));
      if (it.ex) main.appendChild(el('div', 'ex', '“' + it.ex + '”'));
      if (it.col) main.appendChild(el('div', 'col', '🔗 ' + it.col));
      row.appendChild(main);

      var meta = el('div', 'wmeta');
      var dots = el('span', 'boxes');
      dots.setAttribute('title', 'Hộp ' + (it.b + 1) + '/5');
      var k;
      for (k = 0; k < 5; k++) dots.appendChild(el('i', k <= it.b ? 'dot on' : 'dot'));
      meta.appendChild(dots);
      var when = it.b >= V.MAX_BOX ? 'đã thuộc' : (it.d <= t ? 'cần ôn hôm nay' : 'ôn sau ' + (it.d - t) + ' ngày');
      meta.appendChild(el('span', 'when' + (it.d <= t && it.b < V.MAX_BOX ? ' due' : ''), when));
      row.appendChild(meta);

      var acts = el('div', 'wacts');
      var bE = el('button', 'mini', '✏️');
      bE.type = 'button'; bE.title = 'Sửa nghĩa';
      bE.addEventListener('click', function () {
        var nv = window.prompt('Nghĩa của “' + it.w + '”:', it.vi);
        if (nv === null) return;
        if (!nv.trim()) { flash('Nghĩa không được để trống.', 'warn'); return; }
        V.update(r.id, { vi: nv });
        renderList(); updateCounts();
      });
      var bD = el('button', 'mini danger', '🗑️');
      bD.type = 'button'; bD.title = 'Xoá từ';
      bD.addEventListener('click', function () {
        if (!window.confirm('Xoá từ “' + it.w + '” khỏi sổ?')) return;
        V.remove(r.id);
        renderList(); updateCounts();
      });
      acts.appendChild(bE); acts.appendChild(bD);
      row.appendChild(acts);

      host.appendChild(row);
    });
  }

  $('#f-search').addEventListener('input', renderList);

  /* ---------- sao lưu ---------- */
  $('#btn-export').addEventListener('click', function () {
    if (!V.count()) { flash('Sổ từ còn trống, chưa có gì để lưu.', 'warn'); return; }
    var blob = new Blob([V.exportJson()], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'so-tu-cua-em.json';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    flash('✓ Đã tải file sao lưu về máy.', 'ok');
  });

  $('#f-import').addEventListener('change', function (e) {
    var f = e.target.files && e.target.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      var r = V.importJson(String(rd.result), true);
      if (r.ok) { flash('✓ Đã nhập thêm ' + r.n + ' từ từ file sao lưu.', 'ok'); renderList(); updateCounts(); }
      else flash('Không nhập được: ' + r.reason, 'warn');
    };
    rd.readAsText(f);
    e.target.value = '';
  });

  $('#btn-clear').addEventListener('click', function () {
    if (!V.count()) return;
    if (!window.confirm('Xoá TOÀN BỘ sổ từ và lịch ôn trên máy này? Không khôi phục được.')) return;
    V.reset();
    renderList(); updateCounts(); flash('Đã xoá sổ từ.', 'warn');
  });

  /* ---------- khởi động ---------- */
  if (!canSpeak()) {
    var w = $('#no-voice');
    if (w) w.hidden = false;
  }
  var ds = $('#dict-size');
  if (ds) ds.textContent = V.dictSize().toLocaleString('vi-VN');
  updateCounts();
  route();
})();
