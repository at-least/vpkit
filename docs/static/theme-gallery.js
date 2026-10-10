/* vpkit's documentation: the theme gallery (templates/vp-theme-gallery.html,
 * on content/themes.md). A card for each color theme of static/themes.json
 * (scripts/build-docs.mjs), drawn as a miniature page in the theme's own
 * colors, light and dark side by side. Picking one links the theme's
 * stylesheet after the page's own, as a site that imports it does, and the
 * page takes it; static/example.js links it in the example frames too. The
 * pick is kept for the browser session, and static/theme-pick.js links it
 * in every page the session opens; the stock card takes it back. */
const host = document.getElementById('theme-gallery');
const themes = await (await fetch(host.dataset.themes)).json();

const style = document.createElement('style');
style.textContent = `
.theme-gallery__filter {
  display: block;
  width: 100%;
  max-width: 16rem;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-alt);
  font-size: 14px;
}
.theme-gallery__filter:focus { border-color: var(--vp-c-brand-1); outline: none; }
.theme-gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: 12px;
  margin-top: 16px;
}
.theme-gallery__card {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0;
  text-align: start;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg);
  transition: border-color 0.25s;
}
@media (hover: hover) {
  .theme-gallery__card:hover { border-color: var(--vp-c-brand-1); }
}
.theme-gallery__card:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.theme-gallery__card[aria-pressed="true"] { border-color: var(--vp-c-brand-1); box-shadow: 0 0 0 1px var(--vp-c-brand-1); }
.theme-gallery__preview { display: grid; grid-template-columns: 1fr 1fr; }
.theme-gallery__half { display: flex; flex-direction: column; gap: 4px; padding: 8px; background-color: var(--bg); }
.theme-gallery__half > span { display: block; border-radius: 2px; }
.theme-gallery__bar { height: 8px; margin-bottom: 4px; border: 1px solid var(--divider); background-color: var(--bg-alt); }
.theme-gallery__heading { width: 60%; height: 6px; background-color: var(--text-1); }
.theme-gallery__text { width: 85%; height: 4px; background-color: var(--text-2); }
.theme-gallery__link { width: 45%; height: 4px; background-color: var(--brand-1); }
.theme-gallery__half > .theme-gallery__dots { display: flex; gap: 3px; margin-top: 2px; }
.theme-gallery__dots > span { width: 6px; height: 6px; border-radius: 50%; }
.theme-gallery__dots > :nth-child(1) { background-color: var(--success-1); }
.theme-gallery__dots > :nth-child(2) { background-color: var(--warning-1); }
.theme-gallery__dots > :nth-child(3) { background-color: var(--danger-1); }
.theme-gallery__name { display: block; padding: 8px 12px 0; font-size: 14px; font-weight: 600; }
.theme-gallery__about {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin: 2px 12px 10px;
  font-size: 12px;
  line-height: 18px;
  color: var(--vp-c-text-2);
}
`;
document.head.append(style);

// one mode of a theme: a navbar, a heading, a line of text, a link, and the
// success, warning and danger colors
function half(colors, mode) {
  const el = document.createElement('span');
  el.className = 'theme-gallery__half';
  el.title = mode;
  for (const [name, color] of Object.entries(colors)) el.style.setProperty(`--${name}`, color);
  el.innerHTML =
    '<span class="theme-gallery__bar"></span><span class="theme-gallery__heading"></span>' +
    '<span class="theme-gallery__text"></span><span class="theme-gallery__link"></span>' +
    '<span class="theme-gallery__dots"><span></span><span></span><span></span></span>';
  return el;
}

// the session's pick, which static/theme-pick.js has linked
const KEY = 'vpkit-docs-theme';
let link = document.head.querySelector('link[data-theme]');
const current = link?.dataset.theme ?? '';

function card(theme) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'theme-gallery__card';
  el.dataset.theme = theme.name;
  el.setAttribute('aria-pressed', String(theme.name === current));
  const preview = document.createElement('span');
  preview.className = 'theme-gallery__preview';
  preview.append(half(theme.light, 'light'), half(theme.dark, 'dark'));
  const name = document.createElement('span');
  name.className = 'theme-gallery__name';
  name.textContent = theme.name || 'stock';
  const about = document.createElement('span');
  about.className = 'theme-gallery__about';
  about.textContent = theme.about;
  el.append(preview, name, about);
  el.addEventListener('click', () => pick(theme.name));
  return el;
}

function pick(name) {
  const old = link;
  link = null;
  if (name) {
    sessionStorage.setItem(KEY, name);
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${host.dataset.stylesheets}${name}.css`;
    link.dataset.theme = name;
    // the old theme stays until the new one has loaded, so the page doesn't flash the stock colors
    if (old) link.addEventListener('load', () => old.remove(), { once: true });
    document.head.append(link);
  } else {
    sessionStorage.removeItem(KEY);
    old?.remove();
  }
  for (const c of cards) c.setAttribute('aria-pressed', String(c.dataset.theme === name));
}

const filter = document.createElement('input');
filter.type = 'search';
filter.className = 'theme-gallery__filter';
filter.placeholder = 'Filter by name';
filter.setAttribute('aria-label', 'Filter the themes by name');
const grid = document.createElement('div');
grid.className = 'theme-gallery__grid';
grid.setAttribute('role', 'group');
grid.setAttribute('aria-label', 'Color themes');
// stock, then the curated themes, then the ones mapped from Helix's palettes
const order = ['stock', 'curated', 'helix'];
const cards = themes.toSorted((a, b) => order.indexOf(a.source) - order.indexOf(b.source)).map(card);
grid.append(...cards);
filter.addEventListener('input', () => {
  const q = filter.value.trim().toLowerCase();
  for (const c of cards) c.hidden = !(c.dataset.theme || 'stock').includes(q);
});
host.append(filter, grid);
