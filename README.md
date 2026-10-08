# vpkit

The VitePress default-theme look as a [Tailwind CSS v4](https://tailwindcss.com) theme: the `--vp-*` theme variables, semantic utilities that resolve to them, VitePress's breakpoints, class-based dark mode and the Inter webfonts. Extracted from [rustpress](https://github.com/at-least/rustpress).

It is plain CSS for Tailwind to compile. There is no build step and nothing to run.

## Use

Add it as a dependency (here from a sibling checkout):

```sh
npm install --save-dev ../vpkit
```

Then import it from your Tailwind entry stylesheet, after Tailwind itself:

```css
@import "tailwindcss" source(none);
@source "../src";             /* wherever your class strings live */
@import "vpkit/fonts.css";  /* optional: the Inter webfonts */
@import "vpkit";
```

`@source` stays in your stylesheet: Tailwind resolves it relative to the file it is written in.

## What you get

- **Dark mode**: put `class="dark"` on `<html>`. The `dark:` variant and every `--vp-*` variable follow it.
- **Breakpoints**: VitePress's, in px, replacing Tailwind's defaults: `sm` 640px, `md` 768px, `lg` 960px, `xl` 1280px, `2xl` 1440px.
- **Semantic colors** for every color utility (`text-`, `bg-`, `border-`, …):
  `bg`, `bg-alt`, `bg-elv`, `bg-soft`, `text-1`, `text-2`, `text-3`, `border`, `divider`, `gutter`, `brand-1`/`2`/`3`/`soft`, `default-1`/`2`/`3`/`soft`, `sponsor`. So `text-text-1`, `bg-bg-alt`, `border-divider`, `text-brand-1`.
- **Shadows and fonts**: `shadow-1` … `shadow-5`, `font-sans`, `font-mono`.
- **The `--vp-*` variables** from VitePress's `vars.css`: colors, typography, z-indexes, and the per-component ones (nav, sidebar, code, buttons, custom blocks, badges, search). Use them directly in arbitrary values, e.g. `h-(--vp-nav-height)`.
- **Global rules** that cannot be utilities: bold at 600, pointer cursor on buttons, focus outlines, reduced motion, the Alpine `[x-cloak]` rule, the code-block line notations under `.vp-doc pre`, the code-block title bar and the external-link icon.
- **Graded containers**: a `vp-graded-containers` class anywhere on the page switches warning and caution to GitHub's severity colors.

## Theming

The rules are unlayered, so a stylesheet loaded later can override any variable for both modes:

```css
:root { --vp-c-brand-1: #0969da; }
.dark { --vp-c-brand-1: #4493f8; }
```

## Fonts

`fonts.css` refers to the files as `url("fonts/…")`, relative to the compiled stylesheet: the Tailwind CLI leaves these URLs as written. Serve this package's `fonts/` directory next to your built CSS.

## License

MIT. The CSS variables and the Inter font files are ported from [VitePress](https://github.com/vuejs/vitepress) (MIT). Inter itself is licensed under the SIL Open Font License 1.1.
