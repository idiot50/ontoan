#!/usr/bin/env bash
cd /d/toanlop3/build || exit 1
run() {
  local pdf="$1" pre="$2" pages="$3"
  echo "[START $pre] expected $((pages*2)) tiles"
  node --max-old-space-size=4096 tiles.mjs "$pdf" "$pre" 2.6 2 all > "log_$pre.txt" 2>&1
  local rc=$?
  local n; n=$(ls tiles/${pre}_*.png 2>/dev/null | wc -l)
  echo "[DONE $pre] rc=$rc tiles=$n / expected $((pages*2))"
}
run "../Huong_Dan_Hoc_Toan_3_Tap_1_Archimede_2024_2025-compressed.pdf" t3a 110
run "../Huong_Dan_Hoc_Toan_3_Tap_2_Archimede_2024_2025-compressed.pdf" t3b 110
run "../Huong_Dan_Hoc_Toan_1_Tap_1_Archimede_2024_2025-compressed.pdf" t1a 125
run "../Huong_Dan_Hoc_Toan_1_Tap_2_Archimede_2024_2025.pdf" t1b 94
echo "ALL_DONE"
