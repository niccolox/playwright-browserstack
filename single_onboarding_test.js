import { test, expect } from '@playwright/test';

// const assert = require('assert');
const expect = require('chai').expect
const { chromium } = require('playwright');

const cp = require('child_process');
const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

(async () => {
  const caps = {
  	'browser': 'chrome',  // allowed browsers are `chrome`, `edge`, `playwright-chromium`, `playwright-firefox` and `playwright-webkit`
    'os': 'osx',
    'os_version': 'catalina',
    'name': 'My first playwright test',
    'build': 'playwright-build-1',
    'browserstack.username': process.env.BROWSERSTACK_USERNAME || 'YOUR_USERNAME',
    'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY || 'YOUR_ACCESS_KEY',
    'client.playwrightVersion': clientPlaywrightVersion  // Playwright version being used on your local project needs to be passed in this capability for BrowserStack to be able to map request and responses correctly
  };
  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`,
  });
  const page = await browser.newPage();

  test('homepage has Playwright in title and get started link linking to the intro page', async ({ page }) => {
    await page.goto('https://www.browserstack.com/');
  
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/BrowserStack/);
  
    // create a locator
    const getStarted = page.getByText('Sign in');
  
    // Expect an attribute "to be strictly equal" to the value.
    await expect(getStarted).toHaveAttribute('href', '/users/sign_in');
  
    // Click the get started link.
    await getStarted.click();
  
    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*sign_in/);
  });

  // Navigate and wait for element
  // await page.goto('https://www.browserstack.com/users/sign_in');
  // const title = await page.title('');
  // console.log(title);  
  // await browser.close();
})();
