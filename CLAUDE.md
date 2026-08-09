# Hướng dẫn dự án (toanlop3)

## Quy ước xử lý PDF (BẮT BUỘC)
Khi cần đọc / khai thác nội dung **một file PDF** trong dự án:

1. **KHÔNG** đọc thẳng PDF nhị phân. Hãy **chuyển PDF sang Markdown trước**, rồi
   làm việc trên file `.md`.
2. Việc chuyển đổi giao cho sub-agent **`pdf-to-markdown`** (xem
   `.claude/agents/pdf-to-markdown.md`) — sub-agent này dùng **MarkItDown của
   Microsoft**. Có thể gọi trực tiếp công cụ:
   ```bash
   bash build/pdf2md.sh "<đường_dẫn.pdf>" ["<đường_dẫn_ra.md>"]
   ```
   (mặc định xuất `.md` cạnh PDF, cùng tên).
3. Nếu PDF là bản **scan** (MarkItDown trích được rất ít text → cảnh báo `WARN`),
   chuyển sang dùng `build/tiles.mjs` để render trang ra ảnh PNG rồi đọc bằng mắt.

Chi tiết môi trường Python "ghép" trên máy này nằm trong wrapper `build/pdf2md.sh`.

## Làm việc với ĐỀ THI / trình tạo đề (BẮT BUỘC đọc trước khi sửa)
Trước khi đụng vào mức độ đề, engine sinh câu hỏi, hay hứa một con số độ khó nào
đó với người dùng: **đọc `tao_de/GHI_CHU_DE_THI.md`**.

Ba điều quan trọng nhất trong đó:
1. **KHÔNG chấm độ khó theo tên mạch** (mạch tên "tư duy" của lớp 1 lại là mạch dễ
   nhất đề). Đo bằng số bước tính đếm từ `explain` của engine.
2. **Dò trần độ khó trước khi hứa** — lớp 1 chỉ đạt tối đa ~1,64 lần mức dễ.
3. **Sửa engine gốc `web_toan_lop*/engine.js`**, không sửa bản copy trong
   `tao_de/engines/`; sửa xong chạy test app học → `sync_engines.mjs` →
   `builder.spec.mjs` → thẩm định bằng sub-agent `primary-assessment-reviewer`.

File đó cũng liệt kê **các vấn đề còn tồn đang chờ người dùng quyết** (lớp 1 sinh
phép có nhớ, lớp 3 có dạng tổng–hiệu của lớp 4, thiếu mạch thống kê–xác suất) —
**đừng tự ý sửa** vì đụng tới app học đang chạy.
