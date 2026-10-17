+++
title = "Pre"
description = "A block of code or raw text outside the markdown: VitePress's code block as a class."
+++

# Pre

A block of code or raw text outside the markdown: VitePress's code block as a class, for a payload, a log or a file's text on an app's page.

```css
@import "vpkit/pre.css";
```

{% <vp_example title="A raw payload"> %}
<pre class="vp-pre my-0"><code>{
  "level": "error",
  "message": "panic in send_digest: connection reset by peer, after 3 retries over 40 seconds"
}</code></pre>
{% </vp_example> %}

- `vp-pre` on a `<pre>`, the text in a `<code>` inside: the code block's ground, a 0.5rem radius, the code 1.5rem in from either side, scrolling sideways.
- It keeps VitePress's 1rem margin above and below; `my-0` removes it.
- Lines that should wrap take `whitespace-pre-wrap` on the `<pre>`; a block that should stop growing takes a height and `overflow-y-auto`.
- Inside an [Alert](@/components/alert.md) the code keeps the block's look, at the alert's smaller size.
- Not included: a language label, a copy button, highlighted lines.
