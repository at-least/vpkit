// The contract's names against VitePress's: what the stock fitter, the
// VitePress port and the component tests share.
//
// VitePress's vars.css names a color by a ramp step (-1, -2, -3, -soft);
// the contract names it by the job VitePress's stylesheets give that step:
// -1 is text, -2 a hovered link, -3 the brand button's ground, -soft the
// tint; the gray ramp's -3, -2 and -1 are the alt button's rest, hover and
// active grounds. tip and note are brand's; caution is its own (danger's
// colors in VitePress's stock).

// contract name → the VitePress name its stock value comes from
export const FROM = {
  bg: 'bg', 'bg-alt': 'bg-alt', 'bg-elv': 'bg-elv', 'bg-soft': 'bg-soft',
  'text-1': 'text-1', 'text-2': 'text-2', 'text-3': 'text-3',
  border: 'border', divider: 'divider', gutter: 'gutter',
  brand: 'brand-1', 'brand-hover': 'brand-2', 'brand-fill': 'brand-3', 'brand-fill-hover': 'brand-2', 'brand-fill-active': 'brand-1', 'brand-soft': 'brand-soft',
  'gray-fill': 'default-3', 'gray-fill-hover': 'default-2', 'gray-fill-active': 'default-1', 'gray-soft': 'default-soft',
  success: 'success-1', 'success-soft': 'success-soft',
  warning: 'warning-1', 'warning-hover': 'warning-2', 'warning-soft': 'warning-soft',
  danger: 'danger-1', 'danger-hover': 'danger-2', 'danger-soft': 'danger-soft',
  caution: 'caution-1', 'caution-hover': 'caution-2', 'caution-soft': 'caution-soft',
  important: 'important-1', 'important-hover': 'important-2', 'important-soft': 'important-soft',
};

// VitePress name → contract name, for every VitePress color name the
// contract has a job for (a name that reads the same is its own)
export const ALIAS = {
  brand: 'brand', 'brand-1': 'brand', 'brand-2': 'brand-hover', 'brand-3': 'brand-fill', 'brand-soft': 'brand-soft',
  'default-1': 'gray-fill-active', 'default-2': 'gray-fill-hover', 'default-3': 'gray-fill', 'default-soft': 'gray-soft',
  'tip-1': 'brand', 'tip-2': 'brand-hover', 'tip-3': 'brand-fill', 'tip-soft': 'brand-soft',
  'note-1': 'brand', 'note-2': 'brand-hover', 'note-3': 'brand-fill', 'note-soft': 'brand-soft',
  'success-1': 'success', 'success-soft': 'success-soft',
  'warning-1': 'warning', 'warning-2': 'warning-hover', 'warning-soft': 'warning-soft',
  'danger-1': 'danger', 'danger-2': 'danger-hover', 'danger-soft': 'danger-soft',
  'caution-1': 'caution', 'caution-2': 'caution-hover', 'caution-soft': 'caution-soft',
  'important-1': 'important', 'important-2': 'important-hover', 'important-soft': 'important-soft',
  ...Object.fromEntries(['bg', 'bg-alt', 'bg-elv', 'bg-soft', 'text-1', 'text-2', 'text-3', 'border', 'divider', 'gutter'].map((n) => [n, n])),
};

// VitePress's derived names the contract keeps as slots of their own: the
// brand button's hover and pressed grounds, which vars.css derives from
// brand-2 and brand-1 (a hovered link's color and the brand text), jobs
// one color cannot do in dark mode
export const DERIVED = { 'button-brand-hover-bg': 'brand-fill-hover', 'button-brand-active-bg': 'brand-fill-active' };

// VitePress names the contract has no slot for: a role's -3 and
// success-2, read by nothing in its stylesheets
export const UNMAPPED = ['success-2', 'success-3', 'important-3', 'warning-3', 'danger-3', 'caution-3'];

// a stylesheet's var(--vp-c-*) references on the contract's names
export const renameTokens = (css) => css.replace(/var\(--vp-c-([a-z0-9-]+)\)/g, (m, name) => (name in ALIAS ? `var(--vp-c-${ALIAS[name]})` : m));

// the VitePress variable each contract name stands in for, on the
// upstream side of a comparison on vpkit's palette
export const ONTO = Object.fromEntries(
  Object.entries(FROM).map(([name, from]) => [name, name === 'brand-fill-hover' ? 'button-brand-hover-bg' : name === 'brand-fill-active' ? 'button-brand-active-bg' : `c-${from}`]),
);
