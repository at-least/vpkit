+++
title = "vpkit"
description = "VitePress's look as a Tailwind CSS v4 theme: its variables, utilities, components and color themes."

[extra]
layout = "home"

[extra.hero]
name = "vpkit"
text = "VitePress's look for Tailwind CSS"
tagline = "The default theme's variables, components and layout as a Tailwind v4 theme, with 222 color themes. Plain CSS for your Tailwind build."
image = { src = "/logo.svg", alt = "vpkit" }
actions = [
  { theme = "brand", text = "What is vpkit?", link = "@/guide/what-is-vpkit.md" },
  { theme = "alt", text = "Getting Started", link = "@/guide/getting-started.md" },
  { theme = "alt", text = "Components", link = "@/components/_index.md" },
]

[[extra.features]]
icon = "🎨"
title = "VitePress's design"
details = "The <code>--vp-*</code> variables, breakpoints, dark mode and Inter webfonts of VitePress's default theme, with utilities that resolve to them: <code>text-text-1</code>, <code>bg-bg-alt</code>, <code>border-divider</code>."
link = "@/guide/utilities.md"
link_text = "Utilities and variables"

[[extra.features]]
icon = "🧩"
title = "Components as classes"
details = "Twenty components, one optional import each: <code>vp-btn</code>, <code>vp-alert</code>, <code>vp-input</code>, <code>vp-dialog</code> and more, each rendered next to its original in a browser and compared."
link = "@/components/_index.md"
link_text = "The components"

[[extra.features]]
icon = "🌈"
title = "222 color themes"
details = "Each a whole design for light and dark, held by the tests to every variable the stylesheets use and to WCAG contrast minimums."
link = "@/themes.md"
link_text = "Try them"

[[extra.features]]
icon = "📐"
title = "The docs layout"
details = "VitePress's navbar, sidebar, outline, home page and markdown styles as classes, for a docs theme. This site is built with one, vpkit-zola."
link = "@/guide/layout.md"
link_text = "Docs layout"
+++
