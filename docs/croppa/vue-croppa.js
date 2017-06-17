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

var cropper = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') + ' ' + (_vm.disabled ? 'croppa--disabled' : '') + ' ' + (_vm.disableClickToChoose ? 'croppa--disabled-cc' : '') + ' ' + (_vm.disableDragToMove && _vm.disableScrollToZoom ? 'croppa--disabled-mz' : '') }, [_c('input', { ref: "fileInput", attrs: { "type": "file", "accept": _vm.accept, "disabled": _vm.disabled, "hidden": "" }, on: { "change": _vm.handleInputChange } }), _c('canvas', { ref: "canvas", on: { "click": function click($event) {
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
      this.unset();
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
        reset: this.unset,
        chooseFile: this.chooseFile,
        generateDataUrl: this.generateDataUrl,
        generateBlob: this.generateBlob
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
    chooseFile: function chooseFile() {
      if (this.img || this.disableClickToChoose) return;
      this.$refs.fileInput.click();
    },
    handleInputChange: function handleInputChange() {
      var _this2 = this;

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
          _this2.img = img;
          _this2.imgContentInit();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi9zcmMvY3JvcHBlci52dWUiLCIuLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgZ2V0UG9pbnRlckNvb3JkcyhldnQsIGNyb3BwZXJWTSkge1xyXG4gICAgbGV0IHsgY2FudmFzLCBxdWFsaXR5IH0gPSBjcm9wcGVyVk1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WCA6IGV2dC5jbGllbnRYXHJcbiAgICBsZXQgY2xpZW50WSA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WSA6IGV2dC5jbGllbnRZXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiAoY2xpZW50WCAtIHJlY3QubGVmdCkgKiBxdWFsaXR5LFxyXG4gICAgICB5OiAoY2xpZW50WSAtIHJlY3QudG9wKSAqIHF1YWxpdHlcclxuICAgIH1cclxuICB9XHJcbn0iLCJOdW1iZXIuaXNJbnRlZ2VyID0gTnVtYmVyLmlzSW50ZWdlciB8fCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB2YWx1ZTogT2JqZWN0LFxyXG4gIHdpZHRoOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGhlaWdodDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMjAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBwbGFjZWhvbGRlcjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ0Nob29zZSBhbiBpbWFnZSdcclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjNjA2MDYwJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJGb250U2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGNhbnZhc0NvbG9yOiB7XHJcbiAgICBkZWZhdWx0OiAnI2U2ZTZlNidcclxuICB9LFxyXG4gIHF1YWxpdHk6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIodmFsKSAmJiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICB6b29tU3BlZWQ6IHtcclxuICAgIGRlZmF1bHQ6IDMsXHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGFjY2VwdDoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ2ltYWdlLyonXHJcbiAgfSxcclxuICBmaWxlU2l6ZUxpbWl0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZGlzYWJsZWQ6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZUNsaWNrVG9DaG9vc2U6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZURyYWdUb01vdmU6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICByZXZlcnNlWm9vbWluZ0dlc3R1cmU6IEJvb2xlYW4sXHJcbiAgcHJldmVudFdoaXRlU3BhY2U6IEJvb2xlYW4sXHJcbiAgc2hvd1JlbW92ZUJ1dHRvbjoge1xyXG4gICAgdHlwZTogQm9vbGVhbixcclxuICAgIGRlZmF1bHQ6IHRydWVcclxuICB9LFxyXG4gIHJlbW92ZUJ1dHRvbkNvbG9yOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAncmVkJ1xyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uU2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyXHJcbiAgfVxyXG59IiwiPHRlbXBsYXRlPlxyXG4gIDxkaXYgOmNsYXNzPVwiYGNyb3BwYS1jb250YWluZXIgJHtpbWcgPyAnY3JvcHBhLS1oYXMtdGFyZ2V0JyA6ICcnfSAke2Rpc2FibGVkID8gJ2Nyb3BwYS0tZGlzYWJsZWQnIDogJyd9ICR7ZGlzYWJsZUNsaWNrVG9DaG9vc2UgPyAnY3JvcHBhLS1kaXNhYmxlZC1jYycgOiAnJ30gJHtkaXNhYmxlRHJhZ1RvTW92ZSAmJiBkaXNhYmxlU2Nyb2xsVG9ab29tID8gJ2Nyb3BwYS0tZGlzYWJsZWQtbXonIDogJyd9YFwiPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCJcclxuICAgICAgICAgICA6YWNjZXB0PVwiYWNjZXB0XCJcclxuICAgICAgICAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXHJcbiAgICAgICAgICAgcmVmPVwiZmlsZUlucHV0XCJcclxuICAgICAgICAgICBoaWRkZW5cclxuICAgICAgICAgICBAY2hhbmdlPVwiaGFuZGxlSW5wdXRDaGFuZ2VcIiAvPlxyXG4gICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIlxyXG4gICAgICAgICAgICBAY2xpY2s9XCIhZGlzYWJsZWQgJiYgY2hvb3NlRmlsZSgpXCJcclxuICAgICAgICAgICAgQHRvdWNoc3RhcnQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQG1vdXNlZG93bi5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcnN0YXJ0LnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEB0b3VjaGVuZC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNoY2FuY2VsLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAbW91c2V1cC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJlbmQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyY2FuY2VsLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAdG91Y2htb3ZlLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQG1vdXNlbW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBwb2ludGVybW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBET01Nb3VzZVNjcm9sbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVXaGVlbFwiXHJcbiAgICAgICAgICAgIEBtb3VzZXdoZWVsLnN0b3AucHJldmVudD1cImhhbmRsZVdoZWVsXCI+PC9jYW52YXM+XHJcbiAgICA8c3ZnIGNsYXNzPVwiaWNvbiBpY29uLXJlbW92ZVwiXHJcbiAgICAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZ1wiXHJcbiAgICAgICAgIEBjbGljaz1cInVuc2V0XCJcclxuICAgICAgICAgOnN0eWxlPVwiYHRvcDogLSR7aGVpZ2h0LzQwfXB4OyByaWdodDogLSR7d2lkdGgvNDB9cHhgXCJcclxuICAgICAgICAgdmlld0JveD1cIjAgMCAxMDI0IDEwMjRcIlxyXG4gICAgICAgICB2ZXJzaW9uPVwiMS4xXCJcclxuICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcbiAgICAgICAgIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiXHJcbiAgICAgICAgIDp3aWR0aD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIlxyXG4gICAgICAgICA6aGVpZ2h0PVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aC8xMFwiPlxyXG4gICAgICA8cGF0aCBkPVwiTTUxMS45MjEyMzEgMEMyMjkuMTc5MDc3IDAgMCAyMjkuMjU3ODQ2IDAgNTEyIDAgNzk0LjcwMjc2OSAyMjkuMTc5MDc3IDEwMjQgNTExLjkyMTIzMSAxMDI0IDc5NC43ODE1MzggMTAyNCAxMDI0IDc5NC43MDI3NjkgMTAyNCA1MTIgMTAyNCAyMjkuMjU3ODQ2IDc5NC43ODE1MzggMCA1MTEuOTIxMjMxIDBaTTczMi4wNDE4NDYgNjUwLjYzMzg0NiA2NTAuNTE1NjkyIDczMi4wODEyMzFDNjUwLjUxNTY5MiA3MzIuMDgxMjMxIDUyMS40OTE2OTIgNTkzLjY4MzY5MiA1MTEuODgxODQ2IDU5My42ODM2OTIgNTAyLjQyOTUzOCA1OTMuNjgzNjkyIDM3My4zNjYxNTQgNzMyLjA4MTIzMSAzNzMuMzY2MTU0IDczMi4wODEyMzFMMjkxLjc2MTIzMSA2NTAuNjMzODQ2QzI5MS43NjEyMzEgNjUwLjYzMzg0NiA0MzAuMzE2MzA4IDUyMy41MDAzMDggNDMwLjMxNjMwOCA1MTIuMTk2OTIzIDQzMC4zMTYzMDggNTAwLjY5NjYxNSAyOTEuNzYxMjMxIDM3My41MjM2OTIgMjkxLjc2MTIzMSAzNzMuNTIzNjkyTDM3My4zNjYxNTQgMjkxLjkxODc2OUMzNzMuMzY2MTU0IDI5MS45MTg3NjkgNTAzLjQ1MzUzOCA0MzAuMzk1MDc3IDUxMS44ODE4NDYgNDMwLjM5NTA3NyA1MjAuMzQ5NTM4IDQzMC4zOTUwNzcgNjUwLjUxNTY5MiAyOTEuOTE4NzY5IDY1MC41MTU2OTIgMjkxLjkxODc2OUw3MzIuMDQxODQ2IDM3My41MjM2OTJDNzMyLjA0MTg0NiAzNzMuNTIzNjkyIDU5My40NDczODUgNTAyLjU0NzY5MiA1OTMuNDQ3Mzg1IDUxMi4xOTY5MjMgNTkzLjQ0NzM4NSA1MjEuNDEyOTIzIDczMi4wNDE4NDYgNjUwLjYzMzg0NiA3MzIuMDQxODQ2IDY1MC42MzM4NDZaXCJcclxuICAgICAgICAgICAgOmZpbGw9XCJyZW1vdmVCdXR0b25Db2xvclwiPjwvcGF0aD5cclxuICAgIDwvc3ZnPlxyXG4gIDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHNjcmlwdD5cclxuICBpbXBvcnQgdSBmcm9tICcuL3V0aWwnXHJcbiAgaW1wb3J0IHByb3BzIGZyb20gJy4vcHJvcHMnXHJcblxyXG4gIGNvbnN0IElOSVRfRVZFTlQgPSAnaW5pdCdcclxuICBjb25zdCBGSUxFX0NIT09TRV9FVkVOVCA9ICdmaWxlLWNob29zZSdcclxuICBjb25zdCBGSUxFX1NJWkVfRVhDRUVEX0VWRU5UID0gJ2ZpbGUtc2l6ZS1leGNlZWQnXHJcbiAgY29uc3QgTU9WRV9FVkVOVCA9ICdtb3ZlJ1xyXG4gIGNvbnN0IFpPT01fRVZFTlQgPSAnem9vbSdcclxuXHJcbiAgZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgbW9kZWw6IHtcclxuICAgICAgcHJvcDogJ3ZhbHVlJyxcclxuICAgICAgZXZlbnQ6ICdpbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBwcm9wczogcHJvcHMsXHJcblxyXG4gICAgZGF0YSAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXHJcbiAgICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICAgIGN0eDogbnVsbCxcclxuICAgICAgICBpbWc6IG51bGwsXHJcbiAgICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICAgIGxhc3RNb3ZpbmdDb29yZDogbnVsbCxcclxuICAgICAgICBpbWdEYXRhOiB7fSxcclxuICAgICAgICBkYXRhVXJsOiAnJ1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgIHJlYWxXaWR0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlYWxIZWlnaHQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVhbFBsYWNlaG9sZGVyRm9udFNpemUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyRm9udFNpemUgKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtb3VudGVkICgpIHtcclxuICAgICAgdGhpcy5pbml0KClcclxuICAgIH0sXHJcblxyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlID0gdmFsXHJcbiAgICAgIH0sXHJcbiAgICAgIHJlYWxXaWR0aDogJ2luaXQnLFxyXG4gICAgICByZWFsSGVpZ2h0OiAnaW5pdCcsXHJcbiAgICAgIGNhbnZhc0NvbG9yOiAnaW5pdCcsXHJcbiAgICAgIHBsYWNlaG9sZGVyOiAnaW5pdCcsXHJcbiAgICAgIHBsYWNlaG9sZGVyQ29sb3I6ICdpbml0JyxcclxuICAgICAgcmVhbFBsYWNlaG9sZGVyRm9udFNpemU6ICdpbml0JyxcclxuICAgICAgcHJldmVudFdoaXRlU3BhY2U6ICdpbWdDb250ZW50SW5pdCdcclxuICAgIH0sXHJcblxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICBpbml0ICgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJHJlZnMuY2FudmFzXHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArICdweCdcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArICdweCdcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJyNlNmU2ZTYnIDogKHR5cGVvZiB0aGlzLmNhbnZhc0NvbG9yID09PSAnc3RyaW5nJyA/IHRoaXMuY2FudmFzQ29sb3IgOiAnJylcclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICB0aGlzLiRlbWl0KElOSVRfRVZFTlQsIHtcclxuICAgICAgICAgIGdldENhbnZhczogKCkgPT4gdGhpcy5jYW52YXMsXHJcbiAgICAgICAgICBnZXRDb250ZXh0OiAoKSA9PiB0aGlzLmN0eCxcclxuICAgICAgICAgIGdldENob3NlbkZpbGU6ICgpID0+IHRoaXMuJHJlZnMuZmlsZUlucHV0LmZpbGVzWzBdLFxyXG4gICAgICAgICAgZ2V0QWN0dWFsSW1hZ2VTaXplOiAoKSA9PiAoe1xyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5yZWFsV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIG1vdmVVcHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlRG93bndhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IGFtb3VudCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVMZWZ0d2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVSaWdodHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21JbjogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnpvb20odHJ1ZSwge1xyXG4gICAgICAgICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxyXG4gICAgICAgICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21PdXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVzZXQ6IHRoaXMudW5zZXQsXHJcbiAgICAgICAgICBjaG9vc2VGaWxlOiB0aGlzLmNob29zZUZpbGUsXHJcbiAgICAgICAgICBnZW5lcmF0ZURhdGFVcmw6IHRoaXMuZ2VuZXJhdGVEYXRhVXJsLFxyXG4gICAgICAgICAgZ2VuZXJhdGVCbG9iOiB0aGlzLmdlbmVyYXRlQmxvYlxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB1bnNldCAoKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnJlYWxXaWR0aCwgdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICAgIHRoaXMucGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSdcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcidcclxuICAgICAgICBsZXQgZGVmYXVsdEZvbnRTaXplID0gdGhpcy5yZWFsV2lkdGggLyAxLjUgLyB0aGlzLnBsYWNlaG9sZGVyLmxlbmd0aFxyXG4gICAgICAgIGxldCBmb250U2l6ZSA9ICghdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZSB8fCB0aGlzLnJlYWxQbGFjZWhvbGRlckZvbnRTaXplID09IDApID8gZGVmYXVsdEZvbnRTaXplIDogdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZVxyXG4gICAgICAgIGN0eC5mb250ID0gZm9udFNpemUgKyAncHggc2Fucy1zZXJpZidcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gKCF0aGlzLnBsYWNlaG9sZGVyQ29sb3IgfHwgdGhpcy5wbGFjZWhvbGRlckNvbG9yID09ICdkZWZhdWx0JykgPyAnIzYwNjA2MCcgOiB0aGlzLnBsYWNlaG9sZGVyQ29sb3JcclxuICAgICAgICBjdHguZmlsbFRleHQodGhpcy5wbGFjZWhvbGRlciwgdGhpcy5yZWFsV2lkdGggLyAyLCB0aGlzLnJlYWxIZWlnaHQgLyAyKVxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcclxuICAgICAgICB0aGlzLmltZ0RhdGEgPSB7fVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgY2hvb3NlRmlsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nIHx8IHRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UpIHJldHVyblxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LmNsaWNrKClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZUlucHV0Q2hhbmdlICgpIHtcclxuICAgICAgICBsZXQgaW5wdXQgPSB0aGlzLiRyZWZzLmZpbGVJbnB1dFxyXG4gICAgICAgIGlmICghaW5wdXQuZmlsZXMubGVuZ3RoKSByZXR1cm5cclxuXHJcbiAgICAgICAgbGV0IGZpbGUgPSBpbnB1dC5maWxlc1swXVxyXG4gICAgICAgIHRoaXMuJGVtaXQoRklMRV9DSE9PU0VfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVTaXplSXNWYWxpZChmaWxlKSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChGSUxFX1NJWkVfRVhDRUVEX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaWxlIHNpemUgZXhjZWVkcyBsaW1pdCB3aGljaCBpcyAnICsgdGhpcy5maWxlU2l6ZUxpbWl0ICsgJyBieXRlcy4nKVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZnIgPSBuZXcgRmlsZVJlYWRlcigpXHJcbiAgICAgICAgZnIub25sb2FkID0gKGUpID0+IHtcclxuICAgICAgICAgIGxldCBmaWxlRGF0YSA9IGUudGFyZ2V0LnJlc3VsdFxyXG4gICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICBpbWcuc3JjID0gZmlsZURhdGFcclxuICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1nID0gaW1nXHJcbiAgICAgICAgICAgIHRoaXMuaW1nQ29udGVudEluaXQoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmci5yZWFkQXNEYXRhVVJMKGZpbGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmaWxlU2l6ZUlzVmFsaWQgKGZpbGUpIHtcclxuICAgICAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUxpbWl0IHx8IHRoaXMuZmlsZVNpemVMaW1pdCA9PSAwKSByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICAgICByZXR1cm4gZmlsZS5zaXplIDwgdGhpcy5maWxlU2l6ZUxpbWl0XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBpbWdDb250ZW50SW5pdCAoKSB7XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMuaW1nLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLmltZy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgICAgbGV0IGltZ1JhdGlvID0gaW1nSGVpZ2h0IC8gaW1nV2lkdGhcclxuICAgICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLnJlYWxXaWR0aFxyXG5cclxuICAgICAgICAvLyBkaXNwbGF5IGFzIGZpdFxyXG4gICAgICAgIGlmIChpbWdSYXRpbyA8IGNhbnZhc1JhdGlvKSB7XHJcbiAgICAgICAgICBsZXQgcmF0aW8gPSBpbWdIZWlnaHQgLyB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gcmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHJhdGlvID0gaW1nV2lkdGggLyB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlclN0YXJ0IChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKGV2dC53aGljaCAmJiBldnQud2hpY2ggPiAxKSByZXR1cm5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxyXG5cclxuICAgICAgICBpZiAoZG9jdW1lbnQpIHtcclxuICAgICAgICAgIGxldCBjYW5jZWxFdmVudHMgPSBbJ21vdXNldXAnLCAndG91Y2hlbmQnLCAndG91Y2hjYW5jZWwnLCAncG9pbnRlcmVuZCcsICdwb2ludGVyY2FuY2VsJ11cclxuICAgICAgICAgIGZvciAobGV0IGUgb2YgY2FuY2VsRXZlbnRzKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZSwgdGhpcy5oYW5kbGVQb2ludGVyRW5kKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJFbmQgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IG51bGxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnVG9Nb3ZlKSByZXR1cm5cclxuICAgICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxyXG4gICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgaWYgKHRoaXMubGFzdE1vdmluZ0Nvb3JkKSB7XHJcbiAgICAgICAgICB0aGlzLm1vdmUoe1xyXG4gICAgICAgICAgICB4OiBjb29yZC54IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueCxcclxuICAgICAgICAgICAgeTogY29vcmQueSAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLnlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVdoZWVsIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVTY3JvbGxUb1pvb20pIHJldHVyblxyXG4gICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgaWYgKGV2dC53aGVlbERlbHRhIDwgMCB8fCBldnQuZGV0YWlsIDwgMCkge1xyXG4gICAgICAgICAgLy8g5omL5oyH5ZCR5LiKXHJcbiAgICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlWm9vbWluZ0dlc3R1cmUsIGNvb3JkKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LndoZWVsRGVsdGEgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XHJcbiAgICAgICAgICAvLyDmiYvmjIflkJHkuItcclxuICAgICAgICAgIHRoaXMuem9vbSghdGhpcy5yZXZlcnNlWm9vbWluZ0dlc3R1cmUsIGNvb3JkKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1vdmUgKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghb2Zmc2V0KSByZXR1cm5cclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYICs9IG9mZnNldC54XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSArPSBvZmZzZXQueVxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLnByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRlbWl0KE1PVkVfRVZFTlQpXHJcbiAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFkgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWFsV2lkdGggLSB0aGlzLmltZ0RhdGEuc3RhcnRYID4gdGhpcy5pbWdEYXRhLndpZHRoKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVhbEhlaWdodCAtIHRoaXMuaW1nRGF0YS5zdGFydFkgPiB0aGlzLmltZ0RhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHpvb20gKHpvb21JbiwgcG9zKSB7XHJcbiAgICAgICAgbGV0IHNwZWVkID0gKHRoaXMucmVhbFdpZHRoIC8gMTAwMDAwKSAqIHRoaXMuem9vbVNwZWVkXHJcbiAgICAgICAgbGV0IHggPSAxXHJcbiAgICAgICAgaWYgKHpvb21Jbikge1xyXG4gICAgICAgICAgeCA9IDEgKyBzcGVlZFxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbWdEYXRhLndpZHRoID4gMjApIHtcclxuICAgICAgICAgIHggPSAxIC0gc3BlZWRcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogeFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogeFxyXG4gICAgICAgIGxldCBvZmZzZXRYID0gKHggLSAxKSAqIChwb3MueCAtIHRoaXMuaW1nRGF0YS5zdGFydFgpXHJcbiAgICAgICAgbGV0IG9mZnNldFkgPSAoeCAtIDEpICogKHBvcy55IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSlcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gdGhpcy5pbWdEYXRhLnN0YXJ0WCAtIG9mZnNldFhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WSAtIG9mZnNldFlcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPCB0aGlzLnJlYWxXaWR0aCkge1xyXG4gICAgICAgICAgICBsZXQgX3ggPSB0aGlzLnJlYWxXaWR0aCAvIHRoaXMuaW1nRGF0YS53aWR0aFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5pbWdEYXRhLmhlaWdodCAqIF94XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5oZWlnaHQgPCB0aGlzLnJlYWxIZWlnaHQpIHtcclxuICAgICAgICAgICAgbGV0IF94ID0gdGhpcy5yZWFsSGVpZ2h0IC8gdGhpcy5pbWdEYXRhLmhlaWdodFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMuaW1nRGF0YS53aWR0aCAqIF94XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRlbWl0KFpPT01fRVZFTlQpXHJcbiAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHBhaW50QmFja2dyb3VuZCAoKSB7XHJcbiAgICAgICAgbGV0IGJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAnI2U2ZTZlNicgOiB0aGlzLmNhbnZhc0NvbG9yXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGRyYXcgKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmltZ0RhdGFcclxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucmVhbFdpZHRoLCB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgICAgdGhpcy5wYWludEJhY2tncm91bmQoKVxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2VuZXJhdGVEYXRhVXJsICh0eXBlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuICcnXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCh0eXBlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2VuZXJhdGVCbG9iIChjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVybiBudWxsXHJcbiAgICAgICAgdGhpcy5jYW52YXMudG9CbG9iKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZSBsYW5nPVwic3R5bHVzXCI+XHJcbiAgLmNyb3BwYS1jb250YWluZXIgXHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2tcclxuICAgIGN1cnNvcjogcG9pbnRlclxyXG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAuM3NcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZVxyXG4gICAgJjpob3ZlclxyXG4gICAgICBvcGFjaXR5OiAuN1xyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkLWNjIFxyXG4gICAgICBjdXJzb3I6IGRlZmF1bHRcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgICYuY3JvcHBhLS1oYXMtdGFyZ2V0XHJcbiAgICAgIGN1cnNvcjogbW92ZVxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICAmLmNyb3BwYS0tZGlzYWJsZWQtbXpcclxuICAgICAgICBjdXJzb3I6IGRlZmF1bHRcclxuICAgICYuY3JvcHBhLS1kaXNhYmxlZFxyXG4gICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICBzdmcuaWNvbi1yZW1vdmVcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlXHJcbiAgICAgIGJhY2tncm91bmQ6IHdoaXRlXHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDUwJVxyXG4gICAgICBib3gtc2hhZG93OiAtMnB4IDJweCA2cHggcmdiYSgwLCAwLCAwLCAwLjcpXHJcbiAgICAgIHotaW5kZXg6IDEwXHJcbiAgICAgIGN1cnNvcjogcG9pbnRlclxyXG4gICAgICBib3JkZXI6IDJweCBzb2xpZCB3aGl0ZVxyXG4gIC5pbWFnZVxyXG4gICAgbWF4LXdpZHRoOiAxMDAlXHJcbiAgICBtYXgtaGVpZ2h0OiAxMDAlXHJcblxyXG48L3N0eWxlPlxyXG4iLCJpbXBvcnQgY3JvcHBlciBmcm9tICcuL2Nyb3BwZXIudnVlJ1xyXG5cclxuY29uc3QgVnVlQ3JvcHBhID0ge1xyXG4gIGluc3RhbGw6IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcclxuICAgIFZ1ZS5jb21wb25lbnQoJ2Nyb3BwYScsIGNyb3BwZXIpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsiZXZ0IiwiY3JvcHBlclZNIiwiY2FudmFzIiwicXVhbGl0eSIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRYIiwidG91Y2hlcyIsImNsaWVudFkiLCJsZWZ0IiwidG9wIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidmFsdWUiLCJpc0Zpbml0ZSIsIk1hdGgiLCJmbG9vciIsIk9iamVjdCIsInZhbCIsIlN0cmluZyIsIkJvb2xlYW4iLCJJTklUX0VWRU5UIiwiRklMRV9DSE9PU0VfRVZFTlQiLCJGSUxFX1NJWkVfRVhDRUVEX0VWRU5UIiwiTU9WRV9FVkVOVCIsIlpPT01fRVZFTlQiLCJyZW5kZXIiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwicGxhY2Vob2xkZXJGb250U2l6ZSIsImluaXQiLCJpbnN0YW5jZSIsIiRyZWZzIiwicmVhbFdpZHRoIiwicmVhbEhlaWdodCIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY2FudmFzQ29sb3IiLCJjdHgiLCJnZXRDb250ZXh0IiwidW5zZXQiLCIkZW1pdCIsImZpbGVJbnB1dCIsImZpbGVzIiwiYW1vdW50IiwibW92ZSIsIngiLCJ5Iiwiem9vbSIsImltZ0RhdGEiLCJzdGFydFgiLCJzdGFydFkiLCJjaG9vc2VGaWxlIiwiZ2VuZXJhdGVEYXRhVXJsIiwiZ2VuZXJhdGVCbG9iIiwiY2xlYXJSZWN0IiwicGFpbnRCYWNrZ3JvdW5kIiwidGV4dEJhc2VsaW5lIiwidGV4dEFsaWduIiwiZGVmYXVsdEZvbnRTaXplIiwicGxhY2Vob2xkZXIiLCJsZW5ndGgiLCJmb250U2l6ZSIsInJlYWxQbGFjZWhvbGRlckZvbnRTaXplIiwiZm9udCIsImZpbGxTdHlsZSIsInBsYWNlaG9sZGVyQ29sb3IiLCJmaWxsVGV4dCIsImltZyIsImRpc2FibGVDbGlja1RvQ2hvb3NlIiwiY2xpY2siLCJpbnB1dCIsImZpbGUiLCJmaWxlU2l6ZUlzVmFsaWQiLCJFcnJvciIsImZpbGVTaXplTGltaXQiLCJmciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJlIiwiZmlsZURhdGEiLCJ0YXJnZXQiLCJyZXN1bHQiLCJJbWFnZSIsInNyYyIsImltZ0NvbnRlbnRJbml0IiwicmVhZEFzRGF0YVVSTCIsInNpemUiLCJpbWdXaWR0aCIsIm5hdHVyYWxXaWR0aCIsImltZ0hlaWdodCIsIm5hdHVyYWxIZWlnaHQiLCJpbWdSYXRpbyIsImNhbnZhc1JhdGlvIiwicmF0aW8iLCJkcmF3IiwiZGlzYWJsZWQiLCJ3aGljaCIsImRyYWdnaW5nIiwiZG9jdW1lbnQiLCJjYW5jZWxFdmVudHMiLCJhZGRFdmVudExpc3RlbmVyIiwiaGFuZGxlUG9pbnRlckVuZCIsImxhc3RNb3ZpbmdDb29yZCIsImRpc2FibGVEcmFnVG9Nb3ZlIiwiY29vcmQiLCJ1IiwiZ2V0UG9pbnRlckNvb3JkcyIsImRpc2FibGVTY3JvbGxUb1pvb20iLCJ3aGVlbERlbHRhIiwiZGV0YWlsIiwicmV2ZXJzZVpvb21pbmdHZXN0dXJlIiwib2Zmc2V0IiwicHJldmVudFdoaXRlU3BhY2UiLCJwcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlIiwiem9vbUluIiwicG9zIiwic3BlZWQiLCJ6b29tU3BlZWQiLCJvZmZzZXRYIiwib2Zmc2V0WSIsIl94IiwiZmlsbFJlY3QiLCJkcmF3SW1hZ2UiLCJ0eXBlIiwidG9EYXRhVVJMIiwiY2FsbGJhY2siLCJtaW1lVHlwZSIsInF1YWxpdHlBcmd1bWVudCIsInRvQmxvYiIsIlZ1ZUNyb3BwYSIsIlZ1ZSIsIm9wdGlvbnMiLCJjb21wb25lbnQiLCJjcm9wcGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLFFBQWU7a0JBQUEsNEJBQ0lBLEdBREosRUFDU0MsU0FEVCxFQUNvQjtRQUN6QkMsTUFEeUIsR0FDTEQsU0FESyxDQUN6QkMsTUFEeUI7UUFDakJDLE9BRGlCLEdBQ0xGLFNBREssQ0FDakJFLE9BRGlCOztRQUUzQkMsT0FBT0YsT0FBT0cscUJBQVAsRUFBWDtRQUNJQyxVQUFVTixJQUFJTyxPQUFKLEdBQWNQLElBQUlPLE9BQUosQ0FBWSxDQUFaLEVBQWVELE9BQTdCLEdBQXVDTixJQUFJTSxPQUF6RDtRQUNJRSxVQUFVUixJQUFJTyxPQUFKLEdBQWNQLElBQUlPLE9BQUosQ0FBWSxDQUFaLEVBQWVDLE9BQTdCLEdBQXVDUixJQUFJUSxPQUF6RDtXQUNPO1NBQ0YsQ0FBQ0YsVUFBVUYsS0FBS0ssSUFBaEIsSUFBd0JOLE9BRHRCO1NBRUYsQ0FBQ0ssVUFBVUosS0FBS00sR0FBaEIsSUFBdUJQO0tBRjVCOztDQU5KOztBQ0FBUSxPQUFPQyxTQUFQ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
