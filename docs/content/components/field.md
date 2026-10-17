+++
title = "Field"
description = "A form field: its label, its control, a hint and an error line; vpkit's own, to go with vp-input."
+++

# Field

A form field: its label, its control, a hint and an error line, to go with [`vp-input`](@/components/input.md). VitePress has no form fields; these are vpkit's own.

```css
@import "vpkit/field.css";
```

{% <vp_example title="A field with a hint and an error"> %}
<div class="vp-field">
  <label class="vp-label" for="code">Coupon code</label>
  <input class="vp-input w-full" id="code" aria-invalid="true" aria-describedby="code-hint code-error">
  <p class="vp-field-hint" id="code-hint">Printed on the back of the card.</p>
  <p class="vp-field-error" id="code-error">This code has expired.</p>
</div>
{% </vp_example> %}

- `vp-field`: the box around one field, its parts 0.375rem apart. It may shrink in a row, and its control with it, so at a phone's width a field takes the width there is instead of overflowing. A row or a grid of fields is yours.
- `vp-label`: `text-1` at weight 500.
- `vp-field-hint`: 12px secondary text under the control.
- `vp-field-error`: danger text. Tie the hint and the error to the control with `aria-describedby`, and mark the control `aria-invalid` while there is an error, which turns `vp-input`'s border danger.

{% <vp_example title="Fields side by side"> %}
<div class="flex flex-wrap items-end gap-3">
  <div class="vp-field">
    <label class="vp-label" for="name">Name</label>
    <input class="vp-input" id="name">
  </div>
  <div class="vp-field">
    <label class="vp-label" for="email">Email</label>
    <input class="vp-input" id="email" type="email">
  </div>
</div>
{% </vp_example> %}

A label or an error line outside a `vp-field` keeps its own spacing, 0.375rem below the label and 0.5rem above the error; `mb-0` and `mt-0` remove them.
