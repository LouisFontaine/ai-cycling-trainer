import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, closeTestApp, cleanDatabase } from '../helpers/test-app.helper';
import { getAuthToken } from '../helpers/auth.helper';
import { MockIntervalsIcuClient } from '../helpers/intervals-icu-mock.helper';
import { INTERVALS_ICU_CLIENT } from '../../../src/application/services/intervals-icu-client.interface';

describe('GET /api/v1/users/me/intervals-icu/status', () => {
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

  it('should return disconnected status when user has no credentials', async () => {
    const token = await getAuthToken(app);

    const response = await request(app.getHttpServer())
      .get('/api/v1/users/me/intervals-icu/status')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({ connected: false });
  });

  it('should return connected status with athlete info when connected', async () => {
    const token = await getAuthToken(app);
    mockClient.setSuccess({ name: 'Pro Cyclist' });

    await request(app.getHttpServer())
      .put('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .send({ athleteId: 'i99999', apiKey: 'valid-key' })
      .expect(200);

    const response = await request(app.getHttpServer())
      .get('/api/v1/users/me/intervals-icu/status')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.connected).toBe(true);
    expect(response.body.athleteId).toBe('i99999');
    expect(response.body.athleteName).toBe('Pro Cyclist');
  });

  it('should return disconnected when stored credentials are no longer valid', async () => {
    const token = await getAuthToken(app);
    mockClient.setSuccess({ name: 'Athlete' });

    await request(app.getHttpServer())
      .put('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .send({ athleteId: 'i12345', apiKey: 'key-that-will-expire' })
      .expect(200);

    mockClient.setFailure();

    const response = await request(app.getHttpServer())
      .get('/api/v1/users/me/intervals-icu/status')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.connected).toBe(false);
    expect(response.body.athleteId).toBe('i12345');
  });

  it('should return 401 when no token is provided', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/users/me/intervals-icu/status')
      .expect(401);
  });
});
