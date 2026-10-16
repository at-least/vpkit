+++
title = "Accordion"
description = "VitePress's nav screen group as classes: sections on <details>, each a row with a divider under it that opens into its content."
+++

# Accordion

VitePress's nav screen group (`VPNavScreenMenuGroup`), the row a phone's menu opens into its links, as a section on the `<details>` element.

```css
@import "vpkit/accordion.css";
```

{% <vp_example title="Three sections, one open" layout="stack"> %}
<details class="vp-accordion" open>
  <summary class="vp-accordion-title">Shipping<span class="vpi-plus vp-accordion-icon" aria-hidden="true"></span></summary>
  <p class="text-sm text-secondary">Orders placed before noon ship the same day. Tracking arrives by email once the parcel leaves the warehouse.</p>
</details>
<details class="vp-accordion">
  <summary class="vp-accordion-title">Returns<span class="vpi-plus vp-accordion-icon" aria-hidden="true"></span></summary>
  <p class="text-sm text-secondary">Returns are free for 30 days.</p>
</details>
<details class="vp-accordion">
  <summary class="vp-accordion-title">Warranty<span class="vpi-plus vp-accordion-icon" aria-hidden="true"></span></summary>
  <p class="text-sm text-secondary">Two years, from the day of delivery.</p>
</details>
{% </vp_example> %}

- `vp-accordion`: a section with a divider under it; stacked, the sections are the list. Open (`[open]`, the element's own state, where VitePress has `.open`) it keeps VitePress's space under its content.
- `vp-accordion-title`: the summary, a row of medium-weight text, brand on hover and while the section is open. It takes the pointer, which a summary has none of its own.
- `vp-accordion-icon`: the plus at the row's end, `vpi-plus` from `icons.css` ([the icons](@/guide/getting-started.md#markdown-and-icons)), which turns into a cross as the section opens.

The browser opens and closes a `<details>` with no script, and the keyboard reaches its summary. What is inside is the page's: a paragraph, a list of links, a form.
