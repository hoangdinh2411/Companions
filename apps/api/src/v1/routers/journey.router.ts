import { Router } from 'express';
import JourneyController from '../controllers/journey.controller';

const JourneyRouter = Router();

JourneyRouter.post('/', JourneyController.add);
export default JourneyRouter;
