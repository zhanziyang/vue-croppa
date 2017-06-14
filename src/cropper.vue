<template>
  <div :class="`croppa-container ${img ? 'croppa--has-target' : ''}`">
    <input type="file"
           accept="image/*"
           ref="fileInput"
           hidden
           @change="handleInputChange" />
    <canvas ref="canvas"
            @click="selectFile"
            @touchstart="handlePointerStart"
            @mousedown="handlePointerStart"
            @pointerstart="handlePointerStart"
            @touchend="handlePointerEnd"
            @touchcancel="handlePointerEnd"
            @mouseup="handlePointerEnd"
            @pointerend="handlePointerEnd"
            @pointercancel="handlePointerEnd"
            @touchmove="handlePointerMove"
            @mousemove="handlePointerMove"
            @pointermove="handlePointerMove"
            @DOMMouseScroll="handleWheel"
            @mousewheel="handleWheel"></canvas>
    <!--<?xml version="1.0" standalone="no"?>-->
    <!--<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">-->
    <svg t="1497460039530"
         class="icon icon-remove"
         v-if="showRemoveButton && img"
         @click="unset"
         :style="`top: -${width/40}px; right: -${width/40}px`"
         viewBox="0 0 1024 1024"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         p-id="1074"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         :width="width/10"
         :height="width/10">
      <path d="M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z"
            p-id="1075"
            fill="red"></path>
    </svg>
  </div>
</template>

<script>
  import u from './util'
  import debounce from 'lodash/debounce'

  export default {
    props: {
      width: Number,
      height: Number,
      placeholder: String,
      placeholderColor: String,
      placeholderFontSize: Number,
      canvasColor: String,
      quality: {
        default: 2,
        type: Number
      },
      zoomSpeed: {
        default: 3,
        type: Number,
        validator: function (val) {
          return val > 0
        }
      },
      noWhiteSpace: Boolean,
      showRemoveButton: Boolean
    },

    data () {
      return {
        canvas: null,
        ctx: null,
        img: null,
        dragging: false,
        lastMovingCoord: null,
        imgData: {},
        dataUrl: ''
      }
    },

    computed: {
      canvasWidth () {
        return this.width * this.quality
      },

      canvasHeight () {
        return this.height * this.quality
      }
    },

    mounted () {
      this.init()
    },

    watch: {
      canvasWidth: 'init',
      canvasHeight: 'init',
      canvasColor: 'init',
      placeholder: 'init',
      placeholderColor: 'init',
      placeholderFontSize: 'init',
      noWhiteSpace: 'imgContentInit'
    },

    methods: {
      init () {
        this.canvas = this.$refs.canvas
        this.canvas.width = this.canvasWidth
        this.canvas.height = this.canvasHeight
        this.canvas.style.backgroundColor = this.canvasColor == 'default' ? '#e6e6e6' : this.canvasColor || '#e6e6e6'
        this.canvas.style.width = this.width + 'px'
        this.canvas.style.height = this.height + 'px'
        this.ctx = this.canvas.getContext('2d')
        this.unset()
        this.$emit('init', {
          reset: this.unset,
          selectFile: this.selectFile,
          generateDataUrl: this.generateDataUrl
        })
      },


      unset () {
        let ctx = this.ctx
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        let defaultFontSize = this.canvasWidth / 1.5 / this.placeholder.length
        let fontSize = this.placeholderFontSize == 0 ? defaultFontSize : this.placeholderFontSize || defaultFontSize
        ctx.font = fontSize + 'px sans-serif'
        ctx.fillStyle = this.placeholderColor == 'default' ? '#606060' : this.placeholderColor || '#606060'
        ctx.fillText(this.placeholder, this.canvasWidth / 2, this.canvasHeight / 2)
        this.img = null
        this.$refs.fileInput.value = ''
        this.imgData = {}
      },

      selectFile () {
        if (this.img) return
        // this.$refs.fileInput.value = ''
        this.$refs.fileInput.click()
      },

      handleInputChange () {
        let input = this.$refs.fileInput
        if (!input.files.length) return
        let file = input.files[0]
        let fd = new FileReader()
        fd.onload = (e) => {
          let fileData = e.target.result
          let img = new Image()
          img.src = fileData
          img.onload = () => {
            this.img = img
            this.imgContentInit()
          }
        }

        fd.readAsDataURL(file)
      },

      imgContentInit () {
        this.imgData.startX = 0
        this.imgData.startY = 0
        let imgWidth = this.img.naturalWidth
        let imgHeight = this.img.naturalHeight
        if (imgWidth > imgHeight) {
          let ratio = imgHeight / this.canvasHeight
          this.imgData.width = imgWidth / ratio
          this.imgData.startX = -(this.imgData.width - this.canvasWidth) / 2
          this.imgData.height = this.canvasHeight
        } else {
          let ratio = imgWidth / this.canvasWidth
          this.imgData.height = imgHeight / ratio
          this.imgData.startY = -(this.imgData.height - this.canvasHeight) / 2
          this.imgData.width = this.canvasWidth
        }
        this.draw()
      },

      handlePointerStart (evt) {
        if (evt.which && evt.which > 1) return
        this.dragging = true
      },

      handlePointerEnd (evt) {
        this.dragging = false
        this.lastMovingCoord = null
      },

      handlePointerMove (evt) {
        if (!this.dragging) return
        let coord = u.getPointerCoords(evt, this)
        if (this.lastMovingCoord) {
          this.move({
            x: coord.x - this.lastMovingCoord.x,
            y: coord.y - this.lastMovingCoord.y
          })
        }
        this.lastMovingCoord = coord
      },

      handleWheel (evt) {
        evt.preventDefault()
        evt.stopPropagation()
        let coord = u.getPointerCoords(evt, this)
        if (evt.wheelDelta < 0 || evt.detail < 0) {
          // 手指向上
          this.zoom(true, coord)
        } else if (evt.wheelDelta > 0 || evt.detail > 0) {
          // 手指向下
          this.zoom(false, coord)
        }
      },

      move (offset) {
        if (!offset) return
        this.imgData.startX += offset.x
        this.imgData.startY += offset.y
        let stopit = false
        if (this.noWhiteSpace) {
          if (this.imgData.startX > 0 || this.canvasWidth - this.imgData.startX > this.imgData.width) {
            this.imgData.startX -= offset.x
            stopit = true
          }
          if (this.imgData.startY > 0 || this.canvasHeight - this.imgData.startY > this.imgData.height) {
            this.imgData.startY -= offset.y
            stopit = true
          }
        }
        if (stopit) return
        this.draw()
      },

      zoom (zoomIn, pos) {
        let speed = (this.canvasWidth / 100000) * this.zoomSpeed
        let x = 1
        if (zoomIn) {
          x = 1 + speed
        } else if (this.imgData.width > 20) {
          x = 1 - speed
        }
        this.imgData.width = this.imgData.width * x
        this.imgData.height = this.imgData.height * x
        let offsetX = (x - 1) * (pos.x - this.imgData.startX)
        let offsetY = (x - 1) * (pos.y - this.imgData.startY)
        this.imgData.startX = this.imgData.startX - offsetX
        this.imgData.startY = this.imgData.startY - offsetY

        if (this.noWhiteSpace) {
          if (this.imgData.width < this.canvasWidth) {
            let _x = this.canvasWidth / this.imgData.width
            this.imgData.width = this.canvasWidth
            this.imgData.height = this.imgData.height * _x
            this.imgData.startX = this.imgData.startY = 0
          }

          if (this.imgData.height < this.canvasHeight) {
            let _x = this.canvasHeight / this.imgData.height
            this.imgData.width = this.canvasHeight
            this.imgData.height = this.imgData.height * _x
            this.imgData.startX = this.imgData.startY = 0
          }
        }
        this.draw()
      },

      draw () {
        let ctx = this.ctx
        if (!this.img) return
        let { startX, startY, width, height } = this.imgData
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        ctx.drawImage(this.img, startX, startY, width, height)
      },

      generateDataUrl () {
        if (!this.img) return ''
        return this.canvas.toDataURL()
      }
    }
  }
</script>

<style lang="stylus">
  .croppa-container 
    display: inline-block
    cursor: pointer
    transition: opacity .3s
    position: relative
    &:hover
      opacity: .7
    &.croppa--has-target
      cursor: move
      // cursor: -moz-grab
      &:hover
        opacity: 1
    svg.icon-remove
      position: absolute
      background: white
      border-radius: 50%
      box-shadow: -2px 2px 6px grey
      z-index: 10
      cursor: pointer
  .image
    max-width: 100%
    max-height: 100%

</style>
