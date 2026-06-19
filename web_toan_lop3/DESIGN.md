# Tài liệu thiết kế UX — Website ôn Toán Lớp 3 cho bé ~9 tuổi

> Mục tiêu: **vui** và **khoa học (đúng sư phạm)**. Một trang web chạy offline (mở bằng Chrome/Edge), tiếng Việt, dùng cho **một bé** tự ôn ở nhà.
> Tài liệu này dành cho `frontend-web-toan-treem` dựng giao diện. Nội dung toán do giáo viên Toán + `ky-su-sinh-bai-toan` cấp; ở đây chỉ mô tả trải nghiệm, copy, màu, bố cục và luật an toàn.

Định dạng dữ liệu câu hỏi đã thống nhất (không đổi ở đây):
`question = { type:'mc'|'input', stem, choices?, answer, explain, topic }` — thêm trường `topic` (mã 1 trong 9 chủ đề) để gắn huy hiệu/tiến độ.

---

## 1. Sơ đồ luồng màn hình

```
              ┌─────────────────────────────────────────┐
              │            TRANG CHỦ                     │
              │  - Lời chào + tên app                    │
              │  - Mục tiêu hôm nay (thanh tiến độ)      │
              │  - 9 thẻ CHỦ ĐỀ (chọn → Luyện tập)       │
              │  - Nút lớn: "Ôn tập tổng hợp (10 câu)"   │
              │  - Góc: ⭐ tổng sao · 🔥 kỷ lục · 🔈 âm  │
              └───────────────┬─────────────────────────┘
                  chọn 1 chủ đề│            │ chọn Ôn tập tổng hợp
                              ▼            ▼
        ┌──────────────────────┐   ┌──────────────────────┐
        │  LÀM BÀI — Luyện tập │   │ LÀM BÀI — Ôn tập     │
        │  (vô hạn, 1 chủ đề)  │   │ (bộ ~10 câu trộn)    │
        └──────────┬───────────┘   └──────────┬───────────┘
                   │ (lặp từng câu)            │ (lặp 10 câu)
                   ▼                            ▼
         ┌───────────────────────────────────────────────┐
         │   Mỗi câu có 3 trạng thái nội bộ:              │
         │   (a) CHƯA TRẢ LỜI → (b) ĐÚNG hoặc (c) SAI     │
         └───────────────────────────────────────────────┘
                   │ Luyện tập: bấm Trang chủ để dừng    │ Ôn tập: hết câu thứ 10
                   ▼                                      ▼
        (về Trang chủ)                        ┌──────────────────────┐
                                              │      KẾT QUẢ         │
                                              │  Điểm/sao, đúng/sai, │
                                              │  huy hiệu mới, gợi ý │
                                              │  ôn lại chủ đề yếu   │
                                              └──────────┬───────────┘
                                                 │ Làm lại │ Trang chủ
                                                 ▼         ▼
```

### Mô tả từng trạng thái

**Trang chủ**
- Trạng thái mặc định khi mở app. Hiển thị tiến độ "Mục tiêu hôm nay: X/10 câu".
- Nếu hôm nay đã đạt mục tiêu → biểu ngữ nhỏ "Hôm nay con đã đạt mục tiêu! Chơi thêm nếu con thích 😊" (không ép, không khoá).

**Làm bài — CHƯA TRẢ LỜI (a)**
- Hiện câu hỏi + ô đáp án/4 nút chọn. Nút "Kiểm tra" **mờ/khoá** cho đến khi bé chọn hoặc nhập gì đó.
- Không có đồng hồ đếm ngược (không tạo áp lực). Có thể có đồng hồ đếm xuôi nhẹ chỉ để vui, mặc định ẩn.

**Làm bài — ĐÚNG (b)**
- Đáp án bé chọn tô **xanh lá**, hiện ✓. Câu khen ngẫu nhiên (mục 4). Cộng ⭐, tăng 🔥 streak.
- Hiện 1–2 dòng giải thích ngắn (`explain`). Hiệu ứng: sao bay/confetti nhẹ + âm "ting" (nếu bật âm).
- Nút "Câu tiếp theo →" xuất hiện, được auto-focus (Enter để đi tiếp).

**Làm bài — SAI (c)**
- Đáp án bé chọn tô **cam/đỏ nhạt** (KHÔNG đỏ gắt), đáp án đúng tô **xanh lá** kèm ✓. Reset 🔥 streak về 0 (nhẹ nhàng, có dòng "Chuỗi đặt lại, không sao đâu!").
- Hiện câu động viên (mục 4) + nút/khối "Xem cách làm" mở rộng phần `explain` từng bước.
- Không trừ sao. Nút "Câu tiếp theo →" xuất hiện. Ở chế độ Luyện tập có thêm nút "Làm câu tương tự" (xin câu mới cùng dạng) — tuỳ chọn.

**Làm bài — HẾT BÀI**
- Chỉ ở Ôn tập tổng hợp: sau câu thứ 10 tự chuyển sang màn Kết quả.
- Ở Luyện tập: không có "hết bài"; bé tự bấm Trang chủ. Mỗi 10 câu liên tiếp gợi ý nghỉ mắt (mục 6).

**Kết quả** (chỉ Ôn tập tổng hợp)
- Tổng điểm/sao, số đúng/sai, danh sách huy hiệu mới (nếu có), và **gợi ý 1 chủ đề nên ôn lại** dựa trên chủ đề sai nhiều nhất.
- Nút "Làm lại bộ mới", "Về trang chủ". Thông điệp theo mức điểm (mục 4).

---

## 2. Bố cục từng màn (mô tả khối + vị trí)

Khung chung: bố cục **một cột giữa** (max-width ~720px), nền sáng dịu, mọi thứ căn giữa để bé không phải đảo mắt nhiều.

### 2.1 Trang chủ
```
┌───────────────────────────────────────────────┐
│ [🏠 logo + Tên app]            [⭐ 128] [🔈/🔇]│  ← thanh trên (header), cố định
├───────────────────────────────────────────────┤
│  Xin chào! Hôm nay con muốn ôn gì?            │
│  ▓▓▓▓▓▓░░░░  Mục tiêu hôm nay: 6/10 câu        │  ← thanh tiến độ ngày
├───────────────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐                       │
│  │ 1 🔢│ │ 2 ➕│ │ 3 ✖️│  ...                  │  ← lưới 9 thẻ chủ đề
│  └─────┘ └─────┘ └─────┘     (3 cột x 3 hàng)  │
│  Mỗi thẻ: số thứ tự + icon + tên chủ đề        │
├───────────────────────────────────────────────┤
│  [ ▶ ÔN TẬP TỔNG HỢP — 10 câu trộn ]           │  ← nút lớn, nổi bật
│  [ 🏅 Bộ sưu tập huy hiệu ]                     │  ← nút phụ
└───────────────────────────────────────────────┘
```
- Header **luôn hiển thị** ở mọi màn: trái = logo + tên (bấm về Trang chủ), phải = tổng ⭐ và nút bật/tắt âm 🔈.

### 2.2 Màn Làm bài (Luyện tập & Ôn tập dùng chung khung)
```
┌───────────────────────────────────────────────┐
│ [🏠 Trang chủ]   ⭐12  🔥3   Câu 4/10   [🔈]   │  ← header + thanh trạng thái
│  ▓▓▓▓░░░░░░  (thanh tiến độ bộ — chỉ Ôn tập)   │
├───────────────────────────────────────────────┤
│                                                │
│   ┌─────────────────────────────────────────┐  │
│   │  CÂU HỎI (chữ to, có thể kèm hình minh   │  │  ← THẺ CÂU HỎI (giữa màn)
│   │  hoạ: đồng hồ, hình chữ nhật, tiền…)     │  │
│   │                                          │  │
│   │   ┌──────┐ ┌──────┐                      │  │
│   │   │ A 24 │ │ B 32 │   (mc: 4 nút lớn)    │  │  ← ô đáp án
│   │   └──────┘ └──────┘                      │  │
│   │   ┌──────┐ ┌──────┐                      │  │
│   │   │ C 18 │ │ D 40 │                      │  │
│   │   │  hoặc [   ____ nhập số ____ ] (input)│  │
│   └─────────────────────────────────────────┘  │
│                                                │
│   [  ✅ KIỂM TRA  ]                            │  ← khoá đến khi có lựa chọn
│   ── sau khi kiểm tra ──                       │
│   (vùng phản hồi: đúng/sai + giải thích)       │
│   [ Câu tiếp theo → ]   (xuất hiện sau kiểm tra)│
└───────────────────────────────────────────────┘
```
- Vị trí cố định: câu hỏi ở giữa-trên, đáp án ngay dưới câu hỏi, nút "Kiểm tra" ngay dưới đáp án (tay/mắt đi từ trên xuống).
- "Câu tiếp theo →" thay chỗ nút "Kiểm tra" sau khi đã chấm (không để cả hai cùng lúc gây rối).
- Thanh điểm/sao/streak nằm trong header, không che câu hỏi.
- Nút Trang chủ ở góc trái header (luôn thoát được, không bẫy).

### 2.3 Màn Kết quả (Ôn tập tổng hợp)
```
┌───────────────────────────────────────────────┐
│ [🏠 Trang chủ]                          [🔈]   │
├───────────────────────────────────────────────┤
│        🎉  Tuyệt vời!  (thông điệp theo mức)    │
│        Con đúng 8/10 câu                       │
│        ⭐ +16 sao   🔥 Chuỗi dài nhất: 5        │
│   ┌─────────────────────────────────────────┐  │
│   │ Huy hiệu mới: 🏅 Vua bảng nhân           │  │  ← nếu có
│   └─────────────────────────────────────────┘  │
│   Nên ôn thêm: ✖️ Nhân–chia (con sai 2 câu)    │  ← gợi ý chủ đề yếu
│   [ 🔁 Làm bộ mới ]   [ 🏠 Về trang chủ ]      │
└───────────────────────────────────────────────┘
```
- Tuỳ chọn: danh sách rút gọn "xem lại từng câu" (bấm để mở từng câu + đáp án đúng + giải thích) — không bắt buộc xem.

---

## 3. Hệ thống gamification lành mạnh

Nguyên tắc: **thi đua với chính mình**, thưởng tức thì, mốc nhỏ dễ đạt, không phạt nặng, không so sánh với người khác.

### 3.1 Sao ⭐
| Sự kiện | Sao |
|---|---|
| Trả lời đúng | +2 ⭐ |
| Đúng ngay lần đầu (không xem gợi ý) | +1 ⭐ thưởng thêm |
| Hoàn thành bộ Ôn tập 10 câu | +5 ⭐ |
| Đạt mục tiêu ngày (10 câu) | +5 ⭐ |
- Trả lời sai: **+0**, không trừ. Sao chỉ cộng dồn, không bao giờ mất.

### 3.2 Chuỗi đúng 🔥 + kỷ lục cá nhân
- Mỗi câu đúng liên tiếp tăng chuỗi +1; sai → chuỗi về 0 (kèm copy nhẹ nhàng).
- Lưu **kỷ lục chuỗi dài nhất** (localStorage). Khi phá kỷ lục: "Kỷ lục mới của con: 🔥 8 câu liền!".
- Mốc vui giữa chừng (chỉ khích lệ, không bắt buộc): 🔥3, 🔥5, 🔥10 → confetti nhỏ + câu khen.

### 3.3 Huy hiệu (gắn từng chủ đề) 🏅
Điều kiện đặt ở mức **dễ đạt nhưng có ý nghĩa** (khuyến khích ôn đủ 9 mạch). Mỗi huy hiệu đạt 1 lần, lưu vĩnh viễn.

| # | Chủ đề | Tên huy hiệu | Điều kiện đạt |
|---|---|---|---|
| 1 | Số đến 100 000 | 🔢 Chúa tể những con số | Đúng 15 câu (cộng dồn) chủ đề 1 |
| 2 | Cộng – trừ | ➕ Cao thủ cộng trừ | Đúng 8 câu liên tiếp ở chủ đề 2 |
| 3 | Nhân – chia | ✖️ Vua bảng nhân | Đúng 20 câu (cộng dồn) chủ đề 3 |
| 4 | Biểu thức & tìm x | 🧩 Thám tử ẩn số | Đúng 12 câu (cộng dồn) chủ đề 4 |
| 5 | Chia có dư | ➗ Bậc thầy chia dư | Đúng 10 câu (cộng dồn) chủ đề 5 |
| 6 | Đo lường & đại lượng | 📏 Thợ đo lường tài ba | Đúng 12 câu (cộng dồn) chủ đề 6 |
| 7 | Hình học (chu vi, diện tích) | 📐 Kiến trúc sư nhí | Đúng 10 câu (cộng dồn) chủ đề 7 |
| 8 | Toán có lời văn | 📖 Nhà giải đố lời văn | Đúng 10 câu (cộng dồn) chủ đề 8 |
| 9 | Đố vui tư duy | 💡 Nhà thông thái | Đúng 8 câu (cộng dồn) chủ đề 9 |
| — | Tổng hợp | 🌈 Đủ chín mạch | Có ít nhất 1 câu đúng ở **cả 9** chủ đề |
| — | Thói quen | 📅 Chăm chỉ mỗi ngày | Đạt mục tiêu ngày 5 ngày (không cần liên tiếp) |
| — | Ôn tập | 🎯 Nhà vô địch ôn tập | Đúng 9/10 trở lên trong 1 bộ Ôn tập |

- Màn "Bộ sưu tập huy hiệu": lưới các huy hiệu; chưa đạt hiện dạng xám + dòng "Làm thế nào để đạt" (gợi mở, không gây áp lực).

### 3.4 Mục tiêu mỗi ngày
- Mặc định **10 câu/ngày** (đếm tổng câu trả lời, đúng hay sai đều tính — để không khiến bé sợ sai).
- Thanh tiến độ ngày trên Trang chủ. Đạt mục tiêu → ăn mừng vừa phải + "Hôm nay xong rồi, con giỏi lắm!".
- **Không phạt khi bỏ ngày**, không "đốt streak ngày", không thông báo nhối thúc. Chỉ là cột mốc tự nguyện.

---

## 4. Bảng "copy" tiếng Việt (thân thiện bé 9 tuổi)

### 4.1 Tên app (gợi ý — chọn 1)
- **"Toán Vui Lớp 3"** (an toàn, rõ nghĩa) ✅ khuyến nghị mặc định
- "Phiêu Lưu Toán Học"
- "Vương Quốc Con Số"
- "Bé Yêu Toán"

Phụ đề/lời chào trang chủ: *"Xin chào nhà toán học nhí! Hôm nay con muốn ôn gì nào?"*

### 4.2 Câu khen khi ĐÚNG (chọn ngẫu nhiên)
1. "Chính xác! Con giỏi quá! 🎉"
2. "Tuyệt vời! Đúng rồi đó! ⭐"
3. "Quá đỉnh! Con làm đúng rồi!"
4. "Hoan hô! Bộ óc toán học của con đây rồi!"
5. "Xuất sắc! Thêm một câu đúng nữa nào!"
6. "Đúng boong! Con thật thông minh!"
7. "Giỏi lắm! Cứ thế phát huy nhé!"
8. "Yeah! Con đã làm được! 🌟"

### 4.3 Câu động viên khi SAI (kèm mời xem lời giải)
1. "Suýt nữa rồi! Cùng xem cách làm đúng nhé 👇"
2. "Không sao đâu, sai một chút là chuyện thường. Xem lời giải nào!"
3. "Gần đúng rồi! Mình xem lại cách làm một chút nhé."
4. "Sai cũng là đang học đó! Đáp án đúng là đây 👇"
5. "Đừng lo nha, ai cũng có lúc nhầm. Cùng xem giải thích nhé!"
6. "Lần này chưa đúng, nhưng con sẽ làm được! Xem cách làm này 👇"
7. "Cố lên! Đọc lời giải xong là con hiểu ngay thôi."
8. "Chưa đúng, nhưng không sao cả. Mình học cách làm rồi thử lại nhé!"

Nhãn nút mở giải thích: **"Xem cách làm"** / khi mở: **"Ẩn cách làm"**.
Khi reset streak: *"Chuỗi đặt lại rồi, nhưng không sao đâu — bắt đầu chuỗi mới nào!"*

### 4.4 Nhãn nút (đồng nhất toàn app)
| Chức năng | Nhãn |
|---|---|
| Chấm câu | "✅ Kiểm tra" |
| Đi tiếp | "Câu tiếp theo →" |
| Về nhà | "🏠 Trang chủ" |
| Bắt đầu ôn tập | "▶ Ôn tập tổng hợp" |
| Làm lại bộ | "🔁 Làm bộ mới" |
| Bật/tắt âm | "🔈 Âm thanh" / "🔇 Đã tắt" |
| Câu cùng dạng | "Thử câu tương tự" |
| Huy hiệu | "🏅 Huy hiệu của con" |

### 4.5 Thông điệp màn Kết quả theo mức điểm (trên 10 câu)
| Số câu đúng | Thông điệp |
|---|---|
| 10/10 | "🏆 Hoàn hảo! Con đúng cả 10 câu! Quá tuyệt vời!" |
| 8–9 | "🎉 Giỏi lắm! Con làm rất tốt!" |
| 6–7 | "😊 Khá lắm! Con đang tiến bộ rồi đó!" |
| 4–5 | "💪 Cố lên nhé! Ôn thêm một chút là con sẽ giỏi hơn!" |
| 0–3 | "🌱 Không sao đâu! Mình cùng ôn lại từ từ, con làm được mà!" |

Dòng gợi ý ôn lại: *"Nên ôn thêm: [tên chủ đề sai nhiều nhất] nhé!"* (chỉ hiện khi có câu sai; tránh giọng chê).

---

## 5. Hướng dẫn phong cách hình ảnh (cho frontend)

### 5.1 Bảng màu (hex, tương phản cao, vui mắt)
| Vai trò | Màu | Hex | Ghi chú |
|---|---|---|---|
| Nền chính | Trắng ngà dịu | `#FFFDF7` | dịu mắt, không trắng chói |
| Nền thẻ | Trắng | `#FFFFFF` | viền bo tròn 16px, đổ bóng nhẹ |
| Chữ chính | Xanh than | `#1F2A44` | trên nền sáng đạt tương phản cao |
| Màu thương hiệu / nút chính | Xanh dương vui | `#2D7DD2` | nút Kiểm tra, nhấn mạnh |
| Đúng | Xanh lá | `#2E9E5B` | nền `#E4F6EA` cho vùng đúng |
| Sai (nhẹ nhàng) | Cam | `#E8743B` | nền `#FCEDE3`; **không** dùng đỏ gắt |
| Đáp án đúng (khi chấm) | Xanh lá đậm | `#1E7A45` | |
| Sao / thưởng | Vàng | `#F5B82E` | |
| Streak 🔥 | Cam đỏ | `#F26430` | |
| Phụ / viền | Xám nhạt | `#D7DCE3` | |

Yêu cầu tương phản: mọi cặp chữ/nền đạt **WCAG AA** (≥ 4.5:1 cho chữ thường, ≥ 3:1 cho chữ to ≥ 24px). Không truyền tải thông tin **chỉ bằng màu** — luôn kèm biểu tượng (✓ / ✗) và chữ.

### 5.2 Font & cỡ chữ
- Ưu tiên sans-serif tròn trịa, dễ đọc, có sẵn trên Windows: `"Segoe UI", "Comic Sans MS", Arial, sans-serif`. (Times New Roman dùng dự phòng cho ký hiệu × ÷ ² nếu cần, nhưng không làm font chính.)
- Cỡ chữ tối thiểu: **18px** cho chữ thường; câu hỏi **24–28px**; tiêu đề **32px+**; số trong đáp án to, đậm.
- `line-height` ≥ 1.5; tránh chữ in hoa toàn bộ (khó đọc với trẻ).

### 5.3 Kích thước nút & vùng chạm
- Vùng chạm tối thiểu **48×48px** (nút chính cao ~56px). Khoảng cách giữa các nút đáp án ≥ 12px (tránh bấm nhầm).
- Nút bo tròn 12–16px, có trạng thái hover/focus rõ (viền/đổ bóng), focus-visible rõ cho điều hướng bàn phím.

### 5.4 Hiệu ứng & âm thanh
- **Confetti** khi: trả lời đúng (nhẹ), đạt mốc streak, hoàn thành bộ, đạt huy hiệu. Thời lượng ngắn (< 1.5s), không che nút.
- **Âm thanh** (Web Audio, không cần file ngoài): "ting" đúng, "bloop" nhẹ khi sai (không the thé), "fanfare" ngắn khi đạt mốc.
- **Nút bật/tắt âm** ở header, trạng thái lưu trong localStorage; **mặc định BẬT nhưng âm lượng vừa**. Cân nhắc mặc định tắt nếu lo ồn — để frontend quyết định, miễn có nút.
- **Tránh nhấp nháy mạnh**: không nhấp nháy > 3 lần/giây (rủi ro động kinh ánh sáng). Tôn trọng `prefers-reduced-motion`: nếu bật thì giảm/tắt confetti và chuyển động lớn, chỉ giữ phản hồi tĩnh (màu + ✓/✗).

---

## 6. Quy tắc AN TOÀN TRẺ EM (BẮT BUỘC — frontend phải tuân thủ)

1. **Không quảng cáo** dưới mọi hình thức (banner, popup, "tài trợ", gợi ý mua hàng).
2. **Không mua bán trong app**, không tiền tệ thật, không "mở khoá bằng tiền".
3. **Không link/điều hướng ra ngoài** Internet; app chạy hoàn toàn offline. Không nhúng iframe/CDN/tài nguyên mạng.
4. **Không thu thập dữ liệu cá nhân**: không hỏi tên thật, tuổi, trường, ảnh, vị trí. Biệt danh (nếu có) là tuỳ chọn và chỉ lưu **localStorage** tại máy. Mọi dữ liệu ra ngoài chỉ khi phụ huynh đồng ý qua `backend-luu-tien-do`.
5. **Không dark pattern**: không đếm ngược tạo áp lực gắt; không phạt/đe doạ khi nghỉ; không "đốt streak" gây lo lắng; không thông báo đẩy hối thúc quay lại; luôn có nút Trang chủ/thoát rõ ràng ở mọi màn.
6. **Phản hồi mang tính phát triển**: khi sai chỉ ra cách làm đúng, mời ôn lại phần yếu; tuyệt đối không chê bai, không xếp hạng so với người khác.
7. **Gợi ý nghỉ mắt**: sau mỗi ~10 câu hoặc ~15 phút liên tục, hiện nhắc nhẹ "Con nghỉ mắt 20 giây nhé, nhìn ra xa cho đỡ mỏi 👀" — chỉ gợi ý, không khoá màn hình.
8. **Hỗ trợ bàn phím**: Tab di chuyển, Enter = Kiểm tra/Câu tiếp theo, phím **1–4** chọn đáp án trắc nghiệm, focus-visible rõ ràng. Mọi thao tác chuột đều làm được bằng bàn phím.
9. **Tương phản WCAG AA** cho toàn bộ chữ/biểu tượng; cho phép phóng to trình duyệt không vỡ layout; thông tin không phụ thuộc duy nhất vào màu.
10. **Khả năng đọc màn hình cơ bản**: `lang="vi"`, `alt`/`aria-label` cho icon và hình minh hoạ, vùng phản hồi đúng/sai có `aria-live="polite"` để đọc to kết quả.
11. **Tôn trọng `prefers-reduced-motion`** và có **nút tắt âm**; mặc định không có âm thanh/hiệu ứng gây giật mình.
12. **An toàn dữ liệu cục bộ**: nếu localStorage hỏng/trống, app vẫn chạy (giá trị mặc định), không treo, không mất màn hình.

---

## Phụ lục — mã chủ đề (để gắn `topic` & huy hiệu)
`t1` Số đến 100 000 · `t2` Cộng–trừ · `t3` Nhân–chia · `t4` Biểu thức & tìm x · `t5` Chia có dư · `t6` Đo lường & đại lượng · `t7` Hình học · `t8` Toán có lời văn · `t9` Đố vui tư duy.
