import {
  OWN_DRIVE_BAR,
  OWN_DRIVE_BAR_FILL,
  OWN_DRIVE_BTN_DANGER,
  OWN_DRIVE_BTN_ROW,
  OWN_DRIVE_MODAL,
  OWN_DRIVE_MODAL_H3,
  OWN_DRIVE_MSG,
  TOTALITY_CHOICE,
  TOTALITY_FIELD_LABEL,
  TOTALITY_INPUT,
  TOTALITY_MSG_ERROR,
} from './recipes.mjs';

// The component matrix. Each case renders the same thing twice, with
// VitePress's classes and with vpkit's; elements to measure carry data-t.
// A check names the element, the properties to compare and, optionally,
// the pseudo-classes to force on it (or on the element named by `on`).

const SIDES = ['top', 'right', 'bottom', 'left'];
const BORDER = SIDES.flatMap((s) => [`border-${s}-width`, `border-${s}-style`]);
const RADIUS = ['top-left', 'top-right', 'bottom-right', 'bottom-left'].map(
  (c) => `border-${c}-radius`,
);
const PADDING = SIDES.map((s) => `padding-${s}`);
const COLORS = ['color', 'background-color', ...SIDES.map((s) => `border-${s}-color`)];
const TRANSITION = ['transition-property', 'transition-duration'];

export const cases = [];

// Intentional differences from upstream. A difference that matches an
// entry (case name, element, property) is reported instead of failing;
// an entry that matches nothing fails the run, so none outlives its cause.
export const known = [
  {
    case: /^button (brand|alt|sponsor) (medium|big) </,
    target: 'btn',
    prop: 'display',
    reason:
      'vp-btn is inline-flex (centered, 0.5rem gap) so an icon and its label sit side by side, as the apps need; VPButton is inline-block. The "button with an icon" case checks the flex layout against VPButton with that layout inline',
  },
  {
    case: /^alert info nested in tip$/,
    target: 'code',
    prop: 'background-color',
    reason:
      "VitePress's `.custom-block.tip code` also matches code inside a nested info block (it comes later in custom-block.css); a nested vp-alert keeps its own code background",
  },
  {
    case: /^button inside an alert$/,
    target: 'btn',
    prop: 'opacity',
    reason:
      "the alert's link hover dimming (opacity 0.75) also reaches a vp-btn link inside it; the button sets no opacity of its own",
  },
];

// button: VPButton's three themes × two sizes, as a link and as a button
const BUTTON_BOX = [
  'display',
  ...BORDER,
  ...RADIUS,
  ...PADDING,
  'line-height',
  'font-size',
  'font-weight',
  'text-align',
  'white-space',
  'text-decoration-line',
  'cursor',
  'height',
];
const THEMES = { brand: 'vp-btn-brand', alt: '', sponsor: 'vp-btn-sponsor' };
const SIZES = { medium: '', big: 'vp-btn-big' };
for (const [theme, themeClass] of Object.entries(THEMES)) {
  for (const [size, sizeClass] of Object.entries(SIZES)) {
    for (const tag of ['a', 'button']) {
      const attrs = tag === 'a' ? ' href="#"' : '';
      const vpkit = ['vp-btn', sizeClass, themeClass].filter(Boolean).join(' ');
      cases.push({
        name: `button ${theme} ${size} <${tag}>`,
        upstream: `<${tag} data-t="btn" class="VPButton ${size} ${theme}"${attrs}>Get Started</${tag}>`,
        vpkit: `<${tag} data-t="btn" class="${vpkit}"${attrs}>Get Started</${tag}>`,
        checks: [
          { target: 'btn', props: [...BUTTON_BOX, ...COLORS, ...TRANSITION] },
          { target: 'btn', state: ['hover'], props: [...COLORS, ...TRANSITION] },
          { target: 'btn', state: ['hover', 'active'], props: [...COLORS, ...TRANSITION] },
        ],
      });
    }
  }
}

// vp-btn's additions, each against VPButton with the addition written
// inline: the flex layout with an icon, and the disabled state
const FLEX = 'display:inline-flex;align-items:center;justify-content:center;gap:0.5rem';
const LAYOUT = ['display', 'align-items', 'justify-content', 'column-gap', 'height'];
const ICON = '<svg data-t="icon" width="16" height="16" viewBox="0 0 16 16"></svg>';
cases.push({
  name: 'button with an icon',
  upstream: `<a data-t="btn" class="VPButton medium brand" href="#" style="${FLEX}">${ICON}Sign in</a>`,
  vpkit: `<a data-t="btn" class="vp-btn vp-btn-brand" href="#">${ICON}Sign in</a>`,
  checks: [
    { target: 'btn', props: [...BUTTON_BOX, ...LAYOUT, 'width'] },
    { target: 'icon', props: ['offset-top', 'offset-left', 'height'] },
  ],
});
cases.push({
  name: 'button disabled',
  upstream: `<button data-t="btn" class="VPButton medium brand" disabled style="${FLEX};opacity:0.5;cursor:not-allowed">Pay</button>`,
  vpkit: `<button data-t="btn" class="vp-btn vp-btn-brand" disabled>Pay</button>`,
  checks: [{ target: 'btn', props: [...BUTTON_BOX, ...LAYOUT, ...COLORS, 'opacity'] }],
});

// badge: VPBadge's seven types × two sizes; info is vpkit's bare class
const BADGE_BOX = [
  'display',
  ...SIDES.map((s) => `margin-${s}`),
  ...BORDER,
  ...RADIUS,
  ...PADDING,
  'line-height',
  'font-size',
  'font-weight',
  'white-space',
  'transform',
  'height',
];
const TYPES = ['info', 'note', 'tip', 'important', 'caution', 'warning', 'danger'];
for (const type of TYPES) {
  for (const small of [false, true]) {
    const vpkit = [
      'vp-badge',
      type === 'info' ? '' : `vp-badge-${type}`,
      small ? 'vp-badge-small' : '',
    ].filter(Boolean).join(' ');
    cases.push({
      name: `badge ${type}${small ? ' small' : ''}`,
      upstream: `<span data-t="badge" class="VPBadge ${type}${small ? ' small' : ''}">beta</span>`,
      vpkit: `<span data-t="badge" class="${vpkit}">beta</span>`,
      checks: [{ target: 'badge', props: [...BADGE_BOX, ...COLORS] }],
    });
  }
}

// vp-badge-success, vpkit's addition: VPBadge with success colors in the
// pattern of the other types, written inline
for (const small of [false, true]) {
  const style = 'border-color:transparent;color:var(--vp-c-success-1);background-color:var(--vp-c-success-soft)';
  cases.push({
    name: `badge success${small ? ' small' : ''}`,
    upstream: `<span data-t="badge" class="VPBadge${small ? ' small' : ''}" style="${style}">paid</span>`,
    vpkit: `<span data-t="badge" class="vp-badge vp-badge-success${small ? ' vp-badge-small' : ''}">paid</span>`,
    checks: [{ target: 'badge', props: [...BADGE_BOX, ...COLORS] }],
  });
}

// a badge in a .vp-doc heading, each level, small or not, and in the doc
// footer: VPBadge.vue's rules for those places
for (const level of [1, 2, 3, 4, 5, 6]) {
  for (const small of [false, true]) {
    cases.push({
      name: `badge in h${level}${small ? ', small' : ''}`,
      upstream: `<div class="vp-doc"><h${level}>Title <span data-t="badge" class="VPBadge tip${small ? ' small' : ''}">beta</span></h${level}></div>`,
      vpkit: `<div class="vp-doc"><h${level}>Title <span data-t="badge" class="vp-badge vp-badge-tip${small ? ' vp-badge-small' : ''}">beta</span></h${level}></div>`,
      checks: [{ target: 'badge', props: [...BADGE_BOX, 'vertical-align', ...COLORS] }],
    });
  }
}
cases.push({
  name: 'badge in the doc footer',
  upstream: `<div class="VPDocFooter"><span data-t="badge" class="VPBadge tip">beta</span></div>`,
  vpkit: `<div class="vp-doc-footer"><span data-t="badge" class="vp-badge vp-badge-tip">beta</span></div>`,
  checks: [{ target: 'badge', props: ['display'] }],
});

// table: a VitePress markdown table (inside .vp-doc) against vp-table
const TABLE_ROWS =
  '<thead><tr data-t="head"><th data-t="th">Plan</th><th>Price</th></tr></thead>' +
  '<tbody><tr data-t="row1"><td data-t="td">Pro</td><td>$9</td></tr>' +
  '<tr data-t="row2"><td>Team</td><td>$29</td></tr></tbody>';
cases.push({
  name: 'table',
  upstream: `<div class="vp-doc"><table data-t="table">${TABLE_ROWS}</table></div>`,
  vpkit: `<table data-t="table" class="vp-table">${TABLE_ROWS}</table>`,
  checks: [
    {
      target: 'table',
      props: ['display', 'border-collapse', ...SIDES.map((s) => `margin-${s}`), 'overflow-x', 'height', 'width'],
    },
    { target: 'head', props: ['background-color', 'border-top-width', 'border-top-style', 'border-top-color', ...TRANSITION] },
    { target: 'row1', props: ['background-color', 'border-top-color'] },
    { target: 'row2', props: ['background-color'] },
    { target: 'th', props: [...BORDER, ...COLORS, ...PADDING, 'text-align', 'font-size', 'font-weight'] },
    { target: 'td', props: [...BORDER, ...COLORS, ...PADDING, 'text-align', 'font-size', 'font-weight'] },
  ],
});

// card: VPFeature as a link and as a plain box. VPFeature's padding and
// flex column live on an inner .box, vp-card's on the card itself
const card = (tag, cls, inner) =>
  `<${tag} data-t="card" class="${cls}"${tag === 'a' ? ' href="#"' : ''}>${inner}</${tag}>`;
const CARD_TEXT = (title, details) =>
  `<h2 data-t="title" class="${title}">Fast</h2><p data-t="details" class="${details}">Instant server start, always.</p>`;
for (const tag of ['a', 'div']) {
  const upstreamBox = `<article data-t="box" class="box">${CARD_TEXT('title', 'details')}</article>`;
  cases.push({
    name: `card <${tag}>`,
    upstream: card(tag, tag === 'a' ? 'VPFeature link' : 'VPFeature', upstreamBox),
    vpkit: card(tag, 'vp-card', CARD_TEXT('vp-card-title', 'vp-card-details')),
    checks: [
      { target: 'card', props: [...BORDER, ...RADIUS, ...COLORS, ...TRANSITION, 'height', 'width'] },
      { target: 'card', refTarget: 'box', props: ['display', 'flex-direction', ...PADDING] },
      { target: 'card', state: ['hover'], props: COLORS },
      { target: 'title', props: ['line-height', 'font-size', 'font-weight', 'color'] },
      { target: 'details', props: ['flex-grow', 'padding-top', 'line-height', 'font-size', 'font-weight', 'color'] },
    ],
  });
}

// input: no VitePress original; the reference is totality's recipe it
// ports, compiled into the same stylesheet
const INPUT_BOX = [
  'display',
  'height',
  ...BORDER,
  ...RADIUS,
  ...PADDING,
  'font-size',
  'line-height',
  ...COLORS,
  ...TRANSITION,
];
for (const invalid of [null, 'true', 'false']) {
  const attr = invalid ? ` aria-invalid="${invalid}"` : '';
  cases.push({
    name: `input${invalid ? ` aria-invalid=${invalid}` : ''}`,
    reference: `<input data-t="in" class="${TOTALITY_INPUT}" placeholder="Coupon code"${attr}>`,
    vpkit: `<input data-t="in" class="vp-input" placeholder="Coupon code"${attr}>`,
    checks: [
      { target: 'in', props: INPUT_BOX },
      { target: 'in', pseudo: '::placeholder', props: ['color'] },
      { target: 'in', state: ['hover'], props: COLORS },
      { target: 'in', state: ['focus'], props: [...COLORS, 'box-shadow'] },
    ],
  });
}

// vp-input on a <select> and a <textarea>. A select takes the class as it
// is, so it is compared with an input in the same stylesheet, except for
// the line height: Chromium computes `normal` on a select where the class
// sets 1.5 (measured; the height is fixed, so the box doesn't move). The
// textarea rule is vpkit's addition, tested as the button's are: against
// the recipe with the addition written inline. A one-row textarea is the
// input's height.
const TEXTAREA_ADDITION = 'height:auto;min-height:2.75rem;padding-block:0.5625rem';
for (const invalid of [null, 'true']) {
  const attr = invalid ? ` aria-invalid="${invalid}"` : '';
  const label = invalid ? ` aria-invalid=${invalid}` : '';
  cases.push({
    name: `input on a select${label}`,
    reference: `<input data-t="in" class="vp-input" value="7 days"${attr}>`,
    vpkit: `<select data-t="in" class="vp-input"${attr}><option>7 days</option><option>30 days</option></select>`,
    checks: [
      { target: 'in', props: INPUT_BOX.filter((p) => p !== 'line-height') },
      { target: 'in', state: ['hover'], props: COLORS },
      { target: 'in', state: ['focus'], props: [...COLORS, 'box-shadow'] },
    ],
  });
  cases.push({
    name: `input on a textarea${label}`,
    reference: `<textarea data-t="in" class="${TOTALITY_INPUT}" rows="3" placeholder="A note" style="${TEXTAREA_ADDITION}"${attr}></textarea>`,
    vpkit: `<textarea data-t="in" class="vp-input" rows="3" placeholder="A note"${attr}></textarea>`,
    checks: [
      { target: 'in', props: [...INPUT_BOX, 'min-height'] },
      { target: 'in', pseudo: '::placeholder', props: ['color'] },
      { target: 'in', state: ['hover'], props: COLORS },
      { target: 'in', state: ['focus'], props: [...COLORS, 'box-shadow'] },
    ],
  });
}
cases.push({
  name: 'input on a one-row textarea, against the input',
  reference: `<input data-t="in" class="vp-input" value="A note">`,
  vpkit: `<textarea data-t="in" class="vp-input" rows="1">A note</textarea>`,
  checks: [{ target: 'in', props: ['height', 'line-height', 'font-size'] }],
});

// alert: VitePress's custom blocks, each type with a title and the
// things inside whose look the block sets (links, code, paragraphs)
const ALERT_BOX = [...BORDER, ...RADIUS, ...PADDING, 'line-height', 'font-size', ...COLORS];
const LINK = [
  'color',
  'font-weight',
  'text-decoration-line',
  'text-underline-offset',
  ...TRANSITION,
  'opacity',
];
const CODE = ['font-size', 'color', 'background-color', ...RADIUS, ...PADDING, ...TRANSITION];
// VitePress renders a container inside .vp-doc, whose rules for links and
// code meet custom-block.css's: the alert is compared with that rendering
const inDoc = (html) => `<div class="vp-doc">${html}</div>`;
const alertBody = (title) =>
  `${title}<p>Body with <a data-t="a" href="#">a link</a> and <code data-t="code">code</code>.</p>` +
  `<p data-t="p2">Then <a data-t="a2" href="#"><code data-t="acode">linked code</code></a>.</p>`;
for (const type of ['info', 'note', 'tip', 'important', 'warning', 'danger', 'caution']) {
  const modifier = type === 'info' ? '' : ` vp-alert-${type}`;
  cases.push({
    name: `alert ${type}`,
    upstream: inDoc(`<div data-t="box" class="custom-block ${type}">${alertBody('<p data-t="title" class="custom-block-title">TIP</p>')}</div>`),
    vpkit: `<div data-t="box" class="vp-alert${modifier}">${alertBody('<p data-t="title" class="vp-alert-title">TIP</p>')}</div>`,
    checks: [
      { target: 'box', props: ALERT_BOX },
      { target: 'title', props: ['font-weight'] },
      { target: 'p2', props: ['margin-top', 'margin-bottom'] },
      { target: 'a', props: LINK },
      { target: 'a', state: ['hover'], props: ['color', 'opacity'] },
      { target: 'code', props: CODE },
      { target: 'acode', on: 'a2', state: ['hover'], props: ['color'] },
    ],
  });
}

// without a title the block keeps its 0.5rem top padding (the :has() rule)
cases.push({
  name: 'alert info, no title',
  upstream: inDoc(`<div data-t="box" class="custom-block info">${alertBody('')}</div>`),
  vpkit: `<div data-t="box" class="vp-alert">${alertBody('')}</div>`,
  checks: [{ target: 'box', props: PADDING }],
});

// an info alert nested in a tip alert keeps the info look
const nested = (outer, inner) =>
  `<div class="${outer}"><div data-t="inner" class="${inner}">` +
  `<p>Inner with <a data-t="a" href="#">a link</a> and <code data-t="code">code</code>.</p></div></div>`;
cases.push({
  name: 'alert info nested in tip',
  upstream: inDoc(nested('custom-block tip', 'custom-block info')),
  vpkit: nested('vp-alert vp-alert-tip', 'vp-alert'),
  checks: [
    { target: 'inner', props: COLORS },
    { target: 'a', props: ['color'] },
    { target: 'code', props: CODE },
  ],
});
cases.push({
  name: 'alert info nested in tip, against a standalone info alert',
  reference: `<div data-t="inner" class="vp-alert"><p>Inner with <a data-t="a" href="#">a link</a> and <code data-t="code">code</code>.</p></div>`,
  vpkit: nested('vp-alert vp-alert-tip', 'vp-alert'),
  checks: [
    { target: 'inner', props: COLORS },
    { target: 'a', props: ['color'] },
    { target: 'a', state: ['hover'], props: ['color'] },
    { target: 'code', props: CODE },
  ],
});

// a vp-btn inside an alert keeps its own look: the alert's rules for
// what is inside add no specificity (only its link hover opacity reaches
// the button, listed in `known`)
cases.push({
  name: 'button inside an alert',
  reference: `<a data-t="btn" class="vp-btn vp-btn-brand" href="#">Go</a>`,
  vpkit: `<div class="vp-alert vp-alert-tip"><p><a data-t="btn" class="vp-btn vp-btn-brand" href="#">Go</a></p></div>`,
  checks: [
    { target: 'btn', props: [...BUTTON_BOX, ...COLORS, ...TRANSITION, 'opacity'] },
    { target: 'btn', state: ['hover'], props: [...COLORS, 'opacity'] },
  ],
});

// touch screens: a tapped element keeps :hover there, so with :hover
// forced each component must look as it does at rest. vpkit's hover
// styles are `@variant hover`, which like Tailwind's `hover:` applies only
// where (hover: hover) matches (VitePress's apply on touch screens too)
const AT_REST = { state: ['hover'], refState: [] };
const touch = (name, markup, checks) =>
  cases.push({ name: `${name} on a touch screen`, touch: true, reference: markup, vpkit: markup, checks });
for (const [theme, themeClass] of Object.entries(THEMES)) {
  const cls = ['vp-btn', themeClass].filter(Boolean).join(' ');
  touch(`button ${theme}`, `<a data-t="btn" class="${cls}" href="#">Get Started</a>`, [
    { target: 'btn', ...AT_REST, props: COLORS },
  ]);
}
touch('input', `<input data-t="in" class="vp-input" placeholder="Coupon code">`, [
  { target: 'in', ...AT_REST, props: [...COLORS, 'box-shadow'] },
]);
touch('card <a>', card('a', 'vp-card', CARD_TEXT('vp-card-title', 'vp-card-details')), [
  { target: 'card', ...AT_REST, props: COLORS },
]);
touch('alert link', `<div class="vp-alert vp-alert-tip">${alertBody('')}</div>`, [
  { target: 'a', ...AT_REST, props: ['color', 'opacity'] },
  { target: 'acode', on: 'a2', ...AT_REST, props: ['color'] },
]);

// toggle: VPSwitch, the knob and the icon in it, against the original at
// rest and hovered; VPSwitchAppearance's knob and its two icons, which
// follow .dark on both sides; and vp-toggle's own state, aria-checked,
// against the transform written inline
const TOGGLE_BOX = ['display', 'position', 'width', 'height', ...BORDER, ...RADIUS, ...PADDING, 'flex-shrink'];
const KNOB = ['position', 'offset-top', 'offset-left', 'width', 'height', ...RADIUS, 'background-color', 'box-shadow', 'transform', ...TRANSITION];
const ICON_CLIP = ['position', 'display', 'width', 'height', ...RADIUS, 'overflow-x', 'overflow-y'];
const GLYPH = ['display', 'position', 'offset-top', 'offset-left', 'width', 'height', 'color', 'background-color', 'opacity', ...TRANSITION];
const SWITCH = ' type="button" role="switch" aria-checked="false"';
const toggle = (cls, check, icon, glyphs) =>
  `<button data-t="toggle" class="${cls}"${SWITCH}><span data-t="check" class="${check}">` +
  (icon ? `<span data-t="icon" class="${icon}">${glyphs}</span>` : '') +
  `</span></button>`;
cases.push({
  name: 'toggle',
  upstream: toggle('VPSwitch', 'check', null, ''),
  vpkit: toggle('vp-toggle', 'vp-toggle-check', null, ''),
  checks: [
    { target: 'toggle', props: [...TOGGLE_BOX, ...COLORS, ...TRANSITION] },
    { target: 'toggle', state: ['hover'], props: [...COLORS, ...TRANSITION] },
    { target: 'check', props: KNOB },
  ],
});
cases.push({
  name: 'toggle with an icon',
  upstream: toggle('VPSwitch', 'check', 'icon', '<span data-t="glyph" class="vpi-sun"></span>'),
  vpkit: toggle('vp-toggle', 'vp-toggle-check', 'vp-toggle-icon', '<span data-t="glyph" class="vpi-sun"></span>'),
  checks: [
    { target: 'check', props: KNOB },
    { target: 'icon', props: ICON_CLIP },
    { target: 'glyph', props: GLYPH },
  ],
});
cases.push({
  name: 'toggle appearance',
  upstream: toggle(
    'VPSwitch VPSwitchAppearance', 'check', 'icon',
    '<span data-t="sun" class="vpi-sun sun"></span><span data-t="moon" class="vpi-moon moon"></span>',
  ),
  vpkit: toggle(
    'vp-toggle vp-toggle-appearance', 'vp-toggle-check', 'vp-toggle-icon',
    '<span data-t="sun" class="vpi-sun"></span><span data-t="moon" class="vpi-moon"></span>',
  ),
  checks: [
    { target: 'toggle', props: [...TOGGLE_BOX, ...COLORS, ...TRANSITION] },
    { target: 'check', props: KNOB },
    { target: 'sun', props: GLYPH },
    { target: 'moon', props: GLYPH },
  ],
});
// the knob's position while on is vpkit's addition, tested as the button's
// are: against VPSwitch's knob with the transform inline
cases.push({
  name: 'toggle checked',
  upstream: `<button data-t="toggle" class="VPSwitch"${SWITCH}><span data-t="check" class="check" style="transform:translateX(1.125rem)"></span></button>`,
  vpkit: `<button data-t="toggle" class="vp-toggle" type="button" role="switch" aria-checked="true"><span data-t="check" class="vp-toggle-check"></span></button>`,
  checks: [{ target: 'check', props: KNOB }],
});
touch('toggle', toggle('vp-toggle', 'vp-toggle-check', null, ''), [
  { target: 'toggle', ...AT_REST, props: COLORS },
]);

// link: VitePress's markdown link (.vp-doc a) against vp-link, as a link
// and as a button drawn as one, with code inside: its colors at rest and
// while the link is hovered
for (const tag of ['a', 'button']) {
  const attrs = tag === 'a' ? ' href="#"' : ' type="button"';
  cases.push({
    name: `link <${tag}>`,
    upstream: `<div class="vp-doc"><p><a data-t="a" href="#">Orders with <code data-t="code">code</code></a></p></div>`,
    vpkit: `<p><${tag} data-t="a" class="vp-link"${attrs}>Orders with <code data-t="code">code</code></${tag}></p>`,
    checks: [
      { target: 'a', props: [...LINK, 'font-size'] },
      { target: 'a', state: ['hover'], props: ['color'] },
      { target: 'code', props: ['color'] },
      { target: 'code', on: 'a', state: ['hover'], props: ['color'] },
    ],
  });
}
touch('link', `<a data-t="a" class="vp-link" href="#">Orders <code data-t="code">code</code></a>`, [
  { target: 'a', ...AT_REST, props: ['color'] },
  { target: 'code', on: 'a', ...AT_REST, props: ['color'] },
]);

// code: VitePress's inline code (.vp-doc :not(pre) > code) against
// vp-code, alone and inside a vp-link, where it takes the link's colors
const CODE_LOOK = ['font-family', 'font-size', 'color', 'background-color', ...RADIUS, ...PADDING, ...TRANSITION];
cases.push({
  name: 'code',
  upstream: `<div class="vp-doc"><p>Order <code data-t="code">ORD-2026-0142</code></p></div>`,
  vpkit: `<p>Order <code data-t="code" class="vp-code">ORD-2026-0142</code></p>`,
  checks: [{ target: 'code', props: CODE_LOOK }],
});
cases.push({
  name: 'code in a link',
  upstream: `<div class="vp-doc"><p><a data-t="a" href="#">See <code data-t="code">vp-code</code></a></p></div>`,
  vpkit: `<p><a data-t="a" class="vp-link" href="#">See <code data-t="code" class="vp-code">vp-code</code></a></p>`,
  checks: [
    { target: 'code', props: CODE_LOOK },
    { target: 'code', on: 'a', state: ['hover'], props: ['color'] },
  ],
});

// spinner: VPLocalSearchBox's loading ring (.search-loading.active), in a
// flex row as the search bar holds it. Its margin is placement and is left
// out; the keyframes' names differ, so the animation is compared by its
// duration, timing and count. The height is `block-size`, the style's:
// the harness's `height` is the bounding box, which the turning ring
// widens past 18px at most angles
const SPIN = [
  'width', 'block-size', 'box-sizing', ...BORDER, ...SIDES.map((s) => `border-${s}-color`), ...RADIUS,
  'visibility', 'flex-grow', 'flex-shrink', 'flex-basis',
  'animation-duration', 'animation-timing-function', 'animation-iteration-count',
];
cases.push({
  name: 'spinner',
  upstreamFiles: ['components/VPLocalSearchBox.vue'],
  upstream: `<div class="search-actions"><span data-t="spin" class="search-loading active"></span></div>`,
  vpkit: `<div style="display:flex"><span data-t="spin" class="vp-spinner"></span></div>`,
  checks: [{ target: 'spin', props: SPIN }],
});

// dialog: own-drive's modal recipe on a <dialog>, both opened with
// showModal() by a script in the markup. vpkit's additions are written
// inline on the reference: `margin: auto`, which Tailwind's preflight
// takes from every element (the browser centers a modal dialog with it),
// and the ::backdrop color, the scrim the recipe draws as an element
const dialogBody = (title, actions) =>
  `<h2 data-t="title" class="${title}">Rename</h2><p>A new name for <code>notes.txt</code>.</p>` +
  `<div data-t="actions" class="${actions}"><button class="vp-btn" type="button">Cancel</button>` +
  `<button class="vp-btn vp-btn-brand" type="button">Rename</button></div>`;
const OPEN = `<script>document.querySelector('[data-t="dlg"]').showModal()</script>`;
cases.push({
  name: 'dialog',
  reference:
    `<dialog data-t="dlg" class="${OWN_DRIVE_MODAL}" style="margin:auto">${dialogBody(OWN_DRIVE_MODAL_H3, OWN_DRIVE_BTN_ROW)}</dialog>` +
    `<style>[data-t="dlg"]::backdrop{background-color:var(--vp-backdrop-bg-color)}</style>${OPEN}`,
  vpkit: `<dialog data-t="dlg" class="vp-dialog">${dialogBody('vp-dialog-title', 'vp-dialog-actions')}</dialog>${OPEN}`,
  checks: [
    {
      target: 'dlg',
      props: [
        'position', ...SIDES.map((s) => `margin-${s}`), ...BORDER, ...RADIUS, ...PADDING, ...COLORS,
        'width', 'max-width', 'box-shadow', 'height', 'offset-top', 'offset-left',
      ],
    },
    { target: 'dlg', pseudo: '::backdrop', props: ['background-color', 'position'] },
    { target: 'title', props: ['margin-top', 'margin-bottom', 'font-size', 'font-weight', 'line-height'] },
    { target: 'actions', props: ['display', 'justify-content', 'column-gap', 'margin-top'] },
  ],
});

// dropdown: VPMenu with VPMenuLink items and VPMenuGroup groups, as
// VitePress renders them (ul/li), against vp-dropdown's flat markup: items
// and groups straight in the panel. A <button> item stands where upstream
// has a link, and aria-checked marks the current item where VPMenuLink has
// .active. Each wrapper is inline-block, as the flyout's absolute box
// sizes the menu to its content. The originals' styles are loaded for
// these cases alone: they name .link and .title
const MENU_FILES = ['components/VPMenu.vue', 'components/VPMenuLink.vue', 'components/VPMenuGroup.vue'];
const menuLink = (text, extra = '', t = '') =>
  `<li class="VPMenuLink"><a${t ? ` data-t="${t}"` : ''} class="VPLink link${extra}" href="#"><span>${text}</span></a></li>`;
const menuGroup = (t, title, links) =>
  `<li data-t="${t}" class="VPMenuGroup">${title ? `<p data-t="${t}-title" class="title">${title}</p>` : ''}<ul>${links}</ul></li>`;
const ddItem = (text, t = '', attrs = ' href="#"', tag = 'a') =>
  `<${tag}${t ? ` data-t="${t}"` : ''} class="vp-dropdown-item"${attrs}>${text}</${tag}>`;
const ddGroup = (t, title, items) =>
  `<div data-t="${t}" class="vp-dropdown-group" role="group">${title ? `<p data-t="${t}-title" class="vp-dropdown-title">${title}</p>` : ''}${items}</div>`;
// The heights of a panel and of a group sum their 32px rows, and the
// minified build makes each row 1/64px short (2.2857143 printed as 2.28571),
// so each height check allows 1/64px per row it holds; a wrong margin or
// padding is a pixel or more
const PANEL = [...BORDER, ...RADIUS, ...PADDING, ...COLORS, 'box-shadow', 'min-width', 'max-height', 'overflow-y', ...TRANSITION, 'width'];
const rows = (target, n) => ({ target, props: ['height'], tolerance: n / 64 });
const ITEM = ['display', ...PADDING, ...RADIUS, 'line-height', 'font-size', 'font-weight', 'color', 'background-color', 'text-align', 'white-space', ...TRANSITION, 'width', 'height'];
const GROUP = [...SIDES.map((s) => `margin-${s}`), 'border-top-width', 'border-top-style', 'border-top-color', ...PADDING];
const MENU_TITLE = [...PADDING, 'line-height', 'font-size', 'font-weight', 'color', 'white-space', ...TRANSITION];
cases.push({
  name: 'dropdown',
  upstreamFiles: MENU_FILES,
  upstream:
    `<div style="display:inline-block"><div data-t="menu" class="VPMenu"><ul class="items">` +
    menuLink('Profile', '', 'item') + menuLink('Settings', ' active', 'current') +
    menuGroup('group', 'Sort by', menuLink('Name', '', 'gitem') + menuLink('Date')) +
    menuGroup('group2', 'View', menuLink('As a list')) +
    `</ul></div></div>`,
  vpkit:
    `<div style="display:inline-block"><div data-t="menu" class="vp-dropdown" role="menu">` +
    ddItem('Profile', 'item') + ddItem('Settings', 'current', ' type="button" role="menuitemradio" aria-checked="true"', 'button') +
    ddGroup('group', 'Sort by', ddItem('Name', 'gitem') + ddItem('Date')) +
    ddGroup('group2', 'View', ddItem('As a list')) +
    `</div></div>`,
  checks: [
    { target: 'menu', props: PANEL },
    rows('menu', 7),
    { target: 'item', props: ITEM },
    { target: 'item', state: ['hover'], props: ['color', 'background-color'] },
    { target: 'current', props: ITEM },
    { target: 'gitem', props: ITEM },
    { target: 'group', props: GROUP },
    rows('group', 3),
    { target: 'group-title', props: MENU_TITLE },
    { target: 'group2', props: GROUP },
    rows('group2', 2),
  ],
});
// groups only: the first group has no rule above it, a group without a title
cases.push({
  name: 'dropdown of groups',
  upstreamFiles: MENU_FILES,
  upstream:
    `<div style="display:inline-block"><div data-t="menu" class="VPMenu"><ul class="items">` +
    menuGroup('group', 'Sort by', menuLink('Name') + menuLink('Date')) + menuGroup('group2', '', menuLink('Sign out')) +
    `</ul></div></div>`,
  vpkit:
    `<div style="display:inline-block"><div data-t="menu" class="vp-dropdown" role="menu">` +
    ddGroup('group', 'Sort by', ddItem('Name') + ddItem('Date')) + ddGroup('group2', '', ddItem('Sign out')) +
    `</div></div>`,
  checks: [
    { target: 'menu', props: PANEL },
    rows('menu', 4),
    { target: 'group', props: GROUP },
    rows('group', 3),
    { target: 'group2', props: GROUP },
    rows('group2', 1),
  ],
});
// aria-current="false" is not current
cases.push({
  name: 'dropdown item aria-current=false',
  reference: `<div class="vp-dropdown">${ddItem('Settings', 'item')}</div>`,
  vpkit: `<div class="vp-dropdown">${ddItem('Settings', 'item', ' href="#" aria-current="false"')}</div>`,
  checks: [{ target: 'item', props: ['color'] }],
});
touch('dropdown item', `<div class="vp-dropdown">${ddItem('Profile', 'item')}</div>`, [
  { target: 'item', ...AT_REST, props: ['color', 'background-color'] },
]);

// icon button: VPSocialLink against vp-icon-btn. vpkit's addition, the
// hover ground (a 0.5rem radius, the soft gray, its transition), is written
// into the upstream page as a stylesheet, as the button's additions are
// written inline. With a vpi-* icon, and with an inline SVG: VitePress
// wraps it in a span, vp-icon-btn takes it as the direct child
const ICON_BTN_ADDITION =
  '<style>.VPSocialLink{border-radius:0.5rem;transition:color .5s,background-color .25s}' +
  '.VPSocialLink:hover{background-color:var(--vp-c-default-soft);transition:color .25s,background-color .25s}</style>';
const ICON_BTN_BOX = ['display', 'justify-content', 'align-items', 'width', 'height', ...RADIUS, ...PADDING, 'color', 'background-color', ...TRANSITION];
const ICON_BOX = ['display', 'width', 'height', 'offset-top', 'offset-left'];
const SVG = '<svg data-t="svg" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg>';
cases.push({
  name: 'icon button',
  upstreamFiles: ['components/VPSocialLink.vue'],
  upstream: `${ICON_BTN_ADDITION}<a data-t="btn" class="VPSocialLink no-icon" href="#" aria-label="Like"><span data-t="icon" class="vpi-heart"></span></a>`,
  vpkit: `<a data-t="btn" class="vp-icon-btn" href="#" aria-label="Like"><span data-t="icon" class="vpi-heart"></span></a>`,
  checks: [
    { target: 'btn', props: ICON_BTN_BOX },
    { target: 'btn', state: ['hover'], props: ['color', 'background-color', ...TRANSITION] },
    { target: 'icon', props: ICON_BOX },
  ],
});
cases.push({
  name: 'icon button with an svg',
  upstreamFiles: ['components/VPSocialLink.vue'],
  upstream: `${ICON_BTN_ADDITION}<a data-t="btn" class="VPSocialLink no-icon" href="#" aria-label="Close"><span data-t="icon">${SVG}</span></a>`,
  vpkit: `<button data-t="btn" class="vp-icon-btn" type="button" aria-label="Close">${SVG.replace('data-t="svg"', 'data-t="icon"')}</button>`,
  checks: [
    { target: 'btn', props: ICON_BTN_BOX },
    { target: 'icon', props: ICON_BOX },
    { target: 'icon', refTarget: 'svg', props: ['fill'] },
  ],
});
// vpkit's one difference: an SVG that sets its own fill keeps it (a stroke
// icon's fill="none"), where VitePress's `svg { fill: currentColor }` would
// fill it solid
cases.push({
  name: 'icon button with a stroke svg',
  reference: `<svg data-t="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16v16H4z"/></svg>`,
  vpkit: `<button class="vp-icon-btn" type="button" aria-label="Close"><svg data-t="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16v16H4z"/></svg></button>`,
  checks: [{ target: 'icon', props: ['fill'] }],
});
touch('icon button', `<a data-t="btn" class="vp-icon-btn" href="#" aria-label="Like"><span class="vpi-heart"></span></a>`, [
  { target: 'btn', ...AT_REST, props: ['color', 'background-color'] },
]);

// alert details: VitePress's details block (.custom-block.details on a
// <details>, inside .vp-doc as its docs render it) against vp-alert-details,
// open and closed
const detailsBody =
  `<summary data-t="title">Details</summary>` +
  `<p data-t="p1">Body with <a data-t="a" href="#">a link</a> and <code data-t="code">code</code>.</p>` +
  `<p data-t="p2">Then <a data-t="a2" href="#"><code data-t="acode">linked code</code></a>.</p>`;
const SUMMARY = ['display', ...SIDES.map((s) => `margin-${s}`), 'font-weight', 'cursor', 'user-select'];
cases.push({
  name: 'alert details',
  upstream: inDoc(`<details data-t="box" class="custom-block details" open>${detailsBody}</details>`),
  vpkit: `<details data-t="box" class="vp-alert vp-alert-details" open>${detailsBody}</details>`,
  checks: [
    { target: 'box', props: [...ALERT_BOX, 'height'] },
    { target: 'title', props: SUMMARY },
    { target: 'p1', props: ['margin-top', 'margin-bottom'] },
    { target: 'p2', props: ['margin-top', 'margin-bottom'] },
    { target: 'a', props: LINK },
    { target: 'a', state: ['hover'], props: ['color', 'opacity'] },
    { target: 'code', props: CODE },
    { target: 'acode', on: 'a2', state: ['hover'], props: ['color'] },
  ],
});
cases.push({
  name: 'alert details, closed',
  upstream: inDoc(`<details data-t="box" class="custom-block details">${detailsBody}</details>`),
  vpkit: `<details data-t="box" class="vp-alert vp-alert-details">${detailsBody}</details>`,
  checks: [{ target: 'box', props: [...PADDING, 'height'] }],
});

// tabs: a code group's tab bar (vp-code-group.css: .tabs, its radio inputs
// and labels) against vp-tabs, buttons with role="tab" where the selected
// one is aria-selected. The cases run at 1280px, where the original's bar
// has its rounded top corners and no bleed, as vp-tabs always does
const TAB_FILES = ['vp-code-group.css'];
const TAB_BAR = ['position', 'display', ...PADDING, 'margin-left', 'margin-right', ...RADIUS, 'background-color', 'overflow-x', 'overflow-y', 'box-shadow', 'height', 'width'];
const TAB = ['position', 'display', 'border-bottom-width', 'border-bottom-style', 'border-bottom-color', ...PADDING, 'line-height', 'font-size', 'font-weight', 'color', 'white-space', 'cursor', ...TRANSITION, 'height', 'width', 'offset-left'];
const TAB_BAR_AFTER = ['position', 'right', 'bottom', 'left', 'z-index', 'height', ...RADIUS, 'background-color', 'content', ...TRANSITION];
cases.push({
  name: 'tabs',
  upstreamFiles: TAB_FILES,
  upstream:
    `<div class="vp-code-group"><div data-t="tabs" class="tabs">` +
    `<input type="radio" name="group-1" id="tab-1" checked><label data-t="sel" for="tab-1">npm</label>` +
    `<input type="radio" name="group-1" id="tab-2"><label data-t="tab" for="tab-2">pnpm</label></div></div>`,
  vpkit:
    `<div data-t="tabs" class="vp-tabs" role="tablist">` +
    `<button data-t="sel" class="vp-tabs-tab" type="button" role="tab" aria-selected="true">npm</button>` +
    `<button data-t="tab" class="vp-tabs-tab" type="button" role="tab" aria-selected="false">pnpm</button></div>`,
  checks: [
    { target: 'tabs', props: TAB_BAR },
    { target: 'tab', props: TAB },
    { target: 'tab', state: ['hover'], props: ['color'] },
    { target: 'tab', pseudo: '::after', props: TAB_BAR_AFTER },
    { target: 'sel', props: TAB },
    { target: 'sel', pseudo: '::after', props: TAB_BAR_AFTER },
  ],
});
touch('tab', `<div class="vp-tabs" role="tablist"><button data-t="tab" class="vp-tabs-tab" type="button" role="tab" aria-selected="false">pnpm</button></div>`, [
  { target: 'tab', ...AT_REST, props: ['color'] },
]);

// kbd: the search box's shortcut keys (.search-keyboard-shortcuts kbd)
// against vp-kbd in a line of text. The original is a flex item, so its
// display is a block's, and its size is its container's: the key's own
// look is compared
cases.push({
  name: 'kbd',
  upstreamFiles: ['components/VPLocalSearchBox.vue'],
  upstream: `<div class="search-keyboard-shortcuts"><span><kbd data-t="kbd">Esc</kbd> to close</span></div>`,
  vpkit: `<p><kbd data-t="kbd" class="vp-kbd">Esc</kbd> to close</p>`,
  checks: [
    {
      target: 'kbd',
      props: [...BORDER, ...SIDES.map((s) => `border-${s}-color`), ...RADIUS, ...PADDING, 'min-width', 'text-align', 'vertical-align', 'background-color', 'box-shadow'],
    },
  ],
});

// mark: the search box's highlighted hit (.titles mark) against vp-mark
cases.push({
  name: 'mark',
  upstreamFiles: ['components/VPLocalSearchBox.vue'],
  upstream: `<div class="titles"><span><mark data-t="mark">Badge</mark> component</span></div>`,
  vpkit: `<p><mark data-t="mark" class="vp-mark">Badge</mark> component</p>`,
  checks: [{ target: 'mark', props: ['color', 'background-color', ...RADIUS, ...PADDING] }],
});

// danger button: own-drive's grounded danger button against vp-btn
// vp-btn-danger: danger text on the danger tint, the same hovered and
// pressed. Its box is vp-btn's, so only the parts the two share are
// compared with it (own-drive's gap and line height are its own)
cases.push({
  name: 'button danger',
  reference: `<button data-t="btn" class="${OWN_DRIVE_BTN_DANGER}" type="button">Delete forever</button>`,
  vpkit: `<button data-t="btn" class="vp-btn vp-btn-danger" type="button">Delete forever</button>`,
  checks: [
    { target: 'btn', props: [...COLORS, ...RADIUS, 'padding-left', 'padding-right', 'height', 'font-size', 'font-weight'] },
    { target: 'btn', state: ['hover'], props: COLORS },
    { target: 'btn', state: ['hover', 'active'], props: COLORS },
  ],
});

// choice: totality's selectable card around a radio against vp-choice, at
// rest, hovered, checked, and with the radio focused from the keyboard.
// The transition is not compared: the recipe's is Tailwind's
// transition-colors list and easing, vp-choice's the two colors that
// change, in VitePress's 0.25s
const CHOICE_BOX = ['display', 'align-items', 'column-gap', ...BORDER, ...RADIUS, ...PADDING, ...COLORS, 'font-size', 'line-height', 'cursor', 'height'];
const OUTLINE = ['outline-width', 'outline-style', 'outline-color', 'outline-offset'];
const choice = (cls, checked) =>
  `<label data-t="choice" class="${cls}"><input data-t="radio" type="radio" name="plan"${checked ? ' checked' : ''}>` +
  `<span>Monthly<br>NT$300 a month, cancel any time</span></label>`;
for (const checked of [false, true]) {
  cases.push({
    name: `choice${checked ? ' checked' : ''}`,
    reference: choice(TOTALITY_CHOICE, checked),
    vpkit: choice('vp-choice', checked),
    checks: [
      { target: 'choice', props: [...CHOICE_BOX, ...OUTLINE] },
      { target: 'choice', state: ['hover'], props: COLORS },
      { target: 'choice', on: 'radio', state: ['focus-visible'], props: OUTLINE },
      { target: 'radio', props: ['margin-top', 'width', 'height', 'flex-shrink', 'accent-color'] },
    ],
  });
}
touch('choice', choice('vp-choice', false), [{ target: 'choice', ...AT_REST, props: COLORS }]);

// field: totality's label and inline error around a vp-input against
// vp-label and vp-field-error
const field = (label, error) =>
  `<label data-t="label" class="${label}" for="code">Coupon code</label>` +
  `<input id="code" class="vp-input" aria-invalid="true" aria-describedby="code-error">` +
  `<p data-t="error" class="${error}" id="code-error">This code has expired.</p>`;
const FIELD_TEXT = ['display', 'margin-top', 'margin-bottom', 'font-size', 'line-height', 'font-weight', 'color', 'height'];
cases.push({
  name: 'field',
  reference: field(TOTALITY_FIELD_LABEL, TOTALITY_MSG_ERROR),
  vpkit: field('vp-label', 'vp-field-error'),
  checks: [
    { target: 'label', props: FIELD_TEXT },
    { target: 'error', props: FIELD_TEXT },
  ],
});

// toast: own-drive's status message against vp-toast, the surface only:
// the recipe's placement (fixed at the bottom center, its width cap) and
// its hiding while empty are the page's
cases.push({
  name: 'toast',
  reference: `<div data-t="toast" class="${OWN_DRIVE_MSG}" role="status">Saved notes.txt</div>`,
  vpkit: `<div data-t="toast" class="vp-toast" role="status">Saved notes.txt</div>`,
  checks: [{ target: 'toast', props: [...BORDER, ...RADIUS, ...PADDING, ...COLORS, 'box-shadow'] }],
});

// progress: own-drive's bar against vp-progress, the track 7rem wide and
// the fill at 40%, as its quota bar sets them inline
const bar = (track, fill) =>
  `<span data-t="track" class="${track}" style="width:7rem" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">` +
  `<span data-t="fill" class="${fill}" style="width:40%"></span></span>`;
cases.push({
  name: 'progress',
  reference: bar(OWN_DRIVE_BAR, OWN_DRIVE_BAR_FILL),
  vpkit: bar('vp-progress', 'vp-progress-bar'),
  checks: [
    { target: 'track', props: ['display', 'width', 'height', ...RADIUS, 'background-color', 'overflow-x', 'overflow-y'] },
    { target: 'fill', props: ['display', 'width', 'height', 'background-color'] },
  ],
});
// without a width of its own, the fill is empty
cases.push({
  name: 'progress, no width set',
  reference: `<span class="${OWN_DRIVE_BAR}" style="width:7rem"><span data-t="fill" class="${OWN_DRIVE_BAR_FILL}"></span></span>`,
  vpkit: `<span class="vp-progress" style="width:7rem"><span data-t="fill" class="vp-progress-bar"></span></span>`,
  checks: [{ target: 'fill', props: ['width'] }],
});

// the current item by aria-current: a value marks it, and the values WAI-ARIA
// 1.2 treats as false ("false", "", and a template's stringified undefined)
// leave it plain
cases.push({
  name: 'dropdown item aria-current=page',
  reference: `<div class="vp-dropdown">${ddItem('Settings', 'item', ' type="button" role="menuitemradio" aria-checked="true"', 'button')}</div>`,
  vpkit: `<div class="vp-dropdown">${ddItem('Settings', 'item', ' href="#" aria-current="page"')}</div>`,
  checks: [{ target: 'item', props: ['color'] }],
});
for (const value of ['', 'undefined']) {
  cases.push({
    name: `dropdown item aria-current="${value}"`,
    reference: `<div class="vp-dropdown">${ddItem('Settings', 'item')}</div>`,
    vpkit: `<div class="vp-dropdown">${ddItem('Settings', 'item', ` href="#" aria-current="${value}"`)}</div>`,
    checks: [{ target: 'item', props: ['color'] }],
  });
}

// link components inside an alert keep their own look at rest: the alert's
// rule for links underlines and recolors any <a> that doesn't set those
// itself (only its hover dimming still reaches them, as it reaches vp-btn).
// Block wrappers: a card's heading inside a <p> would be parsed out of it
const LOOK = ['color', 'text-decoration-line', 'font-weight'];
for (const [name, markup, checks] of [
  ['dropdown item', `<div class="vp-dropdown">${ddItem('Profile', 'x')}</div>`, [{ target: 'x', props: LOOK }]],
  ['tab', `<div class="vp-tabs"><a data-t="x" class="vp-tabs-tab" href="#" role="tab" aria-selected="false">npm</a></div>`, [{ target: 'x', props: LOOK }]],
  ['card', card('a', 'vp-card', CARD_TEXT('vp-card-title', 'vp-card-details')), [
    { target: 'card', props: ['color', 'text-decoration-line'] },
    { target: 'title', props: ['color', 'font-weight', 'text-decoration-line'] },
    { target: 'details', props: ['color', 'font-weight'] },
  ]],
]) {
  cases.push({
    name: `${name} inside an alert`,
    reference: `<div>${markup}</div>`,
    vpkit: `<div class="vp-alert vp-alert-tip">${markup}</div>`,
    checks,
  });
}

// a progress bar alone in a flex row is as wide as the row, as it is in
// block flow (an empty flex item is otherwise 0px wide)
cases.push({
  name: 'progress in a flex row',
  reference: `<div style="width:300px"><span data-t="track" class="vp-progress"><span data-t="fill" class="vp-progress-bar" style="width:40%"></span></span></div>`,
  vpkit: `<div style="width:300px;display:flex"><span data-t="track" class="vp-progress"><span data-t="fill" class="vp-progress-bar" style="width:40%"></span></span></div>`,
  checks: [{ target: 'track', props: ['width'] }, { target: 'fill', props: ['width'] }],
});

// a panel with other padding, set through --vp-dropdown-padding: its
// groups still reach both edges (the reference writes that out inline)
cases.push({
  name: 'dropdown with 0.5rem of padding',
  reference:
    `<div style="display:inline-block"><div data-t="menu" class="vp-dropdown" style="padding:0.5rem">${ddItem('Profile')}` +
    `<div data-t="group" class="vp-dropdown-group" style="margin:0.75rem -0.5rem 0;padding:0.75rem 0.5rem 0">${ddItem('Name')}</div></div></div>`,
  vpkit:
    `<div style="display:inline-block"><div data-t="menu" class="vp-dropdown" style="--vp-dropdown-padding:0.5rem">${ddItem('Profile')}` +
    `<div data-t="group" class="vp-dropdown-group">${ddItem('Name')}</div></div></div>`,
  checks: [
    { target: 'menu', props: [...PADDING, 'width'] },
    { target: 'group', props: [...SIDES.map((s) => `margin-${s}`), ...PADDING, 'offset-left'] },
  ],
});

// the backdrop still dims the page where --vp-backdrop-bg-color doesn't
// reach ::backdrop (before Chrome 122 and Safari 17.4 it inherits from
// nothing): here the variable is unset, and the fallback paints
// tokens.css's value
cases.push({
  name: 'dialog backdrop without the variable',
  reference: `<dialog data-t="dlg" class="vp-dialog"></dialog><style>[data-t="dlg"]::backdrop{background-color:rgba(0, 0, 0, 0.6)}</style>${OPEN}`,
  vpkit: `<style>:root{--vp-backdrop-bg-color:initial}</style><dialog data-t="dlg" class="vp-dialog"></dialog>${OPEN}`,
  checks: [{ target: 'dlg', pseudo: '::backdrop', props: ['background-color'] }],
});

// a spinner in a button turns in the label's color, a 30% ring of it with
// the full color turning: the label's color is what each button holds
// against its ground (the reference writes that out inline)
const SPIN_IN_BUTTON = 'border-color:color-mix(in srgb, currentColor 30%, transparent);border-top-color:currentColor';
for (const [theme, cls] of [['brand', 'vp-btn vp-btn-brand'], ['alt', 'vp-btn'], ['danger', 'vp-btn vp-btn-danger']]) {
  cases.push({
    name: `spinner in a ${theme} button`,
    reference: `<button class="${cls}" disabled><span data-t="spin" class="vp-spinner" style="${SPIN_IN_BUTTON}"></span>Paying</button>`,
    vpkit: `<button class="${cls}" disabled><span data-t="spin" class="vp-spinner"></span>Paying</button>`,
    checks: [{ target: 'spin', props: SIDES.map((s) => `border-${s}-color`) }],
  });
}
