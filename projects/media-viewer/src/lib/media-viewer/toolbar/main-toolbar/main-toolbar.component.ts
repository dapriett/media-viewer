import { Component, Input } from '@angular/core';
import { ActionEvents } from '../../media-viewer.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mv-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class MainToolbarComponent {

  @Input() toggleSidebarOpen: BehaviorSubject<boolean>;
  @Input() toggleSearchBarHidden: BehaviorSubject<boolean>;
  @Input() toggleSubToolbarHidden: BehaviorSubject<boolean>;

  constructor() {}

  @Input() actionEvents: ActionEvents;
}
