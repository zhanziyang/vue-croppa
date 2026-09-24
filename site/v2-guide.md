# Vue 3 guide

vue-croppa v2 keeps the fixed WYSIWYG viewport: drag and zoom the image underneath it, then export exactly what you see. The Vue 2 API remains available on the 1.x release line.

## Install

```bash
npm install vue-croppa@2
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Croppa } from 'vue-croppa'
import 'vue-croppa/style.css'

const cropper = ref<InstanceType<typeof Croppa> | null>(null)

async function save() {
  const blob = await cropper.value?.promisedBlob('image/png')
  if (blob) {
    // Send the Blob to your upload endpoint.
  }
}
</script>

<template>
  <Croppa ref="cropper" :width="320" :height="240" initial-size="cover" />
  <button @click="save">Save crop</button>
</template>
```

The default export also registers `<croppa>` through `app.use(VueCroppa)`. Pass `{ componentName: 'my-croppa' }` to change the registration name.

## Interact and export

Choose or drop an image, drag to move it, use the wheel or pinch to zoom, and call `rotate()`, `flipX()`, or `flipY()` from a component ref. `preventWhiteSpace` keeps the source inside the viewport; the default allows a transparent or `canvasColor` background to show. `quality` controls the backing canvas and Blob dimensions, without changing the CSS viewport size. PNG and WebP exports keep transparency; JPEG cannot, so set `canvasColor` when exporting a transparent image as JPEG.

Use `getCanvas()` or `getContext()` to work with the same canvas returned by `generateDataUrl()`, `generateBlob()`, and `promisedBlob()`. `addClipPlugin()` adds a clipping path, and the `draw` event receives the 2D context after each frame. The preview and export share these pixels.

## Save state and show a passive preview

`getMetadata()` returns serializable v2 crop state. `applyMetadata()` restores it for the same source dimensions and viewport aspect ratio. It also accepts 1.x `{ startX, startY, scale, orientation }` metadata when the original `quality` value is retained.

For a live preview, bind both components to one in-memory model:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { CroppaModelValue } from 'vue-croppa'

const crop = ref<CroppaModelValue | null>(null)
</script>

<template>
  <croppa v-model="crop" :width="320" :height="240" />
  <croppa v-model="crop" passive :width="160" :height="120" />
</template>
```

`v-model` contains the live image or video element; use metadata for JSON storage. See the [migration guide](https://github.com/zhanziyang/vue-croppa/blob/master/v2/MIGRATION.md) when upgrading a Vue 2 application.

## More options

`autoSizing` follows the containing element through `ResizeObserver`. Set an explicit width and height on that container. `imageBorderRadius` rounds the output; `addClipPlugin()` supports custom paths. `videoEnabled` accepts browser-playable video files; double click the canvas to play or pause. The optional loading indicator is controlled by `showLoading`, `loadingSize`, and `loadingColor`.

Try these capabilities in the [real component preview](/v2-lab), then consult the [v2 API reference](/v2-api).
