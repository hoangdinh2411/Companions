import { Express } from 'express';
import authRouter from './auth.router';
import journeyRouter from './journey.router';
import { authMiddleware } from '../middlewares/auth-middleware';
import deliveryOrderRouter from './deliveryOrder.router';

const Routes = (app: Express) => {
  app.use('/auth', authRouter);
  app.use('/journeys', journeyRouter);
  app.use('/delivery-orders', deliveryOrderRouter);
  app.get('/test', (req, res) => {
    res.json({
      success: true,
      message: 'Server is up and running',
    });
  });
};
export default Routes;
