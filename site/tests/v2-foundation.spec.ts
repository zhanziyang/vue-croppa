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

  await page.getByTestId('move-right').click()
  const moved = await readState()
  expect(moved.crop.x).toBeGreaterThan(zoomed.crop.x)

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
  expect(viewportAfter).toEqual(viewportBefore)

  await page.getByTestId('reset').click()
  expect(await readState()).toEqual(initial)
})
