+++
title = "Empty State"
description = "An empty state, vpkit's own: the box a list shows when it has nothing to list, a title and a line under it."
+++

# Empty State

The box a list shows when it has nothing to list. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/empty.css";
```

{% <vp_example title="A list with nothing to list"> %}
<div class="vp-empty">
  <p class="vp-empty-title">No issues</p>
  <p class="vp-empty-desc">Nothing matched these filters in the last 7 days. Clear a filter, or widen the window.</p>
</div>
{% </vp_example> %}

- `vp-empty`: the box, the soft gray ground with rounded corners, its lines centered and in secondary text.
- `vp-empty-title`: the bold line.
- `vp-empty-desc`: the smaller line under it, at most 52 characters wide, so a long explanation wraps.

A title alone works, and so does a line of text with neither class.

{% <vp_example title="A line of text"> %}
<div class="vp-empty">this folder is empty — drop files or folders anywhere, or use the upload button</div>
{% </vp_example> %}

In Rust: [`Empty`](../../rust/vpkit/struct.Empty.html), from vpkit's [crate](@/guide/rust.md).
