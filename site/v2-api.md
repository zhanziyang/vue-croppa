# Vue 3 API

The v2 component is available as a named `Croppa` export or through the default Vue plugin. Import `vue-croppa/style.css` with either form.

## Props

| Prop | Default | Purpose |
| --- | --- | --- |
| `width`, `height` | `200` | Fixed viewport size in CSS pixels |
| `autoSizing` | `false` | Follow the containing element with `ResizeObserver` |
| `initialImage` | — | URL or loaded `HTMLImageElement` |
| `initialSize` | `cover` | `cover`, `contain`, or `natural` |
| `initialPosition` | `center` | Keywords or `x% y%` |
| `placeholder`, `placeholderColor`, `placeholderFontSize` | `Choose an image`, `#606060`, `0` | Empty-state appearance; the `placeholder` slot accepts custom content |
| `canvasColor` | `transparent` | Output background |
| `preventWhiteSpace` | `false` | Keep the source covering the viewport |
| `imageBorderRadius` | `0` | Rounded output corners in viewport pixels |
| `quality` | `2` | Backing canvas and output scale |
| `zoomSpeed` | `3` | Wheel and helper zoom speed |
| `minZoom`, `maxZoom` | `0.1`, `10` | Zoom bounds, relative to the size at which the image just covers the viewport |
| `accept`, `fileSizeLimit` | —, `0` | File type filter and byte limit |
| `replaceDrop` | `false` | Allow a dropped file to replace an existing image |
| `showRemoveButton`, `removeButtonColor`, `removeButtonSize` | `true`, `red`, width/10 | Remove control |
| `showLoading`, `loadingSize`, `loadingColor` | `false`, `20`, `#606060` | Loading indicator |
| `disabled` | `false` | Disable user interactions |
| `disableDragAndDrop`, `disableClickToChoose`, `disableDragToMove` | `false` | Individual interaction gates |
| `disableScrollToZoom`, `disablePinchToZoom`, `disableRotation` | `false` | Individual interaction gates |
| `reverseScrollToZoom` | `false` | Invert wheel direction |
| `passive` | `false` | Read-only synchronized preview |
| `videoEnabled` | `false` | Accept browser-playable videos |
| `inputAttrs` | — | Attributes for the underlying file input |
| `modelValue` | — | In-memory Vue 3 `v-model` state |

Zoom level 1 means the image just covers the viewport; 2 shows half as much of it, 0.5 twice as much. Wheel, pinch, and `zoom()` steps stop at `minZoom` and `maxZoom`. Bounds are clamped to `1e-4`–`1e4`. A state already outside the range, from `initialSize="natural"`, rotation, or `applyMetadata()`, is kept as-is and can only be zoomed back toward the range. `getZoomLevel(crop, orientedSource, viewport)` returns the current level, for example to drive a zoom slider.

The `initial` slot accepts an image, including an optional `data-exif-orientation` hint. File input JPEGs use their EXIF orientation once in modern browsers.

## Methods

| Method | Result |
| --- | --- |
| `chooseFile()`, `setFile(file)`, `remove()`, `refresh()` | Input and lifecycle |
| `hasImage()`, `getChosenFile()` | Current media status |
| `move({x,y})`, `moveUpwards(n)`, `moveDownwards(n)`, `moveLeftwards(n)`, `moveRightwards(n)` | Move the image by viewport pixels |
| `zoom(inward, acceleration)`, `zoomIn()`, `zoomOut()` | Zoom around the viewport center |
| `rotate(step)`, `flipX()`, `flipY()` | Transform the image |
| `getCropState()`, `getMetadata()`, `applyMetadata(metadata)` | Read or restore crop state |
| `getCanvas()`, `getContext()`, `redraw()` | Access and refresh output pixels |
| `addClipPlugin(fn)` | Add an output clipping path |
| `generateDataUrl(type, quality)`, `generateBlob(callback, type, quality)`, `promisedBlob(type, quality)` | Export the crop |
| `supportDetection()` | Browser capability flags |

`addClipPlugin()` receives `(context, x, y, width, height)` in logical viewport coordinates. `applyMetadata()` accepts versioned v2 state or 1.x pixel metadata. `getCanvas()` is the visible output canvas; its backing size includes `quality`.

## Export formats and transparency

The export methods pass `type` and `quality` to the browser's `toDataURL()` and `toBlob()`. That `quality` argument is the JPEG/WebP encoder quality from 0 to 1. The `quality` prop is different: it scales the backing canvas, so it sets the pixel size of the output.

With the default `canvasColor="transparent"`, areas the image does not cover and transparent pixels in the source stay transparent in `image/png` and `image/webp` output. JPEG has no alpha channel, so browsers encode transparent pixels as black. Set `canvasColor`, for example `canvas-color="#fff"`, when you need JPEG output of a transparent image.

## Render saved metadata outside the component

`renderCrop(canvas, image, source, state, background?, options?)` is the renderer the component uses. Call it to redraw a crop saved with `getMetadata()` without mounting `<Croppa>`, for example to regenerate an export at a different resolution:

```ts
import { renderCrop, type CropMetadata } from 'vue-croppa'

async function renderSavedCrop(file: Blob, metadata: CropMetadata, scale = 2): Promise<Blob | null> {
  const image = new Image()
  image.src = URL.createObjectURL(file)
  try {
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(metadata.viewport.width * scale)
    canvas.height = Math.round(metadata.viewport.height * scale)
    renderCrop(canvas, image, metadata.source, metadata.state, 'transparent', {
      viewport: metadata.viewport,
      borderRadius: 0,
    })
    return await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  } finally {
    URL.revokeObjectURL(image.src)
  }
}
```

- The canvas size sets the output resolution. Keep the aspect ratio of `metadata.viewport`.
- Pass the same image, decoded by a browser. `metadata.source` must match its `naturalWidth` and `naturalHeight`, and EXIF orientation must be applied the same way the component applied it.
- Pass the `canvasColor` and `imageBorderRadius` values the component used as `background` and `options.borderRadius` to reproduce its output. Clip plugins can be passed as `options.clipPlugins`.
- `renderCrop()` accepts v2 metadata only. Load 1.x `{ startX, startY, scale, orientation }` metadata with `applyMetadata()` first, then read `getMetadata()`.

## Events

`init` supplies the component instance. `draw` supplies the output 2D context. Image lifecycle events are `file-choose`, `file-size-exceed`, `file-type-mismatch`, `new-image`, `new-image-drawn`, `initial-image-loaded`, `image-remove`, `loading-start`, `loading-end`, and `load-error`. `move` and `zoom` report interaction changes. `update:modelValue` powers Vue 3 `v-model`.
