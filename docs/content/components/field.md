+++
title = "Field"
description = "A form field: its label, its control, a hint and an error line; vpkit's own, to go with vp-input."
+++

# Field <span class="vp-badge" data-variant="tip">vpkit</span> {#field}

A form field: its label, its control, a hint and an error line, to go with [`vp-input`](@/components/input.md). VitePress has no form fields; these are vpkit's own.

```css
@import "vpkit/components/field/field.css";
```

{{ <vp_example file="field/field" title="A field with a hint and an error" /> }}

- `vp-field`: the box around one field, its parts 0.375rem apart. It may shrink in a row, and its control with it, so at a phone's width a field takes the width there is instead of overflowing. A row or a grid of fields is yours.
- `vp-label`: body text at weight 500.
- `vp-field-hint`: 12px secondary text under the control.
- `vp-field-error`: danger text. Tie the hint and the error to the control with `aria-describedby`, and mark the control `aria-invalid` while there is an error, which turns `vp-input`'s border danger.

{{ <vp_example file="field/row" title="Fields side by side" /> }}

Outside a field, a label keeps 0.375rem below it and an error line 0.5rem above it (`mb-0`, `mt-0` remove them):

{{ <vp_example file="field/bare" title="A label and an error line on their own" /> }}

## In Rust

The crate's [`Field`](../../rust/vpkit/struct.Field.html) writes the box and the label around the control you give it, with a [`FieldHint`](../../rust/vpkit/struct.FieldHint.html) or a [`FieldError`](../../rust/vpkit/struct.FieldError.html) where there is one; `field_hint_id` and `field_error_id` are their ids, for the control's `aria-describedby`.
