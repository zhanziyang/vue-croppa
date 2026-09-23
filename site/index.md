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
      link: /guide/getting-started
    - theme: alt
      text: Live examples
      link: /examples/
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

## Try the real component

The examples in these docs are first-party HTML pages shipped with this repository. They run the same Vue 2 and vue-croppa v1 bundle that applications consume—no CodePen, screenshots, or mocked cropper.

<DemoFrame
  src="/demos/basic.html"
  title="Basic crop"
  description="Drag the image, zoom it, move it programmatically, and inspect the live metadata."
  :height="510"
/>

## Small API, useful escape hatches

For the common path, vue-croppa is a single component with a model binding. When you need more control, the model exposes methods for movement, zoom, rotation, output, metadata, and direct canvas access.

~~~html
<croppa
  v-model="croppa"
  :width="400"
  :height="300"
  prevent-white-space
></croppa>
~~~

~~~js
const blob = await this.croppa.promisedBlob('image/jpeg', 0.9)
~~~

<div class="docs-callout">

**Version status:** the current npm release is v1.3.8 for Vue 2. A Vue 3 / TypeScript v2 reboot is being developed separately so existing v1 applications are not broken.

</div>
