import { test, expect } from './support/fixtures';
import { HomePage } from './pages/home.page';

test('INEIGHT portal homepage displays its welcome content', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.open();

  await homePage.expectLoaded();
  await expect(homePage.signInLink).toBeVisible();
});
