+++
title = "Table"
description = "VitePress's markdown tables as a class: banded rows, scrolling sideways on its own."
+++

# Table

VitePress's markdown tables.

```css
@import "vpkit/components/table/table.css";
```

{{ <vp_example file="table/plans" title="A table" /> }}

The table scrolls sideways on its own rather than squeezing its columns, and every second row is banded. It keeps VitePress's 1.25rem vertical margin; `my-0` removes it.

{{ <vp_example file="table/margin" title="Without the margin" /> }}

## A record

One item's fields are the same table with no head: each row opens with a row header, `<th scope="row">`, and its value. VitePress styles every header cell alike, not only the head's, so the key column takes the header's look on every row. For a record's details with no table look, use [Description List](@/components/dl.md).

{{ <vp_example file="table/record" title="A record: a row header on every row" /> }}

## In a scroll box

`vp-table-scroll` is a box the table scrolls sideways in, the table inside it a plain table filling the box. What is placed absolutely inside it, such as a header's visually hidden label (`sr-only`), belongs to the box: it scrolls with the table instead of widening the page. A box that scrolls should take focus, so the arrow keys scroll it: `tabindex="0"`, `role="region"` and a label. Its focus ring, base.css's, is drawn inside it.

{{ <vp_example file="table/scroll" title="A table wider than its box" /> }}

## A sticky header

`vp-table-sticky`, with `vp-table`, keeps the header row in view while the rows scroll under it. The table is a plain table then, not a box that scrolls; under a bar, set the offset: `style="--vp-table-sticky-top: 4rem"`. The header sticks to the nearest box that scrolls, so inside a `vp-table-scroll`, which scrolls only sideways, leave the box visible where the table fits (`lg:overflow-visible`) for a header that sticks to the page.

## Rows

- `vp-table-hover`, with `vp-table`: a body row takes the gray wash while hovered, for rows that open something. The cursor is yours (`cursor-pointer`).
- A body row whose first cell holds a checked checkbox (a [Checkbox](@/components/checkbox.md), or a bare one) is selected, on the brand's tint.
- A body row with `aria-current` is the one the keyboard's cursor is on: a brand edge on its first cell. Under forced colors (Windows' contrast themes), which drop the shadow that draws the edge, the cell takes a 3px inset frame in the system's text color instead.

{{ <vp_example file="table/rows" title="Hover, a selected row and the cursor's row" /> }}

## Sorting and row actions

- `vp-table-sort`: a link or a button in a header cell that sorts by its column, with a dotted underline. The current sort, which `aria-sort` on the `<th>` names, is solid.
- `vp-table-actions`: the cell of a row's actions, hidden on a device that can hover until the pointer or the keyboard reaches the row, or the row is selected or the cursor's. On a touch screen they always show.

{{ <vp_example file="table/sort" title="A sortable column and row actions" /> }}

## Stacked on a phone

`vp-table-stack`, with `vp-table`: under 40rem each row is a block of its cells, each cell its label (its `data-label`) and its value on one line, the header row hidden. For a small matrix that would otherwise scroll.

{{ <vp_example file="table/stack" title="Stacked under 40rem" /> }}
