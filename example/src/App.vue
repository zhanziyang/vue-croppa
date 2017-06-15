<template>
  <v-app>
    <h2>
      <span>Vue</span>
      <span>Croppa</span>
    </h2>
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
            <v-switch v-bind:label="`showRemoveButton: ${showRemoveButton.toString()}`"
                      v-model="showRemoveButton"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-switch v-bind:label="`reverseZoomingGesture: ${reverseZoomingGesture.toString()}`"
                      v-model="reverseZoomingGesture"></v-switch>
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
                :prevent-white-space="preventWhiteSpace"
                :show-remove-button="showRemoveButton"
                :reverse-zooming-gesture="reverseZoomingGesture"></croppa>
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
  </v-app>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        myCroppa: null,
        width: 400,
        height: 400,
        canvasColor: 'default',
        placeholder: 'Click To Upload',
        placeholderFontSize: 0,
        placeholderColor: 'default',
        quality: 2,
        zoomSpeed: 3,
        preventWhiteSpace: false,
        showRemoveButton: true,
        reverseZoomingGesture: false
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
          :prevent-white-space="${this.preventWhiteSpace}"
          :show-remove-button="${this.showRemoveButton}"
          :reverse-zooming-gesture="${this.reverseZoomingGesture}"></croppa>`
      },

      methodExample1 () {
        return `this.myCroppa.reset()`
      },

      methodExample2 () {
        return `alert(this.myCroppa.generateDataUrl())`
      }
    },

    updated () {
      // hljs.initHighlightingOnLoad()
    },

    methods: {
      onCroppaInit (myCroppa) {
        this.myCroppa = myCroppa
      },

      getDataUrl () {
        this.myCroppa && alert(this.myCroppa.generateDataUrl())
      },

      reset () {
        this.myCroppa && this.myCroppa.reset()
      }
    }
  }
</script>

<style lang="stylus">
  // /* latin-ext */
  // @font-face {
  //   font-family: 'Black Ops One';
  //   font-style: normal;
  //   font-weight: 400;
  //   src: local('Black Ops One'), local('BlackOpsOne-Regular'), url('assets/BlackOpsOne-Regular.ttf') format('ttf');
  //   unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
  // }
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
      font-family: 'Black Ops One', cursive
      span:first-child
        color: #41b883
      span:last-child
        color: #35495e
    code
      font-size: 14px
      font-family: Consolas, Monaco, monospace
</style>
