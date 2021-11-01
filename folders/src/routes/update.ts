import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "@quizlet-clone/common";
import { Folder } from "../models/folder";
import { natsWrapper } from "../nats-wrapper";
import { FolderUpdatedPublisher } from "../events/publishers/folder-updated-publisher";
import { setSourceMapRange } from "typescript";

const router = express.Router();

router.put(
  "/api/folders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const { title, set } = req.body;

    const folder = await Folder.findById(req.params.id);

    if (!folder) {
        throw new NotFoundError();
    }

    if (folder.creator !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    if (title) {
      folder.set({ title });
    }


    await folder.save();

    if (set) {
      folder.sets.push(set);
      await folder.save();
      await new FolderUpdatedPublisher(natsWrapper.client).publish({
        id: folder.id,
        title: folder.title,
        version: folder.version,
        setId: folder.sets[folder.sets.length - 1].set_id,
      });
    }

    res.send(folder);
  }
);

export { router as updateFolderRouter };
