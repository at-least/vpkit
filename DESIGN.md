# vpkit: its design

vpkit is VitePress's look for applications. It is two products in one repository: the **app kit**, at the root, for an application's pages (the token contract, the Tailwind wiring, the page's base, the markdown, the components, the color themes, the Rust crate); and the **docs theme**, in `docs-theme/`, VitePress's docs layout verbatim with its classes renamed, for a docs theme such as vpkit-zola. This documents what is decided: what a component is, the rules every one follows, the contract, how each is proven, the catalogue, the crate, and the choices behind them. The documentation (`docs/`) documents what ships.

What is called measured here was measured against VitePress v2.0.0-alpha.20 (`test/upstream/SOURCE`), Tailwind CSS 4.3.3 and Chromium through Playwright; a claim marked *guessed* is one nobody measured.

## Who it is for

Three applications, all the owner's, build their pages on the app kit: totality (its store and its admin), own-drive and crashcart, each rendering with hypertext and compiling its stylesheet with the Tailwind CLI. vpkit-zola builds on the docs theme and draws vpkit's documentation. No consumer outside these exists, so a component takes the best shape and the apps follow it (decision 1); a component ported from VitePress keeps VitePress's look, which no app set.

## What a component is

A component is a class, or a block of a few classes, that gives an element the look of one of VitePress's components, and nothing else: no JavaScript, no page layout, no behavior beyond what CSS reads off the element's own state. The app opens the dialog and toggles the switch; the component shows the state the app set. The components are the app parts of VitePress (a button, a badge, an alert, a table, an input, the catalogue below) and the parts the apps need in VitePress's look where VitePress has none (a field, a dialog, a panel). VitePress's docs layout, its team page, its sponsors and its ads are the docs theme's.

## Rules

Every component follows these.

1. **One component, one directory.** `components/<name>/<name>.css`, in Tailwind's `components` layer, so a utility on the same element always wins (`class="vp-btn px-8"`); `examples/<id>.html`, the canonical markup, which the docs page shows, the crate's tests render and the cases measure; `<name>.test.mjs`, its proof; `golden.json`, its recorded values. Nothing is unlayered; nothing uses `!important`.

2. **The class says what it is; what varies is an attribute.** The block is `vp-<name>`, a part `vp-<name>-<part>`. A mutually exclusive axis is `data-variant` (a theme, a type, a kind: `data-variant="brand"`, `data-variant="warning"`) or `data-size` (`sm`, `lg`); an orthogonal switch is a class (`vp-table-sticky`, `vp-panel-flush`, `vp-badge-outline`); a state is the attribute the markup carries for assistive technology anyway (`aria-current`, `aria-invalid`, `aria-selected`, `aria-checked`, `aria-expanded`, `aria-orientation`, `:disabled`, `[open]`) or `data-state` where no ARIA attribute says it. A variant's rule is `.vp-x[data-variant="y"]`, two levels of specificity, the same as the block with one attribute, so a state written as one attribute more wins over every variant whatever the order (a current button is brand over a ghost one). The element supplies its role and its cursor: `vp-btn` goes on `<a href>` or `<button>`.

3. **Component-local variables.** The block sets its own `--vp-<name>-*` from the contract (`--vp-btn-bg: var(--vp-c-gray-fill)`); a variant overrides the locals and nothing else. Since every element sets all of its own, a component nested in another keeps its colors (an info alert inside a tip alert, tested), and recoloring one block is one rule on it.

4. **Rules for what is inside sit behind `:where()`.** `:where(.vp-alert) a`, `:where(.vp-table) th`: no specificity added, so a component placed inside another keeps its own look; a rule for a bare link or code matches one with no `vp-` class only (`a:where(:not([class*="vp-"]))`), so a component's link inside an alert keeps its look, hovered too. Inside a `vp-doc` (`prose.css`) the markdown's rules are in `@layer base`, below the components, so a component's own rules and states win there whatever their specificity; where the markdown sets something a component's element leaves to the page (a heading's margins on a card's title), the component sets it for that place.

5. **Hover is `@media (hover: hover) { &:hover }`,** native nesting inside the rule, which Tailwind flattens when it minifies: like Tailwind's `hover:` it applies only on a device that can hover; VitePress's hovers also stick to a tapped element. Each component has a touch-screen case: with `:hover` forced it must look as it does at rest.

6. **Size and placement are the page's.** No width, no margin, no position: `vp-input w-full`, a dialog placed by `showModal()`. The exceptions are VitePress's own and each component's header names them (a table's margins, a drawer's edge, a dialog's width, a progress track's width, a skip link's corner); `my-0`, `w-auto`, `max-w-none` remove them.

7. **Tokens: only the contract's.** A component reads tokens.css's 34 `--vp-c-*` colors, its five shadows and its non-color tokens (the radii, the control height, the durations, the focus ring, the bar's height, the layout width, the scrim, the font families), and no other `--vp-*` name and no literal color. One page hook is read with a fallback and defined by no stylesheet: `--vp-layout-top-height`, the height of a page's own banner above the bar (the drawer and prose.css read it as 0px without it). Two literals are allowed, because no theme ever varied them: `white` on a brand fill (the contract fits the fills for white) and the toggle's knob, `light-dark(#ffffff, #000000)`. The themes test holds every stylesheet of the app kit to this.

8. **One control height.** A control that shares a row with others is `--vp-control-height` tall, 2.75rem, a touch target's 44px: the button, the input, the select, the icon button, the file input's chooser; `data-size="sm"` is 2.25rem and `"lg"` 3rem. VitePress's own sizes (its 40px button, its 36px social link) are departures named in each test; no `(pointer: coarse)` floor raises a control, only a hit area (the chip's remove control, the checkbox's label).

9. **One focus ring.** `base.css` draws `:focus-visible { outline: var(--vp-focus-ring); outline-offset: var(--vp-focus-ring-offset) }`, 2px in the brand color 2px out, on every element; an outline follows the box's corners, and forced colors keep it where they erase a box-shadow. A component draws no ring of its own; it restates the ring only to inset it (a scroll box, a strip a card clips), to show it on a card whose control inside is focused (vp-choice, which leaves the control's own ring off), or to leave it off a `<nav>` that is a skip link's target (vp-sidenav).

10. **VitePress's motion, through the tokens.** Colors transition in `--vp-duration` (0.25s), pressed in `--vp-duration-fast` (0.1s), surfaces that follow the appearance in `--vp-duration-slow` (0.5s). `base.css` neutralizes every transition and animation under `prefers-reduced-motion`, `::backdrop` included, so a component carries no reduced-motion rule of its own unless its original does (the spinner) or the neutralized state would mislead (the indeterminate progress bar); `test/motion.mjs` holds the rule to every pseudo-element a stylesheet moves.

11. **Dark mode comes through the tokens.** Every color is a `light-dark()` pair, picked by the color scheme tokens.css sets from `.dark` on `<html>`. A component has no `.dark` rule except a state read: which icon an appearance switch shows (the root's `data-appearance`, else `.dark`), the drawer's dark-only shadow, VitePress's own, and the sponsor grid's inversion of a logo in dark, a filter no pair can carry.

12. **Icons are inline SVG.** The crate's `icon` module has Lucide's, in `currentColor`; a component sizes the SVG inside it (a button's at 1rem, an icon button's at 1.25rem, `vp-icon` at 1em) and targets one by its part class (the toggle's `vp-toggle-light` and `-dark`, the icon button's `-light`, `-dark` and `-auto`). No mask and no `data:` image in the app kit: a page's Content-Security-Policy needs nothing for them. VitePress's masks, `icons.css`, are the docs theme's.

13. **Proof.** A check's source is `upstream` (its computed value equals VitePress's original's at the tag, rendered on vpkit's fitted palette, for what is meant to be VitePress's: the colors at rest, hovered and pressed, the type, the borders, the padding, the motion), `reference` (another rendering of vpkit: inside a vp-doc or an alert against alone, a touch screen's hover against rest) or `golden` (equal to `golden.json`: a component VitePress has no original for, or a departure from one, which the check names in its `why`). No list of known differences: every departure is a golden check with its reason beside it.

14. **Ships complete.** The stylesheet with its header (what it is, from what original, the markup, the attributes and parts, what is VitePress's and what is vpkit's), its examples, its test with its golden values, and its page in `docs/content/components/`. One commit per component, and one per step of any change to the library, each with `npm test` green.

## The token contract

`tokens.css` is the contract: the 34 `--vp-c-*` colors and the five `--vp-shadow-*` every color theme defines, and all a component may read. Each color is named by its job and is one `light-dark()` pair, light first:

| tokens | job |
| --- | --- |
| `bg`, `bg-alt`, `bg-elv`, `bg-soft` | the page; its alternate (a sidebar, a code block, an input); the elevated surface (menus, dialogs, toasts); the soft one (cards) |
| `text-1`, `text-2`, `text-3` | body, secondary and muted text |
| `border`, `divider`, `gutter` | a control's edge; a line between things; the faintest line |
| `brand`, `brand-hover` | text, icons and lines in the brand color; a hovered link |
| `brand-fill`, `brand-fill-hover`, `brand-fill-active` | the brand button's grounds, white text on them |
| `brand-soft` | the brand tint (a selected choice, a tip) |
| `gray-fill`, `gray-fill-hover`, `gray-fill-active`, `gray-soft` | the alt button's grounds; the gray wash (a hovered menu item, code) |
| `success`, `warning`, `danger`, `caution`, `important`, each with `-soft`; all but success with `-hover` | a role's text, on its tint; its hovered link |

Tip and note read brand, as VitePress's do; caution is danger unless a page sets it apart (the docs theme's graded containers do). VitePress's `-1`, `-2`, `-3` and `-soft` are read as the jobs its stylesheets give them (`scripts/contract.mjs`): `-1` is text, `-2` a hovered link, `-3` the brand button's ground, `-soft` the tint; the gray ramp's `-3`, `-2`, `-1` are the alt button's rest, hover and active grounds. The brand button's hover and pressed grounds are slots of their own, where VitePress derives them from `brand-2` and `brand-1`: in dark mode no one color takes white text at 3:1 and also reads at 4.5:1 as a hovered link dimmed on a tint (measured over 222 themes and VitePress's own palette), so the contract separates the two jobs.

Not themed, in tokens.css too: the font families, the radii (`--vp-radius-sm` 0.25rem, `--vp-radius` 0.5rem, `--vp-radius-lg` 0.75rem, `--vp-radius-full`), the control height (2.75rem; `-sm` 2.25rem, `-lg` 3rem), the durations (0.1s, 0.25s, 0.5s), the focus ring, the bar's height (4rem), the layout width (90rem), the scrim. Defined by no stylesheet and read with a 0px fallback: `--vp-layout-top-height`, a page's own banner above the bar.

**The defaults** are VitePress's palette with its contrast shortfalls fitted, written by `scripts/fit-stock.mjs` from upstream's `vars.css` by the generator's own steps: a hovered link (brand-hover and the roles' hovers) at 4.5:1 as text and dimmed to 0.75 in its container; the brand button's white label at 4.5:1 at rest, hovered and pressed; a control's border at 3:1 on the page. Everything else is VitePress's value. The light brand hover ground is VitePress's own `brand-2` (#3a5ccc, white on it at 4.5:1).

**What the test holds** (`test/themes.mjs`), on each side of every theme: body text 7:1 on the page and on the elevated surface; secondary text 4.5:1 on the page, the alternate, soft and elevated surfaces; muted text 3:1; the ramp monotonic; a border separating from the page; the elevated surface never darker than the page; the roles distinct and the brand not the body text; the brand as text 4.5:1 on the page, the elevated surface and a menu item's hover wash; white 3:1 on the three brand fills; the hovered link 4.5:1 as text on the page, the elevated surface and code's tint, and dimmed to 0.75 on the gray tint and on code's tint inside it; each role 4.5:1 on its tint over the page, and its hover dimmed on the tint and on code's tint inside it. The 222 themes pass with 25,000-odd checks; a theme the generator cannot fit fails the run.

**How the generator meets it** (`scripts/gen-themes.mjs`, with `scripts/color.mjs`, the math `test/themes.mjs` shares): each hover is its text color moved toward black in light and toward white in dark until it passes everywhere it is drawn; the brand fills are fitted for white at 3:1, the hover a step toward black from the rest, the pressed a quarter; a dark half's mid-tone elevated surface moves toward the page until white reaches 7:1; a tint that leaves a hovered link no room is thinned, never below 0.06; a dark page too light to leave room moves toward black; a Helix palette that `inherits` another is read as Helix merges them. The four hand-tuned themes (github, catppuccin, nord, rose-pine) carry the same fits.

**Assumptions**: measured, in dark mode one color can't do the text and the fill job; measured, VitePress's `-2`s are text everywhere in its stylesheets but the brand button's hover ground; stated by the owner, no consumer outside the three apps and vpkit-zola; guessed, that stays so.

## How a component is proven

`test/components.mjs` runs every `components/<name>/<name>.test.mjs` and the docs theme's: each case rendered twice in headless Chromium, light and dark, with `:hover`, `:active`, `:focus-visible` and the other states forced where the component has them, at a width where it matters, on an emulated touch screen where it must rest, under reduced motion where it moves; and compares computed styles by the check's source (rule 13). The upstream side loads VitePress's `vars.css`, `base.css` and `icons.css`, the originals the case names (a `.vue` file's `<style>`, its `:deep()` unwrapped), and vpkit's fitted palette written onto VitePress's names, so the comparison is of everything but the fits; the docs theme's cases load VitePress's palette as it is. Lengths match within 1/32px because the shipped build is minified. `UPDATE_GOLDEN=1` rewrites the golden files after a deliberate change; an entry for a case that no longer exists fails, so none outlives its case.

Computed styles can't show what forced colors do: `test/forced-colors.mjs` renders the components whose state is drawn only with a background under emulated forced colors and requires two states to differ in pixels. `test/motion.mjs` holds the reduced-motion rule (rule 10). `test/tokens.mjs` holds the docs theme's variables to VitePress's `vars.css`, resolved on each side, and the breakpoints to its media queries. `test/layout.mjs` holds the docs theme's layout and the markdown to pages VitePress rendered. `test/rust.mjs` holds the crate. `test/docs.mjs` holds the site. `test/README.md` has each in detail.

A clone of vuejs/vitepress checked out at the SOURCE tag is the standard every ported or copied file is held to, and `test/upstream`'s files are byte-identical to it. A re-sync is a plain copy at a new tag, then `node scripts/vitepress-port.mjs --write` for `prose.css` and the docs theme's `layout.css` and `vars.css`, `node scripts/fit-stock.mjs` for the defaults, and the tests.

## The catalogue

The app kit's 45, each on its original or vpkit's own, with its attributes and parts:

| component | from | attributes, parts |
| --- | --- | --- |
| `vp-btn` | VPButton | `data-variant` brand, danger, ghost; `data-size` sm, lg; `aria-current` the brand look; `:disabled` |
| `vp-badge` | VPBadge | `data-variant` note, tip, important, caution, warning, danger, success; `data-size` sm; `vp-badge-outline`; `vp-badge-dot` |
| `vp-alert` | the custom blocks | `data-variant` note, tip, important, warning, danger, caution; a `<details>` the details look; `vp-alert-title`, `vp-alert-icon` |
| `vp-table` | the markdown table | `vp-table-scroll` (a box), `vp-table-sticky`, `vp-table-hover`, `vp-table-stack`; `vp-table-sort`, `vp-table-actions`; a checked first cell, `aria-current`, `aria-sort` |
| `vp-card` | VPFeature | `data-variant` outline; `vp-card-title`, `vp-card-details` |
| `vp-input` | vpkit's own | on input, select, textarea; `aria-invalid`; `data-size` sm |
| `vp-field` | vpkit's own | `vp-label`, `vp-field-hint`, `vp-field-error` |
| `vp-toggle` | VPSwitch, VPSwitchAppearance | `aria-checked`; `data-variant` appearance; `vp-toggle-check`, `vp-toggle-icon`, `vp-toggle-light`, `vp-toggle-dark` |
| `vp-link` | `.vp-doc a` | on `<a>` and `<button>`; `data-variant` quiet |
| `vp-code` | `.vp-doc code` | |
| `vp-spinner` | the search box's ring | |
| `vp-dialog` | vpkit's own, on `<dialog>` | `vp-dialog-title`, `vp-dialog-actions`; `::backdrop` |
| `vp-dropdown` | VPMenu | `vp-dropdown-item`, `vp-dropdown-group`, `vp-dropdown-title`; `aria-current`, `aria-checked` |
| `vp-icon-btn` | VPSocialLink | `data-variant` appearance; `data-size` sm; `vp-icon-btn-light`, `-dark`, `-auto` |
| `vp-icon` | VPIcon | an SVG inside |
| `vp-tabs` | the code group's bar | `vp-tabs-tab`; `aria-selected`; `aria-current` on a link |
| `vp-choice` | vpkit's own | `:has(:checked)`, `:has(:focus-visible)`, `:has(> input:disabled)` |
| `vp-toast` | vpkit's own | `data-state` error, success |
| `vp-progress` | vpkit's own | `vp-progress-bar`; no `aria-valuenow` sweeps |
| `vp-skip` | VPSkipLink | `:focus` |
| `vp-nav-link` | VPNavMenuLink | `data-variant` screen; `aria-current="page"`; `vp-nav-lane` a lane of them, `data-overflow` |
| `vp-topbar` | VPNavBar, VPNavBarTitle | `vp-topbar-row`, `vp-topbar-title` |
| `vp-hamburger` | VPNavBarHamburger | `vp-hamburger-box`; `aria-expanded` |
| `vp-empty` | vpkit's own | `vp-empty-title`, `vp-empty-desc` |
| `vp-divider` | `.vp-doc hr`, VPNavBar's rule | on `<hr>`; `aria-orientation="vertical"`; a labelled one on an element with text |
| `vp-breadcrumb` | vpkit's own | `vp-breadcrumb-item`; `aria-current="page"` |
| `vp-accordion` | VPNavScreenMenuGroup | on `<details>`; `vp-accordion-title`, `vp-accordion-icon` |
| `vp-drawer` | VPSidebar on a phone, VPBackdrop | on `<dialog>`; `[open]`; `::backdrop` |
| `vp-file` | vpkit's own | on `<input type="file">`; `data-size` sm |
| `vp-chip` | vpkit's own | `vp-chip-key`, `vp-chip-value`, `vp-chip-remove` |
| `vp-pager` | vpkit's own | `vp-pager-summary`, `vp-pager-actions` |
| `vp-row` | vpkit's own | `vp-row-title`, `vp-row-desc`; `data-state` muted |
| `vp-panel` | vpkit's own | `vp-panel-flush`; `vp-panel-header` |
| `vp-page-title`, `vp-section-title`, `vp-page-desc`, `vp-group-title` | `.vp-doc h1`, `h3`; vpkit's own | |
| `vp-dl` | vpkit's own | `data-variant` inline |
| `vp-status` | vpkit's own | `data-state` error, success |
| `vp-dot` | vpkit's own | `data-variant` success, warning, danger, tip; `--vp-dot-color` |
| `vp-thumb` | vpkit's own | `a.vp-thumb`'s hover |
| `vp-checkbox` | vpkit's own | `vp-checkbox-label` |
| `vp-pre` | the code block | `.vp-pre > code` |
| `vp-popover` | VPMenu's surface | on a `[popover]` or any element |
| `vp-hint` | vpkit's own | `data-hint`; `aria-expanded` |
| `vp-sidenav` | VPSidebarItem | `vp-sidenav-group`, `-title`, `-items`, `-link`; `aria-current="page"` |
| `vp-screen` | VPNavScreen | `vp-screen-container`, `vp-screen-row`, `vp-screen-label`; `[hidden]` |
| `vp-site-footer` | VPFooter | |

The docs theme's 7, in `docs-theme/components/`, on VitePress's variables: `vp-avatar`, `vp-team-header`, `vp-team-section`, `vp-team-member` (`data-size` sm), `vp-team-members` (`data-size` sm), `vp-sponsor` (`data-variant` aside; the grid's `data-size` xmini, mini, small, big), `vp-carbon-ads`. Outside both is only VitePress's theme for Algolia's search widget (`docsearch.css`), not a VitePress component.

**When a new one is built.** A component VitePress's default theme has is vpkit's: an app part in the app kit, a docs part in the docs theme; a re-sync that brings a new one builds it then. A pattern with no VitePress original becomes an app kit component when it is a part of an app's interface in VitePress's look rather than that app's own design, and an app has a use for it; whose design a pattern is, the owner decides (decision 2). What stays a utility string in an app is its layout and spacing, its own visualizations (crashcart's stack frames and charts, own-drive's file grid), and the arrangements it makes of vpkit's parts for its own screens (a copy line, a stat card, a drop target, an icon tile).

## The crate

`rust/` is the crate `vpkit`, for an app that renders with hypertext (0.12, as the three apps do):

- hypertext components for the markup that is more than a class on one element: `Chip`, `Dialog`, `Empty`, `Field` (with `FieldHint`, `FieldError`), `Hint`, `Pager`, `Tabs` (with `Tab`). A button, an input or a badge is a class string with its attributes on the page's own element. Each component's test renders its example (`components/<name>/examples/<id>.html`) and asserts the output equal to it, so the markup and the CSS cannot part. A component writes vpkit's classes and nothing else: a utility for the page goes in its `class` field or on an element around it. A field whose absence would draw a wrong box silently panics when empty.
- `icon`: Lucide's icons as inline SVG in `currentColor` (rule 12), with `.class()` for a size or a part.
- `css` (a feature): every stylesheet of the app kit embedded by `build.rs` (`include_str!`, absolute paths from the crate's directory, so a git checkout works), `FILES` by their paths in the kit and `write(dir)` to lay them out; the `vpkit-css` binary does the same. An app's cargo dependency at a commit is thus the one pin for its markup and its CSS: its CSS build installs `vpkit-css` from the repository at the rev its lock file names and imports from the written directory. The font files are not embedded; `fonts.css` reads them beside the compiled stylesheet.

`test/rust.mjs` holds the crate, every feature on, to `cargo fmt`, clippy with warnings as errors, its tests and its documentation with no warning.

## The docs theme

`docs-theme/` is VitePress's docs layout for a docs theme: `layout.css`, every layout component's `<style>` with its classes renamed (`VPNavBar` → `vp-nav-bar`, a compound on the root a modifier, `vp-nav-bar--home`, any other class a part, `vp-nav-bar__title`; BEM separators, because VitePress names child components after their parents' parts), on VitePress's variable names; `vars.css`, VitePress's `vars.css`: its palette on the contract's names, unfitted, one `light-dark()` pair each, so a docs site is VitePress exactly where the app kit's defaults are fitted, then every variable of its `:root` with its color names aliased onto the contract (`--vp-c-brand-1: var(--vp-c-brand)`) and the brand button's grounds onto the contract's fills, so a color theme recolors the layout too, the graded containers on the contract's names at `:root:has()`, its other scopes; `icons.css`, VitePress's masks, with the forced-colors rule; and the components VitePress has for a docs site that no app draws. All but the components are written by `scripts/vitepress-port.mjs` from `test/upstream/`. A docs theme imports the app kit's `index.css`, then `vars.css`, `icons.css`, `layout.css` and `prose.css`.

## The markdown

`prose.css` is VitePress's `custom-block.css`, `vp-code-group.css` and `vp-doc.css` verbatim, its color names read as the contract's and the variables it reads (`--vp-code-*`, `--vp-custom-block-*`, the anchor symbol, the copy icons) defined on `.vp-doc`, so it needs nothing but the contract; written by the port script. It stays in `@layer base`, below the components (rule 4): a layer of its own would have to be declared before Tailwind's own order in every entry, or it sorts after the utilities (measured: Tailwind emits its `@layer theme, base, components, utilities` first, and a layer first named later sorts last).

## The documentation site

`docs/` is built with vpkit-zola. A page's example is a component's example file, copied into `docs/examples/` by `scripts/build-docs.mjs` (zola reads only inside the site) and shown by the `vp_example` component in a frame of its own, with the frames' stylesheets built from the component directories (`example.css` for the app kit, `example-docs-theme.css` for the docs theme's). Without a pick the site is on the stock colors; a pick from the gallery is linked by `theme-pick.js` in every page's head for the session. `test/docs.mjs` holds the site; the section on it in `test/README.md` has what.

## Browsers

The app kit needs `light-dark()`: Chrome 123, Safari 17.5, Firefox 120 (every color is a pair; without it the colors fall to their initial values). Native nesting is flattened by the minified build (Tailwind's); unminified, the docs theme's build, it needs Chrome 120, Safari 17.2, Firefox 117. The drawer's slide needs `@starting-style` and `transition-behavior: allow-discrete` (Chrome 117, Safari 17.5, Firefox 129) and degrades to no slide without them. The tests run Chromium only; the other engines are not measured.

## Decisions

1. **The apps do not bind a component's shape** (the owner, 2026-10-17: 不需要被現在的使用者綁住設計，現在全部都是內部在使用，完全可以不考慮相容). A component takes the best shape and the apps follow; no compatibility is kept.
2. **The component boundary.** A VitePress component is vpkit's, always (the owner's 一律收錄), in the product it belongs to; a pattern with no original is vpkit's when it is a part of an app's interface in VitePress's look, and the app's when it is that app's own design, pattern by pattern, the owner deciding.
3. **The contract names the job, not the step.** VitePress's `-1`, `-2`, `-3` and `-soft` became text, hover, fill and tint; the brand button's grounds slots of their own; tip and note the brand's and caution the danger's by default; the derived names gone, each component reading the contract through its locals. 34 colors where tokens.css defined 237 names.
4. **One `light-dark()` pair per color.** Half the declarations, one block per theme, and the pairs follow the page's color scheme into a modal dialog and its `::backdrop` (measured in Chromium 151), at the cost of the browser floor above.
5. **The stock is the fitted palette.** tokens.css's defaults are VitePress's palette with its contrast shortfalls fitted, so no app imports a theme to reach AA; the docs theme carries VitePress's palette verbatim, since a docs site is VitePress exactly.
6. **Variants are attributes.** `data-variant` and `data-size` for a mutually exclusive axis, classes for orthogonal switches, ARIA for states: one principle, uniform specificity, no compound-selector ordering, and a finite axis the crate can type.
7. **One control height, one focus ring.** 2.75rem for every control that shares a row, where VitePress's button was 40px, its social link 36px, the input 44px; base.css's `:focus-visible` outline for everything, where the input drew a box-shadow ring, the button kept the browser's and the choice an outline.
8. **The crate carries the CSS.** With the `css` feature an app's cargo dependency is the one pin; the three apps each had a CSS pin of their own kind and a crate rev moved by hand with nothing tying the two.
9. **Golden values for vpkit's own, upstream for VitePress's.** The upstream clone stays the standard for what is meant to be VitePress's; what is vpkit's is held to its recorded values with its reason beside it; no list of known differences.
10. **Two products.** The docs layout, VitePress's team page, sponsors and ads are the docs theme's, for vpkit-zola; the app kit holds what an application page uses.
11. **The markdown stays in `@layer base`** (The markdown, above).
12. **No graded containers in the app kit.** They are a markdown feature of VitePress's docs; the docs theme's `vars.css` has them; an app that wants caution apart from danger sets `--vp-c-caution`.
13. **No icons.css in the app kit.** Masks need `img-src data:` in a Content-Security-Policy (own-drive had to allow it; crashcart refused it); inline SVG from the crate needs nothing.
