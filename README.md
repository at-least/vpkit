# vpkit

The VitePress default-theme look as a [Tailwind CSS v4](https://tailwindcss.com) theme: the `--vp-*` theme variables, semantic utilities that resolve to them, VitePress's breakpoints, class-based dark mode and the Inter webfonts, plus VitePress's components as CSS classes (`vp-btn`, …), 200 color themes and code colors. Extracted from [rustpress](https://github.com/at-least/rustpress).

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
- **Page colors** are yours to set: put `bg-bg text-text-1` on `<body>`. vpkit colors its components, not the page.
- **Breakpoints**: VitePress's, in px, replacing Tailwind's defaults: `sm` 640px, `md` 768px, `lg` 960px, `xl` 1280px, `2xl` 1440px.
- **Semantic colors** for every color utility (`text-`, `bg-`, `border-`, …):
  `bg`, `bg-alt`, `bg-elv`, `bg-soft`, `text-1`, `text-2`, `text-3`, `border`, `divider`, `gutter`, `brand-1`/`2`/`3`/`soft`, `default-1`/`2`/`3`/`soft`, `success-1`/`soft`, `danger-1`/`soft`, `sponsor`. So `text-text-1`, `bg-bg-alt`, `border-divider`, `text-brand-1`, `text-danger-1`.
- **Shadows and fonts**: `shadow-1` … `shadow-5`, `font-sans`, `font-mono`.
- **The `--vp-*` variables** from VitePress's `vars.css`: colors, typography, z-indexes, and the per-component ones (nav, sidebar, code, buttons, custom blocks, badges, search). Use them directly in arbitrary values, e.g. `h-(--vp-nav-height)`.
- **Global rules** that cannot be utilities (`base.css`): bold at 600, pointer cursor on buttons, focus outlines, reduced motion, CJK line breaking, the Alpine `[x-cloak]` rule.
- **Markdown rules** (`doc.css`): the code-block line notations under `.vp-doc pre`, the code-block title bar and the external-link icon.
- **Graded containers**: a `vp-graded-containers` class anywhere on the page switches warning and caution to GitHub's severity colors.
- **Color themes**: 200 of them in `themes/`, one file each (see [Color themes](#color-themes)).
- **Code colors**: `syntax.css`, for code highlighted with `tk-*` classes (see [Code colors](#code-colors)).

## Theming

The rules are unlayered, so a stylesheet loaded later can override any variable for both modes:

```css
:root { --vp-c-brand-1: #0969da; }
.dark { --vp-c-brand-1: #4493f8; }
```

### Color themes

`themes/` holds 200 ready-made color themes. Each is a whole design: it sets every `--vp-c-*` color the stylesheets use, and the five `--vp-shadow-*`, for light (`:root`) and dark (`.dark`). Import one after vpkit, or link it after your compiled stylesheet:

```css
@import "vpkit";
@import "vpkit/themes/nord.css";
```

A theme only sets variables, so the components and your utilities follow it.

- 24 are curated: `github`, `catppuccin`, `nord` and `rose-pine` are hand-tuned, 20 more are mapped by hand from their published palettes.
- 176 are mapped automatically from the Helix editor's palettes (`helix/`), with accents adjusted where the published colors fall short of WCAG AA.

`test/themes.mjs` holds every theme to the whole contract (every `--vp-c-*` the base references) in both modes, and to contrast minimums: body text 7:1, secondary text 4.5:1 on the page and on the soft surfaces, muted text 3:1, links 4.5:1, white button labels 3:1, each badge and alert color 4.5:1 on its own tint.

A theme sets `:root` and `.dark`, so one applies per page. To switch themes at runtime, scope copies of their rules under an attribute of your own, such as `[data-theme="nord"]`.

The generated themes come from `scripts/gen-themes.py` (Python 3.11+): edit its slot maps, run `python3 scripts/gen-themes.py`, then `npm test`. The four hand-tuned ones are edited directly.

## Code colors

`syntax.css` colors highlighted code with GitHub's light and dark code colors (Helix's `github_light` and `github_dark` themes), rustpress's defaults. It is an optional import. Declare the layer order before Tailwind, so its `syntax` layer is the lowest and any utility on a token still wins:

```css
@layer syntax, theme, base, components, utilities;
@import "tailwindcss" source(none);
@import "vpkit";
@import "vpkit/syntax.css";
```

Without that first line the `syntax` layer comes after Tailwind's, and its colors beat your utilities.

The classes come from a highlighter: `tk-` plus the tree-sitter capture name with dots turned into dashes (`<span class="tk-keyword-control-return">`), and `ansi-*` for terminal output: `ansi-bold`, `ansi-dim`, `ansi-italic`, `ansi-underline`, `ansi-fg-default`, `ansi-fg-<color>` and `ansi-fg-bright-<color>` for the eight ANSI colors. rustpress's highlighter emits them. Below its header comment the file is rustpress's default output byte for byte, and a rustpress test keeps the two equal; rustpress generates the same rules from any other Helix theme pair. Code colors are separate from the color themes.

## Fonts

`fonts.css` refers to the files as `url("fonts/…")`, relative to the compiled stylesheet: the Tailwind CLI leaves these URLs as written. Serve this package's `fonts/` directory next to your built CSS.

## Components

VitePress's components as CSS classes, one optional import each, so a site ships only the ones it uses:

```css
@import "vpkit/button.css";
@import "vpkit/badge.css";
@import "vpkit/alert.css";
@import "vpkit/table.css";
@import "vpkit/card.css";
@import "vpkit/input.css";
```

They sit in Tailwind's `components` layer, so a utility on the same element always wins: `class="vp-btn px-8"` gets the wider padding. A modifier works only together with its base class.

Their hover styles are written with `@variant hover`, so they behave like Tailwind's `hover:`: they apply only on a device that can hover (`@media (hover: hover)`, or however your project defines the `hover` variant). VitePress's apply on touch screens too, where a tapped button or card keeps its hover look until the next tap.

### Button

VitePress's `VPButton`.

```html
<a class="vp-btn vp-btn-brand" href="/guide">Get Started</a>
<button class="vp-btn">Cancel</button>
```

- `vp-btn` alone: the medium size, alt (gray) theme.
- `vp-btn-brand`, `vp-btn-sponsor`: the other two themes.
- `vp-btn-big`: the big size.

Two additions VitePress's button doesn't have: it is `inline-flex`, so an icon and its label sit centered side by side 0.5rem apart, and a `disabled` button is dimmed to half opacity with a not-allowed cursor.

```html
<button class="vp-btn vp-btn-big"><svg>…</svg>Sign in with Google</button>
```

Use it on `<a href>` or `<button>`, as VitePress does: those elements supply the pointer cursor, the class doesn't.

### Badge

VitePress's `VPBadge`.

```html
<h2>Search <span class="vp-badge vp-badge-tip">new</span></h2>
```

- `vp-badge` alone: the info type (gray).
- `vp-badge-note`, `vp-badge-tip`, `vp-badge-important`, `vp-badge-caution`, `vp-badge-warning`, `vp-badge-danger`: the other types.
- `vp-badge-success`: vpkit's addition (VitePress has no success badge), built the way VitePress builds the others: success text on the soft success tint.
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

### Table

VitePress's markdown tables.

```html
<table class="vp-table">
  <thead><tr><th>Plan</th><th>Price</th></tr></thead>
  <tbody><tr><td>Pro</td><td>$9</td></tr></tbody>
</table>
```

The table scrolls sideways on its own rather than squeezing its columns, and every second row is banded. It keeps VitePress's 1.25rem vertical margin; `my-0` removes it.

### Card

VitePress's `VPFeature`, the home page's feature boxes.

```html
<a class="vp-card" href="/guide">
  <h2 class="vp-card-title">Fast</h2>
  <p class="vp-card-details">Instant server start.</p>
</a>
```

- `vp-card`: the soft surface with 1.5rem padding, a flex column filling its container's height. As a link (`<a class="vp-card">`) its border turns brand on hover.
- `vp-card-title`, `vp-card-details`: the bold title and the secondary text under it, which takes the free height.

Not included: the feature icon.

### Input

VitePress defines input variables (`--vp-input-border-color`, `--vp-input-bg-color`) but no input component. This is totality's input, built on those variables.

```html
<input class="vp-input w-full" placeholder="Coupon code">
<input class="vp-input" aria-invalid="true">
```

- 44px tall with 16px text (iOS zooms into anything smaller), the input border on the input background, a brand border on hover and focus.
- Focus draws a 2px brand ring as a box-shadow, since `base.css` removes focus outlines.
- `aria-invalid="true"` turns the border danger and `"false"` success, even on hover and focus.
- The width is yours: add `w-full` or any width utility.

## Layout

VitePress's page layout as classes, for a docs theme (vpkit's Zola theme is built on them). Unlike the components above, these keep VitePress's markup: build it from VitePress's templates (`src/client/theme-default`) and rename the classes:

- a component's root class becomes its block, in kebab case: `VPContent` → `vp-content`, `VPNavBar` → `vp-nav-bar`; `VPDoc` → `vp-doc-page`, since `vp-doc` is the class of the markdown inside it
- a class its CSS sets together with the root becomes a modifier: `.VPContent.has-sidebar` → `vp-content--has-sidebar`
- any other class of its own becomes a part: VPDoc's `.aside` → `vp-doc-page__aside`
- global classes keep their names: `vp-doc`, `visually-hidden`, the `vpi-*` icons

BEM separators, because VitePress names child components after their parent's parts (VPNavBar's `.title` holds VPNavBarTitle, `vp-nav-bar-title`).

```css
@import "vpkit/icons.css";   /* the vpi-* icons */
@import "vpkit/layout.css";  /* the page skeleton */
@import "vpkit/content.css"; /* the markdown */
```

- `icons.css`: VitePress's icons, `<span class="vpi-search"></span>`, a 1em mask over the text color. They are Lucide's (ISC, `LICENSE-Lucide`).
- `layout.css`: `vp-layout`, `vp-content`, `vp-doc-page`, `vp-skip-link`, `vp-backdrop`, and the `visually-hidden` helper.
- `content.css`: the markdown inside `<div class="vp-doc">`, VitePress's own styles for it with its own class names: headings with `.header-anchor` links, `.custom-block` containers and GitHub alerts, `div[class*='language-']` code blocks (copy button, language label, highlighted, diff and focused lines, line numbers), `.vp-code-group` tabs.

Compile these unminified: Tailwind's `--minify` rounds numbers to six digits, and VitePress's `line-height: 1.3333333` as `1.33333` makes each `h2` 1/64px shorter.

The layout files are written by `scripts/vitepress-port.mjs` from VitePress's component styles, with the declarations unchanged; `node scripts/vitepress-port.mjs --write` rewrites them after a re-sync, and the tests fail if a file is not its output.

## Tests

```sh
npm install
npm test
```

`test/themes.mjs` checks every color theme against the contract and the contrast minimums above (ported from rustpress's tests, check for check).

Each component is rendered next to the VitePress original in headless Chromium and their computed styles compared, in light and dark mode and with `:hover`/`:active` forced. On an emulated touch screen, each component with `:hover` forced must look as it does at rest. vpkit is compiled minified, as it ships; lengths match within 1/32 px because the minifier shortens numbers like `2.7142857` to `2.71429`. The originals in `test/upstream/` are verbatim copies from the tag in `test/upstream/SOURCE`. A component without a VitePress original is compared with the app recipe it was taken from (`test/recipes.mjs`). Intentional differences are listed, with their reasons, in `known` in `test/cases.mjs`; an entry that stops matching fails the run.

`test/layout.mjs` takes each layout component from pages VitePress rendered (`test/upstream/pages`), alone: its own elements, child components reduced to their roots. It renders that markup with VitePress's styles and with vpkit's renamed classes, and compares every element's computed style, pseudo-elements and box at widths around each breakpoint, and in dark mode. The markdown is compared whole: the `.vp-doc` of VitePress's markdown guide, without the output of plugins vpkit does not style (code block titles, MathJax). vpkit is compiled unminified here, as a docs theme ships it, and lengths match within 1/32px, the rounding of layout.

## License

MIT (`LICENSE`). The CSS variables and the Inter font files are ported from [VitePress](https://github.com/vuejs/vitepress), and `test/upstream/` holds verbatim copies of its files: VitePress is MIT too (`LICENSE-VitePress`). Inter itself is licensed under the SIL Open Font License 1.1 (`LICENSE-Inter`). The icons in `icons.css` are Lucide's, under the ISC license (`LICENSE-Lucide`). The Helix palettes in `helix/`, which the color themes are generated from, are copies from the [Helix editor](https://github.com/helix-editor/helix) under the Mozilla Public License 2.0 (`helix/LICENSE`; where they come from: `helix/SOURCE`).
