import request from 'supertest';
import { INestApplication } from '@nestjs/common';

export interface TestUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export const defaultTestUser: TestUser = {
  email: 'test@example.com',
  firstName: 'john',
  lastName: 'doe',
  password: 'securePassword123',
};

export async function registerUser(
  app: INestApplication,
  userData: TestUser = defaultTestUser,
): Promise<{
  accessToken: string;
  user: { id: string; email: string; firstName: string; lastName: string };
}> {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/register')
    .send(userData)
    .expect(201);

  return response.body;
}

export async function getAuthToken(
  app: INestApplication,
  userData: TestUser = defaultTestUser,
): Promise<string> {
  const result = await registerUser(app, userData);
  return result.accessToken;
}
