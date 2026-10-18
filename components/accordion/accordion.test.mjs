// vp-accordion against VitePress's nav screen group (test/upstream/
// components/VPNavMenuGroup.vue: VPNavScreenMenuGroup, its .button and
// .button-icon), closed and open (`.open` there, `[open]` here): the
// section's rule and its padding, the title's box, type, colors at rest
// and hovered and motion, the icon's size and turn. What is vpkit's is
// golden, named: the icon an inline SVG that doesn't shrink, where
// VitePress masks a span; the focus ring. vpkit against vpkit: a touch
// screen's hover at rest, the title inside a vp-doc.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MARGIN, OUTLINE, PADDING, TRANSITION, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const PLUS = '<svg class="vp-accordion-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
const section = (open) => `<details class="vp-accordion"${open ? ' open' : ''}><summary class="vp-accordion-title">Guide${PLUS}</summary><p>Orders placed before noon ship the same day.</p></details>`;
// the original: its screen group with its items shown or not, as v-show leaves them
const upstream = (open) => ({
  files: ['components/VPNavMenuGroup.vue'],
  html:
    `<div class="VPNavMenuGroup VPNavScreenMenuGroup${open ? ' open' : ''}"><button type="button" class="button" aria-expanded="${open}">` +
    '<span class="button-text">Guide</span><span class="vpi-plus button-icon" aria-hidden="true"></span></button>' +
    `<ul class="items"${open ? '' : ' style="display:none"'}><li>Orders placed before noon ship the same day.</li></ul></div>`,
});
const BOXP = ['border-bottom-width', 'border-bottom-style', 'border-bottom-color', ...PADDING, ...TRANSITION];
const TITLE = ['display', 'justify-content', 'align-items', ...PADDING, 'width', 'line-height', 'font-size', 'font-weight', 'color', 'cursor', ...TRANSITION, 'height'];
const ICON = ['transform', ...TRANSITION, 'width', 'height'];

// a section closed and open: against the original
for (const open of [false, true]) {
  cases.push({
    name: `accordion${open ? ' open' : ''}`,
    upstream: upstream(open),
    html: section(open),
    checks: [
      { target: '.vp-accordion', refTarget: '.VPNavScreenMenuGroup', props: BOXP },
      { target: '.vp-accordion-title', refTarget: '.button', props: TITLE },
      { target: '.vp-accordion-title', refTarget: '.button', state: ['hover'], props: ['color'] },
      { target: '.vp-accordion-icon', refTarget: '.button-icon', props: ICON },
      { target: '.vp-accordion-icon', source: 'golden', props: ['flex-shrink'], why: 'the icon is an inline SVG held to its 1em so a long title wraps instead of squeezing it, where VitePress masks a span that may shrink' },
    ],
  });
}

// the example: three sections, the first open
cases.push({
  name: 'accordion sections',
  html: ex('sections'),
  checks: [
    { target: '.vp-accordion[open] > .vp-accordion-title', props: ['color', 'padding-bottom', 'height'] },
    { target: '.vp-accordion:not([open]) > .vp-accordion-title', props: ['color', 'padding-bottom', 'height'] },
    { target: '.vp-accordion:not([open])', props: ['height', 'padding-bottom'] },
    { target: '.vp-accordion + .vp-accordion', props: ['offset-top'] },
  ],
});

// the focus ring: base.css's outline on the summary
cases.push({
  name: 'accordion title focused',
  html: section(false),
  checks: [{ target: '.vp-accordion-title', state: ['focus-visible'], props: OUTLINE }],
});

// on a touch screen a hovered title looks as it does at rest
cases.push({
  name: 'accordion title on a touch screen',
  touch: true,
  html: section(false),
  reference: section(false),
  checks: [{ target: '.vp-accordion-title', state: ['hover'], refState: [], props: ['color'] }],
});

// inside a vp-doc (prose.css, compiled last, as an app imports it), whose
// rule for a summary gives it margins: the title keeps its place
cases.push({
  name: 'accordion title in a doc',
  html: `<div class="vp-doc">${section(true)}</div>`,
  reference: `<div>${section(true)}</div>`,
  checks: [
    { target: '.vp-accordion-title', props: [...MARGIN, 'line-height', 'font-size', 'font-weight', 'color', 'height'] },
    { target: '.vp-accordion', props: PADDING },
  ],
});
