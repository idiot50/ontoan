/*
 * de_builder.js — Lắp ĐỀ từ engine theo MA TRẬN + render HTML in được (classic script: browser + Node).
 * API:
 *   DeBuilder.build(cfg, engine, opts) -> de (object)
 *   DeBuilder.renderDoc(de, opts) -> chuỗi HTML A4 đầy đủ (Ma trận / Đề / Hướng dẫn chấm)
 *   DeBuilder.PRINT_CSS  -> chuỗi CSS in (dùng lại cho preview)
 * de.items mang đủ tag {topic, tier, type, answer} để map câu↔mạch/mức cho lịch sử & thích ứng.
 */
(function () {
  'use strict';

  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  var PRINT_CSS = [
    '@page { size: A4; margin: 15mm 15mm 13mm 15mm; }',
    '* { box-sizing: border-box; }',
    'body { font-family: "Times New Roman", serif; font-size: 12.5pt; line-height: 1.5; color: #000; margin: 0; }',
    'h1,h2,h3 { margin: 0 0 6px; }',
    '.center { text-align: center; } .small { font-size: 10pt; } .muted { color: #444; }',
    '.hdr { width: 100%; border-collapse: collapse; margin-bottom: 6px; }',
    '.hdr td { vertical-align: top; padding: 0 6px; } .hdr .l { width: 46%; text-align: center; } .hdr .r { width: 54%; text-align: center; }',
    '.rule { border: none; border-top: 1.5px solid #000; margin: 8px 0 12px; }',
    '.info { margin: 4px 0 2px; } .dots { border-bottom: 1px dotted #000; display: inline-block; min-width: 58mm; }',
    '.scorebox { float: right; border: 1px solid #000; width: 46mm; height: 22mm; margin: 0 0 6px 8px; padding: 3px 6px; font-size: 10pt; }',
    'table.matrix { width: 100%; border-collapse: collapse; font-size: 10.5pt; margin: 6px 0 10px; }',
    'table.matrix th, table.matrix td { border: 1px solid #000; padding: 4px 6px; text-align: center; }',
    'table.matrix td.left { text-align: left; }',
    '.sec { page-break-before: always; }',
    '.q { margin: 8px 0; } .q .stem { font-weight: 600; }',
    'ol.choices { list-style: none; margin: 2px 0 0; padding-left: 16px; }',
    'ol.choices li { display: inline-block; min-width: 22%; margin-right: 2%; }',
    '.line { border-bottom: 1px dotted #000; height: 8mm; margin: 5px 0; }',
    '.note { font-style: italic; font-size: 10pt; color: #333; }',
    '.key h3 { margin-top: 12px; border-bottom: 1px solid #000; padding-bottom: 2px; }',
    '.key p, .key li { margin: 3px 0; } ul.tight { margin: 3px 0; }'
  ].join('\n');

  function sampleTier(w) {
    var s = w[0] + w[1] + w[2];
    var r = Math.random() * s;
    return r < w[0] ? 0 : (r < w[0] + w[1] ? 1 : 2);
  }

  // Sinh các câu theo số câu mỗi mạch + trọng số tầng; tránh trùng stem trong cùng đề.
  // preferInput: ưu tiên câu TỰ LUẬN (gõ đáp án) — trắc nghiệm còn đoán mò được nên
  // dễ hơn hẳn. Có trần thử lại để mạch nào chỉ sinh trắc nghiệm thì vẫn lấy được câu.
  function buildItems(cfg, engine, soCauByMach, tierWeights, preferInput) {
    var items = [];
    cfg.mach.forEach(function (m) {
      var n = soCauByMach[m.topic] || 0;
      var seen = {}, made = 0, attempts = 0, cap = n * 14 + 25;
      var wantInput = !!preferInput;
      while (made < n && attempts < cap) {
        attempts++;
        var tr = sampleTier(tierWeights);
        var q;
        try { q = engine.generate(m.topic, { tier: tr }); } catch (e) { continue; }
        if (!q || !q.stem) continue;
        // nửa số lượt đầu chỉ nhận câu tự luận; hết nửa đó thì nhận cả trắc nghiệm
        if (wantInput && q.type !== 'input' && attempts < cap * 0.6) continue;
        var keyStem = String(q.stem).replace(/\s+/g, ' ').trim();
        if (seen[keyStem]) continue;
        seen[keyStem] = 1;
        items.push({
          topic: m.topic, ten: m.ten, tier: (q.tier == null ? tr : q.tier), type: q.type,
          stem: q.stem, choices: q.choices || null, answer: q.answer, explain: q.explain || ''
        });
        made++;
      }
    });
    return items;
  }

  // build(cfg, engine, opts) -> de.
  // opts: { muc:'de'|'tb', soCauByMach, tierWeights, preferInput, phut, viSao }
  // Truyền `muc` là lấy hết cấu hình của mức đó; các trường lẻ vẫn ghi đè được.
  function build(cfg, engine, opts) {
    opts = opts || {};
    var DC = (typeof DeConfig !== 'undefined') ? DeConfig : (typeof require !== 'undefined' ? require('./de_config.js') : { TONG_CAU: 20, TIER_WEIGHTS: [30, 45, 25], LEVELS: {} });
    var lv = (DC.LEVELS && DC.LEVELS[opts.muc]) || (DC.LEVELS && DC.LEVELS.de) || null;

    var soCau = opts.soCauByMach
      || (lv && lv.soCau && lv.soCau[cfg.key])
      || cfg.soCauChuan;
    var tw = opts.tierWeights || (lv && lv.tierWeights) || DC.TIER_WEIGHTS;
    var preferInput = (opts.preferInput !== undefined) ? opts.preferInput : !!(lv && lv.preferInput);
    var items = buildItems(cfg, engine, soCau, tw, preferInput);

    var phanI = [], phanII = [];
    items.forEach(function (it) { (it.type === 'mc' ? phanI : phanII).push(it); });
    phanI.forEach(function (it, i) { it.soCau = i + 1; it.phan = 1; });
    phanII.forEach(function (it, i) { it.soCau = i + 1; it.phan = 2; });

    var total = items.length;
    var diemMoiCau = total ? Math.round((10 / total) * 100) / 100 : 0;

    var byMach = {};
    items.forEach(function (it) { byMach[it.topic] = (byMach[it.topic] || 0) + 1; });
    var matran = cfg.mach.filter(function (m) { return byMach[m.topic]; }).map(function (m) {
      return { topic: m.topic, ten: m.ten, soCau: byMach[m.topic], diem: Math.round(byMach[m.topic] * diemMoiCau * 100) / 100 };
    });

    return {
      key: cfg.key, mon: cfg.mon, lop: cfg.lop,
      muc: lv ? lv.key : 'de',
      mucTen: lv ? lv.ten : 'Dễ',
      mucNhan: lv ? lv.nhan : '',
      mucMoTa: lv ? lv.moTa : '',
      phut: opts.phut
        || (lv && lv.phut && (typeof lv.phut === 'object' ? lv.phut[cfg.key] : lv.phut))
        || 40,
      viSao: opts.viSao || '',
      tongCau: total, tongDiem: 10, diemMoiCau: diemMoiCau,
      matran: matran, items: items, phanI: phanI, phanII: phanII
    };
  }

  function fmtDiem(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }

  /* Bỏ các chỉ dẫn CHỈ dành cho app web ra khỏi bản IN GIẤY.
     Engine dùng chung với app học nên câu hỏi có kèm "(gõ số)", "(chỉ gõ chữ số)"…
     In ra giấy thì học sinh cầm bút, không "gõ" gì cả. */
  function forPrint(s) {
    return String(s == null ? '' : s)
      .replace(/\s*\((?:chỉ\s*)?gõ[^)]*\)/gi, '')
      .replace(/\s*\(cách nhau bởi[^)]*\)/gi, '')
      .replace(/\s*\(viết theo thứ tự[^)]*gõ[^)]*\)/gi, '')
      .replace(/\s+([.,;:?!])/g, '$1')
      .trim();
  }

  function renderDoc(de, opts) {
    opts = opts || {};
    var css = opts.css || PRINT_CSS;
    var diemPhanI = Math.round(de.phanI.length * de.diemMoiCau * 100) / 100;
    var diemPhanII = Math.round(de.phanII.length * de.diemMoiCau * 100) / 100;
    var H = [];
    H.push('<!doctype html><html lang="vi"><head><meta charset="utf-8">');
    H.push('<title>Đề ' + de.mon + ' lớp ' + de.lop + '</title><style>' + css + '</style></head><body>');

    // ----- MA TRẬN -----
    H.push('<table class="hdr"><tr><td class="l">PHÒNG GD&amp;ĐT ………………<br>TRƯỜNG TIỂU HỌC ………………</td>');
    H.push('<td class="r"><b>MA TRẬN ĐỀ ÔN TẬP</b><br>MÔN: ' + de.mon + ' – LỚP ' + de.lop
      + (de.mucNhan ? '<br>' + de.mucNhan : '')
      + '<br><span class="small">(Tạo tự động — ôn tập)</span></td></tr></table>');
    H.push('<hr class="rule">');
    H.push('<p class="small muted">Tổng điểm 10 · ' + de.tongCau + ' câu × ' + fmtDiem(de.diemMoiCau) + 'đ · Thời gian: ' + de.phut + ' phút.</p>');
    if (de.mucMoTa) H.push('<p class="note"><b>Mức độ: ' + de.mucTen + '.</b> ' + de.mucMoTa + '</p>');
    if (de.viSao) H.push('<p class="note">' + de.viSao + '</p>');
    H.push('<table class="matrix"><tr><th style="width:64%">Mạch kiến thức</th><th>Số câu</th><th>Điểm</th></tr>');
    de.matran.forEach(function (r) {
      H.push('<tr><td class="left">' + r.ten + '</td><td>' + r.soCau + '</td><td>' + fmtDiem(r.diem) + '</td></tr>');
    });
    H.push('<tr><td class="left"><b>Tổng</b></td><td><b>' + de.tongCau + '</b></td><td><b>10</b></td></tr></table>');

    // ----- ĐỀ BÀI -----
    H.push('<div class="sec"><table class="hdr"><tr><td class="l">PHÒNG GD&amp;ĐT ………………<br>TRƯỜNG TIỂU HỌC ………………</td>');
    H.push('<td class="r"><b>ĐỀ ÔN TẬP</b><br>MÔN: ' + de.mon + ' – LỚP ' + de.lop
      + (de.mucNhan ? '<br>' + de.mucNhan : '')
      + '<br><span class="small">Thời gian làm bài: ' + de.phut + ' phút</span></td></tr></table>');
    H.push('<div class="scorebox"><b>Điểm</b> …………<br><span class="small">Lời phê của thầy/cô:</span></div>');
    H.push('<div class="info">Họ và tên: <span class="dots"></span> Lớp: ' + de.lop + '……</div><hr class="rule">');

    // Chỉ đánh số "PHẦN I / PHẦN II" khi đề THỰC SỰ có cả hai phần. Đề toàn tự luận
    // mà vẫn ghi "PHẦN II" thì người in tưởng bị thiếu trang.
    var caHaiPhan = de.phanI.length > 0 && de.phanII.length > 0;
    if (de.phanI.length) {
      H.push('<h3>' + (caHaiPhan ? 'PHẦN I. TRẮC NGHIỆM' : 'PHẦN TRẮC NGHIỆM')
        + ' (' + fmtDiem(diemPhanI) + ' điểm)</h3>');
      H.push('<p class="small muted">Khoanh tròn vào chữ đặt trước câu trả lời đúng (mỗi câu ' + fmtDiem(de.diemMoiCau) + ' điểm).</p>');
      de.phanI.forEach(function (it) {
        H.push('<div class="q"><div class="stem">Câu ' + it.soCau + '. ' + forPrint(it.stem) + '</div><ol class="choices">');
        (it.choices || []).forEach(function (c, i) { H.push('<li>' + LETTERS[i] + '. ' + c + '</li>'); });
        H.push('</ol></div>');
      });
    }
    if (de.phanII.length) {
      H.push('<h3>' + (caHaiPhan ? 'PHẦN II. TỰ LUẬN' : 'PHẦN TỰ LUẬN')
        + ' (' + fmtDiem(diemPhanII) + ' điểm)</h3>');
      H.push('<p class="small muted">Viết đáp số vào chỗ trống (mỗi bài ' + fmtDiem(de.diemMoiCau) + ' điểm).</p>');
      de.phanII.forEach(function (it) {
        H.push('<div class="q"><div class="stem">Bài ' + it.soCau + '. (' + fmtDiem(de.diemMoiCau) + 'đ) ' + forPrint(it.stem) + '</div><div class="line"></div><div class="line"></div></div>');
      });
    }
    H.push('<p class="center small muted">— Hết —</p></div>');

    // ----- HƯỚNG DẪN CHẤM -----
    H.push('<div class="sec key"><h2 class="center">HƯỚNG DẪN CHẤM – ĐÁP ÁN</h2>');
    H.push('<p class="center small muted">MÔN ' + de.mon + ' – LỚP ' + de.lop + ' · Tổng 10 điểm</p>');
    if (de.phanI.length) {
      H.push('<h3>PHẦN I. TRẮC NGHIỆM</h3><table class="matrix"><tr><th>Câu</th>');
      de.phanI.forEach(function (it) { H.push('<th>' + it.soCau + '</th>'); });
      H.push('</tr><tr><td>Đáp án</td>');
      de.phanI.forEach(function (it) { H.push('<td>' + (LETTERS[it.answer] || '?') + '</td>'); });
      H.push('</tr></table>');
    }
    if (de.phanII.length) {
      H.push('<h3>PHẦN II. TỰ LUẬN</h3><ul class="tight">');
      de.phanII.forEach(function (it) {
        H.push('<li><b>Bài ' + it.soCau + '.</b> Đáp số: <b>' + it.answer + '</b>' + (it.explain ? ' — <span class="small">' + it.explain + '</span>' : '') + '</li>');
      });
      H.push('</ul>');
    }
    H.push('<p class="note">Mỗi câu/bài đúng được ' + fmtDiem(de.diemMoiCau) + 'đ. Tổng toàn bài 10 điểm.</p></div>');

    H.push('</body></html>');
    return H.join('\n');
  }

  var DeBuilder = { build: build, renderDoc: renderDoc, sampleTier: sampleTier, PRINT_CSS: PRINT_CSS, LETTERS: LETTERS };
  if (typeof module !== 'undefined' && module.exports) module.exports = DeBuilder;
  if (typeof window !== 'undefined') window.DeBuilder = DeBuilder;
  if (typeof globalThis !== 'undefined') globalThis.DeBuilder = DeBuilder;
})();
