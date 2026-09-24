import { _android, chromium, devices, firefox, webkit, type BrowserContextOptions, type Page } from '@playwright/test';
import { androidWsEndpoint, desktopWsEndpoint, markSessionStatus, useBrowserStack } from './browserstack';

export interface BrowserSession {
  page: Page;
  close(result?: { passed: boolean; reason?: string }): Promise<void>;
}

const browserTypes = { chromium, firefox, webkit };

// BrowserStack's names for the browser engine behind each Playwright browser type.
const browserStackBrowsers = {
  chromium: process.env.BS_BROWSER ?? 'chrome',
  firefox: 'playwright-firefox',
  webkit: 'playwright-webkit'
};

/**
 * Resolves emulation settings from DEVICE, a Playwright device name such as "Pixel 7" or "iPhone 14".
 * Unset means a plain desktop browser.
 */
function deviceProfile(): { browserName: keyof typeof browserTypes; contextOptions: BrowserContextOptions } {
  const deviceName = process.env.DEVICE;
  if (!deviceName) {
    return { browserName: 'chromium', contextOptions: {} };
  }
  const descriptor = devices[deviceName];
  if (!descriptor) {
    throw new Error(`Unknown DEVICE "${deviceName}". See Playwright's device list for valid names.`);
  }
  const { defaultBrowserType, ...contextOptions } = descriptor;
  return { browserName: defaultBrowserType, contextOptions };
}

/**
 * Opens a page for one scenario. The target is chosen by environment:
 * - BROWSERSTACK=true + BS_DEVICE: real Android device on BrowserStack
 * - BROWSERSTACK=true:             desktop browser on BrowserStack (with DEVICE emulation if set)
 * - otherwise:                     local browser (with DEVICE emulation if set)
 */
export async function createSession(name: string): Promise<BrowserSession> {
  if (useBrowserStack && process.env.BS_DEVICE) {
    const device = await _android.connect(androidWsEndpoint(name));
    await device.shell('am force-stop com.android.chrome');
    const context = await device.launchBrowser();
    const page = await context.newPage();
    return {
      page,
      async close(result) {
        if (result) await markSessionStatus(page, result.passed, result.reason);
        await context.close();
        await device.close();
      }
    };
  }

  const { browserName, contextOptions } = deviceProfile();
  const browser = useBrowserStack
    ? await browserTypes[browserName].connect(desktopWsEndpoint(name, browserStackBrowsers[browserName]))
    : await browserTypes[browserName].launch({
        headless: process.env.HEADLESS !== 'false',
        slowMo: Number(process.env.SLOW_MO ?? 0)
      });
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  return {
    page,
    async close(result) {
      if (useBrowserStack && result) await markSessionStatus(page, result.passed, result.reason);
      await browser.close();
    }
  };
}
