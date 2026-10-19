// vp-dropdown against VitePress's VPMenu with VPMenuLink items and
// VPMenuGroup groups (test/upstream/components/), as VitePress renders
// them (ul/li), against vpkit's flat markup: items and groups straight in
// the panel. A <button> item stands where upstream has a link, and
// aria-checked marks the current item where VPMenuLink has .active. Each
// wrapper is inline-block, as the flyout's absolute box sizes the menu to
// its content. What is VitePress's is compared with it: the panel, the
// items at rest, hovered and current, the groups and their titles. What
// is vpkit's is golden or against vpkit: the examples, aria-current's
// values, the padding local, the focus ring, a touch screen, a vp-doc
// around it (alert.test.mjs holds an item inside an alert).

import { BORDER, COLORS, MARGIN, OUTLINE, PADDING, RADIUS, TRANSITION, examples } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const UPSTREAM = { files: ['components/VPMenu.vue', 'components/VPMenuLink.vue', 'components/VPMenuGroup.vue'] };
const menuLink = (text, extra = '', t = '') => `<li class="VPMenuLink"><a${t ? ` data-t="${t}"` : ''} class="VPLink link${extra}" href="#"><span>${text}</span></a></li>`;
const menuGroup = (t, title, links) => `<li data-t="${t}" class="VPMenuGroup">${title ? `<p data-t="${t}-title" class="title">${title}</p>` : ''}<ul>${links}</ul></li>`;
const menu = (inner) => `<div style="display:inline-block"><div data-t="menu" class="VPMenu"><ul class="items">${inner}</ul></div></div>`;
const item = (text, t = '', attrs = ' href="#"', tag = 'a') => `<${tag}${t ? ` data-t="${t}"` : ''} class="vp-dropdown-item"${attrs}>${text}</${tag}>`;
const group = (t, title, items) => `<div data-t="${t}" class="vp-dropdown-group" role="group">${title ? `<p data-t="${t}-title" class="vp-dropdown-title">${title}</p>` : ''}${items}</div>`;
const panel = (inner, style = '') => `<div style="display:inline-block"><div data-t="menu" class="vp-dropdown" role="menu"${style}>${inner}</div></div>`;

// The heights of a panel and of a group sum their 32px rows, and the
// minified build makes each row 1/64px short (2.2857143 printed as
// 2.28571), so each height check allows 1/64px per row it holds; a wrong
// margin or padding is a pixel or more
const PANEL = [...BORDER, ...RADIUS, ...PADDING, ...COLORS, 'box-shadow', 'min-width', 'max-height', 'overflow-y', ...TRANSITION, 'width'];
const rows = (target, n) => ({ target, props: ['height'], tolerance: n / 64 });
const ITEM = ['display', ...PADDING, ...RADIUS, 'line-height', 'font-size', 'font-weight', 'color', 'background-color', 'text-align', 'text-decoration-line', 'white-space', ...TRANSITION, 'width', 'height'];
const GROUP = [...MARGIN, 'border-top-width', 'border-top-style', 'border-top-color', ...PADDING];
const TITLE = [...PADDING, 'line-height', 'font-size', 'font-weight', 'color', 'white-space', ...TRANSITION];
const T = (t) => `[data-t="${t}"]`;

// items, a current one, a group with a title and a second group
cases.push({
  name: 'dropdown',
  upstream: {
    ...UPSTREAM,
    html: menu(
      menuLink('Profile', '', 'item') + menuLink('Settings', ' active', 'current') +
      menuGroup('group', 'Sort by', menuLink('Name', '', 'gitem') + menuLink('Date')) +
      menuGroup('group2', 'View', menuLink('As a list')),
    ),
  },
  html: panel(
    item('Profile', 'item') + item('Settings', 'current', ' type="button" role="menuitemradio" aria-checked="true"', 'button') +
    group('group', 'Sort by', item('Name', 'gitem') + item('Date')) +
    group('group2', 'View', item('As a list')),
  ),
  checks: [
    { target: T('menu'), props: PANEL },
    rows(T('menu'), 7),
    { target: T('item'), props: ITEM },
    { target: T('item'), state: ['hover'], props: ['color', 'background-color'] },
    { target: T('current'), props: ITEM },
    { target: T('gitem'), props: ITEM },
    { target: T('group'), props: GROUP },
    rows(T('group'), 3),
    { target: T('group-title'), props: TITLE },
    { target: T('group2'), props: GROUP },
    rows(T('group2'), 2),
  ],
});

// groups only: the first group has no rule above it, a group without a title
cases.push({
  name: 'dropdown of groups',
  upstream: {
    ...UPSTREAM,
    html: menu(menuGroup('group', 'Sort by', menuLink('Name') + menuLink('Date')) + menuGroup('group2', '', menuLink('Sign out'))),
  },
  html: panel(group('group', 'Sort by', item('Name') + item('Date')) + group('group2', '', item('Sign out'))),
  checks: [
    { target: T('menu'), props: PANEL },
    rows(T('menu'), 4),
    { target: T('group'), props: GROUP },
    rows(T('group'), 3),
    { target: T('group2'), props: GROUP },
    rows(T('group2'), 1),
  ],
});

// the examples: the menu with a current link, a group of radio items with
// the checked one current; and the tighter panel
cases.push({
  name: 'dropdown example',
  html: `<div style="display:inline-block">${ex('menu')}</div>`,
  checks: [
    { target: '.vp-dropdown', props: [...PANEL, 'height'] },
    { target: '.vp-dropdown-item[aria-current="page"]', props: ['color', 'background-color', 'height', 'width'] },
    { target: '.vp-dropdown-item[aria-checked="true"]', props: ['color', 'background-color', 'height', 'width'] },
    { target: '.vp-dropdown-item[aria-checked="false"]', props: ['color', 'background-color'] },
    { target: '.vp-dropdown-group', props: [...GROUP, 'height'] },
    { target: '.vp-dropdown-title', props: [...TITLE, ...MARGIN] },
  ],
});
cases.push({
  name: 'dropdown example with 0.5rem of padding',
  html: `<div style="display:inline-block">${ex('padding')}</div>`,
  checks: [
    { target: '.vp-dropdown', props: [...PADDING, 'width', 'height'] },
    { target: '.vp-dropdown-group', props: [...MARGIN, ...PADDING, 'offset-left', 'width'] },
  ],
});

// the current item by aria-current: a value marks it, and the values
// WAI-ARIA 1.2 treats as false ("false", "", and a template's stringified
// undefined) leave it plain
cases.push({
  name: 'dropdown item aria-current=page',
  html: `<div class="vp-dropdown">${item('Settings', 'item', ' href="#" aria-current="page"')}</div>`,
  reference: `<div class="vp-dropdown">${item('Settings', 'item', ' type="button" role="menuitemradio" aria-checked="true"', 'button')}</div>`,
  checks: [{ target: T('item'), props: ['color'] }],
});
for (const value of ['false', '', 'undefined']) {
  cases.push({
    name: `dropdown item aria-current="${value}"`,
    html: `<div class="vp-dropdown">${item('Settings', 'item', ` href="#" aria-current="${value}"`)}</div>`,
    reference: `<div class="vp-dropdown">${item('Settings', 'item')}</div>`,
    checks: [{ target: T('item'), props: ['color'] }],
  });
}

// a panel with other padding, set through --vp-dropdown-padding: its
// groups still reach both edges (the reference writes that out inline)
cases.push({
  name: 'dropdown with 0.5rem of padding',
  html: panel(item('Profile') + `<div data-t="group" class="vp-dropdown-group">${item('Name')}</div>`, ' style="--vp-dropdown-padding:0.5rem"'),
  reference: panel(item('Profile') + `<div data-t="group" class="vp-dropdown-group" style="margin:0.75rem -0.5rem 0;padding:0.75rem 0.5rem 0">${item('Name')}</div>`, ' style="padding:0.5rem"'),
  checks: [
    { target: T('menu'), props: [...PADDING, 'width'] },
    { target: T('group'), props: [...MARGIN, ...PADDING, 'offset-left'] },
  ],
});

// the focus ring: base.css's outline on an item
cases.push({
  name: 'dropdown item focused',
  html: `<div class="vp-dropdown">${item('Profile', 'item')}</div>`,
  checks: [{ target: T('item'), state: ['focus-visible'], props: OUTLINE }],
});

// on a touch screen a hovered item looks as it does at rest
{
  const html = `<div class="vp-dropdown">${item('Profile', 'item')}</div>`;
  cases.push({
    name: 'dropdown item on a touch screen',
    touch: true,
    html,
    reference: html,
    checks: [{ target: T('item'), state: ['hover'], refState: [], props: ['color', 'background-color'] }],
  });
}

// inside a vp-doc (prose.css, compiled last, as an app imports it): the
// markdown's rules for a link and a paragraph leave an item and a title
// as they are alone
const LOOK = ['color', 'text-decoration-line', 'font-weight'];
{
  const html = `<div class="vp-dropdown">${item('Profile', 'item')}</div>`;
  cases.push({
    name: 'dropdown item in a doc',
    html: `<div class="vp-doc">${html}</div>`,
    reference: html,
    checks: [
      { target: T('item'), props: [...LOOK, ...TRANSITION] },
      { target: T('item'), state: ['hover'], props: ['color', 'background-color'] },
    ],
  });
}
{
  const html = `<div class="vp-dropdown">${group('g', 'Sort by', item('Name'))}</div>`;
  cases.push({
    name: 'dropdown title in a doc',
    html: `<div class="vp-doc">${html}</div>`,
    reference: html,
    checks: [{ target: T('g-title'), props: ['margin-top', 'margin-bottom', 'line-height'] }],
  });
}
