+++
title = "vpkit"
description = "VitePress's look as a Tailwind CSS v4 theme and a kit of components for applications: the color contract, the utilities, the components, the Rust crate, the color themes and the docs theme."

[extra]
layout = "home"

[extra.hero]
name = "vpkit"
text = "VitePress's look for applications"
tagline = "A Tailwind v4 theme on a 34-color contract, components as classes, a Rust crate for their markup and stylesheets, and 222 color themes. Plain CSS for your Tailwind build."
image = { src = "/logo.svg", alt = "vpkit" }
actions = [
  { theme = "brand", text = "What is vpkit?", link = "@/guide/what-is-vpkit.md" },
  { theme = "alt", text = "Getting Started", link = "@/guide/getting-started.md" },
  { theme = "alt", text = "Components", link = "@/components/_index.md" },
]

[[extra.features]]
icon = "🎨"
title = "VitePress's design"
details = "The color contract, 34 <code>--vp-c-*</code> variables named by their job, each a <code>light-dark()</code> pair, with the breakpoints, dark mode and Inter, and utilities that resolve to them: <code>text-body</code>, <code>bg-soft</code>, <code>text-brand</code>."
link = "@/guide/utilities.md"
link_text = "Utilities and variables"

[[extra.features]]
icon = "🧩"
title = "Components as classes"
details = "Forty-five components, one optional import each: <code>vp-btn</code>, <code>vp-alert</code>, <code>vp-input</code>, <code>vp-dialog</code> and more, their variants as attributes, one control height and one focus ring, each held to its original by the tests."
link = "@/components/_index.md"
link_text = "The components"

[[extra.features]]
icon = "🦀"
title = "One crate, one pin"
details = "hypertext components for the markup, Lucide's icons as inline SVG, and the stylesheets embedded: an app's cargo dependency at a commit pins its markup and its CSS together."
link = "@/guide/rust.md"
link_text = "Rust"

[[extra.features]]
icon = "🌈"
title = "222 color themes"
details = "Each a whole design for light and dark, held by the tests to every variable the stylesheets use and to WCAG contrast minimums."
link = "@/themes.md"
link_text = "Try them"
+++
