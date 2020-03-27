import { Action } from '@ngrx/store';
export const LOAD_ANNOTATION_SET = '[Annotations] Load Annotation Set';

export class LoadAnnotationSet implements Action {
  readonly type = LOAD_ANNOTATION_SET;
  constructor(public payload: string) { }
}
