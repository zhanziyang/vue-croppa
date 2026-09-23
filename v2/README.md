# vue-croppa v2

This directory is the isolated reboot of `vue-croppa` for Vue 3. The published `1.x` package and the repository's existing Vue 2 implementation remain untouched while v2 is developed.

## Product direction

v2 is intentionally focused on upload-oriented image cropping: load an image, position/zoom it inside a crop viewport, and export or persist the crop. It is not intended to become a general-purpose image editor.

## Interaction contract

The v2 rewrite preserves vue-croppa's defining WYSIWYG interaction model:

- The crop viewport is fixed and represents the exact output.
- The user moves and zooms the **image underneath the viewport**.
- There is no draggable or resizable crop-selection rectangle over the source image.
- Crop size/aspect is controlled by component configuration/layout, not by corner handles.
- Rotation and flips transform the image under the same fixed viewport.
- Exported pixels must match what is visible inside the viewport.
- `CropState.crop` is an internal source-relative representation of what the fixed viewport currently sees; it is not the UI interaction model.

This is a product-level invariant for v2, not a compatibility detail.

## Compatibility rule

v2 is a rewrite, not a feature reset. Existing v1 user capabilities are retained by default; any removal requires an explicit, separately reviewed decision.

The full inventory and migration requirements live in [COMPATIBILITY.md](./COMPATIBILITY.md).

In particular, v1 allows whitespace by default. Therefore `CropState` must be able to represent source-relative rectangles outside the `0..1` source bounds. `preventWhiteSpace` is an interaction constraint, not a fundamental limitation of the state model.

## Foundation principles

- Vue 3 + TypeScript.
- Pure geometry/state logic is framework-independent and testable without a browser.
- Crop state is serializable and independent of the rendered viewport size.
- Display size, canvas backing resolution, and export dimensions are separate concepts.
- Pointer Events, `ResizeObserver`, and modern browser APIs replace the legacy mouse/touch/polyfill stack.
- The original source image stays immutable; rotation and flips are transformations, not re-encoding steps.
- v1 compatibility is handled through migration guidance/adapters rather than preserving v1 internals.

## State model

The foundation uses a normalized crop rectangle plus image transforms:

```ts
interface CropState {
  crop: {
    x: number
    y: number
    width: number
    height: number
  }
  rotation: 0 | 90 | 180 | 270
  flipX: boolean
  flipY: boolean
}
```

`crop` is expressed against the currently oriented source image in normalized source units. The source itself occupies `0..1`, but the crop may use negative coordinates or dimensions greater than `1` when whitespace is visible. This preserves v1 behavior while keeping state stable across responsive layout changes and suitable for persistence or server-side reproduction.

## Current scope

This first foundation intentionally contains only the state/geometry engine, tests, and modern build/CI scaffolding. It does **not** expose the final Vue component yet. The next layer will add source decoding, the renderer/controller, Pointer Events, and the Vue component on top of this core.

## Commands

Requires Node.js 22.12 or newer.

```bash
npm install
npm run check
```
