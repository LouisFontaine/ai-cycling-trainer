import { Module } from '@nestjs/common';

// Application
import { INTERVALS_ICU_CLIENT } from '@application/services/intervals-icu-client.interface';
import { GetNextWorkoutUseCase } from '@application/use-cases/get-next-workout.use-case';

// Infrastructure
import { RepositoryModule } from '@infrastructure/database/repository.module';
import { IntervalsIcuClient } from '@infrastructure/http/intervals-icu/intervals-icu.client';

// Presentation
import { WorkoutController } from '@presentation/controllers/workout.controller';

@Module({
  imports: [RepositoryModule],
  controllers: [WorkoutController],
  providers: [
    // Use cases
    GetNextWorkoutUseCase,

    // Infrastructure -> Domain bindings
    {
      provide: INTERVALS_ICU_CLIENT,
      useClass: IntervalsIcuClient,
    },
  ],
})
export class WorkoutModule {}
