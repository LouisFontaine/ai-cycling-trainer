import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import { UserNotFoundException } from '@domain/exceptions/domain.exception';
import {
  IIntervalsIcuClient,
  INTERVALS_ICU_CLIENT,
} from '@application/services/intervals-icu-client.interface';

interface ConnectInput {
  userId: string;
  athleteId: string;
  apiKey: string;
}

interface ConnectOutput {
  athleteName: string;
}

@Injectable()
export class ConnectIntervalsIcuUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(INTERVALS_ICU_CLIENT)
    private readonly intervalsIcuClient: IIntervalsIcuClient,
  ) {}

  async execute(input: ConnectInput): Promise<ConnectOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const athlete = await this.intervalsIcuClient.getAthlete(input.athleteId, input.apiKey);

    const updateData = user.connectIntervalsIcu(input.athleteId, input.apiKey);
    await this.userRepository.update(input.userId, updateData);

    return { athleteName: athlete.name };
  }
}
