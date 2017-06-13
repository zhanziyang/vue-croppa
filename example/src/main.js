import Vue from 'vue'
import App from './App.vue'
import Croppa from './../croppa/vue-croppa'
import css from './../croppa/vue-croppa.css'

Vue.use(Croppa)

new Vue({
  el: '#app',
  render: h => h(App)
})
