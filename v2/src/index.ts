export interface Size {
  width: number
  height: number
}

export interface Point {
  x: number
  y: number
}

/** A source-relative rectangle using normalized coordinates in the range 0..1. */
export interface NormalizedRect {
  x: number
  y: number
  width: number
  height: number
}

export type Rotation = 0 | 90 | 180 | 270

/** Serializable, viewport-independent crop state. */
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
    throw new RangeError(`${name} must have finite width and height greater than 0`)
  }
}

export function normalizeRotation(rotation: number): Rotation {
  const normalized = ((rotation % 360) + 360) % 360

  if (normalized === 0 || normalized === 90 || normalized === 180 || normalized === 270) {
    return normalized
  }

  throw new RangeError('rotation must be a multiple of 90 degrees')
}

export function getOrientedSize(source: Size, rotation: Rotation): Size {
  assertSize(source, 'source')

  return rotation === 90 || rotation === 270
    ? { width: source.height, height: source.width }
    : { width: source.width, height: source.height }
}

export function clampRect(rect: NormalizedRect): NormalizedRect {
  const width = clampFiniteDimension(rect.width)
  const height = clampFiniteDimension(rect.height)

  return {
    x: clampFiniteCoordinate(rect.x, 1 - width),
    y: clampFiniteCoordinate(rect.y, 1 - height),
    width,
    height,
  }
}

/**
 * Create the largest centered crop that fits inside the source while matching
 * the requested output aspect ratio. Without an aspect ratio, select all.
 */
export function createInitialCrop(source: Size, aspectRatio?: number): NormalizedRect {
  assertSize(source, 'source')

  if (aspectRatio === undefined) {
    return { x: 0, y: 0, width: 1, height: 1 }
  }

  if (!Number.isFinite(aspectRatio) || aspectRatio <= 0) {
    throw new RangeError('aspectRatio must be a finite number greater than 0')
  }

  const sourceRatio = source.width / source.height

  if (Math.abs(sourceRatio - aspectRatio) <= EPSILON) {
    return { x: 0, y: 0, width: 1, height: 1 }
  }

  if (sourceRatio > aspectRatio) {
    const width = aspectRatio / sourceRatio
    return { x: stabilize((1 - width) / 2), y: 0, width: stabilize(width), height: 1 }
  }

  const height = sourceRatio / aspectRatio
  return { x: 0, y: stabilize((1 - height) / 2), width: 1, height: stabilize(height) }
}

export function createCropState(source: Size, aspectRatio?: number): CropState {
  return {
    crop: createInitialCrop(source, aspectRatio),
    rotation: 0,
    flipX: false,
    flipY: false,
  }
}

/** Move a crop by normalized source-image deltas. */
export function moveCrop(rect: NormalizedRect, delta: Point): NormalizedRect {
  const current = clampRect(rect)

  return {
    ...current,
    x: stabilize(clamp(current.x + finiteOrZero(delta.x), 0, 1 - current.width)),
    y: stabilize(clamp(current.y + finiteOrZero(delta.y), 0, 1 - current.height)),
  }
}

/** factor > 1 zooms in; factor < 1 zooms out. */
export function zoomCrop(
  rect: NormalizedRect,
  factor: number,
  anchor: Point = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
): NormalizedRect {
  if (!Number.isFinite(factor) || factor <= 0) {
    throw new RangeError('zoom factor must be a finite number greater than 0')
  }

  const current = clampRect(rect)
  const anchorX = clamp(finiteOrZero(anchor.x), current.x, current.x + current.width)
  const anchorY = clamp(finiteOrZero(anchor.y), current.y, current.y + current.height)
  const relativeX = current.width <= EPSILON ? 0.5 : (anchorX - current.x) / current.width
  const relativeY = current.height <= EPSILON ? 0.5 : (anchorY - current.y) / current.height
  const nextWidth = clamp(current.width / factor, EPSILON, 1)
  const nextHeight = clamp(current.height / factor, EPSILON, 1)

  return clampRect({
    x: anchorX - nextWidth * relativeX,
    y: anchorY - nextHeight * relativeY,
    width: nextWidth,
    height: nextHeight,
  })
}

/** Rotate clockwise while preserving the selected source region. */
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
      crop: clampRect({
        x: 1 - y - height,
        y: x,
        width: height,
        height: width,
      }),
    }
  }

  return next
}

/** Flip in the currently visible x or y axis. */
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
        ? clampRect({ x: 1 - x - width, y, width, height })
        : clampRect({ x, y: 1 - y - height, width, height }),
  }
}

export function cropToPixels(
  crop: NormalizedRect,
  source: Size,
  rotation: Rotation = 0,
): PixelRect {
  const oriented = getOrientedSize(source, rotation)
  const rect = clampRect(crop)

  return {
    x: rect.x * oriented.width,
    y: rect.y * oriented.height,
    width: rect.width * oriented.width,
    height: rect.height * oriented.height,
  }
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

function clampFiniteDimension(value: number): number {
  if (!Number.isFinite(value)) return 1
  return stabilize(clamp(value, EPSILON, 1))
}

function clampFiniteCoordinate(value: number, max: number): number {
  if (!Number.isFinite(value)) return 0
  return stabilize(clamp(value, 0, Math.max(0, max)))
}

function stabilize(value: number): number {
  return Number(value.toFixed(12))
}
