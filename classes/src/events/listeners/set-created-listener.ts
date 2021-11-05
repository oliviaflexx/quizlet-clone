import { Message } from "node-nats-streaming";
import { Subjects, Listener, SetCreatedEvent } from "@quizlet-clone/common";
import { queueGroupName } from "./queue-group-name";
import { Set } from "../../models/set";
import { natsWrapper } from "../../nats-wrapper";

export class SetCreatedListener extends Listener<SetCreatedEvent> {
  subject: Subjects.SetCreated = Subjects.SetCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: SetCreatedEvent["data"], msg: Message) {
    const { title, id, creator } = data;

    const num_of_terms = 0;
    
    const newSet = Set.build({
        id,
        title,
        creator,
        num_of_terms
    })

    await newSet.save();

    msg.ack();
  }
}
