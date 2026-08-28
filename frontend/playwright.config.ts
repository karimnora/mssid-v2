import { defineConfig, devices } from '@playwright/test';

// Functional/E2E tests, distinct from the vitest unit/component suite (src/**/*.test.tsx).
// The frontend dev server (npm run dev — Express + Vite middleware, see server.ts) serves the real
// app; every backend call is intercepted at the network layer in each spec's own setup (no Spring
// Boot instance needed — see the "Backend E2E" scope decision this suite was built against).
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: process.env.CI ? 60_000 : 30_000,
  // Minimal reporters in CI/agent contexts avoid dumping a full HTML report's worth of output into
  // the log — see this project's playwright-best-practices guidance.
  reporter: process.env.CI ? 'line' : 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
