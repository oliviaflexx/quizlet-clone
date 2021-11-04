import { Message } from "node-nats-streaming";
import mongoose, { set } from "mongoose";
import { SetCreatedEvent } from "@quizlet-clone/common";
import { SetCreatedListener } from "../set-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Set } from "../../../models/set";

const setup = async () => {
  // create an instance of the listener
  const listener = new SetCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: SetCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test title",
    creator: "oliviaflexx"
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a set", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

    const set = await Set.findById(data.id);

  expect(set).toBeDefined();
  expect(set!.creator).toEqual(data.creator);
  expect(set!.version).toEqual(0);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
