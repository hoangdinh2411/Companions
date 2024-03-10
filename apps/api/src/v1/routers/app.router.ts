import { Router } from 'express';
import AppController from '../controllers/app.controler';

const appRouter = Router();

appRouter.get('/statistic', AppController.getStatisticForHomePage);

export default appRouter;
