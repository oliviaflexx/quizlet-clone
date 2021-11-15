import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ClassAttrs {
  id: string;
  title: string;
  dateCreated: Date;
  school: string;
  members: string[];
}

export interface ClassDoc extends mongoose.Document {
  title: string;
  version: number;
  dateCreated: Date;
  numSets: number;
  school: string;
  members: string[];
}

interface ClassModel extends mongoose.Model<ClassDoc> {
  build(attrs: ClassAttrs): ClassDoc;
}

const classSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: true,
    },
    members: [{
      type: String,
      required: true,
    }],
    numSets: {
      type: Number,
      required: true,
      default: 0
    },
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

classSchema.set("versionKey", "version");
classSchema.plugin(updateIfCurrentPlugin);

classSchema.statics.build = (attrs: ClassAttrs) => {
  return new Class({
    _id: attrs.id,
    title: attrs.title,
    school: attrs.school,
    members: attrs.members,
    dateCreated: attrs.dateCreated
  });
};
const Class = mongoose.model<ClassDoc, ClassModel>("Class", classSchema);

export { Class };
