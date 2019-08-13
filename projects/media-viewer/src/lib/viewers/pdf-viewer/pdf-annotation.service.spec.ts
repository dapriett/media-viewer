import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { PdfAnnotationService } from './pdf-annotation-service';
import { ComponentFactoryResolver, ElementRef, ViewContainerRef } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerEventService } from '../viewer-event.service';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import { annotationSet } from '../../../assets/annotation-set';
import { DocumentLoadProgress, PageEvent, PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import { Subject } from 'rxjs';
import { DownloadManager, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import { PdfViewerComponent } from './pdf-viewer.component';

export class MockElementRef extends ElementRef {
  div = document.createElement('div');
  constructor() {
    super(undefined);
  }
  nativeElement = {
    querySelector: () => {
      return this.div;
    }
  };
}

describe('PdfAnnotationService', () => {
  let pdfService: PdfAnnotationService;
  let factory: ComponentFactoryResolver;
  let toolbarEvent: ToolbarEventService;
  let viewerEventService: ViewerEventService;
  let pdfViewerComponent: PdfViewerComponent;
  let pdfWrapper: PdfJsWrapper;
  let elementRef: ElementRef;

  const mockWrapper = {
    loadDocument: () => {},
    search: () => {},
    clearSearch: () => {},
    rotate: () => {},
    setZoom: () => {},
    stepZoom: () => {},
    getZoomValue: () => {},
    downloadFile: () => {},
    setPageNumber: () => {},
    changePageNumber: () => {},
    getPageNumber: () => 1,
    getCurrentPDFZoomValue: () => {},
    getNormalisedPagesRotation: () => 0,
    toolbarEvents: ToolbarEventService,
    pdfViewer: PDFViewer,
    downloadManager: DownloadManager,
    documentLoadInit: new Subject<any>(),
    documentLoadProgress: new Subject<DocumentLoadProgress>(),
    documentLoaded: new Subject<any>(),
    documentLoadFailed: new Subject(),
    pageRendered: new Subject<{pageNumber: number, source: { rotation: number, scale: number, div: Element} }>()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PdfAnnotationService,
        ViewContainerRef,
        ToolbarEventService,
        ViewerEventService,
        ComponentFactoryResolver,
        PdfViewerComponent,
        { provide: PdfJsWrapper, useValue: mockWrapper },
        { provide: ElementRef, useValue: MockElementRef },
        // { provide: ComponentFactoryResolver, useValue: mockFactoryResolver },
        // { provide: ViewContainerRef, useValue: mockContainerRef },
        // { provide: ToolbarEventService, useValue: toolbarEvent },
        // { provide: ViewerEventService, useValue: viewerEventService }

      ]
    });
  });

  beforeEach(() => {
    pdfService = TestBed.get(PdfAnnotationService);
    factory = TestBed.get(ComponentFactoryResolver);
    toolbarEvent = TestBed.get(ToolbarEventService);
    viewerEventService = TestBed.get(ViewerEventService);
    pdfViewerComponent = TestBed.get(PdfViewerComponent);
    pdfWrapper = TestBed.get(PdfJsWrapper);
    elementRef = new MockElementRef();

    pdfService.annotationSet = { ...annotationSet };
  });

  it('should be created', inject([PdfAnnotationService], (service: PdfAnnotationService) => {
    expect(service).toBeTruthy();
  }));

  it('should initialise pdf wrapper and viewer', () => {
    pdfService.init(pdfWrapper, pdfViewerComponent.pdfViewer);

    expect(pdfService.pdfWrapper).not.toBeNull();
    expect(pdfService.pdfViewer).not.toBeNull();
  });

  it('should create the annotation set for the pages with annotations', () => {
    spyOn<any>(pdfService, 'createAnnotationSetComponent');
    pdfService.setupAnnotationSet({ ...annotationSet });

    expect(pdfService.pages.length).toEqual(2);
    expect(pdfService.annotationSetComponents.length).toEqual(2);
  });

  it('should create the comment set for the given page', () => {
    spyOn<any>(pdfService, 'createCommentSetComponent');

    const commentSetComponent = pdfService.setupCommentSet(1);

    expect(pdfService.commentSetComponents.length).toEqual(1);
  });

  it('should destroy all references to any sets and pages', () => {
    pdfService.destroyComponents();

    expect(pdfService.commentSetComponents.length).toEqual(0);
    expect(pdfService.annotationSetComponents.length).toEqual(0);
    expect(pdfService.pages).toEqual([]);
  });

  // it('should initialise all the set components for the pdf viewer', () => {
  //   // setup
  //   spyOn<any>(pdfService, 'createAnnotationSetComponent');
  //   spyOn<any>(pdfService, 'createCommentSetComponent');
  //   pdfService.setupAnnotationSet({ ...annotationSet });
  //   pdfService.setupCommentSet(1);
  //   const specificAnnotationSet = pdfService.annotationSetComponents.find((annotation) => annotation.instance.page === 1);
  //
  //   spyOn(specificAnnotationSet.instance, 'initialise').and.callThrough();
  //   const mockRealElement = document.createElement('div');
  //   const mockEventSource: PageEvent = {
  //     pageNumber: 1,
  //     source: {
  //       rotation: 0,
  //       scale: 1,
  //       div: mockRealElement
  //     }
  //   };
  //
  //   pdfService.onPageRendered(mockEventSource);
  //
  //   expect(specificAnnotationSet.instance.initialise).toHaveBeenCalledWith(mockEventSource.source);
  // });

  // fit('should initialise annotation set and comment set components', () => {
  //   spyOn<any>(pdfService, 'setupCommentSet').and.returnValue(commentSetComponent);
  //   const mockRealElement = document.createElement('div');
  //   const mockEventSource: PageEvent = {
  //     pageNumber: 1,
  //     source: {
  //       rotation: 0,
  //       scale: 1,
  //       div: mockRealElement
  //     }
  //   };
  //
  //   pdfService.onPageRendered(mockEventSource);
  // });

  it('should highlight shape on the selected page', () => {
    pdfService.init(pdfWrapper, elementRef);

    spyOn(pdfService.pdfWrapper, 'getPageNumber').and.returnValue(1);
    spyOn(pdfService.pdfWrapper, 'getNormalisedPagesRotation').and.returnValue(0);
    spyOn(pdfService.pdfWrapper, 'getCurrentPDFZoomValue').and.returnValue(1);
    spyOn(pdfService.pdfViewer.nativeElement, 'querySelector');
    spyOn(toolbarEvent.drawMode, 'getValue').and.returnValue(true);
    const mouseEvent = new MouseEvent('click');
    pdfService.pages.push(1);

    pdfService.onPageSelected(mouseEvent);

    setTimeout(() => {
      expect(viewerEventService.onShapeSelection).toHaveBeenCalledWith({ page: 1, event: mouseEvent });
    }, 1);
  });

  it('should highlight the text on selected page', () => {
    const mouseEvent = new MouseEvent('click');
    spyOn(toolbarEvent.highlightMode, 'getValue').and.returnValue(true);
    spyOn(viewerEventService, 'onTextSelection').and.callThrough();
    pdfService.onHighlightSelected(mouseEvent);

    setTimeout(() => {
      expect(viewerEventService.onTextSelection).toHaveBeenCalledWith({ page: 1, event: mouseEvent });
    }, 1);
  });
});
