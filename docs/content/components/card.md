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

- `vp-card`: the soft surface, padded, a flex column filling its container's height. As a link (`<a class="vp-card">`) its border turns brand on hover.
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

## Outline

`vp-card-outline`, vpkit's addition: the card on the page's color in a divider border, where `vp-card` is the soft fill. A link card still takes the brand border on hover. A box of content, a form, rows or a table, is a [Panel](@/components/panel.md).

{% <vp_example title="An outlined card, and one as a link"> %}
<div class="grid gap-4 sm:grid-cols-2">
  <div class="vp-card vp-card-outline">
    <h2 class="vp-card-title">Storage</h2>
    <p class="vp-card-details">2.1 GB of 5 GB used.</p>
  </div>
  <a class="vp-card vp-card-outline" href="#">
    <h2 class="vp-card-title">Unhandled errors</h2>
    <p class="vp-card-details">14 in the last 7 days.</p>
  </a>
</div>
{% </vp_example> %}

Not included: the feature icon.
