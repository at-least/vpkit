+++
title = "Button"
description = "VitePress's VPButton as a class, on vpkit's control height: the alt, brand, danger and ghost variants, in three sizes."
+++

# Button

VitePress's `VPButton`, its colors, type and motion, on vpkit's control height.

```css
@import "vpkit/components/button/button.css";
```

{{ <vp_example file="button/variants" title="The button's variants" layout="row" /> }}

- `vp-btn` alone: the alt (gray) theme.
- `data-variant="brand"`: the brand theme, white on the brand fill.
- `data-variant="danger"`: vpkit's: danger text on the danger tint, the same hovered and pressed, since the ground is the warning. The tint is laid over the page's color inside the button, so the label keeps its contrast on an alert, a card or a dialog too.
- `data-variant="ghost"`: vpkit's: no border and no ground, secondary text, and on hover body text on the gray wash, the colors of the [Icon Button](@/components/icon-btn.md), for a quiet action beside a brand or an alt one.

Use it on `<a href>` or `<button>`, as VitePress does: those elements supply the pointer cursor, the class doesn't.

## Sizes

A button is 2.75rem tall, the control height, a touch target's 44px (VitePress's medium is 40px): a row of buttons and inputs aligns. `data-size="sm"` is 2.25rem, `data-size="lg"` 3rem with 1rem of text, VitePress's big.

{{ <vp_example file="button/sizes" title="The three sizes" layout="row" /> }}

## Icons and the disabled state

The button is a flex row, so an icon and its label sit centered side by side 0.5rem apart; an `<svg>` straight inside with no size of its own is 1rem, 1.25rem in a large button, and a size utility on it wins. A `disabled` button is dimmed to half opacity with a not-allowed cursor.

{{ <vp_example file="button/icons" title="An icon, and a disabled button" layout="row" /> }}

## The current item

A button whose `aria-current` has a value (`page`, `true`, …) takes the brand theme, so a row of buttons shows its current one from the attribute it carries for assistive technology, with no attribute to swap. `false`, an empty value and `undefined` mean not current, as WAI-ARIA has them. It beats the variants: a current ghost or danger button is brand too.

{{ <vp_example file="button/current" title="A row of buttons with its current one" /> }}

The row itself is the page's: a flex row with a gap, `role="group"` and an `aria-label` if it needs a name.

## Focus and utilities

A focused button draws base.css's ring, the brand outline 2px out. Like every component, the button sits in Tailwind's `components` layer, so a utility on the same element always wins: `class="vp-btn px-8"` gets the wider padding.

{{ <vp_example file="button/utility" title="A utility over the button's padding" layout="row" /> }}
