/*
 * vue-croppa v0.0.25
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
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function value(callback, type, quality) {
          var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
              len = binStr.length,
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
    default: 'image/*'
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
  }
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
      if (this.$slots.initial && this.$slots.initial[0]) {
        this.setInitial();
      } else {
        this.remove();
      }
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

      var vNode = this.$slots.initial[0];
      var tag = vNode.tag,
          elm = vNode.elm;

      if (tag !== 'img' || !elm || !elm.src) {
        this.remove();
        return;
      }
      if (u.imageLoaded(elm)) {
        this.img = elm;
        this.imgContentInit();
      } else {
        elm.onload = function () {
          _this2.img = elm;
          _this2.imgContentInit();
        };

        elm.onerror = function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xyXG4gIG9uZVBvaW50Q29vcmQocG9pbnQsIHZtKSB7XHJcbiAgICBsZXQgeyBjYW52YXMsIHF1YWxpdHkgfSA9IHZtXHJcbiAgICBsZXQgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgbGV0IGNsaWVudFggPSBwb2ludC5jbGllbnRYXHJcbiAgICBsZXQgY2xpZW50WSA9IHBvaW50LmNsaWVudFlcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjbGllbnRYIC0gcmVjdC5sZWZ0KSAqIHF1YWxpdHksXHJcbiAgICAgIHk6IChjbGllbnRZIC0gcmVjdC50b3ApICogcXVhbGl0eVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGdldFBvaW50ZXJDb29yZHMoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coY29vcmQxLnggLSBjb29yZDIueCwgMikgKyBNYXRoLnBvdyhjb29yZDEueSAtIGNvb3JkMi55LCAyKSlcclxuICB9LFxyXG5cclxuICBnZXRQaW5jaENlbnRlckNvb3JkKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiAoY29vcmQxLnggKyBjb29yZDIueCkgLyAyLFxyXG4gICAgICB5OiAoY29vcmQxLnkgKyBjb29yZDIueSkgLyAyXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgaW1hZ2VMb2FkZWQoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCgpIHtcclxuICAgIC8vIHJBRiBwb2x5ZmlsbFxyXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygd2luZG93ID09ICd1bmRlZmluZWQnKSByZXR1cm5cclxuICAgIHZhciBsYXN0VGltZSA9IDBcclxuICAgIHZhciB2ZW5kb3JzID0gWyd3ZWJraXQnLCAnbW96J11cclxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCAgICAvLyBXZWJraXTkuK3mraTlj5bmtojmlrnms5XnmoTlkI3lrZflj5jkuoZcclxuICAgICAgICB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2LjcgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpXHJcbiAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGFyZyA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbFxyXG4gICAgICAgICAgY2FsbGJhY2soYXJnKVxyXG4gICAgICAgIH0sIHRpbWVUb0NhbGwpXHJcbiAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICByZXR1cm4gaWRcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KGlkKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQXJyYXkuaXNBcnJheSA9IGZ1bmN0aW9uIChhcmcpIHtcclxuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpID09PSAnW29iamVjdCBBcnJheV0nXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgdG9CbG9iUG9seWZpbGwoKSB7XHJcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB3aW5kb3cgPT0gJ3VuZGVmaW5lZCcgfHwgIUhUTUxDYW52YXNFbGVtZW50KSByZXR1cm5cclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIHZhciBiaW5TdHIgPSBhdG9iKHRoaXMudG9EYXRhVVJMKHR5cGUsIHF1YWxpdHkpLnNwbGl0KCcsJylbMV0pLFxyXG4gICAgICAgICAgICBsZW4gPSBiaW5TdHIubGVuZ3RoLFxyXG4gICAgICAgICAgICBhcnIgPSBuZXcgVWludDhBcnJheShsZW4pXHJcblxyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBhcnJbaV0gPSBiaW5TdHIuY2hhckNvZGVBdChpKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNhbGxiYWNrKG5ldyBCbG9iKFthcnJdLCB7IHR5cGU6IHR5cGUgfHwgJ2ltYWdlL3BuZycgfSkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSIsIk51bWJlci5pc0ludGVnZXIgPSBOdW1iZXIuaXNJbnRlZ2VyIHx8IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWVcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjZTZlNmU2J1xyXG4gIH0sXHJcbiAgcXVhbGl0eToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWwpICYmIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnaW1hZ2UvKidcclxuICB9LFxyXG4gIGZpbGVTaXplTGltaXQ6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+PSAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBkaXNhYmxlZDogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ0FuZERyb3A6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZUNsaWNrVG9DaG9vc2U6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZURyYWdUb01vdmU6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUGluY2hUb1pvb206IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVpvb21pbmdHZXN0dXJlOiBCb29sZWFuLCAvLyBkZXByZWNhdGVkXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCB7XG4gIElOSVRfRVZFTlQ6ICdpbml0JyxcbiAgRklMRV9DSE9PU0VfRVZFTlQ6ICdmaWxlLWNob29zZScsXG4gIEZJTEVfU0laRV9FWENFRURfRVZFTlQ6ICdmaWxlLXNpemUtZXhjZWVkJyxcbiAgRklMRV9UWVBFX01JU01BVENIX0VWRU5UOiAnZmlsZS10eXBlLW1pc21hdGNoJyxcbiAgSU1BR0VfUkVNT1ZFX0VWRU5UOiAnaW1hZ2UtcmVtb3ZlJyxcbiAgTU9WRV9FVkVOVDogJ21vdmUnLFxuICBaT09NX0VWRU5UOiAnem9vbSdcbn0iLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiA6Y2xhc3M9XCJgY3JvcHBhLWNvbnRhaW5lciAke2ltZyA/ICdjcm9wcGEtLWhhcy10YXJnZXQnIDogJyd9ICR7ZGlzYWJsZWQgPyAnY3JvcHBhLS1kaXNhYmxlZCcgOiAnJ30gJHtkaXNhYmxlQ2xpY2tUb0Nob29zZSA/ICdjcm9wcGEtLWRpc2FibGVkLWNjJyA6ICcnfSAke2Rpc2FibGVEcmFnVG9Nb3ZlICYmIGRpc2FibGVTY3JvbGxUb1pvb20gPyAnY3JvcHBhLS1kaXNhYmxlZC1teicgOiAnJ30gJHtmaWxlRHJhZ2dlZE92ZXIgPyAnY3JvcHBhLS1kcm9wem9uZScgOiAnJ31gXCJcclxuICAgICAgIEBkcmFnZW50ZXIuc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJhZ0VudGVyXCJcclxuICAgICAgIEBkcmFnbGVhdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJhZ0xlYXZlXCJcclxuICAgICAgIEBkcmFnb3Zlci5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcmFnT3ZlclwiXHJcbiAgICAgICBAZHJvcC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcm9wXCI+XHJcbiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIlxyXG4gICAgICAgICAgIDphY2NlcHQ9XCJhY2NlcHRcIlxyXG4gICAgICAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcclxuICAgICAgICAgICByZWY9XCJmaWxlSW5wdXRcIlxyXG4gICAgICAgICAgIGhpZGRlblxyXG4gICAgICAgICAgIEBjaGFuZ2U9XCJoYW5kbGVJbnB1dENoYW5nZVwiIC8+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaW5pdGlhbFwiXHJcbiAgICAgICAgIHN0eWxlPVwid2lkdGg6IDA7IGhlaWdodDogMDsgdmlzaWJpbGl0eTogaGlkZGVuO1wiPlxyXG4gICAgICA8c2xvdCBuYW1lPVwiaW5pdGlhbFwiPjwvc2xvdD5cclxuICAgIDwvZGl2PlxyXG4gICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIlxyXG4gICAgICAgICAgICBAY2xpY2suc3RvcC5wcmV2ZW50PVwiaGFuZGxlQ2xpY2tcIlxyXG4gICAgICAgICAgICBAdG91Y2hzdGFydC5zdG9wPVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQG1vdXNlZG93bi5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcnN0YXJ0LnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEB0b3VjaGVuZC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNoY2FuY2VsLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAbW91c2V1cC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJlbmQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyY2FuY2VsLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAdG91Y2htb3ZlLnN0b3A9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBtb3VzZW1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBARE9NTW91c2VTY3JvbGwuc3RvcD1cImhhbmRsZVdoZWVsXCJcclxuICAgICAgICAgICAgQHdoZWVsLnN0b3A9XCJoYW5kbGVXaGVlbFwiXHJcbiAgICAgICAgICAgIEBtb3VzZXdoZWVsLnN0b3A9XCJoYW5kbGVXaGVlbFwiPjwvY2FudmFzPlxyXG4gICAgPHN2ZyBjbGFzcz1cImljb24gaWNvbi1yZW1vdmVcIlxyXG4gICAgICAgICB2LWlmPVwic2hvd1JlbW92ZUJ1dHRvbiAmJiBpbWdcIlxyXG4gICAgICAgICBAY2xpY2s9XCJyZW1vdmVcIlxyXG4gICAgICAgICA6c3R5bGU9XCJgdG9wOiAtJHtoZWlnaHQvNDB9cHg7IHJpZ2h0OiAtJHt3aWR0aC80MH1weGBcIlxyXG4gICAgICAgICB2aWV3Qm94PVwiMCAwIDEwMjQgMTAyNFwiXHJcbiAgICAgICAgIHZlcnNpb249XCIxLjFcIlxyXG4gICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICAgICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcclxuICAgICAgICAgOndpZHRoPVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aC8xMFwiXHJcbiAgICAgICAgIDpoZWlnaHQ9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCI+XHJcbiAgICAgIDxwYXRoIGQ9XCJNNTExLjkyMTIzMSAwQzIyOS4xNzkwNzcgMCAwIDIyOS4yNTc4NDYgMCA1MTIgMCA3OTQuNzAyNzY5IDIyOS4xNzkwNzcgMTAyNCA1MTEuOTIxMjMxIDEwMjQgNzk0Ljc4MTUzOCAxMDI0IDEwMjQgNzk0LjcwMjc2OSAxMDI0IDUxMiAxMDI0IDIyOS4yNTc4NDYgNzk0Ljc4MTUzOCAwIDUxMS45MjEyMzEgMFpNNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDY1MC41MTU2OTIgNzMyLjA4MTIzMUM2NTAuNTE1NjkyIDczMi4wODEyMzEgNTIxLjQ5MTY5MiA1OTMuNjgzNjkyIDUxMS44ODE4NDYgNTkzLjY4MzY5MiA1MDIuNDI5NTM4IDU5My42ODM2OTIgMzczLjM2NjE1NCA3MzIuMDgxMjMxIDM3My4zNjYxNTQgNzMyLjA4MTIzMUwyOTEuNzYxMjMxIDY1MC42MzM4NDZDMjkxLjc2MTIzMSA2NTAuNjMzODQ2IDQzMC4zMTYzMDggNTIzLjUwMDMwOCA0MzAuMzE2MzA4IDUxMi4xOTY5MjMgNDMwLjMxNjMwOCA1MDAuNjk2NjE1IDI5MS43NjEyMzEgMzczLjUyMzY5MiAyOTEuNzYxMjMxIDM3My41MjM2OTJMMzczLjM2NjE1NCAyOTEuOTE4NzY5QzM3My4zNjYxNTQgMjkxLjkxODc2OSA1MDMuNDUzNTM4IDQzMC4zOTUwNzcgNTExLjg4MTg0NiA0MzAuMzk1MDc3IDUyMC4zNDk1MzggNDMwLjM5NTA3NyA2NTAuNTE1NjkyIDI5MS45MTg3NjkgNjUwLjUxNTY5MiAyOTEuOTE4NzY5TDczMi4wNDE4NDYgMzczLjUyMzY5MkM3MzIuMDQxODQ2IDM3My41MjM2OTIgNTkzLjQ0NzM4NSA1MDIuNTQ3NjkyIDU5My40NDczODUgNTEyLjE5NjkyMyA1OTMuNDQ3Mzg1IDUyMS40MTI5MjMgNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDczMi4wNDE4NDYgNjUwLjYzMzg0NlpcIlxyXG4gICAgICAgICAgICA6ZmlsbD1cInJlbW92ZUJ1dHRvbkNvbG9yXCI+PC9wYXRoPlxyXG4gICAgPC9zdmc+XHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c2NyaXB0PlxyXG4gIGltcG9ydCB1IGZyb20gJy4vdXRpbCdcclxuICBpbXBvcnQgcHJvcHMgZnJvbSAnLi9wcm9wcydcclxuICBpbXBvcnQgZXZlbnRzIGZyb20gJy4vZXZlbnRzJ1xyXG5cclxuICBjb25zdCBQQ1RfUEVSX1pPT00gPSAxIC8gMTAwMDAwIC8vIFRoZSBhbW91bnQgb2Ygem9vbWluZyBldmVyeXRpbWUgaXQgaGFwcGVucywgaW4gcGVyY2VudGFnZSBvZiBpbWFnZSB3aWR0aC5cclxuICBjb25zdCBNSU5fTVNfUEVSX0NMSUNLID0gNTAwIC8vIElmIHRvdWNoIGR1cmF0aW9uIGlzIHNob3J0ZXIgdGhhbiB0aGUgdmFsdWUsIHRoZW4gaXQgaXMgY29uc2lkZXJlZCBhcyBhIGNsaWNrLlxyXG4gIGNvbnN0IENMSUNLX01PVkVfVEhSRVNIT0xEID0gMTAwIC8vIElmIHRvdWNoIG1vdmUgZGlzdGFuY2UgaXMgZ3JlYXRlciB0aGFuIHRoaXMgdmFsdWUsIHRoZW4gaXQgd2lsbCBieSBubyBtZWFuIGJlIGNvbnNpZGVyZWQgYXMgYSBjbGljay5cclxuICBjb25zdCBNSU5fV0lEVEggPSAxMCAvLyBUaGUgbWluaW1hbCB3aWR0aCB0aGUgdXNlciBjYW4gem9vbSB0by5cclxuICBjb25zdCBERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCA9IDIgLyAzIC8vIFBsYWNlaG9sZGVyIHRleHQgYnkgZGVmYXVsdCB0YWtlcyB1cCB0aGlzIGFtb3VudCBvZiB0aW1lcyBvZiBjYW52YXMgd2lkdGguXHJcbiAgY29uc3QgUElOQ0hfQUNDRUxFUkFUSU9OID0gMiAvLyBUaGUgYW1vdW50IG9mIHRpbWVzIGJ5IHdoaWNoIHRoZSBwaW5jaGluZyBpcyBtb3JlIHNlbnNpdGl2ZSB0aGFuIHRoZSBzY29sbGluZ1xyXG4gIGNvbnN0IERFQlVHID0gZmFsc2VcclxuXHJcbiAgZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgbW9kZWw6IHtcclxuICAgICAgcHJvcDogJ3ZhbHVlJyxcclxuICAgICAgZXZlbnQ6ICdpbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBwcm9wczogcHJvcHMsXHJcblxyXG4gICAgZGF0YSAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXHJcbiAgICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICAgIGN0eDogbnVsbCxcclxuICAgICAgICBpbWc6IG51bGwsXHJcbiAgICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICAgIGxhc3RNb3ZpbmdDb29yZDogbnVsbCxcclxuICAgICAgICBpbWdEYXRhOiB7fSxcclxuICAgICAgICBkYXRhVXJsOiAnJyxcclxuICAgICAgICBmaWxlRHJhZ2dlZE92ZXI6IGZhbHNlLFxyXG4gICAgICAgIHRhYlN0YXJ0OiAwLFxyXG4gICAgICAgIHBpbmNoaW5nOiBmYWxzZSxcclxuICAgICAgICBwaW5jaERpc3RhbmNlOiAwLFxyXG4gICAgICAgIHN1cHBvcnRUb3VjaDogZmFsc2UsXHJcbiAgICAgICAgcG9pbnRlck1vdmVkOiBmYWxzZSxcclxuICAgICAgICBwb2ludGVyU3RhcnRDb29yZDogbnVsbFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgIHJlYWxXaWR0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlYWxIZWlnaHQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVhbFBsYWNlaG9sZGVyRm9udFNpemUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyRm9udFNpemUgKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtb3VudGVkICgpIHtcclxuICAgICAgdGhpcy5pbml0KClcclxuICAgICAgdS5yQUZQb2x5ZmlsbCgpXHJcbiAgICAgIHUudG9CbG9iUG9seWZpbGwoKVxyXG5cclxuICAgICAgaWYgKHRoaXMuJG9wdGlvbnMuX3BhcmVudExpc3RlbmVyc1snaW5pdGlhbC1pbWFnZS1sb2FkJ10gfHwgdGhpcy4kb3B0aW9ucy5fcGFyZW50TGlzdGVuZXJzWydpbml0aWFsLWltYWdlLWVycm9yJ10pIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ2luaXRpYWwtaW1hZ2UtbG9hZCBhbmQgaW5pdGlhbC1pbWFnZS1lcnJvciBldmVudHMgYXJlIGFscmVhZHkgZGVwcmVjYXRlZC4gUGxlYXNlIGJpbmQgdGhlbSBkaXJlY3RseSBvbiB0aGUgPGltZz4gdGFnICh0aGUgc2xvdCkuJylcclxuICAgICAgfVxyXG4gICAgICBsZXQgc3VwcG9ydHMgPSB0aGlzLnN1cHBvcnREZXRlY3Rpb24oKVxyXG4gICAgICBpZiAoIXN1cHBvcnRzLmJhc2ljKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB2dWUtY3JvcHBhIGZ1bmN0aW9uYWxpdHkuJylcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSB2YWxcclxuICAgICAgfSxcclxuICAgICAgcmVhbFdpZHRoOiAnaW5pdCcsXHJcbiAgICAgIHJlYWxIZWlnaHQ6ICdpbml0JyxcclxuICAgICAgY2FudmFzQ29sb3I6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXI6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogJ2luaXQnLFxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZTogJ2luaXQnLFxyXG4gICAgICBwcmV2ZW50V2hpdGVTcGFjZTogJ2ltZ0NvbnRlbnRJbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgIGluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kcmVmcy5jYW52YXNcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAnI2U2ZTZlNicgOiAodHlwZW9mIHRoaXMuY2FudmFzQ29sb3IgPT09ICdzdHJpbmcnID8gdGhpcy5jYW52YXNDb2xvciA6ICcnKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIGlmICh0aGlzLiRzbG90cy5pbml0aWFsICYmIHRoaXMuJHNsb3RzLmluaXRpYWxbMF0pIHtcclxuICAgICAgICAgIHRoaXMuc2V0SW5pdGlhbCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucmVtb3ZlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU5JVF9FVkVOVCwge1xyXG4gICAgICAgICAgZ2V0Q2FudmFzOiAoKSA9PiB0aGlzLmNhbnZhcyxcclxuICAgICAgICAgIGdldENvbnRleHQ6ICgpID0+IHRoaXMuY3R4LFxyXG4gICAgICAgICAgZ2V0Q2hvc2VuRmlsZTogKCkgPT4gdGhpcy4kcmVmcy5maWxlSW5wdXQuZmlsZXNbMF0sXHJcbiAgICAgICAgICBnZXRBY3R1YWxJbWFnZVNpemU6ICgpID0+ICh7XHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnJlYWxXaWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgbW92ZVVwd2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogLWFtb3VudCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVEb3dud2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogYW1vdW50IH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZUxlZnR3YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAtYW1vdW50LCB5OiAwIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZVJpZ2h0d2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogYW1vdW50LCB5OiAwIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgem9vbUluOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuem9vbSh0cnVlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21PdXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKGZhbHNlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHJlZnJlc2g6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5pbml0KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGhhc0ltYWdlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhIXRoaXMuaW1nXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVzZXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdcInJlc2V0KClcIiBtZXRob2Qgd2lsbCBiZSBkZXByZWNhdGVkIGluIHRoZSBuZWFyIGZ1dHVyZSBkdWUgdG8gbWlzbmFtaW5nLiBQbGVhc2UgdXNlIFwicmVtb3ZlKClcIiBpbnN0ZWFkLiBUaGV5IGhhdmUgdGhlIHNhbWUgZWZmZWN0LicpXHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKClcclxuICAgICAgICAgIH0sIC8vIHNvb24gdG8gYmUgZGVwcmVjYXRlZCBkdWUgdG8gbWlzbmFtZWRcclxuICAgICAgICAgIHJlbW92ZTogdGhpcy5yZW1vdmUsXHJcbiAgICAgICAgICBjaG9vc2VGaWxlOiB0aGlzLmNob29zZUZpbGUsXHJcbiAgICAgICAgICBnZW5lcmF0ZURhdGFVcmw6IHRoaXMuZ2VuZXJhdGVEYXRhVXJsLFxyXG4gICAgICAgICAgZ2VuZXJhdGVCbG9iOiB0aGlzLmdlbmVyYXRlQmxvYixcclxuICAgICAgICAgIHByb21pc2VkQmxvYjogdGhpcy5wcm9taXNlZEJsb2IsXHJcbiAgICAgICAgICBzdXBwb3J0RGV0ZWN0aW9uOiB0aGlzLnN1cHBvcnREZXRlY3Rpb25cclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgc3VwcG9ydERldGVjdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICdiYXNpYyc6IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgd2luZG93LkZpbGUgJiYgd2luZG93LkZpbGVSZWFkZXIgJiYgd2luZG93LkZpbGVMaXN0ICYmIHdpbmRvdy5CbG9iLFxyXG4gICAgICAgICAgJ2RuZCc6ICdvbmRyYWdzdGFydCcgaW4gZGl2ICYmICdvbmRyb3AnIGluIGRpdlxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlbW92ZSAoKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgdGhpcy5wYWludEJhY2tncm91bmQoKVxyXG4gICAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJ1xyXG4gICAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJ1xyXG4gICAgICAgIGxldCBkZWZhdWx0Rm9udFNpemUgPSB0aGlzLnJlYWxXaWR0aCAqIERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcclxuICAgICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemUgfHwgdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZSA9PSAwKSA/IGRlZmF1bHRGb250U2l6ZSA6IHRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemVcclxuICAgICAgICBjdHguZm9udCA9IGZvbnRTaXplICsgJ3B4IHNhbnMtc2VyaWYnXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMucmVhbFdpZHRoIC8gMiwgdGhpcy5yZWFsSGVpZ2h0IC8gMilcclxuXHJcbiAgICAgICAgbGV0IGhhZEltYWdlID0gdGhpcy5pbWcgIT0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcclxuICAgICAgICB0aGlzLmltZ0RhdGEgPSB7fVxyXG5cclxuICAgICAgICBpZiAoaGFkSW1hZ2UpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLklNQUdFX1JFTU9WRV9FVkVOVClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzZXRJbml0aWFsICgpIHtcclxuICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5pbml0aWFsWzBdXHJcbiAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXHJcbiAgICAgICAgaWYgKHRhZyAhPT0gJ2ltZycgfHwgIWVsbSB8fCAhZWxtLnNyYykge1xyXG4gICAgICAgICAgdGhpcy5yZW1vdmUoKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh1LmltYWdlTG9hZGVkKGVsbSkpIHtcclxuICAgICAgICAgIHRoaXMuaW1nID0gZWxtXHJcbiAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZWxtLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbWcgPSBlbG1cclxuICAgICAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZWxtLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjaG9vc2VGaWxlICgpIHtcclxuICAgICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC5jbGljaygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVDbGljayAoKSB7XHJcbiAgICAgICAgaWYgKERFQlVHKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnY2xpY2snKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuaW1nICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlICYmICF0aGlzLmRpc2FibGVkICYmICF0aGlzLnN1cHBvcnRUb3VjaCkge1xyXG4gICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICAgIGlmIChERUJVRykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndHJpZ2dlciBieSBjbGljaycpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlSW5wdXRDaGFuZ2UgKCkge1xyXG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMuZmlsZUlucHV0XHJcbiAgICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGgpIHJldHVyblxyXG5cclxuICAgICAgICBsZXQgZmlsZSA9IGlucHV0LmZpbGVzWzBdXHJcbiAgICAgICAgdGhpcy5vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgb25OZXdGaWxlSW4gKGZpbGUpIHtcclxuICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX0NIT09TRV9FVkVOVCwgZmlsZSlcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVNpemVJc1ZhbGlkKGZpbGUpKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX1NJWkVfRVhDRUVEX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaWxlIHNpemUgZXhjZWVkcyBsaW1pdCB3aGljaCBpcyAnICsgdGhpcy5maWxlU2l6ZUxpbWl0ICsgJyBieXRlcy4nKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVR5cGVJc1ZhbGlkKGZpbGUpKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgICBsZXQgdHlwZSA9IGZpbGUudHlwZSB8fCBmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5zcGxpdCgnLicpLnBvcCgpXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZpbGUgdHlwZSAoJHt0eXBlfSkgZG9lcyBub3QgbWF0Y2ggd2hhdCB5b3Ugc3BlY2lmaWVkICgke3RoaXMuYWNjZXB0fSkuYClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuRmlsZVJlYWRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGxldCBmciA9IG5ldyBGaWxlUmVhZGVyKClcclxuICAgICAgICAgIGZyLm9ubG9hZCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlRGF0YSA9IGUudGFyZ2V0LnJlc3VsdFxyXG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgICAgICAgaW1nLnNyYyA9IGZpbGVEYXRhXHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5pbWcgPSBpbWdcclxuICAgICAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZpbGVTaXplSXNWYWxpZCAoZmlsZSkge1xyXG4gICAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVTaXplTGltaXQgfHwgdGhpcy5maWxlU2l6ZUxpbWl0ID09IDApIHJldHVybiB0cnVlXHJcblxyXG4gICAgICAgIHJldHVybiBmaWxlLnNpemUgPCB0aGlzLmZpbGVTaXplTGltaXRcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZpbGVUeXBlSXNWYWxpZCAoZmlsZSkge1xyXG4gICAgICAgIGxldCBhY2NlcHQgPSB0aGlzLmFjY2VwdCB8fCAnaW1hZ2UvKidcclxuICAgICAgICBsZXQgYmFzZU1pbWV0eXBlID0gYWNjZXB0LnJlcGxhY2UoL1xcLy4qJC8sICcnKVxyXG4gICAgICAgIGxldCB0eXBlcyA9IGFjY2VwdC5zcGxpdCgnLCcpXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICBsZXQgdHlwZSA9IHR5cGVzW2ldXHJcbiAgICAgICAgICBsZXQgdCA9IHR5cGUudHJpbSgpXHJcbiAgICAgICAgICBpZiAodC5jaGFyQXQoMCkgPT0gJy4nKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5zcGxpdCgnLicpLnBvcCgpID09PSB0LnRvTG93ZXJDYXNlKCkuc2xpY2UoMSkpIHJldHVybiB0cnVlXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKC9cXC9cXCokLy50ZXN0KHQpKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWxlQmFzZVR5cGUgPSBmaWxlLnR5cGUucmVwbGFjZSgvXFwvLiokLywgJycpXHJcbiAgICAgICAgICAgIGlmIChmaWxlQmFzZVR5cGUgPT09IGJhc2VNaW1ldHlwZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZS50eXBlID09PSB0eXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGltZ0NvbnRlbnRJbml0ICgpIHtcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5pbWcubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMuaW1nLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICBsZXQgaW1nUmF0aW8gPSBpbWdIZWlnaHQgLyBpbWdXaWR0aFxyXG4gICAgICAgIGxldCBjYW52YXNSYXRpbyA9IHRoaXMucmVhbEhlaWdodCAvIHRoaXMucmVhbFdpZHRoXHJcblxyXG4gICAgICAgIC8vIGRpc3BsYXkgYXMgZml0XHJcbiAgICAgICAgaWYgKGltZ1JhdGlvIDwgY2FudmFzUmF0aW8pIHtcclxuICAgICAgICAgIGxldCByYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGggLyByYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5yZWFsV2lkdGgpIC8gMlxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgcmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gcmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpIC8gMlxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyU3RhcnQgKGV2dCkge1xyXG4gICAgICAgIGlmIChERUJVRykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3RvdWNoIHN0YXJ0JylcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdXBwb3J0VG91Y2ggPSB0cnVlXHJcbiAgICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSBmYWxzZVxyXG4gICAgICAgIGxldCBwb2ludGVyQ29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBwb2ludGVyQ29vcmRcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICAgIC8vIHNpbXVsYXRlIGNsaWNrIHdpdGggdG91Y2ggb24gbW9iaWxlIGRldmljZXNcclxuICAgICAgICBpZiAoIXRoaXMuaW1nICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSB7XHJcbiAgICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gbmV3IERhdGUoKS52YWx1ZU9mKClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZ25vcmUgbW91c2UgcmlnaHQgY2xpY2sgYW5kIG1pZGRsZSBjbGlja1xyXG4gICAgICAgIGlmIChldnQud2hpY2ggJiYgZXZ0LndoaWNoID4gMSkgcmV0dXJuXHJcblxyXG4gICAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxyXG4gICAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXHJcbiAgICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5kaXNhYmxlUGluY2hUb1pvb20pIHtcclxuICAgICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgdGhpcy5waW5jaGluZyA9IHRydWVcclxuICAgICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2FuY2VsRXZlbnRzID0gWydtb3VzZXVwJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJywgJ3BvaW50ZXJlbmQnLCAncG9pbnRlcmNhbmNlbCddXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNhbmNlbEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgbGV0IGUgPSBjYW5jZWxFdmVudHNbaV1cclxuICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZSwgdGhpcy5oYW5kbGVQb2ludGVyRW5kKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJFbmQgKGV2dCkge1xyXG4gICAgICAgIGlmIChERUJVRykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3RvdWNoIGVuZCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwb2ludGVyTW92ZURpc3RhbmNlID0gMFxyXG4gICAgICAgIGlmICh0aGlzLnBvaW50ZXJTdGFydENvb3JkKSB7XHJcbiAgICAgICAgICBsZXQgcG9pbnRlckNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIHBvaW50ZXJNb3ZlRGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9pbnRlckNvb3JkLnggLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLngsIDIpICsgTWF0aC5wb3cocG9pbnRlckNvb3JkLnkgLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLnksIDIpKSB8fCAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICBpZiAoIXRoaXMuaW1nICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSB7XHJcbiAgICAgICAgICBsZXQgdGFiRW5kID0gbmV3IERhdGUoKS52YWx1ZU9mKClcclxuICAgICAgICAgIGlmICgocG9pbnRlck1vdmVEaXN0YW5jZSA8IENMSUNLX01PVkVfVEhSRVNIT0xEKSAmJiB0YWJFbmQgLSB0aGlzLnRhYlN0YXJ0IDwgTUlOX01TX1BFUl9DTElDSyAmJiB0aGlzLnN1cHBvcnRUb3VjaCkge1xyXG4gICAgICAgICAgICB0aGlzLmNob29zZUZpbGUoKVxyXG4gICAgICAgICAgICBpZiAoREVCVUcpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygndHJpZ2dlciBieSB0b3VjaCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMudGFiU3RhcnQgPSAwXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IDBcclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IG51bGxcclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5wb2ludGVyU3RhcnRDb29yZCA9IG51bGxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IHRydWVcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ1RvTW92ZSB8fCAhdGhpcy5pbWcpIHJldHVyblxyXG5cclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxyXG4gICAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIGlmICh0aGlzLmxhc3RNb3ZpbmdDb29yZCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoe1xyXG4gICAgICAgICAgICAgIHg6IGNvb3JkLnggLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC54LFxyXG4gICAgICAgICAgICAgIHk6IGNvb3JkLnkgLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC55XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLnBpbmNoaW5nKSByZXR1cm5cclxuICAgICAgICAgIGxldCBkaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXHJcbiAgICAgICAgICBsZXQgZGVsdGEgPSBkaXN0YW5jZSAtIHRoaXMucGluY2hEaXN0YW5jZVxyXG4gICAgICAgICAgdGhpcy56b29tKGRlbHRhID4gMCwgbnVsbCwgUElOQ0hfQUNDRUxFUkFUSU9OKVxyXG4gICAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gZGlzdGFuY2VcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVXaGVlbCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlU2Nyb2xsVG9ab29tIHx8ICF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIGlmIChldnQud2hlZWxEZWx0YSA8IDAgfHwgZXZ0LmRlbHRhWSA+IDAgfHwgZXZ0LmRldGFpbCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuem9vbSh0aGlzLnJldmVyc2Vab29taW5nR2VzdHVyZSB8fCB0aGlzLnJldmVyc2VTY3JvbGxUb1pvb20sIGNvb3JkKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LndoZWVsRGVsdGEgPiAwIHx8IGV2dC5kZWx0YVkgPCAwIHx8IGV2dC5kZXRhaWwgPCAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20oIXRoaXMucmV2ZXJzZVpvb21pbmdHZXN0dXJlICYmICF0aGlzLnJldmVyc2VTY3JvbGxUb1pvb20sIGNvb3JkKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyYWdFbnRlciAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ0FuZERyb3AgfHwgdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gdHJ1ZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ0xlYXZlIChldnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcmFnT3ZlciAoZXZ0KSB7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcm9wIChldnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcblxyXG4gICAgICAgIGxldCBmaWxlXHJcbiAgICAgICAgbGV0IGR0ID0gZXZ0LmRhdGFUcmFuc2ZlclxyXG4gICAgICAgIGlmICghZHQpIHJldHVyblxyXG4gICAgICAgIGlmIChkdC5pdGVtcykge1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0Lml0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gZHQuaXRlbXNbaV1cclxuICAgICAgICAgICAgaWYgKGl0ZW0ua2luZCA9PSAnZmlsZScpIHtcclxuICAgICAgICAgICAgICBmaWxlID0gaXRlbS5nZXRBc0ZpbGUoKVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZmlsZSA9IGR0LmZpbGVzWzBdXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgdGhpcy5vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1vdmUgKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghb2Zmc2V0KSByZXR1cm5cclxuICAgICAgICBsZXQgb2xkWCA9IHRoaXMuaW1nRGF0YS5zdGFydFhcclxuICAgICAgICBsZXQgb2xkWSA9IHRoaXMuaW1nRGF0YS5zdGFydFlcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYICs9IG9mZnNldC54XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSArPSBvZmZzZXQueVxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLnByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCAhPT0gb2xkWCB8fCB0aGlzLmltZ0RhdGEuc3RhcnRZICE9PSBvbGRZKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5NT1ZFX0VWRU5UKVxyXG4gICAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRZID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVhbFdpZHRoIC0gdGhpcy5pbWdEYXRhLnN0YXJ0WCA+IHRoaXMuaW1nRGF0YS53aWR0aCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5yZWFsV2lkdGgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlYWxIZWlnaHQgLSB0aGlzLmltZ0RhdGEuc3RhcnRZID4gdGhpcy5pbWdEYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB6b29tICh6b29tSW4sIHBvcywgaW5uZXJBY2NlbGVyYXRpb24gPSAxKSB7XHJcbiAgICAgICAgcG9zID0gcG9zIHx8IHtcclxuICAgICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxyXG4gICAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCByZWFsU3BlZWQgPSB0aGlzLnpvb21TcGVlZCAqIGlubmVyQWNjZWxlcmF0aW9uXHJcbiAgICAgICAgbGV0IHNwZWVkID0gKHRoaXMucmVhbFdpZHRoICogUENUX1BFUl9aT09NKSAqIHJlYWxTcGVlZFxyXG4gICAgICAgIGxldCB4ID0gMVxyXG4gICAgICAgIGlmICh6b29tSW4pIHtcclxuICAgICAgICAgIHggPSAxICsgc3BlZWRcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA+IE1JTl9XSURUSCkge1xyXG4gICAgICAgICAgeCA9IDEgLSBzcGVlZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG9sZFdpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoXHJcbiAgICAgICAgbGV0IG9sZEhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHRcclxuXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogeFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogeFxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMucmVhbFdpZHRoKSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMucmVhbFdpZHRoIC8gdGhpcy5pbWdEYXRhLndpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogX3hcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLmhlaWdodCA8IHRoaXMucmVhbEhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgX3ggPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLmltZ0RhdGEuaGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogX3hcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9sZFdpZHRoLnRvRml4ZWQoMikgIT09IHRoaXMuaW1nRGF0YS53aWR0aC50b0ZpeGVkKDIpIHx8IG9sZEhlaWdodC50b0ZpeGVkKDIpICE9PSB0aGlzLmltZ0RhdGEuaGVpZ2h0LnRvRml4ZWQoMikpIHtcclxuICAgICAgICAgIGxldCBvZmZzZXRYID0gKHggLSAxKSAqIChwb3MueCAtIHRoaXMuaW1nRGF0YS5zdGFydFgpXHJcbiAgICAgICAgICBsZXQgb2Zmc2V0WSA9ICh4IC0gMSkgKiAocG9zLnkgLSB0aGlzLmltZ0RhdGEuc3RhcnRZKVxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHRoaXMuaW1nRGF0YS5zdGFydFggLSBvZmZzZXRYXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WSAtIG9mZnNldFlcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgICB0aGlzLnByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuWk9PTV9FVkVOVClcclxuICAgICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFpbnRCYWNrZ3JvdW5kICgpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjZTZlNmU2JyA6IHRoaXMuY2FudmFzQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBiYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLnJlYWxXaWR0aCwgdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZHJhdyAoKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxyXG4gICAgICAgIGlmICh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5wYWludEJhY2tncm91bmQoKVxyXG4gICAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2VuZXJhdGVEYXRhVXJsICh0eXBlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuICcnXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCh0eXBlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2VuZXJhdGVCbG9iIChjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVybiBudWxsXHJcbiAgICAgICAgdGhpcy5jYW52YXMudG9CbG9iKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcHJvbWlzZWRCbG9iICguLi5hcmdzKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBQcm9taXNlID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ05vIFByb21pc2Ugc3VwcG9ydC4gUGxlYXNlIGFkZCBQcm9taXNlIHBvbHlmaWxsIGlmIHlvdSB3YW50IHRvIHVzZSB0aGlzIG1ldGhvZC4nKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlQmxvYigoYmxvYikgPT4ge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUoYmxvYilcclxuICAgICAgICAgICAgfSwgYXJncylcclxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzdHlsdXNcIj5cclxuICAuY3JvcHBhLWNvbnRhaW5lciBcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9ja1xyXG4gICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjNzXHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmVcclxuICAgIGZvbnQtc2l6ZTogMFxyXG4gICAgY2FudmFzXHJcbiAgICAgIHRyYW5zaXRpb246IGFsbCAuM3NcclxuICAgICY6aG92ZXJcclxuICAgICAgb3BhY2l0eTogLjdcclxuICAgICYuY3JvcHBhLS1kcm9wem9uZVxyXG4gICAgICBib3gtc2hhZG93OiBpbnNldCAwIDAgMTBweCBsaWdodG5lc3MoYmxhY2ssIDIwJSlcclxuICAgICAgY2FudmFzXHJcbiAgICAgICAgb3BhY2l0eTogLjVcclxuICAgICYuY3JvcHBhLS1kaXNhYmxlZC1jYyBcclxuICAgICAgY3Vyc29yOiBkZWZhdWx0XHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAmLmNyb3BwYS0taGFzLXRhcmdldFxyXG4gICAgICBjdXJzb3I6IG1vdmVcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgICAgJi5jcm9wcGEtLWRpc2FibGVkLW16XHJcbiAgICAgICAgY3Vyc29yOiBkZWZhdWx0XHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWRcclxuICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZFxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgc3ZnLmljb24tcmVtb3ZlXHJcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZVxyXG4gICAgICBiYWNrZ3JvdW5kOiB3aGl0ZVxyXG4gICAgICBib3JkZXItcmFkaXVzOiA1MCVcclxuICAgICAgZmlsdGVyOiBkcm9wLXNoYWRvdygtMnB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjcpKVxyXG4gICAgICB6LWluZGV4OiAxMFxyXG4gICAgICBjdXJzb3I6IHBvaW50ZXJcclxuICAgICAgYm9yZGVyOiAycHggc29saWQgd2hpdGVcclxuXHJcbjwvc3R5bGU+XHJcbiIsImltcG9ydCBjcm9wcGVyIGZyb20gJy4vY3JvcHBlci52dWUnXHJcblxyXG5jb25zdCBWdWVDcm9wcGEgPSB7XHJcbiAgaW5zdGFsbDogZnVuY3Rpb24gKFZ1ZSwgb3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cclxuICAgIGxldCB2ZXJzaW9uID0gTnVtYmVyKFZ1ZS52ZXJzaW9uLnNwbGl0KCcuJylbMF0pXHJcbiAgICBpZiAodmVyc2lvbiA8IDIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB2dWUtY3JvcHBhIHN1cHBvcnRzIHZ1ZSB2ZXJzaW9uIDIuMCBhbmQgYWJvdmUuIFlvdSBhcmUgdXNpbmcgVnVlQCR7dmVyc2lvbn0uIFBsZWFzZSB1cGdyYWRlIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBWdWUuYClcclxuICAgIH1cclxuICAgIGxldCBjb21wb25lbnROYW1lID0gb3B0aW9ucy5jb21wb25lbnROYW1lIHx8ICdjcm9wcGEnXHJcbiAgICBWdWUuY29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNyb3BwZXIpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsicG9pbnQiLCJ2bSIsImNhbnZhcyIsInF1YWxpdHkiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImNsaWVudFkiLCJsZWZ0IiwidG9wIiwiZXZ0IiwicG9pbnRlciIsInRvdWNoZXMiLCJjaGFuZ2VkVG91Y2hlcyIsIm9uZVBvaW50Q29vcmQiLCJwb2ludGVyMSIsInBvaW50ZXIyIiwiY29vcmQxIiwiY29vcmQyIiwiTWF0aCIsInNxcnQiLCJwb3ciLCJ4IiwieSIsImltZyIsImNvbXBsZXRlIiwibmF0dXJhbFdpZHRoIiwiZG9jdW1lbnQiLCJ3aW5kb3ciLCJsYXN0VGltZSIsInZlbmRvcnMiLCJsZW5ndGgiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImNhbGxiYWNrIiwiY3VyclRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInRpbWVUb0NhbGwiLCJtYXgiLCJpZCIsInNldFRpbWVvdXQiLCJhcmciLCJpc0FycmF5IiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiSFRNTENhbnZhc0VsZW1lbnQiLCJ0b0Jsb2IiLCJkZWZpbmVQcm9wZXJ0eSIsInR5cGUiLCJiaW5TdHIiLCJhdG9iIiwidG9EYXRhVVJMIiwic3BsaXQiLCJsZW4iLCJhcnIiLCJVaW50OEFycmF5IiwiaSIsImNoYXJDb2RlQXQiLCJCbG9iIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidmFsdWUiLCJpc0Zpbml0ZSIsImZsb29yIiwidmFsIiwiU3RyaW5nIiwiQm9vbGVhbiIsIlBDVF9QRVJfWk9PTSIsIk1JTl9NU19QRVJfQ0xJQ0siLCJDTElDS19NT1ZFX1RIUkVTSE9MRCIsIk1JTl9XSURUSCIsIkRFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIiwiUElOQ0hfQUNDRUxFUkFUSU9OIiwiREVCVUciLCJyZW5kZXIiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwicGxhY2Vob2xkZXJGb250U2l6ZSIsImluaXQiLCJyQUZQb2x5ZmlsbCIsInRvQmxvYlBvbHlmaWxsIiwiJG9wdGlvbnMiLCJfcGFyZW50TGlzdGVuZXJzIiwid2FybiIsInN1cHBvcnRzIiwic3VwcG9ydERldGVjdGlvbiIsImJhc2ljIiwiaW5zdGFuY2UiLCIkcmVmcyIsInJlYWxXaWR0aCIsInJlYWxIZWlnaHQiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImNhbnZhc0NvbG9yIiwiY3R4IiwiZ2V0Q29udGV4dCIsIiRzbG90cyIsImluaXRpYWwiLCJzZXRJbml0aWFsIiwicmVtb3ZlIiwiJGVtaXQiLCJldmVudHMiLCJJTklUX0VWRU5UIiwiZmlsZUlucHV0IiwiZmlsZXMiLCJhbW91bnQiLCJtb3ZlIiwiem9vbSIsIiRuZXh0VGljayIsImNob29zZUZpbGUiLCJnZW5lcmF0ZURhdGFVcmwiLCJnZW5lcmF0ZUJsb2IiLCJwcm9taXNlZEJsb2IiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiRmlsZSIsIkZpbGVSZWFkZXIiLCJGaWxlTGlzdCIsInBhaW50QmFja2dyb3VuZCIsInRleHRCYXNlbGluZSIsInRleHRBbGlnbiIsImRlZmF1bHRGb250U2l6ZSIsInBsYWNlaG9sZGVyIiwiZm9udFNpemUiLCJyZWFsUGxhY2Vob2xkZXJGb250U2l6ZSIsImZvbnQiLCJmaWxsU3R5bGUiLCJwbGFjZWhvbGRlckNvbG9yIiwiZmlsbFRleHQiLCJoYWRJbWFnZSIsImltZ0RhdGEiLCJJTUFHRV9SRU1PVkVfRVZFTlQiLCJ2Tm9kZSIsInRhZyIsImVsbSIsInNyYyIsInUiLCJpbWFnZUxvYWRlZCIsImltZ0NvbnRlbnRJbml0Iiwib25sb2FkIiwib25lcnJvciIsImNsaWNrIiwibG9nIiwiZGlzYWJsZUNsaWNrVG9DaG9vc2UiLCJkaXNhYmxlZCIsInN1cHBvcnRUb3VjaCIsImlucHV0IiwiZmlsZSIsIm9uTmV3RmlsZUluIiwiRklMRV9DSE9PU0VfRVZFTlQiLCJmaWxlU2l6ZUlzVmFsaWQiLCJGSUxFX1NJWkVfRVhDRUVEX0VWRU5UIiwiRXJyb3IiLCJmaWxlU2l6ZUxpbWl0IiwiZmlsZVR5cGVJc1ZhbGlkIiwiRklMRV9UWVBFX01JU01BVENIX0VWRU5UIiwibmFtZSIsInRvTG93ZXJDYXNlIiwicG9wIiwiYWNjZXB0IiwiZnIiLCJlIiwiZmlsZURhdGEiLCJ0YXJnZXQiLCJyZXN1bHQiLCJJbWFnZSIsInJlYWRBc0RhdGFVUkwiLCJzaXplIiwiYmFzZU1pbWV0eXBlIiwicmVwbGFjZSIsInR5cGVzIiwidCIsInRyaW0iLCJjaGFyQXQiLCJzbGljZSIsInRlc3QiLCJmaWxlQmFzZVR5cGUiLCJzdGFydFgiLCJzdGFydFkiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsIm5hdHVyYWxIZWlnaHQiLCJpbWdSYXRpbyIsImNhbnZhc1JhdGlvIiwicmF0aW8iLCJkcmF3IiwicG9pbnRlck1vdmVkIiwicG9pbnRlckNvb3JkIiwiZ2V0UG9pbnRlckNvb3JkcyIsInBvaW50ZXJTdGFydENvb3JkIiwidGFiU3RhcnQiLCJ2YWx1ZU9mIiwid2hpY2giLCJkcmFnZ2luZyIsInBpbmNoaW5nIiwiY29vcmQiLCJsYXN0TW92aW5nQ29vcmQiLCJkaXNhYmxlUGluY2hUb1pvb20iLCJwaW5jaERpc3RhbmNlIiwiZ2V0UGluY2hEaXN0YW5jZSIsImNhbmNlbEV2ZW50cyIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYW5kbGVQb2ludGVyRW5kIiwicG9pbnRlck1vdmVEaXN0YW5jZSIsInRhYkVuZCIsImRpc2FibGVEcmFnVG9Nb3ZlIiwicHJldmVudERlZmF1bHQiLCJkaXN0YW5jZSIsImRlbHRhIiwiZGlzYWJsZVNjcm9sbFRvWm9vbSIsIndoZWVsRGVsdGEiLCJkZWx0YVkiLCJkZXRhaWwiLCJyZXZlcnNlWm9vbWluZ0dlc3R1cmUiLCJyZXZlcnNlU2Nyb2xsVG9ab29tIiwiZGlzYWJsZURyYWdBbmREcm9wIiwiZmlsZURyYWdnZWRPdmVyIiwiZHQiLCJkYXRhVHJhbnNmZXIiLCJpdGVtcyIsIml0ZW0iLCJraW5kIiwiZ2V0QXNGaWxlIiwib2Zmc2V0Iiwib2xkWCIsIm9sZFkiLCJwcmV2ZW50V2hpdGVTcGFjZSIsInByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UiLCJNT1ZFX0VWRU5UIiwiem9vbUluIiwicG9zIiwiaW5uZXJBY2NlbGVyYXRpb24iLCJyZWFsU3BlZWQiLCJ6b29tU3BlZWQiLCJzcGVlZCIsIm9sZFdpZHRoIiwib2xkSGVpZ2h0IiwiX3giLCJ0b0ZpeGVkIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJaT09NX0VWRU5UIiwiZmlsbFJlY3QiLCJkcmF3SW1hZ2UiLCJtaW1lVHlwZSIsInF1YWxpdHlBcmd1bWVudCIsImFyZ3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImJsb2IiLCJlcnIiLCJWdWVDcm9wcGEiLCJWdWUiLCJvcHRpb25zIiwidmVyc2lvbiIsImNvbXBvbmVudE5hbWUiLCJjb21wb25lbnQiLCJjcm9wcGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLFFBQWU7ZUFBQSx5QkFDQ0EsS0FERCxFQUNRQyxFQURSLEVBQ1k7UUFDakJDLE1BRGlCLEdBQ0dELEVBREgsQ0FDakJDLE1BRGlCO1FBQ1RDLE9BRFMsR0FDR0YsRUFESCxDQUNURSxPQURTOztRQUVuQkMsT0FBT0YsT0FBT0cscUJBQVAsRUFBWDtRQUNJQyxVQUFVTixNQUFNTSxPQUFwQjtRQUNJQyxVQUFVUCxNQUFNTyxPQUFwQjtXQUNPO1NBQ0YsQ0FBQ0QsVUFBVUYsS0FBS0ksSUFBaEIsSUFBd0JMLE9BRHRCO1NBRUYsQ0FBQ0ksVUFBVUgsS0FBS0ssR0FBaEIsSUFBdUJOO0tBRjVCO0dBTlc7a0JBQUEsNEJBWUlPLEdBWkosRUFZU1QsRUFaVCxFQVlhO1FBQ3BCVSxnQkFBSjtRQUNJRCxJQUFJRSxPQUFKLElBQWVGLElBQUlFLE9BQUosQ0FBWSxDQUFaLENBQW5CLEVBQW1DO2dCQUN2QkYsSUFBSUUsT0FBSixDQUFZLENBQVosQ0FBVjtLQURGLE1BRU8sSUFBSUYsSUFBSUcsY0FBSixJQUFzQkgsSUFBSUcsY0FBSixDQUFtQixDQUFuQixDQUExQixFQUFpRDtnQkFDNUNILElBQUlHLGNBQUosQ0FBbUIsQ0FBbkIsQ0FBVjtLQURLLE1BRUE7Z0JBQ0tILEdBQVY7O1dBRUssS0FBS0ksYUFBTCxDQUFtQkgsT0FBbkIsRUFBNEJWLEVBQTVCLENBQVA7R0FyQlc7a0JBQUEsNEJBd0JJUyxHQXhCSixFQXdCU1QsRUF4QlQsRUF3QmE7UUFDcEJjLFdBQVdMLElBQUlFLE9BQUosQ0FBWSxDQUFaLENBQWY7UUFDSUksV0FBV04sSUFBSUUsT0FBSixDQUFZLENB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
