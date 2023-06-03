import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import { Request, Response } from 'express';
import { AppDataSource } from './data-source';
import { Routes } from './routes';
import { User } from './entity/User';

import { morganConfig, port } from './config';

function handleError(error, req, res, next) {
  res.status(error.statusCode || 500).send({ message: error.message });
}

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(morgan(morganConfig));
    app.use(bodyParser.json());

    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        async (req: Request, res: Response, next: Function) => {
          try {
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
    app.listen(port);

    console.log(`Running on port ${port}`);
  })
  .catch((error) => console.log(error));

