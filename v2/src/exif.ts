import type { Rotation } from './index'

export interface OrientationTransform {
  rotation: Rotation
  flipX: boolean
  flipY: boolean
}

const orientations: Record<number, OrientationTransform> = {
  1: { rotation: 0, flipX: false, flipY: false },
  2: { rotation: 0, flipX: true, flipY: false },
  3: { rotation: 180, flipX: false, flipY: false },
  4: { rotation: 0, flipX: false, flipY: true },
  5: { rotation: 90, flipX: false, flipY: true },
  6: { rotation: 90, flipX: false, flipY: false },
  7: { rotation: 90, flipX: true, flipY: false },
  8: { rotation: 270, flipX: false, flipY: false },
}

function point(x: number, y: number, transform: OrientationTransform) {
  if (transform.flipX) x = 1 - x
  if (transform.flipY) y = 1 - y
  switch (transform.rotation) {
    case 0: return { x, y }
    case 90: return { x: 1 - y, y: x }
    case 180: return { x: 1 - x, y: 1 - y }
    case 270: return { x: y, y: 1 - x }
  }
}

/** Transformation still needed after the browser has applied the source EXIF orientation. */
export function relativeOrientation(source: number, target: number): OrientationTransform {
  const sourceTransform = orientations[source]
  const targetTransform = orientations[target]
  if (!sourceTransform || !targetTransform) throw new RangeError('Invalid EXIF orientation')
  for (const candidate of Object.values(orientations)) {
    if ([[0, 0], [1, 0], [0, 1]].every(([x, y]) => {
      const current = point(x, y, sourceTransform)
      const actual = point(current.x, current.y, candidate)
      const expected = point(x, y, targetTransform)
      return actual.x === expected.x && actual.y === expected.y
    })) return candidate
  }
  throw new Error('Unable to transform EXIF orientation')
}

export async function readExifOrientation(file: File): Promise<number> {
  if (file.type !== 'image/jpeg') return 1
  const buffer = await file.slice(0, 65536).arrayBuffer()
  const view = new DataView(buffer)
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return 1
  let offset = 2
  while (offset + 4 <= view.byteLength) {
    const marker = view.getUint16(offset)
    const length = view.getUint16(offset + 2)
    if (length < 2 || offset + 2 + length > view.byteLength) break
    if (marker === 0xffe1 && length >= 16 && view.getUint32(offset + 4) === 0x45786966) {
      const tiff = offset + 10
      const little = view.getUint16(tiff) === 0x4949
      if (!little && view.getUint16(tiff) !== 0x4d4d) return 1
      const directory = tiff + view.getUint32(tiff + 4, little)
      if (directory + 2 > view.byteLength) return 1
      const count = view.getUint16(directory, little)
      for (let index = 0; index < count; index++) {
        const entry = directory + 2 + index * 12
        if (entry + 12 > view.byteLength) return 1
        if (view.getUint16(entry, little) === 0x0112) {
          const orientation = view.getUint16(entry + 8, little)
          return orientation >= 1 && orientation <= 8 ? orientation : 1
        }
      }
    }
    offset += 2 + length
  }
  return 1
}
