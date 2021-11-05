import { Message } from "node-nats-streaming";
import mongoose, { set } from "mongoose";
import { FolderCreatedEvent } from "@quizlet-clone/common";
import { FolderCreatedListener } from "../folder-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Folder } from "../../../models/folder";

const setup = async () => {
  // create an instance of the listener
  const listener = new FolderCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: FolderCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test title",
    creator: "oliviaflexx",
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

  const folder = await Folder.findById(data.id);

  expect(folder).toBeDefined();
  expect(folder!.creator).toEqual(data.creator);
  expect(folder!.version).toEqual(0);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
