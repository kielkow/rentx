import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;
describe('Refresh Token Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license ) 
        values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXX')
      `,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new refresh token', async () => {
    const authResponse = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { refresh_token } = authResponse.body;

    const response = await request(app).post('/refresh-token').send({
      token: refresh_token,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refresh_token');
  });

  it('should not be able to create a new refresh token with invalid token', async () => {
    const response = await request(app).post('/refresh-token').send({
      token: 'invalid-token',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Invalid token');
  });

  it('should not be able to create a new refresh token with a nonexist token', async () => {
    const authResponse = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { refresh_token } = authResponse.body;

    await connection.query(
      `DELETE FROM USERS_TOKENS WHERE refresh_token = '${refresh_token}'`,
    );

    const response = await request(app).post('/refresh-token').send({
      token: refresh_token,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('User refresh token does not exists');
  });
});
