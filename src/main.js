import { version } from '../package.json'
import cropper from './cropper.vue'

const VueCroppa = {
  install: function (Vue, options) {
    Vue.component('croppa', cropper)
  }
}

export default VueCroppa