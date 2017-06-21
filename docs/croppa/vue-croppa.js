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
  reverseZoomingGesture: Boolean,
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
          !_vm.disabled && _vm.chooseFile();
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
      if (this.img || this.disableClickToChoose) return;
      this.$refs.fileInput.click();
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
      if (!this.img) {
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

      if (evt.touches && evt.touches.length === 2) {
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
      if (!this.img) {
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

      if (evt.touches && evt.touches.length === 2) {
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
        this.zoom(this.reverseZoomingGesture, coord);
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseZoomingGesture, coord);
      }
    },
    handleDragEnter: function handleDragEnter(evt) {
      if (this.disabled || this.disableDragAndDrop || this.img) return;
      this.fileDraggedOver = true;
      console.log('enter');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi9zcmMvY3JvcHBlci52dWUiLCIuLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgb25lUG9pbnRDb29yZChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyhldnQsIHZtKSB7XHJcbiAgICBsZXQgcG9pbnRlciA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnRcclxuICAgIHJldHVybiB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlciwgdm0pXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hEaXN0YW5jZShldnQsIHZtKSB7XHJcbiAgICBsZXQgcG9pbnRlcjEgPSBldnQudG91Y2hlc1swXVxyXG4gICAgbGV0IHBvaW50ZXIyID0gZXZ0LnRvdWNoZXNbMV1cclxuICAgIGxldCBjb29yZDEgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjEsIHZtKVxyXG4gICAgbGV0IGNvb3JkMiA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMiwgdm0pXHJcblxyXG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhjb29yZDEueCAtIGNvb3JkMi54LCAyKSArIE1hdGgucG93KGNvb3JkMS55IC0gY29vcmQyLnksIDIpKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoQ2VudGVyQ29vcmQoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZChpbWcpIHtcclxuICAgIHJldHVybiBpbWcuY29tcGxldGUgJiYgaW1nLm5hdHVyYWxXaWR0aCAhPT0gMFxyXG4gIH0sXHJcblxyXG4gIHJBRlBvbHlmaWxsKCkge1xyXG4gICAgLy8gckFGIHBvbHlmaWxsXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH1cclxufSIsIk51bWJlci5pc0ludGVnZXIgPSBOdW1iZXIuaXNJbnRlZ2VyIHx8IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWVcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjZTZlNmU2J1xyXG4gIH0sXHJcbiAgcXVhbGl0eToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWwpICYmIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnaW1hZ2UvKidcclxuICB9LFxyXG4gIGZpbGVTaXplTGltaXQ6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+PSAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBkaXNhYmxlZDogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ0FuZERyb3A6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZUNsaWNrVG9DaG9vc2U6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZURyYWdUb01vdmU6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICByZXZlcnNlWm9vbWluZ0dlc3R1cmU6IEJvb2xlYW4sXHJcbiAgcHJldmVudFdoaXRlU3BhY2U6IEJvb2xlYW4sXHJcbiAgc2hvd1JlbW92ZUJ1dHRvbjoge1xyXG4gICAgdHlwZTogQm9vbGVhbixcclxuICAgIGRlZmF1bHQ6IHRydWVcclxuICB9LFxyXG4gIHJlbW92ZUJ1dHRvbkNvbG9yOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAncmVkJ1xyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uU2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyXHJcbiAgfVxyXG59IiwiPHRlbXBsYXRlPlxyXG4gIDxkaXYgOmNsYXNzPVwiYGNyb3BwYS1jb250YWluZXIgJHtpbWcgPyAnY3JvcHBhLS1oYXMtdGFyZ2V0JyA6ICcnfSAke2Rpc2FibGVkID8gJ2Nyb3BwYS0tZGlzYWJsZWQnIDogJyd9ICR7ZGlzYWJsZUNsaWNrVG9DaG9vc2UgPyAnY3JvcHBhLS1kaXNhYmxlZC1jYycgOiAnJ30gJHtkaXNhYmxlRHJhZ1RvTW92ZSAmJiBkaXNhYmxlU2Nyb2xsVG9ab29tID8gJ2Nyb3BwYS0tZGlzYWJsZWQtbXonIDogJyd9ICR7ZmlsZURyYWdnZWRPdmVyID8gJ2Nyb3BwYS0tZHJvcHpvbmUnIDogJyd9YFwiXHJcbiAgICAgICBAZHJhZ2VudGVyLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdFbnRlclwiXHJcbiAgICAgICBAZHJhZ2xlYXZlLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdMZWF2ZVwiXHJcbiAgICAgICBAZHJhZ292ZXIuc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJhZ092ZXJcIlxyXG4gICAgICAgQGRyb3Auc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJvcFwiPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCJcclxuICAgICAgICAgICA6YWNjZXB0PVwiYWNjZXB0XCJcclxuICAgICAgICAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXHJcbiAgICAgICAgICAgcmVmPVwiZmlsZUlucHV0XCJcclxuICAgICAgICAgICBoaWRkZW5cclxuICAgICAgICAgICBAY2hhbmdlPVwiaGFuZGxlSW5wdXRDaGFuZ2VcIiAvPlxyXG4gICAgPGRpdiBjbGFzcz1cImluaXRpYWxcIlxyXG4gICAgICAgICBzdHlsZT1cIndpZHRoOiAwOyBoZWlnaHQ6IDA7IHZpc2liaWxpdHk6IGhpZGRlbjtcIj5cclxuICAgICAgPHNsb3QgbmFtZT1cImluaXRpYWxcIj48L3Nsb3Q+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCJcclxuICAgICAgICAgICAgQGNsaWNrPVwiIWRpc2FibGVkICYmIGNob29zZUZpbGUoKVwiXHJcbiAgICAgICAgICAgIEB0b3VjaHN0YXJ0LnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEBtb3VzZWRvd24uc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHBvaW50ZXJzdGFydC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEB0b3VjaGNhbmNlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQG1vdXNldXAuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcmNhbmNlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNobW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBtb3VzZW1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBARE9NTW91c2VTY3JvbGwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAd2hlZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAbW91c2V3aGVlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVXaGVlbFwiPjwvY2FudmFzPlxyXG4gICAgPHN2ZyBjbGFzcz1cImljb24gaWNvbi1yZW1vdmVcIlxyXG4gICAgICAgICB2LWlmPVwic2hvd1JlbW92ZUJ1dHRvbiAmJiBpbWdcIlxyXG4gICAgICAgICBAY2xpY2s9XCJ1bnNldFwiXHJcbiAgICAgICAgIDpzdHlsZT1cImB0b3A6IC0ke2hlaWdodC80MH1weDsgcmlnaHQ6IC0ke3dpZHRoLzQwfXB4YFwiXHJcbiAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcclxuICAgICAgICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxyXG4gICAgICAgICA6d2lkdGg9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCJcclxuICAgICAgICAgOmhlaWdodD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIj5cclxuICAgICAgPHBhdGggZD1cIk01MTEuOTIxMjMxIDBDMjI5LjE3OTA3NyAwIDAgMjI5LjI1Nzg0NiAwIDUxMiAwIDc5NC43MDI3NjkgMjI5LjE3OTA3NyAxMDI0IDUxMS45MjEyMzEgMTAyNCA3OTQuNzgxNTM4IDEwMjQgMTAyNCA3OTQuNzAyNzY5IDEwMjQgNTEyIDEwMjQgMjI5LjI1Nzg0NiA3OTQuNzgxNTM4IDAgNTExLjkyMTIzMSAwWk03MzIuMDQxODQ2IDY1MC42MzM4NDYgNjUwLjUxNTY5MiA3MzIuMDgxMjMxQzY1MC41MTU2OTIgNzMyLjA4MTIzMSA1MjEuNDkxNjkyIDU5My42ODM2OTIgNTExLjg4MTg0NiA1OTMuNjgzNjkyIDUwMi40Mjk1MzggNTkzLjY4MzY5MiAzNzMuMzY2MTU0IDczMi4wODEyMzEgMzczLjM2NjE1NCA3MzIuMDgxMjMxTDI5MS43NjEyMzEgNjUwLjYzMzg0NkMyOTEuNzYxMjMxIDY1MC42MzM4NDYgNDMwLjMxNjMwOCA1MjMuNTAwMzA4IDQzMC4zMTYzMDggNTEyLjE5NjkyMyA0MzAuMzE2MzA4IDUwMC42OTY2MTUgMjkxLjc2MTIzMSAzNzMuNTIzNjkyIDI5MS43NjEyMzEgMzczLjUyMzY5MkwzNzMuMzY2MTU0IDI5MS45MTg3NjlDMzczLjM2NjE1NCAyOTEuOTE4NzY5IDUwMy40NTM1MzggNDMwLjM5NTA3NyA1MTEuODgxODQ2IDQzMC4zOTUwNzcgNTIwLjM0OTUzOCA0MzAuMzk1MDc3IDY1MC41MTU2OTIgMjkxLjkxODc2OSA2NTAuNTE1NjkyIDI5MS45MTg3NjlMNzMyLjA0MTg0NiAzNzMuNTIzNjkyQzczMi4wNDE4NDYgMzczLjUyMzY5MiA1OTMuNDQ3Mzg1IDUwMi41NDc2OTIgNTkzLjQ0NzM4NSA1MTIuMTk2OTIzIDU5My40NDczODUgNTIxLjQxMjkyMyA3MzIuMDQxODQ2IDY1MC42MzM4NDYgNzMyLjA0MTg0NiA2NTAuNjMzODQ2WlwiXHJcbiAgICAgICAgICAgIDpmaWxsPVwicmVtb3ZlQnV0dG9uQ29sb3JcIj48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xyXG4gIGltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xyXG5cclxuICBjb25zdCBJTklUX0VWRU5UID0gJ2luaXQnXHJcbiAgY29uc3QgRklMRV9DSE9PU0VfRVZFTlQgPSAnZmlsZS1jaG9vc2UnXHJcbiAgY29uc3QgRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCA9ICdmaWxlLXNpemUtZXhjZWVkJ1xyXG4gIGNvbnN0IElNQUdFX1JFTU9WRSA9ICdpbWFnZS1yZW1vdmUnXHJcbiAgY29uc3QgTU9WRV9FVkVOVCA9ICdtb3ZlJ1xyXG4gIGNvbnN0IFpPT01fRVZFTlQgPSAnem9vbSdcclxuICBjb25zdCBJTklUSUFMX0lNQUdFX0xPQUQgPSAnaW5pdGlhbC1pbWFnZS1sb2FkJ1xyXG4gIGNvbnN0IElOSVRJQUxfSU1BR0VfRVJST1IgPSAnaW5pdGlhbC1pbWFnZS1lcnJvcidcclxuXHJcbiAgdS5yQUZQb2x5ZmlsbCgpXHJcblxyXG4gIGV4cG9ydCBkZWZhdWx0IHtcclxuICAgIG1vZGVsOiB7XHJcbiAgICAgIHByb3A6ICd2YWx1ZScsXHJcbiAgICAgIGV2ZW50OiAnaW5pdCdcclxuICAgIH0sXHJcblxyXG4gICAgcHJvcHM6IHByb3BzLFxyXG5cclxuICAgIGRhdGEgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGluc3RhbmNlOiBudWxsLFxyXG4gICAgICAgIGNhbnZhczogbnVsbCxcclxuICAgICAgICBjdHg6IG51bGwsXHJcbiAgICAgICAgaW1nOiBudWxsLFxyXG4gICAgICAgIGRyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgICBsYXN0TW92aW5nQ29vcmQ6IG51bGwsXHJcbiAgICAgICAgaW1nRGF0YToge30sXHJcbiAgICAgICAgZGF0YVVybDogJycsXHJcbiAgICAgICAgZmlsZURyYWdnZWRPdmVyOiBmYWxzZSxcclxuICAgICAgICB0YWJTdGFydDogMCxcclxuICAgICAgICBwaW5jaGluZzogZmFsc2UsXHJcbiAgICAgICAgcGluY2hEaXN0YW5jZTogMFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgIHJlYWxXaWR0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlYWxIZWlnaHQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVhbFBsYWNlaG9sZGVyRm9udFNpemUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyRm9udFNpemUgKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtb3VudGVkICgpIHtcclxuICAgICAgdGhpcy5pbml0KClcclxuICAgIH0sXHJcblxyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlID0gdmFsXHJcbiAgICAgIH0sXHJcbiAgICAgIHJlYWxXaWR0aDogJ2luaXQnLFxyXG4gICAgICByZWFsSGVpZ2h0OiAnaW5pdCcsXHJcbiAgICAgIGNhbnZhc0NvbG9yOiAnaW5pdCcsXHJcbiAgICAgIHBsYWNlaG9sZGVyOiAnaW5pdCcsXHJcbiAgICAgIHBsYWNlaG9sZGVyQ29sb3I6ICdpbml0JyxcclxuICAgICAgcmVhbFBsYWNlaG9sZGVyRm9udFNpemU6ICdpbml0JyxcclxuICAgICAgcHJldmVudFdoaXRlU3BhY2U6ICdpbWdDb250ZW50SW5pdCdcclxuICAgIH0sXHJcblxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICBpbml0ICgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJHJlZnMuY2FudmFzXHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArICdweCdcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArICdweCdcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJyNlNmU2ZTYnIDogKHR5cGVvZiB0aGlzLmNhbnZhc0NvbG9yID09PSAnc3RyaW5nJyA/IHRoaXMuY2FudmFzQ29sb3IgOiAnJylcclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuICAgICAgICBpZiAodGhpcy4kc2xvdHMuaW5pdGlhbCAmJiB0aGlzLiRzbG90cy5pbml0aWFsWzBdKSB7XHJcbiAgICAgICAgICB0aGlzLnNldEluaXRpYWwoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4kZW1pdChJTklUX0VWRU5ULCB7XHJcbiAgICAgICAgICBnZXRDYW52YXM6ICgpID0+IHRoaXMuY2FudmFzLFxyXG4gICAgICAgICAgZ2V0Q29udGV4dDogKCkgPT4gdGhpcy5jdHgsXHJcbiAgICAgICAgICBnZXRDaG9zZW5GaWxlOiAoKSA9PiB0aGlzLiRyZWZzLmZpbGVJbnB1dC5maWxlc1swXSxcclxuICAgICAgICAgIGdldEFjdHVhbEltYWdlU2l6ZTogKCkgPT4gKHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucmVhbFdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICBtb3ZlVXB3YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiAtYW1vdW50IH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZURvd253YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiBhbW91bnQgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlTGVmdHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IC1hbW91bnQsIHk6IDAgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlUmlnaHR3YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiBhbW91bnQsIHk6IDAgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB6b29tSW46ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKHRydWUpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgem9vbU91dDogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnpvb20oZmFsc2UpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVmcmVzaDogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLmluaXQpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVzZXQ6IHRoaXMudW5zZXQsXHJcbiAgICAgICAgICBjaG9vc2VGaWxlOiB0aGlzLmNob29zZUZpbGUsXHJcbiAgICAgICAgICBnZW5lcmF0ZURhdGFVcmw6IHRoaXMuZ2VuZXJhdGVEYXRhVXJsLFxyXG4gICAgICAgICAgZ2VuZXJhdGVCbG9iOiB0aGlzLmdlbmVyYXRlQmxvYixcclxuICAgICAgICAgIHByb21pc2VkQmxvYjogdGhpcy5wcm9taXNlZEJsb2JcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgdW5zZXQgKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIHRoaXMucGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSdcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcidcclxuICAgICAgICBsZXQgZGVmYXVsdEZvbnRTaXplID0gdGhpcy5yZWFsV2lkdGggLyAxLjUgLyB0aGlzLnBsYWNlaG9sZGVyLmxlbmd0aFxyXG4gICAgICAgIGxldCBmb250U2l6ZSA9ICghdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZSB8fCB0aGlzLnJlYWxQbGFjZWhvbGRlckZvbnRTaXplID09IDApID8gZGVmYXVsdEZvbnRTaXplIDogdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZVxyXG4gICAgICAgIGN0eC5mb250ID0gZm9udFNpemUgKyAncHggc2Fucy1zZXJpZidcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gKCF0aGlzLnBsYWNlaG9sZGVyQ29sb3IgfHwgdGhpcy5wbGFjZWhvbGRlckNvbG9yID09ICdkZWZhdWx0JykgPyAnIzYwNjA2MCcgOiB0aGlzLnBsYWNlaG9sZGVyQ29sb3JcclxuICAgICAgICBjdHguZmlsbFRleHQodGhpcy5wbGFjZWhvbGRlciwgdGhpcy5yZWFsV2lkdGggLyAyLCB0aGlzLnJlYWxIZWlnaHQgLyAyKVxyXG5cclxuICAgICAgICBsZXQgaGFkSW1hZ2UgPSB0aGlzLmltZyAhPSBudWxsXHJcbiAgICAgICAgdGhpcy5pbWcgPSBudWxsXHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQudmFsdWUgPSAnJ1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YSA9IHt9XHJcblxyXG4gICAgICAgIGlmIChoYWRJbWFnZSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChJTUFHRV9SRU1PVkUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2V0SW5pdGlhbCAoKSB7XHJcbiAgICAgICAgbGV0IHZOb2RlID0gdGhpcy4kc2xvdHMuaW5pdGlhbFswXVxyXG4gICAgICAgIGxldCB7IHRhZywgZWxtIH0gPSB2Tm9kZVxyXG4gICAgICAgIGlmICh0YWcgIT09ICdpbWcnIHx8ICFlbG0gfHwgIWVsbS5zcmMpIHtcclxuICAgICAgICAgIHRoaXMudW5zZXQoKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh1LmltYWdlTG9hZGVkKGVsbSkpIHtcclxuICAgICAgICAgIHRoaXMuaW1nID0gZWxtXHJcbiAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZWxtLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy4kZW1pdChJTklUSUFMX0lNQUdFX0xPQUQpXHJcbiAgICAgICAgICAgIHRoaXMuaW1nID0gZWxtXHJcbiAgICAgICAgICAgIHRoaXMuaW1nQ29udGVudEluaXQoKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGVsbS5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRlbWl0KElOSVRJQUxfSU1BR0VfRVJST1IpXHJcbiAgICAgICAgICAgIHRoaXMudW5zZXQoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNob29zZUZpbGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmltZyB8fCB0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSByZXR1cm5cclxuICAgICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC5jbGljaygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVJbnB1dENoYW5nZSAoKSB7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gdGhpcy4kcmVmcy5maWxlSW5wdXRcclxuICAgICAgICBpZiAoIWlucHV0LmZpbGVzLmxlbmd0aCkgcmV0dXJuXHJcblxyXG4gICAgICAgIGxldCBmaWxlID0gaW5wdXQuZmlsZXNbMF1cclxuICAgICAgICB0aGlzLm9uTmV3RmlsZUluKGZpbGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBvbk5ld0ZpbGVJbiAoZmlsZSkge1xyXG4gICAgICAgIHRoaXMuJGVtaXQoRklMRV9DSE9PU0VfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVTaXplSXNWYWxpZChmaWxlKSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChGSUxFX1NJWkVfRVhDRUVEX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaWxlIHNpemUgZXhjZWVkcyBsaW1pdCB3aGljaCBpcyAnICsgdGhpcy5maWxlU2l6ZUxpbWl0ICsgJyBieXRlcy4nKVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZnIgPSBuZXcgRmlsZVJlYWRlcigpXHJcbiAgICAgICAgZnIub25sb2FkID0gKGUpID0+IHtcclxuICAgICAgICAgIGxldCBmaWxlRGF0YSA9IGUudGFyZ2V0LnJlc3VsdFxyXG4gICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICBpbWcuc3JjID0gZmlsZURhdGFcclxuICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1nID0gaW1nXHJcbiAgICAgICAgICAgIHRoaXMuaW1nQ29udGVudEluaXQoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmci5yZWFkQXNEYXRhVVJMKGZpbGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmaWxlU2l6ZUlzVmFsaWQgKGZpbGUpIHtcclxuICAgICAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUxpbWl0IHx8IHRoaXMuZmlsZVNpemVMaW1pdCA9PSAwKSByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICAgICByZXR1cm4gZmlsZS5zaXplIDwgdGhpcy5maWxlU2l6ZUxpbWl0XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBpbWdDb250ZW50SW5pdCAoKSB7XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMuaW1nLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLmltZy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgICAgbGV0IGltZ1JhdGlvID0gaW1nSGVpZ2h0IC8gaW1nV2lkdGhcclxuICAgICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLnJlYWxXaWR0aFxyXG5cclxuICAgICAgICAvLyBkaXNwbGF5IGFzIGZpdFxyXG4gICAgICAgIGlmIChpbWdSYXRpbyA8IGNhbnZhc1JhdGlvKSB7XHJcbiAgICAgICAgICBsZXQgcmF0aW8gPSBpbWdIZWlnaHQgLyB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gcmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHJhdGlvID0gaW1nV2lkdGggLyB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlclN0YXJ0IChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgLy8gc2ltdWxhdGUgY2xpY2sgd2l0aCB0b3VjaCBvbiBtb2JpbGUgZGV2aWNlc1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMudGFiU3RhcnQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlnbm9yZSBtb3VzZSByaWdodCBjbGljayBhbmQgbWlkZGxlIGNsaWNrXHJcbiAgICAgICAgaWYgKGV2dC53aGljaCAmJiBldnQud2hpY2ggPiAxKSByZXR1cm5cclxuXHJcbiAgICAgICAgaWYgKCFldnQudG91Y2hlcyB8fCBldnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlXHJcbiAgICAgICAgICB0aGlzLnBpbmNoaW5nID0gZmFsc2VcclxuICAgICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSB0cnVlXHJcbiAgICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRvY3VtZW50KSB7XHJcbiAgICAgICAgICBsZXQgY2FuY2VsRXZlbnRzID0gWydtb3VzZXVwJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJywgJ3BvaW50ZXJlbmQnLCAncG9pbnRlcmNhbmNlbCddXHJcbiAgICAgICAgICBmb3IgKGxldCBlIG9mIGNhbmNlbEV2ZW50cykge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuaGFuZGxlUG9pbnRlckVuZClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyRW5kIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgbGV0IHRhYkVuZCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICBpZiAodGFiRW5kIC0gdGhpcy50YWJTdGFydCA8IDEwMDApIHtcclxuICAgICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMudGFiU3RhcnQgPSAwXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IDBcclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IG51bGxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnVG9Nb3ZlIHx8ICF0aGlzLmltZykgcmV0dXJuXHJcblxyXG4gICAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxyXG4gICAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIGlmICh0aGlzLmxhc3RNb3ZpbmdDb29yZCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoe1xyXG4gICAgICAgICAgICAgIHg6IGNvb3JkLnggLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC54LFxyXG4gICAgICAgICAgICAgIHk6IGNvb3JkLnkgLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC55XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMucGluY2hpbmcpIHJldHVyblxyXG4gICAgICAgICAgbGV0IGRpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcclxuICAgICAgICAgIGxldCBkZWx0YSA9IGRpc3RhbmNlIC0gdGhpcy5waW5jaERpc3RhbmNlXHJcbiAgICAgICAgICB0aGlzLnpvb20oZGVsdGEgPiAwLCBudWxsLCAyKVxyXG4gICAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gZGlzdGFuY2VcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVXaGVlbCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlU2Nyb2xsVG9ab29tIHx8ICF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICBpZiAoZXZ0LndoZWVsRGVsdGEgPCAwIHx8IGV2dC5kZWx0YVkgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlWm9vbWluZ0dlc3R1cmUsIGNvb3JkKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LndoZWVsRGVsdGEgPiAwIHx8IGV2dC5kZWx0YVkgPCAwIHx8IGV2dC5kZXRhaWwgPCAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20oIXRoaXMucmV2ZXJzZVpvb21pbmdHZXN0dXJlLCBjb29yZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcmFnRW50ZXIgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdBbmREcm9wIHx8IHRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IHRydWVcclxuICAgICAgICBjb25zb2xlLmxvZygnZW50ZXInKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ0xlYXZlIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnQW5kRHJvcCB8fCB0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ092ZXIgKGV2dCkge1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJvcCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ0FuZERyb3AgfHwgdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGlmICghZXZ0LmRhdGFUcmFuc2ZlciB8fCAhZXZ0LmRhdGFUcmFuc2Zlci5maWxlcy5sZW5ndGgpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuICAgICAgICBsZXQgZmlsZSA9IGV2dC5kYXRhVHJhbnNmZXIuZmlsZXNbMF1cclxuICAgICAgICB0aGlzLm9uTmV3RmlsZUluKGZpbGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlIChvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIW9mZnNldCkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgKz0gb2Zmc2V0LnlcclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4kZW1pdChNT1ZFX0VWRU5UKVxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRZID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVhbFdpZHRoIC0gdGhpcy5pbWdEYXRhLnN0YXJ0WCA+IHRoaXMuaW1nRGF0YS53aWR0aCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5yZWFsV2lkdGgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlYWxIZWlnaHQgLSB0aGlzLmltZ0RhdGEuc3RhcnRZID4gdGhpcy5pbWdEYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB6b29tICh6b29tSW4sIHBvcywgdGltZXNGYXN0ZXIgPSAxKSB7XHJcbiAgICAgICAgcG9zID0gcG9zIHx8IHtcclxuICAgICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxyXG4gICAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBzcGVlZCA9ICh0aGlzLnJlYWxXaWR0aCAvIDEwMDAwMCkgKiB0aGlzLnpvb21TcGVlZCAqIHRpbWVzRmFzdGVyXHJcbiAgICAgICAgbGV0IHggPSAxXHJcbiAgICAgICAgaWYgKHpvb21Jbikge1xyXG4gICAgICAgICAgeCA9IDEgKyBzcGVlZFxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbWdEYXRhLndpZHRoID4gMjApIHtcclxuICAgICAgICAgIHggPSAxIC0gc3BlZWRcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogeFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogeFxyXG4gICAgICAgIGxldCBvZmZzZXRYID0gKHggLSAxKSAqIChwb3MueCAtIHRoaXMuaW1nRGF0YS5zdGFydFgpXHJcbiAgICAgICAgbGV0IG9mZnNldFkgPSAoeCAtIDEpICogKHBvcy55IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSlcclxuICAgICAgICBjb25zb2xlLmxvZyhvZmZzZXRYLCBvZmZzZXRZKVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYIC0gb2Zmc2V0WFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZIC0gb2Zmc2V0WVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMucmVhbFdpZHRoKSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMucmVhbFdpZHRoIC8gdGhpcy5pbWdEYXRhLndpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogX3hcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLmhlaWdodCA8IHRoaXMucmVhbEhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgX3ggPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLmltZ0RhdGEuaGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogX3hcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMucHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuJGVtaXQoWk9PTV9FVkVOVClcclxuICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFpbnRCYWNrZ3JvdW5kICgpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjZTZlNmU2JyA6IHRoaXMuY2FudmFzQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBiYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLnJlYWxXaWR0aCwgdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZHJhdyAoKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodClcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2VuZXJhdGVEYXRhVXJsICh0eXBlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuICcnXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCh0eXBlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2VuZXJhdGVCbG9iIChjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVybiBudWxsXHJcbiAgICAgICAgdGhpcy5jYW52YXMudG9CbG9iKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcHJvbWlzZWRCbG9iICguLi5hcmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVCbG9iKChibG9iKSA9PiB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZShibG9iKVxyXG4gICAgICAgICAgICB9LCBhcmdzKVxyXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGUgbGFuZz1cInN0eWx1c1wiPlxyXG4gIC5jcm9wcGEtY29udGFpbmVyIFxyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrXHJcbiAgICBjdXJzb3I6IHBvaW50ZXJcclxuICAgIHRyYW5zaXRpb246IGFsbCAuM3NcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZVxyXG4gICAgZm9udC1zaXplOiAwXHJcbiAgICBjYW52YXNcclxuICAgICAgdHJhbnNpdGlvbjogYWxsIC4zc1xyXG4gICAgJjpob3ZlclxyXG4gICAgICBvcGFjaXR5OiAuN1xyXG4gICAgJi5jcm9wcGEtLWRyb3B6b25lXHJcbiAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMCAxMHB4IGxpZ2h0bmVzcyhibGFjaywgMjAlKVxyXG4gICAgICBjYW52YXNcclxuICAgICAgICBvcGFjaXR5OiAuNVxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkLWNjIFxyXG4gICAgICBjdXJzb3I6IGRlZmF1bHRcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgICYuY3JvcHBhLS1oYXMtdGFyZ2V0XHJcbiAgICAgIGN1cnNvcjogbW92ZVxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICAmLmNyb3BwYS0tZGlzYWJsZWQtbXpcclxuICAgICAgICBjdXJzb3I6IGRlZmF1bHRcclxuICAgICYuY3JvcHBhLS1kaXNhYmxlZFxyXG4gICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICBzdmcuaWNvbi1yZW1vdmVcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlXHJcbiAgICAgIGJhY2tncm91bmQ6IHdoaXRlXHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDUwJVxyXG4gICAgICBib3gtc2hhZG93OiAtMnB4IDJweCA2cHggcmdiYSgwLCAwLCAwLCAwLjcpXHJcbiAgICAgIHotaW5kZXg6IDEwXHJcbiAgICAgIGN1cnNvcjogcG9pbnRlclxyXG4gICAgICBib3JkZXI6IDJweCBzb2xpZCB3aGl0ZVxyXG5cclxuPC9zdHlsZT5cclxuIiwiaW1wb3J0IGNyb3BwZXIgZnJvbSAnLi9jcm9wcGVyLnZ1ZSdcclxuXHJcbmNvbnN0IFZ1ZUNyb3BwYSA9IHtcclxuICBpbnN0YWxsOiBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XHJcbiAgICBWdWUuY29tcG9uZW50KCdjcm9wcGEnLCBjcm9wcGVyKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVnVlQ3JvcHBhIl0sIm5hbWVzIjpbInBvaW50Iiwidm0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsImV2dCIsInBvaW50ZXIiLCJ0b3VjaGVzIiwib25lUG9pbnRDb29yZCIsInBvaW50ZXIxIiwicG9pbnRlcjIiLCJjb29yZDEiLCJjb29yZDIiLCJNYXRoIiwic3FydCIsInBvdyIsIngiLCJ5IiwiaW1nIiwiY29tcGxldGUiLCJuYXR1cmFsV2lkdGgiLCJsYXN0VGltZSIsInZlbmRvcnMiLCJsZW5ndGgiLCJ3aW5kb3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImNhbGxiYWNrIiwiY3VyclRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInRpbWVUb0NhbGwiLCJtYXgiLCJpZCIsInNldFRpbWVvdXQiLCJhcmciLCJpc0FycmF5IiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidmFsdWUiLCJpc0Zpbml0ZSIsImZsb29yIiwidmFsIiwiU3RyaW5nIiwiQm9vbGVhbiIsIklOSVRfRVZFTlQiLCJGSUxFX0NIT09TRV9FVkVOVCIsIkZJTEVfU0laRV9FWENFRURfRVZFTlQiLCJJTUFHRV9SRU1PVkUiLCJNT1ZFX0VWRU5UIiwiWk9PTV9FVkVOVCIsIklOSVRJQUxfSU1BR0VfTE9BRCIsIklOSVRJQUxfSU1BR0VfRVJST1IiLCJ1IiwickFGUG9seWZpbGwiLCJyZW5kZXIiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwicGxhY2Vob2xkZXJGb250U2l6ZSIsImluaXQiLCJpbnN0YW5jZSIsIiRyZWZzIiwicmVhbFdpZHRoIiwicmVhbEhlaWdodCIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY2FudmFzQ29sb3IiLCJjdHgiLCJnZXRDb250ZXh0IiwiJHNsb3RzIiwiaW5pdGlhbCIsInNldEluaXRpYWwiLCJ1bnNldCIsIiRlbWl0IiwiZmlsZUlucHV0IiwiZmlsZXMiLCJhbW91bnQiLCJtb3ZlIiwiem9vbSIsIiRuZXh0VGljayIsImNob29zZUZpbGUiLCJnZW5lcmF0ZURhdGFVcmwiLCJnZW5lcmF0ZUJsb2IiLCJwcm9taXNlZEJsb2IiLCJwYWludEJhY2tncm91bmQiLCJ0ZXh0QmFzZWxpbmUiLCJ0ZXh0QWxpZ24iLCJkZWZhdWx0Rm9udFNpemUiLCJwbGFjZWhvbGRlciIsImZvbnRTaXplIiwicmVhbFBsYWNlaG9sZGVyRm9udFNpemUiLCJmb250IiwiZmlsbFN0eWxlIiwicGxhY2Vob2xkZXJDb2xvciIsImZpbGxUZXh0IiwiaGFkSW1hZ2UiLCJpbWdEYXRhIiwidk5vZGUiLCJ0YWciLCJlbG0iLCJzcmMiLCJpbWFnZUxvYWRlZCIsImltZ0NvbnRlbnRJbml0Iiwib25sb2FkIiwib25lcnJvciIsImRpc2FibGVDbGlja1RvQ2hvb3NlIiwiY2xpY2siLCJpbnB1dCIsImZpbGUiLCJvbk5ld0ZpbGVJbiIsImZpbGVTaXplSXNWYWxpZCIsIkVycm9yIiwiZmlsZVNpemVMaW1pdCIsImZyIiwiRmlsZVJlYWRlciIsImUiLCJmaWxlRGF0YSIsInRhcmdldCIsInJlc3VsdCIsIkltYWdlIiwicmVhZEFzRGF0YVVSTCIsInNpemUiLCJzdGFydFgiLCJzdGFydFkiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsIm5hdHVyYWxIZWlnaHQiLCJpbWdSYXRpbyIsImNhbnZhc1JhdGlvIiwicmF0aW8iLCJkcmF3IiwiZGlzYWJsZWQiLCJ0YWJTdGFydCIsInZhbHVlT2YiLCJ3aGljaCIsImRyYWdnaW5nIiwicGluY2hpbmciLCJjb29yZCIsImdldFBvaW50ZXJDb29yZHMiLCJsYXN0TW92aW5nQ29vcmQiLCJwaW5jaERpc3RhbmNlIiwiZ2V0UGluY2hEaXN0YW5jZSIsImRvY3VtZW50IiwiY2FuY2VsRXZlbnRzIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZVBvaW50ZXJFbmQiLCJ0YWJFbmQiLCJkaXNhYmxlRHJhZ1RvTW92ZSIsImRpc3RhbmNlIiwiZGVsdGEiLCJkaXNhYmxlU2Nyb2xsVG9ab29tIiwid2hlZWxEZWx0YSIsImRlbHRhWSIsImRldGFpbCIsInJldmVyc2Vab29taW5nR2VzdHVyZSIsImRpc2FibGVEcmFnQW5kRHJvcCIsImZpbGVEcmFnZ2VkT3ZlciIsImxvZyIsImRhdGFUcmFuc2ZlciIsIm9mZnNldCIsInByZXZlbnRXaGl0ZVNwYWNlIiwicHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSIsInpvb21JbiIsInBvcyIsInRpbWVzRmFzdGVyIiwic3BlZWQiLCJ6b29tU3BlZWQiLCJvZmZzZXRYIiwib2Zmc2V0WSIsIl94IiwiZmlsbFJlY3QiLCJkcmF3SW1hZ2UiLCJ0eXBlIiwidG9EYXRhVVJMIiwibWltZVR5cGUiLCJxdWFsaXR5QXJndW1lbnQiLCJ0b0Jsb2IiLCJhcmdzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJibG9iIiwiZXJyIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImNvbXBvbmVudCIsImNyb3BwZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsUUFBZTtlQUFBLHlCQUNDQSxLQURELEVBQ1FDLEVBRFIsRUFDWTtRQUNqQkMsTUFEaUIsR0FDR0QsRUFESCxDQUNqQkMsTUFEaUI7UUFDVEMsT0FEUyxHQUNHRixFQURILENBQ1RFLE9BRFM7O1FBRW5CQyxPQUFPRixPQUFPRyxxQkFBUCxFQUFYO1FBQ0lDLFVBQVVOLE1BQU1NLE9BQXBCO1FBQ0lDLFVBQVVQLE1BQU1PLE9BQXBCO1dBQ087U0FDRixDQUFDRCxVQUFVRixLQUFLSSxJQUFoQixJQUF3QkwsT0FEdEI7U0FFRixDQUFDSSxVQUFVSCxLQUFLSyxHQUFoQixJQUF1Qk47S0FGNUI7R0FOVztrQkFBQSw0QkFZSU8sR0FaSixFQVlTVCxFQVpULEVBWWE7UUFDcEJVLFVBQVVELElBQUlFLE9BQUosR0FBY0YsSUFBSUUsT0FBSixDQUFZLENBQVosQ0FBZCxHQUErQkYsR0FBN0M7V0FDTyxLQUFLRyxhQUFMLENBQW1CRixPQUFuQixFQUE0QlYsRUFBNUIsQ0FBUDtHQWRXO2tCQUFBLDRCQWlCSVMsR0FqQkosRUFpQlNULEVBakJULEVBaUJhO1FBQ3BCYSxXQUFXSixJQUFJRSxPQUFKLENBQVksQ0FBWixDQUFmO1FBQ0lHLFdBQVdMLElBQUlFLE9BQUosQ0FBWSxDQUFaLENBQWY7UUFDSUksU0FBUyxLQUFLSCxhQUFMLENBQW1CQyxRQUFuQixFQUE2QmIsRUFBN0IsQ0FBYjtRQUNJZ0IsU0FB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
