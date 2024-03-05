import { Router } from 'express';
import JourneyController from '../controllers/journey.controller';
import { authMiddleware } from '../middlewares/auth-middleware';

const journeyRouter = Router();

journeyRouter.get('/', JourneyController.getAll);
journeyRouter.post('/', authMiddleware, JourneyController.add);
journeyRouter.post('/insert', JourneyController.insertManyDocuments);
journeyRouter.get('/search', JourneyController.search);
journeyRouter.get('/filter', JourneyController.filter);
journeyRouter.get('/:slug', JourneyController.getOneBySlug);
journeyRouter.put('/:journey_id/join', authMiddleware, JourneyController.join);
export default journeyRouter;
