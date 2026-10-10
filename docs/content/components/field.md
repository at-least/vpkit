+++
title = "Field"
description = "totality's field label and inline error, to go with vp-input."
+++

# Field

A form field's label and its error line, to go with [`vp-input`](@/components/input.md). VitePress has no form fields; these are totality's.

```css
@import "vpkit/field.css";
```

{% <vp_example title="A field with an error"> %}
<label class="vp-label" for="code">Coupon code</label>
<input class="vp-input w-full" id="code" aria-invalid="true" aria-describedby="code-error">
<p class="vp-field-error" id="code-error">This code has expired.</p>
{% </vp_example> %}

- `vp-label`: 14px `text-1` at weight 500, 0.375rem above its control.
- `vp-field-error`: 14px danger text, 0.5rem under the control.
- The two margins are the field's own spacing; `mb-0` and `mt-0` remove them. Tie the error to its control with `aria-describedby`, and mark the control `aria-invalid`, which turns `vp-input`'s border danger.

Inside a `vp-doc` (the markdown's styles, `content.css`) the error line keeps its margin and line height: the markdown's rule for paragraphs is outranked by its own.
