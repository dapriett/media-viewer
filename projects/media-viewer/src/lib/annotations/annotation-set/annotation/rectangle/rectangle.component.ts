import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import { Rectangle } from './rectangle.model';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';

@Component({
  selector: 'mv-anno-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent {

  @Input() selected: boolean;
  @Input() rectangle: Rectangle;
  @Input() color: String;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() draggable = true;

  @Output() click = new EventEmitter();
  @Output() update = new EventEmitter<Rectangle>();

  constructor(private elRef: ElementRef) {}

  onClick() {
    this.click.emit();
  }

  onMove(el: HTMLElement) {
    const [left, top] = this.elRef.nativeElement.style.transform.match(/\d+/g);

    this.rectangle.x = +left / this.zoom;
    this.rectangle.y = +top / this.zoom;

    this.update.emit(this.rectangle);
  }

  onResize(event: IResizeEvent) {
    this.rectangle.width = event.size.width / this.zoom;
    this.rectangle.height = event.size.height / this.zoom;

    this.update.emit(this.rectangle);
  }

  position() {
    if (this.rotate === 90) {
      return { top: this.rectangle.x * this.zoom + 'px', right: this.rectangle.y * this.zoom + 'px' };
    } else if (this.rotate === 180) {
      return { bottom: this.rectangle.y * this.zoom + 'px', right: this.rectangle.x * this.zoom + 'px' };
    } else if (this.rotate === 270) {
      return { left: this.rectangle.y * this.zoom + 'px', bottom: this.rectangle.x * this.zoom + 'px' };
    }
    return { top: this.rectangle.y * this.zoom + 'px', left: this.rectangle.x * this.zoom + 'px' };
  }

}
