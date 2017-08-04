<template>
  <div id="registration">
    <v-layout row
              wrap>
      <v-flex>
        <v-expansion-panel>
          <v-expansion-panel-content v-for="(item,i) in contents"
                                     :key="i"
                                     :expand="item.expand">
            <div slot="header">{{item.title}}</div>
            <v-card>
              <v-card-text class="grey lighten-3">
                <pre v-highlightjs="item.code"><code class="javascript"></code></pre>
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
            code: `Vue.use(Croppa)`,
            expand: true
          }
        ]
      },
      installStyle () {
        return '<link href="https://unpkg.com/vue-croppa/dist/vue-croppa.min.css" rel="stylesheet" type="text/css">'
      },

      installTags () {
        return `\
 <script src="https://unpkg.com/vue-croppa/dist/vue-croppa.min.js"><\/script>\
        `
      },

      vueRegistryBuild () {
        return `import Vue from 'vue'
  import Croppa from 'vue-croppa'

  Vue.use(Croppa)\
        `
      },

      vueRegistryTag () {
        return `\
 <script>
    Vue.use(Croppa)
  <\/script>\
        `
      },

      simplestUsageTemplate () {
        return `\
 <croppa v-model="myCroppa"></croppa>`
      },

      simplestUsageScript () {
        return `\
 new Vue({
    // ... other vm options omitted
    data: {
      myCroppa: {}
    }
  })\
        `
      }
    }

  }
</script>


<style lang="stylus">
</style>
