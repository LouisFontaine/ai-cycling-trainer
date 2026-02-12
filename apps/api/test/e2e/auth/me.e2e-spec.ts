import request from 'supertest';
import jwt from 'jsonwebtoken';
import { INestApplication } from '@nestjs/common';
import {
  createTestApp,
  closeTestApp,
  cleanDatabase,
} from '../helpers/test-app.helper';
import {
  defaultTestUser,
  registerUser,
  getAuthToken,
  TestUser,
} from '../helpers/auth.helper';

describe('GET /api/v1/auth/me', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  afterEach(async () => {
    await cleanDatabase();
  });

  // ── Happy path ──

  it('should return 200 with user data for authenticated user', async () => {
    const { accessToken, user: registeredUser } = await registerUser(app);

    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual({
      id: registeredUser.id,
      email: registeredUser.email,
      firstName: registeredUser.firstName,
      lastName: registeredUser.lastName,
    });
  });

  it('should not return passwordHash or sensitive fields in the response', async () => {
    const token = await getAuthToken(app);

    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).not.toHaveProperty('passwordHash');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('intervalsIcuApiKey');
  });

  it('should return the correct user when multiple users exist', async () => {
    const userA: TestUser = {
      email: 'usera@example.com',
      firstName: 'alice',
      lastName: 'smith',
      password: 'passwordA123',
    };
    const userB: TestUser = {
      email: 'userb@example.com',
      firstName: 'bob',
      lastName: 'jones',
      password: 'passwordB123',
    };

    const { accessToken: tokenA } = await registerUser(app, userA);
    await registerUser(app, userB);

    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    expect(response.body.email).toBe(userA.email);
    expect(response.body.firstName).toBe(userA.firstName);
  });

  // ── Auth errors (401) ──

  it('should return 401 when no Authorization header is provided', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .expect(401);
  });

  it('should return 401 when Authorization header has no Bearer prefix', async () => {
    const token = await getAuthToken(app);

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', token)
      .expect(401);
  });

  it('should return 401 when token is malformed', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer not-a-valid-jwt-token')
      .expect(401);
  });

  it('should return 401 when token is expired', async () => {
    const expiredToken = jwt.sign(
      { sub: 'some-id', email: 'test@example.com' },
      'test-jwt-secret-for-e2e',
      { expiresIn: '0s' },
    );

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);
  });

  it('should return 401 when token is signed with wrong secret', async () => {
    const wrongSecretToken = jwt.sign(
      { sub: 'some-id', email: 'test@example.com' },
      'completely-wrong-secret',
      { expiresIn: '1h' },
    );

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${wrongSecretToken}`)
      .expect(401);
  });
});
