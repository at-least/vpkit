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

- Brand text at weight 500, underlined, `brand-2` on hover.
- On a `<button>` it looks the same; the hit area is the page's (`min-h-10 px-2`).
- A `<code>` inside takes VitePress's colors for code in a link, over `vp-code`'s own.
- Its two colors are the variables `--vp-link-text` and `--vp-link-hover-text`, so a site retunes them in one rule.

{% <vp_example title="Code in a link" layout="row"> %}
<a class="vp-link" href="#">Order <code class="vp-code">ORD-2026-0142</code></a>
{% </vp_example> %}

## Quiet

`vp-link-quiet`, with `vp-link`, is a link among text that needn't call out: a file name in a table, a line of metadata. It takes the color and the weight of the text around it, has no underline, and turns brand on hover. A weight of its own is a utility (`font-medium`); a color of its own goes on the text around it (`text-secondary` on the line), since a color utility on the link would beat its hover.

{% <vp_example title="Quiet links" layout="row"> %}
<a class="vp-link vp-link-quiet font-medium" href="#">notes.txt</a>
<p class="text-secondary">Kept in <a class="vp-link vp-link-quiet" href="#">docs/2026</a></p>
{% </vp_example> %}
