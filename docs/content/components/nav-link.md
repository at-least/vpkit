+++
title = "Nav Link"
description = "VitePress's VPNavMenuLink as a class: a link of the navbar's menu, and the same link in the nav screen."
+++

# Nav Link

VitePress's `VPNavMenuLink`: a link of the navbar's menu, in the bar and in the nav screen (the menu a phone opens).

```css
@import "vpkit/nav-link.css";
```

{% <vp_example title="The bar's links, one current" layout="row"> %}
<a class="vp-nav-link" href="#" aria-current="page">Guide</a>
<a class="vp-nav-link" href="#">Reference</a>
<button class="vp-nav-link" type="button">Sign out</button>
{% </vp_example> %}

- `vp-nav-link`: a flex row as tall as the navbar, brand on hover and while it is the current page's (`aria-current="page"`, where VitePress has `.active`). On a `<button>` it is the same row: a form's submit drawn as a link of the menu.
- `vp-nav-link-screen`: the screen's link, a block with a divider under it.

{% <vp_example title="The screen's links" layout="stack"> %}
<a class="vp-nav-link vp-nav-link-screen" href="#" aria-current="page">Guide</a>
<a class="vp-nav-link vp-nav-link-screen" href="#">Reference</a>
<a class="vp-nav-link vp-nav-link-screen" href="#">Sign out</a>
{% </vp_example> %}

The bar is [Top Bar](@/components/topbar.md); the screen, and opening it, are the page's.

## A lane

`vp-nav-lane` is a row of nav links that scrolls sideways rather than wrap or clip, for a header's second row or a page's section links. Its scrollbar is hidden; a wheel, a drag or a swipe still scrolls it. Its links are 2.25rem tall and stay on one line.

While the lane is wider than its box its edges fade, so a clipped label reads as one that scrolls. CSS can't tell when that is: your script sets `data-overflow` when the lane overflows, and removes it when it fits.

{% <vp_example title="A lane that overflows its box"> %}
<nav class="vp-nav-lane w-64" aria-label="Project" data-overflow>
  <a class="vp-nav-link" href="#" aria-current="page">Overview</a>
  <a class="vp-nav-link" href="#">Issues</a>
  <a class="vp-nav-link" href="#">Events</a>
  <a class="vp-nav-link" href="#">Releases</a>
  <a class="vp-nav-link" href="#">Jobs</a>
  <a class="vp-nav-link" href="#">Settings</a>
</nav>
{% </vp_example> %}
