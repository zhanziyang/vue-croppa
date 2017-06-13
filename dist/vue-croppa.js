(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Croppa = factory());
}(this, (function () { 'use strict';

var u = {
  getPointerCoords: function getPointerCoords(evt, canvas) {
    var rect = canvas.getBoundingClientRect();
    var clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    var clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }
};

var cropper = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { class: 'croppa-container ' + (_vm.hasTarget ? 'croppa--has-target' : '') }, [_c('input', { ref: "fileInput", attrs: { "type": "file", "accept": "image/*", "hidden": "" }, on: { "change": _vm.handleInputChange } }), _c('canvas', { ref: "canvas", attrs: { "width": _vm.canvasWidth, "height": _vm.canvasHeight }, on: { "click": _vm.selectFile, "touchstart": _vm.handlePointerStart, "mousedown": _vm.handlePointerStart, "pointerstart": _vm.handlePointerStart, "touchend": _vm.handlePointerEnd, "touchcancel": _vm.handlePointerEnd, "mouseup": _vm.handlePointerEnd, "pointerend": _vm.handlePointerEnd, "pointercancel": _vm.handlePointerEnd, "touchmove": _vm.handlePointerMove, "mousemove": _vm.handlePointerMove, "pointermove": _vm.handlePointerMove } })]);
  }, staticRenderFns: [],
  props: {
    width: Number,
    height: Number,
    placeholder: String,
    placeholderColor: String,
    canvasColor: String,
    scalingRatio: {
      default: 2,
      type: Number
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
      imgData: {}
    };
  },


  computed: {
    canvasWidth: function canvasWidth() {
      return this.width * this.scalingRatio;
    },
    canvasHeight: function canvasHeight() {
      return this.height * this.scalingRatio;
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
      this.dragging = true;
    },
    handlePointerEnd: function handlePointerEnd(evt) {
      this.dragging = false;
      this.lastMovingCoord = null;
    },
    handlePointerMove: function handlePointerMove(evt) {
      if (!this.dragging) return;
      var coord = u.getPointerCoords(evt, this.canvas);
      if (this.lastMovingCoord) {
        this.move({
          x: coord.x - this.lastMovingCoord.x,
          y: coord.y - this.lastMovingCoord.y
        });
      }
      this.lastMovingCoord = coord;
    },
    move: function move(offset) {
      console.log(offset);
      if (!offset) return;
      this.imgData.startX += offset.x * this.scalingRatio;
      this.imgData.startY += offset.y * this.scalingRatio;
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
      ctx.drawImage(this.img, startX, startY, width, height
      // console.log(this.canvas.toDataURL())
      );this.hasTarget = true;
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
