/* vpkit's documentation, in every page's <head> (config.toml's head): the
 * color theme this browser session is on, linked after the page's own
 * stylesheet. The site is on `vitepress` (VitePress's own colors, their
 * contrast fitted) until the theme gallery (static/theme-gallery.js) picks
 * another, or its stock card, which stores `stock` and links no theme. The
 * link is written into the head as the parser reads it, so the page waits
 * for it as for its own stylesheet and first paints in the theme; a link the
 * DOM adds would let the page paint first in the stock colors. */
{
  const theme = sessionStorage.getItem('vpkit-docs-theme') || 'vitepress';
  if (theme !== 'stock') {
    const name = encodeURIComponent(theme);
    const href = new URL(`themes/${name}.css`, document.currentScript.src).href;
    document.write(`<link rel="stylesheet" href="${href}" data-theme="${name}">`);
  }
}
