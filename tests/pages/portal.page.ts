import { type Page } from '@playwright/test';

export const portalBaseUrl = process.env.BASE_URL ?? 'https://developer-qa.ineight.com';

export abstract class PortalPage {
  constructor(protected readonly page: Page) {}

  protected async openPath(path: string): Promise<void> {
    await this.page.goto(new URL(path, portalBaseUrl).toString());
  }
}
