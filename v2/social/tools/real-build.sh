#!/bin/zsh
# Render real.html to a finished video with its score and a contact sheet.
#   tools/real-build.sh <story|square> <frames url> <out.mp4> [work dir]
# Needs the site served at http://127.0.0.1:8765 (python3 -m http.server 8765 from the repo root) and the frame folders
# cut by tools/real-cuts.sh served at <frames url>. Frames are written as JPEGs to the work dir and deleted once encoded.
set -e
FMT=${1:?story or square}; FURL=${2:?frames url}; OUT=${3:?out.mp4}; WORK=${4:-$(mktemp -d)}
HERE=${0:A:h}
H=1920; [[ $FMT == square ]] && H=1080
DUR=33.0
mkdir -p "$WORK"; rm -rf "$WORK/frames-$FMT"
FRAMES=jpeg node "$HERE/render.mjs" video "http://127.0.0.1:8765/v2/social/real.html?fmt=$FMT&f=$FURL" "$WORK/frames-$FMT" 30 $DUR 1080 $H | tail -1
[[ -f "$WORK/real.wav" ]] || python3 "$HERE/score.py" real "$WORK/real.wav"
# H.264 + AAC, sized for Instagram (a story under 10 MB).
ffmpeg -v error -y -framerate 30 -i "$WORK/frames-$FMT/f%05d.jpg" -i "$WORK/real.wav" -c:v libx264 -preset slow -crf 21 -maxrate 1.6M -bufsize 3.2M \
  -pix_fmt yuv420p -profile:v high -movflags +faststart -c:a aac -b:a 160k -shortest "$OUT"
# Contact sheet: one frame every 1.5 s, labelled.
python3 - "$WORK/frames-$FMT" "${OUT:r}-sheet.png" $DUR <<'EOF'
import sys
from PIL import Image, ImageDraw
d, out, dur = sys.argv[1], sys.argv[2], float(sys.argv[3])
ts = [round(i * 1.5, 1) for i in range(int(dur / 1.5) + 1) if i * 1.5 < dur]
ims = [Image.open(f"{d}/f{min(int(t * 30), int(dur * 30) - 1):05d}.jpg") for t in ts]
w = 270; h = round(ims[0].height * w / ims[0].width); cols = 10
sheet = Image.new('RGB', (cols * w, ((len(ims) + cols - 1) // cols) * h), '#141416')
for i, (t, im) in enumerate(zip(ts, ims)):
    x, y = (i % cols) * w, (i // cols) * h
    sheet.paste(im.resize((w, h), Image.LANCZOS), (x, y))
    g = ImageDraw.Draw(sheet); g.rectangle([x, y, x + 58, y + 22], fill='#141416'); g.text((x + 5, y + 5), f"{t:4.1f}s", fill='#fff6ee')
sheet.save(out)
EOF
# Keep one full-size frame every 0.5 s for review, then drop the rest.
rm -rf "$WORK/keep-$FMT"; mkdir -p "$WORK/keep-$FMT"
for ((i = 0; i < DUR * 30; i += 15)); do cp "$WORK/frames-$FMT/f$(printf %05d $i).jpg" "$WORK/keep-$FMT/"; done
rm -rf "$WORK/frames-$FMT"
ls -la "$OUT" "${OUT:r}-sheet.png"
