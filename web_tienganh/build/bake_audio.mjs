/*
 * bake_audio.mjs — Sinh sẵn (BAKE) file âm thanh tiếng Anh cho web học Pi.
 * ----------------------------------------------------------------------------
 * Mục tiêu: đọc nội dung (vocab/example/phonics/reading), tổng hợp giọng đọc bằng
 * 1 ENGINE (mặc định Piper offline) -> mp3, lưu audio/<level>/<voiceId>/<key>.mp3,
 * và xuất audio-manifest.json để runtime biết text nào có file sẵn.
 *
 * ENGINE: 'piper' (offline, free, mặc định). Hooks để thêm 'google' | 'azure' sau
 *   (chỉ dùng key lúc build, KHÔNG ship key). 'sapi' (Windows) làm dự phòng.
 *
 * CHẠY:
 *   node build/bake_audio.mjs --selftest "Hello Pi"     # sinh 1 clip test ra scratchpad
 *   node build/bake_audio.mjs --level 1 --voice en_GB-alba-medium   # bake cả Level (sẽ bổ sung)
 *
 * KEY chỉ dùng lúc build, không ship. Piper binary+model KHÔNG commit (xem .gitignore).
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const PIPER_EXE = path.join(HERE, 'piper', 'piper', 'piper.exe');
const VOICES_DIR = path.join(HERE, 'piper', 'voices');

/* ---------- WAV (PCM 16-bit) -> MP3 (lamejs) ---------- */
let _lame = null;
async function lame() {
  if (_lame) return _lame;
  const m = await import('@breezystack/lamejs');
  _lame = m.default || m;
  return _lame;
}
function parseWav(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF') throw new Error('not RIFF');
  let off = 12, fmt = null, dataOff = -1, dataLen = 0;
  while (off + 8 <= buf.length) {
    const id = buf.toString('ascii', off, off + 4);
    const sz = buf.readUInt32LE(off + 4);
    if (id === 'fmt ') fmt = { channels: buf.readUInt16LE(off+10), sampleRate: buf.readUInt32LE(off+12), bits: buf.readUInt16LE(off+22) };
    else if (id === 'data') { dataOff = off + 8; dataLen = sz; }
    off += 8 + sz + (sz & 1);
  }
  if (!fmt || dataOff < 0) throw new Error('missing fmt/data');
  return { fmt, pcm: buf.subarray(dataOff, dataOff + dataLen) };
}
export async function wavToMp3(wavBuf, kbps = 56) {
  const lamejs = await lame();
  const { fmt, pcm } = parseWav(wavBuf);
  if (fmt.bits !== 16) throw new Error('cần PCM 16-bit, có ' + fmt.bits);
  const samples = new Int16Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.length / 2));
  const ch = fmt.channels === 2 ? 2 : 1;
  const enc = new lamejs.Mp3Encoder(ch, fmt.sampleRate, kbps);
  const out = [], block = 1152;
  if (ch === 1) {
    for (let i = 0; i < samples.length; i += block) {
      const b = enc.encodeBuffer(samples.subarray(i, i + block));
      if (b.length) out.push(Buffer.from(b));
    }
  } else {
    const n = Math.floor(samples.length / 2), L = new Int16Array(n), R = new Int16Array(n);
    for (let i = 0; i < n; i++) { L[i] = samples[2*i]; R[i] = samples[2*i+1]; }
    for (let i = 0; i < n; i += block) {
      const b = enc.encodeBuffer(L.subarray(i, i+block), R.subarray(i, i+block));
      if (b.length) out.push(Buffer.from(b));
    }
  }
  const end = enc.flush();
  if (end.length) out.push(Buffer.from(end));
  return Buffer.concat(out);
}

/* ---------- ENGINE: Piper ---------- */
export function piperSynthWav(text, voiceId) {
  const model = path.join(VOICES_DIR, voiceId + '.onnx');
  if (!fs.existsSync(PIPER_EXE)) throw new Error('Không thấy piper.exe: ' + PIPER_EXE);
  if (!fs.existsSync(model)) throw new Error('Không thấy model: ' + model);
  const tmp = path.join(os.tmpdir(), 'piper_' + Date.now() + '_' + Math.floor(performance.now()) + '.wav');
  const r = spawnSync(PIPER_EXE, ['-m', model, '-f', tmp], { input: Buffer.from(text, 'utf8'), maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0 || !fs.existsSync(tmp)) throw new Error('piper lỗi: ' + (r.stderr ? r.stderr.toString() : r.status));
  const wav = fs.readFileSync(tmp);
  try { fs.unlinkSync(tmp); } catch (e) {}
  return wav;
}

/* ---------- KHOÁ ÂM (phải KHỚP với js/audio.js) ---------- */
export function normalizeText(t) { return String(t == null ? '' : t).trim().toLowerCase().replace(/\s+/g, ' '); }
export function fnv1a(s) {
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return ('00000000' + h.toString(16)).slice(-8);
}
export function audioKey(t) { return fnv1a(normalizeText(t)); }

/* ---------- Quét nội dung 1 unit -> tập text tiếng Anh cần đọc ---------- */
function collectTextsFromUnit(u) {
  const set = new Set();
  const add = (t) => { const s = (t == null ? '' : String(t)).trim(); if (s && /[A-Za-z]/.test(s)) set.add(s); };
  add(u.topic);
  (u.vocab || []).forEach(v => { add(v.word); add(v.example); });
  (u.grammar || []).forEach(g => {
    (g.examples || []).forEach(add);
    const sz = g.safeZone || {};
    (sz.templates || []).forEach(t => add(t.audioText));
  });
  const ph = u.phonics || {};
  (ph.words || []).forEach(w => add(w.word));
  const sl = ph.soundLabels || {};
  Object.keys(sl).forEach(k => add(sl[k].anchor));
  (u.reading || []).forEach(r => {
    add(r.text);
    (r.questions || []).forEach(q => { add(q.audioText); (q.choices || []).forEach(add); });
  });
  // bài lớn: phần "nói" — chỉ bake audioModels (câu mẫu hoàn chỉnh), KHÔNG bake sentenceFrames (có chỗ trống ___)
  (u.speaking || []).forEach(t => { (t.audioModels || []).forEach(add); });
  // recognition (vd Bài 5 can/can't làm quen): nếu có examples
  if (u.recognition && Array.isArray(u.recognition.examples)) u.recognition.examples.forEach(add);
  return Array.from(set);
}

/* ---------- Bake cả 1 level ---------- */
const ROOT = path.resolve(HERE, '..');                    // web_tienganh/
const CONTENT = path.join(ROOT, 'content');
const AUDIO_DIR = path.join(ROOT, 'audio');
const MANIFEST = path.join(AUDIO_DIR, 'manifest.json');

function readManifest() {
  if (fs.existsSync(MANIFEST)) { try { return JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); } catch (e) {} }
  return { voices: [], default: null, items: {} };
}

async function bakeLevel(level, voice, kbps) {
  const dir = path.join(CONTENT, 'level' + level);
  const idx = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
  const files = (idx.units || []).map(u => u.file);
  return bakeFiles(level, files, voice, kbps);
}

// Bake từ danh sách file cụ thể trong content/level{level}/ (vd các lesson0N.json).
async function bakeFiles(level, files, voice, kbps) {
  const dir = path.join(CONTENT, 'level' + level);
  const texts = new Set();
  for (const f of files) {
    const u = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    collectTextsFromUnit(u).forEach(t => texts.add(t));
  }
  const list = Array.from(texts);
  const voiceDir = path.join(AUDIO_DIR, voice);
  fs.mkdirSync(voiceDir, { recursive: true });
  const man = readManifest();
  if (man.voices.indexOf(voice) < 0) man.voices.push(voice);
  if (!man.default) man.default = voice;
  man.items = man.items || {};

  let made = 0, skipped = 0, bytes = 0, i = 0;
  for (const text of list) {
    i++;
    const key = audioKey(text);
    const outFile = path.join(voiceDir, key + '.mp3');
    if (fs.existsSync(outFile)) { skipped++; }
    else {
      const wav = piperSynthWav(text, voice);
      const mp3 = await wavToMp3(wav, kbps);
      fs.writeFileSync(outFile, mp3);
      made++; bytes += mp3.length;
    }
    const it = man.items[key] || { t: text, lv: [] };
    it.t = text;
    if (it.lv.indexOf(level) < 0) it.lv.push(level);
    man.items[key] = it;
    if (i % 25 === 0) process.stderr.write(`  ...${i}/${list.length}\n`);
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(man));
  return { level, voice, total: list.length, made, skipped, newBytes: bytes, manifestItems: Object.keys(man.items).length };
}

/* ---------- CLI ---------- */
const args = process.argv.slice(2);
function arg(name, def) { const i = args.indexOf(name); return i >= 0 ? args[i+1] : def; }

if (args.includes('--selftest')) {
  const text = arg('--selftest', 'Hello! My name is Pi.');
  const voice = arg('--voice', 'en_GB-alba-medium');
  const out = arg('--out', path.join(os.tmpdir(), 'bake_selftest.mp3'));
  const wav = piperSynthWav(text, voice);
  const mp3 = await wavToMp3(wav);
  fs.writeFileSync(out, mp3);
  console.log(JSON.stringify({ ok: true, voice, text, wavBytes: wav.length, mp3Bytes: mp3.length, out }));
} else if (args.includes('--level')) {
  const level = parseInt(arg('--level', '1'), 10);
  const voice = arg('--voice', 'en_GB-alba-medium');
  const kbps = parseInt(arg('--kbps', '56'), 10);
  const res = await bakeLevel(level, voice, kbps);
  console.log(JSON.stringify(res));
} else if (args.includes('--lessons')) {
  // Bake các bài lớn lesson0N.json (chỉ synth text MỚI, bỏ qua file đã có theo key).
  const level = parseInt(arg('--level', '1'), 10);
  const voice = arg('--voice', 'en_GB-alba-medium');
  const kbps = parseInt(arg('--kbps', '56'), 10);
  const n = parseInt(arg('--n', '5'), 10);
  const files = []; for (let i = 1; i <= n; i++) files.push('lesson0' + i + '.json');
  const res = await bakeFiles(level, files, voice, kbps);
  console.log(JSON.stringify(res));
}
