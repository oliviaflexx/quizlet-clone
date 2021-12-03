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

    const existingFolder = await Folder.findOne({
      title,
      creatorId: req.currentUser!.id,
    });

    if (existingFolder) {
      throw new BadRequestError("Title is the same as another folder")
    }
    
    const folder = Folder.build({
      title,
      creatorId: req.currentUser!.id,
      creatorName: req.currentUser!.name,
      dateCreated: new Date(),
    });

    await folder.save();

    new FolderCreatedPublisher(natsWrapper.client).publish({
      id: folder.id,
      version: folder.version,
      title: folder.title,
      creator: folder.creatorName
    });
    

    res.status(201).send(folder);
  }
);

export { router as createFolderRouter };