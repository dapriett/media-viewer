import {browser, by, element, Locator, protractor} from 'protractor';
import {By} from '@angular/platform-browser';

const until = protractor.ExpectedConditions;

export class AppPage {
  
  
  commentButton : By = By.css(".toolbar button[title='Comment']");
  annotationTextArea : By = By.css("textarea");

  async navigateTo() {
    await browser.driver.navigate().to(browser.baseUrl);
    return await browser.driver.manage().window().maximize();
  }

  async preparePage() {
    await this.navigateTo();
    await this.showToolbarButtons();
  }

  async clickElement(selector: By) {
    const el = await element(selector);
    return el.click();
  }

  async showToolbarButtons() {
    const searchButtonElement = await element(by.id('search-btn-toggle'));
    const checked = await searchButtonElement.getAttribute('checked');
    if (!checked) {
      await Promise.all([
        this.clickElement(by.css('label[for="download-btn-toggle"]')),
        this.clickElement(by.css('label[for="navigate-btn-toggle"]')),
        this.clickElement(by.css('label[for="print-btn-toggle"]')),
        this.clickElement(by.css('label[for="rotate-btn-toggle"]')),
        this.clickElement(by.css('label[for="search-btn-toggle"]')),
        this.clickElement(by.css('label[for="zoom-btn-toggle"]')),
        this.clickElement(by.css('label[for="toggleAnnotations"]'))
      ]);
    }
  }

  async getHeaderText() {
    return await element(by.css('media-viewer-wrapper h2')).getText();
  }

  async selectPdfViewer() {
    await this.clickElement(by.id('pdf-tab'));
  }

  async selectImageViewer() {
    await this.clickElement(by.id('image-tab'));
  }

  async selectUnsupportedViewer() {
    await this.clickElement(by.id('unsupported-tab'));
  }

  async waitForPdfToLoad() {
    await browser.wait(until.presenceOf(element(by.css('div[class="page"'))), 3000, 'PDF viewer taking too long to load');
  }

  async waitForElement(selector: Locator) {
    await browser.wait(async () => {
      return (await element(selector)).isPresent();
    }, 10000, 'failed to load search results');
  }

  async waitForElementsArray(selector: Locator) {
    await browser.wait(async () => {
      return (await element.all(selector).isPresent());
    }, 10000, 'failed to load search results');
  }

  async selectPDFText() {
    const textSel = await browser.findElement(by.xpath('//div[contains(text(),\'Abstract\')]'));
    console.log(await textSel.getText());
    // const textSel = element(by.xpath('//div[contains(text(),\'Abstract\')]')).getWebElement();
    console.log('prior to click');
    await browser.actions().mouseDown(element(by.css('div[class="textLayer"]'))).perform();
    console.log('after click');
    await browser.actions().mouseMove(element(by.css('div[class="textLayer"]')), {x: 593, y: 0}).perform();
    await browser.actions().mouseUp().perform();
    console.log('after mouseup');
  }
  
   async getClassAttributeOfAnElement(selector : By) : Promise<string[]> {
    var splitClasses:string[] = [];
    return await element(selector).getAttribute('class').then( (classes) => {
      splitClasses = classes.split(' ');
      return splitClasses;
    }).catch(() => {return []});
  }

  async highLightTextOnPdfPage(text : string){
    await browser.executeScript(() => {
      var range = document.createRange();
      var xpath = "//div[text()='" + text + "']";
      var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      range.selectNodeContents(matchingElement);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });

    this.getHighlightPopUp();
  }

  async getHighlightPopUp(){
    await browser.executeScript(() => {
      let mousedown = document.createEvent("Event");
      mousedown.initEvent("mousedown", true, true);
      let mouseup = document.createEvent("Event");
      mouseup.initEvent("mouseup", true, true);
      var pageHandle = document.getElementsByClassName("pdfViewer")[0];
      pageHandle.dispatchEvent(mousedown);
      pageHandle.dispatchEvent(mouseup);
    });
  }

  async clickOnCommentButton(){
    element(this.commentButton).click();
  }
}
