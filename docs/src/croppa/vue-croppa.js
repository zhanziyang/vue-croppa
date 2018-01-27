/*
 * vue-croppa v1.1.4
 * https://github.com/zhanziyang/vue-croppa
 * 
 * Copyright (c) 2018 zhanziyang
 * Released under the ISC license
 */
  
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Croppa = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index = createCommonjsModule(function (module, exports) {
(function (root, factory) {
    if (typeof undefined === 'function' && undefined.amd) {
        undefined([], factory);
    } else {
        module.exports = factory();
    }
}(commonjsGlobal, function () {
  'use strict';

  function drawImage(img, orientation, x, y, width, height) {
    if (!/^[1-8]$/.test(orientation)) throw new Error('orientation should be [1-8]');

    if (x == null) x = 0;
    if (y == null) y = 0;
    if (width == null) width = img.width;
    if (height == null) height = img.height;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    ctx.save();
    switch (+orientation) {
      // 1 = The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
      case 1:
          break;

      // 2 = The 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.
      case 2:
         ctx.translate(width, 0);
         ctx.scale(-1, 1);
         break;

      // 3 = The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.
      case 3:
          ctx.translate(width, height);
          ctx.rotate(180 / 180 * Math.PI);
          break;

      // 4 = The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.
      case 4:
          ctx.translate(0, height);
          ctx.scale(1, -1);
          break;

      // 5 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual top.
      case 5:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.scale(1, -1);
          break;

      // 6 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual top.
      case 6:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.translate(0, -height);
          break;

      // 7 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.
      case 7:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(270 / 180 * Math.PI);
          ctx.translate(-width, height);
          ctx.scale(1, -1);
          break;

      // 8 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.
      case 8:
          canvas.width = height;
          canvas.height = width;
          ctx.translate(0, width);
          ctx.rotate(270 / 180 * Math.PI);
          break;
    }

    ctx.drawImage(img, x, y, width, height);
    ctx.restore();

    return canvas;
  }

  return {
    drawImage: drawImage
  };
}));
});

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
  },
  getFileOrientation: function getFileOrientation(arrayBuffer) {
    var view = new DataView(arrayBuffer);
    if (view.getUint16(0, false) != 0xFFD8) return -2;
    var length = view.byteLength;
    var offset = 2;
    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) return -1;
        var little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) == 0x0112) {
            return view.getUint16(offset + i * 12 + 8, little);
          }
        }
      } else if ((marker & 0xFF00) != 0xFF00) break;else offset += view.getUint16(offset, false);
    }
    return -1;
  },
  base64ToArrayBuffer: function base64ToArrayBuffer(base64) {
    base64 = base64.replace(/^data:([^;]+);base64,/gmi, '');
    var binaryString = atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  },
  getRotatedImage: function getRotatedImage(img, orientation) {
    var _canvas = index.drawImage(img, orientation);
    var _img = new Image();
    _img.src = _canvas.toDataURL();
    return _img;
  },
  flipX: function flipX(ori) {
    if (ori % 2 == 0) {
      return ori - 1;
    }

    return ori + 1;
  },
  flipY: function flipY(ori) {
    var map = {
      1: 4,
      4: 1,
      2: 3,
      3: 2,
      5: 8,
      8: 5,
      6: 7,
      7: 6
    };

    return map[ori];
  },
  rotate90: function rotate90(ori) {
    var map = {
      1: 6,
      2: 7,
      3: 8,
      4: 5,
      5: 2,
      6: 3,
      7: 4,
      8: 1
    };

    return map[ori];
  },
  numberValid: function numberValid(n) {
    return typeof n === 'number' && !isNaN(n);
  }
};

Number.isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

var initialImageType = String;
if (typeof window !== 'undefined' && window.Image) {
  initialImageType = [String, Image];
}

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
    default: 'transparent'
  },
  quality: {
    type: Number,
    default: 2,
    validator: function validator(val) {
      return val > 0;
    }
  },
  zoomSpeed: {
    default: 3,
    type: Number,
    validator: function validator(val) {
      return val > 0;
    }
  },
  accept: String,
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
  disableRotation: Boolean,
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
  initialImage: initialImageType,
  initialSize: {
    type: String,
    default: 'cover',
    validator: function validator(val) {
      return val === 'cover' || val === 'contain' || val === 'natural';
    }
  },
  initialPosition: {
    type: String,
    default: 'center',
    validator: function validator(val) {
      var valids = ['center', 'top', 'bottom', 'left', 'right'];
      return val.split(' ').every(function (word) {
        return valids.indexOf(word) >= 0;
      }) || /^-?\d+% -?\d+%$/.test(val);
    }
  },
  inputAttrs: Object,
  showLoading: Boolean,
  loadingSize: {
    type: Number,
    default: 20
  },
  loadingColor: {
    type: String,
    default: '#606060'
  },
  replaceDrop: Boolean,
  passive: Boolean
};

var events = {
  INIT_EVENT: 'init',
  FILE_CHOOSE_EVENT: 'file-choose',
  FILE_SIZE_EXCEED_EVENT: 'file-size-exceed',
  FILE_TYPE_MISMATCH_EVENT: 'file-type-mismatch',
  NEW_IMAGE: 'new-image',
  NEW_IMAGE_DRAWN: 'new-image-drawn',
  IMAGE_REMOVE_EVENT: 'image-remove',
  MOVE_EVENT: 'move',
  ZOOM_EVENT: 'zoom',
  DRAW: 'draw',
  INITIAL_IMAGE_LOADED_EVENT: 'initial-image-loaded',
  LOADING_START: 'loading-start',
  LOADING_END: 'loading-end'
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var PCT_PER_ZOOM = 1 / 100000; // The amount of zooming everytime it happens, in percentage of image width.
var MIN_MS_PER_CLICK = 500; // If touch duration is shorter than the value, then it is considered as a click.
var CLICK_MOVE_THRESHOLD = 100; // If touch move distance is greater than this value, then it will by no mean be considered as a click.
var MIN_WIDTH = 10; // The minimal width the user can zoom to.
var DEFAULT_PLACEHOLDER_TAKEUP = 2 / 3; // Placeholder text by default takes up this amount of times of canvas width.
var PINCH_ACCELERATION = 1; // The amount of times by which the pinching is more sensitive than the scolling

var syncData = ['imgData', 'img', 'imgSet', 'originalImage', 'naturalHeight', 'naturalWidth', 'orientation', 'scaleRatio'];
// const DEBUG = false

var component = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { ref: "wrapper", class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') + ' ' + (_vm.passive ? 'croppa--passive' : '') + ' ' + (_vm.disabled ? 'croppa--disabled' : '') + ' ' + (_vm.disableClickToChoose ? 'croppa--disabled-cc' : '') + ' ' + (_vm.disableDragToMove && _vm.disableScrollToZoom ? 'croppa--disabled-mz' : '') + ' ' + (_vm.fileDraggedOver ? 'croppa--dropzone' : ''), on: { "dragenter": function dragenter($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDragEnter($event);
        }, "dragleave": function dragleave($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDragLeave($event);
        }, "dragover": function dragover($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDragOver($event);
        }, "drop": function drop($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDrop($event);
        } } }, [_c('input', _vm._b({ ref: "fileInput", staticStyle: { "height": "1px", "width": "1px", "overflow": "hidden", "margin-left": "-99999px", "position": "absolute" }, attrs: { "type": "file", "accept": _vm.accept, "disabled": _vm.disabled }, on: { "change": _vm._handleInputChange } }, 'input', _vm.inputAttrs)), _c('div', { staticClass: "slots", staticStyle: { "width": "0", "height": "0", "visibility": "hidden" } }, [_vm._t("initial"), _vm._t("placeholder")], 2), _c('canvas', { ref: "canvas", on: { "click": function click($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleClick($event);
        }, "touchstart": function touchstart($event) {
          $event.stopPropagation();_vm._handlePointerStart($event);
        }, "mousedown": function mousedown($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerStart($event);
        }, "pointerstart": function pointerstart($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerStart($event);
        }, "touchend": function touchend($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "touchcancel": function touchcancel($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "mouseup": function mouseup($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "pointerend": function pointerend($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "pointercancel": function pointercancel($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "touchmove": function touchmove($event) {
          $event.stopPropagation();_vm._handlePointerMove($event);
        }, "mousemove": function mousemove($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerMove($event);
        }, "pointermove": function pointermove($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerMove($event);
        }, "pointerleave": function pointerleave($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerLeave($event);
        }, "DOMMouseScroll": function DOMMouseScroll($event) {
          $event.stopPropagation();_vm._handleWheel($event);
        }, "wheel": function wheel($event) {
          $event.stopPropagation();_vm._handleWheel($event);
        }, "mousewheel": function mousewheel($event) {
          $event.stopPropagation();_vm._handleWheel($event);
        } } }), _vm.showRemoveButton && _vm.img && !_vm.passive ? _c('svg', { staticClass: "icon icon-remove", style: 'top: -' + _vm.height / 40 + 'px; right: -' + _vm.width / 40 + 'px', attrs: { "viewBox": "0 0 1024 1024", "version": "1.1", "xmlns": "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", "width": _vm.removeButtonSize || _vm.width / 10, "height": _vm.removeButtonSize || _vm.width / 10 }, on: { "click": _vm.remove } }, [_c('path', { attrs: { "d": "M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z", "fill": _vm.removeButtonColor } })]) : _vm._e(), _vm.showLoading && _vm.loading ? _c('div', { staticClass: "sk-fading-circle", style: _vm.loadingStyle }, _vm._l(12, function (i) {
      return _c('div', { key: i, class: 'sk-circle' + i + ' sk-circle' }, [_c('div', { staticClass: "sk-circle-indicator", style: { backgroundColor: _vm.loadingColor } })]);
    })) : _vm._e(), _vm._t("default")], 2);
  }, staticRenderFns: [],
  model: {
    prop: 'value',
    event: events.INIT_EVENT
  },

  props: props,

  data: function data() {
    return {
      canvas: null,
      ctx: null,
      originalImage: null,
      img: null,
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
      loading: false
    };
  },


  computed: {
    outputWidth: function outputWidth() {
      return this.width * this.quality;
    },
    outputHeight: function outputHeight() {
      return this.height * this.quality;
    },
    computedPlaceholderFontSize: function computedPlaceholderFontSize() {
      return this.placeholderFontSize * this.quality;
    },
    aspectRatio: function aspectRatio() {
      return this.naturalWidth / this.naturalHeight;
    },
    loadingStyle: function loadingStyle() {
      return {
        width: this.loadingSize + 'px',
        height: this.loadingSize + 'px',
        right: '15px',
        bottom: '10px'
      };
    }
  },

  mounted: function mounted() {
    var _this = this;

    this._initialize();
    u.rAFPolyfill();
    u.toBlobPolyfill();

    var supports = this.supportDetection();
    if (!supports.basic) {
      console.warn('Your browser does not support vue-croppa functionality.');
    }

    if (this.passive) {
      this.$watch('value._data', function (data) {
        var set$$1 = false;
        if (!data) return;
        for (var key in data) {
          if (syncData.indexOf(key) >= 0) {
            var val = data[key];
            if (val !== _this[key]) {
              _this.$set(_this, key, val);
              set$$1 = true;
            }
          }
        }
        if (set$$1) {
          if (!_this.img) {
            _this.remove();
          } else {
            _this.$nextTick(function () {
              _this._draw();
            });
          }
        }
      }, {
        deep: true
      });
    }
  },


  watch: {
    outputWidth: function outputWidth() {
      this.onDimensionChange();
    },
    outputHeight: function outputHeight() {
      this.onDimensionChange();
    },
    canvasColor: function canvasColor() {
      if (!this.img) {
        this._setPlaceholders();
      } else {
        this._draw();
      }
    },
    placeholder: function placeholder() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    placeholderColor: function placeholderColor() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    computedPlaceholderFontSize: function computedPlaceholderFontSize() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    preventWhiteSpace: function preventWhiteSpace(val) {
      if (val) {
        this.imageSet = false;
      }
      this._placeImage();
    },
    scaleRatio: function scaleRatio(val, oldVal) {
      if (this.passive) return;
      if (!this.img) return;
      if (!u.numberValid(val)) return;

      var x = 1;
      if (u.numberValid(oldVal) && oldVal !== 0) {
        x = val / oldVal;
      }
      var pos = this.currentPointerCoord || {
        x: this.imgData.startX + this.imgData.width / 2,
        y: this.imgData.startY + this.imgData.height / 2
      };
      this.imgData.width = this.naturalWidth * val;
      this.imgData.height = this.naturalHeight * val;

      if (this.preventWhiteSpace) {
        this._preventZoomingToWhiteSpace();
        this._preventMovingToWhiteSpace();
      }

      if (this.userMetadata || !this.imageSet || this.rotating) return;
      var offsetX = (x - 1) * (pos.x - this.imgData.startX);
      var offsetY = (x - 1) * (pos.y - this.imgData.startY);
      this.imgData.startX = this.imgData.startX - offsetX;
      this.imgData.startY = this.imgData.startY - offsetY;
    },

    'imgData.width': function imgDataWidth(val, oldVal) {
      // if (this.passive) return
      if (!u.numberValid(val)) return;
      this.scaleRatio = val / this.naturalWidth;
      if (this.hasImage()) {
        if (Math.abs(val - oldVal) > val * (1 / 100000)) {
          this.$emit(events.ZOOM_EVENT);
          this._draw();
        }
      }
    },
    'imgData.height': function imgDataHeight(val) {
      // if (this.passive) return
      if (!u.numberValid(val)) return;
      this.scaleRatio = val / this.naturalHeight;
    },
    'imgData.startX': function imgDataStartX(val) {
      // if (this.passive) return
      if (this.hasImage()) {
        this.$nextTick(this._draw);
      }
    },
    'imgData.startY': function imgDataStartY(val) {
      // if (this.passive) return
      if (this.hasImage()) {
        this.$nextTick(this._draw);
      }
    },
    loading: function loading(val) {
      if (this.passive) return;
      if (val) {
        this.$emit(events.LOADING_START);
      } else {
        this.$emit(events.LOADING_END);
      }
    }
  },

  methods: {
    getCanvas: function getCanvas() {
      return this.canvas;
    },
    getContext: function getContext() {
      return this.ctx;
    },
    getChosenFile: function getChosenFile() {
      return this.$refs.fileInput.files[0];
    },
    move: function move(offset) {
      if (!offset || this.passive) return;
      var oldX = this.imgData.startX;
      var oldY = this.imgData.startY;
      this.imgData.startX += offset.x;
      this.imgData.startY += offset.y;
      if (this.preventWhiteSpace) {
        this._preventMovingToWhiteSpace();
      }
      if (this.imgData.startX !== oldX || this.imgData.startY !== oldY) {
        this.$emit(events.MOVE_EVENT);
        this._draw();
      }
    },
    moveUpwards: function moveUpwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: 0, y: -amount });
    },
    moveDownwards: function moveDownwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: 0, y: amount });
    },
    moveLeftwards: function moveLeftwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: -amount, y: 0 });
    },
    moveRightwards: function moveRightwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: amount, y: 0 });
    },
    zoom: function zoom() {
      var zoomIn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var acceleration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      if (this.passive) return;
      var realSpeed = this.zoomSpeed * acceleration;
      var speed = this.outputWidth * PCT_PER_ZOOM * realSpeed;
      var x = 1;
      if (zoomIn) {
        x = 1 + speed;
      } else if (this.imgData.width > MIN_WIDTH) {
        x = 1 - speed;
      }

      this.scaleRatio *= x;
    },
    zoomIn: function zoomIn() {
      this.zoom(true);
    },
    zoomOut: function zoomOut() {
      this.zoom(false);
    },
    rotate: function rotate() {
      var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (this.disableRotation || this.disabled || this.passive) return;
      step = parseInt(step);
      if (isNaN(step) || step > 3 || step < -3) {
        console.warn('Invalid argument for rotate() method. It should one of the integers from -3 to 3.');
        step = 1;
      }
      this._rotateByStep(step);
    },
    flipX: function flipX() {
      if (this.disableRotation || this.disabled || this.passive) return;
      this._setOrientation(2);
    },
    flipY: function flipY() {
      if (this.disableRotation || this.disabled || this.passive) return;
      this._setOrientation(4);
    },
    refresh: function refresh() {
      this.$nextTick(this._initialize);
    },
    hasImage: function hasImage() {
      return !!this.imageSet;
    },
    applyMetadata: function applyMetadata(metadata) {
      if (!metadata || this.passive) return;
      this.userMetadata = metadata;
      var ori = metadata.orientation || this.orientation || 1;
      this._setOrientation(ori, true);
    },
    generateDataUrl: function generateDataUrl(type, compressionRate) {
      if (!this.hasImage()) return '';
      return this.canvas.toDataURL(type, compressionRate);
    },
    generateBlob: function generateBlob(callback, mimeType, qualityArgument) {
      if (!this.hasImage()) {
        callback(null);
        return;
      }
      this.canvas.toBlob(callback, mimeType, qualityArgument);
    },
    promisedBlob: function promisedBlob() {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof Promise == 'undefined') {
        console.warn('No Promise support. Please add Promise polyfill if you want to use this method.');
        return;
      }
      return new Promise(function (resolve, reject) {
        try {
          _this2.generateBlob.apply(_this2, [function (blob) {
            resolve(blob);
          }].concat(args));
        } catch (err) {
          reject(err);
        }
      });
    },
    getMetadata: function getMetadata() {
      if (!this.hasImage()) return {};
      var _imgData = this.imgData,
          startX = _imgData.startX,
          startY = _imgData.startY;


      return {
        startX: startX,
        startY: startY,
        scale: this.scaleRatio,
        orientation: this.orientation
      };
    },
    supportDetection: function supportDetection() {
      if (typeof window === 'undefined') return;
      var div = document.createElement('div');
      return {
        'basic': window.requestAnimationFrame && window.File && window.FileReader && window.FileList && window.Blob,
        'dnd': 'ondragstart' in div && 'ondrop' in div
      };
    },
    chooseFile: function chooseFile() {
      if (this.passive) return;
      this.$refs.fileInput.click();
    },
    remove: function remove() {
      this._setPlaceholders();

      var hadImage = this.img != null;
      this.originalImage = null;
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imgData = {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0
      };
      this.orientation = 1;
      this.scaleRatio = null;
      this.userMetadata = null;
      this.imageSet = false;
      this.loading = false;

      if (hadImage) {
        this.$emit(events.IMAGE_REMOVE_EVENT);
      }
    },
    _initialize: function _initialize() {
      this.canvas = this.$refs.canvas;
      this._setSize();
      this.canvas.style.backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : typeof this.canvasColor === 'string' ? this.canvasColor : '';
      this.ctx = this.canvas.getContext('2d');
      this.originalImage = null;
      this.img = null;
      this.imageSet = false;
      this._setInitial();
      if (!this.passive) {
        this.$emit(events.INIT_EVENT, this);
      }
    },
    _setSize: function _setSize() {
      this.canvas.width = this.outputWidth;
      this.canvas.height = this.outputHeight;
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
    },
    _rotateByStep: function _rotateByStep(step) {
      var orientation = 1;
      switch (step) {
        case 1:
          orientation = 6;
          break;
        case 2:
          orientation = 3;
          break;
        case 3:
          orientation = 8;
          break;
        case -1:
          orientation = 8;
          break;
        case -2:
          orientation = 3;
          break;
        case -3:
          orientation = 6;
          break;
      }
      this._setOrientation(orientation);
    },
    _setImagePlaceholder: function _setImagePlaceholder() {
      var _this3 = this;

      var img = void 0;
      if (this.$slots.placeholder && this.$slots.placeholder[0]) {
        var vNode = this.$slots.placeholder[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }

      if (!img) return;

      var onLoad = function onLoad() {
        _this3.ctx.drawImage(img, 0, 0, _this3.outputWidth, _this3.outputHeight);
      };

      if (u.imageLoaded(img)) {
        onLoad();
      } else {
        img.onload = onLoad;
      }
    },
    _setTextPlaceholder: function _setTextPlaceholder() {
      var ctx = this.ctx;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      var defaultFontSize = this.outputWidth * DEFAULT_PLACEHOLDER_TAKEUP / this.placeholder.length;
      var fontSize = !this.computedPlaceholderFontSize || this.computedPlaceholderFontSize == 0 ? defaultFontSize : this.computedPlaceholderFontSize;
      ctx.font = fontSize + 'px sans-serif';
      ctx.fillStyle = !this.placeholderColor || this.placeholderColor == 'default' ? '#606060' : this.placeholderColor;
      ctx.fillText(this.placeholder, this.outputWidth / 2, this.outputHeight / 2);
    },
    _setPlaceholders: function _setPlaceholders() {
      this._paintBackground();
      this._setImagePlaceholder();
      this._setTextPlaceholder();
    },
    _setInitial: function _setInitial() {
      var _this4 = this;

      var src = void 0,
          img = void 0;
      if (this.$slots.initial && this.$slots.initial[0]) {
        var vNode = this.$slots.initial[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }
      if (this.initialImage && typeof this.initialImage === 'string') {
        src = this.initialImage;
        img = new Image();
        if (!/^data:/.test(src) && !/^blob:/.test(src)) {
          img.setAttribute('crossOrigin', 'anonymous');
        }
        img.src = src;
      } else if (_typeof(this.initialImage) === 'object' && this.initialImage instanceof Image) {
        img = this.initialImage;
      }
      if (!src && !img) {
        this._setPlaceholders();
        return;
      }
      this.currentIsInitial = true;
      if (u.imageLoaded(img)) {
        // this.$emit(events.INITIAL_IMAGE_LOADED_EVENT)
        this._onload(img, +img.dataset['exifOrientation'], true);
      } else {
        this.loading = true;
        img.onload = function () {
          // this.$emit(events.INITIAL_IMAGE_LOADED_EVENT)
          _this4._onload(img, +img.dataset['exifOrientation'], true);
        };

        img.onerror = function () {
          _this4._setPlaceholders();
        };
      }
    },
    _onload: function _onload(img) {
      var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var initial = arguments[2];

      this.originalImage = img;
      this.img = img;

      if (isNaN(orientation)) {
        orientation = 1;
      }

      this._setOrientation(orientation);

      if (initial) {
        this.$emit(events.INITIAL_IMAGE_LOADED_EVENT);
      }
    },
    _handleClick: function _handleClick() {
      if (!this.hasImage() && !this.disableClickToChoose && !this.disabled && !this.supportTouch && !this.passive) {
        this.chooseFile();
      }
    },
    _handleInputChange: function _handleInputChange() {
      var input = this.$refs.fileInput;
      if (!input.files.length || this.passive) return;

      var file = input.files[0];
      this._onNewFileIn(file);
    },
    _onNewFileIn: function _onNewFileIn(file) {
      var _this5 = this;

      this.currentIsInitial = false;
      this.loading = true;
      this.$emit(events.FILE_CHOOSE_EVENT, file);
      if (!this._fileSizeIsValid(file)) {
        this.loading = false;
        this.$emit(events.FILE_SIZE_EXCEED_EVENT, file);
        throw new Error('File size exceeds limit which is ' + this.fileSizeLimit + ' bytes.');
      }
      if (!this._fileTypeIsValid(file)) {
        this.loading = false;
        this.$emit(events.FILE_TYPE_MISMATCH_EVENT, file);
        var type = file.type || file.name.toLowerCase().split('.').pop();
        throw new Error('File type (' + type + ') does not match what you specified (' + this.accept + ').');
      }
      if (typeof window !== 'undefined' && typeof window.FileReader !== 'undefined') {
        var fr = new FileReader();
        fr.onload = function (e) {
          var fileData = e.target.result;
          var orientation = 1;
          try {
            orientation = u.getFileOrientation(u.base64ToArrayBuffer(fileData));
          } catch (err) {}
          if (orientation < 1) orientation = 1;
          var img = new Image();
          img.src = fileData;
          img.onload = function () {
            _this5._onload(img, orientation);
            _this5.$emit(events.NEW_IMAGE);
          };
        };
        fr.readAsDataURL(file);
      }
    },
    _fileSizeIsValid: function _fileSizeIsValid(file) {
      if (!file) return false;
      if (!this.fileSizeLimit || this.fileSizeLimit == 0) return true;

      return file.size < this.fileSizeLimit;
    },
    _fileTypeIsValid: function _fileTypeIsValid(file) {
      if (!this.accepct) return true;
      var accept = this.accept;
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
    _placeImage: function _placeImage(applyMetadata) {
      if (!this.img) return;
      var imgData = this.imgData;

      this.naturalWidth = this.img.naturalWidth;
      this.naturalHeight = this.img.naturalHeight;

      imgData.startX = u.numberValid(imgData.startX) ? imgData.startX : 0;
      imgData.startY = u.numberValid(imgData.startY) ? imgData.startY : 0;

      if (this.preventWhiteSpace) {
        this._aspectFill();
      } else if (!this.imageSet) {
        if (this.initialSize == 'contain') {
          this._aspectFit();
        } else if (this.initialSize == 'natural') {
          this._naturalSize();
        } else {
          this._aspectFill();
        }
      } else {
        this.imgData.width = this.naturalWidth * this.scaleRatio;
        this.imgData.height = this.naturalHeight * this.scaleRatio;
      }

      if (!this.imageSet) {
        if (/top/.test(this.initialPosition)) {
          imgData.startY = 0;
        } else if (/bottom/.test(this.initialPosition)) {
          imgData.startY = this.outputHeight - imgData.height;
        }

        if (/left/.test(this.initialPosition)) {
          imgData.startX = 0;
        } else if (/right/.test(this.initialPosition)) {
          imgData.startX = this.outputWidth - imgData.width;
        }

        if (/^-?\d+% -?\d+%$/.test(this.initialPosition)) {
          var result = /^(-?\d+)% (-?\d+)%$/.exec(this.initialPosition);
          var x = +result[1] / 100;
          var y = +result[2] / 100;
          imgData.startX = x * (this.outputWidth - imgData.width);
          imgData.startY = y * (this.outputHeight - imgData.height);
        }
      }

      applyMetadata && this._applyMetadata();

      if (applyMetadata && this.preventWhiteSpace) {
        this.zoom(false, 0);
      } else {
        this.move({ x: 0, y: 0 });
        this._draw();
      }
    },
    _aspectFill: function _aspectFill() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var canvasRatio = this.outputWidth / this.outputHeight;
      var scaleRatio = void 0;

      if (this.aspectRatio > canvasRatio) {
        scaleRatio = imgHeight / this.outputHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.outputHeight;
        this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
        this.imgData.startY = 0;
      } else {
        scaleRatio = imgWidth / this.outputWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.outputWidth;
        this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
        this.imgData.startX = 0;
      }
    },
    _aspectFit: function _aspectFit() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var canvasRatio = this.outputWidth / this.outputHeight;
      var scaleRatio = void 0;
      if (this.aspectRatio > canvasRatio) {
        scaleRatio = imgWidth / this.outputWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.outputWidth;
        this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
      } else {
        scaleRatio = imgHeight / this.outputHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.outputHeight;
        this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
      }
    },
    _naturalSize: function _naturalSize() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      this.imgData.width = imgWidth;
      this.imgData.height = imgHeight;
      this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
      this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
    },
    _handlePointerStart: function _handlePointerStart(evt) {
      if (this.passive) return;
      this.supportTouch = true;
      this.pointerMoved = false;
      var pointerCoord = u.getPointerCoords(evt, this);
      this.pointerStartCoord = pointerCoord;

      if (this.disabled) return;
      // simulate click with touch on mobile devices
      if (!this.hasImage() && !this.disableClickToChoose) {
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
        document.addEventListener(e, this._handlePointerEnd);
      }
    },
    _handlePointerEnd: function _handlePointerEnd(evt) {
      if (this.passive) return;
      var pointerMoveDistance = 0;
      if (this.pointerStartCoord) {
        var pointerCoord = u.getPointerCoords(evt, this);
        pointerMoveDistance = Math.sqrt(Math.pow(pointerCoord.x - this.pointerStartCoord.x, 2) + Math.pow(pointerCoord.y - this.pointerStartCoord.y, 2)) || 0;
      }
      if (this.disabled) return;
      if (!this.hasImage() && !this.disableClickToChoose) {
        var tabEnd = new Date().valueOf();
        if (pointerMoveDistance < CLICK_MOVE_THRESHOLD && tabEnd - this.tabStart < MIN_MS_PER_CLICK && this.supportTouch) {
          this.chooseFile();
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
    _handlePointerMove: function _handlePointerMove(evt) {
      if (this.passive) return;
      this.pointerMoved = true;
      if (!this.hasImage()) return;
      var coord = u.getPointerCoords(evt, this);
      this.currentPointerCoord = coord;

      if (this.disabled || this.disableDragToMove) return;

      evt.preventDefault();
      if (!evt.touches || evt.touches.length === 1) {
        if (!this.dragging) return;
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
        this.zoom(delta > 0, PINCH_ACCELERATION);
        this.pinchDistance = distance;
      }
    },
    _handlePointerLeave: function _handlePointerLeave() {
      if (this.passive) return;
      this.currentPointerCoord = null;
    },
    _handleWheel: function _handleWheel(evt) {
      var _this6 = this;

      if (this.passive) return;
      if (this.disabled || this.disableScrollToZoom || !this.hasImage()) return;
      evt.preventDefault();
      this.scrolling = true;
      if (evt.wheelDelta < 0 || evt.deltaY > 0 || evt.detail > 0) {
        this.zoom(this.reverseScrollToZoom);
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseScrollToZoom);
      }
      this.$nextTick(function () {
        _this6.scrolling = false;
      });
    },
    _handleDragEnter: function _handleDragEnter(evt) {
      if (this.passive) return;
      if (this.disabled || this.disableDragAndDrop || !u.eventHasFile(evt)) return;
      if (this.hasImage() && !this.replaceDrop) return;
      this.fileDraggedOver = true;
    },
    _handleDragLeave: function _handleDragLeave(evt) {
      if (this.passive) return;
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = false;
    },
    _handleDragOver: function _handleDragOver(evt) {},
    _handleDrop: function _handleDrop(evt) {
      if (this.passive) return;
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      if (this.hasImage() && this.replaceDrop) {
        this.remove();
      }
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
        this._onNewFileIn(file);
      }
    },
    _preventMovingToWhiteSpace: function _preventMovingToWhiteSpace() {
      if (this.imgData.startX > 0) {
        this.imgData.startX = 0;
      }
      if (this.imgData.startY > 0) {
        this.imgData.startY = 0;
      }
      if (this.outputWidth - this.imgData.startX > this.imgData.width) {
        this.imgData.startX = -(this.imgData.width - this.outputWidth);
      }
      if (this.outputHeight - this.imgData.startY > this.imgData.height) {
        this.imgData.startY = -(this.imgData.height - this.outputHeight);
      }
    },
    _preventZoomingToWhiteSpace: function _preventZoomingToWhiteSpace() {
      if (this.imgData.width < this.outputWidth) {
        this.scaleRatio = this.outputWidth / this.naturalWidth;
      }

      if (this.imgData.height < this.outputHeight) {
        this.scaleRatio = this.outputHeight / this.naturalHeight;
      }
    },
    _setOrientation: function _setOrientation() {
      var _this7 = this;

      var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
      var applyMetadata = arguments[1];

      var useOriginal = applyMetadata;
      if (orientation > 1 || useOriginal) {
        if (!this.img) return;
        this.rotating = true;
        var _img = u.getRotatedImage(useOriginal ? this.originalImage : this.img, orientation);
        _img.onload = function () {
          _this7.img = _img;
          _this7._placeImage(applyMetadata);
        };
      } else {
        this._placeImage(applyMetadata);
      }

      if (orientation == 2) {
        // flip x
        this.orientation = u.flipX(this.orientation);
      } else if (orientation == 4) {
        // flip y
        this.orientation = u.flipY(this.orientation);
      } else if (orientation == 6) {
        // 90 deg
        this.orientation = u.rotate90(this.orientation);
      } else if (orientation == 3) {
        // 180 deg
        this.orientation = u.rotate90(u.rotate90(this.orientation));
      } else if (orientation == 8) {
        // 270 deg
        this.orientation = u.rotate90(u.rotate90(u.rotate90(this.orientation)));
      } else {
        this.orientation = orientation;
      }

      if (useOriginal) {
        this.orientation = orientation;
      }
    },
    _paintBackground: function _paintBackground() {
      var backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : this.canvasColor;
      this.ctx.fillStyle = backgroundColor;
      this.ctx.clearRect(0, 0, this.outputWidth, this.outputHeight);
      this.ctx.fillRect(0, 0, this.outputWidth, this.outputHeight);
    },
    _draw: function _draw() {
      var _this8 = this;

      this.$nextTick(function () {
        if (!_this8.img) return;
        if (typeof window !== 'undefined' && window.requestAnimationFrame) {
          requestAnimationFrame(_this8._drawFrame);
        } else {
          _this8._drawFrame();
        }
      });
    },
    _drawFrame: function _drawFrame() {
      this.loading = false;
      var ctx = this.ctx;
      var _imgData2 = this.imgData,
          startX = _imgData2.startX,
          startY = _imgData2.startY,
          width = _imgData2.width,
          height = _imgData2.height;


      this._paintBackground();
      ctx.drawImage(this.img, startX, startY, width, height);
      this.$emit(events.DRAW, ctx);
      if (!this.imageSet) {
        this.imageSet = true;
        this.$emit(events.NEW_IMAGE_DRAWN);
      }
      this.rotating = false;
    },
    _applyMetadata: function _applyMetadata() {
      var _this9 = this;

      if (!this.userMetadata) return;
      var _userMetadata = this.userMetadata,
          startX = _userMetadata.startX,
          startY = _userMetadata.startY,
          scale = _userMetadata.scale;


      if (u.numberValid(startX)) {
        this.imgData.startX = startX;
      }

      if (u.numberValid(startY)) {
        this.imgData.startY = startY;
      }

      if (u.numberValid(scale)) {
        this.scaleRatio = scale;
      }

      this.$nextTick(function () {
        _this9.userMetadata = null;
      });
    },
    onDimensionChange: function onDimensionChange() {
      if (!this.img) {
        this._initialize();
      } else {
        if (this.preventWhiteSpace) {
          this.imageSet = false;
        }
        this._setSize();
        this._placeImage();
      }
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

var index$1 = shouldUseNative() ? Object.assign : function (target, source) {
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
    options = index$1({}, defaultOptions, options);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgYmFzZTY0ID0gYmFzZTY0LnJlcGxhY2UoL15kYXRhOihbXjtdKyk7YmFzZTY0LC9nbWksICcnKVxyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9XHJcbiAgTnVtYmVyLmlzSW50ZWdlciB8fFxyXG4gIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJlxyXG4gICAgICBpc0Zpbml0ZSh2YWx1ZSkgJiZcclxuICAgICAgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXHJcbiAgICApXHJcbiAgfVxyXG5cclxudmFyIGluaXRpYWxJbWFnZVR5cGUgPSBTdHJpbmdcclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5JbWFnZSkge1xyXG4gIGluaXRpYWxJbWFnZVR5cGUgPSBbU3RyaW5nLCBJbWFnZV1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcclxuICB9LFxyXG4gIHF1YWxpdHk6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiBTdHJpbmcsXHJcbiAgZmlsZVNpemVMaW1pdDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnQW5kRHJvcDogQm9vbGVhbixcclxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ1RvTW92ZTogQm9vbGVhbixcclxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIGRpc2FibGVQaW5jaFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUm90YXRpb246IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9LFxyXG4gIGluaXRpYWxJbWFnZTogaW5pdGlhbEltYWdlVHlwZSxcclxuICBpbml0aWFsU2l6ZToge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ2NvdmVyJyxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID09PSAnY292ZXInIHx8IHZhbCA9PT0gJ2NvbnRhaW4nIHx8IHZhbCA9PT0gJ25hdHVyYWwnXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbml0aWFsUG9zaXRpb246IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdjZW50ZXInLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHZhciB2YWxpZHMgPSBbJ2NlbnRlcicsICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHZhbC5zcGxpdCgnICcpLmV2ZXJ5KHdvcmQgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHZhbGlkcy5pbmRleE9mKHdvcmQpID49IDBcclxuICAgICAgICB9KSB8fCAvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodmFsKVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbnB1dEF0dHJzOiBPYmplY3QsXHJcbiAgc2hvd0xvYWRpbmc6IEJvb2xlYW4sXHJcbiAgbG9hZGluZ1NpemU6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwXHJcbiAgfSxcclxuICBsb2FkaW5nQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICcjNjA2MDYwJ1xyXG4gIH0sXHJcbiAgcmVwbGFjZURyb3A6IEJvb2xlYW4sXHJcbiAgcGFzc2l2ZTogQm9vbGVhblxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgSU5JVF9FVkVOVDogJ2luaXQnLFxuICBGSUxFX0NIT09TRV9FVkVOVDogJ2ZpbGUtY2hvb3NlJyxcbiAgRklMRV9TSVpFX0VYQ0VFRF9FVkVOVDogJ2ZpbGUtc2l6ZS1leGNlZWQnLFxuICBGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQ6ICdmaWxlLXR5cGUtbWlzbWF0Y2gnLFxuICBORVdfSU1BR0U6ICduZXctaW1hZ2UnLFxuICBORVdfSU1BR0VfRFJBV046ICduZXctaW1hZ2UtZHJhd24nLFxuICBJTUFHRV9SRU1PVkVfRVZFTlQ6ICdpbWFnZS1yZW1vdmUnLFxuICBNT1ZFX0VWRU5UOiAnbW92ZScsXG4gIFpPT01fRVZFTlQ6ICd6b29tJyxcbiAgRFJBVzogJ2RyYXcnLFxuICBJTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVDogJ2luaXRpYWwtaW1hZ2UtbG9hZGVkJyxcbiAgTE9BRElOR19TVEFSVDogJ2xvYWRpbmctc3RhcnQnLFxuICBMT0FESU5HX0VORDogJ2xvYWRpbmctZW5kJ1xufVxuIiwiPHRlbXBsYXRlPlxyXG4gIDxkaXYgcmVmPVwid3JhcHBlclwiXHJcbiAgICA6Y2xhc3M9XCJgY3JvcHBhLWNvbnRhaW5lciAke2ltZyA/ICdjcm9wcGEtLWhhcy10YXJnZXQnIDogJyd9ICR7cGFzc2l2ZSA/ICdjcm9wcGEtLXBhc3NpdmUnIDogJyd9ICR7ZGlzYWJsZWQgPyAnY3JvcHBhLS1kaXNhYmxlZCcgOiAnJ30gJHtkaXNhYmxlQ2xpY2tUb0Nob29zZSA/ICdjcm9wcGEtLWRpc2FibGVkLWNjJyA6ICcnfSAke2Rpc2FibGVEcmFnVG9Nb3ZlICYmIGRpc2FibGVTY3JvbGxUb1pvb20gPyAnY3JvcHBhLS1kaXNhYmxlZC1teicgOiAnJ30gJHtmaWxlRHJhZ2dlZE92ZXIgPyAnY3JvcHBhLS1kcm9wem9uZScgOiAnJ31gXCJcclxuICAgIEBkcmFnZW50ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdFbnRlclwiXHJcbiAgICBAZHJhZ2xlYXZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcmFnTGVhdmVcIlxyXG4gICAgQGRyYWdvdmVyLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcmFnT3ZlclwiXHJcbiAgICBAZHJvcC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJvcFwiPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCJcclxuICAgICAgOmFjY2VwdD1cImFjY2VwdFwiXHJcbiAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcclxuICAgICAgdi1iaW5kPVwiaW5wdXRBdHRyc1wiXHJcbiAgICAgIHJlZj1cImZpbGVJbnB1dFwiXHJcbiAgICAgIEBjaGFuZ2U9XCJfaGFuZGxlSW5wdXRDaGFuZ2VcIlxyXG4gICAgICBzdHlsZT1cImhlaWdodDoxcHg7d2lkdGg6MXB4O292ZXJmbG93OmhpZGRlbjttYXJnaW4tbGVmdDotOTk5OTlweDtwb3NpdGlvbjphYnNvbHV0ZTtcIiAvPlxyXG4gICAgPGRpdiBjbGFzcz1cInNsb3RzXCJcclxuICAgICAgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW47XCI+XHJcbiAgICAgIDxzbG90IG5hbWU9XCJpbml0aWFsXCI+PC9zbG90PlxyXG4gICAgICA8c2xvdCBuYW1lPVwicGxhY2Vob2xkZXJcIj48L3Nsb3Q+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCJcclxuICAgICAgQGNsaWNrLnN0b3AucHJldmVudD1cIl9oYW5kbGVDbGlja1wiXHJcbiAgICAgIEB0b3VjaHN0YXJ0LnN0b3A9XCJfaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgQG1vdXNlZG93bi5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgQHBvaW50ZXJzdGFydC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgQHRvdWNoZW5kLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgQHRvdWNoY2FuY2VsLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgQG1vdXNldXAuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICBAcG9pbnRlcmVuZC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgIEBwb2ludGVyY2FuY2VsLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgQHRvdWNobW92ZS5zdG9wPVwiX2hhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgQG1vdXNlbW92ZS5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgQHBvaW50ZXJsZWF2ZS5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckxlYXZlXCJcclxuICAgICAgQERPTU1vdXNlU2Nyb2xsLnN0b3A9XCJfaGFuZGxlV2hlZWxcIlxyXG4gICAgICBAd2hlZWwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXHJcbiAgICAgIEBtb3VzZXdoZWVsLnN0b3A9XCJfaGFuZGxlV2hlZWxcIj48L2NhbnZhcz5cclxuICAgIDxzdmcgY2xhc3M9XCJpY29uIGljb24tcmVtb3ZlXCJcclxuICAgICAgdi1pZj1cInNob3dSZW1vdmVCdXR0b24gJiYgaW1nICYmICFwYXNzaXZlXCJcclxuICAgICAgQGNsaWNrPVwicmVtb3ZlXCJcclxuICAgICAgOnN0eWxlPVwiYHRvcDogLSR7aGVpZ2h0LzQwfXB4OyByaWdodDogLSR7d2lkdGgvNDB9cHhgXCJcclxuICAgICAgdmlld0JveD1cIjAgMCAxMDI0IDEwMjRcIlxyXG4gICAgICB2ZXJzaW9uPVwiMS4xXCJcclxuICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcbiAgICAgIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiXHJcbiAgICAgIDp3aWR0aD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIlxyXG4gICAgICA6aGVpZ2h0PVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aC8xMFwiPlxyXG4gICAgICA8cGF0aCBkPVwiTTUxMS45MjEyMzEgMEMyMjkuMTc5MDc3IDAgMCAyMjkuMjU3ODQ2IDAgNTEyIDAgNzk0LjcwMjc2OSAyMjkuMTc5MDc3IDEwMjQgNTExLjkyMTIzMSAxMDI0IDc5NC43ODE1MzggMTAyNCAxMDI0IDc5NC43MDI3NjkgMTAyNCA1MTIgMTAyNCAyMjkuMjU3ODQ2IDc5NC43ODE1MzggMCA1MTEuOTIxMjMxIDBaTTczMi4wNDE4NDYgNjUwLjYzMzg0NiA2NTAuNTE1NjkyIDczMi4wODEyMzFDNjUwLjUxNTY5MiA3MzIuMDgxMjMxIDUyMS40OTE2OTIgNTkzLjY4MzY5MiA1MTEuODgxODQ2IDU5My42ODM2OTIgNTAyLjQyOTUzOCA1OTMuNjgzNjkyIDM3My4zNjYxNTQgNzMyLjA4MTIzMSAzNzMuMzY2MTU0IDczMi4wODEyMzFMMjkxLjc2MTIzMSA2NTAuNjMzODQ2QzI5MS43NjEyMzEgNjUwLjYzMzg0NiA0MzAuMzE2MzA4IDUyMy41MDAzMDggNDMwLjMxNjMwOCA1MTIuMTk2OTIzIDQzMC4zMTYzMDggNTAwLjY5NjYxNSAyOTEuNzYxMjMxIDM3My41MjM2OTIgMjkxLjc2MTIzMSAzNzMuNTIzNjkyTDM3My4zNjYxNTQgMjkxLjkxODc2OUMzNzMuMzY2MTU0IDI5MS45MTg3NjkgNTAzLjQ1MzUzOCA0MzAuMzk1MDc3IDUxMS44ODE4NDYgNDMwLjM5NTA3NyA1MjAuMzQ5NTM4IDQzMC4zOTUwNzcgNjUwLjUxNTY5MiAyOTEuOTE4NzY5IDY1MC41MTU2OTIgMjkxLjkxODc2OUw3MzIuMDQxODQ2IDM3My41MjM2OTJDNzMyLjA0MTg0NiAzNzMuNTIzNjkyIDU5My40NDczODUgNTAyLjU0NzY5MiA1OTMuNDQ3Mzg1IDUxMi4xOTY5MjMgNTkzLjQ0NzM4NSA1MjEuNDEyOTIzIDczMi4wNDE4NDYgNjUwLjYzMzg0NiA3MzIuMDQxODQ2IDY1MC42MzM4NDZaXCJcclxuICAgICAgICA6ZmlsbD1cInJlbW92ZUJ1dHRvbkNvbG9yXCI+PC9wYXRoPlxyXG4gICAgPC9zdmc+XHJcbiAgICA8ZGl2IGNsYXNzPVwic2stZmFkaW5nLWNpcmNsZVwiXHJcbiAgICAgIDpzdHlsZT1cImxvYWRpbmdTdHlsZVwiXHJcbiAgICAgIHYtaWY9XCJzaG93TG9hZGluZyAmJiBsb2FkaW5nXCI+XHJcbiAgICAgIDxkaXYgOmNsYXNzPVwiYHNrLWNpcmNsZSR7aX0gc2stY2lyY2xlYFwiXHJcbiAgICAgICAgdi1mb3I9XCJpIGluIDEyXCJcclxuICAgICAgICA6a2V5PVwiaVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUtaW5kaWNhdG9yXCJcclxuICAgICAgICAgIDpzdHlsZT1cIntiYWNrZ3JvdW5kQ29sb3I6IGxvYWRpbmdDb2xvcn1cIj48L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxzbG90Pjwvc2xvdD5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xyXG4gIGltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xyXG4gIGltcG9ydCBldmVudHMgZnJvbSAnLi9ldmVudHMnXHJcblxyXG4gIGNvbnN0IFBDVF9QRVJfWk9PTSA9IDEgLyAxMDAwMDAgLy8gVGhlIGFtb3VudCBvZiB6b29taW5nIGV2ZXJ5dGltZSBpdCBoYXBwZW5zLCBpbiBwZXJjZW50YWdlIG9mIGltYWdlIHdpZHRoLlxyXG4gIGNvbnN0IE1JTl9NU19QRVJfQ0xJQ0sgPSA1MDAgLy8gSWYgdG91Y2ggZHVyYXRpb24gaXMgc2hvcnRlciB0aGFuIHRoZSB2YWx1ZSwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGFzIGEgY2xpY2suXHJcbiAgY29uc3QgQ0xJQ0tfTU9WRV9USFJFU0hPTEQgPSAxMDAgLy8gSWYgdG91Y2ggbW92ZSBkaXN0YW5jZSBpcyBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZSwgdGhlbiBpdCB3aWxsIGJ5IG5vIG1lYW4gYmUgY29uc2lkZXJlZCBhcyBhIGNsaWNrLlxyXG4gIGNvbnN0IE1JTl9XSURUSCA9IDEwIC8vIFRoZSBtaW5pbWFsIHdpZHRoIHRoZSB1c2VyIGNhbiB6b29tIHRvLlxyXG4gIGNvbnN0IERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQID0gMiAvIDMgLy8gUGxhY2Vob2xkZXIgdGV4dCBieSBkZWZhdWx0IHRha2VzIHVwIHRoaXMgYW1vdW50IG9mIHRpbWVzIG9mIGNhbnZhcyB3aWR0aC5cclxuICBjb25zdCBQSU5DSF9BQ0NFTEVSQVRJT04gPSAxIC8vIFRoZSBhbW91bnQgb2YgdGltZXMgYnkgd2hpY2ggdGhlIHBpbmNoaW5nIGlzIG1vcmUgc2Vuc2l0aXZlIHRoYW4gdGhlIHNjb2xsaW5nXHJcblxyXG4gIGNvbnN0IHN5bmNEYXRhID0gWydpbWdEYXRhJywgJ2ltZycsICdpbWdTZXQnLCAnb3JpZ2luYWxJbWFnZScsICduYXR1cmFsSGVpZ2h0JywgJ25hdHVyYWxXaWR0aCcsICdvcmllbnRhdGlvbicsICdzY2FsZVJhdGlvJ11cclxuICAvLyBjb25zdCBERUJVRyA9IGZhbHNlXHJcblxyXG4gIGV4cG9ydCBkZWZhdWx0IHtcclxuICAgIG1vZGVsOiB7XHJcbiAgICAgIHByb3A6ICd2YWx1ZScsXHJcbiAgICAgIGV2ZW50OiBldmVudHMuSU5JVF9FVkVOVFxyXG4gICAgfSxcclxuXHJcbiAgICBwcm9wczogcHJvcHMsXHJcblxyXG4gICAgZGF0YSAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICAgIGN0eDogbnVsbCxcclxuICAgICAgICBvcmlnaW5hbEltYWdlOiBudWxsLFxyXG4gICAgICAgIGltZzogbnVsbCxcclxuICAgICAgICBkcmFnZ2luZzogZmFsc2UsXHJcbiAgICAgICAgbGFzdE1vdmluZ0Nvb3JkOiBudWxsLFxyXG4gICAgICAgIGltZ0RhdGE6IHtcclxuICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICAgICAgc3RhcnRYOiAwLFxyXG4gICAgICAgICAgc3RhcnRZOiAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaWxlRHJhZ2dlZE92ZXI6IGZhbHNlLFxyXG4gICAgICAgIHRhYlN0YXJ0OiAwLFxyXG4gICAgICAgIHNjcm9sbGluZzogZmFsc2UsXHJcbiAgICAgICAgcGluY2hpbmc6IGZhbHNlLFxyXG4gICAgICAgIHJvdGF0aW5nOiBmYWxzZSxcclxuICAgICAgICBwaW5jaERpc3RhbmNlOiAwLFxyXG4gICAgICAgIHN1cHBvcnRUb3VjaDogZmFsc2UsXHJcbiAgICAgICAgcG9pbnRlck1vdmVkOiBmYWxzZSxcclxuICAgICAgICBwb2ludGVyU3RhcnRDb29yZDogbnVsbCxcclxuICAgICAgICBuYXR1cmFsV2lkdGg6IDAsXHJcbiAgICAgICAgbmF0dXJhbEhlaWdodDogMCxcclxuICAgICAgICBzY2FsZVJhdGlvOiBudWxsLFxyXG4gICAgICAgIG9yaWVudGF0aW9uOiAxLFxyXG4gICAgICAgIHVzZXJNZXRhZGF0YTogbnVsbCxcclxuICAgICAgICBpbWFnZVNldDogZmFsc2UsXHJcbiAgICAgICAgY3VycmVudFBvaW50ZXJDb29yZDogbnVsbCxcclxuICAgICAgICBjdXJyZW50SXNJbml0aWFsOiBmYWxzZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgIG91dHB1dFdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgb3V0cHV0SGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQgKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJGb250U2l6ZSAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYXNwZWN0UmF0aW8gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hdHVyYWxXaWR0aCAvIHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbG9hZGluZ1N0eWxlICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgd2lkdGg6IHRoaXMubG9hZGluZ1NpemUgKyAncHgnLFxyXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmxvYWRpbmdTaXplICsgJ3B4JyxcclxuICAgICAgICAgIHJpZ2h0OiAnMTVweCcsXHJcbiAgICAgICAgICBib3R0b206ICcxMHB4J1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtb3VudGVkICgpIHtcclxuICAgICAgdGhpcy5faW5pdGlhbGl6ZSgpXHJcbiAgICAgIHUuckFGUG9seWZpbGwoKVxyXG4gICAgICB1LnRvQmxvYlBvbHlmaWxsKClcclxuXHJcbiAgICAgIGxldCBzdXBwb3J0cyA9IHRoaXMuc3VwcG9ydERldGVjdGlvbigpXHJcbiAgICAgIGlmICghc3VwcG9ydHMuYmFzaWMpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHZ1ZS1jcm9wcGEgZnVuY3Rpb25hbGl0eS4nKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSB7XHJcbiAgICAgICAgdGhpcy4kd2F0Y2goJ3ZhbHVlLl9kYXRhJywgKGRhdGEpID0+IHtcclxuICAgICAgICAgIGxldCBzZXQgPSBmYWxzZVxyXG4gICAgICAgICAgaWYgKCFkYXRhKSByZXR1cm5cclxuICAgICAgICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChzeW5jRGF0YS5pbmRleE9mKGtleSkgPj0gMCkge1xyXG4gICAgICAgICAgICAgIGxldCB2YWwgPSBkYXRhW2tleV1cclxuICAgICAgICAgICAgICBpZiAodmFsICE9PSB0aGlzW2tleV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHNldCh0aGlzLCBrZXksIHZhbClcclxuICAgICAgICAgICAgICAgIHNldCA9IHRydWVcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChzZXQpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVtb3ZlKClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBkZWVwOiB0cnVlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHdhdGNoOiB7XHJcbiAgICAgIG91dHB1dFdpZHRoOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5vbkRpbWVuc2lvbkNoYW5nZSgpXHJcbiAgICAgIH0sXHJcbiAgICAgIG91dHB1dEhlaWdodDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMub25EaW1lbnNpb25DaGFuZ2UoKVxyXG4gICAgICB9LFxyXG4gICAgICBjYW52YXNDb2xvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcGxhY2Vob2xkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBjb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcHJldmVudFdoaXRlU3BhY2UgKHZhbCkge1xyXG4gICAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wbGFjZUltYWdlKClcclxuICAgICAgfSxcclxuICAgICAgc2NhbGVSYXRpbyAodmFsLCBvbGRWYWwpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBpZiAoIXUubnVtYmVyVmFsaWQodmFsKSkgcmV0dXJuXHJcblxyXG4gICAgICAgIHZhciB4ID0gMVxyXG4gICAgICAgIGlmICh1Lm51bWJlclZhbGlkKG9sZFZhbCkgJiYgb2xkVmFsICE9PSAwKSB7XHJcbiAgICAgICAgICB4ID0gdmFsIC8gb2xkVmFsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwb3MgPSB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgfHwge1xyXG4gICAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXHJcbiAgICAgICAgICB5OiB0aGlzLmltZ0RhdGEuc3RhcnRZICsgdGhpcy5pbWdEYXRhLmhlaWdodCAvIDJcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGggKiB2YWxcclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0ICogdmFsXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLl9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgICB0aGlzLl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnVzZXJNZXRhZGF0YSB8fCAhdGhpcy5pbWFnZVNldCB8fCB0aGlzLnJvdGF0aW5nKSByZXR1cm5cclxuICAgICAgICBsZXQgb2Zmc2V0WCA9ICh4IC0gMSkgKiAocG9zLnggLSB0aGlzLmltZ0RhdGEuc3RhcnRYKVxyXG4gICAgICAgIGxldCBvZmZzZXRZID0gKHggLSAxKSAqIChwb3MueSAtIHRoaXMuaW1nRGF0YS5zdGFydFkpXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHRoaXMuaW1nRGF0YS5zdGFydFggLSBvZmZzZXRYXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHRoaXMuaW1nRGF0YS5zdGFydFkgLSBvZmZzZXRZXHJcbiAgICAgIH0sXHJcbiAgICAgICdpbWdEYXRhLndpZHRoJzogZnVuY3Rpb24gKHZhbCwgb2xkVmFsKSB7XHJcbiAgICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF1Lm51bWJlclZhbGlkKHZhbCkpIHJldHVyblxyXG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHZhbCAvIHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSkge1xyXG4gICAgICAgICAgaWYgKE1hdGguYWJzKHZhbCAtIG9sZFZhbCkgPiAodmFsICogKDEgLyAxMDAwMDApKSkge1xyXG4gICAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5aT09NX0VWRU5UKVxyXG4gICAgICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgICdpbWdEYXRhLmhlaWdodCc6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBpZiAoIXUubnVtYmVyVmFsaWQodmFsKSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdmFsIC8gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgIH0sXHJcbiAgICAgICdpbWdEYXRhLnN0YXJ0WCc6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBpZiAodGhpcy5oYXNJbWFnZSgpKSB7XHJcbiAgICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLl9kcmF3KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgJ2ltZ0RhdGEuc3RhcnRZJzogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIC8vIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkpIHtcclxuICAgICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2RyYXcpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBsb2FkaW5nICh2YWwpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5MT0FESU5HX1NUQVJUKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5MT0FESU5HX0VORClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICBnZXRDYW52YXMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhc1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0Q29udGV4dCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRDaG9zZW5GaWxlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kcmVmcy5maWxlSW5wdXQuZmlsZXNbMF1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1vdmUgKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghb2Zmc2V0IHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgbGV0IG9sZFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYXHJcbiAgICAgICAgbGV0IG9sZFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgKz0gb2Zmc2V0LnlcclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5fcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYICE9PSBvbGRYIHx8IHRoaXMuaW1nRGF0YS5zdGFydFkgIT09IG9sZFkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLk1PVkVfRVZFTlQpXHJcbiAgICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlVXB3YXJkcyAoYW1vdW50ID0gMSkge1xyXG4gICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1vdmVEb3dud2FyZHMgKGFtb3VudCA9IDEpIHtcclxuICAgICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiBhbW91bnQgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1vdmVMZWZ0d2FyZHMgKGFtb3VudCA9IDEpIHtcclxuICAgICAgICB0aGlzLm1vdmUoeyB4OiAtYW1vdW50LCB5OiAwIH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlUmlnaHR3YXJkcyAoYW1vdW50ID0gMSkge1xyXG4gICAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgem9vbSAoem9vbUluID0gdHJ1ZSwgYWNjZWxlcmF0aW9uID0gMSkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIGxldCByZWFsU3BlZWQgPSB0aGlzLnpvb21TcGVlZCAqIGFjY2VsZXJhdGlvblxyXG4gICAgICAgIGxldCBzcGVlZCA9ICh0aGlzLm91dHB1dFdpZHRoICogUENUX1BFUl9aT09NKSAqIHJlYWxTcGVlZFxyXG4gICAgICAgIGxldCB4ID0gMVxyXG4gICAgICAgIGlmICh6b29tSW4pIHtcclxuICAgICAgICAgIHggPSAxICsgc3BlZWRcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA+IE1JTl9XSURUSCkge1xyXG4gICAgICAgICAgeCA9IDEgLSBzcGVlZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvICo9IHhcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHpvb21JbiAoKSB7XHJcbiAgICAgICAgdGhpcy56b29tKHRydWUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB6b29tT3V0ICgpIHtcclxuICAgICAgICB0aGlzLnpvb20oZmFsc2UpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByb3RhdGUgKHN0ZXAgPSAxKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBzdGVwID0gcGFyc2VJbnQoc3RlcClcclxuICAgICAgICBpZiAoaXNOYU4oc3RlcCkgfHwgc3RlcCA+IDMgfHwgc3RlcCA8IC0zKSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgYXJndW1lbnQgZm9yIHJvdGF0ZSgpIG1ldGhvZC4gSXQgc2hvdWxkIG9uZSBvZiB0aGUgaW50ZWdlcnMgZnJvbSAtMyB0byAzLicpXHJcbiAgICAgICAgICBzdGVwID0gMVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yb3RhdGVCeVN0ZXAoc3RlcClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZsaXBYICgpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKDIpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmbGlwWSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbig0KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVmcmVzaCAoKSB7XHJcbiAgICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5faW5pdGlhbGl6ZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhc0ltYWdlICgpIHtcclxuICAgICAgICByZXR1cm4gISF0aGlzLmltYWdlU2V0XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhcHBseU1ldGFkYXRhIChtZXRhZGF0YSkge1xyXG4gICAgICAgIGlmICghbWV0YWRhdGEgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICB0aGlzLnVzZXJNZXRhZGF0YSA9IG1ldGFkYXRhXHJcbiAgICAgICAgdmFyIG9yaSA9IG1ldGFkYXRhLm9yaWVudGF0aW9uIHx8IHRoaXMub3JpZW50YXRpb24gfHwgMVxyXG4gICAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaSwgdHJ1ZSlcclxuICAgICAgfSxcclxuICAgICAgZ2VuZXJhdGVEYXRhVXJsICh0eXBlLCBjb21wcmVzc2lvblJhdGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuICcnXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCh0eXBlLCBjb21wcmVzc2lvblJhdGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jYW52YXMudG9CbG9iKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcHJvbWlzZWRCbG9iICguLi5hcmdzKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBQcm9taXNlID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ05vIFByb21pc2Ugc3VwcG9ydC4gUGxlYXNlIGFkZCBQcm9taXNlIHBvbHlmaWxsIGlmIHlvdSB3YW50IHRvIHVzZSB0aGlzIG1ldGhvZC4nKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlQmxvYigoYmxvYikgPT4ge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUoYmxvYilcclxuICAgICAgICAgICAgfSwgLi4uYXJncylcclxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRNZXRhZGF0YSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHJldHVybiB7fVxyXG4gICAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZIH0gPSB0aGlzLmltZ0RhdGFcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHN0YXJ0WCxcclxuICAgICAgICAgIHN0YXJ0WSxcclxuICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlUmF0aW8sXHJcbiAgICAgICAgICBvcmllbnRhdGlvbjogdGhpcy5vcmllbnRhdGlvblxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHN1cHBvcnREZXRlY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICdiYXNpYyc6IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgd2luZG93LkZpbGUgJiYgd2luZG93LkZpbGVSZWFkZXIgJiYgd2luZG93LkZpbGVMaXN0ICYmIHdpbmRvdy5CbG9iLFxyXG4gICAgICAgICAgJ2RuZCc6ICdvbmRyYWdzdGFydCcgaW4gZGl2ICYmICdvbmRyb3AnIGluIGRpdlxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNob29zZUZpbGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LmNsaWNrKClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlbW92ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuXHJcbiAgICAgICAgbGV0IGhhZEltYWdlID0gdGhpcy5pbWcgIT0gbnVsbFxyXG4gICAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IG51bGxcclxuICAgICAgICB0aGlzLmltZyA9IG51bGxcclxuICAgICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC52YWx1ZSA9ICcnXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhID0ge1xyXG4gICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICBoZWlnaHQ6IDAsXHJcbiAgICAgICAgICBzdGFydFg6IDAsXHJcbiAgICAgICAgICBzdGFydFk6IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IDFcclxuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSBudWxsXHJcbiAgICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBudWxsXHJcbiAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcclxuXHJcbiAgICAgICAgaWYgKGhhZEltYWdlKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5JTUFHRV9SRU1PVkVfRVZFTlQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2luaXRpYWxpemUgKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kcmVmcy5jYW52YXNcclxuICAgICAgICB0aGlzLl9zZXRTaXplKClcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJ3RyYW5zcGFyZW50JyA6ICh0eXBlb2YgdGhpcy5jYW52YXNDb2xvciA9PT0gJ3N0cmluZycgPyB0aGlzLmNhbnZhc0NvbG9yIDogJycpXHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMuX3NldEluaXRpYWwoKVxyXG4gICAgICAgIGlmICghdGhpcy5wYXNzaXZlKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5JTklUX0VWRU5ULCB0aGlzKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9zZXRTaXplICgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLm91dHB1dEhlaWdodFxyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArICdweCdcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArICdweCdcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9yb3RhdGVCeVN0ZXAgKHN0ZXApIHtcclxuICAgICAgICBsZXQgb3JpZW50YXRpb24gPSAxXHJcbiAgICAgICAgc3dpdGNoIChzdGVwKSB7XHJcbiAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gNlxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDNcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSA4XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDhcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgLTI6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gM1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAtMzpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSA2XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaWVudGF0aW9uKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3NldEltYWdlUGxhY2Vob2xkZXIgKCkge1xyXG4gICAgICAgIGxldCBpbWdcclxuICAgICAgICBpZiAodGhpcy4kc2xvdHMucGxhY2Vob2xkZXIgJiYgdGhpcy4kc2xvdHMucGxhY2Vob2xkZXJbMF0pIHtcclxuICAgICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdXHJcbiAgICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICAgIGlmICh0YWcgPT0gJ2ltZycgJiYgZWxtKSB7XHJcbiAgICAgICAgICAgIGltZyA9IGVsbVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpbWcpIHJldHVyblxyXG5cclxuICAgICAgICB2YXIgb25Mb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltZywgMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XHJcbiAgICAgICAgICBvbkxvYWQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpbWcub25sb2FkID0gb25Mb2FkXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3NldFRleHRQbGFjZWhvbGRlciAoKSB7XHJcbiAgICAgICAgdmFyIGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXHJcbiAgICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMub3V0cHV0V2lkdGggKiBERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCAvIHRoaXMucGxhY2Vob2xkZXIubGVuZ3RoXHJcbiAgICAgICAgbGV0IGZvbnRTaXplID0gKCF0aGlzLmNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSB8fCB0aGlzLmNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSA9PSAwKSA/IGRlZmF1bHRGb250U2l6ZSA6IHRoaXMuY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplXHJcbiAgICAgICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCBzYW5zLXNlcmlmJ1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAoIXRoaXMucGxhY2Vob2xkZXJDb2xvciB8fCB0aGlzLnBsYWNlaG9sZGVyQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjNjA2MDYwJyA6IHRoaXMucGxhY2Vob2xkZXJDb2xvclxyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0aGlzLnBsYWNlaG9sZGVyLCB0aGlzLm91dHB1dFdpZHRoIC8gMiwgdGhpcy5vdXRwdXRIZWlnaHQgLyAyKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3NldFBsYWNlaG9sZGVycyAoKSB7XHJcbiAgICAgICAgdGhpcy5fcGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgICB0aGlzLl9zZXRJbWFnZVBsYWNlaG9sZGVyKClcclxuICAgICAgICB0aGlzLl9zZXRUZXh0UGxhY2Vob2xkZXIoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3NldEluaXRpYWwgKCkge1xyXG4gICAgICAgIGxldCBzcmMsIGltZ1xyXG4gICAgICAgIGlmICh0aGlzLiRzbG90cy5pbml0aWFsICYmIHRoaXMuJHNsb3RzLmluaXRpYWxbMF0pIHtcclxuICAgICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLmluaXRpYWxbMF1cclxuICAgICAgICAgIGxldCB7IHRhZywgZWxtIH0gPSB2Tm9kZVxyXG4gICAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcclxuICAgICAgICAgICAgaW1nID0gZWxtXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxJbWFnZSAmJiB0eXBlb2YgdGhpcy5pbml0aWFsSW1hZ2UgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICBzcmMgPSB0aGlzLmluaXRpYWxJbWFnZVxyXG4gICAgICAgICAgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgICAgIGlmICghL15kYXRhOi8udGVzdChzcmMpICYmICEvXmJsb2I6Ly50ZXN0KHNyYykpIHtcclxuICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnY3Jvc3NPcmlnaW4nLCAnYW5vbnltb3VzJylcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGltZy5zcmMgPSBzcmNcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLmluaXRpYWxJbWFnZSA9PT0gJ29iamVjdCcgJiYgdGhpcy5pbml0aWFsSW1hZ2UgaW5zdGFuY2VvZiBJbWFnZSkge1xyXG4gICAgICAgICAgaW1nID0gdGhpcy5pbml0aWFsSW1hZ2VcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFzcmMgJiYgIWltZykge1xyXG4gICAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRJc0luaXRpYWwgPSB0cnVlXHJcbiAgICAgICAgaWYgKHUuaW1hZ2VMb2FkZWQoaW1nKSkge1xyXG4gICAgICAgICAgLy8gdGhpcy4kZW1pdChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXHJcbiAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCAraW1nLmRhdGFzZXRbJ2V4aWZPcmllbnRhdGlvbiddLCB0cnVlKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlXHJcbiAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyB0aGlzLiRlbWl0KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcclxuICAgICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSwgdHJ1ZSlcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpbWcub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfb25sb2FkIChpbWcsIG9yaWVudGF0aW9uID0gMSwgaW5pdGlhbCkge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IGltZ1xyXG4gICAgICAgIHRoaXMuaW1nID0gaW1nXHJcblxyXG4gICAgICAgIGlmIChpc05hTihvcmllbnRhdGlvbikpIHtcclxuICAgICAgICAgIG9yaWVudGF0aW9uID0gMVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24ob3JpZW50YXRpb24pXHJcblxyXG4gICAgICAgIGlmIChpbml0aWFsKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlQ2xpY2sgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlICYmICF0aGlzLmRpc2FibGVkICYmICF0aGlzLnN1cHBvcnRUb3VjaCAmJiAhdGhpcy5wYXNzaXZlKSB7XHJcbiAgICAgICAgICB0aGlzLmNob29zZUZpbGUoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVJbnB1dENoYW5nZSAoKSB7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gdGhpcy4kcmVmcy5maWxlSW5wdXRcclxuICAgICAgICBpZiAoIWlucHV0LmZpbGVzLmxlbmd0aCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxyXG5cclxuICAgICAgICBsZXQgZmlsZSA9IGlucHV0LmZpbGVzWzBdXHJcbiAgICAgICAgdGhpcy5fb25OZXdGaWxlSW4oZmlsZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9vbk5ld0ZpbGVJbiAoZmlsZSkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudElzSW5pdGlhbCA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkZJTEVfQ0hPT1NFX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgIGlmICghdGhpcy5fZmlsZVNpemVJc1ZhbGlkKGZpbGUpKSB7XHJcbiAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBzaXplIGV4Y2VlZHMgbGltaXQgd2hpY2ggaXMgJyArIHRoaXMuZmlsZVNpemVMaW1pdCArICcgYnl0ZXMuJylcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLl9maWxlVHlwZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgICBsZXQgdHlwZSA9IGZpbGUudHlwZSB8fCBmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5zcGxpdCgnLicpLnBvcCgpXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZpbGUgdHlwZSAoJHt0eXBlfSkgZG9lcyBub3QgbWF0Y2ggd2hhdCB5b3Ugc3BlY2lmaWVkICgke3RoaXMuYWNjZXB0fSkuYClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuRmlsZVJlYWRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGxldCBmciA9IG5ldyBGaWxlUmVhZGVyKClcclxuICAgICAgICAgIGZyLm9ubG9hZCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlRGF0YSA9IGUudGFyZ2V0LnJlc3VsdFxyXG4gICAgICAgICAgICBsZXQgb3JpZW50YXRpb24gPSAxXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgb3JpZW50YXRpb24gPSB1LmdldEZpbGVPcmllbnRhdGlvbih1LmJhc2U2NFRvQXJyYXlCdWZmZXIoZmlsZURhdGEpKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHsgfVxyXG4gICAgICAgICAgICBpZiAob3JpZW50YXRpb24gPCAxKSBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBmaWxlRGF0YVxyXG4gICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMuX29ubG9hZChpbWcsIG9yaWVudGF0aW9uKVxyXG4gICAgICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLk5FV19JTUFHRSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9maWxlU2l6ZUlzVmFsaWQgKGZpbGUpIHtcclxuICAgICAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUxpbWl0IHx8IHRoaXMuZmlsZVNpemVMaW1pdCA9PSAwKSByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICAgICByZXR1cm4gZmlsZS5zaXplIDwgdGhpcy5maWxlU2l6ZUxpbWl0XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfZmlsZVR5cGVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFjY2VwY3QpIHJldHVybiB0cnVlXHJcbiAgICAgICAgbGV0IGFjY2VwdCA9IHRoaXMuYWNjZXB0XHJcbiAgICAgICAgbGV0IGJhc2VNaW1ldHlwZSA9IGFjY2VwdC5yZXBsYWNlKC9cXC8uKiQvLCAnJylcclxuICAgICAgICBsZXQgdHlwZXMgPSBhY2NlcHQuc3BsaXQoJywnKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0eXBlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgbGV0IHR5cGUgPSB0eXBlc1tpXVxyXG4gICAgICAgICAgbGV0IHQgPSB0eXBlLnRyaW0oKVxyXG4gICAgICAgICAgaWYgKHQuY2hhckF0KDApID09ICcuJykge1xyXG4gICAgICAgICAgICBpZiAoZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKSA9PT0gdC50b0xvd2VyQ2FzZSgpLnNsaWNlKDEpKSByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfSBlbHNlIGlmICgvXFwvXFwqJC8udGVzdCh0KSkge1xyXG4gICAgICAgICAgICB2YXIgZmlsZUJhc2VUeXBlID0gZmlsZS50eXBlLnJlcGxhY2UoL1xcLy4qJC8sICcnKVxyXG4gICAgICAgICAgICBpZiAoZmlsZUJhc2VUeXBlID09PSBiYXNlTWltZXR5cGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGZpbGUudHlwZSA9PT0gdHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfcGxhY2VJbWFnZSAoYXBwbHlNZXRhZGF0YSkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIHZhciBpbWdEYXRhID0gdGhpcy5pbWdEYXRhXHJcblxyXG4gICAgICAgIHRoaXMubmF0dXJhbFdpZHRoID0gdGhpcy5pbWcubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgdGhpcy5uYXR1cmFsSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxyXG5cclxuICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IHUubnVtYmVyVmFsaWQoaW1nRGF0YS5zdGFydFgpID8gaW1nRGF0YS5zdGFydFggOiAwXHJcbiAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB1Lm51bWJlclZhbGlkKGltZ0RhdGEuc3RhcnRZKSA/IGltZ0RhdGEuc3RhcnRZIDogMFxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5fYXNwZWN0RmlsbCgpXHJcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5pbWFnZVNldCkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaW5pdGlhbFNpemUgPT0gJ2NvbnRhaW4nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FzcGVjdEZpdCgpXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5pdGlhbFNpemUgPT0gJ25hdHVyYWwnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX25hdHVyYWxTaXplKClcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FzcGVjdEZpbGwoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aCAqIHRoaXMuc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodCAqIHRoaXMuc2NhbGVSYXRpb1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XHJcbiAgICAgICAgICBpZiAoL3RvcC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKC9ib3R0b20vLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0gdGhpcy5vdXRwdXRIZWlnaHQgLSBpbWdEYXRhLmhlaWdodFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICgvbGVmdC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKC9yaWdodC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFggPSB0aGlzLm91dHB1dFdpZHRoIC0gaW1nRGF0YS53aWR0aFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICgvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAvXigtP1xcZCspJSAoLT9cXGQrKSUkLy5leGVjKHRoaXMuaW5pdGlhbFBvc2l0aW9uKVxyXG4gICAgICAgICAgICB2YXIgeCA9ICtyZXN1bHRbMV0gLyAxMDBcclxuICAgICAgICAgICAgdmFyIHkgPSArcmVzdWx0WzJdIC8gMTAwXHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0geCAqICh0aGlzLm91dHB1dFdpZHRoIC0gaW1nRGF0YS53aWR0aClcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB5ICogKHRoaXMub3V0cHV0SGVpZ2h0IC0gaW1nRGF0YS5oZWlnaHQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhcHBseU1ldGFkYXRhICYmIHRoaXMuX2FwcGx5TWV0YWRhdGEoKVxyXG5cclxuICAgICAgICBpZiAoYXBwbHlNZXRhZGF0YSAmJiB0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20oZmFsc2UsIDApXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IDAgfSlcclxuICAgICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9hc3BlY3RGaWxsICgpIHtcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLm91dHB1dFdpZHRoIC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICBsZXQgc2NhbGVSYXRpb1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hc3BlY3RSYXRpbyA+IGNhbnZhc1JhdGlvKSB7XHJcbiAgICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMub3V0cHV0V2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyBzY2FsZVJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfYXNwZWN0Rml0ICgpIHtcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLm91dHB1dFdpZHRoIC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICBsZXQgc2NhbGVSYXRpb1xyXG4gICAgICAgIGlmICh0aGlzLmFzcGVjdFJhdGlvID4gY2FudmFzUmF0aW8pIHtcclxuICAgICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMub3V0cHV0V2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyBzY2FsZVJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfbmF0dXJhbFNpemUgKCkge1xyXG4gICAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLm91dHB1dEhlaWdodCkgLyAyXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlUG9pbnRlclN0YXJ0IChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICB0aGlzLnN1cHBvcnRUb3VjaCA9IHRydWVcclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IGZhbHNlXHJcbiAgICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5wb2ludGVyU3RhcnRDb29yZCA9IHBvaW50ZXJDb29yZFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgLy8gc2ltdWxhdGUgY2xpY2sgd2l0aCB0b3VjaCBvbiBtb2JpbGUgZGV2aWNlc1xyXG4gICAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSB7XHJcbiAgICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gbmV3IERhdGUoKS52YWx1ZU9mKClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZ25vcmUgbW91c2UgcmlnaHQgY2xpY2sgYW5kIG1pZGRsZSBjbGlja1xyXG4gICAgICAgIGlmIChldnQud2hpY2ggJiYgZXZ0LndoaWNoID4gMSkgcmV0dXJuXHJcblxyXG4gICAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxyXG4gICAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXHJcbiAgICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5kaXNhYmxlUGluY2hUb1pvb20pIHtcclxuICAgICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgdGhpcy5waW5jaGluZyA9IHRydWVcclxuICAgICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2FuY2VsRXZlbnRzID0gWydtb3VzZXVwJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJywgJ3BvaW50ZXJlbmQnLCAncG9pbnRlcmNhbmNlbCddXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNhbmNlbEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgbGV0IGUgPSBjYW5jZWxFdmVudHNbaV1cclxuICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZSwgdGhpcy5faGFuZGxlUG9pbnRlckVuZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlUG9pbnRlckVuZCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgbGV0IHBvaW50ZXJNb3ZlRGlzdGFuY2UgPSAwXHJcbiAgICAgICAgaWYgKHRoaXMucG9pbnRlclN0YXJ0Q29vcmQpIHtcclxuICAgICAgICAgIGxldCBwb2ludGVyQ29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgcG9pbnRlck1vdmVEaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhwb2ludGVyQ29vcmQueCAtIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQueCwgMikgKyBNYXRoLnBvdyhwb2ludGVyQ29vcmQueSAtIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQueSwgMikpIHx8IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSB7XHJcbiAgICAgICAgICBsZXQgdGFiRW5kID0gbmV3IERhdGUoKS52YWx1ZU9mKClcclxuICAgICAgICAgIGlmICgocG9pbnRlck1vdmVEaXN0YW5jZSA8IENMSUNLX01PVkVfVEhSRVNIT0xEKSAmJiB0YWJFbmQgLSB0aGlzLnRhYlN0YXJ0IDwgTUlOX01TX1BFUl9DTElDSyAmJiB0aGlzLnN1cHBvcnRUb3VjaCkge1xyXG4gICAgICAgICAgICB0aGlzLmNob29zZUZpbGUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy50YWJTdGFydCA9IDBcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gMFxyXG4gICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gbnVsbFxyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcclxuICAgICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gbnVsbFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IHRydWVcclxuICAgICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgPSBjb29yZFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnVG9Nb3ZlKSByZXR1cm5cclxuXHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cclxuICAgICAgICAgIGlmICh0aGlzLmxhc3RNb3ZpbmdDb29yZCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoe1xyXG4gICAgICAgICAgICAgIHg6IGNvb3JkLnggLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC54LFxyXG4gICAgICAgICAgICAgIHk6IGNvb3JkLnkgLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC55XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLnBpbmNoaW5nKSByZXR1cm5cclxuICAgICAgICAgIGxldCBkaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXHJcbiAgICAgICAgICBsZXQgZGVsdGEgPSBkaXN0YW5jZSAtIHRoaXMucGluY2hEaXN0YW5jZVxyXG4gICAgICAgICAgdGhpcy56b29tKGRlbHRhID4gMCwgUElOQ0hfQUNDRUxFUkFUSU9OKVxyXG4gICAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gZGlzdGFuY2VcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlUG9pbnRlckxlYXZlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgPSBudWxsXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlV2hlZWwgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVNjcm9sbFRvWm9vbSB8fCAhdGhpcy5oYXNJbWFnZSgpKSByZXR1cm5cclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gdHJ1ZVxyXG4gICAgICAgIGlmIChldnQud2hlZWxEZWx0YSA8IDAgfHwgZXZ0LmRlbHRhWSA+IDAgfHwgZXZ0LmRldGFpbCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuem9vbSh0aGlzLnJldmVyc2VTY3JvbGxUb1pvb20pXHJcbiAgICAgICAgfSBlbHNlIGlmIChldnQud2hlZWxEZWx0YSA+IDAgfHwgZXZ0LmRlbHRhWSA8IDAgfHwgZXZ0LmRldGFpbCA8IDApIHtcclxuICAgICAgICAgIHRoaXMuem9vbSghdGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnNjcm9sbGluZyA9IGZhbHNlXHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVEcmFnRW50ZXIgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdBbmREcm9wIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cclxuICAgICAgICBpZiAodGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLnJlcGxhY2VEcm9wKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IHRydWVcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVEcmFnTGVhdmUgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVEcmFnT3ZlciAoZXZ0KSB7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlRHJvcCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVEcmFnZ2VkT3ZlciB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSAmJiB0aGlzLnJlcGxhY2VEcm9wKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbW92ZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuXHJcbiAgICAgICAgbGV0IGZpbGVcclxuICAgICAgICBsZXQgZHQgPSBldnQuZGF0YVRyYW5zZmVyXHJcbiAgICAgICAgaWYgKCFkdCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKGR0Lml0ZW1zKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZHQuaXRlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSBkdC5pdGVtc1tpXVxyXG4gICAgICAgICAgICBpZiAoaXRlbS5raW5kID09ICdmaWxlJykge1xyXG4gICAgICAgICAgICAgIGZpbGUgPSBpdGVtLmdldEFzRmlsZSgpXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBmaWxlID0gZHQuZmlsZXNbMF1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICB0aGlzLl9vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRZID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMub3V0cHV0V2lkdGggLSB0aGlzLmltZ0RhdGEuc3RhcnRYID4gdGhpcy5pbWdEYXRhLndpZHRoKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vdXRwdXRIZWlnaHQgLSB0aGlzLmltZ0RhdGEuc3RhcnRZID4gdGhpcy5pbWdEYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMub3V0cHV0V2lkdGgpIHtcclxuICAgICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHRoaXMub3V0cHV0V2lkdGggLyB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5oZWlnaHQgPCB0aGlzLm91dHB1dEhlaWdodCkge1xyXG4gICAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5vdXRwdXRIZWlnaHQgLyB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfc2V0T3JpZW50YXRpb24gKG9yaWVudGF0aW9uID0gNiwgYXBwbHlNZXRhZGF0YSkge1xyXG4gICAgICAgIHZhciB1c2VPcmlnaW5hbCA9IGFwcGx5TWV0YWRhdGFcclxuICAgICAgICBpZiAob3JpZW50YXRpb24gPiAxIHx8IHVzZU9yaWdpbmFsKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICAgIHRoaXMucm90YXRpbmcgPSB0cnVlXHJcbiAgICAgICAgICB2YXIgX2ltZyA9IHUuZ2V0Um90YXRlZEltYWdlKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxyXG4gICAgICAgICAgX2ltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1nID0gX2ltZ1xyXG4gICAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKGFwcGx5TWV0YWRhdGEpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoYXBwbHlNZXRhZGF0YSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PSAyKSB7XHJcbiAgICAgICAgICAvLyBmbGlwIHhcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBYKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA0KSB7XHJcbiAgICAgICAgICAvLyBmbGlwIHlcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBZKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA2KSB7XHJcbiAgICAgICAgICAvLyA5MCBkZWdcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSAzKSB7XHJcbiAgICAgICAgICAvLyAxODAgZGVnXHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gOCkge1xyXG4gICAgICAgICAgLy8gMjcwIGRlZ1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodXNlT3JpZ2luYWwpIHtcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvblxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9wYWludEJhY2tncm91bmQgKCkge1xyXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJ3RyYW5zcGFyZW50JyA6IHRoaXMuY2FudmFzQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBiYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfZHJhdyAoKSB7XHJcbiAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fZHJhd0ZyYW1lKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZHJhd0ZyYW1lKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2RyYXdGcmFtZSAoKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5pbWdEYXRhXHJcblxyXG4gICAgICAgIHRoaXMuX3BhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuRFJBVywgY3R4KVxyXG4gICAgICAgIGlmICghdGhpcy5pbWFnZVNldCkge1xyXG4gICAgICAgICAgdGhpcy5pbWFnZVNldCA9IHRydWVcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLk5FV19JTUFHRV9EUkFXTilcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yb3RhdGluZyA9IGZhbHNlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfYXBwbHlNZXRhZGF0YSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnVzZXJNZXRhZGF0YSkgcmV0dXJuXHJcbiAgICAgICAgdmFyIHsgc3RhcnRYLCBzdGFydFksIHNjYWxlIH0gPSB0aGlzLnVzZXJNZXRhZGF0YVxyXG5cclxuICAgICAgICBpZiAodS5udW1iZXJWYWxpZChzdGFydFgpKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gc3RhcnRYXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodS5udW1iZXJWYWxpZChzdGFydFkpKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gc3RhcnRZXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodS5udW1iZXJWYWxpZChzY2FsZSkpIHtcclxuICAgICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHNjYWxlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnVzZXJNZXRhZGF0YSA9IG51bGxcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgb25EaW1lbnNpb25DaGFuZ2UgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuX2luaXRpYWxpemUoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuX3NldFNpemUoKVxyXG4gICAgICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZSBsYW5nPVwic3R5bHVzXCI+XHJcbiAgLmNyb3BwYS1jb250YWluZXJcclxuICAgIGRpc3BsYXkgaW5saW5lLWJsb2NrXHJcbiAgICBjdXJzb3IgcG9pbnRlclxyXG4gICAgdHJhbnNpdGlvbiBhbGwgMC4zc1xyXG4gICAgcG9zaXRpb24gcmVsYXRpdmVcclxuICAgIGZvbnQtc2l6ZSAwXHJcbiAgICBhbGlnbi1zZWxmIGZsZXgtc3RhcnRcclxuICAgIGJhY2tncm91bmQtY29sb3IgI2U2ZTZlNlxyXG5cclxuICAgIGNhbnZhc1xyXG4gICAgICB0cmFuc2l0aW9uIGFsbCAwLjNzXHJcblxyXG4gICAgJjpob3ZlclxyXG4gICAgICBvcGFjaXR5IDAuN1xyXG5cclxuICAgICYuY3JvcHBhLS1kcm9wem9uZVxyXG4gICAgICBib3gtc2hhZG93IGluc2V0IDAgMCAxMHB4IGxpZ2h0bmVzcyhibGFjaywgMjAlKVxyXG5cclxuICAgICAgY2FudmFzXHJcbiAgICAgICAgb3BhY2l0eSAwLjVcclxuXHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWQtY2NcclxuICAgICAgY3Vyc29yIGRlZmF1bHRcclxuXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5IDFcclxuXHJcbiAgICAmLmNyb3BwYS0taGFzLXRhcmdldFxyXG4gICAgICBjdXJzb3IgbW92ZVxyXG5cclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHkgMVxyXG5cclxuICAgICAgJi5jcm9wcGEtLWRpc2FibGVkLW16XHJcbiAgICAgICAgY3Vyc29yIGRlZmF1bHRcclxuXHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWRcclxuICAgICAgY3Vyc29yIG5vdC1hbGxvd2VkXHJcblxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eSAxXHJcblxyXG4gICAgJi5jcm9wcGEtLXBhc3NpdmVcclxuICAgICAgY3Vyc29yIGRlZmF1bHRcclxuXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5IDFcclxuXHJcbiAgICBzdmcuaWNvbi1yZW1vdmVcclxuICAgICAgcG9zaXRpb24gYWJzb2x1dGVcclxuICAgICAgYmFja2dyb3VuZCB3aGl0ZVxyXG4gICAgICBib3JkZXItcmFkaXVzIDUwJVxyXG4gICAgICBmaWx0ZXIgZHJvcC1zaGFkb3coLTJweCAycHggMnB4IHJnYmEoMCwgMCwgMCwgMC43KSlcclxuICAgICAgei1pbmRleCAxMFxyXG4gICAgICBjdXJzb3IgcG9pbnRlclxyXG4gICAgICBib3JkZXIgMnB4IHNvbGlkIHdoaXRlXHJcbjwvc3R5bGU+XHJcblxyXG48c3R5bGUgbGFuZz1cInNjc3NcIj5cclxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdG9iaWFzYWhsaW4vU3BpbktpdC9ibG9iL21hc3Rlci9zY3NzL3NwaW5uZXJzLzEwLWZhZGluZy1jaXJjbGUuc2Nzc1xyXG4gIC5zay1mYWRpbmctY2lyY2xlIHtcclxuICAgICRjaXJjbGVDb3VudDogMTI7XHJcbiAgICAkYW5pbWF0aW9uRHVyYXRpb246IDFzO1xyXG5cclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuXHJcbiAgICAuc2stY2lyY2xlIHtcclxuICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICBsZWZ0OiAwO1xyXG4gICAgICB0b3A6IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLnNrLWNpcmNsZSAuc2stY2lyY2xlLWluZGljYXRvciB7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICBtYXJnaW46IDAgYXV0bztcclxuICAgICAgd2lkdGg6IDE1JTtcclxuICAgICAgaGVpZ2h0OiAxNSU7XHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDEwMCU7XHJcbiAgICAgIGFuaW1hdGlvbjogc2stY2lyY2xlRmFkZURlbGF5ICRhbmltYXRpb25EdXJhdGlvbiBpbmZpbml0ZSBlYXNlLWluLW91dCBib3RoO1xyXG4gICAgfVxyXG5cclxuICAgIEBmb3IgJGkgZnJvbSAyIHRocm91Z2ggJGNpcmNsZUNvdW50IHtcclxuICAgICAgLnNrLWNpcmNsZSN7JGl9IHtcclxuICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcgLyAkY2lyY2xlQ291bnQgKiAoJGkgLSAxKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBAZm9yICRpIGZyb20gMiB0aHJvdWdoICRjaXJjbGVDb3VudCB7XHJcbiAgICAgIC5zay1jaXJjbGUjeyRpfSAuc2stY2lyY2xlLWluZGljYXRvciB7XHJcbiAgICAgICAgYW5pbWF0aW9uLWRlbGF5OiAtICRhbmltYXRpb25EdXJhdGlvbiArICRhbmltYXRpb25EdXJhdGlvbiAvICRjaXJjbGVDb3VudCAqXHJcbiAgICAgICAgICAoXHJcbiAgICAgICAgICAgICRpIC0gMVxyXG4gICAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBAa2V5ZnJhbWVzIHNrLWNpcmNsZUZhZGVEZWxheSB7XHJcbiAgICAwJSxcclxuICAgIDM5JSxcclxuICAgIDEwMCUge1xyXG4gICAgICBvcGFjaXR5OiAwO1xyXG4gICAgfVxyXG4gICAgNDAlIHtcclxuICAgICAgb3BhY2l0eTogMTtcclxuICAgIH1cclxuICB9XHJcbjwvc3R5bGU+XHJcblxyXG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiaW1wb3J0IGNvbXBvbmVudCBmcm9tICcuL2Nyb3BwZXIudnVlJ1xyXG5pbXBvcnQgYXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nXHJcblxyXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcclxuICBjb21wb25lbnROYW1lOiAnY3JvcHBhJ1xyXG59XHJcblxyXG5jb25zdCBWdWVDcm9wcGEgPSB7XHJcbiAgaW5zdGFsbDogZnVuY3Rpb24gKFZ1ZSwgb3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IGFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpXHJcbiAgICBsZXQgdmVyc2lvbiA9IE51bWJlcihWdWUudmVyc2lvbi5zcGxpdCgnLicpWzBdKVxyXG4gICAgaWYgKHZlcnNpb24gPCAyKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdnVlLWNyb3BwYSBzdXBwb3J0cyB2dWUgdmVyc2lvbiAyLjAgYW5kIGFib3ZlLiBZb3UgYXJlIHVzaW5nIFZ1ZUAke3ZlcnNpb259LiBQbGVhc2UgdXBncmFkZSB0byB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgVnVlLmApXHJcbiAgICB9XHJcbiAgICBsZXQgY29tcG9uZW50TmFtZSA9IG9wdGlvbnMuY29tcG9uZW50TmFtZSB8fCAnY3JvcHBhJ1xyXG5cclxuICAgIC8vIHJlZ2lzdHJhdGlvblxyXG4gICAgVnVlLmNvbXBvbmVudChjb21wb25lbnROYW1lLCBjb21wb25lbnQpXHJcbiAgfSxcclxuXHJcbiAgY29tcG9uZW50XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgVnVlQ3JvcHBhIl0sIm5hbWVzIjpbImRlZmluZSIsInRoaXMiLCJwb2ludCIsInZtIiwiY2FudmFzIiwicXVhbGl0eSIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRYIiwiY2xpZW50WSIsImxlZnQiLCJ0b3AiLCJldnQiLCJwb2ludGVyIiwidG91Y2hlcyIsImNoYW5nZWRUb3VjaGVzIiwib25lUG9pbnRDb29yZCIsInBvaW50ZXIxIiwicG9pbnRlcjIiLCJjb29yZDEiLCJjb29yZDIiLCJNYXRoIiwic3FydCIsInBvdyIsIngiLCJ5IiwiaW1nIiwiY29tcGxldGUiLCJuYXR1cmFsV2lkdGgiLCJkb2N1bWVudCIsIndpbmRvdyIsImxhc3RUaW1lIiwidmVuZG9ycyIsImxlbmd0aCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiY2FsbGJhY2siLCJjdXJyVGltZSIsIkRhdGUiLCJnZXRUaW1lIiwidGltZVRvQ2FsbCIsIm1heCIsImlkIiwic2V0VGltZW91dCIsImFyZyIsImlzQXJyYXkiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJIVE1MQ2FudmFzRWxlbWVudCIsImJpblN0ciIsImxlbiIsImFyciIsInRvQmxvYiIsImRlZmluZVByb3BlcnR5IiwidHlwZSIsImF0b2IiLCJ0b0RhdGFVUkwiLCJzcGxpdCIsIlVpbnQ4QXJyYXkiLCJpIiwiY2hhckNvZGVBdCIsIkJsb2IiLCJkdCIsImRhdGFUcmFuc2ZlciIsIm9yaWdpbmFsRXZlbnQiLCJ0eXBlcyIsImFycmF5QnVmZmVyIiwidmlldyIsIkRhdGFWaWV3IiwiZ2V0VWludDE2IiwiYnl0ZUxlbmd0aCIsIm9mZnNldCIsIm1hcmtlciIsImdldFVpbnQzMiIsImxpdHRsZSIsInRhZ3MiLCJiYXNlNjQiLCJyZXBsYWNlIiwiYmluYXJ5U3RyaW5nIiwiYnl0ZXMiLCJidWZmZXIiLCJvcmllbnRhdGlvbiIsIl9jYW52YXMiLCJDYW52YXNFeGlmT3JpZW50YXRpb24iLCJkcmF3SW1hZ2UiLCJfaW1nIiwiSW1hZ2UiLCJzcmMiLCJvcmkiLCJtYXAiLCJuIiwiaXNOYU4iLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJ2YWx1ZSIsImlzRmluaXRlIiwiZmxvb3IiLCJpbml0aWFsSW1hZ2VUeXBlIiwiU3RyaW5nIiwidmFsIiwiQm9vbGVhbiIsInZhbGlkcyIsImV2ZXJ5IiwiaW5kZXhPZiIsIndvcmQiLCJ0ZXN0IiwiUENUX1BFUl9aT09NIiwiTUlOX01TX1BFUl9DTElDSyIsIkNMSUNLX01PVkVfVEhSRVNIT0xEIiwiTUlOX1dJRFRIIiwiREVGQVVMVF9QTEFDRUhPTERFUl9UQUtFVVAiLCJQSU5DSF9BQ0NFTEVSQVRJT04iLCJzeW5jRGF0YSIsInJlbmRlciIsImV2ZW50cyIsIklOSVRfRVZFTlQiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwicGxhY2Vob2xkZXJGb250U2l6ZSIsIm5hdHVyYWxIZWlnaHQiLCJsb2FkaW5nU2l6ZSIsIl9pbml0aWFsaXplIiwickFGUG9seWZpbGwiLCJ0b0Jsb2JQb2x5ZmlsbCIsInN1cHBvcnRzIiwic3VwcG9ydERldGVjdGlvbiIsImJhc2ljIiwid2FybiIsInBhc3NpdmUiLCIkd2F0Y2giLCJkYXRhIiwic2V0Iiwia2V5IiwiJHNldCIsInJlbW92ZSIsIiRuZXh0VGljayIsIl9kcmF3Iiwib25EaW1lbnNpb25DaGFuZ2UiLCJfc2V0UGxhY2Vob2xkZXJzIiwiaW1hZ2VTZXQiLCJfcGxhY2VJbWFnZSIsIm9sZFZhbCIsInUiLCJudW1iZXJWYWxpZCIsInBvcyIsImN1cnJlbnRQb2ludGVyQ29vcmQiLCJpbWdEYXRhIiwic3RhcnRYIiwic3RhcnRZIiwicHJldmVudFdoaXRlU3BhY2UiLCJfcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UiLCJfcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSIsInVzZXJNZXRhZGF0YSIsInJvdGF0aW5nIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJzY2FsZVJhdGlvIiwiaGFzSW1hZ2UiLCJhYnMiLCIkZW1pdCIsIlpPT01fRVZFTlQiLCJMT0FESU5HX1NUQVJUIiwiTE9BRElOR19FTkQiLCJjdHgiLCIkcmVmcyIsImZpbGVJbnB1dCIsImZpbGVzIiwib2xkWCIsIm9sZFkiLCJNT1ZFX0VWRU5UIiwiYW1vdW50IiwibW92ZSIsInpvb21JbiIsImFjY2VsZXJhdGlvbiIsInJlYWxTcGVlZCIsInpvb21TcGVlZCIsInNwZWVkIiwib3V0cHV0V2lkdGgiLCJ6b29tIiwic3RlcCIsImRpc2FibGVSb3RhdGlvbiIsImRpc2FibGVkIiwicGFyc2VJbnQiLCJfcm90YXRlQnlTdGVwIiwiX3NldE9yaWVudGF0aW9uIiwibWV0YWRhdGEiLCJjb21wcmVzc2lvblJhdGUiLCJtaW1lVHlwZSIsInF1YWxpdHlBcmd1bWVudCIsImFyZ3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImdlbmVyYXRlQmxvYiIsImJsb2IiLCJlcnIiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiRmlsZSIsIkZpbGVSZWFkZXIiLCJGaWxlTGlzdCIsImNsaWNrIiwiaGFkSW1hZ2UiLCJvcmlnaW5hbEltYWdlIiwibG9hZGluZyIsIklNQUdFX1JFTU9WRV9FVkVOVCIsIl9zZXRTaXplIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjYW52YXNDb2xvciIsImdldENvbnRleHQiLCJfc2V0SW5pdGlhbCIsIm91dHB1dEhlaWdodCIsIiRzbG90cyIsInBsYWNlaG9sZGVyIiwidk5vZGUiLCJ0YWciLCJlbG0iLCJvbkxvYWQiLCJpbWFnZUxvYWRlZCIsIm9ubG9hZCIsInRleHRCYXNlbGluZSIsInRleHRBbGlnbiIsImRlZmF1bHRGb250U2l6ZSIsImZvbnRTaXplIiwiY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplIiwiZm9udCIsImZpbGxTdHlsZSIsInBsYWNlaG9sZGVyQ29sb3IiLCJmaWxsVGV4dCIsIl9wYWludEJhY2tncm91bmQiLCJfc2V0SW1hZ2VQbGFjZWhvbGRlciIsIl9zZXRUZXh0UGxhY2Vob2xkZXIiLCJpbml0aWFsIiwiaW5pdGlhbEltYWdlIiwic2V0QXR0cmlidXRlIiwiYmFiZWxIZWxwZXJzLnR5cGVvZiIsImN1cnJlbnRJc0luaXRpYWwiLCJfb25sb2FkIiwiZGF0YXNldCIsIm9uZXJyb3IiLCJJTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVCIsImRpc2FibGVDbGlja1RvQ2hvb3NlIiwic3VwcG9ydFRvdWNoIiwiY2hvb3NlRmlsZSIsImlucHV0IiwiZmlsZSIsIl9vbk5ld0ZpbGVJbiIsIkZJTEVfQ0hPT1NFX0VWRU5UIiwiX2ZpbGVTaXplSXNWYWxpZCIsIkZJTEVfU0laRV9FWENFRURfRVZFTlQiLCJFcnJvciIsImZpbGVTaXplTGltaXQiLCJfZmlsZVR5cGVJc1ZhbGlkIiwiRklMRV9UWVBFX01JU01BVENIX0VWRU5UIiwibmFtZSIsInRvTG93ZXJDYXNlIiwicG9wIiwiYWNjZXB0IiwiZnIiLCJlIiwiZmlsZURhdGEiLCJ0YXJnZXQiLCJyZXN1bHQiLCJnZXRGaWxlT3JpZW50YXRpb24iLCJiYXNlNjRUb0FycmF5QnVmZmVyIiwiTkVXX0lNQUdFIiwicmVhZEFzRGF0YVVSTCIsInNpemUiLCJhY2NlcGN0IiwiYmFzZU1pbWV0eXBlIiwidCIsInRyaW0iLCJjaGFyQXQiLCJzbGljZSIsImZpbGVCYXNlVHlwZSIsImFwcGx5TWV0YWRhdGEiLCJfYXNwZWN0RmlsbCIsImluaXRpYWxTaXplIiwiX2FzcGVjdEZpdCIsIl9uYXR1cmFsU2l6ZSIsImluaXRpYWxQb3NpdGlvbiIsImV4ZWMiLCJfYXBwbHlNZXRhZGF0YSIsImltZ1dpZHRoIiwiaW1nSGVpZ2h0IiwiY2FudmFzUmF0aW8iLCJhc3BlY3RSYXRpbyIsInBvaW50ZXJNb3ZlZCIsInBvaW50ZXJDb29yZCIsImdldFBvaW50ZXJDb29yZHMiLCJwb2ludGVyU3RhcnRDb29yZCIsInRhYlN0YXJ0IiwidmFsdWVPZiIsIndoaWNoIiwiZHJhZ2dpbmciLCJwaW5jaGluZyIsImNvb3JkIiwibGFzdE1vdmluZ0Nvb3JkIiwiZGlzYWJsZVBpbmNoVG9ab29tIiwicGluY2hEaXN0YW5jZSIsImdldFBpbmNoRGlzdGFuY2UiLCJjYW5jZWxFdmVudHMiLCJhZGRFdmVudExpc3RlbmVyIiwiX2hhbmRsZVBvaW50ZXJFbmQiLCJwb2ludGVyTW92ZURpc3RhbmNlIiwidGFiRW5kIiwiZGlzYWJsZURyYWdUb01vdmUiLCJwcmV2ZW50RGVmYXVsdCIsImRpc3RhbmNlIiwiZGVsdGEiLCJkaXNhYmxlU2Nyb2xsVG9ab29tIiwic2Nyb2xsaW5nIiwid2hlZWxEZWx0YSIsImRlbHRhWSIsImRldGFpbCIsInJldmVyc2VTY3JvbGxUb1pvb20iLCJkaXNhYmxlRHJhZ0FuZERyb3AiLCJldmVudEhhc0ZpbGUiLCJyZXBsYWNlRHJvcCIsImZpbGVEcmFnZ2VkT3ZlciIsIml0ZW1zIiwiaXRlbSIsImtpbmQiLCJnZXRBc0ZpbGUiLCJ1c2VPcmlnaW5hbCIsImdldFJvdGF0ZWRJbWFnZSIsImZsaXBYIiwiZmxpcFkiLCJyb3RhdGU5MCIsImNsZWFyUmVjdCIsImZpbGxSZWN0IiwiX2RyYXdGcmFtZSIsIkRSQVciLCJORVdfSU1BR0VfRFJBV04iLCJzY2FsZSIsImRlZmF1bHRPcHRpb25zIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImFzc2lnbiIsInZlcnNpb24iLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQ0FBQyxVQUFVLElBQUksRUFBRSxPQUFPLEVBQUU7SUFDdEIsSUFBSSxPQUFPQSxTQUFNLEtBQUssVUFBVSxJQUFJQSxTQUFNLENBQUMsR0FBRyxFQUFFO1FBQzVDQSxTQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3ZCLE1BQU0sQUFB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
