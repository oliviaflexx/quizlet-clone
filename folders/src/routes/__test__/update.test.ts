import request from "supertest";
import { app } from "../../app";
import { Folder } from "../../models/folder";
import { Set } from "../../models/set";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

const random_id = new mongoose.Types.ObjectId().toHexString();

const title = "new title";
  

it(" returns error if folder doesnt exist", async () => {
  const set = Set.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test title",
    creator: "oliviaflexx",
    num_of_terms: 0,
  });

  await set.save();
  const cookie = await global.signin();
  const response = await request(app)
    .put(`/api/folders/${random_id}`)
    .set("Cookie", cookie)
    .send({ title, set });

  expect(response.status).toEqual(404);
});

it(" if inputs are invalid it doesn't enter them error", async () => {

  const set = Set.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test title",
    creator: "oliviaflexx",
    num_of_terms: 0,
  });

  await set.save();
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/folders")
    .set("Cookie", cookie)
    .send({ title: "test title" }).expect(201);

const response2 = await request(app)
  .put(`/api/folders/${response.body.id}`)
  .set("Cookie", cookie)
  .send({ title: "", set_id: set.id }).expect(200);


  expect(response2.body.title).toEqual("test title");
  expect(response2.body.sets[0].title).toEqual(set.title);

  const response3 = await request(app)
    .put(`/api/folders/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title, set: ""})
    .expect(200);

      expect(response2.body.title).toEqual("test title");
      expect(response2.body.sets[0].title).toEqual(set.title);
});

it("it publishes an event", async () => {
  const set = Set.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test title",
    creator: "oliviaflexx",
    num_of_terms: 0,
  });

  await set.save();
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/folders")
    .set("Cookie", cookie)
    .send({ title: "test title" })
    .expect(201);

      const response2 = await request(app)
        .put(`/api/folders/${response.body.id}`)
        .set("Cookie", cookie)
        .send({ title, set_id: set.id })
        .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
