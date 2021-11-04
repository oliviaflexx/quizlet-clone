import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import {ViewOptions} from "../view-settings";
import { EditOptions } from "../edit-settings";
import { TermDoc } from './term';

interface RatingAttrs {
  average: number;
  totalRaters: number;
}

interface SetAttrs {
  title: string;
  creatorId: string;
  creatorName: string,
  viewableBy: ViewOptions;
  editableBy: string;
  dateCreated: Date;
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