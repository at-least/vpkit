/* vpkit's documentation, in every page's <head> (config.toml's head): the
 * color theme the gallery picked for this browser session
 * (static/theme-gallery.js), linked after the page's own stylesheet. It is
 * written into the head as the parser reads it, so the page waits for it as
 * for its own stylesheet and first paints in the theme; a link the DOM adds
 * would let the page paint first in the stock colors. */
{
  const theme = sessionStorage.getItem('vpkit-docs-theme');
  if (theme) {
    const name = encodeURIComponent(theme);
    const href = new URL(`themes/${name}.css`, document.currentScript.src).href;
    document.write(`<link rel="stylesheet" href="${href}" data-theme="${name}">`);
  }
}
