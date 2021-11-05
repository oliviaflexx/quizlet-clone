import { Message } from "node-nats-streaming";
import { Subjects, Listener, FolderCreatedEvent } from "@quizlet-clone/common";
import { queueGroupName } from "./queue-group-name";
import { Folder } from "../../models/folder";
import { natsWrapper } from "../../nats-wrapper";

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

    msg.ack();
  }
}
