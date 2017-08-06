import VueRouter from 'vue-router'

import App from './App.vue'
import Index from './pages/index.vue'
import QuickStart from './pages/quick-start.vue'
import Registration from './pages/registration.vue'
import Customization from './pages/customization.vue'
import Manipulation from './pages/manipulation.vue'
import Events from './pages/events.vue'
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
          path: 'manipulation',
          component: Manipulation
        },
        {
          path: 'events',
          component: Events
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
  ]
})