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

describe('POST /api/v1/auth/register', () => {
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

  it('should register a new user and return 201 with accessToken and user data', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(defaultTestUser)
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
    expect(response.body.accessToken.length).toBeGreaterThan(0);

    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: defaultTestUser.email,
        firstName: defaultTestUser.firstName,
        lastName: defaultTestUser.lastName,
      }),
    );
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).not.toHaveProperty('passwordHash');
    expect(response.body.user).not.toHaveProperty('password');
  });

  it('should return a valid JWT token that works on GET /me', async () => {
    const registerRes = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(defaultTestUser)
      .expect(201);

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${registerRes.body.accessToken}`)
      .expect(200);
  });

  it('should lowercase and trim email, firstName, and lastName', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: '  Test@EXAMPLE.COM  ',
        firstName: '  JOHN  ',
        lastName: '  DOE  ',
        password: 'securePassword123',
      })
      .expect(201);

    expect(response.body.user.email).toBe('test@example.com');
    expect(response.body.user.firstName).toBe('john');
    expect(response.body.user.lastName).toBe('doe');
  });

  it('should accept minimum valid input (2-char names, 8-char password)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'min@example.com',
        firstName: 'ab',
        lastName: 'cd',
        password: '12345678',
      })
      .expect(201);

    expect(response.body.user.firstName).toBe('ab');
    expect(response.body.user.lastName).toBe('cd');
  });

  // ── Validation errors: missing fields (400) ──

  it.each([
    {
      field: 'email',
      body: { firstName: 'john', lastName: 'doe', password: 'securePassword123' },
      expectedMessage: 'email must be an email',
    },
    {
      field: 'firstName',
      body: { email: 'test@example.com', lastName: 'doe', password: 'securePassword123' },
      expectedMessage: 'firstName must be a string',
    },
    {
      field: 'lastName',
      body: { email: 'test@example.com', firstName: 'john', password: 'securePassword123' },
      expectedMessage: 'lastName must be a string',
    },
    {
      field: 'password',
      body: { email: 'test@example.com', firstName: 'john', lastName: 'doe' },
      expectedMessage: 'password must be a string',
    },
  ])('should return 400 when $field is missing', async ({ body, expectedMessage }) => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(body)
      .expect(400);

    expect(response.body.message).toContain(expectedMessage);
    expect(response.body.error).toBe('Bad Request');
  });

  // ── Validation errors: invalid values (400) ──

  it('should return 400 when email is invalid format', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'not-an-email',
        firstName: 'john',
        lastName: 'doe',
        password: 'securePassword123',
      })
      .expect(400);

    expect(response.body.message).toContain('email must be an email');
    expect(response.body.error).toBe('Bad Request');
  });

  it('should return 400 when firstName is too short', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        firstName: 'a',
        lastName: 'doe',
        password: 'securePassword123',
      })
      .expect(400);

    expect(response.body.message).toContain(
      'firstName must be longer than or equal to 2 characters',
    );
    expect(response.body.error).toBe('Bad Request');
  });

  it('should return 400 when firstName is too long', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        firstName: 'a'.repeat(51),
        lastName: 'doe',
        password: 'securePassword123',
      })
      .expect(400);

    expect(response.body.message).toContain(
      'firstName must be shorter than or equal to 50 characters',
    );
    expect(response.body.error).toBe('Bad Request');
  });

  it('should return 400 when lastName is too short', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        firstName: 'john',
        lastName: 'a',
        password: 'securePassword123',
      })
      .expect(400);

    expect(response.body.message).toContain(
      'lastName must be longer than or equal to 2 characters',
    );
    expect(response.body.error).toBe('Bad Request');
  });

  it('should return 400 when lastName is too long', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        firstName: 'john',
        lastName: 'a'.repeat(51),
        password: 'securePassword123',
      })
      .expect(400);

    expect(response.body.message).toContain(
      'lastName must be shorter than or equal to 50 characters',
    );
    expect(response.body.error).toBe('Bad Request');
  });

  it('should return 400 when password is too short', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        firstName: 'john',
        lastName: 'doe',
        password: 'short',
      })
      .expect(400);

    expect(response.body.message).toContain(
      'password must be longer than or equal to 8 characters',
    );
    expect(response.body.error).toBe('Bad Request');
  });

  it('should return 400 when password is too long', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        firstName: 'john',
        lastName: 'doe',
        password: 'a'.repeat(129),
      })
      .expect(400);

    expect(response.body.message).toContain(
      'password must be shorter than or equal to 128 characters',
    );
    expect(response.body.error).toBe('Bad Request');
  });

  it('should return 400 when body is empty', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({})
      .expect(400);

    expect(response.body.message).toContain('email must be an email');
    expect(response.body.error).toBe('Bad Request');
  });

  it('should return 400 when unknown fields are present', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        ...defaultTestUser,
        role: 'admin',
      })
      .expect(400);

    expect(response.body.message).toContain('property role should not exist');
    expect(response.body.error).toBe('Bad Request');
  });

  // ── Business logic errors ──

  it('should return 409 when email is already registered', async () => {
    await registerUser(app);

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(defaultTestUser)
      .expect(409);

    expect(response.body.message).toBe('Email already registered');
  });

  it('should return 409 for duplicate email regardless of casing', async () => {
    await registerUser(app);

    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        ...defaultTestUser,
        email: 'TEST@EXAMPLE.COM',
      })
      .expect(409);
  });
});
