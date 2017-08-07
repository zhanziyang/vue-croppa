<template>
  <div id="quick-start">
    <v-layout row
              wrap>
      <v-flex>
        <p>1. Install with npm or include it directly.</p>
        <v-layout row
                  wrap>
          <v-flex md5>
            <pre v-highlightjs="'npm install --save vue-croppa'"><code class="bash"></code></pre>
          </v-flex>
          <v-flex md1
                  xs12
                  class="text-md-center">
            <h5>or</h5>
          </v-flex>
          <v-flex md6
                  xs12>
            <pre v-highlightjs="installTags"><code class="html"></code></pre>
          </v-flex>
        </v-layout>
        <br>
        <p>2. If your build tool supports css module, import it as left below. Or simply include the file in your HTML.</p>
        <v-layout row
                  wrap>
          <v-flex md5>
            <pre v-highlightjs="'import \'vue-croppa/dist/vue-croppa.css\''"><code class="javascript"></code></pre>
          </v-flex>
          <v-flex md1
                  xs12
                  class="text-md-center">
            <h5>or</h5>
          </v-flex>
          <v-flex md6
                  xs12>
            <pre v-highlightjs="installStyle"><code class="html"></code></pre>
          </v-flex>
        </v-layout>
        <br>
        <p>3. Register it as a vue plugin.
          <router-link to="/registration">More ways to register it.</router-link>
        </p>
        <v-layout row
                  wrap>
          <v-flex md5>
            <pre v-highlightjs="vueRegistryBuild"><code class="javascript"></code></pre>
          </v-flex>
          <v-flex md1
                  xs12
                  class="text-md-center">
            <h5>or</h5>
          </v-flex>
          <v-flex md6
                  xs12>
            <pre v-highlightjs="vueRegistryTag"><code class="html"></code></pre>
          </v-flex>
        </v-layout>
        <br>
        <p>4. Now you have it. The simplest usage: </p>
        <v-layout row
                  wrap>
          <v-flex md12>
            <pre v-highlightjs="simplestUsageTemplate"><code class="html"></code></pre>
          </v-flex>
          <br>
          <br>
          <v-flex md12>
            <pre v-highlightjs="simplestUsageScript"><code class="javascript"></code></pre>
          </v-flex>
        </v-layout>
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
    },

    methods: {
      uploadCroppedImage() {
        this.myCroppa.generateBlob((blob) => {
          // write code to upload the cropped image file (a file is a blob)
        }, 'image/jpeg', 0.8) // 80% compressed jpeg file
      }
    }
  })\
        `
      }
    }

  }
</script>


<style lang="stylus">
</style>
