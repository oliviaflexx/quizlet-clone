import mongoose from "mongoose";
import { UserDoc } from "./user";
import { SetDoc } from "./set";
import { FolderDoc } from "./folder";
import { ClassDoc } from "./class";

interface LibraryAttrs {
  user: UserDoc;
}

interface LibraryDoc extends mongoose.Document {
  user: UserDoc;
  sets: {
    created: [
      {
        date: Date;
        set: SetDoc;
      }
    ];
    studied: [
      {
        set: SetDoc;
        flashcards: {
          latestDate: Date | undefined;
          numTimesCompleted: number;
        };
        write: {
          latestDate: Date | undefined;
          numTimesCompleted: number;
        };
        test: {
          latestDate: Date | undefined;
          numTimesCompleted: number;
        };
      }
    ];
  };
  folders: {
    created: [
      {
        date: Date;
        folder: FolderDoc;
      }
    ];
  };
  classes: ClassDoc[];
}

interface LibraryModel extends mongoose.Model<LibraryDoc> {
  build(attrs: LibraryAttrs): LibraryDoc;
}

const librarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sets: {
      created: [
        {
          date: {
            type: Date,
            required: true,
          },
          set: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Set",
          },
        },
      ],
      studied: [
        {
          set: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Set",
          },
          flashcards: {
            latestDate: {
              type: Date, undefined,
            },
            numTimesCompleted: {
              type: Number,
            },
          },
          write: {
            latestDate: {
              type: Date, undefined,
            },
            numTimesCompleted: {
              type: Number,
            },
          },
          test: {
            latestDate: {
              type: Date, undefined,
            },
            numTimesCompleted: {
              type: Number,
            },
          },
        },
      ],
    },
    folders: {
      created: [
        {
          date: {
            type: Date,
            required: true,
          },
          folder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
          },
        },
      ],
    },
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
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

librarySchema.statics.build = (attrs: LibraryAttrs) => {
    return new Library(attrs);
}

const Library = mongoose.model<LibraryDoc, LibraryModel>("Library", librarySchema);

export { Library };