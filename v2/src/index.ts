export interface Size {
  width: number
  height: number
}

export interface Point {
  x: number
  y: number
}

/**
 * Source-relative rectangle.
 *
 * x/y may be outside 0..1 and width/height may be greater than 1.
 * This is required to preserve v1's default behavior where whitespace may be
 * visible inside the fixed crop viewport.
 */
export interface NormalizedRect {
  x: number
  y: number
  width: number
  height: number
}

export type Rotation = 0 | 90 | 180 | 270
export type InitialSize = 'cover' | 'contain' | 'natural'

export interface CropOperationOptions {
  preventWhiteSpace?: boolean
}

export interface InitialCropOptions extends CropOperationOptions {
  aspectRatio?: number
  viewport?: Size
  initialSize?: InitialSize
  initialPosition?: string
}

export interface CropState {
  crop: NormalizedRect
  rotation: Rotation
  flipX: boolean
  flipY: boolean
}

export interface PixelRect {
  x: number
  y: number
  width: number
  height: number
}

const EPSILON = 1e-12
const ROTATIONS: Rotation[] = [0, 90, 180, 270]
const SAMPLE_POINTS: Point[] = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
]

type TransformState = Pick<CropState, 'rotation' | 'flipX' | 'flipY'>

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function assertSize(size: Size, name = 'size'): void {
  if (
    !Number.isFinite(size.width) ||
    !Number.isFinite(size.height) ||
    size.width <= 0 ||
    size.height <= 0
  ) {
    throw new RangeError(name + ' must have finite width and height greater than 0')
  }
}

export function normalizeRotation(rotation: number): Rotation {
  const normalized = ((rotation % 360) + 360) % 360

  if (normalized === 0 || normalized === 90 || normalized === 180 || normalized === 270) {
    return normalized
  }

  throw new RangeError('rotation must be a multiple of 90 degrees')
}

export function normalizeCropRect(rect: NormalizedRect): NormalizedRect {
  return {
    x: finiteOrZero(rect.x),
    y: finiteOrZero(rect.y),
    width: positiveFiniteDimension(rect.width),
    height: positiveFiniteDimension(rect.height),
  }
}

export function constrainCropToSource(rect: NormalizedRect): NormalizedRect {
  const current = normalizeCropRect(rect)
  const fitScale = Math.min(1, 1 / current.width, 1 / current.height)
  const width = stabilize(current.width * fitScale)
  const height = stabilize(current.height * fitScale)

  return {
    x: stabilize(clamp(current.x, 0, Math.max(0, 1 - width))),
    y: stabilize(clamp(current.y, 0, Math.max(0, 1 - height))),
    width,
    height,
  }
}

export function getOrientedSize(source: Size, rotation: Rotation): Size {
  assertSize(source, 'source')

  return rotation === 90 || rotation === 270
    ? { width: source.height, height: source.width }
    : { width: source.width, height: source.height }
}

export function createInitialCrop(
  source: Size,
  aspectRatioOrOptions?: number | InitialCropOptions,
): NormalizedRect {
  assertSize(source, 'source')

  const options: InitialCropOptions =
    typeof aspectRatioOrOptions === 'number'
      ? { aspectRatio: aspectRatioOrOptions }
      : { ...(aspectRatioOrOptions ?? {}) }

  if (options.viewport) assertSize(options.viewport, 'viewport')

  const aspectRatio =
    options.aspectRatio ??
    (options.viewport ? options.viewport.width / options.viewport.height : undefined)

  if (aspectRatio !== undefined && (!Number.isFinite(aspectRatio) || aspectRatio <= 0)) {
    throw new RangeError('aspectRatio must be a finite number greater than 0')
  }

  const initialSize: InitialSize = options.preventWhiteSpace
    ? 'cover'
    : options.initialSize ?? 'cover'

  let crop: NormalizedRect

  if (initialSize === 'natural') {
    if (!options.viewport) {
      throw new RangeError('viewport is required when initialSize is natural')
    }

    crop = {
      x: 0,
      y: 0,
      width: options.viewport.width / source.width,
      height: options.viewport.height / source.height,
    }
  } else if (aspectRatio === undefined) {
    crop = { x: 0, y: 0, width: 1, height: 1 }
  } else {
    const sourceRatio = source.width / source.height

    if (Math.abs(sourceRatio - aspectRatio) <= EPSILON) {
      crop = { x: 0, y: 0, width: 1, height: 1 }
    } else if (initialSize === 'cover') {
      crop =
        sourceRatio > aspectRatio
          ? { x: 0, y: 0, width: aspectRatio / sourceRatio, height: 1 }
          : { x: 0, y: 0, width: 1, height: sourceRatio / aspectRatio }
    } else {
      crop =
        sourceRatio > aspectRatio
          ? { x: 0, y: 0, width: 1, height: sourceRatio / aspectRatio }
          : { x: 0, y: 0, width: aspectRatio / sourceRatio, height: 1 }
    }
  }

  crop = positionInitialCrop(normalizeCropRect(crop), options.initialPosition ?? 'center')

  return options.preventWhiteSpace ? constrainCropToSource(crop) : crop
}

export function createCropState(
  source: Size,
  aspectRatioOrOptions?: number | InitialCropOptions,
): CropState {
  return {
    crop: createInitialCrop(source, aspectRatioOrOptions),
    rotation: 0,
    flipX: false,
    flipY: false,
  }
}

export function moveCrop(
  rect: NormalizedRect,
  delta: Point,
  options: CropOperationOptions = {},
): NormalizedRect {
  const current = normalizeCropRect(rect)
  const moved = stabilizeRect({
    ...current,
    x: current.x + finiteOrZero(delta.x),
    y: current.y + finiteOrZero(delta.y),
  })

  return options.preventWhiteSpace ? constrainCropToSource(moved) : moved
}

export function zoomCrop(
  rect: NormalizedRect,
  factor: number,
  anchor: Point = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
  options: CropOperationOptions = {},
): NormalizedRect {
  if (!Number.isFinite(factor) || factor <= 0) {
    throw new RangeError('zoom factor must be a finite number greater than 0')
  }

  const current = normalizeCropRect(rect)
  const anchorX = clamp(finiteOrZero(anchor.x), current.x, current.x + current.width)
  const anchorY = clamp(finiteOrZero(anchor.y), current.y, current.y + current.height)
  const relativeX = (anchorX - current.x) / current.width
  const relativeY = (anchorY - current.y) / current.height
  const nextWidth = Math.max(EPSILON, current.width / factor)
  const nextHeight = Math.max(EPSILON, current.height / factor)

  const next = stabilizeRect({
    x: anchorX - nextWidth * relativeX,
    y: anchorY - nextHeight * relativeY,
    width: nextWidth,
    height: nextHeight,
  })

  return options.preventWhiteSpace ? constrainCropToSource(next) : next
}

export function rotateCropState(state: CropState, degrees: number): CropState {
  const step = normalizeRotation(degrees)
  let next = cloneState(state)

  for (let remaining = step; remaining > 0; remaining -= 90) {
    const { x, y, width, height } = next.crop
    const transform = composeTransform(
      next,
      { rotation: 90, flipX: false, flipY: false },
      {
        rotation: normalizeRotation(next.rotation + 90),
        flipX: next.flipX,
        flipY: next.flipY,
      },
    )

    next = {
      ...next,
      ...transform,
      crop: stabilizeRect({
        x: 1 - y - height,
        y: x,
        width: height,
        height: width,
      }),
    }
  }

  return next
}

export function flipCropState(state: CropState, axis: 'x' | 'y'): CropState {
  const { x, y, width, height } = state.crop
  const operation: TransformState = {
    rotation: 0,
    flipX: axis === 'x',
    flipY: axis === 'y',
  }
  const preferred: TransformState = {
    rotation: state.rotation,
    flipX: axis === 'x' ? !state.flipX : state.flipX,
    flipY: axis === 'y' ? !state.flipY : state.flipY,
  }
  const transform = composeTransform(state, operation, preferred)

  return {
    ...cloneState(state),
    ...transform,
    crop:
      axis === 'x'
        ? stabilizeRect({ x: 1 - x - width, y, width, height })
        : stabilizeRect({ x, y: 1 - y - height, width, height }),
  }
}

export function cropToPixels(
  crop: NormalizedRect,
  source: Size,
  rotation: Rotation = 0,
): PixelRect {
  const oriented = getOrientedSize(source, rotation)
  const rect = normalizeCropRect(crop)

  return {
    x: rect.x * oriented.width,
    y: rect.y * oriented.height,
    width: rect.width * oriented.width,
    height: rect.height * oriented.height,
  }
}

function positionInitialCrop(rect: NormalizedRect, position: string): NormalizedRect {
  let x = stabilize((1 - rect.width) / 2)
  let y = stabilize((1 - rect.height) / 2)

  const percentage = /^(-?\d+(?:\.\d+)?)% (-?\d+(?:\.\d+)?)%$/.exec(position)

  if (percentage) {
    x = stabilize((Number(percentage[1]) / 100) * (1 - rect.width))
    y = stabilize((Number(percentage[2]) / 100) * (1 - rect.height))
    return { ...rect, x, y }
  }

  if (/top/.test(position)) y = 0
  else if (/bottom/.test(position)) y = stabilize(1 - rect.height)

  if (/left/.test(position)) x = 0
  else if (/right/.test(position)) x = stabilize(1 - rect.width)

  return { ...rect, x, y }
}

function composeTransform(
  current: TransformState,
  operation: TransformState,
  preferred: TransformState,
): TransformState {
  const candidates: TransformState[] = []

  for (const rotation of ROTATIONS) {
    for (const flipX of [false, true]) {
      for (const flipY of [false, true]) {
        const candidate = { rotation, flipX, flipY }
        if (transformsEqual(candidate, current, operation)) candidates.push(candidate)
      }
    }
  }

  if (candidates.length === 0) throw new Error('Unable to compose crop transform')

  candidates.sort((a, b) => transformScore(a, preferred) - transformScore(b, preferred))
  return candidates[0]
}

function transformsEqual(
  candidate: TransformState,
  current: TransformState,
  operation: TransformState,
): boolean {
  return SAMPLE_POINTS.every((point) => {
    const expected = applyTransformPoint(applyTransformPoint(point, current), operation)
    const actual = applyTransformPoint(point, candidate)
    return Math.abs(expected.x - actual.x) <= EPSILON && Math.abs(expected.y - actual.y) <= EPSILON
  })
}

function applyTransformPoint(point: Point, transform: TransformState): Point {
  const x = transform.flipX ? 1 - point.x : point.x
  const y = transform.flipY ? 1 - point.y : point.y

  switch (transform.rotation) {
    case 0:
      return { x, y }
    case 90:
      return { x: 1 - y, y: x }
    case 180:
      return { x: 1 - x, y: 1 - y }
    case 270:
      return { x: y, y: 1 - x }
  }
}

function transformScore(candidate: TransformState, preferred: TransformState): number {
  const delta = Math.abs(candidate.rotation - preferred.rotation)
  const rotationDistance = Math.min(delta, 360 - delta) / 90

  return (
    rotationDistance * 4 +
    Number(candidate.flipX !== preferred.flipX) * 2 +
    Number(candidate.flipY !== preferred.flipY)
  )
}

function cloneState(state: CropState): CropState {
  return {
    crop: { ...state.crop },
    rotation: state.rotation,
    flipX: state.flipX,
    flipY: state.flipY,
  }
}

function finiteOrZero(value: number): number {
  return Number.isFinite(value) ? value : 0
}

function positiveFiniteDimension(value: number): number {
  if (!Number.isFinite(value)) return 1
  return Math.max(EPSILON, value)
}

function stabilizeRect(rect: NormalizedRect): NormalizedRect {
  return {
    x: stabilize(rect.x),
    y: stabilize(rect.y),
    width: stabilize(rect.width),
    height: stabilize(rect.height),
  }
}

function stabilize(value: number): number {
  return Number(value.toFixed(12))
}
