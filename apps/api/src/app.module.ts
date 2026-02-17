import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { DomainExceptionFilter } from '@presentation/filters/domain-exception.filter';
import { AuthModule } from './auth.module';
import { IntervalsIcuModule } from './intervals-icu.module';
import { WorkoutModule } from './workout.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    IntervalsIcuModule,
    WorkoutModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class AppModule {}
