import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const TEST_DB_NAME = 'test.db';
const PRISMA_DIR = path.join(__dirname, '..', '..', '..', 'prisma');
const TEST_DB_PATH = path.join(PRISMA_DIR, TEST_DB_NAME);
const TEST_DATABASE_URL = `file:${TEST_DB_PATH}`;

let app: INestApplication;
let prismaService: PrismaService;

export async function createTestApp(): Promise<INestApplication> {
  // Set test environment variables before module creation
  process.env.DATABASE_URL = TEST_DATABASE_URL;
  process.env.JWT_SECRET = 'test-jwt-secret-for-e2e';
  process.env.JWT_EXPIRATION = '1h';

  // Run Prisma migrations to create/update the test database
  execSync('npx prisma migrate deploy', {
    cwd: path.join(__dirname, '..', '..', '..'),
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
    stdio: 'pipe',
  });

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();

  // Mirror main.ts global configuration (lines 14-33)
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.init();

  prismaService = app.get(PrismaService);

  return app;
}

export async function cleanDatabase(): Promise<void> {
  await prismaService.user.deleteMany();
}

export async function closeTestApp(): Promise<void> {
  if (app) {
    await app.close();
  }
  // Remove the test database files
  try {
    fs.unlinkSync(TEST_DB_PATH);
  } catch {
    // File may not exist
  }
  try {
    fs.unlinkSync(TEST_DB_PATH + '-journal');
  } catch {
    // File may not exist
  }
}

export function getApp(): INestApplication {
  return app;
}

export function getPrismaService(): PrismaService {
  return prismaService;
}
