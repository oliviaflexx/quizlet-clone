import { Message } from "node-nats-streaming";
import mongoose, { set } from "mongoose";
import { SetCreatedEvent } from "@quizlet-clone/common";
import { SetCreatedListener } from "../set-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Set } from "../../../models/set";
import { Library } from "../../../models/library";
import { User } from "../../../models/user";

const setup = async () => {
  // create an instance of the listener
  const listener = new SetCreatedListener(natsWrapper.client);

  const user = User.build({
    email: "oliviaflexx@gmail.com",
    password: "12345678901",
    name: "oliviaflexx",
  });
  await user.save();

  const library = Library.build({ user: user });
  await library.save();

  // create a fake data event
  const data: SetCreatedEvent["data"] = {
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

it("creates and saves a set", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const set = await Set.findById(data.id);

  expect(set!).toBeDefined();
  expect(set!.creator).toEqual(data.creator);
  expect(set!.version).toEqual(0);
});

it("adds the folder to the creator library", async () => {
  const { data, listener, msg, library } = await setup();

  await listener.onMessage(data, msg);

  const foundLibrary = await Library.findById(library.id).populate([
    { path: "sets.created.set", model: "Set" },
  ]);

  const foundSet= await Set.findById(data.id);

  expect(foundLibrary!.sets.created[0].set.id).toEqual(foundSet!.id);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
