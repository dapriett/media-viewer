// import { inject, TestBed } from '@angular/core/testing';
// import { PdfAnnotationService } from './pdf-annotation-service';
// import { annotationSet } from '../../../assets/annotation-set';
// import {
//   ComponentFactory,
//   ComponentFactoryResolver,
//   ComponentRef,
//   CUSTOM_ELEMENTS_SCHEMA,
//   NO_ERRORS_SCHEMA,
//   ViewContainerRef
// } from '@angular/core';
// import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
// import { ViewerEventService } from '../viewer-event.service';
// import {DocumentLoadProgress, PageEvent, PdfJsWrapper} from './pdf-js/pdf-js-wrapper';
// import {Subject} from 'rxjs';
// import {createDirectiveInstance} from '@angular/core/src/view/provider';
// import {AnnotationSetComponent} from '../../annotations/annotation-set/annotation-set.component';
// import {CommentSetComponent} from '../../annotations/comment-set/comment-set.component';
// import {AnnotationComponent} from '../../annotations/annotation-set/annotation/annotation.component';
// import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
//
// fdescribe('PdfAnnotationService', () => {
//   let pdfService: PdfAnnotationService;
//   // let componentFactoryResolverSpy: jasmine.SpyObj<ComponentFactoryResolver>;
//   // let viewContainerRefSpy: jasmine.SpyObj<ViewContainerRef>;
//   // let factory: ComponentFactoryResolver;
//   // let toolbarEvent: ToolbarEventService;
//   // let viewerEventService: ViewerEventService;
//
//   // const mockFactoryResolver = {
//   //   resolveComponentFactory: () => null
//   // };
//   // const mockContainerRef = {
//   //   instance: {
//   //     annotationSet: annotationSet,
//   //     page: Number
//   //   },
//   //   createComponent: () => { return {instance: {annotationSet: {}, page: 0, initialise: () => {}}}; },
//   // };
//
//   const componentRefMock = {
//     initialise: () => {},
//     annotationSet: {},
//     page: 1
//   }
//
//   const mockViewer = {
//     pagesRotation: 0,
//     currentPageNumber: 1,
//     currentScaleValue: 2,
//     eventBus: {
//       on: () => {
//       },
//       dispatch: () => {
//       }
//     },
//     setDocument: () => {},
//     linkService: {
//       setDocument: () => {}
//     },
//     findController: {
//       executeCommand: () => {}
//     },
//     getPageView: (pageNumber: number): any => {
//       return null;
//     }
//   };
//   const downloadManager = {downloadUrl: () => {}}
//
//   const pdfJsWrapper = new PdfJsWrapper(
//     mockViewer,
//     downloadManager,
//     new ToolbarEventService(),
//     new Subject<string>(),
//     new Subject<DocumentLoadProgress>(),
//     new Subject<any>(),
//     new Subject(),
//     new Subject<PageEvent>(),
//   );
//
//   beforeEach(async () => {
//
//     // const spyOfComponentFactoryResolver = jasmine.createSpyObj('ComponentFactoryResolver', ['resolveComponentFactory']);
//     const spyOfViewContainerRef = jasmine.createSpyObj('ViewContainerRef', ['createComponent']);
//
//     TestBed.configureTestingModule({
//       declarations: [AnnotationSetComponent],
//       providers: [
//         PdfAnnotationService,
//         ToolbarEventService,
//         ViewerEventService,
//         [ class: ViewContainerRef, use: spyOfViewContainerRef: ]
//
//
//         { provide: ComponentFactoryResolver, useValue: mockFactoryResolver },
//       ],
//       schemas: [ NO_ERRORS_SCHEMA ]
//
//     });
//     TestBed.overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [AnnotationSetComponent] } });
//     pdfService = TestBed.get(PdfAnnotationService);
//     pdfService.init(pdfJsWrapper);
//
//     // componentFactoryResolverSpy = TestBed.get(ComponentFactoryResolver);
//     // viewContainerRefSpy = TestBed.get(ViewContainerRef);
//   });
//
//
//   it('should be created', inject([PdfAnnotationService], (service: PdfAnnotationService) => {
//     expect(service).toBeTruthy();
//   }));
//
//   it('should highlight the text on selected page', () => {
//     const mouseEvent = new MouseEvent('click');
//     spyOn(pdfService, 'onHighlightSelected').and.callThrough();
//     spyOn(pdfService.toolbarEvents.highlightMode, 'getValue').and.returnValue(true);
//     pdfService.onHighlightSelected(mouseEvent);
//
//     expect(pdfService.onHighlightSelected).toHaveBeenCalled();
//
//   });
//
//   // fit('should store annotationSet components for the pageNumbersWithAnnotations annotations exist when loaded', () => {
//   //   spyOn(service, 'onPageRendered');
//   //   // spyOn(mockFactoryResolver, 'resolveComponentFactory');
//   //   // spyOn(mockContainerRef, 'createComponent');
//
//   //   service.setupAnnotationSet({ ...annotationSet });
//
//   //   expect(service.pageNumbersWithAnnotations.length).toEqual(2);
//   //   expect(service.annotationSetComponents.length).toEqual(2);
//   // });
//
//   fit('should initialise the annotationSet components', async () => {
//     const divElement = document.createElement('div');
//     const pageRenderEvent = { pageNumber: 1, source: { rotation: 0, scale: 1, div: divElement } };
//     spyOn(pdfJsWrapper, 'getPageNumber').and.returnValue(1);
//     // const componentRefSpy = jasmine.createSpyObj('ComponentRef', ['destroy']);
//     // const componentAnnotationSetSpy = jasmine.createSpyObj('AnnotationSetComponent', ['initialise']);
//     // componentRefSpy.instance = componentAnnotationSetSpy
//     // componentAnnotationSetSpy.annotationSet = annotationSet;
//     // componentAnnotationSetSpy.page = 1;
//     // viewContainerRefSpy.createComponent.and.returnValue( componentRefSpy );
//     pdfService.setupAnnotationSet(annotationSet);
//     await pdfService.onPageRendered(pageRenderEvent);
//     expect(pdfService.annotationSetComponents[0].instance.initialise).toHaveBeenCalledWith(pageRenderEvent.source);
//   });
// });
