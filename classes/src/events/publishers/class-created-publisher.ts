import { Publisher, Subjects, ClassCreatedEvent } from "@quizlet-clone/common";

export class ClassCreatedPublisher extends Publisher<ClassCreatedEvent> {
  readonly subject = Subjects.ClassCreated;
}
