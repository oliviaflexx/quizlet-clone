import mongoose, { mongo } from "mongoose";

interface TermAttrs {
    term: string,
    definition: string
}

interface SetAttrs {
title: string;
  creator: string;
  viewableBy: string;
  editableBy: string;
  terms: TermAttrs[];
}

interface SetDoc extends mongoose.Document {
  title: string;
  creator: string;
  viewableBy: string;
  editableBy: string;
  terms: TermAttrs[];
}

interface SetModel extends mongoose.Model<SetDoc> {
  build(attrs: SetAttrs): SetDoc;
}

const termSchema = new mongoose.Schema(
    {
    term: {
        type: String,
        required: true
    }, 
    definition: {
        type: String,
        required: true
    }
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
    },
    editableBy: {
      type: String,
      required: true,
    },
    terms: [termSchema],
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