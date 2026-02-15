import { Module } from '@nestjs/common';

// Application
import { INTERVALS_ICU_CLIENT } from '@application/services/intervals-icu-client.interface';
import { ConnectIntervalsIcuUseCase } from '@application/use-cases/connect-intervals-icu.use-case';
import { DisconnectIntervalsIcuUseCase } from '@application/use-cases/disconnect-intervals-icu.use-case';
import { GetIntervalsIcuStatusUseCase } from '@application/use-cases/get-intervals-icu-status.use-case';

// Infrastructure
import { RepositoryModule } from '@infrastructure/database/repository.module';
import { IntervalsIcuClient } from '@infrastructure/http/intervals-icu/intervals-icu.client';

// Presentation
import { UserController } from '@presentation/controllers/user.controller';

@Module({
  imports: [RepositoryModule],
  controllers: [UserController],
  providers: [
    // Use cases
    ConnectIntervalsIcuUseCase,
    DisconnectIntervalsIcuUseCase,
    GetIntervalsIcuStatusUseCase,

    // Infrastructure -> Domain bindings
    {
      provide: INTERVALS_ICU_CLIENT,
      useClass: IntervalsIcuClient,
    },
  ],
})
export class IntervalsIcuModule {}
