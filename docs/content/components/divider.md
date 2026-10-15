+++
title = "Divider"
description = "VitePress's rules as a class: the markdown's horizontal rule, and the navbar's vertical rule between two of its clusters."
+++

# Divider

The markdown's horizontal rule (`.vp-doc hr`), and the navbar's vertical rule between two of its clusters (`VPNavBar`), as a class.

```css
@import "vpkit/divider.css";
```

{% <vp_example title="A rule between two paragraphs"> %}
<p>Orders placed before noon ship the same day.</p>
<hr class="vp-divider">
<p>Returns are free for 30 days.</p>
{% </vp_example> %}

- `vp-divider`: a line of the divider color across its container, 1rem above and below (VitePress's own spacing; `my-0` removes it).
- `vp-divider-vertical`: the navbar's rule, upright with VitePress's space at each side, for a row of items. Say so with `aria-orientation="vertical"`.

{% <vp_example title="A vertical rule in a row"> %}
<div class="flex items-center text-sm">
  <a class="vp-link" href="#">Docs</a>
  <hr class="vp-divider vp-divider-vertical" aria-orientation="vertical">
  <a class="vp-link" href="#">Blog</a>
  <hr class="vp-divider vp-divider-vertical" aria-orientation="vertical">
  <a class="vp-link" href="#">Changelog</a>
</div>
{% </vp_example> %}

Under forced colors (Windows' contrast themes) the vertical rule, a background the browser would erase, takes the text color; the horizontal rule is a border, which those themes keep.
