+++
title = "Card"
description = "VitePress's VPFeature, the home page's feature boxes, as a class: a box, or a link whose border turns brand on hover, with an outline variant."
+++

# Card

VitePress's `VPFeature`, the home page's feature boxes.

```css
@import "vpkit/components/card/card.css";
```

{{ <vp_example file="card/link" title="A card that is a link" /> }}

- `vp-card`: the soft surface, padded, a flex column filling its container's height. As a link (`<a class="vp-card">`) its border turns brand on hover.
- `vp-card-title`, `vp-card-details`: the bold title and the secondary text under it, which takes the free height.

{{ <vp_example file="card/grid" title="Cards in a grid" /> }}

## Outline

`data-variant="outline"`, vpkit's: the card on the page's color in a divider border, where `vp-card` is the soft fill. A link card still takes the brand border on hover. A box of content, a form, rows or a table, is a [Panel](@/components/panel.md).

{{ <vp_example file="card/outline" title="An outlined card, and one as a link" /> }}

Not included: the feature icon.
