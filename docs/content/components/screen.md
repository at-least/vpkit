+++
title = "Nav Screen"
description = "The menu a phone's hamburger opens over the page, under the bar: VitePress's nav screen as classes."
+++

# Nav Screen

The menu a phone's hamburger opens over the page, under the bar: VitePress's nav screen (`VPNavScreen`) as classes. Its name is `vp-screen`; the documentation layout's own nav screen is `vp-nav-screen`.

```css
@import "vpkit/components/screen/screen.css";
```

{{ <vp_example file="screen/menu" title="Opened by the hamburger" min_height="26rem" /> }}

- `vp-screen`: fixed from just under the bar to the foot of the screen, full width, on the page's color. It scrolls on its own, and a scroll that reaches its end doesn't scroll the page behind it. It starts under the bar rather than covering it, so the bar stays above it; under a banner above the bar, set its height as `--vp-layout-top-height`, VitePress's variable for it.
- `vp-screen-container`: an 18rem column, centered.
- `vp-screen-row` with `vp-screen-label`: a labelled row on a soft ground, its control at the far end, as VitePress's appearance row; the control is the [Toggle](@/components/toggle.md)'s appearance variant.
- What is inside is yours: the [Nav Link](@/components/nav-link.md)'s screen variant (`data-variant="screen"`) for the links, an [Accordion](@/components/accordion.md) for a group of them.
- Open and close it with the `hidden` attribute, and keep the [Hamburger](@/components/hamburger.md)'s `aria-expanded` in step. Hide it from 768px, where VitePress's bar shows its links and the hamburger goes (`md:hidden`); the space between its parts is yours (`mt-6`).
