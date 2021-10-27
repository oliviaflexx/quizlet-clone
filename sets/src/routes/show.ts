import express, { Request, Response } from "express";
import { NotFoundError } from "@quizlet-clone/common";
import { Set } from "../models/set";

const router = express.Router();

router.get("/api/sets/:id", async (req: Request, res: Response) => {
  const set = await Set.findById(req.params.id);

  if (!set) {
    throw new NotFoundError();
  }

  res.status(200).send(set);
});

export { router as showSetRouter };
