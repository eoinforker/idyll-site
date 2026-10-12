#!/bin/zsh
# Render direction pieces: ./render.sh a-print A [feed story store]. Needs the site served at :8765 (python3 -m http.server 8765 from the site root).
cd "$(dirname "$0")"
page=$1; L=$2; shift 2; pieces=($@); (( $#pieces )) || pieces=(feed story store); OUT=~/Desktop/"Idyll directions"
for p in $pieces; do
  h=1920; [[ $p == feed ]] && h=1350
  node ../tools/render.mjs shot "http://127.0.0.1:8765/v2/social/directions/$page.html?p=$p" "$OUT/$L-$p.png" 1080 $h
done
