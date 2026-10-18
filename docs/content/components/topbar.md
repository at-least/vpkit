+++
title = "Top Bar"
description = "VitePress's VPNavBar and VPNavBarTitle as classes: the bar, the centered row in it, and the site's name."
+++

# Top Bar

VitePress's `VPNavBar` (the bar and the row in it) and `VPNavBarTitle` (the site's name), for an app's header.

```css
@import "vpkit/components/topbar/topbar.css";
```

{{ <vp_example file="topbar/bar" title="A bar with the site's name, its links and the appearance switch" min_height="5rem" /> }}

- `vp-topbar`: the bar, on the page's color with a rule along its bottom and VitePress's padding at each end, nothing wrapping.
- `vp-topbar-row`: the row in it, as tall as the navbar, its ends apart and its items centered, at most `--vp-layout-max-width` less 4rem wide. A bar may hold more than one row.
- `vp-topbar-title`: the site's name, a bold flex row the navbar's height; a `<span>` in it truncates with an ellipsis when the bar runs out of room.

Where the bar sits is the page's: `sticky top-0 z-10`, or fixed. What fills the row is the page's too: [Nav Link](@/components/nav-link.md) for its links, [Icon Button](@/components/icon-btn.md) and [Toggle](@/components/toggle.md) for its controls.

Differences from VitePress: the ground is the bar's own (VPNavBar paints it on a `::before`), the rule is a border (VPNavBar draws it with an element), the row centers its items, the title has no width, and the bar has no backdrop filter (a frosted bar is a translucent ground and a blur utility on the element). Not included: the home page's transparent state, the sidebar column's offset, the local nav.
