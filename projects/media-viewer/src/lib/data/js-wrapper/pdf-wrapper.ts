declare const pdfjsLib: any;
declare const pdfjsViewer: any;

export class PdfWrapper {

    getDocument(documentId): any {
        return pdfjsLib.getDocument(documentId);
    }

    getPage(pageIndex: number) {
      return pdfjsLib.getPage(pageIndex);
    }

    initViewer(documentUrl: string) {

      if (!pdfjsLib.getDocument || !pdfjsViewer.PDFPageView) {
        alert('pdfjsLib or pdfjsViewer are unavailable.');
      }

      const CMAP_URL = 'assets/minified/cmaps';
      const CMAP_PACKED = true;

      const DEFAULT_URL = documentUrl;

      const container = document.getElementById('viewerContainer');

      // (Optionally) enable hyperlinks within PDF files.
      const pdfLinkService = new pdfjsViewer.PDFLinkService();

      // (Optionally) enable find controller.
      const pdfFindController = new pdfjsViewer.PDFFindController({
        linkService: pdfLinkService,
      });

      const pdfViewer = new pdfjsViewer.PDFViewer({
        container: container,
        linkService: pdfLinkService,
        findController: pdfFindController,
      });
      pdfLinkService.setViewer(pdfViewer);

      document.addEventListener('pagesinit', function () {
        // We can use pdfViewer now, e.g. let's change default scale.
        pdfViewer.currentScaleValue = 'page-width';

        pdfFindController.executeCommand('find', { query: "run", });
      });

      // Loading document.
      const loadingTask = pdfjsLib.getDocument({
        url: DEFAULT_URL,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
      });
      loadingTask.promise.then(function(pdfDocument) {
        // Document loaded, specifying document for the viewer and
        // the (optional) linkService.
        pdfViewer.setDocument(pdfDocument);

        pdfLinkService.setDocument(pdfDocument, null);
      });

    }

}
