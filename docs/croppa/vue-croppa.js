/*
 * vue-croppa v0.0.3
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
  getPointerCoords: function getPointerCoords(evt, cropperVM) {
    var canvas = cropperVM.canvas,
        quality = cropperVM.quality;

    var rect = canvas.getBoundingClientRect();
    var clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    var clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return {
      x: (clientX - rect.left) * quality,
      y: (clientY - rect.top) * quality
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
var MOVE_EVENT = 'move';
var ZOOM_EVENT = 'zoom';
var INITIAL_IMAGE_LOAD = 'initial-image-load';
var INITIAL_IMAGE_ERROR = 'initial-image-error';

var cropper = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') + ' ' + (_vm.disabled ? 'croppa--disabled' : '') + ' ' + (_vm.disableClickToChoose ? 'croppa--disabled-cc' : '') + ' ' + (_vm.disableDragToMove && _vm.disableScrollToZoom ? 'croppa--disabled-mz' : '') }, [_c('input', { ref: "fileInput", attrs: { "type": "file", "accept": _vm.accept, "disabled": _vm.disabled, "hidden": "" }, on: { "change": _vm.handleInputChange } }), _c('div', { staticClass: "initial", staticStyle: { "width": "0", "height": "0", "visibility": "hidden" } }, [_vm._t("initial")], 2), _c('canvas', { ref: "canvas", on: { "click": function click($event) {
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
      initialLoading: false
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
          _this.zoom(true, {
            x: _this.imgData.startX + _this.imgData.width / 2,
            y: _this.imgData.startY + _this.imgData.height / 2
          });
        },
        zoomOut: function zoomOut() {
          _this.zoom(false, {
            x: _this.imgData.startX + _this.imgData.width / 2,
            y: _this.imgData.startY + _this.imgData.height / 2
          });
        },
        refresh: this.init,
        reset: this.unset,
        chooseFile: this.chooseFile,
        generateDataUrl: this.generateDataUrl,
        generateBlob: this.generateBlob,
        promisedBlob: this.promisedBlob
      });
    },
    unset: function unset() {
      var ctx = this.ctx;
      ctx.clearRect(0, 0, this.realWidth, this.realHeight);
      this.paintBackground();
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      var defaultFontSize = this.realWidth / 1.5 / this.placeholder.length;
      var fontSize = !this.realPlaceholderFontSize || this.realPlaceholderFontSize == 0 ? defaultFontSize : this.realPlaceholderFontSize;
      ctx.font = fontSize + 'px sans-serif';
      ctx.fillStyle = !this.placeholderColor || this.placeholderColor == 'default' ? '#606060' : this.placeholderColor;
      ctx.fillText(this.placeholder, this.realWidth / 2, this.realHeight / 2);
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imgData = {};
    },
    setInitial: function setInitial() {
      var _this2 = this;

      var vNode = this.$slots.initial[0];
      var tag = vNode.tag,
          elm = vNode.elm;

      if (tag !== 'img' || !elm || !elm.src) {
        this.unset();
      }
      this.initialLoading = true;
      elm.onload = function () {
        _this2.$emit(INITIAL_IMAGE_LOAD);
        _this2.img = elm;
        _this2.imgContentInit();
      };

      elm.onerror = function () {
        _this2.$emit(INITIAL_IMAGE_ERROR);
        _this2.unset();
      };
    },
    chooseFile: function chooseFile() {
      if (this.img || this.disableClickToChoose) return;
      this.$refs.fileInput.click();
    },
    handleInputChange: function handleInputChange() {
      var _this3 = this;

      var input = this.$refs.fileInput;
      if (!input.files.length) return;

      var file = input.files[0];
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
      if (evt.which && evt.which > 1) return;
      this.dragging = true;

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
      this.dragging = false;
      this.lastMovingCoord = null;
    },
    handlePointerMove: function handlePointerMove(evt) {
      if (this.disabled || this.disableDragToMove) return;
      if (!this.dragging) return;
      var coord = u.getPointerCoords(evt, this);
      if (this.lastMovingCoord) {
        this.move({
          x: coord.x - this.lastMovingCoord.x,
          y: coord.y - this.lastMovingCoord.y
        });
      }
      this.lastMovingCoord = coord;
    },
    handleWheel: function handleWheel(evt) {
      if (this.disabled || this.disableScrollToZoom) return;
      var coord = u.getPointerCoords(evt, this);
      if (evt.wheelDelta < 0 || evt.detail < 0) {
        // 手指向上
        this.zoom(this.reverseZoomingGesture, coord);
      } else if (evt.wheelDelta > 0 || evt.detail > 0) {
        // 手指向下
        this.zoom(!this.reverseZoomingGesture, coord);
      }
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
      var speed = this.realWidth / 100000 * this.zoomSpeed;
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
          var _x2 = this.realHeight / this.imgData.height;
          this.imgData.height = this.realHeight;
          this.imgData.width = this.imgData.width * _x2;
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
      var ctx = this.ctx;
      if (!this.img) return;
      var _imgData = this.imgData,
          startX = _imgData.startX,
          startY = _imgData.startY,
          width = _imgData.width,
          height = _imgData.height;

      ctx.clearRect(0, 0, this.realWidth, this.realHeight);
      this.paintBackground();
      ctx.drawImage(this.img, startX, startY, width, height);
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
      var _this4 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new Promise(function (resolve, reject) {
        try {
          _this4.generateBlob(function (blob) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi9zcmMvY3JvcHBlci52dWUiLCIuLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgZ2V0UG9pbnRlckNvb3JkcyhldnQsIGNyb3BwZXJWTSkge1xyXG4gICAgbGV0IHsgY2FudmFzLCBxdWFsaXR5IH0gPSBjcm9wcGVyVk1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WCA6IGV2dC5jbGllbnRYXHJcbiAgICBsZXQgY2xpZW50WSA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WSA6IGV2dC5jbGllbnRZXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiAoY2xpZW50WCAtIHJlY3QubGVmdCkgKiBxdWFsaXR5LFxyXG4gICAgICB5OiAoY2xpZW50WSAtIHJlY3QudG9wKSAqIHF1YWxpdHlcclxuICAgIH1cclxuICB9XHJcbn0iLCJOdW1iZXIuaXNJbnRlZ2VyID0gTnVtYmVyLmlzSW50ZWdlciB8fCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB2YWx1ZTogT2JqZWN0LFxyXG4gIHdpZHRoOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGhlaWdodDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMjAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBwbGFjZWhvbGRlcjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ0Nob29zZSBhbiBpbWFnZSdcclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjNjA2MDYwJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJGb250U2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGNhbnZhc0NvbG9yOiB7XHJcbiAgICBkZWZhdWx0OiAnI2U2ZTZlNidcclxuICB9LFxyXG4gIHF1YWxpdHk6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIodmFsKSAmJiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICB6b29tU3BlZWQ6IHtcclxuICAgIGRlZmF1bHQ6IDMsXHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGFjY2VwdDoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ2ltYWdlLyonXHJcbiAgfSxcclxuICBmaWxlU2l6ZUxpbWl0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZGlzYWJsZWQ6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZUNsaWNrVG9DaG9vc2U6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZURyYWdUb01vdmU6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICByZXZlcnNlWm9vbWluZ0dlc3R1cmU6IEJvb2xlYW4sXHJcbiAgcHJldmVudFdoaXRlU3BhY2U6IEJvb2xlYW4sXHJcbiAgc2hvd1JlbW92ZUJ1dHRvbjoge1xyXG4gICAgdHlwZTogQm9vbGVhbixcclxuICAgIGRlZmF1bHQ6IHRydWVcclxuICB9LFxyXG4gIHJlbW92ZUJ1dHRvbkNvbG9yOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAncmVkJ1xyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uU2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyXHJcbiAgfVxyXG59IiwiPHRlbXBsYXRlPlxyXG4gIDxkaXYgOmNsYXNzPVwiYGNyb3BwYS1jb250YWluZXIgJHtpbWcgPyAnY3JvcHBhLS1oYXMtdGFyZ2V0JyA6ICcnfSAke2Rpc2FibGVkID8gJ2Nyb3BwYS0tZGlzYWJsZWQnIDogJyd9ICR7ZGlzYWJsZUNsaWNrVG9DaG9vc2UgPyAnY3JvcHBhLS1kaXNhYmxlZC1jYycgOiAnJ30gJHtkaXNhYmxlRHJhZ1RvTW92ZSAmJiBkaXNhYmxlU2Nyb2xsVG9ab29tID8gJ2Nyb3BwYS0tZGlzYWJsZWQtbXonIDogJyd9YFwiPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCJcclxuICAgICAgICAgICA6YWNjZXB0PVwiYWNjZXB0XCJcclxuICAgICAgICAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXHJcbiAgICAgICAgICAgcmVmPVwiZmlsZUlucHV0XCJcclxuICAgICAgICAgICBoaWRkZW5cclxuICAgICAgICAgICBAY2hhbmdlPVwiaGFuZGxlSW5wdXRDaGFuZ2VcIiAvPlxyXG4gICAgPGRpdiBjbGFzcz1cImluaXRpYWxcIlxyXG4gICAgICAgICBzdHlsZT1cIndpZHRoOiAwOyBoZWlnaHQ6IDA7IHZpc2liaWxpdHk6IGhpZGRlbjtcIj5cclxuICAgICAgPHNsb3QgbmFtZT1cImluaXRpYWxcIj48L3Nsb3Q+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCJcclxuICAgICAgICAgICAgQGNsaWNrPVwiIWRpc2FibGVkICYmIGNob29zZUZpbGUoKVwiXHJcbiAgICAgICAgICAgIEB0b3VjaHN0YXJ0LnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEBtb3VzZWRvd24uc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHBvaW50ZXJzdGFydC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEB0b3VjaGNhbmNlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQG1vdXNldXAuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcmNhbmNlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNobW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBtb3VzZW1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBARE9NTW91c2VTY3JvbGwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAbW91c2V3aGVlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVXaGVlbFwiPjwvY2FudmFzPlxyXG4gICAgPHN2ZyBjbGFzcz1cImljb24gaWNvbi1yZW1vdmVcIlxyXG4gICAgICAgICB2LWlmPVwic2hvd1JlbW92ZUJ1dHRvbiAmJiBpbWdcIlxyXG4gICAgICAgICBAY2xpY2s9XCJ1bnNldFwiXHJcbiAgICAgICAgIDpzdHlsZT1cImB0b3A6IC0ke2hlaWdodC80MH1weDsgcmlnaHQ6IC0ke3dpZHRoLzQwfXB4YFwiXHJcbiAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcclxuICAgICAgICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxyXG4gICAgICAgICA6d2lkdGg9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCJcclxuICAgICAgICAgOmhlaWdodD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIj5cclxuICAgICAgPHBhdGggZD1cIk01MTEuOTIxMjMxIDBDMjI5LjE3OTA3NyAwIDAgMjI5LjI1Nzg0NiAwIDUxMiAwIDc5NC43MDI3NjkgMjI5LjE3OTA3NyAxMDI0IDUxMS45MjEyMzEgMTAyNCA3OTQuNzgxNTM4IDEwMjQgMTAyNCA3OTQuNzAyNzY5IDEwMjQgNTEyIDEwMjQgMjI5LjI1Nzg0NiA3OTQuNzgxNTM4IDAgNTExLjkyMTIzMSAwWk03MzIuMDQxODQ2IDY1MC42MzM4NDYgNjUwLjUxNTY5MiA3MzIuMDgxMjMxQzY1MC41MTU2OTIgNzMyLjA4MTIzMSA1MjEuNDkxNjkyIDU5My42ODM2OTIgNTExLjg4MTg0NiA1OTMuNjgzNjkyIDUwMi40Mjk1MzggNTkzLjY4MzY5MiAzNzMuMzY2MTU0IDczMi4wODEyMzEgMzczLjM2NjE1NCA3MzIuMDgxMjMxTDI5MS43NjEyMzEgNjUwLjYzMzg0NkMyOTEuNzYxMjMxIDY1MC42MzM4NDYgNDMwLjMxNjMwOCA1MjMuNTAwMzA4IDQzMC4zMTYzMDggNTEyLjE5NjkyMyA0MzAuMzE2MzA4IDUwMC42OTY2MTUgMjkxLjc2MTIzMSAzNzMuNTIzNjkyIDI5MS43NjEyMzEgMzczLjUyMzY5MkwzNzMuMzY2MTU0IDI5MS45MTg3NjlDMzczLjM2NjE1NCAyOTEuOTE4NzY5IDUwMy40NTM1MzggNDMwLjM5NTA3NyA1MTEuODgxODQ2IDQzMC4zOTUwNzcgNTIwLjM0OTUzOCA0MzAuMzk1MDc3IDY1MC41MTU2OTIgMjkxLjkxODc2OSA2NTAuNTE1NjkyIDI5MS45MTg3NjlMNzMyLjA0MTg0NiAzNzMuNTIzNjkyQzczMi4wNDE4NDYgMzczLjUyMzY5MiA1OTMuNDQ3Mzg1IDUwMi41NDc2OTIgNTkzLjQ0NzM4NSA1MTIuMTk2OTIzIDU5My40NDczODUgNTIxLjQxMjkyMyA3MzIuMDQxODQ2IDY1MC42MzM4NDYgNzMyLjA0MTg0NiA2NTAuNjMzODQ2WlwiXHJcbiAgICAgICAgICAgIDpmaWxsPVwicmVtb3ZlQnV0dG9uQ29sb3JcIj48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xyXG4gIGltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xyXG5cclxuICBjb25zdCBJTklUX0VWRU5UID0gJ2luaXQnXHJcbiAgY29uc3QgRklMRV9DSE9PU0VfRVZFTlQgPSAnZmlsZS1jaG9vc2UnXHJcbiAgY29uc3QgRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCA9ICdmaWxlLXNpemUtZXhjZWVkJ1xyXG4gIGNvbnN0IE1PVkVfRVZFTlQgPSAnbW92ZSdcclxuICBjb25zdCBaT09NX0VWRU5UID0gJ3pvb20nXHJcbiAgY29uc3QgSU5JVElBTF9JTUFHRV9MT0FEID0gJ2luaXRpYWwtaW1hZ2UtbG9hZCdcclxuICBjb25zdCBJTklUSUFMX0lNQUdFX0VSUk9SID0gJ2luaXRpYWwtaW1hZ2UtZXJyb3InXHJcblxyXG4gIGV4cG9ydCBkZWZhdWx0IHtcclxuICAgIG1vZGVsOiB7XHJcbiAgICAgIHByb3A6ICd2YWx1ZScsXHJcbiAgICAgIGV2ZW50OiAnaW5pdCdcclxuICAgIH0sXHJcblxyXG4gICAgcHJvcHM6IHByb3BzLFxyXG5cclxuICAgIGRhdGEgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGluc3RhbmNlOiBudWxsLFxyXG4gICAgICAgIGNhbnZhczogbnVsbCxcclxuICAgICAgICBjdHg6IG51bGwsXHJcbiAgICAgICAgaW1nOiBudWxsLFxyXG4gICAgICAgIGRyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgICBsYXN0TW92aW5nQ29vcmQ6IG51bGwsXHJcbiAgICAgICAgaW1nRGF0YToge30sXHJcbiAgICAgICAgZGF0YVVybDogJycsXHJcbiAgICAgICAgaW5pdGlhbExvYWRpbmc6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgcmVhbFdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVhbEhlaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0ICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJGb250U2l6ZSAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdW50ZWQgKCkge1xyXG4gICAgICB0aGlzLmluaXQoKVxyXG4gICAgfSxcclxuXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSB2YWxcclxuICAgICAgfSxcclxuICAgICAgcmVhbFdpZHRoOiAnaW5pdCcsXHJcbiAgICAgIHJlYWxIZWlnaHQ6ICdpbml0JyxcclxuICAgICAgY2FudmFzQ29sb3I6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXI6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogJ2luaXQnLFxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZTogJ2luaXQnLFxyXG4gICAgICBwcmV2ZW50V2hpdGVTcGFjZTogJ2ltZ0NvbnRlbnRJbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgIGluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kcmVmcy5jYW52YXNcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAnI2U2ZTZlNicgOiAodHlwZW9mIHRoaXMuY2FudmFzQ29sb3IgPT09ICdzdHJpbmcnID8gdGhpcy5jYW52YXNDb2xvciA6ICcnKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIGlmICh0aGlzLiRzbG90cy5pbml0aWFsICYmIHRoaXMuJHNsb3RzLmluaXRpYWxbMF0pIHtcclxuICAgICAgICAgIHRoaXMuc2V0SW5pdGlhbCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMudW5zZXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRlbWl0KElOSVRfRVZFTlQsIHtcclxuICAgICAgICAgIGdldENhbnZhczogKCkgPT4gdGhpcy5jYW52YXMsXHJcbiAgICAgICAgICBnZXRDb250ZXh0OiAoKSA9PiB0aGlzLmN0eCxcclxuICAgICAgICAgIGdldENob3NlbkZpbGU6ICgpID0+IHRoaXMuJHJlZnMuZmlsZUlucHV0LmZpbGVzWzBdLFxyXG4gICAgICAgICAgZ2V0QWN0dWFsSW1hZ2VTaXplOiAoKSA9PiAoe1xyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5yZWFsV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIG1vdmVVcHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlRG93bndhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IGFtb3VudCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVMZWZ0d2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVSaWdodHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21JbjogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnpvb20odHJ1ZSwge1xyXG4gICAgICAgICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxyXG4gICAgICAgICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21PdXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVmcmVzaDogdGhpcy5pbml0LFxyXG4gICAgICAgICAgcmVzZXQ6IHRoaXMudW5zZXQsXHJcbiAgICAgICAgICBjaG9vc2VGaWxlOiB0aGlzLmNob29zZUZpbGUsXHJcbiAgICAgICAgICBnZW5lcmF0ZURhdGFVcmw6IHRoaXMuZ2VuZXJhdGVEYXRhVXJsLFxyXG4gICAgICAgICAgZ2VuZXJhdGVCbG9iOiB0aGlzLmdlbmVyYXRlQmxvYixcclxuICAgICAgICAgIHByb21pc2VkQmxvYjogdGhpcy5wcm9taXNlZEJsb2JcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgdW5zZXQgKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXHJcbiAgICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMucmVhbFdpZHRoIC8gMS41IC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcclxuICAgICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemUgfHwgdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZSA9PSAwKSA/IGRlZmF1bHRGb250U2l6ZSA6IHRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemVcclxuICAgICAgICBjdHguZm9udCA9IGZvbnRTaXplICsgJ3B4IHNhbnMtc2VyaWYnXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMucmVhbFdpZHRoIC8gMiwgdGhpcy5yZWFsSGVpZ2h0IC8gMilcclxuICAgICAgICB0aGlzLmltZyA9IG51bGxcclxuICAgICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC52YWx1ZSA9ICcnXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhID0ge31cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNldEluaXRpYWwgKCkge1xyXG4gICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLmluaXRpYWxbMF1cclxuICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICBpZiAodGFnICE9PSAnaW1nJyB8fCAhZWxtIHx8ICFlbG0uc3JjKSB7XHJcbiAgICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbml0aWFsTG9hZGluZyA9IHRydWVcclxuICAgICAgICBlbG0ub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChJTklUSUFMX0lNQUdFX0xPQUQpXHJcbiAgICAgICAgICB0aGlzLmltZyA9IGVsbVxyXG4gICAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbG0ub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoSU5JVElBTF9JTUFHRV9FUlJPUilcclxuICAgICAgICAgIHRoaXMudW5zZXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNob29zZUZpbGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmltZyB8fCB0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSByZXR1cm5cclxuICAgICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC5jbGljaygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVJbnB1dENoYW5nZSAoKSB7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gdGhpcy4kcmVmcy5maWxlSW5wdXRcclxuICAgICAgICBpZiAoIWlucHV0LmZpbGVzLmxlbmd0aCkgcmV0dXJuXHJcblxyXG4gICAgICAgIGxldCBmaWxlID0gaW5wdXQuZmlsZXNbMF1cclxuICAgICAgICB0aGlzLiRlbWl0KEZJTEVfQ0hPT1NFX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBzaXplIGV4Y2VlZHMgbGltaXQgd2hpY2ggaXMgJyArIHRoaXMuZmlsZVNpemVMaW1pdCArICcgYnl0ZXMuJylcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgICAgIGZyLm9ubG9hZCA9IChlKSA9PiB7XHJcbiAgICAgICAgICBsZXQgZmlsZURhdGEgPSBlLnRhcmdldC5yZXN1bHRcclxuICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgICAgaW1nLnNyYyA9IGZpbGVEYXRhXHJcbiAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmltZyA9IGltZ1xyXG4gICAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmlsZVNpemVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2VcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVNpemVMaW1pdCB8fCB0aGlzLmZpbGVTaXplTGltaXQgPT0gMCkgcmV0dXJuIHRydWVcclxuXHJcbiAgICAgICAgcmV0dXJuIGZpbGUuc2l6ZSA8IHRoaXMuZmlsZVNpemVMaW1pdFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaW1nQ29udGVudEluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLmltZy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIGxldCBpbWdSYXRpbyA9IGltZ0hlaWdodCAvIGltZ1dpZHRoXHJcbiAgICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5yZWFsSGVpZ2h0IC8gdGhpcy5yZWFsV2lkdGhcclxuXHJcbiAgICAgICAgLy8gZGlzcGxheSBhcyBmaXRcclxuICAgICAgICBpZiAoaW1nUmF0aW8gPCBjYW52YXNSYXRpbykge1xyXG4gICAgICAgICAgbGV0IHJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCByYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyByYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJTdGFydCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICAgIGlmIChldnQud2hpY2ggJiYgZXZ0LndoaWNoID4gMSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcclxuXHJcbiAgICAgICAgaWYgKGRvY3VtZW50KSB7XHJcbiAgICAgICAgICBsZXQgY2FuY2VsRXZlbnRzID0gWydtb3VzZXVwJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJywgJ3BvaW50ZXJlbmQnLCAncG9pbnRlcmNhbmNlbCddXHJcbiAgICAgICAgICBmb3IgKGxldCBlIG9mIGNhbmNlbEV2ZW50cykge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuaGFuZGxlUG9pbnRlckVuZClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyRW5kIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBudWxsXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyTW92ZSAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ1RvTW92ZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cclxuICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIGlmICh0aGlzLmxhc3RNb3ZpbmdDb29yZCkge1xyXG4gICAgICAgICAgdGhpcy5tb3ZlKHtcclxuICAgICAgICAgICAgeDogY29vcmQueCAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLngsXHJcbiAgICAgICAgICAgIHk6IGNvb3JkLnkgLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC55XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVXaGVlbCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlU2Nyb2xsVG9ab29tKSByZXR1cm5cclxuICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIGlmIChldnQud2hlZWxEZWx0YSA8IDAgfHwgZXZ0LmRldGFpbCA8IDApIHtcclxuICAgICAgICAgIC8vIOaJi+aMh+WQkeS4ilxyXG4gICAgICAgICAgdGhpcy56b29tKHRoaXMucmV2ZXJzZVpvb21pbmdHZXN0dXJlLCBjb29yZClcclxuICAgICAgICB9IGVsc2UgaWYgKGV2dC53aGVlbERlbHRhID4gMCB8fCBldnQuZGV0YWlsID4gMCkge1xyXG4gICAgICAgICAgLy8g5omL5oyH5ZCR5LiLXHJcbiAgICAgICAgICB0aGlzLnpvb20oIXRoaXMucmV2ZXJzZVpvb21pbmdHZXN0dXJlLCBjb29yZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlIChvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIW9mZnNldCkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgKz0gb2Zmc2V0LnlcclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4kZW1pdChNT1ZFX0VWRU5UKVxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRZID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVhbFdpZHRoIC0gdGhpcy5pbWdEYXRhLnN0YXJ0WCA+IHRoaXMuaW1nRGF0YS53aWR0aCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5yZWFsV2lkdGgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlYWxIZWlnaHQgLSB0aGlzLmltZ0RhdGEuc3RhcnRZID4gdGhpcy5pbWdEYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB6b29tICh6b29tSW4sIHBvcykge1xyXG4gICAgICAgIGxldCBzcGVlZCA9ICh0aGlzLnJlYWxXaWR0aCAvIDEwMDAwMCkgKiB0aGlzLnpvb21TcGVlZFxyXG4gICAgICAgIGxldCB4ID0gMVxyXG4gICAgICAgIGlmICh6b29tSW4pIHtcclxuICAgICAgICAgIHggPSAxICsgc3BlZWRcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA+IDIwKSB7XHJcbiAgICAgICAgICB4ID0gMSAtIHNwZWVkXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMuaW1nRGF0YS53aWR0aCAqIHhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5pbWdEYXRhLmhlaWdodCAqIHhcclxuICAgICAgICBsZXQgb2Zmc2V0WCA9ICh4IC0gMSkgKiAocG9zLnggLSB0aGlzLmltZ0RhdGEuc3RhcnRYKVxyXG4gICAgICAgIGxldCBvZmZzZXRZID0gKHggLSAxKSAqIChwb3MueSAtIHRoaXMuaW1nRGF0YS5zdGFydFkpXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHRoaXMuaW1nRGF0YS5zdGFydFggLSBvZmZzZXRYXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHRoaXMuaW1nRGF0YS5zdGFydFkgLSBvZmZzZXRZXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLndpZHRoIDwgdGhpcy5yZWFsV2lkdGgpIHtcclxuICAgICAgICAgICAgbGV0IF94ID0gdGhpcy5yZWFsV2lkdGggLyB0aGlzLmltZ0RhdGEud2lkdGhcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHQgKiBfeFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh0aGlzLmltZ0RhdGEuaGVpZ2h0IDwgdGhpcy5yZWFsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMucmVhbEhlaWdodCAvIHRoaXMuaW1nRGF0YS5oZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGggKiBfeFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4kZW1pdChaT09NX0VWRU5UKVxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwYWludEJhY2tncm91bmQgKCkge1xyXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJyNlNmU2ZTYnIDogdGhpcy5jYW52YXNDb2xvclxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvclxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMucmVhbFdpZHRoLCB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBkcmF3ICgpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5pbWdEYXRhXHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnJlYWxXaWR0aCwgdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICAgIHRoaXMucGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdlbmVyYXRlRGF0YVVybCAodHlwZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVybiAnJ1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwodHlwZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdlbmVyYXRlQmxvYiAoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4gbnVsbFxyXG4gICAgICAgIHRoaXMuY2FudmFzLnRvQmxvYihjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHByb21pc2VkQmxvYiAoLi4uYXJncykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlQmxvYigoYmxvYikgPT4ge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUoYmxvYilcclxuICAgICAgICAgICAgfSwgYXJncylcclxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzdHlsdXNcIj5cclxuICAuY3JvcHBhLWNvbnRhaW5lciBcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9ja1xyXG4gICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IC4zc1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlXHJcbiAgICAmOmhvdmVyXHJcbiAgICAgIG9wYWNpdHk6IC43XHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWQtY2MgXHJcbiAgICAgIGN1cnNvcjogZGVmYXVsdFxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgJi5jcm9wcGEtLWhhcy10YXJnZXRcclxuICAgICAgY3Vyc29yOiBtb3ZlXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICYuY3JvcHBhLS1kaXNhYmxlZC1telxyXG4gICAgICAgIGN1cnNvcjogZGVmYXVsdFxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkXHJcbiAgICAgIGN1cnNvcjogbm90LWFsbG93ZWRcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgIHN2Zy5pY29uLXJlbW92ZVxyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGVcclxuICAgICAgYmFja2dyb3VuZDogd2hpdGVcclxuICAgICAgYm9yZGVyLXJhZGl1czogNTAlXHJcbiAgICAgIGJveC1zaGFkb3c6IC0ycHggMnB4IDZweCByZ2JhKDAsIDAsIDAsIDAuNylcclxuICAgICAgei1pbmRleDogMTBcclxuICAgICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHdoaXRlXHJcbiAgLmltYWdlXHJcbiAgICBtYXgtd2lkdGg6IDEwMCVcclxuICAgIG1heC1oZWlnaHQ6IDEwMCVcclxuXHJcbjwvc3R5bGU+XHJcbiIsImltcG9ydCBjcm9wcGVyIGZyb20gJy4vY3JvcHBlci52dWUnXHJcblxyXG5jb25zdCBWdWVDcm9wcGEgPSB7XHJcbiAgaW5zdGFsbDogZnVuY3Rpb24gKFZ1ZSwgb3B0aW9ucykge1xyXG4gICAgVnVlLmNvbXBvbmVudCgnY3JvcHBhJywgY3JvcHBlcilcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZUNyb3BwYSJdLCJuYW1lcyI6WyJldnQiLCJjcm9wcGVyVk0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJ0b3VjaGVzIiwiY2xpZW50WSIsImxlZnQiLCJ0b3AiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJ2YWx1ZSIsImlzRmluaXRlIiwiTWF0aCIsImZsb29yIiwiT2JqZWN0IiwidmFsIiwiU3RyaW5nIiwiQm9vbGVhbiIsIklOSVRfRVZFTlQiLCJGSUxFX0NIT09TRV9FVkVOVCIsIkZJTEVfU0laRV9FWENFRURfRVZFTlQiLCJNT1ZFX0VWRU5UIiwiWk9PTV9FVkVOVCIsIklOSVRJQUxfSU1BR0VfTE9BRCIsIklOSVRJQUxfSU1BR0VfRVJST1IiLCJyZW5kZXIiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwicGxhY2Vob2xkZXJGb250U2l6ZSIsImluaXQiLCJpbnN0YW5jZSIsIiRyZWZzIiwicmVhbFdpZHRoIiwicmVhbEhlaWdodCIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY2FudmFzQ29sb3IiLCJjdHgiLCJnZXRDb250ZXh0IiwiJHNsb3RzIiwiaW5pdGlhbCIsInNldEluaXRpYWwiLCJ1bnNldCIsIiRlbWl0IiwiZmlsZUlucHV0IiwiZmlsZXMiLCJhbW91bnQiLCJtb3ZlIiwieCIsInkiLCJ6b29tIiwiaW1nRGF0YSIsInN0YXJ0WCIsInN0YXJ0WSIsImNob29zZUZpbGUiLCJnZW5lcmF0ZURhdGFVcmwiLCJnZW5lcmF0ZUJsb2IiLCJwcm9taXNlZEJsb2IiLCJjbGVhclJlY3QiLCJwYWludEJhY2tncm91bmQiLCJ0ZXh0QmFzZWxpbmUiLCJ0ZXh0QWxpZ24iLCJkZWZhdWx0Rm9udFNpemUiLCJwbGFjZWhvbGRlciIsImxlbmd0aCIsImZvbnRTaXplIiwicmVhbFBsYWNlaG9sZGVyRm9udFNpemUiLCJmb250IiwiZmlsbFN0eWxlIiwicGxhY2Vob2xkZXJDb2xvciIsImZpbGxUZXh0IiwiaW1nIiwidk5vZGUiLCJ0YWciLCJlbG0iLCJzcmMiLCJpbml0aWFsTG9hZGluZyIsIm9ubG9hZCIsImltZ0NvbnRlbnRJbml0Iiwib25lcnJvciIsImRpc2FibGVDbGlja1RvQ2hvb3NlIiwiY2xpY2siLCJpbnB1dCIsImZpbGUiLCJmaWxlU2l6ZUlzVmFsaWQiLCJFcnJvciIsImZpbGVTaXplTGltaXQiLCJmciIsIkZpbGVSZWFkZXIiLCJlIiwiZmlsZURhdGEiLCJ0YXJnZXQiLCJyZXN1bHQiLCJJbWFnZSIsInJlYWRBc0RhdGFVUkwiLCJzaXplIiwiaW1nV2lkdGgiLCJuYXR1cmFsV2lkdGgiLCJpbWdIZWlnaHQiLCJuYXR1cmFsSGVpZ2h0IiwiaW1nUmF0aW8iLCJjYW52YXNSYXRpbyIsInJhdGlvIiwiZHJhdyIsImRpc2FibGVkIiwid2hpY2giLCJkcmFnZ2luZyIsImRvY3VtZW50IiwiY2FuY2VsRXZlbnRzIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZVBvaW50ZXJFbmQiLCJsYXN0TW92aW5nQ29vcmQiLCJkaXNhYmxlRHJhZ1RvTW92ZSIsImNvb3JkIiwidSIsImdldFBvaW50ZXJDb29yZHMiLCJkaXNhYmxlU2Nyb2xsVG9ab29tIiwid2hlZWxEZWx0YSIsImRldGFpbCIsInJldmVyc2Vab29taW5nR2VzdHVyZSIsIm9mZnNldCIsInByZXZlbnRXaGl0ZVNwYWNlIiwicHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSIsInpvb21JbiIsInBvcyIsInNwZWVkIiwiem9vbVNwZWVkIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJfeCIsImZpbGxSZWN0IiwiZHJhd0ltYWdlIiwidHlwZSIsInRvRGF0YVVSTCIsImNhbGxiYWNrIiwibWltZVR5cGUiLCJxdWFsaXR5QXJndW1lbnQiLCJ0b0Jsb2IiLCJhcmdzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJibG9iIiwiZXJyIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImNvbXBvbmVudCIsImNyb3BwZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsUUFBZTtrQkFBQSw0QkFDSUEsR0FESixFQUNTQyxTQURULEVBQ29CO1FBQ3pCQyxNQUR5QixHQUNMRCxTQURLLENBQ3pCQyxNQUR5QjtRQUNqQkMsT0FEaUIsR0FDTEYsU0FESyxDQUNqQkUsT0FEaUI7O1FBRTNCQyxPQUFPRixPQUFPRyxxQkFBUCxFQUFYO1FBQ0lDLFVBQVVOLElBQUlPLE9BQUosR0FBY1AsSUFBSU8sT0FBSixDQUFZLENBQVosRUFBZUQsT0FBN0IsR0FBdUNOLElBQUlNLE9BQXpEO1FBQ0lFLFVBQVVSLElBQUlPLE9BQUosR0FBY1AsSUFBSU8sT0FBSixDQUFZLENBQVosRUFBZUMsT0FBN0IsR0FBdUNSLElBQUlRLE9BQXpEO1dBQ087U0FDRixDQUFDRixVQUFVRixLQUFLSyxJQUFoQixJQUF3Qk4sT0FEdEI7U0FFRixDQUFDSyxVQUFVSixLQUFLTSxHQUFoQixJQUF1QlA7S0FGNUI7O0NBTko7O0FDQUFRLE9BQU9DLFNBQVAsR0FBbUJELE9BQU9DLFNBQVAsSUFBb0IsVUFBVUMsS0FBVixFQUFpQjtTQUMvQyxPQUFPQSxLQUFQLEtBQWlCLFFBQWpCLElBQTZCQyxTQUFTRCxLQUFULENBQTdCLElBQWdERSxLQUFLQyxLQUFMLENBQVdILEtBQVgsTUFBc0JBLEtBQTdFO0NBREY7O0FBSUEsWUFBZTtTQUNOSSxNQURNO1NBRU47VUFDQ04sTUFERDthQUVJLEdBRko7ZUFHTSxtQkFBVU8sR0FBVixFQUFlO2FBQ2pCQSxNQUFNLENBQWI7O0dBTlM7VUFTTDtVQUNBUCxNQURBO2FBRUcsR0FGSDtlQUdLLG1CQUFVTyxHQUFWLEVBQWU7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
