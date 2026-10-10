+++
title = "Code"
description = "VitePress's inline code as a class, for code outside the markdown."
+++

# Code

VitePress's inline code (`.vp-doc :not(pre) > code`) as a class, for code outside the markdown.

```css
@import "vpkit/code.css";
```

{% <vp_example title="Inline code in a sentence"> %}
<p>Your order <code class="vp-code">ORD-2026-0142</code> has shipped.</p>
{% </vp_example> %}

- 0.875em code in the brand color on the soft gray, a 0.25rem radius; the face is the page's code face.
- In a [`vp-link`](@/components/link.md) it takes the link's colors, as code in a markdown link does.
- Not for code inside an alert: a plain `<code>` there takes the alert's tint, which `vp-code` would override. Inside `.vp-doc`, `content.css` styles every `code` already.
