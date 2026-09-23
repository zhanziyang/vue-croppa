import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test('loading indicator follows a delayed real image load', async ({ page }) => {
  let release!: () => void
  const held = new Promise<void>((resolve) => { release = resolve })
  await page.route('**/demo-image.svg', async (route) => {
    await held
    await route.continue()
  })
  await page.goto('v2-lab', { waitUntil: 'domcontentloaded' })
  const viewport = page.getByTestId('v2-viewport')
  try {
    await expect(viewport.getByRole('status', { name: 'Loading image' })).toBeVisible()
    await page.getByTestId('show-loading').uncheck()
    await expect(viewport.getByRole('status', { name: 'Loading image' })).toHaveCount(0)
    await page.getByTestId('show-loading').check()
    await expect(viewport.getByRole('status', { name: 'Loading image' })).toBeVisible()
  } finally {
    release()
  }
  await expect(viewport.getByRole('status', { name: 'Loading image' })).toHaveCount(0)
  await expect(viewport.getByRole('button', { name: 'Remove image' })).toBeVisible()
})

test('v2 metadata restores crop and transform on the same source', async ({ page }) => {
  await page.goto('v2-lab')
  const readState = async () => JSON.parse((await page.getByTestId('state-json').textContent()) || 'null')
  await expect.poll(async () => (await readState())?.crop?.width).toBeGreaterThan(0)
  const canvas = page.getByTestId('v2-viewport').locator('canvas')
  const box = (await canvas.boundingBox())!
  await page.mouse.move(box.x + 160, box.y + 160)
  await page.mouse.wheel(0, -160)
  await page.getByTestId('rotate').click()
  await page.getByTestId('flip-x').click()
  const saved = await readState()
  await page.getByTestId('save-crop').click()
  await page.getByTestId('rotate').click()
  expect(await readState()).not.toEqual(saved)
  await page.getByTestId('restore-crop').click()
  expect(await readState()).toEqual(saved)
})

test('real v2 component keeps the viewport fixed and supports input, transforms, remove, and export', async ({ page }) => {
  await page.goto('v2-lab')
  const viewport = page.getByTestId('v2-viewport')
  const canvas = viewport.locator('canvas')
  const readState = async () => JSON.parse((await page.getByTestId('state-json').textContent()) || 'null')

  await expect(canvas).toBeVisible()
  await expect.poll(async () => (await readState())?.crop?.width).toBeGreaterThan(0)
  await expect(viewport.getByRole('button', { name: 'Remove image' })).toBeVisible()
  await expect(viewport.getByRole('button', { name: 'Remove image' })).toHaveCSS('width', '28px')
  await expect(viewport.getByRole('button', { name: 'Remove image' })).toHaveCSS('background-color', 'rgb(225, 29, 72)')
  await page.getByTestId('show-remove-button').uncheck()
  await expect(viewport.getByRole('button', { name: 'Remove image' })).toHaveCount(0)
  await page.getByTestId('show-remove-button').check()
  expect(await canvas.evaluate((element: HTMLCanvasElement) => [element.width, element.height])).toEqual([320, 320])
  const initial = await readState()
  const box = (await canvas.boundingBox())!
  const documentY = box.y + await page.evaluate(() => window.scrollY)

  await page.mouse.move(box.x + 160, box.y + 160)
  await page.mouse.wheel(0, -180)
  await expect.poll(async () => (await readState()).crop.width).toBeLessThan(initial.crop.width)

  await page.mouse.move(box.x + 160, box.y + 160)
  await page.mouse.down()
  await page.mouse.move(box.x + 300, box.y + 160, { steps: 8 })
  await page.mouse.up()
  await expect.poll(async () => (await readState()).crop.x).toBeLessThan(0)

  await page.getByTestId('prevent-whitespace').check()
  await expect.poll(async () => (await readState()).crop.x).toBeGreaterThanOrEqual(0)
  const constrained = await readState()
  expect(constrained.crop.x + constrained.crop.width).toBeLessThanOrEqual(1)

  await page.getByTestId('rotate').click()
  expect((await readState()).rotation).toBe(90)
  const beforeFlip = await readState()
  await page.getByTestId('flip-x').click()
  expect(await readState()).not.toEqual(beforeFlip)
  await page.getByTestId('flip-x').click()
  expect(await readState()).toEqual(beforeFlip)

  const download = page.waitForEvent('download')
  await page.getByTestId('download').click()
  const saved = await download
  expect(saved.suggestedFilename()).toBe('croppa-v2.png')
  const png = await readFile(await saved.path())
  const pixels = await canvas.evaluate(async (element: HTMLCanvasElement, base64) => {
    const exported = new Image()
    exported.src = `data:image/png;base64,${base64}`
    await exported.decode()
    const output = document.createElement('canvas')
    output.width = exported.naturalWidth
    output.height = exported.naturalHeight
    output.getContext('2d')!.drawImage(exported, 0, 0)
    const sample = (target: HTMLCanvasElement) => [...target.getContext('2d')!.getImageData(target.width / 2, target.height / 2, 1, 1).data]
    return { preview: sample(element), export: sample(output), size: [output.width, output.height] }
  }, png.toString('base64'))
  expect(pixels.size).toEqual([640, 640])
  pixels.preview.forEach((channel, index) => expect(Math.abs(channel - pixels.export[index])).toBeLessThanOrEqual(12))
  const afterBox = (await canvas.boundingBox())!
  expect(afterBox.y + await page.evaluate(() => window.scrollY)).toBeCloseTo(documentY, 4)
  expect(afterBox.width).toBeCloseTo(box.width, 4)

  await page.getByTestId('remove').click()
  await expect.poll(readState).toBeNull()
  await expect(viewport.getByText('Choose an image')).toBeVisible()
  await expect(viewport.getByRole('button', { name: 'Remove image' })).toHaveCount(0)

  await page.getByTestId('png-only').check()
  await page.getByTestId('limit-file-size').check()
  await viewport.locator('input[type=file]').setInputFiles({ name: 'wrong.jpg', mimeType: 'image/jpeg', buffer: Buffer.from([1, 2, 3]) })
  await expect.poll(readState).toBeNull()
  await viewport.locator('input[type=file]').setInputFiles({ name: 'large.png', mimeType: 'image/png', buffer: Buffer.alloc(1000000) })
  await expect.poll(readState).toBeNull()

  await viewport.locator('input[type=file]').setInputFiles({
    name: 'sample.png', mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==', 'base64'),
  })
  await expect.poll(async () => (await readState())?.crop?.width).toBeGreaterThan(0)
})

test('two touch points zoom the real component', async ({ page }) => {
  await page.goto('v2-lab')
  const canvas = page.getByTestId('v2-viewport').locator('canvas')
  const readWidth = async () => JSON.parse((await page.getByTestId('state-json').textContent()) || 'null')?.crop?.width
  await expect.poll(readWidth).toBeGreaterThan(0)
  const before = await readWidth()
  const box = (await canvas.boundingBox())!
  const session = await page.context().newCDPSession(page)
  const point = (id: number, offset: number) => ({ id, x: box.x + box.width / 2 + offset, y: box.y + box.height / 2 })
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(1, -30), point(2, 30)] })
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(1, -55), point(2, 55)] })
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect.poll(readWidth).toBeLessThan(before)
})

test('file drop follows the v1 replace rule and disabled gates', async ({ page }) => {
  await page.goto('v2-lab')
  const viewport = page.getByTestId('v2-viewport')
  const dropTarget = viewport.locator('.croppa-v2')
  const readState = async () => JSON.parse((await page.getByTestId('state-json').textContent()) || 'null')
  await expect.poll(async () => (await readState())?.crop?.width).toBeGreaterThan(0)
  const initial = await readState()
  const wideFile = await page.evaluateHandle(() => {
    const data = new DataTransfer()
    data.items.add(new File(['<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"/>'], 'wide.svg', { type: 'image/svg+xml' }))
    return data
  })
  const drop = async (dataTransfer: typeof wideFile) => {
    await dropTarget.dispatchEvent('dragenter', { dataTransfer })
    await dropTarget.dispatchEvent('dragover', { dataTransfer })
    await dropTarget.dispatchEvent('drop', { dataTransfer })
  }

  await drop(wideFile)
  expect(await readState()).toEqual(initial)

  await page.locator('summary', { hasText: 'Interaction options' }).click()
  await page.getByTestId('replace-drop').check()
  await dropTarget.dispatchEvent('dragenter', { dataTransfer: wideFile })
  await expect(dropTarget).toHaveClass(/croppa-v2--dropzone/)
  await drop(wideFile)
  await expect.poll(async () => (await readState()).crop.width).toBeLessThan(initial.crop.width)
  const replaced = await readState()

  const squareFile = await page.evaluateHandle(() => {
    const data = new DataTransfer()
    data.items.add(new File(['<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"/>'], 'square.svg', { type: 'image/svg+xml' }))
    return data
  })
  await page.getByTestId('disable-drag-and-drop').check()
  await drop(squareFile)
  expect(await readState()).toEqual(replaced)
  await page.getByTestId('disable-drag-and-drop').uncheck()
  await page.getByTestId('disabled').check()
  await drop(squareFile)
  expect(await readState()).toEqual(replaced)
  await page.getByTestId('disabled').uncheck()
  await drop(squareFile)
  await expect.poll(async () => (await readState()).crop.width).toBeGreaterThan(replaced.crop.width)
})

test('interaction flags and reverse wheel direction leave the other controls usable', async ({ page }) => {
  await page.goto('v2-lab')
  const canvas = page.getByTestId('v2-viewport').locator('canvas')
  const readState = async () => JSON.parse((await page.getByTestId('state-json').textContent()) || 'null')
  await expect.poll(async () => (await readState())?.crop?.width).toBeGreaterThan(0)
  await expect(page.locator('input[data-croppa-input="preview"]')).toHaveCount(1)
  await page.locator('summary', { hasText: 'Interaction options' }).click()
  const box = (await canvas.boundingBox())!
  const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 }

  await page.getByTestId('disabled').check()
  const initial = await readState()
  await expect(page.getByRole('button', { name: 'Remove image' })).toBeDisabled()
  await page.mouse.move(center.x, center.y)
  await page.mouse.wheel(0, -120)
  await page.getByTestId('rotate').click()
  expect(await readState()).toEqual(initial)
  await page.getByTestId('disabled').uncheck()

  await page.getByTestId('disable-drag-to-move').check()
  await page.mouse.move(center.x, center.y)
  await page.mouse.down()
  await page.mouse.move(center.x + 100, center.y, { steps: 4 })
  await page.mouse.up()
  expect(await readState()).toEqual(initial)
  await page.getByTestId('disable-drag-to-move').uncheck()

  await page.getByTestId('disable-scroll-to-zoom').check()
  await page.mouse.move(center.x, center.y)
  await page.mouse.wheel(0, -120)
  expect(await readState()).toEqual(initial)
  await page.getByTestId('disable-scroll-to-zoom').uncheck()
  await page.getByTestId('reverse-scroll-to-zoom').check()
  await canvas.scrollIntoViewIfNeeded()
  const reverseBox = (await canvas.boundingBox())!
  await page.mouse.move(reverseBox.x + reverseBox.width / 2, reverseBox.y + reverseBox.height / 2)
  await page.mouse.wheel(0, -120)
  await expect.poll(async () => (await readState()).crop.width).toBeGreaterThan(initial.crop.width)

  await page.getByTestId('disable-rotation').check()
  const beforeRotate = await readState()
  await page.getByTestId('rotate').click()
  await page.getByTestId('flip-x').click()
  expect(await readState()).toEqual(beforeRotate)

  await canvas.evaluate((element) => {
    const input = element.parentElement!.querySelector('input[type=file]')!
    const previewWindow = window as typeof window & { fileChooserClicks: number }
    previewWindow.fileChooserClicks = 0
    ;(input as HTMLInputElement).click = () => { previewWindow.fileChooserClicks += 1 }
  })
  const chooserClicks = () => page.evaluate(() => (window as typeof window & { fileChooserClicks?: number }).fileChooserClicks)
  await canvas.click()
  expect(await chooserClicks()).toBe(0)
  await page.getByTestId('remove').click()
  await canvas.click()
  expect(await chooserClicks()).toBe(1)
  await page.getByTestId('disable-click-to-choose').check()
  await canvas.click()
  expect(await chooserClicks()).toBe(1)
  await page.getByTestId('choose').click()
  expect(await chooserClicks()).toBe(2)
})

test('pinch zoom can be disabled independently', async ({ page }) => {
  await page.goto('v2-lab')
  const canvas = page.getByTestId('v2-viewport').locator('canvas')
  const readWidth = async () => JSON.parse((await page.getByTestId('state-json').textContent()) || 'null')?.crop?.width
  await expect.poll(readWidth).toBeGreaterThan(0)
  await page.locator('summary', { hasText: 'Interaction options' }).click()
  await page.getByTestId('disable-pinch-to-zoom').check()
  await canvas.scrollIntoViewIfNeeded()
  const before = await readWidth()
  const box = (await canvas.boundingBox())!
  const session = await page.context().newCDPSession(page)
  const point = (id: number, offset: number) => ({ id, x: box.x + box.width / 2 + offset, y: box.y + box.height / 2 })
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(1, -30), point(2, 30)] })
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(1, -55), point(2, 55)] })
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  expect(await readWidth()).toBeCloseTo(before, 10)
})
