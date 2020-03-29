import * as fromAnnotations from '../actions/annotations.action';
import * as fromTags from '../actions/tags.actions';
import {TagsModel} from '../../annotations/models/tags.model';
import {StoreUtils} from '../store-utils';

export interface TagsState {
  tagEntities: {[id: string]: TagsModel[]};
}

export const initialTagState: TagsState = {
  tagEntities: {},
};

export function tagsReducer (
  state = initialTagState,
  action: fromAnnotations.AnnotationsActions | fromTags.TagsActions
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
      const annotation = action.payload;
      const isDelete = !annotation.comments.length && !annotation.tags.length;
      const tagEntities = {
        ...state.tagEntities,
        [annotation.id]: annotation.tags
      };

      if (isDelete) {
        delete tagEntities[annotation.annotationId];
      }
      return {
        ...state,
        tagEntities
      };
    }

    case fromAnnotations.DELETE_ANNOTATION_SUCCESS: {
      const annotation = action.payload;
      const tagEntities = {
        ...state.tagEntities,
      };
      delete tagEntities[annotation];
      return {
        ...state,
        tagEntities
      };
    }

    case fromTags.UPDATE_TAGS: {
      const payload = action.payload;
      const tagEntities = {
        ...state.tagEntities,
        [payload.annoId]: payload.tags
      };

      return {
        ...state,
        tagEntities
      };
    }

  }
  return state;
}

export const getTagEnt = (state: TagsState) => state.tagEntities;


