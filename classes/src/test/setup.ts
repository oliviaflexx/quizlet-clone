import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";


import jwt from "jsonwebtoken";

declare global {
   var signin: (version: number) => Promise<string[]>;
}

jest.mock("../nats-wrapper");
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
jest.setTimeout(30000000);
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {

  // await mongoose.connection.dropDatabase();

  await mongo.stop();
    await mongoose.connection.close();
});

const createdId = new mongoose.Types.ObjectId().toHexString();
// Fake cookie!
global.signin = async (version) => {
  // Build a JWT payload.  { id, email }
  if (version === 1) {
    const payload = {
      id: new mongoose.Types.ObjectId().toHexString(),
      email: "test@test.com",
      name: "testingUsername",
    };

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    // return a string thats the cookie with the encoded data
    return [`express:sess=${base64}`];
  } else {
    const payload = {
      id: new mongoose.Types.ObjectId().toHexString(),
      email: "test@test2.com",
      name: "testingUsername2",
    };

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    // return a string thats the cookie with the encoded data
    return [`express:sess=${base64}`];
  }
};

export {createdId};