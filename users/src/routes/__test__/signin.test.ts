import request from "supertest";
import { app } from "../../app";

it("fails when a username that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      password: "password",
      name: "testUsername"
    })
    .expect(400);
});


it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      name: "testUsername",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      password: "aslkdfjalskdfj",
      name: "testUsername"
    })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      name: "testUsername",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
      name: "testUsername",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
