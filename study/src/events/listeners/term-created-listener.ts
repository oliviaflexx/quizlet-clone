import { Message } from "node-nats-streaming";
import { Subjects, Listener, TermCreatedEvent } from "@quizlet-clone/common";
import { Term } from "../../models/term";
import { UserTerm } from "../../models/user-term";
import { UserSet, UserSetDoc } from "../../models/user-set";
import { queueGroupName } from "./queue-group-name";

export class TermCreatedListener extends Listener<TermCreatedEvent> {
  subject: Subjects.TermCreated = Subjects.TermCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TermCreatedEvent["data"], msg: Message) {
    const { id, term, definition, set_id } = data;

    const newTerm = Term.build({
      id,
      set_id,
      term,
      definition,
    });
    
    await newTerm.save();

    const sets = await UserSet.find({set_id: set_id});

    for (let set of sets) {
      let newUserTerm = UserTerm.build({
        term: newTerm.term,
        definition: newTerm.definition,
      });

      await newUserTerm.save();

      console.log(newUserTerm);
      set.user_terms.push(newUserTerm);
      await set.save();
      console.log(set);
    }

    msg.ack();
  }
};