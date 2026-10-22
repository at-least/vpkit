+++
title = "Carbon Ads"
description = "The box a Carbon ad shows in, and the ad Carbon's script puts in it: VitePress's Carbon ads as a class."
+++

# Carbon Ads

The box a [Carbon](https://www.carbonads.net) ad shows in, and the ad Carbon's script puts in it. VitePress's Carbon ads (`VPCarbonAds`) as a class.

```css
@import "vpkit/docs-theme/components/carbon-ads/carbon-ads.css";
```

The page puts Carbon's script in the box, and the script writes the ad:

```html
<div class="vp-carbon-ads">
  <script async src="//cdn.carbonads.com/carbon.js?serve=…&placement=…&format=classic" id="_carbonads_js"></script>
</div>
```

{{ <vp_example file="carbon-ads/ad" title="An ad in the markup Carbon writes" kit="docs-theme" /> }}

- `vp-carbon-ads`: the box, on the ads' ground, rounded, at least 16rem tall, centering what it holds.
- The ad is Carbon's markup: its image centered and rounded, its text (`carbon-text`) and its credit (`carbon-poweredby`) under it, the text brand-colored and the credit in body text while hovered. Of the ads it holds, only the first shows. Carbon's other classes (`carbon-wrap`, `carbon-img`) style nothing, so the example leaves them out.
- The colors are the `--vp-carbon-ads-*` variables of the docs theme's `vars.css`, derived from the theme's text, brand and soft ground.
- Inside a `vp-doc` the ad's links take no underline from the markdown, vpkit's addition: VitePress shows the box only in its aside, outside the markdown.
