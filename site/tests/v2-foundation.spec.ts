import { expect, test } from '@playwright/test'

test('v2 foundation lab drives the real v2 crop-state engine', async ({ page }) => {
  await page.goto('v2-lab')

  await expect(page.getByTestId('v2-lab')).toBeVisible()
  await expect(page.getByTestId('v2-viewport')).toBeVisible()
  await expect(page.getByTestId('v2-image-layer')).toBeVisible()
  await expect(page.locator('[data-testid="v2-crop"]')).toHaveCount(0)

  const viewportBefore = await page.getByTestId('v2-viewport').boundingBox()

  const readState = async () =>
    JSON.parse((await page.getByTestId('state-json').textContent()) || '{}')

  const initial = await readState()
  expect(initial.rotation).toBe(0)
  expect(initial.flipX).toBe(false)
  expect(initial.crop.width).toBeCloseTo(2 / 3, 10)

  await page.getByTestId('zoom-in').click()
  const zoomed = await readState()
  expect(zoomed.crop.width).toBeLessThan(initial.crop.width)
  expect(zoomed.crop.height).toBeLessThan(initial.crop.height)

  const imageBeforeMove = await page.getByTestId('v2-image-layer').boundingBox()

  await page.getByTestId('move-right').click()
  const moved = await readState()

  // WYSIWYG contract: the user moves the image right while the source selection moves left.
  expect(moved.crop.x).toBeLessThan(zoomed.crop.x)
  await expect
    .poll(async () => (await page.getByTestId('v2-image-layer').boundingBox())?.x)
    .toBeGreaterThan(imageBeforeMove.x)

  await page.getByTestId('rotate').click()
  const rotated = await readState()
  expect(rotated.rotation).toBe(90)

  const beforeFlip = await readState()
  await page.getByTestId('flip-x').click()
  const flipped = await readState()
  expect(flipped).not.toEqual(beforeFlip)

  await page.getByTestId('flip-x').click()
  expect(await readState()).toEqual(beforeFlip)

  const viewportAfter = await page.getByTestId('v2-viewport').boundingBox()
  expect(viewportAfter.x).toBeCloseTo(viewportBefore.x, 4)
  expect(viewportAfter.y).toBeCloseTo(viewportBefore.y, 4)
  expect(viewportAfter.width).toBeCloseTo(viewportBefore.width, 4)
  expect(viewportAfter.height).toBeCloseTo(viewportBefore.height, 4)

  await page.getByTestId('reset').click()
  expect(await readState()).toEqual(initial)
})
