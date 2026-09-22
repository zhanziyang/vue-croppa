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
