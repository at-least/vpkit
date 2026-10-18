+++
title = "Pager"
description = "Under a list, a line saying what it shows and the buttons to the pages either side; vpkit's own."
+++

# Pager <span class="vp-badge" data-variant="tip">vpkit</span> {#pager}

Under a list, a line saying what it shows and the buttons to the pages either side of it. VitePress has none for an app (its previous and next links belong to the docs layout); this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/components/pager/pager.css";
```

{{ <vp_example file="pager/basic" title="The second page of a list" /> }}

- `vp-pager`: the summary at one end and the buttons at the other, centered on each other; its distance from the list is the page's (`pt-5`).
- `vp-pager-summary`: 14px secondary text.
- `vp-pager-actions`: a row of [Buttons](@/components/button.md) 0.5rem apart. Where there is no page that way, a disabled button keeps the row's shape.
- Without a summary the buttons keep the far end too, as a cursor's pager that counts nothing has them.

{{ <vp_example file="pager/first" title="The first page: nothing newer" /> }}

{{ <vp_example file="pager/bare" title="No summary" /> }}

Give each pager its own `aria-label`, so a page with two lists has two navigation landmarks a screen reader can tell apart.

In Rust: [`Pager`](../../rust/vpkit/struct.Pager.html), from vpkit's [crate](@/guide/rust.md).
