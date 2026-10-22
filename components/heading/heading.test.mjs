// vp-page-title and vp-section-title against VitePress's doc headings
// (test/upstream/vp-doc.css, `.vp-doc h1` and `h3`): the type and the
// color, the page title wide and at a phone's width; the h3's margin, the
// markdown's, not ported, golden. vp-page-desc and vp-group-title, vpkit's
// own, golden. vpkit against vpkit: the four inside a vp-doc against
// themselves outside one, on the elements an app puts them on.

import { MARGIN, examples, inDoc } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const UPSTREAM = { files: ['vp-doc.css'] };
const HEADING = ['font-size', 'line-height', 'letter-spacing', 'font-weight', 'color', 'height'];
const DESC = ['max-width', 'font-size', 'line-height', 'color', 'height'];

// the page title: `.vp-doc h1`, wide and at a phone's width, where it is smaller
for (const [name, width] of [['heading page title', undefined], ["heading page title at a phone's width", 375]]) {
  cases.push({
    name,
    width,
    upstream: { ...UPSTREAM, html: inDoc('<h1>Releases</h1>') },
    html: '<h1 class="vp-page-title">Releases</h1>',
    checks: [{ target: '.vp-page-title', refTarget: 'h1', props: [...HEADING, ...MARGIN] }],
  });
}

// the section title: `.vp-doc h3`'s type; its margin, the markdown's, is not ported
cases.push({
  name: 'heading section title',
  upstream: { ...UPSTREAM, html: inDoc('<h3>Retention</h3>') },
  html: '<h3 class="vp-section-title">Retention</h3>',
  checks: [
    { target: '.vp-section-title', refTarget: 'h3', props: HEADING },
    { target: '.vp-section-title', source: 'golden', props: MARGIN, why: "no margin: a heading's place is the page's, where the markdown's h3 has 2rem above it" },
  ],
});

// the page description and the group title, vpkit's own
const TEXT = 'Every version this project has shipped, with its crash-free sessions and the issues it introduced, newest first.';
cases.push({
  name: 'heading page description',
  html: `<p class="vp-page-desc">${TEXT}</p>`,
  checks: [{ target: '.vp-page-desc', props: [...DESC, ...MARGIN] }],
});
cases.push({
  name: 'heading group title',
  html: '<h3 class="vp-group-title">API keys</h3>',
  checks: [{ target: '.vp-group-title', props: [...HEADING, ...MARGIN] }],
});

// the example: the four under one another, spaced by the page's utilities
cases.push({
  name: 'heading example',
  html: ex('basic'),
  checks: [
    { target: '.vp-page-title', props: [...HEADING, 'offset-top'] },
    { target: '.vp-page-desc', props: [...DESC, 'offset-top'] },
    { target: '.vp-section-title', props: [...HEADING, 'margin-top', 'offset-top'] },
    { target: '.vp-group-title', props: [...HEADING, 'margin-top', 'offset-top'] },
  ],
});

// inside a vp-doc, whose rules for headings and paragraphs are in play,
// the section and group titles on an h2, whose markdown rule has a rule
// above it, padding and margins: each as it is outside one
const FOUR =
  '<h1 class="vp-page-title">Releases</h1>' +
  `<p class="vp-page-desc">${TEXT}</p>` +
  '<h2 class="vp-section-title">Retention</h2>' +
  '<h2 class="vp-group-title">API keys</h2>';
const BOX = [...MARGIN, 'border-top-width', 'padding-top', 'offset-top'];
cases.push({
  name: 'heading in a doc',
  html: inDoc(FOUR),
  reference: `<div>${FOUR}</div>`,
  checks: [
    { target: '.vp-page-title', props: [...HEADING, ...BOX] },
    { target: '.vp-page-desc', props: [...DESC, ...BOX] },
    { target: '.vp-section-title', props: [...HEADING, ...BOX] },
    { target: '.vp-group-title', props: [...HEADING, ...BOX] },
  ],
});
