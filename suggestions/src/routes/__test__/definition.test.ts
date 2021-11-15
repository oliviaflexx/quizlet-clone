import request from "supertest";
import { app } from "../../app";
import { Term } from "../../models/term";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

// Only used to start, not real test
it("has a route handler listening to /api/sets for post requests", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .get("/api/suggestions/definition")
    .set("Cookie", cookie)
    .send({ term: "approach", definition: "this is the definition" });

});
