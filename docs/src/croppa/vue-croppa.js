/*
 * vue-croppa v0.3.0
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
  DRAW: 'draw'
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
var DEBUG = false;

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
      scaleRatio: 1,
      orientation: 1,
      userMetadata: null
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
        this.setSize();
        this.imgContentInit();
      }
    },
    realHeight: function realHeight() {
      if (!this.img) {
        this.init();
      } else {
        this.setSize();
        this.imgContentInit();
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
      this.imgContentInit();
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
          _this.rotate(metadata.orientation || _this.orientation, true);
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
      this.userMetadata = null;

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
      } else {
        img.onload = function () {
          _this3._onload(img, +img.dataset['exifOrientation']);
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

      this.rotate(orientation);
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
    imgContentInit: function imgContentInit() {
      this.naturalWidth = this.img.naturalWidth;
      this.naturalHeight = this.img.naturalHeight;

      this.imgData.startX = 0;
      this.imgData.startY = 0;
      if (!this.preventWhiteSpace && this.initialSize == 'contain') {
        this.aspectFit();
      } else if (!this.preventWhiteSpace && this.initialSize == 'natural') {
        this.naturalSize();
      } else {
        this.aspectFill();
      }
      this.scaleRatio = this.imgData.width / this.naturalWidth;

      if (/top/.test(this.initialPosition)) {
        this.imgData.startY = 0;
      } else if (/bottom/.test(this.initialPosition)) {
        this.imgData.startY = this.realHeight - this.imgData.height;
      }

      if (/left/.test(this.initialPosition)) {
        this.imgData.startX = 0;
      } else if (/right/.test(this.initialPosition)) {
        this.imgData.startX = this.realWidth - this.imgData.width;
      }

      if (/^-?\d+% -?\d+%$/.test(this.initialPosition)) {
        var result = /^(-?\d+)% (-?\d+)%$/.exec(this.initialPosition);
        var x = +result[1] / 100;
        var y = +result[2] / 100;
        this.imgData.startX = x * (this.realWidth - this.imgData.width);
        this.imgData.startY = y * (this.realHeight - this.imgData.height);
      }

      this.applyMetadata();

      if (this.preventWhiteSpace) {
        this.preventMovingToWhiteSpace();
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
      } else {
        scaleRatio = imgWidth / this.realWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.realWidth;
        this.imgData.startY = -(this.imgData.height - this.realHeight) / 2;
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
      if (orientation > 1) {
        var _img = u.getRotatedImage(useOriginal ? this.originalImage : this.img, orientation);
        _img.onload = function () {
          _this5.img = _img;
          _this5.imgContentInit();
        };
      } else {
        this.imgContentInit();
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

      startX = +startX;
      startY = +startY;
      scale = +scale;

      if (!isNaN(startX)) {
        this.imgData.startX = startX;
      }

      if (!isNaN(startY)) {
        this.imgData.startY = startY;
      }

      if (!isNaN(scale)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgYmFzZTY0ID0gYmFzZTY0LnJlcGxhY2UoL15kYXRhOihbXjtdKyk7YmFzZTY0LC9nbWksICcnKVxyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9IE51bWJlci5pc0ludGVnZXIgfHwgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodmFsdWUpICYmIE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgdmFsdWU6IE9iamVjdCxcclxuICB3aWR0aDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMjAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBoZWlnaHQ6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXI6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdDaG9vc2UgYW4gaW1hZ2UnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckNvbG9yOiB7XHJcbiAgICBkZWZhdWx0OiAnIzYwNjA2MCdcclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyRm9udFNpemU6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+PSAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBjYW52YXNDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJ3RyYW5zcGFyZW50J1xyXG4gIH0sXHJcbiAgcXVhbGl0eToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWwpICYmIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnLmpwZywuanBlZywucG5nLC5naWYsLmJtcCwud2VicCwuc3ZnLC50aWZmJ1xyXG4gIH0sXHJcbiAgZmlsZVNpemVMaW1pdDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnQW5kRHJvcDogQm9vbGVhbixcclxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ1RvTW92ZTogQm9vbGVhbixcclxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIGRpc2FibGVQaW5jaFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUm90YXRpb246IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9LFxyXG4gIGluaXRpYWxJbWFnZTogW1N0cmluZywgSFRNTEltYWdlRWxlbWVudF0sXHJcbiAgaW5pdGlhbFNpemU6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdjb3ZlcicsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA9PT0gJ2NvdmVyJyB8fCB2YWwgPT09ICdjb250YWluJyB8fCB2YWwgPT09ICduYXR1cmFsJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgaW5pdGlhbFBvc2l0aW9uOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnY2VudGVyJyxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICB2YXIgdmFsaWRzID0gW1xyXG4gICAgICAgICdjZW50ZXInLFxyXG4gICAgICAgICd0b3AnLFxyXG4gICAgICAgICdib3R0b20nLFxyXG4gICAgICAgICdsZWZ0JyxcclxuICAgICAgICAncmlnaHQnLFxyXG4gICAgICAgICd0b3AgbGVmdCcsXHJcbiAgICAgICAgJ3RvcCByaWdodCcsXHJcbiAgICAgICAgJ2JvdHRvbSBsZWZ0JyxcclxuICAgICAgICAnYm90dG9tIHJpZ2h0JyxcclxuICAgICAgICAnbGVmdCB0b3AnLFxyXG4gICAgICAgICdyaWdodCB0b3AnLFxyXG4gICAgICAgICdsZWZ0IGJvdHRvbScsXHJcbiAgICAgICAgJ3JpZ2h0IGJvdHRvbSdcclxuICAgICAgXVxyXG4gICAgICByZXR1cm4gdmFsaWRzLmluZGV4T2YodmFsKSA+PSAwIHx8IC9eLT9cXGQrJSAtP1xcZCslJC8udGVzdCh2YWwpXHJcbiAgICB9XHJcbiAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQge1xuICBJTklUX0VWRU5UOiAnaW5pdCcsXG4gIEZJTEVfQ0hPT1NFX0VWRU5UOiAnZmlsZS1jaG9vc2UnLFxuICBGSUxFX1NJWkVfRVhDRUVEX0VWRU5UOiAnZmlsZS1zaXplLWV4Y2VlZCcsXG4gIEZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVDogJ2ZpbGUtdHlwZS1taXNtYXRjaCcsXG4gIE5FV19JTUFHRTogJ25ldy1pbWFnZScsXG4gIElNQUdFX1JFTU9WRV9FVkVOVDogJ2ltYWdlLXJlbW92ZScsXG4gIE1PVkVfRVZFTlQ6ICdtb3ZlJyxcbiAgWk9PTV9FVkVOVDogJ3pvb20nLFxuICBEUkFXOiAnZHJhdydcbn0iLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiByZWY9XCJ3cmFwcGVyXCJcclxuICAgICAgIDpjbGFzcz1cImBjcm9wcGEtY29udGFpbmVyICR7aW1nID8gJ2Nyb3BwYS0taGFzLXRhcmdldCcgOiAnJ30gJHtkaXNhYmxlZCA/ICdjcm9wcGEtLWRpc2FibGVkJyA6ICcnfSAke2Rpc2FibGVDbGlja1RvQ2hvb3NlID8gJ2Nyb3BwYS0tZGlzYWJsZWQtY2MnIDogJyd9ICR7ZGlzYWJsZURyYWdUb01vdmUgJiYgZGlzYWJsZVNjcm9sbFRvWm9vbSA/ICdjcm9wcGEtLWRpc2FibGVkLW16JyA6ICcnfSAke2ZpbGVEcmFnZ2VkT3ZlciA/ICdjcm9wcGEtLWRyb3B6b25lJyA6ICcnfWBcIlxyXG4gICAgICAgQGRyYWdlbnRlci5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcmFnRW50ZXJcIlxyXG4gICAgICAgQGRyYWdsZWF2ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcmFnTGVhdmVcIlxyXG4gICAgICAgQGRyYWdvdmVyLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdPdmVyXCJcclxuICAgICAgIEBkcm9wLnN0b3AucHJldmVudD1cImhhbmRsZURyb3BcIj5cclxuICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiXHJcbiAgICAgICAgICAgOmFjY2VwdD1cImFjY2VwdFwiXHJcbiAgICAgICAgICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxyXG4gICAgICAgICAgIHJlZj1cImZpbGVJbnB1dFwiXHJcbiAgICAgICAgICAgaGlkZGVuXHJcbiAgICAgICAgICAgQGNoYW5nZT1cImhhbmRsZUlucHV0Q2hhbmdlXCIgLz5cclxuICAgIDxkaXYgY2xhc3M9XCJzbG90c1wiXHJcbiAgICAgICAgIHN0eWxlPVwid2lkdGg6IDA7IGhlaWdodDogMDsgdmlzaWJpbGl0eTogaGlkZGVuO1wiPlxyXG4gICAgICA8c2xvdCBuYW1lPVwiaW5pdGlhbFwiPjwvc2xvdD5cclxuICAgICAgPHNsb3QgbmFtZT1cInBsYWNlaG9sZGVyXCI+PC9zbG90PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8Y2FudmFzIHJlZj1cImNhbnZhc1wiXHJcbiAgICAgICAgICAgIEBjbGljay5zdG9wLnByZXZlbnQ9XCJoYW5kbGVDbGlja1wiXHJcbiAgICAgICAgICAgIEB0b3VjaHN0YXJ0LnN0b3A9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAbW91c2Vkb3duLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyc3RhcnQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHRvdWNoZW5kLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAdG91Y2hjYW5jZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBtb3VzZXVwLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcmVuZC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJjYW5jZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEB0b3VjaG1vdmUuc3RvcD1cImhhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQG1vdXNlbW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBwb2ludGVybW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBET01Nb3VzZVNjcm9sbC5zdG9wPVwiaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAd2hlZWwuc3RvcD1cImhhbmRsZVdoZWVsXCJcclxuICAgICAgICAgICAgQG1vdXNld2hlZWwuc3RvcD1cImhhbmRsZVdoZWVsXCI+PC9jYW52YXM+XHJcbiAgICA8c3ZnIGNsYXNzPVwiaWNvbiBpY29uLXJlbW92ZVwiXHJcbiAgICAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZ1wiXHJcbiAgICAgICAgIEBjbGljaz1cInJlbW92ZVwiXHJcbiAgICAgICAgIDpzdHlsZT1cImB0b3A6IC0ke2hlaWdodC80MH1weDsgcmlnaHQ6IC0ke3dpZHRoLzQwfXB4YFwiXHJcbiAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcclxuICAgICAgICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxyXG4gICAgICAgICA6d2lkdGg9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCJcclxuICAgICAgICAgOmhlaWdodD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIj5cclxuICAgICAgPHBhdGggZD1cIk01MTEuOTIxMjMxIDBDMjI5LjE3OTA3NyAwIDAgMjI5LjI1Nzg0NiAwIDUxMiAwIDc5NC43MDI3NjkgMjI5LjE3OTA3NyAxMDI0IDUxMS45MjEyMzEgMTAyNCA3OTQuNzgxNTM4IDEwMjQgMTAyNCA3OTQuNzAyNzY5IDEwMjQgNTEyIDEwMjQgMjI5LjI1Nzg0NiA3OTQuNzgxNTM4IDAgNTExLjkyMTIzMSAwWk03MzIuMDQxODQ2IDY1MC42MzM4NDYgNjUwLjUxNTY5MiA3MzIuMDgxMjMxQzY1MC41MTU2OTIgNzMyLjA4MTIzMSA1MjEuNDkxNjkyIDU5My42ODM2OTIgNTExLjg4MTg0NiA1OTMuNjgzNjkyIDUwMi40Mjk1MzggNTkzLjY4MzY5MiAzNzMuMzY2MTU0IDczMi4wODEyMzEgMzczLjM2NjE1NCA3MzIuMDgxMjMxTDI5MS43NjEyMzEgNjUwLjYzMzg0NkMyOTEuNzYxMjMxIDY1MC42MzM4NDYgNDMwLjMxNjMwOCA1MjMuNTAwMzA4IDQzMC4zMTYzMDggNTEyLjE5NjkyMyA0MzAuMzE2MzA4IDUwMC42OTY2MTUgMjkxLjc2MTIzMSAzNzMuNTIzNjkyIDI5MS43NjEyMzEgMzczLjUyMzY5MkwzNzMuMzY2MTU0IDI5MS45MTg3NjlDMzczLjM2NjE1NCAyOTEuOTE4NzY5IDUwMy40NTM1MzggNDMwLjM5NTA3NyA1MTEuODgxODQ2IDQzMC4zOTUwNzcgNTIwLjM0OTUzOCA0MzAuMzk1MDc3IDY1MC41MTU2OTIgMjkxLjkxODc2OSA2NTAuNTE1NjkyIDI5MS45MTg3NjlMNzMyLjA0MTg0NiAzNzMuNTIzNjkyQzczMi4wNDE4NDYgMzczLjUyMzY5MiA1OTMuNDQ3Mzg1IDUwMi41NDc2OTIgNTkzLjQ0NzM4NSA1MTIuMTk2OTIzIDU5My40NDczODUgNTIxLjQxMjkyMyA3MzIuMDQxODQ2IDY1MC42MzM4NDYgNzMyLjA0MTg0NiA2NTAuNjMzODQ2WlwiXHJcbiAgICAgICAgICAgIDpmaWxsPVwicmVtb3ZlQnV0dG9uQ29sb3JcIj48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xyXG4gIGltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xyXG4gIGltcG9ydCBldmVudHMgZnJvbSAnLi9ldmVudHMnXHJcblxyXG4gIGNvbnN0IFBDVF9QRVJfWk9PTSA9IDEgLyAxMDAwMDAgLy8gVGhlIGFtb3VudCBvZiB6b29taW5nIGV2ZXJ5dGltZSBpdCBoYXBwZW5zLCBpbiBwZXJjZW50YWdlIG9mIGltYWdlIHdpZHRoLlxyXG4gIGNvbnN0IE1JTl9NU19QRVJfQ0xJQ0sgPSA1MDAgLy8gSWYgdG91Y2ggZHVyYXRpb24gaXMgc2hvcnRlciB0aGFuIHRoZSB2YWx1ZSwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGFzIGEgY2xpY2suXHJcbiAgY29uc3QgQ0xJQ0tfTU9WRV9USFJFU0hPTEQgPSAxMDAgLy8gSWYgdG91Y2ggbW92ZSBkaXN0YW5jZSBpcyBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZSwgdGhlbiBpdCB3aWxsIGJ5IG5vIG1lYW4gYmUgY29uc2lkZXJlZCBhcyBhIGNsaWNrLlxyXG4gIGNvbnN0IE1JTl9XSURUSCA9IDEwIC8vIFRoZSBtaW5pbWFsIHdpZHRoIHRoZSB1c2VyIGNhbiB6b29tIHRvLlxyXG4gIGNvbnN0IERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQID0gMiAvIDMgLy8gUGxhY2Vob2xkZXIgdGV4dCBieSBkZWZhdWx0IHRha2VzIHVwIHRoaXMgYW1vdW50IG9mIHRpbWVzIG9mIGNhbnZhcyB3aWR0aC5cclxuICBjb25zdCBQSU5DSF9BQ0NFTEVSQVRJT04gPSAyIC8vIFRoZSBhbW91bnQgb2YgdGltZXMgYnkgd2hpY2ggdGhlIHBpbmNoaW5nIGlzIG1vcmUgc2Vuc2l0aXZlIHRoYW4gdGhlIHNjb2xsaW5nXHJcbiAgY29uc3QgREVCVUcgPSBmYWxzZVxyXG5cclxuICBleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBtb2RlbDoge1xyXG4gICAgICBwcm9wOiAndmFsdWUnLFxyXG4gICAgICBldmVudDogJ2luaXQnXHJcbiAgICB9LFxyXG5cclxuICAgIHByb3BzOiBwcm9wcyxcclxuXHJcbiAgICBkYXRhICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBpbnN0YW5jZTogbnVsbCxcclxuICAgICAgICBjYW52YXM6IG51bGwsXHJcbiAgICAgICAgY3R4OiBudWxsLFxyXG4gICAgICAgIG9yaWdpbmFsSW1hZ2U6IG51bGwsXHJcbiAgICAgICAgaW1nOiBudWxsLFxyXG4gICAgICAgIGRyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgICBsYXN0TW92aW5nQ29vcmQ6IG51bGwsXHJcbiAgICAgICAgaW1nRGF0YToge30sXHJcbiAgICAgICAgZGF0YVVybDogJycsXHJcbiAgICAgICAgZmlsZURyYWdnZWRPdmVyOiBmYWxzZSxcclxuICAgICAgICB0YWJTdGFydDogMCxcclxuICAgICAgICBwaW5jaGluZzogZmFsc2UsXHJcbiAgICAgICAgcGluY2hEaXN0YW5jZTogMCxcclxuICAgICAgICBzdXBwb3J0VG91Y2g6IGZhbHNlLFxyXG4gICAgICAgIHBvaW50ZXJNb3ZlZDogZmFsc2UsXHJcbiAgICAgICAgcG9pbnRlclN0YXJ0Q29vcmQ6IG51bGwsXHJcbiAgICAgICAgbmF0dXJhbFdpZHRoOiAwLFxyXG4gICAgICAgIG5hdHVyYWxIZWlnaHQ6IDAsXHJcbiAgICAgICAgc2NhbGVSYXRpbzogMSxcclxuICAgICAgICBvcmllbnRhdGlvbjogMSxcclxuICAgICAgICB1c2VyTWV0YWRhdGE6IG51bGxcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICByZWFsV2lkdGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWFsSGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQgKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlYWxQbGFjZWhvbGRlckZvbnRTaXplICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlckZvbnRTaXplICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbW91bnRlZCAoKSB7XHJcbiAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICAgIHUuckFGUG9seWZpbGwoKVxyXG4gICAgICB1LnRvQmxvYlBvbHlmaWxsKClcclxuXHJcbiAgICAgIGxldCBzdXBwb3J0cyA9IHRoaXMuc3VwcG9ydERldGVjdGlvbigpXHJcbiAgICAgIGlmICghc3VwcG9ydHMuYmFzaWMpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHZ1ZS1jcm9wcGEgZnVuY3Rpb25hbGl0eS4nKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHdhdGNoOiB7XHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IHZhbFxyXG4gICAgICB9LFxyXG4gICAgICByZWFsV2lkdGg6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnNldFNpemUoKVxyXG4gICAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByZWFsSGVpZ2h0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgdGhpcy5pbml0KClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5zZXRTaXplKClcclxuICAgICAgICAgIHRoaXMuaW1nQ29udGVudEluaXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgY2FudmFzQ29sb3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcGxhY2Vob2xkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwcmV2ZW50V2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICBpbml0ICgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJHJlZnMuY2FudmFzXHJcbiAgICAgICAgdGhpcy5zZXRTaXplKClcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJ3RyYW5zcGFyZW50JyA6ICh0eXBlb2YgdGhpcy5jYW52YXNDb2xvciA9PT0gJ3N0cmluZycgPyB0aGlzLmNhbnZhc0NvbG9yIDogJycpXHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbCgpXHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU5JVF9FVkVOVCwge1xyXG4gICAgICAgICAgZ2V0Q2FudmFzOiAoKSA9PiB0aGlzLmNhbnZhcyxcclxuICAgICAgICAgIGdldENvbnRleHQ6ICgpID0+IHRoaXMuY3R4LFxyXG4gICAgICAgICAgZ2V0Q2hvc2VuRmlsZTogKCkgPT4gdGhpcy4kcmVmcy5maWxlSW5wdXQuZmlsZXNbMF0sXHJcbiAgICAgICAgICBnZXRBY3R1YWxJbWFnZVNpemU6ICgpID0+ICh7XHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnJlYWxXaWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgbW92ZVVwd2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogLWFtb3VudCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVEb3dud2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogYW1vdW50IH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZUxlZnR3YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAtYW1vdW50LCB5OiAwIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZVJpZ2h0d2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogYW1vdW50LCB5OiAwIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgem9vbUluOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuem9vbSh0cnVlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21PdXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKGZhbHNlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHJvdGF0ZTogKHN0ZXAgPSAxKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICAgICAgc3RlcCA9IHBhcnNlSW50KHN0ZXApXHJcbiAgICAgICAgICAgIGlmIChpc05hTihzdGVwKSB8fCBzdGVwID4gMyB8fCBzdGVwIDwgLTMpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgYXJndW1lbnQgZm9yIHJvdGF0ZSgpIG1ldGhvZC4gSXQgc2hvdWxkIG9uZSBvZiB0aGUgaW50ZWdlcnMgZnJvbSAtMyB0byAzLicpXHJcbiAgICAgICAgICAgICAgc3RlcCA9IDFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJvdGF0ZUJ5U3RlcChzdGVwKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZsaXBYOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICAgICAgdGhpcy5yb3RhdGUoMilcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmbGlwWTogKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgICAgIHRoaXMucm90YXRlKDQpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVmcmVzaDogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLmluaXQpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaGFzSW1hZ2U6ICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5pbWdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICByZW1vdmU6IHRoaXMucmVtb3ZlLFxyXG4gICAgICAgICAgY2hvb3NlRmlsZTogdGhpcy5jaG9vc2VGaWxlLFxyXG4gICAgICAgICAgZ2VuZXJhdGVEYXRhVXJsOiB0aGlzLmdlbmVyYXRlRGF0YVVybCxcclxuICAgICAgICAgIGdlbmVyYXRlQmxvYjogdGhpcy5nZW5lcmF0ZUJsb2IsXHJcbiAgICAgICAgICBwcm9taXNlZEJsb2I6IHRoaXMucHJvbWlzZWRCbG9iLFxyXG4gICAgICAgICAgc3VwcG9ydERldGVjdGlvbjogdGhpcy5zdXBwb3J0RGV0ZWN0aW9uLFxyXG4gICAgICAgICAgZ2V0TWV0YWRhdGE6IHRoaXMuZ2V0TWV0YWRhdGEsXHJcbiAgICAgICAgICBhcHBseU1ldGFkYXRhOiAobWV0YWRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFtZXRhZGF0YSB8fCAhdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgICAgICB0aGlzLnVzZXJNZXRhZGF0YSA9IG1ldGFkYXRhXHJcbiAgICAgICAgICAgIHRoaXMucm90YXRlKG1ldGFkYXRhLm9yaWVudGF0aW9uIHx8IHRoaXMub3JpZW50YXRpb24sIHRydWUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNldFNpemUgKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyAncHgnXHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyAncHgnXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByb3RhdGVCeVN0ZXAgKHN0ZXApIHtcclxuICAgICAgICBsZXQgb3JpZW50YXRpb24gPSAxXHJcbiAgICAgICAgc3dpdGNoIChzdGVwKSB7XHJcbiAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gNlxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDNcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSA4XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDhcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgLTI6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gM1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAtMzpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSA2XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucm90YXRlKG9yaWVudGF0aW9uKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgc3VwcG9ydERldGVjdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICdiYXNpYyc6IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgd2luZG93LkZpbGUgJiYgd2luZG93LkZpbGVSZWFkZXIgJiYgd2luZG93LkZpbGVMaXN0ICYmIHdpbmRvdy5CbG9iLFxyXG4gICAgICAgICAgJ2RuZCc6ICdvbmRyYWdzdGFydCcgaW4gZGl2ICYmICdvbmRyb3AnIGluIGRpdlxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlbW92ZSAoKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgdGhpcy5wYWludEJhY2tncm91bmQoKVxyXG5cclxuICAgICAgICB0aGlzLnNldEltYWdlUGxhY2Vob2xkZXIoKVxyXG4gICAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJ1xyXG4gICAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJ1xyXG4gICAgICAgIGxldCBkZWZhdWx0Rm9udFNpemUgPSB0aGlzLnJlYWxXaWR0aCAqIERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcclxuICAgICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemUgfHwgdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZSA9PSAwKSA/IGRlZmF1bHRGb250U2l6ZSA6IHRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemVcclxuICAgICAgICBjdHguZm9udCA9IGZvbnRTaXplICsgJ3B4IHNhbnMtc2VyaWYnXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMucmVhbFdpZHRoIC8gMiwgdGhpcy5yZWFsSGVpZ2h0IC8gMilcclxuXHJcbiAgICAgICAgbGV0IGhhZEltYWdlID0gdGhpcy5pbWcgIT0gbnVsbFxyXG4gICAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IG51bGxcclxuICAgICAgICB0aGlzLmltZyA9IG51bGxcclxuICAgICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC52YWx1ZSA9ICcnXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhID0ge31cclxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gMVxyXG4gICAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbnVsbFxyXG5cclxuICAgICAgICBpZiAoaGFkSW1hZ2UpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLklNQUdFX1JFTU9WRV9FVkVOVClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzZXRJbWFnZVBsYWNlaG9sZGVyICgpIHtcclxuICAgICAgICBsZXQgaW1nXHJcbiAgICAgICAgaWYgKHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyICYmIHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdKSB7XHJcbiAgICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5wbGFjZWhvbGRlclswXVxyXG4gICAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXHJcbiAgICAgICAgICBpZiAodGFnID09ICdpbWcnICYmIGVsbSkge1xyXG4gICAgICAgICAgICBpbWcgPSBlbG1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaW1nKSByZXR1cm5cclxuXHJcbiAgICAgICAgdmFyIG9uTG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIHRoaXMucmVhbFdpZHRoLCB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XHJcbiAgICAgICAgICBvbkxvYWQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpbWcub25sb2FkID0gb25Mb2FkXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2V0SW5pdGlhbCAoKSB7XHJcbiAgICAgICAgbGV0IHNyYywgaW1nXHJcbiAgICAgICAgaWYgKHRoaXMuJHNsb3RzLmluaXRpYWwgJiYgdGhpcy4kc2xvdHMuaW5pdGlhbFswXSkge1xyXG4gICAgICAgICAgbGV0IHZOb2RlID0gdGhpcy4kc2xvdHMuaW5pdGlhbFswXVxyXG4gICAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXHJcbiAgICAgICAgICBpZiAodGFnID09ICdpbWcnICYmIGVsbSkge1xyXG4gICAgICAgICAgICBpbWcgPSBlbG1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbEltYWdlICYmIHR5cGVvZiB0aGlzLmluaXRpYWxJbWFnZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIHNyYyA9IHRoaXMuaW5pdGlhbEltYWdlXHJcbiAgICAgICAgICBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgICAgaWYgKCEvXmRhdGE6Ly50ZXN0KHNyYykgJiYgIS9eYmxvYjovLnRlc3Qoc3JjKSkge1xyXG4gICAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKCdjcm9zc09yaWdpbicsICdhbm9ueW1vdXMnKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaW1nLnNyYyA9IHNyY1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuaW5pdGlhbEltYWdlID09PSAnb2JqZWN0JyAmJiB0aGlzLmluaXRpYWxJbWFnZSBpbnN0YW5jZW9mIEltYWdlKSB7XHJcbiAgICAgICAgICBpbWcgPSB0aGlzLmluaXRpYWxJbWFnZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXNyYyAmJiAhaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbW92ZSgpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHUuaW1hZ2VMb2FkZWQoaW1nKSkge1xyXG4gICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSlcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpbWcub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9vbmxvYWQgKGltZywgb3JpZW50YXRpb24gPSAxKSB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gaW1nXHJcbiAgICAgICAgdGhpcy5pbWcgPSBpbWdcclxuXHJcbiAgICAgICAgdGhpcy5yb3RhdGUob3JpZW50YXRpb24pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjaG9vc2VGaWxlICgpIHtcclxuICAgICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC5jbGljaygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVDbGljayAoKSB7XHJcbiAgICAgICAgaWYgKERFQlVHKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnY2xpY2snKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuaW1nICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlICYmICF0aGlzLmRpc2FibGVkICYmICF0aGlzLnN1cHBvcnRUb3VjaCkge1xyXG4gICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICAgIGlmIChERUJVRykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndHJpZ2dlciBieSBjbGljaycpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlSW5wdXRDaGFuZ2UgKCkge1xyXG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMuZmlsZUlucHV0XHJcbiAgICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGgpIHJldHVyblxyXG5cclxuICAgICAgICBsZXQgZmlsZSA9IGlucHV0LmZpbGVzWzBdXHJcbiAgICAgICAgdGhpcy5vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgb25OZXdGaWxlSW4gKGZpbGUpIHtcclxuICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX0NIT09TRV9FVkVOVCwgZmlsZSlcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVNpemVJc1ZhbGlkKGZpbGUpKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX1NJWkVfRVhDRUVEX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaWxlIHNpemUgZXhjZWVkcyBsaW1pdCB3aGljaCBpcyAnICsgdGhpcy5maWxlU2l6ZUxpbWl0ICsgJyBieXRlcy4nKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVR5cGVJc1ZhbGlkKGZpbGUpKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgICBsZXQgdHlwZSA9IGZpbGUudHlwZSB8fCBmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5zcGxpdCgnLicpLnBvcCgpXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZpbGUgdHlwZSAoJHt0eXBlfSkgZG9lcyBub3QgbWF0Y2ggd2hhdCB5b3Ugc3BlY2lmaWVkICgke3RoaXMuYWNjZXB0fSkuYClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuRmlsZVJlYWRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGxldCBmciA9IG5ldyBGaWxlUmVhZGVyKClcclxuICAgICAgICAgIGZyLm9ubG9hZCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlRGF0YSA9IGUudGFyZ2V0LnJlc3VsdFxyXG4gICAgICAgICAgICBsZXQgb3JpZW50YXRpb24gPSB1LmdldEZpbGVPcmllbnRhdGlvbih1LmJhc2U2NFRvQXJyYXlCdWZmZXIoZmlsZURhdGEpKVxyXG4gICAgICAgICAgICBpZiAob3JpZW50YXRpb24gPCAxKSBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBmaWxlRGF0YVxyXG4gICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMuX29ubG9hZChpbWcsIG9yaWVudGF0aW9uKVxyXG4gICAgICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLk5FV19JTUFHRSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZpbGVTaXplSXNWYWxpZCAoZmlsZSkge1xyXG4gICAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVTaXplTGltaXQgfHwgdGhpcy5maWxlU2l6ZUxpbWl0ID09IDApIHJldHVybiB0cnVlXHJcblxyXG4gICAgICAgIHJldHVybiBmaWxlLnNpemUgPCB0aGlzLmZpbGVTaXplTGltaXRcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZpbGVUeXBlSXNWYWxpZCAoZmlsZSkge1xyXG4gICAgICAgIGxldCBhY2NlcHQgPSB0aGlzLmFjY2VwdCB8fCAnaW1hZ2UvKidcclxuICAgICAgICBsZXQgYmFzZU1pbWV0eXBlID0gYWNjZXB0LnJlcGxhY2UoL1xcLy4qJC8sICcnKVxyXG4gICAgICAgIGxldCB0eXBlcyA9IGFjY2VwdC5zcGxpdCgnLCcpXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICBsZXQgdHlwZSA9IHR5cGVzW2ldXHJcbiAgICAgICAgICBsZXQgdCA9IHR5cGUudHJpbSgpXHJcbiAgICAgICAgICBpZiAodC5jaGFyQXQoMCkgPT0gJy4nKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5zcGxpdCgnLicpLnBvcCgpID09PSB0LnRvTG93ZXJDYXNlKCkuc2xpY2UoMSkpIHJldHVybiB0cnVlXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKC9cXC9cXCokLy50ZXN0KHQpKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWxlQmFzZVR5cGUgPSBmaWxlLnR5cGUucmVwbGFjZSgvXFwvLiokLywgJycpXHJcbiAgICAgICAgICAgIGlmIChmaWxlQmFzZVR5cGUgPT09IGJhc2VNaW1ldHlwZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZS50eXBlID09PSB0eXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGltZ0NvbnRlbnRJbml0ICgpIHtcclxuICAgICAgICB0aGlzLm5hdHVyYWxXaWR0aCA9IHRoaXMuaW1nLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIHRoaXMubmF0dXJhbEhlaWdodCA9IHRoaXMuaW1nLm5hdHVyYWxIZWlnaHRcclxuXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIGlmICghdGhpcy5wcmV2ZW50V2hpdGVTcGFjZSAmJiB0aGlzLmluaXRpYWxTaXplID09ICdjb250YWluJykge1xyXG4gICAgICAgICAgdGhpcy5hc3BlY3RGaXQoKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMucHJldmVudFdoaXRlU3BhY2UgJiYgdGhpcy5pbml0aWFsU2l6ZSA9PSAnbmF0dXJhbCcpIHtcclxuICAgICAgICAgIHRoaXMubmF0dXJhbFNpemUoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmFzcGVjdEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSB0aGlzLmltZ0RhdGEud2lkdGggLyB0aGlzLm5hdHVyYWxXaWR0aFxyXG5cclxuICAgICAgICBpZiAoL3RvcC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgfSBlbHNlIGlmICgvYm90dG9tLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHRoaXMucmVhbEhlaWdodCAtIHRoaXMuaW1nRGF0YS5oZWlnaHRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgvbGVmdC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfSBlbHNlIGlmICgvcmlnaHQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gdGhpcy5yZWFsV2lkdGggLSB0aGlzLmltZ0RhdGEud2lkdGhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gL14oLT9cXGQrKSUgKC0/XFxkKyklJC8uZXhlYyh0aGlzLmluaXRpYWxQb3NpdGlvbilcclxuICAgICAgICAgIHZhciB4ID0gK3Jlc3VsdFsxXSAvIDEwMFxyXG4gICAgICAgICAgdmFyIHkgPSArcmVzdWx0WzJdIC8gMTAwXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0geCAqICh0aGlzLnJlYWxXaWR0aCAtIHRoaXMuaW1nRGF0YS53aWR0aClcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSB5ICogKHRoaXMucmVhbEhlaWdodCAtIHRoaXMuaW1nRGF0YS5oZWlnaHQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFwcGx5TWV0YWRhdGEoKVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhc3BlY3RGaWxsICgpIHtcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICBsZXQgaW1nUmF0aW8gPSBpbWdIZWlnaHQgLyBpbWdXaWR0aFxyXG4gICAgICAgIGxldCBjYW52YXNSYXRpbyA9IHRoaXMucmVhbEhlaWdodCAvIHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgbGV0IHNjYWxlUmF0aW9cclxuICAgICAgICBpZiAoaW1nUmF0aW8gPCBjYW52YXNSYXRpbykge1xyXG4gICAgICAgICAgc2NhbGVSYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGggLyBzY2FsZVJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aCkgLyAyXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpIC8gMlxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFzcGVjdEZpdCAoKSB7XHJcbiAgICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgICAgbGV0IGltZ1JhdGlvID0gaW1nSGVpZ2h0IC8gaW1nV2lkdGhcclxuICAgICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIGxldCBzY2FsZVJhdGlvXHJcbiAgICAgICAgaWYgKGltZ1JhdGlvIDwgY2FudmFzUmF0aW8pIHtcclxuICAgICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpIC8gMlxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHNjYWxlUmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKSAvIDJcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBuYXR1cmFsU2l6ZSAoKSB7XHJcbiAgICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5yZWFsV2lkdGgpIC8gMlxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpIC8gMlxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlclN0YXJ0IChldnQpIHtcclxuICAgICAgICBpZiAoREVCVUcpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCd0b3VjaCBzdGFydCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3VwcG9ydFRvdWNoID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcclxuICAgICAgICBsZXQgcG9pbnRlckNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gcG9pbnRlckNvb3JkXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICAvLyBzaW11bGF0ZSBjbGljayB3aXRoIHRvdWNoIG9uIG1vYmlsZSBkZXZpY2VzXHJcbiAgICAgICAgaWYgKCF0aGlzLmltZyAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgICAgdGhpcy50YWJTdGFydCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWdub3JlIG1vdXNlIHJpZ2h0IGNsaWNrIGFuZCBtaWRkbGUgY2xpY2tcclxuICAgICAgICBpZiAoZXZ0LndoaWNoICYmIGV2dC53aGljaCA+IDEpIHJldHVyblxyXG5cclxuICAgICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSB0cnVlXHJcbiAgICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNhbmNlbEV2ZW50cyA9IFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCcsICdwb2ludGVyZW5kJywgJ3BvaW50ZXJjYW5jZWwnXVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjYW5jZWxFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgIGxldCBlID0gY2FuY2VsRXZlbnRzW2ldXHJcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuaGFuZGxlUG9pbnRlckVuZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyRW5kIChldnQpIHtcclxuICAgICAgICBpZiAoREVCVUcpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCd0b3VjaCBlbmQnKVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcG9pbnRlck1vdmVEaXN0YW5jZSA9IDBcclxuICAgICAgICBpZiAodGhpcy5wb2ludGVyU3RhcnRDb29yZCkge1xyXG4gICAgICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgICBwb2ludGVyTW92ZURpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvaW50ZXJDb29yZC54IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC54LCAyKSArIE1hdGgucG93KHBvaW50ZXJDb29yZC55IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC55LCAyKSkgfHwgMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltZyAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgICAgbGV0IHRhYkVuZCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICBpZiAoKHBvaW50ZXJNb3ZlRGlzdGFuY2UgPCBDTElDS19NT1ZFX1RIUkVTSE9MRCkgJiYgdGFiRW5kIC0gdGhpcy50YWJTdGFydCA8IE1JTl9NU19QRVJfQ0xJQ0sgJiYgdGhpcy5zdXBwb3J0VG91Y2gpIHtcclxuICAgICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICAgICAgaWYgKERFQlVHKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RyaWdnZXIgYnkgdG91Y2gnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gMFxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLnBpbmNoaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSAwXHJcbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBudWxsXHJcbiAgICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBudWxsXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyTW92ZSAoZXZ0KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSB0cnVlXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdUb01vdmUgfHwgIXRoaXMuaW1nKSByZXR1cm5cclxuXHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cclxuICAgICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgICBpZiAodGhpcy5sYXN0TW92aW5nQ29vcmQpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHtcclxuICAgICAgICAgICAgICB4OiBjb29yZC54IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueCxcclxuICAgICAgICAgICAgICB5OiBjb29yZC55IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5kaXNhYmxlUGluY2hUb1pvb20pIHtcclxuICAgICAgICAgIGlmICghdGhpcy5waW5jaGluZykgcmV0dXJuXHJcbiAgICAgICAgICBsZXQgZGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgbGV0IGRlbHRhID0gZGlzdGFuY2UgLSB0aGlzLnBpbmNoRGlzdGFuY2VcclxuICAgICAgICAgIHRoaXMuem9vbShkZWx0YSA+IDAsIG51bGwsIFBJTkNIX0FDQ0VMRVJBVElPTilcclxuICAgICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IGRpc3RhbmNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlV2hlZWwgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVNjcm9sbFRvWm9vbSB8fCAhdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICBpZiAoZXZ0LndoZWVsRGVsdGEgPCAwIHx8IGV2dC5kZWx0YVkgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tLCBjb29yZClcclxuICAgICAgICB9IGVsc2UgaWYgKGV2dC53aGVlbERlbHRhID4gMCB8fCBldnQuZGVsdGFZIDwgMCB8fCBldnQuZGV0YWlsIDwgMCkge1xyXG4gICAgICAgICAgdGhpcy56b29tKCF0aGlzLnJldmVyc2VTY3JvbGxUb1pvb20sIGNvb3JkKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyYWdFbnRlciAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ0FuZERyb3AgfHwgdGhpcy5pbWcgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gdHJ1ZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ0xlYXZlIChldnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcmFnT3ZlciAoZXZ0KSB7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcm9wIChldnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcblxyXG4gICAgICAgIGxldCBmaWxlXHJcbiAgICAgICAgbGV0IGR0ID0gZXZ0LmRhdGFUcmFuc2ZlclxyXG4gICAgICAgIGlmICghZHQpIHJldHVyblxyXG4gICAgICAgIGlmIChkdC5pdGVtcykge1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0Lml0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gZHQuaXRlbXNbaV1cclxuICAgICAgICAgICAgaWYgKGl0ZW0ua2luZCA9PSAnZmlsZScpIHtcclxuICAgICAgICAgICAgICBmaWxlID0gaXRlbS5nZXRBc0ZpbGUoKVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZmlsZSA9IGR0LmZpbGVzWzBdXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgdGhpcy5vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1vdmUgKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghb2Zmc2V0KSByZXR1cm5cclxuICAgICAgICBsZXQgb2xkWCA9IHRoaXMuaW1nRGF0YS5zdGFydFhcclxuICAgICAgICBsZXQgb2xkWSA9IHRoaXMuaW1nRGF0YS5zdGFydFlcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYICs9IG9mZnNldC54XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSArPSBvZmZzZXQueVxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLnByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCAhPT0gb2xkWCB8fCB0aGlzLmltZ0RhdGEuc3RhcnRZICE9PSBvbGRZKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5NT1ZFX0VWRU5UKVxyXG4gICAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRZID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVhbFdpZHRoIC0gdGhpcy5pbWdEYXRhLnN0YXJ0WCA+IHRoaXMuaW1nRGF0YS53aWR0aCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5yZWFsV2lkdGgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlYWxIZWlnaHQgLSB0aGlzLmltZ0RhdGEuc3RhcnRZID4gdGhpcy5pbWdEYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB6b29tICh6b29tSW4sIHBvcywgaW5uZXJBY2NlbGVyYXRpb24gPSAxKSB7XHJcbiAgICAgICAgcG9zID0gcG9zIHx8IHtcclxuICAgICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxyXG4gICAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCByZWFsU3BlZWQgPSB0aGlzLnpvb21TcGVlZCAqIGlubmVyQWNjZWxlcmF0aW9uXHJcbiAgICAgICAgbGV0IHNwZWVkID0gKHRoaXMucmVhbFdpZHRoICogUENUX1BFUl9aT09NKSAqIHJlYWxTcGVlZFxyXG4gICAgICAgIGxldCB4ID0gMVxyXG4gICAgICAgIGlmICh6b29tSW4pIHtcclxuICAgICAgICAgIHggPSAxICsgc3BlZWRcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA+IE1JTl9XSURUSCkge1xyXG4gICAgICAgICAgeCA9IDEgLSBzcGVlZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG9sZFdpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoXHJcbiAgICAgICAgbGV0IG9sZEhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHRcclxuXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogeFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogeFxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMucmVhbFdpZHRoKSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMucmVhbFdpZHRoIC8gdGhpcy5pbWdEYXRhLndpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogX3hcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLmhlaWdodCA8IHRoaXMucmVhbEhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgX3ggPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLmltZ0RhdGEuaGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogX3hcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9sZFdpZHRoLnRvRml4ZWQoMikgIT09IHRoaXMuaW1nRGF0YS53aWR0aC50b0ZpeGVkKDIpIHx8IG9sZEhlaWdodC50b0ZpeGVkKDIpICE9PSB0aGlzLmltZ0RhdGEuaGVpZ2h0LnRvRml4ZWQoMikpIHtcclxuICAgICAgICAgIGxldCBvZmZzZXRYID0gKHggLSAxKSAqIChwb3MueCAtIHRoaXMuaW1nRGF0YS5zdGFydFgpXHJcbiAgICAgICAgICBsZXQgb2Zmc2V0WSA9ICh4IC0gMSkgKiAocG9zLnkgLSB0aGlzLmltZ0RhdGEuc3RhcnRZKVxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHRoaXMuaW1nRGF0YS5zdGFydFggLSBvZmZzZXRYXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WSAtIG9mZnNldFlcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgICB0aGlzLnByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuWk9PTV9FVkVOVClcclxuICAgICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSB0aGlzLmltZ0RhdGEud2lkdGggLyB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJvdGF0ZSAob3JpZW50YXRpb24gPSA2LCB1c2VPcmlnaW5hbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA+IDEpIHtcclxuICAgICAgICAgIHZhciBfaW1nID0gdS5nZXRSb3RhdGVkSW1hZ2UodXNlT3JpZ2luYWwgPyB0aGlzLm9yaWdpbmFsSW1hZ2UgOiB0aGlzLmltZywgb3JpZW50YXRpb24pXHJcbiAgICAgICAgICBfaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbWcgPSBfaW1nXHJcbiAgICAgICAgICAgIHRoaXMuaW1nQ29udGVudEluaXQoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PSAyKSB7XHJcbiAgICAgICAgICAvLyBmbGlwIHhcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBYKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA0KSB7XHJcbiAgICAgICAgICAvLyBmbGlwIHlcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBZKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA2KSB7XHJcbiAgICAgICAgICAvLyA5MCBkZWdcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSAzKSB7XHJcbiAgICAgICAgICAvLyAxODAgZGVnXHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gOCkge1xyXG4gICAgICAgICAgLy8gMjcwIGRlZ1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFpbnRCYWNrZ3JvdW5kICgpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICd0cmFuc3BhcmVudCcgOiB0aGlzLmNhbnZhc0NvbG9yXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucmVhbFdpZHRoLCB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGRyYXcgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGlmICh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fZHJhd0ZyYW1lKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl9kcmF3RnJhbWUoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9kcmF3RnJhbWUgKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmltZ0RhdGFcclxuXHJcbiAgICAgICAgdGhpcy5wYWludEJhY2tncm91bmQoKVxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkRSQVcsIGN0eClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdlbmVyYXRlRGF0YVVybCAodHlwZSwgY29tcHJlc3Npb25SYXRlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuICcnXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCh0eXBlLCBjb21wcmVzc2lvblJhdGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuIG51bGxcclxuICAgICAgICB0aGlzLmNhbnZhcy50b0Jsb2IoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcm9taXNlZEJsb2IgKC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAodHlwZW9mIFByb21pc2UgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGNvbnNvbGUud2FybignTm8gUHJvbWlzZSBzdXBwb3J0LiBQbGVhc2UgYWRkIFByb21pc2UgcG9seWZpbGwgaWYgeW91IHdhbnQgdG8gdXNlIHRoaXMgbWV0aG9kLicpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVCbG9iKChibG9iKSA9PiB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZShibG9iKVxyXG4gICAgICAgICAgICB9LCBhcmdzKVxyXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldE1ldGFkYXRhICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4ge31cclxuICAgICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSB9ID0gdGhpcy5pbWdEYXRhXHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBzdGFydFgsXHJcbiAgICAgICAgICBzdGFydFksXHJcbiAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZVJhdGlvLFxyXG4gICAgICAgICAgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb25cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhcHBseU1ldGFkYXRhICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMudXNlck1ldGFkYXRhKSByZXR1cm5cclxuICAgICAgICB2YXIgeyBzdGFydFgsIHN0YXJ0WSwgc2NhbGUgfSA9IHRoaXMudXNlck1ldGFkYXRhXHJcbiAgICAgICAgc3RhcnRYID0gK3N0YXJ0WFxyXG4gICAgICAgIHN0YXJ0WSA9ICtzdGFydFlcclxuICAgICAgICBzY2FsZSA9ICtzY2FsZVxyXG5cclxuICAgICAgICBpZiAoIWlzTmFOKHN0YXJ0WCkpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSBzdGFydFhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaXNOYU4oc3RhcnRZKSkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHN0YXJ0WVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpc05hTihzY2FsZSkpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoICogc2NhbGVcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgKiBzY2FsZVxyXG4gICAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gc2NhbGVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzdHlsdXNcIj5cclxuICAuY3JvcHBhLWNvbnRhaW5lciBcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9ja1xyXG4gICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjNzXHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmVcclxuICAgIGZvbnQtc2l6ZTogMFxyXG4gICAgYWxpZ24tc2VsZjogZmxleC1zdGFydFxyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2U2ZTZlNlxyXG4gICAgY2FudmFzXHJcbiAgICAgIHRyYW5zaXRpb246IGFsbCAuM3NcclxuICAgICY6aG92ZXJcclxuICAgICAgb3BhY2l0eTogLjdcclxuICAgICYuY3JvcHBhLS1kcm9wem9uZVxyXG4gICAgICBib3gtc2hhZG93OiBpbnNldCAwIDAgMTBweCBsaWdodG5lc3MoYmxhY2ssIDIwJSlcclxuICAgICAgY2FudmFzXHJcbiAgICAgICAgb3BhY2l0eTogLjVcclxuICAgICYuY3JvcHBhLS1kaXNhYmxlZC1jYyBcclxuICAgICAgY3Vyc29yOiBkZWZhdWx0XHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAmLmNyb3BwYS0taGFzLXRhcmdldFxyXG4gICAgICBjdXJzb3I6IG1vdmVcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgICAgJi5jcm9wcGEtLWRpc2FibGVkLW16XHJcbiAgICAgICAgY3Vyc29yOiBkZWZhdWx0XHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWRcclxuICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZFxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgc3ZnLmljb24tcmVtb3ZlXHJcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZVxyXG4gICAgICBiYWNrZ3JvdW5kOiB3aGl0ZVxyXG4gICAgICBib3JkZXItcmFkaXVzOiA1MCVcclxuICAgICAgZmlsdGVyOiBkcm9wLXNoYWRvdygtMnB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjcpKVxyXG4gICAgICB6LWluZGV4OiAxMFxyXG4gICAgICBjdXJzb3I6IHBvaW50ZXJcclxuICAgICAgYm9yZGVyOiAycHggc29saWQgd2hpdGVcclxuXHJcbjwvc3R5bGU+XHJcbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJpbXBvcnQgY29tcG9uZW50IGZyb20gJy4vY3JvcHBlci52dWUnXHJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbidcclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gIGNvbXBvbmVudE5hbWU6ICdjcm9wcGEnXHJcbn1cclxuXHJcbmNvbnN0IFZ1ZUNyb3BwYSA9IHtcclxuICBpbnN0YWxsOiBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcclxuICAgIGxldCB2ZXJzaW9uID0gTnVtYmVyKFZ1ZS52ZXJzaW9uLnNwbGl0KCcuJylbMF0pXHJcbiAgICBpZiAodmVyc2lvbiA8IDIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB2dWUtY3JvcHBhIHN1cHBvcnRzIHZ1ZSB2ZXJzaW9uIDIuMCBhbmQgYWJvdmUuIFlvdSBhcmUgdXNpbmcgVnVlQCR7dmVyc2lvbn0uIFBsZWFzZSB1cGdyYWRlIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBWdWUuYClcclxuICAgIH1cclxuICAgIGxldCBjb21wb25lbnROYW1lID0gb3B0aW9ucy5jb21wb25lbnROYW1lIHx8ICdjcm9wcGEnXHJcblxyXG4gICAgLy8gcmVnaXN0cmF0aW9uXHJcbiAgICBWdWUuY29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudClcclxuICB9LFxyXG5cclxuICBjb21wb25lbnRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsiZGVmaW5lIiwidGhpcyIsInBvaW50Iiwidm0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsImV2dCIsInBvaW50ZXIiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJvbmVQb2ludENvb3JkIiwicG9pbnRlcjEiLCJwb2ludGVyMiIsImNvb3JkMSIsImNvb3JkMiIsIk1hdGgiLCJzcXJ0IiwicG93IiwieCIsInkiLCJpbWciLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsImRvY3VtZW50Iiwid2luZG93IiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwibGVuZ3RoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsImN1cnJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJ0aW1lVG9DYWxsIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiYXJnIiwiaXNBcnJheSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIkhUTUxDYW52YXNFbGVtZW50IiwiYmluU3RyIiwibGVuIiwiYXJyIiwidG9CbG9iIiwiZGVmaW5lUHJvcGVydHkiLCJ0eXBlIiwiYXRvYiIsInRvRGF0YVVSTCIsInNwbGl0IiwiVWludDhBcnJheSIsImkiLCJjaGFyQ29kZUF0IiwiQmxvYiIsImR0IiwiZGF0YVRyYW5zZmVyIiwib3JpZ2luYWxFdmVudCIsInR5cGVzIiwiYXJyYXlCdWZmZXIiLCJ2aWV3IiwiRGF0YVZpZXciLCJnZXRVaW50MTYiLCJieXRlTGVuZ3RoIiwib2Zmc2V0IiwibWFya2VyIiwiZ2V0VWludDMyIiwibGl0dGxlIiwidGFncyIsImJhc2U2NCIsInJlcGxhY2UiLCJiaW5hcnlTdHJpbmciLCJieXRlcyIsImJ1ZmZlciIsIm9yaWVudGF0aW9uIiwiX2NhbnZhcyIsIkNhbnZhc0V4aWZPcmllbnRhdGlvbiIsImRyYXdJbWFnZSIsIl9pbWciLCJJbWFnZSIsInNyYyIsIm9yaSIsIm1hcCIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJmbG9vciIsInZhbCIsIlN0cmluZyIsIkJvb2xlYW4iLCJIVE1MSW1hZ2VFbGVtZW50IiwidmFsaWRzIiwiaW5kZXhPZiIsInRlc3QiLCJQQ1RfUEVSX1pPT00iLCJNSU5fTVNfUEVSX0NMSUNLIiwiQ0xJQ0tfTU9WRV9USFJFU0hPTEQiLCJNSU5fV0lEVEgiLCJERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCIsIlBJTkNIX0FDQ0VMRVJBVElPTiIsIkRFQlVHIiwicmVuZGVyIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsInBsYWNlaG9sZGVyRm9udFNpemUiLCJpbml0IiwickFGUG9seWZpbGwiLCJ0b0Jsb2JQb2x5ZmlsbCIsInN1cHBvcnRzIiwic3VwcG9ydERldGVjdGlvbiIsImJhc2ljIiwid2FybiIsImluc3RhbmNlIiwic2V0U2l6ZSIsImltZ0NvbnRlbnRJbml0IiwiZHJhdyIsIiRyZWZzIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjYW52YXNDb2xvciIsImN0eCIsImdldENvbnRleHQiLCJvcmlnaW5hbEltYWdlIiwic2V0SW5pdGlhbCIsIiRlbWl0IiwiZXZlbnRzIiwiSU5JVF9FVkVOVCIsImZpbGVJbnB1dCIsImZpbGVzIiwicmVhbFdpZHRoIiwicmVhbEhlaWdodCIsImFtb3VudCIsIm1vdmUiLCJ6b29tIiwic3RlcCIsImRpc2FibGVSb3RhdGlvbiIsImRpc2FibGVkIiwicGFyc2VJbnQiLCJpc05hTiIsInJvdGF0ZUJ5U3RlcCIsInJvdGF0ZSIsIiRuZXh0VGljayIsInJlbW92ZSIsImNob29zZUZpbGUiLCJnZW5lcmF0ZURhdGFVcmwiLCJnZW5lcmF0ZUJsb2IiLCJwcm9taXNlZEJsb2IiLCJnZXRNZXRhZGF0YSIsIm1ldGFkYXRhIiwidXNlck1ldGFkYXRhIiwiZGl2IiwiY3JlYXRlRWxlbWVudCIsIkZpbGUiLCJGaWxlUmVhZGVyIiwiRmlsZUxpc3QiLCJwYWludEJhY2tncm91bmQiLCJzZXRJbWFnZVBsYWNlaG9sZGVyIiwidGV4dEJhc2VsaW5lIiwidGV4dEFsaWduIiwiZGVmYXVsdEZvbnRTaXplIiwicGxhY2Vob2xkZXIiLCJmb250U2l6ZSIsInJlYWxQbGFjZWhvbGRlckZvbnRTaXplIiwiZm9udCIsImZpbGxTdHlsZSIsInBsYWNlaG9sZGVyQ29sb3IiLCJmaWxsVGV4dCIsImhhZEltYWdlIiwiaW1nRGF0YSIsIklNQUdFX1JFTU9WRV9FVkVOVCIsIiRzbG90cyIsInZOb2RlIiwidGFnIiwiZWxtIiwib25Mb2FkIiwidSIsImltYWdlTG9hZGVkIiwib25sb2FkIiwiaW5pdGlhbCIsImluaXRpYWxJbWFnZSIsInNldEF0dHJpYnV0ZSIsImJhYmVsSGVscGVycy50eXBlb2YiLCJfb25sb2FkIiwiZGF0YXNldCIsIm9uZXJyb3IiLCJjbGljayIsImxvZyIsImRpc2FibGVDbGlja1RvQ2hvb3NlIiwic3VwcG9ydFRvdWNoIiwiaW5wdXQiLCJmaWxlIiwib25OZXdGaWxlSW4iLCJGSUxFX0NIT09TRV9FVkVOVCIsImZpbGVTaXplSXNWYWxpZCIsIkZJTEVfU0laRV9FWENFRURfRVZFTlQiLCJFcnJvciIsImZpbGVTaXplTGltaXQiLCJmaWxlVHlwZUlzVmFsaWQiLCJGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQiLCJuYW1lIiwidG9Mb3dlckNhc2UiLCJwb3AiLCJhY2NlcHQiLCJmciIsImUiLCJmaWxlRGF0YSIsInRhcmdldCIsInJlc3VsdCIsImdldEZpbGVPcmllbnRhdGlvbiIsImJhc2U2NFRvQXJyYXlCdWZmZXIiLCJORVdfSU1BR0UiLCJyZWFkQXNEYXRhVVJMIiwic2l6ZSIsImJhc2VNaW1ldHlwZSIsInQiLCJ0cmltIiwiY2hhckF0Iiwic2xpY2UiLCJmaWxlQmFzZVR5cGUiLCJuYXR1cmFsSGVpZ2h0Iiwic3RhcnRYIiwic3RhcnRZIiwicHJldmVudFdoaXRlU3BhY2UiLCJpbml0aWFsU2l6ZSIsImFzcGVjdEZpdCIsIm5hdHVyYWxTaXplIiwiYXNwZWN0RmlsbCIsInNjYWxlUmF0aW8iLCJpbml0aWFsUG9zaXRpb24iLCJleGVjIiwiYXBwbHlNZXRhZGF0YSIsInByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsImltZ1JhdGlvIiwiY2FudmFzUmF0aW8iLCJwb2ludGVyTW92ZWQiLCJwb2ludGVyQ29vcmQiLCJnZXRQb2ludGVyQ29vcmRzIiwicG9pbnRlclN0YXJ0Q29vcmQiLCJ0YWJTdGFydCIsInZhbHVlT2YiLCJ3aGljaCIsImRyYWdnaW5nIiwicGluY2hpbmciLCJjb29yZCIsImxhc3RNb3ZpbmdDb29yZCIsImRpc2FibGVQaW5jaFRvWm9vbSIsInBpbmNoRGlzdGFuY2UiLCJnZXRQaW5jaERpc3RhbmNlIiwiY2FuY2VsRXZlbnRzIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZVBvaW50ZXJFbmQiLCJwb2ludGVyTW92ZURpc3RhbmNlIiwidGFiRW5kIiwiZGlzYWJsZURyYWdUb01vdmUiLCJwcmV2ZW50RGVmYXVsdCIsImRpc3RhbmNlIiwiZGVsdGEiLCJkaXNhYmxlU2Nyb2xsVG9ab29tIiwid2hlZWxEZWx0YSIsImRlbHRhWSIsImRldGFpbCIsInJldmVyc2VTY3JvbGxUb1pvb20iLCJkaXNhYmxlRHJhZ0FuZERyb3AiLCJldmVudEhhc0ZpbGUiLCJmaWxlRHJhZ2dlZE92ZXIiLCJpdGVtcyIsIml0ZW0iLCJraW5kIiwiZ2V0QXNGaWxlIiwib2xkWCIsIm9sZFkiLCJNT1ZFX0VWRU5UIiwiem9vbUluIiwicG9zIiwiaW5uZXJBY2NlbGVyYXRpb24iLCJyZWFsU3BlZWQiLCJ6b29tU3BlZWQiLCJzcGVlZCIsIm9sZFdpZHRoIiwib2xkSGVpZ2h0IiwiX3giLCJ0b0ZpeGVkIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJaT09NX0VWRU5UIiwidXNlT3JpZ2luYWwiLCJnZXRSb3RhdGVkSW1hZ2UiLCJmbGlwWCIsImZsaXBZIiwicm90YXRlOTAiLCJjbGVhclJlY3QiLCJmaWxsUmVjdCIsIl9kcmF3RnJhbWUiLCJEUkFXIiwiY29tcHJlc3Npb25SYXRlIiwibWltZVR5cGUiLCJxdWFsaXR5QXJndW1lbnQiLCJhcmdzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJibG9iIiwiZXJyIiwic2NhbGUiLCJkZWZhdWx0T3B0aW9ucyIsIlZ1ZUNyb3BwYSIsIlZ1ZSIsIm9wdGlvbnMiLCJhc3NpZ24iLCJ2ZXJzaW9uIiwiY29tcG9uZW50TmFtZSIsImNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLENBQUMsVUFBVSxJQUFJLEVBQUUsT0FBTyxFQUFFO0lBQ3RCLElBQUksT0FBT0EsU0FBTSxLQUFLLFVBQVUsSUFBSUEsU0FBTSxDQUFDLEdBQUcsRUFBRTtRQUM1Q0EsU0FBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN2QixNQUFNLEFBQWlDO1FBQ3BDLGNBQWMsR0FBRyxPQUFPLEVBQUUsQ0FBQztLQUM5QixBQUVGO0NBQ0YsQ0FBQ0MsY0FBSSxFQUFFLFlBQVk7RUFDbEIsWUFBWSxDQUFDOztFQUViLFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0lBQ3hELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE1BQU0sSUFB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
