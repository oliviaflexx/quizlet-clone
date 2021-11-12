import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  validateRequest,
  BadRequestError,
  Listener,
} from "@quizlet-clone/common";

import { findOrCreate } from "./functions/find-or-create";
import { UserSetDoc, UserSet } from "../models/user-set";

const router = express.Router();

router.put(
  "/api/study/write/:id",
  requireAuth,
  [
    body("current_index")
      .not()
      .isEmpty()
      .withMessage("current_index is required"),
    body("remaining").not().isEmpty().withMessage("remaining is required"),
    body("correct").not().isEmpty().withMessage("correct is required"),
    body("incorrect").not().isEmpty().withMessage("incorrect is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { current_index, remaining, correct, incorrect } = req.body;

    let set = await UserSet.findOne({});

    try {
      set = await findOrCreate(req.params.id, req.currentUser!.id);
    } catch (error) {
      throw new NotFoundError();
    }

    if (set.user_terms.length !== correct + incorrect) {
      throw new BadRequestError("Invalid inputs");
    }
    if (set.user_terms.length !== current_index + remaining) {
      throw new BadRequestError("Invalid inputs");
    }

    set.write.current_index = current_index;
    set.write.remaining = remaining;
    set.write.correct = correct;
    set.write.incorrect = incorrect;
    set.write.last_studied = new Date();
    set.save();
    res.send(set);
  }
);

export { router as writeRouter };
