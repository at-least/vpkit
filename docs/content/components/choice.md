+++
title = "Choice"
description = "A radio or checkbox drawn as a selectable card, vpkit's own, its states read with :has()."
+++

# Choice <span class="vp-badge" data-variant="tip">vpkit</span> {#choice}

A radio or a checkbox drawn as a selectable card. VitePress has none; this is vpkit's own, on the contract.

```css
@import "vpkit/components/choice/choice.css";
```

{{ <vp_example file="choice/plans" title="Two plans as radio cards" layout="stack" /> }}

- The page's color in a divider border; the control first, in the brand color.
- A brand border on hover. While its control is checked: the brand border on the brand tint. While the control has the keyboard's focus: the focus ring around the card.
- Its states are its control's, read with `:has()`: there is nothing to toggle but the control.
- While its control is `disabled`, the card is dimmed to half opacity with a not-allowed cursor and takes no hover, as a disabled [Button](@/components/button.md) is. Only the card's own control counts: a disabled select inside its text leaves the card as it is.

{{ <vp_example file="choice/disabled" title="A disabled choice beside two that can be picked" layout="stack" /> }}

{{ <vp_example file="choice/checkbox" title="A checkbox card" /> }}
