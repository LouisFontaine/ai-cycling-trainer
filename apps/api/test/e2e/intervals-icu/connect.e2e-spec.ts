import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, closeTestApp, cleanDatabase } from '../helpers/test-app.helper';
import { getAuthToken } from '../helpers/auth.helper';
import { MockIntervalsIcuClient } from '../helpers/intervals-icu-mock.helper';
import { INTERVALS_ICU_CLIENT } from '../../../src/application/services/intervals-icu-client.interface';

describe('PUT /api/v1/users/me/intervals-icu', () => {
  let app: INestApplication;
  let mockClient: MockIntervalsIcuClient;

  beforeAll(async () => {
    mockClient = new MockIntervalsIcuClient();
    app = await createTestApp([{ token: INTERVALS_ICU_CLIENT, value: mockClient }]);
  });

  afterAll(async () => {
    await closeTestApp();
  });

  afterEach(async () => {
    await cleanDatabase();
    mockClient.setSuccess({ name: 'Test Athlete' });
  });

  it('should connect and return 200 with athlete name', async () => {
    const token = await getAuthToken(app);
    mockClient.setSuccess({ name: 'Lance Strong' });

    const response = await request(app.getHttpServer())
      .put('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .send({ athleteId: 'i12345', apiKey: 'valid-api-key' })
      .expect(200);

    expect(response.body).toEqual({ athleteName: 'Lance Strong' });
  });

  it('should persist credentials and be reflected in status', async () => {
    const token = await getAuthToken(app);
    mockClient.setSuccess({ name: 'Lance Strong' });

    await request(app.getHttpServer())
      .put('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .send({ athleteId: 'i12345', apiKey: 'valid-api-key' })
      .expect(200);

    const statusResponse = await request(app.getHttpServer())
      .get('/api/v1/users/me/intervals-icu/status')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(statusResponse.body.connected).toBe(true);
    expect(statusResponse.body.athleteId).toBe('i12345');
  });

  it('should allow updating credentials with a new athlete ID', async () => {
    const token = await getAuthToken(app);
    mockClient.setSuccess({ name: 'Athlete One' });

    await request(app.getHttpServer())
      .put('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .send({ athleteId: 'i11111', apiKey: 'key-1' })
      .expect(200);

    mockClient.setSuccess({ name: 'Athlete Two' });

    await request(app.getHttpServer())
      .put('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .send({ athleteId: 'i22222', apiKey: 'key-2' })
      .expect(200);

    const statusResponse = await request(app.getHttpServer())
      .get('/api/v1/users/me/intervals-icu/status')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(statusResponse.body.athleteId).toBe('i22222');
  });

  it('should return 400 when athleteId is missing', async () => {
    const token = await getAuthToken(app);

    await request(app.getHttpServer())
      .put('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .send({ apiKey: 'some-key' })
      .expect(400);
  });

  it('should return 400 when apiKey is missing', async () => {
    const token = await getAuthToken(app);

    await request(app.getHttpServer())
      .put('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .send({ athleteId: 'i12345' })
      .expect(400);
  });

  it('should return 400 when body is empty', async () => {
    const token = await getAuthToken(app);

    await request(app.getHttpServer())
      .put('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400);
  });

  it('should return 401 when no token is provided', async () => {
    await request(app.getHttpServer())
      .put('/api/v1/users/me/intervals-icu')
      .send({ athleteId: 'i12345', apiKey: 'some-key' })
      .expect(401);
  });

  it('should return 422 when Intervals.icu credentials are invalid', async () => {
    const token = await getAuthToken(app);
    mockClient.setFailure();

    const response = await request(app.getHttpServer())
      .put('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .send({ athleteId: 'i12345', apiKey: 'bad-key' })
      .expect(422);

    expect(response.body.message).toContain('Invalid Intervals.icu credentials');
  });

  it('should not save credentials when validation against Intervals.icu fails', async () => {
    const token = await getAuthToken(app);
    mockClient.setFailure();

    await request(app.getHttpServer())
      .put('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .send({ athleteId: 'i12345', apiKey: 'bad-key' })
      .expect(422);

    mockClient.setSuccess();

    const statusResponse = await request(app.getHttpServer())
      .get('/api/v1/users/me/intervals-icu/status')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(statusResponse.body.connected).toBe(false);
  });
});
