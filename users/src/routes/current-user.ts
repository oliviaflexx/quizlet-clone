import express from 'express';
import { currentUser } from '@quizlet-clone/common';

const router = express.Router();

router.get('/api/users/auth/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
