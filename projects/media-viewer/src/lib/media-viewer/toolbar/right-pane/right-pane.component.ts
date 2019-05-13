import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionEvents, PrintOperation, DownloadOperation } from '../../media-viewer.model';

@Component({
  selector: 'mv-tb-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrls: ['../styles/toolbar.component.scss']
})
export class ToolbarViewerRightComponent {

  @Input() actionEvents: ActionEvents;
  @Input() subToolbarHide: BehaviorSubject<boolean>;

  constructor() {}

  toggleSecondaryToolbar() {
    this.subToolbarHide.next(!this.subToolbarHide.getValue());
  }

  printFile() {
    this.actionEvents.print.next(new PrintOperation());
  }

  downloadFile() {
    this.actionEvents.download.next(new DownloadOperation());
  }
}
