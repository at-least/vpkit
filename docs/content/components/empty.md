+++
title = "Empty State"
description = "crashcart's empty state as a class: the box a list shows when it has nothing to list, a title and a line under it."
+++

# Empty State

The box a list shows when it has nothing to list. VitePress has none; this is crashcart's, on VitePress's tokens.

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

A title alone works, and so does a line of text with neither class, as own-drive's empty folder reads: "This folder is empty."

{% <vp_example title="A line of text"> %}
<div class="vp-empty">This folder is empty.</div>
{% </vp_example> %}

Inside a `vp-doc` (the markdown's styles, `content.css`) the lines keep their places: the markdown's rule for paragraphs, which would space them as the markdown's, is outranked by the box's own.
