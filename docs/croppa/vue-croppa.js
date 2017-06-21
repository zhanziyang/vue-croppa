/*
 * vue-croppa v0.0.18
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
      fileDraggedOver: false
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
      if (this.disabled || !this.img) return;
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
      if (this.disabled || !this.img) return;
      this.dragging = false;
      this.lastMovingCoord = null;
    },
    handlePointerMove: function handlePointerMove(evt) {
      if (this.disabled || this.disableDragToMove || !this.img) return;
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
      if (this.disabled || this.disableScrollToZoom || !this.img) return;
      var coord = u.getPointerCoords(evt, this);
      if (evt.wheelDelta < 0 || evt.detail < 0) {
        // 手指向上
        this.zoom(this.reverseZoomingGesture, coord);
      } else if (evt.wheelDelta > 0 || evt.detail > 0) {
        // 手指向下
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi9zcmMvY3JvcHBlci52dWUiLCIuLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgZ2V0UG9pbnRlckNvb3JkcyhldnQsIGNyb3BwZXJWTSkge1xyXG4gICAgbGV0IHsgY2FudmFzLCBxdWFsaXR5IH0gPSBjcm9wcGVyVk1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WCA6IGV2dC5jbGllbnRYXHJcbiAgICBsZXQgY2xpZW50WSA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WSA6IGV2dC5jbGllbnRZXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiAoY2xpZW50WCAtIHJlY3QubGVmdCkgKiBxdWFsaXR5LFxyXG4gICAgICB5OiAoY2xpZW50WSAtIHJlY3QudG9wKSAqIHF1YWxpdHlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZChpbWcpIHtcclxuICAgIHJldHVybiBpbWcuY29tcGxldGUgJiYgaW1nLm5hdHVyYWxXaWR0aCAhPT0gMFxyXG4gIH1cclxufSIsIk51bWJlci5pc0ludGVnZXIgPSBOdW1iZXIuaXNJbnRlZ2VyIHx8IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWVcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjZTZlNmU2J1xyXG4gIH0sXHJcbiAgcXVhbGl0eToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWwpICYmIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnaW1hZ2UvKidcclxuICB9LFxyXG4gIGZpbGVTaXplTGltaXQ6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+PSAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBkaXNhYmxlZDogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ0FuZERyb3A6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZUNsaWNrVG9DaG9vc2U6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZURyYWdUb01vdmU6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICByZXZlcnNlWm9vbWluZ0dlc3R1cmU6IEJvb2xlYW4sXHJcbiAgcHJldmVudFdoaXRlU3BhY2U6IEJvb2xlYW4sXHJcbiAgc2hvd1JlbW92ZUJ1dHRvbjoge1xyXG4gICAgdHlwZTogQm9vbGVhbixcclxuICAgIGRlZmF1bHQ6IHRydWVcclxuICB9LFxyXG4gIHJlbW92ZUJ1dHRvbkNvbG9yOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAncmVkJ1xyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uU2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyXHJcbiAgfVxyXG59IiwiPHRlbXBsYXRlPlxyXG4gIDxkaXYgOmNsYXNzPVwiYGNyb3BwYS1jb250YWluZXIgJHtpbWcgPyAnY3JvcHBhLS1oYXMtdGFyZ2V0JyA6ICcnfSAke2Rpc2FibGVkID8gJ2Nyb3BwYS0tZGlzYWJsZWQnIDogJyd9ICR7ZGlzYWJsZUNsaWNrVG9DaG9vc2UgPyAnY3JvcHBhLS1kaXNhYmxlZC1jYycgOiAnJ30gJHtkaXNhYmxlRHJhZ1RvTW92ZSAmJiBkaXNhYmxlU2Nyb2xsVG9ab29tID8gJ2Nyb3BwYS0tZGlzYWJsZWQtbXonIDogJyd9ICR7ZmlsZURyYWdnZWRPdmVyID8gJ2Nyb3BwYS0tZHJvcHpvbmUnIDogJyd9YFwiXHJcbiAgICAgICBAZHJhZ2VudGVyLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdFbnRlclwiXHJcbiAgICAgICBAZHJhZ2xlYXZlLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdMZWF2ZVwiXHJcbiAgICAgICBAZHJhZ292ZXIuc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJhZ092ZXJcIlxyXG4gICAgICAgQGRyb3Auc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJvcFwiPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCJcclxuICAgICAgICAgICA6YWNjZXB0PVwiYWNjZXB0XCJcclxuICAgICAgICAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXHJcbiAgICAgICAgICAgcmVmPVwiZmlsZUlucHV0XCJcclxuICAgICAgICAgICBoaWRkZW5cclxuICAgICAgICAgICBAY2hhbmdlPVwiaGFuZGxlSW5wdXRDaGFuZ2VcIiAvPlxyXG4gICAgPGRpdiBjbGFzcz1cImluaXRpYWxcIlxyXG4gICAgICAgICBzdHlsZT1cIndpZHRoOiAwOyBoZWlnaHQ6IDA7IHZpc2liaWxpdHk6IGhpZGRlbjtcIj5cclxuICAgICAgPHNsb3QgbmFtZT1cImluaXRpYWxcIj48L3Nsb3Q+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCJcclxuICAgICAgICAgICAgQGNsaWNrPVwiIWRpc2FibGVkICYmIGNob29zZUZpbGUoKVwiXHJcbiAgICAgICAgICAgIEB0b3VjaHN0YXJ0LnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEBtb3VzZWRvd24uc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHBvaW50ZXJzdGFydC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEB0b3VjaGNhbmNlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQG1vdXNldXAuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcmNhbmNlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNobW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBtb3VzZW1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBARE9NTW91c2VTY3JvbGwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAbW91c2V3aGVlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVXaGVlbFwiPjwvY2FudmFzPlxyXG4gICAgPHN2ZyBjbGFzcz1cImljb24gaWNvbi1yZW1vdmVcIlxyXG4gICAgICAgICB2LWlmPVwic2hvd1JlbW92ZUJ1dHRvbiAmJiBpbWdcIlxyXG4gICAgICAgICBAY2xpY2s9XCJ1bnNldFwiXHJcbiAgICAgICAgIDpzdHlsZT1cImB0b3A6IC0ke2hlaWdodC80MH1weDsgcmlnaHQ6IC0ke3dpZHRoLzQwfXB4YFwiXHJcbiAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcclxuICAgICAgICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxyXG4gICAgICAgICA6d2lkdGg9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCJcclxuICAgICAgICAgOmhlaWdodD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIj5cclxuICAgICAgPHBhdGggZD1cIk01MTEuOTIxMjMxIDBDMjI5LjE3OTA3NyAwIDAgMjI5LjI1Nzg0NiAwIDUxMiAwIDc5NC43MDI3NjkgMjI5LjE3OTA3NyAxMDI0IDUxMS45MjEyMzEgMTAyNCA3OTQuNzgxNTM4IDEwMjQgMTAyNCA3OTQuNzAyNzY5IDEwMjQgNTEyIDEwMjQgMjI5LjI1Nzg0NiA3OTQuNzgxNTM4IDAgNTExLjkyMTIzMSAwWk03MzIuMDQxODQ2IDY1MC42MzM4NDYgNjUwLjUxNTY5MiA3MzIuMDgxMjMxQzY1MC41MTU2OTIgNzMyLjA4MTIzMSA1MjEuNDkxNjkyIDU5My42ODM2OTIgNTExLjg4MTg0NiA1OTMuNjgzNjkyIDUwMi40Mjk1MzggNTkzLjY4MzY5MiAzNzMuMzY2MTU0IDczMi4wODEyMzEgMzczLjM2NjE1NCA3MzIuMDgxMjMxTDI5MS43NjEyMzEgNjUwLjYzMzg0NkMyOTEuNzYxMjMxIDY1MC42MzM4NDYgNDMwLjMxNjMwOCA1MjMuNTAwMzA4IDQzMC4zMTYzMDggNTEyLjE5NjkyMyA0MzAuMzE2MzA4IDUwMC42OTY2MTUgMjkxLjc2MTIzMSAzNzMuNTIzNjkyIDI5MS43NjEyMzEgMzczLjUyMzY5MkwzNzMuMzY2MTU0IDI5MS45MTg3NjlDMzczLjM2NjE1NCAyOTEuOTE4NzY5IDUwMy40NTM1MzggNDMwLjM5NTA3NyA1MTEuODgxODQ2IDQzMC4zOTUwNzcgNTIwLjM0OTUzOCA0MzAuMzk1MDc3IDY1MC41MTU2OTIgMjkxLjkxODc2OSA2NTAuNTE1NjkyIDI5MS45MTg3NjlMNzMyLjA0MTg0NiAzNzMuNTIzNjkyQzczMi4wNDE4NDYgMzczLjUyMzY5MiA1OTMuNDQ3Mzg1IDUwMi41NDc2OTIgNTkzLjQ0NzM4NSA1MTIuMTk2OTIzIDU5My40NDczODUgNTIxLjQxMjkyMyA3MzIuMDQxODQ2IDY1MC42MzM4NDYgNzMyLjA0MTg0NiA2NTAuNjMzODQ2WlwiXHJcbiAgICAgICAgICAgIDpmaWxsPVwicmVtb3ZlQnV0dG9uQ29sb3JcIj48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xyXG4gIGltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xyXG5cclxuICBjb25zdCBJTklUX0VWRU5UID0gJ2luaXQnXHJcbiAgY29uc3QgRklMRV9DSE9PU0VfRVZFTlQgPSAnZmlsZS1jaG9vc2UnXHJcbiAgY29uc3QgRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCA9ICdmaWxlLXNpemUtZXhjZWVkJ1xyXG4gIGNvbnN0IElNQUdFX1JFTU9WRSA9ICdpbWFnZS1yZW1vdmUnXHJcbiAgY29uc3QgTU9WRV9FVkVOVCA9ICdtb3ZlJ1xyXG4gIGNvbnN0IFpPT01fRVZFTlQgPSAnem9vbSdcclxuICBjb25zdCBJTklUSUFMX0lNQUdFX0xPQUQgPSAnaW5pdGlhbC1pbWFnZS1sb2FkJ1xyXG4gIGNvbnN0IElOSVRJQUxfSU1BR0VfRVJST1IgPSAnaW5pdGlhbC1pbWFnZS1lcnJvcidcclxuXHJcbiAgZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgbW9kZWw6IHtcclxuICAgICAgcHJvcDogJ3ZhbHVlJyxcclxuICAgICAgZXZlbnQ6ICdpbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBwcm9wczogcHJvcHMsXHJcblxyXG4gICAgZGF0YSAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXHJcbiAgICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICAgIGN0eDogbnVsbCxcclxuICAgICAgICBpbWc6IG51bGwsXHJcbiAgICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICAgIGxhc3RNb3ZpbmdDb29yZDogbnVsbCxcclxuICAgICAgICBpbWdEYXRhOiB7fSxcclxuICAgICAgICBkYXRhVXJsOiAnJyxcclxuICAgICAgICBmaWxlRHJhZ2dlZE92ZXI6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgcmVhbFdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVhbEhlaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0ICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJGb250U2l6ZSAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdW50ZWQgKCkge1xyXG4gICAgICB0aGlzLmluaXQoKVxyXG4gICAgfSxcclxuXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSB2YWxcclxuICAgICAgfSxcclxuICAgICAgcmVhbFdpZHRoOiAnaW5pdCcsXHJcbiAgICAgIHJlYWxIZWlnaHQ6ICdpbml0JyxcclxuICAgICAgY2FudmFzQ29sb3I6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXI6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogJ2luaXQnLFxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZTogJ2luaXQnLFxyXG4gICAgICBwcmV2ZW50V2hpdGVTcGFjZTogJ2ltZ0NvbnRlbnRJbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgIGluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kcmVmcy5jYW52YXNcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAnI2U2ZTZlNicgOiAodHlwZW9mIHRoaXMuY2FudmFzQ29sb3IgPT09ICdzdHJpbmcnID8gdGhpcy5jYW52YXNDb2xvciA6ICcnKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIGlmICh0aGlzLiRzbG90cy5pbml0aWFsICYmIHRoaXMuJHNsb3RzLmluaXRpYWxbMF0pIHtcclxuICAgICAgICAgIHRoaXMuc2V0SW5pdGlhbCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMudW5zZXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRlbWl0KElOSVRfRVZFTlQsIHtcclxuICAgICAgICAgIGdldENhbnZhczogKCkgPT4gdGhpcy5jYW52YXMsXHJcbiAgICAgICAgICBnZXRDb250ZXh0OiAoKSA9PiB0aGlzLmN0eCxcclxuICAgICAgICAgIGdldENob3NlbkZpbGU6ICgpID0+IHRoaXMuJHJlZnMuZmlsZUlucHV0LmZpbGVzWzBdLFxyXG4gICAgICAgICAgZ2V0QWN0dWFsSW1hZ2VTaXplOiAoKSA9PiAoe1xyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5yZWFsV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIG1vdmVVcHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlRG93bndhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IGFtb3VudCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVMZWZ0d2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVSaWdodHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21JbjogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnpvb20odHJ1ZSwge1xyXG4gICAgICAgICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxyXG4gICAgICAgICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21PdXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVmcmVzaDogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLmluaXQpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVzZXQ6IHRoaXMudW5zZXQsXHJcbiAgICAgICAgICBjaG9vc2VGaWxlOiB0aGlzLmNob29zZUZpbGUsXHJcbiAgICAgICAgICBnZW5lcmF0ZURhdGFVcmw6IHRoaXMuZ2VuZXJhdGVEYXRhVXJsLFxyXG4gICAgICAgICAgZ2VuZXJhdGVCbG9iOiB0aGlzLmdlbmVyYXRlQmxvYixcclxuICAgICAgICAgIHByb21pc2VkQmxvYjogdGhpcy5wcm9taXNlZEJsb2JcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgdW5zZXQgKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXHJcbiAgICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMucmVhbFdpZHRoIC8gMS41IC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcclxuICAgICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemUgfHwgdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZSA9PSAwKSA/IGRlZmF1bHRGb250U2l6ZSA6IHRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemVcclxuICAgICAgICBjdHguZm9udCA9IGZvbnRTaXplICsgJ3B4IHNhbnMtc2VyaWYnXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMucmVhbFdpZHRoIC8gMiwgdGhpcy5yZWFsSGVpZ2h0IC8gMilcclxuXHJcbiAgICAgICAgbGV0IGhhZEltYWdlID0gdGhpcy5pbWcgIT0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcclxuICAgICAgICB0aGlzLmltZ0RhdGEgPSB7fVxyXG5cclxuICAgICAgICBpZiAoaGFkSW1hZ2UpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoSU1BR0VfUkVNT1ZFKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNldEluaXRpYWwgKCkge1xyXG4gICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLmluaXRpYWxbMF1cclxuICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICBpZiAodGFnICE9PSAnaW1nJyB8fCAhZWxtIHx8ICFlbG0uc3JjKSB7XHJcbiAgICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChlbG0pKSB7XHJcbiAgICAgICAgICB0aGlzLmltZyA9IGVsbVxyXG4gICAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVsbS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoSU5JVElBTF9JTUFHRV9MT0FEKVxyXG4gICAgICAgICAgICB0aGlzLmltZyA9IGVsbVxyXG4gICAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBlbG0ub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy4kZW1pdChJTklUSUFMX0lNQUdFX0VSUk9SKVxyXG4gICAgICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjaG9vc2VGaWxlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWcgfHwgdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQuY2xpY2soKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlSW5wdXRDaGFuZ2UgKCkge1xyXG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMuZmlsZUlucHV0XHJcbiAgICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGgpIHJldHVyblxyXG5cclxuICAgICAgICBsZXQgZmlsZSA9IGlucHV0LmZpbGVzWzBdXHJcbiAgICAgICAgdGhpcy5vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgb25OZXdGaWxlSW4gKGZpbGUpIHtcclxuICAgICAgICB0aGlzLiRlbWl0KEZJTEVfQ0hPT1NFX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBzaXplIGV4Y2VlZHMgbGltaXQgd2hpY2ggaXMgJyArIHRoaXMuZmlsZVNpemVMaW1pdCArICcgYnl0ZXMuJylcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgICAgIGZyLm9ubG9hZCA9IChlKSA9PiB7XHJcbiAgICAgICAgICBsZXQgZmlsZURhdGEgPSBlLnRhcmdldC5yZXN1bHRcclxuICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgICAgaW1nLnNyYyA9IGZpbGVEYXRhXHJcbiAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmltZyA9IGltZ1xyXG4gICAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmlsZVNpemVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2VcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVNpemVMaW1pdCB8fCB0aGlzLmZpbGVTaXplTGltaXQgPT0gMCkgcmV0dXJuIHRydWVcclxuXHJcbiAgICAgICAgcmV0dXJuIGZpbGUuc2l6ZSA8IHRoaXMuZmlsZVNpemVMaW1pdFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaW1nQ29udGVudEluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLmltZy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIGxldCBpbWdSYXRpbyA9IGltZ0hlaWdodCAvIGltZ1dpZHRoXHJcbiAgICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5yZWFsSGVpZ2h0IC8gdGhpcy5yZWFsV2lkdGhcclxuXHJcbiAgICAgICAgLy8gZGlzcGxheSBhcyBmaXRcclxuICAgICAgICBpZiAoaW1nUmF0aW8gPCBjYW52YXNSYXRpbykge1xyXG4gICAgICAgICAgbGV0IHJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCByYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyByYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJTdGFydCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBpZiAoZXZ0LndoaWNoICYmIGV2dC53aGljaCA+IDEpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlXHJcblxyXG4gICAgICAgIGlmIChkb2N1bWVudCkge1xyXG4gICAgICAgICAgbGV0IGNhbmNlbEV2ZW50cyA9IFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCcsICdwb2ludGVyZW5kJywgJ3BvaW50ZXJjYW5jZWwnXVxyXG4gICAgICAgICAgZm9yIChsZXQgZSBvZiBjYW5jZWxFdmVudHMpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihlLCB0aGlzLmhhbmRsZVBvaW50ZXJFbmQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlckVuZCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IG51bGxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnVG9Nb3ZlIHx8ICF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cclxuICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIGlmICh0aGlzLmxhc3RNb3ZpbmdDb29yZCkge1xyXG4gICAgICAgICAgdGhpcy5tb3ZlKHtcclxuICAgICAgICAgICAgeDogY29vcmQueCAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLngsXHJcbiAgICAgICAgICAgIHk6IGNvb3JkLnkgLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC55XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVXaGVlbCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlU2Nyb2xsVG9ab29tIHx8ICF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICBpZiAoZXZ0LndoZWVsRGVsdGEgPCAwIHx8IGV2dC5kZXRhaWwgPCAwKSB7XHJcbiAgICAgICAgICAvLyDmiYvmjIflkJHkuIpcclxuICAgICAgICAgIHRoaXMuem9vbSh0aGlzLnJldmVyc2Vab29taW5nR2VzdHVyZSwgY29vcmQpXHJcbiAgICAgICAgfSBlbHNlIGlmIChldnQud2hlZWxEZWx0YSA+IDAgfHwgZXZ0LmRldGFpbCA+IDApIHtcclxuICAgICAgICAgIC8vIOaJi+aMh+WQkeS4i1xyXG4gICAgICAgICAgdGhpcy56b29tKCF0aGlzLnJldmVyc2Vab29taW5nR2VzdHVyZSwgY29vcmQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ0VudGVyIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnQW5kRHJvcCB8fCB0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSB0cnVlXHJcbiAgICAgICAgY29uc29sZS5sb2coJ2VudGVyJylcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyYWdMZWF2ZSAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ0FuZERyb3AgfHwgdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyYWdPdmVyIChldnQpIHtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyb3AgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdBbmREcm9wIHx8IHRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBpZiAoIWV2dC5kYXRhVHJhbnNmZXIgfHwgIWV2dC5kYXRhVHJhbnNmZXIuZmlsZXMubGVuZ3RoKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcbiAgICAgICAgbGV0IGZpbGUgPSBldnQuZGF0YVRyYW5zZmVyLmZpbGVzWzBdXHJcbiAgICAgICAgdGhpcy5vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbW92ZSAob2Zmc2V0KSB7XHJcbiAgICAgICAgaWYgKCFvZmZzZXQpIHJldHVyblxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggKz0gb2Zmc2V0LnhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZICs9IG9mZnNldC55XHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIHRoaXMucHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuJGVtaXQoTU9WRV9FVkVOVClcclxuICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFggPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WSA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlYWxXaWR0aCAtIHRoaXMuaW1nRGF0YS5zdGFydFggPiB0aGlzLmltZ0RhdGEud2lkdGgpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWFsSGVpZ2h0IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSA+IHRoaXMuaW1nRGF0YS5oZWlnaHQpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgem9vbSAoem9vbUluLCBwb3MpIHtcclxuICAgICAgICBsZXQgc3BlZWQgPSAodGhpcy5yZWFsV2lkdGggLyAxMDAwMDApICogdGhpcy56b29tU3BlZWRcclxuICAgICAgICBsZXQgeCA9IDFcclxuICAgICAgICBpZiAoem9vbUluKSB7XHJcbiAgICAgICAgICB4ID0gMSArIHNwZWVkXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiAyMCkge1xyXG4gICAgICAgICAgeCA9IDEgLSBzcGVlZFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGggKiB4XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHQgKiB4XHJcbiAgICAgICAgbGV0IG9mZnNldFggPSAoeCAtIDEpICogKHBvcy54IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WClcclxuICAgICAgICBsZXQgb2Zmc2V0WSA9ICh4IC0gMSkgKiAocG9zLnkgLSB0aGlzLmltZ0RhdGEuc3RhcnRZKVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYIC0gb2Zmc2V0WFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZIC0gb2Zmc2V0WVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMucmVhbFdpZHRoKSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMucmVhbFdpZHRoIC8gdGhpcy5pbWdEYXRhLndpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogX3hcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLmhlaWdodCA8IHRoaXMucmVhbEhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgX3ggPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLmltZ0RhdGEuaGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogX3hcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMucHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuJGVtaXQoWk9PTV9FVkVOVClcclxuICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFpbnRCYWNrZ3JvdW5kICgpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjZTZlNmU2JyA6IHRoaXMuY2FudmFzQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBiYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLnJlYWxXaWR0aCwgdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZHJhdyAoKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxyXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZURhdGFVcmwgKHR5cGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4gJydcclxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXMudG9EYXRhVVJMKHR5cGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuIG51bGxcclxuICAgICAgICB0aGlzLmNhbnZhcy50b0Jsb2IoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcm9taXNlZEJsb2IgKC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUJsb2IoKGJsb2IpID0+IHtcclxuICAgICAgICAgICAgICByZXNvbHZlKGJsb2IpXHJcbiAgICAgICAgICAgIH0sIGFyZ3MpXHJcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycilcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZSBsYW5nPVwic3R5bHVzXCI+XHJcbiAgLmNyb3BwYS1jb250YWluZXIgXHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2tcclxuICAgIGN1cnNvcjogcG9pbnRlclxyXG4gICAgdHJhbnNpdGlvbjogYWxsIC4zc1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlXHJcbiAgICBmb250LXNpemU6IDBcclxuICAgIGNhbnZhc1xyXG4gICAgICB0cmFuc2l0aW9uOiBhbGwgLjNzXHJcbiAgICAmOmhvdmVyXHJcbiAgICAgIG9wYWNpdHk6IC43XHJcbiAgICAmLmNyb3BwYS0tZHJvcHpvbmVcclxuICAgICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDEwcHggbGlnaHRuZXNzKGJsYWNrLCAyMCUpXHJcbiAgICAgIGNhbnZhc1xyXG4gICAgICAgIG9wYWNpdHk6IC41XHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWQtY2MgXHJcbiAgICAgIGN1cnNvcjogZGVmYXVsdFxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgJi5jcm9wcGEtLWhhcy10YXJnZXRcclxuICAgICAgY3Vyc29yOiBtb3ZlXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICYuY3JvcHBhLS1kaXNhYmxlZC1telxyXG4gICAgICAgIGN1cnNvcjogZGVmYXVsdFxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkXHJcbiAgICAgIGN1cnNvcjogbm90LWFsbG93ZWRcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgIHN2Zy5pY29uLXJlbW92ZVxyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGVcclxuICAgICAgYmFja2dyb3VuZDogd2hpdGVcclxuICAgICAgYm9yZGVyLXJhZGl1czogNTAlXHJcbiAgICAgIGJveC1zaGFkb3c6IC0ycHggMnB4IDZweCByZ2JhKDAsIDAsIDAsIDAuNylcclxuICAgICAgei1pbmRleDogMTBcclxuICAgICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHdoaXRlXHJcblxyXG48L3N0eWxlPlxyXG4iLCJpbXBvcnQgY3JvcHBlciBmcm9tICcuL2Nyb3BwZXIudnVlJ1xyXG5cclxuY29uc3QgVnVlQ3JvcHBhID0ge1xyXG4gIGluc3RhbGw6IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcclxuICAgIFZ1ZS5jb21wb25lbnQoJ2Nyb3BwYScsIGNyb3BwZXIpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsiZXZ0IiwiY3JvcHBlclZNIiwiY2FudmFzIiwicXVhbGl0eSIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRYIiwidG91Y2hlcyIsImNsaWVudFkiLCJsZWZ0IiwidG9wIiwiaW1nIiwiY29tcGxldGUiLCJuYXR1cmFsV2lkdGgiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJ2YWx1ZSIsImlzRmluaXRlIiwiTWF0aCIsImZsb29yIiwiT2JqZWN0IiwidmFsIiwiU3RyaW5nIiwiQm9vbGVhbiIsIklOSVRfRVZFTlQiLCJGSUxFX0NIT09TRV9FVkVOVCIsIkZJTEVfU0laRV9FWENFRURfRVZFTlQiLCJJTUFHRV9SRU1PVkUiLCJNT1ZFX0VWRU5UIiwiWk9PTV9FVkVOVCIsIklOSVRJQUxfSU1BR0VfTE9BRCIsIklOSVRJQUxfSU1BR0VfRVJST1IiLCJyZW5kZXIiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwicGxhY2Vob2xkZXJGb250U2l6ZSIsImluaXQiLCJpbnN0YW5jZSIsIiRyZWZzIiwicmVhbFdpZHRoIiwicmVhbEhlaWdodCIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY2FudmFzQ29sb3IiLCJjdHgiLCJnZXRDb250ZXh0IiwiJHNsb3RzIiwiaW5pdGlhbCIsInNldEluaXRpYWwiLCJ1bnNldCIsIiRlbWl0IiwiZmlsZUlucHV0IiwiZmlsZXMiLCJhbW91bnQiLCJtb3ZlIiwieCIsInkiLCJ6b29tIiwiaW1nRGF0YSIsInN0YXJ0WCIsInN0YXJ0WSIsIiRuZXh0VGljayIsImNob29zZUZpbGUiLCJnZW5lcmF0ZURhdGFVcmwiLCJnZW5lcmF0ZUJsb2IiLCJwcm9taXNlZEJsb2IiLCJjbGVhclJlY3QiLCJwYWludEJhY2tncm91bmQiLCJ0ZXh0QmFzZWxpbmUiLCJ0ZXh0QWxpZ24iLCJkZWZhdWx0Rm9udFNpemUiLCJwbGFjZWhvbGRlciIsImxlbmd0aCIsImZvbnRTaXplIiwicmVhbFBsYWNlaG9sZGVyRm9udFNpemUiLCJmb250IiwiZmlsbFN0eWxlIiwicGxhY2Vob2xkZXJDb2xvciIsImZpbGxUZXh0IiwiaGFkSW1hZ2UiLCJ2Tm9kZSIsInRhZyIsImVsbSIsInNyYyIsInUiLCJpbWFnZUxvYWRlZCIsImltZ0NvbnRlbnRJbml0Iiwib25sb2FkIiwib25lcnJvciIsImRpc2FibGVDbGlja1RvQ2hvb3NlIiwiY2xpY2siLCJpbnB1dCIsImZpbGUiLCJvbk5ld0ZpbGVJbiIsImZpbGVTaXplSXNWYWxpZCIsIkVycm9yIiwiZmlsZVNpemVMaW1pdCIsImZyIiwiRmlsZVJlYWRlciIsImUiLCJmaWxlRGF0YSIsInRhcmdldCIsInJlc3VsdCIsIkltYWdlIiwicmVhZEFzRGF0YVVSTCIsInNpemUiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsIm5hdHVyYWxIZWlnaHQiLCJpbWdSYXRpbyIsImNhbnZhc1JhdGlvIiwicmF0aW8iLCJkcmF3IiwiZGlzYWJsZWQiLCJ3aGljaCIsImRyYWdnaW5nIiwiZG9jdW1lbnQiLCJjYW5jZWxFdmVudHMiLCJhZGRFdmVudExpc3RlbmVyIiwiaGFuZGxlUG9pbnRlckVuZCIsImxhc3RNb3ZpbmdDb29yZCIsImRpc2FibGVEcmFnVG9Nb3ZlIiwiY29vcmQiLCJnZXRQb2ludGVyQ29vcmRzIiwiZGlzYWJsZVNjcm9sbFRvWm9vbSIsIndoZWVsRGVsdGEiLCJkZXRhaWwiLCJyZXZlcnNlWm9vbWluZ0dlc3R1cmUiLCJkaXNhYmxlRHJhZ0FuZERyb3AiLCJmaWxlRHJhZ2dlZE92ZXIiLCJsb2ciLCJkYXRhVHJhbnNmZXIiLCJvZmZzZXQiLCJwcmV2ZW50V2hpdGVTcGFjZSIsInByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UiLCJ6b29tSW4iLCJwb3MiLCJzcGVlZCIsInpvb21TcGVlZCIsIm9mZnNldFgiLCJvZmZzZXRZIiwiX3giLCJmaWxsUmVjdCIsImRyYXdJbWFnZSIsInR5cGUiLCJ0b0RhdGFVUkwiLCJjYWxsYmFjayIsIm1pbWVUeXBlIiwicXVhbGl0eUFyZ3VtZW50IiwidG9CbG9iIiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYmxvYiIsImVyciIsIlZ1ZUNyb3BwYSIsIlZ1ZSIsIm9wdGlvbnMiLCJjb21wb25lbnQiLCJjcm9wcGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLFFBQWU7a0JBQUEsNEJBQ0lBLEdBREosRUFDU0MsU0FEVCxFQUNvQjtRQUN6QkMsTUFEeUIsR0FDTEQsU0FESyxDQUN6QkMsTUFEeUI7UUFDakJDLE9BRGlCLEdBQ0xGLFNBREssQ0FDakJFLE9BRGlCOztRQUUzQkMsT0FBT0YsT0FBT0cscUJBQVAsRUFBWDtRQUNJQyxVQUFVTixJQUFJTyxPQUFKLEdBQWNQLElBQUlPLE9BQUosQ0FBWSxDQUFaLEVBQWVELE9BQTdCLEdBQXVDTixJQUFJTSxPQUF6RDtRQUNJRSxVQUFVUixJQUFJTyxPQUFKLEdBQWNQLElBQUlPLE9BQUosQ0FBWSxDQUFaLEVBQWVDLE9BQTdCLEdBQXVDUixJQUFJUSxPQUF6RDtXQUNPO1NBQ0YsQ0FBQ0YsVUFBVUYsS0FBS0ssSUFBaEIsSUFBd0JOLE9BRHRCO1NBRUYsQ0FBQ0ssVUFBVUosS0FBS00sR0FBaEIsSUFBdUJQO0tBRjVCO0dBTlc7YUFBQSx1QkFZRFEsR0FaQyxFQVlJO1dBQ1JBLElBQUlDLFFBQUosSUFBZ0JELElBQUlFLFlBQUosS0FBcUIsQ0FBNUM7O0NBYko7O0FDQUFDLE9BQU9DLFNBQVAsR0FBbUJELE9BQU9DLFNBQVAsSUFBb0IsVUFBVUMsS0FBVixFQUFpQjtTQUMvQyxPQUFPQSxLQUFQLEtBQWlCLFFBQWpCLElBQTZCQyxTQUFTRCxLQUFULENBQTdCLElBQWdERSxLQUFLQyxLQUFMLENBQVdILEtBQVgsTUFBc0JBLEtBQTdFO0NBREY7O0FBSUEsWUFBZTtTQUNOSSxNQURNO1NBRU47VUFDQ04sTUFE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
