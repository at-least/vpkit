+++
title = "Components"
description = "VitePress's components as CSS classes, one optional import each, so a site ships only the ones it uses."
+++

# Components

VitePress's components as CSS classes, one optional import each, so a site ships only the ones it uses:

```css
@import "vpkit/button.css";
```

The file is named after the class: `vp-badge` is `vpkit/badge.css`, `vp-icon-btn` is `vpkit/icon-btn.css`; `vp-label` and `vp-field-error` share `vpkit/field.css`. Each page opens with its import.

They sit in Tailwind's `components` layer, so a utility on the same element always wins: `class="vp-btn px-8"` gets the wider padding. A modifier works only together with its base class.

Inside a `vp-doc` (the markdown's styles, `content.css`) each component keeps its look and its states: the markdown's rules are in `@layer base`, below the components, as VitePress's components win there by Vue's scoping. Where the markdown sets something a component leaves to the page, such as a heading's margins and rule on a card's title, the component sets it for that place.

Their hover styles are written with `@variant hover`, so they behave like Tailwind's `hover:`: they apply only on a device that can hover (`@media (hover: hover)`, or however your project defines the `hover` variant). VitePress's apply on touch screens too, where a tapped button or card keeps its hover look until the next tap.

The examples on these pages are live. Each is a page of its own, with Tailwind and vpkit as an app imports them and none of this site's markdown styles, and it follows this site's appearance switch.

## Together

{% <vp_example title="A subscription form built from the components"> %}
<div class="grid max-w-md gap-6">
  <div>
    <label class="vp-label" for="code">Coupon code</label>
    <input class="vp-input w-full" id="code" value="SPRING24" aria-invalid="true" aria-describedby="code-error">
    <p class="vp-field-error" id="code-error">This code has expired.</p>
  </div>
  <div class="grid gap-3">
    <label class="vp-choice">
      <input type="radio" name="plan" value="monthly" checked>
      <span>Monthly<br>NT$300 a month</span>
    </label>
    <label class="vp-choice">
      <input type="radio" name="plan" value="yearly">
      <span>Yearly <span class="vp-badge vp-badge-tip">2 months free</span><br>NT$3,000 a year</span>
    </label>
  </div>
  <div class="flex items-center justify-between gap-4">
    <span id="receipts">Email me the receipts</span>
    <button class="vp-toggle" type="button" role="switch" aria-checked="true" aria-labelledby="receipts">
      <span class="vp-toggle-check"></span>
    </button>
  </div>
  <div class="flex justify-end gap-2">
    <button class="vp-btn" type="button">Cancel</button>
    <button class="vp-btn vp-btn-brand" type="button">Subscribe</button>
  </div>
</div>
{% </vp_example> %}

## The list

| Component | Classes | Original |
| --- | --- | --- |
| [Accordion](@/components/accordion.md) | `vp-accordion` | VitePress's nav screen group |
| [Alert](@/components/alert.md) | `vp-alert` | VitePress's custom blocks |
| [Avatar](@/components/avatar.md) | `vp-avatar` | the picture of VitePress's `VPTeamMembersItem` |
| [Badge](@/components/badge.md) | `vp-badge` | VitePress's `VPBadge` |
| [Breadcrumb](@/components/breadcrumb.md) | `vp-breadcrumb` | none, vpkit's own: a folder path |
| [Button](@/components/button.md) | `vp-btn` | VitePress's `VPButton` |
| [Card](@/components/card.md) | `vp-card` | VitePress's `VPFeature` |
| [Choice](@/components/choice.md) | `vp-choice` | none, vpkit's own: a radio or checkbox drawn as a card |
| [Code](@/components/code.md) | `vp-code` | VitePress's inline code |
| [Copy Line](@/components/copy.md) | `vp-copy` | none, vpkit's own: a value to copy, with its button |
| [Dialog](@/components/dialog.md) | `vp-dialog` | none, vpkit's own, on `<dialog>` |
| [Divider](@/components/divider.md) | `vp-divider` | VitePress's markdown rule, and the navbar's vertical rule |
| [Drawer](@/components/drawer.md) | `vp-drawer` | VitePress's sidebar as a phone shows it, over its backdrop |
| [Dropdown](@/components/dropdown.md) | `vp-dropdown` | VitePress's `VPMenu` |
| [Empty State](@/components/empty.md) | `vp-empty` | none, vpkit's own |
| [Field](@/components/field.md) | `vp-label`, `vp-field-error` | none, vpkit's own |
| [Hamburger](@/components/hamburger.md) | `vp-hamburger` | VitePress's `VPNavBarHamburger` |
| [Highlight](@/components/mark.md) | `vp-mark` | the highlight of VitePress's local search box |
| [Icon Button](@/components/icon-btn.md) | `vp-icon-btn` | VitePress's `VPSocialLink` |
| [Input](@/components/input.md) | `vp-input` | none, vpkit's own, on VitePress's input variables |
| [Key](@/components/kbd.md) | `vp-kbd` | the key caps of VitePress's local search box |
| [Link](@/components/link.md) | `vp-link` | VitePress's markdown link |
| [Nav Link](@/components/nav-link.md) | `vp-nav-link` | VitePress's `VPNavMenuLink` |
| [Progress](@/components/progress.md) | `vp-progress` | none, vpkit's own |
| [Skip Link](@/components/skip.md) | `vp-skip` | VitePress's `VPSkipLink` |
| [Spinner](@/components/spinner.md) | `vp-spinner` | the loading ring of VitePress's local search box |
| [Table](@/components/table.md) | `vp-table` | VitePress's markdown tables |
| [Tabs](@/components/tabs.md) | `vp-tabs` | VitePress's code group tab bar |
| [Toast](@/components/toast.md) | `vp-toast` | none, vpkit's own |
| [Toggle](@/components/toggle.md) | `vp-toggle` | VitePress's `VPSwitch` and `VPSwitchAppearance` |
| [Top Bar](@/components/topbar.md) | `vp-topbar` | VitePress's `VPNavBar` and `VPNavBarTitle` |

The library's design, the rules every component follows and how each is held to its original, is [DESIGN.md](https://github.com/at-least/vpkit/blob/main/DESIGN.md).
