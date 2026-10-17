+++
title = "Hint"
description = "A small \"i\" beside a word whose tooltip says what it means, shown on hover, keyboard focus or a tap; vpkit's own."
+++

# Hint

A small "i" beside a word whose tooltip says what it means. It shows while hovered, while focused from the keyboard, or after a tap, where a `title` attribute shows to neither touch nor most assistive technology. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/hint.css";
```

{% <vp_example title="A hint, open" layout="row"> %}
<p class="pb-16">Ignored <button type="button" class="vp-hint ml-1" data-hint="Ignored issues stay out of the counts until they come back." aria-label="About ignored" aria-expanded="true" aria-describedby="hint-doc">i</button><span class="vp-hint-text" id="hint-doc">Ignored issues stay out of the counts until they come back.</span></p>
{% </vp_example> %}

- `vp-hint` on a `<button>`: a small circle in a divider border. Its tooltip is drawn from its `data-hint`, under it, at most 22rem wide, on the elevated ground.
- It opens while hovered, focused from the keyboard, or with `aria-expanded="true"`. A touch screen never hovers, so your script toggles `aria-expanded` on a tap, and drops it on a tap elsewhere; vpkit ships no script.
- The tooltip is drawn, not read. `vp-hint-text` is a visually hidden copy that the button's `aria-describedby` names, which a screen reader reads; `aria-label` names the button.
- Its place beside the word is yours (`ml-1`).

In Rust: [`Hint`](../../rust/vpkit/struct.Hint.html), from vpkit's [crate](@/guide/rust.md); it writes the button and the hidden copy, the copy's id derived from the hint unless you give one.
