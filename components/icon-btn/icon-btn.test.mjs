// vp-icon-btn against VitePress's VPSocialLink
// (test/upstream/components/VPSocialLink.vue). What is VitePress's is
// compared with it: the flex box, the colors at rest and hovered, the
// icon's size and fill. What is vpkit's is golden, each named: the square
// on the control height (and the small size), the radius and the gray
// wash hovered with their transitions, the icon centered in the larger
// square, the appearance switch, the focus ring. vpkit against vpkit: an
// SVG that keeps its own fill, a sized icon, the button inside a vp-doc,
// and a touch screen's hover at rest (alert.test.mjs holds it inside an
// alert).

import { BOX, COLORS, OUTLINE, PADDING, RADIUS, TRANSITION, examples } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const UPSTREAM = { files: ['components/VPSocialLink.vue'] };
const SVG = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg>';
const upstream = (label) => `<a class="VPSocialLink no-icon" href="#" aria-label="${label}"><span>${SVG}</span></a>`;

// VitePress's: the flex box, the text color at rest and hovered, no padding
const VITEPRESS = ['display', 'justify-content', 'align-items', 'color', 'text-decoration-line', ...PADDING];
const STATES = [
  { target: '.vp-icon-btn', refTarget: '.VPSocialLink', props: VITEPRESS },
  { target: '.vp-icon-btn', refTarget: '.VPSocialLink', state: ['hover'], props: ['color'] },
  // the icon: VPSocialLink's 1.25rem on its span, currentColor on its SVG
  { target: '.vp-icon-btn > svg', refTarget: '.VPSocialLink > span', props: ['width', 'height'] },
  { target: '.vp-icon-btn > svg', refTarget: '.VPSocialLink svg', props: ['display', 'fill'] },
];
// vpkit's: the square on the control height, the radius, the wash hovered
// and the fades, the icon centered in it
const OURS = [
  {
    target: '.vp-icon-btn',
    source: 'golden',
    props: ['width', 'height', ...RADIUS, 'background-color', ...TRANSITION],
    why: 'a 2.75rem square (--vp-control-height, a touch target) with the radius token and a transparent ground that fades in 0.25s beside the color\'s 0.5s, where VPSocialLink is a 2.25rem square with no radius, no ground and no ground transition',
  },
  {
    target: '.vp-icon-btn',
    source: 'golden',
    state: ['hover'],
    props: ['background-color', ...TRANSITION],
    why: 'the gray wash on hover, fading in 0.25s with the color, so the icon reads as a control; VPSocialLink only darkens its icon',
  },
  {
    target: '.vp-icon-btn > svg',
    source: 'golden',
    props: ['offset-top', 'offset-left', 'flex-shrink'],
    why: 'the icon centered in the 2.75rem square, 12px in, where VPSocialLink\'s span is 8px into its 2.25rem; and it does not shrink',
  },
];

// as a button and as a link
for (const tag of ['button', 'a']) {
  const attrs = tag === 'a' ? ' href="#"' : ' type="button"';
  cases.push({
    name: `icon-btn <${tag}>`,
    upstream: { ...UPSTREAM, html: upstream('Close') },
    html: `<${tag} class="vp-icon-btn"${attrs} aria-label="Close">${SVG}</${tag}>`,
    checks: [...STATES, ...OURS],
  });
}

// the example: the stroke icons in currentColor, and a filled star
cases.push({
  name: 'icon-btn examples',
  html: ex('buttons'),
  checks: [
    { target: '.vp-icon-btn', props: ['width', 'height', ...COLORS] },
    { target: '.vp-icon-btn > svg', props: ['width', 'height', 'fill', 'stroke', ...BOX] },
    { target: 'a.vp-icon-btn > svg', props: ['fill', 'stroke'] },
  ],
});

// vpkit's one difference in the icon: an SVG that sets its own fill keeps
// it (a stroke icon's fill="none"), where VitePress's `svg { fill:
// currentColor }` would fill it solid: against the same SVG alone
{
  const svg = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16v16H4z"/></svg>';
  cases.push({
    name: 'icon-btn with a stroke svg',
    html: `<button class="vp-icon-btn" type="button" aria-label="Close">${svg}</button>`,
    reference: svg,
    checks: [{ target: 'svg', props: ['fill'] }],
  });
}

// the small size, beside a small button, and the default beside a button
cases.push({
  name: 'icon-btn sizes',
  html: ex('sizes'),
  checks: [
    { target: '.vp-icon-btn', props: ['width', 'height'] },
    { target: '.vp-icon-btn[data-size="sm"]', props: ['width', 'height'] },
    { target: '.vp-icon-btn > svg', props: ['width', 'height'] },
    { target: '.vp-icon-btn[data-size="sm"] > svg', props: ['width', 'height', 'offset-top', 'offset-left'] },
    { target: '.vp-btn', props: ['height'] },
    { target: '.vp-btn[data-size="sm"]', props: ['height'] },
  ],
});

// the appearance switch: for each value of the root's data-appearance,
// and without one, the part shown; the case's script sets the attribute
for (const mode of ['light', 'dark', 'auto', '']) {
  const set = mode
    ? `<script>document.documentElement.setAttribute('data-appearance', '${mode}')</script>`
    : '<script>document.documentElement.removeAttribute(\'data-appearance\')</script>';
  cases.push({
    name: `icon-btn appearance ${mode || 'without data-appearance'}`,
    html: set + ex('appearance'),
    checks: [
      { target: '.vp-icon-btn-light', props: ['display', 'width', 'height'] },
      { target: '.vp-icon-btn-dark', props: ['display', 'width', 'height'] },
      { target: '.vp-icon-btn-auto', props: ['display', 'width', 'height'] },
      { target: '.vp-icon-btn', props: ['width', 'height', 'color'] },
    ],
  });
}

// the focus ring: base.css's outline on the square
cases.push({
  name: 'icon-btn focused',
  html: `<button class="vp-icon-btn" type="button" aria-label="Close">${SVG}</button>`,
  checks: [{ target: '.vp-icon-btn', state: ['focus-visible'], props: OUTLINE }],
});

// a utility on the icon wins over its size
cases.push({
  name: 'icon-btn with a sized icon',
  html: '<button class="vp-icon-btn" type="button" aria-label="Close"><svg class="size-4" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg></button>',
  reference: '<button class="vp-icon-btn" type="button" aria-label="Close"><svg style="width:1rem;height:1rem" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg></button>',
  checks: [{ target: 'svg', props: ['width', 'height'] }],
});

// inside a vp-doc (prose.css, compiled last, as an app imports it): the
// markdown's rules for a link leave the button's look and its hover
const BTN = `<a class="vp-icon-btn" href="#" aria-label="Like">${SVG}</a>`;
cases.push({
  name: 'icon-btn in a doc',
  html: `<div class="vp-doc">${BTN}</div>`,
  reference: BTN,
  checks: [
    { target: '.vp-icon-btn', props: ['color', 'text-decoration-line', ...TRANSITION] },
    { target: '.vp-icon-btn', state: ['hover'], props: ['color', 'background-color'] },
  ],
});
// on a touch screen a hovered button looks as it does at rest
cases.push({
  name: 'icon-btn on a touch screen',
  touch: true,
  html: BTN,
  reference: BTN,
  checks: [{ target: '.vp-icon-btn', state: ['hover'], refState: [], props: ['color', 'background-color'] }],
});
