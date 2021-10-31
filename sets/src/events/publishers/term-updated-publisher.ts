import { Publisher, Subjects, TermUpdatedEvent } from "@quizlet-clone/common";

export class TermUpdatedPublisher extends Publisher<TermUpdatedEvent> {
  readonly subject = Subjects.TermUpdated;
}
