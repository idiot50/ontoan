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
    }
  };

  // Tổng số câu mỗi đề (giữ cố định để điểm luôn tròn: 20 câu × 0,5đ = 10đ).
  var TONG_CAU = 20;
  // Trọng số tầng độ khó mặc định cho ĐỀ ÔN CUỐI NĂM (ưu tiên suy luận hơn mặc định engine).
  var TIER_WEIGHTS = [30, 45, 25]; // tier 0 / 1 / 2

  var DeConfig = { CONFIG: CONFIG, TONG_CAU: TONG_CAU, TIER_WEIGHTS: TIER_WEIGHTS };
  if (typeof module !== 'undefined' && module.exports) module.exports = DeConfig;
  if (typeof window !== 'undefined') window.DeConfig = DeConfig;
  if (typeof globalThis !== 'undefined') globalThis.DeConfig = DeConfig;
})();
