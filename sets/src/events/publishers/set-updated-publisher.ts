import { Publisher, Subjects, SetUpdatedEvent } from "@quizlet-clone/common";

export class SetUpdatedPublisher extends Publisher<SetUpdatedEvent> {
  readonly subject = Subjects.SetUpdated;
}
