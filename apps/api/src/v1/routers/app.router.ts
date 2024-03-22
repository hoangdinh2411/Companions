import { Router } from 'express';
import AppController from '../controllers/app.controller';

const appRouter = Router();

appRouter.get('/statistic', AppController.getStatisticForHomePage);
appRouter.get('/update-documents', AppController.updateStatusOfOldDocuments);

export default appRouter;
