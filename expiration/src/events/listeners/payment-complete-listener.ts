import { Listener, PaymentCompleteEvent, Subjects } from "@quizlet-clone/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class PaymentCompleteEventListener extends Listener<PaymentCompleteEvent> {
  subject: Subjects.PaymentComplete = Subjects.PaymentComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCompleteEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Waiting this many milliseconds to process the job:", delay);

    await expirationQueue.add(
      {
        userId: data.userId,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
