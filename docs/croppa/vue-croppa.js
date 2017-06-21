/*
 * vue-croppa v0.0.19
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
  },
  supportTouchEvent: function supportTouchEvent() {
    return 'ontouchstart' in document.documentElement;
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
      pinchDistance: 0
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
      if (!this.img && !this.disableClickToChoose && !this.disabled && !u.supportTouchEvent()) {
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
      if (!this.img && !this.disableClickToChoose) {
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

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi9zcmMvY3JvcHBlci52dWUiLCIuLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgb25lUG9pbnRDb29yZChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyhldnQsIHZtKSB7XHJcbiAgICBsZXQgcG9pbnRlciA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnRcclxuICAgIHJldHVybiB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlciwgdm0pXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hEaXN0YW5jZShldnQsIHZtKSB7XHJcbiAgICBsZXQgcG9pbnRlcjEgPSBldnQudG91Y2hlc1swXVxyXG4gICAgbGV0IHBvaW50ZXIyID0gZXZ0LnRvdWNoZXNbMV1cclxuICAgIGxldCBjb29yZDEgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjEsIHZtKVxyXG4gICAgbGV0IGNvb3JkMiA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMiwgdm0pXHJcblxyXG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhjb29yZDEueCAtIGNvb3JkMi54LCAyKSArIE1hdGgucG93KGNvb3JkMS55IC0gY29vcmQyLnksIDIpKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoQ2VudGVyQ29vcmQoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZChpbWcpIHtcclxuICAgIHJldHVybiBpbWcuY29tcGxldGUgJiYgaW1nLm5hdHVyYWxXaWR0aCAhPT0gMFxyXG4gIH0sXHJcblxyXG4gIHN1cHBvcnRUb3VjaEV2ZW50KCkge1xyXG4gICAgcmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxyXG4gIH0sXHJcblxyXG4gIHJBRlBvbHlmaWxsKCkge1xyXG4gICAgLy8gckFGIHBvbHlmaWxsXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH1cclxufSIsIk51bWJlci5pc0ludGVnZXIgPSBOdW1iZXIuaXNJbnRlZ2VyIHx8IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWVcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjZTZlNmU2J1xyXG4gIH0sXHJcbiAgcXVhbGl0eToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWwpICYmIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnaW1hZ2UvKidcclxuICB9LFxyXG4gIGZpbGVTaXplTGltaXQ6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+PSAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBkaXNhYmxlZDogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ0FuZERyb3A6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZUNsaWNrVG9DaG9vc2U6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZURyYWdUb01vdmU6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUGluY2hUb1pvb206IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVpvb21pbmdHZXN0dXJlOiBCb29sZWFuLCAvLyBkZXByZWNhdGVkXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9XHJcbn0iLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiA6Y2xhc3M9XCJgY3JvcHBhLWNvbnRhaW5lciAke2ltZyA/ICdjcm9wcGEtLWhhcy10YXJnZXQnIDogJyd9ICR7ZGlzYWJsZWQgPyAnY3JvcHBhLS1kaXNhYmxlZCcgOiAnJ30gJHtkaXNhYmxlQ2xpY2tUb0Nob29zZSA/ICdjcm9wcGEtLWRpc2FibGVkLWNjJyA6ICcnfSAke2Rpc2FibGVEcmFnVG9Nb3ZlICYmIGRpc2FibGVTY3JvbGxUb1pvb20gPyAnY3JvcHBhLS1kaXNhYmxlZC1teicgOiAnJ30gJHtmaWxlRHJhZ2dlZE92ZXIgPyAnY3JvcHBhLS1kcm9wem9uZScgOiAnJ31gXCJcclxuICAgICAgIEBkcmFnZW50ZXIuc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJhZ0VudGVyXCJcclxuICAgICAgIEBkcmFnbGVhdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJhZ0xlYXZlXCJcclxuICAgICAgIEBkcmFnb3Zlci5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcmFnT3ZlclwiXHJcbiAgICAgICBAZHJvcC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcm9wXCI+XHJcbiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIlxyXG4gICAgICAgICAgIDphY2NlcHQ9XCJhY2NlcHRcIlxyXG4gICAgICAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcclxuICAgICAgICAgICByZWY9XCJmaWxlSW5wdXRcIlxyXG4gICAgICAgICAgIGhpZGRlblxyXG4gICAgICAgICAgIEBjaGFuZ2U9XCJoYW5kbGVJbnB1dENoYW5nZVwiIC8+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaW5pdGlhbFwiXHJcbiAgICAgICAgIHN0eWxlPVwid2lkdGg6IDA7IGhlaWdodDogMDsgdmlzaWJpbGl0eTogaGlkZGVuO1wiPlxyXG4gICAgICA8c2xvdCBuYW1lPVwiaW5pdGlhbFwiPjwvc2xvdD5cclxuICAgIDwvZGl2PlxyXG4gICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIlxyXG4gICAgICAgICAgICBAY2xpY2suc3RvcC5wcmV2ZW50PVwiaGFuZGxlQ2xpY2tcIlxyXG4gICAgICAgICAgICBAdG91Y2hzdGFydC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAbW91c2Vkb3duLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyc3RhcnQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHRvdWNoZW5kLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAdG91Y2hjYW5jZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBtb3VzZXVwLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcmVuZC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJjYW5jZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEB0b3VjaG1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBAbW91c2Vtb3ZlLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJtb3ZlLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQERPTU1vdXNlU2Nyb2xsLnN0b3AucHJldmVudD1cImhhbmRsZVdoZWVsXCJcclxuICAgICAgICAgICAgQHdoZWVsLnN0b3AucHJldmVudD1cImhhbmRsZVdoZWVsXCJcclxuICAgICAgICAgICAgQG1vdXNld2hlZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlV2hlZWxcIj48L2NhbnZhcz5cclxuICAgIDxzdmcgY2xhc3M9XCJpY29uIGljb24tcmVtb3ZlXCJcclxuICAgICAgICAgdi1pZj1cInNob3dSZW1vdmVCdXR0b24gJiYgaW1nXCJcclxuICAgICAgICAgQGNsaWNrPVwidW5zZXRcIlxyXG4gICAgICAgICA6c3R5bGU9XCJgdG9wOiAtJHtoZWlnaHQvNDB9cHg7IHJpZ2h0OiAtJHt3aWR0aC80MH1weGBcIlxyXG4gICAgICAgICB2aWV3Qm94PVwiMCAwIDEwMjQgMTAyNFwiXHJcbiAgICAgICAgIHZlcnNpb249XCIxLjFcIlxyXG4gICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICAgICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcclxuICAgICAgICAgOndpZHRoPVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aC8xMFwiXHJcbiAgICAgICAgIDpoZWlnaHQ9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCI+XHJcbiAgICAgIDxwYXRoIGQ9XCJNNTExLjkyMTIzMSAwQzIyOS4xNzkwNzcgMCAwIDIyOS4yNTc4NDYgMCA1MTIgMCA3OTQuNzAyNzY5IDIyOS4xNzkwNzcgMTAyNCA1MTEuOTIxMjMxIDEwMjQgNzk0Ljc4MTUzOCAxMDI0IDEwMjQgNzk0LjcwMjc2OSAxMDI0IDUxMiAxMDI0IDIyOS4yNTc4NDYgNzk0Ljc4MTUzOCAwIDUxMS45MjEyMzEgMFpNNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDY1MC41MTU2OTIgNzMyLjA4MTIzMUM2NTAuNTE1NjkyIDczMi4wODEyMzEgNTIxLjQ5MTY5MiA1OTMuNjgzNjkyIDUxMS44ODE4NDYgNTkzLjY4MzY5MiA1MDIuNDI5NTM4IDU5My42ODM2OTIgMzczLjM2NjE1NCA3MzIuMDgxMjMxIDM3My4zNjYxNTQgNzMyLjA4MTIzMUwyOTEuNzYxMjMxIDY1MC42MzM4NDZDMjkxLjc2MTIzMSA2NTAuNjMzODQ2IDQzMC4zMTYzMDggNTIzLjUwMDMwOCA0MzAuMzE2MzA4IDUxMi4xOTY5MjMgNDMwLjMxNjMwOCA1MDAuNjk2NjE1IDI5MS43NjEyMzEgMzczLjUyMzY5MiAyOTEuNzYxMjMxIDM3My41MjM2OTJMMzczLjM2NjE1NCAyOTEuOTE4NzY5QzM3My4zNjYxNTQgMjkxLjkxODc2OSA1MDMuNDUzNTM4IDQzMC4zOTUwNzcgNTExLjg4MTg0NiA0MzAuMzk1MDc3IDUyMC4zNDk1MzggNDMwLjM5NTA3NyA2NTAuNTE1NjkyIDI5MS45MTg3NjkgNjUwLjUxNTY5MiAyOTEuOTE4NzY5TDczMi4wNDE4NDYgMzczLjUyMzY5MkM3MzIuMDQxODQ2IDM3My41MjM2OTIgNTkzLjQ0NzM4NSA1MDIuNTQ3NjkyIDU5My40NDczODUgNTEyLjE5NjkyMyA1OTMuNDQ3Mzg1IDUyMS40MTI5MjMgNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDczMi4wNDE4NDYgNjUwLjYzMzg0NlpcIlxyXG4gICAgICAgICAgICA6ZmlsbD1cInJlbW92ZUJ1dHRvbkNvbG9yXCI+PC9wYXRoPlxyXG4gICAgPC9zdmc+XHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c2NyaXB0PlxyXG4gIGltcG9ydCB1IGZyb20gJy4vdXRpbCdcclxuICBpbXBvcnQgcHJvcHMgZnJvbSAnLi9wcm9wcydcclxuXHJcbiAgY29uc3QgSU5JVF9FVkVOVCA9ICdpbml0J1xyXG4gIGNvbnN0IEZJTEVfQ0hPT1NFX0VWRU5UID0gJ2ZpbGUtY2hvb3NlJ1xyXG4gIGNvbnN0IEZJTEVfU0laRV9FWENFRURfRVZFTlQgPSAnZmlsZS1zaXplLWV4Y2VlZCdcclxuICBjb25zdCBJTUFHRV9SRU1PVkUgPSAnaW1hZ2UtcmVtb3ZlJ1xyXG4gIGNvbnN0IE1PVkVfRVZFTlQgPSAnbW92ZSdcclxuICBjb25zdCBaT09NX0VWRU5UID0gJ3pvb20nXHJcbiAgY29uc3QgSU5JVElBTF9JTUFHRV9MT0FEID0gJ2luaXRpYWwtaW1hZ2UtbG9hZCdcclxuICBjb25zdCBJTklUSUFMX0lNQUdFX0VSUk9SID0gJ2luaXRpYWwtaW1hZ2UtZXJyb3InXHJcblxyXG4gIHUuckFGUG9seWZpbGwoKVxyXG5cclxuICBleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBtb2RlbDoge1xyXG4gICAgICBwcm9wOiAndmFsdWUnLFxyXG4gICAgICBldmVudDogJ2luaXQnXHJcbiAgICB9LFxyXG5cclxuICAgIHByb3BzOiBwcm9wcyxcclxuXHJcbiAgICBkYXRhICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBpbnN0YW5jZTogbnVsbCxcclxuICAgICAgICBjYW52YXM6IG51bGwsXHJcbiAgICAgICAgY3R4OiBudWxsLFxyXG4gICAgICAgIGltZzogbnVsbCxcclxuICAgICAgICBkcmFnZ2luZzogZmFsc2UsXHJcbiAgICAgICAgbGFzdE1vdmluZ0Nvb3JkOiBudWxsLFxyXG4gICAgICAgIGltZ0RhdGE6IHt9LFxyXG4gICAgICAgIGRhdGFVcmw6ICcnLFxyXG4gICAgICAgIGZpbGVEcmFnZ2VkT3ZlcjogZmFsc2UsXHJcbiAgICAgICAgdGFiU3RhcnQ6IDAsXHJcbiAgICAgICAgcGluY2hpbmc6IGZhbHNlLFxyXG4gICAgICAgIHBpbmNoRGlzdGFuY2U6IDBcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICByZWFsV2lkdGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWFsSGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQgKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlYWxQbGFjZWhvbGRlckZvbnRTaXplICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlckZvbnRTaXplICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbW91bnRlZCAoKSB7XHJcbiAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICB9LFxyXG5cclxuICAgIHdhdGNoOiB7XHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IHZhbFxyXG4gICAgICB9LFxyXG4gICAgICByZWFsV2lkdGg6ICdpbml0JyxcclxuICAgICAgcmVhbEhlaWdodDogJ2luaXQnLFxyXG4gICAgICBjYW52YXNDb2xvcjogJ2luaXQnLFxyXG4gICAgICBwbGFjZWhvbGRlcjogJ2luaXQnLFxyXG4gICAgICBwbGFjZWhvbGRlckNvbG9yOiAnaW5pdCcsXHJcbiAgICAgIHJlYWxQbGFjZWhvbGRlckZvbnRTaXplOiAnaW5pdCcsXHJcbiAgICAgIHByZXZlbnRXaGl0ZVNwYWNlOiAnaW1nQ29udGVudEluaXQnXHJcbiAgICB9LFxyXG5cclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgaW5pdCAoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRyZWZzLmNhbnZhc1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyAncHgnXHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyAncHgnXHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjZTZlNmU2JyA6ICh0eXBlb2YgdGhpcy5jYW52YXNDb2xvciA9PT0gJ3N0cmluZycgPyB0aGlzLmNhbnZhc0NvbG9yIDogJycpXHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgICAgaWYgKHRoaXMuJHNsb3RzLmluaXRpYWwgJiYgdGhpcy4kc2xvdHMuaW5pdGlhbFswXSkge1xyXG4gICAgICAgICAgdGhpcy5zZXRJbml0aWFsKClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy51bnNldCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuJGVtaXQoSU5JVF9FVkVOVCwge1xyXG4gICAgICAgICAgZ2V0Q2FudmFzOiAoKSA9PiB0aGlzLmNhbnZhcyxcclxuICAgICAgICAgIGdldENvbnRleHQ6ICgpID0+IHRoaXMuY3R4LFxyXG4gICAgICAgICAgZ2V0Q2hvc2VuRmlsZTogKCkgPT4gdGhpcy4kcmVmcy5maWxlSW5wdXQuZmlsZXNbMF0sXHJcbiAgICAgICAgICBnZXRBY3R1YWxJbWFnZVNpemU6ICgpID0+ICh7XHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnJlYWxXaWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgbW92ZVVwd2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogLWFtb3VudCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVEb3dud2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogYW1vdW50IH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZUxlZnR3YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAtYW1vdW50LCB5OiAwIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZVJpZ2h0d2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogYW1vdW50LCB5OiAwIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgem9vbUluOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuem9vbSh0cnVlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21PdXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKGZhbHNlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHJlZnJlc2g6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5pbml0KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHJlc2V0OiB0aGlzLnVuc2V0LFxyXG4gICAgICAgICAgY2hvb3NlRmlsZTogdGhpcy5jaG9vc2VGaWxlLFxyXG4gICAgICAgICAgZ2VuZXJhdGVEYXRhVXJsOiB0aGlzLmdlbmVyYXRlRGF0YVVybCxcclxuICAgICAgICAgIGdlbmVyYXRlQmxvYjogdGhpcy5nZW5lcmF0ZUJsb2IsXHJcbiAgICAgICAgICBwcm9taXNlZEJsb2I6IHRoaXMucHJvbWlzZWRCbG9iXHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHVuc2V0ICgpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXHJcbiAgICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMucmVhbFdpZHRoIC8gMS41IC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcclxuICAgICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemUgfHwgdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZSA9PSAwKSA/IGRlZmF1bHRGb250U2l6ZSA6IHRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemVcclxuICAgICAgICBjdHguZm9udCA9IGZvbnRTaXplICsgJ3B4IHNhbnMtc2VyaWYnXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMucmVhbFdpZHRoIC8gMiwgdGhpcy5yZWFsSGVpZ2h0IC8gMilcclxuXHJcbiAgICAgICAgbGV0IGhhZEltYWdlID0gdGhpcy5pbWcgIT0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcclxuICAgICAgICB0aGlzLmltZ0RhdGEgPSB7fVxyXG5cclxuICAgICAgICBpZiAoaGFkSW1hZ2UpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoSU1BR0VfUkVNT1ZFKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNldEluaXRpYWwgKCkge1xyXG4gICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLmluaXRpYWxbMF1cclxuICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICBpZiAodGFnICE9PSAnaW1nJyB8fCAhZWxtIHx8ICFlbG0uc3JjKSB7XHJcbiAgICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChlbG0pKSB7XHJcbiAgICAgICAgICB0aGlzLmltZyA9IGVsbVxyXG4gICAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVsbS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoSU5JVElBTF9JTUFHRV9MT0FEKVxyXG4gICAgICAgICAgICB0aGlzLmltZyA9IGVsbVxyXG4gICAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBlbG0ub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy4kZW1pdChJTklUSUFMX0lNQUdFX0VSUk9SKVxyXG4gICAgICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjaG9vc2VGaWxlICgpIHtcclxuICAgICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC5jbGljaygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVDbGljayAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZyAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSAmJiAhdGhpcy5kaXNhYmxlZCAmJiAhdS5zdXBwb3J0VG91Y2hFdmVudCgpKSB7XHJcbiAgICAgICAgICB0aGlzLmNob29zZUZpbGUoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZUlucHV0Q2hhbmdlICgpIHtcclxuICAgICAgICBsZXQgaW5wdXQgPSB0aGlzLiRyZWZzLmZpbGVJbnB1dFxyXG4gICAgICAgIGlmICghaW5wdXQuZmlsZXMubGVuZ3RoKSByZXR1cm5cclxuXHJcbiAgICAgICAgbGV0IGZpbGUgPSBpbnB1dC5maWxlc1swXVxyXG4gICAgICAgIHRoaXMub25OZXdGaWxlSW4oZmlsZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG9uTmV3RmlsZUluIChmaWxlKSB7XHJcbiAgICAgICAgdGhpcy4kZW1pdChGSUxFX0NIT09TRV9FVkVOVCwgZmlsZSlcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVNpemVJc1ZhbGlkKGZpbGUpKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KEZJTEVfU0laRV9FWENFRURfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpbGUgc2l6ZSBleGNlZWRzIGxpbWl0IHdoaWNoIGlzICcgKyB0aGlzLmZpbGVTaXplTGltaXQgKyAnIGJ5dGVzLicpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBmciA9IG5ldyBGaWxlUmVhZGVyKClcclxuICAgICAgICBmci5vbmxvYWQgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGZpbGVEYXRhID0gZS50YXJnZXQucmVzdWx0XHJcbiAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgICAgIGltZy5zcmMgPSBmaWxlRGF0YVxyXG4gICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbWcgPSBpbWdcclxuICAgICAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZyLnJlYWRBc0RhdGFVUkwoZmlsZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZpbGVTaXplSXNWYWxpZCAoZmlsZSkge1xyXG4gICAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVTaXplTGltaXQgfHwgdGhpcy5maWxlU2l6ZUxpbWl0ID09IDApIHJldHVybiB0cnVlXHJcblxyXG4gICAgICAgIHJldHVybiBmaWxlLnNpemUgPCB0aGlzLmZpbGVTaXplTGltaXRcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGltZ0NvbnRlbnRJbml0ICgpIHtcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5pbWcubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMuaW1nLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICBsZXQgaW1nUmF0aW8gPSBpbWdIZWlnaHQgLyBpbWdXaWR0aFxyXG4gICAgICAgIGxldCBjYW52YXNSYXRpbyA9IHRoaXMucmVhbEhlaWdodCAvIHRoaXMucmVhbFdpZHRoXHJcblxyXG4gICAgICAgIC8vIGRpc3BsYXkgYXMgZml0XHJcbiAgICAgICAgaWYgKGltZ1JhdGlvIDwgY2FudmFzUmF0aW8pIHtcclxuICAgICAgICAgIGxldCByYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGggLyByYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5yZWFsV2lkdGgpIC8gMlxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgcmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gcmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpIC8gMlxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyU3RhcnQgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICAvLyBzaW11bGF0ZSBjbGljayB3aXRoIHRvdWNoIG9uIG1vYmlsZSBkZXZpY2VzXHJcbiAgICAgICAgaWYgKCF0aGlzLmltZyAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgICAgdGhpcy50YWJTdGFydCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWdub3JlIG1vdXNlIHJpZ2h0IGNsaWNrIGFuZCBtaWRkbGUgY2xpY2tcclxuICAgICAgICBpZiAoZXZ0LndoaWNoICYmIGV2dC53aGljaCA+IDEpIHJldHVyblxyXG5cclxuICAgICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSB0cnVlXHJcbiAgICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRvY3VtZW50KSB7XHJcbiAgICAgICAgICBsZXQgY2FuY2VsRXZlbnRzID0gWydtb3VzZXVwJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJywgJ3BvaW50ZXJlbmQnLCAncG9pbnRlcmNhbmNlbCddXHJcbiAgICAgICAgICBmb3IgKGxldCBlIG9mIGNhbmNlbEV2ZW50cykge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuaGFuZGxlUG9pbnRlckVuZClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyRW5kIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltZyAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgICAgbGV0IHRhYkVuZCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICBpZiAodGFiRW5kIC0gdGhpcy50YWJTdGFydCA8IDEwMDApIHtcclxuICAgICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMudGFiU3RhcnQgPSAwXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IDBcclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IG51bGxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnVG9Nb3ZlIHx8ICF0aGlzLmltZykgcmV0dXJuXHJcblxyXG4gICAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxyXG4gICAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIGlmICh0aGlzLmxhc3RNb3ZpbmdDb29yZCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoe1xyXG4gICAgICAgICAgICAgIHg6IGNvb3JkLnggLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC54LFxyXG4gICAgICAgICAgICAgIHk6IGNvb3JkLnkgLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC55XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLnBpbmNoaW5nKSByZXR1cm5cclxuICAgICAgICAgIGxldCBkaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXHJcbiAgICAgICAgICBsZXQgZGVsdGEgPSBkaXN0YW5jZSAtIHRoaXMucGluY2hEaXN0YW5jZVxyXG4gICAgICAgICAgdGhpcy56b29tKGRlbHRhID4gMCwgbnVsbCwgMilcclxuICAgICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IGRpc3RhbmNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlV2hlZWwgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVNjcm9sbFRvWm9vbSB8fCAhdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgaWYgKGV2dC53aGVlbERlbHRhIDwgMCB8fCBldnQuZGVsdGFZID4gMCB8fCBldnQuZGV0YWlsID4gMCkge1xyXG4gICAgICAgICAgdGhpcy56b29tKHRoaXMucmV2ZXJzZVpvb21pbmdHZXN0dXJlIHx8IHRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSwgY29vcmQpXHJcbiAgICAgICAgfSBlbHNlIGlmIChldnQud2hlZWxEZWx0YSA+IDAgfHwgZXZ0LmRlbHRhWSA8IDAgfHwgZXZ0LmRldGFpbCA8IDApIHtcclxuICAgICAgICAgIHRoaXMuem9vbSghdGhpcy5yZXZlcnNlWm9vbWluZ0dlc3R1cmUgJiYgIXRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSwgY29vcmQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ0VudGVyIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnQW5kRHJvcCB8fCB0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSB0cnVlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcmFnTGVhdmUgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdBbmREcm9wIHx8IHRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcmFnT3ZlciAoZXZ0KSB7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcm9wIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnQW5kRHJvcCB8fCB0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgaWYgKCFldnQuZGF0YVRyYW5zZmVyIHx8ICFldnQuZGF0YVRyYW5zZmVyLmZpbGVzLmxlbmd0aCkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxyXG4gICAgICAgIGxldCBmaWxlID0gZXZ0LmRhdGFUcmFuc2Zlci5maWxlc1swXVxyXG4gICAgICAgIHRoaXMub25OZXdGaWxlSW4oZmlsZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1vdmUgKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghb2Zmc2V0KSByZXR1cm5cclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYICs9IG9mZnNldC54XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSArPSBvZmZzZXQueVxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLnByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRlbWl0KE1PVkVfRVZFTlQpXHJcbiAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFkgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWFsV2lkdGggLSB0aGlzLmltZ0RhdGEuc3RhcnRYID4gdGhpcy5pbWdEYXRhLndpZHRoKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVhbEhlaWdodCAtIHRoaXMuaW1nRGF0YS5zdGFydFkgPiB0aGlzLmltZ0RhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHpvb20gKHpvb21JbiwgcG9zLCB0aW1lc0Zhc3RlciA9IDEpIHtcclxuICAgICAgICBwb3MgPSBwb3MgfHwge1xyXG4gICAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXHJcbiAgICAgICAgICB5OiB0aGlzLmltZ0RhdGEuc3RhcnRZICsgdGhpcy5pbWdEYXRhLmhlaWdodCAvIDJcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHNwZWVkID0gKHRoaXMucmVhbFdpZHRoIC8gMTAwMDAwKSAqIHRoaXMuem9vbVNwZWVkICogdGltZXNGYXN0ZXJcclxuICAgICAgICBsZXQgeCA9IDFcclxuICAgICAgICBpZiAoem9vbUluKSB7XHJcbiAgICAgICAgICB4ID0gMSArIHNwZWVkXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiAyMCkge1xyXG4gICAgICAgICAgeCA9IDEgLSBzcGVlZFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGggKiB4XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHQgKiB4XHJcbiAgICAgICAgbGV0IG9mZnNldFggPSAoeCAtIDEpICogKHBvcy54IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WClcclxuICAgICAgICBsZXQgb2Zmc2V0WSA9ICh4IC0gMSkgKiAocG9zLnkgLSB0aGlzLmltZ0RhdGEuc3RhcnRZKVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYIC0gb2Zmc2V0WFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZIC0gb2Zmc2V0WVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMucmVhbFdpZHRoKSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMucmVhbFdpZHRoIC8gdGhpcy5pbWdEYXRhLndpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogX3hcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLmhlaWdodCA8IHRoaXMucmVhbEhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgX3ggPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLmltZ0RhdGEuaGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogX3hcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMucHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuJGVtaXQoWk9PTV9FVkVOVClcclxuICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFpbnRCYWNrZ3JvdW5kICgpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjZTZlNmU2JyA6IHRoaXMuY2FudmFzQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBiYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLnJlYWxXaWR0aCwgdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZHJhdyAoKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodClcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2VuZXJhdGVEYXRhVXJsICh0eXBlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuICcnXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCh0eXBlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2VuZXJhdGVCbG9iIChjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVybiBudWxsXHJcbiAgICAgICAgdGhpcy5jYW52YXMudG9CbG9iKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcHJvbWlzZWRCbG9iICguLi5hcmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVCbG9iKChibG9iKSA9PiB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZShibG9iKVxyXG4gICAgICAgICAgICB9LCBhcmdzKVxyXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGUgbGFuZz1cInN0eWx1c1wiPlxyXG4gIC5jcm9wcGEtY29udGFpbmVyIFxyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrXHJcbiAgICBjdXJzb3I6IHBvaW50ZXJcclxuICAgIHRyYW5zaXRpb246IGFsbCAuM3NcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZVxyXG4gICAgZm9udC1zaXplOiAwXHJcbiAgICBjYW52YXNcclxuICAgICAgdHJhbnNpdGlvbjogYWxsIC4zc1xyXG4gICAgJjpob3ZlclxyXG4gICAgICBvcGFjaXR5OiAuN1xyXG4gICAgJi5jcm9wcGEtLWRyb3B6b25lXHJcbiAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMCAxMHB4IGxpZ2h0bmVzcyhibGFjaywgMjAlKVxyXG4gICAgICBjYW52YXNcclxuICAgICAgICBvcGFjaXR5OiAuNVxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkLWNjIFxyXG4gICAgICBjdXJzb3I6IGRlZmF1bHRcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgICYuY3JvcHBhLS1oYXMtdGFyZ2V0XHJcbiAgICAgIGN1cnNvcjogbW92ZVxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICAmLmNyb3BwYS0tZGlzYWJsZWQtbXpcclxuICAgICAgICBjdXJzb3I6IGRlZmF1bHRcclxuICAgICYuY3JvcHBhLS1kaXNhYmxlZFxyXG4gICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICBzdmcuaWNvbi1yZW1vdmVcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlXHJcbiAgICAgIGJhY2tncm91bmQ6IHdoaXRlXHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDUwJVxyXG4gICAgICBib3gtc2hhZG93OiAtMnB4IDJweCA2cHggcmdiYSgwLCAwLCAwLCAwLjcpXHJcbiAgICAgIHotaW5kZXg6IDEwXHJcbiAgICAgIGN1cnNvcjogcG9pbnRlclxyXG4gICAgICBib3JkZXI6IDJweCBzb2xpZCB3aGl0ZVxyXG5cclxuPC9zdHlsZT5cclxuIiwiaW1wb3J0IGNyb3BwZXIgZnJvbSAnLi9jcm9wcGVyLnZ1ZSdcclxuXHJcbmNvbnN0IFZ1ZUNyb3BwYSA9IHtcclxuICBpbnN0YWxsOiBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XHJcbiAgICBWdWUuY29tcG9uZW50KCdjcm9wcGEnLCBjcm9wcGVyKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVnVlQ3JvcHBhIl0sIm5hbWVzIjpbInBvaW50Iiwidm0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsImV2dCIsInBvaW50ZXIiLCJ0b3VjaGVzIiwib25lUG9pbnRDb29yZCIsInBvaW50ZXIxIiwicG9pbnRlcjIiLCJjb29yZDEiLCJjb29yZDIiLCJNYXRoIiwic3FydCIsInBvdyIsIngiLCJ5IiwiaW1nIiwiY29tcGxldGUiLCJuYXR1cmFsV2lkdGgiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImxhc3RUaW1lIiwidmVuZG9ycyIsImxlbmd0aCIsIndpbmRvdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiY2FsbGJhY2siLCJjdXJyVGltZSIsIkRhdGUiLCJnZXRUaW1lIiwidGltZVRvQ2FsbCIsIm1heCIsImlkIiwic2V0VGltZW91dCIsImFyZyIsImlzQXJyYXkiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJ2YWx1ZSIsImlzRmluaXRlIiwiZmxvb3IiLCJ2YWwiLCJTdHJpbmciLCJCb29sZWFuIiwiSU5JVF9FVkVOVCIsIkZJTEVfQ0hPT1NFX0VWRU5UIiwiRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCIsIklNQUdFX1JFTU9WRSIsIk1PVkVfRVZFTlQiLCJaT09NX0VWRU5UIiwiSU5JVElBTF9JTUFHRV9MT0FEIiwiSU5JVElBTF9JTUFHRV9FUlJPUiIsInUiLCJyQUZQb2x5ZmlsbCIsInJlbmRlciIsInByb3BzIiwid2lkdGgiLCJoZWlnaHQiLCJwbGFjZWhvbGRlckZvbnRTaXplIiwiaW5pdCIsImluc3RhbmNlIiwiJHJlZnMiLCJyZWFsV2lkdGgiLCJyZWFsSGVpZ2h0Iiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjYW52YXNDb2xvciIsImN0eCIsImdldENvbnRleHQiLCIkc2xvdHMiLCJpbml0aWFsIiwic2V0SW5pdGlhbCIsInVuc2V0IiwiJGVtaXQiLCJmaWxlSW5wdXQiLCJmaWxlcyIsImFtb3VudCIsIm1vdmUiLCJ6b29tIiwiJG5leHRUaWNrIiwiY2hvb3NlRmlsZSIsImdlbmVyYXRlRGF0YVVybCIsImdlbmVyYXRlQmxvYiIsInByb21pc2VkQmxvYiIsInBhaW50QmFja2dyb3VuZCIsInRleHRCYXNlbGluZSIsInRleHRBbGlnbiIsImRlZmF1bHRGb250U2l6ZSIsInBsYWNlaG9sZGVyIiwiZm9udFNpemUiLCJyZWFsUGxhY2Vob2xkZXJGb250U2l6ZSIsImZvbnQiLCJmaWxsU3R5bGUiLCJwbGFjZWhvbGRlckNvbG9yIiwiZmlsbFRleHQiLCJoYWRJbWFnZSIsImltZ0RhdGEiLCJ2Tm9kZSIsInRhZyIsImVsbSIsInNyYyIsImltYWdlTG9hZGVkIiwiaW1nQ29udGVudEluaXQiLCJvbmxvYWQiLCJvbmVycm9yIiwiY2xpY2siLCJkaXNhYmxlQ2xpY2tUb0Nob29zZSIsImRpc2FibGVkIiwic3VwcG9ydFRvdWNoRXZlbnQiLCJpbnB1dCIsImZpbGUiLCJvbk5ld0ZpbGVJbiIsImZpbGVTaXplSXNWYWxpZCIsIkVycm9yIiwiZmlsZVNpemVMaW1pdCIsImZyIiwiRmlsZVJlYWRlciIsImUiLCJmaWxlRGF0YSIsInRhcmdldCIsInJlc3VsdCIsIkltYWdlIiwicmVhZEFzRGF0YVVSTCIsInNpemUiLCJzdGFydFgiLCJzdGFydFkiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsIm5hdHVyYWxIZWlnaHQiLCJpbWdSYXRpbyIsImNhbnZhc1JhdGlvIiwicmF0aW8iLCJkcmF3IiwidGFiU3RhcnQiLCJ2YWx1ZU9mIiwid2hpY2giLCJkcmFnZ2luZyIsInBpbmNoaW5nIiwiY29vcmQiLCJnZXRQb2ludGVyQ29vcmRzIiwibGFzdE1vdmluZ0Nvb3JkIiwiZGlzYWJsZVBpbmNoVG9ab29tIiwicGluY2hEaXN0YW5jZSIsImdldFBpbmNoRGlzdGFuY2UiLCJjYW5jZWxFdmVudHMiLCJhZGRFdmVudExpc3RlbmVyIiwiaGFuZGxlUG9pbnRlckVuZCIsInRhYkVuZCIsImRpc2FibGVEcmFnVG9Nb3ZlIiwiZGlzdGFuY2UiLCJkZWx0YSIsImRpc2FibGVTY3JvbGxUb1pvb20iLCJ3aGVlbERlbHRhIiwiZGVsdGFZIiwiZGV0YWlsIiwicmV2ZXJzZVpvb21pbmdHZXN0dXJlIiwicmV2ZXJzZVNjcm9sbFRvWm9vbSIsImRpc2FibGVEcmFnQW5kRHJvcCIsImZpbGVEcmFnZ2VkT3ZlciIsImRhdGFUcmFuc2ZlciIsIm9mZnNldCIsInByZXZlbnRXaGl0ZVNwYWNlIiwicHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSIsInpvb21JbiIsInBvcyIsInRpbWVzRmFzdGVyIiwic3BlZWQiLCJ6b29tU3BlZWQiLCJvZmZzZXRYIiwib2Zmc2V0WSIsIl94IiwiZmlsbFJlY3QiLCJkcmF3SW1hZ2UiLCJ0eXBlIiwidG9EYXRhVVJMIiwibWltZVR5cGUiLCJxdWFsaXR5QXJndW1lbnQiLCJ0b0Jsb2IiLCJhcmdzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJibG9iIiwiZXJyIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImNvbXBvbmVudCIsImNyb3BwZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsUUFBZTtlQUFBLHlCQUNDQSxLQURELEVBQ1FDLEVBRFIsRUFDWTtRQUNqQkMsTUFEaUIsR0FDR0QsRUFESCxDQUNqQkMsTUFEaUI7UUFDVEMsT0FEUyxHQUNHRixFQURILENBQ1RFLE9BRFM7O1FBRW5CQyxPQUFPRixPQUFPRyxxQkFBUCxF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
