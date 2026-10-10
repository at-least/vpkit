// Reading a flat stylesheet, as the theme contract test, the vitepress
// fitter and the docs index read theme files and the base's token layer:
// the top-level blocks, and a selector's declarations merged in order,
// later ones winning as in the cascade. A nested block (tokens.css's
// @media) is no selector's.
export const stripComments = (css) => css.replace(/\/\*[\s\S]*?(\*\/|$)/g, '');

// top-level `selector { decl; decl; }` blocks; theme files and the token
// layer of the base are flat, which is all this needs to read
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

// a selector's declarations, name → value, every top-level block of it merged
export function modeValues(css, selector) {
  const values = new Map();
  for (const block of parseBlocks(css)) {
    if (block.selector !== selector) continue;
    for (const [prop, value] of block.declarations) values.set(prop, value);
  }
  return values;
}


// a value with its var() references resolved in vars, through any chain
export const resolve = (vars, value) => value.replace(/var\((--[\w-]+)\)/g, (_, name) => resolve(vars, vars.get(name)));
