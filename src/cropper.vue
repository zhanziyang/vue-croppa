<template>
  <div :class="`croppa-container ${hasTarget ? 'croppa--has-target' : ''}`">
    <input type="file"
           accept="image/*"
           ref="fileInput"
           hidden
           @change="handleInputChange" />
    <canvas :width="canvasWidth"
            :height="canvasHeight"
            ref="canvas"
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
      }
    },

    data () {
      return {
        canvas: null,
        ctx: null,
        img: null,
        hasTarget: false,
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

    methods: {
      init () {
        this.canvas = this.$refs.canvas
        this.canvas.style.backgroundColor = this.canvasColor || '#e6e6e6'
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
        ctx.font = (this.canvasWidth / 2 / this.placeholder.length) + 'px sans-serif'
        ctx.fillStyle = this.placeholderColor || '#606060'
        ctx.fillText(this.placeholder, this.canvasWidth / 2, this.canvasHeight / 2)
        this.hasTarget = false
      },

      selectFile () {
        if (this.hasTarget) return
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
            this.imgData.startX = 0
            this.imgData.startY = 0
            let imgWidth = img.naturalWidth
            let imgHeight = img.naturalHeight
            if (imgWidth > imgHeight) {
              let ratio = imgHeight / this.canvasHeight
              this.imgData.width = imgWidth / ratio
              this.imgData.height = this.canvasHeight
            } else {
              let ratio = imgWidth / this.canvasWidth
              this.imgData.width = this.canvasWidth
              this.imgData.height = imgHeight / ratio
            }
            this.draw()
          }
        }

        fd.readAsDataURL(file)
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
        this.draw()
      },

      draw () {
        let ctx = this.ctx
        if (!this.imgData || !this.imgData.width) return
        let { startX, startY, width, height } = this.imgData
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        ctx.drawImage(this.img, startX, startY, width, height)
        this.hasTarget = true
      },

      generateDataUrl () {
        if (!this.hasTarget) return ''
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
    &:hover
      opacity: .7
    &.croppa--has-target
      cursor: move
      // cursor: -moz-grab
      &:hover
        opacity: 1
  .image
    max-width: 100%
    max-height: 100%
</style>
