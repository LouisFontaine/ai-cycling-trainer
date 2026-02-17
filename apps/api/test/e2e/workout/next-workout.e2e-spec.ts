import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, closeTestApp, cleanDatabase } from '../helpers/test-app.helper';
import { getAuthToken } from '../helpers/auth.helper';
import { MockIntervalsIcuClient } from '../helpers/intervals-icu-mock.helper';
import { INTERVALS_ICU_CLIENT } from '../../../src/application/services/intervals-icu-client.interface';
import { IntervalsIcuEvent } from '../../../src/domain/types/intervals-icu.types';

const sampleEvent: IntervalsIcuEvent = {
  id: 1,
  name: 'Sweet Spot Intervals',
  description: '2x20min sweet spot with 5min rest',
  start_date_local: '2026-02-20T08:00:00',
  type: 'Ride',
  category: 'WORKOUT',
  moving_time: 5400,
  workout_doc: {
    steps: [
      { duration: 600, ramp: true, power: { start: 50, end: 75, units: '%ftp' } },
      { duration: 1200, power: { value: 92, units: '%ftp' } },
      { duration: 300, power: { value: 50, units: '%ftp' } },
      { duration: 1200, power: { value: 92, units: '%ftp' } },
      { duration: 600, ramp: true, power: { start: 75, end: 50, units: '%ftp' } },
    ],
  },
};

describe('GET /api/v1/workout/next', () => {
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
    mockClient.setSuccess();
    mockClient.setEvents([]);
  });

  async function connectIntervalsIcu(token: string): Promise<void> {
    mockClient.setSuccess({ name: 'Test Athlete' });
    await request(app.getHttpServer())
      .put('/api/v1/users/me/intervals-icu')
      .set('Authorization', `Bearer ${token}`)
      .send({ athleteId: 'i12345', apiKey: 'valid-api-key' })
      .expect(200);
  }

  // -- Happy path

  it('should return 200 with next workout when events exist', async () => {
    const token = await getAuthToken(app);
    await connectIntervalsIcu(token);
    mockClient.setEvents([sampleEvent]);

    const response = await request(app.getHttpServer())
      .get('/api/v1/workout/next')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.name).toBe('Sweet Spot Intervals');
    expect(response.body.description).toBe('2x20min sweet spot with 5min rest');
    expect(response.body.type).toBe('Ride');
    expect(response.body.durationMinutes).toBe(90);
    expect(response.body.scheduledDate).toBeDefined();
  });

  it('should return intervals with correct structure', async () => {
    const token = await getAuthToken(app);
    await connectIntervalsIcu(token);
    mockClient.setEvents([sampleEvent]);

    const response = await request(app.getHttpServer())
      .get('/api/v1/workout/next')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.intervals).toHaveLength(5);

    const warmup = response.body.intervals[0];
    expect(warmup.type).toBe('WARMUP');
    expect(warmup.durationSeconds).toBe(600);
    expect(warmup.isRamp).toBe(true);
    expect(warmup.powerStartPercent).toBe(50);
    expect(warmup.powerEndPercent).toBe(75);

    const work = response.body.intervals[1];
    expect(work.type).toBe('WORK');
    expect(work.powerTargetPercent).toBe(92);

    const rest = response.body.intervals[2];
    expect(rest.type).toBe('REST');

    const cooldown = response.body.intervals[4];
    expect(cooldown.type).toBe('COOLDOWN');
    expect(cooldown.isRamp).toBe(true);
  });

  it('should return 200 with empty body when no events are planned', async () => {
    const token = await getAuthToken(app);
    await connectIntervalsIcu(token);
    mockClient.setEvents([]);

    const response = await request(app.getHttpServer())
      .get('/api/v1/workout/next')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({});
  });

  // -- Error handling

  it('should return 422 when Intervals.icu is not connected', async () => {
    const token = await getAuthToken(app);

    const response = await request(app.getHttpServer())
      .get('/api/v1/workout/next')
      .set('Authorization', `Bearer ${token}`)
      .expect(422);

    expect(response.body.message).toContain('not connected');
  });

  it('should return 401 when no token is provided', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/workout/next')
      .expect(401);
  });

  it('should return 401 with an invalid token', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/workout/next')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });
});
