import { Message } from "node-nats-streaming";
import mongoose, { set } from "mongoose";
import { ClassCreatedEvent } from "@quizlet-clone/common";
import { ClassCreatedListener } from "../class-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Class } from "../../../models/class";
import { Library } from "../../../models/library";
import { User } from "../../../models/user";

const setup = async () => {
  // create an instance of the listener
  const listener = new ClassCreatedListener(natsWrapper.client);

  const user = User.build({ email: "oliviaflexx@gmail.com", password: "12345678901", name: "oliviaflexx" });
  await user.save();

  const library = Library.build({user: user});
  await library.save();

  // create a fake data event
  const data: ClassCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test title",
    admin: user.name,
    school: "McGill"
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, library };
};

it("creates and saves a class", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const foundClass = await Class.findById(data.id);

  console.log(foundClass);
  expect(foundClass).toBeDefined();
  expect(foundClass!.school).toEqual(data.school);
  expect(foundClass!.version).toEqual(0);
});


it("adds the class to the admin library", async () => {
  const { data, listener, msg, library } = await setup();

  await listener.onMessage(data, msg);

  const foundLibrary = await Library.findById(library.id).populate("classes");

  const foundClass = await Class.findById(data.id);

  expect(foundLibrary!.classes[0].id).toEqual(foundClass!.id);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});