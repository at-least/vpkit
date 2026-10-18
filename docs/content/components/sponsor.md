+++
title = "Sponsors"
description = "A box of sponsors' logos in tiers, each tier a heading over a grid of logo tiles: VitePress's sponsors as a class."
+++

# Sponsors

A box of sponsors' logos in tiers, each tier a heading over a grid of logo tiles. VitePress's sponsors (`VPSponsors` and its grid) as classes.

```css
@import "vpkit/sponsor.css";
```

{% <vp_example title="Two tiers"> %}
<div class="vp-sponsor">
  <section class="vp-sponsor-section">
    <h3 class="vp-sponsor-tier">Platinum</h3>
    <ul class="vp-sponsor-grid vp-sponsor-grid-big" data-vp-grid="2">
      <li class="vp-sponsor-grid-item"><a class="vp-sponsor-grid-link" href="#" rel="sponsored noopener"><article class="vp-sponsor-grid-box"><img class="vp-sponsor-grid-image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='60' viewBox='0 0 240 60'%3E%3Crect width='240' height='60' rx='12' fill='%235672cd'/%3E%3C/svg%3E" alt="Example One"></article></a></li>
      <li class="vp-sponsor-grid-item"><a class="vp-sponsor-grid-link" href="#" rel="sponsored noopener"><article class="vp-sponsor-grid-box"><img class="vp-sponsor-grid-image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='60' viewBox='0 0 240 60'%3E%3Crect width='240' height='60' rx='30' fill='%2318794e'/%3E%3C/svg%3E" alt="Example Two"></article></a></li>
    </ul>
  </section>
  <section class="vp-sponsor-section">
    <h3 class="vp-sponsor-tier">Gold</h3>
    <ul class="vp-sponsor-grid" data-vp-grid="3">
      <li class="vp-sponsor-grid-item"><a class="vp-sponsor-grid-link" href="#" rel="sponsored noopener"><article class="vp-sponsor-grid-box"><img class="vp-sponsor-grid-image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='60' viewBox='0 0 240 60'%3E%3Crect width='240' height='60' rx='12' fill='%23b8860b'/%3E%3C/svg%3E" alt="Example Three"></article></a></li>
      <li class="vp-sponsor-grid-item"><a class="vp-sponsor-grid-link" href="#" rel="sponsored noopener"><article class="vp-sponsor-grid-box"><img class="vp-sponsor-grid-image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='60' viewBox='0 0 240 60'%3E%3Crect width='240' height='60' rx='30' fill='%23c2410c'/%3E%3C/svg%3E" alt="Example Four"></article></a></li>
      <li class="vp-sponsor-grid-item"></li>
    </ul>
  </section>
</div>
{% </vp_example> %}

- `vp-sponsor`: the box, rounded. `vp-sponsor-section`: a tier and its grid; `vp-sponsor-tier`: the tier's heading, a band on the soft ground.
- `vp-sponsor-grid`: on the `<ul>`, a wrapping row of tiles; `data-vp-grid`, from `2` to `6`, sets how many share a row (each tile is a full row without it). VitePress's script counts them for the window's width; here the page writes it.
- `vp-sponsor-grid-item`, `vp-sponsor-grid-link`, `vp-sponsor-grid-box`, `vp-sponsor-grid-image`: a tile, its link, the box that centers the logo, and the logo, gray until its tile is hovered (inverted in dark mode).
- An item with nothing in it, not even a space, is an empty tile that fills out the last row and keeps its ground while hovered.
- The grid's sizes: `vp-sponsor-grid-xmini`, `-mini`, `-small` and `-big` (medium without one), the tiles' heights and the logos' largest size. `vp-sponsor-aside`: the box as a sidebar shows it, with smaller tiers.
