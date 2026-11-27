#!/usr/bin/env python3
"""Render an Instagram carousel (1080x1350 PNG slides) from a JSON spec, in the Pico Pie style.

    python3 render_carousel.py carousels/example-3-ai-terms.json out/carousel/
    -> out/carousel/slide-01.png ... slide-NN.png, plus out/carousel/contact-sheet.png

Spec format (see carousels/example-3-ai-terms.json):
{
  "slides": [
    {"type": "cover", "label": "AI, EXPLAINED", "title": "3 AI terms you'll\\nhear everywhere", "text": "Here's what they actually mean."},
    {"type": "point", "label": "TERM 01 / 03", "title": "LLM", "subtitle": "Large language model", "text": "...", "tip": "optional red line"},
    {"type": "cta", "title": "Follow for more", "text": "The Weekly Brief, every Monday: newsletter link in bio."}
  ]
}
6 to 10 slides: one cover, the points, one closing "cta" slide. Keep every text short: a slide is read
in 3 seconds. "*word*" colours a word robot-red and "\\n" forces a line break, as in the videos.
Always open contact-sheet.png and check nothing overlaps before handing the slides over.
"""
import json, sys
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parent))
import render_video as rv  # noqa: E402  (shared fonts, colours, text and robot drawing)

W, H = 1080, 1350
TOP, BOTTOM = 210, 1150  # text area


def _header(counter):
    im = Image.new("RGBA", (W, 80), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse([80, 26, 100, 46], fill=rv.ROBOT)
    d.text((118, 36), "TINY ROBOT COMPANY", font=rv._font("mono", 30), fill=rv.FG2, anchor="lm")
    d.text((W - 80, 36), counter, font=rv._font("mono", 30), fill=rv.MUTE, anchor="rm")
    return im


def _robot(robots, face, scale):
    im = robots[face]
    return im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)


def _stack(frame, layers, y, gap=28):
    for lay in layers:
        if lay is None:
            continue
        frame.alpha_composite(lay, (0, y))
        y += lay.height + gap
    return y


def _footer(frame, right=None):
    d = ImageDraw.Draw(frame)
    d.text((80, H - 70), "tinyrobotcompany.io", font=rv._font("mono", 28), fill=rv.MUTE, anchor="lm")
    if right:
        d.text((W - 80, H - 70), right, font=rv._font("mono", 28), fill=rv.ROBOT, anchor="rm")


def render_slide(slide, i, n, robots):
    frame = Image.new("RGBA", (W, H), rv.BG + (255,))
    frame.alpha_composite(_header(f"{i:02d} / {n:02d}"), (0, 70))
    kind = slide.get("type", "point")
    t = lambda key, style: rv.text_layer(slide[key], style) if slide.get(key) else None  # noqa: E731

    if kind == "cover":
        end = _stack(frame, [t("label", "label"), t("title", "headline"), t("text", "sub")], TOP)
        bot = _robot(robots, "happy", 0.62)
        frame.alpha_composite(bot, ((W - bot.width) // 2, max(end, H - 110 - bot.height)))
        _footer(frame, "SWIPE →")
    elif kind == "cta":
        end = _stack(frame, [t("title", "headline"), t("text", "sub")], TOP + 20)
        bot = _robot(robots, "wink", 0.62)
        frame.alpha_composite(bot, ((W - bot.width) // 2, max(end, H - 110 - bot.height)))
        _footer(frame)
    else:
        title_style = "term" if len(slide.get("title", "")) <= 14 and "\n" not in slide.get("title", "") else "headline"
        layers = [l for l in [t("label", "label"), t("title", title_style), t("subtitle", "termsub"),
                              t("text", "body"), t("tip", "tip")] if l is not None]
        total = sum(l.height for l in layers) + 28 * (len(layers) - 1)
        _stack(frame, layers, max(TOP, TOP + (BOTTOM - 80 - TOP - total) // 2))
        bot = _robot(robots, "focus", 0.32)
        frame.alpha_composite(bot, (W - bot.width - 30, H - bot.height - 10))
        _footer(frame)
    return frame.convert("RGB")


def main():
    spec, out = json.loads(Path(sys.argv[1]).read_text()), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    robots = rv._load_robot()
    slides = spec["slides"]
    ims = []
    for i, s in enumerate(slides, 1):
        im = render_slide(s, i, len(slides), robots)
        im.save(out / f"slide-{i:02d}.png")
        ims.append(im)
    cols = min(len(ims), 5)
    rows = (len(ims) + cols - 1) // cols
    tw, th = 324, 405
    sheet = Image.new("RGB", (cols * (tw + 10), rows * (th + 10)), (60, 60, 60))
    for k, im in enumerate(ims):
        sheet.paste(im.resize((tw, th)), ((k % cols) * (tw + 10), (k // cols) * (th + 10)))
    sheet.save(out / "contact-sheet.png")
    print(out)


if __name__ == "__main__":
    main()
