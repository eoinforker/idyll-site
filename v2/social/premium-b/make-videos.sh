#!/bin/zsh
# Render the six videos in both formats with their music: ./make-videos.sh [names...]. Needs the site served at :8765.
# Frames at 30 fps through ../tools/render.mjs, the score from score.py, then H.264 + AAC, each well under 8 MB.
cd "$(dirname "$0")"
OUT=${OUT:-~/Desktop/"Idyll premium"/B}/videos; mkdir -p "$OUT"
WORK=${WORK:-${TMPDIR:-/tmp}/idyll-premium-b}; mkdir -p "$WORK"
names=($@); (( $#names )) || names=(shorts words focus sleep stays free)
typeset -A num; num=(shorts 01 words 02 focus 03 sleep 04 stays 05 free 06)
one() {
  local v=$1 f=$2 h=1920; [[ $f == feed ]] && h=1350
  local D="$WORK/$v-$f"; rm -rf "$D"
  node ../tools/render.mjs video "http://127.0.0.1:8765/v2/social/premium-b/video.html?v=$v&fmt=$f" "$D" 30 12 1080 $h >/dev/null
  ffmpeg -y -loglevel error -framerate 30 -i "$D/f%05d.png" -i "$WORK/$v.wav" -c:v libx264 -preset slow -crf 21 -maxrate 4M -bufsize 8M \
    -pix_fmt yuv420p -c:a aac -b:a 160k -shortest -movflags +faststart "$OUT/$num[$v]-$v-$f.mp4"
  rm -rf "$D"
}
for v in $names; do python3 score.py $v "$WORK/$v.wav" >/dev/null; done
for v in $names; do one $v story & one $v feed & wait; done
ls -la "$OUT"
