import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@quizlet-clone/common";
import { showSetRouter } from "./routes/show-set";
import { updateTermRouter } from "./routes/update-term";

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
app.use(updateTermRouter);
app.use(showSetRouter);


app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };