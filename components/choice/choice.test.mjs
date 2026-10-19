// vp-choice: vpkit's own, so golden: the card's box, type and colors at
// rest, hovered, checked and with its control focused from the keyboard
// (the ring on the card, none on the control), the control's size and
// color; a disabled card, dimmed, checked or not; and against vpkit: a disabled card hovered
// looks as it does at rest, a disabled control nested deeper in the text
// leaves the card as it is, a touch screen's hover is rest.

import { BORDER, COLORS, OUTLINE, PADDING, RADIUS, TRANSITION, examples } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const BOXP = ['display', 'align-items', 'column-gap', ...BORDER, ...RADIUS, ...PADDING, ...COLORS, 'font-size', 'line-height', 'cursor', ...TRANSITION, 'height'];
const CONTROL = ['margin-top', 'width', 'height', 'flex-shrink', 'accent-color'];
const card = (attrs, text) => `<label class="vp-choice"><input type="radio" name="plan"${attrs}><span>${text}</span></label>`;

// at rest, hovered, with the control focused from the keyboard; the control
for (const checked of [false, true]) {
  cases.push({
    name: `choice${checked ? ' checked' : ''}`,
    html: card(checked ? ' checked' : '', 'Monthly<br>NT$300 a month, cancel any time'),
    checks: [
      { target: '.vp-choice', props: [...BOXP, ...OUTLINE] },
      { target: '.vp-choice', state: ['hover'], props: COLORS },
      { target: '.vp-choice', on: 'input', state: ['focus-visible'], props: OUTLINE },
      { target: 'input', state: ['focus-visible'], props: OUTLINE },
      { target: 'input', props: CONTROL },
    ],
  });
}

// on a touch screen a hovered card looks as it does at rest
{
  const html = card('', 'Monthly<br>NT$300 a month');
  cases.push({
    name: 'choice on a touch screen',
    touch: true,
    html,
    reference: html,
    checks: [{ target: '.vp-choice', state: ['hover'], refState: [], props: COLORS }],
  });
}

// a card whose control is disabled: dimmed with a not-allowed cursor,
// checked keeping the checked look; hovered, it looks as it does at rest
for (const checked of [false, true]) {
  const html = card(` disabled${checked ? ' checked' : ''}`, 'read<br>minted on the command line');
  const name = `choice disabled${checked ? ' checked' : ''}`;
  cases.push({
    name,
    html,
    checks: [{ target: '.vp-choice', props: [...COLORS, 'opacity', 'cursor'] }],
  });
  cases.push({
    name: `${name} hovered`,
    html,
    reference: html,
    checks: [{ target: '.vp-choice', state: ['hover'], refState: [], props: [...COLORS, 'opacity'] }],
  });
}

// only the card's own control: a disabled select nested in its text leaves
// the card as it is, at rest and hovered
{
  const nested = (disabled) => `<label class="vp-choice"><input type="radio" name="r"><span>Resolved in <select${disabled ? ' disabled' : ''}><option>2.4.1</option></select></span></label>`;
  cases.push({
    name: 'choice with a disabled control nested deeper',
    html: nested(true),
    reference: nested(false),
    checks: [
      { target: '.vp-choice', props: [...COLORS, 'opacity', 'cursor'] },
      { target: '.vp-choice', state: ['hover'], props: COLORS },
    ],
  });
}

// the examples: two plans, the checked one on the tint; three scopes with
// the last disabled; a checkbox card
cases.push({
  name: 'choice plans example',
  html: ex('plans'),
  checks: [
    { target: '.vp-choice:has(:checked)', props: [...COLORS, 'height'] },
    { target: '.vp-choice:not(:has(:checked))', props: [...COLORS, 'height', 'offset-top'] },
  ],
});
cases.push({
  name: 'choice disabled example',
  html: ex('disabled'),
  checks: [
    { target: '.vp-choice:has(:disabled)', props: [...COLORS, 'opacity', 'cursor'] },
    { target: '.vp-choice:has(:checked)', props: [...COLORS, 'opacity', 'cursor'] },
  ],
});
cases.push({
  name: 'choice checkbox example',
  html: ex('checkbox'),
  checks: [
    { target: '.vp-choice', props: [...BOXP, ...OUTLINE] },
    { target: '.vp-choice', on: 'input', state: ['focus-visible'], props: OUTLINE },
    { target: 'input', props: CONTROL },
  ],
});
