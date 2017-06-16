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
    default: 'Choose File'
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
      return Number.isInteger(val) && val > 0 && val <= 5;
    }
  },
  zoomSpeed: {
    default: 3,
    type: Number,
    validator: function validator(val) {
      return val > 0;
    }
  },
  inputAccept: {
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
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') + ' ' + (_vm.disabled ? 'croppa--disabled' : '') }, [_c('input', { ref: "fileInput", attrs: { "type": "file", "accept": _vm.inputAccept, "disabled": _vm.disabled, "hidden": "" }, on: { "change": _vm.handleInputChange } }), _c('canvas', { ref: "canvas", on: { "click": function click($event) {
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
        getImage: function getImage() {
          return _this.img;
        },
        getActuallImageSize: function getActuallImageSize() {
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
        generateDataUrl: this.generateDataUrl
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
      if (this.img) return;
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
      if (!this.fileSizeLimit) return true;

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
      if (this.disabled) return;
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
      if (this.disabled) return;
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
    generateDataUrl: function generateDataUrl() {
      if (!this.img) return '';
      return this.canvas.toDataURL();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi9zcmMvY3JvcHBlci52dWUiLCIuLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgZ2V0UG9pbnRlckNvb3JkcyhldnQsIGNyb3BwZXJWTSkge1xyXG4gICAgbGV0IHsgY2FudmFzLCBxdWFsaXR5IH0gPSBjcm9wcGVyVk1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WCA6IGV2dC5jbGllbnRYXHJcbiAgICBsZXQgY2xpZW50WSA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WSA6IGV2dC5jbGllbnRZXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiAoY2xpZW50WCAtIHJlY3QubGVmdCkgKiBxdWFsaXR5LFxyXG4gICAgICB5OiAoY2xpZW50WSAtIHJlY3QudG9wKSAqIHF1YWxpdHlcclxuICAgIH1cclxuICB9XHJcbn0iLCJOdW1iZXIuaXNJbnRlZ2VyID0gTnVtYmVyLmlzSW50ZWdlciB8fCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB2YWx1ZTogT2JqZWN0LFxyXG4gIHdpZHRoOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGhlaWdodDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMjAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBwbGFjZWhvbGRlcjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ0Nob29zZSBGaWxlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjZTZlNmU2J1xyXG4gIH0sXHJcbiAgcXVhbGl0eToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWwpICYmIHZhbCA+IDAgJiYgdmFsIDw9IDVcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaW5wdXRBY2NlcHQ6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdpbWFnZS8qJ1xyXG4gIH0sXHJcbiAgZmlsZVNpemVMaW1pdDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gIHJldmVyc2Vab29taW5nR2VzdHVyZTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9XHJcbn0iLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiA6Y2xhc3M9XCJgY3JvcHBhLWNvbnRhaW5lciAke2ltZyA/ICdjcm9wcGEtLWhhcy10YXJnZXQnIDogJyd9ICR7ZGlzYWJsZWQgPyAnY3JvcHBhLS1kaXNhYmxlZCcgOiAnJ31gXCI+XHJcbiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIlxyXG4gICAgICAgICAgIDphY2NlcHQ9XCJpbnB1dEFjY2VwdFwiXHJcbiAgICAgICAgICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxyXG4gICAgICAgICAgIHJlZj1cImZpbGVJbnB1dFwiXHJcbiAgICAgICAgICAgaGlkZGVuXHJcbiAgICAgICAgICAgQGNoYW5nZT1cImhhbmRsZUlucHV0Q2hhbmdlXCIgLz5cclxuICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCJcclxuICAgICAgICAgICAgQGNsaWNrPVwiIWRpc2FibGVkICYmIGNob29zZUZpbGUoKVwiXHJcbiAgICAgICAgICAgIEB0b3VjaHN0YXJ0LnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEBtb3VzZWRvd24uc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHBvaW50ZXJzdGFydC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEB0b3VjaGNhbmNlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQG1vdXNldXAuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcmNhbmNlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNobW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBtb3VzZW1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBARE9NTW91c2VTY3JvbGwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAbW91c2V3aGVlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVXaGVlbFwiPjwvY2FudmFzPlxyXG4gICAgPHN2ZyBjbGFzcz1cImljb24gaWNvbi1yZW1vdmVcIlxyXG4gICAgICAgICB2LWlmPVwic2hvd1JlbW92ZUJ1dHRvbiAmJiBpbWdcIlxyXG4gICAgICAgICBAY2xpY2s9XCJ1bnNldFwiXHJcbiAgICAgICAgIDpzdHlsZT1cImB0b3A6IC0ke2hlaWdodC80MH1weDsgcmlnaHQ6IC0ke3dpZHRoLzQwfXB4YFwiXHJcbiAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcclxuICAgICAgICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxyXG4gICAgICAgICA6d2lkdGg9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCJcclxuICAgICAgICAgOmhlaWdodD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIj5cclxuICAgICAgPHBhdGggZD1cIk01MTEuOTIxMjMxIDBDMjI5LjE3OTA3NyAwIDAgMjI5LjI1Nzg0NiAwIDUxMiAwIDc5NC43MDI3NjkgMjI5LjE3OTA3NyAxMDI0IDUxMS45MjEyMzEgMTAyNCA3OTQuNzgxNTM4IDEwMjQgMTAyNCA3OTQuNzAyNzY5IDEwMjQgNTEyIDEwMjQgMjI5LjI1Nzg0NiA3OTQuNzgxNTM4IDAgNTExLjkyMTIzMSAwWk03MzIuMDQxODQ2IDY1MC42MzM4NDYgNjUwLjUxNTY5MiA3MzIuMDgxMjMxQzY1MC41MTU2OTIgNzMyLjA4MTIzMSA1MjEuNDkxNjkyIDU5My42ODM2OTIgNTExLjg4MTg0NiA1OTMuNjgzNjkyIDUwMi40Mjk1MzggNTkzLjY4MzY5MiAzNzMuMzY2MTU0IDczMi4wODEyMzEgMzczLjM2NjE1NCA3MzIuMDgxMjMxTDI5MS43NjEyMzEgNjUwLjYzMzg0NkMyOTEuNzYxMjMxIDY1MC42MzM4NDYgNDMwLjMxNjMwOCA1MjMuNTAwMzA4IDQzMC4zMTYzMDggNTEyLjE5NjkyMyA0MzAuMzE2MzA4IDUwMC42OTY2MTUgMjkxLjc2MTIzMSAzNzMuNTIzNjkyIDI5MS43NjEyMzEgMzczLjUyMzY5MkwzNzMuMzY2MTU0IDI5MS45MTg3NjlDMzczLjM2NjE1NCAyOTEuOTE4NzY5IDUwMy40NTM1MzggNDMwLjM5NTA3NyA1MTEuODgxODQ2IDQzMC4zOTUwNzcgNTIwLjM0OTUzOCA0MzAuMzk1MDc3IDY1MC41MTU2OTIgMjkxLjkxODc2OSA2NTAuNTE1NjkyIDI5MS45MTg3NjlMNzMyLjA0MTg0NiAzNzMuNTIzNjkyQzczMi4wNDE4NDYgMzczLjUyMzY5MiA1OTMuNDQ3Mzg1IDUwMi41NDc2OTIgNTkzLjQ0NzM4NSA1MTIuMTk2OTIzIDU5My40NDczODUgNTIxLjQxMjkyMyA3MzIuMDQxODQ2IDY1MC42MzM4NDYgNzMyLjA0MTg0NiA2NTAuNjMzODQ2WlwiXHJcbiAgICAgICAgICAgIDpmaWxsPVwicmVtb3ZlQnV0dG9uQ29sb3JcIj48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xyXG4gIGltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xyXG5cclxuICBjb25zdCBJTklUX0VWRU5UID0gJ2luaXQnXHJcbiAgY29uc3QgRklMRV9DSE9PU0VfRVZFTlQgPSAnZmlsZS1jaG9vc2UnXHJcbiAgY29uc3QgRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCA9ICdmaWxlLXNpemUtZXhjZWVkJ1xyXG4gIGNvbnN0IE1PVkVfRVZFTlQgPSAnbW92ZSdcclxuICBjb25zdCBaT09NX0VWRU5UID0gJ3pvb20nXHJcblxyXG4gIGV4cG9ydCBkZWZhdWx0IHtcclxuICAgIG1vZGVsOiB7XHJcbiAgICAgIHByb3A6ICd2YWx1ZScsXHJcbiAgICAgIGV2ZW50OiAnaW5pdCdcclxuICAgIH0sXHJcblxyXG4gICAgcHJvcHM6IHByb3BzLFxyXG5cclxuICAgIGRhdGEgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGluc3RhbmNlOiBudWxsLFxyXG4gICAgICAgIGNhbnZhczogbnVsbCxcclxuICAgICAgICBjdHg6IG51bGwsXHJcbiAgICAgICAgaW1nOiBudWxsLFxyXG4gICAgICAgIGRyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgICBsYXN0TW92aW5nQ29vcmQ6IG51bGwsXHJcbiAgICAgICAgaW1nRGF0YToge30sXHJcbiAgICAgICAgZGF0YVVybDogJydcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICByZWFsV2lkdGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWFsSGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQgKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtb3VudGVkICgpIHtcclxuICAgICAgdGhpcy5pbml0KClcclxuICAgIH0sXHJcblxyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlID0gdmFsXHJcbiAgICAgIH0sXHJcbiAgICAgIHJlYWxXaWR0aDogJ2luaXQnLFxyXG4gICAgICByZWFsSGVpZ2h0OiAnaW5pdCcsXHJcbiAgICAgIGNhbnZhc0NvbG9yOiAnaW5pdCcsXHJcbiAgICAgIHBsYWNlaG9sZGVyOiAnaW5pdCcsXHJcbiAgICAgIHBsYWNlaG9sZGVyQ29sb3I6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXJGb250U2l6ZTogJ2luaXQnLFxyXG4gICAgICBwcmV2ZW50V2hpdGVTcGFjZTogJ2ltZ0NvbnRlbnRJbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgIGluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kcmVmcy5jYW52YXNcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIHRoaXMudW5zZXQoKVxyXG4gICAgICAgIHRoaXMuJGVtaXQoSU5JVF9FVkVOVCwge1xyXG4gICAgICAgICAgZ2V0Q2FudmFzOiAoKSA9PiB0aGlzLmNhbnZhcyxcclxuICAgICAgICAgIGdldENvbnRleHQ6ICgpID0+IHRoaXMuY3R4LFxyXG4gICAgICAgICAgZ2V0Q2hvc2VuRmlsZTogKCkgPT4gdGhpcy4kcmVmcy5maWxlSW5wdXQuZmlsZXNbMF0sXHJcbiAgICAgICAgICBnZXRJbWFnZTogKCkgPT4gdGhpcy5pbWcsXHJcbiAgICAgICAgICBnZXRBY3R1YWxsSW1hZ2VTaXplOiAoKSA9PiAoe1xyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5yZWFsV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIG1vdmVVcHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlRG93bndhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IGFtb3VudCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVMZWZ0d2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVSaWdodHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21JbjogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnpvb20odHJ1ZSwge1xyXG4gICAgICAgICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxyXG4gICAgICAgICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21PdXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVzZXQ6IHRoaXMudW5zZXQsXHJcbiAgICAgICAgICBjaG9vc2VGaWxlOiB0aGlzLmNob29zZUZpbGUsXHJcbiAgICAgICAgICBnZW5lcmF0ZURhdGFVcmw6IHRoaXMuZ2VuZXJhdGVEYXRhVXJsXHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHVuc2V0ICgpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucmVhbFdpZHRoLCB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgICAgdGhpcy5wYWludEJhY2tncm91bmQoKVxyXG4gICAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJ1xyXG4gICAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJ1xyXG4gICAgICAgIGxldCBkZWZhdWx0Rm9udFNpemUgPSB0aGlzLnJlYWxXaWR0aCAvIDEuNSAvIHRoaXMucGxhY2Vob2xkZXIubGVuZ3RoXHJcbiAgICAgICAgbGV0IGZvbnRTaXplID0gKCF0aGlzLnBsYWNlaG9sZGVyRm9udFNpemUgfHwgdGhpcy5wbGFjZWhvbGRlckZvbnRTaXplID09IDApID8gZGVmYXVsdEZvbnRTaXplIDogdGhpcy5wbGFjZWhvbGRlckZvbnRTaXplXHJcbiAgICAgICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCBzYW5zLXNlcmlmJ1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAoIXRoaXMucGxhY2Vob2xkZXJDb2xvciB8fCB0aGlzLnBsYWNlaG9sZGVyQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjNjA2MDYwJyA6IHRoaXMucGxhY2Vob2xkZXJDb2xvclxyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0aGlzLnBsYWNlaG9sZGVyLCB0aGlzLnJlYWxXaWR0aCAvIDIsIHRoaXMucmVhbEhlaWdodCAvIDIpXHJcbiAgICAgICAgdGhpcy5pbWcgPSBudWxsXHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQudmFsdWUgPSAnJ1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YSA9IHt9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjaG9vc2VGaWxlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LmNsaWNrKClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZUlucHV0Q2hhbmdlICgpIHtcclxuICAgICAgICBsZXQgaW5wdXQgPSB0aGlzLiRyZWZzLmZpbGVJbnB1dFxyXG4gICAgICAgIGlmICghaW5wdXQuZmlsZXMubGVuZ3RoKSByZXR1cm5cclxuXHJcbiAgICAgICAgbGV0IGZpbGUgPSBpbnB1dC5maWxlc1swXVxyXG4gICAgICAgIHRoaXMuJGVtaXQoRklMRV9DSE9PU0VfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVTaXplSXNWYWxpZChmaWxlKSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChGSUxFX1NJWkVfRVhDRUVEX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaWxlIHNpemUgZXhjZWVkcyBsaW1pdCB3aGljaCBpcyAnICsgdGhpcy5maWxlU2l6ZUxpbWl0ICsgJyBieXRlcy4nKVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZnIgPSBuZXcgRmlsZVJlYWRlcigpXHJcbiAgICAgICAgZnIub25sb2FkID0gKGUpID0+IHtcclxuICAgICAgICAgIGxldCBmaWxlRGF0YSA9IGUudGFyZ2V0LnJlc3VsdFxyXG4gICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICBpbWcuc3JjID0gZmlsZURhdGFcclxuICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1nID0gaW1nXHJcbiAgICAgICAgICAgIHRoaXMuaW1nQ29udGVudEluaXQoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmci5yZWFkQXNEYXRhVVJMKGZpbGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmaWxlU2l6ZUlzVmFsaWQgKGZpbGUpIHtcclxuICAgICAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUxpbWl0KSByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICAgICByZXR1cm4gZmlsZS5zaXplIDwgdGhpcy5maWxlU2l6ZUxpbWl0XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBpbWdDb250ZW50SW5pdCAoKSB7XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMuaW1nLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLmltZy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgICAgbGV0IGltZ1JhdGlvID0gaW1nSGVpZ2h0IC8gaW1nV2lkdGhcclxuICAgICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLnJlYWxXaWR0aFxyXG5cclxuICAgICAgICAvLyBkaXNwbGF5IGFzIGZpdFxyXG4gICAgICAgIGlmIChpbWdSYXRpbyA8IGNhbnZhc1JhdGlvKSB7XHJcbiAgICAgICAgICBsZXQgcmF0aW8gPSBpbWdIZWlnaHQgLyB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gcmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHJhdGlvID0gaW1nV2lkdGggLyB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlclN0YXJ0IChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKGV2dC53aGljaCAmJiBldnQud2hpY2ggPiAxKSByZXR1cm5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxyXG5cclxuICAgICAgICBpZiAoZG9jdW1lbnQpIHtcclxuICAgICAgICAgIGxldCBjYW5jZWxFdmVudHMgPSBbJ21vdXNldXAnLCAndG91Y2hlbmQnLCAndG91Y2hjYW5jZWwnLCAncG9pbnRlcmVuZCcsICdwb2ludGVyY2FuY2VsJ11cclxuICAgICAgICAgIGZvciAobGV0IGUgb2YgY2FuY2VsRXZlbnRzKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZSwgdGhpcy5oYW5kbGVQb2ludGVyRW5kKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJFbmQgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IG51bGxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cclxuICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIGlmICh0aGlzLmxhc3RNb3ZpbmdDb29yZCkge1xyXG4gICAgICAgICAgdGhpcy5tb3ZlKHtcclxuICAgICAgICAgICAgeDogY29vcmQueCAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLngsXHJcbiAgICAgICAgICAgIHk6IGNvb3JkLnkgLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC55XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVXaGVlbCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgaWYgKGV2dC53aGVlbERlbHRhIDwgMCB8fCBldnQuZGV0YWlsIDwgMCkge1xyXG4gICAgICAgICAgLy8g5omL5oyH5ZCR5LiKXHJcbiAgICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlWm9vbWluZ0dlc3R1cmUsIGNvb3JkKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LndoZWVsRGVsdGEgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XHJcbiAgICAgICAgICAvLyDmiYvmjIflkJHkuItcclxuICAgICAgICAgIHRoaXMuem9vbSghdGhpcy5yZXZlcnNlWm9vbWluZ0dlc3R1cmUsIGNvb3JkKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1vdmUgKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghb2Zmc2V0KSByZXR1cm5cclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYICs9IG9mZnNldC54XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSArPSBvZmZzZXQueVxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLnByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRlbWl0KE1PVkVfRVZFTlQpXHJcbiAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFkgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWFsV2lkdGggLSB0aGlzLmltZ0RhdGEuc3RhcnRYID4gdGhpcy5pbWdEYXRhLndpZHRoKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVhbEhlaWdodCAtIHRoaXMuaW1nRGF0YS5zdGFydFkgPiB0aGlzLmltZ0RhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHpvb20gKHpvb21JbiwgcG9zKSB7XHJcbiAgICAgICAgbGV0IHNwZWVkID0gKHRoaXMucmVhbFdpZHRoIC8gMTAwMDAwKSAqIHRoaXMuem9vbVNwZWVkXHJcbiAgICAgICAgbGV0IHggPSAxXHJcbiAgICAgICAgaWYgKHpvb21Jbikge1xyXG4gICAgICAgICAgeCA9IDEgKyBzcGVlZFxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbWdEYXRhLndpZHRoID4gMjApIHtcclxuICAgICAgICAgIHggPSAxIC0gc3BlZWRcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogeFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogeFxyXG4gICAgICAgIGxldCBvZmZzZXRYID0gKHggLSAxKSAqIChwb3MueCAtIHRoaXMuaW1nRGF0YS5zdGFydFgpXHJcbiAgICAgICAgbGV0IG9mZnNldFkgPSAoeCAtIDEpICogKHBvcy55IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSlcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gdGhpcy5pbWdEYXRhLnN0YXJ0WCAtIG9mZnNldFhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WSAtIG9mZnNldFlcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPCB0aGlzLnJlYWxXaWR0aCkge1xyXG4gICAgICAgICAgICBsZXQgX3ggPSB0aGlzLnJlYWxXaWR0aCAvIHRoaXMuaW1nRGF0YS53aWR0aFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5pbWdEYXRhLmhlaWdodCAqIF94XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5oZWlnaHQgPCB0aGlzLnJlYWxIZWlnaHQpIHtcclxuICAgICAgICAgICAgbGV0IF94ID0gdGhpcy5yZWFsSGVpZ2h0IC8gdGhpcy5pbWdEYXRhLmhlaWdodFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMuaW1nRGF0YS53aWR0aCAqIF94XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRlbWl0KFpPT01fRVZFTlQpXHJcbiAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHBhaW50QmFja2dyb3VuZCAoKSB7XHJcbiAgICAgICAgbGV0IGJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAnI2U2ZTZlNicgOiB0aGlzLmNhbnZhc0NvbG9yXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGRyYXcgKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmltZ0RhdGFcclxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucmVhbFdpZHRoLCB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgICAgdGhpcy5wYWludEJhY2tncm91bmQoKVxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2VuZXJhdGVEYXRhVXJsICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4gJydcclxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXMudG9EYXRhVVJMKClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGUgbGFuZz1cInN0eWx1c1wiPlxyXG4gIC5jcm9wcGEtY29udGFpbmVyIFxyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrXHJcbiAgICBjdXJzb3I6IHBvaW50ZXJcclxuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgLjNzXHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmVcclxuICAgICY6aG92ZXJcclxuICAgICAgb3BhY2l0eTogLjdcclxuICAgICYuY3JvcHBhLS1oYXMtdGFyZ2V0XHJcbiAgICAgIGN1cnNvcjogbW92ZVxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkXHJcbiAgICAgIGN1cnNvcjogbm90LWFsbG93ZWRcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgIHN2Zy5pY29uLXJlbW92ZVxyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGVcclxuICAgICAgYmFja2dyb3VuZDogd2hpdGVcclxuICAgICAgYm9yZGVyLXJhZGl1czogNTAlXHJcbiAgICAgIGJveC1zaGFkb3c6IC0ycHggMnB4IDZweCByZ2JhKDAsIDAsIDAsIDAuNylcclxuICAgICAgei1pbmRleDogMTBcclxuICAgICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHdoaXRlXHJcbiAgLmltYWdlXHJcbiAgICBtYXgtd2lkdGg6IDEwMCVcclxuICAgIG1heC1oZWlnaHQ6IDEwMCVcclxuXHJcbjwvc3R5bGU+XHJcbiIsImltcG9ydCBjcm9wcGVyIGZyb20gJy4vY3JvcHBlci52dWUnXHJcblxyXG5jb25zdCBWdWVDcm9wcGEgPSB7XHJcbiAgaW5zdGFsbDogZnVuY3Rpb24gKFZ1ZSwgb3B0aW9ucykge1xyXG4gICAgVnVlLmNvbXBvbmVudCgnY3JvcHBhJywgY3JvcHBlcilcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZUNyb3BwYSJdLCJuYW1lcyI6WyJldnQiLCJjcm9wcGVyVk0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJ0b3VjaGVzIiwiY2xpZW50WSIsImxlZnQiLCJ0b3AiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJ2YWx1ZSIsImlzRmluaXRlIiwiTWF0aCIsImZsb29yIiwiT2JqZWN0IiwidmFsIiwiU3RyaW5nIiwiQm9vbGVhbiIsIklOSVRfRVZFTlQiLCJGSUxFX0NIT09TRV9FVkVOVCIsIkZJTEVfU0laRV9FWENFRURfRVZFTlQiLCJNT1ZFX0VWRU5UIiwiWk9PTV9FVkVOVCIsInJlbmRlciIsInByb3BzIiwid2lkdGgiLCJoZWlnaHQiLCJpbml0IiwiaW5zdGFuY2UiLCIkcmVmcyIsInJlYWxXaWR0aCIsInJlYWxIZWlnaHQiLCJzdHlsZSIsImN0eCIsImdldENvbnRleHQiLCJ1bnNldCIsIiRlbWl0IiwiZmlsZUlucHV0IiwiZmlsZXMiLCJpbWciLCJhbW91bnQiLCJtb3ZlIiwieCIsInkiLCJ6b29tIiwiaW1nRGF0YSIsInN0YXJ0WCIsInN0YXJ0WSIsImNob29zZUZpbGUiLCJnZW5lcmF0ZURhdGFVcmwiLCJjbGVhclJlY3QiLCJwYWludEJhY2tncm91bmQiLCJ0ZXh0QmFzZWxpbmUiLCJ0ZXh0QWxpZ24iLCJkZWZhdWx0Rm9udFNpemUiLCJwbGFjZWhvbGRlciIsImxlbmd0aCIsImZvbnRTaXplIiwicGxhY2Vob2xkZXJGb250U2l6ZSIsImZvbnQiLCJmaWxsU3R5bGUiLCJwbGFjZWhvbGRlckNvbG9yIiwiZmlsbFRleHQiLCJjbGljayIsImlucHV0IiwiZmlsZSIsImZpbGVTaXplSXNWYWxpZCIsIkVycm9yIiwiZmlsZVNpemVMaW1pdCIsImZyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImUiLCJmaWxlRGF0YSIsInRhcmdldCIsInJlc3VsdCIsIkltYWdlIiwic3JjIiwiaW1nQ29udGVudEluaXQiLCJyZWFkQXNEYXRhVVJMIiwic2l6ZSIsImltZ1dpZHRoIiwibmF0dXJhbFdpZHRoIiwiaW1nSGVpZ2h0IiwibmF0dXJhbEhlaWdodCIsImltZ1JhdGlvIiwiY2FudmFzUmF0aW8iLCJyYXRpbyIsImRyYXciLCJkaXNhYmxlZCIsIndoaWNoIiwiZHJhZ2dpbmciLCJkb2N1bWVudCIsImNhbmNlbEV2ZW50cyIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYW5kbGVQb2ludGVyRW5kIiwibGFzdE1vdmluZ0Nvb3JkIiwiY29vcmQiLCJ1IiwiZ2V0UG9pbnRlckNvb3JkcyIsIndoZWVsRGVsdGEiLCJkZXRhaWwiLCJyZXZlcnNlWm9vbWluZ0dlc3R1cmUiLCJvZmZzZXQiLCJwcmV2ZW50V2hpdGVTcGFjZSIsInByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UiLCJ6b29tSW4iLCJwb3MiLCJzcGVlZCIsInpvb21TcGVlZCIsIm9mZnNldFgiLCJvZmZzZXRZIiwiX3giLCJiYWNrZ3JvdW5kQ29sb3IiLCJjYW52YXNDb2xvciIsImZpbGxSZWN0IiwiZHJhd0ltYWdlIiwidG9EYXRhVVJMIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImNvbXBvbmVudCIsImNyb3BwZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLFFBQWU7a0JBQUEsNEJBQ0lBLEdBREosRUFDU0MsU0FEVCxFQUNvQjtRQUN6QkMsTUFEeUIsR0FDTEQsU0FESyxDQUN6QkMsTUFEeUI7UUFDakJDLE9BRGlCLEdBQ0xGLFNBREssQ0FDakJFLE9BRGlCOztRQUUzQkMsT0FBT0YsT0FBT0cscUJBQVAsRUFBWDtRQUNJQyxVQUFVTixJQUFJTyxPQUFKLEdBQWNQLElBQUlPLE9BQUosQ0FBWSxDQUFaLEVBQWVELE9BQTdCLEdBQXVDTixJQUFJTSxPQUF6RDtRQUNJRSxVQUFVUixJQUFJTyxPQUFKLEdBQWNQLElBQUlPLE9BQUosQ0FBWSxDQUFaLEVBQWVDLE9BQTdCLEdBQXVDUixJQUFJUSxPQUF6RDtXQUNPO1NBQ0YsQ0FBQ0YsVUFBVUYsS0FBS0ssSUFBaEIsSUFBd0JOLE9BRHRCO1NBRUYsQ0FBQ0ssVUFBVUosS0FBS00sR0FBaEIsSUFBdUJQO0tBRjVCOztDQU5KOztBQ0FBUSxPQUFPQyxTQUFQLEdBQW1CRCxPQUFPQyxTQUFQLElBQW9CLFVBQVVDLEtBQVYsRUFBaUI7U0FDL0MsT0FBT0EsS0FBUCxLQUFpQixRQUFqQixJQUE2QkMsU0FBU0QsS0FBVCxDQUE3QixJQUFnREUsS0FBS0MsS0FBTCxDQUFXSCxLQUFYLE1BQXNCQSxLQUE3RTtDQURGOztBQUlBLFlBQWU7U0FDTkksTUFETTtTQUVOO1VBQ0NOLE1BREQ7YUFFSSxHQUZKO2VBR00sbUJBQVVPLEdBQVYsRUFBZTthQUNqQkEsTUFBTSxDQUFiOztHQU5TO1VBU0w7VUFDQVAs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
