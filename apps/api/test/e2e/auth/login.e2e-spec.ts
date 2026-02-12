import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
  createTestApp,
  closeTestApp,
  cleanDatabase,
} from '../helpers/test-app.helper';
import {
  defaultTestUser,
  registerUser,
} from '../helpers/auth.helper';

describe('POST /api/v1/auth/login', () => {
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

  it('should login with valid credentials and return accessToken and user', async () => {
    await registerUser(app);

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: defaultTestUser.email,
        password: defaultTestUser.password,
      })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: defaultTestUser.email,
        firstName: defaultTestUser.firstName,
        lastName: defaultTestUser.lastName,
      }),
    );
    expect(response.body.user).toHaveProperty('id');
  });

  it('should return a valid JWT token that works on GET /me', async () => {
    await registerUser(app);

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: defaultTestUser.email,
        password: defaultTestUser.password,
      })
      .expect(201);

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
      .expect(200);
  });

  it('should login with email in different casing', async () => {
    await registerUser(app);

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'TEST@EXAMPLE.COM',
        password: defaultTestUser.password,
      })
      .expect(201);

    expect(response.body.user.email).toBe(defaultTestUser.email);
  });

  it('should return the same user data as registration', async () => {
    const registerRes = await registerUser(app);

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: defaultTestUser.email,
        password: defaultTestUser.password,
      })
      .expect(201);

    expect(loginRes.body.user.id).toBe(registerRes.user.id);
    expect(loginRes.body.user.email).toBe(registerRes.user.email);
    expect(loginRes.body.user.firstName).toBe(registerRes.user.firstName);
    expect(loginRes.body.user.lastName).toBe(registerRes.user.lastName);
  });

  // ── Validation errors (400) ──

  it('should return 400 when email is missing', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ password: 'securePassword123' })
      .expect(400);
  });

  it('should return 400 when email is invalid format', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'not-an-email', password: 'securePassword123' })
      .expect(400);
  });

  it('should return 400 when password is missing', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com' })
      .expect(400);
  });

  it('should return 400 when body is empty', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({})
      .expect(400);
  });

  it('should return 400 when unknown fields are present', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'securePassword123',
        role: 'admin',
      })
      .expect(400);
  });

  // ── Business logic errors ──

  it('should return 401 when email does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'securePassword123',
      })
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return 401 when password is incorrect', async () => {
    await registerUser(app);

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: defaultTestUser.email,
        password: 'wrongPassword123',
      })
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return the same error shape for wrong email and wrong password', async () => {
    await registerUser(app);

    const wrongEmail = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'securePassword123',
      })
      .expect(401);

    const wrongPassword = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: defaultTestUser.email,
        password: 'wrongPassword123',
      })
      .expect(401);

    expect(wrongEmail.body.message).toBe(wrongPassword.body.message);
    expect(wrongEmail.body.statusCode).toBe(wrongPassword.body.statusCode);
  });
});
