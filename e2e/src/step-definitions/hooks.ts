import {After, Before, Status} from 'cucumber';
import {browser} from 'protractor';

Before({tags: '@EM-1711'}, async function () {
  await browser.waitForAngularEnabled(false);
  await browser.driver.navigate().to(browser.baseUrl);
});


After(async function (scenario) {
  if (scenario.result.status === Status.FAILED) {
    const screenshot = await browser.takeScreenshot();
    this.attach(screenshot, 'image/png');
  }
});


