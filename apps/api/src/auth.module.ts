import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

// Application
import { RegisterUseCase } from '@application/use-cases/register.use-case';
import { LoginUseCase } from '@application/use-cases/login.use-case';
import { PASSWORD_HASHER } from '@application/services/password-hasher.interface';
import { TOKEN_SERVICE } from '@application/services/token-service.interface';

// Infrastructure
import { RepositoryModule } from '@infrastructure/database/repository.module';
import { BcryptPasswordHasher } from '@infrastructure/auth/bcrypt-password-hasher';
import { JwtTokenService } from '@infrastructure/auth/jwt-token.service';
import { JwtStrategy } from '@infrastructure/auth/jwt.strategy';

// Presentation
import { AuthController } from '@presentation/controllers/auth.controller';

@Module({
  imports: [
    RepositoryModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION', '1d') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use cases
    RegisterUseCase,
    LoginUseCase,

    // Infrastructure -> Domain bindings (Dependency Inversion)
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },

    // Passport strategy
    JwtStrategy,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
