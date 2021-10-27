import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@quizlet-clone/common";

import { Set } from '../models/set';

const router = express.Router();

router.put(
  "/api/sets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("terms").not().isEmpty().withMessage("Terms are required"),
    body("viewableBy")
      .not()
      .isEmpty()
      .withMessage("View preferences are required"),
    body("editableBy")
      .not()
      .isEmpty()
      .withMessage("Edit preferences are required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
      const { title, terms, viewableBy, editableBy } = req.body;

    const set = await Set.findById(req.params.id);

    if (!set) {
      throw new NotFoundError();
    }

    if (set.creator !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    set.set({
      title,
      viewableBy,
      editableBy,
      terms
    });

    await set.save();

    res.send(set);
  }
);

export { router as updateSetRouter };
