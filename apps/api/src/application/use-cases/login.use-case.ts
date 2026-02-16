import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import { InvalidCredentialsException } from '@domain/exceptions/domain.exception';
import { IPasswordHasher, PASSWORD_HASHER } from '@application/services/password-hasher.interface';
import { ITokenService, TOKEN_SERVICE } from '@application/services/token-service.interface';

interface LoginInput {
  email: string;
  password: string;
}

interface LoginOutput {
  accessToken: string;
  user: { id: string; email: string; firstName: string; lastName: string };
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await this.passwordHasher.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

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
