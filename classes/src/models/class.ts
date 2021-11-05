import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { SetDoc } from "./set";
import { FolderDoc } from "./folder";

interface ClassAttrs {
  title: string;
  adminId: string;
  adminName: string;
  dateCreated: Date;
  school: string;
}

interface ClassDoc extends mongoose.Document {
  title: string;
  version: number;
  adminId: string;
  adminName: string;
  dateCreated: Date;
  sets: SetDoc[];
  folders: FolderDoc[];
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
    adminId: {
      type: String,
      required: true,
    },
    adminName: {
      type: String,
      required: true,
    },
    sets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Set",
      },
    ],
    folders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
      },
    ],
    members: [
        {
            type: String
        }
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

classSchema.set("versionKey", "version");
classSchema.plugin(updateIfCurrentPlugin);

classSchema.statics.build = (attrs: ClassAttrs) => {
  return new Class(attrs);
};
const Class = mongoose.model<ClassDoc, ClassModel>("Class", classSchema);

export { Class };
