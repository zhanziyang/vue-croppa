import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

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

  await viewport.locator('input[type=file]').setInputFiles({
    name: 'sample.png', mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==', 'base64'),
  })
  await expect.poll(async () => (await readState())?.crop?.width).toBeGreaterThan(0)
  await expect(page.getByTestId('events')).toContainText('file-choose')
  await expect(page.getByTestId('events')).toContainText('new-image')
})

test('two touch points zoom the real component', async ({ page }) => {
  await page.goto('v2-lab')
  const canvas = page.getByTestId('v2-viewport').locator('canvas')
  await expect(page.getByTestId('events')).toContainText('initial-image-loaded')
  const readWidth = async () => JSON.parse((await page.getByTestId('state-json').textContent()) || 'null')?.crop?.width
  const before = await readWidth()
  const box = (await canvas.boundingBox())!
  const session = await page.context().newCDPSession(page)
  const point = (id: number, offset: number) => ({ id, x: box.x + box.width / 2 + offset, y: box.y + box.height / 2 })
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(1, -30), point(2, 30)] })
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(1, -55), point(2, 55)] })
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect.poll(readWidth).toBeLessThan(before)
})
