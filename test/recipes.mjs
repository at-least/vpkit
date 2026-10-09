// The apps' own recipes: the reference for vpkit components that have no
// VitePress original. test/entry.css has Tailwind scan this file, so the
// utilities in these strings are in the test stylesheet.

// totality crates/store/src/ui.rs `input_base!`, verbatim as of 2026-10-08
export const TOTALITY_INPUT =
  'block h-11 rounded-lg border border-(--vp-input-border-color) bg-(--vp-input-bg-color) px-3' +
  ' text-base text-text-1 placeholder:text-text-2 transition-[border-color,box-shadow] duration-[250ms]' +
  ' hover:border-brand-1 focus:border-brand-1 focus:shadow-[0_0_0_2px_var(--vp-c-brand-1)]' +
  ' aria-[invalid=true]:border-danger-1 aria-[invalid=false]:border-success-1';

// own-drive src/web.rs at 8a2c523, verbatim as of 2026-10-10: the modal
// (`MODAL`), its title (`MODAL_H3`) and its button row (`BTN_ROW`); the
// scrim it sits on (`MODAL_BACK`) gives the dialog's ::backdrop its color
export const OWN_DRIVE_MODAL =
  'bg-[color:var(--vp-c-bg-elv)] text-text-1 border border-divider rounded-[.75rem] px-[1.25rem] py-[1.15rem] w-[26rem] max-w-[92vw] shadow-4';
export const OWN_DRIVE_MODAL_H3 = 'mt-0 mb-[.6rem] text-[1.05rem] font-semibold';
export const OWN_DRIVE_BTN_ROW = 'flex justify-end gap-[.5rem] mt-4';

// own-drive src/web.rs at 8a2c523, verbatim as of 2026-10-10: the grounded
// danger button, `BTN_DANGER` = BTN_BASE BTN_PILL BTN_FRAME DANGER_C
export const OWN_DRIVE_BTN_DANGER =
  'inline-flex items-center justify-center gap-[.3rem] text-[.875rem] font-semibold whitespace-nowrap cursor-pointer no-underline transition-[color,border-color,background-color] duration-[250ms] active:duration-100 disabled:opacity-50 disabled:cursor-default' +
  ' rounded-[1.25rem] h-[2.5rem] px-[1.25rem]' +
  ' border border-[color:var(--vp-button-alt-border)]' +
  ' text-[color:var(--vp-c-danger-1)] bg-[color:var(--vp-c-danger-soft)] hover:bg-[color:var(--vp-c-danger-soft)] active:bg-[color:var(--vp-c-danger-soft)]';
