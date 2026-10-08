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
    case: /^alert /,
    target: 'code',
    prop: 'font-size',
    reason:
      "--vp-custom-block-code-font-size is 0.875em, the size VitePress renders: inside .vp-doc, `.vp-doc :not(pre) > code` (0,1,2) beats `.custom-block code` (0,1,1), so upstream's declared 0.8125rem never shows in its docs",
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
const CODE = ['font-size', 'color', 'background-color'];
const alertBody = (title) =>
  `${title}<p>Body with <a data-t="a" href="#">a link</a> and <code data-t="code">code</code>.</p>` +
  `<p data-t="p2">Then <a data-t="a2" href="#"><code data-t="acode">linked code</code></a>.</p>`;
for (const type of ['info', 'note', 'tip', 'important', 'warning', 'danger', 'caution']) {
  const modifier = type === 'info' ? '' : ` vp-alert-${type}`;
  cases.push({
    name: `alert ${type}`,
    upstream: `<div data-t="box" class="custom-block ${type}">${alertBody('<p data-t="title" class="custom-block-title">TIP</p>')}</div>`,
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
  upstream: `<div data-t="box" class="custom-block info">${alertBody('')}</div>`,
  vpkit: `<div data-t="box" class="vp-alert">${alertBody('')}</div>`,
  checks: [{ target: 'box', props: PADDING }],
});

// an info alert nested in a tip alert keeps the info look
const nested = (outer, inner) =>
  `<div class="${outer}"><div data-t="inner" class="${inner}">` +
  `<p>Inner with <a data-t="a" href="#">a link</a> and <code data-t="code">code</code>.</p></div></div>`;
cases.push({
  name: 'alert info nested in tip',
  upstream: nested('custom-block tip', 'custom-block info'),
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
