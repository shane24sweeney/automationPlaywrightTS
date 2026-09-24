import { createRequire } from 'node:module';
import { type Page } from '@playwright/test';

const require = createRequire(__filename);
const playwrightVersion: string = require('playwright-core/package.json').version;

const endpoint = 'wss://cdp.browserstack.com/playwright';

export const useBrowserStack = process.env.BROWSERSTACK === 'true';

function credentials() {
  const username = process.env.BROWSERSTACK_USERNAME;
  const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
  if (!username || !accessKey) {
    throw new Error('BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY must be set when BROWSERSTACK=true');
  }
  return { 'browserstack.username': username, 'browserstack.accessKey': accessKey };
}

function commonCaps(name: string) {
  return {
    ...credentials(),
    project: 'INEIGHT Developer Portal',
    build: process.env.BROWSERSTACK_BUILD_NAME ?? `local-${new Date().toISOString().slice(0, 10)}`,
    name,
    'client.playwrightVersion': playwrightVersion
  };
}

function toWsEndpoint(caps: Record<string, string>): string {
  return `${endpoint}?caps=${encodeURIComponent(JSON.stringify(caps))}`;
}

/** Desktop browser on a BrowserStack VM. Playwright device emulation can be layered on top via context options. */
export function desktopWsEndpoint(name: string, browser: string): string {
  return toWsEndpoint({
    ...commonCaps(name),
    browser,
    os: process.env.BS_OS ?? 'Windows',
    os_version: process.env.BS_OS_VERSION ?? '11'
  });
}

/** Real Android device running Chrome. Requires Playwright's `_android.connect`. */
export function androidWsEndpoint(name: string): string {
  return toWsEndpoint({
    ...commonCaps(name),
    deviceName: process.env.BS_DEVICE ?? 'Samsung Galaxy S23',
    osVersion: process.env.BS_OS_VERSION ?? '13.0',
    browserName: 'chrome',
    realMobile: 'true'
  });
}

/** Reports pass/fail to the BrowserStack dashboard for the current session. */
export async function markSessionStatus(page: Page, passed: boolean, reason = ''): Promise<void> {
  const command = {
    action: 'setSessionStatus',
    arguments: { status: passed ? 'passed' : 'failed', reason: reason.slice(0, 250) }
  };
  await page.evaluate(() => {}, `browserstack_executor: ${JSON.stringify(command)}`).catch(() => {});
}
