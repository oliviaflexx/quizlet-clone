import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

let title = "test title";
let terms = [{ term: "test term", definition: "test definition" }];
let viewableBy = "everyone";
let editableBy = "me";

it("returns a 404 if the provided id does not exist", async () => {
  const cookie = await global.signin();
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/sets/${id}`)
    .set("Cookie", cookie)
    .send({
      title,
      terms,
      viewableBy,
      editableBy,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/sets/${id}`)
    .send({
      title,
      terms,
      viewableBy,
      editableBy,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the set", async () => {
  const cookie1 = await global.signin();
  const cookie2 = await global.signin();

  const response = await request(app)
    .post("/api/sets")
    .set("Cookie", cookie1)
    .send({
      title,
      terms,
      viewableBy,
      editableBy,
    });

  await request(app)
    .put(`/api/sets/${response.body.id}`)
    .set("Cookie", cookie2)
    .send({
      title,
      terms,
      viewableBy: "me",
      editableBy,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid inputs", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post("/api/sets")
    .set("Cookie", cookie)
    .send({
      title,
      terms,
      viewableBy,
      editableBy,
    });

  await request(app)
    .put(`/api/sets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      terms,
      viewableBy,
      editableBy,
    })
    .expect(400);

  await request(app)
    .put(`/api/sets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
      terms: "",
      viewableBy,
      editableBy,
    })
    .expect(400);

  await request(app)
    .put(`/api/sets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
      terms,
      viewableBy: "",
      editableBy,
    })
    .expect(400);

  await request(app)
    .put(`/api/sets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
      terms,
      viewableBy,
      editableBy: "",
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = await global.signin();

const response = await request(app)
  .post("/api/sets")
  .set("Cookie", cookie)
  .send({
    title,
    terms,
    viewableBy,
    editableBy,
  });

  title = "new test title";
  terms = [{ term: "test term", definition: "test definition" }, { term: "new test term", definition: "new test definition" }];
  viewableBy = "new everyone";
  editableBy = "new me";

  await request(app)
    .put(`/api/sets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
      terms,
      viewableBy,
      editableBy,
    })
    .expect(200);

  const setResponse = await request(app)
    .get(`/api/sets/${response.body.id}`)
    .send();

  expect(setResponse.body.title).toEqual(title);
  expect(setResponse.body.terms[0].term).toEqual(terms[0].term);
  expect(setResponse.body.viewableBy).toEqual(viewableBy);
  expect(setResponse.body.editableBy).toEqual(editableBy);
});
