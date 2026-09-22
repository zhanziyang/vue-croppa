import { describe, expect, it } from 'vitest'
import {
  createCropState,
  createInitialCrop,
  cropToPixels,
  flipCropState,
  moveCrop,
  rotateCropState,
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

  it('creates the largest centered square crop for a landscape image', () => {
    expect(createInitialCrop({ width: 1600, height: 900 }, 1)).toEqual({
      x: 0.21875,
      y: 0,
      width: 0.5625,
      height: 1,
    })
  })

  it('creates the largest centered square crop for a portrait image', () => {
    expect(createInitialCrop({ width: 900, height: 1600 }, 1)).toEqual({
      x: 0,
      y: 0.21875,
      width: 1,
      height: 0.5625,
    })
  })
})

describe('crop transforms', () => {
  it('clamps movement to the source bounds', () => {
    const crop = { x: 0.25, y: 0.25, width: 0.5, height: 0.5 }

    expect(moveCrop(crop, { x: 1, y: -1 })).toEqual({
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
})
