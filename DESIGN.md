# The component library: its design

vpkit's components are VitePress's look as CSS classes an application page can use (`vp-btn`, `vp-input`, …). Twenty exist, one file each, as of 2026-10-10. This is the design of the library as a whole: what a component is, the rules every one follows, how it is proven, which components come next and why, what stays a utility, and how the apps built on vpkit move onto them. The documentation (`docs/`) documents what ships; this documents what is decided.

What is called measured here was measured on 2026-10-09 or 2026-10-10 against VitePress v2.0.0-alpha.20 (`test/upstream/SOURCE`) and the apps' sources in their sibling checkouts of that day (`../totality`, `../own-drive`); a claim marked *guessed* is one nobody measured.

## What a component is

A component is a class, or a block of a few classes, that gives an element the look of one of VitePress's components, and nothing else: no JavaScript, no page layout, no behavior beyond what CSS reads off the element's own state. The app opens the dialog and toggles the switch; the component shows the state the app set.

- Each component is one file, imported on its own (`@import "vpkit/button.css";`), so a site ships only the components it uses. The files are plain CSS in Tailwind's `components` layer, compiled by the site's Tailwind build with everything else.
- Each has a **source**: a VitePress component or stylesheet at the pinned tag, rendered next to the port in headless Chromium and compared property by property (`test/compare.mjs`); or, where VitePress has no such component, a **recipe** taken verbatim from one of the apps built on vpkit (`test/recipes.mjs`, with its path and date), compared the same way.
- The components are the **app** parts of VitePress: a button, a badge, an alert, a card, a table, an input, and the ones below. VitePress's docs layout (navbar, sidebar, outline, home page, search box) is `layout.css`, which keeps VitePress's markup and names with BEM separators, and its markdown is `content.css`; the documentation's Docs Layout page has their rules. This document is about the app components.

### Who the library is for

Two applications import vpkit components, and they are the evidence for what an app needs: **totality**'s store (`../totality/crates/store`: `vp-btn` and `vp-input`; its shared recipes are the constants of `src/ui.rs`) and **own-drive** (`../own-drive`: `vp-btn`; its recipes are the constants of `src/web.rs`). rustpress imports the tokens and the theme only and draws VitePress's layout with its own utilities; vpkit-zola imports the layout, the markdown and `badge.css`. own-mail borrows the `--vp-*` names for a design of its own (macOS Mail's) and imports nothing from vpkit, so its recipes are not evidence of what vpkit should hold. Demand below is counted over two apps, by the sites in their sources.

## Rules

Every component follows these. They were read off the six files that existed when this was written, not invented for the ones to come, and the fourteen built since follow them; where a rule is already followed, the file that follows it is named.

1. **One component, one file, in `@layer components`.** A utility on the same element always wins (`class="vp-btn px-8"`). Nothing is unlayered; nothing uses `!important` (measured: none in the twenty component files).

2. **Flat names.** The block is `vp-<name>`; a modifier is `vp-<name>-<modifier>`, used only together with the block; a part is `vp-<name>-<part>`. No BEM separators: `vp-btn-brand`, `vp-card-title`, `vp-alert-title`. (`layout.css` is BEM, `vp-content--has-sidebar`, because VitePress names child components after their parents' parts; app components have no such collisions.) A part keeps VitePress's own name where the original has one: VPFeature's `.title` is `vp-card-title`, the custom block's `.custom-block-title` is `vp-alert-title`. A modifier's rule is the compound `.vp-x-mod.vp-x`, modifier first, so it wins over the block whatever the file order, and so tools that look for a class at the start of a selector find it (totality's CSS coverage test).

3. **An app block never takes a layout block's name.** `layout.css` has `vp-button` and `vp-feature` (VPButton and VPFeature as the home page needs them); the app versions are `vp-btn` and `vp-card`, so a page can load both files. The same holds for the components to come: VPSwitch is `vp-switch` in the layout, so the app's toggle is `vp-toggle`; VPMenu is `vp-menu`, so the app's menu is `vp-dropdown`.

4. **States are attributes, never classes.** `vp-btn:disabled`, `vp-input[aria-invalid="true"]`; to come, `vp-toggle[aria-checked="true"]`, `vp-dropdown-item[aria-current]`, `details.vp-alert-details[open]`. The markup an app already writes for accessibility is the markup the component reads, so there is nothing to keep in sync. (The layout's `vp-sidebar--open` and friends are the classes VitePress's own Vue components toggle, kept as they are.) The element supplies its role and its cursor: `vp-btn` goes on `<a href>` or `<button>`, which bring the pointer (`base.css` gives enabled buttons one). A component sets a cursor only where its original does (the details block's summary) or where the element has none to give (a label drawn as a choice card), plus the one addition the apps asked for, the not-allowed cursor of a disabled button.

5. **Component-local variables.** The block sets its own `--vp-<name>-*` from the theme's tokens (`--vp-btn-bg: var(--vp-button-alt-bg)`); a modifier overrides the locals and nothing else (`.vp-btn-brand.vp-btn { --vp-btn-bg: var(--vp-button-brand-bg); }`). Since every element sets all of its own, a component nested in another keeps its colors (an info alert inside a tip alert, tested). A component with no modifiers still declares its colors as locals (`vp-link`'s), so recoloring one block is one rule on it. An app-wide color fix belongs on the theme token the local reads: totality's AA link hover is `.dark { --vp-c-brand-2: var(--vp-c-text-1) }`, which also reaches code in a link and the markdown's links, where a local would not (the migration map).

6. **Rules for what is inside sit behind `:where()`.** `:where(.vp-alert) a`, `:where(.vp-table) th`: no specificity added, so a component placed inside another keeps its own look (a `vp-btn` link in an alert is not restyled as a link, tested).

7. **Hover is `@variant hover`,** each in a rule of its own (nested in a rule with declarations, it would stay CSS nesting in an unminified build). Like Tailwind's `hover:` it applies only on a device that can hover; VitePress's hovers also stick to a tapped element on a touch screen. Each component has a touch-screen case: with `:hover` forced it must look as it does at rest.

8. **Size and placement are the page's.** No width, no margin, no position: `vp-input w-full`, `vp-btn w-full`, a dialog placed by `showModal()`. The exceptions are VitePress's own and the documentation names them: `vp-table`'s `margin: 1.25rem 0`, `vp-badge`'s `margin-left: 0.125rem`, `vp-card`'s `height: 100%` (VPFeature's, for a grid of equal boxes); `my-0`, `ml-0`, `h-auto` remove them. So do `vp-label`'s 0.375rem below it and `vp-field-error`'s 0.5rem above it, a field's own spacing, kept from totality's recipes. `vp-dialog` has a width (Decision 4) and `margin: auto`, which gives the browser back its centering of a modal dialog rather than placing it. `vp-progress` is `width: 100%`: a track has no content to size it, so in a flex row it was 0px wide (the review of 2026-10-10); a width utility sets another.

9. **Tokens: only the theme's, only the contract's.** A component reads the `--vp-*` variables of `tokens.css` and no literal color; vpkit adds no theme token (each of the 222 color themes would have to define it). The one exception is `vp-kbd`, whose original has no token to read: VitePress's half-transparent grays, the same in both modes, copied. It reads only the tokens every color theme must define, the contract `test/themes.mjs` derives, and derives anything else from them: `vp-badge-success` is `--vp-c-success-1` on `--vp-c-success-soft`, the two success tokens the contract has. See [The token contract](#the-token-contract) for how the test enforces it and the gap it closed.

10. **VitePress's motion.** Colors transition in 0.25s (0.1s on `:active`, as VPButton), surfaces that follow the appearance in 0.5s (the table rows, the menu). `base.css` neutralizes every transition and animation under `prefers-reduced-motion`, so a component carries no reduced-motion rule of its own, unless its original does: the spinner keeps VitePress's, so it stops on a page without `base.css` too.

11. **Dark mode comes through the tokens.** A component has no `.dark` rule unless its original has one (measured: only `toggle.css` has one, VPSwitch's, which colors its icon by `.dark` and moves the appearance switch's knob).

12. **Additions are allowed, listed and tested.** Where an app needs what the original lacks, the component adds it: `vp-btn` is `inline-flex` with a 0.5rem gap so an icon sits beside its label, and dims when disabled. Every addition is named in the file header and on the component's page of the documentation, and tested against the original with the addition written inline (VPButton with `style="opacity:0.5;cursor:not-allowed"`). Every omission is named too (`vp-card` leaves out the feature icon).

13. **Each component ships complete:** the file with its header comment (the markup, the modifiers, the additions, the omissions), its cases in `test/cases.mjs` (box, colors, every state, touch, nested where it matters) and its page in `docs/content/components/`, with live examples (`test/docs.mjs` fails without one; before 2026-10-10, a README section). One commit per component, as the history has it.

## The token contract

`test/themes.mjs` holds every color theme to the tokens vpkit's stylesheets reference: every `var(--vp-c-*)` in the root stylesheets, minus the color ramps and the absolutes. Until 2026-10-09 that base was `index.css` and the four files it imports, and the contract 34 tokens (measured with a re-implementation of its derivation, since `requiredTokens` is not exported):

```
bg bg-alt bg-elv bg-soft border divider gutter
text-1 text-2 text-3 neutral-inverse sponsor
brand-1 brand-2 brand-3 brand-soft default-1 default-2 default-3 default-soft
tip-1 tip-soft note-1 note-soft important-1 important-soft warning-1 warning-soft
danger-1 danger-soft caution-1 caution-soft success-1 success-soft
```

plus `--vp-shadow-1` to `-5`. The component files were not part of that base, so nothing held the themes to what they reference, and the gap was real: `alert.css` reads `--vp-c-tip-2`, `-important-2`, `-warning-2`, `-danger-2` and `-caution-2` for its link hover colors, and no theme defined a role's `-2` (measured before the fix: `grep -l -- '--vp-c-<role>-2:' themes/*.css` found 0 of 200 files for each of `tip`, `note`, `important`, `warning`, `danger`, `caution` and `success`, and 200 of 200 for `brand-2` and `default-2`). On a theme, a tip alert's link hovered to `--vp-c-tip-2`, which `tokens.css` derives from the themed `brand-2` (fine), but a warning alert's hovered to VitePress's stock yellow `#946300` whatever the theme's warning color was. The same scan over every other shipped file (`var(--vp-c-*)` references against the 34): the other five component files and `icons.css` read contract tokens only; `content.css` reads the same five `-2` tokens, for the custom blocks' link hovers, so the gap reached the markdown on a theme too (vpkit-zola); `layout.css` reads `--vp-c-shadow-3`, which nothing defines anywhere, VitePress's own slip in VPSidebar.vue (`box-shadow: var(--vp-c-shadow-3)`, the phone's open sidebar) carried verbatim by the port, so that shadow never paints upstream either.

**Decision 1, taken 2026-10-09, revised 2026-10-10.** The contract covers every shipped file: `themes.mjs`'s `baseCss()` reads every root stylesheet (the components, `layout.css`, `content.css`, `icons.css` included), with `--vp-c-shadow-3` excepted by name as VitePress's own slip, so a component can read only what the themes define and the test says so. The contract is 39 `--vp-c-*` tokens, the 34 above and the five roles' `-2`. One more variable is required by name, outside that derivation: `--vp-button-brand-hover-bg`, a hex color that takes white text at 3:1.

**What a `-2` is.** In a theme `brand-2` and the five roles' `-2`s are a hovered link's color; `default-2` keeps VitePress's job for it, the alt button's hover ground (`--vp-button-alt-hover-bg`). VitePress's `vars.css` describes the step otherwise: "`XXX-2`: The color used mainly for hover state of the button." Its stylesheets use those `-2`s as text, though. `brand-2` is the hovered link of `vp-doc.css`, of the layout and of code in a link (`--vp-code-link-hover-color`); each role's `-2` is the hovered link in its custom block; the one use as a ground is `--vp-button-brand-hover-bg: var(--vp-c-brand-2)` (measured, over vpkit's, rustpress's and VitePress's CSS). In dark mode the two jobs can't share a color: in the dark half of all 222 themes, and in stock VitePress's, no color takes white text at 3:1 and also reads at 4.5:1 as a hovered link dimmed to 0.75 on the info container's gray tint (measured 2026-10-10 over the sRGB cube in steps of 3; the same search finds such a color in a light half). So a theme keeps `-2` for the text job and gives the brand button its hover ground through `--vp-button-brand-hover-bg`, the variable VitePress already has for it. That is the departure from `vars.css`: a theme's `-2` is fitted as text, and a consumer that paints one as a button's ground no longer gets a ground fitted for white text.

**What the test holds**, in both halves of every theme: body text 7:1 on the page and on the elevated surface (menus, dialogs, toasts); secondary text 4.5:1 on the page, the soft surfaces and the elevated one; muted text 3:1 on the page; `brand-1` 4.5:1 on the page, the elevated surface and a hovered menu item's gray wash; white on `brand-3` and on `--vp-button-brand-hover-bg` 3:1; `brand-2` 4.5:1 as text on the page, the elevated surface and inline code, and dimmed (painted as 0.75 × the color + 0.25 × the ground, as `custom-block.css` and `alert.css` paint a hovered link) on the gray tint and on code inside it; each role's `-1` 4.5:1 on its tint, and its `-2` dimmed on its tint and on code's tint inside it. Result on 2026-10-10, after the generator followed `inherits`: 19,314 checks, 0 failed, no shortfall listed. These hold the 222 themes. Stock `tokens.css` is VitePress's verbatim and is not held to them: its dark `brand-2` is 4.14:1 on the page by totality's measurement, which is why the store overrides it.

**How the generator meets it** (`scripts/gen-themes.py`):

- each `-2` is its `-1` moved toward black in light and toward white in dark, interpolated from the `-1` until it passes everywhere it is drawn (`fit_all`), since a rounded 4% step stalls short of black and white (at 12 and 243 per channel);
- `brand-2`'s old value, fitted for white at 3:1, is emitted as `--vp-button-brand-hover-bg`;
- in a dark half whose elevated surface is mid-tone (voxed's olive), `bg-elv` moves toward the page until white reaches 7:1 on it;
- a tint that leaves a hovered link no room, where even black or white dimmed to 0.75 falls short on the tint or on code's tint inside it, is thinned by 0.01 until it has room, never below 0.06; a tint that can't make room by then keeps its alpha, and the test lists the shortfall;
- `composite()` rounds halves up, as the test's `Math.round` does (Python's `round()` takes them to even, which moved one dimmed contrast by 0.05);
- a palette's declared background is read under Helix's quoted key (`"ui.background"`) too; 11 palettes had been read as the wrong mode;
- a palette that `inherits` another is read as Helix merges them (its `merge_themes`): the child's top-level keys replace the parent's whole, and the two palettes merge entry by entry, the child's winning. 22 palettes that had been skipped now map, and 30 that had been mapped from their own few colors changed;
- in a dark palette, a page too light to leave a hovered link room even at the 0.06 floor (white dimmed to 0.75, on 0.06 of white and on code's tint inside that) moves toward black until it does. It changes one theme: seoul256-dark-soft's page, `#4e4e4e`, becomes `#484848`, still lighter than seoul256-dark's `#3a3a3a`.

The four hand-tuned themes were refit with the same functions (`brand-2`, the `-2`s, and `brand-1` in github's and nord's dark halves) and keep their old `brand-2` as `--vp-button-brand-hover-bg`.

**Shortfalls**: none listed since the generator follows `inherits` (open decision 9). The one listed before, the dark half of `wolf-alabaster-light-mono` (10 checks), came of that: the generator mapped the few colors the file has and read its red as a dark page (#962828), where even white dimmed to 0.75 reached 3.4 to 4.4:1 on the tints. Read as Helix reads it, the palette is light, its page `#f7f7f7`.

**Assumptions** the decision rests on:

- measured: in dark mode one color can't do both jobs (222 of 222 themes, and stock VitePress);
- measured: `brand-2` and the roles' `-2`s are text everywhere in vpkit's, rustpress's and VitePress's stylesheets, except `brand-2` through `--vp-button-brand-hover-bg`;
- measured: of the apps, only own-drive painted a theme's `brand-2` or role `-2` as a ground (`danger-2`, its solid danger button's hover); it now hovers on its own `--od-danger-solid-hover` (own-drive 994d940). totality's store rests its light brand button on `brand-2`, but on the stock palette, where `brand-2` is still VitePress's;
- guessed: no consumer outside these repositories paints a theme's `brand-2` or role `-2` as a ground;
- stated by the owner: the go-ahead, 2026-10-10 ("全部按照你的建議去作，其他project都可以配合修正").

**What it replaced.** On 2026-10-09 the themes got each role's `-2` as its `-1` stepped 15% toward black in light and toward white in dark, the step `brand-2` had, held as a bare token to 4.5:1 on its tint. The review of 2026-10-10 found three faults in that: the check missed the 0.75 dim the containers paint (about 1,700 of the 2,000 painted hovers were under 4.5:1 while the test reported none, the review's count); `brand-2` was held only as a button ground while `vp-link` and the containers hover to it as text; and a consumer of `vars.css`'s ramp, which reads `-2` as a button's hover ground, got a lighter ground than rest and press in dark mode. The revision answers all three; `alert.css` and `content.css` are unchanged by it.

One consequence for a component: `vp-btn-danger` is the grounded form only (danger text on the danger tint, laid over the page color). A solid one needs grounds for white text, at rest and hovered, and the contract has neither: the themes define no `danger-3`, and a theme's `danger-2` is link text. own-drive derives both per theme with `color-mix()`.

## How a component is proven

`test/compare.mjs` renders a case twice in headless Chromium, with the original's classes and stylesheet and with vpkit's, in light and dark mode, and compares the computed styles of the elements the case names, with `:hover`, `:active` and `:focus` forced where the component has them, and on an emulated touch screen where it must rest. Lengths match within 1/32px because the shipped build is minified. A difference is a failure unless `known` lists it with its reason, and a `known` entry that stops occurring fails too. The upstream stylesheets load in VitePress's order (`custom-block.css` before `vp-doc.css`, as its `without-fonts.ts` imports them), and an original VitePress renders inside `.vp-doc`, a custom block, is rendered there, since `.vp-doc a` follows `.custom-block a` at the same specificity.

Computed styles can't show what forced colors do, because the browser replaces backgrounds and drops shadows when it paints. `test/forced-colors.mjs` renders the components whose state is drawn only with a background under emulated forced colors and requires two states to differ in pixels: a checked and an unchecked toggle, a bar at 40% and at 0%. Before 06ae819 both pairs were identical.

For a component from a VitePress original:

- the original's file is added to `UPSTREAM` in `compare.mjs` and to the copy list in `test/upstream/SOURCE`; a `.vue` file contributes its `<style>` block. A `<style>` with `:deep()` (VPSwitch, VPSwitchAppearance, VPMenu) must go through `unwrapDeep` from `scripts/vitepress-port.mjs` first, as the layout port does, because a browser drops a selector with `:deep()`. `compare.mjs` does this since 2026-10-09 (step 2 of the order of work).
- the cases cover the box (display, borders, radii, padding, line height, font, geometry), the colors, each state against the original's, each addition against the original with the addition inline, and the touch screen.

For a component from an app recipe:

- the recipe is copied into `test/recipes.mjs` verbatim, with its file and the date, and `test/entry.css` scans that file so its utilities compile into the test stylesheet; the case compares the recipe on one element with the class on another, light and dark, hover and focus.
- a rule the recipe never had (the textarea's padding below) is tested as an addition is, against the rule written inline.

## The catalogue

### Shipped

| component | source | classes |
| --- | --- | --- |
| `vp-btn` | VPButton | `vp-btn-brand`, `vp-btn-sponsor`, `vp-btn-big`; `:disabled`; `vp-btn-danger` (2026-10-10, own-drive's) |
| `vp-badge` | VPBadge | seven types, `vp-badge-success` (vpkit's), `vp-badge-small`; VPBadge's rules in doc headings and the doc footer |
| `vp-alert` | the custom blocks | six types, `vp-alert-title`; `vp-alert-details` on a `<details>` (2026-10-10) |
| `vp-table` | the markdown table | — |
| `vp-card` | VPFeature | `vp-card-title`, `vp-card-details` |
| `vp-input` | totality's `input_base!` | `aria-invalid`; on `<input>`, `<select>` and `<textarea>` |
| `vp-toggle` | VPSwitch, VPSwitchAppearance | `vp-toggle-check`, `vp-toggle-icon`; `aria-checked`; `vp-toggle-appearance` |
| `vp-link` | `vp-doc.css`: `.vp-doc a` | on `<a>` and `<button>`; code inside takes the link's colors |
| `vp-code` | `vp-doc.css`: `.vp-doc :not(pre) > code` | — |
| `vp-spinner` | VPLocalSearchBox: `.search-loading.active` | — |
| `vp-dialog` | own-drive's `MODAL` (a recipe) | `vp-dialog-title`, `vp-dialog-actions`; `::backdrop` |
| `vp-dropdown` | VPMenu, VPMenuLink, VPMenuGroup | `vp-dropdown-item`, `vp-dropdown-group`, `vp-dropdown-title`; `aria-current`, `aria-checked` |
| `vp-icon-btn` | VPSocialLink, with own-drive's hover ground | a `vpi-*` icon or an SVG inside |
| `vp-tabs` | `vp-code-group.css`: `.tabs`, `label` | `vp-tabs-tab`; `aria-selected` |
| `vp-kbd` | VPLocalSearchBox: `.search-keyboard-shortcuts kbd` | — |
| `vp-mark` | VPLocalSearchBox: `mark` | — |
| `vp-choice` | totality's `CHOICE` (a recipe) | `:has(:checked)`, `:has(:focus-visible)` |
| `vp-label`, `vp-field-error` | totality's `FIELD_LABEL`, `MSG_ERROR` (recipes) | — |
| `vp-toast` | own-drive's `#msg` (a recipe) | — |
| `vp-progress` | own-drive's `BAR`, `BAR_FILL` (recipes) | `vp-progress-bar` |

### Tier 1: next

Each has a VitePress original and an app that draws it by hand today, or no original and the strongest demand of the two apps.

| component | source | demand (measured) |
| --- | --- | --- |

#### `vp-toggle` (built 2026-10-09)

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
- Forced colors: the knob has a transparent outline, which forced colors paint in the text color, so the knob, and with it the state, stays visible (`test/forced-colors.mjs`).
- Differences from the original: the knob follows `aria-checked` (VPSwitch has no checked state of its own; only the appearance switch moves it, by `.dark`); the hover is `@variant hover`. Nothing omitted.
- Cases: the box, the knob and the icon against VPSwitch at rest and `:hover`; `aria-checked="true"` against VPSwitch with the knob's transform written inline, as `vp-btn`'s additions are tested (the harness renders every case in both modes, so a comparison with VPSwitchAppearance, whose knob moves only under `.dark`, would differ in light); `vp-toggle-appearance` in light and dark against VPSwitchAppearance (the transform, the two icons' opacities, the icon color); touch. Both originals need `unwrapDeep`.

#### `vp-input` on `<select>` and `<textarea>` (built 2026-10-10)

Demand: own-drive styles its two selects (`web.rs:704`, `web.rs:2358`) as its text inputs; that is the pattern, its input recipe being its own look.

No `vp-select` or `vp-textarea`: the one class is the box for the three text-like controls. Measured (a probe in headless Chromium on the shipped build, 2026-10-09, fifteen assertions): `select.vp-input` already renders the input's box exactly, 44px tall, the input border, background, 8px radius, 16px text and 12px side padding; a screenshot in both modes (2026-10-10) shows the browser's arrow, dark on light and light on dark. `textarea.vp-input` keeps the box too but is clamped to the input's 44px with no vertical padding, so `input.css` gains one element-qualified rule:

```css
textarea.vp-input {
  height: auto;
  min-height: 2.75rem;
  padding-block: 0.5625rem;
}
```

The block padding is 9px, not the 10px first drafted here: the input's 24px line sits 9px inside its 42px content box, so with 9px a one-row textarea is the input's 44px box and its text lands on the input's pixels (measured: the insides of an input and a one-row textarea holding the same text, 20,160 device pixels, are identical). A three-row textarea is 92px. `rows` and `resize` stay the markup's. The hover, focus, placeholder and `aria-invalid` rules are the class's and so apply to all three.

- Where a select's text sits is the browser's: Chromium sets it 4px further in than an input's, and 1px lower, as it centers the text on a line height of its own (computed `normal` whatever the class sets); measured. Decision 8.
- Cases (built): `select.vp-input` against `input.vp-input` in the same stylesheet, box and colors without the line height, hovered and focused, plain and `aria-invalid="true"`; `textarea.vp-input` against the recipe on a textarea with the rule written inline, as `vp-btn`'s additions are tested, plain and `aria-invalid="true"`; a one-row textarea against the input, for its height. A mutation run (the padding at 0.625rem, a select with 16px of left padding) turns 18 values red.
- The option list of a `<select>` is the browser's to draw. UNVERIFIED (the headless browser does not render the popup): that it follows `color-scheme`, which `base.css` sets from `.dark`.

#### `vp-link` (built 2026-10-10)

Demand: totality `ui.rs`, `LINK`, `LINK_BUTTON`, the `[&_a]` of `PROSE` and `PROSE_LEDE`.

VitePress's link, `.vp-doc a`, as a class: for a link outside the markdown, and for a button drawn as a link.

```html
<a class="vp-link" href="/orders">All orders</a>
<button class="vp-link min-h-10 px-2" type="button">Cancel</button>
```

- `vp-link`: `--vp-link-text: var(--vp-c-brand-1); --vp-link-hover-text: var(--vp-c-brand-2)`, the names button.css gives its colors (rule 5); `font-weight: 500; color: var(--vp-link-text); text-decoration: underline; text-underline-offset: 0.125rem; transition: color 0.25s, opacity 0.25s`; hover `color: var(--vp-link-hover-text)`.
- `.vp-link > code { color: var(--vp-code-link-color) }`, and on hover `var(--vp-code-link-hover-color)`: VitePress's two rules for code in a link. Not behind `:where()`, unlike rule 6: at one class and one element it wins over `vp-code`'s color, as `.vp-doc a > code` does over the markdown's code, since code in a link is meant to take the link's color.
- Tokens: `brand-1`, `brand-2`, `--vp-code-link-color`, `--vp-code-link-hover-color` (both `brand-1`/`-2`), in the contract.
- An app-wide hover color is the token, not the local: `.vp-link { --vp-link-hover-text: … }` misses a `<code>` in the link, which reads `--vp-code-link-hover-color`, and every link in `vp-doc`, which carries no class (the review of 2026-10-10). totality's AA hover is `.dark { --vp-c-brand-2: var(--vp-c-text-1) }` (the migration map).
- On a `<button>`: measured, the `<button>` case renders every compared property as `.vp-doc a` does, so Tailwind's preflight leaves nothing else to reset. The 40px hit area totality gives its text buttons stays utilities (`min-h-10 px-2`).
- Cases (built): an `<a>` and a `<button>` against `.vp-doc a` (color, weight, decoration, offset, font size, transition; hover; a `<code>` inside, at rest and while the link is hovered); touch. Before link.css existed they differed in 36 of 48 values.

#### `vp-code` (built 2026-10-10)

Demand: totality `ui.rs`, `CODE`, the `[&_code]` of `PROSE`.

VitePress's inline code as a class, for code outside the markdown: an order id, a serial, a key.

```html
<code class="vp-code">ORD-2026-0142</code>
```

- `vp-code` ← `.vp-doc :not(pre, h1, h2, h3, h4, h5, h6) > code` and `.vp-doc :not(pre) > code`: `font-size: var(--vp-code-font-size); color: var(--vp-code-color); border-radius: 0.25rem; padding: 0.1875rem 0.375rem; background-color: var(--vp-code-bg); transition: color 0.25s, background-color 0.5s`. The font family is the page's `code` rule (Tailwind's preflight takes the theme's mono family, which `theme.css` sets to `--vp-font-family-mono`); the case compares it, and it matched before code.css existed.
- Tokens: `--vp-code-color` (`brand-1`), `--vp-code-bg` (`default-soft`), in the contract.
- Where not to use it: inside a `vp-alert`, a plain `<code>` takes the alert's tint (`:where(.vp-alert) code`) and `vp-code` would beat it (rule 6 is what lets a component inside an alert keep its look); inside a `vp-link`, a plain `<code>` takes the link's color; inside `.vp-doc`, `content.css` styles every `code`.
- Cases (built): against `.vp-doc p > code` (font size and family, color, radius, padding, background, transition), and inside a `vp-link` against code in a markdown link, at rest and while the link is hovered; light and dark. Before code.css existed they differed in 50 of 58 values.

#### `vp-spinner` (built 2026-10-10)

Demand: totality `ui.rs`, `SPINNER`.

VPLocalSearchBox's loading ring, the one spinner VitePress draws.

```html
<span class="vp-spinner" role="status" aria-label="Loading"></span>
<button class="vp-btn vp-btn-brand" disabled><span class="vp-spinner size-4"></span>Paying…</button>
```

- `vp-spinner` ← `.search-loading.active`: `display: inline-block; width: 1.125rem; height: 1.125rem; flex: none; border: 2px solid var(--vp-c-divider); border-top-color: var(--vp-c-brand-1); border-radius: 50%; animation: vp-spinner 0.8s linear infinite`, with the keyframes `to { transform: rotate(360deg) }`. It spins whenever it is rendered; showing and hiding it is the app's (`hidden`, htmx's `htmx-indicator`).
- Omitted: the original's `visibility: hidden` at rest (that is the showing and hiding) and its `margin: 0.5rem` (placement). Kept: its own `prefers-reduced-motion` rule, `animation: none` (rule 10).
- Tokens: `divider`, `brand-1`, in the contract.
- In a `vp-btn` the ring turns in the label's color: the ring `currentColor` at 30%, the head `currentColor` (through `--vp-spinner-ring` and `--vp-spinner-head`). The divider ring with a `brand-1` head was under 3:1 against a brand button's ground in every theme mode (the review of 2026-10-10).
- Cases (built): against `.search-loading.active` in a flex row, as the search bar holds it (size, borders, radius, visibility, flex, animation duration, timing and iteration count), light and dark; the original's styles are loaded for that case alone, since the search box's stylesheet names generic classes (`.title`). The keyframes' names differ, so `animation-name` is not compared. The height is compared as `block-size`: the bounding box of a turning ring is wider than 18px at most angles, which first showed as a false difference in dark mode. The harness now finishes only transitions before it measures: `finish()` throws on an infinite animation. Before spinner.css existed the case differed in 36 of 52 values.

#### `vp-dialog` (built 2026-10-10)

Demand: own-drive `web.rs:1895`, `:1985`, `:2043`, `:2344` (four modals), plus two overlays with `role="dialog"`.

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

- `vp-dialog` ← `MODAL`: `margin: auto; border: 1px solid var(--vp-c-divider); border-radius: 0.75rem; padding: 1.15rem 1.25rem; width: 26rem; max-width: 92vw; color: var(--vp-c-text-1); background-color: var(--vp-c-bg-elv); box-shadow: var(--vp-shadow-4)`; `::backdrop { background-color: var(--vp-backdrop-bg-color, rgba(0, 0, 0, 0.6)) }` ← `MODAL_BACK`'s scrim, with `tokens.css`'s value as the fallback: `::backdrop` inherits from its dialog only since Chrome 122 and Safari 17.4, inside Tailwind v4's browser floor, and before that the variable doesn't reach it (the review of 2026-10-10). The width is the recipe's and a utility overrides it (`w-[32rem]`): a dialog with no width collapses to its content, so this is the one component with a width (rule 8's exception, Decision 4).
- `vp-dialog-title` ← `MODAL_H3`: `margin: 0 0 0.6rem; font-size: 1.05rem; font-weight: 600`.
- `vp-dialog-actions` ← `BTN_ROW`: `display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem`.
- Tokens: `divider`, `text-1`, `bg-elv`, `--vp-shadow-4`, `--vp-backdrop-bg-color`, in the contract.
- Placement: `showModal()` centers the dialog with the browser's `margin: auto` in the top layer, and Tailwind's preflight sets every element's margin to 0, the dialog's included (measured: without dialog.css the open dialog sits at the page's top left corner), so `vp-dialog` sets `margin: auto` back. That restores the browser's placement; the component sets no position. `MODAL_P`'s paragraph rules stay utilities.
- Not ported: own-drive's `#modalBack` scrim element and its z-index (`--od-z-modal`); the top layer needs neither. own-drive's modals are `<div role="dialog">` behind a scrim today; moving them to `<dialog>` is a change in its `app.js`, in the migration map.
- Cases (built): `MODAL` on a `<dialog>` with vpkit's two additions written inline (`margin: auto`, and the backdrop color in a `<style>`) against `vp-dialog`, both opened by `showModal()` in the case's markup: the box, its centered position, the shadow, the title, the actions, and `::backdrop`, which `getComputedStyle` resolves on an open modal dialog (measured). Before dialog.css existed the case differed in 73 of 88 values.

### Tier 2: VitePress has it, no app asks yet

The originals exist at the pinned tag; neither app draws one today (measured over `../totality/crates/store/src` and `../own-drive/src`: no `role="menu"`, no `<details>`, no `role="tab"`, no `<kbd>`, no `<mark>`). Build one when an app needs it, in this shape:

| component | original | shape | open point |
| --- | --- | --- | --- |
| `vp-dropdown` (built 2026-10-10) | VPMenu, VPMenuLink, VPMenuGroup | `vp-dropdown`, the panel: 0.75rem radius, 0.75rem padding as `--vp-dropdown-padding` (a group's divider follows it to the panel's edges), `min-width: 8rem`, a divider border, `bg-elv`, `--vp-shadow-3`, `max-height: calc(100vh - var(--vp-nav-height))` and scrolls. `vp-dropdown-item` ← `.link`: block, 0.375rem radius, `0 0.75rem` padding, line height 2.2857143, 0.875rem/500, `text-1`, hover `brand-1` on `default-soft`, the current item (`[aria-current]` but `false`, `""` and `undefined`, where VPMenuLink has `.active`; or `[aria-checked="true"]`) `brand-1`. `vp-dropdown-group` with `vp-dropdown-title` ← `.title`: `text-2`/600, a divider above each group but the first | the trigger and the panel's position are the app's (VPFlyout's `top` is the navbar's). own-mail's menus are its own look, not evidence |
| `vp-icon-btn` (built 2026-10-10) | VPSocialLink | a 2.25rem square flex box, `text-2`, hover `text-1` (0.5s and 0.25s transitions), a 1.25rem icon, `svg { fill: currentColor }` | own-drive's `BTN_ICON` (`web.rs:383`, six sites) is 2rem with a 0.5rem radius, a `default-soft` hover ground and `default-2` when active; an icon button without a hover ground reads as decoration, so the ground is a candidate addition (rule 12), Decision 3 |
| `vp-alert-details` (built 2026-10-10) | `custom-block.css`: `.custom-block.details`; `vp-doc.css`: `summary` | the alert's missing type, on `<details class="vp-alert vp-alert-details">` with `<summary class="vp-alert-title">`: the info colors, the summary `font-weight: 700`, `cursor: pointer`, `user-select: none`, `margin: 0 0 0.5rem`, the `summary + p` margins | the `[open]` state is the element's; nothing else |
| `vp-tabs` (built 2026-10-10) | `vp-code-group.css`: `.tabs`, `label` | the bar (`--vp-code-tab-bg`, an inset 1px `--vp-code-tab-divider`, `overflow-x: auto`, 0.5rem top radii from 640px) and the tab (`0 0.75rem` padding, line height 3.4285714, 0.875rem/500, `--vp-code-tab-text-color`, the hover and selected text colors, the selected tab's 2px `--vp-code-tab-active-bar-color` bar as `::after`); `role="tab"` buttons with `aria-selected` where VitePress has `input:checked + label` | showing the panels is the app's |
| `vp-kbd` (built 2026-10-10) | VPLocalSearchBox: `.search-keyboard-shortcuts kbd` | inline-block, `rgba(128,128,128,0.1)` inside a `rgba(128,128,128,0.15)` border, 0.25rem radius, `0.1875rem 0.375rem` padding, `min-width: 1.5rem`, centered, `0 2px 2px 0 rgba(0,0,0,0.1)` | VitePress's literal grays, the same in both modes: the one original with no token to read, so rule 9 is kept by copying them |
| `vp-mark` (built 2026-10-10) | VPLocalSearchBox: `mark` | `--vp-local-search-highlight-bg` on `--vp-local-search-highlight-text`, 0.125rem radius, `0 0.125rem` padding | the tokens are the search's, `brand-1` and `neutral-inverse` |

### Tier 3: an app recipe, one consumer

No original; one of the two apps draws it. Build one when the second app needs it, or when the owner wants the app's recipe held by vpkit's tests.

| component | recipe | shape | note |
| --- | --- | --- | --- |
| `vp-btn-danger` (built 2026-10-10) | own-drive `BTN_DANGER` (`web.rs:376`; `DANGER_C` at `:366`) | a `vp-btn` modifier in the variable pattern: transparent border, `danger-1` text on the `danger-soft` tint laid over the page color (a background image over `--vp-c-bg`), the same on hover and active (the ground is the point) | the grounded form only (Decision 1). The tint lies over the page color since ec8763a: translucent, it took the color of whatever the button sat on, and the label could fall under 4.5:1 in a danger alert, a dialog or a card. own-drive's demoted variant (neutral until hovered, `:380`) is its own |
| `vp-choice` (built 2026-10-10) | totality `CHOICE` (`ui.rs`) | a `<label>` card around a radio or checkbox: a divider border on `bg`, 0.5rem radius, 1rem padding, `gap: 0.75rem`, 0.875rem/1.5; hover a `brand-1` border; `:has(:checked)` a `brand-1` border on `brand-soft`; `:has(:focus-visible)` a 2px `brand-1` outline offset 2px; the control `accent-color: var(--vp-c-brand-1)` | one site (`views.rs:865`) |
| `vp-label`, `vp-field-error` (built 2026-10-10) | totality `FIELD_LABEL`, `MSG_ERROR` (`ui.rs`) | the field's label (block, 0.875rem/1.5, 500, `text-1`, `margin-bottom: 0.375rem`) and the error line under the control (0.875rem/1.5, `danger-1`, `margin-top: 0.5rem`) | five utilities each; own-drive's labels not measured (guessed: utilities). Borderline by the test below, Decision 6 |
| `vp-toast` (built 2026-10-10) | own-drive `#msg` (`web.rs:750`) | the surface of a status message: `bg-elv`, a divider border, a 0.5rem radius (built so; 0.75rem was drafted here, the uploads panel's), `--vp-shadow-3`, padding; the placement (fixed, bottom center) and the live region are the app's | totality shows results inline (`RESULT`), not as a toast |
| `vp-progress` (built 2026-10-10) | own-drive `BAR`, `BAR_FILL` (`web.rs:463`) | a 0.3rem track on `default-soft` with 0.15rem radii, as wide as its container, a `brand-1` fill (`Highlight` under forced colors) | two spans; a native `<progress>` needs vendor pseudo-elements. One site (the quota bar; the load bar is another thing) |

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
| `SPINNER` | `vp-spinner size-4` with the htmx indicator utilities | the recipe is a solid `currentColor` ring with a transparent quarter. `vp-spinner` is a divider ring with a `brand-1` head on the page, and in a `vp-btn` a `currentColor` ring at 30% with a solid `currentColor` head: the look changes in both places |
| `LINK`, `LINK_BUTTON`, the `[&_a]` of `PROSE` | `vp-link`, `vp-link min-h-10 px-2 text-[0.875rem]` (`vp-link` sets no size; the recipe's text is 14px), `vp-doc` | the store's AA hover (`--store-link-hover`, `text-1` in dark) becomes the token every hovered link reads, `.dark { --vp-c-brand-2: var(--vp-c-text-1) }` in its `store.css`. Probed 2026-10-10 in Chromium, ten checks with a control that fails without the rule: in dark, a hovered `vp-link`, code in it, a `vp-doc` link, code in that, and a link in a tip or info alert all take `text-1`; light keeps `brand-2`; the brand button's dark hover stays the store's `#304eb2`, since `store.css` sets all three of its dark grounds. It holds on the stock palette, where `tokens.css` derives `tip-2` and `note-2` from `brand-2`; a theme defines them itself. `.vp-link { --vp-link-hover-text: … }`, which this row said before, misses code in a link and every `vp-doc` link |
| `CODE`, the `[&_code]` of `PROSE` | `vp-code`, `vp-doc` | — |
| `H1`, `H2`, `H3`, `LEDE`, `LIST_*`, `PROSE`, `PROSE_LEDE` | `vp-doc` (`content.css`, 2.5 KB gzipped) around class-less markup; the classed headings stay utilities or move inside it | `PROSE_LEDE`'s `text-2` body stays a utility on the wrapper |
| the appearance switch (`views.rs:196`) | `vp-toggle vp-toggle-appearance` with `vpi-sun` and `vpi-moon` from `icons.css` | the store draws its own `SUN_SVG` and `MOON_SVG`, placed and cross-faded by their own utilities. `toggle.css` places, colors and cross-fades only `vpi-*` icons (`[class^='vpi-']`, `.vpi-sun`, `.vpi-moon`; read from the source), so the store imports `icons.css` and uses its two icons, or keeps its SVGs with their utilities |
| `FIELD_LABEL`, `MSG_ERROR`, `CHOICE` | Tier 3 | — |

**own-drive** (`src/web.rs`, `src/web/assets/app.js`):

| recipe | becomes | in the way |
| --- | --- | --- |
| `BTN`, `BTN_PRIMARY` | `vp-btn`, `vp-btn-brand` | done; `VP_BTN_EXTRA` (a 0.3rem gap, the pointer since `base.css` is not imported, the plain cursor when disabled) is own-drive's choice and stays |
| `#themeToggle` | `vp-toggle vp-toggle-appearance` | its sun and moon are its own SVGs (`ic-sun`, `ic-moon`), placed and cross-faded by utilities in `theme_toggle_icons()`. `toggle.css` places, colors and cross-fades only `vpi-*` icons, so inside `vp-toggle-icon` they would get none of it: own-drive imports `icons.css` and uses `vpi-sun` and `vpi-moon`, or keeps its SVGs and their utilities |
| `#themeSelect`, `#shareExpires` | stay, with `INPUT` | own-drive's inputs are its own look (no fixed height, the background swaps to `bg` on focus); its selects carry that recipe and stay with it. If own-drive ever moves to `vp-input`, the selects move as they are |
| `MODAL`, `MODAL_BACK`, `MODAL_H3`, `BTN_ROW` | `vp-dialog`, its `::backdrop`, `vp-dialog-title`, `vp-dialog-actions` | the modals are `<div role="dialog">` behind a scrim `<div>`; `<dialog>` and `showModal()` in `app.js` replace the scrim, the z-index and the focus handling. `MODAL_P` and `MODAL_ERR` stay utilities |
| `BTN_DANGER` | Tier 3 `vp-btn-danger` | the ground is not the recipe's translucent tint: `vp-btn-danger` lays the tint over the page color, so on a hovered trash row (`TR`, `bg-soft`) or in a modal the button keeps the page's ground, and its label the page's contrast, where the recipe let the surface show through. The demoted variant stays |
| `BTN_ICON` | Tier 2 `vp-icon-btn size-8` | the hover ground is `vp-icon-btn`'s (Decision 3); own-drive's `default-2` press ground stays its own |
| `BTN_CHIP` | stays | it is an alt button collapsed to a 1.9rem square (VPButton's alt colors: a gray ground, `text-1`, the alt border). As a `vp-icon-btn` it would lose the ground and the color; a `vp-btn` squared with utilities is the closer class, not measured |
| `TD`, `TH`, `TR`, the cards, `DL`, `INPUT` | stay | own-drive's own looks |
| `BAR`, `#msg`, `EMPTY` | Tier 3, Tier 3, stays | — |

## Order of work

One commit per step, each with its cases green (`npm test`) and its page of the documentation (its README section before 2026-10-10, as the history has it).

1. **The contract** (done 2026-10-09). `test/themes.mjs` reads every root stylesheet into the base it derives the required tokens from, with `--vp-c-shadow-3` excluded by name as VitePress's own undefined variable; the themes define the five `-2` (Decision 1). Before any component, because every one below is held to it.
2. **`compare.mjs` learns `:deep()`** (done 2026-10-09). Originals run through `unwrapDeep`. No visible change; the existing cases stay green.
3. `vp-toggle`, with `vp-toggle-appearance` (done 2026-10-09).
4. `vp-input` on `<select>` and `<textarea>`: the textarea rule, the cases, the README's input section (done 2026-10-10).
5. `vp-link` (done 2026-10-10).
6. `vp-code` (done 2026-10-10).
7. `vp-spinner` (done 2026-10-10).
8. `vp-dialog` (done 2026-10-10).
9. Tier 2 and Tier 3: built 2026-10-10, one commit each, at the owner's request to build every component, in the shapes above (each row says where the build departed from it).
10. **The review of 2026-10-10**: fifteen findings, each fixed in a commit of its own (below).
11. **Helix's `inherits`** (open decision 9, 2026-10-10): the generator follows it; 222 themes, no shortfall listed.

## The review of 2026-10-10

A review of the components built that day found fifteen faults; each was reproduced before it was fixed (the backdrop one by simulation, with no old browser at hand), and each fix is in the cases or the theme test. The owner's instruction was to fix all of them as recommended and adapt the other projects.

| finding | what changed | commit |
| --- | --- | --- |
| the role `-2`s stepped away from VitePress's ramp, and own-drive's solid danger button would hover on one | `brand-2` and the roles' `-2`s are a hovered link's color; the brand button's hover is `--vp-button-brand-hover-bg`; own-drive hovers on its own token (Decision 1) | 398cc02; own-drive 994d940, rustpress 3b47d99 (its gallery index) |
| nothing checked text on `bg-elv` | body text 7:1, secondary text and `brand-1` 4.5:1 on it; a mid-tone dark elevated surface moves toward the page | 398cc02 |
| `brand-2` was unchecked as text | held as text, and dimmed in the gray containers | 398cc02 |
| the `-2` check ignored the 0.75 dim | held as it paints | 398cc02 |
| the migration map promised what the CSS doesn't keep | the rows corrected; totality's link hover is one token, probed | this file |
| `vp-btn-danger`'s label fell under AA off the page | the tint lies over the page color | ec8763a |
| `::backdrop` doesn't inherit the variable before Chrome 122 and Safari 17.4 | a fallback to `tokens.css`'s color | 6f2c4bb |
| the alert's link rule underlined a dropdown item, tab or card inside it | each sets its own text decoration, the card its color too | 88f0e15 |
| the spinner's head was nearly invisible in a brand button | in a `vp-btn` it turns in the label's color | c44f7b4 |
| `aria-current=""` was styled as current | `""` and `"undefined"` are not current; cases for both and for `page` | 33f2f51 |
| alert links rendered 600 where VitePress renders 500 | VitePress's stylesheet order in the port, the tests and vpkit-zola's reference | 3289541; vpkit-zola 47e36f9 |
| the toggle's state and the progress fill vanished in forced colors | an outline on the knob, `Highlight` for the fill; `test/forced-colors.mjs` | 06ae819 |
| the dropdown group's margin hard-coded the panel's padding | `--vp-dropdown-padding` | 930952f |
| `vp-progress` collapsed to 0px in a flex row | `width: 100%` | ca72a88 |
| a `CASES` run failed on known entries it couldn't hit | under `CASES`, only the entries a selected case hits are required | 838ffd3 |

own-drive's solid danger button, which the first row moved off a theme's `danger-2`, keeps its rest, hover and press grounds in order in all 48 of its theme modes (measured); white text on its hover ground was under 3:1 in 5 dark modes, the same 5 as before the change (everforest, material, sonokai, catppuccin, nord). own-drive ac7a1d4 fits the hover's share of danger-1 per theme, never past the rest's, so white text reaches 3:1 on the rest and the hover in all 48 modes, which its `tests/color_themes.rs` holds; the press, danger-1 itself, is VPButton's step and unchanged.

## Open decisions

Numbered, each with a recommendation; the owner decides.

1. **The contract gap** (above): decided 2026-10-09, revised 2026-10-10. The contract covers every shipped file; `brand-2` and the roles' `-2`s are a hovered link's color, AA as it paints; the brand button's hover ground is `--vp-button-brand-hover-bg`. The alternative first considered, hovering on `-1` as a `known` difference, was not taken.
2. **Names** for the app versions of layout blocks: decided as recommended, `vp-toggle` (VPSwitch) and `vp-dropdown` (VPMenu), both built 2026-10-10. Alternatives considered, `vp-switch-btn` and `vp-menu-box`, read as parts of the layout's blocks.
3. **`vp-icon-btn`'s source**: decided as recommended and built 2026-10-10: VPSocialLink's box as the original, own-drive's hover ground (a 0.5rem radius, `default-soft`) as a tested addition. own-drive's 2rem size and its `default-2` press ground stay its own.
4. **`vp-dialog`'s width**: decided 2026-10-10 as recommended, with the owner's go-ahead to build every component: the recipe's `26rem` and `92vw`, which a width utility replaces.
5. **Badge contrast on soft surfaces**: totality measured 4.42:1 for success text on VitePress's translucent tint over `bg-soft`. A `vp-badge-outline` (opaque `bg`, a soft border, totality's shape) as vpkit's addition, or leave it to the app. Recommended: leave it until a second app hits it; VitePress's badge sits on the page background, where its tint is right. Decided 2026-10-10 as recommended, with the owner's go-ahead: no `vp-badge-outline` until a second app needs one.
6. **`vp-label` and `vp-field-error`**: five utilities each, one consumer. Recommended not yet; built 2026-10-10 at the owner's request to build every component, in `field.css`.
7. **A floating surface**: `vp-dropdown`, `vp-dialog` and `vp-toast` share `bg-elv` inside a divider border with a 0.75rem radius and a shadow (VitePress's outline dropdown and own-drive's uploads panel too). Revisited 2026-10-10 with the three built: they share the elevated ground and the divider border and nothing else (radius 0.75rem, 0.75rem and 0.5rem; shadow 3, 4 and 3; padding of their own), so a shared class would hold two declarations. Each keeps its own.
8. **The select's text inset** (found 2026-10-10). Chromium sets a select's text 4px further in than an input's. `select.vp-input { padding-inline-start: 0.5rem }` aligns the two in Chromium (measured), but the tests run Chromium only: Firefox and Safari are not measured here, and a compensation tuned to Chromium could misalign them instead. Recommended: leave it to the page (`ps-2`, as the documentation's Input page says) until a consumer stacks a select under an input. Decided 2026-10-10 as recommended, with the owner's go-ahead: no compensation in `input.css`.
9. **Helix's `inherits`** (found 2026-10-10): decided as recommended and done the same day. `gen-themes.py` read only a palette's own file, so a palette that inherits another's (76 of the vendored files) was mapped from the few colors it has, or skipped. It now reads one as Helix does, after Helix's own `load_theme` and `merge_themes` (helix-view/src/theme.rs at ba40e547426b). 22 palettes that had been skipped map (198 automatic, 222 themes), 30 that had been mapped changed, and the shortfall the test listed is gone: `wolf-alabaster-light-mono` is light, as Helix draws it. One new palette, seoul256-dark-soft, had a dark page too light for a dimmed hovered link on any tint the room rule allows, so a dark page now also leaves that room. Assumptions: measured, only that page of the 222 dark halves is lighter than `#484848`, the lightest gray that leaves room; measured, a regeneration without the rule differs in that theme alone; guessed, someone who picks the soft variant prefers hovered links at AA to the palette's exact gray, and the page stays lighter than seoul256-dark's. The alternative, listing the theme as a shortfall, was not taken: the generator can fit it. The owner left the choice to the recommendation (2026-10-10), and the rule stays: it changes one theme, by a step that keeps it lighter than the regular variant, and the generator already adjusts surfaces for contrast rather than ship a known failure.
