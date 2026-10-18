// vp-link against VitePress's markdown link (test/upstream/vp-doc.css,
// `.vp-doc a`), as a link and as a button drawn as one, with code inside:
// its colors at rest and while the link is hovered. vpkit's own, golden:
// the quiet variant. vpkit against vpkit: the quiet link against the text
// around it, inside a vp-doc against itself outside one, and a touch
// screen's hover at rest.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TRANSITION, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const UPSTREAM = { files: ['vp-doc.css'] };
const LINK = ['color', 'font-weight', 'text-decoration-line', 'text-underline-offset', ...TRANSITION, 'opacity'];
const LOOK = ['color', 'font-weight', 'text-decoration-line'];
const A = '[data-t="a"]';
const CODE = '[data-t="code"]';
const inDoc = (html) => `<div class="vp-doc">${html}</div>`;

// as a link and as a button, with code inside, against the markdown's link
for (const tag of ['a', 'button']) {
  const attrs = tag === 'a' ? ' href="#"' : ' type="button"';
  cases.push({
    name: `link <${tag}>`,
    upstream: { ...UPSTREAM, html: inDoc('<p><a href="#">Orders with <code>code</code></a></p>') },
    html: `<p><${tag} class="vp-link"${attrs}>Orders with <code>code</code></${tag}></p>`,
    checks: [
      { target: '.vp-link', refTarget: 'a', props: [...LINK, 'font-size'] },
      { target: '.vp-link', refTarget: 'a', state: ['hover'], props: ['color'] },
      { target: 'code', props: ['color'] },
      { target: 'code', on: '.vp-link', refOn: 'a', state: ['hover'], props: ['color'] },
    ],
  });
}

// the quiet variant, vpkit's: the text's color and weight, no underline,
// brand when hovered
const QUIET = '<p class="text-secondary">Kept in <a data-t="a" class="vp-link" data-variant="quiet" href="#">docs/2026</a> since May.</p>';
cases.push({
  name: 'link quiet',
  html: QUIET,
  checks: [
    { target: A, props: LINK },
    { target: A, state: ['hover'], props: ['color', 'text-decoration-line'] },
  ],
});
// its color and weight are the text's around it: against that text alone
cases.push({
  name: 'link quiet against its text',
  reference: '<p class="text-secondary">Kept in docs/2026 since May.</p>',
  html: QUIET,
  checks: [{ target: A, refTarget: 'p', props: ['color', 'font-weight'] }],
});
// inside a vp-doc, whose rule for a link is in play, against itself outside one
cases.push({
  name: 'link quiet in a doc',
  reference: `<div>${QUIET}</div>`,
  html: inDoc(QUIET),
  checks: [
    { target: A, props: LOOK },
    { target: A, state: ['hover'], props: ['color', 'text-decoration-line'] },
  ],
});

// the examples
cases.push({
  name: 'link examples',
  upstream: { ...UPSTREAM, html: inDoc('<p><a href="#">All orders</a></p>') },
  html: ex('basic'),
  checks: [
    { target: 'a.vp-link', refTarget: 'a', props: LINK },
    { target: 'button.vp-link', refTarget: 'a', props: LINK },
    { target: 'a.vp-link', refTarget: 'a', state: ['hover'], props: ['color'] },
    { target: 'button.vp-link', refTarget: 'a', state: ['hover'], props: ['color'] },
  ],
});
cases.push({
  name: 'link code example',
  upstream: { ...UPSTREAM, html: inDoc('<p><a href="#">Order <code>ORD-2026-0142</code></a></p>') },
  html: ex('code'),
  checks: [
    { target: '.vp-link', refTarget: 'a', props: LINK },
    { target: 'code', props: ['color', 'background-color'] },
    { target: 'code', on: '.vp-link', refOn: 'a', state: ['hover'], props: ['color'] },
  ],
});
cases.push({
  name: 'link quiet example',
  html: ex('quiet'),
  checks: [
    { target: 'a.font-medium', props: LOOK },
    { target: 'p > a', props: LOOK },
    { target: 'p > a', state: ['hover'], props: ['color'] },
  ],
});

// on a touch screen a hovered link looks as it does at rest
const CODE_LINK = '<a data-t="a" class="vp-link" href="#">Orders <code data-t="code">code</code></a>';
cases.push({
  name: 'link on a touch screen',
  touch: true,
  html: CODE_LINK,
  reference: CODE_LINK,
  checks: [
    { target: A, state: ['hover'], refState: [], props: ['color'] },
    { target: CODE, on: A, state: ['hover'], refState: [], props: ['color'] },
  ],
});
const QUIET_LINK = '<a data-t="a" class="vp-link" data-variant="quiet" href="#">notes.txt</a>';
cases.push({
  name: 'link quiet on a touch screen',
  touch: true,
  html: QUIET_LINK,
  reference: QUIET_LINK,
  checks: [{ target: A, state: ['hover'], refState: [], props: ['color'] }],
});
