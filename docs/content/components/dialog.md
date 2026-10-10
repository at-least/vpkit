+++
title = "Dialog"
description = "own-drive's modal on the <dialog> element: the elevated surface, a title and a row of actions."
+++

# Dialog

VitePress has no dialog. This is own-drive's modal, on the `<dialog>` element, which brings the top layer, the focus trap, Escape and the backdrop.

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

- The elevated surface in a divider border, a 0.75rem radius, `shadow-4`; the backdrop is `--vp-backdrop-bg-color`.
- `vp-dialog-title`: the 1.05rem semibold title. `vp-dialog-actions`: the buttons, at the end of a row 0.5rem apart.
- Open it with `showModal()`. The browser centers a modal dialog with `margin: auto`, which Tailwind's preflight removes from every element, so the dialog sets it back.
- 26rem wide, at most 92vw: unlike the other components it has a width, since a dialog without one shrinks to its content. A width utility replaces it.

The buttons are in a `<form method="dialog">`, which closes the dialog when one is pressed, with no script; Escape closes it too.

Inside a `vp-doc` (the markdown's styles, `content.css`) the title keeps its box: the markdown's rules for headings are outranked by its own.
