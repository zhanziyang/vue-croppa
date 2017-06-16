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

var cropper = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') }, [_c('input', { ref: "fileInput", attrs: { "type": "file", "accept": "image/*", "hidden": "" }, on: { "change": _vm.handleInputChange } }), _c('canvas', { ref: "canvas", on: { "click": _vm.selectFile, "touchstart": function touchstart($event) {
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
        } } }), _vm.showRemoveButton && _vm.img ? _c('svg', { staticClass: "icon icon-remove", style: 'top: -' + _vm.height / 40 + 'px; right: -' + _vm.width / 40 + 'px', attrs: { "t": "1497460039530", "viewBox": "0 0 1024 1024", "version": "1.1", "xmlns": "http://www.w3.org/2000/svg", "p-id": "1074", "xmlns:xlink": "http://www.w3.org/1999/xlink", "width": _vm.width / 10, "height": _vm.width / 10 }, on: { "click": _vm.unset } }, [_c('path', { attrs: { "d": "M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z", "p-id": "1075", "fill": "red" } })]) : _vm._e()]);
  }, staticRenderFns: [],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Object,
    width: Number,
    height: Number,
    placeholder: String,
    placeholderColor: String,
    placeholderFontSize: Number,
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
    },
    reverseZoomingGesture: Boolean,
    preventWhiteSpace: Boolean,
    showRemoveButton: Boolean
  },

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


  watch: {
    value: function value(val) {
      this.instance = val;
    },
    canvasWidth: 'init',
    canvasHeight: 'init',
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
      this.canvas.width = this.canvasWidth;
      this.canvas.height = this.canvasHeight;
      this.canvas.style.backgroundColor = this.canvasColor == 'default' ? '#e6e6e6' : this.canvasColor || '#e6e6e6';
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
      this.ctx = this.canvas.getContext('2d');
      this.unset();
      this.$emit('change', {
        getCanvas: function getCanvas() {
          return _this.canvas;
        },
        getContext: function getContext() {
          return _this.ctx;
        },
        getImage: function getImage() {
          return _this.img;
        },
        getImageData: function getImageData() {
          return _this.imgData;
        },
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
      var defaultFontSize = this.canvasWidth / 1.5 / this.placeholder.length;
      var fontSize = this.placeholderFontSize == 0 ? defaultFontSize : this.placeholderFontSize || defaultFontSize;
      ctx.font = fontSize + 'px sans-serif';
      ctx.fillStyle = this.placeholderColor == 'default' ? '#606060' : this.placeholderColor || '#606060';
      ctx.fillText(this.placeholder, this.canvasWidth / 2, this.canvasHeight / 2);
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imgData = {};
    },
    selectFile: function selectFile() {
      if (this.img) return;
      // this.$refs.fileInput.value = ''
      this.$refs.fileInput.click();
    },
    handleInputChange: function handleInputChange() {
      var _this2 = this;

      var input = this.$refs.fileInput;
      if (!input.files.length) return;
      var file = input.files[0];
      var fd = new FileReader();
      fd.onload = function (e) {
        var fileData = e.target.result;
        var img = new Image();
        img.src = fileData;
        img.onload = function () {
          _this2.img = img;
          _this2.imgContentInit();
        };
      };

      fd.readAsDataURL(file);
    },
    imgContentInit: function imgContentInit() {
      this.imgData.startX = 0;
      this.imgData.startY = 0;
      var imgWidth = this.img.naturalWidth;
      var imgHeight = this.img.naturalHeight;
      var imgRatio = imgHeight / imgWidth;
      var canvasRatio = this.canvasHeight / this.canvasWidth;
      if (imgRatio < canvasRatio) {
        var ratio = imgHeight / this.canvasHeight;
        this.imgData.width = imgWidth / ratio;
        this.imgData.startX = -(this.imgData.width - this.canvasWidth) / 2;
        this.imgData.height = this.canvasHeight;
      } else {
        var _ratio = imgWidth / this.canvasWidth;
        this.imgData.height = imgHeight / _ratio;
        this.imgData.startY = -(this.imgData.height - this.canvasHeight) / 2;
        this.imgData.width = this.canvasWidth;
      }
      this.draw();
    },
    handlePointerStart: function handlePointerStart(evt) {
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
      this.draw();
    },
    preventMovingToWhiteSpace: function preventMovingToWhiteSpace() {
      if (this.imgData.startX > 0) {
        this.imgData.startX = 0;
      }
      if (this.imgData.startY > 0) {
        this.imgData.startY = 0;
      }
      if (this.canvasWidth - this.imgData.startX > this.imgData.width) {
        this.imgData.startX = -(this.imgData.width - this.canvasWidth);
      }
      if (this.canvasHeight - this.imgData.startY > this.imgData.height) {
        this.imgData.startY = -(this.imgData.height - this.canvasHeight);
      }
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

      if (this.preventWhiteSpace) {
        if (this.imgData.width < this.canvasWidth) {
          var _x = this.canvasWidth / this.imgData.width;
          this.imgData.width = this.canvasWidth;
          this.imgData.height = this.imgData.height * _x;
        }

        if (this.imgData.height < this.canvasHeight) {
          var _x2 = this.canvasHeight / this.imgData.height;
          this.imgData.height = this.canvasHeight;
          this.imgData.width = this.imgData.width * _x2;
        }
        this.preventMovingToWhiteSpace();
      }
      this.draw();
    },
    draw: function draw() {
      var ctx = this.ctx;
      if (!this.img) return;
      var _imgData = this.imgData,
          startX = _imgData.startX,
          startY = _imgData.startY,
          width = _imgData.width,
          height = _imgData.height;

      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi9zcmMvY3JvcHBlci52dWUiLCIuLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XHJcbiAgZ2V0UG9pbnRlckNvb3JkcyhldnQsIGNyb3BwZXJWTSkge1xyXG4gICAgbGV0IHsgY2FudmFzLCBxdWFsaXR5IH0gPSBjcm9wcGVyVk1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WCA6IGV2dC5jbGllbnRYXHJcbiAgICBsZXQgY2xpZW50WSA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WSA6IGV2dC5jbGllbnRZXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiAoY2xpZW50WCAtIHJlY3QubGVmdCkgKiBxdWFsaXR5LFxyXG4gICAgICB5OiAoY2xpZW50WSAtIHJlY3QudG9wKSAqIHF1YWxpdHlcclxuICAgIH1cclxuICB9XHJcbn0iLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiA6Y2xhc3M9XCJgY3JvcHBhLWNvbnRhaW5lciAke2ltZyA/ICdjcm9wcGEtLWhhcy10YXJnZXQnIDogJyd9YFwiPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCJcclxuICAgICAgICAgICBhY2NlcHQ9XCJpbWFnZS8qXCJcclxuICAgICAgICAgICByZWY9XCJmaWxlSW5wdXRcIlxyXG4gICAgICAgICAgIGhpZGRlblxyXG4gICAgICAgICAgIEBjaGFuZ2U9XCJoYW5kbGVJbnB1dENoYW5nZVwiIC8+XHJcbiAgICA8Y2FudmFzIHJlZj1cImNhbnZhc1wiXHJcbiAgICAgICAgICAgIEBjbGljaz1cInNlbGVjdEZpbGVcIlxyXG4gICAgICAgICAgICBAdG91Y2hzdGFydC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAbW91c2Vkb3duLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyc3RhcnQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHRvdWNoZW5kLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAdG91Y2hjYW5jZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBtb3VzZXVwLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcmVuZC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJjYW5jZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEB0b3VjaG1vdmUuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBAbW91c2Vtb3ZlLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJtb3ZlLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQERPTU1vdXNlU2Nyb2xsLnN0b3AucHJldmVudD1cImhhbmRsZVdoZWVsXCJcclxuICAgICAgICAgICAgQG1vdXNld2hlZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlV2hlZWxcIj48L2NhbnZhcz5cclxuICAgIDxzdmcgdD1cIjE0OTc0NjAwMzk1MzBcIlxyXG4gICAgICAgICBjbGFzcz1cImljb24gaWNvbi1yZW1vdmVcIlxyXG4gICAgICAgICB2LWlmPVwic2hvd1JlbW92ZUJ1dHRvbiAmJiBpbWdcIlxyXG4gICAgICAgICBAY2xpY2s9XCJ1bnNldFwiXHJcbiAgICAgICAgIDpzdHlsZT1cImB0b3A6IC0ke2hlaWdodC80MH1weDsgcmlnaHQ6IC0ke3dpZHRoLzQwfXB4YFwiXHJcbiAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcclxuICAgICAgICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICBwLWlkPVwiMTA3NFwiXHJcbiAgICAgICAgIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiXHJcbiAgICAgICAgIDp3aWR0aD1cIndpZHRoLzEwXCJcclxuICAgICAgICAgOmhlaWdodD1cIndpZHRoLzEwXCI+XHJcbiAgICAgIDxwYXRoIGQ9XCJNNTExLjkyMTIzMSAwQzIyOS4xNzkwNzcgMCAwIDIyOS4yNTc4NDYgMCA1MTIgMCA3OTQuNzAyNzY5IDIyOS4xNzkwNzcgMTAyNCA1MTEuOTIxMjMxIDEwMjQgNzk0Ljc4MTUzOCAxMDI0IDEwMjQgNzk0LjcwMjc2OSAxMDI0IDUxMiAxMDI0IDIyOS4yNTc4NDYgNzk0Ljc4MTUzOCAwIDUxMS45MjEyMzEgMFpNNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDY1MC41MTU2OTIgNzMyLjA4MTIzMUM2NTAuNTE1NjkyIDczMi4wODEyMzEgNTIxLjQ5MTY5MiA1OTMuNjgzNjkyIDUxMS44ODE4NDYgNTkzLjY4MzY5MiA1MDIuNDI5NTM4IDU5My42ODM2OTIgMzczLjM2NjE1NCA3MzIuMDgxMjMxIDM3My4zNjYxNTQgNzMyLjA4MTIzMUwyOTEuNzYxMjMxIDY1MC42MzM4NDZDMjkxLjc2MTIzMSA2NTAuNjMzODQ2IDQzMC4zMTYzMDggNTIzLjUwMDMwOCA0MzAuMzE2MzA4IDUxMi4xOTY5MjMgNDMwLjMxNjMwOCA1MDAuNjk2NjE1IDI5MS43NjEyMzEgMzczLjUyMzY5MiAyOTEuNzYxMjMxIDM3My41MjM2OTJMMzczLjM2NjE1NCAyOTEuOTE4NzY5QzM3My4zNjYxNTQgMjkxLjkxODc2OSA1MDMuNDUzNTM4IDQzMC4zOTUwNzcgNTExLjg4MTg0NiA0MzAuMzk1MDc3IDUyMC4zNDk1MzggNDMwLjM5NTA3NyA2NTAuNTE1NjkyIDI5MS45MTg3NjkgNjUwLjUxNTY5MiAyOTEuOTE4NzY5TDczMi4wNDE4NDYgMzczLjUyMzY5MkM3MzIuMDQxODQ2IDM3My41MjM2OTIgNTkzLjQ0NzM4NSA1MDIuNTQ3NjkyIDU5My40NDczODUgNTEyLjE5NjkyMyA1OTMuNDQ3Mzg1IDUyMS40MTI5MjMgNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDczMi4wNDE4NDYgNjUwLjYzMzg0NlpcIlxyXG4gICAgICAgICAgICBwLWlkPVwiMTA3NVwiXHJcbiAgICAgICAgICAgIGZpbGw9XCJyZWRcIj48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xyXG5cclxuICBleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBtb2RlbDoge1xyXG4gICAgICBwcm9wOiAndmFsdWUnLFxyXG4gICAgICBldmVudDogJ2NoYW5nZSdcclxuICAgIH0sXHJcbiAgICBwcm9wczoge1xyXG4gICAgICB2YWx1ZTogT2JqZWN0LFxyXG4gICAgICB3aWR0aDogTnVtYmVyLFxyXG4gICAgICBoZWlnaHQ6IE51bWJlcixcclxuICAgICAgcGxhY2Vob2xkZXI6IFN0cmluZyxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogU3RyaW5nLFxyXG4gICAgICBwbGFjZWhvbGRlckZvbnRTaXplOiBOdW1iZXIsXHJcbiAgICAgIGNhbnZhc0NvbG9yOiBTdHJpbmcsXHJcbiAgICAgIHF1YWxpdHk6IHtcclxuICAgICAgICBkZWZhdWx0OiAyLFxyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICB6b29tU3BlZWQ6IHtcclxuICAgICAgICBkZWZhdWx0OiAzLFxyXG4gICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByZXZlcnNlWm9vbWluZ0dlc3R1cmU6IEJvb2xlYW4sXHJcbiAgICAgIHByZXZlbnRXaGl0ZVNwYWNlOiBCb29sZWFuLFxyXG4gICAgICBzaG93UmVtb3ZlQnV0dG9uOiBCb29sZWFuXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGEgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGluc3RhbmNlOiBudWxsLFxyXG4gICAgICAgIGNhbnZhczogbnVsbCxcclxuICAgICAgICBjdHg6IG51bGwsXHJcbiAgICAgICAgaW1nOiBudWxsLFxyXG4gICAgICAgIGRyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgICBsYXN0TW92aW5nQ29vcmQ6IG51bGwsXHJcbiAgICAgICAgaW1nRGF0YToge30sXHJcbiAgICAgICAgZGF0YVVybDogJydcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICBjYW52YXNXaWR0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNhbnZhc0hlaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0ICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbW91bnRlZCAoKSB7XHJcbiAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICB9LFxyXG5cclxuICAgIHdhdGNoOiB7XHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IHZhbFxyXG4gICAgICB9LFxyXG4gICAgICBjYW52YXNXaWR0aDogJ2luaXQnLFxyXG4gICAgICBjYW52YXNIZWlnaHQ6ICdpbml0JyxcclxuICAgICAgY2FudmFzQ29sb3I6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXI6ICdpbml0JyxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogJ2luaXQnLFxyXG4gICAgICBwbGFjZWhvbGRlckZvbnRTaXplOiAnaW5pdCcsXHJcbiAgICAgIHByZXZlbnRXaGl0ZVNwYWNlOiAnaW1nQ29udGVudEluaXQnXHJcbiAgICB9LFxyXG5cclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgaW5pdCAoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRyZWZzLmNhbnZhc1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXNXaWR0aFxyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcgPyAnI2U2ZTZlNicgOiB0aGlzLmNhbnZhc0NvbG9yIHx8ICcjZTZlNmU2J1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArICdweCdcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArICdweCdcclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuICAgICAgICB0aGlzLnVuc2V0KClcclxuICAgICAgICB0aGlzLiRlbWl0KCdjaGFuZ2UnLCB7XHJcbiAgICAgICAgICBnZXRDYW52YXM6ICgpID0+IHRoaXMuY2FudmFzLFxyXG4gICAgICAgICAgZ2V0Q29udGV4dDogKCkgPT4gdGhpcy5jdHgsXHJcbiAgICAgICAgICBnZXRJbWFnZTogKCkgPT4gdGhpcy5pbWcsXHJcbiAgICAgICAgICBnZXRJbWFnZURhdGE6ICgpID0+IHRoaXMuaW1nRGF0YSxcclxuICAgICAgICAgIHJlc2V0OiB0aGlzLnVuc2V0LFxyXG4gICAgICAgICAgc2VsZWN0RmlsZTogdGhpcy5zZWxlY3RGaWxlLFxyXG4gICAgICAgICAgZ2VuZXJhdGVEYXRhVXJsOiB0aGlzLmdlbmVyYXRlRGF0YVVybFxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB1bnNldCAoKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodClcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSdcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcidcclxuICAgICAgICBsZXQgZGVmYXVsdEZvbnRTaXplID0gdGhpcy5jYW52YXNXaWR0aCAvIDEuNSAvIHRoaXMucGxhY2Vob2xkZXIubGVuZ3RoXHJcbiAgICAgICAgbGV0IGZvbnRTaXplID0gdGhpcy5wbGFjZWhvbGRlckZvbnRTaXplID09IDAgPyBkZWZhdWx0Rm9udFNpemUgOiB0aGlzLnBsYWNlaG9sZGVyRm9udFNpemUgfHwgZGVmYXVsdEZvbnRTaXplXHJcbiAgICAgICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCBzYW5zLXNlcmlmJ1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLnBsYWNlaG9sZGVyQ29sb3IgPT0gJ2RlZmF1bHQnID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8ICcjNjA2MDYwJ1xyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0aGlzLnBsYWNlaG9sZGVyLCB0aGlzLmNhbnZhc1dpZHRoIC8gMiwgdGhpcy5jYW52YXNIZWlnaHQgLyAyKVxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcclxuICAgICAgICB0aGlzLmltZ0RhdGEgPSB7fVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2VsZWN0RmlsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICAvLyB0aGlzLiRyZWZzLmZpbGVJbnB1dC52YWx1ZSA9ICcnXHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQuY2xpY2soKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlSW5wdXRDaGFuZ2UgKCkge1xyXG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMuZmlsZUlucHV0XHJcbiAgICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGgpIHJldHVyblxyXG4gICAgICAgIGxldCBmaWxlID0gaW5wdXQuZmlsZXNbMF1cclxuICAgICAgICBsZXQgZmQgPSBuZXcgRmlsZVJlYWRlcigpXHJcbiAgICAgICAgZmQub25sb2FkID0gKGUpID0+IHtcclxuICAgICAgICAgIGxldCBmaWxlRGF0YSA9IGUudGFyZ2V0LnJlc3VsdFxyXG4gICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICBpbWcuc3JjID0gZmlsZURhdGFcclxuICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1nID0gaW1nXHJcbiAgICAgICAgICAgIHRoaXMuaW1nQ29udGVudEluaXQoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZmQucmVhZEFzRGF0YVVSTChmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaW1nQ29udGVudEluaXQgKCkge1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLmltZy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIGxldCBpbWdSYXRpbyA9IGltZ0hlaWdodCAvIGltZ1dpZHRoXHJcbiAgICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5jYW52YXNIZWlnaHQgLyB0aGlzLmNhbnZhc1dpZHRoXHJcbiAgICAgICAgaWYgKGltZ1JhdGlvIDwgY2FudmFzUmF0aW8pIHtcclxuICAgICAgICAgIGxldCByYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMuY2FudmFzSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLmNhbnZhc1dpZHRoKSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgcmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMuY2FudmFzV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyByYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMuY2FudmFzSGVpZ2h0KSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMuY2FudmFzV2lkdGhcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJTdGFydCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKGV2dC53aGljaCAmJiBldnQud2hpY2ggPiAxKSByZXR1cm5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxyXG5cclxuICAgICAgICBpZiAoZG9jdW1lbnQpIHtcclxuICAgICAgICAgIGxldCBjYW5jZWxFdmVudHMgPSBbJ21vdXNldXAnLCAndG91Y2hlbmQnLCAndG91Y2hjYW5jZWwnLCAncG9pbnRlcmVuZCcsICdwb2ludGVyY2FuY2VsJ11cclxuICAgICAgICAgIGZvciAobGV0IGUgb2YgY2FuY2VsRXZlbnRzKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZSwgdGhpcy5oYW5kbGVQb2ludGVyRW5kKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZVBvaW50ZXJFbmQgKGV2dCkge1xyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gbnVsbFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlck1vdmUgKGV2dCkge1xyXG4gICAgICAgIGlmICghdGhpcy5kcmFnZ2luZykgcmV0dXJuXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICBpZiAodGhpcy5sYXN0TW92aW5nQ29vcmQpIHtcclxuICAgICAgICAgIHRoaXMubW92ZSh7XHJcbiAgICAgICAgICAgIHg6IGNvb3JkLnggLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC54LFxyXG4gICAgICAgICAgICB5OiBjb29yZC55IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlV2hlZWwgKGV2dCkge1xyXG4gICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgaWYgKGV2dC53aGVlbERlbHRhIDwgMCB8fCBldnQuZGV0YWlsIDwgMCkge1xyXG4gICAgICAgICAgLy8g5omL5oyH5ZCR5LiKXHJcbiAgICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlWm9vbWluZ0dlc3R1cmUsIGNvb3JkKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LndoZWVsRGVsdGEgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XHJcbiAgICAgICAgICAvLyDmiYvmjIflkJHkuItcclxuICAgICAgICAgIHRoaXMuem9vbSghdGhpcy5yZXZlcnNlWm9vbWluZ0dlc3R1cmUsIGNvb3JkKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1vdmUgKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghb2Zmc2V0KSByZXR1cm5cclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYICs9IG9mZnNldC54XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSArPSBvZmZzZXQueVxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLnByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFggPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WSA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNhbnZhc1dpZHRoIC0gdGhpcy5pbWdEYXRhLnN0YXJ0WCA+IHRoaXMuaW1nRGF0YS53aWR0aCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0gKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMuY2FudmFzV2lkdGgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNhbnZhc0hlaWdodCAtIHRoaXMuaW1nRGF0YS5zdGFydFkgPiB0aGlzLmltZ0RhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSAodGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMuY2FudmFzSGVpZ2h0KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHpvb20gKHpvb21JbiwgcG9zKSB7XHJcbiAgICAgICAgbGV0IHNwZWVkID0gKHRoaXMuY2FudmFzV2lkdGggLyAxMDAwMDApICogdGhpcy56b29tU3BlZWRcclxuICAgICAgICBsZXQgeCA9IDFcclxuICAgICAgICBpZiAoem9vbUluKSB7XHJcbiAgICAgICAgICB4ID0gMSArIHNwZWVkXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiAyMCkge1xyXG4gICAgICAgICAgeCA9IDEgLSBzcGVlZFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGggKiB4XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHQgKiB4XHJcbiAgICAgICAgbGV0IG9mZnNldFggPSAoeCAtIDEpICogKHBvcy54IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WClcclxuICAgICAgICBsZXQgb2Zmc2V0WSA9ICh4IC0gMSkgKiAocG9zLnkgLSB0aGlzLmltZ0RhdGEuc3RhcnRZKVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYIC0gb2Zmc2V0WFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZIC0gb2Zmc2V0WVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMuY2FudmFzV2lkdGgpIHtcclxuICAgICAgICAgICAgbGV0IF94ID0gdGhpcy5jYW52YXNXaWR0aCAvIHRoaXMuaW1nRGF0YS53aWR0aFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogX3hcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLmhlaWdodCA8IHRoaXMuY2FudmFzSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMuY2FudmFzSGVpZ2h0IC8gdGhpcy5pbWdEYXRhLmhlaWdodFxyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogX3hcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMucHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBkcmF3ICgpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5pbWdEYXRhXHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodClcclxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdlbmVyYXRlRGF0YVVybCAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuICcnXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzdHlsdXNcIj5cclxuICAuY3JvcHBhLWNvbnRhaW5lciBcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9ja1xyXG4gICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IC4zc1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlXHJcbiAgICAmOmhvdmVyXHJcbiAgICAgIG9wYWNpdHk6IC43XHJcbiAgICAmLmNyb3BwYS0taGFzLXRhcmdldFxyXG4gICAgICBjdXJzb3I6IG1vdmVcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgIHN2Zy5pY29uLXJlbW92ZVxyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGVcclxuICAgICAgYmFja2dyb3VuZDogd2hpdGVcclxuICAgICAgYm9yZGVyLXJhZGl1czogNTAlXHJcbiAgICAgIGJveC1zaGFkb3c6IC0ycHggMnB4IDZweCByZ2JhKDAsIDAsIDAsIDAuNylcclxuICAgICAgei1pbmRleDogMTBcclxuICAgICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgLmltYWdlXHJcbiAgICBtYXgtd2lkdGg6IDEwMCVcclxuICAgIG1heC1oZWlnaHQ6IDEwMCVcclxuXHJcbjwvc3R5bGU+XHJcbiIsImltcG9ydCBjcm9wcGVyIGZyb20gJy4vY3JvcHBlci52dWUnXHJcblxyXG5jb25zdCBWdWVDcm9wcGEgPSB7XHJcbiAgaW5zdGFsbDogZnVuY3Rpb24gKFZ1ZSwgb3B0aW9ucykge1xyXG4gICAgVnVlLmNvbXBvbmVudCgnY3JvcHBhJywgY3JvcHBlcilcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZUNyb3BwYSJdLCJuYW1lcyI6WyJldnQiLCJjcm9wcGVyVk0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJ0b3VjaGVzIiwiY2xpZW50WSIsImxlZnQiLCJ0b3AiLCJyZW5kZXIiLCJPYmplY3QiLCJOdW1iZXIiLCJTdHJpbmciLCJ2YWwiLCJCb29sZWFuIiwid2lkdGgiLCJoZWlnaHQiLCJpbml0IiwiaW5zdGFuY2UiLCIkcmVmcyIsImNhbnZhc1dpZHRoIiwiY2FudmFzSGVpZ2h0Iiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjYW52YXNDb2xvciIsImN0eCIsImdldENvbnRleHQiLCJ1bnNldCIsIiRlbWl0IiwiaW1nIiwiaW1nRGF0YSIsInNlbGVjdEZpbGUiLCJnZW5lcmF0ZURhdGFVcmwiLCJjbGVhclJlY3QiLCJ0ZXh0QmFzZWxpbmUiLCJ0ZXh0QWxpZ24iLCJkZWZhdWx0Rm9udFNpemUiLCJwbGFjZWhvbGRlciIsImxlbmd0aCIsImZvbnRTaXplIiwicGxhY2Vob2xkZXJGb250U2l6ZSIsImZvbnQiLCJmaWxsU3R5bGUiLCJwbGFjZWhvbGRlckNvbG9yIiwiZmlsbFRleHQiLCJmaWxlSW5wdXQiLCJ2YWx1ZSIsImNsaWNrIiwiaW5wdXQiLCJmaWxlcyIsImZpbGUiLCJmZCIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJlIiwiZmlsZURhdGEiLCJ0YXJnZXQiLCJyZXN1bHQiLCJJbWFnZSIsInNyYyIsImltZ0NvbnRlbnRJbml0IiwicmVhZEFzRGF0YVVSTCIsInN0YXJ0WCIsInN0YXJ0WSIsImltZ1dpZHRoIiwibmF0dXJhbFdpZHRoIiwiaW1nSGVpZ2h0IiwibmF0dXJhbEhlaWdodCIsImltZ1JhdGlvIiwiY2FudmFzUmF0aW8iLCJyYXRpbyIsImRyYXciLCJ3aGljaCIsImRyYWdnaW5nIiwiZG9jdW1lbnQiLCJjYW5jZWxFdmVudHMiLCJhZGRFdmVudExpc3RlbmVyIiwiaGFuZGxlUG9pbnRlckVuZCIsImxhc3RNb3ZpbmdDb29yZCIsImNvb3JkIiwidSIsImdldFBvaW50ZXJDb29yZHMiLCJtb3ZlIiwieCIsInkiLCJ3aGVlbERlbHRhIiwiZGV0YWlsIiwiem9vbSIsInJldmVyc2Vab29taW5nR2VzdHVyZSIsIm9mZnNldCIsInByZXZlbnRXaGl0ZVNwYWNlIiwicHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSIsInpvb21JbiIsInBvcyIsInNwZWVkIiwiem9vbVNwZWVkIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJfeCIsImRyYXdJbWFnZSIsInRvRGF0YVVSTCIsIlZ1ZUNyb3BwYSIsIlZ1ZSIsIm9wdGlvbnMiLCJjb21wb25lbnQiLCJjcm9wcGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxRQUFlO2tCQUFBLDRCQUNJQSxHQURKLEVBQ1NDLFNBRFQsRUFDb0I7UUFDekJDLE1BRHlCLEdBQ0xELFNBREssQ0FDekJDLE1BRHlCO1FBQ2pCQyxPQURpQixHQUNMRixTQURLLENBQ2pCRSxPQURpQjs7UUFFM0JDLE9BQU9GLE9BQU9HLHFCQUFQLEVBQVg7UUFDSUMsVUFBVU4sSUFBSU8sT0FBSixHQUFjUCxJQUFJTyxPQUFKLENBQVksQ0FBWixFQUFlRCxPQUE3QixHQUF1Q04sSUFBSU0sT0FBekQ7UUFDSUUsVUFBVVIsSUFBSU8sT0FBSixHQUFjUCxJQUFJTyxPQUFKLENBQVksQ0FBWixFQUFlQyxPQUE3QixHQUF1Q1IsSUFBSVEsT0FBekQ7V0FDTztTQUNGLENBQUNGLFVBQVVGLEtBQUtLLElBQWhCLElBQXdCTixPQUR0QjtTQUVGLENBQUNLLFVBQVVKLEtBQUtNLEdBQWhCLElBQXVCUDtLQUY1Qjs7Q0FOSjs7QUM0Q0EsY0FBZSxFQUFDUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQUFELHFCQUFBO1NBQ047VUFDQyxPQUREO1dBRUU7R0FISTtTQUtOO1dBQ0VDLE1BREY7V0FFRUMsTUFGRjtZQUdHQSxNQUhIO2lCQUlRQyxNQUpSO3NCQUthQSxNQUxiO3lCQU1nQkQsTUFOaEI7aUJBT1FDLE1BUFI7YUFRSTtlQUNFLENBREY7WUFFREQ7S0FWSDtlQVlNO2VBQ0EsQ0FEQTtZQUVIQSxNQUZHO2lCQUdFLG1CQUFVRSxHQUFWLEVBQWU7ZUFDakJBLE1BQU0sQ0FBYjs7S0FoQkM7MkJBbUJrQkMsT0FuQmxCO3VCQW9CY0EsT0FwQmQ7c0JBcUJhQTtHQTFCUDs7TUFBQSxrQkE2Qkw7V0FDQztnQkFDSyxJQURMO2NBRUcsSUFGSDtXQUdBLElBSEE7V0FJQSxJQUpBO2dCQUtLLEtBTEw7dUJBTVksSUFOWjtlQU9JLEVBUEo7ZUFRSTtLQVJYO0dBOUJXOzs7WUEwQ0g7ZUFBQSx5QkFDTzthQUNOLEtBQUtDLEtBQUwsR0FBYSxLQUFLZCxPQUF6QjtLQUZNO2dCQUFBLDBCQUtRO2FBQ1AsS0FBS2UsTUFBTCxHQUFjLEtBQUtmLE9BQTFCOztHQWhEUzs7U0FBQSxxQkFvREY7U0FDSmdCLElBQUw7R0FyRFc7OztTQXdETjtXQUNFLGVBQVVKLEdBQVYsRUFBZTtXQUNmSyxRQUFMLEdBQWdCTCxHQUFoQjtLQUZHO2lCQUlRLE1BSlI7a0JBS1MsTUFMVDtpQkFNUSxNQU5SO2lCQU9RLE1BUFI7c0JBUWEsTUFSYjt5QkFTZ0IsTUFUaEI7dUJBVWM7R0FsRVI7O1dBcUVKO1FBQUEsa0JBQ0M7OztXQUNEYixNQUFMLEdBQWMsS0FBS21CLEtBQUwsQ0FBV25CLE1BQXpCO1dBQ0tBLE1BQUwsQ0FBWWUsS0FBWixHQUFvQixLQUFLSyxXQUF6QjtXQUNLcEIsTUFBTCxDQUFZZ0IsTUFBWixHQUFxQixLQUFLSyxZQUExQjtXQUNLckIsTUFBTCxDQUFZc0IsS0FBWixDQUFrQkMsZUFBbEIsR0FBb0MsS0FBS0MsV0FBTCxJQUFvQixTQUFwQixHQUFnQyxTQUFoQyxHQUE0QyxLQUFLQSxXQUFMLElBQW9CLFNBQXBHO1dBQ0t4QixNQUFMLENBQVlzQixLQUFaLENBQWtCUCxLQUFsQixHQUEwQixLQUFLQSxLQUFMLEdBQWEsSUFBdkM7V0FDS2YsTUFBTCxDQUFZc0IsS0FBWixDQUFrQk4sTUFBbEIsR0FBMkIsS0FBS0EsTUFBTCxHQUFjLElBQXpDO1dBQ0tTLEdBQUwsR0FBVyxLQUFLekIsTUFBTCxDQUFZMEIsVUFBWixDQUF1QixJQUF2QixDQUFYO1dBQ0tDLEtBQUw7V0FDS0MsS0FBTCxDQUFXLFFBQVgsRUFBcUI7bUJBQ1I7aUJBQU0sTUFBSzVCLE1BQVg7U0FEUTtvQkFFUDtpQkFBTSxNQUFLeUIsR0FBWDtTQUZPO2tCQUdUO2lCQUFNLE1BQUtJLEdBQVg7U0FIUztzQkFJTDtpQkFBTSxNQUFLQyxPQUFYO1NBSks7ZUFLWixLQUFLSCxLQUxPO29CQU1QLEtBQUtJLFVBTkU7eUJBT0YsS0FBS0M7T0FQeEI7S0FWSztTQUFBLG1CQXFCRTtVQUNIUCxNQUFNLEtBQUtBLEdBQWY7VUFDSVEsU0FBSixDQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsS0FBS2IsV0FBekIsRUFBc0MsS0FBS0MsWUFBM0M7VUFDSWEsWUFBSixHQUFtQixRQUFuQjtVQUNJQyxTQUFKLEdBQWdCLFFBQWhCO1VBQ0lDLGtCQUFrQixLQUFLaEIsV0FBTCxHQUFtQixHQUFuQixHQUF5QixLQUFLaUIsV0FBTCxDQUFpQkMsTUFBaEU7VUFDSUMsV0FBVyxLQUFLQyxtQkFBTCxJQUE0QixDQUE1QixHQUFnQ0osZUFBaEMsR0FBa0QsS0FBS0ksbUJBQUwsSUFBNEJKLGVBQTdGO1VBQ0lLLElBQUosR0FBV0YsV0FBVyxlQUF0QjtVQUNJRyxTQUFKLEdBQWdCLEtBQUtDLGdCQUFMLElBQXlCLFNBQXpCLEdBQXFDLFNBQXJDLEdBQWlELEtBQUtBLGdCQUFMLElBQXlCLFNBQTFGO1VBQ0lDLFFBQUosQ0FBYSxLQUFLUCxXQUFsQixFQUErQixLQUFLakIsV0FBTCxHQUFtQixDQUFsRCxFQUFxRCxLQUFLQyxZQUFMLEdBQW9CLENBQXpFO1dBQ0tRLEdBQUwsR0FBVyxJQUFYO1dBQ0tWLEtBQUwsQ0FBVzBCLFNBQVgsQ0FBcUJDLEtBQXJCLEdBQTZCLEVBQTdCO1dBQ0toQixPQUFMLEdBQWUsRUFBZjtLQWpDSztjQUFBLHdCQW9DTztVQUNSLEtBQUtELEdBQVQsRUFBYzs7V0FFVFYsS0FBTCxDQUFXMEIsU0FBWCxDQUFxQkUsS0FBckI7S0F2Q0s7cUJBQUEsK0JBMENjOzs7VUFDZkMsUUFBUSxLQUFLN0IsS0FBTCxDQUFXMEIsU0FBdkI7VUFDSSxDQUFDRyxNQUFNQyxLQUFOLENBQVlYLE1BQWpCLEVBQXlCO1VBQ3JCWSxPQUFPRixNQUFNQyxLQUFOLENBQVksQ0FBWixDQUFYO1VBQ0lFLEtBQUssSUFBSUMsVUFBSixFQUFUO1NBQ0dDLE1BQUgsR0FBWSxVQUFDQyxDQUFELEVBQU87WUFDYkMsV0FBV0QsRUFBRUUsTUFBRixDQUFTQyxNQUF4QjtZQUNJNUIsTUFBTSxJQUFJNkIsS0FBSixFQUFWO1lBQ0lDLEdBQUosR0FBVUosUUFBVjtZQUNJRixNQUFKLEdBQWEsWUFBTTtpQkFDWnhCLEdBQUwsR0FBV0EsR0FBWDtpQkFDSytCLGNBQUw7U0FGRjtPQUpGOztTQVVHQyxhQUFILENBQWlCWCxJQUFqQjtLQXpESztrQkFBQSw0QkE0RFc7V0FDWHBCLE9BQUwsQ0FBYWdDLE1BQWIsR0FBc0IsQ0FBdEI7V0FDS2hDLE9BQUwsQ0FBYWlDLE1BQWIsR0FBc0IsQ0FBdEI7VUFDSUMsV0FBVyxLQUFLbkMsR0FBTCxDQUFTb0MsWUFBeEI7VUFDSUMsWUFBWSxLQUFLckMsR0FBTCxDQUFTc0MsYUFBekI7VUFDSUMsV0FBV0YsWUFBWUYsUUFBM0I7VUFDSUssY0FBYyxLQUFLaEQsWUFBTCxHQUFvQixLQUFLRCxXQUEzQztVQUNJZ0QsV0FBV0MsV0FBZixFQUE0QjtZQUN0QkMsUUFBUUosWUFBWSxLQUFLN0MsWUFBN0I7YUFDS1MsT0FBTCxDQUFhZixLQUFiLEdBQXFCaUQsV0FBV00sS0FBaEM7YUFDS3hDLE9BQUwsQ0FBYWdDLE1BQWIsR0FBc0IsRUFBRSxLQUFLaEMsT0FBTCxDQUFhZixLQUFiLEdBQXFCLEtBQUtLLFdBQTVCLElBQTJDLENBQWpFO2FBQ0tVLE9BQUwsQ0FBYWQsTUFBYixHQUFzQixLQUFLSyxZQUEzQjtPQUpGLE1BS087WUFDRGlELFNBQVFOLFdBQVcsS0FBSzVDLFdBQTVCO2FBQ0tVLE9BQUwsQ0FBYWQsTUFBYixHQUFzQmtELFlBQVlJLE1BQWxDO2FBQ0t4QyxPQUFMLENBQWFpQyxNQUFiLEdBQXNCLEVBQUUsS0FBS2pDLE9BQUwsQ0FBYWQsTUFBYixHQUFzQixLQUFLSyxZQUE3QixJQUE2QyxDQUFuRTthQUNLUyxPQUFMLENBQWFmLEtBQWIsR0FBcUIsS0FBS0ssV0FBMUI7O1dBRUdtRCxJQUFMO0tBOUVLO3NCQUFBLDhCQWlGYXpFLEdBakZiLEVBaUZrQjtVQUNuQkEsSUFBSTBFLEtBQUosSUFBYTFFLElBQUkwRSxLQUFKLEdBQVksQ0FBN0IsRUFBZ0M7V0FDM0JDLFFBQUwsR0FBZ0IsSUFBaEI7O1VBRUlDLFFBQUosRUFBYztZQUNSQyxlQUFlLENBQUMsU0FBRCxFQUFZLFVBQVosRUFBd0IsYUFBeEIsRUFBdUMsWUFBdkMsRUFBcUQsZUFBckQsQ0FBbkI7Ozs7OzsrQkFDY0EsWUFBZCw4SEFBNEI7Z0JBQW5CckIsQ0FBbUI7O3FCQUNqQnNCLGdCQUFULENBQTBCdEIsQ0FBMUIsRUFBNkIsS0FBS3VCLGdCQUFsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7S0F4RkM7b0JBQUEsNEJBNkZXL0UsR0E3RlgsRUE2RmdCO1dBQ2hCMkUsUUFBTCxHQUFnQixLQUFoQjtXQUNLSyxlQUFMLEdBQXVCLElBQXZCO0tBL0ZLO3FCQUFBLDZCQWtHWWhGLEdBbEdaLEVBa0dpQjtVQUNsQixDQUFDLEtBQUsyRSxRQUFWLEVBQW9CO1VBQ2hCTSxRQUFRQyxFQUFFQyxnQkFBRixDQUFtQm5GLEdBQW5CLEVBQXdCLElBQXhCLENBQVo7VUFDSSxLQUFLZ0YsZUFBVCxFQUEwQjthQUNuQkksSUFBTCxDQUFVO2FBQ0xILE1BQU1JLENBQU4sR0FBVSxLQUFLTCxlQUFMLENBQXFCSyxDQUQxQjthQUVMSixNQUFNSyxDQUFOLEdBQVUsS0FBS04sZUFBTCxDQUFxQk07U0FGcEM7O1dBS0dOLGVBQUwsR0FBdUJDLEtBQXZCO0tBM0dLO2VBQUEsdUJBOEdNakYsR0E5R04sRUE4R1c7VUFDWmlGLFFBQVFDLEVBQUVDLGdCQUFGLENBQW1CbkYsR0FBbkIsRUFBd0IsSUFBeEIsQ0FBWjtVQUNJQSxJQUFJdUYsVUFBSixHQUFpQixDQUFqQixJQUFzQnZGLElBQUl3RixNQUFKLEdBQWEsQ0FBdkMsRUFBMEM7O2FBRW5DQyxJQUFMLENBQVUsS0FBS0MscUJBQWYsRUFBc0NULEtBQXRDO09BRkYsTUFHTyxJQUFJakYsSUFBSXVGLFVBQUosR0FBaUIsQ0FBakIsSUFBc0J2RixJQUFJd0YsTUFBSixHQUFhLENBQXZDLEVBQTBDOzthQUUxQ0MsSUFBTCxDQUFVLENBQUMsS0FBS0MscUJBQWhCLEVBQXVDVCxLQUF2Qzs7S0FySEc7UUFBQSxnQkF5SERVLE1BekhDLEVBeUhPO1VBQ1IsQ0FBQ0EsTUFBTCxFQUFhO1dBQ1IzRCxPQUFMLENBQWFnQyxNQUFiLElBQXVCMkIsT0FBT04sQ0FBOUI7V0FDS3JELE9BQUwsQ0FBYWlDLE1BQWIsSUFBdUIwQixPQUFPTCxDQUE5QjtVQUNJLEtBQUtNLGlCQUFULEVBQTRCO2FBQ3JCQyx5QkFBTDs7V0FFR3BCLElBQUw7S0FoSUs7NkJBQUEsdUNBbUlzQjtVQUN2QixLQUFLekMsT0FBTCxDQUFhZ0MsTUFBYixHQUFzQixDQUExQixFQUE2QjthQUN0QmhDLE9BQUwsQ0FBYWdDLE1BQWIsR0FBc0IsQ0FBdEI7O1VBRUUsS0FBS2hDLE9BQUwsQ0FBYWlDLE1BQWIsR0FBc0IsQ0FBMUIsRUFBNkI7YUFDdEJqQyxPQUFMLENBQWFpQyxNQUFiLEdBQXNCLENBQXRCOztVQUVFLEtBQUszQyxXQUFMLEdBQW1CLEtBQUtVLE9BQUwsQ0FBYWdDLE1BQWhDLEdBQXlDLEtBQUtoQyxPQUFMLENBQWFmLEtBQTFELEVBQWlFO2FBQzFEZSxPQUFMLENBQWFnQyxNQUFiLEdBQXNCLEVBQUcsS0FBS2hDLE9BQUwsQ0FBYWYsS0FBYixHQUFxQixLQUFLSyxXQUE3QixDQUF0Qjs7VUFFRSxLQUFLQyxZQUFMLEdBQW9CLEtBQUtTLE9BQUwsQ0FBYWlDLE1BQWpDLEdBQTBDLEtBQUtqQyxPQUFMLENBQWFkLE1BQTNELEVBQW1FO2FBQzVEYyxPQUFMLENBQWFpQyxNQUFiLEdBQXNCLEVBQUcsS0FBS2pDLE9BQUwsQ0FBYWQsTUFBYixHQUFzQixLQUFLSyxZQUE5QixDQUF0Qjs7S0E5SUc7UUFBQSxnQkFrSkR1RSxNQWxKQyxFQWtKT0MsR0FsSlAsRUFrSlk7VUFDYkMsUUFBUyxLQUFLMUUsV0FBTCxHQUFtQixNQUFwQixHQUE4QixLQUFLMkUsU0FBL0M7VUFDSVosSUFBSSxDQUFSO1VBQ0lTLE1BQUosRUFBWTtZQUNOLElBQUlFLEtBQVI7T0FERixNQUVPLElBQUksS0FBS2hFLE9BQUwsQ0FBYWYsS0FBYixHQUFxQixFQUF6QixFQUE2QjtZQUM5QixJQUFJK0UsS0FBUjs7V0FFR2hFLE9BQUwsQ0FBYWYsS0FBYixHQUFxQixLQUFLZSxPQUFMLENBQWFmLEtBQWIsR0FBcUJvRSxDQUExQztXQUNLckQsT0FBTCxDQUFhZCxNQUFiLEdBQXNCLEtBQUtjLE9BQUwsQ0FBYWQsTUFBYixHQUFzQm1FLENBQTVDO1VBQ0lhLFVBQVUsQ0FBQ2IsSUFBSSxDQUFMLEtBQVdVLElBQUlWLENBQUosR0FBUSxLQUFLckQsT0FBTCxDQUFhZ0MsTUFBaEMsQ0FBZDtVQUNJbUMsVUFBVSxDQUFDZCxJQUFJLENBQUwsS0FBV1UsSUFBSVQsQ0FBSixHQUFRLEtBQUt0RCxPQUFMLENBQWFpQyxNQUFoQyxDQUFkO1dBQ0tqQyxPQUFMLENBQWFnQyxNQUFiLEdBQXNCLEtBQUtoQyxPQUFMLENBQWFnQyxNQUFiLEdBQXNCa0MsT0FBNUM7V0FDS2xFLE9BQUwsQ0FBYWlDLE1BQWIsR0FBc0IsS0FBS2pDLE9BQUwsQ0FBYWlDLE1BQWIsR0FBc0JrQyxPQUE1Qzs7VUFFSSxLQUFLUCxpQkFBVCxFQUE0QjtZQUN0QixLQUFLNUQsT0FBTCxDQUFhZixLQUFiLEdBQXFCLEtBQUtLLFdBQTlCLEVBQTJDO2NBQ3JDOEUsS0FBSyxLQUFLOUUsV0FBTCxHQUFtQixLQUFLVSxPQUFMLENBQWFmLEtBQXpDO2VBQ0tlLE9BQUwsQ0FBYWYsS0FBYixHQUFxQixLQUFLSyxXQUExQjtlQUNLVSxPQUFMLENBQWFkLE1BQWIsR0FBc0IsS0FBS2MsT0FBTCxDQUFhZCxNQUFiLEdBQXNCa0YsRUFBNUM7OztZQUdFLEtBQUtwRSxPQUFMLENBQWFkLE1BQWIsR0FBc0IsS0FBS0ssWUFBL0IsRUFBNkM7Y0FDdkM2RSxNQUFLLEtBQUs3RSxZQUFMLEdBQW9CLEtBQUtTLE9BQUwsQ0FBYWQsTUFBMUM7ZUFDS2MsT0FBTCxDQUFhZCxNQUFiLEdBQXNCLEtBQUtLLFlBQTNCO2VBQ0tTLE9BQUwsQ0FBYWYsS0FBYixHQUFxQixLQUFLZSxPQUFMLENBQWFmLEtBQWIsR0FBcUJtRixHQUExQzs7YUFFR1AseUJBQUw7O1dBRUdwQixJQUFMO0tBL0tLO1FBQUEsa0JBa0xDO1VBQ0Y5QyxNQUFNLEtBQUtBLEdBQWY7VUFDSSxDQUFDLEtBQUtJLEdBQVYsRUFBZTtxQkFDeUIsS0FBS0MsT0FIdkM7VUFHQWdDLE1BSEEsWUFHQUEsTUFIQTtVQUdRQyxNQUhSLFlBR1FBLE1BSFI7VUFHZ0JoRCxLQUhoQixZQUdnQkEsS0FIaEI7VUFHdUJDLE1BSHZCLFlBR3VCQSxNQUh2Qjs7VUFJRmlCLFNBQUosQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLEtBQUtiLFdBQXpCLEVBQXNDLEtBQUtDLFlBQTNDO1VBQ0k4RSxTQUFKLENBQWMsS0FBS3RFLEdBQW5CLEVBQXdCaUMsTUFBeEIsRUFBZ0NDLE1BQWhDLEVBQXdDaEQsS0FBeEMsRUFBK0NDLE1BQS9DO0tBdkxLO21CQUFBLDZCQTBMWTtVQUNiLENBQUMsS0FBS2EsR0FBVixFQUFlLE9BQU8sRUFBUDthQUNSLEtBQUs3QixNQUFMLENBQVlvRyxTQUFaLEVBQVA7OztDQWpRTjs7QUMxQ0EsSUFBTUMsWUFBWTtXQUNQLGlCQUFVQyxHQUFWLEVBQWVDLE9BQWYsRUFBd0I7UUFDM0JDLFNBQUosQ0FBYyxRQUFkLEVBQXdCQyxPQUF4Qjs7Q0FGSjs7Ozs7Ozs7In0=
