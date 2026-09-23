---
layout: home

hero:
  name: Vue Croppa
  text: Image cropping that feels native to Vue.
  tagline: A small, touch-friendly cropper for profile photos, uploads, previews, and simple image workflows.
  image:
    src: /logo.svg
    alt: Vue Croppa
  actions:
    - theme: brand
      text: Get started
      link: /v2-guide
    - theme: alt
      text: Live Vue 3 preview
      link: /v2-lab
    - theme: alt
      text: GitHub
      link: https://github.com/zhanziyang/vue-croppa

features:
  - title: Direct manipulation
    details: Drag to reposition, scroll or pinch to zoom, rotate, flip, and constrain the image inside the crop.
  - title: Real canvas output
    details: Export a data URL or Blob, or access the canvas and drawing context directly.
  - title: Mobile friendly
    details: File input, drag and drop, mouse, touch, pinch, and responsive sizing are built into the component.
  - title: Persistable state
    details: Read and apply crop metadata to restore a user crop later or synchronize a passive preview.
---

## Try the real Vue 3 component

The [live preview](/v2-lab) mounts the Vue 3 component from this repository. Choose an image, drag and zoom it inside the fixed viewport, rotate or flip it, and export the visible pixels.

## Small API, useful escape hatches

Vue Croppa exposes movement, zoom, rotation, output, metadata, and direct canvas methods through a component ref.

~~~vue
<script setup>
import { ref } from 'vue'
import { Croppa } from 'vue-croppa'
import 'vue-croppa/style.css'

const cropper = ref(null)
async function save() {
  const blob = await cropper.value?.promisedBlob('image/jpeg', 0.9)
  // Upload or download blob here.
}
</script>

<template>
  <Croppa ref="cropper" :width="400" :height="300" prevent-white-space />
  <button @click="save">Save crop</button>
</template>
~~~

<div class="docs-callout">

**Versions:** Vue 3 uses the [v2 guide](/v2-guide). Vue 2 applications can keep `vue-croppa@1` and use the [v1 guide](/guide/getting-started), [v1 examples](/examples/), and [migration guide](https://github.com/zhanziyang/vue-croppa/blob/master/v2/MIGRATION.md).

</div>
