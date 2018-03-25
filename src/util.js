import CanvasExifOrientation from 'canvas-exif-orientation'

export default {
  onePointCoord (point, vm) {
    let { canvas, quality } = vm
    let rect = canvas.getBoundingClientRect()
    let clientX = point.clientX
    let clientY = point.clientY
    return {
      x: (clientX - rect.left) * quality,
      y: (clientY - rect.top) * quality
    }
  },

  getPointerCoords (evt, vm) {
    let pointer
    if (evt.touches && evt.touches[0]) {
      pointer = evt.touches[0]
    } else if (evt.changedTouches && evt.changedTouches[0]) {
      pointer = evt.changedTouches[0]
    } else {
      pointer = evt
    }
    return this.onePointCoord(pointer, vm)
  },

  getPinchDistance (evt, vm) {
    let pointer1 = evt.touches[0]
    let pointer2 = evt.touches[1]
    let coord1 = this.onePointCoord(pointer1, vm)
    let coord2 = this.onePointCoord(pointer2, vm)

    return Math.sqrt(Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2))
  },

  getPinchCenterCoord (evt, vm) {
    let pointer1 = evt.touches[0]
    let pointer2 = evt.touches[1]
    let coord1 = this.onePointCoord(pointer1, vm)
    let coord2 = this.onePointCoord(pointer2, vm)

    return {
      x: (coord1.x + coord2.x) / 2,
      y: (coord1.y + coord2.y) / 2
    }
  },

  imageLoaded (img) {
    return img.complete && img.naturalWidth !== 0
  },

  rAFPolyfill () {
    // rAF polyfill
    if (typeof document == 'undefined' || typeof window == 'undefined') return
    var lastTime = 0
    var vendors = ['webkit', 'moz']
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
        window[vendors[x] + 'CancelRequestAnimationFrame']
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime()
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime))
        var id = window.setTimeout(function () {
          var arg = currTime + timeToCall
          callback(arg)
        }, timeToCall)
        lastTime = currTime + timeToCall
        return id
      }
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id)
      }
    }

    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]'
    }
  },

  toBlobPolyfill () {
    if (typeof document == 'undefined' || typeof window == 'undefined' || !HTMLCanvasElement) return
    var binStr, len, arr
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {
          binStr = atob(this.toDataURL(type, quality).split(',')[1])
          len = binStr.length
          arr = new Uint8Array(len)

          for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i)
          }

          callback(new Blob([arr], { type: type || 'image/png' }))
        }
      })
    }
  },

  eventHasFile (evt) {
    var dt = evt.dataTransfer || evt.originalEvent.dataTransfer
    if (dt.types) {
      for (var i = 0, len = dt.types.length; i < len; i++) {
        if (dt.types[i] == 'Files') {
          return true
        }
      }
    }

    return false
  },

  getFileOrientation (arrayBuffer) {
    var view = new DataView(arrayBuffer)
    if (view.getUint16(0, false) != 0xFFD8) return -2
    var length = view.byteLength
    var offset = 2
    while (offset < length) {
      var marker = view.getUint16(offset, false)
      offset += 2
      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) return -1
        var little = view.getUint16(offset += 6, false) == 0x4949
        offset += view.getUint32(offset + 4, little)
        var tags = view.getUint16(offset, little)
        offset += 2
        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + (i * 12), little) == 0x0112) {
            return view.getUint16(offset + (i * 12) + 8, little)
          }
        }
      } else if ((marker & 0xFF00) != 0xFF00) break
      else offset += view.getUint16(offset, false)
    }
    return -1
  },

  parseDataUrl (url) {
    const reg = /^data:([^;]+)?(;base64)?,(.*)/gmi
    return reg.exec(url)[3]
  },

  base64ToArrayBuffer (base64) {
    var binaryString = atob(base64)
    var len = binaryString.length
    var bytes = new Uint8Array(len)
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  },

  getRotatedImage (img, orientation) {
    var _canvas = CanvasExifOrientation.drawImage(img, orientation)
    var _img = new Image()
    _img.src = _canvas.toDataURL()
    return _img
  },

  flipX (ori) {
    if (ori % 2 == 0) {
      return ori - 1
    }

    return ori + 1
  },

  flipY (ori) {
    const map = {
      1: 4,
      4: 1,
      2: 3,
      3: 2,
      5: 8,
      8: 5,
      6: 7,
      7: 6
    }

    return map[ori]
  },

  rotate90 (ori) {
    const map = {
      1: 6,
      2: 7,
      3: 8,
      4: 5,
      5: 2,
      6: 3,
      7: 4,
      8: 1
    }

    return map[ori]
  },

  numberValid (n) {
    return typeof n === 'number' && !isNaN(n)
  }
}