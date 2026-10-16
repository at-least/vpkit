+++
title = "Icon Button"
description = "VitePress's VPSocialLink, the navbar's social icons, as a button for any icon."
+++

# Icon Button

VitePress's `VPSocialLink`, the navbar's social icons, as a button for any icon.

```css
@import "vpkit/icons.css";  /* the vpi-* icons */
@import "vpkit/icon-btn.css";
```

{% <vp_example title="Icon buttons" layout="row"> %}
<button class="vp-icon-btn" type="button" aria-label="Delete"><span class="vpi-delete"></span></button>
<button class="vp-icon-btn" type="button" aria-label="Edit"><span class="vpi-square-pen"></span></button>
<a class="vp-icon-btn" href="#" aria-label="Favorites"><svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg></a>
{% </vp_example> %}

- A square centering its icon, `text-2`, `text-1` on hover. The icon is a `vpi-*` icon of `icons.css` ([the icons](@/guide/getting-started.md#markdown-and-icons)) or an inline SVG, which takes the text color unless it sets its own `fill`.
- vpkit's addition: rounded corners and the soft gray ground on hover, so it reads as a control.
- The button shows only the icon: give it an `aria-label`.

## The appearance switch

`vp-icon-btn-appearance`, a vpkit addition, makes the button a switch over the page's appearance, three ways: dark, light, and auto (the system's). Of its three parts, `vp-icon-btn-light`, `vp-icon-btn-dark` and `vp-icon-btn-auto`, it shows the one the root's `data-appearance` names (`light`, `dark` or `auto`); without the attribute, the light or the dark one, as `.dark` says.

{% <vp_example title="The appearance switch, following this page" layout="row"> %}
<button class="vp-icon-btn vp-icon-btn-appearance" type="button" aria-label="Appearance">
  <span class="vpi-sun vp-icon-btn-light"></span>
  <span class="vpi-moon vp-icon-btn-dark"></span>
  <span class="vpi-monitor vp-icon-btn-auto"></span>
</button>
{% </vp_example> %}

- The parts are `vpi-*` icons or inline SVGs. A page whose Content-Security-Policy refuses `data:` images can't paint `icons.css`'s icons, so it draws its own SVGs, each with its part's class.
- The cycling is your script's: on a click it moves to the next setting, sets `class="dark"` on `<html>` (for auto, from `prefers-color-scheme`), writes `data-appearance` there, and stores the choice. Set both before the first paint, as you set `.dark`.
- `data-appearance` is a convention the page writes, not an ARIA attribute; give the button an `aria-label` that names the setting it moves to.
