import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  validateRequest
} from "@quizlet-clone/common";

import { findOrCreate } from "./functions/find-or-create";

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
    const { current_index } = req.body;

    try {
        const set = await findOrCreate(req.params.id, req.currentUser!.id);
        set.flashcards.current_index = current_index;
        set.save();
        res.send(set);
    }
    catch(error) {
        throw new NotFoundError();
    }
    
  }
);

export { router as flashcardsRouter };