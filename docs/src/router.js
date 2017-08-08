import VueRouter from 'vue-router'

import App from './App.vue'
import Index from './pages/index.vue'
import QuickStart from './pages/quick-start.vue'
import Registration from './pages/registration.vue'
import Customization from './pages/customization.vue'
import Input from './pages/input.vue'
import Output from './pages/output.vue'
import Manipulation from './pages/manipulation.vue'
import Help from './pages/help.vue'
import Demos from './pages/demos.vue'

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: App,
      children: [
        {
          path: '',
          component: Index
        },
        {
          path: 'quick-start',
          component: QuickStart
        },
        {
          path: 'registration',
          component: Registration
        },
        {
          path: 'customization',
          component: Customization
        },
        {
          path: 'file-input',
          component: Input
        },
        {
          path: 'manipulation',
          component: Manipulation
        },
        {
          path: 'file-output',
          component: Output
        },
        {
          path: 'help',
          component: Help
        },
        {
          path: 'demos',
          component: Demos
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})