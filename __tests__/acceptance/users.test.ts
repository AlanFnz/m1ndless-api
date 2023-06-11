import app from '../../src/app';
import { port } from '../../src/config';
import { AppDataSource } from '../../src/data-source';
import * as request from 'supertest';

let connection, server;

const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  age: 33,
};

beforeEach(async () => {
  connection = await AppDataSource.initialize();
  await connection.synchronize(true);
  server = app.listen(port);
});

afterEach(async () => {
  connection.close();
  server.close();
});

it('should be no users initially', async () => {
  const response = await request(app).get('/users');
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([]);
});

it('should create a user', async () => {
  const response = await request(app).post('/users').send(testUser);
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ ...testUser, id: 1 });
});

it('should not create a user if no firstName is given', async () => {
  const response = await request(app)
    .post('/users')
    .send({ lastName: 'Doe', age: 33 });
  expect(response.statusCode).toBe(400);
  expect(response.body.errors).not.toBeNull();
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0]).toEqual({
    location: 'body',
    msg: 'Invalid value',
    path: 'firstName',
    type: 'field',
  });
});
