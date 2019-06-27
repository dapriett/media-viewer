import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Rectangle } from './rectangle.model';

@Component({
  selector: 'mv-anno-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent {

  @ViewChild('rectangleDiv') rectangleDiv: ElementRef;
  @Input() selected: boolean;
  @Input() rectangle: Rectangle;
  @Input() color: String;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() draggable = true;
  x: number;
  y: number;
  left: string;
  right: string;
  top: string;
  bottom: string;

  @Output() click = new EventEmitter();
  @Output() update = new EventEmitter<Rectangle>();

  onClick() {
    this.click.emit();
  }

  onMouseDown(e) {
    console.log('selected');
    this.selected = true;
    const coordinates = this.getTrueCoordinates(e.x, e.y);
    this.x = coordinates.x;
    this.y = coordinates.y;

    document.addEventListener('mousemove', (event) => {
      this.onMouseMove(event);
    });
    document.addEventListener('mouseup', () => {
      this.onMouseUp();
    });
  }

  onMouseMove(e) {
    if (this.selected) {
      const coordinates = this.getTrueCoordinates(e.x, e.y);
      console.log(coordinates);
      if (this.rotate === 90) {
        this.left = coordinates.y + 'px';
        this.bottom = coordinates.x + 'px';
      } else if (this.rotate === 180) {
        this.right = coordinates.x + 'px';
        this.bottom = coordinates.y + 'px';
      } else if (this.rotate === 270) {
        this.right = coordinates.y + 'px';
        this.top = coordinates.x + 'px';
      } else {
        this.left = coordinates.x + 'px';
        this.top = coordinates.y + 'px';
      }
    }
  }

  onMouseUp() {
    console.log('unselected');
    this.selected = false;
  }

  getTrueCoordinates(x, y) {
    let offsetX = 0;
    let offsetY = 0;

    let element = this.rectangleDiv.nativeElement.offsetParent;
    const stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(element, null)['paddingLeft'], 10)     || 0;
    const stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(element, null)['paddingTop'], 10)      || 0;
    const styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(element, null)['borderLeftWidth'], 10) || 0;
    const styleBorderTop   = parseInt(document.defaultView.getComputedStyle(element, null)['borderTopWidth'], 10)  || 0;

    if (element.offsetParent) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }
    // Add padding and border style widths to offset
    offsetX += stylePaddingLeft;
    offsetY += stylePaddingTop;

    offsetX += styleBorderLeft;
    offsetY += styleBorderTop;

    return {
      x: (x + scrollX) - offsetX,
      y: (y + scrollY) - offsetY,
    };
  }
}
