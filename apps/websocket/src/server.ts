import { json, urlencoded } from 'body-parser';
import express, { NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import timeout from 'connect-timeout';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { logEvent } from './config/log-helper';

export const whitelist = [process.env.DOMAIN, 'http://localhost:3000'];

export const createServer = () => {
  const app = express();
  app
    .set('trust proxy', true)
    .disable('x-powered-by')
    .use(helmet())
    .use(timeout('30s'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cookieParser())
    .use(
      cors({
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          if (whitelist.indexOf(origin) === -1) {
            const msg =
              'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
          }
          return callback(null, true);
        },

        credentials: true,
        allowedHeaders: 'Content-Type',
        optionsSuccessStatus: 200,
        methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
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
