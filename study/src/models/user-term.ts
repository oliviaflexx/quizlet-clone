import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { TermStatusOptions } from "../term_status_options";
import { TermDoc } from './term';

interface UserTermAttrs {
  term_id: TermDoc;
}

export interface UserTermDoc extends mongoose.Document {
  starred: boolean;
  status: TermStatusOptions;
  study_num: number;
  term_id: TermDoc;
}

interface UserTermModel extends mongoose.Model<UserTermDoc> {
    build(attrs: UserTermAttrs): UserTermDoc;
}

const userTermSchema = new mongoose.Schema(
  {
    starred: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(TermStatusOptions),
      default: TermStatusOptions.Not_Studied,
    },
    study_num: {
      type: Number,
      required: true,
      default: 0,
    },
    term_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Term"
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

userTermSchema.set("versionKey", "version");
userTermSchema.plugin(updateIfCurrentPlugin);

userTermSchema.statics.build = (attrs: UserTermAttrs) => {
    return new UserTerm(attrs);
}

const UserTerm = mongoose.model<UserTermDoc, UserTermModel>(
  "UserTerm",
  userTermSchema
);

export { UserTerm };