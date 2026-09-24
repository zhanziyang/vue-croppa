# Getting started

Vue Croppa v1 is a Vue 2 image cropper built around a simple interaction model: the crop viewport stays fixed while the image moves and zooms beneath it.

## Version status

This page documents the **v1.3.8** release line for Vue 2. Install it with `npm install vue-croppa@1`. For Vue 3, use the [v2 guide](/v2-guide) and [migration guide](https://github.com/zhanziyang/vue-croppa/blob/master/v2/MIGRATION.md).

The v1 component requires Vue 2; Vue 3 applications should install v2.

## Install

~~~bash
npm install vue-croppa@1
~~~

Register the plugin once:

~~~js
import Vue from 'vue'
import Croppa from 'vue-croppa'
import 'vue-croppa/dist/vue-croppa.css'

Vue.use(Croppa)
~~~

### Script tags / CDN

Pin the major version in CDN URLs. Unversioned URLs such as `https://unpkg.com/vue-croppa/dist/vue-croppa.min.css` now resolve to v2, which does not include these v1 files, so they return 404.

~~~html
<link rel="stylesheet" href="https://unpkg.com/vue-croppa@1/dist/vue-croppa.min.css">
<script src="https://unpkg.com/vue@2"></script>
<script src="https://unpkg.com/vue-croppa@1/dist/vue-croppa.min.js"></script>
<script>
  Vue.use(Croppa)
</script>
~~~

Then bind the component:

~~~html
<croppa v-model="croppa"></croppa>
~~~

The model receives the Croppa component instance after initialization. That instance contains the documented methods and state.

## A practical starting point

~~~html
<croppa
  v-model="croppa"
  :width="400"
  :height="300"
  :quality="2"
  accept="image/*"
  prevent-white-space
  replace-drop
  @new-image-drawn="onReady"
></croppa>
~~~

~~~js
export default {
  data() {
    return {
      croppa: null
    }
  },

  methods: {
    async upload() {
      const blob = await this.croppa.promisedBlob('image/jpeg', 0.9)
      // send blob to your upload endpoint
    }
  }
}
~~~

## Dimensions and quality

The v1 renderer couples the visible viewport and output resolution:

- width and height control the displayed cropper size.
- quality multiplies the backing canvas dimensions.
- a 400 × 300 cropper with quality 2 produces an 800 × 600 canvas.

In v2, `autoSizing` can follow a responsive container; `quality` still scales the backing canvas and export pixels.

## Live verification

<DemoFrame
  src="/demos/basic.html"
  title="Basic crop"
  description="Runs the repository's real v1 bundle and exposes the resulting metadata."
  :height="510"
/>

## Next

- [Input and loading](/guide/input)
- [Manipulation and state](/guide/manipulation)
- [Output and upload](/guide/output)
- [Complete API reference](/api/)
