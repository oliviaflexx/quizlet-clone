import { Publisher, Subjects, SetCreatedEvent } from "@quizlet-clone/common";

export class SetCreatedPublisher extends Publisher<SetCreatedEvent> {
  readonly subject = Subjects.SetCreated;
}
