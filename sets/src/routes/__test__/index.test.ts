import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Set } from "../../models/set";

const title = "test title";
const terms = [{ term: "test term", definition: "test definition" }];
const viewableBy = "everyone";
const editableBy = "me";



const createSet = async () => {
return request(app)
  .post("/api/sets")
  .set("Cookie", await global.signin())
  .send({
    title,
    terms,
    viewableBy,
    editableBy,
  });
};

it('can fetch a list of tickets', async () => {

    await createSet();
    await createSet();
    await createSet();

    const response = await request(app).get('/api/sets').send().expect(200);

    expect(response.body.length).toEqual(3);
});
