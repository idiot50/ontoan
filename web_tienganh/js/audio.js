/*
 * audio.js — Lớp PHÁT ÂM đa nguồn cho web học Pi.
 * ----------------------------------------------------------------------------
 * window.AudioPlay = { loadManifest, play, cancel, getVoice, setVoice, availableVoices, ... }
 *
 * Cơ chế:
 *   - Có file mp3 SINH SẴN (baked) cho text + người dùng chọn 1 "giọng chuẩn" → phát mp3
 *     (đọc được trên MỌI máy kể cả không có giọng tiếng Anh, vẫn offline sau khi tải).
 *   - Ngược lại (chọn "Giọng máy", hoặc text chưa bake, hoặc lỗi) → fallback Web Speech (TTS).
 *   - Lựa chọn giọng là GLOBAL (localStorage), áp dụng cho cả website.
 *
 * Khoá âm (audioKey) PHẢI khớp build/bake_audio.mjs (normalize + FNV-1a).
 * mp3 đặt ở: audio/<voiceId>/<key>.mp3 ; danh mục: audio/manifest.json.
 */
(function (global) {
  'use strict';

  var VOICE_KEY = 'pi_audio_voice';
  var manifest = null;
  var manifestPromise = null;
  var current = null; // <audio> đang phát

  /* ----- khoá âm (khớp bake_audio.mjs) ----- */
  function normalizeText(t) { return String(t == null ? '' : t).trim().toLowerCase().replace(/\s+/g, ' '); }
  function fnv1a(s) {
    var h = 0x811c9dc5 >>> 0;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return ('00000000' + h.toString(16)).slice(-8);
  }
  function audioKey(t) { return fnv1a(normalizeText(t)); }

  /* ----- manifest ----- */
  function loadManifest() {
    if (manifestPromise) return manifestPromise;
    // file:// chặn fetch → bỏ qua, dùng TTS. (Bản deploy là http nên vẫn đầy đủ.)
    if (global.location && global.location.protocol === 'file:') {
      manifestPromise = Promise.resolve(null);
      return manifestPromise;
    }
    manifestPromise = fetch('audio/manifest.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { manifest = j; return j; })
      .catch(function () { manifest = null; return null; });
    return manifestPromise;
  }

  function hasBaked() { return !!(manifest && manifest.voices && manifest.voices.length); }
  function voiceLabel(v) {
    var map = {
      'device': 'Giọng máy',
      'en_GB-alba-medium': 'Anh-Anh (Alba)',
      'en_US-amy-medium': 'Anh-Mỹ (Amy)'
    };
    return map[v] || v;
  }
  function availableVoices() {
    var arr = [{ id: 'device', label: voiceLabel('device') }];
    if (hasBaked()) manifest.voices.forEach(function (v) { arr.push({ id: v, label: voiceLabel(v) }); });
    return arr;
  }

  function getVoice() {
    var saved = null;
    try { saved = localStorage.getItem(VOICE_KEY); } catch (e) {}
    if (saved) {
      if (saved === 'device') return 'device';
      if (hasBaked() && manifest.voices.indexOf(saved) >= 0) return saved;
    }
    // mặc định: giọng baked chuẩn nếu có, ngược lại giọng máy
    if (hasBaked()) return manifest.default || manifest.voices[0];
    return 'device';
  }
  function setVoice(v) { try { localStorage.setItem(VOICE_KEY, v); } catch (e) {} }
  function usingBaked() { return getVoice() !== 'device' && hasBaked(); }

  /* ----- phát ----- */
  function ttsPlay(text, opts) {
    if (global.TTS && global.TTS.speak) return global.TTS.speak(text, opts);
    if (opts && opts.onend) opts.onend();
    return false;
  }

  function play(text, opts) {
    opts = opts || {};
    if (!text) { if (opts.onend) opts.onend(); return false; }
    var voice = getVoice();
    if (voice !== 'device' && manifest && manifest.items) {
      var key = audioKey(text);
      if (manifest.items[key]) {
        try { if (current) { current.onended = current.onerror = null; current.pause(); } } catch (e) {}
        var a = new Audio('audio/' + voice + '/' + key + '.mp3');
        a.playbackRate = opts.slow ? 0.75 : 1.0;
        current = a;
        var done = false;
        function fin(cb) { if (done) return; done = true; if (cb) { try { cb(); } catch (e) {} } }
        if (opts.onstart) a.onplay = function () { try { opts.onstart(); } catch (e) {} };
        a.onended = function () { fin(opts.onend); };
        a.onerror = function () { if (!done) { done = true; ttsPlay(text, opts); } };
        var p = a.play();
        if (p && p.catch) p.catch(function () { if (!done) { done = true; ttsPlay(text, opts); } });
        return true;
      }
    }
    return ttsPlay(text, opts);
  }

  function cancel() {
    try { if (current) { current.onended = current.onerror = null; current.pause(); current = null; } } catch (e) {}
    if (global.TTS && global.TTS.cancel) global.TTS.cancel();
  }

  global.AudioPlay = {
    loadManifest: loadManifest,
    play: play,
    cancel: cancel,
    getVoice: getVoice,
    setVoice: setVoice,
    availableVoices: availableVoices,
    usingBaked: usingBaked,
    hasBaked: hasBaked,
    audioKey: audioKey
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = global.AudioPlay;

})(typeof window !== 'undefined' ? window : globalThis);
