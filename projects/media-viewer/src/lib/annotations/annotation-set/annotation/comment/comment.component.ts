import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { Comment } from './comment.model';
import { User } from '../../../user/user.model';
import {Rectangle} from '../rectangle/rectangle.model';

@Component({
  selector: 'mv-anno-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {

  private readonly MAX_COMMENT_LENGTH = 50;

  lastUpdate: string;
  originalComment: string;
  fullComment: string;
  author: User;
  editor: User;
  _editable: boolean;
  _selected: boolean;

  @Output() click = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() updated = new EventEmitter<String>();
  @Input() rotate = 0;
  @Input() zoom = 1;
  @Input() rectangle: Rectangle;
  @ViewChild('form') form: ElementRef;
  @ViewChild('textArea') textArea: ElementRef;

  @Input()
  set comment(comment: Comment) {
    this.lastUpdate = comment.lastModifiedDate ? comment.lastModifiedDate : comment.createdDate;
    this.author = comment.createdByDetails;
    this.editor = comment.lastModifiedByDetails;
    this.originalComment = comment.content;
    this.fullComment = this.originalComment;
  }

  @Input()
  set selected(selected: boolean) {
    this._selected = selected;
  }

  get selected() {
    return this._selected || Boolean(!this.author && this.fullComment);
  }

  @Input()
  set editable(editable: boolean) {
    this._editable = editable;
    if (editable) {
      setTimeout(() => this.textArea.nativeElement.focus(), 0);
    }
  }

  get editable(): boolean {
    return this._editable || Boolean(!this.author && this.fullComment);
  }

  onFocusOut() {
    if (!this.author && !this.fullComment) {
      this.delete.emit();
    }
  }

  onEdit() {
    this.editable = true;
  }

  onCancel() {
    this.editable = false;
    this.fullComment = this.originalComment;
  }

  public onDelete() {
    this.delete.emit();
  }

  public onSave() {
    this.updated.emit(this.fullComment);
    this.editable = false;
  }

  onCommentClick() {
    this.click.emit();
  }

  get commentText() {
    return !this.selected && this.fullComment.length > this.MAX_COMMENT_LENGTH
      ? this.fullComment.substring(0, this.MAX_COMMENT_LENGTH - 3) + '...'
      : this.fullComment;
  }

  set commentText(text: string) {
    this.fullComment = text;
  }

  formNgStyle() {
    if (this.rotate === 0) {
      return {
        top: (this.rectangle.y * this.zoom) + 'px',
        left: this.getFirstNonNullParentProperty(this.form.nativeElement, 'clientWidth') + 'px'
      };
    } else if (this.rotate === 90) {
      return {
        top: '0px',
        left: this.rectangle.x * this.zoom + 'px',
        'transform-origin': 'top left'
      };
    } else if (this.rotate === 180) {
      return {
        top: ((this.rectangle.y * this.zoom) + (this.rectangle.height * this.zoom)) + 'px',
        left: '0px',
        'transform-origin': 'top left'
      };
    } else if (this.rotate === 270) {
      return {
        top: this.getFirstNonNullParentProperty(this.form.nativeElement, 'clientHeight') + 'px',
        left: (this.rectangle.x * this.zoom) + (this.rectangle.width * this.zoom) + 'px',
        'transform-origin': 'top left'
      };
    }
    return null;
  }

  commentStyle() {
    return [
      'aui-comment__content',
      'form-control',
      'mimic-focus',
      !this.editable ? 'view-mode' : 'edit-mode',
      !this.selected ? 'collapsed' : 'expanded',
    ];
  }

  private getFirstNonNullParentProperty(el: Node, property: string) {
    return !el.parentNode ? null : ( el.parentNode[property] ?
      el.parentNode[property] : this.getFirstNonNullParentProperty(el.parentNode, property));
  }
}
