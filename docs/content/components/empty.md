+++
title = "Empty State"
description = "An empty state, vpkit's own: the box a list shows when it has nothing to list, a title and a line under it."
+++

# Empty State <span class="vp-badge" data-variant="tip">vpkit</span> {#empty-state}

The box a list shows when it has nothing to list. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/components/empty/empty.css";
```

{{ <vp_example file="empty/basic" title="A list with nothing to list" /> }}

- `vp-empty`: the box, the soft gray ground with rounded corners, its lines centered and in secondary text.
- `vp-empty-title`: the bold line.
- `vp-empty-desc`: the smaller line under it, at most 52 characters wide, so a long explanation wraps.

A title alone works, and so does a line of text with neither class.

{{ <vp_example file="empty/line" title="A line of text" /> }}

In Rust: [`Empty`](../../rust/vpkit/struct.Empty.html), from vpkit's [crate](@/guide/rust.md).
