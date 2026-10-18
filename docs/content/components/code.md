+++
title = "Code"
description = "VitePress's inline code as a class, for code outside the markdown."
+++

# Code

VitePress's inline code (`.vp-doc :not(pre) > code`) as a class, for code outside the markdown.

```css
@import "vpkit/components/code/code.css";
```

{{ <vp_example file="code/basic" title="Inline code in a sentence" /> }}

- Code in the brand color on the gray wash, rounded; the face is the page's code face.
- In a [`vp-link`](@/components/link.md) it takes the link's colors, as code in a markdown link does.
- Inside an alert a plain `<code>` takes the alert's tint; `vp-code` keeps its own look there. Inside `.vp-doc`, `prose.css` styles every `code` already.
