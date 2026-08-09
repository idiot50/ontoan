# Ôn Toán Tiểu học

Bộ công cụ và sản phẩm ôn luyện **Toán tiểu học (lớp 1, lớp 3 và ôn thi vào lớp 6)**, gồm các **website học Toán tương tác chạy offline** và các script hỗ trợ làm đề.

## 🌟 Website "Toán Vui Lớp 3" (sản phẩm chính)

Ứng dụng web **chạy hoàn toàn offline** (mở bằng Chrome/Edge, không cần internet/cài đặt), giúp bé tự ôn 9 mạch kiến thức Toán lớp 3 với câu hỏi sinh ngẫu nhiên, chấm điểm tức thì kèm lời giải, và hệ thống động viên (sao ⭐, chuỗi đúng 🔥, huy hiệu).

**Cách dùng:** mở [`web_toan_lop3/index.html`](web_toan_lop3/index.html) bằng trình duyệt (giữ `engine.js` cùng thư mục).

| Thư mục/Tệp | Nội dung |
|---|---|
| `web_toan_lop3/index.html` | Giao diện ứng dụng (HTML + CSS + JS nội tuyến) |
| `web_toan_lop3/engine.js` | Động cơ sinh câu hỏi 9 chủ đề kèm đáp án & lời giải |
| `web_toan_lop3/tests/` | Bộ test tự động (`node tests/run.mjs` → ~35k phép kiểm) |
| `web_toan_lop3/DESIGN.md` | Thiết kế UX & gamification, quy tắc an toàn trẻ em |
| `web_toan_lop3/REDESIGN.md` | Hệ thống thị giác "Hiện đại tươi sáng" (tokens + spec) |
| `web_toan_lop3/design_prototype.html` | Bản dựng tĩnh minh hoạ giao diện |

### 9 chủ đề
Số đến 100 000 · Cộng – Trừ · Nhân – Chia · Biểu thức & Tìm x · Chia có dư · Đo lường · Hình học · Toán có lời văn · Phát triển tư duy.

### Chạy test
```bash
cd web_toan_lop3
node tests/run.mjs      # hoặc: npm test
```

## 🎓 Website "Thi Lớp 5" — ôn thi vào lớp 6

Ứng dụng web **chạy offline** dành cho học sinh lớp 5 (~10–11 tuổi) luyện thi vào lớp 6:
tổng hợp kiến thức **lớp 4 – lớp 5 ở mức nâng cao**, sinh câu hỏi ngẫu nhiên kèm **lời giải từng bước**
theo cách trình bày tiểu học (sơ đồ đoạn thẳng, rút về đơn vị, giả thiết tạm…).

**Cách dùng:** mở [`web_thi_lop5/index.html`](web_thi_lop5/index.html) bằng trình duyệt (giữ `engine.js` cùng thư mục).

| Thư mục/Tệp | Nội dung |
|---|---|
| `web_thi_lop5/index.html` | Giao diện ứng dụng |
| `web_thi_lop5/engine.js` | Động cơ sinh câu hỏi 10 chủ đề kèm đáp án & lời giải |
| `web_thi_lop5/KIEN_THUC.md` | **Đặc tả nội dung** — tổng hợp từ 49 đề thi vào lớp 6 + đề cương lớp 4–5 |
| `web_thi_lop5/tests/` | Bộ test tự động (`node tests/run.mjs` → ~53k phép kiểm, gồm cả test giao diện headless) |

### 10 chủ đề
Số tự nhiên & tính nhanh · Phân số · Số thập phân · Đại lượng & đo lường · Tỉ số & phần trăm ·
Toán điển hình · Hình phẳng · Hình khối & thể tích · Toán chuyển động · Tư duy & suy luận.

Ba **tầng độ khó**: tầng 0 ≈ mức lớp 4, tầng 1 ≈ mức lớp 5, tầng 2 ≈ mức đề thi vào lớp 6
(tỉ số diện tích, bất biến chẵn–lẻ, nguyên lý Đi-rích-lê, dãy sai phân…).

### Chạy test
```bash
cd web_thi_lop5
node tests/run.mjs      # hoặc: npm test
```

Bộ test **tự giải lại 100% số câu engine sinh ra** bằng công thức viết độc lập rồi đối chiếu đáp án —
sai đáp án là lỗi nghiêm trọng nhất của phần mềm học toán.

## 📝 Công cụ làm đề & nội dung
- `build/` — script Node đọc PDF (render/tiling) và các nguồn HTML để xuất đề: `de_on_lop1.html`, `de_on_lop3.html`, bản đồ nội dung `ban_do_noi_dung_*.md`.
- `De_on_tap_cuoi_nam_Toan_lop_1.pdf`, `De_on_tap_cuoi_nam_Toan_lop_3.pdf` — đề ôn tập cuối năm đã biên soạn (đề + ma trận + hướng dẫn chấm).
- `.claude/agents/` — các subagent chuyên trách dùng để xây dựng & kiểm thử dự án (động cơ câu hỏi, frontend, UX, QA, test tự động, designer).

## ⚠️ Về bản quyền & nội dung không kèm theo
Repo này **không chứa** các quyển sách giáo khoa scan dùng làm nguồn tham khảo ("Hướng dẫn học Toán" Archimedes) vì lý do bản quyền; chúng chỉ được dùng cá nhân/giáo dục trên máy. Các ảnh render tạm và `node_modules` cũng được loại khỏi repo (xem `.gitignore`).

Mọi câu hỏi trong website được **sinh tự động bằng thuật toán** (không sao chép nguyên văn từ sách).
