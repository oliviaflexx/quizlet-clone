import { Message } from "node-nats-streaming";
import { Subjects, Listener, SetCreatedEvent, NotFoundError } from "@quizlet-clone/common";
import { queueGroupName } from "./queue-group-name";
import { Set } from "../../models/set";
import { natsWrapper } from "../../nats-wrapper";
import { User } from "../../models/user";
import { Library } from "../../models/library";

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

    const user = await User.findOne({ name: creator });

    if (!user) {
      throw new NotFoundError();
    }

    const library = await Library.findOne({ user: user });

    if (!library) {
      throw new NotFoundError();
    }

    library.sets.created.push({ date: new Date(), set: newSet });

    await library.save();
    
    msg.ack();
  }
}
