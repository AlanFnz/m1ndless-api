import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import { Request, Response } from 'express';
import { Routes } from './routes';
import { morganConfig } from './config';
import { validationResult } from 'express-validator';
import { HTTP_STATUS_CODES } from './constants';
import { handleError } from './middlewares/error-handling';

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

        const result = await new (route.controller as any)()[route.action](
          req,
          res,
          next
        );
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );
});

app.use(handleError);

export default app;
