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

- `vp-drawer`: the panel, at the left edge from the top of the page to its bottom, 4rem narrower than the page and at most 20rem, on `--vp-sidebar-bg-color` with 2rem of padding (6rem below, VitePress's room for a phone's bottom bar); `shadow-1` in dark mode. It scrolls its content, and a scroll that reaches its end stays inside it.
- The backdrop is `--vp-backdrop-bg-color`, `VPBackdrop`'s scrim.
- The slide is VitePress's: opening, the panel comes in from the left over 0.5s as it fades in, the scrim fading in over 0.5s; closing, it slides out over 0.25s, the scrim fading over 0.25s.
- Open it with `showModal()`. Where every other component leaves its place to the page, the drawer says its edge, since a drawer that doesn't is not one. `w-*` and `max-w-none` set another width; `top-16` starts it below a bar.

The links are `vp-nav-link vp-nav-link-screen`, the phone menu's rows; what is inside is the page's. The Close button is in a `<form method="dialog">`, which closes the dialog with no script, and Escape closes it. `closedby="any"` has the browser close it on a click outside too, in Chrome 134 and Firefox 141 (Safari has it in its preview as of October 2026); without it, a click handler on the dialog that checks the click fell outside its box does the same.

The slide out needs the browser to keep a closing dialog on screen and in the top layer until the transition ends (`display` and `overlay` transitions with `allow-discrete`): Chromium does, and the tests run there. By the browsers' compatibility data, Firefox ends a `display` transition at once, so there the drawer closes at once; Safari before 18 does the same, and Safari from 18 keeps the panel but not the top layer, so there the scrim goes at once and the panel finishes its slide behind whatever the page stacks over it. All of them slide it in (Safari from 17.5). Under `prefers-reduced-motion` the slide and the scrim's fade are off, as every transition is on a page with `base.css`, whose rule names `::backdrop` for the scrim.

Inside a `vp-doc` (the markdown's styles, `content.css`) the panel is as it is: the markdown has no rule for a dialog. What is inside it takes the markdown's rules, as anywhere in a `vp-doc`.
