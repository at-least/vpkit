/* vpkit's documentation: what each example frame runs
 * (templates/vp-example.html). The frame is a page of its own, as an app's
 * is, inside a page of the documentation. It takes that page's appearance,
 * .dark on <html>, before it first paints and whenever the switch changes
 * it, and it is as tall as its content, so it never scrolls. A srcdoc
 * frame shares the page's origin, which lets it read the page and size its
 * own element there. */
const page = parent.document.documentElement;
const root = document.documentElement;
const appearance = () => root.classList.toggle('dark', page.classList.contains('dark'));
appearance();
new MutationObserver(appearance).observe(page, { attributeFilter: ['class'] });
new ResizeObserver(() => {
  frameElement.style.height = `${Math.ceil(root.getBoundingClientRect().height)}px`;
}).observe(root);
