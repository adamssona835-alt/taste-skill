#!/usr/bin/env bash
# Hela pipelinen, steg för steg som i Nicks video:
#   1+2. Nyckelbilder + transition-video  (Nano Banana 2 + Kling)
#        -> här: scene.html renderas till PNG och kodas till out/transition.mp4
#        -> har du en riktig Kling-video: KLING_VIDEO=min.mp4 ./build.sh
#   3.   ffmpeg plockar ut bildrutor som WEBP till ../site/frames/
#   4.   Sajten (../site/index.html) ritar dem på <canvas> styrt av scroll.
set -euo pipefail
cd "$(dirname "$0")"

FRAMES="${FRAMES:-150}"     # Nick landar runt 120–180 rutor
WIDTH="${WIDTH:-1440}"      # bredd på webb-rutorna
QUALITY="${QUALITY:-72}"    # WEBP-kvalitet
OUT_SITE=../site/frames

if [[ -z "${KLING_VIDEO:-}" ]]; then
  rm -rf out/png && mkdir -p out
  NODE_PATH="$(npm root -g)" PLAYWRIGHT_PATH="$(npm root -g)/playwright" node render-frames.mjs "$FRAMES" out/png
  ffmpeg -y -loglevel error -framerate 30 -i out/png/f_%04d.png \
    -c:v libx264 -pix_fmt yuv420p -crf 18 out/transition.mp4
  VIDEO=out/transition.mp4
else
  VIDEO="$KLING_VIDEO"
fi

# Jämnt fördelade rutor oavsett videolängd
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO")
FPS=$(python3 -c "print($FRAMES / $DUR)")

rm -rf "$OUT_SITE" && mkdir -p "$OUT_SITE"
ffmpeg -y -loglevel error -i "$VIDEO" \
  -vf "fps=$FPS,scale=$WIDTH:-2:flags=lanczos" \
  -c:v libwebp -quality "$QUALITY" -compression_level 6 \
  "$OUT_SITE/f_%04d.webp"

N=$(ls "$OUT_SITE" | wc -l)
echo "{\"count\": $N}" > "$OUT_SITE/manifest.json"
echo "Extraherade $N WEBP-rutor ($(du -sh "$OUT_SITE" | cut -f1)) till $OUT_SITE"
