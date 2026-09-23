import DefaultTheme from 'vitepress/theme'
import DemoFrame from '../../components/DemoFrame.vue'
import V2FoundationLab from '../../components/V2FoundationLab.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoFrame', DemoFrame)
    app.component('V2FoundationLab', V2FoundationLab)
  },
}
