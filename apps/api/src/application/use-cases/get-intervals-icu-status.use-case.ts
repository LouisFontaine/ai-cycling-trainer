import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import { UserNotFoundException } from '@domain/exceptions/domain.exception';
import {
  IIntervalsIcuClient,
  INTERVALS_ICU_CLIENT,
} from '@application/services/intervals-icu-client.interface';

interface StatusInput {
  userId: string;
}

interface StatusOutput {
  connected: boolean;
  athleteId?: string;
  athleteName?: string;
}

@Injectable()
export class GetIntervalsIcuStatusUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(INTERVALS_ICU_CLIENT)
    private readonly intervalsIcuClient: IIntervalsIcuClient,
  ) {}

  async execute(input: StatusInput): Promise<StatusOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    if (!user.intervalsIcuUserId || !user.intervalsIcuApiKey) {
      return { connected: false };
    }

    try {
      const athlete = await this.intervalsIcuClient.getAthlete(
        user.intervalsIcuUserId,
        user.intervalsIcuApiKey,
      );
      return {
        connected: true,
        athleteId: user.intervalsIcuUserId,
        athleteName: athlete.name,
      };
    } catch {
      return {
        connected: false,
        athleteId: user.intervalsIcuUserId,
      };
    }
  }
}
