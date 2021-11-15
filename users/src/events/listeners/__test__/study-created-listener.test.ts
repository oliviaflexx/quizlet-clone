import { Message } from "node-nats-streaming";
import mongoose, { set } from "mongoose";
import { StudyCreatedEvent } from "@quizlet-clone/common";
import { StudyCreatedListener } from "../study-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Set } from "../../../models/set";
import { Library } from "../../../models/library";
import { User } from "../../../models/user";

const setup = async () => {
  // create an instance of the listener
  const listener = new StudyCreatedListener(natsWrapper.client);

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
    num_of_terms: 1
  });

  await set.save();

  // create a fake data event
  const data: StudyCreatedEvent["data"] = {
      type: "flashcards",
    userId: user.id,
    setId: set.id,
    date: new Date()
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, library };
};

it("updates a library sets", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const library = await Library.findOne({}).populate([
    { path: "sets.studied.set", model: "Set" },
  ]);

  expect(library!.sets.studied[0].set.num_of_terms).toEqual(1);
  expect(library!.sets.studied[0].flashcards.latestDate).toEqual(data.date);
  expect(library!.sets.studied[0].flashcards.numTimesCompleted).toEqual(0);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});