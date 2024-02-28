import { Express } from 'express';
import AuthRouter from './auth.router';
import JourneyRouter from './journey.router';
import { authMiddleware } from '../middlewares/auth-middleware';

const Routes = (app: Express) => {
  app.use('/auth', AuthRouter);
  app.use('/journey', authMiddleware, JourneyRouter);
  app.get('/test', (req, res) => {
    res.json({
      success: true,
      message: 'Server is up and running',
    });
  });
};
export default Routes;
