# Input and loading

Croppa can receive an image from the hidden file input, drag and drop, a programmatically supplied File, or an initial image URL / Image object.

## File chooser

Clicking an empty Croppa opens the native file chooser unless click-to-choose is disabled.

You can also trigger it explicitly:

~~~js
this.croppa.chooseFile()
~~~

<DemoFrame
  src="/demos/input.html"
  title="File input and drag & drop"
  description="Choose, replace, and remove a real local image while watching component events."
  :height="500"
/>

## File validation

Use accept for browser file filtering and file-size-limit for a byte limit:

~~~html
<croppa
  v-model="croppa"
  accept="image/jpeg,image/png"
  :file-size-limit="5000000"
  @file-type-mismatch="onTypeMismatch"
  @file-size-exceed="onTooLarge"
></croppa>
~~~

A zero file-size-limit means no size limit.

## Drag and drop

Drag and drop is enabled by default when the browser supports it.

Use replace-drop when dropping a new image should replace the current one immediately:

~~~html
<croppa v-model="croppa" replace-drop></croppa>
~~~

Disable drag and drop with disable-drag-and-drop.

## Programmatic files

The component includes setFile(file), which routes a File through the same loading and validation path as the native input.

~~~js
this.croppa.setFile(file)
~~~

## Initial images

Pass a URL or HTMLImageElement:

~~~html
<croppa
  v-model="croppa"
  :initial-image="imageUrl"
  initial-size="cover"
  initial-position="center"
></croppa>
~~~

initial-size supports cover, contain, and natural.

initial-position supports center, top, bottom, left, right, combinations such as top left, and percentage positions such as 30% 40%.

When you change an initial image after initialization, update the prop and call refresh().

## Loading events

Use loading-start and loading-end when the application needs its own loading UI. show-loading enables Croppa's built-in spinner.

The most useful image lifecycle events are:

1. file-choose
2. new-image
3. new-image-drawn

new-image-drawn is generally the safest point to enable export controls because the new image has been rendered to the canvas.
