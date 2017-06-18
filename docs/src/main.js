import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import Croppa from './../croppa/vue-croppa'
import './../croppa/vue-croppa.css'

import Vuetify from 'vuetify'
import hljs from 'vue-highlightjs'

Vue.use(Vuetify)
Vue.use(Croppa)
Vue.use(hljs)

new Vue({
  el: '#app',
  render: h => h(App)
})
