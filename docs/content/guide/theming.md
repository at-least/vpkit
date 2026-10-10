+++
title = "Theming"
description = "Override the --vp-* variables, or take one of 222 color themes, each a whole design for light and dark held to contrast minimums."
+++

# Theming

The rules are unlayered, so a stylesheet loaded later can override any variable for both modes:

```css
:root { --vp-c-brand-1: #0969da; }
.dark { --vp-c-brand-1: #4493f8; }
```

## Color themes

`themes/` holds 222 ready-made color themes. Each is a whole design: it sets every `--vp-c-*` color the stylesheets use, the brand button's hover color `--vp-button-brand-hover-bg`, and the five `--vp-shadow-*`, for light (`:root`) and dark (`.dark`). Import one after vpkit, or link it after your compiled stylesheet:

```css
@import "vpkit";
@import "vpkit/themes/nord.css";
```

A theme only sets variables, so the components and your utilities follow it.

[Themes](@/themes.md) shows every one of them, and puts the one you pick on its page.

### Where they come from

- 24 are curated: `github`, `catppuccin`, `nord` and `rose-pine` are hand-tuned, 20 more are mapped by hand from their published palettes.
- 198 are mapped automatically from the Helix editor's palettes (`helix/`), each read as Helix reads it, its `inherits` followed, with accents adjusted where the published colors fall short of WCAG AA. A palette's declared background (`ui.background`) decides whether it is the light or the dark half.

### Switching at runtime

A theme sets `:root` and `.dark`, so one applies per page. To switch themes at runtime, scope copies of their rules under an attribute of your own, such as `[data-theme="nord"]`.

### Links and the brand button

In a theme `brand-2` and each role's `-2` (`tip-2`, `important-2`, `warning-2`, `danger-2`, `caution-2`) are a hovered link's color, which is what VitePress's stylesheets use them for; `default-2` keeps its job as the alt button's hover background. VitePress's `vars.css` describes `-2` as the button's hover color, and makes `brand-2` the brand button's hover background, but in dark mode no one color can be both a white-labelled button's background and a hovered link that reads on the page, so a theme gives the brand button its hover color through `--vp-button-brand-hover-bg`, a variable VitePress has for it. Where a container's tint would leave a hovered link no room, the generator thins the tint, never below 0.06, and a dark page too light to leave room even then is darkened until it does.

### What the tests hold a theme to

`test/themes.mjs` holds every theme to the whole contract (every `--vp-c-*` vpkit's stylesheets reference: the base, the components, the layout, the markdown and the icons, less VitePress's own undefined `--vp-c-shadow-3` in VPSidebar.vue) in both modes, and to contrast minimums: body text 7:1 on the page and on the elevated surface of menus and dialogs, secondary text 4.5:1 on the page, the soft surfaces and the elevated one, muted text 3:1, links 4.5:1 on the page and the elevated surface, white button labels 3:1 on the brand button at rest and hovered, each badge and alert color 4.5:1 on its own tint, and each `-2` 4.5:1 as a hovered link, dimmed to 0.75 where a container dims it, on the container's tint and on code inside it. A shortfall the generator can't fit is listed in the test with its cause, and the run fails once it stops occurring; none is listed.

## Generating themes

The generated themes come from `scripts/gen-themes.py` (Python 3.11+): edit its slot maps, run `python3 scripts/gen-themes.py`, then `npm test`. The four hand-tuned ones are edited directly.
