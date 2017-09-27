<template>
  <div id="demos">
    <v-layout row
              wrap>
      <v-flex>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="false">
            <div slot="header"
                 class="title">Zoom Slider</div>
            <div class="pt-2 pl-2">
              <p data-height="300"
                 data-theme-id="19967"
                 data-slug-hash="eGpWRd"
                 data-default-tab="js,result"
                 data-user="zhanziyang"
                 data-embed-version="2"
                 data-pen-title="Vue Croppa zoom slider"
                 class="codepen">See the Pen
                <a href="https://codepen.io/zhanziyang/pen/eGpWRd/">Vue Croppa zoom slider</a> by Chris (
                <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
                <a href="https://codepen.io">CodePen</a>.</p>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="false">
            <div slot="header"
                 class="title">Upload</div>
            <div class="pt-2 pl-2">
              This is an example of uploading binary file. If you want to upload base64 data url string. You need to use
              <code>generateDataUrl()</code> method and you don't need FormData API. Usually you just send it like any other string field.
              <br><br>
              <p data-height="637"
                 data-theme-id="19967"
                 data-slug-hash="mMweXa"
                 data-default-tab="js,result"
                 data-user="zhanziyang"
                 data-embed-version="2"
                 data-pen-title="Vue Croppa upload"
                 class="codepen">See the Pen
                <a href="https://codepen.io/zhanziyang/pen/mMweXa/">Vue Croppa upload</a> by Chris (
                <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
                <a href="https://codepen.io">CodePen</a>.</p>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="false">
            <div slot="header"
                 class="title">Download</div>
            <div class="pt-2 pl-2">
              <p data-height="300"
                 data-theme-id="19967"
                 data-slug-hash="qXrpmW"
                 data-default-tab="js,result"
                 data-user="zhanziyang"
                 data-embed-version="2"
                 data-pen-title="Vue Croppa data url"
                 class="codepen">See the Pen
                <a href="https://codepen.io/zhanziyang/pen/qXrpmW/">Vue Croppa data url</a> by Chris (
                <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
                <a href="https://codepen.io">CodePen</a>.</p>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="false">
            <div slot="header"
                 class="title">Resizable Container</div>
            <div class="pt-2 pl-2">
              <div class="wrapper">
                <croppa :height="resizableH"
                        :width="resizableW"
                        class="resizable-croppa"></croppa>
                <img src="static/resize-bottom-right.svg"
                     class="icon-resize"
                     @mousedown.stop.prevent="onResizeTouchStart">
              </div>
              <br>
              <pre v-highlightjs="resizableTpl"><code class="html"></code></pre>
              <br>
              <pre v-highlightjs="resizableScript"><code class="javascript"></code></pre>
              <br>
              <pre v-highlightjs="resizableStyle"><code class="stylus"></code></pre>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="false">
            <div slot="header"
                 class="title">Attachments (watermark, sticker)</div>
            <div class="pt-2 pl-2">Since v0.3.0, you can use
              <code>@draw</code> event to apply attachment on image. Things like watermarks and stickers are now possible.</div>
            <div class="pt-2 pl-2">
              <img src="static/favicons/android-chrome-512x512.png"
                   class="addon">
              <croppa v-model="croppa1"
                      :width="400"
                      :height="400"
                      initial-image="/vue-croppa/static/500.jpeg"
                      @draw="onDraw">
              </croppa>
              <br>
              <pre v-highlightjs="stickerTpl"><code class="html"></code></pre>
              <br>
              <pre v-highlightjs="stickerScript"><code class="javascript"></code></pre>
              <!-- <br>
                  <pre v-highlightjs="stickerStyle"><code class="stylus"></code></pre> -->
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="false">
            <div slot="header"
                 class="title">Use Metadata</div>
            <div class="pt-2 pl-2">Inspired by
              <a href="https://github.com/zhanziyang/vue-croppa/issues/24">this issue</a>, since v0.3.0, you can get the metadata that describes current user manipulations (moving, zooming, rotating), save it somewhere, and later you can apply it to retrieve the previous state. These are done by using
              <code>getMetadata()</code> and
              <code>applyMetadata(metadata)</code> methods.</div>
            <div class="pt-2 pl-2">In the following exmaple, first do some manipulations like zooming, moving or rotating, and then click "Save Metadata" button to save it locally, then do some manipulations again, now click "Apply Metadata" to get back to the previous state.</div>
            <div class="pt-2 pl-2">
              <croppa v-model="croppa2"
                      initial-image="/vue-croppa/static/500.jpeg"
                      :width="400"
                      :height="400"></croppa>
              <br>
              <v-btn @click="rotate">ROTATE</v-btn>
              <v-btn @click="flipX">FLIP-X</v-btn>
              <v-btn @click="flipY">FLIP-Y</v-btn>
              <br>
              <v-btn dark
                     large
                     @click="saveMetadata">SAVE METADATA</v-btn>
              <v-btn dark
                     large
                     @click="applyMetadata">APPLY METADATA</v-btn>
              <br>
              <pre v-highlightjs="metadataTpl"><code class="html"></code></pre>
              <br>
              <pre v-highlightjs="metadataScript"><code class="javascript"></code></pre>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="false">
            <div slot="header"
                 class="title">Image Placeholder</div>
            <div class="pt-2 pl-2">If you are not satified with the simple text placeholder. Since v0.3.0, you can apply an
              <code>&lt;img&gt;</code> slot named
              <code>placeholder</code> to get an image placeholder! The image will be draw on croppa under the placeholder text.</div>
            <div class="pt-2 pl-2">
              <croppa v-model="croppa3"
                      :width="400"
                      :height="400">
                <img slot="placeholder"
                     src="static/favicons/android-chrome-512x512.png">
              </croppa>
              <br>
              <pre v-highlightjs="imagePlaceholderTpl"><code class="html"></code></pre>
            </div>
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
        resizing: false,
        resizableW: 200,
        resizableH: 200,
        croppa1: {},
        croppa2: {}
      }
    },

    computed: {
      resizableTpl () {
        return `\
 <div class="wrapper">
    <croppa :height="resizableH"
            :width="resizableW"
            class="resizable-croppa"></croppa>
    <img src="static/resize-bottom-right.svg"
          class="icon-resize"
          @mousedown.stop.prevent="onResizeTouchStart">
 </div>`
      },

      resizableScript () {
        return `\
 export default {
    data () {
      return {
        resizing: false,
        resizableW: 200,
        resizableH: 200
      }
    },

    mounted () {
      document.documentElement.addEventListener('mousemove', (evt) => {
        evt.preventDefault()
        this.onResizeTouchMove(evt)
      })
      document.documentElement.addEventListener('mouseup', (evt) => {
        evt.preventDefault()
        this.onResizeTouchEnd(evt)
      })
    },

    methods: {
      onResizeTouchStart (evt) {
        this.resizing = true
      },

      onResizeTouchMove (evt) {
        if (!this.resizing) return
        document.documentElement.style.cursor = 'nwse-resize'

        var croppa = document.querySelector('.resizable-croppa')

        this.resizableW = evt.clientX - croppa.getBoundingClientRect().left
        this.resizableH = evt.clientY - croppa.getBoundingClientRect().top
      },

      onResizeTouchEnd (evt) {
        this.resizing = false
        document.documentElement.style.cursor = 'default'
      }
    }
  }`
      },

      resizableStyle () {
        return `\
.wrapper
  position: relative
  display: inline-block
  font-size: 0
  .icon-resize
    position: absolute
    right: 4px
    bottom: 4px
    font-size: 16px
    width: 2em
    cursor: nwse-resize`
      },

      stickerStyle () {
        return `\
.addon
  height: 0
  width: 0
  line-height: 1
  font-size: 0
  visibility: 0
  border: 0`
      },

      stickerTpl () {
        return `\
 <img src="static/favicons/android-chrome-512x512.png"
        class="addon">
  <croppa v-model="croppa1"
          :width="400"
          :height="400"
          initial-image="/vue-croppa/static/500.jpeg"
          @draw="onDraw">
  </croppa>`
      },

      stickerScript () {
        return `\
 export default {
    data () {
      return {
        croppa1: {}
      }
    },

    methods: {
      onDraw: function (ctx) {
        ctx.save()
        ctx.globalAlpha = 0.7
        ctx.drawImage(document.querySelector('.addon'), 400, 400, 400, 400)
        ctx.restore()
      }
    }
  }`
      },

      metadataTpl () {
        return `\
 <croppa v-model="croppa2"
          initial-image="/vue-croppa/static/500.jpeg"
          :width="400"
          :height="400"></croppa>
  <br>
  <v-btn @click="rotate">ROTATE</v-btn>
  <v-btn @click="flipX">FLIP-X</v-btn>
  <v-btn @click="flipY">FLIP-Y</v-btn>
  <br>
  <v-btn dark
          large
          @click="saveMetadata">SAVE METADATA</v-btn>
  <v-btn dark
          large
          @click="applyMetadata">APPLY METADATA</v-btn>`
      },

      metadataScript () {
        return `\
 export default {
    data () {
      return {
        croppa2: {}
      }
    },

    methods: {
      rotate () {
        this.croppa2.rotate()
      },

      flipX () {
        this.croppa2.flipX()
      },

      flipY () {
        this.croppa2.flipY()
      },

      saveMetadata () {
        localStorage.setItem('metadata', JSON.stringify(this.croppa2.getMetadata()))
      },

      applyMetadata () {
        var metadata = JSON.parse(localStorage.getItem('metadata'))
        this.croppa2.applyMetadata(metadata)
      }
    }
  }`
      },

      imagePlaceholderTpl () {
        return `\
 <croppa v-model="croppa3"
          :width="400"
          :height="400">
    <img slot="placeholder"
         src="static/favicons/android-chrome-512x512.png">
  </croppa>`
      }
    },

    mounted () {
      var script = document.createElement('script')
      script.src = '/vue-croppa/static/ei.js'
      document.body.appendChild(script)

      document.documentElement.addEventListener('mousemove', (evt) => {
        evt.preventDefault()
        this.onResizeTouchMove(evt)
      })
      document.documentElement.addEventListener('mouseup', (evt) => {
        evt.preventDefault()
        this.onResizeTouchEnd(evt)
      })
    },

    methods: {
      onResizeTouchStart (evt) {
        this.resizing = true
      },

      onResizeTouchMove (evt) {
        if (!this.resizing) return
        document.documentElement.style.cursor = 'nwse-resize'

        var croppa = document.querySelector('.resizable-croppa')

        this.resizableW = evt.clientX - croppa.getBoundingClientRect().left
        this.resizableH = evt.clientY - croppa.getBoundingClientRect().top
      },

      onResizeTouchEnd (evt) {
        this.resizing = false
        document.documentElement.style.cursor = 'default'
      },

      onDraw (ctx) {
        ctx.save()
        ctx.globalAlpha = 0.7
        ctx.drawImage(document.querySelector('.addon'), 400, 400, 400, 400)
        ctx.restore()
      },

      rotate () {
        this.croppa2.rotate()
      },

      flipX () {
        this.croppa2.flipX()
      },

      flipY () {
        this.croppa2.flipY()
      },

      saveMetadata () {
        localStorage.setItem('metadata', JSON.stringify(this.croppa2.getMetadata()))
      },

      applyMetadata () {
        var metadata = JSON.parse(localStorage.getItem('metadata'))
        this.croppa2.applyMetadata(metadata)
      }

    }
  }
</script>

<style lang="stylus" scoped>
.wrapper
  position relative
  display inline-block
  font-size 0
  .icon-resize
    position absolute
    right 4px
    bottom 4px
    font-size 16px
    width 2em
    cursor nwse-resize

.addon
  height: 0
  width: 0
  line-height: 1
  font-size: 0
  visibility: 0
  border: 0
</style>
