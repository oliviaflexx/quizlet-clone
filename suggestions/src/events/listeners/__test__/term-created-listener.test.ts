import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { TermCreatedEvent } from "@quizlet-clone/common";
import { TermCreatedListener } from "../term-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Term } from "../../../models/term";

const setup = async () => {
  // create an instance of the listener
  const listener = new TermCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TermCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    term: "test term",
    definition: "test definition",
    set_id: new mongoose.Types.ObjectId().toHexString()
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a term", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

  // write assertions to make sure a set was created!
  const term = await Term.findById(data.id);

  expect(term).toBeDefined();
  expect(term!.term).toEqual(data.term);
  expect(term!.definition).toEqual(data.definition);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});