+++
title = "Home Sponsors"
description = "A home page's sponsors section, a heart, a message, the sponsors' box and an action: VitePress's home sponsors as a class."
+++

# Home Sponsors

A home page's sponsors section: a heart, a message, the [sponsors' box](@/components/sponsor.md) and an action under it. VitePress's home sponsors (`VPHomeSponsors`) as a class.

```css
@import "vpkit/docs-theme/components/home-sponsors/home-sponsors.css";
```

{{ <vp_example file="home-sponsors/sponsors" title="A home page's sponsors" kit="docs-theme" /> }}

- `vp-home-sponsors`: the block, a rule above it and VitePress's padding over its content and at each side, which grows from 48rem and from 60rem wide, with its margins above and below.
- `vp-home-sponsors-container`: at most 72rem wide, centered.
- `vp-home-sponsors-love`: the heart, centered in the tertiary text; its SVG straight inside, 1em square on the baseline.
- `vp-home-sponsors-message`: the message under it, centered, in secondary text, at most 20rem wide.
- `vp-home-sponsors-list`: the sponsors, a `vp-sponsor` box, under the message.
- `vp-home-sponsors-action`: the action under them, centered. VitePress puts its sponsor button there, the docs theme layout's `vp-button vp-button--medium vp-button--sponsor`, which the example above leaves out, as VitePress does without a link.
- Inside the home page's markdown the layout stretches the section to the window's width.
