import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@quizlet-clone/common";
import {showTermsRouter} from "./routes/term";
import { showDefinitionsRouter } from "./routes/definition";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

//routes will go here
app.use(showTermsRouter);
app.use(showDefinitionsRouter);


app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };