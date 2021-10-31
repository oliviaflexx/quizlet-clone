import express, { Request, Response } from "express";
import { NotFoundError } from "@quizlet-clone/common";
import { Set } from "../../models/set";

const router = express.Router();

router.get("/api/sets/set", async (req: Request, res: Response) => {
  const sets = await Set.find({}).populate("terms");

  if (!sets) {
    throw new NotFoundError();
  }

  res.status(200).send(sets);
});

export { router as indexSetRouter };
