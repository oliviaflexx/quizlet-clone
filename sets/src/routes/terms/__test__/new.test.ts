import request from "supertest";
import { app } from "../../../app";
import { Set } from "../../../models/set";
import { Term } from "../../../models/term";
import mongoose from "mongoose";
import { ViewOptions } from "../../../view-settings";
import { EditOptions } from "../../../edit-settings";
import { natsWrapper } from "../../../nats-wrapper";
import { response } from "express";

it("has a route handler listening to /api/sets/term for post requests", async () => {
  const response = await request(app).post("/api/sets/term").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/sets/term").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/sets/term")
    .set("Cookie", cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if invalid inputs are provided", async () => {
      const cookie = await global.signin();
      const response1 = await request(app)
        .post("/api/sets/term")
        .set("Cookie", cookie)
        .send({
            setId: "",
            term: "test term",
            definition: "test definition"
        }).expect(400);

        const response2 = await request(app)
          .post("/api/sets/term")
          .set("Cookie", cookie)
          .send({
            setId: new mongoose.Types.ObjectId().toHexString(),
            term: "",
            definition: "test definition",
          })
          .expect(400);

          const response3 = await request(app)
            .post("/api/sets/term")
            .set("Cookie", cookie)
            .send({
              setId: new mongoose.Types.ObjectId().toHexString(),
              term: "test term",
              definition: "",
            })
            .expect(400);
});

it("returns an error if set is not found", async () => {
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
          setId: new mongoose.Types.ObjectId().toHexString(),
          term: "test term",
          definition: "test definition",
        })
        .expect(404);
});

it("creates a term successfully", async () => {
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

    const set = await Set.findById(response1.body.id);
    expect(set!.terms.length).toEqual(1);
    (response2.body.id);
});

it("publishes an event twice", async () => {

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
         .get(`/api/sets/set/${response1.body.id}`)
         .set("Cookie", cookie)
         .expect(200);

        expect(response3.body.terms[0].term).toEqual("test term");

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(3);
});