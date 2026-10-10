/* vpkit's documentation: what each example frame runs
 * (templates/vp-example.html). The frame is a page of its own, as an app's
 * is, inside a page of the documentation. It takes that page's appearance,
 * .dark on <html>, before it first paints and whenever the switch changes
 * it, and the color theme the page has linked (the site's own, or the theme
 * gallery's pick, static/theme-gallery.js); and it is as tall as its
 * content, so it never scrolls. A srcdoc frame shares the page's origin,
 * which lets it read the page and size its own element there. */
const page = parent.document.documentElement;
const root = document.documentElement;
const appearance = () => root.classList.toggle('dark', page.classList.contains('dark'));
appearance();
new MutationObserver(appearance).observe(page, { attributeFilter: ['class'] });

// the page's theme links, as the frame's own. This script runs while the
// frame's head is parsed, so the first copies are written into it there and
// the frame waits for them before it first paints, as the page does for
// its own. Later, when the page's links change (a pick, the stock card, a
// pick's stylesheet gone), the new copies go in first and the old ones go
// once they have loaded, so the frame never shows the stock colors in
// between; a head change that leaves the links as they are (the page's own
// scripts add and remove a <style> there) changes nothing here.
const links = (doc) => [...doc.querySelectorAll('head > link[data-theme]')];
const hrefs = (doc) => links(doc).map((link) => link.href).join('\n');
for (const link of links(parent.document)) document.write(`<link rel="stylesheet" href="${link.href}" data-theme="${link.dataset.theme}">`);
const theme = () => {
  if (hrefs(parent.document) === hrefs(document)) return;
  const old = links(document);
  const fresh = links(parent.document).map((link) => {
    const copy = document.createElement('link');
    copy.rel = 'stylesheet';
    copy.href = link.href;
    copy.dataset.theme = link.dataset.theme;
    return copy;
  });
  let pending = fresh.length;
  const settled = () => {
    if (--pending <= 0) for (const link of old) link.remove();
  };
  if (!pending) settled();
  for (const copy of fresh) {
    copy.addEventListener('load', settled, { once: true });
    copy.addEventListener('error', settled, { once: true });
    document.head.append(copy);
  }
};
new MutationObserver(theme).observe(parent.document.head, { childList: true, subtree: true, attributeFilter: ['href'] });
new ResizeObserver(() => {
  frameElement.style.height = `${Math.ceil(root.getBoundingClientRect().height)}px`;
}).observe(root);
