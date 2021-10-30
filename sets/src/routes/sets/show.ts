import express, { Request, Response } from "express";
import { NotFoundError, NotAuthorizedError } from "@quizlet-clone/common";
import { Set } from "../../models/set";
import {ViewOptions} from "../../view-settings";

const router = express.Router();

router.get("/api/sets/set/:id", async (req: Request, res: Response) => {
  const set = await Set.findById(req.params.id).populate('terms');

  if (!set) {
    throw new NotFoundError();
  }

  if (set.viewableBy === ViewOptions.Me && set.creator !== req.currentUser!.id ) {
    throw new NotAuthorizedError();
  }

  // Add checks for classes and password
  res.status(200).send(set);
});

export { router as showSetRouter };
