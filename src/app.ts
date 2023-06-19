import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import express from 'express';
import { Request, Response } from 'express';
import { Routes } from './routes';
import { morganConfig } from './config';
import { validationResult } from 'express-validator';
import { HTTP_STATUS_CODES } from './constants';
import { handleError } from './middlewares/error-handler';
import { errorHandler } from './middlewares/error-handler/error-handler';

const app = express();
app.use(morgan(morganConfig));
app.use(bodyParser.json());

Routes.forEach((route) => {
  (app as any)[route.method](
    route.route,
    ...route.validation,
    async (req: Request, res: Response, next: Function) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(HTTP_STATUS_CODES.BAD_REQUEST)
            .json({ errors: errors.array() });
        }

        await new (route.controller as any)()[route.action](req, res, next);
      } catch (error) {
        next(error);
      }
    }
  );
});

app.use(handleError);

process.on('uncaughtException', async (error: Error) => {
  await errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) process.exit(1); //TODO: make sure to implement the restart
});

process.on('unhandledRejection', (reason: Error) => {
  throw reason;
});

export default app;
