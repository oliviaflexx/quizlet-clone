import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  StudyCreatedEvent,
  NotFoundError,
} from "@quizlet-clone/common";
import { queueGroupName } from "./queue-group-name";
import { Set } from "../../models/set";
import { natsWrapper } from "../../nats-wrapper";
import { User } from "../../models/user";
import { Library } from "../../models/library";

export class StudyCreatedListener extends Listener<StudyCreatedEvent> {
  subject: Subjects.StudyCreated = Subjects.StudyCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: StudyCreatedEvent["data"], msg: Message) {
    const { type, userId, date, setId } = data;

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError();
    }

    const library = await Library.findOne({ user: user });

    if (!library) {
      throw new NotFoundError();
    }

    const set = await Set.findById(setId);

    if (!set) {
      throw new NotFoundError();
    }
    let study = library.sets.studied.find((study) => (study.set = set));

    if (!study) {
      library.sets.studied.push({
        set: set,
        flashcards: { latestDate: undefined, numTimesCompleted: 0 },
        write: { latestDate: undefined, numTimesCompleted: 0 },
        test: { latestDate: undefined, numTimesCompleted: 0 },
      });
      study = library.sets.studied.find((study) => (study.set = set));
    }

    if (type === "flashcards") {
      study!.flashcards.latestDate = date;
    } else if (type === "write") {
      study!.write.latestDate = date;

    } else if (type === "test") {
      study!.test.latestDate = date;
    }

    await library.save();

    msg.ack();
  }
}
