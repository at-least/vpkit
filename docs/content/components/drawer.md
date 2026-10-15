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

- `vp-drawer`: the panel, at the left edge from the top of the viewport to its bottom, 4rem narrower than the viewport and at most 20rem, on `--vp-sidebar-bg-color` with 2rem of padding (6rem below, VitePress's); `shadow-1` in dark mode. It scrolls its content, and a scroll that reaches its end stays inside it. Under forced colors, which paint the panel and the page the same, its right edge is a line in the text color.
- The backdrop is `--vp-backdrop-bg-color`, `VPBackdrop`'s scrim.
- The slide is VitePress's: opening, the panel comes in from the left over 0.5s as it fades in over 0.25s, the scrim fading in over 0.5s; closing, it slides out over 0.25s as it fades over 0.5s, the scrim fading over 0.25s, and it stays on screen until the half second is up. During that slide out a tap on the fading scrim reaches the page beneath: a closed dialog is no longer modal.
- `showModal()` moves focus into the drawer, to its first link; `autofocus` on an element picks another.
- Open it with `showModal()`. Where the other components leave their place to the page (the skip link apart, whose place is the page's corner), the drawer says its edge, since a drawer that doesn't is not one. `w-*` and `max-w-none` set another width; `--vp-layout-top-height` (VitePress's variable for a banner above the layout, which the drawer starts under as the sidebar does) or `top-16` starts it below a bar.

Not included: VitePress's z-index and its `.open` class (the top layer and the element's own `[open]` take their place), the sidebar's desktop rules from 60rem (the docs theme's fixed column is `layout.css`'s), the scrim's `display: none` from 80rem, the body scroll lock, so the page behind an open drawer still scrolls, as behind `vp-dialog`, and VitePress's right-to-left build, which flips the sidebar to the right edge: vpkit has none, so the drawer's edge is the left in either direction. The open panel carries no transform (VitePress's has `translateX(0)`, the same place), so a fixed element inside it, a toast shown while the page behind is inert, sits at the viewport's corner and not the panel's.

The links are `vp-nav-link vp-nav-link-screen`, the phone menu's rows; what is inside is the page's. The Close button is in a `<form method="dialog">`, which closes the dialog with no script, and Escape closes it. `closedby="any"` has the browser close it on a click outside too, in Chrome 134 and Firefox 141 (Safari has it in its preview as of October 2026); without it, a click handler on the dialog that checks the click fell outside its box does the same.

The slide out needs the browser to keep a closing dialog on screen and in the top layer until the transition ends (`display` and `overlay` transitions with `allow-discrete`): Chromium does, and the tests run there, and only there. What the other browsers do is what their compatibility data says, not what was seen: Firefox has no `display` transition, so by the data the drawer closes at once there; Safari has it from 18 but no `overlay`, so by the data a closing drawer there leaves the top layer at once, the scrim with it, and finishes its slide behind whatever the page stacks over it, and before 18 closes at once. All of them have the slide in (Safari from 17.5). Under `prefers-reduced-motion` the slide and the scrim's fade are off, as every transition is on a page with `base.css`, whose rule names `::backdrop` for the scrim.
