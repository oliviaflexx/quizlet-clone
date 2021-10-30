import { Publisher, Subjects, FolderUpdatedEvent } from "@quizlet-clone/common";

export class FolderUpdatedPublisher extends Publisher<FolderUpdatedEvent> {
  readonly subject = Subjects.FolderUpdated;
}
