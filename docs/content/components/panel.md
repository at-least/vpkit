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
  <p class="vp-label">Retention</p>
  <p>Events older than 90 days are deleted every night.</p>
</section>
{% </vp_example> %}

- `vp-panel`: the page's ground in a divider border, a 0.75rem radius, 1rem of padding, as tall as its content. It clips what overflows its rounded corners without becoming a scroll container, so a sticky table header inside still sticks to the page.
- `vp-panel-flush`: no padding, for a [Table](@/components/table.md) or a list of [Rows](@/components/row.md), whose cells and rows carry their own.
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
