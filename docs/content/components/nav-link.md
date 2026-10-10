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

- `vp-nav-link`: a flex row as tall as the navbar, 0.75rem of padding each side, 0.875rem text at weight 500, brand on hover and while it is the current page's (`aria-current="page"`, where VitePress has `.active`). On a `<button>` it is the same row: a form's submit drawn as a link of the menu.
- `vp-nav-link-screen`: the screen's link, a block with a divider under it.

{% <vp_example title="The screen's links" layout="stack"> %}
<a class="vp-nav-link vp-nav-link-screen" href="#" aria-current="page">Guide</a>
<a class="vp-nav-link vp-nav-link-screen" href="#">Reference</a>
<a class="vp-nav-link vp-nav-link-screen" href="#">Sign out</a>
{% </vp_example> %}

The bar is [Top Bar](@/components/topbar.md); the screen, and opening it, are the page's.
