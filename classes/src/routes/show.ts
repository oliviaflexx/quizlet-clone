import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from "@quizlet-clone/common";
import { Class } from "../models/class";

const router = express.Router();

router.get("/api/classes/:id", requireAuth, async (req: Request, res: Response) => {
  const foundClass = await Class.findById(req.params.id);

  if (!foundClass) {
    throw new NotFoundError();
  }

  const isMember = foundClass.members.find((member) => member === req.currentUser!.id);

  if (!isMember) {
   throw new NotAuthorizedError();
  }
 
  res.send(foundClass);
});

export { router as showClassRouter };
