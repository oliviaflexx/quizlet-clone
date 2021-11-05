import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { FolderUpdatedEvent } from "@quizlet-clone/common";
import { FolderUpdatedListener } from "../folder-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Class } from "../../../models/class";
import { Folder } from "../../../models/folder";

const setup = async () => {
  //create a folder with a set
  const listener = new FolderUpdatedListener(natsWrapper.client);
  const setId = new mongoose.Types.ObjectId().toHexString();

  // create an instance of the listener

  const newClass = Class.build({
    title: "test class",
    adminId: new mongoose.Types.ObjectId().toHexString(),
    adminName: "oliviaflexx",
    dateCreated: new Date(),
    school: "McGill University",
    link: "123"
  });

  await newClass.save();

  const newFolder = Folder.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test title",
    creator: "oliviaflexx",
    num_of_sets: 0,
  });

  await newFolder.save();

  newClass.folders.push(newFolder);

  await newClass.save();

  const newFolder2 = Folder.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test title 2",
    creator: "oliviaflexx2",
    num_of_sets: 0,
  });

  await newFolder2.save();

  newClass.folders.push(newFolder2);

  await newClass.save();

  // create a fake data event
  const data: FolderUpdatedEvent["data"] = {
    id: newFolder2.id,
    version: newFolder2.version + 1,
    title: "test title 2",
    setId: new mongoose.Types.ObjectId().toHexString(),
    set_amount: 1,
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
  const foundClass = await Class.findOne({}).populate("folders");
  expect(foundClass!.folders[1].num_of_sets).toEqual(1);

});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();


  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  console.log("made it");
  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
