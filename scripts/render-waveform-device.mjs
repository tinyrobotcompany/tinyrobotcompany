/**
 * A mock of Waveform One, drawn from its own design files rather than photographed:
 *
 * - Cabinet: the Revision B enclosure in tinyrobotcompany/Waveform_One,
 *   mechanical/cad (parameters.py, layout.py, colours.toml): black PETG,
 *   two white bands wrapping the cabinet, "W A V E F O R M   O N E" on the
 *   front, a 7-inch screen and a P3 64×32 LED panel side by side, and two
 *   magnetic holders carrying a 12-inch LP sleeve on top.
 * - Screen: the ESP32-P4 "Now Playing" layout in firmware/esp32/p4_display/
 *   main/main.cpp (1024×600, 390 px artwork, NOW PLAYING heading), coloured
 *   from the cover as album_palette.h does.
 * - LED panel: the default Mirrored style (see waveform-panel.mjs).
 *
 * The record, its cover and the track are invented for the illustration.
 *
 *   node scripts/render-waveform-device.mjs > .tmp/waveform-device.svg
 *
 * Then screenshot the SVG in a browser and save it as
 * public/works/waveform-device.webp, which the site uses.
 */

import { classic, GLOW, H, LABEL, mirrored, panel, PANEL_H, PANEL_W, RGB, spectrum, W, waterfall } from "./waveform-panel.mjs";

// ---- Enclosure parameters (mm), from mechanical/cad/waveform_one/parameters.py ----
const SHELL_WALL = 4, SIDE_BAND = 12, DIVIDER = 12, TOP_BAND = 12, BOTTOM_BAND = 12;
const SCREEN_W = 165, SCREEN_H = 100, ACTIVE_W = 154.2, ACTIVE_H = 86, WINDOW_MARGIN = 1;
const LED_W = 191.8, LED_H = 95.8, LED_LIP = 1;
const DEPTH = 150;
const STRIPES = [[10, 30], [40, 60]]; // white bands, from the front face
const ALBUM = 315, SLOT_DEPTH = 18, HOLDER = { len: 50, depth: 40, h: 24, x: 110, rearInset: 10 };

// layout.py
const CASE_W = 2 * (SHELL_WALL + SIDE_BAND) + SCREEN_W + DIVIDER + LED_W; // 400.8
const ZONE_H = Math.max(SCREEN_H, LED_H);
const CASE_H = 2 * SHELL_WALL + TOP_BAND + BOTTOM_BAND + ZONE_H; // 132
const ZONE_CZ = SHELL_WALL + BOTTOM_BAND + ZONE_H / 2;
const SCREEN_X = -CASE_W / 2 + SHELL_WALL + SIDE_BAND;
const LED_X = SCREEN_X + SCREEN_W + DIVIDER;

// ---- Projection: front elevation with a shallow oblique top and right side ----
const S = 2.6; // px per mm
const KX = 0.34, KY = 0.2; // how far depth shifts right and up
const OX = 90 + (CASE_W / 2) * S, OY = 1260;
const pt = (x, y, z) => [OX + (x + y * KX) * S, OY - (z + y * KY) * S];
const poly = (pts, attrs) => `<polygon points="${pts.map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ")}" ${attrs}/>`;
const rectFront = (x, z, w, h, attrs) => {
  const [x0, y0] = pt(x, 0, z + h);
  return `<rect x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${(w * S).toFixed(1)}" height="${(h * S).toFixed(1)}" ${attrs}/>`;
};

// ---- An invented record: cover colours drive the screen palette ----
const COVER = { bg: "#12303a", sun: "#f08a4b", sun2: "#f6c177", line: "#7fd1c7", ink: "#f4efe6" };
const TRACK = { title: "Midnight Circuit", artist: "The Tiny Robots", album: "Small Machines" };
const PALETTE = { text: "#f4efe6", secondary: "#e9dfcf", tertiary: "#a9c2bf", accent: "#f2a065", line: "#2d5560", panel: "#173b46" };

function coverArt(size) {
  // Sun over a sea of waveform lines.
  const waves = Array.from({ length: 9 }, (_, i) => {
    const y = size * (0.62 + i * 0.042);
    const amp = size * (0.012 + i * 0.002);
    let d = `M0 ${y.toFixed(1)}`;
    for (let x = 0; x <= size; x += size / 24) d += ` L${x.toFixed(1)} ${(y + Math.sin(x / size * 14 + i) * amp).toFixed(1)}`;
    return `<path d="${d}" fill="none" stroke="${COVER.line}" stroke-opacity="${(0.85 - i * 0.07).toFixed(2)}" stroke-width="${(size * 0.006).toFixed(1)}"/>`;
  }).join("");
  return `
  <defs><linearGradient id="sun${size}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${COVER.sun2}"/><stop offset="1" stop-color="${COVER.sun}"/></linearGradient></defs>
  <rect width="${size}" height="${size}" fill="${COVER.bg}"/>
  <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.25}" fill="url(#sun${size})"/>
  <rect y="${size * 0.6}" width="${size}" height="${size * 0.4}" fill="${COVER.bg}"/>
  ${waves}
  <text x="${size * 0.07}" y="${size * 0.12}" fill="${COVER.ink}" font-family="Futura, Avenir Next, sans-serif" font-weight="500" font-size="${size * 0.05}" letter-spacing="${size * 0.01}">THE TINY ROBOTS</text>
  <text x="${size * 0.07}" y="${size * 0.18}" fill="${COVER.ink}" fill-opacity=".7" font-family="Futura, Avenir Next, sans-serif" font-size="${size * 0.035}" letter-spacing="${size * 0.008}">SMALL MACHINES</text>`;
}

/** The P4 Now Playing screen, 1024×600, laid out as in p4_display/main/main.cpp. */
function nowPlaying() {
  const font = `font-family="Avenir Next, Montserrat, Helvetica Neue, sans-serif"`;
  return `
  <defs>
    <radialGradient id="field" cx=".25" cy=".35" r=".9"><stop offset="0" stop-color="#1f4d58"/><stop offset=".55" stop-color="#143640"/><stop offset="1" stop-color="#0e2830"/></radialGradient>
    <radialGradient id="warm" cx=".9" cy=".95" r=".6"><stop offset="0" stop-color="${COVER.sun}" stop-opacity=".22"/><stop offset="1" stop-color="${COVER.sun}" stop-opacity="0"/></radialGradient>
    <clipPath id="art"><rect x="44" y="100" width="386" height="386" rx="12"/></clipPath>
  </defs>
  <rect width="1024" height="600" fill="url(#field)"/>
  <rect width="1024" height="600" fill="url(#warm)"/>
  <text x="42" y="50" ${font} font-weight="600" font-size="20" letter-spacing="1" fill="${PALETTE.accent}">WAVEFORM ONE</text>
  <text x="834" y="50" text-anchor="end" ${font} font-weight="500" font-size="20" fill="${PALETTE.text}">21:47</text>
  <rect x="862" y="15" width="120" height="46" rx="9" fill="${PALETTE.panel}" stroke="${PALETTE.line}"/>
  <text x="922" y="44" text-anchor="middle" ${font} font-size="16" fill="${PALETTE.text}">Settings</text>
  <rect x="42" y="70" width="940" height="2" fill="${PALETTE.line}"/>
  <rect x="42" y="98" width="390" height="390" rx="14" fill="${PALETTE.panel}" stroke="${PALETTE.accent}" stroke-width="2"/>
  <g clip-path="url(#art)"><g transform="translate(44 100)">${coverArt(386)}</g></g>
  <text x="472" y="160" ${font} font-weight="600" font-size="48" fill="${PALETTE.accent}">NOW PLAYING</text>
  <text x="472" y="228" ${font} font-weight="600" font-size="40" fill="${PALETTE.text}">${TRACK.title}</text>
  <text x="472" y="282" ${font} font-weight="500" font-size="32" fill="${PALETTE.secondary}">${TRACK.artist}</text>
  <text x="472" y="324" ${font} font-size="24" fill="${PALETTE.tertiary}">${TRACK.album}</text>
  <circle cx="476" cy="506" r="4" fill="${PALETTE.accent}"/>
  <text x="490" y="514" ${font} font-size="20" fill="${PALETTE.tertiary}">Enjoy the music</text>`;
}

function device() {
  const out = [];
  const L = -CASE_W / 2, R = CASE_W / 2;

  // Floor shadow.
  const [sx, sy] = pt(0, DEPTH / 2, 0);
  out.push(`<ellipse cx="${sx}" cy="${sy + 6}" rx="${(CASE_W / 2 + 40) * S}" ry="${34 * S}" fill="url(#shadow)"/>`);

  // LP sleeve standing in the holders near the back, drawn first (it is behind).
  const yS = DEPTH - HOLDER.rearInset - HOLDER.depth / 2;
  const zS = CASE_H + HOLDER.h - SLOT_DEPTH;
  const [ax, ay] = pt(-ALBUM / 2, yS, zS + ALBUM);
  out.push(`<g transform="translate(${ax.toFixed(1)} ${ay.toFixed(1)})">
    <svg width="${ALBUM * S}" height="${ALBUM * S}" viewBox="0 0 ${ALBUM * S} ${ALBUM * S}">${coverArt(ALBUM * S)}</svg>
    <rect width="${ALBUM * S}" height="${ALBUM * S}" fill="url(#sleeveShade)"/>
  </g>`);

  // Right side face and top face, with the two white bands wrapping round.
  out.push(poly([pt(R, 0, 0), pt(R, DEPTH, 0), pt(R, DEPTH, CASE_H), pt(R, 0, CASE_H)], `fill="#09090a"`));
  out.push(poly([pt(L, 0, CASE_H), pt(R, 0, CASE_H), pt(R, DEPTH, CASE_H), pt(L, DEPTH, CASE_H)], `fill="url(#top)"`));
  for (const [y0, y1] of STRIPES) {
    out.push(poly([pt(L, y0, CASE_H), pt(R, y0, CASE_H), pt(R, y1, CASE_H), pt(L, y1, CASE_H)], `fill="#ecebe7"`));
    out.push(poly([pt(R, y0, 0), pt(R, y1, 0), pt(R, y1, CASE_H), pt(R, y0, CASE_H)], `fill="#c9c8c4"`));
  }

  // Record holders on top (in front of the sleeve's foot).
  for (const cx of [-HOLDER.x, HOLDER.x]) {
    const x0 = cx - HOLDER.len / 2, x1 = cx + HOLDER.len / 2;
    const y0 = DEPTH - HOLDER.rearInset - HOLDER.depth, y1 = DEPTH - HOLDER.rearInset;
    const z0 = CASE_H, z1 = CASE_H + HOLDER.h;
    out.push(poly([pt(x1, y0, z0), pt(x1, y1, z0), pt(x1, y1, z1), pt(x1, y0, z1)], `fill="#0b0b0c"`));
    out.push(poly([pt(x0, y0, z1), pt(x1, y0, z1), pt(x1, y1, z1), pt(x0, y1, z1)], `fill="#1d1d20"`));
    out.push(poly([pt(x0, y0, z0), pt(x1, y0, z0), pt(x1, y0, z1), pt(x0, y0, z1)], `fill="#121214"`));
  }

  // Front face: matte black, a soft highlight where the rounded top edge turns.
  out.push(rectFront(L, 0, CASE_W, CASE_H, `rx="${3 * S}" fill="url(#front)"`));
  out.push(rectFront(L, CASE_H - 6, CASE_W, 6, `fill="url(#edge)" opacity=".7"`));

  // Screen window and the Now Playing screen inside it.
  const sw = ACTIVE_W + 2 * WINDOW_MARGIN, sh = ACTIVE_H + 2 * WINDOW_MARGIN;
  const swX = SCREEN_X + (SCREEN_W - sw) / 2, swZ = ZONE_CZ - sh / 2;
  out.push(rectFront(swX - 1, swZ - 1, sw + 2, sh + 2, `rx="${1.5 * S}" fill="#020202" stroke="#1b1b1e" stroke-width="1.5"`));
  const [scx, scy] = pt(swX + 1, 0, swZ + sh - 1);
  out.push(`<svg x="${scx.toFixed(1)}" y="${scy.toFixed(1)}" width="${((sw - 2) * S).toFixed(1)}" height="${((sh - 2) * S).toFixed(1)}" viewBox="0 0 1024 600" preserveAspectRatio="xMidYMid slice">${nowPlaying()}</svg>`);
  out.push(rectFront(swX, swZ, sw, sh, `fill="url(#glass)"`));

  // LED window: P3 panel behind a smoked diffuser, Mirrored style.
  const lw = LED_W - 2 * LED_LIP, lh = LED_H - 2 * LED_LIP;
  const lwX = LED_X + LED_LIP, lwZ = ZONE_CZ - lh / 2;
  out.push(rectFront(lwX - 1, lwZ - 1, lw + 2, lh + 2, `rx="${1.5 * S}" fill="#030303" stroke="#1b1b1e" stroke-width="1.5"`));
  const levels = spectrum(2.2);
  const px = mirrored(levels);
  const pitchX = lw / W, pitchZ = lh / H;
  const leds = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = px(x, y);
      const [cx, cy] = pt(lwX + (x + 0.5) * pitchX, 0, lwZ + lh - (y + 0.5) * pitchZ);
      leds.push(c ? `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(pitchX * 0.42 * S).toFixed(2)}" fill="${RGB[c]}"/>` : `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(pitchX * 0.36 * S).toFixed(2)}" fill="#141416"/>`);
    }
  }
  out.push(`<g filter="url(#diffuse)">${leds.join("")}</g>`);
  out.push(rectFront(lwX, lwZ, lw, lh, `fill="url(#glass)"`));

  // The name, white inlay in the bottom band (Futura, spaced capitals).
  const [nx, ny] = pt(0, 0, SHELL_WALL + BOTTOM_BAND / 2 - 1.6);
  out.push(`<text x="${nx}" y="${ny}" text-anchor="middle" font-family="Futura, Avenir Next, sans-serif" font-size="${3.6 * S}" letter-spacing="${1.6 * S}" fill="#f2f1ed">WAVEFORM ONE</text>`);

  return out.join("\n");
}

const DEVICE_W = 1250, HEIGHT = 1400;
const COL_X = DEVICE_W + 70;
const now = spectrum(2.2);
const history = Array.from({ length: H }, (_, row) => spectrum(2.2 - row * 0.45));
const styles = [
  [classic(now), "Classic"],
  [mirrored(now), "Mirrored"],
  [waterfall(history), "Waterfall"],
]
  .map(([fn, label], i) => `<g transform="translate(${COL_X} ${110 + i * (PANEL_H + LABEL + 70)})">${panel(fn, 0, label)}</g>`)
  .join("\n");
const WIDTH = COL_X + PANEL_W + 70;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-label="Mock of Waveform One: a black cabinet with an album screen and an LED panel, a record sleeve on top, and the panel's three visual styles.">
<defs>
  ${GLOW}
  <filter id="diffuse" x="-2%" y="-2%" width="104%" height="104%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <linearGradient id="front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151517"/><stop offset=".12" stop-color="#0d0d0e"/><stop offset="1" stop-color="#070707"/></linearGradient>
  <linearGradient id="edge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3e"/><stop offset="1" stop-color="#3a3a3e" stop-opacity="0"/></linearGradient>
  <linearGradient id="top" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1c1c1f"/><stop offset="1" stop-color="#111113"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="sleeveShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
  <radialGradient id="shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>
<style>.styles text{font:500 20px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.16em;fill:#9a9aa2;text-transform:uppercase}</style>
<rect width="${WIDTH}" height="${HEIGHT}" fill="#0b0b0c"/>
${device()}
<g class="styles">${styles}</g>
</svg>
`;

process.stdout.write(svg);
