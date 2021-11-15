import { Message } from "node-nats-streaming";
import mongoose, { set } from "mongoose";
import { SetUpdatedEvent } from "@quizlet-clone/common";
import { SetUpdatedListener } from "../set-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Set } from "../../../models/set";
import { Library } from "../../../models/library";
import { User } from "../../../models/user";

const setup = async () => {
  // create an instance of the listener
  const listener = new SetUpdatedListener(natsWrapper.client);

  const user = User.build({
    email: "oliviaflexx@gmail.com",
    password: "12345678901",
    name: "oliviaflexx",
  });
  await user.save();

  const library = Library.build({ user: user });
  await library.save();

  const set = Set.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test title",
    creator: "oliviaflexx",
    num_of_terms: 0
  });

  await set.save();

  library.sets.created.push({ date: new Date(), set: set });

  await library.save();
  // create a fake data event
  const data: SetUpdatedEvent["data"] = {
    version: 1,
    id: set.id,
    termId: new mongoose.Types.ObjectId().toHexString(),
    title: "test title",
    term_amount: 1,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, library };
};

it("updates a set", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const set = await Set.findById(data.id);

  expect(set!).toBeDefined();
  expect(set!.num_of_terms).toEqual(data.term_amount);
  expect(set!.version).toEqual(1);

  const library = await Library.findOne({}).populate([
    { path: "sets.created.set", model: "Set" },
  ]);

  expect(library!.sets.created[0].set.num_of_terms).toEqual(1);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
