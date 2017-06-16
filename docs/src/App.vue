<template>
  <v-app>
    <h2>
      <span class="header">Vue</span>
      <span class="header">Croppa</span>
      <span class="subheader">A simple straightforward customizable image cropper for vue.js.</span>
    </h2>
    <v-divider></v-divider>
    <br>
    <v-layout row
              wrap>
      <v-flex xs6>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-slider v-model="width"
                      label="width"
                      :max="500"
                      :min="100"></v-slider>
          </v-flex>
          <v-flex xs2>
            <v-text-field v-model="width"
                          readonly
                          type="number"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-slider v-model="height"
                      label="height"
                      :max="500"
                      :min="100"></v-slider>
          </v-flex>
          <v-flex xs2>
            <v-text-field v-model="height"
                          readonly
                          type="number"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-select v-bind:items="['default', 'black', 'grey', '#00bcd4', 'rgb(205, 220, 57)']"
                      v-model="canvasColor"
                      label="canvasColor"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-text-field name="placeholder"
                          label="placeholder"
                          v-model="placeholder"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-text-field name="placeholderFontSize"
                          label="placeholderFontSize (px)"
                          type="number"
                          v-model="placeholderFontSize"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-select v-bind:items="['default', 'white', 'grey', '#ffc107', 'rgb(0, 150, 136)']"
                      v-model="placeholderColor"
                      label="placeholderColor"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-text-field name="inputAccept"
                          label="inputAccept"
                          v-model="inputAccept"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-text-field name="fileSizeLimit"
                          label="fileSizeLimit (byte)"
                          type="number"
                          v-model="fileSizeLimit"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-slider v-model="quality"
                      label="quality"
                      :max="5"
                      :min="1"
                      :step="1"></v-slider>
          </v-flex>
          <v-flex xs2>
            <v-text-field v-model="quality"
                          readonly></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-slider v-model="zoomSpeed"
                      label="zoomSpeed"
                      :max="10"
                      :min="1"
                      :step="1"></v-slider>
          </v-flex>
          <v-flex xs2>
            <v-text-field v-model="zoomSpeed"
                          readonly></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-switch v-bind:label="`preventWhiteSpace: ${preventWhiteSpace.toString()}`"
                      v-model="preventWhiteSpace"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-switch v-bind:label="`reverseZoomingGesture: ${reverseZoomingGesture.toString()}`"
                      v-model="reverseZoomingGesture"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-switch v-bind:label="`disabled: ${disabled.toString()}`"
                      v-model="disabled"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-switch v-bind:label="`showRemoveButton: ${showRemoveButton.toString()}`"
                      v-model="showRemoveButton"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-select v-bind:items="['red', 'black', 'purple', '#ffc107', 'rgb(0, 150, 136)']"
                      v-model="removeButtonColor"
                      label="removeButtonColor"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-text-field name="removeButtonSize"
                          label="removeButtonSize (px)"
                          type="number"
                          v-model="removeButtonSize"></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
  
      <v-flex xs6>
        <croppa v-model="myCroppa"
                :width="width"
                :height="height"
                :canvas-color="canvasColor"
                :placeholder="placeholder"
                :placeholder-font-size="placeholderFontSize"
                :placeholder-color="placeholderColor"
                :quality="quality"
                :zoom-speed="zoomSpeed"
                :input-accept="inputAccept"
                :file-size-limit="fileSizeLimit"
                :prevent-white-space="preventWhiteSpace"
                :reverse-zooming-gesture="reverseZoomingGesture"
                :disabled="disabled"
                :show-remove-button="showRemoveButton"
                :remove-button-color="removeButtonColor"
                :remove-button-size="removeButtonSize"
                @init="handleCroppaInit"
                @file-choose="handleCroppaFileChoose"
                @file-size-exceed="handleCroppaFileSizeExceed"
                @move="handleCroppaMove"
                @zoom="handleCroppaZoom"></croppa>
        <br>
        <br>
        <h5>Template Example</h5>
        <pre v-highlightjs="code"><code class="html"></code></pre>
        <br>
        <v-divider></v-divider>
        <br>
        <h5>Method Example</h5>
        <v-layout row
                  wrap>
          <v-flex xs12>
            <pre v-highlightjs="methodExample1"><code class="js"></code></pre>
            <v-btn dark
                   default
                   @click.native="reset">Reset</v-btn>
          </v-flex>
        </v-layout>
        <br>
        <v-layout row
                  wrap>
          <v-flex xs12>
            <pre v-highlightjs="methodExample2"><code class="js"></code></pre>
            <v-btn dark
                   default
                   @click.native="getDataUrl">Data Url</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <br>
    <v-divider></v-divider>
    <br>
    <v-layout row
              wrap>
      <v-flex xs8
              offset-xs2>
        <h4>Quick Start</h4>
        <p>1. Install with npm or include it directly.</p>
        <v-layout row
                  wrap>
          <v-flex xs5>
            <pre v-highlightjs="'npm install --save vue-croppa'"><code class="bash"></code></pre>
          </v-flex>
          <v-flex xs1
                  class="text-xs-center">
            <h5>or</h5>
          </v-flex>
          <v-flex xs6>
            <pre v-highlightjs="installTags"><code class="html"></code></pre>
          </v-flex>
        </v-layout>
        <br>
        <p>2. If your build tool supports css module, import it as left below. Or simply include the file in your HTML.</p>
        <v-layout row
                  wrap>
          <v-flex xs5>
            <pre v-highlightjs="'import \'vue-croppa/dist/vue-croppa.css\''"><code class="javascript"></code></pre>
          </v-flex>
          <v-flex xs1
                  class="text-xs-center">
            <h5>or</h5>
          </v-flex>
          <v-flex xs6>
            <pre v-highlightjs="installStyle"><code class="html"></code></pre>
          </v-flex>
        </v-layout>
        <br>
        <p>3. Register it as a vue plugin.</p>
        <v-layout row
                  wrap>
          <v-flex xs12>
            <pre v-highlightjs="vueRegistry"><code class="javascript"></code></pre>
          </v-flex>
        </v-layout>
        <br>
        <p>4. Now you have it. The simplest usage: </p>
        <v-layout row
                  wrap>
          <v-flex xs12>
            <pre v-highlightjs="simplestUsage"><code class="html"></code></pre>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
  /* eslint no-useless-escape: 'off' */
  export default {
    name: 'app',
    data () {
      return {
        myCroppa: null,
        width: 400,
        height: 400,
        canvasColor: 'default',
        placeholder: 'Choose File',
        placeholderFontSize: 0,
        placeholderColor: 'default',
        quality: 2,
        zoomSpeed: 3,
        inputAccept: 'image/*',
        fileSizeLimit: 0,
        disabled: false,
        preventWhiteSpace: false,
        reverseZoomingGesture: false,
        showRemoveButton: true,
        removeButtonColor: 'red',
        removeButtonSize: 0
      }
    },

    computed: {
      code () {
        return `\
  <croppa v-model="myCroppa"
          :width="${this.width}"
          :height="${this.height}"
          :canvas-color="${this.canvasColor}"
          :placeholder="${this.placeholder}"
          :placeholder-font-size="${this.placeholderFontSize}"
          :placeholder-color="${this.placeholderColor}"
          :quality="${this.quality}"
          :zoom-speed="${this.zoomSpeed}"
          :input-accept="${this.inputAccept}"
          :file-size-limit="${this.fileSizeLimit}"
          :prevent-white-space="${this.preventWhiteSpace}"
          :reverse-zooming-gesture="${this.reverseZoomingGesture}"
          :disabled="${this.disabled}"
          :show-remove-button="${this.showRemoveButton}"
          :remove-button-color="${this.removeButtonColor}"
          :remove-button-size="${this.removeButtonSize}"
          @init="handleCroppaInit"
          @file-choose="handleCroppaFileChoose"
          @file-size-exceed="handleCroppaFileSizeExceed"
          @move="handleCroppaMove"
          @zoom="handleCroppaZoom"></croppa>`
      },

      methodExample1 () {
        return `this.myCroppa.reset()`
      },

      methodExample2 () {
        return `alert(this.myCroppa.generateDataUrl())`
      },

      installStyle () {
        return '<link href="https://unpkg.com/vue-croppa/dist/vue-croppa.css" rel="stylesheet" type="text/css">'
      },

      installTags () {
        return `\
  <script src="https://unpkg.com/vue-croppa/dist/vue-croppa.js"><\/script>\
        `
      },

      vueRegistry () {
        return `import Vue from 'vue'
  import Croppa from 'vue-croppa'

  Vue.use(Croppa)\
        `
      },

      simplestUsage () {
        return `\
  <croppa v-model="myCroppa"></croppa>`
      }
    },

    updated () {
      // hljs.initHighlightingOnLoad()
    },

    methods: {
      getDataUrl () {
        this.myCroppa && alert(this.myCroppa.generateDataUrl())
      },

      reset () {
        this.myCroppa && this.myCroppa.reset()
      },

      handleCroppaInit () {
        console.log('init')
      },

      handleCroppaFileChoose (file) {
        console.log('file chose')
        console.log(file)
      },

      handleCroppaFileSizeExceed (file) {
        console.log('file size exceeded')
        console.log(file)
      },

      handleCroppaMove () {
        console.log('moved')
      },

      handleCroppaZoom () {
        console.log('zoomed')
      }
    }
  }
</script>

<style lang="stylus">
  /* latin */
  @font-face {
    font-family: 'Black Ops One';
    font-style: normal;
    font-weight: 400;
    src: local('Black Ops One'), local('BlackOpsOne-Regular'), url(https://fonts.gstatic.com/s/blackopsone/v7/2XW-DmDsGbDLE372KrMW1TxObtw73-qQgbr7Be51v5c.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
  }
  #app
    padding: 16px
    h2
      span.header
        font-family: 'Black Ops One', cursive
      span.header:first-child
        color: #41b883
      span.header:nth-child(2)
        color: #35495e
    .subheader
      // font-family: 
      padding: 0
      font-size: 22px
    code
      font-size: 14px
      font-family: Consolas, Monaco, monospace
</style>
