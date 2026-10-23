+++
title = "Hint"
description = "A small \"i\" beside a word whose tooltip says what it means, shown on hover, keyboard focus or a tap; vpkit's own."
+++

# Hint <span class="vp-badge" data-variant="tip">vpkit</span> {#hint}

A small "i" beside a word whose tooltip says what it means. It shows while hovered, while focused from the keyboard, or after a tap, where a `title` attribute shows to neither touch nor most assistive technology. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/components/hint/hint.css";
```

{{ <vp_example file="hint/basic" title="A hint" layout="row" min_height="6rem" /> }}

{{ <vp_example file="hint/open" title="A hint, open" layout="row" /> }}

- `vp-hint` on a `<button>`: a small circle in a divider border. Its tooltip is drawn from its `data-hint`, under it, at most 22rem wide, on the elevated ground.
- The tooltip stays on the screen: it is anchored to its button and shifted to stay 1rem in from the screen's edges (narrower on a phone), and opens over the button where under it would run off the bottom. A scrolling table around the button doesn't clip it, and it never widens the page. This takes CSS anchor positioning (Chrome 131, Safari 26, Firefox 147); an older browser places it under the button and lets it run past the screen's edge.
- It opens while hovered, focused from the keyboard, or with `aria-expanded="true"`. On a touch screen hovering doesn't open it, so your script toggles `aria-expanded` on a tap, and drops it on a tap elsewhere; vpkit ships no script.
- The tooltip is drawn, not read. The copy after the button is `hidden`, and the button's `aria-describedby` names it, so a screen reader reads it as the button's description; `aria-label` names the button. Hidden, it has no box, so from inside a scrolling table it can't widen the page, and it isn't read a second time as text of its own.
- Its place beside the word is yours (`ml-1`).

In Rust: [`Hint`](../../rust/vpkit/struct.Hint.html), from vpkit's [crate](@/guide/rust.md); it writes the button and the hidden copy, the copy's id derived from the hint unless you give one.
