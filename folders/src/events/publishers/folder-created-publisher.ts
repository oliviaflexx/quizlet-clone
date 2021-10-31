import { Publisher, Subjects, FolderCreatedEvent } from "@quizlet-clone/common";

export class FolderCreatedPublisher extends Publisher<FolderCreatedEvent> {
  readonly subject = Subjects.FolderCreated;
}
