// vp-badge against VitePress's VPBadge (test/upstream/VPBadge.vue): the
// seven types in two sizes, and a badge in a doc's headings and in the doc
// footer, VPBadge's own rules. vpkit's own, golden: the success type, the
// outline, the dot.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BORDER, COLORS, MARGIN, PADDING, RADIUS, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const BOXP = ['display', ...MARGIN, ...BORDER, ...RADIUS, ...PADDING, 'line-height', 'font-size', 'font-weight', 'white-space', 'transform', 'height'];
const UPSTREAM = { files: ['VPBadge.vue'] };
const TYPES = ['info', 'note', 'tip', 'important', 'caution', 'warning', 'danger'];
const variant = (type) => (type === 'info' ? '' : ` data-variant="${type}"`);

// VPBadge's seven types in two sizes
for (const type of TYPES) {
  for (const small of [false, true]) {
    cases.push({
      name: `badge ${type}${small ? ' small' : ''}`,
      upstream: { ...UPSTREAM, html: `<span class="VPBadge ${type}${small ? ' small' : ''}">beta</span>` },
      html: `<span class="vp-badge"${variant(type)}${small ? ' data-size="sm"' : ''}>beta</span>`,
      checks: [{ target: '.vp-badge', refTarget: '.VPBadge', props: [...BOXP, ...COLORS] }],
    });
  }
}

// the success type, vpkit's: the pattern of the others on the success tokens
for (const small of [false, true]) {
  cases.push({
    name: `badge success${small ? ' small' : ''}`,
    html: `<span class="vp-badge" data-variant="success"${small ? ' data-size="sm"' : ''}>paid</span>`,
    checks: [{ target: '.vp-badge', props: [...BOXP, ...COLORS] }],
  });
}

// in a .vp-doc heading, each level, small or not, and in the doc footer
for (const level of [1, 2, 3, 4, 5, 6]) {
  for (const small of [false, true]) {
    cases.push({
      name: `badge in h${level}${small ? ', small' : ''}`,
      upstream: { ...UPSTREAM, html: `<div class="vp-doc"><h${level}>Title <span class="VPBadge tip${small ? ' small' : ''}">beta</span></h${level}></div>` },
      html: `<div class="vp-doc"><h${level}>Title <span class="vp-badge" data-variant="tip"${small ? ' data-size="sm"' : ''}>beta</span></h${level}></div>`,
      checks: [{ target: '.vp-badge', refTarget: '.VPBadge', props: [...BOXP, 'vertical-align', ...COLORS] }],
    });
  }
}
cases.push({
  name: 'badge in the doc footer',
  upstream: { ...UPSTREAM, html: '<div class="VPDocFooter"><span class="VPBadge tip">beta</span></div>' },
  html: '<div class="vp-doc-footer"><span class="vp-badge" data-variant="tip">beta</span></div>',
  checks: [{ target: '.vp-badge', refTarget: '.VPBadge', props: ['display'] }],
});

// the outline, vpkit's: the page's color under the text and the variant's
// tint on the border, on a soft surface
cases.push({
  name: 'badge outline',
  html: ex('outline'),
  checks: [
    { target: '.vp-badge-outline[data-variant="success"]', props: [...COLORS, ...BORDER] },
    { target: '.vp-badge-outline[data-variant="danger"]', props: COLORS },
    { target: '.vp-badge-outline:not([data-variant])', props: COLORS },
    { target: '.vp-badge[data-variant="success"]:not(.vp-badge-outline)', props: COLORS },
  ],
});

// the dot, vpkit's: a row, the dot in the word's color
cases.push({
  name: 'badge with a dot',
  html: ex('dot'),
  checks: [
    { target: '.vp-badge', props: ['display', 'align-items', 'column-gap', 'height'] },
    { target: '.vp-badge-dot', props: ['display', 'width', 'height', 'flex-shrink', ...RADIUS, 'background-color', 'offset-top'] },
    { target: '.vp-badge[data-variant="danger"] > .vp-badge-dot', props: ['background-color'] },
  ],
});

// the examples' heading and variants
cases.push({ name: 'badge in the example heading', html: ex('heading'), checks: [{ target: '.vp-badge', props: [...COLORS, 'height', 'offset-top'] }] });
