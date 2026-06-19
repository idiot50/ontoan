# SPEC — NÂNG ĐỘ KHÓ TOÀN BỘ CHỦ ĐỀ (Lớp 1 & Lớp 3)

> Mục tiêu: hai website ôn Toán đang bị chê BÀI QUÁ DỄ. Tài liệu này định nghĩa
> cách nâng độ khó **đúng tầm lớp** cho TỪNG chủ đề hiện có, để kỹ sư engine
> triển khai trực tiếp. Lấy PHONG CÁCH tư duy của đề thi vào lớp 6
> (`d:\lop6\KIEN_THUC_TONG_HOP.md`: nhiều bước, suy luận ngược, tính khéo, quy
> luật, logic, trồng cây, đếm) rồi **HẠ xuống** đúng tầm mỗi lớp.
>
> Mọi đáp án trong file đã được **tự giải lại và kiểm tra bằng code** (đúng 100%).
> Quy ước câu hỏi giữ nguyên "giao kèo dữ liệu" của engine:
> `{ type:'mc'|'input', topic, stem, choices?, answer, explain[, say] }`.
> Lớp 1 vẫn BẮT BUỘC có `say` (đọc to). `answer` của `mc` là INDEX; của `input`
> là chuỗi (số, hoặc dãy ngăn cách `;`, hoặc "thương dư số_dư").

---

## NGUYÊN TẮC CHUNG (áp dụng cả 2 lớp)

- **Giữ tỉ lệ hỗn hợp, KHÔNG làm câu nào cũng cực khó** (chống nản). Mỗi chủ đề
  chia 3 tầng: **Cơ bản / Nâng vừa / Thử thách**. Engine random theo trọng số
  bên dưới — luôn còn câu vừa sức xen kẽ.
- **Suy luận ngược** = cho kết quả, tìm dữ kiện đầu vào (đảo chiều phép tính).
- **Nhiều bước** = 2–3 phép tính nối nhau, dữ kiện phải rõ ràng, không gài bẫy
  ngôn ngữ.
- **Distractor phải là "bẫy lỗi điển hình"** (sai thứ tự phép tính, quên bước 2,
  nhầm cộng/trừ, lệch hàng) — KHÔNG phải số ngẫu nhiên vô nghĩa.
- Đề **ngắn gọn**, một câu hỏi rõ một yêu cầu. Lớp 1 câu cực ngắn.
- Đáp án LUÔN tính bằng code; ràng buộc kiểm tra TRƯỚC khi sinh (không sinh số âm,
  chia phải hết khi cần, v.v.).

---

# PHẦN A — LỚP 3 (số ≤ 100 000; chỉ +, −, ×, ÷ gồm chia có dư)

Trọng số tầng đề xuất mỗi chủ đề: **Cơ bản 45% · Nâng vừa 40% · Thử thách 15%**
(khớp tinh thần đề mặc định lớp 3: 50% cơ bản / 30% thông hiểu / 15% vận dụng /
5% vận dụng cao).

---

## A1. `so-100000` — Số đến 100 000

**1. Hiện đang dễ ở chỗ nào:** chỉ đọc/viết/so sánh/liền trước–sau từng số riêng
lẻ, một thao tác một câu, không có suy luận.

**2. Nâng khó bằng cách:**
- Giá trị chữ số **kết hợp ràng buộc** ("chữ số 7 có giá trị 7000 thì nó ở hàng
  nào / số có dạng nào").
- **Suy luận ngược + chặn:** "số tròn nghìn lớn nhất mà bé hơn N", "số chẵn chục
  nghìn", "số lớn nhất có 5 chữ số khác nhau lập từ các thẻ".
- **Lập số** từ các thẻ chữ số (lớn nhất / bé nhất, có/không lặp; 0 không đứng đầu).
- So sánh/sắp xếp **5 số** thay vì 4; xen số gần nhau (cùng hàng chục nghìn) để
  bắt so sánh từng hàng.
- Distractor: lấy chính chữ số thay vì giá trị; lệch một bậc hàng; đảo thứ tự
  sắp xếp.

**3. Ví dụ (đã tự giải):**

- *(mc)* "Số **45 000** có chữ số 4 ở hàng nào và giá trị bao nhiêu?"
  Choices: `["Hàng chục nghìn, giá trị 40 000", "Hàng nghìn, giá trị 4 000", "Hàng nghìn, giá trị 40 000", "Hàng chục nghìn, giá trị 4 000"]`
  → **Đáp án: A** (hàng chục nghìn, 4 × 10 000 = 40 000).
- *(input)* "Số tròn nghìn lớn nhất mà bé hơn **32 850** là số nào?"
  → **Đáp án: 32000**. Giải: 32 850 nằm giữa 32 000 và 33 000; số tròn nghìn lớn
  nhất còn nhỏ hơn nó là 32 000.
- *(input)* "Từ bốn thẻ chữ số **8, 0, 5, 3** (mỗi thẻ dùng một lần) hãy lập số
  có **bốn chữ số lớn nhất**." → **Đáp án: 8530** (xếp giảm dần: 8,5,3,0).
- *(input)* "Sắp xếp từ bé đến lớn (ngăn cách bởi `;`): **31 240; 31 420; 31 204; 31 402; 31 024**."
  → **Đáp án: 31024;31204;31240;31402;31420**.

**4. Mức độ:** đọc/viết/liền trước–sau/so sánh 4 số = Cơ bản; giá trị chữ số kết
hợp, sắp xếp 5 số = Nâng vừa; lập số từ thẻ + "tròn nghìn lớn nhất bé hơn N" =
Thử thách.

---

## A2. `cong-tru` — Cộng – Trừ trong 100 000

**1. Hiện đang dễ ở chỗ nào:** chỉ một phép `a + b` hoặc `a − b` rồi chọn đáp án.

**2. Nâng khó bằng cách:**
- **Chuỗi 3 số** `a + b − c` / `a − b + c` (vẫn ≤ 100 000, mọi bước ≥ 0).
- **Suy luận ngược 2 dữ kiện** không dùng tên "tổng–hiệu": "Hai số cộng lại được
  T. Một số là M. Số kia bao nhiêu?" (giải bằng T − M).
- **Tính khéo bằng cách ghép tròn chục/tròn trăm**: `36 + 18 + 64 + 82` ghép
  (36+64)+(18+82).
- Bài "biết tổng và biết phần lớn hơn phần kia bao nhiêu" → giải 2 bước bằng + và
  ÷ 2 (KHÔNG gọi tên công thức tổng–hiệu, chỉ trình bày bước).
- Distractor: làm sai dấu ở bước 2 (`a + b + c`), quên trừ c, lệch ±10/±100 (quên
  nhớ).

**3. Ví dụ (đã tự giải):**

- *(mc)* "Tính: **12 000 + 8 500 − 6 300**"
  Choices: `["14 200", "26 800", "9 800", "14 300"]` → **Đáp án: A (14 200)**.
  Giải: 12 000 + 8 500 = 20 500; 20 500 − 6 300 = 14 200. (Distractor 26 800 =
  cộng nhầm cả c.)
- *(input)* "Hai số cộng lại được **47 200**. Số thứ nhất là **25 800**. Số thứ
  hai là bao nhiêu?" → **Đáp án: 21400** (47 200 − 25 800).
- *(mc)* "Tính nhanh: **36 + 18 + 64 + 82**"
  Choices: `["200", "180", "198", "210"]` → **Đáp án: A (200)**.
  Giải: (36 + 64) + (18 + 82) = 100 + 100 = 200.

**4. Mức độ:** một phép +/− = Cơ bản; chuỗi 3 số & tính khéo ghép tròn = Nâng vừa;
suy luận ngược 2 dữ kiện = Thử thách.

---

## A3. `nhan-chia` — Nhân – Chia

**1. Hiện đang dễ ở chỗ nào:** một phép nhân/chia đơn (bảng, hoặc nhiều chữ số ×/÷
một chữ số), không nối bước.

**2. Nâng khó bằng cách:**
- **2 bước:** `(a × b) ÷ c` hoặc `(a ÷ b) × c` với số đẹp, chia hết (tích ≤
  100 000).
- **Suy luận ngược:** "Số nào nhân 8 được 5 624?" (5 624 ÷ 8); "Số bị chia là bao
  nhiêu nếu chia 7 được thương 9 (chia hết)?".
- **So sánh hai tích/thương** điền dấu: `125 × 4 ___ 250 × 2`.
- **Gấp – kết hợp:** "An có 8, Bình gấp 3 lần An, cả hai có mấy?" (8 + 8×3).
- Distractor: cộng thay nhân; quên bước 2; lệch một chữ số trong tích.

**3. Ví dụ (đã tự giải):**

- *(mc)* "Tính: **1 250 × 6 ÷ 5**"
  Choices: `["1 500", "1 250", "7 500", "1 450"]` → **Đáp án: A (1 500)**.
  Giải: 1 250 × 6 = 7 500; 7 500 ÷ 5 = 1 500. (Distractor 7 500 = quên bước chia.)
- *(input)* "Số nào nhân với **8** thì được **5 624**?" → **Đáp án: 703**
  (5 624 ÷ 8 = 703; thử lại 703 × 8 = 5 624).
- *(mc)* "An có 8 viên bi. Bình có số bi gấp 3 lần An. Cả hai bạn có tất cả bao
  nhiêu viên bi?" Choices: `["32", "24", "11", "27"]` → **Đáp án: A (32)**.
  Giải: Bình 8 × 3 = 24; cả hai 8 + 24 = 32.

**4. Mức độ:** bảng & một phép ×/÷ = Cơ bản; 2 bước & so sánh hai tích = Nâng vừa;
suy luận ngược + gấp–kết hợp = Thử thách.

---

## A4. `bieu-thuc` — Biểu thức & Tìm x

**1. Hiện đang dễ ở chỗ nào:** biểu thức chỉ 2 phép tính; tìm x một bước.

**2. Nâng khó bằng cách:**
- **3 phép tính, có ngoặc:** `(a + b) × c − d`, `a × b + c × d`, `m ÷ (p × q) + r`.
- **Tìm x 2 bước:** `x × a + b = T`, `(x − a) × b = T` (x là số tự nhiên đẹp).
- Distractor cố tình **sai thứ tự** (cộng trước khi nhân; bỏ ngoặc).

**3. Ví dụ (đã tự giải):**

- *(mc)* "Tính giá trị biểu thức: **(24 + 16) × 5 − 18**"
  Choices: `["182", "200", "218", "122"]` → **Đáp án: A (182)**.
  Giải: 24 + 16 = 40; 40 × 5 = 200; 200 − 18 = 182. (Distractor 200 = quên trừ.)
- *(mc)* "Tính: **96 ÷ (2 × 4) + 7**"
  Choices: `["19", "55", "12", "199"]` → **Đáp án: A (19)**.
  Giải: 2 × 4 = 8; 96 ÷ 8 = 12; 12 + 7 = 19.
- *(input)* "Tìm x: **(x + 5) × 4 = 60**" → **Đáp án: 10**.
  Giải: x + 5 = 60 ÷ 4 = 15; x = 15 − 5 = 10.

**4. Mức độ:** biểu thức 2 phép & tìm x một bước = Cơ bản; 3 phép có ngoặc = Nâng
vừa; tìm x 2 bước = Thử thách.

---

## A5. `chia-du` — Chia có dư

**1. Hiện đang dễ ở chỗ nào:** chỉ "đặt tính rồi tính" một phép chia có dư, nêu
"thương dư số dư".

**2. Nâng khó bằng cách:**
- **Bài toán thực tế dùng phần dư để quyết định** (làm tròn LÊN): "Mỗi xe chở
  được 8 bạn, có 50 bạn, cần ít nhất mấy xe?" (50 ÷ 8 = 6 dư 2 → **7 xe**).
- **Suy luận ngược:** "Phép chia cho 6 được thương 124 và dư 5. Số bị chia là bao
  nhiêu?" (124 × 6 + 5).
- **Đếm số đủ nhóm / số còn lại:** "100 cái bánh xếp mỗi hộp 6 cái, được mấy hộp
  đầy và thừa mấy cái?".
- Distractor: lấy thương mà bỏ phần dư (chọn 6 xe thay vì 7); số dư ≥ số chia.

**3. Ví dụ (đã tự giải):**

- *(mc)* "Mỗi xe chở được 8 bạn. Có 50 bạn đi tham quan. Cần ít nhất mấy xe để
  chở hết?" Choices: `["7 xe", "6 xe", "8 xe", "5 xe"]` → **Đáp án: A (7 xe)**.
  Giải: 50 ÷ 8 = 6 (dư 2). 6 xe chở 48 bạn, còn 2 bạn nên cần thêm 1 xe → 7 xe.
- *(input)* "Một phép chia cho **6** được thương **124** và số dư **5**. Số bị
  chia là bao nhiêu?" → **Đáp án: 749** (124 × 6 + 5 = 744 + 5 = 749).
- *(input — dạng "thương dư số_dư")* "Đặt tính rồi tính: **100 ÷ 6**"
  → **Đáp án: 16 dư 4** (16 × 6 + 4 = 100; 4 < 6).

**4. Mức độ:** một phép chia có dư = Cơ bản; bài toán "cần mấy xe / mấy hộp đầy" =
Nâng vừa; suy luận ngược tìm số bị chia = Thử thách.

---

## A6. `do-luong` — Đo lường (độ dài, khối lượng, thời gian, tiền, lít, xem giờ)

**1. Hiện đang dễ ở chỗ nào:** chỉ một phép đổi đơn vị, hoặc một phép cộng, mỗi
câu một thao tác.

**2. Nâng khó bằng cách:**
- **Đổi rồi tính / so sánh 2 bước:** đổi 2 số đo hỗn hợp về cùng đơn vị rồi cộng
  hoặc tìm hiệu.
- **Tiền 2 mệnh giá:** "3 tờ 20 000đ và 2 tờ 5 000đ, tất cả bao nhiêu?"; hoặc bài
  mua hàng – trả tiền – tính tiền thừa (≤ 100 000đ, kết quả dương).
- **Khoảng thời gian** giữa 2 mốc giờ–phút (cùng buổi): "Từ 8 giờ 40 phút đến 10
  giờ 15 phút là bao nhiêu phút?".
- Distractor: đổi sai bậc (×10 thay ×100); cộng nhầm mệnh giá; quên đổi một số đo.

**3. Ví dụ (đã tự giải):**

- *(mc)* "Đổi rồi tính: **3 m 5 cm − 2 m 40 cm = … cm**"
  Choices: `["65 cm", "35 cm", "135 cm", "63 cm"]` → **Đáp án: A (65 cm)**.
  Giải: 3 m 5 cm = 305 cm; 2 m 40 cm = 240 cm; 305 − 240 = 65 cm.
- *(mc)* "Mẹ đưa 3 tờ tiền loại 20 000 đồng và 2 tờ loại 5 000 đồng. Mẹ có tất cả
  bao nhiêu đồng?" Choices: `["70 000 đồng", "60 000 đồng", "25 000 đồng", "65 000 đồng"]`
  → **Đáp án: A (70 000 đồng)**. Giải: 3 × 20 000 = 60 000; 2 × 5 000 = 10 000;
  60 000 + 10 000 = 70 000.
- *(input)* "Bé bắt đầu học lúc **8 giờ 40 phút**, học xong lúc **10 giờ 15 phút**.
  Bé học trong bao nhiêu phút?" → **Đáp án: 95** phút.
  Giải: từ 8 giờ 40 đến 9 giờ 40 là 60 phút; 9 giờ 40 đến 10 giờ 15 là 35 phút;
  60 + 35 = 95 phút.

**4. Mức độ:** một phép đổi/cộng đơn vị = Cơ bản; đổi rồi tính, tiền 2 mệnh giá,
khoảng thời gian = Nâng vừa; mua hàng – tiền thừa nhiều bước = Thử thách.

---

## A7. `hinh-hoc` — Hình học (chu vi & diện tích HCN, HV)

**1. Hiện đang dễ ở chỗ nào:** thay số vào một công thức duy nhất (chu vi HOẶC
diện tích) cho một hình.

**2. Nâng khó bằng cách:**
- **2 bước / so sánh 2 hình:** tính diện tích HCN rồi trừ diện tích HV cắt ra;
  hoặc so sánh chu vi hai hình.
- **Suy luận ngược ghép điều kiện:** "HCN có chu vi 48 cm, chiều dài hơn chiều
  rộng 6 cm. Tìm chiều dài, chiều rộng" → giải bằng bước: nửa chu vi = 24; chiều
  dài = (24 + 6) ÷ 2 = 15; rộng = 9 (KHÔNG gọi tên công thức tổng–hiệu).
- **Đếm số hình vuông / số viên gạch lát:** diện tích nền ÷ diện tích một viên.
- Distractor: nhầm chu vi với diện tích; quên ×2; quên bước trừ.

**3. Ví dụ (đã tự giải):**

- *(mc)* "Một mảnh bìa hình chữ nhật dài 8 cm, rộng 5 cm. Người ta cắt ra một
  hình vuông cạnh 5 cm. Phần bìa còn lại có diện tích bao nhiêu?"
  Choices: `["15 cm²", "40 cm²", "25 cm²", "65 cm²"]` → **Đáp án: A (15 cm²)**.
  Giải: S HCN = 8 × 5 = 40; S HV = 5 × 5 = 25; còn lại 40 − 25 = 15 cm².
- *(input)* "Hình chữ nhật có chu vi **48 cm**, chiều dài hơn chiều rộng **6 cm**.
  Chiều dài là bao nhiêu cm?" → **Đáp án: 15**.
  Giải: nửa chu vi = 48 ÷ 2 = 24; chiều dài = (24 + 6) ÷ 2 = 15 cm (rộng = 9 cm).
- *(mc)* "Nền phòng hình vuông cạnh 4 m. Mỗi viên gạch hình vuông cạnh 1 m. Cần
  bao nhiêu viên gạch để lát kín nền?" Choices: `["16 viên", "8 viên", "4 viên", "12 viên"]`
  → **Đáp án: A (16 viên)**. Giải: diện tích nền 4 × 4 = 16 m²; mỗi viên 1 m² →
  16 viên.

**4. Mức độ:** một công thức chu vi/diện tích = Cơ bản; biết chu vi & 1 cạnh tìm
cạnh kia, đếm viên gạch = Nâng vừa; cắt hình tính phần còn lại, ghép điều kiện
chu vi + hiệu hai cạnh = Thử thách.

---

## A8. `loi-van` — Toán có lời văn

**1. Hiện đang dễ ở chỗ nào:** chủ yếu một bước (thêm/bớt/nhiều hơn/ít hơn/gấp/
giảm); bài "hai bước" hiện tại thực chất là một phép nhân cộng dữ kiện rời.

**2. Nâng khó bằng cách:**
- **Bài 2–3 bước thật sự** (kết quả bước 1 là dữ kiện bước 2): "Có 6 hộp, mỗi hộp
  12 cái; bán đi 15 cái; còn lại?".
- **Rút về đơn vị 2 bước:** "5 quyển vở giá 30 nghìn; hỏi 8 quyển cùng loại giá
  bao nhiêu?" (1 quyển 6 nghìn → 8 × 6 = 48).
- **Trộn phép:** gấp rồi cộng, chia rồi trừ, nhiều hơn rồi gộp.
- **Suy luận ngược trong lời văn:** "Sau khi cho đi 12 cái, An còn 23 cái. Lúc đầu
  An có bao nhiêu?" (23 + 12).
- Distractor (nếu dùng mc): dừng ở bước 1; sai phép bước 2.

**3. Ví dụ (đã tự giải):**

- *(input)* "Một cửa hàng có **6 hộp** bút, mỗi hộp **12 cái**. Cửa hàng bán đi
  **15 cái**. Hỏi còn lại bao nhiêu cái bút?" → **Đáp án: 57**.
  Giải: 6 × 12 = 72; 72 − 15 = 57 cái.
- *(input)* "Mua **5 quyển vở** hết **30 nghìn đồng**. Hỏi mua **8 quyển** cùng
  loại hết bao nhiêu nghìn đồng?" → **Đáp án: 48**.
  Giải: 1 quyển 30 ÷ 5 = 6 nghìn; 8 quyển 6 × 8 = 48 nghìn đồng.
- *(input)* "Sau khi cho bạn **12 viên bi**, Nam còn lại **23 viên**. Hỏi lúc đầu
  Nam có bao nhiêu viên bi?" → **Đáp án: 35** (23 + 12).

**4. Mức độ:** một bước (thêm/bớt/nhiều–ít hơn) = Cơ bản; 2 bước nhân–cộng/rút về
đơn vị = Nâng vừa; trộn phép & suy luận ngược lời văn = Thử thách.

---

## A9. `tu-duy` — Phát triển tư duy

**1. Hiện đang dễ ở chỗ nào:** tính nhanh `a×c+b×c` đơn giản; dãy cộng/nhân đều
hiển nhiên; "tìm x biết a < x < a+2" chỉ có 1 đáp án quá lộ.

**2. Nâng khó bằng cách:**
- **Tính nhanh khéo hơn:** ghép thừa số `4 × 7 × 25` (= 7 × 100); phân phối
  `25 × 8 + 25 × 2 = 25 × 10`.
- **Dãy quy luật phức hơn:** sai phân tăng dần (cộng 1,2,3,4…), quy tắc "×k rồi
  +c" (vd `×2 +1`), dãy xen kẽ hai quy luật.
- **Trồng cây (đếm khoảng) dạng đơn giản:** "Trồng cây hai đầu một đoạn đường dài
  20 m, hai cây liền nhau cách 4 m. Cần mấy cây?" (20 ÷ 4 + 1 = 6).
- **Đếm có điều kiện:** "Có bao nhiêu số tròn chục từ 10 đến 50?" / "bao nhiêu số
  chia hết cho 5 trong khoảng cho trước" (KHÔNG dùng từ "chẵn/lẻ").
- **Suy luận ngược nhiều bước (toán nghĩ số):** "Nghĩ một số, nhân 3 rồi cộng 4
  được 25. Số đó là mấy?" ((25 − 4) ÷ 3 = 7).
- Distractor: dùng quy luật sai (chỉ cộng đều khi thật ra nhân); cộng/nhân trực
  tiếp không phân phối; quên +1 trong trồng cây.

**3. Ví dụ (đã tự giải):**

- *(mc)* "Tính nhanh: **4 × 7 × 25**"
  Choices: `["700", "175", "350", "650"]` → **Đáp án: A (700)**.
  Giải: 4 × 25 = 100; 100 × 7 = 700.
- *(input)* "Tìm số tiếp theo của dãy: **2; 5; 11; 23; …**" → **Đáp án: 47**.
  Giải: quy luật mỗi số = số trước × 2 + 1 (2×2+1=5; 5×2+1=11; 11×2+1=23;
  23×2+1=47).
- *(input)* "Trồng cây ở **cả hai đầu** một đoạn đường thẳng dài **20 m**, hai cây
  liền nhau cách nhau **4 m**. Cần trồng tất cả bao nhiêu cây?" → **Đáp án: 6**.
  Giải: số khoảng = 20 ÷ 4 = 5; trồng cả hai đầu nên số cây = số khoảng + 1 = 6.
- *(input)* "Nghĩ một số. Lấy số đó nhân với 3 rồi cộng thêm 4 thì được 25. Số đã
  nghĩ là bao nhiêu?" → **Đáp án: 7**. Giải: 25 − 4 = 21; 21 ÷ 3 = 7
  (thử lại 7 × 3 + 4 = 25).

**4. Mức độ:** tính nhanh phân phối quen & dãy cộng đều = Cơ bản; dãy "×k+c" / sai
phân, đếm điều kiện = Nâng vừa; trồng cây, nghĩ số nhiều bước = Thử thách.

---

# PHẦN B — LỚP 1 (số ≤ 100; chỉ +, −; KHÔNG nhân/chia; KHÔNG nói "chẵn/lẻ")

Trọng số tầng đề xuất mỗi chủ đề: **Cơ bản 60% · Nâng vừa 30% · Thử thách 10%**
(bám đề mặc định lớp 1: 70% cơ bản / 20% vận dụng nhẹ / 10% phân hóa). Đề CỰC NGẮN,
mỗi câu một ý, để bé 6 tuổi không nản. `say` bắt buộc, dạng "thử thách" vẫn phải
đọc to được tự nhiên.

---

## B1. `so-100` — Số đến 100

**1. Hiện đang dễ ở chỗ nào:** đếm/đọc/liền trước–sau/so sánh từng số; liệt kê
khoảng nhỏ; mỗi câu một thao tác.

**2. Nâng khó bằng cách:**
- **Sắp xếp 5 số** (thay vì 3–4) tăng/giảm.
- **Liệt kê nhiều ràng buộc:** "các số lớn hơn 36 và bé hơn 41" (4 số) — giữ
  khoảng ≤ 5 số để không dài.
- **So sánh kép:** "số vừa lớn hơn 50 vừa bé hơn 53 và là số tròn chục"? (chọn 1
  ràng buộc dễ liên hệ; tránh quá rối — tối đa 2 ràng buộc).
- **Cấu tạo ngược nâng nhẹ:** "số có chữ số hàng chục là 7, hàng đơn vị bé hơn
  hàng chục 2 đơn vị" → 75.
- Distractor: đảo chục–đơn vị; lệch 1 số ở ranh giới khoảng (tính cả đầu mút sai).

**3. Ví dụ (đã tự giải):**

- *(input)* "Viết các số lớn hơn **36** và bé hơn **41** (cách nhau bởi dấu cách
  hoặc dấu `;`)." → **Đáp án: 37;38;39;40**.
  `say`: "viết các số lớn hơn ba mươi sáu và bé hơn bốn mươi mốt."
- *(input)* "Sắp xếp từ bé đến lớn (cách nhau bởi dấu cách): **23; 9; 40; 17; 31**."
  → **Đáp án: 9;17;23;31;40**.
- *(input)* "Số có chữ số hàng chục là **7**, hàng đơn vị là **5**. Đó là số nào?"
  → **Đáp án: 75**. (Cấu tạo ngược; giữ trực tiếp, không bắt suy thêm bước.)

**4. Mức độ:** đọc/liền trước–sau/so sánh 2 số = Cơ bản; sắp xếp 4–5 số, liệt kê
khoảng = Nâng vừa; liệt kê 5 số / cấu tạo ngược = Thử thách.

---

## B2. `cong` — Phép cộng (≤ 100)

**1. Hiện đang dễ ở chỗ nào:** chỉ `a + b` một phép.

**2. Nâng khó bằng cách:**
- **Cộng 3 số** trong phạm vi 100 (mọi bước ≥ 0, kết quả ≤ 100): `24 + 8 + 5`.
- Ưu tiên bài có **nhớ** (qua chục) ở tầng nâng vừa.
- **Cộng tròn chục cho mẹo nhẩm:** `27 + 30`, `45 + 20` (giúp bé thấy quy luật).
- Distractor (khi mc): quên nhớ (lệch 10), cộng thiếu số thứ 3, lệch 1.

**3. Ví dụ (đã tự giải):**

- *(input)* "Tính: **24 + 8 + 5 = ?**" → **Đáp án: 37**.
  Giải: 24 + 8 = 32; 32 + 5 = 37. `say`: "hai mươi tư cộng tám cộng năm bằng mấy?"
- *(mc)* "Tính: **27 + 30**" Choices: `["57", "30", "47", "67"]`
  → **Đáp án: A (57)**. (Distractor 47/67 = lệch một chục.)
- *(input)* "Tính: **36 + 9 = ?**" → **Đáp án: 45** (phép cộng có nhớ).

**4. Mức độ:** `a + b` không nhớ ≤ 20 = Cơ bản; cộng có nhớ ≤ 100, cộng tròn chục =
Nâng vừa; cộng 3 số = Thử thách.

---

## B3. `tru` — Phép trừ (≤ 100)

**1. Hiện đang dễ ở chỗ nào:** chỉ `a − b` một phép.

**2. Nâng khó bằng cách:**
- **Trừ liên tiếp 3 số:** `50 − 7 − 9` (mọi bước ≥ 0).
- Ưu tiên **trừ có nhớ** (qua chục) ở tầng nâng vừa: `42 − 7`.
- **Trừ một số tròn chục** để luyện nhẩm: `83 − 40`.
- Distractor: cộng thay vì trừ; lệch 10 (quên mượn); chỉ trừ một số trong ba số.

**3. Ví dụ (đã tự giải):**

- *(input)* "Tính: **50 − 7 − 9 = ?**" → **Đáp án: 34**.
  Giải: 50 − 7 = 43; 43 − 9 = 34. `say`: "năm mươi trừ bảy trừ chín bằng mấy?"
- *(input)* "Tính: **42 − 7 = ?**" → **Đáp án: 35** (trừ có nhớ).
- *(mc)* "Tính: **83 − 40**" Choices: `["43", "47", "33", "53"]`
  → **Đáp án: A (43)**.

**4. Mức độ:** `a − b` không nhớ ≤ 20 = Cơ bản; trừ có nhớ ≤ 100, trừ tròn chục =
Nâng vừa; trừ liên tiếp 3 số = Thử thách.

---

## B4. `tinh-day` — Tính dãy & Điền số

**1. Hiện đang dễ ở chỗ nào:** dãy 3 số và điền ô trống một bước; so sánh phép
tính với một số.

**2. Nâng khó bằng cách:**
- **Điền số là suy luận ngược 1 bước với số lớn hơn:** `? + 6 = 23`, `41 − ? = 17`
  (phạm vi tới 100).
- **So sánh hai vế đều là phép tính** (tăng tỉ trọng dạng này so với hiện tại):
  `18 + 5 ___ 30 − 6`.
- **Dãy có ô trống ở giữa:** `5; 8; ?; 14; 17` (đều +3).
- Distractor (mc so sánh): luôn 3 dấu `> < =`; bẫy khi hai vế gần bằng nhau.

**3. Ví dụ (đã tự giải):**

- *(input)* "Điền số thích hợp: **? + 6 = 23**" → **Đáp án: 17** (23 − 6).
  `say`: "mấy cộng sáu bằng hai mươi ba?"
- *(mc)* "Điền dấu thích hợp: **18 + 5 ___ 30 − 6**"
  Choices: `["<", ">", "="]` → **Đáp án: < (index của '<')**.
  Giải: 18 + 5 = 23; 30 − 6 = 24; 23 < 24.
- *(input)* "Điền số còn thiếu: **5; 8; ?; 14; 17**" → **Đáp án: 11**.
  Giải: dãy hơn nhau 3 đơn vị; sau 8 là 8 + 3 = 11.

**4. Mức độ:** điền ô một bước số nhỏ, dãy 3 số = Cơ bản; so sánh hai phép tính,
điền ô số lớn = Nâng vừa; điền số giữa dãy = Thử thách.

---

## B5. `do-dai` — Đo độ dài (cm)

**1. Hiện đang dễ ở chỗ nào:** một phép cộng/trừ độ dài, hoặc so sánh hai đoạn.

**2. Nâng khó bằng cách:**
- **Cắt 2 lần (2 bước):** "Dây 80 cm cắt đi 25 cm rồi cắt tiếp 17 cm, còn mấy cm?"
  (80 − 25 − 17).
- **Nối nhiều đoạn:** cộng 3 đoạn (kết quả ≤ 100 cm).
- **Suy luận ngược:** "Đoạn AB và BC nối lại dài 60 cm; AB dài 35 cm; BC dài mấy?"
  (60 − 35).
- Distractor (mc): cộng thay trừ; chỉ trừ một lần.

**3. Ví dụ (đã tự giải):**

- *(input)* "Sợi dây dài **80 cm**, cắt đi **25 cm** rồi cắt tiếp **17 cm**. Đoạn
  dây còn lại dài bao nhiêu cm?" → **Đáp án: 38** (80 − 25 − 17).
  `say`: "sợi dây dài tám mươi xăng ti mét, cắt đi hai mươi lăm xăng ti mét rồi
  cắt tiếp mười bảy xăng ti mét, còn lại bao nhiêu xăng ti mét?"
- *(input)* "Đoạn AB dài **35 cm**, nối thêm đoạn BC thì cả hai dài **60 cm**.
  Đoạn BC dài bao nhiêu cm?" → **Đáp án: 25** (60 − 35).
- *(input)* "Nối ba đoạn dây dài **12 cm**, **20 cm** và **15 cm**. Sợi dây mới
  dài bao nhiêu cm?" → **Đáp án: 47** (12 + 20 + 15).

**4. Mức độ:** so sánh/cộng/trừ một phép = Cơ bản; nối 3 đoạn, suy luận ngược 1
bước = Nâng vừa; cắt 2 lần = Thử thách.

---

## B6. `gio-tuan` — Xem giờ & Tuần lễ

**1. Hiện đang dễ ở chỗ nào:** đọc kim giờ/kim phút, thứ ngày mai, một bước.

**2. Nâng khó bằng cách:**
- **Khoảng thời gian giờ đúng dài hơn một chút** (≤ 4 giờ, có thể bắc qua trưa
  nhưng giữ ≤ 12): "Bắt đầu 9 giờ, làm 3 giờ, xong lúc mấy giờ?".
- **Đếm ngày trong tuần xa hơn (1–6 ngày):** "4 ngày sau thứ Năm là thứ mấy?".
- **Ghép buổi + giờ:** "Bé ngủ trưa lúc 12 giờ, dậy sau 2 giờ là mấy giờ?".
- Distractor: lệch 1 giờ; sai chiều đếm thứ (lùi thay vì tiến).

**3. Ví dụ (đã tự giải):**

- *(mc)* "Bé bắt đầu học lúc **9 giờ**, học trong **3 giờ**. Bé học xong lúc mấy
  giờ?" Choices: `["12 giờ", "11 giờ", "13 giờ", "6 giờ"]` → **Đáp án: A (12 giờ)**.
  Giải: 9 + 3 = 12. `say`: "bé bắt đầu học lúc chín giờ, học trong ba giờ, xong
  lúc mấy giờ?"
- *(mc)* "**4 ngày sau** thứ Năm là thứ mấy?"
  Choices: `["thứ Hai", "thứ Bảy", "Chủ nhật", "thứ Ba"]` → **Đáp án: A (thứ Hai)**.
  Giải: Năm → Sáu (1) → Bảy (2) → Chủ nhật (3) → thứ Hai (4).
- *(mc)* "Bé đi ngủ lúc **8 giờ tối**, ngủ **3 giờ** rồi tỉnh dậy uống nước.
  Lúc đó là mấy giờ?" Choices: `["11 giờ", "5 giờ", "10 giờ", "12 giờ"]`
  → **Đáp án: A (11 giờ)**. Giải: 8 + 3 = 11. (Giữ mốc kết thúc ≤ 12 để tránh
  nhập nhằng giờ 24h cho bé.)

**4. Mức độ:** đọc kim, thứ ngày mai = Cơ bản; khoảng thời gian, đếm ngày 1–3 =
Nâng vừa; đếm ngày 4–6 = Thử thách.

> **Lưu ý engine cho `gio-tuan`:** với bé lớp 1, GIỮ mọi mốc giờ kết thúc ≤ 12 và
> tránh quy đổi 24h ↔ giờ chiều trong cùng một câu (dễ nhập nhằng 14↔2). Khoảng
> thời gian luôn ≤ 4 giờ, start + dur ≤ 12.

---

## B7. `loi-van` — Toán có lời văn (lớp 1)

**1. Hiện đang dễ ở chỗ nào:** toàn bài MỘT bước (thêm/bớt/nhiều–ít hơn/gộp/tách).

**2. Nâng khó bằng cách:**
- **Bài 2 bước trong phạm vi 100** (thêm rồi bớt, hoặc bớt rồi thêm): "Có 35, cho
  bạn 12, được tặng thêm 8, còn mấy?".
- **Suy luận ngược 1 bước:** "Sau khi được cho thêm 8 cái, Lan có 30 cái. Lúc đầu
  Lan có mấy cái?" (30 − 8).
- **So sánh hai bạn rồi hỏi tổng** (2 bước cộng): "An 24, Bình nhiều hơn An 6,
  cả hai có mấy?" (24 + 30 = 54).
- Vẫn dùng câu CỰC NGẮN; dữ kiện rõ; mỗi câu tối đa 2 phép.
- Distractor (nếu mc): dừng ở bước 1; sai phép bước 2.

**3. Ví dụ (đã tự giải):**

- *(input)* "Nam có **35 viên kẹo**, cho bạn **12 viên**, rồi được tặng thêm **8
  viên**. Hỏi Nam còn bao nhiêu viên kẹo?" → **Đáp án: 31**.
  Giải: 35 − 12 = 23; 23 + 8 = 31. `say`: "nam có ba mươi lăm viên kẹo, cho bạn
  mười hai viên, rồi được tặng thêm tám viên, hỏi nam còn bao nhiêu viên kẹo?"
- *(input)* "Sau khi được tặng thêm **8 bông hoa**, Lan có **30 bông**. Hỏi lúc
  đầu Lan có bao nhiêu bông hoa?" → **Đáp án: 22** (30 − 8).
- *(input)* "An có **24 cái bút**. Bình có nhiều hơn An **6 cái**. Hỏi cả hai bạn
  có tất cả bao nhiêu cái bút?" → **Đáp án: 54**.
  Giải: Bình 24 + 6 = 30; cả hai 24 + 30 = 54.

**4. Mức độ:** một bước = Cơ bản; suy luận ngược 1 bước, so sánh rồi tổng = Nâng
vừa; bài 2 bước thêm–bớt = Thử thách.

---

## B8. `tu-duy` — Phát triển tư duy (lớp 1)

**1. Hiện đang dễ ở chỗ nào:** dãy cộng/trừ đều; lập số 2 chữ số; tìm số một bước.

**2. Nâng khó bằng cách:**
- **Dãy cộng đều bước lớn hơn / dãy có ô trống:** `2; 5; 8; 11; ?` (+3).
- **Lập số từ 3 thẻ** (lớn nhất/bé nhất, 0 không đứng đầu) — đã có, giữ nhưng ưu
  tiên 3 thẻ.
- **Tìm số suy luận ngược với số lớn hơn:** "Số nào cộng 18 thì được 42?" (42 −
  18 = 24).
- **Câu đố logic cực ngắn (dùng + −):** "Lan 7 tuổi. Anh hơn Lan 5 tuổi. Anh mấy
  tuổi?" (7 + 5 = 12) — chỉ một phép, nhưng đặt ở dạng "đố" để bé suy nghĩ.
- Distractor: dùng phép sai (trừ thay cộng); quên +1 trong dãy.

**3. Ví dụ (đã tự giải):**

- *(input)* "Tìm số tiếp theo của dãy: **2; 5; 8; 11; …**" → **Đáp án: 14**
  (mỗi số hơn số trước 3). `say`: "tìm số tiếp theo của dãy hai, năm, tám, mười
  một."
- *(input)* "Từ ba thẻ chữ số **4, 0, 7** (mỗi thẻ dùng một lần), hãy lập số có
  hai chữ số **lớn nhất**." → **Đáp án: 74** (chục 7, đơn vị 4).
- *(input)* "Số nào cộng với **18** thì được **42**?" → **Đáp án: 24** (42 − 18;
  thử lại 24 + 18 = 42).
- *(input)* "Lan **7 tuổi**. Anh của Lan hơn Lan **5 tuổi**. Hỏi anh của Lan bao
  nhiêu tuổi?" → **Đáp án: 12** (7 + 5).

**4. Mức độ:** dãy cộng đều bước nhỏ, lập số 2 thẻ = Cơ bản; tìm số ngược, dãy có
ô trống, lập số 3 thẻ = Nâng vừa; câu đố tuổi/logic ngắn = Thử thách.

---

# RANH GIỚI TẦM LỚP — "ĐƯỢC DÙNG / KHÔNG ĐƯỢC DÙNG"

## Lớp 3

| ĐƯỢC DÙNG | KHÔNG ĐƯỢC DÙNG |
|-----------|-----------------|
| Số tự nhiên ≤ 100 000 | Số > 100 000 |
| Bốn phép tính +, −, ×, ÷ (kể cả **chia có dư**) | Phân số, hỗn số |
| Biểu thức 3 phép, có ngoặc; tìm x 2 bước | Số thập phân |
| Bài toán 2–3 bước, suy luận ngược, rút về đơn vị | Tỉ số, tỉ số phần trăm |
| Tính nhanh: phân phối `a×b+a×c`, ghép tròn chục/trăm, ghép thừa số | Phương pháp **đặt tên lớp 4**: "trung bình cộng", công thức "tổng–hiệu", "tổng–tỉ", "hiệu–tỉ" (vẫn được giải **bằng các bước** nhưng KHÔNG nêu tên/công thức) |
| Chu vi & **diện tích** hình chữ nhật, hình vuông; đếm viên gạch | Diện tích tam giác / hình thang / hình thoi / hình tròn; thể tích, hình khối |
| Đổi đơn vị độ dài, khối lượng, thời gian, lít, tiền (≤ 100 000đ) | Toán chuyển động (`v = s : t`), đại lượng tỉ lệ thuận/nghịch nâng cao |
| Trồng cây dạng **đếm khoảng** đơn giản (hai đầu); đếm có điều kiện chia hết cho 2/5/3 | Dùng thuật ngữ trừu tượng "ước/bội", "dấu hiệu chia hết" như khái niệm lý thuyết |
| Dãy quy luật: cộng/nhân đều, "×k+c", sai phân, xen kẽ | Dãy cần công thức số hạng tổng quát / tổng dãy cách đều |
| Toán "nghĩ số" suy luận ngược nhiều bước | Bài cần lập phương trình/ẩn số hình thức |

## Lớp 1

| ĐƯỢC DÙNG | KHÔNG ĐƯỢC DÙNG |
|-----------|-----------------|
| Số tự nhiên ≤ 100 | Số > 100 |
| Chỉ phép **cộng và trừ** (kể cả có nhớ) | Phép **nhân, chia** (kể cả ẩn dưới "gấp/giảm … lần") |
| Cộng/trừ liên tiếp 3 số (≤ 100, mọi bước ≥ 0) | Chuỗi quá 3 số hoặc kết quả âm/quá 100 |
| Điền số, tìm số suy luận **ngược 1 bước** | Suy luận ngược nhiều bước |
| So sánh, sắp xếp 4–5 số; liệt kê khoảng ≤ 5 số | Sắp xếp/liệt kê quá nhiều số gây dài, gây nản |
| Bài lời văn 2 bước thật ngắn (thêm–bớt) | Bài lời văn 3+ bước; bài nhiều dữ kiện rối |
| Đo độ dài cm (cộng/trừ, cắt 2 lần) | Đổi đơn vị độ dài (cm↔m…), khối lượng, diện tích |
| Xem giờ đúng, khoảng thời gian ≤ 4 giờ, thứ trong tuần | Giờ–phút lẻ phức tạp, phép tính thời gian nhiều bước |
| Lập số 2 chữ số từ thẻ; dãy +/− đều; câu đố +/− cực ngắn | Thuật ngữ "**số chẵn / số lẻ**"; mọi nội dung cần nhân/chia |

---

# TÓM TẮT CHO KỸ SƯ ENGINE

- **Chia 3 tầng độ khó cho mỗi chủ đề** và random theo trọng số: Lớp 3 ≈
  45/40/15 (Cơ bản/Nâng vừa/Thử thách); Lớp 1 ≈ 60/30/10. Luôn còn câu vừa sức
  xen kẽ để bé không nản.
- **Nâng khó = thêm bước (2–3), suy luận ngược, tính khéo, quy luật phức hơn,
  logic/đếm/trồng cây** — KHÔNG phải tăng độ lớn con số một cách vô nghĩa.
- **Distractor là bẫy lỗi điển hình** (sai thứ tự phép tính, quên bước 2, nhầm
  cộng/trừ, lệch hàng/quên nhớ, bỏ phần dư), không random.
- **Tự tính answer trong code & kiểm ràng buộc TRƯỚC khi sinh:** không số âm,
  chia hết khi cần, tích/kết quả ≤ trần (100 000 lớp 3, 100 lớp 1), số dư < số chia.
- **Lớp 3:** chỉ +, −, ×, ÷ và số ≤ 100 000. Giải bài kiểu "tổng–hiệu/trung bình
  cộng" **bằng các bước cụ thể**, TUYỆT ĐỐI không nêu tên công thức/phương pháp
  lớp 4. Không phân số, thập phân, %, diện tích tam giác/tròn, thể tích, chuyển
  động.
- **Lớp 1:** chỉ +, − và số ≤ 100. KHÔNG nhân/chia (kể cả ẩn dưới "gấp/giảm lần"),
  KHÔNG nói "chẵn/lẻ". Đề CỰC NGẮN, mỗi câu một ý; suy luận ngược tối đa 1 bước;
  lời văn tối đa 2 bước.
- **Giữ nguyên giao kèo dữ liệu** `{type, topic, stem, choices?, answer, explain
  [, say]}`. Lớp 1 luôn có `say` (chữ thường, đọc số & dấu thành lời, kể cả câu
  thử thách).
- **`explain` phải nêu rõ từng bước** (bước 1 → bước 2 → đáp số) để bé học bản
  chất, không học mẹo; với suy luận ngược nên có "thử lại".
- **Bám đúng `topic id` hiện có** (Lớp 3: so-100000, cong-tru, nhan-chia,
  bieu-thuc, chia-du, do-luong, hinh-hoc, loi-van, tu-duy; Lớp 1: so-100, cong,
  tru, tinh-day, do-dai, gio-tuan, loi-van, tu-duy) — chỉ nâng độ khó bên trong,
  không đổi cấu trúc chủ đề.
- **Test đối chiếu:** mọi ví dụ trong file này đã có đáp án đúng (đã kiểm bằng
  code) — dùng làm bộ test vàng khi triển khai từng tầng.
