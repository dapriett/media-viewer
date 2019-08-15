import {
  AfterContentInit,
  Component, ComponentFactoryResolver, ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {DocumentLoadProgress, PageEvent, PdfJsWrapper} from './pdf-js/pdf-js-wrapper';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { PrintService } from '../../print.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ViewerEventService } from '../viewer-event.service';
import { ResponseType, ViewerException } from '../error-message/viewer-exception.model';
import {CommentSetComponent} from '../../annotations/comment-set/comment-set.component';
import {AnnotationSetComponent} from '../../annotations/annotation-set/annotation-set.component';

@Component({
  selector: 'mv-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PdfViewerComponent implements AfterContentInit, OnChanges, OnDestroy {

  @Output() pdfLoadStatus = new EventEmitter<ResponseType>();
  @Output() pdfViewerException = new EventEmitter<ViewerException>();

  @Input() url: string;
  @Input() downloadFileName: string;

  @Input() enableAnnotations: boolean;
  @Input() annotationSet: AnnotationSet | null;

  annotationSetComponents: ComponentRef<AnnotationSetComponent>[] = [];
  commentSetComponents: ComponentRef<CommentSetComponent>[] = [];

  highlightMode: BehaviorSubject<boolean>;
  drawMode: BehaviorSubject<boolean>;

  loadingDocument = false;
  loadingDocumentProgress: number;
  errorMessage: string;

  @ViewChild('viewerContainer') viewerContainer: ElementRef;
  @ViewChild('pdfViewer') pdfViewer: ElementRef;

  private pdfWrapper: PdfJsWrapper;
  private subscriptions: Subscription[] = [];
  private viewerException: ViewerException;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly pdfJsWrapperFactory: PdfJsWrapperFactory,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly printService: PrintService,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
  ) {
    this.highlightMode = toolbarEvents.highlightMode;
    this.drawMode = toolbarEvents.drawMode;
  }

  async ngAfterContentInit(): Promise<void> {
    this.pdfWrapper = this.pdfJsWrapperFactory.create(this.viewerContainer);
    this.pdfWrapper.documentLoadInit.subscribe(() => this.onDocumentLoadInit());
    this.pdfWrapper.documentLoadProgress.subscribe(v => this.onDocumentLoadProgress(v));
    this.pdfWrapper.documentLoaded.subscribe(() => this.onDocumentLoaded());
    this.pdfWrapper.documentLoadFailed.subscribe((error) => this.onDocumentLoadFailed(error));
    this.pdfWrapper.pageRendered.subscribe((event) => this.onPageRendered(event));

    this.subscriptions.push(
      this.toolbarEvents.print.subscribe(() => this.printService.printDocumentNatively(this.url)),
      this.toolbarEvents.download.subscribe(() => this.pdfWrapper.downloadFile(this.url, this.downloadFileName)),
      this.toolbarEvents.rotate.subscribe(rotation => this.pdfWrapper.rotate(rotation)),
      this.toolbarEvents.zoom.subscribe(zoom => this.pdfWrapper.setZoom(zoom)),
      this.toolbarEvents.stepZoom.subscribe(zoom => this.pdfWrapper.stepZoom(zoom)),
      this.toolbarEvents.search.subscribe(search => this.pdfWrapper.search(search)),
      this.toolbarEvents.setCurrentPage.subscribe(pageNumber => this.pdfWrapper.setPageNumber(pageNumber)),
      this.toolbarEvents.changePageByDelta.subscribe(pageNumber => this.pdfWrapper.changePageNumber(pageNumber))
    );
    await this.loadDocument();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.url && this.pdfWrapper) {
      await this.loadDocument();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.destroyAnnotationComponents();
  }

  private async loadDocument() {
    await this.pdfWrapper.loadDocument(this.url);
    this.setupAnnotationSet(this.annotationSet);
  }

  private onDocumentLoadInit() {
    this.loadingDocument = true;
    this.loadingDocumentProgress = null;
    this.errorMessage = null;
  }

  private onDocumentLoadProgress(documentLoadProgress: DocumentLoadProgress) {
    if (documentLoadProgress.total) {
      this.loadingDocumentProgress = Math.min(100, Math.ceil(documentLoadProgress.loaded / documentLoadProgress.total * 100 ));
    }
  }

  private onDocumentLoaded() {
    this.loadingDocument = false;
    this.pdfLoadStatus.emit(ResponseType.SUCCESS);
  }

  private onDocumentLoadFailed(error: Error) {
    this.loadingDocument = false;
    this.viewerException = new ViewerException(error.name, {message: error.message});
    this.errorMessage = `Could not load the document "${this.url}"`;

    this.pdfLoadStatus.emit(ResponseType.FAILURE);
    this.pdfViewerException.emit(this.viewerException);
  }

  @Input()
  set searchBarHidden(hidden: boolean) {
    if (this.pdfWrapper && hidden) {
      this.pdfWrapper.clearSearch();
    }
  }

  onMouseDown(mouseEvent: MouseEvent) {
    this.onPageSelected(mouseEvent);
  }

  onMouseUp(mouseEvent: MouseEvent) {
    this.onHighlightSelected(mouseEvent);
  }

  private setupAnnotationSet(annotationSet: AnnotationSet) {
    this.destroyAnnotationComponents();
    if (annotationSet) {
      this.annotationSet = annotationSet;
      this.annotationSet.annotations.forEach(annotation => this.createOrFindAnnotationSetComponent(annotation.page) );
    }
  }

  private setupCommentSet(page: number): ComponentRef<CommentSetComponent> {
    const component = this.createCommentSetComponent(page);
    this.commentSetComponents.push(component);
    return component;
  }

  destroyAnnotationComponents() {
    this.annotationSetComponents.forEach(component => component.destroy());
    this.commentSetComponents.forEach(component => component.destroy());
    this.annotationSetComponents = [];
    this.commentSetComponents = [];
  }

  onPageRendered(pageRenderEvent: PageEvent) {
    const annotationComponent = this.findAnnotationSetComponent(pageRenderEvent.pageNumber);
    if (annotationComponent) {
      this.initAnnotationComponent(annotationComponent, pageRenderEvent.source);
    }

    let commentSetComponent = this.commentSetComponents
      .find((commentSet) => commentSet.instance.page === pageRenderEvent.pageNumber);

    if (!commentSetComponent) {
      commentSetComponent = this.setupCommentSet(pageRenderEvent.pageNumber);
      commentSetComponent.instance.initialise(pageRenderEvent.source);
    } else if (commentSetComponent) {
      commentSetComponent.instance.setCommentSetValues(pageRenderEvent.source);
    }
  }

  onPageSelected(mouseEvent: MouseEvent) {
    if (this.toolbarEvents.highlightMode.getValue() || this.toolbarEvents.drawMode.getValue()) {
      const pageEvent = this.pdfWrapper.createCurrentPageEvent();
      this.createOrFindAnnotationSetComponent(pageEvent.pageNumber, pageEvent.source);
      if (this.toolbarEvents.drawMode.getValue()) {
        setTimeout(() => {
          this.viewerEvents.onShapeSelection({
            page: this.pdfWrapper.getPageNumber(),
            event: mouseEvent
          });
        }, 0);
      }
    }
  }

  onHighlightSelected(mouseEvent: MouseEvent) {
    if (this.toolbarEvents.highlightMode.getValue()) {
      setTimeout(() => {
        this.viewerEvents.onTextSelection({
          page: this.pdfWrapper.getPageNumber(),
          event: mouseEvent
        });
      }, 0);
    }
  }

  private createOrFindAnnotationSetComponent(page: number, eventSource?: PageEvent['source']): ComponentRef<AnnotationSetComponent> {
    let component = this.findAnnotationSetComponent(page);
    if (component === undefined) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(AnnotationSetComponent);
      component = this.viewContainerRef.createComponent(factory);
      component.instance.annotationSet = this.annotationSet;
      component.instance.page = page;
      if (event) {
        this.initAnnotationComponent(component, eventSource);
      }
    }
    return component;
  }

  private findAnnotationSetComponent(page: number): ComponentRef<AnnotationSetComponent> | undefined {
    return this.annotationSetComponents.find(ref => ref.instance.page === page );
  }

  private initAnnotationComponent(component: ComponentRef<AnnotationSetComponent>, eventSource: PageEvent['source']) {
    component.instance.initialise(eventSource);
  }

  private createCommentSetComponent(page: number): ComponentRef<CommentSetComponent> {
    const factory = this.componentFactoryResolver.resolveComponentFactory(CommentSetComponent);
    const component = this.viewContainerRef.createComponent(factory);
    component.instance.annotationSet = this.annotationSet;
    component.instance.page = page;
    return component;
  }
}
