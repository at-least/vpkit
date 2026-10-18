// The page: base.css's rules on the page itself, which no component holds.
// Against VitePress's base.css (the runner loads it on every upstream page,
// so no case names a file): the body it paints (its colors, legibility,
// font smoothing, no autospace or spacing trim) with the type under it
// (Tailwind's preflight on tokens.css's font stack; VitePress's own base
// on its fonts.css), and the placeholder of a bare input and textarea.
// vpkit's own, so golden: the one focus ring, base.css's `:focus-visible`
// outline on a bare field focused from the keyboard, where VitePress's
// base leaves a field without a ring (`outline: none` on focus), and on a
// button and a link, where VitePress keeps the browser's.

import { OUTLINE } from '../harness.mjs';

export const cases = [];

// what VitePress's base.css sets on the body, and the type under it
const PAGE = ['color', 'background-color', 'font-family', 'font-size', 'line-height', 'text-rendering', '-webkit-font-smoothing', '-moz-osx-font-smoothing', 'text-autospace', 'text-spacing-trim'];
const FIELDS = '<input data-t="in" placeholder="Search"><textarea data-t="ta" placeholder="A note"></textarea><select data-t="sel"><option>7 days</option></select>';
const ring = (t) => ({ target: `[data-t="${t}"]`, state: ['focus', 'focus-visible'], props: OUTLINE });

cases.push({
  name: 'page body',
  upstream: { html: '<p>Text</p>' },
  html: '<p>Text</p>',
  checks: [{ target: 'body', props: PAGE }],
});

cases.push({
  name: 'page placeholder',
  upstream: { html: FIELDS },
  html: FIELDS,
  checks: [
    { target: '[data-t="in"]', pseudo: '::placeholder', props: ['color'] },
    { target: '[data-t="ta"]', pseudo: '::placeholder', props: ['color'] },
  ],
});

// the ring on a bare field focused from the keyboard: an input, a
// textarea, a select
cases.push({ name: 'page focus ring on a field', html: FIELDS, checks: ['in', 'ta', 'sel'].map(ring) });

// and on a button and a link
cases.push({
  name: 'page focus ring on a button',
  html: '<button data-t="btn" type="button">Save</button> <a data-t="a" href="#">Docs</a>',
  checks: ['btn', 'a'].map(ring),
});
