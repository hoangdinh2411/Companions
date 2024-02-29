import { Router } from 'express';
import JourneyController from '../controllers/journey.controller';
import { authMiddleware } from '../middlewares/auth-middleware';

const JourneyRouter = Router();

JourneyRouter.post('/', authMiddleware, JourneyController.add);
JourneyRouter.get('/', JourneyController.getAll);
JourneyRouter.get('/search', JourneyController.search);
JourneyRouter.get('/filter', JourneyController.filter);
export default JourneyRouter;
