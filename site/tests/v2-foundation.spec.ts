import { expect, test } from '@playwright/test'

test('v2 foundation lab preserves the WYSIWYG interaction model', async ({ page }) => {
  await page.goto('v2-lab')

  const viewport = page.getByTestId('v2-viewport')
  const imageLayer = page.getByTestId('v2-image-layer')
  const readState = async () =>
    JSON.parse((await page.getByTestId('state-json').textContent()) || '{}')

  await expect(viewport).toBeVisible()
  await expect(imageLayer).toBeVisible()
  await expect(page.locator('[data-testid="v2-crop"]')).toHaveCount(0)

  const initial = await readState()
  expect(initial.crop.width / initial.crop.height).toBeCloseTo(2 / 3, 10)

  // Wheel zoom happens under the fixed viewport and preserves crop aspect ratio.
  const viewportBox = await viewport.boundingBox()
  await page.mouse.move(
    viewportBox.x + viewportBox.width * 0.7,
    viewportBox.y + viewportBox.height * 0.4,
  )
  await page.mouse.wheel(0, -180)

  await expect.poll(async () => (await readState()).crop.width).toBeLessThan(initial.crop.width)
  const zoomed = await readState()
  expect(zoomed.crop.width / zoomed.crop.height).toBeCloseTo(initial.crop.width / initial.crop.height, 10)

  // Dragging right moves the image right while the source selection moves left.
  const imageBefore = await imageLayer.boundingBox()
  await page.mouse.move(
    viewportBox.x + viewportBox.width / 2,
    viewportBox.y + viewportBox.height / 2,
  )
  await page.mouse.down()
  await page.mouse.move(
    viewportBox.x + viewportBox.width / 2 + 45,
    viewportBox.y + viewportBox.height / 2,
    { steps: 4 },
  )
  await page.mouse.up()

  const dragged = await readState()
  const imageAfter = await imageLayer.boundingBox()
  expect(dragged.crop.x).toBeLessThan(zoomed.crop.x)
  expect(imageAfter.x).toBeGreaterThan(imageBefore.x)

  // The viewport itself never moves or resizes during image manipulation.
  const viewportAfter = await viewport.boundingBox()
  expect(viewportAfter.x).toBeCloseTo(viewportBox.x, 4)
  expect(viewportAfter.y).toBeCloseTo(viewportBox.y, 4)
  expect(viewportAfter.width).toBeCloseTo(viewportBox.width, 4)
  expect(viewportAfter.height).toBeCloseTo(viewportBox.height, 4)

  await page.getByTestId('rotate').click()
  const rotated = await readState()
  expect(rotated.rotation).toBe(90)

  const beforeFlip = await readState()
  await page.getByTestId('flip-x').click()
  expect(await readState()).not.toEqual(beforeFlip)
  await page.getByTestId('flip-x').click()
  expect(await readState()).toEqual(beforeFlip)

  await page.getByTestId('reset').click()
  expect(await readState()).toEqual(initial)
})
