<template>
  <div ref="wrapper"
    :class="`croppa-container ${img ? 'croppa--has-target' : ''} ${passive ? 'croppa--passive' : ''} ${disabled ? 'croppa--disabled' : ''} ${disableClickToChoose ? 'croppa--disabled-cc' : ''} ${disableDragToMove && disableScrollToZoom ? 'croppa--disabled-mz' : ''} ${fileDraggedOver ? 'croppa--dropzone' : ''}`"
    @dragenter.stop.prevent="_handleDragEnter"
    @dragleave.stop.prevent="_handleDragLeave"
    @dragover.stop.prevent="_handleDragOver"
    @drop.stop.prevent="_handleDrop">
    <input type="file"
      :accept="accept"
      :disabled="disabled"
      v-bind="inputAttrs"
      ref="fileInput"
      @change="_handleInputChange"
      style="height:1px;width:1px;overflow:hidden;margin-left:-99999px;position:absolute;" />
    <div class="slots"
      style="width: 0; height: 0; visibility: hidden;">
      <slot name="initial"></slot>
      <slot name="placeholder"></slot>
    </div>
    <canvas ref="canvas"
      @click.stop.prevent="_handleClick"
      @dblclick.stop.prevent="_handleDblClick"
      @touchstart.stop="_handlePointerStart"
      @mousedown.stop.prevent="_handlePointerStart"
      @pointerstart.stop.prevent="_handlePointerStart"
      @touchend.stop.prevent="_handlePointerEnd"
      @touchcancel.stop.prevent="_handlePointerEnd"
      @mouseup.stop.prevent="_handlePointerEnd"
      @pointerend.stop.prevent="_handlePointerEnd"
      @pointercancel.stop.prevent="_handlePointerEnd"
      @touchmove.stop="_handlePointerMove"
      @mousemove.stop.prevent="_handlePointerMove"
      @pointermove.stop.prevent="_handlePointerMove"
      @pointerleave.stop.prevent="_handlePointerLeave"
      @DOMMouseScroll.stop="_handleWheel"
      @wheel.stop="_handleWheel"
      @mousewheel.stop="_handleWheel"></canvas>
    <svg class="icon icon-remove"
      v-if="showRemoveButton && img && !passive"
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
    <div class="sk-fading-circle"
      :style="loadingStyle"
      v-if="showLoading && loading">
      <div :class="`sk-circle${i} sk-circle`"
        v-for="i in 12"
        :key="i">
        <div class="sk-circle-indicator"
          :style="{backgroundColor: loadingColor}"></div>
      </div>
    </div>
    <slot></slot>
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
const PINCH_ACCELERATION = 1 // The amount of times by which the pinching is more sensitive than the scolling

const syncData = ['imgData', 'img', 'imgSet', 'originalImage', 'naturalHeight', 'naturalWidth', 'orientation', 'scaleRatio']
// const DEBUG = false

export default {
  model: {
    prop: 'value',
    event: events.INIT_EVENT
  },

  props: props,

  data () {
    return {
      canvas: null,
      ctx: null,
      originalImage: null,
      img: null,
      video: null,
      dragging: false,
      lastMovingCoord: null,
      imgData: {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0
      },
      fileDraggedOver: false,
      tabStart: 0,
      scrolling: false,
      pinching: false,
      rotating: false,
      pinchDistance: 0,
      supportTouch: false,
      pointerMoved: false,
      pointerStartCoord: null,
      naturalWidth: 0,
      naturalHeight: 0,
      scaleRatio: null,
      orientation: 1,
      userMetadata: null,
      imageSet: false,
      currentPointerCoord: null,
      currentIsInitial: false,
      loading: false,
      realWidth: 0, // only for when autoSizing is on
      realHeight: 0, // only for when autoSizing is on
      chosenFile: null,
      useAutoSizing: false,
    }
  },

  computed: {
    outputWidth () {
      const w = this.useAutoSizing ? this.realWidth : this.width
      return w * this.quality
    },

    outputHeight () {
      const h = this.useAutoSizing ? this.realHeight : this.height
      return h * this.quality
    },

    computedPlaceholderFontSize () {
      return this.placeholderFontSize * this.quality
    },

    aspectRatio () {
      return this.naturalWidth / this.naturalHeight
    },

    loadingStyle () {
      return {
        width: this.loadingSize + 'px',
        height: this.loadingSize + 'px',
        right: '15px',
        bottom: '10px'
      }
    },
  },

  mounted () {
    this._initialize()
    u.rAFPolyfill()
    u.toBlobPolyfill()

    let supports = this.supportDetection()
    if (!supports.basic) {
      console.warn('Your browser does not support vue-croppa functionality.')
    }

    if (this.passive) {
      this.$watch('value._data', (data) => {
        let set = false
        if (!data) return
        for (let key in data) {
          if (syncData.indexOf(key) >= 0) {
            let val = data[key]
            if (val !== this[key]) {
              this.$set(this, key, val)
              set = true
            }
          }
        }
        if (set) {
          if (!this.img) {
            this.remove()
          } else {
            this.$nextTick(() => {
              this._draw()
            })
          }
        }
      }, {
          deep: true
        })
    }

    this.useAutoSizing = !!(this.autoSizing && this.$refs.wrapper && getComputedStyle)
    if (this.useAutoSizing) {
      this._autoSizingInit()
    }
  },

  beforeDestroy () {
    if (this.useAutoSizing) {
      this._autoSizingRemove()
    }
  },

  watch: {
    outputWidth: function () {
      this.onDimensionChange()
    },
    outputHeight: function () {
      this.onDimensionChange()
    },
    canvasColor: function () {
      if (!this.img) {
        this._setPlaceholders()
      } else {
        this._draw()
      }
    },
    imageBorderRadius: function () {
      if (this.img) {
        this._draw()
      }
    },
    placeholder: function () {
      if (!this.img) {
        this._setPlaceholders()
      }
    },
    placeholderColor: function () {
      if (!this.img) {
        this._setPlaceholders()
      }
    },
    computedPlaceholderFontSize: function () {
      if (!this.img) {
        this._setPlaceholders()
      }
    },
    preventWhiteSpace (val) {
      if (val) {
        this.imageSet = false
      }
      this._placeImage()
    },
    scaleRatio (val, oldVal) {
      if (this.passive) return
      if (!this.img) return
      if (!u.numberValid(val)) return

      var x = 1
      if (u.numberValid(oldVal) && oldVal !== 0) {
        x = val / oldVal
      }
      var pos = this.currentPointerCoord || {
        x: this.imgData.startX + this.imgData.width / 2,
        y: this.imgData.startY + this.imgData.height / 2
      }
      this.imgData.width = this.naturalWidth * val
      this.imgData.height = this.naturalHeight * val

      if (!this.userMetadata && this.imageSet && !this.rotating) {
        let offsetX = (x - 1) * (pos.x - this.imgData.startX)
        let offsetY = (x - 1) * (pos.y - this.imgData.startY)
        this.imgData.startX = this.imgData.startX - offsetX
        this.imgData.startY = this.imgData.startY - offsetY
      }

      if (this.preventWhiteSpace) {
        this._preventZoomingToWhiteSpace()
        this._preventMovingToWhiteSpace()
      }
    },
    'imgData.width': function (val, oldVal) {
      // if (this.passive) return
      if (!u.numberValid(val)) return
      this.scaleRatio = val / this.naturalWidth
      if (this.hasImage()) {
        if (Math.abs(val - oldVal) > (val * (1 / 100000))) {
          this.emitEvent(events.ZOOM_EVENT)
          this._draw()
        }
      }
    },
    'imgData.height': function (val) {
      // if (this.passive) return
      if (!u.numberValid(val)) return
      this.scaleRatio = val / this.naturalHeight
    },
    'imgData.startX': function (val) {
      // if (this.passive) return
      if (this.hasImage()) {
        this.$nextTick(this._draw)
      }
    },
    'imgData.startY': function (val) {
      // if (this.passive) return
      if (this.hasImage()) {
        this.$nextTick(this._draw)
      }
    },
    loading (val) {
      if (this.passive) return
      if (val) {
        this.emitEvent(events.LOADING_START_EVENT)
      } else {
        this.emitEvent(events.LOADING_END_EVENT)
      }
    },
    autoSizing (val) {
      this.useAutoSizing = !!(this.autoSizing && this.$refs.wrapper && getComputedStyle)
      if (val) {
        this._autoSizingInit()
      } else {
        this._autoSizingRemove()
      }
    }
  },

  methods: {
    emitEvent (...args) {
      // console.log(args[0])
      this.$emit(...args);
    },

    getCanvas () {
      return this.canvas
    },

    getContext () {
      return this.ctx
    },

    getChosenFile () {
      return this.chosenFile || this.$refs.fileInput.files[0]
    },

    move (offset) {
      if (!offset || this.passive) return
      let oldX = this.imgData.startX
      let oldY = this.imgData.startY
      this.imgData.startX += offset.x
      this.imgData.startY += offset.y
      if (this.preventWhiteSpace) {
        this._preventMovingToWhiteSpace()
      }
      if (this.imgData.startX !== oldX || this.imgData.startY !== oldY) {
        this.emitEvent(events.MOVE_EVENT)
        this._draw()
      }
    },

    moveUpwards (amount = 1) {
      this.move({ x: 0, y: -amount })
    },

    moveDownwards (amount = 1) {
      this.move({ x: 0, y: amount })
    },

    moveLeftwards (amount = 1) {
      this.move({ x: -amount, y: 0 })
    },

    moveRightwards (amount = 1) {
      this.move({ x: amount, y: 0 })
    },

    zoom (zoomIn = true, acceleration = 1) {
      if (this.passive) return
      let realSpeed = this.zoomSpeed * acceleration
      let speed = (this.outputWidth * PCT_PER_ZOOM) * realSpeed
      let x = 1
      if (zoomIn) {
        x = 1 + speed
      } else if (this.imgData.width > MIN_WIDTH) {
        x = 1 - speed
      }

      this.scaleRatio *= x
    },

    zoomIn () {
      this.zoom(true)
    },

    zoomOut () {
      this.zoom(false)
    },

    rotate (step = 1) {
      if (this.disableRotation || this.disabled || this.passive) return
      step = parseInt(step)
      if (isNaN(step) || step > 3 || step < -3) {
        console.warn('Invalid argument for rotate() method. It should one of the integers from -3 to 3.')
        step = 1
      }
      this._rotateByStep(step)
    },

    flipX () {
      if (this.disableRotation || this.disabled || this.passive) return
      this._setOrientation(2)
    },

    flipY () {
      if (this.disableRotation || this.disabled || this.passive) return
      this._setOrientation(4)
    },

    refresh () {
      this.$nextTick(this._initialize)
    },

    hasImage () {
      return !!this.imageSet
    },

    applyMetadata (metadata) {
      if (!metadata || this.passive) return
      this.userMetadata = metadata
      var ori = metadata.orientation || this.orientation || 1
      this._setOrientation(ori, true)
    },
    generateDataUrl (type, compressionRate) {
      if (!this.hasImage()) return ''
      return this.canvas.toDataURL(type, compressionRate)
    },

    generateBlob (callback, mimeType, qualityArgument) {
      if (!this.hasImage()) {
        callback(null)
        return
      }
      this.canvas.toBlob(callback, mimeType, qualityArgument)
    },

    promisedBlob (...args) {
      if (typeof Promise == 'undefined') {
        console.warn('No Promise support. Please add Promise polyfill if you want to use this method.')
        return
      }
      return new Promise((resolve, reject) => {
        try {
          this.generateBlob((blob) => {
            resolve(blob)
          }, ...args)
        } catch (err) {
          reject(err)
        }
      })
    },

    getMetadata () {
      if (!this.hasImage()) return {}
      let { startX, startY } = this.imgData

      return {
        startX,
        startY,
        scale: this.scaleRatio,
        orientation: this.orientation
      }
    },

    supportDetection () {
      if (typeof window === 'undefined') return
      var div = document.createElement('div')
      return {
        'basic': window.requestAnimationFrame && window.File && window.FileReader && window.FileList && window.Blob,
        'dnd': 'ondragstart' in div && 'ondrop' in div
      }
    },

    chooseFile () {
      if (this.passive) return
      this.$refs.fileInput.click()
    },

    remove () {
      if (!this.imageSet) return
      this._setPlaceholders()

      let hadImage = this.img != null
      this.originalImage = null
      this.img = null
      this.$refs.fileInput.value = ''
      this.imgData = {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0
      }
      this.orientation = 1
      this.scaleRatio = null
      this.userMetadata = null
      this.imageSet = false
      this.chosenFile = null
      if (this.video) {
        this.video.pause()
        this.video = null
      }

      if (hadImage) {
        this.emitEvent(events.IMAGE_REMOVE_EVENT)
      }
    },

    addClipPlugin (plugin) {
      if (!this.clipPlugins) {
        this.clipPlugins = []
      }
      if (typeof plugin === 'function' && this.clipPlugins.indexOf(plugin) < 0) {
        this.clipPlugins.push(plugin)
      } else {
        throw Error('Clip plugins should be functions')
      }
    },

    emitNativeEvent (evt) {
      this.emitEvent(evt.type, evt);
    },

    setFile (file) {
      this._onNewFileIn(file)
    },

    _setContainerSize () {
      if (this.useAutoSizing) {
        this.realWidth = +getComputedStyle(this.$refs.wrapper).width.slice(0, -2)
        this.realHeight = +getComputedStyle(this.$refs.wrapper).height.slice(0, -2)
      }
    },

    _autoSizingInit () {
      this._setContainerSize()
      window.addEventListener('resize', this._setContainerSize)
    },

    _autoSizingRemove () {
      this._setContainerSize()
      window.removeEventListener('resize', this._setContainerSize)
    },

    _initialize () {
      this.canvas = this.$refs.canvas
      this._setSize()
      this.canvas.style.backgroundColor = (!this.canvasColor || this.canvasColor == 'default') ? 'transparent' : (typeof this.canvasColor === 'string' ? this.canvasColor : '')
      this.ctx = this.canvas.getContext('2d')
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = "high";
      this.ctx.webkitImageSmoothingEnabled = true;
      this.ctx.msImageSmoothingEnabled = true;
      this.ctx.imageSmoothingEnabled = true;
      this.originalImage = null
      this.img = null
      this.$refs.fileInput.value = ''
      this.imageSet = false
      this.chosenFile = null
      this._setInitial()
      if (!this.passive) {
        this.emitEvent(events.INIT_EVENT, this)
      }
    },

    _setSize () {
      this.canvas.width = this.outputWidth
      this.canvas.height = this.outputHeight
      this.canvas.style.width = (this.useAutoSizing ? this.realWidth : this.width) + 'px'
      this.canvas.style.height = (this.useAutoSizing ? this.realHeight : this.height) + 'px'
    },

    _rotateByStep (step) {
      let orientation = 1
      switch (step) {
        case 1:
          orientation = 6
          break
        case 2:
          orientation = 3
          break
        case 3:
          orientation = 8
          break
        case -1:
          orientation = 8
          break
        case -2:
          orientation = 3
          break
        case -3:
          orientation = 6
          break
      }
      this._setOrientation(orientation)
    },

    _setImagePlaceholder () {
      let img
      if (this.$slots.placeholder && this.$slots.placeholder[0]) {
        let vNode = this.$slots.placeholder[0]
        let { tag, elm } = vNode
        if (tag == 'img' && elm) {
          img = elm
        }
      }

      if (!img) return

      var onLoad = () => {
        this.ctx.drawImage(img, 0, 0, this.outputWidth, this.outputHeight)
      }

      if (u.imageLoaded(img)) {
        onLoad()
      } else {
        img.onload = onLoad
      }
    },

    _setTextPlaceholder () {
      var ctx = this.ctx
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      let defaultFontSize = this.outputWidth * DEFAULT_PLACEHOLDER_TAKEUP / this.placeholder.length
      let fontSize = (!this.computedPlaceholderFontSize || this.computedPlaceholderFontSize == 0) ? defaultFontSize : this.computedPlaceholderFontSize
      ctx.font = fontSize + 'px sans-serif'
      ctx.fillStyle = (!this.placeholderColor || this.placeholderColor == 'default') ? '#606060' : this.placeholderColor
      ctx.fillText(this.placeholder, this.outputWidth / 2, this.outputHeight / 2)
    },

    _setPlaceholders () {
      this._paintBackground()
      this._setImagePlaceholder()
      this._setTextPlaceholder()
    },

    _setInitial () {
      let src, img
      if (this.$slots.initial && this.$slots.initial[0]) {
        let vNode = this.$slots.initial[0]
        let { tag, elm } = vNode
        if (tag == 'img' && elm) {
          img = elm
        }
      }
      if (this.initialImage && typeof this.initialImage === 'string') {
        src = this.initialImage
        img = new Image()
        if (!/^data:/.test(src) && !/^blob:/.test(src)) {
          img.setAttribute('crossOrigin', 'anonymous')
        }
        img.src = src
      } else if (typeof this.initialImage === 'object' && this.initialImage instanceof Image) {
        img = this.initialImage
      }
      if (!src && !img) {
        this._setPlaceholders()
        return
      }
      this.currentIsInitial = true
      if (u.imageLoaded(img)) {
        // this.emitEvent(events.INITIAL_IMAGE_LOADED_EVENT)
        this._onload(img, +img.dataset['exifOrientation'], true)
      } else {
        this.loading = true
        img.onload = () => {
          // this.emitEvent(events.INITIAL_IMAGE_LOADED_EVENT)
          this._onload(img, +img.dataset['exifOrientation'], true)
        }

        img.onerror = () => {
          this._setPlaceholders()
        }
      }
    },

    _onload (img, orientation = 1, initial) {
      if (this.imageSet) {
        this.remove()
      }
      this.originalImage = img
      this.img = img

      if (isNaN(orientation)) {
        orientation = 1
      }

      this._setOrientation(orientation)

      if (initial) {
        this.emitEvent(events.INITIAL_IMAGE_LOADED_EVENT)
      }
    },

    _onVideoLoad (video, initial) {
      this.video = video
      const canvas = document.createElement('canvas')
      const { videoWidth, videoHeight } = video
      canvas.width = videoWidth
      canvas.height = videoHeight
      const ctx = canvas.getContext('2d')
      this.loading = false
      const drawFrame = (initial) => {
        if (!this.video) return
        ctx.drawImage(this.video, 0, 0, videoWidth, videoHeight)
        const frame = new Image()
        frame.src = canvas.toDataURL()
        frame.onload = () => {
          this.img = frame
          // this._placeImage()
          if (initial) {
            this._placeImage()
          } else {
            this._draw()
          }
        }
      }
      drawFrame(true)
      const keepDrawing = () => {
        this.$nextTick(() => {
          drawFrame()
          if (!this.video || this.video.ended || this.video.paused) return
          requestAnimationFrame(keepDrawing)
        })
      }
      this.video.addEventListener('play', () => {
        requestAnimationFrame(keepDrawing)
      })
    },

    _handleClick (evt) {
      this.emitNativeEvent(evt)
      if (!this.hasImage() && !this.disableClickToChoose && !this.disabled && !this.supportTouch && !this.passive) {
        this.chooseFile()
      }
    },

    _handleDblClick (evt) {
      this.emitNativeEvent(evt)
      if (this.videoEnabled && this.video) {
        if (this.video.paused || this.video.ended) {
          this.video.play()
        } else {
          this.video.pause()
        }
        return
      }
    },

    _handleInputChange () {
      let input = this.$refs.fileInput
      if (!input.files.length || this.passive) return

      let file = input.files[0]
      this._onNewFileIn(file)
    },

    _onNewFileIn (file) {
      this.currentIsInitial = false
      this.loading = true
      this.emitEvent(events.FILE_CHOOSE_EVENT, file)
      this.chosenFile = file;
      if (!this._fileSizeIsValid(file)) {
        this.loading = false
        this.emitEvent(events.FILE_SIZE_EXCEED_EVENT, file)
        return false
      }
      if (!this._fileTypeIsValid(file)) {
        this.loading = false
        this.emitEvent(events.FILE_TYPE_MISMATCH_EVENT, file)
        let type = file.type || file.name.toLowerCase().split('.').pop()
        return false
      }

      if (typeof window !== 'undefined' && typeof window.FileReader !== 'undefined') {
        let fr = new FileReader()
        fr.onload = (e) => {
          let fileData = e.target.result
          const base64 = u.parseDataUrl(fileData)
          const isVideo = /^video/.test(file.type)
          if (isVideo) {
            let video = document.createElement('video')
            video.src = fileData
            fileData = null;
            if (video.readyState >= video.HAVE_FUTURE_DATA) {
              this._onVideoLoad(video)
            } else {
              video.addEventListener('canplay', () => {
                console.log('can play event')
                this._onVideoLoad(video)
              }, false);
            }
          } else {
            let orientation = 1
            try {
              orientation = u.getFileOrientation(u.base64ToArrayBuffer(base64))
            } catch (err) { }
            if (orientation < 1) orientation = 1
            let img = new Image()
            img.src = fileData
            fileData = null;
            img.onload = () => {
              this._onload(img, orientation)
              this.emitEvent(events.NEW_IMAGE_EVENT)
            }
          }
        }
        fr.readAsDataURL(file)
      }
    },

    _fileSizeIsValid (file) {
      if (!file) return false
      if (!this.fileSizeLimit || this.fileSizeLimit == 0) return true

      return file.size < this.fileSizeLimit
    },

    _fileTypeIsValid (file) {
      const acceptableMimeType = (this.videoEnabled && /^video/.test(file.type) && document.createElement('video').canPlayType(file.type)) || /^image/.test(file.type)
      if (!acceptableMimeType) return false
      if (!this.accept) return true
      let accept = this.accept
      let baseMimetype = accept.replace(/\/.*$/, '')
      let types = accept.split(',')
      for (let i = 0, len = types.length; i < len; i++) {
        let type = types[i]
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

    _placeImage (applyMetadata) {
      if (!this.img) return
      var imgData = this.imgData

      this.naturalWidth = this.img.naturalWidth
      this.naturalHeight = this.img.naturalHeight

      imgData.startX = u.numberValid(imgData.startX) ? imgData.startX : 0
      imgData.startY = u.numberValid(imgData.startY) ? imgData.startY : 0

      if (this.preventWhiteSpace) {
        this._aspectFill()
      } else if (!this.imageSet) {
        if (this.initialSize == 'contain') {
          this._aspectFit()
        } else if (this.initialSize == 'natural') {
          this._naturalSize()
        } else {
          this._aspectFill()
        }
      } else {
        this.imgData.width = this.naturalWidth * this.scaleRatio
        this.imgData.height = this.naturalHeight * this.scaleRatio
      }

      if (!this.imageSet) {
        if (/top/.test(this.initialPosition)) {
          imgData.startY = 0
        } else if (/bottom/.test(this.initialPosition)) {
          imgData.startY = this.outputHeight - imgData.height
        }

        if (/left/.test(this.initialPosition)) {
          imgData.startX = 0
        } else if (/right/.test(this.initialPosition)) {
          imgData.startX = this.outputWidth - imgData.width
        }

        if (/^-?\d+% -?\d+%$/.test(this.initialPosition)) {
          var result = /^(-?\d+)% (-?\d+)%$/.exec(this.initialPosition)
          var x = +result[1] / 100
          var y = +result[2] / 100
          imgData.startX = x * (this.outputWidth - imgData.width)
          imgData.startY = y * (this.outputHeight - imgData.height)
        }
      }

      applyMetadata && this._applyMetadata()

      if (applyMetadata && this.preventWhiteSpace) {
        this.zoom(false, 0)
      } else {
        this.move({ x: 0, y: 0 })
        this._draw()
      }
    },

    _aspectFill () {
      let imgWidth = this.naturalWidth
      let imgHeight = this.naturalHeight
      let canvasRatio = this.outputWidth / this.outputHeight
      let scaleRatio

      if (this.aspectRatio > canvasRatio) {
        scaleRatio = imgHeight / this.outputHeight
        this.imgData.width = imgWidth / scaleRatio
        this.imgData.height = this.outputHeight
        this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2
        this.imgData.startY = 0
      } else {
        scaleRatio = imgWidth / this.outputWidth
        this.imgData.height = imgHeight / scaleRatio
        this.imgData.width = this.outputWidth
        this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2
        this.imgData.startX = 0
      }
    },

    _aspectFit () {
      let imgWidth = this.naturalWidth
      let imgHeight = this.naturalHeight
      let canvasRatio = this.outputWidth / this.outputHeight
      let scaleRatio
      if (this.aspectRatio > canvasRatio) {
        scaleRatio = imgWidth / this.outputWidth
        this.imgData.height = imgHeight / scaleRatio
        this.imgData.width = this.outputWidth
        this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2
        this.imgData.startX = 0
      } else {
        scaleRatio = imgHeight / this.outputHeight
        this.imgData.width = imgWidth / scaleRatio
        this.imgData.height = this.outputHeight
        this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2
        this.imgData.startY = 0
      }
    },

    _naturalSize () {
      let imgWidth = this.naturalWidth
      let imgHeight = this.naturalHeight
      this.imgData.width = imgWidth
      this.imgData.height = imgHeight
      this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2
      this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2
    },

    _handlePointerStart (evt) {
      this.emitNativeEvent(evt)
      if (this.passive) return
      this.supportTouch = true
      this.pointerMoved = false
      let pointerCoord = u.getPointerCoords(evt, this)
      this.pointerStartCoord = pointerCoord

      if (this.disabled) return
      // simulate click with touch on mobile devices
      if (!this.hasImage() && !this.disableClickToChoose) {
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
      for (let i = 0, len = cancelEvents.length; i < len; i++) {
        let e = cancelEvents[i]
        document.addEventListener(e, this._handlePointerEnd)
      }
    },

    _handlePointerEnd (evt) {
      this.emitNativeEvent(evt)
      if (this.passive) return
      let pointerMoveDistance = 0
      if (this.pointerStartCoord) {
        let pointerCoord = u.getPointerCoords(evt, this)
        pointerMoveDistance = Math.sqrt(Math.pow(pointerCoord.x - this.pointerStartCoord.x, 2) + Math.pow(pointerCoord.y - this.pointerStartCoord.y, 2)) || 0
      }
      if (this.disabled) return
      if (!this.hasImage() && !this.disableClickToChoose) {
        let tabEnd = new Date().valueOf()
        if ((pointerMoveDistance < CLICK_MOVE_THRESHOLD) && tabEnd - this.tabStart < MIN_MS_PER_CLICK && this.supportTouch) {
          this.chooseFile()
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

    _handlePointerMove (evt) {
      this.emitNativeEvent(evt)
      if (this.passive) return
      this.pointerMoved = true
      if (!this.hasImage()) return
      let coord = u.getPointerCoords(evt, this)
      this.currentPointerCoord = coord

      if (this.disabled || this.disableDragToMove) return

      evt.preventDefault()
      if (!evt.touches || evt.touches.length === 1) {
        if (!this.dragging) return
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
        this.zoom(delta > 0, PINCH_ACCELERATION)
        this.pinchDistance = distance
      }
    },

    _handlePointerLeave (evt) {
      this.emitNativeEvent(evt)
      if (this.passive) return
      this.currentPointerCoord = null
    },

    _handleWheel (evt) {
      this.emitNativeEvent(evt)
      if (this.passive) return
      if (this.disabled || this.disableScrollToZoom || !this.hasImage()) return
      evt.preventDefault()
      this.scrolling = true
      if (evt.wheelDelta < 0 || evt.deltaY > 0 || evt.detail > 0) {
        this.zoom(this.reverseScrollToZoom)
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseScrollToZoom)
      }
      this.$nextTick(() => {
        this.scrolling = false
      })
    },

    _handleDragEnter (evt) {
      this.emitNativeEvent(evt)
      if (this.passive) return
      if (this.disabled || this.disableDragAndDrop || !u.eventHasFile(evt)) return
      if (this.hasImage() && !this.replaceDrop) return
      this.fileDraggedOver = true
    },

    _handleDragLeave (evt) {
      this.emitNativeEvent(evt)
      if (this.passive) return
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return
      this.fileDraggedOver = false
    },

    _handleDragOver (evt) {
      this.emitNativeEvent(evt)
    },

    _handleDrop (evt) {
      this.emitNativeEvent(evt)
      if (this.passive) return
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return
      if (this.hasImage() && !this.replaceDrop) {
        return
      }
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
        this._onNewFileIn(file)
      }
    },

    _preventMovingToWhiteSpace () {
      if (this.imgData.startX > 0) {
        this.imgData.startX = 0
      }
      if (this.imgData.startY > 0) {
        this.imgData.startY = 0
      }
      if (this.outputWidth - this.imgData.startX > this.imgData.width) {
        this.imgData.startX = -(this.imgData.width - this.outputWidth)
      }
      if (this.outputHeight - this.imgData.startY > this.imgData.height) {
        this.imgData.startY = -(this.imgData.height - this.outputHeight)
      }
    },

    _preventZoomingToWhiteSpace () {
      if (this.imgData.width < this.outputWidth) {
        this.scaleRatio = this.outputWidth / this.naturalWidth
      }

      if (this.imgData.height < this.outputHeight) {
        this.scaleRatio = this.outputHeight / this.naturalHeight
      }
    },

    _setOrientation (orientation = 6, applyMetadata) {
      var useOriginal = applyMetadata
      if (orientation > 1 || useOriginal) {
        if (!this.img) return
        this.rotating = true
        // u.getRotatedImageData(useOriginal ? this.originalImage : this.img, orientation)
        var _img = u.getRotatedImage(useOriginal ? this.originalImage : this.img, orientation)
        _img.onload = () => {
          this.img = _img
          this._placeImage(applyMetadata)
        }
      } else {
        this._placeImage(applyMetadata)
      }

      if (orientation == 2) {
        // flip x
        this.orientation = u.flipX(this.orientation)
      } else if (orientation == 4) {
        // flip y
        this.orientation = u.flipY(this.orientation)
      } else if (orientation == 6) {
        // 90 deg
        this.orientation = u.rotate90(this.orientation)
      } else if (orientation == 3) {
        // 180 deg
        this.orientation = u.rotate90(u.rotate90(this.orientation))
      } else if (orientation == 8) {
        // 270 deg
        this.orientation = u.rotate90(u.rotate90(u.rotate90(this.orientation)))
      } else {
        this.orientation = orientation
      }

      if (useOriginal) {
        this.orientation = orientation
      }
    },

    _paintBackground () {
      let backgroundColor = (!this.canvasColor || this.canvasColor == 'default') ? 'transparent' : this.canvasColor
      this.ctx.fillStyle = backgroundColor
      this.ctx.clearRect(0, 0, this.outputWidth, this.outputHeight)
      this.ctx.fillRect(0, 0, this.outputWidth, this.outputHeight)
    },

    _draw () {
      this.$nextTick(() => {
        if (typeof window !== 'undefined' && window.requestAnimationFrame) {
          requestAnimationFrame(this._drawFrame)
        } else {
          this._drawFrame()
        }
      })
    },

    _drawFrame () {
      if (!this.img) return
      this.loading = false
      let ctx = this.ctx
      let { startX, startY, width, height } = this.imgData

      this._paintBackground()
      ctx.drawImage(this.img, startX, startY, width, height)

      if (this.preventWhiteSpace) {
        this._clip(this._createContainerClipPath)
        // this._clip(this._createImageClipPath)
      }

      this.emitEvent(events.DRAW_EVENT, ctx)
      if (!this.imageSet) {
        this.imageSet = true
        this.emitEvent(events.NEW_IMAGE_DRAWN_EVENT)
      }
      this.rotating = false
    },

    _clipPathFactory (x, y, width, height) {
      let ctx = this.ctx
      let radius = typeof this.imageBorderRadius === 'number' ?
        this.imageBorderRadius :
        !isNaN(Number(this.imageBorderRadius)) ? Number(this.imageBorderRadius) : 0
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    },

    _createContainerClipPath () {
      this._clipPathFactory(0, 0, this.outputWidth, this.outputHeight)
      if (this.clipPlugins && this.clipPlugins.length) {
        this.clipPlugins.forEach(func => {
          func(this.ctx, 0, 0, this.outputWidth, this.outputHeight)
        })
      }
    },

    // _createImageClipPath () {
    //   let { startX, startY, width, height } = this.imgData
    //   let w = width
    //   let h = height
    //   let x = startX
    //   let y = startY
    //   if (w < h) {
    //     h = this.outputHeight * (width / this.outputWidth)
    //   }
    //   if (h < w) {
    //     w = this.outputWidth * (height / this.outputHeight)
    //     x = startX + (width - this.outputWidth) / 2
    //   }
    //   this._clipPathFactory(x, startY, w, h)
    // },

    _clip (createPath) {
      let ctx = this.ctx
      ctx.save()
      ctx.fillStyle = '#fff'
      ctx.globalCompositeOperation = 'destination-in'
      createPath()
      ctx.fill()
      ctx.restore()
    },

    _applyMetadata () {
      if (!this.userMetadata) return
      var { startX, startY, scale } = this.userMetadata

      if (u.numberValid(startX)) {
        this.imgData.startX = startX
      }

      if (u.numberValid(startY)) {
        this.imgData.startY = startY
      }

      if (u.numberValid(scale)) {
        this.scaleRatio = scale
      }

      this.$nextTick(() => {
        this.userMetadata = null
      })
    },

    onDimensionChange () {
      if (!this.img) {
        this._initialize()
      } else {
        if (this.preventWhiteSpace) {
          this.imageSet = false
        }
        this._setSize()
        this._placeImage()
      }
    }
  }
}
</script>

<style lang="stylus">
.croppa-container
  display inline-block
  cursor pointer
  transition all 0.3s
  position relative
  font-size 0
  align-self flex-start
  background-color #e6e6e6

  canvas
    transition all 0.3s

  &:hover
    opacity 0.7

  &.croppa--dropzone
    box-shadow inset 0 0 10px lightness(black, 20%)

    canvas
      opacity 0.5

  &.croppa--disabled-cc
    cursor default

    &:hover
      opacity 1

  &.croppa--has-target
    cursor move

    &:hover
      opacity 1

    &.croppa--disabled-mz
      cursor default

  &.croppa--disabled
    cursor not-allowed

    &:hover
      opacity 1

  &.croppa--passive
    cursor default

    &:hover
      opacity 1

  svg.icon-remove
    position absolute
    background white
    border-radius 50%
    filter drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.7))
    z-index 10
    cursor pointer
    border 2px solid white
</style>

<style lang="scss">
// https://github.com/tobiasahlin/SpinKit/blob/master/scss/spinners/10-fading-circle.scss
.sk-fading-circle {
  $circleCount: 12;
  $animationDuration: 1s;

  position: absolute;

  .sk-circle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .sk-circle .sk-circle-indicator {
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    animation: sk-circleFadeDelay $animationDuration infinite ease-in-out both;
  }

  @for $i from 2 through $circleCount {
    .sk-circle#{$i} {
      transform: rotate(360deg / $circleCount * ($i - 1));
    }
  }

  @for $i from 2 through $circleCount {
    .sk-circle#{$i} .sk-circle-indicator {
      animation-delay: -$animationDuration + $animationDuration / $circleCount * ($i - 1);
    }
  }
}
@keyframes sk-circleFadeDelay {
  0%,
  39%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
</style>

