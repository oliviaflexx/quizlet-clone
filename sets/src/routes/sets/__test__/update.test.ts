import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";
import { ViewOptions } from "../../../view-settings";
import { EditOptions } from "../../../edit-settings";
import { natsWrapper } from "../../../nats-wrapper";

let title = "test title";
let viewableBy = ViewOptions.Everyone;
let editableBy = EditOptions.Me;

it("returns a 404 if the provided id does not exist for title change", async () => {
  const cookie = await global.signin();
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/sets/set/${id}`)
    .set("Cookie", cookie)
    .send({
      title,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated for title change", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/sets/set/${id}`)
    .send({
      title,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the set for title change", async () => {
  const cookie1 = await global.signin();
  const cookie2 = await global.signin();

  const response = await request(app)
    .post("/api/sets/set")
    .set("Cookie", cookie1)
    .send({
      title,
      viewableBy,
      editableBy,
    });

  await request(app)
    .put(`/api/sets/set/${response.body.id}`)
    .set("Cookie", cookie2)
    .send({
      title
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid inputs for title", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post("/api/sets/set")
    .set("Cookie", cookie)
    .send({
      title,
      viewableBy,
      editableBy,
    });

  await request(app)
    .put(`/api/sets/set/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
    })
    .expect(400);

});

it("updates the set title provided valid inputs", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post("/api/sets/set")
    .set("Cookie", cookie)
    .send({
      title,
      viewableBy,
      editableBy,
    });

  title = "new test title";

  await request(app)
    .put(`/api/sets/set/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
    })
    .expect(200);

  const setResponse = await request(app)
    .get(`/api/sets/set/${response.body.id}`)
    .send();

  expect(setResponse.body.title).toEqual(title);
});

it("publishes an event", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post("/api/sets/set")
    .set("Cookie", cookie)
    .send({
      title,
      viewableBy,
      editableBy,
    });

  title = "new test title";

  await request(app)
    .put(`/api/sets/set/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("creates first rating properly", async () => {
  const cookie1 = await global.signin();
  const cookie2 = await global.signin();

  const response = await request(app)
    .post("/api/sets/set")
    .set("Cookie", cookie1)
    .send({
      title,
      viewableBy,
      editableBy,
    });

  const rating = 4;
  await request(app)
    .put(`/api/sets/set/rating/${response.body.id}`)
    .set("Cookie", cookie2)
    .send({
      rating,
    })
    .expect(200);

  const setResponse = await request(app)
    .get(`/api/sets/set/${response.body.id}`)
    .send();

  expect(setResponse.body.rating.average).toEqual(4);
  expect(setResponse.body.rating.totalRaters).toEqual(1);
});

it("creates second rating properly", async () => {
  const cookie1 = await global.signin();
  const cookie2 = await global.signin();
  const cookie3 = await global.signin();

  const response = await request(app)
    .post("/api/sets/set")
    .set("Cookie", cookie1)
    .send({
      title,
      viewableBy,
      editableBy,
    });

  await request(app)
    .put(`/api/sets/set/rating/${response.body.id}`)
    .set("Cookie", cookie2)
    .send({
      rating: 2,
    })
    .expect(200);

  await request(app)
    .put(`/api/sets/set/rating/${response.body.id}`)
    .set("Cookie", cookie3)
    .send({
      rating: 1,
    })
    .expect(200);

  const setResponse = await request(app)
    .get(`/api/sets/set/${response.body.id}`)
    .send();

  expect(setResponse.body.rating.average).toEqual(1.5);
  expect(setResponse.body.rating.totalRaters).toEqual(2);
});

it("can't rate your own set", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post("/api/sets/set")
    .set("Cookie", cookie)
    .send({
      title,
      viewableBy,
      editableBy,
    });

  await request(app)
    .put(`/api/sets/set/rating/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      rating: 2,
    })
    .expect(401);
});

it("can change view settings if authorized", async () => {
  const cookie1 = await global.signin();
  const cookie2 = await global.signin();

  const response = await request(app)
    .post("/api/sets/set")
    .set("Cookie", cookie1)
    .send({
      title,
      viewableBy,
      editableBy,
    });
  await request(app)
    .put(`/api/sets/set/view/${response.body.id}`)
    .set("Cookie", cookie1)
    .send({
      viewableBy: ViewOptions.Everyone,
    })
    .expect(200);

  await request(app)
    .put(`/api/sets/set/view/${response.body.id}`)
    .set("Cookie", cookie2)
    .send({
      viewableBy: ViewOptions.Everyone,
    })
    .expect(401);
});

it("can change edit settings if authorized", async () => {
  const cookie1 = await global.signin();
  const cookie2 = await global.signin();

  const response = await request(app)
    .post("/api/sets/set")
    .set("Cookie", cookie1)
    .send({
      title,
      viewableBy,
      editableBy,
    });
  await request(app)
    .put(`/api/sets/set/edit/${response.body.id}`)
    .set("Cookie", cookie1)
    .send({
      editableBy: EditOptions.Classes,
    })
    .expect(200);

  await request(app)
    .put(`/api/sets/set/edit/${response.body.id}`)
    .set("Cookie", cookie2)
    .send({
      editableBy: EditOptions.Classes,
    })
    .expect(401);
});
