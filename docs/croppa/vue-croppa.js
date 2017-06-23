/*
<<<<<<< HEAD
 * vue-croppa v0.0.19
=======
 * vue-croppa v0.0.21
>>>>>>> e222aaedabdc7f7e55a48b255a974905d3979f64
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
    var pointer = evt.touches ? evt.touches[0] : evt;
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
<<<<<<< HEAD
=======
  },
  touchDetect: function touchDetect() {
    window.addEventListener('touchstart', function onFirstTouch() {
      window.USER_IS_TOUCHING = true;
      window.removeEventListener('touchstart', onFirstTouch, false);
    }, false);
  },
  rAFPolyfill: function rAFPolyfill() {
    // rAF polyfill
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
>>>>>>> e222aaedabdc7f7e55a48b255a974905d3979f64
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

var INIT_EVENT = 'init';
var FILE_CHOOSE_EVENT = 'file-choose';
var FILE_SIZE_EXCEED_EVENT = 'file-size-exceed';
var IMAGE_REMOVE = 'image-remove';
var MOVE_EVENT = 'move';
var ZOOM_EVENT = 'zoom';
var INITIAL_IMAGE_LOAD = 'initial-image-load';
var INITIAL_IMAGE_ERROR = 'initial-image-error';

u.rAFPolyfill();
u.touchDetect();

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
<<<<<<< HEAD
          !_vm.disabled && _vm.chooseFile();
=======
          $event.stopPropagation();$event.preventDefault();_vm.handleClick($event);
>>>>>>> e222aaedabdc7f7e55a48b255a974905d3979f64
        }, "touchstart": function touchstart($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerStart($event);
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
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerMove($event);
        }, "mousemove": function mousemove($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerMove($event);
        }, "pointermove": function pointermove($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerMove($event);
        }, "DOMMouseScroll": function DOMMouseScroll($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleWheel($event);
        }, "wheel": function wheel($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleWheel($event);
        }, "mousewheel": function mousewheel($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleWheel($event);
        } } }), _vm.showRemoveButton && _vm.img ? _c('svg', { staticClass: "icon icon-remove", style: 'top: -' + _vm.height / 40 + 'px; right: -' + _vm.width / 40 + 'px', attrs: { "viewBox": "0 0 1024 1024", "version": "1.1", "xmlns": "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", "width": _vm.removeButtonSize || _vm.width / 10, "height": _vm.removeButtonSize || _vm.width / 10 }, on: { "click": _vm.unset } }, [_c('path', { attrs: { "d": "M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z", "fill": _vm.removeButtonColor } })]) : _vm._e()]);
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
<<<<<<< HEAD
      pinchDistance: 0,
      pinchCenter: {}
=======
      pinchDistance: 0
>>>>>>> e222aaedabdc7f7e55a48b255a974905d3979f64
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
        this.unset();
      }
      this.$emit(INIT_EVENT, {
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
        reset: this.unset,
        chooseFile: this.chooseFile,
        generateDataUrl: this.generateDataUrl,
        generateBlob: this.generateBlob,
        promisedBlob: this.promisedBlob
      });
    },
    unset: function unset() {
      var ctx = this.ctx;
      this.paintBackground();
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      var defaultFontSize = this.realWidth / 1.5 / this.placeholder.length;
      var fontSize = !this.realPlaceholderFontSize || this.realPlaceholderFontSize == 0 ? defaultFontSize : this.realPlaceholderFontSize;
      ctx.font = fontSize + 'px sans-serif';
      ctx.fillStyle = !this.placeholderColor || this.placeholderColor == 'default' ? '#606060' : this.placeholderColor;
      ctx.fillText(this.placeholder, this.realWidth / 2, this.realHeight / 2);

      var hadImage = this.img != null;
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imgData = {};

      if (hadImage) {
        this.$emit(IMAGE_REMOVE);
      }
    },
    setInitial: function setInitial() {
      var _this2 = this;

      var vNode = this.$slots.initial[0];
      var tag = vNode.tag,
          elm = vNode.elm;

      if (tag !== 'img' || !elm || !elm.src) {
        this.unset();
        return;
      }
      if (u.imageLoaded(elm)) {
        this.img = elm;
        this.imgContentInit();
      } else {
        elm.onload = function () {
          _this2.$emit(INITIAL_IMAGE_LOAD);
          _this2.img = elm;
          _this2.imgContentInit();
        };

        elm.onerror = function () {
          _this2.$emit(INITIAL_IMAGE_ERROR);
          _this2.unset();
        };
      }
    },
    chooseFile: function chooseFile() {
      this.$refs.fileInput.click();
    },
    handleClick: function handleClick() {
      if (!this.img && !this.disableClickToChoose && !this.disabled && window.USER_IS_TOUCHING) {
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
      var _this3 = this;

      this.$emit(FILE_CHOOSE_EVENT, file);
      if (!this.fileSizeIsValid(file)) {
        this.$emit(FILE_SIZE_EXCEED_EVENT, file);
        throw new Error('File size exceeds limit which is ' + this.fileSizeLimit + ' bytes.');
      }
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
    },
    fileSizeIsValid: function fileSizeIsValid(file) {
      if (!file) return false;
      if (!this.fileSizeLimit || this.fileSizeLimit == 0) return true;

      return file.size < this.fileSizeLimit;
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
      if (this.disabled) return;
      // simulate click with touch on mobile devices
<<<<<<< HEAD
      if (!this.img) {
=======
      if (!this.img && !this.disableClickToChoose) {
>>>>>>> e222aaedabdc7f7e55a48b255a974905d3979f64
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

<<<<<<< HEAD
      if (evt.touches && evt.touches.length === 2) {
        this.dragging = false;
        this.pinching = true;
        this.pinchDistance = u.getPinchDistance(evt, this);
        this.pinchCenter = u.getPinchCenterCoord(evt, this);
=======
      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        this.dragging = false;
        this.pinching = true;
        this.pinchDistance = u.getPinchDistance(evt, this);
>>>>>>> e222aaedabdc7f7e55a48b255a974905d3979f64
      }

      if (document) {
        var cancelEvents = ['mouseup', 'touchend', 'touchcancel', 'pointerend', 'pointercancel'];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = cancelEvents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var e = _step.value;

            document.addEventListener(e, this.handlePointerEnd);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    },
    handlePointerEnd: function handlePointerEnd(evt) {
      if (this.disabled) return;
<<<<<<< HEAD
      if (!this.img) {
=======
      if (!this.img && !this.disableClickToChoose) {
>>>>>>> e222aaedabdc7f7e55a48b255a974905d3979f64
        var tabEnd = new Date().valueOf();
        if (tabEnd - this.tabStart < 1000) {
          this.chooseFile();
        }
        this.tabStart = 0;
        return;
      }

      this.dragging = false;
      this.pinching = false;
      this.pinchDistance = 0;
<<<<<<< HEAD
      this.pinchCenter = {};
=======
>>>>>>> e222aaedabdc7f7e55a48b255a974905d3979f64
      this.lastMovingCoord = null;
    },
    handlePointerMove: function handlePointerMove(evt) {
      if (this.disabled || this.disableDragToMove || !this.img) return;

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

<<<<<<< HEAD
      if (evt.touches && evt.touches.length === 2) {
=======
      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
>>>>>>> e222aaedabdc7f7e55a48b255a974905d3979f64
        if (!this.pinching) return;
        var distance = u.getPinchDistance(evt, this);
        var delta = distance - this.pinchDistance;
        this.zoom(delta > 0, null, 2);
        this.pinchDistance = distance;
      }
    },
    handleWheel: function handleWheel(evt) {
      if (this.disabled || this.disableScrollToZoom || !this.img) return;
      var coord = u.getPointerCoords(evt, this);
      if (evt.wheelDelta < 0 || evt.deltaY > 0 || evt.detail > 0) {
<<<<<<< HEAD
        this.zoom(this.reverseZoomingGesture, coord);
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseZoomingGesture, coord);
=======
        this.zoom(this.reverseZoomingGesture || this.reverseScrollToZoom, coord);
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseZoomingGesture && !this.reverseScrollToZoom, coord);
>>>>>>> e222aaedabdc7f7e55a48b255a974905d3979f64
      }
    },
    handleDragEnter: function handleDragEnter(evt) {
      if (this.disabled || this.disableDragAndDrop || this.img) return;
      this.fileDraggedOver = true;
<<<<<<< HEAD
      console.log('enter');
=======
>>>>>>> e222aaedabdc7f7e55a48b255a974905d3979f64
    },
    handleDragLeave: function handleDragLeave(evt) {
      if (this.disabled || this.disableDragAndDrop || this.img) return;
      this.fileDraggedOver = false;
    },
    handleDragOver: function handleDragOver(evt) {},
    handleDrop: function handleDrop(evt) {
      if (this.disabled || this.disableDragAndDrop || this.img) return;
      if (!evt.dataTransfer || !evt.dataTransfer.files.length) return;
      this.fileDraggedOver = false;
      var file = evt.dataTransfer.files[0];
      this.onNewFileIn(file);
    },
    move: function move(offset) {
      if (!offset) return;
      this.imgData.startX += offset.x;
      this.imgData.startY += offset.y;
      if (this.preventWhiteSpace) {
        this.preventMovingToWhiteSpace();
      }
      this.$emit(MOVE_EVENT);
      this.draw();
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
      var timesFaster = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      pos = pos || {
        x: this.imgData.startX + this.imgData.width / 2,
        y: this.imgData.startY + this.imgData.height / 2
      };
      var speed = this.realWidth / 100000 * this.zoomSpeed * timesFaster;
      var x = 1;
      if (zoomIn) {
        x = 1 + speed;
      } else if (this.imgData.width > 20) {
        x = 1 - speed;
      }
      this.imgData.width = this.imgData.width * x;
      this.imgData.height = this.imgData.height * x;
      var offsetX = (x - 1) * (pos.x - this.imgData.startX);
      var offsetY = (x - 1) * (pos.y - this.imgData.startY);
      console.log(offsetX, offsetY);
      this.imgData.startX = this.imgData.startX - offsetX;
      this.imgData.startY = this.imgData.startY - offsetY;

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
        this.preventMovingToWhiteSpace();
      }
      this.$emit(ZOOM_EVENT);
      this.draw();
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

      requestAnimationFrame(function () {
        _this4.paintBackground();
        ctx.drawImage(_this4.img, startX, startY, width, height);
      });
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
    Vue.component('croppa', cropper);
  }
};

return VueCroppa;

})));
<<<<<<< HEAD
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi9zcmMvY3JvcHBlci52dWUiLCIuLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgb25lUG9pbnRDb29yZChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyhldnQsIHZtKSB7XHJcbiAgICBsZXQgcG9pbnRlciA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnRcclxuICAgIHJldHVybiB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlciwgdm0pXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hEaXN0YW5jZShldnQsIHZtKSB7XHJcbiAgICBsZXQgcG9pbnRlcjEgPSBldnQudG91Y2hlc1swXVxyXG4gICAgbGV0IHBvaW50ZXIyID0gZXZ0LnRvdWNoZXNbMV1cclxuICAgIGxldCBjb29yZDEgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjEsIHZtKVxyXG4gICAgbGV0IGNvb3JkMiA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMiwgdm0pXHJcblxyXG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhjb29yZDEueCAtIGNvb3JkMi54LCAyKSArIE1hdGgucG93KGNvb3JkMS55IC0gY29vcmQyLnksIDIpKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoQ2VudGVyQ29vcmQoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZChpbWcpIHtcclxuICAgIHJldHVybiBpbWcuY29tcGxldGUgJiYgaW1nLm5hdHVyYWxXaWR0aCAhPT0gMFxyXG4gIH1cclxufSIsIk51bWJlci5pc0ludGVnZXIgPSBOdW1iZXIuaXNJbnRlZ2VyIHx8IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWVcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjZTZlNmU2J1xyXG4gIH0sXHJcbiAgcXVhbGl0eToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWwpICYmIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnaW1hZ2UvKidcclxuICB9LFxyXG4gIGZpbGVTaXplTGltaXQ6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+PSAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBkaXNhYmxlZDogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ0FuZERyb3A6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZUNsaWNrVG9DaG9vc2U6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZURyYWdUb01vdmU6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICByZXZlcnNlWm9vbWluZ0dlc3R1cmU6IEJvb2xlYW4sXHJcbiAgcHJldmVudFdoaXRlU3BhY2U6IEJvb2xlYW4sXHJcbiAgc2hvd1JlbW92ZUJ1dHRvbjoge1xyXG4gICAgdHlwZTogQm9vbGVhbixcclxuICAgIGRlZmF1bHQ6IHRydWVcclxuICB9LFxyXG4gIHJlbW92ZUJ1dHRvbkNvbG9yOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAncmVkJ1xyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uU2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyXHJcbiAgfVxyXG59IiwiPHRlbXBsYXRlPlxyXG4gIDxkaXYgOmNsYXNzPVwiYGNyb3BwYS1jb250YWluZXIgJHtpbWcgPyAnY3JvcHBhLS1oYXMtdGFyZ2V0JyA6ICcnfSAke2Rpc2FibGVkID8gJ2Nyb3BwYS0tZGlzYWJsZWQnIDogJyd9ICR7ZGlzYWJsZUNsaWNrVG9DaG9vc2UgPyAnY3JvcHBhLS1kaXNhYmxlZC1jYycgOiAnJ30gJHtkaXNhYmxlRHJhZ1RvTW92ZSAmJiBkaXNhYmxlU2Nyb2xsVG9ab29tID8gJ2Nyb3BwYS0tZGlzYWJsZWQtbXonIDogJyd9ICR7ZmlsZURyYWdnZWRPdmVyID8gJ2Nyb3BwYS0tZHJvcHpvbmUnIDogJyd9YFwiXHJcbiAgICAgICBAZHJhZ2VudGVyLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdFbnRlclwiXHJcbiAgICAgICBAZHJhZ2xlYXZlLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdMZWF2ZVwiXHJcbiAgICAgICBAZHJhZ292ZXIuc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJhZ092ZXJcIlxyXG4gICAgICAgQGRyb3Auc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJvcFwiPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCJcclxuICAgICAgICAgICA6YWNjZXB0PVwiYWNjZXB0XCJcclxuICAgICAgICAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXHJcbiAgICAgICAgICAgcmVmPVwiZmlsZUlucHV0XCJcclxuICAgICAgICAgICBoaWRkZW5cclxuICAgICAgICAgICBAY2hhbmdlPVwiaGFuZGxlSW5wdXRDaGFuZ2VcIiAvPlxyXG4gICAgPGRpdiBjbGFzcz1cImluaXRpYWxcIlxyXG4gICAgICAgICBzdHlsZT1cIndpZHRoOiAwOyBoZWlnaHQ6IDA7IHZpc2liaWxpdHk6IGhpZGRlbjtcIj5cclxuICAgICAgPHNsb3QgbmFtZT1cImluaXRpYWxcIj48L3Nsb3Q+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCJcclxuICAgICAgICAgICAgQGNsaWNrPVwiIWRpc2FibGVkICYmIGNob29zZUZpbGUoKVwiXHJcbiAgICAgICAgICAgIEB0b3VjaHN0YXJ0LnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEBtb3VzZWRvd24uc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHBvaW50ZXJzdGFydC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEB0b3VjaGNhbmNlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQG1vdXNldXAuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcmNhbmNlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNobW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBtb3VzZW1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBARE9NTW91c2VTY3JvbGwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAd2hlZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAbW91c2V3aGVlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVXaGVlbFwiPjwvY2FudmFzPlxyXG4gICAgPHN2ZyBjbGFzcz1cImljb24gaWNvbi1yZW1vdmVcIlxyXG4gICAgICAgICB2LWlmPVwic2hvd1JlbW92ZUJ1dHRvbiAmJiBpbWdcIlxyXG4gICAgICAgICBAY2xpY2s9XCJ1bnNldFwiXHJcbiAgICAgICAgIDpzdHlsZT1cImB0b3A6IC0ke2hlaWdodC80MH1weDsgcmlnaHQ6IC0ke3dpZHRoLzQwfXB4YFwiXHJcbiAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcclxuICAgICAgICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxyXG4gICAgICAgICA6d2lkdGg9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCJcclxuICAgICAgICAgOmhlaWdodD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIj5cclxuICAgICAgPHBhdGggZD1cIk01MTEuOTIxMjMxIDBDMjI5LjE3OTA3NyAwIDAgMjI5LjI1Nzg0NiAwIDUxMiAwIDc5NC43MDI3NjkgMjI5LjE3OTA3NyAxMDI0IDUxMS45MjEyMzEgMTAyNCA3OTQuNzgxNTM4IDEwMjQgMTAyNCA3OTQuNzAyNzY5IDEwMjQgNTEyIDEwMjQgMjI5LjI1Nzg0NiA3OTQuNzgxNTM4IDAgNTExLjkyMTIzMSAwWk03MzIuMDQxODQ2IDY1MC42MzM4NDYgNjUwLjUxNTY5MiA3MzIuMDgxMjMxQzY1MC41MTU2OTIgNzMyLjA4MTIzMSA1MjEuNDkxNjkyIDU5My42ODM2OTIgNTExLjg4MTg0NiA1OTMuNjgzNjkyIDUwMi40Mjk1MzggNTkzLjY4MzY5MiAzNzMuMzY2MTU0IDczMi4wODEyMzEgMzczLjM2NjE1NCA3MzIuMDgxMjMxTDI5MS43NjEyMzEgNjUwLjYzMzg0NkMyOTEuNzYxMjMxIDY1MC42MzM4NDYgNDMwLjMxNjMwOCA1MjMuNTAwMzA4IDQzMC4zMTYzMDggNTEyLjE5NjkyMyA0MzAuMzE2MzA4IDUwMC42OTY2MTUgMjkxLjc2MTIzMSAzNzMuNTIzNjkyIDI5MS43NjEyMzEgMzczLjUyMzY5MkwzNzMuMzY2MTU0IDI5MS45MTg3NjlDMzczLjM2NjE1NCAyOTEuOTE4NzY5IDUwMy40NTM1MzggNDMwLjM5NTA3NyA1MTEuODgxODQ2IDQzMC4zOTUwNzcgNTIwLjM0OTUzOCA0MzAuMzk1MDc3IDY1MC41MTU2OTIgMjkxLjkxODc2OSA2NTAuNTE1NjkyIDI5MS45MTg3NjlMNzMyLjA0MTg0NiAzNzMuNTIzNjkyQzczMi4wNDE4NDYgMzczLjUyMzY5MiA1OTMuNDQ3Mzg1IDUwMi41NDc2OTIgNTkzLjQ0NzM4NSA1MTIuMTk2OTIzIDU5My40NDczODUgNTIxLjQxMjkyMyA3MzIuMDQxODQ2IDY1MC42MzM4NDYgNzMyLjA0MTg0NiA2NTAuNjMzODQ2WlwiXHJcbiAgICAgICAgICAgIDpmaWxsPVwicmVtb3ZlQnV0dG9uQ29sb3JcIj48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xyXG4gIGltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xyXG5cclxuICBjb25zdCBJTklUX0VWRU5UID0gJ2luaXQnXHJcbiAgY29uc3QgRklMRV9DSE9PU0VfRVZFTlQgPSAnZmlsZS1jaG9vc2UnXHJcbiAgY29uc3QgRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCA9ICdmaWxlLXNpemUtZXhjZWVkJ1xyXG4gIGNvbnN0IElNQUdFX1JFTU9WRSA9ICdpbWFnZS1yZW1vdmUnXHJcbiAgY29uc3QgTU9WRV9FVkVOVCA9ICdtb3ZlJ1xyXG4gIGNvbnN0IFpPT01fRVZFTlQgPSAnem9vbSdcclxuICBjb25zdCBJTklUSUFMX0lNQUdFX0xPQUQgPSAnaW5pdGlhbC1pbWFnZS1sb2FkJ1xyXG4gIGNvbnN0IElOSVRJQUxfSU1BR0VfRVJST1IgPSAnaW5pdGlhbC1pbWFnZS1lcnJvcidcclxuXHJcbiAgZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgbW9kZWw6IHtcclxuICAgICAgcHJvcDogJ3ZhbHVlJyxcclxuICAgICAgZXZlbnQ6ICdpbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBwcm9wczogcHJvcHMsXHJcblxyXG4gICAgZGF0YSAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXHJcbiAgICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICAgIGN0eDogbnVsbCxcclxuICAgICAgICBpbWc6IG51bGwsXHJcbiAgICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICAgIGxhc3RNb3ZpbmdDb29yZDogbnVsbCxcclxuICAgICAgICBpbWdEYXRhOiB7fSxcclxuICAgICAgICBkYXRhVXJsOiAnJyxcclxuICAgICAgICBmaWxlRHJhZ2dlZE92ZXI6IGZhbHNlLFxyXG4gICAgICAgIHRhYlN0YXJ0OiAwLFxyXG4gICAgICAgIHBpbmNoaW5nOiBmYWxzZSxcclxuICAgICAgICBwaW5jaERpc3RhbmNlOiAwLFxyXG4gICAgICAgIHBpbmNoQ2VudGVyOiB7fVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgIHJlYWxXaWR0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlYWxIZWlnaHQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVhbFBsYWNlaG9sZGVyRm9udFNpemUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyRm9udFNpemUgKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtb3VudGVkICgpIHtcclxuICAgICAgdGhpcy5pbml0KClcclxuICAgIH0sXHJcblxyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlID0gdmFsXHJcbiAgICAgIH0sXHJcbiAgICAgIHJlYWxXaWR0aDogJ2luaXQnLFxyXG4gICAgICByZWFsSGVpZ2h0OiAnaW5pdCcsXHJcbiAgICAgIGNhbnZhc0NvbG9yOiAnaW5pdCcsXHJcbiAgICAgIHBsYWNlaG9sZGVyOiAnaW5pdCcsXHJcbiAgICAgIHBsYWNlaG9sZGVyQ29sb3I6ICdpbml0JyxcclxuICAgICAgcmVhbFBsYWNlaG9sZGVyRm9udFNpemU6ICdpbml0JyxcclxuICAgICAgcHJldmVudFdoaXRlU3BhY2U6ICdpbWdDb250ZW50SW5pdCdcclxuICAgIH0sXHJcblxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICBpbml0ICgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJHJlZnMuY2FudmFzXHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArICdweCdcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArICdweCdcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJyNlNmU2ZTYnIDogKHR5cGVvZiB0aGlzLmNhbnZhc0NvbG9yID09PSAnc3RyaW5nJyA/IHRoaXMuY2FudmFzQ29sb3IgOiAnJylcclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuICAgICAgICBpZiAodGhpcy4kc2xvdHMuaW5pdGlhbCAmJiB0aGlzLiRzbG90cy5pbml0aWFsWzBdKSB7XHJcbiAgICAgICAgICB0aGlzLnNldEluaXRpYWwoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4kZW1pdChJTklUX0VWRU5ULCB7XHJcbiAgICAgICAgICBnZXRDYW52YXM6ICgpID0+IHRoaXMuY2FudmFzLFxyXG4gICAgICAgICAgZ2V0Q29udGV4dDogKCkgPT4gdGhpcy5jdHgsXHJcbiAgICAgICAgICBnZXRDaG9zZW5GaWxlOiAoKSA9PiB0aGlzLiRyZWZzLmZpbGVJbnB1dC5maWxlc1swXSxcclxuICAgICAgICAgIGdldEFjdHVhbEltYWdlU2l6ZTogKCkgPT4gKHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucmVhbFdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICBtb3ZlVXB3YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiAtYW1vdW50IH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZURvd253YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiBhbW91bnQgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlTGVmdHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IC1hbW91bnQsIHk6IDAgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlUmlnaHR3YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiBhbW91bnQsIHk6IDAgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB6b29tSW46ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKHRydWUpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgem9vbU91dDogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnpvb20oZmFsc2UpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVmcmVzaDogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLmluaXQpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVzZXQ6IHRoaXMudW5zZXQsXHJcbiAgICAgICAgICBjaG9vc2VGaWxlOiB0aGlzLmNob29zZUZpbGUsXHJcbiAgICAgICAgICBnZW5lcmF0ZURhdGFVcmw6IHRoaXMuZ2VuZXJhdGVEYXRhVXJsLFxyXG4gICAgICAgICAgZ2VuZXJhdGVCbG9iOiB0aGlzLmdlbmVyYXRlQmxvYixcclxuICAgICAgICAgIHByb21pc2VkQmxvYjogdGhpcy5wcm9taXNlZEJsb2JcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgdW5zZXQgKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXHJcbiAgICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMucmVhbFdpZHRoIC8gMS41IC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcclxuICAgICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemUgfHwgdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZSA9PSAwKSA/IGRlZmF1bHRGb250U2l6ZSA6IHRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemVcclxuICAgICAgICBjdHguZm9udCA9IGZvbnRTaXplICsgJ3B4IHNhbnMtc2VyaWYnXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMucmVhbFdpZHRoIC8gMiwgdGhpcy5yZWFsSGVpZ2h0IC8gMilcclxuXHJcbiAgICAgICAgbGV0IGhhZEltYWdlID0gdGhpcy5pbWcgIT0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcclxuICAgICAgICB0aGlzLmltZ0RhdGEgPSB7fVxyXG5cclxuICAgICAgICBpZiAoaGFkSW1hZ2UpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoSU1BR0VfUkVNT1ZFKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNldEluaXRpYWwgKCkge1xyXG4gICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLmluaXRpYWxbMF1cclxuICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICBpZiAodGFnICE9PSAnaW1nJyB8fCAhZWxtIHx8ICFlbG0uc3JjKSB7XHJcbiAgICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChlbG0pKSB7XHJcbiAgICAgICAgICB0aGlzLmltZyA9IGVsbVxyXG4gICAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVsbS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoSU5JVElBTF9JTUFHRV9MT0FEKVxyXG4gICAgICAgICAgICB0aGlzLmltZyA9IGVsbVxyXG4gICAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBlbG0ub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy4kZW1pdChJTklUSUFMX0lNQUdFX0VSUk9SKVxyXG4gICAgICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjaG9vc2VGaWxlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWcgfHwgdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQuY2xpY2soKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlSW5wdXRDaGFuZ2UgKCkge1xyXG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMuZmlsZUlucHV0XHJcbiAgICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGgpIHJldHVyblxyXG5cclxuICAgICAgICBsZXQgZmlsZSA9IGlucHV0LmZpbGVzWzBdXHJcbiAgICAgICAgdGhpcy5vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgb25OZXdGaWxlSW4gKGZpbGUpIHtcclxuICAgICAgICB0aGlzLiRlbWl0KEZJTEVfQ0hPT1NFX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBzaXplIGV4Y2VlZHMgbGltaXQgd2hpY2ggaXMgJyArIHRoaXMuZmlsZVNpemVMaW1pdCArICcgYnl0ZXMuJylcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgICAgIGZyLm9ubG9hZCA9IChlKSA9PiB7XHJcbiAgICAgICAgICBsZXQgZmlsZURhdGEgPSBlLnRhcmdldC5yZXN1bHRcclxuICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgICAgaW1nLnNyYyA9IGZpbGVEYXRhXHJcbiAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmltZyA9IGltZ1xyXG4gICAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmlsZVNpemVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2VcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVNpemVMaW1pdCB8fCB0aGlzLmZpbGVTaXplTGltaXQgPT0gMCkgcmV0dXJuIHRydWVcclxuXHJcbiAgICAgICAgcmV0dXJuIGZpbGUuc2l6ZSA8IHRoaXMuZmlsZVNpemVMaW1pdFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaW1nQ29udGVudEluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLmltZy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIGxldCBpbWdSYXRpbyA9IGltZ0hlaWdodCAvIGltZ1dpZHRoXHJcbiAgICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5yZWFsSGVpZ2h0IC8gdGhpcy5yZWFsV2lkdGhcclxuXHJcbiAgICAgICAgLy8gZGlzcGxheSBhcyBmaXRcclxuICAgICAgICBpZiAoaW1nUmF0aW8gPCBjYW52YXNSYXRpbykge1xyXG4gICAgICAgICAgbGV0IHJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCByYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyByYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJTdGFydCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICAgIC8vIHNpbXVsYXRlIGNsaWNrIHdpdGggdG91Y2ggb24gbW9iaWxlIGRldmljZXNcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gbmV3IERhdGUoKS52YWx1ZU9mKClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZ25vcmUgbW91c2UgcmlnaHQgY2xpY2sgYW5kIG1pZGRsZSBjbGlja1xyXG4gICAgICAgIGlmIChldnQud2hpY2ggJiYgZXZ0LndoaWNoID4gMSkgcmV0dXJuXHJcblxyXG4gICAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxyXG4gICAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXHJcbiAgICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgICAgICB0aGlzLnBpbmNoaW5nID0gdHJ1ZVxyXG4gICAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcclxuICAgICAgICAgIHRoaXMucGluY2hDZW50ZXIgPSB1LmdldFBpbmNoQ2VudGVyQ29vcmQoZXZ0LCB0aGlzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRvY3VtZW50KSB7XHJcbiAgICAgICAgICBsZXQgY2FuY2VsRXZlbnRzID0gWydtb3VzZXVwJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJywgJ3BvaW50ZXJlbmQnLCAncG9pbnRlcmNhbmNlbCddXHJcbiAgICAgICAgICBmb3IgKGxldCBlIG9mIGNhbmNlbEV2ZW50cykge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuaGFuZGxlUG9pbnRlckVuZClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyRW5kIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgbGV0IHRhYkVuZCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICBpZiAodGFiRW5kIC0gdGhpcy50YWJTdGFydCA8IDEwMDApIHtcclxuICAgICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMudGFiU3RhcnQgPSAwXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IDBcclxuICAgICAgICB0aGlzLnBpbmNoQ2VudGVyID0ge31cclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IG51bGxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnVG9Nb3ZlIHx8ICF0aGlzLmltZykgcmV0dXJuXHJcblxyXG4gICAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxyXG4gICAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIGlmICh0aGlzLmxhc3RNb3ZpbmdDb29yZCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoe1xyXG4gICAgICAgICAgICAgIHg6IGNvb3JkLnggLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC54LFxyXG4gICAgICAgICAgICAgIHk6IGNvb3JkLnkgLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC55XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMucGluY2hpbmcpIHJldHVyblxyXG4gICAgICAgICAgbGV0IGRpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcclxuICAgICAgICAgIGxldCBkZWx0YSA9IGRpc3RhbmNlIC0gdGhpcy5waW5jaERpc3RhbmNlXHJcbiAgICAgICAgICB0aGlzLnpvb20oZGVsdGEgPiAwLCBudWxsLCAyKVxyXG4gICAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gZGlzdGFuY2VcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVXaGVlbCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlU2Nyb2xsVG9ab29tIHx8ICF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICBpZiAoZXZ0LndoZWVsRGVsdGEgPCAwIHx8IGV2dC5kZWx0YVkgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlWm9vbWluZ0dlc3R1cmUsIGNvb3JkKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LndoZWVsRGVsdGEgPiAwIHx8IGV2dC5kZWx0YVkgPCAwIHx8IGV2dC5kZXRhaWwgPCAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20oIXRoaXMucmV2ZXJzZVpvb21pbmdHZXN0dXJlLCBjb29yZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcmFnRW50ZXIgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdBbmREcm9wIHx8IHRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IHRydWVcclxuICAgICAgICBjb25zb2xlLmxvZygnZW50ZXInKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ0xlYXZlIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnQW5kRHJvcCB8fCB0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ092ZXIgKGV2dCkge1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJvcCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ0FuZERyb3AgfHwgdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGlmICghZXZ0LmRhdGFUcmFuc2ZlciB8fCAhZXZ0LmRhdGFUcmFuc2Zlci5maWxlcy5sZW5ndGgpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuICAgICAgICBsZXQgZmlsZSA9IGV2dC5kYXRhVHJhbnNmZXIuZmlsZXNbMF1cclxuICAgICAgICB0aGlzLm9uTmV3RmlsZUluKGZpbGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlIChvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIW9mZnNldCkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgKz0gb2Zmc2V0LnlcclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4kZW1pdChNT1ZFX0VWRU5UKVxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRZID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVhbFdpZHRoIC0gdGhpcy5pbWdEYXRhLnN0YXJ0WCA+IHRoaXMuaW1nRGF0YS53aWR0aCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5yZWFsV2lkdGgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlYWxIZWlnaHQgLSB0aGlzLmltZ0RhdGEuc3RhcnRZID4gdGhpcy5pbWdEYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB6b29tICh6b29tSW4sIHBvcywgdGltZXNGYXN0ZXIgPSAxKSB7XHJcbiAgICAgICAgcG9zID0gcG9zIHx8IHtcclxuICAgICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxyXG4gICAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBzcGVlZCA9ICh0aGlzLnJlYWxXaWR0aCAvIDEwMDAwMCkgKiB0aGlzLnpvb21TcGVlZCAqIHRpbWVzRmFzdGVyXHJcbiAgICAgICAgbGV0IHggPSAxXHJcbiAgICAgICAgaWYgKHpvb21Jbikge1xyXG4gICAgICAgICAgeCA9IDEgKyBzcGVlZFxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbWdEYXRhLndpZHRoID4gMjApIHtcclxuICAgICAgICAgIHggPSAxIC0gc3BlZWRcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogeFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogeFxyXG4gICAgICAgIGxldCBvZmZzZXRYID0gKHggLSAxKSAqIChwb3MueCAtIHRoaXMuaW1nRGF0YS5zdGFydFgpXHJcbiAgICAgICAgbGV0IG9mZnNldFkgPSAoeCAtIDEpICogKHBvcy55IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSlcclxuICAgICAgICBjb25zb2xlLmxvZyhvZmZzZXRYLCBvZmZzZXRZKVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYIC0gb2Zmc2V0WFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZIC0gb2Zmc2V0WVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMucmVhbFdpZHRoKSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMucmVhbFdpZHRoIC8gdGhpcy5pbWdEYXRhLndpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogX3hcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLmhlaWdodCA8IHRoaXMucmVhbEhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgX3ggPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLmltZ0RhdGEuaGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogX3hcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMucHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuJGVtaXQoWk9PTV9FVkVOVClcclxuICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFpbnRCYWNrZ3JvdW5kICgpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjZTZlNmU2JyA6IHRoaXMuY2FudmFzQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBiYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLnJlYWxXaWR0aCwgdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZHJhdyAoKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxyXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZURhdGFVcmwgKHR5cGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4gJydcclxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXMudG9EYXRhVVJMKHR5cGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuIG51bGxcclxuICAgICAgICB0aGlzLmNhbnZhcy50b0Jsb2IoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcm9taXNlZEJsb2IgKC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUJsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICAgICAgICByZXNvbHZlKGJsb2IpXHJcbiAgICAgICAgICAgIH0sIGFyZ3MpXHJcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycilcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZSBsYW5nPVwic3R5bHVzXCI+XHJcbiAgLmNyb3BwYS1jb250YWluZXIgXHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2tcclxuICAgIGN1cnNvcjogcG9pbnRlclxyXG4gICAgdHJhbnNpdGlvbjogYWxsIC4zc1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlXHJcbiAgICBmb250LXNpemU6IDBcclxuICAgIGNhbnZhc1xyXG4gICAgICB0cmFuc2l0aW9uOiBhbGwgLjNzXHJcbiAgICAmOmhvdmVyXHJcbiAgICAgIG9wYWNpdHk6IC43XHJcbiAgICAmLmNyb3BwYS0tZHJvcHpvbmVcclxuICAgICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDEwcHggbGlnaHRuZXNzKGJsYWNrLCAyMCUpXHJcbiAgICAgIGNhbnZhc1xyXG4gICAgICAgIG9wYWNpdHk6IC41XHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWQtY2MgXHJcbiAgICAgIGN1cnNvcjogZGVmYXVsdFxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgJi5jcm9wcGEtLWhhcy10YXJnZXRcclxuICAgICAgY3Vyc29yOiBtb3ZlXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICYuY3JvcHBhLS1kaXNhYmxlZC1telxyXG4gICAgICAgIGN1cnNvcjogZGVmYXVsdFxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkXHJcbiAgICAgIGN1cnNvcjogbm90LWFsbG93ZWRcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgIHN2Zy5pY29uLXJlbW92ZVxyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGVcclxuICAgICAgYmFja2dyb3VuZDogd2hpdGVcclxuICAgICAgYm9yZGVyLXJhZGl1czogNTAlXHJcbiAgICAgIGJveC1zaGFkb3c6IC0ycHggMnB4IDZweCByZ2JhKDAsIDAsIDAsIDAuNylcclxuICAgICAgei1pbmRleDogMTBcclxuICAgICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHdoaXRlXHJcblxyXG48L3N0eWxlPlxyXG4iLCJpbXBvcnQgY3JvcHBlciBmcm9tICcuL2Nyb3BwZXIudnVlJ1xyXG5cclxuY29uc3QgVnVlQ3JvcHBhID0ge1xyXG4gIGluc3RhbGw6IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcclxuICAgIFZ1ZS5jb21wb25lbnQoJ2Nyb3BwYScsIGNyb3BwZXIpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsicG9pbnQiLCJ2bSIsImNhbnZhcyIsInF1YWxpdHkiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImNsaWVudFkiLCJsZWZ0IiwidG9wIiwiZXZ0IiwicG9pbnRlciIsInRvdWNoZXMiLCJvbmVQb2ludENvb3JkIiwicG9pbnRlcjEiLCJwb2ludGVyMiIsImNvb3JkMSIsImNvb3JkMiIsIk1hdGgiLCJzcXJ0IiwicG93IiwieCIsInkiLCJpbWciLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJmbG9vciIsIk9iamVjdCIsInZhbCIsIlN0cmluZyIsIkJvb2xlYW4iLCJJTklUX0VWRU5UIiwiRklMRV9DSE9PU0VfRVZFTlQiLCJGSUxFX1NJWkVfRVhDRUVEX0VWRU5UIiwiSU1BR0VfUkVNT1ZFIiwiTU9WRV9FVkVOVCIsIlpPT01fRVZFTlQiLCJJTklUSUFMX0lNQUdFX0xPQUQiLCJJTklUSUFMX0lNQUdFX0VSUk9SIiwicmVuZGVyIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsInBsYWNlaG9sZGVyRm9udFNpemUiLCJpbml0IiwiaW5zdGFuY2UiLCIkcmVmcyIsInJlYWxXaWR0aCIsInJlYWxIZWlnaHQiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImNhbnZhc0NvbG9yIiwiY3R4IiwiZ2V0Q29udGV4dCIsIiRzbG90cyIsImluaXRpYWwiLCJzZXRJbml0aWFsIiwidW5zZXQiLCIkZW1pdCIsImZpbGVJbnB1dCIsImZpbGVzIiwiYW1vdW50IiwibW92ZSIsInpvb20iLCIkbmV4dFRpY2siLCJjaG9vc2VGaWxlIiwiZ2VuZXJhdGVEYXRhVXJsIiwiZ2VuZXJhdGVCbG9iIiwicHJvbWlzZWRCbG9iIiwiY2xlYXJSZWN0IiwicGFpbnRCYWNrZ3JvdW5kIiwidGV4dEJhc2VsaW5lIiwidGV4dEFsaWduIiwiZGVmYXVsdEZvbnRTaXplIiwicGxhY2Vob2xkZXIiLCJsZW5ndGgiLCJmb250U2l6ZSIsInJlYWxQbGFjZWhvbGRlckZvbnRTaXplIiwiZm9udCIsImZpbGxTdHlsZSIsInBsYWNlaG9sZGVyQ29sb3IiLCJmaWxsVGV4dCIsImhhZEltYWdlIiwiaW1nRGF0YSIsInZOb2RlIiwidGFnIiwiZWxtIiwic3JjIiwidSIsImltYWdlTG9hZGVkIiwiaW1nQ29udGVudEluaXQiLCJvbmxvYWQiLCJvbmVycm9yIiwiZGlzYWJsZUNsaWNrVG9DaG9vc2UiLCJjbGljayIsImlucHV0IiwiZmlsZSIsIm9uTmV3RmlsZUluIiwiZmlsZVNpemVJc1ZhbGlkIiwiRXJyb3IiLCJmaWxlU2l6ZUxpbWl0IiwiZnIiLCJGaWxlUmVhZGVyIiwiZSIsImZpbGVEYXRhIiwidGFyZ2V0IiwicmVzdWx0IiwiSW1hZ2UiLCJyZWFkQXNEYXRhVVJMIiwic2l6ZSIsInN0YXJ0WCIsInN0YXJ0WSIsImltZ1dpZHRoIiwiaW1nSGVpZ2h0IiwibmF0dXJhbEhlaWdodCIsImltZ1JhdGlvIiwiY2FudmFzUmF0aW8iLCJyYXRpbyIsImRyYXciLCJkaXNhYmxlZCIsInRhYlN0YXJ0IiwiRGF0ZSIsInZhbHVlT2YiLCJ3aGljaCIsImRyYWdnaW5nIiwicGluY2hpbmciLCJjb29yZCIsImdldFBvaW50ZXJDb29yZHMiLCJsYXN0TW92aW5nQ29vcmQiLCJwaW5jaERpc3RhbmNlIiwiZ2V0UGluY2hEaXN0YW5jZSIsInBpbmNoQ2VudGVyIiwiZ2V0UGluY2hDZW50ZXJDb29yZCIsImRvY3VtZW50IiwiY2FuY2VsRXZlbnRzIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZVBvaW50ZXJFbmQiLCJ0YWJFbmQiLCJkaXNhYmxlRHJhZ1RvTW92ZSIsImRpc3RhbmNlIiwiZGVsdGEiLCJkaXNhYmxlU2Nyb2xsVG9ab29tIiwid2hlZWxEZWx0YSIsImRlbHRhWSIsImRldGFpbCIsInJldmVyc2Vab29taW5nR2VzdHVyZSIsImRpc2FibGVEcmFnQW5kRHJvcCIsImZpbGVEcmFnZ2VkT3ZlciIsImxvZyIsImRhdGFUcmFuc2ZlciIsIm9mZnNldCIsInByZXZlbnRXaGl0ZVNwYWNlIiwicHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSIsInpvb21JbiIsInBvcyIsInRpbWVzRmFzdGVyIiwic3BlZWQiLCJ6b29tU3BlZWQiLCJvZmZzZXRYIiwib2Zmc2V0WSIsIl94IiwiZmlsbFJlY3QiLCJkcmF3SW1hZ2UiLCJ0eXBlIiwidG9EYXRhVVJMIiwiY2FsbGJhY2siLCJtaW1lVHlwZSIsInF1YWxpdHlBcmd1bWVudCIsInRvQmxvYiIsImFyZ3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImJsb2IiLCJlcnIiLCJWdWVDcm9wcGEiLCJWdWUiLCJvcHRpb25zIiwiY29tcG9uZW50IiwiY3JvcHBlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxRQUFlO2VBQUEseUJBQ0NB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
=======
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi9zcmMvY3JvcHBlci52dWUiLCIuLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgb25lUG9pbnRDb29yZChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyhldnQsIHZtKSB7XHJcbiAgICBsZXQgcG9pbnRlciA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnRcclxuICAgIHJldHVybiB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlciwgdm0pXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hEaXN0YW5jZShldnQsIHZtKSB7XHJcbiAgICBsZXQgcG9pbnRlcjEgPSBldnQudG91Y2hlc1swXVxyXG4gICAgbGV0IHBvaW50ZXIyID0gZXZ0LnRvdWNoZXNbMV1cclxuICAgIGxldCBjb29yZDEgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjEsIHZtKVxyXG4gICAgbGV0IGNvb3JkMiA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMiwgdm0pXHJcblxyXG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhjb29yZDEueCAtIGNvb3JkMi54LCAyKSArIE1hdGgucG93KGNvb3JkMS55IC0gY29vcmQyLnksIDIpKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoQ2VudGVyQ29vcmQoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZChpbWcpIHtcclxuICAgIHJldHVybiBpbWcuY29tcGxldGUgJiYgaW1nLm5hdHVyYWxXaWR0aCAhPT0gMFxyXG4gIH0sXHJcblxyXG4gIHRvdWNoRGV0ZWN0KCkge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiBvbkZpcnN0VG91Y2goKSB7XHJcbiAgICAgIHdpbmRvdy5VU0VSX0lTX1RPVUNISU5HID0gdHJ1ZVxyXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uRmlyc3RUb3VjaCwgZmFsc2UpXHJcbiAgICB9LCBmYWxzZSlcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCgpIHtcclxuICAgIC8vIHJBRiBwb2x5ZmlsbFxyXG4gICAgdmFyIGxhc3RUaW1lID0gMFxyXG4gICAgdmFyIHZlbmRvcnMgPSBbJ3dlYmtpdCcsICdtb3onXVxyXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXVxyXG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8ICAgIC8vIFdlYmtpdOS4reatpOWPlua2iOaWueazleeahOWQjeWtl+WPmOS6hlxyXG4gICAgICAgIHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxyXG4gICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYuNyAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSlcclxuICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2YXIgYXJnID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgICBjYWxsYmFjayhhcmcpXHJcbiAgICAgICAgfSwgdGltZVRvQ2FsbClcclxuICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbFxyXG4gICAgICAgIHJldHVybiBpZFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSkge1xyXG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQoaWQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBBcnJheS5pc0FycmF5ID0gZnVuY3Rpb24gKGFyZykge1xyXG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykgPT09ICdbb2JqZWN0IEFycmF5XSdcclxuICAgIH1cclxuICB9XHJcbn0iLCJOdW1iZXIuaXNJbnRlZ2VyID0gTnVtYmVyLmlzSW50ZWdlciB8fCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB2YWx1ZTogT2JqZWN0LFxyXG4gIHdpZHRoOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGhlaWdodDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMjAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBwbGFjZWhvbGRlcjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ0Nob29zZSBhbiBpbWFnZSdcclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjNjA2MDYwJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJGb250U2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGNhbnZhc0NvbG9yOiB7XHJcbiAgICBkZWZhdWx0OiAnI2U2ZTZlNidcclxuICB9LFxyXG4gIHF1YWxpdHk6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIodmFsKSAmJiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICB6b29tU3BlZWQ6IHtcclxuICAgIGRlZmF1bHQ6IDMsXHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGFjY2VwdDoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ2ltYWdlLyonXHJcbiAgfSxcclxuICBmaWxlU2l6ZUxpbWl0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZGlzYWJsZWQ6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZURyYWdBbmREcm9wOiBCb29sZWFuLFxyXG4gIGRpc2FibGVDbGlja1RvQ2hvb3NlOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnVG9Nb3ZlOiBCb29sZWFuLFxyXG4gIGRpc2FibGVTY3JvbGxUb1pvb206IEJvb2xlYW4sXHJcbiAgZGlzYWJsZVBpbmNoVG9ab29tOiBCb29sZWFuLFxyXG4gIHJldmVyc2Vab29taW5nR2VzdHVyZTogQm9vbGVhbiwgLy8gZGVwcmVjYXRlZFxyXG4gIHJldmVyc2VTY3JvbGxUb1pvb206IEJvb2xlYW4sXHJcbiAgcHJldmVudFdoaXRlU3BhY2U6IEJvb2xlYW4sXHJcbiAgc2hvd1JlbW92ZUJ1dHRvbjoge1xyXG4gICAgdHlwZTogQm9vbGVhbixcclxuICAgIGRlZmF1bHQ6IHRydWVcclxuICB9LFxyXG4gIHJlbW92ZUJ1dHRvbkNvbG9yOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAncmVkJ1xyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uU2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyXHJcbiAgfVxyXG59IiwiPHRlbXBsYXRlPlxyXG4gIDxkaXYgOmNsYXNzPVwiYGNyb3BwYS1jb250YWluZXIgJHtpbWcgPyAnY3JvcHBhLS1oYXMtdGFyZ2V0JyA6ICcnfSAke2Rpc2FibGVkID8gJ2Nyb3BwYS0tZGlzYWJsZWQnIDogJyd9ICR7ZGlzYWJsZUNsaWNrVG9DaG9vc2UgPyAnY3JvcHBhLS1kaXNhYmxlZC1jYycgOiAnJ30gJHtkaXNhYmxlRHJhZ1RvTW92ZSAmJiBkaXNhYmxlU2Nyb2xsVG9ab29tID8gJ2Nyb3BwYS0tZGlzYWJsZWQtbXonIDogJyd9ICR7ZmlsZURyYWdnZWRPdmVyID8gJ2Nyb3BwYS0tZHJvcHpvbmUnIDogJyd9YFwiXHJcbiAgICAgICBAZHJhZ2VudGVyLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdFbnRlclwiXHJcbiAgICAgICBAZHJhZ2xlYXZlLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdMZWF2ZVwiXHJcbiAgICAgICBAZHJhZ292ZXIuc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJhZ092ZXJcIlxyXG4gICAgICAgQGRyb3Auc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJvcFwiPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCJcclxuICAgICAgICAgICA6YWNjZXB0PVwiYWNjZXB0XCJcclxuICAgICAgICAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXHJcbiAgICAgICAgICAgcmVmPVwiZmlsZUlucHV0XCJcclxuICAgICAgICAgICBoaWRkZW5cclxuICAgICAgICAgICBAY2hhbmdlPVwiaGFuZGxlSW5wdXRDaGFuZ2VcIiAvPlxyXG4gICAgPGRpdiBjbGFzcz1cImluaXRpYWxcIlxyXG4gICAgICAgICBzdHlsZT1cIndpZHRoOiAwOyBoZWlnaHQ6IDA7IHZpc2liaWxpdHk6IGhpZGRlbjtcIj5cclxuICAgICAgPHNsb3QgbmFtZT1cImluaXRpYWxcIj48L3Nsb3Q+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCJcclxuICAgICAgICAgICAgQGNsaWNrLnN0b3AucHJldmVudD1cImhhbmRsZUNsaWNrXCJcclxuICAgICAgICAgICAgQHRvdWNoc3RhcnQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQG1vdXNlZG93bi5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcnN0YXJ0LnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEB0b3VjaGVuZC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNoY2FuY2VsLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAbW91c2V1cC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJlbmQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyY2FuY2VsLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAdG91Y2htb3ZlLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQG1vdXNlbW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBwb2ludGVybW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBET01Nb3VzZVNjcm9sbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVXaGVlbFwiXHJcbiAgICAgICAgICAgIEB3aGVlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVXaGVlbFwiXHJcbiAgICAgICAgICAgIEBtb3VzZXdoZWVsLnN0b3AucHJldmVudD1cImhhbmRsZVdoZWVsXCI+PC9jYW52YXM+XHJcbiAgICA8c3ZnIGNsYXNzPVwiaWNvbiBpY29uLXJlbW92ZVwiXHJcbiAgICAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZ1wiXHJcbiAgICAgICAgIEBjbGljaz1cInVuc2V0XCJcclxuICAgICAgICAgOnN0eWxlPVwiYHRvcDogLSR7aGVpZ2h0LzQwfXB4OyByaWdodDogLSR7d2lkdGgvNDB9cHhgXCJcclxuICAgICAgICAgdmlld0JveD1cIjAgMCAxMDI0IDEwMjRcIlxyXG4gICAgICAgICB2ZXJzaW9uPVwiMS4xXCJcclxuICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcbiAgICAgICAgIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiXHJcbiAgICAgICAgIDp3aWR0aD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIlxyXG4gICAgICAgICA6aGVpZ2h0PVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aC8xMFwiPlxyXG4gICAgICA8cGF0aCBkPVwiTTUxMS45MjEyMzEgMEMyMjkuMTc5MDc3IDAgMCAyMjkuMjU3ODQ2IDAgNTEyIDAgNzk0LjcwMjc2OSAyMjkuMTc5MDc3IDEwMjQgNTExLjkyMTIzMSAxMDI0IDc5NC43ODE1MzggMTAyNCAxMDI0IDc5NC43MDI3NjkgMTAyNCA1MTIgMTAyNCAyMjkuMjU3ODQ2IDc5NC43ODE1MzggMCA1MTEuOTIxMjMxIDBaTTczMi4wNDE4NDYgNjUwLjYzMzg0NiA2NTAuNTE1NjkyIDczMi4wODEyMzFDNjUwLjUxNTY5MiA3MzIuMDgxMjMxIDUyMS40OTE2OTIgNTkzLjY4MzY5MiA1MTEuODgxODQ2IDU5My42ODM2OTIgNTAyLjQyOTUzOCA1OTMuNjgzNjkyIDM3My4zNjYxNTQgNzMyLjA4MTIzMSAzNzMuMzY2MTU0IDczMi4wODEyMzFMMjkxLjc2MTIzMSA2NTAuNjMzODQ2QzI5MS43NjEyMzEgNjUwLjYzMzg0NiA0MzAuMzE2MzA4IDUyMy41MDAzMDggNDMwLjMxNjMwOCA1MTIuMTk2OTIzIDQzMC4zMTYzMDggNTAwLjY5NjYxNSAyOTEuNzYxMjMxIDM3My41MjM2OTIgMjkxLjc2MTIzMSAzNzMuNTIzNjkyTDM3My4zNjYxNTQgMjkxLjkxODc2OUMzNzMuMzY2MTU0IDI5MS45MTg3NjkgNTAzLjQ1MzUzOCA0MzAuMzk1MDc3IDUxMS44ODE4NDYgNDMwLjM5NTA3NyA1MjAuMzQ5NTM4IDQzMC4zOTUwNzcgNjUwLjUxNTY5MiAyOTEuOTE4NzY5IDY1MC41MTU2OTIgMjkxLjkxODc2OUw3MzIuMDQxODQ2IDM3My41MjM2OTJDNzMyLjA0MTg0NiAzNzMuNTIzNjkyIDU5My40NDczODUgNTAyLjU0NzY5MiA1OTMuNDQ3Mzg1IDUxMi4xOTY5MjMgNTkzLjQ0NzM4NSA1MjEuNDEyOTIzIDczMi4wNDE4NDYgNjUwLjYzMzg0NiA3MzIuMDQxODQ2IDY1MC42MzM4NDZaXCJcclxuICAgICAgICAgICAgOmZpbGw9XCJyZW1vdmVCdXR0b25Db2xvclwiPjwvcGF0aD5cclxuICAgIDwvc3ZnPlxyXG4gIDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHNjcmlwdD5cclxuICBpbXBvcnQgdSBmcm9tICcuL3V0aWwnXHJcbiAgaW1wb3J0IHByb3BzIGZyb20gJy4vcHJvcHMnXHJcblxyXG4gIGNvbnN0IElOSVRfRVZFTlQgPSAnaW5pdCdcclxuICBjb25zdCBGSUxFX0NIT09TRV9FVkVOVCA9ICdmaWxlLWNob29zZSdcclxuICBjb25zdCBGSUxFX1NJWkVfRVhDRUVEX0VWRU5UID0gJ2ZpbGUtc2l6ZS1leGNlZWQnXHJcbiAgY29uc3QgSU1BR0VfUkVNT1ZFID0gJ2ltYWdlLXJlbW92ZSdcclxuICBjb25zdCBNT1ZFX0VWRU5UID0gJ21vdmUnXHJcbiAgY29uc3QgWk9PTV9FVkVOVCA9ICd6b29tJ1xyXG4gIGNvbnN0IElOSVRJQUxfSU1BR0VfTE9BRCA9ICdpbml0aWFsLWltYWdlLWxvYWQnXHJcbiAgY29uc3QgSU5JVElBTF9JTUFHRV9FUlJPUiA9ICdpbml0aWFsLWltYWdlLWVycm9yJ1xyXG5cclxuICB1LnJBRlBvbHlmaWxsKClcclxuICB1LnRvdWNoRGV0ZWN0KClcclxuXHJcbiAgZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgbW9kZWw6IHtcclxuICAgICAgcHJvcDogJ3ZhbHVlJyxcclxuICAgICAgZXZlbnQ6ICdpbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBwcm9wczogcHJvcHMsXHJcblxyXG4gICAgZGF0YSAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXHJcbiAgICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICAgIGN0eDogbnVsbCxcclxuICAgICAgICBpbWc6IG51bGwsXHJcbiAgICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICAgIGxhc3RNb3ZpbmdDb29yZDogbnVsbCxcclxuICAgICAgICBpbWdEYXRhOiB7fSxcclxuICAgICAgICBkYXRhVXJsOiAnJyxcclxuICAgICAgICBmaWxlRHJhZ2dlZE92ZXI6IGZhbHNlLFxyXG4gICAgICAgIHRhYlN0YXJ0OiAwLFxyXG4gICAgICAgIHBpbmNoaW5nOiBmYWxzZSxcclxuICAgICAgICBwaW5jaERpc3RhbmNlOiAwXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgcmVhbFdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVhbEhlaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0ICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJGb250U2l6ZSAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdW50ZWQgKCkge1xyXG4gICAgICB0aGlzLmluaXQoKVxyXG4gICAgfSxcclxuXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSB2YWxcclxuICAgICAgfSxcclxuICAgICAgcmVhbFdpZHRoOiAnaW5pdCcsXHJcbiAgICAgIHJlYWxIZWlnaHQ6ICdpbml0JyxcclxuICAgICAgY2FudmFzQ29sb3I6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXI6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogJ2luaXQnLFxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZTogJ2luaXQnLFxyXG4gICAgICBwcmV2ZW50V2hpdGVTcGFjZTogJ2ltZ0NvbnRlbnRJbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgIGluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kcmVmcy5jYW52YXNcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAnI2U2ZTZlNicgOiAodHlwZW9mIHRoaXMuY2FudmFzQ29sb3IgPT09ICdzdHJpbmcnID8gdGhpcy5jYW52YXNDb2xvciA6ICcnKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIGlmICh0aGlzLiRzbG90cy5pbml0aWFsICYmIHRoaXMuJHNsb3RzLmluaXRpYWxbMF0pIHtcclxuICAgICAgICAgIHRoaXMuc2V0SW5pdGlhbCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMudW5zZXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRlbWl0KElOSVRfRVZFTlQsIHtcclxuICAgICAgICAgIGdldENhbnZhczogKCkgPT4gdGhpcy5jYW52YXMsXHJcbiAgICAgICAgICBnZXRDb250ZXh0OiAoKSA9PiB0aGlzLmN0eCxcclxuICAgICAgICAgIGdldENob3NlbkZpbGU6ICgpID0+IHRoaXMuJHJlZnMuZmlsZUlucHV0LmZpbGVzWzBdLFxyXG4gICAgICAgICAgZ2V0QWN0dWFsSW1hZ2VTaXplOiAoKSA9PiAoe1xyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5yZWFsV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIG1vdmVVcHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlRG93bndhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IGFtb3VudCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVMZWZ0d2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVSaWdodHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21JbjogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnpvb20odHJ1ZSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB6b29tT3V0OiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuem9vbShmYWxzZSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICByZWZyZXNoOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuaW5pdClcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICByZXNldDogdGhpcy51bnNldCxcclxuICAgICAgICAgIGNob29zZUZpbGU6IHRoaXMuY2hvb3NlRmlsZSxcclxuICAgICAgICAgIGdlbmVyYXRlRGF0YVVybDogdGhpcy5nZW5lcmF0ZURhdGFVcmwsXHJcbiAgICAgICAgICBnZW5lcmF0ZUJsb2I6IHRoaXMuZ2VuZXJhdGVCbG9iLFxyXG4gICAgICAgICAgcHJvbWlzZWRCbG9iOiB0aGlzLnByb21pc2VkQmxvYlxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB1bnNldCAoKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgdGhpcy5wYWludEJhY2tncm91bmQoKVxyXG4gICAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJ1xyXG4gICAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJ1xyXG4gICAgICAgIGxldCBkZWZhdWx0Rm9udFNpemUgPSB0aGlzLnJlYWxXaWR0aCAvIDEuNSAvIHRoaXMucGxhY2Vob2xkZXIubGVuZ3RoXHJcbiAgICAgICAgbGV0IGZvbnRTaXplID0gKCF0aGlzLnJlYWxQbGFjZWhvbGRlckZvbnRTaXplIHx8IHRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemUgPT0gMCkgPyBkZWZhdWx0Rm9udFNpemUgOiB0aGlzLnJlYWxQbGFjZWhvbGRlckZvbnRTaXplXHJcbiAgICAgICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCBzYW5zLXNlcmlmJ1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAoIXRoaXMucGxhY2Vob2xkZXJDb2xvciB8fCB0aGlzLnBsYWNlaG9sZGVyQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjNjA2MDYwJyA6IHRoaXMucGxhY2Vob2xkZXJDb2xvclxyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0aGlzLnBsYWNlaG9sZGVyLCB0aGlzLnJlYWxXaWR0aCAvIDIsIHRoaXMucmVhbEhlaWdodCAvIDIpXHJcblxyXG4gICAgICAgIGxldCBoYWRJbWFnZSA9IHRoaXMuaW1nICE9IG51bGxcclxuICAgICAgICB0aGlzLmltZyA9IG51bGxcclxuICAgICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC52YWx1ZSA9ICcnXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhID0ge31cclxuXHJcbiAgICAgICAgaWYgKGhhZEltYWdlKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KElNQUdFX1JFTU9WRSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzZXRJbml0aWFsICgpIHtcclxuICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5pbml0aWFsWzBdXHJcbiAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXHJcbiAgICAgICAgaWYgKHRhZyAhPT0gJ2ltZycgfHwgIWVsbSB8fCAhZWxtLnNyYykge1xyXG4gICAgICAgICAgdGhpcy51bnNldCgpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHUuaW1hZ2VMb2FkZWQoZWxtKSkge1xyXG4gICAgICAgICAgdGhpcy5pbWcgPSBlbG1cclxuICAgICAgICAgIHRoaXMuaW1nQ29udGVudEluaXQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBlbG0ub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRlbWl0KElOSVRJQUxfSU1BR0VfTE9BRClcclxuICAgICAgICAgICAgdGhpcy5pbWcgPSBlbG1cclxuICAgICAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZWxtLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoSU5JVElBTF9JTUFHRV9FUlJPUilcclxuICAgICAgICAgICAgdGhpcy51bnNldCgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgY2hvb3NlRmlsZSAoKSB7XHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQuY2xpY2soKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlQ2xpY2sgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UgJiYgIXRoaXMuZGlzYWJsZWQgJiYgd2luZG93LlVTRVJfSVNfVE9VQ0hJTkcpIHtcclxuICAgICAgICAgIHRoaXMuY2hvb3NlRmlsZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlSW5wdXRDaGFuZ2UgKCkge1xyXG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMuZmlsZUlucHV0XHJcbiAgICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGgpIHJldHVyblxyXG5cclxuICAgICAgICBsZXQgZmlsZSA9IGlucHV0LmZpbGVzWzBdXHJcbiAgICAgICAgdGhpcy5vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgb25OZXdGaWxlSW4gKGZpbGUpIHtcclxuICAgICAgICB0aGlzLiRlbWl0KEZJTEVfQ0hPT1NFX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBzaXplIGV4Y2VlZHMgbGltaXQgd2hpY2ggaXMgJyArIHRoaXMuZmlsZVNpemVMaW1pdCArICcgYnl0ZXMuJylcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgICAgIGZyLm9ubG9hZCA9IChlKSA9PiB7XHJcbiAgICAgICAgICBsZXQgZmlsZURhdGEgPSBlLnRhcmdldC5yZXN1bHRcclxuICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgICAgaW1nLnNyYyA9IGZpbGVEYXRhXHJcbiAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmltZyA9IGltZ1xyXG4gICAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmlsZVNpemVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2VcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVNpemVMaW1pdCB8fCB0aGlzLmZpbGVTaXplTGltaXQgPT0gMCkgcmV0dXJuIHRydWVcclxuXHJcbiAgICAgICAgcmV0dXJuIGZpbGUuc2l6ZSA8IHRoaXMuZmlsZVNpemVMaW1pdFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaW1nQ29udGVudEluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLmltZy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIGxldCBpbWdSYXRpbyA9IGltZ0hlaWdodCAvIGltZ1dpZHRoXHJcbiAgICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5yZWFsSGVpZ2h0IC8gdGhpcy5yZWFsV2lkdGhcclxuXHJcbiAgICAgICAgLy8gZGlzcGxheSBhcyBmaXRcclxuICAgICAgICBpZiAoaW1nUmF0aW8gPCBjYW52YXNSYXRpbykge1xyXG4gICAgICAgICAgbGV0IHJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCByYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyByYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJTdGFydCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICAgIC8vIHNpbXVsYXRlIGNsaWNrIHdpdGggdG91Y2ggb24gbW9iaWxlIGRldmljZXNcclxuICAgICAgICBpZiAoIXRoaXMuaW1nICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSB7XHJcbiAgICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gbmV3IERhdGUoKS52YWx1ZU9mKClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZ25vcmUgbW91c2UgcmlnaHQgY2xpY2sgYW5kIG1pZGRsZSBjbGlja1xyXG4gICAgICAgIGlmIChldnQud2hpY2ggJiYgZXZ0LndoaWNoID4gMSkgcmV0dXJuXHJcblxyXG4gICAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxyXG4gICAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXHJcbiAgICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5kaXNhYmxlUGluY2hUb1pvb20pIHtcclxuICAgICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgdGhpcy5waW5jaGluZyA9IHRydWVcclxuICAgICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZG9jdW1lbnQpIHtcclxuICAgICAgICAgIGxldCBjYW5jZWxFdmVudHMgPSBbJ21vdXNldXAnLCAndG91Y2hlbmQnLCAndG91Y2hjYW5jZWwnLCAncG9pbnRlcmVuZCcsICdwb2ludGVyY2FuY2VsJ11cclxuICAgICAgICAgIGZvciAobGV0IGUgb2YgY2FuY2VsRXZlbnRzKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZSwgdGhpcy5oYW5kbGVQb2ludGVyRW5kKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJFbmQgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICBpZiAoIXRoaXMuaW1nICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSB7XHJcbiAgICAgICAgICBsZXQgdGFiRW5kID0gbmV3IERhdGUoKS52YWx1ZU9mKClcclxuICAgICAgICAgIGlmICh0YWJFbmQgLSB0aGlzLnRhYlN0YXJ0IDwgMTAwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNob29zZUZpbGUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy50YWJTdGFydCA9IDBcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gMFxyXG4gICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gbnVsbFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlck1vdmUgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdUb01vdmUgfHwgIXRoaXMuaW1nKSByZXR1cm5cclxuXHJcbiAgICAgICAgaWYgKCFldnQudG91Y2hlcyB8fCBldnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5kcmFnZ2luZykgcmV0dXJuXHJcbiAgICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgaWYgKHRoaXMubGFzdE1vdmluZ0Nvb3JkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7XHJcbiAgICAgICAgICAgICAgeDogY29vcmQueCAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLngsXHJcbiAgICAgICAgICAgICAgeTogY29vcmQueSAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLnlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMucGluY2hpbmcpIHJldHVyblxyXG4gICAgICAgICAgbGV0IGRpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcclxuICAgICAgICAgIGxldCBkZWx0YSA9IGRpc3RhbmNlIC0gdGhpcy5waW5jaERpc3RhbmNlXHJcbiAgICAgICAgICB0aGlzLnpvb20oZGVsdGEgPiAwLCBudWxsLCAyKVxyXG4gICAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gZGlzdGFuY2VcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVXaGVlbCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlU2Nyb2xsVG9ab29tIHx8ICF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICBpZiAoZXZ0LndoZWVsRGVsdGEgPCAwIHx8IGV2dC5kZWx0YVkgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlWm9vbWluZ0dlc3R1cmUgfHwgdGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tLCBjb29yZClcclxuICAgICAgICB9IGVsc2UgaWYgKGV2dC53aGVlbERlbHRhID4gMCB8fCBldnQuZGVsdGFZIDwgMCB8fCBldnQuZGV0YWlsIDwgMCkge1xyXG4gICAgICAgICAgdGhpcy56b29tKCF0aGlzLnJldmVyc2Vab29taW5nR2VzdHVyZSAmJiAhdGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tLCBjb29yZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcmFnRW50ZXIgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdBbmREcm9wIHx8IHRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IHRydWVcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyYWdMZWF2ZSAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ0FuZERyb3AgfHwgdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyYWdPdmVyIChldnQpIHtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyb3AgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdBbmREcm9wIHx8IHRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBpZiAoIWV2dC5kYXRhVHJhbnNmZXIgfHwgIWV2dC5kYXRhVHJhbnNmZXIuZmlsZXMubGVuZ3RoKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcbiAgICAgICAgbGV0IGZpbGUgPSBldnQuZGF0YVRyYW5zZmVyLmZpbGVzWzBdXHJcbiAgICAgICAgdGhpcy5vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbW92ZSAob2Zmc2V0KSB7XHJcbiAgICAgICAgaWYgKCFvZmZzZXQpIHJldHVyblxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggKz0gb2Zmc2V0LnhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZICs9IG9mZnNldC55XHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIHRoaXMucHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuJGVtaXQoTU9WRV9FVkVOVClcclxuICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFggPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WSA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlYWxXaWR0aCAtIHRoaXMuaW1nRGF0YS5zdGFydFggPiB0aGlzLmltZ0RhdGEud2lkdGgpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWFsSGVpZ2h0IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSA+IHRoaXMuaW1nRGF0YS5oZWlnaHQpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgem9vbSAoem9vbUluLCBwb3MsIHRpbWVzRmFzdGVyID0gMSkge1xyXG4gICAgICAgIHBvcyA9IHBvcyB8fCB7XHJcbiAgICAgICAgICB4OiB0aGlzLmltZ0RhdGEuc3RhcnRYICsgdGhpcy5pbWdEYXRhLndpZHRoIC8gMixcclxuICAgICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgc3BlZWQgPSAodGhpcy5yZWFsV2lkdGggLyAxMDAwMDApICogdGhpcy56b29tU3BlZWQgKiB0aW1lc0Zhc3RlclxyXG4gICAgICAgIGxldCB4ID0gMVxyXG4gICAgICAgIGlmICh6b29tSW4pIHtcclxuICAgICAgICAgIHggPSAxICsgc3BlZWRcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA+IDIwKSB7XHJcbiAgICAgICAgICB4ID0gMSAtIHNwZWVkXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMuaW1nRGF0YS53aWR0aCAqIHhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5pbWdEYXRhLmhlaWdodCAqIHhcclxuICAgICAgICBsZXQgb2Zmc2V0WCA9ICh4IC0gMSkgKiAocG9zLnggLSB0aGlzLmltZ0RhdGEuc3RhcnRYKVxyXG4gICAgICAgIGxldCBvZmZzZXRZID0gKHggLSAxKSAqIChwb3MueSAtIHRoaXMuaW1nRGF0YS5zdGFydFkpXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHRoaXMuaW1nRGF0YS5zdGFydFggLSBvZmZzZXRYXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHRoaXMuaW1nRGF0YS5zdGFydFkgLSBvZmZzZXRZXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLndpZHRoIDwgdGhpcy5yZWFsV2lkdGgpIHtcclxuICAgICAgICAgICAgbGV0IF94ID0gdGhpcy5yZWFsV2lkdGggLyB0aGlzLmltZ0RhdGEud2lkdGhcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHQgKiBfeFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh0aGlzLmltZ0RhdGEuaGVpZ2h0IDwgdGhpcy5yZWFsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMucmVhbEhlaWdodCAvIHRoaXMuaW1nRGF0YS5oZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGggKiBfeFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4kZW1pdChaT09NX0VWRU5UKVxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwYWludEJhY2tncm91bmQgKCkge1xyXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJyNlNmU2ZTYnIDogdGhpcy5jYW52YXNDb2xvclxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvclxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMucmVhbFdpZHRoLCB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBkcmF3ICgpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5pbWdEYXRhXHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMucGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZURhdGFVcmwgKHR5cGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4gJydcclxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXMudG9EYXRhVVJMKHR5cGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuIG51bGxcclxuICAgICAgICB0aGlzLmNhbnZhcy50b0Jsb2IoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcm9taXNlZEJsb2IgKC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUJsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICAgICAgICByZXNvbHZlKGJsb2IpXHJcbiAgICAgICAgICAgIH0sIGFyZ3MpXHJcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycilcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZSBsYW5nPVwic3R5bHVzXCI+XHJcbiAgLmNyb3BwYS1jb250YWluZXIgXHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2tcclxuICAgIGN1cnNvcjogcG9pbnRlclxyXG4gICAgdHJhbnNpdGlvbjogYWxsIC4zc1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlXHJcbiAgICBmb250LXNpemU6IDBcclxuICAgIGNhbnZhc1xyXG4gICAgICB0cmFuc2l0aW9uOiBhbGwgLjNzXHJcbiAgICAmOmhvdmVyXHJcbiAgICAgIG9wYWNpdHk6IC43XHJcbiAgICAmLmNyb3BwYS0tZHJvcHpvbmVcclxuICAgICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDEwcHggbGlnaHRuZXNzKGJsYWNrLCAyMCUpXHJcbiAgICAgIGNhbnZhc1xyXG4gICAgICAgIG9wYWNpdHk6IC41XHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWQtY2MgXHJcbiAgICAgIGN1cnNvcjogZGVmYXVsdFxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgJi5jcm9wcGEtLWhhcy10YXJnZXRcclxuICAgICAgY3Vyc29yOiBtb3ZlXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICYuY3JvcHBhLS1kaXNhYmxlZC1telxyXG4gICAgICAgIGN1cnNvcjogZGVmYXVsdFxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkXHJcbiAgICAgIGN1cnNvcjogbm90LWFsbG93ZWRcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgIHN2Zy5pY29uLXJlbW92ZVxyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGVcclxuICAgICAgYmFja2dyb3VuZDogd2hpdGVcclxuICAgICAgYm9yZGVyLXJhZGl1czogNTAlXHJcbiAgICAgIGJveC1zaGFkb3c6IC0ycHggMnB4IDZweCByZ2JhKDAsIDAsIDAsIDAuNylcclxuICAgICAgei1pbmRleDogMTBcclxuICAgICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHdoaXRlXHJcblxyXG48L3N0eWxlPlxyXG4iLCJpbXBvcnQgY3JvcHBlciBmcm9tICcuL2Nyb3BwZXIudnVlJ1xyXG5cclxuY29uc3QgVnVlQ3JvcHBhID0ge1xyXG4gIGluc3RhbGw6IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcclxuICAgIFZ1ZS5jb21wb25lbnQoJ2Nyb3BwYScsIGNyb3BwZXIpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsicG9pbnQiLCJ2bSIsImNhbnZhcyIsInF1YWxpdHkiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImNsaWVudFkiLCJsZWZ0IiwidG9wIiwiZXZ0IiwicG9pbnRlciIsInRvdWNoZXMiLCJvbmVQb2ludENvb3JkIiwicG9pbnRlcjEiLCJwb2ludGVyMiIsImNvb3JkMSIsImNvb3JkMiIsIk1hdGgiLCJzcXJ0IiwicG93IiwieCIsInkiLCJpbWciLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbkZpcnN0VG91Y2giLCJVU0VSX0lTX1RPVUNISU5HIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImxhc3RUaW1lIiwidmVuZG9ycyIsImxlbmd0aCIsIndpbmRvdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiY2FsbGJhY2siLCJjdXJyVGltZSIsIkRhdGUiLCJnZXRUaW1lIiwidGltZVRvQ2FsbCIsIm1heCIsImlkIiwic2V0VGltZW91dCIsImFyZyIsImlzQXJyYXkiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJ2YWx1ZSIsImlzRmluaXRlIiwiZmxvb3IiLCJ2YWwiLCJTdHJpbmciLCJCb29sZWFuIiwiSU5JVF9FVkVOVCIsIkZJTEVfQ0hPT1NFX0VWRU5UIiwiRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCIsIklNQUdFX1JFTU9WRSIsIk1PVkVfRVZFTlQiLCJaT09NX0VWRU5UIiwiSU5JVElBTF9JTUFHRV9MT0FEIiwiSU5JVElBTF9JTUFHRV9FUlJPUiIsInUiLCJyQUZQb2x5ZmlsbCIsInRvdWNoRGV0ZWN0IiwicmVuZGVyIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsInBsYWNlaG9sZGVyRm9udFNpemUiLCJpbml0IiwiaW5zdGFuY2UiLCIkcmVmcyIsInJlYWxXaWR0aCIsInJlYWxIZWlnaHQiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImNhbnZhc0NvbG9yIiwiY3R4IiwiZ2V0Q29udGV4dCIsIiRzbG90cyIsImluaXRpYWwiLCJzZXRJbml0aWFsIiwidW5zZXQiLCIkZW1pdCIsImZpbGVJbnB1dCIsImZpbGVzIiwiYW1vdW50IiwibW92ZSIsInpvb20iLCIkbmV4dFRpY2siLCJjaG9vc2VGaWxlIiwiZ2VuZXJhdGVEYXRhVXJsIiwiZ2VuZXJhdGVCbG9iIiwicHJvbWlzZWRCbG9iIiwicGFpbnRCYWNrZ3JvdW5kIiwidGV4dEJhc2VsaW5lIiwidGV4dEFsaWduIiwiZGVmYXVsdEZvbnRTaXplIiwicGxhY2Vob2xkZXIiLCJmb250U2l6ZSIsInJlYWxQbGFjZWhvbGRlckZvbnRTaXplIiwiZm9udCIsImZpbGxTdHlsZSIsInBsYWNlaG9sZGVyQ29sb3IiLCJmaWxsVGV4dCIsImhhZEltYWdlIiwiaW1nRGF0YSIsInZOb2RlIiwidGFnIiwiZWxtIiwic3JjIiwiaW1hZ2VMb2FkZWQiLCJpbWdDb250ZW50SW5pdCIsIm9ubG9hZCIsIm9uZXJyb3IiLCJjbGljayIsImRpc2FibGVDbGlja1RvQ2hvb3NlIiwiZGlzYWJsZWQiLCJpbnB1dCIsImZpbGUiLCJvbk5ld0ZpbGVJbiIsImZpbGVTaXplSXNWYWxpZCIsIkVycm9yIiwiZmlsZVNpemVMaW1pdCIsImZyIiwiRmlsZVJlYWRlciIsImUiLCJmaWxlRGF0YSIsInRhcmdldCIsInJlc3VsdCIsIkltYWdlIiwicmVhZEFzRGF0YVVSTCIsInNpemUiLCJzdGFydFgiLCJzdGFydFkiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsIm5hdHVyYWxIZWlnaHQiLCJpbWdSYXRpbyIsImNhbnZhc1JhdGlvIiwicmF0aW8iLCJkcmF3IiwidGFiU3RhcnQiLCJ2YWx1ZU9mIiwid2hpY2giLCJkcmFnZ2luZyIsInBpbmNoaW5nIiwiY29vcmQiLCJnZXRQb2ludGVyQ29vcmRzIiwibGFzdE1vdmluZ0Nvb3JkIiwiZGlzYWJsZVBpbmNoVG9ab29tIiwicGluY2hEaXN0YW5jZSIsImdldFBpbmNoRGlzdGFuY2UiLCJkb2N1bWVudCIsImNhbmNlbEV2ZW50cyIsImhhbmRsZVBvaW50ZXJFbmQiLCJ0YWJFbmQiLCJkaXNhYmxlRHJhZ1RvTW92ZSIsImRpc3RhbmNlIiwiZGVsdGEiLCJkaXNhYmxlU2Nyb2xsVG9ab29tIiwid2hlZWxEZWx0YSIsImRlbHRhWSIsImRldGFpbCIsInJldmVyc2Vab29taW5nR2VzdHVyZSIsInJldmVyc2VTY3JvbGxUb1pvb20iLCJkaXNhYmxlRHJhZ0FuZERyb3AiLCJmaWxlRHJhZ2dlZE92ZXIiLCJkYXRhVHJhbnNmZXIiLCJvZmZzZXQiLCJwcmV2ZW50V2hpdGVTcGFjZSIsInByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UiLCJ6b29tSW4iLCJwb3MiLCJ0aW1lc0Zhc3RlciIsInNwZWVkIiwiem9vbVNwZWVkIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJfeCIsImZpbGxSZWN0IiwiZHJhd0ltYWdlIiwidHlwZSIsInRvRGF0YVVSTCIsIm1pbWVUeXBlIiwicXVhbGl0eUFyZ3VtZW50IiwidG9CbG9iIiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYmxvYiIsImVyciIsIlZ1ZUNyb3BwYSIsIlZ1ZSIsIm9wdGlvbnMiLCJjb21wb25lbnQiLCJjcm9wcGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLFFBQWU7ZUFBQSx5QkFDQ0EsS0FERCxFQUNRQyxFQURSLEVBQ1k7UUFDakJDLE1BRGlCLEdBQ0dELEVBREgsQ0FDakJDLE1BRGlCO1FBQ1RDLE9BRFMsR0FDR0YsRUFESCxDQUNURSxPQURTOztRQUVuQkMsT0FBT0YsT0FBT0cscUJBQVAsRUFBWDtRQUNJQyxVQUFVTixNQUFNTSxPQUFwQjtRQUNJQyxVQUFVUCxNQUFNTyxPQUFwQjtXQUNPO1NBQ0YsQ0FBQ0QsVUFBVUYsS0FBS0ksSUFBaEIsSUFBd0JMLE9BRHRCO1NBRUYsQ0FBQ0ksVUFBVUgsS0FBS0ssR0FBaEIsSUFBdUJOO0tBRjVCO0dBTlc7a0JBQUEsNEJBWUlPLEdBWkosRUFZU1QsRUFaVCxFQVlhO1FBQ3BCVSxVQUFVRCxJQUFJRSxPQUFKLEdBQWNGLElBQUlFLE9BQUosQ0FBWSxDQUFaLENBQWQsR0FBK0JGLEdBQTdDO1dBQ08sS0FBS0csYUFBTCxDQUFtQkYsT0FBbkIsRUFBNEJWLEVBQTVCLENBQVA7R0FkVztrQkFBQSw0QkFpQklTLEdBakJKLEVBaUJTVCxFQWpCVCxFQWlCYTtRQUNwQmEsV0FBV0osSUFBSUUsT0FBSixDQUFZLENBQVosQ0FBZjtRQUNJRyxXQUFXTCxJQUFJRSxPQUFKLENBQVksQ0FBWixDQUFmO1FBQ0lJLFNBQVMsS0FBS0gsYUFBTCxDQUFtQkMsUUFBbkIsRUFBNkJiLEVBQTdCLENBQWI7UUFDSWdCLFNBQVMsS0FBS0osYUFBTCxDQUFtQkUsUUFBbkIsRUFBNkJkLEVBQTdCLENBQWI7O1dBRU9pQixLQUFLQyxJQUFMLENBQVVELEtBQUtFLEdBQUwsQ0FBU0osT0FBT0ssQ0FBUCxHQUFXSixPQUFPSSxDQUEzQixFQUE4QixDQUE5QixJQUFtQ0gsS0FBS0UsR0FBTCxDQUFTSixPQUFPTSxDQUFQLEdBQVdMLE9BQU9LLENBQTNCLEVBQThCLENBQTlCLENBQTdDLENBQVA7R0F2Qlc7cUJBQUEsK0JBMEJPWixHQTFCUCxFQTBCWVQsRUExQlosRUEwQmdCO1FBQ3ZCYSxXQUFXSixJQUFJRSxPQUFKLENBQVksQ0FBWixDQUFmO1FBQ0lHLFdBQVdMLElBQUlFLE9BQUosQ0FBWSxDQUFaLENBQWY7UUFDSUksU0FBUyxLQUFLSCxhQUFMLENBQW1CQyxRQUFuQixFQUE2QmIsRUFBN0IsQ0FBYjtRQUNJZ0IsU0FBUyxLQUFLSixhQUFMLENBQW1CRSxRQUFuQixFQUE2QmQsRUFBN0IsQ0FBYjs7V0FFTztTQUNGLENBQUNlLE9BQU9LLENBQVAsR0FBV0osT0FBT0ksQ0FBbkIsSUFBd0IsQ0FEdEI7U0FFRixDQUFDTCxPQUFPTSxDQUFQLEdBQVdMLE9BQU9LLENBQW5CLElBQXdCO0tBRjdCO0dBaENXO2FBQUEsdUJBc0NEQyxHQXRDQyxFQXNDSTtXQUNSQSxJQUFJQyxRQUFKLElBQWdCRCxJQUFJRSxZQUFKLEtBQXFCLENBQTVDO0dBdkNXO2FBQUEseUJBMENDO1dBQ0xDLGdCQUFQLENBQXdCLFlBQXhCLEVBQXNDLFNBQVNDLFlBQVQsR0FBd0I7YUFDckRDLGdCQUFQLEdBQTBCLElBQTFCO2FBQ09DLG1CQUFQLENBQTJCLFlBQTNCLEVBQXlDRixZQUF6QyxFQUF1RCxLQUF2RDtLQUZGLEVBR0csS0FISDtHQTNDVzthQUFBLHlCQWlEQzs7UUFFUkcsV0FBVyxDQUFmO1FBQ0lDLFVBQVUsQ0FBQyxRQUFELEVBQVcsS0FBWCxDQUFkO1NBQ0ssSUFBSVYsSUFBSSxDQUFiLEVBQWdCQSxJQUFJVSxRQUFRQyxNQUFaLElBQXNCLENBQUNDLE9BQU9DLHFCQUE5QyxFQUFxRSxFQUFFYixDQUF2RSxFQUEwRTthQUNqRWEscUJBQVAsR0FBK0JELE9BQU9GLFFBQVFWLENBQVIsSUFBYSx1QkFBcEIsQ0FBL0I7YUFDT2Msb0JBQVAsR0FBOEJGLE9BQU9GLFFBQVFWLENBQVIsSUFBYSxzQkFBcEI7YUFDckJVLFFBQVFWLENBQVIsSUFBYSw2QkFBcEIsQ0FERjs7O1FBSUUsQ0FBQ1ksT0FBT0MscUJBQVosRUFBbUM7YUFDMUJBLHFCQUFQLEdBQStCLFVBQVVFLFFBQVYsRUFBb0I7WUFDN0NDLFdBQVcsSUFBSUMsSUFBSixHQUFXQyxPQUFYLEVBQWY7WUFDSUMsYUFBYXRCLEtBQUt1QixHQUFMLENBQVMsQ0FBVCxFQUFZLFFBQVFKLFdBQVdQLFFBQW5CLENBQVosQ0FBakI7WUFDSVksS0FBS1QsT0FBT1UsVUFBUCxDQUFrQixZQUFZO2NBQ2pDQyxNQUFNUCxXQUFXRyxVQUFyQjttQkFDU0ksR0FBVDtTQUZPLEVBR05KLFVBSE0sQ0FBVDttQkFJV0gsV0FBV0csVUFBdEI7ZUFDT0UsRUFBUDtPQVJGOztRQVdFLENBQUNULE9BQU9FLG9CQUFaLEVBQWtDO2FBQ3pCQSxvQkFBUCxHQUE4QixVQUFVTyxFQUFWLEVBQWM7cUJBQzdCQSxFQUFiO09BREY7OztVQUtJRyxPQUFOLEdBQWdCLFVBQVVELEdBQVYsRUFBZTthQUN0QkUsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCTCxHQUEvQixNQUF3QyxnQkFBL0M7S0FERjs7Q0E3RUo7O0FDQUFNLE9BQU9DLFNBQVAsR0FBbUJELE9BQU9DLFNBQVAsSUFBb0IsVUFBVUMsS0FBVixFQUFpQjtTQUMvQyxPQUFPQSxLQUFQLEtBQWlCLFFBQWpCLElBQTZCQyxTQUFTRCxLQUFULENBQTdCLElBQWdEbEMsS0FBS29DLEtBQUwsQ0FBV0YsS0FBWCxNQUFzQkEsS0FBN0U7Q0FERjs7QUFJQSxZQUFlO1NBQ05OLE1BRE07U0FFTjtVQUNDSSxNQUREO2FBRUksR0FGSjtlQUdNLG1CQUFVSyxHQUFWLEVBQWU7YUFDakJBLE1BQU0sQ0FBYjs7R0FOUztVQVNMO1VBQ0FMLE1BREE7YUFFRyxHQUZIO2VBR0ssbUJBQVVLLEdBQVYsRUFBZTthQUNqQkEsTUFBTSxDQUFiOztHQWJTO2VBZ0JBO1VBQ0xDLE1BREs7YUFFRjtHQWxCRTtvQkFvQks7YUFDUDtHQXJCRTt1QkF1QlE7VUFDYk4sTUFEYTthQUVWLENBRlU7ZUFHUixtQkFBVUssR0FBVixFQUFlO2FBQ2pCQSxPQUFPLENBQWQ7O0dBM0JTO2VBOEJBO2FBQ0Y7R0EvQkU7V0FpQ0o7VUFDREwsTUFEQzthQUVFLENBRkY7ZUFHSSxtQkFBVUssR0FBVixFQUFlO2FBQ2pCTCxPQUFPQyxTQUFQLENBQWlCSSxHQUFqQixLQUF5QkEsTUFBTSxDQUF0Qzs7R0FyQ1M7YUF3Q0Y7YUFDQSxDQURBO1VBRUhMLE1BRkc7ZUFHRSxtQkFBVUssR0FBVixFQUFlO2FBQ2pCQSxNQUFNLENBQWI7O0dBNUNTO1VBK0NMO1VBQ0FDLE1BREE7YUFFRztHQWpERTtpQkFtREU7VUFDUE4sTUFETzthQUVKLENBRkk7ZUFHRixtQkFBVUssR0FBVixFQUFlO2FBQ2pCQSxPQUFPLENBQWQ7O0dBdkRTO1lBMERIRSxPQTFERztzQkEyRE9BLE9BM0RQO3dCQTREU0EsT0E1RFQ7cUJBNkRNQSxPQTdETjt1QkE4RFFBLE9BOURSO3NCQStET0EsT0EvRFA7eUJBZ0VVQSxPQWhFVjt1QkFpRVFBLE9BakVSO3FCQWtFTUEsT0FsRU47b0JBbUVLO1VBQ1ZBLE9BRFU7YUFFUDtHQXJFRTtxQkF1RU07VUFDWEQsTUFEVzthQUVSO0dBekVFO29CQTJFSztVQUNWTjs7Q0E1RVY7O0FDZ0RBLElBQU1RLGFBQWEsTUFBbkI7QUFDQSxJQUFNQyxvQkFBb0IsYUFBMUI7QUFDQSxJQUFNQyx5QkFBeUIsa0JBQS9CO0FBQ0EsSUFBTUMsZUFBZSxjQUFyQjtBQUNBLElBQU1DLGFBQWEsTUFBbkI7QUFDQSxJQUFNQyxhQUFhLE1BQW5CO0FBQ0EsSUFBTUMscUJBQXFCLG9CQUEzQjtBQUNBLElBQU1DLHNCQUFzQixxQkFBNUI7O0FBRUFDLEVBQUVDLFdBQUY7QUFDQUQsRUFBRUUsV0FBRjs7QUFFQSxjQUFlLEVBQUNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBQUQscUJBQUE7U0FDTjtVQUNDLE9BREQ7V0FFRTtHQUhJOztTQU1OQyxLQU5NOztNQUFBLGtCQVFMO1dBQ0M7Z0JBQ0ssSUFETDtjQUVHLElBRkg7V0FHQSxJQUhBO1dBSUEsSUFKQTtnQkFLSyxLQUxMO3VCQU1ZLElBTlo7ZUFPSSxFQVBKO2VBUUksRUFSSjt1QkFTWSxLQVRaO2dCQVVLLENBVkw7Z0JBV0ssS0FYTDtxQkFZVTtLQVpqQjtHQVRXOzs7WUF5Qkg7YUFBQSx1QkFDSzthQUNKLEtBQUtDLEtBQUwsR0FBYSxLQUFLcEUsT0FBekI7S0FGTTtjQUFBLHdCQUtNO2FBQ0wsS0FBS3FFLE1BQUwsR0FBYyxLQUFLckUsT0FBMUI7S0FOTTsyQkFBQSxxQ0FTbUI7YUFDbEIsS0FBS3NFLG1CQUFMLEdBQTJCLEtBQUt0RSxPQUF2Qzs7R0FuQ1M7O1NBQUEscUJBdUNGO1NBQ0p1RSxJQUFMO0dBeENXOzs7U0EyQ047V0FDRSxlQUFVbkIsR0FBVixFQUFlO1dBQ2ZvQixRQUFMLEdBQWdCcEIsR0FBaEI7S0FGRztlQUlNLE1BSk47Z0JBS08sTUFMUDtpQkFNUSxNQU5SO2lCQU9RLE1BUFI7c0JBUWEsTUFSYjs2QkFTb0IsTUFUcEI7dUJBVWM7R0FyRFI7O1dBd0RKO1FBQUEsa0JBQ0M7OztXQUNEckQsTUFBTCxHQUFjLEtBQUswRSxLQUFMLENBQVcxRSxNQUF6QjtXQUNLQSxNQUFMLENBQVlxRSxLQUFaLEdBQW9CLEtBQUtNLFNBQXpCO1dBQ0szRSxNQUFMLENBQVlzRSxNQUFaLEdBQXFCLEtBQUtNLFVBQTFCO1dBQ0s1RSxNQUFMLENBQVk2RSxLQUFaLENBQWtCUixLQUFsQixHQUEwQixLQUFLQSxLQUFMLEdBQWEsSUFBdkM7V0FDS3JFLE1BQUwsQ0FBWTZFLEtBQVosQ0FBa0JQLE1BQWxCLEdBQTJCLEtBQUtBLE1BQUwsR0FBYyxJQUF6QztXQUNLdEUsTUFBTCxDQUFZNkUsS0FBWixDQUFrQkMsZUFBbEIsR0FBcUMsQ0FBQyxLQUFLQyxXQUFOLElBQXFCLEtBQUtBLFdBQUwsSUFBb0IsU0FBMUMsR0FBdUQsU0FBdkQsR0FBb0UsT0FBTyxLQUFLQSxXQUFaLEtBQTRCLFFBQTVCLEdBQXVDLEtBQUtBLFdBQTVDLEdBQTBELEVBQWxLO1dBQ0tDLEdBQUwsR0FBVyxLQUFLaEYsTUFBTCxDQUFZaUYsVUFBWixDQUF1QixJQUF2QixDQUFYO1VBQ0ksS0FBS0MsTUFBTCxDQUFZQyxPQUFaLElBQXVCLEtBQUtELE1BQUwsQ0FBWUMsT0FBWixDQUFvQixDQUFwQixDQUEzQixFQUFtRDthQUM1Q0MsVUFBTDtPQURGLE1BRU87YUFDQUMsS0FBTDs7V0FFR0MsS0FBTCxDQUFXOUIsVUFBWCxFQUF1QjttQkFDVjtpQkFBTSxNQUFLeEQsTUFBWDtTQURVO29CQUVUO2lCQUFNLE1BQUtnRixHQUFYO1NBRlM7dUJBR047aUJBQU0sTUFBS04sS0FBTCxDQUFXYSxTQUFYLENBQXFCQyxLQUFyQixDQUEyQixDQUEzQixDQUFOO1NBSE07NEJBSUQ7aUJBQU87bUJBQ2xCLE1BQUtiLFNBRGE7b0JBRWpCLE1BQUtDO1dBRks7U0FKQztxQkFRUixxQkFBQ2EsTUFBRCxFQUFZO2dCQUNsQkMsSUFBTCxDQUFVLEVBQUV2RSxHQUFHLENBQUwsRUFBUUMsR0FBRyxDQUFDcUUsTUFBWixFQUFWO1NBVG1CO3VCQVdOLHVCQUFDQSxNQUFELEVBQVk7Z0JBQ3BCQyxJQUFMLENBQVUsRUFBRXZFLEdBQUcsQ0FBTCxFQUFRQyxHQUFHcUUsTUFBWCxFQUFWO1NBWm1CO3VCQWNOLHVCQUFDQSxNQUFELEVBQVk7Z0JBQ3BCQyxJQUFMLENBQVUsRUFBRXZFLEdBQUcsQ0FBQ3NFLE1BQU4sRUFBY3JFLEdBQUcsQ0FBakIsRUFBVjtTQWZtQjt3QkFpQkwsd0JBQUNxRSxNQUFELEVBQVk7Z0JBQ3JCQyxJQUFMLENBQVUsRUFBRXZFLEdBQUdzRSxNQUFMLEVBQWFyRSxHQUFHLENBQWhCLEVBQVY7U0FsQm1CO2dCQW9CYixrQkFBTTtnQkFDUHVFLElBQUwsQ0FBVSxJQUFWO1NBckJtQjtpQkF1QlosbUJBQU07Z0JBQ1JBLElBQUwsQ0FBVSxLQUFWO1NBeEJtQjtpQkEwQlosbUJBQU07Z0JBQ1JDLFNBQUwsQ0FBZSxNQUFLcEIsSUFBcEI7U0EzQm1CO2VBNkJkLEtBQUthLEtBN0JTO29CQThCVCxLQUFLUSxVQTlCSTt5QkErQkosS0FBS0MsZUEvQkQ7c0JBZ0NQLEtBQUtDLFlBaENFO3NCQWlDUCxLQUFLQztPQWpDckI7S0FkSztTQUFBLG1CQW1ERTtVQUNIaEIsTUFBTSxLQUFLQSxHQUFmO1dBQ0tpQixlQUFMO1VBQ0lDLFlBQUosR0FBbUIsUUFBbkI7VUFDSUMsU0FBSixHQUFnQixRQUFoQjtVQUNJQyxrQkFBa0IsS0FBS3pCLFNBQUwsR0FBaUIsR0FBakIsR0FBdUIsS0FBSzBCLFdBQUwsQ0FBaUJ2RSxNQUE5RDtVQUNJd0UsV0FBWSxDQUFDLEtBQUtDLHVCQUFOLElBQWlDLEtBQUtBLHVCQUFMLElBQWdDLENBQWxFLEdBQXVFSCxlQUF2RSxHQUF5RixLQUFLRyx1QkFBN0c7VUFDSUMsSUFBSixHQUFXRixXQUFXLGVBQXRCO1VBQ0lHLFNBQUosR0FBaUIsQ0FBQyxLQUFLQyxnQkFBTixJQUEwQixLQUFLQSxnQkFBTCxJQUF5QixTQUFwRCxHQUFpRSxTQUFqRSxHQUE2RSxLQUFLQSxnQkFBbEc7VUFDSUMsUUFBSixDQUFhLEtBQUtOLFdBQWxCLEVBQStCLEtBQUsxQixTQUFMLEdBQWlCLENBQWhELEVBQW1ELEtBQUtDLFVBQUwsR0FBa0IsQ0FBckU7O1VBRUlnQyxXQUFXLEtBQUt2RixHQUFMLElBQVksSUFBM0I7V0FDS0EsR0FBTCxHQUFXLElBQVg7V0FDS3FELEtBQUwsQ0FBV2EsU0FBWCxDQUFxQnJDLEtBQXJCLEdBQTZCLEVBQTdCO1dBQ0syRCxPQUFMLEdBQWUsRUFBZjs7VUFFSUQsUUFBSixFQUFjO2FBQ1B0QixLQUFMLENBQVczQixZQUFYOztLQXBFRztjQUFBLHdCQXdFTzs7O1VBQ1JtRCxRQUFRLEtBQUs1QixNQUFMLENBQVlDLE9BQVosQ0FBb0IsQ0FBcEIsQ0FBWjtVQUNNNEIsR0FGTSxHQUVPRCxLQUZQLENBRU5DLEdBRk07VUFFREMsR0FGQyxHQUVPRixLQUZQLENBRURFLEdBRkM7O1VBR1JELFFBQVEsS0FBUixJQUFpQixDQUFDQyxHQUFsQixJQUF5QixDQUFDQSxJQUFJQyxHQUFsQyxFQUF1QzthQUNoQzVCLEtBQUw7OztVQUdFckIsRUFBRWtELFdBQUYsQ0FBY0YsR0FBZCxDQUFKLEVBQXdCO2FBQ2pCM0YsR0FBTCxHQUFXMkYsR0FBWDthQUNLRyxjQUFMO09BRkYsTUFHTztZQUNEQyxNQUFKLEdBQWEsWUFBTTtpQkFDWjlCLEtBQUwsQ0FBV3hCLGtCQUFYO2lCQUNLekMsR0FBTCxHQUFXMkYsR0FBWDtpQkFDS0csY0FBTDtTQUhGOztZQU1JRSxPQUFKLEdBQWMsWUFBTTtpQkFDYi9CLEtBQUwsQ0FBV3ZCLG1CQUFYO2lCQUNLc0IsS0FBTDtTQUZGOztLQXpGRztjQUFBLHdCQWdHTztXQUNQWCxLQUFMLENBQVdhLFNBQVgsQ0FBcUIrQixLQUFyQjtLQWpHSztlQUFBLHlCQW9HUTtVQUNULENBQUMsS0FBS2pHLEdBQU4sSUFBYSxDQUFDLEtBQUtrRyxvQkFBbkIsSUFBMkMsQ0FBQyxLQUFLQyxRQUFqRCxJQUE2RHpGLE9BQU9MLGdCQUF4RSxFQUEwRjthQUNuRm1FLFVBQUw7O0tBdEdHO3FCQUFBLCtCQTBHYztVQUNmNEIsUUFBUSxLQUFLL0MsS0FBTCxDQUFXYSxTQUF2QjtVQUNJLENBQUNrQyxNQUFNakMsS0FBTixDQUFZMUQsTUFBakIsRUFBeUI7O1VBRXJCNEYsT0FBT0QsTUFBTWpDLEtBQU4sQ0FBWSxDQUFaLENBQVg7V0FDS21DLFdBQUwsQ0FBaUJELElBQWpCO0tBL0dLO2VBQUEsdUJBa0hNQSxJQWxITixFQWtIWTs7O1dBQ1pwQyxLQUFMLENBQVc3QixpQkFBWCxFQUE4QmlFLElBQTlCO1VBQ0ksQ0FBQyxLQUFLRSxlQUFMLENBQXFCRixJQUFyQixDQUFMLEVBQWlDO2FBQzFCcEMsS0FBTCxDQUFXNUIsc0JBQVgsRUFBbUNnRSxJQUFuQztjQUNNLElBQUlHLEtBQUosQ0FBVSxzQ0FBc0MsS0FBS0MsYUFBM0MsR0FBMkQsU0FBckUsQ0FBTjs7VUFFRUMsS0FBSyxJQUFJQyxVQUFKLEVBQVQ7U0FDR1osTUFBSCxHQUFZLFVBQUNhLENBQUQsRUFBTztZQUNiQyxXQUFXRCxFQUFFRSxNQUFGLENBQVNDLE1BQXhCO1lBQ0kvRyxNQUFNLElBQUlnSCxLQUFKLEVBQVY7WUFDSXBCLEdBQUosR0FBVWlCLFFBQVY7WUFDSWQsTUFBSixHQUFhLFlBQU07aUJBQ1ovRixHQUFMLEdBQVdBLEdBQVg7aUJBQ0s4RixjQUFMO1NBRkY7T0FKRjtTQVNHbUIsYUFBSCxDQUFpQlosSUFBakI7S0FsSUs7bUJBQUEsMkJBcUlVQSxJQXJJVixFQXFJZ0I7VUFDakIsQ0FBQ0EsSUFBTCxFQUFXLE9BQU8sS0FBUDtVQUNQLENBQUMsS0FBS0ksYUFBTixJQUF1QixLQUFLQSxhQUFMLElBQXNCLENBQWpELEVBQW9ELE9BQU8sSUFBUDs7YUFFN0NKLEtBQUthLElBQUwsR0FBWSxLQUFLVCxhQUF4QjtLQXpJSztrQkFBQSw0QkE0SVc7V0FDWGpCLE9BQUwsQ0FBYTJCLE1BQWIsR0FBc0IsQ0FBdEI7V0FDSzNCLE9BQUwsQ0FBYTRCLE1BQWIsR0FBc0IsQ0FBdEI7VUFDSUMsV0FBVyxLQUFLckgsR0FBTCxDQUFTRSxZQUF4QjtVQUNJb0gsWUFBWSxLQUFLdEgsR0FBTCxDQUFTdUgsYUFBekI7VUFDSUMsV0FBV0YsWUFBWUQsUUFBM0I7VUFDSUksY0FBYyxLQUFLbEUsVUFBTCxHQUFrQixLQUFLRCxTQUF6Qzs7O1VBR0lrRSxXQUFXQyxXQUFmLEVBQTRCO1lBQ3RCQyxRQUFRSixZQUFZLEtBQUsvRCxVQUE3QjthQUNLaUMsT0FBTCxDQUFheEMsS0FBYixHQUFxQnFFLFdBQVdLLEtBQWhDO2FBQ0tsQyxPQUFMLENBQWEyQixNQUFiLEdBQXNCLEVBQUUsS0FBSzNCLE9BQUwsQ0FBYXhDLEtBQWIsR0FBcUIsS0FBS00sU0FBNUIsSUFBeUMsQ0FBL0Q7YUFDS2tDLE9BQUwsQ0FBYXZDLE1BQWIsR0FBc0IsS0FBS00sVUFBM0I7T0FKRixNQUtPO1lBQ0RtRSxTQUFRTCxXQUFXLEtBQUsvRCxTQUE1QjthQUNLa0MsT0FBTCxDQUFhdkMsTUFBYixHQUFzQnFFLFlBQVlJLE1BQWxDO2FBQ0tsQyxPQUFMLENBQWE0QixNQUFiLEdBQXNCLEVBQUUsS0FBSzVCLE9BQUwsQ0FBYXZDLE1BQWIsR0FBc0IsS0FBS00sVUFBN0IsSUFBMkMsQ0FBakU7YUFDS2lDLE9BQUwsQ0FBYXhDLEtBQWIsR0FBcUIsS0FBS00sU0FBMUI7OztXQUdHcUUsSUFBTDtLQWpLSztzQkFBQSw4QkFvS2F4SSxHQXBLYixFQW9La0I7VUFDbkIsS0FBS2dILFFBQVQsRUFBbUI7O1VBRWYsQ0FBQyxLQUFLbkcsR0FBTixJQUFhLENBQUMsS0FBS2tHLG9CQUF2QixFQUE2QzthQUN0QzBCLFFBQUwsR0FBZ0IsSUFBSTdHLElBQUosR0FBVzhHLE9BQVgsRUFBaEI7Ozs7VUFJRTFJLElBQUkySSxLQUFKLElBQWEzSSxJQUFJMkksS0FBSixHQUFZLENBQTdCLEVBQWdDOztVQUU1QixDQUFDM0ksSUFBSUUsT0FBTCxJQUFnQkYsSUFBSUUsT0FBSixDQUFZb0IsTUFBWixLQUF1QixDQUEzQyxFQUE4QzthQUN2Q3NILFFBQUwsR0FBZ0IsSUFBaEI7YUFDS0MsUUFBTCxHQUFnQixLQUFoQjtZQUNJQyxRQUFRdEYsRUFBRXVGLGdCQUFGLENBQW1CL0ksR0FBbkIsRUFBd0IsSUFBeEIsQ0FBWjthQUNLZ0osZUFBTCxHQUF1QkYsS0FBdkI7OztVQUdFOUksSUFBSUUsT0FBSixJQUFlRixJQUFJRSxPQUFKLENBQVlvQixNQUFaLEtBQXVCLENBQXRDLElBQTJDLENBQUMsS0FBSzJILGtCQUFyRCxFQUF5RTthQUNsRUwsUUFBTCxHQUFnQixLQUFoQjthQUNLQyxRQUFMLEdBQWdCLElBQWhCO2FBQ0tLLGFBQUwsR0FBcUIxRixFQUFFMkYsZ0JBQUYsQ0FBbUJuSixHQUFuQixFQUF3QixJQUF4QixDQUFyQjs7O1VBR0VvSixRQUFKLEVBQWM7WUFDUkMsZUFBZSxDQUFDLFNBQUQsRUFBWSxVQUFaLEVBQXdCLGFBQXhCLEVBQXVDLFlBQXZDLEVBQXFELGVBQXJELENBQW5COzs7Ozs7K0JBQ2NBLFlBQWQsOEhBQTRCO2dCQUFuQjVCLENBQW1COztxQkFDakJ6RyxnQkFBVCxDQUEwQnlHLENBQTFCLEVBQTZCLEtBQUs2QixnQkFBbEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBOUxDO29CQUFBLDRCQW1NV3RKLEdBbk1YLEVBbU1nQjtVQUNqQixLQUFLZ0gsUUFBVCxFQUFtQjtVQUNmLENBQUMsS0FBS25HLEdBQU4sSUFBYSxDQUFDLEtBQUtrRyxvQkFBdkIsRUFBNkM7WUFDdkN3QyxTQUFTLElBQUkzSCxJQUFKLEdBQVc4RyxPQUFYLEVBQWI7WUFDSWEsU0FBUyxLQUFLZCxRQUFkLEdBQXlCLElBQTdCLEVBQW1DO2VBQzVCcEQsVUFBTDs7YUFFR29ELFFBQUwsR0FBZ0IsQ0FBaEI7Ozs7V0FJR0csUUFBTCxHQUFnQixLQUFoQjtXQUNLQyxRQUFMLEdBQWdCLEtBQWhCO1dBQ0tLLGFBQUwsR0FBcUIsQ0FBckI7V0FDS0YsZUFBTCxHQUF1QixJQUF2QjtLQWpOSztxQkFBQSw2QkFvTlloSixHQXBOWixFQW9OaUI7VUFDbEIsS0FBS2dILFFBQUwsSUFBaUIsS0FBS3dDLGlCQUF0QixJQUEyQyxDQUFDLEtBQUszSSxHQUFyRCxFQUEwRDs7VUFFdEQsQ0FBQ2IsSUFBSUUsT0FBTCxJQUFnQkYsSUFBSUUsT0FBSixDQUFZb0IsTUFBWixLQUF1QixDQUEzQyxFQUE4QztZQUN4QyxDQUFDLEtBQUtzSCxRQUFWLEVBQW9CO1lBQ2hCRSxRQUFRdEYsRUFBRXVGLGdCQUFGLENBQW1CL0ksR0FBbkIsRUFBd0IsSUFBeEIsQ0FBWjtZQUNJLEtBQUtnSixlQUFULEVBQTBCO2VBQ25COUQsSUFBTCxDQUFVO2VBQ0w0RCxNQUFNbkksQ0FBTixHQUFVLEtBQUtxSSxlQUFMLENBQXFCckksQ0FEMUI7ZUFFTG1JLE1BQU1sSSxDQUFOLEdBQVUsS0FBS29JLGVBQUwsQ0FBcUJwSTtXQUZwQzs7YUFLR29JLGVBQUwsR0FBdUJGLEtBQXZCOzs7VUFHRTlJLElBQUlFLE9BQUosSUFBZUYsSUFBSUUsT0FBSixDQUFZb0IsTUFBWixLQUF1QixDQUF0QyxJQUEyQyxDQUFDLEtBQUsySCxrQkFBckQsRUFBeUU7WUFDbkUsQ0FBQyxLQUFLSixRQUFWLEVBQW9CO1lBQ2hCWSxXQUFXakcsRUFBRTJGLGdCQUFGLENBQW1CbkosR0FBbkIsRUFBd0IsSUFBeEIsQ0FBZjtZQUNJMEosUUFBUUQsV0FBVyxLQUFLUCxhQUE1QjthQUNLL0QsSUFBTCxDQUFVdUUsUUFBUSxDQUFsQixFQUFxQixJQUFyQixFQUEyQixDQUEzQjthQUNLUixhQUFMLEdBQXFCTyxRQUFyQjs7S0F4T0c7ZUFBQSx1QkE0T016SixHQTVPTixFQTRPVztVQUNaLEtBQUtnSCxRQUFMLElBQWlCLEtBQUsyQyxtQkFBdEIsSUFBNkMsQ0FBQyxLQUFLOUksR0FBdkQsRUFBNEQ7VUFDeERpSSxRQUFRdEYsRUFBRXVGLGdCQUFGLENBQW1CL0ksR0FBbkIsRUFBd0IsSUFBeEIsQ0FBWjtVQUNJQSxJQUFJNEosVUFBSixHQUFpQixDQUFqQixJQUFzQjVKLElBQUk2SixNQUFKLEdBQWEsQ0FBbkMsSUFBd0M3SixJQUFJOEosTUFBSixHQUFhLENBQXpELEVBQTREO2FBQ3JEM0UsSUFBTCxDQUFVLEtBQUs0RSxxQkFBTCxJQUE4QixLQUFLQyxtQkFBN0MsRUFBa0VsQixLQUFsRTtPQURGLE1BRU8sSUFBSTlJLElBQUk0SixVQUFKLEdBQWlCLENBQWpCLElBQXNCNUosSUFBSTZKLE1BQUosR0FBYSxDQUFuQyxJQUF3QzdKLElBQUk4SixNQUFKLEdBQWEsQ0FBekQsRUFBNEQ7YUFDNUQzRSxJQUFMLENBQVUsQ0FBQyxLQUFLNEUscUJBQU4sSUFBK0IsQ0FBQyxLQUFLQyxtQkFBL0MsRUFBb0VsQixLQUFwRTs7S0FsUEc7bUJBQUEsMkJBc1BVOUksR0F0UFYsRUFzUGU7VUFDaEIsS0FBS2dILFFBQUwsSUFBaUIsS0FBS2lELGtCQUF0QixJQUE0QyxLQUFLcEosR0FBckQsRUFBMEQ7V0FDckRxSixlQUFMLEdBQXVCLElBQXZCO0tBeFBLO21CQUFBLDJCQTJQVWxLLEdBM1BWLEVBMlBlO1VBQ2hCLEtBQUtnSCxRQUFMLElBQWlCLEtBQUtpRCxrQkFBdEIsSUFBNEMsS0FBS3BKLEdBQXJELEVBQTBEO1dBQ3JEcUosZUFBTCxHQUF1QixLQUF2QjtLQTdQSztrQkFBQSwwQkFnUVNsSyxHQWhRVCxFQWdRYyxFQWhRZDtjQUFBLHNCQW1RS0EsR0FuUUwsRUFtUVU7VUFDWCxLQUFLZ0gsUUFBTCxJQUFpQixLQUFLaUQsa0JBQXRCLElBQTRDLEtBQUtwSixHQUFyRCxFQUEwRDtVQUN0RCxDQUFDYixJQUFJbUssWUFBTCxJQUFxQixDQUFDbkssSUFBSW1LLFlBQUosQ0FBaUJuRixLQUFqQixDQUF1QjFELE1BQWpELEVBQXlEO1dBQ3BENEksZUFBTCxHQUF1QixLQUF2QjtVQUNJaEQsT0FBT2xILElBQUltSyxZQUFKLENBQWlCbkYsS0FBakIsQ0FBdUIsQ0FBdkIsQ0FBWDtXQUNLbUMsV0FBTCxDQUFpQkQsSUFBakI7S0F4UUs7UUFBQSxnQkEyUURrRCxNQTNRQyxFQTJRTztVQUNSLENBQUNBLE1BQUwsRUFBYTtXQUNSL0QsT0FBTCxDQUFhMkIsTUFBYixJQUF1Qm9DLE9BQU96SixDQUE5QjtXQUNLMEYsT0FBTCxDQUFhNEIsTUFBYixJQUF1Qm1DLE9BQU94SixDQUE5QjtVQUNJLEtBQUt5SixpQkFBVCxFQUE0QjthQUNyQkMseUJBQUw7O1dBRUd4RixLQUFMLENBQVcxQixVQUFYO1dBQ0tvRixJQUFMO0tBblJLOzZCQUFBLHVDQXNSc0I7VUFDdkIsS0FBS25DLE9BQUwsQ0FBYTJCLE1BQWIsR0FBc0IsQ0FBMUIsRUFBNkI7YUFDdEIzQixPQUFMLENBQWEyQixNQUFiLEdBQXNCLENBQXRCOztVQUVFLEtBQUszQixPQUFMLENBQWE0QixNQUFiLEdBQXNCLENBQTFCLEVBQTZCO2FBQ3RCNUIsT0FBTCxDQUFhNEIsTUFBYixHQUFzQixDQUF0Qjs7VUFFRSxLQUFLOUQsU0FBTCxHQUFpQixLQUFLa0MsT0FBTCxDQUFhMkIsTUFBOUIsR0FBdUMsS0FBSzNCLE9BQUwsQ0FBYXhDLEtBQXhELEVBQStEO2FBQ3hEd0MsT0FBTCxDQUFhMkIsTUFBYixHQUFzQixFQUFFLEtBQUszQixPQUFMLENBQWF4QyxLQUFiLEdBQXFCLEtBQUtNLFNBQTVCLENBQXRCOztVQUVFLEtBQUtDLFVBQUwsR0FBa0IsS0FBS2lDLE9BQUwsQ0FBYTRCLE1BQS9CLEdBQXdDLEtBQUs1QixPQUFMLENBQWF2QyxNQUF6RCxFQUFpRTthQUMxRHVDLE9BQUwsQ0FBYTRCLE1BQWIsR0FBc0IsRUFBRSxLQUFLNUIsT0FBTCxDQUFhdkMsTUFBYixHQUFzQixLQUFLTSxVQUE3QixDQUF0Qjs7S0FqU0c7UUFBQSxnQkFxU0RtRyxNQXJTQyxFQXFTT0MsR0FyU1AsRUFxUzZCO1VBQWpCQyxXQUFpQix1RUFBSCxDQUFHOztZQUM1QkQsT0FBTztXQUNSLEtBQUtuRSxPQUFMLENBQWEyQixNQUFiLEdBQXNCLEtBQUszQixPQUFMLENBQWF4QyxLQUFiLEdBQXFCLENBRG5DO1dBRVIsS0FBS3dDLE9BQUwsQ0FBYTRCLE1BQWIsR0FBc0IsS0FBSzVCLE9BQUwsQ0FBYXZDLE1BQWIsR0FBc0I7T0FGakQ7VUFJSTRHLFFBQVMsS0FBS3ZHLFNBQUwsR0FBaUIsTUFBbEIsR0FBNEIsS0FBS3dHLFNBQWpDLEdBQTZDRixXQUF6RDtVQUNJOUosSUFBSSxDQUFSO1VBQ0k0SixNQUFKLEVBQVk7WUFDTixJQUFJRyxLQUFSO09BREYsTUFFTyxJQUFJLEtBQUtyRSxPQUFMLENBQWF4QyxLQUFiLEdBQXFCLEVBQXpCLEVBQTZCO1lBQzlCLElBQUk2RyxLQUFSOztXQUVHckUsT0FBTCxDQUFheEMsS0FBYixHQUFxQixLQUFLd0MsT0FBTCxDQUFheEMsS0FBYixHQUFxQmxELENBQTFDO1dBQ0swRixPQUFMLENBQWF2QyxNQUFiLEdBQXNCLEtBQUt1QyxPQUFMLENBQWF2QyxNQUFiLEdBQXNCbkQsQ0FBNUM7VUFDSWlLLFVBQVUsQ0FBQ2pLLElBQUksQ0FBTCxLQUFXNkosSUFBSTdKLENBQUosR0FBUSxLQUFLMEYsT0FBTCxDQUFhMkIsTUFBaEMsQ0FBZDtVQUNJNkMsVUFBVSxDQUFDbEssSUFBSSxDQUFMLEtBQVc2SixJQUFJNUosQ0FBSixHQUFRLEtBQUt5RixPQUFMLENBQWE0QixNQUFoQyxDQUFkO1dBQ0s1QixPQUFMLENBQWEyQixNQUFiLEdBQXNCLEtBQUszQixPQUFMLENBQWEyQixNQUFiLEdBQXNCNEMsT0FBNUM7V0FDS3ZFLE9BQUwsQ0FBYTRCLE1BQWIsR0FBc0IsS0FBSzVCLE9BQUwsQ0FBYTRCLE1BQWIsR0FBc0I0QyxPQUE1Qzs7VUFFSSxLQUFLUixpQkFBVCxFQUE0QjtZQUN0QixLQUFLaEUsT0FBTCxDQUFheEMsS0FBYixHQUFxQixLQUFLTSxTQUE5QixFQUF5QztjQUNuQzJHLEtBQUssS0FBSzNHLFNBQUwsR0FBaUIsS0FBS2tDLE9BQUwsQ0FBYXhDLEtBQXZDO2VBQ0t3QyxPQUFMLENBQWF4QyxLQUFiLEdBQXFCLEtBQUtNLFNBQTFCO2VBQ0trQyxPQUFMLENBQWF2QyxNQUFiLEdBQXNCLEtBQUt1QyxPQUFMLENBQWF2QyxNQUFiLEdBQXNCZ0gsRUFBNUM7OztZQUdFLEtBQUt6RSxPQUFMLENBQWF2QyxNQUFiLEdBQXNCLEtBQUtNLFVBQS9CLEVBQTJDO2NBQ3JDMEcsTUFBSyxLQUFLMUcsVUFBTCxHQUFrQixLQUFLaUMsT0FBTCxDQUFhdkMsTUFBeEM7ZUFDS3VDLE9BQUwsQ0FBYXZDLE1BQWIsR0FBc0IsS0FBS00sVUFBM0I7ZUFDS2lDLE9BQUwsQ0FBYXhDLEtBQWIsR0FBcUIsS0FBS3dDLE9BQUwsQ0FBYXhDLEtBQWIsR0FBcUJpSCxHQUExQzs7YUFFR1IseUJBQUw7O1dBRUd4RixLQUFMLENBQVd6QixVQUFYO1dBQ0ttRixJQUFMO0tBdlVLO21CQUFBLDZCQTBVWTtVQUNibEUsa0JBQW1CLENBQUMsS0FBS0MsV0FBTixJQUFxQixLQUFLQSxXQUFMLElBQW9CLFNBQTFDLEdBQXVELFNBQXZELEdBQW1FLEtBQUtBLFdBQTlGO1dBQ0tDLEdBQUwsQ0FBU3lCLFNBQVQsR0FBcUIzQixlQUFyQjtXQUNLRSxHQUFMLENBQVN1RyxRQUFULENBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCLEtBQUs1RyxTQUE3QixFQUF3QyxLQUFLQyxVQUE3QztLQTdVSztRQUFBLGtCQWdWQzs7O1VBQ0ZJLE1BQU0sS0FBS0EsR0FBZjtVQUNJLENBQUMsS0FBSzNELEdBQVYsRUFBZTtxQkFDeUIsS0FBS3dGLE9BSHZDO1VBR0EyQixNQUhBLFlBR0FBLE1BSEE7VUFHUUMsTUFIUixZQUdRQSxNQUhSO1VBR2dCcEUsS0FIaEIsWUFHZ0JBLEtBSGhCO1VBR3VCQyxNQUh2QixZQUd1QkEsTUFIdkI7OzRCQUlnQixZQUFNO2VBQ3JCMkIsZUFBTDtZQUNJdUYsU0FBSixDQUFjLE9BQUtuSyxHQUFuQixFQUF3Qm1ILE1BQXhCLEVBQWdDQyxNQUFoQyxFQUF3Q3BFLEtBQXhDLEVBQStDQyxNQUEvQztPQUZGO0tBcFZLO21CQUFBLDJCQTBWVW1ILElBMVZWLEVBMFZnQjtVQUNqQixDQUFDLEtBQUtwSyxHQUFWLEVBQWUsT0FBTyxFQUFQO2FBQ1IsS0FBS3JCLE1BQUwsQ0FBWTBMLFNBQVosQ0FBc0JELElBQXRCLENBQVA7S0E1Vks7Z0JBQUEsd0JBK1ZPdkosUUEvVlAsRUErVmlCeUosUUEvVmpCLEVBK1YyQkMsZUEvVjNCLEVBK1Y0QztVQUM3QyxDQUFDLEtBQUt2SyxHQUFWLEVBQWUsT0FBTyxJQUFQO1dBQ1ZyQixNQUFMLENBQVk2TCxNQUFaLENBQW1CM0osUUFBbkIsRUFBNkJ5SixRQUE3QixFQUF1Q0MsZUFBdkM7S0FqV0s7Z0JBQUEsMEJBb1dnQjs7O3dDQUFORSxJQUFNO1lBQUE7OzthQUNkLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7WUFDbEM7aUJBQ0dsRyxZQUFMLENBQWtCLFVBQUNtRyxJQUFELEVBQVU7b0JBQ2xCQSxJQUFSO1dBREYsRUFFR0osSUFGSDtTQURGLENBSUUsT0FBT0ssR0FBUCxFQUFZO2lCQUNMQSxHQUFQOztPQU5HLENBQVA7OztDQTdaTjs7QUM5REEsSUFBTUMsWUFBWTtXQUNQLGlCQUFVQyxHQUFWLEVBQWVDLE9BQWYsRUFBd0I7UUFDM0JDLFNBQUosQ0FBYyxRQUFkLEVBQXdCQyxPQUF4Qjs7Q0FGSjs7Ozs7Ozs7In0=
>>>>>>> e222aaedabdc7f7e55a48b255a974905d3979f64
