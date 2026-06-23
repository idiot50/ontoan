/*
 * engine.js — Động cơ sinh bài tập tiếng Anh trẻ em (Level 1–3)
 * ----------------------------------------------------------------------------
 * Classic script: chạy qua <script src> (file://) và qua Node (module.exports).
 * Tuân thủ CONTRACT v1 — docs/CONTRACTS.md §2 (Engine API).
 *
 *   Engine.generate(spec, seed?) -> Exercise
 *   Exercise = { type, prompt, answer, explain, choices?, audioText?, tokens? }
 *
 * BẤT BIẾN (CONTRACTS §2.4) engine bảo đảm:
 *   1. Đúng 1 đáp án — mcq/listen_choose/phonics_pick không có nhiễu nào tình cờ đúng.
 *   2. Câu hợp lệ — chỉ ráp trong safeZone (a/an, số nhiều, bất quy tắc theo dữ liệu).
 *      KHÔNG tổ hợp tự do ngoài `slots`.
 *   3. Tái lập — generate(spec, seed) xác định theo seed.
 *   4. choices hợp lệ — đủ số lượng, phần tử duy nhất, answer (chỉ số) trong khoảng.
 *   5. Có giải thích VN — explain luôn không rỗng, ngắn, không thuật ngữ.
 *   6. TTS sẵn sàng — loại nghe luôn có audioText đọc được.
 *   7. Không lỗi yên lặng — thiếu dữ liệu thì NÉM lỗi rõ ràng (không trả bài hỏng).
 *
 * NGUYÊN TẮC NGÔN NGỮ (vùng an toàn):
 *   - Câu hoàn chỉnh được dựng từ template.text bằng cách điền MỌI slot {x}:
 *       + slot là "blank" (cần điền)  -> chọn 1 giá trị hợp lệ làm đáp án,
 *         các slot còn lại được điền theo answerKey để câu LUÔN đúng ngữ pháp.
 *   - Đáp án đúng suy ra từ answerKey (ưu tiên) hoặc tự suy a/an theo nguyên âm.
 *   - Distractor lấy theo LỖI ĐIỂN HÌNH người Việt từ safeZone.distractors,
 *     và LUÔN kiểm tra distractor KHÁC đáp án đúng (không vô tình đúng).
 */
(function (root) {
  'use strict';

  /* ===================== RNG XÁC ĐỊNH (mulberry32) ===================== */
  // Cùng seed + cùng spec => cùng kết quả. Nếu không truyền seed -> dùng ngẫu nhiên.
  function makeRng(seed) {
    var s = (seed === undefined || seed === null)
      ? (Math.floor(Math.random() * 0xffffffff) >>> 0)
      : (seed >>> 0);
    return function () {
      s |= 0; s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randInt(rng, min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
  }
  function pick(rng, arr) {
    return arr[randInt(rng, 0, arr.length - 1)];
  }
  // Fisher–Yates, trả mảng mới, dùng RNG xác định.
  function shuffle(rng, arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = randInt(rng, 0, i);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  // Lấy tối đa n phần tử khác nhau (theo so sánh ===) từ pool đã xáo.
  function takeDistinct(pool, n, exclude) {
    var out = [];
    for (var i = 0; i < pool.length && out.length < n; i++) {
      var v = pool[i];
      if (exclude && exclude.indexOf(v) !== -1) continue;
      if (out.indexOf(v) === -1) out.push(v);
    }
    return out;
  }

  /* ===================== TIỆN ÍCH NGÔN NGỮ ===================== */
  var VOWELS = ['a', 'e', 'i', 'o', 'u'];

  // Suy a/an theo chữ cái đầu (fallback khi không có answerKey).
  // LƯU Ý: đây chỉ là fallback chữ-cái; ngoại lệ âm (hour, university) PHẢI khai
  // báo trong answerKey của content. Engine không đoán bừa ngoại lệ âm.
  function articleFor(word) {
    if (!word) return 'a';
    var first = String(word).trim().charAt(0).toLowerCase();
    return VOWELS.indexOf(first) !== -1 ? 'an' : 'a';
  }

  // Viết hoa chữ đầu câu (sau khi ráp).
  function capitalizeFirst(s) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Tách template.text thành các token chữ và token slot {name}.
  // Trả mảng phần tử: { slot:'name' } hoặc { text:'...' }.
  function parseTemplate(text) {
    var parts = [];
    var re = /\{([a-zA-Z0-9_]+)\}/g;
    var last = 0, m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push({ text: text.slice(last, m.index) });
      parts.push({ slot: m[1] });
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push({ text: text.slice(last) });
    return parts;
  }

  // Danh sách tên slot xuất hiện trong template.text.
  function slotsInText(text) {
    var names = [], re = /\{([a-zA-Z0-9_]+)\}/g, m;
    while ((m = re.exec(text)) !== null) {
      if (names.indexOf(m[1]) === -1) names.push(m[1]);
    }
    return names;
  }

  /* ===================== ĐỌC / KIỂM TRA SPEC ===================== */
  function err(msg) { throw new Error('[Engine] ' + msg); }

  function requireGrammar(spec) {
    if (!spec || typeof spec !== 'object') err('spec không hợp lệ.');
    var g = spec.grammar;
    if (!g || typeof g !== 'object') {
      err('Loại "' + spec.type + '" cần spec.grammar (GrammarPoint đầy đủ có safeZone).');
    }
    if (!g.safeZone || typeof g.safeZone !== 'object') {
      err('grammar "' + (g.id || '?') + '" thiếu safeZone.');
    }
    var sz = g.safeZone;
    if (!Array.isArray(sz.templates) || sz.templates.length === 0) {
      err('safeZone của "' + (g.id || '?') + '" không có templates.');
    }
    if (!sz.slots || typeof sz.slots !== 'object') {
      err('safeZone của "' + (g.id || '?') + '" không có slots.');
    }
    return g;
  }

  function requireVocab(spec, min) {
    var pool = spec && spec.vocabPool;
    if (!Array.isArray(pool) || pool.length < (min || 1)) {
      err('Loại "' + (spec && spec.type) + '" cần vocabPool ≥ ' + (min || 1) + ' từ.');
    }
    return pool;
  }

  function requirePhonics(spec) {
    var p = spec && spec.phonics;
    if (!p || !Array.isArray(p.words) || p.words.length === 0) {
      err('phonics_pick cần spec.phonics.words.');
    }
    if (!Array.isArray(p.focus) || p.focus.length === 0) {
      err('phonics_pick cần spec.phonics.focus.');
    }
    return p;
  }

  // Chọn 1 template hợp lệ cho loại bài. needBlank=true: bắt buộc có ≥1 blank.
  function chooseTemplate(rng, grammar, needBlank, onlyIds) {
    var tpls = grammar.safeZone.templates.filter(function (t) {
      if (!t || !t.text) return false;
      if (onlyIds && onlyIds.indexOf(t.id) === -1) return false;
      var hasSlot = slotsInText(t.text).length > 0;
      var blanks = Array.isArray(t.blanks) ? t.blanks : [];
      if (needBlank) return blanks.length > 0 || (hasSlot && !t.blanks);
      return true;
    });
    if (tpls.length === 0) {
      err('Không có template phù hợp cho loại bài (grammar "' + grammar.id + '").');
    }
    return pick(rng, tpls);
  }

  // Xác định danh sách slot "blank" của template.
  // Nếu template.blanks khai báo -> dùng nó; nếu không -> coi mọi slot là blank.
  function blanksOf(tpl) {
    if (Array.isArray(tpl.blanks)) return tpl.blanks.slice();
    return slotsInText(tpl.text);
  }

  // Suy giá trị ĐÚNG cho một slot, theo answerKey (nếu có) phụ thuộc các slot khác,
  // hoặc fallback (article tự suy theo noun).
  //   answerKey[tpl.id][slot] có 2 dạng:
  //     - chuỗi cố định: "my"
  //     - map theo giá trị slot điều kiện: { pen:"a", apple:"an", ... }
  // chosen = bản đồ slot->giá trị đã chọn (để tra map theo noun…).
  function correctSlotValue(grammar, tpl, slot, chosen) {
    var ak = grammar.safeZone.answerKey;
    if (ak && ak[tpl.id] && Object.prototype.hasOwnProperty.call(ak[tpl.id], slot)) {
      var rule = ak[tpl.id][slot];
      if (typeof rule === 'string') return rule;        // cố định
      if (rule && typeof rule === 'object') {           // map theo slot điều kiện
        // Xác định slot ĐIỀU KIỆN một cách TƯỜNG MINH, không dò mọi khoá:
        //   1) rule.__cond = "noun"  -> dùng đúng slot này (khuyến nghị cho content phức tạp).
        //   2) mặc định slot 'noun'  -> quy ước phổ biến (a/an theo noun).
        // Loại trừ khoá điều khiển '__cond' khỏi map giá trị.
        var condSlot = (typeof rule.__cond === 'string') ? rule.__cond
          : (chosen.noun !== undefined ? 'noun' : null);
        if (condSlot && chosen[condSlot] !== undefined) {
          var condVal = chosen[condSlot];
          if (Object.prototype.hasOwnProperty.call(rule, condVal)) return rule[condVal];
          err('answerKey của template "' + tpl.id + '" slot "' + slot +
              '" không có giá trị cho điều kiện "' + condSlot + '=' + condVal + '".');
        }
        // Fallback (giữ tương thích content cũ): dò các khoá đã chọn, BỎ QUA '__cond'.
        var keys = Object.keys(chosen);
        for (var i = 0; i < keys.length; i++) {
          var cond = chosen[keys[i]];
          if (cond === undefined || cond === null) continue;
          if (Object.prototype.hasOwnProperty.call(rule, cond)) return rule[cond];
        }
        err('answerKey của template "' + tpl.id + '" slot "' + slot +
            '" không khớp giá trị điều kiện đã chọn.');
      }
    }
    // Fallback: nếu slot là mạo từ a/an -> suy theo noun đã chọn.
    if (slot === 'art' && chosen.noun) return articleFor(chosen.noun);
    // Fallback cuối: nếu slot có đúng 1 giá trị hợp lệ -> lấy nó.
    var vals = grammar.safeZone.slots[slot];
    if (Array.isArray(vals) && vals.length === 1) return vals[0];
    err('Không suy được đáp án đúng cho slot "' + slot + '" (template "' + tpl.id +
        '"). Bổ sung answerKey trong content.');
  }

  // Dựng một CÂU HOÀN CHỈNH đúng ngữ pháp từ template:
  //   - Chọn ngẫu nhiên giá trị cho các slot "tự do" (vd noun) trong slots.
  //   - Slot blank chính (targetSlot) được chọn = đáp án đúng (qua answerKey).
  //   - Mọi slot còn lại điền theo answerKey/fallback để câu luôn hợp lệ.
  // Trả: { sentence, chosen, target:{slot,value}, parts }.
  function buildSentence(rng, grammar, tpl, targetSlot) {
    var slotsDef = grammar.safeZone.slots;
    var names = slotsInText(tpl.text);
    var chosen = {};

    // Bước 1: chọn giá trị cho các slot "nội dung tự do" (không phải target,
    // và không phải slot mà answerKey điều khiển). Thường là 'noun'.
    var ak = grammar.safeZone.answerKey || {};
    var akSlots = ak[tpl.id] ? Object.keys(ak[tpl.id]) : [];
    for (var i = 0; i < names.length; i++) {
      var n = names[i];
      if (n === targetSlot) continue;
      if (akSlots.indexOf(n) !== -1) continue; // sẽ điền theo answerKey ở bước 3
      var vals = slotsDef[n];
      if (!Array.isArray(vals) || vals.length === 0) {
        err('slot "' + n + '" trong template "' + tpl.id + '" không có giá trị hợp lệ.');
      }
      chosen[n] = pick(rng, vals);
    }

    // Bước 2: target slot = đáp án đúng.
    //   - Nếu answerKey định nghĩa target (slot PHỤ THUỘC, vd 'art','poss') -> suy đáp án.
    //   - Nếu không (slot NỘI DUNG TỰ DO, vd 'noun') -> chọn ngẫu nhiên 1 giá trị
    //     hợp lệ; mọi giá trị trong slots đều đúng ngữ pháp (đã được biên soạn duyệt).
    if (targetSlot) {
      var akCtrls = akSlots.indexOf(targetSlot) !== -1;
      if (akCtrls) {
        chosen[targetSlot] = correctSlotValue(grammar, tpl, targetSlot, chosen);
      } else {
        var tvals = slotsDef[targetSlot];
        if (!Array.isArray(tvals) || tvals.length === 0) {
          err('slot mục tiêu "' + targetSlot + '" (template "' + tpl.id + '") không có giá trị hợp lệ.');
        }
        chosen[targetSlot] = pick(rng, tvals);
      }
    }

    // Bước 3: điền các slot do answerKey điều khiển (vd 'art' theo 'noun').
    for (var k = 0; k < names.length; k++) {
      var nm = names[k];
      if (chosen[nm] !== undefined) continue;
      chosen[nm] = correctSlotValue(grammar, tpl, nm, chosen);
    }

    // Ráp câu.
    var parts = parseTemplate(tpl.text);
    var sentence = parts.map(function (p) {
      return p.slot ? chosen[p.slot] : p.text;
    }).join('');
    sentence = capitalizeFirst(sentence.trim());

    return { sentence: sentence, chosen: chosen, parts: parts, target: targetSlot ? { slot: targetSlot, value: chosen[targetSlot] } : null };
  }

  // audioText cho TTS: đọc CHÍNH câu đúng đã ráp của bài (luôn khớp đề + hợp lệ).
  // tpl.audioText chỉ là câu MẪU minh hoạ trong content, có thể khác câu thực tế,
  // nên KHÔNG dùng làm audio của bài (sẽ đọc lệch với đáp án). Giữ tham số tpl để
  // tương thích chữ ký gọi.
  function audioOf(tpl, sentence) {
    return sentence;
  }

  /* ===================== GIẢI THÍCH VN ===================== */
  function explainArticle(noun, art) {
    var first = String(noun).charAt(0).toLowerCase();
    if (art === 'an') {
      return '"' + noun + '" bắt đầu bằng nguyên âm "' + first + '" nên dùng "an".';
    }
    return '"' + noun + '" bắt đầu bằng phụ âm "' + first + '" nên dùng "a".';
  }

  function explainFromGrammar(grammar, fallback) {
    if (grammar && grammar.explain_vi) return grammar.explain_vi;
    return fallback || 'Đây là đáp án đúng theo mẫu câu đã học.';
  }

  /* ===================== GENERATOR: fill_blank ===================== */
  function genFillBlank(spec, rng) {
    var g = requireGrammar(spec);
    var tpl = chooseTemplate(rng, g, true);
    var blanks = blanksOf(tpl);
    if (blanks.length === 0) {
      err('Template "' + tpl.id + '" không có chỗ trống cho fill_blank.');
    }
    var targetSlot = pick(rng, blanks);
    var built = buildSentence(rng, g, tpl, targetSlot);

    // prompt: thay đúng 1 slot target bằng "___" trong câu đã hoàn chỉnh.
    var promptText = built.parts.map(function (p) {
      if (!p.slot) return p.text;
      return (p.slot === targetSlot) ? '___' : built.chosen[p.slot];
    }).join('');
    promptText = capitalizeFirst(promptText.trim());

    var answer = built.chosen[targetSlot];

    // Giải thích.
    var explain;
    if (targetSlot === 'art') {
      explain = explainArticle(built.chosen.noun, answer);
    } else {
      explain = explainFromGrammar(g,
        'Điền "' + answer + '" để câu đúng mẫu: ' + built.sentence);
    }

    var ctx = tpl.context_vi ? (' (' + tpl.context_vi + ')') : '';

    return {
      type: 'fill_blank',
      prompt: 'Điền vào chỗ trống' + ctx + ': ' + promptText,
      answer: String(answer),
      explain: explain,
      audioText: audioOf(tpl, built.sentence)
    };
  }

  /* ===================== GENERATOR: mcq ===================== */
  // Hai chế độ:
  //   (A) có grammar.safeZone  -> chọn dạng câu đúng, nhiễu = câu sai từ distractors.
  //   (B) chỉ có vocabPool     -> hỏi nghĩa từ (icon/EN) -> chọn từ EN đúng.
  function genMcq(spec, rng) {
    if (spec.grammar && spec.grammar.safeZone) return mcqGrammar(spec, rng);
    if (Array.isArray(spec.vocabPool) && spec.vocabPool.length >= 4) return mcqVocab(spec, rng);
    err('mcq cần grammar.safeZone hoặc vocabPool ≥ 4 từ.');
  }

  // Phân loại "DẠNG CÂU" để chọn nhiễu CÙNG DẠNG (cho luyện nghe-phân-biệt thật):
  //   'ans-yes' | 'ans-no'  -> câu trả lời Yes…/No…
  //   'q'                   -> câu hỏi (kết thúc bằng '?')
  //   'stmt'                -> câu trần thuật khác.
  // Trẻ không còn đoán đáp án theo HÌNH DẠNG khác biệt (đáp là phương án "khác dạng"
  // duy nhất); mọi lựa chọn cùng dạng nên buộc phải NGHE mới phân biệt được.
  function sentenceShape(s) {
    var t = String(s).trim();
    if (/^yes\b/i.test(t)) return 'ans-yes';
    if (/^no\b/i.test(t)) return 'ans-no';
    if (/\?\s*$/.test(t)) return 'q';
    return 'stmt';
  }

  // opts.sameShape=true: chỉ giữ distractor CÙNG DẠNG với câu đúng (cho listen_choose).
  // Nếu không đủ 3 distractor cùng dạng, NỚI dần (bỏ lọc) để vẫn đủ — vẫn bảo đảm
  // bất biến đúng-1-đáp-án; ưu tiên cùng dạng khi dữ liệu cho phép.
  function mcqGrammar(spec, rng, opts) {
    opts = opts || {};
    var g = requireGrammar(spec);
    var tpl = chooseTemplate(rng, g, false);
    var blanks = blanksOf(tpl);
    var targetSlot = blanks.length ? pick(rng, blanks) : null;
    var built = buildSentence(rng, g, tpl, targetSlot);
    var correct = built.sentence; // câu đúng hoàn chỉnh

    // Nhiễu: ưu tiên distractors (câu SAI theo lỗi người Việt), loại trùng câu đúng.
    var distrAll = (g.safeZone.distractors || []).map(function (d) {
      return capitalizeFirst(String(d).trim());
    });
    // Lọc: khác câu đúng (so sánh không phân biệt hoa thường + dấu cách thừa).
    var norm = function (s) { return s.toLowerCase().replace(/\s+/g, ' ').trim(); };
    var correctN = norm(correct);
    distrAll = distrAll.filter(function (d) { return norm(d) !== correctN; });

    var distr;
    if (opts.sameShape) {
      // Ưu tiên distractor cùng DẠNG câu với đáp án (cùng nhóm hỏi/đáp/khẳng định).
      var shape = sentenceShape(correct);
      var same = distrAll.filter(function (d) { return sentenceShape(d) === shape; });
      distr = takeDistinct(shuffle(rng, same), 3);
      if (distr.length < 3) {
        // Không đủ cùng dạng -> bổ sung từ phần còn lại (vẫn loại trùng nhau).
        var rest = distrAll.filter(function (d) { return sentenceShape(d) !== shape; });
        distr = takeDistinct(distr.concat(shuffle(rng, rest)), 3);
      }
    } else {
      distr = takeDistinct(shuffle(rng, distrAll), 3);
    }

    if (distr.length < 3) {
      err('mcq (grammar "' + g.id + '"): không đủ distractor hợp lệ (cần ≥3, có ' +
          distr.length + '). Bổ sung safeZone.distractors.');
    }

    var options = shuffle(rng, [correct].concat(distr));
    var answerIdx = options.indexOf(correct);

    // BẤT BIẾN: chỉ 1 đáp án đúng — đảm bảo không distractor nào trùng câu đúng.
    var sameCount = options.filter(function (o) { return norm(o) === correctN; }).length;
    if (sameCount !== 1) {
      err('mcq (grammar "' + g.id + '"): phát hiện nhiều phương án trùng đáp án đúng.');
    }

    var explain = explainFromGrammar(g, 'Câu đúng là: "' + correct + '".');
    if (targetSlot === 'art') explain = explainArticle(built.chosen.noun, built.chosen.art) +
      ' Câu đúng: "' + correct + '".';

    return {
      type: 'mcq',
      prompt: 'Chọn câu ĐÚNG:',
      answer: answerIdx,
      choices: options,
      explain: explain,
      audioText: audioOf(tpl, correct)
    };
  }

  function mcqVocab(spec, rng) {
    var pool = requireVocab(spec, 4);
    var target = pick(rng, pool);
    if (!target.word || !target.vi) {
      err('mcq vocab: VocabItem thiếu word/vi.');
    }
    // Nhiễu = các từ EN khác trong pool (không trùng nghĩa/từ đúng).
    var others = pool.filter(function (v) { return v.word !== target.word; });
    var distr = takeDistinct(shuffle(rng, others.map(function (v) { return v.word; })), 3, [target.word]);
    if (distr.length < 3) {
      err('mcq vocab: cần ≥4 từ khác nhau trong vocabPool.');
    }
    var options = shuffle(rng, [target.word].concat(distr));
    var answerIdx = options.indexOf(target.word);

    return {
      type: 'mcq',
      prompt: 'Từ tiếng Anh nào nghĩa là "' + target.vi + '"' +
              (target.icon ? ' ' + target.icon : '') + '?',
      answer: answerIdx,
      choices: options,
      explain: '"' + target.word + '" nghĩa là "' + target.vi + '". Ví dụ: ' +
               (target.example || ('It\'s a ' + target.word + '.')),
      audioText: target.example || target.word
    };
  }

  /* ===================== GENERATOR: order_words ===================== */
  function genOrderWords(spec, rng) {
    var g = requireGrammar(spec);
    var tpl = chooseTemplate(rng, g, false);
    var blanks = blanksOf(tpl);
    var targetSlot = blanks.length ? pick(rng, blanks) : null;
    var built = buildSentence(rng, g, tpl, targetSlot);

    // Tách câu đúng thành các thẻ từ. Giữ dấu câu cuối gắn vào từ cuối,
    // tách dấu "?" / "." thành thẻ riêng nếu muốn dễ cho trẻ — ở đây gắn liền.
    // Chuẩn hoá: tách theo khoảng trắng, giữ nguyên token (vd "It's", "apple.").
    var answerTokens = built.sentence.split(/\s+/).filter(Boolean);
    if (answerTokens.length < 2) {
      err('order_words: câu quá ngắn để sắp xếp ("' + built.sentence + '").');
    }

    // Xáo trộn cho tới khi khác thứ tự đúng (tránh đề đã sẵn đúng).
    var tokens = shuffle(rng, answerTokens);
    var sameAsAnswer = function (a) {
      if (a.length !== answerTokens.length) return false;
      for (var i = 0; i < a.length; i++) if (a[i] !== answerTokens[i]) return false;
      return true;
    };
    var guard = 0;
    while (sameAsAnswer(tokens) && guard < 12 && answerTokens.length > 1) {
      tokens = shuffle(rng, answerTokens);
      guard++;
    }
    // Bảo đảm KHÁC thứ tự đúng kể cả khi xáo ngẫu nhiên xui (câu ≤3 token):
    // hoán vị có HỆ THỐNG — đảo 2 thẻ KHÁC GIÁ TRỊ nhau để chắc chắn lệch đáp án.
    // (Nếu mọi thẻ giống hệt nhau thì không thể khác đáp án — hiếm, vẫn trả như cũ.)
    if (sameAsAnswer(tokens) && answerTokens.length > 1) {
      var swapped = false;
      for (var a = 0; a < tokens.length - 1 && !swapped; a++) {
        for (var b = a + 1; b < tokens.length; b++) {
          if (tokens[a] !== tokens[b]) {
            var tmp = tokens[a]; tokens[a] = tokens[b]; tokens[b] = tmp;
            swapped = true;
            break;
          }
        }
      }
    }

    return {
      type: 'order_words',
      prompt: 'Sắp xếp các từ thành câu đúng:',
      answer: answerTokens,           // string[] thứ tự đúng
      tokens: tokens,                 // string[] đã xáo cho UI
      explain: 'Câu đúng là: "' + built.sentence + '".' +
               (g.explain_vi ? ' ' + g.explain_vi : ''),
      audioText: audioOf(tpl, built.sentence)
    };
  }

  /* ===================== GENERATOR: transform ===================== */
  // MVP tối giản: chuyển trong vùng an toàn dựa vào CẶP câu KHAI BÁO trong content.
  // Hai nguồn dữ liệu cặp (ưu tiên theo thứ tự):
  //   (1) answerKey["answer-pairs"]: { "Yes, it is.": "No, it isn't.", ... }
  //       — cách TƯỜNG MINH, an toàn nhất; engine chỉ ráp trong vùng đã duyệt.
  //   (2) Suy từ cặp template yes/no (fallback) — dựng câu qua buildSentence nếu
  //       template có slot, KHÔNG dùng raw text để tránh rò {slot}.
  // BẤT BIẾN §2.2/§2.4.2: câu trả về phải HỢP LỆ, không còn ký tự {…} chưa điền.
  function transformText(grammar, tpl) {
    // Dựng câu hợp lệ từ template (điền mọi slot theo answerKey/fallback).
    // Nếu template không có slot, buildSentence trả lại đúng text đã viết hoa.
    if (slotsInText(tpl.text).length === 0) {
      return capitalizeFirst(tpl.text.trim());
    }
    return buildSentence(makeRng(0), grammar, tpl, null).sentence;
  }

  function assertNoSlot(s, where) {
    if (/\{[a-zA-Z0-9_]+\}/.test(s)) {
      err('transform: câu "' + s + '" còn slot chưa điền (' + where +
          '). Khai báo answerKey hoặc dùng template không slot.');
    }
  }

  // Lời giải cho 1 phép biến đổi câu, CHỌN THEO DẠNG CẶP để không gán sai ngữ nghĩa:
  //   (1) Hỏi-đáp Yes/No  (from & to đều bắt đầu Yes/No): "X nghĩa là ĐÚNG/KHÔNG,
  //       nên câu ngược lại là Y." — hợp lý cho is-this-your / are-these / can…
  //   (2) Khẳng định ↔ phủ định (vd "He's got…" ↔ "He hasn't got…"): lời giải TRUNG
  //       TÍNH mô tả phép đổi, KHÔNG gán ĐÚNG/KHÔNG (tránh sai như cảnh báo P4-thấp).
  //   (3) Content có thể TỰ khai báo lời giải riêng cho từng cặp qua
  //       answerKey["transform-explain"][from] (ưu tiên cao nhất, tường minh).
  function transformExplain(grammar, fromS, toS) {
    var ak = (grammar.safeZone && grammar.safeZone.answerKey) || {};
    // (3) Lời giải tường minh do content khai báo cho đúng cặp này.
    var custom = ak['transform-explain'];
    if (custom && typeof custom === 'object') {
      // Tra theo cả khoá gốc lẫn khoá đã viết hoa (linh hoạt cho content).
      if (typeof custom[fromS] === 'string' && custom[fromS].trim()) return custom[fromS].trim();
    }
    var isYesNoPair = /^yes\b/i.test(fromS) && /^(yes|no)\b/i.test(toS) ||
                      /^no\b/i.test(fromS) && /^(yes|no)\b/i.test(toS);
    if (isYesNoPair) {
      var fromYes = /^yes/i.test(fromS);
      return '"' + fromS + '" nghĩa là ' + (fromYes ? 'ĐÚNG' : 'KHÔNG') +
             ', nên câu ngược lại là "' + toS + '".';
    }
    // Khẳng định ↔ phủ định: nhận diện chiều theo dấu phủ định ở vế ĐÍCH.
    var toIsNegative = /\b\w+n['’]t\b|\bnot\b|\bno\b/i.test(toS);
    if (toIsNegative) {
      return 'Đổi sang dạng PHỦ ĐỊNH: "' + fromS + '" → "' + toS + '".';
    }
    return 'Đổi sang dạng KHẲNG ĐỊNH: "' + fromS + '" → "' + toS + '".';
  }

  function genTransform(spec, rng) {
    var g = requireGrammar(spec);
    var sz = g.safeZone;
    var ak = sz.answerKey || {};

    // (1) Cặp tường minh trong answerKey["answer-pairs"] — đường an toàn nhất.
    var pairs = ak['answer-pairs'];
    if (pairs && typeof pairs === 'object') {
      var keys = Object.keys(pairs);
      if (keys.length === 0) {
        err('transform: answer-pairs của "' + g.id + '" rỗng.');
      }
      // Tra theo KHOÁ GỐC (không lệ thuộc hoa-thường), rồi mới viết hoa để hiển thị.
      var rawKey = pick(rng, keys);
      if (pairs[rawKey] === undefined || pairs[rawKey] === null || String(pairs[rawKey]).trim() === '') {
        err('transform: answer-pairs của "' + g.id + '" thiếu vế ngược cho "' + rawKey + '".');
      }
      var fromS = capitalizeFirst(String(rawKey).trim());
      var toS = capitalizeFirst(String(pairs[rawKey]).trim());
      assertNoSlot(fromS, 'from');
      assertNoSlot(toS, 'to');
      // Yes/No -> "đổi câu trả lời"; khẳng định↔phủ định -> "đổi sang câu …".
      var isYesNo1 = /^(yes|no)\b/i.test(fromS) && /^(yes|no)\b/i.test(toS);
      var toNeg1 = /\b\w+n['’]t\b|\bnot\b|\bno\b/i.test(toS);
      var prompt1 = isYesNo1
        ? 'Đổi câu trả lời sang nghĩa ngược lại: "' + fromS + '"'
        : (toNeg1 ? 'Đổi câu sau sang dạng PHỦ ĐỊNH: "' + fromS + '"'
                  : 'Đổi câu sau sang dạng KHẲNG ĐỊNH: "' + fromS + '"');
      return {
        type: 'transform',
        prompt: prompt1,
        answer: toS,
        explain: transformExplain(g, fromS, toS),
        audioText: toS
      };
    }

    // (2) Fallback: suy cặp yes/no từ template (dựng câu HỢP LỆ qua buildSentence).
    var tpls = sz.templates;
    var yes = tpls.filter(function (t) { return /yes/i.test(t.text); })[0];
    var no = tpls.filter(function (t) { return /isn'?t|not/i.test(t.text); })[0];
    if (yes && no) {
      var fromYes = pick(rng, [true, false]);
      var fromTpl = fromYes ? yes : no;
      var toTpl = fromYes ? no : yes;
      var fS = transformText(g, fromTpl);
      var tS = transformText(g, toTpl);
      assertNoSlot(fS, 'from');
      assertNoSlot(tS, 'to');
      return {
        type: 'transform',
        prompt: 'Đổi câu trả lời sang nghĩa ngược lại: "' + fS + '"',
        answer: tS,
        explain: transformExplain(g, fS, tS),
        audioText: tS
      };
    }
    err('transform: safeZone của "' + g.id + '" chưa khai báo cặp câu để biến đổi ' +
        '(answerKey["answer-pairs"] hoặc cặp template yes/no). Bổ sung dữ liệu hoặc dùng loại khác.');
  }

  /* ===================== GENERATOR: listen_choose ===================== */
  // Nghe câu/từ (audioText) -> chọn đúng. Ba chế độ (ưu tiên theo dữ liệu spec):
  //   (A) vocabPool ≥4  -> nghe TỪ trọn vẹn -> chọn đúng từ EN. Nhiễu = từ khác trong pool.
  //   (B) grammar.safeZone -> nghe CÂU đúng -> chọn đúng câu (qua mcqGrammar, gắn audio).
  //
  // BẤT BIẾN §2.4.6: audioText LUÔN là chuỗi EN đọc được = chính đáp án (từ/câu đúng),
  // nên trẻ nghe rồi chọn đúng phương án mình vừa nghe. Nếu VocabItem có `audio` nhúng
  // (assets/audio/...), ta phát kèm qua trường `audio` (UI ưu tiên audio nhúng, fallback TTS).
  function genListenChoose(spec, rng) {
    // (A) Nghe TỪ -> chọn từ (dựa vocabPool).
    if (Array.isArray(spec.vocabPool) && spec.vocabPool.length >= 4) {
      var pool = spec.vocabPool;
      var target = pick(rng, pool);
      if (!target.word) err('listen_choose: VocabItem thiếu word.');
      var others = pool.filter(function (v) { return v.word !== target.word; });
      var distr = takeDistinct(shuffle(rng, others.map(function (v) { return v.word; })), 3, [target.word]);
      if (distr.length < 3) err('listen_choose: cần ≥4 từ KHÁC NHAU trong vocabPool.');
      var options = shuffle(rng, [target.word].concat(distr));
      var out = {
        type: 'listen_choose',
        prompt: 'Nghe và chọn từ em nghe được:',
        answer: options.indexOf(target.word),
        choices: options,
        audioText: target.word,
        explain: 'Từ vừa đọc là "' + target.word + '"' +
                 (target.vi ? ' (' + target.vi + ')' : '') + '.'
      };
      // Audio nhúng (nếu content có) — UI ưu tiên phát, không có thì TTS đọc audioText.
      if (target.audio && String(target.audio).trim()) out.audio = String(target.audio).trim();
      return out;
    }
    // (B) Nghe CÂU -> chọn câu đúng (dựa grammar). audioText = câu đúng từ mcqGrammar.
    // sameShape=true: nhiễu CÙNG DẠNG câu với đáp án -> trẻ phải NGHE mới phân biệt,
    // không đoán theo hình dạng (fix P4-tb: are-these trộn câu hỏi & câu trả lời).
    if (spec.grammar && spec.grammar.safeZone) {
      var m = mcqGrammar(spec, rng, { sameShape: true });
      m.type = 'listen_choose';
      m.prompt = 'Nghe và chọn câu em nghe được:';
      // audioText (= câu đúng) đã được mcqGrammar gán. Giữ nguyên explain ngữ pháp.
      return m;
    }
    err('listen_choose cần vocabPool ≥ 4 từ hoặc grammar.safeZone.');
  }

  /* ===================== GENERATOR: phonics_pick ===================== */
  // Trẻ phân biệt từ theo ÂM trọng tâm. Hai chế độ — CHỌN TỰ ĐỘNG theo dữ liệu unit:
  //
  //   (A) ĐA ÂM (unit có ≥2 âm và ĐỦ ≥3 từ thuộc âm KHÁC để làm nhiễu):
  //       "Từ nào có âm … giống mỏ neo?" — đáp án = 1 từ thuộc âm mục tiêu,
  //        nhiễu = các từ thuộc âm KHÁC. Phân biệt âm này với âm kia.
  //
  //   (B) ĐƠN ÂM / không đủ nhiễu khác âm (unit 07–14: chỉ 1 âm trọng tâm):
  //       "Nghe và chọn đúng từ em nghe được" trong CÙNG họ âm — đáp án + nhiễu
  //        đều thuộc cùng âm nhưng là TỪ KHÁC NHAU. Trẻ luyện nghe-bắt-âm trong họ.
  //        (Vẫn đúng-1 đáp án vì các từ phân biệt được; audioText = từ trọn vẹn.)
  //
  // SƯ PHẠM (review): trẻ EFL dễ LẪN tên chữ cái ("ây","bi","xi") với ÂM (/æ/,/b/).
  // => prompt LUÔN neo vào MỎ NEO quen thuộc / mô tả âm bằng tiếng Việt (soundLabels),
  //    KHÔNG đọc rời tên chữ. TTS chỉ đọc TỪ TRỌN VẸN (đáp án).
  //
  // Nguồn diễn đạt âm (ưu tiên):
  //   1) phonics.soundLabels[sound] = { ipa, anchor, say_vi } — content cung cấp (TỐT nhất).
  //   2) word.anchor — mỏ neo gắn theo từng từ.
  //   3) từ đầu tiên cùng âm — fallback cuối.

  // Lấy nhãn âm (mô tả VN + mỏ neo + ipa + VỊ TRÍ âm) cho một âm trọng tâm.
  // position hiệu lực: soundLabels[sound].position ?? phonics.position ?? "initial".
  function soundLabel(p, sound, sameSound) {
    var lbl = (p.soundLabels && typeof p.soundLabels === 'object') ? p.soundLabels[sound] : null;
    var anchor = null, say_vi = null, ipa = null, position = null;
    if (lbl && typeof lbl === 'object') {
      if (lbl.anchor) anchor = String(lbl.anchor);
      if (lbl.say_vi) say_vi = String(lbl.say_vi);
      if (lbl.ipa) ipa = String(lbl.ipa);
      if (lbl.position) position = String(lbl.position);
    }
    if (!position && p.position) position = String(p.position);
    if (!position) position = 'initial';
    if (!anchor) {
      for (var i = 0; i < sameSound.length; i++) {
        if (sameSound[i].anchor) { anchor = String(sameSound[i].anchor); break; }
      }
    }
    if (!anchor && sameSound[0]) anchor = sameSound[0].word;
    return { anchor: anchor, say_vi: say_vi, ipa: ipa, position: position };
  }

  // Cụm từ chỉ VỊ TRÍ âm để chèn vào prompt/explain (sư phạm: nhấn rõ cho trẻ).
  function posPhrase(position) {
    if (position === 'medial') return 'âm GIỮA';
    if (position === 'final') return 'âm CUỐI';
    return 'âm ĐẦU';
  }

  function genPhonicsPick(spec, rng) {
    var p = requirePhonics(spec);
    // Các âm trọng tâm thực sự CÓ từ minh hoạ.
    var soundsWithWords = p.focus.filter(function (f) {
      return p.words.some(function (w) { return w.focusSound === f; });
    });
    if (soundsWithWords.length === 0) {
      err('phonics_pick: không có từ nào khớp focusSound trong focus.');
    }

    // Chọn âm mục tiêu (xác định theo seed). Ưu tiên âm cho phép CHẾ ĐỘ ĐA ÂM
    // (có ≥3 từ thuộc âm khác) để bài phân biệt âm; nếu không có thì rơi về đơn âm.
    var multiCandidates = soundsWithWords.filter(function (f) {
      return p.words.filter(function (w) { return w.focusSound !== f; }).length >= 3;
    });
    var sound, mode;
    if (multiCandidates.length > 0) {
      sound = pick(rng, multiCandidates);
      mode = 'multi';
    } else {
      sound = pick(rng, soundsWithWords);
      mode = 'single';
    }

    var sameSound = p.words.filter(function (w) { return w.focusSound === sound; });
    var lab = soundLabel(p, sound, sameSound);

    var target, distrWords, prompt, explain;

    if (mode === 'multi') {
      // ----- CHẾ ĐỘ ĐA ÂM: nhiễu = từ âm KHÁC -----
      var otherSound = p.words.filter(function (w) { return w.focusSound !== sound; });
      target = pick(rng, sameSound);
      distrWords = takeDistinct(
        shuffle(rng, otherSound.map(function (w) { return w.word; })), 3, [target.word]);
      if (distrWords.length < 3) {
        err('phonics_pick: không đủ nhiễu khác âm cho âm "' + sound + '".');
      }
      // Mỏ neo phải KHÁC đáp án để câu hỏi "giống mỏ neo" có nghĩa.
      var anchor = lab.anchor;
      var pp = posPhrase(lab.position);
      if (anchor && anchor.toLowerCase() !== target.word.toLowerCase()) {
        prompt = 'Nghe từ rồi chọn từ có cùng ' + pp + ' với "' + anchor + '"' +
                 (lab.ipa ? ' (' + lab.ipa + ')' : '') + ':';
        explain = '"' + target.word + '" có cùng ' + pp + ' "' + sound + '"' +
                  (lab.ipa ? ' ' + lab.ipa : '') + ' như "' + anchor + '". ' +
                  (lab.say_vi ? lab.say_vi : 'Các từ kia thuộc âm khác.');
      } else {
        prompt = 'Nghe từ rồi chọn từ có ' + pp + ' "' + sound + '"' +
                 (lab.ipa ? ' ' + lab.ipa : '') + ' (như "' + target.word + '"):';
        explain = '"' + target.word + '" mang ' + pp + ' "' + sound + '"' +
                  (lab.ipa ? ' ' + lab.ipa : '') + '. ' +
                  (lab.say_vi ? lab.say_vi : 'Các từ kia thuộc âm khác.');
      }
    } else {
      // ----- CHẾ ĐỘ ĐƠN ÂM: nghe-chọn từ trong CÙNG họ âm -----
      if (sameSound.length < 4) {
        err('phonics_pick (âm "' + sound + '"): unit đơn âm cần ≥4 từ cùng âm để ' +
            'làm bài nghe-chọn (có ' + sameSound.length + '). Bổ sung phonics.words.');
      }
      target = pick(rng, sameSound);
      distrWords = takeDistinct(
        shuffle(rng, sameSound.map(function (w) { return w.word; })), 3, [target.word]);
      if (distrWords.length < 3) {
        err('phonics_pick (âm "' + sound + '"): không đủ từ KHÁC NHAU cùng âm để làm nhiễu.');
      }
      var ppS = posPhrase(lab.position);
      prompt = 'Nghe và chọn ĐÚNG từ em nghe được' +
               (lab.say_vi ? ' (các từ đều có ' + lab.say_vi + ')' :
                 (lab.ipa ? ' (cùng ' + ppS + ' ' + lab.ipa + ')' : '')) + ':';
      explain = 'Từ vừa đọc là "' + target.word + '". ' +
                (lab.say_vi ? 'Cả nhóm đều luyện ' + lab.say_vi :
                  'Cả nhóm đều có ' + ppS + ' "' + sound + '"' + (lab.ipa ? ' ' + lab.ipa : '') + '.');
    }

    var options = shuffle(rng, [target.word].concat(distrWords));

    var out = {
      type: 'phonics_pick',
      prompt: prompt,
      answer: options.indexOf(target.word),
      choices: options,
      // Nghe TỪ TRỌN VẸN (không đọc rời âm vị / tên chữ) — theo review sư phạm.
      audioText: target.word,
      explain: explain
    };
    // Audio nhúng cho từ đáp án (nếu content có) — UI ưu tiên phát, fallback TTS.
    if (target.audio && String(target.audio).trim()) out.audio = String(target.audio).trim();
    return out;
  }

  /* ===================== ĐIỀU PHỐI ===================== */
  var GENERATORS = {
    fill_blank: genFillBlank,
    mcq: genMcq,
    order_words: genOrderWords,
    transform: genTransform,
    listen_choose: genListenChoose,
    phonics_pick: genPhonicsPick
    // match: (P2) — chưa hiện thực ở MVP; ném lỗi rõ ở generate().
  };

  // Kiểm tra hậu điều kiện chung (bất biến §2.4) — phòng tuyến cuối.
  function validateExercise(ex, spec) {
    if (!ex || typeof ex !== 'object') err('Generator trả về rỗng.');
    if (ex.type !== spec.type) err('type không khớp spec.');
    if (typeof ex.prompt !== 'string' || !ex.prompt.trim()) err('prompt rỗng.');
    if (ex.answer === undefined || ex.answer === null) err('answer rỗng.');
    if (typeof ex.explain !== 'string' || !ex.explain.trim()) err('explain rỗng.');

    if (ex.choices) {
      if (!Array.isArray(ex.choices) || ex.choices.length < 4) {
        // mcq/listen_choose/phonics_pick yêu cầu ≥4
        if (['mcq', 'listen_choose', 'phonics_pick'].indexOf(ex.type) !== -1) {
          err(ex.type + ': cần ≥4 lựa chọn (có ' + (ex.choices ? ex.choices.length : 0) + ').');
        }
      }
      // Phần tử duy nhất.
      var seen = {};
      for (var i = 0; i < ex.choices.length; i++) {
        var key = String(ex.choices[i]).toLowerCase().replace(/\s+/g, ' ').trim();
        if (seen[key]) err('choices có phần tử trùng: "' + ex.choices[i] + '".');
        seen[key] = true;
      }
      // answer là chỉ số hợp lệ.
      if (typeof ex.answer !== 'number' || ex.answer < 0 || ex.answer >= ex.choices.length) {
        err('answer (chỉ số) ngoài khoảng choices.');
      }
    }

    // Loại nghe phải có audioText đọc được.
    if (['listen_choose', 'phonics_pick'].indexOf(ex.type) !== -1) {
      if (typeof ex.audioText !== 'string' || !ex.audioText.trim()) {
        err(ex.type + ': thiếu audioText để TTS đọc.');
      }
    }

    if (ex.type === 'order_words') {
      if (!Array.isArray(ex.answer) || !Array.isArray(ex.tokens)) {
        err('order_words: answer và tokens phải là mảng.');
      }
      if (ex.answer.length !== ex.tokens.length) {
        err('order_words: số tokens không khớp số từ đáp án.');
      }
    }
    return ex;
  }

  /**
   * Sinh MỘT bài tập từ spec. Cùng (spec, seed) -> cùng kết quả.
   * @param {object} spec  CONTRACTS §2.2/§2.3
   * @param {number} [seed] số nguyên để tái lập (test). Bỏ trống -> ngẫu nhiên.
   * @returns {Exercise}
   */
  function generate(spec, seed) {
    if (!spec || typeof spec !== 'object') err('generate(spec): spec không hợp lệ.');
    if (!spec.type) err('generate(spec): thiếu spec.type.');
    var fn = GENERATORS[spec.type];
    if (!fn) {
      if (spec.type === 'match') {
        err('Loại "match" chưa hiện thực ở MVP (P2).');
      }
      err('Loại bài không hỗ trợ: "' + spec.type + '".');
    }
    var rng = makeRng(seed);
    var ex = fn(spec, rng);
    return validateExercise(ex, spec);
  }

  /* ===================== EXPORT ===================== */
  var Engine = {
    generate: generate,
    // Tiện ích lộ ra cho test/QA (không bắt buộc dùng):
    _util: {
      makeRng: makeRng,
      articleFor: articleFor,
      buildSentence: buildSentence,
      parseTemplate: parseTemplate
    }
  };

  // Gắn window.Engine (trình duyệt) + module.exports (Node/test).
  root.Engine = Engine;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Engine;
  }

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
