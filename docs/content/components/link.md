+++
title = "Link"
description = "VitePress's markdown link as a class, for a link outside the markdown, on <a> or <button>, with a quiet variant."
+++

# Link

VitePress's markdown link (`.vp-doc a`) as a class, for a link outside the markdown.

```css
@import "vpkit/components/link/link.css";
```

{{ <vp_example file="link/basic" title="A link, and a button drawn as one" layout="row" /> }}

- Brand text at weight 500, underlined, the brand's hover color on hover.
- On a `<button>` it looks the same; the hit area is the page's (`min-h-10 px-2`).
- A `<code>` inside takes VitePress's colors for code in a link, over `vp-code`'s own.
- Its two colors are the variables `--vp-link-text` and `--vp-link-hover-text`, so a site retunes them in one rule.

{{ <vp_example file="link/code" title="Code in a link" layout="row" /> }}

## Quiet

`data-variant="quiet"`, vpkit's, is a link among text that needn't call out: a file name in a table, a line of metadata. It takes the color and the weight of the text around it, has no underline, and turns brand on hover. A weight of its own is a utility (`font-medium`); a color of its own goes on the text around it (`text-secondary` on the line), since a color utility on the link would beat its hover.

{{ <vp_example file="link/quiet" title="Quiet links" layout="row" /> }}
