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
        } } }, [_c('input', { ref: "fileInput", attrs: { "type": "file", "accept": _vm.accept, "disabled": _vm.disabled, "hidden": "" }, on: { "change": _vm.handleInputChange } }), _c('div', { staticClass: "slots", staticStyle: { "width": "0", "height": "0", "visibility": "hidden" } }, [_vm._t("initial"), _vm._t("placeholder")], 2), _c('canvas', { ref: "canvas", on: { "click": function click($event) {
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

/* eslint-disable no-unused-vars */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgYmFzZTY0ID0gYmFzZTY0LnJlcGxhY2UoL15kYXRhOihbXjtdKyk7YmFzZTY0LC9nbWksICcnKVxyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9IE51bWJlci5pc0ludGVnZXIgfHwgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodmFsdWUpICYmIE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgdmFsdWU6IE9iamVjdCxcclxuICB3aWR0aDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMjAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBoZWlnaHQ6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXI6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdDaG9vc2UgYW4gaW1hZ2UnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckNvbG9yOiB7XHJcbiAgICBkZWZhdWx0OiAnIzYwNjA2MCdcclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyRm9udFNpemU6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+PSAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBjYW52YXNDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJ3RyYW5zcGFyZW50J1xyXG4gIH0sXHJcbiAgcXVhbGl0eToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWwpICYmIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnLmpwZywuanBlZywucG5nLC5naWYsLmJtcCwud2VicCwuc3ZnLC50aWZmJ1xyXG4gIH0sXHJcbiAgZmlsZVNpemVMaW1pdDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnQW5kRHJvcDogQm9vbGVhbixcclxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ1RvTW92ZTogQm9vbGVhbixcclxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIGRpc2FibGVQaW5jaFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUm90YXRpb246IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9LFxyXG4gIGluaXRpYWxJbWFnZTogW1N0cmluZywgSFRNTEltYWdlRWxlbWVudF0sXHJcbiAgaW5pdGlhbFNpemU6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdjb3ZlcicsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA9PT0gJ2NvdmVyJyB8fCB2YWwgPT09ICdjb250YWluJyB8fCB2YWwgPT09ICduYXR1cmFsJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgaW5pdGlhbFBvc2l0aW9uOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnY2VudGVyJyxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICB2YXIgdmFsaWRzID0gW1xyXG4gICAgICAgICdjZW50ZXInLFxyXG4gICAgICAgICd0b3AnLFxyXG4gICAgICAgICdib3R0b20nLFxyXG4gICAgICAgICdsZWZ0JyxcclxuICAgICAgICAncmlnaHQnLFxyXG4gICAgICAgICd0b3AgbGVmdCcsXHJcbiAgICAgICAgJ3RvcCByaWdodCcsXHJcbiAgICAgICAgJ2JvdHRvbSBsZWZ0JyxcclxuICAgICAgICAnYm90dG9tIHJpZ2h0JyxcclxuICAgICAgICAnbGVmdCB0b3AnLFxyXG4gICAgICAgICdyaWdodCB0b3AnLFxyXG4gICAgICAgICdsZWZ0IGJvdHRvbScsXHJcbiAgICAgICAgJ3JpZ2h0IGJvdHRvbSdcclxuICAgICAgXVxyXG4gICAgICByZXR1cm4gdmFsaWRzLmluZGV4T2YodmFsKSA+PSAwIHx8IC9eLT9cXGQrJSAtP1xcZCslJC8udGVzdCh2YWwpXHJcbiAgICB9XHJcbiAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQge1xuICBJTklUX0VWRU5UOiAnaW5pdCcsXG4gIEZJTEVfQ0hPT1NFX0VWRU5UOiAnZmlsZS1jaG9vc2UnLFxuICBGSUxFX1NJWkVfRVhDRUVEX0VWRU5UOiAnZmlsZS1zaXplLWV4Y2VlZCcsXG4gIEZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVDogJ2ZpbGUtdHlwZS1taXNtYXRjaCcsXG4gIE5FV19JTUFHRTogJ25ldy1pbWFnZScsXG4gIElNQUdFX1JFTU9WRV9FVkVOVDogJ2ltYWdlLXJlbW92ZScsXG4gIE1PVkVfRVZFTlQ6ICdtb3ZlJyxcbiAgWk9PTV9FVkVOVDogJ3pvb20nLFxuICBEUkFXOiAnZHJhdycsXG4gIElOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UOiAnaW5pdGlhbC1pbWFnZS1sb2FkZWQnXG59XG4iLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiByZWY9XCJ3cmFwcGVyXCJcclxuICAgICAgIDpjbGFzcz1cImBjcm9wcGEtY29udGFpbmVyICR7aW1nID8gJ2Nyb3BwYS0taGFzLXRhcmdldCcgOiAnJ30gJHtkaXNhYmxlZCA/ICdjcm9wcGEtLWRpc2FibGVkJyA6ICcnfSAke2Rpc2FibGVDbGlja1RvQ2hvb3NlID8gJ2Nyb3BwYS0tZGlzYWJsZWQtY2MnIDogJyd9ICR7ZGlzYWJsZURyYWdUb01vdmUgJiYgZGlzYWJsZVNjcm9sbFRvWm9vbSA/ICdjcm9wcGEtLWRpc2FibGVkLW16JyA6ICcnfSAke2ZpbGVEcmFnZ2VkT3ZlciA/ICdjcm9wcGEtLWRyb3B6b25lJyA6ICcnfWBcIlxyXG4gICAgICAgQGRyYWdlbnRlci5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcmFnRW50ZXJcIlxyXG4gICAgICAgQGRyYWdsZWF2ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcmFnTGVhdmVcIlxyXG4gICAgICAgQGRyYWdvdmVyLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdPdmVyXCJcclxuICAgICAgIEBkcm9wLnN0b3AucHJldmVudD1cImhhbmRsZURyb3BcIj5cclxuICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiXHJcbiAgICAgICAgICAgOmFjY2VwdD1cImFjY2VwdFwiXHJcbiAgICAgICAgICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxyXG4gICAgICAgICAgIHJlZj1cImZpbGVJbnB1dFwiXHJcbiAgICAgICAgICAgaGlkZGVuXHJcbiAgICAgICAgICAgQGNoYW5nZT1cImhhbmRsZUlucHV0Q2hhbmdlXCIgLz5cclxuICAgIDxkaXYgY2xhc3M9XCJzbG90c1wiXHJcbiAgICAgICAgIHN0eWxlPVwid2lkdGg6IDA7IGhlaWdodDogMDsgdmlzaWJpbGl0eTogaGlkZGVuO1wiPlxyXG4gICAgICA8c2xvdCBuYW1lPVwiaW5pdGlhbFwiPjwvc2xvdD5cclxuICAgICAgPHNsb3QgbmFtZT1cInBsYWNlaG9sZGVyXCI+PC9zbG90PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8Y2FudmFzIHJlZj1cImNhbnZhc1wiXHJcbiAgICAgICAgICAgIEBjbGljay5zdG9wLnByZXZlbnQ9XCJoYW5kbGVDbGlja1wiXHJcbiAgICAgICAgICAgIEB0b3VjaHN0YXJ0LnN0b3A9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAbW91c2Vkb3duLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyc3RhcnQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHRvdWNoZW5kLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAdG91Y2hjYW5jZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBtb3VzZXVwLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcmVuZC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJjYW5jZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEB0b3VjaG1vdmUuc3RvcD1cImhhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQG1vdXNlbW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBwb2ludGVybW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBET01Nb3VzZVNjcm9sbC5zdG9wPVwiaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAd2hlZWwuc3RvcD1cImhhbmRsZVdoZWVsXCJcclxuICAgICAgICAgICAgQG1vdXNld2hlZWwuc3RvcD1cImhhbmRsZVdoZWVsXCI+PC9jYW52YXM+XHJcbiAgICA8c3ZnIGNsYXNzPVwiaWNvbiBpY29uLXJlbW92ZVwiXHJcbiAgICAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZ1wiXHJcbiAgICAgICAgIEBjbGljaz1cInJlbW92ZVwiXHJcbiAgICAgICAgIDpzdHlsZT1cImB0b3A6IC0ke2hlaWdodC80MH1weDsgcmlnaHQ6IC0ke3dpZHRoLzQwfXB4YFwiXHJcbiAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcclxuICAgICAgICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxyXG4gICAgICAgICA6d2lkdGg9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCJcclxuICAgICAgICAgOmhlaWdodD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIj5cclxuICAgICAgPHBhdGggZD1cIk01MTEuOTIxMjMxIDBDMjI5LjE3OTA3NyAwIDAgMjI5LjI1Nzg0NiAwIDUxMiAwIDc5NC43MDI3NjkgMjI5LjE3OTA3NyAxMDI0IDUxMS45MjEyMzEgMTAyNCA3OTQuNzgxNTM4IDEwMjQgMTAyNCA3OTQuNzAyNzY5IDEwMjQgNTEyIDEwMjQgMjI5LjI1Nzg0NiA3OTQuNzgxNTM4IDAgNTExLjkyMTIzMSAwWk03MzIuMDQxODQ2IDY1MC42MzM4NDYgNjUwLjUxNTY5MiA3MzIuMDgxMjMxQzY1MC41MTU2OTIgNzMyLjA4MTIzMSA1MjEuNDkxNjkyIDU5My42ODM2OTIgNTExLjg4MTg0NiA1OTMuNjgzNjkyIDUwMi40Mjk1MzggNTkzLjY4MzY5MiAzNzMuMzY2MTU0IDczMi4wODEyMzEgMzczLjM2NjE1NCA3MzIuMDgxMjMxTDI5MS43NjEyMzEgNjUwLjYzMzg0NkMyOTEuNzYxMjMxIDY1MC42MzM4NDYgNDMwLjMxNjMwOCA1MjMuNTAwMzA4IDQzMC4zMTYzMDggNTEyLjE5NjkyMyA0MzAuMzE2MzA4IDUwMC42OTY2MTUgMjkxLjc2MTIzMSAzNzMuNTIzNjkyIDI5MS43NjEyMzEgMzczLjUyMzY5MkwzNzMuMzY2MTU0IDI5MS45MTg3NjlDMzczLjM2NjE1NCAyOTEuOTE4NzY5IDUwMy40NTM1MzggNDMwLjM5NTA3NyA1MTEuODgxODQ2IDQzMC4zOTUwNzcgNTIwLjM0OTUzOCA0MzAuMzk1MDc3IDY1MC41MTU2OTIgMjkxLjkxODc2OSA2NTAuNTE1NjkyIDI5MS45MTg3NjlMNzMyLjA0MTg0NiAzNzMuNTIzNjkyQzczMi4wNDE4NDYgMzczLjUyMzY5MiA1OTMuNDQ3Mzg1IDUwMi41NDc2OTIgNTkzLjQ0NzM4NSA1MTIuMTk2OTIzIDU5My40NDczODUgNTIxLjQxMjkyMyA3MzIuMDQxODQ2IDY1MC42MzM4NDYgNzMyLjA0MTg0NiA2NTAuNjMzODQ2WlwiXHJcbiAgICAgICAgICAgIDpmaWxsPVwicmVtb3ZlQnV0dG9uQ29sb3JcIj48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xyXG4gIGltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xyXG4gIGltcG9ydCBldmVudHMgZnJvbSAnLi9ldmVudHMnXHJcblxyXG4gIGNvbnN0IFBDVF9QRVJfWk9PTSA9IDEgLyAxMDAwMDAgLy8gVGhlIGFtb3VudCBvZiB6b29taW5nIGV2ZXJ5dGltZSBpdCBoYXBwZW5zLCBpbiBwZXJjZW50YWdlIG9mIGltYWdlIHdpZHRoLlxyXG4gIGNvbnN0IE1JTl9NU19QRVJfQ0xJQ0sgPSA1MDAgLy8gSWYgdG91Y2ggZHVyYXRpb24gaXMgc2hvcnRlciB0aGFuIHRoZSB2YWx1ZSwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGFzIGEgY2xpY2suXHJcbiAgY29uc3QgQ0xJQ0tfTU9WRV9USFJFU0hPTEQgPSAxMDAgLy8gSWYgdG91Y2ggbW92ZSBkaXN0YW5jZSBpcyBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZSwgdGhlbiBpdCB3aWxsIGJ5IG5vIG1lYW4gYmUgY29uc2lkZXJlZCBhcyBhIGNsaWNrLlxyXG4gIGNvbnN0IE1JTl9XSURUSCA9IDEwIC8vIFRoZSBtaW5pbWFsIHdpZHRoIHRoZSB1c2VyIGNhbiB6b29tIHRvLlxyXG4gIGNvbnN0IERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQID0gMiAvIDMgLy8gUGxhY2Vob2xkZXIgdGV4dCBieSBkZWZhdWx0IHRha2VzIHVwIHRoaXMgYW1vdW50IG9mIHRpbWVzIG9mIGNhbnZhcyB3aWR0aC5cclxuICBjb25zdCBQSU5DSF9BQ0NFTEVSQVRJT04gPSAyIC8vIFRoZSBhbW91bnQgb2YgdGltZXMgYnkgd2hpY2ggdGhlIHBpbmNoaW5nIGlzIG1vcmUgc2Vuc2l0aXZlIHRoYW4gdGhlIHNjb2xsaW5nXHJcbiAgLy8gY29uc3QgREVCVUcgPSBmYWxzZVxyXG5cclxuICBleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBtb2RlbDoge1xyXG4gICAgICBwcm9wOiAndmFsdWUnLFxyXG4gICAgICBldmVudDogJ2luaXQnXHJcbiAgICB9LFxyXG5cclxuICAgIHByb3BzOiBwcm9wcyxcclxuXHJcbiAgICBkYXRhICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBpbnN0YW5jZTogbnVsbCxcclxuICAgICAgICBjYW52YXM6IG51bGwsXHJcbiAgICAgICAgY3R4OiBudWxsLFxyXG4gICAgICAgIG9yaWdpbmFsSW1hZ2U6IG51bGwsXHJcbiAgICAgICAgaW1nOiBudWxsLFxyXG4gICAgICAgIGRyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgICBsYXN0TW92aW5nQ29vcmQ6IG51bGwsXHJcbiAgICAgICAgaW1nRGF0YToge30sXHJcbiAgICAgICAgZGF0YVVybDogJycsXHJcbiAgICAgICAgZmlsZURyYWdnZWRPdmVyOiBmYWxzZSxcclxuICAgICAgICB0YWJTdGFydDogMCxcclxuICAgICAgICBwaW5jaGluZzogZmFsc2UsXHJcbiAgICAgICAgcGluY2hEaXN0YW5jZTogMCxcclxuICAgICAgICBzdXBwb3J0VG91Y2g6IGZhbHNlLFxyXG4gICAgICAgIHBvaW50ZXJNb3ZlZDogZmFsc2UsXHJcbiAgICAgICAgcG9pbnRlclN0YXJ0Q29vcmQ6IG51bGwsXHJcbiAgICAgICAgbmF0dXJhbFdpZHRoOiAwLFxyXG4gICAgICAgIG5hdHVyYWxIZWlnaHQ6IDAsXHJcbiAgICAgICAgc2NhbGVSYXRpbzogbnVsbCxcclxuICAgICAgICBvcmllbnRhdGlvbjogMSxcclxuICAgICAgICB1c2VyTWV0YWRhdGE6IG51bGwsXHJcbiAgICAgICAgaW1hZ2VTZXQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgcmVhbFdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVhbEhlaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0ICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJGb250U2l6ZSAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdW50ZWQgKCkge1xyXG4gICAgICB0aGlzLmluaXQoKVxyXG4gICAgICB1LnJBRlBvbHlmaWxsKClcclxuICAgICAgdS50b0Jsb2JQb2x5ZmlsbCgpXHJcblxyXG4gICAgICBsZXQgc3VwcG9ydHMgPSB0aGlzLnN1cHBvcnREZXRlY3Rpb24oKVxyXG4gICAgICBpZiAoIXN1cHBvcnRzLmJhc2ljKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB2dWUtY3JvcHBhIGZ1bmN0aW9uYWxpdHkuJylcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSB2YWxcclxuICAgICAgfSxcclxuICAgICAgcmVhbFdpZHRoOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgdGhpcy5pbml0KClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnNldFNpemUoKVxyXG4gICAgICAgICAgdGhpcy5wbGFjZUltYWdlKClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJlYWxIZWlnaHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuc2V0U2l6ZSgpXHJcbiAgICAgICAgICB0aGlzLnBsYWNlSW1hZ2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgY2FudmFzQ29sb3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcGxhY2Vob2xkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwcmV2ZW50V2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsYWNlSW1hZ2UoKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgaW5pdCAoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRyZWZzLmNhbnZhc1xyXG4gICAgICAgIHRoaXMuc2V0U2l6ZSgpXHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICd0cmFuc3BhcmVudCcgOiAodHlwZW9mIHRoaXMuY2FudmFzQ29sb3IgPT09ICdzdHJpbmcnID8gdGhpcy5jYW52YXNDb2xvciA6ICcnKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IG51bGxcclxuICAgICAgICB0aGlzLmltZyA9IG51bGxcclxuICAgICAgICB0aGlzLnNldEluaXRpYWwoKVxyXG4gICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLklOSVRfRVZFTlQsIHtcclxuICAgICAgICAgIGdldENhbnZhczogKCkgPT4gdGhpcy5jYW52YXMsXHJcbiAgICAgICAgICBnZXRDb250ZXh0OiAoKSA9PiB0aGlzLmN0eCxcclxuICAgICAgICAgIGdldENob3NlbkZpbGU6ICgpID0+IHRoaXMuJHJlZnMuZmlsZUlucHV0LmZpbGVzWzBdLFxyXG4gICAgICAgICAgZ2V0QWN0dWFsSW1hZ2VTaXplOiAoKSA9PiAoe1xyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5yZWFsV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIG1vdmVVcHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlRG93bndhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IGFtb3VudCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVMZWZ0d2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVSaWdodHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21JbjogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnpvb20odHJ1ZSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB6b29tT3V0OiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuem9vbShmYWxzZSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICByb3RhdGU6IChzdGVwID0gMSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgICAgIHN0ZXAgPSBwYXJzZUludChzdGVwKVxyXG4gICAgICAgICAgICBpZiAoaXNOYU4oc3RlcCkgfHwgc3RlcCA+IDMgfHwgc3RlcCA8IC0zKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdJbnZhbGlkIGFyZ3VtZW50IGZvciByb3RhdGUoKSBtZXRob2QuIEl0IHNob3VsZCBvbmUgb2YgdGhlIGludGVnZXJzIGZyb20gLTMgdG8gMy4nKVxyXG4gICAgICAgICAgICAgIHN0ZXAgPSAxXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yb3RhdGVCeVN0ZXAoc3RlcClcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmbGlwWDogKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgICAgIHRoaXMucm90YXRlKDIpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZmxpcFk6ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICAgICAgICB0aGlzLnJvdGF0ZSg0KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHJlZnJlc2g6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5pbml0KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGhhc0ltYWdlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhIXRoaXMuaW1nXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVtb3ZlOiB0aGlzLnJlbW92ZSxcclxuICAgICAgICAgIGNob29zZUZpbGU6IHRoaXMuY2hvb3NlRmlsZSxcclxuICAgICAgICAgIGdlbmVyYXRlRGF0YVVybDogdGhpcy5nZW5lcmF0ZURhdGFVcmwsXHJcbiAgICAgICAgICBnZW5lcmF0ZUJsb2I6IHRoaXMuZ2VuZXJhdGVCbG9iLFxyXG4gICAgICAgICAgcHJvbWlzZWRCbG9iOiB0aGlzLnByb21pc2VkQmxvYixcclxuICAgICAgICAgIHN1cHBvcnREZXRlY3Rpb246IHRoaXMuc3VwcG9ydERldGVjdGlvbixcclxuICAgICAgICAgIGdldE1ldGFkYXRhOiB0aGlzLmdldE1ldGFkYXRhLFxyXG4gICAgICAgICAgYXBwbHlNZXRhZGF0YTogKG1ldGFkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghbWV0YWRhdGEgfHwgIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBtZXRhZGF0YVxyXG4gICAgICAgICAgICB2YXIgb3JpID0gbWV0YWRhdGEub3JpZW50YXRpb24gfHwgdGhpcy5vcmllbnRhdGlvbiB8fCAxXHJcbiAgICAgICAgICAgIHRoaXMucm90YXRlKG9yaSwgdHJ1ZSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2V0U2l6ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArICdweCdcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArICdweCdcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJvdGF0ZUJ5U3RlcCAoc3RlcCkge1xyXG4gICAgICAgIGxldCBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICBzd2l0Y2ggKHN0ZXApIHtcclxuICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSA2XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gM1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDhcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gOFxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAtMjpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSAzXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIC0zOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDZcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yb3RhdGUob3JpZW50YXRpb24pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzdXBwb3J0RGV0ZWN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgJ2Jhc2ljJzogd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAmJiB3aW5kb3cuRmlsZSAmJiB3aW5kb3cuRmlsZVJlYWRlciAmJiB3aW5kb3cuRmlsZUxpc3QgJiYgd2luZG93LkJsb2IsXHJcbiAgICAgICAgICAnZG5kJzogJ29uZHJhZ3N0YXJ0JyBpbiBkaXYgJiYgJ29uZHJvcCcgaW4gZGl2XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVtb3ZlICgpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcblxyXG4gICAgICAgIHRoaXMuc2V0SW1hZ2VQbGFjZWhvbGRlcigpXHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXHJcbiAgICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMucmVhbFdpZHRoICogREVGQVVMVF9QTEFDRUhPTERFUl9UQUtFVVAgLyB0aGlzLnBsYWNlaG9sZGVyLmxlbmd0aFxyXG4gICAgICAgIGxldCBmb250U2l6ZSA9ICghdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZSB8fCB0aGlzLnJlYWxQbGFjZWhvbGRlckZvbnRTaXplID09IDApID8gZGVmYXVsdEZvbnRTaXplIDogdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZVxyXG4gICAgICAgIGN0eC5mb250ID0gZm9udFNpemUgKyAncHggc2Fucy1zZXJpZidcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gKCF0aGlzLnBsYWNlaG9sZGVyQ29sb3IgfHwgdGhpcy5wbGFjZWhvbGRlckNvbG9yID09ICdkZWZhdWx0JykgPyAnIzYwNjA2MCcgOiB0aGlzLnBsYWNlaG9sZGVyQ29sb3JcclxuICAgICAgICBjdHguZmlsbFRleHQodGhpcy5wbGFjZWhvbGRlciwgdGhpcy5yZWFsV2lkdGggLyAyLCB0aGlzLnJlYWxIZWlnaHQgLyAyKVxyXG5cclxuICAgICAgICBsZXQgaGFkSW1hZ2UgPSB0aGlzLmltZyAhPSBudWxsXHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcclxuICAgICAgICB0aGlzLmltZ0RhdGEgPSB7fVxyXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSAxXHJcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gbnVsbFxyXG4gICAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxyXG5cclxuICAgICAgICBpZiAoaGFkSW1hZ2UpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLklNQUdFX1JFTU9WRV9FVkVOVClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzZXRJbWFnZVBsYWNlaG9sZGVyICgpIHtcclxuICAgICAgICBsZXQgaW1nXHJcbiAgICAgICAgaWYgKHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyICYmIHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdKSB7XHJcbiAgICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5wbGFjZWhvbGRlclswXVxyXG4gICAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXHJcbiAgICAgICAgICBpZiAodGFnID09ICdpbWcnICYmIGVsbSkge1xyXG4gICAgICAgICAgICBpbWcgPSBlbG1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaW1nKSByZXR1cm5cclxuXHJcbiAgICAgICAgdmFyIG9uTG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIHRoaXMucmVhbFdpZHRoLCB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XHJcbiAgICAgICAgICBvbkxvYWQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpbWcub25sb2FkID0gb25Mb2FkXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2V0SW5pdGlhbCAoKSB7XHJcbiAgICAgICAgbGV0IHNyYywgaW1nXHJcbiAgICAgICAgaWYgKHRoaXMuJHNsb3RzLmluaXRpYWwgJiYgdGhpcy4kc2xvdHMuaW5pdGlhbFswXSkge1xyXG4gICAgICAgICAgbGV0IHZOb2RlID0gdGhpcy4kc2xvdHMuaW5pdGlhbFswXVxyXG4gICAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXHJcbiAgICAgICAgICBpZiAodGFnID09ICdpbWcnICYmIGVsbSkge1xyXG4gICAgICAgICAgICBpbWcgPSBlbG1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbEltYWdlICYmIHR5cGVvZiB0aGlzLmluaXRpYWxJbWFnZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIHNyYyA9IHRoaXMuaW5pdGlhbEltYWdlXHJcbiAgICAgICAgICBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgICAgaWYgKCEvXmRhdGE6Ly50ZXN0KHNyYykgJiYgIS9eYmxvYjovLnRlc3Qoc3JjKSkge1xyXG4gICAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKCdjcm9zc09yaWdpbicsICdhbm9ueW1vdXMnKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaW1nLnNyYyA9IHNyY1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuaW5pdGlhbEltYWdlID09PSAnb2JqZWN0JyAmJiB0aGlzLmluaXRpYWxJbWFnZSBpbnN0YW5jZW9mIEltYWdlKSB7XHJcbiAgICAgICAgICBpbWcgPSB0aGlzLmluaXRpYWxJbWFnZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXNyYyAmJiAhaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbW92ZSgpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHUuaW1hZ2VMb2FkZWQoaW1nKSkge1xyXG4gICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSlcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCAraW1nLmRhdGFzZXRbJ2V4aWZPcmllbnRhdGlvbiddKVxyXG4gICAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpbWcub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9vbmxvYWQgKGltZywgb3JpZW50YXRpb24gPSAxKSB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gaW1nXHJcbiAgICAgICAgdGhpcy5pbWcgPSBpbWdcclxuXHJcbiAgICAgICAgaWYgKGlzTmFOKG9yaWVudGF0aW9uKSkge1xyXG4gICAgICAgICAgb3JpZW50YXRpb24gPSAxXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJvdGF0ZShvcmllbnRhdGlvbilcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNob29zZUZpbGUgKCkge1xyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LmNsaWNrKClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZUNsaWNrICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlICYmICF0aGlzLmRpc2FibGVkICYmICF0aGlzLnN1cHBvcnRUb3VjaCkge1xyXG4gICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVJbnB1dENoYW5nZSAoKSB7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gdGhpcy4kcmVmcy5maWxlSW5wdXRcclxuICAgICAgICBpZiAoIWlucHV0LmZpbGVzLmxlbmd0aCkgcmV0dXJuXHJcblxyXG4gICAgICAgIGxldCBmaWxlID0gaW5wdXQuZmlsZXNbMF1cclxuICAgICAgICB0aGlzLm9uTmV3RmlsZUluKGZpbGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBvbk5ld0ZpbGVJbiAoZmlsZSkge1xyXG4gICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkZJTEVfQ0hPT1NFX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkZJTEVfU0laRV9FWENFRURfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpbGUgc2l6ZSBleGNlZWRzIGxpbWl0IHdoaWNoIGlzICcgKyB0aGlzLmZpbGVTaXplTGltaXQgKyAnIGJ5dGVzLicpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlVHlwZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIGxldCB0eXBlID0gZmlsZS50eXBlIHx8IGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcuJykucG9wKClcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmlsZSB0eXBlICgke3R5cGV9KSBkb2VzIG5vdCBtYXRjaCB3aGF0IHlvdSBzcGVjaWZpZWQgKCR7dGhpcy5hY2NlcHR9KS5gKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5GaWxlUmVhZGVyICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgICAgICAgZnIub25sb2FkID0gKGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IGZpbGVEYXRhID0gZS50YXJnZXQucmVzdWx0XHJcbiAgICAgICAgICAgIGxldCBvcmllbnRhdGlvbiA9IHUuZ2V0RmlsZU9yaWVudGF0aW9uKHUuYmFzZTY0VG9BcnJheUJ1ZmZlcihmaWxlRGF0YSkpXHJcbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbiA8IDEpIG9yaWVudGF0aW9uID0gMVxyXG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgICAgICAgaW1nLnNyYyA9IGZpbGVEYXRhXHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgb3JpZW50YXRpb24pXHJcbiAgICAgICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuTkVXX0lNQUdFKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBmci5yZWFkQXNEYXRhVVJMKGZpbGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmlsZVNpemVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2VcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVNpemVMaW1pdCB8fCB0aGlzLmZpbGVTaXplTGltaXQgPT0gMCkgcmV0dXJuIHRydWVcclxuXHJcbiAgICAgICAgcmV0dXJuIGZpbGUuc2l6ZSA8IHRoaXMuZmlsZVNpemVMaW1pdFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmlsZVR5cGVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgICAgbGV0IGFjY2VwdCA9IHRoaXMuYWNjZXB0IHx8ICdpbWFnZS8qJ1xyXG4gICAgICAgIGxldCBiYXNlTWltZXR5cGUgPSBhY2NlcHQucmVwbGFjZSgvXFwvLiokLywgJycpXHJcbiAgICAgICAgbGV0IHR5cGVzID0gYWNjZXB0LnNwbGl0KCcsJylcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdHlwZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgIGxldCB0eXBlID0gdHlwZXNbaV1cclxuICAgICAgICAgIGxldCB0ID0gdHlwZS50cmltKClcclxuICAgICAgICAgIGlmICh0LmNoYXJBdCgwKSA9PSAnLicpIHtcclxuICAgICAgICAgICAgaWYgKGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcuJykucG9wKCkgPT09IHQudG9Mb3dlckNhc2UoKS5zbGljZSgxKSkgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH0gZWxzZSBpZiAoL1xcL1xcKiQvLnRlc3QodCkpIHtcclxuICAgICAgICAgICAgdmFyIGZpbGVCYXNlVHlwZSA9IGZpbGUudHlwZS5yZXBsYWNlKC9cXC8uKiQvLCAnJylcclxuICAgICAgICAgICAgaWYgKGZpbGVCYXNlVHlwZSA9PT0gYmFzZU1pbWV0eXBlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmIChmaWxlLnR5cGUgPT09IHR5cGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGxhY2VJbWFnZSAoYXBwbHlNZXRhZGF0YSkge1xyXG4gICAgICAgIHZhciBpbWdEYXRhID0gdGhpcy5pbWdEYXRhXHJcblxyXG4gICAgICAgIHRoaXMubmF0dXJhbFdpZHRoID0gdGhpcy5pbWcubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgdGhpcy5uYXR1cmFsSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxyXG5cclxuICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IHUubnVtYmVyVmFsaWQoaW1nRGF0YS5zdGFydFgpID8gaW1nRGF0YS5zdGFydFggOiAwXHJcbiAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB1Lm51bWJlclZhbGlkKGltZ0RhdGEuc3RhcnRZKSA/IGltZ0RhdGEuc3RhcnRZIDogMFxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaW1hZ2VTZXQpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmluaXRpYWxTaXplID09ICdjb250YWluJykge1xyXG4gICAgICAgICAgICB0aGlzLmFzcGVjdEZpdCgpXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5pdGlhbFNpemUgPT0gJ25hdHVyYWwnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmF0dXJhbFNpemUoKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hc3BlY3RGaWxsKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHUubnVtYmVyVmFsaWQodGhpcy5zY2FsZVJhdGlvKSkge1xyXG4gICAgICAgICAgaW1nRGF0YS53aWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoICogdGhpcy5zY2FsZVJhdGlvXHJcbiAgICAgICAgICBpbWdEYXRhLmhlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodCAqIHRoaXMuc2NhbGVSYXRpb1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmFzcGVjdEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSBpbWdEYXRhLndpZHRoIC8gdGhpcy5uYXR1cmFsV2lkdGhcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XHJcbiAgICAgICAgICBpZiAoL3RvcC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKC9ib3R0b20vLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0gdGhpcy5yZWFsSGVpZ2h0IC0gaW1nRGF0YS5oZWlnaHRcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoL2xlZnQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICAgICAgfSBlbHNlIGlmICgvcmlnaHQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0gdGhpcy5yZWFsV2lkdGggLSBpbWdEYXRhLndpZHRoXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKC9eLT9cXGQrJSAtP1xcZCslJC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IC9eKC0/XFxkKyklICgtP1xcZCspJSQvLmV4ZWModGhpcy5pbml0aWFsUG9zaXRpb24pXHJcbiAgICAgICAgICAgIHZhciB4ID0gK3Jlc3VsdFsxXSAvIDEwMFxyXG4gICAgICAgICAgICB2YXIgeSA9ICtyZXN1bHRbMl0gLyAxMDBcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFggPSB4ICogKHRoaXMucmVhbFdpZHRoIC0gaW1nRGF0YS53aWR0aClcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB5ICogKHRoaXMucmVhbEhlaWdodCAtIGltZ0RhdGEuaGVpZ2h0KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXBwbHlNZXRhZGF0YSAmJiB0aGlzLmFwcGx5TWV0YWRhdGEoKVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pbWFnZVNldCkge1xyXG4gICAgICAgICAgdGhpcy5pbWFnZVNldCA9IHRydWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhc3BlY3RGaWxsICgpIHtcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICBsZXQgaW1nUmF0aW8gPSBpbWdIZWlnaHQgLyBpbWdXaWR0aFxyXG4gICAgICAgIGxldCBjYW52YXNSYXRpbyA9IHRoaXMucmVhbEhlaWdodCAvIHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgbGV0IHNjYWxlUmF0aW9cclxuICAgICAgICBpZiAoaW1nUmF0aW8gPCBjYW52YXNSYXRpbykge1xyXG4gICAgICAgICAgc2NhbGVSYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGggLyBzY2FsZVJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzY2FsZVJhdGlvID0gaW1nV2lkdGggLyB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHNjYWxlUmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYXNwZWN0Rml0ICgpIHtcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICBsZXQgaW1nUmF0aW8gPSBpbWdIZWlnaHQgLyBpbWdXaWR0aFxyXG4gICAgICAgIGxldCBjYW52YXNSYXRpbyA9IHRoaXMucmVhbEhlaWdodCAvIHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgbGV0IHNjYWxlUmF0aW9cclxuICAgICAgICBpZiAoaW1nUmF0aW8gPCBjYW52YXNSYXRpbykge1xyXG4gICAgICAgICAgc2NhbGVSYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyBzY2FsZVJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodCkgLyAyXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNjYWxlUmF0aW8gPSBpbWdIZWlnaHQgLyB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5yZWFsV2lkdGgpIC8gMlxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIG5hdHVyYWxTaXplICgpIHtcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHRcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aCkgLyAyXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodCkgLyAyXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyU3RhcnQgKGV2dCkge1xyXG4gICAgICAgIHRoaXMuc3VwcG9ydFRvdWNoID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcclxuICAgICAgICBsZXQgcG9pbnRlckNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gcG9pbnRlckNvb3JkXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICAvLyBzaW11bGF0ZSBjbGljayB3aXRoIHRvdWNoIG9uIG1vYmlsZSBkZXZpY2VzXHJcbiAgICAgICAgaWYgKCF0aGlzLmltZyAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgICAgdGhpcy50YWJTdGFydCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWdub3JlIG1vdXNlIHJpZ2h0IGNsaWNrIGFuZCBtaWRkbGUgY2xpY2tcclxuICAgICAgICBpZiAoZXZ0LndoaWNoICYmIGV2dC53aGljaCA+IDEpIHJldHVyblxyXG5cclxuICAgICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSB0cnVlXHJcbiAgICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNhbmNlbEV2ZW50cyA9IFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCcsICdwb2ludGVyZW5kJywgJ3BvaW50ZXJjYW5jZWwnXVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjYW5jZWxFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgIGxldCBlID0gY2FuY2VsRXZlbnRzW2ldXHJcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuaGFuZGxlUG9pbnRlckVuZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyRW5kIChldnQpIHtcclxuICAgICAgICBsZXQgcG9pbnRlck1vdmVEaXN0YW5jZSA9IDBcclxuICAgICAgICBpZiAodGhpcy5wb2ludGVyU3RhcnRDb29yZCkge1xyXG4gICAgICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgICBwb2ludGVyTW92ZURpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvaW50ZXJDb29yZC54IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC54LCAyKSArIE1hdGgucG93KHBvaW50ZXJDb29yZC55IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC55LCAyKSkgfHwgMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltZyAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgICAgbGV0IHRhYkVuZCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICBpZiAoKHBvaW50ZXJNb3ZlRGlzdGFuY2UgPCBDTElDS19NT1ZFX1RIUkVTSE9MRCkgJiYgdGFiRW5kIC0gdGhpcy50YWJTdGFydCA8IE1JTl9NU19QRVJfQ0xJQ0sgJiYgdGhpcy5zdXBwb3J0VG91Y2gpIHtcclxuICAgICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMudGFiU3RhcnQgPSAwXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IDBcclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IG51bGxcclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5wb2ludGVyU3RhcnRDb29yZCA9IG51bGxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IHRydWVcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ1RvTW92ZSB8fCAhdGhpcy5pbWcpIHJldHVyblxyXG5cclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxyXG4gICAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIGlmICh0aGlzLmxhc3RNb3ZpbmdDb29yZCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoe1xyXG4gICAgICAgICAgICAgIHg6IGNvb3JkLnggLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC54LFxyXG4gICAgICAgICAgICAgIHk6IGNvb3JkLnkgLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC55XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLnBpbmNoaW5nKSByZXR1cm5cclxuICAgICAgICAgIGxldCBkaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXHJcbiAgICAgICAgICBsZXQgZGVsdGEgPSBkaXN0YW5jZSAtIHRoaXMucGluY2hEaXN0YW5jZVxyXG4gICAgICAgICAgdGhpcy56b29tKGRlbHRhID4gMCwgbnVsbCwgUElOQ0hfQUNDRUxFUkFUSU9OKVxyXG4gICAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gZGlzdGFuY2VcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVXaGVlbCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlU2Nyb2xsVG9ab29tIHx8ICF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIGlmIChldnQud2hlZWxEZWx0YSA8IDAgfHwgZXZ0LmRlbHRhWSA+IDAgfHwgZXZ0LmRldGFpbCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuem9vbSh0aGlzLnJldmVyc2VTY3JvbGxUb1pvb20sIGNvb3JkKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LndoZWVsRGVsdGEgPiAwIHx8IGV2dC5kZWx0YVkgPCAwIHx8IGV2dC5kZXRhaWwgPCAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20oIXRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSwgY29vcmQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ0VudGVyIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnQW5kRHJvcCB8fCB0aGlzLmltZyB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSB0cnVlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcmFnTGVhdmUgKGV2dCkge1xyXG4gICAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyYWdPdmVyIChldnQpIHtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyb3AgKGV2dCkge1xyXG4gICAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuXHJcbiAgICAgICAgbGV0IGZpbGVcclxuICAgICAgICBsZXQgZHQgPSBldnQuZGF0YVRyYW5zZmVyXHJcbiAgICAgICAgaWYgKCFkdCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKGR0Lml0ZW1zKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZHQuaXRlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSBkdC5pdGVtc1tpXVxyXG4gICAgICAgICAgICBpZiAoaXRlbS5raW5kID09ICdmaWxlJykge1xyXG4gICAgICAgICAgICAgIGZpbGUgPSBpdGVtLmdldEFzRmlsZSgpXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBmaWxlID0gZHQuZmlsZXNbMF1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICB0aGlzLm9uTmV3RmlsZUluKGZpbGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbW92ZSAob2Zmc2V0KSB7XHJcbiAgICAgICAgaWYgKCFvZmZzZXQpIHJldHVyblxyXG4gICAgICAgIGxldCBvbGRYID0gdGhpcy5pbWdEYXRhLnN0YXJ0WFxyXG4gICAgICAgIGxldCBvbGRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggKz0gb2Zmc2V0LnhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZICs9IG9mZnNldC55XHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIHRoaXMucHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYICE9PSBvbGRYIHx8IHRoaXMuaW1nRGF0YS5zdGFydFkgIT09IG9sZFkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLk1PVkVfRVZFTlQpXHJcbiAgICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFkgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWFsV2lkdGggLSB0aGlzLmltZ0RhdGEuc3RhcnRYID4gdGhpcy5pbWdEYXRhLndpZHRoKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVhbEhlaWdodCAtIHRoaXMuaW1nRGF0YS5zdGFydFkgPiB0aGlzLmltZ0RhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHpvb20gKHpvb21JbiwgcG9zLCBpbm5lckFjY2VsZXJhdGlvbiA9IDEpIHtcclxuICAgICAgICBwb3MgPSBwb3MgfHwge1xyXG4gICAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXHJcbiAgICAgICAgICB5OiB0aGlzLmltZ0RhdGEuc3RhcnRZICsgdGhpcy5pbWdEYXRhLmhlaWdodCAvIDJcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJlYWxTcGVlZCA9IHRoaXMuem9vbVNwZWVkICogaW5uZXJBY2NlbGVyYXRpb25cclxuICAgICAgICBsZXQgc3BlZWQgPSAodGhpcy5yZWFsV2lkdGggKiBQQ1RfUEVSX1pPT00pICogcmVhbFNwZWVkXHJcbiAgICAgICAgbGV0IHggPSAxXHJcbiAgICAgICAgaWYgKHpvb21Jbikge1xyXG4gICAgICAgICAgeCA9IDEgKyBzcGVlZFxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbWdEYXRhLndpZHRoID4gTUlOX1dJRFRIKSB7XHJcbiAgICAgICAgICB4ID0gMSAtIHNwZWVkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb2xkV2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGhcclxuICAgICAgICBsZXQgb2xkSGVpZ2h0ID0gdGhpcy5pbWdEYXRhLmhlaWdodFxyXG5cclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGggKiB4XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHQgKiB4XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLndpZHRoIDwgdGhpcy5yZWFsV2lkdGgpIHtcclxuICAgICAgICAgICAgbGV0IF94ID0gdGhpcy5yZWFsV2lkdGggLyB0aGlzLmltZ0RhdGEud2lkdGhcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHQgKiBfeFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh0aGlzLmltZ0RhdGEuaGVpZ2h0IDwgdGhpcy5yZWFsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMucmVhbEhlaWdodCAvIHRoaXMuaW1nRGF0YS5oZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGggKiBfeFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2xkV2lkdGgudG9GaXhlZCgyKSAhPT0gdGhpcy5pbWdEYXRhLndpZHRoLnRvRml4ZWQoMikgfHwgb2xkSGVpZ2h0LnRvRml4ZWQoMikgIT09IHRoaXMuaW1nRGF0YS5oZWlnaHQudG9GaXhlZCgyKSkge1xyXG4gICAgICAgICAgbGV0IG9mZnNldFggPSAoeCAtIDEpICogKHBvcy54IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WClcclxuICAgICAgICAgIGxldCBvZmZzZXRZID0gKHggLSAxKSAqIChwb3MueSAtIHRoaXMuaW1nRGF0YS5zdGFydFkpXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gdGhpcy5pbWdEYXRhLnN0YXJ0WCAtIG9mZnNldFhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZIC0gb2Zmc2V0WVxyXG5cclxuICAgICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5aT09NX0VWRU5UKVxyXG4gICAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHRoaXMuaW1nRGF0YS53aWR0aCAvIHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcm90YXRlIChvcmllbnRhdGlvbiA9IDYsIHVzZU9yaWdpbmFsKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID4gMSB8fCB1c2VPcmlnaW5hbCkge1xyXG4gICAgICAgICAgdmFyIF9pbWcgPSB1LmdldFJvdGF0ZWRJbWFnZSh1c2VPcmlnaW5hbCA/IHRoaXMub3JpZ2luYWxJbWFnZSA6IHRoaXMuaW1nLCBvcmllbnRhdGlvbilcclxuICAgICAgICAgIF9pbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmltZyA9IF9pbWdcclxuICAgICAgICAgICAgdGhpcy5wbGFjZUltYWdlKHVzZU9yaWdpbmFsKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnBsYWNlSW1hZ2UoKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09IDIpIHtcclxuICAgICAgICAgIC8vIGZsaXAgeFxyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUuZmxpcFgodGhpcy5vcmllbnRhdGlvbilcclxuICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDQpIHtcclxuICAgICAgICAgIC8vIGZsaXAgeVxyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUuZmxpcFkodGhpcy5vcmllbnRhdGlvbilcclxuICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDYpIHtcclxuICAgICAgICAgIC8vIDkwIGRlZ1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodGhpcy5vcmllbnRhdGlvbilcclxuICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDMpIHtcclxuICAgICAgICAgIC8vIDE4MCBkZWdcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHUucm90YXRlOTAodGhpcy5vcmllbnRhdGlvbikpXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA4KSB7XHJcbiAgICAgICAgICAvLyAyNzAgZGVnXHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHUucm90YXRlOTAodGhpcy5vcmllbnRhdGlvbikpKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb25cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh1c2VPcmlnaW5hbCkge1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFpbnRCYWNrZ3JvdW5kICgpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICd0cmFuc3BhcmVudCcgOiB0aGlzLmNhbnZhc0NvbG9yXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucmVhbFdpZHRoLCB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGRyYXcgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGlmICh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fZHJhd0ZyYW1lKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl9kcmF3RnJhbWUoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9kcmF3RnJhbWUgKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmltZ0RhdGFcclxuXHJcbiAgICAgICAgdGhpcy5wYWludEJhY2tncm91bmQoKVxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkRSQVcsIGN0eClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdlbmVyYXRlRGF0YVVybCAodHlwZSwgY29tcHJlc3Npb25SYXRlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuICcnXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCh0eXBlLCBjb21wcmVzc2lvblJhdGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuIG51bGxcclxuICAgICAgICB0aGlzLmNhbnZhcy50b0Jsb2IoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcm9taXNlZEJsb2IgKC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAodHlwZW9mIFByb21pc2UgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGNvbnNvbGUud2FybignTm8gUHJvbWlzZSBzdXBwb3J0LiBQbGVhc2UgYWRkIFByb21pc2UgcG9seWZpbGwgaWYgeW91IHdhbnQgdG8gdXNlIHRoaXMgbWV0aG9kLicpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVCbG9iKChibG9iKSA9PiB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZShibG9iKVxyXG4gICAgICAgICAgICB9LCBhcmdzKVxyXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldE1ldGFkYXRhICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4ge31cclxuICAgICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSB9ID0gdGhpcy5pbWdEYXRhXHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBzdGFydFgsXHJcbiAgICAgICAgICBzdGFydFksXHJcbiAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZVJhdGlvLFxyXG4gICAgICAgICAgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb25cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhcHBseU1ldGFkYXRhICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMudXNlck1ldGFkYXRhKSByZXR1cm5cclxuICAgICAgICB2YXIgeyBzdGFydFgsIHN0YXJ0WSwgc2NhbGUgfSA9IHRoaXMudXNlck1ldGFkYXRhXHJcblxyXG4gICAgICAgIGlmICh1Lm51bWJlclZhbGlkKHN0YXJ0WCkpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSBzdGFydFhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh1Lm51bWJlclZhbGlkKHN0YXJ0WSkpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSBzdGFydFlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh1Lm51bWJlclZhbGlkKHNjYWxlKSkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGggKiBzY2FsZVxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodCAqIHNjYWxlXHJcbiAgICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSBzY2FsZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGUgbGFuZz1cInN0eWx1c1wiPlxyXG4gIC5jcm9wcGEtY29udGFpbmVyXHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2tcclxuICAgIGN1cnNvcjogcG9pbnRlclxyXG4gICAgdHJhbnNpdGlvbjogYWxsIC4zc1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlXHJcbiAgICBmb250LXNpemU6IDBcclxuICAgIGFsaWduLXNlbGY6IGZsZXgtc3RhcnRcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNlNmU2ZTZcclxuICAgIGNhbnZhc1xyXG4gICAgICB0cmFuc2l0aW9uOiBhbGwgLjNzXHJcbiAgICAmOmhvdmVyXHJcbiAgICAgIG9wYWNpdHk6IC43XHJcbiAgICAmLmNyb3BwYS0tZHJvcHpvbmVcclxuICAgICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDEwcHggbGlnaHRuZXNzKGJsYWNrLCAyMCUpXHJcbiAgICAgIGNhbnZhc1xyXG4gICAgICAgIG9wYWNpdHk6IC41XHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWQtY2NcclxuICAgICAgY3Vyc29yOiBkZWZhdWx0XHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAmLmNyb3BwYS0taGFzLXRhcmdldFxyXG4gICAgICBjdXJzb3I6IG1vdmVcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgICAgJi5jcm9wcGEtLWRpc2FibGVkLW16XHJcbiAgICAgICAgY3Vyc29yOiBkZWZhdWx0XHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWRcclxuICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZFxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgc3ZnLmljb24tcmVtb3ZlXHJcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZVxyXG4gICAgICBiYWNrZ3JvdW5kOiB3aGl0ZVxyXG4gICAgICBib3JkZXItcmFkaXVzOiA1MCVcclxuICAgICAgZmlsdGVyOiBkcm9wLXNoYWRvdygtMnB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjcpKVxyXG4gICAgICB6LWluZGV4OiAxMFxyXG4gICAgICBjdXJzb3I6IHBvaW50ZXJcclxuICAgICAgYm9yZGVyOiAycHggc29saWQgd2hpdGVcclxuXHJcbjwvc3R5bGU+XHJcbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJpbXBvcnQgY29tcG9uZW50IGZyb20gJy4vY3JvcHBlci52dWUnXHJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbidcclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gIGNvbXBvbmVudE5hbWU6ICdjcm9wcGEnXHJcbn1cclxuXHJcbmNvbnN0IFZ1ZUNyb3BwYSA9IHtcclxuICBpbnN0YWxsOiBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcclxuICAgIGxldCB2ZXJzaW9uID0gTnVtYmVyKFZ1ZS52ZXJzaW9uLnNwbGl0KCcuJylbMF0pXHJcbiAgICBpZiAodmVyc2lvbiA8IDIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB2dWUtY3JvcHBhIHN1cHBvcnRzIHZ1ZSB2ZXJzaW9uIDIuMCBhbmQgYWJvdmUuIFlvdSBhcmUgdXNpbmcgVnVlQCR7dmVyc2lvbn0uIFBsZWFzZSB1cGdyYWRlIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBWdWUuYClcclxuICAgIH1cclxuICAgIGxldCBjb21wb25lbnROYW1lID0gb3B0aW9ucy5jb21wb25lbnROYW1lIHx8ICdjcm9wcGEnXHJcblxyXG4gICAgLy8gcmVnaXN0cmF0aW9uXHJcbiAgICBWdWUuY29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudClcclxuICB9LFxyXG5cclxuICBjb21wb25lbnRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsiZGVmaW5lIiwidGhpcyIsInBvaW50Iiwidm0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsImV2dCIsInBvaW50ZXIiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJvbmVQb2ludENvb3JkIiwicG9pbnRlcjEiLCJwb2ludGVyMiIsImNvb3JkMSIsImNvb3JkMiIsIk1hdGgiLCJzcXJ0IiwicG93IiwieCIsInkiLCJpbWciLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsImRvY3VtZW50Iiwid2luZG93IiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwibGVuZ3RoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsImN1cnJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJ0aW1lVG9DYWxsIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiYXJnIiwiaXNBcnJheSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIkhUTUxDYW52YXNFbGVtZW50IiwiYmluU3RyIiwibGVuIiwiYXJyIiwidG9CbG9iIiwiZGVmaW5lUHJvcGVydHkiLCJ0eXBlIiwiYXRvYiIsInRvRGF0YVVSTCIsInNwbGl0IiwiVWludDhBcnJheSIsImkiLCJjaGFyQ29kZUF0IiwiQmxvYiIsImR0IiwiZGF0YVRyYW5zZmVyIiwib3JpZ2luYWxFdmVudCIsInR5cGVzIiwiYXJyYXlCdWZmZXIiLCJ2aWV3IiwiRGF0YVZpZXciLCJnZXRVaW50MTYiLCJieXRlTGVuZ3RoIiwib2Zmc2V0IiwibWFya2VyIiwiZ2V0VWludDMyIiwibGl0dGxlIiwidGFncyIsImJhc2U2NCIsInJlcGxhY2UiLCJiaW5hcnlTdHJpbmciLCJieXRlcyIsImJ1ZmZlciIsIm9yaWVudGF0aW9uIiwiX2NhbnZhcyIsIkNhbnZhc0V4aWZPcmllbnRhdGlvbiIsImRyYXdJbWFnZSIsIl9pbWciLCJJbWFnZSIsInNyYyIsIm9yaSIsIm1hcCIsIm4iLCJpc05hTiIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJmbG9vciIsInZhbCIsIlN0cmluZyIsIkJvb2xlYW4iLCJIVE1MSW1hZ2VFbGVtZW50IiwidmFsaWRzIiwiaW5kZXhPZiIsInRlc3QiLCJQQ1RfUEVSX1pPT00iLCJNSU5fTVNfUEVSX0NMSUNLIiwiQ0xJQ0tfTU9WRV9USFJFU0hPTEQiLCJNSU5fV0lEVEgiLCJERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCIsIlBJTkNIX0FDQ0VMRVJBVElPTiIsInJlbmRlciIsInByb3BzIiwid2lkdGgiLCJoZWlnaHQiLCJwbGFjZWhvbGRlckZvbnRTaXplIiwiaW5pdCIsInJBRlBvbHlmaWxsIiwidG9CbG9iUG9seWZpbGwiLCJzdXBwb3J0cyIsInN1cHBvcnREZXRlY3Rpb24iLCJiYXNpYyIsIndhcm4iLCJpbnN0YW5jZSIsInByZXZlbnRXaGl0ZVNwYWNlIiwiaW1hZ2VTZXQiLCJzZXRTaXplIiwicGxhY2VJbWFnZSIsImRyYXciLCIkcmVmcyIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY2FudmFzQ29sb3IiLCJjdHgiLCJnZXRDb250ZXh0Iiwib3JpZ2luYWxJbWFnZSIsInNldEluaXRpYWwiLCIkZW1pdCIsImV2ZW50cyIsIklOSVRfRVZFTlQiLCJmaWxlSW5wdXQiLCJmaWxlcyIsInJlYWxXaWR0aCIsInJlYWxIZWlnaHQiLCJhbW91bnQiLCJtb3ZlIiwiem9vbSIsInN0ZXAiLCJkaXNhYmxlUm90YXRpb24iLCJkaXNhYmxlZCIsInBhcnNlSW50Iiwicm90YXRlQnlTdGVwIiwicm90YXRlIiwiJG5leHRUaWNrIiwicmVtb3ZlIiwiY2hvb3NlRmlsZSIsImdlbmVyYXRlRGF0YVVybCIsImdlbmVyYXRlQmxvYiIsInByb21pc2VkQmxvYiIsImdldE1ldGFkYXRhIiwibWV0YWRhdGEiLCJ1c2VyTWV0YWRhdGEiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiRmlsZSIsIkZpbGVSZWFkZXIiLCJGaWxlTGlzdCIsInBhaW50QmFja2dyb3VuZCIsInNldEltYWdlUGxhY2Vob2xkZXIiLCJ0ZXh0QmFzZWxpbmUiLCJ0ZXh0QWxpZ24iLCJkZWZhdWx0Rm9udFNpemUiLCJwbGFjZWhvbGRlciIsImZvbnRTaXplIiwicmVhbFBsYWNlaG9sZGVyRm9udFNpemUiLCJmb250IiwiZmlsbFN0eWxlIiwicGxhY2Vob2xkZXJDb2xvciIsImZpbGxUZXh0IiwiaGFkSW1hZ2UiLCJpbWdEYXRhIiwic2NhbGVSYXRpbyIsIklNQUdFX1JFTU9WRV9FVkVOVCIsIiRzbG90cyIsInZOb2RlIiwidGFnIiwiZWxtIiwib25Mb2FkIiwidSIsImltYWdlTG9hZGVkIiwib25sb2FkIiwiaW5pdGlhbCIsImluaXRpYWxJbWFnZSIsInNldEF0dHJpYnV0ZSIsImJhYmVsSGVscGVycy50eXBlb2YiLCJfb25sb2FkIiwiZGF0YXNldCIsIklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UIiwib25lcnJvciIsImNsaWNrIiwiZGlzYWJsZUNsaWNrVG9DaG9vc2UiLCJzdXBwb3J0VG91Y2giLCJpbnB1dCIsImZpbGUiLCJvbk5ld0ZpbGVJbiIsIkZJTEVfQ0hPT1NFX0VWRU5UIiwiZmlsZVNpemVJc1ZhbGlkIiwiRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCIsIkVycm9yIiwiZmlsZVNpemVMaW1pdCIsImZpbGVUeXBlSXNWYWxpZCIsIkZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVCIsIm5hbWUiLCJ0b0xvd2VyQ2FzZSIsInBvcCIsImFjY2VwdCIsImZyIiwiZSIsImZpbGVEYXRhIiwidGFyZ2V0IiwicmVzdWx0IiwiZ2V0RmlsZU9yaWVudGF0aW9uIiwiYmFzZTY0VG9BcnJheUJ1ZmZlciIsIk5FV19JTUFHRSIsInJlYWRBc0RhdGFVUkwiLCJzaXplIiwiYmFzZU1pbWV0eXBlIiwidCIsInRyaW0iLCJjaGFyQXQiLCJzbGljZSIsImZpbGVCYXNlVHlwZSIsImFwcGx5TWV0YWRhdGEiLCJuYXR1cmFsSGVpZ2h0Iiwic3RhcnRYIiwibnVtYmVyVmFsaWQiLCJzdGFydFkiLCJpbml0aWFsU2l6ZSIsImFzcGVjdEZpdCIsIm5hdHVyYWxTaXplIiwiYXNwZWN0RmlsbCIsImluaXRpYWxQb3NpdGlvbiIsImV4ZWMiLCJwcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlIiwiaW1nV2lkdGgiLCJpbWdIZWlnaHQiLCJpbWdSYXRpbyIsImNhbnZhc1JhdGlvIiwicG9pbnRlck1vdmVkIiwicG9pbnRlckNvb3JkIiwiZ2V0UG9pbnRlckNvb3JkcyIsInBvaW50ZXJTdGFydENvb3JkIiwidGFiU3RhcnQiLCJ2YWx1ZU9mIiwid2hpY2giLCJkcmFnZ2luZyIsInBpbmNoaW5nIiwiY29vcmQiLCJsYXN0TW92aW5nQ29vcmQiLCJkaXNhYmxlUGluY2hUb1pvb20iLCJwaW5jaERpc3RhbmNlIiwiZ2V0UGluY2hEaXN0YW5jZSIsImNhbmNlbEV2ZW50cyIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYW5kbGVQb2ludGVyRW5kIiwicG9pbnRlck1vdmVEaXN0YW5jZSIsInRhYkVuZCIsImRpc2FibGVEcmFnVG9Nb3ZlIiwicHJldmVudERlZmF1bHQiLCJkaXN0YW5jZSIsImRlbHRhIiwiZGlzYWJsZVNjcm9sbFRvWm9vbSIsIndoZWVsRGVsdGEiLCJkZWx0YVkiLCJkZXRhaWwiLCJyZXZlcnNlU2Nyb2xsVG9ab29tIiwiZGlzYWJsZURyYWdBbmREcm9wIiwiZXZlbnRIYXNGaWxlIiwiZmlsZURyYWdnZWRPdmVyIiwiaXRlbXMiLCJpdGVtIiwia2luZCIsImdldEFzRmlsZSIsIm9sZFgiLCJvbGRZIiwiTU9WRV9FVkVOVCIsInpvb21JbiIsInBvcyIsImlubmVyQWNjZWxlcmF0aW9uIiwicmVhbFNwZWVkIiwiem9vbVNwZWVkIiwic3BlZWQiLCJvbGRXaWR0aCIsIm9sZEhlaWdodCIsIl94IiwidG9GaXhlZCIsIm9mZnNldFgiLCJvZmZzZXRZIiwiWk9PTV9FVkVOVCIsInVzZU9yaWdpbmFsIiwiZ2V0Um90YXRlZEltYWdlIiwiZmxpcFgiLCJmbGlwWSIsInJvdGF0ZTkwIiwiY2xlYXJSZWN0IiwiZmlsbFJlY3QiLCJfZHJhd0ZyYW1lIiwiRFJBVyIsImNvbXByZXNzaW9uUmF0ZSIsIm1pbWVUeXBlIiwicXVhbGl0eUFyZ3VtZW50IiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYmxvYiIsImVyciIsInNjYWxlIiwiZGVmYXVsdE9wdGlvbnMiLCJWdWVDcm9wcGEiLCJWdWUiLCJvcHRpb25zIiwiYXNzaWduIiwidmVyc2lvbiIsImNvbXBvbmVudE5hbWUiLCJjb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxDQUFDLFVBQVUsSUFBSSxFQUFFLE9BQU8sRUFBRTtJQUN0QixJQUFJLE9BQU9BLFNBQU0sS0FBSyxVQUFVLElBQUlBLFNBQU0sQ0FBQyxHQUFHLEVBQUU7UUFDNUNBLFNBQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDdkIsTUFBTSxBQUFpQztRQUNwQyxjQUFjLEdBQUcsT0FBTyxFQUFFLENBQUM7S0FDOUIsQUFFRjtDQUNGLENBQUNDLGNBQUksRUFBRSxZQUFZO0VBQ2xCLFlBQVksQ0FBQzs7RUFFYixTQUFTLFNBQVMsQ0FBQyxHQUFH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
