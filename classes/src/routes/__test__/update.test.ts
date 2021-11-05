import request from "supertest";
import { app } from "../../app";
import { Class } from "../../models/class";
import { Set } from "../../models/set";
import { Folder } from "../../models/folder";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

const setup = async () => {
  const set = Set.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "set test title",
    creator: "oliviaflexx",
    num_of_terms: 0,
  });

  await set.save();

  const folder = Folder.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "folder test title",
    creator: "oliviaflexx",
    num_of_sets: 0,
  });

  await folder.save();

  return { set, folder };
};

it("updates a title if user is admin", async () => {
  const cookie = await global.signin(1);
  const makeClass = await request(app)
    .post("/api/classes/")
    .set("Cookie", cookie)
    .send({ title: "test title", school: "mcgill" })
    .expect(201);

  const updateClass = await request(app)
    .put(`/api/classes/${makeClass.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "test title 2" })
    .expect(200);

  const cookie2 = await global.signin(1);
  const updateClass2 = await request(app)
    .put(`/api/classes/${makeClass.body.id}`)
    .set("Cookie", cookie2)
    .send({ title: "test title 2" })
    .expect(401);

  expect(updateClass.body.title).toEqual("test title 2");
});

it("user can join a class if user is not in class already, and has correct link ", async () => {
  const cookie = await global.signin(1);
  const makeClass = await request(app)
    .post("/api/classes/")
    .set("Cookie", cookie)
    .send({ title: "test title", school: "mcgill" })
    .expect(201);

  const cookie2 = await global.signin(2);
  const joinClass = await request(app)
    .put("/api/classes/join")
    .set("Cookie", cookie2)
    .send({ link: "123" })
    .expect(404);

  const joinClass2 = await request(app)
    .put("/api/classes/join")
    .set("Cookie", cookie2)
    .send({ link: makeClass.body.link })
    .expect(200);

  const joinClass3 = await request(app)
    .put("/api/classes/join")
    .set("Cookie", cookie2)
    .send({ link: makeClass.body.link })
    .expect(400);

  expect(joinClass2.body.title).toEqual("test title");
});

it("user can add a set to a class if user is in class and set exists ", async () => {
  const { set, folder } = await setup();

  const cookie = await global.signin(1);
  const makeClass = await request(app)
    .post("/api/classes/")
    .set("Cookie", cookie)
    .send({ title: "test title", school: "mcgill" })
    .expect(201);

  const cookie2 = await global.signin(2);

  const cookie3 = await global.signin(2);

  const joinClass = await request(app)
    .put("/api/classes/join")
    .set("Cookie", cookie2)
    .send({ link: makeClass.body.link })
    .expect(200);

  const addSet1 = await request(app)
    .put(`/api/classes/${makeClass.body.id}/set`)
    .set("Cookie", cookie2)
    .send({ set_id: "" })
    .expect(400);

  const addSet2 = await request(app)
    .put(`/api/classes/${makeClass.body.id}/set`)
    .set("Cookie", cookie3)
    .send({ set_id: set.id })
    .expect(401);

  const addSet3 = await request(app)
    .put(`/api/classes/${makeClass.body.id}/set`)
    .set("Cookie", cookie2)
    .send({ set_id: set.id })
    .expect(200);

  const foundClass = await Class.findOne({}).populate("sets");
  expect(foundClass!.sets.length).toEqual(1);
  expect(foundClass!.sets[0].title).toEqual("set test title");
});

it("user can add a set to a class if user is in class and set exists ", async () => {
  const { set, folder } = await setup();

  const cookie = await global.signin(1);
  const makeClass = await request(app)
    .post("/api/classes/")
    .set("Cookie", cookie)
    .send({ title: "test title", school: "mcgill" })
    .expect(201);

  const cookie2 = await global.signin(2);

  const cookie3 = await global.signin(2);

  const joinClass = await request(app)
    .put("/api/classes/join")
    .set("Cookie", cookie2)
    .send({ link: makeClass.body.link })
    .expect(200);

  const addFolder1 = await request(app)
    .put(`/api/classes/${makeClass.body.id}/folder`)
    .set("Cookie", cookie2)
    .send({ folder_id: "" })
    .expect(400);

  const addFolder2 = await request(app)
    .put(`/api/classes/${makeClass.body.id}/folder`)
    .set("Cookie", cookie3)
    .send({ folder_id: folder.id })
    .expect(401);

  const addFolder3 = await request(app)
    .put(`/api/classes/${makeClass.body.id}/folder`)
    .set("Cookie", cookie2)
    .send({ folder_id: folder.id })
    .expect(200);

  const foundClass = await Class.findOne({}).populate("folders");
  expect(foundClass!.folders.length).toEqual(1);
  expect(foundClass!.folders[0].title).toEqual("folder test title");
});
