# Output and upload

Croppa renders the crop into a canvas, so the normal browser canvas output APIs are available through convenient methods.

## Blob output

For uploads, Blob is usually the best v1 API.

~~~js
const blob = await this.croppa.promisedBlob('image/jpeg', 0.9)

const body = new FormData()
body.append('image', blob, 'crop.jpg')
~~~

promisedBlob() is a Promise wrapper around generateBlob().

JPEG has no alpha channel. With the default transparent canvas-color, browsers encode transparent areas of a JPEG export as black. Use 'image/png' to keep transparency, or set canvas-color (for example canvas-color="#fff") before exporting a transparent image as JPEG.

<DemoFrame
  src="/demos/output.html"
  title="Generate real output"
  description="Creates a PNG Blob or data URL from the actual Croppa canvas and displays the result."
  :height="540"
/>

## Callback Blob API

~~~js
this.croppa.generateBlob(
  blob => {
    // use blob
  },
  'image/jpeg',
  0.9
)
~~~

If there is no image, the callback receives null.

## Data URLs

~~~js
const dataUrl = this.croppa.generateDataUrl('image/png')
~~~

Data URLs are convenient for previews and small payloads, but Blob output is normally more memory efficient for uploads.

## Direct canvas access

~~~js
const canvas = this.croppa.getCanvas()
const context = this.croppa.getContext()
~~~

The draw event passes the same CanvasRenderingContext2D after Croppa draws its image, which can be used for overlays.

## Rounded / clipped output {#rounded-output}

image-border-radius affects the canvas result when prevent-white-space is enabled.

<DemoFrame
  src="/demos/rounded.html"
  title="Rounded canvas output"
  description="Exports the clipped crop and renders the generated PNG below the live cropper."
  :height="560"
/>

For custom clipping, addClipPlugin() receives the canvas context and crop dimensions.

## Cross-origin images

Canvas security rules still apply. A remote initial image must be served with compatible CORS headers if you intend to export the canvas. Setting crossorigin alone cannot make a server permit canvas access.

If the canvas becomes tainted, toDataURL() and toBlob() can fail even though the image is visible.
