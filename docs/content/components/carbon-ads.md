+++
title = "Carbon Ads"
description = "The box a Carbon ad shows in, and the ad Carbon's script puts in it: VitePress's Carbon ads as a class."
+++

# Carbon Ads

The box a [Carbon](https://www.carbonads.net) ad shows in, and the ad Carbon's script puts in it. VitePress's Carbon ads (`VPCarbonAds`) as a class.

```css
@import "vpkit/carbon-ads.css";
```

The page puts Carbon's script in the box, and the script writes the ad:

```html
<div class="vp-carbon-ads">
  <script async src="//cdn.carbonads.com/carbon.js?serve=…&placement=…&format=classic" id="_carbonads_js"></script>
</div>
```

{% <vp_example title="An ad as Carbon writes it"> %}
<div class="vp-carbon-ads max-w-64">
  <div id="carbonads">
    <span>
      <span>
        <a href="#"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='100' viewBox='0 0 130 100'%3E%3Crect width='130' height='100' fill='%235672cd'/%3E%3C/svg%3E" alt="" width="130" height="100"></a>
        <a class="carbon-text" href="#">Build a better docs site, faster, with the new release.</a>
      </span>
      <a class="carbon-poweredby" href="#">ads via Carbon</a>
    </span>
  </div>
</div>
{% </vp_example> %}

- `vp-carbon-ads`: the box, on the ads' ground, rounded, at least 16rem tall, centering what it holds.
- The ad is Carbon's markup: its image centered and rounded, its text (`carbon-text`) and its credit (`carbon-poweredby`) under it, each brightened while hovered. Of the ads it holds, only the first shows.
- The colors are the `--vp-carbon-ads-*` variables, derived from the theme's text, brand and soft ground.
