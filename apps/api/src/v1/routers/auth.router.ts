import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth-middleware';

const authRouter = Router();

authRouter.post('/sign-up', UserController.signUp);
authRouter.post('/sign-in', UserController.signIn);
authRouter.get('/verify/:verify_code/:email', UserController.verify);
authRouter.post('/identify/:id_number', UserController.identifyByBankId);
export default authRouter;
