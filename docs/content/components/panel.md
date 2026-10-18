+++
title = "Panel"
description = "A box of content on the page, a form, a list of rows, a table, in an outlined surface; vpkit's own."
+++

# Panel <span class="vp-badge" data-variant="tip">vpkit</span> {#panel}

A box of content on the page: a form, a list of rows, a table. VitePress has none for an app (a [Card](@/components/card.md) is a tile of a grid); this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/components/panel/panel.css";
```

{{ <vp_example file="panel/basic" title="A panel" /> }}

- `vp-panel`: the page's ground in a divider border, a 0.75rem radius, 1rem of padding, as tall as its content. It clips what overflows its rounded corners, contains a float inside, and in a grid track or a flex row shrinks to fit, clipping a line that doesn't wrap. A sticky header inside sticks to the panel, not to the page.
- `vp-panel-flush`: no padding, for content that carries its own, such as a list of [Rows](@/components/row.md). A table goes in a padded panel, as `vp-table my-0`, since its cells draw their own outer borders.
- A layout utility on it wins: `vp-panel flex flex-wrap items-end gap-3` is a form row. Its width and its place are yours.

{{ <vp_example file="panel/flush" title="Flush, around rows" /> }}

{{ <vp_example file="panel/form" title="A form row" /> }}

Not included: a panel as a link. A [Card](@/components/card.md) that is a link takes the brand border on hover.

## Header

`vp-panel-header` is a flush panel's head row: its title and an action at either end, on one baseline, over a divider line, in small secondary text that a quiet [Link](@/components/link.md) (`data-variant="quiet"`) takes. Its title is a `vp-group-title` ([Heading](@/components/heading.md)); the content under it carries its own padding, or is rows.

{{ <vp_example file="panel/header" title="A panel with a header" /> }}
