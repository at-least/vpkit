+++
title = "Top Bar"
description = "VitePress's VPNavBar and VPNavBarTitle as classes: the bar, the centered row in it, and the site's name."
+++

# Top Bar

VitePress's `VPNavBar` (the bar and the row in it) and `VPNavBarTitle` (the site's name), for an app's header.

```css
@import "vpkit/topbar.css";
```

{% <vp_example title="A bar with the site's name, its links and the appearance switch" min_height="5rem"> %}
<header class="vp-topbar">
  <div class="vp-topbar-row">
    <a class="vp-topbar-title" href="#"><span>Site</span></a>
    <nav class="flex items-center" aria-label="Main">
      <a class="vp-nav-link" href="#" aria-current="page">Guide</a>
      <a class="vp-nav-link" href="#">Reference</a>
      <button class="vp-toggle vp-toggle-appearance ml-4" type="button" role="switch" aria-checked="false" aria-label="Appearance">
        <span class="vp-toggle-check"><span class="vp-toggle-icon"><span class="vpi-sun" aria-hidden="true"></span><span class="vpi-moon" aria-hidden="true"></span></span></span>
      </button>
    </nav>
  </div>
</header>
{% </vp_example> %}

- `vp-topbar`: the bar, on `--vp-nav-bg-color` with a 1px rule along its bottom, 1.5rem of padding at the left and 0.5rem at the right (2rem each from 768px), nothing wrapping.
- `vp-topbar-row`: the row in it, as tall as the navbar, its ends apart and its items centered, at most `--vp-layout-max-width` less 4rem wide. A bar may hold more than one row.
- `vp-topbar-title`: the site's name, a flex row the navbar's height at weight 600; a `<span>` in it truncates with an ellipsis when the bar runs out of room.

Where the bar sits is the page's: `sticky top-0 z-(--vp-z-index-nav)`, or fixed. What fills the row is the page's too: [Nav Link](@/components/nav-link.md) for its links, [Icon Button](@/components/icon-btn.md) and [Toggle](@/components/toggle.md) for its controls.

Differences from VitePress: the ground is the bar's own (VPNavBar paints it on a `::before`), the rule is a border (VPNavBar draws it with an element), the row centers its items, and the title has no width. Not included: the home page's transparent state, the sidebar column's offset, the local nav.
