import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth-middleware';

const userRouter = Router();

userRouter.get('/profile', UserController.getUser);
userRouter.patch('/sign-out', UserController.signOut);
userRouter.get('/history', UserController.getHistory);
export default userRouter;
