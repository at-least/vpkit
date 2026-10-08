// The component matrix. Each case renders the same thing twice, with
// VitePress's classes and with vpkit's; elements to measure carry data-t.
// A check names the element, the properties to compare and, optionally,
// the pseudo-classes to force on it (or on the element named by `on`).

const SIDES = ['top', 'right', 'bottom', 'left'];
const BORDER = SIDES.flatMap((s) => [`border-${s}-width`, `border-${s}-style`]);
const RADIUS = ['top-left', 'top-right', 'bottom-right', 'bottom-left'].map(
  (c) => `border-${c}-radius`,
);
const PADDING = SIDES.map((s) => `padding-${s}`);
const COLORS = ['color', 'background-color', ...SIDES.map((s) => `border-${s}-color`)];
const TRANSITION = ['transition-property', 'transition-duration'];

export const cases = [];

// button: VPButton's three themes × two sizes, as a link and as a button
const BUTTON_BOX = [
  'display',
  ...BORDER,
  ...RADIUS,
  ...PADDING,
  'line-height',
  'font-size',
  'font-weight',
  'text-align',
  'white-space',
  'text-decoration-line',
  'cursor',
  'height',
];
const THEMES = { brand: 'vp-btn-brand', alt: '', sponsor: 'vp-btn-sponsor' };
const SIZES = { medium: '', big: 'vp-btn-big' };
for (const [theme, themeClass] of Object.entries(THEMES)) {
  for (const [size, sizeClass] of Object.entries(SIZES)) {
    for (const tag of ['a', 'button']) {
      const attrs = tag === 'a' ? ' href="#"' : '';
      const vpkit = ['vp-btn', sizeClass, themeClass].filter(Boolean).join(' ');
      cases.push({
        name: `button ${theme} ${size} <${tag}>`,
        upstream: `<${tag} data-t="btn" class="VPButton ${size} ${theme}"${attrs}>Get Started</${tag}>`,
        vpkit: `<${tag} data-t="btn" class="${vpkit}"${attrs}>Get Started</${tag}>`,
        checks: [
          { target: 'btn', props: [...BUTTON_BOX, ...COLORS, ...TRANSITION] },
          { target: 'btn', state: ['hover'], props: [...COLORS, ...TRANSITION] },
          { target: 'btn', state: ['hover', 'active'], props: [...COLORS, ...TRANSITION] },
        ],
      });
    }
  }
}
