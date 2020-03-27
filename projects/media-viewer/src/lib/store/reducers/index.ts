import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromAnnotation from './annotatons.reducer';
import * as fromTags from './tags.reducer';
import {AnnotationSetState} from './annotatons.reducer';
import {TagsState} from './tags.reducer';

export interface State {
  annotationsReducer: fromAnnotation.AnnotationSetState;
  tagsReducer: fromTags.TagsState;
}

export const reducers: ActionReducerMap<State> = {
  annotationsReducer: fromAnnotation.reducer,
  tagsReducer: fromTags.tagsReducer
};

export const getAnnoSetState = createFeatureSelector<AnnotationSetState>('annotationsReducer');
export const getTagState = createFeatureSelector<TagsState>('tagsReducer');

export * from './annotatons.reducer';
export * from './tags.reducer';
