export default {
  getPointerCoords(evt, cropperVM) {
    let { canvas, quality } = cropperVM
    let rect = canvas.getBoundingClientRect()
    let clientX = evt.touches ? evt.touches[0].clientX : evt.clientX
    let clientY = evt.touches ? evt.touches[0].clientY : evt.clientY
    return {
      x: (clientX - rect.left) * quality,
      y: (clientY - rect.top) * quality
    }
  }
}