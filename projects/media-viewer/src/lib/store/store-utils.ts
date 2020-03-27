import {Annotation} from '../annotations/annotation-set/annotation-view/annotation.model';
import {TagItemModel} from '../annotations/models/tag-item.model';
// @dynamic
export class StoreUtils {

  static generatePageEntities(annotations): {[id: string]: Annotation[]} {
    return annotations.reduce((h, obj) =>
      Object.assign(h, { [obj.page]:( h[obj.page] || [] ).concat(obj) }), {});
  }

  static generateCommentsEntities(annotations): {[id: string]: Comment} {
     return annotations.reduce(
      (commentEntities: { [id: string]: Annotation }, annotation: Annotation) => {
        if (annotation.comments.length) {
          const comment = {
            ...annotation.comments[0]

          }
          return {
            ...commentEntities,
            [annotation.id]: comment
          };
        }
        return {
          ...commentEntities
        };
      }, {});
  }

  static generateTagEntities(annotations): {[id: string]: TagItemModel[]} {
    return annotations.reduce(
      (commentEntities: { [id: string]: Annotation }, annotation: Annotation) => {
        if (annotation.tags.length) {
          const tags = annotation.tags;
          const snakeCased = tags.map(item => {
            return {
              ...item,
              name: this.snakeCase(item.name)
            };
          });
          return {
            ...commentEntities,
            [annotation.id]: snakeCased
          };
        }
        return {
          ...commentEntities
        };
      }, {});
  }

  static generateAnnotationEntities(anno): {[id: string]: Annotation} {
    return anno.reduce(
      (annoEntities: { [id: string]: Annotation }, annotation: Annotation) => {
        const annot = {
          ...annotation,
          positionTop: annotation.rectangles[0].y // todo remove this
        };
        return {
          ...annoEntities,
          [annotation.id]: annot
        };
      }, {});
  }


  static resetCommentEntSelect(ent) {
    return Object.keys(ent).reduce((object, key) => {
      object[key] = {
        ...ent[key],
        editable: false,
        selected: false
      };
      return object;
    }, {});
  }

  static snakeCase = string => {
    // transform string_to_snake_case
    return string.replace(/\W+/g, " ")  // find space
      .split(/ |\B(?=[A-Z])/) // split it into array
      .map(word => word.toLowerCase()) // transform to lover case
      .join('_'); // trun array into sting using _
  };


}
