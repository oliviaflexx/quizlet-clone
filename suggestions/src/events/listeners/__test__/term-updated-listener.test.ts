import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { TermUpdatedEvent } from "@quizlet-clone/common";
import { TermUpdatedListener } from "../term-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Term } from "../../../models/term";

const setup = async () => {
  // Create a listener
  const listener = new TermUpdatedListener(natsWrapper.client);

  // Create and save a term
  const newTerm = Term.build({
    id: mongoose.Types.ObjectId().toHexString(),
    definition: "test definition",
    term: "test term"
  });
  await newTerm.save();

  // Create a fake data object
  const data: TermUpdatedEvent["data"] = {
    id: newTerm.id,
    version: newTerm.version + 1,
    definition: "new test definition",
    term: "test term"
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, newTerm, listener };
};


it("finds, updates, and saves a ticket", async () => {
  const { msg, data, newTerm, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTerm = await Term.findById(newTerm.id);

  expect(updatedTerm!.term).toEqual(data.term);
  expect(updatedTerm!.definition).toEqual(data.definition);
  expect(updatedTerm!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
  const { msg, data, listener, newTerm } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
