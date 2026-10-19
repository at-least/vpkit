// vp-icon against VitePress's VPIcon (test/upstream/components/VPIcon.vue),
// its form for an icon given as markup: in a line of 1.25rem text in the
// brand color, the box takes the text's size and sits on its line, the SVG
// fills it in the text's color. vpkit's difference, golden or against
// vpkit: an SVG that sets its own fill keeps it, and a size utility on the
// SVG wins. No case inside a vp-doc: prose.css has no rule for a span or
// an SVG outside a code block or a link. The names carry a word after
// `icon`, so CASES='^icon ' selects them and not the icon button's.

import { BOX, examples } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const UPSTREAM = { files: ['components/VPIcon.vue'] };
const SVG = (attrs = '') => `<svg aria-hidden="true"${attrs} viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg>`;
// the line around it: the brand color under its name on each side
const line = (span, brand) => `<p style="font-size:1.25rem;color:var(${brand})">Saved ${span} just now</p>`;

// the box and the SVG in it, against VPIcon's
cases.push({
  name: 'icon in a line',
  upstream: { ...UPSTREAM, html: line(`<span class="VPIcon">${SVG()}</span>`, '--vp-c-brand-1') },
  html: line(`<span class="vp-icon">${SVG()}</span>`, '--vp-c-brand'),
  checks: [
    { target: '.vp-icon', refTarget: '.VPIcon', props: ['display', 'width', 'height', 'vertical-align', 'offset-top', 'offset-left'] },
    { target: '.vp-icon svg', refTarget: '.VPIcon svg', props: ['display', 'width', 'height', 'fill', 'offset-top'] },
  ],
});

// an SVG that sets its own fill keeps it: against the same SVG alone
cases.push({
  name: 'icon with a stroke svg',
  html: `<span class="vp-icon">${SVG(' fill="none" stroke="currentColor"')}</span>`,
  reference: SVG(' fill="none" stroke="currentColor"'),
  checks: [{ target: 'svg', props: ['fill'] }],
});

// a size utility on the SVG wins: against the same SVG sized inline
cases.push({
  name: 'icon with a sized svg',
  html: line(`<span class="vp-icon">${SVG(' class="size-4"')}</span>`, '--vp-c-brand'),
  reference: line(`<span class="vp-icon">${SVG(' style="width:1rem;height:1rem"')}</span>`, '--vp-c-brand'),
  checks: [{ target: 'svg', props: ['width', 'height', 'fill'] }],
});

// the example: a filled icon in success text, a stroke icon in larger
// warning text, each the size and color of its line
cases.push({
  name: 'icon beside its text',
  html: ex('text'),
  checks: [
    { target: '.text-success .vp-icon', props: ['width', ...BOX] },
    { target: '.text-success svg', props: ['fill', 'width', 'height'] },
    { target: '.text-warning .vp-icon', props: ['width', ...BOX] },
    { target: '.text-warning svg', props: ['fill', 'stroke', 'width', 'height'] },
  ],
});
