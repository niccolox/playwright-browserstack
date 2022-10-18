const { test } = require('../fixtures');
const { expect } = require('@playwright/test');
const Tesseract = require('tesseract.js');

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.browserstack.com/');
});

test.describe('Browserstack Inception Nicholas onboarding', () => {

  test('Browserstack Inception Omnibus POC', async ({ page }) => {
    await page.waitForSelector('text=Sign in',{state:'visible'});
    await page.locator('text=Sign in').first().click();
    await page.waitForSelector('#user_email_login')
    await page.fill('#user_email_login', process.env.BROWSERSTACK_DEMO_EMAIL);
    await page.fill('#user_password', process.env.BROWSERSTACK_DEMO_PASSWORD);
    await page.locator('#user_submit').click();
    await expect(page).toHaveURL("https://live.browserstack.com/dashboard");
    await page.locator('[aria-label="Windows 11"]').click();
    await page.locator('[aria-label="chrome 106 latest"]').click();
    await page.locator('.spotlight__in-session__camera-injection__button__text').click();
    await page.locator('.toolbar__head__icon-collapse').click();
    console.log( await page.locator('#flashlight-overlay'))
    await page.locator('#flashlight-overlay').click();
    await page.waitForTimeout(10000);
    await page.keyboard.press('Control+T');
    await page.keyboard.insertText('https://www.google.com', {delay: 100});
    await page.keyboard.press('Enter');
    // await page.keyboard.press('Control+T');
    await page.keyboard.type('google.com', {delay: 5});
    await page.keyboard.press('Space', {delay: 5});
    await page.keyboard.type('Browserstack', {delay: 5});
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    image = await page.screenshot({ path: 'serp.png' });
    imageTesseract = await Tesseract.recognize(image);
    imageOcrText = imageTesseract.data.text
    console.log(imageOcrText)
    niceResult = 'BrowserStack: Most Reliable App & Cross Browser Testing'
    middleResult = 'Google Browserstack'
    browserWordStackResult = 'Browserstack'
    googleResult = 'Google'
    googleUrl = 'google.com/search?q=Browserstack'
    // await expect(searchMatchTerm).toContain(browserWordStackResult);
    await page.keyboard.press('Control+F');    
    await page.keyboard.type('BrowserStack: Most Reliable App & Cross Browser Testing', {delay: 5});
    await page.waitForTimeout(2000);    
    await page.screenshot({ path: 'serpfind.png' });

    try {
      expect(imageOcrText).toContain(browserWordStackResult);
      // following line of code is responsible for marking the status of the test on BrowserStack as 'passed'. You can use this code in your after hook after each test
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Title matches defined searched term from OCR'}})}`);
    } catch {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Title did not match'}})}`);
    }    

    // await page.keyboard.press('Control+Shift+I');    

    // await page.keyboard.press('Control+U');
    // await page.keyboard.press('Control+A');
    // await page.keyboard.press('Control+C');
    await page.waitForTimeout(2000);    
    // await page.keyboard.press('Control+S+F');    
    // await page.keyboard.type('Google Browserstack', {delay: 5});
    // await page.keyboard.press('Enter');
    // await page.screenshot({ path: 'sourceserpfind.png' });
  });

});
