import {Given, Then, When} from 'cucumber';
import {AppPage} from '../pages/app.po';
import {browser, by, element} from 'protractor';
import {NavigatePage} from '../pages/navigate.po';
import {expect} from 'chai';
import {ToolBar} from '../pages/toolbar.po';
import {PrintPage} from '../pages/print.po';
import {GenericMethods} from '../utils/genericMethods';
import {CommentPage} from '../pages/comment.po';


const page = new AppPage();
const navigatePage: NavigatePage = new NavigatePage();
const toolBar = new ToolBar();
const printPage = new PrintPage();
const genericMethods = new GenericMethods();
const commentPage = new CommentPage();
const comment_1 = 'This is comment number 1';
const comment_new = 'This is comment number 1 new';

Given('I am on Media Viewer Page', async () => {
  await page.preparePage();
});

When('I enable toggle buttons', async () => {
  await page.showToolbarButtons();
});

Then('I expect toolbar buttons should be enabled', async () => {
  await page.waitForElement(by.css('label[for="download-btn-toggle"]'));
});

Then('I expect the page header to be {string}', async (text: string) => {
  const header = await page.getHeaderText();
  expect(header).to.equal(text);
});

When('I click next button on the pdf', async () => {
  await page.selectPdfViewer();
  await page.waitForPdfToLoad();
  await navigatePage.goToNextPage();
  await genericMethods.sleep(5000);
});

When('I click previous button on the pdf', async () => {
  await page.selectPdfViewer();
  await page.waitForPdfToLoad();
  await navigatePage.goToPreviousPage();
  await genericMethods.sleep(5000);
});

Then('I should see next page number should be {string}', async (expected: string) => {
  const value = await navigatePage.pageNumber.getAttribute('value');
  expect(parseInt(value, 10)).to.equal(parseInt(expected, 10));
});

Then('I should see previous page number should be {string}', async (expected: string) => {
  const value = await navigatePage.pageNumber.getAttribute('value');
  expect(parseInt(value, 10)).to.equal(parseInt(expected, 10));
});


When('the user selects the print option', async () => {
  await printPage.clickPrint();
});


When('the user selects the printer', function () {
  element(by.css('#first [value=\'HP OfficeJet Pro 8710\']')).click();
});


Then('I expect the file is queued for printing', async function () {
  await genericMethods.switchWindows();
  const screenshots = browser.takeScreenshot();
  this.attach(screenshots, 'image/png');
});

When('I click Annotate button', async () => {
  await toolBar.clickTextIcon();
  await toolBar.clickTextIcon();
});

Then('I expect Annotate button must be enabled', async function () {
  const screenshots = await browser.takeScreenshot();
  this.attach(screenshots, 'image/png');
});

When('I select a text on pdf doc', async () => {
  await toolBar.clickTextIcon();
  await page.selectPDFText();

});

Then('I expect text highlight popup should appear', async () => {
  await genericMethods.sleep(5000);
  const screenshot = await browser.takeScreenshot();
  this.attach(screenshot, 'image/png');
});

const addComment = async () => {
  await page.clickOnCommentButton();
  await page.enterTextInAnnotation(comment_1);
  await page.clickOnSaveButton();
};

const highLightTextInPdf = async () => {
  await page.waitForPdfToLoad();
  await sleep(5000);
  await toolBar.enableTextHighLightMode();
  await page.highLightTextOnPdfPage();
};

const highLightOnImage = async () => {
  // await page.waitForPdfToLoad();
  await sleep(5000);
  await toolBar.enableDrawHighLightMode();
  await page.drawOnImagePage();
};

const deleteComment = async () => {
  await page.deleteComment(comment_1);
};

Then('I should be able to add comment for the highlight', addComment);

When('I highlight text on a PDF document', highLightTextInPdf);

function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

Then('The context toolbar should disappear', async () => {
  expect(await page.isContextToolBarVisible()).false;
});

When('I select a textual comment and delete', deleteComment);

Given('The PDF has atleast one comment', async () => {
  await highLightTextInPdf();
  await addComment();
});

Then('The comment should be deleted', async () => {
  expect(await page.getAllComments()).not.contain(comment_1);
});

Given('I change to Image Viewer tab', async () => {
  await page.selectImageViewer();
});

When('I highlight a portion of image', highLightOnImage);

Given('The image has atleast one non-textual comment', async () => {
  await highLightOnImage();
  await addComment();
});

When('I select a non-textual comment and delete', deleteComment);

When('I update a non-textual comment and save', async () => {
  await page.updateComment(comment_1, comment_new);
});

Then('The old comment should be replaced with new comment', async () => {
  const comment = await page.getComment();
  expect(comment).to.contain(comment_new);
});

Then('I update the existing comment with {string}', async (text: string) => {
  await commentPage.clickElement(commentPage.commentBox);
  await genericMethods.sleep(5000);
  // @ts-ignore
  const actualComment = element(by.xpath(commentPage.commentBox)).getWebElement();
  console.log(actualComment.getText());
});
