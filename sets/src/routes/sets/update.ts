import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError
} from "@quizlet-clone/common";

import { Set } from '../../models/set';
import { ViewOptions } from "../../view-settings";
import { SetUpdatedPublisher } from "../../events/publishers/set-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.put(
  "/api/sets/set/:id",
  requireAuth,
  [
    body("title")
      .not()
      .isEmpty()
      .withMessage("Title is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title } = req.body;

    const set = await Set.findById(req.params.id);

    if (!set) {
      throw new NotFoundError();
    }

    if (set.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    // calculate new rating

    set.set({ title });

    await set.save();
    new SetUpdatedPublisher(natsWrapper.client).publish({
      id: set.id,
      version: set.version,
      title: set.title,
      term_amount: set.terms.length,
      termId: undefined,
    });

    res.send(set);
  }
);

router.put(
  "/api/sets/set/rating/:id",
  requireAuth,
  [body("rating").not().isEmpty().withMessage("Rating is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { rating } = req.body;

    const set = await Set.findById(req.params.id);

    if (!set) {
      throw new NotFoundError();
    }

    if (set.creatorId == req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    // calculate new rating
    if (set.rating.totalRaters === 0) {
      set.set({
        rating: {
          average: rating,
          totalRaters: 1,
        },
      });
    } else {
      const set_rating =
        (set.rating.totalRaters * set.rating.average + rating) /
        (set.rating.totalRaters + 1);

      set.set({
        rating: {
          average: set_rating,
          totalRaters: set.rating.totalRaters + 1,
        },
      });
    }

    await set.save();

    new SetUpdatedPublisher(natsWrapper.client).publish({
      id: set.id,
      version: set.version,
      title: set.title,
      termId: undefined,
      term_amount: set.terms.length
    });

    res.send(set);
  }
);


router.put(
  "/api/sets/set/view/:id",
  requireAuth,
  [
    body("viewableBy")
      .not()
      .isEmpty()
      .withMessage("View preferences are required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { viewableBy } = req.body;

    const set = await Set.findById(req.params.id);

    if (!set) {
      throw new NotFoundError();
    }

    const viewOptions = Object.values(ViewOptions);

    if (viewOptions.includes(viewableBy) === false) {
      throw new BadRequestError("Invalid input of viewableBy");
    }

    if (set.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    // calculate new rating

    set.set({ viewableBy });

    await set.save();

    new SetUpdatedPublisher(natsWrapper.client).publish({
      id: set.id,
      version: set.version,
      title: set.title,
      termId: undefined,
      term_amount: set.terms.length
    });

    res.send(set);
  }
);

router.put(
  "/api/sets/set/edit/:id",
  requireAuth,
  [
    body("editableBy")
      .not()
      .isEmpty()
      .withMessage("Edit preferences are required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { editableBy } = req.body;

    const set = await Set.findById(req.params.id);

    if (!set) {
      throw new NotFoundError();
    }

    if (set.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    set.set({ editableBy });

    new SetUpdatedPublisher(natsWrapper.client).publish({
      id: set.id,
      version: set.version,
      title: set.title,
      termId: undefined,
      term_amount: set.terms.length,
    });
    await set.save();

    res.send(set);
  }
);

export { router as updateSetRouter };
