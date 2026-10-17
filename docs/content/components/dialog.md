+++
title = "Dialog"
description = "A modal on the <dialog> element, vpkit's own: the elevated surface, a title and a row of actions."
+++

# Dialog

VitePress has no dialog. This is vpkit's own, on the `<dialog>` element, which brings the top layer, the focus trap, Escape and the backdrop.

```css
@import "vpkit/dialog.css";
```

{% <vp_example title="A modal dialog, opened by its button" min_height="18rem"> %}
<button class="vp-btn" type="button" onclick="document.getElementById('rename').showModal()">Rename…</button>
<dialog class="vp-dialog" id="rename" aria-labelledby="rename-title">
  <form method="dialog">
    <h2 class="vp-dialog-title" id="rename-title">Rename</h2>
    <p>A new name for notes.txt.</p>
    <div class="vp-dialog-actions">
      <button class="vp-btn" value="cancel">Cancel</button>
      <button class="vp-btn vp-btn-brand" value="rename">Rename</button>
    </div>
  </form>
</dialog>
{% </vp_example> %}

- The elevated surface in a divider border, rounded, under `shadow-4`; the backdrop is `--vp-backdrop-bg-color`.
- `vp-dialog-title`: the semibold title. `vp-dialog-actions`: the buttons, at the end of a row.
- Open it with `showModal()`. The browser centers a modal dialog with `margin: auto`, which Tailwind's preflight removes from every element, so the dialog sets it back.
- 26rem wide, at most 92vw, since a dialog without a width shrinks to its content; a width utility replaces it.

The buttons are in a `<form method="dialog">`, which closes the dialog when one is pressed, with no script; Escape closes it too.

In Rust: [`Dialog`](../../rust/vpkit/struct.Dialog.html), from vpkit's [crate](@/guide/rust.md); the title's id is the dialog's with `-title` after it.
