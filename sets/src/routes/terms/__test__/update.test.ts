import request from "supertest";
import { app } from "../../../app";
import { Set } from "../../../models/set";
import { Term } from "../../../models/term";
import mongoose from "mongoose";
import { ViewOptions } from "../../../view-settings";
import { EditOptions } from "../../../edit-settings";
import { natsWrapper } from "../../../nats-wrapper";
import { response } from "express";

it("can only be accessed if the user is signed in", async () => {
  await request(app)
    .put(`/api/sets/term/${new mongoose.Types.ObjectId().toHexString()}`)
    .send({})
    .expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .put(`/api/sets/term/${new mongoose.Types.ObjectId().toHexString()}`)
    .set("Cookie", cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if invalid inputs are sent", async () => {
const cookie = await global.signin();
const response1 = await request(app)
  .post("/api/sets/set")
  .set("Cookie", cookie)
  .send({
    title: "test title",
    viewableBy: ViewOptions.Me,
    editableBy: EditOptions.Me,
    classes: [
      {
        class_id: new mongoose.Types.ObjectId().toHexString(),
        title: "math 201",
        school: "McGill",
      },
    ],
  })
  .expect(201);

const response2 = await request(app)
  .post("/api/sets/term")
  .set("Cookie", cookie)
  .send({
    setId: response1.body.id,
    term: "test term",
    definition: "test definition",
  })
  .expect(201);

   const response3 = await request(app)
     .put(`/api/sets/term/${response2.body.id}`)
     .set("Cookie", cookie)
     .send({
       setId: "",
       term: "test term",
       definition: "test definition",
     })
     .expect(400);

  const response4 = await request(app)
    .put(`/api/sets/term/${response2.body.id}`)
    .set("Cookie", cookie)
    .send({
      setId: response1.body.id,
      term: "",
      definition: "test definition",
    }).expect(400);

    const response5 = await request(app)
      .put(`/api/sets/term/${response2.body.id}`)
      .set("Cookie", cookie)
      .send({
        setId: response1.body.id,
        term: "new term",
        definition: "",
      })
      .expect(400);

});

it("updates term if valid inputs are sent", async () => {
    const cookie = await global.signin();
    const response1 = await request(app)
      .post("/api/sets/set")
      .set("Cookie", cookie)
      .send({
        title: "test title",
        viewableBy: ViewOptions.Me,
        editableBy: EditOptions.Me,
        classes: [
          {
            class_id: new mongoose.Types.ObjectId().toHexString(),
            title: "math 201",
            school: "McGill",
          },
        ],
      })
      .expect(201);

    const response2 = await request(app)
      .post("/api/sets/term")
      .set("Cookie", cookie)
      .send({
        setId: response1.body.id,
        term: "test term",
        definition: "test definition",
      })
      .expect(201);

    const response3 = await request(app)
      .put(`/api/sets/term/${response2.body.id}`)
      .set("Cookie", cookie)
      .send({
        setId: response1.body.id,
        term: "test term 2",
        definition: "test definition",
      })
      .expect(200);

      const newTerm = await Term.findById(response2.body.id);
      expect(newTerm!.term).toEqual("test term 2")
});


it("publishes proper number of events", async () => {
  const cookie = await global.signin();
  const response1 = await request(app)
    .post("/api/sets/set")
    .set("Cookie", cookie)
    .send({
      title: "test title",
      viewableBy: ViewOptions.Me,
      editableBy: EditOptions.Me,
      classes: [
        {
          class_id: new mongoose.Types.ObjectId().toHexString(),
          title: "math 201",
          school: "McGill",
        },
      ],
    })
    .expect(201);

  const response2 = await request(app)
    .post("/api/sets/term")
    .set("Cookie", cookie)
    .send({
      setId: response1.body.id,
      term: "test term",
      definition: "test definition",
    })
    .expect(201);

  const response3 = await request(app)
    .put(`/api/sets/term/${response2.body.id}`)
    .set("Cookie", cookie)
    .send({
      setId: response1.body.id,
      term: "test term 2",
      definition: "test definition",
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(4);
});
