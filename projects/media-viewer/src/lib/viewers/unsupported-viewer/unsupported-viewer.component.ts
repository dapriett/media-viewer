import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { Subscription } from 'rxjs';
import { DownloadService } from '../../download.service';

@Component({
  selector: 'mv-unsupported-viewer',
  templateUrl: './unsupported-viewer.component.html',
  styleUrls: ['./unsupported-viewer.component.scss']
})
export class UnsupportedViewerComponent implements OnInit, OnDestroy {

  @Input() url: string;
  @Input() originalUrl: string;
  @Input() downloadFileName: string;

  @Output() loadStatus = new EventEmitter<string>();

  private subscriptions: Subscription[] = [];

  constructor(
    public readonly toolbarEvents: ToolbarEventService,
    public readonly downloadService: DownloadService
  ) {}

  public ngOnInit(): void {
    this.subscriptions.push(
      this.toolbarEvents.download.subscribe(async () => await this.downloadFile())
    );
    this.loadStatus.emit("UNSUPPORTED");
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  async downloadFile() {
    await this.downloadService.downloadFile(this.url, this.downloadFileName);
  }
}
