import { expect, test } from '@playwright/test'

test('v2 foundation lab preserves WYSIWYG interaction and optional whitespace', async ({ page }) => {
  await page.goto('v2-lab')

  const viewport = page.getByTestId('v2-viewport')
  const imageLayer = page.getByTestId('v2-image-layer')
  const readState = async () =>
    JSON.parse((await page.getByTestId('state-json').textContent()) || '{}')

  await expect(viewport).toBeVisible()
  await expect(imageLayer).toBeVisible()
  await expect(page.locator('[data-testid="v2-crop"]')).toHaveCount(0)
  await expect(page.getByTestId('prevent-whitespace')).not.toBeChecked()

  const initial = await readState()
  expect(initial.crop.width / initial.crop.height).toBeCloseTo(2 / 3, 10)

  const viewportBox = await viewport.boundingBox()
  const initialScrollY = await page.evaluate(() => window.scrollY)
  const viewportDocumentY = viewportBox.y + initialScrollY

  await page.mouse.move(
    viewportBox.x + viewportBox.width * 0.7,
    viewportBox.y + viewportBox.height * 0.4,
  )
  await page.mouse.wheel(0, -180)
  await expect.poll(async () => (await readState()).crop.width).toBeLessThan(initial.crop.width)

  const zoomed = await readState()
  expect(zoomed.crop.width / zoomed.crop.height).toBeCloseTo(initial.crop.width / initial.crop.height, 10)

  await page.mouse.move(
    viewportBox.x + viewportBox.width / 2,
    viewportBox.y + viewportBox.height / 2,
  )
  await page.mouse.down()
  await page.mouse.move(
    viewportBox.x + viewportBox.width / 2 + viewportBox.width * 0.9,
    viewportBox.y + viewportBox.height / 2,
    { steps: 8 },
  )
  await page.mouse.up()

  const withWhitespace = await readState()
  expect(withWhitespace.crop.x).toBeLessThan(0)

  await page.getByTestId('prevent-whitespace').check()
  await expect.poll(async () => (await readState()).crop.x).toBeGreaterThanOrEqual(0)

  const constrained = await readState()
  expect(constrained.crop.x + constrained.crop.width).toBeLessThanOrEqual(1)
  expect(constrained.crop.y + constrained.crop.height).toBeLessThanOrEqual(1)

  const viewportAfter = await viewport.boundingBox()
  const finalScrollY = await page.evaluate(() => window.scrollY)
  expect(viewportAfter.y + finalScrollY).toBeCloseTo(viewportDocumentY, 4)
  expect(viewportAfter.width).toBeCloseTo(viewportBox.width, 4)
  expect(viewportAfter.height).toBeCloseTo(viewportBox.height, 4)

  await page.getByTestId('rotate').click()
  expect((await readState()).rotation).toBe(90)

  const beforeFlip = await readState()
  await page.getByTestId('flip-x').click()
  expect(await readState()).not.toEqual(beforeFlip)
  await page.getByTestId('flip-x').click()
  expect(await readState()).toEqual(beforeFlip)

  await page.getByTestId('reset').click()
  expect(await readState()).toEqual(initial)
})
