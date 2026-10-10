+++
title = "Components"
description = "VitePress's components as CSS classes, one optional import each, so a site ships only the ones it uses."
+++

# Components

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
@import "vpkit/skip.css";
```

They sit in Tailwind's `components` layer, so a utility on the same element always wins: `class="vp-btn px-8"` gets the wider padding. A modifier works only together with its base class.

Inside a `vp-doc` (the markdown's styles, `content.css`) each component keeps its look: the markdown's rules for links, paragraphs and headings, which would outrank a component's own, are restated by the component for that place, as VitePress's components win there by Vue's scoping.

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

| Component | Classes | Taken from |
| --- | --- | --- |
| [Button](@/components/button.md) | `vp-btn` | VitePress's `VPButton` |
| [Icon Button](@/components/icon-btn.md) | `vp-icon-btn` | VitePress's `VPSocialLink` |
| [Link](@/components/link.md) | `vp-link` | VitePress's markdown link |
| [Input](@/components/input.md) | `vp-input` | totality's input, on VitePress's input variables |
| [Field](@/components/field.md) | `vp-label`, `vp-field-error` | totality's field label and inline error |
| [Toggle](@/components/toggle.md) | `vp-toggle` | VitePress's `VPSwitch` and `VPSwitchAppearance` |
| [Choice](@/components/choice.md) | `vp-choice` | totality's radio drawn as a card |
| [Badge](@/components/badge.md) | `vp-badge` | VitePress's `VPBadge` |
| [Code](@/components/code.md) | `vp-code` | VitePress's inline code |
| [Key](@/components/kbd.md) | `vp-kbd` | the key caps of VitePress's local search box |
| [Highlight](@/components/mark.md) | `vp-mark` | the highlight of VitePress's local search box |
| [Alert](@/components/alert.md) | `vp-alert` | VitePress's custom blocks |
| [Card](@/components/card.md) | `vp-card` | VitePress's `VPFeature` |
| [Table](@/components/table.md) | `vp-table` | VitePress's markdown tables |
| [Dropdown](@/components/dropdown.md) | `vp-dropdown` | VitePress's `VPMenu` |
| [Tabs](@/components/tabs.md) | `vp-tabs` | VitePress's code group tab bar |
| [Dialog](@/components/dialog.md) | `vp-dialog` | own-drive's modal |
| [Toast](@/components/toast.md) | `vp-toast` | own-drive's status message |
| [Spinner](@/components/spinner.md) | `vp-spinner` | the loading ring of VitePress's local search box |
| [Progress](@/components/progress.md) | `vp-progress` | own-drive's storage quota bar |
| [Skip Link](@/components/skip.md) | `vp-skip` | VitePress's `VPSkipLink` |

A component taken from VitePress is rendered next to its original in a browser and compared, property by property; one VitePress doesn't have is compared the same way with the app recipe it was taken from. [Tests](@/guide/tests.md)

The library's design is [DESIGN.md](https://github.com/at-least/vpkit/blob/main/DESIGN.md): the rules every component follows, how one is proven against its original, which components come next and in what order, what stays a utility, and how the apps move onto them.
