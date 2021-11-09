import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TermAttrs {
  id: string;
  term: string;
  definition: string;
  set_id: string;
}

interface TermDoc extends mongoose.Document {
  term: string;
  version: number;
  definition: string;
  set_id: string;
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
    set_id: {
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

termSchema.set("versionKey", "version");
termSchema.plugin(updateIfCurrentPlugin);

termSchema.statics.build = (attrs: TermAttrs) => {
  return new Term({
    _id: attrs.id,
    term: attrs.term,
    definition: attrs.definition,
    set_id: attrs.set_id
  });
};

const Term = mongoose.model<TermDoc, TermModel>("Term", termSchema);

export { Term };
