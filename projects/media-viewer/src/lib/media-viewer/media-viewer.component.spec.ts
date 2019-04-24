import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaViewerComponent } from './media-viewer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, Renderer2, SimpleChange, Type } from '@angular/core';
import { MediaViewerService } from './media-viewer.service';
import { of} from 'rxjs';
import { TransferState } from '@angular/platform-browser';
import { MediaViewerModule } from '../media-viewer.module';
import { EmLoggerService } from '../logging/em-logger.service';
import { ViewerFactoryService } from './viewers/viewer-factory.service';
import { PdfWrapper } from '../data/js-wrapper/pdf-wrapper';
import { AnnotationStoreService } from '../data/annotation-store.service';

const originalUrl = 'http://api-gateway.dm.com/documents/1234-1234-1234';

class MockTransferState {
    remove() {}
    set() {}
}

class MockPdfWrapper {
  getDocument(documentId) {}
}

describe('MediaViewerComponent', () => {
    const mockTransferState = new MockTransferState();
    const mockPdfWrapper = new MockPdfWrapper();
    let component: MediaViewerComponent;
    let fixture: ComponentFixture<MediaViewerComponent>;
    let element: DebugElement;
    let mockDocuments;
    let viewerFactoryServiceMock;

  const DocumentViewerServiceMock = {
        getDocumentMetadata: () => {
            return of(mockDocuments);
        }
    };

    const AnnotationStoreServiceMock = {
        getAnnotationSet: () => {
          return of([]);
        }
    };

    const createComponent = () => {
        fixture = TestBed.createComponent(MediaViewerComponent);
        component = fixture.componentInstance;
        component.isDM = true;
        component.url = originalUrl;
        component.baseUrl = '/demproxy/dm';
        element = fixture.debugElement;

        viewerFactoryServiceMock = fixture.componentRef.injector
            .get<ViewerFactoryService>(ViewerFactoryService as Type<ViewerFactoryService>);
        spyOn(viewerFactoryServiceMock, 'getDocumentId').and.callThrough();
        spyOn(viewerFactoryServiceMock, 'buildComponent').and.callThrough();

        fixture.detectChanges();
        component.ngOnChanges({url: new SimpleChange(null, component.url, true)});
    };

    const createMockDocuments = (mimeType, documentName, url) => {
        return {
            mimeType: mimeType,
            originalDocumentName: documentName,
            _links: {
                binary: {
                    href: `${url}/binary`
                },
                self: {
                    href: `${url}`
                }
            }
        };
    };


    beforeEach(async(() => {
        const testingModule = TestBed.configureTestingModule({
            imports: [MediaViewerModule, HttpClientTestingModule],
            providers: [
                EmLoggerService,
                Renderer2,
                ViewerFactoryService,
                { provide: TransferState, useFactory: () => mockTransferState},
                { provide: MediaViewerService, useValue: DocumentViewerServiceMock},
                { provide: AnnotationStoreService, useValue: AnnotationStoreServiceMock},
                { provide: PdfWrapper, useFactory: () => mockPdfWrapper }
            ]
        });

        testingModule.compileComponents();
    }));


    describe('when the mime type is an image', () => {
        beforeEach(() => {
            mockDocuments = createMockDocuments('image/jpeg', 'image.jpeg', originalUrl);
            createComponent();
        });

        it('img element should be visible', () => {
            expect(element.nativeElement.querySelector('app-image-viewer')).toBeTruthy();
        });

        it('and pdf element should not be visible', () => {
            expect(element.nativeElement.querySelector('app-pdf-viewer')).not.toBeTruthy();
        });

        describe('when the url is changed', () => {
            const newUrl = 'http://api-gateway.dm.com/documents/5678-5678-5678';
            beforeEach(() => {
                component.url = newUrl;
                component.ngOnChanges({url: new SimpleChange(originalUrl, newUrl, false)});
                fixture.detectChanges();
            });

            beforeEach(() => {
              mockDocuments = createMockDocuments('image/jpeg', 'new-image.jpeg', newUrl);
            });

            it('img element should still be visible', () => {
                expect(element.nativeElement.querySelector('app-image-viewer')).toBeTruthy();
            });

            it('and pdf element should still not be visible', () => {
                expect(element.nativeElement.querySelector('app-pdf-viewer')).not.toBeTruthy();
            });
        });
    });

    describe('when the mime type is pdf', () => {
        beforeEach(() => {
            mockDocuments = createMockDocuments('application/pdf', 'cert.pdf', originalUrl);
            createComponent();
        });

        it('img element should not be visible', () => {
            expect(element.nativeElement.querySelector('app-image-viewer')).not.toBeTruthy();
        });

        it('pdf element should be visible', () => {
            expect(element.nativeElement.querySelector('app-pdf-viewer')).toBeTruthy();
        });
        it('img element should not be visible', () => {
            expect(element.nativeElement.querySelector('app-image-viewer')).not.toBeTruthy();
        });
    });
});
