import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import { UserNotFoundException } from '@domain/exceptions/domain.exception';

interface DisconnectInput {
  userId: string;
}

@Injectable()
export class DisconnectIntervalsIcuUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: DisconnectInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const updateData = user.disconnectFromIntervalsIcu();
    await this.userRepository.update(input.userId, updateData);
  }
}
