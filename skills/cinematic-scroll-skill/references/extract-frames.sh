#!/usr/bin/env bash
# Turn a generated clip into a scroll sequence.
#
#   ./extract-frames.sh clip.mp4 out/frames [frames=120] [width=1280] [format=webp|jpg] [quality]
#
# Budget: keep a sequence under ~3 MB. 120 frames at 1280px WebP q70 is usually 1.5-3 MB.
# Also writes poster.jpg (the last frame) for no-JS / reduced motion, and prints
# the backdrop colour of frame 1 so the page colour can be matched to it.
set -euo pipefail
IN=${1:?clip}; OUT=${2:?out dir}; N=${3:-120}; W=${4:-1280}; FMT=${5:-webp}; Q=${6:-}
mkdir -p "$OUT"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
FPS=$(python3 -c "print(round($N/$DUR, 4))")
if [ "$FMT" = "webp" ]; then
  ffmpeg -v error -y -i "$IN" -vf "fps=$FPS,scale=$W:-2:flags=lanczos" -frames:v "$N" \
    -c:v libwebp -quality "${Q:-70}" -compression_level 6 "$OUT/frame_%03d.webp"
else
  ffmpeg -v error -y -i "$IN" -vf "fps=$FPS,scale=$W:-2:flags=lanczos" -frames:v "$N" \
    -q:v "${Q:-5}" "$OUT/frame_%03d.jpg"
fi
COUNT=$(ls "$OUT" | grep -c "^frame_")
LAST=$(ls "$OUT"/frame_* | tail -1)
ffmpeg -v error -y -i "$LAST" -q:v 3 "$OUT/poster.jpg"
FIRST=$(ls "$OUT"/frame_* | head -1)
# Backdrop sample: a 16px patch at the top centre of frame 1 (corners are often vignetted).
HEX=$(ffmpeg -v error -i "$FIRST" -vf "crop=16:16:(iw-16)/2:8,scale=1:1" -f rawvideo -pix_fmt rgb24 - | od -An -tx1 | tr -d ' \n')
echo "frames: $COUNT  size: $(du -sh "$OUT" | cut -f1)  backdrop: #$HEX"
echo "markup: data-frames=\"$COUNT\" data-src=\"$(basename "$OUT")/frame_{i}.$FMT\" data-pad=\"3\""
