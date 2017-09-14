/*
 * vue-croppa v0.3.4
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
  initialImage: [String, HTMLImageElement],
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
      var valids = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right', 'left top', 'right top', 'left bottom', 'right bottom'];
      return valids.indexOf(val) >= 0 || /^-?\d+% -?\d+%$/.test(val);
    }
  }
};

var events = {
  INIT_EVENT: 'init',
  FILE_CHOOSE_EVENT: 'file-choose',
  FILE_SIZE_EXCEED_EVENT: 'file-size-exceed',
  FILE_TYPE_MISMATCH_EVENT: 'file-type-mismatch',
  NEW_IMAGE: 'new-image',
  IMAGE_REMOVE_EVENT: 'image-remove',
  MOVE_EVENT: 'move',
  ZOOM_EVENT: 'zoom',
  DRAW: 'draw',
  INITIAL_IMAGE_LOADED_EVENT: 'initial-image-loaded'
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
var PINCH_ACCELERATION = 2; // The amount of times by which the pinching is more sensitive than the scolling
// const DEBUG = false

var component = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { ref: "wrapper", class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') + ' ' + (_vm.disabled ? 'croppa--disabled' : '') + ' ' + (_vm.disableClickToChoose ? 'croppa--disabled-cc' : '') + ' ' + (_vm.disableDragToMove && _vm.disableScrollToZoom ? 'croppa--disabled-mz' : '') + ' ' + (_vm.fileDraggedOver ? 'croppa--dropzone' : ''), on: { "dragenter": function dragenter($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleDragEnter($event);
        }, "dragleave": function dragleave($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleDragLeave($event);
        }, "dragover": function dragover($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleDragOver($event);
        }, "drop": function drop($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleDrop($event);
        } } }, [_c('input', { ref: "fileInput", staticStyle: { "height": "1px", "width": "1px", "overflow": "hidden", "margin-left": "-99999px", "position": "absolute" }, attrs: { "type": "file", "accept": _vm.accept, "disabled": _vm.disabled }, on: { "change": _vm.handleInputChange } }), _c('div', { staticClass: "slots", staticStyle: { "width": "0", "height": "0", "visibility": "hidden" } }, [_vm._t("initial"), _vm._t("placeholder")], 2), _c('canvas', { ref: "canvas", on: { "click": function click($event) {
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
      originalImage: null,
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
      pointerStartCoord: null,
      naturalWidth: 0,
      naturalHeight: 0,
      scaleRatio: null,
      orientation: 1,
      userMetadata: null,
      imageSet: false
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

    var supports = this.supportDetection();
    if (!supports.basic) {
      console.warn('Your browser does not support vue-croppa functionality.');
    }
  },


  watch: {
    value: function value(val) {
      this.instance = val;
    },
    realWidth: function realWidth() {
      if (!this.img) {
        this.init();
      } else {
        if (this.preventWhiteSpace) {
          this.imageSet = false;
        }
        this.setSize();
        this.placeImage();
      }
    },
    realHeight: function realHeight() {
      if (!this.img) {
        this.init();
      } else {
        if (this.preventWhiteSpace) {
          this.imageSet = false;
        }
        this.setSize();
        this.placeImage();
      }
    },
    canvasColor: function canvasColor() {
      if (!this.img) {
        this.init();
      } else {
        this.draw();
      }
    },
    placeholder: function placeholder() {
      if (!this.img) {
        this.init();
      }
    },
    placeholderColor: function placeholderColor() {
      if (!this.img) {
        this.init();
      }
    },
    realPlaceholderFontSize: function realPlaceholderFontSize() {
      if (!this.img) {
        this.init();
      }
    },
    preventWhiteSpace: function preventWhiteSpace() {
      if (this.preventWhiteSpace) {
        this.imageSet = false;
      }
      this.placeImage();
    }
  },

  methods: {
    init: function init() {
      var _this = this;

      this.canvas = this.$refs.canvas;
      this.setSize();
      this.canvas.style.backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : typeof this.canvasColor === 'string' ? this.canvasColor : '';
      this.ctx = this.canvas.getContext('2d');
      this.originalImage = null;
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
        rotate: function rotate() {
          var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

          if (_this.disableRotation || _this.disabled) return;
          step = parseInt(step);
          if (isNaN(step) || step > 3 || step < -3) {
            console.warn('Invalid argument for rotate() method. It should one of the integers from -3 to 3.');
            step = 1;
          }
          _this.rotateByStep(step);
        },
        flipX: function flipX() {
          if (_this.disableRotation || _this.disabled) return;
          _this.rotate(2);
        },
        flipY: function flipY() {
          if (_this.disableRotation || _this.disabled) return;
          _this.rotate(4);
        },
        refresh: function refresh() {
          _this.$nextTick(_this.init);
        },
        hasImage: function hasImage() {
          return !!_this.img;
        },
        remove: this.remove,
        chooseFile: this.chooseFile,
        generateDataUrl: this.generateDataUrl,
        generateBlob: this.generateBlob,
        promisedBlob: this.promisedBlob,
        supportDetection: this.supportDetection,
        getMetadata: this.getMetadata,
        applyMetadata: function applyMetadata(metadata) {
          if (!metadata || !_this.img) return;
          _this.userMetadata = metadata;
          var ori = metadata.orientation || _this.orientation || 1;
          _this.rotate(ori, true);
        }
      });
    },
    setSize: function setSize() {
      this.canvas.width = this.realWidth;
      this.canvas.height = this.realHeight;
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
    },
    rotateByStep: function rotateByStep(step) {
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
      this.rotate(orientation);
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

      this.setImagePlaceholder();
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      var defaultFontSize = this.realWidth * DEFAULT_PLACEHOLDER_TAKEUP / this.placeholder.length;
      var fontSize = !this.realPlaceholderFontSize || this.realPlaceholderFontSize == 0 ? defaultFontSize : this.realPlaceholderFontSize;
      ctx.font = fontSize + 'px sans-serif';
      ctx.fillStyle = !this.placeholderColor || this.placeholderColor == 'default' ? '#606060' : this.placeholderColor;
      ctx.fillText(this.placeholder, this.realWidth / 2, this.realHeight / 2);

      var hadImage = this.img != null;
      this.originalImage = null;
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imgData = {};
      this.orientation = 1;
      this.scaleRatio = null;
      this.userMetadata = null;
      this.imageSet = false;

      if (hadImage) {
        this.$emit(events.IMAGE_REMOVE_EVENT);
      }
    },
    setImagePlaceholder: function setImagePlaceholder() {
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
        _this2.ctx.drawImage(img, 0, 0, _this2.realWidth, _this2.realHeight);
      };

      if (u.imageLoaded(img)) {
        onLoad();
      } else {
        img.onload = onLoad;
      }
    },
    setInitial: function setInitial() {
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
        this.remove();
        return;
      }
      if (u.imageLoaded(img)) {
        this._onload(img, +img.dataset['exifOrientation']);
        this.$emit(events.INITIAL_IMAGE_LOADED_EVENT);
      } else {
        img.onload = function () {
          _this3._onload(img, +img.dataset['exifOrientation']);
          _this3.$emit(events.INITIAL_IMAGE_LOADED_EVENT);
        };

        img.onerror = function () {
          _this3.remove();
        };
      }
    },
    _onload: function _onload(img) {
      var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      this.originalImage = img;
      this.img = img;

      if (isNaN(orientation)) {
        orientation = 1;
      }

      this.rotate(orientation);
    },
    chooseFile: function chooseFile() {
      this.$refs.fileInput.click();
    },
    handleClick: function handleClick() {
      if (!this.img && !this.disableClickToChoose && !this.disabled && !this.supportTouch) {
        this.chooseFile();
      }
    },
    handleInputChange: function handleInputChange() {
      var input = this.$refs.fileInput;
      if (!input.files.length) return;

      var file = input.files[0];
      this.onNewFileIn(file);
    },
    onNewFileIn: function onNewFileIn(file) {
      var _this4 = this;

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
          var orientation = u.getFileOrientation(u.base64ToArrayBuffer(fileData));
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
    placeImage: function placeImage(applyMetadata) {
      var imgData = this.imgData;

      this.naturalWidth = this.img.naturalWidth;
      this.naturalHeight = this.img.naturalHeight;

      imgData.startX = u.numberValid(imgData.startX) ? imgData.startX : 0;
      imgData.startY = u.numberValid(imgData.startY) ? imgData.startY : 0;

      if (!this.imageSet) {
        if (this.initialSize == 'contain') {
          this.aspectFit();
        } else if (this.initialSize == 'natural') {
          this.naturalSize();
        } else {
          this.aspectFill();
        }
      } else if (u.numberValid(this.scaleRatio)) {
        imgData.width = this.naturalWidth * this.scaleRatio;
        imgData.height = this.naturalHeight * this.scaleRatio;
      } else {
        this.aspectFill();
      }
      this.scaleRatio = imgData.width / this.naturalWidth;

      if (!this.imageSet) {
        if (/top/.test(this.initialPosition)) {
          imgData.startY = 0;
        } else if (/bottom/.test(this.initialPosition)) {
          imgData.startY = this.realHeight - imgData.height;
        }

        if (/left/.test(this.initialPosition)) {
          imgData.startX = 0;
        } else if (/right/.test(this.initialPosition)) {
          imgData.startX = this.realWidth - imgData.width;
        }

        if (/^-?\d+% -?\d+%$/.test(this.initialPosition)) {
          var result = /^(-?\d+)% (-?\d+)%$/.exec(this.initialPosition);
          var x = +result[1] / 100;
          var y = +result[2] / 100;
          imgData.startX = x * (this.realWidth - imgData.width);
          imgData.startY = y * (this.realHeight - imgData.height);
        }
      }

      applyMetadata && this.applyMetadata();

      if (this.preventWhiteSpace) {
        this.preventMovingToWhiteSpace();
      }

      if (!this.imageSet) {
        this.imageSet = true;
      }

      this.draw();
    },
    aspectFill: function aspectFill() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var imgRatio = imgHeight / imgWidth;
      var canvasRatio = this.realHeight / this.realWidth;
      var scaleRatio = void 0;
      if (imgRatio < canvasRatio) {
        scaleRatio = imgHeight / this.realHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.realHeight;
        this.imgData.startX = -(this.imgData.width - this.realWidth) / 2;
        this.imgData.startY = 0;
      } else {
        scaleRatio = imgWidth / this.realWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.realWidth;
        this.imgData.startY = -(this.imgData.height - this.realHeight) / 2;
        this.imgData.startX = 0;
      }
    },
    aspectFit: function aspectFit() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var imgRatio = imgHeight / imgWidth;
      var canvasRatio = this.realHeight / this.realWidth;
      var scaleRatio = void 0;
      if (imgRatio < canvasRatio) {
        scaleRatio = imgWidth / this.realWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.realWidth;
        this.imgData.startY = -(this.imgData.height - this.realHeight) / 2;
      } else {
        scaleRatio = imgHeight / this.realHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.realHeight;
        this.imgData.startX = -(this.imgData.width - this.realWidth) / 2;
      }
    },
    naturalSize: function naturalSize() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      this.imgData.width = imgWidth;
      this.imgData.height = imgHeight;
      this.imgData.startX = -(this.imgData.width - this.realWidth) / 2;
      this.imgData.startY = -(this.imgData.height - this.realHeight) / 2;
    },
    handlePointerStart: function handlePointerStart(evt) {
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
        this.zoom(this.reverseScrollToZoom, coord);
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseScrollToZoom, coord);
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
          var _x5 = this.realHeight / this.imgData.height;
          this.imgData.height = this.realHeight;
          this.imgData.width = this.imgData.width * _x5;
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
        this.scaleRatio = this.imgData.width / this.naturalWidth;
      }
    },
    rotate: function rotate() {
      var _this5 = this;

      var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
      var useOriginal = arguments[1];

      if (!this.img) return;
      if (orientation > 1 || useOriginal) {
        var _img = u.getRotatedImage(useOriginal ? this.originalImage : this.img, orientation);
        _img.onload = function () {
          _this5.img = _img;
          _this5.placeImage(useOriginal);
        };
      } else {
        this.placeImage();
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
    paintBackground: function paintBackground() {
      var backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : this.canvasColor;
      this.ctx.fillStyle = backgroundColor;
      this.ctx.clearRect(0, 0, this.realWidth, this.realHeight);
      this.ctx.fillRect(0, 0, this.realWidth, this.realHeight);
    },
    draw: function draw() {
      if (!this.img) return;
      if (window.requestAnimationFrame) {
        requestAnimationFrame(this._drawFrame);
      } else {
        this._drawFrame();
      }
    },
    _drawFrame: function _drawFrame() {
      var ctx = this.ctx;
      var _imgData = this.imgData,
          startX = _imgData.startX,
          startY = _imgData.startY,
          width = _imgData.width,
          height = _imgData.height;


      this.paintBackground();
      ctx.drawImage(this.img, startX, startY, width, height);
      this.$emit(events.DRAW, ctx);
    },
    generateDataUrl: function generateDataUrl(type, compressionRate) {
      if (!this.img) return '';
      return this.canvas.toDataURL(type, compressionRate);
    },
    generateBlob: function generateBlob(callback, mimeType, qualityArgument) {
      if (!this.img) return null;
      this.canvas.toBlob(callback, mimeType, qualityArgument);
    },
    promisedBlob: function promisedBlob() {
      var _this6 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof Promise == 'undefined') {
        console.warn('No Promise support. Please add Promise polyfill if you want to use this method.');
        return;
      }
      return new Promise(function (resolve, reject) {
        try {
          _this6.generateBlob(function (blob) {
            resolve(blob);
          }, args);
        } catch (err) {
          reject(err);
        }
      });
    },
    getMetadata: function getMetadata() {
      if (!this.img) return {};
      var _imgData2 = this.imgData,
          startX = _imgData2.startX,
          startY = _imgData2.startY;


      return {
        startX: startX,
        startY: startY,
        scale: this.scaleRatio,
        orientation: this.orientation
      };
    },
    applyMetadata: function applyMetadata() {
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
        this.imgData.width = this.naturalWidth * scale;
        this.imgData.height = this.naturalHeight * scale;
        this.scaleRatio = scale;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgYmFzZTY0ID0gYmFzZTY0LnJlcGxhY2UoL15kYXRhOihbXjtdKyk7YmFzZTY0LC9nbWksICcnKVxyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9IE51bWJlci5pc0ludGVnZXIgfHwgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodmFsdWUpICYmIE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgdmFsdWU6IE9iamVjdCxcclxuICB3aWR0aDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMjAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBoZWlnaHQ6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXI6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdDaG9vc2UgYW4gaW1hZ2UnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckNvbG9yOiB7XHJcbiAgICBkZWZhdWx0OiAnIzYwNjA2MCdcclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyRm9udFNpemU6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+PSAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBjYW52YXNDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJ3RyYW5zcGFyZW50J1xyXG4gIH0sXHJcbiAgcXVhbGl0eToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWwpICYmIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnLmpwZywuanBlZywucG5nLC5naWYsLmJtcCwud2VicCwuc3ZnLC50aWZmJ1xyXG4gIH0sXHJcbiAgZmlsZVNpemVMaW1pdDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnQW5kRHJvcDogQm9vbGVhbixcclxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ1RvTW92ZTogQm9vbGVhbixcclxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIGRpc2FibGVQaW5jaFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUm90YXRpb246IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9LFxyXG4gIGluaXRpYWxJbWFnZTogW1N0cmluZywgSFRNTEltYWdlRWxlbWVudF0sXHJcbiAgaW5pdGlhbFNpemU6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdjb3ZlcicsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA9PT0gJ2NvdmVyJyB8fCB2YWwgPT09ICdjb250YWluJyB8fCB2YWwgPT09ICduYXR1cmFsJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgaW5pdGlhbFBvc2l0aW9uOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnY2VudGVyJyxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICB2YXIgdmFsaWRzID0gW1xyXG4gICAgICAgICdjZW50ZXInLFxyXG4gICAgICAgICd0b3AnLFxyXG4gICAgICAgICdib3R0b20nLFxyXG4gICAgICAgICdsZWZ0JyxcclxuICAgICAgICAncmlnaHQnLFxyXG4gICAgICAgICd0b3AgbGVmdCcsXHJcbiAgICAgICAgJ3RvcCByaWdodCcsXHJcbiAgICAgICAgJ2JvdHRvbSBsZWZ0JyxcclxuICAgICAgICAnYm90dG9tIHJpZ2h0JyxcclxuICAgICAgICAnbGVmdCB0b3AnLFxyXG4gICAgICAgICdyaWdodCB0b3AnLFxyXG4gICAgICAgICdsZWZ0IGJvdHRvbScsXHJcbiAgICAgICAgJ3JpZ2h0IGJvdHRvbSdcclxuICAgICAgXVxyXG4gICAgICByZXR1cm4gdmFsaWRzLmluZGV4T2YodmFsKSA+PSAwIHx8IC9eLT9cXGQrJSAtP1xcZCslJC8udGVzdCh2YWwpXHJcbiAgICB9XHJcbiAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQge1xuICBJTklUX0VWRU5UOiAnaW5pdCcsXG4gIEZJTEVfQ0hPT1NFX0VWRU5UOiAnZmlsZS1jaG9vc2UnLFxuICBGSUxFX1NJWkVfRVhDRUVEX0VWRU5UOiAnZmlsZS1zaXplLWV4Y2VlZCcsXG4gIEZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVDogJ2ZpbGUtdHlwZS1taXNtYXRjaCcsXG4gIE5FV19JTUFHRTogJ25ldy1pbWFnZScsXG4gIElNQUdFX1JFTU9WRV9FVkVOVDogJ2ltYWdlLXJlbW92ZScsXG4gIE1PVkVfRVZFTlQ6ICdtb3ZlJyxcbiAgWk9PTV9FVkVOVDogJ3pvb20nLFxuICBEUkFXOiAnZHJhdycsXG4gIElOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UOiAnaW5pdGlhbC1pbWFnZS1sb2FkZWQnXG59XG4iLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiByZWY9XCJ3cmFwcGVyXCJcclxuICAgICAgIDpjbGFzcz1cImBjcm9wcGEtY29udGFpbmVyICR7aW1nID8gJ2Nyb3BwYS0taGFzLXRhcmdldCcgOiAnJ30gJHtkaXNhYmxlZCA/ICdjcm9wcGEtLWRpc2FibGVkJyA6ICcnfSAke2Rpc2FibGVDbGlja1RvQ2hvb3NlID8gJ2Nyb3BwYS0tZGlzYWJsZWQtY2MnIDogJyd9ICR7ZGlzYWJsZURyYWdUb01vdmUgJiYgZGlzYWJsZVNjcm9sbFRvWm9vbSA/ICdjcm9wcGEtLWRpc2FibGVkLW16JyA6ICcnfSAke2ZpbGVEcmFnZ2VkT3ZlciA/ICdjcm9wcGEtLWRyb3B6b25lJyA6ICcnfWBcIlxyXG4gICAgICAgQGRyYWdlbnRlci5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcmFnRW50ZXJcIlxyXG4gICAgICAgQGRyYWdsZWF2ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcmFnTGVhdmVcIlxyXG4gICAgICAgQGRyYWdvdmVyLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdPdmVyXCJcclxuICAgICAgIEBkcm9wLnN0b3AucHJldmVudD1cImhhbmRsZURyb3BcIj5cclxuICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiXHJcbiAgICAgICAgICAgOmFjY2VwdD1cImFjY2VwdFwiXHJcbiAgICAgICAgICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxyXG4gICAgICAgICAgIHJlZj1cImZpbGVJbnB1dFwiXHJcbiAgICAgICAgICAgQGNoYW5nZT1cImhhbmRsZUlucHV0Q2hhbmdlXCJcclxuICAgICAgICAgICBzdHlsZT1cImhlaWdodDoxcHg7d2lkdGg6MXB4O292ZXJmbG93OmhpZGRlbjttYXJnaW4tbGVmdDotOTk5OTlweDtwb3NpdGlvbjphYnNvbHV0ZTtcIiAvPlxyXG4gICAgPGRpdiBjbGFzcz1cInNsb3RzXCJcclxuICAgICAgICAgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW47XCI+XHJcbiAgICAgIDxzbG90IG5hbWU9XCJpbml0aWFsXCI+PC9zbG90PlxyXG4gICAgICA8c2xvdCBuYW1lPVwicGxhY2Vob2xkZXJcIj48L3Nsb3Q+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCJcclxuICAgICAgICAgICAgQGNsaWNrLnN0b3AucHJldmVudD1cImhhbmRsZUNsaWNrXCJcclxuICAgICAgICAgICAgQHRvdWNoc3RhcnQuc3RvcD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEBtb3VzZWRvd24uc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHBvaW50ZXJzdGFydC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEB0b3VjaGNhbmNlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQG1vdXNldXAuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcmNhbmNlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNobW92ZS5zdG9wPVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBAbW91c2Vtb3ZlLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJtb3ZlLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQERPTU1vdXNlU2Nyb2xsLnN0b3A9XCJoYW5kbGVXaGVlbFwiXHJcbiAgICAgICAgICAgIEB3aGVlbC5zdG9wPVwiaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAbW91c2V3aGVlbC5zdG9wPVwiaGFuZGxlV2hlZWxcIj48L2NhbnZhcz5cclxuICAgIDxzdmcgY2xhc3M9XCJpY29uIGljb24tcmVtb3ZlXCJcclxuICAgICAgICAgdi1pZj1cInNob3dSZW1vdmVCdXR0b24gJiYgaW1nXCJcclxuICAgICAgICAgQGNsaWNrPVwicmVtb3ZlXCJcclxuICAgICAgICAgOnN0eWxlPVwiYHRvcDogLSR7aGVpZ2h0LzQwfXB4OyByaWdodDogLSR7d2lkdGgvNDB9cHhgXCJcclxuICAgICAgICAgdmlld0JveD1cIjAgMCAxMDI0IDEwMjRcIlxyXG4gICAgICAgICB2ZXJzaW9uPVwiMS4xXCJcclxuICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcbiAgICAgICAgIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiXHJcbiAgICAgICAgIDp3aWR0aD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIlxyXG4gICAgICAgICA6aGVpZ2h0PVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aC8xMFwiPlxyXG4gICAgICA8cGF0aCBkPVwiTTUxMS45MjEyMzEgMEMyMjkuMTc5MDc3IDAgMCAyMjkuMjU3ODQ2IDAgNTEyIDAgNzk0LjcwMjc2OSAyMjkuMTc5MDc3IDEwMjQgNTExLjkyMTIzMSAxMDI0IDc5NC43ODE1MzggMTAyNCAxMDI0IDc5NC43MDI3NjkgMTAyNCA1MTIgMTAyNCAyMjkuMjU3ODQ2IDc5NC43ODE1MzggMCA1MTEuOTIxMjMxIDBaTTczMi4wNDE4NDYgNjUwLjYzMzg0NiA2NTAuNTE1NjkyIDczMi4wODEyMzFDNjUwLjUxNTY5MiA3MzIuMDgxMjMxIDUyMS40OTE2OTIgNTkzLjY4MzY5MiA1MTEuODgxODQ2IDU5My42ODM2OTIgNTAyLjQyOTUzOCA1OTMuNjgzNjkyIDM3My4zNjYxNTQgNzMyLjA4MTIzMSAzNzMuMzY2MTU0IDczMi4wODEyMzFMMjkxLjc2MTIzMSA2NTAuNjMzODQ2QzI5MS43NjEyMzEgNjUwLjYzMzg0NiA0MzAuMzE2MzA4IDUyMy41MDAzMDggNDMwLjMxNjMwOCA1MTIuMTk2OTIzIDQzMC4zMTYzMDggNTAwLjY5NjYxNSAyOTEuNzYxMjMxIDM3My41MjM2OTIgMjkxLjc2MTIzMSAzNzMuNTIzNjkyTDM3My4zNjYxNTQgMjkxLjkxODc2OUMzNzMuMzY2MTU0IDI5MS45MTg3NjkgNTAzLjQ1MzUzOCA0MzAuMzk1MDc3IDUxMS44ODE4NDYgNDMwLjM5NTA3NyA1MjAuMzQ5NTM4IDQzMC4zOTUwNzcgNjUwLjUxNTY5MiAyOTEuOTE4NzY5IDY1MC41MTU2OTIgMjkxLjkxODc2OUw3MzIuMDQxODQ2IDM3My41MjM2OTJDNzMyLjA0MTg0NiAzNzMuNTIzNjkyIDU5My40NDczODUgNTAyLjU0NzY5MiA1OTMuNDQ3Mzg1IDUxMi4xOTY5MjMgNTkzLjQ0NzM4NSA1MjEuNDEyOTIzIDczMi4wNDE4NDYgNjUwLjYzMzg0NiA3MzIuMDQxODQ2IDY1MC42MzM4NDZaXCJcclxuICAgICAgICAgICAgOmZpbGw9XCJyZW1vdmVCdXR0b25Db2xvclwiPjwvcGF0aD5cclxuICAgIDwvc3ZnPlxyXG4gIDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHNjcmlwdD5cclxuICBpbXBvcnQgdSBmcm9tICcuL3V0aWwnXHJcbiAgaW1wb3J0IHByb3BzIGZyb20gJy4vcHJvcHMnXHJcbiAgaW1wb3J0IGV2ZW50cyBmcm9tICcuL2V2ZW50cydcclxuXHJcbiAgY29uc3QgUENUX1BFUl9aT09NID0gMSAvIDEwMDAwMCAvLyBUaGUgYW1vdW50IG9mIHpvb21pbmcgZXZlcnl0aW1lIGl0IGhhcHBlbnMsIGluIHBlcmNlbnRhZ2Ugb2YgaW1hZ2Ugd2lkdGguXHJcbiAgY29uc3QgTUlOX01TX1BFUl9DTElDSyA9IDUwMCAvLyBJZiB0b3VjaCBkdXJhdGlvbiBpcyBzaG9ydGVyIHRoYW4gdGhlIHZhbHVlLCB0aGVuIGl0IGlzIGNvbnNpZGVyZWQgYXMgYSBjbGljay5cclxuICBjb25zdCBDTElDS19NT1ZFX1RIUkVTSE9MRCA9IDEwMCAvLyBJZiB0b3VjaCBtb3ZlIGRpc3RhbmNlIGlzIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlLCB0aGVuIGl0IHdpbGwgYnkgbm8gbWVhbiBiZSBjb25zaWRlcmVkIGFzIGEgY2xpY2suXHJcbiAgY29uc3QgTUlOX1dJRFRIID0gMTAgLy8gVGhlIG1pbmltYWwgd2lkdGggdGhlIHVzZXIgY2FuIHpvb20gdG8uXHJcbiAgY29uc3QgREVGQVVMVF9QTEFDRUhPTERFUl9UQUtFVVAgPSAyIC8gMyAvLyBQbGFjZWhvbGRlciB0ZXh0IGJ5IGRlZmF1bHQgdGFrZXMgdXAgdGhpcyBhbW91bnQgb2YgdGltZXMgb2YgY2FudmFzIHdpZHRoLlxyXG4gIGNvbnN0IFBJTkNIX0FDQ0VMRVJBVElPTiA9IDIgLy8gVGhlIGFtb3VudCBvZiB0aW1lcyBieSB3aGljaCB0aGUgcGluY2hpbmcgaXMgbW9yZSBzZW5zaXRpdmUgdGhhbiB0aGUgc2NvbGxpbmdcclxuICAvLyBjb25zdCBERUJVRyA9IGZhbHNlXHJcblxyXG4gIGV4cG9ydCBkZWZhdWx0IHtcclxuICAgIG1vZGVsOiB7XHJcbiAgICAgIHByb3A6ICd2YWx1ZScsXHJcbiAgICAgIGV2ZW50OiAnaW5pdCdcclxuICAgIH0sXHJcblxyXG4gICAgcHJvcHM6IHByb3BzLFxyXG5cclxuICAgIGRhdGEgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGluc3RhbmNlOiBudWxsLFxyXG4gICAgICAgIGNhbnZhczogbnVsbCxcclxuICAgICAgICBjdHg6IG51bGwsXHJcbiAgICAgICAgb3JpZ2luYWxJbWFnZTogbnVsbCxcclxuICAgICAgICBpbWc6IG51bGwsXHJcbiAgICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICAgIGxhc3RNb3ZpbmdDb29yZDogbnVsbCxcclxuICAgICAgICBpbWdEYXRhOiB7fSxcclxuICAgICAgICBkYXRhVXJsOiAnJyxcclxuICAgICAgICBmaWxlRHJhZ2dlZE92ZXI6IGZhbHNlLFxyXG4gICAgICAgIHRhYlN0YXJ0OiAwLFxyXG4gICAgICAgIHBpbmNoaW5nOiBmYWxzZSxcclxuICAgICAgICBwaW5jaERpc3RhbmNlOiAwLFxyXG4gICAgICAgIHN1cHBvcnRUb3VjaDogZmFsc2UsXHJcbiAgICAgICAgcG9pbnRlck1vdmVkOiBmYWxzZSxcclxuICAgICAgICBwb2ludGVyU3RhcnRDb29yZDogbnVsbCxcclxuICAgICAgICBuYXR1cmFsV2lkdGg6IDAsXHJcbiAgICAgICAgbmF0dXJhbEhlaWdodDogMCxcclxuICAgICAgICBzY2FsZVJhdGlvOiBudWxsLFxyXG4gICAgICAgIG9yaWVudGF0aW9uOiAxLFxyXG4gICAgICAgIHVzZXJNZXRhZGF0YTogbnVsbCxcclxuICAgICAgICBpbWFnZVNldDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICByZWFsV2lkdGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWFsSGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQgKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlYWxQbGFjZWhvbGRlckZvbnRTaXplICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlckZvbnRTaXplICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbW91bnRlZCAoKSB7XHJcbiAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICAgIHUuckFGUG9seWZpbGwoKVxyXG4gICAgICB1LnRvQmxvYlBvbHlmaWxsKClcclxuXHJcbiAgICAgIGxldCBzdXBwb3J0cyA9IHRoaXMuc3VwcG9ydERldGVjdGlvbigpXHJcbiAgICAgIGlmICghc3VwcG9ydHMuYmFzaWMpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHZ1ZS1jcm9wcGEgZnVuY3Rpb25hbGl0eS4nKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHdhdGNoOiB7XHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IHZhbFxyXG4gICAgICB9LFxyXG4gICAgICByZWFsV2lkdGg6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuc2V0U2l6ZSgpXHJcbiAgICAgICAgICB0aGlzLnBsYWNlSW1hZ2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcmVhbEhlaWdodDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5zZXRTaXplKClcclxuICAgICAgICAgIHRoaXMucGxhY2VJbWFnZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBjYW52YXNDb2xvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwbGFjZWhvbGRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwbGFjZWhvbGRlckNvbG9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgdGhpcy5pbml0KClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJlYWxQbGFjZWhvbGRlckZvbnRTaXplOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgdGhpcy5pbml0KClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHByZXZlbnRXaGl0ZVNwYWNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxhY2VJbWFnZSgpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICBpbml0ICgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJHJlZnMuY2FudmFzXHJcbiAgICAgICAgdGhpcy5zZXRTaXplKClcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJ3RyYW5zcGFyZW50JyA6ICh0eXBlb2YgdGhpcy5jYW52YXNDb2xvciA9PT0gJ3N0cmluZycgPyB0aGlzLmNhbnZhc0NvbG9yIDogJycpXHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbCgpXHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU5JVF9FVkVOVCwge1xyXG4gICAgICAgICAgZ2V0Q2FudmFzOiAoKSA9PiB0aGlzLmNhbnZhcyxcclxuICAgICAgICAgIGdldENvbnRleHQ6ICgpID0+IHRoaXMuY3R4LFxyXG4gICAgICAgICAgZ2V0Q2hvc2VuRmlsZTogKCkgPT4gdGhpcy4kcmVmcy5maWxlSW5wdXQuZmlsZXNbMF0sXHJcbiAgICAgICAgICBnZXRBY3R1YWxJbWFnZVNpemU6ICgpID0+ICh7XHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnJlYWxXaWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgbW92ZVVwd2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogLWFtb3VudCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVEb3dud2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogYW1vdW50IH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZUxlZnR3YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAtYW1vdW50LCB5OiAwIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZVJpZ2h0d2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogYW1vdW50LCB5OiAwIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgem9vbUluOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuem9vbSh0cnVlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21PdXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKGZhbHNlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHJvdGF0ZTogKHN0ZXAgPSAxKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICAgICAgc3RlcCA9IHBhcnNlSW50KHN0ZXApXHJcbiAgICAgICAgICAgIGlmIChpc05hTihzdGVwKSB8fCBzdGVwID4gMyB8fCBzdGVwIDwgLTMpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgYXJndW1lbnQgZm9yIHJvdGF0ZSgpIG1ldGhvZC4gSXQgc2hvdWxkIG9uZSBvZiB0aGUgaW50ZWdlcnMgZnJvbSAtMyB0byAzLicpXHJcbiAgICAgICAgICAgICAgc3RlcCA9IDFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJvdGF0ZUJ5U3RlcChzdGVwKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZsaXBYOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICAgICAgdGhpcy5yb3RhdGUoMilcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmbGlwWTogKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgICAgIHRoaXMucm90YXRlKDQpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVmcmVzaDogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLmluaXQpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaGFzSW1hZ2U6ICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5pbWdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICByZW1vdmU6IHRoaXMucmVtb3ZlLFxyXG4gICAgICAgICAgY2hvb3NlRmlsZTogdGhpcy5jaG9vc2VGaWxlLFxyXG4gICAgICAgICAgZ2VuZXJhdGVEYXRhVXJsOiB0aGlzLmdlbmVyYXRlRGF0YVVybCxcclxuICAgICAgICAgIGdlbmVyYXRlQmxvYjogdGhpcy5nZW5lcmF0ZUJsb2IsXHJcbiAgICAgICAgICBwcm9taXNlZEJsb2I6IHRoaXMucHJvbWlzZWRCbG9iLFxyXG4gICAgICAgICAgc3VwcG9ydERldGVjdGlvbjogdGhpcy5zdXBwb3J0RGV0ZWN0aW9uLFxyXG4gICAgICAgICAgZ2V0TWV0YWRhdGE6IHRoaXMuZ2V0TWV0YWRhdGEsXHJcbiAgICAgICAgICBhcHBseU1ldGFkYXRhOiAobWV0YWRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFtZXRhZGF0YSB8fCAhdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgICAgICB0aGlzLnVzZXJNZXRhZGF0YSA9IG1ldGFkYXRhXHJcbiAgICAgICAgICAgIHZhciBvcmkgPSBtZXRhZGF0YS5vcmllbnRhdGlvbiB8fCB0aGlzLm9yaWVudGF0aW9uIHx8IDFcclxuICAgICAgICAgICAgdGhpcy5yb3RhdGUob3JpLCB0cnVlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzZXRTaXplICgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4J1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgcm90YXRlQnlTdGVwIChzdGVwKSB7XHJcbiAgICAgICAgbGV0IG9yaWVudGF0aW9uID0gMVxyXG4gICAgICAgIHN3aXRjaCAoc3RlcCkge1xyXG4gICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDZcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSAzXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gOFxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAtMTpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSA4XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIC0yOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDNcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgLTM6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gNlxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJvdGF0ZShvcmllbnRhdGlvbilcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHN1cHBvcnREZXRlY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAnYmFzaWMnOiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmIHdpbmRvdy5GaWxlICYmIHdpbmRvdy5GaWxlUmVhZGVyICYmIHdpbmRvdy5GaWxlTGlzdCAmJiB3aW5kb3cuQmxvYixcclxuICAgICAgICAgICdkbmQnOiAnb25kcmFnc3RhcnQnIGluIGRpdiAmJiAnb25kcm9wJyBpbiBkaXZcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZW1vdmUgKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIHRoaXMucGFpbnRCYWNrZ3JvdW5kKClcclxuXHJcbiAgICAgICAgdGhpcy5zZXRJbWFnZVBsYWNlaG9sZGVyKClcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSdcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcidcclxuICAgICAgICBsZXQgZGVmYXVsdEZvbnRTaXplID0gdGhpcy5yZWFsV2lkdGggKiBERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCAvIHRoaXMucGxhY2Vob2xkZXIubGVuZ3RoXHJcbiAgICAgICAgbGV0IGZvbnRTaXplID0gKCF0aGlzLnJlYWxQbGFjZWhvbGRlckZvbnRTaXplIHx8IHRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemUgPT0gMCkgPyBkZWZhdWx0Rm9udFNpemUgOiB0aGlzLnJlYWxQbGFjZWhvbGRlckZvbnRTaXplXHJcbiAgICAgICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCBzYW5zLXNlcmlmJ1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAoIXRoaXMucGxhY2Vob2xkZXJDb2xvciB8fCB0aGlzLnBsYWNlaG9sZGVyQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjNjA2MDYwJyA6IHRoaXMucGxhY2Vob2xkZXJDb2xvclxyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0aGlzLnBsYWNlaG9sZGVyLCB0aGlzLnJlYWxXaWR0aCAvIDIsIHRoaXMucmVhbEhlaWdodCAvIDIpXHJcblxyXG4gICAgICAgIGxldCBoYWRJbWFnZSA9IHRoaXMuaW1nICE9IG51bGxcclxuICAgICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBudWxsXHJcbiAgICAgICAgdGhpcy5pbWcgPSBudWxsXHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQudmFsdWUgPSAnJ1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YSA9IHt9XHJcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IDFcclxuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSBudWxsXHJcbiAgICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBudWxsXHJcbiAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcblxyXG4gICAgICAgIGlmIChoYWRJbWFnZSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU1BR0VfUkVNT1ZFX0VWRU5UKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNldEltYWdlUGxhY2Vob2xkZXIgKCkge1xyXG4gICAgICAgIGxldCBpbWdcclxuICAgICAgICBpZiAodGhpcy4kc2xvdHMucGxhY2Vob2xkZXIgJiYgdGhpcy4kc2xvdHMucGxhY2Vob2xkZXJbMF0pIHtcclxuICAgICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdXHJcbiAgICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICAgIGlmICh0YWcgPT0gJ2ltZycgJiYgZWxtKSB7XHJcbiAgICAgICAgICAgIGltZyA9IGVsbVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpbWcpIHJldHVyblxyXG5cclxuICAgICAgICB2YXIgb25Mb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltZywgMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh1LmltYWdlTG9hZGVkKGltZykpIHtcclxuICAgICAgICAgIG9uTG9hZCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGltZy5vbmxvYWQgPSBvbkxvYWRcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzZXRJbml0aWFsICgpIHtcclxuICAgICAgICBsZXQgc3JjLCBpbWdcclxuICAgICAgICBpZiAodGhpcy4kc2xvdHMuaW5pdGlhbCAmJiB0aGlzLiRzbG90cy5pbml0aWFsWzBdKSB7XHJcbiAgICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5pbml0aWFsWzBdXHJcbiAgICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICAgIGlmICh0YWcgPT0gJ2ltZycgJiYgZWxtKSB7XHJcbiAgICAgICAgICAgIGltZyA9IGVsbVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbml0aWFsSW1hZ2UgJiYgdHlwZW9mIHRoaXMuaW5pdGlhbEltYWdlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgc3JjID0gdGhpcy5pbml0aWFsSW1hZ2VcclxuICAgICAgICAgIGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICBpZiAoIS9eZGF0YTovLnRlc3Qoc3JjKSAmJiAhL15ibG9iOi8udGVzdChzcmMpKSB7XHJcbiAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2Nyb3NzT3JpZ2luJywgJ2Fub255bW91cycpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpbWcuc3JjID0gc3JjXHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5pbml0aWFsSW1hZ2UgPT09ICdvYmplY3QnICYmIHRoaXMuaW5pdGlhbEltYWdlIGluc3RhbmNlb2YgSW1hZ2UpIHtcclxuICAgICAgICAgIGltZyA9IHRoaXMuaW5pdGlhbEltYWdlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc3JjICYmICFpbWcpIHtcclxuICAgICAgICAgIHRoaXMucmVtb3ZlKClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XHJcbiAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCAraW1nLmRhdGFzZXRbJ2V4aWZPcmllbnRhdGlvbiddKVxyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX29ubG9hZChpbWcsICtpbWcuZGF0YXNldFsnZXhpZk9yaWVudGF0aW9uJ10pXHJcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGltZy5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX29ubG9hZCAoaW1nLCBvcmllbnRhdGlvbiA9IDEpIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBpbWdcclxuICAgICAgICB0aGlzLmltZyA9IGltZ1xyXG5cclxuICAgICAgICBpZiAoaXNOYU4ob3JpZW50YXRpb24pKSB7XHJcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucm90YXRlKG9yaWVudGF0aW9uKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgY2hvb3NlRmlsZSAoKSB7XHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQuY2xpY2soKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlQ2xpY2sgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UgJiYgIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMuc3VwcG9ydFRvdWNoKSB7XHJcbiAgICAgICAgICB0aGlzLmNob29zZUZpbGUoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZUlucHV0Q2hhbmdlICgpIHtcclxuICAgICAgICBsZXQgaW5wdXQgPSB0aGlzLiRyZWZzLmZpbGVJbnB1dFxyXG4gICAgICAgIGlmICghaW5wdXQuZmlsZXMubGVuZ3RoKSByZXR1cm5cclxuXHJcbiAgICAgICAgbGV0IGZpbGUgPSBpbnB1dC5maWxlc1swXVxyXG4gICAgICAgIHRoaXMub25OZXdGaWxlSW4oZmlsZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG9uTmV3RmlsZUluIChmaWxlKSB7XHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuRklMRV9DSE9PU0VfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVTaXplSXNWYWxpZChmaWxlKSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBzaXplIGV4Y2VlZHMgbGltaXQgd2hpY2ggaXMgJyArIHRoaXMuZmlsZVNpemVMaW1pdCArICcgYnl0ZXMuJylcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVUeXBlSXNWYWxpZChmaWxlKSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuRklMRV9UWVBFX01JU01BVENIX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgICAgbGV0IHR5cGUgPSBmaWxlLnR5cGUgfHwgZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGaWxlIHR5cGUgKCR7dHlwZX0pIGRvZXMgbm90IG1hdGNoIHdoYXQgeW91IHNwZWNpZmllZCAoJHt0aGlzLmFjY2VwdH0pLmApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93LkZpbGVSZWFkZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBsZXQgZnIgPSBuZXcgRmlsZVJlYWRlcigpXHJcbiAgICAgICAgICBmci5vbmxvYWQgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZmlsZURhdGEgPSBlLnRhcmdldC5yZXN1bHRcclxuICAgICAgICAgICAgbGV0IG9yaWVudGF0aW9uID0gdS5nZXRGaWxlT3JpZW50YXRpb24odS5iYXNlNjRUb0FycmF5QnVmZmVyKGZpbGVEYXRhKSlcclxuICAgICAgICAgICAgaWYgKG9yaWVudGF0aW9uIDwgMSkgb3JpZW50YXRpb24gPSAxXHJcbiAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgICAgICBpbWcuc3JjID0gZmlsZURhdGFcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCBvcmllbnRhdGlvbilcclxuICAgICAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5ORVdfSU1BR0UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGZyLnJlYWRBc0RhdGFVUkwoZmlsZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmaWxlU2l6ZUlzVmFsaWQgKGZpbGUpIHtcclxuICAgICAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUxpbWl0IHx8IHRoaXMuZmlsZVNpemVMaW1pdCA9PSAwKSByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICAgICByZXR1cm4gZmlsZS5zaXplIDwgdGhpcy5maWxlU2l6ZUxpbWl0XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmaWxlVHlwZUlzVmFsaWQgKGZpbGUpIHtcclxuICAgICAgICBsZXQgYWNjZXB0ID0gdGhpcy5hY2NlcHQgfHwgJ2ltYWdlLyonXHJcbiAgICAgICAgbGV0IGJhc2VNaW1ldHlwZSA9IGFjY2VwdC5yZXBsYWNlKC9cXC8uKiQvLCAnJylcclxuICAgICAgICBsZXQgdHlwZXMgPSBhY2NlcHQuc3BsaXQoJywnKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0eXBlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgbGV0IHR5cGUgPSB0eXBlc1tpXVxyXG4gICAgICAgICAgbGV0IHQgPSB0eXBlLnRyaW0oKVxyXG4gICAgICAgICAgaWYgKHQuY2hhckF0KDApID09ICcuJykge1xyXG4gICAgICAgICAgICBpZiAoZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKSA9PT0gdC50b0xvd2VyQ2FzZSgpLnNsaWNlKDEpKSByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfSBlbHNlIGlmICgvXFwvXFwqJC8udGVzdCh0KSkge1xyXG4gICAgICAgICAgICB2YXIgZmlsZUJhc2VUeXBlID0gZmlsZS50eXBlLnJlcGxhY2UoL1xcLy4qJC8sICcnKVxyXG4gICAgICAgICAgICBpZiAoZmlsZUJhc2VUeXBlID09PSBiYXNlTWltZXR5cGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGZpbGUudHlwZSA9PT0gdHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwbGFjZUltYWdlIChhcHBseU1ldGFkYXRhKSB7XHJcbiAgICAgICAgdmFyIGltZ0RhdGEgPSB0aGlzLmltZ0RhdGFcclxuXHJcbiAgICAgICAgdGhpcy5uYXR1cmFsV2lkdGggPSB0aGlzLmltZy5uYXR1cmFsV2lkdGhcclxuICAgICAgICB0aGlzLm5hdHVyYWxIZWlnaHQgPSB0aGlzLmltZy5uYXR1cmFsSGVpZ2h0XHJcblxyXG4gICAgICAgIGltZ0RhdGEuc3RhcnRYID0gdS5udW1iZXJWYWxpZChpbWdEYXRhLnN0YXJ0WCkgPyBpbWdEYXRhLnN0YXJ0WCA6IDBcclxuICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IHUubnVtYmVyVmFsaWQoaW1nRGF0YS5zdGFydFkpID8gaW1nRGF0YS5zdGFydFkgOiAwXHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pbWFnZVNldCkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaW5pdGlhbFNpemUgPT0gJ2NvbnRhaW4nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXNwZWN0Rml0KClcclxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbml0aWFsU2l6ZSA9PSAnbmF0dXJhbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5uYXR1cmFsU2l6ZSgpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFzcGVjdEZpbGwoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodS5udW1iZXJWYWxpZCh0aGlzLnNjYWxlUmF0aW8pKSB7XHJcbiAgICAgICAgICBpbWdEYXRhLndpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGggKiB0aGlzLnNjYWxlUmF0aW9cclxuICAgICAgICAgIGltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0ICogdGhpcy5zY2FsZVJhdGlvXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuYXNwZWN0RmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IGltZ0RhdGEud2lkdGggLyB0aGlzLm5hdHVyYWxXaWR0aFxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaW1hZ2VTZXQpIHtcclxuICAgICAgICAgIGlmICgvdG9wLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xyXG4gICAgICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICAgIH0gZWxzZSBpZiAoL2JvdHRvbS8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB0aGlzLnJlYWxIZWlnaHQgLSBpbWdEYXRhLmhlaWdodFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICgvbGVmdC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKC9yaWdodC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFggPSB0aGlzLnJlYWxXaWR0aCAtIGltZ0RhdGEud2lkdGhcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoL14tP1xcZCslIC0/XFxkKyUkLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gL14oLT9cXGQrKSUgKC0/XFxkKyklJC8uZXhlYyh0aGlzLmluaXRpYWxQb3NpdGlvbilcclxuICAgICAgICAgICAgdmFyIHggPSArcmVzdWx0WzFdIC8gMTAwXHJcbiAgICAgICAgICAgIHZhciB5ID0gK3Jlc3VsdFsyXSAvIDEwMFxyXG4gICAgICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IHggKiAodGhpcy5yZWFsV2lkdGggLSBpbWdEYXRhLndpZHRoKVxyXG4gICAgICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IHkgKiAodGhpcy5yZWFsSGVpZ2h0IC0gaW1nRGF0YS5oZWlnaHQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhcHBseU1ldGFkYXRhICYmIHRoaXMuYXBwbHlNZXRhZGF0YSgpXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLnByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XHJcbiAgICAgICAgICB0aGlzLmltYWdlU2V0ID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFzcGVjdEZpbGwgKCkge1xyXG4gICAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIGxldCBpbWdSYXRpbyA9IGltZ0hlaWdodCAvIGltZ1dpZHRoXHJcbiAgICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5yZWFsSGVpZ2h0IC8gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICBsZXQgc2NhbGVSYXRpb1xyXG4gICAgICAgIGlmIChpbWdSYXRpbyA8IGNhbnZhc1JhdGlvKSB7XHJcbiAgICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHNjYWxlUmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpIC8gMlxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhc3BlY3RGaXQgKCkge1xyXG4gICAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIGxldCBpbWdSYXRpbyA9IGltZ0hlaWdodCAvIGltZ1dpZHRoXHJcbiAgICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5yZWFsSGVpZ2h0IC8gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICBsZXQgc2NhbGVSYXRpb1xyXG4gICAgICAgIGlmIChpbWdSYXRpbyA8IGNhbnZhc1JhdGlvKSB7XHJcbiAgICAgICAgICBzY2FsZVJhdGlvID0gaW1nV2lkdGggLyB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHNjYWxlUmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KSAvIDJcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2NhbGVSYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGggLyBzY2FsZVJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aCkgLyAyXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbmF0dXJhbFNpemUgKCkge1xyXG4gICAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKSAvIDJcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KSAvIDJcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJTdGFydCAoZXZ0KSB7XHJcbiAgICAgICAgdGhpcy5zdXBwb3J0VG91Y2ggPSB0cnVlXHJcbiAgICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSBmYWxzZVxyXG4gICAgICAgIGxldCBwb2ludGVyQ29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBwb2ludGVyQ29vcmRcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICAgIC8vIHNpbXVsYXRlIGNsaWNrIHdpdGggdG91Y2ggb24gbW9iaWxlIGRldmljZXNcclxuICAgICAgICBpZiAoIXRoaXMuaW1nICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSB7XHJcbiAgICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gbmV3IERhdGUoKS52YWx1ZU9mKClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZ25vcmUgbW91c2UgcmlnaHQgY2xpY2sgYW5kIG1pZGRsZSBjbGlja1xyXG4gICAgICAgIGlmIChldnQud2hpY2ggJiYgZXZ0LndoaWNoID4gMSkgcmV0dXJuXHJcblxyXG4gICAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxyXG4gICAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXHJcbiAgICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5kaXNhYmxlUGluY2hUb1pvb20pIHtcclxuICAgICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgdGhpcy5waW5jaGluZyA9IHRydWVcclxuICAgICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2FuY2VsRXZlbnRzID0gWydtb3VzZXVwJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJywgJ3BvaW50ZXJlbmQnLCAncG9pbnRlcmNhbmNlbCddXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNhbmNlbEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgbGV0IGUgPSBjYW5jZWxFdmVudHNbaV1cclxuICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZSwgdGhpcy5oYW5kbGVQb2ludGVyRW5kKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJFbmQgKGV2dCkge1xyXG4gICAgICAgIGxldCBwb2ludGVyTW92ZURpc3RhbmNlID0gMFxyXG4gICAgICAgIGlmICh0aGlzLnBvaW50ZXJTdGFydENvb3JkKSB7XHJcbiAgICAgICAgICBsZXQgcG9pbnRlckNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIHBvaW50ZXJNb3ZlRGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9pbnRlckNvb3JkLnggLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLngsIDIpICsgTWF0aC5wb3cocG9pbnRlckNvb3JkLnkgLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLnksIDIpKSB8fCAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICBpZiAoIXRoaXMuaW1nICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSB7XHJcbiAgICAgICAgICBsZXQgdGFiRW5kID0gbmV3IERhdGUoKS52YWx1ZU9mKClcclxuICAgICAgICAgIGlmICgocG9pbnRlck1vdmVEaXN0YW5jZSA8IENMSUNLX01PVkVfVEhSRVNIT0xEKSAmJiB0YWJFbmQgLSB0aGlzLnRhYlN0YXJ0IDwgTUlOX01TX1BFUl9DTElDSyAmJiB0aGlzLnN1cHBvcnRUb3VjaCkge1xyXG4gICAgICAgICAgICB0aGlzLmNob29zZUZpbGUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy50YWJTdGFydCA9IDBcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gMFxyXG4gICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gbnVsbFxyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcclxuICAgICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gbnVsbFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlck1vdmUgKGV2dCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gdHJ1ZVxyXG5cclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnVG9Nb3ZlIHx8ICF0aGlzLmltZykgcmV0dXJuXHJcblxyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgaWYgKCFldnQudG91Y2hlcyB8fCBldnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5kcmFnZ2luZykgcmV0dXJuXHJcbiAgICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgaWYgKHRoaXMubGFzdE1vdmluZ0Nvb3JkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7XHJcbiAgICAgICAgICAgICAgeDogY29vcmQueCAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLngsXHJcbiAgICAgICAgICAgICAgeTogY29vcmQueSAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLnlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMucGluY2hpbmcpIHJldHVyblxyXG4gICAgICAgICAgbGV0IGRpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcclxuICAgICAgICAgIGxldCBkZWx0YSA9IGRpc3RhbmNlIC0gdGhpcy5waW5jaERpc3RhbmNlXHJcbiAgICAgICAgICB0aGlzLnpvb20oZGVsdGEgPiAwLCBudWxsLCBQSU5DSF9BQ0NFTEVSQVRJT04pXHJcbiAgICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSBkaXN0YW5jZVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVdoZWVsIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVTY3JvbGxUb1pvb20gfHwgIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgaWYgKGV2dC53aGVlbERlbHRhIDwgMCB8fCBldnQuZGVsdGFZID4gMCB8fCBldnQuZGV0YWlsID4gMCkge1xyXG4gICAgICAgICAgdGhpcy56b29tKHRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSwgY29vcmQpXHJcbiAgICAgICAgfSBlbHNlIGlmIChldnQud2hlZWxEZWx0YSA+IDAgfHwgZXZ0LmRlbHRhWSA8IDAgfHwgZXZ0LmRldGFpbCA8IDApIHtcclxuICAgICAgICAgIHRoaXMuem9vbSghdGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tLCBjb29yZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcmFnRW50ZXIgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdBbmREcm9wIHx8IHRoaXMuaW1nIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IHRydWVcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyYWdMZWF2ZSAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVEcmFnZ2VkT3ZlciB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ092ZXIgKGV2dCkge1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJvcCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVEcmFnZ2VkT3ZlciB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxyXG5cclxuICAgICAgICBsZXQgZmlsZVxyXG4gICAgICAgIGxldCBkdCA9IGV2dC5kYXRhVHJhbnNmZXJcclxuICAgICAgICBpZiAoIWR0KSByZXR1cm5cclxuICAgICAgICBpZiAoZHQuaXRlbXMpIHtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkdC5pdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IGR0Lml0ZW1zW2ldXHJcbiAgICAgICAgICAgIGlmIChpdGVtLmtpbmQgPT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgICAgZmlsZSA9IGl0ZW0uZ2V0QXNGaWxlKClcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZpbGUgPSBkdC5maWxlc1swXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgIHRoaXMub25OZXdGaWxlSW4oZmlsZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlIChvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIW9mZnNldCkgcmV0dXJuXHJcbiAgICAgICAgbGV0IG9sZFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYXHJcbiAgICAgICAgbGV0IG9sZFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgKz0gb2Zmc2V0LnlcclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFggIT09IG9sZFggfHwgdGhpcy5pbWdEYXRhLnN0YXJ0WSAhPT0gb2xkWSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuTU9WRV9FVkVOVClcclxuICAgICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFggPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WSA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlYWxXaWR0aCAtIHRoaXMuaW1nRGF0YS5zdGFydFggPiB0aGlzLmltZ0RhdGEud2lkdGgpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWFsSGVpZ2h0IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSA+IHRoaXMuaW1nRGF0YS5oZWlnaHQpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgem9vbSAoem9vbUluLCBwb3MsIGlubmVyQWNjZWxlcmF0aW9uID0gMSkge1xyXG4gICAgICAgIHBvcyA9IHBvcyB8fCB7XHJcbiAgICAgICAgICB4OiB0aGlzLmltZ0RhdGEuc3RhcnRYICsgdGhpcy5pbWdEYXRhLndpZHRoIC8gMixcclxuICAgICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVhbFNwZWVkID0gdGhpcy56b29tU3BlZWQgKiBpbm5lckFjY2VsZXJhdGlvblxyXG4gICAgICAgIGxldCBzcGVlZCA9ICh0aGlzLnJlYWxXaWR0aCAqIFBDVF9QRVJfWk9PTSkgKiByZWFsU3BlZWRcclxuICAgICAgICBsZXQgeCA9IDFcclxuICAgICAgICBpZiAoem9vbUluKSB7XHJcbiAgICAgICAgICB4ID0gMSArIHNwZWVkXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiBNSU5fV0lEVEgpIHtcclxuICAgICAgICAgIHggPSAxIC0gc3BlZWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBvbGRXaWR0aCA9IHRoaXMuaW1nRGF0YS53aWR0aFxyXG4gICAgICAgIGxldCBvbGRIZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0XHJcblxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMuaW1nRGF0YS53aWR0aCAqIHhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5pbWdEYXRhLmhlaWdodCAqIHhcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPCB0aGlzLnJlYWxXaWR0aCkge1xyXG4gICAgICAgICAgICBsZXQgX3ggPSB0aGlzLnJlYWxXaWR0aCAvIHRoaXMuaW1nRGF0YS53aWR0aFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5pbWdEYXRhLmhlaWdodCAqIF94XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5oZWlnaHQgPCB0aGlzLnJlYWxIZWlnaHQpIHtcclxuICAgICAgICAgICAgbGV0IF94ID0gdGhpcy5yZWFsSGVpZ2h0IC8gdGhpcy5pbWdEYXRhLmhlaWdodFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMuaW1nRGF0YS53aWR0aCAqIF94XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvbGRXaWR0aC50b0ZpeGVkKDIpICE9PSB0aGlzLmltZ0RhdGEud2lkdGgudG9GaXhlZCgyKSB8fCBvbGRIZWlnaHQudG9GaXhlZCgyKSAhPT0gdGhpcy5pbWdEYXRhLmhlaWdodC50b0ZpeGVkKDIpKSB7XHJcbiAgICAgICAgICBsZXQgb2Zmc2V0WCA9ICh4IC0gMSkgKiAocG9zLnggLSB0aGlzLmltZ0RhdGEuc3RhcnRYKVxyXG4gICAgICAgICAgbGV0IG9mZnNldFkgPSAoeCAtIDEpICogKHBvcy55IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSlcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYIC0gb2Zmc2V0WFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHRoaXMuaW1nRGF0YS5zdGFydFkgLSBvZmZzZXRZXHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLlpPT01fRVZFTlQpXHJcbiAgICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5pbWdEYXRhLndpZHRoIC8gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByb3RhdGUgKG9yaWVudGF0aW9uID0gNiwgdXNlT3JpZ2luYWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBpZiAob3JpZW50YXRpb24gPiAxIHx8IHVzZU9yaWdpbmFsKSB7XHJcbiAgICAgICAgICB2YXIgX2ltZyA9IHUuZ2V0Um90YXRlZEltYWdlKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxyXG4gICAgICAgICAgX2ltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1nID0gX2ltZ1xyXG4gICAgICAgICAgICB0aGlzLnBsYWNlSW1hZ2UodXNlT3JpZ2luYWwpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucGxhY2VJbWFnZSgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3JpZW50YXRpb24gPT0gMikge1xyXG4gICAgICAgICAgLy8gZmxpcCB4XHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5mbGlwWCh0aGlzLm9yaWVudGF0aW9uKVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gNCkge1xyXG4gICAgICAgICAgLy8gZmxpcCB5XHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5mbGlwWSh0aGlzLm9yaWVudGF0aW9uKVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gNikge1xyXG4gICAgICAgICAgLy8gOTAgZGVnXHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gMykge1xyXG4gICAgICAgICAgLy8gMTgwIGRlZ1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKSlcclxuICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDgpIHtcclxuICAgICAgICAgIC8vIDI3MCBkZWdcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHUucm90YXRlOTAodS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKSkpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHVzZU9yaWdpbmFsKSB7XHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb25cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwYWludEJhY2tncm91bmQgKCkge1xyXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJ3RyYW5zcGFyZW50JyA6IHRoaXMuY2FudmFzQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBiYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLnJlYWxXaWR0aCwgdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZHJhdyAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9kcmF3RnJhbWUpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuX2RyYXdGcmFtZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2RyYXdGcmFtZSAoKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxyXG5cclxuICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuRFJBVywgY3R4KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2VuZXJhdGVEYXRhVXJsICh0eXBlLCBjb21wcmVzc2lvblJhdGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4gJydcclxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXMudG9EYXRhVVJMKHR5cGUsIGNvbXByZXNzaW9uUmF0ZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdlbmVyYXRlQmxvYiAoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4gbnVsbFxyXG4gICAgICAgIHRoaXMuY2FudmFzLnRvQmxvYihjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHByb21pc2VkQmxvYiAoLi4uYXJncykge1xyXG4gICAgICAgIGlmICh0eXBlb2YgUHJvbWlzZSA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgY29uc29sZS53YXJuKCdObyBQcm9taXNlIHN1cHBvcnQuIFBsZWFzZSBhZGQgUHJvbWlzZSBwb2x5ZmlsbCBpZiB5b3Ugd2FudCB0byB1c2UgdGhpcyBtZXRob2QuJylcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUJsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICAgICAgICByZXNvbHZlKGJsb2IpXHJcbiAgICAgICAgICAgIH0sIGFyZ3MpXHJcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycilcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0TWV0YWRhdGEgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVybiB7fVxyXG4gICAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZIH0gPSB0aGlzLmltZ0RhdGFcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHN0YXJ0WCxcclxuICAgICAgICAgIHN0YXJ0WSxcclxuICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlUmF0aW8sXHJcbiAgICAgICAgICBvcmllbnRhdGlvbjogdGhpcy5vcmllbnRhdGlvblxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFwcGx5TWV0YWRhdGEgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy51c2VyTWV0YWRhdGEpIHJldHVyblxyXG4gICAgICAgIHZhciB7IHN0YXJ0WCwgc3RhcnRZLCBzY2FsZSB9ID0gdGhpcy51c2VyTWV0YWRhdGFcclxuXHJcbiAgICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc3RhcnRYKSkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHN0YXJ0WFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc3RhcnRZKSkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHN0YXJ0WVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc2NhbGUpKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aCAqIHNjYWxlXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0ICogc2NhbGVcclxuICAgICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHNjYWxlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZSBsYW5nPVwic3R5bHVzXCI+XHJcbiAgLmNyb3BwYS1jb250YWluZXJcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9ja1xyXG4gICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjNzXHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmVcclxuICAgIGZvbnQtc2l6ZTogMFxyXG4gICAgYWxpZ24tc2VsZjogZmxleC1zdGFydFxyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2U2ZTZlNlxyXG4gICAgY2FudmFzXHJcbiAgICAgIHRyYW5zaXRpb246IGFsbCAuM3NcclxuICAgICY6aG92ZXJcclxuICAgICAgb3BhY2l0eTogLjdcclxuICAgICYuY3JvcHBhLS1kcm9wem9uZVxyXG4gICAgICBib3gtc2hhZG93OiBpbnNldCAwIDAgMTBweCBsaWdodG5lc3MoYmxhY2ssIDIwJSlcclxuICAgICAgY2FudmFzXHJcbiAgICAgICAgb3BhY2l0eTogLjVcclxuICAgICYuY3JvcHBhLS1kaXNhYmxlZC1jY1xyXG4gICAgICBjdXJzb3I6IGRlZmF1bHRcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgICYuY3JvcHBhLS1oYXMtdGFyZ2V0XHJcbiAgICAgIGN1cnNvcjogbW92ZVxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICAmLmNyb3BwYS0tZGlzYWJsZWQtbXpcclxuICAgICAgICBjdXJzb3I6IGRlZmF1bHRcclxuICAgICYuY3JvcHBhLS1kaXNhYmxlZFxyXG4gICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICBzdmcuaWNvbi1yZW1vdmVcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlXHJcbiAgICAgIGJhY2tncm91bmQ6IHdoaXRlXHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDUwJVxyXG4gICAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KC0ycHggMnB4IDJweCByZ2JhKDAsIDAsIDAsIDAuNykpXHJcbiAgICAgIHotaW5kZXg6IDEwXHJcbiAgICAgIGN1cnNvcjogcG9pbnRlclxyXG4gICAgICBib3JkZXI6IDJweCBzb2xpZCB3aGl0ZVxyXG5cclxuPC9zdHlsZT5cclxuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsImltcG9ydCBjb21wb25lbnQgZnJvbSAnLi9jcm9wcGVyLnZ1ZSdcclxuaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJ1xyXG5cclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgY29tcG9uZW50TmFtZTogJ2Nyb3BwYSdcclxufVxyXG5cclxuY29uc3QgVnVlQ3JvcHBhID0ge1xyXG4gIGluc3RhbGw6IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBhc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKVxyXG4gICAgbGV0IHZlcnNpb24gPSBOdW1iZXIoVnVlLnZlcnNpb24uc3BsaXQoJy4nKVswXSlcclxuICAgIGlmICh2ZXJzaW9uIDwgMikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHZ1ZS1jcm9wcGEgc3VwcG9ydHMgdnVlIHZlcnNpb24gMi4wIGFuZCBhYm92ZS4gWW91IGFyZSB1c2luZyBWdWVAJHt2ZXJzaW9ufS4gUGxlYXNlIHVwZ3JhZGUgdG8gdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIFZ1ZS5gKVxyXG4gICAgfVxyXG4gICAgbGV0IGNvbXBvbmVudE5hbWUgPSBvcHRpb25zLmNvbXBvbmVudE5hbWUgfHwgJ2Nyb3BwYSdcclxuXHJcbiAgICAvLyByZWdpc3RyYXRpb25cclxuICAgIFZ1ZS5jb21wb25lbnQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50KVxyXG4gIH0sXHJcblxyXG4gIGNvbXBvbmVudFxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZUNyb3BwYSJdLCJuYW1lcyI6WyJkZWZpbmUiLCJ0aGlzIiwicG9pbnQiLCJ2bSIsImNhbnZhcyIsInF1YWxpdHkiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImNsaWVudFkiLCJsZWZ0IiwidG9wIiwiZXZ0IiwicG9pbnRlciIsInRvdWNoZXMiLCJjaGFuZ2VkVG91Y2hlcyIsIm9uZVBvaW50Q29vcmQiLCJwb2ludGVyMSIsInBvaW50ZXIyIiwiY29vcmQxIiwiY29vcmQyIiwiTWF0aCIsInNxcnQiLCJwb3ciLCJ4IiwieSIsImltZyIsImNvbXBsZXRlIiwibmF0dXJhbFdpZHRoIiwiZG9jdW1lbnQiLCJ3aW5kb3ciLCJsYXN0VGltZSIsInZlbmRvcnMiLCJsZW5ndGgiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImNhbGxiYWNrIiwiY3VyclRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInRpbWVUb0NhbGwiLCJtYXgiLCJpZCIsInNldFRpbWVvdXQiLCJhcmciLCJpc0FycmF5IiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiSFRNTENhbnZhc0VsZW1lbnQiLCJiaW5TdHIiLCJsZW4iLCJhcnIiLCJ0b0Jsb2IiLCJkZWZpbmVQcm9wZXJ0eSIsInR5cGUiLCJhdG9iIiwidG9EYXRhVVJMIiwic3BsaXQiLCJVaW50OEFycmF5IiwiaSIsImNoYXJDb2RlQXQiLCJCbG9iIiwiZHQiLCJkYXRhVHJhbnNmZXIiLCJvcmlnaW5hbEV2ZW50IiwidHlwZXMiLCJhcnJheUJ1ZmZlciIsInZpZXciLCJEYXRhVmlldyIsImdldFVpbnQxNiIsImJ5dGVMZW5ndGgiLCJvZmZzZXQiLCJtYXJrZXIiLCJnZXRVaW50MzIiLCJsaXR0bGUiLCJ0YWdzIiwiYmFzZTY0IiwicmVwbGFjZSIsImJpbmFyeVN0cmluZyIsImJ5dGVzIiwiYnVmZmVyIiwib3JpZW50YXRpb24iLCJfY2FudmFzIiwiQ2FudmFzRXhpZk9yaWVudGF0aW9uIiwiZHJhd0ltYWdlIiwiX2ltZyIsIkltYWdlIiwic3JjIiwib3JpIiwibWFwIiwibiIsImlzTmFOIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidmFsdWUiLCJpc0Zpbml0ZSIsImZsb29yIiwidmFsIiwiU3RyaW5nIiwiQm9vbGVhbiIsIkhUTUxJbWFnZUVsZW1lbnQiLCJ2YWxpZHMiLCJpbmRleE9mIiwidGVzdCIsIlBDVF9QRVJfWk9PTSIsIk1JTl9NU19QRVJfQ0xJQ0siLCJDTElDS19NT1ZFX1RIUkVTSE9MRCIsIk1JTl9XSURUSCIsIkRFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIiwiUElOQ0hfQUNDRUxFUkFUSU9OIiwicmVuZGVyIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsInBsYWNlaG9sZGVyRm9udFNpemUiLCJpbml0IiwickFGUG9seWZpbGwiLCJ0b0Jsb2JQb2x5ZmlsbCIsInN1cHBvcnRzIiwic3VwcG9ydERldGVjdGlvbiIsImJhc2ljIiwid2FybiIsImluc3RhbmNlIiwicHJldmVudFdoaXRlU3BhY2UiLCJpbWFnZVNldCIsInNldFNpemUiLCJwbGFjZUltYWdlIiwiZHJhdyIsIiRyZWZzIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjYW52YXNDb2xvciIsImN0eCIsImdldENvbnRleHQiLCJvcmlnaW5hbEltYWdlIiwic2V0SW5pdGlhbCIsIiRlbWl0IiwiZXZlbnRzIiwiSU5JVF9FVkVOVCIsImZpbGVJbnB1dCIsImZpbGVzIiwicmVhbFdpZHRoIiwicmVhbEhlaWdodCIsImFtb3VudCIsIm1vdmUiLCJ6b29tIiwic3RlcCIsImRpc2FibGVSb3RhdGlvbiIsImRpc2FibGVkIiwicGFyc2VJbnQiLCJyb3RhdGVCeVN0ZXAiLCJyb3RhdGUiLCIkbmV4dFRpY2siLCJyZW1vdmUiLCJjaG9vc2VGaWxlIiwiZ2VuZXJhdGVEYXRhVXJsIiwiZ2VuZXJhdGVCbG9iIiwicHJvbWlzZWRCbG9iIiwiZ2V0TWV0YWRhdGEiLCJtZXRhZGF0YSIsInVzZXJNZXRhZGF0YSIsImRpdiIsImNyZWF0ZUVsZW1lbnQiLCJGaWxlIiwiRmlsZVJlYWRlciIsIkZpbGVMaXN0IiwicGFpbnRCYWNrZ3JvdW5kIiwic2V0SW1hZ2VQbGFjZWhvbGRlciIsInRleHRCYXNlbGluZSIsInRleHRBbGlnbiIsImRlZmF1bHRGb250U2l6ZSIsInBsYWNlaG9sZGVyIiwiZm9udFNpemUiLCJyZWFsUGxhY2Vob2xkZXJGb250U2l6ZSIsImZvbnQiLCJmaWxsU3R5bGUiLCJwbGFjZWhvbGRlckNvbG9yIiwiZmlsbFRleHQiLCJoYWRJbWFnZSIsImltZ0RhdGEiLCJzY2FsZVJhdGlvIiwiSU1BR0VfUkVNT1ZFX0VWRU5UIiwiJHNsb3RzIiwidk5vZGUiLCJ0YWciLCJlbG0iLCJvbkxvYWQiLCJ1IiwiaW1hZ2VMb2FkZWQiLCJvbmxvYWQiLCJpbml0aWFsIiwiaW5pdGlhbEltYWdlIiwic2V0QXR0cmlidXRlIiwiYmFiZWxIZWxwZXJzLnR5cGVvZiIsIl9vbmxvYWQiLCJkYXRhc2V0IiwiSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQiLCJvbmVycm9yIiwiY2xpY2siLCJkaXNhYmxlQ2xpY2tUb0Nob29zZSIsInN1cHBvcnRUb3VjaCIsImlucHV0IiwiZmlsZSIsIm9uTmV3RmlsZUluIiwiRklMRV9DSE9PU0VfRVZFTlQiLCJmaWxlU2l6ZUlzVmFsaWQiLCJGSUxFX1NJWkVfRVhDRUVEX0VWRU5UIiwiRXJyb3IiLCJmaWxlU2l6ZUxpbWl0IiwiZmlsZVR5cGVJc1ZhbGlkIiwiRklMRV9UWVBFX01JU01BVENIX0VWRU5UIiwibmFtZSIsInRvTG93ZXJDYXNlIiwicG9wIiwiYWNjZXB0IiwiZnIiLCJlIiwiZmlsZURhdGEiLCJ0YXJnZXQiLCJyZXN1bHQiLCJnZXRGaWxlT3JpZW50YXRpb24iLCJiYXNlNjRUb0FycmF5QnVmZmVyIiwiTkVXX0lNQUdFIiwicmVhZEFzRGF0YVVSTCIsInNpemUiLCJiYXNlTWltZXR5cGUiLCJ0IiwidHJpbSIsImNoYXJBdCIsInNsaWNlIiwiZmlsZUJhc2VUeXBlIiwiYXBwbHlNZXRhZGF0YSIsIm5hdHVyYWxIZWlnaHQiLCJzdGFydFgiLCJudW1iZXJWYWxpZCIsInN0YXJ0WSIsImluaXRpYWxTaXplIiwiYXNwZWN0Rml0IiwibmF0dXJhbFNpemUiLCJhc3BlY3RGaWxsIiwiaW5pdGlhbFBvc2l0aW9uIiwiZXhlYyIsInByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsImltZ1JhdGlvIiwiY2FudmFzUmF0aW8iLCJwb2ludGVyTW92ZWQiLCJwb2ludGVyQ29vcmQiLCJnZXRQb2ludGVyQ29vcmRzIiwicG9pbnRlclN0YXJ0Q29vcmQiLCJ0YWJTdGFydCIsInZhbHVlT2YiLCJ3aGljaCIsImRyYWdnaW5nIiwicGluY2hpbmciLCJjb29yZCIsImxhc3RNb3ZpbmdDb29yZCIsImRpc2FibGVQaW5jaFRvWm9vbSIsInBpbmNoRGlzdGFuY2UiLCJnZXRQaW5jaERpc3RhbmNlIiwiY2FuY2VsRXZlbnRzIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZVBvaW50ZXJFbmQiLCJwb2ludGVyTW92ZURpc3RhbmNlIiwidGFiRW5kIiwiZGlzYWJsZURyYWdUb01vdmUiLCJwcmV2ZW50RGVmYXVsdCIsImRpc3RhbmNlIiwiZGVsdGEiLCJkaXNhYmxlU2Nyb2xsVG9ab29tIiwid2hlZWxEZWx0YSIsImRlbHRhWSIsImRldGFpbCIsInJldmVyc2VTY3JvbGxUb1pvb20iLCJkaXNhYmxlRHJhZ0FuZERyb3AiLCJldmVudEhhc0ZpbGUiLCJmaWxlRHJhZ2dlZE92ZXIiLCJpdGVtcyIsIml0ZW0iLCJraW5kIiwiZ2V0QXNGaWxlIiwib2xkWCIsIm9sZFkiLCJNT1ZFX0VWRU5UIiwiem9vbUluIiwicG9zIiwiaW5uZXJBY2NlbGVyYXRpb24iLCJyZWFsU3BlZWQiLCJ6b29tU3BlZWQiLCJzcGVlZCIsIm9sZFdpZHRoIiwib2xkSGVpZ2h0IiwiX3giLCJ0b0ZpeGVkIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJaT09NX0VWRU5UIiwidXNlT3JpZ2luYWwiLCJnZXRSb3RhdGVkSW1hZ2UiLCJmbGlwWCIsImZsaXBZIiwicm90YXRlOTAiLCJjbGVhclJlY3QiLCJmaWxsUmVjdCIsIl9kcmF3RnJhbWUiLCJEUkFXIiwiY29tcHJlc3Npb25SYXRlIiwibWltZVR5cGUiLCJxdWFsaXR5QXJndW1lbnQiLCJhcmdzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJibG9iIiwiZXJyIiwic2NhbGUiLCJkZWZhdWx0T3B0aW9ucyIsIlZ1ZUNyb3BwYSIsIlZ1ZSIsIm9wdGlvbnMiLCJhc3NpZ24iLCJ2ZXJzaW9uIiwiY29tcG9uZW50TmFtZSIsImNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLENBQUMsVUFBVSxJQUFJLEVBQUUsT0FBTyxFQUFFO0lBQ3RCLElBQUksT0FBT0EsU0FBTSxLQUFLLFVBQVUsSUFBSUEsU0FBTSxDQUFDLEdBQUcsRUFBRTtRQUM1Q0EsU0FBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN2QixNQUFNLEFBQWlDO1FBQ3BDLGNBQWMsR0FBRyxPQUFPLEVBQUUsQ0FB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
