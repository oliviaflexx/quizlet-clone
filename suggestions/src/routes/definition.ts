import express, { Request, Response } from "express";
import { requireAuth, NotFoundError } from "@quizlet-clone/common";
import { Term } from "../models/term";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/api/suggestions/definition",
  requireAuth,
  async (req: Request, res: Response) => {
    const { term, definition } = req.body;

    // TESTING PURPOSES ONLY
    await Term.build({
      term: "approach",
      definition: "this is the definition for approach",
      term_id: new mongoose.Types.ObjectId().toHexString()
    }).save();

    await Term.build({
      term: "appeal",
      definition: "this is the definition for appeal",
      term_id: new mongoose.Types.ObjectId().toHexString(),
    }).save();

    await Term.build({
      term: "apathy",
      definition: "this is the definition for apathy",
      term_id: new mongoose.Types.ObjectId().toHexString(),
    }).save();

    // const allTerms = await Term.find({});
    // console.log(allTerms);

    const definitions = await Term.find(
        {term: term,
      definition: { $regex: definition, $options: "i" } 
        });

    if (!definitions) {
      throw new NotFoundError();
    }

    res.send(definitions);
  }
);

export { router as showDefinitionsRouter };
