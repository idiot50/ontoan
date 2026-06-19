# Ôn Toán Tiểu học

Bộ công cụ và sản phẩm ôn luyện **Toán tiểu học (lớp 1 & lớp 3)**, gồm một **website học Toán lớp 3 tương tác** cho học sinh ~9 tuổi và các script hỗ trợ làm đề.

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

## 📝 Công cụ làm đề & nội dung
- `build/` — script Node đọc PDF (render/tiling) và các nguồn HTML để xuất đề: `de_on_lop1.html`, `de_on_lop3.html`, bản đồ nội dung `ban_do_noi_dung_*.md`.
- `De_on_tap_cuoi_nam_Toan_lop_1.pdf`, `De_on_tap_cuoi_nam_Toan_lop_3.pdf` — đề ôn tập cuối năm đã biên soạn (đề + ma trận + hướng dẫn chấm).
- `.claude/agents/` — các subagent chuyên trách dùng để xây dựng & kiểm thử dự án (động cơ câu hỏi, frontend, UX, QA, test tự động, designer).

## ⚠️ Về bản quyền & nội dung không kèm theo
Repo này **không chứa** các quyển sách giáo khoa scan dùng làm nguồn tham khảo ("Hướng dẫn học Toán" Archimedes) vì lý do bản quyền; chúng chỉ được dùng cá nhân/giáo dục trên máy. Các ảnh render tạm và `node_modules` cũng được loại khỏi repo (xem `.gitignore`).

Mọi câu hỏi trong website được **sinh tự động bằng thuật toán** (không sao chép nguyên văn từ sách).
