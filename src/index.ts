import { AppDataSource } from './dataSource';
import { port } from './config';
import app from './app';
import { logger } from './middlewares/logger';

AppDataSource.initialize()
  .then(async () => {
    app.listen(port);
    logger.info(`Running on port ${port}`);
  })
  .catch((error) => console.log(error));

logger.info('Initialization started');

