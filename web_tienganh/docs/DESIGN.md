# DESIGN — Hệ thị giác Web học tiếng Anh trẻ 7–10 tuổi (v2)

> Pha P1 — hệ thị giác tạo HỨNG THÚ + design tokens + CSS + bản xem trước.
> File liên quan: `css/tokens.css` (biến), `css/base.css` (component), `docs/preview.html` (xem bằng mắt).
> Nguyên tắc tối thượng: **VUI, cuốn hút, đáng yêu để bé thích học mỗi ngày** — nhưng vẫn **WCAG AA**,
> **100% offline** (không tài nguyên mạng; emoji + SVG inline + gradient/shape thuần CSS).
> Bám `docs/CONTRACTS.md` (UI tiếng Việt, nút to, icon kèm chữ, không PII) và review sư phạm mục 13
> (`en_md/KE_HOACH_WEBSITE_TIENGANH.md`): động lực thiên **nỗ lực–tiến bộ**, KHÔNG streak cứng, KHÔNG đếm giờ,
> phản hồi sai = động viên + luôn cho nghe/thấy đáp án đúng.

---

## 1. Định hướng thẩm mỹ (mood)

**"Hoàng hôn ấm áp cùng bạn cáo đom đóm".** Một thế giới tươi nhưng dịu, ấm mà không chói: tím-hoàng-hôn
làm nền tin cậy, cam-hổ-phách làm điểm nhấn mời gọi, vàng sao cho khoảnh khắc thưởng. Bo góc rất mềm,
nút lồi "bấm được", linh vật bụng phát sáng dõi theo bé. Cảm giác: **an toàn, được cổ vũ, muốn quay lại**.

> **v3 (tiếp thu review "ngoan nhưng nhạt"):** concept hoàng-hôn nay HIỆN diện thật ở **lớp nền** (`--grad-page`
> ấm dần từ mép trên + lớp **đốm đom đóm** mờ `--tex-fireflies`) thay cho nền trắng-phẳng; **Pi** được trau chuốt
> long lanh + biến thể cảm xúc; **khoảnh khắc thưởng** nâng lên "wow" (sao lớn + tia sáng toả + Pi reo + confetti).

Ba từ khoá: **ấm áp · tươi-có-chủ-đích · đáng-yêu**. Tránh: loè loẹt nhiều màu cạnh nhau, đỏ gắt báo lỗi,
chuyển động giật/nhấp nháy, chữ nhỏ-mảnh.

---

## 2. Bảng màu (mã hex + lý do & tương phản AA)

> Quy ước AA: chữ thường cần ≥ 4.5:1; chữ lớn (≥ 24px đậm) & icon/nét lớn cần ≥ 3:1.
> Số đo dưới đây là tỉ lệ tương phản trên nền nêu kèm. **Quan trọng:** một số màu tươi (mint/sky/coral)
> chỉ đạt ~3.6–4.1:1 nên **chỉ dùng làm NỀN/NÉT/CHỮ-LỚN**, còn chữ thường trên nền nhạt dùng biến `-text`.

### 2.1. Thương hiệu & nhấn
| Vai trò | Biến | Hex | Tương phản | Dùng cho |
|---|---|---|---|---|
| Chính (tím hoàng hôn) | `--c-primary` | `#5b3fc4` | chữ trắng **6.0:1** ✅ | nút chính, tiêu đề brand, link |
| Chính đậm | `--c-primary-strong` | `#46309c` | chữ trắng **8.4:1** ✅ | hover/gờ nút, chữ trên nền nhạt |
| Chính nhạt | `--c-primary-soft` | `#efeafc` | nền chip/vùng brand | nền nút icon, chip |
| Nhấn (cam hổ phách) | `--c-accent` | `#e8590c` | chữ trắng **3.58:1** ⚠️ | **CHỈ viền/nét/dải** (đạt 3:1 UI); **KHÔNG** đặt chữ thường lên |
| Nhấn — NỀN nút (mới) | `--c-accent-strong` | `#bd4708` | chữ trắng **5.16:1** ✅ | **nền** nút "Nghe/Thu âm"; icon trên accent-soft (~4.4:1 ✅) |
| Nhấn gờ 3D | `--c-accent-deeper` | `#9a3a06` | — | gờ dưới / hover đậm của nút accent |

> **VÁ AA (review):** chữ trắng trên `--c-accent` #e8590c chỉ **3.58:1** (TRƯỢT 4.5:1) — comment cũ "~4.6:1" SAI.
> Vì vậy nút `.btn--accent` và `.icon-btn--accent` đã đổi sang dùng **`--c-accent-strong` #bd4708** (5.16:1 / ~4.4:1).
> Giữ `--c-accent` #e8590c **chỉ** cho viền/nét/dải trang trí (đạt 3:1 trên trắng).

### 2.2. Màu thẻ chủ đề (mỗi unit một sắc — phân biệt + vui)
Mỗi sắc có bộ 3: màu đậm (nền/nét/dải), `-soft` (nền nhạt), `-text` (chữ đạt AA trên nền soft).
| Sắc | Đậm | -soft | -text (AA trên soft) |
|---|---|---|---|
| Mint | `#0f9b6c` (3.6:1) | `#e2f7ef` | `#0a6a4a` **5.5:1** ✅ |
| Sky | `#1186c0` (4.0:1) | `#e1f3fb` | `#0c6190` **5.2:1** ✅ |
| Grape | `#7a4fd1` (4.4:1) | `#efe8fb` | `#4f2f9a` **6.4:1** ✅ |
| Coral | `#e0455f` (4.1:1) | `#fde6ea` | `#b21d36` **5.4:1** ✅ |
| Sun | `#e08a00` (2.69:1*) | `#fdf1d8` | `#8a5400` **5.6:1** ✅ |

\* `--c-sun` (2.69:1 trên trắng) chỉ dùng cho **dải/nền lớn**, KHÔNG đặt chữ trắng lên **và KHÔNG dùng cho nét mảnh/glyph** trên nền sáng; chữ/icon luôn dùng `--c-sun-text` #8a5400.

> ⚠️ **BẮT BUỘC (review mục visual):** Tuyệt đối KHÔNG đặt **chữ thường / số % / glyph mảnh** lên nền
> `--c-sun` / `--c-mint` / `--c-coral` / `--c-sky` (các sắc này chỉ 2.7–4.1:1). Chữ & nét mảnh **luôn** dùng
> biến `-text` tương ứng trên nền `-soft`. Frontend kiểm chỗ này trước khi merge (xem checklist mục 9).

### 2.3. Trạng thái (đúng / chưa-đúng / cảnh báo) — KÈM ICON, không chỉ màu
| Trạng thái | Đậm (nút/chữ trắng) | -soft (nền vùng) | -text (chữ trên soft) | Icon kèm |
|---|---|---|---|---|
| Đúng | `--c-correct-strong` `#0e7340` **5.3:1** ✅ | `#e3f7ec` | `#0a5e33` **6.8:1** ✅ | ✓ / 🎉 |
| Chưa đúng (**cam ấm NGẢ NÂU, KHÔNG đỏ**) | `--c-try-strong` `#9c440c` **5.5:1** ✅ | `#fbe9da` | `#7d3406` **6.8:1** ✅ | ✗ / 💡 |
| Cảnh báo (vd thiếu giọng TTS) | `--c-warn` `#b6790a` **4.6:1** ✅ | `#fbf1d6` | `#7a5104` **6.8:1** ✅ | ⚠️ |
| Thông tin | `--c-info` `#2563c4` | `#e6effb` | `#18488f` **6.4:1** ✅ | ℹ️ |

> **Quyết định sư phạm:** trạng thái sai dùng **cam ấm động viên**, không đỏ — tránh phán xét, đúng review mục 13.
> **VÁ (review accessibility):** `--c-try` đẩy **ngả nâu-đất** (`#c0540f`, nút `#9c440c`) để bớt rực, **tách bạch**
> rõ với cam-hành-động `--c-accent` — trẻ không nhầm vùng "thử lại" với nút vui. Lựa chọn sai luôn kèm **✗ to**.

### 2.4. Gamification (sao / huy hiệu / XP / confetti)
| Vai trò | Biến | Hex | Ghi chú AA |
|---|---|---|---|
| Sao (fill) | `--c-star` | `#ffc21f` | giữ vàng tươi; luôn KÈM viền `--c-star-edge` để nổi trên nền sáng |
| Sao (viền/nét) | `--c-star-edge` | `#8a5a00` | **VÁ:** đậm để đạt **≥3:1** trên trắng (cũ #d99100 chỉ 2.62:1) |
| Số cạnh sao | `--c-star-deep` | `#7e5a00` | **VÁ:** chữ trên badge-soft **~5.0:1** ✅ (cũ #9a6a00 chỉ 4.2:1) |
| Sao rỗng | `--c-star-empty` | `#e6e0d2` | vẫn THẤY hình sao (viền `--c-star-empty-edge` #b8a878) |
| XP đã đạt | `--c-xp` / `--grad-xp` | `#15924f`→ | gradient xanh tươi |
| Huy hiệu | `--c-badge` | `#f3a01c` | viền `--c-badge-ring` `#d9820a` |
| Confetti | `--c-confetti-1..6` | 6 màu | mảnh giấy bay CSS thuần |

### 2.5. Nền & chữ trung tính
| Vai trò | Biến | Hex | Tương phản |
|---|---|---|---|
| **Nền trang (MỚI)** | `--grad-page` + `--tex-fireflies` | hoàng-hôn ấm có chiều sâu + đốm đom đóm mờ | thế giới "một-chốn-để-vào" |
| Nền ấm (hero) | `--c-bg-2` `#fdf7f1` | — | — |
| Mặt thẻ | `--c-surface` `#ffffff` | — | — |
| Viền ô input/choice | `--c-border-strong` `#7d6fb8` | trên trắng **~3.6:1** ✅ | **VÁ:** cũ #b8aedb chỉ 2.08:1 (TRƯỢT 3:1) |
| Chữ chính | `--c-text` `#221a3a` | trên trắng **~14:1** ✅ | thân & tiêu đề |
| Chữ phụ | `--c-text-soft` `#4d4666` | trên trắng **7.0:1** ✅ | chú thích |
| Chữ rất phụ | `--c-text-faint` `#6b6385` | trên trắng **4.7:1** ✅ | dùng ≥ 16px |

**Gradient vui (đều thuần CSS):** `--grad-brand` (hero/nút lớn), `--grad-warm` (nút thưởng),
`--grad-page` (**nền trang MỚI**: hoàng-hôn ấm mép trên → tím oải hương → kem ấm chân màn, vẫn cực dịu, giữ chữ AA),
`--grad-festive` (ăn mừng lớn), `--grad-xp` (thanh tiến độ). `--grad-sky` giữ lại để tương thích nhưng nền trang
nay dùng `--grad-page`.

**Texture đom đóm `--tex-fireflies`:** 7 đốm vàng `radial-gradient` opacity 0.06–0.10, phủ SAU nội dung
(`background` body, hoặc utility `.bg-fireflies` cho khối riêng), `pointer-events:none`, **không ảnh hưởng tương phản chữ**.
Ở `data-contrast="high"` tự tắt (`--tex-fireflies: none`).

---

## 3. Typography

- **Font (offline, hệ thống):** `--font-base` ưu tiên `Nunito`/`Quicksand` (rất tròn-đáng-yêu nếu máy có)
  → rơi về `Segoe UI`/`system-ui`. `--font-display` (tiêu đề/khen) thử `Baloo 2`/`Fredoka`. `--font-en`
  dùng `Verdana` (chữ cái rõ cho phonics). **Không tải font qua mạng** — chỉ dùng nếu có sẵn trên máy.
  > ⚠️ **Quản trị kỳ vọng (review feasibility):** trên **Windows máy trẻ em**, `Baloo 2`/`Fredoka`/`Nunito` gần
  > như chắc chắn KHÔNG có → `--font-display` thực tế = **Segoe UI / system-ui** (kém "tròn-vui" hơn kỳ vọng).
  > Bù "chất vui" bằng thủ pháp CSS: `font-weight:800`, `letter-spacing` dương nhẹ (`--tracking-wide`), và
  > `text-shadow` mềm cho nhãn ăn mừng lớn (đã áp ở `.celebrate__title`). KHÔNG tải font ngoài để "đẹp hơn".
- **Thang cỡ chữ to cho trẻ:** thân `--fs-base` **18px** (sàn `--fs-sm` 16px), chữ nhấn 20px,
  đề bài/tiêu đề thẻ 24px (`--fs-lg`), câu hỏi chính 28px (`--fs-xl`), tiêu đề màn 34px,
  từ trên flashcard 44px (`--fs-3xl`), số liệu nổi 56px.
- **Dòng thoáng:** thân `--lh-base` 1.6; đoạn đọc dài 1.8; tiêu đề 1.2.
- **Ký hiệu kiểm:** tiếng Việt đủ dấu + `×` `÷` `²` `m²` hiển thị tốt với font hệ thống (đã có trong preview).

---

## 4. Concept LINH VẬT gốc — "Pi" (cáo đom đóm)

> **Tự nghĩ, KHÔNG dùng nhân vật của sách F&F/GF.** Vẽ 100% bằng **SVG inline** (tô bằng màu token),
> không ảnh ngoài. Có thể thay thế nhanh bằng emoji 🦊 nơi cần nhẹ (vd tiêu đề header).

**Nhân dạng:** Pi là chú **cáo nhỏ** màu cam-hổ-phách (đúng tông `--c-accent`), bụng có **ngôi sao phát sáng**
như một con đom đóm — ẩn dụ "ánh sáng tri thức trong con lớn dần". Đầu tròn, má trắng, mắt to long lanh,
miệng cười hiền. Tỉ lệ đầu-thân ~1:1 (chibi) để đáng yêu.

**Trau chuốt SVG (v3 — review "cứng/thiếu long lanh"):**
- **Mắt** to dạng oval (rx 5.4 / ry 6.4) + **2 đốm sáng** (highlight lớn + nhỏ) → long lanh; thêm **chân mày**
  cong nhẹ cho biểu cảm vui.
- **Tai & đuôi** vẽ bằng path cong `q` + `stroke-linejoin:round` (mút bo tròn, "lông mượt") thay cho tam giác nhọn.
- **Quầng sáng đom đóm:** vòng `.belly-glow` vàng quanh bụng + filter `--glow-firefly` khi `.is-glowing` (đập nhẹ `belly-pulse`).
- **3 biến thể MẶT** (frontend bật class trên `.mascot`, SVG ẩn/hiện nhóm `<g>`): `face-happy` (vui, mặc định),
  `face-cheer` (miệng tròn reo "ô!", đi với `.is-cheer`), `face-wink` (nháy mắt idle, đi với `.is-wink`).
- Vẫn **100% SVG inline**, tô bằng biến màu, không ảnh ngoài. Markup chuẩn copy từ `docs/preview.html` mục 3.

**Vì sao chọn cáo đom đóm:**
- Cáo = thông minh, tò mò, thân thiện — hợp người bạn đồng hành học tập.
- "Bụng sao" gắn trực tiếp với cơ chế **sao thưởng**: khi bé học, bụng Pi **sáng dần** (đổi `fill` biến `.belly`)
  → phần thưởng cảm xúc gắn với NỖ LỰC, không phải điểm số.
- Cam ấm = không "lạnh/nghiêm"; trẻ thấy gần gũi.

**Trạng thái cảm xúc (qua class trên `.mascot`):**
| Class | Khi nào | Hiệu ứng |
|---|---|---|
| `.is-idle` | mặc định | trôi nhẹ lên xuống (`float`) — như đang "thở" |
| `.is-happy` | trả lời đúng | nảy một nhịp (`bounce`) |
| `.is-cheer` | hoàn thành phiên / lên sao | nhảy ăn mừng (`cheer`) + mặt `face-cheer` (reo) |
| `.is-glowing` | đang học / được khen | quầng vàng đom đóm quanh bụng (`belly-pulse`) |
| `.is-wink` | điểm nhấn idle thi thoảng | mặt `face-wink` (nháy mắt) |

**Vai trò trong UI:**
- **Hero trang chủ:** Pi + bong bóng lời `.speech` chào bé ("Chào bé! Hôm nay học gì nào?").
- **Avatar nhỏ** (`.mascot--sm`) ở header / hồ sơ con.
- **Người cổ vũ** khi đúng/sai: đứng cạnh vùng phản hồi, nói lời động viên ("Giỏi quá!", "Mình thử lại nhé!").
- KHÔNG che nút thao tác; KHÔNG xuất hiện gây phân tâm giữa lúc bé đọc đề.

**Mở rộng (sau MVP):** đổi màu lông cho biến thể (avatar nhiều bé), phụ kiện huy hiệu cài lên Pi khi đạt mốc.

---

## 5. Spec các thành phần (component states)

### 5.1. Nút `.btn`
- Bo tròn `--radius-pill`, font display đậm, **gờ 3D** (bóng dưới = `--c-*-strong`) để "bấm được".
- **hover:** sáng lên 6%. **active:** nút lún xuống 4px + gờ thu lại (cảm giác bấm thật).
- **disabled:** mờ 50%, không lún, con trỏ cấm.
- Biến thể: `--accent` (cam), `--correct` (xanh), `--try` (cam ấm), `--ghost` (viền, nền trắng — Quay lại).
- Kích thước: thường `--touch-cozy` 56px; CTA `.btn--cta` `--touch-cta` 64px; `.btn--block` full-width.

### 5.2. Nút icon tròn `.icon-btn`
- Tròn ≥ 48px (mặc định 52px; `.icon-btn--lg` 64px). active: thu nhỏ 0.92.
- `.is-playing` (loa đang đọc): lắc nhẹ `wiggle` để báo "đang phát". Luôn có `aria-label`.

### 5.3. Thẻ chủ đề `.topic-card`
- Mỗi unit set 3 biến inline `--topic/--topic-soft/--topic-text`. **Dải màu trên đỉnh** (`::before`)
  phân biệt unit kể cả khi bỏ màu (vị trí + dải, không chỉ sắc).
- Gồm: icon to (emoji) trong ô bo, số unit, tên VN (display), tên EN nhỏ, thanh tiến độ + %.
- **v3 (review "icon nhỏ/3 dòng đều đều"):** ô icon **tròn 80px / emoji 50px**, nền radial trắng→soft + viền =
  cảm giác **"sticker"** (hover xoay-phóng nhẹ); **tên VN to/đậm hơn** (`--fs-xl`, `--fw-black`) = tiêu điểm;
  **tên EN faint + nghiêng** (`--c-text-faint`) để không đua với tên VN; số unit viết hoa giãn chữ.
- ⚠️ KHÔNG đặt chữ/% lên dải màu `--topic` (sun/coral...); chữ unit dùng `--topic-text` trên `-soft` (xem mục 2.2).
- hover: nhấc lên 4px (`ease-bounce`); active: hơi thu.

### 5.4. Flashcard `.flashcard` (mặt trước–sau)
- 3D lật bằng `.is-flipped` (rotateY). **Trước:** icon 84–96px + từ EN 44px + nút loa nghe **từ**.
  **Sau:** nghĩa VN + câu ví dụ EN + nút loa nghe **câu** (đúng US-B1: hình + câu + âm).
- **v3 (review "thiếu cảm giác thẻ sưu tập"):** nhận sắc unit qua `--topic/--topic-soft`; **viền pastel dày 3px**
  + nền **gradient nhẹ** (radial trắng→soft) = thẻ hấp dẫn để lật; **chip `.flashcard__hint` "Chạm để lật ↻"**
  ở đáy mặt trước (không che icon/loa); mặt sau có **ngôi sao mờ** trang trí góc → cảm giác **mở quà**.
- Lật mượt `ease-bounce`; tôn trọng reduced-motion (bỏ transition).

### 5.5. MCQ / lựa chọn `.choice`
- Hàng cao ≥ 64px, viền dày, **nhãn chữ cái A/B/C/D** (`.choice__key`) giúp định vị (không chỉ màu).
- Chấm xong: `.is-correct` (xanh + ✓ + nảy `pop`), `.is-wrong` (cam ấm + ✗ + lắc nhẹ `shake`).
  Dấu ✓/✗ ở `.choice__mark` — **trạng thái có icon + màu + chữ**.

### 5.6. Vùng phản hồi `.feedback`
- `--correct`: nền xanh nhạt, icon 🎉, tiêu đề "Giỏi quá!", luôn nêu đáp án đúng + lý do ngắn VN.
- `--try`: nền cam nhạt, icon 💡, "Gần đúng rồi, thử lại nhé!", **luôn hiện đáp án đúng + nút loa nghe câu đúng**
  (đúng review mục 13: sai → động viên + cho nghe/thấy đáp án). Không âm thanh/khái niệm tiêu cực.
- Hiện bằng `slide-up` nhẹ.

### 5.7. Thanh tiến độ / XP / bước
- `.progress` (rãnh + fill gradient xanh, đặt `--_pct`). Kèm `.progress__pct` (chữ %) — không chỉ màu.
- `.steps` + `.step-dot` (đốm từng câu): `.is-done` xanh, `.is-current` cam + to hơn.

### 5.8. Sao / huy hiệu / chip
- `.stars`: sao SVG inline; `.is-on` (vàng + viền `--c-star-edge` #8a5a00 ≥3:1), rỗng vẫn THẤY hình
  (viền `--c-star-empty-edge`). `.just-earned` nảy `pop-star`. Cỡ: thường 30px · `--lg` 44px · `--xl` 56px (lúc lên sao).
- `.badge`: huy chương tròn gradient kim; `.badge--locked` xám (chưa mở). Có `.badge__label` chữ.
- `.chip`: nhãn nhỏ (Level, ⭐ số sao, ✓ Đã học) — luôn icon + chữ. `chip--star`/`chip--accent` đã đậm chữ đạt ≥4.5:1.

### 5.9. Header `.app-header`
- Dính trên; **v3 (review "trắng phẳng như app người lớn"):** nền **gradient brand rất nhạt** (`#f6f1ff`→trắng) +
  **dải gờ tím mảnh 3px** dưới đáy = có thương hiệu. Tiêu đề brand (display, tím đậm, giãn chữ), nút back tròn,
  `.score-pill` (⭐ + số sao) nay có **nền ánh kim** (gradient vàng) + **viền vàng** `--c-badge-ring` để nổi.

### 5.10. Khoảnh khắc ăn mừng tổng `.celebrate` (MỚI — review "thưởng còn khiêm tốn")
- Overlay nhẹ khi **hoàn thành phiên**: **sao lớn 110px** pop + **vành tia sáng toả** (`.celebrate__rays`, conic-gradient quay)
  + **Pi `.is-cheer .is-glowing`** (reo) + **tiêu đề khen** ("Tuyệt vời!") + **confetti nhiều hướng** (12–18 mảnh, `--x` đa dạng,
  có mảnh tròn). `pointer-events:none` để **không che CTA**; tổng ≤ ~1.5s rồi frontend gỡ.
- **reduced-motion:** tắt tia sáng/confetti/pulse; **vẫn hiện sao + lời khen tĩnh** (không mất thông tin).

---

## 6. Vi tương tác & hiệu ứng (thưởng cảm xúc)

| Hiệu ứng | Khi nào | Lớp/keyframe | Lưu ý an toàn |
|---|---|---|---|
| Nút lún 3D | bấm bất kỳ nút | `.btn:active` | phản hồi tức thì, vui tay |
| Pop | chọn đúng (`.choice.is-correct`) | `pop` | ngắn 360ms |
| Shake nhẹ | chọn sai | `shake` (biên độ nhỏ) | KHÔNG gắt; chỉ lắc 1 lần |
| Confetti | hoàn thành phiên / chuỗi đúng | `.confetti-burst` + `confetti-fall` | **không che nút**, tự tắt; mảnh tròn+vuông, toả nhiều hướng |
| **Ăn mừng tổng** | hoàn thành phiên | `.celebrate` (sao lớn + `rays-spin` + Pi reo + confetti) | "wow"; `pointer-events:none`; ≤~1.5s |
| Pop-star / sparkle | lên sao mới | `pop-star`, `sparkle` | gắn với NỖ LỰC, không điểm số; `.stars--xl` 56px |
| Float / wiggle / cheer / **glow** | linh vật Pi | tương ứng + `belly-pulse` | idle nhẹ; không phân tâm khi đọc đề |
| **Speech-pop** | bong bóng lời Pi xuất hiện | `speech-pop` | "bật ra" nhẹ; cho nhấn từ khoá `.speech__hi` |
| Slide-up | hiện feedback | `slide-up` | mềm, không giật |

- **Không nhấp nháy > 3 lần/giây.** Animation ngắn (≤ 700ms cho ăn mừng), không lặp vô hạn trừ idle nhẹ.
- **`prefers-reduced-motion: reduce`** (cuối `base.css`): tắt confetti/sparkle, rút mọi transition về ~0,
  bỏ lật 3D — vẫn còn phản hồi trạng thái (màu + icon + chữ), không mất thông tin.

---

## 7. Ghi chú accessibility & hứng thú (đối chiếu yêu cầu)

**Accessibility (WCAG AA + UDL review mục 13 điểm 7):**
- Tương phản chữ chính ≥ 4.5:1; chữ lớn/nét ≥ 3:1 (bảng mục 2). Có theme `data-contrast="high"` cho trẻ thị lực yếu.
- **Không truyền tin chỉ bằng màu:** đúng/sai luôn kèm ✓/✗ + chữ + icon; sao rỗng vẫn thấy hình; thẻ unit có dải màu + vị trí.
- Vùng chạm ≥ 48px khắp nơi; khoảng cách rộng; bố cục 1 cột giữa, dễ theo dõi.
- Focus bàn phím rõ (`:focus-visible` viền xanh + kẹp trắng). Nút icon đều có `aria-label`. `.sr-only` cho nhãn ẩn.
- Mọi đề/từ EN có nút loa (TTS) — phần thị giác chừa chỗ nút loa cạnh đề/câu/từ.

**Hứng thú (cuốn hút để bé quay lại):**
- Linh vật Pi đồng hành + nói lời cổ vũ → cảm giác có bạn, được khích lệ.
- Màu tươi-có-chủ-đích + bo mềm + nút lồi "bấm sướng tay" → vui mắt, vui tay.
- Vi tương tác thưởng đúng lúc (pop, confetti, bụng Pi sáng dần, lên sao) gắn với **nỗ lực & hoàn thành**,
  KHÔNG streak cứng/đếm giờ (đúng review mục 13 điểm 5–6).
- Phản hồi sai **động viên** (cam ấm + 💡 + "thử lại nhé") → an toàn, không sợ sai, dám thử.
- Mỗi unit một sắc → màn chủ đề sinh động, dễ nhớ "unit của mình".

---

## 8. Bảng "trước → sau" & hướng dẫn áp dụng cho Frontend

> Đây là pha NỀN: chưa có `index.html`/`app.css` thật. "Trước" = chưa có hệ thị giác thống nhất; "Sau" = hệ tokens + base.

| Hạng mục | Trước | Sau (v2) | Lý do |
|---|---|---|---|
| Màu | chưa định | hệ token tươi-ấm + trạng thái có icon | nhất quán, AA, động viên |
| Linh vật | không | Pi (cáo đom đóm) SVG inline, có cảm xúc | hứng thú, đồng hành, gắn sao |
| Nút | mặc định trình duyệt | `.btn` gờ 3D, ≥ 56px, biến thể trạng thái | vui tay, dễ chạm, rõ trạng thái |
| Phản hồi sai | (nguy cơ đỏ gắt) | cam ấm + 💡 + đáp án đúng + nghe lại | không phán xét (sư phạm) |
| Thưởng | (nguy cơ streak) | sao/confetti/bụng-Pi theo nỗ lực | đúng định hướng động lực |

### Cách Frontend áp dụng (theo từng phần)
1. **Nạp CSS:** trong `index.html` thêm `<link rel="stylesheet" href="css/tokens.css">` rồi
   `<link rel="stylesheet" href="css/app.css">`. **`app.css` `@import` hoặc đặt SAU `base.css`** — hoặc nạp
   `base.css` trực tiếp. Thứ tự bắt buộc: **tokens → base → app** (app.css chỉ ghi đè layout riêng màn hình).
   *(Đường dẫn tương đối → chạy được cả `file://`.)*
2. **Dùng class component sẵn:** `.btn`, `.icon-btn`, `.card`, `.topic-card`, `.flashcard`, `.choice`,
   `.feedback`, `.progress`, `.stars`, `.badge`, `.chip`, `.app-header`, `.mascot` — markup mẫu xem `preview.html`.
3. **Trạng thái bằng class (JS toggle):** `.is-flipped` (flashcard), `.is-correct`/`.is-wrong`/`.is-disabled`
   (choice), `.feedback--correct`/`--try`, `.step-dot.is-done`/`.is-current`, `.star.is-on`/`.just-earned`,
   `.mascot.is-happy`/`.is-cheer`, `.icon-btn.is-playing`.
4. **Tiến độ:** đặt biến inline `style="--_pct:72%"` trên `.progress__fill`.
5. **Thẻ chủ đề màu:** đặt 3 biến inline trên `.topic-card`, vd
   `style="--topic:var(--c-mint);--topic-soft:var(--c-mint-soft);--topic-text:var(--c-mint-text)"`.
6. **Linh vật:** copy markup SVG `.mascot` từ `preview.html` vào `assets/mascot/` (hoặc inline trong HTML).
   Đổi `fill` của `.belly` để cho "sáng dần".
7. **Animation dùng-một-lần:** thêm class `.anim-pop`/`.anim-bounce`/… rồi gỡ ở sự kiện `animationend`.
8. **Confetti:** chèn `.confetti-burst` chứa N `.confetti-piece` (đặt `left` + `--x` inline), tự xoá sau 1 lần.

### ⚠️ Lưu ý phối hợp (kẻo vỡ JS/test khác)
- **KHÔNG đụng chữ ký kỹ thuật:** đây thuần CSS/markup; engine/progress (CONTRACTS §2–§3) không bị ảnh hưởng.
- **`id`/`class` JS dựa vào:** chưa có `app.js` nên chưa có ràng buộc; khi frontend gắn JS, **giữ tên class
  trạng thái ở mục (3) làm "hợp đồng UI"** để designer/dev không lệch nhau. Nếu cần đổi tên class, báo trước.
- **MCQ render qua `innerHTML`:** cấu trúc `.choice` (key + text + mark) đủ đơn giản để engine/app ráp chuỗi;
  giữ thứ tự `<span class="choice__key">…</span><span class="choice__text">…</span><span class="choice__mark">…</span>`.
- **Offline tuyệt đối:** không thêm `@import url(...)` mạng, không `<img src=https://...>`, không font CDN.
  Nếu cần icon mới → emoji hoặc SVG inline. (Khớp `safety.spec` của codebase Toán.)
- Sau khi frontend triển khai, đề nghị chạy lại bộ test an toàn/engine để chắc không vỡ chức năng.

---

## 9. Tự kiểm (checklist render)
Render `docs/preview.html` (Chrome headless, khổ ~412px) và soi:
- [ ] Tiếng Việt đủ dấu; ký hiệu `×` `÷` `²` `m²` hiển thị đúng.
- [ ] Đúng/sai phân biệt được **cả khi bỏ màu** (nhờ ✓/✗/🎉/💡 + chữ + vị trí).
- [ ] Tương phản chữ trên nền đạt AA (đối chiếu bảng mục 2).
- [ ] **AA đã vá:** nút accent nền #bd4708 (chữ trắng 5.2:1); viền ô #7d6fb8 (3.6:1); viền sao #8a5a00 (≥3:1);
      chip-star/score-pill #7e5a00 và chip-accent #a8400a (≥4.5:1). KHÔNG còn chữ trắng trên #e8590c.
- [ ] **KHÔNG có chữ thường/% nào đặt lên `--c-sun/--c-mint/--c-coral/--c-sky`** (chỉ dùng `-text` trên `-soft`).
- [ ] Vùng chạm nút ≥ 48px; bố cục 1 cột giữa thoáng. (Chip/score-pill là nhãn tĩnh; nếu cho bấm phải bọc ≥48px.)
- [ ] Nền có **chiều sâu** (hoàng-hôn + đốm đom đóm mờ) nhưng chữ vẫn rõ; đốm chỉ là texture.
- [ ] Linh vật Pi **long lanh** (mắt to + highlight, tai/đuôi bo tròn, quầng đom đóm), không che nút; bong bóng lời rõ.
- [ ] Khoảnh khắc **ăn mừng** (`.celebrate`) bắt mắt nhưng không che CTA.
- [ ] Bật giảm chuyển động (OS) → confetti/tia sáng/glow tắt; sao + lời khen vẫn hiện; không giật, không mất thông tin.

---

## Đã tiếp thu review (v2 → v3)

Cập nhật phần **thị giác** theo phản hồi review (area = visual / engagement / accessibility / feasibility).
Các phát hiện ngoài phạm vi thị giác (linh vật trùng tên trong UX_FLOWS, mastery/unlock, cổng phụ huynh,
order_words, audio chuẩn, flashcard chủ động…) thuộc `ux-gamification-treem` / `UX_FLOWS.md` / `BACKLOG_MVP.md`,
KHÔNG sửa ở đây — chỉ ghi nhận để bàn giao chéo.

### A. Cặp màu TRƯỢT AA đã sửa (vẫn giữ tươi vui)
| Phát hiện | Cũ | Mới | Kết quả |
|---|---|---|---|
| Nút `.btn--accent` chữ trắng | nền #e8590c (3.58:1) | nền `--c-accent-strong` #bd4708 | **5.16:1** ✅ |
| `.icon-btn--accent` glyph | #e8590c trên soft (3.07:1) | #bd4708 trên soft | **~4.4:1** ✅ |
| Viền ô/`.choice`/`.btn--ghost` | `--c-border-strong` #b8aedb (2.08:1) | #7d6fb8 | **~3.6:1** ✅ (UI ≥3:1) |
| Viền sao `--c-star-edge` | #d99100 (2.62:1) | #8a5a00 | **≥3:1** ✅ (fill vẫn #ffc21f tươi) |
| Số sao `--c-star-deep` (chip/score-pill) | #9a6a00 (4.2:1) | #7e5a00 | **~5.0:1** ✅ |
| `.chip--accent` chữ | #bd4708 (4.42:1) | #a8400a | **~5.0:1** ✅ |
| `--c-try` (sai) gần `--c-accent` | #d2570c | #c0540f / nút #9c440c (ngả nâu-đất) | tách bạch hơn, vẫn cam ấm ✅ |
| Comment tỉ lệ sai trong token | "~4.6:1" (sai) | ghi đúng + ngữ cảnh "chữ trắng vs nét UI" | đã sửa |

> Gờ 3D nút accent thêm `--c-accent-deeper` #9a3a06. `[data-contrast="high"]` cũng nâng viền & viền sao.

### B. Bơm hứng thú thị giác (review "ngoan nhưng nhạt")
- **Nền có chiều sâu:** thêm `--grad-page` (hoàng-hôn ấm) + `--tex-fireflies` (đốm đom đóm mờ, opacity 0.06–0.10)
  phủ body + utility `.bg-fireflies` cho khối riêng. Không hại tương phản; tắt ở contrast-high.
- **Pi long lanh:** SVG trau chuốt (mắt oval to + 2 highlight, chân mày, tai/đuôi bo tròn `q`+round), quầng sáng
  đom đóm `.is-glowing` + `belly-pulse`, **3 biến thể mặt** (happy/cheer/wink). Markup chuẩn trong preview mục 3.
- **Khoảnh khắc thưởng "wow":** component `.celebrate` (sao 110px + tia sáng toả + Pi reo + confetti nhiều hướng);
  `.stars--xl` 56px lúc lên sao.
- **Header có thương hiệu** (gradient brand nhạt + gờ tím) & **score-pill ánh kim** (gradient vàng + viền).
- **Thẻ chủ đề "sticker"** (icon tròn 80px/emoji 50px, tên VN to/đậm, EN faint-nghiêng).
- **Flashcard "thẻ sưu tập"** (viền pastel theo unit + chip "Chạm để lật ↻" + sao mờ mặt sau).
- **Speech của Pi** có `speech-pop` + nhấn từ khoá `.speech__hi`.

### C. Feasibility / kỳ vọng
- Ghi rõ `--font-display` thực tế = **system fallback (Segoe UI)** trên Windows; bù "chất vui" bằng weight/spacing/text-shadow.
- 100% offline giữ nguyên: chỉ emoji + SVG inline + gradient/shape CSS; không thêm tài nguyên mạng.
- `docs/preview.html` là bản NHÚNG tay — đã đồng bộ lại toàn bộ khối `<style>` với tokens/base v3.

### Bàn giao cho `frontend-web-toan-treem` — danh sách đổi (token/class) cần áp dụng
**Token mới/đổi giá trị (trong `css/tokens.css`):**
- `--c-accent-strong` #bd4708 (nay là NỀN nút accent), `--c-accent-deeper` #9a3a06 (MỚI, gờ 3D).
- `--c-border-strong` #b8aedb → **#7d6fb8**.
- `--c-star-edge` #d99100 → **#8a5a00**; `--c-star-deep` #9a6a00 → **#7e5a00**; `--c-star-empty-edge` **#b8a878** (MỚI).
- `--c-try` #d2570c → **#c0540f**; `--c-try-strong` #a8440a → **#9c440c**; `--c-try-soft`/`-text` đổi nhẹ.
- MỚI: `--grad-page`, `--tex-fireflies`, `--glow-firefly`, `--glow-celebrate`; `--shadow-btn-accent` dùng `--c-accent-deeper`.

**Class mới (trong `css/base.css`) — frontend dùng được ngay:**
- `.bg-fireflies` (phủ đốm sau khối), `.celebrate` + `.celebrate__star/__rays/__title`, `.stars--xl`.
- Pi: `.mascot.is-glowing` (+ phần tử `.belly-glow` trong SVG), `.mascot.is-wink`/`is-cheer` đổi mặt
  (cần các nhóm `<g class="face-happy|face-cheer|face-wink">` trong SVG — copy từ preview).
- `.flashcard__hint`, `.speech__hi`.

**Lưu ý JS/markup:** đây thuần CSS + markup SVG — KHÔNG đổi `id`/`class` mà engine/app đang dựa vào (chưa có app.js).
Hợp đồng UI `.choice` (key/text/mark) giữ nguyên thứ tự để `innerHTML` không vỡ. Sau khi áp, đề nghị chạy lại
`node tests/run.mjs` (nếu repo này có) để chắc an toàn/offline không bị phá.
