export default {
  getPointerCoords(evt, canvas) {
    let rect = canvas.getBoundingClientRect()
    let clientX = evt.touches ? evt.touches[0].clientX : evt.clientX
    let clientY = evt.touches ? evt.touches[0].clientY : evt.clientY
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }
}