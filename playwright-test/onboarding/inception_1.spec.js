const { test } = require('../fixtures');
const { expect } = require('@playwright/test');
const Tesseract = require('tesseract.js');

// 1. Go to www.browserstack.com and log in with your demo account
// 2. Start a Live session, as a part of the automation script
// 3. Within the Live session, perform a Google search for “BrowserStack”

// 1. Go to www.browserstack.com
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({
    width: 1920,
    height: 1200,
  });
  await page.goto('https://www.browserstack.com/');
});

test.describe('Browserstack Inception Nicholas onboarding', () => {

  test('Browserstack Inception Omnibus POC', async ({ page }) => {
    // log in with your demo account
    await page.waitForSelector('text=Sign in',{state:'visible'});
    await page.locator('text=Sign in').first().click();
    await page.waitForSelector('#user_email_login')
    await page.fill('#user_email_login', process.env.BROWSERSTACK_DEMO_EMAIL );
    await page.fill('#user_password', process.env.BROWSERSTACK_DEMO_PASSWORD );
    await page.locator('#user_submit').click();
    await page.waitForTimeout(5000);
    // check logged into dashboard of any sub domain
    await page.goto('https://live.browserstack.com/dashboard');
    // await expect(page).toContainUrl("browserstack.com/dashboard");
    // Start a Live session, as a part of the automation script
//    await expect(page).toHaveURL("https://live.browserstack.com/dashboard");
    await page.waitForTimeout(3000);
    // Location and click Windows 11  
    await page.locator('[aria-label="Windows 11"]').click();
    // Location and click Windows 11
    await page.locator('[aria-label="chrome 106 latest"]').click();
    await page.locator('.spotlight__in-session__camera-injection__button__text').click();
    await page.locator('.toolbar__head__icon-collapse').click();
    console.log( await page.locator('#flashlight-overlay'))
    await page.locator('#flashlight-overlay').click();
    await page.waitForTimeout(4000);
    // Within the Live session, perform a Google search for “BrowserStack”
    await page.keyboard.press('Control+T');
    await page.keyboard.insertText('https://www.google.com', {delay: 100});
    await page.keyboard.press('Enter');
    await page.keyboard.type('google.com', {delay: 5});
    await page.keyboard.press('Space', {delay: 5});
    await page.keyboard.type('Browserstack', {delay: 5});
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    image = await page.screenshot({ path: 'serp.png' });
    // run Tesseract OCR on serp.png screenshot 
    imageTesseract = await Tesseract.recognize(image);
    imageOcrText = imageTesseract.data.text
    console.log(imageOcrText)
    // a range of OCR options to match below
    // doing OCR on a screenshot from a video screen is flakey, suprise!
    niceResult = 'BrowserStack: Most Reliable App & Cross Browser Testing'
    middleResult = 'Google BrowserStack'
    browserWordStackResult = 'BrowserStack'
    googleResult = 'Google'
    googleUrl = 'google.com/search?q=Browserstack'
    // in live session select Browserstack link using send keys Control F
    // creates a screenshot with a strong visual signal, a highlight
    await page.keyboard.press('Control+F');    
    await page.keyboard.type('BrowserStack: Most Reliable App & Cross Browser Testing', {delay: 5});
    await page.waitForTimeout(3000);    
    await page.screenshot({ path: 'serpfind.png' });

    // catch OCR results and send to Browserstack Automate Dashboard logs
    try {
      expect(imageOcrText).toContain(browserWordStackResult);
      // following line of code is responsible for marking the status of the test on BrowserStack as 'passed'. You can use this code in your after hook after each test
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Title matches defined searched term from OCR'}})}`);
    } catch {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Title did not match'}})}`);
    }
 
  });

});