// The apps' own recipes: the reference for vpkit components that have no
// VitePress original. test/entry.css has Tailwind scan this file, so the
// utilities in these strings are in the test stylesheet.

// totality crates/store/src/ui.rs `input_base!`, verbatim as of 2026-10-08
export const TOTALITY_INPUT =
  'block h-11 rounded-lg border border-(--vp-input-border-color) bg-(--vp-input-bg-color) px-3' +
  ' text-base text-text-1 placeholder:text-text-2 transition-[border-color,box-shadow] duration-[250ms]' +
  ' hover:border-brand-1 focus:border-brand-1 focus:shadow-[0_0_0_2px_var(--vp-c-brand-1)]' +
  ' aria-[invalid=true]:border-danger-1 aria-[invalid=false]:border-success-1';
