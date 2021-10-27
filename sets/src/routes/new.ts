import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@quizlet-clone/common";
import { Set } from "../models/set";

const router = express.Router();

router.post(
  "/api/sets",
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

    const set = Set.build({
      title,
      viewableBy,
      editableBy,
      creator: req.currentUser!.id,
      terms
    });
    await set.save();

    res.status(201).send(set);
    // res.status(201).send("got it");
  }
);

export { router as createSetRouter };
