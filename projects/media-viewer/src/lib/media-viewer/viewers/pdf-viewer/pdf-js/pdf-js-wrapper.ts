import {ElementRef} from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/web/pdf_viewer.css';
import 'pdfjs-dist/build/pdf.worker';

export class PdfJsWrapper {

    getDocument(documentId): any {
        return pdfjsLib.getDocument(documentId);
    }

    async initViewer(
      documentUrl: string,
      container: ElementRef
    ): Promise<[pdfjsViewer.PDFViewer, pdfjsViewer.PDFFindController]> {

      if (!pdfjsLib.getDocument || !pdfjsViewer.PDFPageView) {
        alert('pdfjsLib or pdfjsViewer are not unavailable.');
      }

      const CMAP_URL = 'assets/minified/cmaps';
      const CMAP_PACKED = true;

      const DEFAULT_URL = documentUrl;
      const eventBus = new pdfjsViewer.EventBus();

      // (Optionally) enable hyperlinks within PDF files.
      const pdfLinkService = new pdfjsViewer.PDFLinkService();

      // (Optionally) enable find controller.
      const pdfFindController = new pdfjsViewer.PDFFindController({
        linkService: pdfLinkService,
        eventBus: eventBus
      });

      const pdfViewer = new pdfjsViewer.PDFViewer({
        container: container.nativeElement,
        linkService: pdfLinkService,
        findController: pdfFindController,
        eventBus: eventBus
      });


      pdfLinkService.setViewer(pdfViewer);

      document.addEventListener('pagesinit', function () {
        // We can use pdfViewer now, e.g. let's change default scale.
        pdfViewer.currentScaleValue = 'page-fit';
      });

      // Loading document.
      const pdfDocument = await pdfjsLib.getDocument({
        url: DEFAULT_URL,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
      });
      pdfViewer.setDocument(pdfDocument);
      pdfLinkService.setDocument(pdfDocument, null);

      return [pdfViewer, pdfFindController];

    }

    downloadFile(url, filename) {
      const downloadManager = new pdfjsViewer.DownloadManager({});
      downloadManager.downloadUrl(url, filename);
    }

}