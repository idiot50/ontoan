/* Ngữ Pháp Vui 3 — bản luyện tập offline.
   JS thuần, không thư viện ngoài, chạy được bằng file://
   Dữ liệu: window.GRAMMAR3 (do build/embed.mjs sinh ra từ data/content.json).
   Phụ thuộc: js/srs.js (window.SRS), js/say.js (window.Say) — nạp TRƯỚC file này.

   Bốn màn (hash routing):
     #home        -> trang chủ (danh sách unit)
     #review      -> "Ôn hôm nay" (thẻ đến hạn, thang leo độ khó)
     #chant/2     -> Đọc theo nhịp của unit 2
     #u2/2_2      -> màn làm bài

   BA NGUYÊN TẮC SƯ PHẠM đã cài vào đây (đừng gỡ nếu chưa đọc lý do):
   1. Chấm TỪNG CÂU và cho SỬA LẠI: sai lần 1 chỉ nêu GỢI Ý (không lộ đáp án) rồi
      cho thử lại; sai lần 2 mới hiện đáp án và đọc to câu đúng. Phản hồi có giải
      thích mạnh hơn hẳn kiểu chỉ báo đúng/sai.
   2. Điểm ghi nhận là điểm LẦN ĐẦU (first), không phải điểm cao nhất sau khi làm
      lại nhiều lượt — "best" chỉ để động viên, không dùng để kết luận đã thuộc.
   3. Mọi item sai/đúng đều được đẩy vào SRS để quay lại đúng lúc sắp quên.
*/
(function () {
  'use strict';

  var DATA = window.GRAMMAR3;
  var STORE_KEY = 'nguphap3.progress.v1';
  var SVGNS = 'http://www.w3.org/2000/svg';
  var SRS = window.SRS;
  var Say = window.Say;

  var TYPE_VI = {
    gapfill: 'điền ô trống',
    dropdown: 'chọn trong ô',
    pickword: 'bấm chọn từ',
    group: 'phân nhóm',
    mcq: 'trắc nghiệm',
    matching: 'nối câu'
  };

  // Gợi ý chung theo dạng bài, dùng khi unit chưa có hint_vi riêng.
  var HINT_BY_TYPE = {
    gapfill: 'Đọc lại cả câu và để ý những từ xung quanh chỗ trống — chúng cho biết cần dạng nào.',
    dropdown: 'Đọc cả câu rồi thử lần lượt từng phương án xem cái nào nghe đúng.',
    mcq: 'Loại dần những phương án chắc chắn sai trước, rồi chọn trong số còn lại.',
    pickword: 'Đọc kỹ chủ ngữ của câu — nó quyết định dạng từ đúng.',
    group: 'Nhìn kỹ đặc điểm chung của các từ đã xếp đúng trong mỗi nhóm.',
    matching: 'Đọc kỹ nửa câu bên trái xem nó hỏi/nói về điều gì rồi tìm nửa hợp nghĩa.'
  };

  /* ================= helpers ================= */

  function elem(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined && txt !== null) n.textContent = String(txt);
    return n;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // escape hết, chỉ cho phép <i> <em> <b> <strong> <br>
  function rich(s) {
    return esc(s).replace(/&lt;(\/?)(i|em|b|strong|br)\s*\/?&gt;/gi, function (_m, sl, tag) {
      return '<' + sl + tag.toLowerCase() + '>';
    });
  }

  function shuffled(arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function range(n) { var a = [], i; for (i = 0; i < n; i++) a.push(i); return a; }

  function normAns(s) {
    return String(s == null ? '' : s)
      .replace(/[‘’ʼ`´]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function stripTags(s) { return String(s == null ? '' : s).replace(/<[^>]*>/g, ''); }

  // Câu hoàn chỉnh (đã điền đáp án) của một dòng — dùng để ĐỌC TO, không hiện ra sớm.
  function sayTextOfLine(line) {
    var out = [], i, t;
    for (i = 0; i < line.length; i++) {
      t = line[i];
      if (t.text !== undefined) {
        if (String(t.text).trim() === '/') continue;      // dấu ngăn của pickword
        out.push(t.text);
      } else if (t.gap !== undefined) {
        out.push(t.gap);
      } else if (t.dd) {
        out.push(t.dd.choices[t.dd.answer]);
      } else if (t.sel) {
        if (t.sel.correct) out.push(t.sel.word);          // chỉ lấy từ đúng
      }
    }
    return stripTags(out.join(''))
      .replace(/\s*\([^)]*\)/g, '')                        // bỏ gợi ý trong ngoặc: (play)
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,!?])/g, '$1')
      .trim();
  }

  /* ================= tiến độ ================= */

  function loadProgress() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      var o = raw ? JSON.parse(raw) : null;
      return (o && typeof o === 'object') ? o : {};
    } catch (e) { return {}; }
  }

  function saveProgress(p) {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {}
  }

  var progress = loadProgress();

  function exKey(unit, ex) { return 'u' + unit + '/' + ex.file; }

  /* Ghi điểm. QUAN TRỌNG: `first` (điểm LẦN ĐẦU làm bài) mới là thước đo trí nhớ;
     `best` chỉ để động viên. Trước đây chỉ lưu best -> làm lại tới 100% là hệ thống
     tưởng đã thuộc và không bao giờ ôn lại nữa. */
  function recordScore(unit, ex, score, max) {
    var k = exKey(unit, ex);
    var cur = progress[k];
    if (!cur || typeof cur.best !== 'number') {
      progress[k] = { best: score, max: max, first: score, lastTs: Date.now() };
    } else {
      if (score > cur.best) cur.best = score;
      if (typeof cur.first !== 'number') cur.first = score;
      cur.max = max;
      cur.lastTs = Date.now();
    }
    saveProgress(progress);
    refreshMarks();
  }

  /* ================= điểm tối đa của mỗi bài ================= */
  function maxOf(ex) {
    var d = ex.data, n = 0, i, j;
    if (ex.type === 'gapfill' || ex.type === 'dropdown') {
      for (i = 0; i < d.lines.length; i++)
        for (j = 0; j < d.lines[i].length; j++)
          if (d.lines[i][j].gap !== undefined || d.lines[i][j].dd) n++;
    } else if (ex.type === 'pickword') {
      for (i = 0; i < d.sentences.length; i++)
        for (j = 0; j < d.sentences[i].length; j++)
          if (d.sentences[i][j].sel && d.sentences[i][j].sel.correct) n++;
    } else if (ex.type === 'group') {
      for (i = 0; i < d.groups.length; i++) n += d.groups[i].items.length;
    } else if (ex.type === 'mcq') {
      n = d.questions.length;
    } else if (ex.type === 'matching') {
      n = d.pairs.length;
    }
    return n || ex.points || 0;
  }

  /* ================= danh sách phẳng ================= */

  var FLAT = [];
  DATA.units.forEach(function (u, ui) {
    u.exercises.forEach(function (ex, ei) { FLAT.push({ ui: ui, ei: ei }); });
  });

  function flatIndex(ui, ei) {
    var i;
    for (i = 0; i < FLAT.length; i++) if (FLAT[i].ui === ui && FLAT[i].ei === ei) return i;
    return -1;
  }

  function findEx(unit, file) {
    var ui, ei;
    for (ui = 0; ui < DATA.units.length; ui++) {
      if (DATA.units[ui].unit !== unit) continue;
      for (ei = 0; ei < DATA.units[ui].exercises.length; ei++) {
        if (DATA.units[ui].exercises[ei].file === file) return { ui: ui, ei: ei };
      }
    }
    return null;
  }

  /* ================= DOM gốc ================= */

  var elHome = document.getElementById('view-home');
  var elExView = document.getElementById('view-ex');
  var elReview = document.getElementById('view-review');
  var elChant = document.getElementById('view-chant');
  var elCards = document.getElementById('cards');
  var elPanel = document.getElementById('panel');
  var elStat = document.getElementById('stat');
  var elReviewBar = document.getElementById('review-bar');
  var elReviewPanel = document.getElementById('review-panel');
  var elChantPanel = document.getElementById('chant-panel');
  var elPi = document.getElementById('pi');

  var current = null;
  var grader = null;
  var relayoutHooks = [];

  window.addEventListener('resize', function () {
    var i;
    for (i = 0; i < relayoutHooks.length; i++) {
      try { relayoutHooks[i](); } catch (e) {}
    }
  });

  /* ================= linh vật Pi ================= */
  // Pi chỉ phản ứng ở RANH GIỚI (chấm xong, hết bài), không nhảy múa lúc trẻ đang
  // suy nghĩ — hiệu ứng vui xen vào lúc đang cố nhớ làm giảm ghi nhớ.
  var piTimer = null;
  function piMood(mood, ms) {
    if (!elPi) return;
    elPi.classList.remove('is-happy', 'is-cheer', 'is-think', 'is-oops');
    if (mood) elPi.classList.add('is-' + mood);
    if (piTimer) { clearTimeout(piTimer); piTimer = null; }
    if (ms) piTimer = setTimeout(function () { piMood('happy'); }, ms);
  }

  /* ================= trang chủ ================= */

  function buildHome() {
    elCards.textContent = '';
    DATA.units.forEach(function (u, ui) {
      var card = elem('article', 'card');

      var h = elem('div', 'card-h');
      var top = elem('div', 'card-top');
      top.appendChild(elem('span', 'card-n', u.label));
      var chant = elem('button', 'chant-link');
      chant.type = 'button';
      chant.textContent = '🥁 Đọc theo nhịp';
      chant.title = 'Đọc to các câu của bài này theo nhịp';
      chant.addEventListener('click', function (e) {
        e.stopPropagation();
        window.location.hash = 'chant/' + u.unit;
      });
      top.appendChild(chant);
      h.appendChild(top);
      var t = elem('span', 'card-t');
      t.innerHTML = rich(u.title);
      h.appendChild(t);
      card.appendChild(h);

      var ul = elem('ul', 'card-list');
      u.exercises.forEach(function (ex, ei) {
        var li = elem('li');
        var b = elem('button', 'ex-btn');
        b.type = 'button';
        b.dataset.ui = String(ui);
        b.dataset.ei = String(ei);
        if (ex.type === 'matching') b.classList.add('is-game');
        b.appendChild(elem('span', 'lbl', ex.label));
        b.appendChild(elem('span', 'type', TYPE_VI[ex.type] || ex.type));
        b.appendChild(elem('span', 'tick', ''));
        b.addEventListener('click', function () { goExercise(ui, ei); });
        li.appendChild(b);
        ul.appendChild(li);
      });
      card.appendChild(ul);
      elCards.appendChild(card);
    });
    refreshMarks();
  }

  function refreshMarks() {
    var done = 0, total = 0;
    DATA.units.forEach(function (u, ui) {
      u.exercises.forEach(function (ex, ei) {
        total++;
        var rec = progress[exKey(u.unit, ex)];
        var mx = maxOf(ex);
        var full = !!(rec && rec.best >= mx);
        if (full) done++;
        var btn = elCards.querySelector('.ex-btn[data-ui="' + ui + '"][data-ei="' + ei + '"]');
        if (!btn) return;
        var tick = btn.querySelector('.tick');
        if (full) tick.textContent = '✓';
        else if (rec) tick.textContent = rec.best + '/' + mx;
        else tick.textContent = '';
        tick.className = 'tick' + (full ? ' full' : '');
      });
    });
    if (elStat) elStat.textContent = 'Hoàn thành ' + done + '/' + total + ' bài';
    refreshReviewBar();
  }

  /* ---- dải "Ôn hôm nay" ---- */
  function refreshReviewBar() {
    if (!elReviewBar || !SRS) return;
    var n = SRS.todayCount();
    elReviewBar.textContent = '';
    if (n > 0) {
      elReviewBar.classList.remove('is-empty');
      var b = elem('button', 'btn review-go');
      b.type = 'button';
      b.innerHTML = '🎯 Ôn hôm nay — <b>' + n + ' thẻ</b>';
      b.addEventListener('click', function () { window.location.hash = 'review'; });
      elReviewBar.appendChild(b);
      elReviewBar.appendChild(elem('span', 'review-note',
        'Toàn những câu em từng làm — ôn lại cho nhớ lâu. Khoảng ' + Math.max(2, Math.round(n * 0.6)) + ' phút thôi.'));
    } else {
      var st = SRS.stats();
      elReviewBar.classList.add('is-empty');
      elReviewBar.appendChild(elem('span', 'review-note',
        st.total
          ? '✅ Hôm nay không có thẻ nào cần ôn. Em học bài mới nhé!'
          : '💡 Làm một bài bất kỳ, hôm sau Pi sẽ nhắc em ôn lại đúng những câu cần ôn.'));
    }
  }

  /* ================= điều hướng ================= */

  function goHome() {
    if ((window.location.hash || '') === '#home') showHome();
    else window.location.hash = 'home';
  }

  function goExercise(ui, ei) {
    var u = DATA.units[ui], ex = u.exercises[ei];
    var h = '#u' + u.unit + '/' + ex.file;
    if ((window.location.hash || '') === h) openExercise(ui, ei);
    else window.location.hash = h.slice(1);
  }

  function hideAll() {
    elHome.hidden = true;
    elExView.hidden = true;
    if (elReview) elReview.hidden = true;
    if (elChant) elChant.hidden = true;
  }

  function showHome() {
    current = null;
    grader = null;
    relayoutHooks = [];
    if (Say) Say.stop();
    hideAll();
    elHome.hidden = false;
    piMood('happy');
    refreshMarks();
    window.scrollTo(0, 0);
  }

  function route() {
    var h = window.location.hash || '';
    var m = /^#?u(\d+)\/(.+)$/.exec(h);
    if (m) {
      var hit = findEx(parseInt(m[1], 10), m[2]);
      if (hit) { openExercise(hit.ui, hit.ei); return; }
    }
    var c = /^#?chant\/(\d+)$/.exec(h);
    if (c) { openChant(parseInt(c[1], 10)); return; }
    if (/^#?review$/.test(h)) { openReview(); return; }
    showHome();
  }

  window.addEventListener('hashchange', route);

  var navBtns = document.querySelectorAll('#view-ex [data-nav]');
  (function bindNav() {
    var i;
    for (i = 0; i < navBtns.length; i++) {
      navBtns[i].addEventListener('click', function (e) {
        var what = e.currentTarget.getAttribute('data-nav');
        if (what === 'home') { goHome(); return; }
        if (!current) return;
        var fi = flatIndex(current.ui, current.ei);
        var to = fi + (what === 'next' ? 1 : -1);
        if (to < 0 || to >= FLAT.length) return;
        goExercise(FLAT[to].ui, FLAT[to].ei);
      });
    }
  })();

  function syncNav() {
    var fi = current ? flatIndex(current.ui, current.ei) : -1;
    var i, b, what;
    for (i = 0; i < navBtns.length; i++) {
      b = navBtns[i];
      what = b.getAttribute('data-nav');
      if (what === 'prev') b.disabled = (fi <= 0);
      else if (what === 'next') b.disabled = (fi < 0 || fi >= FLAT.length - 1);
    }
  }

  /* ================= khung bài tập ================= */

  function openExercise(ui, ei) {
    var u = DATA.units[ui], ex = u.exercises[ei];
    current = { ui: ui, ei: ei };
    grader = null;
    relayoutHooks = [];
    if (Say) Say.stop();

    hideAll();
    elExView.hidden = false;
    piMood('happy');
    syncNav();

    var mx = maxOf(ex);
    elPanel.textContent = '';

    /* --- đầu bài --- */
    var head = elem('div', 'ex-head');
    head.appendChild(elem('div', 'crumb', u.label + ' · ' + ex.label));
    var h2 = elem('h2');
    h2.innerHTML = rich(ex.title || u.title);
    head.appendChild(h2);
    if (ex.instruction) {
      var ins = elem('p', 'instr');
      ins.innerHTML = rich(ex.instruction);
      head.appendChild(ins);
    }
    head.appendChild(elem('p', 'meta',
      'Dạng: ' + (TYPE_VI[ex.type] || ex.type) + ' · Tổng điểm: ' + mx));
    elPanel.appendChild(head);

    /* --- thân bài --- */
    var body = elem('div', 'body');
    elPanel.appendChild(body);
    var built = null;
    try {
      if (ex.type === 'gapfill') built = buildGapfill(ex, body);
      else if (ex.type === 'dropdown') built = buildDropdown(ex, body);
      else if (ex.type === 'pickword') built = buildPickword(ex, body);
      else if (ex.type === 'group') built = buildGroup(ex, body);
      else if (ex.type === 'mcq') built = buildMcq(ex, body);
      else if (ex.type === 'matching') built = buildMatching(ex, body);
      else body.appendChild(elem('p', 'muted', 'Dạng bài chưa hỗ trợ: ' + ex.type));
    } catch (err) {
      body.appendChild(elem('p', 'muted', 'Lỗi hiển thị bài: ' + err.message));
      if (window.console) window.console.error(err);
    }

    if (built) wireGrading(u, ex, built, mx);
    window.scrollTo(0, 0);
  }

  /* ---------- CHẤM TỪNG CÂU + CHO SỬA LẠI ----------
     Vòng 1: sai -> chỉ tô cam + hiện GỢI Ý (không lộ đáp án), cho sửa.
     Vòng 2: vẫn sai -> hiện đáp án, đọc câu đúng, khoá item đó lại.       */
  function wireGrading(u, ex, built, mx) {
    var items = built.items || [];
    var i;
    for (i = 0; i < items.length; i++) {
      items[i].tries = 0;
      items[i].resolved = false;
      items[i].firstOk = false;
    }

    var act = elem('div', 'act');
    var bCheck = elem('button', 'btn', 'Kiểm tra');
    bCheck.type = 'button';
    var bAgain = elem('button', 'btn ghost', 'Làm lại từ đầu');
    bAgain.type = 'button';
    var res = elem('span', 'result', '');
    var best = elem('span', 'best', '');
    var rec = progress[exKey(u.unit, ex)];
    best.textContent = rec
      ? 'Lần đầu: ' + (typeof rec.first === 'number' ? rec.first : rec.best) + '/' + mx
      : 'Chưa làm bài này';

    var hintBox = elem('div', 'hintbox');
    hintBox.hidden = true;
    elPanel.appendChild(hintBox);
    elPanel.appendChild(act);

    act.appendChild(bCheck);
    act.appendChild(bAgain);
    act.appendChild(res);
    act.appendChild(best);

    var round = 0;

    function showHint(nWrong) {
      hintBox.textContent = '';
      hintBox.hidden = false;
      var t = elem('div', 'hint-t');
      t.innerHTML = '💡 <b>Chưa đúng ' + nWrong + ' chỗ</b> — Pi mách nhỏ nhé, em thử sửa lại:';
      hintBox.appendChild(t);
      var p = elem('p', 'hint-b');
      p.innerHTML = rich(u.hint_vi || HINT_BY_TYPE[ex.type] || 'Đọc kỹ lại câu rồi thử lần nữa nhé.');
      hintBox.appendChild(p);
    }

    function finish() {
      var firstScore = 0, fixedScore = 0, k;
      for (k = 0; k < items.length; k++) {
        if (items[k].firstOk) firstScore++;
        if (items[k].ok) fixedScore++;
      }
      bCheck.disabled = true;
      hintBox.hidden = true;

      var perfect = firstScore >= mx;
      res.textContent = 'Lần đầu đúng ' + firstScore + '/' + mx +
        (fixedScore > firstScore ? ' · sau khi sửa: ' + fixedScore + '/' + mx : '') +
        (perfect ? ' — Tuyệt vời! ✓' : '');
      res.className = 'result ' + (perfect ? 'pass' : 'part');
      piMood(perfect ? 'cheer' : 'happy', 2500);

      recordScore(u.unit, ex, firstScore, mx);
      var rec2 = progress[exKey(u.unit, ex)];
      best.textContent = 'Lần đầu: ' + rec2.first + '/' + mx;

      // Đẩy mọi item vào hộp ôn — đúng thì hẹn xa, sai thì gặp lại sớm.
      if (SRS) {
        for (k = 0; k < items.length; k++) {
          var it = items[k];
          SRS.seed('u' + u.unit + '/' + ex.file + '#' + it.key, it.firstOk,
            { u: u.unit, f: ex.file, k: it.kind, i: it.idx });
        }
        refreshReviewBar();
      }

      // Nghe lại toàn bộ câu đúng của bài
      if (Say && Say.available() && built.sayAll && built.sayAll.length) {
        var bs = elem('button', 'btn ghost', '🔊 Nghe lại cả bài');
        bs.type = 'button';
        bs.addEventListener('click', function () { Say.speakSeq(built.sayAll, null); });
        act.insertBefore(bs, res);
      }
    }

    bCheck.addEventListener('click', function () {
      round++;
      var nWrong = 0, k, it;
      for (k = 0; k < items.length; k++) {
        it = items[k];
        if (it.resolved) continue;
        var ok = it.correct();
        if (ok) {
          it.ok = true;
          if (it.tries === 0) it.firstOk = true;
          it.mark('ok');
          it.lock();
          it.resolved = true;
        } else {
          it.tries++;
          if (it.tries >= 2) {
            it.ok = false;
            it.mark('bad');
            it.reveal();
            it.lock();
            it.resolved = true;
            if (Say && Say.available() && it.say) Say.speak(it.say);
          } else {
            it.mark('bad');
            nWrong++;
          }
        }
      }
      if (nWrong > 0) {
        showHint(nWrong);
        piMood('think', 3000);
        bCheck.textContent = 'Kiểm tra lại';
      } else {
        finish();
      }
    });

    bAgain.addEventListener('click', function () {
      openExercise(current.ui, current.ei);
    });
  }

  /* ============ token text dùng chung ============ */
  function addText(host, s) {
    host.appendChild(document.createTextNode(String(s == null ? '' : s)));
  }

  /* ================= 1. gapfill ================= */
  function buildGapfill(ex, host) {
    var d = ex.data;
    var hasPool = !!(d.wordpool && d.wordpool.length);
    var gaps = [];
    var chips = [];
    var selChip = -1;
    var maxLen = 1;
    var sayAll = [];

    d.lines.forEach(function (line) {
      line.forEach(function (tk) {
        if (tk.gap !== undefined) maxLen = Math.max(maxLen, String(tk.gap).length);
      });
    });

    var poolBox = null;
    if (hasPool) {
      poolBox = elem('div', 'pool');
      poolBox.appendChild(elem('span', 'pool-lbl', 'Kho từ — bấm một từ rồi bấm vào ô trống (hoặc kéo-thả)'));
      host.appendChild(poolBox);
    } else {
      var tip = elem('p', 'muted', 'Gõ đáp án vào ô trống. Nếu đang bật bộ gõ tiếng Việt (Telex/VNI) thì tắt đi để gõ tiếng Anh cho đúng. Không phân biệt chữ hoa/thường.');
      tip.style.margin = '0 0 10px';
      host.appendChild(tip);
    }

    d.lines.forEach(function (line, li) {
      var row = elem('div', 'line');
      var lineSay = sayTextOfLine(line);
      sayAll.push(lineSay);
      line.forEach(function (tk) {
        if (tk.gap !== undefined) {
          if (hasPool) {
            var b = elem('span', 'blank empty');
            b.tabIndex = 0;
            var gi = gaps.length;
            gaps.push({ ans: String(tk.gap), node: b, chip: null, say: lineSay, li: li });
            b.addEventListener('click', function () { onBlankClick(gi); });
            b.addEventListener('keydown', function (e) {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onBlankClick(gi); }
            });
            b.addEventListener('dragover', function (e) { if (!b.classList.contains('locked')) { e.preventDefault(); b.classList.add('over'); } });
            b.addEventListener('dragleave', function () { b.classList.remove('over'); });
            b.addEventListener('drop', function (e) {
              e.preventDefault(); b.classList.remove('over');
              if (b.classList.contains('locked')) return;
              var ci = parseInt(e.dataTransfer.getData('text/plain'), 10);
              if (!isNaN(ci) && chips[ci]) place(ci, gi);
            });
            row.appendChild(b);
          } else {
            var inp = elem('input', 'gap');
            inp.type = 'text';
            inp.autocomplete = 'off';
            inp.spellcheck = false;
            inp.size = Math.min(26, Math.max(8, maxLen + 2));
            gaps.push({ ans: String(tk.gap), node: inp, chip: null, say: lineSay, li: li });
            row.appendChild(inp);
          }
        } else {
          addText(row, tk.text);
        }
      });
      host.appendChild(row);
    });

    if (hasPool) {
      shuffled(d.wordpool).forEach(function (w) {
        var c = elem('button', 'chip', w);
        c.type = 'button';
        c.draggable = true;
        var ci = chips.length;
        chips.push({ word: String(w), node: c, gap: null });
        c.addEventListener('click', function () {
          if (c.disabled) return;
          selChip = (selChip === ci) ? -1 : ci;
          syncChips();
        });
        c.addEventListener('dragstart', function (e) {
          if (c.disabled) { e.preventDefault(); return; }
          e.dataTransfer.setData('text/plain', String(ci));
          e.dataTransfer.effectAllowed = 'move';
          selChip = ci; syncChips();
        });
        poolBox.appendChild(c);
      });
    }

    function syncChips() {
      chips.forEach(function (c, i) {
        c.node.classList.toggle('sel', i === selChip);
        c.node.classList.toggle('used', c.gap !== null);
      });
      gaps.forEach(function (g) {
        g.node.classList.toggle('target', selChip >= 0 && g.chip === null && !g.node.classList.contains('locked'));
      });
    }

    function place(ci, gi) {
      var g = gaps[gi], c = chips[ci];
      if (g.node.classList.contains('locked')) return;
      if (g.chip !== null) { chips[g.chip].gap = null; }
      if (c.gap !== null) { gaps[c.gap].chip = null; paint(c.gap); }
      g.chip = ci; c.gap = gi;
      selChip = -1;
      paint(gi); syncChips();
    }

    function paint(gi) {
      var g = gaps[gi];
      if (g.chip === null) { g.node.textContent = ''; g.node.classList.add('empty'); }
      else { g.node.textContent = chips[g.chip].word; g.node.classList.remove('empty'); }
    }

    function onBlankClick(gi) {
      var g = gaps[gi];
      if (g.node.classList.contains('locked')) return;
      if (selChip >= 0) { place(selChip, gi); return; }
      if (g.chip !== null) { chips[g.chip].gap = null; g.chip = null; paint(gi); syncChips(); }
    }

    var items = gaps.map(function (g, gi) {
      return {
        key: 'g' + gi, kind: 'gap', idx: gi, say: g.say,
        correct: function () {
          var val = hasPool ? (g.chip === null ? '' : chips[g.chip].word) : g.node.value;
          return val !== '' && normAns(val) === normAns(g.ans);
        },
        mark: function (s) {
          g.node.classList.remove('ok', 'bad');
          if (s) g.node.classList.add(s);
        },
        reveal: function () {
          var tag = elem('span', 'ans', g.ans);
          if (g.node.parentNode) g.node.parentNode.insertBefore(tag, g.node.nextSibling);
        },
        lock: function () {
          g.node.classList.add('locked');
          if (g.node.tagName === 'INPUT') g.node.disabled = true;
          if (g.chip !== null && chips[g.chip]) { chips[g.chip].node.disabled = true; chips[g.chip].node.draggable = false; }
        }
      };
    });

    return { items: items, sayAll: sayAll };
  }

  /* ================= 2. dropdown ================= */
  function buildDropdown(ex, host) {
    var list = [];
    var sayAll = [];
    ex.data.lines.forEach(function (line, li) {
      var row = elem('div', 'line');
      var lineSay = sayTextOfLine(line);
      sayAll.push(lineSay);
      line.forEach(function (tk) {
        if (tk.dd) {
          var s = elem('select', 'dd');
          var o0 = elem('option', null, '— chọn —');
          o0.value = '';
          s.appendChild(o0);
          tk.dd.choices.forEach(function (ch, i) {
            var o = elem('option', null, ch);
            o.value = String(i);
            s.appendChild(o);
          });
          list.push({ sel: s, answer: tk.dd.answer, choices: tk.dd.choices, say: lineSay, li: li });
          row.appendChild(s);
        } else {
          addText(row, tk.text);
        }
      });
      host.appendChild(row);
    });

    var items = list.map(function (it, i) {
      return {
        key: 'd' + i, kind: 'dd', idx: i, say: it.say,
        correct: function () {
          var v = it.sel.value === '' ? -1 : parseInt(it.sel.value, 10);
          return v === it.answer;
        },
        mark: function (s) { it.sel.classList.remove('ok', 'bad'); if (s) it.sel.classList.add(s); },
        reveal: function () {
          var tag = elem('span', 'ans', it.choices[it.answer]);
          if (it.sel.parentNode) it.sel.parentNode.insertBefore(tag, it.sel.nextSibling);
        },
        lock: function () { it.sel.disabled = true; }
      };
    });

    return { items: items, sayAll: sayAll };
  }

  /* ================= 3. pickword ================= */
  function buildPickword(ex, host) {
    var sents = ex.data.sentences;
    var perSent = sents.map(function (s) {
      return s.filter(function (t) { return t.sel && t.sel.correct; }).length;
    });
    var mode = (sents.length > 1 && perSent.every(function (n) { return n === 1; })) ? 'one' : 'many';
    var words = [];
    var sayAll = [];
    var locked = [];

    sents.forEach(function (s, si) {
      var row = elem('div', sents.length === 1 ? 'para' : 'line');
      var lineSay = sayTextOfLine(s);
      sayAll.push(lineSay);
      locked.push(false);
      s.forEach(function (tk) {
        if (tk.sel) {
          var b = elem('button', 'word', tk.sel.word);
          b.type = 'button';
          var wi = words.length;
          words.push({ si: si, correct: !!tk.sel.correct, node: b, on: false });
          b.addEventListener('click', function () {
            if (locked[si]) return;
            var w = words[wi];
            if (mode === 'one') {
              words.forEach(function (o) {
                if (o.si === w.si) { o.on = false; o.node.classList.remove('sel'); }
              });
              w.on = true; b.classList.add('sel');
            } else {
              w.on = !w.on;
              b.classList.toggle('sel', w.on);
            }
          });
          row.appendChild(b);
        } else {
          addText(row, tk.text);
        }
      });
      host.appendChild(row);
    });

    var items = sents.map(function (_s, si) {
      var group = words.filter(function (w) { return w.si === si; });
      var right = group.filter(function (w) { return w.correct; })[0] || null;
      return {
        key: 's' + si, kind: 'sel', idx: si, say: sayAll[si],
        correct: function () {
          var chosen = group.filter(function (w) { return w.on; });
          if (mode === 'one') return chosen.length === 1 && chosen[0].correct;
          return chosen.length === group.filter(function (w) { return w.correct; }).length &&
            chosen.every(function (w) { return w.correct; });
        },
        mark: function (s) {
          group.forEach(function (w) { w.node.classList.remove('ok', 'bad'); });
          if (!s) return;
          group.forEach(function (w) {
            if (w.on) w.node.classList.add(s === 'ok' ? 'ok' : 'bad');
          });
        },
        reveal: function () { if (right) right.node.classList.add('miss'); },
        lock: function () { locked[si] = true; group.forEach(function (w) { w.node.disabled = true; }); }
      };
    });

    return { items: items, sayAll: sayAll };
  }

  /* ================= 4. group ================= */
  function buildGroup(ex, host) {
    var groups = ex.data.groups;
    var items = [];
    var selItem = -1;
    var frozen = false;

    var tray = elem('div', 'tray');
    var trayLbl = elem('p', 'muted', 'Bấm một từ ở kho rồi bấm vào nhóm muốn xếp vào (hoặc kéo-thả). Bấm từ đã xếp để lấy ra.');
    trayLbl.style.margin = '0 0 6px';
    host.appendChild(trayLbl);
    host.appendChild(tray);

    var grid = elem('div', 'groups');
    var zones = [];
    groups.forEach(function (g, gi) {
      var col = elem('div', 'gcol');
      var h3 = elem('h3');
      h3.innerHTML = rich(g.title);
      col.appendChild(h3);
      var z = elem('div', 'zone');
      z.addEventListener('click', function (e) {
        if (frozen) return;
        if (e.target !== z) return;
        if (selItem >= 0) moveTo(selItem, gi);
      });
      z.addEventListener('dragover', function (e) { if (!frozen) { e.preventDefault(); z.classList.add('over'); } });
      z.addEventListener('dragleave', function () { z.classList.remove('over'); });
      z.addEventListener('drop', function (e) {
        e.preventDefault(); z.classList.remove('over');
        if (frozen) return;
        var ii = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!isNaN(ii) && items[ii]) moveTo(ii, gi);
      });
      zones.push(z);
      col.appendChild(z);
      grid.appendChild(col);
    });
    host.appendChild(grid);

    tray.addEventListener('click', function (e) {
      if (frozen) return;
      if (e.target !== tray) return;
      if (selItem >= 0) moveTo(selItem, null);
    });
    tray.addEventListener('dragover', function (e) { if (!frozen) { e.preventDefault(); tray.classList.add('over'); } });
    tray.addEventListener('dragleave', function () { tray.classList.remove('over'); });
    tray.addEventListener('drop', function (e) {
      e.preventDefault(); tray.classList.remove('over');
      if (frozen) return;
      var ii = parseInt(e.dataTransfer.getData('text/plain'), 10);
      if (!isNaN(ii) && items[ii]) moveTo(ii, null);
    });

    var flat = [];
    groups.forEach(function (g, gi) {
      g.items.forEach(function (w) { flat.push({ text: String(w), gi: gi }); });
    });
    shuffled(flat).forEach(function (f) {
      var b = elem('button', 'item', f.text);
      b.type = 'button';
      b.draggable = true;
      var ii = items.length;
      items.push({ text: f.text, gi: f.gi, node: b, at: null });
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        if (frozen) return;
        if (items[ii].at !== null) { moveTo(ii, null); return; }
        selItem = (selItem === ii) ? -1 : ii;
        syncSel();
      });
      b.addEventListener('dragstart', function (e) {
        if (frozen) { e.preventDefault(); return; }
        e.dataTransfer.setData('text/plain', String(ii));
        e.dataTransfer.effectAllowed = 'move';
        selItem = ii; syncSel();
      });
      tray.appendChild(b);
    });

    function syncSel() {
      items.forEach(function (it, i) { it.node.classList.toggle('sel', i === selItem); });
    }

    function moveTo(ii, gi) {
      var it = items[ii];
      it.at = gi;
      (gi === null ? tray : zones[gi]).appendChild(it.node);
      selItem = -1;
      syncSel();
    }

    var out = items.map(function (it, i) {
      return {
        key: 'i' + i, kind: 'grp', idx: i, say: it.text,
        correct: function () { return it.at === it.gi; },
        mark: function (s) { it.node.classList.remove('ok', 'bad'); if (s) it.node.classList.add(s); },
        reveal: function () {
          var tag = elem('span', 'ans', stripTags(groups[it.gi].title));
          tag.style.fontSize = '.78em';
          if (it.node.parentNode) it.node.parentNode.insertBefore(tag, it.node.nextSibling);
        },
        lock: function () { it.node.disabled = true; it.node.draggable = false; }
      };
    });
    // khoá cả khay khi mọi item đã xong
    out.forEach(function (o) {
      var origLock = o.lock;
      o.lock = function () { origLock(); if (out.every(function (x) { return x.node ? true : true; })) { /* noop */ } };
    });

    return { items: out, sayAll: [] };
  }

  /* ================= 5. mcq ================= */
  function buildMcq(ex, host) {
    var qs = ex.data.questions;
    var picks = qs.map(function () { return -1; });
    var nodes = [];
    var lockedQ = qs.map(function () { return false; });

    var boxes = [];
    qs.forEach(function (q, qi) {
      var box = elem('div', 'q');
      boxes[qi] = box;
      var p = elem('p', 'q-t');
      p.innerHTML = rich(q.text);
      box.appendChild(p);
      var opts = elem('div', 'opts');
      nodes[qi] = [];
      q.choices.forEach(function (ch, ci) {
        var b = elem('button', 'opt', ch);
        b.type = 'button';
        b.addEventListener('click', function () {
          if (lockedQ[qi]) return;
          picks[qi] = ci;
          nodes[qi].forEach(function (n, i) { n.classList.toggle('sel', i === ci); });
        });
        nodes[qi].push(b);
        opts.appendChild(b);
      });
      box.appendChild(opts);
      host.appendChild(box);
    });

    var items = qs.map(function (q, qi) {
      // câu đúng để đọc to: thay dấu … bằng đáp án
      var full = stripTags(rich(q.text)).replace(/…|_{2,}/, q.choices[q.answer]).replace(/\s+/g, ' ').trim();
      return {
        key: 'q' + qi, kind: 'mcq', idx: qi, say: full,
        correct: function () { return picks[qi] === q.answer; },
        mark: function (s) {
          nodes[qi].forEach(function (n) { n.classList.remove('ok', 'bad'); });
          if (s && picks[qi] >= 0) nodes[qi][picks[qi]].classList.add(s);
          // câu BỎ TRỐNG cũng phải thấy được, nếu không trẻ không biết còn thiếu chỗ nào
          boxes[qi].classList.toggle('q-todo', s === 'bad' && picks[qi] < 0);
        },
        reveal: function () { nodes[qi][q.answer].classList.add('miss'); },
        lock: function () { lockedQ[qi] = true; nodes[qi].forEach(function (n) { n.disabled = true; }); }
      };
    });

    return { items: items, sayAll: items.map(function (i) { return i.say; }) };
  }

  /* ================= 6. matching (nối câu) ================= */
  function buildMatching(ex, host) {
    var pairs = ex.data.pairs;
    var n = pairs.length;

    var tip = elem('p', 'muted',
      'Bấm một nửa câu bên trái rồi bấm nửa câu bên phải để nối (hoặc bấm giữ rồi kéo một đường từ trái sang phải). Nối lại thì đường cũ bị thay.');
    tip.style.margin = '0 0 10px';
    host.appendChild(tip);

    var box = elem('div', 'match');
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'match-svg');
    box.appendChild(svg);

    var cols = elem('div', 'match-cols');
    var colL = elem('div', 'mcol left');
    var colR = elem('div', 'mcol right');
    cols.appendChild(colL);
    cols.appendChild(colR);
    box.appendChild(cols);
    host.appendChild(box);

    var leftNodes = [];
    var rightNodes = [];
    var link = [];
    var mark = [];
    var lockedP = [];
    var sel = null;
    var i;
    for (i = 0; i < n; i++) { link.push(-1); mark.push(''); lockedP.push(false); }

    for (i = 0; i < n; i++) mk('L', i, colL);
    shuffled(range(n)).forEach(function (p) { mk('R', p, colR); });

    function mk(side, p, col) {
      var b = elem('button', 'mitem');
      b.type = 'button';
      b.dataset.side = side;
      b.dataset.p = String(p);
      b.innerHTML = rich(side === 'L' ? pairs[p].left : pairs[p].right);
      if (side === 'L') leftNodes[p] = b; else rightNodes[p] = b;
      b.addEventListener('pointerdown', onDown);
      b.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(b); }
      });
      col.appendChild(b);
    }

    function isLocked(el) {
      var p = parseInt(el.dataset.p, 10);
      return lockedP[p];
    }

    var drag = null;

    function onDown(e) {
      if (drag) return;
      var el = e.currentTarget;
      if (isLocked(el)) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      drag = { el: el, x0: e.clientX, y0: e.clientY, moved: false, pid: e.pointerId };
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
      document.addEventListener('pointermove', onMove, true);
      document.addEventListener('pointerup', onUp, true);
      document.addEventListener('pointercancel', onCancel, true);
      e.preventDefault();
    }

    function onMove(e) {
      if (!drag || e.pointerId !== drag.pid) return;
      var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
      if (!drag.moved && (dx * dx + dy * dy) > 25) drag.moved = true;
      if (!drag.moved) return;
      var br = box.getBoundingClientRect();
      draw({
        a: anchorOf(drag.el, br),
        b: { x: e.clientX - br.left, y: e.clientY - br.top }
      });
    }

    function endDrag() {
      if (!drag) return null;
      var d = drag;
      drag = null;
      document.removeEventListener('pointermove', onMove, true);
      document.removeEventListener('pointerup', onUp, true);
      document.removeEventListener('pointercancel', onCancel, true);
      try { d.el.releasePointerCapture(d.pid); } catch (err) {}
      return d;
    }

    function onUp(e) {
      if (drag && e.pointerId !== drag.pid) return;
      var d = endDrag();
      if (!d) { sync(); return; }
      var end = itemFromPoint(e.clientX, e.clientY);
      if (end && end !== d.el && end.dataset.side !== d.el.dataset.side && !isLocked(end)) {
        connect(d.el, end);
        sel = null;
      } else if (!d.moved) {
        tap(d.el);
        return;
      }
      sync();
    }

    function onCancel() { endDrag(); sync(); }

    function itemFromPoint(x, y) {
      var el = document.elementFromPoint(x, y);
      while (el && el !== document.body) {
        if (el.classList && el.classList.contains('mitem') && box.contains(el)) return el;
        el = el.parentNode;
      }
      return null;
    }

    function tap(el) {
      if (isLocked(el)) return;
      if (sel && sel !== el && sel.dataset.side !== el.dataset.side) {
        connect(sel, el);
        sel = null;
      } else if (sel === el) {
        sel = null;
      } else {
        sel = el;
      }
      sync();
    }

    function connect(a, b) {
      var L = (a.dataset.side === 'L') ? a : b;
      var R = (a.dataset.side === 'L') ? b : a;
      var lp = parseInt(L.dataset.p, 10), rp = parseInt(R.dataset.p, 10);
      if (lockedP[lp] || lockedP[rp]) return;
      var k;
      for (k = 0; k < n; k++) if (link[k] === rp && !lockedP[k]) link[k] = -1;
      link[lp] = rp;
    }

    function anchorOf(el, br) {
      var r = el.getBoundingClientRect();
      var x = (el.dataset.side === 'L') ? r.right : r.left;
      return { x: x - br.left, y: r.top + r.height / 2 - br.top };
    }

    function line(a, b, cls) {
      var ln = document.createElementNS(SVGNS, 'line');
      ln.setAttribute('x1', a.x); ln.setAttribute('y1', a.y);
      ln.setAttribute('x2', b.x); ln.setAttribute('y2', b.y);
      ln.setAttribute('class', 'ml ' + cls);
      svg.appendChild(ln);
    }

    function dot(p, cls) {
      var c = document.createElementNS(SVGNS, 'circle');
      c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', 4);
      c.setAttribute('class', 'md ' + cls);
      svg.appendChild(c);
    }

    function draw(temp) {
      var br = box.getBoundingClientRect();
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.setAttribute('width', String(Math.round(br.width)));
      svg.setAttribute('height', String(Math.round(br.height)));
      svg.setAttribute('viewBox', '0 0 ' + Math.round(br.width) + ' ' + Math.round(br.height));
      var k, a, b, cls;
      for (k = 0; k < n; k++) {
        if (link[k] < 0 || !leftNodes[k] || !rightNodes[link[k]]) continue;
        a = anchorOf(leftNodes[k], br);
        b = anchorOf(rightNodes[link[k]], br);
        cls = mark[k] === 'good' ? 'good' : (mark[k] === 'bad' ? 'bad' : '');
        line(a, b, cls);
        dot(a, cls); dot(b, cls);
      }
      if (temp) line(temp.a, temp.b, 'tmp');
    }

    function sync() {
      var k;
      for (k = 0; k < n; k++) {
        leftNodes[k].classList.toggle('sel', sel === leftNodes[k]);
        leftNodes[k].classList.toggle('tied', link[k] >= 0);
        rightNodes[k].classList.toggle('sel', sel === rightNodes[k]);
        rightNodes[k].classList.toggle('tied', link.indexOf(k) >= 0);
      }
      draw();
    }

    relayoutHooks.push(function () { draw(); });
    sync();
    if (window.requestAnimationFrame) window.requestAnimationFrame(function () { draw(); });

    var items = [];
    for (i = 0; i < n; i++) {
      (function (k) {
        items.push({
          key: 'm' + k, kind: 'mat', idx: k,
          say: stripTags(pairs[k].left) + ' ' + stripTags(pairs[k].right),
          correct: function () { return link[k] === k; },
          mark: function (s) {
            leftNodes[k].classList.remove('ok', 'bad');
            mark[k] = (s === 'ok') ? 'good' : (s === 'bad' ? 'bad' : '');
            if (s) leftNodes[k].classList.add(s);
            if (s === 'ok') rightNodes[k].classList.add('ok');
            draw();
          },
          reveal: function () {
            rightNodes[k].classList.add('miss');
            var tag = elem('span', 'ans mans');
            tag.innerHTML = rich(pairs[k].right);
            if (leftNodes[k].parentNode) {
              leftNodes[k].parentNode.insertBefore(tag, leftNodes[k].nextSibling);
            }
            draw();
          },
          lock: function () {
            lockedP[k] = true;
            leftNodes[k].disabled = true;
            rightNodes[k].disabled = true;
            if (window.requestAnimationFrame) window.requestAnimationFrame(function () { draw(); });
          }
        });
      })(i);
    }

    return { items: items, sayAll: pairs.map(function (p) { return stripTags(p.left) + ' ' + stripTags(p.right); }) };
  }

  /* ================= "ÔN HÔM NAY" — thang leo độ khó =================
     Cùng một item, hộp càng cao thì hỏi càng khó:
       hộp 0 -> chọn trong các phương án      (nhận diện)
       hộp 1 -> ghép chữ cái thành từ         (nhớ lại có gợi ý)
       hộp 2 -> gõ, có gợi ý chữ đầu          (nhớ lại chủ động)
       hộp 3 -> gõ tự do + mời nói to         (tạo sinh + phát âm)
     Đây là chỗ biến "gặp lại 8 lần y hệt nhau" thành "8 lần mỗi lần sâu hơn". */

  // Dựng dữ liệu một thẻ ôn từ tham chiếu đã lưu trong SRS.
  function cardFromRef(ref) {
    if (!ref) return null;
    var hit = findEx(ref.u, ref.f);
    if (!hit) return null;
    var u = DATA.units[hit.ui], ex = u.exercises[hit.ei], d = ex.data;
    var i, j, cnt, line;

    if (ref.k === 'gap' || ref.k === 'dd') {
      cnt = 0;
      for (i = 0; i < d.lines.length; i++) {
        line = d.lines[i];
        for (j = 0; j < line.length; j++) {
          var tk = line[j];
          var isGap = (ref.k === 'gap') ? (tk.gap !== undefined) : !!tk.dd;
          if (!isGap) continue;
          if (cnt === ref.i) {
            var ans = (ref.k === 'gap') ? String(tk.gap) : tk.dd.choices[tk.dd.answer];
            return {
              unit: u, ex: ex,
              html: lineHtmlWithBlank(line, j, ref.k),
              answer: ans,
              choices: (ref.k === 'dd') ? tk.dd.choices.slice() : null,
              say: sayTextOfLine(line)
            };
          }
          cnt++;
        }
      }
      return null;
    }
    if (ref.k === 'mcq') {
      var q = d.questions[ref.i];
      if (!q) return null;
      return {
        unit: u, ex: ex,
        html: rich(q.text),
        answer: q.choices[q.answer],
        choices: q.choices.slice(),
        say: stripTags(rich(q.text)).replace(/…|_{2,}/, q.choices[q.answer]).trim()
      };
    }
    if (ref.k === 'sel') {
      var s = d.sentences[ref.i];
      if (!s) return null;
      var right = null, opts = [];
      for (i = 0; i < s.length; i++) if (s[i].sel) { opts.push(s[i].sel.word); if (s[i].sel.correct) right = s[i].sel.word; }
      if (!right) return null;
      return {
        unit: u, ex: ex,
        html: selHtmlWithBlank(s),
        answer: right,
        choices: opts,
        say: sayTextOfLine(s)
      };
    }
    if (ref.k === 'grp') {
      var flat = [], gi;
      for (gi = 0; gi < d.groups.length; gi++) {
        for (j = 0; j < d.groups[gi].items.length; j++) flat.push({ w: d.groups[gi].items[j], t: d.groups[gi].title });
      }
      var f = flat[ref.i];
      if (!f) return null;
      return {
        unit: u, ex: ex,
        html: 'Từ <b>' + esc(f.w) + '</b> thuộc nhóm nào?',
        answer: stripTags(f.t),
        choices: d.groups.map(function (g) { return stripTags(g.title); }),
        say: f.w
      };
    }
    if (ref.k === 'mat') {
      var p = d.pairs[ref.i];
      if (!p) return null;
      return {
        unit: u, ex: ex,
        html: rich(p.left) + ' …',
        answer: stripTags(p.right),
        choices: d.pairs.map(function (x) { return stripTags(x.right); }),
        say: stripTags(p.left) + ' ' + stripTags(p.right)
      };
    }
    return null;
  }

  function lineHtmlWithBlank(line, blankJ, kind) {
    var out = [], j, tk;
    for (j = 0; j < line.length; j++) {
      tk = line[j];
      if (tk.text !== undefined) { out.push(esc(tk.text)); continue; }
      var isTarget = (j === blankJ);
      if (tk.gap !== undefined) out.push(isTarget ? '<span class="rc-blank">____</span>' : esc(tk.gap));
      else if (tk.dd) out.push(isTarget ? '<span class="rc-blank">____</span>' : esc(tk.dd.choices[tk.dd.answer]));
    }
    return out.join('');
  }

  function selHtmlWithBlank(s) {
    var out = [], j, tk, first = true;
    for (j = 0; j < s.length; j++) {
      tk = s[j];
      if (tk.text !== undefined) {
        if (String(tk.text).trim() === '/') continue;
        out.push(esc(tk.text));
      } else if (tk.sel) {
        if (first) { out.push('<span class="rc-blank">____</span>'); first = false; }
      }
    }
    return out.join('');
  }

  function tierOf(box, card) {
    var multiWord = card.answer.indexOf(' ') >= 0 || card.answer.length > 12;
    if (box <= 0 && card.choices && card.choices.length >= 2) return 'choose';
    if (box <= 1) {
      if (!multiWord) return 'letters';
      return (card.choices && card.choices.length >= 2) ? 'choose' : 'hint';
    }
    if (box === 2) return 'hint';
    return 'type';
  }

  var reviewQueue = [];
  var reviewPos = 0;
  var reviewRight = 0;

  function openReview() {
    hideAll();
    if (!elReview) { showHome(); return; }
    elReview.hidden = false;
    if (Say) Say.stop();
    piMood('happy');
    window.scrollTo(0, 0);

    var dues = SRS ? SRS.due(SRS.SESSION_CAP) : [];
    reviewQueue = [];
    dues.forEach(function (d) {
      var c = cardFromRef(d.card.r);
      if (c) reviewQueue.push({ id: d.id, box: d.card.b, card: c });
    });
    reviewPos = 0;
    reviewRight = 0;
    renderReviewCard();
  }

  function renderReviewCard() {
    elReviewPanel.textContent = '';

    if (!reviewQueue.length) {
      var e0 = elem('div', 'rc-done');
      e0.appendChild(elem('h2', null, '✅ Hôm nay không có thẻ nào cần ôn'));
      e0.appendChild(elem('p', 'muted', 'Em học một bài mới nhé — mai Pi sẽ nhắc ôn lại đúng lúc.'));
      var b0 = elem('button', 'btn', '← Về trang chủ');
      b0.type = 'button';
      b0.addEventListener('click', goHome);
      e0.appendChild(b0);
      elReviewPanel.appendChild(e0);
      return;
    }

    if (reviewPos >= reviewQueue.length) {
      var done = elem('div', 'rc-done');
      done.appendChild(elem('h2', null, '🎉 Xong rồi!'));
      done.appendChild(elem('p', null, 'Em vừa ôn ' + reviewQueue.length + ' thẻ, nhớ đúng ' + reviewRight + ' thẻ.'));
      var st = SRS.stats();
      done.appendChild(elem('p', 'muted', 'Đã thuộc chắc: ' + st.mastered + ' · Đang nhớ dần: ' + st.learning + ' · Cần ôn thêm: ' + st.weak));
      var nx = SRS.todayCount();
      done.appendChild(elem('p', 'muted', nx > 0
        ? 'Còn ' + nx + ' thẻ nữa nếu em muốn học tiếp — hoặc để mai cũng được.'
        : 'Hôm nay hết thẻ rồi. Đi chơi thôi!'));
      var bh = elem('button', 'btn', '← Về trang chủ');
      bh.type = 'button';
      bh.addEventListener('click', goHome);
      done.appendChild(bh);
      elReviewPanel.appendChild(done);
      piMood('cheer', 3000);
      refreshReviewBar();
      return;
    }

    var it = reviewQueue[reviewPos];
    var card = it.card;
    var tier = tierOf(it.box, card);

    var wrap = elem('div', 'rc');
    wrap.appendChild(elem('div', 'rc-prog', 'Thẻ ' + (reviewPos + 1) + '/' + reviewQueue.length));
    wrap.appendChild(elem('div', 'rc-crumb', card.unit.label + ' · ' + (card.unit.title ? stripTags(card.unit.title) : '')));

    var q = elem('div', 'rc-q');
    q.innerHTML = card.html;
    wrap.appendChild(q);

    var zone = elem('div', 'rc-zone');
    wrap.appendChild(zone);

    var fb = elem('div', 'rc-fb');
    fb.hidden = true;
    wrap.appendChild(fb);

    var actions = elem('div', 'rc-act');
    wrap.appendChild(actions);
    elReviewPanel.appendChild(wrap);

    var answered = false;
    var getVal = null;

    function finishCard(ok) {
      if (answered) return;
      answered = true;
      SRS.grade(it.id, ok, null);
      if (ok) reviewRight++;
      fb.hidden = false;
      fb.className = 'rc-fb ' + (ok ? 'good' : 'bad');
      fb.textContent = '';
      if (ok) {
        fb.appendChild(elem('div', 'rc-fb-t', '✓ Đúng rồi!'));
        var c2 = SRS.get(it.id);
        var days = c2 ? SRS.DELAYS[Math.min(c2.b, SRS.MAX_BOX)] : 1;
        fb.appendChild(elem('div', 'muted', 'Thẻ này lên hộp cao hơn — gặp lại sau ' + days + ' ngày.'));
        piMood('cheer', 1500);
      } else {
        fb.appendChild(elem('div', 'rc-fb-t', 'Đáp án đúng: “' + card.answer + '”'));
        if (it.card.unit.hint_vi) {
          var hp = elem('p', 'hint-b');
          hp.innerHTML = rich(it.card.unit.hint_vi);
          fb.appendChild(hp);
        }
        piMood('think', 1500);
      }
      if (Say && Say.available() && card.say) {
        var sb = elem('button', 'btn ghost tiny', '🔊 Nghe câu đúng');
        sb.type = 'button';
        sb.addEventListener('click', function () { Say.speak(card.say); });
        fb.appendChild(sb);
        Say.speak(card.say);
      }
      actions.textContent = '';
      var nb = elem('button', 'btn', reviewPos + 1 >= reviewQueue.length ? 'Xem kết quả →' : 'Thẻ tiếp theo →');
      nb.type = 'button';
      nb.addEventListener('click', function () { reviewPos++; renderReviewCard(); });
      actions.appendChild(nb);
    }

    if (tier === 'choose') {
      var opts = elem('div', 'opts');
      shuffled(card.choices).forEach(function (ch) {
        var b = elem('button', 'opt', ch);
        b.type = 'button';
        b.addEventListener('click', function () {
          if (answered) return;
          var ok = normAns(ch) === normAns(card.answer);
          b.classList.add(ok ? 'ok' : 'bad');
          finishCard(ok);
        });
        opts.appendChild(b);
      });
      zone.appendChild(opts);
    } else if (tier === 'letters') {
      var target = card.answer;
      var built = elem('div', 'rc-built');
      var pool = elem('div', 'rc-letters');
      var picked = [];
      function paintBuilt() {
        built.textContent = picked.length ? picked.join('') : '…';
      }
      paintBuilt();
      shuffled(target.split('')).forEach(function (ch) {
        var b = elem('button', 'rc-letter', ch);
        b.type = 'button';
        b.addEventListener('click', function () {
          if (answered || b.disabled) return;
          b.disabled = true;
          picked.push(ch);
          paintBuilt();
        });
        pool.appendChild(b);
      });
      var clr = elem('button', 'btn ghost tiny', '↺ Xoá');
      clr.type = 'button';
      clr.addEventListener('click', function () {
        if (answered) return;
        picked = [];
        paintBuilt();
        var bs = pool.querySelectorAll('button');
        for (var z = 0; z < bs.length; z++) bs[z].disabled = false;
      });
      zone.appendChild(elem('p', 'muted', 'Bấm các chữ cái để xếp thành từ đúng:'));
      zone.appendChild(built);
      zone.appendChild(pool);
      zone.appendChild(clr);
      getVal = function () { return picked.join(''); };
    } else {
      var hint = (tier === 'hint')
        ? card.answer.replace(/\S/g, function (c, i2) { return i2 === 0 ? c : '_'; })
        : '';
      if (tier === 'hint') zone.appendChild(elem('p', 'muted', 'Gợi ý: ' + hint));
      var inp = elem('input', 'rc-input');
      inp.type = 'text';
      inp.autocomplete = 'off';
      inp.spellcheck = false;
      inp.placeholder = 'Gõ đáp án…';
      zone.appendChild(inp);
      if (tier === 'type') {
        zone.appendChild(elem('p', 'muted', '🗣️ Gõ xong em đọc to cả câu một lần nhé — đọc to giúp nhớ lâu hơn nhiều.'));
      }
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); submit(); }
      });
      getVal = function () { return inp.value; };
      setTimeout(function () { try { inp.focus(); } catch (e) {} }, 30);
    }

    function submit() {
      if (answered) return;
      var v = getVal ? getVal() : '';
      finishCard(normAns(v) === normAns(card.answer));
    }

    if (tier !== 'choose') {
      var ck = elem('button', 'btn', 'Kiểm tra');
      ck.type = 'button';
      ck.addEventListener('click', submit);
      actions.appendChild(ck);
      var sk = elem('button', 'btn ghost', 'Chưa nhớ, xem đáp án');
      sk.type = 'button';
      sk.addEventListener('click', function () { if (!answered) finishCard(false); });
      actions.appendChild(sk);
    }
  }

  /* ================= ĐỌC THEO NHỊP (chant) =================
     Chant (đọc theo nhịp) chứ KHÔNG phải bài hát: nghiên cứu cho thấy chant thắng
     ở bài kiểm tra TRỄ HẠN (nhớ lâu) — và vì không có giai điệu nên không đụng
     bản quyền âm nhạc nào. Nhịp gõ sinh bằng Web Audio, 0 byte tài sản.
     Vòng 2 che bớt một từ -> biến việc đọc theo thành một lần NHỚ LẠI.            */

  var chantStop = false;
  var actx = null;

  function beep() {
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      var o = actx.createOscillator(), g = actx.createGain();
      o.frequency.value = 660;
      o.connect(g); g.connect(actx.destination);
      var t = actx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.15, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.start(t); o.stop(t + 0.14);
    } catch (e) {}
  }

  function chantSentences(unit) {
    var out = [], seen = {};
    unit.exercises.forEach(function (ex) {
      var d = ex.data;
      if (ex.type === 'gapfill' || ex.type === 'dropdown') {
        (d.lines || []).forEach(function (l) {
          var s = sayTextOfLine(l);
          if (s && s.length > 6 && !seen[s]) { seen[s] = 1; out.push(s); }
        });
      } else if (ex.type === 'pickword') {
        (d.sentences || []).forEach(function (l) {
          var s = sayTextOfLine(l);
          if (s && s.length > 6 && !seen[s]) { seen[s] = 1; out.push(s); }
        });
      }
    });
    return out.slice(0, 6);
  }

  function openChant(unitNo) {
    hideAll();
    if (!elChant) { showHome(); return; }
    elChant.hidden = false;
    chantStop = false;
    if (Say) Say.stop();
    piMood('happy');
    window.scrollTo(0, 0);

    var u = null, i;
    for (i = 0; i < DATA.units.length; i++) if (DATA.units[i].unit === unitNo) u = DATA.units[i];
    elChantPanel.textContent = '';
    if (!u) { goHome(); return; }

    var sents = chantSentences(u);
    var head = elem('div', 'ex-head');
    head.appendChild(elem('div', 'crumb', u.label + ' · Đọc theo nhịp'));
    var h2 = elem('h2');
    h2.innerHTML = rich(u.title);
    head.appendChild(h2);
    head.appendChild(elem('p', 'instr', 'Nghe Pi đọc rồi ĐỌC TO theo nhé. Vòng 2 sẽ giấu bớt một từ để em tự nhớ.'));
    elChantPanel.appendChild(head);

    if (!sents.length) {
      elChantPanel.appendChild(elem('p', 'muted', 'Bài này chưa có câu phù hợp để đọc theo nhịp.'));
      return;
    }

    var listBox = elem('div', 'chant-list');
    var rows = [];
    sents.forEach(function (s, si) {
      var r = elem('div', 'chant-row');
      r.innerHTML = esc(s);
      rows.push(r);
      listBox.appendChild(r);
    });
    elChantPanel.appendChild(listBox);

    var bar = elem('div', 'act');
    var b1 = elem('button', 'btn', '▶ Vòng 1 — Nghe & đọc theo');
    b1.type = 'button';
    var b2 = elem('button', 'btn ghost', '🙈 Vòng 2 — Giấu bớt từ');
    b2.type = 'button';
    var bStop = elem('button', 'btn ghost', '⏹ Dừng');
    bStop.type = 'button';
    var status = elem('span', 'muted', '');
    bar.appendChild(b1); bar.appendChild(b2); bar.appendChild(bStop); bar.appendChild(status);
    elChantPanel.appendChild(bar);

    function clearRows() {
      rows.forEach(function (r, i2) { r.classList.remove('on'); r.innerHTML = esc(sents[i2]); });
    }

    function maskRow(i2) {
      var words = sents[i2].split(' ');
      if (words.length < 3) return esc(sents[i2]);
      var mi = Math.floor(words.length / 2);
      var out = words.map(function (w, k) {
        return k === mi ? '<span class="chant-mask">' + '_'.repeat(Math.max(2, w.replace(/[.,!?]/g, '').length)) + '</span>' : esc(w);
      });
      return out.join(' ');
    }

    function run(masked) {
      chantStop = false;
      clearRows();
      if (masked) rows.forEach(function (r, i2) { r.innerHTML = maskRow(i2); });
      status.textContent = masked ? 'Vòng 2 — em đọc bù chỗ bị giấu nhé!' : 'Vòng 1 — nghe rồi đọc to theo Pi';
      if (!Say || !Say.available()) {
        status.textContent = 'Máy chưa có giọng đọc tiếng Anh — em vẫn đọc to theo chữ nhé!';
      }
      piMood('cheer');
      Say.speakSeq(sents, function (i2) {
        rows.forEach(function (r) { r.classList.remove('on'); });
        if (i2 >= 0 && rows[i2]) {
          rows[i2].classList.add('on');
          beep();
        } else {
          status.textContent = 'Xong vòng này rồi! 👏';
          piMood('happy');
        }
      }, { gap: 420 });
    }

    b1.addEventListener('click', function () { run(false); });
    b2.addEventListener('click', function () { run(true); });
    bStop.addEventListener('click', function () {
      chantStop = true;
      if (Say) Say.stop();
      clearRows();
      status.textContent = '';
      piMood('happy');
    });

    var back = elem('div', 'ex-nav bottom');
    var bh2 = elem('button', 'btn ghost nav-home', '← Trang chủ');
    bh2.type = 'button';
    bh2.addEventListener('click', function () { if (Say) Say.stop(); goHome(); });
    back.appendChild(bh2);
    elChantPanel.appendChild(back);
  }

  /* ================= khởi động ================= */

  var btnReset = document.getElementById('btn-reset-all');
  if (btnReset) {
    btnReset.addEventListener('click', function () {
      if (!window.confirm('Xoá toàn bộ tiến độ và lịch ôn đã lưu trên máy này?')) return;
      progress = {};
      try { window.localStorage.removeItem(STORE_KEY); } catch (e) {}
      if (SRS) SRS.reset();
      refreshMarks();
    });
  }

  var btnReviewNav = document.querySelectorAll('[data-nav="review-home"]');
  (function () {
    var i;
    for (i = 0; i < btnReviewNav.length; i++) {
      btnReviewNav[i].addEventListener('click', function () { if (Say) Say.stop(); goHome(); });
    }
  })();

  buildHome();
  route();
})();
