/* vpkit's documentation, in every page's <head> (config.toml's head): the
 * color theme the gallery (static/theme-gallery.js) stored for this browser
 * session is linked here, a theme's name for its stylesheet (static/themes/,
 * the repository's themes/, beside this script); no pick, or the stock
 * card's empty name, links nothing, and the page is on the docs theme's
 * colors, docs-theme/vars.css's: VitePress's palette as it is (the app
 * kit's example frames alone are on tokens.css's, the fitted one). The link is written into
 * the head as the parser reads it, so the page waits for it as for its own
 * stylesheet and first paints in the theme; a link the DOM adds would let
 * the page paint first in the stock colors. data-theme carries the name as
 * the gallery compares it; only the URL is encoded (`penumbra+` is a
 * theme). A pick whose stylesheet no longer exists (a theme renamed since
 * the session began, or a value an earlier deploy stored) is forgotten and
 * its link removed. A browser that denies storage: the stock colors. */
{
  const KEY = 'vpkit-docs-theme';
  let pick = null;
  try {
    pick = sessionStorage.getItem(KEY);
  } catch {}
  if (pick) {
    const href = new URL(`themes/${encodeURIComponent(pick)}.css`, document.currentScript.src).href;
    // the written link is parsed after this script ends; its error, which
    // does not bubble, reaches a capturing listener on the document: the
    // pick is forgotten and the link goes
    document.addEventListener('error', (e) => {
      if (e.target.dataset?.theme !== pick) return;
      sessionStorage.removeItem(KEY);
      e.target.remove();
    }, true);
    document.write(`<link rel="stylesheet" href="${href}" data-theme="${pick}">`);
  }
}
