#!/usr/bin/env bash
# =============================================================================
# rotate-keys.sh — Đổi (rotate) 3 khóa PayOS AN TOÀN trên server.
#  - Nhập khóa MỚI trực tiếp qua bàn phím (read -s) -> KHÔNG hiện ra màn hình,
#    KHÔNG vào chat, KHÔNG vào lịch sử lệnh.
#  - Sao lưu .env cũ, chỉ thay 3 dòng khóa, giữ nguyên cấu hình khác (chmod 600).
#  - Khởi động lại service, kiểm tra health, rồi ĐĂNG KÝ LẠI webhook với khóa mới.
#
# CÁCH CHẠY (từ máy của bạn, cần TTY nên có cờ -t):
#   ssh -t -i C:\Users\giaph\Downloads\ngp.pem ubuntu@3.104.106.255 \
#       "bash /opt/payos-backend/rotate-keys.sh"
#
# Lấy khóa MỚI ở: PayOS Dashboard -> Kênh thanh toán -> "Thông tin xác thực API"
#   (Client ID / API Key / Checksum Key) -> bấm tạo lại (regenerate) nếu cần.
# =============================================================================
set -euo pipefail
ENV_FILE=/opt/payos-backend/.env
[ -f "$ENV_FILE" ] || { echo "❌ Không thấy $ENV_FILE"; exit 1; }

echo "===== ĐỔI KHÓA PayOS (dán khóa MỚI từ Dashboard) ====="
read -rp  "PAYOS_CLIENT_ID    : " CID
read -rsp "PAYOS_API_KEY      : " AKEY; echo
read -rsp "PAYOS_CHECKSUM_KEY : " CKEY; echo
if [ -z "${CID}" ] || [ -z "${AKEY}" ] || [ -z "${CKEY}" ]; then
  echo "❌ Thiếu giá trị — hủy, KHÔNG thay đổi gì."; exit 1
fi

# Sao lưu rồi viết lại: bỏ 3 dòng khóa cũ, thêm 3 dòng khóa mới ở cuối.
backup="${ENV_FILE}.bak.$(date +%Y%m%d-%H%M%S)"
cp -a "$ENV_FILE" "$backup"
tmp=$(mktemp)
grep -vE '^(PAYOS_CLIENT_ID|PAYOS_API_KEY|PAYOS_CHECKSUM_KEY)=' "$ENV_FILE" > "$tmp" || true
{
  echo "PAYOS_CLIENT_ID=${CID}"
  echo "PAYOS_API_KEY=${AKEY}"
  echo "PAYOS_CHECKSUM_KEY=${CKEY}"
} >> "$tmp"
install -m 600 -o "$(id -un)" "$tmp" "$ENV_FILE"
rm -f "$tmp"
echo "✅ Đã cập nhật $ENV_FILE (chmod 600). Bản sao lưu: $backup"

echo "----- Khởi động lại service -----"
sudo systemctl restart payos-backend
sleep 2
echo -n "health: "; curl -s http://127.0.0.1:8787/health; echo

echo "----- Đăng ký lại webhook với khóa mới -----"
# Dùng THẲNG 3 khóa vừa nhập (không source cả .env để tránh lỗi dòng có dấu cách).
if PAYOS_CLIENT_ID="$CID" PAYOS_API_KEY="$AKEY" PAYOS_CHECKSUM_KEY="$CKEY" \
     python3 /opt/payos-backend/server.py --confirm-webhook; then
  echo "🎉 XONG: khóa đã đổi & webhook đã đăng ký lại."
else
  echo "⚠️  Đổi khóa xong nhưng confirm-webhook chưa thành công — kiểm tra lại khóa/URL."
fi
