// vp-progress: vpkit's own, so golden: the track and its fill at a value
// (the example 7rem wide at 40%), the fill with no width set, the
// indeterminate bar's sweep and, under reduced motion, its full-width
// bar at 0.6; a bar in a flex row with a label. Against vpkit: a bar
// alone in a flex row is as wide as the row, as it is in block flow.

import { RADIUS, examples } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const TRACK = ['display', 'width', 'height', ...RADIUS, 'background-color', 'overflow-x', 'overflow-y'];
const FILL = ['display', 'width', 'height', 'background-color'];
const SWEEP = ['width', 'opacity', 'animation-name', 'animation-duration', 'animation-timing-function', 'animation-iteration-count'];

// the track 7rem wide (w-28) and the fill at 40%
cases.push({
  name: 'progress',
  html: ex('bar'),
  checks: [
    { target: '.vp-progress', props: TRACK },
    { target: '.vp-progress-bar', props: FILL },
  ],
});

// without a width of its own, the fill is empty
cases.push({
  name: 'progress with no width set',
  html: '<span class="vp-progress" style="width:7rem"><span class="vp-progress-bar"></span></span>',
  checks: [{ target: '.vp-progress-bar', props: ['width'] }],
});

// indeterminate: a progressbar with no value, its 30% bar sweeping across
// in 1s; under reduced motion the whole track at 0.6, the sweep cut to a
// millisecond by base.css
cases.push({
  name: 'progress indeterminate',
  html: ex('loading'),
  checks: [{ target: '.vp-progress-bar', props: SWEEP }],
});
cases.push({
  name: 'progress indeterminate under reduced motion',
  reducedMotion: true,
  html: ex('loading'),
  checks: [{ target: '.vp-progress-bar', props: SWEEP }],
});

// a bar alone in a flex row is as wide as the row, as it is in block flow
// (an empty flex item is otherwise 0px wide)
{
  const bar = '<span class="vp-progress"><span class="vp-progress-bar" style="width:40%"></span></span>';
  cases.push({
    name: 'progress in a flex row',
    html: `<div style="width:300px;display:flex">${bar}</div>`,
    reference: `<div style="width:300px">${bar}</div>`,
    checks: [{ target: '.vp-progress', props: ['width'] }, { target: '.vp-progress-bar', props: ['width'] }],
  });
}

// the example in a row: flex-1 takes the free space, the label on one line
cases.push({
  name: 'progress in a row with a label',
  html: ex('row'),
  checks: [
    { target: '.vp-progress', props: ['width', 'height', 'flex-grow', 'offset-left'] },
    { target: '.vp-progress + span', props: ['offset-left', 'height'] },
  ],
});
