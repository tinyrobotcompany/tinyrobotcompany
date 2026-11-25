#!/usr/bin/env bash
# One-time setup for the Weekly Brief tools: Python packages and the brand fonts
# (Geist + Instrument Serif, both SIL Open Font License, fetched from npm).
set -euo pipefail
cd "$(dirname "$0")"
pip install --quiet --break-system-packages cairosvg pillow fonttools brotli 2>/dev/null \
  || pip install --quiet cairosvg pillow fonttools brotli
command -v ffmpeg >/dev/null || { echo "ffmpeg is required"; exit 1; }
mkdir -p .fonts && cd .fonts
[ -f Geist-Regular.ttf ] && [ -f InstrumentSerif-italic.ttf ] && { echo "fonts ok"; exit 0; }
npm pack geist @fontsource/instrument-serif --silent >/dev/null
for f in *.tgz; do mkdir -p "${f%.tgz}" && tar xzf "$f" -C "${f%.tgz}"; done
cp geist-*/package/dist/fonts/geist-sans/Geist-{Regular,Medium}.ttf .
cp geist-*/package/dist/fonts/geist-mono/GeistMono-Regular.ttf .
python3 - <<'EOF'
import glob
from fontTools.ttLib import TTFont
for style in ("normal", "italic"):
    src = glob.glob(f"fontsource-instrument-serif-*/package/files/instrument-serif-latin-400-{style}.woff2")[0]
    f = TTFont(src); f.flavor = None; f.save(f"InstrumentSerif-{style}.ttf")
EOF
rm -rf ./*.tgz geist-* fontsource-*
echo "fonts ok"
