+++
title = "Toggle"
description = "VitePress's VPSwitch as a class, its knob moved by aria-checked, and VPSwitchAppearance as a variant."
+++

# Toggle

VitePress's `VPSwitch`, with `VPSwitchAppearance` as a variant.

```css
@import "vpkit/components/toggle/toggle.css";
```

{{ <vp_example file="toggle/switch" title="A switch, off and on" layout="row" /> }}

- `vp-toggle`: the track, the control's border color on the gray wash, a brand border on hover. `vp-toggle-check`: the knob, which slides to the right while the button's `aria-checked` is `"true"`. That state is vpkit's addition (VPSwitch has none of its own; only the appearance switch moves its knob, by `.dark`): keep `aria-checked` in step with the setting, and the component reads nothing else.
- `vp-toggle-icon`: the round clip for an icon in the knob, an inline SVG straight inside it, 0.75rem in secondary text (body text in dark), placed as VPSwitch places it. The icons are inline SVGs, not masks, so a page whose Content-Security-Policy refuses `data:` images draws them too; the crate's `vpkit::icon` writes them.

The page's script keeps `aria-checked` in step; here an `onclick`:

{{ <vp_example file="toggle/icon" title="A switch with an icon, flipped on click" layout="row" /> }}

## The appearance switch

`data-variant="appearance"`: the appearance switch. The knob follows `.dark` on `<html>` as VitePress's does, so it is right before any script runs; of the two icons in the clip the sun (`vp-toggle-light`) shows in light, the moon (`vp-toggle-dark`) in dark. The example follows this site's appearance: switch it in the navbar.

{{ <vp_example file="toggle/appearance" title="The appearance switch" layout="row" /> }}

The script that toggles `.dark` and `aria-checked` is the page's ([vpkit-zola](https://github.com/at-least/vpkit-zola)'s `vpkit-zola.js` has VitePress's).
