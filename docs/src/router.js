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
  base: '/vue-croppa',
  routes: [
    {
      path: '/',
      component: App,
      children: [
        {
          path: '',
          component: resolve => {
            require(['./pages/index.vue'], resolve)
          }
        },
        {
          path: 'quick-start',
          component: resolve => {
            require(['./pages/quick-start.vue'], resolve)
          }
        },
        {
          path: 'registration',
          component: resolve => {
            require(['./pages/registration.vue'], resolve)
          }
        },
        {
          path: 'customization',
          component: resolve => {
            require(['./pages/customization.vue'], resolve)
          }
        },
        {
          path: 'file-input',
          component: resolve => {
            require(['./pages/input.vue'], resolve)
          }
        },
        {
          path: 'manipulation',
          component: resolve => {
            require(['./pages/manipulation.vue'], resolve)
          }
        },
        {
          path: 'file-output',
          component: resolve => {
            require(['./pages/output.vue'], resolve)
          }
        },
        {
          path: 'help',
          component: resolve => {
            require(['./pages/help.vue'], resolve)
          }
        },
        {
          path: 'demos',
          component: resolve => {
            require(['./pages/demos.vue'], resolve)
          }
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})