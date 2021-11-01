import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface FolderAttrs {
  title: string;
  creator: string;
  dateCreated: Date;
}

interface FolderDoc extends mongoose.Document {
  title: string;
  version: number;
  creator: string;
  dateCreated: Date;
  sets: [{
    set_id: string,
    title: string,
    creator: string,
    terms: number,
  }]
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
    sets: [
      {
          set_id: String,
          title: String,
          creator: String,
          terms: Number
      },
    ],
    dateCreated: {
      type: Date,
      required: true,
    }
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
