import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import { PrismaUserRepository } from './repositories/prisma-user.repository';

@Module({
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class RepositoryModule {}
