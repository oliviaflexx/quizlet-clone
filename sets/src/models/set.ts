import mongoose, { mongo } from "mongoose";
import {ViewOptions} from "../view-settings";
import { EditOptions } from "../edit-settings";

interface TermAttrs {
  term: string,
  definition: string
}

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
  creator: string;
  viewableBy: string;
  editableBy: string;
  terms: TermAttrs[] | null;
  dateCreated: Date;
  studiers: StudierAttrs[] | null;
  folders: FolderAttrs[] | null;
  classes: ClassAttrs[] | null;
};

interface SetDoc extends mongoose.Document {
  title: string;
  creator: string;
  viewableBy: ViewOptions;
  editableBy: EditOptions;
  rating: RatingAttrs;
  terms: TermAttrs[];
  dateCreated: Date;
  studiers: StudierAttrs[];
  folders: FolderAttrs[];
  classes: ClassAttrs[];
}

interface SetModel extends mongoose.Model<SetDoc> {
  build(attrs: SetAttrs): SetDoc;
}

const termSchema = new mongoose.Schema(
  {
    term: {
      type: String,
      required: true,
    },
    definition: {
      type: String,
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

const setSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    viewableBy: {
      type: String,
      required: true,
      enum: [
        ViewOptions.Everyone,
        ViewOptions.Classes,
        ViewOptions.Password,
        ViewOptions.Me,
      ],
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
    terms: [termSchema],
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

setSchema.statics.build = (attrs: SetAttrs) => {
  return new Set(attrs);
};
const Set = mongoose.model<SetDoc, SetModel>('Set', setSchema);

export { Set };