#!/bin/zsh
# Render the premium B set: ./render.sh posts|stories [ids...]. Needs the site served at :8765 (python3 -m http.server 8765 from the site root).
# A render that stalls (Chrome sometimes never answers) is killed after 60 s and tried again.
cd "$(dirname "$0")"
kind=$1; shift; OUT=${OUT:-~/Desktop/"Idyll premium"/B}/$kind; mkdir -p "$OUT"
ids=($@)
(( $#ids )) || ids=($(grep -o 'data-piece="[^"]*"' $kind.html | cut -d'"' -f2))
h=1350; [[ $kind == stories ]] && h=1920
one() {
  local n=$1 out="$OUT/$1.png"
  for try in 1 2 3; do
    rm -f "$out"
    node ../tools/render.mjs shot "http://127.0.0.1:8765/v2/social/premium-b/$kind.html?n=$n" "$out" 1080 $h & local pid=$!
    for i in {1..60}; do kill -0 $pid 2>/dev/null || break; sleep 1; done
    kill -0 $pid 2>/dev/null && { kill $pid; sleep 1; continue; }
    [[ -s "$out" ]] && return 0
  done
  echo "failed: $n" >&2
}
k=0
for n in $ids; do one $n & (( ++k % 3 == 0 )) && wait; done
wait
