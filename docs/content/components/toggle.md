+++
title = "Toggle"
description = "VitePress's VPSwitch as a class, its knob moved by aria-checked, and VPSwitchAppearance as a modifier."
+++

# Toggle

VitePress's `VPSwitch`, with `VPSwitchAppearance` as a modifier.

```css
@import "vpkit/icons.css";  /* the icons in the knob */
@import "vpkit/toggle.css";
```

{% <vp_example title="A switch, off and on" layout="row"> %}
<button class="vp-toggle" type="button" role="switch" aria-checked="false" aria-label="Notifications">
  <span class="vp-toggle-check"></span>
</button>
<button class="vp-toggle" type="button" role="switch" aria-checked="true" aria-label="Notifications">
  <span class="vp-toggle-check"></span>
</button>
{% </vp_example> %}

- `vp-toggle`: the 2.5rem × 1.375rem track on the input tokens, a brand border on hover. `vp-toggle-check`: the knob, which slides to the right while the button's `aria-checked` is `"true"`. That state is vpkit's addition (VPSwitch has none of its own; only the appearance switch moves its knob, by `.dark`): keep `aria-checked` in step with the setting, and the component reads nothing else.
- `vp-toggle-icon`: the round clip for an icon in the knob, any `vpi-*` icon of `icons.css` (0.75rem, `text-2`, `text-1` in dark), placed as VPSwitch places it. The icon's class list must start with the `vpi-` class, as VPSwitch's `[class^='vpi-']` rule has it.

The page's script keeps `aria-checked` in step; here it is an `onclick`:

{% <vp_example title="A switch with an icon, flipped on click" layout="row"> %}
<button class="vp-toggle" type="button" role="switch" aria-checked="true" aria-label="Favorite"
        onclick="this.setAttribute('aria-checked', this.getAttribute('aria-checked') === 'true' ? 'false' : 'true')">
  <span class="vp-toggle-check"><span class="vp-toggle-icon"><span class="vpi-heart" aria-hidden="true"></span></span></span>
</button>
{% </vp_example> %}

## The appearance switch

`vp-toggle-appearance`: the appearance switch. The knob follows `.dark` on `<html>` as VitePress's does, so it is right before any script runs; of the two icons the sun (`vpi-sun`) shows in light, the moon (`vpi-moon`) in dark. The example follows this site's appearance: switch it in the navbar.

{% <vp_example title="The appearance switch" layout="row"> %}
<button class="vp-toggle vp-toggle-appearance" type="button" role="switch" aria-checked="false" aria-label="Appearance">
  <span class="vp-toggle-check"><span class="vp-toggle-icon">
    <span class="vpi-sun" aria-hidden="true"></span><span class="vpi-moon" aria-hidden="true"></span>
  </span></span>
</button>
{% </vp_example> %}

The script that toggles `.dark` and `aria-checked` is the page's ([vpkit-zola](https://github.com/at-least/vpkit-zola)'s `vpkit-zola.js` has VitePress's). `icons.css` is its own import.
