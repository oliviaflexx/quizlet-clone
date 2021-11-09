import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { UserTermDoc } from './user-term';

interface UserSetAttrs {
  owner_id: string;
  set_id: string;
  user_terms: UserTermDoc[];
}

export interface UserSetDoc extends mongoose.Document {
  owner_id: string;
  set_id: string;
  user_terms: UserTermDoc[];
  flashcards: {
    last_studied: Date | undefined;
    current_index: number;
    num_times_completed: number;
  };
  write: {
    last_studied: Date | undefined;
    current_index: number;
    num_times_completed: number;
    remaining: number;
    correct: number;
    incorrect: number;
  };
  test: {
    last_studied: Date | undefined;
    percent_correct: number | undefined;
  };
}

interface UserSetModel extends mongoose.Model<UserSetDoc> {
  build(attrs: UserSetAttrs): UserSetDoc;
}

const userSetSchema = new mongoose.Schema(
  {
    owner_id: {
      type: String,
      required: true,
    },
    set_id: {
      type: String,
      required: true,
    },
    user_terms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserTerm",
      },
    ],
    flashcards: {
      last_studied: {
        type: Date,
        required: false,
      },
      current_index: {
        type: Number,
        required: true,
        default: 0,
      },
      num_times_completed: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    write: {
      last_studied: {
        type: Date,
        required: false,
      },
      current_index: {
        type: Number,
        required: true,
        default: 0,
      },
      num_times_completed: {
        type: Number,
        required: true,
        default: 0,
      },
      remaining: {
        type: Number,
        required: true,
        default: 0,
      },
      correct: {
        type: Number,
        required: true,
        default: 0,
      },
      incorrect: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    test: {
      last_studied: {
        type: Date,
        required: false,
      },
      num_times_completed: {
        type: Number,
        required: true,
        default: 0,
      },
      percent_correct: {
        type: Number,
        required: false,
      },
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

userSetSchema.set("versionKey", "version");
userSetSchema.plugin(updateIfCurrentPlugin);

userSetSchema.statics.build = (attrs: UserSetAttrs) => {
  return new UserSet(attrs);
};
const UserSet = mongoose.model<UserSetDoc, UserSetModel>("UserSet", userSetSchema);

export { UserSet };