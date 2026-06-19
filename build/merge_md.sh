#!/usr/bin/env bash
# Ghép các fragment frag/<prefix>_<start>-<end>.md theo thứ tự trang thành 1 file/quyển.
cd /d/toanlop3/build || exit 1
declare -A TITLE=(
  [t1a]="HƯỚNG DẪN HỌC TOÁN 1 — TẬP MỘT (Archimedes 2024–2025)"
  [t1b]="HƯỚNG DẪN HỌC TOÁN 1 — TẬP HAI (Archimedes 2024–2025)"
  [t3a]="HƯỚNG DẪN HỌC TOÁN 3 — TẬP MỘT (Archimedes 2024–2025)"
  [t3b]="HƯỚNG DẪN HỌC TOÁN 3 — TẬP HAI (Archimedes 2024–2025)"
)
for pre in t1a t1b t3a t3b; do
  out="noidung_${pre}.md"
  frags=$(ls frag/${pre}_*.md 2>/dev/null | sort)
  [ -z "$frags" ] && { echo "skip $pre (no fragments)"; continue; }
  {
    echo "# ${TITLE[$pre]}"
    echo ""
    echo "> Bản chép nội dung từ sách scan (OCR có hỗ trợ). Có thể còn vài chỗ cần rà lại."
    echo ""
    for f in $frags; do
      cat "$f"; echo ""
    done
  } > "$out"
  echo "wrote $out  ($(wc -l < "$out") dòng, từ $(echo "$frags" | wc -l) mảnh)"
done
