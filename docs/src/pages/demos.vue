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
              <p data-height="416"
                 data-theme-id="19967"
                 data-slug-hash="EvXjXx"
                 data-default-tab="js,result"
                 data-user="zhanziyang"
                 data-embed-version="2"
                 data-pen-title="Vue Croppa exif orientation"
                 class="codepen">See the Pen
                <a href="https://codepen.io/zhanziyang/pen/EvXjXx/">Vue Croppa exif orientation</a> by Chris (
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
                        :width="resizableW"></croppa>
                <img src="static/resize-bottom-right.svg"
                     class="icon-resize"
                     @dragenter.stop.prevent
                     @dragleave.stop.prevent
                     @dragover.stop.prevent
                     @drop.stop.prevent
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
              <br>
              <pre v-highlightjs="stickerStyle"><code class="stylus"></code></pre>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="false">
            <div slot="header"
                 class="title">Use Metadata</div>
            <div class="pt-2 pl-2">Inspired by
              <a href="https://github.com/zhanziyang/vue-croppa/issues/24">this issue</a>, since v0.3.0, you can get the metadata that describes current user manipulations (moving, zooming, rotating), save it somewhere, and later you can apply it later to retrieve the previous state. These are done by using
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
              <pre v-highlightjs="stickerTpl"><code class="html"></code></pre>
              <br>
              <pre v-highlightjs="stickerScript"><code class="javascript"></code></pre>
              <br>
              <pre v-highlightjs="stickerStyle"><code class="stylus"></code></pre>
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
        lastCoord: null,
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
            width="resizableW"></croppa>
    <img src="static/resize-bottom-right.svg"
        class="icon-resize"
        @dragenter.stop.prevent
        @dragleave.stop.prevent
        @dragover.stop.prevent
        @drop.stop.prevent
        @mousedown.stop.prevent="onResizeTouchStart">
 </div>`
      },

      resizableScript () {
        return `\
 export default {
    data () {
      return {
        lastCoord: null,
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
        this.lastCoord = {
          x: evt.clientX,
          y: evt.clientY
        }
      },

      onResizeTouchMove (evt) {
        if (!this.lastCoord) return
        document.documentElement.style.cursor = 'nwse-resize'
        var deltaX = evt.clientX - this.lastCoord.x
        var deltaY = evt.clientY - this.lastCoord.y

        this.lastCoord = {
          x: evt.clientX,
          y: evt.clientY
        }

        this.resizableW += deltaX
        this.resizableH += deltaY
      },

      onResizeTouchEnd (evt) {
        this.lastCoord = null
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
        this.lastCoord = {
          x: evt.clientX,
          y: evt.clientY
        }
      },

      onResizeTouchMove (evt) {
        if (!this.lastCoord) return
        document.documentElement.style.cursor = 'nwse-resize'
        var deltaX = evt.clientX - this.lastCoord.x
        var deltaY = evt.clientY - this.lastCoord.y

        this.lastCoord = {
          x: evt.clientX,
          y: evt.clientY
        }

        this.resizableW += deltaX
        this.resizableH += deltaY
      },

      onResizeTouchEnd (evt) {
        this.lastCoord = null
        document.documentElement.style.cursor = 'default'
      },

      onDraw: function (ctx) {
        ctx.save()
        ctx.globalAlpha = 0.7
        ctx.drawImage(document.querySelector('.addon'), 400, 400, 400, 400)
        ctx.restore()
      },

      rotate: function () {
        this.croppa2.rotate()
      },

      flipX: function () {
        this.croppa2.flipX()
      },

      flipY: function () {
        this.croppa2.flipY()
      },

      saveMetadata: function () {
        localStorage.setItem('metadata', JSON.stringify(this.croppa2.getMetadata()))
      },

      applyMetadata: function () {
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
