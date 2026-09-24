import { expect, type Locator, type Page } from '@playwright/test';
import { PortalPage } from './portal.page';

export class HomePage extends PortalPage {
  readonly heroHeading: Locator;
  readonly signInLink: Locator;
  readonly signUpLink: Locator;
  readonly gettingStartedLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heroHeading = page.getByRole('heading', { name: "Let's Build Together" });
    this.signInLink = page.getByRole('link', { name: 'SIGN IN' });
    this.signUpLink = page.getByRole('link', { name: 'SIGN UP' });
    this.gettingStartedLink = page
      .locator('iframe')
      .first()
      .contentFrame()
      .getByRole('link', { name: /Getting Started GETTING STARTED/ });
  }

  async open(): Promise<void> {
    await this.openPath('/');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle('Home - INEIGHT - QA Portal');
    await expect(this.heroHeading).toBeVisible();
  }

  async expectNavigationLinksVisible(): Promise<void> {
    await expect(this.signInLink).toBeVisible();
    await expect(this.signUpLink).toBeVisible();
  }

  async expectGettingStartedVisible(): Promise<void> {
    await expect(this.gettingStartedLink).toBeVisible();
  }
}
