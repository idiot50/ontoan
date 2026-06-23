/*
 * content.schema.mjs — Validate Content JSON theo CONTRACTS §1 + soát nội dung tiếng Anh.
 * Chạy: node tests/content.schema.mjs
 *
 * Kiểm:
 *  - Cấu trúc bắt buộc (schemaVersion, level, unit, vocab, grammar, phonics, reading).
 *  - VocabItem có word/vi/icon/example.
 *  - GrammarPoint.safeZone: templates+slots; answerKey suy được đáp án; a/an khớp.
 *  - PhonicsWord.focusSound ∈ focus; mỗi âm có ≥1 từ; đủ nhiễu khác âm (≥3).
 *  - ReadingQuestion: truefalse boolean / mcq choices≥3 + answer index hợp lệ;
 *    đáp án đọc hiểu khớp với text (controlled vocab).
 *  - Soát a/an trong example & template (tránh "a apple", "an pen").
 */
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const index = require(path.join(root, 'content', 'level1', 'index.json'));
const files = (index.units || []).map(u => ({ meta: u, data: require(path.join(root, 'content', 'level1', u.file)) }));

let pass = 0, fail = 0, warn = 0;
const fails = [], warns = [];
function check(name, fn) {
  try { fn(); pass++; console.log('  ✓ ' + name); }
  catch (e) { fail++; fails.push(name + ' :: ' + (e && e.message)); console.error('  ✗ ' + name + '  ->  ' + (e && e.message)); }
}
function assert(c, m) { if (!c) throw new Error(m); }
function warnIf(cond, msg) { if (cond) { warn++; warns.push(msg); console.warn('  ⚠ ' + msg); } }

const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const articleFor = w => VOWELS.includes(String(w).trim().charAt(0).toLowerCase()) ? 'an' : 'a';

console.log('\n=== CONTENT SCHEMA + SOÁT NỘI DUNG ===');

for (const { meta, data } of files) {
  const tag = 'unit' + String(data.unit).padStart(2, '0');

  check(tag + ': cấu trúc top-level', () => {
    assert(data.schemaVersion === 'v1', 'schemaVersion phải "v1"');
    assert([1, 2, 3].includes(data.level), 'level 1|2|3');
    assert(typeof data.unit === 'number', 'unit number');
    assert(typeof data.topic === 'string' && data.topic, 'topic');
    assert(typeof data.topic_vi === 'string' && data.topic_vi, 'topic_vi');
    assert(Array.isArray(data.vocab), 'vocab[]');
    assert(Array.isArray(data.grammar), 'grammar[]');
    assert(data.phonics === null || typeof data.phonics === 'object', 'phonics object|null');
    assert(Array.isArray(data.reading), 'reading[]');
    assert(data.unit === meta.unit, 'unit khớp index.json');
  });

  check(tag + ': vocab item đủ trường + example đúng a/an', () => {
    assert(data.vocab.length >= 4, 'cần ≥4 từ cho mcq/listen');
    data.vocab.forEach((v, i) => {
      assert(v.word && v.vi && v.icon && v.example, 'vocab[' + i + '] thiếu word/vi/icon/example');
      // example "It's a/an X." -> kiểm a/an khớp
      const m = v.example.match(/\bit's\s+(a|an)\s+([a-z]+)/i);
      if (m) {
        const exp = articleFor(m[2]);
        assert(m[1].toLowerCase() === exp, 'vocab "' + v.word + '" example sai mạo từ: "' + v.example + '" (nên "' + exp + ' ' + m[2] + '")');
      }
    });
  });

  check(tag + ': grammar.safeZone hợp lệ + answerKey a/an đầy đủ', () => {
    data.grammar.forEach(g => {
      assert(g.id && g.title_vi && g.explain_vi, g.id + ' thiếu id/title_vi/explain_vi');
      assert(Array.isArray(g.examples) && g.examples.length >= 2, g.id + ' cần ≥2 examples');
      assert(Array.isArray(g.generators) && g.generators.length, g.id + ' cần generators');
      const sz = g.safeZone;
      assert(sz && Array.isArray(sz.templates) && sz.templates.length, g.id + ' thiếu templates');
      assert(sz.slots && typeof sz.slots === 'object', g.id + ' thiếu slots');
      // mỗi template: slot trong text phải có trong slots
      sz.templates.forEach(t => {
        const names = [...t.text.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map(x => x[1]);
        names.forEach(n => assert(sz.slots[n], g.id + '/' + t.id + ' slot "' + n + '" không có trong slots'));
        (t.blanks || []).forEach(b => assert(names.includes(b), g.id + '/' + t.id + ' blank "' + b + '" không xuất hiện trong text'));
      });
      // answerKey art: phải phủ MỌI noun trong slots.noun và đúng a/an
      if (sz.answerKey) {
        Object.keys(sz.answerKey).forEach(tid => {
          const rule = sz.answerKey[tid];
          if (rule && rule.art && typeof rule.art === 'object' && sz.slots.noun) {
            sz.slots.noun.forEach(n => {
              assert(Object.prototype.hasOwnProperty.call(rule.art, n), g.id + '/' + tid + ' answerKey.art thiếu noun "' + n + '"');
              const exp = articleFor(n);
              assert(rule.art[n] === exp, g.id + '/' + tid + ' answerKey.art["' + n + '"]="' + rule.art[n] + '" sai (nên "' + exp + '")');
            });
          }
        });
      }
    });
  });

  check(tag + ': distractors là câu SAI thật (không trùng câu đúng nào ráp được)', () => {
    data.grammar.forEach(g => {
      const sz = g.safeZone;
      const distr = sz.distractors || [];
      // không kiểm tổ hợp đầy đủ ở đây (engine.test lo) — chỉ cảnh báo nếu distractor < 3 cho mcq
      if ((g.generators || []).includes('mcq')) {
        assert(distr.length >= 3, g.id + ' mcq cần ≥3 distractors (có ' + distr.length + ')');
      }
    });
  });

  if (data.phonics) {
    check(tag + ': phonics focusSound ∈ focus, mỗi âm ≥1 từ, đủ nhiễu', () => {
      const p = data.phonics;
      assert(Array.isArray(p.focus) && p.focus.length, 'focus rỗng');
      assert(Array.isArray(p.words) && p.words.length, 'words rỗng');

      // --- MÔ HÌNH PHONICS THỐNG NHẤT: phonics.position = "initial" | "medial" | "final"
      // position cấp UNIT là mặc định; có thể override cho TỪNG ÂM qua soundLabels[sound].position
      // (vd unit06: v/w/y/z = initial, x = final). Mặc định "initial" nếu thiếu (giữ tương thích).
      const POS = ['initial', 'medial', 'final'];
      assert(p.position === undefined || POS.includes(p.position),
        'phonics.position phải ∈ {initial,medial,final} (có "' + p.position + '")');
      // position hiệu lực cho một âm: ưu tiên soundLabels[sound].position, rồi p.position, rồi "initial".
      const posOf = sound => {
        const lbl = p.soundLabels && p.soundLabels[sound];
        const sp = lbl && lbl.position;
        if (sp !== undefined) { assert(POS.includes(sp), 'soundLabels["' + sound + '"].position lạ: "' + sp + '"'); return sp; }
        return p.position || 'initial';
      };

      p.words.forEach(w => {
        assert(w.word && w.focusSound, 'phonics word thiếu word/focusSound');
        assert(p.focus.includes(w.focusSound), 'focusSound "' + w.focusSound + '" không trong focus');
        // CHỈ kiểm vị trí âm khi focusSound là 1 NGUYÊN ÂM/PHỤ ÂM đơn ký tự (a..z).
        // Digraph (sh/ch/th) và âm /ks/ (x) không soi theo ký tự đơn — bỏ qua kiểm tự động.
        if (w.focusSound.length === 1) {
          const pos = posOf(w.focusSound);
          const word = String(w.word).toLowerCase().replace(/[^a-z]/g, ''); // bỏ '-' trong "yo-yo"
          const ch = w.focusSound.toLowerCase();
          if (pos === 'initial') {
            // Âm ĐẦU: từ phải bắt đầu bằng ký tự âm (vd apple/a, ball/b).
            warnIf(word.charAt(0) !== ch,
              tag + ' phonics[initial]: từ "' + w.word + '" không bắt đầu bằng "' + ch + '"');
          } else if (pos === 'medial') {
            // Âm GIỮA (CVC): từ phải CHỨA ký tự âm và KHÔNG ở vị trí đầu/cuối (cat,bed,bin,dog,sun).
            const at = word.indexOf(ch);
            warnIf(at < 0,
              tag + ' phonics[medial]: từ "' + w.word + '" không chứa âm "' + ch + '"');
            warnIf(at >= 0 && (at === 0 || at === word.length - 1),
              tag + ' phonics[medial]: âm "' + ch + '" trong "' + w.word + '" không nằm GIỮA từ (đầu/cuối)');
          } else { // final
            // Âm CUỐI: từ phải KẾT THÚC bằng ký tự âm.
            warnIf(word.charAt(word.length - 1) !== ch,
              tag + ' phonics[final]: từ "' + w.word + '" không kết thúc bằng "' + ch + '"');
          }
        }
      });
      // phonics_pick có 2 chế độ (khớp engine.js genPhonicsPick / engine.selftest):
      //   ĐA ÂM  : âm s có ≥3 từ thuộc âm KHÁC để làm nhiễu (phân biệt âm).
      //   ĐƠN ÂM : âm s có ≥4 từ CÙNG âm (nghe-chọn trong cùng họ âm) khi đơn vị chỉ 1 âm.
      // Mỗi âm chỉ cần THOẢ MỘT trong hai chế độ thì engine sinh được bài hợp lệ.
      const sounds = [...new Set(p.words.map(w => w.focusSound))];
      sounds.forEach(s => {
        const other = p.words.filter(w => w.focusSound !== s).length;
        const same = p.words.filter(w => w.focusSound === s).length;
        assert(other >= 3 || same >= 4,
          'âm "' + s + '": cần ≥3 từ khác âm (đa âm) HOẶC ≥4 từ cùng âm (đơn âm) -> phonics_pick không sinh được');
      });
    });
  }

  check(tag + ': reading questions hợp lệ + đáp án khớp text', () => {
    data.reading.forEach(r => {
      assert(r.id && r.title && r.text, r.id + ' thiếu id/title/text');
      const textLow = r.text.toLowerCase();
      r.questions.forEach(q => {
        assert(q.q_vi, q.id + ' thiếu q_vi');
        if (q.type === 'truefalse') {
          assert(typeof q.answer === 'boolean', q.id + ' truefalse answer phải boolean');
        } else if (q.type === 'mcq') {
          assert(Array.isArray(q.choices) && q.choices.length >= 3, q.id + ' mcq cần ≥3 choices');
          assert(typeof q.answer === 'number' && q.answer >= 0 && q.answer < q.choices.length, q.id + ' answer index ngoài khoảng');
          // soát: đáp án ĐÚNG nên xuất hiện trong text (controlled vocab); nhiễu thì không bắt buộc.
          const correctPhrase = String(q.choices[q.answer]).toLowerCase().replace(/^(a|an|the)\s+/, '').trim();
          warnIf(correctPhrase && !textLow.includes(correctPhrase),
            tag + '/' + r.id + '/' + q.id + ' đáp án mcq "' + q.choices[q.answer] + '" không xuất hiện trong đoạn đọc (kiểm tra lại tính khớp)');
        } else {
          assert(false, q.id + ' type lạ: ' + q.type);
        }
      });
    });
  });
}

console.log('\n=== KẾT QUẢ CONTENT: ' + pass + ' PASS, ' + fail + ' FAIL, ' + warn + ' WARN ===\n');
if (warn) console.warn('Cảnh báo:\n' + warns.map(w => ' - ' + w).join('\n') + '\n');
if (fail > 0) { console.error('Lỗi:\n' + fails.map(f => ' - ' + f).join('\n')); process.exit(1); }
