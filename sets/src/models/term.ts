import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TermAttrs {
  term: string;
  definition: string;
}

export interface TermDoc extends mongoose.Document {
  term: string;
  definition: string;
  version: number;
}

interface TermModel extends mongoose.Model<TermDoc> {
  build(attrs: TermAttrs): TermDoc;
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

termSchema.set('versionKey', 'version');
termSchema.plugin(updateIfCurrentPlugin);

termSchema.statics.build = (attrs: TermAttrs) => {
  return new Term(attrs);
};


const Term = mongoose.model<TermDoc, TermModel>("Term", termSchema);

export { Term };