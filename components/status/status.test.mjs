// vp-status: vpkit's own, so golden: the line's type and color at rest and
// in its error and success states (the example's three replies), a slot
// holding a fragment whose blocks keep the document's ink, an empty slot.
// vpkit against vpkit: inside a vp-doc against itself outside one, and a
// component inside the slot against itself alone.

import { MARGIN, examples, inDoc } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const STATUS = ['font-size', 'line-height', 'color', ...MARGIN, 'height'];

// the example's three replies: at rest, in error, in success
cases.push({ name: 'status', html: ex('replies'), checks: [{ target: '.vp-status:not([data-state])', props: STATUS }] });
cases.push({ name: 'status error', html: ex('replies'), checks: [{ target: '.vp-status[data-state="error"]', props: STATUS }] });
cases.push({ name: 'status success', html: ex('replies'), checks: [{ target: '.vp-status[data-state="success"]', props: STATUS }] });

// a slot holding a fragment, with the page's margin: its paragraph and
// its table keep the document's ink
cases.push({
  name: 'status holding a fragment',
  html: '<div class="vp-status mt-4"><p>3 orders matched.</p><table><tr><td>ORD-1</td></tr></table></div>',
  checks: [
    { target: '.vp-status', props: STATUS },
    { target: 'p', props: ['color', 'font-size'] },
    { target: 'table', props: ['color', 'font-size'] },
  ],
});

// an empty slot has no height, and the page's empty:mt-0 drops its margin
cases.push({
  name: 'status empty',
  html: '<div class="vp-status mt-4 empty:mt-0" role="status"></div>',
  checks: [{ target: '.vp-status', props: ['height', ...MARGIN] }],
});

// inside a vp-doc (prose.css), against itself outside one
{
  const html = '<div class="vp-status" data-state="error">That code has expired.</div>';
  cases.push({
    name: 'status in a doc',
    html: inDoc(html),
    reference: `<div>${html}</div>`,
    checks: [{ target: '.vp-status', props: STATUS }],
  });
}

// a component inside keeps its own color: a vp-empty, whose description is
// a paragraph in secondary text, against itself alone (the ink rule is for
// bare blocks; the title has a color of its own either way)
{
  const empty = '<div class="vp-empty"><p class="vp-empty-title">No orders</p><p class="vp-empty-desc">Nothing matched.</p></div>';
  cases.push({
    name: 'status holding an empty state',
    html: `<div class="vp-status">${empty}</div>`,
    reference: `<div>${empty}</div>`,
    checks: [
      { target: '.vp-empty', props: ['color', 'background-color'] },
      { target: '.vp-empty-title', props: ['color'] },
      { target: '.vp-empty-desc', props: ['color'] },
    ],
  });
}
