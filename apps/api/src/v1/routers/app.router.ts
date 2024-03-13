import { Router } from 'express';
import AppController from '../controllers/app.controller';

const appRouter = Router();

appRouter.get('/statistic', AppController.getStatisticForHomePage);

export default appRouter;
