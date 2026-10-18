+++
title = "Site Footer"
description = "The line at the foot of a site's pages, a message and its links: VitePress's footer as a class."
+++

# Site Footer

The line at the foot of a site's pages: a message and its links. VitePress's footer (`VPFooter`) as a class; its name is `vp-site-footer`, since the documentation layout's own footer is `vp-footer`.

```css
@import "vpkit/components/site-footer/site-footer.css";
```

{{ <vp_example file="site-footer/message" title="A footer" /> }}

- `vp-site-footer`: a gutter line above it, on the page's color, with VitePress's padding; its text small, secondary and centered, each line at most the layout's width.
- Its links are underlined, and turn to body text while hovered; a [Link](@/components/link.md) inside keeps its own look.
- Where it sits in the page's stack is yours: VitePress's footer carries a z-index for its layout, this one none.
