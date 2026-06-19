# REDESIGN — Diện mạo mới "Toán Vui Lớp 3" (Hiện đại tươi sáng)

> Tài liệu **chỉ về DIỆN MẠO (UI/visual)**. Luồng màn hình, cơ chế gamification, copy, và luật an toàn trong `DESIGN.md` **giữ nguyên, không phá**.
> Đối tượng: bé ~9 tuổi, tự ôn ở nhà. App chạy **offline** (mở file trong Chrome/Edge).
> Ràng buộc tuyệt đối: **không CDN/font/ảnh/script mạng**. Mọi hình ảnh dùng **gradient CSS, SVG inline, emoji, shape CSS**.
> File `design_prototype.html` đi kèm là bản dựng tĩnh tự chứa, dùng **đúng tokens dưới đây** để frontend bê thẳng vào.

---

## 0. Mood / định hướng

Mục tiêu thị giác: **"app cao cấp cho trẻ em"** — sạch, sáng, ấm, có nhịp.

- **Gradient mềm** (không lòe loẹt): nền trang là gradient rất nhạt; nút chính/nhấn dùng gradient bão hoà vừa phải. Không dùng cầu vồng 5 màu trên 1 nút.
- **Nhiều khoảng trắng**: tăng `padding` thẻ, tăng khoảng cách giữa các khối; mắt bé nghỉ được, không rối.
- **Thẻ gọn sắc nét**: bo góc lớn hơn (20–24px), viền mảnh + **bóng nhẹ nhiều tầng** thay cho viền dày 2px khắp nơi. Trông "nổi" mà không nặng.
- **Bảng màu tinh tế, nhất quán**: một màu thương hiệu indigo/xanh tím dịu làm trục; xanh lá (đúng) và hổ phách/cam (sai) chỉ xuất hiện khi cần. Bớt số lượng màu "tô loạn".
- **Vẫn ấm & vui**: vẫn giữ emoji thân thiện, vẫn confetti, vẫn câu khen; chỉ "nâng cấp khung" cho hiện đại, KHÔNG biến thành giao diện doanh nghiệp lạnh.

So với bản hiện tại (viền 2px xám khắp nơi, bóng `3px 0` kiểu "nút game phẳng", nhiều màu pill rời rạc), bản mới: **mềm hơn, sâu hơn, nhất quán hơn**.

---

## 1. Quyết định LINH VẬT

**Quyết định: KHÔNG thêm linh vật nhân vật riêng. Dùng một "hệ icon hình học + emoji nhất quán" làm danh tính thị giác.**

Lý do:
1. **Offline + không tài nguyên ngoài**: một linh vật vẽ tay đẹp cần nhiều SVG path phức tạp; làm sơ sài bằng vài shape CSS sẽ trông rẻ tiền, đi ngược định hướng "cao cấp". Emoji + SVG hình học cho kết quả sạch, đồng đều, không "lệch tay vẽ".
2. **Định hướng "hiện đại tươi sáng, bớt hoạt hình"**: một mascot hoạt hình kéo tông về phía "lòe loẹt" mà ta đang muốn giảm.
3. **Nhất quán & dễ bảo trì**: hệ icon (số/phép tính trong khối bo tròn gradient) gắn tự nhiên với từng chủ đề Toán, dễ mở rộng, không cần "kể chuyện nhân vật".
4. **An toàn nội dung**: không phải bịa nhân vật/giọng nói, tránh rủi ro tông giọng không phù hợp.

Danh tính thay thế: **logo "mark" hình khối bo tròn** chứa biểu tượng bàn tính/số, đặt cạnh chữ "Toán Vui Lớp 3" (gradient chữ). Mỗi chủ đề có **một viên "icon-chip"** — emoji đặt trong khối bo tròn có nền gradient pastel riêng theo chủ đề (mỗi chủ đề một sắc độ), tạo cảm giác bộ sưu tập gọn gàng mà vẫn nhiều màu vui.

---

## 2. DESIGN TOKENS (biến CSS — nguồn chân lý)

Frontend dán nguyên khối này vào `:root` thay cho khối `:root` cũ. Các biến **cũ vẫn còn** (để không vỡ chỗ tham chiếu) nhưng được trỏ tới giá trị mới; có thêm biến mới.

```css
:root {
  /* ---------- NỀN & BỀ MẶT ---------- */
  --bg: #F6F7FC;                 /* nền trang: xám-xanh rất nhạt, dịu mắt */
  --bg-grad: radial-gradient(1200px 600px at 50% -8%, #EEF2FF 0%, #F6F7FC 55%, #F4F6FB 100%);
  --card: #FFFFFF;               /* bề mặt thẻ */
  --card-soft: #FBFCFF;          /* thẻ phụ / vùng nền nhạt bên trong */
  --surface-2: #F1F4FB;          /* track thanh tiến độ, nền chip nhạt */

  /* ---------- CHỮ ---------- */
  --ink: #1B2138;                /* chữ chính (đậm, tương phản cao) */
  --ink-2: #3A4263;              /* chữ phụ đậm vừa */
  --muted: #6A7390;              /* chữ mờ (đạt >=4.5:1 trên nền sáng) */

  /* ---------- THƯƠNG HIỆU / NHẤN ---------- */
  --brand: #4F46E5;              /* indigo: nút chính, nhấn mạnh */
  --brand-2: #6D5DF6;            /* indigo sáng hơn cho gradient */
  --brand-dark: #3A33B8;         /* cạnh dưới nút / hover */
  --brand-ink: #2E2A7A;          /* chữ thương hiệu trên nền nhạt */
  --brand-soft: #EEF0FE;         /* nền nhạt thương hiệu (chip, hover) */
  --accent: #EC4899;             /* hồng nhấn phụ (mục tiêu, điểm nhấn vui) */

  /* ---------- TRẠNG THÁI ---------- */
  --ok: #15935B;                 /* đúng (xanh lá đậm, AA trên nền sáng) */
  --ok-2: #34C77B;               /* xanh lá sáng cho gradient/thanh */
  --ok-bg: #E6F8EE;              /* nền vùng đúng */
  --ok-border: #B6E8CC;
  --ok-ink: #0E6B42;             /* chữ trên nền ok-bg */

  --warn: #D9612B;               /* sai — cam ấm, KHÔNG đỏ gắt */
  --warn-2: #F08A4B;
  --warn-bg: #FDF0E7;            /* nền vùng sai */
  --warn-border: #F6CDAE;
  --warn-ink: #9A3D12;           /* chữ trên nền warn-bg (AA) */

  --star: #F4B731;               /* sao / thưởng */
  --star-bg: #FFF6DD;
  --star-border: #F3DDA0;
  --star-ink: #8A5A00;           /* chữ trên nền sao (AA) */

  --fire: #F2602E;               /* streak */
  --fire-bg: #FDEBE2;
  --fire-border: #F6C6AE;
  --fire-ink: #9A3D12;

  /* ---------- ĐƯỜNG VIỀN ---------- */
  --line: #E4E8F2;               /* viền mảnh mặc định */
  --line-2: #D5DBEA;             /* viền đậm hơn khi cần */

  /* ---------- GRADIENT DÙNG LẠI ---------- */
  --grad-brand: linear-gradient(135deg, #6D5DF6 0%, #4F46E5 100%);
  --grad-ok:    linear-gradient(135deg, #34C77B 0%, #15935B 100%);
  --grad-goal:  linear-gradient(90deg, #6D5DF6 0%, #EC4899 100%);
  --grad-star:  linear-gradient(135deg, #FFD66B 0%, #F4B731 100%);

  /* ---------- BO GÓC ---------- */
  --r-sm: 12px;
  --r:    16px;     /* (giữ tên cũ --radius bên dưới) */
  --r-lg: 22px;     /* thẻ lớn */
  --r-xl: 28px;     /* thẻ câu hỏi */
  --r-pill: 999px;
  --radius: 16px;   /* ALIAS GIỮ TƯƠNG THÍCH với CSS cũ */

  /* ---------- ĐỔ BÓNG (nhiều tầng, nhẹ) ---------- */
  --sh-sm: 0 1px 2px rgba(27,33,56,.06), 0 2px 6px rgba(27,33,56,.05);
  --sh:    0 2px 6px rgba(27,33,56,.06), 0 10px 24px rgba(27,33,56,.07);
  --sh-lg: 0 8px 20px rgba(27,33,56,.08), 0 18px 50px rgba(27,33,56,.10);
  --sh-brand: 0 8px 22px rgba(79,70,229,.28);
  --sh-ok:    0 8px 22px rgba(21,147,91,.26);

  /* ---------- THANG CHỮ (px; line-height 1.5) ---------- */
  --fs-display: 34px;  /* tiêu đề lớn / lời chào */
  --fs-h2: 24px;       /* tiêu đề mục */
  --fs-stem: 27px;     /* đề bài (24–28) */
  --fs-lg: 22px;       /* nút chính, số đáp án */
  --fs-body: 18px;     /* chữ thường (>=18) */
  --fs-sm: 16px;       /* chú thích phụ (không dùng cho nội dung quan trọng) */

  /* ---------- KHOẢNG CÁCH (thang 4px) ---------- */
  --sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px; --sp-4: 16px;
  --sp-5: 20px; --sp-6: 24px; --sp-7: 32px; --sp-8: 40px;

  /* ---------- VÙNG CHẠM ---------- */
  --tap: 48px;          /* tối thiểu */
  --tap-lg: 60px;       /* nút chính / đáp án */
}
```

**Lưu ý font (không đổi):** giữ `"Segoe UI", "Comic Sans MS", Arial, sans-serif` (có sẵn Windows, không cần font ngoài). Ký hiệu `× ÷ ²` và `m²` vẫn render tốt với fallback `"Times New Roman"` đã có cho `b, .stem`. **Giữ nguyên fallback này.**

---

## 3. SPEC TỪNG THÀNH PHẦN

### 3.1 Nền trang
- `body` dùng `background: var(--bg-grad); background-attachment: fixed;` để gradient không trượt khi cuộn (cảm giác "khung app").
- Cột nội dung `.app` giữ `max-width` nhưng **tăng nhẹ lên 780px** cho thoáng; padding ngang 20px.

### 3.2 Header (`header.bar`)
- Nền **kính mờ nhẹ**: `background: rgba(246,247,252,.85); backdrop-filter: saturate(140%) blur(8px);` (có `-webkit-backdrop-filter`; nếu trình duyệt không hỗ trợ thì nền vẫn đặc, không vỡ). Bỏ `border-bottom 2px`, thay bằng `box-shadow: var(--sh-sm)` chỉ hiện khi sticky.
- Logo: thêm **logo-mark SVG inline** (khối bo tròn gradient chứa bàn tính/dấu) trước chữ; chữ "Toán Vui Lớp 3" dùng **gradient text** (`background: var(--grad-brand); -webkit-background-clip:text; color:transparent;`) — vẫn để `color: var(--brand-ink)` làm fallback để không mất chữ.
- **Pills (⭐ / 🔥 / Câu n/n)**: bo tròn `--r-pill`, nền nhạt theo vai trò, **viền mảnh + bóng `--sh-sm`** thay viền 2px. Kích thước nhất quán, cao ~40px.
  - `.pill` (sao): nền `--star-bg`, viền `--star-border`, chữ `--star-ink`.
  - `.pill.fire`: nền `--fire-bg`, viền `--fire-border`, chữ `--fire-ink`.
  - `.pill.count`: nền `--brand-soft`, viền `#D8DBFB`, chữ `--brand-ink`.
- **Nút âm (`.iconbtn`)**: 48×48, bo `--r-sm`, nền trắng, viền `--line`, bóng `--sh-sm`; hover nền `--brand-soft`.

### 3.3 Thẻ chủ đề (`.topic`)
- Bố cục **giữ lưới 3 cột** (mobile: `auto-fit minmax(150px,1fr)` để không vỡ).
- Mỗi thẻ: bo `--r-lg`, nền `--card`, **viền mảnh `--line` + bóng `--sh`**; hover nâng `translateY(-4px)` + bóng `--sh-lg` + viền `--brand` nhạt.
- **Icon-chip**: emoji đặt trong khối tròn 56×56, nền gradient pastel **riêng theo chủ đề** (đặt qua biến inline hoặc class `t1..t9`, xem mục 6). Số thứ tự nhỏ ở góc trên (badge tròn). Tên chủ đề `--fs-body`, đậm, 2 dòng cân.
- Dải màu pastel mỗi chủ đề (nền chip — dùng tông nhạt để emoji vẫn rõ):
  - t1 Số: `#EEF0FE` · t2 Cộng–Trừ: `#E6F8EE` · t3 Nhân–Chia: `#FDECEF` · t4 Biểu thức: `#FFF4DC` · t5 Chia dư: `#E9F6FE` · t6 Đo lường: `#EAF7EC` · t7 Hình học: `#F0ECFE` · t8 Lời văn: `#FFEFE6` · t9 Tư duy: `#FCEFFB`.

### 3.4 Thanh "Mục tiêu hôm nay" (`.goal` + `.progress`)
- Thẻ bo `--r-lg`, nền `--card`, bóng `--sh`, **bỏ viền dày**.
- Nhãn: icon 🎯 + "Mục tiêu hôm nay" bên trái, "x/10 câu" bên phải (chữ đậm `--ink`).
- Track `.progress`: cao **14px**, nền `--surface-2`, bo tròn hết; fill `--grad-goal` (indigo→hồng) bo tròn, có **highlight bóng trong** rất nhẹ. Thêm "đốm sáng" cuối thanh (pseudo) tuỳ chọn.
- `.goal-done`: nền `--ok-bg`, viền `--ok-border`, chữ `--ok-ink`, icon 🌟.

### 3.5 Nút chính / phụ (`.btn`, `.btn.ghost`, `.btn.big`)
- **Nút chính `.btn`**: nền `--grad-brand`, chữ trắng, bo `--r` (14–16px), cao `--tap-lg`. **Bỏ bóng "3px 0" phẳng**, thay bằng `box-shadow: var(--sh-brand)`; `:active` lún nhẹ `translateY(1px)` + bóng nhỏ lại. Hover: sáng hơn 1 nấc (overlay trắng 8% hoặc đổi sang `--brand-2`).
- **Nút phụ `.btn.ghost`**: nền trắng, chữ `--brand`, viền `1.5px var(--brand)` nhạt (dùng `--brand` ở alpha thấp hơn), bóng `--sh-sm`; hover nền `--brand-soft`.
- **`.btn.big`**: full-width, `--fs-lg`, cao 64px. Nút "Ôn tập tổng hợp" là **CTA chủ đạo** (gradient brand). Nút "Huy hiệu" là ghost.
- `:disabled`: nền `--surface-2`, chữ `--muted`, không bóng brand, `cursor:not-allowed`.

### 3.6 Ô đáp án trắc nghiệm (`.choice`) & ô nhập (`.answerbox`)
- `.choice`: cao tối thiểu `--tap-lg`, bo `--r` (14px), nền trắng, viền `--line` 1.5px, bóng `--sh-sm`. `.key` (số 1–4) là khối 36×36 bo tròn nền `--brand-soft`, chữ `--brand-ink`.
- Trạng thái:
  - `.choice:hover` → viền `--brand`, nền `--brand-soft`.
  - `.choice.selected` → viền `--brand` 2px, nền `--brand-soft`, `.key` nền brand chữ trắng.
  - `.choice.correct` → viền `--ok`, nền `--ok-bg`, chữ `--ok-ink`, `.key` nền `--ok`/trắng, **`.mark`=✓**.
  - `.choice.wrong` → viền `--warn`, nền `--warn-bg`, chữ `--warn-ink`, `.key` nền `--warn`/trắng, **`.mark`=✗**.
- **Phân biệt không cần màu**: đúng/sai LUÔN có icon (✓/✗) trong `.mark` + đổi viền dày + (khuyến nghị) thêm chữ trong feedback. JS hiện đã set `.mark` = ✓/✗ — giữ nguyên.
- `.answerbox`: cao `--tap-lg`, bo `--r`, viền `--line` 1.5px, `:focus` viền `--brand` 2px + nền trắng + `box-shadow: 0 0 0 4px var(--brand-soft)`.

### 3.7 Phản hồi ĐÚNG / SAI (`.feedback`)
- Bo `--r-lg`, padding rộng hơn, **thanh màu trạng thái bên trái 6px** (border-left) để phân biệt nhanh kể cả khi không đọc màu nền.
- `.feedback.ok`: nền `--ok-bg`, border-left `--ok`, chữ `--ok-ink`; `.head` mở đầu bằng **huy chương tròn ✓** (khối tròn nền `--ok` chữ trắng) + câu khen.
- `.feedback.bad`: nền `--warn-bg`, border-left `--warn`, chữ `--warn-ink`; `.head` mở đầu bằng **khối tròn ✗** (nền `--warn` chữ trắng) + câu động viên. Dòng "Đáp án đúng:" làm nổi (chip nhỏ nền trắng viền `--ok`). Nút "Xem cách làm" (`.disclose`) bo tròn, nền trắng viền `--line`.
- `.feedback .explain`: nền `--card-soft` bo `--r-sm`, padding, để khối "Cách làm" tách bạch dễ đọc.

### 3.8 Màn Kết quả (`.result`)
- Thẻ `.qcard.result` căn giữa, bóng `--sh-lg`.
- Emoji to (64px) trong **vòng tròn gradient nhạt**; `.msg` `--fs-h2` đậm; điểm số làm **2 chip lớn** (Số câu đúng | ⭐ sao) cạnh nhau cho dễ liếc.
- `.badge-new`: thẻ nền `--star-bg`, viền `--star-border`, có icon huy chương; `.suggest`: nền `--brand-soft`, viền nhạt, icon 📌.

### 3.9 Màn Huy hiệu (`.bcard`)
- Lưới 2 cột; thẻ bo `--r-lg`, bóng `--sh`, viền `--line`.
- Đã đạt: icon trong chip gradient `--grad-star`, có dải "✓ Đã đạt!" chữ `--ok-ink`.
- Chưa đạt (`.locked`): icon xám (`filter:grayscale(1)` + opacity), thêm **biểu tượng ổ khoá 🔒 nhỏ**, dòng điều kiện chữ `--muted`. Không gây cảm giác "bị phạt" — chỉ là gợi mở.

---

## 4. Khả năng tiếp cận & an toàn (giữ nguyên, nhấn mạnh)
- `:focus-visible`: outline 4px màu **`--star`** (vàng) offset 2px — rõ trên mọi nền, giữ như cũ.
- Tương phản: mọi cặp chữ/nền dưới đây đã chọn để đạt **WCAG AA** (chữ thường ≥4.5:1; chữ to ≥3:1). Body 18px, đề bài 27px.
- Đúng/sai không chỉ dựa màu: luôn có **icon ✓/✗ + chữ** ("Chính xác.../Chưa đúng...") + thanh màu trái + đổi viền.
- `prefers-reduced-motion`: giữ `transition:none` toàn cục như cũ; confetti đã tự tắt trong JS.
- `lang="vi"`, `aria-live="polite"` ở `#feedback` và `.result`: **GIỮ NGUYÊN**, không đổi.

---

## 5. BẢNG "TRƯỚC → SAU" (vì sao)

| Hạng mục | Trước | Sau | Lý do |
|---|---|---|---|
| Màu thương hiệu | Xanh dương `#2D7DD2` | Indigo gradient `#6D5DF6→#4F46E5` | Indigo cho cảm giác "app cao cấp", gradient mềm hiện đại, vẫn vui. |
| Nền trang | `#FFFDF7` phẳng | Gradient `--bg-grad` xám-xanh nhạt cố định | Tạo chiều sâu nhẹ, "khung app", dịu mắt hơn nền ngà phẳng. |
| Viền thẻ | `2px solid` xám khắp nơi | Viền **1.5px mảnh** + **bóng nhiều tầng** | Bớt nặng/"khung tranh", nổi khối kiểu thẻ hiện đại. |
| Bóng nút | `0 3px 0` (phẳng kiểu game) | `--sh-brand` mềm, lún `translateY(1px)` khi nhấn | Sang hơn, vẫn có phản hồi nhấn rõ. |
| Bo góc | 12–16px đồng loạt | Thang `--r-sm..--r-xl` (12→28) theo cấp thẻ | Nhịp thị giác rõ: thẻ lớn bo nhiều hơn nút nhỏ. |
| Pills header | 3 nền màu rời rạc | Cùng dáng pill, nền nhạt theo vai trò + bóng nhẹ | Nhất quán, gọn, "thanh trạng thái cao cấp". |
| Thẻ chủ đề | Emoji rời trên nền trắng | Emoji trong **icon-chip gradient pastel** riêng từng chủ đề | Bộ sưu tập gọn, nhiều màu vui mà có hệ thống. |
| Thanh mục tiêu | Fill xanh lá | Fill gradient indigo→hồng `--grad-goal` | Hợp trục thương hiệu mới, nổi bật "phần thưởng hôm nay". |
| Đề bài | 25px | 27px (`--fs-stem`) | To rõ hơn cho bé đọc chậm; vẫn trong 24–28. |
| Phản hồi | Chỉ nền màu | Thêm **thanh màu trái 6px + chip ✓/✗ tròn** | Phân biệt đúng/sai kể cả khi mù màu/in trắng đen. |
| Logo | Emoji 🧮 + chữ phẳng | **Logo-mark SVG inline** + chữ gradient | Danh tính "app" rõ ràng hơn, vẫn 0 tài nguyên ngoài. |

---

## 6. DANH SÁCH THAY ĐỔI ĐỂ FRONTEND ÁP DỤNG

> Phần lớn là **thay CSS** (an toàn, không đụng JS). Một thay đổi nhỏ về markup tạo-bởi-JS được nêu rõ để frontend cập nhật cùng lúc, **không đổi ngầm**.

### 6.1 CSS thuần (không ảnh hưởng JS — làm trước)
1. **Thay khối `:root`** bằng tokens ở mục 2 (giữ alias `--radius`, `--brand`, `--ok`, `--warn`, `--star`, `--fire`, `--line`, `--muted` để các selector cũ vẫn chạy).
2. `body`: thêm `background: var(--bg-grad); background-attachment: fixed;` (vẫn để `background-color: var(--bg)` làm fallback). `.app { max-width: 780px; }`.
3. `header.bar`: nền kính mờ + `--sh-sm`, bỏ `border-bottom`. Thêm `-webkit-backdrop-filter`.
4. `.logo`: thêm gradient-text (giữ `color` fallback). (Logo-mark: xem 6.2.)
5. `.pill`, `.pill.fire`, `.pill.count`, `.iconbtn`: cập nhật nền/viền/bóng theo 3.2.
6. `.btn`, `.btn.ghost`, `.btn.big`, `.btn:disabled`: gradient + bóng mềm + active lún (3.5).
7. `.topic`, `.topic .emo`, `.topic .num`, `.topic .nm`: icon-chip + bóng (3.3).
8. `.goal`, `.progress`, `.progress > i`, `.goal-done`: thanh mục tiêu mới (3.4).
9. `.qcard`: bo `--r-xl`, bóng `--sh-lg`, viền mảnh. `.stem` 27px.
10. `.choice` + các state `.selected/.correct/.wrong`, `.choice .key`, `.answerbox`: theo 3.6.
11. `.feedback`, `.feedback.ok`, `.feedback.bad`, `.feedback .head`, `.feedback .explain`, `.disclose`: theo 3.7 (thêm `border-left` thanh màu).
12. `.result` + con, `.badge-new`, `.suggest`: theo 3.8.
13. `.badgegrid`, `.bcard`, `.bcard.locked`: theo 3.9 (icon-chip cho huy hiệu đạt; khoá 🔒 cho chưa đạt — **bằng CSS `::after` content, không sửa JS**).
14. `.restnote`: đổi sang nền `--star-bg`/viền `--star-border` cho hợp tông (tuỳ chọn).

### 6.2 Markup do JS tạo — cần frontend cập nhật JS (LIỆT KÊ RÕ)

**Tất cả `id`/`class` mà JS hiện dùng vẫn GIỮ NGUYÊN** (`#stem`, `#choices`, `.choice`, `.key`, `.txt`, `.mark`, `#feedback`, `#goalBar`, `#starTotal`, `#streakNow`, `#topicGrid`, `#badgeGrid`, `.bcard`, `.locked`, `.btn`, `.btn.ghost`, `#checkBtn`, `#nextBtn`, v.v.). Không xoá/đổi tên class nào trong số đó. Các đề xuất dưới đây **chỉ thêm**, frontend chọn áp dụng:

- **(A) Icon-chip cho thẻ chủ đề** — *thay đổi nhỏ trong `buildTopicGrid()`*:
  - Hiện tại tạo: `<span class="num">i</span><span class="emo">emoji</span><span class="nm">name</span>`.
  - Đề xuất: bọc emoji trong chip và gắn class màu theo thứ tự: đặt `b.classList.add('topic', 't' + (i+1))` và đổi phần emoji thành `<span class="chip"><span class="emo" aria-hidden="true">…</span></span>`. CSS dùng `.topic.t1 .chip { background:#EEF0FE } … .topic.t9 .chip {…}` (bảng màu ở 3.3).
  - **Nếu frontend không muốn đụng JS**: vẫn chạy được — CSS sẽ style `.emo` trực tiếp (fallback: bỏ `.chip`, cho `.emo` nền gradient brand chung). Prototype minh hoạ bản có `.chip` + class `t1..t9`. **Khuyến nghị áp dụng (A)** vì đẹp hơn rõ rệt.
- **(B) Chip ✓/✗ trong feedback head** — *không cần đổi JS*: JS đã render `<div class="head">✓ …</div>` / `<div class="head">↺ …</div>`. CSS sẽ tạo "viên tròn trạng thái" bằng `.feedback.ok .head::before` / `.feedback.bad .head::before` (content ✓ / ✗) và có thể ẩn ký tự ✓/↺ đầu chuỗi nếu muốn — **đề xuất GIỮ ký tự JS, chỉ thêm `::before` trang trí**, để `aria-live` đọc nguyên câu. An toàn, không sửa JS.
- **(C) Logo-mark SVG** — *thay đổi nhỏ trong markup tĩnh của `index.html`* (không phải JS): thêm 1 `<svg>` inline trong nút `#homeBtn` trước chữ. Giữ `aria-label="Về trang chủ Toán Vui Lớp 3"`, đặt `aria-hidden="true"` cho `<svg>`. Không thêm tài nguyên ngoài.
- **(D) Khoá 🔒 huy hiệu chưa đạt** — *không cần đổi JS*: dùng `.bcard.locked .bemo::after { content:'🔒' }` hoặc badge nhỏ tuyệt đối; JS đã gắn class `.locked`.

### 6.3 KHÔNG được làm (giữ test an toàn xanh)
- Không thêm `<iframe>`, `fetch`, `<img src="http...">`, `@import url(http...)`, `<link href="http...">`, `<script src="http...">`, analytics, hay bất kỳ tài nguyên mạng nào.
- Không bỏ `lang="vi"`; không bỏ `aria-live` ở `#feedback`/`.result`.
- Không dùng font ngoài (`@font-face` trỏ URL). Chỉ dùng font hệ thống đã khai báo.
- `backdrop-filter` và `-webkit-background-clip:text` chỉ là enhancement — luôn để **giá trị fallback** (nền đặc / `color`) để không vỡ khi thiếu hỗ trợ.

---

## 7. Kiểm thử thị giác đã thực hiện (xem cuối phần trả lời của agent)
- Render `design_prototype.html` ra PNG bằng Chrome headless, đọc lại ảnh: tiếng Việt đủ dấu; ký hiệu `× ÷ ² m²` hiển thị đúng; trạng thái đúng/sai phân biệt được cả khi bỏ màu (✓/✗ + thanh màu trái + chữ); vùng chạm ≥48px; đề bài ~27px; tương phản đạt AA cho các cặp chữ/nền chính.
