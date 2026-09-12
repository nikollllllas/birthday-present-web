import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  // Dev mode's on-the-fly module transform + TanStack Router's route code
  // splitting (tsr-split) is flaky under repeated navigation in tests, so
  // the e2e suite runs against a real production build instead.
  webServer: {
    command: 'pnpm build && pnpm preview',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
