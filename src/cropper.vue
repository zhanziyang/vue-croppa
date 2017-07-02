<template>
  <div :class="`croppa-container ${img ? 'croppa--has-target' : ''} ${disabled ? 'croppa--disabled' : ''} ${disableClickToChoose ? 'croppa--disabled-cc' : ''} ${disableDragToMove && disableScrollToZoom ? 'croppa--disabled-mz' : ''} ${fileDraggedOver ? 'croppa--dropzone' : ''}`"
       @dragenter.stop.prevent="handleDragEnter"
       @dragleave.stop.prevent="handleDragLeave"
       @dragover.stop.prevent="handleDragOver"
       @drop.stop.prevent="handleDrop">
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
            @click.stop.prevent="handleClick"
            @touchstart.stop="handlePointerStart"
            @mousedown.stop.prevent="handlePointerStart"
            @pointerstart.stop.prevent="handlePointerStart"
            @touchend.stop.prevent="handlePointerEnd"
            @touchcancel.stop.prevent="handlePointerEnd"
            @mouseup.stop.prevent="handlePointerEnd"
            @pointerend.stop.prevent="handlePointerEnd"
            @pointercancel.stop.prevent="handlePointerEnd"
            @touchmove.stop="handlePointerMove"
            @mousemove.stop.prevent="handlePointerMove"
            @pointermove.stop.prevent="handlePointerMove"
            @DOMMouseScroll.stop="handleWheel"
            @wheel.stop="handleWheel"
            @mousewheel.stop="handleWheel"></canvas>
    <svg class="icon icon-remove"
         v-if="showRemoveButton && img"
         @click="remove"
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
  import events from './events'

  const PCT_PER_ZOOM = 1 / 100000 // The amount of zooming everytime it happens, in percentage of image width.
  const MIN_MS_PER_CLICK = 500 // If touch duration is shorter than the value, then it is considered as a click.
  const CLICK_MOVE_THRESHOLD = 100 // If touch move distance is greater than this value, then it will by no mean be considered as a click.
  const MIN_WIDTH = 10 // The minimal width the user can zoom to.
  const DEFAULT_PLACEHOLDER_TAKEUP = 2 / 3 // Placeholder text by default takes up this amount of times of canvas width.
  const PINCH_ACCELERATION = 2 // The amount of times by which the pinching is more sensitive than the scolling
  const DEBUG = false

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
        dataUrl: '',
        fileDraggedOver: false,
        tabStart: 0,
        pinching: false,
        pinchDistance: 0,
        supportTouch: false,
        pointerMoved: false,
        pointerStartCoord: null
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
      u.rAFPolyfill()

      this.init()

      if (this.$options._parentListeners['initial-image-load'] || this.$options._parentListeners['initial-image-error']) {
        console.warn('initial-image-load and initial-image-error events are already deprecated. Please bind them directly on the <img> tag (the slot).')
      }
      let supports = this.supportDetection()
      if (!supports.basic) {
        console.warn('Your browser does not support vue-croppa functionality.')
      }
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
          this.remove()
        }
        this.$emit(events.INIT_EVENT, {
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
            this.zoom(true)
          },
          zoomOut: () => {
            this.zoom(false)
          },
          refresh: () => {
            this.$nextTick(this.init)
          },
          hasImage: () => {
            return !!this.img
          },
          reset: this.remove, // soon to be deprecated due to misnamed
          remove: this.remove,
          chooseFile: this.chooseFile,
          generateDataUrl: this.generateDataUrl,
          generateBlob: this.generateBlob,
          promisedBlob: this.promisedBlob,
          supportDetection: this.supportDetection
        })
      },

      supportDetection () {
        var div = document.createElement('div')
        return {
          'basic': window.File && window.FileReader && window.FileList && window.Blob,
          'dnd': 'ondragstart' in div && 'ondrop' in div
        }
      },

      remove () {
        let ctx = this.ctx
        this.paintBackground()
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        let defaultFontSize = this.realWidth * DEFAULT_PLACEHOLDER_TAKEUP / this.placeholder.length
        let fontSize = (!this.realPlaceholderFontSize || this.realPlaceholderFontSize == 0) ? defaultFontSize : this.realPlaceholderFontSize
        ctx.font = fontSize + 'px sans-serif'
        ctx.fillStyle = (!this.placeholderColor || this.placeholderColor == 'default') ? '#606060' : this.placeholderColor
        ctx.fillText(this.placeholder, this.realWidth / 2, this.realHeight / 2)

        let hadImage = this.img != null
        this.img = null
        this.$refs.fileInput.value = ''
        this.imgData = {}

        if (hadImage) {
          this.$emit(events.IMAGE_REMOVE_EVENT)
        }
      },

      setInitial () {
        let vNode = this.$slots.initial[0]
        let { tag, elm } = vNode
        if (tag !== 'img' || !elm || !elm.src) {
          this.remove()
          return
        }
        if (u.imageLoaded(elm)) {
          this.img = elm
          this.imgContentInit()
        } else {
          elm.onload = () => {
            this.img = elm
            this.imgContentInit()
          }

          elm.onerror = () => {
            this.remove()
          }
        }
      },

      chooseFile () {
        this.$refs.fileInput.click()
      },

      handleClick () {
        if (DEBUG) {
          console.log('click')
        }
        if (!this.img && !this.disableClickToChoose && !this.disabled && !this.supportTouch) {
          this.chooseFile()
          if (DEBUG) {
            console.log('trigger by click')
          }
        }
      },

      handleInputChange () {
        let input = this.$refs.fileInput
        if (!input.files.length) return

        let file = input.files[0]
        this.onNewFileIn(file)
      },

      onNewFileIn (file) {
        this.$emit(events.FILE_CHOOSE_EVENT, file)
        if (!this.fileSizeIsValid(file)) {
          this.$emit(events.FILE_SIZE_EXCEED_EVENT, file)
          throw new Error('File size exceeds limit which is ' + this.fileSizeLimit + ' bytes.')
        }
        if (!this.fileTypeIsValid(file)) {
          this.$emit(events.FILE_TYPE_MISMATCH_EVENT, file)
          throw new Error(`File type (${file.type}) does not match what you specified (${this.accept}).`)
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

      fileTypeIsValid (file) {
        let accept = this.accept || 'image/*'
        let baseMimetype = accept.replace(/\/.*$/, '')
        let types = accept.split(',')
        for (let type of types) {
          let t = type.trim()
          if (t.charAt(0) == '.') {
            if (file.name.toLowerCase().split('.').pop() === t.toLowerCase().slice(1)) return true
          } else if (/\/\*$/.test(t)) {
            var fileBaseType = file.type.replace(/\/.*$/, '')
            if (fileBaseType === baseMimetype) {
              return true
            }
          } else if (file.type === type) {
            return true
          }
        }

        return false
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
        if (DEBUG) {
          console.log('touch start')
        }
        this.supportTouch = true
        this.pointerMoved = false
        let pointerCoord = u.getPointerCoords(evt, this)
        this.pointerStartCoord = pointerCoord

        if (this.disabled) return
        // simulate click with touch on mobile devices
        if (!this.img && !this.disableClickToChoose) {
          this.tabStart = new Date().valueOf()
          return
        }
        // ignore mouse right click and middle click
        if (evt.which && evt.which > 1) return

        if (!evt.touches || evt.touches.length === 1) {
          this.dragging = true
          this.pinching = false
          let coord = u.getPointerCoords(evt, this)
          this.lastMovingCoord = coord
        }

        if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
          this.dragging = false
          this.pinching = true
          this.pinchDistance = u.getPinchDistance(evt, this)
        }

        let cancelEvents = ['mouseup', 'touchend', 'touchcancel', 'pointerend', 'pointercancel']
        for (let e of cancelEvents) {
          document.addEventListener(e, this.handlePointerEnd)
        }
      },

      handlePointerEnd (evt) {
        if (DEBUG) {
          console.log('touch end')
        }
        let pointerMoveDistance = 0
        if (this.pointerStartCoord) {
          let pointerCoord = u.getPointerCoords(evt, this)
          pointerMoveDistance = Math.sqrt(Math.pow(pointerCoord.x - this.pointerStartCoord.x, 2) + Math.pow(pointerCoord.y - this.pointerStartCoord.y, 2)) || 0
        }
        if (this.disabled) return
        if (!this.img && !this.disableClickToChoose) {
          let tabEnd = new Date().valueOf()
          if ((pointerMoveDistance < CLICK_MOVE_THRESHOLD) && tabEnd - this.tabStart < MIN_MS_PER_CLICK && this.supportTouch) {
            this.chooseFile()
            if (DEBUG) {
              console.log('trigger by touch')
            }
          }
          this.tabStart = 0
          return
        }

        this.dragging = false
        this.pinching = false
        this.pinchDistance = 0
        this.lastMovingCoord = null
        this.pointerMoved = false
        this.pointerStartCoord = null
      },

      handlePointerMove (evt) {
        this.pointerMoved = true

        if (this.disabled || this.disableDragToMove || !this.img) return

        evt.preventDefault()
        if (!evt.touches || evt.touches.length === 1) {
          if (!this.dragging) return
          let coord = u.getPointerCoords(evt, this)
          if (this.lastMovingCoord) {
            this.move({
              x: coord.x - this.lastMovingCoord.x,
              y: coord.y - this.lastMovingCoord.y
            })
          }
          this.lastMovingCoord = coord
        }

        if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
          if (!this.pinching) return
          let distance = u.getPinchDistance(evt, this)
          let delta = distance - this.pinchDistance
          this.zoom(delta > 0, null, PINCH_ACCELERATION)
          this.pinchDistance = distance
        }
      },

      handleWheel (evt) {
        if (this.disabled || this.disableScrollToZoom || !this.img) return
        evt.preventDefault()
        let coord = u.getPointerCoords(evt, this)
        if (evt.wheelDelta < 0 || evt.deltaY > 0 || evt.detail > 0) {
          this.zoom(this.reverseZoomingGesture || this.reverseScrollToZoom, coord)
        } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
          this.zoom(!this.reverseZoomingGesture && !this.reverseScrollToZoom, coord)
        }
      },

      handleDragEnter (evt) {
        if (this.disabled || this.disableDragAndDrop || this.img) return
        this.fileDraggedOver = true
      },

      handleDragLeave (evt) {
        if (!this.fileDraggedOver) return
        this.fileDraggedOver = false
      },

      handleDragOver (evt) {
      },

      handleDrop (evt) {
        if (!this.fileDraggedOver) return
        this.fileDraggedOver = false

        let file
        let dt = evt.dataTransfer
        if (!dt) return
        if (dt.items) {
          for (var i = 0, len = dt.items.length; i < len; i++) {
            let item = dt.items[i]
            if (item.kind == 'file') {
              file = item.getAsFile()
              break
            }
          }
        } else {
          file = dt.files[0]
        }

        if (file) {
          this.onNewFileIn(file)
        }
      },

      move (offset) {
        if (!offset) return
        let oldX = this.imgData.startX
        let oldY = this.imgData.startY
        this.imgData.startX += offset.x
        this.imgData.startY += offset.y
        if (this.preventWhiteSpace) {
          this.preventMovingToWhiteSpace()
        }
        if (this.imgData.startX !== oldX || this.imgData.startY !== oldY) {
          this.$emit(events.MOVE_EVENT)
          this.draw()
        }
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

      zoom (zoomIn, pos, innerAcceleration = 1) {
        pos = pos || {
          x: this.imgData.startX + this.imgData.width / 2,
          y: this.imgData.startY + this.imgData.height / 2
        }
        let realSpeed = this.zoomSpeed * innerAcceleration
        let speed = (this.realWidth * PCT_PER_ZOOM) * realSpeed
        let x = 1
        if (zoomIn) {
          x = 1 + speed
        } else if (this.imgData.width > MIN_WIDTH) {
          x = 1 - speed
        }

        let oldWidth = this.imgData.width
        let oldHeight = this.imgData.height

        this.imgData.width = this.imgData.width * x
        this.imgData.height = this.imgData.height * x

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
        }
        if (oldWidth.toFixed(2) !== this.imgData.width.toFixed(2) || oldHeight.toFixed(2) !== this.imgData.height.toFixed(2)) {
          let offsetX = (x - 1) * (pos.x - this.imgData.startX)
          let offsetY = (x - 1) * (pos.y - this.imgData.startY)
          this.imgData.startX = this.imgData.startX - offsetX
          this.imgData.startY = this.imgData.startY - offsetY

          if (this.preventWhiteSpace) {
            this.preventMovingToWhiteSpace()
          }
          this.$emit(events.ZOOM_EVENT)
          this.draw()
        }
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
        requestAnimationFrame(() => {
          this.paintBackground()
          ctx.drawImage(this.img, startX, startY, width, height)
        })
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
    transition: all .3s
    position: relative
    font-size: 0
    canvas
      transition: all .3s
    &:hover
      opacity: .7
    &.croppa--dropzone
      box-shadow: inset 0 0 10px lightness(black, 20%)
      canvas
        opacity: .5
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
      filter: drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.7))
      z-index: 10
      cursor: pointer
      border: 2px solid white

</style>
