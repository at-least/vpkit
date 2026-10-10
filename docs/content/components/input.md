+++
title = "Input"
description = "totality's input on VitePress's input variables: inputs, selects and textareas, with aria-invalid states."
+++

# Input

VitePress defines input variables (`--vp-input-border-color`, `--vp-input-bg-color`) but no input component. This is totality's input, built on those variables.

```css
@import "vpkit/input.css";
```

{% <vp_example title="An input, an invalid input, a select and a textarea" layout="row"> %}
<input class="vp-input w-full" placeholder="Coupon code">
<input class="vp-input" aria-invalid="true">
<select class="vp-input w-full"><option>7 days</option><option>30 days</option></select>
<textarea class="vp-input w-full" rows="4"></textarea>
{% </vp_example> %}

- 44px tall with 16px text (iOS zooms into anything smaller), the input border on the input background, a brand border on hover and focus.
- Focus draws a 2px brand ring as a box-shadow, since `base.css` removes focus outlines.
- `aria-invalid="true"` turns the border danger and `"false"` success, even on hover and focus.
- The width is yours: add `w-full` or any width utility.

{% <vp_example title="The invalid and valid states" layout="row"> %}
<input class="vp-input" aria-invalid="true" value="SPRING24">
<input class="vp-input" aria-invalid="false" value="SPRING26">
{% </vp_example> %}

## Select

On a `<select>` it is the same box, and the browser draws the arrow. Where the text sits is the browser's: Chromium sets it 4px further in than an input's, and 1px lower, as it centers the text on a line height of its own. `ps-2` on the select aligns the start edges in Chromium.

{% <vp_example title="A select under an input, aligned with ps-2" layout="stack"> %}
<input class="vp-input" value="30 days">
<select class="vp-input ps-2"><option>30 days</option><option>7 days</option></select>
{% </vp_example> %}

## Textarea

On a `<textarea>` the height follows `rows`, never less than the input's, with 9px above and below the text, so a one-row textarea is the input's box with its text on the same pixels. `rows` and the resize handle are the markup's.

{% <vp_example title="A one-row textarea beside an input" layout="row"> %}
<input class="vp-input" value="One line">
<textarea class="vp-input" rows="1">One line</textarea>
{% </vp_example> %}
