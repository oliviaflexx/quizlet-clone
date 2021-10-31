import mongoose, { mongo } from "mongoose";

interface TermAttrs {
    term: string,
    definition: string
    term_id: string
}

interface TermDoc extends mongoose.Document {
  term: string;
  definition: string;
  term_id: string;
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
    term_id: {
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

// termSchema.index({term: 'text', definition: 'text'});

termSchema.statics.build = (attrs: TermAttrs) => {
    return new Term(attrs);
}

const Term = mongoose.model<TermDoc, TermModel>('Term', termSchema);

export { Term };