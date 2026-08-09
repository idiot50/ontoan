/*
 * de_config.js — Cấu hình MÔN/LỚP cho trình tạo đề (classic script: browser + Node).
 * Mỗi cấu hình: danh sách MẠCH kiến thức (ánh xạ tới topic của engine) + ma trận chuẩn
 * (số câu mỗi mạch, lần đầu khi chưa có dữ liệu thích ứng). Tổng câu = 20 → 0,5đ/câu = 10đ.
 */
(function () {
  'use strict';

  var CONFIG = {
    toan3: {
      key: 'toan3', mon: 'TOÁN', lop: 3, engineGlobal: 'QE_TOAN3', engineFile: 'engines/toan3.engine.js',
      mach: [
        { topic: 'so-100000', ten: 'Số đến 100 000' },
        { topic: 'cong-tru', ten: 'Cộng – Trừ' },
        { topic: 'nhan-chia', ten: 'Nhân – Chia' },
        { topic: 'bieu-thuc', ten: 'Biểu thức & Tìm x' },
        { topic: 'chia-du', ten: 'Chia có dư' },
        { topic: 'do-luong', ten: 'Đo lường' },
        { topic: 'hinh-hoc', ten: 'Hình học' },
        { topic: 'loi-van', ten: 'Toán có lời văn' },
        { topic: 'tu-duy', ten: 'Phát triển tư duy' }
      ],
      soCauChuan: { 'so-100000': 3, 'cong-tru': 3, 'nhan-chia': 3, 'bieu-thuc': 2, 'chia-du': 2, 'do-luong': 2, 'hinh-hoc': 2, 'loi-van': 2, 'tu-duy': 1 }
    },
    toan1: {
      key: 'toan1', mon: 'TOÁN', lop: 1, engineGlobal: 'QE_TOAN1', engineFile: 'engines/toan1.engine.js',
      mach: [
        { topic: 'so-100', ten: 'Số trong phạm vi 100' },
        { topic: 'cong', ten: 'Phép cộng' },
        { topic: 'tru', ten: 'Phép trừ' },
        { topic: 'tinh-day', ten: 'Tính dãy & Điền số' },
        { topic: 'do-dai', ten: 'Đo độ dài' },
        { topic: 'gio-tuan', ten: 'Xem giờ & Tuần lễ' },
        { topic: 'loi-van', ten: 'Toán có lời văn' },
        { topic: 'tu-duy', ten: 'Phát triển tư duy' }
      ],
      soCauChuan: { 'so-100': 3, 'cong': 3, 'tru': 3, 'tinh-day': 3, 'do-dai': 2, 'gio-tuan': 2, 'loi-van': 2, 'tu-duy': 2 }
    },
    // ÔN THI — luyện thi vào lớp 6: kiến thức lớp 4–5 ở mức tổng hợp/nâng cao.
    // `lop: 5` để tiêu đề đề in ra đọc đúng "MÔN: TOÁN – LỚP 5".
    onthi: {
      key: 'onthi', mon: 'TOÁN', lop: 5, ten: 'Ôn thi vào lớp 6 (lớp 5)',
      engineGlobal: 'QE_ONTHI', engineFile: 'engines/onthi.engine.js',
      mach: [
        { topic: 'so-tu-nhien', ten: 'Số tự nhiên & tính nhanh' },
        { topic: 'phan-so', ten: 'Phân số' },
        { topic: 'so-thap-phan', ten: 'Số thập phân' },
        { topic: 'do-luong', ten: 'Đại lượng & đo lường' },
        { topic: 'ti-so-phan-tram', ten: 'Tỉ số & tỉ số phần trăm' },
        { topic: 'toan-dien-hinh', ten: 'Toán điển hình' },
        { topic: 'hinh-phang', ten: 'Hình phẳng' },
        { topic: 'hinh-khoi', ten: 'Hình khối & thể tích' },
        { topic: 'chuyen-dong', ten: 'Toán chuyển động' },
        { topic: 'tu-duy', ten: 'Tư duy & suy luận' }
      ],
      soCauChuan: {
        'so-tu-nhien': 2, 'phan-so': 2, 'so-thap-phan': 3, 'do-luong': 2, 'ti-so-phan-tram': 2,
        'toan-dien-hinh': 3, 'hinh-phang': 2, 'hinh-khoi': 1, 'chuyen-dong': 1, 'tu-duy': 2
      }
    }
  };

  // Tổng số câu mỗi đề (giữ cố định để điểm luôn tròn: 20 câu × 0,5đ = 10đ).
  var TONG_CAU = 20;
  // Trọng số tầng độ khó mặc định cho ĐỀ ÔN CUỐI NĂM (ưu tiên suy luận hơn mặc định engine).
  var TIER_WEIGHTS = [30, 45, 25]; // tier 0 / 1 / 2

  /* ================= MỨC ĐỘ ĐỀ =================
     Ba đòn bẩy làm đề khó lên, dùng đồng thời:
       1. TẦNG câu hỏi của engine: cơ bản (0) → nâng vừa (1) → thử thách (2).
          Tầng 2 mới là chỗ có bài trồng cây, tìm x nhiều bước, bài toán ngược,
          dãy số theo quy luật — tức là các câu phải SUY LUẬN mới ra.
       2. CƠ CẤU MẠCH: dồn câu sang tư duy / lời văn / biểu thức, bớt câu tính máy móc.
       3. DẠNG TRẢ LỜI: ưu tiên câu TỰ LUẬN (gõ đáp án) thay vì trắc nghiệm —
          trắc nghiệm 3–4 phương án còn đoán mò được, tự luận thì không.
     Giữ nguyên 20 câu để thang điểm vẫn tròn (0,5đ/câu). */
  var LEVELS = {
    de: {
      key: 'de', ten: 'Dễ', nhan: 'Mức DỄ',
      moTa: 'Bám sát chương trình, phần lớn là câu cơ bản và nâng vừa. Hợp để ôn tập thường ngày.',
      // Đề ôn thi vào lớp 6 dài hơi hơn: nhiều câu nhiều bước nên cho 60 phút.
      phut: { toan1: 40, toan3: 40, onthi: 60 },
      tierWeights: [30, 45, 25],
      preferInput: false,
      soCau: null                       // null => dùng cơ cấu chuẩn của từng lớp
    },
    tb: {
      key: 'tb', ten: 'Trung bình', nhan: 'Mức TRUNG BÌNH',
      moTa: 'Nặng về tư duy: bỏ hẳn câu cơ bản, phần lớn là câu thử thách, dồn câu sang '
        + 'toán có lời văn / tìm x / dãy số quy luật, và ưu tiên câu tự luận (không đoán được đáp án).',
      // Lớp 1 làm bài chậm hơn (đọc đề còn khó) nên cho ít thời gian hơn lớp 3.
      // Mức này gần sát đề thi vào lớp 6 thật nên cho 70 phút.
      phut: { toan1: 40, toan3: 50, onthi: 70 },
      tierWeights: [0, 10, 90],
      preferInput: true,
      soCau: {
        // Bớt câu tính máy móc, dồn sang các mạch phải suy luận — NHƯNG vẫn phủ đủ
        // mọi mạch để đề không lệch chương trình, và không dồn quá nhiều câu vào
        // một mạch (dồn nhiều thì đề lặp đi lặp lại một khuôn, đọc rất chán).
        toan3: {
          'so-100000': 1, 'cong-tru': 2, 'nhan-chia': 1, 'bieu-thuc': 3, 'chia-du': 2,
          'do-luong': 2, 'hinh-hoc': 2, 'loi-van': 4, 'tu-duy': 3
        },
        // LỚP 1 — lưu ý: ngân hàng câu lớp 1 khó nhất cũng chỉ 2 bước tính, nên độ khó
        // trần chỉ khoảng 1,6–1,7 lần mức dễ. Muốn hơn nữa phải viết thêm dạng câu mới,
        // mà như vậy có nguy cơ quá sức trẻ 6–7 tuổi. Cố tình dừng ở đây.
        toan1: {
          'so-100': 1, 'cong': 2, 'tru': 2, 'tinh-day': 2,
          'do-dai': 3, 'gio-tuan': 1, 'loi-van': 5, 'tu-duy': 4
        },
        // ÔN THI — dồn câu sang các mạch phải suy luận nhiều bước của đề thi vào
        // lớp 6 (toán điển hình, tỉ số phần trăm, chuyển động, tư duy); bớt câu tính
        // máy móc (số tự nhiên, đo lường) nhưng vẫn giữ đủ 10 mạch để không lệch đề.
        onthi: {
          'so-tu-nhien': 1, 'phan-so': 2, 'so-thap-phan': 2, 'do-luong': 1, 'ti-so-phan-tram': 3,
          'toan-dien-hinh': 4, 'hinh-phang': 2, 'hinh-khoi': 1, 'chuyen-dong': 2, 'tu-duy': 2
        }
      }
    }
  };
  var LEVEL_ORDER = ['de', 'tb'];

  var DeConfig = {
    CONFIG: CONFIG, TONG_CAU: TONG_CAU, TIER_WEIGHTS: TIER_WEIGHTS,
    LEVELS: LEVELS, LEVEL_ORDER: LEVEL_ORDER
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = DeConfig;
  if (typeof window !== 'undefined') window.DeConfig = DeConfig;
  if (typeof globalThis !== 'undefined') globalThis.DeConfig = DeConfig;
})();
