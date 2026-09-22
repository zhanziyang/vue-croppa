# vue-croppa v2

This directory is the isolated reboot of `vue-croppa` for Vue 3. The published `1.x` package and the repository's existing Vue 2 implementation remain untouched while v2 is developed.

## Product direction

v2 is intentionally focused on upload-oriented image cropping: load an image, position/zoom it inside a crop viewport, and export or persist the crop. It is not intended to become a general-purpose image editor.

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

`crop` is expressed against the currently oriented source image in normalized coordinates (`0..1`). This makes state stable across responsive layout changes and suitable for persistence or server-side reproduction.

## Current scope

This first foundation intentionally contains only the state/geometry engine, tests, and modern build/CI scaffolding. It does **not** expose the final Vue component yet. The next layer will add source decoding, the renderer/controller, Pointer Events, and the Vue component on top of this core.

## Commands

Requires Node.js 22.12 or newer.

```bash
npm install
npm run check
```
