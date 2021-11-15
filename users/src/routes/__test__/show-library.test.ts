import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Library } from "../../models/library";
import { Set } from "../../models/set";

it("returns 404 if library not found", async () => {

  const randomId = new mongoose.Types.ObjectId().toHexString();
  return request(app).post(`/api/users/library/${randomId}`).expect(404);
});

it("", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      name: "testUsername",
    })
    .expect(201);

  const library = await Library.findOne({});

   const set = Set.build({
     id: new mongoose.Types.ObjectId().toHexString(),
     title: "test title",
     creator: "oliviaflexx",
     num_of_terms: 1,
   });

   await set.save();

  library!.sets.studied.push({
    set: set,
    flashcards: { latestDate: undefined, numTimesCompleted: 0 },
    write: { latestDate: new Date(), numTimesCompleted: 0 },
    test: { latestDate: undefined, numTimesCompleted: 0 },
  });

  await library!.save();

  const response2 = await request(app)
    .get(`/api/users/library/${response.body.id}`)
    .expect(200);

  expect(response2.body.sets.studied[0].write.numTimesCompleted).toEqual(0);

});
