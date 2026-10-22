# vpkit

VitePress's look for applications: a [Tailwind CSS v4](https://tailwindcss.com) theme on a 34-color contract, components in VitePress's look as CSS classes (`vp-btn`, `vp-input`, `vp-dialog`, …), a Rust crate that writes their markup and carries the stylesheets, 222 color themes, and VitePress's docs layout as a product of its own.

It is plain CSS for Tailwind to compile. There is no build step: vpkit's own `npm install` is only for its tests and its generators.

## Use

An app that renders its pages in Rust with [hypertext](https://crates.io/crates/hypertext) takes the crate, at a commit, and gets the CSS from it, so one pin covers the markup and the stylesheets:

```toml
[dependencies]
vpkit = { git = "https://github.com/at-least/vpkit", rev = "<sha>", features = ["css"] }
```

Before the Tailwind build, write the stylesheets out of the crate at that commit (its `css` feature: the dependency's `vpkit-css` binary, built from the locked commit in a target directory of its own, so another rev's build elsewhere cannot replace it before it runs; or `vpkit::css::write` from a binary of your own):

```sh
cargo build -p vpkit --bin vpkit-css --target-dir target/vpkit-css
target/vpkit-css/debug/vpkit-css target/vpkit
```

Anything else takes the CSS from npm, pinned to a commit with `#<sha>` after the name:

```sh
npm install --save-dev github:at-least/vpkit
```

Then import it from your Tailwind entry stylesheet, after Tailwind itself, with the components you use, one file each:

```css
@import "tailwindcss" source(none);
@source "../src";                            /* wherever your class strings live */
@import "../target/vpkit/fonts.css";         /* optional: the Inter webfonts */
@import "../target/vpkit/index.css";
@import "../target/vpkit/components/button/button.css";
@import "../target/vpkit/prose.css";         /* optional: the markdown */
```

`@source` stays in your stylesheet: Tailwind resolves it relative to the file it is written in. `fonts.css` refers to the files as `url("fonts/…")`, relative to the compiled stylesheet: copy this repository's `fonts/` directory next to your built CSS. `base.css` paints the page as VitePress does and draws the one focus ring; put `class="dark"` on `<html>` for dark mode: every color is a `light-dark()` pair the page's color scheme picks (Chrome 123, Safari 17.5, Firefox 120). A color theme is one more import after `index.css` (`themes/nord.css`); without one the page is VitePress's palette with its contrast shortfalls fitted.

### The crate

`rust/` is the crate `vpkit`: hypertext components for the markup that is more than one class (`AppearanceSwitch`, `Chip`, `Dialog`, `Empty`, `Field`, `Hint`, `Pager`, `Tabs`), Lucide's icons as inline SVG (`vpkit::icon`), and, with the `css` feature, every stylesheet embedded (`vpkit::css`). Its documentation, every component's fields with examples its tests run, is at <https://at-least.github.io/vpkit/rust/vpkit/>; the site's [Rust](docs/content/guide/rust.md) page lists what it has.

### The docs theme

`docs-theme/` is VitePress's docs layout, verbatim, with its classes renamed: `layout.css`, `vars.css` (VitePress's variables and palette over the kit's contract) and `icons.css`, with the team page's, the sponsors' and the Carbon ads' components. [vpkit-zola](https://github.com/at-least/vpkit-zola), the Zola theme the documentation is built with, is built on it.

## Documentation

The documentation is at <https://at-least.github.io/vpkit/>: a site in `docs/`, built with vpkit-zola, with live examples of every component and a gallery of the color themes. `cd docs && zola serve` serves it locally ([docs/README.md](docs/README.md)). Its pages:

- Guide: [What is vpkit?](docs/content/guide/what-is-vpkit.md), [Getting Started](docs/content/guide/getting-started.md) (installation, the entry, the page, the parts one by one, the components, the markdown, the icons, the fonts, a color theme, the docs theme), [Utilities and Variables](docs/content/guide/utilities.md) (dark mode, the breakpoints, the semantic names, the contract and the other `--vp-*` variables, the global rules), [Rust](docs/content/guide/rust.md) (the crate: the stylesheets, the icons, the components).
- [Components](docs/content/components/_index.md): a page for each of the app kit's 45 and the docs theme's 9, each with its import and live examples.
- [Themes](docs/content/themes.md): every color theme, to try on the page; what a theme sets, where they come from, your own colors, switching at runtime.

The library's design is [DESIGN.md](DESIGN.md): the two products, the rules every component follows, the token contract, how a component is proven, the catalogue, the crate, and the decisions behind them.

## Tests

```sh
npm install
npm test
```

`npm test` holds every color theme to its contract and contrast minimums, the docs theme's variables and the breakpoints to VitePress's `vars.css`, `fonts.css` and media queries, the semantic utilities to their variables, each component to its proof (VitePress's original, another rendering of vpkit, or its golden values), the states forced colors must keep, the reduced-motion rule, the docs theme's layout and the markdown against pages VitePress rendered, the Rust crate (format, clippy, tests, documentation), and the documentation's generated files and its site: [test/README.md](test/README.md) has what each test checks. The documentation's test needs [zola](https://www.getzola.org) and vpkit-zola as a sibling checkout (`../vpkit-zola`); the crate's a Rust toolchain.

The generated files, and what writes them:

- the color themes, all but the four hand-tuned ones (`github`, `catppuccin`, `nord`, `rose-pine`, edited directly): `node scripts/gen-themes.mjs`, from its slot maps and `helix/` (its TOML parser, `smol-toml`, comes with `npm install`); tokens.css's colors, VitePress's palette with its contrast shortfalls fitted: `node scripts/fit-stock.mjs`, from `test/upstream/vars.css`; `npm test` fails while tokens.css is not fit-stock.mjs's output, and the themes are what gen-themes.mjs last wrote (no test reruns it). The color math the two share with `test/themes.mjs` is `scripts/color.mjs`, the CSS reader `scripts/css.mjs`, and the contract's names against VitePress's `scripts/contract.mjs`.
- `prose.css`, `fonts.css`, `docs-theme/layout.css`, `docs-theme/vars.css` and `docs-theme/icons.css`: `node scripts/vitepress-port.mjs --write`, from VitePress's sources after a re-sync; the tests fail if a file is not its output.
- a component's `golden.json`: `UPDATE_GOLDEN=1 node test/components.mjs`, after a deliberate change to what the component paints.
- `docs/examples/` (all but `pages/`, the guide pages' own), `docs/static/example.css`, `docs/static/example-docs-theme.css` and `docs/static/themes.json`: `node scripts/build-docs.mjs`, after changing an example or a theme; `npm test` fails while they are stale.

## License

MIT (`LICENSE`). The CSS variables, the docs theme and the Inter font files are ported from [VitePress](https://github.com/vuejs/vitepress), and `test/upstream/` holds verbatim copies of its files: VitePress is MIT too (`LICENSE-VitePress`). Inter itself is licensed under the SIL Open Font License 1.1 (`LICENSE-Inter`). The icons, in `rust/src/icon.rs` and `docs-theme/icons.css`, are Lucide's, under the ISC license (`LICENSE-Lucide`). The Helix palettes in `helix/`, which the color themes are generated from, are copies from the [Helix editor](https://github.com/helix-editor/helix) under the Mozilla Public License 2.0 (`helix/LICENSE`; where they come from: `helix/SOURCE`).
