import { Message } from "node-nats-streaming";
import mongoose, { set } from "mongoose";
import { ClassUpdatedEvent } from "@quizlet-clone/common";
import { ClassUpdatedListener } from "../class-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Class } from "../../../models/class";
import { Library } from "../../../models/library";
import { User } from "../../../models/user";

const setup = async () => {
  // create an instance of the listener
  const listener = new ClassUpdatedListener(natsWrapper.client);

  const user = User.build({
    email: "oliviaflexx@gmail.com",
    password: "12345678901",
    name: "oliviaflexx",
  });
  await user.save();

  const library = Library.build({ user: user });
  await library.save();

  const user2 = User.build({
    email: "oliviaflexx2@gmail.com",
    password: "12345678901",
    name: "oliviaflexx2",
  });
  await user2.save();

  const library2 = Library.build({ user: user2 });
  await library2.save();

  const newClass = Class.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test title",
    school: "McGill",
    members: [user.id],
    dateCreated: new Date(),
  });

  await newClass.save();

  // create a fake data event
  const data: ClassUpdatedEvent["data"] = {
    version: 1,
    id: newClass.id,
    title: "test title",
    admin: user.id,
    numSets: 0,
    members: [user.id, user2.id]
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, library };
};

it("adds class to user library", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);


  const user2 = await User.findById(data.members[1]);
  const library = await Library.findOne({user: user2!}).populate("classes");
  expect(library!.classes[0].title).toEqual("test title");
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});