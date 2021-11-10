import express, { Request, Response } from "express";
import { requireAuth, NotFoundError } from "@quizlet-clone/common";
import { UserSet } from "../models/user-set";
import { findOrCreate } from "./functions/find-or-create";

const router = express.Router();

router.get(
    "/api/study/:id",
    requireAuth,
    async (req: Request, res: Response) => {

        try {
            const set = await findOrCreate(req.params.id, req.currentUser!.id);
            res.send(set);
        }
        catch(error) {
            throw new NotFoundError();
        }

        //publish study event here

    }
)

export { router as showSetRouter };