import { Router } from 'express';
import UserController from '../controllers/user.controller';

const AuthRouter = Router();

AuthRouter.post('/sign-up', UserController.signUp);
AuthRouter.post('/sign-in', UserController.signIn);
export default AuthRouter;
