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

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */

var cropper = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { class: 'croppa-container ' + (_vm.hasTarget ? 'croppa--has-target' : '') }, [_c('input', { ref: "fileInput", attrs: { "type": "file", "accept": "image/*", "hidden": "" }, on: { "change": _vm.handleInputChange } }), _c('canvas', { ref: "canvas", attrs: { "width": _vm.canvasWidth, "height": _vm.canvasHeight }, on: { "click": _vm.selectFile, "touchstart": _vm.handlePointerStart, "mousedown": _vm.handlePointerStart, "pointerstart": _vm.handlePointerStart, "touchend": _vm.handlePointerEnd, "touchcancel": _vm.handlePointerEnd, "mouseup": _vm.handlePointerEnd, "pointerend": _vm.handlePointerEnd, "pointercancel": _vm.handlePointerEnd, "touchmove": _vm.handlePointerMove, "mousemove": _vm.handlePointerMove, "pointermove": _vm.handlePointerMove, "DOMMouseScroll": _vm.handleWheel, "mousewheel": _vm.handleWheel } })]);
  }, staticRenderFns: [],
  props: {
    width: Number,
    height: Number,
    placeholder: String,
    placeholderColor: String,
    canvasColor: String,
    quality: {
      default: 2,
      type: Number
    },
    zoomSpeed: {
      default: 3,
      type: Number,
      validator: function validator(val) {
        return val > 0;
      }
    }
  },

  data: function data() {
    return {
      canvas: null,
      ctx: null,
      img: null,
      hasTarget: false,
      dragging: false,
      lastMovingCoord: null,
      imgData: {},
      dataUrl: ''
    };
  },


  computed: {
    canvasWidth: function canvasWidth() {
      return this.width * this.quality;
    },
    canvasHeight: function canvasHeight() {
      return this.height * this.quality;
    }
  },

  mounted: function mounted() {
    this.init();
  },


  methods: {
    init: function init() {
      this.canvas = this.$refs.canvas;
      this.canvas.style.backgroundColor = this.canvasColor || '#e6e6e6';
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
      this.ctx = this.canvas.getContext('2d');
      this.unset();
      this.$emit('init', {
        reset: this.unset,
        selectFile: this.selectFile,
        generateDataUrl: this.generateDataUrl
      });
    },
    unset: function unset() {
      var ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.font = this.canvasWidth / 2 / this.placeholder.length + 'px sans-serif';
      ctx.fillStyle = this.placeholderColor || '#606060';
      ctx.fillText(this.placeholder, this.canvasWidth / 2, this.canvasHeight / 2);
      this.hasTarget = false;
    },
    selectFile: function selectFile() {
      if (this.hasTarget) return;
      // this.$refs.fileInput.value = ''
      this.$refs.fileInput.click();
    },
    handleInputChange: function handleInputChange() {
      var _this = this;

      var input = this.$refs.fileInput;
      if (!input.files.length) return;
      var file = input.files[0];
      var fd = new FileReader();
      fd.onload = function (e) {
        var fileData = e.target.result;
        var img = new Image();
        img.src = fileData;
        img.onload = function () {
          _this.img = img;
          _this.imgData.startX = 0;
          _this.imgData.startY = 0;
          var imgWidth = img.naturalWidth;
          var imgHeight = img.naturalHeight;
          if (imgWidth > imgHeight) {
            var ratio = imgHeight / _this.canvasHeight;
            _this.imgData.width = imgWidth / ratio;
            _this.imgData.height = _this.canvasHeight;
          } else {
            var _ratio = imgWidth / _this.canvasWidth;
            _this.imgData.width = _this.canvasWidth;
            _this.imgData.height = imgHeight / _ratio;
          }
          _this.draw();
        };
      };

      fd.readAsDataURL(file);
    },
    handlePointerStart: function handlePointerStart(evt) {
      if (evt.which && evt.which > 1) return;
      this.dragging = true;
    },
    handlePointerEnd: function handlePointerEnd(evt) {
      this.dragging = false;
      this.lastMovingCoord = null;
    },
    handlePointerMove: function handlePointerMove(evt) {
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
      evt.preventDefault();
      evt.stopPropagation();
      var coord = u.getPointerCoords(evt, this);
      if (evt.wheelDelta < 0 || evt.detail < 0) {
        // 手指向上
        this.zoom(true, coord);
      } else if (evt.wheelDelta > 0 || evt.detail > 0) {
        // 手指向下
        this.zoom(false, coord);
      }
    },
    move: function move(offset) {
      if (!offset) return;
      this.imgData.startX += offset.x;
      this.imgData.startY += offset.y;
      this.draw();
    },
    zoom: function zoom(zoomIn, pos) {
      var speed = this.canvasWidth / 100000 * this.zoomSpeed;
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
      this.draw();
    },
    draw: function draw() {
      var ctx = this.ctx;
      if (!this.imgData || !this.imgData.width) return;
      var _imgData = this.imgData,
          startX = _imgData.startX,
          startY = _imgData.startY,
          width = _imgData.width,
          height = _imgData.height;

      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      ctx.drawImage(this.img, startX, startY, width, height);
      this.hasTarget = true;
    },
    generateDataUrl: function generateDataUrl() {
      if (!this.hasTarget) return '';
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
//# sourceMappingURL=vue-croppa.js.map
