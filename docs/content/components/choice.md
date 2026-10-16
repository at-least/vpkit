+++
title = "Choice"
description = "A radio or checkbox drawn as a selectable card, vpkit's own, its states read with :has()."
+++

# Choice

A radio or a checkbox drawn as a selectable card. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/choice.css";
```

{% <vp_example title="Two plans as radio cards" layout="stack"> %}
<label class="vp-choice">
  <input type="radio" name="plan" value="monthly" checked>
  <span>Monthly<br>NT$300 a month</span>
</label>
<label class="vp-choice">
  <input type="radio" name="plan" value="yearly">
  <span>Yearly<br>NT$3,000 a year</span>
</label>
{% </vp_example> %}

- The page ground in a divider border; the control first, in the brand color.
- A brand border on hover. While its control is checked: the brand border on the brand tint. While the control has the keyboard's focus: a brand outline around the card.
- Its states are its control's, read with `:has()`: there is nothing to toggle but the control.
- vpkit's addition: while its control is `disabled`, the card is dimmed to half opacity with a not-allowed cursor and takes no hover, as a disabled [Button](@/components/button.md) is. Only the card's own control counts: a disabled select inside its text leaves the card as it is.

{% <vp_example title="A disabled choice beside two that can be picked" layout="stack"> %}
<label class="vp-choice">
  <input type="radio" name="scope" value="admin" checked>
  <span>admin<br>everything, instance-wide</span>
</label>
<label class="vp-choice">
  <input type="radio" name="scope" value="ci">
  <span>ci<br>symbol upload and deploy markers</span>
</label>
<label class="vp-choice">
  <input type="radio" name="scope" value="read" disabled>
  <span>read<br>minted on the command line</span>
</label>
{% </vp_example> %}

{% <vp_example title="A checkbox card"> %}
<label class="vp-choice">
  <input type="checkbox" name="gift">
  <span>Send it as a gift</span>
</label>
{% </vp_example> %}
