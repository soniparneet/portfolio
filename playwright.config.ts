import { defineConfig } from '@playwright/test';
const baseURL = `http://127.0.0.1:${process.env.PORT || '3000'}`;
export default defineConfig({
  testDir: './tests', testMatch: '**/*.spec.tsx', fullyParallel: true, workers: 3,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL, channel: 'chrome', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: { command: 'npm run start', url: baseURL, reuseExistingServer: !process.env.CI },
});
