// vp-table against VitePress's markdown table (test/upstream/vp-doc.css,
// `.vp-doc table`): the block, its margins and scrolling, the rows' bands
// and lines, the cells' borders, padding and type. vpkit's own, golden:
// the scroll box with its focus ring inset, and a hidden label inside it
// kept in it; the stuck header, at the top and under a bar; the hovered,
// selected and cursor's rows; the row actions at rest, with the row
// hovered or focused, on the cursor's row and on a selected one; the sort
// control as a link and as a button, and the current sort; the stacked
// table at a phone's width; the examples.
// vpkit against vpkit: a touch screen's hovers at rest and its actions
// always shown, the button sort against the link, the stacked table wide
// against the table without the class.

import { BORDER, COLORS, MARGIN, OUTLINE, PADDING, TRANSITION, examples, inDoc } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const ROWS =
  '<thead><tr><th>Plan</th><th>Price</th></tr></thead>' +
  '<tbody><tr><td>Pro</td><td>$9</td></tr><tr><td>Team</td><td>$29</td></tr></tbody>';
const ROW1 = 'tbody tr:first-child';
const ROW2 = 'tbody tr:last-child';
const LINE = ['border-top-width', 'border-top-style', 'border-top-color'];

// VitePress's markdown table against vp-table: the block, the rows, the cells
const CELL = [...BORDER, ...COLORS, ...PADDING, 'text-align', 'font-size', 'font-weight', 'height'];
cases.push({
  name: 'table',
  upstream: { files: ['vp-doc.css'], html: inDoc(`<table>${ROWS}</table>`) },
  html: `<table class="vp-table">${ROWS}</table>`,
  checks: [
    { target: '.vp-table', refTarget: 'table', props: ['display', 'border-collapse', ...MARGIN, 'overflow-x', 'height', 'width'] },
    { target: 'thead tr', props: ['background-color', ...LINE, ...TRANSITION] },
    { target: ROW1, props: ['background-color', 'border-top-color'] },
    { target: ROW2, props: ['background-color'] },
    { target: 'th', props: CELL },
    { target: 'td', props: CELL },
  ],
});

// in a scroll box, fitting and wider than the box: the box, its focus ring
// inset, the table a plain table filling it
const WIDE =
  '<thead><tr><th>Name</th><th>Modified</th></tr></thead>' +
  '<tbody><tr><td style="white-space:nowrap">a-very-long-file-name-that-will-not-fit-the-box.tar.gz</td><td>2026-10-18 09:12</td></tr></tbody>';
for (const [name, rows] of [['table in a scroll box', ROWS], ['table wider than its scroll box', WIDE]]) {
  cases.push({
    name,
    html: `<div class="vp-table-scroll" tabindex="0" role="region" aria-label="Plans" style="width:16rem"><table class="vp-table">${rows}</table></div>`,
    checks: [
      { target: '.vp-table-scroll', props: ['overflow-x', 'overflow-y', 'width', 'height'] },
      { target: '.vp-table-scroll', state: ['focus-visible'], props: OUTLINE },
      { target: '.vp-table', props: ['display', ...MARGIN, 'width', 'height'] },
      { target: 'td', props: [...PADDING, 'width', 'height'] },
    ],
  });
}

// a box placed absolutely inside the scrolling table (a header cell's
// visually hidden label, Tailwind's sr-only) stays in the box: the box is
// its containing block, so it scrolls and clips with the table instead of
// widening the page (on a 20rem screen, a 16rem box, the label past 30rem)
cases.push({
  name: 'table wider than its scroll box, a hidden label at its end',
  width: 320,
  html:
    '<div class="vp-table-scroll" tabindex="0" role="region" aria-label="Files" style="width:16rem"><table class="vp-table">' +
    WIDE.replace('<th>Modified</th>', '<th>Modified</th><th><span class="sr-only">Actions</span></th>').replace('</td></tr>', '</td><td>Open</td></tr>') +
    '</table></div>',
  checks: [
    { target: '.vp-table-scroll', props: ['position', 'overflow-x', 'width'] },
    { target: 'html', props: ['scroll-width'] },
  ],
});

// the stuck header, at the top and under a bar: a plain table with
// separate borders, each cell its bottom and right, the first column its
// left, the header its top, the header cells sticky above the rows
const STICKY = [
  { target: '.vp-table', props: ['display', 'border-collapse', 'border-spacing', 'overflow-x', 'width', 'height'] },
  { target: ROW2, props: ['background-color'] },
  { target: 'th:first-child', props: [...BORDER, 'border-top-color', 'position', 'top', 'z-index', 'background-color'] },
  { target: 'th:last-child', props: [...BORDER, 'position', 'top', 'z-index'] },
  { target: 'td:first-child', props: [...BORDER, 'offset-top', 'offset-left'] },
  { target: 'td:last-child', props: [...BORDER, 'offset-top', 'offset-left'] },
];
for (const [name, style] of [['table sticky', ''], ['table sticky under a bar', ' style="--vp-table-sticky-top:4rem"']]) {
  cases.push({ name, html: `<table class="vp-table vp-table-sticky my-0 w-full"${style}>${ROWS}</table>`, checks: STICKY });
}

// rows: hovered (with vp-table-hover), selected (a checked checkbox in the
// first cell, over the band and the hover) and the cursor's (aria-current
// with a value; "false" is none)
const rows = (row1 = '', row2 = '', checked1 = false, checked2 = false) =>
  '<thead><tr><th></th><th>Name</th></tr></thead>' +
  `<tbody><tr${row1}><td><input type="checkbox" aria-label="Select notes.txt"${checked1 ? ' checked' : ''}></td><td>notes.txt</td></tr>` +
  `<tr${row2}><td><input type="checkbox" aria-label="Select photos"${checked2 ? ' checked' : ''}></td><td>photos</td></tr></tbody>`;
const hoverRows = `<table class="vp-table vp-table-hover">${rows()}</table>`;
cases.push({
  name: 'table rows hover',
  html: hoverRows,
  checks: [
    { target: ROW1, props: ['background-color', ...TRANSITION] },
    { target: ROW1, state: ['hover'], props: ['background-color'] },
    { target: ROW2, props: ['background-color'] },
    { target: ROW2, state: ['hover'], props: ['background-color'] },
  ],
});
cases.push({
  name: 'table rows hover on a touch screen',
  touch: true,
  html: hoverRows,
  reference: hoverRows,
  checks: [
    { target: ROW1, state: ['hover'], refState: [], props: ['background-color'] },
    { target: ROW2, state: ['hover'], refState: [], props: ['background-color'] },
  ],
});
cases.push({
  name: 'table rows selected',
  html: `<table class="vp-table vp-table-hover">${rows('', '', true, true)}</table>`,
  checks: [
    { target: ROW1, props: ['background-color'] },
    { target: ROW1, state: ['hover'], props: ['background-color'] },
    { target: ROW2, props: ['background-color'] },
  ],
});
cases.push({
  name: 'table rows current',
  html: `<table class="vp-table">${rows(' aria-current="true"', ' aria-current="false"')}</table>`,
  checks: [
    { target: `${ROW1} > td:first-child`, props: ['box-shadow'] },
    { target: `${ROW2} > td:first-child`, props: ['box-shadow'] },
  ],
});

// row actions: hidden on a device that can hover until the row is hovered
// or holds focus, or is the cursor's or selected; always shown on a touch
// screen, where the cell is as one without the class
const actionRow = (attrs = '', checked = false) =>
  `<table class="vp-table"><tbody><tr${attrs}>` +
  `<td><input type="checkbox" aria-label="Select notes.txt"${checked ? ' checked' : ''}></td><td>notes.txt</td>` +
  '<td class="vp-table-actions"><button class="vp-btn" data-size="sm" type="button">Rename</button></td></tr></tbody></table>';
cases.push({
  name: 'table row actions',
  html: actionRow(),
  checks: [
    { target: '.vp-table-actions', props: ['opacity'] },
    { target: '.vp-table-actions', on: 'tr', state: ['hover'], props: ['opacity'] },
    { target: '.vp-table-actions', on: 'tr', state: ['focus-within'], props: ['opacity'] },
  ],
});
for (const [name, attrs, checked] of [["table row actions on the cursor's row", ' aria-current="true"', false], ['table row actions on a selected row', '', true]]) {
  cases.push({ name, html: actionRow(attrs, checked), checks: [{ target: '.vp-table-actions', props: ['opacity'] }] });
}
cases.push({
  name: 'table row actions on a touch screen',
  touch: true,
  html: actionRow(),
  reference: actionRow().replace(' class="vp-table-actions"', ''),
  checks: [
    { target: 'td:last-child', props: ['opacity'] },
    { target: 'td:last-child', on: 'tr', state: ['hover'], refState: [], props: ['opacity'] },
  ],
});

// the sort control, a link or a button, at rest, hovered and current
// (aria-sort on the th; "none" is not current)
const SORT = ['color', 'text-decoration-line', 'text-decoration-style', 'text-decoration-color', 'text-underline-offset', 'font-weight', 'font-size', 'cursor', 'appearance', ...TRANSITION, ...PADDING, ...BORDER, 'background-color'];
const sortHead = (inner, sort = '') => `<table class="vp-table"><thead><tr><th${sort}>${inner}</th></tr></thead><tbody><tr><td>x</td></tr></tbody></table>`;
const sortControl = (tag) => `<${tag} class="vp-table-sort"${tag === 'a' ? ' href="#"' : ' type="button"'}>Last seen</${tag}>`;
const SORT_CHECKS = [{ target: '.vp-table-sort', props: SORT }, { target: '.vp-table-sort', state: ['hover'], props: ['color', 'text-decoration-color'] }];
for (const tag of ['a', 'button']) {
  cases.push({ name: `table sort <${tag}>`, html: sortHead(sortControl(tag)), checks: SORT_CHECKS });
  cases.push({ name: `table sort <${tag}> current`, html: sortHead(sortControl(tag), ' aria-sort="descending"'), checks: SORT_CHECKS });
}
cases.push({ name: 'table sort aria-sort="none"', html: sortHead(sortControl('a'), ' aria-sort="none"'), checks: SORT_CHECKS });
cases.push({
  name: 'table sort <button> against <a>',
  html: sortHead(sortControl('button')),
  reference: sortHead(sortControl('a')),
  checks: [{ target: '.vp-table-sort', props: SORT }],
});
cases.push({
  name: 'table sort on a touch screen',
  touch: true,
  html: sortHead(sortControl('a')),
  reference: sortHead(sortControl('a')),
  checks: [{ target: '.vp-table-sort', state: ['hover'], refState: [], props: ['color', 'text-decoration-color'] }],
});

// stacked at a phone's width: each row a block of its cells, each cell its
// label (drawn before it from data-label; none for an empty one) and its
// value on one line, the header hidden; wide, it stays a table
const stack = (cls) =>
  `<table class="vp-table${cls}"><thead><tr><th>Project</th><th>Email</th></tr></thead>` +
  '<tbody><tr><td data-label="Project">shop</td><td data-label="Email">on</td></tr>' +
  '<tr><td data-label="Project">bot-server</td><td data-label="">off</td></tr></tbody></table>';
const STACK_TD = ['display', 'align-items', 'justify-content', 'column-gap', ...PADDING, ...BORDER, 'height', 'offset-top'];
const LABEL = ['content', 'font-size', 'font-weight', 'color', 'flex-grow', 'flex-shrink'];
cases.push({
  name: "table stacked at a phone's width",
  width: 375,
  html: stack(' vp-table-stack'),
  checks: [
    { target: '.vp-table', props: ['display', 'width', 'height'] },
    { target: 'thead', props: ['display'] },
    { target: ROW1, props: ['display', ...PADDING, ...LINE, 'height'] },
    { target: ROW2, props: ['display', ...PADDING, ...LINE, 'height', 'offset-top', 'background-color'] },
    { target: `${ROW1} > td:first-child`, props: STACK_TD },
    { target: `${ROW1} > td:last-child`, props: STACK_TD },
    { target: `${ROW2} > td:last-child`, props: STACK_TD },
    { target: `${ROW1} > td:first-child`, pseudo: '::before', props: LABEL },
    { target: `${ROW2} > td:last-child`, pseudo: '::before', props: ['content'] },
  ],
});
cases.push({
  name: 'table stacked wide',
  html: stack(' vp-table-stack'),
  reference: stack(''),
  checks: [
    { target: '.vp-table', props: ['display', 'width', 'height'] },
    { target: 'thead', props: ['display'] },
    { target: `${ROW1} > td:first-child`, props: STACK_TD },
    { target: `${ROW1} > td:first-child`, pseudo: '::before', props: ['content'] },
  ],
});

// the examples
cases.push({
  name: 'table plans',
  html: ex('plans'),
  checks: [
    { target: '.vp-table', props: ['width', 'height', ...MARGIN] },
    { target: 'tbody tr:nth-child(2)', props: ['background-color'] },
  ],
});
cases.push({ name: 'table without the margin', html: ex('margin'), checks: [{ target: '.vp-table', props: MARGIN }] });
cases.push({
  name: 'table scroll example',
  width: 375,
  html: ex('scroll'),
  checks: [
    { target: '.vp-table-scroll', props: ['overflow-x', 'width'] },
    { target: '.vp-table', props: ['display', 'width'] },
  ],
});
cases.push({
  name: 'table rows example',
  html: ex('rows'),
  checks: [
    { target: ROW1, props: ['background-color', 'height'] },
    { target: 'tbody tr:nth-child(2) > td:first-child', props: ['box-shadow'] },
    { target: 'tbody tr:nth-child(2)', state: ['hover'], props: ['background-color'] },
    { target: ROW2, props: ['background-color'] },
  ],
});
cases.push({
  name: 'table sort example',
  html: ex('sort'),
  checks: [
    { target: 'th[aria-sort] > .vp-table-sort', props: ['color', 'text-decoration-style'] },
    { target: 'th:not([aria-sort]) > .vp-table-sort', props: ['color', 'text-decoration-style'] },
    { target: '.vp-table-actions', props: ['opacity'] },
    { target: '.vp-btn', props: ['height'] },
  ],
});
cases.push({
  name: 'table stack example',
  width: 375,
  html: ex('stack'),
  checks: [
    { target: `${ROW1} > td:first-child`, props: ['display'] },
    { target: `${ROW1} > td:first-child`, pseudo: '::before', props: ['content'] },
  ],
});
