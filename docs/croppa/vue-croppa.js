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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi9zcmMvY3JvcHBlci52dWUiLCIuLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgZ2V0UG9pbnRlckNvb3JkcyhldnQsIGNyb3BwZXJWTSkge1xyXG4gICAgbGV0IHsgY2FudmFzLCBxdWFsaXR5IH0gPSBjcm9wcGVyVk1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WCA6IGV2dC5jbGllbnRYXHJcbiAgICBsZXQgY2xpZW50WSA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WSA6IGV2dC5jbGllbnRZXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiAoY2xpZW50WCAtIHJlY3QubGVmdCkgKiBxdWFsaXR5LFxyXG4gICAgICB5OiAoY2xpZW50WSAtIHJlY3QudG9wKSAqIHF1YWxpdHlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZChpbWcpIHtcclxuICAgIHJldHVybiBpbWcuY29tcGxldGUgJiYgaW1nLm5hdHVyYWxXaWR0aCAhPT0gMFxyXG4gIH1cclxufSIsIk51bWJlci5pc0ludGVnZXIgPSBOdW1iZXIuaXNJbnRlZ2VyIHx8IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWVcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjZTZlNmU2J1xyXG4gIH0sXHJcbiAgcXVhbGl0eToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWwpICYmIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnaW1hZ2UvKidcclxuICB9LFxyXG4gIGZpbGVTaXplTGltaXQ6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+PSAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBkaXNhYmxlZDogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ0FuZERyb3A6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZUNsaWNrVG9DaG9vc2U6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZURyYWdUb01vdmU6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICByZXZlcnNlWm9vbWluZ0dlc3R1cmU6IEJvb2xlYW4sXHJcbiAgcHJldmVudFdoaXRlU3BhY2U6IEJvb2xlYW4sXHJcbiAgc2hvd1JlbW92ZUJ1dHRvbjoge1xyXG4gICAgdHlwZTogQm9vbGVhbixcclxuICAgIGRlZmF1bHQ6IHRydWVcclxuICB9LFxyXG4gIHJlbW92ZUJ1dHRvbkNvbG9yOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAncmVkJ1xyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uU2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyXHJcbiAgfVxyXG59IiwiPHRlbXBsYXRlPlxyXG4gIDxkaXYgOmNsYXNzPVwiYGNyb3BwYS1jb250YWluZXIgJHtpbWcgPyAnY3JvcHBhLS1oYXMtdGFyZ2V0JyA6ICcnfSAke2Rpc2FibGVkID8gJ2Nyb3BwYS0tZGlzYWJsZWQnIDogJyd9ICR7ZGlzYWJsZUNsaWNrVG9DaG9vc2UgPyAnY3JvcHBhLS1kaXNhYmxlZC1jYycgOiAnJ30gJHtkaXNhYmxlRHJhZ1RvTW92ZSAmJiBkaXNhYmxlU2Nyb2xsVG9ab29tID8gJ2Nyb3BwYS0tZGlzYWJsZWQtbXonIDogJyd9ICR7ZmlsZURyYWdnZWRPdmVyID8gJ2Nyb3BwYS0tZHJvcHpvbmUnIDogJyd9YFwiXHJcbiAgICAgICBAZHJhZ2VudGVyLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdFbnRlclwiXHJcbiAgICAgICBAZHJhZ2xlYXZlLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdMZWF2ZVwiXHJcbiAgICAgICBAZHJhZ292ZXIuc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJhZ092ZXJcIlxyXG4gICAgICAgQGRyb3Auc3RvcC5wcmV2ZW50PVwiaGFuZGxlRHJvcFwiPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCJcclxuICAgICAgICAgICA6YWNjZXB0PVwiYWNjZXB0XCJcclxuICAgICAgICAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXHJcbiAgICAgICAgICAgcmVmPVwiZmlsZUlucHV0XCJcclxuICAgICAgICAgICBoaWRkZW5cclxuICAgICAgICAgICBAY2hhbmdlPVwiaGFuZGxlSW5wdXRDaGFuZ2VcIiAvPlxyXG4gICAgPGRpdiBjbGFzcz1cImluaXRpYWxcIlxyXG4gICAgICAgICBzdHlsZT1cIndpZHRoOiAwOyBoZWlnaHQ6IDA7IHZpc2liaWxpdHk6IGhpZGRlbjtcIj5cclxuICAgICAgPHNsb3QgbmFtZT1cImluaXRpYWxcIj48L3Nsb3Q+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCJcclxuICAgICAgICAgICAgQGNsaWNrPVwiIWRpc2FibGVkICYmIGNob29zZUZpbGUoKVwiXHJcbiAgICAgICAgICAgIEB0b3VjaHN0YXJ0LnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEBtb3VzZWRvd24uc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHBvaW50ZXJzdGFydC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEB0b3VjaGNhbmNlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQG1vdXNldXAuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcmNhbmNlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNobW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBtb3VzZW1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBARE9NTW91c2VTY3JvbGwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAd2hlZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAbW91c2V3aGVlbC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVXaGVlbFwiPjwvY2FudmFzPlxyXG4gICAgPHN2ZyBjbGFzcz1cImljb24gaWNvbi1yZW1vdmVcIlxyXG4gICAgICAgICB2LWlmPVwic2hvd1JlbW92ZUJ1dHRvbiAmJiBpbWdcIlxyXG4gICAgICAgICBAY2xpY2s9XCJ1bnNldFwiXHJcbiAgICAgICAgIDpzdHlsZT1cImB0b3A6IC0ke2hlaWdodC80MH1weDsgcmlnaHQ6IC0ke3dpZHRoLzQwfXB4YFwiXHJcbiAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcclxuICAgICAgICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxyXG4gICAgICAgICA6d2lkdGg9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCJcclxuICAgICAgICAgOmhlaWdodD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIj5cclxuICAgICAgPHBhdGggZD1cIk01MTEuOTIxMjMxIDBDMjI5LjE3OTA3NyAwIDAgMjI5LjI1Nzg0NiAwIDUxMiAwIDc5NC43MDI3NjkgMjI5LjE3OTA3NyAxMDI0IDUxMS45MjEyMzEgMTAyNCA3OTQuNzgxNTM4IDEwMjQgMTAyNCA3OTQuNzAyNzY5IDEwMjQgNTEyIDEwMjQgMjI5LjI1Nzg0NiA3OTQuNzgxNTM4IDAgNTExLjkyMTIzMSAwWk03MzIuMDQxODQ2IDY1MC42MzM4NDYgNjUwLjUxNTY5MiA3MzIuMDgxMjMxQzY1MC41MTU2OTIgNzMyLjA4MTIzMSA1MjEuNDkxNjkyIDU5My42ODM2OTIgNTExLjg4MTg0NiA1OTMuNjgzNjkyIDUwMi40Mjk1MzggNTkzLjY4MzY5MiAzNzMuMzY2MTU0IDczMi4wODEyMzEgMzczLjM2NjE1NCA3MzIuMDgxMjMxTDI5MS43NjEyMzEgNjUwLjYzMzg0NkMyOTEuNzYxMjMxIDY1MC42MzM4NDYgNDMwLjMxNjMwOCA1MjMuNTAwMzA4IDQzMC4zMTYzMDggNTEyLjE5NjkyMyA0MzAuMzE2MzA4IDUwMC42OTY2MTUgMjkxLjc2MTIzMSAzNzMuNTIzNjkyIDI5MS43NjEyMzEgMzczLjUyMzY5MkwzNzMuMzY2MTU0IDI5MS45MTg3NjlDMzczLjM2NjE1NCAyOTEuOTE4NzY5IDUwMy40NTM1MzggNDMwLjM5NTA3NyA1MTEuODgxODQ2IDQzMC4zOTUwNzcgNTIwLjM0OTUzOCA0MzAuMzk1MDc3IDY1MC41MTU2OTIgMjkxLjkxODc2OSA2NTAuNTE1NjkyIDI5MS45MTg3NjlMNzMyLjA0MTg0NiAzNzMuNTIzNjkyQzczMi4wNDE4NDYgMzczLjUyMzY5MiA1OTMuNDQ3Mzg1IDUwMi41NDc2OTIgNTkzLjQ0NzM4NSA1MTIuMTk2OTIzIDU5My40NDczODUgNTIxLjQxMjkyMyA3MzIuMDQxODQ2IDY1MC42MzM4NDYgNzMyLjA0MTg0NiA2NTAuNjMzODQ2WlwiXHJcbiAgICAgICAgICAgIDpmaWxsPVwicmVtb3ZlQnV0dG9uQ29sb3JcIj48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xyXG4gIGltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xyXG5cclxuICBjb25zdCBJTklUX0VWRU5UID0gJ2luaXQnXHJcbiAgY29uc3QgRklMRV9DSE9PU0VfRVZFTlQgPSAnZmlsZS1jaG9vc2UnXHJcbiAgY29uc3QgRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCA9ICdmaWxlLXNpemUtZXhjZWVkJ1xyXG4gIGNvbnN0IElNQUdFX1JFTU9WRSA9ICdpbWFnZS1yZW1vdmUnXHJcbiAgY29uc3QgTU9WRV9FVkVOVCA9ICdtb3ZlJ1xyXG4gIGNvbnN0IFpPT01fRVZFTlQgPSAnem9vbSdcclxuICBjb25zdCBJTklUSUFMX0lNQUdFX0xPQUQgPSAnaW5pdGlhbC1pbWFnZS1sb2FkJ1xyXG4gIGNvbnN0IElOSVRJQUxfSU1BR0VfRVJST1IgPSAnaW5pdGlhbC1pbWFnZS1lcnJvcidcclxuXHJcbiAgZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgbW9kZWw6IHtcclxuICAgICAgcHJvcDogJ3ZhbHVlJyxcclxuICAgICAgZXZlbnQ6ICdpbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBwcm9wczogcHJvcHMsXHJcblxyXG4gICAgZGF0YSAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXHJcbiAgICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICAgIGN0eDogbnVsbCxcclxuICAgICAgICBpbWc6IG51bGwsXHJcbiAgICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICAgIGxhc3RNb3ZpbmdDb29yZDogbnVsbCxcclxuICAgICAgICBpbWdEYXRhOiB7fSxcclxuICAgICAgICBkYXRhVXJsOiAnJyxcclxuICAgICAgICBmaWxlRHJhZ2dlZE92ZXI6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgcmVhbFdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVhbEhlaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0ICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJGb250U2l6ZSAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdW50ZWQgKCkge1xyXG4gICAgICB0aGlzLmluaXQoKVxyXG4gICAgfSxcclxuXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSB2YWxcclxuICAgICAgfSxcclxuICAgICAgcmVhbFdpZHRoOiAnaW5pdCcsXHJcbiAgICAgIHJlYWxIZWlnaHQ6ICdpbml0JyxcclxuICAgICAgY2FudmFzQ29sb3I6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXI6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogJ2luaXQnLFxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZTogJ2luaXQnLFxyXG4gICAgICBwcmV2ZW50V2hpdGVTcGFjZTogJ2ltZ0NvbnRlbnRJbml0J1xyXG4gICAgfSxcclxuXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgIGluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kcmVmcy5jYW52YXNcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAnI2U2ZTZlNicgOiAodHlwZW9mIHRoaXMuY2FudmFzQ29sb3IgPT09ICdzdHJpbmcnID8gdGhpcy5jYW52YXNDb2xvciA6ICcnKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIGlmICh0aGlzLiRzbG90cy5pbml0aWFsICYmIHRoaXMuJHNsb3RzLmluaXRpYWxbMF0pIHtcclxuICAgICAgICAgIHRoaXMuc2V0SW5pdGlhbCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMudW5zZXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRlbWl0KElOSVRfRVZFTlQsIHtcclxuICAgICAgICAgIGdldENhbnZhczogKCkgPT4gdGhpcy5jYW52YXMsXHJcbiAgICAgICAgICBnZXRDb250ZXh0OiAoKSA9PiB0aGlzLmN0eCxcclxuICAgICAgICAgIGdldENob3NlbkZpbGU6ICgpID0+IHRoaXMuJHJlZnMuZmlsZUlucHV0LmZpbGVzWzBdLFxyXG4gICAgICAgICAgZ2V0QWN0dWFsSW1hZ2VTaXplOiAoKSA9PiAoe1xyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5yZWFsV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIG1vdmVVcHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb3ZlRG93bndhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IGFtb3VudCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVMZWZ0d2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVSaWdodHdhcmRzOiAoYW1vdW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21JbjogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnpvb20odHJ1ZSwge1xyXG4gICAgICAgICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxyXG4gICAgICAgICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21PdXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVmcmVzaDogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLmluaXQpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVzZXQ6IHRoaXMudW5zZXQsXHJcbiAgICAgICAgICBjaG9vc2VGaWxlOiB0aGlzLmNob29zZUZpbGUsXHJcbiAgICAgICAgICBnZW5lcmF0ZURhdGFVcmw6IHRoaXMuZ2VuZXJhdGVEYXRhVXJsLFxyXG4gICAgICAgICAgZ2VuZXJhdGVCbG9iOiB0aGlzLmdlbmVyYXRlQmxvYixcclxuICAgICAgICAgIHByb21pc2VkQmxvYjogdGhpcy5wcm9taXNlZEJsb2JcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgdW5zZXQgKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXHJcbiAgICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMucmVhbFdpZHRoIC8gMS41IC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcclxuICAgICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemUgfHwgdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZSA9PSAwKSA/IGRlZmF1bHRGb250U2l6ZSA6IHRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemVcclxuICAgICAgICBjdHguZm9udCA9IGZvbnRTaXplICsgJ3B4IHNhbnMtc2VyaWYnXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMucmVhbFdpZHRoIC8gMiwgdGhpcy5yZWFsSGVpZ2h0IC8gMilcclxuXHJcbiAgICAgICAgbGV0IGhhZEltYWdlID0gdGhpcy5pbWcgIT0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcclxuICAgICAgICB0aGlzLmltZ0RhdGEgPSB7fVxyXG5cclxuICAgICAgICBpZiAoaGFkSW1hZ2UpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoSU1BR0VfUkVNT1ZFKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNldEluaXRpYWwgKCkge1xyXG4gICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLmluaXRpYWxbMF1cclxuICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICBpZiAodGFnICE9PSAnaW1nJyB8fCAhZWxtIHx8ICFlbG0uc3JjKSB7XHJcbiAgICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChlbG0pKSB7XHJcbiAgICAgICAgICB0aGlzLmltZyA9IGVsbVxyXG4gICAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVsbS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoSU5JVElBTF9JTUFHRV9MT0FEKVxyXG4gICAgICAgICAgICB0aGlzLmltZyA9IGVsbVxyXG4gICAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBlbG0ub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy4kZW1pdChJTklUSUFMX0lNQUdFX0VSUk9SKVxyXG4gICAgICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjaG9vc2VGaWxlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWcgfHwgdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQuY2xpY2soKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlSW5wdXRDaGFuZ2UgKCkge1xyXG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMuZmlsZUlucHV0XHJcbiAgICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGgpIHJldHVyblxyXG5cclxuICAgICAgICBsZXQgZmlsZSA9IGlucHV0LmZpbGVzWzBdXHJcbiAgICAgICAgdGhpcy5vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgb25OZXdGaWxlSW4gKGZpbGUpIHtcclxuICAgICAgICB0aGlzLiRlbWl0KEZJTEVfQ0hPT1NFX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgIGlmICghdGhpcy5maWxlU2l6ZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBzaXplIGV4Y2VlZHMgbGltaXQgd2hpY2ggaXMgJyArIHRoaXMuZmlsZVNpemVMaW1pdCArICcgYnl0ZXMuJylcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgICAgIGZyLm9ubG9hZCA9IChlKSA9PiB7XHJcbiAgICAgICAgICBsZXQgZmlsZURhdGEgPSBlLnRhcmdldC5yZXN1bHRcclxuICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgICAgaW1nLnNyYyA9IGZpbGVEYXRhXHJcbiAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmltZyA9IGltZ1xyXG4gICAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmlsZVNpemVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2VcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVNpemVMaW1pdCB8fCB0aGlzLmZpbGVTaXplTGltaXQgPT0gMCkgcmV0dXJuIHRydWVcclxuXHJcbiAgICAgICAgcmV0dXJuIGZpbGUuc2l6ZSA8IHRoaXMuZmlsZVNpemVMaW1pdFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaW1nQ29udGVudEluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLmltZy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIGxldCBpbWdSYXRpbyA9IGltZ0hlaWdodCAvIGltZ1dpZHRoXHJcbiAgICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5yZWFsSGVpZ2h0IC8gdGhpcy5yZWFsV2lkdGhcclxuXHJcbiAgICAgICAgLy8gZGlzcGxheSBhcyBmaXRcclxuICAgICAgICBpZiAoaW1nUmF0aW8gPCBjYW52YXNSYXRpbykge1xyXG4gICAgICAgICAgbGV0IHJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCByYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyByYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJTdGFydCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBpZiAoZXZ0LndoaWNoICYmIGV2dC53aGljaCA+IDEpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlXHJcblxyXG4gICAgICAgIGlmIChkb2N1bWVudCkge1xyXG4gICAgICAgICAgbGV0IGNhbmNlbEV2ZW50cyA9IFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCcsICdwb2ludGVyZW5kJywgJ3BvaW50ZXJjYW5jZWwnXVxyXG4gICAgICAgICAgZm9yIChsZXQgZSBvZiBjYW5jZWxFdmVudHMpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihlLCB0aGlzLmhhbmRsZVBvaW50ZXJFbmQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlckVuZCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IG51bGxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnVG9Nb3ZlIHx8ICF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cclxuICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIGlmICh0aGlzLmxhc3RNb3ZpbmdDb29yZCkge1xyXG4gICAgICAgICAgdGhpcy5tb3ZlKHtcclxuICAgICAgICAgICAgeDogY29vcmQueCAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLngsXHJcbiAgICAgICAgICAgIHk6IGNvb3JkLnkgLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC55XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVXaGVlbCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlU2Nyb2xsVG9ab29tIHx8ICF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICBpZiAoZXZ0LndoZWVsRGVsdGEgPCAwIHx8IGV2dC5kZWx0YVkgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlWm9vbWluZ0dlc3R1cmUsIGNvb3JkKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LndoZWVsRGVsdGEgPiAwIHx8IGV2dC5kZWx0YVkgPCAwIHx8IGV2dC5kZXRhaWwgPCAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20oIXRoaXMucmV2ZXJzZVpvb21pbmdHZXN0dXJlLCBjb29yZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcmFnRW50ZXIgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdBbmREcm9wIHx8IHRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IHRydWVcclxuICAgICAgICBjb25zb2xlLmxvZygnZW50ZXInKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ0xlYXZlIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVEcmFnQW5kRHJvcCB8fCB0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ092ZXIgKGV2dCkge1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJvcCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ0FuZERyb3AgfHwgdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGlmICghZXZ0LmRhdGFUcmFuc2ZlciB8fCAhZXZ0LmRhdGFUcmFuc2Zlci5maWxlcy5sZW5ndGgpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuICAgICAgICBsZXQgZmlsZSA9IGV2dC5kYXRhVHJhbnNmZXIuZmlsZXNbMF1cclxuICAgICAgICB0aGlzLm9uTmV3RmlsZUluKGZpbGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlIChvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIW9mZnNldCkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgKz0gb2Zmc2V0LnlcclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4kZW1pdChNT1ZFX0VWRU5UKVxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRZID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVhbFdpZHRoIC0gdGhpcy5pbWdEYXRhLnN0YXJ0WCA+IHRoaXMuaW1nRGF0YS53aWR0aCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5yZWFsV2lkdGgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlYWxIZWlnaHQgLSB0aGlzLmltZ0RhdGEuc3RhcnRZID4gdGhpcy5pbWdEYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB6b29tICh6b29tSW4sIHBvcykge1xyXG4gICAgICAgIGxldCBzcGVlZCA9ICh0aGlzLnJlYWxXaWR0aCAvIDEwMDAwMCkgKiB0aGlzLnpvb21TcGVlZFxyXG4gICAgICAgIGxldCB4ID0gMVxyXG4gICAgICAgIGlmICh6b29tSW4pIHtcclxuICAgICAgICAgIHggPSAxICsgc3BlZWRcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA+IDIwKSB7XHJcbiAgICAgICAgICB4ID0gMSAtIHNwZWVkXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMuaW1nRGF0YS53aWR0aCAqIHhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5pbWdEYXRhLmhlaWdodCAqIHhcclxuICAgICAgICBsZXQgb2Zmc2V0WCA9ICh4IC0gMSkgKiAocG9zLnggLSB0aGlzLmltZ0RhdGEuc3RhcnRYKVxyXG4gICAgICAgIGxldCBvZmZzZXRZID0gKHggLSAxKSAqIChwb3MueSAtIHRoaXMuaW1nRGF0YS5zdGFydFkpXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHRoaXMuaW1nRGF0YS5zdGFydFggLSBvZmZzZXRYXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHRoaXMuaW1nRGF0YS5zdGFydFkgLSBvZmZzZXRZXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLndpZHRoIDwgdGhpcy5yZWFsV2lkdGgpIHtcclxuICAgICAgICAgICAgbGV0IF94ID0gdGhpcy5yZWFsV2lkdGggLyB0aGlzLmltZ0RhdGEud2lkdGhcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHQgKiBfeFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh0aGlzLmltZ0RhdGEuaGVpZ2h0IDwgdGhpcy5yZWFsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMucmVhbEhlaWdodCAvIHRoaXMuaW1nRGF0YS5oZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGggKiBfeFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4kZW1pdChaT09NX0VWRU5UKVxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwYWludEJhY2tncm91bmQgKCkge1xyXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJyNlNmU2ZTYnIDogdGhpcy5jYW52YXNDb2xvclxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvclxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMucmVhbFdpZHRoLCB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBkcmF3ICgpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5pbWdEYXRhXHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnJlYWxXaWR0aCwgdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICAgIHRoaXMucGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdlbmVyYXRlRGF0YVVybCAodHlwZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVybiAnJ1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwodHlwZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdlbmVyYXRlQmxvYiAoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4gbnVsbFxyXG4gICAgICAgIHRoaXMuY2FudmFzLnRvQmxvYihjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHByb21pc2VkQmxvYiAoLi4uYXJncykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlQmxvYigoYmxvYikgPT4ge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUoYmxvYilcclxuICAgICAgICAgICAgfSwgYXJncylcclxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzdHlsdXNcIj5cclxuICAuY3JvcHBhLWNvbnRhaW5lciBcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9ja1xyXG4gICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjNzXHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmVcclxuICAgIGZvbnQtc2l6ZTogMFxyXG4gICAgY2FudmFzXHJcbiAgICAgIHRyYW5zaXRpb246IGFsbCAuM3NcclxuICAgICY6aG92ZXJcclxuICAgICAgb3BhY2l0eTogLjdcclxuICAgICYuY3JvcHBhLS1kcm9wem9uZVxyXG4gICAgICBib3gtc2hhZG93OiBpbnNldCAwIDAgMTBweCBsaWdodG5lc3MoYmxhY2ssIDIwJSlcclxuICAgICAgY2FudmFzXHJcbiAgICAgICAgb3BhY2l0eTogLjVcclxuICAgICYuY3JvcHBhLS1kaXNhYmxlZC1jYyBcclxuICAgICAgY3Vyc29yOiBkZWZhdWx0XHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAmLmNyb3BwYS0taGFzLXRhcmdldFxyXG4gICAgICBjdXJzb3I6IG1vdmVcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgICAgJi5jcm9wcGEtLWRpc2FibGVkLW16XHJcbiAgICAgICAgY3Vyc29yOiBkZWZhdWx0XHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWRcclxuICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZFxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgc3ZnLmljb24tcmVtb3ZlXHJcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZVxyXG4gICAgICBiYWNrZ3JvdW5kOiB3aGl0ZVxyXG4gICAgICBib3JkZXItcmFkaXVzOiA1MCVcclxuICAgICAgYm94LXNoYWRvdzogLTJweCAycHggNnB4IHJnYmEoMCwgMCwgMCwgMC43KVxyXG4gICAgICB6LWluZGV4OiAxMFxyXG4gICAgICBjdXJzb3I6IHBvaW50ZXJcclxuICAgICAgYm9yZGVyOiAycHggc29saWQgd2hpdGVcclxuXHJcbjwvc3R5bGU+XHJcbiIsImltcG9ydCBjcm9wcGVyIGZyb20gJy4vY3JvcHBlci52dWUnXHJcblxyXG5jb25zdCBWdWVDcm9wcGEgPSB7XHJcbiAgaW5zdGFsbDogZnVuY3Rpb24gKFZ1ZSwgb3B0aW9ucykge1xyXG4gICAgVnVlLmNvbXBvbmVudCgnY3JvcHBhJywgY3JvcHBlcilcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZUNyb3BwYSJdLCJuYW1lcyI6WyJldnQiLCJjcm9wcGVyVk0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJ0b3VjaGVzIiwiY2xpZW50WSIsImxlZnQiLCJ0b3AiLCJpbWciLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJNYXRoIiwiZmxvb3IiLCJPYmplY3QiLCJ2YWwiLCJTdHJpbmciLCJCb29sZWFuIiwiSU5JVF9FVkVOVCIsIkZJTEVfQ0hPT1NFX0VWRU5UIiwiRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCIsIklNQUdFX1JFTU9WRSIsIk1PVkVfRVZFTlQiLCJaT09NX0VWRU5UIiwiSU5JVElBTF9JTUFHRV9MT0FEIiwiSU5JVElBTF9JTUFHRV9FUlJPUiIsInJlbmRlciIsInByb3BzIiwid2lkdGgiLCJoZWlnaHQiLCJwbGFjZWhvbGRlckZvbnRTaXplIiwiaW5pdCIsImluc3RhbmNlIiwiJHJlZnMiLCJyZWFsV2lkdGgiLCJyZWFsSGVpZ2h0Iiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjYW52YXNDb2xvciIsImN0eCIsImdldENvbnRleHQiLCIkc2xvdHMiLCJpbml0aWFsIiwic2V0SW5pdGlhbCIsInVuc2V0IiwiJGVtaXQiLCJmaWxlSW5wdXQiLCJmaWxlcyIsImFtb3VudCIsIm1vdmUiLCJ4IiwieSIsInpvb20iLCJpbWdEYXRhIiwic3RhcnRYIiwic3RhcnRZIiwiJG5leHRUaWNrIiwiY2hvb3NlRmlsZSIsImdlbmVyYXRlRGF0YVVybCIsImdlbmVyYXRlQmxvYiIsInByb21pc2VkQmxvYiIsImNsZWFyUmVjdCIsInBhaW50QmFja2dyb3VuZCIsInRleHRCYXNlbGluZSIsInRleHRBbGlnbiIsImRlZmF1bHRGb250U2l6ZSIsInBsYWNlaG9sZGVyIiwibGVuZ3RoIiwiZm9udFNpemUiLCJyZWFsUGxhY2Vob2xkZXJGb250U2l6ZSIsImZvbnQiLCJmaWxsU3R5bGUiLCJwbGFjZWhvbGRlckNvbG9yIiwiZmlsbFRleHQiLCJoYWRJbWFnZSIsInZOb2RlIiwidGFnIiwiZWxtIiwic3JjIiwidSIsImltYWdlTG9hZGVkIiwiaW1nQ29udGVudEluaXQiLCJvbmxvYWQiLCJvbmVycm9yIiwiZGlzYWJsZUNsaWNrVG9DaG9vc2UiLCJjbGljayIsImlucHV0IiwiZmlsZSIsIm9uTmV3RmlsZUluIiwiZmlsZVNpemVJc1ZhbGlkIiwiRXJyb3IiLCJmaWxlU2l6ZUxpbWl0IiwiZnIiLCJGaWxlUmVhZGVyIiwiZSIsImZpbGVEYXRhIiwidGFyZ2V0IiwicmVzdWx0IiwiSW1hZ2UiLCJyZWFkQXNEYXRhVVJMIiwic2l6ZSIsImltZ1dpZHRoIiwiaW1nSGVpZ2h0IiwibmF0dXJhbEhlaWdodCIsImltZ1JhdGlvIiwiY2FudmFzUmF0aW8iLCJyYXRpbyIsImRyYXciLCJkaXNhYmxlZCIsIndoaWNoIiwiZHJhZ2dpbmciLCJkb2N1bWVudCIsImNhbmNlbEV2ZW50cyIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYW5kbGVQb2ludGVyRW5kIiwibGFzdE1vdmluZ0Nvb3JkIiwiZGlzYWJsZURyYWdUb01vdmUiLCJjb29yZCIsImdldFBvaW50ZXJDb29yZHMiLCJkaXNhYmxlU2Nyb2xsVG9ab29tIiwid2hlZWxEZWx0YSIsImRlbHRhWSIsImRldGFpbCIsInJldmVyc2Vab29taW5nR2VzdHVyZSIsImRpc2FibGVEcmFnQW5kRHJvcCIsImZpbGVEcmFnZ2VkT3ZlciIsImxvZyIsImRhdGFUcmFuc2ZlciIsIm9mZnNldCIsInByZXZlbnRXaGl0ZVNwYWNlIiwicHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSIsInpvb21JbiIsInBvcyIsInNwZWVkIiwiem9vbVNwZWVkIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJfeCIsImZpbGxSZWN0IiwiZHJhd0ltYWdlIiwidHlwZSIsInRvRGF0YVVSTCIsImNhbGxiYWNrIiwibWltZVR5cGUiLCJxdWFsaXR5QXJndW1lbnQiLCJ0b0Jsb2IiLCJhcmdzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJibG9iIiwiZXJyIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImNvbXBvbmVudCIsImNyb3BwZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsUUFBZTtrQkFBQSw0QkFDSUEsR0FESixFQUNTQyxTQURULEVBQ29CO1FBQ3pCQyxNQUR5QixHQUNMRCxTQURLLENBQ3pCQyxNQUR5QjtRQUNqQkMsT0FEaUIsR0FDTEYsU0FESyxDQUNqQkUsT0FEaUI7O1FBRTNCQyxPQUFPRixPQUFPRyxxQkFBUCxFQUFYO1FBQ0lDLFVBQVVOLElBQUlPLE9BQUosR0FBY1AsSUFBSU8sT0FBSixDQUFZLENBQVosRUFBZUQsT0FBN0IsR0FBdUNOLElBQUlNLE9BQXpEO1FBQ0lFLFVBQVVSLElBQUlPLE9BQUosR0FBY1AsSUFBSU8sT0FBSixDQUFZLENBQVosRUFBZUMsT0FBN0IsR0FBdUNSLElBQUlRLE9BQXpEO1dBQ087U0FDRixDQUFDRixVQUFVRixLQUFLSyxJQUFoQixJQUF3Qk4sT0FEdEI7U0FFRixDQUFDSyxVQUFVSixLQUFLTSxHQUFoQixJQUF1QlA7S0FGNUI7R0FOVzthQUFBLHVCQVlEUSxHQVpDLEVBWUk7V0FDUkEsSUFBSUMsUUFBSixJQUFnQkQsSUFBSUUsWUFBSixLQUFxQixDQUE1Qzs7Q0FiSjs7QUNBQUMsT0FBT0MsU0FBUCxHQUFtQkQsT0FBT0MsU0FBUCxJQUFvQixVQUFVQyxLQUFWLEVBQWlCO1NBQy9DLE9BQU9BLEtBQVAsS0FBaUIsUUFBakIsSUFBNkJDLFNBQVNELEtBQVQsQ0FBN0IsSUFBZ0RFLEtBQUtDLEtBQUwsQ0FBV0gsS0FBWCxNQUFzQkEsS0FBN0U7Q0FE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
