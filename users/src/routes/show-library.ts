import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import {
  validateRequest,
  BadRequestError,
  NotFoundError,
} from "@quizlet-clone/common";
import { User } from "../models/user";
import { Library } from "../models/library";

const router = express.Router();

router.get("/api/users/library/:id", async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new NotFoundError();
  }

  const library = await Library.findOne({ user: user });

  if (!library) {
    throw new NotFoundError();
  }

  try {
    library.populate([{ path: "sets.created.set", model: "Set" }]);
  }
  catch(error) {
    console.log(error);
  }
  try {
    library.populate([{ path: "sets.studied.set", model: "Set" }]);
  }
  catch(error) {
    console.log(error);
  }
  
  try {
    library.populate([{ path: "folders.created.folder", model: "Folder" }]);
  } catch(error) {
    console.log(error);
  }
  
  try {
    library.populate([{ path: "classes", model: "Class" }]);
  } catch(error) {
    console.log(error);
  }
  

  res.status(200).send(library);
});

export { router as libraryRouter };
