import { json, urlencoded } from "body-parser";
import express, { NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import createHttpError from "http-errors";
import { logEvent } from "./v1/helpers/log-helper";
import v1Router from "./v1";
export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(
      cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
        allowedHeaders: "Content-Type,Authorization",
        optionsSuccessStatus: 200,
      })
    )
    .use((req, res, next) => {
      res.header("Content-Type", "application/json;charset=UTF-8");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    })
    .use(morgan("dev"))

    .use("/api/v1", v1Router)
    .use("*", (req, res, next: NextFunction) => {
      next(createHttpError.NotFound("This router does not exist."));
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
