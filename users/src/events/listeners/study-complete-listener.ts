import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  StudyCompleteEvent,
  NotFoundError,
} from "@quizlet-clone/common";
import { queueGroupName } from "./queue-group-name";
import { Set } from "../../models/set";
import { natsWrapper } from "../../nats-wrapper";
import { User } from "../../models/user";
import { Library } from "../../models/library";

export class StudyCompleteListener extends Listener<StudyCompleteEvent> {
  subject: Subjects.StudyComplete = Subjects.StudyComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: StudyCompleteEvent["data"], msg: Message) {
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
    const study = library.sets.studied.find((study) => (study.set = set));

    if (!study) {
      throw new NotFoundError();
    }

    if (type === "flashcards") {
      study!.flashcards.latestDate = date;
      study!.flashcards.numTimesCompleted = study!.flashcards.numTimesCompleted + 1;

    } else if (type === "write") {
      study!.write.latestDate = date;
      study!.write.numTimesCompleted = study!.write.numTimesCompleted + 1;

    } else if (type === "test") {
      study!.test.latestDate = date;
      study!.test.numTimesCompleted = study!.test.numTimesCompleted + 1;
    }

    await library.save();

    msg.ack();
  }
}
