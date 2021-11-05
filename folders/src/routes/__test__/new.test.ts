import request from "supertest";
import { app } from "../../app";
import { Folder } from "../../models/folder";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler", async () => {
    const response = await request(app).post("/api/folders/").send({
    });

    expect(response.status).not.toEqual(404);
});


it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/folders/").send({}).expect(401);
});

it(" returns error if input is invalid", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/folders")
    .set("Cookie", cookie)
    .send({ title: "" });

  expect(response.status).toEqual(400);
});

it(" it returns the folder if successfully created", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/folders")
    .set("Cookie", cookie)
    .send({ title: "test title" });

    expect(response.body.title).toEqual("test title");
  expect(response.status).toEqual(201);
});

it("it publishes an event", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/folders")
    .set("Cookie", cookie)
    .send({ title: "test title" }).expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

