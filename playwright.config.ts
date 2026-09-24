import { defineConfig, devices, type Project } from '@playwright/test';
import { desktopWsEndpoint, useBrowserStack } from './tests/support/browserstack';

const targets = [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  { name: 'mobile-safari', use: { ...devices['iPhone 14'] } }
] satisfies Project[];

const browserStackBrowsers = { chromium: 'chrome', firefox: 'playwright-firefox', webkit: 'playwright-webkit' };

// With BROWSERSTACK=true each project runs on a BrowserStack browser instead of a local one.
// Device emulation (viewport, touch, user agent) is still applied, so mobile projects keep their mobile layout.
const projects: Project[] = useBrowserStack
  ? targets.map((project) => ({
      ...project,
      use: {
        ...project.use,
        connectOptions: {
          wsEndpoint: desktopWsEndpoint(
            `playwright-${project.name}`,
            browserStackBrowsers[project.use.defaultBrowserType]
          )
        }
      }
    }))
  : targets;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: useBrowserStack ? 2 : process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL ?? 'https://developer-qa.ineight.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects
});
