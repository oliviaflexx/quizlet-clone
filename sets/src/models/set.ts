import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import {ViewOptions} from "../view-settings";
import { EditOptions } from "../edit-settings";
import { TermDoc } from './term';

interface StudierAttrs {
  studier_id: string;
  name: string;
}

interface RatingAttrs {
  average: number;
  totalRaters: number;
}

interface FolderAttrs {
  folder_id: string;
  title: string;
  creator: string;
}

interface ClassAttrs {
  class_id: string;
  title: string;
  school: string;
}

interface SetAttrs {
  title: string;
  creatorId: string;
  creatorName: string,
  viewableBy: ViewOptions;
  editableBy: string;
  dateCreated: Date;
  studiers: StudierAttrs[] | null;
  folders: FolderAttrs[] | null;
  classes: ClassAttrs[] | null;
};

interface SetDoc extends mongoose.Document {
  title: string;
  creatorId: string;
  creatorName: string;
  version: number;
  viewableBy: ViewOptions;
  editableBy: EditOptions;
  rating: RatingAttrs;
  terms: TermDoc[];
  dateCreated: Date;
  studiers: StudierAttrs[];
  folders: FolderAttrs[];
  classes: ClassAttrs[];
}

interface SetModel extends mongoose.Model<SetDoc> {
  build(attrs: SetAttrs): SetDoc;
}

const setSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    creatorId: {
      type: String,
      required: true,
    },
    creatorName: {
      type: String,
      required: true
    },
    viewableBy: {
      type: String,
      required: true,
      enum: Object.values(ViewOptions),
    },
    editableBy: {
      type: String,
      required: true,
      enum: [EditOptions.Classes, EditOptions.Password, EditOptions.Me],
    },
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      totalRaters: {
        type: Number,
        default: 0,
      },
    },
    terms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Term",
      },
    ],
    dateCreated: {
      type: Date,
      required: true,
    },
    studiers: [
      {
        studier_id: String,
        name: String,
      },
    ],
    folders: [
      {
        folder_id: String,
        title: String,
        creator: String,
      },
    ],
    classes: [
      {
        class_id: String,
        title: String,
        school: String,
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

setSchema.set('versionKey', 'version');
setSchema.plugin(updateIfCurrentPlugin);

setSchema.statics.build = (attrs: SetAttrs) => {
  return new Set(attrs);
};
const Set = mongoose.model<SetDoc, SetModel>('Set', setSchema);

export { Set };