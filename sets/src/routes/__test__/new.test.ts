import request from "supertest";
import { app } from "../../app";
import { Set } from "../../models/set";

it("has a route handler listening to /api/sets for post requests", async () => {
  const response = await request(app).post("/api/sets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/sets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/sets")
    .set("Cookie", cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/sets")
    .set("Cookie", cookie)
    .send({
      title: "",
      terms: [{term: "test term", definition: "test definition"}],
      viewableBy: "everybody",
      editableBy: "me"
    })
    .expect(400);
});

it("returns an error if an invalid term is provided", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/sets")
    .set("Cookie", cookie)
    .send({
      title: "test title",
      terms: [],
      viewableBy: "everybody",
      editableBy: "me",
    })
    .expect(400);

  // console.log(response.body);
});

it("returns an error if an invalid viewable is provided", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/sets")
    .set("Cookie", cookie)
    .send({
      title: "test title",
      terms: [{ term: "test term", definition: "test definition" }],
      viewableBy: "",
      editableBy: "me",
    })
    .expect(400);

  // console.log(response.body);
});

it("returns an error if an invalid editable is provided", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/sets")
    .set("Cookie", cookie)
    .send({
      title: "test title",
      terms: [{ term: "test term", definition: "test definition" }],
      viewableBy: "everyone",
      editableBy: "",
    })
    .expect(400);

  // console.log(response.body);
});


it("creates a set with valid inputs", async () => {
  let sets = await Set.find({});
  expect(sets.length).toEqual(0);

  const title = "test title";
  const terms = [{ term: "test term", definition: "test definition" }];
  const viewableBy ="everyone";
  const editableBy = "me";

  const cookie = await global.signin();

  await request(app)
    .post("/api/sets")
    .set("Cookie", cookie)
    .send({
      title,
      terms,
      viewableBy,
      editableBy
    })
    .expect(201);

  sets = await Set.find({});
  expect(sets.length).toEqual(1);
  expect(sets[0].viewableBy).toEqual(viewableBy);
  expect(sets[0].editableBy).toEqual(editableBy);
  expect(sets[0].terms[0].definition).toEqual(terms[0].definition);
  expect(sets[0].title).toEqual(title);
});
