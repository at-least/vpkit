// vp-btn against VitePress's VPButton (test/upstream/VPButton.vue). What is
// VitePress's is compared with it: the colors at rest, hovered and
// pressed, the type, the border, the side padding, the transition. What is
// vpkit's is golden, each named: the control height, the pill radius, the
// flex box for an icon, the small size, the danger and ghost variants (own
// designs on the contract), the disabled look, the focus ring.

import { BORDER, BOX, COLORS, OUTLINE, RADIUS, TRANSITION, examples } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

// VitePress's: the colors, the type, the border, the side padding, the motion
const VITEPRESS = [...COLORS, 'font-size', 'font-weight', 'text-align', 'white-space', 'text-decoration-line', 'cursor', ...BORDER, 'padding-left', 'padding-right', ...TRANSITION];
const STATES = [
  { target: '.vp-btn', refTarget: '.VPButton', props: VITEPRESS },
  { target: '.vp-btn', refTarget: '.VPButton', state: ['hover'], props: [...COLORS, ...TRANSITION] },
  { target: '.vp-btn', refTarget: '.VPButton', state: ['hover', 'active'], props: [...COLORS, ...TRANSITION] },
];
// vpkit's: one control height on a flex box, the pill radius
const OURS = {
  target: '.vp-btn',
  source: 'golden',
  props: ['display', 'align-items', 'justify-content', 'column-gap', 'min-height', 'height', 'line-height', 'padding-top', 'padding-bottom', ...RADIUS],
  why: 'one control height (2.75rem; 3rem large) on a flex box with a 0.5rem gap for an icon, the type at 1.5 and the pill radius token, where VPButton is an inline block its 38px line height sizes (46px big) with a 20px radius (24px big)',
};
const UPSTREAM = { files: ['VPButton.vue'] };

// VPButton's alt and brand themes in its two sizes, as a link and as a
// button
for (const [theme, variant] of [['alt', ''], ['brand', ' data-variant="brand"']]) {
  for (const [size, attr] of [['medium', ''], ['big', ' data-size="lg"']]) {
    for (const tag of ['a', 'button']) {
      const attrs = tag === 'a' ? ' href="#"' : ' type="button"';
      cases.push({
        name: `button ${theme} ${size} <${tag}>`,
        upstream: { ...UPSTREAM, html: `<${tag} class="VPButton ${size} ${theme}"${attrs}>Get Started</${tag}>` },
        html: `<${tag} class="vp-btn"${variant}${attr}${attrs}>Get Started</${tag}>`,
        checks: [...STATES, OURS],
      });
    }
  }
}

// the small size: vpkit's
cases.push({
  name: 'button small',
  html: '<button class="vp-btn" data-size="sm" type="button">Filter</button>',
  checks: [{ target: '.vp-btn', props: ['min-height', 'height', 'padding-left', 'padding-right', 'font-size', 'line-height', ...COLORS] }],
});

// the danger and ghost variants: vpkit's own, their colors at rest,
// hovered and pressed, the danger tint an image over the page color
for (const variant of ['danger', 'ghost']) {
  cases.push({
    name: `button ${variant}`,
    html: `<button class="vp-btn" data-variant="${variant}" type="button">Delete</button>`,
    checks: [
      { target: '.vp-btn', props: [...COLORS, 'background-image', 'min-height', ...BORDER] },
      { target: '.vp-btn', state: ['hover'], props: [...COLORS, 'background-image'] },
      { target: '.vp-btn', state: ['hover', 'active'], props: [...COLORS, 'background-image'] },
    ],
  });
}

// the current item: the brand theme, against VPButton's brand, for a value
// of aria-current; a value WAI-ARIA 1.2 treats as false leaves it alt; and
// the state beats the variants, the danger tint included
const CURRENT = [
  { target: '.vp-btn', refTarget: '.VPButton', props: [...COLORS, 'background-image', ...TRANSITION] },
  { target: '.vp-btn', refTarget: '.VPButton', state: ['hover'], props: [...COLORS, 'background-image'] },
  { target: '.vp-btn', refTarget: '.VPButton', state: ['hover', 'active'], props: [...COLORS, 'background-image'] },
];
for (const [value, tag] of [['true', 'a'], ['page', 'button']]) {
  const attrs = tag === 'a' ? ' href="#"' : ' type="button"';
  cases.push({
    name: `button current aria-current=${value} <${tag}>`,
    upstream: { ...UPSTREAM, html: `<${tag} class="VPButton medium brand"${attrs}>7d</${tag}>` },
    html: `<${tag} class="vp-btn"${attrs} aria-current="${value}">7d</${tag}>`,
    checks: CURRENT,
  });
}
for (const value of ['false', '', 'undefined']) {
  cases.push({
    name: `button aria-current="${value}"`,
    upstream: { ...UPSTREAM, html: '<a class="VPButton medium alt" href="#">24h</a>' },
    html: `<a class="vp-btn" href="#" aria-current="${value}">24h</a>`,
    checks: CURRENT,
  });
}
for (const variant of ['ghost', 'danger']) {
  cases.push({
    name: `button current over ${variant}`,
    upstream: { ...UPSTREAM, html: '<a class="VPButton medium brand" href="#">7d</a>' },
    html: `<a class="vp-btn" data-variant="${variant}" href="#" aria-current="page">7d</a>`,
    checks: CURRENT,
  });
}
// the example's row: the current one brand, its neighbours alt
cases.push({
  name: 'button row with a current item',
  html: ex('current'),
  checks: [
    { target: '.vp-btn[aria-current]', props: COLORS },
    { target: '.vp-btn:first-child', props: COLORS },
  ],
});

// an icon beside the label: 1rem, 1.25rem in a large button, not shrinking,
// centered on the label; a sized icon keeps its size
cases.push({
  name: 'button with an icon',
  html: ex('icons'),
  checks: [
    { target: '.vp-btn > svg', props: ['width', 'flex-shrink', ...BOX] },
    { target: '.vp-btn', props: ['height', 'width'] },
  ],
});
cases.push({
  name: 'button large with an icon',
  html: '<a class="vp-btn" data-size="lg" href="#"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle></svg>Sign in with Google</a>',
  checks: [{ target: 'svg', props: ['width', 'flex-shrink', ...BOX] }, { target: '.vp-btn', props: ['height'] }],
});
cases.push({
  name: 'button with a sized icon',
  html: '<a class="vp-btn" data-size="lg" href="#"><svg class="size-4" viewBox="0 0 24 24"></svg>Copy</a>',
  checks: [{ target: 'svg', props: ['width', 'height'] }],
});

// disabled: VPButton's brand colors, dimmed with a not-allowed cursor
cases.push({
  name: 'button disabled',
  upstream: { ...UPSTREAM, html: '<button class="VPButton medium brand" disabled>Pay</button>' },
  html: '<button class="vp-btn" data-variant="brand" disabled>Pay</button>',
  checks: [
    { target: '.vp-btn', refTarget: '.VPButton', props: [...COLORS, 'font-size', 'font-weight'] },
    { target: '.vp-btn', source: 'golden', props: ['opacity', 'cursor'], why: 'a disabled button is dimmed to half opacity with a not-allowed cursor; VPButton has no disabled look' },
  ],
});

// the focus ring: base.css's outline, on the pill
cases.push({
  name: 'button focused',
  html: '<button class="vp-btn" type="button">Cancel</button>',
  checks: [{ target: '.vp-btn', state: ['focus-visible'], props: OUTLINE }],
});

// a utility on the element wins over the component
cases.push({
  name: 'button with a utility',
  html: ex('utility'),
  checks: [{ target: '.vp-btn', props: ['padding-left', 'padding-right'] }],
});

// on a touch screen a hovered button looks as it does at rest
for (const [variant, attr] of [['alt', ''], ['brand', ' data-variant="brand"'], ['danger', ' data-variant="danger"'], ['ghost', ' data-variant="ghost"']]) {
  const html = `<button class="vp-btn"${attr} type="button">Tap</button>`;
  cases.push({
    name: `button ${variant} on a touch screen`,
    touch: true,
    html,
    reference: html,
    checks: [{ target: '.vp-btn', state: ['hover'], refState: [], props: [...COLORS, 'background-image'] }],
  });
}
