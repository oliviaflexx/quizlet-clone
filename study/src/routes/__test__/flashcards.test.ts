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
    .put(`/api/study/flashcards/${123}`)
    .set("Cookie", cookie)
    .send({
      current_index: 1,
    });

  expect(response1.status).toEqual(404);
});

it("changes index for flashcards", async () => {
  const { set, cookie, term } = await setup();

  const response1 = await request(app)
    .put(`/api/study/flashcards/${set.set_id}`)
    .set("Cookie", cookie)
    .send({
      current_index: 1,
    }).expect(200);

  expect(response1.body.flashcards.current_index).toEqual(0);
});
