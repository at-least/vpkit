+++
title = "Skip Link"
description = "VitePress's VPSkipLink as a class: the skip-to-content link, hidden until the keyboard reaches it."
+++

# Skip Link

VitePress's `VPSkipLink`, the "Skip to content" link at the top of every page.

```css
@import "vpkit/components/skip/skip.css";
```

{{ <vp_example file="skip/link" title="A skip link, shown while focused" min_height="4rem" /> }}

- `vp-skip`: visually hidden until it has the keyboard's focus, then a pill fixed at the top left corner: brand text, bold, on the page's color with a shadow, above everything.

Put it first in `<body>`, before the navbar, with the id of `<main>` as its target. It is positioned, where the other components (the drawer and the nav screen apart) leave placement to the page: VitePress's is, and a skip link's place is the page's corner.
