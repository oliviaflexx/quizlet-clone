import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  validateRequest
} from "@quizlet-clone/common";

import { findOrCreate } from "./functions/find-or-create";
import { StudyCompletePublisher } from "../events/publishers/study-complete-publisher";
import { StudyCreatedPublisher } from "../events/publishers/study-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/study/flashcards/:id",
  requireAuth,
  [
    body("current_index")
      .not()
      .isEmpty()
      .withMessage("current_index is required")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { current_index } = req.body;

    let completed: boolean = false;
    let created: boolean = false;

    try {
        const set = await findOrCreate(req.params.id, req.currentUser!.id);

        if (current_index === set.user_terms.length) {
          completed = true;
          current_index = 0;
        } 
        else if (current_index === 1) {
          created = true;
        }

        set.flashcards.current_index = current_index;
        set.flashcards.last_studied = new Date();
        set.save();

        if (completed) {
          await new StudyCompletePublisher(natsWrapper.client).publish({
            type: "flashcards",
            userId: req.currentUser!.id,
            date: new Date(),
            setId: set.set_id
          });
        }
        else if (created) {
          await new StudyCreatedPublisher(natsWrapper.client).publish({
            type: "flashcards",
            userId: req.currentUser!.id,
            date: new Date(),
            setId: set.set_id,
          });
        }
        

        res.send(set);
    }
    catch(error) {
        throw new NotFoundError();
    }
    
  }
);

export { router as flashcardsRouter };