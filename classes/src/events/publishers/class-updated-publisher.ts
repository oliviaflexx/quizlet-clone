import { Publisher, Subjects, ClassUpdatedEvent } from "@quizlet-clone/common";

export class ClassUpdatedPublisher extends Publisher<ClassUpdatedEvent> {
  readonly subject = Subjects.ClassUpdated;
}
