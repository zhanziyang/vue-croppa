import VueRouter from 'vue-router'

import App from './App.vue'
import Index from './pages/index.vue'
import QuickStart from './pages/quick-start.vue'
import Registration from './pages/registration.vue'

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
        }
      ]
    }
  ]
})