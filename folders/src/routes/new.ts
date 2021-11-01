import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from "@quizlet-clone/common";
import { Folder } from "../models/folder";
import { natsWrapper } from "../nats-wrapper";
import { FolderCreatedPublisher } from "../events/publishers/folder-created-publisher";

const router = express.Router();

router.post(
  "/api/folders",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title } = req.body;

    const folder = Folder.build({
      title,
      creator: req.currentUser!.id,
      dateCreated: new Date(),
    });

    await folder.save();

    await new FolderCreatedPublisher(natsWrapper.client).publish({
      id: folder.id,
      version: folder.version,
      title: folder.title,
      creator: folder.creator
    });

    res.status(201).send(folder);
  }
);

export { router as createFolderRouter };