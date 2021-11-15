import { Message } from "node-nats-streaming";
import { Subjects, Listener, FolderCreatedEvent, NotFoundError } from "@quizlet-clone/common";
import { queueGroupName } from "./queue-group-name";
import { Folder } from "../../models/folder";
import { natsWrapper } from "../../nats-wrapper";
import { User } from "../../models/user";
import { Library } from "../../models/library";

export class FolderCreatedListener extends Listener<FolderCreatedEvent> {
  subject: Subjects.FolderCreated = Subjects.FolderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: FolderCreatedEvent["data"], msg: Message) {
    const { title, id, creator } = data;

    const num_of_sets = 0;

    const newFolder = Folder.build({
      id,
      title,
      creator,
      num_of_sets,
    });

    await newFolder.save();

    const user = await User.findOne({name: creator});

    if (!user) {
      throw new NotFoundError();
    }

    const library = await Library.findOne({ user: user });

    if (!library) {
      throw new NotFoundError();
    }

    library.folders.created.push({date: new Date(), folder: newFolder});

    await library.save();
    
    msg.ack();
  }
}
