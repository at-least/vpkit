// Reading a flat stylesheet, as the theme contract test, the stock fitter
// and the docs index read tokens.css, the theme files and the docs theme's
// variables: the top-level blocks, and a selector's declarations merged in
// order, later ones winning as in the cascade, each value read on the light
// or the dark side of its light-dark() pairs. A nested block (a @media) is
// no selector's.
export const stripComments = (css) => css.replace(/\/\*[\s\S]*?(\*\/|$)/g, '');

// top-level `selector { decl; decl; }` blocks; the token files are flat,
// which is all this needs to read
export function parseBlocks(css) {
  css = stripComments(css);
  const blocks = [];
  let rest = css;
  for (let open = rest.indexOf('{'); open !== -1; open = rest.indexOf('{')) {
    const selector = rest.slice(0, open).trim().split(/\s+/).join(' ');
    let depth = 1;
    let close = open + 1;
    for (; close < rest.length && depth > 0; close++) {
      if (rest[close] === '{') depth++;
      else if (rest[close] === '}') depth--;
    }
    const body = rest.slice(open + 1, Math.max(close - 1, open + 1));
    const declarations = body
      .split(';')
      .map((decl) => {
        const colon = decl.indexOf(':');
        return colon === -1 ? null : [decl.slice(0, colon).trim(), decl.slice(colon + 1).trim()];
      })
      .filter((decl) => decl && decl[0] !== '');
    blocks.push({ selector, declarations });
    rest = rest.slice(close);
  }
  return blocks;
}

// every `light-dark(light, dark)` in a value, each argument a color or a
// function of one level (rgba(…)), whitespace around them free
const LIGHT_DARK = /light-dark\(\s*((?:[^()]|\([^()]*\))*?)\s*,\s*((?:[^()]|\([^()]*\))*?)\s*\)/g;

// a value on one side of its light-dark() pairs: `light` or `dark`; a value
// without a pair is the same on both
export const side = (value, mode) => value.replace(LIGHT_DARK, (_, light, dark) => (mode === 'dark' ? dark : light));

// whether a value carries a light-dark() pair
export const hasPair = (value) => {
  LIGHT_DARK.lastIndex = 0;
  return LIGHT_DARK.test(value);
};

// a selector's declarations, name → value, every top-level block of it
// merged; with a mode, each value on that side of its pairs
export function modeValues(css, selector, mode) {
  const values = new Map();
  for (const block of parseBlocks(css)) {
    if (block.selector !== selector) continue;
    for (const [prop, value] of block.declarations) values.set(prop, mode ? side(value, mode) : value);
  }
  return values;
}

// a value with its var() references resolved in vars, through any chain
export const resolve = (vars, value) => value.replace(/var\((--[\w-]+)\)/g, (_, name) => resolve(vars, vars.get(name)));
