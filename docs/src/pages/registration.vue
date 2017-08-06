<template>
  <div id="registration">
    <v-layout row
              wrap>
      <v-flex>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="contents[0].expand">
            <div slot="header"
                 class="title">{{contents[0].title}}</div>
            <v-card>
              <v-card-text class="grey lighten-3">
                <pre v-highlightjs="contents[0].code"><code class="javascript"></code></pre>
              </v-card-text>
              <v-card-text class="grey lighten-3">
                <pre v-highlightjs="contents[0].code2"><code class="html"></code></pre>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="contents[1].expand">
            <div slot="header"
                 class="title">{{contents[1].title}}</div>
            <v-card>
              <v-card-text class="grey lighten-3">
                <pre v-highlightjs="contents[1].code"><code class="javascript"></code></pre>
              </v-card-text>
              <v-card-text class="grey lighten-3">
                <pre v-highlightjs="contents[1].code2"><code class="html"></code></pre>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="contents[2].expand">
            <div slot="header"
                 class="title">{{contents[2].title}}</div>
            <v-card>
              <v-card-text class="grey lighten-3">
                <pre v-highlightjs="contents[2].code"><code class="javascript"></code></pre>
              </v-card-text>
              <v-card-text class="grey lighten-3">
                <pre v-highlightjs="contents[2].code2"><code class="javascript"></code></pre>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        myCroppa: {}
      }
    },

    computed: {
      contents () {
        return [
          {
            title: 'Basic',
            code: `\
import Vue from 'vue'
 import Croppa from 'vue-croppa'

 Vue.use(Croppa)\
            `,
            code2: `\
<croppa></croppa>`,
            expand: true
          },
          {
            title: 'With custom component name (v0.1.0+)',
            code: `\
import Vue from 'vue'
 import Croppa from 'vue-croppa'

 Vue.use(Croppa, { componentName: 'my-image-cropper' })\
        `,
            code2: `\
<my-image-cropper></my-image-cropper>`,
            expand: true
          },
          {
            title: 'Manually register component by yourself (v0.1.1+)',
            code: `\
import Vue from 'vue'
 import Croppa from 'vue-croppa'

 Vue.component('croppa', Croppa.component)\
        `,
            code2: `\
// Register async component (Webpack 2 + ES2015 Example)
 Vue.component('croppa', () => import(Croppa.component))`,
            expand: true
          }
        ]
      }
    }

  }
</script>


<style lang="stylus">
</style>
