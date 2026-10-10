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
- `vp-btn-danger`: vpkit's addition, own-drive's danger button: danger text on the danger tint, the same hovered and pressed, since the ground is the warning. The tint is laid over the page's color inside the button, so the label keeps its contrast on an alert, a card or a dialog too.
- `vp-btn-ghost`: vpkit's addition, crashcart's ghost button: no border and no ground, secondary text, and on hover text on the soft gray ground, the colors of the [Icon Button](@/components/icon-btn.md), for a quiet action beside a brand or an alt one.
- `vp-btn-big`: the big size.

{% <vp_example title="The big size" layout="row"> %}
<button class="vp-btn vp-btn-big" type="button">Cancel</button>
<a class="vp-btn vp-btn-brand vp-btn-big" href="#">Get Started</a>
{% </vp_example> %}

Use it on `<a href>` or `<button>`, as VitePress does: those elements supply the pointer cursor, the class doesn't.

Inside a `vp-doc` (the markdown's styles, `content.css`), a button link keeps its look: the markdown's rule for links, which would underline it and color it as a link, is outranked by the button's own.

{% <vp_example title="A ghost button beside a brand one" layout="row"> %}
<button class="vp-btn vp-btn-ghost" type="button">Sign out</button>
<a class="vp-btn vp-btn-ghost" href="#">newlix</a>
<button class="vp-btn vp-btn-brand" type="button">Save</button>
{% </vp_example> %}

## Icons and the disabled state

Two additions VitePress's button doesn't have: it is `inline-flex`, so an icon and its label sit centered side by side 0.5rem apart, and a `disabled` button is dimmed to half opacity with a not-allowed cursor.

{% <vp_example title="An icon, and a disabled button" layout="row"> %}
<button class="vp-btn vp-btn-brand" type="button"><span class="vpi-plus"></span>New file</button>
<button class="vp-btn vp-btn-brand" type="button" disabled>Paying…</button>
{% </vp_example> %}

## Utilities

Like every component, the button sits in Tailwind's `components` layer, so a utility on the same element always wins: `class="vp-btn px-8"` gets the wider padding.

{% <vp_example title="A utility over the button's padding" layout="row"> %}
<button class="vp-btn px-8" type="button">Wider</button>
{% </vp_example> %}
