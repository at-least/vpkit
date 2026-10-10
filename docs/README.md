# vpkit's documentation

vpkit's documentation, as a site built with [vpkit-zola](https://github.com/at-least/vpkit-zola), the Zola theme on vpkit's layout: the guide (what vpkit is, getting started, the utilities and variables, theming, the docs layout, the tests) and a page for each component, with live examples. The pages are under `content/`.

From the repository's root:

```sh
git clone https://github.com/at-least/vpkit-zola ../vpkit-zola   # the theme, beside this repository
cd docs && zola serve
```

`themes/vpkit-zola` links to `../vpkit-zola`, so the site is drawn by the theme as it is there, with its prebuilt stylesheet. The examples are this repository's vpkit.

An example is markup in a `vp_example` block (`templates/vp-example.html`), shown in a frame of its own over the same markup as code. The frame is a page as an app's is, untouched by the markdown's styles, and it follows the site's appearance switch (`static/example.js`). It loads `static/example.css`: vpkit with every component and the utilities the examples use, built from `css/example.css` by `node scripts/build-docs.mjs`. Run that after changing an example; `npm test` fails while the stylesheet is stale, and checks the site with `test/docs.mjs`.
