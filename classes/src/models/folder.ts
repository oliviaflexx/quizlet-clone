import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface FolderAttrs {
  title: string;
  id: string;
  creator: string;
  num_of_sets: number;
}

export interface FolderDoc extends mongoose.Document {
  title: string;
  version: number;
  creator: string;
  num_of_sets: number;
}

interface FolderModel extends mongoose.Model<FolderDoc> {
  build(attrs: FolderAttrs): FolderDoc;
}

const folderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    num_of_sets: {
      type: Number,
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

folderSchema.set("versionKey", "version");
folderSchema.plugin(updateIfCurrentPlugin);

folderSchema.statics.build = (attrs: FolderAttrs) => {
  return new Folder({
      _id: attrs.id,
      title: attrs.title,
      num_of_sets: attrs.num_of_sets,
      creator: attrs.creator
  });
};
const Folder = mongoose.model<FolderDoc, FolderModel>("Folder", folderSchema);

export { Folder };
