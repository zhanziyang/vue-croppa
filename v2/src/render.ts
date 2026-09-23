import { assertSize, type CropState, type Point, type Size } from './index'

function transformPoint(point: Point, state: CropState): Point {
  const x = state.flipX ? 1 - point.x : point.x
  const y = state.flipY ? 1 - point.y : point.y
  switch (state.rotation) {
    case 0: return { x, y }
    case 90: return { x: 1 - y, y: x }
    case 180: return { x: 1 - x, y: 1 - y }
    case 270: return { x: y, y: 1 - x }
  }
}

/** Draw the exact fixed viewport, including its whitespace and background. */
export function renderCrop(
  canvas: HTMLCanvasElement,
  image: CanvasImageSource,
  source: Size,
  state: CropState,
  background = 'transparent',
): void {
  const context = canvas.getContext('2d')
  if (!context) throw new Error('2D canvas is unavailable')
  const { width, height } = canvas
  assertSize(source, 'source')
  const map = (x: number, y: number): Point => {
    const point = transformPoint({ x, y }, state)
    return {
      x: ((point.x - state.crop.x) / state.crop.width) * width,
      y: ((point.y - state.crop.y) / state.crop.height) * height,
    }
  }
  const origin = map(0, 0)
  const x = map(1, 0)
  const y = map(0, 1)

  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, width, height)
  if (background !== 'transparent') {
    context.fillStyle = background
    context.fillRect(0, 0, width, height)
  }
  context.setTransform(
    (x.x - origin.x) / source.width,
    (x.y - origin.y) / source.width,
    (y.x - origin.x) / source.height,
    (y.y - origin.y) / source.height,
    origin.x,
    origin.y,
  )
  context.drawImage(image, 0, 0, source.width, source.height)
  context.setTransform(1, 0, 0, 1, 0, 0)
}
