import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@quizlet-clone/common";
import { UserSet } from "../models/user-set";
import { UserTerm } from "../models/user-term";
import { Term } from "../models/term";
import { findOrCreate } from "./functions/find-or-create";
import { TermStatusOptions } from "../term_status_options";

const router = express.Router();

router.put(
  "/api/study/term/:id/star",
  requireAuth,
  async (req: Request, res: Response) => {
    const user_term = await UserTerm.findById(req.params.id);

    if (user_term) {
      const mySet = await UserSet.findOne({
        owner_id: req.currentUser!.id,
        user_terms: user_term,
      });

      if (!mySet) {
        throw new NotAuthorizedError();
      }

      user_term.set({ starred: !user_term.starred });
      await user_term.save();
      res.send(user_term);
    } else {
      const term = await Term.findById(req.params.id);

      if (!term) {
        throw new NotFoundError();
      }
      try {
        const set = await findOrCreate(term.set_id, req.currentUser!.id);

        const user_term = set.user_terms.find(
          (user_term) => (user_term.term_id = term.id)
        );

        user_term!.set({ starred: !user_term!.starred });

        await user_term!.save();

        res.send(user_term);
      } catch (error) {
        throw new NotFoundError();
      }
    }
  }
);


router.put(
  "/api/study/term/:id/",
  requireAuth,
  async (req: Request, res: Response) => {
    const { flashcards, correct } = req.body;

    const user_term = await UserTerm.findById(req.params.id);

    if (!user_term) {
      throw new NotFoundError();
    }

    if (flashcards === true || user_term.study_num === 0) {
      if (user_term.status === TermStatusOptions.Not_Studied) {
        user_term.set({status: TermStatusOptions.Still_Learning, study_num: 1 })
      }
    }
    else if (correct === true && user_term.study_num !== 3) {
      if (user_term.study_num === 2) {
        user_term.set({
          status: TermStatusOptions.Mastered,
          study_num: 3,
        });
      }
      else {
        user_term.set({study_num: 2})
      }
    }
    else if (correct === false && user_term.study_num !== 1) {
      if (user_term.study_num === 3) {
        user_term.set({
          status: TermStatusOptions.Still_Learning,
          study_num: 2,
        });
      } else {
        user_term.set({ study_num: 1 });
      }
    }

    await user_term.save();
    res.send(user_term);

  }
);
export { router as updateTermRouter };
