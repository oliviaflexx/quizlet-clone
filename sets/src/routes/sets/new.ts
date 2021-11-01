import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest, BadRequestError} from "@quizlet-clone/common";
import { Set } from "../../models/set";
import {ViewOptions} from "../../view-settings";
import { EditOptions } from "../../edit-settings";
import { SetCreatedPublisher } from "../../events/publishers/set-created-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.post(
  "/api/sets/set",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
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
    const { title, viewableBy, editableBy, studiers, folders, classes } = req.body;

    const viewOptions = Object.values(ViewOptions);
    if (viewOptions.includes(viewableBy) === false) {
      throw new BadRequestError("Invalid input of viewableBy");
    }

     const editOptions = Object.values(EditOptions);
     if (editOptions.includes(editableBy) === false) {
       throw new BadRequestError("Invalid input of editableBy");
     }

    const set = Set.build({
      title,
      viewableBy,
      editableBy,
      creator: req.currentUser!.id,
      studiers,
      folders,
      classes,
      dateCreated: new Date(),
    });

    await set.save();

    await new SetCreatedPublisher(natsWrapper.client).publish({
      id: set.id,
      title: set.title,
      version: set.version,
      creator: set.creator
    });

    res.status(201).send(set);

  }
);

export { router as createSetRouter };
