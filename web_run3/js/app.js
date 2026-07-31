/* Ngữ Pháp Vui 3 — bản luyện tập offline.
   JS thuần, không thư viện ngoài, chạy được bằng file://
   Dữ liệu: window.GRAMMAR3 (do build/embed.mjs sinh ra từ data/content.json).

   Hai màn (hash routing):
     #home    -> trang chủ (danh sách unit)
     #u2/2_2  -> màn làm bài
*/
(function () {
  'use strict';

  var DATA = window.GRAMMAR3;
  var STORE_KEY = 'nguphap3.progress.v1';
  var SVGNS = 'http://www.w3.org/2000/svg';

  var TYPE_VI = {
    gapfill: 'điền ô trống',
    dropdown: 'chọn trong ô',
    pickword: 'bấm chọn từ',
    group: 'phân nhóm',
    mcq: 'trắc nghiệm',
    matching: 'nối câu'
  };

  /* ================= helpers ================= */

  // elem(tag:string, cls?:string, txt?:string) -> HTMLElement
  function elem(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined && txt !== null) n.textContent = String(txt);
    return n;
  }

  // esc(s:string) -> string  (an toàn để nhét vào innerHTML)
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // rich(s:string) -> string  (escape hết, chỉ cho phép <i> <em> <b> <strong> <br>)
  function rich(s) {
    return esc(s).replace(/&lt;(\/?)(i|em|b|strong|br)\s*\/?&gt;/gi, function (_m, sl, tag) {
      return '<' + sl + tag.toLowerCase() + '>';
    });
  }

  // shuffled(arr:Array) -> Array (bản sao đã xáo)
  function shuffled(arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // range(n:number) -> Array<number>  ([0,1,...,n-1])
  function range(n) {
    var a = [], i;
    for (i = 0; i < n; i++) a.push(i);
    return a;
  }

  // normAns(s:string) -> string  (so đáp án: bỏ hoa/thường, chuẩn hoá nháy, gộp space)
  function normAns(s) {
    return String(s == null ? '' : s)
      .replace(/[‘’ʼ`´]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  // stripTags(s:string) -> string
  function stripTags(s) { return String(s == null ? '' : s).replace(/<[^>]*>/g, ''); }

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

  // exKey(unit:number, ex:object) -> string
  function exKey(unit, ex) { return 'u' + unit + '/' + ex.file; }

  // recordScore(unit:number, ex:object, score:number, max:number) -> void
  function recordScore(unit, ex, score, max) {
    var k = exKey(unit, ex);
    var cur = progress[k];
    if (!cur || typeof cur.best !== 'number' || score > cur.best) {
      progress[k] = { best: score, max: max };
      saveProgress(progress);
    } else if (cur.max !== max) {
      cur.max = max; saveProgress(progress);
    }
    refreshMarks();
  }

  /* ================= điểm tối đa thật của mỗi bài ================= */
  // `ex.points` lấy từ đĩa; với 3 bài "tìm lỗi trong đoạn văn" (U4/U5/U6 Ex3)
  // đĩa ghi points=1 dù có 6–8 từ phải bấm, nên ta tự đếm từ dữ liệu.
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

  /* ================= danh sách phẳng (để đi Bài trước / Bài sau) ================= */

  var FLAT = [];   // [{ui:number, ei:number}]
  DATA.units.forEach(function (u, ui) {
    u.exercises.forEach(function (ex, ei) { FLAT.push({ ui: ui, ei: ei }); });
  });

  // flatIndex(ui:number, ei:number) -> number
  function flatIndex(ui, ei) {
    var i;
    for (i = 0; i < FLAT.length; i++) if (FLAT[i].ui === ui && FLAT[i].ei === ei) return i;
    return -1;
  }

  /* ================= DOM gốc ================= */

  var elHome = document.getElementById('view-home');
  var elExView = document.getElementById('view-ex');
  var elCards = document.getElementById('cards');
  var elPanel = document.getElementById('panel');
  var elStat = document.getElementById('stat');

  var current = null;      // {ui:number, ei:number} bài đang mở
  var locked = false;      // đã bấm "Kiểm tra" -> khoá tương tác
  var grader = null;       // function() -> {score:number, note?:string}
  var relayoutHooks = [];  // các hàm cần gọi lại khi cửa sổ đổi kích thước

  window.addEventListener('resize', function () {
    var i;
    for (i = 0; i < relayoutHooks.length; i++) {
      try { relayoutHooks[i](); } catch (e) {}
    }
  });

  /* ================= trang chủ ================= */

  function buildHome() {
    elCards.textContent = '';
    DATA.units.forEach(function (u, ui) {
      var card = elem('article', 'card');

      var h = elem('div', 'card-h');
      h.appendChild(elem('span', 'card-n', u.label));
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
  }

  /* ================= điều hướng ================= */

  // goHome() -> void
  function goHome() {
    if ((window.location.hash || '') === '#home') showHome();
    else window.location.hash = 'home';
  }

  // goExercise(ui:number, ei:number) -> void
  function goExercise(ui, ei) {
    var u = DATA.units[ui], ex = u.exercises[ei];
    var h = '#u' + u.unit + '/' + ex.file;
    if ((window.location.hash || '') === h) openExercise(ui, ei);
    else window.location.hash = h.slice(1);
  }

  function showHome() {
    current = null;
    grader = null;
    relayoutHooks = [];
    elExView.hidden = true;
    elHome.hidden = false;
    refreshMarks();
    window.scrollTo(0, 0);
  }

  function route() {
    var m = /^#?u(\d+)\/(.+)$/.exec(window.location.hash || '');
    if (m) {
      var un = parseInt(m[1], 10), file = m[2], ui, ei;
      for (ui = 0; ui < DATA.units.length; ui++) {
        if (DATA.units[ui].unit !== un) continue;
        for (ei = 0; ei < DATA.units[ui].exercises.length; ei++) {
          if (DATA.units[ui].exercises[ei].file === file) { openExercise(ui, ei); return; }
        }
      }
    }
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
    locked = false;
    grader = null;
    relayoutHooks = [];

    elHome.hidden = true;
    elExView.hidden = false;
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

    /* --- ảnh --- */
    if (ex.images && ex.images.length) {
      var pics = elem('div', 'pics');
      ex.images.forEach(function (im) {
        var img = elem('img');
        img.src = 'img/' + im.file;
        img.alt = 'Hình minh hoạ ' + im.file;
        if (im.w) img.width = im.w;
        if (im.h) img.height = im.h;
        img.loading = 'lazy';
        pics.appendChild(img);
      });
      elPanel.appendChild(pics);
    }

    /* --- thân bài --- */
    var body = elem('div', 'body');
    elPanel.appendChild(body);
    try {
      if (ex.type === 'gapfill') grader = buildGapfill(ex, body);
      else if (ex.type === 'dropdown') grader = buildDropdown(ex, body);
      else if (ex.type === 'pickword') grader = buildPickword(ex, body);
      else if (ex.type === 'group') grader = buildGroup(ex, body);
      else if (ex.type === 'mcq') grader = buildMcq(ex, body);
      else if (ex.type === 'matching') grader = buildMatching(ex, body);
      else body.appendChild(elem('p', 'muted', 'Dạng bài chưa hỗ trợ: ' + ex.type));
    } catch (err) {
      body.appendChild(elem('p', 'muted', 'Lỗi hiển thị bài: ' + err.message));
      if (window.console) window.console.error(err);
    }

    /* --- thanh hành động --- */
    var act = elem('div', 'act');
    var bCheck = elem('button', 'btn', 'Kiểm tra');
    bCheck.type = 'button';
    var bAgain = elem('button', 'btn ghost', 'Làm lại');
    bAgain.type = 'button';
    var res = elem('span', 'result', '');
    var best = elem('span', 'best', '');
    var rec = progress[exKey(u.unit, ex)];
    best.textContent = rec ? 'Điểm cao nhất: ' + rec.best + '/' + mx : 'Chưa làm bài này';

    bCheck.addEventListener('click', function () {
      if (locked || !grader) return;
      var r = grader();
      locked = true;
      lockAll(body);
      bCheck.disabled = true;
      res.textContent = 'Điểm: ' + r.score + '/' + mx + (r.note ? ' · ' + r.note : '') +
        (r.score >= mx ? ' — Tuyệt vời! ✓' : ' — Xem chỗ tô cam để sửa');
      res.className = 'result ' + (r.score >= mx ? 'pass' : 'part');
      recordScore(u.unit, ex, r.score, mx);
      var rec2 = progress[exKey(u.unit, ex)];
      best.textContent = 'Điểm cao nhất: ' + rec2.best + '/' + mx;
    });
    bAgain.addEventListener('click', function () { openExercise(ui, ei); });

    act.appendChild(bCheck);
    act.appendChild(bAgain);
    act.appendChild(res);
    act.appendChild(best);
    elPanel.appendChild(act);

    window.scrollTo(0, 0);
  }

  // lockAll(root:HTMLElement) -> void  (khoá mọi control sau khi chấm)
  function lockAll(root) {
    var i, ns = root.querySelectorAll('button, input, select');
    for (i = 0; i < ns.length; i++) {
      ns[i].disabled = true;
      ns[i].draggable = false;
    }
  }

  /* ============ token text dùng chung ============ */
  // addText(host:HTMLElement, s:string) -> void
  function addText(host, s) {
    host.appendChild(document.createTextNode(String(s == null ? '' : s)));
  }

  /* ================= 1. gapfill ================= */
  // Hai biến thể: có `wordpool` -> kéo-thả / bấm-để-điền; không có -> gõ chữ.
  function buildGapfill(ex, host) {
    var d = ex.data;
    var hasPool = !!(d.wordpool && d.wordpool.length);
    var gaps = [];      // {ans:string, node:HTMLElement, chip:number|null}
    var chips = [];      // {word:string, node:HTMLElement, gap:number|null}
    var selChip = -1;
    var maxLen = 1;

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

    d.lines.forEach(function (line) {
      var row = elem('div', 'line');
      line.forEach(function (tk) {
        if (tk.gap !== undefined) {
          if (hasPool) {
            var b = elem('span', 'blank empty');
            b.tabIndex = 0;
            var gi = gaps.length;
            gaps.push({ ans: String(tk.gap), node: b, chip: null });
            b.addEventListener('click', function () { onBlankClick(gi); });
            b.addEventListener('keydown', function (e) {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onBlankClick(gi); }
            });
            b.addEventListener('dragover', function (e) { if (!locked) { e.preventDefault(); b.classList.add('over'); } });
            b.addEventListener('dragleave', function () { b.classList.remove('over'); });
            b.addEventListener('drop', function (e) {
              e.preventDefault(); b.classList.remove('over');
              if (locked) return;
              var ci = parseInt(e.dataTransfer.getData('text/plain'), 10);
              if (!isNaN(ci) && chips[ci]) place(ci, gi);
            });
            row.appendChild(b);
          } else {
            var inp = elem('input', 'gap');
            inp.type = 'text';
            inp.autocomplete = 'off';
            inp.spellcheck = false;
            inp.size = Math.min(26, Math.max(8, maxLen + 2)); // cùng cỡ -> không lộ độ dài đáp án
            gaps.push({ ans: String(tk.gap), node: inp, chip: null });
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
          if (locked) return;
          if (selChip === ci) { selChip = -1; }
          else { selChip = ci; }
          syncChips();
        });
        c.addEventListener('dragstart', function (e) {
          if (locked) { e.preventDefault(); return; }
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
      gaps.forEach(function (g) { g.node.classList.toggle('target', selChip >= 0 && g.chip === null); });
    }

    // place(ci:number, gi:number) -> void
    function place(ci, gi) {
      var g = gaps[gi], c = chips[ci];
      if (g.chip !== null) { chips[g.chip].gap = null; }      // trả từ cũ về kho
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
      if (locked) return;
      if (selChip >= 0) { place(selChip, gi); return; }
      var g = gaps[gi];
      if (g.chip !== null) { chips[g.chip].gap = null; g.chip = null; paint(gi); syncChips(); }
    }

    return function grade() {
      var score = 0;
      gaps.forEach(function (g) {
        var val = hasPool ? (g.chip === null ? '' : chips[g.chip].word) : g.node.value;
        var ok = val !== '' && normAns(val) === normAns(g.ans);
        g.node.classList.add(ok ? 'ok' : 'bad');
        if (ok) score++;
        else {
          var tag = elem('span', 'ans', g.ans);
          if (g.node.parentNode) g.node.parentNode.insertBefore(tag, g.node.nextSibling);
        }
      });
      return { score: score };
    };
  }

  /* ================= 2. dropdown ================= */
  function buildDropdown(ex, host) {
    var items = [];   // {sel:HTMLSelectElement, answer:number}
    ex.data.lines.forEach(function (line) {
      var row = elem('div', 'line');
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
          items.push({ sel: s, answer: tk.dd.answer, choices: tk.dd.choices });
          row.appendChild(s);
        } else {
          addText(row, tk.text);
        }
      });
      host.appendChild(row);
    });

    return function grade() {
      var score = 0;
      items.forEach(function (it) {
        var v = it.sel.value === '' ? -1 : parseInt(it.sel.value, 10);
        var ok = v === it.answer;
        it.sel.classList.add(ok ? 'ok' : 'bad');
        if (ok) score++;
        else {
          var tag = elem('span', 'ans', it.choices[it.answer]);
          if (it.sel.parentNode) it.sel.parentNode.insertBefore(tag, it.sel.nextSibling);
        }
      });
      return { score: score };
    };
  }

  /* ================= 3. pickword ================= */
  // Hai chế độ:
  //  - 'one'  : mỗi câu đúng 1 từ phải bấm (chọn kiểu radio trong từng câu)
  //  - 'many' : cả đoạn văn có N từ phải bấm (bật/tắt tự do)
  function buildPickword(ex, host) {
    var sents = ex.data.sentences;
    var perSent = sents.map(function (s) {
      return s.filter(function (t) { return t.sel && t.sel.correct; }).length;
    });
    var mode = (sents.length > 1 && perSent.every(function (n) { return n === 1; })) ? 'one' : 'many';
    var words = [];   // {si:number, correct:boolean, node:HTMLElement, on:boolean}

    sents.forEach(function (s, si) {
      var row = elem('div', sents.length === 1 ? 'para' : 'line');
      s.forEach(function (tk) {
        if (tk.sel) {
          var b = elem('button', 'word', tk.sel.word);
          b.type = 'button';
          var wi = words.length;
          words.push({ si: si, correct: !!tk.sel.correct, node: b, on: false });
          b.addEventListener('click', function () {
            if (locked) return;
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

    return function grade() {
      var score = 0, wrong = 0;
      if (mode === 'one') {
        sents.forEach(function (_s, si) {
          var group = words.filter(function (w) { return w.si === si; });
          var chosen = group.filter(function (w) { return w.on; })[0] || null;
          var right = group.filter(function (w) { return w.correct; })[0] || null;
          if (chosen && chosen.correct) { chosen.node.classList.add('ok'); score++; }
          else {
            if (chosen) chosen.node.classList.add('bad');
            if (right) right.node.classList.add('miss');
          }
        });
      } else {
        words.forEach(function (w) {
          if (w.on && w.correct) { w.node.classList.add('ok'); score++; }
          else if (w.on && !w.correct) { w.node.classList.add('bad'); wrong++; }
          else if (!w.on && w.correct) { w.node.classList.add('miss'); }
        });
        score = Math.max(0, score - wrong);
      }
      return {
        score: score,
        note: (mode === 'many')
          ? (wrong ? 'bấm sai ' + wrong + ' từ (bị trừ điểm); chỗ viền xanh là từ còn thiếu' : '')
          : ''
      };
    };
  }

  /* ================= 4. group ================= */
  function buildGroup(ex, host) {
    var groups = ex.data.groups;
    var items = [];   // {text:string, gi:number, node:HTMLElement, at:number|null}
    var selItem = -1;

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
        if (locked) return;
        if (e.target !== z) return;              // bấm vào item -> để item tự xử lý
        if (selItem >= 0) moveTo(selItem, gi);
      });
      z.addEventListener('dragover', function (e) { if (!locked) { e.preventDefault(); z.classList.add('over'); } });
      z.addEventListener('dragleave', function () { z.classList.remove('over'); });
      z.addEventListener('drop', function (e) {
        e.preventDefault(); z.classList.remove('over');
        if (locked) return;
        var ii = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!isNaN(ii) && items[ii]) moveTo(ii, gi);
      });
      zones.push(z);
      col.appendChild(z);
      grid.appendChild(col);
    });
    host.appendChild(grid);

    tray.addEventListener('click', function (e) {
      if (locked) return;
      if (e.target !== tray) return;
      if (selItem >= 0) moveTo(selItem, null);
    });
    tray.addEventListener('dragover', function (e) { if (!locked) { e.preventDefault(); tray.classList.add('over'); } });
    tray.addEventListener('dragleave', function () { tray.classList.remove('over'); });
    tray.addEventListener('drop', function (e) {
      e.preventDefault(); tray.classList.remove('over');
      if (locked) return;
      var ii = parseInt(e.dataTransfer.getData('text/plain'), 10);
      if (!isNaN(ii) && items[ii]) moveTo(ii, null);
    });

    // gom mọi item của mọi nhóm rồi xáo trộn
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
        if (locked) return;
        if (items[ii].at !== null) { moveTo(ii, null); return; }   // lấy ra khỏi nhóm
        selItem = (selItem === ii) ? -1 : ii;
        syncSel();
      });
      b.addEventListener('dragstart', function (e) {
        if (locked) { e.preventDefault(); return; }
        e.dataTransfer.setData('text/plain', String(ii));
        e.dataTransfer.effectAllowed = 'move';
        selItem = ii; syncSel();
      });
      tray.appendChild(b);
    });

    function syncSel() {
      items.forEach(function (it, i) { it.node.classList.toggle('sel', i === selItem); });
    }

    // moveTo(ii:number, gi:number|null) -> void
    function moveTo(ii, gi) {
      var it = items[ii];
      it.at = gi;
      (gi === null ? tray : zones[gi]).appendChild(it.node);
      selItem = -1;
      syncSel();
    }

    return function grade() {
      var score = 0;
      items.forEach(function (it) {
        var ok = it.at === it.gi;
        it.node.classList.add(ok ? 'ok' : 'bad');
        if (ok) score++;
        else {
          var tag = elem('span', 'ans', stripTags(groups[it.gi].title));
          tag.style.fontSize = '.78em';
          if (it.node.parentNode) it.node.parentNode.insertBefore(tag, it.node.nextSibling);
        }
      });
      return { score: score };
    };
  }

  /* ================= 5. mcq ================= */
  function buildMcq(ex, host) {
    var qs = ex.data.questions;
    var picks = qs.map(function () { return -1; });
    var nodes = [];   // nodes[qi][ci]

    qs.forEach(function (q, qi) {
      var box = elem('div', 'q');
      var p = elem('p', 'q-t');
      p.innerHTML = rich(q.text);
      box.appendChild(p);
      var opts = elem('div', 'opts');
      nodes[qi] = [];
      q.choices.forEach(function (ch, ci) {
        var b = elem('button', 'opt', ch);
        b.type = 'button';
        b.addEventListener('click', function () {
          if (locked) return;
          picks[qi] = ci;
          nodes[qi].forEach(function (n, i) { n.classList.toggle('sel', i === ci); });
        });
        nodes[qi].push(b);
        opts.appendChild(b);
      });
      box.appendChild(opts);
      host.appendChild(box);
    });

    return function grade() {
      var score = 0;
      qs.forEach(function (q, qi) {
        var pick = picks[qi];
        if (pick === q.answer) { nodes[qi][pick].classList.add('ok'); score++; }
        else {
          if (pick >= 0) nodes[qi][pick].classList.add('bad');
          nodes[qi][q.answer].classList.add('miss');
        }
      });
      return { score: score };
    };
  }

  /* ================= 6. matching (game nối câu) =================
     - cột trái giữ thứ tự, cột phải xáo trộn
     - nối bằng cách kéo một đường (pointer events: chuột + cảm ứng)
       hoặc bấm ô trái rồi bấm ô phải
     - đường nối vẽ bằng SVG overlay, vẽ lại khi resize                              */
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

    var leftNodes = [];    // leftNodes[p]  (p = chỉ số cặp)
    var rightNodes = [];   // rightNodes[p]
    var link = [];         // link[pTrái] = pPhải đang nối, -1 = chưa nối
    var mark = [];         // '' | 'good' | 'bad'  (sau khi Kiểm tra)
    var sel = null;        // ô đang sáng (chờ bấm ô đối diện)
    var i;
    for (i = 0; i < n; i++) { link.push(-1); mark.push(''); }

    for (i = 0; i < n; i++) mk('L', i, colL);
    shuffled(range(n)).forEach(function (p) { mk('R', p, colR); });

    // mk(side:'L'|'R', p:number, col:HTMLElement) -> void
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

    /* ---- kéo đường ---- */
    var drag = null;   // {el:HTMLElement, x0:number, y0:number, moved:boolean, pid:number}

    function onDown(e) {
      if (locked || drag) return;                 // đang kéo rồi thì bỏ qua ngón thứ hai
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      var el = e.currentTarget;
      drag = { el: el, x0: e.clientX, y0: e.clientY, moved: false, pid: e.pointerId };
      // pointer capture giữ được chuỗi event khi con trỏ ra ngoài ô;
      // nghe ở document để nếu capture thất bại thì vẫn nhận được pointerup.
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
      document.addEventListener('pointermove', onMove, true);
      document.addEventListener('pointerup', onUp, true);
      document.addEventListener('pointercancel', onCancel, true);
      e.preventDefault();      // không cho chọn chữ / cuộn trang khi kéo
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

    function endDrag(e) {
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
      var d = endDrag(e);
      if (!d || locked) { sync(); return; }
      var end = itemFromPoint(e.clientX, e.clientY);
      if (end && end !== d.el && end.dataset.side !== d.el.dataset.side) {
        connect(d.el, end);
        sel = null;
      } else if (!d.moved) {
        tap(d.el);
        return;                // tap() đã sync
      }
      sync();
    }

    function onCancel(e) {
      endDrag(e);
      sync();
    }

    // itemFromPoint(x:number, y:number) -> HTMLElement|null
    function itemFromPoint(x, y) {
      var el = document.elementFromPoint(x, y);
      while (el && el !== document.body) {
        if (el.classList && el.classList.contains('mitem') && box.contains(el)) return el;
        el = el.parentNode;
      }
      return null;
    }

    /* ---- bấm-trái-rồi-bấm-phải ---- */
    // tap(el:HTMLElement) -> void
    function tap(el) {
      if (locked) return;
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

    // connect(a:HTMLElement, b:HTMLElement) -> void  (một ô chỉ có một đường)
    function connect(a, b) {
      var L = (a.dataset.side === 'L') ? a : b;
      var R = (a.dataset.side === 'L') ? b : a;
      var lp = parseInt(L.dataset.p, 10), rp = parseInt(R.dataset.p, 10);
      var k;
      for (k = 0; k < n; k++) if (link[k] === rp) link[k] = -1;   // ô phải đã có đường -> bỏ
      link[lp] = rp;
    }

    /* ---- vẽ ---- */
    // anchorOf(el:HTMLElement, br:DOMRect) -> {x:number, y:number}
    function anchorOf(el, br) {
      var r = el.getBoundingClientRect();
      var x = (el.dataset.side === 'L') ? r.right : r.left;
      return { x: x - br.left, y: r.top + r.height / 2 - br.top };
    }

    // line(a:{x,y}, b:{x,y}, cls:string) -> void
    function line(a, b, cls) {
      var ln = document.createElementNS(SVGNS, 'line');
      ln.setAttribute('x1', a.x); ln.setAttribute('y1', a.y);
      ln.setAttribute('x2', b.x); ln.setAttribute('y2', b.y);
      ln.setAttribute('class', 'ml ' + cls);
      svg.appendChild(ln);
    }

    // dot(p:{x,y}, cls:string) -> void
    function dot(p, cls) {
      var c = document.createElementNS(SVGNS, 'circle');
      c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', 4);
      c.setAttribute('class', 'md ' + cls);
      svg.appendChild(c);
    }

    // draw(temp?:{a:{x,y}, b:{x,y}}) -> void
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

    return function grade() {
      var score = 0, k;
      for (k = 0; k < n; k++) {
        if (link[k] === k) {
          mark[k] = 'good';
          score++;
          leftNodes[k].classList.add('ok');
          rightNodes[k].classList.add('ok');
        } else {
          mark[k] = 'bad';
          leftNodes[k].classList.add('bad');
          if (link[k] >= 0) rightNodes[link[k]].classList.add('bad');
          rightNodes[k].classList.add('miss');
          // hiện nửa đúng ngay dưới nửa câu bên trái
          var tag = elem('span', 'ans mans');
          tag.innerHTML = rich(pairs[k].right);
          if (leftNodes[k].parentNode) {
            leftNodes[k].parentNode.insertBefore(tag, leftNodes[k].nextSibling);
          }
        }
      }
      draw();
      if (window.requestAnimationFrame) window.requestAnimationFrame(function () { draw(); });
      return { score: score };
    };
  }

  /* ================= khởi động ================= */

  document.getElementById('btn-reset-all').addEventListener('click', function () {
    if (!window.confirm('Xoá toàn bộ tiến độ đã lưu trên máy này?')) return;
    progress = {};
    try { window.localStorage.removeItem(STORE_KEY); } catch (e) {}
    refreshMarks();
  });

  buildHome();
  route();
})();
