+++
title = "Sponsors"
description = "A box of sponsors' logos in tiers, each tier a heading over a grid of logo tiles: VitePress's sponsors as a class."
+++

# Sponsors

A box of sponsors' logos in tiers, each tier a heading over a grid of logo tiles. VitePress's sponsors (`VPSponsors` and its grid) as classes.

```css
@import "vpkit/docs-theme/components/sponsor/sponsor.css";
```

{{ <vp_example file="sponsor/tiers" title="Two tiers" kit="docs-theme" /> }}

- `vp-sponsor`: the box, rounded. `vp-sponsor-section`: a tier and its grid; `vp-sponsor-tier`: the tier's heading, a band on the soft ground.
- `vp-sponsor-grid`: on the `<ul>`, a wrapping row of tiles; `data-vp-grid`, from `2` to `6`, sets how many share a row (each tile is a full row without it). VitePress's script counts them for the window's width; here the page writes it.
- `vp-sponsor-grid-item`, `vp-sponsor-grid-link`, `vp-sponsor-grid-box`, `vp-sponsor-grid-image`: a tile, its link, the box that centers the logo, and the logo, gray until its tile is hovered (inverted in dark mode).
- An item with nothing in it, not even a space, is an empty tile that fills out the last row and keeps its ground while hovered.
- The grid's sizes, on the grid: `data-size="xmini"`, `"mini"`, `"small"` and `"big"` (medium without one), the tiles' heights and the logos' largest size. `data-variant="aside"` on the box: as a sidebar shows it, with smaller tiers and a smaller radius.
