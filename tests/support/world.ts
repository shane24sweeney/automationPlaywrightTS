import { After, Before, Status, World, setDefaultTimeout, setWorldConstructor } from '@cucumber/cucumber';
import { type Page } from '@playwright/test';
import { createSession, type BrowserSession } from './session';

// Remote devices take longer to start and respond than a local browser.
setDefaultTimeout(process.env.BROWSERSTACK === 'true' ? 120_000 : 30_000);

export class PortalWorld extends World {
  session!: BrowserSession;

  get page(): Page {
    return this.session.page;
  }
}

setWorldConstructor(PortalWorld);

Before(async function (this: PortalWorld, { pickle }) {
  this.session = await createSession(pickle.name);
});

After(async function (this: PortalWorld, { result }) {
  await this.session?.close({
    passed: result?.status === Status.PASSED,
    reason: result?.message
  });
});
