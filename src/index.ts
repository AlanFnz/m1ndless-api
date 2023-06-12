import { AppDataSource } from './dataSource';
import { port } from './config';
import app from './app';

AppDataSource.initialize()
  .then(async () => {
    app.listen(port);
    console.log(`Running on port ${port}`);
  })
  .catch((error) => console.log(error));

