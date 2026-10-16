+++
title = "Copy Line"
description = "A value to copy, in the code face, with an optional label before it and a copy button after it; vpkit's own."
+++

# Copy Line

A value to copy, such as a command, a URL or a key, in the code face, with an optional label before it and a copy button after it. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/copy.css";
```

{% <vp_example title="A job's check-in lines"> %}
<div class="rounded-lg bg-alt p-4">
  <div class="vp-copy">
    <span class="vp-copy-label">start</span>
    <code class="vp-copy-value">curl -fsS 'https://example.com/api/check-in/in_progress?token=cmt_7f3a'</code>
    <button class="vp-btn" type="button">Copy</button>
  </div>
  <div class="vp-copy">
    <span class="vp-copy-label">ok</span>
    <code class="vp-copy-value">curl -fsS 'https://example.com/api/check-in/ok?token=cmt_7f3a'</code>
    <button class="vp-btn" type="button">Copy</button>
  </div>
</div>
{% </vp_example> %}

- `vp-copy` is the row: wrapping, on the baseline, in the code face at 13px. Lines stacked in one box sit 0.375rem apart, the first and the last flush with the box.
- `vp-copy-label`, optional: secondary text, at least 4.5rem wide so a stack of lines lines up its values, and left out of a selection, so a selection copies the value alone.
- `vp-copy-value`: the value, growing from 12rem and breaking anywhere, so a long one wraps inside the row and at a phone's width the button takes a line of its own.
- A [Button](@/components/button.md) in the row keeps its size, centered on the row. The copying is your script's (`navigator.clipboard`): vpkit ships no JavaScript.
- Inside a `vp-doc` the value keeps the row's look rather than the markdown's inline code.

{% <vp_example title="A value without a label"> %}
<div class="vp-copy">
  <code class="vp-copy-value">https://2b1f@crashcart.example/2</code>
  <button class="vp-btn" type="button">Copy</button>
</div>
{% </vp_example> %}
