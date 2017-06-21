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
  },
  imageLoaded: function imageLoaded(img) {
    return img.complete && img.naturalWidth !== 0;
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
var IMAGE_REMOVE = 'image-remove';
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
      dataUrl: ''
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
      ctx.clearRect(0, 0, this.realWidth, this.realHeight);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi9zcmMvY3JvcHBlci52dWUiLCIuLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgZ2V0UG9pbnRlckNvb3JkcyhldnQsIGNyb3BwZXJWTSkge1xyXG4gICAgbGV0IHsgY2FudmFzLCBxdWFsaXR5IH0gPSBjcm9wcGVyVk1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WCA6IGV2dC5jbGllbnRYXHJcbiAgICBsZXQgY2xpZW50WSA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WSA6IGV2dC5jbGllbnRZXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiAoY2xpZW50WCAtIHJlY3QubGVmdCkgKiBxdWFsaXR5LFxyXG4gICAgICB5OiAoY2xpZW50WSAtIHJlY3QudG9wKSAqIHF1YWxpdHlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZChpbWcpIHtcclxuICAgIHJldHVybiBpbWcuY29tcGxldGUgJiYgaW1nLm5hdHVyYWxXaWR0aCAhPT0gMFxyXG4gIH1cclxufSIsIk51bWJlci5pc0ludGVnZXIgPSBOdW1iZXIuaXNJbnRlZ2VyIHx8IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWVcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjZTZlNmU2J1xyXG4gIH0sXHJcbiAgcXVhbGl0eToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWwpICYmIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnaW1hZ2UvKidcclxuICB9LFxyXG4gIGZpbGVTaXplTGltaXQ6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+PSAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBkaXNhYmxlZDogQm9vbGVhbixcclxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ1RvTW92ZTogQm9vbGVhbixcclxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIHJldmVyc2Vab29taW5nR2VzdHVyZTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9XHJcbn0iLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiA6Y2xhc3M9XCJgY3JvcHBhLWNvbnRhaW5lciAke2ltZyA/ICdjcm9wcGEtLWhhcy10YXJnZXQnIDogJyd9ICR7ZGlzYWJsZWQgPyAnY3JvcHBhLS1kaXNhYmxlZCcgOiAnJ30gJHtkaXNhYmxlQ2xpY2tUb0Nob29zZSA/ICdjcm9wcGEtLWRpc2FibGVkLWNjJyA6ICcnfSAke2Rpc2FibGVEcmFnVG9Nb3ZlICYmIGRpc2FibGVTY3JvbGxUb1pvb20gPyAnY3JvcHBhLS1kaXNhYmxlZC1teicgOiAnJ31gXCI+XHJcbiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIlxyXG4gICAgICAgICAgIDphY2NlcHQ9XCJhY2NlcHRcIlxyXG4gICAgICAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcclxuICAgICAgICAgICByZWY9XCJmaWxlSW5wdXRcIlxyXG4gICAgICAgICAgIGhpZGRlblxyXG4gICAgICAgICAgIEBjaGFuZ2U9XCJoYW5kbGVJbnB1dENoYW5nZVwiIC8+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaW5pdGlhbFwiXHJcbiAgICAgICAgIHN0eWxlPVwid2lkdGg6IDA7IGhlaWdodDogMDsgdmlzaWJpbGl0eTogaGlkZGVuO1wiPlxyXG4gICAgICA8c2xvdCBuYW1lPVwiaW5pdGlhbFwiPjwvc2xvdD5cclxuICAgIDwvZGl2PlxyXG4gICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIlxyXG4gICAgICAgICAgICBAY2xpY2s9XCIhZGlzYWJsZWQgJiYgY2hvb3NlRmlsZSgpXCJcclxuICAgICAgICAgICAgQHRvdWNoc3RhcnQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQG1vdXNlZG93bi5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcnN0YXJ0LnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEB0b3VjaGVuZC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNoY2FuY2VsLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAbW91c2V1cC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJlbmQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyY2FuY2VsLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAdG91Y2htb3ZlLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQG1vdXNlbW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBwb2ludGVybW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBET01Nb3VzZVNjcm9sbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVXaGVlbFwiXHJcbiAgICAgICAgICAgIEBtb3VzZXdoZWVsLnN0b3AucHJldmVudD1cImhhbmRsZVdoZWVsXCI+PC9jYW52YXM+XHJcbiAgICA8c3ZnIGNsYXNzPVwiaWNvbiBpY29uLXJlbW92ZVwiXHJcbiAgICAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZ1wiXHJcbiAgICAgICAgIEBjbGljaz1cInVuc2V0XCJcclxuICAgICAgICAgOnN0eWxlPVwiYHRvcDogLSR7aGVpZ2h0LzQwfXB4OyByaWdodDogLSR7d2lkdGgvNDB9cHhgXCJcclxuICAgICAgICAgdmlld0JveD1cIjAgMCAxMDI0IDEwMjRcIlxyXG4gICAgICAgICB2ZXJzaW9uPVwiMS4xXCJcclxuICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcbiAgICAgICAgIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiXHJcbiAgICAgICAgIDp3aWR0aD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIlxyXG4gICAgICAgICA6aGVpZ2h0PVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aC8xMFwiPlxyXG4gICAgICA8cGF0aCBkPVwiTTUxMS45MjEyMzEgMEMyMjkuMTc5MDc3IDAgMCAyMjkuMjU3ODQ2IDAgNTEyIDAgNzk0LjcwMjc2OSAyMjkuMTc5MDc3IDEwMjQgNTExLjkyMTIzMSAxMDI0IDc5NC43ODE1MzggMTAyNCAxMDI0IDc5NC43MDI3NjkgMTAyNCA1MTIgMTAyNCAyMjkuMjU3ODQ2IDc5NC43ODE1MzggMCA1MTEuOTIxMjMxIDBaTTczMi4wNDE4NDYgNjUwLjYzMzg0NiA2NTAuNTE1NjkyIDczMi4wODEyMzFDNjUwLjUxNTY5MiA3MzIuMDgxMjMxIDUyMS40OTE2OTIgNTkzLjY4MzY5MiA1MTEuODgxODQ2IDU5My42ODM2OTIgNTAyLjQyOTUzOCA1OTMuNjgzNjkyIDM3My4zNjYxNTQgNzMyLjA4MTIzMSAzNzMuMzY2MTU0IDczMi4wODEyMzFMMjkxLjc2MTIzMSA2NTAuNjMzODQ2QzI5MS43NjEyMzEgNjUwLjYzMzg0NiA0MzAuMzE2MzA4IDUyMy41MDAzMDggNDMwLjMxNjMwOCA1MTIuMTk2OTIzIDQzMC4zMTYzMDggNTAwLjY5NjYxNSAyOTEuNzYxMjMxIDM3My41MjM2OTIgMjkxLjc2MTIzMSAzNzMuNTIzNjkyTDM3My4zNjYxNTQgMjkxLjkxODc2OUMzNzMuMzY2MTU0IDI5MS45MTg3NjkgNTAzLjQ1MzUzOCA0MzAuMzk1MDc3IDUxMS44ODE4NDYgNDMwLjM5NTA3NyA1MjAuMzQ5NTM4IDQzMC4zOTUwNzcgNjUwLjUxNTY5MiAyOTEuOTE4NzY5IDY1MC41MTU2OTIgMjkxLjkxODc2OUw3MzIuMDQxODQ2IDM3My41MjM2OTJDNzMyLjA0MTg0NiAzNzMuNTIzNjkyIDU5My40NDczODUgNTAyLjU0NzY5MiA1OTMuNDQ3Mzg1IDUxMi4xOTY5MjMgNTkzLjQ0NzM4NSA1MjEuNDEyOTIzIDczMi4wNDE4NDYgNjUwLjYzMzg0NiA3MzIuMDQxODQ2IDY1MC42MzM4NDZaXCJcclxuICAgICAgICAgICAgOmZpbGw9XCJyZW1vdmVCdXR0b25Db2xvclwiPjwvcGF0aD5cclxuICAgIDwvc3ZnPlxyXG4gIDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHNjcmlwdD5cclxuICBpbXBvcnQgdSBmcm9tICcuL3V0aWwnXHJcbiAgaW1wb3J0IHByb3BzIGZyb20gJy4vcHJvcHMnXHJcblxyXG4gIGNvbnN0IElOSVRfRVZFTlQgPSAnaW5pdCdcclxuICBjb25zdCBGSUxFX0NIT09TRV9FVkVOVCA9ICdmaWxlLWNob29zZSdcclxuICBjb25zdCBGSUxFX1NJWkVfRVhDRUVEX0VWRU5UID0gJ2ZpbGUtc2l6ZS1leGNlZWQnXHJcbiAgY29uc3QgSU1BR0VfUkVNT1ZFID0gJ2ltYWdlLXJlbW92ZSdcclxuICBjb25zdCBNT1ZFX0VWRU5UID0gJ21vdmUnXHJcbiAgY29uc3QgWk9PTV9FVkVOVCA9ICd6b29tJ1xyXG4gIGNvbnN0IElOSVRJQUxfSU1BR0VfTE9BRCA9ICdpbml0aWFsLWltYWdlLWxvYWQnXHJcbiAgY29uc3QgSU5JVElBTF9JTUFHRV9FUlJPUiA9ICdpbml0aWFsLWltYWdlLWVycm9yJ1xyXG5cclxuICBleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBtb2RlbDoge1xyXG4gICAgICBwcm9wOiAndmFsdWUnLFxyXG4gICAgICBldmVudDogJ2luaXQnXHJcbiAgICB9LFxyXG5cclxuICAgIHByb3BzOiBwcm9wcyxcclxuXHJcbiAgICBkYXRhICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBpbnN0YW5jZTogbnVsbCxcclxuICAgICAgICBjYW52YXM6IG51bGwsXHJcbiAgICAgICAgY3R4OiBudWxsLFxyXG4gICAgICAgIGltZzogbnVsbCxcclxuICAgICAgICBkcmFnZ2luZzogZmFsc2UsXHJcbiAgICAgICAgbGFzdE1vdmluZ0Nvb3JkOiBudWxsLFxyXG4gICAgICAgIGltZ0RhdGE6IHt9LFxyXG4gICAgICAgIGRhdGFVcmw6ICcnXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgcmVhbFdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVhbEhlaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0ICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJGb250U2l6ZSAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdW50ZWQgKCkge1xyXG4gICAgICB0aGlzLmluaXQoKVxyXG4gICAgfSxcclxuXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSB2YWxcclxuICAgICAgfSxcclxuICAgICAgcmVhbFdpZHRoOiAnaW5pdCcsXHJcbiAgICAgIHJlYWxIZWlnaHQ6ICdpbml0JyxcclxuICAgICAgY2FudmFzQ29sb3I6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXI6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogJ2luaXQnLFxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZTogJ2luaXQnLFxyXG4gICAgICBwcmV2ZW50V2hpdGVTcGFjZTogJ2ltZ0NvbnRlbnRJbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgIGluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kcmVmcy5jYW52YXNcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAnI2U2ZTZlNicgOiAodHlwZW9mIHRoaXMuY2FudmFzQ29sb3IgPT09ICdzdHJpbmcnID8gdGhpcy5jYW52YXNDb2xvciA6ICcnKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIGlmICh0aGlzLiRzbG90cy5pbml0aWFsICYmIHRoaXMuJHNsb3RzLmluaXRpYWxbMF0pIHtcclxuICAgICAgICAgIHRoaXMuc2V0SW5pdGlhbCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMudW5zZXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRlbWl0KElOSVRfRVZFTlQsIHtcclxuICAgICAgICAgIGdldENhbnZhczogKCkgPT4gdGhpcy5jYW52YXMsXHJcbiAgICAgICAgICBnZXRDb250ZXh0OiAoKSA9PiB0aGlzLmN0eCxcclxuICAgICAgICAgIGdldENob3NlbkZpbGU6ICgpID0+IHRoaXMuJHJlZnMuZmlsZUlucHV0LmZpbGVzWzBdLFxyXG4gICAgICAgICAgZ2V0QWN0dWFsSW1hZ2VTaXplOiAoKSA9PiAoe1xyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5yZWFsV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIG1vdmVVcHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlRG93bndhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IGFtb3VudCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVMZWZ0d2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVSaWdodHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21JbjogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnpvb20odHJ1ZSwge1xyXG4gICAgICAgICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxyXG4gICAgICAgICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21PdXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVmcmVzaDogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLmluaXQpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVzZXQ6IHRoaXMudW5zZXQsXHJcbiAgICAgICAgICBjaG9vc2VGaWxlOiB0aGlzLmNob29zZUZpbGUsXHJcbiAgICAgICAgICBnZW5lcmF0ZURhdGFVcmw6IHRoaXMuZ2VuZXJhdGVEYXRhVXJsLFxyXG4gICAgICAgICAgZ2VuZXJhdGVCbG9iOiB0aGlzLmdlbmVyYXRlQmxvYixcclxuICAgICAgICAgIHByb21pc2VkQmxvYjogdGhpcy5wcm9taXNlZEJsb2JcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgdW5zZXQgKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXHJcbiAgICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMucmVhbFdpZHRoIC8gMS41IC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcclxuICAgICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemUgfHwgdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZSA9PSAwKSA/IGRlZmF1bHRGb250U2l6ZSA6IHRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemVcclxuICAgICAgICBjdHguZm9udCA9IGZvbnRTaXplICsgJ3B4IHNhbnMtc2VyaWYnXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMucmVhbFdpZHRoIC8gMiwgdGhpcy5yZWFsSGVpZ2h0IC8gMilcclxuXHJcbiAgICAgICAgbGV0IGhhZEltYWdlID0gdGhpcy5pbWcgIT0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcclxuICAgICAgICB0aGlzLmltZ0RhdGEgPSB7fVxyXG5cclxuICAgICAgICBpZiAoaGFkSW1hZ2UpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoSU1BR0VfUkVNT1ZFKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNldEluaXRpYWwgKCkge1xyXG4gICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLmluaXRpYWxbMF1cclxuICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICBpZiAodGFnICE9PSAnaW1nJyB8fCAhZWxtIHx8ICFlbG0uc3JjKSB7XHJcbiAgICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChlbG0pKSB7XHJcbiAgICAgICAgICB0aGlzLmltZyA9IGVsbVxyXG4gICAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVsbS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoSU5JVElBTF9JTUFHRV9MT0FEKVxyXG4gICAgICAgICAgICB0aGlzLmltZyA9IGVsbVxyXG4gICAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBlbG0ub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy4kZW1pdChJTklUSUFMX0lNQUdFX0VSUk9SKVxyXG4gICAgICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjaG9vc2VGaWxlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWcgfHwgdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQuY2xpY2soKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlSW5wdXRDaGFuZ2UgKCkge1xyXG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMuZmlsZUlucHV0XHJcbiAgICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGgpIHJldHVyblxyXG5cclxuICAgICAgICBsZXQgZmlsZSA9IGlucHV0LmZpbGVzWzBdXHJcbiAgICAgICAgdGhpcy4kZW1pdChGSUxFX0NIT09TRV9FVkVOVCwgZmlsZSlcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVNpemVJc1ZhbGlkKGZpbGUpKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KEZJTEVfU0laRV9FWENFRURfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpbGUgc2l6ZSBleGNlZWRzIGxpbWl0IHdoaWNoIGlzICcgKyB0aGlzLmZpbGVTaXplTGltaXQgKyAnIGJ5dGVzLicpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBmciA9IG5ldyBGaWxlUmVhZGVyKClcclxuICAgICAgICBmci5vbmxvYWQgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGZpbGVEYXRhID0gZS50YXJnZXQucmVzdWx0XHJcbiAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgICAgIGltZy5zcmMgPSBmaWxlRGF0YVxyXG4gICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbWcgPSBpbWdcclxuICAgICAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZyLnJlYWRBc0RhdGFVUkwoZmlsZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZpbGVTaXplSXNWYWxpZCAoZmlsZSkge1xyXG4gICAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVTaXplTGltaXQgfHwgdGhpcy5maWxlU2l6ZUxpbWl0ID09IDApIHJldHVybiB0cnVlXHJcblxyXG4gICAgICAgIHJldHVybiBmaWxlLnNpemUgPCB0aGlzLmZpbGVTaXplTGltaXRcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGltZ0NvbnRlbnRJbml0ICgpIHtcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5pbWcubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMuaW1nLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICBsZXQgaW1nUmF0aW8gPSBpbWdIZWlnaHQgLyBpbWdXaWR0aFxyXG4gICAgICAgIGxldCBjYW52YXNSYXRpbyA9IHRoaXMucmVhbEhlaWdodCAvIHRoaXMucmVhbFdpZHRoXHJcblxyXG4gICAgICAgIC8vIGRpc3BsYXkgYXMgZml0XHJcbiAgICAgICAgaWYgKGltZ1JhdGlvIDwgY2FudmFzUmF0aW8pIHtcclxuICAgICAgICAgIGxldCByYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGggLyByYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5yZWFsV2lkdGgpIC8gMlxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgcmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gcmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpIC8gMlxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyU3RhcnQgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICBpZiAoZXZ0LndoaWNoICYmIGV2dC53aGljaCA+IDEpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlXHJcblxyXG4gICAgICAgIGlmIChkb2N1bWVudCkge1xyXG4gICAgICAgICAgbGV0IGNhbmNlbEV2ZW50cyA9IFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCcsICdwb2ludGVyZW5kJywgJ3BvaW50ZXJjYW5jZWwnXVxyXG4gICAgICAgICAgZm9yIChsZXQgZSBvZiBjYW5jZWxFdmVudHMpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihlLCB0aGlzLmhhbmRsZVBvaW50ZXJFbmQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlckVuZCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gbnVsbFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlck1vdmUgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdUb01vdmUpIHJldHVyblxyXG4gICAgICAgIGlmICghdGhpcy5kcmFnZ2luZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICBpZiAodGhpcy5sYXN0TW92aW5nQ29vcmQpIHtcclxuICAgICAgICAgIHRoaXMubW92ZSh7XHJcbiAgICAgICAgICAgIHg6IGNvb3JkLnggLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC54LFxyXG4gICAgICAgICAgICB5OiBjb29yZC55IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlV2hlZWwgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVNjcm9sbFRvWm9vbSkgcmV0dXJuXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICBpZiAoZXZ0LndoZWVsRGVsdGEgPCAwIHx8IGV2dC5kZXRhaWwgPCAwKSB7XHJcbiAgICAgICAgICAvLyDmiYvmjIflkJHkuIpcclxuICAgICAgICAgIHRoaXMuem9vbSh0aGlzLnJldmVyc2Vab29taW5nR2VzdHVyZSwgY29vcmQpXHJcbiAgICAgICAgfSBlbHNlIGlmIChldnQud2hlZWxEZWx0YSA+IDAgfHwgZXZ0LmRldGFpbCA+IDApIHtcclxuICAgICAgICAgIC8vIOaJi+aMh+WQkeS4i1xyXG4gICAgICAgICAgdGhpcy56b29tKCF0aGlzLnJldmVyc2Vab29taW5nR2VzdHVyZSwgY29vcmQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbW92ZSAob2Zmc2V0KSB7XHJcbiAgICAgICAgaWYgKCFvZmZzZXQpIHJldHVyblxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggKz0gb2Zmc2V0LnhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZICs9IG9mZnNldC55XHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIHRoaXMucHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuJGVtaXQoTU9WRV9FVkVOVClcclxuICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFggPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WSA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlYWxXaWR0aCAtIHRoaXMuaW1nRGF0YS5zdGFydFggPiB0aGlzLmltZ0RhdGEud2lkdGgpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWFsSGVpZ2h0IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSA+IHRoaXMuaW1nRGF0YS5oZWlnaHQpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgem9vbSAoem9vbUluLCBwb3MpIHtcclxuICAgICAgICBsZXQgc3BlZWQgPSAodGhpcy5yZWFsV2lkdGggLyAxMDAwMDApICogdGhpcy56b29tU3BlZWRcclxuICAgICAgICBsZXQgeCA9IDFcclxuICAgICAgICBpZiAoem9vbUluKSB7XHJcbiAgICAgICAgICB4ID0gMSArIHNwZWVkXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiAyMCkge1xyXG4gICAgICAgICAgeCA9IDEgLSBzcGVlZFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGggKiB4XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHQgKiB4XHJcbiAgICAgICAgbGV0IG9mZnNldFggPSAoeCAtIDEpICogKHBvcy54IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WClcclxuICAgICAgICBsZXQgb2Zmc2V0WSA9ICh4IC0gMSkgKiAocG9zLnkgLSB0aGlzLmltZ0RhdGEuc3RhcnRZKVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYIC0gb2Zmc2V0WFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZIC0gb2Zmc2V0WVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMucmVhbFdpZHRoKSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMucmVhbFdpZHRoIC8gdGhpcy5pbWdEYXRhLndpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogX3hcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLmhlaWdodCA8IHRoaXMucmVhbEhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgX3ggPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLmltZ0RhdGEuaGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogX3hcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMucHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuJGVtaXQoWk9PTV9FVkVOVClcclxuICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFpbnRCYWNrZ3JvdW5kICgpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjZTZlNmU2JyA6IHRoaXMuY2FudmFzQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBiYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLnJlYWxXaWR0aCwgdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZHJhdyAoKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxyXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZURhdGFVcmwgKHR5cGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4gJydcclxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXMudG9EYXRhVVJMKHR5cGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuIG51bGxcclxuICAgICAgICB0aGlzLmNhbnZhcy50b0Jsb2IoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcm9taXNlZEJsb2IgKC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUJsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICAgICAgICByZXNvbHZlKGJsb2IpXHJcbiAgICAgICAgICAgIH0sIGFyZ3MpXHJcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycilcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZSBsYW5nPVwic3R5bHVzXCI+XHJcbiAgLmNyb3BwYS1jb250YWluZXIgXHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2tcclxuICAgIGN1cnNvcjogcG9pbnRlclxyXG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAuM3NcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZVxyXG4gICAgJjpob3ZlclxyXG4gICAgICBvcGFjaXR5OiAuN1xyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkLWNjIFxyXG4gICAgICBjdXJzb3I6IGRlZmF1bHRcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgICYuY3JvcHBhLS1oYXMtdGFyZ2V0XHJcbiAgICAgIGN1cnNvcjogbW92ZVxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICAmLmNyb3BwYS0tZGlzYWJsZWQtbXpcclxuICAgICAgICBjdXJzb3I6IGRlZmF1bHRcclxuICAgICYuY3JvcHBhLS1kaXNhYmxlZFxyXG4gICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICBzdmcuaWNvbi1yZW1vdmVcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlXHJcbiAgICAgIGJhY2tncm91bmQ6IHdoaXRlXHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDUwJVxyXG4gICAgICBib3gtc2hhZG93OiAtMnB4IDJweCA2cHggcmdiYSgwLCAwLCAwLCAwLjcpXHJcbiAgICAgIHotaW5kZXg6IDEwXHJcbiAgICAgIGN1cnNvcjogcG9pbnRlclxyXG4gICAgICBib3JkZXI6IDJweCBzb2xpZCB3aGl0ZVxyXG4gIC5pbWFnZVxyXG4gICAgbWF4LXdpZHRoOiAxMDAlXHJcbiAgICBtYXgtaGVpZ2h0OiAxMDAlXHJcblxyXG48L3N0eWxlPlxyXG4iLCJpbXBvcnQgY3JvcHBlciBmcm9tICcuL2Nyb3BwZXIudnVlJ1xyXG5cclxuY29uc3QgVnVlQ3JvcHBhID0ge1xyXG4gIGluc3RhbGw6IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcclxuICAgIFZ1ZS5jb21wb25lbnQoJ2Nyb3BwYScsIGNyb3BwZXIpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsiZXZ0IiwiY3JvcHBlclZNIiwiY2FudmFzIiwicXVhbGl0eSIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRYIiwidG91Y2hlcyIsImNsaWVudFkiLCJsZWZ0IiwidG9wIiwiaW1nIiwiY29tcGxldGUiLCJuYXR1cmFsV2lkdGgiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJ2YWx1ZSIsImlzRmluaXRlIiwiTWF0aCIsImZsb29yIiwiT2JqZWN0IiwidmFsIiwiU3RyaW5nIiwiQm9vbGVhbiIsIklOSVRfRVZFTlQiLCJGSUxFX0NIT09TRV9FVkVOVCIsIkZJTEVfU0laRV9FWENFRURfRVZFTlQiLCJJTUFHRV9SRU1PVkUiLCJNT1ZFX0VWRU5UIiwiWk9PTV9FVkVOVCIsIklOSVRJQUxfSU1BR0VfTE9BRCIsIklOSVRJQUxfSU1BR0VfRVJST1IiLCJyZW5kZXIiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwicGxhY2Vob2xkZXJGb250U2l6ZSIsImluaXQiLCJpbnN0YW5jZSIsIiRyZWZzIiwicmVhbFdpZHRoIiwicmVhbEhlaWdodCIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY2FudmFzQ29sb3IiLCJjdHgiLCJnZXRDb250ZXh0IiwiJHNsb3RzIiwiaW5pdGlhbCIsInNldEluaXRpYWwiLCJ1bnNldCIsIiRlbWl0IiwiZmlsZUlucHV0IiwiZmlsZXMiLCJhbW91bnQiLCJtb3ZlIiwieCIsInkiLCJ6b29tIiwiaW1nRGF0YSIsInN0YXJ0WCIsInN0YXJ0WSIsIiRuZXh0VGljayIsImNob29zZUZpbGUiLCJnZW5lcmF0ZURhdGFVcmwiLCJnZW5lcmF0ZUJsb2IiLCJwcm9taXNlZEJsb2IiLCJjbGVhclJlY3QiLCJwYWludEJhY2tncm91bmQiLCJ0ZXh0QmFzZWxpbmUiLCJ0ZXh0QWxpZ24iLCJkZWZhdWx0Rm9udFNpemUiLCJwbGFjZWhvbGRlciIsImxlbmd0aCIsImZvbnRTaXplIiwicmVhbFBsYWNlaG9sZGVyRm9udFNpemUiLCJmb250IiwiZmlsbFN0eWxlIiwicGxhY2Vob2xkZXJDb2xvciIsImZpbGxUZXh0IiwiaGFkSW1hZ2UiLCJ2Tm9kZSIsInRhZyIsImVsbSIsInNyYyIsInUiLCJpbWFnZUxvYWRlZCIsImltZ0NvbnRlbnRJbml0Iiwib25sb2FkIiwib25lcnJvciIsImRpc2FibGVDbGlja1RvQ2hvb3NlIiwiY2xpY2siLCJpbnB1dCIsImZpbGUiLCJmaWxlU2l6ZUlzVmFsaWQiLCJFcnJvciIsImZpbGVTaXplTGltaXQiLCJmciIsIkZpbGVSZWFkZXIiLCJlIiwiZmlsZURhdGEiLCJ0YXJnZXQiLCJyZXN1bHQiLCJJbWFnZSIsInJlYWRBc0RhdGFVUkwiLCJzaXplIiwiaW1nV2lkdGgiLCJpbWdIZWlnaHQiLCJuYXR1cmFsSGVpZ2h0IiwiaW1nUmF0aW8iLCJjYW52YXNSYXRpbyIsInJhdGlvIiwiZHJhdyIsImRpc2FibGVkIiwid2hpY2giLCJkcmFnZ2luZyIsImRvY3VtZW50IiwiY2FuY2VsRXZlbnRzIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZVBvaW50ZXJFbmQiLCJsYXN0TW92aW5nQ29vcmQiLCJkaXNhYmxlRHJhZ1RvTW92ZSIsImNvb3JkIiwiZ2V0UG9pbnRlckNvb3JkcyIsImRpc2FibGVTY3JvbGxUb1pvb20iLCJ3aGVlbERlbHRhIiwiZGV0YWlsIiwicmV2ZXJzZVpvb21pbmdHZXN0dXJlIiwib2Zmc2V0IiwicHJldmVudFdoaXRlU3BhY2UiLCJwcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlIiwiem9vbUluIiwicG9zIiwic3BlZWQiLCJ6b29tU3BlZWQiLCJvZmZzZXRYIiwib2Zmc2V0WSIsIl94IiwiZmlsbFJlY3QiLCJkcmF3SW1hZ2UiLCJ0eXBlIiwidG9EYXRhVVJMIiwiY2FsbGJhY2siLCJtaW1lVHlwZSIsInF1YWxpdHlBcmd1bWVudCIsInRvQmxvYiIsImFyZ3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImJsb2IiLCJlcnIiLCJWdWVDcm9wcGEiLCJWdWUiLCJvcHRpb25zIiwiY29tcG9uZW50IiwiY3JvcHBlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxRQUFlO2tCQUFBLDRCQUNJQSxHQURKLEVBQ1NDLFNBRFQsRUFDb0I7UUFDekJDLE1BRHlCLEdBQ0xELFNBREssQ0FDekJDLE1BRHlCO1FBQ2pCQyxPQURpQixHQUNMRixTQURLLENBQ2pCRSxPQURpQjs7UUFFM0JDLE9BQU9GLE9BQU9HLHFCQUFQLEVBQVg7UUFDSUMsVUFBVU4sSUFBSU8sT0FBSixHQUFjUCxJQUFJTyxPQUFKLENBQVksQ0FBWixFQUFlRCxPQUE3QixHQUF1Q04sSUFBSU0sT0FBekQ7UUFDSUUsVUFBVVIsSUFBSU8s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
