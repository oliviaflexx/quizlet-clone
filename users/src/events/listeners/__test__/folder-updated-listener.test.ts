import { Message } from "node-nats-streaming";
import mongoose, { set } from "mongoose";
import { FolderUpdatedEvent } from "@quizlet-clone/common";
import { FolderUpdatedListener } from "../folder-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Folder } from "../../../models/folder";
import { Library } from "../../../models/library";
import { User } from "../../../models/user";

const setup = async () => {
  // create an instance of the listener
  const listener = new FolderUpdatedListener(natsWrapper.client);

  const user = User.build({
    email: "oliviaflexx@gmail.com",
    password: "12345678901",
    name: "oliviaflexx",
  });
  await user.save();

  const library = Library.build({ user: user });
  await library.save();

  const folder = Folder.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test title",
    creator: "oliviaflexx",
    num_of_sets: 0,
  });

  await folder.save();

  library.folders.created.push({ date: new Date(), folder: folder });

  await library.save();
  // create a fake data event
  const data: FolderUpdatedEvent["data"] = {
    version: 1,
    id: folder.id,
    setId: new mongoose.Types.ObjectId().toHexString(),
    title: "test title",
    set_amount: 1,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, library };
};

it("updates a folder", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const folder = await Folder.findById(data.id);

  expect(folder).toBeDefined();
  expect(folder!.num_of_sets).toEqual(data.set_amount);
  expect(folder!.version).toEqual(1);

  const library = await Library.findOne({}).populate([
    { path: "folders.created.folder", model: "Folder" },
  ]);

  expect(library!.folders.created[0].folder.num_of_sets).toEqual(1);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
