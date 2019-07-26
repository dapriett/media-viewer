import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Highlight {
  page: number;
  event: MouseEvent;
}

@Injectable({ providedIn: 'root' })
export class ViewerEventService {

  // Register Observable Subject Events relevant to the Viewers
  public readonly highlightedText = new Subject<Highlight>();
  public readonly highlightedShape = new Subject<Highlight>();

  constructor() {}

  // Function to inform Observers that text has been selected in the viewer
  public onTextSelection(selectionData: Highlight): void {
    this.highlightedText.next(selectionData);
  }

  // Function to inform Observers that shape has been selected in the viewer
  public onShapeSelection(selectionData: Highlight): void {
    this.highlightedShape.next(selectionData);
  }
}