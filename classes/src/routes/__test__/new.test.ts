import request from "supertest";
import { app } from "../../app";
import { Folder } from "../../models/folder";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler", async () => {
  const response = await request(app).post("/api/classes/").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/classes/").send({}).expect(401);
});

it(" returns error if input is invalid", async () => {
  const cookie = await global.signin(1);
  const response = await request(app)
    .post("/api/classes")
    .set("Cookie", cookie)
    .send({ title: "", school: "McGill" })
    .expect(400);

const response2 = await request(app)
  .post("/api/classes")
  .set("Cookie", cookie)
  .send({ title: "folder title", school: "" }).expect(400);

});

it(" it returns the class if successfully created", async () => {
  const cookie = await global.signin(1);
  const response = await request(app)
    .post("/api/classes")
    .set("Cookie", cookie)
    .send({ title: "test title", school: "McGill" }).expect(201);

  expect(response.body.title).toEqual("test title");
    expect(response.body.school).toEqual("McGill");
    expect(response.body.adminName).toEqual("testingUsername");
});

it("it publishes an event", async () => {
  const cookie = await global.signin(1);
  const response = await request(app)
    .post("/api/classes")
    .set("Cookie", cookie)
    .send({ title: "test title", school: "McGill" })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
