import cropper from './cropper.vue'

const VueCroppa = {
  install: function (Vue, options) {
    options = options || {}
    let version = Number(Vue.version.split('.')[0])
    if (version < 2) {
      throw new Error(`vue-croppa supports vue version 2.0 and above. You are using Vue@${version}. Please upgrade to the latest version of Vue.`)
    }
    let componentName = options.componentName || 'croppa'
    Vue.component(componentName, cropper)
  }
}

export default VueCroppa