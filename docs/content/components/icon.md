+++
title = "Icon"
description = "An SVG of your own at the size and in the color of the text around it: VitePress's icon as a class."
+++

# Icon

An SVG of your own, at the size and in the color of the text around it. VitePress's icon (`VPIcon`, its form for an icon given as markup) as a class.

```css
@import "vpkit/components/icon/icon.css";
```

{{ <vp_example file="icon/text" title="Icons beside their text" /> }}

- `vp-icon`: a square the size of the text (1em), its SVG filling it in the text's color.
- An SVG that sets its own `fill` keeps it, so an icon drawn with strokes (`fill="none"`) stays an outline, where VitePress fills every SVG. A size or fill utility on the SVG wins.
- Decorative: give the SVG `aria-hidden="true"` when the text beside it says what it means.
- The crate's `vpkit::icon` has VitePress's icons as inline SVGs and writes one with this class.
