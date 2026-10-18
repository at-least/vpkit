+++
title = "Dialog"
description = "A modal on the <dialog> element, vpkit's own: the elevated surface, a title and a row of actions."
+++

# Dialog <span class="vp-badge" data-variant="tip">vpkit</span> {#dialog}

VitePress has no dialog. This is vpkit's own, on the `<dialog>` element, which brings the top layer, the focus trap, Escape and the backdrop.

```css
@import "vpkit/components/dialog/dialog.css";
```

{{ <vp_example file="dialog/basic" title="The crate's markup, open in place" min_height="13rem" /> }}

{{ <vp_example file="dialog/open" title="A dialog open in place, and the button that opens it as a modal" min_height="18rem" /> }}

- The elevated surface in a divider border, rounded, under `shadow-4`; the backdrop is `--vp-backdrop-bg-color`.
- `vp-dialog-title`: the semibold title. `vp-dialog-actions`: the buttons, at the end of a row.
- Open it with `showModal()`. The browser centers a modal dialog with `margin: auto`, which Tailwind's preflight removes from every element, so the dialog sets it back.
- 26rem wide, at most 92vw, since a dialog without a width shrinks to its content; a width utility replaces it.

Both dialogs start `open`, shown in place without their backdrop, so the page shows them; a page's own leaves `open` off and opens it with `showModal()`. The second's buttons are in a `<form method="dialog">`, which closes the dialog when one is pressed, with no script; `Rename…` opens it again with `showModal()`, centered over the backdrop, and Escape closes it too.

In Rust: [`Dialog`](../../rust/vpkit/struct.Dialog.html), from vpkit's [crate](@/guide/rust.md), writes the dialog and its title around the body you give it, the first example with `open=true`; the title's id is the dialog's with `-title` after it.
