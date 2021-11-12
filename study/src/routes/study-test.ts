import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  validateRequest,
  BadRequestError,
  Listener,
} from "@quizlet-clone/common";

import { findOrCreate } from "./functions/find-or-create";
import { buildTest } from "./functions/test-builder";
import { UserSetDoc, UserSet } from "../models/user-set";
import { UserTerm } from "../models/user-term";
import { TermStatusOptions } from "../term_status_options";

const router = express.Router();

router.get(
    "/api/study/test/:id",
    requireAuth,
    [
        body("starred").not().isEmpty().withMessage("starred is required")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { starred } = req.body;

        // try findorcreate
        let set = await UserSet.findOne({});
        try {
            set = await findOrCreate(req.params.id, req.currentUser!.id);
        } catch (error) {
            console.log(error);
          throw new NotFoundError();
        }

        let user_terms = set.user_terms;

        if (starred) {
            user_terms = user_terms.filter(
              (user_term) => user_term.starred === true
            );
        }

        const test = await buildTest(user_terms);

        res.send(test);

    }
);

router.post(
  "/api/study/test/:id",
  requireAuth,
  [body("user_terms").not().isEmpty().withMessage("user_terms are required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { user_terms } = req.body;

    let set = await UserSet.findById(req.params.id);
;

    if (!set) {
      throw new NotFoundError();
    };

    let num_correct = 0;

    for (let user_term of user_terms) {
        let foundUserTerm = await UserTerm.findById(user_term.id);

        if (!foundUserTerm) {
            throw new NotFoundError();
        }

        if (foundUserTerm.study_num === 0) {
            foundUserTerm.set({
              status: TermStatusOptions.Still_Learning,
              study_num: 1,
            });
        }
        else if (user_term.correct === true && foundUserTerm.study_num !== 3){
          if (foundUserTerm.study_num === 2) {
            foundUserTerm.set({
              status: TermStatusOptions.Mastered,
              study_num: 3,
            });
          } else {
            foundUserTerm.set({ study_num: 2 });
          }
        }
        else if (user_term.correct === false && foundUserTerm.study_num !== 1) {
          if (foundUserTerm.study_num === 3) {
            foundUserTerm.set({
              status: TermStatusOptions.Still_Learning,
              study_num: 2,
            });
          } else {
            foundUserTerm.set({ study_num: 1 });
          }
        }

        if (user_term.correct === true) {
          num_correct++;
        }
        await foundUserTerm.save();
    }

    set.test.last_studied = new Date();
    set.test.num_times_completed = set.test.num_times_completed + 1;
    set.test.percent_correct = num_correct / user_terms.length;

    await set.save();

    set = await UserSet.findById(req.params.id).populate([
      {
        path: "user_terms",
        model: "UserTerm",
        populate: {
          path: "term_id",
          model: "Term",
        },
      },
    ]);


    res.send(set)
  }
);


export { router as testRouter }