+++
title = "Table"
description = "VitePress's markdown tables as a class: banded rows, scrolling sideways on its own."
+++

# Table

VitePress's markdown tables.

```css
@import "vpkit/table.css";
```

{% <vp_example title="A table"> %}
<table class="vp-table">
  <thead><tr><th>Plan</th><th>Price</th><th>Storage</th></tr></thead>
  <tbody>
    <tr><td>Free</td><td>$0</td><td>5 GB</td></tr>
    <tr><td>Pro</td><td>$9</td><td>100 GB</td></tr>
    <tr><td>Team</td><td>$29</td><td>1 TB</td></tr>
  </tbody>
</table>
{% </vp_example> %}

The table scrolls sideways on its own rather than squeezing its columns, and every second row is banded. It keeps VitePress's 1.25rem vertical margin; `my-0` removes it.

{% <vp_example title="Without the margin"> %}
<table class="vp-table my-0">
  <thead><tr><th>Plan</th><th>Price</th></tr></thead>
  <tbody><tr><td>Pro</td><td>$9</td></tr></tbody>
</table>
{% </vp_example> %}

## In a scroll box

`vp-table-scroll` is a box the table scrolls sideways in, the table inside it a plain table filling the box. A box that scrolls should take focus, so the arrow keys scroll it: `tabindex="0"`, `role="region"` and a label. Its focus indicator is drawn inside it.

{% <vp_example title="A table wider than its box"> %}
<div class="vp-table-scroll" tabindex="0" role="region" aria-label="Files">
  <table class="vp-table">
    <thead><tr><th>Name</th><th>Size</th><th>Modified</th></tr></thead>
    <tbody>
      <tr><td>a-very-long-file-name-for-the-quarterly-report.tar.gz</td><td>4.2 MB</td><td>2026-10-18 09:12</td></tr>
      <tr><td>photos</td><td>—</td><td>2026-10-17 21:40</td></tr>
    </tbody>
  </table>
</div>
{% </vp_example> %}

## A sticky header

`vp-table-sticky`, with `vp-table`, keeps the header row in view while the rows scroll under it. The table is a plain table then, not a box that scrolls; under a bar, set the offset: `style="--vp-table-sticky-top: 4rem"`. The header sticks to the nearest box that scrolls, so inside a `vp-table-scroll`, which scrolls only sideways, leave the box visible where the table fits (`lg:overflow-visible`) for a header that sticks to the page.

## Rows

- `vp-table-hover`, with `vp-table`: a body row takes a soft ground while hovered, for rows that open something. The cursor is yours (`cursor-pointer`).
- A body row whose first cell holds a checked checkbox is selected, on the brand's soft ground.
- A body row with `aria-current` is the one the keyboard's cursor is on: a brand edge on its first cell.

{% <vp_example title="Hover, a selected row and the cursor's row"> %}
<table class="vp-table vp-table-hover my-0">
  <thead><tr><th></th><th>Name</th></tr></thead>
  <tbody>
    <tr><td><input type="checkbox" aria-label="Select notes.txt" checked></td><td>notes.txt</td></tr>
    <tr aria-current="true"><td><input type="checkbox" aria-label="Select photos"></td><td>photos</td></tr>
    <tr><td><input type="checkbox" aria-label="Select report.pdf"></td><td>report.pdf</td></tr>
  </tbody>
</table>
{% </vp_example> %}

## Sorting and row actions

- `vp-table-sort`: a link or a button in a header cell that sorts by its column, with a dotted underline. The current sort, which `aria-sort` on the `<th>` names, is solid.
- `vp-table-actions`: the cell of a row's actions, hidden on a device that can hover until the pointer or the keyboard reaches the row, or the row is selected or the cursor's. On a touch screen they always show.

{% <vp_example title="A sortable column and row actions"> %}
<table class="vp-table my-0">
  <thead><tr><th aria-sort="ascending"><button class="vp-table-sort" type="button">Name ▴</button></th><th><button class="vp-table-sort" type="button">Size</button></th><th></th></tr></thead>
  <tbody>
    <tr><td>notes.txt</td><td>12 KB</td><td class="vp-table-actions"><button class="vp-btn" type="button">Rename</button></td></tr>
    <tr><td>photos</td><td>—</td><td class="vp-table-actions"><button class="vp-btn" type="button">Rename</button></td></tr>
  </tbody>
</table>
{% </vp_example> %}

## Stacked on a phone

`vp-table-stack`, with `vp-table`: under 40rem each row is a block of its cells, each cell its label (its `data-label`) and its value on one line, the header row hidden. For a small matrix that would otherwise scroll.

{% <vp_example title="Stacked under 40rem"> %}
<table class="vp-table vp-table-stack my-0">
  <thead><tr><th>Project</th><th>Email</th><th>Slack</th></tr></thead>
  <tbody>
    <tr><td data-label="Project">shop</td><td data-label="Email">on</td><td data-label="Slack">off</td></tr>
    <tr><td data-label="Project">bot-server</td><td data-label="Email">off</td><td data-label="Slack">on</td></tr>
  </tbody>
</table>
{% </vp_example> %}
