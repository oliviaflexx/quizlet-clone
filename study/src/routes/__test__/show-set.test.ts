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
  

  const response1 = await request(app)
    .put(`/api/study/flashcards/${term.set_id}`)
    .set("Cookie", cookie)
    .send({
      current_index: 1,
    })
    .expect(200);

  return {cookie, term};
};

it("throws an error if set is not found", async () => {
  const { cookie, term } = await setup();

  const response1 = await request(app)
    .get(`/api/study/${123}`)
    .set("Cookie", cookie)
    .send();

  expect(response1.status).toEqual(404);

});

it("returns the correct set completely populated", async () => {
    const { cookie, term } = await setup();

    const response1 = await request(app)
      .get(`/api/study/${term.set_id}`)
      .set("Cookie", cookie)
      .send();

      expect(response1.body.user_terms[0].term_id.term).toEqual(term.term);

    expect(response1.body.user_terms[0].term_id.definition).toEqual(
      term.definition
    );

})