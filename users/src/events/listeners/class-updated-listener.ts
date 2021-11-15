import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ClassUpdatedEvent,
  NotFoundError,
} from "@quizlet-clone/common";
import { queueGroupName } from "./queue-group-name";
import { Class } from "../../models/class";
import { User } from "../../models/user";
import { Library } from "../../models/library";

export class ClassUpdatedListener extends Listener<ClassUpdatedEvent> {
  subject: Subjects.ClassUpdated = Subjects.ClassUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ClassUpdatedEvent["data"], msg: Message) {
    const { title, id, numSets, members, admin } = data;

    const foundClass = await Class.findById(id);

    if (!foundClass) {
        throw new NotFoundError();
    }

    foundClass.set({title, numSets, members});
    await foundClass.save();

    for (let member of foundClass.members) {
      const user = await User.findById(member);
      
      if (!user) {
        throw new NotFoundError();
      }

      const library = await Library.findOne({user: user});

      if (!library) {
        throw new NotFoundError();
      }

      if (!library.classes.includes(foundClass.id)) {
        library.classes.push(foundClass);

        await library.save();
      }
    }
    msg.ack();
  }
}
