import { defineConfig } from '@playwright/test'

const port = process.env.PLAYWRIGHT_PORT || '4173'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: `http://127.0.0.1:${port}/vue-croppa/`,
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `npm run preview -- --port ${port}`,
    url: `http://127.0.0.1:${port}/vue-croppa/`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
