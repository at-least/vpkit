+++
title = "Skip Link"
description = "VitePress's VPSkipLink as a class: the skip-to-content link, hidden until the keyboard reaches it."
+++

# Skip Link

VitePress's `VPSkipLink`, the "Skip to content" link at the top of every page.

```css
@import "vpkit/skip.css";
```

{% <vp_example title="A skip link, shown while focused" min_height="4rem"> %}
<a class="vp-skip" href="#main">Skip to content</a>
<p>Press <kbd class="vp-kbd">Tab</kbd> in this frame to focus the link.</p>
<main id="main"></main>
{% </vp_example> %}

- `vp-skip`: visually hidden (a 1px box, clipped) until it has the keyboard's focus, then a pill fixed at the top left corner: brand text, bold, on the page's color with a shadow, above everything.

Put it first in `<body>`, before the navbar, with the id of `<main>` as its target. It is positioned, where the other components leave placement to the page: VitePress's is, and a skip link's place is the page's corner.
