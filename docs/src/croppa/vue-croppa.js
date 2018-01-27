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
  passive: Boolean,
  imageBorderRadius: {
    type: [Number, String],
    default: 0
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
    imageBorderRadius: function imageBorderRadius() {
      if (this.img) {
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

      if (!this.userMetadata && this.imageSet && !this.rotating) {
        var offsetX = (x - 1) * (pos.x - this.imgData.startX);
        var offsetY = (x - 1) * (pos.y - this.imgData.startY);
        this.imgData.startX = this.imgData.startX - offsetX;
        this.imgData.startY = this.imgData.startY - offsetY;
      }

      if (this.preventWhiteSpace) {
        this._preventZoomingToWhiteSpace();
        this._preventMovingToWhiteSpace();
      }
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
    addClipPlugin: function addClipPlugin(plugin) {
      if (!this.clipPlugins) {
        this.clipPlugins = [];
      }
      if (typeof plugin === 'function' && this.clipPlugins.indexOf(plugin) < 0) {
        this.clipPlugins.push(plugin);
      } else {
        throw Error('Clip plugins should be functions');
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
        throw new Error('File type (' + type + ') mimatches (' + this.accept + ').');
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
      if (!this.accept) return true;
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

      if (this.preventWhiteSpace) {
        this._clip(this._createContainerClipPath
        // this._clip(this._createImageClipPath)
        );
      }

      this.$emit(events.DRAW, ctx);
      if (!this.imageSet) {
        this.imageSet = true;
        this.$emit(events.NEW_IMAGE_DRAWN);
      }
      this.rotating = false;
    },
    _clipPathFactory: function _clipPathFactory(x, y, width, height) {
      var ctx = this.ctx;
      var radius = typeof this.imageBorderRadius === 'number' ? this.imageBorderRadius : !isNaN(Number(this.imageBorderRadius)) ? Number(this.imageBorderRadius) : 0;
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
    _createContainerClipPath: function _createContainerClipPath() {
      var _this9 = this;

      this._clipPathFactory(0, 0, this.outputWidth, this.outputHeight);
      if (this.clipPlugins && this.clipPlugins.length) {
        this.clipPlugins.forEach(function (func) {
          func(_this9.ctx, 0, 0, _this9.outputWidth, _this9.outputHeight);
        });
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

    _clip: function _clip(createPath) {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.globalCompositeOperation = 'destination-in';
      createPath();
      ctx.fill();
      ctx.restore();
    },
    _applyMetadata: function _applyMetadata() {
      var _this10 = this;

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
        _this10.userMetadata = null;
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

    console.log(component

    // registration
    );Vue.component(componentName, component);
  },

  component: component
};

return VueCroppa;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgYmFzZTY0ID0gYmFzZTY0LnJlcGxhY2UoL15kYXRhOihbXjtdKyk7YmFzZTY0LC9nbWksICcnKVxyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9XHJcbiAgTnVtYmVyLmlzSW50ZWdlciB8fFxyXG4gIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJlxyXG4gICAgICBpc0Zpbml0ZSh2YWx1ZSkgJiZcclxuICAgICAgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXHJcbiAgICApXHJcbiAgfVxyXG5cclxudmFyIGluaXRpYWxJbWFnZVR5cGUgPSBTdHJpbmdcclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5JbWFnZSkge1xyXG4gIGluaXRpYWxJbWFnZVR5cGUgPSBbU3RyaW5nLCBJbWFnZV1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcclxuICB9LFxyXG4gIHF1YWxpdHk6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiBTdHJpbmcsXHJcbiAgZmlsZVNpemVMaW1pdDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnQW5kRHJvcDogQm9vbGVhbixcclxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ1RvTW92ZTogQm9vbGVhbixcclxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIGRpc2FibGVQaW5jaFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUm90YXRpb246IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9LFxyXG4gIGluaXRpYWxJbWFnZTogaW5pdGlhbEltYWdlVHlwZSxcclxuICBpbml0aWFsU2l6ZToge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ2NvdmVyJyxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID09PSAnY292ZXInIHx8IHZhbCA9PT0gJ2NvbnRhaW4nIHx8IHZhbCA9PT0gJ25hdHVyYWwnXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbml0aWFsUG9zaXRpb246IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdjZW50ZXInLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHZhciB2YWxpZHMgPSBbJ2NlbnRlcicsICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHZhbC5zcGxpdCgnICcpLmV2ZXJ5KHdvcmQgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHZhbGlkcy5pbmRleE9mKHdvcmQpID49IDBcclxuICAgICAgICB9KSB8fCAvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodmFsKVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbnB1dEF0dHJzOiBPYmplY3QsXHJcbiAgc2hvd0xvYWRpbmc6IEJvb2xlYW4sXHJcbiAgbG9hZGluZ1NpemU6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwXHJcbiAgfSxcclxuICBsb2FkaW5nQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICcjNjA2MDYwJ1xyXG4gIH0sXHJcbiAgcmVwbGFjZURyb3A6IEJvb2xlYW4sXHJcbiAgcGFzc2l2ZTogQm9vbGVhbixcclxuICBpbWFnZUJvcmRlclJhZGl1czoge1xyXG4gICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgIGRlZmF1bHQ6IDBcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBJTklUX0VWRU5UOiAnaW5pdCcsXG4gIEZJTEVfQ0hPT1NFX0VWRU5UOiAnZmlsZS1jaG9vc2UnLFxuICBGSUxFX1NJWkVfRVhDRUVEX0VWRU5UOiAnZmlsZS1zaXplLWV4Y2VlZCcsXG4gIEZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVDogJ2ZpbGUtdHlwZS1taXNtYXRjaCcsXG4gIE5FV19JTUFHRTogJ25ldy1pbWFnZScsXG4gIE5FV19JTUFHRV9EUkFXTjogJ25ldy1pbWFnZS1kcmF3bicsXG4gIElNQUdFX1JFTU9WRV9FVkVOVDogJ2ltYWdlLXJlbW92ZScsXG4gIE1PVkVfRVZFTlQ6ICdtb3ZlJyxcbiAgWk9PTV9FVkVOVDogJ3pvb20nLFxuICBEUkFXOiAnZHJhdycsXG4gIElOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UOiAnaW5pdGlhbC1pbWFnZS1sb2FkZWQnLFxuICBMT0FESU5HX1NUQVJUOiAnbG9hZGluZy1zdGFydCcsXG4gIExPQURJTkdfRU5EOiAnbG9hZGluZy1lbmQnXG59XG4iLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiByZWY9XCJ3cmFwcGVyXCJcclxuICAgIDpjbGFzcz1cImBjcm9wcGEtY29udGFpbmVyICR7aW1nID8gJ2Nyb3BwYS0taGFzLXRhcmdldCcgOiAnJ30gJHtwYXNzaXZlID8gJ2Nyb3BwYS0tcGFzc2l2ZScgOiAnJ30gJHtkaXNhYmxlZCA/ICdjcm9wcGEtLWRpc2FibGVkJyA6ICcnfSAke2Rpc2FibGVDbGlja1RvQ2hvb3NlID8gJ2Nyb3BwYS0tZGlzYWJsZWQtY2MnIDogJyd9ICR7ZGlzYWJsZURyYWdUb01vdmUgJiYgZGlzYWJsZVNjcm9sbFRvWm9vbSA/ICdjcm9wcGEtLWRpc2FibGVkLW16JyA6ICcnfSAke2ZpbGVEcmFnZ2VkT3ZlciA/ICdjcm9wcGEtLWRyb3B6b25lJyA6ICcnfWBcIlxyXG4gICAgQGRyYWdlbnRlci5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJhZ0VudGVyXCJcclxuICAgIEBkcmFnbGVhdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdMZWF2ZVwiXHJcbiAgICBAZHJhZ292ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdPdmVyXCJcclxuICAgIEBkcm9wLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcm9wXCI+XHJcbiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIlxyXG4gICAgICA6YWNjZXB0PVwiYWNjZXB0XCJcclxuICAgICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxyXG4gICAgICB2LWJpbmQ9XCJpbnB1dEF0dHJzXCJcclxuICAgICAgcmVmPVwiZmlsZUlucHV0XCJcclxuICAgICAgQGNoYW5nZT1cIl9oYW5kbGVJbnB1dENoYW5nZVwiXHJcbiAgICAgIHN0eWxlPVwiaGVpZ2h0OjFweDt3aWR0aDoxcHg7b3ZlcmZsb3c6aGlkZGVuO21hcmdpbi1sZWZ0Oi05OTk5OXB4O3Bvc2l0aW9uOmFic29sdXRlO1wiIC8+XHJcbiAgICA8ZGl2IGNsYXNzPVwic2xvdHNcIlxyXG4gICAgICBzdHlsZT1cIndpZHRoOiAwOyBoZWlnaHQ6IDA7IHZpc2liaWxpdHk6IGhpZGRlbjtcIj5cclxuICAgICAgPHNsb3QgbmFtZT1cImluaXRpYWxcIj48L3Nsb3Q+XHJcbiAgICAgIDxzbG90IG5hbWU9XCJwbGFjZWhvbGRlclwiPjwvc2xvdD5cclxuICAgIDwvZGl2PlxyXG4gICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIlxyXG4gICAgICBAY2xpY2suc3RvcC5wcmV2ZW50PVwiX2hhbmRsZUNsaWNrXCJcclxuICAgICAgQHRvdWNoc3RhcnQuc3RvcD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICBAbW91c2Vkb3duLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICBAcG9pbnRlcnN0YXJ0LnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICBAdG91Y2hjYW5jZWwuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICBAbW91c2V1cC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgQHBvaW50ZXJjYW5jZWwuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICBAdG91Y2htb3ZlLnN0b3A9XCJfaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICBAbW91c2Vtb3ZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgIEBwb2ludGVybW92ZS5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICBAcG9pbnRlcmxlYXZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyTGVhdmVcIlxyXG4gICAgICBARE9NTW91c2VTY3JvbGwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXHJcbiAgICAgIEB3aGVlbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCJcclxuICAgICAgQG1vdXNld2hlZWwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiPjwvY2FudmFzPlxyXG4gICAgPHN2ZyBjbGFzcz1cImljb24gaWNvbi1yZW1vdmVcIlxyXG4gICAgICB2LWlmPVwic2hvd1JlbW92ZUJ1dHRvbiAmJiBpbWcgJiYgIXBhc3NpdmVcIlxyXG4gICAgICBAY2xpY2s9XCJyZW1vdmVcIlxyXG4gICAgICA6c3R5bGU9XCJgdG9wOiAtJHtoZWlnaHQvNDB9cHg7IHJpZ2h0OiAtJHt3aWR0aC80MH1weGBcIlxyXG4gICAgICB2aWV3Qm94PVwiMCAwIDEwMjQgMTAyNFwiXHJcbiAgICAgIHZlcnNpb249XCIxLjFcIlxyXG4gICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcclxuICAgICAgOndpZHRoPVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aC8xMFwiXHJcbiAgICAgIDpoZWlnaHQ9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCI+XHJcbiAgICAgIDxwYXRoIGQ9XCJNNTExLjkyMTIzMSAwQzIyOS4xNzkwNzcgMCAwIDIyOS4yNTc4NDYgMCA1MTIgMCA3OTQuNzAyNzY5IDIyOS4xNzkwNzcgMTAyNCA1MTEuOTIxMjMxIDEwMjQgNzk0Ljc4MTUzOCAxMDI0IDEwMjQgNzk0LjcwMjc2OSAxMDI0IDUxMiAxMDI0IDIyOS4yNTc4NDYgNzk0Ljc4MTUzOCAwIDUxMS45MjEyMzEgMFpNNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDY1MC41MTU2OTIgNzMyLjA4MTIzMUM2NTAuNTE1NjkyIDczMi4wODEyMzEgNTIxLjQ5MTY5MiA1OTMuNjgzNjkyIDUxMS44ODE4NDYgNTkzLjY4MzY5MiA1MDIuNDI5NTM4IDU5My42ODM2OTIgMzczLjM2NjE1NCA3MzIuMDgxMjMxIDM3My4zNjYxNTQgNzMyLjA4MTIzMUwyOTEuNzYxMjMxIDY1MC42MzM4NDZDMjkxLjc2MTIzMSA2NTAuNjMzODQ2IDQzMC4zMTYzMDggNTIzLjUwMDMwOCA0MzAuMzE2MzA4IDUxMi4xOTY5MjMgNDMwLjMxNjMwOCA1MDAuNjk2NjE1IDI5MS43NjEyMzEgMzczLjUyMzY5MiAyOTEuNzYxMjMxIDM3My41MjM2OTJMMzczLjM2NjE1NCAyOTEuOTE4NzY5QzM3My4zNjYxNTQgMjkxLjkxODc2OSA1MDMuNDUzNTM4IDQzMC4zOTUwNzcgNTExLjg4MTg0NiA0MzAuMzk1MDc3IDUyMC4zNDk1MzggNDMwLjM5NTA3NyA2NTAuNTE1NjkyIDI5MS45MTg3NjkgNjUwLjUxNTY5MiAyOTEuOTE4NzY5TDczMi4wNDE4NDYgMzczLjUyMzY5MkM3MzIuMDQxODQ2IDM3My41MjM2OTIgNTkzLjQ0NzM4NSA1MDIuNTQ3NjkyIDU5My40NDczODUgNTEyLjE5NjkyMyA1OTMuNDQ3Mzg1IDUyMS40MTI5MjMgNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDczMi4wNDE4NDYgNjUwLjYzMzg0NlpcIlxyXG4gICAgICAgIDpmaWxsPVwicmVtb3ZlQnV0dG9uQ29sb3JcIj48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICAgIDxkaXYgY2xhc3M9XCJzay1mYWRpbmctY2lyY2xlXCJcclxuICAgICAgOnN0eWxlPVwibG9hZGluZ1N0eWxlXCJcclxuICAgICAgdi1pZj1cInNob3dMb2FkaW5nICYmIGxvYWRpbmdcIj5cclxuICAgICAgPGRpdiA6Y2xhc3M9XCJgc2stY2lyY2xlJHtpfSBzay1jaXJjbGVgXCJcclxuICAgICAgICB2LWZvcj1cImkgaW4gMTJcIlxyXG4gICAgICAgIDprZXk9XCJpXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZS1pbmRpY2F0b3JcIlxyXG4gICAgICAgICAgOnN0eWxlPVwie2JhY2tncm91bmRDb2xvcjogbG9hZGluZ0NvbG9yfVwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPHNsb3Q+PC9zbG90PlxyXG4gIDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHNjcmlwdD5cclxuICBpbXBvcnQgdSBmcm9tICcuL3V0aWwnXHJcbiAgaW1wb3J0IHByb3BzIGZyb20gJy4vcHJvcHMnXHJcbiAgaW1wb3J0IGV2ZW50cyBmcm9tICcuL2V2ZW50cydcclxuXHJcbiAgY29uc3QgUENUX1BFUl9aT09NID0gMSAvIDEwMDAwMCAvLyBUaGUgYW1vdW50IG9mIHpvb21pbmcgZXZlcnl0aW1lIGl0IGhhcHBlbnMsIGluIHBlcmNlbnRhZ2Ugb2YgaW1hZ2Ugd2lkdGguXHJcbiAgY29uc3QgTUlOX01TX1BFUl9DTElDSyA9IDUwMCAvLyBJZiB0b3VjaCBkdXJhdGlvbiBpcyBzaG9ydGVyIHRoYW4gdGhlIHZhbHVlLCB0aGVuIGl0IGlzIGNvbnNpZGVyZWQgYXMgYSBjbGljay5cclxuICBjb25zdCBDTElDS19NT1ZFX1RIUkVTSE9MRCA9IDEwMCAvLyBJZiB0b3VjaCBtb3ZlIGRpc3RhbmNlIGlzIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlLCB0aGVuIGl0IHdpbGwgYnkgbm8gbWVhbiBiZSBjb25zaWRlcmVkIGFzIGEgY2xpY2suXHJcbiAgY29uc3QgTUlOX1dJRFRIID0gMTAgLy8gVGhlIG1pbmltYWwgd2lkdGggdGhlIHVzZXIgY2FuIHpvb20gdG8uXHJcbiAgY29uc3QgREVGQVVMVF9QTEFDRUhPTERFUl9UQUtFVVAgPSAyIC8gMyAvLyBQbGFjZWhvbGRlciB0ZXh0IGJ5IGRlZmF1bHQgdGFrZXMgdXAgdGhpcyBhbW91bnQgb2YgdGltZXMgb2YgY2FudmFzIHdpZHRoLlxyXG4gIGNvbnN0IFBJTkNIX0FDQ0VMRVJBVElPTiA9IDEgLy8gVGhlIGFtb3VudCBvZiB0aW1lcyBieSB3aGljaCB0aGUgcGluY2hpbmcgaXMgbW9yZSBzZW5zaXRpdmUgdGhhbiB0aGUgc2NvbGxpbmdcclxuXHJcbiAgY29uc3Qgc3luY0RhdGEgPSBbJ2ltZ0RhdGEnLCAnaW1nJywgJ2ltZ1NldCcsICdvcmlnaW5hbEltYWdlJywgJ25hdHVyYWxIZWlnaHQnLCAnbmF0dXJhbFdpZHRoJywgJ29yaWVudGF0aW9uJywgJ3NjYWxlUmF0aW8nXVxyXG4gIC8vIGNvbnN0IERFQlVHID0gZmFsc2VcclxuXHJcbiAgZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgbW9kZWw6IHtcclxuICAgICAgcHJvcDogJ3ZhbHVlJyxcclxuICAgICAgZXZlbnQ6IGV2ZW50cy5JTklUX0VWRU5UXHJcbiAgICB9LFxyXG5cclxuICAgIHByb3BzOiBwcm9wcyxcclxuXHJcbiAgICBkYXRhICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBjYW52YXM6IG51bGwsXHJcbiAgICAgICAgY3R4OiBudWxsLFxyXG4gICAgICAgIG9yaWdpbmFsSW1hZ2U6IG51bGwsXHJcbiAgICAgICAgaW1nOiBudWxsLFxyXG4gICAgICAgIGRyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgICBsYXN0TW92aW5nQ29vcmQ6IG51bGwsXHJcbiAgICAgICAgaW1nRGF0YToge1xyXG4gICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICBoZWlnaHQ6IDAsXHJcbiAgICAgICAgICBzdGFydFg6IDAsXHJcbiAgICAgICAgICBzdGFydFk6IDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpbGVEcmFnZ2VkT3ZlcjogZmFsc2UsXHJcbiAgICAgICAgdGFiU3RhcnQ6IDAsXHJcbiAgICAgICAgc2Nyb2xsaW5nOiBmYWxzZSxcclxuICAgICAgICBwaW5jaGluZzogZmFsc2UsXHJcbiAgICAgICAgcm90YXRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHBpbmNoRGlzdGFuY2U6IDAsXHJcbiAgICAgICAgc3VwcG9ydFRvdWNoOiBmYWxzZSxcclxuICAgICAgICBwb2ludGVyTW92ZWQ6IGZhbHNlLFxyXG4gICAgICAgIHBvaW50ZXJTdGFydENvb3JkOiBudWxsLFxyXG4gICAgICAgIG5hdHVyYWxXaWR0aDogMCxcclxuICAgICAgICBuYXR1cmFsSGVpZ2h0OiAwLFxyXG4gICAgICAgIHNjYWxlUmF0aW86IG51bGwsXHJcbiAgICAgICAgb3JpZW50YXRpb246IDEsXHJcbiAgICAgICAgdXNlck1ldGFkYXRhOiBudWxsLFxyXG4gICAgICAgIGltYWdlU2V0OiBmYWxzZSxcclxuICAgICAgICBjdXJyZW50UG9pbnRlckNvb3JkOiBudWxsLFxyXG4gICAgICAgIGN1cnJlbnRJc0luaXRpYWw6IGZhbHNlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgb3V0cHV0V2lkdGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBvdXRwdXRIZWlnaHQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlckZvbnRTaXplICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhc3BlY3RSYXRpbyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmF0dXJhbFdpZHRoIC8gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBsb2FkaW5nU3R5bGUgKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB3aWR0aDogdGhpcy5sb2FkaW5nU2l6ZSArICdweCcsXHJcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMubG9hZGluZ1NpemUgKyAncHgnLFxyXG4gICAgICAgICAgcmlnaHQ6ICcxNXB4JyxcclxuICAgICAgICAgIGJvdHRvbTogJzEwcHgnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdW50ZWQgKCkge1xyXG4gICAgICB0aGlzLl9pbml0aWFsaXplKClcclxuICAgICAgdS5yQUZQb2x5ZmlsbCgpXHJcbiAgICAgIHUudG9CbG9iUG9seWZpbGwoKVxyXG5cclxuICAgICAgbGV0IHN1cHBvcnRzID0gdGhpcy5zdXBwb3J0RGV0ZWN0aW9uKClcclxuICAgICAgaWYgKCFzdXBwb3J0cy5iYXNpYykge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdnVlLWNyb3BwYSBmdW5jdGlvbmFsaXR5LicpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHtcclxuICAgICAgICB0aGlzLiR3YXRjaCgndmFsdWUuX2RhdGEnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgbGV0IHNldCA9IGZhbHNlXHJcbiAgICAgICAgICBpZiAoIWRhdGEpIHJldHVyblxyXG4gICAgICAgICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKHN5bmNEYXRhLmluZGV4T2Yoa2V5KSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHZhbCA9IGRhdGFba2V5XVxyXG4gICAgICAgICAgICAgIGlmICh2YWwgIT09IHRoaXNba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kc2V0KHRoaXMsIGtleSwgdmFsKVxyXG4gICAgICAgICAgICAgICAgc2V0ID0gdHJ1ZVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHNldCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW1vdmUoKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGRlZXA6IHRydWVcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgb3V0cHV0V2lkdGg6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLm9uRGltZW5zaW9uQ2hhbmdlKClcclxuICAgICAgfSxcclxuICAgICAgb3V0cHV0SGVpZ2h0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5vbkRpbWVuc2lvbkNoYW5nZSgpXHJcbiAgICAgIH0sXHJcbiAgICAgIGNhbnZhc0NvbG9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5fZHJhdygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBpbWFnZUJvcmRlclJhZGl1czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmltZykge1xyXG4gICAgICAgICAgdGhpcy5fZHJhdygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwbGFjZWhvbGRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwbGFjZWhvbGRlckNvbG9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwcmV2ZW50V2hpdGVTcGFjZSAodmFsKSB7XHJcbiAgICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoKVxyXG4gICAgICB9LFxyXG4gICAgICBzY2FsZVJhdGlvICh2YWwsIG9sZFZhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGlmICghdS5udW1iZXJWYWxpZCh2YWwpKSByZXR1cm5cclxuXHJcbiAgICAgICAgdmFyIHggPSAxXHJcbiAgICAgICAgaWYgKHUubnVtYmVyVmFsaWQob2xkVmFsKSAmJiBvbGRWYWwgIT09IDApIHtcclxuICAgICAgICAgIHggPSB2YWwgLyBvbGRWYWxcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMuY3VycmVudFBvaW50ZXJDb29yZCB8fCB7XHJcbiAgICAgICAgICB4OiB0aGlzLmltZ0RhdGEuc3RhcnRYICsgdGhpcy5pbWdEYXRhLndpZHRoIC8gMixcclxuICAgICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aCAqIHZhbFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgKiB2YWxcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnVzZXJNZXRhZGF0YSAmJiB0aGlzLmltYWdlU2V0ICYmICF0aGlzLnJvdGF0aW5nKSB7XHJcbiAgICAgICAgICBsZXQgb2Zmc2V0WCA9ICh4IC0gMSkgKiAocG9zLnggLSB0aGlzLmltZ0RhdGEuc3RhcnRYKVxyXG4gICAgICAgICAgbGV0IG9mZnNldFkgPSAoeCAtIDEpICogKHBvcy55IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSlcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYIC0gb2Zmc2V0WFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHRoaXMuaW1nRGF0YS5zdGFydFkgLSBvZmZzZXRZXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5fcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgICAgdGhpcy5fcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICAnaW1nRGF0YS53aWR0aCc6IGZ1bmN0aW9uICh2YWwsIG9sZFZhbCkge1xyXG4gICAgICAgIC8vIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIGlmICghdS5udW1iZXJWYWxpZCh2YWwpKSByZXR1cm5cclxuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSB2YWwgLyB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkpIHtcclxuICAgICAgICAgIGlmIChNYXRoLmFicyh2YWwgLSBvbGRWYWwpID4gKHZhbCAqICgxIC8gMTAwMDAwKSkpIHtcclxuICAgICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuWk9PTV9FVkVOVClcclxuICAgICAgICAgICAgdGhpcy5fZHJhdygpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICAnaW1nRGF0YS5oZWlnaHQnOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF1Lm51bWJlclZhbGlkKHZhbCkpIHJldHVyblxyXG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHZhbCAvIHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICB9LFxyXG4gICAgICAnaW1nRGF0YS5zdGFydFgnOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSkge1xyXG4gICAgICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5fZHJhdylcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgICdpbWdEYXRhLnN0YXJ0WSc6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBpZiAodGhpcy5oYXNJbWFnZSgpKSB7XHJcbiAgICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLl9kcmF3KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgbG9hZGluZyAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuTE9BRElOR19TVEFSVClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuTE9BRElOR19FTkQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgZ2V0Q2FudmFzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXNcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldENvbnRleHQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN0eFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0Q2hvc2VuRmlsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJHJlZnMuZmlsZUlucHV0LmZpbGVzWzBdXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlIChvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIW9mZnNldCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIGxldCBvbGRYID0gdGhpcy5pbWdEYXRhLnN0YXJ0WFxyXG4gICAgICAgIGxldCBvbGRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggKz0gb2Zmc2V0LnhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZICs9IG9mZnNldC55XHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIHRoaXMuX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCAhPT0gb2xkWCB8fCB0aGlzLmltZ0RhdGEuc3RhcnRZICE9PSBvbGRZKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5NT1ZFX0VWRU5UKVxyXG4gICAgICAgICAgdGhpcy5fZHJhdygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbW92ZVVwd2FyZHMgKGFtb3VudCA9IDEpIHtcclxuICAgICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiAtYW1vdW50IH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlRG93bndhcmRzIChhbW91bnQgPSAxKSB7XHJcbiAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogYW1vdW50IH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlTGVmdHdhcmRzIChhbW91bnQgPSAxKSB7XHJcbiAgICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbW92ZVJpZ2h0d2FyZHMgKGFtb3VudCA9IDEpIHtcclxuICAgICAgICB0aGlzLm1vdmUoeyB4OiBhbW91bnQsIHk6IDAgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHpvb20gKHpvb21JbiA9IHRydWUsIGFjY2VsZXJhdGlvbiA9IDEpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBsZXQgcmVhbFNwZWVkID0gdGhpcy56b29tU3BlZWQgKiBhY2NlbGVyYXRpb25cclxuICAgICAgICBsZXQgc3BlZWQgPSAodGhpcy5vdXRwdXRXaWR0aCAqIFBDVF9QRVJfWk9PTSkgKiByZWFsU3BlZWRcclxuICAgICAgICBsZXQgeCA9IDFcclxuICAgICAgICBpZiAoem9vbUluKSB7XHJcbiAgICAgICAgICB4ID0gMSArIHNwZWVkXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiBNSU5fV0lEVEgpIHtcclxuICAgICAgICAgIHggPSAxIC0gc3BlZWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyAqPSB4XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB6b29tSW4gKCkge1xyXG4gICAgICAgIHRoaXMuem9vbSh0cnVlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgem9vbU91dCAoKSB7XHJcbiAgICAgICAgdGhpcy56b29tKGZhbHNlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcm90YXRlIChzdGVwID0gMSkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkIHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgc3RlcCA9IHBhcnNlSW50KHN0ZXApXHJcbiAgICAgICAgaWYgKGlzTmFOKHN0ZXApIHx8IHN0ZXAgPiAzIHx8IHN0ZXAgPCAtMykge1xyXG4gICAgICAgICAgY29uc29sZS53YXJuKCdJbnZhbGlkIGFyZ3VtZW50IGZvciByb3RhdGUoKSBtZXRob2QuIEl0IHNob3VsZCBvbmUgb2YgdGhlIGludGVnZXJzIGZyb20gLTMgdG8gMy4nKVxyXG4gICAgICAgICAgc3RlcCA9IDFcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcm90YXRlQnlTdGVwKHN0ZXApXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmbGlwWCAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbigyKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmxpcFkgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkIHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24oNClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlZnJlc2ggKCkge1xyXG4gICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2luaXRpYWxpemUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYXNJbWFnZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuICEhdGhpcy5pbWFnZVNldFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYXBwbHlNZXRhZGF0YSAobWV0YWRhdGEpIHtcclxuICAgICAgICBpZiAoIW1ldGFkYXRhIHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBtZXRhZGF0YVxyXG4gICAgICAgIHZhciBvcmkgPSBtZXRhZGF0YS5vcmllbnRhdGlvbiB8fCB0aGlzLm9yaWVudGF0aW9uIHx8IDFcclxuICAgICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbihvcmksIHRydWUpXHJcbiAgICAgIH0sXHJcbiAgICAgIGdlbmVyYXRlRGF0YVVybCAodHlwZSwgY29tcHJlc3Npb25SYXRlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHJldHVybiAnJ1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwodHlwZSwgY29tcHJlc3Npb25SYXRlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2VuZXJhdGVCbG9iIChjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudCkge1xyXG4gICAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2FudmFzLnRvQmxvYihjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHByb21pc2VkQmxvYiAoLi4uYXJncykge1xyXG4gICAgICAgIGlmICh0eXBlb2YgUHJvbWlzZSA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgY29uc29sZS53YXJuKCdObyBQcm9taXNlIHN1cHBvcnQuIFBsZWFzZSBhZGQgUHJvbWlzZSBwb2x5ZmlsbCBpZiB5b3Ugd2FudCB0byB1c2UgdGhpcyBtZXRob2QuJylcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUJsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICAgICAgICByZXNvbHZlKGJsb2IpXHJcbiAgICAgICAgICAgIH0sIC4uLmFyZ3MpXHJcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycilcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0TWV0YWRhdGEgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSByZXR1cm4ge31cclxuICAgICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSB9ID0gdGhpcy5pbWdEYXRhXHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBzdGFydFgsXHJcbiAgICAgICAgICBzdGFydFksXHJcbiAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZVJhdGlvLFxyXG4gICAgICAgICAgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb25cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzdXBwb3J0RGV0ZWN0aW9uICgpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHJldHVyblxyXG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAnYmFzaWMnOiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmIHdpbmRvdy5GaWxlICYmIHdpbmRvdy5GaWxlUmVhZGVyICYmIHdpbmRvdy5GaWxlTGlzdCAmJiB3aW5kb3cuQmxvYixcclxuICAgICAgICAgICdkbmQnOiAnb25kcmFnc3RhcnQnIGluIGRpdiAmJiAnb25kcm9wJyBpbiBkaXZcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjaG9vc2VGaWxlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC5jbGljaygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZW1vdmUgKCkge1xyXG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXHJcblxyXG4gICAgICAgIGxldCBoYWRJbWFnZSA9IHRoaXMuaW1nICE9IG51bGxcclxuICAgICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBudWxsXHJcbiAgICAgICAgdGhpcy5pbWcgPSBudWxsXHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQudmFsdWUgPSAnJ1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YSA9IHtcclxuICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICAgICAgc3RhcnRYOiAwLFxyXG4gICAgICAgICAgc3RhcnRZOiAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSAxXHJcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gbnVsbFxyXG4gICAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXHJcblxyXG4gICAgICAgIGlmIChoYWRJbWFnZSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU1BR0VfUkVNT1ZFX0VWRU5UKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZENsaXBQbHVnaW4gKHBsdWdpbikge1xyXG4gICAgICAgIGlmICghdGhpcy5jbGlwUGx1Z2lucykge1xyXG4gICAgICAgICAgdGhpcy5jbGlwUGx1Z2lucyA9IFtdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgcGx1Z2luID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY2xpcFBsdWdpbnMuaW5kZXhPZihwbHVnaW4pIDwgMCkge1xyXG4gICAgICAgICAgdGhpcy5jbGlwUGx1Z2lucy5wdXNoKHBsdWdpbilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhyb3cgRXJyb3IoJ0NsaXAgcGx1Z2lucyBzaG91bGQgYmUgZnVuY3Rpb25zJylcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaW5pdGlhbGl6ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRyZWZzLmNhbnZhc1xyXG4gICAgICAgIHRoaXMuX3NldFNpemUoKVxyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAndHJhbnNwYXJlbnQnIDogKHR5cGVvZiB0aGlzLmNhbnZhc0NvbG9yID09PSAnc3RyaW5nJyA/IHRoaXMuY2FudmFzQ29sb3IgOiAnJylcclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuICAgICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBudWxsXHJcbiAgICAgICAgdGhpcy5pbWcgPSBudWxsXHJcbiAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5fc2V0SW5pdGlhbCgpXHJcbiAgICAgICAgaWYgKCF0aGlzLnBhc3NpdmUpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLklOSVRfRVZFTlQsIHRoaXMpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3NldFNpemUgKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5vdXRwdXRXaWR0aFxyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4J1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3JvdGF0ZUJ5U3RlcCAoc3RlcCkge1xyXG4gICAgICAgIGxldCBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICBzd2l0Y2ggKHN0ZXApIHtcclxuICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSA2XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gM1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDhcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gOFxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAtMjpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSAzXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIC0zOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDZcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24ob3JpZW50YXRpb24pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfc2V0SW1hZ2VQbGFjZWhvbGRlciAoKSB7XHJcbiAgICAgICAgbGV0IGltZ1xyXG4gICAgICAgIGlmICh0aGlzLiRzbG90cy5wbGFjZWhvbGRlciAmJiB0aGlzLiRzbG90cy5wbGFjZWhvbGRlclswXSkge1xyXG4gICAgICAgICAgbGV0IHZOb2RlID0gdGhpcy4kc2xvdHMucGxhY2Vob2xkZXJbMF1cclxuICAgICAgICAgIGxldCB7IHRhZywgZWxtIH0gPSB2Tm9kZVxyXG4gICAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcclxuICAgICAgICAgICAgaW1nID0gZWxtXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWltZykgcmV0dXJuXHJcblxyXG4gICAgICAgIHZhciBvbkxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh1LmltYWdlTG9hZGVkKGltZykpIHtcclxuICAgICAgICAgIG9uTG9hZCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGltZy5vbmxvYWQgPSBvbkxvYWRcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfc2V0VGV4dFBsYWNlaG9sZGVyICgpIHtcclxuICAgICAgICB2YXIgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSdcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcidcclxuICAgICAgICBsZXQgZGVmYXVsdEZvbnRTaXplID0gdGhpcy5vdXRwdXRXaWR0aCAqIERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcclxuICAgICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMuY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplIHx8IHRoaXMuY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplID09IDApID8gZGVmYXVsdEZvbnRTaXplIDogdGhpcy5jb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemVcclxuICAgICAgICBjdHguZm9udCA9IGZvbnRTaXplICsgJ3B4IHNhbnMtc2VyaWYnXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMub3V0cHV0V2lkdGggLyAyLCB0aGlzLm91dHB1dEhlaWdodCAvIDIpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfc2V0UGxhY2Vob2xkZXJzICgpIHtcclxuICAgICAgICB0aGlzLl9wYWludEJhY2tncm91bmQoKVxyXG4gICAgICAgIHRoaXMuX3NldEltYWdlUGxhY2Vob2xkZXIoKVxyXG4gICAgICAgIHRoaXMuX3NldFRleHRQbGFjZWhvbGRlcigpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfc2V0SW5pdGlhbCAoKSB7XHJcbiAgICAgICAgbGV0IHNyYywgaW1nXHJcbiAgICAgICAgaWYgKHRoaXMuJHNsb3RzLmluaXRpYWwgJiYgdGhpcy4kc2xvdHMuaW5pdGlhbFswXSkge1xyXG4gICAgICAgICAgbGV0IHZOb2RlID0gdGhpcy4kc2xvdHMuaW5pdGlhbFswXVxyXG4gICAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXHJcbiAgICAgICAgICBpZiAodGFnID09ICdpbWcnICYmIGVsbSkge1xyXG4gICAgICAgICAgICBpbWcgPSBlbG1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbEltYWdlICYmIHR5cGVvZiB0aGlzLmluaXRpYWxJbWFnZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIHNyYyA9IHRoaXMuaW5pdGlhbEltYWdlXHJcbiAgICAgICAgICBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgICAgaWYgKCEvXmRhdGE6Ly50ZXN0KHNyYykgJiYgIS9eYmxvYjovLnRlc3Qoc3JjKSkge1xyXG4gICAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKCdjcm9zc09yaWdpbicsICdhbm9ueW1vdXMnKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaW1nLnNyYyA9IHNyY1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuaW5pdGlhbEltYWdlID09PSAnb2JqZWN0JyAmJiB0aGlzLmluaXRpYWxJbWFnZSBpbnN0YW5jZW9mIEltYWdlKSB7XHJcbiAgICAgICAgICBpbWcgPSB0aGlzLmluaXRpYWxJbWFnZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXNyYyAmJiAhaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3VycmVudElzSW5pdGlhbCA9IHRydWVcclxuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XHJcbiAgICAgICAgICAvLyB0aGlzLiRlbWl0KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcclxuICAgICAgICAgIHRoaXMuX29ubG9hZChpbWcsICtpbWcuZGF0YXNldFsnZXhpZk9yaWVudGF0aW9uJ10sIHRydWUpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubG9hZGluZyA9IHRydWVcclxuICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuJGVtaXQoZXZlbnRzLklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UKVxyXG4gICAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCAraW1nLmRhdGFzZXRbJ2V4aWZPcmllbnRhdGlvbiddLCB0cnVlKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGltZy5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9vbmxvYWQgKGltZywgb3JpZW50YXRpb24gPSAxLCBpbml0aWFsKSB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gaW1nXHJcbiAgICAgICAgdGhpcy5pbWcgPSBpbWdcclxuXHJcbiAgICAgICAgaWYgKGlzTmFOKG9yaWVudGF0aW9uKSkge1xyXG4gICAgICAgICAgb3JpZW50YXRpb24gPSAxXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbihvcmllbnRhdGlvbilcclxuXHJcbiAgICAgICAgaWYgKGluaXRpYWwpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVDbGljayAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UgJiYgIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMuc3VwcG9ydFRvdWNoICYmICF0aGlzLnBhc3NpdmUpIHtcclxuICAgICAgICAgIHRoaXMuY2hvb3NlRmlsZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZUlucHV0Q2hhbmdlICgpIHtcclxuICAgICAgICBsZXQgaW5wdXQgPSB0aGlzLiRyZWZzLmZpbGVJbnB1dFxyXG4gICAgICAgIGlmICghaW5wdXQuZmlsZXMubGVuZ3RoIHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcblxyXG4gICAgICAgIGxldCBmaWxlID0gaW5wdXQuZmlsZXNbMF1cclxuICAgICAgICB0aGlzLl9vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX29uTmV3RmlsZUluIChmaWxlKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50SXNJbml0aWFsID0gZmFsc2VcclxuICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlXHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuRklMRV9DSE9PU0VfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgaWYgKCF0aGlzLl9maWxlU2l6ZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX1NJWkVfRVhDRUVEX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaWxlIHNpemUgZXhjZWVkcyBsaW1pdCB3aGljaCBpcyAnICsgdGhpcy5maWxlU2l6ZUxpbWl0ICsgJyBieXRlcy4nKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuX2ZpbGVUeXBlSXNWYWxpZChmaWxlKSkge1xyXG4gICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIGxldCB0eXBlID0gZmlsZS50eXBlIHx8IGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcuJykucG9wKClcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmlsZSB0eXBlICgke3R5cGV9KSBtaW1hdGNoZXMgKCR7dGhpcy5hY2NlcHR9KS5gKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5GaWxlUmVhZGVyICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgICAgICAgZnIub25sb2FkID0gKGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IGZpbGVEYXRhID0gZS50YXJnZXQucmVzdWx0XHJcbiAgICAgICAgICAgIGxldCBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBvcmllbnRhdGlvbiA9IHUuZ2V0RmlsZU9yaWVudGF0aW9uKHUuYmFzZTY0VG9BcnJheUJ1ZmZlcihmaWxlRGF0YSkpXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikgeyB9XHJcbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbiA8IDEpIG9yaWVudGF0aW9uID0gMVxyXG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgICAgICAgaW1nLnNyYyA9IGZpbGVEYXRhXHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgb3JpZW50YXRpb24pXHJcbiAgICAgICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuTkVXX0lNQUdFKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBmci5yZWFkQXNEYXRhVVJMKGZpbGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2ZpbGVTaXplSXNWYWxpZCAoZmlsZSkge1xyXG4gICAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVTaXplTGltaXQgfHwgdGhpcy5maWxlU2l6ZUxpbWl0ID09IDApIHJldHVybiB0cnVlXHJcblxyXG4gICAgICAgIHJldHVybiBmaWxlLnNpemUgPCB0aGlzLmZpbGVTaXplTGltaXRcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9maWxlVHlwZUlzVmFsaWQgKGZpbGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuYWNjZXB0KSByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIGxldCBhY2NlcHQgPSB0aGlzLmFjY2VwdFxyXG4gICAgICAgIGxldCBiYXNlTWltZXR5cGUgPSBhY2NlcHQucmVwbGFjZSgvXFwvLiokLywgJycpXHJcbiAgICAgICAgbGV0IHR5cGVzID0gYWNjZXB0LnNwbGl0KCcsJylcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdHlwZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgIGxldCB0eXBlID0gdHlwZXNbaV1cclxuICAgICAgICAgIGxldCB0ID0gdHlwZS50cmltKClcclxuICAgICAgICAgIGlmICh0LmNoYXJBdCgwKSA9PSAnLicpIHtcclxuICAgICAgICAgICAgaWYgKGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcuJykucG9wKCkgPT09IHQudG9Mb3dlckNhc2UoKS5zbGljZSgxKSkgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH0gZWxzZSBpZiAoL1xcL1xcKiQvLnRlc3QodCkpIHtcclxuICAgICAgICAgICAgdmFyIGZpbGVCYXNlVHlwZSA9IGZpbGUudHlwZS5yZXBsYWNlKC9cXC8uKiQvLCAnJylcclxuICAgICAgICAgICAgaWYgKGZpbGVCYXNlVHlwZSA9PT0gYmFzZU1pbWV0eXBlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmIChmaWxlLnR5cGUgPT09IHR5cGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3BsYWNlSW1hZ2UgKGFwcGx5TWV0YWRhdGEpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICB2YXIgaW1nRGF0YSA9IHRoaXMuaW1nRGF0YVxyXG5cclxuICAgICAgICB0aGlzLm5hdHVyYWxXaWR0aCA9IHRoaXMuaW1nLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIHRoaXMubmF0dXJhbEhlaWdodCA9IHRoaXMuaW1nLm5hdHVyYWxIZWlnaHRcclxuXHJcbiAgICAgICAgaW1nRGF0YS5zdGFydFggPSB1Lm51bWJlclZhbGlkKGltZ0RhdGEuc3RhcnRYKSA/IGltZ0RhdGEuc3RhcnRYIDogMFxyXG4gICAgICAgIGltZ0RhdGEuc3RhcnRZID0gdS5udW1iZXJWYWxpZChpbWdEYXRhLnN0YXJ0WSkgPyBpbWdEYXRhLnN0YXJ0WSA6IDBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIHRoaXMuX2FzcGVjdEZpbGwoKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaW1hZ2VTZXQpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmluaXRpYWxTaXplID09ICdjb250YWluJykge1xyXG4gICAgICAgICAgICB0aGlzLl9hc3BlY3RGaXQoKVxyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmluaXRpYWxTaXplID09ICduYXR1cmFsJykge1xyXG4gICAgICAgICAgICB0aGlzLl9uYXR1cmFsU2l6ZSgpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9hc3BlY3RGaWxsKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGggKiB0aGlzLnNjYWxlUmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgKiB0aGlzLnNjYWxlUmF0aW9cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pbWFnZVNldCkge1xyXG4gICAgICAgICAgaWYgKC90b3AvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgICAgfSBlbHNlIGlmICgvYm90dG9tLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xyXG4gICAgICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IHRoaXMub3V0cHV0SGVpZ2h0IC0gaW1nRGF0YS5oZWlnaHRcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoL2xlZnQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICAgICAgfSBlbHNlIGlmICgvcmlnaHQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0gdGhpcy5vdXRwdXRXaWR0aCAtIGltZ0RhdGEud2lkdGhcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoL14tP1xcZCslIC0/XFxkKyUkLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gL14oLT9cXGQrKSUgKC0/XFxkKyklJC8uZXhlYyh0aGlzLmluaXRpYWxQb3NpdGlvbilcclxuICAgICAgICAgICAgdmFyIHggPSArcmVzdWx0WzFdIC8gMTAwXHJcbiAgICAgICAgICAgIHZhciB5ID0gK3Jlc3VsdFsyXSAvIDEwMFxyXG4gICAgICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IHggKiAodGhpcy5vdXRwdXRXaWR0aCAtIGltZ0RhdGEud2lkdGgpXHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0geSAqICh0aGlzLm91dHB1dEhlaWdodCAtIGltZ0RhdGEuaGVpZ2h0KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXBwbHlNZXRhZGF0YSAmJiB0aGlzLl9hcHBseU1ldGFkYXRhKClcclxuXHJcbiAgICAgICAgaWYgKGFwcGx5TWV0YWRhdGEgJiYgdGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy56b29tKGZhbHNlLCAwKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiAwIH0pXHJcbiAgICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfYXNwZWN0RmlsbCAoKSB7XHJcbiAgICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgICAgbGV0IHNjYWxlUmF0aW9cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYXNwZWN0UmF0aW8gPiBjYW52YXNSYXRpbykge1xyXG4gICAgICAgICAgc2NhbGVSYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHNjYWxlUmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm91dHB1dEhlaWdodFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzY2FsZVJhdGlvID0gaW1nV2lkdGggLyB0aGlzLm91dHB1dFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5vdXRwdXRXaWR0aFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2FzcGVjdEZpdCAoKSB7XHJcbiAgICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgICAgbGV0IHNjYWxlUmF0aW9cclxuICAgICAgICBpZiAodGhpcy5hc3BlY3RSYXRpbyA+IGNhbnZhc1JhdGlvKSB7XHJcbiAgICAgICAgICBzY2FsZVJhdGlvID0gaW1nV2lkdGggLyB0aGlzLm91dHB1dFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5vdXRwdXRXaWR0aFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KSAvIDJcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2NhbGVSYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHNjYWxlUmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm91dHB1dEhlaWdodFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aCkgLyAyXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX25hdHVyYWxTaXplICgpIHtcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHRcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZVBvaW50ZXJTdGFydCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5zdXBwb3J0VG91Y2ggPSB0cnVlXHJcbiAgICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSBmYWxzZVxyXG4gICAgICAgIGxldCBwb2ludGVyQ29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBwb2ludGVyQ29vcmRcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICAgIC8vIHNpbXVsYXRlIGNsaWNrIHdpdGggdG91Y2ggb24gbW9iaWxlIGRldmljZXNcclxuICAgICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgICAgdGhpcy50YWJTdGFydCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWdub3JlIG1vdXNlIHJpZ2h0IGNsaWNrIGFuZCBtaWRkbGUgY2xpY2tcclxuICAgICAgICBpZiAoZXZ0LndoaWNoICYmIGV2dC53aGljaCA+IDEpIHJldHVyblxyXG5cclxuICAgICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSB0cnVlXHJcbiAgICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNhbmNlbEV2ZW50cyA9IFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCcsICdwb2ludGVyZW5kJywgJ3BvaW50ZXJjYW5jZWwnXVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjYW5jZWxFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgIGxldCBlID0gY2FuY2VsRXZlbnRzW2ldXHJcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuX2hhbmRsZVBvaW50ZXJFbmQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZVBvaW50ZXJFbmQgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIGxldCBwb2ludGVyTW92ZURpc3RhbmNlID0gMFxyXG4gICAgICAgIGlmICh0aGlzLnBvaW50ZXJTdGFydENvb3JkKSB7XHJcbiAgICAgICAgICBsZXQgcG9pbnRlckNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIHBvaW50ZXJNb3ZlRGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9pbnRlckNvb3JkLnggLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLngsIDIpICsgTWF0aC5wb3cocG9pbnRlckNvb3JkLnkgLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLnksIDIpKSB8fCAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgICAgbGV0IHRhYkVuZCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICBpZiAoKHBvaW50ZXJNb3ZlRGlzdGFuY2UgPCBDTElDS19NT1ZFX1RIUkVTSE9MRCkgJiYgdGFiRW5kIC0gdGhpcy50YWJTdGFydCA8IE1JTl9NU19QRVJfQ0xJQ0sgJiYgdGhpcy5zdXBwb3J0VG91Y2gpIHtcclxuICAgICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMudGFiU3RhcnQgPSAwXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IDBcclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IG51bGxcclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5wb2ludGVyU3RhcnRDb29yZCA9IG51bGxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVQb2ludGVyTW92ZSAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSB0cnVlXHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHJldHVyblxyXG4gICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5jdXJyZW50UG9pbnRlckNvb3JkID0gY29vcmRcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ1RvTW92ZSkgcmV0dXJuXHJcblxyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgaWYgKCFldnQudG91Y2hlcyB8fCBldnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5kcmFnZ2luZykgcmV0dXJuXHJcbiAgICAgICAgICBpZiAodGhpcy5sYXN0TW92aW5nQ29vcmQpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHtcclxuICAgICAgICAgICAgICB4OiBjb29yZC54IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueCxcclxuICAgICAgICAgICAgICB5OiBjb29yZC55IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5kaXNhYmxlUGluY2hUb1pvb20pIHtcclxuICAgICAgICAgIGlmICghdGhpcy5waW5jaGluZykgcmV0dXJuXHJcbiAgICAgICAgICBsZXQgZGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgbGV0IGRlbHRhID0gZGlzdGFuY2UgLSB0aGlzLnBpbmNoRGlzdGFuY2VcclxuICAgICAgICAgIHRoaXMuem9vbShkZWx0YSA+IDAsIFBJTkNIX0FDQ0VMRVJBVElPTilcclxuICAgICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IGRpc3RhbmNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZVBvaW50ZXJMZWF2ZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50UG9pbnRlckNvb3JkID0gbnVsbFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZVdoZWVsIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVTY3JvbGxUb1pvb20gfHwgIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuXHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICB0aGlzLnNjcm9sbGluZyA9IHRydWVcclxuICAgICAgICBpZiAoZXZ0LndoZWVsRGVsdGEgPCAwIHx8IGV2dC5kZWx0YVkgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LndoZWVsRGVsdGEgPiAwIHx8IGV2dC5kZWx0YVkgPCAwIHx8IGV2dC5kZXRhaWwgPCAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20oIXRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5zY3JvbGxpbmcgPSBmYWxzZVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlRHJhZ0VudGVyIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnQW5kRHJvcCB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5yZXBsYWNlRHJvcCkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSB0cnVlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlRHJhZ0xlYXZlIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlRHJhZ092ZXIgKGV2dCkge1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZURyb3AgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxyXG4gICAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkgJiYgdGhpcy5yZXBsYWNlRHJvcCkge1xyXG4gICAgICAgICAgdGhpcy5yZW1vdmUoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcblxyXG4gICAgICAgIGxldCBmaWxlXHJcbiAgICAgICAgbGV0IGR0ID0gZXZ0LmRhdGFUcmFuc2ZlclxyXG4gICAgICAgIGlmICghZHQpIHJldHVyblxyXG4gICAgICAgIGlmIChkdC5pdGVtcykge1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0Lml0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gZHQuaXRlbXNbaV1cclxuICAgICAgICAgICAgaWYgKGl0ZW0ua2luZCA9PSAnZmlsZScpIHtcclxuICAgICAgICAgICAgICBmaWxlID0gaXRlbS5nZXRBc0ZpbGUoKVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZmlsZSA9IGR0LmZpbGVzWzBdXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgdGhpcy5fb25OZXdGaWxlSW4oZmlsZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFggPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WSA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm91dHB1dFdpZHRoIC0gdGhpcy5pbWdEYXRhLnN0YXJ0WCA+IHRoaXMuaW1nRGF0YS53aWR0aCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMub3V0cHV0SGVpZ2h0IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSA+IHRoaXMuaW1nRGF0YS5oZWlnaHQpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLm91dHB1dEhlaWdodClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPCB0aGlzLm91dHB1dFdpZHRoKSB7XHJcbiAgICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSB0aGlzLm91dHB1dFdpZHRoIC8gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuaGVpZ2h0IDwgdGhpcy5vdXRwdXRIZWlnaHQpIHtcclxuICAgICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHRoaXMub3V0cHV0SGVpZ2h0IC8gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3NldE9yaWVudGF0aW9uIChvcmllbnRhdGlvbiA9IDYsIGFwcGx5TWV0YWRhdGEpIHtcclxuICAgICAgICB2YXIgdXNlT3JpZ2luYWwgPSBhcHBseU1ldGFkYXRhXHJcbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID4gMSB8fCB1c2VPcmlnaW5hbCkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgICB0aGlzLnJvdGF0aW5nID0gdHJ1ZVxyXG4gICAgICAgICAgdmFyIF9pbWcgPSB1LmdldFJvdGF0ZWRJbWFnZSh1c2VPcmlnaW5hbCA/IHRoaXMub3JpZ2luYWxJbWFnZSA6IHRoaXMuaW1nLCBvcmllbnRhdGlvbilcclxuICAgICAgICAgIF9pbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmltZyA9IF9pbWdcclxuICAgICAgICAgICAgdGhpcy5fcGxhY2VJbWFnZShhcHBseU1ldGFkYXRhKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKGFwcGx5TWV0YWRhdGEpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3JpZW50YXRpb24gPT0gMikge1xyXG4gICAgICAgICAgLy8gZmxpcCB4XHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5mbGlwWCh0aGlzLm9yaWVudGF0aW9uKVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gNCkge1xyXG4gICAgICAgICAgLy8gZmxpcCB5XHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5mbGlwWSh0aGlzLm9yaWVudGF0aW9uKVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gNikge1xyXG4gICAgICAgICAgLy8gOTAgZGVnXHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gMykge1xyXG4gICAgICAgICAgLy8gMTgwIGRlZ1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKSlcclxuICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDgpIHtcclxuICAgICAgICAgIC8vIDI3MCBkZWdcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHUucm90YXRlOTAodS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKSkpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHVzZU9yaWdpbmFsKSB7XHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb25cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfcGFpbnRCYWNrZ3JvdW5kICgpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICd0cmFuc3BhcmVudCcgOiB0aGlzLmNhbnZhc0NvbG9yXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2RyYXcgKCkge1xyXG4gICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX2RyYXdGcmFtZSlcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYXdGcmFtZSgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9kcmF3RnJhbWUgKCkge1xyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxyXG5cclxuICAgICAgICB0aGlzLl9wYWludEJhY2tncm91bmQoKVxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5fY2xpcCh0aGlzLl9jcmVhdGVDb250YWluZXJDbGlwUGF0aClcclxuICAgICAgICAgIC8vIHRoaXMuX2NsaXAodGhpcy5fY3JlYXRlSW1hZ2VDbGlwUGF0aClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkRSQVcsIGN0eClcclxuICAgICAgICBpZiAoIXRoaXMuaW1hZ2VTZXQpIHtcclxuICAgICAgICAgIHRoaXMuaW1hZ2VTZXQgPSB0cnVlXHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5ORVdfSU1BR0VfRFJBV04pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucm90YXRpbmcgPSBmYWxzZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2NsaXBQYXRoRmFjdG9yeSAoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGxldCByYWRpdXMgPSB0eXBlb2YgdGhpcy5pbWFnZUJvcmRlclJhZGl1cyA9PT0gJ251bWJlcicgP1xyXG4gICAgICAgICAgdGhpcy5pbWFnZUJvcmRlclJhZGl1cyA6XHJcbiAgICAgICAgICAhaXNOYU4oTnVtYmVyKHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMpKSA/IE51bWJlcih0aGlzLmltYWdlQm9yZGVyUmFkaXVzKSA6IDBcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyh4ICsgcmFkaXVzLCB5KTtcclxuICAgICAgICBjdHgubGluZVRvKHggKyB3aWR0aCAtIHJhZGl1cywgeSk7XHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByYWRpdXMpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQsIHggKyB3aWR0aCAtIHJhZGl1cywgeSArIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4ICsgcmFkaXVzLCB5ICsgaGVpZ2h0KTtcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5ICsgaGVpZ2h0LCB4LCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcclxuICAgICAgICBjdHgubGluZVRvKHgsIHkgKyByYWRpdXMpO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHksIHggKyByYWRpdXMsIHkpO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9jcmVhdGVDb250YWluZXJDbGlwUGF0aCAoKSB7XHJcbiAgICAgICAgdGhpcy5fY2xpcFBhdGhGYWN0b3J5KDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgICAgIGlmICh0aGlzLmNsaXBQbHVnaW5zICYmIHRoaXMuY2xpcFBsdWdpbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICB0aGlzLmNsaXBQbHVnaW5zLmZvckVhY2goZnVuYyA9PiB7XHJcbiAgICAgICAgICAgIGZ1bmModGhpcy5jdHgsIDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBfY3JlYXRlSW1hZ2VDbGlwUGF0aCAoKSB7XHJcbiAgICAgIC8vICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxyXG4gICAgICAvLyAgIGxldCB3ID0gd2lkdGhcclxuICAgICAgLy8gICBsZXQgaCA9IGhlaWdodFxyXG4gICAgICAvLyAgIGxldCB4ID0gc3RhcnRYXHJcbiAgICAgIC8vICAgbGV0IHkgPSBzdGFydFlcclxuICAgICAgLy8gICBpZiAodyA8IGgpIHtcclxuICAgICAgLy8gICAgIGggPSB0aGlzLm91dHB1dEhlaWdodCAqICh3aWR0aCAvIHRoaXMub3V0cHV0V2lkdGgpXHJcbiAgICAgIC8vICAgfVxyXG4gICAgICAvLyAgIGlmIChoIDwgdykge1xyXG4gICAgICAvLyAgICAgdyA9IHRoaXMub3V0cHV0V2lkdGggKiAoaGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICAgIC8vICAgICB4ID0gc3RhcnRYICsgKHdpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aCkgLyAyXHJcbiAgICAgIC8vICAgfVxyXG4gICAgICAvLyAgIHRoaXMuX2NsaXBQYXRoRmFjdG9yeSh4LCBzdGFydFksIHcsIGgpXHJcbiAgICAgIC8vIH0sXHJcblxyXG4gICAgICBfY2xpcCAoY3JlYXRlUGF0aCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGN0eC5zYXZlKClcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJyNmZmYnXHJcbiAgICAgICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1pbidcclxuICAgICAgICBjcmVhdGVQYXRoKClcclxuICAgICAgICBjdHguZmlsbCgpXHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2FwcGx5TWV0YWRhdGEgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy51c2VyTWV0YWRhdGEpIHJldHVyblxyXG4gICAgICAgIHZhciB7IHN0YXJ0WCwgc3RhcnRZLCBzY2FsZSB9ID0gdGhpcy51c2VyTWV0YWRhdGFcclxuXHJcbiAgICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc3RhcnRYKSkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHN0YXJ0WFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc3RhcnRZKSkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHN0YXJ0WVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc2NhbGUpKSB7XHJcbiAgICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSBzY2FsZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBudWxsXHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG9uRGltZW5zaW9uQ2hhbmdlICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLl9pbml0aWFsaXplKClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLl9zZXRTaXplKClcclxuICAgICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGUgbGFuZz1cInN0eWx1c1wiPlxyXG4gIC5jcm9wcGEtY29udGFpbmVyXHJcbiAgICBkaXNwbGF5IGlubGluZS1ibG9ja1xyXG4gICAgY3Vyc29yIHBvaW50ZXJcclxuICAgIHRyYW5zaXRpb24gYWxsIDAuM3NcclxuICAgIHBvc2l0aW9uIHJlbGF0aXZlXHJcbiAgICBmb250LXNpemUgMFxyXG4gICAgYWxpZ24tc2VsZiBmbGV4LXN0YXJ0XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yICNlNmU2ZTZcclxuXHJcbiAgICBjYW52YXNcclxuICAgICAgdHJhbnNpdGlvbiBhbGwgMC4zc1xyXG5cclxuICAgICY6aG92ZXJcclxuICAgICAgb3BhY2l0eSAwLjdcclxuXHJcbiAgICAmLmNyb3BwYS0tZHJvcHpvbmVcclxuICAgICAgYm94LXNoYWRvdyBpbnNldCAwIDAgMTBweCBsaWdodG5lc3MoYmxhY2ssIDIwJSlcclxuXHJcbiAgICAgIGNhbnZhc1xyXG4gICAgICAgIG9wYWNpdHkgMC41XHJcblxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkLWNjXHJcbiAgICAgIGN1cnNvciBkZWZhdWx0XHJcblxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eSAxXHJcblxyXG4gICAgJi5jcm9wcGEtLWhhcy10YXJnZXRcclxuICAgICAgY3Vyc29yIG1vdmVcclxuXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5IDFcclxuXHJcbiAgICAgICYuY3JvcHBhLS1kaXNhYmxlZC1telxyXG4gICAgICAgIGN1cnNvciBkZWZhdWx0XHJcblxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkXHJcbiAgICAgIGN1cnNvciBub3QtYWxsb3dlZFxyXG5cclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHkgMVxyXG5cclxuICAgICYuY3JvcHBhLS1wYXNzaXZlXHJcbiAgICAgIGN1cnNvciBkZWZhdWx0XHJcblxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eSAxXHJcblxyXG4gICAgc3ZnLmljb24tcmVtb3ZlXHJcbiAgICAgIHBvc2l0aW9uIGFic29sdXRlXHJcbiAgICAgIGJhY2tncm91bmQgd2hpdGVcclxuICAgICAgYm9yZGVyLXJhZGl1cyA1MCVcclxuICAgICAgZmlsdGVyIGRyb3Atc2hhZG93KC0ycHggMnB4IDJweCByZ2JhKDAsIDAsIDAsIDAuNykpXHJcbiAgICAgIHotaW5kZXggMTBcclxuICAgICAgY3Vyc29yIHBvaW50ZXJcclxuICAgICAgYm9yZGVyIDJweCBzb2xpZCB3aGl0ZVxyXG48L3N0eWxlPlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzY3NzXCI+XHJcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RvYmlhc2FobGluL1NwaW5LaXQvYmxvYi9tYXN0ZXIvc2Nzcy9zcGlubmVycy8xMC1mYWRpbmctY2lyY2xlLnNjc3NcclxuICAuc2stZmFkaW5nLWNpcmNsZSB7XHJcbiAgICAkY2lyY2xlQ291bnQ6IDEyO1xyXG4gICAgJGFuaW1hdGlvbkR1cmF0aW9uOiAxcztcclxuXHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcblxyXG4gICAgLnNrLWNpcmNsZSB7XHJcbiAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgbGVmdDogMDtcclxuICAgICAgdG9wOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC5zay1jaXJjbGUgLnNrLWNpcmNsZS1pbmRpY2F0b3Ige1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICAgIHdpZHRoOiAxNSU7XHJcbiAgICAgIGhlaWdodDogMTUlO1xyXG4gICAgICBib3JkZXItcmFkaXVzOiAxMDAlO1xyXG4gICAgICBhbmltYXRpb246IHNrLWNpcmNsZUZhZGVEZWxheSAkYW5pbWF0aW9uRHVyYXRpb24gaW5maW5pdGUgZWFzZS1pbi1vdXQgYm90aDtcclxuICAgIH1cclxuXHJcbiAgICBAZm9yICRpIGZyb20gMiB0aHJvdWdoICRjaXJjbGVDb3VudCB7XHJcbiAgICAgIC5zay1jaXJjbGUjeyRpfSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnIC8gJGNpcmNsZUNvdW50ICogKCRpIC0gMSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQGZvciAkaSBmcm9tIDIgdGhyb3VnaCAkY2lyY2xlQ291bnQge1xyXG4gICAgICAuc2stY2lyY2xlI3skaX0gLnNrLWNpcmNsZS1pbmRpY2F0b3Ige1xyXG4gICAgICAgIGFuaW1hdGlvbi1kZWxheTogLSAkYW5pbWF0aW9uRHVyYXRpb24gKyAkYW5pbWF0aW9uRHVyYXRpb24gLyAkY2lyY2xlQ291bnQgKlxyXG4gICAgICAgICAgKFxyXG4gICAgICAgICAgICAkaSAtIDFcclxuICAgICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgQGtleWZyYW1lcyBzay1jaXJjbGVGYWRlRGVsYXkge1xyXG4gICAgMCUsXHJcbiAgICAzOSUsXHJcbiAgICAxMDAlIHtcclxuICAgICAgb3BhY2l0eTogMDtcclxuICAgIH1cclxuICAgIDQwJSB7XHJcbiAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICB9XHJcbiAgfVxyXG48L3N0eWxlPlxyXG5cclxuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsImltcG9ydCBjb21wb25lbnQgZnJvbSAnLi9jcm9wcGVyLnZ1ZSdcclxuaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJ1xyXG5cclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgY29tcG9uZW50TmFtZTogJ2Nyb3BwYSdcclxufVxyXG5cclxuY29uc3QgVnVlQ3JvcHBhID0ge1xyXG4gIGluc3RhbGw6IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBhc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKVxyXG4gICAgbGV0IHZlcnNpb24gPSBOdW1iZXIoVnVlLnZlcnNpb24uc3BsaXQoJy4nKVswXSlcclxuICAgIGlmICh2ZXJzaW9uIDwgMikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHZ1ZS1jcm9wcGEgc3VwcG9ydHMgdnVlIHZlcnNpb24gMi4wIGFuZCBhYm92ZS4gWW91IGFyZSB1c2luZyBWdWVAJHt2ZXJzaW9ufS4gUGxlYXNlIHVwZ3JhZGUgdG8gdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIFZ1ZS5gKVxyXG4gICAgfVxyXG4gICAgbGV0IGNvbXBvbmVudE5hbWUgPSBvcHRpb25zLmNvbXBvbmVudE5hbWUgfHwgJ2Nyb3BwYSdcclxuXHJcbiAgICBjb25zb2xlLmxvZyhjb21wb25lbnQpXHJcblxyXG4gICAgLy8gcmVnaXN0cmF0aW9uXHJcbiAgICBWdWUuY29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudClcclxuICB9LFxyXG5cclxuICBjb21wb25lbnRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsiZGVmaW5lIiwidGhpcyIsInBvaW50Iiwidm0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsImV2dCIsInBvaW50ZXIiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJvbmVQb2ludENvb3JkIiwicG9pbnRlcjEiLCJwb2ludGVyMiIsImNvb3JkMSIsImNvb3JkMiIsIk1hdGgiLCJzcXJ0IiwicG93IiwieCIsInkiLCJpbWciLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsImRvY3VtZW50Iiwid2luZG93IiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwibGVuZ3RoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsImN1cnJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJ0aW1lVG9DYWxsIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiYXJnIiwiaXNBcnJheSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIkhUTUxDYW52YXNFbGVtZW50IiwiYmluU3RyIiwibGVuIiwiYXJyIiwidG9CbG9iIiwiZGVmaW5lUHJvcGVydHkiLCJ0eXBlIiwiYXRvYiIsInRvRGF0YVVSTCIsInNwbGl0IiwiVWludDhBcnJheSIsImkiLCJjaGFyQ29kZUF0IiwiQmxvYiIsImR0IiwiZGF0YVRyYW5zZmVyIiwib3JpZ2luYWxFdmVudCIsInR5cGVzIiwiYXJyYXlCdWZmZXIiLCJ2aWV3IiwiRGF0YVZpZXciLCJnZXRVaW50MTYiLCJieXRlTGVuZ3RoIiwib2Zmc2V0IiwibWFya2VyIiwiZ2V0VWludDMyIiwibGl0dGxlIiwidGFncyIsImJhc2U2NCIsInJlcGxhY2UiLCJiaW5hcnlTdHJpbmciLCJieXRlcyIsImJ1ZmZlciIsIm9yaWVudGF0aW9uIiwiX2NhbnZhcyIsIkNhbnZhc0V4aWZPcmllbnRhdGlvbiIsImRyYXdJbWFnZSIsIl9pbWciLCJJbWFnZSIsInNyYyIsIm9yaSIsIm1hcCIsIm4iLCJpc05hTiIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJmbG9vciIsImluaXRpYWxJbWFnZVR5cGUiLCJTdHJpbmciLCJ2YWwiLCJCb29sZWFuIiwidmFsaWRzIiwiZXZlcnkiLCJpbmRleE9mIiwid29yZCIsInRlc3QiLCJQQ1RfUEVSX1pPT00iLCJNSU5fTVNfUEVSX0NMSUNLIiwiQ0xJQ0tfTU9WRV9USFJFU0hPTEQiLCJNSU5fV0lEVEgiLCJERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCIsIlBJTkNIX0FDQ0VMRVJBVElPTiIsInN5bmNEYXRhIiwicmVuZGVyIiwiZXZlbnRzIiwiSU5JVF9FVkVOVCIsInByb3BzIiwid2lkdGgiLCJoZWlnaHQiLCJwbGFjZWhvbGRlckZvbnRTaXplIiwibmF0dXJhbEhlaWdodCIsImxvYWRpbmdTaXplIiwiX2luaXRpYWxpemUiLCJyQUZQb2x5ZmlsbCIsInRvQmxvYlBvbHlmaWxsIiwic3VwcG9ydHMiLCJzdXBwb3J0RGV0ZWN0aW9uIiwiYmFzaWMiLCJ3YXJuIiwicGFzc2l2ZSIsIiR3YXRjaCIsImRhdGEiLCJzZXQiLCJrZXkiLCIkc2V0IiwicmVtb3ZlIiwiJG5leHRUaWNrIiwiX2RyYXciLCJvbkRpbWVuc2lvbkNoYW5nZSIsIl9zZXRQbGFjZWhvbGRlcnMiLCJpbWFnZVNldCIsIl9wbGFjZUltYWdlIiwib2xkVmFsIiwidSIsIm51bWJlclZhbGlkIiwicG9zIiwiY3VycmVudFBvaW50ZXJDb29yZCIsImltZ0RhdGEiLCJzdGFydFgiLCJzdGFydFkiLCJ1c2VyTWV0YWRhdGEiLCJyb3RhdGluZyIsIm9mZnNldFgiLCJvZmZzZXRZIiwicHJldmVudFdoaXRlU3BhY2UiLCJfcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UiLCJfcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSIsInNjYWxlUmF0aW8iLCJoYXNJbWFnZSIsImFicyIsIiRlbWl0IiwiWk9PTV9FVkVOVCIsIkxPQURJTkdfU1RBUlQiLCJMT0FESU5HX0VORCIsImN0eCIsIiRyZWZzIiwiZmlsZUlucHV0IiwiZmlsZXMiLCJvbGRYIiwib2xkWSIsIk1PVkVfRVZFTlQiLCJhbW91bnQiLCJtb3ZlIiwiem9vbUluIiwiYWNjZWxlcmF0aW9uIiwicmVhbFNwZWVkIiwiem9vbVNwZWVkIiwic3BlZWQiLCJvdXRwdXRXaWR0aCIsInpvb20iLCJzdGVwIiwiZGlzYWJsZVJvdGF0aW9uIiwiZGlzYWJsZWQiLCJwYXJzZUludCIsIl9yb3RhdGVCeVN0ZXAiLCJfc2V0T3JpZW50YXRpb24iLCJtZXRhZGF0YSIsImNvbXByZXNzaW9uUmF0ZSIsIm1pbWVUeXBlIiwicXVhbGl0eUFyZ3VtZW50IiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2VuZXJhdGVCbG9iIiwiYmxvYiIsImVyciIsImRpdiIsImNyZWF0ZUVsZW1lbnQiLCJGaWxlIiwiRmlsZVJlYWRlciIsIkZpbGVMaXN0IiwiY2xpY2siLCJoYWRJbWFnZSIsIm9yaWdpbmFsSW1hZ2UiLCJsb2FkaW5nIiwiSU1BR0VfUkVNT1ZFX0VWRU5UIiwicGx1Z2luIiwiY2xpcFBsdWdpbnMiLCJwdXNoIiwiRXJyb3IiLCJfc2V0U2l6ZSIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY2FudmFzQ29sb3IiLCJnZXRDb250ZXh0IiwiX3NldEluaXRpYWwiLCJvdXRwdXRIZWlnaHQiLCIkc2xvdHMiLCJwbGFjZWhvbGRlciIsInZOb2RlIiwidGFnIiwiZWxtIiwib25Mb2FkIiwiaW1hZ2VMb2FkZWQiLCJvbmxvYWQiLCJ0ZXh0QmFzZWxpbmUiLCJ0ZXh0QWxpZ24iLCJkZWZhdWx0Rm9udFNpemUiLCJmb250U2l6ZSIsImNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSIsImZvbnQiLCJmaWxsU3R5bGUiLCJwbGFjZWhvbGRlckNvbG9yIiwiZmlsbFRleHQiLCJfcGFpbnRCYWNrZ3JvdW5kIiwiX3NldEltYWdlUGxhY2Vob2xkZXIiLCJfc2V0VGV4dFBsYWNlaG9sZGVyIiwiaW5pdGlhbCIsImluaXRpYWxJbWFnZSIsInNldEF0dHJpYnV0ZSIsImJhYmVsSGVscGVycy50eXBlb2YiLCJjdXJyZW50SXNJbml0aWFsIiwiX29ubG9hZCIsImRhdGFzZXQiLCJvbmVycm9yIiwiSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQiLCJkaXNhYmxlQ2xpY2tUb0Nob29zZSIsInN1cHBvcnRUb3VjaCIsImNob29zZUZpbGUiLCJpbnB1dCIsImZpbGUiLCJfb25OZXdGaWxlSW4iLCJGSUxFX0NIT09TRV9FVkVOVCIsIl9maWxlU2l6ZUlzVmFsaWQiLCJGSUxFX1NJWkVfRVhDRUVEX0VWRU5UIiwiZmlsZVNpemVMaW1pdCIsIl9maWxlVHlwZUlzVmFsaWQiLCJGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQiLCJuYW1lIiwidG9Mb3dlckNhc2UiLCJwb3AiLCJhY2NlcHQiLCJmciIsImUiLCJmaWxlRGF0YSIsInRhcmdldCIsInJlc3VsdCIsImdldEZpbGVPcmllbnRhdGlvbiIsImJhc2U2NFRvQXJyYXlCdWZmZXIiLCJORVdfSU1BR0UiLCJyZWFkQXNEYXRhVVJMIiwic2l6ZSIsImJhc2VNaW1ldHlwZSIsInQiLCJ0cmltIiwiY2hhckF0Iiwic2xpY2UiLCJmaWxlQmFzZVR5cGUiLCJhcHBseU1ldGFkYXRhIiwiX2FzcGVjdEZpbGwiLCJpbml0aWFsU2l6ZSIsIl9hc3BlY3RGaXQiLCJfbmF0dXJhbFNpemUiLCJpbml0aWFsUG9zaXRpb24iLCJleGVjIiwiX2FwcGx5TWV0YWRhdGEiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsImNhbnZhc1JhdGlvIiwiYXNwZWN0UmF0aW8iLCJwb2ludGVyTW92ZWQiLCJwb2ludGVyQ29vcmQiLCJnZXRQb2ludGVyQ29vcmRzIiwicG9pbnRlclN0YXJ0Q29vcmQiLCJ0YWJTdGFydCIsInZhbHVlT2YiLCJ3aGljaCIsImRyYWdnaW5nIiwicGluY2hpbmciLCJjb29yZCIsImxhc3RNb3ZpbmdDb29yZCIsImRpc2FibGVQaW5jaFRvWm9vbSIsInBpbmNoRGlzdGFuY2UiLCJnZXRQaW5jaERpc3RhbmNlIiwiY2FuY2VsRXZlbnRzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9oYW5kbGVQb2ludGVyRW5kIiwicG9pbnRlck1vdmVEaXN0YW5jZSIsInRhYkVuZCIsImRpc2FibGVEcmFnVG9Nb3ZlIiwicHJldmVudERlZmF1bHQiLCJkaXN0YW5jZSIsImRlbHRhIiwiZGlzYWJsZVNjcm9sbFRvWm9vbSIsInNjcm9sbGluZyIsIndoZWVsRGVsdGEiLCJkZWx0YVkiLCJkZXRhaWwiLCJyZXZlcnNlU2Nyb2xsVG9ab29tIiwiZGlzYWJsZURyYWdBbmREcm9wIiwiZXZlbnRIYXNGaWxlIiwicmVwbGFjZURyb3AiLCJmaWxlRHJhZ2dlZE92ZXIiLCJpdGVtcyIsIml0ZW0iLCJraW5kIiwiZ2V0QXNGaWxlIiwidXNlT3JpZ2luYWwiLCJnZXRSb3RhdGVkSW1hZ2UiLCJmbGlwWCIsImZsaXBZIiwicm90YXRlOTAiLCJjbGVhclJlY3QiLCJmaWxsUmVjdCIsIl9kcmF3RnJhbWUiLCJfY2xpcCIsIl9jcmVhdGVDb250YWluZXJDbGlwUGF0aCIsIkRSQVciLCJORVdfSU1BR0VfRFJBV04iLCJyYWRpdXMiLCJpbWFnZUJvcmRlclJhZGl1cyIsImJlZ2luUGF0aCIsIm1vdmVUbyIsImxpbmVUbyIsInF1YWRyYXRpY0N1cnZlVG8iLCJjbG9zZVBhdGgiLCJfY2xpcFBhdGhGYWN0b3J5IiwiZm9yRWFjaCIsImNyZWF0ZVBhdGgiLCJzYXZlIiwiZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uIiwiZmlsbCIsInJlc3RvcmUiLCJzY2FsZSIsImRlZmF1bHRPcHRpb25zIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImFzc2lnbiIsInZlcnNpb24iLCJjb21wb25lbnROYW1lIiwibG9nIiwiY29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQ0FBQyxVQUFVLElBQUksRUFBRSxPQUFPLEVBQUU7SUFDdEIsSUFBSSxPQUFPQSxTQUFNLEtBQUssVUFBVSxJQUFJQSxTQUFNLENBQUMsR0FBRyxFQUFFO1FBQzVDQSxTQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3ZCLE1BQU0sQUFBaUM7UUFDcEMsY0FBYyxHQUFHLE9BQU8sRUFBRSxDQUFDO0tBQzlCLEFBRUY7Q0FDRixDQUFDQyxjQUFJLEVBQUUsWUFBWTtFQUNsQixZQUFZLENBQUM7O0VBRWIsU0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7SUFDeEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDOztJQUVqRixJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyQixJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyQixJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUUsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDckMsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDOztJQUV4QyxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLElBQUksR0FBRyxHQUFHLE1BQU0s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
