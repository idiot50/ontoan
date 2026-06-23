/*
 * engine.selftest.js — Tự kiểm vài BẤT BIẾN của engine (CONTRACTS §2.4).
 * Chạy:  node web_tienganh/js/engine.selftest.js
 * Hoặc nhúng <script> sau engine.js trong trình duyệt: mở Console để xem log.
 *
 * KHÔNG phải bộ test đầy đủ của QA — chỉ là kiểm tra nhanh "khói" (smoke test)
 * trên content thật (unit01, unit02) để bắt lỗi rõ ràng sớm.
 */
(function () {
  'use strict';

  // Nạp Engine + content cho cả Node lẫn trình duyệt.
  //   U1  = unit01 (phonics ĐA ÂM: a,b,c,d) — chế độ "phân biệt âm".
  //   U2  = unit02 (phonics đa âm: e,f,g,h).
  //   U10 = unit10 (phonics ĐƠN ÂM: chỉ âm 'a') — chế độ "nghe-chọn từ cùng họ âm".
  var Engine, U1, U2, U10;
  if (typeof require !== 'undefined') {
    var path = require('path');
    Engine = require(path.join(__dirname, 'engine.js'));
    U1 = require(path.join(__dirname, '..', 'content', 'level1', 'unit01.json'));
    U2 = require(path.join(__dirname, '..', 'content', 'level1', 'unit02.json'));
    U10 = require(path.join(__dirname, '..', 'content', 'level1', 'unit10.json'));
  } else {
    Engine = window.Engine;
    U1 = window.__UNIT01__; // frontend gán sẵn nếu chạy trên trình duyệt
    U2 = window.__UNIT02__;
    U10 = window.__UNIT10__;
  }

  var pass = 0, fail = 0;
  function ok(name) { pass++; console.log('  ✓ ' + name); }
  function bad(name, e) { fail++; console.error('  ✗ ' + name + '  →  ' + (e && e.message ? e.message : e)); }
  function check(name, fn) { try { fn(); ok(name); } catch (e) { bad(name, e); } }
  function assert(cond, msg) { if (!cond) throw new Error(msg || 'assert thất bại'); }

  function grammar(unit, id) {
    var g = unit.grammar.filter(function (x) { return x.id === id; })[0];
    if (!g) throw new Error('không thấy grammar ' + id);
    return g;
  }
  function deepEq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

  console.log('\n=== ENGINE SELF-TEST ===');

  // --- BẤT BIẾN 3: TÁI LẬP (deterministic theo seed) ---
  check('Tái lập: cùng seed => cùng kết quả (fill_blank)', function () {
    var spec = { type: 'fill_blank', level: 1, unit: 2, grammar: grammar(U2, 'is-this-your') };
    var a = Engine.generate(spec, 12345);
    var b = Engine.generate(spec, 12345);
    assert(deepEq(a, b), 'hai lần cùng seed phải bằng nhau');
  });

  check('Tái lập: cùng seed => cùng kết quả (mcq grammar)', function () {
    var spec = { type: 'mcq', level: 1, unit: 1, grammar: grammar(U1, 'what-is-this') };
    var a = Engine.generate(spec, 777);
    var b = Engine.generate(spec, 777);
    assert(deepEq(a, b), 'mcq cùng seed phải bằng nhau');
  });

  // --- BẤT BIẾN 5: explain VN không rỗng (mọi seed, mọi loại) ---
  check('explain luôn không rỗng (fill_blank, 30 seed)', function () {
    var spec = { type: 'fill_blank', level: 1, unit: 1, grammar: grammar(U1, 'a-or-an') };
    for (var s = 0; s < 30; s++) {
      var ex = Engine.generate(spec, s);
      assert(ex.explain && ex.explain.trim().length > 0, 'explain rỗng ở seed ' + s);
    }
  });

  // --- BẤT BIẾN 2: a/an luôn ĐÚNG khi fill_blank slot 'art' ---
  check('fill_blank a/an: đáp án khớp nguyên âm/phụ âm (50 seed)', function () {
    var spec = { type: 'fill_blank', level: 1, unit: 1, grammar: grammar(U1, 'a-or-an') };
    var vowels = ['a', 'e', 'i', 'o', 'u'];
    for (var s = 0; s < 50; s++) {
      var ex = Engine.generate(spec, s);
      // prompt dạng: "Điền vào chỗ trống: It's ___ apple."
      var m = ex.prompt.match(/___\s+([a-zA-Z]+)/);
      assert(m, 'không tách được noun ở seed ' + s + ': ' + ex.prompt);
      var noun = m[1].toLowerCase();
      var expect = vowels.indexOf(noun.charAt(0)) !== -1 ? 'an' : 'a';
      assert(ex.answer === expect,
        'seed ' + s + ': noun "' + noun + '" cần "' + expect + '" nhưng engine trả "' + ex.answer + '"');
    }
  });

  // --- BẤT BIẾN 1 & 4: mcq có ĐÚNG 1 đáp án + choices hợp lệ ---
  check('mcq grammar: ≥4 choices, duy nhất, đúng 1 đáp án (40 seed)', function () {
    var specs = [
      { type: 'mcq', level: 1, unit: 1, grammar: grammar(U1, 'what-is-this') },
      { type: 'mcq', level: 1, unit: 1, grammar: grammar(U1, 'a-or-an') },
      { type: 'mcq', level: 1, unit: 2, grammar: grammar(U2, 'my-your') },
      { type: 'mcq', level: 1, unit: 2, grammar: grammar(U2, 'is-this-your') }
    ];
    for (var i = 0; i < specs.length; i++) {
      for (var s = 0; s < 40; s++) {
        var ex = Engine.generate(specs[i], s);
        assert(ex.choices.length >= 4, 'cần ≥4 choices');
        var lower = ex.choices.map(function (c) { return c.toLowerCase().replace(/\s+/g, ' ').trim(); });
        assert(new Set(lower).size === lower.length, 'choices trùng ở ' + specs[i].grammar.id + ' seed ' + s + ': ' + JSON.stringify(ex.choices));
        assert(typeof ex.answer === 'number' && ex.answer >= 0 && ex.answer < ex.choices.length, 'answer ngoài khoảng');
        // Đáp án đúng phải là câu hợp lệ (không nằm trong distractors lỗi).
        var distrSet = new Set((specs[i].grammar.safeZone.distractors || []).map(function (d) {
          return d.toLowerCase().replace(/\s+/g, ' ').trim();
        }));
        var correctStr = lower[ex.answer];
        assert(!distrSet.has(correctStr), 'đáp án đúng lại là 1 câu nhiễu (sai)! ' + specs[i].grammar.id + ' seed ' + s);
      }
    }
  });

  // --- mcq vocab ---
  check('mcq vocab: hỏi nghĩa -> chọn từ EN, đúng 1 đáp án (30 seed)', function () {
    var spec = { type: 'mcq', level: 1, unit: 1, vocabPool: U1.vocab };
    for (var s = 0; s < 30; s++) {
      var ex = Engine.generate(spec, s);
      assert(ex.choices.length >= 4, 'cần ≥4 choices');
      assert(typeof ex.answer === 'number', 'answer phải là chỉ số');
      var lower = ex.choices.map(function (c) { return c.toLowerCase(); });
      assert(new Set(lower).size === lower.length, 'từ trùng');
    }
  });

  // --- BẤT BIẾN order_words: answer là hoán vị của tokens ---
  check('order_words: tokens là hoán vị của answer, ≥2 từ (40 seed)', function () {
    var specs = [
      { type: 'order_words', level: 1, unit: 1, grammar: grammar(U1, 'what-is-this') },
      { type: 'order_words', level: 1, unit: 2, grammar: grammar(U2, 'my-your') },
      { type: 'order_words', level: 1, unit: 2, grammar: grammar(U2, 'is-this-your') }
    ];
    for (var i = 0; i < specs.length; i++) {
      for (var s = 0; s < 40; s++) {
        var ex = Engine.generate(specs[i], s);
        assert(ex.answer.length >= 2, 'câu cần ≥2 từ');
        var a = ex.answer.slice().sort();
        var t = ex.tokens.slice().sort();
        assert(deepEq(a, t), 'tokens không phải hoán vị của answer ở ' + specs[i].grammar.id + ' seed ' + s);
        // tokens phải KHÁC thứ tự đúng (trừ khi mọi thẻ giống hệt nhau — không xảy ra ở content này).
        var distinctTok = new Set(ex.answer).size;
        if (distinctTok > 1) {
          assert(!deepEq(ex.tokens, ex.answer),
            'order_words: đề đã sẵn đúng thứ tự ở ' + specs[i].grammar.id + ' seed ' + s);
        }
      }
    }
  });

  // --- transform (unit02 is-this-your có Yes/No qua answer-pairs) ---
  check('transform: Yes <-> No đúng cặp, KHÔNG rò slot, audio = đáp án (20 seed)', function () {
    var spec = { type: 'transform', level: 1, unit: 2, grammar: grammar(U2, 'is-this-your') };
    for (var s = 0; s < 20; s++) {
      var ex = Engine.generate(spec, s);
      assert(ex.answer === 'Yes, it is.' || ex.answer === "No, it isn't.", 'transform answer bất ngờ: ' + ex.answer);
      // BẤT BIẾN §2.4.2: không câu nào còn slot chưa điền.
      assert(!/\{[a-zA-Z0-9_]+\}/.test(ex.prompt), 'prompt rò slot: ' + ex.prompt);
      assert(!/\{[a-zA-Z0-9_]+\}/.test(ex.answer), 'answer rò slot: ' + ex.answer);
      assert(ex.audioText === ex.answer, 'audioText phải đọc đúng câu đáp án (vế ngược)');
    }
  });

  // transform phải KHỚP cặp answer-pairs (Yes<->No, No<->Yes) — kiểm 2 chiều.
  check('transform: vế ngược khớp answer-pairs trong content (40 seed)', function () {
    var g = grammar(U2, 'is-this-your');
    var pairs = g.safeZone.answerKey['answer-pairs'];
    var spec = { type: 'transform', level: 1, unit: 2, grammar: g };
    for (var s = 0; s < 40; s++) {
      var ex = Engine.generate(spec, s);
      // tách "from" trong prompt: Đổi ... : "FROM"
      var m = ex.prompt.match(/"([^"]+)"\s*$/);
      assert(m, 'không tách được câu nguồn từ prompt: ' + ex.prompt);
      var from = m[1];
      assert(pairs[from] === ex.answer,
        'vế ngược sai: from="' + from + '" -> "' + ex.answer + '" (mong "' + pairs[from] + '")');
    }
  });

  // transform KHẲNG ĐỊNH -> PHỦ ĐỊNH (unit10 he-she-hasnt-got): lời giải TRUNG TÍNH,
  // KHÔNG được gán "nghĩa là ĐÚNG/KHÔNG" (fix P4-thấp). Vế ngược khớp answer-pairs.
  check('transform khẳng định->phủ định (unit10): lời giải KHÔNG gán ĐÚNG/KHÔNG (30 seed)', function () {
    var g = grammar(U10, 'he-she-hasnt-got');
    var pairs = g.safeZone.answerKey['answer-pairs'];
    var spec = { type: 'transform', level: 1, unit: 10, grammar: g };
    for (var s = 0; s < 30; s++) {
      var ex = Engine.generate(spec, s);
      var m = ex.prompt.match(/"([^"]+)"\s*$/);
      assert(m, 'không tách được câu nguồn: ' + ex.prompt);
      var from = m[1];
      assert(pairs[from] === ex.answer,
        'vế ngược sai: "' + from + '" -> "' + ex.answer + '" (mong "' + pairs[from] + '")');
      // Đáp án là dạng phủ định (hasn't).
      assert(/hasn['’]t/.test(ex.answer), 'đáp án phải là dạng phủ định: ' + ex.answer);
      // LỖI CŨ: explain ghi "nghĩa là ĐÚNG/KHÔNG" cho câu khẳng định -> phải KHÔNG còn.
      assert(!/nghĩa là (ĐÚNG|KHÔNG)/.test(ex.explain),
        'explain vẫn gán ĐÚNG/KHÔNG sai ngữ cảnh ở seed ' + s + ': ' + ex.explain);
      // Lời giải phải nhắc PHỦ ĐỊNH.
      assert(/PHỦ ĐỊNH/.test(ex.explain), 'explain nên mô tả phép đổi PHỦ ĐỊNH: ' + ex.explain);
      // prompt cũng không yêu cầu "nghĩa ngược lại" (vốn dành cho Yes/No).
      assert(/PHỦ ĐỊNH/.test(ex.prompt), 'prompt nên yêu cầu đổi sang PHỦ ĐỊNH: ' + ex.prompt);
    }
  });

  // transform Yes/No (unit02) GIỮ lời giải ĐÚNG/KHÔNG (không bị sửa nhầm).
  check('transform Yes/No (unit02): GIỮ lời giải ĐÚNG/KHÔNG (20 seed)', function () {
    var spec = { type: 'transform', level: 1, unit: 2, grammar: grammar(U2, 'is-this-your') };
    for (var s = 0; s < 20; s++) {
      var ex = Engine.generate(spec, s);
      assert(/nghĩa là (ĐÚNG|KHÔNG)/.test(ex.explain),
        'Yes/No phải giữ lời giải ĐÚNG/KHÔNG ở seed ' + s + ': ' + ex.explain);
    }
  });

  // ====================================================================
  //  PHA P4 — KIỂM ĐẦY ĐỦ phonics_pick & listen_choose trên CONTENT THẬT
  // ====================================================================

  // Tiện ích: bản đồ word -> focusSound của một phonics block.
  function soundMap(phonics) {
    var m = {};
    phonics.words.forEach(function (x) { m[x.word] = x.focusSound; });
    return m;
  }
  // Bất biến CHUNG cho mọi bài phonics_pick (áp cho cả 2 chế độ).
  function assertPhonicsCommon(ex, s) {
    assert(ex.type === 'phonics_pick', 'type sai ở seed ' + s);
    assert(ex.choices.length >= 4, 'cần ≥4 lựa chọn ở seed ' + s);
    // BẤT BIẾN 6: audioText là TỪ TRỌN VẸN (không đọc rời âm vị / tên chữ).
    assert(ex.audioText && ex.audioText.indexOf(' ') === -1, 'audioText phải là 1 từ trọn vẹn ở seed ' + s + ': ' + ex.audioText);
    assert(ex.audioText === ex.choices[ex.answer], 'audioText phải là TỪ ĐÁP ÁN ở seed ' + s);
    // BẤT BIẾN 4: choices duy nhất + answer trong khoảng.
    var low = ex.choices.map(function (c) { return c.toLowerCase(); });
    assert(new Set(low).size === low.length, 'choices trùng ở seed ' + s + ': ' + JSON.stringify(ex.choices));
    assert(typeof ex.answer === 'number' && ex.answer >= 0 && ex.answer < ex.choices.length, 'answer ngoài khoảng ở seed ' + s);
    // BẤT BIẾN 5: explain VN không rỗng.
    assert(ex.explain && ex.explain.trim().length > 0, 'explain rỗng ở seed ' + s);
    // SƯ PHẠM: prompt diễn đạt theo ÂM/nghe, KHÔNG đọc rời tên chữ.
    assert(/[ÂâÁáàã]m|nghe/i.test(ex.prompt), 'prompt phải nói về ÂM/nghe ở seed ' + s + ': ' + ex.prompt);
  }

  // --- phonics_pick CHẾ ĐỘ ĐA ÂM (unit01: a,b,c,d) — nhiễu PHẢI khác âm ---
  check('phonics_pick ĐA ÂM (unit01): đáp án đúng âm, nhiễu KHÁC âm, đúng 1 đáp án (40 seed)', function () {
    var spec = { type: 'phonics_pick', level: 1, unit: 1, phonics: U1.phonics };
    var byWord = soundMap(U1.phonics);
    for (var s = 0; s < 40; s++) {
      var ex = Engine.generate(spec, s);
      assertPhonicsCommon(ex, s);
      var sound = byWord[ex.choices[ex.answer]];
      assert(sound !== undefined, 'đáp án không có trong phonics.words ở seed ' + s);
      // Mọi nhiễu phải thuộc âm KHÁC -> đảm bảo ĐÚNG 1 đáp án theo âm.
      for (var c = 0; c < ex.choices.length; c++) {
        if (c === ex.answer) continue;
        assert(byWord[ex.choices[c]] !== sound,
          'nhiễu "' + ex.choices[c] + '" trùng âm với đáp án ở seed ' + s);
      }
    }
  });

  // --- phonics_pick CHẾ ĐỘ ĐƠN ÂM (unit10: chỉ âm 'a') — nghe-chọn trong họ âm ---
  // Unit này KHÔNG có âm khác để làm nhiễu; engine phải tự chuyển sang chế độ
  // "nghe và chọn đúng từ" với nhiễu là TỪ KHÁC cùng âm (vẫn đúng-1 đáp án).
  check('phonics_pick ĐƠN ÂM (unit10): tự chuyển chế độ nghe-chọn, KHÔNG ném lỗi (40 seed)', function () {
    var spec = { type: 'phonics_pick', level: 1, unit: 10, phonics: U10.phonics };
    var byWord = soundMap(U10.phonics);
    // Xác nhận unit10 đúng là ĐƠN ÂM (chỉ 1 focusSound) — nếu content đổi, test này cần xem lại.
    var distinctSounds = new Set(U10.phonics.words.map(function (w) { return w.focusSound; }));
    assert(distinctSounds.size === 1, 'fixture unit10 không còn đơn âm (đã có ' + distinctSounds.size + ' âm)');
    for (var s = 0; s < 40; s++) {
      var ex = Engine.generate(spec, s); // KHÔNG được ném lỗi
      assertPhonicsCommon(ex, s);
      // Đáp án và mọi lựa chọn đều là từ hợp lệ trong cùng họ âm.
      for (var c = 0; c < ex.choices.length; c++) {
        assert(byWord[ex.choices[c]] !== undefined,
          'lựa chọn "' + ex.choices[c] + '" không thuộc phonics.words ở seed ' + s);
      }
      // Đúng-1 đáp án: từ đáp án chỉ xuất hiện 1 lần (choices đã duy nhất).
      assert(ex.choices.filter(function (w) { return w === ex.choices[ex.answer]; }).length === 1,
        'đáp án xuất hiện nhiều lần ở seed ' + s);
    }
  });

  // --- phonics_pick TÁI LẬP (deterministic) trên cả 2 chế độ ---
  check('phonics_pick: cùng seed => cùng kết quả (đa âm + đơn âm)', function () {
    [{ u: 1, p: U1.phonics }, { u: 10, p: U10.phonics }].forEach(function (cfg) {
      var spec = { type: 'phonics_pick', level: 1, unit: cfg.u, phonics: cfg.p };
      var a = Engine.generate(spec, 2024);
      var b = Engine.generate(spec, 2024);
      assert(deepEq(a, b), 'phonics unit' + cfg.u + ' cùng seed phải bằng nhau');
    });
  });

  // --- phonics_pick PHẢN ÁNH VỊ TRÍ ÂM (initial vs medial) trong prompt/explain ---
  // Mô hình thống nhất: unit01 = âm ĐẦU (initial) -> prompt nói "âm ĐẦU";
  // unit10 = nguyên âm GIỮA (medial) -> prompt/explain nói "âm GIỮA".
  check('phonics_pick: prompt nêu đúng VỊ TRÍ âm (initial="âm ĐẦU", medial="âm GIỮA") (30 seed)', function () {
    // unit01 initial
    var specI = { type: 'phonics_pick', level: 1, unit: 1, phonics: U1.phonics };
    for (var s = 0; s < 30; s++) {
      var exI = Engine.generate(specI, s);
      var txtI = exI.prompt + ' ' + exI.explain;
      assert(txtI.indexOf('âm ĐẦU') !== -1,
        'unit01 (initial): prompt/explain phải nêu "âm ĐẦU" ở seed ' + s + ': ' + exI.prompt);
      assert(txtI.indexOf('âm GIỮA') === -1 && txtI.indexOf('âm CUỐI') === -1,
        'unit01 (initial): KHÔNG được nêu "âm GIỮA"/"âm CUỐI" ở seed ' + s + ': ' + exI.prompt);
    }
    // unit10 medial
    var specM = { type: 'phonics_pick', level: 1, unit: 10, phonics: U10.phonics };
    for (var t = 0; t < 30; t++) {
      var exM = Engine.generate(specM, t);
      var txtM = exM.prompt + ' ' + exM.explain;
      // Đơn âm có say_vi ("ngắn ở giữa từ") nên prompt dùng say_vi; explain phải nói "âm GIỮA".
      assert(txtM.indexOf('âm GIỮA') !== -1 || /giữa/i.test(txtM),
        'unit10 (medial): prompt/explain phải nêu vị trí GIỮA ở seed ' + t + ': ' + txtM);
      assert(txtM.indexOf('âm ĐẦU') === -1,
        'unit10 (medial): KHÔNG được nêu "âm ĐẦU" ở seed ' + t + ': ' + txtM);
    }
  });

  // --- phonics_pick: thiếu dữ liệu -> NÉM lỗi rõ (BẤT BIẾN 7) ---
  check('phonics_pick: đơn âm < 4 từ -> ném lỗi rõ (không trả bài hỏng)', function () {
    var threw = false;
    var bad = { focus: ['z'], soundLabels: {}, words: [
      { word: 'zip', focusSound: 'z' }, { word: 'zoo', focusSound: 'z' }
    ], audio: null };
    try { Engine.generate({ type: 'phonics_pick', level: 1, unit: 99, phonics: bad }); }
    catch (e) { threw = true; }
    assert(threw, 'đơn âm chỉ 2 từ phải ném lỗi (cần ≥4 để nghe-chọn)');
  });

  // --- listen_choose CHẾ ĐỘ VOCAB (nghe TỪ -> chọn từ) ---
  check('listen_choose VOCAB: audioText = từ, đúng 1 đáp án, ≥4 choices (40 seed × 2 unit)', function () {
    [U1, U2].forEach(function (U) {
      var spec = { type: 'listen_choose', level: 1, unit: U.unit, vocabPool: U.vocab };
      for (var s = 0; s < 40; s++) {
        var ex = Engine.generate(spec, s);
        assert(ex.type === 'listen_choose', 'type sai');
        assert(ex.choices.length >= 4, 'cần ≥4 choices ở seed ' + s);
        assert(ex.audioText && ex.audioText.trim(), 'thiếu audioText ở seed ' + s);
        assert(ex.choices[ex.answer] === ex.audioText, 'đáp án phải khớp TỪ vừa đọc ở seed ' + s);
        var low = ex.choices.map(function (c) { return c.toLowerCase(); });
        assert(new Set(low).size === low.length, 'choices trùng ở seed ' + s);
        assert(ex.explain && ex.explain.trim(), 'explain rỗng ở seed ' + s);
      }
    });
  });

  // --- listen_choose CHẾ ĐỘ GRAMMAR (nghe CÂU -> chọn câu) ---
  check('listen_choose GRAMMAR: nghe câu, audioText = câu đáp án, đúng 1 đáp án (30 seed)', function () {
    var g = grammar(U1, 'what-is-this');
    var spec = { type: 'listen_choose', level: 1, unit: 1, grammar: g };
    var norm = function (x) { return x.toLowerCase().replace(/\s+/g, ' ').trim(); };
    for (var s = 0; s < 30; s++) {
      var ex = Engine.generate(spec, s);
      assert(ex.type === 'listen_choose', 'type sai');
      assert(ex.choices.length >= 4, 'cần ≥4 choices ở seed ' + s);
      assert(ex.audioText && ex.audioText.trim(), 'thiếu audioText ở seed ' + s);
      // audioText phải đọc đúng câu ĐÁP ÁN (không đọc câu nhiễu/sai).
      assert(norm(ex.choices[ex.answer]) === norm(ex.audioText),
        'audioText không khớp câu đáp án ở seed ' + s + ': "' + ex.audioText + '"');
      // Đáp án KHÔNG được là 1 câu nhiễu (sai ngữ pháp).
      var distrSet = new Set((g.safeZone.distractors || []).map(norm));
      assert(!distrSet.has(norm(ex.choices[ex.answer])),
        'đáp án đúng lại là câu nhiễu (sai) ở seed ' + s);
    }
  });

  // --- listen_choose GRAMMAR: nhiễu CÙNG DẠNG câu (fix P4-tb are-these) ---
  // Khi audio là câu trả lời (Yes…/No…) thì các nhiễu cũng phải là câu trả lời;
  // khi audio là câu hỏi (…?) thì nhiễu cũng là câu hỏi -> trẻ không đoán theo hình dạng.
  check('listen_choose GRAMMAR: nhiễu cùng DẠNG với câu nghe (are-these, 60 seed)', function () {
    if (typeof require === 'undefined') return; // chỉ chạy ở Node (cần unit07)
    var path = require('path');
    var U7 = require(path.join(__dirname, '..', 'content', 'level1', 'unit07.json'));
    var g = grammar(U7, 'are-these');
    var spec = { type: 'listen_choose', level: 1, unit: 7, grammar: g };
    var shape = function (s) {
      var t = String(s).trim();
      if (/^yes\b/i.test(t)) return 'ans-yes';
      if (/^no\b/i.test(t)) return 'ans-no';
      if (/\?\s*$/.test(t)) return 'q';
      return 'stmt';
    };
    var mixedShapeSeen = false, qSeen = false, ansSeen = false;
    for (var s = 0; s < 60; s++) {
      var ex = Engine.generate(spec, s);
      var ansShape = shape(ex.choices[ex.answer]);
      if (ansShape === 'q') qSeen = true;
      if (ansShape === 'ans-yes' || ansShape === 'ans-no') ansSeen = true;
      // Yes/No coi là 1 nhóm "câu trả lời"; câu hỏi là nhóm riêng.
      var grp = function (sh) { return (sh === 'ans-yes' || sh === 'ans-no') ? 'ans' : sh; };
      var ansGrp = grp(ansShape);
      // Đếm bao nhiêu lựa chọn cùng nhóm với đáp án — phải > 1 (không lẻ loi).
      var sameGrp = ex.choices.filter(function (c) { return grp(shape(c)) === ansGrp; }).length;
      assert(sameGrp >= 2,
        'đáp án là phương án "khác dạng" DUY NHẤT (đoán được không cần nghe) ở seed ' + s +
        ': ' + JSON.stringify(ex.choices));
      // Vẫn đúng-1-đáp-án + audio khớp đáp án.
      assert(ex.choices[ex.answer] === ex.audioText, 'audio không khớp đáp án ở seed ' + s);
    }
    // Bao phủ: gặp cả câu hỏi lẫn câu trả lời qua nhiều seed.
    assert(qSeen && ansSeen, 'cần thấy cả câu hỏi lẫn câu trả lời qua 60 seed');
  });

  // --- listen_choose: TÁI LẬP (deterministic) cả 2 chế độ ---
  check('listen_choose: cùng seed => cùng kết quả (vocab + grammar)', function () {
    var sv = { type: 'listen_choose', level: 1, unit: 1, vocabPool: U1.vocab };
    assert(deepEq(Engine.generate(sv, 555), Engine.generate(sv, 555)), 'listen_choose vocab không tái lập');
    var sg = { type: 'listen_choose', level: 1, unit: 1, grammar: grammar(U1, 'what-is-this') };
    assert(deepEq(Engine.generate(sg, 555), Engine.generate(sg, 555)), 'listen_choose grammar không tái lập');
  });

  // --- listen_choose: thiếu dữ liệu -> NÉM lỗi rõ (BẤT BIẾN 7) ---
  check('listen_choose: vocab < 4 và không grammar -> ném lỗi rõ', function () {
    var threw = false;
    try { Engine.generate({ type: 'listen_choose', level: 1, unit: 1, vocabPool: U1.vocab.slice(0, 3) }); }
    catch (e) { threw = true; }
    assert(threw, 'vocabPool < 4 không grammar phải ném lỗi');
  });

  // --- BẤT BIẾN 7: thiếu dữ liệu -> NÉM lỗi, không trả bài hỏng ---
  check('Thiếu dữ liệu -> ném lỗi rõ (không lỗi yên lặng)', function () {
    var threw = false;
    try { Engine.generate({ type: 'fill_blank', level: 1, unit: 1 }); } // thiếu grammar
    catch (e) { threw = true; }
    assert(threw, 'fill_blank không grammar phải ném lỗi');

    threw = false;
    try { Engine.generate({ type: 'phonics_pick', level: 1, unit: 1, phonics: { focus: [], words: [] } }); }
    catch (e) { threw = true; }
    assert(threw, 'phonics_pick thiếu từ phải ném lỗi');

    threw = false;
    try { Engine.generate({ type: 'khong-ton-tai', level: 1, unit: 1 }); }
    catch (e) { threw = true; }
    assert(threw, 'type lạ phải ném lỗi');
  });

  console.log('\n=== KẾT QUẢ: ' + pass + ' PASS, ' + fail + ' FAIL ===\n');
  if (typeof process !== 'undefined' && fail > 0) process.exit(1);
})();
