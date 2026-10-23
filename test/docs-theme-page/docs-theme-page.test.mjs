// The app kit's components under the docs theme's stylesheets, which a
// docs site loads with them (vars.css, icons.css): vpkit's own, so golden.
// vp-icon, the app kit's inline-SVG icon, takes no mask: VitePress's
// icons.css masks its own .vp-icon, which the port leaves out.

export const cases = [];

cases.push({
  name: 'docs theme page vp-icon',
  html: '<span class="vp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg></span>',
  checks: [{ target: '.vp-icon', props: ['mask-image', 'background-color', 'width'] }],
});
