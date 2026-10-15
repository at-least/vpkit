+++
title = "Drawer"
description = "VitePress's sidebar as a phone shows it, on the <dialog> element: a panel that slides in from the left over a scrim."
+++

# Drawer

VitePress's sidebar as a phone shows it (`VPSidebar` under 60rem, over `VPBackdrop`'s scrim), on the `<dialog>` element, which brings the top layer, the focus trap, Escape and the backdrop.

```css
@import "vpkit/drawer.css";
```

{% <vp_example title="A drawer, opened by its button" min_height="24rem"> %}
<button class="vp-btn" type="button" onclick="document.getElementById('menu').showModal()">Menu</button>
<dialog class="vp-drawer" id="menu" aria-label="Menu" closedby="any">
  <nav>
    <a class="vp-nav-link vp-nav-link-screen" href="#" aria-current="page">Guide</a>
    <a class="vp-nav-link vp-nav-link-screen" href="#">Reference</a>
    <a class="vp-nav-link vp-nav-link-screen" href="#">Examples</a>
  </nav>
  <form method="dialog" class="mt-6">
    <button class="vp-btn">Close</button>
  </form>
</dialog>
{% </vp_example> %}

- `vp-drawer`: the panel at the left edge, the viewport's full height, 4rem narrower than the viewport and at most 20rem, on `--vp-sidebar-bg-color`. It scrolls its content, and a scroll that reaches its end stays inside it. Under forced colors its right edge is a line in the text color.
- The backdrop is `--vp-backdrop-bg-color`, `VPBackdrop`'s scrim.
- The slide is VitePress's: in from the left over 0.5s, out over 0.25s, the scrim fading with it. During the slide out a tap on the fading scrim reaches the page beneath: a closed dialog is no longer modal.
- `showModal()` moves focus into the drawer, to its first link; `autofocus` on an element picks another.
- Open it with `showModal()`. The drawer says its edge, where the other components leave their place to the page (the skip link apart): a drawer that doesn't is not one. `w-*` and `max-w-none` set another width; `--vp-layout-top-height`, VitePress's variable for a banner above the layout, or `top-16` starts it below a bar.

Not included: VitePress's z-index and `.open` class (the top layer and `[open]` take their place), the sidebar's desktop rules from 60rem, the scrim's `display: none` from 80rem, the body scroll lock (the page behind still scrolls, as behind `vp-dialog`) and the right-to-left build, so the edge is the left in either direction; the open panel carries no transform, so a fixed element inside it sits at the viewport's corner.

The links are `vp-nav-link vp-nav-link-screen`, the phone menu's rows; what is inside is the page's. The Close button is in a `<form method="dialog">`, which closes the dialog with no script, and Escape closes it; `closedby="any"` has the browser close it on a click outside too, from Chrome 134 and Firefox 141.

The slide out needs `display` and `overlay` transitions with `allow-discrete`, measured in Chromium only: by the compatibility data Firefox closes the drawer at once, and Safari 18 slides it out but drops the scrim at once. Every engine has the slide in. Under `prefers-reduced-motion` the slide and the fade are off, as every transition is on a page with `base.css`.
