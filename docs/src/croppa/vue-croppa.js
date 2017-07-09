/*
 * vue-croppa v0.0.27
 * https://github.com/zhanziyang/vue-croppa
 * 
 * Copyright (c) 2017 zhanziyang
 * Released under the ISC license
 */
  
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Croppa = factory());
}(this, (function () { 'use strict';

var u = {
  onePointCoord: function onePointCoord(point, vm) {
    var canvas = vm.canvas,
        quality = vm.quality;

    var rect = canvas.getBoundingClientRect();
    var clientX = point.clientX;
    var clientY = point.clientY;
    return {
      x: (clientX - rect.left) * quality,
      y: (clientY - rect.top) * quality
    };
  },
  getPointerCoords: function getPointerCoords(evt, vm) {
    var pointer = void 0;
    if (evt.touches && evt.touches[0]) {
      pointer = evt.touches[0];
    } else if (evt.changedTouches && evt.changedTouches[0]) {
      pointer = evt.changedTouches[0];
    } else {
      pointer = evt;
    }
    return this.onePointCoord(pointer, vm);
  },
  getPinchDistance: function getPinchDistance(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return Math.sqrt(Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2));
  },
  getPinchCenterCoord: function getPinchCenterCoord(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return {
      x: (coord1.x + coord2.x) / 2,
      y: (coord1.y + coord2.y) / 2
    };
  },
  imageLoaded: function imageLoaded(img) {
    return img.complete && img.naturalWidth !== 0;
  },
  rAFPolyfill: function rAFPolyfill() {
    // rAF polyfill
    if (typeof document == 'undefined' || typeof window == 'undefined') return;
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
        var id = window.setTimeout(function () {
          var arg = currTime + timeToCall;
          callback(arg);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }

    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  },
  toBlobPolyfill: function toBlobPolyfill() {
    if (typeof document == 'undefined' || typeof window == 'undefined' || !HTMLCanvasElement) return;
    var binStr, len, arr;
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function value(callback, type, quality) {
          binStr = atob(this.toDataURL(type, quality).split(',')[1]);
          len = binStr.length;
          arr = new Uint8Array(len);

          for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }

          callback(new Blob([arr], { type: type || 'image/png' }));
        }
      });
    }
  }
};

Number.isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

var props = {
  value: Object,
  width: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  height: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  placeholder: {
    type: String,
    default: 'Choose an image'
  },
  placeholderColor: {
    default: '#606060'
  },
  placeholderFontSize: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  canvasColor: {
    default: '#e6e6e6'
  },
  quality: {
    type: Number,
    default: 2,
    validator: function validator(val) {
      return Number.isInteger(val) && val > 0;
    }
  },
  zoomSpeed: {
    default: 3,
    type: Number,
    validator: function validator(val) {
      return val > 0;
    }
  },
  accept: {
    type: String,
    default: '.jpg,.png,.gif,.bmp,.webp,.svg,.tiff'
  },
  fileSizeLimit: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  disabled: Boolean,
  disableDragAndDrop: Boolean,
  disableClickToChoose: Boolean,
  disableDragToMove: Boolean,
  disableScrollToZoom: Boolean,
  disablePinchToZoom: Boolean,
  reverseZoomingGesture: Boolean, // deprecated
  reverseScrollToZoom: Boolean,
  preventWhiteSpace: Boolean,
  showRemoveButton: {
    type: Boolean,
    default: true
  },
  removeButtonColor: {
    type: String,
    default: 'red'
  },
  removeButtonSize: {
    type: Number
  },
  initialImage: String
};

var events = {
  INIT_EVENT: 'init',
  FILE_CHOOSE_EVENT: 'file-choose',
  FILE_SIZE_EXCEED_EVENT: 'file-size-exceed',
  FILE_TYPE_MISMATCH_EVENT: 'file-type-mismatch',
  IMAGE_REMOVE_EVENT: 'image-remove',
  MOVE_EVENT: 'move',
  ZOOM_EVENT: 'zoom'
};

var PCT_PER_ZOOM = 1 / 100000; // The amount of zooming everytime it happens, in percentage of image width.
var MIN_MS_PER_CLICK = 500; // If touch duration is shorter than the value, then it is considered as a click.
var CLICK_MOVE_THRESHOLD = 100; // If touch move distance is greater than this value, then it will by no mean be considered as a click.
var MIN_WIDTH = 10; // The minimal width the user can zoom to.
var DEFAULT_PLACEHOLDER_TAKEUP = 2 / 3; // Placeholder text by default takes up this amount of times of canvas width.
var PINCH_ACCELERATION = 2; // The amount of times by which the pinching is more sensitive than the scolling
var DEBUG = false;

var cropper = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') + ' ' + (_vm.disabled ? 'croppa--disabled' : '') + ' ' + (_vm.disableClickToChoose ? 'croppa--disabled-cc' : '') + ' ' + (_vm.disableDragToMove && _vm.disableScrollToZoom ? 'croppa--disabled-mz' : '') + ' ' + (_vm.fileDraggedOver ? 'croppa--dropzone' : ''), on: { "dragenter": function dragenter($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleDragEnter($event);
        }, "dragleave": function dragleave($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleDragLeave($event);
        }, "dragover": function dragover($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleDragOver($event);
        }, "drop": function drop($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleDrop($event);
        } } }, [_c('input', { ref: "fileInput", attrs: { "type": "file", "accept": _vm.accept, "disabled": _vm.disabled, "hidden": "" }, on: { "change": _vm.handleInputChange } }), _c('div', { staticClass: "initial", staticStyle: { "width": "0", "height": "0", "visibility": "hidden" } }, [_vm._t("initial")], 2), _c('canvas', { ref: "canvas", on: { "click": function click($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleClick($event);
        }, "touchstart": function touchstart($event) {
          $event.stopPropagation();_vm.handlePointerStart($event);
        }, "mousedown": function mousedown($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerStart($event);
        }, "pointerstart": function pointerstart($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerStart($event);
        }, "touchend": function touchend($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerEnd($event);
        }, "touchcancel": function touchcancel($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerEnd($event);
        }, "mouseup": function mouseup($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerEnd($event);
        }, "pointerend": function pointerend($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerEnd($event);
        }, "pointercancel": function pointercancel($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerEnd($event);
        }, "touchmove": function touchmove($event) {
          $event.stopPropagation();_vm.handlePointerMove($event);
        }, "mousemove": function mousemove($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerMove($event);
        }, "pointermove": function pointermove($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerMove($event);
        }, "DOMMouseScroll": function DOMMouseScroll($event) {
          $event.stopPropagation();_vm.handleWheel($event);
        }, "wheel": function wheel($event) {
          $event.stopPropagation();_vm.handleWheel($event);
        }, "mousewheel": function mousewheel($event) {
          $event.stopPropagation();_vm.handleWheel($event);
        } } }), _vm.showRemoveButton && _vm.img ? _c('svg', { staticClass: "icon icon-remove", style: 'top: -' + _vm.height / 40 + 'px; right: -' + _vm.width / 40 + 'px', attrs: { "viewBox": "0 0 1024 1024", "version": "1.1", "xmlns": "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", "width": _vm.removeButtonSize || _vm.width / 10, "height": _vm.removeButtonSize || _vm.width / 10 }, on: { "click": _vm.remove } }, [_c('path', { attrs: { "d": "M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z", "fill": _vm.removeButtonColor } })]) : _vm._e()]);
  }, staticRenderFns: [],
  model: {
    prop: 'value',
    event: 'init'
  },

  props: props,

  data: function data() {
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
    };
  },


  computed: {
    realWidth: function realWidth() {
      return this.width * this.quality;
    },
    realHeight: function realHeight() {
      return this.height * this.quality;
    },
    realPlaceholderFontSize: function realPlaceholderFontSize() {
      return this.placeholderFontSize * this.quality;
    }
  },

  mounted: function mounted() {
    this.init();
    u.rAFPolyfill();
    u.toBlobPolyfill();

    if (this.$options._parentListeners['initial-image-load'] || this.$options._parentListeners['initial-image-error']) {
      console.warn('initial-image-load and initial-image-error events are already deprecated. Please bind them directly on the <img> tag (the slot).');
    }
    var supports = this.supportDetection();
    if (!supports.basic) {
      console.warn('Your browser does not support vue-croppa functionality.');
    }
  },


  watch: {
    value: function value(val) {
      this.instance = val;
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
    init: function init() {
      var _this = this;

      this.canvas = this.$refs.canvas;
      this.canvas.width = this.realWidth;
      this.canvas.height = this.realHeight;
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
      this.canvas.style.backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? '#e6e6e6' : typeof this.canvasColor === 'string' ? this.canvasColor : '';
      this.ctx = this.canvas.getContext('2d');
      this.img = null;
      this.setInitial();
      this.$emit(events.INIT_EVENT, {
        getCanvas: function getCanvas() {
          return _this.canvas;
        },
        getContext: function getContext() {
          return _this.ctx;
        },
        getChosenFile: function getChosenFile() {
          return _this.$refs.fileInput.files[0];
        },
        getActualImageSize: function getActualImageSize() {
          return {
            width: _this.realWidth,
            height: _this.realHeight
          };
        },
        moveUpwards: function moveUpwards(amount) {
          _this.move({ x: 0, y: -amount });
        },
        moveDownwards: function moveDownwards(amount) {
          _this.move({ x: 0, y: amount });
        },
        moveLeftwards: function moveLeftwards(amount) {
          _this.move({ x: -amount, y: 0 });
        },
        moveRightwards: function moveRightwards(amount) {
          _this.move({ x: amount, y: 0 });
        },
        zoomIn: function zoomIn() {
          _this.zoom(true);
        },
        zoomOut: function zoomOut() {
          _this.zoom(false);
        },
        refresh: function refresh() {
          _this.$nextTick(_this.init);
        },
        hasImage: function hasImage() {
          return !!_this.img;
        },
        reset: function reset() {
          console.warn('"reset()" method will be deprecated in the near future due to misnaming. Please use "remove()" instead. They have the same effect.');
          _this.remove();
        }, // soon to be deprecated due to misnamed
        remove: this.remove,
        chooseFile: this.chooseFile,
        generateDataUrl: this.generateDataUrl,
        generateBlob: this.generateBlob,
        promisedBlob: this.promisedBlob,
        supportDetection: this.supportDetection
      });
    },
    supportDetection: function supportDetection() {
      var div = document.createElement('div');
      return {
        'basic': window.requestAnimationFrame && window.File && window.FileReader && window.FileList && window.Blob,
        'dnd': 'ondragstart' in div && 'ondrop' in div
      };
    },
    remove: function remove() {
      var ctx = this.ctx;
      this.paintBackground();
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      var defaultFontSize = this.realWidth * DEFAULT_PLACEHOLDER_TAKEUP / this.placeholder.length;
      var fontSize = !this.realPlaceholderFontSize || this.realPlaceholderFontSize == 0 ? defaultFontSize : this.realPlaceholderFontSize;
      ctx.font = fontSize + 'px sans-serif';
      ctx.fillStyle = !this.placeholderColor || this.placeholderColor == 'default' ? '#606060' : this.placeholderColor;
      ctx.fillText(this.placeholder, this.realWidth / 2, this.realHeight / 2);

      var hadImage = this.img != null;
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imgData = {};

      if (hadImage) {
        this.$emit(events.IMAGE_REMOVE_EVENT);
      }
    },
    setInitial: function setInitial() {
      var _this2 = this;

      var src = void 0;
      if (this.$slots.initial && this.$slots.initial[0]) {
        var vNode = this.$slots.initial[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm && elm.src) {
          src = elm.src;
        }
      }
      if (!src && this.initialImage) {
        src = this.initialImage;
      }
      if (!src) {
        this.remove();
        return;
      }
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = src;
      if (u.imageLoaded(img)) {
        this.img = img;
        this.imgContentInit();
      } else {
        img.onload = function () {
          _this2.img = img;
          _this2.imgContentInit();
        };

        img.onerror = function () {
          _this2.remove();
        };
      }
    },
    chooseFile: function chooseFile() {
      this.$refs.fileInput.click();
    },
    handleClick: function handleClick() {
      if (DEBUG) {
        console.log('click');
      }
      if (!this.img && !this.disableClickToChoose && !this.disabled && !this.supportTouch) {
        this.chooseFile();
        if (DEBUG) {
          console.log('trigger by click');
        }
      }
    },
    handleInputChange: function handleInputChange() {
      var input = this.$refs.fileInput;
      if (!input.files.length) return;

      var file = input.files[0];
      this.onNewFileIn(file);
    },
    onNewFileIn: function onNewFileIn(file) {
      var _this3 = this;

      this.$emit(events.FILE_CHOOSE_EVENT, file);
      if (!this.fileSizeIsValid(file)) {
        this.$emit(events.FILE_SIZE_EXCEED_EVENT, file);
        throw new Error('File size exceeds limit which is ' + this.fileSizeLimit + ' bytes.');
      }
      if (!this.fileTypeIsValid(file)) {
        this.$emit(events.FILE_TYPE_MISMATCH_EVENT, file);
        var type = file.type || file.name.toLowerCase().split('.').pop();
        throw new Error('File type (' + type + ') does not match what you specified (' + this.accept + ').');
      }
      if (typeof window.FileReader !== 'undefined') {
        var fr = new FileReader();
        fr.onload = function (e) {
          var fileData = e.target.result;
          var img = new Image();
          img.src = fileData;
          img.crossOrigin = 'Anonymous';
          img.onload = function () {
            _this3.img = img;
            _this3.imgContentInit();
          };
        };
        fr.readAsDataURL(file);
      }
    },
    fileSizeIsValid: function fileSizeIsValid(file) {
      if (!file) return false;
      if (!this.fileSizeLimit || this.fileSizeLimit == 0) return true;

      return file.size < this.fileSizeLimit;
    },
    fileTypeIsValid: function fileTypeIsValid(file) {
      var accept = this.accept || 'image/*';
      var baseMimetype = accept.replace(/\/.*$/, '');
      var types = accept.split(',');
      for (var i = 0, len = types.length; i < len; i++) {
        var type = types[i];
        var t = type.trim();
        if (t.charAt(0) == '.') {
          if (file.name.toLowerCase().split('.').pop() === t.toLowerCase().slice(1)) return true;
        } else if (/\/\*$/.test(t)) {
          var fileBaseType = file.type.replace(/\/.*$/, '');
          if (fileBaseType === baseMimetype) {
            return true;
          }
        } else if (file.type === type) {
          return true;
        }
      }

      return false;
    },
    imgContentInit: function imgContentInit() {
      this.imgData.startX = 0;
      this.imgData.startY = 0;
      var imgWidth = this.img.naturalWidth;
      var imgHeight = this.img.naturalHeight;
      var imgRatio = imgHeight / imgWidth;
      var canvasRatio = this.realHeight / this.realWidth;

      // display as fit
      if (imgRatio < canvasRatio) {
        var ratio = imgHeight / this.realHeight;
        this.imgData.width = imgWidth / ratio;
        this.imgData.startX = -(this.imgData.width - this.realWidth) / 2;
        this.imgData.height = this.realHeight;
      } else {
        var _ratio = imgWidth / this.realWidth;
        this.imgData.height = imgHeight / _ratio;
        this.imgData.startY = -(this.imgData.height - this.realHeight) / 2;
        this.imgData.width = this.realWidth;
      }

      this.draw();
    },
    handlePointerStart: function handlePointerStart(evt) {
      if (DEBUG) {
        console.log('touch start');
      }
      this.supportTouch = true;
      this.pointerMoved = false;
      var pointerCoord = u.getPointerCoords(evt, this);
      this.pointerStartCoord = pointerCoord;

      if (this.disabled) return;
      // simulate click with touch on mobile devices
      if (!this.img && !this.disableClickToChoose) {
        this.tabStart = new Date().valueOf();
        return;
      }
      // ignore mouse right click and middle click
      if (evt.which && evt.which > 1) return;

      if (!evt.touches || evt.touches.length === 1) {
        this.dragging = true;
        this.pinching = false;
        var coord = u.getPointerCoords(evt, this);
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        this.dragging = false;
        this.pinching = true;
        this.pinchDistance = u.getPinchDistance(evt, this);
      }

      var cancelEvents = ['mouseup', 'touchend', 'touchcancel', 'pointerend', 'pointercancel'];
      for (var i = 0, len = cancelEvents.length; i < len; i++) {
        var e = cancelEvents[i];
        document.addEventListener(e, this.handlePointerEnd);
      }
    },
    handlePointerEnd: function handlePointerEnd(evt) {
      if (DEBUG) {
        console.log('touch end');
      }
      var pointerMoveDistance = 0;
      if (this.pointerStartCoord) {
        var pointerCoord = u.getPointerCoords(evt, this);
        pointerMoveDistance = Math.sqrt(Math.pow(pointerCoord.x - this.pointerStartCoord.x, 2) + Math.pow(pointerCoord.y - this.pointerStartCoord.y, 2)) || 0;
      }
      if (this.disabled) return;
      if (!this.img && !this.disableClickToChoose) {
        var tabEnd = new Date().valueOf();
        if (pointerMoveDistance < CLICK_MOVE_THRESHOLD && tabEnd - this.tabStart < MIN_MS_PER_CLICK && this.supportTouch) {
          this.chooseFile();
          if (DEBUG) {
            console.log('trigger by touch');
          }
        }
        this.tabStart = 0;
        return;
      }

      this.dragging = false;
      this.pinching = false;
      this.pinchDistance = 0;
      this.lastMovingCoord = null;
      this.pointerMoved = false;
      this.pointerStartCoord = null;
    },
    handlePointerMove: function handlePointerMove(evt) {
      this.pointerMoved = true;

      if (this.disabled || this.disableDragToMove || !this.img) return;

      evt.preventDefault();
      if (!evt.touches || evt.touches.length === 1) {
        if (!this.dragging) return;
        var coord = u.getPointerCoords(evt, this);
        if (this.lastMovingCoord) {
          this.move({
            x: coord.x - this.lastMovingCoord.x,
            y: coord.y - this.lastMovingCoord.y
          });
        }
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        if (!this.pinching) return;
        var distance = u.getPinchDistance(evt, this);
        var delta = distance - this.pinchDistance;
        this.zoom(delta > 0, null, PINCH_ACCELERATION);
        this.pinchDistance = distance;
      }
    },
    handleWheel: function handleWheel(evt) {
      if (this.disabled || this.disableScrollToZoom || !this.img) return;
      evt.preventDefault();
      var coord = u.getPointerCoords(evt, this);
      if (evt.wheelDelta < 0 || evt.deltaY > 0 || evt.detail > 0) {
        this.zoom(this.reverseZoomingGesture || this.reverseScrollToZoom, coord);
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseZoomingGesture && !this.reverseScrollToZoom, coord);
      }
    },
    handleDragEnter: function handleDragEnter(evt) {
      if (this.disabled || this.disableDragAndDrop || this.img) return;
      this.fileDraggedOver = true;
    },
    handleDragLeave: function handleDragLeave(evt) {
      if (!this.fileDraggedOver) return;
      this.fileDraggedOver = false;
    },
    handleDragOver: function handleDragOver(evt) {},
    handleDrop: function handleDrop(evt) {
      if (!this.fileDraggedOver) return;
      this.fileDraggedOver = false;

      var file = void 0;
      var dt = evt.dataTransfer;
      if (!dt) return;
      if (dt.items) {
        for (var i = 0, len = dt.items.length; i < len; i++) {
          var item = dt.items[i];
          if (item.kind == 'file') {
            file = item.getAsFile();
            break;
          }
        }
      } else {
        file = dt.files[0];
      }

      if (file) {
        this.onNewFileIn(file);
      }
    },
    move: function move(offset) {
      if (!offset) return;
      var oldX = this.imgData.startX;
      var oldY = this.imgData.startY;
      this.imgData.startX += offset.x;
      this.imgData.startY += offset.y;
      if (this.preventWhiteSpace) {
        this.preventMovingToWhiteSpace();
      }
      if (this.imgData.startX !== oldX || this.imgData.startY !== oldY) {
        this.$emit(events.MOVE_EVENT);
        this.draw();
      }
    },
    preventMovingToWhiteSpace: function preventMovingToWhiteSpace() {
      if (this.imgData.startX > 0) {
        this.imgData.startX = 0;
      }
      if (this.imgData.startY > 0) {
        this.imgData.startY = 0;
      }
      if (this.realWidth - this.imgData.startX > this.imgData.width) {
        this.imgData.startX = -(this.imgData.width - this.realWidth);
      }
      if (this.realHeight - this.imgData.startY > this.imgData.height) {
        this.imgData.startY = -(this.imgData.height - this.realHeight);
      }
    },
    zoom: function zoom(zoomIn, pos) {
      var innerAcceleration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      pos = pos || {
        x: this.imgData.startX + this.imgData.width / 2,
        y: this.imgData.startY + this.imgData.height / 2
      };
      var realSpeed = this.zoomSpeed * innerAcceleration;
      var speed = this.realWidth * PCT_PER_ZOOM * realSpeed;
      var x = 1;
      if (zoomIn) {
        x = 1 + speed;
      } else if (this.imgData.width > MIN_WIDTH) {
        x = 1 - speed;
      }

      var oldWidth = this.imgData.width;
      var oldHeight = this.imgData.height;

      this.imgData.width = this.imgData.width * x;
      this.imgData.height = this.imgData.height * x;

      if (this.preventWhiteSpace) {
        if (this.imgData.width < this.realWidth) {
          var _x = this.realWidth / this.imgData.width;
          this.imgData.width = this.realWidth;
          this.imgData.height = this.imgData.height * _x;
        }

        if (this.imgData.height < this.realHeight) {
          var _x3 = this.realHeight / this.imgData.height;
          this.imgData.height = this.realHeight;
          this.imgData.width = this.imgData.width * _x3;
        }
      }
      if (oldWidth.toFixed(2) !== this.imgData.width.toFixed(2) || oldHeight.toFixed(2) !== this.imgData.height.toFixed(2)) {
        var offsetX = (x - 1) * (pos.x - this.imgData.startX);
        var offsetY = (x - 1) * (pos.y - this.imgData.startY);
        this.imgData.startX = this.imgData.startX - offsetX;
        this.imgData.startY = this.imgData.startY - offsetY;

        if (this.preventWhiteSpace) {
          this.preventMovingToWhiteSpace();
        }
        this.$emit(events.ZOOM_EVENT);
        this.draw();
      }
    },
    paintBackground: function paintBackground() {
      var backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? '#e6e6e6' : this.canvasColor;
      this.ctx.fillStyle = backgroundColor;
      this.ctx.fillRect(0, 0, this.realWidth, this.realHeight);
    },
    draw: function draw() {
      var _this4 = this;

      var ctx = this.ctx;
      if (!this.img) return;
      var _imgData = this.imgData,
          startX = _imgData.startX,
          startY = _imgData.startY,
          width = _imgData.width,
          height = _imgData.height;

      if (window.requestAnimationFrame) {
        requestAnimationFrame(function () {
          _this4.paintBackground();
          ctx.drawImage(_this4.img, startX, startY, width, height);
        });
      } else {
        this.paintBackground();
        ctx.drawImage(this.img, startX, startY, width, height);
      }
    },
    generateDataUrl: function generateDataUrl(type) {
      if (!this.img) return '';
      return this.canvas.toDataURL(type);
    },
    generateBlob: function generateBlob(callback, mimeType, qualityArgument) {
      if (!this.img) return null;
      this.canvas.toBlob(callback, mimeType, qualityArgument);
    },
    promisedBlob: function promisedBlob() {
      var _this5 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof Promise == 'undefined') {
        console.warn('No Promise support. Please add Promise polyfill if you want to use this method.');
        return;
      }
      return new Promise(function (resolve, reject) {
        try {
          _this5.generateBlob(function (blob) {
            resolve(blob);
          }, args);
        } catch (err) {
          reject(err);
        }
      });
    }
  }
};

var VueCroppa = {
  install: function install(Vue, options) {
    options = options || {};
    var version = Number(Vue.version.split('.')[0]);
    if (version < 2) {
      throw new Error('vue-croppa supports vue version 2.0 and above. You are using Vue@' + version + '. Please upgrade to the latest version of Vue.');
    }
    var componentName = options.componentName || 'croppa';
    Vue.component(componentName, cropper);
  }
};

return VueCroppa;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xyXG4gIG9uZVBvaW50Q29vcmQocG9pbnQsIHZtKSB7XHJcbiAgICBsZXQgeyBjYW52YXMsIHF1YWxpdHkgfSA9IHZtXHJcbiAgICBsZXQgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgbGV0IGNsaWVudFggPSBwb2ludC5jbGllbnRYXHJcbiAgICBsZXQgY2xpZW50WSA9IHBvaW50LmNsaWVudFlcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjbGllbnRYIC0gcmVjdC5sZWZ0KSAqIHF1YWxpdHksXHJcbiAgICAgIHk6IChjbGllbnRZIC0gcmVjdC50b3ApICogcXVhbGl0eVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGdldFBvaW50ZXJDb29yZHMoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coY29vcmQxLnggLSBjb29yZDIueCwgMikgKyBNYXRoLnBvdyhjb29yZDEueSAtIGNvb3JkMi55LCAyKSlcclxuICB9LFxyXG5cclxuICBnZXRQaW5jaENlbnRlckNvb3JkKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiAoY29vcmQxLnggKyBjb29yZDIueCkgLyAyLFxyXG4gICAgICB5OiAoY29vcmQxLnkgKyBjb29yZDIueSkgLyAyXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgaW1hZ2VMb2FkZWQoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCgpIHtcclxuICAgIC8vIHJBRiBwb2x5ZmlsbFxyXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygd2luZG93ID09ICd1bmRlZmluZWQnKSByZXR1cm5cclxuICAgIHZhciBsYXN0VGltZSA9IDBcclxuICAgIHZhciB2ZW5kb3JzID0gWyd3ZWJraXQnLCAnbW96J11cclxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCAgICAvLyBXZWJraXTkuK3mraTlj5bmtojmlrnms5XnmoTlkI3lrZflj5jkuoZcclxuICAgICAgICB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2LjcgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpXHJcbiAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGFyZyA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbFxyXG4gICAgICAgICAgY2FsbGJhY2soYXJnKVxyXG4gICAgICAgIH0sIHRpbWVUb0NhbGwpXHJcbiAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICByZXR1cm4gaWRcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KGlkKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQXJyYXkuaXNBcnJheSA9IGZ1bmN0aW9uIChhcmcpIHtcclxuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpID09PSAnW29iamVjdCBBcnJheV0nXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgdG9CbG9iUG9seWZpbGwoKSB7XHJcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB3aW5kb3cgPT0gJ3VuZGVmaW5lZCcgfHwgIUhUTUxDYW52YXNFbGVtZW50KSByZXR1cm5cclxuICAgIHZhciBiaW5TdHIsIGxlbiwgYXJyXHJcbiAgICBpZiAoIUhUTUxDYW52YXNFbGVtZW50LnByb3RvdHlwZS50b0Jsb2IpIHtcclxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEhUTUxDYW52YXNFbGVtZW50LnByb3RvdHlwZSwgJ3RvQmxvYicsIHtcclxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKGNhbGxiYWNrLCB0eXBlLCBxdWFsaXR5KSB7XHJcbiAgICAgICAgICBiaW5TdHIgPSBhdG9iKHRoaXMudG9EYXRhVVJMKHR5cGUsIHF1YWxpdHkpLnNwbGl0KCcsJylbMV0pXHJcbiAgICAgICAgICBsZW4gPSBiaW5TdHIubGVuZ3RoXHJcbiAgICAgICAgICBhcnIgPSBuZXcgVWludDhBcnJheShsZW4pXHJcblxyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBhcnJbaV0gPSBiaW5TdHIuY2hhckNvZGVBdChpKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNhbGxiYWNrKG5ldyBCbG9iKFthcnJdLCB7IHR5cGU6IHR5cGUgfHwgJ2ltYWdlL3BuZycgfSkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSIsIk51bWJlci5pc0ludGVnZXIgPSBOdW1iZXIuaXNJbnRlZ2VyIHx8IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWVcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjZTZlNmU2J1xyXG4gIH0sXHJcbiAgcXVhbGl0eToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWwpICYmIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnLmpwZywucG5nLC5naWYsLmJtcCwud2VicCwuc3ZnLC50aWZmJ1xyXG4gIH0sXHJcbiAgZmlsZVNpemVMaW1pdDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnQW5kRHJvcDogQm9vbGVhbixcclxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ1RvTW92ZTogQm9vbGVhbixcclxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIGRpc2FibGVQaW5jaFRvWm9vbTogQm9vbGVhbixcclxuICByZXZlcnNlWm9vbWluZ0dlc3R1cmU6IEJvb2xlYW4sIC8vIGRlcHJlY2F0ZWRcclxuICByZXZlcnNlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIHByZXZlbnRXaGl0ZVNwYWNlOiBCb29sZWFuLFxyXG4gIHNob3dSZW1vdmVCdXR0b246IHtcclxuICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICBkZWZhdWx0OiB0cnVlXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25Db2xvcjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ3JlZCdcclxuICB9LFxyXG4gIHJlbW92ZUJ1dHRvblNpemU6IHtcclxuICAgIHR5cGU6IE51bWJlclxyXG4gIH0sXHJcbiAgaW5pdGlhbEltYWdlOiBTdHJpbmdcclxufSIsImV4cG9ydCBkZWZhdWx0IHtcbiAgSU5JVF9FVkVOVDogJ2luaXQnLFxuICBGSUxFX0NIT09TRV9FVkVOVDogJ2ZpbGUtY2hvb3NlJyxcbiAgRklMRV9TSVpFX0VYQ0VFRF9FVkVOVDogJ2ZpbGUtc2l6ZS1leGNlZWQnLFxuICBGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQ6ICdmaWxlLXR5cGUtbWlzbWF0Y2gnLFxuICBJTUFHRV9SRU1PVkVfRVZFTlQ6ICdpbWFnZS1yZW1vdmUnLFxuICBNT1ZFX0VWRU5UOiAnbW92ZScsXG4gIFpPT01fRVZFTlQ6ICd6b29tJ1xufSIsIjx0ZW1wbGF0ZT5cclxuICA8ZGl2IDpjbGFzcz1cImBjcm9wcGEtY29udGFpbmVyICR7aW1nID8gJ2Nyb3BwYS0taGFzLXRhcmdldCcgOiAnJ30gJHtkaXNhYmxlZCA/ICdjcm9wcGEtLWRpc2FibGVkJyA6ICcnfSAke2Rpc2FibGVDbGlja1RvQ2hvb3NlID8gJ2Nyb3BwYS0tZGlzYWJsZWQtY2MnIDogJyd9ICR7ZGlzYWJsZURyYWdUb01vdmUgJiYgZGlzYWJsZVNjcm9sbFRvWm9vbSA/ICdjcm9wcGEtLWRpc2FibGVkLW16JyA6ICcnfSAke2ZpbGVEcmFnZ2VkT3ZlciA/ICdjcm9wcGEtLWRyb3B6b25lJyA6ICcnfWBcIlxyXG4gICAgICAgQGRyYWdlbnRlci5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcmFnRW50ZXJcIlxyXG4gICAgICAgQGRyYWdsZWF2ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcmFnTGVhdmVcIlxyXG4gICAgICAgQGRyYWdvdmVyLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdPdmVyXCJcclxuICAgICAgIEBkcm9wLnN0b3AucHJldmVudD1cImhhbmRsZURyb3BcIj5cclxuICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiXHJcbiAgICAgICAgICAgOmFjY2VwdD1cImFjY2VwdFwiXHJcbiAgICAgICAgICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxyXG4gICAgICAgICAgIHJlZj1cImZpbGVJbnB1dFwiXHJcbiAgICAgICAgICAgaGlkZGVuXHJcbiAgICAgICAgICAgQGNoYW5nZT1cImhhbmRsZUlucHV0Q2hhbmdlXCIgLz5cclxuICAgIDxkaXYgY2xhc3M9XCJpbml0aWFsXCJcclxuICAgICAgICAgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW47XCI+XHJcbiAgICAgIDxzbG90IG5hbWU9XCJpbml0aWFsXCI+PC9zbG90PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8Y2FudmFzIHJlZj1cImNhbnZhc1wiXHJcbiAgICAgICAgICAgIEBjbGljay5zdG9wLnByZXZlbnQ9XCJoYW5kbGVDbGlja1wiXHJcbiAgICAgICAgICAgIEB0b3VjaHN0YXJ0LnN0b3A9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAbW91c2Vkb3duLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyc3RhcnQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHRvdWNoZW5kLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAdG91Y2hjYW5jZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBtb3VzZXVwLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcmVuZC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJjYW5jZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEB0b3VjaG1vdmUuc3RvcD1cImhhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQG1vdXNlbW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBwb2ludGVybW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBET01Nb3VzZVNjcm9sbC5zdG9wPVwiaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAd2hlZWwuc3RvcD1cImhhbmRsZVdoZWVsXCJcclxuICAgICAgICAgICAgQG1vdXNld2hlZWwuc3RvcD1cImhhbmRsZVdoZWVsXCI+PC9jYW52YXM+XHJcbiAgICA8c3ZnIGNsYXNzPVwiaWNvbiBpY29uLXJlbW92ZVwiXHJcbiAgICAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZ1wiXHJcbiAgICAgICAgIEBjbGljaz1cInJlbW92ZVwiXHJcbiAgICAgICAgIDpzdHlsZT1cImB0b3A6IC0ke2hlaWdodC80MH1weDsgcmlnaHQ6IC0ke3dpZHRoLzQwfXB4YFwiXHJcbiAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcclxuICAgICAgICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxyXG4gICAgICAgICA6d2lkdGg9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCJcclxuICAgICAgICAgOmhlaWdodD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIj5cclxuICAgICAgPHBhdGggZD1cIk01MTEuOTIxMjMxIDBDMjI5LjE3OTA3NyAwIDAgMjI5LjI1Nzg0NiAwIDUxMiAwIDc5NC43MDI3NjkgMjI5LjE3OTA3NyAxMDI0IDUxMS45MjEyMzEgMTAyNCA3OTQuNzgxNTM4IDEwMjQgMTAyNCA3OTQuNzAyNzY5IDEwMjQgNTEyIDEwMjQgMjI5LjI1Nzg0NiA3OTQuNzgxNTM4IDAgNTExLjkyMTIzMSAwWk03MzIuMDQxODQ2IDY1MC42MzM4NDYgNjUwLjUxNTY5MiA3MzIuMDgxMjMxQzY1MC41MTU2OTIgNzMyLjA4MTIzMSA1MjEuNDkxNjkyIDU5My42ODM2OTIgNTExLjg4MTg0NiA1OTMuNjgzNjkyIDUwMi40Mjk1MzggNTkzLjY4MzY5MiAzNzMuMzY2MTU0IDczMi4wODEyMzEgMzczLjM2NjE1NCA3MzIuMDgxMjMxTDI5MS43NjEyMzEgNjUwLjYzMzg0NkMyOTEuNzYxMjMxIDY1MC42MzM4NDYgNDMwLjMxNjMwOCA1MjMuNTAwMzA4IDQzMC4zMTYzMDggNTEyLjE5NjkyMyA0MzAuMzE2MzA4IDUwMC42OTY2MTUgMjkxLjc2MTIzMSAzNzMuNTIzNjkyIDI5MS43NjEyMzEgMzczLjUyMzY5MkwzNzMuMzY2MTU0IDI5MS45MTg3NjlDMzczLjM2NjE1NCAyOTEuOTE4NzY5IDUwMy40NTM1MzggNDMwLjM5NTA3NyA1MTEuODgxODQ2IDQzMC4zOTUwNzcgNTIwLjM0OTUzOCA0MzAuMzk1MDc3IDY1MC41MTU2OTIgMjkxLjkxODc2OSA2NTAuNTE1NjkyIDI5MS45MTg3NjlMNzMyLjA0MTg0NiAzNzMuNTIzNjkyQzczMi4wNDE4NDYgMzczLjUyMzY5MiA1OTMuNDQ3Mzg1IDUwMi41NDc2OTIgNTkzLjQ0NzM4NSA1MTIuMTk2OTIzIDU5My40NDczODUgNTIxLjQxMjkyMyA3MzIuMDQxODQ2IDY1MC42MzM4NDYgNzMyLjA0MTg0NiA2NTAuNjMzODQ2WlwiXHJcbiAgICAgICAgICAgIDpmaWxsPVwicmVtb3ZlQnV0dG9uQ29sb3JcIj48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xyXG4gIGltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xyXG4gIGltcG9ydCBldmVudHMgZnJvbSAnLi9ldmVudHMnXHJcblxyXG4gIGNvbnN0IFBDVF9QRVJfWk9PTSA9IDEgLyAxMDAwMDAgLy8gVGhlIGFtb3VudCBvZiB6b29taW5nIGV2ZXJ5dGltZSBpdCBoYXBwZW5zLCBpbiBwZXJjZW50YWdlIG9mIGltYWdlIHdpZHRoLlxyXG4gIGNvbnN0IE1JTl9NU19QRVJfQ0xJQ0sgPSA1MDAgLy8gSWYgdG91Y2ggZHVyYXRpb24gaXMgc2hvcnRlciB0aGFuIHRoZSB2YWx1ZSwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGFzIGEgY2xpY2suXHJcbiAgY29uc3QgQ0xJQ0tfTU9WRV9USFJFU0hPTEQgPSAxMDAgLy8gSWYgdG91Y2ggbW92ZSBkaXN0YW5jZSBpcyBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZSwgdGhlbiBpdCB3aWxsIGJ5IG5vIG1lYW4gYmUgY29uc2lkZXJlZCBhcyBhIGNsaWNrLlxyXG4gIGNvbnN0IE1JTl9XSURUSCA9IDEwIC8vIFRoZSBtaW5pbWFsIHdpZHRoIHRoZSB1c2VyIGNhbiB6b29tIHRvLlxyXG4gIGNvbnN0IERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQID0gMiAvIDMgLy8gUGxhY2Vob2xkZXIgdGV4dCBieSBkZWZhdWx0IHRha2VzIHVwIHRoaXMgYW1vdW50IG9mIHRpbWVzIG9mIGNhbnZhcyB3aWR0aC5cclxuICBjb25zdCBQSU5DSF9BQ0NFTEVSQVRJT04gPSAyIC8vIFRoZSBhbW91bnQgb2YgdGltZXMgYnkgd2hpY2ggdGhlIHBpbmNoaW5nIGlzIG1vcmUgc2Vuc2l0aXZlIHRoYW4gdGhlIHNjb2xsaW5nXHJcbiAgY29uc3QgREVCVUcgPSBmYWxzZVxyXG5cclxuICBleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBtb2RlbDoge1xyXG4gICAgICBwcm9wOiAndmFsdWUnLFxyXG4gICAgICBldmVudDogJ2luaXQnXHJcbiAgICB9LFxyXG5cclxuICAgIHByb3BzOiBwcm9wcyxcclxuXHJcbiAgICBkYXRhICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBpbnN0YW5jZTogbnVsbCxcclxuICAgICAgICBjYW52YXM6IG51bGwsXHJcbiAgICAgICAgY3R4OiBudWxsLFxyXG4gICAgICAgIGltZzogbnVsbCxcclxuICAgICAgICBkcmFnZ2luZzogZmFsc2UsXHJcbiAgICAgICAgbGFzdE1vdmluZ0Nvb3JkOiBudWxsLFxyXG4gICAgICAgIGltZ0RhdGE6IHt9LFxyXG4gICAgICAgIGRhdGFVcmw6ICcnLFxyXG4gICAgICAgIGZpbGVEcmFnZ2VkT3ZlcjogZmFsc2UsXHJcbiAgICAgICAgdGFiU3RhcnQ6IDAsXHJcbiAgICAgICAgcGluY2hpbmc6IGZhbHNlLFxyXG4gICAgICAgIHBpbmNoRGlzdGFuY2U6IDAsXHJcbiAgICAgICAgc3VwcG9ydFRvdWNoOiBmYWxzZSxcclxuICAgICAgICBwb2ludGVyTW92ZWQ6IGZhbHNlLFxyXG4gICAgICAgIHBvaW50ZXJTdGFydENvb3JkOiBudWxsXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgcmVhbFdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVhbEhlaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0ICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJGb250U2l6ZSAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdW50ZWQgKCkge1xyXG4gICAgICB0aGlzLmluaXQoKVxyXG4gICAgICB1LnJBRlBvbHlmaWxsKClcclxuICAgICAgdS50b0Jsb2JQb2x5ZmlsbCgpXHJcblxyXG4gICAgICBpZiAodGhpcy4kb3B0aW9ucy5fcGFyZW50TGlzdGVuZXJzWydpbml0aWFsLWltYWdlLWxvYWQnXSB8fCB0aGlzLiRvcHRpb25zLl9wYXJlbnRMaXN0ZW5lcnNbJ2luaXRpYWwtaW1hZ2UtZXJyb3InXSkge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignaW5pdGlhbC1pbWFnZS1sb2FkIGFuZCBpbml0aWFsLWltYWdlLWVycm9yIGV2ZW50cyBhcmUgYWxyZWFkeSBkZXByZWNhdGVkLiBQbGVhc2UgYmluZCB0aGVtIGRpcmVjdGx5IG9uIHRoZSA8aW1nPiB0YWcgKHRoZSBzbG90KS4nKVxyXG4gICAgICB9XHJcbiAgICAgIGxldCBzdXBwb3J0cyA9IHRoaXMuc3VwcG9ydERldGVjdGlvbigpXHJcbiAgICAgIGlmICghc3VwcG9ydHMuYmFzaWMpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHZ1ZS1jcm9wcGEgZnVuY3Rpb25hbGl0eS4nKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHdhdGNoOiB7XHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IHZhbFxyXG4gICAgICB9LFxyXG4gICAgICByZWFsV2lkdGg6ICdpbml0JyxcclxuICAgICAgcmVhbEhlaWdodDogJ2luaXQnLFxyXG4gICAgICBjYW52YXNDb2xvcjogJ2luaXQnLFxyXG4gICAgICBwbGFjZWhvbGRlcjogJ2luaXQnLFxyXG4gICAgICBwbGFjZWhvbGRlckNvbG9yOiAnaW5pdCcsXHJcbiAgICAgIHJlYWxQbGFjZWhvbGRlckZvbnRTaXplOiAnaW5pdCcsXHJcbiAgICAgIHByZXZlbnRXaGl0ZVNwYWNlOiAnaW1nQ29udGVudEluaXQnXHJcbiAgICB9LFxyXG5cclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgaW5pdCAoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRyZWZzLmNhbnZhc1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyAncHgnXHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyAncHgnXHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjZTZlNmU2JyA6ICh0eXBlb2YgdGhpcy5jYW52YXNDb2xvciA9PT0gJ3N0cmluZycgPyB0aGlzLmNhbnZhc0NvbG9yIDogJycpXHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgICAgdGhpcy5pbWcgPSBudWxsXHJcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsKClcclxuICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5JTklUX0VWRU5ULCB7XHJcbiAgICAgICAgICBnZXRDYW52YXM6ICgpID0+IHRoaXMuY2FudmFzLFxyXG4gICAgICAgICAgZ2V0Q29udGV4dDogKCkgPT4gdGhpcy5jdHgsXHJcbiAgICAgICAgICBnZXRDaG9zZW5GaWxlOiAoKSA9PiB0aGlzLiRyZWZzLmZpbGVJbnB1dC5maWxlc1swXSxcclxuICAgICAgICAgIGdldEFjdHVhbEltYWdlU2l6ZTogKCkgPT4gKHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucmVhbFdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICBtb3ZlVXB3YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiAtYW1vdW50IH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZURvd253YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiBhbW91bnQgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlTGVmdHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IC1hbW91bnQsIHk6IDAgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlUmlnaHR3YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiBhbW91bnQsIHk6IDAgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB6b29tSW46ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKHRydWUpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgem9vbU91dDogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnpvb20oZmFsc2UpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVmcmVzaDogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLmluaXQpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaGFzSW1hZ2U6ICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5pbWdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICByZXNldDogKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1wicmVzZXQoKVwiIG1ldGhvZCB3aWxsIGJlIGRlcHJlY2F0ZWQgaW4gdGhlIG5lYXIgZnV0dXJlIGR1ZSB0byBtaXNuYW1pbmcuIFBsZWFzZSB1c2UgXCJyZW1vdmUoKVwiIGluc3RlYWQuIFRoZXkgaGF2ZSB0aGUgc2FtZSBlZmZlY3QuJylcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKVxyXG4gICAgICAgICAgfSwgLy8gc29vbiB0byBiZSBkZXByZWNhdGVkIGR1ZSB0byBtaXNuYW1lZFxyXG4gICAgICAgICAgcmVtb3ZlOiB0aGlzLnJlbW92ZSxcclxuICAgICAgICAgIGNob29zZUZpbGU6IHRoaXMuY2hvb3NlRmlsZSxcclxuICAgICAgICAgIGdlbmVyYXRlRGF0YVVybDogdGhpcy5nZW5lcmF0ZURhdGFVcmwsXHJcbiAgICAgICAgICBnZW5lcmF0ZUJsb2I6IHRoaXMuZ2VuZXJhdGVCbG9iLFxyXG4gICAgICAgICAgcHJvbWlzZWRCbG9iOiB0aGlzLnByb21pc2VkQmxvYixcclxuICAgICAgICAgIHN1cHBvcnREZXRlY3Rpb246IHRoaXMuc3VwcG9ydERldGVjdGlvblxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzdXBwb3J0RGV0ZWN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgJ2Jhc2ljJzogd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAmJiB3aW5kb3cuRmlsZSAmJiB3aW5kb3cuRmlsZVJlYWRlciAmJiB3aW5kb3cuRmlsZUxpc3QgJiYgd2luZG93LkJsb2IsXHJcbiAgICAgICAgICAnZG5kJzogJ29uZHJhZ3N0YXJ0JyBpbiBkaXYgJiYgJ29uZHJvcCcgaW4gZGl2XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVtb3ZlICgpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXHJcbiAgICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMucmVhbFdpZHRoICogREVGQVVMVF9QTEFDRUhPTERFUl9UQUtFVVAgLyB0aGlzLnBsYWNlaG9sZGVyLmxlbmd0aFxyXG4gICAgICAgIGxldCBmb250U2l6ZSA9ICghdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZSB8fCB0aGlzLnJlYWxQbGFjZWhvbGRlckZvbnRTaXplID09IDApID8gZGVmYXVsdEZvbnRTaXplIDogdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZVxyXG4gICAgICAgIGN0eC5mb250ID0gZm9udFNpemUgKyAncHggc2Fucy1zZXJpZidcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gKCF0aGlzLnBsYWNlaG9sZGVyQ29sb3IgfHwgdGhpcy5wbGFjZWhvbGRlckNvbG9yID09ICdkZWZhdWx0JykgPyAnIzYwNjA2MCcgOiB0aGlzLnBsYWNlaG9sZGVyQ29sb3JcclxuICAgICAgICBjdHguZmlsbFRleHQodGhpcy5wbGFjZWhvbGRlciwgdGhpcy5yZWFsV2lkdGggLyAyLCB0aGlzLnJlYWxIZWlnaHQgLyAyKVxyXG5cclxuICAgICAgICBsZXQgaGFkSW1hZ2UgPSB0aGlzLmltZyAhPSBudWxsXHJcbiAgICAgICAgdGhpcy5pbWcgPSBudWxsXHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQudmFsdWUgPSAnJ1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YSA9IHt9XHJcblxyXG4gICAgICAgIGlmIChoYWRJbWFnZSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU1BR0VfUkVNT1ZFX0VWRU5UKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNldEluaXRpYWwgKCkge1xyXG4gICAgICAgIGxldCBzcmNcclxuICAgICAgICBpZiAodGhpcy4kc2xvdHMuaW5pdGlhbCAmJiB0aGlzLiRzbG90cy5pbml0aWFsWzBdKSB7XHJcbiAgICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5pbml0aWFsWzBdXHJcbiAgICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICAgIGlmICh0YWcgPT0gJ2ltZycgJiYgZWxtICYmIGVsbS5zcmMpIHtcclxuICAgICAgICAgICAgc3JjID0gZWxtLnNyY1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXNyYyAmJiB0aGlzLmluaXRpYWxJbWFnZSkge1xyXG4gICAgICAgICAgc3JjID0gdGhpcy5pbml0aWFsSW1hZ2VcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFzcmMpIHtcclxuICAgICAgICAgIHRoaXMucmVtb3ZlKClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgICBpbWcuc2V0QXR0cmlidXRlKCdjcm9zc09yaWdpbicsICdhbm9ueW1vdXMnKVxyXG4gICAgICAgIGltZy5zcmMgPSBzcmNcclxuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XHJcbiAgICAgICAgICB0aGlzLmltZyA9IGltZ1xyXG4gICAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1nID0gaW1nXHJcbiAgICAgICAgICAgIHRoaXMuaW1nQ29udGVudEluaXQoKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGltZy5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgY2hvb3NlRmlsZSAoKSB7XHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQuY2xpY2soKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlQ2xpY2sgKCkge1xyXG4gICAgICAgIGlmIChERUJVRykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrJylcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZyAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSAmJiAhdGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5zdXBwb3J0VG91Y2gpIHtcclxuICAgICAgICAgIHRoaXMuY2hvb3NlRmlsZSgpXHJcbiAgICAgICAgICBpZiAoREVCVUcpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RyaWdnZXIgYnkgY2xpY2snKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZUlucHV0Q2hhbmdlICgpIHtcclxuICAgICAgICBsZXQgaW5wdXQgPSB0aGlzLiRyZWZzLmZpbGVJbnB1dFxyXG4gICAgICAgIGlmICghaW5wdXQuZmlsZXMubGVuZ3RoKSByZXR1cm5cclxuXHJcbiAgICAgICAgbGV0IGZpbGUgPSBpbnB1dC5maWxlc1swXVxyXG4gICAgICAgIHRoaXMub25OZXdGaWxlSW4oZmlsZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG9uTmV3RmlsZUluIChmaWxlKSB7XHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuRklMRV9DSE9PU0VfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVTaXplSXNWYWxpZChmaWxlKSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBzaXplIGV4Y2VlZHMgbGltaXQgd2hpY2ggaXMgJyArIHRoaXMuZmlsZVNpemVMaW1pdCArICcgYnl0ZXMuJylcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVUeXBlSXNWYWxpZChmaWxlKSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuRklMRV9UWVBFX01JU01BVENIX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgICAgbGV0IHR5cGUgPSBmaWxlLnR5cGUgfHwgZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGaWxlIHR5cGUgKCR7dHlwZX0pIGRvZXMgbm90IG1hdGNoIHdoYXQgeW91IHNwZWNpZmllZCAoJHt0aGlzLmFjY2VwdH0pLmApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93LkZpbGVSZWFkZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBsZXQgZnIgPSBuZXcgRmlsZVJlYWRlcigpXHJcbiAgICAgICAgICBmci5vbmxvYWQgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZmlsZURhdGEgPSBlLnRhcmdldC5yZXN1bHRcclxuICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBmaWxlRGF0YVxyXG4gICAgICAgICAgICBpbWcuY3Jvc3NPcmlnaW4gPSAnQW5vbnltb3VzJ1xyXG4gICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMuaW1nID0gaW1nXHJcbiAgICAgICAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGZyLnJlYWRBc0RhdGFVUkwoZmlsZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmaWxlU2l6ZUlzVmFsaWQgKGZpbGUpIHtcclxuICAgICAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUxpbWl0IHx8IHRoaXMuZmlsZVNpemVMaW1pdCA9PSAwKSByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICAgICByZXR1cm4gZmlsZS5zaXplIDwgdGhpcy5maWxlU2l6ZUxpbWl0XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmaWxlVHlwZUlzVmFsaWQgKGZpbGUpIHtcclxuICAgICAgICBsZXQgYWNjZXB0ID0gdGhpcy5hY2NlcHQgfHwgJ2ltYWdlLyonXHJcbiAgICAgICAgbGV0IGJhc2VNaW1ldHlwZSA9IGFjY2VwdC5yZXBsYWNlKC9cXC8uKiQvLCAnJylcclxuICAgICAgICBsZXQgdHlwZXMgPSBhY2NlcHQuc3BsaXQoJywnKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0eXBlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgbGV0IHR5cGUgPSB0eXBlc1tpXVxyXG4gICAgICAgICAgbGV0IHQgPSB0eXBlLnRyaW0oKVxyXG4gICAgICAgICAgaWYgKHQuY2hhckF0KDApID09ICcuJykge1xyXG4gICAgICAgICAgICBpZiAoZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKSA9PT0gdC50b0xvd2VyQ2FzZSgpLnNsaWNlKDEpKSByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfSBlbHNlIGlmICgvXFwvXFwqJC8udGVzdCh0KSkge1xyXG4gICAgICAgICAgICB2YXIgZmlsZUJhc2VUeXBlID0gZmlsZS50eXBlLnJlcGxhY2UoL1xcLy4qJC8sICcnKVxyXG4gICAgICAgICAgICBpZiAoZmlsZUJhc2VUeXBlID09PSBiYXNlTWltZXR5cGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGZpbGUudHlwZSA9PT0gdHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBpbWdDb250ZW50SW5pdCAoKSB7XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMuaW1nLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLmltZy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgICAgbGV0IGltZ1JhdGlvID0gaW1nSGVpZ2h0IC8gaW1nV2lkdGhcclxuICAgICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLnJlYWxXaWR0aFxyXG5cclxuICAgICAgICAvLyBkaXNwbGF5IGFzIGZpdFxyXG4gICAgICAgIGlmIChpbWdSYXRpbyA8IGNhbnZhc1JhdGlvKSB7XHJcbiAgICAgICAgICBsZXQgcmF0aW8gPSBpbWdIZWlnaHQgLyB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gcmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHJhdGlvID0gaW1nV2lkdGggLyB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlclN0YXJ0IChldnQpIHtcclxuICAgICAgICBpZiAoREVCVUcpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCd0b3VjaCBzdGFydCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3VwcG9ydFRvdWNoID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcclxuICAgICAgICBsZXQgcG9pbnRlckNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gcG9pbnRlckNvb3JkXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICAvLyBzaW11bGF0ZSBjbGljayB3aXRoIHRvdWNoIG9uIG1vYmlsZSBkZXZpY2VzXHJcbiAgICAgICAgaWYgKCF0aGlzLmltZyAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgICAgdGhpcy50YWJTdGFydCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWdub3JlIG1vdXNlIHJpZ2h0IGNsaWNrIGFuZCBtaWRkbGUgY2xpY2tcclxuICAgICAgICBpZiAoZXZ0LndoaWNoICYmIGV2dC53aGljaCA+IDEpIHJldHVyblxyXG5cclxuICAgICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSB0cnVlXHJcbiAgICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNhbmNlbEV2ZW50cyA9IFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCcsICdwb2ludGVyZW5kJywgJ3BvaW50ZXJjYW5jZWwnXVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjYW5jZWxFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgIGxldCBlID0gY2FuY2VsRXZlbnRzW2ldXHJcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuaGFuZGxlUG9pbnRlckVuZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyRW5kIChldnQpIHtcclxuICAgICAgICBpZiAoREVCVUcpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCd0b3VjaCBlbmQnKVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcG9pbnRlck1vdmVEaXN0YW5jZSA9IDBcclxuICAgICAgICBpZiAodGhpcy5wb2ludGVyU3RhcnRDb29yZCkge1xyXG4gICAgICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgICBwb2ludGVyTW92ZURpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvaW50ZXJDb29yZC54IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC54LCAyKSArIE1hdGgucG93KHBvaW50ZXJDb29yZC55IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC55LCAyKSkgfHwgMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltZyAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgICAgbGV0IHRhYkVuZCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICBpZiAoKHBvaW50ZXJNb3ZlRGlzdGFuY2UgPCBDTElDS19NT1ZFX1RIUkVTSE9MRCkgJiYgdGFiRW5kIC0gdGhpcy50YWJTdGFydCA8IE1JTl9NU19QRVJfQ0xJQ0sgJiYgdGhpcy5zdXBwb3J0VG91Y2gpIHtcclxuICAgICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICAgICAgaWYgKERFQlVHKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RyaWdnZXIgYnkgdG91Y2gnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gMFxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLnBpbmNoaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSAwXHJcbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBudWxsXHJcbiAgICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBudWxsXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyTW92ZSAoZXZ0KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSB0cnVlXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdUb01vdmUgfHwgIXRoaXMuaW1nKSByZXR1cm5cclxuXHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cclxuICAgICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgICBpZiAodGhpcy5sYXN0TW92aW5nQ29vcmQpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHtcclxuICAgICAgICAgICAgICB4OiBjb29yZC54IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueCxcclxuICAgICAgICAgICAgICB5OiBjb29yZC55IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5kaXNhYmxlUGluY2hUb1pvb20pIHtcclxuICAgICAgICAgIGlmICghdGhpcy5waW5jaGluZykgcmV0dXJuXHJcbiAgICAgICAgICBsZXQgZGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgbGV0IGRlbHRhID0gZGlzdGFuY2UgLSB0aGlzLnBpbmNoRGlzdGFuY2VcclxuICAgICAgICAgIHRoaXMuem9vbShkZWx0YSA+IDAsIG51bGwsIFBJTkNIX0FDQ0VMRVJBVElPTilcclxuICAgICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IGRpc3RhbmNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlV2hlZWwgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVNjcm9sbFRvWm9vbSB8fCAhdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICBpZiAoZXZ0LndoZWVsRGVsdGEgPCAwIHx8IGV2dC5kZWx0YVkgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlWm9vbWluZ0dlc3R1cmUgfHwgdGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tLCBjb29yZClcclxuICAgICAgICB9IGVsc2UgaWYgKGV2dC53aGVlbERlbHRhID4gMCB8fCBldnQuZGVsdGFZIDwgMCB8fCBldnQuZGV0YWlsIDwgMCkge1xyXG4gICAgICAgICAgdGhpcy56b29tKCF0aGlzLnJldmVyc2Vab29taW5nR2VzdHVyZSAmJiAhdGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tLCBjb29yZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcmFnRW50ZXIgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdBbmREcm9wIHx8IHRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IHRydWVcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyYWdMZWF2ZSAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVEcmFnZ2VkT3ZlcikgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ092ZXIgKGV2dCkge1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJvcCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVEcmFnZ2VkT3ZlcikgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxyXG5cclxuICAgICAgICBsZXQgZmlsZVxyXG4gICAgICAgIGxldCBkdCA9IGV2dC5kYXRhVHJhbnNmZXJcclxuICAgICAgICBpZiAoIWR0KSByZXR1cm5cclxuICAgICAgICBpZiAoZHQuaXRlbXMpIHtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkdC5pdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IGR0Lml0ZW1zW2ldXHJcbiAgICAgICAgICAgIGlmIChpdGVtLmtpbmQgPT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgICAgZmlsZSA9IGl0ZW0uZ2V0QXNGaWxlKClcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZpbGUgPSBkdC5maWxlc1swXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgIHRoaXMub25OZXdGaWxlSW4oZmlsZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlIChvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIW9mZnNldCkgcmV0dXJuXHJcbiAgICAgICAgbGV0IG9sZFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYXHJcbiAgICAgICAgbGV0IG9sZFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgKz0gb2Zmc2V0LnlcclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFggIT09IG9sZFggfHwgdGhpcy5pbWdEYXRhLnN0YXJ0WSAhPT0gb2xkWSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuTU9WRV9FVkVOVClcclxuICAgICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFggPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WSA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlYWxXaWR0aCAtIHRoaXMuaW1nRGF0YS5zdGFydFggPiB0aGlzLmltZ0RhdGEud2lkdGgpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWFsSGVpZ2h0IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSA+IHRoaXMuaW1nRGF0YS5oZWlnaHQpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgem9vbSAoem9vbUluLCBwb3MsIGlubmVyQWNjZWxlcmF0aW9uID0gMSkge1xyXG4gICAgICAgIHBvcyA9IHBvcyB8fCB7XHJcbiAgICAgICAgICB4OiB0aGlzLmltZ0RhdGEuc3RhcnRYICsgdGhpcy5pbWdEYXRhLndpZHRoIC8gMixcclxuICAgICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVhbFNwZWVkID0gdGhpcy56b29tU3BlZWQgKiBpbm5lckFjY2VsZXJhdGlvblxyXG4gICAgICAgIGxldCBzcGVlZCA9ICh0aGlzLnJlYWxXaWR0aCAqIFBDVF9QRVJfWk9PTSkgKiByZWFsU3BlZWRcclxuICAgICAgICBsZXQgeCA9IDFcclxuICAgICAgICBpZiAoem9vbUluKSB7XHJcbiAgICAgICAgICB4ID0gMSArIHNwZWVkXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiBNSU5fV0lEVEgpIHtcclxuICAgICAgICAgIHggPSAxIC0gc3BlZWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBvbGRXaWR0aCA9IHRoaXMuaW1nRGF0YS53aWR0aFxyXG4gICAgICAgIGxldCBvbGRIZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0XHJcblxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMuaW1nRGF0YS53aWR0aCAqIHhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5pbWdEYXRhLmhlaWdodCAqIHhcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPCB0aGlzLnJlYWxXaWR0aCkge1xyXG4gICAgICAgICAgICBsZXQgX3ggPSB0aGlzLnJlYWxXaWR0aCAvIHRoaXMuaW1nRGF0YS53aWR0aFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5pbWdEYXRhLmhlaWdodCAqIF94XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5oZWlnaHQgPCB0aGlzLnJlYWxIZWlnaHQpIHtcclxuICAgICAgICAgICAgbGV0IF94ID0gdGhpcy5yZWFsSGVpZ2h0IC8gdGhpcy5pbWdEYXRhLmhlaWdodFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMuaW1nRGF0YS53aWR0aCAqIF94XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvbGRXaWR0aC50b0ZpeGVkKDIpICE9PSB0aGlzLmltZ0RhdGEud2lkdGgudG9GaXhlZCgyKSB8fCBvbGRIZWlnaHQudG9GaXhlZCgyKSAhPT0gdGhpcy5pbWdEYXRhLmhlaWdodC50b0ZpeGVkKDIpKSB7XHJcbiAgICAgICAgICBsZXQgb2Zmc2V0WCA9ICh4IC0gMSkgKiAocG9zLnggLSB0aGlzLmltZ0RhdGEuc3RhcnRYKVxyXG4gICAgICAgICAgbGV0IG9mZnNldFkgPSAoeCAtIDEpICogKHBvcy55IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSlcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYIC0gb2Zmc2V0WFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHRoaXMuaW1nRGF0YS5zdGFydFkgLSBvZmZzZXRZXHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLlpPT01fRVZFTlQpXHJcbiAgICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHBhaW50QmFja2dyb3VuZCAoKSB7XHJcbiAgICAgICAgbGV0IGJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAnI2U2ZTZlNicgOiB0aGlzLmNhbnZhc0NvbG9yXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGRyYXcgKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmltZ0RhdGFcclxuICAgICAgICBpZiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xyXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wYWludEJhY2tncm91bmQoKVxyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodClcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdlbmVyYXRlRGF0YVVybCAodHlwZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVybiAnJ1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwodHlwZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdlbmVyYXRlQmxvYiAoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4gbnVsbFxyXG4gICAgICAgIHRoaXMuY2FudmFzLnRvQmxvYihjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHByb21pc2VkQmxvYiAoLi4uYXJncykge1xyXG4gICAgICAgIGlmICh0eXBlb2YgUHJvbWlzZSA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgY29uc29sZS53YXJuKCdObyBQcm9taXNlIHN1cHBvcnQuIFBsZWFzZSBhZGQgUHJvbWlzZSBwb2x5ZmlsbCBpZiB5b3Ugd2FudCB0byB1c2UgdGhpcyBtZXRob2QuJylcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUJsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICAgICAgICByZXNvbHZlKGJsb2IpXHJcbiAgICAgICAgICAgIH0sIGFyZ3MpXHJcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycilcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZSBsYW5nPVwic3R5bHVzXCI+XHJcbiAgLmNyb3BwYS1jb250YWluZXIgXHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2tcclxuICAgIGN1cnNvcjogcG9pbnRlclxyXG4gICAgdHJhbnNpdGlvbjogYWxsIC4zc1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlXHJcbiAgICBmb250LXNpemU6IDBcclxuICAgIGNhbnZhc1xyXG4gICAgICB0cmFuc2l0aW9uOiBhbGwgLjNzXHJcbiAgICAmOmhvdmVyXHJcbiAgICAgIG9wYWNpdHk6IC43XHJcbiAgICAmLmNyb3BwYS0tZHJvcHpvbmVcclxuICAgICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDEwcHggbGlnaHRuZXNzKGJsYWNrLCAyMCUpXHJcbiAgICAgIGNhbnZhc1xyXG4gICAgICAgIG9wYWNpdHk6IC41XHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWQtY2MgXHJcbiAgICAgIGN1cnNvcjogZGVmYXVsdFxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgJi5jcm9wcGEtLWhhcy10YXJnZXRcclxuICAgICAgY3Vyc29yOiBtb3ZlXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICYuY3JvcHBhLS1kaXNhYmxlZC1telxyXG4gICAgICAgIGN1cnNvcjogZGVmYXVsdFxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkXHJcbiAgICAgIGN1cnNvcjogbm90LWFsbG93ZWRcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgIHN2Zy5pY29uLXJlbW92ZVxyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGVcclxuICAgICAgYmFja2dyb3VuZDogd2hpdGVcclxuICAgICAgYm9yZGVyLXJhZGl1czogNTAlXHJcbiAgICAgIGZpbHRlcjogZHJvcC1zaGFkb3coLTJweCAycHggMnB4IHJnYmEoMCwgMCwgMCwgMC43KSlcclxuICAgICAgei1pbmRleDogMTBcclxuICAgICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHdoaXRlXHJcblxyXG48L3N0eWxlPlxyXG4iLCJpbXBvcnQgY3JvcHBlciBmcm9tICcuL2Nyb3BwZXIudnVlJ1xyXG5cclxuY29uc3QgVnVlQ3JvcHBhID0ge1xyXG4gIGluc3RhbGw6IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XHJcbiAgICBsZXQgdmVyc2lvbiA9IE51bWJlcihWdWUudmVyc2lvbi5zcGxpdCgnLicpWzBdKVxyXG4gICAgaWYgKHZlcnNpb24gPCAyKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdnVlLWNyb3BwYSBzdXBwb3J0cyB2dWUgdmVyc2lvbiAyLjAgYW5kIGFib3ZlLiBZb3UgYXJlIHVzaW5nIFZ1ZUAke3ZlcnNpb259LiBQbGVhc2UgdXBncmFkZSB0byB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgVnVlLmApXHJcbiAgICB9XHJcbiAgICBsZXQgY29tcG9uZW50TmFtZSA9IG9wdGlvbnMuY29tcG9uZW50TmFtZSB8fCAnY3JvcHBhJ1xyXG4gICAgVnVlLmNvbXBvbmVudChjb21wb25lbnROYW1lLCBjcm9wcGVyKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVnVlQ3JvcHBhIl0sIm5hbWVzIjpbInBvaW50Iiwidm0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsImV2dCIsInBvaW50ZXIiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJvbmVQb2ludENvb3JkIiwicG9pbnRlcjEiLCJwb2ludGVyMiIsImNvb3JkMSIsImNvb3JkMiIsIk1hdGgiLCJzcXJ0IiwicG93IiwieCIsInkiLCJpbWciLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsImRvY3VtZW50Iiwid2luZG93IiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwibGVuZ3RoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsImN1cnJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJ0aW1lVG9DYWxsIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiYXJnIiwiaXNBcnJheSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIkhUTUxDYW52YXNFbGVtZW50IiwiYmluU3RyIiwibGVuIiwiYXJyIiwidG9CbG9iIiwiZGVmaW5lUHJvcGVydHkiLCJ0eXBlIiwiYXRvYiIsInRvRGF0YVVSTCIsInNwbGl0IiwiVWludDhBcnJheSIsImkiLCJjaGFyQ29kZUF0IiwiQmxvYiIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJmbG9vciIsInZhbCIsIlN0cmluZyIsIkJvb2xlYW4iLCJQQ1RfUEVSX1pPT00iLCJNSU5fTVNfUEVSX0NMSUNLIiwiQ0xJQ0tfTU9WRV9USFJFU0hPTEQiLCJNSU5fV0lEVEgiLCJERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCIsIlBJTkNIX0FDQ0VMRVJBVElPTiIsIkRFQlVHIiwicmVuZGVyIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsInBsYWNlaG9sZGVyRm9udFNpemUiLCJpbml0IiwickFGUG9seWZpbGwiLCJ0b0Jsb2JQb2x5ZmlsbCIsIiRvcHRpb25zIiwiX3BhcmVudExpc3RlbmVycyIsIndhcm4iLCJzdXBwb3J0cyIsInN1cHBvcnREZXRlY3Rpb24iLCJiYXNpYyIsImluc3RhbmNlIiwiJHJlZnMiLCJyZWFsV2lkdGgiLCJyZWFsSGVpZ2h0Iiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjYW52YXNDb2xvciIsImN0eCIsImdldENvbnRleHQiLCJzZXRJbml0aWFsIiwiJGVtaXQiLCJldmVudHMiLCJJTklUX0VWRU5UIiwiZmlsZUlucHV0IiwiZmlsZXMiLCJhbW91bnQiLCJtb3ZlIiwiem9vbSIsIiRuZXh0VGljayIsInJlbW92ZSIsImNob29zZUZpbGUiLCJnZW5lcmF0ZURhdGFVcmwiLCJnZW5lcmF0ZUJsb2IiLCJwcm9taXNlZEJsb2IiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiRmlsZSIsIkZpbGVSZWFkZXIiLCJGaWxlTGlzdCIsInBhaW50QmFja2dyb3VuZCIsInRleHRCYXNlbGluZSIsInRleHRBbGlnbiIsImRlZmF1bHRGb250U2l6ZSIsInBsYWNlaG9sZGVyIiwiZm9udFNpemUiLCJyZWFsUGxhY2Vob2xkZXJGb250U2l6ZSIsImZvbnQiLCJmaWxsU3R5bGUiLCJwbGFjZWhvbGRlckNvbG9yIiwiZmlsbFRleHQiLCJoYWRJbWFnZSIsImltZ0RhdGEiLCJJTUFHRV9SRU1PVkVfRVZFTlQiLCJzcmMiLCIkc2xvdHMiLCJpbml0aWFsIiwidk5vZGUiLCJ0YWciLCJlbG0iLCJpbml0aWFsSW1hZ2UiLCJJbWFnZSIsInNldEF0dHJpYnV0ZSIsInUiLCJpbWFnZUxvYWRlZCIsImltZ0NvbnRlbnRJbml0Iiwib25sb2FkIiwib25lcnJvciIsImNsaWNrIiwibG9nIiwiZGlzYWJsZUNsaWNrVG9DaG9vc2UiLCJkaXNhYmxlZCIsInN1cHBvcnRUb3VjaCIsImlucHV0IiwiZmlsZSIsIm9uTmV3RmlsZUluIiwiRklMRV9DSE9PU0VfRVZFTlQiLCJmaWxlU2l6ZUlzVmFsaWQiLCJGSUxFX1NJWkVfRVhDRUVEX0VWRU5UIiwiRXJyb3IiLCJmaWxlU2l6ZUxpbWl0IiwiZmlsZVR5cGVJc1ZhbGlkIiwiRklMRV9UWVBFX01JU01BVENIX0VWRU5UIiwibmFtZSIsInRvTG93ZXJDYXNlIiwicG9wIiwiYWNjZXB0IiwiZnIiLCJlIiwiZmlsZURhdGEiLCJ0YXJnZXQiLCJyZXN1bHQiLCJjcm9zc09yaWdpbiIsInJlYWRBc0RhdGFVUkwiLCJzaXplIiwiYmFzZU1pbWV0eXBlIiwicmVwbGFjZSIsInR5cGVzIiwidCIsInRyaW0iLCJjaGFyQXQiLCJzbGljZSIsInRlc3QiLCJmaWxlQmFzZVR5cGUiLCJzdGFydFgiLCJzdGFydFkiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsIm5hdHVyYWxIZWlnaHQiLCJpbWdSYXRpbyIsImNhbnZhc1JhdGlvIiwicmF0aW8iLCJkcmF3IiwicG9pbnRlck1vdmVkIiwicG9pbnRlckNvb3JkIiwiZ2V0UG9pbnRlckNvb3JkcyIsInBvaW50ZXJTdGFydENvb3JkIiwidGFiU3RhcnQiLCJ2YWx1ZU9mIiwid2hpY2giLCJkcmFnZ2luZyIsInBpbmNoaW5nIiwiY29vcmQiLCJsYXN0TW92aW5nQ29vcmQiLCJkaXNhYmxlUGluY2hUb1pvb20iLCJwaW5jaERpc3RhbmNlIiwiZ2V0UGluY2hEaXN0YW5jZSIsImNhbmNlbEV2ZW50cyIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYW5kbGVQb2ludGVyRW5kIiwicG9pbnRlck1vdmVEaXN0YW5jZSIsInRhYkVuZCIsImRpc2FibGVEcmFnVG9Nb3ZlIiwicHJldmVudERlZmF1bHQiLCJkaXN0YW5jZSIsImRlbHRhIiwiZGlzYWJsZVNjcm9sbFRvWm9vbSIsIndoZWVsRGVsdGEiLCJkZWx0YVkiLCJkZXRhaWwiLCJyZXZlcnNlWm9vbWluZ0dlc3R1cmUiLCJyZXZlcnNlU2Nyb2xsVG9ab29tIiwiZGlzYWJsZURyYWdBbmREcm9wIiwiZmlsZURyYWdnZWRPdmVyIiwiZHQiLCJkYXRhVHJhbnNmZXIiLCJpdGVtcyIsIml0ZW0iLCJraW5kIiwiZ2V0QXNGaWxlIiwib2Zmc2V0Iiwib2xkWCIsIm9sZFkiLCJwcmV2ZW50V2hpdGVTcGFjZSIsInByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UiLCJNT1ZFX0VWRU5UIiwiem9vbUluIiwicG9zIiwiaW5uZXJBY2NlbGVyYXRpb24iLCJyZWFsU3BlZWQiLCJ6b29tU3BlZWQiLCJzcGVlZCIsIm9sZFdpZHRoIiwib2xkSGVpZ2h0IiwiX3giLCJ0b0ZpeGVkIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJaT09NX0VWRU5UIiwiZmlsbFJlY3QiLCJkcmF3SW1hZ2UiLCJtaW1lVHlwZSIsInF1YWxpdHlBcmd1bWVudCIsImFyZ3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImJsb2IiLCJlcnIiLCJWdWVDcm9wcGEiLCJWdWUiLCJvcHRpb25zIiwidmVyc2lvbiIsImNvbXBvbmVudE5hbWUiLCJjb21wb25lbnQiLCJjcm9wcGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLFFBQWU7ZUFBQSx5QkFDQ0EsS0FERCxFQUNRQyxFQURSLEVBQ1k7UUFDakJDLE1BRGlCLEdBQ0dELEVBREgsQ0FDakJDLE1BRGlCO1FBQ1RDLE9BRFMsR0FDR0YsRUFESCxDQUNURSxPQURTOztRQUVuQkMsT0FBT0YsT0FBT0cscUJBQVAsRUFBWDtRQUNJQyxVQUFVTixNQUFNTSxPQUFwQjtRQUNJQyxVQUFVUCxNQUFNTyxPQUFwQjtXQUNPO1NBQ0YsQ0FBQ0QsVUFBVUYsS0FBS0ksSUFBaEIsSUFBd0JMLE9BRHRCO1NBRUYsQ0FBQ0ksVUFBVUgsS0FB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
