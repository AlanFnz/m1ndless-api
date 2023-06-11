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

describe('User API tests', () => {
  beforeEach(async () => {
    connection = await AppDataSource.initialize();
    await connection.synchronize(true);
    server = app.listen(port);
  });

  afterEach(async () => {
    try {
      await connection.close();
      await server.close();
    } catch (error) {
      console.error('Error closing resources:', error);
    }
  });

  it('should return an empty array when there are no users', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should successfully create a user and return the created user', async () => {
    const response = await request(app).post('/users').send(testUser);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject(testUser);
  });

  it('should return a 400 status and an error when creating a user without a firstName', async () => {
    const response = await request(app)
      .post('/users')
      .send({ lastName: 'Doe', age: 33 });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0]).toMatchObject({
      location: 'body',
      msg: 'Invalid value',
      path: 'firstName',
      type: 'field',
    });
  });
});
