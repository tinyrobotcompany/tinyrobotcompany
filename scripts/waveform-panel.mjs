/**
 * Waveform One's LED panel, following the firmware's own drawing rules
 * (tinyrobotcompany/Waveform_One, firmware/esp32/visualizer/main/bars.h and
 * styles.h): 64×32 LEDs, 24 frequency bands, 3-bit colours. Used by
 * render-waveform-device.mjs. The audio is simulated.
 */

export const W = 64;
export const H = 32;
export const BANDS = 24;

// 3-bit panel colour index (bit 0 red, bit 1 green, bit 2 blue) → display colour.
export const RGB = {
  1: "#ff453a", // red
  2: "#30d158", // green
  3: "#ffd60a", // yellow (red + green)
  4: "#0a84ff", // blue
  5: "#ff375f", // magenta (red + blue)
  6: "#40c8e0", // cyan (green + blue)
};

/** A deterministic, music-like spectrum: strong bass, a vocal bump, soft highs. */
export function spectrum(t) {
  return Array.from({ length: BANDS }, (_, b) => {
    const bass = 0.8 * Math.exp(-b / 5);
    const mids = 0.4 * Math.exp(-(((b - 10 - 2 * Math.sin(t * 0.7)) / 3.5) ** 2));
    const wobble = 0.14 * Math.sin(b * 1.7 + t * 1.9) + 0.1 * Math.sin(b * 0.6 - t * 2.3);
    const beat = b < 5 ? 0.25 * Math.max(0, Math.sin(t * 3.1)) ** 3 : 0;
    return Math.min(1, Math.max(0, (bass + mids + wobble + beat) * (0.75 + 0.25 * Math.sin(t * 1.1))));
  });
}

const bandOf = (x) => Math.floor(((x + 1) * BANDS - 1) / W);
const bandEnd = (band) => Math.floor(((band + 1) * W) / BANDS);

/** Classic: bars from the bottom; red tips, yellow middle, green base (bars.h). */
export function classic(levels) {
  return (x, y) => {
    const band = bandOf(x);
    if (x === bandEnd(band) - 1) return 0;
    const height = Math.floor(levels[band] * 32 + 0.5);
    if (y < 32 - height) return 0;
    return y < 6 ? 1 : y < 14 ? 3 : 2;
  };
}

/** Mirrored: bars grow both ways from the middle, coloured by band group (styles.h). */
export function mirrored(levels) {
  const colours = [4, 6, 2, 3, 1, 5];
  return (x, y) => {
    const band = bandOf(x);
    const radius = Math.floor(levels[band] * 16 + 0.5);
    return x !== bandEnd(band) - 1 && y >= 16 - radius && y < 16 + radius ? colours[Math.floor(band / 4)] : 0;
  };
}

/** Waterfall: newest spectrum on the top row, older rows scroll down (styles.h). */
export function waterfall(history) {
  return (x, y) => {
    const level = history[y][Math.floor((x * BANDS) / W)];
    return level < 0.02 ? 0 : level < 0.2 ? 4 : level < 0.4 ? 6 : level < 0.6 ? 2 : level < 0.8 ? 3 : 1;
  };
}

export const PITCH = 10;
export const PANEL_W = W * PITCH;
export const PANEL_H = H * PITCH;
export const GAP = 48;
export const LABEL = 44;

export function panel(pixel, ox, label) {
  const leds = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = pixel(x, y);
      const cx = ox + x * PITCH + PITCH / 2;
      const cy = y * PITCH + PITCH / 2;
      leds.push(
        c
          ? `<circle cx="${cx}" cy="${cy}" r="3.9" fill="${RGB[c]}"/>`
          : `<circle cx="${cx}" cy="${cy}" r="3.4" fill="#1c1c1f"/>`,
      );
    }
  }
  return [
    `<rect x="${ox - 14}" y="-14" width="${PANEL_W + 28}" height="${PANEL_H + 28}" rx="14" fill="#08080a" stroke="#2a2a2e"/>`,
    `<g filter="url(#glow)">${leds.join("")}</g>`,
    `<text x="${ox + PANEL_W / 2}" y="${PANEL_H + LABEL}" text-anchor="middle">${label}</text>`,
  ].join("\n");
}

export const GLOW = `<filter id="glow" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
