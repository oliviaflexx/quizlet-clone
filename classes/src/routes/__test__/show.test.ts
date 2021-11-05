import request from "supertest";
import { app } from "../../app";
import { Class } from "../../models/class";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";


it("if no class is found it returns error", async () => {
  const cookie = await global.signin(1);
  const response = await request(app)
    .get(`/api/classes/${new mongoose.Types.ObjectId().toHexString()}`)
    .set("Cookie", cookie)
    .send();

  expect(response.status).toEqual(404);
});

it("if class is found it returns it only if user is a member", async () => {
  const cookie = await global.signin(1);
  const makeClass = await request(app)
    .post("/api/classes/")
    .set("Cookie", cookie)
    .send({ title: "test title", school: "McGill" })
    .expect(201);

  const cookie2 = await global.signin(2);

  const response = await request(app)
    .get(`/api/classes/${makeClass.body.id}`)
    .set("Cookie", cookie2)
    .send()
    .expect(401);

  const addMember = await request(app)
    .put("/api/classes/join")
    .set("Cookie", cookie2)
    .send({ link: makeClass.body.link }).expect(200);


  const seeClass = await request(app)
    .get(`/api/classes/${makeClass.body.id}`)
    .set("Cookie", cookie2)
    .send()
    .expect(200);

  console.log(seeClass.body);
});
