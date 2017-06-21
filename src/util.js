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
  }
}