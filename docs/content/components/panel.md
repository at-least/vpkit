+++
title = "Panel"
description = "A box of content on the page, a form, a list of rows, a table, in an outlined surface; vpkit's own."
+++

# Panel

A box of content on the page: a form, a list of rows, a table. VitePress has none for an app (a [Card](@/components/card.md) is a tile of a grid); this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/panel.css";
```

{% <vp_example title="A panel"> %}
<section class="vp-panel">
  <h2 class="font-semibold">Retention</h2>
  <p>Events older than 90 days are deleted every night.</p>
</section>
{% </vp_example> %}

- `vp-panel`: the page's ground in a divider border, a 0.75rem radius, 1rem of padding, as tall as its content. It clips what overflows its rounded corners without becoming a scroll container, so a sticky header inside sticks to the page unless something between them scrolls, as a [Table](@/components/table.md) does on its own. In a grid track or a flex row it shrinks to fit, clipping a line that doesn't wrap.
- `vp-panel-flush`: no padding, for content that carries its own, such as a list of [Rows](@/components/row.md). A table goes in a padded panel, as `vp-table my-0`, since its cells draw their own outer borders.
- A layout utility on it wins: `vp-panel flex flex-wrap items-end gap-3` is a form row. Its width and its place are yours.

{% <vp_example title="Flush, around rows"> %}
<section class="vp-panel vp-panel-flush">
  <div class="vp-row">api · healthy</div>
  <div class="vp-row">worker · healthy</div>
  <div class="vp-row">nightly backup · missed</div>
</section>
{% </vp_example> %}

{% <vp_example title="A form row"> %}
<form class="vp-panel flex flex-wrap items-end gap-3">
  <div class="vp-field">
    <label class="vp-label" for="name">Name</label>
    <input class="vp-input" id="name">
  </div>
  <button class="vp-btn" type="button">Save</button>
</form>
{% </vp_example> %}

Not included: a panel as a link. A [Card](@/components/card.md) that is a link takes the brand border on hover.
