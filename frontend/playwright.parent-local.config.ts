import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', testMatch: 'parentToolsReliability.spec.ts',
  timeout: 60000, workers: 1, reporter: 'line',
  outputDir: process.env.MSSID_PARENT_TEST_OUTPUT ?? 'test-results/parent-tools',
  use: { baseURL: process.env.MSSID_PARENT_TEST_URL ?? 'http://127.0.0.1:3200', browserName: 'chromium' },
});
