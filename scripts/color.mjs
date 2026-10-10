// The color math vpkit's theme generators and tests share: sRGB luminance
// and WCAG contrast as test/themes.mjs checks them, alpha compositing with
// halves rounded up as the test's Math.round does, and the fits the
// generators step a color through, toward black in light mode and toward
// white in dark. A color is a hex string (`#rrggbb`) or an [r, g, b] array;
// the fits take and return hex.
export const black = '#000000';
export const white = '#ffffff';
export const parseHex = (hex) => {
  const n = parseInt(hex, 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
};
export const rgb = (c) => (typeof c === 'string' ? parseHex(c.replace(/^#/, '')) : c);
export const hexs = ([r, g, b]) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;

export function luminance(c) {
  const [r, g, b] = rgb(c);
  const channel = (v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a, b) {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// a half rounds to the even neighbour, as Python's round() did when the
// committed themes were generated: Math.round would move a channel by one
// in those cases, and with it the theme's bytes
const roundHalfEven = (x) => (Math.abs(x % 1) === 0.5 ? 2 * Math.round(x / 2) : Math.round(x));

// blend a toward b by t (sRGB per-channel)
export function mix(a, b, t) {
  const [ar, ag, ab] = rgb(a);
  const [br, bg, bb] = rgb(b);
  return hexs([roundHalfEven(ar + (br - ar) * t), roundHalfEven(ag + (bg - ag) * t), roundHalfEven(ab + (bb - ab) * t)]);
}

// color at alpha over bg, halves rounded up as test/themes.mjs's Math.round
// does: one channel's difference moves a contrast by 0.05 (a dimmed hover
// over a twice-tinted ground)
export function composite(color, alpha, bg) {
  const [fr, fg, fb] = rgb(color);
  const [br, bg2, bb] = rgb(bg);
  const up = (v) => Math.floor(v + 0.5);
  return hexs([up(fr * alpha + br * (1 - alpha)), up(fg * alpha + bg2 * (1 - alpha)), up(fb * alpha + bb * (1 - alpha))]);
}

// the margin the fits clear the test's minimums by; the committed themes
// were fitted with it, so it stays
export const EPS = 0.03;

// darken (light mode) / lighten (dark mode) until target contrast; if the
// primary direction cannot reach it, try the other way
export function fit(c, against, target, mode) {
  target += EPS;
  for (const t of mode === 'light' ? [black, white] : [white, black]) {
    let cur = c;
    for (let i = 0; i < 60; i++) {
      if (contrast(cur, against) >= target) return cur;
      cur = mix(cur, t, 0.04);
    }
    if (contrast(cur, against) > contrast(c, against)) c = cur;
  }
  return c;
}

// fit c so it passes on its own alpha tint over bg
export function fitOnTint(c, bg, alpha, target, mode) {
  target += EPS;
  for (let i = 0; i < 80; i++) {
    if (contrast(c, composite(c, alpha, bg)) >= target && contrast(c, bg) >= target) return c;
    c = mix(c, mode === 'light' ? black : white, 0.04);
  }
  return c;
}

// step c toward black (light) or white (dark) until it reaches the target
// as text on every `text` ground and, dimmed to 0.75 (the opacity the
// containers give a hovered link), on every `dimmed` ground. Interpolated
// from c, not stepped: a rounded 4% step stalls short of black and white
// (at 12 and 243 per channel)
export function fitAll(c, mode, { text = [], dimmed = [], target = 4.5 } = {}) {
  target += EPS;
  const end = mode === 'light' ? black : white;
  for (let k = 0; k <= 100; k++) {
    const x = mix(c, end, k / 100);
    if (text.every((g) => contrast(x, g) >= target) && dimmed.every((g) => contrast(composite(x, 0.75, g), g) >= target)) return x;
  }
  return end;
}
