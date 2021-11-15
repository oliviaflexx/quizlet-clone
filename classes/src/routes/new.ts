import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from "@quizlet-clone/common";
import { Class } from "../models/class";
import { natsWrapper } from "../nats-wrapper";
import { ClassCreatedPublisher } from "../events/publishers/class-created-publisher";
import crypto from "crypto";

const router = express.Router();

router.post(
  "/api/classes",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("school").not().isEmpty().withMessage("School is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, school} = req.body;

    const newClass = Class.build({
      title,
      adminId: req.currentUser!.id,
      adminName: req.currentUser!.name,
      dateCreated: new Date(),
      school,
      link: crypto.randomBytes(20).toString("hex"),
      numSets: 0
    });

    await newClass.save();

    await new ClassCreatedPublisher(natsWrapper.client).publish({
      id: newClass.id,
      version: newClass.version,
      title: newClass.title,
      admin: newClass.adminName,
      school: newClass.school
    });

    res.status(201).send(newClass);
  }
);

export { router as createClassRouter };
