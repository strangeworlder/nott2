import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration — Night of the Thirteenth 2
 *
 * Scope B: solo demo + 2-tab multiplayer tests only.
 * No 4-player suite (deferred to manual QA).
 *
 * Runs against the local Next.js dev server.
 * CI: set CI=true to run headless with retries.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // multiplayer tests share state — run serially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'html',
  timeout: 30_000,

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
