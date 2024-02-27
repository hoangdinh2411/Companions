import { Express } from 'express';
import AuthRouter from './auth.router';

const Routes = (app: Express) => {
  app.use('/auth', AuthRouter);
};
export default Routes;
