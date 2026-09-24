import { describe, expect, it } from 'vitest'
import {
  constrainCropToSource,
  createCropState,
  createInitialCrop,
  cropToPixels,
  flipCropState,
  getZoomLevel,
  limitZoomFactor,
  moveCrop,
  rotateCropState,
  ZOOM_LEVEL_LIMITS,
  zoomCrop,
} from '../src'

describe('createInitialCrop', () => {
  it('selects the whole image when no aspect ratio is requested', () => {
    expect(createInitialCrop({ width: 1600, height: 900 })).toEqual({
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    })
  })

  it('creates a centered cover crop for a landscape image', () => {
    expect(createInitialCrop({ width: 1600, height: 900 }, 1)).toEqual({
      x: 0.21875,
      y: 0,
      width: 0.5625,
      height: 1,
    })
  })

  it('represents contain mode with out-of-bounds crop coordinates', () => {
    expect(
      createInitialCrop(
        { width: 1200, height: 800 },
        { aspectRatio: 1, initialSize: 'contain' },
      ),
    ).toEqual({
      x: 0,
      y: -0.25,
      width: 1,
      height: 1.5,
    })
  })

  it('represents natural size against the viewport', () => {
    expect(
      createInitialCrop(
        { width: 1200, height: 800 },
        {
          viewport: { width: 300, height: 300 },
          initialSize: 'natural',
        },
      ),
    ).toEqual({
      x: 0.375,
      y: 0.3125,
      width: 0.25,
      height: 0.375,
    })
  })

  it('preserves legacy initial positioning semantics', () => {
    expect(
      createInitialCrop(
        { width: 1200, height: 800 },
        { aspectRatio: 1, initialSize: 'contain', initialPosition: 'top left' },
      ),
    ).toEqual({
      x: 0,
      y: 0,
      width: 1,
      height: 1.5,
    })

    expect(
      createInitialCrop(
        { width: 1200, height: 800 },
        { aspectRatio: 1, initialSize: 'contain', initialPosition: '100% 100%' },
      ),
    ).toEqual({
      x: 0,
      y: -0.5,
      width: 1,
      height: 1.5,
    })
  })

  it('forces cover when whitespace prevention is enabled, matching v1', () => {
    const crop = createInitialCrop(
      { width: 1200, height: 800 },
      {
        aspectRatio: 1,
        initialSize: 'contain',
        preventWhiteSpace: true,
      },
    )

    expect(crop.x).toBeCloseTo(1 / 6, 12)
    expect(crop.y).toBe(0)
    expect(crop.width).toBeCloseTo(2 / 3, 12)
    expect(crop.height).toBe(1)
  })
})

describe('crop transforms', () => {
  it('allows whitespace by default, matching v1 default behavior', () => {
    const crop = { x: 0.25, y: 0.25, width: 0.5, height: 0.5 }

    expect(moveCrop(crop, { x: 1, y: -1 })).toEqual({
      x: 1.25,
      y: -0.75,
      width: 0.5,
      height: 0.5,
    })
  })

  it('clamps movement only when preventWhiteSpace is enabled', () => {
    const crop = { x: 0.25, y: 0.25, width: 0.5, height: 0.5 }

    expect(moveCrop(crop, { x: 1, y: -1 }, { preventWhiteSpace: true })).toEqual({
      x: 0.5,
      y: 0,
      width: 0.5,
      height: 0.5,
    })
  })

  it('zooms around the crop center without changing its center', () => {
    expect(zoomCrop({ x: 0.25, y: 0.25, width: 0.5, height: 0.5 }, 2)).toEqual({
      x: 0.375,
      y: 0.375,
      width: 0.25,
      height: 0.25,
    })
  })

  it('allows zoom-out to reveal whitespace by default', () => {
    expect(zoomCrop({ x: 0, y: 0, width: 1, height: 1 }, 0.5)).toEqual({
      x: -0.5,
      y: -0.5,
      width: 2,
      height: 2,
    })
  })

  it('preserves aspect ratio at source bounds when whitespace prevention is enabled', () => {
    const initial = createInitialCrop({ width: 1200, height: 800 }, 1)
    const zoomedOut = zoomCrop(initial, 0.5, undefined, { preventWhiteSpace: true })

    expect(zoomedOut.x).toBeCloseTo(initial.x, 10)
    expect(zoomedOut.y).toBeCloseTo(initial.y, 10)
    expect(zoomedOut.width).toBeCloseTo(initial.width, 10)
    expect(zoomedOut.height).toBeCloseTo(initial.height, 10)
    expect(zoomedOut.width / zoomedOut.height).toBeCloseTo(initial.width / initial.height, 10)
  })

  it('constrains an out-of-bounds crop without distorting its aspect ratio', () => {
    const constrained = constrainCropToSource({
      x: -0.4,
      y: -0.2,
      width: 1.2,
      height: 1.8,
    })

    expect(constrained.width / constrained.height).toBeCloseTo(1.2 / 1.8, 12)
    expect(constrained.x).toBeGreaterThanOrEqual(0)
    expect(constrained.y).toBeGreaterThanOrEqual(0)
    expect(constrained.x + constrained.width).toBeLessThanOrEqual(1)
    expect(constrained.y + constrained.height).toBeLessThanOrEqual(1)
  })

  it('maps crop coordinates through clockwise rotation', () => {
    const state = {
      crop: { x: 0.1, y: 0.2, width: 0.3, height: 0.4 },
      rotation: 0 as const,
      flipX: false,
      flipY: false,
    }

    expect(rotateCropState(state, 90)).toEqual({
      crop: { x: 0.4, y: 0.1, width: 0.4, height: 0.3 },
      rotation: 90,
      flipX: false,
      flipY: false,
    })
  })

  it('preserves whitespace through rotation', () => {
    const state = {
      crop: { x: -0.2, y: 0.1, width: 1.3, height: 0.8 },
      rotation: 0 as const,
      flipX: false,
      flipY: false,
    }

    expect(rotateCropState(state, 90).crop).toEqual({
      x: 0.1,
      y: -0.2,
      width: 0.8,
      height: 1.3,
    })
  })

  it('returns to the same crop after four quarter turns', () => {
    const state = createCropState({ width: 1600, height: 900 }, 1)
    const rotated = [1, 2, 3, 4].reduce((current) => rotateCropState(current, 90), state)

    expect(rotated).toEqual(state)
  })

  it('returns to the same state after flipping the same axis twice', () => {
    const state = createCropState({ width: 1600, height: 900 }, 1)
    expect(flipCropState(flipCropState(state, 'x'), 'x')).toEqual(state)
    expect(flipCropState(flipCropState(state, 'y'), 'y')).toEqual(state)
  })
})

describe('cropToPixels', () => {
  it('converts normalized crop coordinates to oriented source pixels', () => {
    expect(
      cropToPixels(
        { x: 0.25, y: 0.1, width: 0.5, height: 0.8 },
        { width: 1200, height: 800 },
        90,
      ),
    ).toEqual({
      x: 200,
      y: 120,
      width: 400,
      height: 960,
    })
  })

  it('preserves out-of-bounds pixel coordinates when whitespace is visible', () => {
    expect(
      cropToPixels(
        { x: -0.1, y: -0.25, width: 1.2, height: 1.5 },
        { width: 1200, height: 800 },
      ),
    ).toEqual({
      x: -120,
      y: -200,
      width: 1440,
      height: 1200,
    })
  })
})

describe('zoom limits', () => {
  const source = { width: 1600, height: 900 }
  const viewport = { width: 400, height: 400 }

  it('measures zoom relative to the cover fit', () => {
    const cover = createInitialCrop(source, { viewport, initialSize: 'cover' })
    const contain = createInitialCrop(source, { viewport, initialSize: 'contain' })
    expect(getZoomLevel(cover, source, viewport)).toBeCloseTo(1, 12)
    expect(getZoomLevel(contain, source, viewport)).toBeCloseTo(900 / 1600, 12)
    expect(getZoomLevel(zoomCrop(cover, 2), source, viewport)).toBeCloseTo(2, 12)
  })

  it('clamps a zoom step at the configured bounds', () => {
    expect(limitZoomFactor(1, 1.5, 0.1, 10)).toBe(1.5)
    expect(limitZoomFactor(8, 1.5, 0.1, 10)).toBeCloseTo(1.25, 12)
    expect(limitZoomFactor(10, 1.5, 0.1, 10)).toBe(1)
    expect(limitZoomFactor(0.12, 0.5, 0.1, 10)).toBeCloseTo(0.1 / 0.12, 12)
    expect(limitZoomFactor(0.1, 0.5, 0.1, 10)).toBe(1)
  })

  it('only moves an out-of-range level back toward the range', () => {
    expect(limitZoomFactor(20, 1.1, 0.1, 10)).toBe(1)
    expect(limitZoomFactor(20, 0.5, 0.1, 10)).toBe(0.5)
    expect(limitZoomFactor(0.01, 0.9, 0.1, 10)).toBe(1)
    expect(limitZoomFactor(0.01, 2, 0.1, 10)).toBe(2)
  })

  it('falls back to the hard limits for invalid or extreme bounds', () => {
    expect(limitZoomFactor(ZOOM_LEVEL_LIMITS.max, 2, 0.1, Infinity)).toBe(1)
    expect(limitZoomFactor(ZOOM_LEVEL_LIMITS.max, 2, 0.1, 1e12)).toBe(1)
    expect(limitZoomFactor(ZOOM_LEVEL_LIMITS.min, 0.5, Number.NaN, 10)).toBe(1)
    expect(limitZoomFactor(1, 2, 10, 0.1)).toBe(2)
    expect(limitZoomFactor(10, 2, 10, 0.1)).toBe(1)
  })

  it('keeps zoom in and out symmetric when repeatedly pushed past the limit', () => {
    let crop = createInitialCrop(source, { viewport })
    const start = crop
    for (let i = 0; i < 2000; i++) crop = zoomCrop(crop, limitZoomFactor(getZoomLevel(crop, source, viewport), 1.03, 0.1, 10))
    expect(getZoomLevel(crop, source, viewport)).toBeCloseTo(10, 9)
    for (let i = 0; i < 2000; i++) crop = zoomCrop(crop, limitZoomFactor(getZoomLevel(crop, source, viewport), 1 / 1.03, 0.1, 10))
    expect(getZoomLevel(crop, source, viewport)).toBeCloseTo(0.1, 9)
    while (getZoomLevel(crop, source, viewport) < 1 - 1e-9) {
      crop = zoomCrop(crop, limitZoomFactor(getZoomLevel(crop, source, viewport), Math.min(1.03, 1 / getZoomLevel(crop, source, viewport)), 0.1, 10))
    }
    expect(crop.width).toBeCloseTo(start.width, 9)
    expect(crop.x).toBeCloseTo(start.x, 9)
  })
})
