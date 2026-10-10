+++
title = "Card"
description = "VitePress's VPFeature, the home page's feature boxes, as a class: a box, or a link whose border turns brand on hover."
+++

# Card

VitePress's `VPFeature`, the home page's feature boxes.

```css
@import "vpkit/card.css";
```

{% <vp_example title="A card that is a link"> %}
<a class="vp-card" href="#">
  <h2 class="vp-card-title">Fast</h2>
  <p class="vp-card-details">Instant server start.</p>
</a>
{% </vp_example> %}

- `vp-card`: the soft surface with 1.5rem padding, a flex column filling its container's height. As a link (`<a class="vp-card">`) its border turns brand on hover.
- `vp-card-title`, `vp-card-details`: the bold title and the secondary text under it, which takes the free height.

{% <vp_example title="Cards in a grid"> %}
<div class="grid gap-4 sm:grid-cols-3">
  <a class="vp-card" href="#">
    <h2 class="vp-card-title">Fast</h2>
    <p class="vp-card-details">Instant server start.</p>
  </a>
  <a class="vp-card" href="#">
    <h2 class="vp-card-title">Themed</h2>
    <p class="vp-card-details">Every color is a variable, light and dark, so a theme recolors the card with the rest of the page.</p>
  </a>
  <div class="vp-card">
    <h2 class="vp-card-title">A box</h2>
    <p class="vp-card-details">Not a link, so no hover.</p>
  </div>
</div>
{% </vp_example> %}

Not included: the feature icon.

Inside a `vp-doc` (the markdown's styles, `content.css`) a link card keeps its look, and its title and details their boxes: the markdown's rules for links, headings and paragraphs are outranked by the card's own.
