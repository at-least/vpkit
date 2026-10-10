+++
title = "Link"
description = "VitePress's markdown link as a class, for a link outside the markdown, on <a> or <button>."
+++

# Link

VitePress's markdown link (`.vp-doc a`) as a class, for a link outside the markdown.

```css
@import "vpkit/link.css";
```

{% <vp_example title="A link, and a button drawn as one" layout="row"> %}
<a class="vp-link" href="#">All orders</a>
<button class="vp-link" type="button">Cancel</button>
{% </vp_example> %}

- Brand text at weight 500, underlined 0.125rem below, `brand-2` on hover.
- On a `<button>` it looks the same; the hit area is the page's (`min-h-10 px-2`).
- A `<code>` inside takes VitePress's colors for code in a link, over `vp-code`'s own.
- Its two colors are the variables `--vp-link-text` and `--vp-link-hover-text`, so a site retunes them in one rule.

{% <vp_example title="Code in a link" layout="row"> %}
<a class="vp-link" href="#">Order <code class="vp-code">ORD-2026-0142</code></a>
{% </vp_example> %}
