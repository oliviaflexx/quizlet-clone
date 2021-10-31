import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";
import { Set } from "../../../models/set";
import { ViewOptions } from "../../../view-settings";
import { EditOptions } from "../../../edit-settings";

let title = "test title";
let terms = [{ term: "test term", definition: "test definition" }];
let viewableBy = ViewOptions.Everyone;
let editableBy = EditOptions.Me;

it("returns a 404 if the set is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/sets/set/${id}`).send().expect(404);
});

it("returns the set if the set is found", async () => {
  const cookie = await global.signin();

  const response1 = await request(app)
    .post("/api/sets/set")
    .set("Cookie", cookie)
    .send({
      title,
      viewableBy,
      editableBy,
    })
    .expect(201);

  // let sets1 = await Set.find({});
  // console.log(sets1[0].terms[0]);

  const response2 = await request(app)
    .get(`/api/sets/set/${response1.body.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  // sets1 = await Set.find({});
  // console.log(sets1[0].terms[0]);

  const sets = await Set.find({});
  expect(response2.body.viewableBy).toEqual(viewableBy);
  expect(response2.body.editableBy).toEqual(editableBy);
  expect(response2.body.title).toEqual(title);
});
