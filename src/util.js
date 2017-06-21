export default {
  onePointCoord(point, vm) {
    let { canvas, quality } = vm
    let rect = canvas.getBoundingClientRect()
    let clientX = point.clientX
    let clientY = point.clientY
    return {
      x: (clientX - rect.left) * quality,
      y: (clientY - rect.top) * quality
    }
  },

  getPointerCoords(evt, vm) {
    let pointer = evt.touches ? evt.touches[0] : evt
    return this.onePointCoord(pointer, vm)
  },

  getPinchDistance(evt, vm) {
    let pointer1 = evt.touches[0]
    let pointer2 = evt.touches[1]
    let coord1 = this.onePointCoord(pointer1, vm)
    let coord2 = this.onePointCoord(pointer2, vm)

    return Math.sqrt(Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2))
  },

  getPinchCenterCoord(evt, vm) {
    let pointer1 = evt.touches[0]
    let pointer2 = evt.touches[1]
    let coord1 = this.onePointCoord(pointer1, vm)
    let coord2 = this.onePointCoord(pointer2, vm)

    return {
      x: (coord1.x + coord2.x) / 2,
      y: (coord1.y + coord2.y) / 2
    }
  },

  imageLoaded(img) {
    return img.complete && img.naturalWidth !== 0
  },

  rAFPolyfill() {
    // rAF polyfill
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
  }
}