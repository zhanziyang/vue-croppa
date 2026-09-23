# Troubleshooting

These are the failure modes that appeared most often in the original docs and issue tracker.

## Exported file is too large

v1 output dimensions are:

~~~text
output width  = width × quality
output height = height × quality
~~~

A larger canvas means more pixels and usually a larger file.

You can reduce `quality`, reduce the cropper dimensions, or export JPEG/WebP-style lossy output where supported:

~~~js
const blob = await this.croppa.promisedBlob('image/jpeg', 0.82)
~~~

Do not confuse the JPEG quality argument with Croppa's `quality` prop: they control different things.

## Cross-origin / tainted canvas errors

A remote image can be visible while export still fails. Canvas export follows browser CORS rules.

The image server must send a compatible `Access-Control-Allow-Origin` response header. If the server does not permit cross-origin canvas use, Croppa cannot bypass that policy.

When using the `initial-image` URL prop, Croppa requests non-data/non-blob images with anonymous CORS mode.

When using an `initial` slot manually, set `crossorigin="anonymous"` before the image is fetched:

~~~html
<croppa v-model="croppa">
  <img
    slot="initial"
    crossorigin="anonymous"
    src="https://example.com/image.jpg"
  >
</croppa>
~~~

## EXIF orientation

Locally selected JPEG files are parsed for EXIF orientation by v1.

For an initial image supplied through the slot, v1 cannot recover the original file metadata itself. You can provide the EXIF orientation value explicitly:

<DemoFrame
  src="/demos/exif.html"
  title="Initial-image EXIF hint"
  description="The local slot image uses data-exif-orientation=6 and the browser test verifies the resulting orientation."
  :height="500"
/>

~~~html
<croppa v-model="croppa">
  <img
    slot="initial"
    src="/photo.jpg"
    data-exif-orientation="6"
  >
</croppa>
~~~

## Initial image changed but the crop did not

After changing `initial-image`, call `refresh()`:

~~~js
this.imageUrl = nextUrl

this.$nextTick(() => {
  this.croppa.refresh()
})
~~~

## Responsive size looks wrong

v1 `auto-sizing` reads the rendered size of `.croppa-container` and updates it on the window resize event.

Make sure the Croppa root has a concrete computed width and height. See the [responsive demo](/examples/#responsive-auto-sizing).

## Blob is null

`generateBlob()` and `promisedBlob()` return null when there is no active image.

~~~js
if (!this.croppa.hasImage()) return

const blob = await this.croppa.promisedBlob()
~~~

Use `new-image-drawn` to enable export controls only after the first render.

## Metadata did not reproduce the crop after layout changes

v1 metadata stores canvas-oriented values such as `startX`, `startY`, and `scale`. It was not designed as a viewport-independent crop format.

For v1, restore metadata against the same cropper geometry whenever possible.

This limitation is one of the reasons v2 is moving to normalized, serializable source-relative crop coordinates.

## The component seems frozen after custom DOM/event work

Avoid adding document-level mouse/touch handlers around Croppa unless they are removed reliably. The v1 interaction layer already manages its own events.

If you are building a resizable wrapper, prefer changing explicit props or `auto-sizing` and let Croppa refresh its dimensions rather than intercepting the cropper's gestures.

## Need to verify a regression?

The repository now keeps first-party demos under `site/public/demos/` and runs them in Chromium with Playwright. The original `docs/simple-test.html` is also adapted to deterministic local assets during the docs build.

A regression should be reproduced in one of those pages and turned into a browser assertion instead of relying only on a CodePen.
