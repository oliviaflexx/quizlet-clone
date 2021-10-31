import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
} from "@quizlet-clone/common";
import { Term } from "../models/term";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/api/suggestions/term",
  requireAuth,
  async (req: Request, res: Response) => {
    const {term} = req.body;

    // TESTING PURPOSES ONLY
    await Term.build({
      term: "approach",
      definition: "this is the definition for approach",
      term_id: new mongoose.Types.ObjectId().toHexString(),
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

    const terms = await Term.find(
      { term: { $regex: term, $options: "i" } },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log(docs);
        }
      }
    );

    if (!terms) {
      throw new NotFoundError();
    }

    res.send(terms);
  }
);

export { router as showTermsRouter };
