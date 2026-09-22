# Manipulation and state

Croppa exposes the same operations users perform with mouse and touch as imperative methods.

## Move and zoom

~~~js
this.croppa.move({ x: -20, y: 10 })
this.croppa.zoomIn()
this.croppa.zoomOut()
~~~

Directional convenience methods are also available: moveUpwards, moveDownwards, moveLeftwards, and moveRightwards.

<DemoFrame
  src="/demos/manipulation.html"
  title="Manipulation methods"
  description="Move, zoom, rotate, and flip while reading the live crop metadata."
  :height="520"
/>

## Keep the viewport covered

prevent-white-space constrains movement and zoom so the image continues to cover the crop canvas.

~~~html
<croppa v-model="croppa" prevent-white-space></croppa>
~~~

## Rotate and flip

~~~js
this.croppa.rotate()    // 90° clockwise
this.croppa.rotate(-1)  // 90° counter-clockwise
this.croppa.flipX()
this.croppa.flipY()
~~~

## Save and restore metadata

getMetadata() returns the current v1 transform state:

~~~js
const metadata = this.croppa.getMetadata()

// Later
this.croppa.applyMetadata(metadata)
~~~

The returned fields are startX, startY, scale, and orientation. They are v1 canvas-oriented metadata; if the viewport geometry changes, do not assume the same values represent a framework-independent crop rectangle.

<DemoFrame
  src="/demos/metadata.html"
  title="Metadata round-trip"
  description="Save a crop, modify it, and apply the stored metadata again."
  :height="500"
/>

## Passive previews {#passive-preview}

Two Croppa instances can share the same v-model object. Set passive on the second instance to make it a non-interactive synchronized preview.

<DemoFrame
  src="/demos/preview.html"
  title="Passive synchronized preview"
  description="The smaller cropper mirrors the editable cropper through the shared v-model object."
  :height="500"
/>

Passive mode is a v1 implementation detail based on shared component state. v2 is moving to an explicit serializable state model instead.
