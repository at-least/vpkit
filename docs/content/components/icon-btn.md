+++
title = "Icon Button"
description = "VitePress's VPSocialLink, the navbar's social icons, as a button for any icon, on vpkit's control height."
+++

# Icon Button

VitePress's `VPSocialLink`, the navbar's social icons, as a button for any icon.

```css
@import "vpkit/components/icon-btn/icon-btn.css";
```

{{ <vp_example file="icon-btn/buttons" title="Icon buttons" layout="row" /> }}

- A square centering its icon, secondary text, body text on hover. The icon is an inline SVG straight inside, 1.25rem (the crate's `vpkit::icon` writes these, or draw your own), which takes the text color unless it sets its own `fill`: the star above is filled, the stroke icons stay hollow. A size utility on the SVG wins.
- vpkit's addition: rounded corners and the gray wash on hover, so it reads as a control; a [ghost button](@/components/button.md) has the same colors.
- The button shows only the icon: give it an `aria-label`.
- Use it on `<a href>` or `<button>`, as VitePress does: those elements supply the pointer cursor, the class doesn't.

## Sizes

The square is 2.75rem, the control height, a touch target's 44px (VitePress's is 36px): a row of icon buttons, buttons and inputs aligns. `data-size="sm"` is 2.25rem, beside a small button or input. The icon is 1.25rem in both.

{{ <vp_example file="icon-btn/sizes" title="The two sizes, each beside a button its height" layout="row" /> }}

## The appearance switch

`data-variant="appearance"`, a vpkit addition, makes the button a switch over the page's appearance, three ways: dark, light, and auto (the system's). Of its three parts, `vp-icon-btn-light`, `vp-icon-btn-dark` and `vp-icon-btn-auto`, it shows the one the root's `data-appearance` names (`light`, `dark` or `auto`); without the attribute, the light or the dark one, as `.dark` says.

{{ <vp_example file="icon-btn/appearance" title="The appearance switch, following this page" layout="row" /> }}

- The parts are inline SVGs, each with its part's class: the sun, the moon and a monitor, which a page whose Content-Security-Policy refuses `data:` images draws too.
- The cycling is your script's: on a click it moves to the next setting, sets `class="dark"` on `<html>` (for auto, from `prefers-color-scheme`), writes `data-appearance` there, and stores the choice. Set both before the first paint, as you set `.dark`.
- `data-appearance` is a convention the page writes, not an ARIA attribute; give the button an `aria-label` that names the setting it moves to.
