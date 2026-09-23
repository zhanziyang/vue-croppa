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

## Events

`init` supplies the component instance. `draw` supplies the output 2D context. Image lifecycle events are `file-choose`, `file-size-exceed`, `file-type-mismatch`, `new-image`, `new-image-drawn`, `initial-image-loaded`, `image-remove`, `loading-start`, `loading-end`, and `load-error`. `move` and `zoom` report interaction changes. `update:modelValue` powers Vue 3 `v-model`.
