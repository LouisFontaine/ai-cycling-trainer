import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
        },
        diagnostics: false,
      },
    ],
  },
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/node_modules'],
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@ai-cycling-trainer/shared-types$': '<rootDir>/../../packages/shared-types/src',
    '^@ai-cycling-trainer/shared-utils$': '<rootDir>/../../packages/shared-utils/src',
  },
  testTimeout: 30000,
};

export default config;
