// Port VitePress's stylesheets: the docs theme's layout, variables and
// icons, the markdown, and the fonts' faces.
//
//   node scripts/vitepress-port.mjs --write        write the five files
//   node scripts/vitepress-port.mjs VPContent VPDoc …   print a component's port
//
// A layout component's <style> from test/upstream (verbatim copies of
// VitePress) has every class renamed by the scheme in test/layout-map.mjs,
// ready for @layer components; the markdown's stylesheets are verbatim but
// for VitePress's color names, read as the contract's (scripts/contract.mjs),
// with the variables they read defined on .vp-doc; the docs theme's
// variables are vars.css with its palette on the contract's names and its
// own names aliased onto them; the icons and the fonts' @font-face rules are
// verbatim. Rerun after re-syncing test/upstream; the tests fail while a
// file is not this script's output.
//
// Vue's scoping is gone in the port: `:deep(x)` and `:slotted(x)` are
// unwrapped, and a selector loses the [data-v-…] attribute Vue adds to its
// last compound, the same 0,1,0 for every rule of a component.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'lightningcss';

import { LAYOUT, blockOf, componentOfRoot, docsThemeBlock, isGlobal, rootOf } from '../test/layout-map.mjs';
import { ALIAS, DERIVED, FROM, renameTokens, contractLines } from './contract.mjs';
import { modeValues, parseBlocks, resolve } from './css.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// the component's style blocks; only scoped ones are its own
export function styleOf(component) {
  const src = readFileSync(join(ROOT, 'test/upstream', LAYOUT[component].file), 'utf8');
  // a component without a <style> (VPDocAsideSponsors) has no rules to port
  const blocks = [...src.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)];
  for (const [, attrs] of blocks) {
    if (!/\bscoped\b/.test(attrs)) throw new Error(`${component}: unscoped <style${attrs}> needs a decision`);
  }
  return blocks.map((b) => b[2]).join('\n');
}

// Vue's scoped selectors unwrapped, by text: `:deep(x)` (a child's
// element) and `:slotted(x)` (a slot's content, VPTeamPage's parts) → `x`.
// Lightning CSS keeps them as raw tokens, and a browser drops the rule
export const unscope = (css) => unwrap(unwrap(css, ':deep('), ':slotted(');

function unwrap(css, open) {
  let out = '';
  let rest = css;
  for (let at = rest.indexOf(open); at !== -1; at = rest.indexOf(open)) {
    let depth = 1;
    let end = at + open.length;
    for (; depth > 0; end++) {
      if (end >= rest.length) throw new Error(`unbalanced ${open}`);
      if (rest[end] === '(') depth++;
      else if (rest[end] === ')') depth--;
    }
    out += rest.slice(0, at) + rest.slice(at + open.length, end - 1);
    rest = rest.slice(end);
  }
  return out + rest;
}

const NESTED = new Set(['not', 'is', 'where', 'has']);

// call fn(compound) for every compound, nested selectors included
function eachCompound(selector, fn) {
  let compound = [];
  for (const c of selector) {
    if (c.type === 'combinator') {
      fn(compound);
      compound = [];
      continue;
    }
    compound.push(c);
    if (c.type === 'pseudo-class' && NESTED.has(c.kind)) {
      for (const s of c.selectors) eachCompound(s, fn);
    }
  }
  fn(compound);
}

// the classes of a compound, nested :not()/:is()/… arguments included
function classesOf(compound) {
  const names = [];
  for (const c of compound) {
    if (c.type === 'class') names.push(c.name);
    if (c.type === 'pseudo-class' && NESTED.has(c.kind)) {
      for (const s of c.selectors) for (const x of s) if (x.type === 'class') names.push(x.name);
    }
  }
  return names;
}

// the component's own class → vpkit's name for it; a class it reaches
// inside a child with :deep() takes the child's name for it
export function namer(component, states) {
  const root = rootOf(component);
  const block = blockOf(component);
  const deep = LAYOUT[component].deep ?? {};
  const modifiers = LAYOUT[component].modifiers ?? {};
  return (name) => {
    if (name === root) return block;
    if (isGlobal(name)) return name;
    if (modifiers[name]) return `${block}--${modifiers[name]}`;
    if (deep[name]) return namer(deep[name], rootStates(deep[name]))(name);
    const other = componentOfRoot(name);
    if (other) return blockOf(other);
    if (/^VP[A-Z]/.test(name)) return docsThemeBlock(name);
    return states.has(name) ? `${block}--${name}` : `${block}__${name}`;
  };
}

// the classes the component's CSS compounds on its root or on a variant of
// it (VPNavTranslations' .VPNavScreenTranslations.open), and those
// test/layout-map.mjs names as its states
export function rootStates(component, css = unscope(styleOf(component))) {
  const roots = [rootOf(component), ...Object.keys(LAYOUT[component].modifiers ?? {})];
  const states = new Set(LAYOUT[component].states);
  transform({
    filename: `${component}.css`,
    code: Buffer.from(css),
    visitor: {
      Selector(selector) {
        eachCompound(selector, (compound) => {
          const names = classesOf(compound);
          if (names.some((n) => roots.includes(n))) for (const n of names) if (!roots.includes(n)) states.add(n);
        });
        return selector;
      },
    },
  });
  return states;
}

// rename the classes in a selector list, by text: outside [attributes] and
// strings, `.name` is a class
function renameSelectorText(text, rename) {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '[' || ch === '"' || ch === "'") {
      const close = ch === '[' ? ']' : ch;
      const end = text.indexOf(close, i + 1);
      if (end === -1) throw new Error(`unclosed ${ch} in ${text}`);
      out += text.slice(i, end + 1);
      i = end;
    } else if (ch === '.' && /[A-Za-z_-]/.test(text[i + 1] ?? '')) {
      const name = text.slice(i + 1).match(/^[\w-]+/)[0];
      out += `.${rename(name)}`;
      i += name.length;
    } else {
      out += ch;
    }
  }
  return out;
}

// a top-level selector naming no class matched only the component's own
// elements under Vue's scoping (svg[data-v-…]); unscoped it would match
// the whole page, so it goes under the component's block. A nested rule
// is its parent's already.
function scopeBare(prelude, block) {
  return prelude
    .split(',')
    .map((part) => {
      if (/\.[A-Za-z_-]/.test(part.replace(/\[[^\]]*\]/g, ''))) return part;
      const lead = part.match(/^\s*/)[0];
      return `${lead}.${block} ${part.slice(lead.length)}`;
    })
    .join(',');
}

// the CSS text with every rule's selector renamed; declarations, at-rule
// preludes and comments stay as upstream wrote them; block: the
// component's, which scopes its bare selectors
function renameCss(css, rename, block) {
  let out = '';
  let start = 0; // where the current prelude began
  const open = []; // the blocks around: 'rule', 'at', 'keyframes'
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      out += css.slice(start, end + 2);
      i = end + 1;
      start = i + 1;
    } else if (ch === '"' || ch === "'") {
      i = css.indexOf(ch, i + 1);
    } else if (ch === '{') {
      const prelude = css.slice(start, i);
      const at = prelude.trimStart().startsWith('@');
      if (at) out += prelude;
      else if (open.some((b) => b !== 'at')) out += renameSelectorText(prelude, rename);
      else out += scopeBare(renameSelectorText(prelude, rename), block);
      open.push(at ? (/^\s*@(-webkit-)?keyframes\b/.test(prelude) ? 'keyframes' : 'at') : 'rule');
      out += '{';
      start = i + 1;
    } else if (ch === '}') {
      open.pop();
      out += css.slice(start, i + 1);
      start = i + 1;
    }
  }
  return out + css.slice(start);
}

// every class the component's CSS uses
export function cssClasses(css) {
  const names = new Set();
  transform({
    filename: 'classes.css',
    code: Buffer.from(css),
    visitor: {
      Selector(selector) {
        eachCompound(selector, (compound) => {
          for (const n of classesOf(compound)) names.add(n);
        });
        return selector;
      },
    },
  });
  return names;
}

function portCss(component) {
  const css = unscope(styleOf(component));
  return renameCss(css, namer(component, rootStates(component, css)), blockOf(component)).trim();
}

// VitePress's vars.css, its :root and .dark merged, each value on one side
function upstreamVars() {
  const css = readFileSync(join(ROOT, 'test/upstream/vars.css'), 'utf8');
  const light = modeValues(css, ':root');
  return { css, light, dark: new Map([...light, ...modeValues(css, '.dark')]) };
}

// the markdown's own variables, defined on .vp-doc: vars.css's Code, Custom
// Block and Header Anchor groups, on the contract's names, and icons.css's
// two copy icons
function proseLocals() {
  const { light, dark } = upstreamVars();
  const lines = [];
  for (const [name, value] of light) {
    if (!/^--vp-(code-|custom-block-|header-anchor-symbol)/.test(name)) continue;
    const other = dark.get(name);
    if (other !== value) throw new Error(`${name} differs in .dark; the markdown's locals are one block`);
    lines.push(`    ${name}: ${renameTokens(value).replace(/\s+/g, ' ')};`);
  }
  const icons = modeValues(readFileSync(join(ROOT, 'test/upstream/icons.css'), 'utf8'), ':root');
  for (const name of ['--vp-icon-copy', '--vp-icon-copied']) {
    if (!icons.has(name)) throw new Error(`icons.css defines no ${name}`);
    lines.push(`    ${name}: ${icons.get(name)};`);
  }
  return `  /* the markdown's variables, VitePress's (vars.css's Code, Custom Block and
     Header Anchor groups, icons.css's copy icons), on the contract's names,
     defined where the markdown is */
  .vp-doc {
${lines.join('\n')}
  }`;
}

// docs-theme/vars.css: VitePress's palette on the contract's names
// (light-dark pairs of its own values, unfitted), then every variable of
// its :root, VitePress's color names aliased onto the contract, the brand
// button's grounds onto the contract's fills, a value that differs in .dark
// a pair; then its other scopes. The font families are tokens.css's
function docsVars() {
  const { css, light, dark } = upstreamVars();
  const out = [];
  out.push("  /* VitePress's palette on the contract's names, unfitted: the docs theme is VitePress exactly */");
  const palette = (values) => Object.fromEntries(Object.entries(FROM).map(([name, from]) => [name, resolve(values, values.get(`--vp-c-${from}`))]));
  out.push(...contractLines(palette(light), palette(dark)));
  out.push('', "  /* VitePress's own names, its color names aliases onto the contract */");
  for (const [name, value] of light) {
    if (name.startsWith('--vp-font-family')) continue;
    const color = name.match(/^--vp-c-(.+)$/)?.[1];
    const derived = name.match(/^--vp-(.+)$/)[1];
    let line;
    if (color !== undefined && color in ALIAS) {
      if (ALIAS[color] === color) continue;
      line = `${name}: var(--vp-c-${ALIAS[color]});`;
    } else if (derived in DERIVED) {
      line = `${name}: var(--vp-c-${DERIVED[derived]});`;
    } else {
      const other = dark.get(name);
      line = `${name}: ${other !== value ? `light-dark(${value}, ${other})` : value};`;
    }
    out.push(`  ${line.replace(/\s+/g, ' ')}`);
  }
  for (const name of dark.keys()) if (!light.has(name)) throw new Error(`vars.css defines ${name} in .dark only`);
  // the graded containers: GitHub's severity colors (warning orange, caution
  // yellow) on the contract's names, at :root:has() (0,2,0) so the opt-in
  // beats a color theme's :root, where VitePress has :root:where(:has())
  const graded = parseBlocks(css).find((b) => b.selector.includes('.vp-graded-containers'));
  if (!graded) throw new Error('vars.css has no graded containers block');
  const gradedLines = graded.declarations
    .map(([name, value]) => {
      const color = name.match(/^--vp-c-(.+)$/)?.[1];
      return color in ALIAS ? `  --vp-c-${ALIAS[color]}: ${value};` : null;
    })
    .filter(Boolean);
  // the sidebar's z-index from 60rem, and the hidden navbar's heights, as
  // VitePress has them (its .VPSidebar is the layout's .vp-sidebar)
  const mediaDecl = css.match(/@media \(min-width: 60rem\) \{\s*:root \{\s*([^}]*?)\s*\}\s*\}/)?.[1];
  if (!mediaDecl) throw new Error('vars.css has no @media :root block');
  const media = `@media (min-width: 60rem) {\n  :root {\n    ${mediaDecl}\n  }\n}`;
  const hideNav = [...css.matchAll(/(\.hide-nav[^{]*) \{\s*([^}]*?)\s*\}/g)].map((m) => `${m[1].replace('.VPSidebar', `.${blockOf('VPSidebar')}`)} {\n  ${m[2]}\n}`);
  if (hideNav.length !== 2) throw new Error('vars.css has not two .hide-nav blocks');
  return `:root {
${out.join('\n')}
}

/* vp-graded-containers on an element opts a page into GitHub's severity
   colors: warning orange and caution yellow, where VitePress's default
   keeps warning yellow and caution red */
:root:has(.vp-graded-containers) {
${gradedLines.join('\n')}
}

${media}

${hideNav.join('\n\n')}
`;
}

const indent = (css) => css.split('\n').map((l) => (l ? `  ${l}` : l)).join('\n');

// vpkit's ported files, written whole by `--write`: the header, VitePress's
// global stylesheets the components rely on (verbatim, first, as VitePress
// loads them before any component), then each component's port in the
// order VitePress's bundle has them (vitepress.dev's style.css: a child's
// styles before its parent's), so rules of two components that tie resolve
// as there. The layout is in @layer components; the markdown in @layer base,
// below every component, as VitePress's components outrank its vp-doc.css
// by Vue's scoping, which the port drops (a markdown layer of its own would
// have to be declared before Tailwind's own order, in every entry, or it
// sorts after the utilities)
export const FILES = {
  'docs-theme/layout.css': {
    header: `/* vpkit's docs theme — the page layout, ported from VitePress's components
 * (v2.0.0-alpha.20): the skeleton (Layout, VPContent, VPDoc, VPSkipLink,
 * VPBackdrop), the navbar (VPNav, VPNavBar and its parts: the title, search,
 * menu with its flyouts, translations, appearance switch, social links,
 * hamburger, the extra menu) and the nav screen of narrow screens, the
 * sidebar (VPSidebar, VPSidebarGroup, VPSidebarItem), the local nav
 * (VPLocalNav, VPLocalNavOutlineDropdown), the aside (VPDocAside,
 * VPDocAsideOutline, VPDocOutlineItem), the doc footer (VPDocFooter,
 * VPDocFooterLastUpdated), the site footer (VPFooter) and the home page
 * (VPHome: VPHero with VPButton, VPFeatures with VPFeature, VPHomeContent;
 * VPButton and VPFeature as VitePress has them, where the app kit's button
 * and card change them for apps), the 404 page's NotFound and the local
 * search's dialog (VPLocalSearchBox). Import it after vpkit and
 * docs-theme/vars.css: \`@import "vpkit/docs-theme/layout.css";\`
 *
 * Layout components keep VitePress's markup and rename its classes
 * (test/layout-map.mjs): a component's root class becomes its block
 * (\`VPContent\` → \`vp-content\`; \`VPDoc\` → \`vp-doc-page\`, since \`vp-doc\` is
 * the markdown's class), a class its CSS compounds on the root a modifier
 * (\`.VPContent.has-sidebar\` → \`vp-content--has-sidebar\`), as do the few
 * classes test/layout-map.mjs names (VPDocOutlineItem's \`.root\`), any other
 * class of its own a part (VPDoc's \`.aside\` → \`vp-doc-page__aside\`). Build the
 * markup from VitePress's templates (src/client/theme-default) with these
 * names. Written by scripts/vitepress-port.mjs: the declarations are
 * VitePress's, verbatim, on VitePress's variable names, which
 * docs-theme/vars.css defines. */`,
    globals: [['utils.css', 'hides an element but keeps it for screen readers']],
    components: [
      'VPBackdrop', 'NotFound', 'VPDocOutlineItem', 'VPDocAsideOutline', 'VPDocAside', 'VPDocFooterLastUpdated', 'VPDocFooter',
      'VPDoc', 'VPHomeContent', 'VPImage', 'VPFeature', 'VPFeatures', 'VPButton', 'VPHero', 'VPHome', 'VPContent',
      'VPFooter', 'VPLocalNavOutlineDropdown', 'VPLocalNav', 'VPSwitch', 'VPSwitchAppearance', 'VPNavAppearance',
      'VPMenuLink', 'VPMenuGroup', 'VPMenu', 'VPFlyout', 'VPNavTranslations', 'VPSocialLink', 'VPSocialLinks',
      'VPNavBarExtra', 'VPNavBarHamburger', 'VPNavBarAskAiButton', 'VPNavBarSearchButton', 'VPNavBarSearch',
      'VPNavBarTitle', 'VPNavMenuGroup', 'VPNavMenuLink', 'VPNavMenu', 'VPNavSocialLinks', 'VPNavBar',
      'VPNavScreen', 'VPNav', 'VPSidebarItem', 'VPSidebarGroup', 'VPSidebar', 'VPSkipLink', 'Layout',
      // an async chunk in VitePress, whose CSS loads after the bundle's
      'VPLocalSearchBox',
    ],
  },
  'prose.css': {
    layer: 'base',
    header: `/* vpkit — markdown content, everything inside \`<div class="vp-doc">\`:
 * VitePress's styles/components/custom-block.css, vp-code-group.css and
 * vp-doc.css (v2.0.0-alpha.20) verbatim, in the order its theme imports
 * them (without-fonts.ts), which decides the ties between them: a link in
 * a container is weight 500 by vp-doc.css, a code block in one takes the
 * code block's color. An optional import: \`@import "vpkit/prose.css";\`
 *
 * VitePress's color names are read as the contract's (scripts/contract.mjs:
 * brand-1 is brand, brand-2 brand-hover, tip and note are brand's, caution
 * its own, on danger's colors in the stock), and the variables the
 * markdown reads (--vp-code-*, --vp-custom-block-*, the anchor symbol, the
 * copy icons) are VitePress's, defined on .vp-doc, so it needs nothing
 * beyond tokens.css (the contract, the mono font, the bar's height).
 *
 * In \`@layer base\`, below the components: a vp-btn, a vp-card or any
 * other component inside a vp-doc keeps its own look and its own states
 * (VitePress's components win there by Vue's scoping, which the port
 * drops), and a utility still wins as it does everywhere. A layer of the
 * markdown's own would have to be declared before Tailwind's order in
 * every entry, or it would sort after the utilities.
 *
 * These style VitePress's markdown output (markdown-it and Shiki): headings
 * with \`.header-anchor\` links, \`div.custom-block\` containers and GitHub
 * alerts, \`div[class*='language-']\` code blocks with their copy button,
 * language label, highlighted, diff and focused lines and line numbers,
 * \`.vp-code-group\` tabs, and the arrow of an external link
 * (\`.vp-external-link-icon\`, anywhere). Its classes are VitePress's own,
 * not renamed. The code's colors are not here: they come with the
 * highlighter (Shiki's two themes, vp-code.css, in VitePress). Written by
 * scripts/vitepress-port.mjs. */`,
    locals: proseLocals,
    rename: renameTokens,
    globals: [
      ['custom-block.css', 'containers and GitHub alerts'],
      ['vp-code-group.css', 'code groups'],
      ['vp-doc.css', 'headings, text, lists, tables, code blocks'],
    ],
    components: [],
  },
  'docs-theme/icons.css': {
    header: `/* vpkit's docs theme — icons, VitePress's styles/icons.css (v2.0.0-alpha.20)
 * verbatim inside @layer components, for the layout: \`@import
 * "vpkit/docs-theme/icons.css";\`. The app kit draws its icons as inline
 * SVG (the crate's \`icon\` module), which needs no mask and no \`data:\` in a
 * page's Content-Security-Policy.
 *
 *   <span class="vpi-search" aria-hidden="true"></span>
 *
 * An icon is a \`vpi-*\` class: a 1em mask over currentColor, so it takes the
 * text color and size around it. The icons are Lucide's (ISC; the copyright
 * and permission notice is in LICENSE-Lucide). Each is an inline SVG, a
 * data: URL: a page with a Content-Security-Policy allows \`img-src data:\`,
 * or the browser refuses the masks and every icon shows nothing. vpkit's
 * additions: under forced colors, which replace the background color the
 * mask paints with by the page's, an icon paints in the system's text
 * color. Written by scripts/vitepress-port.mjs. */`,
    globals: [['icons.css', "VitePress's masks"]],
    // vpkit's addition, after VitePress's ground for a mask
    after: `  @media (forced-colors: active) {
    [class^='vpi-']:not(.bg),
    [class*=' vpi-']:not(.bg),
    .vp-icon:not(.bg) {
      forced-color-adjust: none;
      background-color: CanvasText;
    }
  }`,
  },
  'fonts.css': {
    header: `/* vpkit — Inter webfonts (generated subsets, ported from VitePress).
   An optional import, separate from index.css: \`@import "vpkit/fonts.css";\`.
   The url()s are relative to the compiled stylesheet (the Tailwind CLI
   leaves them as written), so serve this package's fonts/ directory next
   to it. Written by scripts/vitepress-port.mjs: VitePress's fonts.css's
   @font-face rules verbatim, their url()s beside the stylesheet. */`,
    body: () => {
      const css = readFileSync(join(ROOT, 'test/upstream/fonts.css'), 'utf8');
      const last = css.lastIndexOf('@font-face');
      const faces = css.slice(css.indexOf('@font-face'), css.indexOf('}', last) + 1);
      return `${faces.replace(/url\('\.\.\/fonts\/([^']+)'\)/g, 'url("fonts/$1")')}\n`;
    },
  },
  'docs-theme/vars.css': {
    header: `/* vpkit's docs theme — VitePress's variables (vars.css at v2.0.0-alpha.20),
 * for its layout: its palette on the contract's names, unfitted, one
 * light-dark() pair each, so a docs site is VitePress exactly where the app
 * kit's defaults are fitted for contrast; then every other variable of
 * VitePress's :root (its font families are tokens.css's), its color names
 * aliased onto the contract (--vp-c-brand-1 is
 * --vp-c-brand), the brand button's grounds onto the contract's fills, so a
 * color theme, which defines the contract, recolors the layout too; its
 * ramps, the z-indexes and the rest verbatim. Import it after vpkit, before
 * the layout: \`@import "vpkit/docs-theme/vars.css";\`. test/tokens.mjs holds
 * every variable to vars.css. Written by scripts/vitepress-port.mjs. */`,
    body: docsVars,
  },
};

export function fileText(name) {
  const { header, body, locals, rename = (css) => css, globals = [], components = [], after, layer = 'components' } = FILES[name];
  if (body) return `${header}\n\n${body()}`;
  const sections = [
    ...(locals ? [locals()] : []),
    ...globals.map(([file, what]) => `  /* ${file}: ${what} */\n${indent(rename(readFileSync(join(ROOT, 'test/upstream', file), 'utf8').trim()))}`),
    ...components.map((c) => `  /* ${c} (${LAYOUT[c].file}) */\n${indent(portCss(c))}`),
    ...(after ? [after] : []),
  ];
  return `${header}\n\n@layer ${layer} {\n${sections.join('\n\n')}\n}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv[2] === '--write') {
    for (const name of Object.keys(FILES)) writeFileSync(join(ROOT, name), fileText(name));
  } else {
    for (const component of process.argv.slice(2)) {
      console.log(`/* ${component} → .${blockOf(component)} */`);
      console.log(portCss(component));
    }
  }
}
