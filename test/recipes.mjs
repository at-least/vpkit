// The apps' own recipes: the reference for vpkit components that have no
// VitePress original. test/entry.css has Tailwind scan this file, so the
// utilities in these strings are in the test stylesheet.

// totality crates/store/src/ui.rs `input_base!`, verbatim as of 2026-10-08,
// except the placeholder: text-2 there, text-3 here since 2026-10-10, when
// vp-input took VitePress's placeholder color (base.css's rule for every
// input) and the apps were held to vpkit's look
export const TOTALITY_INPUT =
  'block h-11 rounded-lg border border-(--vp-input-border-color) bg-(--vp-input-bg-color) px-3' +
  ' text-base text-text-1 placeholder:text-text-3 transition-[border-color,box-shadow] duration-[250ms]' +
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

// totality crates/store/src/ui.rs `CHOICE`, verbatim as of 2026-10-10
export const TOTALITY_CHOICE =
  'flex cursor-pointer items-start gap-3 rounded-lg border border-divider bg-bg p-4' +
  ' text-[0.875rem] leading-6 transition-colors duration-[250ms] hover:border-brand-1' +
  ' has-checked:border-brand-1 has-checked:bg-brand-soft' +
  ' has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-1' +
  ' [&>input]:mt-1 [&>input]:size-4 [&>input]:shrink-0 [&>input]:accent-(--vp-c-brand-1)';

// totality crates/store/src/ui.rs `FIELD_LABEL` and `MSG_ERROR`, verbatim
// as of 2026-10-10
export const TOTALITY_FIELD_LABEL = 'mb-1.5 block text-[0.875rem] leading-6 font-medium text-text-1';
export const TOTALITY_MSG_ERROR = 'mt-2 text-[0.875rem] leading-6 text-danger-1';

// own-drive src/web.rs at 8a2c523, verbatim as of 2026-10-10: the status
// message `#msg` (its class list; placed fixed at the bottom center)
export const OWN_DRIVE_MSG =
  'fixed left-1/2 -translate-x-1/2 bottom-4 z-[var(--od-z-msg)] bg-[color:var(--vp-c-bg-elv)] text-text-1 border border-divider rounded-[.5rem] px-[.9rem] py-[.5rem] shadow-3 max-w-[90vw] empty:hidden';

// own-drive src/web.rs at 8a2c523, verbatim as of 2026-10-10: the bar's
// track (`BAR`) and its fill (`BAR_FILL`); the quota bar sets the track
// 7rem wide and the fill's width inline
export const OWN_DRIVE_BAR = 'block h-[.3rem] bg-[color:var(--vp-c-default-soft)] rounded-[.15rem] overflow-hidden';
export const OWN_DRIVE_BAR_FILL = 'block h-full bg-brand-1 w-0';

// crashcart src/web/styles/app.css at 78e4d5b, as of 2026-10-10: its
// `.btn-ghost` (over `.btn`'s transparent border), as utilities over
// vp-btn, the reference for vp-btn-ghost; the same colors as vp-icon-btn's
export const CRASHCART_BTN_GHOST =
  'vp-btn border-transparent bg-transparent text-text-2' +
  ' hover:border-transparent hover:bg-default-soft hover:text-text-1' +
  ' active:border-transparent active:bg-default-soft active:text-text-1';

// own-drive src/web.rs at ac7a1d4, verbatim as of 2026-10-10: a file card
// of the grid view (`card()`, web.rs:1218): transparent in a divider
// border, the reference for vp-card-outline's border and radius (its
// ground is the page's color where this one is transparent, and its
// hover is its own)
export const OWN_DRIVE_CARD =
  'card relative bg-transparent border border-divider rounded-[.75rem] pt-[.8rem] px-[.5rem] pb-[.7rem] flex flex-col items-center gap-[.45rem] cursor-pointer text-center transition-[border-color,background-color,box-shadow] duration-[250ms] hover:bg-bg-soft hover:border-default-1 hover:shadow-1';

// own-drive src/web.rs at ac7a1d4, verbatim as of 2026-10-10: the empty
// state's line (`EMPTY`, web.rs:467), the second consumer of vp-empty
export const OWN_DRIVE_EMPTY = 'py-[3.5rem] px-4 text-center text-text-2';

// totality crates/web/src/ui.rs `BADGE`, `BADGE_SUCCESS` and `BADGE_DANGER`,
// verbatim as of 2026-10-10: vp-badge on the page's color with the type's
// tint as its border, the reference for vp-badge-outline
export const TOTALITY_BADGE_OUTLINE = 'vp-badge bg-bg border-default-soft';
export const TOTALITY_BADGE_OUTLINE_SUCCESS = 'vp-badge vp-badge-success bg-bg border-success-soft';
export const TOTALITY_BADGE_OUTLINE_DANGER = 'vp-badge vp-badge-danger bg-bg border-danger-soft';
