import { expect, type Locator, type Page } from '@playwright/test';
import { PortalPage } from './portal.page';

export class DocumentationPage extends PortalPage {
  readonly heroHeading: Locator;
  readonly documentationLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heroHeading = page.getByRole('heading', { name: "Let's Build Together" });
    this.documentationLink = page
      .locator('iframe')
      .nth(1)
      .contentFrame()
      .locator('iframe')
      .contentFrame()
      .getByRole('link', { name: /DOCUMENTATION/ });
  }

  async open(): Promise<void> {
    await this.openPath('/#');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle('Home - INEIGHT - QA Portal');
    await expect(this.heroHeading).toBeVisible();
  }
}
