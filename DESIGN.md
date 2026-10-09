# The component library: its design

vpkit's components are VitePress's look as CSS classes an application page can use (`vp-btn`, `vp-input`, …). Six exist. This is the design of the library as a whole: what a component is, the rules every one follows, how it is proven, which components come next and why, what stays a utility, and how the apps built on vpkit move onto them. The README documents what ships; this documents what is decided.

What is called measured here was measured on 2026-10-09 against VitePress v2.0.0-alpha.20 (`test/upstream/SOURCE`) and the apps' sources in their sibling checkouts of that day (`../totality`, `../own-drive`); a claim marked *guessed* is one nobody measured.

## What a component is

A component is a class, or a block of a few classes, that gives an element the look of one of VitePress's components, and nothing else: no JavaScript, no page layout, no behavior beyond what CSS reads off the element's own state. The app opens the dialog and toggles the switch; the component shows the state the app set.

- Each component is one file, imported on its own (`@import "vpkit/button.css";`), so a site ships only the components it uses. The files are plain CSS in Tailwind's `components` layer, compiled by the site's Tailwind build with everything else.
- Each has a **source**: a VitePress component or stylesheet at the pinned tag, rendered next to the port in headless Chromium and compared property by property (`test/compare.mjs`); or, where VitePress has no such component, a **recipe** taken verbatim from one of the apps built on vpkit (`test/recipes.mjs`, with its path and date), compared the same way.
- The components are the **app** parts of VitePress: a button, a badge, an alert, a card, a table, an input, and the ones below. VitePress's docs layout (navbar, sidebar, outline, home page, search box) is `layout.css`, which keeps VitePress's markup and names with BEM separators, and its markdown is `content.css`; the README has their rules. This document is about the app components.

### Who the library is for

Two applications import vpkit components, and they are the evidence for what an app needs: **totality**'s store (`../totality/crates/store`: `vp-btn` and `vp-input`; its shared recipes are the constants of `src/ui.rs`) and **own-drive** (`../own-drive`: `vp-btn`; its recipes are the constants of `src/web.rs`). rustpress imports the tokens and the theme only and draws VitePress's layout with its own utilities; vpkit-zola imports the layout, the markdown and `badge.css`. own-mail borrows the `--vp-*` names for a design of its own (macOS Mail's) and imports nothing from vpkit, so its recipes are not evidence of what vpkit should hold. Demand below is counted over two apps, by the sites in their sources.

## Rules

Every component follows these. They are read off the six files that exist, not invented for the ones to come; where a rule is already followed, the file that follows it is named.

1. **One component, one file, in `@layer components`.** A utility on the same element always wins (`class="vp-btn px-8"`). Nothing is unlayered; nothing uses `!important` (measured: none in the six files).

2. **Flat names.** The block is `vp-<name>`; a modifier is `vp-<name>-<modifier>`, used only together with the block; a part is `vp-<name>-<part>`. No BEM separators: `vp-btn-brand`, `vp-card-title`, `vp-alert-title`. (`layout.css` is BEM, `vp-content--has-sidebar`, because VitePress names child components after their parents' parts; app components have no such collisions.) A part keeps VitePress's own name where the original has one: VPFeature's `.title` is `vp-card-title`, the custom block's `.custom-block-title` is `vp-alert-title`. A modifier's rule is the compound `.vp-x-mod.vp-x`, modifier first, so it wins over the block whatever the file order, and so tools that look for a class at the start of a selector find it (totality's CSS coverage test).

3. **An app block never takes a layout block's name.** `layout.css` has `vp-button` and `vp-feature` (VPButton and VPFeature as the home page needs them); the app versions are `vp-btn` and `vp-card`, so a page can load both files. The same holds for the components to come: VPSwitch is `vp-switch` in the layout, so the app's toggle is `vp-toggle`; VPMenu is `vp-menu`, so the app's menu is `vp-dropdown`.

4. **States are attributes, never classes.** `vp-btn:disabled`, `vp-input[aria-invalid="true"]`; to come, `vp-toggle[aria-checked="true"]`, `vp-dropdown-item[aria-current]`, `details.vp-alert-details[open]`. The markup an app already writes for accessibility is the markup the component reads, so there is nothing to keep in sync. (The layout's `vp-sidebar--open` and friends are the classes VitePress's own Vue components toggle, kept as they are.) The element supplies its role and its cursor: `vp-btn` goes on `<a href>` or `<button>`, which bring the pointer (`base.css` gives enabled buttons one). A component sets a cursor only where its original does (the details block's summary) or where the element has none to give (a label drawn as a choice card), plus the one addition the apps asked for, the not-allowed cursor of a disabled button.

5. **Component-local variables.** The block sets its own `--vp-<name>-*` from the theme's tokens (`--vp-btn-bg: var(--vp-button-alt-bg)`); a modifier overrides the locals and nothing else (`.vp-btn-brand.vp-btn { --vp-btn-bg: var(--vp-button-brand-bg); }`). Since every element sets all of its own, a component nested in another keeps its colors (an info alert inside a tip alert, tested). A component with no modifiers still declares a local where an app is known to override that color (totality's link hover is an AA fix), so the override is one rule on the block.

6. **Rules for what is inside sit behind `:where()`.** `:where(.vp-alert) a`, `:where(.vp-table) th`: no specificity added, so a component placed inside another keeps its own look (a `vp-btn` link in an alert is not restyled as a link, tested).

7. **Hover is `@variant hover`,** each in a rule of its own (nested in a rule with declarations, it would stay CSS nesting in an unminified build). Like Tailwind's `hover:` it applies only on a device that can hover; VitePress's hovers also stick to a tapped element on a touch screen. Each component has a touch-screen case: with `:hover` forced it must look as it does at rest.

8. **Size and placement are the page's.** No width, no margin, no position: `vp-input w-full`, `vp-btn w-full`, a dialog placed by `showModal()`. The exceptions are VitePress's own and the README names them: `vp-table`'s `margin: 1.25rem 0`, `vp-badge`'s `margin-left: 0.125rem`, `vp-card`'s `height: 100%` (VPFeature's, for a grid of equal boxes); `my-0`, `ml-0`, `h-auto` remove them. One exception to come is argued for below (`vp-dialog`'s width).

9. **Tokens: only the theme's, only the contract's.** A component reads the `--vp-*` variables of `tokens.css` and no literal color; vpkit adds no theme token (each of the 200 color themes would have to define it). It reads only the tokens every color theme must define, the contract `test/themes.mjs` derives, and derives anything else from them: `vp-badge-success` is `--vp-c-success-1` on `--vp-c-success-soft`, the two success tokens the contract has. See [The token contract](#the-token-contract) for the one place this is broken today.

10. **VitePress's motion.** Colors transition in 0.25s (0.1s on `:active`, as VPButton), surfaces that follow the appearance in 0.5s (the table rows, the menu). `base.css` neutralizes every transition and animation under `prefers-reduced-motion`, so a component carries no reduced-motion rule of its own.

11. **Dark mode comes through the tokens.** A component has no `.dark` rule unless its original has one (measured: none in the six files; VPSwitch colors its icon by `.dark`, and the appearance toggle will keep that rule).

12. **Additions are allowed, listed and tested.** Where an app needs what the original lacks, the component adds it: `vp-btn` is `inline-flex` with a 0.5rem gap so an icon sits beside its label, and dims when disabled. Every addition is named in the file header and the README, and tested against the original with the addition written inline (VPButton with `style="opacity:0.5;cursor:not-allowed"`). Every omission is named too (`vp-card` leaves out the feature icon).

13. **Each component ships complete:** the file with its header comment (the markup, the modifiers, the additions, the omissions), its cases in `test/cases.mjs` (box, colors, every state, touch, nested where it matters) and its README section. One commit per component, as the history has it.

## The token contract

`test/themes.mjs` holds every color theme to the tokens the base references: every `var(--vp-c-*)` in `index.css` and the four files it imports, minus the color ramps and the absolutes. That is 34 tokens today (measured with a re-implementation of its derivation, since `requiredTokens` is not exported):

```
bg bg-alt bg-elv bg-soft border divider gutter
text-1 text-2 text-3 neutral-inverse sponsor
brand-1 brand-2 brand-3 brand-soft default-1 default-2 default-3 default-soft
tip-1 tip-soft note-1 note-soft important-1 important-soft warning-1 warning-soft
danger-1 danger-soft caution-1 caution-soft success-1 success-soft
```

plus `--vp-shadow-1` to `-5`. The component files are not part of that base, so nothing holds the themes to what they reference, and the gap is real: `alert.css` reads `--vp-c-tip-2`, `-important-2`, `-warning-2`, `-danger-2` and `-caution-2` for its link hover colors, and no theme defines a role's `-2` (measured: `grep -l -- '--vp-c-<role>-2:' themes/*.css` finds 0 of 200 files for each of `tip`, `note`, `important`, `warning`, `danger`, `caution` and `success`, and 200 of 200 for `brand-2` and `default-2`). On a theme, a tip alert's link hovers to `--vp-c-tip-2`, which `tokens.css` derives from the themed `brand-2` (fine), but a warning alert's hovers to VitePress's stock yellow `#946300` whatever the theme's warning color is. The same scan over every other shipped file (`var(--vp-c-*)` references against the 34): the other five component files and `icons.css` read contract tokens only; `content.css` reads the same five `-2` tokens, for the custom blocks' link hovers, so the gap reaches the markdown on a theme too (vpkit-zola); `layout.css` reads `--vp-c-shadow-3`, which nothing defines anywhere, VitePress's own slip in VPSidebar.vue (`box-shadow: var(--vp-c-shadow-3)`, the phone's open sidebar) carried verbatim by the port, so that shadow never paints upstream either.

**Decision 1, for the owner.** Extend the contract to every shipped file: `themes.mjs`'s `baseCss()` takes the component files too (and `layout.css` and `content.css`, which also read tokens), so from then on a component can read only what the themes define, and the test says so. Then the alert's `-2` hovers go one of two ways:

- the generator (`scripts/gen-themes.py`) and the 24 curated themes grow `--vp-c-<role>-2` for the five roles (and `success-2`, for a future need), each a step of its `-1`; or
- the alert hovers its links on `-1` and keeps only VitePress's 0.75 opacity dim, a `known` difference with its reason.

Recommended: extend the contract either way, since it is the enforcement for every component below; take the second path for the alert (and for `content.css`, where the port keeps VitePress's rules and the difference would be a `known` entry of the layout test) unless a `-2` of a role is needed elsewhere, because the first means a new slot in the generator, which rewrites 196 files, and the four hand-tuned themes edited by hand (`scripts/gen-themes.py` says which), for one hover color. This decides a component below too: `vp-btn-danger` can only be the grounded form (danger text on the danger tint), since a solid one would need `danger-2` and `-3`, which own-drive derives per theme with `color-mix()` because the contract has neither.

## How a component is proven

`test/compare.mjs` renders a case twice in headless Chromium, with the original's classes and stylesheet and with vpkit's, in light and dark mode, and compares the computed styles of the elements the case names, with `:hover`, `:active` and `:focus` forced where the component has them, and on an emulated touch screen where it must rest. Lengths match within 1/32px because the shipped build is minified. A difference is a failure unless `known` lists it with its reason, and a `known` entry that stops occurring fails too.

For a component from a VitePress original:

- the original's file is added to `UPSTREAM` in `compare.mjs` and to the copy list in `test/upstream/SOURCE`; a `.vue` file contributes its `<style>` block. A `<style>` with `:deep()` (VPSwitch, VPSwitchAppearance, VPMenu) must go through `unwrapDeep` from `scripts/vitepress-port.mjs` first, as the layout port does, because a browser drops a selector with `:deep()`. `compare.mjs` takes the block verbatim today, so this is the first change for `vp-toggle`.
- the cases cover the box (display, borders, radii, padding, line height, font, geometry), the colors, each state against the original's, each addition against the original with the addition inline, and the touch screen.

For a component from an app recipe:

- the recipe is copied into `test/recipes.mjs` verbatim, with its file and the date, and `test/entry.css` scans that file so its utilities compile into the test stylesheet; the case compares the recipe on one element with the class on another, light and dark, hover and focus.
- a rule the recipe never had (the textarea's padding below) is tested as an addition is, against the rule written inline.

## The catalogue

### Shipped

| component | source | classes |
| --- | --- | --- |
| `vp-btn` | VPButton | `vp-btn-brand`, `vp-btn-sponsor`, `vp-btn-big`; `:disabled` |
| `vp-badge` | VPBadge | seven types, `vp-badge-success` (vpkit's), `vp-badge-small`; VPBadge's rules in doc headings and the doc footer |
| `vp-alert` | the custom blocks | six types, `vp-alert-title` |
| `vp-table` | the markdown table | — |
| `vp-card` | VPFeature | `vp-card-title`, `vp-card-details` |
| `vp-input` | totality's `input_base!` | `aria-invalid` |

### Tier 1: next

Each has a VitePress original and an app that draws it by hand today, or no original and the strongest demand of the two apps.

| component | source | demand (measured) |
| --- | --- | --- |
| `vp-toggle` | VPSwitch, VPSwitchAppearance | totality `views.rs:196` (the 40×22 track rebuilt from utilities), own-drive `web.rs:714` (`#themeToggle`) |
| `vp-input` on `<select>` and `<textarea>` | the input itself | own-drive `web.rs:704`, `web.rs:2358`: two selects styled as its text inputs are (the pattern; own-drive's input recipe is its own look, not `vp-input`) |
| `vp-link` | `vp-doc.css`: `.vp-doc a` | totality `ui.rs`: `LINK`, `LINK_BUTTON`, the `[&_a]` of `PROSE` and `PROSE_LEDE` |
| `vp-code` | `vp-doc.css`: `.vp-doc :not(pre) > code` | totality `ui.rs`: `CODE`, the `[&_code]` of `PROSE` |
| `vp-spinner` | VPLocalSearchBox: `.search-loading.active` | totality `ui.rs`: `SPINNER` |
| `vp-dialog` | own-drive's `MODAL` (a recipe) | own-drive `web.rs:1895`, `:1985`, `:2043`, `:2344` (four modals), plus two overlays with `role="dialog"` |

#### `vp-toggle`

VPSwitch, the track with a sliding knob, with VPSwitchAppearance's sun and moon as a modifier.

```html
<button class="vp-toggle" type="button" role="switch" aria-checked="false" aria-label="Notifications">
  <span class="vp-toggle-check"></span>
</button>

<button class="vp-toggle vp-toggle-appearance" type="button" role="switch" aria-checked="false" aria-label="Appearance">
  <span class="vp-toggle-check"><span class="vp-toggle-icon">
    <span class="vpi-sun" aria-hidden="true"></span><span class="vpi-moon" aria-hidden="true"></span>
  </span></span>
</button>
```

- `vp-toggle` ← `.VPSwitch`: `position: relative; display: block; width: 2.5rem; height: 1.375rem; border-radius: 0.6875rem; flex-shrink: 0; border: 1px solid var(--vp-input-border-color); background-color: var(--vp-input-switch-bg-color); transition: border-color 0.25s`; hover `border-color: var(--vp-c-brand-1)` (`@variant hover`).
- `vp-toggle-check` ← `.check`: the 1.125rem round knob at `top: 1px; left: 1px`, `--vp-c-neutral-inverse` under `--vp-shadow-1`, `transition: transform 0.25s`.
- `vp-toggle-icon` ← `.icon`: the 1.125rem round clip; an icon inside (`[class^='vpi-']`, from `icons.css`) is 0.75rem at 0.1875rem, `--vp-c-text-2`, and `--vp-c-text-1` under `.dark` with VitePress's `opacity 0.25s` transition.
- State: `.vp-toggle[aria-checked="true"] .vp-toggle-check { transform: translateX(1.125rem) }`, VPSwitchAppearance's rule keyed on the ARIA state instead of `.dark`, so the toggle serves any setting.
- `vp-toggle-appearance`: the appearance switch. The knob moves under `.dark` as VPSwitchAppearance's does (so it is right before any script runs), `vpi-sun` shows in light and `vpi-moon` in dark. An app's script toggles `.dark` on `<html>` and syncs `aria-checked`; vpkit ships no script (vpkit-zola's `static/vpkit-zola.js` has VitePress's behavior).
- Tokens read: `--vp-input-border-color`, `--vp-input-switch-bg-color`, `--vp-c-brand-1`, `--vp-c-neutral-inverse`, `--vp-shadow-1`, `--vp-c-text-1`, `--vp-c-text-2`, all in the contract.
- Differences from the original: the knob follows `aria-checked` (VPSwitch has no checked state of its own; only the appearance switch moves it, by `.dark`); the hover is `@variant hover`. Nothing omitted.
- Cases: the box, the knob and the icon against VPSwitch at rest and `:hover`; `aria-checked="true"` against VPSwitchAppearance in a `.dark` page (the same mode on both sides, the transform compared); `vp-toggle-appearance` in light and dark against VPSwitchAppearance (the transform, the two icons' opacities, the icon color); touch. Both originals need `unwrapDeep`.

#### `vp-input` on `<select>` and `<textarea>`

No `vp-select` or `vp-textarea`: the one class is the box for the three text-like controls. Measured (a probe in headless Chromium on the shipped build, 2026-10-09, fifteen assertions): `select.vp-input` already renders the input's box exactly, 44px tall, the input border, background, 8px radius, 16px text and 12px side padding, and keeps the native arrow (`appearance: auto`). `textarea.vp-input` keeps the box too but is clamped to the input's 44px with no vertical padding, so `input.css` gains one element-qualified rule:

```css
textarea.vp-input {
  height: auto;
  min-height: 2.75rem;
  padding-block: 0.625rem;
}
```

Measured with that rule in place: a three-row textarea renders 94px tall with 10px block padding, the input's border and background, and the input itself is unchanged. `rows` and `resize` stay the markup's. The hover, focus, placeholder and `aria-invalid` rules are the class's and so apply to all three.

- Cases: `select.vp-input` against `input.vp-input` in the same stylesheet (a `reference` case: box and colors, hover, focus); `textarea.vp-input` against the input for the shared properties and against the rule written inline for its own, as `vp-btn`'s additions are tested.
- The option list of a `<select>` is the browser's and follows `color-scheme`, which `base.css` sets from `.dark`; nothing to style.

#### `vp-link`

VitePress's link, `.vp-doc a`, as a class: for a link outside the markdown, and for a button drawn as a link.

```html
<a class="vp-link" href="/orders">All orders</a>
<button class="vp-link min-h-10 px-2" type="button">Cancel</button>
```

- `vp-link`: `--vp-link-color: var(--vp-c-brand-1); --vp-link-hover: var(--vp-c-brand-2)` (rule 5: totality overrides the hover for AA, `text-link-hover` in its `store.css`, and this makes that override `.vp-link { --vp-link-hover: … }`); `font-weight: 500; color: var(--vp-link-color); text-decoration: underline; text-underline-offset: 0.125rem; transition: color 0.25s, opacity 0.25s`; hover `color: var(--vp-link-hover)`.
- `:where(.vp-link) > code { color: var(--vp-code-link-color) }`, and on hover `var(--vp-code-link-hover-color)`: VitePress's two rules for code in a link.
- Tokens: `brand-1`, `brand-2`, `--vp-code-link-color`, `--vp-code-link-hover-color` (both `brand-1`/`-2`), in the contract.
- On a `<button>`: UNVERIFIED (not probed) that Tailwind's preflight leaves nothing else to reset for a button to render as the `<a>` does; the case will say. The 40px hit area totality gives its text buttons stays utilities (`min-h-10 px-2`).
- Cases: an `<a>` and a `<button>` against `.vp-doc a` (color, weight, decoration, offset, transition; hover; a `<code>` inside, at rest and on hover); touch.

#### `vp-code`

VitePress's inline code as a class, for code outside the markdown: an order id, a serial, a key.

```html
<code class="vp-code">ORD-2026-0142</code>
```

- `vp-code` ← `.vp-doc :not(pre, h1, h2, h3, h4, h5, h6) > code` and `.vp-doc :not(pre) > code`: `font-size: var(--vp-code-font-size); color: var(--vp-code-color); border-radius: 0.25rem; padding: 0.1875rem 0.375rem; background-color: var(--vp-code-bg); transition: color 0.25s, background-color 0.5s`. The font family is the page's `code` rule (Tailwind's preflight takes the theme's mono family, which `theme.css` sets to `--vp-font-family-mono`); the case compares it.
- Tokens: `--vp-code-color` (`brand-1`), `--vp-code-bg` (`default-soft`), in the contract.
- Where not to use it: inside a `vp-alert`, a plain `<code>` takes the alert's tint (`:where(.vp-alert) code`) and `vp-code` would beat it (rule 6 is what lets a component inside an alert keep its look); inside a `vp-link`, a plain `<code>` takes the link's color; inside `.vp-doc`, `content.css` styles every `code`.
- Cases: against `.vp-doc p > code` (font size and family, color, radius, padding, background, transition), light and dark.

#### `vp-spinner`

VPLocalSearchBox's loading ring, the one spinner VitePress draws.

```html
<span class="vp-spinner" role="status" aria-label="Loading"></span>
<button class="vp-btn vp-btn-brand" disabled><span class="vp-spinner size-4"></span>Paying…</button>
```

- `vp-spinner` ← `.search-loading.active`: `display: inline-block; width: 1.125rem; height: 1.125rem; flex: none; border: 2px solid var(--vp-c-divider); border-top-color: var(--vp-c-brand-1); border-radius: 50%; animation: vp-spin 0.8s linear infinite`, with the keyframes `to { transform: rotate(360deg) }`. It spins whenever it is rendered; showing and hiding it is the app's (`hidden`, htmx's `htmx-indicator`).
- Omitted: the original's `visibility: hidden` at rest (that is the showing and hiding) and its `margin: 0.5rem` (placement). The reduced-motion rule is `base.css`'s.
- Tokens: `divider`, `brand-1`, in the contract.
- Cases: against `.search-loading.active` (box, borders, radius, animation duration, timing and iteration count), light and dark. The keyframes' names differ, so `animation-name` is not compared.

#### `vp-dialog`

own-drive's modal (`web.rs:457`, the recipe) on the `<dialog>` element, which brings the top layer, the focus trap, Escape and `::backdrop`.

```html
<dialog class="vp-dialog" aria-labelledby="rename-title">
  <h2 class="vp-dialog-title" id="rename-title">Rename</h2>
  <p>…</p>
  <div class="vp-dialog-actions">
    <button class="vp-btn" type="button">Cancel</button>
    <button class="vp-btn vp-btn-brand" type="submit">Rename</button>
  </div>
</dialog>
```

- `vp-dialog` ← `MODAL`: `border: 1px solid var(--vp-c-divider); border-radius: 0.75rem; padding: 1.15rem 1.25rem; width: 26rem; max-width: 92vw; color: var(--vp-c-text-1); background-color: var(--vp-c-bg-elv); box-shadow: var(--vp-shadow-4)`; `::backdrop { background-color: var(--vp-backdrop-bg-color) }` ← `MODAL_BACK`'s scrim. The width is the recipe's and a utility overrides it (`w-[32rem]`): a dialog with no width collapses to its content, so this is the one component with a width (rule 8's exception, Decision 4).
- `vp-dialog-title` ← `MODAL_H3`: `margin: 0 0 0.6rem; font-size: 1.05rem; font-weight: 600`.
- `vp-dialog-actions` ← `BTN_ROW`: `display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem`.
- Tokens: `divider`, `text-1`, `bg-elv`, `--vp-shadow-4`, `--vp-backdrop-bg-color`, in the contract.
- Placement: `showModal()` centers the dialog (the browser's `margin: auto` in the top layer); the component sets no position. `MODAL_P`'s paragraph rules stay utilities.
- Not ported: own-drive's `#modalBack` scrim element and its z-index (`--od-z-modal`); the top layer needs neither. own-drive's modals are `<div role="dialog">` behind a scrim today; moving them to `<dialog>` is a change in its `app.js`, in the migration map.
- Cases: the box against `MODAL` on a `<div>` (a recipe case), `vp-dialog-title` and `vp-dialog-actions` against theirs; `::backdrop` against `--vp-backdrop-bg-color`. UNVERIFIED (not probed): whether `getComputedStyle(dialog, '::backdrop')` resolves on a dialog that is not open; the plan is to open it with `showModal()` in the case's markup, which the test page executes, and compare the real backdrop.

### Tier 2: VitePress has it, no app asks yet

The originals exist at the pinned tag; neither app draws one today (measured over `../totality/crates/store/src` and `../own-drive/src`: no `role="menu"`, no `<details>`, no `role="tab"`, no `<kbd>`, no `<mark>`). Build one when an app needs it, in this shape:

| component | original | shape | open point |
| --- | --- | --- | --- |
| `vp-dropdown` | VPMenu, VPMenuLink, VPMenuGroup | `vp-dropdown`, the panel: 0.75rem radius and padding, `min-width: 8rem`, a divider border, `bg-elv`, `--vp-shadow-3`, `max-height: calc(100vh - var(--vp-nav-height))` and scrolls. `vp-dropdown-item` ← `.link`: block, 0.375rem radius, `0 0.75rem` padding, line height 2.2857143, 0.875rem/500, `text-1`, hover `brand-1` on `default-soft`, the current item (`[aria-current]`, where VPMenuLink has `.active`) `brand-1`. `vp-dropdown-group` with `vp-dropdown-title` ← `.title`: `text-2`/600, a divider above each group but the first | the trigger and the panel's position are the app's (VPFlyout's `top` is the navbar's). own-mail's menus are its own look, not evidence |
| `vp-icon-btn` | VPSocialLink | a 2.25rem square flex box, `text-2`, hover `text-1` (0.5s and 0.25s transitions), a 1.25rem icon, `svg { fill: currentColor }` | own-drive's `BTN_ICON` (`web.rs:383`, six sites) is 2rem with a 0.5rem radius, a `default-soft` hover ground and `default-2` when active; an icon button without a hover ground reads as decoration, so the ground is a candidate addition (rule 12), Decision 3 |
| `vp-alert-details` | `custom-block.css`: `.custom-block.details`; `vp-doc.css`: `summary` | the alert's missing type, on `<details class="vp-alert vp-alert-details">` with `<summary class="vp-alert-title">`: the info colors, the summary `font-weight: 700`, `cursor: pointer`, `user-select: none`, `margin: 0 0 0.5rem`, the `summary + p` margins | the `[open]` state is the element's; nothing else |
| `vp-tabs` | `vp-code-group.css`: `.tabs`, `label` | the bar (`--vp-code-tab-bg`, an inset 1px `--vp-code-tab-divider`, `overflow-x: auto`, 0.5rem top radii from 640px) and the tab (`0 0.75rem` padding, line height 3.4285714, 0.875rem/500, `--vp-code-tab-text-color`, the hover and selected text colors, the selected tab's 2px `--vp-code-tab-active-bar-color` bar as `::after`); `role="tab"` buttons with `aria-selected` where VitePress has `input:checked + label` | showing the panels is the app's |
| `vp-kbd` | VPLocalSearchBox: `.search-keyboard-shortcuts kbd` | inline-block, `rgba(128,128,128,0.1)` inside a `rgba(128,128,128,0.15)` border, 0.25rem radius, `0.1875rem 0.375rem` padding, `min-width: 1.5rem`, centered, `0 2px 2px 0 rgba(0,0,0,0.1)` | VitePress's literal grays, the same in both modes: the one original with no token to read, so rule 9 is kept by copying them |
| `vp-mark` | VPLocalSearchBox: `mark` | `--vp-local-search-highlight-bg` on `--vp-local-search-highlight-text`, 0.125rem radius, `0 0.125rem` padding | the tokens are the search's, `brand-1` and `neutral-inverse` |

### Tier 3: an app recipe, one consumer

No original; one of the two apps draws it. Build one when the second app needs it, or when the owner wants the app's recipe held by vpkit's tests.

| component | recipe | shape | note |
| --- | --- | --- | --- |
| `vp-btn-danger` | own-drive `BTN_DANGER` (`web.rs:376`; `DANGER_C` at `:366`) | a `vp-btn` modifier in the variable pattern: transparent border, `danger-1` text on `danger-soft`, the same on hover and active (the ground is the point) | the grounded form only: a solid white-on-danger needs `danger-2` and `-3`, outside the contract (Decision 1). own-drive's demoted variant (neutral until hovered, `:380`) is its own |
| `vp-choice` | totality `CHOICE` (`ui.rs`) | a `<label>` card around a radio or checkbox: a divider border on `bg`, 0.5rem radius, 1rem padding, `gap: 0.75rem`, 0.875rem/1.5; hover a `brand-1` border; `:has(:checked)` a `brand-1` border on `brand-soft`; `:has(:focus-visible)` a 2px `brand-1` outline offset 2px; the control `accent-color: var(--vp-c-brand-1)` | one site (`views.rs:865`) |
| `vp-label`, `vp-field-error` | totality `FIELD_LABEL`, `MSG_ERROR` (`ui.rs`) | the field's label (block, 0.875rem/1.5, 500, `text-1`, `margin-bottom: 0.375rem`) and the error line under the control (0.875rem/1.5, `danger-1`, `margin-top: 0.5rem`) | five utilities each; own-drive's labels not measured (guessed: utilities). Borderline by the test below, Decision 6 |
| `vp-toast` | own-drive `#msg` (`web.rs:750`) | the surface of a status message: `bg-elv`, a divider border, 0.75rem radius, `--vp-shadow-3`, padding; the placement (fixed, bottom center) and the live region are the app's | totality shows results inline (`RESULT`), not as a toast |
| `vp-progress` | own-drive `BAR`, `BAR_FILL` (`web.rs:463`) | a 0.3rem track on `default-soft` with 0.15rem radii, a `brand-1` fill | two spans; a native `<progress>` needs vendor pseudo-elements. One site (the quota bar; the load bar is another thing) |

### Not components

A pattern stays a utility string in the app when it is layout or spacing, when it has no state, pseudo-element or nested rule of its own, or when it belongs to one app's design rather than VitePress's. From the two apps' recipes these stay where they are: own-drive's `EMPTY` (three utilities), `MUT` and `SZ` (two), `BTN_ROW`, the `ROWBTN` gaps, its table (`TD`, `TH`, `TR`: bottom dividers only, 0.78rem headers, its own look and not VitePress's bordered table), its cards (transparent with a divider border, not VPFeature's), its links (`DL`: `text-1` to `brand-1`, no underline); totality's `FORM_COLUMN`, `FIELD`, `CHOICE_GROUP`, `RESULT`, `NOTE`, `LEDE`, the `ROSTER_*` rows, and `H1`, `H2`, `H3`, `LIST_*` (VitePress's heading scale, which `vp-doc` gives whole). own-mail's chips, verbs and menus are its own design.

**Class-less markup is `vp-doc`.** totality's `PROSE` and `PROSE_LEDE` carry VitePress's element rules as `[&_h2]:…` variants for HTML it cannot class (the FAQ, course introductions from a cache). That is what `content.css` is: `<div class="vp-doc">` around the markup gives VitePress's headings, paragraphs, links, lists, code, blockquotes, tables and rules exactly. Measured on a minified build: Tailwind's preflight with `index.css` alone is 20,085 bytes, 4,842 gzipped; with `content.css` added, 35,597 and 7,369, so the markdown rules cost 2.5 KB gzipped, code-block rules included. No `vp-prose` with the text rules alone: the saving is under 2 KB, and it would mean a filtered second output of the port script to keep in step with `content.css`.

VitePress parts that stay in `layout.css` and are not app components: the hamburger, the doc footer's pager, the outline and its marker, the sidebar items, the hero, the site footer, the team members and the sponsors, the flyout (its position is the navbar's), the search box's shell (a search dialog, not a dialog).

## Migration map

What each app's recipe becomes, and what stands in the way. The apps decide; this lists the moves.

**totality** (`crates/store/src/ui.rs`, `views.rs`):

| recipe | becomes | in the way |
| --- | --- | --- |
| `BTN_*`, `INPUT*` | `vp-btn`, `vp-input` | done |
| `TABLE` | `vp-table` on the `<table>` (it is its own scroller) | the recipe wraps the table in a scrolling `<div>`; its `[&_table]:w-max` goes |
| `CARD` | `vp-card px-5 py-4 h-auto` | `vp-card` is a flex column at `height: 100%`, for a grid of features; a record card overrides both |
| `BLOCK_INFO`, `BLOCK_TIP`, `BLOCK_DANGER`, `BLOCK_TITLE` | `vp-alert my-4`, `vp-alert-tip`, `vp-alert-danger`, `vp-alert-title` | totality's blocks drop VitePress's 0.75 hover dim on links (AA) and color every type's links `brand-1`; `vp-alert` keeps the dim and VitePress's per-type link colors. An override in its `store.css` (`.vp-alert a:hover { opacity: 1 }`), or accept |
| `BADGE_SUCCESS`, `BADGE_DANGER` | `vp-badge vp-badge-success`, `vp-badge-danger` | measured by totality (the comment in its `ui.rs`): VitePress's translucent success tint over a `bg-soft` card leaves the text at 4.42:1 in light, so its badge is opaque `bg` with a soft border. Decision 5 |
| `SPINNER` | `vp-spinner size-4` with the htmx indicator utilities | the recipe's ring is `currentColor` with a transparent quarter, the original's a divider ring with a brand quarter: the look changes |
| `LINK`, `LINK_BUTTON`, the `[&_a]` of `PROSE` | `vp-link`, `vp-link min-h-10 px-2`, `vp-doc` | the store's AA hover (`text-link-hover`) becomes `.vp-link { --vp-link-hover: var(--store-link-hover) }` |
| `CODE`, the `[&_code]` of `PROSE` | `vp-code`, `vp-doc` | — |
| `H1`, `H2`, `H3`, `LEDE`, `LIST_*`, `PROSE`, `PROSE_LEDE` | `vp-doc` (`content.css`, 2.5 KB gzipped) around class-less markup; the classed headings stay utilities or move inside it | `PROSE_LEDE`'s `text-2` body stays a utility on the wrapper |
| the appearance switch (`views.rs:196`) | `vp-toggle vp-toggle-appearance` with `vpi-sun` and `vpi-moon` from `icons.css` | the store's inline `SUN_SVG` and `MOON_SVG`, or keep them inside `vp-toggle-icon` |
| `FIELD_LABEL`, `MSG_ERROR`, `CHOICE` | Tier 3 | — |

**own-drive** (`src/web.rs`, `src/web/assets/app.js`):

| recipe | becomes | in the way |
| --- | --- | --- |
| `BTN`, `BTN_PRIMARY` | `vp-btn`, `vp-btn-brand` | done; `VP_BTN_EXTRA` (a 0.3rem gap, the pointer since `base.css` is not imported, the plain cursor when disabled) is own-drive's choice and stays |
| `#themeToggle` | `vp-toggle vp-toggle-appearance` | its sun and moon are its own icon set (`ic-sun`, `ic-moon`); they go inside `vp-toggle-icon` as VitePress's do |
| `#themeSelect`, `#shareExpires` | stay, with `INPUT` | own-drive's inputs are its own look (no fixed height, the background swaps to `bg` on focus); its selects carry that recipe and stay with it. If own-drive ever moves to `vp-input`, the selects move as they are |
| `MODAL`, `MODAL_BACK`, `MODAL_H3`, `BTN_ROW` | `vp-dialog`, its `::backdrop`, `vp-dialog-title`, `vp-dialog-actions` | the modals are `<div role="dialog">` behind a scrim `<div>`; `<dialog>` and `showModal()` in `app.js` replace the scrim, the z-index and the focus handling. `MODAL_P` and `MODAL_ERR` stay utilities |
| `BTN_DANGER` | Tier 3 `vp-btn-danger` | the demoted variant stays |
| `BTN_ICON`, `BTN_CHIP` | Tier 2 `vp-icon-btn` (`size-[1.9rem]` for the chip) | the hover ground, Decision 3 |
| `TD`, `TH`, `TR`, the cards, `DL`, `INPUT` | stay | own-drive's own looks |
| `BAR`, `#msg`, `EMPTY` | Tier 3, Tier 3, stays | — |

## Order of work

One commit per step, each with its cases green (`npm test`) and its README section, as the history has it.

1. **The contract.** `test/themes.mjs` reads the component files (and `layout.css`, `content.css`, `icons.css`) into the base it derives the required tokens from, with `--vp-c-shadow-3` excluded by name as VitePress's own undefined variable; the five `-2` hovers of the alert and of `content.css` go the way Decision 1 says. Before any component, because every one below is held to it.
2. **`compare.mjs` learns `:deep()`.** Originals run through `unwrapDeep`. No visible change; the existing cases stay green.
3. `vp-toggle`, with `vp-toggle-appearance`.
4. `vp-input` on `<select>` and `<textarea>`: the textarea rule, the two cases, the README's input section.
5. `vp-link`.
6. `vp-code`.
7. `vp-spinner`.
8. `vp-dialog`.
9. Tier 2 and Tier 3 as demand appears, in the shapes above; a row here is revised when it is built.

## Open decisions

Numbered, each with a recommendation; the owner decides.

1. **The contract gap** (above): extend `themes.mjs` to every shipped file, and for the `-2` hovers of the alert and the markdown's custom blocks either define `-2` per role in 200 themes or hover on `-1` with the dim as a `known` difference. Recommended: extend; hover on `-1`.
2. **Names** for the app versions of layout blocks: `vp-toggle` (VPSwitch) and `vp-dropdown` (VPMenu). Alternatives considered, `vp-switch-btn` and `vp-menu-box`, read as parts of the layout's blocks. Recommended as named.
3. **`vp-icon-btn`'s source**: VPSocialLink's bare box as the original with own-drive's hover ground as a tested addition, or own-drive's `BTN_ICON` as the recipe and no original. Recommended: the original plus the addition, as `vp-btn` was done.
4. **`vp-dialog`'s width**: the recipe's `26rem` and `92vw` in the component, overridden by utilities, or none, every app adding its own. Recommended: the recipe's; a dialog with no width is unusable as shipped, unlike an input.
5. **Badge contrast on soft surfaces**: totality measured 4.42:1 for success text on VitePress's translucent tint over `bg-soft`. A `vp-badge-outline` (opaque `bg`, a soft border, totality's shape) as vpkit's addition, or leave it to the app. Recommended: leave it until a second app hits it; VitePress's badge sits on the page background, where its tint is right.
6. **`vp-label` and `vp-field-error`**: five utilities each, one consumer. Recommended: not yet.
7. **A floating surface**: `vp-dropdown`, `vp-dialog` and `vp-toast` share `bg-elv` inside a divider border with a 0.75rem radius and a shadow (VitePress's outline dropdown and own-drive's uploads panel too). A shared primitive would be premature with none of the three built; revisit when two are.
