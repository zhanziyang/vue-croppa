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

**v1.3.8 is the current published Vue 2 line.** It remains available for existing applications and is the version documented by the current site.

A Vue 3 + TypeScript **v2 reboot** is being developed separately. The new architecture does not mutate v1 in place, so existing consumers are not used as migration testers.

- Vue 2 / v1: current npm package
- Vue 3 / v2: [foundation work in progress](https://github.com/zhanziyang/vue-croppa/pull/251)

## Install

~~~bash
npm install vue-croppa
~~~

~~~js
import Vue from 'vue'
import Croppa from 'vue-croppa'
import 'vue-croppa/dist/vue-croppa.css'

Vue.use(Croppa)
~~~

## Basic usage

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

## What v1 supports

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

## Live, first-party demos

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

## Documentation

The full v1 reference is organized by task rather than duplicated into this README:

- [Getting started](https://zhanziyang.github.io/vue-croppa/guide/getting-started)
- [Input & loading](https://zhanziyang.github.io/vue-croppa/guide/input)
- [Manipulation & state](https://zhanziyang.github.io/vue-croppa/guide/manipulation)
- [Output & upload](https://zhanziyang.github.io/vue-croppa/guide/output)
- [Customization](https://zhanziyang.github.io/vue-croppa/guide/customization)
- [Troubleshooting](https://zhanziyang.github.io/vue-croppa/guide/troubleshooting)
- [Complete API reference](https://zhanziyang.github.io/vue-croppa/api/)

## A note about v1 sizing

In v1, the visible cropper dimensions and output resolution are coupled:

~~~text
output width  = width × quality
output height = height × quality
~~~

If you need a responsive preview with independently chosen export dimensions, that is one of the architectural problems being solved in v2.

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

The Vue 3 / TypeScript reboot is isolated under `v2/` while it is being designed and validated.

## License

[ISC](./LICENSE.md)
