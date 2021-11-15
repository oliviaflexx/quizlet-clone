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

  return { set, cookie, term, user_term };
};

it("if the id is invalid it returns a 400 for star route", async () => {
  const { set, cookie, term } = await setup();

  const response1 = await request(app)
    .put(`/api/study/term/${123}/star`)
    .set("Cookie", cookie)
    .send();

  expect(response1.status).toEqual(400);
});

it("if the id is valid and the user does not have a study set then one is created", async () => {
  const { set, cookie, term } = await setup();

  const response1 = await request(app)
    .put(`/api/study/term/${term.id}/star`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  const user_sets = await UserSet.find({});

  expect(user_sets.length).toEqual(2);
});

it("if the id is valid and the user has study set then one is not created", async () => {
  const { set, cookie, term, user_term } = await setup();

  const response1 = await request(app)
    .put(`/api/study/flashcards/${term.set_id}`)
    .set("Cookie", cookie)
    .send({current_index: 1});

  let user_sets = await UserSet.find({});

  expect(user_sets.length).toEqual(2);

  const response2 = await request(app)
    .put(`/api/study/term/${response1.body.user_terms[0].id}/star`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  user_sets = await UserSet.find({});
  expect(user_sets.length).toEqual(2);
});

it("changes the starred attribute", async () => {
  const { set, cookie, term, user_term } = await setup();

  const cookie2 = await global.signin();

  const response1 = await request(app)
    .put(`/api/study/flashcards/${term.set_id}`)
    .set("Cookie", cookie)
    .send({current_index: 1});

  const response2 = await request(app)
    .put(`/api/study/term/${response1.body.user_terms[0].id}/star`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response2.body.starred).toEqual(true);

  const response3 = await request(app)
    .put(`/api/study/term/${term.id}/star`)
    .set("Cookie", cookie2)
    .send()
    .expect(200);

  expect(response3.body.starred).toEqual(true);

  const response4 = await request(app)
    .put(`/api/study/term/${response3.body.id}/star`)
    .set("Cookie", cookie2)
    .send()
    .expect(200);
  expect(response4.body.starred).toEqual(false);
});

it("updates the status of a term", async () => {
  const { set, cookie, term, user_term } = await setup();
  const response1 = await request(app)
    .put(`/api/study/term/${user_term.id}`)
    .set("Cookie", cookie)
    .send({
      correct: false,
      flashcards: false,
    });

  // console.log(response1.body);
  expect(response1.body.study_num).toEqual(1);
  expect(response1.body.status).toEqual("Still learning");

  const response2 = await request(app)
    .put(`/api/study/term/${user_term.id}`)
    .set("Cookie", cookie)
    .send({
      correct: false,
      flashcards: false,
    });

  // console.log(response2.body);
  expect(response2.body.study_num).toEqual(1);
  expect(response2.body.status).toEqual("Still learning");

  const response3 = await request(app)
    .put(`/api/study/term/${user_term.id}`)
    .set("Cookie", cookie)
    .send({
      correct: true,
      flashcards: false,
    });

  // console.log(response3.body);
  expect(response3.body.study_num).toEqual(2);
  expect(response3.body.status).toEqual("Still learning");

  const response4 = await request(app)
    .put(`/api/study/term/${user_term.id}`)
    .set("Cookie", cookie)
    .send({
      correct: false,
      flashcards: true,
    });

  // console.log(response4.body);
  expect(response4.body.study_num).toEqual(2);
  expect(response4.body.status).toEqual("Still learning");

  const response5 = await request(app)
    .put(`/api/study/term/${user_term.id}`)
    .set("Cookie", cookie)
    .send({
      correct: true,
      flashcards: false,
    });

  // console.log(response5.body);
  expect(response5.body.study_num).toEqual(3);
  expect(response5.body.status).toEqual("Mastered");

  const response6 = await request(app)
    .put(`/api/study/term/${user_term.id}`)
    .set("Cookie", cookie)
    .send({
      correct: true,
      flashcards: false,
    });

  // console.log(response6.body);
  expect(response6.body.study_num).toEqual(3);
  expect(response6.body.status).toEqual("Mastered");

  const response7 = await request(app)
    .put(`/api/study/term/${user_term.id}`)
    .set("Cookie", cookie)
    .send({
      correct: false,
      flashcards: false,
    });

  // console.log(response7.body);
  expect(response7.body.study_num).toEqual(2);
  expect(response7.body.status).toEqual("Still learning");
});
