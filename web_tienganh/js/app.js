/*
 * app.js — Điều hướng + render màn hình cho "Học tiếng Anh cùng Pi".
 * ----------------------------------------------------------------------------
 * Kết nối: Content JSON (content/ hoặc window.ContentData) + Engine (window.Engine)
 *          + Progress (window.Progress) + TTS (window.TTS).
 * Màn theo UX_FLOWS: S0 onboarding, S1 chọn hồ sơ, S2 bản đồ unit, S3 menu unit,
 *   S4 flashcard, S5 luyện tập, S6 nói (không chấm), S7 kết quả, S8 phụ huynh, S9 cài đặt.
 * UI tiếng Việt; mọi đề EN có nút loa; nút to; WCAG AA; offline-first.
 *
 * Lưu ý offline (file://): fetch JSON có thể bị chặn → rơi về window.ContentData (nhúng).
 */
(function () {
  'use strict';

  var Engine = window.Engine, Progress = window.Progress, TTS = window.TTS;

  /* ===================== HẰNG / CẤU HÌNH ===================== */
  var AVATARS = ['🦊','🐱','🐼','🐶','🐯','🐧','🐰','🐨','🦁','🐸','🦉','🐢','🐝','🦄','🐙','🐳'];
  var TOPIC_PALETTE = ['mint', 'sky', 'grape', 'coral', 'sun'];
  var PRAISE_OK = ['Đúng rồi! 🎉', 'Chuẩn luôn!', 'Em nhớ tốt ghê!', 'Tuyệt vời!'];
  var PRAISE_TRY = ['Gần đúng rồi, thử lại nhé!', 'Không sao đâu, cùng nghe lại nào.', 'Sắp được rồi! Mình xem đáp án đúng nhé.'];
  var EXERCISES_PER_STAGE = 6;       // số câu một chặng luyện tập
  var STAGES_BEFORE_BREAK = 3;       // điểm dừng tích cực sau N chặng
  var MASTERY_UNLOCK = 1;            // unit kế mở khi unit trước có completion (đã làm xong vocab)

  /* ===================== TRẠNG THÁI PHIÊN ===================== */
  var state = {
    childId: null,
    levelIndex: null,      // index.json của level1
    units: {},             // unit number -> unit JSON đã nạp
    mastery: null,         // cache getMastery
    currentUnit: null,     // unit number đang ở
    stagesThisSession: 0,  // đếm chặng để gợi nghỉ
    settings: loadSettings()
  };

  /* ===================== DOM TIỆN ÍCH ===================== */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k === 'style') n.setAttribute('style', attrs[k]);
      else if (k.slice(0, 2) === 'on' && typeof attrs[k] === 'function') n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
    if (children != null) appendKids(n, children);
    return n;
  }
  function appendKids(n, children) {
    if (Array.isArray(children)) children.forEach(function (c) { appendKids(n, c); });
    else if (children instanceof Node) n.appendChild(children);
    else if (children != null) n.appendChild(document.createTextNode(String(children)));
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function piNode(classExtra) {
    var t = document.getElementById('tpl-pi');
    var node = t.content.firstElementChild.cloneNode(true);
    if (classExtra) node.className = node.className + ' ' + classExtra;
    return node;
  }

  /* ===================== TTS (loa) ===================== */
  var ttsWarned = false;
  function showTtsWarn() {
    // Nếu đang dùng GIỌNG TẢI SẴN (baked) thì đọc được mọi máy → KHÔNG cảnh báo.
    if (window.AudioPlay && AudioPlay.usingBaked && AudioPlay.usingBaked()) return;
    if (ttsWarned) return; ttsWarned = true;
    var main = $('#main');
    if (!main) return;
    var bar = el('div', { class: 'tts-warn', role: 'status' },
      ['⚠️ ', 'Máy chưa có giọng tiếng Anh — chọn "Giọng tải sẵn" trong Cài đặt, hoặc em vẫn xem chữ và học được nhé.']);
    main.insertBefore(bar, main.firstChild);
  }
  // Phát âm: ưu tiên AudioPlay (mp3 baked + fallback TTS), nếu chưa có thì dùng TTS trực tiếp.
  function audioEngine() { return window.AudioPlay || (window.TTS ? { play: TTS.speak, cancel: TTS.cancel } : null); }
  function speak(text, opts) {
    if (!text) return;
    opts = opts || {};
    var btn = opts.btn;
    if (btn) btn.classList.add('is-playing');
    var eng = audioEngine();
    if (!eng) { if (btn) btn.classList.remove('is-playing'); return; }
    eng.play(text, {
      slow: opts.slow,
      onend: function () { if (btn) btn.classList.remove('is-playing'); },
      onerror: function () { if (btn) btn.classList.remove('is-playing'); }
    });
  }
  // Nút loa tái dùng (đọc 1 chuỗi EN). label cho screen reader.
  function speakerBtn(text, label, opts) {
    opts = opts || {};
    var b = el('button', {
      class: 'icon-btn' + (opts.accent ? ' icon-btn--accent' : '') + (opts.lg ? ' icon-btn--lg' : ''),
      type: 'button',
      'aria-label': label || ('Nghe: ' + text)
    }, opts.glyph || '🔊');
    b.addEventListener('click', function (e) { e.stopPropagation(); speak(text, { btn: b, slow: opts.slow }); });
    return b;
  }
  // Nút loa "Nghe câu đúng" trong phản hồi SAI: khi trẻ chủ động nghe lại,
  // đánh dấu reviewedWrong (mỗi câu chỉ tính 1 lần) → góp phần lên 3 sao "học từ lỗi".
  function reviewSpeakerBtn(sess, text, label) {
    var counted = false;
    var b = speakerBtn(text, label || ('Nghe: ' + text), { accent: true });
    b.addEventListener('click', function () {
      if (!counted) { counted = true; if (sess) sess.reviewedWrong = (sess.reviewedWrong || 0) + 1; }
    });
    return b;
  }

  /* ===================== SAO ===================== */
  function starsRow(filled, total, sizeClass) {
    total = total || 3;
    var wrap = el('span', { class: 'stars' + (sizeClass ? ' ' + sizeClass : ''), 'aria-label': filled + ' trên ' + total + ' sao' });
    var t = document.getElementById('tpl-star');
    for (var i = 0; i < total; i++) {
      var s = t.content.firstElementChild.cloneNode(true);
      if (i < filled) s.classList.add('is-on');
      wrap.appendChild(s);
    }
    return wrap;
  }

  /* ===================== CONFETTI / TOAST / CELEBRATE ===================== */
  function confettiBurst(host) {
    if (prefersReduced() || state.settings.motion === false) return;
    var burst = el('div', { class: 'confetti-burst', 'aria-hidden': 'true' });
    for (var i = 0; i < 16; i++) {
      var p = el('div', { class: 'confetti-piece',
        style: 'left:' + (5 + Math.random() * 90) + '%;--x:' + Math.round((Math.random() * 160 - 80)) + 'px;animation-delay:' + (Math.random() * 200) + 'ms' });
      burst.appendChild(p);
    }
    (host || document.getElementById('fx')).appendChild(burst);
    setTimeout(function () { if (burst.parentNode) burst.parentNode.removeChild(burst); }, 1600);
  }
  function toast(text, emoji) {
    var fx = document.getElementById('fx');
    var t = el('div', { class: 'toast', role: 'status' }, [el('span', { class: 'pi-mini' }, emoji || '🏅'), el('span', null, text)]);
    fx.appendChild(t);
    setTimeout(function () { if (t.parentNode) { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 420); } }, 2600);
  }
  function prefersReduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ===================== CÀI ĐẶT (S9) ===================== */
  function loadSettings() {
    var def = { autoRead: true, sound: true, motion: !prefersReduced(), speed: 'normal', voice: 'en-GB', contrast: 'normal', fontSize: 'normal' };
    try {
      var raw = localStorage.getItem('enkids_settings');
      if (raw) { var s = JSON.parse(raw); for (var k in def) if (s[k] !== undefined) def[k] = s[k]; }
    } catch (e) {}
    return def;
  }
  function saveSettings() {
    try { localStorage.setItem('enkids_settings', JSON.stringify(state.settings)); } catch (e) {}
  }
  function applySettings() {
    var s = state.settings;
    document.documentElement.setAttribute('data-contrast', s.contrast === 'high' ? 'high' : 'normal');
    document.documentElement.setAttribute('data-motion', s.motion === false ? 'off' : 'on');
    document.documentElement.style.fontSize = (s.fontSize === 'large') ? '20px' : '';
    if (TTS) {
      TTS.setEnabled(s.sound);
      TTS.setSpeed(s.speed);
      TTS.setVoicePref(s.voice);
    }
  }

  /* ===================== NẠP NỘI DUNG ===================== */
  // Ưu tiên fetch (HTTP); rơi về window.ContentData (file://). Trả Promise.
  function loadJson(relPath) {
    var embedded = (window.ContentData && window.ContentData[relPath]) || null;
    // Trên file:// fetch luôn lỗi (CORS/scheme) và in lỗi đỏ ở console — nếu đã có bản
    // nhúng thì trả thẳng, giữ console sạch cho QA. HTTP vẫn fetch-first để lấy bản mới.
    if (location.protocol === 'file:' && embedded) return Promise.resolve(embedded);
    return fetch('content/' + relPath, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .catch(function () {
        if (embedded) return embedded;
        throw new Error('Không nạp được nội dung: ' + relPath);
      });
  }
  function loadLevelIndex() {
    if (state.levelIndex) return Promise.resolve(state.levelIndex);
    return loadJson('level1/index.json').then(function (j) { state.levelIndex = j; return j; });
  }
  function loadUnit(unitNo) {
    if (state.units[unitNo]) return Promise.resolve(state.units[unitNo]);
    return loadLevelIndex().then(function (idx) {
      // unit < 100 = unit nhỏ gốc; unit >= 101 = BÀI LỚN (lesson). Tìm ở cả hai.
      var all = (idx.units || []).concat(idx.lessons || []);
      var meta = all.filter(function (u) { return u.unit === unitNo; })[0];
      if (!meta) throw new Error('Không có unit ' + unitNo);
      return loadJson('level1/' + meta.file).then(function (j) { state.units[unitNo] = j; return j; });
    });
  }
  function lessonMetaByUnit(unitNo) {
    var idx = state.levelIndex; if (!idx) return null;
    return (idx.lessons || []).filter(function (l) { return l.unit === unitNo; })[0] || null;
  }
  function isLessonUnit(unitNo) { return unitNo >= 100; }
  // Back từ menu: nếu đang ở unit nhỏ mở từ "luyện tập thêm" → về bài lớn; ngược lại về bản đồ.
  function backFromMenu(unitNo) {
    if (!isLessonUnit(unitNo) && state.returnLesson != null) {
      var r = state.returnLesson; state.returnLesson = null; state.currentUnit = r; go('S3');
    } else { go('S2'); }
  }
  function refreshMastery() {
    if (!state.childId) { state.mastery = null; return Promise.resolve(null); }
    return Progress.getMastery(state.childId).then(function (m) { state.mastery = m; return m; });
  }
  function unitMastery(unitNo) {
    if (!state.mastery) return null;
    return (state.mastery.units || []).filter(function (u) { return u.unit === unitNo && u.level === 1; })[0] || null;
  }

  /* ===================== HEADER ===================== */
  function setHeader(opts) {
    opts = opts || {};
    var hdr = $('#appHeader');
    if (opts.hidden) { hdr.hidden = true; return; }
    hdr.hidden = false;
    var hTitle = $('#hdrTitle');
    var titleText = opts.title || 'Học tiếng Anh';
    hTitle.textContent = titleText;
    // title= để xem đầy đủ khi tiêu đề bị cắt ellipsis trên màn hẹp.
    hTitle.setAttribute('title', titleText);
    var back = $('#btnBack');
    back.style.visibility = opts.onBack ? 'visible' : 'hidden';
    back.setAttribute('aria-label', opts.backLabel || 'Quay lại');
    back.onclick = opts.onBack || null;
    var sp = $('#btnSpeakScreen');
    if (opts.speakText) { sp.style.visibility = 'visible'; sp.onclick = function () { speak(opts.speakText, { btn: sp }); }; }
    else { sp.style.visibility = 'hidden'; sp.onclick = null; }
    var av = $('#btnAvatar');
    var child = currentChild();
    av.textContent = child ? child.avatar : '🦊';
    av.onclick = function () { go('S1'); };
    av.style.visibility = opts.hideAvatar ? 'hidden' : 'visible';
  }
  function currentChild() {
    if (!state.childId) return null;
    var list = Progress.listChildren();
    return list.filter(function (c) { return c.childId === state.childId; })[0] || null;
  }

  /* ===================== RENDER KHUNG MÀN ===================== */
  function render(node) {
    var main = $('#main');
    clear(main);
    ttsWarned = false;
    main.appendChild(node);
    if (TTS && !TTS.hasEnglishVoice()) showTtsWarn();
    window.scrollTo(0, 0);
    focusNewScreen(main);
  }
  // Chuyển focus về đầu màn mới (ưu tiên h1/h2) để screen reader đọc ngữ cảnh
  // thay cho aria-live toàn trang. Không kích hoạt cuộn lạ (preventScroll).
  function focusNewScreen(main) {
    try {
      var target = main.querySelector('h1, h2, .title, .celebrate__title') || main;
      if (target !== main && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    } catch (e) { try { main.focus(); } catch (e2) {} }
  }
  function autoRead(text) {
    if (state.settings.autoRead && text) setTimeout(function () { speak(text); }, 350);
  }

  /* =====================================================================
     S0 — ONBOARDING (lần đầu / chưa có hồ sơ)
     ===================================================================== */
  function screenOnboarding() {
    setHeader({ hidden: true });
    var sel = { avatar: '🦊', name: '' };

    var avatarGrid = el('div', { class: 'avatar-grid' });
    AVATARS.forEach(function (a) {
      var b = el('button', { class: 'avatar-pick' + (a === sel.avatar ? ' is-sel' : ''), type: 'button', 'aria-label': 'Chọn ' + a }, a);
      b.addEventListener('click', function () {
        sel.avatar = a;
        Array.prototype.forEach.call(avatarGrid.children, function (c) { c.classList.remove('is-sel'); });
        b.classList.add('is-sel');
      });
      avatarGrid.appendChild(b);
    });

    var nameInput = el('input', { class: 'field', type: 'text', maxlength: '20', placeholder: 'Bé 1', 'aria-label': 'Tên gọi (không bắt buộc)' });

    var node = el('div', { class: 'screen stack-lg', style: 'padding-top:var(--sp-6)' }, [
      el('div', { class: 'row', style: 'justify-content:center;gap:var(--sp-4)' }, [
        piNode('mascot--lg'),
        el('div', { class: 'speech' }, [document.createTextNode('Chào bạn nhỏ! Mình là '), el('b', { class: 'speech__hi' }, 'Pi 🦊')])
      ]),
      el('div', { class: 'card stack' }, [
        el('h1', { class: 'title text-center' }, 'Chọn bạn đồng hành của em'),
        avatarGrid,
        el('label', { class: 'subtitle', style: 'margin-top:var(--sp-3)' }, 'Tên gọi (không bắt buộc):'),
        nameInput,
        el('button', { class: 'btn btn--cta btn--block', type: 'button', onclick: function () {
          var id = Progress.createChild(nameInput.value, sel.avatar);
          state.childId = id;
          Progress.setActiveChild(id);
          go('S2');
        } }, 'Xong, bắt đầu học! 🚀')
      ])
    ]);
    render(node);
  }

  /* =====================================================================
     S1 — CHỌN HỒ SƠ CON
     ===================================================================== */
  function screenProfiles() {
    var children = Progress.listChildren();
    if (children.length === 0) { screenOnboarding(); return; }

    setHeader({ title: 'Chọn hồ sơ', onBack: state.childId ? function () { go('S2'); } : null, hideAvatar: true });

    var list = el('div', { class: 'stack' });
    children.forEach(function (c) {
      var card = el('button', { class: 'profile-card', type: 'button' }, [
        el('span', { class: 'profile-card__avatar' }, c.avatar),
        el('span', { class: 'grow' }, [
          el('div', { style: 'font-family:var(--font-display);font-weight:var(--fw-black);font-size:var(--fs-lg)' }, c.name),
          el('div', { class: 'muted', style: 'font-size:var(--fs-sm)' }, 'Đã học ' + c.unitsLearned + ' chủ đề')
        ])
      ]);
      card.addEventListener('click', function () {
        state.childId = c.childId;
        Progress.setActiveChild(c.childId);
        go('S2');
      });
      list.appendChild(card);
    });

    var addBtn = el('button', { class: 'btn btn--ghost btn--block', type: 'button', onclick: function () { miniAddChild(); } }, '+ Thêm bé');

    render(el('div', { class: 'screen stack-lg' }, [
      el('div', { class: 'row', style: 'justify-content:center' }, [piNode('mascot--sm'), el('h1', { class: 'title' }, 'Ai đang học nào?')]),
      list,
      addBtn
    ]));
  }

  function miniAddChild() {
    var sel = { avatar: '🐼' };
    var grid = el('div', { class: 'avatar-grid' });
    AVATARS.forEach(function (a) {
      var b = el('button', { class: 'avatar-pick' + (a === sel.avatar ? ' is-sel' : ''), type: 'button', 'aria-label': a }, a);
      b.addEventListener('click', function () { sel.avatar = a; Array.prototype.forEach.call(grid.children, function (c) { c.classList.remove('is-sel'); }); b.classList.add('is-sel'); });
      grid.appendChild(b);
    });
    var nameInput = el('input', { class: 'field', type: 'text', maxlength: '20', placeholder: 'Bé mới', 'aria-label': 'Tên gọi' });
    openModal([
      el('h2', { class: 'title' }, 'Thêm một bé'),
      grid,
      nameInput,
      el('div', { class: 'row', style: 'gap:var(--sp-3);margin-top:var(--sp-3)' }, [
        el('button', { class: 'btn btn--ghost grow', type: 'button', onclick: closeModal }, 'Huỷ'),
        el('button', { class: 'btn grow', type: 'button', onclick: function () {
          var id = Progress.createChild(nameInput.value, sel.avatar);
          closeModal(); state.childId = id; Progress.setActiveChild(id); go('S1');
        } }, 'Thêm')
      ])
    ]);
  }

  /* =====================================================================
     S2 — BẢN ĐỒ UNIT (màn chính)
     ===================================================================== */
  function screenMap() {
    if (!state.childId) { go('S1'); return; }
    Promise.all([loadLevelIndex(), refreshMastery()]).then(function (res) {
      var idx = res[0];
      var child = currentChild();
      setHeader({ hidden: true });

      var totalStars = computeTotalStars();
      var topHeader = el('header', { class: 'app-header' }, [
        el('span', { class: 'app-header__title' }, '🦊 Chào ' + (child ? child.name : 'bé') + '!'),
        el('span', { class: 'app-header__spacer' }),
        el('button', { class: 'app-header__btn', type: 'button', 'aria-label': 'Trang phụ huynh', onclick: function () { parentGate(); } }, ['👪', el('span', { class: 'lbl' }, ' Phụ huynh')]),
        el('button', { class: 'app-header__btn', type: 'button', onclick: function () { go('S9'); }, 'aria-label': 'Cài đặt' }, '⚙️')
      ]);

      var weekLine = el('div', { class: 'chip chip--star' }, '🌱 Tuần này em đã học ' + (state.mastery ? state.mastery.weeklyDays : 0) + ' ngày');
      var starChip = el('div', { class: 'chip chip--star' }, '⭐ ' + totalStars);

      // ===== BẢN ĐỒ "CON ĐƯỜNG HỌC" — 5 BÀI LỚN =====
      var lessons = (idx.lessons || []).slice().sort(function (a, b) { return a.lesson - b.lesson; });
      var doneCount = 0;
      lessons.forEach(function (l) { var um = unitMastery(l.unit); if (um && um.masteryPct >= 60) doneCount++; });
      var lvl = el('div', { class: 'jmap-lvl' }, '★ TIẾNG ANH · LEVEL 1 · ' + doneCount + '/' + lessons.length + ' bài ★');

      var path = el('div', { class: 'jmap' }, el('div', { class: 'jmap__line', 'aria-hidden': 'true' }));
      lessons.forEach(function (l) {
        var um = unitMastery(l.unit);
        var pct = um ? um.masteryPct : 0;
        var stars = starsForUnit(um);
        var done = pct >= 60, cur = !done && pct > 0;
        var status = done ? 'done' : (cur ? 'cur' : 'soon');
        var statusTxt = done ? 'Hoàn thành' : (cur ? ('Đang học · ' + pct + '%') : 'Chưa bắt đầu');

        var nodeKids = [el('span', { class: 'jmap__emoji', 'aria-hidden': 'true' }, l.icon)];
        if (done) nodeKids.push(el('span', { class: 'jmap__check', 'aria-hidden': 'true' }, '✓'));
        var node = el('span', { class: 'jmap__node' + (cur ? ' is-cur' : '') + (status === 'soon' ? ' is-soon' : ''), style: '--pal:var(--c-' + l.pal + ');--pal-soft:var(--c-' + l.pal + '-soft)' }, nodeKids);

        var cardKids = [
          el('div', { class: 'jmap__title' }, 'Bài ' + l.lesson + ' · ' + l.topic_vi),
          el('div', { class: 'jmap__sub' }, l.sub),
          el('span', { class: 'jmap__tag jmap__tag--' + status }, statusTxt)
        ];
        cardKids.push(done ? starsRow(stars, 3) : el('div', { class: 'jmap__bar' }, el('i', { style: 'width:' + pct + '%' })));
        var stop = el('button', { class: 'jmap__stop', type: 'button', 'aria-label': 'Bài ' + l.lesson + ' ' + l.topic_vi + ' — ' + statusTxt },
          [node, el('span', { class: 'jmap__card' }, cardKids)]);
        stop.addEventListener('click', function () { state.currentUnit = l.unit; state.returnLesson = null; go('S3'); });
        path.appendChild(stop);
      });

      render(el('div', { class: 'screen stack-lg' }, [
        topHeader,
        el('div', { class: 'row-wrap' }, [weekLine, starChip]),
        lvl,
        path
      ]));
    }).catch(function (e) { renderError(e); });
  }

  function isUnitUnlocked(unitNo, units) {
    var ordered = units.slice().sort(function (a, b) { return (a.order || a.unit) - (b.order || b.unit); });
    var pos = -1;
    for (var i = 0; i < ordered.length; i++) if (ordered[i].unit === unitNo) { pos = i; break; }
    if (pos <= 0) return true; // unit đầu luôn mở
    var prev = ordered[pos - 1];
    var pm = unitMastery(prev.unit);
    // Mở theo COMPLETION nhẹ: unit trước đã luyện ít nhất 1 hoạt động.
    return !!(pm && pm.effort >= MASTERY_UNLOCK);
  }
  function practiced(um, skill) {
    return !!(um && um.practiced && um.practiced[skill]);
  }
  function starsForUnit(um) {
    if (!um) return 0;
    var n = 0;
    if (um.effort > 0) n = 1;                                       // hoàn thành ≥1 hoạt động
    if (practiced(um, 'vocab') && practiced(um, 'grammar')) n = 2;  // làm cả từ vựng + luyện tập
    if (um.masteryPct >= 60) n = 3;                                 // nắm tốt
    return n;
  }
  function computeTotalStars() {
    if (!state.mastery) return 0;
    return (state.mastery.units || []).reduce(function (sum, u) { return sum + starsForUnit(u); }, 0);
  }

  /* =====================================================================
     S3 — MENU UNIT
     ===================================================================== */
  function screenUnitMenu() {
    var unitNo = state.currentUnit;
    Promise.all([loadUnit(unitNo), refreshMastery()]).then(function (res) {
      var unit = res[0];
      var um = unitMastery(unitNo);
      setHeader({ title: unit.topic_vi, onBack: function () { backFromMenu(unitNo); }, speakText: unit.topic });

      function activity(num, icon, title, sub, skillDone, onClick) {
        var card = el('button', { class: 'act-card', type: 'button' }, [
          el('span', { class: 'act-card__icon' }, icon),
          el('span', { class: 'grow' }, [
            el('div', { class: 'act-card__title' }, num + '. ' + title),
            el('div', { class: 'muted', style: 'font-size:var(--fs-sm)' }, sub),
            skillDone ? el('div', { class: 'act-card__done' }, '✓ Đã làm') : el('span')
          ]),
          el('span', { class: 'pi-mini' }, '→')
        ]);
        card.addEventListener('click', onClick);
        return card;
      }

      var n = 0;
      var acts = [
        activity(++n, '📇', 'Từ vựng', 'Xem & nghe thẻ từ', practiced(um, 'vocab'), function () { go('S4'); }),
        activity(++n, '✍️', 'Luyện tập', 'Làm bài: điền từ, trắc nghiệm, xếp câu', practiced(um, 'grammar') || (um && um.masteryPct > 0), function () { go('S5'); })
      ];
      // Nghe — nghe câu/từ rồi chọn đáp án (cần ≥4 từ vựng hoặc grammar có safeZone).
      var canListen = (unit.vocab && unit.vocab.length >= 4) ||
        (unit.grammar || []).some(function (g) { return g.safeZone; });
      if (canListen) {
        acts.push(activity(++n, '🎧', 'Nghe', 'Nghe rồi chọn đúng từ/câu', practiced(um, 'listening'), function () { go('S5l'); }));
      }
      // Phonics — học âm trước (S5ph) rồi luyện (S5p, mở từ trong màn học).
      if (unit.phonics && unit.phonics.words && unit.phonics.words.length) {
        acts.push(activity(++n, '🔡', 'Phonics', 'Học âm chữ rồi luyện nhận diện', practiced(um, 'phonics'), function () { go('S5ph'); }));
      }
      // Đọc — đoạn đọc ngắn + câu hỏi (chủ yếu ở BÀI LỚN; unit nhỏ nào có reading cũng hiện).
      if (Array.isArray(unit.reading) && unit.reading.length && (unit.reading[0] || {}).text) {
        acts.push(activity(++n, '📖', 'Đọc', 'Đọc đoạn ngắn rồi trả lời câu hỏi', practiced(um, 'reading'), function () { go('S5r'); }));
      }
      acts.push(activity(++n, '🗣️', 'Nói', 'Nghe mẫu rồi nói theo (không chấm điểm)', practiced(um, 'speaking'), function () { go('S6'); }));

      var screenKids = [
        el('div', { class: 'row', style: 'justify-content:center' }, [piNode('mascot--sm'), el('div', { class: 'speech' }, 'Hôm nay học gì nào? Chọn một mục nhé!')]),
        el('div', { class: 'stack' }, acts)
      ];
      // "Luyện tập thêm" — chỉ ở BÀI LỚN: mở các unit nhỏ nguồn để luyện kỹ hơn.
      if (isLessonUnit(unitNo) && Array.isArray(unit.sourceUnits) && unit.sourceUnits.length) {
        var srcMetas = unit.sourceUnits
          .map(function (fn) { return ((state.levelIndex || {}).units || []).filter(function (u) { return u.file === fn; })[0]; })
          .filter(Boolean);
        if (srcMetas.length) {
          var chips = el('div', { class: 'row-wrap', style: 'gap:var(--sp-2)' });
          srcMetas.forEach(function (m) {
            var b = el('button', { class: 'extra-chip', type: 'button' }, [el('span', { 'aria-hidden': 'true' }, m.icon + ' '), m.topic_vi]);
            b.addEventListener('click', function () { state.returnLesson = unitNo; state.currentUnit = m.unit; go('S3'); });
            chips.appendChild(b);
          });
          screenKids.push(el('div', { class: 'card stack', style: 'gap:var(--sp-3)' }, [
            el('div', { class: 'act-card__title' }, '🧩 Luyện tập thêm'),
            el('div', { class: 'muted', style: 'font-size:var(--fs-sm)' }, 'Muốn luyện kỹ hơn? Chọn một chủ đề nhỏ:'),
            chips
          ]));
        }
      }
      render(el('div', { class: 'screen stack-lg' }, screenKids));
    }).catch(function (e) { renderError(e); });
  }

  /* =====================================================================
     S4 — FLASHCARD TỪ VỰNG
     ===================================================================== */
  function screenFlashcards() {
    var unitNo = state.currentUnit;
    loadUnit(unitNo).then(function (unit) {
      var vocab = unit.vocab || [];
      if (!vocab.length) { renderError(new Error('Unit chưa có từ vựng.')); return; }
      var i = 0;
      setHeader({ title: 'Từ vựng · ' + unit.topic_vi, onBack: function () { go('S3'); }, speakText: vocab[0].word });

      var stage = el('div', { class: 'fc-stage' });
      var main = $('#main');
      clear(main); ttsWarned = false;
      var screen = el('div', { class: 'screen stack-lg' }, [stage]);
      main.appendChild(screen);
      if (TTS && !TTS.hasEnglishVoice()) showTtsWarn();

      function draw() {
        var v = vocab[i];
        clear(stage);
        var card = el('div', { class: 'flashcard', tabindex: '0', role: 'button', 'aria-label': 'Thẻ từ ' + v.word + ', chạm để lật' });
        var inner = el('div', { class: 'flashcard__inner' });
        var front = el('div', { class: 'flashcard__face flashcard__face--front' }, [
          el('div', { class: 'flashcard__icon' }, v.icon || '🔤'),
          el('div', { class: 'flashcard__word en' }, v.word),
          el('span', { class: 'flashcard__hint' }, 'Chạm để lật ↻')
        ]);
        var back = el('div', { class: 'flashcard__face flashcard__face--back' }, [
          el('div', { class: 'flashcard__icon' }, v.icon || '🔤'),
          el('div', { class: 'flashcard__vi' }, v.vi),
          el('div', { class: 'flashcard__example en' }, v.example || '')
        ]);
        inner.appendChild(front); inner.appendChild(back);
        card.appendChild(inner);
        function flip() { card.classList.toggle('is-flipped'); }
        card.addEventListener('click', flip);
        card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });

        var counter = el('div', { class: 'fc-counter' }, 'Thẻ ' + (i + 1) + ' / ' + vocab.length);
        var actions = el('div', { class: 'fc-actions' }, [
          el('div', { class: 'row', style: 'gap:var(--sp-2)' }, [speakerBtn(v.word, 'Đọc từ', { accent: true }), el('span', { class: 'muted', style: 'font-size:var(--fs-sm)' }, 'Đọc từ')]),
          el('div', { class: 'row', style: 'gap:var(--sp-2)' }, [speakerBtn(v.example || v.word, 'Đọc câu'), el('span', { class: 'muted', style: 'font-size:var(--fs-sm)' }, 'Đọc câu')])
        ]);

        var nav = el('div', { class: 'fc-nav' }, [
          el('button', { class: 'btn btn--ghost', type: 'button', disabled: i === 0 ? '' : null, onclick: function () { if (i > 0) { i--; draw(); autoRead(vocab[i].word); } } }, '← Trước'),
          el('button', { class: 'btn', type: 'button', onclick: function () {
            if (i < vocab.length - 1) { i++; draw(); autoRead(vocab[i].word); }
            else finishFlashcards(unit, vocab.length);
          } }, i < vocab.length - 1 ? 'Tiếp →' : 'Xong 🎉')
        ]);

        stage.appendChild(counter);
        stage.appendChild(card);
        stage.appendChild(actions);
        stage.appendChild(nav);
        setHeader({ title: 'Từ vựng · ' + unit.topic_vi, onBack: function () { go('S3'); }, speakText: v.word });
      }
      draw();
      autoRead(vocab[0].word);
    }).catch(function (e) { renderError(e); });
  }

  function finishFlashcards(unit, count) {
    Progress.save({ childId: state.childId, level: 1, unit: unit.unit, skill: 'vocab', score: null, attempts: count, effort: count, ts: Date.now() })
      .then(refreshMastery).then(function () {
        var node = el('div', { class: 'screen result stack-lg', style: 'padding-top:var(--sp-7)' }, [
          el('div', { class: 'center' }, piNode('is-cheer is-glowing mascot--lg')),
          el('h1', { class: 'celebrate__title' }, 'Em đã xem hết từ! 🎉'),
          el('p', { class: 'subtitle' }, 'Giỏi lắm. Mình luyện tập một chút cho nhớ nhé!'),
          el('button', { class: 'btn btn--cta btn--block', type: 'button', onclick: function () { go('S5'); } }, 'Luyện tập ngay ✍️'),
          el('button', { class: 'btn btn--ghost btn--block', type: 'button', onclick: function () { go('S3'); } }, 'Về unit')
        ]);
        render(node);
        confettiBurst();
      });
  }

  /* =====================================================================
     S5 — LUYỆN TẬP (engine sinh bài) — và S5p (phonics)
     ===================================================================== */
  function buildSpecs(unit, mode) {
    var specs = [];
    // mode: 'phonics' | 'listen' | undefined(=ngữ pháp/từ vựng).
    if (mode === 'phonics') {
      if (unit.phonics) for (var p = 0; p < EXERCISES_PER_STAGE; p++) specs.push({ type: 'phonics_pick', level: 1, unit: unit.unit, phonics: unit.phonics });
      return specs;
    }
    if (mode === 'listen') {
      // Nghe → chọn. Trộn nghe TỪ (vocab) và nghe CÂU (grammar) cho phong phú.
      var bagL = [];
      if (unit.vocab && unit.vocab.length >= 4) bagL.push({ kind: 'vocab' });
      (unit.grammar || []).forEach(function (g) {
        if ((g.generators || []).indexOf('listen_choose') !== -1) bagL.push({ kind: 'grammar', grammar: g });
      });
      // Fallback: nếu grammar không khai báo listen_choose nhưng có safeZone, vẫn dùng được.
      if (!bagL.some(function (b) { return b.kind === 'grammar'; })) {
        (unit.grammar || []).forEach(function (g) { if (g.safeZone) bagL.push({ kind: 'grammar', grammar: g }); });
      }
      if (!bagL.length) return specs;
      for (var li = 0; li < EXERCISES_PER_STAGE; li++) {
        var bl = bagL[li % bagL.length];
        var sl = { type: 'listen_choose', level: 1, unit: unit.unit };
        if (bl.kind === 'vocab') sl.vocabPool = unit.vocab;
        else sl.grammar = bl.grammar;
        specs.push(sl);
      }
      return specs;
    }
    var grammars = unit.grammar || [];
    var vocab = unit.vocab || [];
    // Trộn các loại bài theo generators khai báo + 1 mcq vocab.
    var bag = [];
    grammars.forEach(function (g) {
      (g.generators || []).forEach(function (t) {
        if (t === 'fill_blank' || t === 'mcq' || t === 'order_words') bag.push({ type: t, grammar: g });
      });
    });
    if (vocab.length >= 4) bag.push({ type: 'mcq', vocab: true });
    if (!bag.length) return specs;
    for (var i = 0; i < EXERCISES_PER_STAGE; i++) {
      var pickItem = bag[i % bag.length];
      var spec = { type: pickItem.type, level: 1, unit: unit.unit };
      if (pickItem.grammar) spec.grammar = pickItem.grammar;
      if (pickItem.vocab) spec.vocabPool = vocab;
      specs.push(spec);
    }
    return specs;
  }

  function screenPractice(mode) {
    var unitNo = state.currentUnit;
    loadUnit(unitNo).then(function (unit) {
      var specs = buildSpecs(unit, mode);
      if (!specs.length) { renderError(new Error('Unit chưa có bài tập phù hợp.')); return; }

      var sess = { idx: 0, firstTryCorrect: 0, attempts: 0, reviewedWrong: 0, skippedAfterFail: 0, exercises: [] };
      // Sinh sẵn bài (seed theo idx + thời gian để mỗi phiên khác nhau nhưng vẫn hợp lệ).
      var baseSeed = (Date.now() % 100000);
      var genFails = 0;
      for (var s = 0; s < specs.length; s++) {
        try { sess.exercises.push(Engine.generate(specs[s], baseSeed + s * 17 + unitNo * 3)); }
        catch (e) {
          // Bỏ bài lỗi để KHÔNG vỡ màn cho trẻ — nhưng KHÔNG nuốt im lặng:
          // log cảnh báo (chỉ console, trẻ không thấy) để QA/CI bắt regression sớm.
          genFails++;
          try {
            console.warn('[buildSpecs] sinh bài lỗi:', specs[s].type,
              (specs[s].grammar && specs[s].grammar.id) || '',
              'unit=' + unitNo, '·', (e && e.message) || e);
          } catch (_) {}
        }
      }
      if (!sess.exercises.length) { renderError(new Error('Không sinh được bài cho unit này.')); return; }
      // Nếu sinh được quá ít so với dự kiến → log rõ để QA chú ý (ngưỡng nhẹ, không chặn trẻ).
      if (genFails > 0 && sess.exercises.length < 3) {
        try { console.warn('[buildSpecs] CHỈ sinh được', sess.exercises.length, 'bài (lỗi ' + genFails + ') · unit=' + unitNo + ' mode=' + (mode || 'grammar/vocab')); } catch (_) {}
      }

      var skill = (mode === 'phonics') ? 'phonics'
        : (mode === 'listen') ? 'listening'
        : (specs[0].grammar ? 'grammar' : 'vocab');
      drawExercise(unit, sess, mode, skill);
    }).catch(function (e) { renderError(e); });
  }

  function drawExercise(unit, sess, mode, skill) {
    var ex = sess.exercises[sess.idx];
    var total = sess.exercises.length;
    var attemptCount = { tries: 0 };
    var modeLabel = (mode === 'phonics') ? 'Phonics' : (mode === 'listen') ? 'Nghe' : 'Luyện tập';
    setHeader({ title: modeLabel + ' · Câu ' + (sess.idx + 1) + '/' + total, onBack: function () { pauseConfirm(unit, sess, skill); }, backLabel: 'Tạm dừng', speakText: ex.audioText || '' });

    // Thanh đốt tiến độ
    var steps = el('div', { class: 'steps', 'aria-label': 'Câu ' + (sess.idx + 1) + ' trên ' + total });
    for (var i = 0; i < total; i++) {
      var dot = el('span', { class: 'step-dot' + (i < sess.idx ? ' is-done' : (i === sess.idx ? ' is-current' : '')) });
      steps.appendChild(dot);
    }

    var promptArea = el('div', { class: 'card stack' });
    // Vùng phản hồi là live-region CỤC BỘ: chỉ đọc khi có feedback đúng/sai, không đọc cả màn.
    var feedbackArea = el('div', { 'aria-live': 'polite' });
    var actionArea = el('div', { class: 'stack' });

    var screen = el('div', { class: 'screen stack-lg' }, [steps, promptArea, feedbackArea, actionArea]);
    var main = $('#main'); clear(main); ttsWarned = false; main.appendChild(screen);
    if (TTS && !TTS.hasEnglishVoice()) showTtsWarn();
    focusNewScreen(main);

    // Đề + loa
    var listen = (ex.type === 'listen_choose' || ex.type === 'phonics_pick');
    promptArea.appendChild(el('div', { class: 'row', style: 'gap:var(--sp-3)' }, [
      el('div', { class: 'ex-prompt grow' }, ex.prompt),
      ex.audioText ? speakerBtn(ex.audioText, 'Nghe đề', { accent: listen, lg: listen }) : el('span')
    ]));

    // Tự đọc đề khi mở (hướng dẫn VN + câu đề)
    autoRead(stripPromptForRead(ex.prompt) + (ex.audioText && !listen ? '. ' + ex.audioText : ''));

    var answered = { done: false };

    function onResult(isCorrect, correctText, chosenEl) {
      sess.attempts++; attemptCount.tries++;
      clear(feedbackArea);
      if (isCorrect) {
        if (attemptCount.tries === 1) sess.firstTryCorrect++;
        var fb = el('div', { class: 'feedback feedback--correct', role: 'status' }, [
          el('span', { class: 'feedback__icon' }, '🎉'),
          el('div', { class: 'feedback__body' }, [
            el('div', { class: 'feedback__title' }, randItem(PRAISE_OK)),
            el('div', null, [document.createTextNode('Câu đúng: '), el('span', { class: 'feedback__answer en' }, correctText), ' '])
          ]),
          speakerBtn(ex.audioText || correctText, 'Nghe câu đúng')
        ]);
        feedbackArea.appendChild(fb);
        confettiBurst();
        showNext(unit, sess, mode, skill);
      } else {
        if (attemptCount.tries >= 2) {
          // Chống kẹt: hiện feedback "đáp án đúng" + nút Tiếp.
          // LƯU Ý phụ thuộc: việc HIGHLIGHT lựa chọn đúng NGAY TRONG danh sách do
          // renderChoices/renderFillBlank/renderOrderWords tự lo (chúng giữ tham chiếu DOM,
          // onResult thì không). Hai khối này phối hợp: onResult lo feedback+điều hướng,
          // renderer lo tô màu đáp án đúng trong list khi sai lần 2.
          sess.skippedAfterFail++;
          revealAndPass(unit, sess, mode, skill, ex, correctText, feedbackArea);
        } else {
          var fbt = el('div', { class: 'feedback feedback--try', role: 'status' }, [
            el('span', { class: 'feedback__icon' }, '💡'),
            el('div', { class: 'feedback__body' }, [
              el('div', { class: 'feedback__title' }, randItem(PRAISE_TRY)),
              el('div', null, ex.explain || 'Cùng thử lại nhé.'),
              el('div', { style: 'margin-top:var(--sp-2)' }, [document.createTextNode('Đáp án đúng: '), el('span', { class: 'feedback__answer en' }, correctText), ' '])
            ]),
            reviewSpeakerBtn(sess, ex.audioText || correctText, 'Nghe câu đúng')
          ]);
          feedbackArea.appendChild(fbt);
          speak(ex.audioText || correctText);
        }
      }
    }

    // Render theo loại bài
    if (ex.type === 'mcq' || ex.type === 'listen_choose' || ex.type === 'phonics_pick') {
      renderChoices(ex, promptArea, actionArea, onResult, listen, unit);
    } else if (ex.type === 'fill_blank') {
      renderFillBlank(ex, promptArea, actionArea, onResult, unit);
    } else if (ex.type === 'order_words') {
      renderOrderWords(ex, promptArea, actionArea, onResult);
    } else {
      // transform / khác: hiển thị như nhập (hiếm ở chặng này)
      renderFillBlank(ex, promptArea, actionArea, onResult, unit);
    }
  }

  function nextOrFinish(unit, sess, mode, skill) {
    if (sess.idx < sess.exercises.length - 1) { sess.idx++; drawExercise(unit, sess, mode, skill); }
    else finishStage(unit, sess, mode, skill);
  }

  // Sau khi đúng / cho qua: hiện nút Tiếp
  function showNext(unit, sess, mode, skill) {
    var screen = $('#main .screen');
    if (!screen) return;
    var holder = screen.lastChild; // actionArea
    if (holder.querySelector('.js-next')) return; // đã có nút Tiếp → không thêm trùng
    var nextBtn = el('button', { class: 'btn btn--cta btn--block js-next', style: 'margin-top:var(--sp-3)', type: 'button', onclick: function () { nextOrFinish(unit, sess, mode, skill); } },
      sess.idx < sess.exercises.length - 1 ? 'Tiếp →' : 'Xem kết quả 🌟');
    holder.appendChild(nextBtn);
  }

  function revealAndPass(unit, sess, mode, skill, ex, correctText, feedbackArea) {
    var fb = el('div', { class: 'feedback feedback--try', role: 'status' }, [
      el('span', { class: 'feedback__icon' }, '🦊'),
      el('div', { class: 'feedback__body' }, [
        el('div', { class: 'feedback__title' }, 'Mình cùng nghe câu đúng nhé!'),
        el('div', null, ex.explain || ''),
        el('div', { style: 'margin-top:var(--sp-2)' }, [document.createTextNode('Đáp án đúng: '), el('span', { class: 'feedback__answer en' }, correctText)])
      ]),
      reviewSpeakerBtn(sess, ex.audioText || correctText, 'Nghe câu đúng')
    ]);
    feedbackArea.appendChild(fb);
    speak(ex.audioText || correctText);
    // đẩy vào reviewQueue (qua effort) — ở MVP chỉ đánh dấu để tăng cơ hội ôn
    showNext(unit, sess, mode, skill);
  }

  function renderChoices(ex, promptArea, actionArea, onResult, listen, unit) {
    // Nếu là listen/phonics: chèn nút nghe lớn ở đề.
    var list = el('div', { class: 'choice-list' });
    var keys = ['A', 'B', 'C', 'D', 'E', 'F'];
    var locked = false;
    ex.choices.forEach(function (c, i) {
      var icon = iconForWord(unit, c);
      // Nút loa RÕ RÀNG cạnh mỗi lựa chọn (thay vì chỉ dựa tương tác ẩn chạm-giữ).
      // Nghe TỪ/CÂU của lựa chọn này, không tính là chọn đáp án.
      // Dùng <span role="button"> (KHÔNG lồng <button> trong <button> — HTML cấm, gây vỡ DOM).
      var spk = el('span', { class: 'icon-btn choice__spk', role: 'button', tabindex: '0', 'aria-label': 'Nghe ' + c }, '🔊');
      var ch = el('button', { class: 'choice', type: 'button' }, [
        el('span', { class: 'choice__key' }, keys[i]),
        icon ? el('span', { class: 'choice__icon' }, icon) : el('span'),
        el('span', { class: 'choice__text en' }, c),
        spk,
        el('span', { class: 'choice__mark' }, '')
      ]);
      function previewSpeak(e) { e.stopPropagation(); previewed = true; speak(c, { btn: spk }); }
      spk.addEventListener('click', previewSpeak);
      spk.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); previewSpeak(e); } });
      // chạm-giữ để nghe trước (preview) — không tính là chọn (giữ làm bổ trợ)
      var pressTimer = null, previewed = false;
      ch.addEventListener('pointerdown', function () { previewed = false; pressTimer = setTimeout(function () { previewed = true; speak(c); }, 450); });
      ch.addEventListener('pointerup', function () { if (pressTimer) clearTimeout(pressTimer); });
      ch.addEventListener('pointerleave', function () { if (pressTimer) clearTimeout(pressTimer); });
      ch.addEventListener('click', function () {
        if (previewed) { previewed = false; return; }
        // Đã khoá toàn bộ, hoặc nút này đã chọn sai trước đó → bỏ qua (không tính lần thử lặp).
        if (locked || ch.classList.contains('is-wrong')) return;
        var correct = (i === ex.answer);
        ch.classList.add(correct ? 'is-correct' : 'is-wrong');
        ch.querySelector('.choice__mark').textContent = correct ? '✓' : '✗';
        if (correct) {
          locked = true;
          Array.prototype.forEach.call(list.children, function (x) { x.classList.add('is-disabled'); });
          onResult(true, ex.choices[ex.answer], ch);
        } else {
          ch.classList.add('is-disabled'); ch.disabled = true; // khoá nút sai (không bấm lại được)
          onResult(false, ex.choices[ex.answer], ch);
          // Khi sai lần 2: onResult đã gọi revealAndPass (feedback + nút Tiếp).
          // Phần dưới CHỈ lo tô màu đáp án đúng NGAY TRONG danh sách (phụ thuộc với onResult,
          // xem comment ở onResult). Giữ cùng ngưỡng >=2 để hai khối đồng bộ.
          var tries = countWrong(list);
          if (tries >= 2) {
            var correctEl = list.children[ex.answer];
            correctEl.classList.add('is-correct');
            correctEl.querySelector('.choice__mark').textContent = '✓';
            locked = true;
            Array.prototype.forEach.call(list.children, function (x) { x.classList.add('is-disabled'); });
          }
        }
      });
      list.appendChild(ch);
    });
    actionArea.appendChild(list);
  }
  function countWrong(list) {
    var n = 0; Array.prototype.forEach.call(list.children, function (c) { if (c.classList.contains('is-wrong')) n++; }); return n;
  }

  function renderFillBlank(ex, promptArea, actionArea, onResult, unit) {
    // Ưu tiên CHỌN từ (đỡ gõ, theo UX_FLOWS). Suy phương án từ a/an, my/your,
    // hoặc từ vocab khi đáp án là một danh từ.
    var options = fillOptionsFor(ex, unit);
    if (options && options.length >= 2) {
      var grid = el('div', { class: 'blank-options' });
      var locked = false;
      options.forEach(function (opt) {
        var b = el('button', { class: 'choice', style: 'justify-content:center', type: 'button' }, [
          el('span', { class: 'choice__text en', style: 'flex:none' }, opt),
          el('span', { class: 'choice__mark' }, '')
        ]);
        b.addEventListener('click', function () {
          if (locked || b.classList.contains('is-wrong')) return; // khoá / đã chọn sai nút này
          var correct = normEq(opt, ex.answer);
          b.classList.add(correct ? 'is-correct' : 'is-wrong');
          b.querySelector('.choice__mark').textContent = correct ? '✓' : '✗';
          if (correct) { locked = true; Array.prototype.forEach.call(grid.children, function (x) { x.classList.add('is-disabled'); }); onResult(true, ex.answer, b); }
          else {
            b.classList.add('is-disabled'); b.disabled = true;
            onResult(false, ex.answer, b);
            var wrongs = 0; Array.prototype.forEach.call(grid.children, function (x) { if (x.classList.contains('is-wrong')) wrongs++; });
            if (wrongs >= 2) {
              locked = true;
              // lộ đáp án đúng cho rõ
              Array.prototype.forEach.call(grid.children, function (x) { x.classList.add('is-disabled'); });
            }
          }
        });
        grid.appendChild(b);
      });
      actionArea.appendChild(grid);
    } else {
      var input = el('input', { class: 'field en', type: 'text', 'aria-label': 'Nhập từ còn thiếu' });
      var fbLocked = false;   // cờ khoá: chặn bấm Kiểm tra nhiều lần
      var fbWrong = 0;
      var btn = el('button', { class: 'btn btn--correct btn--block', type: 'button', onclick: function () {
        if (fbLocked) return;                 // đã trả lời xong → không xử lý nữa
        var v = input.value.trim();
        if (!v) return;
        var correct = normEq(v, ex.answer);
        if (correct) {
          fbLocked = true; input.disabled = true; btn.disabled = true;
          onResult(true, ex.answer, btn);
        } else {
          fbWrong++;
          if (fbWrong >= 2) {                  // sai lần 2 → lộ đáp án, khoá lại
            fbLocked = true; input.disabled = true; btn.disabled = true;
          }
          onResult(false, ex.answer, btn);
        }
      } }, '✓ Kiểm tra');
      actionArea.appendChild(input);
      actionArea.appendChild(btn);
    }
  }

  function renderOrderWords(ex, promptArea, actionArea, onResult) {
    var tray = el('div', { class: 'token-tray', 'aria-label': 'Khay xếp câu' });
    var bank = el('div', { class: 'token-bank' });
    var placed = []; // {word, tokenEl, bankEl}
    function syncCheck() { checkBtn.disabled = placed.length !== ex.answer.length ? '' : null; }
    ex.tokens.forEach(function (tk, i) {
      var b = el('button', { class: 'token en', type: 'button' }, tk);
      b.addEventListener('click', function () {
        if (b.classList.contains('is-used')) return;
        b.classList.add('is-used');
        var chip = el('button', { class: 'token en', type: 'button', 'aria-label': 'Gỡ ' + tk }, tk);
        chip.addEventListener('click', function () {
          b.classList.remove('is-used');
          tray.removeChild(chip);
          placed = placed.filter(function (p) { return p.chip !== chip; });
          syncCheck();
        });
        tray.appendChild(chip);
        placed.push({ word: tk, chip: chip });
        syncCheck();
      });
      bank.appendChild(b);
    });
    var checkBtn = el('button', { class: 'btn btn--correct btn--block', type: 'button', disabled: '', onclick: function () {
      var arr = placed.map(function (p) { return p.word; });
      var correct = arr.length === ex.answer.length && arr.every(function (w, k) { return w === ex.answer[k]; });
      onResult(correct, ex.answer.join(' '), checkBtn);
      if (correct) { checkBtn.disabled = ''; bank.style.pointerEvents = 'none'; tray.style.pointerEvents = 'none'; }
    } }, '✓ Kiểm tra');
    actionArea.appendChild(el('div', { class: 'subtitle' }, 'Chạm từng thẻ để xếp vào khay (chạm thẻ trong khay để gỡ):'));
    actionArea.appendChild(tray);
    actionArea.appendChild(bank);
    actionArea.appendChild(checkBtn);
  }

  function finishStage(unit, sess, mode, skill) {
    var total = sess.exercises.length;
    var score = total > 0 ? (sess.firstTryCorrect / total) : null;
    // skill đã được xác định đúng theo mode ở screenPractice; giữ nguyên.
    state.stagesThisSession++;
    Progress.save({ childId: state.childId, level: 1, unit: unit.unit, skill: skill, score: score, attempts: sess.attempts, effort: total, ts: Date.now() })
      .then(refreshMastery).then(function () {
        screenResult(unit, sess, total, score);
      });
  }

  /* =====================================================================
     S7 — KẾT QUẢ CHẶNG
     ===================================================================== */
  function screenResult(unit, sess, total, score) {
    setHeader({ title: 'Kết quả', onBack: function () { go('S3'); }, hideAvatar: false });
    // 3 mức sao theo NỖ LỰC (không phán xét đúng-sai gắt):
    //  1 sao = hoàn thành chặng
    //  2 sao = kiên trì, không bị "cho qua" câu nào (làm hết)
    //  3 sao = làm tốt hết lần đầu, HOẶC chủ động nghe lại câu đúng ở các câu sai (học từ lỗi)
    var stars = 1;
    if (sess.skippedAfterFail === 0) stars = 2;
    if (sess.skippedAfterFail === 0 && sess.firstTryCorrect === total) stars = 3;
    else if (sess.reviewedWrong > 0) stars = Math.max(stars, 3);

    var pct = score == null ? 0 : Math.round(score * 100);

    var node = el('div', { class: 'result screen stack-lg', style: 'padding-top:var(--sp-7)' }, [
      el('div', { class: 'center' }, piNode('is-cheer is-glowing mascot--lg')),
      el('div', { class: 'center' }, starsRow(stars, 3, 'stars--xl')),
      el('h1', { class: 'celebrate__title' }, 'Em làm xong rồi! 👏'),
      el('p', { class: 'subtitle' }, 'Em đã luyện ' + total + ' câu. ' + (stars >= 3 ? 'Xuất sắc!' : (stars === 2 ? 'Kiên trì ghê!' : 'Cố thêm chút nữa nhé!'))),
    ]);

    // Gợi ý ôn lại nếu mastery thấp
    if (score != null && pct < 60) {
      node.appendChild(el('div', { class: 'feedback feedback--warn' }, [
        el('span', { class: 'feedback__icon' }, '🌱'),
        el('div', { class: 'feedback__body' }, [
          el('div', { class: 'feedback__title' }, 'Ôn lại một chút cho chắc nhé'),
          el('div', null, 'Mình làm lại chặng này để nhớ lâu hơn.')
        ])
      ]));
      node.appendChild(el('button', { class: 'btn btn--block', type: 'button', onclick: function () { go('S5'); } }, 'Ôn lại chặng này 🔁'));
    }

    node.appendChild(el('button', { class: 'btn btn--cta btn--block', type: 'button', onclick: function () { afterStageContinue(unit); } }, 'Tiếp →'));
    node.appendChild(el('button', { class: 'btn btn--ghost btn--block', type: 'button', onclick: function () { go('S2'); } }, 'Về bản đồ'));
    render(node);
    confettiBurst();

    // Khen mốc "nắm tốt" (không liên quan mở khoá — mở khoá tính LIVE theo nỗ lực)
    showMasteryToast(unit);
  }

  function afterStageContinue(unit) {
    if (state.stagesThisSession >= STAGES_BEFORE_BREAK) { positiveStop(); return; }
    go('S3');
  }

  // Chúc mừng khi unit đạt mốc "nắm tốt" (>=60%). Chỉ bắn MỘT LẦN/unit trong phiên
  // để tránh phiền (mỗi chặng đạt ngưỡng lại bắn). KHÔNG tự mở khoá ở đây.
  var masteryToasted = {};
  function showMasteryToast(unit) {
    var um = unitMastery(unit.unit);
    if (um && um.masteryPct >= 60 && !masteryToasted[unit.unit]) {
      masteryToasted[unit.unit] = true;
      toast('Em đã nắm tốt ' + unit.topic_vi + '! 🏅', '🏅');
    }
  }

  /* =====================================================================
     S6 — NÓI (KHÔNG CHẤM ĐIỂM)
     ===================================================================== */
  function screenSpeaking() {
    var unitNo = state.currentUnit;
    loadUnit(unitNo).then(function (unit) {
      var sentences = collectSpeakSentences(unit);
      if (!sentences.length) { renderError(new Error('Unit chưa có câu để luyện nói.')); return; }
      var i = 0, spokenCount = 0;
      var rec = { mediaRecorder: null, chunks: [], blobUrl: null, stream: null, denied: false };

      function cleanupRec() {
        try { if (rec.mediaRecorder && rec.mediaRecorder.state === 'recording') rec.mediaRecorder.stop(); } catch (e) {}
        try { if (rec.stream) rec.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
        if (rec.blobUrl) { URL.revokeObjectURL(rec.blobUrl); rec.blobUrl = null; }
        rec.stream = null; rec.mediaRecorder = null; rec.chunks = [];
      }

      function draw() {
        var sentence = sentences[i];
        setHeader({ title: 'Nói · ' + unit.topic_vi, onBack: function () { cleanupRec(); go('S3'); }, speakText: sentence });
        cleanupRec();

        var wave = el('div', { class: 'rec-wave' }, [el('span'), el('span'), el('span'), el('span'), el('span')]);
        var playMine = el('button', { class: 'btn btn--ghost', type: 'button', disabled: '', onclick: function () { if (rec.blobUrl) { var a = new Audio(rec.blobUrl); a.play(); } } }, '▶ Nghe bản của em');
        var recBtn = el('button', { class: 'btn btn--accent btn--block', type: 'button' }, '🎙️ Thu âm');
        var recording = false;

        recBtn.addEventListener('click', function () {
          if (rec.denied) { toast('Em vẫn nghe mẫu và nói theo được nhé!', '🎙️'); return; }
          if (!recording) startRec(); else stopRec();
        });
        function startRec() {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') {
            rec.denied = true; recBtn.style.display = 'none';
            toast('Máy không thu âm được — em vẫn nói theo Pi nhé!', '🦊'); return;
          }
          navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
            rec.stream = stream; rec.chunks = [];
            rec.mediaRecorder = new MediaRecorder(stream);
            rec.mediaRecorder.ondataavailable = function (e) { if (e.data.size) rec.chunks.push(e.data); };
            rec.mediaRecorder.onstop = function () {
              if (rec.blobUrl) URL.revokeObjectURL(rec.blobUrl);
              var blob = new Blob(rec.chunks, { type: 'audio/webm' });
              rec.blobUrl = URL.createObjectURL(blob);
              playMine.disabled = null;
              try { rec.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
            };
            rec.mediaRecorder.start();
            recording = true; recBtn.textContent = '⏹ Dừng'; wave.classList.add('is-rec');
          }).catch(function () {
            rec.denied = true; recBtn.style.display = 'none';
            toast('Không sao! Em nghe mẫu rồi nói theo nhé 🦊', '🎙️');
          });
        }
        function stopRec() {
          try { rec.mediaRecorder.stop(); } catch (e) {}
          recording = false; recBtn.textContent = '🎙️ Thu lại'; wave.classList.remove('is-rec');
          // Pi đáp lại đáng yêu
          setTimeout(function () { speak(sentence); }, 400);
        }

        var node = el('div', { class: 'screen stack-lg' }, [
          el('div', { class: 'row', style: 'justify-content:center' }, [piNode('mascot--sm'), el('div', { class: 'speech' }, 'Nói theo Pi nhé! (Không chấm điểm 🌟)')]),
          el('div', { class: 'fc-counter text-center' }, 'Câu ' + (i + 1) + ' / ' + sentences.length),
          el('div', { class: 'speak-card en' }, sentence),
          el('div', { class: 'row', style: 'justify-content:center;gap:var(--sp-3);flex-wrap:wrap' }, [
            el('button', { class: 'btn btn--accent', type: 'button', onclick: function (e) { speak(sentence); } }, '🔊 Nghe Pi đọc'),
            el('button', { class: 'btn btn--ghost', type: 'button', onclick: function () { speak(sentence, { slow: true }); } }, '🐢 Nghe chậm')
          ]),
          recBtn,
          wave,
          el('div', { class: 'row', style: 'justify-content:center' }, [
            playMine
          ]),
          el('button', { class: 'btn btn--cta btn--block', type: 'button', onclick: function () {
            spokenCount++;
            if (i < sentences.length - 1) { i++; draw(); }
            else finishSpeaking(unit, sentences.length);
          } }, i < sentences.length - 1 ? 'Câu tiếp →' : 'Xong, em đã luyện nói! 🌟')
        ]);
        render(node);
        autoRead(sentence);
      }
      draw();
    }).catch(function (e) { renderError(e); });
  }

  function finishSpeaking(unit, count) {
    Progress.save({ childId: state.childId, level: 1, unit: unit.unit, skill: 'speaking', score: null, attempts: count, effort: count, ts: Date.now() })
      .then(refreshMastery).then(function () {
        var node = el('div', { class: 'result screen stack-lg', style: 'padding-top:var(--sp-7)' }, [
          el('div', { class: 'center' }, piNode('is-cheer is-glowing mascot--lg')),
          el('h1', { class: 'celebrate__title' }, 'Em đã luyện nói! 🌟'),
          el('p', { class: 'subtitle' }, 'Em đã can đảm nói tiếng Anh. Pi tự hào về em!'),
          el('button', { class: 'btn btn--cta btn--block', type: 'button', onclick: function () { go('S3'); } }, 'Về unit'),
          el('button', { class: 'btn btn--ghost btn--block', type: 'button', onclick: function () { go('S2'); } }, 'Về bản đồ')
        ]);
        render(node);
        confettiBurst();
      });
  }

  /* =====================================================================
     S5r — ĐỌC HIỂU: đoạn đọc ngắn (mỗi câu có loa) + câu hỏi true/false & mcq
     ===================================================================== */
  function readingSentences(text) {
    var parts = String(text || '').match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) || [];
    return parts.map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function screenReading() {
    var unitNo = state.currentUnit;
    loadUnit(unitNo).then(function (unit) {
      var passages = (unit.reading || []).filter(function (r) { return r && r.text; });
      if (!passages.length) { renderError(new Error('Bài chưa có đoạn đọc.')); return; }
      var r = passages[0];
      var questions = (r.questions || []);
      var doneQ = {};
      setHeader({ title: 'Đọc · ' + unit.topic_vi, onBack: function () { go('S3'); }, speakText: r.text });

      // Đoạn đọc: từng câu một dòng, có nút loa riêng (UDL — hỗ trợ trẻ đọc yếu).
      var sentRows = readingSentences(r.text).map(function (s) {
        return el('div', { class: 'read-line' }, [
          el('span', { class: 'read-line__text en grow' }, s),
          speakerBtn(s, 'Nghe: ' + s)
        ]);
      });
      var passageCard = el('div', { class: 'card stack', style: 'gap:var(--sp-2)' }, [
        el('div', { class: 'row', style: 'justify-content:space-between;align-items:center' }, [
          el('div', { class: 'act-card__title' }, '📖 ' + (r.title_vi || 'Đoạn đọc')),
          speakerBtn(r.text, 'Nghe cả đoạn', { accent: true })
        ])
      ].concat(sentRows));

      function finish() {
        Progress.save({ childId: state.childId, level: 1, unit: unit.unit, skill: 'reading', score: null, attempts: questions.length, effort: questions.length || 1, ts: Date.now() })
          .then(refreshMastery).then(function () {
            render(el('div', { class: 'result screen stack-lg', style: 'padding-top:var(--sp-7)' }, [
              el('div', { class: 'center' }, piNode('is-cheer is-glowing mascot--lg')),
              el('h1', { class: 'celebrate__title' }, 'Em đã đọc xong! 📖🌟'),
              el('p', { class: 'subtitle' }, 'Em đọc hiểu rất giỏi. Pi tự hào về em!'),
              el('button', { class: 'btn btn--cta btn--block', type: 'button', onclick: function () { go('S3'); } }, 'Về bài học'),
              el('button', { class: 'btn btn--ghost btn--block', type: 'button', onclick: function () { go('S2'); } }, 'Về bản đồ')
            ]));
            confettiBurst();
          });
      }

      var finishBtn = el('button', { class: 'btn btn--cta btn--block', type: 'button', onclick: finish }, 'Xong, em đã đọc! 🌟');
      finishBtn.disabled = questions.length ? true : null;
      function checkAllDone() {
        if (questions.every(function (q) { return doneQ[q.id]; })) finishBtn.disabled = null;
      }

      var qCards = questions.map(function (q, qi) {
        var isTF = q.type === 'truefalse';
        var opts = isTF ? ['Đúng', 'Sai'] : (q.choices || []).slice();
        var correctIdx = isTF ? (q.answer ? 0 : 1) : q.answer;
        var grp = el('div', { class: 'choice-list' });
        opts.forEach(function (label, idx) {
          var kids = [el('span', { class: 'choice__text' + (isTF ? '' : ' en') + ' grow' }, label)];
          if (!isTF) {
            var spk = el('span', { class: 'icon-btn choice__spk', role: 'button', tabindex: '0', 'aria-label': 'Nghe ' + label }, '🔊');
            spk.addEventListener('click', function (e) { e.stopPropagation(); speak(label, { btn: spk }); });
            kids.push(spk);
          }
          kids.push(el('span', { class: 'choice__mark' }, ''));
          var b = el('button', { class: 'choice', type: 'button' }, kids);
          b.addEventListener('click', function () {
            if (doneQ[q.id] || b.classList.contains('is-wrong')) return;
            if (idx === correctIdx) {
              b.classList.add('is-correct'); b.querySelector('.choice__mark').textContent = '✓';
              doneQ[q.id] = true;
              Array.prototype.forEach.call(grp.children, function (x) { x.classList.add('is-disabled'); });
              toast('🌟 Đúng rồi!', '🌟'); checkAllDone();
            } else {
              b.classList.add('is-wrong', 'is-disabled'); b.disabled = true;
              b.querySelector('.choice__mark').textContent = '✗';
              toast('Đọc lại đoạn rồi thử lại nhé 🦊', '🤔');
            }
          });
          grp.appendChild(b);
        });
        return el('div', { class: 'card stack', style: 'gap:var(--sp-3)' }, [
          el('div', { class: 'row', style: 'gap:var(--sp-2);align-items:flex-start' }, [
            el('div', { class: 'q-prompt grow' }, 'Câu ' + (qi + 1) + '. ' + (q.q_vi || q.q || '')),
            q.audioText ? speakerBtn(q.audioText, 'Nghe câu hỏi') : el('span')
          ]),
          grp
        ]);
      });

      render(el('div', { class: 'screen stack-lg' }, [
        el('div', { class: 'row', style: 'justify-content:center' }, [piNode('mascot--sm'), el('div', { class: 'speech' }, 'Đọc đoạn rồi trả lời câu hỏi nhé! 📖')]),
        passageCard
      ].concat(qCards).concat([finishBtn])));
      autoRead(r.text);
    }).catch(function (e) { renderError(e); });
  }

  /* =====================================================================
     S5ph — PHONICS (HỌC): xem âm trọng tâm + từ ví dụ + loa, rồi luyện
     ---------------------------------------------------------------------
     Sư phạm: KHÔNG đọc rời tên chữ ("ây","bi"); mô tả ÂM bằng tiếng Việt
     (soundLabels.say_vi) + neo vào từ quen (anchor). Loa chỉ đọc TỪ TRỌN VẸN.
     ===================================================================== */
  // Dựng câu mô tả âm theo VỊ TRÍ khi content không có say_vi.
  // position hiệu lực: soundLabels[sound].position ?? phonics.position ?? "initial".
  function phonicsPositionCopy(lbl, ph, sound, anchorWord) {
    var pos = (lbl && lbl.position) || (ph && ph.position) || 'initial';
    var ipa = (lbl && lbl.ipa) ? (lbl.ipa + ' ') : '';
    var via = anchorWord ? (' như trong "' + anchorWord + '"') : '';
    if (pos === 'medial') return 'âm ' + ipa + 'ở GIỮA từ' + via;
    if (pos === 'final') return 'âm ' + ipa + 'ở CUỐI từ' + via;
    return 'âm ' + ipa + 'như ĐẦU từ' + via;
  }

  function screenPhonicsLearn() {
    var unitNo = state.currentUnit;
    loadUnit(unitNo).then(function (unit) {
      var ph = unit.phonics;
      if (!ph || !ph.words || !ph.words.length) { renderError(new Error('Unit chưa có phonics.')); return; }
      setHeader({ title: 'Phonics · ' + unit.topic_vi, onBack: function () { go('S3'); } });

      var focus = (ph.focus || []).filter(function (f) {
        return ph.words.some(function (w) { return w.focusSound === f; });
      });

      var soundBlocks = focus.map(function (sound) {
        var lbl = (ph.soundLabels && ph.soundLabels[sound]) || {};
        var sameWords = ph.words.filter(function (w) { return w.focusSound === sound; });

        // Hàng đầu: chữ/âm lớn + nút loa (đọc từ NEO, không đọc tên chữ).
        var anchorWord = lbl.anchor || (sameWords[0] && sameWords[0].word) || '';
        var sayVi = lbl.say_vi || phonicsPositionCopy(lbl, ph, sound, anchorWord);
        var head = el('div', { class: 'sound-card__head' }, [
          el('span', { class: 'sound-card__letter en' }, sound),
          el('span', { class: 'grow' }, [
            el('div', { class: 'sound-card__ipa en' }, lbl.ipa || ''),
            el('div', { class: 'muted', style: 'font-size:var(--fs-sm)' }, sayVi)
          ]),
          anchorWord ? speakerBtn(anchorWord, 'Nghe âm qua từ ' + anchorWord, { accent: true, lg: true }) : el('span')
        ]);

        // Lưới từ ví dụ: icon + từ + loa (đọc TỪ trọn vẹn).
        var wordGrid = el('div', { class: 'sound-words' });
        sameWords.forEach(function (w) {
          var item = el('button', { class: 'sound-word', type: 'button', 'aria-label': 'Nghe ' + w.word }, [
            el('span', { class: 'sound-word__icon' }, w.icon || '🔤'),
            el('span', { class: 'sound-word__row' }, [
              el('span', { class: 'sound-word__text en' }, w.word),
              el('span', { class: 'icon-btn sound-word__spk', 'aria-hidden': 'true' }, '🔊')
            ])
          ]);
          item.addEventListener('click', function () { speak(w.word, { btn: item.querySelector('.sound-word__spk') }); });
          wordGrid.appendChild(item);
        });

        return el('div', { class: 'sound-card' }, [head, wordGrid]);
      });

      var node = el('div', { class: 'screen stack-lg' }, [
        el('div', { class: 'row', style: 'justify-content:center' }, [piNode('mascot--sm'), el('div', { class: 'speech' }, 'Cùng nghe các ÂM nhé! Chạm vào từ để nghe.')]),
        el('div', { class: 'stack' }, soundBlocks),
        el('button', { class: 'btn btn--cta btn--block', type: 'button', onclick: function () { go('S5p'); } }, 'Luyện tập phonics ✍️'),
        el('button', { class: 'btn btn--ghost btn--block', type: 'button', onclick: function () { go('S3'); } }, 'Về unit')
      ]);
      render(node);
      // Ghi nhận đã XEM phần học âm (nỗ lực) — nhẹ, không chấm.
      Progress.save({ childId: state.childId, level: 1, unit: unit.unit, skill: 'phonics', score: null, attempts: 0, effort: 1, ts: Date.now() })
        .then(refreshMastery).catch(function () {});
    }).catch(function (e) { renderError(e); });
  }

  /* =====================================================================
     S8 — PHỤ HUYNH (cổng người lớn)
     ===================================================================== */
  function parentGate() {
    var a = 10 + Math.floor(Math.random() * 9);
    var b = 11 + Math.floor(Math.random() * 9);
    var answer = a * b;
    var input = el('input', { class: 'field', type: 'number', inputmode: 'numeric', 'aria-label': 'Kết quả phép tính' });
    var errLine = el('div', { class: 'muted', style: 'color:var(--c-try-text)', role: 'alert' });
    function submit() {
      if (parseInt(input.value, 10) === answer) { closeModal(); go('S8'); }
      else { errLine.textContent = 'Chưa đúng, thử lại nhé.'; input.value = ''; try { input.focus(); } catch (e) {} }
    }
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
    openModal([
      el('h2', { class: 'title' }, 'Dành cho người lớn'),
      el('p', { class: 'subtitle' }, 'Để vào trang phụ huynh, mời giải: ' + a + ' × ' + b + ' = ?'),
      input,
      errLine,
      el('div', { class: 'row', style: 'gap:var(--sp-3);margin-top:var(--sp-3)' }, [
        el('button', { class: 'btn btn--ghost grow', type: 'button', onclick: closeModal }, 'Huỷ'),
        el('button', { class: 'btn grow', type: 'button', onclick: submit }, 'Vào')
      ])
    ]);
  }

  function screenParent() {
    refreshMastery().then(function () {
      setHeader({ title: 'Trang phụ huynh', onBack: function () { go('S2'); }, hideAvatar: true });
      var children = Progress.listChildren();
      var blocks = [];

      blocks.push(el('div', { class: 'card stack' }, [
        el('h2', { class: 'title' }, 'Đồng hành cùng con'),
        el('p', { class: 'subtitle' }, 'Đây là nơi xem con đang học gì và mạnh/yếu ở đâu — không phải bảng điểm. Hãy khen nỗ lực của con nhé!')
      ]));

      // Gom mastery của mọi bé TRƯỚC rồi render một lần (tránh append bất đồng bộ chồng nhau).
      Promise.all(children.map(function (c) { return Progress.getMastery(c.childId); })).then(function (masteries) {
        children.forEach(function (c, ci) {
          var card = el('div', { class: 'card stack' });
          card.appendChild(el('div', { class: 'row' }, [el('span', { class: 'profile-card__avatar' }, c.avatar), el('h3', { class: 'title', style: 'font-size:var(--fs-lg)' }, c.name)]));
          var m = masteries[ci] || { units: [] };
          var units = m.units || [];
          if (!units.length) {
            card.appendChild(el('p', { class: 'muted' }, 'Con chưa học buổi nào — cùng bắt đầu chủ đề đầu tiên nhé!'));
          } else {
            units.forEach(function (u) {
              var meta = (state.levelIndex && state.levelIndex.units || []).filter(function (x) { return x.unit === u.unit; })[0];
              card.appendChild(el('div', { style: 'margin-top:var(--sp-3)' }, [
                el('div', { style: 'font-weight:var(--fw-bold)' }, (meta ? meta.topic_vi : 'Unit ' + u.unit) + ' — ' + u.masteryPct + '% thành thạo'),
                skillBar('Từ vựng', u.bySkill.vocab),
                skillBar('Ngữ pháp', u.bySkill.grammar),
                skillBar('Phonics', u.bySkill.phonics),
                speakRow('Luyện nói', u.bySkill.speaking)
              ]));
            });
            card.appendChild(el('div', { class: 'feedback feedback--correct', style: 'margin-top:var(--sp-4)' }, [
              el('span', { class: 'feedback__icon' }, '💡'),
              el('div', { class: 'feedback__body' }, [el('div', { class: 'feedback__title' }, 'Chơi cùng con 5 phút'), el('div', null, 'Chỉ vào đồ vật quanh nhà và hỏi con "What\'s this?" để con trả lời "It\'s a ...".')])
            ]));
          }
          blocks.push(card);
        });

        // Mục tiêu tuần mềm + công tắc
        blocks.push(el('div', { class: 'card stack' }, [
          el('h3', { class: 'title', style: 'font-size:var(--fs-lg)' }, 'Mục tiêu & dữ liệu'),
          toggleRow('Mục tiêu tuần mềm (4 ngày/tuần)', state.settings.weekGoal !== false, function (on) { state.settings.weekGoal = on; saveSettings(); }),
          el('div', { class: 'row', style: 'gap:var(--sp-3);flex-wrap:wrap;margin-top:var(--sp-3)' }, [
            el('button', { class: 'btn btn--ghost', type: 'button', onclick: exportData }, '⬇ Export JSON'),
            el('button', { class: 'btn btn--ghost', type: 'button', onclick: importDataPrompt }, '⬆ Import JSON')
          ]),
          el('p', { class: 'muted', style: 'font-size:var(--fs-sm)' }, 'Không có bảng xếp hạng, không so sánh giữa các con, không điểm phát âm, không đếm giờ.')
        ]));

        render(el('div', { class: 'screen stack-lg container--wide' }, blocks));
      });
    });
  }

  function skillBar(name, pct) {
    pct = pct || 0;
    return el('div', { class: 'mastery-row' }, [
      el('span', { class: 'name' }, name),
      el('div', { class: 'progress grow' }, el('div', { class: 'progress__fill', style: '--_pct:' + pct + '%' })),
      el('span', { class: 'progress__pct' }, pct + '%')
    ]);
  }
  function speakRow(name, pct) {
    return el('div', { class: 'mastery-row' }, [
      el('span', { class: 'name' }, name),
      el('span', { class: pct > 0 ? 'chip chip--done' : 'chip' }, pct > 0 ? '✓ Đã luyện' : 'Chưa luyện')
    ]);
  }

  function exportData() {
    try {
      var data = Progress.exportData();
      var blob = new Blob([data], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'tien-do-hoc-tienganh.json';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      toast('Đã lưu file tiến độ.', '⬇');
    } catch (e) { toast('Không export được.', '⚠️'); }
  }
  function importDataPrompt() {
    var inp = el('input', { type: 'file', accept: 'application/json,.json', style: 'display:none' });
    document.body.appendChild(inp);
    inp.addEventListener('change', function () {
      var f = inp.files && inp.files[0];
      if (!f) { document.body.removeChild(inp); return; }
      var reader = new FileReader();
      reader.onload = function () {
        var res = Progress.importData(reader.result);
        document.body.removeChild(inp);
        if (res.ok) { toast('Đã nhập tiến độ (' + res.mergedChildren + ' bé).', '⬆'); refreshMastery().then(screenParent); }
        else toast('File không hợp lệ.', '⚠️');
      };
      reader.readAsText(f);
    });
    inp.click();
  }

  /* =====================================================================
     S9 — CÀI ĐẶT
     ===================================================================== */
  function screenSettings() {
    setHeader({ title: 'Cài đặt', onBack: function () { go(state.childId ? 'S2' : 'S1'); }, hideAvatar: true });
    var s = state.settings;
    function apply() { saveSettings(); applySettings(); }
    var node = el('div', { class: 'screen stack-lg' }, [
      el('div', { class: 'card stack' }, [
        el('h2', { class: 'title' }, 'Cài đặt'),
        toggleRow('Tự đọc đề khi mở bài', s.autoRead, function (on) { s.autoRead = on; apply(); }),
        toggleRow('Âm thanh', s.sound, function (on) { s.sound = on; apply(); }),
        voiceSourceRow(),
        toggleRow('Hiệu ứng động', s.motion, function (on) { s.motion = on; apply(); }),
        toggleRow('Tương phản cao', s.contrast === 'high', function (on) { s.contrast = on ? 'high' : 'normal'; apply(); }),
        toggleRow('Cỡ chữ lớn', s.fontSize === 'large', function (on) { s.fontSize = on ? 'large' : 'normal'; apply(); }),
        choiceRow('Tốc độ đọc', [['normal', 'Thường'], ['slow', 'Chậm']], s.speed, function (v) { s.speed = v; apply(); }),
        choiceRow('Giọng máy (dự phòng)', [['en-GB', 'Anh-Anh'], ['en-US', 'Anh-Mỹ']], s.voice, function (v) { s.voice = v; apply(); })
      ])
    ]);
    if (TTS && !TTS.hasEnglishVoice() && !(window.AudioPlay && AudioPlay.usingBaked && AudioPlay.usingBaked())) {
      node.appendChild(el('div', { class: 'tts-warn' }, '⚠️ Máy chưa có giọng tiếng Anh. Chọn "Giọng tải sẵn" ở mục Giọng đọc để nghe được nhé.'));
    }
    render(node);
  }

  function toggleRow(label, checked, onChange) {
    var input = el('input', { type: 'checkbox', 'aria-label': label });
    if (checked) input.checked = true;
    input.addEventListener('change', function () { onChange(input.checked); });
    return el('label', { class: 'setting-row' }, [
      el('span', null, label),
      el('span', { class: 'switch' }, [input, el('span', { class: 'switch__track' })])
    ]);
  }
  // Mục "Giọng đọc" — chọn nguồn phát âm (áp dụng TOÀN site). Chỉ hiện khi có giọng tải sẵn.
  function voiceSourceRow() {
    if (!window.AudioPlay) return el('span', { style: 'display:none' });
    var voices = AudioPlay.availableVoices();
    if (voices.length < 2) return el('span', { style: 'display:none' }); // chỉ có "giọng máy" → không cần chọn
    var opts = voices.map(function (v) { return [v.id, v.label]; });
    return choiceRow('Giọng đọc', opts, AudioPlay.getVoice(), function (v) {
      AudioPlay.setVoice(v);
      speak(v === 'device' ? 'Hello!' : "Hello! I'm Pi."); // nghe thử ngay
      screenSettings(); // vẽ lại để chip cập nhật
    });
  }
  function choiceRow(label, options, current, onChange) {
    var row = el('div', { class: 'setting-row' });
    row.appendChild(el('span', null, label));
    var group = el('div', { class: 'row', style: 'gap:var(--sp-2)' });
    options.forEach(function (o) {
      var b = el('button', { class: 'chip' + (o[0] === current ? ' chip--star' : ''), type: 'button', style: o[0] === current ? '' : 'background:var(--c-surface-2)' }, o[1]);
      b.addEventListener('click', function () {
        onChange(o[0]);
        Array.prototype.forEach.call(group.children, function (c) { c.className = 'chip'; c.style.background = 'var(--c-surface-2)'; });
        b.className = 'chip chip--star'; b.style.background = '';
      });
      group.appendChild(b);
    });
    row.appendChild(group);
    return row;
  }

  /* =====================================================================
     ĐIỂM DỪNG TÍCH CỰC
     ===================================================================== */
  function positiveStop() {
    openModal([
      el('div', { class: 'center' }, piNode('is-cheer is-glowing')),
      el('h2', { class: 'title' }, 'Hôm nay em học giỏi lắm rồi!'),
      el('p', { class: 'subtitle' }, 'Nghỉ một chút cho đôi mắt nhé. 👀'),
      el('div', { class: 'stack', style: 'margin-top:var(--sp-4)' }, [
        el('button', { class: 'btn btn--cta btn--block', type: 'button', onclick: function () { closeModal(); state.stagesThisSession = 0; go('S2'); } }, 'Tạm biệt Pi 👋'),
        el('button', { class: 'btn btn--ghost btn--block', type: 'button', onclick: function () { closeModal(); state.stagesThisSession = 0; go('S3'); } }, 'Học thêm một chút')
      ])
    ], { noClose: true });
  }

  function pauseConfirm(unit, sess, skill) {
    // Tạm dừng giữa chừng: lưu phần đã làm (effort) rồi về S3.
    // effort >= 1 khi đã có ít nhất 1 lần thử, kể cả chưa bấm "Tiếp" sang câu mới
    // (thiên NỖ LỰC: mọi lượt có attempt đều được ghi nhận để mở khoá unit kế).
    if (sess.attempts > 0) {
      var effort = Math.max(1, sess.idx);
      Progress.save({ childId: state.childId, level: 1, unit: unit.unit, skill: skill, score: null, attempts: sess.attempts, effort: effort, ts: Date.now() })
        .then(refreshMastery).then(function () { go('S3'); });
    } else go('S3');
  }

  /* =====================================================================
     MODAL / OVERLAY
     ===================================================================== */
  var modalPrevFocus = null;   // phần tử có focus trước khi mở modal (để trả lại)
  var modalKeyHandler = null;
  function focusableIn(root) {
    return Array.prototype.slice.call(root.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(function (n) { return !n.disabled && n.offsetParent !== null; });
  }
  function openModal(children, opts) {
    opts = opts || {};
    closeModal();
    modalPrevFocus = document.activeElement;   // nhớ để trả focus khi đóng
    var modal = el('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' });
    if (!opts.noClose) {
      modal.appendChild(el('button', { class: 'icon-btn', style: 'position:absolute;top:8px;right:8px', type: 'button', 'aria-label': 'Đóng', onclick: closeModal }, '✕'));
    }
    appendKids(modal, children);
    var overlay = el('div', { class: 'overlay', id: 'modalOverlay' }, modal);
    if (!opts.noClose) overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.getElementById('fx').appendChild(overlay);

    // Focus phần tử đầu (ưu tiên input để gõ ngay); bẫy Tab trong modal; Esc để đóng.
    var focusables = focusableIn(modal);
    var firstInput = modal.querySelector('input, textarea, select');
    var toFocus = firstInput || focusables[0];
    if (toFocus) setTimeout(function () { try { toFocus.focus(); } catch (e) {} }, 30);

    modalKeyHandler = function (e) {
      if (e.key === 'Escape' && !opts.noClose) { e.preventDefault(); closeModal(); return; }
      if (e.key === 'Tab') {
        var f = focusableIn(modal);
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', modalKeyHandler, true);
  }
  function closeModal() {
    if (modalKeyHandler) { document.removeEventListener('keydown', modalKeyHandler, true); modalKeyHandler = null; }
    var o = document.getElementById('modalOverlay');
    if (o && o.parentNode) o.parentNode.removeChild(o);
    if (modalPrevFocus && typeof modalPrevFocus.focus === 'function') {
      try { modalPrevFocus.focus(); } catch (e) {}
    }
    modalPrevFocus = null;
  }

  /* =====================================================================
     TIỆN ÍCH BÀI TẬP
     ===================================================================== */
  function stripPromptForRead(prompt) {
    // Đọc cả hướng dẫn VN; loại bớt "___" để TTS không đọc gạch.
    return String(prompt || '').replace(/_+/g, ' chỗ trống ');
  }
  function randItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function normEq(a, b) {
    return String(a).toLowerCase().replace(/\s+/g, ' ').trim() === String(b).toLowerCase().replace(/\s+/g, ' ').trim();
  }
  // Suy các phương án cho fill_blank: nếu đáp án là a/an → đưa [a, an]; nếu là my/your → [my, your];
  // còn lại đưa đáp án + vài từ vocab gần.
  function fillOptionsFor(ex, unit) {
    var ans = String(ex.answer);
    var low = ans.toLowerCase();
    if (low === 'a' || low === 'an') return shuffleArr(['a', 'an']);
    if (low === 'my' || low === 'your') return shuffleArr(['my', 'your']);
    if (low === 'yes' || low === 'no') return shuffleArr(['Yes', 'No']);
    // Đáp án là một danh từ vocab → tạo 4 lựa chọn (đáp án + 3 noun khác).
    // An toàn ngữ pháp: nếu prompt có mạo từ "a"/"an" cố định, chỉ lấy nhiễu CÙNG
    // mạo từ để mọi lựa chọn đều đúng a/an (tránh dạy mẫu sai như "an bag").
    if (unit && unit.vocab && unit.vocab.length >= 4) {
      var words = unit.vocab.map(function (v) { return v.word; });
      if (words.indexOf(ans) !== -1) {
        var pool = words.filter(function (w) { return w !== ans; });
        var m = /\b(an|a)\s+_+/i.exec(ex.prompt || '');
        if (m) {
          // Có mạo từ cố định trong đề → ƯU TIÊN nhiễu cùng mạo từ (mọi lựa chọn đúng a/an).
          var art = m[1].toLowerCase();
          var same = pool.filter(function (w) { return articleOf(w) === art; });
          // Đủ nhiễu cùng mạo từ → dùng (an toàn nhất, không gợi mẫu a/an sai).
          // Nếu thiếu (vd noun nguyên âm hiếm) → vẫn cho CHỌN từ (đỡ buộc trẻ gõ): lựa chọn
          // chỉ hiển thị TỪ + icon, không ghép vào câu nên không phơi "an bag"; đáp án đúng
          // vẫn là noun đúng mạo từ trong đề.
          pool = (same.length >= 3) ? same : pool;
        }
        if (pool.length >= 3) {
          var others = shuffleArr(pool).slice(0, 3);
          return shuffleArr([ans].concat(others));
        }
        // Ít hơn 3 nhiễu: vẫn cho chọn nếu có ≥1 nhiễu (2 lựa chọn trở lên), tránh ô nhập.
        if (pool.length >= 1) return shuffleArr([ans].concat(pool));
      }
    }
    return null; // để ô nhập (fallback rất hiếm)
  }
  function shuffleArr(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function articleOf(word) {
    var f = String(word).trim().charAt(0).toLowerCase();
    return ['a', 'e', 'i', 'o', 'u'].indexOf(f) !== -1 ? 'an' : 'a';
  }
  // Tìm icon cho 1 lựa chọn (nếu trùng một từ vocab) để mcq vocab có hình.
  function iconForWord(unit, choice) {
    if (!unit || !unit.vocab) return null;
    var c = String(choice).toLowerCase().replace(/[.?!]/g, '').trim();
    var hit = unit.vocab.filter(function (v) { return String(v.word).toLowerCase() === c; })[0];
    return hit ? hit.icon : null;
  }
  function collectSpeakSentences(unit) {
    var out = [];
    // Bài lớn: ưu tiên câu mẫu trong phần "nói" (speaking[].audioModels).
    if (Array.isArray(unit.speaking)) {
      unit.speaking.forEach(function (t) {
        (t.audioModels || []).forEach(function (s) { if (s && out.indexOf(s) === -1) out.push(s); });
      });
    }
    // "Làm quen" (recognition, vd can/can't ở Bài 5): cho trẻ nghe & nói câu mẫu.
    if (Array.isArray(unit.recognition)) {
      unit.recognition.forEach(function (rc) {
        (rc.examples || []).forEach(function (s) { if (s && out.indexOf(s) === -1) out.push(s); });
      });
    }
    (unit.vocab || []).slice(0, 4).forEach(function (v) { if (v.example && out.indexOf(v.example) === -1) out.push(v.example); });
    (unit.grammar || []).forEach(function (g) { (g.examples || []).slice(0, 2).forEach(function (e) { if (out.indexOf(e) === -1) out.push(e); }); });
    return out.slice(0, 8);
  }

  /* =====================================================================
     LỖI
     ===================================================================== */
  function renderError(e) {
    render(el('div', { class: 'screen stack-lg', style: 'padding-top:var(--sp-7)' }, [
      el('div', { class: 'center' }, piNode('mascot--lg')),
      el('h1', { class: 'title text-center' }, 'Ối, có chút trục trặc'),
      el('p', { class: 'subtitle text-center' }, (e && e.message) || 'Không tải được bài học.'),
      el('button', { class: 'btn btn--cta btn--block', type: 'button', onclick: function () { go('S2'); } }, 'Về bản đồ')
    ]));
  }

  /* =====================================================================
     ROUTER
     ===================================================================== */
  function go(screen) {
    var eng = audioEngine(); if (eng && eng.cancel) eng.cancel();
    closeModal();
    switch (screen) {
      case 'S0': screenOnboarding(); break;
      case 'S1': screenProfiles(); break;
      case 'S2': screenMap(); break;
      case 'S3': screenUnitMenu(); break;
      case 'S4': screenFlashcards(); break;
      case 'S5': screenPractice(null); break;
      case 'S5p': screenPractice('phonics'); break;
      case 'S5ph': screenPhonicsLearn(); break;
      case 'S5l': screenPractice('listen'); break;
      case 'S5r': screenReading(); break;
      case 'S6': screenSpeaking(); break;
      case 'S8': screenParent(); break;
      case 'S9': screenSettings(); break;
      default: screenMap();
    }
  }

  /* =====================================================================
     KHỞI ĐỘNG
     ===================================================================== */
  function init() {
    applySettings();
    if (TTS) TTS.setOnMissingVoice(showTtsWarn);
    // Tải danh mục audio baked (mp3 sinh sẵn) để ưu tiên giọng chuẩn; lỗi/file:// → fallback TTS.
    if (window.AudioPlay) AudioPlay.loadManifest();

    // Đăng ký service worker khi phục vụ qua http/https (không chạy trên file://).
    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }

    loadLevelIndex().then(function () {
      var active = Progress.getActiveChildId();
      var children = Progress.listChildren();
      if (active && children.some(function (c) { return c.childId === active; })) {
        state.childId = active;
        go('S2');
      } else if (children.length) {
        go('S1');
      } else {
        go('S0');
      }
    }).catch(function (e) { renderError(e); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // phơi ra để debug nếu cần
  window.App = { go: go, state: state };
})();
