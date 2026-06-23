/*
 * progress.js — PROGRESS API (CONTRACTS.md §3) — JS thuần, OFFLINE-FIRST.
 *
 * Nguồn sự thật của tiến độ = THIẾT BỊ (localStorage). KHÔNG gọi mạng.
 * `sync()` là no-op an toàn cho MVP (Firebase để pha sau — ARCHITECTURE ADR-7/§7).
 *
 * Phơi API ra global: window.Progress = { save, getMastery, sync, ... }.
 *
 * Bất biến (CONTRACTS §3.5):
 *   1. Local trước — save ghi local NGAY cả khi offline; không mất bản ghi vì mất mạng.
 *   2. Idempotent — khoá bản ghi (childId, level, unit, skill, ts); save/sync lại KHÔNG nhân đôi.
 *   3. Không PII trẻ — chỉ lưu đúng trường schema; bỏ mọi trường lạ (tên thật/ảnh/ngày sinh…).
 *   4. Offline an toàn — sync() khi offline trả {ok:true, online:false} (no-op), không ném lỗi.
 *   5. Không streak cứng — weeklyDays là mục tiêu MỀM; không có trường "streak".
 *
 * Sư phạm: skill "speaking" lưu score=null (KHÔNG chấm điểm); tiến độ thiên nỗ lực
 *   (effort/attempts), KHÔNG chỉ điểm đúng. Speaking không tính vào mastery.
 */
(function (global) {
  'use strict';

  /* ============================ HẰNG SỐ ============================ */

  var SCHEMA_VERSION = 1;
  var STORE_KEY = 'enkids_v1';          // khoá versioned (đổi v khi migrate)

  // Kỹ năng hợp lệ (CONTRACTS §3.2). "speaking" KHÔNG chấm điểm (score=null).
  var VALID_SKILLS = ['vocab', 'grammar', 'phonics', 'listening', 'speaking', 'reading'];
  // Kỹ năng tính vào masteryPct (speaking score=null → loại khỏi mastery; tính effort).
  var MASTERY_SKILLS = ['vocab', 'grammar', 'phonics', 'listening', 'reading'];

  // Chỉ giữ ĐÚNG các trường này của một record (chống lưu PII / trường lạ — bất biến 3).
  var RECORD_FIELDS = ['childId', 'level', 'unit', 'skill', 'score', 'attempts', 'ts', 'effort'];

  /* ====================== LƯU TRỮ CHỊU LỖI ======================= */
  // Mọi truy cập localStorage bọc try/catch (ARCHITECTURE §3 / safety): storage
  // hỏng/đầy/bị chặn (file:// một số trình duyệt) → KHÔNG vỡ app, dùng bản nhớ tạm.

  var memoryFallback = null; // bản sao trong RAM khi localStorage không khả dụng

  function freshState() {
    return {
      v: SCHEMA_VERSION,
      activeChildId: null,
      children: {},                       // childId -> ChildProfile
      sync: { enabled: false, uid: null, lastPushTs: 0, lastPullTs: 0 },
      outbox: []                          // hàng đợi đồng bộ (chỉ điền sẵn, MVP không xả)
    };
  }

  function loadState() {
    var raw = null;
    try {
      raw = global.localStorage ? global.localStorage.getItem(STORE_KEY) : null;
    } catch (e) {
      raw = null; // localStorage bị chặn/hỏng -> rơi về memoryFallback
    }
    if (raw == null) {
      if (memoryFallback) return memoryFallback;
      return freshState();
    }
    var parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      parsed = null; // JSON hỏng -> coi như chưa có, không vỡ app
    }
    if (!parsed || typeof parsed !== 'object') return freshState();
    return migrate(parsed);
  }

  function saveState(state) {
    memoryFallback = state; // luôn giữ bản RAM để đọc-sau-ghi nhất quán dù storage lỗi
    try {
      if (global.localStorage) {
        global.localStorage.setItem(STORE_KEY, JSON.stringify(state));
        return true;
      }
    } catch (e) {
      // hết chỗ / bị chặn -> bỏ qua, dữ liệu vẫn còn trong memoryFallback của phiên
    }
    return false;
  }

  // Migrate an toàn theo schema version (hiện chỉ chuẩn hoá hình dạng).
  function migrate(parsed) {
    var base = freshState();
    if (typeof parsed.activeChildId === 'string') base.activeChildId = parsed.activeChildId;
    if (parsed.children && typeof parsed.children === 'object') {
      for (var id in parsed.children) {
        if (!Object.prototype.hasOwnProperty.call(parsed.children, id)) continue;
        base.children[id] = normalizeChild(parsed.children[id]);
      }
    }
    if (parsed.sync && typeof parsed.sync === 'object') {
      base.sync.enabled = parsed.sync.enabled === true;
      base.sync.uid = typeof parsed.sync.uid === 'string' ? parsed.sync.uid : null;
      base.sync.lastPushTs = num(parsed.sync.lastPushTs, 0);
      base.sync.lastPullTs = num(parsed.sync.lastPullTs, 0);
    }
    if (Array.isArray(parsed.outbox)) base.outbox = parsed.outbox.slice(0, 500);
    base.v = SCHEMA_VERSION;
    return base;
  }

  function normalizeChild(c) {
    c = (c && typeof c === 'object') ? c : {};
    return {
      name: typeof c.name === 'string' ? c.name : 'Bé',
      avatar: typeof c.avatar === 'string' ? c.avatar : '🦊',
      createdTs: num(c.createdTs, Date.now()),
      // progress: "level_unit" -> { level, unit, skills:{ skill:{score,attempts,ts,effort,seen} }, effort, lastTs }
      progress: (c.progress && typeof c.progress === 'object') ? c.progress : {},
      effort: (c.effort && typeof c.effort === 'object') ? c.effort
              : { weekKey: '', daysThisWeek: 0, graceTickets: 1, days: {} },
      reviewQueue: Array.isArray(c.reviewQueue) ? c.reviewQueue : []
    };
  }

  /* ========================== TIỆN ÍCH =========================== */

  function num(v, def) {
    return (typeof v === 'number' && isFinite(v)) ? v : def;
  }

  function unitKey(level, unit) {
    return level + '_' + unit;
  }

  // ISO week key "YYYY-Www" (mục tiêu tuần MỀM; KHÔNG phải streak cứng).
  function weekKeyOf(ts) {
    var d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    // Thứ Năm của tuần ISO quyết định năm ISO.
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    var week1 = new Date(d.getFullYear(), 0, 4);
    var weekNo = 1 + Math.round(
      ((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    );
    var ww = weekNo < 10 ? '0' + weekNo : '' + weekNo;
    return d.getFullYear() + '-W' + ww;
  }

  // Khoá ngày local "YYYY-MM-DD" để đếm số ngày học trong tuần (không trùng ngày).
  function dayKeyOf(ts) {
    var d = new Date(ts);
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
  }

  function clampScore(s) {
    if (s < 0) return 0;
    if (s > 1) return 1;
    return s;
  }

  function genChildId() {
    var rnd = Math.random().toString(36).slice(2, 8);
    // chèn thêm thời gian để giảm khả năng trùng khi tạo nhanh nhiều hồ sơ
    return 'c_' + Date.now().toString(36).slice(-4) + rnd;
  }

  /* ===================== KIỂM TRA & LỌC RECORD ==================== */
  // Lọc record về ĐÚNG schema (bất biến 3: không lưu PII / trường lạ).
  // Trả { ok, record, error }.
  function sanitizeRecord(input) {
    if (!input || typeof input !== 'object') {
      return { ok: false, error: 'record phải là một object' };
    }

    var r = {};
    // chỉ copy đúng các trường cho phép — mọi trường khác (tên thật, ảnh…) bị BỎ
    for (var i = 0; i < RECORD_FIELDS.length; i++) {
      var f = RECORD_FIELDS[i];
      if (Object.prototype.hasOwnProperty.call(input, f)) r[f] = input[f];
    }

    if (typeof r.childId !== 'string' || r.childId === '') {
      return { ok: false, error: 'childId (string) là bắt buộc' };
    }
    if (typeof r.level !== 'number' || !isFinite(r.level)) {
      return { ok: false, error: 'level (number) là bắt buộc' };
    }
    if (typeof r.unit !== 'number' || !isFinite(r.unit)) {
      return { ok: false, error: 'unit (number) là bắt buộc' };
    }
    if (VALID_SKILLS.indexOf(r.skill) === -1) {
      return { ok: false, error: 'skill không hợp lệ: ' + r.skill };
    }

    // score: 0..1 HOẶC null cho speaking (CONTRACTS §3.2).
    if (r.skill === 'speaking') {
      r.score = null; // ép null — speaking KHÔNG chấm điểm dù gọi truyền số
    } else if (r.score === null || typeof r.score === 'undefined') {
      r.score = null; // cho phép null (kỹ năng không chấm) — không tính vào mastery
    } else if (typeof r.score === 'number' && isFinite(r.score)) {
      r.score = clampScore(r.score);
    } else {
      return { ok: false, error: 'score phải là số 0..1 hoặc null' };
    }

    r.attempts = Math.max(0, Math.floor(num(r.attempts, 0)));
    r.effort = Math.max(0, Math.floor(num(r.effort, 0)));
    r.ts = num(r.ts, Date.now());

    return { ok: true, record: r };
  }

  /* ===================== HỢP NHẤT (ĐƠN ĐIỆU) ==================== */
  // Gộp record vào ô skill của một unit. KHÔNG append hàng mới — gộp đơn điệu để
  // sync lại không nhân đôi (idempotent). Quy tắc theo ARCHITECTURE §3.3:
  //   score : LWW theo ts (mastery là trạng thái mới nhất, không cộng).
  //           Cùng ts mà score KHÁC nhau -> tie-break = max(score) để merge GIAO HOÁN
  //           (idempotent + không phụ thuộc thứ tự gộp).
  //   attempts/effort : max (đơn điệu tăng; chống cộng-trùng khi đẩy lại)
  //   ts : max
  //   seen : số bản ghi có ts KHÁC nhau đã gộp (trọng số mastery). Đơn điệu tăng,
  //          KHÔNG tăng khi đẩy lại cùng ts (idempotent).
  function mergeSkill(prev, rec) {
    var prevExists = !!prev;
    prev = prev || { score: null, attempts: 0, effort: 0, ts: 0, seen: 0 };

    var prevSeen = num(prev.seen, 0);
    var prevTs = num(prev.ts, 0);

    var out = {
      score: prev.score,
      attempts: Math.max(num(prev.attempts, 0), rec.attempts),
      effort: Math.max(num(prev.effort, 0), rec.effort),
      ts: Math.max(prevTs, rec.ts),
      seen: prevSeen
    };

    // seen = số bản ghi có ts khác nhau. Quy tắc rõ ràng, giao hoán:
    //  - Chưa có bản ghi nào (prev rỗng hoặc seen=0) -> bản ghi đầu tiên: seen=1.
    //  - Đã có và rec.ts KHÁC prev.ts -> thêm 1 phiên.
    //  - rec.ts TRÙNG prev.ts -> lặp lại đúng phiên cũ -> giữ nguyên (idempotent).
    if (!prevExists || prevSeen === 0) {
      out.seen = 1;
    } else if (rec.ts !== prevTs) {
      out.seen = prevSeen + 1;
    } else {
      out.seen = prevSeen;
    }

    // score: LWW theo ts; bỏ qua score=null (speaking / kỹ năng không chấm) — không
    // ghi đè điểm cũ. Cùng ts, hai điểm khác nhau -> tie-break max (giao hoán).
    if (rec.score !== null) {
      if (prev.score === null) {
        out.score = rec.score;             // cũ chưa có điểm -> nhận điểm mới
      } else if (rec.ts > prevTs) {
        out.score = rec.score;             // mới hơn -> ghi đè (LWW)
      } else if (rec.ts === prevTs) {
        out.score = Math.max(prev.score, rec.score); // cùng ts -> tie-break ổn định
      } // rec.ts < prevTs -> giữ điểm cũ (mới hơn thắng)
    }
    return out;
  }

  /* ========================= API: save ========================= */
  // Ghi một bản ghi kết quả: LƯU LOCAL NGAY (kể cả offline) + đẩy delta vào outbox.
  // Trả Promise<void> (CONTRACTS §3.1). Idempotent theo (childId,level,unit,skill,ts).
  function save(record) {
    return new Promise(function (resolve, reject) {
      var clean = sanitizeRecord(record);
      if (!clean.ok) {
        reject(new Error('progress.save: ' + clean.error));
        return;
      }
      var r = clean.record;

      var state = loadState();

      // Hỗ trợ nhiều hồ sơ con: tự tạo hồ sơ tối thiểu nếu chưa có (không PII).
      if (!state.children[r.childId]) {
        state.children[r.childId] = normalizeChild({ createdTs: r.ts });
      }
      var child = state.children[r.childId];
      if (!state.activeChildId) state.activeChildId = r.childId;

      var uk = unitKey(r.level, r.unit);
      var u = child.progress[uk];
      if (!u) {
        u = { level: r.level, unit: r.unit, skills: {}, effort: 0, lastTs: 0 };
        child.progress[uk] = u;
      }

      u.skills[r.skill] = mergeSkill(u.skills[r.skill], r);
      // effort của unit = tổng effort các skill (đơn điệu qua max từng skill).
      u.effort = sumEffort(u.skills);
      u.lastTs = Math.max(num(u.lastTs, 0), r.ts);

      // Mục tiêu tuần MỀM: đếm số NGÀY học trong tuần hiện tại (không streak cứng).
      bumpWeeklyEffort(child, r.ts);

      // Outbox: delta gộp theo unit (idempotent) — sẵn cho pha sync sau, MVP không xả.
      queueOutbox(state, r.childId, uk);

      saveState(state);
      resolve();
    });
  }

  function sumEffort(skills) {
    var total = 0;
    for (var s in skills) {
      if (Object.prototype.hasOwnProperty.call(skills, s)) total += num(skills[s].effort, 0);
    }
    return total;
  }

  function bumpWeeklyEffort(child, ts) {
    var wk = weekKeyOf(ts);
    var dk = dayKeyOf(ts);
    if (!child.effort || child.effort.weekKey !== wk) {
      // sang tuần mới -> reset đếm ngày (giữ graceTickets, không "đứt chuỗi")
      child.effort = {
        weekKey: wk,
        daysThisWeek: 0,
        graceTickets: child.effort ? num(child.effort.graceTickets, 1) : 1,
        days: {}
      };
    }
    if (!child.effort.days) child.effort.days = {};
    if (!child.effort.days[dk]) {
      child.effort.days[dk] = true;
      child.effort.daysThisWeek = Object.keys(child.effort.days).length;
    }
  }

  // Gộp một mục outbox/unit (1 mục/unit/child) — đẩy lại không nhân đôi.
  function queueOutbox(state, childId, uk) {
    var id = childId + ':' + uk;
    var found = null;
    for (var i = 0; i < state.outbox.length; i++) {
      if (state.outbox[i].id === id) { found = state.outbox[i]; break; }
    }
    if (found) {
      found.ts = Date.now();
    } else {
      state.outbox.push({ id: id, childId: childId, unitKey: uk, ts: Date.now() });
      if (state.outbox.length > 500) state.outbox.shift();
    }
  }

  /* ====================== API: getMastery ===================== */
  // Lấy % thành thạo từng unit của một hồ sơ con (CONTRACTS §3.3). Trả Promise<Mastery>.
  function getMastery(childId) {
    return new Promise(function (resolve) {
      var state = loadState();
      var child = state.children[childId];

      var result = {
        childId: childId,
        units: [],
        weeklyDays: 0
      };

      if (!child) {
        resolve(result); // hồ sơ chưa có -> rỗng an toàn, không ném lỗi
        return;
      }

      result.weeklyDays = child.effort ? num(child.effort.daysThisWeek, 0) : 0;

      var keys = Object.keys(child.progress);
      // sắp theo level rồi unit cho ổn định/đoán được
      keys.sort(function (a, b) {
        var ua = child.progress[a], ub = child.progress[b];
        if (ua.level !== ub.level) return ua.level - ub.level;
        return ua.unit - ub.unit;
      });

      for (var i = 0; i < keys.length; i++) {
        var u = child.progress[keys[i]];
        result.units.push(buildUnitMastery(u));
      }

      resolve(result);
    });
  }

  function buildUnitMastery(u) {
    // bySkill: % theo từng kỹ năng (0..100). Skill chưa học -> 0.
    var bySkill = {};
    var allSkills = ['vocab', 'grammar', 'phonics', 'listening', 'reading', 'speaking'];
    for (var i = 0; i < allSkills.length; i++) {
      var sk = allSkills[i];
      var cell = u.skills[sk];
      if (sk === 'speaking') {
        // speaking KHÔNG có điểm -> báo % theo "đã luyện hay chưa" (0/100) cho UI,
        // KHÔNG đưa vào trung bình mastery.
        bySkill[sk] = (cell && num(cell.effort, 0) > 0) ? 100 : 0;
      } else {
        bySkill[sk] = (cell && typeof cell.score === 'number')
          ? Math.round(clampScore(cell.score) * 100)
          : 0;
      }
    }

    // masteryPct = trung bình CÓ TRỌNG SỐ các skill chấm điểm đã có dữ liệu.
    // Trọng số = số bản ghi (seen) của skill -> skill luyện nhiều ảnh hưởng hơn.
    var wsum = 0, acc = 0;
    for (var j = 0; j < MASTERY_SKILLS.length; j++) {
      var msk = MASTERY_SKILLS[j];
      var c = u.skills[msk];
      if (c && typeof c.score === 'number') {
        var w = Math.max(1, num(c.seen, 1));
        acc += clampScore(c.score) * w;
        wsum += w;
      }
    }
    var masteryPct = wsum > 0 ? Math.round((acc / wsum) * 100) : 0;

    // effort tổng (gồm cả speaking — nỗ lực luôn được tính, theo sư phạm).
    var effort = 0;
    for (var s in u.skills) {
      if (Object.prototype.hasOwnProperty.call(u.skills, s)) effort += num(u.skills[s].effort, 0);
    }

    // practiced (BỔ SUNG tương thích): các kỹ năng ĐÃ LUYỆN (có effort > 0), bất kể
    // có chấm điểm hay không. Dùng cho UI đánh dấu "đã làm" + mở khoá theo COMPLETION
    // (vocab/speaking score=null nên bySkill=0, không thể suy "đã làm" từ %).
    var practiced = {};
    for (var ps in u.skills) {
      if (!Object.prototype.hasOwnProperty.call(u.skills, ps)) continue;
      practiced[ps] = num(u.skills[ps].effort, 0) > 0;
    }

    return {
      level: u.level,
      unit: u.unit,
      masteryPct: masteryPct,
      bySkill: bySkill,
      practiced: practiced,
      effort: effort,
      lastTs: num(u.lastTs, 0)
    };
  }

  /* ========================= API: sync ======================== */
  // MVP: NO-OP an toàn. KHÔNG gọi mạng (giữ test an toàn/offline xanh).
  // Khi offline (hoặc sync chưa bật) trả {ok:true, online:false} — bất biến 4.
  // Firebase để pha sau (ARCHITECTURE §7) — lazy-load vùng sync/ riêng.
  function sync() {
    return new Promise(function (resolve) {
      var online = (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean')
        ? navigator.onLine : false;
      // MVP không có backend cloud -> luôn no-op, không push/pull thật.
      resolve({ ok: true, pushed: 0, pulled: 0, online: online });
    });
  }

  /* =================== TIỆN ÍCH HỒ SƠ (kèm thêm) ================ */
  // Không thuộc contract bắt buộc nhưng cần cho Frontend (S0/S1/S8): quản lý hồ sơ
  // nhiều con + Export/Import JSON (backup). Giữ "không PII trẻ": chỉ biệt danh + emoji.

  function listChildren() {
    var state = loadState();
    var out = [];
    for (var id in state.children) {
      if (!Object.prototype.hasOwnProperty.call(state.children, id)) continue;
      var c = state.children[id];
      out.push({
        childId: id,
        name: c.name,
        avatar: c.avatar,
        createdTs: c.createdTs,
        unitsLearned: Object.keys(c.progress).length
      });
    }
    out.sort(function (a, b) { return a.createdTs - b.createdTs; });
    return out;
  }

  function createChild(name, avatar) {
    var state = loadState();
    var id = genChildId();
    state.children[id] = normalizeChild({
      name: (typeof name === 'string' && name.trim()) ? name.trim().slice(0, 40) : 'Bé',
      avatar: typeof avatar === 'string' ? avatar : '🦊',
      createdTs: Date.now()
    });
    if (!state.activeChildId) state.activeChildId = id;
    saveState(state);
    return id;
  }

  function updateChild(childId, patch) {
    var state = loadState();
    var c = state.children[childId];
    if (!c) return false;
    patch = patch || {};
    if (typeof patch.name === 'string') c.name = patch.name.trim().slice(0, 40) || c.name;
    if (typeof patch.avatar === 'string') c.avatar = patch.avatar;
    saveState(state);
    return true;
  }

  function deleteChild(childId) {
    var state = loadState();
    if (!state.children[childId]) return false;
    delete state.children[childId];
    if (state.activeChildId === childId) {
      var ids = Object.keys(state.children);
      state.activeChildId = ids.length ? ids[0] : null;
    }
    // dọn outbox của con đã xoá
    state.outbox = state.outbox.filter(function (o) { return o.childId !== childId; });
    saveState(state);
    return true;
  }

  function getActiveChildId() {
    return loadState().activeChildId;
  }

  function setActiveChild(childId) {
    var state = loadState();
    if (!state.children[childId]) return false;
    state.activeChildId = childId;
    saveState(state);
    return true;
  }

  // Export toàn bộ dữ liệu (JSON) để phụ huynh tự backup / chuyển máy.
  function exportData() {
    return JSON.stringify(loadState());
  }

  // Import (merge đơn điệu theo con/skill) — KHÔNG đè sạch để không mất tiến độ.
  function importData(json) {
    var incoming;
    try {
      incoming = (typeof json === 'string') ? JSON.parse(json) : json;
    } catch (e) {
      return { ok: false, error: 'JSON không hợp lệ' };
    }
    if (!incoming || typeof incoming !== 'object') {
      return { ok: false, error: 'Dữ liệu import rỗng/sai' };
    }
    var inc = migrate(incoming);
    var state = loadState();
    var mergedChildren = 0;

    for (var id in inc.children) {
      if (!Object.prototype.hasOwnProperty.call(inc.children, id)) continue;
      mergedChildren++;
      var src = inc.children[id];
      if (!state.children[id]) {
        state.children[id] = src; // con mới -> nhận nguyên
        continue;
      }
      var dst = state.children[id];
      // tên/avatar: ưu tiên bản import nếu khác mặc định
      if (src.name && src.name !== 'Bé') dst.name = src.name;
      if (src.avatar) dst.avatar = src.avatar;
      // progress: merge từng unit/skill đơn điệu (giao hoán, idempotent)
      for (var uk in src.progress) {
        if (!Object.prototype.hasOwnProperty.call(src.progress, uk)) continue;
        var su = src.progress[uk];
        var du = dst.progress[uk];
        if (!du) { dst.progress[uk] = su; continue; }
        for (var sk in su.skills) {
          if (!Object.prototype.hasOwnProperty.call(su.skills, sk)) continue;
          var cell = su.skills[sk];
          du.skills[sk] = mergeSkill(du.skills[sk], {
            score: cell.score, attempts: num(cell.attempts, 0),
            effort: num(cell.effort, 0), ts: num(cell.ts, 0)
          });
        }
        du.effort = sumEffort(du.skills);
        du.lastTs = Math.max(num(du.lastTs, 0), num(su.lastTs, 0));
      }
      // tuần: lấy tuần mới hơn; cùng tuần lấy max ngày
      if (src.effort) {
        if (!dst.effort || src.effort.weekKey > dst.effort.weekKey) {
          dst.effort = src.effort;
        } else if (src.effort.weekKey === dst.effort.weekKey) {
          dst.effort.daysThisWeek = Math.max(
            num(dst.effort.daysThisWeek, 0), num(src.effort.daysThisWeek, 0));
        }
      }
    }
    if (!state.activeChildId && inc.activeChildId) state.activeChildId = inc.activeChildId;
    saveState(state);
    return { ok: true, mergedChildren: mergedChildren };
  }

  // Xoá TOÀN BỘ dữ liệu (phụ huynh chủ động) — quyền xoá theo CONTRACT an toàn.
  function clearAll() {
    var fresh = freshState();
    saveState(fresh);
    return true;
  }

  /* ========================== EXPORT =========================== */

  var Progress = {
    // contract v1 (CONTRACTS §3)
    save: save,
    getMastery: getMastery,
    sync: sync,
    // tiện ích hồ sơ & backup (ngoài contract, dùng cho S0/S1/S8)
    listChildren: listChildren,
    createChild: createChild,
    updateChild: updateChild,
    deleteChild: deleteChild,
    getActiveChildId: getActiveChildId,
    setActiveChild: setActiveChild,
    exportData: exportData,
    importData: importData,
    clearAll: clearAll,
    // hằng số hữu ích cho test/UI
    SCHEMA_VERSION: SCHEMA_VERSION,
    STORE_KEY: STORE_KEY,
    VALID_SKILLS: VALID_SKILLS.slice()
  };

  // Phơi ra global cho app trẻ (window.Progress)
  global.Progress = Progress;

  // Hỗ trợ ESM/CommonJS cho test (không bắt buộc cho runtime trình duyệt)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Progress;
  }

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
