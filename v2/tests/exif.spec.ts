import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { readExifOrientation, relativeOrientation } from '../src/exif'

describe('EXIF orientation', () => {
  it('reads the orientation from a real JPEG file', async () => {
    const bytes = await readFile(new URL('../../site/tests/fixtures/exif-6.jpg', import.meta.url))
    const file = new File([new Uint8Array(bytes)], 'exif-6.jpg', { type: 'image/jpeg' })
    expect(await readExifOrientation(file)).toBe(6)
  })

  it('subtracts the orientation already applied by the browser', () => {
    expect(relativeOrientation(6, 6)).toEqual({ rotation: 0, flipX: false, flipY: false })
    expect(relativeOrientation(1, 6)).toEqual({ rotation: 90, flipX: false, flipY: false })
    expect(relativeOrientation(6, 1)).toEqual({ rotation: 270, flipX: false, flipY: false })
    for (let orientation = 1; orientation <= 8; orientation++) {
      expect(relativeOrientation(orientation, orientation)).toEqual({ rotation: 0, flipX: false, flipY: false })
    }
  })
})
