import { Component, Input } from '@angular/core';
import {Rectangle} from '../rectangle.model';

@Component({
  selector: 'mv-popup-toolbar',
  templateUrl: './popup-toolbar.component.html',
  styleUrls: ['./popup-toolbar.component.scss']
})
export class PopupToolbarComponent {

  readonly HEIGHT = 70;
  readonly WIDTH = 350;

  @Input() rectangle: Rectangle;
  @Input() zoom = 1;
  @Input() rotate = 0;

  popupStyles() {
    if (this.rotate === 0) {
      return {
        top: this.rectangle.y * this.zoom - this.HEIGHT + 'px',
        left: ((this.rectangle.x + (this.rectangle.width / 2)) * this.zoom - (this.WIDTH / 2)) + 'px'
      };
    } else if (this.rotate === 90) {
      return {
        top: this.rectangle.x * this.zoom - this.HEIGHT + 'px',
        right: ((this.rectangle.y + this.rectangle.height / 2) * this.zoom) - (this.WIDTH / 2) + 'px'
      };
    } else if (this.rotate === 180) {
      return {
        bottom: (this.rectangle.y + this.rectangle.height) * this.zoom + 10 + 'px',
        right: ((this.rectangle.x + (this.rectangle.width / 2)) * this.zoom - (this.WIDTH / 2)) + 'px'
      };
    } else if (this.rotate === 270) {
      return {
        bottom: (this.rectangle.x + this.rectangle.width) * this.zoom + 10 + 'px',
        left: ((this.rectangle.y + (this.rectangle.height / 2)) * this.zoom) - (this.WIDTH / 2) + 'px'
      };
    }
  }

}
