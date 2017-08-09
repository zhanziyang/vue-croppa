import VueRouter from 'vue-router'

import App from './App.vue'
// import Index from './pages/index.vue'
// import QuickStart from './pages/quick-start.vue'
// import Registration from './pages/registration.vue'
// import Customization from './pages/customization.vue'
// import Input from './pages/input.vue'
// import Output from './pages/output.vue'
// import Manipulation from './pages/manipulation.vue'
// import Help from './pages/help.vue'
// import Demos from './pages/demos.vue'

export default new VueRouter({
  base: '/vue-croppa/',
  routes: [
    {
      path: '/',
      component: App,
      children: [
        {
          path: '',
          component: resolve => {
            resolve(require('./pages/index.vue'))
          }
        },
        {
          path: 'quick-start',
          component: resolve => {
            resolve(require('./pages/quick-start.vue'))
          }
        },
        {
          path: 'registration',
          component: resolve => {
            resolve(require('./pages/registration.vue'))
          }
        },
        {
          path: 'customization',
          component: resolve => {
            resolve(require('./pages/customization.vue'))
          }
        },
        {
          path: 'file-input',
          component: resolve => {
            resolve(require('./pages/input.vue'))
          }
        },
        {
          path: 'manipulation',
          component: resolve => {
            resolve(require('./pages/manipulation.vue'))
          }
        },
        {
          path: 'file-output',
          component: resolve => {
            resolve(require('./pages/output.vue'))
          }
        },
        {
          path: 'help',
          component: resolve => {
            resolve(require('./pages/help.vue'))
          }
        },
        {
          path: 'demos',
          component: resolve => {
            resolve(require('./pages/demos.vue'))
          }
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})