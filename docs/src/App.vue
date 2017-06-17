<template>
  <v-app>
    <h2>
      <span class="header">Vue</span>
      <span class="header">Croppa</span>
      <span class="subheader">A simple straightforward customizable image cropper for vue.js.</span>
      <a href="https://github.com/zhanziyang/vue-croppa">
        <img src="static/github.png"
             alt="Github repository">
      </a>
    </h2>
    <v-divider></v-divider>
    <br>
    <v-layout row
              wrap>
      <v-flex xs6>
        <h5>Props Playground</h5>
        <v-layout row
                  wrap>
          <v-flex xs4>
            <v-slider v-model="width"
                      label="width"
                      thumb-label
                      :max="500"
                      :min="100"></v-slider>
          </v-flex>
          <v-flex xs4>
            <v-slider v-model="height"
                      label="height"
                      thumb-label
                      :max="500"
                      :min="100"></v-slider>
          </v-flex>
          <v-flex xs4>
            <v-select v-bind:items="['default', 'black', 'grey', '#00bcd4', 'rgb(205, 220, 57)']"
                      v-model="canvasColor"
                      label="canvasColor"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs4>
            <v-text-field name="placeholder"
                          label="placeholder"
                          v-model="placeholder"></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-text-field name="placeholderFontSize"
                          label="placeholderFontSize (px)"
                          type="number"
                          v-model="placeholderFontSize"></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-select v-bind:items="['default', 'white', 'grey', '#ffc107', 'rgb(0, 150, 136)']"
                      v-model="placeholderColor"
                      label="placeholderColor"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs6>
            <v-text-field name="accept"
                          label="accept"
                          v-model="accept"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="fileSizeLimit"
                          label="fileSizeLimit (byte)"
                          type="number"
                          v-model="fileSizeLimit"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs6>
            <v-slider v-model="quality"
                      label="quality"
                      thumb-label
                      :max="5"
                      :min="1"
                      :step="1"></v-slider>
          </v-flex>
          <v-flex xs6>
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
          <v-flex xs9>
            <v-switch v-bind:label="`disabled`"
                      v-model="disabled"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs4>
            <v-switch v-bind:label="`disableClickToChoose`"
                      v-model="disableClickToChoose"></v-switch>
          </v-flex>
          <v-flex xs4>
            <v-switch v-bind:label="`disableDragToMove`"
                      v-model="disableDragToMove"></v-switch>
          </v-flex>
          <v-flex xs4>
            <v-switch v-bind:label="`disableScrollToZoom`"
                      v-model="disableScrollToZoom"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs4>
            <v-switch v-bind:label="`preventWhiteSpace`"
                      v-model="preventWhiteSpace"></v-switch>
          </v-flex>
          <v-flex xs4>
            <v-switch v-bind:label="`reverseZoomingGesture`"
                      v-model="reverseZoomingGesture"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs4>
            <v-switch v-bind:label="`showRemoveButton`"
                      v-model="showRemoveButton"></v-switch>
          </v-flex>
          <v-flex xs4>
            <v-select v-bind:items="['red', 'black', 'purple', '#ffc107', 'rgb(0, 150, 136)']"
                      v-model="removeButtonColor"
                      label="removeButtonColor"></v-select>
          </v-flex>
          <v-flex xs4>
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
          <v-flex xs6>
            <pre v-highlightjs="methodExample1"><code class="js"></code></pre>
            <v-btn dark
                   default
                   @click.native="reset">Reset</v-btn>
          </v-flex>
          <v-flex xs6>
            <pre v-highlightjs="methodExample2"><code class="js"></code></pre>
            <v-btn dark
                   default
                   @click.native="zoomIn">Zoom In</v-btn>
          </v-flex>
        </v-layout>
        <br>
        <v-layout row
                  wrap>
          <v-flex xs12>
            <pre v-highlightjs="methodExample3"><code class="js"></code></pre>
            <v-btn dark
                   default
                   @click.native="getDataUrl">Data Url</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs6>
        <h5>Try It Out
          <span>
            <em :class="disabled || disableClickToChoose ? 's' : ''">Click to Choose an image</em> |
            <em :class="disabled || disableDragToMove ? 's' : ''">Drag to move</em> |
            <em :class="disabled || disableScrollToZoom ? 's' : ''">Scroll to zoom</em>
          </span>
        </h5>
        <croppa v-model="myCroppa"
                :width="width"
                :height="height"
                :canvas-color="canvasColor"
                :placeholder="placeholder"
                :placeholder-font-size="placeholderFontSize"
                :placeholder-color="placeholderColor"
                :input-accept="accept"
                :file-size-limit="fileSizeLimit"
                :quality="quality"
                :zoom-speed="zoomSpeed"
                :disabled="disabled"
                :disable-click-to-choose="disableClickToChoose"
                :disable-drag-to-move="disableDragToMove"
                :disable-scroll-to-zoom="disableScrollToZoom"
                :prevent-white-space="preventWhiteSpace"
                :reverse-zooming-gesture="reverseZoomingGesture"
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
    <br>
    <v-divider></v-divider>
    <br>
    <v-layout row
              wrap>
      <v-flex xs8
              offset-xs2>
        <h4>Documentation</h4>
        <br>
        <h6>🌱 Props</h6>
        <ul>
          <li>
            <strong>v-model</strong>
            <p class="pt-2">A two-way binding prop. It syncs an object from within the croppa component with a data in parent. We can use this object to invoke useful methods (Check out "Methods" section).</p>
            <p>
              type:
              <code>object</code>
            </p>
            <p>
              default:
              <code>null</code>
            </p>
          </li>
          <li>
            <strong>width</strong>
            <p class="pt-2">Display width of the preview container.</p>
            <p>
              type:
              <code>number</code>
            </p>
            <p>
              default:
              <code>200</code>
            </p>
            <p>
              valid:
              <code>val > 0</code>
            </p>
          </li>
          <li>
            <strong>height</strong>
            <p class="pt-2">Display height of the preview container.</p>
            <p>
              type:
              <code>number</code>
            </p>
            <p>
              default:
              <code>200</code>
            </p>
            <p>
              valid:
              <code>val > 0</code>
            </p>
          </li>
          <li>
            <strong>placeholder</strong>
            <p class="pt-2">Placeholder text of the preview container. It shows up when there is no image.</p>
            <p>
              type:
              <code>string</code>
            </p>
            <p>
              default:
              <code>'Choose an image'</code>
            </p>
          </li>
          <li>
            <strong>placeholder-color</strong>
            <p class="pt-2">Placeholder text color.</p>
            <p>
              type: same as what
              <code>CanvasRenderingContext2D.fillStyle</code> accepts.
            </p>
            <p>
              default:
              <code>'#606060'</code>
            </p>
          </li>
          <li>
            <strong>placeholder-font-size</strong>
            <p class="pt-2">Placeholder text font size in pixel. When set to
              <code>0</code>, the font size will be ajust automatically so that the whole placehoder only takes up 2/3 of the container's width.</p>
            <p>
              type:
              <code>number</code>
            </p>
            <p>
              default:
              <code>0</code>
            </p>
          </li>
          <li>
            <strong>canvas-color</strong>
            <p class="pt-2">Initial background color and white space color if there is an image.</p>
            <p>
              type: same as what
              <code>CanvasRenderingContext2D.fillStyle</code> accepts.
            </p>
            <p>
              default:
              <code>'#e6e6e6'</code>
            </p>
          </li>
          <li>
            <strong>quality</strong>
            <p class="pt-2">Specifies how many times larger the actual image is than the container's display size.</p>
            <p>
              type:
              <code>number</code>
            </p>
            <p>
              default:
              <code>2</code>
            </p>
            <p>
              valid:
              <code style="white-space: nowrap">isInteger(val) && val > 0</code>
            </p>
          </li>
          <li>
            <strong>zoom speed</strong>
            <p class="pt-2">Specifies how fast the zoom is reacting to scroll gestures. Default to level 3.</p>
            <p>
              type:
              <code>number</code>
            </p>
            <p>
              default:
              <code>3</code>
            </p>
            <p>
              valid:
              <code>val > 0</code>
            </p>
          </li>
          <li>
            <strong>accept</strong>
            <p class="pt-2">Limits the types of files that users can choose.</p>
            <p>
              type: same as what
              <code>accept</code> attribute of HTML
              <code>input</code> element takes.
            </p>
            <p>
              default:
              <code>'image/*'</code>
            </p>
          </li>
          <li>
            <strong>file-size-limit</strong>
            <p class="pt-2">Limits the byte size of file that users can choose. If set to
              <code>0</code>, then no limit.</p>
            <p>
              type:
              <code>number</code>
            </p>
            <p>
              default:
              <code>0</code>
            </p>
          </li>
          <li>
            <strong>disabled</strong>
            <p class="pt-2">Disables user interaction.</p>
            <p>
              type:
              <code>boolean</code>
            </p>
            <p>
              default:
              <code>false</code>
            </p>
          </li>
          <li>
            <strong>disable-click-to-choose</strong>
            <p class="pt-2">Disables the default "click to choose an image" user interaction. You can instead trigger the file chooser window programmatically by invoking
              <code>chooseFile()</code> method.</p>
            <p>
              type:
              <code>boolean</code>
            </p>
            <p>
              default:
              <code>false</code>
            </p>
          </li>
          <li>
            <strong>disable-drag-to-move</strong>
            <p class="pt-2">Disables the default "drag to move" user interaction. You can instead move the image programmatically by invoking
              <code>moveUpwards()</code>/
              <code>moveDownwards()</code>/
              <code>moveLeftwards()</code>/
              <code>moveRightwards()</code> methods.</p>
            <p>
              type:
              <code>boolean</code>
            </p>
            <p>
              default:
              <code>false</code>
            </p>
          </li>
          <li>
            <strong>disable-scroll-to-zoom</strong>
            <p class="pt-2">Disables the default "scroll to zoom" user interaction. You can instead zoom the image programmatically by invoking
              <code>zoomIn()</code>/
              <code>zoomOut()</code> methods.</p>
            <p>
              type:
              <code>boolean</code>
            </p>
            <p>
              default:
              <code>false</code>
            </p>
          </li>
          <li>
            <strong>reverse-zooming-gesture</strong>
            <p class="pt-2">Reverses the zoom-in/zoom-out direction when scrolling.</p>
            <p>
              type:
              <code>boolean</code>
            </p>
            <p>
              default:
              <code>false</code>
            </p>
          </li>
          <li>
            <strong>prevent-white-space</strong>
            <p class="pt-2">Prevents revealing background white space when moving or zooming the image.</p>
            <p>
              type:
              <code>boolean</code>
            </p>
            <p>
              default:
              <code>false</code>
            </p>
          </li>
          <li>
            <strong>show-remove-button</strong>
            <p class="pt-2">Specifies whether to show the built-in remove-button. You can change the button's color and size using the following two props. If you still find it ugly, hide it and use the
              <code>reset()</code> method to implement your own trigger.</p>
            <p>
              type:
              <code>boolean</code>
            </p>
            <p>
              default:
              <code>false</code>
            </p>
          </li>
          <li>
            <strong>remove-button-color</strong>
            <p class="pt-2">Changes the default color of the remove-button. Accepts any css color format.</p>
            <p>
              type:
              <code>string</code>
            </p>
            <p>
              default:
              <code>'red'</code>
            </p>
          </li>
          <li>
            <strong>remove-button-size</strong>
            <p class="pt-2">Specifies the remove-button's width and height (they are equal). If set to
              <code>0</code>, then it use the default size.</p>
            <p>
              type:
              <code>number</code>
            </p>
            <p>
              default: default size is ajust accordingly to container's size
            </p>
          </li>
        </ul>
      </v-flex>
    </v-layout>
    <br>
    <br>
    <v-layout row
              wrap>
      <v-flex xs8
              offset-xs2>
        <h6>🌱 Methods</h6>
        <ul>
          <li>
            <strong>myCroppa.getCanvas()</strong>
            <p class="pt-1">returns the canvas object</p>
          </li>
          <li>
            <strong>myCroppa.getContext()</strong>
            <p class="pt-1">returns the canvas context object</p>
          </li>
          <li>
            <strong>myCroppa.getChosenFile()</strong>
          </li>
          <li>
            <strong>myCroppa.getActualImageSize()</strong>
            <p class="pt-1">Return an object
              <code>{ width, height }</code> describing the real image size (preview size
              <code>* quality</code>)</p>
          </li>
          <li>
            <strong>myCroppa.moveUpwards( amountInPx: number )</strong>
          </li>
          <li>
            <strong>myCroppa.moveDownwards( amountInPx: number )</strong>
          </li>
          <li>
            <strong>myCroppa.moveLeftwards( amountInPx: number )</strong>
          </li>
          <li>
            <strong>myCroppa.moveRightwards( amountInPx: number )</strong>
          </li>
          <li>
            <strong>myCroppa.zoomIn()</strong>
          </li>
          <li>
            <strong>myCroppa.zoomOut()</strong>
          </li>
          <li>
            <strong>myCroppa.chooseFile()</strong>
            <p class="pt-1">Opens the file chooser window to Choose an image. Useful when default click-to-choose interaction is disabled.</p>
          </li>
          <li>
            <strong>myCroppa.reset()</strong>
            <p class="pt-1">Removes the current image, can be used to implement your own remove-button.</p>
          </li>
          <li>
            <strong>myCroppa.generateDataUrl( type: string )</strong>
            <p class="pt-1">Returns a data-URL containing a representation of the image in the format specified by the type parameter (defaults to
              <code>png</code>). </p>
          </li>
          <li>
            <strong>myCroppa.generateBlob( callback: function, mimeType: string, qualityArgument: number )</strong>
            <p class="pt-1">Creates a Blob object representing the image contained in the canvas. Look up argument definition
              <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob">here</a>.</p>
          </li>
        </ul>
      </v-flex>
    </v-layout>
    <br>
    <br>
    <v-layout row
              wrap>
      <v-flex xs8
              offset-xs2>
        <h6>🌱 Events</h6>
        <ul>
          <li>
            <strong>init</strong>
            <p>handler(croppa):
              <code>croppa</code>
              <span>is a croppa object to invoke methods - same as what
                <code>v-model</code> binds.</span>
            </p>
          </li>
          <li>
            <strong>file-choose</strong>:
            <span>emitted when user Choose an image from the poppup window.</span>
            <p>handler(file):
              <code>file</code>
              <span>is a file object - same as what
                <code>getChosenFile()</code> returns.</span>
            </p>
          </li>
          <li>
            <strong>file-size-exceed</strong>:
            <span>emitted after file choosing if the chosen file's size exceeds the limit specified by prop
              <code>fileSizeLimit</code>.</span>
            <p>handler(file):
              <code>file</code>
              <span>is a file object - same as what
                <code>getChosenFile()</code> returns.</span>
            </p>
          </li>
          <li>
            <strong>move</strong>
            <p>handler(): no args</p>
          </li>
          <li>
            <strong>zoom</strong>
            <p>handler(): no args</p>
          </li>
        </ul>
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
        accept: 'image/*',
        fileSizeLimit: 0,
        disabled: false,
        disableClickToChoose: false,
        disableDragToMove: false,
        disableScrollToZoom: false,
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
          :input-accept="${this.accept}"
          :file-size-limit="${this.fileSizeLimit}"
          :quality="${this.quality}"
          :zoom-speed="${this.zoomSpeed}"
          :disabled="${this.disabled}"
          :disable-click-to-choose="${this.disableClickToChoose}"
          :disable-drag-to-move="${this.disableDragToMove}"
          :disable-scroll-to-zoom="${this.disableScrollToZoom}"
          :prevent-white-space="${this.preventWhiteSpace}"
          :reverse-zooming-gesture="${this.reverseZoomingGesture}"
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
        return `this.myCroppa.zoomIn()`
      },

      methodExample3 () {
        return `alert(this.myCroppa.generateDataUrl())`
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

    methods: {
      getDataUrl () {
        alert(this.myCroppa.generateDataUrl())
      },

      reset () {
        this.myCroppa.reset()
      },

      zoomIn () {
        this.myCroppa.zoomIn()
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
      font-size: 22px
    code
      font-size: 14px
      font-family: Consolas, Monaco, monospace
    h5 
      color: #35495e
      span
        font-size: 14px
        em
          color: #41b883
          font-style: normal
          &.s
            text-decoration: line-through
</style>
