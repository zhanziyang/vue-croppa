<p align="center">
  <img src="./site/public/logo.svg" width="88" height="88" alt="Vue Croppa logo">
</p>

<h1 align="center">Vue Croppa</h1>

<p align="center">
  A simple, customizable, mobile-friendly image cropper for Vue.
</p>

<p align="center">
  <a href="https://zhanziyang.github.io/vue-croppa/">Documentation</a>
  ·
  <a href="https://zhanziyang.github.io/vue-croppa/examples/">Live examples</a>
  ·
  <a href="https://github.com/zhanziyang/vue-croppa/issues">Issues</a>
</p>

## Version status

**v2 supports Vue 3.** Vue 2 applications can stay on `vue-croppa@1` (latest 1.x release: 1.3.8). See the [Vue 3 guide](https://zhanziyang.github.io/vue-croppa/v2-guide), [API](https://zhanziyang.github.io/vue-croppa/v2-api), and [migration guide](./v2/MIGRATION.md).

## Install for Vue 3

~~~bash
npm install vue-croppa@2
~~~

~~~vue
<script setup lang="ts">
import { ref } from 'vue'
import { Croppa } from 'vue-croppa'
import 'vue-croppa/style.css'

const cropper = ref<InstanceType<typeof Croppa> | null>(null)

async function save() {
  const blob = await cropper.value?.promisedBlob('image/png')
  // Upload or download the Blob.
}
</script>

<template>
  <Croppa ref="cropper" :width="320" :height="240" />
  <button @click="save">Save crop</button>
</template>
~~~

The [live Vue 3 preview](https://zhanziyang.github.io/vue-croppa/v2-lab) uses the real v2 component.

## Vue 2 / v1 archive

Install v1 explicitly:

~~~bash
npm install vue-croppa@1
~~~

~~~js
import Vue from 'vue'
import Croppa from 'vue-croppa'
import 'vue-croppa/dist/vue-croppa.css'

Vue.use(Croppa)
~~~

For script tags, pin v1 in CDN URLs: `https://unpkg.com/vue-croppa@1/dist/vue-croppa.min.js` and `https://unpkg.com/vue-croppa@1/dist/vue-croppa.min.css`. Unversioned `unpkg.com/vue-croppa/dist/...` URLs now resolve to v2 and return 404.

### Basic v1 usage

~~~html
<croppa
  v-model="croppa"
  :width="400"
  :height="300"
  prevent-white-space
></croppa>
~~~

~~~js
export default {
  data() {
    return {
      croppa: null,
    }
  },

  methods: {
    async getCroppedImage() {
      return this.croppa.promisedBlob('image/jpeg', 0.9)
    },
  },
}
~~~

For the smallest possible setup:

~~~html
<croppa v-model="croppa"></croppa>
~~~

The v1 model resolves to the Croppa component instance, which exposes movement, zoom, rotation, metadata, and output methods.

### What v1 supports

- Drag to reposition the image
- Wheel and pinch zoom
- Rotation and horizontal / vertical flip
- File chooser and drag & drop
- File type and file size validation
- Local-file EXIF orientation handling
- Initial images
- Blob and data URL output
- Canvas access and draw hooks
- Save / restore transform metadata
- Passive synchronized previews
- Responsive auto-sizing
- Rounded and custom clipped output

### Live v1 demos

The documentation examples are part of this repository—there are no CodePen embeds in the new docs.

The demo suite includes:

- [Basic crop](https://zhanziyang.github.io/vue-croppa/examples/#basic)
- [File input and drag/drop](https://zhanziyang.github.io/vue-croppa/examples/#file-input)
- [Move, zoom, rotate, and flip](https://zhanziyang.github.io/vue-croppa/examples/#manipulation)
- [Zoom slider](https://zhanziyang.github.io/vue-croppa/examples/#zoom-slider)
- [Responsive auto-sizing](https://zhanziyang.github.io/vue-croppa/examples/#responsive-auto-sizing)
- [Blob / data URL output](https://zhanziyang.github.io/vue-croppa/examples/#blob-and-data-url)
- [Upload and download recipes](https://zhanziyang.github.io/vue-croppa/examples/#prepare-an-upload)
- [Metadata persistence](https://zhanziyang.github.io/vue-croppa/examples/#metadata)
- [Passive preview](https://zhanziyang.github.io/vue-croppa/examples/#passive-preview)
- [Watermark / draw hook](https://zhanziyang.github.io/vue-croppa/examples/#attachments)
- [Rounded and custom clipping](https://zhanziyang.github.io/vue-croppa/examples/#rounded-output)
- [Custom loading](https://zhanziyang.github.io/vue-croppa/examples/#custom-loading)
- [Image placeholder](https://zhanziyang.github.io/vue-croppa/examples/#image-placeholder)
- [EXIF orientation hint](https://zhanziyang.github.io/vue-croppa/examples/#exif-orientation)

Those pages execute the actual repository bundle and are exercised in Chromium by Playwright. The original `docs/simple-test.html` harness is also adapted to deterministic local assets and kept as an additional compatibility check.

### v1 documentation

The full v1 reference is organized by task rather than duplicated into this README:

- [Getting started](https://zhanziyang.github.io/vue-croppa/guide/getting-started)
- [Input & loading](https://zhanziyang.github.io/vue-croppa/guide/input)
- [Manipulation & state](https://zhanziyang.github.io/vue-croppa/guide/manipulation)
- [Output & upload](https://zhanziyang.github.io/vue-croppa/guide/output)
- [Customization](https://zhanziyang.github.io/vue-croppa/guide/customization)
- [Troubleshooting](https://zhanziyang.github.io/vue-croppa/guide/troubleshooting)
- [Complete API reference](https://zhanziyang.github.io/vue-croppa/api/)

### A note about v1 sizing

In v1, the visible cropper dimensions and output resolution are coupled:

~~~text
output width  = width × quality
output height = height × quality
~~~

In v2, the visible canvas and export use the same pixels at `quality` scale. Use `autoSizing` to follow a responsive container.

## Development

### v1 component

~~~bash
npm install
npm run dev
~~~

The historical v1 docs/build files remain under `docs/` because they contain the current built bundle and broad `simple-test.html` compatibility harness.

### Modern docs

~~~bash
cd site
npm install
npm run dev
~~~

Run the first-party browser verification:

~~~bash
cd site
npm run test:e2e
~~~

The docs build copies the local Vue 2 + vue-croppa bundle, adapts `docs/simple-test.html` to local deterministic assets, builds VitePress, and runs the demo suite in Chromium.

### v2

The Vue 3 / TypeScript package source is under `v2/`. Run `npm run check` there for typecheck, unit tests, and a library build.

## License

[ISC](./LICENSE.md)
