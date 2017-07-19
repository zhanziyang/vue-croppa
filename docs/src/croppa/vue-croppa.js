/*
 * vue-croppa v0.1.1
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
  },
  eventHasFile: function eventHasFile(evt) {
    var dt = evt.dataTransfer || evt.originalEvent.dataTransfer;
    if (dt.types) {
      for (var i = 0, len = dt.types.length; i < len; i++) {
        if (dt.types[i] == 'Files') {
          return true;
        }
      }
    }

    return false;
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
    default: '.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.tiff'
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

var component = { render: function render() {
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
      if (this.disabled || this.disableDragAndDrop || this.img || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = true;
    },
    handleDragLeave: function handleDragLeave(evt) {
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = false;
    },
    handleDragOver: function handleDragOver(evt) {},
    handleDrop: function handleDrop(evt) {
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
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
      this.ctx.clearRect(0, 0, this.realWidth, this.realHeight);
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

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var defaultOptions = {
  componentName: 'croppa'
};

var VueCroppa = {
  install: function install(Vue, options) {
    options = index({}, defaultOptions, options);
    var version = Number(Vue.version.split('.')[0]);
    if (version < 2) {
      throw new Error('vue-croppa supports vue version 2.0 and above. You are using Vue@' + version + '. Please upgrade to the latest version of Vue.');
    }
    var componentName = options.componentName || 'croppa';

    // registration
    Vue.component(componentName, component);
  },

  component: component
};

return VueCroppa;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgb25lUG9pbnRDb29yZChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyhldnQsIHZtKSB7XHJcbiAgICBsZXQgcG9pbnRlclxyXG4gICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzWzBdKSB7XHJcbiAgICAgIHBvaW50ZXIgPSBldnQudG91Y2hlc1swXVxyXG4gICAgfSBlbHNlIGlmIChldnQuY2hhbmdlZFRvdWNoZXMgJiYgZXZ0LmNoYW5nZWRUb3VjaGVzWzBdKSB7XHJcbiAgICAgIHBvaW50ZXIgPSBldnQuY2hhbmdlZFRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBvaW50ZXIgPSBldnRcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlciwgdm0pXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hEaXN0YW5jZShldnQsIHZtKSB7XHJcbiAgICBsZXQgcG9pbnRlcjEgPSBldnQudG91Y2hlc1swXVxyXG4gICAgbGV0IHBvaW50ZXIyID0gZXZ0LnRvdWNoZXNbMV1cclxuICAgIGxldCBjb29yZDEgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjEsIHZtKVxyXG4gICAgbGV0IGNvb3JkMiA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMiwgdm0pXHJcblxyXG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhjb29yZDEueCAtIGNvb3JkMi54LCAyKSArIE1hdGgucG93KGNvb3JkMS55IC0gY29vcmQyLnksIDIpKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoQ2VudGVyQ29vcmQoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZChpbWcpIHtcclxuICAgIHJldHVybiBpbWcuY29tcGxldGUgJiYgaW1nLm5hdHVyYWxXaWR0aCAhPT0gMFxyXG4gIH0sXHJcblxyXG4gIHJBRlBvbHlmaWxsKCkge1xyXG4gICAgLy8gckFGIHBvbHlmaWxsXHJcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB3aW5kb3cgPT0gJ3VuZGVmaW5lZCcpIHJldHVyblxyXG4gICAgdmFyIGxhc3RUaW1lID0gMFxyXG4gICAgdmFyIHZlbmRvcnMgPSBbJ3dlYmtpdCcsICdtb3onXVxyXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXVxyXG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8ICAgIC8vIFdlYmtpdOS4reatpOWPlua2iOaWueazleeahOWQjeWtl+WPmOS6hlxyXG4gICAgICAgIHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxyXG4gICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYuNyAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSlcclxuICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2YXIgYXJnID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgICBjYWxsYmFjayhhcmcpXHJcbiAgICAgICAgfSwgdGltZVRvQ2FsbClcclxuICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbFxyXG4gICAgICAgIHJldHVybiBpZFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSkge1xyXG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQoaWQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBBcnJheS5pc0FycmF5ID0gZnVuY3Rpb24gKGFyZykge1xyXG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykgPT09ICdbb2JqZWN0IEFycmF5XSdcclxuICAgIH1cclxuICB9LFxyXG5cclxuICB0b0Jsb2JQb2x5ZmlsbCgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlKGV2dCkge1xyXG4gICAgdmFyIGR0ID0gZXZ0LmRhdGFUcmFuc2ZlciB8fCBldnQub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXJcclxuICAgIGlmIChkdC50eXBlcykge1xyXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZHQudHlwZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAoZHQudHlwZXNbaV0gPT0gJ0ZpbGVzJykge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcbn0iLCJOdW1iZXIuaXNJbnRlZ2VyID0gTnVtYmVyLmlzSW50ZWdlciB8fCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB2YWx1ZTogT2JqZWN0LFxyXG4gIHdpZHRoOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGhlaWdodDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMjAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBwbGFjZWhvbGRlcjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ0Nob29zZSBhbiBpbWFnZSdcclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjNjA2MDYwJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJGb250U2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGNhbnZhc0NvbG9yOiB7XHJcbiAgICBkZWZhdWx0OiAnI2U2ZTZlNidcclxuICB9LFxyXG4gIHF1YWxpdHk6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIodmFsKSAmJiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICB6b29tU3BlZWQ6IHtcclxuICAgIGRlZmF1bHQ6IDMsXHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGFjY2VwdDoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJy5qcGcsLmpwZWcsLnBuZywuZ2lmLC5ibXAsLndlYnAsLnN2ZywudGlmZidcclxuICB9LFxyXG4gIGZpbGVTaXplTGltaXQ6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+PSAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBkaXNhYmxlZDogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ0FuZERyb3A6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZUNsaWNrVG9DaG9vc2U6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZURyYWdUb01vdmU6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUGluY2hUb1pvb206IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVpvb21pbmdHZXN0dXJlOiBCb29sZWFuLCAvLyBkZXByZWNhdGVkXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9LFxyXG4gIGluaXRpYWxJbWFnZTogU3RyaW5nXHJcbn0iLCJleHBvcnQgZGVmYXVsdCB7XG4gIElOSVRfRVZFTlQ6ICdpbml0JyxcbiAgRklMRV9DSE9PU0VfRVZFTlQ6ICdmaWxlLWNob29zZScsXG4gIEZJTEVfU0laRV9FWENFRURfRVZFTlQ6ICdmaWxlLXNpemUtZXhjZWVkJyxcbiAgRklMRV9UWVBFX01JU01BVENIX0VWRU5UOiAnZmlsZS10eXBlLW1pc21hdGNoJyxcbiAgSU1BR0VfUkVNT1ZFX0VWRU5UOiAnaW1hZ2UtcmVtb3ZlJyxcbiAgTU9WRV9FVkVOVDogJ21vdmUnLFxuICBaT09NX0VWRU5UOiAnem9vbSdcbn0iLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiA6Y2xhc3M9XCJgY3JvcHBhLWNvbnRhaW5lciAke2ltZyA/ICdjcm9wcGEtLWhhcy10YXJnZXQnIDogJyd9ICR7ZGlzYWJsZWQgPyAnY3JvcHBhLS1kaXNhYmxlZCcgOiAnJ30gJHtkaXNhYmxlQ2xpY2tUb0Nob29zZSA/ICdjcm9wcGEtLWRpc2FibGVkLWNjJyA6ICcnfSAke2Rpc2FibGVEcmFnVG9Nb3ZlICYmIGRpc2FibGVTY3JvbGxUb1pvb20gPyAnY3JvcHBhLS1kaXNhYmxlZC1teicgOiAnJ30gJHtmaWxlRHJhZ2dlZE92ZXIgPyAnY3JvcHBhLS1kcm9wem9uZScgOiAnJ31gXCJcclxuICAgICAgIEBkcmFnZW50ZXIuc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJhZ0VudGVyXCJcclxuICAgICAgIEBkcmFnbGVhdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJhZ0xlYXZlXCJcclxuICAgICAgIEBkcmFnb3Zlci5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcmFnT3ZlclwiXHJcbiAgICAgICBAZHJvcC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcm9wXCI+XHJcbiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIlxyXG4gICAgICAgICAgIDphY2NlcHQ9XCJhY2NlcHRcIlxyXG4gICAgICAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcclxuICAgICAgICAgICByZWY9XCJmaWxlSW5wdXRcIlxyXG4gICAgICAgICAgIGhpZGRlblxyXG4gICAgICAgICAgIEBjaGFuZ2U9XCJoYW5kbGVJbnB1dENoYW5nZVwiIC8+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaW5pdGlhbFwiXHJcbiAgICAgICAgIHN0eWxlPVwid2lkdGg6IDA7IGhlaWdodDogMDsgdmlzaWJpbGl0eTogaGlkZGVuO1wiPlxyXG4gICAgICA8c2xvdCBuYW1lPVwiaW5pdGlhbFwiPjwvc2xvdD5cclxuICAgIDwvZGl2PlxyXG4gICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIlxyXG4gICAgICAgICAgICBAY2xpY2suc3RvcC5wcmV2ZW50PVwiaGFuZGxlQ2xpY2tcIlxyXG4gICAgICAgICAgICBAdG91Y2hzdGFydC5zdG9wPVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQG1vdXNlZG93bi5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcnN0YXJ0LnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEB0b3VjaGVuZC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNoY2FuY2VsLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAbW91c2V1cC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJlbmQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyY2FuY2VsLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAdG91Y2htb3ZlLnN0b3A9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBtb3VzZW1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBARE9NTW91c2VTY3JvbGwuc3RvcD1cImhhbmRsZVdoZWVsXCJcclxuICAgICAgICAgICAgQHdoZWVsLnN0b3A9XCJoYW5kbGVXaGVlbFwiXHJcbiAgICAgICAgICAgIEBtb3VzZXdoZWVsLnN0b3A9XCJoYW5kbGVXaGVlbFwiPjwvY2FudmFzPlxyXG4gICAgPHN2ZyBjbGFzcz1cImljb24gaWNvbi1yZW1vdmVcIlxyXG4gICAgICAgICB2LWlmPVwic2hvd1JlbW92ZUJ1dHRvbiAmJiBpbWdcIlxyXG4gICAgICAgICBAY2xpY2s9XCJyZW1vdmVcIlxyXG4gICAgICAgICA6c3R5bGU9XCJgdG9wOiAtJHtoZWlnaHQvNDB9cHg7IHJpZ2h0OiAtJHt3aWR0aC80MH1weGBcIlxyXG4gICAgICAgICB2aWV3Qm94PVwiMCAwIDEwMjQgMTAyNFwiXHJcbiAgICAgICAgIHZlcnNpb249XCIxLjFcIlxyXG4gICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICAgICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcclxuICAgICAgICAgOndpZHRoPVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aC8xMFwiXHJcbiAgICAgICAgIDpoZWlnaHQ9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCI+XHJcbiAgICAgIDxwYXRoIGQ9XCJNNTExLjkyMTIzMSAwQzIyOS4xNzkwNzcgMCAwIDIyOS4yNTc4NDYgMCA1MTIgMCA3OTQuNzAyNzY5IDIyOS4xNzkwNzcgMTAyNCA1MTEuOTIxMjMxIDEwMjQgNzk0Ljc4MTUzOCAxMDI0IDEwMjQgNzk0LjcwMjc2OSAxMDI0IDUxMiAxMDI0IDIyOS4yNTc4NDYgNzk0Ljc4MTUzOCAwIDUxMS45MjEyMzEgMFpNNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDY1MC41MTU2OTIgNzMyLjA4MTIzMUM2NTAuNTE1NjkyIDczMi4wODEyMzEgNTIxLjQ5MTY5MiA1OTMuNjgzNjkyIDUxMS44ODE4NDYgNTkzLjY4MzY5MiA1MDIuNDI5NTM4IDU5My42ODM2OTIgMzczLjM2NjE1NCA3MzIuMDgxMjMxIDM3My4zNjYxNTQgNzMyLjA4MTIzMUwyOTEuNzYxMjMxIDY1MC42MzM4NDZDMjkxLjc2MTIzMSA2NTAuNjMzODQ2IDQzMC4zMTYzMDggNTIzLjUwMDMwOCA0MzAuMzE2MzA4IDUxMi4xOTY5MjMgNDMwLjMxNjMwOCA1MDAuNjk2NjE1IDI5MS43NjEyMzEgMzczLjUyMzY5MiAyOTEuNzYxMjMxIDM3My41MjM2OTJMMzczLjM2NjE1NCAyOTEuOTE4NzY5QzM3My4zNjYxNTQgMjkxLjkxODc2OSA1MDMuNDUzNTM4IDQzMC4zOTUwNzcgNTExLjg4MTg0NiA0MzAuMzk1MDc3IDUyMC4zNDk1MzggNDMwLjM5NTA3NyA2NTAuNTE1NjkyIDI5MS45MTg3NjkgNjUwLjUxNTY5MiAyOTEuOTE4NzY5TDczMi4wNDE4NDYgMzczLjUyMzY5MkM3MzIuMDQxODQ2IDM3My41MjM2OTIgNTkzLjQ0NzM4NSA1MDIuNTQ3NjkyIDU5My40NDczODUgNTEyLjE5NjkyMyA1OTMuNDQ3Mzg1IDUyMS40MTI5MjMgNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDczMi4wNDE4NDYgNjUwLjYzMzg0NlpcIlxyXG4gICAgICAgICAgICA6ZmlsbD1cInJlbW92ZUJ1dHRvbkNvbG9yXCI+PC9wYXRoPlxyXG4gICAgPC9zdmc+XHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c2NyaXB0PlxyXG4gIGltcG9ydCB1IGZyb20gJy4vdXRpbCdcclxuICBpbXBvcnQgcHJvcHMgZnJvbSAnLi9wcm9wcydcclxuICBpbXBvcnQgZXZlbnRzIGZyb20gJy4vZXZlbnRzJ1xyXG5cclxuICBjb25zdCBQQ1RfUEVSX1pPT00gPSAxIC8gMTAwMDAwIC8vIFRoZSBhbW91bnQgb2Ygem9vbWluZyBldmVyeXRpbWUgaXQgaGFwcGVucywgaW4gcGVyY2VudGFnZSBvZiBpbWFnZSB3aWR0aC5cclxuICBjb25zdCBNSU5fTVNfUEVSX0NMSUNLID0gNTAwIC8vIElmIHRvdWNoIGR1cmF0aW9uIGlzIHNob3J0ZXIgdGhhbiB0aGUgdmFsdWUsIHRoZW4gaXQgaXMgY29uc2lkZXJlZCBhcyBhIGNsaWNrLlxyXG4gIGNvbnN0IENMSUNLX01PVkVfVEhSRVNIT0xEID0gMTAwIC8vIElmIHRvdWNoIG1vdmUgZGlzdGFuY2UgaXMgZ3JlYXRlciB0aGFuIHRoaXMgdmFsdWUsIHRoZW4gaXQgd2lsbCBieSBubyBtZWFuIGJlIGNvbnNpZGVyZWQgYXMgYSBjbGljay5cclxuICBjb25zdCBNSU5fV0lEVEggPSAxMCAvLyBUaGUgbWluaW1hbCB3aWR0aCB0aGUgdXNlciBjYW4gem9vbSB0by5cclxuICBjb25zdCBERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCA9IDIgLyAzIC8vIFBsYWNlaG9sZGVyIHRleHQgYnkgZGVmYXVsdCB0YWtlcyB1cCB0aGlzIGFtb3VudCBvZiB0aW1lcyBvZiBjYW52YXMgd2lkdGguXHJcbiAgY29uc3QgUElOQ0hfQUNDRUxFUkFUSU9OID0gMiAvLyBUaGUgYW1vdW50IG9mIHRpbWVzIGJ5IHdoaWNoIHRoZSBwaW5jaGluZyBpcyBtb3JlIHNlbnNpdGl2ZSB0aGFuIHRoZSBzY29sbGluZ1xyXG4gIGNvbnN0IERFQlVHID0gZmFsc2VcclxuXHJcbiAgZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgbW9kZWw6IHtcclxuICAgICAgcHJvcDogJ3ZhbHVlJyxcclxuICAgICAgZXZlbnQ6ICdpbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBwcm9wczogcHJvcHMsXHJcblxyXG4gICAgZGF0YSAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXHJcbiAgICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICAgIGN0eDogbnVsbCxcclxuICAgICAgICBpbWc6IG51bGwsXHJcbiAgICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICAgIGxhc3RNb3ZpbmdDb29yZDogbnVsbCxcclxuICAgICAgICBpbWdEYXRhOiB7fSxcclxuICAgICAgICBkYXRhVXJsOiAnJyxcclxuICAgICAgICBmaWxlRHJhZ2dlZE92ZXI6IGZhbHNlLFxyXG4gICAgICAgIHRhYlN0YXJ0OiAwLFxyXG4gICAgICAgIHBpbmNoaW5nOiBmYWxzZSxcclxuICAgICAgICBwaW5jaERpc3RhbmNlOiAwLFxyXG4gICAgICAgIHN1cHBvcnRUb3VjaDogZmFsc2UsXHJcbiAgICAgICAgcG9pbnRlck1vdmVkOiBmYWxzZSxcclxuICAgICAgICBwb2ludGVyU3RhcnRDb29yZDogbnVsbFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgIHJlYWxXaWR0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlYWxIZWlnaHQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVhbFBsYWNlaG9sZGVyRm9udFNpemUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyRm9udFNpemUgKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtb3VudGVkICgpIHtcclxuICAgICAgdGhpcy5pbml0KClcclxuICAgICAgdS5yQUZQb2x5ZmlsbCgpXHJcbiAgICAgIHUudG9CbG9iUG9seWZpbGwoKVxyXG5cclxuICAgICAgaWYgKHRoaXMuJG9wdGlvbnMuX3BhcmVudExpc3RlbmVyc1snaW5pdGlhbC1pbWFnZS1sb2FkJ10gfHwgdGhpcy4kb3B0aW9ucy5fcGFyZW50TGlzdGVuZXJzWydpbml0aWFsLWltYWdlLWVycm9yJ10pIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ2luaXRpYWwtaW1hZ2UtbG9hZCBhbmQgaW5pdGlhbC1pbWFnZS1lcnJvciBldmVudHMgYXJlIGFscmVhZHkgZGVwcmVjYXRlZC4gUGxlYXNlIGJpbmQgdGhlbSBkaXJlY3RseSBvbiB0aGUgPGltZz4gdGFnICh0aGUgc2xvdCkuJylcclxuICAgICAgfVxyXG4gICAgICBsZXQgc3VwcG9ydHMgPSB0aGlzLnN1cHBvcnREZXRlY3Rpb24oKVxyXG4gICAgICBpZiAoIXN1cHBvcnRzLmJhc2ljKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB2dWUtY3JvcHBhIGZ1bmN0aW9uYWxpdHkuJylcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSB2YWxcclxuICAgICAgfSxcclxuICAgICAgcmVhbFdpZHRoOiAnaW5pdCcsXHJcbiAgICAgIHJlYWxIZWlnaHQ6ICdpbml0JyxcclxuICAgICAgY2FudmFzQ29sb3I6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXI6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogJ2luaXQnLFxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZTogJ2luaXQnLFxyXG4gICAgICBwcmV2ZW50V2hpdGVTcGFjZTogJ2ltZ0NvbnRlbnRJbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgIGluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kcmVmcy5jYW52YXNcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAnI2U2ZTZlNicgOiAodHlwZW9mIHRoaXMuY2FudmFzQ29sb3IgPT09ICdzdHJpbmcnID8gdGhpcy5jYW52YXNDb2xvciA6ICcnKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbCgpXHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU5JVF9FVkVOVCwge1xyXG4gICAgICAgICAgZ2V0Q2FudmFzOiAoKSA9PiB0aGlzLmNhbnZhcyxcclxuICAgICAgICAgIGdldENvbnRleHQ6ICgpID0+IHRoaXMuY3R4LFxyXG4gICAgICAgICAgZ2V0Q2hvc2VuRmlsZTogKCkgPT4gdGhpcy4kcmVmcy5maWxlSW5wdXQuZmlsZXNbMF0sXHJcbiAgICAgICAgICBnZXRBY3R1YWxJbWFnZVNpemU6ICgpID0+ICh7XHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnJlYWxXaWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgbW92ZVVwd2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogLWFtb3VudCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVEb3dud2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogYW1vdW50IH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZUxlZnR3YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAtYW1vdW50LCB5OiAwIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZVJpZ2h0d2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogYW1vdW50LCB5OiAwIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgem9vbUluOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuem9vbSh0cnVlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21PdXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKGZhbHNlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHJlZnJlc2g6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5pbml0KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGhhc0ltYWdlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhIXRoaXMuaW1nXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVzZXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdcInJlc2V0KClcIiBtZXRob2Qgd2lsbCBiZSBkZXByZWNhdGVkIGluIHRoZSBuZWFyIGZ1dHVyZSBkdWUgdG8gbWlzbmFtaW5nLiBQbGVhc2UgdXNlIFwicmVtb3ZlKClcIiBpbnN0ZWFkLiBUaGV5IGhhdmUgdGhlIHNhbWUgZWZmZWN0LicpXHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKClcclxuICAgICAgICAgIH0sIC8vIHNvb24gdG8gYmUgZGVwcmVjYXRlZCBkdWUgdG8gbWlzbmFtZWRcclxuICAgICAgICAgIHJlbW92ZTogdGhpcy5yZW1vdmUsXHJcbiAgICAgICAgICBjaG9vc2VGaWxlOiB0aGlzLmNob29zZUZpbGUsXHJcbiAgICAgICAgICBnZW5lcmF0ZURhdGFVcmw6IHRoaXMuZ2VuZXJhdGVEYXRhVXJsLFxyXG4gICAgICAgICAgZ2VuZXJhdGVCbG9iOiB0aGlzLmdlbmVyYXRlQmxvYixcclxuICAgICAgICAgIHByb21pc2VkQmxvYjogdGhpcy5wcm9taXNlZEJsb2IsXHJcbiAgICAgICAgICBzdXBwb3J0RGV0ZWN0aW9uOiB0aGlzLnN1cHBvcnREZXRlY3Rpb25cclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgc3VwcG9ydERldGVjdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICdiYXNpYyc6IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgd2luZG93LkZpbGUgJiYgd2luZG93LkZpbGVSZWFkZXIgJiYgd2luZG93LkZpbGVMaXN0ICYmIHdpbmRvdy5CbG9iLFxyXG4gICAgICAgICAgJ2RuZCc6ICdvbmRyYWdzdGFydCcgaW4gZGl2ICYmICdvbmRyb3AnIGluIGRpdlxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlbW92ZSAoKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgdGhpcy5wYWludEJhY2tncm91bmQoKVxyXG4gICAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJ1xyXG4gICAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJ1xyXG4gICAgICAgIGxldCBkZWZhdWx0Rm9udFNpemUgPSB0aGlzLnJlYWxXaWR0aCAqIERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcclxuICAgICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemUgfHwgdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZSA9PSAwKSA/IGRlZmF1bHRGb250U2l6ZSA6IHRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemVcclxuICAgICAgICBjdHguZm9udCA9IGZvbnRTaXplICsgJ3B4IHNhbnMtc2VyaWYnXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMucmVhbFdpZHRoIC8gMiwgdGhpcy5yZWFsSGVpZ2h0IC8gMilcclxuXHJcbiAgICAgICAgbGV0IGhhZEltYWdlID0gdGhpcy5pbWcgIT0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcclxuICAgICAgICB0aGlzLmltZ0RhdGEgPSB7fVxyXG5cclxuICAgICAgICBpZiAoaGFkSW1hZ2UpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLklNQUdFX1JFTU9WRV9FVkVOVClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzZXRJbml0aWFsICgpIHtcclxuICAgICAgICBsZXQgc3JjXHJcbiAgICAgICAgaWYgKHRoaXMuJHNsb3RzLmluaXRpYWwgJiYgdGhpcy4kc2xvdHMuaW5pdGlhbFswXSkge1xyXG4gICAgICAgICAgbGV0IHZOb2RlID0gdGhpcy4kc2xvdHMuaW5pdGlhbFswXVxyXG4gICAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXHJcbiAgICAgICAgICBpZiAodGFnID09ICdpbWcnICYmIGVsbSAmJiBlbG0uc3JjKSB7XHJcbiAgICAgICAgICAgIHNyYyA9IGVsbS5zcmNcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFzcmMgJiYgdGhpcy5pbml0aWFsSW1hZ2UpIHtcclxuICAgICAgICAgIHNyYyA9IHRoaXMuaW5pdGlhbEltYWdlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc3JjKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbW92ZSgpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnY3Jvc3NPcmlnaW4nLCAnYW5vbnltb3VzJylcclxuICAgICAgICBpbWcuc3JjID0gc3JjXHJcbiAgICAgICAgaWYgKHUuaW1hZ2VMb2FkZWQoaW1nKSkge1xyXG4gICAgICAgICAgdGhpcy5pbWcgPSBpbWdcclxuICAgICAgICAgIHRoaXMuaW1nQ29udGVudEluaXQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmltZyA9IGltZ1xyXG4gICAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpbWcub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNob29zZUZpbGUgKCkge1xyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LmNsaWNrKClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZUNsaWNrICgpIHtcclxuICAgICAgICBpZiAoREVCVUcpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGljaycpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5pbWcgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UgJiYgIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMuc3VwcG9ydFRvdWNoKSB7XHJcbiAgICAgICAgICB0aGlzLmNob29zZUZpbGUoKVxyXG4gICAgICAgICAgaWYgKERFQlVHKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0cmlnZ2VyIGJ5IGNsaWNrJylcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVJbnB1dENoYW5nZSAoKSB7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gdGhpcy4kcmVmcy5maWxlSW5wdXRcclxuICAgICAgICBpZiAoIWlucHV0LmZpbGVzLmxlbmd0aCkgcmV0dXJuXHJcblxyXG4gICAgICAgIGxldCBmaWxlID0gaW5wdXQuZmlsZXNbMF1cclxuICAgICAgICB0aGlzLm9uTmV3RmlsZUluKGZpbGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBvbk5ld0ZpbGVJbiAoZmlsZSkge1xyXG4gICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkZJTEVfQ0hPT1NFX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkZJTEVfU0laRV9FWENFRURfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpbGUgc2l6ZSBleGNlZWRzIGxpbWl0IHdoaWNoIGlzICcgKyB0aGlzLmZpbGVTaXplTGltaXQgKyAnIGJ5dGVzLicpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlVHlwZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIGxldCB0eXBlID0gZmlsZS50eXBlIHx8IGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcuJykucG9wKClcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmlsZSB0eXBlICgke3R5cGV9KSBkb2VzIG5vdCBtYXRjaCB3aGF0IHlvdSBzcGVjaWZpZWQgKCR7dGhpcy5hY2NlcHR9KS5gKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5GaWxlUmVhZGVyICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgICAgICAgZnIub25sb2FkID0gKGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IGZpbGVEYXRhID0gZS50YXJnZXQucmVzdWx0XHJcbiAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgICAgICBpbWcuc3JjID0gZmlsZURhdGFcclxuICAgICAgICAgICAgaW1nLmNyb3NzT3JpZ2luID0gJ0Fub255bW91cydcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmltZyA9IGltZ1xyXG4gICAgICAgICAgICAgIHRoaXMuaW1nQ29udGVudEluaXQoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBmci5yZWFkQXNEYXRhVVJMKGZpbGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmlsZVNpemVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2VcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVNpemVMaW1pdCB8fCB0aGlzLmZpbGVTaXplTGltaXQgPT0gMCkgcmV0dXJuIHRydWVcclxuXHJcbiAgICAgICAgcmV0dXJuIGZpbGUuc2l6ZSA8IHRoaXMuZmlsZVNpemVMaW1pdFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmlsZVR5cGVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgICAgbGV0IGFjY2VwdCA9IHRoaXMuYWNjZXB0IHx8ICdpbWFnZS8qJ1xyXG4gICAgICAgIGxldCBiYXNlTWltZXR5cGUgPSBhY2NlcHQucmVwbGFjZSgvXFwvLiokLywgJycpXHJcbiAgICAgICAgbGV0IHR5cGVzID0gYWNjZXB0LnNwbGl0KCcsJylcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdHlwZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgIGxldCB0eXBlID0gdHlwZXNbaV1cclxuICAgICAgICAgIGxldCB0ID0gdHlwZS50cmltKClcclxuICAgICAgICAgIGlmICh0LmNoYXJBdCgwKSA9PSAnLicpIHtcclxuICAgICAgICAgICAgaWYgKGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcuJykucG9wKCkgPT09IHQudG9Mb3dlckNhc2UoKS5zbGljZSgxKSkgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH0gZWxzZSBpZiAoL1xcL1xcKiQvLnRlc3QodCkpIHtcclxuICAgICAgICAgICAgdmFyIGZpbGVCYXNlVHlwZSA9IGZpbGUudHlwZS5yZXBsYWNlKC9cXC8uKiQvLCAnJylcclxuICAgICAgICAgICAgaWYgKGZpbGVCYXNlVHlwZSA9PT0gYmFzZU1pbWV0eXBlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmIChmaWxlLnR5cGUgPT09IHR5cGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaW1nQ29udGVudEluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLmltZy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIGxldCBpbWdSYXRpbyA9IGltZ0hlaWdodCAvIGltZ1dpZHRoXHJcbiAgICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5yZWFsSGVpZ2h0IC8gdGhpcy5yZWFsV2lkdGhcclxuXHJcbiAgICAgICAgLy8gZGlzcGxheSBhcyBmaXRcclxuICAgICAgICBpZiAoaW1nUmF0aW8gPCBjYW52YXNSYXRpbykge1xyXG4gICAgICAgICAgbGV0IHJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCByYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyByYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJTdGFydCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKERFQlVHKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygndG91Y2ggc3RhcnQnKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN1cHBvcnRUb3VjaCA9IHRydWVcclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IGZhbHNlXHJcbiAgICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5wb2ludGVyU3RhcnRDb29yZCA9IHBvaW50ZXJDb29yZFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgLy8gc2ltdWxhdGUgY2xpY2sgd2l0aCB0b3VjaCBvbiBtb2JpbGUgZGV2aWNlc1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UpIHtcclxuICAgICAgICAgIHRoaXMudGFiU3RhcnQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlnbm9yZSBtb3VzZSByaWdodCBjbGljayBhbmQgbWlkZGxlIGNsaWNrXHJcbiAgICAgICAgaWYgKGV2dC53aGljaCAmJiBldnQud2hpY2ggPiAxKSByZXR1cm5cclxuXHJcbiAgICAgICAgaWYgKCFldnQudG91Y2hlcyB8fCBldnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlXHJcbiAgICAgICAgICB0aGlzLnBpbmNoaW5nID0gZmFsc2VcclxuICAgICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xyXG4gICAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgICAgICB0aGlzLnBpbmNoaW5nID0gdHJ1ZVxyXG4gICAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjYW5jZWxFdmVudHMgPSBbJ21vdXNldXAnLCAndG91Y2hlbmQnLCAndG91Y2hjYW5jZWwnLCAncG9pbnRlcmVuZCcsICdwb2ludGVyY2FuY2VsJ11cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2FuY2VsRXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICBsZXQgZSA9IGNhbmNlbEV2ZW50c1tpXVxyXG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihlLCB0aGlzLmhhbmRsZVBvaW50ZXJFbmQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlckVuZCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKERFQlVHKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygndG91Y2ggZW5kJylcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBvaW50ZXJNb3ZlRGlzdGFuY2UgPSAwXHJcbiAgICAgICAgaWYgKHRoaXMucG9pbnRlclN0YXJ0Q29vcmQpIHtcclxuICAgICAgICAgIGxldCBwb2ludGVyQ29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgcG9pbnRlck1vdmVEaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhwb2ludGVyQ29vcmQueCAtIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQueCwgMikgKyBNYXRoLnBvdyhwb2ludGVyQ29vcmQueSAtIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQueSwgMikpIHx8IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICAgIGlmICghdGhpcy5pbWcgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UpIHtcclxuICAgICAgICAgIGxldCB0YWJFbmQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKVxyXG4gICAgICAgICAgaWYgKChwb2ludGVyTW92ZURpc3RhbmNlIDwgQ0xJQ0tfTU9WRV9USFJFU0hPTEQpICYmIHRhYkVuZCAtIHRoaXMudGFiU3RhcnQgPCBNSU5fTVNfUEVSX0NMSUNLICYmIHRoaXMuc3VwcG9ydFRvdWNoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hvb3NlRmlsZSgpXHJcbiAgICAgICAgICAgIGlmIChERUJVRykge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0cmlnZ2VyIGJ5IHRvdWNoJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy50YWJTdGFydCA9IDBcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gMFxyXG4gICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gbnVsbFxyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcclxuICAgICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gbnVsbFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlck1vdmUgKGV2dCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gdHJ1ZVxyXG5cclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnVG9Nb3ZlIHx8ICF0aGlzLmltZykgcmV0dXJuXHJcblxyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgaWYgKCFldnQudG91Y2hlcyB8fCBldnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5kcmFnZ2luZykgcmV0dXJuXHJcbiAgICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgaWYgKHRoaXMubGFzdE1vdmluZ0Nvb3JkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7XHJcbiAgICAgICAgICAgICAgeDogY29vcmQueCAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLngsXHJcbiAgICAgICAgICAgICAgeTogY29vcmQueSAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLnlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMucGluY2hpbmcpIHJldHVyblxyXG4gICAgICAgICAgbGV0IGRpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcclxuICAgICAgICAgIGxldCBkZWx0YSA9IGRpc3RhbmNlIC0gdGhpcy5waW5jaERpc3RhbmNlXHJcbiAgICAgICAgICB0aGlzLnpvb20oZGVsdGEgPiAwLCBudWxsLCBQSU5DSF9BQ0NFTEVSQVRJT04pXHJcbiAgICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSBkaXN0YW5jZVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVdoZWVsIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVTY3JvbGxUb1pvb20gfHwgIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgaWYgKGV2dC53aGVlbERlbHRhIDwgMCB8fCBldnQuZGVsdGFZID4gMCB8fCBldnQuZGV0YWlsID4gMCkge1xyXG4gICAgICAgICAgdGhpcy56b29tKHRoaXMucmV2ZXJzZVpvb21pbmdHZXN0dXJlIHx8IHRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSwgY29vcmQpXHJcbiAgICAgICAgfSBlbHNlIGlmIChldnQud2hlZWxEZWx0YSA+IDAgfHwgZXZ0LmRlbHRhWSA8IDAgfHwgZXZ0LmRldGFpbCA8IDApIHtcclxuICAgICAgICAgIHRoaXMuem9vbSghdGhpcy5yZXZlcnNlWm9vbWluZ0dlc3R1cmUgJiYgIXRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSwgY29vcmQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ0VudGVyIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnQW5kRHJvcCB8fCB0aGlzLmltZyB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSB0cnVlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcmFnTGVhdmUgKGV2dCkge1xyXG4gICAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyYWdPdmVyIChldnQpIHtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyb3AgKGV2dCkge1xyXG4gICAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuXHJcbiAgICAgICAgbGV0IGZpbGVcclxuICAgICAgICBsZXQgZHQgPSBldnQuZGF0YVRyYW5zZmVyXHJcbiAgICAgICAgaWYgKCFkdCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKGR0Lml0ZW1zKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZHQuaXRlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSBkdC5pdGVtc1tpXVxyXG4gICAgICAgICAgICBpZiAoaXRlbS5raW5kID09ICdmaWxlJykge1xyXG4gICAgICAgICAgICAgIGZpbGUgPSBpdGVtLmdldEFzRmlsZSgpXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBmaWxlID0gZHQuZmlsZXNbMF1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICB0aGlzLm9uTmV3RmlsZUluKGZpbGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbW92ZSAob2Zmc2V0KSB7XHJcbiAgICAgICAgaWYgKCFvZmZzZXQpIHJldHVyblxyXG4gICAgICAgIGxldCBvbGRYID0gdGhpcy5pbWdEYXRhLnN0YXJ0WFxyXG4gICAgICAgIGxldCBvbGRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggKz0gb2Zmc2V0LnhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZICs9IG9mZnNldC55XHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIHRoaXMucHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYICE9PSBvbGRYIHx8IHRoaXMuaW1nRGF0YS5zdGFydFkgIT09IG9sZFkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLk1PVkVfRVZFTlQpXHJcbiAgICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFkgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWFsV2lkdGggLSB0aGlzLmltZ0RhdGEuc3RhcnRYID4gdGhpcy5pbWdEYXRhLndpZHRoKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVhbEhlaWdodCAtIHRoaXMuaW1nRGF0YS5zdGFydFkgPiB0aGlzLmltZ0RhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHpvb20gKHpvb21JbiwgcG9zLCBpbm5lckFjY2VsZXJhdGlvbiA9IDEpIHtcclxuICAgICAgICBwb3MgPSBwb3MgfHwge1xyXG4gICAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXHJcbiAgICAgICAgICB5OiB0aGlzLmltZ0RhdGEuc3RhcnRZICsgdGhpcy5pbWdEYXRhLmhlaWdodCAvIDJcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJlYWxTcGVlZCA9IHRoaXMuem9vbVNwZWVkICogaW5uZXJBY2NlbGVyYXRpb25cclxuICAgICAgICBsZXQgc3BlZWQgPSAodGhpcy5yZWFsV2lkdGggKiBQQ1RfUEVSX1pPT00pICogcmVhbFNwZWVkXHJcbiAgICAgICAgbGV0IHggPSAxXHJcbiAgICAgICAgaWYgKHpvb21Jbikge1xyXG4gICAgICAgICAgeCA9IDEgKyBzcGVlZFxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbWdEYXRhLndpZHRoID4gTUlOX1dJRFRIKSB7XHJcbiAgICAgICAgICB4ID0gMSAtIHNwZWVkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb2xkV2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGhcclxuICAgICAgICBsZXQgb2xkSGVpZ2h0ID0gdGhpcy5pbWdEYXRhLmhlaWdodFxyXG5cclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGggKiB4XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHQgKiB4XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLndpZHRoIDwgdGhpcy5yZWFsV2lkdGgpIHtcclxuICAgICAgICAgICAgbGV0IF94ID0gdGhpcy5yZWFsV2lkdGggLyB0aGlzLmltZ0RhdGEud2lkdGhcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHQgKiBfeFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh0aGlzLmltZ0RhdGEuaGVpZ2h0IDwgdGhpcy5yZWFsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMucmVhbEhlaWdodCAvIHRoaXMuaW1nRGF0YS5oZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGggKiBfeFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2xkV2lkdGgudG9GaXhlZCgyKSAhPT0gdGhpcy5pbWdEYXRhLndpZHRoLnRvRml4ZWQoMikgfHwgb2xkSGVpZ2h0LnRvRml4ZWQoMikgIT09IHRoaXMuaW1nRGF0YS5oZWlnaHQudG9GaXhlZCgyKSkge1xyXG4gICAgICAgICAgbGV0IG9mZnNldFggPSAoeCAtIDEpICogKHBvcy54IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WClcclxuICAgICAgICAgIGxldCBvZmZzZXRZID0gKHggLSAxKSAqIChwb3MueSAtIHRoaXMuaW1nRGF0YS5zdGFydFkpXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gdGhpcy5pbWdEYXRhLnN0YXJ0WCAtIG9mZnNldFhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZIC0gb2Zmc2V0WVxyXG5cclxuICAgICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5aT09NX0VWRU5UKVxyXG4gICAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwYWludEJhY2tncm91bmQgKCkge1xyXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJyNlNmU2ZTYnIDogdGhpcy5jYW52YXNDb2xvclxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvclxyXG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnJlYWxXaWR0aCwgdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMucmVhbFdpZHRoLCB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBkcmF3ICgpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5pbWdEYXRhXHJcbiAgICAgICAgaWYgKHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZURhdGFVcmwgKHR5cGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4gJydcclxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXMudG9EYXRhVVJMKHR5cGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuIG51bGxcclxuICAgICAgICB0aGlzLmNhbnZhcy50b0Jsb2IoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcm9taXNlZEJsb2IgKC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAodHlwZW9mIFByb21pc2UgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGNvbnNvbGUud2FybignTm8gUHJvbWlzZSBzdXBwb3J0LiBQbGVhc2UgYWRkIFByb21pc2UgcG9seWZpbGwgaWYgeW91IHdhbnQgdG8gdXNlIHRoaXMgbWV0aG9kLicpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVCbG9iKChibG9iKSA9PiB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZShibG9iKVxyXG4gICAgICAgICAgICB9LCBhcmdzKVxyXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGUgbGFuZz1cInN0eWx1c1wiPlxyXG4gIC5jcm9wcGEtY29udGFpbmVyIFxyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrXHJcbiAgICBjdXJzb3I6IHBvaW50ZXJcclxuICAgIHRyYW5zaXRpb246IGFsbCAuM3NcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZVxyXG4gICAgZm9udC1zaXplOiAwXHJcbiAgICBjYW52YXNcclxuICAgICAgdHJhbnNpdGlvbjogYWxsIC4zc1xyXG4gICAgJjpob3ZlclxyXG4gICAgICBvcGFjaXR5OiAuN1xyXG4gICAgJi5jcm9wcGEtLWRyb3B6b25lXHJcbiAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMCAxMHB4IGxpZ2h0bmVzcyhibGFjaywgMjAlKVxyXG4gICAgICBjYW52YXNcclxuICAgICAgICBvcGFjaXR5OiAuNVxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkLWNjIFxyXG4gICAgICBjdXJzb3I6IGRlZmF1bHRcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgICYuY3JvcHBhLS1oYXMtdGFyZ2V0XHJcbiAgICAgIGN1cnNvcjogbW92ZVxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICAmLmNyb3BwYS0tZGlzYWJsZWQtbXpcclxuICAgICAgICBjdXJzb3I6IGRlZmF1bHRcclxuICAgICYuY3JvcHBhLS1kaXNhYmxlZFxyXG4gICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICBzdmcuaWNvbi1yZW1vdmVcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlXHJcbiAgICAgIGJhY2tncm91bmQ6IHdoaXRlXHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDUwJVxyXG4gICAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KC0ycHggMnB4IDJweCByZ2JhKDAsIDAsIDAsIDAuNykpXHJcbiAgICAgIHotaW5kZXg6IDEwXHJcbiAgICAgIGN1cnNvcjogcG9pbnRlclxyXG4gICAgICBib3JkZXI6IDJweCBzb2xpZCB3aGl0ZVxyXG5cclxuPC9zdHlsZT5cclxuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsImltcG9ydCBjb21wb25lbnQgZnJvbSAnLi9jcm9wcGVyLnZ1ZSdcclxuaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJ1xyXG5cclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgY29tcG9uZW50TmFtZTogJ2Nyb3BwYSdcclxufVxyXG5cclxuY29uc3QgVnVlQ3JvcHBhID0ge1xyXG4gIGluc3RhbGw6IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBhc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKVxyXG4gICAgbGV0IHZlcnNpb24gPSBOdW1iZXIoVnVlLnZlcnNpb24uc3BsaXQoJy4nKVswXSlcclxuICAgIGlmICh2ZXJzaW9uIDwgMikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHZ1ZS1jcm9wcGEgc3VwcG9ydHMgdnVlIHZlcnNpb24gMi4wIGFuZCBhYm92ZS4gWW91IGFyZSB1c2luZyBWdWVAJHt2ZXJzaW9ufS4gUGxlYXNlIHVwZ3JhZGUgdG8gdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIFZ1ZS5gKVxyXG4gICAgfVxyXG4gICAgbGV0IGNvbXBvbmVudE5hbWUgPSBvcHRpb25zLmNvbXBvbmVudE5hbWUgfHwgJ2Nyb3BwYSdcclxuXHJcbiAgICAvLyByZWdpc3RyYXRpb25cclxuICAgIFZ1ZS5jb21wb25lbnQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50KVxyXG4gIH0sXHJcblxyXG4gIGNvbXBvbmVudFxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZUNyb3BwYSJdLCJuYW1lcyI6WyJwb2ludCIsInZtIiwiY2FudmFzIiwicXVhbGl0eSIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRYIiwiY2xpZW50WSIsImxlZnQiLCJ0b3AiLCJldnQiLCJwb2ludGVyIiwidG91Y2hlcyIsImNoYW5nZWRUb3VjaGVzIiwib25lUG9pbnRDb29yZCIsInBvaW50ZXIxIiwicG9pbnRlcjIiLCJjb29yZDEiLCJjb29yZDIiLCJNYXRoIiwic3FydCIsInBvdyIsIngiLCJ5IiwiaW1nIiwiY29tcGxldGUiLCJuYXR1cmFsV2lkdGgiLCJkb2N1bWVudCIsIndpbmRvdyIsImxhc3RUaW1lIiwidmVuZG9ycyIsImxlbmd0aCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiY2FsbGJhY2siLCJjdXJyVGltZSIsIkRhdGUiLCJnZXRUaW1lIiwidGltZVRvQ2FsbCIsIm1heCIsImlkIiwic2V0VGltZW91dCIsImFyZyIsImlzQXJyYXkiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJIVE1MQ2FudmFzRWxlbWVudCIsImJpblN0ciIsImxlbiIsImFyciIsInRvQmxvYiIsImRlZmluZVByb3BlcnR5IiwidHlwZSIsImF0b2IiLCJ0b0RhdGFVUkwiLCJzcGxpdCIsIlVpbnQ4QXJyYXkiLCJpIiwiY2hhckNvZGVBdCIsIkJsb2IiLCJkdCIsImRhdGFUcmFuc2ZlciIsIm9yaWdpbmFsRXZlbnQiLCJ0eXBlcyIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJmbG9vciIsInZhbCIsIlN0cmluZyIsIkJvb2xlYW4iLCJQQ1RfUEVSX1pPT00iLCJNSU5fTVNfUEVSX0NMSUNLIiwiQ0xJQ0tfTU9WRV9USFJFU0hPTEQiLCJNSU5fV0lEVEgiLCJERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCIsIlBJTkNIX0FDQ0VMRVJBVElPTiIsIkRFQlVHIiwicmVuZGVyIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsInBsYWNlaG9sZGVyRm9udFNpemUiLCJpbml0IiwickFGUG9seWZpbGwiLCJ0b0Jsb2JQb2x5ZmlsbCIsIiRvcHRpb25zIiwiX3BhcmVudExpc3RlbmVycyIsIndhcm4iLCJzdXBwb3J0cyIsInN1cHBvcnREZXRlY3Rpb24iLCJiYXNpYyIsImluc3RhbmNlIiwiJHJlZnMiLCJyZWFsV2lkdGgiLCJyZWFsSGVpZ2h0Iiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjYW52YXNDb2xvciIsImN0eCIsImdldENvbnRleHQiLCJzZXRJbml0aWFsIiwiJGVtaXQiLCJldmVudHMiLCJJTklUX0VWRU5UIiwiZmlsZUlucHV0IiwiZmlsZXMiLCJhbW91bnQiLCJtb3ZlIiwiem9vbSIsIiRuZXh0VGljayIsInJlbW92ZSIsImNob29zZUZpbGUiLCJnZW5lcmF0ZURhdGFVcmwiLCJnZW5lcmF0ZUJsb2IiLCJwcm9taXNlZEJsb2IiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiRmlsZSIsIkZpbGVSZWFkZXIiLCJGaWxlTGlzdCIsInBhaW50QmFja2dyb3VuZCIsInRleHRCYXNlbGluZSIsInRleHRBbGlnbiIsImRlZmF1bHRGb250U2l6ZSIsInBsYWNlaG9sZGVyIiwiZm9udFNpemUiLCJyZWFsUGxhY2Vob2xkZXJGb250U2l6ZSIsImZvbnQiLCJmaWxsU3R5bGUiLCJwbGFjZWhvbGRlckNvbG9yIiwiZmlsbFRleHQiLCJoYWRJbWFnZSIsImltZ0RhdGEiLCJJTUFHRV9SRU1PVkVfRVZFTlQiLCJzcmMiLCIkc2xvdHMiLCJpbml0aWFsIiwidk5vZGUiLCJ0YWciLCJlbG0iLCJpbml0aWFsSW1hZ2UiLCJJbWFnZSIsInNldEF0dHJpYnV0ZSIsInUiLCJpbWFnZUxvYWRlZCIsImltZ0NvbnRlbnRJbml0Iiwib25sb2FkIiwib25lcnJvciIsImNsaWNrIiwibG9nIiwiZGlzYWJsZUNsaWNrVG9DaG9vc2UiLCJkaXNhYmxlZCIsInN1cHBvcnRUb3VjaCIsImlucHV0IiwiZmlsZSIsIm9uTmV3RmlsZUluIiwiRklMRV9DSE9PU0VfRVZFTlQiLCJmaWxlU2l6ZUlzVmFsaWQiLCJGSUxFX1NJWkVfRVhDRUVEX0VWRU5UIiwiRXJyb3IiLCJmaWxlU2l6ZUxpbWl0IiwiZmlsZVR5cGVJc1ZhbGlkIiwiRklMRV9UWVBFX01JU01BVENIX0VWRU5UIiwibmFtZSIsInRvTG93ZXJDYXNlIiwicG9wIiwiYWNjZXB0IiwiZnIiLCJlIiwiZmlsZURhdGEiLCJ0YXJnZXQiLCJyZXN1bHQiLCJjcm9zc09yaWdpbiIsInJlYWRBc0RhdGFVUkwiLCJzaXplIiwiYmFzZU1pbWV0eXBlIiwicmVwbGFjZSIsInQiLCJ0cmltIiwiY2hhckF0Iiwic2xpY2UiLCJ0ZXN0IiwiZmlsZUJhc2VUeXBlIiwic3RhcnRYIiwic3RhcnRZIiwiaW1nV2lkdGgiLCJpbWdIZWlnaHQiLCJuYXR1cmFsSGVpZ2h0IiwiaW1nUmF0aW8iLCJjYW52YXNSYXRpbyIsInJhdGlvIiwiZHJhdyIsInBvaW50ZXJNb3ZlZCIsInBvaW50ZXJDb29yZCIsImdldFBvaW50ZXJDb29yZHMiLCJwb2ludGVyU3RhcnRDb29yZCIsInRhYlN0YXJ0IiwidmFsdWVPZiIsIndoaWNoIiwiZHJhZ2dpbmciLCJwaW5jaGluZyIsImNvb3JkIiwibGFzdE1vdmluZ0Nvb3JkIiwiZGlzYWJsZVBpbmNoVG9ab29tIiwicGluY2hEaXN0YW5jZSIsImdldFBpbmNoRGlzdGFuY2UiLCJjYW5jZWxFdmVudHMiLCJhZGRFdmVudExpc3RlbmVyIiwiaGFuZGxlUG9pbnRlckVuZCIsInBvaW50ZXJNb3ZlRGlzdGFuY2UiLCJ0YWJFbmQiLCJkaXNhYmxlRHJhZ1RvTW92ZSIsInByZXZlbnREZWZhdWx0IiwiZGlzdGFuY2UiLCJkZWx0YSIsImRpc2FibGVTY3JvbGxUb1pvb20iLCJ3aGVlbERlbHRhIiwiZGVsdGFZIiwiZGV0YWlsIiwicmV2ZXJzZVpvb21pbmdHZXN0dXJlIiwicmV2ZXJzZVNjcm9sbFRvWm9vbSIsImRpc2FibGVEcmFnQW5kRHJvcCIsImV2ZW50SGFzRmlsZSIsImZpbGVEcmFnZ2VkT3ZlciIsIml0ZW1zIiwiaXRlbSIsImtpbmQiLCJnZXRBc0ZpbGUiLCJvZmZzZXQiLCJvbGRYIiwib2xkWSIsInByZXZlbnRXaGl0ZVNwYWNlIiwicHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSIsIk1PVkVfRVZFTlQiLCJ6b29tSW4iLCJwb3MiLCJpbm5lckFjY2VsZXJhdGlvbiIsInJlYWxTcGVlZCIsInpvb21TcGVlZCIsInNwZWVkIiwib2xkV2lkdGgiLCJvbGRIZWlnaHQiLCJfeCIsInRvRml4ZWQiLCJvZmZzZXRYIiwib2Zmc2V0WSIsIlpPT01fRVZFTlQiLCJjbGVhclJlY3QiLCJmaWxsUmVjdCIsImRyYXdJbWFnZSIsIm1pbWVUeXBlIiwicXVhbGl0eUFyZ3VtZW50IiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYmxvYiIsImVyciIsImRlZmF1bHRPcHRpb25zIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImFzc2lnbiIsInZlcnNpb24iLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLFFBQWU7ZUFBQSx5QkFDQ0EsS0FERCxFQUNRQyxFQURSLEVBQ1k7UUFDakJDLE1BRGlCLEdBQ0dELEVBREgsQ0FDakJDLE1BRGlCO1FBQ1RDLE9BRFMsR0FDR0YsRUFESCxDQUNURSxPQURTOztRQUVuQkMsT0FBT0YsT0FBT0cscUJBQVAsRUFBWDtRQUNJQyxVQUFVTixNQUFNTSxPQUFwQjtRQUNJQyxVQUFVUCxNQUFNTyxPQUFwQjtXQUNPO1NBQ0YsQ0FBQ0QsVUFBVUYsS0FBS0ksSUFBaEIsSUFBd0JMLE9BRHRCO1NBRUYsQ0FBQ0ksVUFBVUgsS0FBS0ssR0FBaEIsSUFBdUJOO0tBRjVCO0dBTlc7a0JBQUEsNEJBWUlPLEdBWkosRUFZU1QsRUFaVCxFQVlhO1FBQ3BCVSxnQkFBSjtRQUNJRCxJQUFJRSxPQUFKLElBQWVGLElBQUlFLE9BQUosQ0FBWSxDQUFaLENBQW5CLEVBQW1DO2dCQUN2QkYsSUFBSUUsT0FBSixDQUFZLENBQVosQ0FBVjtLQURGLE1BRU8sSUFBSUYsSUFBSUcsY0FBSixJQUFzQkgsSUFBSUcsY0FBSixDQUFtQixDQUFuQixDQUExQixFQUFpRDtnQkFDNUNILElBQUlHLGNBQUosQ0FBbUIsQ0FBbkIsQ0FBVjtLQURLLE1BRUE7Z0JBQ0tILEdBQVY7O1dBRUssS0FBS0ksYUFBTCxDQUFtQkgsT0FBbkIsRUFBNEJWLEVBQTVCLENBQVA7R0FyQlc7a0JBQUEsNEJBd0JJUyxHQXhCSixFQXdCU1QsRUF4QlQsRUF3QmE7UUFDcEJjLFdBQVdMLElBQUlFLE9BQUosQ0FBWSxDQUFaLENBQWY7UUFDSUksV0FBV04sSUFBSUUsT0FBSixDQUFZLENBQVosQ0FBZjtRQUNJSyxTQUFTLEtBQUtILGFBQUwsQ0FBbUJDLFFBQW5CLEVBQTZCZCxFQUE3QixDQUFiO1FBQ0lpQixTQUFTLEtB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
