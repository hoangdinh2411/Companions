import { json, urlencoded } from 'body-parser';
import express, { NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { logEvent } from './v1/helpers/log-helper';
import v1Router from './v1';
import timeout from 'connect-timeout';
import getUserIdMiddleware from './v1/middlewares/get-user-ip';
import helmet from 'helmet';

export const createServer = () => {
  const app = express();
  app
    .set('trust proxy', true)
    .disable('x-powered-by')
    .use(helmet())
    .use(timeout('30s'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(
      cors({
        origin: ['*'],
        credentials: true,
        allowedHeaders: 'Content-Type,Authorization',
        optionsSuccessStatus: 200,
      })
    )
    .use((req, res, next) => {
      res.header('Content-Type', 'application/json;charset=UTF-8');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      next();
    })
    .use(morgan('dev'))

    .use('/api/v1', getUserIdMiddleware, v1Router)
    .use('*', (req, res, next: NextFunction) => {
      return res.status(404).json({
        success: false,
        message: 'This route does not exist yet!',
        status: 404,
      });
    })
    .use((err: any, req: any, res: any, next: any) => {
      const status = err.status || 500;
      logEvent(err.message);
      res.status(status).json({
        success: false,
        message: err.message,
        status,
      });
    });
  return app;
};
