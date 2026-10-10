+++
title = "Hamburger"
description = "VitePress's VPNavBarHamburger as a class: the button that opens a phone's menu, three bars that turn into a cross while it is open."
+++

# Hamburger

VitePress's `VPNavBarHamburger`, the button at the end of the navbar that opens the nav screen on a phone.

```css
@import "vpkit/hamburger.css";
```

{% <vp_example title="Closed, and open" layout="row"> %}
<button class="vp-hamburger" type="button" aria-label="Menu" aria-expanded="false">
  <span class="vp-hamburger-box"><span></span><span></span><span></span></span>
</button>
<button class="vp-hamburger" type="button" aria-label="Close the menu" aria-expanded="true">
  <span class="vp-hamburger-box"><span></span><span></span><span></span></span>
</button>
{% </vp_example> %}

- `vp-hamburger`: the button, 3rem wide and the navbar's height, centering the bars. Hovered, the bars slide apart. Open (`aria-expanded="true"`, where VitePress has `.active`) the top and bottom bars cross and the middle one slides out of view.
- `vp-hamburger-box`: the 1rem by 0.875rem frame the three bars, three empty `<span>`s, move in.

When the button shows is the page's: `md:hidden` hides it from 768px, where VitePress's bar shows the menu and the hamburger goes; totality's store hides it from 960px. Opening the screen, and the screen itself, are the page's too: set `aria-expanded` on the button, and `aria-controls` to the screen's id. The screen's links are [Nav Link](@/components/nav-link.md)'s `vp-nav-link-screen`.

Under forced colors (Windows' contrast themes) the bars, which are backgrounds the browser would erase, take the text color.
