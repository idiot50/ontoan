# Tài liệu thiết kế UX — Website học Toán Lớp 1 "Toán Vui Lớp 1" (bé ~6 tuổi)

> Mục tiêu: **vui** và **khoa học (đúng sư phạm)**. Một trang web chạy **offline** (mở bằng Chrome/Edge), tiếng Việt, dùng cho **một bé ~6 tuổi** tự ôn ở nhà.
> Đây là **phiên bản EM** của "Toán Vui Lớp 3" (`d:\toanlop3\web_toan_lop3\`). **Tái sử dụng** luồng màn hình, hệ gamification, ngôn ngữ thiết kế "Hiện đại tươi sáng" (tokens indigo/gradient, icon-chip pastel, logo SVG, không mascot) và toàn bộ luật an toàn trẻ em. Tài liệu này chỉ ghi rõ **CHỖ KHÁC** vì trẻ nhỏ hơn.
> Tài liệu cho `frontend-web-toan-treem` dựng giao diện. Nội dung toán do giáo viên Toán + `ky-su-sinh-bai-toan` cấp; ở đây chỉ mô tả trải nghiệm, copy, màu, bố cục và luật an toàn.

**Khác biệt cốt lõi so với lớp 3 (đọc trước khi làm):**
1. **Bé 6 tuổi nhiều bé CHƯA đọc trôi chảy** → chữ rất to, RẤT ÍT chữ, ưu tiên số/hình/emoji; câu hỏi ngắn nhất có thể.
2. **Tính năng ĐỌC ĐỀ bằng giọng nói** (Web Speech API offline) — phần trọng tâm mới, xem mục 7.
3. **Nút/đáp án TO hơn nữa** (≥ 56–64px, khuyến nghị 64–72px cho đáp án số), khoảng cách rộng hơn.
4. **8 chủ đề** (lớp 3 có 9). Gamification **đơn giản hơn** (bớt mốc, bớt loại thưởng).
5. Phản hồi đúng/sai **nhiều hình ảnh & âm thanh động viên hơn**, tuyệt đối không gắt.

Giao kèo dữ liệu câu hỏi (giữ nguyên như lớp 3, KHÔNG đổi):
`question = { type:'mc'|'input', topic, stem, choices?, answer, explain }`
- `topic` = mã 1 trong 8 chủ đề lớp 1 (mục Phụ lục).
- Trắc nghiệm: gọi `check(q, <index số nguyên>)`, KHÔNG truyền text.
- `stem/choices/explain` render bằng `innerHTML` (cố ý chứa `<b>`, ký hiệu).
- **Khuyến nghị mới cho lớp 1**: thêm trường tuỳ chọn `speak` (chuỗi đọc to "thuần lời", bỏ HTML/ký hiệu khó đọc). Nếu engine không cấp `speak`, frontend tự rút gọn từ `stem` (xem 7.4).

---

## 1. Sơ đồ luồng màn hình (KẾ THỪA lớp 3 — đánh dấu chỗ KHÁC)

Luồng **giống hệt lớp 3**: Trang chủ → (chọn chủ đề → Luyện tập) hoặc (Ôn tập tổng hợp → Làm bài → Kết quả). Giữ nguyên 2 chế độ, 3 trạng thái mỗi câu (chưa trả lời / đúng / sai), không đếm ngược gây áp lực, luôn có nút Trang chủ.

```
              ┌─────────────────────────────────────────┐
              │            TRANG CHỦ                     │
              │  - Lời chào ngắn + tên app + 🔊 đọc chào │ ◀ KHÁC: có nút loa
              │  - Mục tiêu hôm nay (thanh tiến độ)      │ ◀ KHÁC: mục tiêu 5 câu
              │  - 8 thẻ CHỦ ĐỀ TO (chọn → Luyện tập)    │ ◀ KHÁC: 8 thẻ, 2 cột
              │  - Nút lớn: "Ôn tập vui (10 câu)"        │
              │  - Góc: ⭐ tổng sao · 🔥 chuỗi · 🔊 đọc  │ ◀ KHÁC: thêm nút 🔊
              │          · 🔈 âm thanh                   │
              └───────────────┬─────────────────────────┘
                  chọn 1 chủ đề│            │ chọn Ôn tập vui
                              ▼            ▼
        ┌──────────────────────┐   ┌──────────────────────┐
        │  LÀM BÀI — Luyện tập │   │ LÀM BÀI — Ôn tập     │
        │  (vô hạn, 1 chủ đề)  │   │ (bộ ~10 câu trộn)    │
        │  TỰ ĐỌC ĐỀ khi vào   │   │  TỰ ĐỌC ĐỀ khi vào   │ ◀ KHÁC: tự đọc to
        └──────────┬───────────┘   └──────────┬───────────┘
                   ▼                            ▼
         ┌───────────────────────────────────────────────┐
         │  Mỗi câu: (a) CHƯA TRẢ LỜI → (b) ĐÚNG / (c) SAI│
         │  Khi hiện câu mới: TỰ ĐỌC TO (nếu bật & có giọng)│ ◀ KHÁC
         └───────────────────────────────────────────────┘
                   │ Luyện tập: bấm 🏠 để dừng           │ Ôn tập: hết câu 10
                   ▼                                      ▼
        (về Trang chủ)                        ┌──────────────────────┐
                                              │      KẾT QUẢ         │
                                              │ Sao, đúng/sai, huy   │
                                              │ hiệu mới, lời khen   │
                                              │ TO + 🔊 đọc kết quả  │ ◀ KHÁC
                                              └──────────┬───────────┘
                                                 │ Làm lại │ Trang chủ
                                                 ▼         ▼
```

### Chỗ KHÁC so với lớp 3 (tóm tắt)
- **8 thẻ chủ đề** thay 9; bố trí **lưới 2 cột** (thẻ to hơn) thay vì 3 cột.
- **Mục tiêu ngày = 5 câu** (lớp 3 là 10) — bé nhỏ tập trung ngắn hơn.
- **Tự đọc to câu hỏi** khi mỗi câu mới hiện (mục 7), có thể tắt; nút 🔊 nghe lại.
- **Ôn tập vẫn 10 câu** giữ như lớp 3 để có màn Kết quả; nhưng nhắc nghỉ mắt **sau mỗi 5 câu** (lớp 3 là 10).
- Màn Kết quả: thông điệp ngắn, emoji to, có nút 🔊 đọc kết quả.

### Mô tả từng trạng thái (chỉ nêu KHÁC; còn lại như lớp 3)
**Trang chủ** — lời chào RẤT ngắn ("Chào bé! Hôm nay học gì nào?"), có nút 🔊 đọc lời chào + đọc tên 8 chủ đề khi bé chạm vào thẻ (hover/focus đọc tên thẻ — tuỳ chọn, xem 7.3).

**Làm bài — CHƯA TRẢ LỜI (a)** — câu mới hiện → **tự đọc to** (nếu bật & có giọng tiếng Việt). Nút "Kiểm tra" mờ/khoá đến khi bé chọn/nhập. KHÔNG đếm ngược. Nút 🔊 luôn cạnh câu hỏi để nghe lại bất cứ lúc nào.

**Làm bài — ĐÚNG (b)** — đáp án tô **xanh lá** + ✓ TO; confetti vui hơn lớp 3 (vẫn < 1.5s, không che nút); âm "ting" + (tuỳ chọn) đọc to lời khen ngắn. Cộng ⭐, tăng 🔥. Giải thích **rất ngắn 1 dòng** kèm hình/emoji. Nút "Câu tiếp →" TO, auto-focus.

**Làm bài — SAI (c)** — đáp án bé chọn tô **cam** (KHÔNG đỏ gắt) + ✗; đáp án đúng tô **xanh lá** + ✓. Reset 🔥 nhẹ nhàng. Hiện câu động viên ngắn + nút TO "Xem cách làm" (mở 1–2 dòng + hình). **Không trừ sao.** Khuyến nghị: có nút "🔊 Nghe lại đề" để bé nghe lại trước khi thử tiếp.

**Kết quả** (chỉ Ôn tập) — emoji to + 1 dòng khen theo mức, ⭐ +sao, số đúng/sai dạng **2 ô số to**, huy hiệu mới (nếu có). Gợi ý ôn lại 1 chủ đề (nhẹ nhàng). Nút 🔊 đọc to câu kết quả. Nút "Làm lại" / "Trang chủ" TO.

---

## 2. Bố cục từng màn (mô tả khối + vị trí nút 🔊 đọc đề)

Khung chung: **một cột giữa**, `max-width ~760px`, nền sáng dịu (gradient như lớp 3), mọi thứ căn giữa. Chữ và nút TO HƠN lớp 3.

### 2.1 Trang chủ
```
┌───────────────────────────────────────────────┐
│ [🏠 logo + Toán Vui Lớp 1]   [⭐ 24] [🔊][🔈] │  ← header cố định
│                                  ▲nghe ▲âm     │     2 nút riêng (xem 7.6)
├───────────────────────────────────────────────┤
│   Chào bé! Hôm nay học gì nào?  [🔊]           │  ← lời chào TO + loa đọc chào
│   ▓▓▓▓░░░░  Hôm nay: 3/5 câu 🎯                │  ← mục tiêu ngày = 5 câu
├───────────────────────────────────────────────┤
│   ┌───────────┐   ┌───────────┐                │
│   │   🔢      │   │   ➕       │                │  ← lưới 2 cột x 4 hàng = 8 thẻ
│   │ Số đến 100│   │ Phép cộng │                │     thẻ TO, icon-chip lớn
│   └───────────┘   └───────────┘                │
│   ┌───────────┐   ┌───────────┐                │
│   │   ➖      │   │   🔢🔁     │                │
│   │ Phép trừ  │   │ Tính dãy  │                │
│   └───────────┘   └───────────┘    ...(8 thẻ)  │
├───────────────────────────────────────────────┤
│   [ ▶  ÔN TẬP VUI — 10 câu  ]   (nút TO, brand)│
│   [ 🏅 Huy hiệu của bé ]        (nút ghost)    │
└───────────────────────────────────────────────┘
```
- **Header luôn hiện ở mọi màn**: trái = logo + tên (bấm về Trang chủ); phải = ⭐ tổng sao, **nút 🔊 "Đọc to" (bật/tắt tự đọc)** và **nút 🔈 âm thanh** (hiệu ứng ting/confetti). Hai nút TÁCH RIÊNG (xem 7.6).
- 8 thẻ chủ đề **2 cột** cho thẻ rộng, icon-chip 64px, tên chủ đề 1–2 từ, chữ to đậm.

### 2.2 Màn Làm bài (Luyện tập & Ôn tập dùng chung khung) — VỊ TRÍ NÚT 🔊
```
┌───────────────────────────────────────────────┐
│ [🏠]      ⭐12  🔥3   Câu 4/10        [🔊][🔈] │  ← header + trạng thái
│  ▓▓▓▓░░░░░░  (thanh tiến độ — chỉ Ôn tập)      │
├───────────────────────────────────────────────┤
│   ┌─────────────────────────────────────────┐ │
│   │                              ┌────────┐  │ │
│   │   3 + 2 = ?                  │  🔊    │  │ │  ◀ NÚT 🔊 ĐỌC ĐỀ
│   │   (số/đề RẤT TO, ít chữ)     │ Nghe   │  │ │    góc trên-phải THẺ CÂU HỎI
│   │   [hình minh hoạ nếu có]     │ lại    │  │ │    cao ≥56px, luôn thấy
│   │                              └────────┘  │ │
│   └─────────────────────────────────────────┘ │
│                                                │
│   ┌──────────┐   ┌──────────┐                  │
│   │    4     │   │    5     │   (mc: nút SỐ TO)│  ← đáp án ≥64px, số ≥40px
│   └──────────┘   └──────────┘                  │
│   ┌──────────┐   ┌──────────┐                  │
│   │    6     │   │    7     │                  │
│   └──────────┘   └──────────┘                  │
│       hoặc  [   __ nhập số __   ]  (input TO)  │
│                                                │
│   [   ✅  KIỂM TRA   ]   (TO, khoá đến khi chọn)│
│   ── sau khi kiểm tra ──                        │
│   (vùng phản hồi đúng/sai + hình + 1 dòng)      │
│   [ 🔊 Nghe lại đề ]   [ Câu tiếp →  ]          │  ◀ thêm nút nghe lại ở SAI
└───────────────────────────────────────────────┘
```
- **Nút 🔊 "Nghe lại" gắn ở góc trên-phải THẺ CÂU HỎI** (cạnh đề), kích thước ≥ 56×56, nhãn ngắn "Nghe" + icon loa, `aria-label="Nghe lại câu hỏi"`. Đây là vị trí cố định, bé luôn biết tìm ở đâu.
- Khi câu mới hiện: **tự phát đọc to** (nếu bật). Nút 🔊 ở thẻ câu hỏi cho phép nghe lại không giới hạn.
- Đáp án trắc nghiệm: **2 cột, ô vuông to, SỐ rất to ở giữa** (ưu tiên hiển thị số lớn — yêu cầu lớp 1). Bỏ chữ "A/B/C/D" nếu rối; nếu giữ phím tắt 1–4 thì để badge số nhỏ ở GÓC, không lấn số đáp án.
- Nút "Câu tiếp →" thay chỗ "Kiểm tra" sau khi chấm. Ở trạng thái SAI có thêm "🔊 Nghe lại đề" để bé nghe lại trước khi đi tiếp/thử lại.

### 2.3 Màn Kết quả (Ôn tập vui)
```
┌───────────────────────────────────────────────┐
│ [🏠 Trang chủ]                       [🔊][🔈] │
├───────────────────────────────────────────────┤
│            🎉  (emoji TO 72px)                 │
│         Bé giỏi quá!  [🔊]                     │  ← 1 dòng khen TO + loa đọc
│      ┌─────────┐   ┌─────────┐                 │
│      │ Đúng 8  │   │ ⭐ +16  │                 │  ← 2 ô SỐ TO, liếc là thấy
│      └─────────┘   └─────────┘                 │
│   ┌─────────────────────────────────────────┐  │
│   │ 🏅 Huy hiệu mới: Vua phép cộng!          │  │  ← nếu có
│   └─────────────────────────────────────────┘  │
│   📌 Ôn thêm: ➖ Phép trừ nhé!  (nếu có sai)   │
│   [ 🔁 Chơi lại ]      [ 🏠 Trang chủ ]         │
└───────────────────────────────────────────────┘
```
- Nút 🔊 cạnh câu khen đọc to: "Bé giỏi quá! Bé làm đúng 8 trên 10 câu." (câu đọc do frontend ghép, xem 7.4).

---

## 3. Hệ thống gamification (ĐƠN GIẢN HƠN lớp 3)

Giữ nguyên triết lý: **thi đua với chính mình**, thưởng tức thì, mốc nhỏ dễ đạt, **không phạt**, không so với người khác. Nhưng **bớt loại thưởng và bớt mốc** cho bé nhỏ dễ hiểu.

### 3.1 Sao ⭐ (đơn giản hoá)
| Sự kiện | Sao |
|---|---|
| Trả lời đúng | **+1 ⭐** |
| Hoàn thành bộ Ôn tập 10 câu | **+5 ⭐** |
| Đạt mục tiêu ngày (5 câu) | **+3 ⭐** |
- Sai: **+0**, KHÔNG trừ. Sao chỉ cộng dồn.
- *Khác lớp 3*: bỏ thưởng "đúng lần đầu" (rườm rà với bé 6 tuổi); mỗi câu đúng = 1 sao cho dễ đếm trực quan.

### 3.2 Chuỗi đúng 🔥 + kỷ lục cá nhân (giữ, nhẹ hơn)
- Mỗi câu đúng liên tiếp +1; sai → về 0 kèm copy nhẹ.
- Lưu kỷ lục chuỗi dài nhất (localStorage). Phá kỷ lục → "Kỷ lục mới của bé: 🔥 5 câu liền!".
- Mốc ăn mừng **ít hơn**: chỉ 🔥3 và 🔥5 → confetti nhỏ + lời khen (lớp 3 có 3/5/10). Bé 6 tuổi hiếm đạt chuỗi dài, mốc thấp để dễ vui.

### 3.3 Huy hiệu (8 chủ đề + vài huy hiệu chung) 🏅
Điều kiện **dễ đạt hơn lớp 3** (số câu nhỏ hơn). Mỗi huy hiệu đạt 1 lần, lưu vĩnh viễn. Tên ngắn, dễ hiểu với bé.

| # | Chủ đề (mã) | Tên huy hiệu | Điều kiện đạt |
|---|---|---|---|
| 1 | Số đến 100 (`t1`) | 🔢 Bạn của những con số | Đúng 10 câu (cộng dồn) chủ đề 1 |
| 2 | Phép cộng (`t2`) | ➕ Vua phép cộng | Đúng 10 câu (cộng dồn) chủ đề 2 |
| 3 | Phép trừ (`t3`) | ➖ Vua phép trừ | Đúng 10 câu (cộng dồn) chủ đề 3 |
| 4 | Tính dãy & Điền số (`t4`) | 🧩 Thám tử điền số | Đúng 8 câu (cộng dồn) chủ đề 4 |
| 5 | Độ dài cm (`t5`) | 📏 Bé thợ đo | Đúng 8 câu (cộng dồn) chủ đề 5 |
| 6 | Xem giờ & Ngày (`t6`) | 🕐 Bé xem giờ giỏi | Đúng 8 câu (cộng dồn) chủ đề 6 |
| 7 | Toán lời văn (`t7`) | 📖 Bé đọc đề giỏi | Đúng 8 câu (cộng dồn) chủ đề 7 |
| 8 | Đố vui tư duy (`t8`) | 💡 Bé thông minh | Đúng 6 câu (cộng dồn) chủ đề 8 |
| — | Tổng hợp | 🌈 Đủ tám chủ đề | Có ít nhất 1 câu đúng ở **cả 8** chủ đề |
| — | Thói quen | 📅 Bé chăm chỉ | Đạt mục tiêu ngày **3 ngày** (không cần liên tiếp) |
| — | Ôn tập | 🎯 Nhà vô địch | Đúng **8/10 trở lên** trong 1 bộ Ôn tập |

- Màn "Huy hiệu của bé": lưới 2 cột, huy hiệu đạt = icon-chip màu vàng + dải "✓ Đã đạt!"; chưa đạt = icon xám + 🔒 + 1 dòng gợi ý ngắn ("Làm đúng vài câu là có nhé!"). Không gây cảm giác bị phạt.
- *Khác lớp 3*: bỏ bớt huy hiệu khó; ngưỡng nhỏ hơn (6–10 câu thay 8–20); tên huy hiệu đơn giản, không từ Hán-Việt khó ("Bạn của những con số" thay "Chúa tể những con số").

### 3.4 Mục tiêu mỗi ngày
- Mặc định **5 câu/ngày** (lớp 3 là 10) — đếm tổng câu trả lời, đúng/sai đều tính.
- Thanh tiến độ ngày trên Trang chủ. Đạt → ăn mừng vừa phải + "Hôm nay bé học xong rồi, giỏi lắm!".
- **Không phạt khi bỏ ngày**, không "đốt streak ngày", không thông báo nhối thúc.

---

## 4. Bảng "copy" tiếng Việt (cho bé ~6 tuổi — NGẮN, dễ nghe khi đọc to)

Nguyên tắc copy lớp 1: **câu ngắn, từ quen, không từ Hán-Việt khó, đọc to nghe tự nhiên**. Mọi câu khen/động viên đều phải nghe ổn khi SpeechSynthesis phát.

### 4.1 Tên app
- **"Toán Vui Lớp 1"** ✅ khuyến nghị mặc định (đồng bộ với "Toán Vui Lớp 3", rõ nghĩa).
- Phương án khác: "Bé Học Toán", "Toán Cho Bé Lớp 1".
- Lời chào trang chủ (RẤT ngắn): **"Chào bé! Hôm nay học gì nào?"**

### 4.2 Câu khen khi ĐÚNG (ngẫu nhiên — ngắn, dễ đọc to)
1. "Giỏi quá! 🎉"
2. "Đúng rồi! ⭐"
3. "Tuyệt vời!"
4. "Hoan hô bé!"
5. "Bé làm được rồi!"
6. "Quá giỏi!"
7. "Đúng boong!"
8. "Bé thông minh ghê! 🌟"

### 4.3 Câu động viên khi SAI (ngắn, ấm áp, mời xem cách làm)
1. "Gần đúng rồi! Xem cách làm nhé 👇"
2. "Không sao đâu! Mình xem nào 👇"
3. "Sai chút thôi, bé làm lại được mà!"
4. "Cố lên! Đáp án đúng là đây 👇"
5. "Đừng lo, ai cũng có lúc nhầm mà."
6. "Lần sau bé làm được! Xem nhé 👇"
- Khi reset streak: **"Bắt đầu lại nào, không sao đâu!"**
- Nhãn nút giải thích: **"Xem cách làm"** / khi mở: **"Ẩn cách làm"**.

### 4.4 Nhãn nút (đồng nhất toàn app, NGẮN)
| Chức năng | Nhãn |
|---|---|
| Chấm câu | "✅ Kiểm tra" |
| Đi tiếp | "Câu tiếp →" |
| Về nhà | "🏠 Trang chủ" |
| Bắt đầu ôn tập | "▶ Ôn tập vui" |
| Làm lại bộ | "🔁 Chơi lại" |
| Đọc to đề (nghe lại) | "🔊 Nghe" (aria-label: "Nghe lại câu hỏi") |
| Bật/tắt tự đọc | "🔊 Đọc to" / "🔊̶ Tắt đọc" (xem 7.6) |
| Bật/tắt âm hiệu ứng | "🔈 Âm thanh" / "🔇 Đã tắt" |
| Huy hiệu | "🏅 Huy hiệu của bé" |

### 4.5 Thông điệp màn Kết quả theo mức (trên 10 câu) — NGẮN
| Số câu đúng | Thông điệp |
|---|---|
| 10/10 | "🏆 Hoàn hảo! Bé đúng cả 10 câu!" |
| 8–9 | "🎉 Giỏi lắm! Bé làm rất tốt!" |
| 5–7 | "😊 Khá lắm! Bé đang giỏi lên đó!" |
| 3–4 | "💪 Cố lên nhé! Ôn thêm chút là giỏi liền!" |
| 0–2 | "🌱 Không sao đâu! Mình học lại từ từ nhé!" |
- Dòng gợi ý: **"📌 Ôn thêm: [tên chủ đề] nhé!"** (chỉ hiện khi có câu sai, giọng nhẹ).

---

## 5. Hướng dẫn phong cách (KẾ THỪA tokens "Hiện đại tươi sáng" — nêu cái gì TO/ĐẬM hơn cho lớp 1)

**Tái sử dụng nguyên bộ DESIGN TOKENS của lớp 3** (`web_toan_lop3\REDESIGN.md` mục 2): nền gradient indigo `--bg-grad`, màu thương hiệu indigo `--brand #4F46E5`/`--brand-2 #6D5DF6`, đúng xanh lá `--ok`, sai cam `--warn` (KHÔNG đỏ gắt), sao vàng `--star`, streak `--fire`, bóng nhiều tầng, bo góc thang `--r-sm..--r-xl`, icon-chip pastel theo chủ đề, logo-mark SVG inline, KHÔNG mascot. Giữ font hệ thống `"Segoe UI", "Comic Sans MS", Arial, sans-serif` (không font ngoài).

### 5.1 CÁI GÌ TO/ĐẬM HƠN so với lớp 3 (override tokens cho lớp 1)
Frontend dán đè các biến sau lên `:root` (sau khi đã có tokens lớp 3):
```css
:root {
  /* THANG CHỮ — tất cả tăng 1 nấc so với lớp 3 */
  --fs-display: 40px;   /* lời chào / tiêu đề lớn (lớp 3: 34) */
  --fs-h2: 28px;        /* tiêu đề mục (lớp 3: 24) */
  --fs-stem: 34px;      /* ĐỀ BÀI — RẤT TO (lớp 3: 27); ít chữ nên to được */
  --fs-answer: 40px;    /* SỐ trong đáp án — to nhất để bé liếc thấy ngay */
  --fs-lg: 26px;        /* nút chính (lớp 3: 22) */
  --fs-body: 20px;      /* chữ thường tối thiểu (lớp 3: 18) */
  --fs-sm: 18px;        /* chú thích (không dùng cho nội dung quan trọng) */

  /* VÙNG CHẠM — to hơn */
  --tap: 56px;          /* tối thiểu (lớp 3: 48) */
  --tap-lg: 72px;       /* nút chính / ô đáp án (lớp 3: 60) */

  /* KHOẢNG CÁCH — rộng hơn để tay nhỏ không bấm nhầm */
  --gap-choice: 16px;   /* khoảng giữa các ô đáp án (lớp 3: 12) */
}
```
- **Đề bài & số đáp án to nhất màn hình** — vì lớp 1 đề rất ngắn (ví dụ `3 + 2 = ?`), tận dụng để phóng to.
- **Đáp án trắc nghiệm: 2 cột ô vuông to**, số căn giữa cỡ `--fs-answer` (40px), đậm. Ưu tiên hiển thị **số lớn** rõ ràng.
- **Ô nhập số (input)**: cao `--tap-lg` (72px), chữ nhập 40px, căn giữa; gợi ý bàn phím số (`inputmode="numeric"`).
- Logo, header, icon-chip chủ đề: phóng to nhẹ (icon-chip 64px thay 56px).
- Confetti/ăn mừng: cho phép **nhỉnh hơn lớp 3 một chút** (vẫn < 1.5s, vẫn tôn trọng `prefers-reduced-motion`).
- Giữ nguyên quy tắc: **không truyền thông tin chỉ bằng màu** — đúng/sai luôn kèm ✓/✗ + chữ + thanh màu trái.
- Tương phản: mọi cặp chữ/nền đạt **WCAG AA** (chữ to ≥ 24px cần ≥ 3:1; chữ thường ≥ 4.5:1). Với đề/đáp án rất to, dễ đạt; vẫn kiểm lại các pill nhỏ.

### 5.2 Khác biệt bố cục
- Thẻ chủ đề **2 cột** (lớp 3: 3 cột) → mỗi thẻ rộng, tên 1–2 từ to.
- Số chủ đề: **8** (bỏ 1 thẻ so với lớp 3); icon-chip pastel cấp lại theo 8 mã `t1..t8` (xem Phụ lục).

---

## 6. Quy tắc AN TOÀN TRẺ EM (BẮT BUỘC — kế thừa lớp 3, có bổ sung cho lớp 1)

Giữ NGUYÊN toàn bộ 12 luật an toàn của lớp 3. Nhấn mạnh & bổ sung:

1. **Offline tuyệt đối**: không CDN/font/ảnh/script/iframe mạng; không `fetch`; mọi hình bằng emoji/SVG inline/CSS. **Web Speech API (SpeechSynthesis) là API trình duyệt sẵn có, KHÔNG tải gì, KHÔNG gửi dữ liệu ra ngoài** — hợp lệ với "offline tuyệt đối" (xem 7.7 ghi chú quyền riêng tư).
2. **Không quảng cáo, không mua bán trong app, không tiền tệ thật, không "mở khoá bằng tiền".**
3. **Không link/điều hướng ra ngoài Internet.**
4. **Không thu thập dữ liệu cá nhân**: không hỏi tên thật/tuổi/trường/ảnh/vị trí. Tiến độ chỉ lưu **localStorage** tại máy. Mọi dữ liệu ra ngoài chỉ khi phụ huynh đồng ý qua `backend-luu-tien-do`.
5. **Không dark pattern**: không đếm ngược gắt; không phạt khi nghỉ; không "đốt streak"; không thông báo đẩy; luôn có nút 🏠 Trang chủ ở mọi màn.
6. **Phản hồi mang tính phát triển**: sai chỉ ra cách làm đúng, mời ôn lại; tuyệt đối không chê bai, không xếp hạng so người khác.
7. **Gợi ý nghỉ mắt**: sau mỗi **~5 câu** hoặc ~10 phút liên tục (lớp 3 là 10 câu/15 phút) → nhắc nhẹ "Bé nghỉ mắt một chút nhé, nhìn ra xa cho khỏe mắt 👀" — chỉ gợi ý, không khoá màn hình.
8. **Hỗ trợ bàn phím đầy đủ**: Tab di chuyển, Enter = Kiểm tra/Câu tiếp, **phím 1–4** chọn đáp án, **phím để nghe lại đề** (gợi ý phím `L` hoặc nút focus được), focus-visible rõ. Mọi thao tác chuột làm được bằng bàn phím.
9. **Tương phản WCAG AA** toàn bộ; phóng to trình duyệt không vỡ layout; thông tin không phụ thuộc duy nhất vào màu.
10. **Đọc màn hình cơ bản**: `lang="vi"`; `aria-label`/`alt` cho icon & hình; vùng phản hồi đúng/sai có `aria-live="polite"`. Nút 🔊 có `aria-label` rõ ("Nghe lại câu hỏi", "Bật/Tắt tự đọc").
11. **Tôn trọng `prefers-reduced-motion`** và có **nút tắt âm hiệu ứng** riêng + **nút tắt tự đọc** riêng. Mặc định không gây giật mình (xem 7.6 về mặc định).
12. **An toàn dữ liệu cục bộ**: localStorage hỏng/trống → app vẫn chạy với mặc định, không treo.
13. **(MỚI cho lớp 1) An toàn giọng nói**: SpeechSynthesis chỉ phát khi có tương tác hoặc khi bé chủ động vào màn làm bài; KHÔNG đọc tự động ngay lúc tải trang chủ (tránh giật mình & tránh chính sách autoplay của trình duyệt). Tốc độ đọc chậm (`rate ≈ 0.9`), âm lượng vừa. Có nút tắt tự đọc. Nếu không có giọng tiếng Việt → ẩn/làm mờ tính năng (xem 7.5), app vẫn dùng bình thường.

---

## 7. TÍNH NĂNG ĐỌC ĐỀ BẰNG GIỌNG NÓI (trọng tâm mới của lớp 1)

Dùng **Web Speech API → `window.speechSynthesis` + `SpeechSynthesisUtterance`** (có sẵn trong Chrome/Edge, **offline, không tải gì, không gửi dữ liệu**). Mục tiêu: bé chưa đọc trôi chảy vẫn tự làm được vì **nghe** được đề.

### 7.1 Khi nào đọc (hành vi)
- **Tự đọc khi câu mới hiện** (state "chưa trả lời") — nếu `autoRead = bật` VÀ có giọng tiếng Việt. Có độ trễ nhỏ ~250ms sau khi câu render để không "đọc đè" hiệu ứng chuyển màn.
- **Nút 🔊 "Nghe" ở thẻ câu hỏi**: bấm để nghe lại bất cứ lúc nào (không giới hạn số lần). Luôn hiện kể cả khi `autoRead` tắt (miễn có giọng).
- **Màn Kết quả**: nút 🔊 đọc câu khen + số câu đúng.
- **KHÔNG tự đọc ngay khi tải Trang chủ** (tránh giật mình + tránh bị trình duyệt chặn autoplay khi chưa có tương tác). Lời chào trang chủ chỉ đọc khi bé bấm nút 🔊 cạnh lời chào.

### 7.2 Bật/tắt & ghi nhớ
- Trạng thái `autoRead` (tự đọc) lưu **localStorage** (`tv1_autoRead`), mặc định **BẬT** nếu máy có giọng tiếng Việt (vì đối tượng là bé chưa đọc tốt — đọc to là trợ năng chính). Nếu lo ồn, frontend có thể đặt mặc định tắt — miễn có nút bật.
- Nút bật/tắt tự đọc ở header (tách khỏi nút âm hiệu ứng — mục 7.6).
- Khi đang đọc mà bé bấm nút khác / sang câu khác → **gọi `speechSynthesis.cancel()`** trước khi phát câu mới (tránh chồng tiếng).

### 7.3 Đọc tên chủ đề (tuỳ chọn, hữu ích cho bé chưa đọc)
- Khi bé **focus/hover** vào thẻ chủ đề (hoặc bấm giữ), đọc tên chủ đề ("Phép cộng"). Giúp bé chọn đúng dù chưa đọc chữ. Tuỳ chọn — bật cùng `autoRead`. Tránh đọc liên tục khi rê chuột nhanh (debounce ~300ms, cancel cái cũ).

### 7.4 Nội dung đọc (chuỗi "thuần lời")
- Ưu tiên dùng trường `q.speak` nếu engine cấp (chuỗi đã sạch, dễ đọc).
- Nếu không có `speak`: frontend **rút gọn từ `q.stem`** — bỏ thẻ HTML, đổi ký hiệu sang lời:
  - `+` → "cộng", `-`/`−` → "trừ", `=` → "bằng", `?` → "bao nhiêu" hoặc "mấy", `<` → "bé hơn", `>` → "lớn hơn", `cm` → "xăng-ti-mét", `>` `<` trong điền dấu đọc rõ.
  - Ví dụ stem `3 + 2 = ?` → đọc **"Ba cộng hai bằng mấy?"** (chuyển số sang chữ tiếng Việt cho tự nhiên là tốt nhất; nếu khó, đọc "3 cộng 2 bằng mấy" vẫn chấp nhận được).
- **Không đọc** phần đáp án trắc nghiệm tự động (tránh dài dòng); có thể có nút phụ "🔊 Đọc các đáp án" nếu cần (tuỳ chọn).
- Khuyến nghị: `ky-su-sinh-bai-toan` bổ sung `speak` cho các dạng có ký hiệu/hình (xem giờ, độ dài) để đọc tự nhiên.

### 7.5 FALLBACK khi máy KHÔNG có giọng tiếng Việt (BẮT BUỘC)
- Khi tải app: gọi `speechSynthesis.getVoices()`; lưu ý danh sách giọng nạp **bất đồng bộ** → lắng nghe sự kiện `voiceschanged` rồi mới quyết định.
- Tìm giọng có `voice.lang` bắt đầu bằng `vi` (vd `vi-VN`). Nếu **có** → dùng giọng đó, kích hoạt nút 🔊 và tính năng tự đọc.
- Nếu **không có giọng tiếng Việt** (hoặc `speechSynthesis` không tồn tại):
  - **Ẩn hoặc làm mờ (disabled)** nút 🔊 đọc đề và nút bật tự đọc; thêm `title`/tooltip nhẹ "Máy này chưa có giọng đọc tiếng Việt" (không phải lỗi, không cảnh báo to).
  - **App vẫn chạy bình thường hoàn toàn** — chữ to vẫn đọc được bằng mắt; không khoá chức năng nào khác.
  - KHÔNG tự ý dùng giọng ngôn ngữ khác đọc tiếng Việt (nghe sai, gây khó hiểu). Thà ẩn còn hơn đọc sai.
- Trường hợp `speechSynthesis` tồn tại nhưng `getVoices()` rỗng kéo dài (một số máy) → coi như không có giọng, ẩn nút (an toàn).

### 7.6 Hai nút riêng: "Đọc to" vs "Âm thanh hiệu ứng"
Tách bạch để rõ ràng, dễ chỉnh:
- **🔊 Đọc to** (autoRead): bật/tắt việc đọc đề bằng giọng nói. (Ẩn nếu không có giọng tiếng Việt.)
- **🔈 Âm thanh**: bật/tắt hiệu ứng "ting/bloop/confetti-sound" (Web Audio). Độc lập với đọc to.
- Cả hai lưu localStorage riêng (`tv1_autoRead`, `tv1_soundOn`). Mỗi nút có `aria-pressed` phản ánh trạng thái.

### 7.7 Kỹ thuật & an toàn giọng nói
- `const u = new SpeechSynthesisUtterance(text); u.lang='vi-VN'; u.voice=<giọng vi>; u.rate=0.9; u.pitch=1.0; u.volume=1.0; speechSynthesis.cancel(); speechSynthesis.speak(u);`
- `rate ≈ 0.9` (chậm vừa, dễ nghe cho bé). Không đọc quá nhanh.
- Luôn `cancel()` trước khi `speak()` câu mới để không chồng tiếng.
- Hủy đọc khi rời màn (về Trang chủ, sang câu khác).
- **Quyền riêng tư**: SpeechSynthesis tổng hợp giọng **cục bộ trên máy** (giọng hệ điều hành), KHÔNG gửi văn bản lên mạng trong cấu hình offline thông thường. Không cần micro, không xin quyền. Phù hợp luật "không thu thập dữ liệu".
- Tôn trọng `prefers-reduced-motion` không liên quan giọng nói, nhưng nếu bé/phụ huynh tắt "Đọc to" thì tôn trọng tuyệt đối.

---

## Phụ lục — mã chủ đề lớp 1 (để gắn `topic`, huy hiệu, màu icon-chip)

| Mã | Chủ đề | Emoji gợi ý | Màu icon-chip (pastel) |
|---|---|---|---|
| `t1` | Số đến 100 | 🔢 | `#EEF0FE` |
| `t2` | Phép cộng (≤100) | ➕ | `#E6F8EE` |
| `t3` | Phép trừ (≤100) | ➖ | `#FDECEF` |
| `t4` | Tính dãy & Điền số | 🧩 | `#FFF4DC` |
| `t5` | Độ dài (cm) | 📏 | `#E9F6FE` |
| `t6` | Xem giờ & Ngày trong tuần | 🕐 | `#EAF7EC` |
| `t7` | Toán có lời văn | 📖 | `#FFEFE6` |
| `t8` | Đố vui tư duy | 💡 | `#FCEFFB` |

> Lưu ý cho engine lớp 1: mọi số trong tầm lớp 1 (≤ 100). Câu hỏi NGẮN, ít chữ. Khuyến nghị cấp thêm trường `speak` (chuỗi đọc to thuần lời) cho các dạng có ký hiệu/hình.
