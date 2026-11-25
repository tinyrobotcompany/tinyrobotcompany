#!/usr/bin/env python3
"""Render a Pico Pie vertical video (1080x1920, 30 fps) from a storyboard JSON.

    python3 render_video.py storyboards/example-3-ai-terms.json out/video.mp4
    python3 render_video.py storyboards/x.json out/x.mp4 --stills 2.5 9 19   # contact sheet only

Storyboard format (see storyboards/example-3-ai-terms.json):
{
  "duration": 41.5,
  "scenes": [ {"start": 0, "robot": "center", "face": "happy", "nod": false}, ... ],
  "texts":  [ {"text": "Line one\\nline *two*", "style": "headline", "y": 290, "in": 0.5, "out": 4.0}, ... ],
  "footer_at": 37.5,          # shows tinyrobotcompany.io near the bottom from this time
  "wink_at": 35.6             # Pico Pie winks from this time to the end
}
robot: "center" (big, lower half) or "top" (small, top; leaves room for cards/explanations)
face: happy | focus (blinks) | wink
styles: hero (one short line only), headline, sub, label, term, termsub, body, tip, cta, card
"*word*" colours a word robot-red. "\\n" forces a line break.
Keep text between y=250 and y=1500 (platform buttons cover the bottom and right edge).
"""
import io, json, math, os, subprocess, sys
from pathlib import Path

import cairosvg
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
FONTS = HERE / ".fonts"
W, H, FPS = 1080, 1920, 30

BG, FG, FG2, MUTE = (10, 10, 10), (237, 237, 238), (199, 199, 203), (123, 123, 132)
ROBOT, CREAM, SURFACE, LINE = (222, 58, 42), (251, 238, 218), (18, 18, 20), (38, 38, 43)

F = {
    "serif_i": FONTS / "InstrumentSerif-italic.ttf",
    "sans": FONTS / "Geist-Regular.ttf",
    "sans_m": FONTS / "Geist-Medium.ttf",
    "mono": FONTS / "GeistMono-Regular.ttf",
}
STYLES = {  # font, size, colour, max width, fit-on-one-line
    "hero": ("serif_i", 150, CREAM, 920, True),
    "headline": ("serif_i", 112, FG, 900, False),
    "sub": ("sans", 58, FG2, 900, False),
    "label": ("mono", 38, ROBOT, 900, False),
    "term": ("serif_i", 150, CREAM, 920, True),
    "termsub": ("sans_m", 52, MUTE, 900, False),
    "body": ("sans", 52, FG, 960, False),
    "tip": ("sans_m", 54, ROBOT, 900, False),
    "cta": ("sans_m", 56, FG, 900, False),
}

# ---------- Pico Pie, from the brand SVG ----------
def _robot_parts():
    svg = (REPO / "public/brand/mascot.svg").read_text()
    # body = everything except the face (eyes, cheeks, mouth) and the ground shadow
    keep = [l for l in svg.splitlines()
            if l.strip().startswith(("<line", "<circle", "<rect", "<ellipse cx=\"80\"", "<path d=\"M 208"))]
    return "\n".join(keep)

CHEEKS = ('<ellipse cx="78" cy="159" rx="10" ry="6" fill="#A6281B" opacity="0.6"/>'
          '<ellipse cx="222" cy="159" rx="10" ry="6" fill="#A6281B" opacity="0.6"/>')
FACES = {
    "happy": '<path d="M 86 136 Q 106 102 126 136" stroke="#0F0F10" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M 174 136 Q 194 102 214 136" stroke="#0F0F10" stroke-width="8" stroke-linecap="round" fill="none"/>' + CHEEKS + '<path d="M 138 166 Q 150 176 162 166" stroke="#0F0F10" stroke-width="5" stroke-linecap="round" fill="none"/>',
    "focus": '<circle cx="106" cy="128" r="10" fill="#0F0F10"/><circle cx="194" cy="128" r="10" fill="#0F0F10"/><circle cx="106" cy="125" r="3" fill="#FFFFFF" opacity="0.85"/><circle cx="194" cy="125" r="3" fill="#FFFFFF" opacity="0.85"/>' + CHEEKS + '<path d="M 138 168 Q 150 180 162 168" stroke="#0F0F10" stroke-width="5" stroke-linecap="round" fill="none"/>',
    "blink": '<path d="M 96 128 L 116 128" stroke="#0F0F10" stroke-width="7" stroke-linecap="round"/><path d="M 184 128 L 204 128" stroke="#0F0F10" stroke-width="7" stroke-linecap="round"/>' + CHEEKS + '<path d="M 138 168 Q 150 180 162 168" stroke="#0F0F10" stroke-width="5" stroke-linecap="round" fill="none"/>',
    "wink": '<path d="M 86 136 Q 106 102 126 136" stroke="#0F0F10" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="194" cy="128" r="10" fill="#0F0F10"/><circle cx="194" cy="125" r="3" fill="#FFFFFF" opacity="0.85"/>' + CHEEKS + '<path d="M 130 164 Q 150 186 170 164" stroke="#0F0F10" stroke-width="5" stroke-linecap="round" fill="none"/>',
}
RS, PAD = 2.0, 90
BEACON = (PAD + 150 * RS, PAD + 28 * RS)
LAYOUT = {"center": (540, 1190, 1.0), "top": (540, 520, 0.55)}


def _load_robot():
    body = _robot_parts()
    out = {}
    for k, face in FACES.items():
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 320">{body}{face}</svg>'
        png = cairosvg.svg2png(bytestring=svg.encode(), output_width=int(300 * RS), output_height=int(320 * RS))
        im = Image.open(io.BytesIO(png)).convert("RGBA")
        c = Image.new("RGBA", (im.width + 2 * PAD, im.height + 2 * PAD), (0, 0, 0, 0))
        c.paste(im, (PAD, PAD), im)
        out[k] = c
    return out


def ease_io(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def ease_out_back(x):
    return 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2


def lerp(a, b, x):
    return a + (b - a) * x


# ---------- text ----------
def _font(key, size):
    return ImageFont.truetype(str(F[key]), size)


def _wrap(words, f, maxw):
    lines, cur = [], []
    for w in words:
        test = " ".join(x for x, _ in cur + [w])
        if cur and f.getlength(test) > maxw:
            lines.append(cur)
            cur = [w]
        else:
            cur.append(w)
    lines.append(cur)
    return lines


def text_layer(text, style):
    fk, size, color, maxw, fit = STYLES[style]
    f = _font(fk, size)
    plain = text.replace("*", "")
    if fit:
        while max(f.getlength(l) for l in plain.split("\n")) > maxw:
            size -= 4
            f = _font(fk, size)
    lines = []
    for part in text.split("\n"):
        words = [(w.replace("*", ""), "*" in w) for w in part.split()]
        lines += _wrap(words, f, maxw)
    asc, desc = f.getmetrics()
    lh = int(size * 1.14)
    im = Image.new("RGBA", (W, lh * (len(lines) - 1) + asc + desc + 12), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for i, ln in enumerate(lines):
        total = f.getlength(" ".join(w for w, _ in ln))
        x = (W - total) / 2
        for w, hi in ln:
            d.text((x, i * lh), w, font=f, fill=ROBOT if hi else color)
            x += f.getlength(w + " ")
    return im


def card_layer(num, label):
    w, h = 900, 190
    im = Image.new("RGBA", (W, h + 4), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x0 = (W - w) // 2
    d.rounded_rectangle([x0, 2, x0 + w, 2 + h], radius=30, fill=SURFACE + (255,), outline=LINE + (255,), width=2)
    d.text((x0 + 48, 2 + h / 2), num, font=_font("mono", 44), fill=ROBOT, anchor="lm")
    f = _font("sans_m", 50)
    lines = [" ".join(w for w, _ in l) for l in _wrap([(x, False) for x in label.split()], f, w - 200)]
    y0 = 2 + h / 2 - (len(lines) - 1) * 30
    for i, ln in enumerate(lines):
        d.text((x0 + 150, y0 + i * 60), ln, font=f, fill=FG, anchor="lm")
    return im


class Text:
    def __init__(self, spec):
        if spec.get("style") == "card":
            self.layer = card_layer(spec["num"], spec["text"])
        else:
            self.layer = text_layer(spec["text"], spec["style"])
        self.y, self.t_in, self.t_out = spec["y"], spec["in"], spec["out"]

    def draw(self, frame, t):
        if not (self.t_in <= t < self.t_out):
            return
        a_in = ease_io((t - self.t_in) / 0.45)
        a = a_in * (1 - ease_io((t - (self.t_out - 0.3)) / 0.3) if t > self.t_out - 0.3 else a_in)
        if a <= 0:
            return
        lay = self.layer
        if a < 1:
            lay = lay.copy()
            lay.putalpha(lay.getchannel("A").point(lambda v: int(v * a)))
        frame.alpha_composite(lay, (0, max(0, int(self.y + (1 - a_in) * 34))))


# ---------- video ----------
class Video:
    def __init__(self, board):
        self.b = board
        self.scenes = sorted(board["scenes"], key=lambda s: s["start"])
        self.texts = [Text(s) for s in board["texts"]]
        self.robot = _load_robot()
        hd = Image.new("RGBA", (W, 80), (0, 0, 0, 0))
        d = ImageDraw.Draw(hd)
        d.ellipse([80, 26, 100, 46], fill=ROBOT)
        d.text((118, 36), "TINY ROBOT COMPANY", font=_font("mono", 30), fill=FG2, anchor="lm")
        d.text((W - 80, 36), board.get("header_right", "WEEKLY BRIEF"), font=_font("mono", 30), fill=MUTE, anchor="rm")
        self.header = hd
        self.footer = Text({"text": "tinyrobotcompany.io", "style": "label", "y": 1560, "in": board.get("footer_at", 1e9), "out": 1e9})
        self.footer.layer = text_layer("tinyrobotcompany.io", "label")
        self.footer.layer = self._recolor(self.footer.layer, MUTE)

    @staticmethod
    def _recolor(im, rgb):
        solid = Image.new("RGBA", im.size, rgb + (255,))
        solid.putalpha(im.getchannel("A"))
        return solid

    def _scene_at(self, t):
        cur = self.scenes[0]
        for s in self.scenes:
            if s["start"] <= t:
                cur = s
        return cur

    def robot_state(self, t):
        cur = self._scene_at(t)
        i = self.scenes.index(cur)
        prev = self.scenes[i - 1] if i > 0 else cur
        a, b = LAYOUT[prev.get("robot", "center")], LAYOUT[cur.get("robot", "center")]
        x = ease_io((t - cur["start"]) / 0.8)
        cx, cy, sc = (lerp(a[k], b[k], x) for k in range(3))
        if t < 0.9:
            cy = lerp(-500, cy, ease_out_back(t / 0.9))
        ang = 0.0
        if cur.get("nod") and cur["start"] + 0.6 <= t < cur["start"] + 1.2:
            ang = math.sin((t - cur["start"] - 0.6) / 0.6 * math.pi) * 6
        if cur.get("wave") and cur["start"] <= t < cur["start"] + 2.4:
            ang = math.sin((t - cur["start"]) * 2 * math.pi / 0.8) * 7 * (1 - (t - cur["start"]) / 2.4)
        cy += math.sin(t * 2 * math.pi / 2.6) * 6 * sc
        face = cur.get("face", "happy")
        if face == "focus" and (t % 3.1) < 0.14:
            face = "blink"
        if t >= self.b.get("wink_at", 1e9):
            face = "wink"
        return cx, cy, sc, ang, face

    def draw_robot(self, frame, t):
        cx, cy, sc, ang, face = self.robot_state(t)
        im = self.robot[face].copy()
        d = ImageDraw.Draw(im)
        for off in (0.0, 0.7):
            p = ((t + off) % 1.4) / 1.4
            r, a = lerp(18, 64, p), int(190 * max(0, 1 - p / 0.8))
            if a:
                bx, by = BEACON
                d.ellipse([bx - r, by - r, bx + r, by + r], outline=CREAM + (a,), width=max(2, int(lerp(6, 2, p))))
        if abs(ang) > 0.01:
            im = im.rotate(ang, resample=Image.BICUBIC, center=(im.width / 2, im.height * 0.7))
        if sc != 1.0:
            im = im.resize((int(im.width * sc), int(im.height * sc)), Image.LANCZOS)
        frame.paste(im, (int(cx - im.width / 2), int(cy - im.height / 2)), im)

    def render(self, t):
        frame = Image.new("RGBA", (W, H), BG + (255,))
        frame.alpha_composite(self.header, (0, 120))
        for x in self.texts:
            x.draw(frame, t)
        self.draw_robot(frame, t)
        self.footer.draw(frame, t)
        return frame.convert("RGB")


def encode(video, out, tmpdir):
    starts = [s["start"] for s in video.scenes] + [video.b["duration"]]
    files = []
    for i in range(len(starts) - 1):
        a, b = starts[i], starts[i + 1]
        tmp, fin = tmpdir / f"part{i}.tmp.mp4", tmpdir / f"part{i}.mp4"
        p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                              "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-crf", "19", "-preset", "veryfast",
                              "-pix_fmt", "yuv420p", str(tmp)], stdin=subprocess.PIPE)
        for k in range(round((b - a) * FPS)):
            p.stdin.write(video.render(a + k / FPS).tobytes())
        p.stdin.close()
        if p.wait() != 0:
            sys.exit(f"ffmpeg failed on part {i}")
        os.rename(tmp, fin)
        files.append(fin)
    lst = tmpdir / "list.txt"
    lst.write_text("".join(f"file '{f}'\n" for f in files))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst),
                    "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-shortest", "-c:v", "copy", "-c:a", "aac",
                    "-movflags", "+faststart", str(out)], check=True)


def main():
    board_path, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.parent.mkdir(parents=True, exist_ok=True)
    video = Video(json.loads(board_path.read_text()))
    if "--stills" in sys.argv:
        ts = [float(x) for x in sys.argv[sys.argv.index("--stills") + 1:]]
        ims = [video.render(t).resize((360, 640)) for t in ts]
        sheet = Image.new("RGB", (370 * len(ims), 640), (60, 60, 60))
        for i, im in enumerate(ims):
            sheet.paste(im, (i * 370, 0))
        sheet.save(out.with_suffix(".png"))
        print(out.with_suffix(".png"))
        return
    tmpdir = out.parent / f".{out.stem}-parts"
    tmpdir.mkdir(exist_ok=True)
    encode(video, out, tmpdir)
    print(out)


if __name__ == "__main__":
    main()
