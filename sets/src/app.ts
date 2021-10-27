import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@quizlet-clone/common";
import {createSetRouter} from "./routes/new";
import { showSetRouter } from "./routes/show";
import { indexSetRouter } from "./routes/index";
import { updateSetRouter } from "./routes/update";

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
app.use(createSetRouter);
app.use(showSetRouter);
app.use(indexSetRouter);
app.use(updateSetRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };