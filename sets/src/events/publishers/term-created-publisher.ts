import { Publisher, Subjects, TermCreatedEvent } from "@quizlet-clone/common";

export class TermCreatedPublisher extends Publisher<TermCreatedEvent> {
  readonly subject = Subjects.TermCreated;
}
