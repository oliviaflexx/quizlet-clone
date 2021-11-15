import { Publisher, Subjects, StudyCompleteEvent } from "@quizlet-clone/common";

export class StudyCompletePublisher extends Publisher<StudyCompleteEvent> {
  readonly subject = Subjects.StudyComplete;
}
