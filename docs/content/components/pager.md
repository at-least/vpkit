+++
title = "Pager"
description = "Under a list, a line saying what it shows and the buttons to the pages either side; vpkit's own."
+++

# Pager <span class="vp-badge vp-badge-tip">vpkit</span> {#pager}

Under a list, a line saying what it shows and the buttons to the pages either side of it. VitePress has none for an app (its previous and next links belong to the docs layout); this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/pager.css";
```

{% <vp_example title="The second page of a list"> %}
<nav class="vp-pager" aria-label="Pages">
  <p class="vp-pager-summary">51–100 of 230</p>
  <div class="vp-pager-actions">
    <a class="vp-btn" href="#">Newer</a>
    <a class="vp-btn" href="#">Older</a>
  </div>
</nav>
{% </vp_example> %}

- `vp-pager`: the summary at one end and the buttons at the other, centered on each other, with 1.25rem above, so it sits that far under the list.
- `vp-pager-summary`: 14px secondary text.
- `vp-pager-actions`: a row of [Buttons](@/components/button.md) 0.5rem apart. Where there is no page that way, a disabled button keeps the row's shape.
- vpkit's addition: the buttons keep the far end without a summary too, as a cursor's pager that counts nothing has them.

{% <vp_example title="The first page: nothing newer"> %}
<nav class="vp-pager" aria-label="Pages">
  <p class="vp-pager-summary">1–50 of 230</p>
  <div class="vp-pager-actions">
    <button class="vp-btn" type="button" disabled>Newer</button>
    <a class="vp-btn" href="#">Older</a>
  </div>
</nav>
{% </vp_example> %}

{% <vp_example title="No summary"> %}
<nav class="vp-pager" aria-label="Event pages">
  <div class="vp-pager-actions">
    <button class="vp-btn" type="button" disabled>Newest</button>
    <a class="vp-btn" href="#">Older</a>
  </div>
</nav>
{% </vp_example> %}

Give each pager its own `aria-label`, so a page with two lists has two navigation landmarks a screen reader can tell apart.

In Rust: [`Pager`](../../rust/vpkit/struct.Pager.html), from vpkit's [crate](@/guide/rust.md).
