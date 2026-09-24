import { Given, Then } from '@cucumber/cucumber';
import { type Page } from '@playwright/test';
import { ApisPage } from '../pages/apis.page';
import { DocumentationPage } from '../pages/documentation.page';
import { GettingStartedPage } from '../pages/getting-started.page';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { type PortalWorld } from '../support/world';

type TabPage = HomePage | GettingStartedPage | ApisPage | ProductsPage | DocumentationPage;

function pageForTab(page: Page, tab: string): TabPage {
  switch (tab) {
    case 'HOME':
      return new HomePage(page);
    case 'GETTING STARTED':
      return new GettingStartedPage(page);
    case 'APIs':
      return new ApisPage(page);
    case 'PRODUCTS':
      return new ProductsPage(page);
    case 'DOCUMENTATION':
      return new DocumentationPage(page);
    default:
      throw new Error(`Unsupported portal tab: ${tab}`);
  }
}

Given('I open the {string} portal tab', async function (this: PortalWorld, tab: string) {
  await pageForTab(this.page, tab).open();
});

Then('the {string} portal page should be displayed', async function (this: PortalWorld, tab: string) {
  await pageForTab(this.page, tab).expectLoaded();
});
