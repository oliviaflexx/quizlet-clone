import request from "supertest";
import { app } from "../../app";
import { Folder } from "../../models/folder";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("if no folder is found it returns error", async () => {
  const response = await request(app)
    .get(`/api/folders/${new mongoose.Types.ObjectId().toHexString()}`)
    .send();

  expect(response.status).toEqual(404);
});

it("if folder is found it returns it", async () => {
const cookie = await global.signin();
    const makeFolder = await request(app)
      .post('/api/folders/')
      .set("Cookie", cookie)
      .send({title: "test title"})
      .expect(201);

  const response = await request(app)
    .get(`/api/folders/${makeFolder.body.id}`)
    .send().expect(200);
});
