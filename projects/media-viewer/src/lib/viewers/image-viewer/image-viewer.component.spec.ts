import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ImageViewerComponent } from './image-viewer.component';
import { Subject } from 'rxjs';
import {
  DownloadOperation,
  PrintOperation,
  RotateOperation,
  StepZoomOperation,
  ZoomOperation,
  ZoomValue
} from '../../events/viewer-operations';
import { PrintService } from '../../print.service';
import {ErrorMessageComponent} from '../error-message/error.message.component';
import {By} from '@angular/platform-browser';
import {SimpleChange} from '@angular/core';

describe('ImageViewerComponent', () => {
  let component: ImageViewerComponent;
  let fixture: ComponentFixture<ImageViewerComponent>;
  let nativeElement;
  const DOCUMENT_URL = 'document-url';

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        ErrorMessageComponent,
        ImageViewerComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageViewerComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.url = DOCUMENT_URL;
    component.zoomValue = new Subject<ZoomValue>();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should rotate image', () => {
    component.rotateOperation = new RotateOperation(90);

    expect(component.rotation).toBe(90);
    expect(component.rotationStyle).toBe('rotate(90deg)');
    expect(component.zoomStyle).toBe('scale(1)');
  });

  describe('zoom operation', () => {

    it('should zoom image by factor of 0.5 ', () => {
      const spy = spyOn(component, 'setZoomValue').and.returnValue(Promise.resolve(true));
      component.zoomOperation = new ZoomOperation(0.5);

      expect(component.zoom).toBe(0.5);
      spy.calls.mostRecent().returnValue.then(() => {
        expect(component.rotationStyle).toBe('rotate(0deg)');
        expect(component.zoomStyle).toBe('scale(0.5)');
      });
    });

    it('should zoom image by factor of 2', () => {
      const spy = spyOn(component, 'setZoomValue').and.returnValue(Promise.resolve(true));
      component.zoomOperation = new StepZoomOperation(2);

      expect(component.zoom).toBe(2);
      spy.calls.mostRecent().returnValue.then(() => {
        expect(component.rotationStyle).toBe('rotate(0deg)');
        expect(component.zoomStyle).toBe('scale(2)');
      });
    });

    it('should zoom image by maximum value 5', () => {
      const spy = spyOn(component, 'setZoomValue').and.returnValue(Promise.resolve(true));
      component.zoomOperation = new ZoomOperation(5);
      component.stepZoomOperation = new StepZoomOperation(0.1);

      expect(component.zoom).toBe(5);
      spy.calls.mostRecent().returnValue.then(() => {
        expect(component.rotationStyle).toBe('rotate(0deg)');
        expect(component.zoomStyle).toBe('scale(5)');
      });
    });

    it('should zoom image by minimum value 0.1', () => {
      const spy = spyOn(component, 'setZoomValue').and.returnValue(Promise.resolve(true));
      component.zoomOperation = new ZoomOperation(0.1);
      component.stepZoomOperation = new StepZoomOperation(-0.1);

      expect(component.zoom).toBe(0.1);
      spy.calls.mostRecent().returnValue.then(() => {
        expect(component.rotationStyle).toBe('rotate(0deg)');
        expect(component.zoomStyle).toBe('scale(0.1)');
      });
    });
  });

  it('should trigger print', inject([PrintService], (printService: PrintService) => {
    const printSpy = spyOn(printService, 'printDocumentNatively');
    component.printOperation = new PrintOperation();

    expect(printSpy).toHaveBeenCalledWith(DOCUMENT_URL);
  }));

  it('should trigger download', () => {
    const anchor = document.createElement('a');
    spyOn(document, 'createElement').and.returnValue(anchor);
    component.downloadFileName = 'download-filename';

    component.downloadOperation = new DownloadOperation();

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(anchor.href).toContain(DOCUMENT_URL);
    expect(anchor.download).toBe('download-filename');
  });

  it('when errorMessage available show error message', () => {
    expect(fixture.debugElement.query(By.css('.image-container')).nativeElement.className).not.toContain('hidden');
    expect(fixture.debugElement.query(By.directive(ErrorMessageComponent))).toBe(null);
    component.errorMessage = 'errorx';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.image-container'))).toBeNull();
    expect(fixture.debugElement.query(By.directive(ErrorMessageComponent))).toBeTruthy();
  });

  it('when url changes the error message is reset', async () => {
    component.errorMessage = 'errox';
    component.url = 'x';
    component.ngOnChanges({
      url: new SimpleChange('a', 'b', true)
    });
    expect(component.errorMessage).toBeNull();
  });

  it('on load error show error message', () => {
    component.onLoadError();
    expect(component.errorMessage).toContain('Could not load the image');
  });
});
