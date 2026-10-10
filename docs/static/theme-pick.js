/* vpkit's documentation, in every page's <head> (config.toml's head): the
 * color theme this browser session is on, linked after the page's own
 * stylesheet. The site is on `vitepress` (VitePress's own colors, their
 * contrast fitted) until the theme gallery (static/theme-gallery.js) stores
 * a pick: a theme's name, or the stock card's empty name, which links no
 * theme. The link is written into the head as the parser reads it, so the
 * page waits for it as for its own stylesheet and first paints in the
 * theme; a link the DOM adds would let the page paint first in the stock
 * colors. data-theme carries the name as the gallery compares it; only the
 * URL is encoded (`penumbra+` is a theme). A pick whose stylesheet no
 * longer exists (a theme renamed since the session began) is forgotten,
 * and the page takes the default late rather than staying in no theme. */
{
  const KEY = 'vpkit-docs-theme';
  const DEFAULT = 'vitepress';
  const href = (theme) => new URL(`themes/${encodeURIComponent(theme)}.css`, document.currentScript.src).href;
  const theme = sessionStorage.getItem(KEY) ?? DEFAULT;
  if (theme) {
    // the written link is parsed after this script ends, so its error
    // handler goes in as an attribute: the pick is forgotten and the same
    // element re-fetches the default
    const onerror =
      theme === DEFAULT
        ? ''
        : ` onerror="sessionStorage.removeItem('${KEY}');this.dataset.theme='${DEFAULT}';this.href='${href(DEFAULT)}'"`;
    document.write(`<link rel="stylesheet" href="${href(theme)}" data-theme="${theme}"${onerror}>`);
  }
}
