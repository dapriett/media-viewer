import { Component } from '@angular/core';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';
import { ToolbarEventService } from '../../toolbar-event.service';

@Component({
  selector: 'mv-sub-toolbar',
  templateUrl: './sub-toolbar.component.html',
  styleUrls: ['../../../styles/main.scss']
})
export class SubToolbarComponent {

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    public readonly toolbarEvents: ToolbarEventService
  ) {}

  onClickHighlightToggle() {
    this.toolbarEvents.toggleHighlightMode();
    this.closeMenu();
  }

  onClickDrawToggle() {
    this.toolbarEvents.toggleDrawMode();
    this.closeMenu();
  }

  printFile() {
    this.toolbarEvents.print.next(true);
    this.closeMenu();
  }

  downloadFile() {
    this.toolbarEvents.download.next(true);
    this.closeMenu();
  }

  rotateCcw() {
    this.toolbarEvents.rotate.next(270);
    this.closeMenu();
  }

  rotateCw() {
    this.toolbarEvents.rotate.next(90);
    this.closeMenu();
  }

  closeMenu() {
    this.toolbarButtons.subToolbarHidden.next(true);
  }

}
