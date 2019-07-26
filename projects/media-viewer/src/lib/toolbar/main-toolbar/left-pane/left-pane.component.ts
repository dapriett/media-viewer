import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToolbarEventService } from '../../toolbar-event.service';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mv-tb-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['../../../styles/main.scss']
})
export class ToolbarLeftPaneComponent implements OnInit, OnDestroy {
  public pageNumber = 1;
  private subscriptions: Subscription[] = [];

  constructor(
    public readonly toolbarEvents: ToolbarEventService,
    public readonly toolbarButtons: ToolbarButtonVisibilityService
  ) {}

  public ngOnInit(): void {
    this.subscriptions.push(
      this.toolbarEvents.setCurrentPage.subscribe(pageNumber => this.setCurrentPage(pageNumber))
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // Handler onClick Event of the Highlight Mode Button
  onClickHighlightToggle() {
    // Emit an event that HighlightMode has been enabled/disabled
    this.toolbarEvents.toggleHighlightMode();
  }
  // Handler onClick Event of the Draw Mode Button
  onClickDrawToggle() {
    // Emit an event that HighlightMode has been enabled/disabled
    this.toolbarEvents.toggleDrawMode();
  }

  toggleSideBar() {
    this.toolbarButtons.sidebarOpen.next(!this.toolbarButtons.sidebarOpen.getValue());
  }

  toggleSearchBar() {
    this.toolbarButtons.searchBarHidden.next(!this.toolbarButtons.searchBarHidden.getValue());
  }

  increasePageNumber() {
    this.toolbarEvents.changePageByDelta.next(1);
  }

  decreasePageNumber() {
    this.toolbarEvents.changePageByDelta.next(-1);
  }

  onPageNumberInputChange(pageNumber: string) {
    this.toolbarEvents.setCurrentPage.next(Number.parseInt(pageNumber, 0));
  }

  private setCurrentPage(pageNumber: number) {
    this.pageNumber = pageNumber;
  }
}