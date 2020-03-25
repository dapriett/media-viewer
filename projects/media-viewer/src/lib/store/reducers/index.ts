import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromAnnotation from './annotatons.reducer';
import * as fromBookmarks from './bookmarks.reducer';
import {AnnotationSetState} from './annotatons.reducer';
import { BookmarksState } from './bookmarks.reducer';

export interface State {
  annotationsReducer: fromAnnotation.AnnotationSetState;
  bookmarksReducer: fromBookmarks.BookmarksState;
}

export const reducers: ActionReducerMap<State> = {
  annotationsReducer: fromAnnotation.reducer,
  bookmarksReducer: fromBookmarks.bookmarksReducer,
};

export const getAnnoSetState = createFeatureSelector<AnnotationSetState>('annotationsReducer');
export const getBookmarksState = createFeatureSelector<BookmarksState>('bookmarksReducer');

export * from './annotatons.reducer';
export * from './bookmarks.reducer';
