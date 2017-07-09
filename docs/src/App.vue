<template>
  <v-app>
    <h2>
      <span class="header">Vue</span>
      <span class="header">Croppa</span>
      <span class="subheader">A simple straightforward customizable lightweight mobile-friendly image cropper for Vue 2.0.</span>
      <a href="https://github.com/zhanziyang/vue-croppa">
        <img src="static/github.png"
             alt="Github repository"
             draggable="true">
      </a>
    </h2>
    <v-divider></v-divider>
    <br>
    <v-layout row
              wrap>
      <v-flex xs12
              md6
              xs12
              order-md2>
        <h5>Try It Out
        </h5>
        <p class="tip">
          <i class="iconfont icon-pc"></i>
          <em :class="disabled || disableDragAndDrop ? 's' : ''">Drag and drop a file</em> |
          <em :class="disabled || disableClickToChoose ? 's' : ''">Click to choose a file</em> |
          <em :class="disabled || disableDragToMove ? 's' : ''">Drag to move</em> |
          <em :class="disabled || disableScrollToZoom ? 's' : ''">Scroll to zoom</em>
        </p>
        <p class="tip">
          <i class="iconfont icon-mobile"></i>
          <em :class="disabled || disableClickToChoose ? 's' : ''">Tab to choose a file</em> |
          <em :class="disabled || disableDragToMove ? 's' : ''">Drag to move</em> |
          <em :class="disabled || disablePinchToZoom ? 's' : ''">Pinch with two fingers to zoom</em>
        </p>
        <img src=""
             class="preload"
             ref="preload">
        <croppa v-model="myCroppa"
                :width="+width"
                :height="+height"
                :canvas-color="canvasColor"
                :placeholder="placeholder"
                :placeholder-font-size="+placeholderFontSize"
                :placeholder-color="placeholderColor"
                :accept="accept"
                :file-size-limit="+fileSizeLimit"
                :quality="+quality"
                :zoom-speed="+zoomSpeed"
                :disabled="disabled"
                :disable-drag-and-drop="disableDragAndDrop"
                :disable-click-to-choose="disableClickToChoose"
                :disable-drag-to-move="disableDragToMove"
                :disable-scroll-to-zoom="disableScrollToZoom"
                :disable-pinch-to-zoom="disablePinchToZoom"
                :prevent-white-space="preventWhiteSpace"
                :reverse-scroll-to-zoom="reverseScrollToZoom"
                :show-remove-button="showRemoveButton"
                :remove-button-color="removeButtonColor"
                :remove-button-size="+removeButtonSize"
                @init="handleCroppaInit"
                @file-choose="handleCroppaFileChoose"
                @file-size-exceed="handleCroppaFileSizeExceed"
                @file-type-mismatch="handleCroppaFileTypeMismatch"
                @image-remove="handleImageRemove"
                @move="handleCroppaMove"
                @zoom="handleCroppaZoom">
          <img :src="initialImageSrc"
               slot="initial"
               v-if="withInitialImage">
        </croppa>
        <br>
        <br>
        <h5>Template Example</h5>
        <pre v-highlightjs="code"><code class="html" style="margin-bottom: 16px"></code></pre>
      </v-flex>
      <v-flex xs12
              md6
              xs12
              order-md1>
        <h5>Customization</h5>
        <v-layout row
                  wrap>
          <v-flex md4
                  xs12>
            <v-slider v-model="width"
                      label="width"
                      thumb-label
                      :max="500"
                      :min="100"></v-slider>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-slider v-model="height"
                      label="height"
                      thumb-label
                      :max="500"
                      :min="100"></v-slider>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-select v-bind:items="['default', 'black', 'grey', '#00bcd4', 'rgb(205, 220, 57)']"
                      v-model="canvasColor"
                      label="canvasColor"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex md4
                  xs12>
            <v-switch v-bind:label="`set initial image`"
                      v-model="withInitialImage"></v-switch>
          </v-flex>
          <v-flex md8>
            <v-text-field name="initialImageSrc"
                          label="initial image url"
                          v-model="initialImageSrc"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex md4
                  xs12>
            <v-text-field name="placeholder"
                          label="placeholder"
                          v-model="placeholder"></v-text-field>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-text-field name="placeholderFontSize"
                          label="placeholderFontSize (px)"
                          type="number"
                          v-model="placeholderFontSize"></v-text-field>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-select v-bind:items="['default', 'white', 'grey', '#ffc107', 'rgb(0, 150, 136)']"
                      v-model="placeholderColor"
                      label="placeholderColor"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex md6
                  xs12>
            <v-text-field name="accept"
                          label="accept"
                          v-model="accept"></v-text-field>
          </v-flex>
          <v-flex md6
                  xs12>
            <v-text-field name="fileSizeLimit"
                          label="fileSizeLimit (byte)"
                          type="number"
                          v-model="fileSizeLimit"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex md6
                  xs12>
            <v-slider v-model="quality"
                      label="quality"
                      thumb-label
                      :max="5"
                      :min="1"
                      :step="1"></v-slider>
          </v-flex>
          <v-flex md6
                  xs12>
            <v-slider v-model="zoomSpeed"
                      label="zoomSpeed"
                      thumb-label
                      :max="10"
                      :min="1"
                      :step="1"></v-slider>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex md4
                  xs12>
            <v-switch v-bind:label="`disableClickToChoose`"
                      v-model="disableClickToChoose"></v-switch>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-switch v-bind:label="`disableDragToMove`"
                      v-model="disableDragToMove"></v-switch>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-switch v-bind:label="`disableScrollToZoom`"
                      v-model="disableScrollToZoom"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex md4
                  xs12>
            <v-switch v-bind:label="`disableDragAndDrop`"
                      v-model="disableDragAndDrop"></v-switch>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-switch v-bind:label="`disablePinchToZoom`"
                      v-model="disablePinchToZoom"></v-switch>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-switch v-bind:label="`disabled (all)`"
                      v-model="disabled"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex md4
                  xs12>
            <v-switch v-bind:label="`preventWhiteSpace`"
                      v-model="preventWhiteSpace"></v-switch>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-switch v-bind:label="`reverseScrollToZoom`"
                      v-model="reverseScrollToZoom"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex md4
                  xs12>
            <v-switch v-bind:label="`showRemoveButton`"
                      v-model="showRemoveButton"></v-switch>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-select v-bind:items="['red', 'black', 'purple', '#ffc107', 'rgb(0, 150, 136)']"
                      v-model="removeButtonColor"
                      label="removeButtonColor"></v-select>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-text-field name="removeButtonSize"
                          label="removeButtonSize (px)"
                          type="number"
                          v-model="removeButtonSize"></v-text-field>
          </v-flex>
        </v-layout>
        <br>
        <h5>Method Example</h5>
        <v-layout row
                  wrap>
          <v-flex md6
                  xs12>
            <pre v-highlightjs="methodExample5"><code class="js"></code></pre>
            <v-btn dark
                   default
                   @click.native="chooseFile">Choose File</v-btn>
          </v-flex>
          <v-flex md6
                  xs12>
            <pre v-highlightjs="methodExample1"><code class="js"></code></pre>
            <v-btn dark
                   default
                   @click.native="remove">Remove</v-btn>
          </v-flex>
        </v-layout>
        <br>
        <v-layout row
                  wrap>
          <v-flex md6
                  xs12>
            <pre v-highlightjs="methodExample6"><code class="js"></code></pre>
            <v-btn dark
                   default
                   @click.native="moveUp">Move Upwards for 5 px</v-btn>
          </v-flex>
          <v-flex md6
                  xs12>
            <pre v-highlightjs="methodExample2"><code class="js"></code></pre>
            <v-btn dark
                   default
                   @click.native="zoomIn">Zoom In</v-btn>
          </v-flex>
        </v-layout>
        <br>
        <v-layout row
                  wrap>
          <v-flex md12>
            <pre v-highlightjs="methodExample3"><code class="js"></code></pre>
            <v-btn dark
                   default
                   @click.native="getDataUrl">Data Url</v-btn>
          </v-flex>
        </v-layout>
        <br>
        <v-layout row
                  wrap>
          <v-flex md12>
            <pre v-highlightjs="methodExample4"><code class="js"></code></pre>
            <v-btn dark
                   default
                   @click.native="refresh">Refresh</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
  
    </v-layout>
    <br>
    <v-divider></v-divider>
    <br>
    <v-layout row
              wrap>
      <v-flex md8
              offset-md2>
        <h4>Quick Start</h4>
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
        <p>3. Register it as a vue plugin.</p>
        <v-layout row
                  wrap>
          <v-flex md12>
            <pre v-highlightjs="vueRegistry"><code class="javascript"></code></pre>
          </v-flex>
        </v-layout>
        <br>
        <p>4. Now you have it. The simplest usage: </p>
        <v-layout row
                  wrap>
          <v-flex md12>
            <pre v-highlightjs="simplestUsage"><code class="html"></code></pre>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <br>
    <v-divider></v-divider>
    <br>
    <v-layout row
              wrap>
      <v-flex md8
              offset-md2>
        <h4>Documentation</h4>
        <p>See full documentation
          <a href="https://github.com/zhanziyang/vue-croppa/blob/master/README.md#documentation">here</a>.</p>
        <br>
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
        placeholder: 'Choose an image',
        placeholderFontSize: 0,
        placeholderColor: 'default',
        quality: 2,
        zoomSpeed: 3,
        accept: '.jpg,.png,.gif,.bmp,.webp,.svg,.tiff',
        fileSizeLimit: 0,
        disabled: false,
        disableDragAndDrop: false,
        disableClickToChoose: false,
        disableDragToMove: false,
        disableScrollToZoom: false,
        preventWhiteSpace: false,
        disablePinchToZoom: false,
        reverseScrollToZoom: false,
        showRemoveButton: true,
        removeButtonColor: 'red',
        removeButtonSize: 0,
        withInitialImage: false,
        initialImageSrc: 'https://zhanziyang.github.io/vue-croppa/static/initial-image.png'
      }
    },

    computed: {
      code () {
        return `\
  <!-- Sync with your customazations on the left! -->

  <croppa v-model="myCroppa"
          :width="${this.width}"
          :height="${this.height}"
          :canvas-color="'${this.canvasColor}'"
          :placeholder="'${this.placeholder}'"
          :placeholder-font-size="${this.placeholderFontSize}"
          :placeholder-color="'${this.placeholderColor}'"
          :accept="'${this.accept}'"
          :file-size-limit="${this.fileSizeLimit}"
          :quality="${this.quality}"
          :zoom-speed="${this.zoomSpeed}"
          :disabled="${this.disabled}"
          :disable-drag-and-drop="${this.disableDragAndDrop}"
          :disable-click-to-choose="${this.disableClickToChoose}"
          :disable-drag-to-move="${this.disableDragToMove}"
          :disable-scroll-to-zoom="${this.disableScrollToZoom}"
          :disable-pinch-to-zoom="${this.disablePinchToZoom}"
          :prevent-white-space="${this.preventWhiteSpace}"
          :reverse-scroll-to-zoom="${this.reverseScrollToZoom}"
          :show-remove-button="${this.showRemoveButton}"
          :remove-button-color="'${this.removeButtonColor}'"
          :remove-button-size="${this.removeButtonSize}"
          @init="handleCroppaInit"
          @file-choose="handleCroppaFileChoose"
          @file-size-exceed="handleCroppaFileSizeExceed"
          @file-type-mismatch="handleCroppaFileTypeMismatch"
          @image-remove="handleImageRemove"
          @move="handleCroppaMove"
          @zoom="handleCroppaZoom">
    ${this.withInitialImage ? `<img src="${this.initialImageSrc}"
         slot="initial">` : ''}
  </croppa>`
      },

      methodExample1 () {
        return `this.myCroppa.remove()`
      },

      methodExample2 () {
        return `this.myCroppa.zoomIn()`
      },

      methodExample3 () {
        return `alert(this.myCroppa.generateDataUrl())`
      },

      methodExample4 () {
        return `this.myCroppa.refresh()`
      },

      methodExample5 () {
        return `this.myCroppa.chooseFile()`
      },

      methodExample6 () {
        return `this.myCroppa.moveUpwards(5)`
      },

      installStyle () {
        return '<link href="https://unpkg.com/vue-croppa/dist/vue-croppa.min.css" rel="stylesheet" type="text/css">'
      },

      installTags () {
        return `\
  <script src="https://unpkg.com/vue-croppa/dist/vue-croppa.min.js"><\/script>\
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

    beforeMount () {
      let windowWidth = window.innerWidth
      if (windowWidth < 400) {
        this.width = 200
        this.height = 200
      }
    },

    mounted () {
      this.$refs.preload.src = 'https://zhanziyang.github.io/vue-croppa/static/initial-image.png'
    },

    watch: {
      withInitialImage: function () {
        this.refresh()
      },
      initialImageSrc: function () {
        this.refresh()
      }
    },

    methods: {
      getDataUrl () {
        alert(this.myCroppa.generateDataUrl())
      },

      async printBlob () {
        let blob = await this.myCroppa.promisedBlob()
        console.log(blob)
      },

      refresh () {
        this.myCroppa.refresh()
      },

      remove () {
        this.myCroppa.remove()
      },

      zoomIn () {
        this.myCroppa.zoomIn()
      },

      chooseFile () {
        this.myCroppa.chooseFile()
      },

      moveUp () {
        this.myCroppa.moveUpwards(5)
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

      handleCroppaFileTypeMismatch (file) {
        console.log('file type mismatch')
        console.log(file)
      },

      handleImageRemove () {
        console.log('image removed')
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
      position: relative
      padding-right: 80px
      @media screen and (max-width: 600px)
        padding-bottom: 1px
        margin-bottom: 4px
      span.header
        font-family: 'Black Ops One', cursive
      span.header:first-child
        color: #41b883
      span.header:nth-child(2)
        color: #35495e
      img
        position: absolute
        right: 12px
        width: 60px
        bottom: 0px
        transition: all .3s
        &:hover
          opacity: .7
    .subheader
      padding: 0
      font-size: 20px
      margin: 10px 0
      @media screen and (max-width: 600px)
        font-size: 14px
        margin: 4px 0
    code
      font-size: 14px
      font-family: Consolas, Monaco, monospace
    h5 
      color: #35495e
      font-size: 24px
    p.tip
      font-size: 14px
      em
        color: #41b883
        font-style: normal
        &.s
          text-decoration: line-through
    h4
      font-size: 34px
    h6
      font-size: 20px
  .preload
    width: 0
    height: 0
    visibility: 0
    display: block
  .deprecated
    strong
      text-decoration: line-through
    b
      color: red
</style>
