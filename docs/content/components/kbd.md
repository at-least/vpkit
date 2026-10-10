+++
title = "Key"
description = "The key caps of VitePress's local search box as a class."
+++

# Key

The key caps of VitePress's local search box, which lists its shortcuts with them.

```css
@import "vpkit/kbd.css";
```

{% <vp_example title="A key in a sentence"> %}
<p>Press <kbd class="vp-kbd">Esc</kbd> to close.</p>
{% </vp_example> %}

- A faint gray cap in a fainter gray border with a soft shadow, at least 1.5rem wide, centered on the line. Its text is the page's size.
- The grays are VitePress's own, half-transparent and the same in both modes, so the key sits on any ground; it reads no theme color.
- In running text, a smaller size (`text-xs`) keeps it from opening up the line, as the search box's 0.8rem list does.

{% <vp_example title="Smaller keys in running text"> %}
<p>Press <kbd class="vp-kbd text-xs">↑</kbd> <kbd class="vp-kbd text-xs">↓</kbd> to navigate, <kbd class="vp-kbd text-xs">Enter</kbd> to select and <kbd class="vp-kbd text-xs">Esc</kbd> to close.</p>
{% </vp_example> %}
