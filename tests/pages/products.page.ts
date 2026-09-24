import { expect, type Locator, type Page } from '@playwright/test';
import { PortalPage } from './portal.page';

export class ProductsPage extends PortalPage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Products', exact: true });
  }

  async open(): Promise<void> {
    await this.openPath('/products');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle('Products: List - INEIGHT - QA Portal');
    await expect(this.heading).toBeVisible();
  }
}
