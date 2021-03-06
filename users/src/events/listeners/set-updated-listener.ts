import { Message } from "node-nats-streaming";
import { Subjects, Listener, SetUpdatedEvent, NotFoundError } from "@quizlet-clone/common";
import { queueGroupName } from "./queue-group-name";
import { Set } from "../../models/set";
import { natsWrapper } from "../../nats-wrapper";

export class SetUpdatedListener extends Listener<SetUpdatedEvent> {
  subject: Subjects.SetUpdated = Subjects.SetUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: SetUpdatedEvent["data"], msg: Message) {
    const { title, id, termId, term_amount } = data;


    // IF TERMID IS DEFINED THEN COPY THE SET LENGTH TO THE SET

    const set = await Set.findById(id);
    if (!set) {
      throw new NotFoundError();

    } else if (termId) {
      set.set({ num_of_terms: term_amount });

      await set.save();

    } else {
      set.set({ title: title });
      await set.save();
    }


    msg.ack();
  }
}
