import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  BadRequestError, NotFoundError,
} from "@quizlet-clone/common";
import { Folder } from "../models/folder";

const router = express.Router();

router.get(
  "/api/folders/:id",
  async (req: Request, res: Response) => {

    const folder = await Folder.findById(req.params.id);

    if (!folder) {
        throw new NotFoundError;
    }
    res.send(folder);
  }
);

export { router as showFolderRouter };
