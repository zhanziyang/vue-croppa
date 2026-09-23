import DefaultTheme from 'vitepress/theme'
import DemoFrame from '../../components/DemoFrame.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoFrame', DemoFrame)
  },
}
