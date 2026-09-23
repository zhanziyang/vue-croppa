# API reference

This page documents the current v1.3.8 Vue 2 API. The v2 API is being redesigned separately and should not be inferred from these internals.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| value | Object | — | v-model target; receives the Croppa instance |
| width | Number | 200 | Display width in v1 |
| height | Number | 200 | Display height in v1 |
| quality | Number | 2 | Backing canvas multiplier |
| placeholder | String | Choose an image | Empty-state text |
| placeholder-color | CSS color | #606060 | Placeholder text color |
| placeholder-font-size | Number | 0 | 0 means automatic sizing |
| canvas-color | CSS color | transparent | Canvas background / whitespace color |
| zoom-speed | Number | 3 | Wheel zoom sensitivity |
| accept | String | — | Passed to and validated like a file input accept value |
| file-size-limit | Number | 0 | Maximum file bytes; 0 disables the limit |
| disabled | Boolean | false | Disables user interaction |
| disable-drag-and-drop | Boolean | false | Disables dropping files |
| disable-click-to-choose | Boolean | false | Disables click/tap file selection |
| disable-drag-to-move | Boolean | false | Disables image panning |
| disable-scroll-to-zoom | Boolean | false | Disables wheel zoom |
| disable-pinch-to-zoom | Boolean | false | Disables touch pinch zoom |
| disable-rotation | Boolean | false | Disables rotate and flip methods |
| reverse-scroll-to-zoom | Boolean | false | Reverses wheel zoom direction |
| prevent-white-space | Boolean | false | Constrains image to keep the canvas covered |
| show-remove-button | Boolean | true | Shows the built-in remove control |
| remove-button-color | String | red | Built-in remove icon color |
| remove-button-size | Number | automatic | Remove control width / height |
| initial-image | String or Image | — | URL or HTMLImageElement |
| initial-size | cover, contain, natural | cover | Initial image fitting mode |
| initial-position | String | center | CSS-like initial alignment / percentages |
| input-attrs | Object | — | Extra attributes for the hidden file input |
| show-loading | Boolean | false | Shows the built-in loading spinner |
| loading-size | Number | 20 | Spinner size in px |
| loading-color | String | #606060 | Spinner color |
| replace-drop | Boolean | false | Allow a dropped file to replace the current image |
| passive | Boolean | false | Read-only synchronized preview mode |
| image-border-radius | Number or String | 0 | Clips rendered output when prevent-white-space is enabled |
| auto-sizing | Boolean | false | Size from the container instead of width / height props |
| video-enabled | Boolean | false | Experimental v1 video-frame support |

## Methods

### Image and input

| Method | Purpose |
| --- | --- |
| chooseFile() | Open the hidden file input |
| setFile(file) | Load a File programmatically |
| getChosenFile() | Return the currently chosen File |
| remove() | Remove the current image |
| refresh() | Reinitialize, including the current initial-image |
| hasImage() | Whether an image is currently set |

### Movement and transforms

| Method | Purpose |
| --- | --- |
| move({ x, y }) | Move by canvas pixels |
| moveUpwards(amount) | Move vertically up |
| moveDownwards(amount) | Move vertically down |
| moveLeftwards(amount) | Move horizontally left |
| moveRightwards(amount) | Move horizontally right |
| zoomIn() | Zoom in one step |
| zoomOut() | Zoom out one step |
| zoom(zoomIn, acceleration) | Lower-level zoom operation |
| rotate(step) | Rotate in 90° steps; negative values rotate the other direction |
| flipX() | Flip horizontally |
| flipY() | Flip vertically |

### Output and state

| Method | Purpose |
| --- | --- |
| generateDataUrl(type, quality) | Return canvas output as a data URL |
| generateBlob(callback, type, quality) | Generate a Blob with a callback |
| promisedBlob(type, quality) | Promise-based Blob output |
| getCanvas() | Return HTMLCanvasElement |
| getContext() | Return CanvasRenderingContext2D |
| getMetadata() | Return startX, startY, scale, orientation |
| applyMetadata(metadata) | Reapply v1 transform metadata |
| addClipPlugin(fn) | Add a canvas clip path callback |
| supportDetection() | Return basic browser / drag-and-drop support flags |

## Events

| Event | Payload / timing |
| --- | --- |
| init | Croppa instance after initialization |
| file-choose | Selected File |
| file-size-exceed | File that exceeded file-size-limit |
| file-type-mismatch | File that failed type validation |
| new-image | A valid new image was read |
| new-image-drawn | New image was drawn for the first time |
| image-remove | Current image was removed |
| move | Image position changed |
| zoom | Image scale changed |
| draw | CanvasRenderingContext2D after each image draw |
| initial-image-loaded | Initial image finished loading |
| loading-start | Image loading begins |
| loading-end | Image loading finishes |

## Slots

### initial

Provide an img element as the initial image. If both the slot and initial-image prop are provided, the slot takes precedence.

### placeholder

Provide an img element drawn behind the placeholder text while the cropper is empty.

### default

Default slot content is appended inside the cropper container and can be used for custom overlay controls. Positioned overlays should normally use absolute positioning.

## State access

v1 exposes internal component state through the model instance. Treat undocumented internal fields as unstable even if they are visible in Vue Devtools.

Prefer documented methods and metadata rather than mutating canvas, img, ctx, imgData, or other internal fields directly.

## Deprecated v1 API

reset() was replaced by remove(). getActualImageSize() was replaced by the outputWidth and outputHeight state values.

For new code, avoid adding dependencies on deprecated or undocumented v1 internals because the v2 state model is intentionally different.
