# vpkit's documentation

vpkit's documentation, as a site built with [vpkit-zola](https://github.com/at-least/vpkit-zola), the Zola theme on vpkit's docs theme: the guide (what vpkit is, getting started, the utilities and variables, the Rust crate), a page for each component, with live examples, and the theme gallery. The pages are under `content/`.

From the repository's root:

```sh
git clone https://github.com/at-least/vpkit-zola ../vpkit-zola   # the theme, beside this repository
cd docs && zola serve
```

`themes/vpkit-zola` links to `../vpkit-zola`, so the site is drawn by the theme as it is there, with its prebuilt stylesheet. The examples are this repository's vpkit.

An example is a component's example file (`components/<name>/examples/<id>.html`, the markup the crate's tests render too, for its components), shown by the page's `vp_example` component (`templates/vp-example.html`) in a frame of its own over the same markup as code. zola reads files only inside the site, so `node scripts/build-docs.mjs` copies every example into `examples/` (a guide page's own examples live in `examples/pages/`), and builds the frames' stylesheets into `static/`: `example.css`, vpkit with every component and the utilities the examples use, and `example-docs-theme.css`, the docs theme's variables, icons and components over the kit, which an example with `kit="docs-theme"` loads. The frame is a page as an app's is, untouched by the markdown's styles, and it follows the site's appearance switch (`static/example.js`). Run the script after changing an example; `npm test` fails while the copies or the stylesheets are stale, and checks the site with `test/docs.mjs`.

The theme gallery (`content/themes.md`) draws a card for each color theme from `static/themes.json`, which the same script writes from `tokens.css` and `themes/`, and a pick is linked from `static/themes/`, a link to the repository's `themes/`. Without a pick the site is on the stock colors: the page and the docs theme's example frames on `docs-theme/vars.css`'s, VitePress's palette as it is, and the app kit's example frames on `tokens.css`'s, the fitted one. A pick (`static/theme-gallery.js`), a theme's name or the stock card's empty one, recolors the page and its examples and is kept for the browser session: `static/theme-pick.js`, in every page's head (`config.toml`), writes the pick's link as the parser reads the head, so the page's first paint is already in the pick; a pick whose stylesheet no longer exists is forgotten. The same setting gives the site its favicon.

The site is published at <https://at-least.github.io/vpkit/> by `.github/workflows/docs.yml`, nightly once `main` has moved since its last run, and whenever it is run by hand (`gh workflow run docs.yml`): it checks vpkit-zola out beside this repository, as here, and builds the site with zola and the crate's documentation, under `/rust/`, with `cargo doc`.
