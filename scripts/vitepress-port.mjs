// Port VitePress's layout component styles to vpkit's class names.
//
//   node scripts/vitepress-port.mjs VPContent VPDoc …
//
// Prints each component's <style> from test/upstream (verbatim copies of
// VitePress) with every class renamed by the scheme in test/layout-map.mjs,
// ready for @layer components. vpkit's layout files were written from this
// output; rerun it after re-syncing test/upstream to see what changed.
//
// Vue's scoping is gone in the port: `:deep(x)` is unwrapped, and a selector
// loses the [data-v-…] attribute Vue adds to its last compound, the same
// 0,1,0 for every rule of a component.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'lightningcss';

import { LAYOUT, blockOf, componentOfRoot, isGlobal, rootOf } from '../test/layout-map.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// the component's style blocks; only scoped ones are its own
export function styleOf(component) {
  const src = readFileSync(join(ROOT, 'test/upstream', LAYOUT[component].file), 'utf8');
  // a component without a <style> (VPPage) has no rules to port
  const blocks = [...src.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)];
  for (const [, attrs] of blocks) {
    if (!/\bscoped\b/.test(attrs)) throw new Error(`${component}: unscoped <style${attrs}> needs a decision`);
  }
  return blocks.map((b) => b[2]).join('\n');
}

// `:deep(x)` → `x`, by text: Lightning CSS keeps it as raw tokens, and a
// browser drops the rule
export function unwrapDeep(css) {
  let out = '';
  let rest = css;
  for (let at = rest.indexOf(':deep('); at !== -1; at = rest.indexOf(':deep(')) {
    let depth = 1;
    let end = at + ':deep('.length;
    for (; depth > 0; end++) {
      if (end >= rest.length) throw new Error('unbalanced :deep(');
      if (rest[end] === '(') depth++;
      else if (rest[end] === ')') depth--;
    }
    out += rest.slice(0, at) + rest.slice(at + ':deep('.length, end - 1);
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

// rename a selector's classes, nested ones included
function renamed(selector, rename) {
  return selector.map((c) => {
    if (c.type === 'class') return { ...c, name: rename(c.name) };
    if (c.type === 'pseudo-class' && NESTED.has(c.kind)) {
      return { ...c, selectors: c.selectors.map((s) => renamed(s, rename)) };
    }
    return c;
  });
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
    return states.has(name) ? `${block}--${name}` : `${block}__${name}`;
  };
}

// the classes the component's CSS compounds on its root or on a variant of
// it (VPNavTranslations' .VPNavScreenTranslations.open), and those
// test/layout-map.mjs names as its states
export function rootStates(component, css = unwrapDeep(styleOf(component))) {
  const roots = [rootOf(component), ...Object.keys(LAYOUT[component].modifiers ?? {})];
  const states = new Set(LAYOUT[component].states);
  transform({
    filename: `${component}.css`,
    code: Buffer.from(unwrapDeep(css)),
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

// the CSS text with every rule's selector renamed; declarations, at-rule
// preludes and comments stay as upstream wrote them
export function renameCss(css, rename) {
  let out = '';
  let start = 0; // where the current prelude began
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
      out += prelude.trimStart().startsWith('@') ? prelude : renameSelectorText(prelude, rename);
      out += '{';
      start = i + 1;
    } else if (ch === '}' || ch === ';') {
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
    code: Buffer.from(unwrapDeep(css)),
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

export function portCss(component) {
  const css = unwrapDeep(styleOf(component));
  return renameCss(css, namer(component, rootStates(component, css))).trim();
}

// vpkit's layout files, written whole by `--write`: the header, VitePress's
// global stylesheets the components rely on (verbatim, first, as VitePress
// loads them before any component), then each component's port in the
// order VitePress's bundle has them (vitepress.dev's style.css: a child's
// styles before its parent's), so rules of two components that tie resolve
// as there; all in @layer components
export const FILES = {
  'layout.css': {
    header: `/* vpkit — the page layout, ported from VitePress's components
 * (v2.0.0-alpha.20): the skeleton (Layout, VPContent, VPDoc, VPSkipLink,
 * VPBackdrop), the navbar (VPNav, VPNavBar and its parts: the title, search,
 * menu with its flyouts, translations, appearance switch, social links,
 * hamburger, the extra menu) and the nav screen of narrow screens, the
 * sidebar (VPSidebar, VPSidebarGroup, VPSidebarItem), the local nav
 * (VPLocalNav, VPLocalNavOutlineDropdown), the aside (VPDocAside,
 * VPDocAsideOutline, VPDocOutlineItem), the doc footer (VPDocFooter,
 * VPDocFooterLastUpdated), the site footer (VPFooter) and the home page
 * (VPHome: VPHero with VPButton, VPFeatures with VPFeature, VPHomeContent;
 * VPButton and VPFeature as VitePress has them, where button.css and
 * card.css change them for apps). An optional import:
 * \`@import "vpkit/layout.css";\`
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
 * VitePress's, verbatim. */`,
    globals: [['utils.css', 'hides an element but keeps it for screen readers']],
    components: [
      'VPBackdrop', 'VPDocOutlineItem', 'VPDocAsideOutline', 'VPDocAside', 'VPDocFooterLastUpdated', 'VPDocFooter',
      'VPDoc', 'VPHomeContent', 'VPImage', 'VPFeature', 'VPFeatures', 'VPButton', 'VPHero', 'VPHome', 'VPContent',
      'VPFooter', 'VPLocalNavOutlineDropdown', 'VPLocalNav', 'VPSwitch', 'VPSwitchAppearance', 'VPNavAppearance',
      'VPMenuLink', 'VPMenuGroup', 'VPMenu', 'VPFlyout', 'VPNavTranslations', 'VPSocialLink', 'VPSocialLinks',
      'VPNavBarExtra', 'VPNavBarHamburger', 'VPNavBarAskAiButton', 'VPNavBarSearchButton', 'VPNavBarSearch',
      'VPNavBarTitle', 'VPNavMenuGroup', 'VPNavMenuLink', 'VPNavMenu', 'VPNavSocialLinks', 'VPNavBar',
      'VPNavScreen', 'VPNav', 'VPSidebarItem', 'VPSidebarGroup', 'VPSidebar', 'VPSkipLink', 'Layout',
    ],
  },
  'content.css': {
    header: `/* vpkit — markdown content, everything inside \`<div class="vp-doc">\`:
 * VitePress's styles/components/vp-doc.css, custom-block.css and
 * vp-code-group.css (v2.0.0-alpha.20) verbatim. An optional import:
 * \`@import "vpkit/content.css";\`
 *
 * These style VitePress's markdown output (markdown-it and Shiki): headings
 * with \`.header-anchor\` links, \`div.custom-block\` containers and GitHub
 * alerts, \`div[class*='language-']\` code blocks with their copy button,
 * language label, highlighted, diff and focused lines and line numbers,
 * \`.vp-code-group\` tabs. Its classes are VitePress's own, not renamed.
 * The code's colors are not here: they come with the highlighter (Shiki's
 * two themes, vp-code.css, in VitePress). Written by
 * scripts/vitepress-port.mjs. */`,
    globals: [
      ['vp-doc.css', 'headings, text, lists, tables, code blocks'],
      ['custom-block.css', 'containers and GitHub alerts'],
      ['vp-code-group.css', 'code groups'],
    ],
    components: [],
  },
};

const indent = (css) => css.split('\n').map((l) => (l ? `  ${l}` : l)).join('\n');

export function fileText(name) {
  const { header, globals, components } = FILES[name];
  const sections = [
    ...globals.map(([file, what]) => `  /* ${file}: ${what} */\n${indent(readFileSync(join(ROOT, 'test/upstream', file), 'utf8').trim())}`),
    ...components.map((c) => `  /* ${c} (${LAYOUT[c].file}) */\n${indent(portCss(c))}`),
  ];
  return `${header}\n\n@layer components {\n${sections.join('\n\n')}\n}\n`;
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
