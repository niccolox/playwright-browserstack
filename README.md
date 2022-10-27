# Browserstack Inception Onboarding

git@github.com:niccolox/playwright-browserstack.git


## On Browserstack testing

### NPM command

Note, Browserstack Inception only works against Browserstack Live and Automate.

add environment variables
```
export BROWSERSTACK_DEMO_EMAIL=nicholas+demo@browserstack.com
export BROWSERSTACK_DEMO_PASSWORD=yourSuperSecurePassword
```

```
cd playwright-test
npm i
npm run test:onboarding

```
### Github Actions

https://github.com/niccolox/playwright-browserstack/actions/workflows/single.yml

## BrowserStack Inception
Assignment Duration: 4 hours

1. Go to www.browserstack.com and log in with your demo account
2. Start a Live session, as a part of the automation script
3. Within the Live session, perform a Google search for “BrowserStack”

## Example Inception Automate Build deep link

https://automate.browserstack.com/dashboard/v2/builds/6e4c7f5027d7ca11de8196910edf5f1d55eaa5ee/sessions/3934b86b54b0068fd5dbf1886c8e9730d1449c7f


```typescript

const { test } = require('../fixtures');
const { expect } = require('@playwright/test');
const Tesseract = require('tesseract.js');

// 1. Go to www.browserstack.com and log in with your demo account
// 2. Start a Live session, as a part of the automation script
// 3. Within the Live session, perform a Google search for “BrowserStack”

// 1. Go to www.browserstack.com
test.beforeEach(async ({ page }) => {
  await page.goto('https://www.browserstack.com/');
});

test.describe('Browserstack Inception Nicholas onboarding', () => {

  test('Browserstack Inception Omnibus POC', async ({ page }) => {
    // log in with your demo account
    await page.waitForSelector('text=Sign in',{state:'visible'});
    await page.locator('text=Sign in').first().click();
    await page.waitForSelector('#user_email_login')
    await page.fill('#user_email_login', "nicholas+demo@browserstack.com" );
    await page.fill('#user_password', process.env.BROWSERSTACK_DEMO_PASSWORD );
    await page.locator('#user_submit').click();
    // Start a Live session, as a part of the automation script
    await expect(page).toHaveURL("https://live.browserstack.com/dashboard");
    // Location and click Windows 11  
    await page.locator('[aria-label="Windows 11"]').click();
    // Location and click Windows 11
    await page.locator('[aria-label="chrome 106 latest"]').click();
    await page.locator('.spotlight__in-session__camera-injection__button__text').click();
    await page.locator('.toolbar__head__icon-collapse').click();
    console.log( await page.locator('#flashlight-overlay'))
    await page.locator('#flashlight-overlay').click();
    await page.waitForTimeout(10000);
    // Within the Live session, perform a Google search for “BrowserStack”
    await page.keyboard.press('Control+T');
    await page.keyboard.insertText('https://www.google.com', {delay: 100});
    await page.keyboard.press('Enter');
    await page.keyboard.type('google.com', {delay: 5});
    await page.keyboard.press('Space', {delay: 5});
    await page.keyboard.type('Browserstack', {delay: 5});
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    image = await page.screenshot({ path: 'serp.png' });
    // run Tesseract OCR on serp.png screenshot 
    imageTesseract = await Tesseract.recognize(image);
    imageOcrText = imageTesseract.data.text
    console.log(imageOcrText)
    niceResult = 'BrowserStack: Most Reliable App & Cross Browser Testing'
    middleResult = 'Google Browserstack'
    browserWordStackResult = 'Browserstack'
    googleResult = 'Google'
    googleUrl = 'google.com/search?q=Browserstack'
    // in live session select Browserstack link using send keys Control F
    await page.keyboard.press('Control+F');    
    await page.keyboard.type('BrowserStack: Most Reliable App & Cross Browser Testing', {delay: 5});
    await page.waitForTimeout(2000);    
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
  });

});

```