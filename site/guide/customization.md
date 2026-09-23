# Customization

Vue Croppa v1 exposes two different kinds of customization:

1. **Canvas-affecting props** change the generated image.
2. **CSS** changes only the component's presentation in the page.

Keeping those separate avoids a common surprise: changing the component background with CSS does **not** change exported pixels.

## Appearance playground

<DemoFrame
  src="/demos/customization.html"
  title="Appearance and behavior"
  description="Change placeholder text/colors, canvas color, remove control, and disabled state."
  :height="560"
/>

### Canvas color

`canvas-color` is painted into the canvas, so it affects exported output.

~~~html
<croppa
  v-model="croppa"
  canvas-color="#ffffff"
></croppa>
~~~

For transparent output, keep `canvas-color="transparent"` and use CSS for the visual background.

### Placeholder

~~~html
<croppa
  v-model="croppa"
  placeholder="Drop a profile photo"
  placeholder-color="#0f766e"
  :placeholder-font-size="16"
></croppa>
~~~

An image can also be used as the placeholder:

<DemoFrame
  src="/demos/placeholder.html"
  title="Image placeholder"
  description="A first-party slot demo that renders the local logo into the empty canvas."
  :height="500"
/>

## Initial image layout

`initial-size` behaves similarly to CSS background sizing:

- `cover` fills the crop viewport.
- `contain` keeps the whole image visible.
- `natural` starts at the source image's natural size.

`prevent-white-space` forces cover-like behavior because the viewport may not expose empty canvas.

`initial-position` accepts `center`, edges such as `top left`, or percentage values such as `30% 40%`.

## Responsive / auto sizing

v1 can size itself from the rendered component instead of the numeric width/height props.

<DemoFrame
  src="/demos/responsive.html"
  title="Responsive auto-sizing"
  description="Resize the first-party container and inspect the real component dimensions."
  :height="570"
/>

~~~html
<croppa
  v-model="croppa"
  auto-sizing
  class="responsive-croppa"
></croppa>
~~~

In v1, auto-sizing reacts to the window resize event. v2 is being redesigned around `ResizeObserver` and independent preview/export dimensions.

## Zoom behavior

`zoom-speed` controls wheel sensitivity and `reverse-scroll-to-zoom` reverses the wheel direction.

For a custom control surface, you can drive the exposed v1 scale state directly:

<DemoFrame
  src="/demos/zoom-slider.html"
  title="Zoom slider"
  description="A local range control drives the same v1 scale used by wheel and pinch zoom."
  :height="530"
/>

Directly mutating internal state is a v1 escape hatch. Prefer documented methods for ordinary application code.

## Disable built-in interactions

Use `disabled` to disable everything, or disable specific behaviors:

~~~html
<croppa
  v-model="croppa"
  :disable-click-to-choose="true"
  :disable-drag-and-drop="true"
  :disable-drag-to-move="true"
  :disable-scroll-to-zoom="true"
  :disable-pinch-to-zoom="true"
  :disable-rotation="true"
></croppa>
~~~

This is useful when your own toolbar should be the only way to manipulate the crop.

## Custom loading

The built-in spinner is optional. For a fully custom loading state, listen to the lifecycle events.

<DemoFrame
  src="/demos/loading.html"
  title="Custom loading overlay"
  description="The UI is driven by loading-start and loading-end while Croppa handles the real file."
  :height="500"
/>

## Canvas attachments

The `draw` event runs after Croppa draws the image. Use it for watermarks, stickers, guides, or other output-visible canvas additions.

<DemoFrame
  src="/demos/attachment.html"
  title="Watermark / attachment"
  description="A local logo is drawn into the real crop canvas and included in export."
  :height="570"
/>

## Custom clipping

For rounded rectangles, `image-border-radius` is the simplest API. For arbitrary paths, use `addClipPlugin()`.

<DemoFrame
  src="/demos/clip-plugin.html"
  title="Circle clip plugin"
  description="The test suite verifies the top-left output pixel is actually transparent."
  :height="520"
/>
