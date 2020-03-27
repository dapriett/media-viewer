import * as fromAnnotations from '../actions/annotations.action';
import {TagItemModel} from '../../annotations/models/tag-item.model';
import {StoreUtils} from '../store-utils';

export interface TagsState {
  tagEntities: {[id: string]: TagItemModel[]};
}

export const initialState: TagsState = {
  tagEntities: {},
};

export function reducer (
  state = initialState,
  action: fromAnnotations.AnnotationsActions
): TagsState {
  switch (action.type) {
    case fromAnnotations.LOAD_ANNOTATION_SET_SUCCESS: {
      const annotations = action.payload.annotations;
      const tagEntities = StoreUtils.generateTagEntities(annotations);
      return {
        ...state,
        tagEntities
      };
    }

    case fromAnnotations.SAVE_ANNOTATION_SUCCESS: {
      const annotations = [action.payload];
      const tagEntities = StoreUtils.generateTagEntities(annotations);
      return {
        ...state,
        tagEntities
      };
    }

  }
  return state;
}

export const getTagEnt = (state: TagsState) => state.tagEntities;


