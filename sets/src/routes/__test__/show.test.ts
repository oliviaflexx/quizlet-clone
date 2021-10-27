import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Set } from "../../models/set";

it("returns a 404 if the set is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/sets/${id}`).send().expect(404);
});


it("returns the set if the set is found", async () => {
  const title = "test title";
  const terms = [{ term: "test term", definition: "test definition" }];
  const viewableBy = "everyone";
  const editableBy = "me";

  const cookie = await global.signin();

  const response = await request(app)
    .post("/api/sets")
    .set("Cookie", cookie)
    .send({
      title,
      terms,
      viewableBy,
      editableBy,
    })
    .expect(201);

  const setResponse = await request(app)
    .get(`/api/sets/${response.body.id}`)
    .send()
    .expect(200);

    const sets = await Set.find({});
    expect(sets[0].viewableBy).toEqual(viewableBy);
    expect(sets[0].editableBy).toEqual(editableBy);
    expect(sets[0].terms[0].definition).toEqual(terms[0].definition);
    expect(sets[0].title).toEqual(title);
});
