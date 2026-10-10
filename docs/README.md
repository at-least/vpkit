# vpkit's documentation

vpkit's documentation, as a site built with [vpkit-zola](https://github.com/at-least/vpkit-zola), the Zola theme on vpkit's layout: the guide (what vpkit is, getting started, the utilities and variables, theming, the docs layout, the tests), a page for each component, with live examples, and the theme gallery. The pages are under `content/`.

From the repository's root:

```sh
git clone https://github.com/at-least/vpkit-zola ../vpkit-zola   # the theme, beside this repository
cd docs && zola serve
```

`themes/vpkit-zola` links to `../vpkit-zola`, so the site is drawn by the theme as it is there, with its prebuilt stylesheet. The examples are this repository's vpkit.

An example is markup in a `vp_example` block (`templates/vp-example.html`), shown in a frame of its own over the same markup as code. The frame is a page as an app's is, untouched by the markdown's styles, and it follows the site's appearance switch (`static/example.js`). It loads `static/example.css`: vpkit with every component and the utilities the examples use, built from `css/example.css` by `node scripts/build-docs.mjs`. Run that after changing an example; `npm test` fails while the stylesheet is stale, and checks the site with `test/docs.mjs`.

The theme gallery (`content/themes.md`) draws a card for each color theme from `static/themes.json`, which `node scripts/build-docs.mjs` writes from `themes/` and `tokens.css` too, and the session's theme is linked from `static/themes/`, a link to the repository's `themes/`. The site's own theme is `vitepress`, VitePress's own colors with their contrast fitted: a static link in every page's head through vpkit-zola's `head` setting (`config.toml`), so it is there with JavaScript off and fetched beside the page's stylesheet. A pick (`static/theme-gallery.js`), a theme's name or the stock card's empty one, which links no theme, recolors the page and its examples and is kept for the browser session: `static/theme-pick.js`, right after that link, removes it and writes the pick's as the parser reads the head, so the page's first paint is already in the pick; a pick whose stylesheet no longer exists is forgotten and the site's theme takes over. The same setting gives the site its favicon.

The site is published at <https://at-least.github.io/vpkit/> by `.github/workflows/docs.yml`, on each push to `main`: it checks vpkit-zola out beside this repository, as here, and builds with zola alone.
