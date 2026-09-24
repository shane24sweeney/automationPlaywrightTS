import { expect, type Locator, type Page } from '@playwright/test';
import { PortalPage } from './portal.page';

export class GettingStartedPage extends PortalPage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'InEight API Management Portal (APIM)' });
  }

  async open(): Promise<void> {
    await this.openPath('/getting-started');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle('GETTING STARTED - INEIGHT - QA Portal');
    await expect(this.heading).toBeVisible();
  }
}
