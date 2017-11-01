/*
 * vue-croppa v1.1.0
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
if (window && window.Image) {
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
  }
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
// const DEBUG = false

var component = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { ref: "wrapper", class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') + ' ' + (_vm.disabled ? 'croppa--disabled' : '') + ' ' + (_vm.disableClickToChoose ? 'croppa--disabled-cc' : '') + ' ' + (_vm.disableDragToMove && _vm.disableScrollToZoom ? 'croppa--disabled-mz' : '') + ' ' + (_vm.fileDraggedOver ? 'croppa--dropzone' : ''), on: { "dragenter": function dragenter($event) {
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
        } } }), _vm.showRemoveButton && _vm.img ? _c('svg', { staticClass: "icon icon-remove", style: 'top: -' + _vm.height / 40 + 'px; right: -' + _vm.width / 40 + 'px', attrs: { "viewBox": "0 0 1024 1024", "version": "1.1", "xmlns": "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", "width": _vm.removeButtonSize || _vm.width / 10, "height": _vm.removeButtonSize || _vm.width / 10 }, on: { "click": _vm.remove } }, [_c('path', { attrs: { "d": "M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z", "fill": _vm.removeButtonColor } })]) : _vm._e(), _vm.showLoading && _vm.loading ? _c('div', { staticClass: "sk-fading-circle", style: _vm.loadingStyle }, _vm._l(12, function (i) {
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
    this._initialize();
    u.rAFPolyfill();
    u.toBlobPolyfill();

    var supports = this.supportDetection();
    if (!supports.basic) {
      console.warn('Your browser does not support vue-croppa functionality.');
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
      if (!u.numberValid(val)) return;
      this.scaleRatio = val / this.naturalHeight;
    },
    loading: function loading(val) {
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
      if (!offset) return;
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

      if (this.disableRotation || this.disabled) return;
      step = parseInt(step);
      if (isNaN(step) || step > 3 || step < -3) {
        console.warn('Invalid argument for rotate() method. It should one of the integers from -3 to 3.');
        step = 1;
      }
      this._rotateByStep(step);
    },
    flipX: function flipX() {
      if (this.disableRotation || this.disabled) return;
      this._setOrientation(2);
    },
    flipY: function flipY() {
      if (this.disableRotation || this.disabled) return;
      this._setOrientation(4);
    },
    refresh: function refresh() {
      this.$nextTick(this._initialize);
    },
    hasImage: function hasImage() {
      return !!this.imageSet;
    },
    applyMetadata: function applyMetadata(metadata) {
      if (!metadata) return;
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
      }
      this.canvas.toBlob(callback, mimeType, qualityArgument);
    },
    promisedBlob: function promisedBlob() {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof Promise == 'undefined') {
        console.warn('No Promise support. Please add Promise polyfill if you want to use this method.');
        return;
      }
      return new Promise(function (resolve, reject) {
        try {
          _this.generateBlob(function (blob) {
            resolve(blob);
          }, args);
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
      var div = document.createElement('div');
      return {
        'basic': window.requestAnimationFrame && window.File && window.FileReader && window.FileList && window.Blob,
        'dnd': 'ondragstart' in div && 'ondrop' in div
      };
    },
    chooseFile: function chooseFile() {
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
      this.$emit(events.INIT_EVENT, this);
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
      var _this2 = this;

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
        _this2.ctx.drawImage(img, 0, 0, _this2.outputWidth, _this2.outputHeight);
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
      var _this3 = this;

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
          _this3._onload(img, +img.dataset['exifOrientation'], true);
        };

        img.onerror = function () {
          _this3._setPlaceholders();
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
      if (!this.hasImage() && !this.disableClickToChoose && !this.disabled && !this.supportTouch) {
        this.chooseFile();
      }
    },
    _handleInputChange: function _handleInputChange() {
      var input = this.$refs.fileInput;
      if (!input.files.length) return;

      var file = input.files[0];
      this._onNewFileIn(file);
    },
    _onNewFileIn: function _onNewFileIn(file) {
      var _this4 = this;

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
      if (typeof window.FileReader !== 'undefined') {
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
            _this4._onload(img, orientation);
            _this4.$emit(events.NEW_IMAGE);
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
      this.currentPointerCoord = null;
    },
    _handleWheel: function _handleWheel(evt) {
      var _this5 = this;

      if (this.disabled || this.disableScrollToZoom || !this.hasImage()) return;
      evt.preventDefault();
      this.scrolling = true;
      if (evt.wheelDelta < 0 || evt.deltaY > 0 || evt.detail > 0) {
        this.zoom(this.reverseScrollToZoom);
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseScrollToZoom);
      }
      this.$nextTick(function () {
        _this5.scrolling = false;
      });
    },
    _handleDragEnter: function _handleDragEnter(evt) {
      if (this.disabled || this.disableDragAndDrop || this.hasImage() || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = true;
    },
    _handleDragLeave: function _handleDragLeave(evt) {
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = false;
    },
    _handleDragOver: function _handleDragOver(evt) {},
    _handleDrop: function _handleDrop(evt) {
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
      var _this6 = this;

      var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
      var applyMetadata = arguments[1];

      var useOriginal = applyMetadata;
      if (orientation > 1 || useOriginal) {
        if (!this.img) return;
        this.rotating = true;
        var _img = u.getRotatedImage(useOriginal ? this.originalImage : this.img, orientation);
        _img.onload = function () {
          _this6.img = _img;
          _this6._placeImage(applyMetadata);
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
      var _this7 = this;

      this.$nextTick(function () {
        if (!_this7.img) return;
        if (window.requestAnimationFrame) {
          requestAnimationFrame(_this7._drawFrame);
        } else {
          _this7._drawFrame();
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
      var _this8 = this;

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
        _this8.userMetadata = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgYmFzZTY0ID0gYmFzZTY0LnJlcGxhY2UoL15kYXRhOihbXjtdKyk7YmFzZTY0LC9nbWksICcnKVxyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9XHJcbiAgTnVtYmVyLmlzSW50ZWdlciB8fFxyXG4gIGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmXHJcbiAgICAgIGlzRmluaXRlKHZhbHVlKSAmJlxyXG4gICAgICBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWVcclxuICAgIClcclxuICB9XHJcblxyXG52YXIgaW5pdGlhbEltYWdlVHlwZSA9IFN0cmluZ1xyXG5pZiAod2luZG93ICYmIHdpbmRvdy5JbWFnZSkge1xyXG4gIGluaXRpYWxJbWFnZVR5cGUgPSBbU3RyaW5nLCBJbWFnZV1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBoZWlnaHQ6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBwbGFjZWhvbGRlcjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ0Nob29zZSBhbiBpbWFnZSdcclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjNjA2MDYwJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJGb250U2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcclxuICB9LFxyXG4gIHF1YWxpdHk6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgem9vbVNwZWVkOiB7XHJcbiAgICBkZWZhdWx0OiAzLFxyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGFjY2VwdDogU3RyaW5nLFxyXG4gIGZpbGVTaXplTGltaXQ6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnQW5kRHJvcDogQm9vbGVhbixcclxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ1RvTW92ZTogQm9vbGVhbixcclxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIGRpc2FibGVQaW5jaFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUm90YXRpb246IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9LFxyXG4gIGluaXRpYWxJbWFnZTogaW5pdGlhbEltYWdlVHlwZSxcclxuICBpbml0aWFsU2l6ZToge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ2NvdmVyJyxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPT09ICdjb3ZlcicgfHwgdmFsID09PSAnY29udGFpbicgfHwgdmFsID09PSAnbmF0dXJhbCdcclxuICAgIH1cclxuICB9LFxyXG4gIGluaXRpYWxQb3NpdGlvbjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ2NlbnRlcicsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICB2YXIgdmFsaWRzID0gWydjZW50ZXInLCAndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0J11cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICB2YWwuc3BsaXQoJyAnKS5ldmVyeSh3b3JkID0+IHtcclxuICAgICAgICAgIHJldHVybiB2YWxpZHMuaW5kZXhPZih3b3JkKSA+PSAwXHJcbiAgICAgICAgfSkgfHwgL14tP1xcZCslIC0/XFxkKyUkLy50ZXN0KHZhbClcclxuICAgICAgKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaW5wdXRBdHRyczogT2JqZWN0LFxyXG4gIHNob3dMb2FkaW5nOiBCb29sZWFuLFxyXG4gIGxvYWRpbmdTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMFxyXG4gIH0sXHJcbiAgbG9hZGluZ0NvbG9yOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnIzYwNjA2MCdcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBJTklUX0VWRU5UOiAnaW5pdCcsXG4gIEZJTEVfQ0hPT1NFX0VWRU5UOiAnZmlsZS1jaG9vc2UnLFxuICBGSUxFX1NJWkVfRVhDRUVEX0VWRU5UOiAnZmlsZS1zaXplLWV4Y2VlZCcsXG4gIEZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVDogJ2ZpbGUtdHlwZS1taXNtYXRjaCcsXG4gIE5FV19JTUFHRTogJ25ldy1pbWFnZScsXG4gIE5FV19JTUFHRV9EUkFXTjogJ25ldy1pbWFnZS1kcmF3bicsXG4gIElNQUdFX1JFTU9WRV9FVkVOVDogJ2ltYWdlLXJlbW92ZScsXG4gIE1PVkVfRVZFTlQ6ICdtb3ZlJyxcbiAgWk9PTV9FVkVOVDogJ3pvb20nLFxuICBEUkFXOiAnZHJhdycsXG4gIElOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UOiAnaW5pdGlhbC1pbWFnZS1sb2FkZWQnLFxuICBMT0FESU5HX1NUQVJUOiAnbG9hZGluZy1zdGFydCcsXG4gIExPQURJTkdfRU5EOiAnbG9hZGluZy1lbmQnXG59XG4iLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiByZWY9XCJ3cmFwcGVyXCJcclxuICAgIDpjbGFzcz1cImBjcm9wcGEtY29udGFpbmVyICR7aW1nID8gJ2Nyb3BwYS0taGFzLXRhcmdldCcgOiAnJ30gJHtkaXNhYmxlZCA/ICdjcm9wcGEtLWRpc2FibGVkJyA6ICcnfSAke2Rpc2FibGVDbGlja1RvQ2hvb3NlID8gJ2Nyb3BwYS0tZGlzYWJsZWQtY2MnIDogJyd9ICR7ZGlzYWJsZURyYWdUb01vdmUgJiYgZGlzYWJsZVNjcm9sbFRvWm9vbSA/ICdjcm9wcGEtLWRpc2FibGVkLW16JyA6ICcnfSAke2ZpbGVEcmFnZ2VkT3ZlciA/ICdjcm9wcGEtLWRyb3B6b25lJyA6ICcnfWBcIlxyXG4gICAgQGRyYWdlbnRlci5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJhZ0VudGVyXCJcclxuICAgIEBkcmFnbGVhdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdMZWF2ZVwiXHJcbiAgICBAZHJhZ292ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdPdmVyXCJcclxuICAgIEBkcm9wLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcm9wXCI+XHJcbiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIlxyXG4gICAgICA6YWNjZXB0PVwiYWNjZXB0XCJcclxuICAgICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxyXG4gICAgICB2LWJpbmQ9XCJpbnB1dEF0dHJzXCJcclxuICAgICAgcmVmPVwiZmlsZUlucHV0XCJcclxuICAgICAgQGNoYW5nZT1cIl9oYW5kbGVJbnB1dENoYW5nZVwiXHJcbiAgICAgIHN0eWxlPVwiaGVpZ2h0OjFweDt3aWR0aDoxcHg7b3ZlcmZsb3c6aGlkZGVuO21hcmdpbi1sZWZ0Oi05OTk5OXB4O3Bvc2l0aW9uOmFic29sdXRlO1wiIC8+XHJcbiAgICA8ZGl2IGNsYXNzPVwic2xvdHNcIlxyXG4gICAgICBzdHlsZT1cIndpZHRoOiAwOyBoZWlnaHQ6IDA7IHZpc2liaWxpdHk6IGhpZGRlbjtcIj5cclxuICAgICAgPHNsb3QgbmFtZT1cImluaXRpYWxcIj48L3Nsb3Q+XHJcbiAgICAgIDxzbG90IG5hbWU9XCJwbGFjZWhvbGRlclwiPjwvc2xvdD5cclxuICAgIDwvZGl2PlxyXG4gICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIlxyXG4gICAgICBAY2xpY2suc3RvcC5wcmV2ZW50PVwiX2hhbmRsZUNsaWNrXCJcclxuICAgICAgQHRvdWNoc3RhcnQuc3RvcD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICBAbW91c2Vkb3duLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICBAcG9pbnRlcnN0YXJ0LnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICBAdG91Y2hjYW5jZWwuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICBAbW91c2V1cC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgQHBvaW50ZXJjYW5jZWwuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICBAdG91Y2htb3ZlLnN0b3A9XCJfaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICBAbW91c2Vtb3ZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgIEBwb2ludGVybW92ZS5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICBAcG9pbnRlcmxlYXZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyTGVhdmVcIlxyXG4gICAgICBARE9NTW91c2VTY3JvbGwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXHJcbiAgICAgIEB3aGVlbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCJcclxuICAgICAgQG1vdXNld2hlZWwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiPjwvY2FudmFzPlxyXG4gICAgPHN2ZyBjbGFzcz1cImljb24gaWNvbi1yZW1vdmVcIlxyXG4gICAgICB2LWlmPVwic2hvd1JlbW92ZUJ1dHRvbiAmJiBpbWdcIlxyXG4gICAgICBAY2xpY2s9XCJyZW1vdmVcIlxyXG4gICAgICA6c3R5bGU9XCJgdG9wOiAtJHtoZWlnaHQvNDB9cHg7IHJpZ2h0OiAtJHt3aWR0aC80MH1weGBcIlxyXG4gICAgICB2aWV3Qm94PVwiMCAwIDEwMjQgMTAyNFwiXHJcbiAgICAgIHZlcnNpb249XCIxLjFcIlxyXG4gICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcclxuICAgICAgOndpZHRoPVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aC8xMFwiXHJcbiAgICAgIDpoZWlnaHQ9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCI+XHJcbiAgICAgIDxwYXRoIGQ9XCJNNTExLjkyMTIzMSAwQzIyOS4xNzkwNzcgMCAwIDIyOS4yNTc4NDYgMCA1MTIgMCA3OTQuNzAyNzY5IDIyOS4xNzkwNzcgMTAyNCA1MTEuOTIxMjMxIDEwMjQgNzk0Ljc4MTUzOCAxMDI0IDEwMjQgNzk0LjcwMjc2OSAxMDI0IDUxMiAxMDI0IDIyOS4yNTc4NDYgNzk0Ljc4MTUzOCAwIDUxMS45MjEyMzEgMFpNNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDY1MC41MTU2OTIgNzMyLjA4MTIzMUM2NTAuNTE1NjkyIDczMi4wODEyMzEgNTIxLjQ5MTY5MiA1OTMuNjgzNjkyIDUxMS44ODE4NDYgNTkzLjY4MzY5MiA1MDIuNDI5NTM4IDU5My42ODM2OTIgMzczLjM2NjE1NCA3MzIuMDgxMjMxIDM3My4zNjYxNTQgNzMyLjA4MTIzMUwyOTEuNzYxMjMxIDY1MC42MzM4NDZDMjkxLjc2MTIzMSA2NTAuNjMzODQ2IDQzMC4zMTYzMDggNTIzLjUwMDMwOCA0MzAuMzE2MzA4IDUxMi4xOTY5MjMgNDMwLjMxNjMwOCA1MDAuNjk2NjE1IDI5MS43NjEyMzEgMzczLjUyMzY5MiAyOTEuNzYxMjMxIDM3My41MjM2OTJMMzczLjM2NjE1NCAyOTEuOTE4NzY5QzM3My4zNjYxNTQgMjkxLjkxODc2OSA1MDMuNDUzNTM4IDQzMC4zOTUwNzcgNTExLjg4MTg0NiA0MzAuMzk1MDc3IDUyMC4zNDk1MzggNDMwLjM5NTA3NyA2NTAuNTE1NjkyIDI5MS45MTg3NjkgNjUwLjUxNTY5MiAyOTEuOTE4NzY5TDczMi4wNDE4NDYgMzczLjUyMzY5MkM3MzIuMDQxODQ2IDM3My41MjM2OTIgNTkzLjQ0NzM4NSA1MDIuNTQ3NjkyIDU5My40NDczODUgNTEyLjE5NjkyMyA1OTMuNDQ3Mzg1IDUyMS40MTI5MjMgNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDczMi4wNDE4NDYgNjUwLjYzMzg0NlpcIlxyXG4gICAgICAgIDpmaWxsPVwicmVtb3ZlQnV0dG9uQ29sb3JcIj48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICAgIDxkaXYgY2xhc3M9XCJzay1mYWRpbmctY2lyY2xlXCJcclxuICAgICAgOnN0eWxlPVwibG9hZGluZ1N0eWxlXCJcclxuICAgICAgdi1pZj1cInNob3dMb2FkaW5nICYmIGxvYWRpbmdcIj5cclxuICAgICAgPGRpdiA6Y2xhc3M9XCJgc2stY2lyY2xlJHtpfSBzay1jaXJjbGVgXCJcclxuICAgICAgICB2LWZvcj1cImkgaW4gMTJcIlxyXG4gICAgICAgIDprZXk9XCJpXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZS1pbmRpY2F0b3JcIlxyXG4gICAgICAgICAgOnN0eWxlPVwie2JhY2tncm91bmRDb2xvcjogbG9hZGluZ0NvbG9yfVwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPHNsb3Q+PC9zbG90PlxyXG4gIDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHNjcmlwdD5cclxuICBpbXBvcnQgdSBmcm9tICcuL3V0aWwnXHJcbiAgaW1wb3J0IHByb3BzIGZyb20gJy4vcHJvcHMnXHJcbiAgaW1wb3J0IGV2ZW50cyBmcm9tICcuL2V2ZW50cydcclxuXHJcbiAgY29uc3QgUENUX1BFUl9aT09NID0gMSAvIDEwMDAwMCAvLyBUaGUgYW1vdW50IG9mIHpvb21pbmcgZXZlcnl0aW1lIGl0IGhhcHBlbnMsIGluIHBlcmNlbnRhZ2Ugb2YgaW1hZ2Ugd2lkdGguXHJcbiAgY29uc3QgTUlOX01TX1BFUl9DTElDSyA9IDUwMCAvLyBJZiB0b3VjaCBkdXJhdGlvbiBpcyBzaG9ydGVyIHRoYW4gdGhlIHZhbHVlLCB0aGVuIGl0IGlzIGNvbnNpZGVyZWQgYXMgYSBjbGljay5cclxuICBjb25zdCBDTElDS19NT1ZFX1RIUkVTSE9MRCA9IDEwMCAvLyBJZiB0b3VjaCBtb3ZlIGRpc3RhbmNlIGlzIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlLCB0aGVuIGl0IHdpbGwgYnkgbm8gbWVhbiBiZSBjb25zaWRlcmVkIGFzIGEgY2xpY2suXHJcbiAgY29uc3QgTUlOX1dJRFRIID0gMTAgLy8gVGhlIG1pbmltYWwgd2lkdGggdGhlIHVzZXIgY2FuIHpvb20gdG8uXHJcbiAgY29uc3QgREVGQVVMVF9QTEFDRUhPTERFUl9UQUtFVVAgPSAyIC8gMyAvLyBQbGFjZWhvbGRlciB0ZXh0IGJ5IGRlZmF1bHQgdGFrZXMgdXAgdGhpcyBhbW91bnQgb2YgdGltZXMgb2YgY2FudmFzIHdpZHRoLlxyXG4gIGNvbnN0IFBJTkNIX0FDQ0VMRVJBVElPTiA9IDEgLy8gVGhlIGFtb3VudCBvZiB0aW1lcyBieSB3aGljaCB0aGUgcGluY2hpbmcgaXMgbW9yZSBzZW5zaXRpdmUgdGhhbiB0aGUgc2NvbGxpbmdcclxuICAvLyBjb25zdCBERUJVRyA9IGZhbHNlXHJcblxyXG4gIGV4cG9ydCBkZWZhdWx0IHtcclxuICAgIG1vZGVsOiB7XHJcbiAgICAgIHByb3A6ICd2YWx1ZScsXHJcbiAgICAgIGV2ZW50OiBldmVudHMuSU5JVF9FVkVOVFxyXG4gICAgfSxcclxuXHJcbiAgICBwcm9wczogcHJvcHMsXHJcblxyXG4gICAgZGF0YSAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICAgIGN0eDogbnVsbCxcclxuICAgICAgICBvcmlnaW5hbEltYWdlOiBudWxsLFxyXG4gICAgICAgIGltZzogbnVsbCxcclxuICAgICAgICBkcmFnZ2luZzogZmFsc2UsXHJcbiAgICAgICAgbGFzdE1vdmluZ0Nvb3JkOiBudWxsLFxyXG4gICAgICAgIGltZ0RhdGE6IHtcclxuICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICAgICAgc3RhcnRYOiAwLFxyXG4gICAgICAgICAgc3RhcnRZOiAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaWxlRHJhZ2dlZE92ZXI6IGZhbHNlLFxyXG4gICAgICAgIHRhYlN0YXJ0OiAwLFxyXG4gICAgICAgIHNjcm9sbGluZzogZmFsc2UsXHJcbiAgICAgICAgcGluY2hpbmc6IGZhbHNlLFxyXG4gICAgICAgIHJvdGF0aW5nOiBmYWxzZSxcclxuICAgICAgICBwaW5jaERpc3RhbmNlOiAwLFxyXG4gICAgICAgIHN1cHBvcnRUb3VjaDogZmFsc2UsXHJcbiAgICAgICAgcG9pbnRlck1vdmVkOiBmYWxzZSxcclxuICAgICAgICBwb2ludGVyU3RhcnRDb29yZDogbnVsbCxcclxuICAgICAgICBuYXR1cmFsV2lkdGg6IDAsXHJcbiAgICAgICAgbmF0dXJhbEhlaWdodDogMCxcclxuICAgICAgICBzY2FsZVJhdGlvOiBudWxsLFxyXG4gICAgICAgIG9yaWVudGF0aW9uOiAxLFxyXG4gICAgICAgIHVzZXJNZXRhZGF0YTogbnVsbCxcclxuICAgICAgICBpbWFnZVNldDogZmFsc2UsXHJcbiAgICAgICAgY3VycmVudFBvaW50ZXJDb29yZDogbnVsbCxcclxuICAgICAgICBjdXJyZW50SXNJbml0aWFsOiBmYWxzZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgIG91dHB1dFdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgb3V0cHV0SGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQgKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJGb250U2l6ZSAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYXNwZWN0UmF0aW8gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hdHVyYWxXaWR0aCAvIHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbG9hZGluZ1N0eWxlICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgd2lkdGg6IHRoaXMubG9hZGluZ1NpemUgKyAncHgnLFxyXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmxvYWRpbmdTaXplICsgJ3B4JyxcclxuICAgICAgICAgIHJpZ2h0OiAnMTVweCcsXHJcbiAgICAgICAgICBib3R0b206ICcxMHB4J1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtb3VudGVkICgpIHtcclxuICAgICAgdGhpcy5faW5pdGlhbGl6ZSgpXHJcbiAgICAgIHUuckFGUG9seWZpbGwoKVxyXG4gICAgICB1LnRvQmxvYlBvbHlmaWxsKClcclxuXHJcbiAgICAgIGxldCBzdXBwb3J0cyA9IHRoaXMuc3VwcG9ydERldGVjdGlvbigpXHJcbiAgICAgIGlmICghc3VwcG9ydHMuYmFzaWMpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHZ1ZS1jcm9wcGEgZnVuY3Rpb25hbGl0eS4nKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHdhdGNoOiB7XHJcbiAgICAgIG91dHB1dFdpZHRoOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5vbkRpbWVuc2lvbkNoYW5nZSgpXHJcbiAgICAgIH0sXHJcbiAgICAgIG91dHB1dEhlaWdodDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMub25EaW1lbnNpb25DaGFuZ2UoKVxyXG4gICAgICB9LFxyXG4gICAgICBjYW52YXNDb2xvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcGxhY2Vob2xkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBjb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcHJldmVudFdoaXRlU3BhY2UgKHZhbCkge1xyXG4gICAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wbGFjZUltYWdlKClcclxuICAgICAgfSxcclxuICAgICAgc2NhbGVSYXRpbyAodmFsLCBvbGRWYWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBpZiAoIXUubnVtYmVyVmFsaWQodmFsKSkgcmV0dXJuXHJcblxyXG4gICAgICAgIHZhciB4ID0gMVxyXG4gICAgICAgIGlmICh1Lm51bWJlclZhbGlkKG9sZFZhbCkgJiYgb2xkVmFsICE9PSAwKSB7XHJcbiAgICAgICAgICB4ID0gdmFsIC8gb2xkVmFsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwb3MgPSB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgfHwge1xyXG4gICAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXHJcbiAgICAgICAgICB5OiB0aGlzLmltZ0RhdGEuc3RhcnRZICsgdGhpcy5pbWdEYXRhLmhlaWdodCAvIDJcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGggKiB2YWxcclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0ICogdmFsXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLl9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgICB0aGlzLl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnVzZXJNZXRhZGF0YSB8fCAhdGhpcy5pbWFnZVNldCB8fCB0aGlzLnJvdGF0aW5nKSByZXR1cm5cclxuICAgICAgICBsZXQgb2Zmc2V0WCA9ICh4IC0gMSkgKiAocG9zLnggLSB0aGlzLmltZ0RhdGEuc3RhcnRYKVxyXG4gICAgICAgIGxldCBvZmZzZXRZID0gKHggLSAxKSAqIChwb3MueSAtIHRoaXMuaW1nRGF0YS5zdGFydFkpXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHRoaXMuaW1nRGF0YS5zdGFydFggLSBvZmZzZXRYXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHRoaXMuaW1nRGF0YS5zdGFydFkgLSBvZmZzZXRZXHJcbiAgICAgIH0sXHJcbiAgICAgICdpbWdEYXRhLndpZHRoJzogZnVuY3Rpb24gKHZhbCwgb2xkVmFsKSB7XHJcbiAgICAgICAgaWYgKCF1Lm51bWJlclZhbGlkKHZhbCkpIHJldHVyblxyXG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHZhbCAvIHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSkge1xyXG4gICAgICAgICAgaWYgKE1hdGguYWJzKHZhbCAtIG9sZFZhbCkgPiAodmFsICogKDEgLyAxMDAwMDApKSkge1xyXG4gICAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5aT09NX0VWRU5UKVxyXG4gICAgICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgICdpbWdEYXRhLmhlaWdodCc6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICBpZiAoIXUubnVtYmVyVmFsaWQodmFsKSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdmFsIC8gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgIH0sXHJcbiAgICAgIGxvYWRpbmcgKHZhbCkge1xyXG4gICAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkxPQURJTkdfU1RBUlQpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkxPQURJTkdfRU5EKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgIGdldENhbnZhcyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRDb250ZXh0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdHhcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldENob3NlbkZpbGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRyZWZzLmZpbGVJbnB1dC5maWxlc1swXVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbW92ZSAob2Zmc2V0KSB7XHJcbiAgICAgICAgaWYgKCFvZmZzZXQpIHJldHVyblxyXG4gICAgICAgIGxldCBvbGRYID0gdGhpcy5pbWdEYXRhLnN0YXJ0WFxyXG4gICAgICAgIGxldCBvbGRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggKz0gb2Zmc2V0LnhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZICs9IG9mZnNldC55XHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIHRoaXMuX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCAhPT0gb2xkWCB8fCB0aGlzLmltZ0RhdGEuc3RhcnRZICE9PSBvbGRZKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5NT1ZFX0VWRU5UKVxyXG4gICAgICAgICAgdGhpcy5fZHJhdygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbW92ZVVwd2FyZHMgKGFtb3VudCA9IDEpIHtcclxuICAgICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiAtYW1vdW50IH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlRG93bndhcmRzIChhbW91bnQgPSAxKSB7XHJcbiAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogYW1vdW50IH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlTGVmdHdhcmRzIChhbW91bnQgPSAxKSB7XHJcbiAgICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbW92ZVJpZ2h0d2FyZHMgKGFtb3VudCA9IDEpIHtcclxuICAgICAgICB0aGlzLm1vdmUoeyB4OiBhbW91bnQsIHk6IDAgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHpvb20gKHpvb21JbiA9IHRydWUsIGFjY2VsZXJhdGlvbiA9IDEpIHtcclxuICAgICAgICBsZXQgcmVhbFNwZWVkID0gdGhpcy56b29tU3BlZWQgKiBhY2NlbGVyYXRpb25cclxuICAgICAgICBsZXQgc3BlZWQgPSAodGhpcy5vdXRwdXRXaWR0aCAqIFBDVF9QRVJfWk9PTSkgKiByZWFsU3BlZWRcclxuICAgICAgICBsZXQgeCA9IDFcclxuICAgICAgICBpZiAoem9vbUluKSB7XHJcbiAgICAgICAgICB4ID0gMSArIHNwZWVkXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiBNSU5fV0lEVEgpIHtcclxuICAgICAgICAgIHggPSAxIC0gc3BlZWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyAqPSB4XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB6b29tSW4gKCkge1xyXG4gICAgICAgIHRoaXMuem9vbSh0cnVlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgem9vbU91dCAoKSB7XHJcbiAgICAgICAgdGhpcy56b29tKGZhbHNlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcm90YXRlIChzdGVwID0gMSkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICBzdGVwID0gcGFyc2VJbnQoc3RlcClcclxuICAgICAgICBpZiAoaXNOYU4oc3RlcCkgfHwgc3RlcCA+IDMgfHwgc3RlcCA8IC0zKSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgYXJndW1lbnQgZm9yIHJvdGF0ZSgpIG1ldGhvZC4gSXQgc2hvdWxkIG9uZSBvZiB0aGUgaW50ZWdlcnMgZnJvbSAtMyB0byAzLicpXHJcbiAgICAgICAgICBzdGVwID0gMVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yb3RhdGVCeVN0ZXAoc3RlcClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZsaXBYICgpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24oMilcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZsaXBZICgpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24oNClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlZnJlc2ggKCkge1xyXG4gICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2luaXRpYWxpemUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYXNJbWFnZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuICEhdGhpcy5pbWFnZVNldFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYXBwbHlNZXRhZGF0YSAobWV0YWRhdGEpIHtcclxuICAgICAgICBpZiAoIW1ldGFkYXRhKSByZXR1cm5cclxuICAgICAgICB0aGlzLnVzZXJNZXRhZGF0YSA9IG1ldGFkYXRhXHJcbiAgICAgICAgdmFyIG9yaSA9IG1ldGFkYXRhLm9yaWVudGF0aW9uIHx8IHRoaXMub3JpZW50YXRpb24gfHwgMVxyXG4gICAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaSwgdHJ1ZSlcclxuICAgICAgfSxcclxuICAgICAgZ2VuZXJhdGVEYXRhVXJsICh0eXBlLCBjb21wcmVzc2lvblJhdGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuICcnXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCh0eXBlLCBjb21wcmVzc2lvblJhdGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2FudmFzLnRvQmxvYihjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHByb21pc2VkQmxvYiAoLi4uYXJncykge1xyXG4gICAgICAgIGlmICh0eXBlb2YgUHJvbWlzZSA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgY29uc29sZS53YXJuKCdObyBQcm9taXNlIHN1cHBvcnQuIFBsZWFzZSBhZGQgUHJvbWlzZSBwb2x5ZmlsbCBpZiB5b3Ugd2FudCB0byB1c2UgdGhpcyBtZXRob2QuJylcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUJsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICAgICAgICByZXNvbHZlKGJsb2IpXHJcbiAgICAgICAgICAgIH0sIGFyZ3MpXHJcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycilcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0TWV0YWRhdGEgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSByZXR1cm4ge31cclxuICAgICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSB9ID0gdGhpcy5pbWdEYXRhXHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBzdGFydFgsXHJcbiAgICAgICAgICBzdGFydFksXHJcbiAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZVJhdGlvLFxyXG4gICAgICAgICAgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb25cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzdXBwb3J0RGV0ZWN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgJ2Jhc2ljJzogd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAmJiB3aW5kb3cuRmlsZSAmJiB3aW5kb3cuRmlsZVJlYWRlciAmJiB3aW5kb3cuRmlsZUxpc3QgJiYgd2luZG93LkJsb2IsXHJcbiAgICAgICAgICAnZG5kJzogJ29uZHJhZ3N0YXJ0JyBpbiBkaXYgJiYgJ29uZHJvcCcgaW4gZGl2XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgY2hvb3NlRmlsZSAoKSB7XHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQuY2xpY2soKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVtb3ZlICgpIHtcclxuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG5cclxuICAgICAgICBsZXQgaGFkSW1hZ2UgPSB0aGlzLmltZyAhPSBudWxsXHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcclxuICAgICAgICB0aGlzLmltZ0RhdGEgPSB7XHJcbiAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgIGhlaWdodDogMCxcclxuICAgICAgICAgIHN0YXJ0WDogMCxcclxuICAgICAgICAgIHN0YXJ0WTogMFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gMVxyXG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IG51bGxcclxuICAgICAgICB0aGlzLnVzZXJNZXRhZGF0YSA9IG51bGxcclxuICAgICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcclxuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxyXG5cclxuICAgICAgICBpZiAoaGFkSW1hZ2UpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLklNQUdFX1JFTU9WRV9FVkVOVClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaW5pdGlhbGl6ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRyZWZzLmNhbnZhc1xyXG4gICAgICAgIHRoaXMuX3NldFNpemUoKVxyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAndHJhbnNwYXJlbnQnIDogKHR5cGVvZiB0aGlzLmNhbnZhc0NvbG9yID09PSAnc3RyaW5nJyA/IHRoaXMuY2FudmFzQ29sb3IgOiAnJylcclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuICAgICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBudWxsXHJcbiAgICAgICAgdGhpcy5pbWcgPSBudWxsXHJcbiAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5fc2V0SW5pdGlhbCgpXHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU5JVF9FVkVOVCwgdGhpcylcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9zZXRTaXplICgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLm91dHB1dEhlaWdodFxyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArICdweCdcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArICdweCdcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9yb3RhdGVCeVN0ZXAgKHN0ZXApIHtcclxuICAgICAgICBsZXQgb3JpZW50YXRpb24gPSAxXHJcbiAgICAgICAgc3dpdGNoIChzdGVwKSB7XHJcbiAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gNlxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDNcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSA4XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDhcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgLTI6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gM1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAtMzpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSA2XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaWVudGF0aW9uKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3NldEltYWdlUGxhY2Vob2xkZXIgKCkge1xyXG4gICAgICAgIGxldCBpbWdcclxuICAgICAgICBpZiAodGhpcy4kc2xvdHMucGxhY2Vob2xkZXIgJiYgdGhpcy4kc2xvdHMucGxhY2Vob2xkZXJbMF0pIHtcclxuICAgICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdXHJcbiAgICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICAgIGlmICh0YWcgPT0gJ2ltZycgJiYgZWxtKSB7XHJcbiAgICAgICAgICAgIGltZyA9IGVsbVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpbWcpIHJldHVyblxyXG5cclxuICAgICAgICB2YXIgb25Mb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltZywgMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XHJcbiAgICAgICAgICBvbkxvYWQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpbWcub25sb2FkID0gb25Mb2FkXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3NldFRleHRQbGFjZWhvbGRlciAoKSB7XHJcbiAgICAgICAgdmFyIGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXHJcbiAgICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMub3V0cHV0V2lkdGggKiBERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCAvIHRoaXMucGxhY2Vob2xkZXIubGVuZ3RoXHJcbiAgICAgICAgbGV0IGZvbnRTaXplID0gKCF0aGlzLmNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSB8fCB0aGlzLmNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSA9PSAwKSA/IGRlZmF1bHRGb250U2l6ZSA6IHRoaXMuY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplXHJcbiAgICAgICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCBzYW5zLXNlcmlmJ1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAoIXRoaXMucGxhY2Vob2xkZXJDb2xvciB8fCB0aGlzLnBsYWNlaG9sZGVyQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjNjA2MDYwJyA6IHRoaXMucGxhY2Vob2xkZXJDb2xvclxyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0aGlzLnBsYWNlaG9sZGVyLCB0aGlzLm91dHB1dFdpZHRoIC8gMiwgdGhpcy5vdXRwdXRIZWlnaHQgLyAyKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3NldFBsYWNlaG9sZGVycyAoKSB7XHJcbiAgICAgICAgdGhpcy5fcGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgICB0aGlzLl9zZXRJbWFnZVBsYWNlaG9sZGVyKClcclxuICAgICAgICB0aGlzLl9zZXRUZXh0UGxhY2Vob2xkZXIoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3NldEluaXRpYWwgKCkge1xyXG4gICAgICAgIGxldCBzcmMsIGltZ1xyXG4gICAgICAgIGlmICh0aGlzLiRzbG90cy5pbml0aWFsICYmIHRoaXMuJHNsb3RzLmluaXRpYWxbMF0pIHtcclxuICAgICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLmluaXRpYWxbMF1cclxuICAgICAgICAgIGxldCB7IHRhZywgZWxtIH0gPSB2Tm9kZVxyXG4gICAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcclxuICAgICAgICAgICAgaW1nID0gZWxtXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxJbWFnZSAmJiB0eXBlb2YgdGhpcy5pbml0aWFsSW1hZ2UgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICBzcmMgPSB0aGlzLmluaXRpYWxJbWFnZVxyXG4gICAgICAgICAgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgICAgIGlmICghL15kYXRhOi8udGVzdChzcmMpICYmICEvXmJsb2I6Ly50ZXN0KHNyYykpIHtcclxuICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnY3Jvc3NPcmlnaW4nLCAnYW5vbnltb3VzJylcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGltZy5zcmMgPSBzcmNcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLmluaXRpYWxJbWFnZSA9PT0gJ29iamVjdCcgJiYgdGhpcy5pbml0aWFsSW1hZ2UgaW5zdGFuY2VvZiBJbWFnZSkge1xyXG4gICAgICAgICAgaW1nID0gdGhpcy5pbml0aWFsSW1hZ2VcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFzcmMgJiYgIWltZykge1xyXG4gICAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRJc0luaXRpYWwgPSB0cnVlXHJcbiAgICAgICAgaWYgKHUuaW1hZ2VMb2FkZWQoaW1nKSkge1xyXG4gICAgICAgICAgLy8gdGhpcy4kZW1pdChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXHJcbiAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCAraW1nLmRhdGFzZXRbJ2V4aWZPcmllbnRhdGlvbiddLCB0cnVlKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlXHJcbiAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyB0aGlzLiRlbWl0KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcclxuICAgICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSwgdHJ1ZSlcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpbWcub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfb25sb2FkIChpbWcsIG9yaWVudGF0aW9uID0gMSwgaW5pdGlhbCkge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IGltZ1xyXG4gICAgICAgIHRoaXMuaW1nID0gaW1nXHJcblxyXG4gICAgICAgIGlmIChpc05hTihvcmllbnRhdGlvbikpIHtcclxuICAgICAgICAgIG9yaWVudGF0aW9uID0gMVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24ob3JpZW50YXRpb24pXHJcblxyXG4gICAgICAgIGlmIChpbml0aWFsKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlQ2xpY2sgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlICYmICF0aGlzLmRpc2FibGVkICYmICF0aGlzLnN1cHBvcnRUb3VjaCkge1xyXG4gICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlSW5wdXRDaGFuZ2UgKCkge1xyXG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMuZmlsZUlucHV0XHJcbiAgICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGgpIHJldHVyblxyXG5cclxuICAgICAgICBsZXQgZmlsZSA9IGlucHV0LmZpbGVzWzBdXHJcbiAgICAgICAgdGhpcy5fb25OZXdGaWxlSW4oZmlsZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9vbk5ld0ZpbGVJbiAoZmlsZSkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudElzSW5pdGlhbCA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkZJTEVfQ0hPT1NFX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgIGlmICghdGhpcy5fZmlsZVNpemVJc1ZhbGlkKGZpbGUpKSB7XHJcbiAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBzaXplIGV4Y2VlZHMgbGltaXQgd2hpY2ggaXMgJyArIHRoaXMuZmlsZVNpemVMaW1pdCArICcgYnl0ZXMuJylcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLl9maWxlVHlwZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgICBsZXQgdHlwZSA9IGZpbGUudHlwZSB8fCBmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5zcGxpdCgnLicpLnBvcCgpXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZpbGUgdHlwZSAoJHt0eXBlfSkgZG9lcyBub3QgbWF0Y2ggd2hhdCB5b3Ugc3BlY2lmaWVkICgke3RoaXMuYWNjZXB0fSkuYClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuRmlsZVJlYWRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGxldCBmciA9IG5ldyBGaWxlUmVhZGVyKClcclxuICAgICAgICAgIGZyLm9ubG9hZCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlRGF0YSA9IGUudGFyZ2V0LnJlc3VsdFxyXG4gICAgICAgICAgICBsZXQgb3JpZW50YXRpb24gPSAxXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgb3JpZW50YXRpb24gPSB1LmdldEZpbGVPcmllbnRhdGlvbih1LmJhc2U2NFRvQXJyYXlCdWZmZXIoZmlsZURhdGEpKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHsgfVxyXG4gICAgICAgICAgICBpZiAob3JpZW50YXRpb24gPCAxKSBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBmaWxlRGF0YVxyXG4gICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMuX29ubG9hZChpbWcsIG9yaWVudGF0aW9uKVxyXG4gICAgICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLk5FV19JTUFHRSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9maWxlU2l6ZUlzVmFsaWQgKGZpbGUpIHtcclxuICAgICAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUxpbWl0IHx8IHRoaXMuZmlsZVNpemVMaW1pdCA9PSAwKSByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICAgICByZXR1cm4gZmlsZS5zaXplIDwgdGhpcy5maWxlU2l6ZUxpbWl0XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfZmlsZVR5cGVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFjY2VwY3QpIHJldHVybiB0cnVlXHJcbiAgICAgICAgbGV0IGFjY2VwdCA9IHRoaXMuYWNjZXB0XHJcbiAgICAgICAgbGV0IGJhc2VNaW1ldHlwZSA9IGFjY2VwdC5yZXBsYWNlKC9cXC8uKiQvLCAnJylcclxuICAgICAgICBsZXQgdHlwZXMgPSBhY2NlcHQuc3BsaXQoJywnKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0eXBlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgbGV0IHR5cGUgPSB0eXBlc1tpXVxyXG4gICAgICAgICAgbGV0IHQgPSB0eXBlLnRyaW0oKVxyXG4gICAgICAgICAgaWYgKHQuY2hhckF0KDApID09ICcuJykge1xyXG4gICAgICAgICAgICBpZiAoZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKSA9PT0gdC50b0xvd2VyQ2FzZSgpLnNsaWNlKDEpKSByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfSBlbHNlIGlmICgvXFwvXFwqJC8udGVzdCh0KSkge1xyXG4gICAgICAgICAgICB2YXIgZmlsZUJhc2VUeXBlID0gZmlsZS50eXBlLnJlcGxhY2UoL1xcLy4qJC8sICcnKVxyXG4gICAgICAgICAgICBpZiAoZmlsZUJhc2VUeXBlID09PSBiYXNlTWltZXR5cGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGZpbGUudHlwZSA9PT0gdHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfcGxhY2VJbWFnZSAoYXBwbHlNZXRhZGF0YSkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIHZhciBpbWdEYXRhID0gdGhpcy5pbWdEYXRhXHJcblxyXG4gICAgICAgIHRoaXMubmF0dXJhbFdpZHRoID0gdGhpcy5pbWcubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgdGhpcy5uYXR1cmFsSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxyXG5cclxuICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IHUubnVtYmVyVmFsaWQoaW1nRGF0YS5zdGFydFgpID8gaW1nRGF0YS5zdGFydFggOiAwXHJcbiAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB1Lm51bWJlclZhbGlkKGltZ0RhdGEuc3RhcnRZKSA/IGltZ0RhdGEuc3RhcnRZIDogMFxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5fYXNwZWN0RmlsbCgpXHJcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5pbWFnZVNldCkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaW5pdGlhbFNpemUgPT0gJ2NvbnRhaW4nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FzcGVjdEZpdCgpXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5pdGlhbFNpemUgPT0gJ25hdHVyYWwnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX25hdHVyYWxTaXplKClcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FzcGVjdEZpbGwoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aCAqIHRoaXMuc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodCAqIHRoaXMuc2NhbGVSYXRpb1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XHJcbiAgICAgICAgICBpZiAoL3RvcC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKC9ib3R0b20vLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0gdGhpcy5vdXRwdXRIZWlnaHQgLSBpbWdEYXRhLmhlaWdodFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICgvbGVmdC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKC9yaWdodC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFggPSB0aGlzLm91dHB1dFdpZHRoIC0gaW1nRGF0YS53aWR0aFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICgvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAvXigtP1xcZCspJSAoLT9cXGQrKSUkLy5leGVjKHRoaXMuaW5pdGlhbFBvc2l0aW9uKVxyXG4gICAgICAgICAgICB2YXIgeCA9ICtyZXN1bHRbMV0gLyAxMDBcclxuICAgICAgICAgICAgdmFyIHkgPSArcmVzdWx0WzJdIC8gMTAwXHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0geCAqICh0aGlzLm91dHB1dFdpZHRoIC0gaW1nRGF0YS53aWR0aClcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB5ICogKHRoaXMub3V0cHV0SGVpZ2h0IC0gaW1nRGF0YS5oZWlnaHQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhcHBseU1ldGFkYXRhICYmIHRoaXMuX2FwcGx5TWV0YWRhdGEoKVxyXG5cclxuICAgICAgICBpZiAoYXBwbHlNZXRhZGF0YSAmJiB0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20oZmFsc2UsIDApXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IDAgfSlcclxuICAgICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9hc3BlY3RGaWxsICgpIHtcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLm91dHB1dFdpZHRoIC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICBsZXQgc2NhbGVSYXRpb1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hc3BlY3RSYXRpbyA+IGNhbnZhc1JhdGlvKSB7XHJcbiAgICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMub3V0cHV0V2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyBzY2FsZVJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfYXNwZWN0Rml0ICgpIHtcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLm91dHB1dFdpZHRoIC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICBsZXQgc2NhbGVSYXRpb1xyXG4gICAgICAgIGlmICh0aGlzLmFzcGVjdFJhdGlvID4gY2FudmFzUmF0aW8pIHtcclxuICAgICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMub3V0cHV0V2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyBzY2FsZVJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfbmF0dXJhbFNpemUgKCkge1xyXG4gICAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLm91dHB1dEhlaWdodCkgLyAyXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlUG9pbnRlclN0YXJ0IChldnQpIHtcclxuICAgICAgICB0aGlzLnN1cHBvcnRUb3VjaCA9IHRydWVcclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IGZhbHNlXHJcbiAgICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5wb2ludGVyU3RhcnRDb29yZCA9IHBvaW50ZXJDb29yZFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgLy8gc2ltdWxhdGUgY2xpY2sgd2l0aCB0b3VjaCBvbiBtb2JpbGUgZGV2aWNlc1xyXG4gICAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSB7XHJcbiAgICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gbmV3IERhdGUoKS52YWx1ZU9mKClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZ25vcmUgbW91c2UgcmlnaHQgY2xpY2sgYW5kIG1pZGRsZSBjbGlja1xyXG4gICAgICAgIGlmIChldnQud2hpY2ggJiYgZXZ0LndoaWNoID4gMSkgcmV0dXJuXHJcblxyXG4gICAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxyXG4gICAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXHJcbiAgICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5kaXNhYmxlUGluY2hUb1pvb20pIHtcclxuICAgICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgdGhpcy5waW5jaGluZyA9IHRydWVcclxuICAgICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2FuY2VsRXZlbnRzID0gWydtb3VzZXVwJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJywgJ3BvaW50ZXJlbmQnLCAncG9pbnRlcmNhbmNlbCddXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNhbmNlbEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgbGV0IGUgPSBjYW5jZWxFdmVudHNbaV1cclxuICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZSwgdGhpcy5faGFuZGxlUG9pbnRlckVuZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlUG9pbnRlckVuZCAoZXZ0KSB7XHJcbiAgICAgICAgbGV0IHBvaW50ZXJNb3ZlRGlzdGFuY2UgPSAwXHJcbiAgICAgICAgaWYgKHRoaXMucG9pbnRlclN0YXJ0Q29vcmQpIHtcclxuICAgICAgICAgIGxldCBwb2ludGVyQ29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgcG9pbnRlck1vdmVEaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhwb2ludGVyQ29vcmQueCAtIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQueCwgMikgKyBNYXRoLnBvdyhwb2ludGVyQ29vcmQueSAtIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQueSwgMikpIHx8IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSB7XHJcbiAgICAgICAgICBsZXQgdGFiRW5kID0gbmV3IERhdGUoKS52YWx1ZU9mKClcclxuICAgICAgICAgIGlmICgocG9pbnRlck1vdmVEaXN0YW5jZSA8IENMSUNLX01PVkVfVEhSRVNIT0xEKSAmJiB0YWJFbmQgLSB0aGlzLnRhYlN0YXJ0IDwgTUlOX01TX1BFUl9DTElDSyAmJiB0aGlzLnN1cHBvcnRUb3VjaCkge1xyXG4gICAgICAgICAgICB0aGlzLmNob29zZUZpbGUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy50YWJTdGFydCA9IDBcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gMFxyXG4gICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gbnVsbFxyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcclxuICAgICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gbnVsbFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IHRydWVcclxuICAgICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgPSBjb29yZFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnVG9Nb3ZlKSByZXR1cm5cclxuXHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cclxuICAgICAgICAgIGlmICh0aGlzLmxhc3RNb3ZpbmdDb29yZCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoe1xyXG4gICAgICAgICAgICAgIHg6IGNvb3JkLnggLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC54LFxyXG4gICAgICAgICAgICAgIHk6IGNvb3JkLnkgLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC55XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLnBpbmNoaW5nKSByZXR1cm5cclxuICAgICAgICAgIGxldCBkaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXHJcbiAgICAgICAgICBsZXQgZGVsdGEgPSBkaXN0YW5jZSAtIHRoaXMucGluY2hEaXN0YW5jZVxyXG4gICAgICAgICAgdGhpcy56b29tKGRlbHRhID4gMCwgUElOQ0hfQUNDRUxFUkFUSU9OKVxyXG4gICAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gZGlzdGFuY2VcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlUG9pbnRlckxlYXZlICgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgPSBudWxsXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlV2hlZWwgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVNjcm9sbFRvWm9vbSB8fCAhdGhpcy5oYXNJbWFnZSgpKSByZXR1cm5cclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gdHJ1ZVxyXG4gICAgICAgIGlmIChldnQud2hlZWxEZWx0YSA8IDAgfHwgZXZ0LmRlbHRhWSA+IDAgfHwgZXZ0LmRldGFpbCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuem9vbSh0aGlzLnJldmVyc2VTY3JvbGxUb1pvb20pXHJcbiAgICAgICAgfSBlbHNlIGlmIChldnQud2hlZWxEZWx0YSA+IDAgfHwgZXZ0LmRlbHRhWSA8IDAgfHwgZXZ0LmRldGFpbCA8IDApIHtcclxuICAgICAgICAgIHRoaXMuem9vbSghdGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnNjcm9sbGluZyA9IGZhbHNlXHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVEcmFnRW50ZXIgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdBbmREcm9wIHx8IHRoaXMuaGFzSW1hZ2UoKSB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSB0cnVlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlRHJhZ0xlYXZlIChldnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlRHJhZ092ZXIgKGV2dCkge1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZURyb3AgKGV2dCkge1xyXG4gICAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuXHJcbiAgICAgICAgbGV0IGZpbGVcclxuICAgICAgICBsZXQgZHQgPSBldnQuZGF0YVRyYW5zZmVyXHJcbiAgICAgICAgaWYgKCFkdCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKGR0Lml0ZW1zKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZHQuaXRlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSBkdC5pdGVtc1tpXVxyXG4gICAgICAgICAgICBpZiAoaXRlbS5raW5kID09ICdmaWxlJykge1xyXG4gICAgICAgICAgICAgIGZpbGUgPSBpdGVtLmdldEFzRmlsZSgpXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBmaWxlID0gZHQuZmlsZXNbMF1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICB0aGlzLl9vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRZID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMub3V0cHV0V2lkdGggLSB0aGlzLmltZ0RhdGEuc3RhcnRYID4gdGhpcy5pbWdEYXRhLndpZHRoKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vdXRwdXRIZWlnaHQgLSB0aGlzLmltZ0RhdGEuc3RhcnRZID4gdGhpcy5pbWdEYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMub3V0cHV0V2lkdGgpIHtcclxuICAgICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHRoaXMub3V0cHV0V2lkdGggLyB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5oZWlnaHQgPCB0aGlzLm91dHB1dEhlaWdodCkge1xyXG4gICAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5vdXRwdXRIZWlnaHQgLyB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfc2V0T3JpZW50YXRpb24gKG9yaWVudGF0aW9uID0gNiwgYXBwbHlNZXRhZGF0YSkge1xyXG4gICAgICAgIHZhciB1c2VPcmlnaW5hbCA9IGFwcGx5TWV0YWRhdGFcclxuICAgICAgICBpZiAob3JpZW50YXRpb24gPiAxIHx8IHVzZU9yaWdpbmFsKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICAgIHRoaXMucm90YXRpbmcgPSB0cnVlXHJcbiAgICAgICAgICB2YXIgX2ltZyA9IHUuZ2V0Um90YXRlZEltYWdlKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxyXG4gICAgICAgICAgX2ltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1nID0gX2ltZ1xyXG4gICAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKGFwcGx5TWV0YWRhdGEpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoYXBwbHlNZXRhZGF0YSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PSAyKSB7XHJcbiAgICAgICAgICAvLyBmbGlwIHhcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBYKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA0KSB7XHJcbiAgICAgICAgICAvLyBmbGlwIHlcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBZKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA2KSB7XHJcbiAgICAgICAgICAvLyA5MCBkZWdcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSAzKSB7XHJcbiAgICAgICAgICAvLyAxODAgZGVnXHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gOCkge1xyXG4gICAgICAgICAgLy8gMjcwIGRlZ1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodXNlT3JpZ2luYWwpIHtcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvblxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9wYWludEJhY2tncm91bmQgKCkge1xyXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJ3RyYW5zcGFyZW50JyA6IHRoaXMuY2FudmFzQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBiYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfZHJhdyAoKSB7XHJcbiAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgICBpZiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fZHJhd0ZyYW1lKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZHJhd0ZyYW1lKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2RyYXdGcmFtZSAoKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5pbWdEYXRhXHJcblxyXG4gICAgICAgIHRoaXMuX3BhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuRFJBVywgY3R4KVxyXG4gICAgICAgIGlmICghdGhpcy5pbWFnZVNldCkge1xyXG4gICAgICAgICAgdGhpcy5pbWFnZVNldCA9IHRydWVcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLk5FV19JTUFHRV9EUkFXTilcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yb3RhdGluZyA9IGZhbHNlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfYXBwbHlNZXRhZGF0YSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnVzZXJNZXRhZGF0YSkgcmV0dXJuXHJcbiAgICAgICAgdmFyIHsgc3RhcnRYLCBzdGFydFksIHNjYWxlIH0gPSB0aGlzLnVzZXJNZXRhZGF0YVxyXG5cclxuICAgICAgICBpZiAodS5udW1iZXJWYWxpZChzdGFydFgpKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gc3RhcnRYXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodS5udW1iZXJWYWxpZChzdGFydFkpKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gc3RhcnRZXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodS5udW1iZXJWYWxpZChzY2FsZSkpIHtcclxuICAgICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHNjYWxlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnVzZXJNZXRhZGF0YSA9IG51bGxcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgb25EaW1lbnNpb25DaGFuZ2UgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuX2luaXRpYWxpemUoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuX3NldFNpemUoKVxyXG4gICAgICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZSBsYW5nPVwic3R5bHVzXCI+XHJcbiAgLmNyb3BwYS1jb250YWluZXJcclxuICAgIGRpc3BsYXkgaW5saW5lLWJsb2NrXHJcbiAgICBjdXJzb3IgcG9pbnRlclxyXG4gICAgdHJhbnNpdGlvbiBhbGwgMC4zc1xyXG4gICAgcG9zaXRpb24gcmVsYXRpdmVcclxuICAgIGZvbnQtc2l6ZSAwXHJcbiAgICBhbGlnbi1zZWxmIGZsZXgtc3RhcnRcclxuICAgIGJhY2tncm91bmQtY29sb3IgI2U2ZTZlNlxyXG5cclxuICAgIGNhbnZhc1xyXG4gICAgICB0cmFuc2l0aW9uIGFsbCAwLjNzXHJcblxyXG4gICAgJjpob3ZlclxyXG4gICAgICBvcGFjaXR5IDAuN1xyXG5cclxuICAgICYuY3JvcHBhLS1kcm9wem9uZVxyXG4gICAgICBib3gtc2hhZG93IGluc2V0IDAgMCAxMHB4IGxpZ2h0bmVzcyhibGFjaywgMjAlKVxyXG5cclxuICAgICAgY2FudmFzXHJcbiAgICAgICAgb3BhY2l0eSAwLjVcclxuXHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWQtY2NcclxuICAgICAgY3Vyc29yIGRlZmF1bHRcclxuXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5IDFcclxuXHJcbiAgICAmLmNyb3BwYS0taGFzLXRhcmdldFxyXG4gICAgICBjdXJzb3IgbW92ZVxyXG5cclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHkgMVxyXG5cclxuICAgICAgJi5jcm9wcGEtLWRpc2FibGVkLW16XHJcbiAgICAgICAgY3Vyc29yIGRlZmF1bHRcclxuXHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWRcclxuICAgICAgY3Vyc29yIG5vdC1hbGxvd2VkXHJcblxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eSAxXHJcblxyXG4gICAgc3ZnLmljb24tcmVtb3ZlXHJcbiAgICAgIHBvc2l0aW9uIGFic29sdXRlXHJcbiAgICAgIGJhY2tncm91bmQgd2hpdGVcclxuICAgICAgYm9yZGVyLXJhZGl1cyA1MCVcclxuICAgICAgZmlsdGVyIGRyb3Atc2hhZG93KC0ycHggMnB4IDJweCByZ2JhKDAsIDAsIDAsIDAuNykpXHJcbiAgICAgIHotaW5kZXggMTBcclxuICAgICAgY3Vyc29yIHBvaW50ZXJcclxuICAgICAgYm9yZGVyIDJweCBzb2xpZCB3aGl0ZVxyXG48L3N0eWxlPlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzY3NzXCI+XHJcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RvYmlhc2FobGluL1NwaW5LaXQvYmxvYi9tYXN0ZXIvc2Nzcy9zcGlubmVycy8xMC1mYWRpbmctY2lyY2xlLnNjc3NcclxuICAuc2stZmFkaW5nLWNpcmNsZSB7XHJcbiAgICAkY2lyY2xlQ291bnQ6IDEyO1xyXG4gICAgJGFuaW1hdGlvbkR1cmF0aW9uOiAxcztcclxuXHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcblxyXG4gICAgLnNrLWNpcmNsZSB7XHJcbiAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgbGVmdDogMDtcclxuICAgICAgdG9wOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC5zay1jaXJjbGUgLnNrLWNpcmNsZS1pbmRpY2F0b3Ige1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICAgIHdpZHRoOiAxNSU7XHJcbiAgICAgIGhlaWdodDogMTUlO1xyXG4gICAgICBib3JkZXItcmFkaXVzOiAxMDAlO1xyXG4gICAgICBhbmltYXRpb246IHNrLWNpcmNsZUZhZGVEZWxheSAkYW5pbWF0aW9uRHVyYXRpb24gaW5maW5pdGUgZWFzZS1pbi1vdXQgYm90aDtcclxuICAgIH1cclxuXHJcbiAgICBAZm9yICRpIGZyb20gMiB0aHJvdWdoICRjaXJjbGVDb3VudCB7XHJcbiAgICAgIC5zay1jaXJjbGUjeyRpfSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnIC8gJGNpcmNsZUNvdW50ICogKCRpIC0gMSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQGZvciAkaSBmcm9tIDIgdGhyb3VnaCAkY2lyY2xlQ291bnQge1xyXG4gICAgICAuc2stY2lyY2xlI3skaX0gLnNrLWNpcmNsZS1pbmRpY2F0b3Ige1xyXG4gICAgICAgIGFuaW1hdGlvbi1kZWxheTogLSAkYW5pbWF0aW9uRHVyYXRpb24gKyAkYW5pbWF0aW9uRHVyYXRpb24gLyAkY2lyY2xlQ291bnQgKiAoJGkgLVxyXG4gICAgICAgICAgICAgIDEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIEBrZXlmcmFtZXMgc2stY2lyY2xlRmFkZURlbGF5IHtcclxuICAgIDAlLFxyXG4gICAgMzklLFxyXG4gICAgMTAwJSB7XHJcbiAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICB9XHJcbiAgICA0MCUge1xyXG4gICAgICBvcGFjaXR5OiAxO1xyXG4gICAgfVxyXG4gIH1cclxuPC9zdHlsZT5cclxuXHJcbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJpbXBvcnQgY29tcG9uZW50IGZyb20gJy4vY3JvcHBlci52dWUnXHJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbidcclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gIGNvbXBvbmVudE5hbWU6ICdjcm9wcGEnXHJcbn1cclxuXHJcbmNvbnN0IFZ1ZUNyb3BwYSA9IHtcclxuICBpbnN0YWxsOiBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcclxuICAgIGxldCB2ZXJzaW9uID0gTnVtYmVyKFZ1ZS52ZXJzaW9uLnNwbGl0KCcuJylbMF0pXHJcbiAgICBpZiAodmVyc2lvbiA8IDIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB2dWUtY3JvcHBhIHN1cHBvcnRzIHZ1ZSB2ZXJzaW9uIDIuMCBhbmQgYWJvdmUuIFlvdSBhcmUgdXNpbmcgVnVlQCR7dmVyc2lvbn0uIFBsZWFzZSB1cGdyYWRlIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBWdWUuYClcclxuICAgIH1cclxuICAgIGxldCBjb21wb25lbnROYW1lID0gb3B0aW9ucy5jb21wb25lbnROYW1lIHx8ICdjcm9wcGEnXHJcblxyXG4gICAgLy8gcmVnaXN0cmF0aW9uXHJcbiAgICBWdWUuY29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudClcclxuICB9LFxyXG5cclxuICBjb21wb25lbnRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsiZGVmaW5lIiwidGhpcyIsInBvaW50Iiwidm0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsImV2dCIsInBvaW50ZXIiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJvbmVQb2ludENvb3JkIiwicG9pbnRlcjEiLCJwb2ludGVyMiIsImNvb3JkMSIsImNvb3JkMiIsIk1hdGgiLCJzcXJ0IiwicG93IiwieCIsInkiLCJpbWciLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsImRvY3VtZW50Iiwid2luZG93IiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwibGVuZ3RoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsImN1cnJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJ0aW1lVG9DYWxsIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiYXJnIiwiaXNBcnJheSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIkhUTUxDYW52YXNFbGVtZW50IiwiYmluU3RyIiwibGVuIiwiYXJyIiwidG9CbG9iIiwiZGVmaW5lUHJvcGVydHkiLCJ0eXBlIiwiYXRvYiIsInRvRGF0YVVSTCIsInNwbGl0IiwiVWludDhBcnJheSIsImkiLCJjaGFyQ29kZUF0IiwiQmxvYiIsImR0IiwiZGF0YVRyYW5zZmVyIiwib3JpZ2luYWxFdmVudCIsInR5cGVzIiwiYXJyYXlCdWZmZXIiLCJ2aWV3IiwiRGF0YVZpZXciLCJnZXRVaW50MTYiLCJieXRlTGVuZ3RoIiwib2Zmc2V0IiwibWFya2VyIiwiZ2V0VWludDMyIiwibGl0dGxlIiwidGFncyIsImJhc2U2NCIsInJlcGxhY2UiLCJiaW5hcnlTdHJpbmciLCJieXRlcyIsImJ1ZmZlciIsIm9yaWVudGF0aW9uIiwiX2NhbnZhcyIsIkNhbnZhc0V4aWZPcmllbnRhdGlvbiIsImRyYXdJbWFnZSIsIl9pbWciLCJJbWFnZSIsInNyYyIsIm9yaSIsIm1hcCIsIm4iLCJpc05hTiIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJmbG9vciIsImluaXRpYWxJbWFnZVR5cGUiLCJTdHJpbmciLCJ2YWwiLCJCb29sZWFuIiwidmFsaWRzIiwiZXZlcnkiLCJpbmRleE9mIiwid29yZCIsInRlc3QiLCJQQ1RfUEVSX1pPT00iLCJNSU5fTVNfUEVSX0NMSUNLIiwiQ0xJQ0tfTU9WRV9USFJFU0hPTEQiLCJNSU5fV0lEVEgiLCJERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCIsIlBJTkNIX0FDQ0VMRVJBVElPTiIsInJlbmRlciIsImV2ZW50cyIsIklOSVRfRVZFTlQiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwicGxhY2Vob2xkZXJGb250U2l6ZSIsIm5hdHVyYWxIZWlnaHQiLCJsb2FkaW5nU2l6ZSIsIl9pbml0aWFsaXplIiwickFGUG9seWZpbGwiLCJ0b0Jsb2JQb2x5ZmlsbCIsInN1cHBvcnRzIiwic3VwcG9ydERldGVjdGlvbiIsImJhc2ljIiwid2FybiIsIm9uRGltZW5zaW9uQ2hhbmdlIiwiX3NldFBsYWNlaG9sZGVycyIsIl9kcmF3IiwiaW1hZ2VTZXQiLCJfcGxhY2VJbWFnZSIsIm9sZFZhbCIsInUiLCJudW1iZXJWYWxpZCIsInBvcyIsImN1cnJlbnRQb2ludGVyQ29vcmQiLCJpbWdEYXRhIiwic3RhcnRYIiwic3RhcnRZIiwicHJldmVudFdoaXRlU3BhY2UiLCJfcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UiLCJfcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSIsInVzZXJNZXRhZGF0YSIsInJvdGF0aW5nIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJzY2FsZVJhdGlvIiwiaGFzSW1hZ2UiLCJhYnMiLCIkZW1pdCIsIlpPT01fRVZFTlQiLCJMT0FESU5HX1NUQVJUIiwiTE9BRElOR19FTkQiLCJjdHgiLCIkcmVmcyIsImZpbGVJbnB1dCIsImZpbGVzIiwib2xkWCIsIm9sZFkiLCJNT1ZFX0VWRU5UIiwiYW1vdW50IiwibW92ZSIsInpvb21JbiIsImFjY2VsZXJhdGlvbiIsInJlYWxTcGVlZCIsInpvb21TcGVlZCIsInNwZWVkIiwib3V0cHV0V2lkdGgiLCJ6b29tIiwic3RlcCIsImRpc2FibGVSb3RhdGlvbiIsImRpc2FibGVkIiwicGFyc2VJbnQiLCJfcm90YXRlQnlTdGVwIiwiX3NldE9yaWVudGF0aW9uIiwiJG5leHRUaWNrIiwibWV0YWRhdGEiLCJjb21wcmVzc2lvblJhdGUiLCJtaW1lVHlwZSIsInF1YWxpdHlBcmd1bWVudCIsImFyZ3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImdlbmVyYXRlQmxvYiIsImJsb2IiLCJlcnIiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiRmlsZSIsIkZpbGVSZWFkZXIiLCJGaWxlTGlzdCIsImNsaWNrIiwiaGFkSW1hZ2UiLCJvcmlnaW5hbEltYWdlIiwibG9hZGluZyIsIklNQUdFX1JFTU9WRV9FVkVOVCIsIl9zZXRTaXplIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjYW52YXNDb2xvciIsImdldENvbnRleHQiLCJfc2V0SW5pdGlhbCIsIm91dHB1dEhlaWdodCIsIiRzbG90cyIsInBsYWNlaG9sZGVyIiwidk5vZGUiLCJ0YWciLCJlbG0iLCJvbkxvYWQiLCJpbWFnZUxvYWRlZCIsIm9ubG9hZCIsInRleHRCYXNlbGluZSIsInRleHRBbGlnbiIsImRlZmF1bHRGb250U2l6ZSIsImZvbnRTaXplIiwiY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplIiwiZm9udCIsImZpbGxTdHlsZSIsInBsYWNlaG9sZGVyQ29sb3IiLCJmaWxsVGV4dCIsIl9wYWludEJhY2tncm91bmQiLCJfc2V0SW1hZ2VQbGFjZWhvbGRlciIsIl9zZXRUZXh0UGxhY2Vob2xkZXIiLCJpbml0aWFsIiwiaW5pdGlhbEltYWdlIiwic2V0QXR0cmlidXRlIiwiYmFiZWxIZWxwZXJzLnR5cGVvZiIsImN1cnJlbnRJc0luaXRpYWwiLCJfb25sb2FkIiwiZGF0YXNldCIsIm9uZXJyb3IiLCJJTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVCIsImRpc2FibGVDbGlja1RvQ2hvb3NlIiwic3VwcG9ydFRvdWNoIiwiY2hvb3NlRmlsZSIsImlucHV0IiwiZmlsZSIsIl9vbk5ld0ZpbGVJbiIsIkZJTEVfQ0hPT1NFX0VWRU5UIiwiX2ZpbGVTaXplSXNWYWxpZCIsIkZJTEVfU0laRV9FWENFRURfRVZFTlQiLCJFcnJvciIsImZpbGVTaXplTGltaXQiLCJfZmlsZVR5cGVJc1ZhbGlkIiwiRklMRV9UWVBFX01JU01BVENIX0VWRU5UIiwibmFtZSIsInRvTG93ZXJDYXNlIiwicG9wIiwiYWNjZXB0IiwiZnIiLCJlIiwiZmlsZURhdGEiLCJ0YXJnZXQiLCJyZXN1bHQiLCJnZXRGaWxlT3JpZW50YXRpb24iLCJiYXNlNjRUb0FycmF5QnVmZmVyIiwiTkVXX0lNQUdFIiwicmVhZEFzRGF0YVVSTCIsInNpemUiLCJhY2NlcGN0IiwiYmFzZU1pbWV0eXBlIiwidCIsInRyaW0iLCJjaGFyQXQiLCJzbGljZSIsImZpbGVCYXNlVHlwZSIsImFwcGx5TWV0YWRhdGEiLCJfYXNwZWN0RmlsbCIsImluaXRpYWxTaXplIiwiX2FzcGVjdEZpdCIsIl9uYXR1cmFsU2l6ZSIsImluaXRpYWxQb3NpdGlvbiIsImV4ZWMiLCJfYXBwbHlNZXRhZGF0YSIsImltZ1dpZHRoIiwiaW1nSGVpZ2h0IiwiY2FudmFzUmF0aW8iLCJhc3BlY3RSYXRpbyIsInBvaW50ZXJNb3ZlZCIsInBvaW50ZXJDb29yZCIsImdldFBvaW50ZXJDb29yZHMiLCJwb2ludGVyU3RhcnRDb29yZCIsInRhYlN0YXJ0IiwidmFsdWVPZiIsIndoaWNoIiwiZHJhZ2dpbmciLCJwaW5jaGluZyIsImNvb3JkIiwibGFzdE1vdmluZ0Nvb3JkIiwiZGlzYWJsZVBpbmNoVG9ab29tIiwicGluY2hEaXN0YW5jZSIsImdldFBpbmNoRGlzdGFuY2UiLCJjYW5jZWxFdmVudHMiLCJhZGRFdmVudExpc3RlbmVyIiwiX2hhbmRsZVBvaW50ZXJFbmQiLCJwb2ludGVyTW92ZURpc3RhbmNlIiwidGFiRW5kIiwiZGlzYWJsZURyYWdUb01vdmUiLCJwcmV2ZW50RGVmYXVsdCIsImRpc3RhbmNlIiwiZGVsdGEiLCJkaXNhYmxlU2Nyb2xsVG9ab29tIiwic2Nyb2xsaW5nIiwid2hlZWxEZWx0YSIsImRlbHRhWSIsImRldGFpbCIsInJldmVyc2VTY3JvbGxUb1pvb20iLCJkaXNhYmxlRHJhZ0FuZERyb3AiLCJldmVudEhhc0ZpbGUiLCJmaWxlRHJhZ2dlZE92ZXIiLCJpdGVtcyIsIml0ZW0iLCJraW5kIiwiZ2V0QXNGaWxlIiwidXNlT3JpZ2luYWwiLCJnZXRSb3RhdGVkSW1hZ2UiLCJmbGlwWCIsImZsaXBZIiwicm90YXRlOTAiLCJjbGVhclJlY3QiLCJmaWxsUmVjdCIsIl9kcmF3RnJhbWUiLCJEUkFXIiwiTkVXX0lNQUdFX0RSQVdOIiwic2NhbGUiLCJkZWZhdWx0T3B0aW9ucyIsIlZ1ZUNyb3BwYSIsIlZ1ZSIsIm9wdGlvbnMiLCJhc3NpZ24iLCJ2ZXJzaW9uIiwiY29tcG9uZW50TmFtZSIsImNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLENBQUMsVUFBVSxJQUFJLEVBQUUsT0FBTyxFQUFFO0lBQ3RCLElBQUksT0FBT0EsU0FBTSxLQUFLLFVBQVUsSUFBSUEsU0FBTSxDQUFDLEdBQUcsRUFBRTtRQUM1Q0EsU0FBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN2QixNQUFNLEFBQWlDO1FBQ3BDLGNBQWMsR0FBRyxPQUFPLEVBQUUsQ0FBQztLQUM5QixBQUVGO0NBQ0YsQ0FBQ0MsY0FBSSxFQUFFLFlBQVk7RUFDbEIsWUFBWSxDQUFDOztFQUViLFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0lBQ3hELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7SUFFakYsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckIsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckIsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQ3JDLElBQUksTUFBTSxJQUFJLElBQUksRUFBRSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQzs7SUFFeEMsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QyxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztJQUV2QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDWCxRQUFRLENBQUMsV0FBVzs7TUFFbEIsS0FBSyxDQUFDO1VBQ0YsTUFBTTs7O01BR1YsS0FBSyxDQUFDO1NBQ0gsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDeEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNqQixNQUFNOzs7TUFHVCxLQUFLLENBQUM7VUFDRixHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztVQUM3QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1VBQ2hDLE1BQU07OztNQUdWLEtBQUssQ0FBQztVQUNGLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1VBQ3pCLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7VUFDakIsTUFBTTs7O01BR1YsS0FBSyxDQUFDO1VBQ0YsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7VUFDdEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7VUFDdEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztVQUMvQixHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1VBQ2pCLE1BQU07OztNQUdWLEtBQUssQ0FBQztVQUNGLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1VBQ3RCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1VBQ3RCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7VUFDL0IsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztVQUMxQixNQUFNOzs7TUFHVixLQUFLLENBQUM7VUFDRixNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztVQUN0QixNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztVQUN0QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1VBQ2hDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7VUFDOUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUNqQixNQUFNOzs7TUFHVixLQUFLLENBQUM7VUFDRixNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztVQUN0QixNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztVQUN0QixHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztVQUN4QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1VBQ2hDLE1BQU07S0FDWDs7SUFFRCxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN4QyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7O0lBRWQsT0FBTyxNQUFNLENBQUM7R0FDZjs7RUFFRCxPQUFPO0lBQ0wsU0FBUyxFQUFFLFNBQVM7R0FDckIsQ0FBQztDQUNILENBQUMsRUFBRTs7O0FDekZKLFFBQWU7ZUFBQSx5QkFDRUMsS0FERixFQUNTQyxFQURULEVBQ2E7UUFDbEJDLE1BRGtCLEdBQ0VELEVBREYsQ0FDbEJDLE1BRGtCO1FBQ1ZDLE9BRFUsR0FDRUYsRUFERixDQUNWRSxPQURVOztRQUVwQkMsT0FBT0YsT0FBT0cscUJBQVAsRUFBWDtRQUNJQyxVQUFVTixNQUFNTSxPQUFwQjtRQUNJQyxVQUFVUCxNQUFNTyxPQUFwQjtXQUNPO1NBQ0YsQ0FBQ0QsVUFBVUYsS0FBS0ksSUFBaEIsSUFBd0JMLE9BRHRCO1NBRUYsQ0FBQ0ksVUFBVUgsS0FBS0ssR0FBaEIsSUFBdUJOO0tBRjVCO0dBTlc7a0JBQUEsNEJBWUtPLEdBWkwsRUFZVVQsRUFaVixFQVljO1FBQ3JCVSxnQkFBSjtRQUNJRCxJQUFJRSxPQUFKLElBQWVGLElBQUlFLE9BQUosQ0FBWSxDQUFaLENBQW5CLEVBQW1DO2dCQUN2QkYsSUFBSUUsT0FBSixDQUFZLENBQVosQ0FBVjtLQURGLE1BRU8sSUFBSUYsSUFBSUcsY0FBSixJQUFzQkgsSUFBSUcsY0FBSixDQUFtQixDQUFuQixDQUExQixFQUFpRDtnQkFDNUNILElBQUlHLGNBQUosQ0FBbUIsQ0FBbkIsQ0FBVjtLQURLLE1BRUE7Z0JBQ0tILEdBQVY7O1dBRUssS0FBS0ksYUFBTCxDQUFtQkgsT0FBbkIsRUFBNEJWLEVBQTVCLENBQVA7R0FyQlc7a0JBQUEsNEJBd0JLUyxHQXhCTCxFQXdCVVQsRUF4QlYsRUF3QmM7UUFDckJjLFdBQVdMLElBQUlFLE9BQUosQ0FBWSxDQUFaLENBQWY7UUFDSUksV0FBV04sSUFBSUUsT0FBSixDQUFZLENBQVosQ0FBZjtRQUNJSyxTQUFTLEtBQUtILGFBQUwsQ0FBbUJDLFFBQW5CLEVBQTZCZCxFQUE3QixDQUFiO1FBQ0lpQixTQUFTLEtBQUtKLGFBQUwsQ0FBbUJFLFFBQW5CLEVBQTZCZixFQUE3QixDQUFiOztXQUVPa0IsS0FBS0MsSUFBTCxDQUFVRCxLQUFLRSxHQUFMLENBQVNKLE9BQU9LLENBQVAsR0FBV0osT0FBT0ksQ0FBM0IsRUFBOEIsQ0FBOUIsSUFBbUNILEtBQUtFLEdBQUwsQ0FBU0osT0FBT00sQ0FBUCxHQUFXTCxPQUFPSyxDQUEzQixFQUE4QixDQUE5QixDQUE3QyxDQUFQO0dBOUJXO3FCQUFBLCtCQWlDUWIsR0FqQ1IsRUFpQ2FULEVBakNiLEVBaUNpQjtRQUN4QmMsV0FBV0wsSUFBSUUsT0FBSixDQUFZLENBQVosQ0FBZjtRQUNJSSxXQUFXTixJQUFJRSxPQUFKLENBQVksQ0FBWixDQUFmO1FBQ0lLLFNBQVMsS0FBS0gsYUFBTCxDQUFtQkMsUUFBbkIsRUFBNkJkLEVBQTdCLENBQWI7UUFDSWlCLFNBQVMsS0FBS0osYUFBTCxDQUFtQkUsUUFBbkIsRUFBNkJmLEVBQTdCLENBQWI7O1dBRU87U0FDRixDQUFDZ0IsT0FBT0ssQ0FBUCxHQUFXSixPQUFPSSxDQUFuQixJQUF3QixDQUR0QjtTQUVGLENBQUNMLE9BQU9NLENBQVAsR0FBV0wsT0FBT0ssQ0FBbkIsSUFBd0I7S0FGN0I7R0F2Q1c7YUFBQSx1QkE2Q0FDLEdBN0NBLEVBNkNLO1dBQ1RBLElBQUlDLFFBQUosSUFBZ0JELElBQUlFLFlBQUosS0FBcUIsQ0FBNUM7R0E5Q1c7YUFBQSx5QkFpREU7O1FBRVQsT0FBT0MsUUFBUCxJQUFtQixXQUFuQixJQUFrQyxPQUFPQyxNQUFQLElBQWlCLFdBQXZELEVBQW9FO1FBQ2hFQyxXQUFXLENBQWY7UUFDSUMsVUFBVSxDQUFDLFFBQUQsRUFBVyxLQUFYLENBQWQ7U0FDSyxJQUFJUixJQUFJLENBQWIsRUFBZ0JBLElBQUlRLFFBQVFDLE1BQVosSUFBc0IsQ0FBQ0gsT0FBT0kscUJBQTlDLEVBQXFFLEVBQUVWLENBQXZFLEVBQTBFO2FBQ2pFVSxxQkFBUCxHQUErQkosT0FBT0UsUUFBUVIsQ0FBUixJQUFhLHVCQUFwQixDQUEvQjthQUNPVyxvQkFBUCxHQUE4QkwsT0FBT0UsUUFBUVIsQ0FBUixJQUFhLHNCQUFwQjthQUNyQlEsUUFBUVIsQ0FBUixJQUFhLDZCQUFwQixDQURGOzs7UUFJRSxDQUFDTSxPQUFPSSxxQkFBWixFQUFtQzthQUMxQkEscUJBQVAsR0FBK0IsVUFBVUUsUUFBVixFQUFvQjtZQUM3Q0MsV0FBVyxJQUFJQyxJQUFKLEdBQVdDLE9BQVgsRUFBZjtZQUNJQyxhQUFhbkIsS0FBS29CLEdBQUwsQ0FBUyxDQUFULEVBQVksUUFBUUosV0FBV04sUUFBbkIsQ0FBWixDQUFqQjtZQUNJVyxLQUFLWixPQUFPYSxVQUFQLENBQWtCLFlBQVk7Y0FDakNDLE1BQU1QLFdBQVdHLFVBQXJCO21CQUNTSSxHQUFUO1NBRk8sRUFHTkosVUFITSxDQUFUO21CQUlXSCxXQUFXRyxVQUF0QjtlQUNPRSxFQUFQO09BUkY7O1FBV0UsQ0FBQ1osT0FBT0ssb0JBQVosRUFBa0M7YUFDekJBLG9CQUFQLEdBQThCLFVBQVVPLEVBQVYsRUFBYztxQkFDN0JBLEVBQWI7T0FERjs7O1VBS0lHLE9BQU4sR0FBZ0IsVUFBVUQsR0FBVixFQUFlO2FBQ3RCRSxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JMLEdBQS9CLE1BQXdDLGdCQUEvQztLQURGO0dBOUVXO2dCQUFBLDRCQW1GSztRQUNaLE9BQU9mLFFBQVAsSUFBbUIsV0FBbkIsSUFBa0MsT0FBT0MsTUFBUCxJQUFpQixXQUFuRCxJQUFrRSxDQUFDb0IsaUJBQXZFLEVBQTBGO1FBQ3RGQyxNQUFKLEVBQVlDLEdBQVosRUFBaUJDLEdBQWpCO1FBQ0ksQ0FBQ0gsa0JBQWtCSCxTQUFsQixDQUE0Qk8sTUFBakMsRUFBeUM7YUFDaENDLGNBQVAsQ0FBc0JMLGtCQUFrQkgsU0FBeEMsRUFBbUQsUUFBbkQsRUFBNkQ7ZUFDcEQsZUFBVVgsUUFBVixFQUFvQm9CLElBQXBCLEVBQTBCbkQsT0FBMUIsRUFBbUM7bUJBQy9Cb0QsS0FBSyxLQUFLQyxTQUFMLENBQWVGLElBQWYsRUFBcUJuRCxPQUFyQixFQUE4QnNELEtBQTlCLENBQW9DLEdBQXBDLEVBQXlDLENBQXpDLENBQUwsQ0FBVDtnQkFDTVIsT0FBT2xCLE1BQWI7Z0JBQ00sSUFBSTJCLFVBQUosQ0FBZVIsR0FBZixDQUFOOztlQUVLLElBQUlTLElBQUksQ0FBYixFQUFnQkEsSUFBSVQsR0FBcEIsRUFBeUJTLEdBQXpCLEVBQThCO2dCQUN4QkEsQ0FBSixJQUFTVixPQUFPVyxVQUFQLENBQWtCRCxDQUFsQixDQUFUOzs7bUJBR08sSUFBSUUsSUFBSixDQUFTLENBQUNWLEdBQUQsQ0FBVCxFQUFnQixFQUFFRyxNQUFNQSxRQUFRLFdBQWhCLEVBQWhCLENBQVQ7O09BVko7O0dBdkZTO2NBQUEsd0JBdUdDNUMsR0F2R0QsRUF1R007UUFDYm9ELEtBQUtwRCxJQUFJcUQsWUFBSixJQUFvQnJELElBQUlzRCxhQUFKLENBQWtCRCxZQUEvQztRQUNJRCxHQUFHRyxLQUFQLEVBQWM7V0FDUCxJQUFJTixJQUFJLENBQVIsRUFBV1QsTUFBTVksR0FBR0csS0FBSCxDQUFTbEMsTUFBL0IsRUFBdUM0QixJQUFJVCxHQUEzQyxFQUFnRFMsR0FBaEQsRUFBcUQ7WUFDL0NHLEdBQUdHLEtBQUgsQ0FBU04sQ0FBVCxLQUFlLE9BQW5CLEVBQTRCO2lCQUNuQixJQUFQOzs7OztXQUtDLEtBQVA7R0FqSFc7b0JBQUEsOEJBb0hPTyxXQXBIUCxFQW9Ib0I7UUFDM0JDLE9BQU8sSUFBSUMsUUFBSixDQUFhRixXQUFiLENBQVg7UUFDSUMsS0FBS0UsU0FBTCxDQUFlLENBQWYsRUFBa0IsS0FBbEIsS0FBNEIsTUFBaEMsRUFBd0MsT0FBTyxDQUFDLENBQVI7UUFDcEN0QyxTQUFTb0MsS0FBS0csVUFBbEI7UUFDSUMsU0FBUyxDQUFiO1dBQ09BLFNBQVN4QyxNQUFoQixFQUF3QjtVQUNsQnlDLFNBQVNMLEtBQUtFLFNBQUwsQ0FBZUUsTUFBZixFQUF1QixLQUF2QixDQUFiO2dCQUNVLENBQVY7VUFDSUMsVUFBVSxNQUFkLEVBQXNCO1lBQ2hCTCxLQUFLTSxTQUFMLENBQWVGLFVBQVUsQ0FBekIsRUFBNEIsS0FBNUIsS0FBc0MsVUFBMUMsRUFBc0QsT0FBTyxDQUFDLENBQVI7WUFDbERHLFNBQVNQLEtBQUtFLFNBQUwsQ0FBZUUsVUFBVSxDQUF6QixFQUE0QixLQUE1QixLQUFzQyxNQUFuRDtrQkFDVUosS0FBS00sU0FBTCxDQUFlRixTQUFTLENBQXhCLEVBQTJCRyxNQUEzQixDQUFWO1lBQ0lDLE9BQU9SLEtBQUtFLFNBQUwsQ0FBZUUsTUFBZixFQUF1QkcsTUFBdkIsQ0FBWDtrQkFDVSxDQUFWO2FBQ0ssSUFBSWYsSUFBSSxDQUFiLEVBQWdCQSxJQUFJZ0IsSUFBcEIsRUFBMEJoQixHQUExQixFQUErQjtjQUN6QlEsS0FBS0UsU0FBTCxDQUFlRSxTQUFVWixJQUFJLEVBQTdCLEVBQWtDZSxNQUFsQyxLQUE2QyxNQUFqRCxFQUF5RDttQkFDaERQLEtBQUtFLFNBQUwsQ0FBZUUsU0FBVVosSUFBSSxFQUFkLEdBQW9CLENBQW5DLEVBQXNDZSxNQUF0QyxDQUFQOzs7T0FSTixNQVdPLElBQUksQ0FBQ0YsU0FBUyxNQUFWLEtBQXFCLE1BQXpCLEVBQWlDLE1BQWpDLEtBQ0ZELFVBQVVKLEtBQUtFLFNBQUwsQ0FBZUUsTUFBZixFQUF1QixLQUF2QixDQUFWOztXQUVBLENBQUMsQ0FBUjtHQTFJVztxQkFBQSwrQkE2SVFLLE1BN0lSLEVBNklnQjthQUNsQkEsT0FBT0MsT0FBUCxDQUFlLDBCQUFmLEVBQTJDLEVBQTNDLENBQVQ7UUFDSUMsZUFBZXZCLEtBQUtxQixNQUFMLENBQW5CO1FBQ0kxQixNQUFNNEIsYUFBYS9DLE1BQXZCO1FBQ0lnRCxRQUFRLElBQUlyQixVQUFKLENBQWVSLEdBQWYsQ0FBWjtTQUNLLElBQUlTLElBQUksQ0FBYixFQUFnQkEsSUFBSVQsR0FBcEIsRUFBeUJTLEdBQXpCLEVBQThCO1lBQ3RCQSxDQUFOLElBQVdtQixhQUFhbEIsVUFBYixDQUF3QkQsQ0FBeEIsQ0FBWDs7V0FFS29CLE1BQU1DLE1BQWI7R0FySlc7aUJBQUEsMkJBd0pJeEQsR0F4SkosRUF3SlN5RCxXQXhKVCxFQXdKc0I7UUFDN0JDLFVBQVVDLE1BQXNCQyxTQUF0QixDQUFnQzVELEdBQWhDLEVBQXFDeUQsV0FBckMsQ0FBZDtRQUNJSSxPQUFPLElBQUlDLEtBQUosRUFBWDtTQUNLQyxHQUFMLEdBQVdMLFFBQVExQixTQUFSLEVBQVg7V0FDTzZCLElBQVA7R0E1Slc7T0FBQSxpQkErSk5HLEdBL0pNLEVBK0pEO1FBQ05BLE1BQU0sQ0FBTixJQUFXLENBQWYsRUFBa0I7YUFDVEEsTUFBTSxDQUFiOzs7V0FHS0EsTUFBTSxDQUFiO0dBcEtXO09BQUEsaUJBdUtOQSxHQXZLTSxFQXVLRDtRQUNKQyxNQUFNO1NBQ1AsQ0FETztTQUVQLENBRk87U0FHUCxDQUhPO1NBSVAsQ0FKTztTQUtQLENBTE87U0FNUCxDQU5PO1NBT1AsQ0FQTztTQVFQO0tBUkw7O1dBV09BLElBQUlELEdBQUosQ0FBUDtHQW5MVztVQUFBLG9CQXNMSEEsR0F0TEcsRUFzTEU7UUFDUEMsTUFBTTtTQUNQLENBRE87U0FFUCxDQUZPO1NBR1AsQ0FITztTQUlQLENBSk87U0FLUCxDQUxPO1NBTVAsQ0FOTztTQU9QLENBUE87U0FRUDtLQVJMOztXQVdPQSxJQUFJRCxHQUFKLENBQVA7R0FsTVc7YUFBQSx1QkFxTUFFLENBck1BLEVBcU1HO1dBQ1AsT0FBT0EsQ0FBUCxLQUFhLFFBQWIsSUFBeUIsQ0FBQ0MsTUFBTUQsQ0FBTixDQUFqQzs7Q0F0TUo7O0FDRkFFLE9BQU9DLFNBQVAsR0FDRUQsT0FBT0MsU0FBUCxJQUNBLFVBQVNDLEtBQVQsRUFBZ0I7U0FFWixPQUFPQSxLQUFQLEtBQWlCLFFBQWpCLElBQ0FDLFNBQVNELEtBQVQsQ0FEQSxJQUVBM0UsS0FBSzZFLEtBQUwsQ0FBV0YsS0FBWCxNQUFzQkEsS0FIeEI7Q0FISjs7QUFVQSxJQUFJRyxtQkFBbUJDLE1BQXZCO0FBQ0EsSUFBSXRFLFVBQVVBLE9BQU8wRCxLQUFyQixFQUE0QjtxQkFDUCxDQUFDWSxNQUFELEVBQVNaLEtBQVQsQ0FBbkI7OztBQUdGLFlBQWU7U0FDTjFDLE1BRE07U0FFTjtVQUNDZ0QsTUFERDthQUVJLEdBRko7ZUFHTSxtQkFBU08sR0FBVCxFQUFjO2FBQ2hCQSxNQUFNLENBQWI7O0dBTlM7VUFTTDtVQUNBUCxNQURBO2FBRUcsR0FGSDtlQUdLLG1CQUFTTyxHQUFULEVBQWM7YUFDaEJBLE1BQU0sQ0FBYjs7R0FiUztlQWdCQTtVQUNMRCxNQURLO2FBRUY7R0FsQkU7b0JBb0JLO2FBQ1A7R0FyQkU7dUJBdUJRO1VBQ2JOLE1BRGE7YUFFVixDQUZVO2VBR1IsbUJBQVNPLEdBQVQsRUFBYzthQUNoQkEsT0FBTyxDQUFkOztHQTNCUztlQThCQTthQUNGO0dBL0JFO1dBaUNKO1VBQ0RQLE1BREM7YUFFRSxDQUZGO2VBR0ksbUJBQVNPLEdBQVQsRUFBYzthQUNoQkEsTUFBTSxDQUFiOztHQXJDUzthQXdDRjthQUNBLENBREE7VUFFSFAsTUFGRztlQUdFLG1CQUFTTyxHQUFULEVBQWM7YUFDaEJBLE1BQU0sQ0FBYjs7R0E1Q1M7VUErQ0xELE1BL0NLO2lCQWdERTtVQUNQTixNQURPO2FBRUosQ0FGSTtlQUdGLG1CQUFTTyxHQUFULEVBQWM7YUFDaEJBLE9BQU8sQ0FBZDs7R0FwRFM7WUF1REhDLE9BdkRHO3NCQXdET0EsT0F4RFA7d0JBeURTQSxPQXpEVDtxQkEwRE1BLE9BMUROO3VCQTJEUUEsT0EzRFI7c0JBNERPQSxPQTVEUDttQkE2RElBLE9BN0RKO3VCQThEUUEsT0E5RFI7cUJBK0RNQSxPQS9ETjtvQkFnRUs7VUFDVkEsT0FEVTthQUVQO0dBbEVFO3FCQW9FTTtVQUNYRixNQURXO2FBRVI7R0F0RUU7b0JBd0VLO1VBQ1ZOO0dBekVLO2dCQTJFQ0ssZ0JBM0VEO2VBNEVBO1VBQ0xDLE1BREs7YUFFRixPQUZFO2VBR0EsbUJBQVNDLEdBQVQsRUFBYzthQUNoQkEsUUFBUSxPQUFSLElBQW1CQSxRQUFRLFNBQTNCLElBQXdDQSxRQUFRLFNBQXZEOztHQWhGUzttQkFtRkk7VUFDVEQsTUFEUzthQUVOLFFBRk07ZUFHSixtQkFBU0MsR0FBVCxFQUFjO1VBQ25CRSxTQUFTLENBQUMsUUFBRCxFQUFXLEtBQVgsRUFBa0IsUUFBbEIsRUFBNEIsTUFBNUIsRUFBb0MsT0FBcEMsQ0FBYjthQUVFRixJQUFJMUMsS0FBSixDQUFVLEdBQVYsRUFBZTZDLEtBQWYsQ0FBcUIsZ0JBQVE7ZUFDcEJELE9BQU9FLE9BQVAsQ0FBZUMsSUFBZixLQUF3QixDQUEvQjtPQURGLEtBRU0sa0JBQWtCQyxJQUFsQixDQUF1Qk4sR0FBdkIsQ0FIUjs7R0F4RlM7Y0ErRkR2RCxNQS9GQztlQWdHQXdELE9BaEdBO2VBaUdBO1VBQ0xSLE1BREs7YUFFRjtHQW5HRTtnQkFxR0M7VUFDTk0sTUFETTthQUVIOztDQXZHYjs7QUNmQSxhQUFlO2NBQ0QsTUFEQztxQkFFTSxhQUZOOzBCQUdXLGtCQUhYOzRCQUlhLG9CQUpiO2FBS0YsV0FMRTttQkFNSSxpQkFOSjtzQkFPTyxjQVBQO2NBUUQsTUFSQztjQVNELE1BVEM7UUFVUCxNQVZPOzhCQVdlLHNCQVhmO2lCQVlFLGVBWkY7ZUFhQTtDQWJmOzs7Ozs7OztBQ29FQSxJQUFNUSxlQUFlLElBQUksTUFBekI7QUFDQSxJQUFNQyxtQkFBbUIsR0FBekI7QUFDQSxJQUFNQyx1QkFBdUIsR0FBN0I7QUFDQSxJQUFNQyxZQUFZLEVBQWxCO0FBQ0EsSUFBTUMsNkJBQTZCLElBQUksQ0FBdkM7QUFDQSxJQUFNQyxxQkFBcUIsQ0FBM0I7OztBQUdBLGdCQUFlLEVBQUNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQUFELHFCQUFBO1NBQ047VUFDQyxPQUREO1dBRUVDLE9BQU9DO0dBSEg7O1NBTU5DLEtBTk07O01BQUEsa0JBUUw7V0FDQztjQUNHLElBREg7V0FFQSxJQUZBO3FCQUdVLElBSFY7V0FJQSxJQUpBO2dCQUtLLEtBTEw7dUJBTVksSUFOWjtlQU9JO2VBQ0EsQ0FEQTtnQkFFQyxDQUZEO2dCQUdDLENBSEQ7Z0JBSUM7T0FYTDt1QkFhWSxLQWJaO2dCQWNLLENBZEw7aUJBZU0sS0FmTjtnQkFnQkssS0FoQkw7Z0JBaUJLLEtBakJMO3FCQWtCVSxDQWxCVjtvQkFtQlMsS0FuQlQ7b0JBb0JTLEtBcEJUO3lCQXFCYyxJQXJCZDtvQkFzQlMsQ0F0QlQ7cUJBdUJVLENBdkJWO2tCQXdCTyxJQXhCUDttQkF5QlEsQ0F6QlI7b0JBMEJTLElBMUJUO2dCQTJCSyxLQTNCTDsyQkE0QmdCLElBNUJoQjt3QkE2QmEsS0E3QmI7ZUE4Qkk7S0E5Qlg7R0FUVzs7O1lBMkNIO2VBQUEseUJBQ087YUFDTixLQUFLQyxLQUFMLEdBQWEsS0FBS2pILE9BQXpCO0tBRk07Z0JBQUEsMEJBS1E7YUFDUCxLQUFLa0gsTUFBTCxHQUFjLEtBQUtsSCxPQUExQjtLQU5NOytCQUFBLHlDQVN1QjthQUN0QixLQUFLbUgsbUJBQUwsR0FBMkIsS0FBS25ILE9BQXZDO0tBVk07ZUFBQSx5QkFhTzthQUNOLEtBQUt1QixZQUFMLEdBQW9CLEtBQUs2RixhQUFoQztLQWRNO2dCQUFBLDBCQWlCUTthQUNQO2VBQ0UsS0FBS0MsV0FBTCxHQUFtQixJQURyQjtnQkFFRyxLQUFLQSxXQUFMLEdBQW1CLElBRnRCO2VBR0UsTUFIRjtnQkFJRztPQUpWOztHQTdEUzs7U0FBQSxxQkFzRUY7U0FDSkMsV0FBTDtNQUNFQyxXQUFGO01BQ0VDLGNBQUY7O1FBRUlDLFdBQVcsS0FBS0MsZ0JBQUwsRUFBZjtRQUNJLENBQUNELFNBQVNFLEtBQWQsRUFBcUI7Y0FDWEMsSUFBUixDQUFhLHlEQUFiOztHQTdFUzs7O1NBaUZOO2lCQUNRLHVCQUFZO1dBQ2xCQyxpQkFBTDtLQUZHO2tCQUlTLHdCQUFZO1dBQ25CQSxpQkFBTDtLQUxHO2lCQU9RLHVCQUFZO1VBQ25CLENBQUMsS0FBS3hHLEdBQVYsRUFBZTthQUNSeUcsZ0JBQUw7T0FERixNQUVPO2FBQ0FDLEtBQUw7O0tBWEM7aUJBY1EsdUJBQVk7VUFDbkIsQ0FBQyxLQUFLMUcsR0FBVixFQUFlO2FBQ1J5RyxnQkFBTDs7S0FoQkM7c0JBbUJhLDRCQUFZO1VBQ3hCLENBQUMsS0FBS3pHLEdBQVYsRUFBZTthQUNSeUcsZ0JBQUw7O0tBckJDO2lDQXdCd0IsdUNBQVk7VUFDbkMsQ0FBQyxLQUFLekcsR0FBVixFQUFlO2FBQ1J5RyxnQkFBTDs7S0ExQkM7cUJBQUEsNkJBNkJjOUIsR0E3QmQsRUE2Qm1CO1VBQ2xCQSxHQUFKLEVBQVM7YUFDRmdDLFFBQUwsR0FBZ0IsS0FBaEI7O1dBRUdDLFdBQUw7S0FqQ0c7Y0FBQSxzQkFtQ09qQyxHQW5DUCxFQW1DWWtDLE1BbkNaLEVBbUNvQjtVQUNuQixDQUFDLEtBQUs3RyxHQUFWLEVBQWU7VUFDWCxDQUFDOEcsRUFBRUMsV0FBRixDQUFjcEMsR0FBZCxDQUFMLEVBQXlCOztVQUVyQjdFLElBQUksQ0FBUjtVQUNJZ0gsRUFBRUMsV0FBRixDQUFjRixNQUFkLEtBQXlCQSxXQUFXLENBQXhDLEVBQTJDO1lBQ3JDbEMsTUFBTWtDLE1BQVY7O1VBRUVHLE1BQU0sS0FBS0MsbUJBQUwsSUFBNEI7V0FDakMsS0FBS0MsT0FBTCxDQUFhQyxNQUFiLEdBQXNCLEtBQUtELE9BQUwsQ0FBYXRCLEtBQWIsR0FBcUIsQ0FEVjtXQUVqQyxLQUFLc0IsT0FBTCxDQUFhRSxNQUFiLEdBQXNCLEtBQUtGLE9BQUwsQ0FBYXJCLE1BQWIsR0FBc0I7T0FGakQ7V0FJS3FCLE9BQUwsQ0FBYXRCLEtBQWIsR0FBcUIsS0FBSzFGLFlBQUwsR0FBb0J5RSxHQUF6QztXQUNLdUMsT0FBTCxDQUFhckIsTUFBYixHQUFzQixLQUFLRSxhQUFMLEdBQXFCcEIsR0FBM0M7O1VBRUksS0FBSzBDLGlCQUFULEVBQTRCO2FBQ3JCQywyQkFBTDthQUNLQywwQkFBTDs7O1VBR0UsS0FBS0MsWUFBTCxJQUFxQixDQUFDLEtBQUtiLFFBQTNCLElBQXVDLEtBQUtjLFFBQWhELEVBQTBEO1VBQ3REQyxVQUFVLENBQUM1SCxJQUFJLENBQUwsS0FBV2tILElBQUlsSCxDQUFKLEdBQVEsS0FBS29ILE9BQUwsQ0FBYUMsTUFBaEMsQ0FBZDtVQUNJUSxVQUFVLENBQUM3SCxJQUFJLENBQUwsS0FBV2tILElBQUlqSCxDQUFKLEdBQVEsS0FBS21ILE9BQUwsQ0FBYUUsTUFBaEMsQ0FBZDtXQUNLRixPQUFMLENBQWFDLE1BQWIsR0FBc0IsS0FBS0QsT0FBTCxDQUFhQyxNQUFiLEdBQXNCTyxPQUE1QztXQUNLUixPQUFMLENBQWFFLE1BQWIsR0FBc0IsS0FBS0YsT0FBTCxDQUFhRSxNQUFiLEdBQXNCTyxPQUE1QztLQTNERzs7cUJBNkRZLHNCQUFVaEQsR0FBVixFQUFla0MsTUFBZixFQUF1QjtVQUNsQyxDQUFDQyxFQUFFQyxXQUFGLENBQWNwQyxHQUFkLENBQUwsRUFBeUI7V0FDcEJpRCxVQUFMLEdBQWtCakQsTUFBTSxLQUFLekUsWUFBN0I7VUFDSSxLQUFLMkgsUUFBTCxFQUFKLEVBQXFCO1lBQ2ZsSSxLQUFLbUksR0FBTCxDQUFTbkQsTUFBTWtDLE1BQWYsSUFBMEJsQyxPQUFPLElBQUksTUFBWCxDQUE5QixFQUFtRDtlQUM1Q29ELEtBQUwsQ0FBV3RDLE9BQU91QyxVQUFsQjtlQUNLdEIsS0FBTDs7O0tBbkVEO3NCQXVFYSx1QkFBVS9CLEdBQVYsRUFBZTtVQUMzQixDQUFDbUMsRUFBRUMsV0FBRixDQUFjcEMsR0FBZCxDQUFMLEVBQXlCO1dBQ3BCaUQsVUFBTCxHQUFrQmpELE1BQU0sS0FBS29CLGFBQTdCO0tBekVHO1dBQUEsbUJBMkVJcEIsR0EzRUosRUEyRVM7VUFDUkEsR0FBSixFQUFTO2FBQ0ZvRCxLQUFMLENBQVd0QyxPQUFPd0MsYUFBbEI7T0FERixNQUVPO2FBQ0FGLEtBQUwsQ0FBV3RDLE9BQU95QyxXQUFsQjs7O0dBaEtPOztXQXFLSjthQUFBLHVCQUNNO2FBQ0osS0FBS3hKLE1BQVo7S0FGSztjQUFBLHdCQUtPO2FBQ0wsS0FBS3lKLEdBQVo7S0FOSztpQkFBQSwyQkFTVTthQUNSLEtBQUtDLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQkMsS0FBckIsQ0FBMkIsQ0FBM0IsQ0FBUDtLQVZLO1FBQUEsZ0JBYUR2RixNQWJDLEVBYU87VUFDUixDQUFDQSxNQUFMLEVBQWE7VUFDVHdGLE9BQU8sS0FBS3JCLE9BQUwsQ0FBYUMsTUFBeEI7VUFDSXFCLE9BQU8sS0FBS3RCLE9BQUwsQ0FBYUUsTUFBeEI7V0FDS0YsT0FBTCxDQUFhQyxNQUFiLElBQXVCcEUsT0FBT2pELENBQTlCO1dBQ0tvSCxPQUFMLENBQWFFLE1BQWIsSUFBdUJyRSxPQUFPaEQsQ0FBOUI7VUFDSSxLQUFLc0gsaUJBQVQsRUFBNEI7YUFDckJFLDBCQUFMOztVQUVFLEtBQUtMLE9BQUwsQ0FBYUMsTUFBYixLQUF3Qm9CLElBQXhCLElBQWdDLEtBQUtyQixPQUFMLENBQWFFLE1BQWIsS0FBd0JvQixJQUE1RCxFQUFrRTthQUMzRFQsS0FBTCxDQUFXdEMsT0FBT2dELFVBQWxCO2FBQ0svQixLQUFMOztLQXhCRztlQUFBLHlCQTRCa0I7VUFBWmdDLE1BQVksdUVBQUgsQ0FBRzs7V0FDbEJDLElBQUwsQ0FBVSxFQUFFN0ksR0FBRyxDQUFMLEVBQVFDLEdBQUcsQ0FBQzJJLE1BQVosRUFBVjtLQTdCSztpQkFBQSwyQkFnQ29CO1VBQVpBLE1BQVksdUVBQUgsQ0FBRzs7V0FDcEJDLElBQUwsQ0FBVSxFQUFFN0ksR0FBRyxDQUFMLEVBQVFDLEdBQUcySSxNQUFYLEVBQVY7S0FqQ0s7aUJBQUEsMkJBb0NvQjtVQUFaQSxNQUFZLHVFQUFILENBQUc7O1dBQ3BCQyxJQUFMLENBQVUsRUFBRTdJLEdBQUcsQ0FBQzRJLE1BQU4sRUFBYzNJLEdBQUcsQ0FBakIsRUFBVjtLQXJDSztrQkFBQSw0QkF3Q3FCO1VBQVoySSxNQUFZLHVFQUFILENBQUc7O1dBQ3JCQyxJQUFMLENBQVUsRUFBRTdJLEdBQUc0SSxNQUFMLEVBQWEzSSxHQUFHLENBQWhCLEVBQVY7S0F6Q0s7UUFBQSxrQkE0Q2dDO1VBQWpDNkksTUFBaUMsdUVBQXhCLElBQXdCO1VBQWxCQyxZQUFrQix1RUFBSCxDQUFHOztVQUNqQ0MsWUFBWSxLQUFLQyxTQUFMLEdBQWlCRixZQUFqQztVQUNJRyxRQUFTLEtBQUtDLFdBQUwsR0FBbUIvRCxZQUFwQixHQUFvQzRELFNBQWhEO1VBQ0loSixJQUFJLENBQVI7VUFDSThJLE1BQUosRUFBWTtZQUNOLElBQUlJLEtBQVI7T0FERixNQUVPLElBQUksS0FBSzlCLE9BQUwsQ0FBYXRCLEtBQWIsR0FBcUJQLFNBQXpCLEVBQW9DO1lBQ3JDLElBQUkyRCxLQUFSOzs7V0FHR3BCLFVBQUwsSUFBbUI5SCxDQUFuQjtLQXRESztVQUFBLG9CQXlERztXQUNIb0osSUFBTCxDQUFVLElBQVY7S0ExREs7V0FBQSxxQkE2REk7V0FDSkEsSUFBTCxDQUFVLEtBQVY7S0E5REs7VUFBQSxvQkFpRVc7VUFBVkMsSUFBVSx1RUFBSCxDQUFHOztVQUNaLEtBQUtDLGVBQUwsSUFBd0IsS0FBS0MsUUFBakMsRUFBMkM7YUFDcENDLFNBQVNILElBQVQsQ0FBUDtVQUNJaEYsTUFBTWdGLElBQU4sS0FBZUEsT0FBTyxDQUF0QixJQUEyQkEsT0FBTyxDQUFDLENBQXZDLEVBQTBDO2dCQUNoQzVDLElBQVIsQ0FBYSxtRkFBYjtlQUNPLENBQVA7O1dBRUdnRCxhQUFMLENBQW1CSixJQUFuQjtLQXhFSztTQUFBLG1CQTJFRTtVQUNILEtBQUtDLGVBQUwsSUFBd0IsS0FBS0MsUUFBakMsRUFBMkM7V0FDdENHLGVBQUwsQ0FBcUIsQ0FBckI7S0E3RUs7U0FBQSxtQkFnRkU7VUFDSCxLQUFLSixlQUFMLElBQXdCLEtBQUtDLFFBQWpDLEVBQTJDO1dBQ3RDRyxlQUFMLENBQXFCLENBQXJCO0tBbEZLO1dBQUEscUJBcUZJO1dBQ0pDLFNBQUwsQ0FBZSxLQUFLeEQsV0FBcEI7S0F0Rks7WUFBQSxzQkF5Rks7YUFDSCxDQUFDLENBQUMsS0FBS1UsUUFBZDtLQTFGSztpQkFBQSx5QkE2RlErQyxRQTdGUixFQTZGa0I7VUFDbkIsQ0FBQ0EsUUFBTCxFQUFlO1dBQ1ZsQyxZQUFMLEdBQW9Ca0MsUUFBcEI7VUFDSTFGLE1BQU0wRixTQUFTakcsV0FBVCxJQUF3QixLQUFLQSxXQUE3QixJQUE0QyxDQUF0RDtXQUNLK0YsZUFBTCxDQUFxQnhGLEdBQXJCLEVBQTBCLElBQTFCO0tBakdLO21CQUFBLDJCQW1HVWxDLElBbkdWLEVBbUdnQjZILGVBbkdoQixFQW1HaUM7VUFDbEMsQ0FBQyxLQUFLOUIsUUFBTCxFQUFMLEVBQXNCLE9BQU8sRUFBUDthQUNmLEtBQUtuSixNQUFMLENBQVlzRCxTQUFaLENBQXNCRixJQUF0QixFQUE0QjZILGVBQTVCLENBQVA7S0FyR0s7Z0JBQUEsd0JBd0dPakosUUF4R1AsRUF3R2lCa0osUUF4R2pCLEVBd0cyQkMsZUF4RzNCLEVBd0c0QztVQUM3QyxDQUFDLEtBQUtoQyxRQUFMLEVBQUwsRUFBc0I7aUJBQ1gsSUFBVDs7V0FFR25KLE1BQUwsQ0FBWWtELE1BQVosQ0FBbUJsQixRQUFuQixFQUE2QmtKLFFBQTdCLEVBQXVDQyxlQUF2QztLQTVHSztnQkFBQSwwQkErR2dCOzs7d0NBQU5DLElBQU07WUFBQTs7O1VBQ2pCLE9BQU9DLE9BQVAsSUFBa0IsV0FBdEIsRUFBbUM7Z0JBQ3pCeEQsSUFBUixDQUFhLGlGQUFiOzs7YUFHSyxJQUFJd0QsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtZQUNsQztnQkFDR0MsWUFBTCxDQUFrQixVQUFDQyxJQUFELEVBQVU7b0JBQ2xCQSxJQUFSO1dBREYsRUFFR0wsSUFGSDtTQURGLENBSUUsT0FBT00sR0FBUCxFQUFZO2lCQUNMQSxHQUFQOztPQU5HLENBQVA7S0FwSEs7ZUFBQSx5QkErSFE7VUFDVCxDQUFDLEtBQUt2QyxRQUFMLEVBQUwsRUFBc0IsT0FBTyxFQUFQO3FCQUNHLEtBQUtYLE9BRmpCO1VBRVBDLE1BRk8sWUFFUEEsTUFGTztVQUVDQyxNQUZELFlBRUNBLE1BRkQ7OzthQUlOO3NCQUFBO3NCQUFBO2VBR0UsS0FBS1EsVUFIUDtxQkFJUSxLQUFLbkU7T0FKcEI7S0FuSUs7b0JBQUEsOEJBMklhO1VBQ2Q0RyxNQUFNbEssU0FBU21LLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBVjthQUNPO2lCQUNJbEssT0FBT0kscUJBQVAsSUFBZ0NKLE9BQU9tSyxJQUF2QyxJQUErQ25LLE9BQU9vSyxVQUF0RCxJQUFvRXBLLE9BQU9xSyxRQUEzRSxJQUF1RnJLLE9BQU9pQyxJQURsRztlQUVFLGlCQUFpQmdJLEdBQWpCLElBQXdCLFlBQVlBO09BRjdDO0tBN0lLO2NBQUEsd0JBbUpPO1dBQ1BqQyxLQUFMLENBQVdDLFNBQVgsQ0FBcUJxQyxLQUFyQjtLQXBKSztVQUFBLG9CQXVKRztXQUNIakUsZ0JBQUw7O1VBRUlrRSxXQUFXLEtBQUszSyxHQUFMLElBQVksSUFBM0I7V0FDSzRLLGFBQUwsR0FBcUIsSUFBckI7V0FDSzVLLEdBQUwsR0FBVyxJQUFYO1dBQ0tvSSxLQUFMLENBQVdDLFNBQVgsQ0FBcUIvRCxLQUFyQixHQUE2QixFQUE3QjtXQUNLNEMsT0FBTCxHQUFlO2VBQ04sQ0FETTtnQkFFTCxDQUZLO2dCQUdMLENBSEs7Z0JBSUw7T0FKVjtXQU1LekQsV0FBTCxHQUFtQixDQUFuQjtXQUNLbUUsVUFBTCxHQUFrQixJQUFsQjtXQUNLSixZQUFMLEdBQW9CLElBQXBCO1dBQ0tiLFFBQUwsR0FBZ0IsS0FBaEI7V0FDS2tFLE9BQUwsR0FBZSxLQUFmOztVQUVJRixRQUFKLEVBQWM7YUFDUDVDLEtBQUwsQ0FBV3RDLE9BQU9xRixrQkFBbEI7O0tBM0tHO2VBQUEseUJBK0tRO1dBQ1JwTSxNQUFMLEdBQWMsS0FBSzBKLEtBQUwsQ0FBVzFKLE1BQXpCO1dBQ0txTSxRQUFMO1dBQ0tyTSxNQUFMLENBQVlzTSxLQUFaLENBQWtCQyxlQUFsQixHQUFxQyxDQUFDLEtBQUtDLFdBQU4sSUFBcUIsS0FBS0EsV0FBTCxJQUFvQixTQUExQyxHQUF1RCxhQUF2RCxHQUF3RSxPQUFPLEtBQUtBLFdBQVosS0FBNEIsUUFBNUIsR0FBdUMsS0FBS0EsV0FBNUMsR0FBMEQsRUFBdEs7V0FDSy9DLEdBQUwsR0FBVyxLQUFLekosTUFBTCxDQUFZeU0sVUFBWixDQUF1QixJQUF2QixDQUFYO1dBQ0tQLGFBQUwsR0FBcUIsSUFBckI7V0FDSzVLLEdBQUwsR0FBVyxJQUFYO1dBQ0syRyxRQUFMLEdBQWdCLEtBQWhCO1dBQ0t5RSxXQUFMO1dBQ0tyRCxLQUFMLENBQVd0QyxPQUFPQyxVQUFsQixFQUE4QixJQUE5QjtLQXhMSztZQUFBLHNCQTJMSztXQUNMaEgsTUFBTCxDQUFZa0gsS0FBWixHQUFvQixLQUFLcUQsV0FBekI7V0FDS3ZLLE1BQUwsQ0FBWW1ILE1BQVosR0FBcUIsS0FBS3dGLFlBQTFCO1dBQ0szTSxNQUFMLENBQVlzTSxLQUFaLENBQWtCcEYsS0FBbEIsR0FBMEIsS0FBS0EsS0FBTCxHQUFhLElBQXZDO1dBQ0tsSCxNQUFMLENBQVlzTSxLQUFaLENBQWtCbkYsTUFBbEIsR0FBMkIsS0FBS0EsTUFBTCxHQUFjLElBQXpDO0tBL0xLO2lCQUFBLHlCQWtNUXNELElBbE1SLEVBa01jO1VBQ2YxRixjQUFjLENBQWxCO2NBQ1EwRixJQUFSO2FBQ08sQ0FBTDt3QkFDZ0IsQ0FBZDs7YUFFRyxDQUFMO3dCQUNnQixDQUFkOzthQUVHLENBQUw7d0JBQ2dCLENBQWQ7O2FBRUcsQ0FBQyxDQUFOO3dCQUNnQixDQUFkOzthQUVHLENBQUMsQ0FBTjt3QkFDZ0IsQ0FBZDs7YUFFRyxDQUFDLENBQU47d0JBQ2dCLENBQWQ7OztXQUdDSyxlQUFMLENBQXFCL0YsV0FBckI7S0F4Tks7d0JBQUEsa0NBMk5pQjs7O1VBQ2xCekQsWUFBSjtVQUNJLEtBQUtzTCxNQUFMLENBQVlDLFdBQVosSUFBMkIsS0FBS0QsTUFBTCxDQUFZQyxXQUFaLENBQXdCLENBQXhCLENBQS9CLEVBQTJEO1lBQ3JEQyxRQUFRLEtBQUtGLE1BQUwsQ0FBWUMsV0FBWixDQUF3QixDQUF4QixDQUFaO1lBQ01FLEdBRm1ELEdBRXRDRCxLQUZzQyxDQUVuREMsR0FGbUQ7WUFFOUNDLEdBRjhDLEdBRXRDRixLQUZzQyxDQUU5Q0UsR0FGOEM7O1lBR3JERCxPQUFPLEtBQVAsSUFBZ0JDLEdBQXBCLEVBQXlCO2dCQUNqQkEsR0FBTjs7OztVQUlBLENBQUMxTCxHQUFMLEVBQVU7O1VBRU4yTCxTQUFTLFNBQVRBLE1BQVMsR0FBTTtlQUNaeEQsR0FBTCxDQUFTdkUsU0FBVCxDQUFtQjVELEdBQW5CLEVBQXdCLENBQXhCLEVBQTJCLENBQTNCLEVBQThCLE9BQUtpSixXQUFuQyxFQUFnRCxPQUFLb0MsWUFBckQ7T0FERjs7VUFJSXZFLEVBQUU4RSxXQUFGLENBQWM1TCxHQUFkLENBQUosRUFBd0I7O09BQXhCLE1BRU87WUFDRDZMLE1BQUosR0FBYUYsTUFBYjs7S0E5T0c7dUJBQUEsaUNBa1BnQjtVQUNqQnhELE1BQU0sS0FBS0EsR0FBZjtVQUNJMkQsWUFBSixHQUFtQixRQUFuQjtVQUNJQyxTQUFKLEdBQWdCLFFBQWhCO1VBQ0lDLGtCQUFrQixLQUFLL0MsV0FBTCxHQUFtQjNELDBCQUFuQixHQUFnRCxLQUFLaUcsV0FBTCxDQUFpQmhMLE1BQXZGO1VBQ0kwTCxXQUFZLENBQUMsS0FBS0MsMkJBQU4sSUFBcUMsS0FBS0EsMkJBQUwsSUFBb0MsQ0FBMUUsR0FBK0VGLGVBQS9FLEdBQWlHLEtBQUtFLDJCQUFySDtVQUNJQyxJQUFKLEdBQVdGLFdBQVcsZUFBdEI7VUFDSUcsU0FBSixHQUFpQixDQUFDLEtBQUtDLGdCQUFOLElBQTBCLEtBQUtBLGdCQUFMLElBQXlCLFNBQXBELEdBQWlFLFNBQWpFLEdBQTZFLEtBQUtBLGdCQUFsRztVQUNJQyxRQUFKLENBQWEsS0FBS2YsV0FBbEIsRUFBK0IsS0FBS3RDLFdBQUwsR0FBbUIsQ0FBbEQsRUFBcUQsS0FBS29DLFlBQUwsR0FBb0IsQ0FBekU7S0ExUEs7b0JBQUEsOEJBNlBhO1dBQ2JrQixnQkFBTDtXQUNLQyxvQkFBTDtXQUNLQyxtQkFBTDtLQWhRSztlQUFBLHlCQW1RUTs7O1VBQ1QxSSxZQUFKO1VBQVMvRCxZQUFUO1VBQ0ksS0FBS3NMLE1BQUwsQ0FBWW9CLE9BQVosSUFBdUIsS0FBS3BCLE1BQUwsQ0FBWW9CLE9BQVosQ0FBb0IsQ0FBcEIsQ0FBM0IsRUFBbUQ7WUFDN0NsQixRQUFRLEtBQUtGLE1BQUwsQ0FBWW9CLE9BQVosQ0FBb0IsQ0FBcEIsQ0FBWjtZQUNNakIsR0FGMkMsR0FFOUJELEtBRjhCLENBRTNDQyxHQUYyQztZQUV0Q0MsR0FGc0MsR0FFOUJGLEtBRjhCLENBRXRDRSxHQUZzQzs7WUFHN0NELE9BQU8sS0FBUCxJQUFnQkMsR0FBcEIsRUFBeUI7Z0JBQ2pCQSxHQUFOOzs7VUFHQSxLQUFLaUIsWUFBTCxJQUFxQixPQUFPLEtBQUtBLFlBQVosS0FBNkIsUUFBdEQsRUFBZ0U7Y0FDeEQsS0FBS0EsWUFBWDtjQUNNLElBQUk3SSxLQUFKLEVBQU47WUFDSSxDQUFDLFNBQVNtQixJQUFULENBQWNsQixHQUFkLENBQUQsSUFBdUIsQ0FBQyxTQUFTa0IsSUFBVCxDQUFjbEIsR0FBZCxDQUE1QixFQUFnRDtjQUMxQzZJLFlBQUosQ0FBaUIsYUFBakIsRUFBZ0MsV0FBaEM7O1lBRUU3SSxHQUFKLEdBQVVBLEdBQVY7T0FORixNQU9PLElBQUk4SSxRQUFPLEtBQUtGLFlBQVosTUFBNkIsUUFBN0IsSUFBeUMsS0FBS0EsWUFBTCxZQUE2QjdJLEtBQTFFLEVBQWlGO2NBQ2hGLEtBQUs2SSxZQUFYOztVQUVFLENBQUM1SSxHQUFELElBQVEsQ0FBQy9ELEdBQWIsRUFBa0I7YUFDWHlHLGdCQUFMOzs7V0FHR3FHLGdCQUFMLEdBQXdCLElBQXhCO1VBQ0loRyxFQUFFOEUsV0FBRixDQUFjNUwsR0FBZCxDQUFKLEVBQXdCOzthQUVqQitNLE9BQUwsQ0FBYS9NLEdBQWIsRUFBa0IsQ0FBQ0EsSUFBSWdOLE9BQUosQ0FBWSxpQkFBWixDQUFuQixFQUFtRCxJQUFuRDtPQUZGLE1BR087YUFDQW5DLE9BQUwsR0FBZSxJQUFmO1lBQ0lnQixNQUFKLEdBQWEsWUFBTTs7aUJBRVprQixPQUFMLENBQWEvTSxHQUFiLEVBQWtCLENBQUNBLElBQUlnTixPQUFKLENBQVksaUJBQVosQ0FBbkIsRUFBbUQsSUFBbkQ7U0FGRjs7WUFLSUMsT0FBSixHQUFjLFlBQU07aUJBQ2J4RyxnQkFBTDtTQURGOztLQXJTRztXQUFBLG1CQTJTRXpHLEdBM1NGLEVBMlNpQztVQUExQnlELFdBQTBCLHVFQUFaLENBQVk7VUFBVGlKLE9BQVM7O1dBQ2pDOUIsYUFBTCxHQUFxQjVLLEdBQXJCO1dBQ0tBLEdBQUwsR0FBV0EsR0FBWDs7VUFFSW1FLE1BQU1WLFdBQU4sQ0FBSixFQUF3QjtzQkFDUixDQUFkOzs7V0FHRytGLGVBQUwsQ0FBcUIvRixXQUFyQjs7VUFFSWlKLE9BQUosRUFBYTthQUNOM0UsS0FBTCxDQUFXdEMsT0FBT3lILDBCQUFsQjs7S0F0VEc7Z0JBQUEsMEJBMFRTO1VBQ1YsQ0FBQyxLQUFLckYsUUFBTCxFQUFELElBQW9CLENBQUMsS0FBS3NGLG9CQUExQixJQUFrRCxDQUFDLEtBQUs5RCxRQUF4RCxJQUFvRSxDQUFDLEtBQUsrRCxZQUE5RSxFQUE0RjthQUNyRkMsVUFBTDs7S0E1VEc7c0JBQUEsZ0NBZ1VlO1VBQ2hCQyxRQUFRLEtBQUtsRixLQUFMLENBQVdDLFNBQXZCO1VBQ0ksQ0FBQ2lGLE1BQU1oRixLQUFOLENBQVkvSCxNQUFqQixFQUF5Qjs7VUFFckJnTixPQUFPRCxNQUFNaEYsS0FBTixDQUFZLENBQVosQ0FBWDtXQUNLa0YsWUFBTCxDQUFrQkQsSUFBbEI7S0FyVUs7Z0JBQUEsd0JBd1VPQSxJQXhVUCxFQXdVYTs7O1dBQ2JULGdCQUFMLEdBQXdCLEtBQXhCO1dBQ0tqQyxPQUFMLEdBQWUsSUFBZjtXQUNLOUMsS0FBTCxDQUFXdEMsT0FBT2dJLGlCQUFsQixFQUFxQ0YsSUFBckM7VUFDSSxDQUFDLEtBQUtHLGdCQUFMLENBQXNCSCxJQUF0QixDQUFMLEVBQWtDO2FBQzNCMUMsT0FBTCxHQUFlLEtBQWY7YUFDSzlDLEtBQUwsQ0FBV3RDLE9BQU9rSSxzQkFBbEIsRUFBMENKLElBQTFDO2NBQ00sSUFBSUssS0FBSixDQUFVLHNDQUFzQyxLQUFLQyxhQUEzQyxHQUEyRCxTQUFyRSxDQUFOOztVQUVFLENBQUMsS0FBS0MsZ0JBQUwsQ0FBc0JQLElBQXRCLENBQUwsRUFBa0M7YUFDM0IxQyxPQUFMLEdBQWUsS0FBZjthQUNLOUMsS0FBTCxDQUFXdEMsT0FBT3NJLHdCQUFsQixFQUE0Q1IsSUFBNUM7WUFDSXpMLE9BQU95TCxLQUFLekwsSUFBTCxJQUFheUwsS0FBS1MsSUFBTCxDQUFVQyxXQUFWLEdBQXdCaE0sS0FBeEIsQ0FBOEIsR0FBOUIsRUFBbUNpTSxHQUFuQyxFQUF4QjtjQUNNLElBQUlOLEtBQUosaUJBQXdCOUwsSUFBeEIsNkNBQW9FLEtBQUtxTSxNQUF6RSxRQUFOOztVQUVFLE9BQU8vTixPQUFPb0ssVUFBZCxLQUE2QixXQUFqQyxFQUE4QztZQUN4QzRELEtBQUssSUFBSTVELFVBQUosRUFBVDtXQUNHcUIsTUFBSCxHQUFZLFVBQUN3QyxDQUFELEVBQU87Y0FDYkMsV0FBV0QsRUFBRUUsTUFBRixDQUFTQyxNQUF4QjtjQUNJL0ssY0FBYyxDQUFsQjtjQUNJOzBCQUNZcUQsRUFBRTJILGtCQUFGLENBQXFCM0gsRUFBRTRILG1CQUFGLENBQXNCSixRQUF0QixDQUFyQixDQUFkO1dBREYsQ0FFRSxPQUFPbEUsR0FBUCxFQUFZO2NBQ1YzRyxjQUFjLENBQWxCLEVBQXFCQSxjQUFjLENBQWQ7Y0FDakJ6RCxNQUFNLElBQUk4RCxLQUFKLEVBQVY7Y0FDSUMsR0FBSixHQUFVdUssUUFBVjtjQUNJekMsTUFBSixHQUFhLFlBQU07bUJBQ1prQixPQUFMLENBQWEvTSxHQUFiLEVBQWtCeUQsV0FBbEI7bUJBQ0tzRSxLQUFMLENBQVd0QyxPQUFPa0osU0FBbEI7V0FGRjtTQVRGO1dBY0dDLGFBQUgsQ0FBaUJyQixJQUFqQjs7S0F2V0c7b0JBQUEsNEJBMldXQSxJQTNXWCxFQTJXaUI7VUFDbEIsQ0FBQ0EsSUFBTCxFQUFXLE9BQU8sS0FBUDtVQUNQLENBQUMsS0FBS00sYUFBTixJQUF1QixLQUFLQSxhQUFMLElBQXNCLENBQWpELEVBQW9ELE9BQU8sSUFBUDs7YUFFN0NOLEtBQUtzQixJQUFMLEdBQVksS0FBS2hCLGFBQXhCO0tBL1dLO29CQUFBLDRCQWtYV04sSUFsWFgsRUFrWGlCO1VBQ2xCLENBQUMsS0FBS3VCLE9BQVYsRUFBbUIsT0FBTyxJQUFQO1VBQ2ZYLFNBQVMsS0FBS0EsTUFBbEI7VUFDSVksZUFBZVosT0FBTzlLLE9BQVAsQ0FBZSxPQUFmLEVBQXdCLEVBQXhCLENBQW5CO1VBQ0laLFFBQVEwTCxPQUFPbE0sS0FBUCxDQUFhLEdBQWIsQ0FBWjtXQUNLLElBQUlFLElBQUksQ0FBUixFQUFXVCxNQUFNZSxNQUFNbEMsTUFBNUIsRUFBb0M0QixJQUFJVCxHQUF4QyxFQUE2Q1MsR0FBN0MsRUFBa0Q7WUFDNUNMLE9BQU9XLE1BQU1OLENBQU4sQ0FBWDtZQUNJNk0sSUFBSWxOLEtBQUttTixJQUFMLEVBQVI7WUFDSUQsRUFBRUUsTUFBRixDQUFTLENBQVQsS0FBZSxHQUFuQixFQUF3QjtjQUNsQjNCLEtBQUtTLElBQUwsQ0FBVUMsV0FBVixHQUF3QmhNLEtBQXhCLENBQThCLEdBQTlCLEVBQW1DaU0sR0FBbkMsT0FBNkNjLEVBQUVmLFdBQUYsR0FBZ0JrQixLQUFoQixDQUFzQixDQUF0QixDQUFqRCxFQUEyRSxPQUFPLElBQVA7U0FEN0UsTUFFTyxJQUFJLFFBQVFsSyxJQUFSLENBQWErSixDQUFiLENBQUosRUFBcUI7Y0FDdEJJLGVBQWU3QixLQUFLekwsSUFBTCxDQUFVdUIsT0FBVixDQUFrQixPQUFsQixFQUEyQixFQUEzQixDQUFuQjtjQUNJK0wsaUJBQWlCTCxZQUFyQixFQUFtQzttQkFDMUIsSUFBUDs7U0FIRyxNQUtBLElBQUl4QixLQUFLekwsSUFBTCxLQUFjQSxJQUFsQixFQUF3QjtpQkFDdEIsSUFBUDs7OzthQUlHLEtBQVA7S0F0WUs7ZUFBQSx1QkF5WU11TixhQXpZTixFQXlZcUI7VUFDdEIsQ0FBQyxLQUFLclAsR0FBVixFQUFlO1VBQ1hrSCxVQUFVLEtBQUtBLE9BQW5COztXQUVLaEgsWUFBTCxHQUFvQixLQUFLRixHQUFMLENBQVNFLFlBQTdCO1dBQ0s2RixhQUFMLEdBQXFCLEtBQUsvRixHQUFMLENBQVMrRixhQUE5Qjs7Y0FFUW9CLE1BQVIsR0FBaUJMLEVBQUVDLFdBQUYsQ0FBY0csUUFBUUMsTUFBdEIsSUFBZ0NELFFBQVFDLE1BQXhDLEdBQWlELENBQWxFO2NBQ1FDLE1BQVIsR0FBaUJOLEVBQUVDLFdBQUYsQ0FBY0csUUFBUUUsTUFBdEIsSUFBZ0NGLFFBQVFFLE1BQXhDLEdBQWlELENBQWxFOztVQUVJLEtBQUtDLGlCQUFULEVBQTRCO2FBQ3JCaUksV0FBTDtPQURGLE1BRU8sSUFBSSxDQUFDLEtBQUszSSxRQUFWLEVBQW9CO1lBQ3JCLEtBQUs0SSxXQUFMLElBQW9CLFNBQXhCLEVBQW1DO2VBQzVCQyxVQUFMO1NBREYsTUFFTyxJQUFJLEtBQUtELFdBQUwsSUFBb0IsU0FBeEIsRUFBbUM7ZUFDbkNFLFlBQUw7U0FESyxNQUVBO2VBQ0FILFdBQUw7O09BTkcsTUFRQTthQUNBcEksT0FBTCxDQUFhdEIsS0FBYixHQUFxQixLQUFLMUYsWUFBTCxHQUFvQixLQUFLMEgsVUFBOUM7YUFDS1YsT0FBTCxDQUFhckIsTUFBYixHQUFzQixLQUFLRSxhQUFMLEdBQXFCLEtBQUs2QixVQUFoRDs7O1VBR0UsQ0FBQyxLQUFLakIsUUFBVixFQUFvQjtZQUNkLE1BQU0xQixJQUFOLENBQVcsS0FBS3lLLGVBQWhCLENBQUosRUFBc0M7a0JBQzVCdEksTUFBUixHQUFpQixDQUFqQjtTQURGLE1BRU8sSUFBSSxTQUFTbkMsSUFBVCxDQUFjLEtBQUt5SyxlQUFuQixDQUFKLEVBQXlDO2tCQUN0Q3RJLE1BQVIsR0FBaUIsS0FBS2lFLFlBQUwsR0FBb0JuRSxRQUFRckIsTUFBN0M7OztZQUdFLE9BQU9aLElBQVAsQ0FBWSxLQUFLeUssZUFBakIsQ0FBSixFQUF1QztrQkFDN0J2SSxNQUFSLEdBQWlCLENBQWpCO1NBREYsTUFFTyxJQUFJLFFBQVFsQyxJQUFSLENBQWEsS0FBS3lLLGVBQWxCLENBQUosRUFBd0M7a0JBQ3JDdkksTUFBUixHQUFpQixLQUFLOEIsV0FBTCxHQUFtQi9CLFFBQVF0QixLQUE1Qzs7O1lBR0Usa0JBQWtCWCxJQUFsQixDQUF1QixLQUFLeUssZUFBNUIsQ0FBSixFQUFrRDtjQUM1Q2xCLFNBQVMsc0JBQXNCbUIsSUFBdEIsQ0FBMkIsS0FBS0QsZUFBaEMsQ0FBYjtjQUNJNVAsSUFBSSxDQUFDME8sT0FBTyxDQUFQLENBQUQsR0FBYSxHQUFyQjtjQUNJek8sSUFBSSxDQUFDeU8sT0FBTyxDQUFQLENBQUQsR0FBYSxHQUFyQjtrQkFDUXJILE1BQVIsR0FBaUJySCxLQUFLLEtBQUttSixXQUFMLEdBQW1CL0IsUUFBUXRCLEtBQWhDLENBQWpCO2tCQUNRd0IsTUFBUixHQUFpQnJILEtBQUssS0FBS3NMLFlBQUwsR0FBb0JuRSxRQUFRckIsTUFBakMsQ0FBakI7Ozs7dUJBSWEsS0FBSytKLGNBQUwsRUFBakI7O1VBRUlQLGlCQUFpQixLQUFLaEksaUJBQTFCLEVBQTZDO2FBQ3RDNkIsSUFBTCxDQUFVLEtBQVYsRUFBaUIsQ0FBakI7T0FERixNQUVPO2FBQ0FQLElBQUwsQ0FBVSxFQUFFN0ksR0FBRyxDQUFMLEVBQVFDLEdBQUcsQ0FBWCxFQUFWO2FBQ0syRyxLQUFMOztLQTliRztlQUFBLHlCQWtjUTtVQUNUbUosV0FBVyxLQUFLM1AsWUFBcEI7VUFDSTRQLFlBQVksS0FBSy9KLGFBQXJCO1VBQ0lnSyxjQUFjLEtBQUs5RyxXQUFMLEdBQW1CLEtBQUtvQyxZQUExQztVQUNJekQsbUJBQUo7O1VBRUksS0FBS29JLFdBQUwsR0FBbUJELFdBQXZCLEVBQW9DO3FCQUNyQkQsWUFBWSxLQUFLekUsWUFBOUI7YUFDS25FLE9BQUwsQ0FBYXRCLEtBQWIsR0FBcUJpSyxXQUFXakksVUFBaEM7YUFDS1YsT0FBTCxDQUFhckIsTUFBYixHQUFzQixLQUFLd0YsWUFBM0I7YUFDS25FLE9BQUwsQ0FBYUMsTUFBYixHQUFzQixFQUFFLEtBQUtELE9BQUwsQ0FBYXRCLEtBQWIsR0FBcUIsS0FBS3FELFdBQTVCLElBQTJDLENBQWpFO2FBQ0svQixPQUFMLENBQWFFLE1BQWIsR0FBc0IsQ0FBdEI7T0FMRixNQU1PO3FCQUNReUksV0FBVyxLQUFLNUcsV0FBN0I7YUFDSy9CLE9BQUwsQ0FBYXJCLE1BQWIsR0FBc0JpSyxZQUFZbEksVUFBbEM7YUFDS1YsT0FBTCxDQUFhdEIsS0FBYixHQUFxQixLQUFLcUQsV0FBMUI7YUFDSy9CLE9BQUwsQ0FBYUUsTUFBYixHQUFzQixFQUFFLEtBQUtGLE9BQUwsQ0FBYXJCLE1BQWIsR0FBc0IsS0FBS3dGLFlBQTdCLElBQTZDLENBQW5FO2FBQ0tuRSxPQUFMLENBQWFDLE1BQWIsR0FBc0IsQ0FBdEI7O0tBbmRHO2NBQUEsd0JBdWRPO1VBQ1IwSSxXQUFXLEtBQUszUCxZQUFwQjtVQUNJNFAsWUFBWSxLQUFLL0osYUFBckI7VUFDSWdLLGNBQWMsS0FBSzlHLFdBQUwsR0FBbUIsS0FBS29DLFlBQTFDO1VBQ0l6RCxtQkFBSjtVQUNJLEtBQUtvSSxXQUFMLEdBQW1CRCxXQUF2QixFQUFvQztxQkFDckJGLFdBQVcsS0FBSzVHLFdBQTdCO2FBQ0svQixPQUFMLENBQWFyQixNQUFiLEdBQXNCaUssWUFBWWxJLFVBQWxDO2FBQ0tWLE9BQUwsQ0FBYXRCLEtBQWIsR0FBcUIsS0FBS3FELFdBQTFCO2FBQ0svQixPQUFMLENBQWFFLE1BQWIsR0FBc0IsRUFBRSxLQUFLRixPQUFMLENBQWFyQixNQUFiLEdBQXNCLEtBQUt3RixZQUE3QixJQUE2QyxDQUFuRTtPQUpGLE1BS087cUJBQ1F5RSxZQUFZLEtBQUt6RSxZQUE5QjthQUNLbkUsT0FBTCxDQUFhdEIsS0FBYixHQUFxQmlLLFdBQVdqSSxVQUFoQzthQUNLVixPQUFMLENBQWFyQixNQUFiLEdBQXNCLEtBQUt3RixZQUEzQjthQUNLbkUsT0FBTCxDQUFhQyxNQUFiLEdBQXNCLEVBQUUsS0FBS0QsT0FBTCxDQUFhdEIsS0FBYixHQUFxQixLQUFLcUQsV0FBNUIsSUFBMkMsQ0FBakU7O0tBcmVHO2dCQUFBLDBCQXllUztVQUNWNEcsV0FBVyxLQUFLM1AsWUFBcEI7VUFDSTRQLFlBQVksS0FBSy9KLGFBQXJCO1dBQ0ttQixPQUFMLENBQWF0QixLQUFiLEdBQXFCaUssUUFBckI7V0FDSzNJLE9BQUwsQ0FBYXJCLE1BQWIsR0FBc0JpSyxTQUF0QjtXQUNLNUksT0FBTCxDQUFhQyxNQUFiLEdBQXNCLEVBQUUsS0FBS0QsT0FBTCxDQUFhdEIsS0FBYixHQUFxQixLQUFLcUQsV0FBNUIsSUFBMkMsQ0FBakU7V0FDSy9CLE9BQUwsQ0FBYUUsTUFBYixHQUFzQixFQUFFLEtBQUtGLE9BQUwsQ0FBYXJCLE1BQWIsR0FBc0IsS0FBS3dGLFlBQTdCLElBQTZDLENBQW5FO0tBL2VLO3VCQUFBLCtCQWtmY25NLEdBbGZkLEVBa2ZtQjtXQUNuQmtPLFlBQUwsR0FBb0IsSUFBcEI7V0FDSzZDLFlBQUwsR0FBb0IsS0FBcEI7VUFDSUMsZUFBZXBKLEVBQUVxSixnQkFBRixDQUFtQmpSLEdBQW5CLEVBQXdCLElBQXhCLENBQW5CO1dBQ0trUixpQkFBTCxHQUF5QkYsWUFBekI7O1VBRUksS0FBSzdHLFFBQVQsRUFBbUI7O1VBRWYsQ0FBQyxLQUFLeEIsUUFBTCxFQUFELElBQW9CLENBQUMsS0FBS3NGLG9CQUE5QixFQUFvRDthQUM3Q2tELFFBQUwsR0FBZ0IsSUFBSXpQLElBQUosR0FBVzBQLE9BQVgsRUFBaEI7Ozs7VUFJRXBSLElBQUlxUixLQUFKLElBQWFyUixJQUFJcVIsS0FBSixHQUFZLENBQTdCLEVBQWdDOztVQUU1QixDQUFDclIsSUFBSUUsT0FBTCxJQUFnQkYsSUFBSUUsT0FBSixDQUFZbUIsTUFBWixLQUF1QixDQUEzQyxFQUE4QzthQUN2Q2lRLFFBQUwsR0FBZ0IsSUFBaEI7YUFDS0MsUUFBTCxHQUFnQixLQUFoQjtZQUNJQyxRQUFRNUosRUFBRXFKLGdCQUFGLENBQW1CalIsR0FBbkIsRUFBd0IsSUFBeEIsQ0FBWjthQUNLeVIsZUFBTCxHQUF1QkQsS0FBdkI7OztVQUdFeFIsSUFBSUUsT0FBSixJQUFlRixJQUFJRSxPQUFKLENBQVltQixNQUFaLEtBQXVCLENBQXRDLElBQTJDLENBQUMsS0FBS3FRLGtCQUFyRCxFQUF5RTthQUNsRUosUUFBTCxHQUFnQixLQUFoQjthQUNLQyxRQUFMLEdBQWdCLElBQWhCO2FBQ0tJLGFBQUwsR0FBcUIvSixFQUFFZ0ssZ0JBQUYsQ0FBbUI1UixHQUFuQixFQUF3QixJQUF4QixDQUFyQjs7O1VBR0U2UixlQUFlLENBQUMsU0FBRCxFQUFZLFVBQVosRUFBd0IsYUFBeEIsRUFBdUMsWUFBdkMsRUFBcUQsZUFBckQsQ0FBbkI7V0FDSyxJQUFJNU8sSUFBSSxDQUFSLEVBQVdULE1BQU1xUCxhQUFheFEsTUFBbkMsRUFBMkM0QixJQUFJVCxHQUEvQyxFQUFvRFMsR0FBcEQsRUFBeUQ7WUFDbkRrTSxJQUFJMEMsYUFBYTVPLENBQWIsQ0FBUjtpQkFDUzZPLGdCQUFULENBQTBCM0MsQ0FBMUIsRUFBNkIsS0FBSzRDLGlCQUFsQzs7S0FqaEJHO3FCQUFBLDZCQXFoQlkvUixHQXJoQlosRUFxaEJpQjtVQUNsQmdTLHNCQUFzQixDQUExQjtVQUNJLEtBQUtkLGlCQUFULEVBQTRCO1lBQ3RCRixlQUFlcEosRUFBRXFKLGdCQUFGLENBQW1CalIsR0FBbkIsRUFBd0IsSUFBeEIsQ0FBbkI7OEJBQ3NCUyxLQUFLQyxJQUFMLENBQVVELEtBQUtFLEdBQUwsQ0FBU3FRLGFBQWFwUSxDQUFiLEdBQWlCLEtBQUtzUSxpQkFBTCxDQUF1QnRRLENBQWpELEVBQW9ELENBQXBELElBQXlESCxLQUFLRSxHQUFMLENBQVNxUSxhQUFhblEsQ0FBYixHQUFpQixLQUFLcVEsaUJBQUwsQ0FBdUJyUSxDQUFqRCxFQUFvRCxDQUFwRCxDQUFuRSxLQUE4SCxDQUFwSjs7VUFFRSxLQUFLc0osUUFBVCxFQUFtQjtVQUNmLENBQUMsS0FBS3hCLFFBQUwsRUFBRCxJQUFvQixDQUFDLEtBQUtzRixvQkFBOUIsRUFBb0Q7WUFDOUNnRSxTQUFTLElBQUl2USxJQUFKLEdBQVcwUCxPQUFYLEVBQWI7WUFDS1ksc0JBQXNCOUwsb0JBQXZCLElBQWdEK0wsU0FBUyxLQUFLZCxRQUFkLEdBQXlCbEwsZ0JBQXpFLElBQTZGLEtBQUtpSSxZQUF0RyxFQUFvSDtlQUM3R0MsVUFBTDs7YUFFR2dELFFBQUwsR0FBZ0IsQ0FBaEI7Ozs7V0FJR0csUUFBTCxHQUFnQixLQUFoQjtXQUNLQyxRQUFMLEdBQWdCLEtBQWhCO1dBQ0tJLGFBQUwsR0FBcUIsQ0FBckI7V0FDS0YsZUFBTCxHQUF1QixJQUF2QjtXQUNLVixZQUFMLEdBQW9CLEtBQXBCO1dBQ0tHLGlCQUFMLEdBQXlCLElBQXpCO0tBMWlCSztzQkFBQSw4QkE2aUJhbFIsR0E3aUJiLEVBNmlCa0I7V0FDbEIrUSxZQUFMLEdBQW9CLElBQXBCO1VBQ0ksQ0FBQyxLQUFLcEksUUFBTCxFQUFMLEVBQXNCO1VBQ2xCNkksUUFBUTVKLEVBQUVxSixnQkFBRixDQUFtQmpSLEdBQW5CLEVBQXdCLElBQXhCLENBQVo7V0FDSytILG1CQUFMLEdBQTJCeUosS0FBM0I7O1VBRUksS0FBS3JILFFBQUwsSUFBaUIsS0FBSytILGlCQUExQixFQUE2Qzs7VUFFekNDLGNBQUo7VUFDSSxDQUFDblMsSUFBSUUsT0FBTCxJQUFnQkYsSUFBSUUsT0FBSixDQUFZbUIsTUFBWixLQUF1QixDQUEzQyxFQUE4QztZQUN4QyxDQUFDLEtBQUtpUSxRQUFWLEVBQW9CO1lBQ2hCLEtBQUtHLGVBQVQsRUFBMEI7ZUFDbkJoSSxJQUFMLENBQVU7ZUFDTCtILE1BQU01USxDQUFOLEdBQVUsS0FBSzZRLGVBQUwsQ0FBcUI3USxDQUQxQjtlQUVMNFEsTUFBTTNRLENBQU4sR0FBVSxLQUFLNFEsZUFBTCxDQUFxQjVRO1dBRnBDOzthQUtHNFEsZUFBTCxHQUF1QkQsS0FBdkI7OztVQUdFeFIsSUFBSUUsT0FBSixJQUFlRixJQUFJRSxPQUFKLENBQVltQixNQUFaLEtBQXVCLENBQXRDLElBQTJDLENBQUMsS0FBS3FRLGtCQUFyRCxFQUF5RTtZQUNuRSxDQUFDLEtBQUtILFFBQVYsRUFBb0I7WUFDaEJhLFdBQVd4SyxFQUFFZ0ssZ0JBQUYsQ0FBbUI1UixHQUFuQixFQUF3QixJQUF4QixDQUFmO1lBQ0lxUyxRQUFRRCxXQUFXLEtBQUtULGFBQTVCO2FBQ0szSCxJQUFMLENBQVVxSSxRQUFRLENBQWxCLEVBQXFCaE0sa0JBQXJCO2FBQ0tzTCxhQUFMLEdBQXFCUyxRQUFyQjs7S0F0a0JHO3VCQUFBLGlDQTBrQmdCO1dBQ2hCckssbUJBQUwsR0FBMkIsSUFBM0I7S0Eza0JLO2dCQUFBLHdCQThrQk8vSCxHQTlrQlAsRUE4a0JZOzs7VUFDYixLQUFLbUssUUFBTCxJQUFpQixLQUFLbUksbUJBQXRCLElBQTZDLENBQUMsS0FBSzNKLFFBQUwsRUFBbEQsRUFBbUU7VUFDL0R3SixjQUFKO1dBQ0tJLFNBQUwsR0FBaUIsSUFBakI7VUFDSXZTLElBQUl3UyxVQUFKLEdBQWlCLENBQWpCLElBQXNCeFMsSUFBSXlTLE1BQUosR0FBYSxDQUFuQyxJQUF3Q3pTLElBQUkwUyxNQUFKLEdBQWEsQ0FBekQsRUFBNEQ7YUFDckQxSSxJQUFMLENBQVUsS0FBSzJJLG1CQUFmO09BREYsTUFFTyxJQUFJM1MsSUFBSXdTLFVBQUosR0FBaUIsQ0FBakIsSUFBc0J4UyxJQUFJeVMsTUFBSixHQUFhLENBQW5DLElBQXdDelMsSUFBSTBTLE1BQUosR0FBYSxDQUF6RCxFQUE0RDthQUM1RDFJLElBQUwsQ0FBVSxDQUFDLEtBQUsySSxtQkFBaEI7O1dBRUdwSSxTQUFMLENBQWUsWUFBTTtlQUNkZ0ksU0FBTCxHQUFpQixLQUFqQjtPQURGO0tBdmxCSztvQkFBQSw0QkE0bEJXdlMsR0E1bEJYLEVBNGxCZ0I7VUFDakIsS0FBS21LLFFBQUwsSUFBaUIsS0FBS3lJLGtCQUF0QixJQUE0QyxLQUFLakssUUFBTCxFQUE1QyxJQUErRCxDQUFDZixFQUFFaUwsWUFBRixDQUFlN1MsR0FBZixDQUFwRSxFQUF5RjtXQUNwRjhTLGVBQUwsR0FBdUIsSUFBdkI7S0E5bEJLO29CQUFBLDRCQWltQlc5UyxHQWptQlgsRUFpbUJnQjtVQUNqQixDQUFDLEtBQUs4UyxlQUFOLElBQXlCLENBQUNsTCxFQUFFaUwsWUFBRixDQUFlN1MsR0FBZixDQUE5QixFQUFtRDtXQUM5QzhTLGVBQUwsR0FBdUIsS0FBdkI7S0FubUJLO21CQUFBLDJCQXNtQlU5UyxHQXRtQlYsRUFzbUJlLEVBdG1CZjtlQUFBLHVCQXltQk1BLEdBem1CTixFQXltQlc7VUFDWixDQUFDLEtBQUs4UyxlQUFOLElBQXlCLENBQUNsTCxFQUFFaUwsWUFBRixDQUFlN1MsR0FBZixDQUE5QixFQUFtRDtXQUM5QzhTLGVBQUwsR0FBdUIsS0FBdkI7O1VBRUl6RSxhQUFKO1VBQ0lqTCxLQUFLcEQsSUFBSXFELFlBQWI7VUFDSSxDQUFDRCxFQUFMLEVBQVM7VUFDTEEsR0FBRzJQLEtBQVAsRUFBYzthQUNQLElBQUk5UCxJQUFJLENBQVIsRUFBV1QsTUFBTVksR0FBRzJQLEtBQUgsQ0FBUzFSLE1BQS9CLEVBQXVDNEIsSUFBSVQsR0FBM0MsRUFBZ0RTLEdBQWhELEVBQXFEO2NBQy9DK1AsT0FBTzVQLEdBQUcyUCxLQUFILENBQVM5UCxDQUFULENBQVg7Y0FDSStQLEtBQUtDLElBQUwsSUFBYSxNQUFqQixFQUF5QjttQkFDaEJELEtBQUtFLFNBQUwsRUFBUDs7OztPQUpOLE1BUU87ZUFDRTlQLEdBQUdnRyxLQUFILENBQVMsQ0FBVCxDQUFQOzs7VUFHRWlGLElBQUosRUFBVTthQUNIQyxZQUFMLENBQWtCRCxJQUFsQjs7S0E3bkJHOzhCQUFBLHdDQWlvQnVCO1VBQ3hCLEtBQUtyRyxPQUFMLENBQWFDLE1BQWIsR0FBc0IsQ0FBMUIsRUFBNkI7YUFDdEJELE9BQUwsQ0FBYUMsTUFBYixHQUFzQixDQUF0Qjs7VUFFRSxLQUFLRCxPQUFMLENBQWFFLE1BQWIsR0FBc0IsQ0FBMUIsRUFBNkI7YUFDdEJGLE9BQUwsQ0FBYUUsTUFBYixHQUFzQixDQUF0Qjs7VUFFRSxLQUFLNkIsV0FBTCxHQUFtQixLQUFLL0IsT0FBTCxDQUFhQyxNQUFoQyxHQUF5QyxLQUFLRCxPQUFMLENBQWF0QixLQUExRCxFQUFpRTthQUMxRHNCLE9BQUwsQ0FBYUMsTUFBYixHQUFzQixFQUFFLEtBQUtELE9BQUwsQ0FBYXRCLEtBQWIsR0FBcUIsS0FBS3FELFdBQTVCLENBQXRCOztVQUVFLEtBQUtvQyxZQUFMLEdBQW9CLEtBQUtuRSxPQUFMLENBQWFFLE1BQWpDLEdBQTBDLEtBQUtGLE9BQUwsQ0FBYXJCLE1BQTNELEVBQW1FO2FBQzVEcUIsT0FBTCxDQUFhRSxNQUFiLEdBQXNCLEVBQUUsS0FBS0YsT0FBTCxDQUFhckIsTUFBYixHQUFzQixLQUFLd0YsWUFBN0IsQ0FBdEI7O0tBNW9CRzsrQkFBQSx5Q0FncEJ3QjtVQUN6QixLQUFLbkUsT0FBTCxDQUFhdEIsS0FBYixHQUFxQixLQUFLcUQsV0FBOUIsRUFBMkM7YUFDcENyQixVQUFMLEdBQWtCLEtBQUtxQixXQUFMLEdBQW1CLEtBQUsvSSxZQUExQzs7O1VBR0UsS0FBS2dILE9BQUwsQ0FBYXJCLE1BQWIsR0FBc0IsS0FBS3dGLFlBQS9CLEVBQTZDO2FBQ3RDekQsVUFBTCxHQUFrQixLQUFLeUQsWUFBTCxHQUFvQixLQUFLdEYsYUFBM0M7O0tBdHBCRzttQkFBQSw2QkEwcEIwQzs7O1VBQWhDdEMsV0FBZ0MsdUVBQWxCLENBQWtCO1VBQWY0TCxhQUFlOztVQUMzQ2dELGNBQWNoRCxhQUFsQjtVQUNJNUwsY0FBYyxDQUFkLElBQW1CNE8sV0FBdkIsRUFBb0M7WUFDOUIsQ0FBQyxLQUFLclMsR0FBVixFQUFlO2FBQ1Z5SCxRQUFMLEdBQWdCLElBQWhCO1lBQ0k1RCxPQUFPaUQsRUFBRXdMLGVBQUYsQ0FBa0JELGNBQWMsS0FBS3pILGFBQW5CLEdBQW1DLEtBQUs1SyxHQUExRCxFQUErRHlELFdBQS9ELENBQVg7YUFDS29JLE1BQUwsR0FBYyxZQUFNO2lCQUNiN0wsR0FBTCxHQUFXNkQsSUFBWDtpQkFDSytDLFdBQUwsQ0FBaUJ5SSxhQUFqQjtTQUZGO09BSkYsTUFRTzthQUNBekksV0FBTCxDQUFpQnlJLGFBQWpCOzs7VUFHRTVMLGVBQWUsQ0FBbkIsRUFBc0I7O2FBRWZBLFdBQUwsR0FBbUJxRCxFQUFFeUwsS0FBRixDQUFRLEtBQUs5TyxXQUFiLENBQW5CO09BRkYsTUFHTyxJQUFJQSxlQUFlLENBQW5CLEVBQXNCOzthQUV0QkEsV0FBTCxHQUFtQnFELEVBQUUwTCxLQUFGLENBQVEsS0FBSy9PLFdBQWIsQ0FBbkI7T0FGSyxNQUdBLElBQUlBLGVBQWUsQ0FBbkIsRUFBc0I7O2FBRXRCQSxXQUFMLEdBQW1CcUQsRUFBRTJMLFFBQUYsQ0FBVyxLQUFLaFAsV0FBaEIsQ0FBbkI7T0FGSyxNQUdBLElBQUlBLGVBQWUsQ0FBbkIsRUFBc0I7O2FBRXRCQSxXQUFMLEdBQW1CcUQsRUFBRTJMLFFBQUYsQ0FBVzNMLEVBQUUyTCxRQUFGLENBQVcsS0FBS2hQLFdBQWhCLENBQVgsQ0FBbkI7T0FGSyxNQUdBLElBQUlBLGVBQWUsQ0FBbkIsRUFBc0I7O2FBRXRCQSxXQUFMLEdBQW1CcUQsRUFBRTJMLFFBQUYsQ0FBVzNMLEVBQUUyTCxRQUFGLENBQVczTCxFQUFFMkwsUUFBRixDQUFXLEtBQUtoUCxXQUFoQixDQUFYLENBQVgsQ0FBbkI7T0FGSyxNQUdBO2FBQ0FBLFdBQUwsR0FBbUJBLFdBQW5COzs7VUFHRTRPLFdBQUosRUFBaUI7YUFDVjVPLFdBQUwsR0FBbUJBLFdBQW5COztLQTVyQkc7b0JBQUEsOEJBZ3NCYTtVQUNkd0gsa0JBQW1CLENBQUMsS0FBS0MsV0FBTixJQUFxQixLQUFLQSxXQUFMLElBQW9CLFNBQTFDLEdBQXVELGFBQXZELEdBQXVFLEtBQUtBLFdBQWxHO1dBQ0svQyxHQUFMLENBQVNpRSxTQUFULEdBQXFCbkIsZUFBckI7V0FDSzlDLEdBQUwsQ0FBU3VLLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsS0FBS3pKLFdBQTlCLEVBQTJDLEtBQUtvQyxZQUFoRDtXQUNLbEQsR0FBTCxDQUFTd0ssUUFBVCxDQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixLQUFLMUosV0FBN0IsRUFBMEMsS0FBS29DLFlBQS9DO0tBcHNCSztTQUFBLG1CQXVzQkU7OztXQUNGNUIsU0FBTCxDQUFlLFlBQU07WUFDZixDQUFDLE9BQUt6SixHQUFWLEVBQWU7WUFDWEksT0FBT0kscUJBQVgsRUFBa0M7Z0NBQ1YsT0FBS29TLFVBQTNCO1NBREYsTUFFTztpQkFDQUEsVUFBTDs7T0FMSjtLQXhzQks7Y0FBQSx3QkFrdEJPO1dBQ1AvSCxPQUFMLEdBQWUsS0FBZjtVQUNJMUMsTUFBTSxLQUFLQSxHQUFmO3NCQUN3QyxLQUFLakIsT0FIakM7VUFHTkMsTUFITSxhQUdOQSxNQUhNO1VBR0VDLE1BSEYsYUFHRUEsTUFIRjtVQUdVeEIsS0FIVixhQUdVQSxLQUhWO1VBR2lCQyxNQUhqQixhQUdpQkEsTUFIakI7OztXQUtQMEcsZ0JBQUw7VUFDSTNJLFNBQUosQ0FBYyxLQUFLNUQsR0FBbkIsRUFBd0JtSCxNQUF4QixFQUFnQ0MsTUFBaEMsRUFBd0N4QixLQUF4QyxFQUErQ0MsTUFBL0M7V0FDS2tDLEtBQUwsQ0FBV3RDLE9BQU9vTixJQUFsQixFQUF3QjFLLEdBQXhCO1VBQ0ksQ0FBQyxLQUFLeEIsUUFBVixFQUFvQjthQUNiQSxRQUFMLEdBQWdCLElBQWhCO2FBQ0tvQixLQUFMLENBQVd0QyxPQUFPcU4sZUFBbEI7O1dBRUdyTCxRQUFMLEdBQWdCLEtBQWhCO0tBOXRCSztrQkFBQSw0QkFpdUJXOzs7VUFDWixDQUFDLEtBQUtELFlBQVYsRUFBd0I7MEJBQ1EsS0FBS0EsWUFGckI7VUFFVkwsTUFGVSxpQkFFVkEsTUFGVTtVQUVGQyxNQUZFLGlCQUVGQSxNQUZFO1VBRU0yTCxLQUZOLGlCQUVNQSxLQUZOOzs7VUFJWmpNLEVBQUVDLFdBQUYsQ0FBY0ksTUFBZCxDQUFKLEVBQTJCO2FBQ3BCRCxPQUFMLENBQWFDLE1BQWIsR0FBc0JBLE1BQXRCOzs7VUFHRUwsRUFBRUMsV0FBRixDQUFjSyxNQUFkLENBQUosRUFBMkI7YUFDcEJGLE9BQUwsQ0FBYUUsTUFBYixHQUFzQkEsTUFBdEI7OztVQUdFTixFQUFFQyxXQUFGLENBQWNnTSxLQUFkLENBQUosRUFBMEI7YUFDbkJuTCxVQUFMLEdBQWtCbUwsS0FBbEI7OztXQUdHdEosU0FBTCxDQUFlLFlBQU07ZUFDZGpDLFlBQUwsR0FBb0IsSUFBcEI7T0FERjtLQWp2Qks7cUJBQUEsK0JBc3ZCYztVQUNmLENBQUMsS0FBS3hILEdBQVYsRUFBZTthQUNSaUcsV0FBTDtPQURGLE1BRU87WUFDRCxLQUFLb0IsaUJBQVQsRUFBNEI7ZUFDckJWLFFBQUwsR0FBZ0IsS0FBaEI7O2FBRUdvRSxRQUFMO2FBQ0tuRSxXQUFMOzs7O0NBbjZCUjs7QUM1RUE7Ozs7OztBQU1BLEFBRUEsSUFBSSxxQkFBcUIsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUM7QUFDekQsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7QUFDckQsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDOztBQUU3RCxTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUU7Q0FDdEIsSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7RUFDdEMsTUFBTSxJQUFJLFNBQVMsQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO0VBQzdFOztDQUVELE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ25COztBQUVELFNBQVMsZUFBZSxHQUFHO0NBQzFCLElBQUk7RUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtHQUNuQixPQUFPLEtBQUssQ0FBQztHQUNiOzs7OztFQUtELElBQUksS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzlCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7RUFDaEIsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO0dBQ2pELE9BQU8sS0FBSyxDQUFDO0dBQ2I7OztFQUdELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztFQUNmLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7R0FDNUIsS0FBSyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3hDO0VBQ0QsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtHQUMvRCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNoQixDQUFDLENBQUM7RUFDSCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssWUFBWSxFQUFFO0dBQ3JDLE9BQU8sS0FBSyxDQUFDO0dBQ2I7OztFQUdELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztFQUNmLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxNQUFNLEVBQUU7R0FDMUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztHQUN2QixDQUFDLENBQUM7RUFDSCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2hELHNCQUFzQixFQUFFO0dBQ3pCLE9BQU8sS0FBSyxDQUFDO0dBQ2I7O0VBRUQsT0FBTyxJQUFJLENBQUM7RUFDWixDQUFDLE9BQU8sR0FBRyxFQUFFOztFQUViLE9BQU8sS0FBSyxDQUFDO0VBQ2I7Q0FDRDs7QUFFRCxXQUFjLEdBQUcsZUFBZSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLE1BQU0sRUFBRSxNQUFNLEVBQUU7Q0FDOUUsSUFBSSxJQUFJLENBQUM7Q0FDVCxJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Q0FDMUIsSUFBSSxPQUFPLENBQUM7O0NBRVosS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7RUFDMUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7RUFFNUIsS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7R0FDckIsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTtJQUNuQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCO0dBQ0Q7O0VBRUQsSUFBSSxxQkFBcUIsRUFBRTtHQUMxQixPQUFPLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDdEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDeEMsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0tBQzVDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEM7SUFDRDtHQUNEO0VBQ0Q7O0NBRUQsT0FBTyxFQUFFLENBQUM7Q0FDVjs7QUN0RkQsSUFBTW9NLGlCQUFpQjtpQkFDTjtDQURqQjs7QUFJQSxJQUFNQyxZQUFZO1dBQ1AsaUJBQVVDLEdBQVYsRUFBZUMsT0FBZixFQUF3QjtjQUNyQkMsUUFBTyxFQUFQLEVBQVdKLGNBQVgsRUFBMkJHLE9BQTNCLENBQVY7UUFDSUUsVUFBVWpQLE9BQU84TyxJQUFJRyxPQUFKLENBQVlwUixLQUFaLENBQWtCLEdBQWxCLEVBQXVCLENBQXZCLENBQVAsQ0FBZDtRQUNJb1IsVUFBVSxDQUFkLEVBQWlCO1lBQ1QsSUFBSXpGLEtBQUosdUVBQThFeUYsT0FBOUUsb0RBQU47O1FBRUVDLGdCQUFnQkgsUUFBUUcsYUFBUixJQUF5QixRQUE3Qzs7O1FBR0lDLFNBQUosQ0FBY0QsYUFBZCxFQUE2QkMsU0FBN0I7R0FWYzs7O0NBQWxCOzs7Ozs7OzsifQ==
