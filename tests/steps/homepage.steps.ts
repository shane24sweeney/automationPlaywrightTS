import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { type PortalWorld } from '../support/world';

Given('I am on the INEIGHT API developer portal home page', async function (this: PortalWorld) {
  await new HomePage(this.page).open();
});

When('I view the portal resources', async function (this: PortalWorld) {
  await new HomePage(this.page).expectGettingStartedVisible();
});

Then('the portal title should be {string}', async function (this: PortalWorld, expectedTitle: string) {
  await expect(this.page).toHaveTitle(expectedTitle);
});

Then('the welcome heading {string} should be visible', async function (this: PortalWorld, expectedHeading: string) {
  await expect(this.page.getByRole('heading', { name: expectedHeading })).toBeVisible();
});

Then(
  'the {string} and {string} links should be visible',
  async function (this: PortalWorld, firstLink: string, secondLink: string) {
    await expect(this.page.getByRole('link', { name: firstLink })).toBeVisible();
    await expect(this.page.getByRole('link', { name: secondLink })).toBeVisible();
  }
);

Then('the {string} resource should be visible', async function (this: PortalWorld, resourceName: string) {
  await expect(new HomePage(this.page).gettingStartedLink).toContainText(resourceName);
});
