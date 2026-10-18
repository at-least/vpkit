+++
title = "Accordion"
description = "VitePress's nav screen group as classes: sections on <details>, each a row with a divider under it that opens into its content."
+++

# Accordion

VitePress's nav screen group (`VPNavScreenMenuGroup`), the row a phone's menu opens into its links, as a section on the `<details>` element.

```css
@import "vpkit/components/accordion/accordion.css";
```

{{ <vp_example file="accordion/sections" title="Three sections, one open" layout="stack" /> }}

- `vp-accordion`: a section with a divider under it; stacked, the sections are the list. Open (`[open]`, the element's own state, where VitePress has `.open`) it keeps VitePress's space under its content.
- `vp-accordion-title`: the summary, a row of medium-weight text, brand on hover and while the section is open. It takes the pointer, which a summary has none of its own, and base.css's ring when focused.
- `vp-accordion-icon`: the plus at the row's end, an inline SVG (Lucide's plus, as the crate's `vpkit::icon` writes it) 1em square, which turns into a cross as the section opens.

The browser opens and closes a `<details>` with no script, and the keyboard reaches its summary. What is inside is the page's: a paragraph, a list of links, a form.
