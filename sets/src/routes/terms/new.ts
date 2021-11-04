import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from "@quizlet-clone/common";

import { Set } from "../../models/set";
import { Term } from "../../models/term";
import { SetUpdatedPublisher } from "../../events/publishers/set-updated-publisher";
import { TermCreatedPublisher } from "../../events/publishers/term-created-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.post("/api/sets/term/", requireAuth, [
  body("setId").not().isEmpty().withMessage("Set id is required"),
  body("term").not().isEmpty().withMessage("Term is required"),
  body("definition").not().isEmpty().withMessage("Definition is required"),
],
validateRequest,
  async (req: Request, res: Response) => {
    const { setId, term, definition } = req.body;

    const set = await Set.findById(setId);

    if (!set) {
      throw new NotFoundError();
    }

    if (set.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const newTerm = Term.build({term, definition});
    await newTerm.save();

    set.terms.push(newTerm);
    await set.save()

    await new TermCreatedPublisher(natsWrapper.client).publish({
      id: newTerm.id,
      version: newTerm.version,
      term: newTerm.term,
      definition: newTerm.definition,
      set_id: set.id
    });

    await new SetUpdatedPublisher(natsWrapper.client).publish({
      id: set.id,
      version: set.version,
      title: set.title,
      termId: newTerm.id,
      term_amount: set.terms.length,
    });

    res.status(201).send(newTerm);
  }
);

export { router as createTermRouter };