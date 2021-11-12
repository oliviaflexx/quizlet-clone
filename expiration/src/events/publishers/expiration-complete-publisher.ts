import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@quizlet-clone/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
