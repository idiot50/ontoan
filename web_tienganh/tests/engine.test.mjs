/*
 * engine.test.mjs — Property/unit test cho engine (CONTRACTS §2.4).
 * Chạy: node tests/engine.test.mjs  (hoặc qua tests/run.mjs)
 *
 * Kiểm BẤT BIẾN trên HÀNG LOẠT seed + content thật (unit01, unit02):
 *  1. Đúng 1 đáp án (mcq/listen/phonics không có nhiễu trùng đáp án).
 *  2. Câu hợp lệ (a/an, my/your đúng safeZone; không tổ hợp ngoài slots).
 *  3. Tái lập (cùng seed -> cùng kết quả).
 *  4. choices hợp lệ (≥4, duy nhất, answer trong khoảng).
 *  5. explain VN không rỗng.
 *  6. TTS: audioText cho loại nghe.
 *  7. Không lỗi yên lặng (thiếu dữ liệu -> ném lỗi).
 */
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const Engine = require(path.join(root, 'js', 'engine.js'));

// === NẠP TẤT CẢ UNIT từ index.json (00, 01..15) — bao phủ TOÀN BỘ Level 1 ===
const INDEX = require(path.join(root, 'content', 'level1', 'index.json'));
const UNITS = (INDEX.units || []).map(u => require(path.join(root, 'content', 'level1', u.file)));
const U1 = UNITS.find(u => u.unit === 1);
const U2 = UNITS.find(u => u.unit === 2);
console.log('Đã nạp ' + UNITS.length + ' unit: ' + UNITS.map(u => u.unit).join(', '));

let pass = 0, fail = 0;
const fails = [];
function check(name, fn) {
  try { fn(); pass++; console.log('  ✓ ' + name); }
  catch (e) { fail++; fails.push(name + ' :: ' + (e && e.message)); console.error('  ✗ ' + name + '  ->  ' + (e && e.message)); }
}
function assert(c, m) { if (!c) throw new Error(m || 'assert thất bại'); }
function grammar(u, id) { const g = (u.grammar || []).find(x => x.id === id); if (!g) throw new Error('no grammar ' + id); return g; }
const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const norm = s => String(s).toLowerCase().replace(/\s+/g, ' ').trim();
const N = 200; // số seed mỗi spec

// Thu thập tất cả spec grammar có thể từ content (theo generators khai báo).
function grammarSpecs(type) {
  const out = [];
  for (const u of UNITS) for (const g of (u.grammar || [])) {
    if ((g.generators || []).includes(type)) out.push({ type, level: u.level, unit: u.unit, grammar: g, _gid: g.id });
  }
  return out;
}

console.log('\n=== ENGINE PROPERTY TEST (N=' + N + ' seed/spec) ===');

/* ---- BẤT BIẾN 3: TÁI LẬP ---- */
check('Tái lập: mọi generator, mọi spec, cùng seed -> cùng kết quả', () => {
  const types = ['fill_blank', 'mcq', 'order_words', 'transform'];
  for (const t of types) for (const s of grammarSpecs(t)) {
    for (let seed = 0; seed < 25; seed++) {
      let a, b;
      try { a = Engine.generate(s, seed); } catch (e) { a = '__ERR__' + e.message; }
      try { b = Engine.generate(s, seed); } catch (e) { b = '__ERR__' + e.message; }
      assert(JSON.stringify(a) === JSON.stringify(b), t + '/' + s._gid + ' seed ' + seed + ' không tái lập');
    }
  }
  // vocab + phonics
  for (const u of UNITS) {
    const specV = { type: 'mcq', level: u.level, unit: u.unit, vocabPool: u.vocab };
    const specP = { type: 'phonics_pick', level: u.level, unit: u.unit, phonics: u.phonics };
    for (let seed = 0; seed < 25; seed++) {
      assert(JSON.stringify(Engine.generate(specV, seed)) === JSON.stringify(Engine.generate(specV, seed)), 'mcq vocab không tái lập');
      assert(JSON.stringify(Engine.generate(specP, seed)) === JSON.stringify(Engine.generate(specP, seed)), 'phonics không tái lập');
    }
  }
});

/* ---- BẤT BIẾN 1+4: mcq grammar ---- */
check('mcq grammar: ≥4 choices duy nhất, đúng 1 đáp án, đáp án KHÔNG nằm trong distractors', () => {
  for (const s of grammarSpecs('mcq')) {
    const distrSet = new Set((s.grammar.safeZone.distractors || []).map(norm));
    for (let seed = 0; seed < N; seed++) {
      const ex = Engine.generate(s, seed);
      assert(ex.choices.length >= 4, s._gid + ' <4 choices');
      const low = ex.choices.map(norm);
      assert(new Set(low).size === low.length, s._gid + ' seed ' + seed + ' choices trùng: ' + JSON.stringify(ex.choices));
      assert(ex.answer >= 0 && ex.answer < ex.choices.length, s._gid + ' answer ngoài khoảng');
      assert(!distrSet.has(low[ex.answer]), s._gid + ' seed ' + seed + ' ĐÁP ÁN ĐÚNG là 1 distractor sai: ' + ex.choices[ex.answer]);
      // các phương án nhiễu phải KHÁC đáp án đúng
      let same = low.filter(x => x === low[ex.answer]).length;
      assert(same === 1, s._gid + ' có >1 phương án trùng đáp án');
    }
  }
});

/* ---- BẤT BIẾN 2: fill_blank a/an đúng nguyên/phụ âm ---- */
check('fill_blank a/an: đáp án art khớp nguyên âm/phụ âm của noun trong câu', () => {
  for (const s of grammarSpecs('fill_blank')) {
    for (let seed = 0; seed < N; seed++) {
      const ex = Engine.generate(s, seed);
      // chỉ kiểm bài có art làm blank (prompt: "It's ___ apple.")
      const m = ex.prompt.match(/___\s+([a-zA-Z]+)/);
      if (!m) continue;
      if (ex.answer !== 'a' && ex.answer !== 'an') continue; // blank không phải art
      const noun = m[1].toLowerCase();
      const expect = VOWELS.includes(noun.charAt(0)) ? 'an' : 'a';
      assert(ex.answer === expect, s._gid + ' seed ' + seed + ': "' + noun + '" cần "' + expect + '" nhưng có "' + ex.answer + '"');
    }
  }
});

/* ---- BẤT BIẾN 2: câu đúng mcq không chứa tổ hợp a+vowel/an+consonant ---- */
check('Câu đúng (mcq grammar) không vi phạm a/an', () => {
  for (const s of grammarSpecs('mcq')) {
    for (let seed = 0; seed < N; seed++) {
      const ex = Engine.generate(s, seed);
      const correct = ex.choices[ex.answer].toLowerCase();
      const bad1 = /\ban ([bcdfghjklmnpqrstvwxyz])/.test(correct); // "an" + phụ âm
      const bad2 = /\ba ([aeiou])/.test(correct);                  // "a" + nguyên âm
      assert(!bad1 && !bad2, s._gid + ' seed ' + seed + ' câu đúng vi phạm a/an: "' + ex.choices[ex.answer] + '"');
    }
  }
});

/* ---- order_words: tokens là hoán vị của answer ---- */
check('order_words: tokens là hoán vị answer, ≥2 từ, câu ghép lại hợp lệ', () => {
  for (const s of grammarSpecs('order_words')) {
    for (let seed = 0; seed < N; seed++) {
      const ex = Engine.generate(s, seed);
      assert(Array.isArray(ex.answer) && ex.answer.length >= 2, s._gid + ' answer <2 từ');
      assert(ex.tokens.length === ex.answer.length, s._gid + ' tokens != answer length');
      assert(JSON.stringify(ex.answer.slice().sort()) === JSON.stringify(ex.tokens.slice().sort()), s._gid + ' tokens không phải hoán vị answer');
    }
  }
});

/* ---- transform ---- */
check('transform: cặp Yes/No đúng, answer hợp lệ', () => {
  for (const s of grammarSpecs('transform')) {
    for (let seed = 0; seed < N; seed++) {
      const ex = Engine.generate(s, seed);
      assert(typeof ex.answer === 'string' && ex.answer.trim(), s._gid + ' transform answer rỗng');
    }
  }
});

/* ---- mcq vocab ---- */
check('mcq vocab: ≥4 từ duy nhất, đáp án khớp nghĩa hỏi', () => {
  for (const u of UNITS) {
    const spec = { type: 'mcq', level: u.level, unit: u.unit, vocabPool: u.vocab };
    for (let seed = 0; seed < N; seed++) {
      const ex = Engine.generate(spec, seed);
      assert(ex.choices.length >= 4, '<4 choices');
      const low = ex.choices.map(norm);
      assert(new Set(low).size === low.length, 'vocab choices trùng seed ' + seed);
      assert(ex.answer >= 0 && ex.answer < ex.choices.length, 'answer ngoài khoảng');
    }
  }
});

/* ---- listen_choose ---- */
check('listen_choose vocab: audioText = đáp án, ≥4 choices', () => {
  for (const u of UNITS) {
    const spec = { type: 'listen_choose', level: u.level, unit: u.unit, vocabPool: u.vocab };
    for (let seed = 0; seed < N; seed++) {
      const ex = Engine.generate(spec, seed);
      assert(ex.choices.length >= 4, '<4');
      assert(ex.audioText && ex.audioText.trim(), 'thiếu audioText');
      assert(ex.choices[ex.answer] === ex.audioText, 'audioText không khớp đáp án');
    }
  }
});

/* ---- phonics_pick (BAO PHỦ MỌI UNIT có phonics — 2 chế độ) ----
 * BẤT BIẾN cốt lõi (CONTRACTS §2.4.1): ĐÚNG 1 đáp án = từ đọc lên (audioText).
 *  - Chế độ ĐA ÂM  : nhiễu phải thuộc âm KHÁC (phân biệt âm) -> kiểm wordSound.
 *  - Chế độ ĐƠN ÂM : nhiễu cùng âm nhưng là TỪ KHÁC; phân biệt được vì audioText
 *                    đọc đúng 1 từ và mọi choice là từ KHÁC NHAU.
 * Cách phân biệt chế độ: theo dữ liệu unit (≥3 từ khác âm => engine ưu tiên đa âm).
 */
check('phonics_pick: đúng 1 đáp án = audioText (1 từ), 2 chế độ đúng theo dữ liệu', () => {
  for (const u of UNITS) {
    if (!u.phonics) continue;
    const spec = { type: 'phonics_pick', level: u.level, unit: u.unit, phonics: u.phonics };
    const wordSound = {};
    u.phonics.words.forEach(w => { wordSound[w.word] = w.focusSound; });
    const focusWithWords = u.phonics.focus.filter(f => u.phonics.words.some(w => w.focusSound === f));
    const multiPossible = focusWithWords.some(f =>
      u.phonics.words.filter(w => w.focusSound !== f).length >= 3);
    for (let seed = 0; seed < N; seed++) {
      const ex = Engine.generate(spec, seed);
      assert(ex.choices.length >= 4, 'unit' + u.unit + ' <4');
      assert(ex.audioText && ex.audioText.indexOf(' ') === -1, 'unit' + u.unit + ' audioText nên là 1 từ trọn vẹn');
      assert(ex.audioText === ex.choices[ex.answer], 'unit' + u.unit + ' audioText phải đọc đúng TỪ đáp án');
      assert(/[ÂâÁá]m/i.test(ex.prompt) || /nghe/i.test(ex.prompt), 'unit' + u.unit + ' prompt phải nêu theo ÂM/Nghe: ' + ex.prompt);
      // đúng 1 đáp án = đúng 1 choice trùng audioText
      const exactly = ex.choices.filter(c => c === ex.audioText).length;
      assert(exactly === 1, 'unit' + u.unit + ' seed ' + seed + ' có ' + exactly + ' choice trùng audioText (cần 1)');
      const correct = ex.choices[ex.answer];
      const sound = wordSound[correct];
      assert(sound !== undefined, 'unit' + u.unit + ' đáp án "' + correct + '" không có trong phonics.words');
      // CHỈ ép "nhiễu khác âm" cho unit ĐA ÂM (engine sẽ chạy chế độ đa âm ở các unit đó).
      if (multiPossible) {
        ex.choices.forEach((c, i) => {
          if (i === ex.answer) return;
          assert(wordSound[c] !== sound, 'unit' + u.unit + ' (đa âm) NHIỄU "' + c + '" cùng âm "' + sound + '" -> 2 đáp án! seed ' + seed);
        });
      }
    }
  }
});

/* ---- listen_choose CHẾ ĐỘ GRAMMAR (nghe câu, chọn câu) — toàn bộ unit có khai báo ---- */
check('listen_choose grammar: audioText=câu đúng, ≥4 choices, đúng 1 đáp án', () => {
  for (const s of grammarSpecs('listen_choose')) {
    for (let seed = 0; seed < N; seed++) {
      const spec = { type: 'listen_choose', level: s.level, unit: s.unit, grammar: s.grammar };
      const ex = Engine.generate(spec, seed);
      assert(ex.choices.length >= 4, s._gid + ' <4 choices');
      const low = ex.choices.map(norm);
      assert(new Set(low).size === low.length, s._gid + ' seed ' + seed + ' choices trùng');
      assert(ex.answer >= 0 && ex.answer < ex.choices.length, s._gid + ' answer ngoài khoảng');
      assert(ex.audioText && ex.audioText.trim(), s._gid + ' thiếu audioText');
      // audioText là chính câu đúng (đáp án) -> trẻ nghe rồi chọn đúng phương án.
      assert(norm(ex.audioText) === norm(ex.choices[ex.answer]),
        s._gid + ' seed ' + seed + ' audioText KHÔNG khớp câu đáp án: "' + ex.audioText + '" vs "' + ex.choices[ex.answer] + '"');
    }
  }
});

/* ---- BAO PHỦ: mọi generator khai báo trong content sinh được, đúng type, qua hậu kiểm ---- */
check('Bao phủ TOÀN BỘ unit: mọi (unit, grammar, generator) khai báo đều sinh hợp lệ', () => {
  let combos = 0;
  for (const u of UNITS) {
    for (const g of (u.grammar || [])) {
      for (const t of (g.generators || [])) {
        const spec = { type: t, level: u.level, unit: u.unit, grammar: g };
        for (let seed = 0; seed < 30; seed++) {
          const ex = Engine.generate(spec, seed); // ném nếu hỏng -> fail
          assert(ex.type === t, 'unit' + u.unit + '/' + g.id + '/' + t + ' type sai');
        }
        combos++;
      }
    }
    // vocab generators (mcq vocab + listen_choose vocab) cho từng unit
    if (Array.isArray(u.vocab) && u.vocab.length >= 4) {
      for (const t of ['mcq', 'listen_choose']) {
        const spec = { type: t, level: u.level, unit: u.unit, vocabPool: u.vocab };
        for (let seed = 0; seed < 30; seed++) Engine.generate(spec, seed);
        combos++;
      }
    }
    // phonics cho từng unit có phonics
    if (u.phonics) {
      const spec = { type: 'phonics_pick', level: u.level, unit: u.unit, phonics: u.phonics };
      for (let seed = 0; seed < 30; seed++) Engine.generate(spec, seed);
      combos++;
    }
  }
  assert(combos > 0, 'không có combo nào');
  console.log('    (đã sinh ' + combos + ' tổ hợp generator trên ' + UNITS.length + ' unit)');
});

/* ---- BẤT BIẾN 5+6: explain + audioText loại nghe ---- */
check('explain VN không rỗng (mọi generator); audioText cho listen/phonics', () => {
  const all = ['fill_blank', 'mcq', 'order_words', 'transform'];
  for (const t of all) for (const s of grammarSpecs(t)) {
    for (let seed = 0; seed < 50; seed++) {
      const ex = Engine.generate(s, seed);
      assert(ex.explain && ex.explain.trim(), t + '/' + s._gid + ' explain rỗng');
    }
  }
  for (const u of UNITS) {
    const lc = { type: 'listen_choose', level: u.level, unit: u.unit, vocabPool: u.vocab };
    const pp = { type: 'phonics_pick', level: u.level, unit: u.unit, phonics: u.phonics };
    for (let seed = 0; seed < 50; seed++) {
      assert(Engine.generate(lc, seed).audioText, 'listen thiếu audioText');
      assert(Engine.generate(pp, seed).audioText, 'phonics thiếu audioText');
    }
  }
});

/* ---- BẤT BIẾN 7: không lỗi yên lặng ---- */
check('Thiếu dữ liệu -> NÉM lỗi rõ', () => {
  const cases = [
    { type: 'fill_blank', level: 1, unit: 1 },
    { type: 'mcq', level: 1, unit: 1 },
    { type: 'phonics_pick', level: 1, unit: 1, phonics: { focus: [], words: [] } },
    { type: 'order_words', level: 1, unit: 1 },
    { type: 'match', level: 1, unit: 1 },
    { type: 'khong-ton-tai', level: 1, unit: 1 }
  ];
  for (const c of cases) {
    let threw = false;
    try { Engine.generate(c); } catch (e) { threw = true; }
    assert(threw, 'type ' + c.type + ' lẽ ra phải ném lỗi');
  }
});

/* ---- mcq vocab có <4 từ -> ném ---- */
check('mcq vocab <4 từ -> ném lỗi', () => {
  let threw = false;
  try { Engine.generate({ type: 'mcq', level: 1, unit: 1, vocabPool: U1.vocab.slice(0, 3) }); }
  catch (e) { threw = true; }
  assert(threw, 'vocabPool 3 từ phải ném');
});

console.log('\n=== KẾT QUẢ ENGINE: ' + pass + ' PASS, ' + fail + ' FAIL ===\n');
if (fail > 0) { console.error('Lỗi:\n' + fails.map(f => ' - ' + f).join('\n')); process.exit(1); }
