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

  const set_id = new mongoose.Types.ObjectId().toHexString();

  let user_terms = [];

  for (let i = 0; i < 20; i++) {
    const term = Term.build({
      term: `user term ${i}`,
      definition: `user definition ${i}`,
      set_id: set_id,
      id: new mongoose.Types.ObjectId().toHexString(),
    });

    await term.save();

    
  }

  const response1 = await request(app)
    .get(`/api/study/${set_id}`)
    .set("Cookie", cookie)
    .send();

    for (let user_term of response1.body.user_terms) {
      user_terms.push({
        id: user_term.id,
        correct: true,
      });
    }
  
  const response_id = response1.body.id;

  return { cookie, set_id, user_terms, response_id };
};

it("returns error if set_id is invalid", async () => {
  const { cookie, set_id } = await setup();

  const response1 = await request(app)
    .get(`/api/study/test/${123}`)
    .set("Cookie", cookie)
    .send();

  expect(response1.status).toEqual(400);
});

it("makes a test correctly", async () => {
  const { cookie, set_id } = await setup();

  const response1 = await request(app)
    .get(`/api/study/test/${set_id}`)
    .set("Cookie", cookie)
    .send({
      starred: false,
    })
    .expect(200);

  expect(response1.body.trueOrFalse.length).toEqual(6);
  expect(response1.body.multipleChoice.length).toEqual(5);
  expect(response1.body.written.length).toEqual(5);
  expect(response1.body.matching.definitions.length).toEqual(4);


  // console.log(JSON.stringify(response1.body, null, 4));
});


it("changes term status", async () => {
  const { cookie, set_id, user_terms, response_id } = await setup();

    // console.log(response1.body);
  const response2 = await request(app)
    .post(`/api/study/test/${response_id}`)
    .set("Cookie", cookie)
    .send({ user_terms })
    .expect(200);

  expect(response2.body.user_terms[0].study_num).toEqual(1);

 const response3 = await request(app)
   .post(`/api/study/test/${response_id}`)
   .set("Cookie", cookie)
   .send({ user_terms })
   .expect(200);

 expect(response3.body.user_terms[0].study_num).toEqual(2);

 const response4 = await request(app)
   .post(`/api/study/test/${response_id}`)
   .set("Cookie", cookie)
   .send({ user_terms })
   .expect(200);

 expect(response4.body.user_terms[0].study_num).toEqual(3);

 const response5 = await request(app)
   .post(`/api/study/test/${response_id}`)
   .set("Cookie", cookie)
   .send({ user_terms })
   .expect(200);

 expect(response5.body.user_terms[0].study_num).toEqual(3);
});
