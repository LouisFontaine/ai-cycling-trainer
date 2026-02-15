import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, closeTestApp, cleanDatabase } from '../helpers/test-app.helper';
import { getAuthToken } from '../helpers/auth.helper';
import { MockIntervalsIcuClient } from '../helpers/intervals-icu-mock.helper';
import { INTERVALS_ICU_CLIENT } from '../../../src/application/services/intervals-icu-client.interface';

describe('DELETE /api/v1/users/me/intervals-icu', () => {
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

  it('should disconnect and return 204', async () => {
    const token = await getAuthToken(app);

    // First connect
    await request(app.getHttpServer())
      .put('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .send({ athleteId: 'i12345', apiKey: 'valid-key' })
      .expect(200);

    // Then disconnect
    await request(app.getHttpServer())
      .delete('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    // Verify disconnected
    const statusResponse = await request(app.getHttpServer())
      .get('/api/v1/users/me/intervals-icu/status')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(statusResponse.body.connected).toBe(false);
    expect(statusResponse.body.athleteId).toBeUndefined();
  });

  it('should return 204 even when not connected (idempotent)', async () => {
    const token = await getAuthToken(app);

    await request(app.getHttpServer())
      .delete('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return 401 when no token is provided', async () => {
    await request(app.getHttpServer())
      .delete('/api/v1/users/me/intervals-icu')
      .expect(401);
  });
});
