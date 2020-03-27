import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromAnnotation from './annotatons.reducer';
import * as fromTags from './tags.reducer';
import {AnnotationSetState} from './annotatons.reducer';

export interface State {
  annotationsReducer: fromAnnotation.AnnotationSetState;
  tagsReducer: fromTags.TagsState;
}

export const reducers: ActionReducerMap<State> = {
  annotationsReducer: fromAnnotation.reducer,
  tagsReducer: fromTags.reducer
};

export const getAnnoSetState = createFeatureSelector<AnnotationSetState>('annotationsReducer');
export const getTagState = createFeatureSelector<AnnotationSetState>('tagsReducer');

export * from './annotatons.reducer';
