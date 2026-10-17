+++
title = "Nav Screen"
description = "The menu a phone's hamburger opens over the page, under the bar: VitePress's nav screen as classes."
+++

# Nav Screen

The menu a phone's hamburger opens over the page, under the bar: VitePress's nav screen (`VPNavScreen`) as classes. Its name is `vp-screen`; the documentation layout's own nav screen is `vp-nav-screen`.

```css
@import "vpkit/screen.css";
```

{% <vp_example title="Opened by the hamburger" min_height="26rem"> %}
<header class="vp-topbar">
  <div class="vp-topbar-row">
    <a class="vp-topbar-title" href="#">Store</a>
    <button class="vp-hamburger" type="button" aria-label="Menu" aria-controls="screen" aria-expanded="false" onclick="var s=document.getElementById('screen');s.hidden=!s.hidden;this.setAttribute('aria-expanded',String(!s.hidden))"><span class="vp-hamburger-box" aria-hidden="true"><span></span><span></span><span></span></span></button>
  </div>
  <div class="vp-screen" id="screen" hidden>
    <div class="vp-screen-container">
      <nav aria-label="Main">
        <a class="vp-nav-link vp-nav-link-screen" href="#" aria-current="page">Store</a>
        <a class="vp-nav-link vp-nav-link-screen" href="#">Orders</a>
        <a class="vp-nav-link vp-nav-link-screen" href="#">Help</a>
      </nav>
      <div class="vp-screen-row mt-6">
        <p class="vp-screen-label">Appearance</p>
        <span class="vp-badge">switch</span>
      </div>
    </div>
  </div>
</header>
{% </vp_example> %}

- `vp-screen`: fixed from just under the bar to the foot of the screen, full width, on the nav screen's ground. It scrolls on its own, and a scroll that reaches its end doesn't scroll the page behind it. It starts under the bar rather than covering it, so the bar stays above it.
- `vp-screen-container`: an 18rem column, centered.
- `vp-screen-row` with `vp-screen-label`: a labelled row on a soft ground, its control at the far end, as VitePress's appearance row.
- Open and close it with the `hidden` attribute, and keep the hamburger's `aria-expanded` in step. Hide it where the bar shows its links (`lg:hidden`); the space between its parts is yours (`mt-6`).
