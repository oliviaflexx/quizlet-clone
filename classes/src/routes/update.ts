import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "@quizlet-clone/common";
import { Class } from "../models/class";
import { Set } from "../models/set";
import { Folder } from "../models/folder";
import { natsWrapper } from "../nats-wrapper";
import { ClassUpdatedPublisher } from "../events/publishers/class-updated-publisher";

const router = express.Router();

router.put(
  "/api/classes/join",
  requireAuth,
  [body("link").not().isEmpty().withMessage("Link is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { link } = req.body;

    const foundClass = await Class.findOne({ link: link });

    if (!foundClass) {
      throw new NotFoundError();
    }

    const isMember = foundClass.members.find(
      (member) => member === req.currentUser!.id
    );

    if (isMember) {
      throw new BadRequestError("User is already a member of this class");
    }

    foundClass.members.push(req.currentUser!.id);

    await foundClass.save();

    await new ClassUpdatedPublisher(natsWrapper.client).publish({
      id: foundClass.id,
      title: foundClass.title,
      version: foundClass.version,
      admin: foundClass.adminName,
      numSets: foundClass.numSets,
      members: foundClass.members
    });

    res.send(foundClass);
  }
);

router.put(
  "/api/classes/:id/set",
  requireAuth,
  [body("set_id").not().isEmpty().withMessage("Set id is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { set_id } = req.body;

    const foundClass = await Class.findById(req.params.id);

    if (!foundClass) {
      throw new NotFoundError();
    }

    const isMember = foundClass.members.find(
      (member) => member === req.currentUser!.id
    );

    if (!isMember) {
      throw new NotAuthorizedError();
    }

    const set = await Set.findById(set_id);

    if (!set) {
      throw new NotFoundError();
    }

    foundClass.sets.push(set);
    foundClass.set({numSets: foundClass.numSets + 1});
    await foundClass.save();

    await new ClassUpdatedPublisher(natsWrapper.client).publish({
      id: foundClass.id,
      title: foundClass.title,
      version: foundClass.version,
      admin: foundClass.adminName,
      numSets: foundClass.numSets,
      members: foundClass.members,
    });

    res.send(foundClass);
  }
);
router.put(
  "/api/classes/:id/folder",
  requireAuth,
  [body("folder_id").not().isEmpty().withMessage("Folder id is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { folder_id } = req.body;

    const foundClass = await Class.findById(req.params.id);

    if (!foundClass) {
      throw new NotFoundError();
    }

    const isMember = foundClass.members.find(
      (member) => member === req.currentUser!.id
    );

    if (!isMember) {
      throw new NotAuthorizedError();
    }

    const folder = await Folder.findById(folder_id);

    if (!folder) {
      throw new NotFoundError();
    }

    foundClass.folders.push(folder);
    foundClass.set({ numSets: foundClass.numSets + folder.num_of_sets });
    await foundClass.save();

    await new ClassUpdatedPublisher(natsWrapper.client).publish({
      id: foundClass.id,
      title: foundClass.title,
      version: foundClass.version,
      admin: foundClass.adminName,
      numSets: foundClass.numSets,
      members: foundClass.members,
    });

    res.send(foundClass);
  }
);

router.put(
  "/api/classes/:id/",
  requireAuth,
  [body("title").not().isEmpty().withMessage("Title is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title } = req.body;

    const foundClass = await Class.findById(req.params.id);

    if (!foundClass) {
      throw new NotFoundError();
    }

    if (foundClass.adminId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    foundClass.set({ title: title });
    await foundClass.save();

    await new ClassUpdatedPublisher(natsWrapper.client).publish({
      id: foundClass.id,
      title: foundClass.title,
      version: foundClass.version,
      admin: foundClass.adminName,
      numSets: foundClass.numSets,
      members: foundClass.members,
    });

    res.send(foundClass);
  }
);

export { router as updateClassRouter };
