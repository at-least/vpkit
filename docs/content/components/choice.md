+++
title = "Choice"
description = "totality's radio or checkbox drawn as a selectable card, its states read with :has()."
+++

# Choice

A radio or a checkbox drawn as a selectable card. VitePress has none; this is totality's, on VitePress's tokens.

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

- The page ground in a divider border, 1rem padding, 14px text; the control first, 16px, in the brand color.
- A brand border on hover. While its control is checked: the brand border on the brand tint. While the control has the keyboard's focus: a 2px brand outline around the card.
- Its states are its control's, read with `:has()`: there is nothing to toggle but the control.

{% <vp_example title="A checkbox card"> %}
<label class="vp-choice">
  <input type="checkbox" name="gift">
  <span>Send it as a gift</span>
</label>
{% </vp_example> %}
