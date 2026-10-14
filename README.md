# vpkit

The VitePress default-theme look as a [Tailwind CSS v4](https://tailwindcss.com) theme: the `--vp-*` theme variables, semantic utilities that resolve to them, VitePress's breakpoints, class-based dark mode and the Inter webfonts, plus VitePress's components as CSS classes (`vp-btn`, …) and 223 color themes.

It is plain CSS for Tailwind to compile. There is no build step; `npm install` is only needed to run its tests and its theme generators.

## Use

Add it as a dependency (here from a sibling checkout):

```sh
npm install --save-dev ../vpkit
```

Then import it from your Tailwind entry stylesheet, after Tailwind itself, with the components you use, one file each:

```css
@import "tailwindcss" source(none);
@source "../src";             /* wherever your class strings live */
@import "vpkit/fonts.css";  /* optional: the Inter webfonts */
@import "vpkit";
@import "vpkit/button.css";
```

`@source` stays in your stylesheet: Tailwind resolves it relative to the file it is written in. `fonts.css` refers to the files as `url("fonts/…")`, relative to the compiled stylesheet: serve this package's `fonts/` directory next to your built CSS. `base.css` paints the page as VitePress does; put `class="dark"` on `<html>` for dark mode. A color theme is one more import after vpkit (`@import "vpkit/themes/nord.css"`); `vpkit/themes/vitepress.css` is VitePress's own palette with its contrast shortfalls fitted, which the apps built on vpkit and the documentation site import.

## Documentation

The documentation is at <https://at-least.github.io/vpkit/>: a site in `docs/`, built with [vpkit-zola](https://github.com/at-least/vpkit-zola), with live examples of every component and a gallery of the color themes. `cd docs && zola serve` serves it locally ([docs/README.md](docs/README.md)). Its pages:

- Guide: [What is vpkit?](docs/content/guide/what-is-vpkit.md), [Getting Started](docs/content/guide/getting-started.md) (the parts one by one, the fonts), [Utilities and Variables](docs/content/guide/utilities.md) (dark mode, the breakpoints, the semantic colors, the `--vp-*` variables, the global rules), [Theming](docs/content/guide/theming.md) (the color themes, what the tests hold them to, how they are generated), [Docs Layout](docs/content/guide/layout.md) (`layout.css`, `content.css`, `icons.css` and their class names), [Tests](docs/content/guide/tests.md).
- [Components](docs/content/components/_index.md): [Button](docs/content/components/button.md), [Icon Button](docs/content/components/icon-btn.md), [Link](docs/content/components/link.md), [Input](docs/content/components/input.md), [Field](docs/content/components/field.md), [Toggle](docs/content/components/toggle.md), [Choice](docs/content/components/choice.md), [Badge](docs/content/components/badge.md), [Code](docs/content/components/code.md), [Key](docs/content/components/kbd.md), [Highlight](docs/content/components/mark.md), [Alert](docs/content/components/alert.md), [Card](docs/content/components/card.md), [Table](docs/content/components/table.md), [Dropdown](docs/content/components/dropdown.md), [Tabs](docs/content/components/tabs.md), [Dialog](docs/content/components/dialog.md), [Toast](docs/content/components/toast.md), [Spinner](docs/content/components/spinner.md), [Progress](docs/content/components/progress.md), [Skip Link](docs/content/components/skip.md), [Nav Link](docs/content/components/nav-link.md), [Top Bar](docs/content/components/topbar.md), [Hamburger](docs/content/components/hamburger.md), [Empty State](docs/content/components/empty.md), [Divider](docs/content/components/divider.md), [Avatar](docs/content/components/avatar.md), [Breadcrumb](docs/content/components/breadcrumb.md).
- [Themes](docs/content/themes.md): every color theme, to try on the page.

The library's design is [DESIGN.md](DESIGN.md): the rules every component follows, how one is proven against its original, when a new one is built, what stays a utility, and where the apps built on vpkit stand on them.

## Tests

```sh
npm install
npm test
```

`npm test` holds every color theme to its contract and contrast minimums, holds `tokens.css` and the breakpoints to VitePress's `vars.css`, `fonts.css` and media queries, renders each component and the layout next to VitePress's originals in headless Chromium and compares their computed styles, and builds the documentation and checks its examples and its theme gallery: [Tests](docs/content/guide/tests.md) has what each test checks. The documentation's test needs [zola](https://www.getzola.org) and vpkit-zola as a sibling checkout (`../vpkit-zola`).

The generated files, and what writes them:

- the color themes, all but the four hand-tuned ones (`github`, `catppuccin`, `nord`, `rose-pine`, edited directly): `node scripts/gen-themes.mjs`, from its slot maps and `helix/` (its TOML parser, `smol-toml`, comes with `npm install`); `themes/vitepress.css`, VitePress's own palette with its contrast shortfalls fitted: `node scripts/fit-vitepress.mjs`, from `tokens.css`; `npm test` fails while it is not that script's output. The color math the two share with `test/themes.mjs` is `scripts/color.mjs`, and the CSS reader the fitter, `scripts/build-docs.mjs` and that test share is `scripts/css.mjs`.
- `layout.css` and `content.css`: `node scripts/vitepress-port.mjs --write`, from VitePress's component styles after a re-sync; the tests fail if a file is not its output.
- `docs/static/example.css` and `docs/static/themes.json`: `node scripts/build-docs.mjs`, after changing an example or a theme; `npm test` fails while they are stale.

## License

MIT (`LICENSE`). The CSS variables and the Inter font files are ported from [VitePress](https://github.com/vuejs/vitepress), and `test/upstream/` holds verbatim copies of its files: VitePress is MIT too (`LICENSE-VitePress`). Inter itself is licensed under the SIL Open Font License 1.1 (`LICENSE-Inter`). The icons in `icons.css` are Lucide's, under the ISC license (`LICENSE-Lucide`). The Helix palettes in `helix/`, which the color themes are generated from, are copies from the [Helix editor](https://github.com/helix-editor/helix) under the Mozilla Public License 2.0 (`helix/LICENSE`; where they come from: `helix/SOURCE`).
