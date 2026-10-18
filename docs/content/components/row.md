+++
title = "Row"
description = "One dense row of a list inside a panel, ruled off from the next by a hairline; vpkit's own."
+++

# Row <span class="vp-badge" data-variant="tip">vpkit</span> {#row}

One dense row of a list inside a panel, ruled off from the next by a hairline. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/components/row/row.css";
```

{{ <vp_example file="row/board" title="Services on a board" /> }}

- `vp-row`: 0.75rem by 1rem of padding and a divider line under it. The last row of its list draws none: the panel's border closes the list.
- Put the rows in a [Panel](@/components/panel.md) with `vp-panel-flush`, which has no padding of its own.
- What a row holds, and its layout, are yours: above, a wrapping flex row of a badge, a name and a line of secondary text.

## Title and description

`vp-row-title` is a row's name and `vp-row-desc` the line under it: each a block that breaks a long word, such as an address, rather than overflow. A name that must stay on one line takes `truncate`.

{{ <vp_example file="row/titles" title="Logins" /> }}

## A row that is a link

A row on an `<a>` is a block in the text's own color and weight, with no underline, on a soft ground while hovered.

{{ <vp_example file="row/links" title="Top issues" /> }}

Inside a `vp-doc` ([Markdown](@/guide/getting-started.md#markdown)), a row that is a list item and a part that is a paragraph keep no margin of the markdown's.

## Muted

A row with `data-state="muted"` is dimmed: something on the list that is switched off for now, such as a muted monitor.

{{ <vp_example file="row/muted" title="A muted row" /> }}
