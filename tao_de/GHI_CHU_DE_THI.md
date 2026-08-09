# Ghi chú: cách nghiên cứu & đánh giá ĐỀ THI trong dự án này

> Viết cho các phiên làm việc sau. Đọc file này **trước khi** sửa mức độ đề, sửa
> engine sinh câu, hay hứa với người dùng một con số độ khó nào đó.
> Liên quan: `de_config.js` (mức độ), `de_builder.js` (lắp & in đề),
> `tests/builder.spec.mjs` (đo độ khó), `sync_engines.mjs`.

---

## 1. Nguyên tắc số 1: ĐỪNG chấm độ khó theo TÊN MẠCH

Đây là cái bẫy đã sập một lần, mất công làm lại.

Lần đầu làm mức "Trung bình", tôi chấm độ khó bằng hệ số gán theo tên mạch —
thấy mạch tên là `tu-duy` thì cho hệ số 2,0. Kết quả báo cáo **1,87 lần**.

Sự thật: mạch `tu-duy` của **lớp 1** khi đó chỉ có duy nhất một khuôn câu đố tuổi
*"X n tuổi, người thân hơn X là m tuổi, hỏi người thân bao nhiêu tuổi?"* — **một
phép cộng**. Tức là mạch mang tên "Phát triển tư duy" lại là **mạch DỄ NHẤT đề**.
Con số 1,87 là ảo. Đo lại đúng cách chỉ còn **1,52**.

**Rút ra:** tên mạch chỉ nói CHỦ ĐỀ, không nói ĐỘ KHÓ. Luôn đo trên câu thật.

---

## 2. Cách đo độ khó (đang dùng)

Chỉ số tính trên **từng câu**, toàn bộ lấy từ dữ liệu engine trả về:

```
độ khó = (số bước tính + 0,5 × tầng) × hệ số dạng trả lời
```

| Thành phần | Lấy từ đâu | Ghi chú |
|---|---|---|
| **số bước tính** | đếm dấu `=` trong `explain` | lời giải `"28 + 30 = 58; 58 − 13 = 45"` → 2 bước |
| **tầng** | `q.tier` (0/1/2) | ba bậc của engine: cơ bản / nâng vừa / thử thách |
| **dạng trả lời** | `q.type` | `input` (tự luận) ×1,4 · `mc` (trắc nghiệm) ×1,0 — trắc nghiệm còn đoán mò được |

Đo trên **40 đề mỗi mức** rồi lấy trung bình (đề sinh ngẫu nhiên, 1 đề không nói lên gì).

Đoạn đo nằm trong `tests/builder.spec.mjs`, chạy bằng:

```bash
node tao_de/tests/builder.spec.mjs
```

Nó in ra bảng độ khó của từng lớp và **fail nếu tỉ lệ tụt dưới ngưỡng** — nghĩa là
sau này ai sửa engine làm đề dễ đi thì test báo ngay.

### Chỉ số này KHÔNG đo được gì
Nó đo *khối lượng tính toán*, không đo *độ hóc của suy luận*. Câu "An hơn Bình,
Bình hơn Cường, ai cao nhất?" có **0 phép tính** nhưng vẫn là tư duy thật. Vì vậy
chỉ số chỉ dùng để **so sánh hai mức với nhau**, đừng dùng làm chân lý tuyệt đối,
và luôn kèm một vòng **thẩm định bằng agent** (mục 5).

---

## 3. LUÔN dò trần trước khi hứa một con số

Người dùng yêu cầu "khó gấp đôi". Đừng nhận lời rồi mới làm — **đo trần trước**:
dựng một cơ cấu cực đoan (dồn hết câu vào các mạch nặng nhất, tầng toàn thử thách)
rồi đo. Đó là mức cao nhất có thể đạt với ngân hàng câu hiện tại.

Kết quả dò thực tế (2026-08):

| Lớp | Trần đo được | Đã chốt | Vì sao dừng ở đó |
|---|---|---|---|
| Toán 3 | ~2,0× | **1,97×** | đạt yêu cầu |
| Toán 1 | **~1,64×** | **1,62×** | câu khó nhất ngân hàng lớp 1 cũng chỉ **2 bước tính**, mà mức dễ đã ~1,4 bước → gấp đôi là **bất khả thi** nếu không viết dạng câu mới |

Đoạn dò trần (chạy nhanh, không cần lưu):

```js
// dồn hết vào mạch nặng + tầng toàn thử thách để xem trần ở đâu
const max1 = {'so-100':1,'cong':4,'tru':4,'tinh-day':1,'do-dai':4,'gio-tuan':1,'loi-van':4,'tu-duy':1};
build(cfg, engine, { muc:'tb', soCauByMach:max1, tierWeights:[0,0,100], preferInput:true });
```

**Nếu trần thấp hơn yêu cầu → nói thẳng với người dùng**, kèm con số và lý do,
và nêu lựa chọn (viết thêm dạng câu mới / chấp nhận con số thật). Đừng nới lỏng
chỉ số đo cho vừa lời hứa.

---

## 4. Ba đòn bẩy làm đề khó lên (theo thứ tự hiệu quả)

Cấu hình ở `de_config.js → LEVELS`:

1. **`tierWeights`** — bỏ tầng cơ bản, dồn sang tầng thử thách. Mạnh nhất, rẻ nhất.
   Mức Trung bình đang dùng `[0, 10, 90]`.
2. **`soCau`** (cơ cấu mạch) — dồn câu sang mạch có nhiều bước tính.
   **Nhưng**: vẫn phải phủ đủ mọi mạch (kẻo lệch chương trình) và **không dồn quá
   nhiều vào một mạch** — dồn 6 câu vào một mạch thì cả 6 câu ra cùng một khuôn,
   đề đọc lên rất chán (lỗi đã mắc, agent thẩm định bắt được).
3. **`preferInput`** — ưu tiên câu tự luận. Trắc nghiệm 3 phương án thì đoán mò
   cũng trúng 33%. `buildItems` thử lại tối đa 60% số lượt để tìm câu `input`,
   sau đó chấp nhận trắc nghiệm (tránh treo với mạch chỉ sinh được `mc`).

Ngoài ra `phut` có thể là số, hoặc object theo lớp: `{ toan1: 40, toan3: 50 }`.

### Thêm một mức mới thì làm gì
1. Thêm khoá vào `LEVELS` + `LEVEL_ORDER` trong `de_config.js`.
2. Không cần sửa `de_builder.js` hay `index.html` — ô chọn mức tự nạp từ `LEVEL_ORDER`.
3. Thêm ngưỡng độ khó cho mức đó vào `builder.spec.mjs`.

---

## 5. Quy trình chuẩn (đừng bỏ bước nào)

```bash
# 1. sửa engine gốc (KHÔNG sửa bản copy trong tao_de/engines/)
#    -> web_toan_lop1/engine.js  hoặc  web_toan_lop3/engine.js

# 2. chạy test hồi quy của app học TRƯỚC — engine dùng chung với app đang chạy
node web_toan_lop1/tests/run.mjs        # ~75.000 phép kiểm
node web_toan_lop3/tests/run.mjs        # ~82.000 phép kiểm

# 3. đồng bộ bản copy sang trình tạo đề
node tao_de/sync_engines.mjs

# 4. đo lại độ khó + kiểm đề hợp lệ
node tao_de/tests/builder.spec.mjs

# 5. thẩm định SƯ PHẠM bằng agent (mục dưới)

# 6. xem bản in bằng mắt (đừng bỏ bước này — nhiều lỗi chỉ lộ khi nhìn)
```

### Thẩm định bằng agent — bắt buộc khi đổi độ khó
Dùng sub-agent **`primary-assessment-reviewer`**. Cách gọi hiệu quả: sinh sẵn 2 đề
mẫu ra file HTML rồi đưa đường dẫn cho agent, kèm **cơ cấu mạch** và **ý đồ thiết kế**,
và yêu cầu rõ: *tính lại từng đáp án*, *soát vượt chương trình*, *soát lặp khuôn*,
*đánh giá độ khó so với lứa tuổi*, *thời gian làm bài*.

Agent này đã bắt được những lỗi mà test tự động **không thể** bắt: mạch "tư duy"
không hề tư duy, lặp khuôn 6 lần, đề vượt chương trình, thời gian phi thực tế.

---

## 6. Các bẫy kỹ thuật đã gặp

| Bẫy | Triệu chứng | Cách tránh |
|---|---|---|
| Chấm độ khó theo tên mạch | con số đẹp nhưng sai | đo bằng `explain` (mục 1, 2) |
| Sửa bản copy `tao_de/engines/*` | test báo "copy engine lệch bản gốc" | sửa engine gốc rồi chạy `sync_engines.mjs` |
| Thêm dạng câu mới vào engine | test app báo *"dạng câu không nhận diện"* | phải thêm nhánh kiểm tra vào `web_toan_lop*/tests/engine.spec.mjs` |
| Nhánh kiểm tra đặt sai thứ tự | câu "nhiều tuổi hơn" bị nhánh `/tuổi/` bắt nhầm | đặt nhánh cụ thể **trước** nhánh chung |
| Chỉ dẫn của app lọt vào bản in | đề giấy ghi "(gõ số)" | `forPrint()` trong `de_builder.js` |
| Đề toàn tự luận | in ra "PHẦN II" mà không có "PHẦN I" | chỉ đánh số phần khi có **cả hai** phần |
| Dồn nhiều câu vào một mạch | 6 câu cùng một khuôn | giới hạn số câu/mạch, ưu tiên phủ rộng |

---

## 7. VẤN ĐỀ CÒN TỒN — chờ người dùng quyết, ĐỪNG tự sửa

Ba việc dưới đây do `primary-assessment-reviewer` nêu (2026-08-09). Chúng **có sẵn
từ trước**, không phải do mức độ mới sinh ra, và **đụng tới app học đang chạy**
nên phải hỏi người dùng trước.

### 7.1. Lớp 1: engine cố ý sinh cộng/trừ CÓ NHỚ trong phạm vi 100
- Code ghi rõ chủ ý: *"CHỦ ĐỀ 2: CỘNG (trong phạm vi 100, gồm không nhớ và có nhớ)"*.
- Agent thẩm định nói CT GDPT 2018 lớp 1 chỉ có **không nhớ** trong phạm vi 100;
  cộng/trừ **có nhớ** trong phạm vi 100 là **lớp 2** (qua 10 chỉ trong phạm vi 20).
- Ví dụ bị nêu: `45 − 27`, `93 − 36`, `23 + 67`.
- **Ảnh hưởng:** cả app `/lop1/` đang chạy, không riêng đề thi.
- Nếu người dùng chốt sửa: thêm ràng buộc lúc sinh số —
  cộng `(a%10 + b%10) <= 9` và `(a/10 + b/10) < 10`; trừ `(a%10) >= (b%10)`;
  ngoại lệ cho phép có nhớ khi phạm vi ≤ 20.
- (Các dạng tư duy mới thêm cho lớp 1 **đã** ràng buộc không nhớ sẵn.)

### 7.2. Lớp 3: có dạng "tổng – hiệu" vốn là chương trình lớp 4
Dạng *"hai số có tổng là T, số lớn hơn số bé H đơn vị, tìm số lớn"*. Agent nói
lớp 3 chính khoá chưa học. Đáng lưu ý: vài câu dạng này bị **gắn nhãn mạch "Hình học"**
(khoác áo hình chữ nhật) nên đề lớp 3 **không có câu hình học thật nào**.

### 7.3. Lớp 3: thiếu mạch bắt buộc của CT GDPT 2018
Thiếu hẳn: **thống kê – xác suất** (bắt buộc), **diện tích** hình chữ nhật/vuông,
**phân số đơn giản**, **đổi đơn vị đo**, gấp/giảm một số đi nhiều lần, số La Mã,
làm tròn số. Mạch "Đo lường" thực tế chỉ có câu về tiền.

### 7.4. Nên chặn lặp khuôn ở mức engine
Ràng buộc đề nghị: **mỗi template tối đa 2 lần/đề**; câu cùng template phải khác
tham số cấu trúc (khác vị trí ô trống, khác phép toán); **không dùng lại tên nhân vật**
trong cùng một đề (hiện có cảnh "Mai 6 tuổi" rồi "Mai 9 tuổi" trong cùng đề).

---

## 8. Số liệu tham chiếu (2026-08-09)

Số bước tính trung bình theo mạch × tầng — dùng để chọn cơ cấu khi làm mức mới.
Đo lại bằng cách sinh 60 câu mỗi ô và đếm dấu `=` trong `explain`.

**Toán 1** (tầng 2): `cong` 2,0 · `tru` 2,0 · `do-dai` 2,0 · `loi-van` 2,0 ·
`so-100` 1,5 · `tu-duy` 1,4 · `tinh-day` 1,0 · `gio-tuan` 1,0

**Toán 3** (tầng 2): `hinh-hoc` 5,7 · `bieu-thuc` 4,0 · `chia-du` 4,0 ·
`tu-duy` 3,7 · `loi-van` 3,5 · `cong-tru` 3,1 · `do-luong` 3,0 · `nhan-chia` 2,4 ·
`so-100000` 1,0

Lưu ý `hinh-hoc` lớp 3 nhiều bước nhưng chỉ ~35% là câu tự luận, nên trọng số
thực tế thấp hơn con số 5,7.
