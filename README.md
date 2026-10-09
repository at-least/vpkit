# vpkit

The VitePress default-theme look as a [Tailwind CSS v4](https://tailwindcss.com) theme: the `--vp-*` theme variables, semantic utilities that resolve to them, VitePress's breakpoints, class-based dark mode and the Inter webfonts, plus VitePress's components as CSS classes (`vp-btn`, …) and 200 color themes. Extracted from [rustpress](https://github.com/at-least/rustpress).

It is plain CSS for Tailwind to compile. There is no build step; `npm install` is only needed to run its tests.

## Use

Add it as a dependency (here from a sibling checkout):

```sh
npm install --save-dev ../vpkit
```

Then import it from your Tailwind entry stylesheet, after Tailwind itself:

```css
@import "tailwindcss" source(none);
@source "../src";             /* wherever your class strings live */
@import "vpkit/fonts.css";  /* optional: the Inter webfonts */
@import "vpkit";
```

`@source` stays in your stylesheet: Tailwind resolves it relative to the file it is written in.

### Taking only some parts

`vpkit` (index.css) is four files, each importable on its own:

| file | what it holds |
| --- | --- |
| `vpkit/theme.css` | the `dark:` variant, the breakpoints, the semantic utilities |
| `vpkit/tokens.css` | the `--vp-*` variables (plain CSS, no Tailwind directive) |
| `vpkit/doc.css` | code-block and external-link rules for rendered markdown |
| `vpkit/base.css` | VitePress's global element rules |

`base.css` is unlayered and resets focus outlines (`button:focus { outline: none }`), so a project that draws its own focus rings should leave it out:

```css
@import "tailwindcss" source(none);
@import "vpkit/tokens.css";
@import "vpkit/theme.css";
```

## What you get

- **Dark mode**: put `class="dark"` on `<html>`. The `dark:` variant, every `--vp-*` variable and the color scheme (scrollbars, form controls) follow it.
- **Page colors** are yours to set: put `bg-bg text-text-1` on `<body>`. vpkit colors its components, not the page.
- **Breakpoints**: VitePress's, in px, replacing Tailwind's defaults: `sm` 640px, `md` 768px, `lg` 960px, `xl` 1280px, `2xl` 1440px.
- **Semantic colors** for every color utility (`text-`, `bg-`, `border-`, …):
  `bg`, `bg-alt`, `bg-elv`, `bg-soft`, `text-1`, `text-2`, `text-3`, `border`, `divider`, `gutter`, `brand-1`/`2`/`3`/`soft`, `default-1`/`2`/`3`/`soft`, `success-1`/`soft`, `danger-1`/`soft`, `sponsor`. So `text-text-1`, `bg-bg-alt`, `border-divider`, `text-brand-1`, `text-danger-1`.
- **Shadows and fonts**: `shadow-1` … `shadow-5`, `font-sans`, `font-mono`.
- **The `--vp-*` variables** from VitePress's `vars.css`: colors, typography, z-indexes, and the per-component ones (nav, sidebar, code, buttons, custom blocks, badges, search). Use them directly in arbitrary values, e.g. `h-(--vp-nav-height)`.
- **Global rules** that cannot be utilities (`base.css`): the color scheme of the appearance, bold at 600, pointer cursor on buttons, focus outlines, reduced motion, CJK line breaking, the Alpine `[x-cloak]` rule.
- **Markdown rules** (`doc.css`): the code-block line notations under `.vp-doc pre`, the code-block title bar and the external-link icon.
- **Graded containers**: a `vp-graded-containers` class anywhere on the page switches warning and caution to GitHub's severity colors.
- **Color themes**: 200 of them in `themes/`, one file each (see [Color themes](#color-themes)).

## Theming

The rules are unlayered, so a stylesheet loaded later can override any variable for both modes:

```css
:root { --vp-c-brand-1: #0969da; }
.dark { --vp-c-brand-1: #4493f8; }
```

### Color themes

`themes/` holds 200 ready-made color themes. Each is a whole design: it sets every `--vp-c-*` color the stylesheets use, and the five `--vp-shadow-*`, for light (`:root`) and dark (`.dark`). The `-2` of tip, important, warning, danger and caution, the hover color of a link in that alert or custom block, is the role's `-1` stepped 15% toward black in light and toward white in dark, the step the generator gives `brand-2` (so `tip-2` no longer follows `brand-2` as in VitePress's `vars.css`: a theme's `brand-2` is fit for white text on it, not for text on the tip tint); a theme with a second accent step of its own can set it by hand. Import one after vpkit, or link it after your compiled stylesheet:

```css
@import "vpkit";
@import "vpkit/themes/nord.css";
```

A theme only sets variables, so the components and your utilities follow it.

- 24 are curated: `github`, `catppuccin`, `nord` and `rose-pine` are hand-tuned, 20 more are mapped by hand from their published palettes.
- 176 are mapped automatically from the Helix editor's palettes (`helix/`), with accents adjusted where the published colors fall short of WCAG AA.

`test/themes.mjs` holds every theme to the whole contract (every `--vp-c-*` vpkit's stylesheets reference: the base, the components, the layout, the markdown and the icons, less VitePress's own undefined `--vp-c-shadow-3` in VPSidebar.vue) in both modes, and to contrast minimums: body text 7:1, secondary text 4.5:1 on the page and on the soft surfaces, muted text 3:1, links 4.5:1, white button labels 3:1, each badge and alert color 4.5:1 on its own tint, and the alert link hover colors (the `-2`) 4.5:1 on the same tint.

A theme sets `:root` and `.dark`, so one applies per page. To switch themes at runtime, scope copies of their rules under an attribute of your own, such as `[data-theme="nord"]`.

The generated themes come from `scripts/gen-themes.py` (Python 3.11+): edit its slot maps, run `python3 scripts/gen-themes.py`, then `npm test`. The four hand-tuned ones are edited directly.

## Fonts

`fonts.css` refers to the files as `url("fonts/…")`, relative to the compiled stylesheet: the Tailwind CLI leaves these URLs as written. Serve this package's `fonts/` directory next to your built CSS.

## Components

VitePress's components as CSS classes, one optional import each, so a site ships only the ones it uses:

```css
@import "vpkit/button.css";
@import "vpkit/badge.css";
@import "vpkit/alert.css";
@import "vpkit/table.css";
@import "vpkit/card.css";
@import "vpkit/input.css";
@import "vpkit/toggle.css";
@import "vpkit/link.css";
@import "vpkit/code.css";
@import "vpkit/spinner.css";
@import "vpkit/dialog.css";
@import "vpkit/dropdown.css";
@import "vpkit/icon-btn.css";
@import "vpkit/tabs.css";
@import "vpkit/kbd.css";
@import "vpkit/mark.css";
@import "vpkit/choice.css";
@import "vpkit/field.css";
@import "vpkit/toast.css";
@import "vpkit/progress.css";
```

They sit in Tailwind's `components` layer, so a utility on the same element always wins: `class="vp-btn px-8"` gets the wider padding. A modifier works only together with its base class.

The library's design is [DESIGN.md](DESIGN.md): the rules every component follows, how one is proven against its original, which components come next and in what order, what stays a utility, and how the apps move onto them.

Their hover styles are written with `@variant hover`, so they behave like Tailwind's `hover:`: they apply only on a device that can hover (`@media (hover: hover)`, or however your project defines the `hover` variant). VitePress's apply on touch screens too, where a tapped button or card keeps its hover look until the next tap.

### Button

VitePress's `VPButton`.

```html
<a class="vp-btn vp-btn-brand" href="/guide">Get Started</a>
<button class="vp-btn">Cancel</button>
```

- `vp-btn` alone: the medium size, alt (gray) theme.
- `vp-btn-brand`, `vp-btn-sponsor`: the other two themes.
- `vp-btn-danger`: vpkit's addition, own-drive's danger button: danger text on the danger tint, the same hovered and pressed, since the ground is the warning.
- `vp-btn-big`: the big size.

Two additions VitePress's button doesn't have: it is `inline-flex`, so an icon and its label sit centered side by side 0.5rem apart, and a `disabled` button is dimmed to half opacity with a not-allowed cursor.

```html
<button class="vp-btn vp-btn-big"><svg>…</svg>Sign in with Google</button>
```

Use it on `<a href>` or `<button>`, as VitePress does: those elements supply the pointer cursor, the class doesn't.

### Badge

VitePress's `VPBadge`.

```html
<h2>Search <span class="vp-badge vp-badge-tip">new</span></h2>
```

- `vp-badge` alone: the info type (gray).
- `vp-badge-note`, `vp-badge-tip`, `vp-badge-important`, `vp-badge-caution`, `vp-badge-warning`, `vp-badge-danger`: the other types.
- `vp-badge-success`: vpkit's addition (VitePress has no success badge), built the way VitePress builds the others: success text on the soft success tint.
- `vp-badge-small`: the small size.

VPBadge's own adjustments come with it: in a `.vp-doc` heading (h1 to h6) a badge sits centered on the line, with VitePress's margins, padding and line height for each level (small or not), and in the doc footer (`.vp-doc-footer`) it is hidden.

### Alert

VitePress's custom blocks (`::: tip` and the others).

```html
<div class="vp-alert vp-alert-tip">
  <p class="vp-alert-title">TIP</p>
  <p>Body text, with <a href="/guide">links</a> and <code>code</code>.</p>
</div>
```

- `vp-alert` alone: the info type (gray).
- `vp-alert-note`, `vp-alert-tip`, `vp-alert-important`, `vp-alert-warning`, `vp-alert-danger`, `vp-alert-caution`: the other types.
- `vp-alert-title`: the bold title line; a block with one gets the larger top padding.
- `vp-alert-details`: the details block, on a `<details>`. Its `<summary>` is the title, bold, with the pointer; the block opens and closes as the element does.

```html
<details class="vp-alert vp-alert-details">
  <summary>Details</summary>
  <p>Body text.</p>
</details>
```

Links, inline code and paragraphs inside take the alert's look. A nested alert keeps its own colors. A component inside an alert keeps its own look too: a `vp-btn`, `vp-card`, `vp-dropdown-item` or `vp-tabs-tab` link is not restyled as a link. Only the alert's link hover dimming applies to it.

Not included: the rules for tables and blockquotes inside a block.

### Table

VitePress's markdown tables.

```html
<table class="vp-table">
  <thead><tr><th>Plan</th><th>Price</th></tr></thead>
  <tbody><tr><td>Pro</td><td>$9</td></tr></tbody>
</table>
```

The table scrolls sideways on its own rather than squeezing its columns, and every second row is banded. It keeps VitePress's 1.25rem vertical margin; `my-0` removes it.

### Card

VitePress's `VPFeature`, the home page's feature boxes.

```html
<a class="vp-card" href="/guide">
  <h2 class="vp-card-title">Fast</h2>
  <p class="vp-card-details">Instant server start.</p>
</a>
```

- `vp-card`: the soft surface with 1.5rem padding, a flex column filling its container's height. As a link (`<a class="vp-card">`) its border turns brand on hover.
- `vp-card-title`, `vp-card-details`: the bold title and the secondary text under it, which takes the free height.

Not included: the feature icon.

### Input

VitePress defines input variables (`--vp-input-border-color`, `--vp-input-bg-color`) but no input component. This is totality's input, built on those variables.

```html
<input class="vp-input w-full" placeholder="Coupon code">
<input class="vp-input" aria-invalid="true">
<select class="vp-input w-full"><option>7 days</option><option>30 days</option></select>
<textarea class="vp-input w-full" rows="4"></textarea>
```

- 44px tall with 16px text (iOS zooms into anything smaller), the input border on the input background, a brand border on hover and focus.
- Focus draws a 2px brand ring as a box-shadow, since `base.css` removes focus outlines.
- `aria-invalid="true"` turns the border danger and `"false"` success, even on hover and focus.
- The width is yours: add `w-full` or any width utility.
- On a `<select>` it is the same box, and the browser draws the arrow. Where the text sits is the browser's: Chromium sets it 4px further in than an input's, and 1px lower, as it centers the text on a line height of its own. `ps-2` on the select aligns the start edges in Chromium.
- On a `<textarea>` the height follows `rows`, never less than the input's, with 9px above and below the text, so a one-row textarea is the input's box with its text on the same pixels. `rows` and the resize handle are the markup's.

### Toggle

VitePress's `VPSwitch`, with `VPSwitchAppearance` as a modifier.

```html
<button class="vp-toggle" type="button" role="switch" aria-checked="false" aria-label="Notifications">
  <span class="vp-toggle-check"></span>
</button>
```

- `vp-toggle`: the 2.5rem × 1.375rem track on the input tokens, a brand border on hover. `vp-toggle-check`: the knob, which slides to the right while the button's `aria-checked` is `"true"`. That state is vpkit's addition (VPSwitch has none of its own; only the appearance switch moves its knob, by `.dark`): keep `aria-checked` in step with the setting, and the component reads nothing else.
- `vp-toggle-icon`: the round clip for an icon in the knob, any `vpi-*` icon of `icons.css` (0.75rem, `text-2`, `text-1` in dark), placed as VPSwitch places it. The icon's class list must start with the `vpi-` class, as VPSwitch's `[class^='vpi-']` rule has it.
- `vp-toggle-appearance`: the appearance switch. The knob follows `.dark` on `<html>` as VitePress's does, so it is right before any script runs; of the two icons the sun (`vpi-sun`) shows in light, the moon (`vpi-moon`) in dark:

```html
<button class="vp-toggle vp-toggle-appearance" type="button" role="switch" aria-checked="false" aria-label="Appearance">
  <span class="vp-toggle-check"><span class="vp-toggle-icon">
    <span class="vpi-sun" aria-hidden="true"></span><span class="vpi-moon" aria-hidden="true"></span>
  </span></span>
</button>
```

The script that toggles `.dark` and `aria-checked` is the page's (vpkit-zola's `vpkit-zola.js` has VitePress's). `icons.css` is its own import.

### Link

VitePress's markdown link (`.vp-doc a`) as a class, for a link outside the markdown.

```html
<a class="vp-link" href="/orders">All orders</a>
<button class="vp-link" type="button">Cancel</button>
```

- Brand text at weight 500, underlined 0.125rem below, `brand-2` on hover.
- On a `<button>` it looks the same; the hit area is the page's (`min-h-10 px-2`).
- A `<code>` inside takes VitePress's colors for code in a link, over `vp-code`'s own.
- Its two colors are the variables `--vp-link-text` and `--vp-link-hover-text`, so a site retunes them in one rule.

### Code

VitePress's inline code (`.vp-doc :not(pre) > code`) as a class, for code outside the markdown.

```html
<code class="vp-code">ORD-2026-0142</code>
```

- 0.875em code in the brand color on the soft gray, a 0.25rem radius; the face is the page's code face.
- In a `vp-link` it takes the link's colors, as code in a markdown link does.
- Not for code inside an alert: a plain `<code>` there takes the alert's tint, which `vp-code` would override. Inside `.vp-doc`, `content.css` styles every `code` already.

### Spinner

VitePress's loading ring, the one in the local search box.

```html
<span class="vp-spinner" role="status" aria-label="Loading"></span>
<button class="vp-btn vp-btn-brand" disabled><span class="vp-spinner size-4"></span>Paying…</button>
```

- An 18px ring of the divider color with a brand quarter, a turn every 0.8s; `size-4` or any size utility resizes it.
- It turns whenever it is rendered: show and hide it with `hidden` or your request library's indicator.
- In a button it turns in the label's color instead, which every button style holds against its ground; VitePress's brand and divider colors would vanish on a brand button. Its colors are the variables `--vp-spinner-ring` and `--vp-spinner-head`.
- It stops under `prefers-reduced-motion`, as VitePress's does.

### Dialog

VitePress has no dialog. This is own-drive's modal, on the `<dialog>` element, which brings the top layer, the focus trap, Escape and the backdrop.

```html
<dialog class="vp-dialog" aria-labelledby="rename-title">
  <h2 class="vp-dialog-title" id="rename-title">Rename</h2>
  <p>A new name for notes.txt.</p>
  <div class="vp-dialog-actions">
    <button class="vp-btn" type="button">Cancel</button>
    <button class="vp-btn vp-btn-brand" type="submit">Rename</button>
  </div>
</dialog>
```

- The elevated surface in a divider border, a 0.75rem radius, `shadow-4`; the backdrop is `--vp-backdrop-bg-color`.
- `vp-dialog-title`: the 1.05rem semibold title. `vp-dialog-actions`: the buttons, at the end of a row 0.5rem apart.
- Open it with `showModal()`. The browser centers a modal dialog with `margin: auto`, which Tailwind's preflight removes from every element, so the dialog sets it back.
- 26rem wide, at most 92vw: unlike the other components it has a width, since a dialog without one shrinks to its content. A width utility replaces it.

### Dropdown

VitePress's `VPMenu`, the panel of a navbar flyout, with `VPMenuLink` items and `VPMenuGroup` groups.

```html
<div class="vp-dropdown" role="menu">
  <a class="vp-dropdown-item" role="menuitem" href="/profile">Profile</a>
  <button class="vp-dropdown-item" role="menuitemradio" aria-checked="true">Comfortable</button>
  <div class="vp-dropdown-group" role="group" aria-labelledby="sort">
    <p class="vp-dropdown-title" id="sort">Sort by</p>
    <button class="vp-dropdown-item" role="menuitem">Name</button>
  </div>
</div>
```

- `vp-dropdown`: the panel, the elevated surface with `shadow-3`, at least 8rem wide, scrolling once it is as tall as the viewport under the navbar.
- `vp-dropdown-item`: a row, a link or a button; brand on a soft gray when hovered, brand while it is the current one: `aria-current` with a value such as `page`, or `aria-checked="true"`. An empty `aria-current` is not current, as WAI-ARIA has it.
- `vp-dropdown-group`, with an optional `vp-dropdown-title`: every group but the first has a rule above it. The markup is flat where VitePress's is nested lists, so items that follow a group go in a group of their own.
- Placing the panel and opening it are the page's.
- Change the panel's padding with `--vp-dropdown-padding`, as in `[--vp-dropdown-padding:0.5rem]`, which the groups follow to reach the panel's edges. A padding utility moves only the panel's edge, and the groups then overhang it.

### Icon button

VitePress's `VPSocialLink`, the navbar's social icons, as a button for any icon.

```html
<button class="vp-icon-btn" type="button" aria-label="Delete"><span class="vpi-delete"></span></button>
<a class="vp-icon-btn" href="/trash" aria-label="Trash"><svg viewBox="0 0 24 24">…</svg></a>
```

- A 2.25rem square centering a 1.25rem icon, `text-2`, `text-1` on hover. The icon is a `vpi-*` icon of `icons.css` or an inline SVG, which takes the text color unless it sets its own `fill`.
- vpkit's addition: a 0.5rem radius and the soft gray ground on hover, so it reads as a control.
- The button shows only the icon: give it an `aria-label`.

### Tabs

VitePress's code group tab bar.

```html
<div class="vp-tabs" role="tablist">
  <button class="vp-tabs-tab" type="button" role="tab" aria-selected="true">npm</button>
  <button class="vp-tabs-tab" type="button" role="tab" aria-selected="false">pnpm</button>
</div>
```

- `vp-tabs`: the bar, on the code block's ground with a divider along its bottom and rounded top corners; it scrolls sideways when the tabs don't fit.
- `vp-tabs-tab`: a 48px tab, `text-1` on hover and while `aria-selected="true"`, when a 2px brand bar marks it.
- Showing the selected tab's panel, and moving the selection with the arrow keys, are the page's.

### Key

The key caps of VitePress's local search box, which lists its shortcuts with them.

```html
<p>Press <kbd class="vp-kbd">Esc</kbd> to close.</p>
```

- A faint gray cap in a fainter gray border with a soft shadow, at least 1.5rem wide, centered on the line. Its text is the page's size.
- The grays are VitePress's own, half-transparent and the same in both modes, so the key sits on any ground; it reads no theme color.
- In running text, a smaller size (`text-xs`) keeps it from opening up the line, as the search box's 0.8rem list does.

### Highlight

The highlight of VitePress's local search box, which marks the matched words in its results.

```html
<p>Found: the <mark class="vp-mark">badge</mark> component.</p>
```

- The search's highlight colors, the brand under the page's inverse text, with a 0.125rem radius and 0.125rem of padding at each side.

### Choice

A radio or a checkbox drawn as a selectable card. VitePress has none; this is totality's, on VitePress's tokens.

```html
<label class="vp-choice">
  <input type="radio" name="plan" value="monthly">
  <span>Monthly<br>NT$300 a month</span>
</label>
```

- The page ground in a divider border, 1rem padding, 14px text; the control first, 16px, in the brand color.
- A brand border on hover. While its control is checked: the brand border on the brand tint. While the control has the keyboard's focus: a 2px brand outline around the card.
- Its states are its control's, read with `:has()`: there is nothing to toggle but the control.

### Field

A form field's label and its error line, to go with `vp-input`. VitePress has no form fields; these are totality's.

```html
<label class="vp-label" for="code">Coupon code</label>
<input class="vp-input w-full" id="code" aria-invalid="true" aria-describedby="code-error">
<p class="vp-field-error" id="code-error">This code has expired.</p>
```

- `vp-label`: 14px `text-1` at weight 500, 0.375rem above its control.
- `vp-field-error`: 14px danger text, 0.5rem under the control.
- The two margins are the field's own spacing; `mb-0` and `mt-0` remove them. Tie the error to its control with `aria-describedby`, and mark the control `aria-invalid`, which turns `vp-input`'s border danger.

### Toast

The surface of a short status message. VitePress has none; this is own-drive's.

```html
<div class="vp-toast fixed bottom-4 left-1/2 -translate-x-1/2" role="status">Saved notes.txt</div>
```

- The elevated surface in a divider border, a 0.5rem radius, `shadow-3`.
- Where it sits, how long it stays, and showing and hiding it are the page's. Announce it from a live region the page keeps rendered; one that is `display: none` while empty may not be read out when the message arrives.

### Progress

A progress bar. VitePress has none; this is own-drive's storage quota bar.

```html
<span class="vp-progress w-28" role="progressbar" aria-label="Storage used"
      aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
  <span class="vp-progress-bar" style="width: 40%"></span>
</span>
```

- `vp-progress`: the track, a 0.3rem bar of the soft gray with rounded ends, as wide as its container. In a flex row it claims the whole row and squeezes the items beside it; give it `flex-1` to take only the free space, or a width utility.
- `vp-progress-bar`: the brand fill, empty until the page sets its width. The value for assistive technology goes in the progressbar's `aria-value*` attributes.
- With forced colors, as in Windows' contrast themes, the track is framed and the fill takes the system's highlight color.

## Layout

VitePress's page layout as classes, for a docs theme (vpkit's Zola theme is built on them). Unlike the components above, these keep VitePress's markup: build it from VitePress's templates (`src/client/theme-default`) and rename the classes:

- a component's root class becomes its block, in kebab case: `VPContent` → `vp-content`, `VPNavBar` → `vp-nav-bar`; `VPDoc` → `vp-doc-page`, since `vp-doc` is the class of the markdown inside it
- a class its CSS sets together with the root becomes a modifier: `.VPContent.has-sidebar` → `vp-content--has-sidebar`; so do the few classes a template puts on its root that `test/layout-map.mjs` names (VPDocOutlineItem's `root` and `nested`), and the classes VitePress v2 adds to a root by variant, named for it (VPNavMenu's `VPNavBarMenu` → `vp-nav-menu--bar`, VPNavTranslations' `VPNavScreenTranslations` → `vp-nav-translations--screen`)
- any other class of its own becomes a part: VPDoc's `.aside` → `vp-doc-page__aside`; a class its CSS reaches inside a child with `:deep()` keeps the child's name (VPSidebarGroup's `.caret-icon` is `vp-sidebar-item__caret-icon`), unless it styles what fills the component's slot: VPMenu's `.group` and `.item` are `vp-menu__group` and `vp-menu__item`, which those elements carry next to their own names
- global classes keep their names: `vp-doc`, `visually-hidden`, the `vpi-*` icons

A component without a root class of its own takes the one `test/layout-map.mjs` gives it: VPSidebarGroup's `div.group` elements are `vp-sidebar-group`.

BEM separators, because VitePress names child components after their parent's parts (VPNavBar's `.title` holds VPNavBarTitle, `vp-nav-bar-title`).

```css
@import "vpkit/icons.css";   /* the vpi-* icons */
@import "vpkit/layout.css";  /* the page layout */
@import "vpkit/content.css"; /* the markdown */
```

- `icons.css`: VitePress's icons, `<span class="vpi-search"></span>`, a 1em mask over the text color. They are Lucide's (ISC, `LICENSE-Lucide`).
- `layout.css`: the skeleton (`vp-layout`, `vp-content`, `vp-doc-page`, `vp-skip-link`, `vp-backdrop`, the `visually-hidden` helper), the navbar (`vp-nav`, `vp-nav-bar`, `vp-nav-bar-title`, `vp-nav-bar-search`, `vp-nav-menu`, `vp-flyout`, `vp-menu`, `vp-nav-translations`, `vp-nav-appearance`, `vp-switch-appearance`, `vp-nav-social-links`, `vp-nav-bar-hamburger`, `vp-nav-bar-extra`, …) with the nav screen of phones (`vp-nav-screen`), the sidebar (`vp-sidebar`, `vp-sidebar-group`, `vp-sidebar-item`), the local nav under the navbar on narrow screens (`vp-local-nav`, `vp-local-nav-outline-dropdown`), the aside with the outline (`vp-doc-aside`, `vp-doc-aside-outline`, `vp-doc-outline-item`), the doc footer (`vp-doc-footer`: the edit link, `vp-last-updated`, prev and next), the site footer (`vp-footer`) and the home page (`vp-home`: `vp-hero` with `vp-button`s and an image, `vp-features` of `vp-feature`s, `vp-home-content`). `vp-button` and `vp-feature` are VitePress's VPButton and VPFeature as they are, for the home page's markup; `vp-btn` and `vp-card` (above) are the versions changed for apps. The 404 page's content is `vp-not-found`, the local search's dialog `vp-local-search-box`. Their states are classes a script toggles, as VitePress's Vue components do: `vp-sidebar--open`, `vp-sidebar-item--collapsed`, `vp-local-nav-outline-dropdown__open`.
- `content.css`: the markdown inside `<div class="vp-doc">`, VitePress's own styles for it with its own class names: headings with `.header-anchor` links, `.custom-block` containers and GitHub alerts, `div[class*='language-']` code blocks (copy button, language label, highlighted, diff and focused lines, line numbers), `.vp-code-group` tabs. Not the code's colors: those come with the highlighter, as Shiki's do in VitePress (vpkit-zola uses Giallo's).

Compile these unminified: Tailwind's `--minify` rounds numbers to six digits, and VitePress's `line-height: 1.3333333` as `1.33333` makes each `h2` 1/64px shorter.

The layout files are written by `scripts/vitepress-port.mjs` from VitePress's component styles, with the declarations unchanged; `node scripts/vitepress-port.mjs --write` rewrites them after a re-sync, and the tests fail if a file is not its output.

## Tests

```sh
npm install
npm test
```

`test/themes.mjs` checks every color theme against the contract and the contrast minimums above (ported from rustpress's tests, check for check).

Each component is rendered next to the VitePress original in headless Chromium and their computed styles compared, in light and dark mode and with `:hover`/`:active` forced. On an emulated touch screen, each component with `:hover` forced must look as it does at rest. vpkit is compiled minified, as it ships; lengths match within 1/32 px because the minifier shortens numbers like `2.7142857` to `2.71429`. The originals in `test/upstream/` are verbatim copies from the tag in `test/upstream/SOURCE`. A component without a VitePress original is compared with the app recipe it was taken from (`test/recipes.mjs`). Intentional differences are listed, with their reasons, in `known` in `test/cases.mjs`; an entry that stops matching fails the run. While building a component, `CASES='^dialog' node test/compare.mjs` runs only the cases whose names match.

`test/forced-colors.mjs` renders, with Chromium's emulation of Windows' contrast themes, the components that show a state only with a background or a shadow, which those themes replace: a checked and an unchecked toggle, and a progress bar at two values, must render differently.

`test/layout.mjs` takes the layout components from pages VitePress rendered (`test/upstream/pages`). The skeleton's components are taken alone: their own elements, child components reduced to their roots. The navbar, the nav screen, the sidebar, the local nav, the aside, the doc footer and the home page are taken as families, each with the components inside it, so rules that cross components count too; there VitePress's side keeps Vue's scoping, each `<style>` compiled by `@vue/compiler-sfc` (the version VitePress locks) with the scope id the page shows. What VitePress renders only in the browser, the outline or the open sidebar, comes from snapshots of vitepress.dev (`test/upstream/pages/hydrated`, taken by `scripts/snapshot-vitepress.mjs`, which refuses a site running another VitePress version). Each case renders VitePress's markup with VitePress's styles and with vpkit's renamed classes, and compares every element's computed style, pseudo-elements and box at widths around each breakpoint, and in dark mode. The markdown is compared whole: the `.vp-doc` of VitePress's markdown guide, without the output of plugins vpkit does not style (code block titles, MathJax). vpkit is compiled unminified here, as a docs theme ships it, and lengths match within 1/32px, the rounding of layout.

## License

MIT (`LICENSE`). The CSS variables and the Inter font files are ported from [VitePress](https://github.com/vuejs/vitepress), and `test/upstream/` holds verbatim copies of its files: VitePress is MIT too (`LICENSE-VitePress`). Inter itself is licensed under the SIL Open Font License 1.1 (`LICENSE-Inter`). The icons in `icons.css` are Lucide's, under the ISC license (`LICENSE-Lucide`). The Helix palettes in `helix/`, which the color themes are generated from, are copies from the [Helix editor](https://github.com/helix-editor/helix) under the Mozilla Public License 2.0 (`helix/LICENSE`; where they come from: `helix/SOURCE`).
