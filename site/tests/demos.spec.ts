import { expect, test } from '@playwright/test'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const fixture = resolve(here, '../public/demo-image.svg')

async function openReadyDemo(page, path) {
  await page.goto(path)
  await page.waitForFunction(() => window.__demoReady === true)
}

test('basic demo loads a real image and changes scale', async ({ page }) => {
  await openReadyDemo(page, 'demos/basic.html')

  const before = await page.evaluate(() => window.__croppa.getMetadata())
  expect(before.scale).toBeGreaterThan(0)
  expect(await page.evaluate(() => window.__croppa.hasImage())).toBe(true)

  const removeButtonGeometry = await page.evaluate(() => {
    const container = document.querySelector('.croppa-container')
    const button = document.querySelector('.croppa-container .icon-remove')
    const containerRect = container.getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()

    return {
      overflow: getComputedStyle(container).overflow,
      extendsAbove: buttonRect.top < containerRect.top,
      extendsRight: buttonRect.right > containerRect.right,
    }
  })

  expect(removeButtonGeometry.overflow).toBe('visible')
  expect(removeButtonGeometry.extendsAbove).toBe(true)
  expect(removeButtonGeometry.extendsRight).toBe(true)

  await page.locator('#zoom-in').click()
  await expect.poll(() => page.evaluate(() => window.__croppa.getMetadata().scale)).toBeGreaterThan(before.scale)
})

test('input demo loads and removes a real local file', async ({ page }) => {
  await page.goto('demos/input.html')
  await page.waitForFunction(() => window.__demoMounted === true)

  await page.locator('input[type=file]').setInputFiles(fixture)
  await page.waitForFunction(() => window.__demoReady === true)

  const events = await page.evaluate(() => window.__events)
  expect(events).toEqual(expect.arrayContaining(['file-choose', 'new-image', 'new-image-drawn']))
  expect(await page.evaluate(() => window.__croppa.hasImage())).toBe(true)

  await page.locator('#remove').click()
  await expect.poll(() => page.evaluate(() => window.__croppa.hasImage())).toBe(false)
})

test('manipulation demo zooms and rotates', async ({ page }) => {
  await openReadyDemo(page, 'demos/manipulation.html')

  const before = await page.evaluate(() => window.__croppa.getMetadata())

  await page.locator('#zoom-in').click()
  await expect.poll(() => page.evaluate(() => window.__croppa.getMetadata().scale)).toBeGreaterThan(before.scale)

  await page.locator('#rotate').click()
  await expect.poll(() => page.evaluate(() => window.__croppa.getMetadata().orientation)).not.toBe(before.orientation)
})

test('output demo creates Blob and data URL output', async ({ page }) => {
  await openReadyDemo(page, 'demos/output.html')

  await page.locator('#blob').click()
  await page.waitForFunction(() => !!window.__lastBlob)
  const blob = await page.evaluate(() => window.__lastBlob)
  expect(blob.type).toBe('image/png')
  expect(blob.size).toBeGreaterThan(1000)

  await page.locator('#data-url').click()
  await page.waitForFunction(() => typeof window.__lastDataUrl === 'string')
  expect(await page.evaluate(() => window.__lastDataUrl.startsWith('data:image/png;base64,'))).toBe(true)
})

test('metadata demo round-trips saved crop metadata', async ({ page }) => {
  await openReadyDemo(page, 'demos/metadata.html')

  await page.locator('#save').click()
  const saved = await page.evaluate(() => window.__savedMetadata)

  await page.locator('#change').click()
  await expect.poll(() => page.evaluate(() => window.__croppa.getMetadata().scale)).not.toBe(saved.scale)

  await page.locator('#restore').click()
  await page.waitForFunction(() => !!window.__restoredMetadata)
  const restored = await page.evaluate(() => window.__restoredMetadata)

  expect(restored.orientation).toBe(saved.orientation)
  expect(restored.scale).toBeCloseTo(saved.scale, 8)
  expect(restored.startX).toBeCloseTo(saved.startX, 8)
  expect(restored.startY).toBeCloseTo(saved.startY, 8)
})

test('passive preview renders a second synchronized cropper', async ({ page }) => {
  await openReadyDemo(page, 'demos/preview.html')
  await expect(page.locator('canvas')).toHaveCount(2)

  const before = await page.evaluate(() => window.__croppa.scaleRatio)
  await page.locator('#zoom').click()
  await expect.poll(() => page.evaluate(() => window.__croppa.scaleRatio)).toBeGreaterThan(before)
})

test('rounded output produces a real PNG', async ({ page }) => {
  await openReadyDemo(page, 'demos/rounded.html')

  await page.locator('#generate').click()
  await page.waitForFunction(() => !!window.__lastBlob)

  expect(await page.evaluate(() => window.__lastBlob.type)).toBe('image/png')
  expect(await page.evaluate(() => window.__lastBlob.size)).toBeGreaterThan(1000)
  await expect(page.locator('#rounded-preview')).toBeVisible()
})

test('adapted legacy simple-test harness still initializes core functions', async ({ page }) => {
  await page.goto('demos/simple-test.html')
  await page.waitForFunction(() => !!window.croppa && window.croppa.hasImage(), null, { timeout: 15_000 })

  const result = await page.evaluate(() => {
    const before = window.croppa.getMetadata()
    window.croppa.zoomIn()
    window.croppa.moveLeftwards(5)
    const after = window.croppa.getMetadata()

    return {
      hasImage: window.croppa.hasImage(),
      before,
      after,
      hasBlobMethod: typeof window.croppa.promisedBlob === 'function',
      hasRotateMethod: typeof window.croppa.rotate === 'function',
    }
  })

  expect(result.hasImage).toBe(true)
  expect(result.hasBlobMethod).toBe(true)
  expect(result.hasRotateMethod).toBe(true)
  expect(result.after.scale).toBeGreaterThan(result.before.scale)
})

test('zoom slider changes the real scale state', async ({ page }) => {
  await openReadyDemo(page, 'demos/zoom-slider.html')
  const min = await page.locator('#zoom-range').getAttribute('min')
  const max = await page.locator('#zoom-range').getAttribute('max')
  const target = (Number(min) + Number(max)) / 2

  await page.locator('#zoom-range').evaluate((element, value) => {
    const input = element as HTMLInputElement
    input.value = String(value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }, target)

  await expect.poll(() => page.evaluate(() => window.__croppa.scaleRatio)).toBeCloseTo(target, 2)
})

test('responsive demo updates auto-sized dimensions', async ({ page }) => {
  await openReadyDemo(page, 'demos/responsive.html')
  await page.locator('#large').click()

  await expect.poll(() => page.evaluate(() => Math.round(window.__actualSize.width))).toBe(400)
  await expect.poll(() => page.evaluate(() => Math.round(window.__actualSize.height))).toBe(300)
})

test('draw attachment hook runs and exports a PNG', async ({ page }) => {
  await openReadyDemo(page, 'demos/attachment.html')
  expect(await page.evaluate(() => window.__drawCount)).toBeGreaterThan(0)

  await page.locator('#export').click()
  await page.waitForFunction(() => typeof window.__lastDataUrl === 'string')
  expect(await page.evaluate(() => window.__lastDataUrl.startsWith('data:image/png;base64,'))).toBe(true)
})

test('image placeholder is rendered before a file is chosen', async ({ page }) => {
  await page.goto('demos/placeholder.html')
  await page.waitForFunction(() => window.__demoMounted === true)
  await page.waitForFunction(() => typeof window.__placeholderData === 'string')

  expect(await page.evaluate(() => window.__placeholderData.startsWith('data:image/png;base64,'))).toBe(true)
  expect(await page.evaluate(() => window.__croppa.hasImage())).toBe(false)
})

test('custom loading emits start/end around a real local file', async ({ page }) => {
  await page.goto('demos/loading.html')
  await page.waitForFunction(() => window.__demoMounted === true)

  await page.locator('input[type=file]').setInputFiles(fixture)
  await page.waitForFunction(() => window.__demoReady === true)

  const events = await page.evaluate(() => window.__loadingEvents || [])
  expect(events).toEqual(expect.arrayContaining(['loading-start', 'loading-end']))
})

test('clip plugin makes the output corner transparent', async ({ page }) => {
  await openReadyDemo(page, 'demos/clip-plugin.html')
  expect(await page.evaluate(() => window.__cornerAlpha)).toBe(0)
})

test('initial slot honors explicit EXIF orientation', async ({ page }) => {
  await openReadyDemo(page, 'demos/exif.html')
  expect(await page.evaluate(() => window.__orientation)).toBe(6)
})

test('customization demo initializes with real component props', async ({ page }) => {
  await openReadyDemo(page, 'demos/customization.html')
  expect(await page.evaluate(() => window.__croppa.canvasColor)).toBe('#ffffff')

  await page.locator('#disabled-toggle').check()
  await expect.poll(() => page.evaluate(() => window.__croppa.disabled)).toBe(true)
})

test('upload recipe builds a real FormData file', async ({ page }) => {
  await openReadyDemo(page, 'demos/upload.html')
  await page.locator('#prepare-upload').click()
  await page.waitForFunction(() => !!window.__uploadPayload)

  const payload = await page.evaluate(() => window.__uploadPayload)
  expect(payload.hasFormData).toBe(true)
  expect(payload.name).toBe('crop.jpg')
  expect(payload.type).toBe('image/jpeg')
  expect(payload.size).toBeGreaterThan(1000)
})

test('download recipe creates a downloadable PNG data URL', async ({ page }) => {
  await openReadyDemo(page, 'demos/download.html')
  await page.locator('#prepare-download').click()
  await page.waitForFunction(() => typeof window.__downloadHref === 'string')

  expect(await page.evaluate(() => window.__downloadHref.startsWith('data:image/png;base64,'))).toBe(true)
  await expect(page.locator('#download-link')).toHaveAttribute('download', 'vue-croppa.png')
})
