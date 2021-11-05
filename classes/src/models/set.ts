import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface SetAttrs {
  title: string;
  id: string;
  num_of_terms: number;
  creator: string;
}

export interface SetDoc extends mongoose.Document {
  title: string;
  num_of_terms: number;
  creator: string;
  version: number;
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
    creator: {
      type: String,
      required: true,
    },
    num_of_terms: {
      type: Number,
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

setSchema.set("versionKey", "version");
setSchema.plugin(updateIfCurrentPlugin);

setSchema.statics.build = (attrs: SetAttrs) => {
  return new Set({
    _id: attrs.id,
    title: attrs.title,
    num_of_terms: attrs.num_of_terms,
    creator: attrs.creator,
  });
};
const Set = mongoose.model<SetDoc, SetModel>("Set", setSchema);

export { Set };
