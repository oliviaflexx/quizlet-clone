import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { SetDoc } from "./set";

interface FolderAttrs {
  title: string;
  creatorId: string;
  creatorName: string;
  dateCreated: Date;
}


interface FolderDoc extends mongoose.Document {
  title: string;
  version: number;
  creatorId: string;
  creatorName: string;
  dateCreated: Date;
  sets: SetDoc[];
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
    creatorId: {
      type: String,
      required: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    sets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Set",
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

folderSchema.set('versionKey', 'version');
folderSchema.plugin(updateIfCurrentPlugin);

folderSchema.statics.build = (attrs: FolderAttrs) => {
  return new Folder(attrs);
};
const Folder = mongoose.model<FolderDoc, FolderModel>("Folder", folderSchema);

export { Folder };
