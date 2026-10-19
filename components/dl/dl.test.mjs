// vp-dl: vpkit's own, so golden: the list (the example's order details,
// with the page's sm:grid-cols-2), wide and at a phone's width, and the
// inline variant. vpkit against vpkit: both inside a vp-doc against
// themselves outside one.

import { MARGIN, examples, inDoc } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const LIST = ['display', 'row-gap', 'column-gap', 'grid-template-columns', 'align-items', 'height'];
const TERM = ['font-size', 'line-height', 'font-weight', 'color', 'text-transform', 'letter-spacing', ...MARGIN, 'offset-top', 'offset-left'];
const DESC = ['font-size', 'line-height', 'font-weight', 'color', 'overflow-wrap', ...MARGIN, 'offset-top', 'offset-left', 'width'];
// the list, and its first three terms and values: pairs in a <div>, or
// straight in the list
const stacked = [{ target: '.vp-dl', props: LIST }, ...[1, 2, 3].flatMap((n) => [
  { target: `.vp-dl > div:nth-child(${n}) > dt`, props: TERM },
  { target: `.vp-dl > div:nth-child(${n}) > dd`, props: DESC },
])];
const inline = [{ target: '.vp-dl', props: LIST }, ...[1, 2, 3].flatMap((n) => [
  { target: `.vp-dl > dt:nth-of-type(${n})`, props: TERM },
  { target: `.vp-dl > dd:nth-of-type(${n})`, props: DESC },
])];

// the order's details in a 40rem column: two columns, one at a phone's width
for (const [name, width] of [['dl', undefined], ["dl at a phone's width", 375]]) {
  cases.push({
    name,
    width,
    html: `<div style="width:min(40rem,100%)">${ex('basic')}</div>`,
    checks: stacked,
  });
}

// the inline variant: terms beside their values, in a 20rem column
cases.push({
  name: 'dl inline',
  html: `<div style="width:20rem">${ex('inline')}</div>`,
  checks: inline,
});

// inside a vp-doc, against themselves outside one
cases.push({
  name: 'dl in a doc',
  html: `<div style="width:40rem">${inDoc(ex('basic'))}</div>`,
  reference: `<div style="width:40rem">${ex('basic')}</div>`,
  checks: stacked,
});
cases.push({
  name: 'dl inline in a doc',
  html: `<div style="width:20rem">${inDoc(ex('inline'))}</div>`,
  reference: `<div style="width:20rem">${ex('inline')}</div>`,
  checks: inline,
});
