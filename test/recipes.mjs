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

// crashcart src/web/pages/jobs.rs and project_new.rs at ee03de1, verbatim
// as of 2026-10-17: a field's box around its label and control, one column
// its control may shrink in, the label's margin removed, and the hint line
// under a control
export const CRASHCART_FIELD = 'grid grid-cols-1 gap-1.5 min-w-0';
// and src/web/pages/account.rs, settings.rs and alerts.rs at ee03de1: the
// box where the control has a width of its own, in a wrapping row of fields
export const CRASHCART_FIELD_IN_ROW = 'grid gap-1.5';
export const CRASHCART_FIELD_LABEL = 'vp-label mb-0';
export const CRASHCART_FIELD_HINT = 'text-xs text-secondary';

// crashcart src/web/pages/overview.rs and jobs.rs at 06a2e0e, verbatim as of
// 2026-10-17: a notice with an icon, the alert a flex row on the start and
// its content one column beside the icon (the icon its .icon, 1rem square)
export const CRASHCART_ALERT_ROW = 'flex items-start gap-2';
export const CRASHCART_ALERT_CONTENT = 'flex-1 min-w-0';

// crashcart src/web/pages/*.rs at 74f94da, verbatim as of 2026-10-18: the
// outlined card undone to a block of content, `block h-auto overflow-hidden`
// with p-4, p-3 or p-0 (36 of its 64 outlined cards, the two auth cards
// aside), and the form row on the same card (7 of its 14 flex-row cards are
// a <form>, 3 of them with this class list)
export const CRASHCART_PANEL = 'vp-card vp-card-outline block h-auto overflow-hidden p-4';
export const CRASHCART_PANEL_FLUSH = 'vp-card vp-card-outline block h-auto overflow-hidden p-0';
export const CRASHCART_PANEL_FORM = 'vp-card vp-card-outline flex-row h-auto overflow-hidden mt-1 flex flex-wrap items-end gap-3 p-3';

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

// own-drive src/web.rs at 638e3f8, verbatim as of 2026-10-15: the folder
// path over the file list (`browse_main`, web.rs:988): its nav, a crumb
// that is a link, the current folder's crumb and the slash between crumbs
export const OWN_DRIVE_CRUMBS = 'min-w-0 [overflow-wrap:anywhere] text-[.875rem]';
export const OWN_DRIVE_CRUMB = 'text-text-2 no-underline hover:text-text-1 hover:underline';
export const OWN_DRIVE_CRUMB_CURRENT = 'text-text-1 cursor-default font-semibold hover:no-underline';
export const OWN_DRIVE_CRUMB_SLASH = 'text-text-3';

// totality crates/web/src/ui.rs `BADGE`, `BADGE_SUCCESS` and `BADGE_DANGER`,
// verbatim as of 2026-10-10: vp-badge on the page's color with the type's
// tint as its border, the reference for vp-badge-outline
export const TOTALITY_BADGE_OUTLINE = 'vp-badge bg-bg border-default-soft';
export const TOTALITY_BADGE_OUTLINE_SUCCESS = 'vp-badge vp-badge-success bg-bg border-success-soft';
export const TOTALITY_BADGE_OUTLINE_DANGER = 'vp-badge vp-badge-danger bg-bg border-danger-soft';

// own-drive src/web.rs at 9aff0f4, verbatim as of 2026-10-18 but for the
// `dl` JS hook: a file name's link (`DL`), and a search hit's location
// (`DL_LOC`), quiet metadata underlined on hover; the references for
// vp-link-quiet, the second with vpkit's no underline written inline
export const OWN_DRIVE_DL = 'text-body no-underline font-medium hover:text-brand-1';
export const OWN_DRIVE_DL_LOC = 'text-secondary no-underline font-normal hover:text-brand-1 hover:underline';

// crashcart src/web/styles/app.css at 0b6d7a3, as of 2026-10-18: its
// `.whyline` (text-1, no underline, brand-1 on hover) as utilities
export const CRASHCART_WHYLINE = 'text-text-1 no-underline hover:text-brand-1';

// totality crates/store/src/ui.rs at cbcbb503, verbatim as of 2026-10-18:
// a roster line's name and the address under it (`ROSTER_NAME`,
// `ROSTER_DETAIL`), the references for vp-row-title and vp-row-desc
export const TOTALITY_ROSTER_NAME = 'block text-[0.9375rem] leading-6 font-medium [overflow-wrap:anywhere]';
export const TOTALITY_ROSTER_DETAIL = 'block text-[0.8125rem] leading-5 text-secondary [overflow-wrap:anywhere]';

// crashcart src/web/styles/app.css at 0b6d7a3, as of 2026-10-18: its
// `.issue-item-link` hover (an overview list's issue as a link, on
// gray-soft, VitePress's default-soft), as a utility; its 0.25s
// background-color transition is written inline where it is the reference
export const CRASHCART_ISSUE_LINK_HOVER = 'hover:bg-default-soft';

// totality crates/store/src/pages.rs at cbcbb503, verbatim as of
// 2026-10-18 but for its placement in the order card (mt-4, the rule above
// it, pt-4): an order's details, each term over its value in a <div>, one
// column and two from 640px; the reference for vp-dl
export const TOTALITY_ORDER_DL =
  'grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 [&>div]:min-w-0 [&_dt]:text-[0.75rem] [&_dt]:leading-5 [&_dt]:font-medium [&_dt]:text-secondary [&_dd]:text-[0.875rem] [&_dd]:leading-6 [&_dd]:text-body [&_dd]:[overflow-wrap:anywhere]';

// crashcart src/web/pages/event.rs at 0b6d7a3, verbatim as of 2026-10-18:
// an event's metadata, terms beside their values (its columns inline:
// `grid-template-columns:max-content minmax(0,1fr)`), the term uppercase;
// the reference for vp-dl-inline, with vpkit's type written inline
export const CRASHCART_META_DL = 'grid text-xs gap-x-3 gap-y-1';
export const CRASHCART_META_DT = 'uppercase tracking-wide text-secondary';

// totality crates/store/src/ui.rs and crates/admin/src/ui.rs at cbcbb503,
// verbatim as of 2026-10-18: where htmx drops a handler's reply (`RESULT`),
// one line of secondary text, danger once the page marks it
// `data-result="error"`; the admin's hides while empty and gives a
// fragment's block elements the document's ink. The references for
// vp-status
export const TOTALITY_RESULT =
  'mt-4 text-[0.875rem] leading-6 text-secondary empty:mt-0 data-[result=error]:text-danger-1';
export const TOTALITY_ADMIN_RESULT =
  'mt-4 text-[0.875rem] leading-6 text-secondary empty:hidden [&_:is(table,h2,h3,h4,p,ol,ul,dl)]:text-body';

// crashcart src/web/pages/releases.rs and alerts.rs at 0b6d7a3, verbatim as
// of 2026-10-18: a legend's dot, its color inline (`background:var(--ok)`);
// the reference for vp-dot (and its .swatch, the same dot in the text-2 of
// its legend when it names no color)
export const CRASHCART_LEGEND_DOT = 'inline-block w-2 h-2 rounded-full';

// own-drive src/web.rs at 9aff0f4, verbatim as of 2026-10-18 but for its
// JS hook (`table-box`): the box every table scrolls sideways in
// (`TABLE_BOX`), a region that takes focus, its indicator drawn 2px inside;
// the reference for vp-table-scroll
export const OWN_DRIVE_TABLE_BOX = 'overflow-x-auto focus-visible:-outline-offset-2';

// crashcart src/web/styles/app.css at 0b6d7a3, as of 2026-10-18: a table
// row that links its page (`tr[data-href]:hover`, on gray-soft, VitePress's
// default-soft), as a utility; the reference for vp-table-hover
export const CRASHCART_ROW_HOVER = 'hover:bg-default-soft';

// own-drive styles/app.css at 9aff0f4, as of 2026-10-18: a row's actions,
// hidden on a device that can hover until the pointer or the keyboard
// reaches the row (`.rowbtns`), as utilities on the row (a group) and the
// cell; the reference for vp-table-actions
export const OWN_DRIVE_ROWBTNS = '[@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100';

// crashcart src/web/styles/app.css at 0b6d7a3, as of 2026-10-18: a sortable
// header's link (`.vp-table th a`), a dotted underline in the header's
// text-2, text-1 hovered, as utilities (its transition, and the current
// sort's solid underline in text-1, written inline where they are the
// reference); the reference for vp-table-sort
export const CRASHCART_SORT = 'cursor-pointer underline decoration-dotted decoration-text-2 underline-offset-[0.15em] hover:text-text-1 hover:decoration-text-1';

// own-drive src/web.rs at 9aff0f4, verbatim as of 2026-10-18: a card action
// chip's icon (`icon_chip`), sized by utilities; the reference for a size
// utility winning over vp-btn's rule for its icon
export const OWN_DRIVE_ICON_CHIP = 'fill-current w-4 h-4';

// own-drive src/web.rs at 9aff0f4, verbatim as of 2026-10-18 but for its
// placement (`fixed right-4 bottom-[3.4rem] z-[…] w-80 max-w-[92vw]`): the
// uploads panel's surface (`#uploads`), the reference for vp-popover with
// VitePress's VPMenu
export const OWN_DRIVE_UPLOADS = 'bg-[color:var(--vp-c-bg-elv)] border border-divider rounded-[.75rem] px-[.8rem] py-[.7rem] shadow-3';

// totality crates/store/src/pages.rs at cbcbb503, verbatim as of
// 2026-10-18: the line between the Google sign-in and the phone's form,
// its label between two rules (the two `<span>`s); the reference for
// vp-divider-label
export const TOTALITY_DIVIDER_LABEL = 'my-6 flex items-center gap-3 text-[0.8125rem] leading-5 text-secondary';
export const TOTALITY_DIVIDER_LINE = 'h-px flex-1 bg-divider';
