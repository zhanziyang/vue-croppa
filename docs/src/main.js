import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './router'
// import Croppa from './croppa/vue-croppa'
import './croppa/vue-croppa.css'

import Vuetify from 'vuetify'
import hljs from 'vue-highlightjs'

Vue.use(VueRouter)
Vue.use(Vuetify)
Vue.component('croppa', resolve => {
  var Croppa = require('./croppa/vue-croppa')
  resolve(Croppa.component)
})
Vue.use(hljs)

new Vue({
  router
}).$mount('#app')
