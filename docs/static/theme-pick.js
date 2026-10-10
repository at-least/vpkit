/* vpkit's documentation, in every page's <head> (config.toml's head): the
 * color theme this browser session is on, linked after the page's own
 * stylesheet. The site is on `vitepress` (VitePress's own colors, their
 * contrast fitted) until the theme gallery (static/theme-gallery.js) stores
 * a pick: a theme's name, or the stock card's empty name, which links no
 * theme. The link is written into the head as the parser reads it, so the
 * page waits for it as for its own stylesheet and first paints in the
 * theme; a link the DOM adds would let the page paint first in the stock
 * colors. data-theme carries the name as the gallery compares it; only the
 * URL is encoded (`penumbra+` is a theme). */
{
  const theme = sessionStorage.getItem('vpkit-docs-theme') ?? 'vitepress';
  if (theme) {
    const href = new URL(`themes/${encodeURIComponent(theme)}.css`, document.currentScript.src).href;
    document.write(`<link rel="stylesheet" href="${href}" data-theme="${theme}">`);
  }
}
