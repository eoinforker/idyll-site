#!/bin/zsh
# Cut the real screen recordings into 30 fps frame folders for real.html (the ad made from the phone's own recordings).
#   tools/real-cuts.sh <footage dir> <out dir> [width] [cut names...]   (no names: every cut)
# Use the privacy-blurred copies as <footage dir>. The frames never go in the repo: point <out dir> outside it.
# Each cut is <name> <clip prefix> <from s> <to s> <status fill>: <px> copies the row below down over the bar,
# <px>:<rrggbb> paints the bar that solid colour (for pages that scroll under it). Frame i of a cut is the recording at from + i / 30 s.
# The recorder writes a frame only when the screen changes, so fps runs before trim: held frames are kept.
# The recorded status bar (top 120 px of 1200, with the phone's notification icons; 150 where the blur pass's box reaches lower) is painted over with the
# colour just beneath it; real.html draws a clean status bar on top.
set -e
SRC=${1:?footage dir}; OUT=${2:?out dir}; W=${3:-632}; ONLY=(${@:4})
CUTS=(
  hook     04   28.80  34.30 150:0b1013
  explore  04   57.10  62.20 138:0b1013
  shorts   05   31.90  36.50 150:0f0f0f
  claim    02   43.60  46.60 140:141416
  pause    05    1.90   7.60 150
  focus    03a   9.00  14.60 150
  yt14     14   18.50  27.60 150
)
mkdir -p "$OUT"
for ((i = 1; i <= ${#CUTS}; i += 5)); do
  name=${CUTS[i]} clip=${CUTS[i+1]} a=${CUTS[i+2]} b=${CUTS[i+3]} fill=${CUTS[i+4]}
  if (( ${#ONLY} )) && (( ! ${ONLY[(Ie)$name]} )); then continue; fi
  f=$(print -l "$SRC"/"$clip "*.mp4(N) | head -1)
  if [[ -z $f ]]; then echo "missing: $clip ($name)"; continue; fi
  if ! ffprobe -v error -show_entries format=duration -of csv=p=0 "$f" >/dev/null 2>&1; then echo "not ready: $clip ($name)"; continue; fi
  rm -rf "$OUT/$name.new"; mkdir -p "$OUT/$name.new"
  if [[ $fill == *:* ]]; then
    vf="[0:v]fps=30:start_time=0,trim=start=${a}:end=${b},setpts=PTS-STARTPTS,drawbox=x=0:y=0:w=iw:h=${fill%%:*}:color=0x${fill##*:}:t=fill,scale=${W}:-2:flags=lanczos"
  else
    vf="[0:v]fps=30:start_time=0,trim=start=${a}:end=${b},setpts=PTS-STARTPTS,split[m][s];[s]crop=iw:4:0:$((fill + 2)),scale=iw:${fill}:flags=neighbor[bar];[m][bar]overlay=0:0,scale=${W}:-2:flags=lanczos"
  fi
  ffmpeg -v error -y -i "$f" -filter_complex "$vf" \
    -q:v 3 "$OUT/$name.new/f%04d.jpg"
  rm -rf "$OUT/$name"; mv "$OUT/$name.new" "$OUT/$name"
  echo "$name $(ls "$OUT/$name" | wc -l | tr -d ' ') frames"
done
