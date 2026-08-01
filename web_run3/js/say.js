/* say.js — Đọc tiếng Anh cho "Ngữ Pháp Vui 3".  window.Say
   Hai tầng, tự động chọn:
     1) MP3 bake sẵn (giọng neural Piper) — dùng khi có file cho câu đó.
     2) Web Speech (giọng máy) — dự phòng khi chưa bake hoặc máy không có file.
   Nếu máy KHÔNG có giọng tiếng Anh và cũng không có mp3 -> Say.available() = false,
   giao diện tự ẩn nút loa (không để nút chết).

   CHẠY ĐƯỢC TRÊN file://: cố tình KHÔNG dùng fetch() ở đâu cả. Danh mục file
   nhúng sẵn thành data/audio-manifest.js, và mp3 phát bằng <audio src="..."> —
   thẻ media nạp đường dẫn tương đối vẫn hoạt động khi mở bằng file://.
   Khoá âm phải KHỚP build/bake_run3_audio.mjs (FNV-1a của text đã chuẩn hoá).
*/
(function (global) {
  'use strict';

  var doc = global.document;
  var man = global.RUN3_AUDIO || null;      // {voice, dir, keys:{key:1}}
  var cur = null;                            // <audio> đang phát
  var seqStop = false;                       // cờ dừng chuỗi chant
  var voices = [];
  var enVoice = null;

  /* ---------- khoá âm (khớp script bake) ---------- */
  function normalizeText(t) {
    return String(t == null ? '' : t).trim().toLowerCase().replace(/\s+/g, ' ');
  }
  function fnv1a(s) {
    var h = 0x811c9dc5 >>> 0;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return ('00000000' + h.toString(16)).slice(-8);
  }
  function audioKey(t) { return fnv1a(normalizeText(t)); }

  function bakedUrl(text) {
    if (!man || !man.keys) return null;
    var k = audioKey(text);
    if (!man.keys[k]) return null;
    return (man.dir || 'audio') + '/' + man.voice + '/' + k + '.mp3';
  }

  /* ---------- giọng máy (Web Speech) ---------- */
  var synth = global.speechSynthesis || null;

  function pickVoice() {
    if (!synth) return null;
    try { voices = synth.getVoices() || []; } catch (e) { voices = []; }
    var i, v;
    for (i = 0; i < voices.length; i++) {           // ưu tiên Anh-Anh
      v = voices[i];
      if (v.lang && v.lang.toLowerCase().indexOf('en-gb') === 0) return v;
    }
    for (i = 0; i < voices.length; i++) {           // rồi tới bất kỳ giọng Anh nào
      v = voices[i];
      if (v.lang && v.lang.toLowerCase().indexOf('en') === 0) return v;
    }
    return null;
  }

  if (synth) {
    enVoice = pickVoice();
    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', function () { enVoice = pickVoice(); });
    }
  }

  function hasBaked() { return !!(man && man.keys && man.voice); }
  function hasTTS() { return !!(synth && enVoice); }
  function available() { return hasBaked() || hasTTS(); }

  function stop() {
    seqStop = true;
    if (cur) { try { cur.pause(); } catch (e) {} cur = null; }
    if (synth) { try { synth.cancel(); } catch (e) {} }
  }

  /* ---------- phát 1 câu, trả Promise (luôn resolve, không bao giờ reject) ---------- */
  function playOne(text, opts) {
    opts = opts || {};
    var t = String(text == null ? '' : text).trim();
    if (!t) return Promise.resolve(false);

    var url = bakedUrl(t);
    if (url) {
      return new Promise(function (resolve) {
        var a = new Audio(url);
        a.playbackRate = opts.slow ? 0.75 : 1;
        cur = a;
        var done = false;
        function fin(ok) {
          if (done) return;
          done = true;
          if (cur === a) cur = null;
          resolve(ok);
        }
        a.addEventListener('ended', function () { fin(true); });
        a.addEventListener('error', function () { fin(false); });
        var p = a.play();
        if (p && typeof p.catch === 'function') {
          p.catch(function () { fin(false); });
        }
      }).then(function (ok) {
        return ok ? true : ttsOne(t, opts);   // mp3 hỏng -> rơi về giọng máy
      });
    }
    return ttsOne(t, opts);
  }

  function ttsOne(text, opts) {
    opts = opts || {};
    if (!synth) return Promise.resolve(false);
    if (!enVoice) enVoice = pickVoice();
    return new Promise(function (resolve) {
      var u;
      try { u = new global.SpeechSynthesisUtterance(text); } catch (e) { resolve(false); return; }
      if (enVoice) { u.voice = enVoice; u.lang = enVoice.lang; } else { u.lang = 'en-GB'; }
      u.rate = opts.slow ? 0.6 : 0.85;
      u.pitch = 1.05;
      var done = false;
      function fin() { if (!done) { done = true; resolve(true); } }
      u.onend = fin;
      u.onerror = fin;
      try { synth.cancel(); synth.speak(u); } catch (e) { resolve(false); return; }
      // chốt an toàn: một số máy không bắn onend
      global.setTimeout(fin, Math.max(1500, text.length * 110));
    });
  }

  function speak(text, opts) {
    stop();
    seqStop = false;
    return playOne(text, opts);
  }

  /* ---------- phát chuỗi cụm (cho chế độ Đọc theo nhịp / karaoke) ----------
     onChunk(i) được gọi NGAY TRƯỚC khi cụm thứ i phát -> để tô sáng đúng lúc. */
  function speakSeq(chunks, onChunk, opts) {
    stop();
    seqStop = false;
    opts = opts || {};
    var gap = opts.gap === undefined ? 220 : opts.gap;
    var i = 0;
    function next() {
      if (seqStop || i >= chunks.length) {
        if (typeof onChunk === 'function') onChunk(-1);
        return Promise.resolve(!seqStop);
      }
      var idx = i++;
      if (typeof onChunk === 'function') onChunk(idx);
      return playOne(chunks[idx], opts).then(function () {
        if (seqStop) return false;
        return new Promise(function (r) { global.setTimeout(r, gap); }).then(next);
      });
    }
    return next();
  }

  /* ---------- nút loa dùng lại nhiều nơi ---------- */
  function button(text, label) {
    if (!available()) return null;
    var b = doc.createElement('button');
    b.type = 'button';
    b.className = 'say-btn';
    b.title = label || 'Nghe';
    b.setAttribute('aria-label', label || 'Nghe câu này');
    b.textContent = '🔊';
    b.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      speak(text);
    });
    return b;
  }

  global.Say = {
    speak: speak,
    speakSeq: speakSeq,
    stop: stop,
    button: button,
    available: available,
    hasBaked: hasBaked,
    hasTTS: hasTTS,
    audioKey: audioKey
  };
})(typeof window !== 'undefined' ? window : this);
