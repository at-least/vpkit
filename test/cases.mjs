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
// the button, so opacity isn't compared on hover)
cases.push({
  name: 'button inside an alert',
  reference: `<a data-t="btn" class="vp-btn vp-btn-brand" href="#">Go</a>`,
  vpkit: `<div class="vp-alert vp-alert-tip"><p><a data-t="btn" class="vp-btn vp-btn-brand" href="#">Go</a></p></div>`,
  checks: [
    { target: 'btn', props: [...BUTTON_BOX, ...COLORS, ...TRANSITION] },
    { target: 'btn', state: ['hover'], props: COLORS },
  ],
});
