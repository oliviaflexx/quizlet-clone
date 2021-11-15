import { Publisher, Subjects, StudyCreatedEvent } from "@quizlet-clone/common";

export class StudyCreatedPublisher extends Publisher<StudyCreatedEvent> {
  readonly subject = Subjects.StudyCreated;
}
