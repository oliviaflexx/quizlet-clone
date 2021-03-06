import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { SetUpdatedEvent } from "@quizlet-clone/common";
import { SetUpdatedListener } from "../set-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Folder } from "../../../models/folder";
import { Set } from "../../../models/set";

const setup = async () => {
  //create a folder with a set
  const setId = new mongoose.Types.ObjectId().toHexString();

  // create an instance of the listener
  const listener = new SetUpdatedListener(natsWrapper.client);

    const newFolder = Folder.build({
      title: "test folder",
      creatorId: new mongoose.Types.ObjectId().toHexString(),
      creatorName: "oliviaflexx",
      dateCreated: new Date(),
    });

    await newFolder.save();

    const newSet = Set.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "test title",
      creator: "oliviaflexx",
      num_of_terms: 0
    });

 await newSet.save();

    newFolder.sets.push(newSet);

    await newFolder.save();

    const newSet2 = Set.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "test title 2",
      creator: "oliviaflexx2",
      num_of_terms: 0,
    });

    await newSet2.save();

    newFolder.sets.push(newSet2);

    await newFolder.save();


  // create a fake data event
  const data: SetUpdatedEvent["data"] = {
    id: newSet2.id,
    version: newSet2.version + 1,
    title: "test title 2",
    termId: new mongoose.Types.ObjectId().toHexString(),
    term_amount: 1
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, setId };
};

it("updates the number of terms of the correct set", async () => {
  const { listener, data, msg, setId } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a set was created!
  const folder = await Folder.findOne({}).populate("sets");
  // console.log(folder);
  expect(folder!.sets[1].num_of_terms).toEqual(1);

});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();

});
