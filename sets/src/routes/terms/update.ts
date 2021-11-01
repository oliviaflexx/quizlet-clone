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
import { TermUpdatedPublisher } from "../../events/publishers/term-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.put(
  "/api/sets/term/:id",
  requireAuth,
  [
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

    if (set.creator !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const foundTerm = await Term.findById(req.params.id);
    
    if (!foundTerm) {
      throw new NotFoundError();
    }

    foundTerm.set({
      term,
      definition,
    });

    await foundTerm.save();

    await new TermUpdatedPublisher(natsWrapper.client).publish({
      id: foundTerm.id,
      version: foundTerm.version,
      term: foundTerm.term,
      definition: foundTerm.definition,
    });

    res.send(foundTerm);
  }
);

export { router as updateTermRouter };