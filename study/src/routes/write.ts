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
import { StudyCompletePublisher } from "../events/publishers/study-complete-publisher";
import { StudyCreatedPublisher } from "../events/publishers/study-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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
    let { current_index, remaining, correct, incorrect } = req.body;
    let completed: boolean = false;
    let created: boolean = false;

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

    if (current_index === set.user_terms.length) {
      completed = true;
      current_index = 0;
      remaining = set.user_terms.length;
      correct = 0;
      incorrect = 0;
    } else if (current_index === 1) {
      created = true;
    }

    set.write.current_index = current_index;
    set.write.remaining = remaining;
    set.write.correct = correct;
    set.write.incorrect = incorrect;
    set.write.last_studied = new Date();
    set.save();

    if (completed) {
      await new StudyCompletePublisher(natsWrapper.client).publish({
        type: "write",
        userId: req.currentUser!.id,
        date: new Date(),
        setId: set.set_id,
      });
    } else if (created) {
      await new StudyCreatedPublisher(natsWrapper.client).publish({
        type: "write",
        userId: req.currentUser!.id,
        date: new Date(),
        setId: set.set_id,
      });
    }
    res.send(set);
  }
);

export { router as writeRouter };
