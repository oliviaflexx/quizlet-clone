import { Message } from "node-nats-streaming";
import { Subjects, Listener, TermUpdatedEvent } from "@quizlet-clone/common";
import { Term } from "../../models/term";
import { queueGroupName } from "./queue-group-name";

export class TermUpdatedListener extends Listener<TermUpdatedEvent> {
  subject: Subjects.TermUpdated = Subjects.TermUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TermUpdatedEvent["data"], msg: Message) {
    const { id, term, definition, version } = data;

    const foundTerm = await Term.findOne({
        _id: id,
        version: version - 1,
    });
   

    if (!foundTerm) {
        throw new Error('Term not found')
    }

    foundTerm.set({term, definition});

    await foundTerm.save();

    msg.ack();
  }
}
