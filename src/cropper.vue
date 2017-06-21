<template>
  <div :class="`croppa-container ${img ? 'croppa--has-target' : ''} ${disabled ? 'croppa--disabled' : ''} ${disableClickToChoose ? 'croppa--disabled-cc' : ''} ${disableDragToMove && disableScrollToZoom ? 'croppa--disabled-mz' : ''}`">
    <input type="file"
           :accept="accept"
           :disabled="disabled"
           ref="fileInput"
           hidden
           @change="handleInputChange" />
    <div class="initial"
         style="width: 0; height: 0; visibility: hidden;">
      <slot name="initial"></slot>
    </div>
    <canvas ref="canvas"
            @click="!disabled && chooseFile()"
            @touchstart.stop.prevent="handlePointerStart"
            @mousedown.stop.prevent="handlePointerStart"
            @pointerstart.stop.prevent="handlePointerStart"
            @touchend.stop.prevent="handlePointerEnd"
            @touchcancel.stop.prevent="handlePointerEnd"
            @mouseup.stop.prevent="handlePointerEnd"
            @pointerend.stop.prevent="handlePointerEnd"
            @pointercancel.stop.prevent="handlePointerEnd"
            @touchmove.stop.prevent="handlePointerMove"
            @mousemove.stop.prevent="handlePointerMove"
            @pointermove.stop.prevent="handlePointerMove"
            @DOMMouseScroll.stop.prevent="handleWheel"
            @mousewheel.stop.prevent="handleWheel"></canvas>
    <svg class="icon icon-remove"
         v-if="showRemoveButton && img"
         @click="unset"
         :style="`top: -${height/40}px; right: -${width/40}px`"
         viewBox="0 0 1024 1024"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         :width="removeButtonSize || width/10"
         :height="removeButtonSize || width/10">
      <path d="M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z"
            :fill="removeButtonColor"></path>
    </svg>
  </div>
</template>

<script>
  import u from './util'
  import props from './props'

  const INIT_EVENT = 'init'
  const FILE_CHOOSE_EVENT = 'file-choose'
  const FILE_SIZE_EXCEED_EVENT = 'file-size-exceed'
  const MOVE_EVENT = 'move'
  const ZOOM_EVENT = 'zoom'
  const INITIAL_IMAGE_LOAD = 'initial-image-load'
  const INITIAL_IMAGE_ERROR = 'initial-image-error'

  export default {
    model: {
      prop: 'value',
      event: 'init'
    },

    props: props,

    data () {
      return {
        instance: null,
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
      realWidth () {
        return this.width * this.quality
      },

      realHeight () {
        return this.height * this.quality
      },

      realPlaceholderFontSize () {
        return this.placeholderFontSize * this.quality
      }
    },

    mounted () {
      this.init()
    },

    watch: {
      value: function (val) {
        this.instance = val
      },
      realWidth: 'init',
      realHeight: 'init',
      canvasColor: 'init',
      placeholder: 'init',
      placeholderColor: 'init',
      realPlaceholderFontSize: 'init',
      preventWhiteSpace: 'imgContentInit'
    },

    methods: {
      init () {
        this.canvas = this.$refs.canvas
        this.canvas.width = this.realWidth
        this.canvas.height = this.realHeight
        this.canvas.style.width = this.width + 'px'
        this.canvas.style.height = this.height + 'px'
        this.canvas.style.backgroundColor = (!this.canvasColor || this.canvasColor == 'default') ? '#e6e6e6' : (typeof this.canvasColor === 'string' ? this.canvasColor : '')
        this.ctx = this.canvas.getContext('2d')
        if (this.$slots.initial && this.$slots.initial[0]) {
          this.setInitial()
        } else {
          this.unset()
        }
        this.$emit(INIT_EVENT, {
          getCanvas: () => this.canvas,
          getContext: () => this.ctx,
          getChosenFile: () => this.$refs.fileInput.files[0],
          getActualImageSize: () => ({
            width: this.realWidth,
            height: this.realHeight
          }),
          moveUpwards: (amount) => {
            this.move({ x: 0, y: -amount })
          },
          moveDownwards: (amount) => {
            this.move({ x: 0, y: amount })
          },
          moveLeftwards: (amount) => {
            this.move({ x: -amount, y: 0 })
          },
          moveRightwards: (amount) => {
            this.move({ x: amount, y: 0 })
          },
          zoomIn: () => {
            this.zoom(true, {
              x: this.imgData.startX + this.imgData.width / 2,
              y: this.imgData.startY + this.imgData.height / 2
            })
          },
          zoomOut: () => {
            this.zoom(false, {
              x: this.imgData.startX + this.imgData.width / 2,
              y: this.imgData.startY + this.imgData.height / 2
            })
          },
          refresh: () => {
            this.$nextTick(this.init)
          },
          reset: this.unset,
          chooseFile: this.chooseFile,
          generateDataUrl: this.generateDataUrl,
          generateBlob: this.generateBlob,
          promisedBlob: this.promisedBlob
        })
      },

      unset () {
        let ctx = this.ctx
        ctx.clearRect(0, 0, this.realWidth, this.realHeight)
        this.paintBackground()
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        let defaultFontSize = this.realWidth / 1.5 / this.placeholder.length
        let fontSize = (!this.realPlaceholderFontSize || this.realPlaceholderFontSize == 0) ? defaultFontSize : this.realPlaceholderFontSize
        ctx.font = fontSize + 'px sans-serif'
        ctx.fillStyle = (!this.placeholderColor || this.placeholderColor == 'default') ? '#606060' : this.placeholderColor
        ctx.fillText(this.placeholder, this.realWidth / 2, this.realHeight / 2)
        this.img = null
        this.$refs.fileInput.value = ''
        this.imgData = {}
      },

      setInitial () {
        let vNode = this.$slots.initial[0]
        let { tag, elm } = vNode
        if (tag !== 'img' || !elm || !elm.src) {
          this.unset()
          return
        }
        if (u.imageLoaded(elm)) {
          this.img = elm
          this.imgContentInit()
        } else {
          elm.onload = () => {
            this.$emit(INITIAL_IMAGE_LOAD)
            this.img = elm
            this.imgContentInit()
          }

          elm.onerror = () => {
            this.$emit(INITIAL_IMAGE_ERROR)
            this.unset()
          }
        }
      },

      chooseFile () {
        if (this.img || this.disableClickToChoose) return
        this.$refs.fileInput.click()
      },

      handleInputChange () {
        let input = this.$refs.fileInput
        if (!input.files.length) return

        let file = input.files[0]
        this.$emit(FILE_CHOOSE_EVENT, file)
        if (!this.fileSizeIsValid(file)) {
          this.$emit(FILE_SIZE_EXCEED_EVENT, file)
          throw new Error('File size exceeds limit which is ' + this.fileSizeLimit + ' bytes.')
        }
        let fr = new FileReader()
        fr.onload = (e) => {
          let fileData = e.target.result
          let img = new Image()
          img.src = fileData
          img.onload = () => {
            this.img = img
            this.imgContentInit()
          }
        }
        fr.readAsDataURL(file)
      },

      fileSizeIsValid (file) {
        if (!file) return false
        if (!this.fileSizeLimit || this.fileSizeLimit == 0) return true

        return file.size < this.fileSizeLimit
      },

      imgContentInit () {
        this.imgData.startX = 0
        this.imgData.startY = 0
        let imgWidth = this.img.naturalWidth
        let imgHeight = this.img.naturalHeight
        let imgRatio = imgHeight / imgWidth
        let canvasRatio = this.realHeight / this.realWidth

        // display as fit
        if (imgRatio < canvasRatio) {
          let ratio = imgHeight / this.realHeight
          this.imgData.width = imgWidth / ratio
          this.imgData.startX = -(this.imgData.width - this.realWidth) / 2
          this.imgData.height = this.realHeight
        } else {
          let ratio = imgWidth / this.realWidth
          this.imgData.height = imgHeight / ratio
          this.imgData.startY = -(this.imgData.height - this.realHeight) / 2
          this.imgData.width = this.realWidth
        }

        this.draw()
      },

      handlePointerStart (evt) {
        if (this.disabled) return
        if (evt.which && evt.which > 1) return
        this.dragging = true

        if (document) {
          let cancelEvents = ['mouseup', 'touchend', 'touchcancel', 'pointerend', 'pointercancel']
          for (let e of cancelEvents) {
            document.addEventListener(e, this.handlePointerEnd)
          }
        }
      },

      handlePointerEnd (evt) {
        if (this.disabled) return
        this.dragging = false
        this.lastMovingCoord = null
      },

      handlePointerMove (evt) {
        if (this.disabled || this.disableDragToMove) return
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
        if (this.disabled || this.disableScrollToZoom) return
        let coord = u.getPointerCoords(evt, this)
        if (evt.wheelDelta < 0 || evt.detail < 0) {
          // 手指向上
          this.zoom(this.reverseZoomingGesture, coord)
        } else if (evt.wheelDelta > 0 || evt.detail > 0) {
          // 手指向下
          this.zoom(!this.reverseZoomingGesture, coord)
        }
      },

      move (offset) {
        if (!offset) return
        this.imgData.startX += offset.x
        this.imgData.startY += offset.y
        if (this.preventWhiteSpace) {
          this.preventMovingToWhiteSpace()
        }
        this.$emit(MOVE_EVENT)
        this.draw()
      },

      preventMovingToWhiteSpace () {
        if (this.imgData.startX > 0) {
          this.imgData.startX = 0
        }
        if (this.imgData.startY > 0) {
          this.imgData.startY = 0
        }
        if (this.realWidth - this.imgData.startX > this.imgData.width) {
          this.imgData.startX = -(this.imgData.width - this.realWidth)
        }
        if (this.realHeight - this.imgData.startY > this.imgData.height) {
          this.imgData.startY = -(this.imgData.height - this.realHeight)
        }
      },

      zoom (zoomIn, pos) {
        let speed = (this.realWidth / 100000) * this.zoomSpeed
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

        if (this.preventWhiteSpace) {
          if (this.imgData.width < this.realWidth) {
            let _x = this.realWidth / this.imgData.width
            this.imgData.width = this.realWidth
            this.imgData.height = this.imgData.height * _x
          }

          if (this.imgData.height < this.realHeight) {
            let _x = this.realHeight / this.imgData.height
            this.imgData.height = this.realHeight
            this.imgData.width = this.imgData.width * _x
          }
          this.preventMovingToWhiteSpace()
        }
        this.$emit(ZOOM_EVENT)
        this.draw()
      },

      paintBackground () {
        let backgroundColor = (!this.canvasColor || this.canvasColor == 'default') ? '#e6e6e6' : this.canvasColor
        this.ctx.fillStyle = backgroundColor
        this.ctx.fillRect(0, 0, this.realWidth, this.realHeight)
      },

      draw () {
        let ctx = this.ctx
        if (!this.img) return
        let { startX, startY, width, height } = this.imgData
        ctx.clearRect(0, 0, this.realWidth, this.realHeight)
        this.paintBackground()
        ctx.drawImage(this.img, startX, startY, width, height)
      },

      generateDataUrl (type) {
        if (!this.img) return ''
        return this.canvas.toDataURL(type)
      },

      generateBlob (callback, mimeType, qualityArgument) {
        if (!this.img) return null
        this.canvas.toBlob(callback, mimeType, qualityArgument)
      },

      promisedBlob (...args) {
        return new Promise((resolve, reject) => {
          try {
            this.generateBlob((blob) => {
              resolve(blob)
            }, args)
          } catch (err) {
            reject(err)
          }
        })
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
    &.croppa--disabled-cc 
      cursor: default
      &:hover
        opacity: 1
    &.croppa--has-target
      cursor: move
      &:hover
        opacity: 1
      &.croppa--disabled-mz
        cursor: default
    &.croppa--disabled
      cursor: not-allowed
      &:hover
        opacity: 1
    svg.icon-remove
      position: absolute
      background: white
      border-radius: 50%
      box-shadow: -2px 2px 6px rgba(0, 0, 0, 0.7)
      z-index: 10
      cursor: pointer
      border: 2px solid white
  .image
    max-width: 100%
    max-height: 100%

</style>
