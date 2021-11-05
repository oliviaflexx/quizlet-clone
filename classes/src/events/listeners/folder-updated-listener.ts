import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  FolderUpdatedEvent,
  NotFoundError,
} from "@quizlet-clone/common";
import { queueGroupName } from "./queue-group-name";
import { Folder } from "../../models/folder";

export class FolderUpdatedListener extends Listener<FolderUpdatedEvent> {
  subject: Subjects.FolderUpdated = Subjects.FolderUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: FolderUpdatedEvent["data"], msg: Message) {
    const { title, id, setId, set_amount } = data;

    // IF TERMID IS DEFINED THEN COPY THE SET LENGTH TO THE SET

    const folder = await Folder.findById(id);

    if (!folder) {
      throw new NotFoundError();

    } else if (setId) {

      folder.set({ num_of_sets: set_amount });
      await folder.save();

      console.log(folder);
    } else {

      folder.set({ title: title });
      await folder.save();
    }

    msg.ack();
  }
}
