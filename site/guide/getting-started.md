# Getting started

Vue Croppa v1 is a Vue 2 image cropper built around a simple interaction model: the crop viewport stays fixed while the image moves and zooms beneath it.

## Version status

The current published line, **v1.3.8**, targets Vue 2. The existing API remains documented here because it still has active users. The Vue 3 / TypeScript reboot is being developed as v2 and intentionally does not mutate v1 in place.

For new Vue 3 work, follow the v2 development in the repository rather than assuming v1 can be mounted directly in Vue 3.

## Install

~~~bash
npm install vue-croppa
~~~

Register the plugin once:

~~~js
import Vue from 'vue'
import Croppa from 'vue-croppa'
import 'vue-croppa/dist/vue-croppa.css'

Vue.use(Croppa)
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

This is a v1 architectural constraint, not a general image-cropping requirement. v2 is being redesigned so preview size and export size can be independent.

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
