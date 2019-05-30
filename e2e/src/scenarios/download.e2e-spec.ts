import { AppPage } from '../app.po';

describe('download', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });


  it('should download the pdf', async () => {
    const file = 'e2e/src/downloads/example.pdf';

    page.selectPdfViewer();
    page.clickDownload();
    await page.wait(3000);

    expect(page.hasFileDownloaded(file)).toEqual(true);
  });

  it('should download the image', async () => {
    const file = 'e2e/src/downloads/undefined.jpeg';

    page.selectImageViewer();
    page.clickDownload();
    await page.wait(3000);

    expect(page.hasFileDownloaded(file)).toEqual(true);
  });

  it('should download the unsupported file', async () => {
    const file = 'e2e/src/downloads/unsupported.txt';

    page.selectUnsupportedViewer();
    page.clickDownload();
    await page.wait(3000);

    expect(page.hasFileDownloaded(file)).toEqual(true);
  });
});
