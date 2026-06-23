/*
 * tts.js — Bọc Web Speech API (SpeechSynthesis) cho web học tiếng Anh trẻ em.
 * ----------------------------------------------------------------------------
 * Classic script: window.TTS = { speak, speakSlow, cancel, isSupported, ... }.
 *
 * Mục tiêu (UX_FLOWS §7 điểm 9, BACKLOG US-G2):
 *   - Đọc văn bản TIẾNG ANH bằng giọng en-GB / en-US, tốc độ CHẬM cho trẻ.
 *   - Nút "đọc chậm" (speakSlow) — rate thấp hơn.
 *   - Có nút phát lại (gọi lại speak là đủ); chống double-tap chồng tiếng (cancel trước).
 *   - FALLBACK an toàn: máy thiếu giọng EN → vẫn không vỡ luồng; báo qua callback để UI
 *     hiện dải vàng "máy chưa có giọng tiếng Anh" (UX_FLOWS §5.4).
 *   - 100% offline: chỉ dùng API trình duyệt, KHÔNG gọi mạng.
 *
 * KHÔNG dùng để CHẤM phát âm (không SpeechRecognition) — theo review sư phạm.
 */
(function (global) {
  'use strict';

  var synth = (typeof global.speechSynthesis !== 'undefined') ? global.speechSynthesis : null;
  var UtterCtor = (typeof global.SpeechSynthesisUtterance !== 'undefined')
    ? global.SpeechSynthesisUtterance : null;

  // Cài đặt (đồng bộ với S9). Có thể đổi qua setVoicePref / setRate.
  var settings = {
    enabled: true,
    rate: 0.85,        // tốc độ thường cho trẻ (chậm hơn mặc định 1.0)
    rateSlow: 0.6,     // "nghe chậm"
    pitch: 1.05,       // hơi cao, thân thiện
    preferLang: 'en-GB' // 'en-GB' | 'en-US'
  };

  var voices = [];
  var chosenVoice = null;
  var voicesReady = false;
  var onMissingVoice = null; // callback() khi không tìm được giọng EN

  function isSupported() {
    return !!(synth && UtterCtor);
  }

  // Nạp danh sách giọng. Trên một số trình duyệt voices nạp bất đồng bộ
  // (event 'voiceschanged'); ta gọi refresh nhiều lần để chắc.
  function refreshVoices() {
    if (!synth) return;
    try {
      voices = synth.getVoices() || [];
    } catch (e) {
      voices = [];
    }
    chosenVoice = pickEnglishVoice(settings.preferLang);
    voicesReady = true;
  }

  function pickEnglishVoice(preferLang) {
    if (!voices || !voices.length) return null;
    var pref = (preferLang || 'en-GB').toLowerCase();
    var us = 'en-us', gb = 'en-gb';
    var exact = null, sameRegion = null, anyEn = null;
    for (var i = 0; i < voices.length; i++) {
      var v = voices[i];
      var lang = (v.lang || '').toLowerCase().replace('_', '-');
      if (lang === pref) { exact = v; break; }
      if (!sameRegion && (lang === us || lang === gb)) sameRegion = v;
      if (!anyEn && lang.indexOf('en') === 0) anyEn = v;
    }
    return exact || sameRegion || anyEn || null;
  }

  // Có giọng tiếng Anh để đọc không?
  function hasEnglishVoice() {
    if (!isSupported()) return false;
    if (!voicesReady) refreshVoices();
    return !!chosenVoice;
  }

  /**
   * Đọc văn bản EN. Tự huỷ tiếng đang đọc (chống chồng tiếng / double-tap).
   * @param {string} text
   * @param {object} [opts] { rate, slow, onstart, onend, onerror }
   * @returns {boolean} true nếu đã bắt đầu phát (hoặc cố gắng), false nếu không thể.
   */
  function speak(text, opts) {
    opts = opts || {};
    if (!settings.enabled) return false;
    if (!isSupported()) {
      notifyMissing();
      if (opts.onend) opts.onend();
      return false;
    }
    if (!voicesReady) refreshVoices();
    if (!chosenVoice) {
      // Không có giọng EN: báo UI (1 lần) nhưng KHÔNG vỡ luồng.
      notifyMissing();
      // Vẫn thử đọc bằng giọng mặc định để không "im lặng hoàn toàn" nếu có thể.
    }
    var str = String(text == null ? '' : text).trim();
    if (!str) { if (opts.onend) opts.onend(); return false; }

    try { synth.cancel(); } catch (e) {}

    var u;
    try {
      u = new UtterCtor(str);
    } catch (e) {
      if (opts.onend) opts.onend();
      return false;
    }
    if (chosenVoice) {
      u.voice = chosenVoice;
      u.lang = chosenVoice.lang;
    } else {
      u.lang = settings.preferLang;
    }
    u.rate = (typeof opts.rate === 'number') ? opts.rate
             : (opts.slow ? settings.rateSlow : settings.rate);
    u.pitch = settings.pitch;
    if (opts.onstart) u.onstart = function () { try { opts.onstart(); } catch (e) {} };
    var done = false;
    function finish() {
      if (done) return; done = true;
      if (opts.onend) { try { opts.onend(); } catch (e) {} }
    }
    u.onend = finish;
    u.onerror = function (ev) {
      if (opts.onerror) { try { opts.onerror(ev); } catch (e) {} }
      finish();
    };

    try {
      synth.speak(u);
      return true;
    } catch (e) {
      finish();
      return false;
    }
  }

  function speakSlow(text, opts) {
    opts = opts || {};
    opts.slow = true;
    return speak(text, opts);
  }

  function cancel() {
    if (!synth) return;
    try { synth.cancel(); } catch (e) {}
  }

  function notifyMissing() {
    if (typeof onMissingVoice === 'function') {
      try { onMissingVoice(); } catch (e) {}
    }
  }

  /* ----------------------------- CÀI ĐẶT ----------------------------- */
  function setEnabled(on) { settings.enabled = !!on; if (!on) cancel(); }
  function getEnabled() { return settings.enabled; }
  function setVoicePref(lang) {
    if (lang === 'en-US' || lang === 'en-GB') {
      settings.preferLang = lang;
      chosenVoice = pickEnglishVoice(lang);
    }
  }
  function getVoicePref() { return settings.preferLang; }
  // Tốc độ: 'normal' | 'slow' điều khiển rate khi gọi speak() không opts.slow.
  function setSpeed(mode) {
    settings.rate = (mode === 'slow') ? 0.6 : 0.85;
  }
  function getSpeed() { return settings.rate <= 0.7 ? 'slow' : 'normal'; }
  function setOnMissingVoice(fn) { onMissingVoice = fn; }

  /* --------------------------- KHỞI TẠO ------------------------------ */
  if (synth) {
    refreshVoices();
    // voiceschanged: nhiều trình duyệt nạp giọng sau khi trang mở.
    try {
      synth.addEventListener
        ? synth.addEventListener('voiceschanged', refreshVoices)
        : (synth.onvoiceschanged = refreshVoices);
    } catch (e) {}
    // Một số trình duyệt cần "đánh thức" — thử lại sau chốc lát.
    setTimeout(refreshVoices, 250);
    setTimeout(refreshVoices, 1200);
  }

  var TTS = {
    speak: speak,
    speakSlow: speakSlow,
    cancel: cancel,
    isSupported: isSupported,
    hasEnglishVoice: hasEnglishVoice,
    refreshVoices: refreshVoices,
    setEnabled: setEnabled,
    getEnabled: getEnabled,
    setVoicePref: setVoicePref,
    getVoicePref: getVoicePref,
    setSpeed: setSpeed,
    getSpeed: getSpeed,
    setOnMissingVoice: setOnMissingVoice
  };

  global.TTS = TTS;
  if (typeof module !== 'undefined' && module.exports) module.exports = TTS;

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
