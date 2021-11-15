import { Message } from "node-nats-streaming";
import mongoose, { set } from "mongoose";
import { FolderCreatedEvent } from "@quizlet-clone/common";
import { FolderCreatedListener } from "../folder-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Folder } from "../../../models/folder";
import { Library } from "../../../models/library";
import { User } from "../../../models/user";

const setup = async () => {
  // create an instance of the listener
  const listener = new FolderCreatedListener(natsWrapper.client);

  const user = User.build({
    email: "oliviaflexx@gmail.com",
    password: "12345678901",
    name: "oliviaflexx",
  });
  await user.save();

  const library = Library.build({ user: user });
  await library.save();

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

  return { listener, data, msg, library };
};

it("creates and saves a folder", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const folder = await Folder.findById(data.id);

  expect(folder).toBeDefined();
  expect(folder!.creator).toEqual(data.creator);
  expect(folder!.version).toEqual(0);
});

it("adds the folder to the creator library", async () => {
  const { data, listener, msg, library } = await setup();

  await listener.onMessage(data, msg);

  const foundLibrary = await Library.findById(library.id).populate([{path: "folders.created.folder", model: "Folder"}]);

  const foundFolder = await Folder.findById(data.id);

  expect(foundLibrary!.folders.created[0].folder.id).toEqual(foundFolder!.id);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
