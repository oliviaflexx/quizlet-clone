import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from "@quizlet-clone/common";
import { User } from '../models/user';
import { Library } from "../models/library";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
    body("name").notEmpty().withMessage("You must supply a username"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    const existingUserEmail = await User.findOne({ email });

    if (existingUserEmail) {
      throw new BadRequestError("Email in use");
    }

    const existingUsername = await User.findOne({ name });

    if (existingUsername) {
      throw new BadRequestError("Username in use");
    }

    const user = User.build({ email, password, name });
    await user.save();

    const library = Library.build({user: user});
    await library.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };