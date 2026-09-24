import { expect, type Locator, type Page } from '@playwright/test';
import { PortalPage } from './portal.page';

export class ApisPage extends PortalPage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'APIs', exact: true });
  }

  async open(): Promise<void> {
    await this.openPath('/apis');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle('APIs: List - INEIGHT - QA Portal');
    await expect(this.heading).toBeVisible();
  }
}
