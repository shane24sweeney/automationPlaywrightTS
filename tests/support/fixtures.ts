import { test as base } from '@playwright/test';
import { markSessionStatus, useBrowserStack } from './browserstack';

export { expect } from '@playwright/test';

// Reports each test's result to the BrowserStack dashboard; a no-op for local runs.
export const test = base.extend<{ browserStackStatus: void }>({
  browserStackStatus: [
    async ({ page }, use, testInfo) => {
      await use();
      if (useBrowserStack) {
        await markSessionStatus(page, testInfo.status === testInfo.expectedStatus, testInfo.error?.message);
      }
    },
    { auto: true }
  ]
});
