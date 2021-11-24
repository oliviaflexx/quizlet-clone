import { Message } from "node-nats-streaming";
import { Subjects, Listener, ClassCreatedEvent, NotFoundError } from "@quizlet-clone/common";
import { queueGroupName } from "./queue-group-name";
import { Class } from "../../models/class";
import { Library } from "../../models/library";
import { User } from "../../models/user";

export class ClassCreatedListener extends Listener<ClassCreatedEvent> {
  subject: Subjects.ClassCreated = Subjects.ClassCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ClassCreatedEvent["data"], msg: Message) {
    const { title, id, school, admin} = data;

    const num_of_sets = 0;

    const newClass = Class.build({
      id,
      title,
      school,
      members: [admin],
      dateCreated: new Date()
    });

    await newClass.save();

    const user = await User.findOne({name: admin});

    if (!user) {
      throw new NotFoundError();
    }

    const library = await Library.findOne({user: user});

    if (!library) {
      throw new NotFoundError();
    }

    library.classes.push(newClass);

    await library.save();


    msg.ack();
  }
}
