/* vpkit's documentation, in every page's <head> (config.toml's head), right
 * after the site's own color theme, a static link to themes/vitepress.css
 * (VitePress's own colors, their contrast fitted): the theme the gallery
 * (static/theme-gallery.js) stored for this browser session replaces it,
 * a theme's name for its stylesheet, the stock card's empty name for no
 * theme. The link is written into the head as the parser reads it, so the
 * page waits for it as for its own stylesheet and first paints in the
 * theme; a link the DOM adds would let the page paint first in the site's
 * theme. data-theme carries the name as the gallery compares it; only the
 * URL is encoded (`penumbra+` is a theme). A pick whose stylesheet no
 * longer exists (a theme renamed since the session began) is forgotten,
 * and the same link re-fetches the site's theme. No pick, or a browser
 * that denies storage: the static link stays. */
{
  const KEY = 'vpkit-docs-theme';
  const SITE = 'vitepress';
  const href = (theme) => new URL(`themes/${encodeURIComponent(theme)}.css`, document.currentScript.src).href;
  let pick = null;
  try {
    pick = sessionStorage.getItem(KEY);
  } catch {}
  // the stock card's pick as the site stored it before 2026-10-11, in a
  // session that spans that deploy
  if (pick === 'stock') {
    pick = '';
    try {
      sessionStorage.setItem(KEY, pick);
    } catch {}
  }
  if (pick !== null) {
    document.head.querySelector('link[data-theme]')?.remove();
    if (pick) {
      // the written link is parsed after this script ends, so its error
      // handler goes in as an attribute
      const onerror = ` onerror="try{sessionStorage.removeItem('${KEY}')}catch{};this.dataset.theme='${SITE}';this.href='${href(SITE)}'"`;
      document.write(`<link rel="stylesheet" href="${href(pick)}" data-theme="${pick}"${onerror}>`);
    }
  }
}
