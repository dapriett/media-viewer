import { Component, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { PrintService } from '../print.service';
import { ToolbarEventService } from '../toolbar/toolbar-event.service';
import { AnnotationSet } from '../annotations/annotation-set/annotation-set.model';
import { CommentsSummary } from './comments-summary.model';

@Component({
  selector: 'mv-comments-summary',
  templateUrl: './comments-summary.component.html',
  styleUrls: ['./comments-summary.component.scss']
})
export class CommentsSummaryComponent implements OnChanges {

  @Input() title: string;
  @Input() contentType: string;
  @Input() annotationSet: AnnotationSet | null;

  comments: CommentsSummary[] = [];

  @ViewChild('commentContainer') commentsTable: ElementRef;

  constructor(
    private readonly printService: PrintService,
    private readonly toolbarEvents: ToolbarEventService
  ) {}

  ngOnChanges() {
    if (this.annotationSet) {
      this.annotationSet.annotations
        .forEach(c => {
          this.comments.push({
            page: c.page,
            comment: c.comments[0],
            x: c.rectangles[0].x,
            y: c.rectangles[0].y
          });
        });
      this.comments
        .sort((a, b) => (a.y >= b.y || a.x >= b.x) ? 1 : -1)
        .sort((a, b) => a.page - b.page);
    }
  }

  public onClose(): void {
    this.toolbarEvents.displayCommentSummary();
  }

  public onPrint(): void {
    this.printService.printElementNatively(this.commentsTable.nativeElement, 1000, 900);
  }

  navigateToPage(pageNumber: number) {
    this.toolbarEvents.setPage(pageNumber);
    this.toolbarEvents.displayCommentSummary();
  }
}
