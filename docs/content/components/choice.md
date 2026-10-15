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

{% <vp_example title="A checkbox card"> %}
<label class="vp-choice">
  <input type="checkbox" name="gift">
  <span>Send it as a gift</span>
</label>
{% </vp_example> %}
