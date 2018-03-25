Number.isInteger =
  Number.isInteger ||
  function (value) {
    return (
      typeof value === 'number' &&
      isFinite(value) &&
      Math.floor(value) === value
    )
  }

var initialImageType = String
if (typeof window !== 'undefined' && window.Image) {
  initialImageType = [String, Image]
}

export default {
  value: Object,
  width: {
    type: Number,
    default: 200,
    validator: function (val) {
      return val > 0
    }
  },
  height: {
    type: Number,
    default: 200,
    validator: function (val) {
      return val > 0
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
    validator: function (val) {
      return val >= 0
    }
  },
  canvasColor: {
    default: 'transparent'
  },
  quality: {
    type: Number,
    default: 2,
    validator: function (val) {
      return val > 0
    }
  },
  zoomSpeed: {
    default: 3,
    type: Number,
    validator: function (val) {
      return val > 0
    }
  },
  accept: String,
  fileSizeLimit: {
    type: Number,
    default: 0,
    validator: function (val) {
      return val >= 0
    }
  },
  disabled: Boolean,
  disableDragAndDrop: Boolean,
  disableClickToChoose: Boolean,
  disableDragToMove: Boolean,
  disableScrollToZoom: Boolean,
  disablePinchToZoom: Boolean,
  disableRotation: Boolean,
  reverseScrollToZoom: Boolean,
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
  },
  initialImage: initialImageType,
  initialSize: {
    type: String,
    default: 'cover',
    validator: function (val) {
      return val === 'cover' || val === 'contain' || val === 'natural'
    }
  },
  initialPosition: {
    type: String,
    default: 'center',
    validator: function (val) {
      var valids = ['center', 'top', 'bottom', 'left', 'right']
      return (
        val.split(' ').every(word => {
          return valids.indexOf(word) >= 0
        }) || /^-?\d+% -?\d+%$/.test(val)
      )
    }
  },
  inputAttrs: Object,
  showLoading: Boolean,
  loadingSize: {
    type: Number,
    default: 20
  },
  loadingColor: {
    type: String,
    default: '#606060'
  },
  replaceDrop: Boolean,
  passive: Boolean,
  imageBorderRadius: {
    type: [Number, String],
    default: 0
  },
  autoSizing: Boolean,
  videoEnabled: Boolean,
}
