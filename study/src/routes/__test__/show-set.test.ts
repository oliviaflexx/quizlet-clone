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
    set_id: new mongoose.Types.ObjectId().toHexString(),
    user_terms: [user_term],
  });

  await set.save();

  return { set, cookie, term };
};

it("throws an error if set is not found", async () => {
  const { set, cookie, term } = await setup();

  const response1 = await request(app)
    .get(`/api/study/${term.set_id}`)
    .set("Cookie", cookie)
    .send();

  expect(response1.status).toEqual(200);

  const response2 = await request(app)
    .get(`/api/study/${123}`)
    .set("Cookie", cookie)
    .send();

  expect(response2.status).toEqual(404);
});

it("returns the correct set completely populated", async () => {
    const { set, cookie, term } = await setup();

    const response1 = await request(app)
      .get(`/api/study/${term.set_id}`)
      .set("Cookie", cookie)
      .send();

      expect(response1.body.user_terms[0].term_id.term).toEqual(term.term);
      
      const response2 = await request(app)
        .get(`/api/study/${term.set_id}`)
        .set("Cookie", cookie)
        .send();
      expect(response2.body.user_terms[0].term_id.term).toEqual(term.definition);

})