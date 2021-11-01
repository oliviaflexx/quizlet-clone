import { Message } from "node-nats-streaming";
import { Subjects, Listener, TermCreatedEvent } from "@quizlet-clone/common";
import { Term } from "../../models/term";
import { queueGroupName } from "./queue-group-name";

export class TermCreatedListener extends Listener<TermCreatedEvent> {
  subject: Subjects.TermCreated = Subjects.TermCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TermCreatedEvent["data"], msg: Message) {
    const { id, term, definition } = data;

    const newTerm = Term.build({
      id,
      term,
      definition,
    });
    
    await newTerm.save();

    msg.ack();
  }
}
