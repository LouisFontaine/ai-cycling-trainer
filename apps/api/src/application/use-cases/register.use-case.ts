import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import { EmailAlreadyExistsException } from '@domain/exceptions/domain.exception';
import { IPasswordHasher, PASSWORD_HASHER } from '@application/services/password-hasher.interface';
import { ITokenService, TOKEN_SERVICE } from '@application/services/token-service.interface';

interface RegisterInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface RegisterOutput {
  accessToken: string;
  user: { id: string; email: string; firstName: string; lastName: string };
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = await this.userRepository.create({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      passwordHash,
    });

    const accessToken = this.tokenService.generateToken({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
    };
  }
}
