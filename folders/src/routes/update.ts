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
import { Set } from "../models/set";
import { natsWrapper } from "../nats-wrapper";
import { FolderUpdatedPublisher } from "../events/publishers/folder-updated-publisher";


const router = express.Router();

router.put(
  "/api/folders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const { title, set_id } = req.body;

    const folder = await Folder.findById(req.params.id);

    if (!folder) {
        throw new NotFoundError();
    }

    if (folder.creatorId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    if (title) {
      folder.set({ title });
      await folder.save();
      await new FolderUpdatedPublisher(natsWrapper.client).publish({
        id: folder.id,
        title: folder.title,
        version: folder.version,
        setId: undefined,
        set_amount: folder.sets.length
      });
    }

    else {
      if (!set_id) {
        throw new NotFoundError();
      }

      const set = await Set.findById(set_id);

      if (!set) {
        throw new NotFoundError();
      }

      folder.sets.push(set);
      await folder.save();
      await new FolderUpdatedPublisher(natsWrapper.client).publish({
        id: folder.id,
        title: folder.title,
        version: folder.version,
        setId: folder.sets[folder.sets.length - 1].id,
        set_amount: folder.sets.length
      });
    
    }


    res.send(folder);
  }
);

export { router as updateFolderRouter };
