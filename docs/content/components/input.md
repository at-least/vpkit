+++
title = "Input"
description = "A text input, a select and a textarea in one box at the control height; vpkit's own, on VitePress's tokens."
+++

# Input <span class="vp-badge" data-variant="tip">vpkit</span> {#input}

The box of the three text-like controls, vpkit's own: VitePress has the tokens and no input.

```css
@import "vpkit/components/input/input.css";
```

{{ <vp_example file="input/controls" title="An input, a select and a textarea" layout="stack" /> }}

- 2.75rem tall, the control height, with 16px text (iOS zooms into anything smaller), the border color on the alternate ground; a brand border hovered and focused, and base.css's ring focused.
- `aria-invalid="true"` turns the border danger, `"false"` success, over hover and focus.
- Width is the page's: add `w-full`, or a width utility.
- `data-size="sm"`: 2.25rem tall with 14px text, beside a small button.

{{ <vp_example file="input/states" title="Invalid, valid, and small" layout="stack" /> }}

A `<select>` takes the class as it is, with the browser's arrow; where its text sits is the browser's (Chromium sets it 4px further in than an input's). A `<textarea>` is freed to follow `rows`, never less than the control height, padded so a one-row textarea is the input's box with its line where the input's text is; its rows and its resize handle are the markup's. The placeholder is muted text.

A field around the control, with its label, hint and error line, is [Field](@/components/field.md).
