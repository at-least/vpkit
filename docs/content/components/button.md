+++
title = "Button"
description = "VitePress's VPButton as a class: the alt, brand, sponsor, danger and ghost themes, in two sizes."
+++

# Button

VitePress's `VPButton`.

```css
@import "vpkit/button.css";
```

{% <vp_example title="The button's themes" layout="row"> %}
<button class="vp-btn" type="button">Cancel</button>
<a class="vp-btn vp-btn-brand" href="#">Get Started</a>
<a class="vp-btn vp-btn-sponsor" href="#">Sponsor</a>
<button class="vp-btn vp-btn-danger" type="button">Delete</button>
{% </vp_example> %}

- `vp-btn` alone: the medium size, alt (gray) theme.
- `vp-btn-brand`, `vp-btn-sponsor`: the other two themes.
- `vp-btn-danger`: vpkit's addition: danger text on the danger tint, the same hovered and pressed, since the ground is the warning. The tint is laid over the page's color inside the button, so the label keeps its contrast on an alert, a card or a dialog too.
- `vp-btn-ghost`: vpkit's addition: no border and no ground, secondary text, and on hover text on the soft gray ground, the colors of the [Icon Button](@/components/icon-btn.md), for a quiet action beside a brand or an alt one.
- `vp-btn-big`: the big size.

{% <vp_example title="The big size" layout="row"> %}
<button class="vp-btn vp-btn-big" type="button">Cancel</button>
<a class="vp-btn vp-btn-brand vp-btn-big" href="#">Get Started</a>
{% </vp_example> %}

Use it on `<a href>` or `<button>`, as VitePress does: those elements supply the pointer cursor, the class doesn't.

{% <vp_example title="A ghost button beside a brand one" layout="row"> %}
<button class="vp-btn vp-btn-ghost" type="button">Sign out</button>
<a class="vp-btn vp-btn-ghost" href="#">newlix</a>
<button class="vp-btn vp-btn-brand" type="button">Save</button>
{% </vp_example> %}

## Icons and the disabled state

Additions VitePress's button doesn't have: it is `inline-flex`, so an icon and its label sit centered side by side 0.5rem apart; an `<svg>` straight inside with no size of its own is 1rem, 1.25rem in a big button, and a size utility on it wins; and a `disabled` button is dimmed to half opacity with a not-allowed cursor.

{% <vp_example title="An icon, and a disabled button" layout="row"> %}
<button class="vp-btn vp-btn-brand" type="button"><span class="vpi-plus"></span>New file</button>
<button class="vp-btn vp-btn-brand" type="button" disabled>Paying…</button>
{% </vp_example> %}

## The current item

A button whose `aria-current` has a value (`page`, `true`, …) takes the brand theme, so a row of buttons shows its current one from the attribute it carries for assistive technology, with no class to swap. `false`, an empty value and `undefined` mean not current, as WAI-ARIA has them. A vpkit addition, and it beats the other themes: a current ghost or danger button is brand too.

{% <vp_example title="A row of buttons with its current one" layout="row"> %}
<a class="vp-btn" href="#">24h</a>
<a class="vp-btn" href="#" aria-current="true">7d</a>
<a class="vp-btn" href="#">30d</a>
<a class="vp-btn" href="#">90d</a>
{% </vp_example> %}

The row itself is the page's: a flex row with a gap, `role="group"` and an `aria-label` if it needs a name.

## Utilities

Like every component, the button sits in Tailwind's `components` layer, so a utility on the same element always wins: `class="vp-btn px-8"` gets the wider padding.

{% <vp_example title="A utility over the button's padding" layout="row"> %}
<button class="vp-btn px-8" type="button">Wider</button>
{% </vp_example> %}

On a coarse pointer, a touch screen, a button is at least 2.75rem tall: a touch target's 44px. A mouse keeps VitePress's 40px.
