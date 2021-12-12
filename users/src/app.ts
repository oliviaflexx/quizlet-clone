import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@quizlet-clone/common';
import { libraryRouter } from './routes/show-library';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(libraryRouter);

console.log("test change");

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app}