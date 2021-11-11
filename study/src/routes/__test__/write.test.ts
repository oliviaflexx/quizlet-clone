import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Term } from "../../models/term";
import { UserTerm } from "../../models/user-term";
import { UserSet } from "../../models/user-set";
import request from "supertest";
import { app } from "../../app";

const setup = async () => {
  const cookie = await global.signin();
  const term = Term.build({
    term: "user test term",
    definition: "user test definition",
    set_id: new mongoose.Types.ObjectId().toHexString(),
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await term.save();

  const user_term = UserTerm.build({
    term_id: term.id,
  });

  await user_term.save();

  const set = UserSet.build({
    owner_id: new mongoose.Types.ObjectId().toHexString(),
    set_id: term.set_id,
    user_terms: [user_term],
  });

  await set.save();

  return { set, cookie, term, user_term };
};

it("if the id is invalid it returns a 400", async () => {
  const { set, cookie, term } = await setup();

  const response1 = await request(app)
    .put(`/api/study/write/${123}`)
    .set("Cookie", cookie)
    .send({
      current_index: 1,
      remaining: 0,
      correct: 0,
      incorrect: 1
    });

  expect(response1.status).toEqual(404);
});

it("throws error for invalid index, remaining, correct and incorrect for write", async () => {
  const { set, cookie, term } = await setup();

  const response1 = await request(app)
    .put(`/api/study/write/${set.set_id}`)
    .set("Cookie", cookie)
    .send({
      current_index: 0,
      remaining: 0,
      correct: 0,
      incorrect: 1,
    })
    .expect(400);

    const response2 = await request(app)
      .put(`/api/study/write/${set.set_id}`)
      .set("Cookie", cookie)
      .send({
        current_index: 1,
        remaining: 1,
        correct: 0,
        incorrect: 1,
      })
      .expect(400);

      const response3 = await request(app)
        .put(`/api/study/write/${set.set_id}`)
        .set("Cookie", cookie)
        .send({
          current_index: 1,
          remaining: 0,
          correct: 1,
          incorrect: 1,
        })
        .expect(400);

        const response4 = await request(app)
          .put(`/api/study/write/${set.set_id}`)
          .set("Cookie", cookie)
          .send({
            current_index: 1,
            remaining: 0,
            correct: 2,
            incorrect: 0,
          })
          .expect(400);
});

it("changes index, remaining, correct and incorrect for write", async () => {
  const { set, cookie, term } = await setup();

  const response1 = await request(app)
    .put(`/api/study/write/${set.set_id}`)
    .set("Cookie", cookie)
    .send({
      current_index: 1,
      remaining: 0,
      correct: 0,
      incorrect: 1,
    })
    .expect(200);

  expect(response1.body.write.current_index).toEqual(1);
  expect(response1.body.write.remaining).toEqual(0);
  expect(response1.body.write.correct).toEqual(0);
  expect(response1.body.write.incorrect).toEqual(1);
});
