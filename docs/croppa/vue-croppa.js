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
    placeholderFontSize: 'init',
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
      var fontSize = !this.placeholderFontSize || this.placeholderFontSize == 0 ? defaultFontSize : this.placeholderFontSize;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi9zcmMvY3JvcHBlci52dWUiLCIuLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgZ2V0UG9pbnRlckNvb3JkcyhldnQsIGNyb3BwZXJWTSkge1xyXG4gICAgbGV0IHsgY2FudmFzLCBxdWFsaXR5IH0gPSBjcm9wcGVyVk1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WCA6IGV2dC5jbGllbnRYXHJcbiAgICBsZXQgY2xpZW50WSA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WSA6IGV2dC5jbGllbnRZXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiAoY2xpZW50WCAtIHJlY3QubGVmdCkgKiBxdWFsaXR5LFxyXG4gICAgICB5OiAoY2xpZW50WSAtIHJlY3QudG9wKSAqIHF1YWxpdHlcclxuICAgIH1cclxuICB9XHJcbn0iLCJOdW1iZXIuaXNJbnRlZ2VyID0gTnVtYmVyLmlzSW50ZWdlciB8fCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB2YWx1ZTogT2JqZWN0LFxyXG4gIHdpZHRoOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGhlaWdodDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMjAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBwbGFjZWhvbGRlcjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ0Nob29zZSBhbiBpbWFnZSdcclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjNjA2MDYwJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJGb250U2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGNhbnZhc0NvbG9yOiB7XHJcbiAgICBkZWZhdWx0OiAnI2U2ZTZlNidcclxuICB9LFxyXG4gIHF1YWxpdHk6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIodmFsKSAmJiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICB6b29tU3BlZWQ6IHtcclxuICAgIGRlZmF1bHQ6IDMsXHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGFjY2VwdDoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ2ltYWdlLyonXHJcbiAgfSxcclxuICBmaWxlU2l6ZUxpbWl0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZGlzYWJsZWQ6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZUNsaWNrVG9DaG9vc2U6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZURyYWdUb01vdmU6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICByZXZlcnNlWm9vbWluZ0dlc3R1cmU6IEJvb2xlYW4sXHJcbiAgcHJldmVudFdoaXRlU3BhY2U6IEJvb2xlYW4sXHJcbiAgc2hvd1JlbW92ZUJ1dHRvbjoge1xyXG4gICAgdHlwZTogQm9vbGVhbixcclxuICAgIGRlZmF1bHQ6IHRydWVcclxuICB9LFxyXG4gIHJlbW92ZUJ1dHRvbkNvbG9yOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAncmVkJ1xyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uU2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyXHJcbiAgfVxyXG59IiwiPHRlbXBsYXRlPlxyXG4gIDxkaXYgOmNsYXNzPVwiYGNyb3BwYS1jb250YWluZXIgJHtpbWcgPyAnY3JvcHBhLS1oYXMtdGFyZ2V0JyA6ICcnfSAke2Rpc2FibGVkID8gJ2Nyb3BwYS0tZGlzYWJsZWQnIDogJyd9ICR7ZGlzYWJsZUNsaWNrVG9DaG9vc2UgPyAnY3JvcHBhLS1kaXNhYmxlZC1jYycgOiAnJ30gJHtkaXNhYmxlRHJhZ1RvTW92ZSAmJiBkaXNhYmxlU2Nyb2xsVG9ab29tID8gJ2Nyb3BwYS0tZGlzYWJsZWQtbXonIDogJyd9YFwiPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCJcclxuICAgICAgICAgICA6YWNjZXB0PVwiYWNjZXB0XCJcclxuICAgICAgICAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXHJcbiAgICAgICAgICAgcmVmPVwiZmlsZUlucHV0XCJcclxuICAgICAgICAgICBoaWRkZW5cclxuICAgICAgICAgICBAY2hhbmdlPVwiaGFuZGxlSW5wdXRDaGFuZ2VcIiAvPlxyXG4gICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIlxyXG4gICAgICAgICAgICBAY2xpY2s9XCIhZGlzYWJsZWQgJiYgY2hvb3NlRmlsZSgpXCJcclxuICAgICAgICAgICAgQHRvdWNoc3RhcnQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQG1vdXNlZG93bi5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcnN0YXJ0LnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEB0b3VjaGVuZC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNoY2FuY2VsLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAbW91c2V1cC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJlbmQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyY2FuY2VsLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAdG91Y2htb3ZlLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQG1vdXNlbW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBwb2ludGVybW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBET01Nb3VzZVNjcm9sbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVXaGVlbFwiXHJcbiAgICAgICAgICAgIEBtb3VzZXdoZWVsLnN0b3AucHJldmVudD1cImhhbmRsZVdoZWVsXCI+PC9jYW52YXM+XHJcbiAgICA8c3ZnIGNsYXNzPVwiaWNvbiBpY29uLXJlbW92ZVwiXHJcbiAgICAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZ1wiXHJcbiAgICAgICAgIEBjbGljaz1cInVuc2V0XCJcclxuICAgICAgICAgOnN0eWxlPVwiYHRvcDogLSR7aGVpZ2h0LzQwfXB4OyByaWdodDogLSR7d2lkdGgvNDB9cHhgXCJcclxuICAgICAgICAgdmlld0JveD1cIjAgMCAxMDI0IDEwMjRcIlxyXG4gICAgICAgICB2ZXJzaW9uPVwiMS4xXCJcclxuICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcbiAgICAgICAgIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiXHJcbiAgICAgICAgIDp3aWR0aD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIlxyXG4gICAgICAgICA6aGVpZ2h0PVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aC8xMFwiPlxyXG4gICAgICA8cGF0aCBkPVwiTTUxMS45MjEyMzEgMEMyMjkuMTc5MDc3IDAgMCAyMjkuMjU3ODQ2IDAgNTEyIDAgNzk0LjcwMjc2OSAyMjkuMTc5MDc3IDEwMjQgNTExLjkyMTIzMSAxMDI0IDc5NC43ODE1MzggMTAyNCAxMDI0IDc5NC43MDI3NjkgMTAyNCA1MTIgMTAyNCAyMjkuMjU3ODQ2IDc5NC43ODE1MzggMCA1MTEuOTIxMjMxIDBaTTczMi4wNDE4NDYgNjUwLjYzMzg0NiA2NTAuNTE1NjkyIDczMi4wODEyMzFDNjUwLjUxNTY5MiA3MzIuMDgxMjMxIDUyMS40OTE2OTIgNTkzLjY4MzY5MiA1MTEuODgxODQ2IDU5My42ODM2OTIgNTAyLjQyOTUzOCA1OTMuNjgzNjkyIDM3My4zNjYxNTQgNzMyLjA4MTIzMSAzNzMuMzY2MTU0IDczMi4wODEyMzFMMjkxLjc2MTIzMSA2NTAuNjMzODQ2QzI5MS43NjEyMzEgNjUwLjYzMzg0NiA0MzAuMzE2MzA4IDUyMy41MDAzMDggNDMwLjMxNjMwOCA1MTIuMTk2OTIzIDQzMC4zMTYzMDggNTAwLjY5NjYxNSAyOTEuNzYxMjMxIDM3My41MjM2OTIgMjkxLjc2MTIzMSAzNzMuNTIzNjkyTDM3My4zNjYxNTQgMjkxLjkxODc2OUMzNzMuMzY2MTU0IDI5MS45MTg3NjkgNTAzLjQ1MzUzOCA0MzAuMzk1MDc3IDUxMS44ODE4NDYgNDMwLjM5NTA3NyA1MjAuMzQ5NTM4IDQzMC4zOTUwNzcgNjUwLjUxNTY5MiAyOTEuOTE4NzY5IDY1MC41MTU2OTIgMjkxLjkxODc2OUw3MzIuMDQxODQ2IDM3My41MjM2OTJDNzMyLjA0MTg0NiAzNzMuNTIzNjkyIDU5My40NDczODUgNTAyLjU0NzY5MiA1OTMuNDQ3Mzg1IDUxMi4xOTY5MjMgNTkzLjQ0NzM4NSA1MjEuNDEyOTIzIDczMi4wNDE4NDYgNjUwLjYzMzg0NiA3MzIuMDQxODQ2IDY1MC42MzM4NDZaXCJcclxuICAgICAgICAgICAgOmZpbGw9XCJyZW1vdmVCdXR0b25Db2xvclwiPjwvcGF0aD5cclxuICAgIDwvc3ZnPlxyXG4gIDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHNjcmlwdD5cclxuICBpbXBvcnQgdSBmcm9tICcuL3V0aWwnXHJcbiAgaW1wb3J0IHByb3BzIGZyb20gJy4vcHJvcHMnXHJcblxyXG4gIGNvbnN0IElOSVRfRVZFTlQgPSAnaW5pdCdcclxuICBjb25zdCBGSUxFX0NIT09TRV9FVkVOVCA9ICdmaWxlLWNob29zZSdcclxuICBjb25zdCBGSUxFX1NJWkVfRVhDRUVEX0VWRU5UID0gJ2ZpbGUtc2l6ZS1leGNlZWQnXHJcbiAgY29uc3QgTU9WRV9FVkVOVCA9ICdtb3ZlJ1xyXG4gIGNvbnN0IFpPT01fRVZFTlQgPSAnem9vbSdcclxuXHJcbiAgZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgbW9kZWw6IHtcclxuICAgICAgcHJvcDogJ3ZhbHVlJyxcclxuICAgICAgZXZlbnQ6ICdpbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBwcm9wczogcHJvcHMsXHJcblxyXG4gICAgZGF0YSAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXHJcbiAgICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICAgIGN0eDogbnVsbCxcclxuICAgICAgICBpbWc6IG51bGwsXHJcbiAgICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICAgIGxhc3RNb3ZpbmdDb29yZDogbnVsbCxcclxuICAgICAgICBpbWdEYXRhOiB7fSxcclxuICAgICAgICBkYXRhVXJsOiAnJ1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgIHJlYWxXaWR0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlYWxIZWlnaHQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdW50ZWQgKCkge1xyXG4gICAgICB0aGlzLmluaXQoKVxyXG4gICAgfSxcclxuXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSB2YWxcclxuICAgICAgfSxcclxuICAgICAgcmVhbFdpZHRoOiAnaW5pdCcsXHJcbiAgICAgIHJlYWxIZWlnaHQ6ICdpbml0JyxcclxuICAgICAgY2FudmFzQ29sb3I6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXI6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogJ2luaXQnLFxyXG4gICAgICBwbGFjZWhvbGRlckZvbnRTaXplOiAnaW5pdCcsXHJcbiAgICAgIHByZXZlbnRXaGl0ZVNwYWNlOiAnaW1nQ29udGVudEluaXQnXHJcbiAgICB9LFxyXG5cclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgaW5pdCAoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRyZWZzLmNhbnZhc1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyAncHgnXHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyAncHgnXHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgICAgdGhpcy51bnNldCgpXHJcbiAgICAgICAgdGhpcy4kZW1pdChJTklUX0VWRU5ULCB7XHJcbiAgICAgICAgICBnZXRDYW52YXM6ICgpID0+IHRoaXMuY2FudmFzLFxyXG4gICAgICAgICAgZ2V0Q29udGV4dDogKCkgPT4gdGhpcy5jdHgsXHJcbiAgICAgICAgICBnZXRDaG9zZW5GaWxlOiAoKSA9PiB0aGlzLiRyZWZzLmZpbGVJbnB1dC5maWxlc1swXSxcclxuICAgICAgICAgIGdldEFjdHVhbEltYWdlU2l6ZTogKCkgPT4gKHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucmVhbFdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICBtb3ZlVXB3YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiAtYW1vdW50IH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZURvd253YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiBhbW91bnQgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlTGVmdHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IC1hbW91bnQsIHk6IDAgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlUmlnaHR3YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiBhbW91bnQsIHk6IDAgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB6b29tSW46ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKHRydWUsIHtcclxuICAgICAgICAgICAgICB4OiB0aGlzLmltZ0RhdGEuc3RhcnRYICsgdGhpcy5pbWdEYXRhLndpZHRoIC8gMixcclxuICAgICAgICAgICAgICB5OiB0aGlzLmltZ0RhdGEuc3RhcnRZICsgdGhpcy5pbWdEYXRhLmhlaWdodCAvIDJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB6b29tT3V0OiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuem9vbShmYWxzZSwge1xyXG4gICAgICAgICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxyXG4gICAgICAgICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHJlc2V0OiB0aGlzLnVuc2V0LFxyXG4gICAgICAgICAgY2hvb3NlRmlsZTogdGhpcy5jaG9vc2VGaWxlLFxyXG4gICAgICAgICAgZ2VuZXJhdGVEYXRhVXJsOiB0aGlzLmdlbmVyYXRlRGF0YVVybCxcclxuICAgICAgICAgIGdlbmVyYXRlQmxvYjogdGhpcy5nZW5lcmF0ZUJsb2JcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgdW5zZXQgKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXHJcbiAgICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMucmVhbFdpZHRoIC8gMS41IC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcclxuICAgICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMucGxhY2Vob2xkZXJGb250U2l6ZSB8fCB0aGlzLnBsYWNlaG9sZGVyRm9udFNpemUgPT0gMCkgPyBkZWZhdWx0Rm9udFNpemUgOiB0aGlzLnBsYWNlaG9sZGVyRm9udFNpemVcclxuICAgICAgICBjdHguZm9udCA9IGZvbnRTaXplICsgJ3B4IHNhbnMtc2VyaWYnXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMucmVhbFdpZHRoIC8gMiwgdGhpcy5yZWFsSGVpZ2h0IC8gMilcclxuICAgICAgICB0aGlzLmltZyA9IG51bGxcclxuICAgICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC52YWx1ZSA9ICcnXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhID0ge31cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNob29zZUZpbGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmltZyB8fCB0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSByZXR1cm5cclxuICAgICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC5jbGljaygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVJbnB1dENoYW5nZSAoKSB7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gdGhpcy4kcmVmcy5maWxlSW5wdXRcclxuICAgICAgICBpZiAoIWlucHV0LmZpbGVzLmxlbmd0aCkgcmV0dXJuXHJcblxyXG4gICAgICAgIGxldCBmaWxlID0gaW5wdXQuZmlsZXNbMF1cclxuICAgICAgICB0aGlzLiRlbWl0KEZJTEVfQ0hPT1NFX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBzaXplIGV4Y2VlZHMgbGltaXQgd2hpY2ggaXMgJyArIHRoaXMuZmlsZVNpemVMaW1pdCArICcgYnl0ZXMuJylcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgICAgIGZyLm9ubG9hZCA9IChlKSA9PiB7XHJcbiAgICAgICAgICBsZXQgZmlsZURhdGEgPSBlLnRhcmdldC5yZXN1bHRcclxuICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgICAgaW1nLnNyYyA9IGZpbGVEYXRhXHJcbiAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmltZyA9IGltZ1xyXG4gICAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmlsZVNpemVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2VcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVNpemVMaW1pdCB8fCB0aGlzLmZpbGVTaXplTGltaXQgPT0gMCkgcmV0dXJuIHRydWVcclxuXHJcbiAgICAgICAgcmV0dXJuIGZpbGUuc2l6ZSA8IHRoaXMuZmlsZVNpemVMaW1pdFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaW1nQ29udGVudEluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLmltZy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIGxldCBpbWdSYXRpbyA9IGltZ0hlaWdodCAvIGltZ1dpZHRoXHJcbiAgICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5yZWFsSGVpZ2h0IC8gdGhpcy5yZWFsV2lkdGhcclxuXHJcbiAgICAgICAgLy8gZGlzcGxheSBhcyBmaXRcclxuICAgICAgICBpZiAoaW1nUmF0aW8gPCBjYW52YXNSYXRpbykge1xyXG4gICAgICAgICAgbGV0IHJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCByYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyByYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJTdGFydCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICAgIGlmIChldnQud2hpY2ggJiYgZXZ0LndoaWNoID4gMSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcclxuXHJcbiAgICAgICAgaWYgKGRvY3VtZW50KSB7XHJcbiAgICAgICAgICBsZXQgY2FuY2VsRXZlbnRzID0gWydtb3VzZXVwJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJywgJ3BvaW50ZXJlbmQnLCAncG9pbnRlcmNhbmNlbCddXHJcbiAgICAgICAgICBmb3IgKGxldCBlIG9mIGNhbmNlbEV2ZW50cykge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuaGFuZGxlUG9pbnRlckVuZClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyRW5kIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBudWxsXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyTW92ZSAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ1RvTW92ZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cclxuICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIGlmICh0aGlzLmxhc3RNb3ZpbmdDb29yZCkge1xyXG4gICAgICAgICAgdGhpcy5tb3ZlKHtcclxuICAgICAgICAgICAgeDogY29vcmQueCAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLngsXHJcbiAgICAgICAgICAgIHk6IGNvb3JkLnkgLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC55XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVXaGVlbCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlU2Nyb2xsVG9ab29tKSByZXR1cm5cclxuICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIGlmIChldnQud2hlZWxEZWx0YSA8IDAgfHwgZXZ0LmRldGFpbCA8IDApIHtcclxuICAgICAgICAgIC8vIOaJi+aMh+WQkeS4ilxyXG4gICAgICAgICAgdGhpcy56b29tKHRoaXMucmV2ZXJzZVpvb21pbmdHZXN0dXJlLCBjb29yZClcclxuICAgICAgICB9IGVsc2UgaWYgKGV2dC53aGVlbERlbHRhID4gMCB8fCBldnQuZGV0YWlsID4gMCkge1xyXG4gICAgICAgICAgLy8g5omL5oyH5ZCR5LiLXHJcbiAgICAgICAgICB0aGlzLnpvb20oIXRoaXMucmV2ZXJzZVpvb21pbmdHZXN0dXJlLCBjb29yZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlIChvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIW9mZnNldCkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgKz0gb2Zmc2V0LnlcclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4kZW1pdChNT1ZFX0VWRU5UKVxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRZID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVhbFdpZHRoIC0gdGhpcy5pbWdEYXRhLnN0YXJ0WCA+IHRoaXMuaW1nRGF0YS53aWR0aCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5yZWFsV2lkdGgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlYWxIZWlnaHQgLSB0aGlzLmltZ0RhdGEuc3RhcnRZID4gdGhpcy5pbWdEYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB6b29tICh6b29tSW4sIHBvcykge1xyXG4gICAgICAgIGxldCBzcGVlZCA9ICh0aGlzLnJlYWxXaWR0aCAvIDEwMDAwMCkgKiB0aGlzLnpvb21TcGVlZFxyXG4gICAgICAgIGxldCB4ID0gMVxyXG4gICAgICAgIGlmICh6b29tSW4pIHtcclxuICAgICAgICAgIHggPSAxICsgc3BlZWRcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA+IDIwKSB7XHJcbiAgICAgICAgICB4ID0gMSAtIHNwZWVkXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMuaW1nRGF0YS53aWR0aCAqIHhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5pbWdEYXRhLmhlaWdodCAqIHhcclxuICAgICAgICBsZXQgb2Zmc2V0WCA9ICh4IC0gMSkgKiAocG9zLnggLSB0aGlzLmltZ0RhdGEuc3RhcnRYKVxyXG4gICAgICAgIGxldCBvZmZzZXRZID0gKHggLSAxKSAqIChwb3MueSAtIHRoaXMuaW1nRGF0YS5zdGFydFkpXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHRoaXMuaW1nRGF0YS5zdGFydFggLSBvZmZzZXRYXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHRoaXMuaW1nRGF0YS5zdGFydFkgLSBvZmZzZXRZXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLndpZHRoIDwgdGhpcy5yZWFsV2lkdGgpIHtcclxuICAgICAgICAgICAgbGV0IF94ID0gdGhpcy5yZWFsV2lkdGggLyB0aGlzLmltZ0RhdGEud2lkdGhcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHQgKiBfeFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh0aGlzLmltZ0RhdGEuaGVpZ2h0IDwgdGhpcy5yZWFsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMucmVhbEhlaWdodCAvIHRoaXMuaW1nRGF0YS5oZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGggKiBfeFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4kZW1pdChaT09NX0VWRU5UKVxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwYWludEJhY2tncm91bmQgKCkge1xyXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJyNlNmU2ZTYnIDogdGhpcy5jYW52YXNDb2xvclxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvclxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMucmVhbFdpZHRoLCB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBkcmF3ICgpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5pbWdEYXRhXHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnJlYWxXaWR0aCwgdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICAgIHRoaXMucGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdlbmVyYXRlRGF0YVVybCAodHlwZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVybiAnJ1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwodHlwZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdlbmVyYXRlQmxvYiAoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4gbnVsbFxyXG4gICAgICAgIHRoaXMuY2FudmFzLnRvQmxvYihjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGUgbGFuZz1cInN0eWx1c1wiPlxyXG4gIC5jcm9wcGEtY29udGFpbmVyIFxyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrXHJcbiAgICBjdXJzb3I6IHBvaW50ZXJcclxuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgLjNzXHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmVcclxuICAgICY6aG92ZXJcclxuICAgICAgb3BhY2l0eTogLjdcclxuICAgICYuY3JvcHBhLS1kaXNhYmxlZC1jYyBcclxuICAgICAgY3Vyc29yOiBkZWZhdWx0XHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAmLmNyb3BwYS0taGFzLXRhcmdldFxyXG4gICAgICBjdXJzb3I6IG1vdmVcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgICAgJi5jcm9wcGEtLWRpc2FibGVkLW16XHJcbiAgICAgICAgY3Vyc29yOiBkZWZhdWx0XHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWRcclxuICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZFxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgc3ZnLmljb24tcmVtb3ZlXHJcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZVxyXG4gICAgICBiYWNrZ3JvdW5kOiB3aGl0ZVxyXG4gICAgICBib3JkZXItcmFkaXVzOiA1MCVcclxuICAgICAgYm94LXNoYWRvdzogLTJweCAycHggNnB4IHJnYmEoMCwgMCwgMCwgMC43KVxyXG4gICAgICB6LWluZGV4OiAxMFxyXG4gICAgICBjdXJzb3I6IHBvaW50ZXJcclxuICAgICAgYm9yZGVyOiAycHggc29saWQgd2hpdGVcclxuICAuaW1hZ2VcclxuICAgIG1heC13aWR0aDogMTAwJVxyXG4gICAgbWF4LWhlaWdodDogMTAwJVxyXG5cclxuPC9zdHlsZT5cclxuIiwiaW1wb3J0IGNyb3BwZXIgZnJvbSAnLi9jcm9wcGVyLnZ1ZSdcclxuXHJcbmNvbnN0IFZ1ZUNyb3BwYSA9IHtcclxuICBpbnN0YWxsOiBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XHJcbiAgICBWdWUuY29tcG9uZW50KCdjcm9wcGEnLCBjcm9wcGVyKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVnVlQ3JvcHBhIl0sIm5hbWVzIjpbImV2dCIsImNyb3BwZXJWTSIsImNhbnZhcyIsInF1YWxpdHkiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsInRvdWNoZXMiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJNYXRoIiwiZmxvb3IiLCJPYmplY3QiLCJ2YWwiLCJTdHJpbmciLCJCb29sZWFuIiwiSU5JVF9FVkVOVCIsIkZJTEVfQ0hPT1NFX0VWRU5UIiwiRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCIsIk1PVkVfRVZFTlQiLCJaT09NX0VWRU5UIiwicmVuZGVyIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsImluaXQiLCJpbnN0YW5jZSIsIiRyZWZzIiwicmVhbFdpZHRoIiwicmVhbEhlaWdodCIsInN0eWxlIiwiY3R4IiwiZ2V0Q29udGV4dCIsInVuc2V0IiwiJGVtaXQiLCJmaWxlSW5wdXQiLCJmaWxlcyIsImFtb3VudCIsIm1vdmUiLCJ4IiwieSIsInpvb20iLCJpbWdEYXRhIiwic3RhcnRYIiwic3RhcnRZIiwiY2hvb3NlRmlsZSIsImdlbmVyYXRlRGF0YVVybCIsImdlbmVyYXRlQmxvYiIsImNsZWFyUmVjdCIsInBhaW50QmFja2dyb3VuZCIsInRleHRCYXNlbGluZSIsInRleHRBbGlnbiIsImRlZmF1bHRGb250U2l6ZSIsInBsYWNlaG9sZGVyIiwibGVuZ3RoIiwiZm9udFNpemUiLCJwbGFjZWhvbGRlckZvbnRTaXplIiwiZm9udCIsImZpbGxTdHlsZSIsInBsYWNlaG9sZGVyQ29sb3IiLCJmaWxsVGV4dCIsImltZyIsImRpc2FibGVDbGlja1RvQ2hvb3NlIiwiY2xpY2siLCJpbnB1dCIsImZpbGUiLCJmaWxlU2l6ZUlzVmFsaWQiLCJFcnJvciIsImZpbGVTaXplTGltaXQiLCJmciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJlIiwiZmlsZURhdGEiLCJ0YXJnZXQiLCJyZXN1bHQiLCJJbWFnZSIsInNyYyIsImltZ0NvbnRlbnRJbml0IiwicmVhZEFzRGF0YVVSTCIsInNpemUiLCJpbWdXaWR0aCIsIm5hdHVyYWxXaWR0aCIsImltZ0hlaWdodCIsIm5hdHVyYWxIZWlnaHQiLCJpbWdSYXRpbyIsImNhbnZhc1JhdGlvIiwicmF0aW8iLCJkcmF3IiwiZGlzYWJsZWQiLCJ3aGljaCIsImRyYWdnaW5nIiwiZG9jdW1lbnQiLCJjYW5jZWxFdmVudHMiLCJhZGRFdmVudExpc3RlbmVyIiwiaGFuZGxlUG9pbnRlckVuZCIsImxhc3RNb3ZpbmdDb29yZCIsImRpc2FibGVEcmFnVG9Nb3ZlIiwiY29vcmQiLCJ1IiwiZ2V0UG9pbnRlckNvb3JkcyIsImRpc2FibGVTY3JvbGxUb1pvb20iLCJ3aGVlbERlbHRhIiwiZGV0YWlsIiwicmV2ZXJzZVpvb21pbmdHZXN0dXJlIiwib2Zmc2V0IiwicHJldmVudFdoaXRlU3BhY2UiLCJwcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlIiwiem9vbUluIiwicG9zIiwic3BlZWQiLCJ6b29tU3BlZWQiLCJvZmZzZXRYIiwib2Zmc2V0WSIsIl94IiwiYmFja2dyb3VuZENvbG9yIiwiY2FudmFzQ29sb3IiLCJmaWxsUmVjdCIsImRyYXdJbWFnZSIsInR5cGUiLCJ0b0RhdGFVUkwiLCJjYWxsYmFjayIsIm1pbWVUeXBlIiwicXVhbGl0eUFyZ3VtZW50IiwidG9CbG9iIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImNvbXBvbmVudCIsImNyb3BwZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsUUFBZTtrQkFBQSw0QkFDSUEsR0FESixFQUNTQyxTQURULEVBQ29CO1FBQ3pCQyxNQUR5QixHQUNMRCxTQURLLENBQ3pCQyxNQUR5QjtRQUNqQkMsT0FEaUIsR0FDTEYsU0FESyxDQUNqQkUsT0FEaUI7O1FBRTNCQyxPQUFPRixPQUFPRyxxQkFBUCxFQUFYO1FBQ0lDLFVBQVVOLElBQUlPLE9BQUosR0FBY1AsSUFBSU8sT0FBSixDQUFZLENBQVosRUFBZUQsT0FBN0IsR0FBdUNOLElBQUlNLE9BQXpEO1FBQ0lFLFVBQVVSLElBQUlPLE9BQUosR0FBY1AsSUFBSU8sT0FBSixDQUFZLENBQVosRUFBZUMsT0FBN0IsR0FBdUNSLElBQUlRLE9BQXpEO1dBQ087U0FDRixDQUFDRixVQUFVRixLQUFLSyxJQUFoQixJQUF3Qk4sT0FEdEI7U0FFRixDQUFDSyxVQUFVSixLQUFLTSxHQUFoQixJQUF1QlA7S0FGNUI7O0NBTko7O0FDQUFRLE9BQU9DLFNBQVAsR0FBbUJELE9BQU9DLFNBQVAsSUFBb0IsVUFBVUMsS0FBVixFQUFpQjtTQUMvQyxPQUFPQSxLQUFQLEtBQWlCLFFBQWpCLElBQTZCQyxTQUFTRCxLQUFULENBQTdCLElBQWdERSxLQUFLQyxLQUFMLENBQVdILEtBQVgsTUFBc0JBLEtBQTdFO0NBREY7O0FBSUEsWUFBZTtTQUNOSSxNQURNO1NBRU47VUFDQ04sTUFERDthQUVJLEdBRko7ZUFHTSxtQkFBVU8sR0FBVixFQUFlO2FBQ2pCQSxNQUFNLENBQWI7O0dBTlM7VUFTTDtVQUNBUCxNQURBO2FBRUcsR0FGSDtlQUdLLG1CQUFVTyxHQUFWLEVBQWU7YUFDakJBLE1BQU0sQ0FBYjs7R0FiUztlQWdCQTtVQUNMQyxNQURLO2FBRUY7R0Fs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
