+++
title = "Dot"
description = "A small round marker beside a word: a legend's key, or a status's second carrier; vpkit's own."
+++

# Dot <span class="vp-badge" data-variant="tip">vpkit</span> {#dot}

A small round marker beside a word: a legend's key, or a status's second carrier, never its only one, since the word says it. VitePress has none; this is vpkit's own, on VitePress's tokens. Inside a [Badge](@/components/badge.md) the same dot is `vp-badge-dot`.

```css
@import "vpkit/components/dot/dot.css";
```

{{ <vp_example file="dot/legend" title="A legend" layout="row" /> }}

- `vp-dot`: 0.5rem, round, in the text's color by default.
- `data-variant="success"`, `"warning"`, `"danger"` and `"tip"` color it as the badge's types are colored.
- A color of your own, a chart's series, is the variable: `style="--vp-dot-color: var(--series-1)"`.
- Under forced colors it paints in the system's text color.
