import express, { Request, Response } from "express";
import { requireAuth, NotFoundError } from "@quizlet-clone/common";
import { findOrCreate } from "./functions/find-or-create";
import { UserSet } from "../models/user-set";

const router = express.Router();

router.get(
  "/api/study/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const set = await UserSet.findOne({set_id: req.params.id, owner_id: req.currentUser!.id}).populate([
      {
        path: "user_terms",
        model: "UserTerm",
        populate: {
          path: "term_id",
          model: "Term",
        },
      },
    ]);
    
    if (!set) {
      throw new NotFoundError();
    }
    res.send(set);
  }
);

export { router as showSetRouter };
