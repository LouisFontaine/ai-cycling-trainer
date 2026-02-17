import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import {
  UserNotFoundException,
  IntervalsIcuNotConnectedException,
} from '@domain/exceptions/domain.exception';
import { WorkoutEntity } from '@domain/entities/workout.entity';
import {
  IIntervalsIcuClient,
  INTERVALS_ICU_CLIENT,
} from '@application/services/intervals-icu-client.interface';

interface GetNextWorkoutInput {
  userId: string;
}

@Injectable()
export class GetNextWorkoutUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(INTERVALS_ICU_CLIENT)
    private readonly intervalsIcuClient: IIntervalsIcuClient,
  ) {}

  async execute(input: GetNextWorkoutInput): Promise<WorkoutEntity | null> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    if (!user.intervalsIcuUserId || !user.intervalsIcuApiKey) {
      throw new IntervalsIcuNotConnectedException();
    }

    const today = new Date();
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const events = await this.intervalsIcuClient.getEvents(
      user.intervalsIcuUserId,
      user.intervalsIcuApiKey,
      today,
      in30Days,
    );

    if (events.length === 0) {
      return null;
    }

    return WorkoutEntity.fromIntervalsIcuEvent(events[0]);
  }
}
