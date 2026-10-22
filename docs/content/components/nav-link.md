+++
title = "Nav Link"
description = "VitePress's VPNavMenuLink as a class: a link of the navbar's menu, and the same link in the nav screen."
+++

# Nav Link

VitePress's `VPNavMenuLink`: a link of the navbar's menu, in the bar and in the nav screen (the menu a phone opens).

```css
@import "vpkit/components/nav-link/nav-link.css";
```

{{ <vp_example file="nav-link/bar" title="The bar's links, one current" layout="row" /> }}

- `vp-nav-link`: the bar's link, a flex row as tall as the navbar, brand on hover and while it is the current page's (`aria-current="page"`, where VitePress has `.active`). On a `<button>` it is the same row: a form's submit drawn as a link of the menu.
- `data-variant="screen"`: the screen's link, a block with a divider under it. A link fills the screen's width by itself; on a `<button>` (a form's Sign out) add `w-full text-start`, since a button's box hugs its label and centers it.

{{ <vp_example file="nav-link/screen" title="The screen's links" layout="stack" /> }}

The bar is [Top Bar](@/components/topbar.md) and the screen [Nav Screen](@/components/screen.md); opening it is the page's.

## A lane

`vp-nav-lane`, vpkit's own, is a row of nav links that scrolls sideways rather than wrap or clip, for a header's second row or a page's section links. Its scrollbar is hidden; a wheel or a swipe still scrolls it. Its links are 2.25rem tall, rounded so the focus ring has a shape, and stay on one line.

While the lane is wider than its box its edges fade, so a clipped label reads as one that scrolls. CSS can't tell when that is: your script sets `data-overflow` when the lane overflows, and removes it when it fits.

{{ <vp_example file="nav-link/lane" title="A lane that overflows its box" /> }}
