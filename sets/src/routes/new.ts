import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest, BadRequestError} from "@quizlet-clone/common";
import { Set } from "../models/set";
import {ViewOptions} from "../view-settings";
import { EditOptions } from "../edit-settings";

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
    const { title, terms, viewableBy, editableBy, studiers, folders, classes } = req.body;

    const viewOptions = Object.values(ViewOptions);
    const editOptions = Object.values(EditOptions);
    if (viewOptions.includes(viewableBy) === false) {
      throw new BadRequestError("Invalid input of viewableBy");
    }
     if (editOptions.includes(editableBy) === false) {
       throw new BadRequestError("Invalid input of editableBy");
     }

  
    const set = Set.build({
      title,
      viewableBy,
      editableBy,
      creator: req.currentUser!.id,
      terms,
      studiers,
      folders,
      classes,
      dateCreated: new Date()
    });

    await set.save();

    res.status(201).send(set);

  }
);

export { router as createSetRouter };
