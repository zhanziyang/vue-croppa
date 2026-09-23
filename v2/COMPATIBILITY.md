# v1 → v2 compatibility contract

v2 is a rewrite of vue-croppa, not a different cropper product.

The default rule is: **a user-visible v1 capability stays available in v2 unless its removal is explicitly reviewed and documented.** Internal implementation and API shape may be modernized for Vue 3, but capability loss is not an acceptable side effect of the rewrite.

No item below is approved for removal.

## Interaction invariants

| Capability | v2 requirement |
| --- | --- |
| Fixed WYSIWYG crop viewport | KEEP |
| Move image underneath viewport | KEEP |
| Wheel / scroll zoom | KEEP |
| Pinch zoom | KEEP |
| Optional whitespace | KEEP — v1 default is allowed |
| `preventWhiteSpace` behavior | KEEP |
| Rotation and flips | KEEP |
| Exact viewport → export correspondence | KEEP |

## Props / configuration

| v1 surface | v2 requirement |
| --- | --- |
| `value` | MODERNIZE to Vue 3 controlled state / `v-model`, with migration path |
| `width`, `height` | KEEP |
| `placeholder`, `placeholderColor`, `placeholderFontSize` | KEEP |
| `canvasColor` | KEEP |
| `quality` | KEEP capability; API may become explicit output scale |
| `zoomSpeed` | KEEP |
| `accept`, `fileSizeLimit` | KEEP |
| `disabled` | KEEP |
| `disableDragAndDrop` | KEEP |
| `disableClickToChoose` | KEEP |
| `disableDragToMove` | KEEP |
| `disableScrollToZoom` | KEEP |
| `disablePinchToZoom` | KEEP |
| `disableRotation` | KEEP |
| `reverseScrollToZoom` | KEEP |
| `preventWhiteSpace` | KEEP; default remains false |
| `showRemoveButton` | KEEP |
| `removeButtonColor`, `removeButtonSize` | KEEP |
| `initialImage` | KEEP |
| `initialSize: cover / contain / natural` | KEEP |
| `initialPosition` keywords / percentages | KEEP |
| `inputAttrs` | KEEP |
| `showLoading`, `loadingSize`, `loadingColor` | KEEP |
| `replaceDrop` | KEEP |
| `passive` | KEEP capability; implementation may use controlled/read-only state |
| `imageBorderRadius` | KEEP |
| `autoSizing` | KEEP capability; implement with `ResizeObserver` |
| `videoEnabled` | KEEP unless separately reviewed |

## Imperative methods / capabilities

| v1 surface | v2 requirement |
| --- | --- |
| `chooseFile()`, `setFile()` | KEEP |
| `remove()` | KEEP |
| `hasImage()` | KEEP |
| `move()` and directional helpers | KEEP |
| `zoom()`, `zoomIn()`, `zoomOut()` | KEEP |
| `rotate()`, `flipX()`, `flipY()` | KEEP |
| `refresh()` | KEEP capability if still needed with `ResizeObserver` |
| `getChosenFile()` | KEEP |
| `getMetadata()`, `applyMetadata()` | KEEP, with v2 state migration format |
| `generateDataUrl()` | KEEP |
| `generateBlob()`, `promisedBlob()` | KEEP capability; Promise-first API is allowed |
| `getCanvas()`, `getContext()` | KEEP low-level escape hatch or documented equivalent |
| `addClipPlugin()` | KEEP extensibility capability |
| support detection | MODERNIZE for modern browser baseline |

## Events

The semantic events remain part of the migration target:

- `init`
- `file-choose`
- `file-size-exceed`
- `file-type-mismatch`
- `new-image`
- `new-image-drawn`
- `image-remove`
- `move`
- `zoom`
- `draw`
- `initial-image-loaded`
- `loading-start`
- `loading-end`

Names may receive typed Vue 3 aliases, but equivalent observable lifecycle points must remain available.

## Foundation merge gates

Before the v2 foundation is merged:

1. Crop state must represent both fully-covered and whitespace-visible viewport states.
2. `preventWhiteSpace` must be an operation policy, not hard-coded into the state model.
3. `cover`, `contain`, `natural`, and v1 initial-position semantics must be representable.
4. Rotation, flip, move, zoom, persistence, and pixel mapping must not destroy out-of-bounds state.
5. No documentation or demo may describe the foundation lab as a feature-complete v2 component.

Before v2 is released, every KEEP / MODERNIZE item above needs an implementation test or an explicit migration test.
