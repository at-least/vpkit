// vp-avatar against VitePress's VPTeamMembersItem
// (test/upstream/components/VPTeamMembersItem.vue): the small card's round
// box, `.avatar`, and the picture filling it, `.avatar-img`, against the one
// element here (the box's centering is not ported, so its margins are not
// compared); then inside a vp-doc against itself alone. The examples'
// sizes and the initials are golden: vpkit's uses of the class.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MARGIN, RADIUS, example } from '../../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const SRC = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='%23888'/%3E%3C/svg%3E";
const AVATAR = `<img class="vp-avatar" src="${SRC}" alt="">`;
const LOOK = ['flex-shrink', 'width', 'height', ...RADIUS, 'box-shadow', 'object-fit'];

// VitePress's: the box's size, circle and shadow, the picture's crop
cases.push({
  name: 'avatar',
  upstream: {
    files: ['components/VPTeamMembersItem.vue'],
    html: `<article class="VPTeamMembersItem small"><div class="profile"><figure class="avatar"><img class="avatar-img" src="${SRC}" alt=""></figure></div></article>`,
  },
  html: AVATAR,
  checks: [
    { target: '.vp-avatar', refTarget: '.avatar', props: ['flex-shrink', 'width', 'height', ...RADIUS, 'box-shadow'] },
    { target: '.vp-avatar', refTarget: '.avatar-img', props: ['object-fit', ...RADIUS, 'width', 'height'] },
  ],
});

// inside a vp-doc (prose.css), whose rule for an image gives it margins
// above and below: against itself alone
cases.push({
  name: 'avatar in a doc',
  html: `<div class="vp-doc">${AVATAR}</div>`,
  reference: `<div>${AVATAR}</div>`,
  checks: [{ target: '.vp-avatar', props: [...MARGIN, 'width', 'height', 'max-width'] }],
});

// the examples: the picture; the sizes a utility sets, beside a name in a
// row; initials in place of a picture, centered and grounded by utilities
cases.push({ name: 'avatar example', html: ex('basic'), checks: [{ target: '.vp-avatar', props: ['display', ...LOOK] }] });
cases.push({
  name: 'avatar sizes',
  html: ex('sizes'),
  checks: [
    { target: '.vp-avatar.size-8', props: [...LOOK, 'offset-top'] },
    { target: '.vp-avatar.size-24', props: LOOK },
  ],
});
cases.push({
  name: 'avatar initials',
  html: ex('initials'),
  checks: [{ target: '.vp-avatar', props: ['display', 'align-items', 'justify-content', 'color', 'background-color', 'font-weight', ...LOOK] }],
});
