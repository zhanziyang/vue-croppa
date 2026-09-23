# Migrating from vue-croppa 1.x

vue-croppa 2.x requires Vue 3. Existing 1.x applications can stay on `vue-croppa@1` while migrating.

## Install and register

```ts
import { createApp } from 'vue'
import VueCroppa from 'vue-croppa'
import 'vue-croppa/style.css'

createApp(App).use(VueCroppa).mount('#app')
```

The default registration name remains `croppa`. You can pass `{ componentName: 'my-croppa' }` to `app.use`, or import the named `Croppa` component locally.

## Shared preview state

Vue 3 `v-model` uses `modelValue` and `update:modelValue`. The value is an in-memory object containing the loaded image or video, crop state, and chosen file. It is intended for a synchronized preview, not for JSON persistence.

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

Use `getMetadata()` to persist the crop as JSON. `applyMetadata()` accepts versioned v2 metadata or a 1.x object with `startX`, `startY`, `scale`, and optional `orientation`. Apply it after loading the same source image, or before loading to queue it. For 1.x metadata, keep the original `quality` value while migrating: its pixel coordinates do not record that value. A v2 metadata object is accepted only for the same image dimensions and viewport aspect ratio.

## Output and extension hooks

The fixed viewport remains WYSIWYG. The visible canvas is the output canvas at `width × quality` by `height × quality`; `getCanvas()`, `getContext()`, data URL export, and Blob export use that same canvas. The `draw` event receives its 2D context after each image frame. `addClipPlugin()` receives the context and viewport dimensions in logical pixels, so its path scales with the output resolution.

The existing image, remove, sizing, whitespace, loading, interaction-disable, and export props remain available. `autoSizing` now observes the component's container with `ResizeObserver`. `videoEnabled` accepts browser-playable video files; double click the canvas to play or pause.
