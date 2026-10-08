# vpkit

The VitePress default-theme look as a [Tailwind CSS v4](https://tailwindcss.com) theme: the `--vp-*` theme variables, semantic utilities that resolve to them, VitePress's breakpoints, class-based dark mode and the Inter webfonts, plus VitePress's components as CSS classes (`vp-btn`, …). Extracted from [rustpress](https://github.com/at-least/rustpress).

It is plain CSS for Tailwind to compile. There is no build step; `npm install` is only needed to run its tests.

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

### Taking only some parts

`vpkit` (index.css) is four files, each importable on its own:

| file | what it holds |
| --- | --- |
| `vpkit/theme.css` | the `dark:` variant, the breakpoints, the semantic utilities |
| `vpkit/tokens.css` | the `--vp-*` variables (plain CSS, no Tailwind directive) |
| `vpkit/doc.css` | code-block and external-link rules for rendered markdown |
| `vpkit/base.css` | VitePress's global element rules |

`base.css` is unlayered and resets focus outlines (`button:focus { outline: none }`), so a project that draws its own focus rings should leave it out:

```css
@import "tailwindcss" source(none);
@import "vpkit/tokens.css";
@import "vpkit/theme.css";
```

## What you get

- **Dark mode**: put `class="dark"` on `<html>`. The `dark:` variant and every `--vp-*` variable follow it.
- **Breakpoints**: VitePress's, in px, replacing Tailwind's defaults: `sm` 640px, `md` 768px, `lg` 960px, `xl` 1280px, `2xl` 1440px.
- **Semantic colors** for every color utility (`text-`, `bg-`, `border-`, …):
  `bg`, `bg-alt`, `bg-elv`, `bg-soft`, `text-1`, `text-2`, `text-3`, `border`, `divider`, `gutter`, `brand-1`/`2`/`3`/`soft`, `default-1`/`2`/`3`/`soft`, `success-1`/`2`/`3`/`soft`, `danger-1`/`2`/`3`/`soft`, `sponsor`. So `text-text-1`, `bg-bg-alt`, `border-divider`, `text-brand-1`, `text-danger-1`.
- **Shadows and fonts**: `shadow-1` … `shadow-5`, `font-sans`, `font-mono`.
- **The `--vp-*` variables** from VitePress's `vars.css`: colors, typography, z-indexes, and the per-component ones (nav, sidebar, code, buttons, custom blocks, badges, search). Use them directly in arbitrary values, e.g. `h-(--vp-nav-height)`.
- **Global rules** that cannot be utilities (`base.css`): bold at 600, pointer cursor on buttons, focus outlines, reduced motion, CJK line breaking, the Alpine `[x-cloak]` rule.
- **Markdown rules** (`doc.css`): the code-block line notations under `.vp-doc pre`, the code-block title bar and the external-link icon.
- **Graded containers**: a `vp-graded-containers` class anywhere on the page switches warning and caution to GitHub's severity colors.

## Theming

The rules are unlayered, so a stylesheet loaded later can override any variable for both modes:

```css
:root { --vp-c-brand-1: #0969da; }
.dark { --vp-c-brand-1: #4493f8; }
```

## Fonts

`fonts.css` refers to the files as `url("fonts/…")`, relative to the compiled stylesheet: the Tailwind CLI leaves these URLs as written. Serve this package's `fonts/` directory next to your built CSS.

## Components

VitePress's components as CSS classes, one optional import each, so a site ships only the ones it uses:

```css
@import "vpkit/button.css";
@import "vpkit/badge.css";
@import "vpkit/alert.css";
```

They sit in Tailwind's `components` layer, so a utility on the same element always wins: `class="vp-btn px-8"` gets the wider padding. A modifier works only together with its base class.

### Button

VitePress's `VPButton`.

```html
<a class="vp-btn vp-btn-brand" href="/guide">Get Started</a>
<button class="vp-btn">Cancel</button>
```

- `vp-btn` alone: the medium size, alt (gray) theme.
- `vp-btn-brand`, `vp-btn-sponsor`: the other two themes.
- `vp-btn-big`: the big size.

Use it on `<a href>` or `<button>`, as VitePress does: those elements supply the pointer cursor, the class doesn't.

### Badge

VitePress's `VPBadge`.

```html
<h2>Search <span class="vp-badge vp-badge-tip">new</span></h2>
```

- `vp-badge` alone: the info type (gray).
- `vp-badge-note`, `vp-badge-tip`, `vp-badge-important`, `vp-badge-caution`, `vp-badge-warning`, `vp-badge-danger`: the other types.
- `vp-badge-small`: the small size.

VitePress's adjustments for a badge inside doc headings and the doc footer are not included; they belong to those layouts.

### Alert

VitePress's custom blocks (`::: tip` and the others).

```html
<div class="vp-alert vp-alert-tip">
  <p class="vp-alert-title">TIP</p>
  <p>Body text, with <a href="/guide">links</a> and <code>code</code>.</p>
</div>
```

- `vp-alert` alone: the info type (gray).
- `vp-alert-note`, `vp-alert-tip`, `vp-alert-important`, `vp-alert-warning`, `vp-alert-danger`, `vp-alert-caution`: the other types.
- `vp-alert-title`: the bold title line; a block with one gets the larger top padding.

Links, inline code and paragraphs inside take the alert's look. A nested alert keeps its own colors. A component inside an alert keeps its own look too (a `vp-btn` link is not restyled as a link), except that the alert's link hover dimming applies to it.

Not included: the `details` type, and the rules for tables and blockquotes inside a block.

## Tests

```sh
npm install
npm test
```

Each component is rendered next to the VitePress original in headless Chromium and their computed styles compared, in light and dark mode and with `:hover`/`:active` forced. vpkit is compiled minified, as it ships; lengths match within 1/32 px because the minifier shortens numbers like `2.7142857` to `2.71429`. The originals in `test/upstream/` are verbatim copies from the tag in `test/upstream/SOURCE`. Intentional differences are listed, with their reasons, in `known` in `test/cases.mjs`; an entry that stops matching fails the run.

## License

MIT. The CSS variables and the Inter font files are ported from [VitePress](https://github.com/vuejs/vitepress) (MIT). Inter itself is licensed under the SIL Open Font License 1.1.
